/**
 * A baseline for the knobs from the build parties: every fight in every region's pools given the knob at which its act's
 * build parties (`tools/build-parties.ts`, the formation version of each route at the act's rung: rung 1 in act I, 2 in II,
 * 3 in III) meet their tier's target, from the build test's rolled starts (`START`). It's the balance pass's starting
 * point for the knobs, not the tuning: `npm run rogue:calibrate` and `rogue:tune` set the knobs for whole runs after it.
 *
 * - **Regular fights and elites:** the knob bisected until the parties' mean cost (the share of the party's HP lost from
 *   the start, a loss counting 1) meets the tier's target.
 * - **Bosses:** the knob bisected until the parties win the target share.
 * - **The easy pool** is left alone by default: it's a start's, met by a party with nothing yet, and a rung-1 party wears a
 *   full set of commons and uncommons (`--pools easy` measures it all the same).
 * The same parties and dice at every knob. Each fight's own knob is written to `content/core-set/rogue-knobs.json` as the
 * measured knob less the act's and region's offsets for its tier, so a run meets it at the measured knob on the pool's
 * reference floor; `npm run content` puts it in the pack (`--dry` writes nothing).
 *
 *   npx tsx tools/build-calibrate.ts [--acts 1,2] [--pools normal,elite] [--fights id,id] [--seeds 4] [--workers 4] [--dry]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { availableParallelism } from "node:os";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";
import { loadContent, type Content } from "../src/engine/run.js";
import { foesFor, rogue } from "../src/rogue.js";
import type { Party as EParty } from "../src/schema.js";
import { BUILD_PARTIES } from "./build-parties.js";
import { field, fightSeed, fightsById, play, type FightSpec } from "./build-test.js";

/** Each tier's target by act: the easy pool's, a regular fight's and an elite's mean cost; a boss's win rate. */
export const TARGETS = {
  // The balance pass's baseline, on the director's word: regular fights won but not freely (about a sixth of the party's HP,
  // less in act I), elites not always won (nearly a third, a loss counting whole), bosses not always won (60%).
  easy: [0.09, 0.1, 0.11],
  normal: [0.14, 0.17, 0.19],
  elite: [0.26, 0.3, 0.33],
  bosses: [0.6, 0.6, 0.6],
};
type Pool = keyof typeof TARGETS;
const KNOBS = "content/core-set/rogue-knobs.json";
const LO = -80, HI = 900;

type Job = { key: string; act: number; region: string; pool: Pool; id: string; seeds: number };
type Out = { key: string; knob: number; own: number; metric: number; win: number; T: number; steps: { k: number; m: number }[] };

/** One fight at knob `k` against every party: the mean cost (or win rate), the win rate and the mean length. */
function measure(c: Content, parties: EParty[], spec: FightSpec, k: number, seeds: number) {
  const f: FightSpec = { ...spec, knob: k, foes: foesFor(c, spec.tier, k) };
  let cost = 0, win = 0, T = 0, n = 0;
  for (const p of parties) for (let i = 0; i < seeds; i++) {
    const r = play(c, p, f, fightSeed(spec.key, i), false);
    cost += r.cost; win += r.won ? 1 : 0; T += r.T; n++;
  }
  return { cost: cost / n, win: win / n, T: T / n };
}

function calibrate(c: Content, j: Job): Out {
  const spec = fightsById(c, [j.id]).find((f) => f.region === j.region && (j.pool === "bosses" ? f.pool === "bosses" : f.pool === j.pool))!;
  const parties = BUILD_PARTIES.filter((p) => p.rung === j.act && p.version === "formation").map((p) => field(c, p));
  const target = TARGETS[j.pool][j.act - 1];
  const boss = j.pool === "bosses";
  // Too hard is a cost above the target, or a boss's win rate below it.
  const tooHard = (m: { cost: number; win: number }) => (boss ? m.win < target : m.cost > target);
  const steps: { k: number; m: number }[] = [];
  let lo = LO, hi = HI, best = { k: spec.knob, m: measure(c, parties, spec, spec.knob, j.seeds) };
  steps.push({ k: best.k, m: boss ? best.m.win : best.m.cost });
  if (tooHard(best.m)) hi = best.k; else lo = best.k;
  while (hi - lo > 4) {
    const k = Math.round((lo + hi) / 2);
    const m = measure(c, parties, spec, k, j.seeds);
    steps.push({ k, m: boss ? m.win : m.cost });
    if (Math.abs((boss ? m.win : m.cost) - target) < Math.abs((boss ? best.m.win : best.m.cost) - target)) best = { k, m };
    if (tooHard(m)) hi = k; else lo = k;
  }
  // The act's and region's offsets for the tier: the fight's own knob is what's left.
  const cfg = rogue(c).config, reg = rogue(c).regions.find((r) => r.id === j.region)!;
  const kn = cfg.knobs[Math.min(j.act, cfg.knobs.length) - 1];
  const off = boss ? kn.boss + reg.knob.boss : j.pool === "elite" ? kn.elite + reg.knob.elite : kn.mob + reg.knob.mob;
  return { key: j.key, knob: best.k, own: best.k - off, metric: boss ? best.m.win : best.m.cost, win: best.m.win, T: best.m.T, steps };
}

/** The workers' script: this file, bundled by esbuild when it runs under tsx. */
async function workerScript(): Promise<URL> {
  const here = new URL(import.meta.url);
  if (!here.pathname.endsWith(".ts")) return here;
  const { build } = await import("esbuild");
  const outfile = resolve("out/build-calibrate.mjs");
  await build({ entryPoints: [fileURLToPath(here)], bundle: true, platform: "node", format: "esm", outfile, external: ["esbuild"], logLevel: "warning" });
  return pathToFileURL(outfile);
}

const args = process.argv.slice(2);
const opt = (k: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };

async function main() {
  const raw = JSON.parse(readFileSync("content/core-set.pack.json", "utf8"));
  const c = loadContent(raw);
  const acts = (opt("--acts") ?? "1,2,3").split(",").map(Number);
  const pools = (opt("--pools") ?? "normal,elite,bosses").split(",") as Pool[];
  const only = opt("--fights")?.split(",");
  const seeds = Number(opt("--seeds") ?? 4);
  const jobs: Job[] = [];
  for (const reg of rogue(c).regions.filter((r) => acts.includes(r.act))) for (const pool of pools) for (const f of reg[pool]) {
    if (only && !only.includes(f.id)) continue;
    jobs.push({ key: `${reg.id}/${pool}/${f.id}`, act: reg.act, region: reg.id, pool, id: f.id, seeds: pool === "bosses" ? seeds + 2 : seeds });
  }
  console.log(`${jobs.length} fights, ${seeds} seeds (bosses ${seeds + 2}) against each act's 27 build parties`);
  const script = await workerScript();
  const workers = Math.max(1, Math.min(Number(opt("--workers") ?? availableParallelism()), jobs.length));
  const results: Out[] = [];
  let next = 0;
  await Promise.all(Array.from({ length: workers }, () => new Promise<void>((done, fail) => {
    const w = new Worker(script, { workerData: { raw } });
    const feed = () => (next < jobs.length ? w.postMessage(jobs[next++]) : void w.terminate().then(() => done()));
    w.on("message", (r: Out) => {
      results.push(r);
      console.log(`${r.key.padEnd(36)} knob ${String(r.knob).padStart(4)} (own ${String(r.own).padStart(4)})  ${r.key.includes("/bosses/") ? "win" : "cost"} ${Math.round(100 * r.metric)}%  win ${Math.round(100 * r.win)}%  ${Math.round(r.T)} ticks`);
      feed();
    });
    w.on("error", fail);
    feed();
  })));
  if (args.includes("--dry")) return;
  const knobs = JSON.parse(readFileSync(KNOBS, "utf8")) as Record<string, number>;
  for (const r of results) knobs[r.key] = r.own;
  writeFileSync(KNOBS, JSON.stringify(Object.fromEntries(Object.entries(knobs).sort()), null, 1) + "\n");
  console.log(`wrote ${results.length} knobs to ${KNOBS}; run npm run content`);
}

if (isMainThread) {
  if (/build-calibrate\.(ts|mjs)$/.test(process.argv[1] ?? "")) main().catch((e) => { console.error(e); process.exit(1); });
} else {
  const c = loadContent((workerData as { raw: unknown }).raw);
  parentPort!.on("message", (j: Job) => parentPort!.postMessage(calibrate(c, j)));
}
