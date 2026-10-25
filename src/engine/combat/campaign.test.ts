/**
 * The campaign's engine changes (steps/06-campaign): a dungeon's change to every foe, and a lost cast going on
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
const smash = { id: "smash", cast: 10, cooldown: 20, do: [{ op: "damage", type: "physical", subtype: "blunt", amount: 1 }] };
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
  const zap = { id: "zap", cast: 2, cooldown: 10, target: { side: "foes", where: { has: "mark" } }, do: [{ op: "damage", type: "magical", element: "fire", amount: 1 }] };
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
  const run = newRun(c, combat, { dungeon: "old_road", party: { formation: "neutral", units: [{ class: "knight", position: "left", abilities: ["fortify", "protect", "shield_bash"], gear: { weapon: "plain_sword" } }] }, seed: 1 }, { checked: true });
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
  assert.ok(rewardsOf(c, i).gear.includes("plain_fire_staff"));
  const everything = ownedAt(c, cp.nodes.length);
  assert.equal(everything.classes.length, c.pack.classes.length);
  assert.equal(everything.gear.length, c.pack.gear.length);
  const trial = cp.nodes.find((n) => n.needs.some((nd) => "formation" in nd))!;
  const party = { formation: "neutral", units: [{ class: "knight", position: "left", abilities: [], gear: {} }] };
  assert.ok(unmet(c, trial, party).length > 0);
  assert.ok(meets(c, { armor: "none" }, party));
  assert.ok(!meets(c, { includes: ["cleric"] }, party));
});

test("stagger: copies of the same enemy start a fight 1.5 ticks apart, so a pack ripples instead of volleying", () => {
  const c = loadContent(raw);
  const run = newRun(c, combat, { dungeon: "old_road", party: { formation: "neutral", units: [{ class: "knight", position: "left", abilities: ["fortify", "protect", "shield_bash"], gear: { weapon: "plain_sword" } }] }, seed: 1 }, { checked: true });
  while (!run.fight) advanceOnce(c, combat, run);
  advanceOnce(c, combat, run);
  const bandits = (run.fight as CFight).units.filter((u) => u.ref === "bandit").map((u) => u.acts.find((a) => a.id === "basic")!.ready);
  assert.equal(bandits.length, 3);
  assert.deepEqual(bandits.map((r) => r - bandits[0]), [0, 1500, 3000]);
});

test("enrage: past `after` ticks every hit deals pct % more, and more again every `every` ticks, on both sides", () => {
  const a = arena({ party: [{ name: "A", weapon: { type: "physical", subtype: "pierce", cooldown: 5, amount: 100 } }], enemies: [{ name: "T", stats: { max_hp: 1e6 } }], ruleset: { enrage: { after: 10, every: 10, pct: 50 } } }).to(36);
  assert.deepEqual(a.hits("T").map((e) => e.amount), [100, 100, 150, 200, 200, 250, 250], "100 until t10, then +50% for each 10 ticks begun");
  assert.equal(a.entries("enrage").length, 1);
});
