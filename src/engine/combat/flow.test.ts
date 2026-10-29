/**
 * Step 4's functionality tests, part 1: fight flow, timing, same sub-tick
 * order, actions, targeting and KOs (design sections 1 to 3 and 6). Most tests
 * are the design's Part 2 examples, named as it names them.
 */
import { test } from "vitest";
import assert from "node:assert/strict";
import { arena, weapons } from "./arena.js";

const BAG = { name: "Bag", stats: { max_hp: 1_000_000 } };
const fire = (cast: number, cooldown: number) => ({ id: "fire", cast, cooldown, do: [{ op: "damage", type: "magical", amount: 10 }] });
const dmg = (amount: number) => ({ op: "damage", type: "physical", amount });
const share = (xs: unknown[], x: unknown) => xs.filter((y) => y === x).length / xs.length;

// ─── Timing (section 2) ─────────────────────────────────────────────────────

test("timing: a dagger (cooldown 8) and Fire (cooldown 40): the first swing is at tick 8, and Fire comes up every 45 ticks", () => {
  const a = arena({ party: [{ name: "Mage", weapon: weapons.dagger, abilities: ["fire"] }], enemies: [BAG], abilities: [fire(5, 40)] }).to(140);
  assert.equal(a.acts("Mage", "basic")[0], 8);
  assert.deepEqual(a.entries("cast").map((e) => (e.at as number) / 1000), [40, 85, 130]);
  assert.deepEqual(a.acts("Mage", "fire"), [45, 90, 135]);
});

test("timing: Attack Speed 50 makes the dagger's cooldown 5,333 sub-ticks", () => {
  const a = arena({ party: [{ name: "Rogue", stats: { attack_speed: 50 }, weapon: weapons.dagger }], enemies: [BAG] }).to(16);
  assert.deepEqual(a.acts("Rogue"), [5.333, 10.666, 15.999]);
});

test("timing: Cast Time Reduction 100 halves a cast (Fire's 5 becomes 2.5), and matters most for long casts (Meteor's 30 becomes 15)", () => {
  const meteor = { id: "meteor", cast: 30, cooldown: 100, do: [dmg(1)] };
  const a = arena({ party: [{ name: "Mage", stats: { cast_time_reduction: 100 }, abilities: ["fire", "meteor"] }], enemies: [BAG], abilities: [fire(5, 10), meteor] }).to(130);
  assert.equal(a.acts("Mage", "fire")[0], 12.5);
  assert.equal(a.acts("Mage", "meteor")[0] - (a.entries("cast", (e) => e.act === "meteor")[0].at as number) / 1000, 15);
});

test("timing: a mage holding an axe casts Fire when it's off cooldown, unless it's in the axe's recovery; it waits at most one recovery", () => {
  const a = arena({ party: [{ name: "Mage", weapon: weapons.axe, abilities: ["fire"] }], enemies: [BAG], abilities: [fire(5, 42)] }).to(50);
  assert.deepEqual(a.acts("Mage", "basic"), [20, 40]);
  // Fire is off cooldown at 42, but the swing at 40 has 5 ticks of recovery (25% of 20).
  assert.equal(a.entries("cast")[0].at, 45_000);
});

test("timing: Meteor has cast time 30; a basic attack that comes off cooldown mid-cast waits until Meteor resolves, and its recovery ends", () => {
  const meteor = { id: "meteor", cast: 30, cooldown: 10, do: [dmg(1)] };
  const a = arena({ party: [{ name: "Mage", weapon: weapons.dagger, abilities: ["meteor"] }], enemies: [BAG], abilities: [meteor] }).to(43);
  assert.deepEqual(a.acts("Mage", "meteor"), [40]);
  assert.deepEqual(a.acts("Mage", "basic"), [8, 43], "abilities recover for the ruleset's 3 ticks (decided Oct 20)");
});

test("timing: abilities have a default recovery, about a sword's (3 ticks in the worked example); an ability can state its own", () => {
  const zap = { id: "zap", cast: 0, cooldown: 100, do: [dmg(1)] }, snap = { ...zap, id: "snap", recovery: 0 };
  const a = arena({ party: [{ name: "A", weapon: weapons.dagger, abilities: ["zap"] }, { name: "B", weapon: weapons.dagger, abilities: ["snap"] }], enemies: [BAG], abilities: [zap, snap] });
  a.unit("A").acts[0].ready = a.unit("B").acts[0].ready = 15_000;
  a.to(19);
  // Both swing at 8 and use their ability at 15. The dagger is ready again at 16: B swings then; A is still recovering until 18.
  assert.deepEqual(a.acts("A"), [8, 15, 18]);
  assert.deepEqual(a.acts("B"), [8, 15, 16]);
});

test("timing: Slow (Attack Speed −100) doubles the dagger's cooldown from 8 to 16; its recovery stays 2", () => {
  const a = arena({ party: [{ name: "Rogue", stats: { attack_speed: -100 }, weapon: weapons.dagger }], enemies: [BAG] }).to(16);
  assert.deepEqual(a.acts("Rogue"), [16]);
  assert.equal(a.unit("Rogue").busy, 18_000);
  assert.deepEqual(a.to(40).acts("Rogue"), [16, 32]);
});

test("timing: Haste mid-cooldown: an axe 10 ticks into its 20-tick cooldown gets Attack Speed +100, and the remaining 10 ticks become 5", () => {
  const haste = { id: "haste", name: "HASTE", label: "buff", show: "icon", stacking: "refresh", stats: [{ stat: "attack_speed", flat: 100 }] };
  const cast = { id: "cast_haste", cast: 0, cooldown: 30, target: { side: "others", pick: "all" }, do: [{ op: "apply", status: "haste" }] };
  const a = arena({ party: [{ name: "Fighter", weapon: weapons.axe }, { name: "Bard", abilities: ["cast_haste"] }], enemies: [BAG], statuses: [haste], abilities: [cast] }).to(36);
  assert.deepEqual(a.acts("Fighter"), [20, 35]);
});

test("timing: Attack Speed brings a basic attack to at most 4× its base rate (recovery is 25% of the base cooldown); more does nothing", () => {
  for (const attack_speed of [300, 1000]) {
    const a = arena({ party: [{ name: "Rogue", stats: { attack_speed }, weapon: weapons.dagger }], enemies: [BAG] }).to(8);
    assert.deepEqual(a.acts("Rogue"), [2, 4, 6, 8], `attack speed ${attack_speed}`);
  }
});

test("timing: every action starts the fight on cooldown, as if it had just resolved; Cooldown Reduction 100 halves it", () => {
  const zap = { id: "zap", cast: 0, cooldown: 10, do: [dmg(1)] };
  assert.deepEqual(arena({ party: [{ name: "A", abilities: ["zap"] }], enemies: [BAG], abilities: [zap] }).to(10).acts("A"), [10]);
  assert.deepEqual(arena({ party: [{ name: "A", stats: { cooldown_reduction: 100 }, abilities: ["zap"] }], enemies: [BAG], abilities: [zap] }).to(10).acts("A"), [5, 10]);
});

test("timing: a ready unit starts its first available action: equipped abilities in slot order, then its basic attack", () => {
  const one = { id: "one", cast: 0, cooldown: 10, do: [dmg(1)] }, two = { id: "two", cast: 0, cooldown: 10, do: [dmg(1)] };
  const a = arena({ party: [{ name: "A", weapon: { ...weapons.dagger, cooldown: 10 }, abilities: ["one", "two"] }], enemies: [BAG], abilities: [one, two] }).to(16);
  assert.deepEqual(a.entries("act").map((e) => [e.act, (e.at as number) / 1000]), [["one", 10], ["two", 13], ["basic", 16]]);
});

test("timing: by default a basic attack has no cast time, and an ability has the ruleset's short one", () => {
  const zap = { id: "zap", cooldown: 10, do: [dmg(1)] };
  const a = arena({ party: [{ name: "A", weapon: weapons.dagger, abilities: ["zap"] }], enemies: [BAG], abilities: [zap] }).to(12);
  assert.deepEqual(a.acts("A", "basic"), [8]);
  assert.equal(a.entries("cast", (e) => e.act === "basic").length, 0, "nothing shows channeling a basic attack");
  assert.deepEqual(a.entries("cast", (e) => e.act === "zap").map((e) => [e.at, e.ends]), [[10_000, 11_000]]);
});

// ─── Same sub-tick order (section 2) ────────────────────────────────────────

test("order: the Knight and an Ogre land lethal hits on each other on the same sub-tick; the party batch resolves first, so the Ogre is KO'd and loses its action", () => {
  const a = arena({
    party: [{ name: "Knight", stats: { max_hp: 50, attack: 100 }, weapon: weapons.dagger }],
    enemies: [{ name: "Ogre", stats: { max_hp: 30, attack: 100 }, weapon: weapons.dagger }],
  }).run();
  assert.equal(a.f.result, "won");
  assert.equal(a.unit("Knight").hp, 50);
  assert.equal(a.acts("Ogre").length, 0);
});

test("order: a party unit at 10 HP takes 15 from an enemy and a 10 heal from an ally on the same sub-tick, and ends at 5", () => {
  const mend = { id: "mend", cast: 0, cooldown: 8, target: { side: "others" }, do: [{ op: "heal", amount: 10 }] };
  const a = arena({
    party: [{ name: "Hurt", stats: { max_hp: 100 }, hp: 10 }, { name: "Healer", stats: { forbidden: 1 }, abilities: ["mend"] }],
    enemies: [{ name: "Foe", stats: { attack: 15 }, weapon: weapons.dagger }],
    abilities: [mend],
  }).to(8);
  assert.equal(a.unit("Hurt").hp, 5);
});

test("order: an enemy at 10 HP is KO'd by the party while an enemy healer heals it on the same sub-tick, so the heal goes to another valid ally", () => {
  const mend = { id: "mend", cast: 0, cooldown: 8, target: { side: "allies", pick: "lowest", by: "hp_share" }, do: [{ op: "heal", amount: 10 }] };
  const a = arena({
    party: [{ name: "Knight", stats: { attack: 50 }, weapon: weapons.dagger }],
    enemies: [{ name: "Weak", stats: { max_hp: 100, forced: 1 }, hp: 10 }, { name: "Healer", abilities: ["mend"] }, { name: "Other", stats: { max_hp: 100 }, hp: 50 }],
    abilities: [mend],
  }).to(8);
  assert.ok(a.unit("Weak").ko);
  assert.deepEqual(a.entries("heal").map((e) => [e.target, e.amount]), [[a.unit("Other").id, 10]]);
});

test("order: two party units hit the same enemy on the same sub-tick; the earlier slot resolves first, and if it's lethal the second picks a new target", () => {
  const a = arena({
    party: [{ name: "First", stats: { attack: 50 }, weapon: weapons.dagger }, { name: "Second", stats: { attack: 5 }, weapon: weapons.dagger }],
    enemies: [{ name: "Weak", stats: { max_hp: 10, aggro: 1000 } }, { name: "Strong", stats: { max_hp: 1000 } }],
  }).to(8);
  assert.ok(a.unit("Weak").ko);
  assert.deepEqual(a.hits("Strong").map((e) => e.by), [a.unit("Second").id]);
});

test("order: a Cleric's buff and the Rogue's attack resolve on the same sub-tick; the attack gets the buff only if the Cleric's slot comes first", () => {
  const might = { id: "might", name: "MIGHT", label: "buff", show: "icon", stacking: "refresh", boosts: [{ tag: "physical", pct: 100 }] };
  const bless = { id: "bless", cast: 0, cooldown: 8, target: { side: "others" }, do: [{ op: "apply", status: "might" }] };
  const cleric = { name: "Cleric", stats: { forbidden: 1 }, abilities: ["bless"] }, rogue = { name: "Rogue", stats: { attack: 10 }, weapon: weapons.dagger };
  const run = (party: object[]) => arena({ party, enemies: [BAG], statuses: [might], abilities: [bless] }).to(8).hits("Bag")[0].amount;
  assert.equal(run([cleric, rogue]), 20);
  assert.equal(run([rogue, cleric]), 10);
});

test("order: within a batch, pulses resolve first, then reactions, then actions; the party batch before the enemy batch", () => {
  // At tick 8: the Bag's Poison (a debuff, so it pulses in the party batch), a reaction to a hit the Rogue took at 7.999,
  // the Rogue's own attack, and the enemy's next attack.
  const poison = { id: "poison", name: "POISON", label: "debuff", show: "icon", stacking: "refresh", pulse: { every: 8, do: [{ op: "damage", type: "none", amount: 1 }] } };
  const spikes = { id: "spikes", name: "Spikes", label: "buff", show: "sheet", stacking: "refresh", reactions: [{ on: { event: "hit_taken" }, do: [{ op: "damage", type: "none", amount: 2, to: "other" }] }] };
  const a = arena({
    party: [{ name: "Rogue", stats: { max_hp: 1000, attack: 3 }, weapon: weapons.dagger, statuses: ["spikes"] }],
    enemies: [{ name: "Bag", stats: { max_hp: 1000 }, weapon: { ...weapons.dagger, cooldown: 7.999 }, statuses: ["poison"] }],
    statuses: [poison, spikes],
  }).to(8);
  const at8 = a.log.filter((e) => e.at === 8000 && (e.t === "dmg" || e.t === "act")).map((e) => (e.t === "act" ? `${e.by} acts` : `${e.src} on ${e.target}`));
  assert.deepEqual(at8, ["poison on e1", "spikes on e1", "p1 acts", "basic on e1"]);
});

// ─── Actions (section 3) ────────────────────────────────────────────────────

test("actions: MP is paid when an action resolves; if the unit can't pay then, the action fizzles: no effect, no MP spent, but the cooldown starts (the core set's rule)", () => {
  const bolt = { id: "bolt", mp: 10, cast: 5, cooldown: 10, do: [dmg(50)] };
  const drain = { id: "drain", cast: 0, cooldown: 12, do: [{ op: "mp", amount: -5 }] };
  const a = arena({ party: [{ name: "Mage", stats: { max_mp: 10 }, abilities: ["bolt"] }], enemies: [{ ...BAG, abilities: ["drain"] }], abilities: [bolt, drain] }).to(15);
  assert.deepEqual(a.entries("fail").map((e) => [e.at, e.why]), [[15_000, "mp"]]);
  assert.equal(a.hits("Bag").length, 0);
  assert.equal(a.unit("Mage").mp, 5);
  assert.equal(a.unit("Mage").acts[0].ready, 25_000, "on cooldown as if it had resolved");
});

test("actions: out of MP, an ability is skipped as if on cooldown, and the unit only uses its basic attack", () => {
  const bolt = { id: "bolt", mp: 10, cooldown: 10, do: [dmg(50)] };
  const a = arena({ party: [{ name: "Mage", stats: { max_mp: 0 }, weapon: weapons.dagger, abilities: ["bolt"] }], enemies: [BAG], abilities: [bolt] }).to(40);
  assert.deepEqual(a.entries("act").map((e) => e.act), ["basic", "basic", "basic", "basic", "basic"]);
});

test("actions: Cure checks its condition when it starts and picks its target when it resolves: healed mid-cast, the Knight is no longer lowest, so the Mage gets it", () => {
  const cure = { id: "cure", cast: 5, cooldown: 10, if: { side: "allies", where: { hpBelow: 50 } }, target: { side: "allies", pick: "lowest", by: "hp_share" }, do: [{ op: "heal", amount: 5 }] };
  const patch = { id: "patch", cast: 0, cooldown: 12, target: { side: "allies", pick: "lowest", by: "hp_share" }, do: [{ op: "heal", amount: 50 }] };
  const a = arena({
    party: [{ name: "Knight", stats: { max_hp: 100 }, hp: 40 }, { name: "Mage", stats: { max_hp: 100 }, hp: 60 }, { name: "Cleric", abilities: ["cure"] }, { name: "Squire", abilities: ["patch"] }],
    enemies: [BAG],
    abilities: [cure, patch],
  }).to(15);
  assert.deepEqual(a.entries("heal").map((e) => [e.at, a.f.units.find((u) => u.id === e.target)!.name]), [[12_000, "Knight"], [15_000, "Mage"]]);
});

test("actions: an action whose stated targeting finds nobody when it resolves fails, like one it can't pay for", () => {
  const purge = { id: "purge", cast: 2, cooldown: 10, target: { side: "foes", where: { has: "mark" } }, do: [dmg(5)] };
  const mark = { id: "mark", name: "MARK", label: "debuff", show: "icon", stacking: "refresh", stats: [{ stat: "armor", flat: 0 }] };
  const b = arena({ party: [{ name: "A", abilities: ["purge"] }], enemies: [BAG], statuses: [mark], abilities: [purge] }).to(12);
  assert.deepEqual(b.entries("fail").map((e) => e.why), ["target"]);
  assert.equal(b.hits("Bag").length, 0);
});

// ─── Targeting (section 6) ──────────────────────────────────────────────────

/** Who an enemy's default-targeted attacks land on, over about 2,000 attacks. */
function targets(party: { name: string; stats: Record<string, number> }[], enemy: object = {}) {
  const a = arena({ party: party.map((p) => ({ ...p, stats: { max_hp: 1_000_000, ...p.stats } })), enemies: [{ name: "Foe", stats: { attack: 0 }, weapon: { ...weapons.dagger, cooldown: 1 }, ...enemy }] }).to(2000);
  return a.entries("act", (e) => e.by === "e1").map((e) => a.f.units.find((u) => u.id === (e.targets as string[])[0])!.name);
}
const PARTY = [{ name: "Knight", stats: { aggro: 40 } }, { name: "Mage", stats: { aggro: 10 } }, { name: "Rogue", stats: { aggro: 20 } }, { name: "Cleric", stats: { aggro: 20 } }];
const near = (x: number, want: number) => assert.ok(Math.abs(x - want) < 0.035, `${x.toFixed(3)} isn't near ${want.toFixed(3)}`);

test("targeting: default targeting is weighted by Aggro: Knight 4, Mage 1, Rogue 2, Cleric 2, and the Knight takes 4/9", () => {
  const t = targets(PARTY);
  near(share(t, "Knight"), 4 / 9);
  near(share(t, "Mage"), 1 / 9);
});

test("targeting: with the Mage forbidden, the Knight takes 4/8", () => {
  const t = targets(PARTY.map((p) => (p.name === "Mage" ? { ...p, stats: { ...p.stats, forbidden: 1 } } : p)));
  assert.equal(share(t, "Mage"), 0);
  near(share(t, "Knight"), 4 / 8);
});

test("targeting: with the Knight and a Paladin forced, the Knight takes 4/6 and the Paladin 2/6", () => {
  const party = [...PARTY.map((p) => (p.name === "Knight" ? { ...p, stats: { ...p.stats, forced: 1 } } : p)), { name: "Paladin", stats: { aggro: 20, forced: 1 } }];
  const t = targets(party);
  near(share(t, "Knight"), 4 / 6);
  near(share(t, "Paladin"), 2 / 6);
  assert.equal(share(t, "Mage") + share(t, "Rogue") + share(t, "Cleric"), 0);
});

test("targeting: with every party unit forbidden, all four are tied and the pick uses everyone's Aggro", () => {
  near(share(targets(PARTY.map((p) => ({ ...p, stats: { ...p.stats, forbidden: 1 } }))), "Knight"), 4 / 9);
});

test("targeting: an action with Seek picks by Aggro among all valid targets, Taunt or not", () => {
  const smash = { id: "smash", cast: 0, cooldown: 1, seek: true, do: [dmg(0)] };
  const party = PARTY.map((p) => (p.name === "Mage" ? { ...p, stats: { ...p.stats, forced: 1 } } : p));
  const a = arena({ party: party.map((p) => ({ ...p, stats: { max_hp: 1_000_000, ...p.stats } })), enemies: [{ name: "Foe", abilities: ["smash"] }], abilities: [smash] }).to(2000);
  const t = a.entries("act").map((e) => a.f.units.find((u) => u.id === (e.targets as string[])[0])!.name);
  near(share(t, "Mage"), 1 / 9);
});

test("targeting: an ability with its own targeting rule still obeys the core set's Taunt and Hidden rules: its pick is forced onto a Taunting foe unless it has Seek, and never lands on a Hidden one", () => {
  const snipe = { id: "snipe", cast: 0, cooldown: 1, target: { side: "foes", pick: "lowest", by: { stat: "aggro" } }, do: [dmg(0)] };
  const seek = { ...snipe, id: "seek", seek: true };
  const party = PARTY.map((p) => (p.name === "Mage" ? { ...p, stats: { ...p.stats, forbidden: 1 } } : p.name === "Knight" ? { ...p, stats: { ...p.stats, forced: 1 } } : p));
  const a = arena({ party, enemies: [{ name: "Foe", abilities: ["snipe"] }], abilities: [snipe, seek] }).to(20);
  assert.ok(a.entries("act").every((e) => (e.targets as string[])[0] === a.unit("Knight").id), "forced onto the Taunting Knight");
  const b = arena({ party, enemies: [{ name: "Foe", abilities: ["seek"] }], abilities: [snipe, seek] }).to(20);
  const visible = b.f.units.filter((u) => u.side === "party" && u.name !== "Mage");
  const lowest = Math.min(...visible.map((u) => u.stats.aggro));
  const low = new Set(visible.filter((u) => u.stats.aggro === lowest).map((u) => u.id));
  assert.ok(b.entries("act").every((e) => low.has((e.targets as string[])[0])), "with Seek, the lowest-Aggro unit that isn't Hidden (ties at random)");
});

test("targeting: an enemy channels Smash; during the cast the Knight forces targeting onto itself, and Smash resolves on the Knight", () => {
  const smash = { id: "smash", cast: 10, cooldown: 1, do: [dmg(5)] };
  const taunt = { id: "taunt", name: "TAUNT", label: "buff", show: "icon", stacking: "refresh", duration: 30, stats: [{ stat: "forced", flat: 1 }] };
  const shout = { id: "shout", cast: 0, cooldown: 5, target: "self", do: [{ op: "apply", status: "taunt" }] };
  const a = arena({
    party: [{ name: "Knight", stats: { aggro: 1 }, abilities: ["shout"] }, { name: "Mage", stats: { aggro: 1000 } }],
    enemies: [{ name: "Ogre", abilities: ["smash"] }],
    statuses: [taunt],
    abilities: [smash, shout],
  }).to(11);
  // Smash started at 1, when the Mage was the likely target; the Knight taunted at 5; Smash resolves at 11.
  assert.deepEqual(a.acts("Ogre", "smash"), [11]);
  assert.deepEqual(a.hits("Knight").map((e) => e.amount), [5]);
});

// ─── KOs and the end of a fight (section 1) ─────────────────────────────────

test("KO: a unit KO'd mid-cast loses the action: no MP is spent and its cooldown hasn't started", () => {
  const smash = { id: "smash", mp: 10, cast: 10, cooldown: 1, do: [dmg(5)] };
  const a = arena({
    party: [{ name: "Knight", stats: { attack: 100 }, weapon: weapons.dagger }],
    enemies: [{ name: "Ogre", stats: { max_hp: 50, max_mp: 10 }, abilities: ["smash"] }, BAG],
    abilities: [smash],
  });
  a.unit("Ogre").stats.aggro = 1e6;
  a.to(9);
  const ogre = a.unit("Ogre");
  assert.ok(ogre.ko);
  assert.equal(ogre.mp, 10);
  assert.equal(ogre.cast, null);
  assert.equal(a.entries("act", (e) => e.by === ogre.id).length, 0);
  assert.equal(a.f.queue.filter((it) => it.unit === ogre.id).length, 0);
});

test("KO: the fight ends the moment a side is fully KO'd, and nothing after that resolves", () => {
  const spikes = { id: "spikes", name: "Spikes", label: "buff", show: "sheet", stacking: "refresh", reactions: [{ on: { event: "hit_taken" }, do: [{ op: "heal", amount: 5, to: "holder" }] }] };
  const a = arena({ party: [{ name: "Knight", stats: { attack: 100 }, weapon: weapons.dagger }], enemies: [{ name: "Ogre", stats: { max_hp: 50 }, statuses: ["spikes"] }], statuses: [spikes] }).run();
  assert.equal(a.f.result, "won");
  assert.equal(a.f.now, 8000);
  assert.equal(a.entries("heal").length, 0);
});

test("KO: the fight is lost when every party unit is KO'd", () => {
  const a = arena({ party: [{ name: "Knight", stats: { max_hp: 10 } }], enemies: [{ name: "Ogre", stats: { attack: 100 }, weapon: weapons.dagger }] }).run();
  assert.equal(a.f.result, "lost");
});

test("KO: there's no time limit, but a fight nothing can end stops as a loss: a safety stop, not a design rule", () => {
  // Nobody can hurt anybody: armor eats every hit.
  const a = arena({ party: [{ name: "A", stats: { armor: 100 }, weapon: weapons.dagger }], enemies: [{ name: "B", stats: { armor: 100 }, weapon: weapons.dagger }] }).run();
  assert.equal(a.f.result, "lost");
  assert.deepEqual(a.entries("stop").map((e) => e.why), ["timeout"]);
  // Nobody can act at all.
  const b = arena({ party: [{ name: "A" }], enemies: [{ name: "B" }] }).run();
  assert.deepEqual(b.entries("stop").map((e) => e.why), ["timeout"]);
});
