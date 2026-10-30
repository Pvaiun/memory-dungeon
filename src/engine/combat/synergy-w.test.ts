/**
 * Step 5i's engine additions, share W ("who and when"): X1 to X20 of
 * steps/05-core-set/5i-synergy/build/engine-spec.md, each with at least the spec's
 * test. Every status a test needs is written inline, so nothing here waits for content.
 *
 * The tests at the end are skipped: each needs a payload that share H fills (the breaker
 * from `take`, a knockout's killer, an action's MP paid and hits landed, Ctx's landed set).
 * Un-skip them at the merge.
 */
import { test } from "vitest";
import assert from "node:assert/strict";
import type * as S from "../../schema.js";
import { arena, weapons } from "./arena.js";
import { combat } from "./rules.js";
import { loadContent } from "../run.js";
import hollow from "../../../fixtures/hollow.pack.json" with { type: "json" };

const BAG = { name: "Bag", stats: { max_hp: 1_000_000 } };
const at = (ticks: number) => ticks * 1000;
const buff = (id: string, x: object = {}) => ({ id, name: id.toUpperCase(), label: "buff", show: "icon", stacking: "refresh", ...x });
const debuff = (id: string, x: object = {}) => buff(id, { label: "debuff", ...x });
const marker = (id: string, x: object = {}) => buff(id, { label: "marker", ...x });
/** A counter for what a test's reactions saw: apply it with stacks from the event's amount, or one at a time. */
const TALLY = buff("tally", { stacking: "intensity" });
const TALLY2 = buff("tally2", { stacking: "intensity" });
const TALLY3 = buff("tally3", { stacking: "intensity" });
const byAmount = { scale: [{ ratio: 1, amount: true }] };
const count = (to: string = "self", status = "tally") => ({ op: "apply", status, to });
const countAmount = (to: string = "self") => ({ op: "apply", status: "tally", stacks: byAmount, to });
const tally = (a: ReturnType<typeof arena>, name: string, status = "tally") => a.has(name, status).reduce((s, x) => s + x.stacks, 0) / 1000;
/** A test device: an ability with no wind-up or recovery. */
const now = (id: string, x: object) => ({ id, cast: 0, recovery: 0, cooldown: 1000, ...x });
const giver = (id: string, status: string, x: object = {}, target: unknown = "foe") => now(id, { target, do: [{ op: "apply", status, ...x }] });
const readyAt = (a: ReturnType<typeof arena>, unit: string, ability: string, tick: number) => {
  a.unit(unit).acts.find((x) => x.id === ability)!.ready = at(tick);
};
const lowestHp = { side: "foes", pick: "lowest", by: "hp" };
const rapid = (amount = 100) => ({ type: "physical" as const, cooldown: 2, amount });

// ─── X1. Events name who did it ──────────────────────────────────────────────

test("X1: a Shield emptied by damage ends with its peak as the amount", () => {
  const shield = buff("shield", { stacking: "intensity", absorb: true });
  const ear = buff("ear", { reactions: [{ on: { event: "status_ended", status: "shield", cause: ["stacks"] }, do: [countAmount()] }] });
  const a = arena({
    party: [{ name: "Wall", stats: { max_hp: 10_000 }, abilities: ["raise"], statuses: ["ear"] }],
    enemies: [{ name: "Brute", weapon: { type: "physical", cooldown: 10, amount: 300 } }],
    statuses: [shield, ear, TALLY], abilities: [now("raise", { target: "self", do: [{ op: "apply", status: "shield", stacks: 500 }] })],
  });
  readyAt(a, "Wall", "raise", 1);
  a.to(25);
  assert.equal(a.has("Wall", "shield").length, 0, "the second blow emptied it");
  assert.equal(tally(a, "Wall"), 500, "it held 500 at its peak, though it held 200 when the blow came");
});

test("X1: a foe knocked out with 7 Burn ends its Burn with amount 7 (cause ko)", () => {
  const burn = debuff("burn", { stacking: "intensity" });
  const wick = buff("wick", { reactions: [{ on: { event: "status_ended", status: "burn", whose: "foe", cause: ["ko"] }, do: [countAmount()] }] });
  const a = arena({
    party: [{ name: "Pyro", abilities: ["kindle", "kill"], statuses: ["wick"] }],
    enemies: [{ name: "Weak", stats: { max_hp: 10 } }, BAG],
    statuses: [burn, wick, TALLY],
    abilities: [giver("kindle", "burn", { stacks: 7 }, lowestHp), now("kill", { target: lowestHp, do: [{ op: "damage", type: "magical", amount: 1000 }] })],
  });
  readyAt(a, "Pyro", "kindle", 1);
  readyAt(a, "Pyro", "kill", 2);
  a.to(3);
  assert.ok(a.unit("Weak").ko);
  assert.equal(tally(a, "Pyro"), 7);
});

test("X1: a status removed names the remover as other; status_gained names the applier and the stacks it added, after the cap", () => {
  const weak = debuff("weak");
  const ear = buff("ear", { reactions: [{ on: { event: "status_ended", status: "weak", cause: ["removed"] }, do: [count("other")] }] });
  const cleanse = now("cleanse", { target: { side: "allies", where: { has: "weak" } }, do: [{ op: "remove", label: "debuff" }] });
  const a = arena({
    party: [{ name: "Medic", abilities: ["cleanse"] }, { name: "Patient", statuses: ["weak", "ear"] }],
    enemies: [BAG], statuses: [weak, ear, TALLY], abilities: [cleanse],
  });
  readyAt(a, "Medic", "cleanse", 1);
  a.to(3);
  assert.equal(a.has("Patient", "weak").length, 0);
  assert.equal(tally(a, "Medic"), 1, "the reaction's `to: other` reached the Medic");
  assert.equal(tally(a, "Patient"), 0);

  const frost = debuff("frost", { stacking: "intensity", cap: 5 });
  const bind = buff("bind", { reactions: [{ on: { event: "status_gained", whose: "foe", status: "frost", other: "holder" }, do: [countAmount()] }] });
  const b = arena({
    party: [{ name: "Binder", abilities: ["f1", "f2"], statuses: ["bind"] }],
    enemies: [BAG], statuses: [frost, bind, TALLY], abilities: [giver("f1", "frost", { stacks: 4 }), giver("f2", "frost", { stacks: 4 })],
  });
  readyAt(b, "Binder", "f1", 1);
  readyAt(b, "Binder", "f2", 2);
  b.to(3);
  assert.equal(tally(b, "Binder"), 5, "4, then 1 under the cap of 5");
});

test("an Intensity application of no stacks does nothing: no log, no event, no fresh duration, no IMMUNE (Frostbite bow's Sunder below 8 Chill)", () => {
  const sunder = debuff("sunder", { stacking: "intensity", duration: 10 });
  const ear = buff("ear", { reactions: [{ on: { event: "status_gained", whose: "foe", status: "sunder" }, do: [count()] }] });
  // A swing that adds a Sunder for each 8 Chill the target holds: none at all under 8.
  const bow: S.WeaponT = { type: "physical", cooldown: 2, amount: 1, apply: [{ status: "sunder", stacks: { scale: [{ ratio: 0.125, stacks: "chill", of: "target" }] } }] };
  const a = arena({ party: [{ name: "Bow", weapon: bow, abilities: ["s1"], statuses: ["ear"] }], enemies: [BAG], statuses: [sunder, debuff("chill"), ear, TALLY], abilities: [giver("s1", "sunder", { stacks: 2 })] });
  readyAt(a, "Bow", "s1", 1);
  a.to(9);
  assert.equal(a.hits("Bag").length, 4);
  assert.equal(a.entries("status", (e) => e.status === "sunder").length, 1, "only the giver's application");
  assert.equal(a.has("Bag", "sunder")[0].end, at(11), "the swings didn't renew it");
  assert.equal(tally(a, "Bow"), 1);

  const b = arena({ party: [{ name: "Z", abilities: ["z"] }], enemies: [{ ...BAG, stats: { max_hp: 1e6, "immune:status:sunder": 1 } }], statuses: [sunder], abilities: [giver("z", "sunder", { stacks: 0 })] });
  readyAt(b, "Z", "z", 1);
  b.to(2);
  assert.deepEqual([b.acts("Z", "z").length, b.entries("immune").length], [1, 0]);
});

// ─── X2. Event filters ───────────────────────────────────────────────────────

test("X2: healed with other: holder hears the holder's heal of an ally, not the ally's own Lifesteal", () => {
  const leech = buff("leech", { reactions: [{ on: { event: "hit_lands" }, do: [{ op: "heal", amount: 10, to: "self" }] }] });
  const ear = buff("ear", { reactions: [{ on: { event: "healed", whose: "ally", other: "holder" }, do: [count()] }] });
  const mend = { id: "mend", cast: 0, recovery: 0, cooldown: 5, target: { side: "others", pick: "lowest", by: "hp_share" }, do: [{ op: "heal", amount: 100 }] };
  const a = arena({
    party: [{ name: "Healer", abilities: ["mend"], statuses: ["ear"] }, { name: "Ally", stats: { max_hp: 100_000 }, hp: 500, weapon: rapid(), statuses: ["leech"] }],
    enemies: [BAG], statuses: [leech, ear, TALLY], abilities: [mend],
  }).to(30.5);
  const given = a.entries("heal", (e) => e.by === "p1").length, own = a.entries("heal", (e) => e.by === "p2").length;
  assert.ok(given >= 4 && own >= 10, `${given} heals given, ${own} of its own`);
  assert.equal(tally(a, "Healer"), given);
});

test("X2: other: foe and any; source: holder on status events; notTags and amountAtLeast on hits", () => {
  // source: only the wards this unit gave, as they land and as they end.
  const ward = buff("ward", { duration: 4 });
  const mine = buff("mine", {
    reactions: [
      { on: { event: "status_gained", whose: "ally", status: "ward", source: "holder" }, do: [count()] },
      { on: { event: "status_ended", whose: "ally", status: "ward", source: "holder" }, do: [count()] },
    ],
  });
  const a = arena({
    party: [{ name: "A", abilities: ["wa"], statuses: ["mine"] }, { name: "B", abilities: ["wb"] }, { name: "C", stats: { aggro: 50 } }, { name: "D", stats: { aggro: 150 } }],
    enemies: [BAG], statuses: [ward, mine, TALLY],
    abilities: [giver("wa", "ward", {}, { side: "others", pick: "lowest", by: { stat: "aggro" } }), giver("wb", "ward", {}, { side: "others", pick: "highest", by: { stat: "aggro" } })],
  });
  readyAt(a, "A", "wa", 1);
  readyAt(a, "B", "wb", 1);
  a.to(10);
  assert.equal(a.entries("status", (e) => e.status === "ward").length, 2);
  assert.equal(tally(a, "A"), 2, "A's ward on C landing and ending; B's on D is heard by nobody");

  // notTags and amountAtLeast: physical swings of 100 and a magical spell of 300.
  const ears = buff("ears", {
    reactions: [
      { on: { event: "hit_lands", notTags: ["magical"] }, do: [count()] },
      { on: { event: "hit_lands", amountAtLeast: 200 }, do: [count("self", "tally2")] },
      { on: { event: "hit_lands", other: "foe" }, do: [count("self", "tally3")] },
      { on: { event: "hit_lands", other: "ally" }, do: [count("self", "tally3")] },
      { on: { event: "hit_taken", whose: "foe", other: "any" }, do: [count("self", "tally3")] },
    ],
  });
  const b = arena({
    party: [{ name: "Striker", weapon: rapid(), abilities: ["zap"], statuses: ["ears"] }],
    enemies: [BAG], statuses: [ears, TALLY, TALLY2, TALLY3],
    abilities: [{ id: "zap", cast: 0, recovery: 0, cooldown: 5, do: [{ op: "damage", type: "magical", amount: 300 }] }],
  }).to(30.5);
  const physical = b.hits("Bag").filter((e) => e.kind === "physical").length, magical = b.hits("Bag").filter((e) => e.kind === "magical").length;
  assert.ok(physical > 5 && magical > 3);
  assert.equal(tally(b, "Striker"), physical);
  assert.equal(tally(b, "Striker", "tally2"), magical, "the 300s only");
  assert.equal(tally(b, "Striker", "tally3"), 2 * (physical + magical), "every hit landed on a foe, and every hit the foe took from anyone; none on an ally");
});

// ─── X3. Tests on reactions and pulses ───────────────────────────────────────

test("X3: a reaction's test of the other unit: heals only on hits against a Sundered foe, read as the reaction resolves", () => {
  const sunder = debuff("sunder");
  const drink = buff("drink", { reactions: [{ on: { event: "hit_lands" }, if: { unit: "other", where: { has: "sunder" } }, do: [{ op: "heal", amount: 10, to: "self" }] }] });
  const a = arena({
    party: [{ name: "Leecher", stats: { max_hp: 1_000_000 }, hp: 1000, weapon: rapid(), statuses: ["drink"] }],
    enemies: [{ name: "S", stats: { max_hp: 1e6 }, statuses: ["sunder"] }, { name: "N", stats: { max_hp: 1e6 } }],
    statuses: [sunder, drink],
  }).to(100.5);
  assert.ok(a.hits("S").length > 5 && a.hits("N").length > 5);
  assert.equal(a.entries("heal").length, a.hits("S").length);

  // The first hit applies the Sunder after its events: the test, read on the next sub-tick, already sees it.
  const b = arena({
    party: [{ name: "Leecher", stats: { max_hp: 1_000_000 }, hp: 1000, weapon: { ...rapid(), apply: [{ status: "sunder" }] }, statuses: ["drink"] }],
    enemies: [{ name: "T", stats: { max_hp: 1e6 } }], statuses: [sunder, drink],
  }).to(3);
  assert.deepEqual([b.hits("T").length, b.entries("heal").length], [1, 1]);
});

test("X3: a reaction's test of a side's state, read from the actor's side; failing, the reaction does nothing", () => {
  const vigil = buff("vigil", { reactions: [{ on: { event: "hit_taken" }, if: { side: "allies", where: { ko: true } }, do: [count()] }] });
  const run = (down: boolean) =>
    arena({
      party: [{ name: "Watch", stats: { max_hp: 1e6 }, statuses: ["vigil"] }, { name: "Other", ko: down }],
      enemies: [{ name: "Hitter", weapon: { type: "physical", cooldown: 5, amount: 1 } }],
      statuses: [vigil, TALLY],
    }).to(22);
  const down = run(true), up = run(false);
  assert.equal(tally(down, "Watch"), 4);
  assert.equal(tally(up, "Watch"), 0, `the Hitter still hit ${up.hits("Watch").length} times`);
  assert.ok(up.hits("Watch").length + up.hits("Other").length === 4);
});

test("X3: a pulse with a condition adds Heat only while a foe burns; an Intensity pulse that fails still drops", () => {
  const burn = debuff("burn", { duration: 6 });
  const heat = buff("heat", { stacking: "intensity" });
  const kindled = buff("kindled", { pulse: { every: 2, if: { side: "foes", where: { has: "burn" } }, do: [{ op: "apply", status: "heat" }] } });
  const ember = buff("ember", { stacking: "intensity", pulse: { every: 2, if: { side: "foes", where: { has: "burn" } }, do: [{ op: "apply", status: "heat" }] }, drop: { count: 1 } });
  const a = arena({
    party: [{ name: "Robe", abilities: ["light"], statuses: ["kindled"] }],
    enemies: [BAG], statuses: [burn, heat, kindled, ember], abilities: [giver("light", "burn")],
  });
  readyAt(a, "Robe", "light", 5);
  a.to(30);
  assert.equal(tally(a, "Robe", "heat"), 3, "the pulses at 6, 8 and 10; the Burn ended at 11");

  const b = arena({ party: [{ name: "Palm", abilities: ["stoke"] }], enemies: [BAG], statuses: [heat, ember], abilities: [giver("stoke", "ember", { stacks: 3 }, "self")] });
  readyAt(b, "Palm", "stoke", 1);
  b.to(10);
  assert.equal(b.has("Palm", "ember").length, 0, "three beats with no Burn: nothing, but a stack lost each");
  assert.equal(b.has("Palm", "heat").length, 0);
});

test("X3: Condition.atMost: an ability that waits while no foe is Marked (atMost 0), and atMost without atLeast", () => {
  const mark = debuff("mark");
  const solo = { id: "solo", cast: 0, recovery: 0, cooldown: 5, if: { side: "foes", where: { has: "mark" }, atMost: 0 }, do: [{ op: "damage", type: "magical", amount: 1 }] };
  const few = { id: "few", cast: 0, recovery: 0, cooldown: 5, if: { side: "foes", where: { has: "mark" }, atMost: 1 }, do: [{ op: "damage", type: "magical", amount: 1 }] };
  const run = (ability: string, marked: number) =>
    arena({
      party: [{ name: "Hunter", abilities: [ability] }],
      enemies: [0, 1].map((i) => ({ ...BAG, name: `F${i}`, statuses: i < marked ? ["mark"] : [] })),
      statuses: [mark], abilities: [solo, few],
    }).to(6);
  assert.equal(run("solo", 0).acts("Hunter", "solo").length, 1);
  assert.equal(run("solo", 1).acts("Hunter", "solo").length, 0);
  assert.equal(run("few", 1).acts("Hunter", "few").length, 1);
  assert.equal(run("few", 2).acts("Hunter", "few").length, 0);
});

// ─── X4. Has any of; a stat lower than the reader's ──────────────────────────

test("X4: a boost when the target has any of Stun or Silence reaches a Silenced foe and a Stunned one, not a Slowed one", () => {
  const [stun, silence, slow] = ["stun", "silence", "slow"].map((id) => debuff(id));
  const vise = buff("vise", { boosts: [{ tag: "basic", pct: { scale: [{ ratio: 100, when: { hasAny: ["stun", "silence"] }, of: "target" }] } }] });
  const a = arena({
    party: [{ name: "Vise", weapon: rapid(), statuses: ["vise"] }],
    enemies: ["stun", "silence", "slow"].map((s) => ({ name: s, stats: { max_hp: 1e6 }, statuses: [s] })),
    statuses: [stun, silence, slow, vise],
  }).to(100);
  for (const [foe, want] of [["stun", 200], ["silence", 200], ["slow", 100]] as const) {
    const amounts = new Set(a.hits(foe).map((e) => e.amount));
    assert.deepEqual([...amounts], [want], `${foe}: ${[...amounts]}`);
  }
});

test("X4: a rule for allies with less Armor than the actor picks the ally with Armor 2 and skips the one with 6 when the actor has 5", () => {
  const aura = buff("aura");
  const a = arena({
    party: [{ name: "Phalanx", stats: { armor: 5 }, abilities: ["cover"] }, { name: "Light", stats: { armor: 2 } }, { name: "Heavy", stats: { armor: 6 } }],
    enemies: [BAG], statuses: [aura],
    abilities: [giver("cover", "aura", {}, { side: "others", pick: "all", where: { lower: { stat: "armor" } } })],
  });
  readyAt(a, "Phalanx", "cover", 1);
  a.to(2);
  assert.deepEqual([a.has("Light", "aura").length, a.has("Heavy", "aura").length, a.has("Phalanx", "aura").length], [1, 0, 0]);
});

// ─── X5. Hasn't acted this fight ─────────────────────────────────────────────

test("X5: a boost on a foe that hasn't acted reaches its hits taken before its first action and not after", () => {
  const quietus = buff("quietus", { boosts: [{ tag: "basic", pct: { scale: [{ ratio: 100, when: { acted: false }, of: "target" }] } }] });
  const a = arena({
    party: [{ name: "Quick", weapon: rapid(), statuses: ["quietus"] }],
    enemies: [{ name: "Sleeper", stats: { max_hp: 1e6 }, weapon: { type: "physical", cooldown: 11, amount: 1 } }],
    statuses: [quietus],
  }).to(30);
  const first = a.acts("Sleeper")[0];
  assert.equal(first, 11);
  const hits = a.hits("Sleeper");
  assert.ok(hits.every((e) => e.amount === ((e.at as number) < at(first) ? 200 : 100)), hits.map((e) => `${e.at}:${e.amount}`).join(" "));
  assert.ok(hits.some((e) => e.amount === 200) && hits.some((e) => e.amount === 100));
  assert.equal(a.unit("Sleeper").acted, true);
});

// ─── X6. The top of its side ─────────────────────────────────────────────────

test("X6: of foes with Attack 3, 5 and 5, the two at 5 are the top of their side and the 3 isn't", () => {
  const sentence = debuff("sentence");
  const a = arena({
    party: [{ name: "Judge", abilities: ["judge"] }],
    enemies: [3, 5, 5].map((attack, i) => ({ name: `F${i}`, stats: { max_hp: 1e6, attack } })),
    statuses: [sentence], abilities: [giver("judge", "sentence", {}, { side: "foes", pick: "all", where: { top: { stats: ["attack", "magic"] } } })],
  });
  readyAt(a, "Judge", "judge", 1);
  a.to(2);
  assert.deepEqual(["F0", "F1", "F2"].map((f) => a.has(f, "sentence").length), [0, 1, 1]);
});

// ─── X7. Wields a kind ───────────────────────────────────────────────────────

test("X7: a seat status whose Attack speed change is when it wields a great weapon slows the axe and not the sword", () => {
  const hammer = buff("hammer", { stats: [{ stat: "attack_speed", flat: { scale: [{ ratio: -50, when: { weapon: ["great_weapon"] } }] } }] });
  const a = arena({
    party: [{ name: "Axe", weapon: { ...weapons.axe, kind: "great_weapon" }, statuses: ["hammer"] }, { name: "Sword", weapon: { ...weapons.sword, kind: "sword" }, statuses: ["hammer"] }],
    enemies: [BAG], statuses: [hammer],
  });
  assert.equal(a.unit("Axe").stats.attack_speed, -50);
  assert.equal(a.unit("Sword").stats.attack_speed, 0);
});

// ─── X8. Counts as numbers ───────────────────────────────────────────────────

test("X8: a boost of 10% a debuff on the target deals +30% to a foe with three debuffs and a marker", () => {
  const ds = ["d1", "d2", "d3"].map((id) => debuff(id));
  const seen = marker("seen");
  const hexweave = buff("hexweave", { boosts: [{ tag: "basic", pct: { scale: [{ ratio: 10, count: "debuffs", of: "target" }] } }] });
  const a = arena({
    party: [{ name: "Hex", weapon: { type: "physical", cooldown: 5, amount: 1000 }, statuses: ["hexweave"] }],
    enemies: [{ ...BAG, statuses: ["d1", "d2", "d3", "seen"] }], statuses: [...ds, seen, hexweave],
  }).to(6);
  assert.deepEqual(a.hits("Bag").map((e) => e.amount), [1300]);
});

test("X8: an action counts its targets, and the units on a side that pass a test (from the actor's side by default)", () => {
  const burn = debuff("burn");
  const surge = now("surge", { target: { side: "foes", pick: "all" }, do: [{ op: "damage", type: "magical", amount: 1 }, { op: "mp", amount: { scale: [{ ratio: 120, count: "targets" }] }, to: "self" }] });
  const tally_ = now("reckon", { target: "self", do: [{ op: "mp", amount: { scale: [{ ratio: 100, count: { side: "foes", where: { has: "burn" } } }] } }] });
  const a = arena({
    party: [{ name: "Mage", stats: { max_mp: 5000 }, mp: 0, abilities: ["surge", "reckon"] }],
    enemies: [0, 1, 2].map((i) => ({ ...BAG, name: `F${i}`, statuses: i ? ["burn"] : [] })),
    statuses: [burn], abilities: [surge, tally_],
  });
  readyAt(a, "Mage", "surge", 1);
  readyAt(a, "Mage", "reckon", 2);
  a.to(3);
  assert.deepEqual(a.entries("mp", (e) => e.part === "action").map((e) => [e.src, e.amount]), [["surge", 360], ["reckon", 200]]);
});

// ─── X9. Pick by swing ───────────────────────────────────────────────────────

test("X9: of allies with a dagger and an axe, highest by swing picks the axe; Hasted, still the axe unless its swing falls under the dagger's", () => {
  const drum = buff("drum");
  const run = (haste: number) => {
    const a = arena({
      party: [{ name: "Horn", abilities: ["horn"] }, { name: "Dagger", weapon: weapons.dagger }, { name: "Axe", weapon: weapons.axe, flat: { attack_speed: haste } }],
      enemies: [BAG], statuses: [drum], abilities: [giver("horn", "drum", {}, { side: "others", pick: "highest", by: "swing" })],
    });
    readyAt(a, "Horn", "horn", 1);
    a.to(1);
    return a.has("Dagger", "drum").length ? "Dagger" : a.has("Axe", "drum").length ? "Axe" : "nobody";
  };
  assert.equal(run(0), "Axe");
  assert.equal(run(100), "Axe", "10 ticks against the dagger's 8");
  assert.equal(run(200), "Dagger", "6.7 ticks against 8");
});

// ─── X10. Skip the event's units ─────────────────────────────────────────────

test("X10: a status_capped reaction applying Chill to every foe but the owner reaches every foe but the one that capped", () => {
  const chill = debuff("chill", { stacking: "intensity", cap: 3 });
  const splinters = buff("splinters", { reactions: [{ on: { event: "status_capped", whose: "foe", status: "chill" }, do: [{ op: "apply", status: "chill", to: { side: "foes", pick: "all", exclude: "owner" } }] }] });
  const a = arena({
    party: [{ name: "Frost", abilities: ["freeze"], statuses: ["splinters"] }],
    enemies: [1, 2, 3].map((attack, i) => ({ name: `F${i}`, stats: { max_hp: 1e6, attack } })),
    statuses: [chill, splinters], abilities: [giver("freeze", "chill", { stacks: 3 }, { side: "foes", pick: "lowest", by: { stat: "attack" } })],
  });
  readyAt(a, "Frost", "freeze", 1);
  a.to(3);
  assert.deepEqual(["F0", "F1", "F2"].map((f) => tally(a, f, "chill")), [3, 1, 1]);
});

test("X10: exclude other skips the attacker", () => {
  const tag = debuff("tag");
  const thorns = buff("spread", { reactions: [{ on: { event: "hit_taken" }, do: [{ op: "apply", status: "tag", to: { side: "foes", pick: "all", exclude: "other" } }] }] });
  const a = arena({
    party: [{ name: "Thorny", stats: { max_hp: 1e6 }, statuses: ["spread"] }],
    enemies: [{ name: "Hitter", weapon: { type: "physical", cooldown: 5, amount: 1 } }, { ...BAG, name: "B1" }, { ...BAG, name: "B2" }],
    statuses: [tag, thorns],
  }).to(6);
  assert.deepEqual(["Hitter", "B1", "B2"].map((f) => a.has(f, "tag").length), [0, 1, 1]);
});

// ─── X11. Marked ─────────────────────────────────────────────────────────────

const MARKED = debuff("marked", { focus: true, single: true });
const TAUNT = buff("taunt", { stats: [{ stat: "forced", flat: 1 }] });
const SEEKING = buff("seeking", { seek: "basic" });

test("X11: with B Marked a sword's swings all go to B; with A Taunting they go to A, and with Seek to B", () => {
  const run = (a: string[], sword: string[]) =>
    arena({
      party: [{ name: "Sword", weapon: weapons.sword, statuses: sword }],
      enemies: [{ ...BAG, name: "A", statuses: a }, { ...BAG, name: "B", statuses: ["marked"] }],
      statuses: [MARKED, TAUNT, SEEKING],
    }).to(60);
  const plain = run([], []), taunted = run(["taunt"], []), seeking = run(["taunt"], ["seeking"]);
  assert.deepEqual([plain.hits("A").length, plain.hits("B").length], [0, 5]);
  assert.deepEqual([taunted.hits("A").length, taunted.hits("B").length], [5, 0]);
  assert.deepEqual([seeking.hits("A").length, seeking.hits("B").length], [0, 5]);
  // Abilities keep their own targeting: draw by Aggro, Marked or not.
  const spells = arena({
    party: [{ name: "Mage", abilities: ["bolt"] }],
    enemies: [{ ...BAG, name: "A" }, { ...BAG, name: "B", statuses: ["marked"] }],
    statuses: [MARKED], abilities: [{ id: "bolt", cast: 0, recovery: 0, cooldown: 1, do: [{ op: "damage", type: "magical", amount: 1 }] }],
  }).to(80);
  assert.ok(spells.hits("A").length > 20 && spells.hits("B").length > 20);
});

test("X11: each applier keeps one copy of a single status: marking A ends the Mark it gave B", () => {
  const a = arena({
    party: [{ name: "Marker", abilities: ["mark_b", "mark_a"] }, { name: "Other", abilities: ["mark_b2"] }],
    enemies: [{ name: "A", stats: { max_hp: 100 } }, { name: "B", stats: { max_hp: 200 } }, { name: "C", stats: { max_hp: 300 } }],
    statuses: [MARKED],
    abilities: [
      giver("mark_b", "marked", {}, { side: "foes", pick: "lowest", by: "hp", where: { hpAtLeast: 100 }, count: 1 }),
      giver("mark_a", "marked", {}, lowestHp),
      giver("mark_b2", "marked", {}, { side: "foes", pick: "highest", by: "hp" }),
    ],
  });
  a.unit("A").hp = 99; // mark_b picks the lowest at full HP: B
  readyAt(a, "Marker", "mark_b", 1);
  readyAt(a, "Other", "mark_b2", 1);
  readyAt(a, "Marker", "mark_a", 3);
  a.to(2);
  assert.deepEqual(["A", "B", "C"].map((f) => a.has(f, "marked").length), [0, 1, 1]);
  a.to(4);
  assert.deepEqual(["A", "B", "C"].map((f) => a.has(f, "marked").length), [1, 0, 1], "B's Mark ended; the other applier's on C stays");
  assert.deepEqual(a.entries("status_end", (e) => e.status === "marked").map((e) => [e.unit, e.cause]), [["e2", "removed"]]);
});

// ─── X12. Basic attacks aimed by a rule ──────────────────────────────────────

test("X12: an aim at every foe, first, hits all three foes with each swing; an aim at the lowest HP share comes after a Mark unless it's first", () => {
  const sweep = buff("sweep", { aim: { rule: { side: "foes", pick: "all" }, first: true } });
  const a = arena({
    party: [{ name: "Scythe", weapon: weapons.sword, statuses: ["sweep"] }],
    enemies: ["A", "B", "C"].map((name) => ({ ...BAG, name })), statuses: [sweep],
  }).to(25);
  assert.deepEqual(["A", "B", "C"].map((f) => a.hits(f).length), [2, 2, 2]);
  assert.deepEqual(a.entries("act")[0].targets, ["e1", "e2", "e3"]);

  const quarry = (first: boolean) =>
    arena({
      party: [{ name: "Hunter", weapon: weapons.sword, statuses: ["quarry"] }],
      enemies: [{ name: "Hurt", stats: { max_hp: 1e6 }, hp: 500_000 }, { ...BAG, name: "Marked", statuses: ["marked"] }, { ...BAG, name: "Other" }],
      statuses: [MARKED, buff("quarry", { aim: { rule: { side: "foes", pick: "lowest", by: "hp_share" }, ...(first ? { first: true } : {}) } })],
    }).to(25);
  assert.deepEqual(["Hurt", "Marked", "Other"].map((f) => quarry(false).hits(f).length), [0, 2, 0]);
  assert.deepEqual(["Hurt", "Marked", "Other"].map((f) => quarry(true).hits(f).length), [2, 0, 0]);
});

test("X12: an aim that finds nobody passes to the next step", () => {
  const vise = buff("vise", { aim: { rule: { side: "foes", where: { has: "stun" } }, first: true } });
  const a = arena({
    party: [{ name: "Vise", weapon: weapons.sword, statuses: ["vise"] }],
    enemies: [{ ...BAG, name: "A" }, { ...BAG, name: "B", statuses: ["marked"] }], statuses: [vise, MARKED, debuff("stun")],
  }).to(25);
  assert.deepEqual([a.hits("A").length, a.hits("B").length], [0, 2]);
});

// ─── X13. Seats ──────────────────────────────────────────────────────────────

test("X13: a reaction on action_resolve with seat previous fires for slot 1 when slot 0 casts, and for slot 0 when slot 2 casts", () => {
  const relay = buff("relay", { reactions: [{ on: { event: "action_resolve", whose: "ally", kind: "ability", seat: "previous" }, do: [count()] }] });
  const a = arena({
    party: [{ name: "P0", abilities: ["go"], statuses: ["relay"] }, { name: "P1", statuses: ["relay"] }, { name: "P2", abilities: ["go"], statuses: ["relay"] }],
    enemies: [BAG], statuses: [relay, TALLY], abilities: [now("go", { target: "self", do: [{ op: "mp", amount: 0 }] })],
  });
  ["front", "middle", "back"].forEach((seat, i) => (a.unit(`P${i}`).seat = seat));
  readyAt(a, "P0", "go", 1);
  readyAt(a, "P2", "go", 3);
  a.to(2);
  assert.deepEqual(["P0", "P1", "P2"].map((p) => tally(a, p)), [0, 1, 0]);
  a.to(4);
  assert.deepEqual(["P0", "P1", "P2"].map((p) => tally(a, p)), [1, 1, 0]);
});

test("X13: a rule and a condition narrowed to a seat, by id or as the next one; enemies sit in none; the party's seats come from its positions", () => {
  const cue = buff("cue");
  const a = arena({
    party: [{ name: "P0", abilities: ["next", "back", "waits"] }, { name: "P1" }, { name: "P2", stats: { max_hp: 1000 }, hp: 400 }],
    enemies: [BAG], statuses: [cue],
    abilities: [
      giver("next", "cue", {}, { side: "allies", seat: "next" }),
      giver("back", "cue", {}, { side: "allies", seat: "back" }),
      { ...giver("waits", "cue", {}, "self"), if: { side: "allies", seat: "back", where: { hpBelow: 50 } } },
    ],
  });
  ["front", "middle", "back"].forEach((seat, i) => (a.unit(`P${i}`).seat = seat));
  readyAt(a, "P0", "next", 1);
  readyAt(a, "P0", "back", 2);
  readyAt(a, "P0", "waits", 3);
  a.to(4);
  assert.deepEqual(["P0", "P1", "P2"].map((p) => a.has(p, "cue").length), [1, 1, 1]);
  assert.equal(a.unit("Bag").seat, undefined);

  const c = loadContent(hollow);
  const units = combat.party(c, { dungeon: c.pack.dungeons[0].id, seed: 1, party: { formation: "hearth_guard", units: [
    { class: "warrior", position: "shield", abilities: [], gear: {} },
    { class: "ranger", position: "left_hunter", abilities: [], gear: {} },
  ] } }) as { seat?: string }[];
  assert.deepEqual(units.map((u) => u.seat), ["shield", "left_hunter"]);
});

// ─── X14. Markers ────────────────────────────────────────────────────────────

test("X14: a foe holding a marker and no debuff fails debuffs: true and survives a Cleanse; a remove that names it lifts it", () => {
  const seen = marker("seen");
  const a = arena({
    party: [{ name: "Cleric", abilities: ["pick", "cleanse", "lift"] }],
    enemies: [{ ...BAG, statuses: ["seen"] }], statuses: [seen, debuff("tag")],
    abilities: [
      { ...giver("pick", "tag"), cooldown: 1, if: { side: "foes", where: { debuffs: true } } },
      now("cleanse", { do: [{ op: "remove", label: "debuff" }] }),
      now("lift", { do: [{ op: "remove", label: "marker", status: "seen" }] }),
    ],
  });
  readyAt(a, "Cleric", "pick", 1);
  readyAt(a, "Cleric", "cleanse", 2);
  a.to(3);
  assert.deepEqual(a.entries("act").map((e) => e.act), ["cleanse"], "no foe has a debuff: the marker doesn't count");
  assert.equal(a.has("Bag", "seen").length, 1);
  readyAt(a, "Cleric", "lift", 4);
  a.to(5);
  assert.equal(a.has("Bag", "seen").length, 0);
});

test("X14: no immunity to debuffs stops a marker, and its pulses resolve in its holder's own batch", () => {
  const watch = marker("watch", { pulse: { every: 5 } });
  const a = arena({
    party: [{ name: "P", statuses: ["watch"] }],
    enemies: [{ ...BAG, stats: { max_hp: 1e6, "immune:debuffs": 1 }, statuses: ["watch", "mark"] }],
    statuses: [watch, debuff("mark")],
  });
  assert.deepEqual([a.has("Bag", "watch").length, a.has("Bag", "mark").length], [1, 0], "the debuff is stopped, the marker isn't");
  const batchOf = (unit: string) => a.f.queue.find((it) => it.k === "pulse" && it.unit === a.unit(unit).id)!.b;
  assert.deepEqual([batchOf("P"), batchOf("Bag")], [0, 1]);
});

// ─── X15. Taunt ends Hidden ──────────────────────────────────────────────────

test("X15: a Hidden unit that gains Taunt loses Hidden at once; Hidden applied to a Taunting unit doesn't land", () => {
  const hidden = buff("hidden", { unremovable: true, stats: [{ stat: "forbidden", flat: 1 }] });
  const a = arena({
    party: [{ name: "Rogue", abilities: ["taunt_me"], statuses: ["hidden"] }],
    enemies: [BAG], statuses: [hidden, TAUNT], abilities: [giver("taunt_me", "taunt", {}, "self")],
  });
  readyAt(a, "Rogue", "taunt_me", 1);
  a.to(1);
  assert.equal(a.has("Rogue", "hidden").length, 0);
  assert.deepEqual(a.entries("status_end", (e) => e.status === "hidden").map((e) => [e.at, e.cause]), [[at(1), "removed"]]);

  const b = arena({
    party: [{ name: "Knight", abilities: ["vanish"], statuses: ["taunt"] }],
    enemies: [BAG], statuses: [hidden, TAUNT], abilities: [giver("vanish", "hidden", {}, "self")],
  });
  readyAt(b, "Knight", "vanish", 1);
  b.to(2);
  assert.equal(b.has("Knight", "hidden").length, 0);
  assert.equal(b.entries("immune").length, 0);
});

// ─── X16. Extra strikes heard as basic attacks ───────────────────────────────

test("X16: with echo a Double strike's second hit sets off a basic hit_lands rider, and a basic boost doesn't reach it", () => {
  const burn = debuff("burn", { stacking: "intensity" });
  const double = buff("double", { strike: { to: "target" } });
  const echo = buff("echo", { echo: true });
  const rider = buff("rider", { reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [{ op: "apply", status: "burn", to: "other" }] }] });
  const boost = buff("boost", { boosts: [{ tag: "basic", pct: 100 }] });
  const run = (statuses: string[]) =>
    arena({
      party: [{ name: "Monk", weapon: { type: "physical", cooldown: 10, amount: 100 }, statuses: ["double", "boost", ...statuses] }],
      enemies: [BAG], statuses: [burn, double, echo, rider, boost, TALLY],
    }).to(11);
  const on = run(["echo", "rider"]), off = run(["rider"]);
  assert.deepEqual(on.hits("Bag").map((e) => [e.part, e.amount]), [["hit", 200], ["extra", 100]]);
  assert.equal(tally(on, "Bag", "burn"), 2);
  assert.equal(tally(off, "Bag", "burn"), 1);

  // A status that hears extra strikes itself for the same event (Iron palm) isn't told twice; one that gives the strike isn't told at all.
  const palm = buff("palm", { reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [count()] }, { on: { event: "hit_lands", kind: "extra" }, do: [count()] }] });
  const giverRider = buff("double2", { strike: { to: "target" }, reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [count("self", "tally2")] }] });
  const b = arena({
    party: [{ name: "Monk", weapon: { type: "physical", cooldown: 10, amount: 100 }, statuses: ["double2", "echo", "palm"] }],
    enemies: [BAG], statuses: [echo, palm, giverRider, TALLY, TALLY2],
  }).to(11);
  assert.equal(tally(b, "Monk"), 2);
  assert.equal(tally(b, "Monk", "tally2"), 1);
});

// ─── X17. A stat set to a value ──────────────────────────────────────────────

test("X17: a unit with crit chance 20 and the set reads 50; a doubling leaves it at 50", () => {
  const coin = buff("coin", { set: [{ stat: "crit_chance", value: 50 }] });
  const bedrock = buff("bedrock", { stats: [{ stat: "crit_chance", pct: 100 }] });
  const a = arena({
    party: [{ name: "Gambler", stats: { crit_chance: 20 }, statuses: ["coin"] }, { name: "Both", stats: { crit_chance: 20 }, statuses: ["coin", "bedrock"] }, { name: "Doubled", stats: { crit_chance: 20 }, statuses: ["bedrock"] }],
    enemies: [BAG], statuses: [coin, bedrock],
  });
  assert.deepEqual(["Gambler", "Both", "Doubled"].map((u) => a.unit(u).stats.crit_chance), [50, 50, 40]);
});

// ─── X18. A stat read live from another ──────────────────────────────────────

test("X18: Thorns from 5% of Armor read 200 at Armor 4,000 and 350 the moment Guard lands; read once, they stay at 200", () => {
  const scale = { scale: [{ ratio: 0.05, stat: "armor", of: "holder" }] };
  const spiked = buff("spiked", { stats: [{ stat: "thorns", flat: scale, live: true }] });
  const fixed = buff("fixed", { stats: [{ stat: "thorns", flat: scale }] });
  const guard = buff("guard", { duration: 5, stats: [{ stat: "armor", flat: 3000 }] });
  const run = (s: string) => {
    const a = arena({ party: [{ name: "Wall", stats: { armor: 4000 }, abilities: ["guard_up"], statuses: [s] }], enemies: [BAG], statuses: [spiked, fixed, guard], abilities: [giver("guard_up", "guard", {}, "self")] });
    readyAt(a, "Wall", "guard_up", 1);
    const before = a.unit("Wall").stats.thorns;
    a.to(1);
    const during = a.unit("Wall").stats.thorns;
    a.to(7);
    return [before, during, a.unit("Wall").stats.thorns];
  };
  assert.deepEqual(run("spiked"), [200, 350, 200]);
  assert.deepEqual(run("fixed"), [200, 200, 200]);
});

// ─── X19. Control resistance on bosses ───────────────────────────────────────

const CONTROL = { ranks: ["boss" as const], statuses: ["stun", "silence", "slow"], resist: { at: 2, pct: 50 }, cap: 4, drain: 22 };
const STUN = debuff("stun", { stacking: "fizzle", duration: 8, lockout: { covers: "all", pause: true } });

function controlArena(rank: "boss" | "minion", waits: boolean) {
  const stunIt = { id: "stun_it", cast: 0, recovery: 0, cooldown: 1, ...(waits ? { if: { side: "foes", where: { lacks: "stun" } } } : {}), do: [{ op: "apply", status: "stun" }] };
  const a = arena({ party: [{ name: "Stunner", abilities: ["stun_it"] }], enemies: [{ ...BAG, name: "Boss" }], statuses: [STUN], abilities: [stunIt], ruleset: { control: CONTROL } });
  a.c.enemies.get("e1")!.rank = rank;
  readyAt(a, "Stunner", "stun_it", 1);
  return a;
}
const stuns = (a: ReturnType<typeof arena>) => a.entries("status", (e) => e.status === "stun").map((e) => ((e.end as number) - (e.at as number)) / 1000);

test("X19: five Stuns on a boss in quick succession last 8, 8, 4 and 4 ticks, then IMMUNE; 22 ticks after the last change it's at 3 and the next lasts 4", () => {
  const a = controlArena("boss", true).to(50);
  assert.deepEqual(stuns(a), [8, 8, 4, 4, 4]);
  const immune = a.entries("immune");
  assert.ok(immune.length > 10);
  assert.deepEqual([immune[0].at, immune[0].status, immune[0].why], [25_004, "stun", "control"]);
  assert.deepEqual(a.entries("resisted").map((e) => [e.status, e.end]), [["stun", 21_002], ["stun", 25_003], ["stun", 47_004]]);
  const ctl = a.entries("control").map((e) => [e.at, e.stacks]);
  assert.deepEqual(ctl.map(([, n]) => n), [1, 2, 3, 4, 3, 4]);
  assert.equal(ctl[4][0], (ctl[3][0] as number) + at(22), "the drain comes 22 ticks after the last change");
  assert.ok(a.entries("control").every((e) => e.vis === "hidden"));
  assert.equal(a.unit("Boss").ctrl, 4);
});

test("X19: a Stun that fizzles on a Stunned boss adds nothing; a minion is never resisted", () => {
  const a = controlArena("boss", false).to(12);
  assert.deepEqual(stuns(a), [8, 8]);
  assert.ok(a.entries("act").length >= 10, "the Stunner kept casting into the Stun");
  assert.deepEqual(a.entries("control").map((e) => [e.at, e.stacks]), [[1000, 1], [10_000, 2]]);

  const m = controlArena("minion", true).to(60);
  assert.deepEqual(stuns(m), [8, 8, 8, 8, 8, 8, 8, 8]);
  assert.equal(m.entries("immune").length + m.entries("resisted").length + m.entries("control").length, 0);
  assert.equal(m.unit("Boss").ctrl, undefined);
});

test("X19: a stack drains every 22 ticks once the control stops, back to none", () => {
  const a = controlArena("boss", true).to(1);
  a.unit("Stunner").acts.find((x) => x.id === "stun_it")!.ready = at(10_000);
  a.to(80);
  assert.deepEqual(a.entries("control").map((e) => [e.at, e.stacks]), [[1000, 1], [23_000, 0]]);
  assert.equal(a.f.queue.filter((it) => it.k === "drain").length, 0);
});

// ─── X20. Applications' boosts read the unit receiving ───────────────────────

test("X20: a Chill boost reading the receiver's Chill makes a 4-stack application on a foe holding 8 Chill add 6", () => {
  const chill = debuff("chill", { stacking: "intensity" });
  const primer = buff("primer", { boosts: [{ tag: "chill", pct: { scale: [{ ratio: 6.25, stacks: "chill", of: "target" }] } }] });
  const a = arena({
    party: [{ name: "Frost", abilities: ["c8", "c4"], statuses: ["primer"] }],
    enemies: [BAG], statuses: [chill, primer], abilities: [giver("c8", "chill", { stacks: 8 }), giver("c4", "chill", { stacks: 4 })],
  });
  readyAt(a, "Frost", "c8", 1);
  readyAt(a, "Frost", "c4", 2);
  a.to(1);
  assert.equal(tally(a, "Bag", "chill"), 8, "it held none at the first");
  a.to(2);
  assert.equal(tally(a, "Bag", "chill"), 14);
});

// ─── After the merge with share H (un-skip then) ─────────────────────────────
// Each needs a payload H fills: the breaker and the blocked amount from `take` (X1), a knockout's killer and kind (X29),
// an action's MP paid and hits landed (X29), and the landed set on Ctx (X8's count: hit).

test("after H: a Shield emptied names the foe whose hit emptied it; an Aegis that stops a 900 blow ends with 900 and the attacker", () => {
  const shield = buff("shield", { stacking: "intensity", absorb: true });
  const aegis = buff("aegis", { block: { share: 5 } });
  const ear = buff("ear", {
    reactions: [
      { on: { event: "status_ended", status: "shield", cause: ["stacks"], other: "foe" }, do: [countAmount("other")] },
      { on: { event: "status_ended", status: "aegis", cause: ["spent"], other: "foe" }, do: [countAmount("other")] },
    ],
  });
  const make = (s: string) => {
    const a = arena({
      party: [{ name: "Wall", stats: { max_hp: 10_000 }, abilities: ["raise"], statuses: ["ear"] }],
      enemies: [{ name: "Brute", weapon: { type: "physical", cooldown: 10, amount: s === "shield" ? 300 : 900 } }],
      statuses: [shield, aegis, ear, TALLY], abilities: [now("raise", { target: "self", do: [{ op: "apply", status: s, ...(s === "shield" ? { stacks: 500 } : {}) }] })],
    });
    readyAt(a, "Wall", "raise", 1);
    return a.to(25);
  };
  assert.equal(tally(make("shield"), "Brute"), 500);
  assert.equal(tally(make("aegis"), "Brute"), 900);
});

test("after H: a ko reaction with other: holder fires on the holder's own kills, not an ally's; with kind on the killing hit", () => {
  const trophy = buff("trophy", { reactions: [{ on: { event: "ko", whose: "foe", other: "holder" }, do: [count()] }, { on: { event: "ko", whose: "foe", kind: "ability" }, do: [count("self", "tally2")] }] });
  const kill = now("kill", { target: lowestHp, do: [{ op: "damage", type: "magical", amount: 1000 }] });
  const a = arena({
    party: [{ name: "Hunter", abilities: ["kill"], statuses: ["trophy"] }, { name: "Ally", abilities: ["kill"] }],
    enemies: [{ name: "W1", stats: { max_hp: 10 } }, { name: "W2", stats: { max_hp: 20 } }, BAG],
    statuses: [trophy, TALLY, TALLY2], abilities: [kill],
  });
  readyAt(a, "Ally", "kill", 1);
  readyAt(a, "Hunter", "kill", 2);
  a.to(3);
  assert.ok(a.unit("W1").ko && a.unit("W2").ko);
  assert.equal(tally(a, "Hunter"), 1, "its own kill only");
  assert.equal(tally(a, "Hunter", "tally2"), 2, "both kills were an ability's");
});

test("after H: action_resolve carries the MP paid and the foes hit, for amountAtLeast and countAtLeast", () => {
  const weave = buff("weave", { reactions: [{ on: { event: "action_resolve", amountAtLeast: 1 }, do: [count()] }, { on: { event: "action_resolve", countAtLeast: 3 }, do: [count("self", "tally2")] }] });
  const storm = now("storm", { mp: 400, target: { side: "foes", pick: "all" }, do: [{ op: "damage", type: "magical", amount: 1 }] });
  const poke = now("poke", { do: [{ op: "damage", type: "magical", amount: 1 }] });
  const a = arena({
    party: [{ name: "Mage", stats: { max_mp: 1000 }, abilities: ["storm", "poke"], statuses: ["weave"] }],
    enemies: ["A", "B", "C"].map((name) => ({ ...BAG, name })), statuses: [weave, TALLY, TALLY2], abilities: [storm, poke],
  });
  readyAt(a, "Mage", "storm", 1);
  readyAt(a, "Mage", "poke", 2);
  a.to(3);
  assert.deepEqual([tally(a, "Mage"), tally(a, "Mage", "tally2")], [1, 1]);
});

test("after H: a final mp effect of 120 a foe hit after a four-foe chain gives 480 (count: hit)", () => {
  const chain = now("chain", {
    target: { side: "foes", pick: "random" },
    do: [{ op: "damage", type: "magical", amount: 1 }, { op: "damage", type: "magical", amount: 1, to: { side: "foes", pick: "random", count: 3, exclude: "targets" } }, { op: "mp", amount: { scale: [{ ratio: 120, count: "hit" }] }, to: "self" }],
  });
  const a = arena({
    party: [{ name: "Mage", stats: { max_mp: 5000 }, mp: 0, abilities: ["chain"] }],
    enemies: ["A", "B", "C", "D"].map((name) => ({ ...BAG, name })), abilities: [chain],
  });
  readyAt(a, "Mage", "chain", 1);
  a.to(2);
  assert.deepEqual(a.entries("mp", (e) => e.part === "action").map((e) => e.amount), [480]);
});
