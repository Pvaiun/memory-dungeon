/**
 * The core set's rules, as functionality tests (docs/core-set/rules-and-vocabulary.md):
 * the Taunt and Hidden rules on stated targeting, Seek, extra strikes, revive,
 * summoning and replacing, Aegis, absorption, the MP fizzle, reactions to a unit's
 * own KO, event filters by tag and status, dispel immunity, Armor's ratio, scales
 * from a condition or a live stat, and the target-phrase extras.
 */
import { test } from "vitest";
import assert from "node:assert/strict";
import { arena, weapons } from "./arena.js";
import { drawOf } from "./fight.js";

const BAG = { name: "Bag", stats: { max_hp: 1_000_000 } };
const dmg = (amount: number, extra: object = {}) => ({ op: "damage", type: "physical", amount, ...extra });
const taunt = { id: "taunt", name: "TAUNT", label: "buff", show: "icon", stacking: "refresh", stats: [{ stat: "forced", flat: 1 }] };
const hidden = { id: "hidden", name: "HIDDEN", label: "buff", show: "icon", stacking: "refresh", unremovable: true, stats: [{ stat: "forbidden", flat: 1 }] };
const burn = { id: "burn", name: "BURN", label: "debuff", show: "icon", stacking: "intensity", pulse: { every: 2, do: [{ op: "damage", type: "none", amount: 1 }] }, drop: { fraction: 0.5 } };
const share = (xs: unknown[], x: unknown) => xs.filter((y) => y === x).length / xs.length;

// ─── The Taunt rule ──────────────────────────────────────────────────────────

test("taunt: a stated rule's first pick is forced onto a Taunting foe, whatever the phrase asks for; Seek gets past it", () => {
  const lowest = { id: "lowest", cast: 0, cooldown: 10, target: { side: "foes", pick: "lowest", by: "hp" }, do: [dmg(1)] };
  const seek = { ...lowest, id: "seek", seek: true };
  const run = (ability: string) =>
    arena({
      party: [{ name: "Hero", abilities: [ability] }],
      enemies: [{ name: "Tank", stats: { max_hp: 1000 }, statuses: ["taunt"] }, { name: "Weak", stats: { max_hp: 10 } }],
      statuses: [taunt], abilities: [lowest, seek],
    }).to(10);
  assert.deepEqual(run("lowest").hits("Tank").length, 1, "the lowest-HP pick goes to the Taunting Tank");
  assert.deepEqual(run("seek").hits("Weak").length, 1, "with Seek it goes to the Weak one");
});

test("taunt: extra targets after the first ignore Taunt (Chain lightning's other foes), and so do extra strikes (Arc)", () => {
  const chain = { id: "chain", cast: 0, cooldown: 10, do: [dmg(1), dmg(1, { to: { side: "foes", pick: "random", count: 3, exclude: "targets" } })] };
  const a = arena({
    party: [{ name: "Caster", abilities: ["chain"] }],
    enemies: [{ name: "Tank", stats: { max_hp: 1000 }, statuses: ["taunt"] }, { name: "A", stats: { max_hp: 1000 } }, { name: "B", stats: { max_hp: 1000 } }],
    statuses: [taunt], abilities: [chain],
  }).to(10);
  assert.equal(a.hits("Tank").length, 1);
  assert.equal(a.hits("A").length + a.hits("B").length, 2, "the other two foes are each hit once, never the first target again");
});

test("taunt: when several units Taunt, foes pick among them weighted by Aggro; a basic attack under the rule too", () => {
  const picks: string[] = [];
  for (let seed = 1; seed <= 60; seed++) {
    const a = arena({
      party: [{ name: "Foe", weapon: weapons.dagger }],
      enemies: [{ name: "Big", stats: { aggro: 30 }, statuses: ["taunt"] }, { name: "Small", stats: { aggro: 10 }, statuses: ["taunt"] }, { name: "Free", stats: { aggro: 1000 } }],
      statuses: [taunt], seed,
    }).to(8);
    picks.push(a.entries("act")[0].targets as unknown as string);
  }
  const names = picks.map((t) => String(t));
  assert.equal(share(names, "e3"), 0, "the free foe is never picked");
  assert.ok(share(names, "e1") > 0.55 && share(names, "e1") < 0.95, `Big takes about 3 in 4 (${share(names, "e1")})`);
});

test("seek: a status can give a unit's basic attacks Seek (Hunter's eye), while its abilities still obey Taunt", () => {
  const eye = { id: "eye", name: "Hunter's eye", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, seek: "basic" };
  const shot = { id: "shot", cast: 0, cooldown: 10, do: [dmg(1)] };
  const a = arena({
    party: [{ name: "Ranger", weapon: weapons.dagger, abilities: ["shot"], statuses: ["eye"] }],
    enemies: [{ name: "Tank", stats: { max_hp: 1000, aggro: 1 }, statuses: ["taunt"] }, { name: "Archer", stats: { max_hp: 1000, aggro: 1000 } }],
    statuses: [taunt, eye], abilities: [shot],
  }).to(10);
  assert.deepEqual(a.entries("act", (e) => e.act === "shot")[0].targets, ["e1"], "the ability is forced onto the Tank");
  assert.deepEqual(a.entries("act", (e) => e.act === "basic")[0].targets, ["e2"], "the basic attack ignores it");
});

// ─── The Hidden rule ─────────────────────────────────────────────────────────

test("hidden: foes can't pick a Hidden unit by any rule, Seek included; only `all` reaches it; its allies still can", () => {
  const lowest = { id: "lowest", cast: 0, cooldown: 10, seek: true, target: { side: "foes", pick: "lowest", by: "hp" }, do: [dmg(1)] };
  const area = { id: "area", cast: 0, cooldown: 10, target: { side: "foes", pick: "all" }, do: [dmg(1)] };
  const mend = { id: "mend", cast: 0, cooldown: 10, target: { side: "allies", pick: "lowest", by: "hp_share" }, do: [{ op: "heal", amount: 5 }] };
  const a = arena({
    party: [{ name: "Rogue", stats: { max_hp: 100 }, hp: 10, statuses: ["hidden"] }, { name: "Knight", stats: { max_hp: 100 } }, { name: "Cleric", stats: { max_hp: 200 }, abilities: ["mend"] }],
    enemies: [{ name: "Sniper", abilities: ["lowest"] }, { name: "Mage", abilities: ["area"] }],
    statuses: [hidden], abilities: [lowest, area, mend],
  }).to(10);
  assert.deepEqual(a.hits("Rogue").map((e) => e.src), ["area"], "only the Area hit reaches the Rogue");
  assert.equal(a.hits("Knight").length, 2);
  assert.deepEqual(a.entries("heal").map((e) => e.target), ["p1"], "its own Cleric still heals it");
});

test("hidden: if every foe is Hidden, foes pick among them anyway (the engine's fallback, so nothing stalls)", () => {
  const a = arena({ party: [{ name: "Rogue", statuses: ["hidden"] }], enemies: [{ name: "Foe", weapon: weapons.dagger }], statuses: [hidden] }).to(8);
  assert.equal(a.hits("Rogue").length, 1);
});

// ─── Extra strikes ───────────────────────────────────────────────────────────

test("double strike: a chance, read from a stat, that a basic attack hits twice; the second strike is a hit of kind extra, and it doesn't chain", () => {
  const ds = { id: "double_strike", name: "Double strike", label: "buff", show: "stat", stacking: "refresh", unremovable: true, strike: { scale: "double_strike", to: "target" } };
  const counts = { basic: 0, extra: 0 };
  const palm = { id: "palm", name: "Iron palm", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, reactions: [{ on: { event: "hit_lands", kind: "extra" }, do: [{ op: "apply", status: "burn", to: "other" }] }] };
  let withBurn = 0, swings = 0;
  for (let seed = 1; seed <= 40; seed++) {
    const a = arena({
      party: [{ name: "Monk", stats: { double_strike: 50 }, weapon: weapons.dagger, statuses: ["double_strike", "palm"] }],
      enemies: [BAG], statuses: [ds, palm, burn], seed,
      stats: [{ id: "double_strike", kind: "points", default: 0, brings: "double_strike" }],
    }).to(9);
    swings++;
    counts.basic += a.hits("Bag").filter((e) => e.part === "hit").length;
    counts.extra += a.hits("Bag").filter((e) => e.part === "extra").length;
    if (a.has("Bag", "burn").length) withBurn++;
  }
  assert.equal(counts.basic, swings);
  assert.ok(counts.extra > 10 && counts.extra < 30, `about half the swings strike twice (${counts.extra} of ${swings})`);
  assert.equal(withBurn, counts.extra, "a reaction to extra hits fires once per extra strike, and never from the strike itself");
});

test("arc: each basic attack also hits a second, random foe, excluding the first target; a second strike never fires another", () => {
  const arc = { id: "arc", name: "Arc", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, strike: { to: { side: "foes", pick: "random", exclude: "targets" } } };
  const a = arena({
    party: [{ name: "Storm", weapon: weapons.dagger, statuses: ["arc"] }],
    enemies: [{ name: "A", stats: { max_hp: 1000 } }, { name: "B", stats: { max_hp: 1000 } }],
    statuses: [arc],
  }).to(8);
  assert.equal(a.hits("A").length + a.hits("B").length, 2);
  assert.equal(a.hits("A").length, 1);
  assert.deepEqual(a.entries("strike").length, 1);
  // Alone, there's no second foe.
  const b = arena({ party: [{ name: "Storm", weapon: weapons.dagger, statuses: ["arc"] }], enemies: [{ name: "A", stats: { max_hp: 1000 } }], statuses: [arc] }).to(8);
  assert.equal(b.hits("A").length, 1);
});

test("extra strikes don't get boosts on basic attacks (Phalanx's triple damage doesn't reach a Double strike's second hit)", () => {
  const phalanx = { id: "phalanx", name: "Phalanx", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, boosts: [{ tag: "basic", pct: 200 }] };
  const ds = { id: "ds", name: "DS", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, strike: { to: "target" } };
  const a = arena({ party: [{ name: "Hoplite", stats: { attack: 10 }, weapon: weapons.dagger, statuses: ["phalanx", "ds"] }], enemies: [BAG], statuses: [phalanx, ds] }).to(8);
  assert.deepEqual(a.hits("Bag").map((e) => [e.part, e.amount]), [["hit", 30], ["extra", 10]]);
});

// ─── Revive ──────────────────────────────────────────────────────────────────

test("revive: raises a knocked-out ally with the stated HP, its fight-start statuses back and every action on cooldown; `ready` skips the cooldowns", () => {
  const raise = { id: "raise", cast: 0, cooldown: 10, if: { side: "allies", where: { ko: true } }, target: { side: "allies", where: { ko: true }, pick: "random" }, do: [{ op: "revive", hp: { scale: [{ ratio: 0.5, stat: "max_hp", of: "target" }] } }] };
  const valhalla = { ...raise, id: "valhalla", do: [{ op: "revive", hp: 1, ready: true }] };
  const guard = { id: "guard", name: "G", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, stats: [{ stat: "armor", flat: 5 }] };
  // A unit made ready by something that resolved this moment starts on the next sub-tick (step 4's rule).
  for (const [id, hp, firstSwing] of [["raise", 50, 18], ["valhalla", 1, 10.001]] as const) {
    const a = arena({
      party: [{ name: "Cleric", abilities: [id] }, { name: "Fallen", stats: { max_hp: 100 }, weapon: weapons.dagger, statuses: ["guard"], ko: true }],
      enemies: [BAG], abilities: [raise, valhalla], statuses: [guard],
    }).to(10);
    const f = a.unit("Fallen");
    assert.equal(f.ko, false, id);
    assert.equal(f.hp, hp, id);
    assert.equal(a.has("Fallen", "guard").length, 1, `${id}: its passive statuses are back`);
    assert.deepEqual(a.entries("revive").map((e) => [e.unit, e.ready]), [["p2", id === "valhalla"]]);
    a.to(20);
    assert.equal(a.acts("Fallen", "basic")[0], firstSwing, `${id}: first swing`);
  }
});

test("revive: the ability waits while nobody is knocked out, and a unit knocked out in the fight can be raised", () => {
  const raise = { id: "raise", cast: 0, cooldown: 5, if: { side: "allies", where: { ko: true } }, target: { side: "allies", where: { ko: true } }, do: [{ op: "revive", hp: 10 }] };
  const a = arena({
    party: [{ name: "Cleric", abilities: ["raise"] }, { name: "Squire", stats: { max_hp: 10, aggro: 1000 } }],
    enemies: [{ name: "Ogre", stats: { attack: 50 }, weapon: { ...weapons.axe, cooldown: 12 } }],
    abilities: [raise],
  }).to(11);
  assert.equal(a.entries("act", (e) => e.act === "raise").length, 0, "nothing to raise yet");
  a.to(12);
  assert.ok(a.unit("Squire").ko);
  a.to(16);
  assert.equal(a.unit("Squire").ko, false);
  assert.equal(a.unit("Squire").hp, 10);
});

// ─── Summoning and replacing ─────────────────────────────────────────────────

test("summon: brings new units in on the caster's side, lettered, with every action on cooldown, up to the cap", () => {
  const call = { id: "call", cast: 0, cooldown: 6, do: [{ op: "summon", enemy: "drone", count: 2 }] };
  const a = arena({
    party: [BAG], enemies: [{ name: "Queen", abilities: ["call"] }], extras: [{ id: "drone", name: "Drone", stats: { max_hp: 20 }, weapon: weapons.dagger }],
    abilities: [call], ruleset: { maxEnemies: 4 },
  }).to(6);
  assert.deepEqual(a.entries("join").map((e) => (e.unit as { name: string }).name), ["Drone A", "Drone B"]);
  assert.equal(a.f.units.filter((u) => u.side === "enemy").length, 3);
  assert.deepEqual(a.acts("Drone A"), [], "no swing yet");
  a.to(14);
  assert.deepEqual(a.acts("Drone A"), [14], "its dagger comes off cooldown 8 ticks after it joined");
  assert.equal(a.f.units.filter((u) => u.side === "enemy" && !u.ko).length, 4, "the second call adds one: the cap is 4");
  assert.equal(a.entries("cap").length, 1);
});

test("replace: Split swaps the unit for two copies without a knockout, so nothing that reacts to a KO fires", () => {
  const split = { id: "split", name: "Split", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, reactions: [{ on: { event: "hp_lost" }, do: [{ op: "replace", enemy: "mini", count: 2, to: { side: "self", where: { hpBelow: 50 } } }] }] };
  const vengeance = { id: "vengeance", name: "V", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, reactions: [{ on: { event: "ko", whose: "ally" }, do: [{ op: "apply", status: "taunt", to: "holder" }] }] };
  const a = arena({
    party: [{ name: "Hero", stats: { attack: 40 }, weapon: weapons.dagger }],
    enemies: [{ name: "Slime", stats: { max_hp: 100, aggro: 1000 }, statuses: ["split"] }, { name: "King", statuses: ["vengeance"] }],
    extras: [{ id: "mini", name: "Mini", stats: { max_hp: 50 }, weapon: weapons.dagger }],
    statuses: [split, vengeance, taunt],
  }).to(17);
  const slime = a.unit("Slime");
  assert.ok(slime.ko && slime.gone, "the Slime is gone after dropping below half");
  assert.deepEqual(a.entries("leave").length, 1);
  assert.deepEqual(a.entries("join").map((e) => (e.unit as { name: string }).name), ["Mini A", "Mini B"]);
  assert.equal(a.has("King", "taunt").length, 0, "no KO happened, so Vengeance didn't fire");
  assert.equal(a.entries("down").length, 0);
});

test("replace: the fight is won only if nothing takes the unit's place", () => {
  const split = { id: "split", name: "Split", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, reactions: [{ on: { event: "hp_lost" }, do: [{ op: "replace", enemy: "mini", count: 1, to: { side: "self", where: { hpBelow: 50 } } }] }] };
  const a = arena({
    party: [{ name: "Hero", stats: { attack: 40 }, weapon: weapons.dagger }],
    enemies: [{ name: "Slime", stats: { max_hp: 100 }, statuses: ["split"] }],
    extras: [{ id: "mini", name: "Mini", stats: { max_hp: 30 } }],
    statuses: [split],
  }).to(17);
  assert.equal(a.f.result, null);
  assert.equal(a.f.units.filter((u) => u.side === "enemy" && !u.ko).length, 1);
});

// ─── Aegis, absorption, Armor ────────────────────────────────────────────────

test("aegis: blocks the next damage above 25% of max HP, after mitigation and before shields, from a hit or a pulse, then ends; small hits pass", () => {
  const aegis = { id: "aegis", name: "AEGIS", label: "buff", show: "icon", stacking: "fizzle", block: { share: 25 } };
  const a = arena({
    party: [{ name: "Knight", stats: { max_hp: 100, armor: 10 }, statuses: ["aegis"] }],
    enemies: [{ name: "Ogre", stats: { attack: 50 }, weapon: weapons.dagger }, { name: "Imp", stats: { attack: 20 }, weapon: { ...weapons.dagger, cooldown: 7 } }],
    statuses: [aegis],
  }).to(8);
  // The Imp's 10 (after Armor) passes at tick 7; the Ogre's 40 at tick 8 is blocked and spends the Aegis.
  assert.deepEqual(a.hits("Knight").map((e) => [e.amount, e.word]), [[10, null], [0, "AEGIS"]]);
  assert.equal(a.unit("Knight").hp, 90);
  assert.equal(a.has("Knight", "aegis").length, 0);
  assert.deepEqual(a.entries("status_end").map((e) => e.cause), ["spent"]);
  // Doom's blow is a pulse: Aegis soaks it too.
  const doom = { id: "doom", name: "DOOM", label: "debuff", show: "icon", stacking: "fizzle", duration: 2, reactions: [{ on: { event: "status_ended", cause: ["expired"] }, do: [{ op: "damage", type: "none", amount: 60, to: "holder" }] }] };
  const b = arena({ party: [{ name: "Victim", stats: { max_hp: 100 }, statuses: ["aegis", "doom"] }], enemies: [BAG], statuses: [aegis, doom] }).to(4);
  assert.equal(b.unit("Victim").hp, 100);
  assert.deepEqual(b.hits("Victim").map((e) => e.word), ["AEGIS"]);
});

test("magic resist, step 5j: a hit at full Magic resist deals nothing (IMMUNE) but still lands: its statuses apply and it counts as a hit; nothing absorbs", () => {
  const bolt = { id: "bolt", cast: 0, cooldown: 10, do: [{ op: "damage", type: "magical", amount: 40, apply: [{ status: "burn", stacks: 3 }] }] };
  const leech = { id: "leech", name: "Leech", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, reactions: [{ on: { event: "hit_lands" }, do: [{ op: "heal", amount: 1, to: "self" }] }] };
  const a = arena({
    party: [{ name: "Pyro", stats: { max_hp: 100 }, hp: 50, abilities: ["bolt"], statuses: ["leech"] }],
    enemies: [{ name: "Giant", stats: { max_hp: 100, magic_resist: 100 }, hp: 60 }],
    statuses: [burn, leech], abilities: [bolt],
  }).to(11);
  assert.deepEqual(a.hits("Giant").filter((e) => e.src === "bolt").map((e) => [e.amount, e.word]), [[0, "IMMUNE"]]);
  assert.equal(a.has("Giant", "burn").length, 1, "a status a hit carries lands even when the hit is fully resisted");
  assert.equal(a.unit("Pyro").hp, 51, "the hit landed, so Leech reacted to it");
});

test("armor: each physical hit loses armorRatio × Armor; a fully absorbed hit shows BLOCKED and still applies its status", () => {
  const poison = { id: "poison", name: "POISON", label: "debuff", show: "icon", stacking: "refresh", duration: 4, pulse: { every: 2, do: [{ op: "damage", type: "none", amount: 1 }] } };
  const a = arena({
    party: [{ name: "Snake", stats: { attack: 10 }, weapon: { ...weapons.dagger, apply: [{ status: "poison" }] } }],
    enemies: [{ name: "Knight", stats: { max_hp: 100, armor: 50 } }],
    statuses: [poison], ruleset: { armorRatio: 0.1 },
  }).to(8);
  assert.deepEqual(a.hits("Knight").map((e) => [e.amount, e.word]), [[5, null]]);
  const b = arena({
    party: [{ name: "Snake", stats: { attack: 10 }, weapon: { ...weapons.dagger, apply: [{ status: "poison" }] } }],
    enemies: [{ name: "Knight", stats: { max_hp: 100, armor: 150 } }],
    statuses: [poison], ruleset: { armorRatio: 0.1 },
  }).to(8);
  assert.deepEqual(b.hits("Knight").map((e) => [e.amount, e.word]), [[0, "BLOCKED"]]);
  assert.equal(b.has("Knight", "poison").length, 1);
});

test("armor, step 5c: with armorK a physical hit deals hit² ÷ (hit + k × Armor): nearly linear for big hits, never a blank, magic untouched", () => {
  const swing = (attack: number, armor: number, type: "physical" | "magical" = "physical") =>
    arena({
      party: [{ name: "A", stats: { attack }, weapon: { ...weapons.dagger, ...(type === "magical" ? { type } : {}) } }],
      enemies: [{ name: "Wall", stats: { max_hp: 100_000, armor } }],
      ruleset: { armorRatio: 0.1, armorFloor: 25, armorK: 1 },
    }).to(8).hits("Wall").map((e) => [e.amount, e.word])[0];
  assert.deepEqual(swing(100, 100), [50, null], "100² ÷ 200");
  assert.deepEqual(swing(1000, 100), [909, null], "a big hit loses about k × Armor");
  assert.deepEqual(swing(10, 10_000), [0, null], "a tiny hit into a wall rounds down to nothing, but isn't BLOCKED by a floor or a flat cut");
  assert.deepEqual(swing(100, 0), [100, null]);
  assert.deepEqual(swing(100, 100, "magical"), [100, null], "Armor only meets physical hits");
  const more = [100, 200, 400, 800].map((armor) => swing(300, armor)![0] as number);
  assert.ok(more.every((x, i) => i === 0 || x < more[i - 1]), `every point of Armor still helps (${more})`);
});

test("bleed, step 5c: each hit its holder takes deals X per stack, untyped and past Armor, then the stacks drop; the hit that applies it doesn't set it off", () => {
  const bleed = { id: "bleed", name: "BLEED", label: "debuff", show: "icon", stacking: "intensity", trigger: { on: { event: "hit_taken" }, do: [{ op: "damage", type: "none", amount: 10, to: "holder" }] }, drop: { fraction: 0.5 } };
  const cut = { id: "cut", cast: 0, cooldown: 100, do: [{ op: "damage", type: "physical", amount: 1, apply: [{ status: "bleed", stacks: 8 }] }] };
  const a = arena({
    party: [{ name: "Cutter", abilities: ["cut"] }, { name: "Hitter", stats: { attack: 5 }, weapon: { ...weapons.dagger, cooldown: 4 } }],
    enemies: [{ name: "Wall", stats: { max_hp: 100_000, armor: 1000 } }],
    statuses: [bleed], abilities: [cut], ruleset: { armorK: 1 },
  });
  a.unit("Cutter").acts[0].ready = 0;
  a.to(1);
  assert.equal(a.entries("dmg", (e) => e.src === "bleed").length, 0, "the cut itself sets nothing off");
  assert.equal(a.unit("Wall").statuses.find((s) => s.id === "bleed")!.stacks, 8000);
  a.to(5);
  const pops = a.entries("dmg", (e) => e.src === "bleed").map((e) => e.amount);
  assert.deepEqual(pops, [80], "the next hit: 10 × 8 stacks, untouched by Armor 1000");
  assert.equal(a.unit("Wall").statuses.find((s) => s.id === "bleed")!.stacks, 4000, "then half the stacks close");
  a.to(9);
  assert.deepEqual(a.entries("dmg", (e) => e.src === "bleed").map((e) => e.amount), [80, 40]);
  assert.equal(a.entries("dmg", (e) => e.src === "bleed" && e.part === "hit").length, 0, "a pop isn't a hit");
});

test("crit tag, step 5c: a hit's events carry 'crit' when it crits, so a reaction can answer crits alone (the Assassin's Lacerate)", () => {
  const mark = { id: "mark", name: "MARK", label: "debuff", show: "icon", stacking: "intensity" };
  const lacerate = { id: "lacerate", name: "L", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, reactions: [{ on: { event: "hit_lands", tags: ["crit"] }, do: [{ op: "apply", status: "mark", stacks: 1, to: "other" }] }] };
  const run = (crit: number) => arena({
    party: [{ name: "A", stats: { attack: 5, crit_chance: crit }, weapon: { ...weapons.dagger, cooldown: 4 }, statuses: ["lacerate"] }],
    enemies: [BAG], statuses: [mark, lacerate],
  }).to(42);
  const always = run(100), never = run(0);
  assert.equal(always.unit("Bag").statuses.find((s) => s.id === "mark")!.stacks / 1000, always.entries("dmg", (e) => e.crit === true).length, "one mark for each crit");
  assert.equal(never.has("Bag", "mark").length, 0, "no crits, no marks");
});

test("opening slots, step 5c: a party unit's abilities start charged by the order they're slotted in; basic attacks and foes still roll", () => {
  const ab = (id: string) => ({ id, cast: 0, cooldown: 40, target: "self", do: [{ op: "mp", amount: 0 }] });
  const a = arena({
    party: [{ name: "Hero", abilities: ["one", "two", "three"] }],
    enemies: [{ ...BAG, abilities: ["foe"] }],
    abilities: [ab("one"), ab("two"), ab("three"), ab("foe")],
    ruleset: { opening: { min: 0.3, max: 0.7, slots: [25, 15, 10] } },
  });
  assert.deepEqual(a.unit("Hero").acts.slice(0, 3).map((x) => x.ready / 1000), [15, 25, 30], "40 less 25, 15 and 10 ticks");
  const foe = a.unit("Bag").acts[0].ready / 1000;
  assert.ok(foe >= 12 && foe <= 28, `a foe's ability still rolls a third to two thirds (${foe})`);
});

test("draw, the director's Aggro rule: foes pick by draw, Aggro through a curve centred on 100, between a third and three times an ordinary unit's", () => {
  const r = { draw: { centre: 100, k: 50, max: 3 } };
  const table: [number, number][] = [[1, 43], [40, 48], [60, 53], [80, 64], [90, 75], [100, 100], [110, 133], [120, 157], [140, 189], [160, 209], [200, 233]];
  for (const [aggro, want] of table) assert.equal(Math.round(drawOf(r, aggro)), want, `Aggro ${aggro}`);
  for (const d of [5, 20, 60, 99]) assert.ok(Math.abs(drawOf(r, 100 + d) * drawOf(r, 100 - d) - 10_000) < 1e-6, `+${d} and −${d} cancel`);
  assert.ok(drawOf(r, 100_000) < 300 && drawOf(r, 1) > 33, "never past three times, nor under a third");
  // The rule's example party, Knight / Cleric / Ranger at 140 / 60 / 70: 63% / 18% / 19% of picks.
  const share = (xs: number[]) => xs.map((a) => drawOf(r, a) / xs.reduce((t, b) => t + drawOf(r, b), 0));
  assert.deepEqual(share([140, 60, 70]).map((x) => Math.round(100 * x)), [63, 18, 19]);
  assert.equal(drawOf({}, 37), 37, "without the curve, Aggro itself");
});

test("draw in a fight: picks follow draw, so a Veiled caster is still picked about a sixth of the time beside a wall", () => {
  const picks: string[] = [];
  for (let seed = 1; seed <= 400; seed++) {
    const a = arena({
      party: [{ name: "Foe", weapon: weapons.dagger }],
      enemies: [{ name: "Wall", stats: { aggro: 170 } }, { name: "Caster", stats: { aggro: 50 } }, { name: "Other", stats: { aggro: 50 } }],
      ruleset: { draw: { centre: 100, k: 50, max: 3 } }, seed,
    }).to(8);
    picks.push(String(a.entries("act")[0].targets));
  }
  const caster = share(picks, "e2");
  assert.ok(caster > 0.11 && caster < 0.21, `the caster about 16% (${caster}); in proportion to Aggro it would be 19% here, and a few percent beside a wall of 1,000`);
});

// ─── Actions ─────────────────────────────────────────────────────────────────

test("mp fizzle: an ability its unit can no longer pay for when it resolves does nothing, spends nothing, and still goes on cooldown", () => {
  const bolt = { id: "bolt", mp: 10, cast: 5, cooldown: 10, do: [dmg(50)] };
  const drain = { id: "drain", cast: 0, cooldown: 12, do: [{ op: "mp", amount: -5 }] };
  const a = arena({ party: [{ name: "Mage", stats: { max_mp: 10 }, abilities: ["bolt"] }], enemies: [{ ...BAG, abilities: ["drain"] }], abilities: [bolt, drain] }).to(15);
  assert.deepEqual(a.entries("fail").map((e) => [e.at, e.why]), [[15_000, "mp"]]);
  assert.equal(a.unit("Mage").mp, 5);
  assert.equal(a.unit("Mage").acts[0].ready, 25_000, "on cooldown from the fizzle");
});

test("firing: `if` waits; a Fizzle status skips units that have it (where lacks) and `ifNone: any` falls back to the usual target", () => {
  const stun = { id: "stun", name: "STUN", label: "debuff", show: "icon", stacking: "fizzle", duration: 20, lockout: { covers: "all", interrupt: true } };
  const bash = { id: "bash", cast: 0, cooldown: 4, target: { side: "foes", where: { lacks: "stun" }, ifNone: "any" }, do: [dmg(1, { apply: [{ status: "stun" }] })] };
  const hush = { id: "hush", cast: 0, cooldown: 4, if: { side: "foes", where: { lacks: "stun" } }, target: { side: "foes", where: { lacks: "stun" } }, do: [{ op: "apply", status: "stun" }] };
  const a = arena({ party: [{ name: "Knight", abilities: ["bash"] }], enemies: [{ name: "A" }, { name: "B" }], statuses: [stun], abilities: [bash] }).to(12);
  assert.equal(a.has("A", "stun").length + a.has("B", "stun").length, 2, "the second bash went to the foe without Stun");
  assert.equal(a.entries("act", (e) => e.act === "bash").length, 3, "the third fires anyway, dealing its damage");
  const b = arena({ party: [{ name: "Hexer", abilities: ["hush"] }], enemies: [{ name: "A" }, { name: "B" }], statuses: [stun], abilities: [hush] }).to(12);
  assert.equal(b.entries("act", (e) => e.act === "hush").length, 2, "the third Hush waits: everyone has it");
});

test("target phrases: the highest of Attack or Magic, a capped Shield skipped, a random knocked-out ally", () => {
  const shield = { id: "shield", name: "SHIELD", label: "buff", show: "icon", stacking: "intensity", absorb: true, cap: { scale: [{ ratio: 0.5, stat: "max_hp", of: "holder" }] } };
  const hush = { id: "hush", cast: 0, cooldown: 10, target: { side: "foes", pick: "highest", by: { stats: ["attack", "magic"] } }, do: [dmg(1)] };
  const protect = { id: "protect", cast: 0, cooldown: 4, if: { side: "allies", where: { belowCap: "shield" } }, target: { side: "allies", where: { belowCap: "shield" }, pick: "lowest", by: "hp_share" }, do: [{ op: "apply", status: "shield", stacks: 50 }] };
  const a = arena({
    party: [{ name: "Hexer", abilities: ["hush"] }],
    enemies: [{ name: "Priest", stats: { attack: 0, magic: 70 } }, { name: "Troll", stats: { attack: 60, magic: 0 } }],
    abilities: [hush],
  }).to(10);
  assert.equal(a.hits("Priest").length, 1);
  const b = arena({ party: [{ name: "Knight", stats: { max_hp: 100 }, abilities: ["protect"] }, { name: "Mage", stats: { max_hp: 100 } }], enemies: [BAG], statuses: [shield], abilities: [protect] }).to(12);
  assert.equal(b.has("Knight", "shield")[0].stacks, 50_000);
  assert.equal(b.has("Mage", "shield")[0].stacks, 50_000, "the Knight's Shield is capped, so the second cast goes to the Mage");
  assert.equal(b.entries("act", (e) => e.act === "protect").length, 2, "then it waits");
});

// ─── Reactions and events ────────────────────────────────────────────────────

test("a unit's statuses that survive its KO can react to it (Volatile): the blast goes off even though the unit is down", () => {
  const volatile = { id: "volatile", name: "Volatile", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, survivesKO: true, reactions: [{ on: { event: "ko" }, do: [{ op: "damage", type: "magical", amount: 30, to: { side: "foes", pick: "all" } }] }] };
  const a = arena({
    party: [{ name: "Hero", stats: { max_hp: 100, attack: 50 }, weapon: weapons.dagger }, { name: "Friend", stats: { max_hp: 100 } }],
    enemies: [{ name: "Bomb", stats: { max_hp: 10 }, statuses: ["volatile"] }, { name: "Other", stats: { max_hp: 1000 } }],
    statuses: [volatile],
  }).to(9);
  assert.ok(a.unit("Bomb").ko);
  assert.deepEqual(a.hits("Hero").map((e) => e.amount), [30]);
  assert.deepEqual(a.hits("Friend").map((e) => e.amount), [30]);
});

test("event filters: a trigger on hits that carry a tag (a Bulwark only magical hits chip), and a reaction to damage dealt by a named status (Briar)", () => {
  const bulwark = { id: "bulwark", name: "BULWARK", label: "buff", show: "icon", stacking: "intensity", trigger: { on: { event: "hit_taken", tags: ["magical"] } }, drop: { count: 1 } };
  const a = arena({
    party: [{ name: "Ranger", weapon: { ...weapons.dagger, type: "magical" } }, { name: "Knight", weapon: weapons.sword }],
    enemies: [{ name: "Titan", stats: { max_hp: 1_000_000 }, statuses: ["bulwark"] }],
    statuses: [bulwark],
  });
  a.unit("Titan").statuses[0].stacks = 3000;
  a.to(16);
  // Two magical dagger hits (8, 16) remove two stacks; the sword's physical hit at 12 doesn't.
  assert.equal(a.has("Titan", "bulwark")[0].stacks, 1000);
  const thorns = { id: "spikes", name: "Spikes", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, reactions: [{ on: { event: "hit_taken" }, do: [{ op: "damage", type: "none", amount: 2, to: "other" }] }] };
  const briar = { id: "briar", name: "Briar", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, reactions: [{ on: { event: "damage_dealt", status: "spikes" }, do: [{ op: "apply", status: "burn", stacks: 2, to: "other" }] }] };
  const b = arena({
    party: [{ name: "Bramble", stats: { max_hp: 1000, attack: 5 }, weapon: weapons.sword, statuses: ["spikes", "briar"] }],
    enemies: [{ name: "Wolf", stats: { max_hp: 1000 }, weapon: weapons.dagger }],
    statuses: [thorns, briar, burn],
  }).to(12);
  assert.equal(b.has("Wolf", "burn").length, 1, "the Wolf bit at 8, took Spikes at 8.001, and got Burn from Briar");
  assert.equal(b.entries("status", (e) => e.status === "burn").length, 1, "the Bramble's own sword hit at 12 dealt damage too, but not from Spikes");
});

test("dispel: a remove can take statuses at random; a unit with immune:dispel keeps its buffs", () => {
  const might = { id: "might", name: "MIGHT", label: "buff", show: "icon", stacking: "refresh" , boosts: [{ tag: "physical", pct: 10 }] };
  const haste = { id: "haste", name: "HASTE", label: "buff", show: "icon", stacking: "refresh", stats: [{ stat: "attack_speed", flat: 10 }] };
  const unravel = { id: "unravel", cast: 0, cooldown: 10, target: { side: "foes", where: { buffs: true } }, do: [{ op: "remove", label: "buff", count: 1, order: "random" }] };
  const gone: string[] = [];
  for (let seed = 1; seed <= 20; seed++) {
    const a = arena({ party: [{ name: "Hexer", abilities: ["unravel"] }], enemies: [{ name: "Imp", statuses: ["might", "haste"] }], statuses: [might, haste], abilities: [unravel], seed }).to(10);
    gone.push(...a.entries("status_end", (e) => e.cause === "removed").map((e) => e.status as string));
  }
  assert.equal(gone.length, 20);
  assert.ok(gone.includes("might") && gone.includes("haste"), "either can go first");
  const b = arena({ party: [{ name: "Hexer", abilities: ["unravel"] }], enemies: [{ name: "Titan", stats: { "immune:dispel": 1 }, statuses: ["might"] }], statuses: [might], abilities: [unravel] }).to(10);
  assert.equal(b.has("Titan", "might").length, 1);
  assert.deepEqual(b.entries("immune").map((e) => e.status), ["dispel"]);
});

// ─── Numbers ─────────────────────────────────────────────────────────────────

test("boosts can read the unit being hit: double damage to foes with a buff (Judgement), more per Chill stack (Brittle)", () => {
  const judgement = { id: "judgement", name: "Judgement", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, boosts: [{ tag: "physical", pct: { scale: [{ ratio: 100, when: { buffs: true }, of: "target" }] } }] };
  const brittle = { id: "brittle", name: "Brittle", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, boosts: [{ tag: "physical", pct: { scale: [{ ratio: 10, stacks: "chill", of: "target" }] } }] };
  const chill = { id: "chill", name: "CHILL", label: "debuff", show: "icon", stacking: "intensity", cap: 10, stats: [{ stat: "attack_speed", flat: -5 }] };
  const a = arena({
    party: [{ name: "Paladin", stats: { attack: 10 }, weapon: weapons.dagger, statuses: ["judgement"] }],
    enemies: [{ name: "Buffed", stats: { max_hp: 1000, aggro: 1000 }, statuses: ["taunt"] }],
    statuses: [judgement, taunt],
  }).to(8);
  assert.deepEqual(a.hits("Buffed").map((e) => e.amount), [20]);
  const b = arena({ party: [{ name: "Frost", stats: { attack: 10 }, weapon: weapons.dagger, statuses: ["brittle"] }], enemies: [{ name: "Cold", stats: { max_hp: 1000 } }], statuses: [brittle, chill] });
  b.unit("Cold").statuses.push({ uid: 99, id: "chill", src: null, at: 0, end: -1, stacks: 4000, nums: [-5, 0, 10] });
  b.to(8);
  assert.deepEqual(b.hits("Cold").map((e) => e.amount), [14]);
});

test("a scale can multiply by a live stat: Lifesteal heals a share of each hit's damage, and Bloodlust doubles it below half HP", () => {
  const lifesteal = { id: "lifesteal", name: "Lifesteal", label: "buff", show: "stat", stacking: "refresh", unremovable: true, reactions: [{ on: { event: "hit_lands" }, do: [{ op: "heal", amount: { scale: [{ ratio: 0.01, amount: true, times: { stat: "lifesteal", of: "holder" } }] }, to: "self" }] }] };
  const bloodlust = {
    id: "bloodlust", name: "Bloodlust", label: "buff", show: "sheet", stacking: "refresh", unremovable: true,
    reactions: [
      { on: { event: "hp_lost" }, do: [{ op: "apply", status: "bloodlust_on", to: { side: "self", where: { hpBelow: 50 } } }] },
      { on: { event: "healed" }, do: [{ op: "remove", label: "buff", status: "bloodlust_on", to: { side: "self", where: { hpAtLeast: 50 } } }] },
    ],
  };
  const on = { id: "bloodlust_on", name: "BLOODLUST", label: "buff", show: "icon", stacking: "refresh", stats: [{ stat: "lifesteal", flat: { scale: [{ ratio: 1, stat: "lifesteal", of: "holder" }] } }] };
  const a = arena({
    party: [{ name: "Vampire", stats: { max_hp: 100, attack: 20, lifesteal: 50 }, hp: 30, weapon: weapons.dagger, statuses: ["bloodlust"] }],
    enemies: [{ name: "Prey", stats: { max_hp: 1000, attack: 1 }, weapon: { ...weapons.dagger, cooldown: 7 } }],
    stats: [{ id: "lifesteal", kind: "points", default: 0, brings: "lifesteal" }], statuses: [lifesteal, bloodlust, on],
  }).to(9);
  // Bitten at 7 (29 HP, below half: Bloodlust on, lifesteal 100). Its own bite at 8 deals 20 and heals 20 a sub-tick later.
  assert.equal(a.unit("Vampire").stats.lifesteal, 100);
  assert.deepEqual(a.entries("heal").map((e) => [e.target, e.amount]), [["p1", 20]]);
  a.to(17);
  assert.equal(a.has("Vampire", "bloodlust_on").length, 0, "healed back above half, Bloodlust is off");
});

test("a pulse can be only a timer: Might loses one stack every interval and ends below one", () => {
  const might = { id: "might", name: "MIGHT", label: "buff", show: "icon", stacking: "intensity", boosts: [{ tag: "physical", pct: 10 }], pulse: { every: 3 }, drop: { count: 1 } };
  const a = arena({ party: [{ name: "Bard", stats: { attack: 10 }, weapon: weapons.dagger }], enemies: [BAG], statuses: [might] });
  a.unit("Bard").statuses.push({ uid: 99, id: "might", src: null, at: 0, end: -1, stacks: 3000, nums: [10] });
  a.f.queue.push({ k: "pulse", at: 3000, b: 0, g: 0, slot: 0, seq: 999, unit: "p1", uid: 99 });
  a.to(16);
  assert.deepEqual(a.hits("Bag").map((e) => e.amount), [11, 10], "3 stacks at 0, 2 at 3, 1 at 6, gone at 9: the swing at 8 has one stack's +10%, the one at 16 none");
});

test("stat changes can read the holder's own stat once, at application: Bedrock doubles crit chance while a Shield holds", () => {
  const shield = { id: "shield", name: "SHIELD", label: "buff", show: "icon", stacking: "intensity", absorb: true, cap: 1000 };
  const bedrock = {
    id: "bedrock", name: "Bedrock", label: "buff", show: "sheet", stacking: "refresh", unremovable: true,
    reactions: [
      { on: { event: "status_gained", status: "shield" }, do: [{ op: "apply", status: "bedrock_on", to: "holder" }] },
      { on: { event: "status_ended", status: "shield" }, do: [{ op: "remove", label: "buff", status: "bedrock_on", to: "holder" }] },
    ],
  };
  const on = { id: "bedrock_on", name: "BEDROCK", label: "buff", show: "icon", stacking: "fizzle", stats: [{ stat: "crit_chance", flat: { scale: [{ ratio: 1, stat: "crit_chance", of: "holder" }] } }] };
  const shell = { id: "shell", cast: 0, cooldown: 100, target: "self", do: [{ op: "apply", status: "shield", stacks: 5 }] };
  const a = arena({
    party: [{ name: "Geo", stats: { max_hp: 100, crit_chance: 20 }, abilities: ["shell"], statuses: ["bedrock"] }],
    enemies: [{ name: "Foe", stats: { attack: 5 }, weapon: { ...weapons.dagger, cooldown: 101 } }],
    statuses: [shield, bedrock, on], abilities: [shell],
  }).to(100.5);
  assert.equal(a.unit("Geo").stats.crit_chance, 40, "doubled while the Shield holds");
  a.to(102);
  assert.equal(a.has("Geo", "shield").length, 0, "the Foe's 5 used up the 5-point Shield");
  assert.equal(a.unit("Geo").stats.crit_chance, 20, "and Bedrock is off again");
});

// ─── Step 5g: head starts by share, several conditions, MP conditions, the capped event and the owner word ──

test("opening.slotShares: a party ability starts charged by a share of its own cooldown, by slot", () => {
  const quick = { id: "quick", cast: 0, cooldown: 20, do: [dmg(1)] };
  const slow = { id: "slow", cast: 0, cooldown: 40, do: [dmg(1)] };
  const a = arena({
    party: [{ name: "Hero", stats: { max_hp: 1_000_000 }, abilities: ["slow", "quick"] }], enemies: [BAG], abilities: [quick, slow],
    // min and max at 1: the arena's placeholder weapon starts on its (huge) full cooldown, so only the abilities act.
    ruleset: { opening: { min: 1, max: 1, slotShares: [0.75, 0.25] } },
  }).to(16);
  const casts = a.entries("act").filter((e) => e.act !== "basic").map((e) => [e.act, Number(e.at) / 1000]);
  assert.deepEqual(casts, [["slow", 10], ["quick", 15]], "the first slot's long ability at a quarter of 40, the second slot's short at three quarters of 20");
});

test("an ability's `if` can be several conditions, all of which must hold (Blood gift: an ally hurt, and itself above the price)", () => {
  const gift = { id: "gift", cast: 0, cooldown: 10, if: [{ side: "others", where: { hpBelow: 80 } }, { side: "self", where: { hpAtLeast: 35 } }], target: { side: "others", pick: "lowest", by: "hp_share" }, do: [{ op: "heal", amount: 100 }] };
  const run = (selfHp: number, allyHp: number) =>
    arena({ party: [{ name: "V", stats: { max_hp: 1000 }, hp: selfHp, abilities: ["gift"] }, { name: "A", stats: { max_hp: 1000 }, hp: allyHp }], enemies: [BAG], abilities: [gift] }).to(12).entries("heal").length;
  assert.equal(run(1000, 500), 1, "both hold: it casts");
  assert.equal(run(200, 500), 0, "the Vampire is below 35%: it waits");
  assert.equal(run(1000, 1000), 0, "nobody is hurt: it waits");
});

test("mpBelow: a target rule can ask for an ally under a share of its MP (Clarity waits for need); a unit with no pool never passes", () => {
  const give = { id: "give", cast: 0, cooldown: 10, target: "self", do: [{ op: "mp", amount: 100, to: { side: "allies", where: { mpBelow: 50 }, pick: "lowest", by: "mp_share" } }] };
  const run = (mp: number) =>
    arena({ party: [{ name: "K", stats: { max_mp: 1000 }, mp: 1000, abilities: ["give"] }, { name: "C", stats: { max_mp: 1000 }, mp }, { name: "N" }], enemies: [BAG], abilities: [give] }).to(12);
  assert.equal(run(300).entries("mp").filter((e) => Number(e.amount) === 100).length, 1, "the caster at 30% MP gets it");
  assert.equal(run(900).entries("mp").filter((e) => Number(e.amount) === 100).length, 0, "nobody under half: nobody gets it");
});

test("status_capped: an Intensity status that reaches its cap fires an event; its own reaction can shatter it, and a foe's passive can answer on the owner", () => {
  const chill = {
    id: "chill", name: "CHILL", label: "debuff", show: "icon", stacking: "intensity", cap: 4,
    reactions: [{ on: { event: "status_capped", status: "chill" }, do: [{ op: "damage", type: "none", amount: { scale: [{ ratio: 10, stacks: "chill", of: "holder" }] }, to: "holder" }, { op: "remove", label: "debuff", status: "chill", to: "holder" }] }],
  };
  const sunder = { id: "sunder", name: "SUNDER", label: "debuff", show: "icon", stacking: "intensity" };
  const point = { id: "point", name: "Point", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, reactions: [{ on: { event: "status_capped", status: "chill", whose: "foe" }, do: [{ op: "apply", status: "sunder", stacks: 2, to: "owner" }] }] };
  const lance = { id: "lance", cast: 0, cooldown: 6, do: [{ op: "apply", status: "chill", stacks: 3 }] };
  const a = arena({ party: [{ name: "F", abilities: ["lance"], statuses: ["point"] }], enemies: [{ name: "T", stats: { max_hp: 1000 } }], statuses: [chill, sunder, point], abilities: [lance] }).to(14);
  const shatter = a.entries("dmg").filter((e) => e.part === "reaction" && e.src === "chill");
  assert.equal(shatter.length, 1, "the second lance caps the Chill at 4 and it shatters once");
  assert.equal(shatter[0].amount, 40, "damage for each stack at the cap");
  assert.ok(a.entries("status_end").some((e) => e.status === "chill" && e.cause === "removed"), "the Chill is spent");
  assert.ok(a.entries("status").some((e) => e.status === "sunder" && e.unit === shatter[0].target), "the Frostweaver's passive puts Sunder on the shattered foe");
});
