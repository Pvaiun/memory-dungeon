/**
 * The harness, against the design's predictions, on step 4's combat: the same
 * study gives the same numbers, no made-up effects, real effects show, shared
 * seeds pay off, and reading packs don't leak stats. Progression is in
 * progression.test.ts.
 */
import { test } from "vitest";
import assert from "node:assert/strict";
import { combat as rules } from "../engine/combat/rules.js";
import { randomPicker } from "../engine/run.js";
import pack from "../../fixtures/hollow.pack.json" with { type: "json" };
import { assemble, contents, jobs, runCombat, runJob, type Piece } from "./combat.js";
import { build, ladder, patch } from "./content.js";
import { pickRuns, readingPack, scoreColours } from "./feel.js";
import { measure, probe } from "./measure.js";
import { everything, make } from "./parties.js";
import { combatDigest } from "./report.js";
import { CombatStudy } from "./study.js";
import { compare, rate, sd } from "./sure.js";

const LADDER = [0.3, 0.4, 0.5, 0.6, 0.7, 0.8];
const combat = (extra: object = {}) =>
  CombatStudy.parse({
    id: "t",
    level: "combat",
    content: { pack: "fixtures/hollow.pack.json", ladder: LADDER },
    targets: { dungeons: ["hollow_of_the_grey_mother_6"], challenges: false },
    parties: { formations: "first" },
    seeds: 40,
    perkSeeds: 10,
    ...extra,
  });

test("ranges and comparisons", () => {
  const r = rate(62, 100);
  assert.ok(r.lo > 0.52 && r.lo < 0.53 && r.hi > 0.70 && r.hi < 0.71, JSON.stringify(r));
  assert.deepEqual(rate(0, 0), { value: 0, lo: 0, hi: 1 });
  const xs = Array.from({ length: 200 }, (_, i) => (i * 7919) % 13);
  assert.equal(compare(xs, xs).verdict, "identical");
  assert.equal(compare(xs.map((x) => x + 1), xs).verdict, "higher");
  assert.equal(compare(xs, xs.map((x) => x + 1)).holds, 20);
  // Noise with no real difference: a shuffled copy.
  const ys = xs.map((_, i) => xs[(i * 37) % xs.length]);
  assert.equal(compare(xs, ys).verdict, "no clear difference");
});

test("the same study gives the same numbers", () => {
  const s = combat({ seeds: 20, perkSeeds: 0 });
  const a = runCombat(s, pack, rules).results, b = runCombat(s, pack, rules).results;
  assert.deepEqual(a, b);
});

test("a study's jobs give the same numbers in any order, as when shared out between threads", () => {
  const s = combat({ seeds: 20, perkSeeds: 4, effectSeeds: 20, targets: { dungeons: ["hollow_of_the_grey_mother_4", "hollow_of_the_grey_mother_6"], challenges: true } });
  const cs = contents(s, pack);
  const js = jobs(s, cs);
  const pieces: Piece[] = [];
  for (const i of js.map((_, i) => i).reverse()) pieces[i] = structuredClone(runJob(s, cs, rules, js[i], { keep: true }));
  assert.deepEqual(assemble(s, cs, rules, js, pieces, { keep: true }), runCombat(s, pack, rules, { keep: true }));
});

/** The pack with formations and perks that do nothing, so tweaks to them must change nothing. */
function neutral(raw: any) {
  const p = structuredClone(raw);
  for (const f of p.formations) {
    delete f.stats;
    delete f.statuses;
    for (const pos of f.positions) delete pos.stats, delete pos.statuses;
  }
  for (const k of p.perks) (k.stats = [{ stat: "accuracy", flat: 0 }]), delete k.statuses;
  return p;
}

test("no made-up effects: formations and perks that do nothing compare as identical, and the four perk numbers match", () => {
  const { results } = runCombat(combat({ effectSeeds: 20, targets: { dungeons: ["hollow_of_the_grey_mother_4"], challenges: false } }), neutral(pack), rules);
  const v = results.variants[0];
  assert.equal(v.tweaks.find((e) => e.factor === "formation")!.comparison.verdict, "identical");
  for (const p of v.targets[0].perks) {
    for (const k of ["knowable", "random", "worst"] as const) assert.ok(Math.abs(p.hindsight - p[k]) < 1e-9, `${p.party} ${k}`);
  }
});

test("real effects show: formation, gear and abilities change results, and so do class and party size", () => {
  const { results } = runCombat(combat({ effectSeeds: 20 }), pack, rules);
  const v = results.variants[0];
  const tweak = (f: string) => v.tweaks.find((e) => e.factor === f)!.comparison;
  for (const f of ["formation", "gear", "abilities"]) {
    assert.notEqual(tweak(f).verdict, "identical", f);
    assert.notEqual(tweak(f).verdict, "no clear difference", f);
  }
  const t = v.targets[0];
  assert.equal(t.classes.find((e) => e.factor === "has a cleric")!.comparison.verdict, "higher");
  for (const e of t.sizes) assert.equal(e.comparison.verdict, "higher", e.factor);
  assert.ok(t.strictness.winning.includes("cleric+ranger+warrior"));
});

test("shared seeds: copies of a party match exactly; a tweak needs far fewer runs to judge, and so does another party sharing units", () => {
  const c = build(pack), tweaked = build(patch(pack, [{ path: "classes/ranger/stats/attack", add: 1 }]));
  const pr = probe(rules);
  const owned = everything(c);
  const d = "hollow_of_the_grey_mother";
  const A = make(c, owned, ["warrior", "ranger", "duelist"], "open_order");
  const B = make(c, owned, ["warrior", "ranger"], "open_order");
  const runs = (cc: typeof c, p: typeof A, offset: number) => Array.from({ length: 300 }, (_, i) => measure(cc, pr, { dungeon: d, party: p, seed: i + 1 + offset }, randomPicker(i + 1 + offset)).progress);
  const a = runs(c, A, 0);
  assert.equal(compare(a, runs(c, structuredClone(A), 0)).verdict, "identical");
  // Runs needed for the same certainty scale with the variance of the difference.
  const saving = (x: number[], y: number[], yApart: number[]) => (sd(x.map((v, i) => v - yApart[i])) / sd(x.map((v, i) => v - y[i]))) ** 2;
  assert.ok(saving(a, runs(tweaked, A, 0), runs(tweaked, A, 10_000)) > 4, "a tweak to one party");
  // Each unit has its own dice, so the same seed brings the same luck to the same unit whatever else is in the party.
  assert.ok(saving(a, runs(c, B, 0), runs(c, B, 10_000)) > 1.3, "another party that shares units");
});

test("variants: a what-if runs on the same seeds and is compared to the baseline", () => {
  const s = combat({ perkSeeds: 0, variants: [{ name: "as is" }, { name: "rangers x2 HP", patch: [{ path: "classes/ranger/stats/max_hp", mul: 2 }] }] });
  const { results } = runCombat(s, pack, rules);
  assert.equal(results.variants[1].versus![0].progress.verdict, "higher");
  assert.throws(() => patch(pack, [{ path: "classes/nobody/stats/max_hp", mul: 2 }]));
});

test("feel: reading packs show what a player sees, never enemy HP or stats", () => {
  const s = combat({ perkSeeds: 0, seeds: 20, targets: { dungeons: "all", challenges: false } });
  const { results, kept } = runCombat(s, pack, rules, { keep: true });
  const c = build(ladder(pack, LADDER));
  const picks = pickRuns(kept);
  assert.ok(picks.length >= 4);
  assert.ok(picks.some((p) => !p.won) && picks.some((p) => p.won));
  for (const [i, p] of picks.entries()) {
    const text = readingPack(c, rules, p, i + 1);
    assert.doesNotMatch(text, /(Ash Wolf|Bog Wight|Grey Mother)[A-Z ]* (takes|is healed)[^\n]*HP/, "enemy HP is hidden");
    assert.doesNotMatch(text, /\b(max_hp|max_mp|resist:|immune:|crit_chance)|\b(armor|accuracy|evasion|attack|magic|aggro) \d/i, "no stat values");
    assert.match(text, /agile, strong in numbers/);
  }
  assert.ok(combatDigest(results, 1000, "0.1", null).split("\n").length <= 40);
  const key = [{ pack: 1, won: false, winning: ["ranger+warrior"] }, { pack: 2, won: false, winning: ["cleric"] }];
  const scored = scoreColours("## Pack 1\n...\nColour: Ranger, Warrior\n## Pack 2\nColour: Warrior", key, new Map([["warrior", "warrior"], ["ranger", "ranger"], ["cleric", "cleric"]]));
  assert.equal(scored.right, 1);
});
