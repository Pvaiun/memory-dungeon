/**
 * The rogue mode's simulation: whole runs played by the simulated player (src/rogue-ai.ts), many at once, and the numbers
 * that say whether the run is a good climb: how often it's won, where it's lost (act, and fight, elite or boss), how
 * much HP the party brings to each boss, how gold flows, what gets picked, and which classes and pieces win.
 *
 *   npm run rogue [-- --runs 600] [--leader knight] [--heat N] [--set path=value ...] [--dials greed=1,noise=0.3]
 *                  [--noisy spoils,map] [--json out/rogue/x.json] [--workers N] [--diary seed]
 *
 * `--set` patches the pack ("rogue/config/knobs/0/mob=-40"); `--dials` the player. `--diary N` prints one run's notes.
 * Bundled by esbuild like the campaign tuning, so worker threads can load it.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { availableParallelism } from "node:os";
import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";
import { loadContent, type Content } from "./engine/run.js";
import { autoFight, member, newRogue, rollItem, take, type RogueRun } from "./rogue.js";
import { rngFor } from "./engine/rng.js";
import type { RarityT } from "./schema.js";
import { aiPlayer, hpShare, type Dials } from "./rogue-ai.js";
import { patch, type Patch } from "./sim/content.js";
import { choose } from "./rogue.js";

export type Job = { seeds: number[]; leaders: string[]; heat: number; dials: Partial<Dials>; diary?: boolean; gift?: Record<string, number> };
export type RunRec = {
  seed: number; leader: string; won: boolean; act: number; floor: number; died: string | null; region: string; regions: string[];
  fights: number; elites: number; gold: number; spent: number; party: string[]; roster: string[]; drafted: string[];
  legendaries: number; formation: string; formations: number; bossHp: number[]; bossFight: string[]; picks: Record<string, number>;
  known: number; notes?: string[]; items: number; supplies: number;
  /** Each fight: act, floor, tier (f, e, b), party HP % before and after (−1: lost), and its fight id. */
  trace: [number, number, string, number, number, string][];
};

export function playOne(c: Content, seed: number, leader: string, heat: number, dials: Partial<Dials>, diary = false, gift: Record<string, number> = {}): RunRec {
  const run = newRogue(c, { seed, leader, heat });
  // A what-if: pieces of a rarity, or gold, handed over at the start.
  const grng = rngFor(seed, "gift");
  for (const [k, n] of Object.entries(gift)) for (let i = 0; i < n; i++) k === "gold" ? (run.gold += 1) : take(c, run, { kind: "gear", item: rollItem(c, run, grng, k as RarityT) });
  const ai = aiPlayer(dials, seed);
  const bossHp: number[] = [], bossFight: string[] = [], regions: string[] = [run.region];
  let died: string | null = null;
  const drafted: string[] = [];
  const trace: RunRec["trace"] = [];
  for (let i = 0; i < 3000 && run.pending.kind !== "over"; i++) {
    ai.prepare(c, run);
    const p = run.pending;
    if (p.kind === "fight") {
      if (p.tier === "boss") (bossHp.push(Math.round(hpShare(c, run) * 100)), bossFight.push(p.fight.id));
      const tier = p.tier;
      const before = Math.round(hpShare(c, run) * 100);
      autoFight(c, run);
      const after = run.pending as RogueRun["pending"];
      const lost = after.kind === "over" && !after.won;
      if (lost) died = tier;
      trace.push([run.act, run.floor, tier[0], before, lost ? -1 : Math.round(hpShare(c, run) * 100), p.fight.id]);
      continue;
    }
    const pick = ai.decide(c, run);
    if (p.kind === "draft") drafted.push(pick);
    choose(c, run, pick);
    if (p.kind === "region") regions.push(run.region);
  }
  const won = run.pending.kind === "over" && run.pending.won;
  return {
    seed, leader, won, act: run.act, floor: run.floor, died, region: run.region, regions, fights: run.stats.fights, elites: run.stats.elites,
    gold: run.stats.gold, spent: run.stats.spent, party: [...run.party], roster: run.roster.map((m) => m.cls), drafted,
    legendaries: run.party.reduce((s, cls) => s + Object.values(member(run, cls).gear).filter((uid) => run.items.find((it) => it.uid === uid)?.rarity === "legendary").length, 0),
    formation: run.formation, formations: run.formations.length, bossHp, bossFight, picks: run.stats.picks,
    known: run.party.reduce((s, cls) => s + member(run, cls).known.length, 0), items: run.items.length, supplies: run.supplies.length, trace,
    ...(diary ? { notes: run.notes.map((n) => `${n.act}.${n.floor} ${n.text}`) } : {}),
  };
}

function runJob(c: Content, job: Job): RunRec[] {
  return job.seeds.map((seed, i) => playOne(c, seed, job.leaders[i % job.leaders.length], job.heat, job.dials, job.diary, job.gift));
}

// ─── The pool ───────────────────────────────────────────────────────────────

export class Pool {
  private workers: Worker[] = [];
  private idle: Worker[] = [];
  private queue: { job: Job; done: (o: RunRec[]) => void }[] = [];
  private waiting = new Map<Worker, (o: RunRec[]) => void>();
  private local: Content | null = null;
  constructor(raw: unknown, n: number) {
    if (n <= 1 || import.meta.url.endsWith(".ts")) this.local = loadContent(raw);
    else for (let i = 0; i < n; i++) {
      const w = new Worker(new URL(import.meta.url), { workerData: { raw } });
      w.on("message", (o: RunRec[]) => {
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
  run(job: Job): Promise<RunRec[]> {
    if (this.local) return Promise.resolve(runJob(this.local, job));
    return new Promise((done) => { this.queue.push({ job, done }); this.pump(); });
  }
  private pump() {
    while (this.idle.length && this.queue.length) {
      const w = this.idle.pop()!;
      const { job, done } = this.queue.shift()!;
      this.waiting.set(w, done);
      w.postMessage(job);
    }
  }
  close() { for (const w of this.workers) void w.terminate(); }
}

/** Plays `runs` runs in chunks across the pool. */
export async function many(pool: Pool, runs: number, o: { from?: number; leaders: string[]; heat?: number; dials?: Partial<Dials>; gift?: Record<string, number> }): Promise<RunRec[]> {
  const from = o.from ?? 1;
  const chunk = 10;
  const jobs: Promise<RunRec[]>[] = [];
  for (let s = 0; s < runs; s += chunk) {
    const seeds = Array.from({ length: Math.min(chunk, runs - s) }, (_, i) => from + s + i);
    jobs.push(pool.run({ seeds, leaders: seeds.map((x) => o.leaders[x % o.leaders.length]), heat: o.heat ?? 0, dials: o.dials ?? {}, gift: o.gift }));
  }
  return (await Promise.all(jobs)).flat();
}

// ─── The digest ─────────────────────────────────────────────────────────────

const pct = (a: number, b: number) => (b ? `${Math.round((100 * a) / b)}%` : "–");
const mean = (xs: number[]) => (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);

export function digest(recs: RunRec[]): string {
  const n = recs.length;
  const wins = recs.filter((r) => r.won).length;
  const lines: string[] = [];
  lines.push(`runs ${n}  won ${wins} (${pct(wins, n)})  fights/run ${mean(recs.map((r) => r.fights)).toFixed(1)}  elites/run ${mean(recs.map((r) => r.elites)).toFixed(2)}`);
  // Where runs end: act and tier.
  const where: Record<string, number> = {};
  for (const r of recs) if (!r.won) where[`A${r.act} ${r.died ?? "?"}`] = (where[`A${r.act} ${r.died ?? "?"}`] ?? 0) + 1;
  lines.push(`lost at: ${Object.entries(where).sort().map(([k, v]) => `${k} ${pct(v, n)}`).join("  ")}`);
  const reach = [1, 2, 3].map((a) => recs.filter((r) => r.act >= a).length);
  lines.push(`reach act 2 ${pct(reach[1], n)}  act 3 ${pct(reach[2], n)}  ·  beat boss 1 ${pct(recs.filter((r) => r.act >= 2).length, n)}  boss 2 ${pct(recs.filter((r) => r.act >= 3).length, n)}  boss 3 ${pct(wins, n)}`);
  for (let a = 0; a < 3; a++) {
    const hp = recs.filter((r) => r.bossHp.length > a).map((r) => r.bossHp[a]);
    const beat = recs.filter((r) => r.bossHp.length > a && (r.act > a + 1 || r.won)).length;
    if (hp.length) lines.push(`boss ${a + 1}: met ${hp.length}, HP on arrival ${Math.round(mean(hp))}%, beaten ${pct(beat, hp.length)}`);
  }
  // By region.
  const regs: Record<string, { met: number; lost: number }> = {};
  for (const r of recs) r.regions.forEach((g, i) => {
    regs[g] ??= { met: 0, lost: 0 };
    regs[g].met++;
    if (!r.won && i === r.regions.length - 1) regs[g].lost++;
  });
  lines.push(`regions: ${Object.entries(regs).map(([g, v]) => `${g} ${v.met} (lost ${pct(v.lost, v.met)})`).join("  ")}`);
  lines.push(`gold earned ${Math.round(mean(recs.map((r) => r.gold)))}, spent ${Math.round(mean(recs.map((r) => r.spent)))}  ·  legendaries worn ${mean(recs.map((r) => r.legendaries)).toFixed(2)}  formations ${mean(recs.map((r) => r.formations)).toFixed(2)}  abilities known ${mean(recs.map((r) => r.known)).toFixed(1)}`);
  // By leader.
  const leaders = [...new Set(recs.map((r) => r.leader))];
  lines.push(`by leader: ${leaders.map((l) => `${l} ${pct(recs.filter((r) => r.leader === l && r.won).length, recs.filter((r) => r.leader === l).length)}`).join("  ")}`);
  // Classes in the final party of winning runs, against how often they were in any final party.
  const cls: Record<string, { in: number; won: number }> = {};
  for (const r of recs) for (const k of r.party) { cls[k] ??= { in: 0, won: 0 }; cls[k].in++; if (r.won) cls[k].won++; }
  lines.push(`classes (final party, win rate): ${Object.entries(cls).sort((a, b) => b[1].won / b[1].in - a[1].won / a[1].in).map(([k, v]) => `${k} ${v.in}/${pct(v.won, v.in)}`).join("  ")}`);
  // Attrition: what a fight costs, and how often a fight is lost, by the HP the party brings to it.
  const fights = recs.flatMap((r) => r.trace);
  const cost = (t: string) => { const xs = fights.filter((f) => f[2] === t && f[4] >= 0); return Math.round(mean(xs.map((f) => f[3] - f[4]))); };
  lines.push(`HP a won fight costs: fight ${cost("f")}  elite ${cost("e")}  boss ${cost("b")} (points of party HP %)`);
  const bands = [[0, 40], [40, 60], [60, 80], [80, 101]];
  lines.push(`lost, by HP brought: ${bands.map(([a, b]) => { const xs = fights.filter((f) => f[2] !== "b" && f[3] >= a && f[3] < b); return `${a}-${b}% ${pct(xs.filter((f) => f[4] < 0).length, xs.length)} of ${xs.length}`; }).join("  ")} (fights and elites)`);
  const picks: Record<string, number> = {};
  for (const r of recs) for (const [k, v] of Object.entries(r.picks)) picks[k] = (picks[k] ?? 0) + v;
  lines.push(`picks/run: ${Object.entries(picks).sort().map(([k, v]) => `${k} ${(v / n).toFixed(2)}`).join("  ")}`);
  return lines.join("\n");
}

// ─── Main ───────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const opt = (name: string) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const all = (name: string) => args.flatMap((a, i) => (a === name ? [args[i + 1]] : []));

export function parsePatches(sets: string[]): Patch[] {
  return sets.map((s) => {
    const [path, v] = s.split("=");
    return { path, set: JSON.parse(v) };
  });
}
export function parseDials(s: string | undefined): Partial<Dials> {
  const d: Record<string, unknown> = {};
  for (const kv of (s ?? "").split(",").filter(Boolean)) {
    const [k, v] = kv.split("=");
    d[k] = v === "true" ? true : v === "false" ? false : Number(v);
  }
  return d as Partial<Dials>;
}

async function main() {
  const raw = patch(JSON.parse(readFileSync(opt("--pack") ?? "content/core-set.pack.json", "utf8")), parsePatches(all("--set")));
  const runs = Number(opt("--runs") ?? 600);
  const leaders = (opt("--leader") ?? "knight,cleric,ranger").split(",");
  const dials = { ...parseDials(opt("--dials")), ...(opt("--noisy") ? { noisy: opt("--noisy")!.split(",") } : {}) };
  const heat = Number(opt("--heat") ?? 0);
  if (opt("--diary")) {
    const c = loadContent(raw);
    const rec = playOne(c, Number(opt("--diary")), leaders[0], heat, dials, true);
    console.log(rec.notes!.join("\n"));
    console.log(JSON.stringify({ ...rec, notes: undefined }));
    return;
  }
  const t0 = Date.now();
  const pool = new Pool(raw, Number(opt("--workers") ?? availableParallelism()));
  const gift = Object.fromEntries((opt("--gift") ?? "").split(",").filter(Boolean).map((kv) => [kv.split("=")[0], Number(kv.split("=")[1])]));
  const recs = await many(pool, runs, { from: Number(opt("--from") ?? 1), leaders, heat, dials, gift });
  pool.close();
  console.log(digest(recs));
  console.log(`(${((Date.now() - t0) / 1000).toFixed(1)} s)`);
  const out = opt("--json");
  if (out) {
    mkdirSync(out.split("/").slice(0, -1).join("/") || ".", { recursive: true });
    writeFileSync(out, JSON.stringify(recs));
  }
}

if (isMainThread) {
  if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("rogue.mjs")) void main();
} else {
  const c = loadContent((workerData as { raw: unknown }).raw);
  parentPort!.on("message", (job: Job) => parentPort!.postMessage(runJob(c, job)));
}
