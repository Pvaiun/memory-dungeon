/**
 * The building blocks the loot pass added, for what happens (PRIMITIVES.md), each in a small fight: hits out of turn (second
 * landings, left-overs, strikes of their own size, strikes by another unit), what a swing carries (riders, carried, borrowed,
 * laid on another unit), amounts added to hits, what a hit event carries, HP lines and prices, MP gained, sent on and used as
 * armour, a cap on healing, and statuses diverted, damped, spent, passed and shared.
 */
import { test } from "vitest";
import assert from "node:assert/strict";
import { arena } from "./arena.js";
import type * as S from "../../schema.js";

const at = (ticks: number) => Math.round(ticks * 1000);
const BAG = { name: "Bag", stats: { max_hp: 1_000_000 } };
const buff = (id: string, x: object = {}) => ({ id, name: id.toUpperCase(), label: "buff", show: "icon", stacking: "refresh", ...x });
const debuff = (id: string, x: object = {}) => buff(id, { label: "debuff", ...x });
const tally = (id: string, x: object = {}) => buff(id, { stacking: "intensity", ...x });
const BURN = debuff("burn", { stacking: "intensity" });
const SHIELD = tally("shield", { absorb: true });
type A = ReturnType<typeof arena>;
const stacks = (a: A, unit: string, status: string) => a.has(unit, status).reduce((s, x) => s + x.stacks, 0) / 1000;
const club = (amount: S.NumT = 100, cooldown = 10): S.WeaponT => ({ type: "physical", cooldown, amount });
const amounts = (a: A, target: string) => a.hits(target).map((e) => e.amount);
const device = (id: string, x: object) => ({ id, cast: 0, recovery: 0, cooldown: 1000, ...x });
const readyAt = (a: A, unit: string, ability: string, tick: number) => {
  a.unit(unit).acts.find((x) => x.id === ability)!.ready = at(tick);
};
const onHit = (x: object = {}) => ({ event: "hit_lands", ...x });

// ─── Hits out of turn ───────────────────────────────────────────────────────

test("a second landing is the same damage again, with no Defense: bare, so no rider rides on it, a counter still counts it, and nothing lands it again", () => {
  const twice = buff("twice", { reactions: [{ on: onHit({ notTags: ["bare"] }), do: [{ op: "strike", of: "dealt", to: "other" }] }] });
  const rider = buff("rider", { reactions: [{ on: onHit(), do: [{ op: "apply", status: "burn", to: "other" }, { op: "apply", status: "count", to: "self" }] }] });
  const run = (statuses: string[]) =>
    arena({ party: [{ name: "P", weapon: club(1000), statuses }], enemies: [{ name: "Bag", stats: { max_hp: 1e6, defense: 400 } }], statuses: [twice, { ...twice, id: "twice2" }, rider, BURN, tally("count")] }).to(11);
  const a = run(["twice", "rider"]);
  const [first, second] = amounts(a, "Bag");
  assert.ok((first as number) < 1000 && first === second, "what the first dealt after Defense, again, as it is");
  assert.equal(a.hits("Bag").length, 2);
  assert.equal(stacks(a, "Bag", "burn"), 1, "the rider rides the first hit only");
  assert.equal(stacks(a, "P", "count"), 2, "both are hits");
  assert.equal(run(["twice", "twice2"]).hits("Bag").length, 3, "two cards that each repeat a hit repeat the first once each");
});

test("a second landing can come a tick later, and is lost if its target has fallen", () => {
  const later = buff("later", { reactions: [{ on: onHit({ notTags: ["bare"] }), do: [{ op: "strike", of: "dealt", after: 1, to: "other" }] }] });
  const a = arena({ party: [{ name: "P", weapon: club(100) }], enemies: [BAG], statuses: [later] });
  a.unit("P").start.push("later");
  const b = arena({ party: [{ name: "P", weapon: club(100), statuses: ["later"] }], enemies: [BAG], statuses: [later] }).to(12);
  assert.deepEqual(b.hits("Bag").map((e) => [e.at, e.amount]), [[at(10), 100], [at(11) + 1, 100]]);
});

test("a killing blow's left-over lands on another foe as a bare hit; two cards that share it carry half each; a kill by Thorns is no killing blow", () => {
  const blow = { event: "ko", whose: "foe", other: "holder", tags: ["physical"] };
  const spill = (id: string) => buff(id, { reactions: [{ on: { ...blow, notTags: ["bare"] }, split: "over", do: [{ op: "strike", of: "over", to: { side: "foes", pick: "random" } }] }] });
  const run = (statuses: string[]) =>
    arena({ party: [{ name: "P", weapon: club(100), statuses }], enemies: [{ name: "A", stats: { max_hp: 40, aggro: 100000 } }, { name: "B", stats: { max_hp: 1e6, aggro: 1 } }], statuses: [spill("one"), spill("two")] }).to(11);
  assert.deepEqual(amounts(run(["one"]), "B"), [60], "100 on 40 HP leaves 60");
  assert.deepEqual(amounts(run(["one", "two"]), "B"), [30, 30]);
  // Damage sent back by a reaction fells a foe: its ko carries no hit's tags.
  const thorns = buff("spikes", { reactions: [{ on: { event: "hit_taken" }, do: [{ op: "damage", type: "none", amount: 100, to: "other" }] }] });
  const mark = buff("mark", { reactions: [{ on: blow, do: [{ op: "apply", status: "count", to: "holder" }] }, { on: { event: "ko", whose: "foe", other: "holder" }, do: [{ op: "apply", status: "any", to: "holder" }] }] });
  const c = arena({ party: [{ name: "P", stats: { max_hp: 1e6 }, statuses: ["spikes", "mark"] }], enemies: [{ name: "A", stats: { max_hp: 50 }, weapon: club(1) }], statuses: [thorns, mark, tally("count"), tally("any")], extras: [] }).to(11);
  assert.deepEqual([stacks(c, "P", "any"), stacks(c, "P", "count")], [0, 0], "the fight is over as the last foe falls; with a second foe standing the reactions run");
  const d = arena({ party: [{ name: "P", stats: { max_hp: 1e6 }, statuses: ["spikes", "mark"] }], enemies: [{ name: "A", stats: { max_hp: 50 }, weapon: club(1) }, BAG], statuses: [thorns, mark, tally("count"), tally("any")] }).to(11);
  assert.deepEqual([stacks(d, "P", "any"), stacks(d, "P", "count")], [1, 0], "its kill, but not its killing blow");
});

test("a left-over split among several foes lands a share on each", () => {
  const down = buff("down", { reactions: [{ on: { event: "ko", whose: "foe", other: "holder", tags: ["physical"], notTags: ["bare"] }, do: [{ op: "strike", of: "over", split: true, to: { side: "foes", pick: "all" } }] }] });
  const a = arena({ party: [{ name: "P", weapon: club(100), statuses: ["down"] }], enemies: [{ name: "A", stats: { max_hp: 40, aggro: 100000 } }, { ...BAG, name: "B" }, { ...BAG, name: "C" }], statuses: [down] }).to(11);
  assert.deepEqual([amounts(a, "B"), amounts(a, "C")], [[30], [30]]);
});

test("a strike of its own size is a hit from a reaction, with its own statuses; another unit can be the one that strikes", () => {
  const judge = buff("judge", { reactions: [{ on: onHit({ kind: "basic" }), do: [{ op: "strike", amount: { scale: [{ ratio: 2, stat: "attack", of: "holder" }] }, apply: [{ status: "burn", stacks: 3 }], to: "other" }] }] });
  const a = arena({ party: [{ name: "P", stats: { attack: 50 }, weapon: club(10), statuses: ["judge"] }], enemies: [BAG], statuses: [judge, BURN] }).to(11);
  assert.deepEqual(amounts(a, "Bag"), [10, 100]);
  assert.equal(stacks(a, "Bag", "burn"), 3);
  const second = buff("second", { reactions: [{ on: { event: "hit_evaded" }, do: [{ op: "strike", by: { side: "others", pick: "highest", by: { stats: ["attack"] } }, to: "other" }] }] });
  const b = arena({
    party: [{ name: "Dodger", stats: { evasion: 100, aggro: 100000 }, statuses: ["second"] }, { name: "Friend", weapon: { type: "physical", cooldown: 100000, amount: 70 } }],
    enemies: [{ ...BAG, weapon: club(5) }], statuses: [second], stats: [{ id: "evasion", cap: 100 }],
  }).to(11);
  assert.deepEqual(b.hits("Bag").map((e) => [e.by, e.amount]), [[b.unit("Friend").id, 70]]);
});

test("a weapon strike out of turn takes the shape the unit's basic attacks have, as an extra strike does", () => {
  const slow = buff("slow_swing", { boosts: [{ tag: "basic", pct: 100 }] });
  const riposte = buff("riposte", { reactions: [{ on: { event: "hit_taken" }, do: [{ op: "strike", to: "other" }] }] });
  const a = arena({ party: [{ name: "P", stats: { max_hp: 1e6 }, weapon: { type: "physical", cooldown: 100000, amount: 100 }, statuses: ["slow_swing", "riposte"] }], enemies: [{ ...BAG, weapon: club(1) }], statuses: [slow, riposte] }).to(11);
  assert.deepEqual(amounts(a, "Bag"), [200]);
});

// ─── What a swing carries ───────────────────────────────────────────────────

const RIDER = buff("rider", { reactions: [{ on: onHit({ kind: "basic" }), do: [{ op: "apply", status: "burn", stacks: { scale: [{ ratio: 1, stat: "attack", of: "holder" }] }, to: "other" }, { op: "apply", status: "count", to: "self" }] }] });

test("a bonus strike carries what the swing carries only with carry, and then the riders alone; an extra strike carries them under echo", () => {
  const leap = (carry: boolean) => buff("leap", { strike: { to: { side: "foes", pick: "random", exclude: "targets" }, kind: "bonus", share: 50, ...(carry ? { carry: true } : {}) } });
  const run = (carry: boolean) =>
    arena({
      party: [{ name: "P", stats: { attack: 2 }, weapon: { ...club(100), apply: [{ status: "chill" }] }, statuses: ["leap", "rider"] }],
      enemies: [{ ...BAG, name: "A", stats: { max_hp: 1e6, aggro: 100000 } }, { ...BAG, name: "B", stats: { max_hp: 1e6, aggro: 1 } }], statuses: [leap(carry), RIDER, BURN, debuff("chill"), tally("count")],
    }).to(11);
  const plain = run(false), carried = run(true);
  assert.deepEqual(amounts(carried, "B"), [50]);
  assert.deepEqual([stacks(plain, "B", "burn"), plain.has("B", "chill").length], [0, 0], "a hit with its own name carries nothing");
  assert.deepEqual([stacks(carried, "B", "burn"), carried.has("B", "chill").length], [2, 1], "the rider, and the weapon's attached status");
  assert.equal(stacks(carried, "P", "count"), 1, "only the riders answer a carried hit: the count is the basic attack's");
  const hits = carried.entries("dmg", (e) => e.target === carried.unit("B").id);
  assert.equal(hits[0].part, "extra");
});

test("a wide hit is a bonus hit a basic attack lands on a unit other than its target", () => {
  const leap = buff("leap", { strike: { to: { side: "foes", pick: "random", exclude: "targets" }, kind: "bonus" }, reactions: [{ on: onHit({ tags: ["wide"] }), do: [{ op: "apply", status: "count", to: "holder" }] }] });
  const double = buff("double", { strike: { to: "target" } });
  const a = arena({ party: [{ name: "P", weapon: club(100), statuses: ["leap", "double"] }], enemies: [{ ...BAG, name: "A" }, { ...BAG, name: "B" }], statuses: [leap, double, tally("count")] }).to(11);
  assert.equal(stacks(a, "P", "count"), 1, "the leap, not the extra strike on the same target");
});

test("borrowed riders: a follower's basic attacks carry the lead's, with stacks from the follower's own stats, and never twice from a status both hold from one source", () => {
  const follow = buff("follow", { borrow: { from: { side: "others", pick: "highest", by: { stats: ["attack"] } } } });
  const shared = buff("shared", { perSource: {}, reactions: [{ on: onHit({ kind: "basic" }), do: [{ op: "apply", status: "chill", stacks: 1, to: "other" }] }] });
  const giver = buff("giver", { reactions: [{ on: { event: "fight_start" }, do: [{ op: "apply", status: "shared", to: { side: "allies", pick: "all" } }] }] });
  const a = arena({
    party: [{ name: "Lead", stats: { attack: 9 }, statuses: ["rider", "giver"] }, { name: "Follower", stats: { attack: 3 }, weapon: club(100), statuses: ["follow"] }],
    enemies: [BAG], statuses: [follow, RIDER, shared, giver, BURN, debuff("chill", { stacking: "intensity" }), tally("count")],
  }).to(11);
  assert.equal(stacks(a, "Bag", "burn"), 3, "the lead's rider, read off the follower's Attack");
  assert.equal(stacks(a, "Follower", "count"), 0, "only the riders are borrowed");
  assert.equal(stacks(a, "Bag", "chill"), 1, "a status both hold from one source is added once");
});

test("the riders effect lays what the actor's swing carries on a unit: only the plain ones if asked, and one source once for two units answering one event", () => {
  const crit = buff("oncrit", { reactions: [{ on: onHit({ kind: "basic", tags: ["crit"] }), do: [{ op: "apply", status: "chill", to: "other" }] }] });
  const toll = buff("toll", { reactions: [{ on: { event: "hit_taken", whose: "ally" }, do: [{ op: "riders", plain: true, to: "other" }] }] });
  const storm = buff("storm", { perSource: {}, reactions: [{ on: onHit({ kind: "basic" }), do: [{ op: "apply", status: "shock", stacks: 2, to: "other" }] }] });
  const caster = buff("caster", { reactions: [{ on: { event: "fight_start" }, do: [{ op: "apply", status: "storm", to: { side: "others", pick: "all" } }] }] });
  const a = arena({
    party: [
      { name: "Gate", stats: { max_hp: 1e6, aggro: 100000 }, statuses: ["caster"] },
      { name: "One", stats: { attack: 4 }, statuses: ["toll", "rider", "oncrit"] },
      { name: "Two", stats: { attack: 1 }, statuses: ["toll"] },
    ],
    enemies: [{ ...BAG, weapon: club(1, 100) }],
    statuses: [crit, toll, storm, caster, RIDER, BURN, debuff("chill"), debuff("shock", { stacking: "intensity" }), tally("count")],
  });
  a.unit("Bag").acts.find((x) => x.id === "basic")!.ready = at(5);
  a.to(6);
  assert.equal(stacks(a, "Bag", "burn"), 4, "One's plain rider, in the stacks one of its swings adds");
  assert.equal(a.has("Bag", "chill").length, 0, "a rider that waits for a crit doesn't pass");
  assert.equal(stacks(a, "Bag", "shock"), 2, "both hold the storm from one source: it's laid once");
  assert.equal(stacks(a, "One", "count"), 0);
});

// ─── Amounts added to hits, and what a hit carries ──────────────────────────

test("adds: an amount on top of a hit's own before boosts, by tag; an Intensity status adds it for each stack, and a hit can read what its action paid", () => {
  const sixth = buff("sixth", { adds: [{ on: "ability", amount: { scale: [{ ratio: 0.5, stat: "defense", of: "holder" }] } }], boosts: [{ tag: "physical", pct: 100 }] });
  const brim = buff("brim", { adds: [{ on: "ability", amount: { scale: [{ ratio: 1, cost: "mp" }] } }] });
  const blessed = tally("blessed", { adds: [{ on: "physical", amount: 1 }], trigger: { on: onHit() }, drop: "all" });
  const bolt = device("bolt", { mp: 30, do: [{ op: "damage", type: "physical", amount: 100 }] });
  const run = (statuses: string[]) => {
    const a = arena({ party: [{ name: "P", stats: { defense: 40, max_mp: 100 }, weapon: club(10), abilities: ["bolt"], statuses }], enemies: [BAG], statuses: [sixth, brim, blessed], abilities: [bolt] });
    readyAt(a, "P", "bolt", 5);
    return a;
  };
  assert.deepEqual(amounts(run(["sixth"]).to(11), "Bag"), [240, 20], "(100 + 20) doubled on the ability; the swing takes the boost alone");
  assert.deepEqual(amounts(run(["brim"]).to(6), "Bag"), [130]);
  const b = run([]);
  b.to(1);
  b.unit("P").statuses.push({ uid: 9999, id: "blessed", src: null, at: 0, end: -1, stacks: 55_000, nums: b.c.statuses.get("blessed")!.adds!.map(() => 1) });
  assert.deepEqual(amounts(b.to(11), "Bag"), [155, 10], "one hit takes it all");
});

test("a reaction to a hit can read its raw amount before Defense, and what a Shield soaked of it", () => {
  const mirror = buff("mirror", { reactions: [{ on: { event: "hit_taken" }, do: [{ op: "damage", type: "none", amount: { scale: [{ ratio: 0.5, event: "raw" }] }, to: "other" }] }] });
  const hoplon = buff("hoplon", { reactions: [{ on: { event: "hit_taken" }, do: [{ op: "damage", type: "none", amount: { scale: [{ ratio: 1, event: "stopped" }] }, to: "other" }] }] });
  const shell = buff("shell", { reactions: [{ on: { event: "fight_start" }, do: [{ op: "apply", status: "shield", stacks: 30, to: "holder" }] }] });
  const run = (statuses: string[]) => arena({ party: [{ name: "P", stats: { max_hp: 1e6, defense: 400 }, statuses }], enemies: [{ ...BAG, weapon: club(1000) }], statuses: [mirror, hoplon, shell, SHIELD] }).to(11);
  assert.deepEqual(amounts(run(["mirror"]), "Bag"), [500], "half the blow as it was struck");
  assert.deepEqual(amounts(run(["hoplon", "shell"]), "Bag"), [30], "what the Shield soaked");
});

test("hit events know the HP their target had before the hit, a ko knows the ability behind it, and action events what the action does and paid", () => {
  const hunter = buff("hunter", {
    reactions: [
      { on: onHit({ wasBelow: 50 }), do: [{ op: "apply", status: "low", to: "holder" }] },
      { on: { event: "ko", whose: "foe", ability: ["stab"] }, do: [{ op: "apply", status: "stabbed", to: "holder" }] },
      { on: { event: "action_resolve", does: ["damage"], paid: true }, do: [{ op: "apply", status: "paid", to: "holder" }] },
    ],
  });
  const stab = device("stab__p", { mp: 5, do: [{ op: "damage", type: "physical", amount: 60 }] });
  const a = arena({ party: [{ name: "P", stats: { max_mp: 100 }, weapon: club(60), abilities: ["stab__p"], statuses: ["hunter"] }], enemies: [{ name: "A", stats: { max_hp: 100 } }, BAG], statuses: [hunter, tally("low"), tally("stabbed"), tally("paid")], abilities: [stab] });
  readyAt(a, "P", "stab__p", 12);
  a.to(13);
  assert.equal(stacks(a, "P", "low"), 1, "the first hit landed on a full foe, the second on one under half");
  assert.equal(stacks(a, "P", "stabbed"), 1, "a form is its ability");
  assert.equal(stacks(a, "P", "paid"), 1, "the basic attack paid nothing");
});

// ─── HP lines and prices ────────────────────────────────────────────────────

test("an HP line fires as the unit goes under it, whatever took it there, and again only after it's been back over; a unit that starts under it has crossed it", () => {
  const watch = buff("watch", { reactions: [{ on: { event: "hp_low", line: 50 }, do: [{ op: "apply", status: "low", to: "holder" }] }, { on: { event: "hp_high", line: 50 }, do: [{ op: "apply", status: "high", to: "holder" }] }] });
  const price = device("price", { target: "self", do: [{ op: "pay", hp: 30, to: "self" }] });
  const mend = device("mend", { target: "self", do: [{ op: "heal", amount: 60 }] });
  const a = arena({ party: [{ name: "P", stats: { max_hp: 100 }, abilities: ["price", "mend"], statuses: ["watch"] }], enemies: [BAG], statuses: [watch, tally("low"), tally("high")], abilities: [price, mend] });
  a.to(1);
  assert.deepEqual([stacks(a, "P", "low"), stacks(a, "P", "high")], [0, 1], "it starts over the line");
  const pay = (t: number) => { readyAt(a, "P", "price", t); a.to(t + 0.5); };
  pay(2);
  assert.equal(stacks(a, "P", "low"), 0, "70 of 100");
  pay(3);
  assert.equal(stacks(a, "P", "low"), 1, "a price takes it under");
  pay(4);
  assert.equal(stacks(a, "P", "low"), 1, "still under: no second crossing");
  readyAt(a, "P", "mend", 5);
  a.to(5.5);
  assert.equal(stacks(a, "P", "high"), 2);
  pay(6); pay(7);
  assert.equal(stacks(a, "P", "low"), 2, "back over, then under again");
  const b = arena({ party: [{ name: "P", stats: { max_hp: 100 }, hp: 20, statuses: ["watch"] }], enemies: [BAG], statuses: [watch, tally("low"), tally("high")] }).to(1);
  assert.deepEqual([stacks(b, "P", "low"), stacks(b, "P", "high")], [1, 0]);
});

test("a price fires hp_paid with what was paid; a drain doesn't", () => {
  const heard = buff("heard", { reactions: [{ on: { event: "hp_paid", whose: "team" }, do: [{ op: "apply", status: "paid", stacks: { scale: [{ ratio: 1, amount: true }] }, to: "holder" }] }] });
  const bleeder = buff("bleeder", { pulse: { every: 1, do: [{ op: "pay", hp: 5, drain: true, to: "holder" }] } });
  const price = device("price", { target: "self", do: [{ op: "pay", hp: 30, to: "self" }] });
  const a = arena({ party: [{ name: "P", stats: { max_hp: 100 }, abilities: ["price"], statuses: ["heard", "bleeder"] }], enemies: [BAG], statuses: [heard, bleeder, tally("paid")], abilities: [price] });
  readyAt(a, "P", "price", 3);
  a.to(4);
  assert.equal(stacks(a, "P", "paid"), 30);
  assert.ok(a.unit("P").hp < 70, "the drain took HP too");
});

// ─── MP ─────────────────────────────────────────────────────────────────────

test("MP gained past the pool fires mp_over, and what answers it is never sent on again; a divert sends every gain to another unit, once", () => {
  const leech = buff("leech", { reactions: [{ on: { event: "mp_over" }, do: [{ op: "mp", amount: { scale: [{ ratio: 1, amount: true }] }, to: { side: "others", pick: "lowest", by: "mp_share" } }] }] });
  const gift = device("gift", { target: "self", do: [{ op: "mp", amount: 50 }] });
  const a = arena({ party: [{ name: "Full", stats: { max_mp: 100 }, abilities: ["gift"], statuses: ["leech"] }, { name: "Other", stats: { max_mp: 100 }, mp: 80, statuses: ["leech"] }], enemies: [BAG], statuses: [leech], abilities: [gift] });
  readyAt(a, "Full", "gift", 2);
  a.to(3);
  assert.equal(a.unit("Other").mp, 100, "50 past full goes on, and its own 30 past full goes nowhere");
  const voice = buff("voice", { divert: { what: "mp", to: { side: "others", pick: "all" } } });
  const b = arena({ party: [{ name: "Voice", stats: { max_mp: 100 }, mp: 10, abilities: ["gift"], statuses: ["voice"] }, { name: "Soloist", stats: { max_mp: 100 }, mp: 10, statuses: ["voice"] }], enemies: [BAG], statuses: [voice], abilities: [gift] });
  readyAt(b, "Voice", "gift", 2);
  b.to(3);
  assert.deepEqual([b.unit("Voice").mp, b.unit("Soloist").mp], [10, 60], "sent on once, not back again");
});

test("mp_gained names the giver; soak: mp takes damage out of MP before HP, after a Shield", () => {
  const glimmer = buff("glimmer", { reactions: [{ on: { event: "mp_gained", other: "ally" }, do: [{ op: "apply", status: "count", to: "holder" }] }] });
  const gift = device("gift", { target: { side: "allies", pick: "all" }, do: [{ op: "mp", amount: 5 }] });
  const a = arena({ party: [{ name: "Giver", stats: { max_mp: 100 }, mp: 0, abilities: ["gift"], statuses: ["glimmer"] }, { name: "Robe", stats: { max_mp: 100 }, mp: 0, statuses: ["glimmer"] }], enemies: [BAG], statuses: [glimmer, tally("count")], abilities: [gift] });
  readyAt(a, "Giver", "gift", 2);
  a.to(3);
  assert.deepEqual([stacks(a, "Giver", "count"), stacks(a, "Robe", "count")], [0, 1], "its own gain isn't an ally's gift");
  const deep = buff("deep", { soak: "mp", reactions: [{ on: { event: "fight_start" }, do: [{ op: "apply", status: "shield", stacks: 20, to: "holder" }] }] });
  const b = arena({ party: [{ name: "P", stats: { max_hp: 1000, max_mp: 100 }, statuses: ["deep"] }], enemies: [{ ...BAG, weapon: club(150) }], statuses: [deep, SHIELD] }).to(11);
  assert.deepEqual([b.unit("P").mp, b.unit("P").hp], [0, 970], "20 to the Shield, 100 to MP, 30 to HP");
});

// ─── Healing ────────────────────────────────────────────────────────────────

test("a cap on healing: what the unit has above it is lost as the status lands, healing past it is healing past full, and at the cap the unit reads as under it", () => {
  const halved = buff("halved", { healCap: 50, reactions: [{ on: { event: "overhealed" }, do: [{ op: "apply", status: "over", stacks: { scale: [{ ratio: 1, amount: true }] }, to: "holder" }] }], boosts: [{ tag: "physical", pct: { scale: [{ ratio: 100, when: { hpBelow: 50 }, of: "holder" }] } }] });
  const mend = device("mend", { target: { side: "allies", where: { canHeal: true }, pick: "lowest", by: "hp_share" }, do: [{ op: "heal", amount: 30 }] });
  const a = arena({ party: [{ name: "P", stats: { max_hp: 100 }, weapon: club(10), abilities: ["mend"], statuses: ["halved"] }, { name: "Q", stats: { max_hp: 100 }, hp: 90 }], enemies: [BAG], statuses: [halved, tally("over")], abilities: [mend] });
  a.to(1);
  assert.equal(a.unit("P").hp, 50);
  readyAt(a, "P", "mend", 2);
  a.to(3);
  assert.equal(a.unit("Q").hp, 100, "the one at its cap can't be healed, so the heal passes it by");
  a.unit("P").hp = 40;
  readyAt(a, "P", "mend", 4);
  a.to(5);
  assert.deepEqual([a.unit("P").hp, stacks(a, "P", "over")], [50, 20]);
  assert.deepEqual(amounts(a.to(11), "Bag"), [20], "at half it counts as below half");
});

test("a heal's events say what healed: a pulse is tagged, a status's reaction names its status, and a final heal's overheal goes nowhere", () => {
  const regen = buff("regen", { pulse: { every: 2, do: [{ op: "heal", amount: 10 }] } });
  const drink = buff("drink", { reactions: [{ on: onHit(), do: [{ op: "heal", amount: 10, to: "self" }] }] });
  const last = buff("last", { reactions: [{ on: onHit(), do: [{ op: "heal", amount: 10, final: true, to: "self" }] }] });
  const ear = buff("ear", {
    reactions: [
      { on: { event: "overhealed", tags: ["pulse"] }, do: [{ op: "apply", status: "pulses", to: "holder" }] },
      { on: { event: "overhealed", status: "drink" }, do: [{ op: "apply", status: "drinks", to: "holder" }] },
      { on: { event: "overhealed", notTags: ["pulse"] }, do: [{ op: "apply", status: "others", to: "holder" }] },
    ],
  });
  const a = arena({ party: [{ name: "P", stats: { max_hp: 100 }, weapon: club(1), statuses: ["regen", "drink", "last", "ear"] }], enemies: [BAG], statuses: [regen, drink, last, ear, tally("pulses"), tally("drinks"), tally("others")] }).to(11);
  assert.deepEqual([stacks(a, "P", "pulses"), stacks(a, "P", "drinks"), stacks(a, "P", "others")], [5, 1, 1]);
});

// ─── Statuses diverted, damped, spent, passed and shared ────────────────────

test("a divert on a status: every Shield another ally would gain goes to one holder, under its own cap, and isn't sent on again", () => {
  const pull = buff("pull", { perSource: { endsWithSource: true }, divert: { what: "shield", to: "source" } });
  const lode = buff("lode", { reactions: [{ on: { event: "fight_start" }, do: [{ op: "apply", status: "pull", to: { side: "others", pick: "all" } }] }] });
  const shell = device("shell", { target: "self", do: [{ op: "apply", status: "shield", stacks: 40 }] });
  const a = arena({ party: [{ name: "Holder", statuses: ["lode"] }, { name: "Mage", abilities: ["shell"] }], enemies: [BAG], statuses: [pull, lode, SHIELD], abilities: [shell] });
  readyAt(a, "Mage", "shell", 2);
  a.to(3);
  assert.deepEqual([stacks(a, "Holder", "shield"), stacks(a, "Mage", "shield")], [40, 0]);
});

test("damp: stacks passed on to a unit that has capped lately are halved for each time it has, in fractions; plain applications aren't touched", () => {
  const chill = debuff("chill", { stacking: "intensity", cap: 10, damp: { pct: 50, window: 10 }, reactions: [{ on: { event: "status_capped", status: "chill" }, do: [{ op: "remove", label: "debuff", status: "chill", to: "holder" }] }] });
  const lay = (id: string, passed: boolean, stacks: number) => device(id, { target: { side: "foes", where: { has: "target" } }, do: [{ op: "apply", status: "chill", stacks, ...(passed ? { passed: true } : {}) }] });
  const a = arena({ party: [{ name: "P", abilities: ["fill", "pass", "plain"] }], enemies: [{ ...BAG, name: "A", statuses: ["target"] }], statuses: [chill, buff("target", { label: "marker" })], abilities: [lay("fill", false, 10), lay("pass", true, 3), lay("plain", false, 3)] });
  const cast = (id: string, t: number) => { readyAt(a, "P", id, t); a.to(t + 0.5); };
  cast("fill", 1);
  assert.equal(stacks(a, "A", "chill"), 0, "it shattered");
  cast("pass", 2);
  assert.equal(stacks(a, "A", "chill"), 1.5, "it has capped once: half");
  cast("plain", 3);
  assert.equal(stacks(a, "A", "chill"), 4.5);
  cast("fill", 4);
  cast("pass", 5);
  assert.equal(stacks(a, "A", "chill"), 0, "twice: a quarter of three is under one stack, and no status starts under one");
  cast("plain", 6);
  cast("pass", 7);
  assert.equal(stacks(a, "A", "chill"), 3.75, "a fraction on top of what it holds");
  cast("pass", 30);
  assert.equal(stacks(a, "A", "chill"), 6.75, "the chain is over: nothing is cut");
});

test("spend takes whole stacks, pass hands the actor's debuffs on as fresh ones, share copies a status laid at a moment (and never a copy)", () => {
  const heat = tally("heat", { cap: 10 });
  const tools = buff("tools", {
    reactions: [
      { on: { event: "hit_taken" }, do: [{ op: "spend", status: "heat", share: 50, to: "holder" }] },
      { on: onHit(), do: [{ op: "pass", label: "debuff", except: ["doom"], to: "other" }] },
      { on: { event: "status_gained", other: "holder", repeat: false }, do: [{ op: "share", to: { side: "others", pick: "all" } }] },
    ],
  });
  const self = device("self", { target: "self", do: [{ op: "apply", status: "heat", stacks: 5 }, { op: "apply", status: "haste" }, { op: "apply", status: "state" }] });
  const a = arena({
    party: [{ name: "P", stats: { max_hp: 1e6 }, weapon: club(1, 7), abilities: ["self"], statuses: ["tools"] }, { name: "Twin", statuses: ["tools"] }],
    enemies: [{ ...BAG, weapon: club(1, 100) }], statuses: [heat, tools, buff("haste", { duration: 20 }), buff("state", { stacking: "fizzle" }), BURN, debuff("doom")], abilities: [self],
  });
  readyAt(a, "P", "self", 1);
  a.to(2);
  assert.deepEqual([stacks(a, "Twin", "heat"), a.has("Twin", "haste").length, a.has("Twin", "state").length], [5, 1, 0], "a counter and a timed buff are shared; a state isn't");
  assert.equal(stacks(a, "P", "heat"), 5, "the twin's copy isn't shared back");
  a.unit("Bag").acts.find((x) => x.id === "basic")!.ready = at(3);
  a.unit("Bag").stats.aggro = 1;
  a.unit("P").stats.aggro = 100000;
  a.to(4);
  assert.equal(stacks(a, "P", "heat"), 3, "half of five, rounded down, spent");
  a.unit("P").statuses.push({ uid: 9001, id: "burn", src: null, at: 0, end: -1, stacks: 4000, nums: [] }, { uid: 9002, id: "doom", src: null, at: 0, end: -1, stacks: 0, nums: [] });
  a.to(8);
  assert.deepEqual([stacks(a, "Bag", "burn"), stacks(a, "P", "burn"), a.has("P", "doom").length], [4, 0, 1]);
});

test("status_capped says how many stacks, a status applied to several units is tagged area, and an application passed on in answer to a passed one is passed too", () => {
  const chill = debuff("chill", { stacking: "intensity", cap: 4 });
  const heart = buff("heart", {
    reactions: [
      { on: { event: "status_gained", whose: "foe", status: "chill", other: "holder", notTags: ["area"], repeat: false }, do: [{ op: "apply", status: "chill", stacks: { scale: [{ ratio: 1, amount: true }] }, copy: true, to: { side: "foes", pick: "all", exclude: "owner" } }] },
      { on: { event: "status_capped", whose: "foe", status: "chill" }, do: [{ op: "apply", status: "seen", stacks: { scale: [{ ratio: 1, amount: true }] }, to: "holder" }] },
    ],
  });
  const one = device("one", { target: { side: "foes", where: { has: "target" } }, do: [{ op: "apply", status: "chill", stacks: 2 }] });
  const all = device("all", { target: { side: "foes", pick: "all" }, do: [{ op: "apply", status: "chill", stacks: 1 }] });
  const a = arena({ party: [{ name: "P", abilities: ["one", "all"], statuses: ["heart"] }], enemies: [{ ...BAG, name: "A", statuses: ["target"] }, { ...BAG, name: "B" }, { ...BAG, name: "C" }], statuses: [chill, heart, tally("seen"), buff("target", { label: "marker" })], abilities: [one, all] });
  readyAt(a, "P", "one", 1);
  a.to(2);
  assert.deepEqual([stacks(a, "A", "chill"), stacks(a, "B", "chill"), stacks(a, "C", "chill")], [2, 2, 2], "copied to every other foe, and the copies aren't copied");
  readyAt(a, "P", "all", 3);
  a.to(4);
  assert.deepEqual([stacks(a, "A", "chill"), stacks(a, "B", "chill")], [3, 3], "what already lands on every foe is unchanged");
  readyAt(a, "P", "one", 5);
  a.to(6);
  assert.equal(stacks(a, "P", "seen"), 12, "three foes capped at four");
});
