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
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { ENGINE_VERSION } from "./engine/run.js";
import { standin } from "./engine/standin.js";
import { runCombat } from "./sim/combat.js";
import { build, ladder, patch } from "./sim/content.js";
import { pickRuns, readingPack, scoreColours, sheet } from "./sim/feel.js";
import { runVersions } from "./sim/progression.js";
import { combatDigest, combatDraft, combatHeadline, progressionDigest, progressionDraft, progressionHeadline } from "./sim/report.js";
import { Study } from "./sim/study.js";

const args = process.argv.slice(2);
const read = (p: string) => JSON.parse(readFileSync(p, "utf8"));
const write = (p: string, s: string) => (mkdirSync(dirname(p), { recursive: true }), writeFileSync(p, s));

if (args[0] === "--score") score(args[1]);
else run(args.find((a) => !a.startsWith("--")));

function run(file: string | undefined) {
  if (!file) throw new Error("usage: npm run study -- <study.json> [--report] [--feel] [--final]");
  const s = Study.parse(read(file));
  if (s.heldOut && !args.includes("--final")) throw new Error(`${s.id} is held out: it only runs for the final check, with --final`);
  const raw = read(s.content.pack);
  const dir = join("out", s.id);
  const before = existsSync(join(dir, "headline.json")) ? read(join(dir, "headline.json")) : null;
  const t0 = performance.now();
  if (s.level === "combat") {
    const wantRuns = args.includes("--feel") || args.includes("--report");
    const { results, kept } = runCombat(s, raw, standin, { keep: wantRuns });
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
      picks.forEach((p, i) => write(join(dir, "feel", `pack-${i + 1}.md`), readingPack(c, standin, p, i + 1)));
      write(join(dir, "feel", "sheet.md"), sheet(c, picks.length));
      write(join(dir, "feel", "key.json"), JSON.stringify({ classes: c.pack.classes.map((x) => [x.name.toLowerCase(), x.id]), packs: picks.map((p, i) => ({ pack: i + 1, why: p.why, target: p.target.key, party: p.party, seed: p.seed, won: p.won, winning: winning.get(p.target.key) ?? [] })) }, null, 1));
      console.log(`\nFeel check: ${picks.length} reading packs and the sheet in ${join(dir, "feel")}. Save the reader's answers as answers.md there, then --score it.`);
    }
  } else {
    const { results, others, versus } = runVersions(s, raw, standin);
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
