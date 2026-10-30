/**
 * The campaign's engine changes (steps/05-core-set/5a-campaign): a dungeon's change to every foe, and a lost cast going on
 * cooldown under ruleset.lostCast; and the campaign helpers the interface and simulations share.
 */
import { test } from "vitest";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { arena } from "./arena.js";
import { combat } from "./rules.js";
import { advanceOnce, loadContent, newRun } from "../run.js";
import type { CFight } from "./fight.js";
import { campaign, meets, ownedAt, rewardsOf, unmet } from "../../campaign.js";

const at = (ticks: number) => ticks * 1000;
const debuff = (id: string, x: object) => ({ id, name: id.toUpperCase(), label: "debuff", show: "icon", stacking: "refresh", ...x });
const giver = (id: string, status: string, x: object = {}) => ({ id, cast: 0, recovery: 0, cooldown: 1000, do: [{ op: "apply", status, ...x }] });
const smash = { id: "smash", cast: 10, cooldown: 20, do: [{ op: "damage", type: "physical", amount: 1 }] };
const interrupt = debuff("interrupt", { lockout: { covers: "all", interrupt: true } });

test("lostCast cooldown: an interrupted cast spends no MP but goes on cooldown, instead of restarting at once", () => {
  const a = arena({ party: [{ name: "A", abilities: ["kick"] }], enemies: [{ name: "Ogre", abilities: ["smash"] }], statuses: [interrupt], abilities: [smash, giver("kick", "interrupt", { duration: 0 })], ruleset: { lostCast: "cooldown" } });
  a.unit("A").acts.find((x) => x.id === "kick")!.ready = at(5);
  a.unit("Ogre").acts.find((x) => x.id === "smash")!.ready = at(1);
  a.to(40);
  assert.deepEqual(a.entries("interrupt").map((e) => e.at), [at(5)]);
  const casts = a.entries("cast", (e) => e.act === "smash").map((e) => e.at as number);
  assert.equal(casts[0], at(1));
  assert.ok(casts[1] >= at(25), `the second Smash starts a whole cooldown after the interrupt, at ${casts[1]}`);
});

test("lostCast cooldown: an action whose targets are gone when it resolves costs the unit its recovery, so it doesn't loop as fast", () => {
  const zap = { id: "zap", cast: 2, cooldown: 10, target: { side: "foes", where: { has: "mark" } }, do: [{ op: "damage", type: "magical", amount: 1 }] };
  const mark = debuff("mark", {});
  const run = (lostCast: "retry" | "cooldown") => arena({ party: [{ name: "A", abilities: ["zap"] }], enemies: [{ name: "T", stats: { max_hp: 1e6 } }], statuses: [mark], abilities: [zap], ruleset: { lostCast } }).to(21);
  const loops = run("retry").entries("fail", (e) => e.act === "zap").length;
  const once = run("cooldown").entries("fail", (e) => e.act === "zap").length;
  assert.ok(loops >= 4, `retry fails again and again (${loops})`);
  assert.ok(once >= 1 && once < loops, `with lostCast cooldown it fails less often (${once} against ${loops})`);
});

const raw = JSON.parse(readFileSync("content/core-set.pack.json", "utf8"));

test("foes: a dungeon's change to every foe raises their HP, sets their power and adds its statuses at fight start", () => {
  const pack = structuredClone(raw);
  const d = pack.dungeons.find((x: { id: string }) => x.id === "old_road");
  d.foes = { hp: 50, power: 20, statuses: ["haste"] };
  const c = loadContent(pack);
  const plain = loadContent(raw);
  const run = newRun(c, combat, { dungeon: "old_road", party: { formation: "neutral", units: [{ class: "knight", position: "left", abilities: ["fortify", "stand_fast", "shield_bash"], gear: { weapon: "plain_sword" } }] }, seed: 1 }, { checked: true });
  while (!run.fight) advanceOnce(c, combat, run);
  advanceOnce(c, combat, run);
  const f = run.fight as CFight;
  const bandit = f.units.find((u) => u.ref === "bandit")!;
  assert.equal(bandit.stats.max_hp, plain.enemies.get("bandit")!.stats.max_hp * 1.5);
  assert.equal(bandit.stats.power, 20);
  assert.ok(bandit.statuses.some((s) => s.id === "haste"));
  assert.ok(f.units.filter((u) => u.side === "party").every((u) => !u.statuses.some((s) => s.id === "haste") && (u.stats.power ?? 0) === 0), "the party is untouched");
});

test("campaign: what's owned grows by each node's rewards, a new class brings its plain weapon, and needs are checked", () => {
  const c = loadContent(raw);
  const cp = campaign(c);
  const start = ownedAt(c, 0);
  assert.deepEqual(start.classes, ["knight", "cleric", "ranger"]);
  assert.ok(start.gear.includes("plain_sword") && start.gear.includes("plain_bow"));
  const i = cp.nodes.findIndex((n) => n.rewards.classes.includes("pyromancer"));
  assert.ok(ownedAt(c, i + 1).classes.includes("pyromancer") && !ownedAt(c, i).classes.includes("pyromancer"));
  assert.ok(rewardsOf(c, i).gear.includes("plain_staff"));
  const everything = ownedAt(c, cp.nodes.length);
  assert.equal(everything.classes.length, c.pack.classes.length);
  assert.equal(everything.gear.length, c.pack.gear.length);
  // Step 5i (the retire): no node needs a formation now (theirs were retired), so a trial is given one here.
  const trial = { ...cp.nodes.find((n) => n.kind === "trial")!, needs: [{ formation: "wedge" }] };
  const party = { formation: "neutral", units: [{ class: "knight", position: "left", abilities: [], gear: {} }] };
  assert.ok(unmet(c, trial, party).length > 0);
  assert.ok(meets(c, { armor: "none" }, party));
  assert.ok(!meets(c, { includes: ["cleric"] }, party));
});

test("stagger: copies of the same enemy start a fight 1.5 ticks apart, so a pack ripples instead of volleying", () => {
  const pack = structuredClone(raw);
  delete pack.ruleset.opening; // the opening roll adds to each copy's start; this test reads the stagger alone
  const c = loadContent(pack);
  const run = newRun(c, combat, { dungeon: "old_road", party: { formation: "neutral", units: [{ class: "knight", position: "left", abilities: ["fortify", "stand_fast", "shield_bash"], gear: { weapon: "plain_sword" } }] }, seed: 1 }, { checked: true });
  while (!run.fight) advanceOnce(c, combat, run);
  advanceOnce(c, combat, run);
  const bandits = (run.fight as CFight).units.filter((u) => u.ref === "bandit").map((u) => u.acts.find((a) => a.id === "basic")!.ready);
  assert.equal(bandits.length, 3);
  assert.deepEqual(bandits.map((r) => r - bandits[0]), [0, 1500, 3000]);
});

test("enrage: past `after` ticks every hit deals pct % more, and more again every `every` ticks, on both sides", () => {
  const a = arena({ party: [{ name: "A", weapon: { type: "physical", cooldown: 5, amount: 100 } }], enemies: [{ name: "T", stats: { max_hp: 1e6 } }], ruleset: { enrage: { after: 10, every: 10, pct: 50 } } }).to(36);
  assert.deepEqual(a.hits("T").map((e) => e.amount), [100, 100, 150, 200, 200, 250, 250], "100 until t10, then +50% for each 10 ticks begun");
  assert.equal(a.entries("enrage").length, 1);
});

test("a pausing lockout (Stun): a wind-up under way waits it out and then lands, instead of being lost", () => {
  const stun = debuff("stun", { duration: 5, lockout: { covers: "all", pause: true } });
  const a = arena({ party: [{ name: "A", abilities: ["bash"] }], enemies: [{ name: "Ogre", abilities: ["smash"] }], statuses: [stun], abilities: [smash, giver("bash", "stun")] });
  a.unit("A").acts.find((x) => x.id === "bash")!.ready = at(5);
  a.unit("Ogre").acts.find((x) => x.id === "smash")!.ready = at(1);
  a.to(30);
  assert.equal(a.entries("interrupt").length, 0, "nothing is interrupted");
  assert.deepEqual(a.entries("hold").map((e) => [e.at, e.ends]), [[at(5), at(16)]], "the 10-tick wind-up started at 1 is held 5 ticks at tick 5");
  assert.deepEqual(a.entries("act", (e) => e.act === "smash").map((e) => e.at), [at(16)], "and Smash lands at 16, not 11");
});

test("campfire: the run pauses for a choice between two fights; REST gives back HP, FOCUS MP, to everyone standing", () => {
  const pack = structuredClone(raw);
  const d = pack.dungeons.find((x: { id: string }) => x.id === "cmp_old_road");
  // The campfire's mechanism, not the run's balance: foes made weak enough that the starters reach it (step 5h's smaller MP
  // pools left the retired campaign's knobs too hard for them).
  d.foes = { ...(d.foes ?? {}), hp: -80, power: -80 };
  assert.ok(d.stages.some((s: { kind: string }) => s.kind === "campfire"), "every campaign run has a campfire");
  const at = d.stages.findIndex((s: { kind: string }) => s.kind === "campfire");
  assert.equal(at, Math.ceil(d.stages.filter((s: { kind: string; boss?: boolean }) => s.kind === "fight" && !s.boss).length / 2), "after half the regular fights");
  const c = loadContent(pack);
  const party = { formation: "neutral", units: [{ class: "knight", position: "left", abilities: ["fortify", "stand_fast", "shield_bash"], gear: { weapon: "plain_sword" } }, { class: "cleric", position: "center", abilities: ["renew", "cure", "raise"], gear: { weapon: "plain_mace" } }, { class: "ranger", position: "right", abilities: ["barbed_arrow", "frost_arrow", "rending_arrow"], gear: { weapon: "plain_bow" } }] };
  let reached = 0;
  for (const pick of ["rest", "focus"]) {
    // The first seed on which this party reaches the campfire.
    let run = newRun(c, combat, { dungeon: "cmp_old_road", party, seed: 1 }, { checked: true });
    for (let seed = 1; seed < 40; seed++) {
      run = newRun(c, combat, { dungeon: "cmp_old_road", party, seed }, { checked: true });
      while (!run.pending && !run.outcome) advanceOnce(c, combat, run);
      if (run.pending) break;
    }
    if (run.outcome) continue;
    assert.equal(run.pending!.kind, "campfire");
    reached++;
    const m = run.party as unknown as { id: string; hp: number; mp: number; stats: Record<string, number> }[];
    assert.deepEqual(run.pending!.options, ["rest", "focus", ...m.filter((x) => x.hp <= 0).map((x) => `raise:${x.id}`)], "RAISE is one option per fallen member");
    const before = m.map((x) => [x.hp, x.mp]);
    combat.apply({ c, run, log: undefined } as never, run.pending!, pick);
    m.forEach((x, i) => {
      if (before[i][0] <= 0) return assert.equal(x.hp, 0, "a knocked-out member stays down");
      const st = d.stages[at] as { hp: number; mp: number };
      if (pick === "rest") assert.equal(x.hp, Math.min(x.stats.max_hp, before[i][0] + Math.floor((x.stats.max_hp * st.hp) / 100)));
      else assert.equal(x.mp, Math.min(x.stats.max_mp, before[i][1] + Math.floor((x.stats.max_mp * st.mp) / 100)));
    });
  }
  assert.equal(reached, 2, "the party reaches the campfire on some seed");
});

test("campfire RAISE: the fallen member of the player's choice stands up with its share of max HP; nobody else changes", () => {
  const c = loadContent(raw);
  const party = { formation: "neutral", units: [{ class: "knight", position: "left", abilities: ["fortify", "stand_fast", "shield_bash"], gear: { weapon: "plain_sword" } }, { class: "cleric", position: "center", abilities: ["renew", "cure", "raise"], gear: { weapon: "plain_mace" } }, { class: "ranger", position: "right", abilities: ["barbed_arrow", "frost_arrow", "rending_arrow"], gear: { weapon: "plain_bow" } }] };
  const run = newRun(c, combat, { dungeon: "cmp_old_road", party, seed: 1 }, { checked: true });
  const m = run.party as unknown as { id: string; hp: number; mp: number; stats: Record<string, number> }[];
  m[1].hp = 0;
  m[2].hp = 0;
  const st = c.dungeons.get("cmp_old_road")!.stages.find((s) => s.kind === "campfire")!;
  const d = combat.stage({ c, run, log: undefined } as never, st, null as never)!;
  assert.deepEqual(d.options, ["rest", "focus", "raise:p2", "raise:p3"]);
  const knight = m[0].hp;
  combat.apply({ c, run, log: undefined } as never, d, "raise:p3");
  assert.equal(m[2].hp, Math.floor((m[2].stats.max_hp * (st as { revive: number }).revive) / 100), "the Ranger stands with its share");
  assert.equal(m[1].hp, 0, "the Cleric stays down");
  assert.equal(m[0].hp, knight, "the Knight is unchanged");
});
