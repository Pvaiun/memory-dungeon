import { test } from "vitest";
import assert from "node:assert/strict";
import { explore } from "./explore.js";
import { advance, answer, newRun, play, type Picker, type RunInput } from "./run.js";
import { standin } from "./standin.js";
import { boostRules, content as c, DUNGEON, PARTY } from "./testkit.js";

const input = (seed: number): RunInput => ({ dungeon: DUNGEON, party: PARTY, seed });

test("the worked example's 3 picks give 27 paths for the cost of 40 fights", () => {
  for (let seed = 1; seed <= 20; seed++) {
    const ex = explore(c, standin, input(seed));
    // Every path reaches the boss only if nobody's wiped before it; with this party they all do.
    assert.equal(ex.paths.length, 27, `seed ${seed}`);
    assert.equal(ex.fights, 1 + 3 + 9 + 27);
    assert.equal(new Set(ex.paths.map((p) => p.picks.join())).size, 27, "every combination once");
  }
});

test("with a decision that changes stats, the paths' outcomes differ", () => {
  const rules = boostRules();
  let mixed = 0;
  for (let seed = 1; seed <= 20; seed++) {
    const ex = explore(c, rules, input(seed));
    const outcomes = new Set(ex.paths.map((p) => `${p.outcome}/${p.hpLeft}`));
    assert.ok(outcomes.size > 1, `seed ${seed}: all 27 paths ended the same`);
    if (new Set(ex.paths.map((p) => p.outcome)).size > 1) mixed++;
  }
  assert.ok(mixed > 0, "some seed has both wins and losses across its paths");
});

test("a path the explorer finds plays out the same when played straight through", () => {
  const rules = boostRules();
  const ex = explore(c, rules, input(4));
  for (const path of ex.paths) {
    let i = 0;
    const run = play(c, rules, input(4), () => path.picks[i++]);
    assert.equal(run.outcome, path.outcome);
    assert.equal(run.party.reduce((s, u) => s + u.hp, 0), path.hpLeft);
  }
});

test("an earlier answer doesn't change a later fight's dice", () => {
  const rules = boostRules();
  const dice = (firstPick: number) => {
    const picker: Picker = (d) => (d.at === "pick_1" ? d.options[firstPick] : d.options[0]);
    const run = play(c, rules, input(8), picker, { log: true });
    return {
      start: run.log!.find((e) => e.t === "dice" && e.label === "fight:the_den"),
      boss: JSON.stringify(run.log!.slice(run.log!.findIndex((e) => e.t === "fight_start" && e.stage === "the_den"))),
    };
  };
  const [a, b] = [dice(0), dice(2)];
  assert.ok(a.start && b.start);
  assert.deepEqual(a.start, b.start, "the boss fight starts from the same dice");
  assert.notEqual(a.boss, b.boss, "but the fight itself plays differently, because the party differs");
});

test("the explorer branches on decisions inside fights too", () => {
  const ex = explore(c, boostRules({ stance: true }), input(1));
  // 4 fights with an opening stance (2 options) and 3 perk picks (3 options), where nobody is wiped early.
  assert.ok(ex.paths.length > 27);
  assert.ok(ex.paths.every((p) => p.picks.length >= 1));
  assert.ok(ex.paths.some((p) => p.picks.includes("charge")));
});

test("the explorer stops at maxPaths and says so", () => {
  const ex = explore(c, standin, input(1), { maxPaths: 5 });
  assert.equal(ex.paths.length, 5);
  assert.equal(ex.truncated, true);
});

test("branching leaves the parent run untouched", () => {
  const run = advance(c, standin, newRun(c, standin, input(6)));
  const before = JSON.stringify(run);
  explore(c, standin, input(6));
  answer(c, standin, structuredClone(run), run.pending!.options[1]);
  assert.equal(JSON.stringify(run), before);
});
