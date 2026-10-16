/**
 * The harness, against the design's predictions: the same study gives the same
 * numbers, no made-up effects, real effects show, shared seeds pay off, and
 * reading packs don't leak stats. Progression is in progression.test.ts.
 */
import { test } from "vitest";
import assert from "node:assert/strict";
import { standin } from "../engine/standin.js";
import { randomPicker } from "../engine/run.js";
import pack from "../../fixtures/hollow.pack.json" with { type: "json" };
import { runCombat } from "./combat.js";
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
  const a = runCombat(s, pack, standin).results, b = runCombat(s, pack, standin).results;
  assert.deepEqual(a, b);
});

test("no made-up effects: formation, gear and abilities change nothing in the stand-in, and perk numbers match", () => {
  const { results } = runCombat(combat({ effectSeeds: 20 }), pack, standin);
  const v = results.variants[0];
  for (const factor of ["formation", "gear", "abilities"]) assert.equal(v.tweaks.find((e) => e.factor === factor)!.comparison.verdict, "identical", factor);
  assert.equal(v.tweaks.find((e) => e.factor === "unit order")!.comparison.verdict, "no clear difference");
  for (const p of v.targets[0].perks) {
    for (const k of ["knowable", "random", "worst"] as const) assert.ok(Math.abs(p.hindsight - p[k]) < 1e-9, `${p.party} ${k}`);
  }
});

test("real effects show: class and party size", () => {
  const { results } = runCombat(combat(), pack, standin);
  const t = results.variants[0].targets[0];
  const has = (f: string) => t.classes.find((e) => e.factor === f)!.comparison;
  assert.equal(has("has a warrior").verdict, "higher");
  assert.equal(has("has a cleric").verdict, "lower");
  for (const e of t.sizes) assert.equal(e.comparison.verdict, "higher", e.factor);
  assert.deepEqual(t.strictness.winning, ["ranger+warrior"]);
});

test("shared seeds: copies of a party match exactly, and a tweak to one party needs fewer runs to judge", () => {
  const raw = ladder(pack, LADDER);
  const c = build(raw), tweaked = build(patch(raw, [{ path: "classes/ranger/stats/attack", add: 1 }]));
  const pr = probe(standin);
  const owned = everything(c);
  const d = "hollow_of_the_grey_mother_6";
  const A = make(c, owned, ["warrior_vanguard", "ranger_archer", "cleric_mender"], "open_order");
  const runs = (cc: typeof c, p: typeof A, offset: number) => Array.from({ length: 300 }, (_, i) => measure(cc, pr, { dungeon: d, party: p, seed: i + 1 + offset }, randomPicker(i + 1 + offset)).progress);
  const a = runs(c, A, 0);
  assert.equal(compare(a, runs(c, structuredClone(A), 0)).verdict, "identical");
  // Runs needed for the same certainty scale with the variance of the difference.
  const same = runs(tweaked, A, 0), other = runs(tweaked, A, 10_000);
  const paired = sd(a.map((x, i) => x - same[i])), apart = sd(a.map((x, i) => x - other[i]));
  assert.ok((apart / paired) ** 2 > 4, `paired ${paired}, apart ${apart}`);
  // Two different parties get no such saving in the stand-in: their units use the fight's dice in a different order.
});

test("variants: a what-if runs on the same seeds and is compared to the baseline", () => {
  const s = combat({ perkSeeds: 0, variants: [{ name: "as is" }, { name: "rangers x2 HP", patch: [{ path: "classes/ranger/stats/max_hp", mul: 2 }] }] });
  const { results } = runCombat(s, pack, standin);
  assert.equal(results.variants[1].versus![0].wins.verdict, "higher");
  assert.throws(() => patch(pack, [{ path: "classes/nobody/stats/max_hp", mul: 2 }]));
});

test("feel: reading packs show what a player sees, never enemy HP or stats", () => {
  const s = combat({ perkSeeds: 0, seeds: 20, targets: { dungeons: "all", challenges: false } });
  const { results, kept } = runCombat(s, pack, standin, { keep: true });
  const c = build(ladder(pack, LADDER));
  const picks = pickRuns(kept);
  assert.ok(picks.length >= 4);
  assert.ok(picks.some((p) => !p.won) && picks.some((p) => p.won));
  for (const [i, p] of picks.entries()) {
    const text = readingPack(c, standin, p, i + 1);
    assert.doesNotMatch(text, /(Ash Wolf|Bog Wight|Grey Mother)[A-Z ]* for \d+ \(/, "enemy HP left is hidden");
    assert.doesNotMatch(text, /\b(defence|accuracy|evasion|max_hp|attack \d)/i);
    assert.match(text, /agile, strong in numbers/);
  }
  assert.ok(combatDigest(results, 1000, "0.1", null).split("\n").length <= 40);
  const key = [{ pack: 1, won: false, winning: ["ranger+warrior"] }, { pack: 2, won: false, winning: ["cleric"] }];
  const scored = scoreColours("## Pack 1\n...\nColour: Ranger, Warrior\n## Pack 2\nColour: Warrior", key, new Map([["warrior", "warrior"], ["ranger", "ranger"], ["cleric", "cleric"]]));
  assert.equal(scored.right, 1);
});
