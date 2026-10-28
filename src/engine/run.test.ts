import { test } from "vitest";
import assert from "node:assert/strict";
import { fingerprint } from "./rng.js";
import {
  advance, answer, ENGINE_VERSION, firstOption, loadRun, newRun, play, randomPicker, replay, saveRun,
  type Picker, type Rules, type RunInput,
} from "./run.js";
import { combat } from "./combat/rules.js";
import { playerView, printLog } from "./log.js";
import { boostRules, content as c, DUNGEON, PARTY, parties } from "./testkit.js";

const input = (seed: number, party = PARTY): RunInput => ({ dungeon: DUNGEON, party, seed });
const logOf = (run: { log: unknown }) => JSON.stringify(run.log);

/** Play a run, saving to JSON and loading it back at every decision. */
function playResumed(rules: Rules, inp: RunInput, picker: Picker) {
  let run = advance(c, rules, newRun(c, rules, inp, { log: true }));
  while (run.pending) {
    run = loadRun(saveRun(run));
    advance(c, rules, answer(c, rules, run, picker(run.pending!, run)));
  }
  return run;
}

test("replay: 10,000 seeded runs rebuild an identical log from their record", () => {
  const ps = parties();
  for (let seed = 1; seed <= 10_000; seed++) {
    const run = play(c, combat, input(seed, ps[seed % ps.length]), randomPicker(seed), { log: true });
    const again = replay(c, combat, JSON.parse(JSON.stringify(run.record)), { log: true });
    assert.equal(fingerprint(logOf(again)), fingerprint(logOf(run)), `seed ${seed}`);
    assert.equal(again.outcome, run.outcome);
  }
}, 120_000);

test("resume: a run saved and loaded at every decision gives the same log as one played straight through", () => {
  for (const rules of [combat, boostRules(), boostRules({ stance: true })]) {
    for (let seed = 1; seed <= 300; seed++) {
      const straight = play(c, rules, input(seed), randomPicker(seed), { log: true });
      const resumed = playResumed(rules, input(seed), randomPicker(seed));
      assert.equal(logOf(resumed), logOf(straight), `${rules.id} seed ${seed}`);
    }
  }
});

test("a decision can pause a fight between turns, and the run saves mid-fight", () => {
  const rules = boostRules({ stance: true });
  const run = advance(c, rules, newRun(c, rules, input(5)));
  assert.equal(run.pending?.kind, "stance");
  assert.ok(run.fight, "paused inside a fight");
  const saved = loadRun(saveRun(run));
  advance(c, rules, answer(c, rules, run, "charge"));
  advance(c, rules, answer(c, rules, saved, "charge"));
  assert.deepEqual(saved, run);
});

test("the record holds what's needed to replay: versions, content, party, dungeon, seed and every decision", () => {
  const run = play(c, combat, input(11), randomPicker(11));
  const r = run.record;
  assert.equal(r.engine, ENGINE_VERSION);
  assert.equal(r.rules, combat.id);
  assert.deepEqual(r.content, { id: c.pack.id, fingerprint: c.fingerprint });
  assert.deepEqual(r.party, PARTY);
  assert.equal(r.dungeon, DUNGEON);
  assert.equal(r.seed, 11);
  assert.deepEqual(r.decisions.map((d) => d.at), ["pick_1", "pick_2", "pick_3"].slice(0, r.decisions.length));
  assert.ok(JSON.stringify(r).length < 1000, "small enough to keep with every run's summary");
});

test("replay refuses a record from another version, and one whose decisions don't fit", () => {
  const run = play(c, combat, input(2), firstOption);
  assert.throws(() => replay(c, combat, { ...run.record, engine: "0.0" }), /can't replay/);
  assert.throws(() => replay(c, combat, { ...run.record, content: { ...run.record.content, fingerprint: "x" } }), /can't replay/);
  const wrong = { ...run.record, decisions: [{ at: "pick_2", pick: "keen_eyes" }] };
  assert.throws(() => replay(c, combat, wrong), /diverged/);
});

test("answers must be one of the options", () => {
  const run = advance(c, combat, newRun(c, combat, input(3)));
  assert.equal(run.pending?.kind, "perk");
  assert.throws(() => answer(c, combat, run, "not_a_perk"), /isn't an option/);
  assert.throws(() => answer(c, combat, newRun(c, combat, input(3)), "keen_eyes"), /no decision/);
});

test("a decision with no options is skipped, not asked", () => {
  const rules: Rules = { ...combat, stage: (_x, stage) => ({ kind: "perk", at: stage.id, options: [] }) };
  const run = advance(c, rules, newRun(c, rules, input(1), { log: true }));
  assert.equal(run.pending, null);
  assert.ok(run.outcome);
  assert.ok(!run.log!.some((e) => e.t === "offer"));
});

test("bad input is refused before the run starts", () => {
  assert.throws(() => newRun(c, combat, { ...input(1), dungeon: "nowhere" }), /unknown dungeon/);
  assert.throws(() => newRun(c, combat, { ...input(1), seed: 1.5 }), /whole number/);
  const tooBig = { ...PARTY, units: [...PARTY.units, { ...PARTY.units[0], class: "cleric", position: "right_shield", abilities: ["mend", "purify", "blessed_ward"] }] };
  assert.throws(() => newRun(c, combat, input(1, tooBig)), /invalid party/);
});

test("end to end: every party of 1 to 3 units, in every formation, over 100 seeds", () => {
  let runs = 0;
  for (const party of parties()) {
    for (let seed = 1; seed <= 100; seed++) {
      const run = play(c, combat, input(seed, party), randomPicker(seed));
      assert.ok(run.outcome);
      assert.equal(run.pending, null);
      assert.equal(run.loot.length > 0, run.outcome === "won");
      runs++;
    }
  }
  assert.equal(runs, 70 * 100);
});

test("loot rolls from the first-clear table on a first clear, and the replay table after", () => {
  const rules = boostRules();
  const pickBig: Picker = (d) => d.options.reduce((a, b) => (bonus(b) > bonus(a) ? b : a));
  const pool = c.dungeons.get(DUNGEON)!.perkPool;
  const bonus = (p: string) => pool.indexOf(p) % 4;
  const loot = c.dungeons.get(DUNGEON)!.loot!;
  let wins = 0;
  for (let seed = 1; seed <= 200; seed++) {
    for (const firstClear of [true, false]) {
      const run = play(c, rules, { ...input(seed), firstClear }, pickBig);
      if (run.outcome !== "won") continue;
      wins++;
      const t = firstClear ? loot.firstClear : loot.replay;
      const rolled = run.loot.slice(t.guaranteed?.length ?? 0);
      assert.deepEqual(run.loot.slice(0, t.guaranteed?.length ?? 0), t.guaranteed ?? []);
      assert.equal(rolled.length, t.rolls);
      for (const g of rolled) assert.ok(t.table!.some((e) => e.gear === g));
    }
  }
  assert.ok(wins > 50, `the boosted party should win often enough to test loot (won ${wins})`);
});

test("the log marks every entry player-visible or hidden, and prints", () => {
  const run = play(c, combat, input(1), firstOption, { log: true });
  const log = run.log!;
  assert.equal(log[0].t, "run");
  assert.equal(log[0].vis, "hidden");
  assert.ok(log.every((e) => e.vis === "player" || e.vis === "hidden"));
  const seen = playerView(log);
  assert.ok(seen.length > 0 && seen.length < log.length);
  assert.ok(seen.every((e) => !["roll", "dice", "run"].includes(e.t)));
  const text = printLog(log);
  assert.match(text, /Fight den_mouth/);
  assert.match(text, / rolls /);
  assert.doesNotMatch(printLog(log, { hidden: false }), / rolls /);
});

test("logging off changes nothing but the log", () => {
  for (let seed = 1; seed <= 200; seed++) {
    const on = play(c, combat, input(seed), randomPicker(seed), { log: true });
    const off = play(c, combat, input(seed), randomPicker(seed));
    assert.equal(off.log, null);
    assert.deepEqual({ ...off, log: null }, { ...on, log: null });
  }
});

test("pinned run: any change here means old records replay differently, so bump ENGINE_VERSION", () => {
  const run = play(c, combat, input(1), firstOption, { log: true });
  assert.equal(ENGINE_VERSION, "0.14"); // Step 5g: head starts by share, several conditions, MP conditions, status_capped and `owner`; the fixture has none of them, so its log is unchanged.
  // The rogue mode's damage kind on each dmg entry changed the log, not the outcome (without it: 056750183aee1680), and so did
  // the balance sheet's `raw` (the amount before Armor or resistance) on each dmg entry (without it: af822ab1ad6d015c).
  assert.equal(fingerprint(JSON.stringify(run.log!.slice(1))), "c51584387a7a12ec");
});
