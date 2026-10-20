/**
 * Step 4's functionality tests, part 2: stats, damage, healing and shields
 * (design sections 4 and 5), mostly the design's Part 2 examples.
 */
import { test } from "vitest";
import assert from "node:assert/strict";
import { arena, weapons, type Spec } from "./arena.js";

const BAG = { name: "Bag", stats: { max_hp: 1_000_000 } };
const DUMMY = { name: "Dummy", stats: { max_hp: 1_000_000 } };
/** One basic attack per tick, so a fight gives many rolls. */
const rapid = (w: object = {}) => ({ ...weapons.dagger, cooldown: 1, ...w });
const status = (id: string, x: object) => ({ id, name: id.toUpperCase(), label: "buff", show: "icon", stacking: "refresh", ...x });
const near = (x: number, want: number, tol = 0.035) => assert.ok(Math.abs(x - want) < tol, `${x.toFixed(3)} isn't near ${want.toFixed(3)}`);

/** The first hit's amounts and words when `attacker` hits `target` once. */
function strike(attacker: Spec, target: Spec, extra: { statuses?: unknown[]; abilities?: unknown[] } = {}) {
  const a = arena({ party: [{ name: "A", ...attacker }], enemies: [{ name: "T", ...target, stats: { max_hp: 1_000_000, ...target.stats } }], ...extra });
  a.to(20);
  const hits = a.hits("T");
  return hits.filter((e) => e.at === hits[0]?.at);
}

// ─── Stats (section 4) ──────────────────────────────────────────────────────

test("stats: base Attack 50, gear +10 Attack and a status giving +20% Attack make (50 + 10) × 1.2 = 72", () => {
  const might = status("might", { stats: [{ stat: "attack", pct: 20 }] });
  const a = arena({ party: [{ name: "A", stats: { attack: 50 }, flat: { attack: 10 }, statuses: ["might"] }], enemies: [BAG], statuses: [might] });
  assert.equal(a.unit("A").stats.attack, 72);
});

test("stats: final values drop fractions, then meet the stat's floor and cap", () => {
  const a = arena({ party: [{ name: "A", stats: { attack: 33, evasion: 90 }, pct: { attack: 10 } }], enemies: [BAG] });
  assert.equal(a.unit("A").stats.attack, 36);
  assert.equal(a.unit("A").stats.evasion, 75, "Evasion's cap in the worked example");
});

test("stats: a status raising max HP by 100 raises current HP by 100; when it ends, current HP is capped at the new max, and that never KOs", () => {
  const vigor = status("vigor", { duration: 5, stats: [{ stat: "max_hp", flat: 100 }] });
  const pump = { id: "pump", cast: 0, cooldown: 1, target: "self", do: [{ op: "apply", status: "vigor" }] };
  const a = arena({ party: [{ name: "A", stats: { max_hp: 100 }, hp: 80, abilities: ["pump"] }], enemies: [BAG], statuses: [vigor], abilities: [pump] });
  a.unit("A").acts[0].ready = 1000;
  a.to(1);
  assert.deepEqual([a.unit("A").hp, a.unit("A").stats.max_hp], [180, 200]);
  a.unit("A").acts[0].ready = 1e9;
  a.to(6);
  assert.deepEqual([a.unit("A").hp, a.unit("A").stats.max_hp], [100, 100]);
});

// ─── Hit count against Armor and Evasion ────────────────────────────────────

test("armor: against Armor 8, one hit of 30 deals 22; three hits of 10 deal 2 each, 6 in total", () => {
  assert.deepEqual(strike({ weapon: { ...weapons.axe, amount: 30 } }, { stats: { armor: 8 } }).map((e) => e.amount), [22]);
  assert.deepEqual(strike({ weapon: { ...weapons.axe, hits: 3, amount: 10 } }, { stats: { armor: 8 } }).map((e) => e.amount), [2, 2, 2]);
});

test("armor: a hit Armor fully absorbs shows BLOCKED", () => {
  assert.deepEqual(strike({ weapon: { ...weapons.axe, amount: 5 } }, { stats: { armor: 8 } }).map((e) => [e.amount, e.word]), [[0, "BLOCKED"]]);
});

test("evasion: against 50% Evasion one hit deals all or nothing, while three hits roll separately and usually land one or two", () => {
  const a = arena({ party: [{ name: "A", stats: { attack: 10 }, weapon: rapid() }], enemies: [{ name: "T", stats: { max_hp: 1e9, evasion: 50 } }] }).to(2000);
  near(a.hits("T").filter((e) => e.word === "MISS").length / a.hits("T").length, 0.5);
  const b = arena({ party: [{ name: "A", stats: { attack: 10 }, weapon: rapid({ hits: 3 }) }], enemies: [{ name: "T", stats: { max_hp: 1e9, evasion: 50 } }] }).to(2000);
  const landed = b.acts("A").map((t) => b.hits("T").filter((e) => e.at === t * 1000 && e.word !== "MISS").length);
  near(landed.filter((n) => n === 1 || n === 2).length / landed.length, 0.75);
});

test("evasion: an evaded hit shows MISS, and every physical hit lands on a unit with no Evasion, with no roll at all", () => {
  const a = arena({ party: [{ name: "A", weapon: rapid() }], enemies: [{ name: "T", stats: { max_hp: 1e9 } }] }).to(50);
  assert.equal(a.hits("T").filter((e) => e.word === "MISS").length, 0);
  assert.equal(a.entries("roll", (e) => e.what === "evade").length, 0);
});

test("accuracy: against 30% Evasion, 20 Accuracy misses 10% of the time, and 30 or more never misses", () => {
  const miss = (accuracy: number) => {
    const a = arena({ party: [{ name: "A", stats: { accuracy }, weapon: rapid() }], enemies: [{ name: "T", stats: { max_hp: 1e9, evasion: 30 } }] }).to(2000);
    return a.hits("T").filter((e) => e.word === "MISS").length / a.hits("T").length;
  };
  near(miss(20), 0.1, 0.02);
  assert.equal(miss(30), 0);
  assert.equal(miss(60), 0);
});

test("accuracy: Blind (Accuracy −30) misses 30% of the time against a target with no Evasion; Evasion stays under its cap", () => {
  const miss = (accuracy: number, evasion: number) => {
    const a = arena({ party: [{ name: "A", stats: { accuracy }, weapon: rapid() }], enemies: [{ name: "T", stats: { max_hp: 1e9, evasion } }] }).to(2000);
    return a.hits("T").filter((e) => e.word === "MISS").length / a.hits("T").length;
  };
  near(miss(-30, 0), 0.3);
  near(miss(-30, 70), 0.75, 0.03);
});

// ─── Resistance ─────────────────────────────────────────────────────────────

test("resistance: general +10 and fire gear +20 make Fire 30 (RESIST), Ice 10; Ice −25 shows WEAK; full Fire Resistance shows IMMUNE", () => {
  const bolt = (element: string) => ({ weapon: { type: "magical" as const, element, cooldown: 10, amount: 100 } });
  assert.deepEqual(strike(bolt("fire"), { stats: { resist: 10, "resist:fire": 20 } }).map((e) => [e.amount, e.word]), [[70, "RESIST"]]);
  assert.deepEqual(strike(bolt("ice"), { stats: { resist: 10, "resist:fire": 20 } }).map((e) => [e.amount, e.word]), [[90, "RESIST"]]);
  assert.deepEqual(strike(bolt("ice"), { stats: { "resist:ice": -25 } }).map((e) => [e.amount, e.word]), [[125, "WEAK"]]);
  assert.deepEqual(strike(bolt("fire"), { stats: { "resist:fire": 100 } }).map((e) => [e.amount, e.word]), [[0, "IMMUNE"]]);
});

test("resistance: subtypes have no Resistance lines, and Armor doesn't touch magic", () => {
  const bolt = { weapon: { type: "magical" as const, element: "fire", cooldown: 10, amount: 100 } };
  assert.deepEqual(strike(bolt, { stats: { armor: 50, resist: 0 } }).map((e) => e.amount), [100]);
});

// ─── Boosts and damage-taken modifiers ──────────────────────────────────────

const FIRE_BOLT = { id: "fire_bolt", cast: 0, cooldown: 10, do: [{ op: "damage", type: "magical", element: "fire", amount: 100 }] };
const SHIELD_BASH = { id: "shield_bash", cast: 0, cooldown: 10, do: [{ op: "damage", type: "physical", subtype: "blunt", amount: { scale: [{ ratio: 1.5, stat: "armor" }] } }] };

test("boosts: Fire Bolt with +20% fire and +10% ability damage gets +30%, applied once; an amulet can carry both boosts", () => {
  const amulet = status("amulet", { boosts: [{ tag: "fire", pct: 20 }, { tag: "ability", pct: 10 }] });
  assert.deepEqual(strike({ abilities: ["fire_bolt"], statuses: ["amulet"] }, {}, { statuses: [amulet], abilities: [FIRE_BOLT] }).map((e) => e.amount), [130]);
});

test("boosts: a +physical damage boost doesn't apply to Fire Bolt; a +blunt boost applies to Shield Bash but not to a sword's slash", () => {
  const phys = status("phys", { boosts: [{ tag: "physical", pct: 50 }] }), blunt = status("blunt", { boosts: [{ tag: "blunt", pct: 50 }] });
  assert.deepEqual(strike({ abilities: ["fire_bolt"], statuses: ["phys"] }, {}, { statuses: [phys], abilities: [FIRE_BOLT] }).map((e) => e.amount), [100]);
  const a = arena({ party: [{ name: "A", stats: { armor: 20, attack: 30 }, weapon: weapons.sword, abilities: ["shield_bash"], statuses: ["blunt"] }], enemies: [BAG], statuses: [blunt], abilities: [SHIELD_BASH] }).to(13);
  assert.deepEqual(a.hits("Bag").map((e) => [e.src, e.amount]), [["shield_bash", 45], ["basic", 30]]);
});

test("damage taken: Fire Bolt with +30% boosts against Vulnerable (+20% damage taken) deals amount × 1.3 × 1.2", () => {
  const boost = status("boost", { boosts: [{ tag: "fire", pct: 30 }] }), vuln = status("vuln", { label: "debuff", taken: [{ pct: 20 }] });
  assert.deepEqual(strike({ abilities: ["fire_bolt"], statuses: ["boost"] }, { statuses: ["vuln"] }, { statuses: [boost, vuln], abilities: [FIRE_BOLT] }).map((e) => e.amount), [156]);
});

test("damage taken: a target with −30% damage taken always takes 30% less, whatever the attacker's boosts; a modifier can name a tag", () => {
  const boost = status("boost", { boosts: [{ tag: "fire", pct: 50 }] }), ward = status("ward", { taken: [{ pct: -30 }] }), frost = status("frost", { taken: [{ tag: "ice", pct: -50 }] });
  assert.deepEqual(strike({ abilities: ["fire_bolt"] }, { statuses: ["ward"] }, { statuses: [ward], abilities: [FIRE_BOLT] }).map((e) => e.amount), [70]);
  assert.deepEqual(strike({ abilities: ["fire_bolt"], statuses: ["boost"] }, { statuses: ["ward"] }, { statuses: [boost, ward], abilities: [FIRE_BOLT] }).map((e) => e.amount), [105]);
  assert.deepEqual(strike({ abilities: ["fire_bolt"] }, { statuses: ["frost"] }, { statuses: [frost], abilities: [FIRE_BOLT] }).map((e) => e.amount), [100]);
});

test("damage taken: modifiers add together, and their total is capped (the worked example's cap is +100%)", () => {
  const vuln = status("vuln", { label: "debuff", taken: [{ pct: 80 }] }), expose = status("expose", { label: "debuff", taken: [{ pct: 80 }] });
  assert.deepEqual(strike({ abilities: ["fire_bolt"] }, { statuses: ["vuln", "expose"] }, { statuses: [vuln, expose], abilities: [FIRE_BOLT] }).map((e) => e.amount), [200]);
});

// ─── Crits ──────────────────────────────────────────────────────────────────

test("crits: an action's damage crits at its Crit chance, for its Crit multiplier; a passive reading 'crits deal triple damage' sets the multiplier", () => {
  assert.deepEqual(strike({ stats: { crit_chance: 100 }, weapon: { ...weapons.axe, amount: 100 } }, {}).map((e) => [e.amount, e.crit]), [[150, true]]);
  assert.deepEqual(strike({ stats: { crit_chance: 100, crit_multiplier: 300 }, weapon: { ...weapons.axe, amount: 100 } }, {}).map((e) => e.amount), [300]);
  const a = arena({ party: [{ name: "A", stats: { crit_chance: 25 }, weapon: rapid({ amount: 100 }) }], enemies: [{ name: "T", stats: { max_hp: 1e9 } }] }).to(2000);
  near(a.hits("T").filter((e) => e.crit).length / a.hits("T").length, 0.25);
});

test("crits: crit comes before mitigation", () => {
  assert.deepEqual(strike({ stats: { crit_chance: 100 }, weapon: { ...weapons.axe, amount: 20 } }, { stats: { armor: 10 } }).map((e) => e.amount), [20]);
});

// ─── Riders ─────────────────────────────────────────────────────────────────

const FLAME_SWORD = { ...weapons.sword, riders: [{ type: "magical" as const, element: "fire", amount: { scale: [{ ratio: 1, stat: "magic" }] } }] };
const MAG = { scale: [{ ratio: 1, stat: "magic" }] };
const STORM_STAFF = { type: "magical" as const, element: "lightning", cooldown: 12, amount: MAG, riders: [{ type: "physical" as const, subtype: "pierce" as const, amount: 10 }] };

test("riders: a flame sword is a slash hit from Attack plus a fire rider from Magic; if the target evades, MISS, and no fire", () => {
  const a = arena({ party: [{ name: "A", stats: { attack: 30, magic: 10, accuracy: -100 }, weapon: FLAME_SWORD }], enemies: [{ name: "T", stats: { max_hp: 1e9, evasion: 75 } }] }).to(1200);
  const at = a.acts("A").map((t) => a.hits("T").filter((e) => e.at === t * 1000));
  for (const parts of at) {
    if (parts[0].word === "MISS") assert.equal(parts.length, 1, "an evaded hit's rider is evaded too");
    else assert.deepEqual(parts.map((e) => [e.part, e.amount]), [["hit", 30], ["rider", 10]]);
  }
  assert.ok(at.some((p) => p[0].word === "MISS") && at.some((p) => p[0].word !== "MISS"));
});

test("riders: if Armor absorbs the whole hit (BLOCKED), the fire rider still lands and meets fire Resistance", () => {
  const hits = strike({ stats: { attack: 30, magic: 20 }, weapon: FLAME_SWORD }, { stats: { armor: 40, "resist:fire": 50 } });
  assert.deepEqual(hits.map((e) => [e.part, e.amount, e.word]), [["hit", 0, "BLOCKED"], ["rider", 10, "RESIST"]]);
});

test("riders: a storm staff's lightning hit can't be evaded, so its pierce rider always occurs, then meets Evasion and Armor on its own", () => {
  const c = arena({ party: [{ name: "A", stats: { magic: 30 }, weapon: { ...STORM_STAFF, cooldown: 1 } }], enemies: [{ name: "T", stats: { max_hp: 1e9, evasion: 50, armor: 4 } }], seed: 3 }).to(1000);
  const hits = c.hits("T").filter((e) => e.part === "hit"), riders = c.hits("T").filter((e) => e.part === "rider");
  assert.ok(hits.every((e) => e.word !== "MISS" && e.amount === 30));
  assert.equal(riders.length, hits.length);
  near(riders.filter((e) => e.word === "MISS").length / riders.length, 0.5);
  assert.ok(riders.filter((e) => e.word !== "MISS").every((e) => e.amount === 6));
});

test("riders: a rider counts as part of its hit: hit events fire once per hit, riders included", () => {
  const count = status("count", { reactions: [{ on: { event: "hit_lands" }, do: [{ op: "heal", amount: 1, to: "self" }] }] });
  const a = arena({ party: [{ name: "A", stats: { attack: 30, magic: 10 }, weapon: FLAME_SWORD, statuses: ["count"] }], enemies: [{ name: "T", stats: { max_hp: 1e9 } }], statuses: [count] }).to(13);
  assert.equal(a.hits("T").length, 2);
  assert.equal(a.entries("heal").length, 1);
});

// ─── Scaling ────────────────────────────────────────────────────────────────

test("scaling: any stat can be a scaling source: Shield Bash (physical, blunt) and Storm Ward (magical, lightning) both scale with Armor", () => {
  const ward = { id: "storm_ward", cast: 0, cooldown: 10, do: [{ op: "damage", type: "magical", element: "lightning", amount: { scale: [{ ratio: 2, stat: "armor" }] } }] };
  assert.deepEqual(strike({ stats: { armor: 20 }, abilities: ["shield_bash"] }, {}, { abilities: [SHIELD_BASH] }).map((e) => e.amount), [30]);
  assert.deepEqual(strike({ stats: { armor: 20 }, abilities: ["storm_ward"] }, {}, { abilities: [ward] }).map((e) => e.amount), [40]);
});

test("scaling: weapons decide how a unit's basic attack works: the same fire staff hits weakly on a unit with low Magic", () => {
  const staff = { type: "magical" as const, element: "fire", cooldown: 15, amount: MAG };
  assert.deepEqual(strike({ stats: { magic: 40, attack: 40 }, weapon: staff }, {}).map((e) => e.amount), [40]);
  assert.deepEqual(strike({ stats: { magic: 5, attack: 40 }, weapon: staff }, {}).map((e) => e.amount), [5]);
});

test("scaling: Detonate: 'deal 10 per Burn stack, then remove Burn' against a target with 12 stacks deals 120", () => {
  const burn = status("burn", { label: "debuff", stacking: "intensity", element: "fire", pulse: { every: 100, do: [{ op: "damage", type: "none", amount: 1 }] }, drop: { fraction: 0.5 } });
  const detonate = { id: "detonate", cast: 0, cooldown: 10, do: [
    { op: "damage", type: "magical", element: "fire", amount: { scale: [{ ratio: 10, stacks: "burn" }] } },
    { op: "remove", label: "debuff", status: "burn" },
  ] };
  const kindle = { id: "kindle", cast: 0, cooldown: 5, do: [{ op: "apply", status: "burn", stacks: 12 }] };
  const a = arena({ party: [{ name: "A", abilities: ["detonate", "kindle"] }], enemies: [{ name: "T", stats: { max_hp: 1e9 } }], statuses: [burn], abilities: [detonate, kindle] }).to(10);
  assert.deepEqual(a.hits("T").map((e) => e.amount), [120]);
  assert.equal(a.has("T", "burn").length, 0);
});

// ─── Healing ────────────────────────────────────────────────────────────────

const MEND = { id: "mend", cast: 0, cooldown: 10, target: { side: "allies", pick: "lowest", by: "hp" }, do: [{ op: "heal", amount: 40 }] };

function heal(healer: Spec, patient: Spec, statuses: unknown[] = []) {
  const a = arena({ party: [{ name: "Healer", abilities: ["mend"], ...healer }, { name: "Patient", hp: 50, ...patient, stats: { max_hp: 1000, ...patient.stats } }], enemies: [BAG], statuses, abilities: [MEND] }).to(10);
  return a.entries("heal").map((e) => e.amount);
}

test("healing: heals have no type and are never mitigated, so Armor and Resistance don't touch them", () => {
  assert.deepEqual(heal({}, { stats: { armor: 50, resist: 50 } }), [40]);
});

test("healing: heals take healing boosts, and the target's Healing received as a separate multiplier; anti-heal (−50) halves them", () => {
  const blessed = status("blessed", { boosts: [{ tag: "healing", pct: 50 }] });
  assert.deepEqual(heal({ statuses: ["blessed"] }, {}, [blessed]), [60]);
  assert.deepEqual(heal({}, { stats: { healing_received: -50 } }), [20]);
  assert.deepEqual(heal({ statuses: ["blessed"] }, { stats: { healing_received: -50 } }, [blessed]), [30]);
});

test("healing: heals from actions crit, and never raise HP above max", () => {
  assert.deepEqual(heal({ stats: { crit_chance: 100 } }, {}), [60]);
  assert.deepEqual(heal({}, { stats: { max_hp: 60 } }), [10]);
});

// ─── Absorbs and shields ────────────────────────────────────────────────────

const BARRIER = status("barrier", { stacking: "intensity", absorb: true, cap: { scale: [{ ratio: 1, stat: "max_hp", of: "holder" }] } });
const WARD = (stacks: number, id = "ward") => ({ id, cast: 0, cooldown: 100, target: { side: "allies", pick: "lowest", by: "hp" }, do: [{ op: "apply", status: "barrier", stacks }] });

test("shields: a Barrier adds 40 shield stacks to a unit with 20; its shield total is 60, shown as one value", () => {
  const a = arena({ party: [{ name: "A", stats: { max_hp: 100 }, abilities: ["ward", "ward2"] }], enemies: [BAG], statuses: [BARRIER], abilities: [WARD(20), WARD(40, "ward2")] }).to(103);
  assert.equal(a.has("A", "barrier").length, 1);
  assert.equal(a.has("A", "barrier")[0].stacks, 60_000);
});

test("shields: damage hits the shield after mitigation and before HP, losing one stack per point soaked; soaked damage counts as damage taken but not HP lost", () => {
  const counter = status("counter", { reactions: [{ on: { event: "damage_taken" }, do: [{ op: "mp", amount: { scale: [{ ratio: 1, amount: true }] }, to: "holder" }] }, { on: { event: "hp_lost" }, do: [{ op: "mp", amount: { scale: [{ ratio: 100, amount: true }] }, to: "holder" }] }] });
  const a = arena({
    party: [{ name: "A", stats: { max_hp: 100, armor: 10, max_mp: 100_000 }, mp: 0, abilities: ["ward"], statuses: ["counter"] }],
    enemies: [{ name: "Foe", stats: { attack: 30 }, weapon: { ...weapons.axe, cooldown: 101 } }],
    statuses: [BARRIER, counter],
    abilities: [WARD(40)],
  }).to(102);
  assert.deepEqual(a.hits("A").map((e) => [e.amount, e.soaked, e.hp, e.shield]), [[20, 20, 100, 20]]);
  assert.equal(a.unit("A").mp, 20, "20 damage taken, 0 HP lost");
});

test("shields: anti-heal (Healing received −50) halves heals but doesn't touch shields; shields take no healing boosts", () => {
  const blessed = status("blessed", { boosts: [{ tag: "healing", pct: 50 }] });
  const a = arena({ party: [{ name: "A", stats: { max_hp: 100, healing_received: -50 }, abilities: ["ward"], statuses: ["blessed"] }], enemies: [BAG], statuses: [BARRIER, blessed], abilities: [WARD(40)] }).to(100);
  assert.equal(a.has("A", "barrier")[0].stacks, 40_000);
});

test("shields: with its cap set to max HP, a unit with 100 max HP holds at most 100 shield", () => {
  const a = arena({ party: [{ name: "A", stats: { max_hp: 100 }, abilities: ["ward"] }], enemies: [BAG], statuses: [BARRIER], abilities: [WARD(500)] }).to(100);
  assert.equal(a.has("A", "barrier")[0].stacks, 100_000);
});

test("shields: a dispel that removes buffs strips a shield, unless the shield is flagged unremovable", () => {
  const dispel = { id: "dispel", cast: 0, cooldown: 101, do: [{ op: "remove", label: "buff" }] };
  for (const unremovable of [false, true]) {
    const a = arena({
      party: [{ name: "A", stats: { max_hp: 100 }, abilities: ["ward"] }], enemies: [{ name: "Foe", abilities: ["dispel"] }],
      statuses: [{ ...BARRIER, unremovable }], abilities: [WARD(40), dispel],
    }).to(102);
    assert.equal(a.has("A", "barrier").length, unremovable ? 1 : 0);
  }
});

test("shields: absorbs soak pulses too, and several absorbs soak in the order they were first applied", () => {
  const poison = status("poison", { label: "debuff", pulse: { every: 1, do: [{ op: "damage", type: "none", amount: 15 }] } });
  const old = { ...BARRIER, id: "old_shield" }, young = { ...BARRIER, id: "young_shield" };
  const give = { id: "give", cast: 0, cooldown: 100, target: "self", do: [{ op: "apply", status: "old_shield", stacks: 10 }, { op: "apply", status: "young_shield", stacks: 10 }] };
  const sting = { id: "sting", cast: 0, cooldown: 100.5, do: [{ op: "apply", status: "poison" }] };
  const a = arena({ party: [{ name: "A", stats: { max_hp: 100 }, abilities: ["give"] }], enemies: [{ name: "Foe", abilities: ["sting"] }], statuses: [old, young, poison], abilities: [give, sting] }).to(101.5);
  assert.deepEqual(a.hits("A").map((e) => [e.src, e.soaked, e.hp]), [["poison", 15, 100]]);
  assert.equal(a.has("A", "old_shield").length, 0);
  assert.equal(a.has("A", "young_shield")[0].stacks, 5000);
});
