/**
 * The campaign's simulation: for each node, what the player owns on reaching it, every party the node allows
 * (sampled when there are many), sensible kits and formations, a short climb from the best, and the numbers
 * that say whether the node is a fair puzzle: the best build's wins, how many builds win, and whether the
 * party that cleared the last node still does.
 *
 *   npm run campaign [-- --nodes 1-5] [--builds 360] [--climb 48] [--workers N] [--tune] [--target 0.85]
 *   npm run campaign -- --log <node> [--seed N]     print the best build's run for one node
 *
 * Output: a table on screen, and out/campaign/results.json (every node's numbers and best builds).
 * Bundled by esbuild like the study runner, so worker threads can load it.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { availableParallelism } from "node:os";
import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";
import { campaign, ownedAt, rewardsOf, simPick } from "./campaign.js";
import { combat } from "./engine/combat/rules.js";
import { playerView, printLog } from "./engine/log.js";
import { loadContent, play, type Content } from "./engine/run.js";
import { next, rngFor, type Rng } from "./engine/rng.js";
import type { FoesT, Party } from "./schema.js";
import { knobFoes, type Knob } from "../content/core-set/campaign.js";
import { combos, current, describe, makeBuild, seat, STYLES, trios, fitting, type Style } from "./sim/kits.js";
import { partyKey } from "./sim/parties.js";
import { checkParty } from "./validate.js";
import { readingPack } from "./sim/feel.js";
import { patch } from "./sim/content.js";
import { needText } from "./campaign.js";

/** A batch of runs. `foes`/`bossFoes` replace the dungeon's (null: none); `mobOnly` plays its regular fights alone. */
type Job = { id: number; dungeon: string; party: Party; seeds: number[]; foes?: FoesT | null; bossFoes?: FoesT | null; mobOnly?: boolean };
type Out = { id: number; wins: number; progress: number; lost: Record<string, number>; ticks: number };

const args = process.argv.slice(2);
const opt = (name: string) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const PACK = opt("--pack") ?? "content/core-set.pack.json";
const KNOBS = "content/core-set/campaign-knobs.json";

function runJob(c: Content, job: Job): Out {
  const d = c.dungeons.get(job.dungeon)!;
  const copy = { ...d };
  if (job.foes !== undefined) copy.foes = job.foes ?? undefined;
  if (job.bossFoes !== undefined) copy.bossFoes = job.bossFoes ?? undefined;
  if (job.mobOnly) {
    // The regular fights, and the campfire among them; never a campfire last.
    copy.stages = d.stages.filter((s) => !(s.kind === "fight" && s.boss));
    while (copy.stages.length && copy.stages[copy.stages.length - 1].kind !== "fight") copy.stages = copy.stages.slice(0, -1);
  }
  c.dungeons.set(job.dungeon, copy);
  const stages = copy.stages;
  let wins = 0, progress = 0, ticks = 0;
  const lost: Record<string, number> = {};
  for (const seed of job.seeds) {
    const run = play(c, combat, { dungeon: job.dungeon, party: job.party, seed, firstClear: true }, simPick, { checked: true });
    if (run.outcome === "won") wins++;
    else {
      const st = stages[Math.min(run.stage, stages.length - 1)];
      lost[st.id] = (lost[st.id] ?? 0) + 1;
    }
    progress += run.stage;
    ticks += run.fight?.round ?? 0;
  }
  c.dungeons.set(job.dungeon, d);
  return { id: job.id, wins, progress, lost, ticks };
}


// ─── The pool ───────────────────────────────────────────────────────────────

class Pool {
  private workers: Worker[] = [];
  private idle: Worker[] = [];
  private queue: { job: Job; done: (o: Out) => void }[] = [];
  private waiting = new Map<Worker, (o: Out) => void>();
  private local: Content | null = null;
  runs = 0;
  constructor(raw: unknown, n: number) {
    if (n <= 1 || import.meta.url.endsWith(".ts")) this.local = loadContent(raw);
    else for (let i = 0; i < n; i++) {
      const w = new Worker(new URL(import.meta.url), { workerData: { raw } });
      w.on("message", (o: Out) => {
        const done = this.waiting.get(w)!;
        this.waiting.delete(w);
        this.idle.push(w);
        this.pump();
        done(o);
      });
      w.on("error", (e) => { throw e; });
      this.workers.push(w);
      this.idle.push(w);
    }
  }
  run(job: Omit<Job, "id">): Promise<Out> {
    this.runs += job.seeds.length;
    if (this.local) return Promise.resolve(runJob(this.local, { ...job, id: 0 }));
    return new Promise((done) => {
      this.queue.push({ job: { ...job, id: 0 }, done });
      this.pump();
    });
  }
  private pump() {
    while (this.idle.length && this.queue.length) {
      const w = this.idle.pop()!;
      const { job, done } = this.queue.shift()!;
      this.waiting.set(w, done);
      w.postMessage(job);
    }
  }
  close() {
    for (const w of this.workers) void w.terminate();
  }
}

// ─── The search ─────────────────────────────────────────────────────────────

type Rated = { party: Party; key: string; wins: number; n: number; progress: number; lost: Record<string, number> };
export type NodeResult = {
  n: number;
  id: string;
  name: string;
  dungeon: string;
  owned: { classes: number; formations: number; gear: number };
  newest: string[];
  builds: number;
  screenSeeds: number;
  /** Shares of screened builds that won at least half, and nearly all, their screening runs. */
  winHalf: number;
  winMost: number;
  median: number;
  top: { label: string; rate: number; n: number }[];
  best: { label: string; party: Party; rate: number; n: number; lost: Record<string, number> };
  /** The newest unlock's share of the top ten builds. */
  newestInTop: number;
  /** The last node's best build, kept as far as the needs allow and re-kitted from what's owned now. */
  carry: { label: string; rate: number } | null;
  foes: FoesT | null;
  bossFoes: FoesT | null;
  /** The difficulty knobs the node was searched at, for its regular fights and its boss (see content/core-set/campaign.ts). */
  knob?: Knob;
  /** The best builds found, for the tuner. */
  cands: Party[];
  /** Mean screening win rate of builds with each class or formation, and without it: what each is worth here. */
  effect: Record<string, { with: number; without: number; n: number }>;
  runs: number;
  ms: number;
};

const seedsFrom = (start: number, n: number) => Array.from({ length: n }, (_, i) => start + i);

function shuffle<T>(xs: T[], seed: number): T[] {
  const rng = rngFor(seed, "shuffle");
  const out = xs.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next(rng) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

async function searchNode(c: Content, pool: Pool, i: number, o: { builds: number; climb: number; foes?: FoesT | null; bossFoes?: FoesT | null; carryFrom?: Party | null }): Promise<NodeResult> {
  const t0 = performance.now();
  const runs0 = pool.runs;
  const cp = campaign(c);
  const node = cp.nodes[i];
  const owned = ownedAt(c, i);
  const needs = node.needs;
  const dungeon = node.dungeon;
  const size = c.dungeons.get(dungeon)!.partySize.max;
  const forced = needs.find((nd) => "formation" in nd) as { formation: string } | undefined;
  const forms = forced ? [forced.formation] : owned.formations;
  const legal = (p: Party | null): p is Party => !!p && !checkParty(c.pack, p, { dungeon }).some((x) => x.level === "error");
  const rng = rngFor(9000 + i, "climb");
  const ev = async (p: Party, seeds: number[]) => {
    const r = await pool.run({ dungeon, party: p, seeds, foes: o.foes, bossFoes: o.bossFoes });
    return r;
  };

  const builds = buildSpace(c, i, o.builds);

  // Screen every build on a few seeds, then look harder at the best.
  const S1 = seedsFrom(1, 6);
  const screened: Rated[] = await Promise.all(builds.map(async (p) => {
    const r = await ev(p, S1);
    return { party: p, key: partyKey(p), wins: r.wins, n: S1.length, progress: r.progress, lost: r.lost };
  }));
  const byRate = (a: Rated, b: Rated) => b.wins / b.n - a.wins / a.n || b.progress / b.n - a.progress / a.n;
  screened.sort(byRate);
  const S2 = seedsFrom(7, 18);
  const top: Rated[] = await Promise.all(screened.slice(0, 20).map(async (x) => {
    const r = await ev(x.party, S2);
    return { ...x, wins: x.wins + r.wins, n: x.n + S2.length, progress: x.progress + r.progress, lost: merge(x.lost, r.lost) };
  }));
  top.sort(byRate);

  // Climb: small changes to the best builds, each judged on the same seeds as its parent.
  const S3 = seedsFrom(101, 16);
  const cache = new Map<string, number>();
  const rate = async (p: Party) => {
    const k = partyKey(p);
    if (!cache.has(k)) {
      const r = await ev(p, S3);
      cache.set(k, r.wins / S3.length + r.progress / S3.length / 1000);
    }
    return cache.get(k)!;
  };
  let pool3 = top.slice(0, 3).map((x) => x.party);
  let bestP = pool3[0];
  let bestR = bestP ? await rate(bestP) : 0;
  for (const p of pool3.slice(1)) {
    const r = await rate(p);
    if (r > bestR) (bestR = r), (bestP = p);
  }
  for (let step = 0; step < o.climb && bestP; step++) {
    const parent = pool3[step % pool3.length];
    const child = mutate(c, parent, owned, needs, forms, rng);
    if (!legal(child)) continue;
    const r = await rate(child);
    const pr = await rate(parent);
    if (r > pr) pool3[step % pool3.length] = child;
    if (r > bestR) (bestR = r), (bestP = child);
  }

  // The best, on fresh seeds.
  const S4 = seedsFrom(1001, 48);
  const fin = bestP ? await ev(bestP, S4) : null;
  const carry = o.carryFrom ? carryOver(c, o.carryFrom, owned, needs, forms, size) : null;
  const carryR = carry && legal(carry) ? await ev(carry, S2) : null;
  const prev = i > 0 ? rewardsOf(c, i - 1) : null;
  const newest = prev ? [...prev.classes, ...prev.formations] : [];
  const has = (p: Party, id: string) => p.formation === id || p.units.some((u) => u.class === id);
  const top10 = top.slice(0, 10);
  const rates = screened.map((x) => x.wins / x.n).sort((a, b) => a - b);
  return {
    n: i + 1, id: node.id, name: node.name, dungeon,
    owned: { classes: owned.classes.length, formations: owned.formations.length, gear: owned.gear.length },
    newest,
    builds: builds.length, screenSeeds: S1.length,
    winHalf: rates.filter((r) => r >= 0.5).length / Math.max(1, rates.length),
    winMost: rates.filter((r) => r >= 5 / 6).length / Math.max(1, rates.length),
    median: rates.length ? rates[Math.floor(rates.length / 2)] : 0,
    top: top10.map((x) => ({ label: describe(c, x.party), rate: x.wins / x.n, n: x.n })),
    best: bestP && fin ? { label: describe(c, bestP), party: bestP, rate: fin.wins / S4.length, n: S4.length, lost: fin.lost } : { label: "none", party: { formation: "neutral", units: [] }, rate: 0, n: 0, lost: {} },
    newestInTop: newest.length && top10.length ? top10.filter((x) => newest.some((id) => has(x.party, id))).length / top10.length : 0,
    carry: carry && carryR ? { label: describe(c, carry), rate: carryR.wins / S2.length } : null,
    foes: o.foes ?? c.dungeons.get(dungeon)!.foes ?? null,
    bossFoes: o.bossFoes ?? c.dungeons.get(dungeon)!.bossFoes ?? null,
    cands: [...(bestP ? [bestP] : []), ...top.slice(0, 8).map((x) => x.party)],
    effect: effects(screened),
    runs: pool.runs - runs0,
    ms: performance.now() - t0,
  };
}

/** Every combination of party, formation and style a node allows, sampled down to the budget, kitted and checked. */
function buildSpace(c: Content, i: number, budget: number): Party[] {
  const node = campaign(c).nodes[i];
  const owned = ownedAt(c, i);
  const needs = node.needs;
  const dungeon = node.dungeon;
  const size = c.dungeons.get(dungeon)!.partySize.max;
  const forced = needs.find((nd) => "formation" in nd) as { formation: string } | undefined;
  const forms = forced ? [forced.formation] : owned.formations;
  const space: { t: string[]; f: string; s: Style }[] = [];
  // Parties whose members can't all meet the armor or weapon needs are dropped before sampling, so a narrow need doesn't empty the sample.
  const can = (t: string[]) => t.every((cls) => makeBuild(c, [cls], forms[0], "plain", owned, needs) !== null);
  for (const t of trios(owned, needs, size).filter(can)) for (const f of forms) for (const s of STYLES) space.push({ t, f, s });
  const picked = space.length > budget ? shuffle(space, 4242 + i).slice(0, budget) : space;
  const seen = new Set<string>();
  const builds: Party[] = [];
  for (const x of picked) {
    const p = makeBuild(c, x.t, x.f, x.s, owned, needs);
    if (!p || checkParty(c.pack, p, { dungeon }).some((e) => e.level === "error")) continue;
    const k = partyKey(p);
    if (seen.has(k)) continue;
    seen.add(k);
    builds.push(p);
  }
  return builds;
}

function effects(xs: Rated[]): NodeResult["effect"] {
  const out: NodeResult["effect"] = {};
  const ids = new Set(xs.flatMap((x) => [x.party.formation, ...x.party.units.map((u) => u.class)]));
  const has = (p: Party, id: string) => p.formation === id || p.units.some((u) => u.class === id);
  for (const id of ids) {
    const a = xs.filter((x) => has(x.party, id)), b = xs.filter((x) => !has(x.party, id));
    const mean = (ys: Rated[]) => (ys.length ? ys.reduce((t, y) => t + y.wins / y.n, 0) / ys.length : NaN);
    out[id] = { with: mean(a), without: mean(b), n: a.length };
  }
  return out;
}

const merge = (a: Record<string, number>, b: Record<string, number>) => {
  const out = { ...a };
  for (const k in b) out[k] = (out[k] ?? 0) + b[k];
  return out;
};

function mutate(c: Content, p: Party, owned: ReturnType<typeof ownedAt>, needs: import("./schema.js").NeedT[], forms: string[], rng: Rng): Party | null {
  const pick = <T>(xs: readonly T[]) => xs[Math.floor(next(rng) * xs.length)];
  const classes = p.units.map((u) => u.class);
  const inc = needs.flatMap((nd) => ("includes" in nd ? nd.includes : []));
  const exc = needs.flatMap((nd) => ("excludes" in nd ? nd.excludes : []));
  const style = pick(STYLES);
  const what = Math.floor(next(rng) * 5);
  if (what === 0) {
    const out = classes.filter((x) => !inc.includes(x));
    const pool = owned.classes.filter((x) => !classes.includes(x) && !exc.includes(x));
    if (!out.length || !pool.length) return null;
    const drop = pick(out);
    const t = classes.map((x) => (x === drop ? pick(pool) : x));
    return makeBuild(c, t, p.formation, style, owned, needs);
  }
  if (what === 1) {
    if (forms.length < 2) return null;
    return makeBuild(c, classes, pick(forms.filter((f) => f !== p.formation)), style, owned, needs);
  }
  if (what === 2) {
    const order = combos(classes, classes.length)[0];
    const shuffled = shuffle(order, Math.floor(next(rng) * 1e9));
    const f = c.formations.get(p.formation)!;
    return { formation: p.formation, units: shuffled.map((cls, i) => ({ ...p.units.find((u) => u.class === cls)!, position: f.positions[i].id })) };
  }
  if (what === 3) {
    const u = Math.floor(next(rng) * p.units.length);
    const slot = pick(["weapon", "armor", "amulet"]);
    const fits = fitting(c, p.units[u].class, slot, owned, needs);
    const mustArmor = needs.some((nd) => "armor" in nd && nd.armor !== "none");
    const options = [...fits, ...(slot !== "weapon" && !(slot === "armor" && mustArmor) ? [""] : [])].filter((g) => g !== (p.units[u].gear[slot] ?? ""));
    if (!options.length) return null;
    const g = pick(options);
    const units = p.units.map((x, i) => (i === u ? { ...x, gear: { ...x.gear } } : x));
    if (g) units[u].gear[slot] = g;
    else delete units[u].gear[slot];
    return { formation: p.formation, units };
  }
  const u = Math.floor(next(rng) * p.units.length);
  const ab = p.units[u].abilities;
  const rot = shuffle(ab, Math.floor(next(rng) * 1e9));
  return { formation: p.formation, units: p.units.map((x, i) => (i === u ? { ...x, abilities: rot } : x)) };
}

/** The last node's best party, kept as far as this node allows: required classes swapped in for the last members, its formation if still allowed. */
function carryOver(c: Content, prev: Party, owned: ReturnType<typeof ownedAt>, needs: import("./schema.js").NeedT[], forms: string[], size: number): Party | null {
  const inc = needs.flatMap((nd) => ("includes" in nd ? nd.includes : []));
  const exc = needs.flatMap((nd) => ("excludes" in nd ? nd.excludes : []));
  let classes = prev.units.map((u) => u.class).filter((x) => !exc.includes(x));
  for (const x of inc) if (!classes.includes(x)) classes = [...classes.filter((y) => inc.includes(y) || classes.indexOf(y) < size - 1 - inc.filter((z) => !classes.includes(z)).length + 1), x];
  classes = [...new Set([...inc, ...classes])].slice(0, size);
  for (const x of owned.classes) if (classes.length < size && !classes.includes(x) && !exc.includes(x)) classes.push(x);
  const f = forms.includes(prev.formation) ? prev.formation : forms[0];
  return makeBuild(c, classes, f, "plain", owned, needs, seat(c, classes, f, "plain"));
}

// ─── Tuning ─────────────────────────────────────────────────────────────────

/**
 * Finds the node's two knobs (pacing pass). First its regular fights alone (the boss and the campfire left out): the
 * hardest foes at which a good share of the sensible builds (`mobShare`, about two and a half times the node's share)
 * still win half their runs of them, and the best builds nearly always do (`mobTarget`), so the regular fights wear a
 * party down and stop some. Then, with those fixed, the boss on full runs: the hardest boss at which `share` of the
 * builds win half their runs and the best win `target`. Each is a bisection; then a search at the knobs for the report,
 * and the fresh-seed check eases the boss until the best build holds the target.
 */
async function tuneNode(c: Content, pool: Pool, i: number, o: { builds: number; climb: number; target: number; share: number; knob: Knob; carryFrom: Party | null }) {
  const node = campaign(c).nodes[i];
  const d = c.dungeons.get(node.dungeon)!;
  const { hp: _h, power: _p, ...base } = d.foes ?? {};
  const foesAt = (k: number): FoesT | null => {
    const f = { ...base, ...knobFoes(k) };
    return Object.keys(f).length ? f : null;
  };
  const builds = buildSpace(c, i, o.builds);
  const S1 = seedsFrom(1, 6), S2 = seedsFrom(5001, 24);
  /** Whether the `share`-th best build wins half its runs and the best of the top 8 wins `target`, for these runs. */
  const check = async (job: Omit<Job, "id" | "party" | "seeds">, share: number, target: number) => {
    const rs = await Promise.all(builds.map((p) => pool.run({ ...job, party: p, seeds: S1 })));
    const rated = rs.map((r, j) => ({ j, rate: r.wins / S1.length, prog: r.progress })).sort((a, b) => b.rate - a.rate || b.prog - a.prog);
    const q = rated[Math.max(0, Math.ceil(rated.length * share) - 1)]?.rate ?? 0;
    if (q < 0.5) return false;
    const best = await Promise.all(rated.slice(0, 8).map((x) => pool.run({ ...job, party: builds[x.j], seeds: S2 })));
    return Math.max(...best.map((x) => x.wins / S2.length)) >= target;
  };
  const bisect = async (k0: number, ok: (k: number) => Promise<boolean>) => {
    const memo = new Map<number, boolean>();
    const at = async (kk: number) => {
      const key = Math.round(kk);
      if (!memo.has(key)) memo.set(key, await ok(key));
      return memo.get(key)!;
    };
    let lo: number, hi: number;
    if (await at(k0)) {
      lo = k0; hi = k0 + 40;
      while ((await at(hi)) && hi < 900) (lo = hi), (hi += 80);
    } else {
      hi = k0; lo = Math.max(-88, k0 - 30);
      while (!(await at(lo)) && lo > -88) (hi = lo), (lo = Math.max(-88, lo - 30));
    }
    for (let n = 0; n < 8 && hi - lo > 3; n++) {
      const mid = (lo + hi) / 2;
      if (await at(mid)) lo = mid;
      else hi = mid;
    }
    return Math.round(lo);
  };
  const mobShare = Math.min(0.6, 2.5 * o.share);
  const mob = await bisect(o.knob.mob, (k) => check({ dungeon: node.dungeon, foes: foesAt(k), mobOnly: true }, mobShare, MOB_TARGET));
  let boss = await bisect(o.knob.boss, (k) => check({ dungeon: node.dungeon, foes: foesAt(mob), bossFoes: foesAt(k) }, o.share, o.target));
  let r = await searchNode(c, pool, i, { builds: o.builds, climb: o.climb, foes: foesAt(mob), bossFoes: foesAt(boss), carryFrom: o.carryFrom });
  // The check that keeps the road passable: the best build, scored on fresh seeds, must hold the target. If it doesn't
  // (the bisection read noisy 24-seed rates), ease the boss and search again. A playtester got stuck on a node that
  // passed the bisection with its best build at 75%.
  for (let n = 0; n < 5 && r.best.rate < o.target - 0.04; n++) {
    boss = Math.round(boss - Math.max(8, Math.abs(boss) * 0.12));
    r = await searchNode(c, pool, i, { builds: o.builds, climb: o.climb, foes: foesAt(mob), bossFoes: foesAt(boss), carryFrom: o.carryFrom });
  }
  r.knob = { mob, boss };
  return r;
}

/** The best builds clear a node's regular fights alone this often, at its mob knob. */
const MOB_TARGET = 0.95;

// ─── Main ───────────────────────────────────────────────────────────────────

function range(spec: string | undefined, total: number): number[] {
  if (!spec) return Array.from({ length: total }, (_, i) => i);
  const out: number[] = [];
  for (const part of spec.split(",")) {
    const [a, b] = part.split("-").map(Number);
    for (let k = a; k <= (b || a); k++) if (k >= 1 && k <= total) out.push(k - 1);
  }
  return out;
}

const pct = (x: number) => `${Math.round(100 * x)}%`;

async function main() {
  // --set path=value (repeatable): a what-if on the pack, as a study's patch does ("enemies/fire_giant/stats/max_hp=75000").
  const sets = args.flatMap((a, i) => (a === "--set" ? [args[i + 1]] : [])).map((x) => {
    const [path, v] = x.split("=");
    return { path, set: JSON.parse(v) };
  });
  const raw = patch(JSON.parse(readFileSync(PACK, "utf8")), sets);
  const c = loadContent(raw);
  const cp = campaign(c);
  if (opt("--log")) return logOne(c, opt("--log")!);
  if (opt("--feel")) return feel(c, opt("--feel")!);
  const workers = Number(opt("--workers") ?? availableParallelism());
  const pool = new Pool(raw, workers);
  if (args.includes("--power")) return void (await power(c, pool, range(opt("--nodes"), cp.nodes.length)), pool.close());
  const which = range(opt("--nodes"), cp.nodes.length);
  const builds = Number(opt("--builds") ?? 360);
  const climb = Number(opt("--climb") ?? 48);
  const tune = args.includes("--tune");
  const target = Number(opt("--target") ?? 0.85);
  /**
   * The share of a node's builds that must win at least half their runs: a ramp, so the first three nodes teach
   * (three in ten builds win), one in eight on nodes 4 to 9, one in eleven from node 10, and one in twenty for the
   * finale. At one in five everywhere, an AI playtester cleared 17 of 20 nodes on the first try; at one in 25 for the
   * Tower Top, one got stuck there. --share overrides it.
   */
  const shareAt = (i: number) => (opt("--share") ? Number(opt("--share")) : i < 3 ? 0.3 : i < 9 ? 0.12 : i < cp.nodes.length - 1 ? 0.09 : 0.05);
  const saved: Record<string, number | Knob> = JSON.parse(readFileSync(KNOBS, "utf8"));
  const knobs: Record<string, Knob> = Object.fromEntries(Object.entries(saved).map(([k, v]) => [k, typeof v === "number" ? { mob: v, boss: v } : v]));
  const results: NodeResult[] = [];
  let carry: Party | null = null;
  const prevBest = readPrev();
  console.log("| # | Node | owned c/f/g | builds | win½ | win⅚ | median | best | carry | new in top10 | lost (best) |");
  console.log("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const i of which) {
    if (i > 0 && !carry) carry = prevBest[cp.nodes[i - 1].id] ?? null;
    const r: NodeResult = tune
      ? await tuneNode(c, pool, i, { builds, climb, target, share: shareAt(i), knob: knobs[cp.nodes[i].id] ?? { mob: 0, boss: 0 }, carryFrom: carry })
      : await searchNode(c, pool, i, { builds, climb, carryFrom: carry });
    if (tune && !args.includes("--dry")) {
      knobs[cp.nodes[i].id] = r.knob!;
      writeFileSync(KNOBS, JSON.stringify(Object.fromEntries(cp.nodes.map((n) => [n.id, knobs[n.id] ?? { mob: 0, boss: 0 }])), null, 1) + "\n");
    }
    results.push(r);
    carry = r.best.party.units.length ? r.best.party : null;
    const lost = Object.entries(r.best.lost).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(", ");
    console.log(`| ${r.n}${tune ? ` k=${r.knob!.mob}/${r.knob!.boss}` : ""} | ${r.name} | ${r.owned.classes}/${r.owned.formations}/${r.owned.gear} | ${r.builds} | ${pct(r.winHalf)} | ${pct(r.winMost)} | ${pct(r.median)} | ${pct(r.best.rate)} | ${r.carry ? pct(r.carry.rate) : "–"} | ${r.newest.length ? pct(r.newestInTop) : "–"} | ${lost || "–"} |`);
  }
  pool.close();
  mkdirSync("out/campaign", { recursive: true });
  const all = { ...readAll(), ...Object.fromEntries(results.map((r) => [r.id, r])) };
  // --dry leaves the knobs and the results alone; --out writes the results somewhere else (a variant's).
  if (opt("--out")) writeFileSync(opt("--out")!, JSON.stringify(Object.fromEntries(results.map((r) => [r.id, r])), null, 1));
  else if (!args.includes("--dry")) writeFileSync("out/campaign/results.json", JSON.stringify(all, null, 1));
  if (args.includes("--effects")) {
    console.log("\nWhat each class and formation adds to a build's wins, node by node (with − without, in points; blank: not owned or forced):");
    const ids = [...c.pack.classes.map((x) => x.id), ...c.pack.formations.map((x) => x.id)];
    for (const id of ids) {
      const row = results.map((r) => {
        const e = r.effect[id];
        return e && Number.isFinite(e.with) && Number.isFinite(e.without) ? String(Math.round(100 * (e.with - e.without))).padStart(4) : "    ";
      });
      console.log(`${id.padEnd(15)}${row.join("")}`);
    }
  }
  console.log("\nBest builds:");
  for (const r of results) console.log(`  ${r.n} ${r.name}: ${pct(r.best.rate)} ${r.best.label}`);
  console.log(`\n${pool.runs.toLocaleString("en")} runs.`);
}

/**
 * Vertical progression: how much tougher an Old Road a party can clear, node by node. For the starting trio,
 * kitted from what's owned on reaching the node (its best formation and style), that's what gear and formations
 * add; for the node's best build, what new classes add on top. "k50": the knob (foes +k% HP and damage) at which
 * the party wins half its runs of the Old Road.
 */
async function power(c: Content, pool: Pool, which: number[]) {
  const cp = campaign(c);
  const all = readAll();
  const S = seedsFrom(7001, 24);
  const rate = async (p: Party, k: number) => (await pool.run({ dungeon: "old_road", party: p, seeds: S, foes: Object.keys(knobFoes(k)).length ? knobFoes(k) : null })).wins / S.length;
  const k50 = async (p: Party) => {
    let lo = -80, hi = 40;
    while ((await rate(p, hi)) >= 0.5 && hi < 2000) (lo = hi), (hi *= 2);
    if ((await rate(p, lo)) < 0.5) return lo;
    for (let n = 0; n < 9 && hi - lo > 4; n++) {
      const mid = (lo + hi) / 2;
      if ((await rate(p, mid)) >= 0.5) lo = mid;
      else hi = mid;
    }
    return Math.round(lo);
  };
  console.log("| # | Node | starting trio, kitted | k50 | best build | k50 |\n| --- | --- | --- | --- | --- | --- |");
  for (const i of which) {
    const owned = ownedAt(c, i);
    const trio = ["knight", "cleric", "ranger"];
    let pick: Party | null = null, pr = -1;
    for (const f of owned.formations) for (const s of STYLES) {
      const p = makeBuild(c, trio, f, s, owned, []);
      if (!p) continue;
      const r = await rate(p, 60);
      if (r > pr) (pr = r), (pick = p);
    }
    const saved = all[cp.nodes[i].id]?.best.party;
    const best = saved ? current(c, saved) : undefined;
    const a = pick ? await k50(pick) : NaN;
    const b = best?.units.length ? await k50(best) : NaN;
    console.log(`| ${i + 1} | ${cp.nodes[i].name} | ${pick ? describe(c, pick) : "–"} | ${a} | ${best ? describe(c, best) : "–"} | ${b} |`);
  }
}

function readAll(): Record<string, NodeResult> {
  try {
    return JSON.parse(readFileSync("out/campaign/results.json", "utf8"));
  } catch {
    return {};
  }
}
function readPrev(): Record<string, Party> {
  return Object.fromEntries(Object.entries(readAll()).map(([k, v]) => [k, v.best.party]));
}

function logOne(c: Content, id: string) {
  const cp = campaign(c);
  const i = cp.nodes.findIndex((n) => n.id === id || String(cp.nodes.indexOf(n) + 1) === id);
  const node = cp.nodes[i];
  const saved = readAll()[node.id]?.best.party;
  const best = saved ? current(c, saved) : undefined;
  if (!best) throw new Error(`no best build for ${node.id} yet: run npm run campaign first`);
  const run = play(c, combat, { dungeon: node.dungeon, party: best, seed: Number(opt("--seed") ?? 1), firstClear: true }, simPick, { log: true });
  const text = printLog(playerView(run.log!), { hidden: false });
  mkdirSync("out/campaign", { recursive: true });
  writeFileSync(`out/campaign/${node.id}.txt`, text + "\n");
  console.log(text);
}

// Last, so the classes above exist before main runs.
if (!isMainThread) {
  const c = loadContent(workerData.raw);
  parentPort!.on("message", (job: Job) => parentPort!.postMessage(runJob(c, job)));
} else await main();

/**
 * Reading packs for a feel check: for each named node, its best build's runs on two seeds (a loss if it has one,
 * and a win), as the player sees them, plus a sheet for a fresh reader. Writes out/campaign/feel/.
 */
function feel(c: Content, spec: string) {
  const cp = campaign(c);
  const all = readAll();
  const dir = "out/campaign/feel";
  mkdirSync(dir, { recursive: true });
  let n = 0;
  const key: string[] = [];
  for (const id of spec.split(",")) {
    const i = cp.nodes.findIndex((x) => x.id === id);
    const node = cp.nodes[i];
    const saved = all[node.id]?.best.party;
    const best = saved ? current(c, saved) : undefined;
    if (!best) throw new Error(`no best build for ${id}`);
    const outcomes = Array.from({ length: 30 }, (_, k) => k + 1).map((seed) => ({ seed, won: play(c, combat, { dungeon: node.dungeon, party: best, seed, firstClear: true }, simPick, { checked: true }).outcome === "won" }));
    const picks = [outcomes.find((x) => !x.won), outcomes.find((x) => x.won)].filter(Boolean) as { seed: number; won: boolean }[];
    for (const p of picks) {
      n++;
      const head = `> Node ${i + 1} of ${cp.nodes.length}, ${node.name}: ${node.text}${node.needs.length ? ` Needs: ${node.needs.map((nd) => needText(c, nd)).join("; ")}.` : ""}\n\n`;
      writeFileSync(`${dir}/pack-${n}.md`, head + readingPack(c, combat, { why: node.name, target: { key: node.id, dungeon: node.dungeon, name: node.name }, party: best, seed: p.seed, won: p.won }, n));
      key.push(`pack ${n}: ${node.id} seed ${p.seed} ${p.won ? "won" : "lost"}`);
    }
  }
  writeFileSync(`${dir}/key.txt`, key.join("\n") + "\n");
  console.log(`${n} packs in ${dir}`);
}
