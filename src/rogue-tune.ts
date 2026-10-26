/**
 * The rogue mode's run-level tuning: the calibration (src/rogue-calibrate.ts) gives each fight its knob against
 * snapshots of parties; this checks the result where it counts, in whole runs, and corrects it. Each round plays many
 * runs with the simulated player, then moves:
 *   - each boss's knob toward its act's target share of the parties that reach it (as they arrive),
 *   - each region's knob for its regular fights and elites toward its act's target share of the runs that enter it,
 * rebuilds the pack, and goes again.
 *
 *   npm run rogue:tune [-- --rounds 3 --runs 1500]
 *
 * Bundled by esbuild like the other tuners, so worker threads can load it.
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { availableParallelism } from "node:os";
import { isMainThread } from "node:worker_threads";
import { Pool, many, digest, type RunRec } from "./rogue-sim.js";

/** Targets by act: a boss beats this share of the parties that reach it; a region's fights and elites end this share of the runs that enter it. */
export const RUN_TARGETS = { boss: [12, 20, 25], road: [6, 9, 12] };
/** Knob points per point of loss rate: how far a miss moves a knob (damped). */
const GAIN = { boss: 1.0, road: 1.5 };
const KNOBS = "content/core-set/rogue-knobs.json";

const args = process.argv.slice(2);
const opt = (name: string) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };

async function main() {
  const rounds = Number(opt("--rounds") ?? 3);
  const runs = Number(opt("--runs") ?? 1500);
  for (let round = 1; round <= rounds; round++) {
    const raw = JSON.parse(readFileSync("content/core-set.pack.json", "utf8"));
    const pool = new Pool(raw, Number(opt("--workers") ?? availableParallelism()));
    const recs = await many(pool, runs, { from: 1 + round * 100000, leaders: ["knight", "cleric", "ranger"] });
    pool.close();
    console.log(`\n── round ${round} ──\n${digest(recs).split("\n").slice(0, 4).join("\n")}`);
    const knobs = JSON.parse(readFileSync(KNOBS, "utf8")) as Record<string, number>;
    const regionOf = new Map<string, string>();
    for (const r of raw.rogue.regions) for (const b of r.bosses) regionOf.set(b.id, r.id);
    // Bosses: share of arrivals beaten.
    const boss = new Map<string, { n: number; lost: number; act: number }>();
    for (const r of recs) for (const f of r.trace) if (f[2] === "b") {
      const k = `${regionOf.get(f[5])}/bosses/${f[5]}`;
      const b = boss.get(k) ?? { n: 0, lost: 0, act: f[0] };
      b.n++;
      if (f[4] < 0) b.lost++;
      boss.set(k, b);
    }
    for (const [k, b] of boss) {
      if (b.n < 30) continue;
      const rate = (100 * b.lost) / b.n;
      const move = Math.round(GAIN.boss * (RUN_TARGETS.boss[b.act - 1] - rate));
      knobs[k] = (knobs[k] ?? 0) + Math.max(-15, Math.min(15, move));
      console.log(`${k.padEnd(34)} met ${String(b.n).padStart(4)}  lost ${rate.toFixed(0).padStart(3)}% (target ${RUN_TARGETS.boss[b.act - 1]})  knob ${knobs[k]}`);
    }
    // Regions: share of the runs entering that end in its regular fights or elites.
    const reg = new Map<string, { n: number; lost: number; act: number }>();
    for (const r of recs) r.regions.forEach((g, i) => {
      const x = reg.get(g) ?? { n: 0, lost: 0, act: i + 1 };
      x.n++;
      if (!r.won && i === r.regions.length - 1 && r.died !== "boss") x.lost++;
      reg.set(g, x);
    });
    for (const [g, x] of reg) {
      const rate = (100 * x.lost) / x.n;
      const k = `region/${g}/mob`;
      const move = Math.round(GAIN.road * (RUN_TARGETS.road[x.act - 1] - rate));
      knobs[k] = (knobs[k] ?? 0) + Math.max(-10, Math.min(10, move));
      console.log(`${k.padEnd(34)} entered ${String(x.n).padStart(4)}  lost on the road ${rate.toFixed(0).padStart(3)}% (target ${RUN_TARGETS.road[x.act - 1]})  knob ${knobs[k]}`);
    }
    writeFileSync(KNOBS, JSON.stringify(Object.fromEntries(Object.entries(knobs).sort()), null, 1) + "\n");
    execSync("npx tsx content/core-set/build.ts", { stdio: "ignore" });
  }
}
if (isMainThread) void main();
export type { RunRec };
