/**
 * Run a study from the command line. The harness itself (src/sim/) is
 * game-safe code with no Node; this wrapper only reads and writes files.
 *
 *   npm run study -- studies/combat-sample.json [--report] [--feel] [--final]
 *   npm run study -- --score out/combat-sample/feel/answers.md
 *
 * Output goes to out/<study id>/, which git ignores: results.json (every
 * number), digest.txt (what it prints), headline.json (for "since last run"),
 * report-draft.md with --report, and with --feel the reading packs, the
 * reader's sheet and the answer key. Held-out studies need --final.
 *
 * `npm run study` bundles this file first (out/study.mjs), which runs faster
 * than tsx. A combat study's jobs are shared out between threads, one per core
 * by default; `--workers N` sets how many, and `--workers 1` runs them all on
 * this thread. The numbers are the same either way.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { availableParallelism } from "node:os";
import { dirname, join } from "node:path";
import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";
import { ENGINE_VERSION } from "./engine/run.js";
import { combat } from "./engine/combat/rules.js";
import { assemble, contents, jobs, runCombat, runJob, type Piece } from "./sim/combat.js";
import { build, ladder, patch } from "./sim/content.js";
import { pickRuns, readingPack, scoreColours, sheet } from "./sim/feel.js";
import { runVersions } from "./sim/progression.js";
import { combatDigest, combatDraft, combatHeadline, progressionDigest, progressionDraft, progressionHeadline } from "./sim/report.js";
import { Study, type CombatStudy } from "./sim/study.js";

const args = process.argv.slice(2);
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const write = (p: string, s: string) => (mkdirSync(dirname(p), { recursive: true }), writeFileSync(p, s));
const opt = (name: string) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

if (!isMainThread) work();
else if (args[0] === "--score") score(args[1]);
else await run(args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--workers"));

/** A worker thread: runs the jobs it's sent, one at a time. */
function work() {
  const { s, raw, keep } = workerData as { s: CombatStudy; raw: unknown; keep: boolean };
  const cs = contents(s, raw);
  const js = jobs(s, cs);
  parentPort!.on("message", (i: number) => parentPort!.postMessage({ i, piece: runJob(s, cs, combat, js[i], { keep }) }));
}

/** A combat study's jobs, shared out between worker threads; the biggest (tweaks) go first. */
async function runShared(s: CombatStudy, raw: unknown, keep: boolean, workers: number) {
  // Worker threads can't load TypeScript, so run straight from the source (under tsx), it stays on one thread.
  if (workers <= 1 || import.meta.url.endsWith(".ts")) return runCombat(s, raw, combat, { keep });
  const cs = contents(s, raw);
  const js = jobs(s, cs);
  const order = js.map((_, i) => i).sort((a, b) => +!!js[b].tweak - +!!js[a].tweak);
  const pieces: Piece[] = new Array(js.length);
  await new Promise<void>((done, fail) => {
    if (!js.length) return done();
    let sent = 0, back = 0;
    for (let n = 0; n < Math.min(workers, js.length); n++) {
      const w = new Worker(new URL(import.meta.url), { workerData: { s, raw, keep } });
      w.on("error", fail);
      w.on("message", ({ i, piece }: { i: number; piece: Piece }) => {
        pieces[i] = piece;
        if (++back === js.length) done();
        if (sent < js.length) w.postMessage(order[sent++]);
        else void w.terminate();
      });
      w.postMessage(order[sent++]);
    }
  });
  return assemble(s, cs, combat, js, pieces, { keep });
}

async function run(file: string | undefined) {
  if (!file) throw new Error("usage: npm run study -- <study.json> [--report] [--feel] [--final] [--workers N]");
  const s = Study.parse(read(file));
  if (s.heldOut && !args.includes("--final")) throw new Error(`${s.id} is held out: it only runs for the final check, with --final`);
  const raw = read(s.content.pack);
  const dir = join("out", s.id);
  const before = existsSync(join(dir, "headline.json")) ? read(join(dir, "headline.json")) : null;
  const t0 = performance.now();
  if (s.level === "combat") {
    const wantRuns = args.includes("--feel") || args.includes("--report");
    const workers = Number(opt("--workers") ?? availableParallelism());
    if (!Number.isInteger(workers) || workers < 1) throw new Error(`--workers takes a whole number, 1 or more, got ${opt("--workers")}`);
    const { results, kept } = await runShared(s, raw, wantRuns, workers);
    const ms = performance.now() - t0;
    const digest = combatDigest(results, ms, ENGINE_VERSION, before);
    console.log(digest);
    write(join(dir, "digest.txt"), digest + "\n");
    write(join(dir, "results.json"), JSON.stringify(results, null, 1));
    write(join(dir, "headline.json"), JSON.stringify(combatHeadline(results), null, 1));
    const picks = wantRuns ? pickRuns(kept) : [];
    if (args.includes("--report")) write(join(dir, "report-draft.md"), combatDraft(results, ENGINE_VERSION, picks.map((p, i) => `Pack ${i + 1}, ${p.why}: ${p.target.name}, ${p.won ? "won" : "lost"}, seed ${p.seed}`)));
    if (args.includes("--feel")) {
      const c = build(patch(s.content.ladder ? ladder(raw, s.content.ladder) : raw, s.variants[0].patch), s.targets.fights);
      const winning = new Map(results.variants[0].targets.map((t) => [t.target.key, t.strictness.winning]));
      picks.forEach((p, i) => write(join(dir, "feel", `pack-${i + 1}.md`), readingPack(c, combat, p, i + 1)));
      write(join(dir, "feel", "sheet.md"), sheet(c, picks.length));
      write(join(dir, "feel", "key.json"), JSON.stringify({ classes: c.pack.classes.map((x) => [x.name.toLowerCase(), x.id]), packs: picks.map((p, i) => ({ pack: i + 1, why: p.why, target: p.target.key, party: p.party, seed: p.seed, won: p.won, winning: winning.get(p.target.key) ?? [] })) }, null, 1));
      console.log(`\nFeel check: ${picks.length} reading packs and the sheet in ${join(dir, "feel")}. Save the reader's answers as answers.md there, then --score it.`);
    }
  } else {
    const { results, others, versus } = runVersions(s, raw, combat);
    const ms = performance.now() - t0;
    const digest = progressionDigest(results, ms, ENGINE_VERSION, before, versus);
    console.log(digest);
    write(join(dir, "digest.txt"), digest + "\n");
    write(join(dir, "results.json"), JSON.stringify({ ...results, others, versus }, null, 1));
    write(join(dir, "headline.json"), JSON.stringify(progressionHeadline(results), null, 1));
    if (args.includes("--report")) write(join(dir, "report-draft.md"), progressionDraft(results, ENGINE_VERSION));
  }
  console.log(`\nWrote ${dir}/`);
}

function score(answers: string | undefined) {
  if (!answers) throw new Error("usage: npm run study -- --score out/<id>/feel/answers.md");
  const key = read(join(dirname(answers), "key.json"));
  const result = scoreColours(readFileSync(answers, "utf8"), key.packs, new Map(key.classes));
  for (const r of result.rows) console.log(`Pack ${r.pack}: guessed ${r.guess || "nothing"}: ${r.wins ? "a colour that wins" : "not a winning colour"}`);
  console.log(`In ${result.right} of ${result.lost} lost runs, the reader guessed a colour that wins.`);
  write(join(dirname(answers), "score.json"), JSON.stringify(result, null, 1));
}
