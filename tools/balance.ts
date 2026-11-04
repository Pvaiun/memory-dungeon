/**
 * The balance sheet: what happens inside fights, read from the logs, for every class,
 * ability, status, enemy, gear piece and formation in the pack, in both modes, at frozen knobs and fixed seeds.
 *
 * A fixed spread of parties (every trio sampled evenly, every formation, every piece of gear a class can wear, plus the
 * sensible kits) plays every free-play run and every rogue fight at its calibrated knob.
 * Each line is compared with the others of its kind and flagged at both ends against bands written down with their
 * reasons (BANDS, in balance/sheet.ts). Win rates are context here, never the measure: the knobs absorb them.
 *
 *   npm run balance [-- --trios 48] [--seeds 1] [--sets rogue,free] [--set path=value]... [--out out/balance] [--workers N]
 *
 * Output: out/balance/sheet.md (the sheet and the flags), sheet.json (every number), and the flags on screen.
 * Bundled by esbuild like the other tuners, so worker threads can load it.
 *
 * This file runs it (the worker pool and main); the rest is in balance/:
 *   plays.ts   what it plays: the fight sets, the spread of parties, the gear and formation probes' parties
 *   tally.ts   playing a run a moment at a time and reading its log into the tally
 *   sheet.ts   the bands with their reasons, and each set's sheet computed from its tally
 *   probes.ts  the probes' numbers and flags
 *   write.ts   the sheet as markdown
 */
import { isMainThread, parentPort, Worker, workerData } from "node:worker_threads";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { availableParallelism } from "node:os";
import { type Content, loadContent } from "../src/engine/run.js";
import { patch } from "../src/sim/content.js";
import { add, fightSets, formationProbe, gearProbe, type Job, partySpread, type SetId, type Tally, withLegendaries } from "./balance/plays.js";
import { runJob } from "./balance/tally.js";
import { BANDS, compute, poolSheets, r2 } from "./balance/sheet.js";
import { computeProbes } from "./balance/probes.js";
import { allFlags, writeSheet } from "./balance/write.js";

// ─── The pool ───────────────────────────────────────────────────────────────

class Pool {
  private workers: Worker[] = [];
  private idle: Worker[] = [];
  private queue: { job: Job; done: (o: Tally) => void }[] = [];
  private waiting = new Map<Worker, (o: Tally) => void>();
  private local: Content | null = null;
  constructor(raw: unknown, n: number, sets: SetId[]) {
    if (n <= 1 || import.meta.url.endsWith(".ts")) { this.local = loadContent(raw); fightSets(this.local, sets); }
    else for (let i = 0; i < n; i++) {
      const w = new Worker(new URL(import.meta.url), { workerData: { raw, sets } });
      w.on("message", (o: Tally) => { const done = this.waiting.get(w)!; this.waiting.delete(w); this.idle.push(w); this.pump(); done(o); });
      w.on("error", (e) => { throw e; });
      this.workers.push(w); this.idle.push(w);
    }
  }
  run(job: Job): Promise<Tally> {
    if (this.local) return Promise.resolve(runJob(this.local, job));
    return new Promise((done) => { this.queue.push({ job, done }); this.pump(); });
  }
  private pump() {
    while (this.idle.length && this.queue.length) { const w = this.idle.pop()!; const { job, done } = this.queue.shift()!; this.waiting.set(w, done); w.postMessage(job); }
  }
  close() { for (const w of this.workers) void w.terminate(); }
}

// ─── Main ───────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const opt = (name: string) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };

async function main() {
  const sets = (opt("--sets") ?? "rogue,free").split(",") as SetId[];
  const probesOn = opt("--probes") !== "off";
  const patches = args.flatMap((a, i) => (a === "--set" ? [args[i + 1]] : [])).map((x) => ({ path: x.slice(0, x.indexOf("=")), set: JSON.parse(x.slice(x.indexOf("=") + 1)) }));
  const raw = patch(JSON.parse(readFileSync(opt("--pack") ?? "content/core-set.pack.json", "utf8")), patches);
  const c = loadContent(raw);
  const trios = Number(opt("--trios") ?? 48);
  const seeds = Array.from({ length: Number(opt("--seeds") ?? 1) }, (_, i) => 31 + i);
  const outDir = opt("--out") ?? "out/balance";
  const t0 = Date.now();
  const fights = fightSets(c, sets);
  const { parties: spread, trios: picked } = partySpread(c, trios);
  const pool = new Pool(raw, Number(opt("--workers") ?? availableParallelism()), sets);
  const tallies: Record<string, Tally> = {};
  const jobs: Promise<void>[] = [];
  let n = 0;
  const run = (set: string, job: Omit<Job, "set" | "seeds">, sd = seeds) => {
    const t = (tallies[set] ??= {});
    n += sd.length;
    jobs.push(pool.run({ set, seeds: sd, ...job }).then((o) => { for (const k in o) add(t, k, o[k]); }));
  };
  for (const f of fights) spread.forEach((p, i) => run(f.set, { dungeon: f.dungeon, party: f.set === "rogue" && p.kind === "spread" ? withLegendaries(c, p.party, i) : p.party, kind: p.kind }));
  let probeRuns = 0;
  if (probesOn) {
    const probeFights = fights.filter((f) => f.probe);
    const probeSeeds = [seeds[0]];
    for (const { formation, party } of formationProbe(c, picked)) for (const f of probeFights) { run(`probe:form:${formation}`, { dungeon: f.dungeon, party, kind: "probe" }, probeSeeds); probeRuns++; }
    for (const k of c.pack.classes) for (const { piece, party } of gearProbe(c, k.id, picked)) for (const f of probeFights) { run(`probe:gear:${k.id}:${piece}`, { dungeon: f.dungeon, party, kind: "probe" }, probeSeeds); probeRuns++; }
  }
  await Promise.all(jobs);
  pool.close();
  const main: Record<string, Tally> = Object.fromEntries(Object.entries(tallies).filter(([k]) => !k.startsWith("probe:")));
  const sheets = Object.fromEntries(Object.entries(main).map(([s, t]) => [s, compute(c, t, s)]));
  const all = poolSheets(c, sheets);
  const probes = computeProbes(c, tallies);
  const secs = ((Date.now() - t0) / 1000).toFixed(0);
  const info = `${spread.length} parties (${trios} trios, each as a gear rotation and as a sensible kit) × ${fights.filter((f) => f.set === "free").length} free-play runs and ${fights.filter((f) => f.set === "rogue").length} rogue fights × ${seeds.length} seed${seeds.length > 1 ? "s" : ""}, plus ${probeRuns} probe runs (every piece on every class that can wear it, and every formation, on the same parties): ${n} runs, ${all.context.fights} fights in the main sets, in ${secs} s. Content ${c.pack.id}#${c.fingerprint}.`;
  mkdirSync(outDir, { recursive: true });
  const md = writeSheet(c, sheets, all, probes, info);
  writeFileSync(`${outDir}/sheet.md`, md + "\n");
  writeFileSync(`${outDir}/sheet.json`, JSON.stringify({ info, sets: sheets, pooled: all, probes: { gear: probes.gear, formations: probes.formations } }, null, 1));
  const ranked = allFlags(sheets, all, probes);
  console.log(info);
  console.log(`\n${ranked.length} flags, worst first:`);
  for (const f of ranked) console.log(`  ${f.kind.padEnd(10)} ${f.name.padEnd(30)} ${f.text}  [${f.band} ${r2(f.value)}; band ${r2(BANDS[f.band].lo)}–${Number.isFinite(BANDS[f.band].hi) ? r2(BANDS[f.band].hi) : "∞"}]`);
  console.log(`\nWritten to ${outDir}/sheet.md and sheet.json.`);
}

if (!isMainThread) {
  const { raw, sets } = workerData as { raw: unknown; sets: SetId[] };
  const c = loadContent(raw);
  fightSets(c, sets);
  parentPort!.on("message", (job: Job) => parentPort!.postMessage(runJob(c, job)));
} else if (/balance(\.mjs|\.ts)$/.test(process.argv[1] ?? "")) await main();
