/**
 * Step 5i, step 5 (the build's test): all twelve builds on one set of the rogue's own fights, side by side
 * (`steps/05-core-set/5i-synergy/pieces-build-brief.md`, "How to test"). It measures; it doesn't balance.
 *
 * - **The parties:** the hand-built parties of `src/build-parties.ts` (12 builds, 3 routes each, 3 rungs, each in its formation
 *   and in Neutral), fielded as the engine's `Party`: abilities in slot order, each trained ability as its form, a trained
 *   passive as `passive`, gear by slot; every one checked by `checkParty` before anything plays.
 * - **The fights:** for each act, a fixed sample of its regions' regular fights (the normal pool), elites and bosses, at their
 *   knobs as a run meets them at heat 0 (`knobFor` at the pool's reference floor; a boss at its own), on fixed seeds, the same
 *   for every party. Each fight from full HP and MP, every ability carried about 60% charged and a revive ready (5h's measure,
 *   `buildRoster`). Rung 1 plays act I's set, rung 2 act II's, rung 3 act III's; every rung also plays act II's, so the rungs
 *   compare on the same fights.
 * - **What it reads:** the rhythm read as `src/rhythm-read.ts` reads it (damage by quarter, the biggest tenth of hits, the first
 *   kill and the spread of kills, damage taken by quarter, the lowest HP, damage by source, MP spent), the strength table (win
 *   rate, HP lost in won fights, fight length, the routes' range, Neutral against the formation, all or nothing), and what
 *   carries each build: every item of every formation party swapped out for nothing on fewer seeds (a piece: the plain weapon
 *   or an empty slot; a mythic the same; a version or a power step: the ability without it; the formation: Neutral, read from
 *   the Neutral parties on the full seeds), scored by the calibration's cost (a loss 1, a win the share of HP lost).
 *
 *   npx tsx src/build-test.ts [--quick] [--builds landslide,cuts] [--rungs 1,2] [--seeds 6] [--ablate-seeds 3] [--no-ablate]
 *                             [--workers 4] [--out out/build-test]
 *
 * Output: `out/build-test/report.md` and `out/build-test/report.json`.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { availableParallelism } from "node:os";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";
import { advanceOnce, ENGINE_VERSION, loadContent, newRun, type Content, type Run } from "./engine/run.js";
import { combat, type Member as EngineMember } from "./engine/combat/rules.js";
import type { Entry } from "./engine/log.js";
import { rngFor, shuffle } from "./engine/rng.js";
import { FIGHT_DUNGEON, fightDungeon, foesFor, knobFor, passiveOf, plainWeapon, refFloors, rogue, type FightTier, type RogueRun, type Slot } from "./rogue.js";
import { formId, type FoesT, type Party as EParty, type RogueFightT, type UpgradeFormT } from "./schema.js";
import { checkParty } from "./validate.js";
import { ALL_PARTIES, BUILDS, type BuildId, type Member as BMember, type Party as BParty, type Rung } from "./build-parties.js";

const PACK = process.env.BUILD_TEST_PACK ?? "content/core-set.pack.json"; // BUILD_TEST_PACK: a variant pack, to price a rule

// ─── Fielding: a build party as the engine's party ──────────────────────────

/** What an ablation takes away: a member's piece in a slot, or the power step or version of one of its abilities or its passive. */
export type Drop = { kind: "piece"; cls: string; slot: Slot } | { kind: "power" | "version"; cls: string; ability: string };

/** The form an ability or passive plays as under a member's trainings, less what `drop` takes away. */
function formFor(m: BMember, id: string, drop?: Drop): string {
  const t = m.trained.find((x) => x.ability === id);
  if (!t) return id;
  let power = t.power, version = t.version;
  if (drop && drop.kind !== "piece" && drop.cls === m.cls && drop.ability === id) {
    if (drop.kind === "power") power = false;
    else version = undefined;
  }
  if (!power && !version) return id;
  return formId(id, (version ? (power ? `${version}p` : version) : "p") as UpgradeFormT);
}

/** A build party as the engine runs it; `drop` takes one item away (a weapon becomes the class's plain one, another slot empties). */
export function field(c: Content, p: BParty, drop?: Drop): EParty {
  return {
    formation: p.formation,
    units: p.members.map((m) => {
      const pid = passiveOf(c, m.cls);
      const passive = pid ? formFor(m, pid, drop) : undefined;
      const gear: Record<string, string> = { ...m.gear };
      if (drop?.kind === "piece" && drop.cls === m.cls) {
        if (drop.slot === "weapon") gear.weapon = plainWeapon(c, m.cls);
        else delete gear[drop.slot];
      }
      return { class: m.cls, position: m.seat, abilities: m.abilities.map((a) => formFor(m, a, drop)), ...(passive && passive !== pid ? { passive } : {}), gear };
    }),
  };
}

/** Every item a formation party holds that the ablation takes away, each with its key (what it's scored under). */
export function itemsOf(c: Content, p: BParty): { key: string; label: string; drop: Drop }[] {
  const out: { key: string; label: string; drop: Drop }[] = [];
  for (const m of p.members) {
    for (const slot of ["weapon", "armor", "offhand", "amulet"] as Slot[]) {
      const id = m.gear[slot];
      if (!id) continue;
      const g = c.gear.get(id);
      if (!g || g.source === "starter") continue;
      const kind = g.rarity === "mythic" ? "mythic" : "piece";
      out.push({ key: `${kind}:${id}`, label: `${g.name} (${g.rarity}, ${m.cls})`, drop: { kind: "piece", cls: m.cls, slot } });
    }
    for (const t of m.trained) {
      const name = c.abilities.get(t.ability)?.name ?? c.statuses.get(t.ability)?.name ?? t.ability;
      if (t.version) out.push({ key: `version:${t.ability}:${t.version}`, label: `${name} ${t.version.toUpperCase()} (${m.cls})`, drop: { kind: "version", cls: m.cls, ability: t.ability } });
      if (t.power) out.push({ key: `power:${t.ability}`, label: `${name} power step (${m.cls})`, drop: { kind: "power", cls: m.cls, ability: t.ability } });
    }
  }
  return out;
}

// ─── The fights ─────────────────────────────────────────────────────────────

type Pool = "normal" | "elite" | "bosses";
export type FightSpec = { key: string; act: number; region: string; pool: Pool; tier: FightTier; fight: RogueFightT; knob: number; foes: FoesT };

/**
 * An act's set: a fixed sample of each region's regular fights, elites and bosses (a region on its own in its act gives more),
 * by a fixed shuffle, at the knob a run meets each at heat 0 (the pool's reference floor; a boss at its own).
 */
export function fightSet(c: Content, act: number): FightSpec[] {
  const regs = rogue(c).regions.filter((r) => r.act === act);
  const per: Record<Pool, number> = regs.length === 1 ? { normal: 6, elite: 2, bosses: 2 } : { normal: 2, elite: 1, bosses: 1 };
  const ref = refFloors(c);
  const out: FightSpec[] = [];
  for (const reg of regs) {
    for (const pool of ["normal", "elite", "bosses"] as Pool[]) {
      const tier: FightTier = pool === "bosses" ? "boss" : pool === "elite" ? "elite" : "fight";
      const floor = tier === "boss" ? rogue(c).config.map.floors + 1 : pool === "elite" ? ref.elite : ref.normal;
      const fake = { act, region: reg.id, heat: 0 } as unknown as RogueRun;
      for (const fight of shuffle(rngFor(1, `build-test:${reg.id}:${pool}`), reg[pool]).slice(0, per[pool])) {
        const knob = knobFor(c, fake, tier, floor, fight);
        out.push({ key: `${act}/${reg.id}/${fight.id}`, act, region: reg.id, pool, tier, fight, knob, foes: foesFor(c, tier, knob) });
      }
    }
  }
  return out;
}

/** The acts' sets a rung plays: its own act's, then act II's (rung 2's own is act II's). */
const setsOf = (rung: Rung): number[] => (rung === 2 ? [2] : [rung, 2]);
const fightSeed = (key: string, i: number) => rngFor(9000 + i, `build-test:${key}`)[0];

// ─── Playing and reading one fight ──────────────────────────────────────────

/** One fight's read. Shares are of the fight's own totals; `T` its length in ticks. */
export type Rec = {
  won: boolean; T: number; cost: number; hpLost: number; fallen: number; sig: string;
  /** The engine threw (a part it doesn't build yet): the fight is left out of every read and every pair. */
  err?: string;
  /** Read from the log (the main pass only). */
  read?: {
    q: number[]; dealt: number; top10: number; kills: number; firstKill: number | null; spread: number | null; taken: number[]; takenTotal: number;
    low: number; foesLeft: number; src: Record<string, number>; mp: number; mpMax: number; paid: number; hpMax: number;
  };
};

/** Where a piece of damage on a foe came from: a basic attack, an ability, a rider on a hit, an extra strike, or a status by name. */
function sourceOf(c: Content, e: Entry): string {
  const src = String(e.src);
  if (e.part === "hit") return src === "basic" ? "basic" : "abilities";
  if (e.part === "rider") return "riders";
  if (e.part === "extra") return "extra strikes";
  if (src === "chill") return "shatter";
  return c.statuses.get(src)?.name ?? src;
}

export function play(c: Content, party: EParty, f: FightSpec, seed: number, log: boolean): Rec {
  fightDungeon(c, { node: "build-test", tier: f.tier, fight: f.fight, foes: f.foes, seed });
  const er: Run = newRun(c, combat, { dungeon: FIGHT_DUNGEON, party, seed }, { checked: true, log });
  // Full HP and MP (the engine's start); every ability about 60% charged, a revive ready (5h's measure, as `buildRoster` sets it).
  for (const em of er.party as EngineMember[]) {
    em.cooldowns = Object.fromEntries(em.abilities.map((a) => {
      const d = c.abilities.get(a)!;
      return [a, d.do.some((op) => op.op === "revive") ? 0 : Math.round(d.cooldown * 40) / 100];
    }));
  }
  let T = 0;
  for (let i = 0; !er.outcome; i++) {
    if (er.pending) throw new Error(`a fight asked for a decision (${f.key})`);
    if (er.fight) T = er.fight.round;
    advanceOnce(c, combat, er);
    if (i > 5e6) throw new Error(`a fight never ended (${f.key})`);
  }
  const ms = er.party as EngineMember[];
  const won = er.outcome === "won";
  const hpMax = ms.reduce((s, m) => s + m.stats.max_hp, 0);
  const hpLost = 1 - ms.reduce((s, m) => s + Math.max(0, m.hp), 0) / Math.max(1, hpMax);
  const rec: Rec = { won, T, cost: won ? hpLost : 1, hpLost, fallen: ms.filter((m) => m.hp <= 0).length, sig: `${won ? 1 : 0}:${T}:${ms.map((m) => m.hp).join(",")}` };
  if (log) rec.read = readLog(c, er.log as Entry[], T, ms.reduce((s, m) => s + m.stats.max_mp, 0));
  return rec;
}

/** The rhythm read of one fight's log (as `src/rhythm-read.ts` reads it), plus what the party spent. */
function readLog(c: Content, log: Entry[], T0: number, mpMax: number) {
  type U = { id: string; side: string; max: number; hp: number };
  const side = new Map<string, string>(), max = new Map<string, number>(), hp = new Map<string, number>();
  const meet = (u: U) => { side.set(u.id, u.side); max.set(u.id, u.max); hp.set(u.id, u.hp); };
  for (const u of (log.find((e) => e.t === "fight_start")?.units ?? []) as U[]) meet(u);
  const party = [...side].filter(([, s]) => s === "party").map(([id]) => id);
  const T = Math.max(1, T0);
  const quarter = (at: number) => Math.min(3, Math.max(0, Math.floor((at / T) * 4)));
  const partyShare = () => party.reduce((s, id) => s + Math.max(0, hp.get(id) ?? 0), 0) / Math.max(1, party.reduce((s, id) => s + (max.get(id) ?? 0), 0));
  const q = [0, 0, 0, 0], taken = [0, 0, 0, 0], src: Record<string, number> = {}, hits: number[] = [], kills: number[] = [];
  let low = 1, mp = 0, paid = 0;
  for (const e of log) {
    const at = typeof e.at === "number" ? e.at / 1000 : 0;
    switch (e.t) {
      case "join": meet(e.unit as U); break;
      case "dmg": {
        const tgt = String(e.target), before = hp.get(tgt) ?? 0, after = Number(e.hp);
        hp.set(tgt, after);
        const real = Math.max(0, Math.min(Number(e.amount) || 0, before));
        if (side.get(tgt) === "enemy") {
          q[quarter(at)] += real;
          const s = sourceOf(c, e);
          src[s] = (src[s] ?? 0) + real;
          if (real > 0) hits.push(real);
          if (before > 0 && after <= 0) kills.push(at);
        } else if (side.get(tgt) === "party") {
          taken[quarter(at)] += real;
          low = Math.min(low, partyShare());
        }
        break;
      }
      case "pay": if (side.get(String(e.unit)) === "party") { paid += Number(e.amount) || 0; hp.set(String(e.unit), Number(e.hp)); low = Math.min(low, partyShare()); } break;
      case "heal": hp.set(String(e.target), Number(e.hp)); break;
      case "revive": hp.set(String(e.unit), Number(e.hp)); break;
      case "down": hp.set(String(e.unit), 0); if (side.get(String(e.unit)) === "party") low = Math.min(low, partyShare()); break;
      case "mp": if (side.get(String(e.target)) === "party" && Number(e.amount) < 0 && (!e.by || e.by === e.target)) mp += -Number(e.amount); break;
    }
  }
  const dealt = q.reduce((s, x) => s + x, 0);
  hits.sort((a, b) => b - a);
  const top10 = hits.slice(0, Math.max(1, Math.ceil(hits.length / 10))).reduce((s, x) => s + x, 0);
  const foes = [...side].filter(([, s]) => s === "enemy").map(([id]) => id);
  const foesLeft = foes.reduce((s, id) => s + Math.max(0, hp.get(id) ?? 0), 0) / Math.max(1, foes.reduce((s, id) => s + (max.get(id) ?? 0), 0));
  return {
    q, dealt, top10, kills: kills.length, firstKill: kills.length >= 2 ? kills[0] / T : null, spread: kills.length >= 2 ? (kills[kills.length - 1] - kills[0]) / T : null,
    taken, takenTotal: taken.reduce((s, x) => s + x, 0), low, foesLeft, src, mp, mpMax, paid, hpMax: party.reduce((s, id) => s + (max.get(id) ?? 0), 0),
  };
}

// ─── Jobs and workers ───────────────────────────────────────────────────────

/** One job: a party (or an ablated copy) on one act's set, on the given seeds. */
type Job = { id: number; party: EParty; act: number; seeds: number[]; log: boolean };
type JobOut = { id: number; recs: Record<string, Rec[]> };

function runJob(c: Content, sets: Map<number, FightSpec[]>, j: Job): JobOut {
  const recs: Record<string, Rec[]> = {};
  for (const f of sets.get(j.act)!) recs[f.key] = j.seeds.map((i) => {
    try {
      return play(c, j.party, f, fightSeed(f.key, i), j.log);
    } catch (e) {
      return { won: false, T: 0, cost: NaN, hpLost: NaN, fallen: 0, sig: "error", err: String((e as Error).message).slice(0, 200) };
    }
  });
  return { id: j.id, recs };
}

/** The workers' script: this file, bundled by esbuild when it runs under tsx (a worker thread can't load the TypeScript itself). */
async function workerScript(): Promise<URL> {
  const here = new URL(import.meta.url);
  if (!here.pathname.endsWith(".ts")) return here;
  const { build } = await import("esbuild");
  const outfile = resolve("out/build-test.mjs");
  await build({ entryPoints: [fileURLToPath(here)], bundle: true, platform: "node", format: "esm", outfile, external: ["esbuild"], logLevel: "warning" });
  return pathToFileURL(outfile);
}

async function runAll(raw: unknown, jobs: Job[], workers: number, onDone: (o: JobOut) => void): Promise<void> {
  const script = await workerScript();
  const ws = Array.from({ length: Math.max(1, Math.min(workers, jobs.length)) }, () => new Worker(script, { workerData: { raw } }));
  let next = 0, done = 0;
  const t0 = Date.now();
  await Promise.all(ws.map((w) => new Promise<void>((resolve, reject) => {
    const feed = () => {
      if (next >= jobs.length) return void w.terminate().then(() => resolve());
      w.postMessage(jobs[next++]);
    };
    w.on("message", (o: JobOut) => {
      onDone(o);
      if (++done % 100 === 0 || done === jobs.length) process.stdout.write(`\r  ${done}/${jobs.length} jobs, ${((Date.now() - t0) / 1000).toFixed(0)} s   `);
      feed();
    });
    w.on("error", reject);
    feed();
  })));
  process.stdout.write("\n");
}

// ─── Reading many fights ────────────────────────────────────────────────────

const mean = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : NaN);
const pct = (x: number) => (Number.isFinite(x) ? `${Math.round(100 * x)}` : "-");
const sd = (xs: number[]) => { const m = mean(xs); return xs.length > 1 ? Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1)) : 0; };

/** The rhythm of many fights: each fight's shares, averaged (as `rhythm-read.ts` averages them). */
export type Rhythm = {
  n: number; q: number[]; top10: number; firstKill: number; spread: number; taken: number[]; low: number; src: Record<string, number>;
  /** MP spent a fight, as a share of the party's max MP; HP paid (prices) as a share of its max HP. */
  mp: number; paid: number; T: number;
};
function rhythmOf(recs: Rec[]): Rhythm {
  recs = recs.filter((r) => !r.err);
  const rs = recs.filter((r) => r.read).map((r) => r.read!);
  const src: Record<string, number> = {};
  for (const r of rs) for (const [k, v] of Object.entries(r.src)) src[k] = (src[k] ?? 0) + v / Math.max(1, r.dealt) / rs.length;
  const fk = rs.filter((r) => r.firstKill !== null);
  return {
    n: rs.length,
    q: [0, 1, 2, 3].map((i) => mean(rs.map((r) => r.q[i] / Math.max(1, r.dealt)))),
    top10: mean(rs.map((r) => r.top10 / Math.max(1, r.dealt))),
    firstKill: mean(fk.map((r) => r.firstKill!)),
    spread: mean(fk.map((r) => r.spread!)),
    taken: [0, 1, 2, 3].map((i) => mean(rs.filter((r) => r.takenTotal > 0).map((r) => r.taken[i] / r.takenTotal))),
    low: mean(rs.map((r) => r.low)),
    src,
    mp: mean(rs.map((r) => r.mp / Math.max(1, r.mpMax))),
    paid: mean(rs.map((r) => r.paid / Math.max(1, r.hpMax))),
    T: mean(recs.map((r) => r.T)),
  };
}

/** Strength over many fights. Clean: won, nobody fell, under a quarter of HP lost. Close: won with half the HP lost or someone down, or lost with the foes under a quarter of theirs. Wipe: lost with more left. */
export type Strength = { n: number; win: number; lostInWins: number; T: number; cost: number; clean: number; close: number; wipe: number };
function strengthOf(recs: Rec[]): Strength {
  recs = recs.filter((r) => !r.err);
  const wins = recs.filter((r) => r.won);
  const close = recs.filter((r) => (r.won && (r.hpLost >= 0.5 || r.fallen > 0)) || (!r.won && (r.read?.foesLeft ?? 1) < 0.25)).length;
  const clean = wins.filter((r) => r.fallen === 0 && r.hpLost < 0.25).length;
  const wipe = recs.filter((r) => !r.won && (r.read?.foesLeft ?? 1) >= 0.25).length;
  return {
    n: recs.length, win: recs.length ? wins.length / recs.length : NaN, lostInWins: mean(wins.map((r) => r.hpLost)), T: mean(recs.map((r) => r.T)), cost: mean(recs.map((r) => r.cost)),
    clean: clean / Math.max(1, recs.length), close: close / Math.max(1, recs.length), wipe: wipe / Math.max(1, recs.length),
  };
}

/** Each build's row of the rhythm table (`builds.md`, "The rhythm space"): damage over a fight, danger, what it spends. */
const RHYTHM_TABLE: Record<BuildId, [string, string, string]> = {
  landslide: ["a few huge blows at uneven moments", "steady, soaked by stone; spikes when it breaks", "MP, on stone that saves its HP"],
  cuts: ["a dense, even stream from the first tick", "even; dodges decide it", "HP: little casting, light bodies"],
  bonfire: ["rises the whole fight; each kill comes sooner than the last", "early", "MP, on the casts that feed the fire"],
  snap: ["bursts on a beat you can count", "falls with each burst", "both, evenly"],
  hunt: ["a staircase: a kill every few ticks", "early, falling with each kill", "both: HP early, MP on reach"],
  harvest: ["nothing, then everything", "full until the end", "MP on the sweeps; HP holding the full field"],
  ambush: ["a spike at the start, then a thin tail", "late, if the spike doesn't finish it", "HP, in the exposed tail"],
  overflow: ["in waves passing round the party, almost all casts", "a cliff when the mana stops", "MP, passed round the party"],
  lockdown: ["in windows while a foe is disabled", "held down; spikes when a lock slips", "MP on the locks, to save HP"],
  toll: ["follows how much the foes attack", "all on one unit", "HP: the anchor's"],
  pact: ["high and steady", "swings and rights itself", "HP, in place of MP"],
  phoenix: ["surges after each fall", "embraced, swingy", "HP on the falls, MP on the returns"],
};

/** The rhythm as a vector, for how far builds sit from each other: damage by quarter, lumpiness, kills, danger by quarter, low HP, sources, spending. */
function vectorOf(r: Rhythm): number[] {
  const s = (k: (x: string) => boolean) => Object.entries(r.src).filter(([x]) => k(x)).reduce((t, [, v]) => t + v, 0);
  const named = new Set(["basic", "abilities", "riders", "extra strikes"]);
  return [...r.q, r.top10, r.firstKill, r.spread, ...r.taken, r.low, s((x) => x === "basic"), s((x) => x === "abilities"), s((x) => !named.has(x)), s((x) => x === "riders" || x === "extra strikes"), r.mp, r.paid].map((x) => (Number.isFinite(x) ? x : 0));
}
/** Distances between builds' rhythms: each measure scaled by its spread across the builds, then the root mean square difference. */
function distances(rows: Map<string, Rhythm>): Map<string, Map<string, number>> {
  const ids = [...rows.keys()];
  const vs = ids.map((id) => vectorOf(rows.get(id)!));
  const k = vs[0]?.length ?? 0;
  const scale = Array.from({ length: k }, (_, i) => sd(vs.map((v) => v[i])) || 1);
  const out = new Map<string, Map<string, number>>();
  ids.forEach((a, i) => {
    const m = new Map<string, number>();
    ids.forEach((b, j) => m.set(b, Math.sqrt(vs[i].reduce((s, x, d) => s + ((x - vs[j][d]) / scale[d]) ** 2, 0) / k)));
    out.set(a, m);
  });
  return out;
}

// ─── Main ───────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const opt = (k: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };

async function main() {
  const t0 = Date.now();
  const raw = JSON.parse(readFileSync(PACK, "utf8"));
  const c = loadContent(raw);
  const quick = args.includes("--quick");
  const SEEDS = Number(opt("--seeds") ?? (quick ? 2 : 6));
  const ASEEDS = Math.min(SEEDS, Number(opt("--ablate-seeds") ?? (quick ? 1 : 3)));
  const ABLATE = !args.includes("--no-ablate");
  const OUT = opt("--out") ?? "out/build-test";
  const builds = opt("--builds")?.split(",") ?? Object.keys(BUILDS);
  const rungs = (opt("--rungs")?.split(",") ?? ["1", "2", "3"]).map(Number);
  const workers = Number(opt("--workers") ?? availableParallelism());
  const parties = ALL_PARTIES.filter((p) => builds.includes(p.build) && rungs.includes(p.rung));
  if (!parties.length) throw new Error("no parties match --builds and --rungs");

  // 1. Every party fielded and checked.
  const issues: string[] = [];
  const fielded = new Map<string, EParty>();
  for (const p of ALL_PARTIES) {
    const ep = field(c, p);
    for (const i of checkParty(c.pack, ep)) if (i.level === "error") issues.push(`${p.id}: ${i.path}: ${i.message}`);
    fielded.set(p.id, ep);
  }
  console.log(`${ALL_PARTIES.length} parties fielded, ${issues.length} errors${issues.length ? ":\n  " + issues.slice(0, 20).join("\n  ") : ""}`);
  if (issues.length) throw new Error("fix the parties first");

  // 2. The fights.
  const sets = new Map([1, 2, 3].map((a) => [a, fightSet(c, a)]));
  const seeds = Array.from({ length: SEEDS }, (_, i) => i);
  for (const [a, fs] of sets) console.log(`act ${a}: ${fs.map((f) => `${f.fight.id} (${f.pool}, knob ${f.knob})`).join(", ")}`);

  // 3. The main pass: every party on its sets, with logs. Then the ablation: every formation party's items, on its own act's set.
  const jobs: Job[] = [];
  const mainOf: { party: string; act: number }[] = [];
  for (const p of parties) for (const act of setsOf(p.rung)) { mainOf.push({ party: p.id, act }); jobs.push({ id: jobs.length, party: fielded.get(p.id)!, act, seeds, log: true }); }
  const ablOf: { party: string; key: string; label: string; act: number }[] = [];
  const ablJobs: Job[] = [];
  if (ABLATE) for (const p of parties.filter((x) => x.version === "formation")) {
    for (const it of itemsOf(c, p)) {
      ablOf.push({ party: p.id, key: it.key, label: it.label, act: p.rung });
      ablJobs.push({ id: jobs.length + ablJobs.length, party: field(c, p, it.drop), act: p.rung, seeds: seeds.slice(0, ASEEDS), log: false });
    }
  }
  const fightsIn = (js: Job[]) => js.reduce((s, j) => s + sets.get(j.act)!.length * j.seeds.length, 0);
  console.log(`${parties.length} parties: ${jobs.length} main jobs (${fightsIn(jobs)} fights, ${SEEDS} seeds), ${ablJobs.length} ablations (${fightsIn(ablJobs)} fights, ${ASEEDS} seeds), ${workers} workers`);
  const out = new Map<number, Record<string, Rec[]>>();
  await runAll(raw, [...jobs, ...ablJobs], workers, (o) => out.set(o.id, o.recs));

  // ── Gathering ──
  const byParty = new Map<string, Map<number, Record<string, Rec[]>>>();
  mainOf.forEach((m, i) => { if (!byParty.has(m.party)) byParty.set(m.party, new Map()); byParty.get(m.party)!.set(m.act, out.get(i)!); });
  const recsOf = (pid: string, act: number) => Object.values(byParty.get(pid)?.get(act) ?? {}).flat();
  const P = new Map(parties.map((p) => [p.id, p]));
  const own = (p: BParty) => recsOf(p.id, p.rung);
  const buildIds = (Object.keys(BUILDS) as BuildId[]).filter((b) => builds.includes(b));

  // The rhythm: formation parties on their own act's set.
  const rhythm = new Map<string, Rhythm>();
  const rhythmByRung: Record<string, Record<number, Rhythm>> = {};
  for (const b of buildIds) {
    const ps = parties.filter((p) => p.build === b && p.version === "formation");
    rhythm.set(b, rhythmOf(ps.flatMap(own)));
    rhythmByRung[b] = Object.fromEntries(rungs.map((r) => [r, rhythmOf(ps.filter((p) => p.rung === r).flatMap(own))]));
  }
  const dist = distances(rhythm);

  // Strength by rung: own act; routes as a range; Neutral against the formation; act II for every rung.
  type SRow = { formation: Strength; neutral: Strength; routes: { route: string; s: Strength }[]; act2: Strength; act2Neutral: Strength };
  const strength: Record<string, Record<number, SRow>> = {};
  for (const b of buildIds) {
    strength[b] = {};
    for (const r of rungs) {
      const ps = parties.filter((p) => p.build === b && p.rung === r);
      const form = ps.filter((p) => p.version === "formation"), neut = ps.filter((p) => p.version === "neutral");
      if (!form.length) continue;
      strength[b][r] = {
        formation: strengthOf(form.flatMap(own)), neutral: strengthOf(neut.flatMap(own)),
        routes: form.map((p) => ({ route: p.route, s: strengthOf(own(p)) })),
        act2: strengthOf(form.flatMap((p) => recsOf(p.id, 2))), act2Neutral: strengthOf(neut.flatMap((p) => recsOf(p.id, 2))),
      };
    }
  }

  // What carries a build: each item's change in cost (points of HP, a loss counting 100) when it's taken away, paired fight by fight
  // and seed by seed with the full party on the same dice; its noise the standard error of those pairs. Identical: every fight came out
  // exactly the same without it (nothing it does ever changed a fight).
  type Contribution = { party: string; build: BuildId; rung: Rung; key: string; label: string; d: number; se: number; dWin: number; identical: boolean; n: number };
  const contrib: Contribution[] = [];
  const pair = (base0: Rec[], without0: Rec[]) => {
    const ok = base0.map((r, i) => !r.err && !without0[i].err);
    const base = base0.filter((_, i) => ok[i]), without = without0.filter((_, i) => ok[i]);
    const ds = base.map((r, i) => without[i].cost - r.cost);
    return { d: mean(ds), se: sd(ds) / Math.sqrt(Math.max(1, ds.length)), dWin: mean(base.map((r, i) => (r.won ? 1 : 0) - (without[i].won ? 1 : 0))), identical: ds.length > 0 && base.every((r, i) => r.sig === without[i].sig), n: ds.length };
  };
  ablOf.forEach((a, i) => {
    const p = P.get(a.party)!;
    const without = out.get(jobs.length + i)!;
    const base: Rec[] = [], wo: Rec[] = [];
    for (const [k, rs] of Object.entries(without)) { base.push(...byParty.get(a.party)!.get(a.act)![k].slice(0, ASEEDS)); wo.push(...rs); }
    contrib.push({ party: a.party, build: p.build, rung: p.rung, key: a.key, label: a.label, ...pair(base, wo) });
  });
  // The formation: the Neutral party on the full seeds.
  for (const p of parties.filter((x) => x.version === "formation")) {
    const n = byParty.get(`${p.id}/neutral`);
    if (!n) continue;
    const base: Rec[] = [], wo: Rec[] = [];
    for (const [k, rs] of Object.entries(byParty.get(p.id)!.get(p.rung)!)) { base.push(...rs); wo.push(...n.get(p.rung)![k]); }
    contrib.push({ party: p.id, build: p.build, rung: p.rung, key: `formation:${p.formation}`, label: `${c.formations.get(p.formation)!.name} (formation)`, ...pair(base, wo) });
  }
  const moves = (x: Contribution) => !x.identical && Math.abs(x.d) >= 2 * x.se && Math.abs(x.d) >= 0.01;
  /** `parties`: the parties holding it where it could be measured (some fight played both with and without it); `unmeasured` the rest. */
  type Item = { key: string; label: string; parties: number; unmeasured: number; builds: string[]; d: number; dWin: number; max: number; moved: number; identical: number };
  const items = new Map<string, Item>();
  for (const x of contrib) {
    const it = items.get(x.key) ?? { key: x.key, label: x.label.replace(/ \([^)]*\)$/, ""), parties: 0, unmeasured: 0, builds: [], d: 0, dWin: 0, max: 0, moved: 0, identical: 0 };
    items.set(x.key, it);
    if (!it.builds.includes(x.build)) it.builds.push(x.build);
    if (!x.n) { it.unmeasured++; continue; }
    it.d += x.d; it.dWin += x.dWin; it.parties++;
    if (Math.abs(x.d) > Math.abs(it.max)) it.max = x.d;
    if (moves(x)) it.moved++;
    if (x.identical) it.identical++;
  }
  for (const it of items.values()) { it.d = it.parties ? it.d / it.parties : NaN; it.dWin = it.parties ? it.dWin / it.parties : NaN; }

  // Fights the engine couldn't play (a part not built yet), by its message.
  const errors = new Map<string, { main: number; ablation: number; parties: Set<string>; fights: Set<string> }>();
  const noteErr = (where: "main" | "ablation", party: string, recs: Record<string, Rec[]>) => {
    for (const [k, rs] of Object.entries(recs)) for (const r of rs) if (r.err) {
      const e = errors.get(r.err) ?? { main: 0, ablation: 0, parties: new Set(), fights: new Set() };
      e[where]++; e.parties.add(party); e.fights.add(k);
      errors.set(r.err, e);
    }
  };
  mainOf.forEach((m, i) => noteErr("main", m.party, out.get(i)!));
  ablOf.forEach((a, i) => noteErr("ablation", a.party, out.get(jobs.length + i)!));
  const errMain = [...errors.values()].reduce((s, e) => s + e.main, 0), errAbl = [...errors.values()].reduce((s, e) => s + e.ablation, 0);
  if (errors.size) console.log(`${errMain} main fights and ${errAbl} ablation fights didn't play: ${[...errors.keys()].join("; ")}`);

  // ── The report ──
  const secs = (Date.now() - t0) / 1000;
  const L: string[] = [];
  const name = (b: string) => BUILDS[b as BuildId];
  L.push("# The build test", "");
  L.push(`Generated by \`npx tsx src/build-test.ts${args.length ? " " + args.join(" ") : ""}\` (engine ${ENGINE_VERSION}, content ${c.fingerprint.slice(0, 12)}), ${new Date().toISOString().slice(0, 16)}, in ${Math.round(secs)} s on ${workers} workers.`, "");
  L.push(`${parties.length} parties (${builds.length} builds, rungs ${rungs.join(", ")}, each in its formation and in Neutral), every one valid by \`checkParty\`. Main pass: ${fightsIn(jobs)} fights on ${SEEDS} seeds, logged. Ablation: ${ablJobs.length} items taken away one at a time, ${fightsIn(ablJobs)} fights on ${ASEEDS} seed${ASEEDS === 1 ? "" : "s"}${ABLATE ? "" : " (off)"}.`, "");
  L.push("Each fight from full HP and MP, every ability about 60% charged, a revive ready. Rung 1 plays act I's set, rung 2 act II's, rung 3 act III's; every rung also plays act II's.", "");
  if (errors.size) {
    L.push(`**Fights the engine couldn't play:** ${errMain} of ${fightsIn(jobs)} in the main pass and ${errAbl} of ${fightsIn(ablJobs)} in the ablation, left out of every read and every pair:`, "");
    for (const [msg, e] of errors) L.push(`- "${msg}": ${e.main} main and ${e.ablation} ablation fights, ${e.parties.size} parties (${[...e.parties].slice(0, 6).join(", ")}${e.parties.size > 6 ? ", ..." : ""}), on ${e.fights.size} fights.`);
    L.push("");
  }
  L.push("## The fights", "");
  for (const [a, fs] of sets) L.push(`- **Act ${["I", "II", "III"][a - 1]}:** ${fs.map((f) => `${f.fight.name} (${f.region}, ${f.pool === "bosses" ? "boss" : f.pool === "elite" ? "elite" : "regular"}, knob ${f.knob})`).join("; ")}.`);
  L.push("");

  L.push("## 1. The rhythm read", "");
  L.push("Each build's formation parties (three routes, its rungs) on their own act's fights; every fight's shares averaged. Damage and danger by quarter of the fight; top tenth: the share of damage dealt by the biggest tenth of hits; first kill and spread: as shares of the fight, fights with two kills or more; low: the party's lowest HP; MP: spent a fight, as a share of the party's max MP; paid: HP paid as a price.", "");
  L.push("| Build | Damage by quarter | Top tenth | First kill | Spread | Taken by quarter | Low | Sources | MP | Paid | Ticks |", "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");
  const srcLine = (r: Rhythm) => Object.entries(r.src).filter(([, v]) => v >= 0.05).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${pct(v)}`).join(", ");
  for (const b of buildIds) {
    const r = rhythm.get(b)!;
    L.push(`| ${name(b)} | ${r.q.map(pct).join(" / ")} | ${pct(r.top10)} | ${pct(r.firstKill)} | ${pct(r.spread)} | ${r.taken.map(pct).join(" / ")} | ${pct(r.low)} | ${srcLine(r)} | ${pct(r.mp)} | ${pct(r.paid)} | ${Math.round(r.T)} |`);
  }
  L.push("", "Beside the rhythm table (`builds.md`, \"The rhythm space\"):", "");
  L.push("| Build | Damage over a fight (the table) | Damage by quarter | Danger (the table) | Taken by quarter | Spends (the table) | MP / paid |", "| --- | --- | --- | --- | --- | --- | --- |");
  for (const b of buildIds) {
    const r = rhythm.get(b)!, [dmg, danger, spends] = RHYTHM_TABLE[b as BuildId];
    L.push(`| ${name(b)} | ${dmg} | ${r.q.map(pct).join(" / ")}, top tenth ${pct(r.top10)} | ${danger} | ${r.taken.map(pct).join(" / ")}, low ${pct(r.low)} | ${spends} | ${pct(r.mp)} / ${pct(r.paid)} |`);
  }
  L.push("", "How far each build sits from the others: every measure above scaled by its spread across the builds, then the root mean square difference (0 the same rhythm; about 1.4 as far apart as two builds picked at random would be if the measures were unrelated).", "");
  L.push("| Build | Nearest | Distance | Mean to the others |", "| --- | --- | --- | --- |");
  for (const b of buildIds) {
    const m = dist.get(b)!;
    const others = [...m].filter(([x]) => x !== b).sort((x, y) => x[1] - y[1]);
    L.push(`| ${name(b)} | ${others[0] ? name(others[0][0]) : "-"} | ${others[0] ? others[0][1].toFixed(2) : "-"} | ${others.length ? mean(others.map(([, v]) => v)).toFixed(2) : "-"} |`);
  }
  L.push("", "Every pair:", "", `| | ${buildIds.map((b) => name(b).replace(/^The /, "")).join(" | ")} |`, `| --- | ${buildIds.map(() => "---").join(" | ")} |`);
  for (const a of buildIds) L.push(`| ${name(a)} | ${buildIds.map((b) => (a === b ? "" : dist.get(a)!.get(b)!.toFixed(2))).join(" | ")} |`);
  L.push("");
  if (rungs.length > 1) {
    L.push("By rung (formation parties, own act): damage by quarter, top tenth, first kill.", "");
    L.push(`| Build | ${rungs.map((r) => `Rung ${r}`).join(" | ")} |`, `| --- | ${rungs.map(() => "---").join(" | ")} |`);
    for (const b of buildIds) L.push(`| ${name(b)} | ${rungs.map((r) => { const x = rhythmByRung[b][r]; return x?.n ? `${x.q.map(pct).join("/")}, ${pct(x.top10)}, ${pct(x.firstKill)}` : "-"; }).join(" | ")} |`);
    L.push("");
  }

  L.push("## 2. Strength by rung", "");
  L.push("Formation parties on their own act's fights: win rate, HP lost in won fights, fight length in ticks; the three routes' win rates as a range; the Neutral version's win rate (and the formation's gain in cost, in points of HP with a loss as 100).", "");
  for (const r of rungs) {
    L.push(`**Rung ${r}** (act ${["I", "II", "III"][r - 1]}):`, "");
    L.push("| Build | Win | HP lost in wins | Ticks | Routes | Neutral | Formation's gain |", "| --- | --- | --- | --- | --- | --- | --- |");
    for (const b of buildIds) {
      const s = strength[b][r];
      if (!s) continue;
      const wins = s.routes.filter((x) => x.s.n).map((x) => x.s.win);
      L.push(`| ${name(b)} | ${pct(s.formation.win)}% | ${pct(s.formation.lostInWins)}% | ${Math.round(s.formation.T)} | ${wins.length ? `${pct(Math.min(...wins))}–${pct(Math.max(...wins))}%${wins.length < s.routes.length ? ` (${wins.length} of ${s.routes.length})` : ""}` : "-"} | ${pct(s.neutral.win)}% | ${(100 * (s.neutral.cost - s.formation.cost)).toFixed(1)} |`);
    }
    L.push("");
  }
  L.push("**Every rung on act II's fights** (formation parties; win rate, and HP lost in won fights):", "");
  L.push(`| Build | ${rungs.map((r) => `Rung ${r}`).join(" | ")} |`, `| --- | ${rungs.map(() => "---").join(" | ")} |`);
  for (const b of buildIds) L.push(`| ${name(b)} | ${rungs.map((r) => { const s = strength[b][r]; return s ? `${pct(s.act2.win)}%, ${pct(s.act2.lostInWins)}%` : "-"; }).join(" | ")} |`);
  L.push("", "**All or nothing** (formation parties, own act): clean wins (nobody fell, under a quarter of HP lost) / close fights (won with half the HP lost or someone down, or lost with the foes under a quarter of theirs) / wipes (lost with more left).", "");
  L.push(`| Build | ${rungs.map((r) => `Rung ${r}`).join(" | ")} |`, `| --- | ${rungs.map(() => "---").join(" | ")} |`);
  for (const b of buildIds) L.push(`| ${name(b)} | ${rungs.map((r) => { const s = strength[b][r]?.formation; return s ? `${pct(s.clean)} / ${pct(s.close)} / ${pct(s.wipe)}` : "-"; }).join(" | ")} |`);
  L.push("");

  if (ABLATE) {
    L.push("## 3. What carries a build, and what never matters", "");
    L.push(`Each item of each formation party taken away (a piece: the plain weapon or an empty slot; a mythic the same; a version or a power step: the ability without it), on its own act's fights and ${ASEEDS} seed${ASEEDS === 1 ? "" : "s"}; the formation against Neutral on ${SEEDS}. Its worth: what the party pays without it, in points of HP a fight (a loss 100), paired with the full party fight by fight on the same dice. It moves a result when that's at least 1 point and twice its noise (the pairs' standard error).`, "");
    L.push("**The carriers of each build** (the five items worth most to it, averaged over its parties that hold them; in brackets, how many of those parties):", "");
    for (const b of buildIds) {
      const per = new Map<string, { label: string; d: number[] }>();
      for (const x of contrib.filter((y) => y.build === b)) { const e = per.get(x.key) ?? { label: items.get(x.key)!.label, d: [] }; e.d.push(x.d); per.set(x.key, e); }
      const top = [...per.values()].map((e) => ({ label: e.label, d: mean(e.d), n: e.d.length })).sort((x, y) => y.d - x.d).slice(0, 5);
      L.push(`- **${name(b)}:** ${top.map((t) => `${t.label} ${(100 * t.d).toFixed(1)} (${t.n})`).join("; ")}.`);
    }
    const unmeasured = [...items.values()].filter((it) => !it.parties);
    const all = [...items.values()].filter((it) => it.parties);
    const never = all.filter((it) => it.moved === 0).sort((a, b) => a.label.localeCompare(b.label));
    const inert = all.filter((it) => it.identical === it.parties).sort((a, b) => a.label.localeCompare(b.label));
    if (unmeasured.length) L.push("", `**Not measured** (${unmeasured.length}: no fight played both with and without it, because the engine couldn't play one side): ${unmeasured.map((it) => it.label).join(", ")}.`);
    const hurts = all.filter((it) => it.d <= -0.01 && it.moved > 0).sort((a, b) => a.d - b.d);
    L.push("", `**The items worth most anywhere** (top 15 by their mean over the parties holding them):`, "");
    L.push("| Item | Kind | Parties | Worth (points) | Most in one party | Win rate it adds |", "| --- | --- | --- | --- | --- | --- |");
    for (const it of [...all].sort((a, b) => b.d - a.d).slice(0, 15)) L.push(`| ${it.label} | ${it.key.split(":")[0]} | ${it.parties} | ${(100 * it.d).toFixed(1)} | ${(100 * it.max).toFixed(1)} | ${pct(it.dWin)} pp |`);
    L.push("", `**Never past noise** (${never.length} of ${all.length} items: no party that holds it pays a point more, past its noise, without it): ${never.map((it) => it.label).join(", ") || "none"}.`, "");
    L.push(`**Never changed a fight at all** (${inert.length}: every fight came out exactly the same without it, in every party that holds it; it may do nothing yet, or never trigger in these fights): ${inert.map((it) => it.label).join(", ") || "none"}.`, "");
    L.push(`**Worse to have** (${hurts.length}: the party does better without it, past noise, on average): ${hurts.map((it) => `${it.label} ${(100 * it.d).toFixed(1)}`).join(", ") || "none"}.`, "");
    const kinds = ["piece", "mythic", "version", "power", "formation"];
    L.push("By kind: " + kinds.map((k) => { const xs = all.filter((it) => it.key.startsWith(k + ":")); return `${k} ${xs.length} items, ${xs.filter((it) => it.moved === 0).length} never past noise, ${xs.filter((it) => it.identical === it.parties).length} never changed a fight, mean worth ${(100 * mean(xs.map((it) => it.d))).toFixed(1)}`; }).join("; ") + ".", "");
  }

  mkdirSync(OUT, { recursive: true });
  writeFileSync(`${OUT}/report.md`, L.join("\n") + "\n");
  const json = {
    settings: { seeds: SEEDS, ablateSeeds: ASEEDS, ablate: ABLATE, builds, rungs, workers, seconds: Math.round(secs), engine: ENGINE_VERSION, content: c.fingerprint },
    fights: Object.fromEntries([...sets].map(([a, fs]) => [a, fs.map((f) => ({ key: f.key, name: f.fight.name, region: f.region, pool: f.pool, knob: f.knob, enemies: f.fight.enemies }))])),
    rhythm: Object.fromEntries(rhythm), rhythmByRung, distances: Object.fromEntries([...dist].map(([a, m]) => [a, Object.fromEntries(m)])),
    strength,
    parties: Object.fromEntries(parties.map((p) => [p.id, Object.fromEntries(setsOf(p.rung).map((a) => [a, { strength: strengthOf(recsOf(p.id, a)), rhythm: rhythmOf(recsOf(p.id, a)), byFight: Object.fromEntries(Object.entries(byParty.get(p.id)?.get(a) ?? {}).map(([k, rs]) => [k, strengthOf(rs)])) }]))])),
    items: [...items.values()].sort((a, b) => b.d - a.d),
    contributions: contrib,
  };
  writeFileSync(`${OUT}/report.json`, JSON.stringify(json, null, 1) + "\n");
  console.log(`wrote ${OUT}/report.md and report.json in ${Math.round((Date.now() - t0) / 1000)} s`);
}

if (isMainThread) {
  if (/build-test\.(ts|mjs)$/.test(process.argv[1] ?? "")) main().catch((e) => { console.error(e); process.exit(1); });
} else {
  const c = loadContent((workerData as { raw: unknown }).raw);
  const sets = new Map([1, 2, 3].map((a) => [a, fightSet(c, a)]));
  parentPort!.on("message", (j: Job) => parentPort!.postMessage(runJob(c, sets, j)));
}
