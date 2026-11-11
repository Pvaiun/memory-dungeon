/**
 * The building blocks the loot pass added, for who and when (PRIMITIVES.md), each in a small fight: a rule a side holds
 * once, counters that take one stack an event, ability changes (damage, cooldown, wind-up, prices, counts of stacks and of
 * casts, HP in place of MP, paid by another), crits set and capped, cooldown picks, casts made again and paid for, one of
 * several statuses, the opening made to happen again, knockouts that aren't damage, someone staying in sight, stats swapped,
 * a basic attack that never waits, a random order, and the tests and targets that read a side.
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
type A = ReturnType<typeof arena>;
const stacks = (a: A, unit: string, status: string) => a.has(unit, status).reduce((s, x) => s + x.stacks, 0) / 1000;
const club = (amount: S.NumT = 100, cooldown = 10): S.WeaponT => ({ type: "physical", cooldown, amount });
const amounts = (a: A, target: string) => a.hits(target).map((e) => e.amount);
const device = (id: string, x: object) => ({ id, cast: 0, recovery: 0, cooldown: 1000, ...x });
const readyAt = (a: A, unit: string, ability: string, tick: number) => {
  a.unit(unit).acts.find((x) => x.id === ability)!.ready = at(tick);
};
const left = (a: A, unit: string, ability: string) => (a.unit(unit).acts.find((x) => x.id === ability)!.ready - a.f.now) / 1000;
const bolt = (id: string, x: object = {}) => device(id, { do: [{ op: "damage", type: "physical", amount: 100 }], ...x });
const NEVER = { side: "foes", where: { ko: true } };

// ─── Rules a side holds once, and counters ──────────────────────────────────

test("a party rule answers once for its side, and passes to the next holder when the first falls", () => {
  const rule = buff("rule", { party: true, survivesKO: false, reactions: [{ on: { event: "hit_lands", whose: "team" }, do: [{ op: "apply", status: "count", to: "holder" }] }] });
  const a = arena({
    party: [{ name: "One", stats: { max_hp: 5 }, statuses: ["rule"] }, { name: "Two", stats: { max_hp: 1e6 }, weapon: club(10, 4), statuses: ["rule"] }, { name: "Three", stats: { max_hp: 1e6 }, statuses: ["rule"] }],
    enemies: [{ ...BAG, weapon: club(10, 100) }], statuses: [rule, tally("count")],
  });
  a.to(5);
  assert.deepEqual([stacks(a, "One", "count"), stacks(a, "Two", "count"), stacks(a, "Three", "count")], [1, 0, 0]);
  a.unit("One").stats.aggro = 100000;
  a.unit("Bag").acts.find((x) => x.id === "basic")!.ready = at(6);
  a.to(9);
  assert.ok(a.unit("One").ko);
  assert.deepEqual([stacks(a, "Two", "count"), stacks(a, "Three", "count")], [1, 0], "the next in slot order speaks for the side");
});

test("a counter marked oncePerEvent takes one stack from one event, however many of its holder's reactions count it", () => {
  const cuts = tally("cuts", { oncePerEvent: true });
  const counter = (id: string) => buff(id, { reactions: [{ on: { event: "hit_lands" }, do: [{ op: "apply", status: "cuts", to: "holder" }] }] });
  const a = arena({ party: [{ name: "P", weapon: club(1, 4), statuses: ["knife", "mail"] }], enemies: [BAG], statuses: [cuts, counter("knife"), counter("mail")] }).to(9);
  assert.equal(a.hits("Bag").length, 2);
  assert.equal(stacks(a, "P", "cuts"), 2);
});

test("a live stat that reads a counter's stacks follows it as it climbs and as it's spent", () => {
  const spite = tally("spite");
  const totem = buff("totem", { stats: [{ stat: "defense", flat: { scale: [{ ratio: 10, stacks: "spite", of: "holder" }] }, live: true }], reactions: [{ on: { event: "hit_taken" }, do: [{ op: "apply", status: "spite", to: "holder" }] }] });
  const a = arena({ party: [{ name: "P", stats: { max_hp: 1e6, defense: 0 }, statuses: ["totem"] }], enemies: [{ ...BAG, weapon: club(1, 3) }], statuses: [spite, totem] }).to(10);
  assert.equal(a.unit("P").stats.defense, 30);
});

// ─── Ability changes ────────────────────────────────────────────────────────

test("an ability change can add damage, stretch a wind-up and a cooldown, and reach only the abilities that deal damage, aim at one foe, or sit first", () => {
  const mono = buff("mono", { mods: [{ of: { does: ["damage"] }, cooldown: 100, damage: 150 }] });
  const ritual = buff("ritual", { mods: [{ wind: 50 }] });
  const first = buff("first", { mods: [{ of: { first: true }, cooldown: -100 }] });
  const single = buff("single", { mods: [{ of: { single: true }, damage: 100 }] });
  const hit = { id: "hit", cast: 4, recovery: 2, cooldown: 20, do: [{ op: "damage", type: "physical", amount: 100 }] };
  const wide = { id: "wide", cast: 0, recovery: 2, cooldown: 20, target: { side: "foes", pick: "all" }, do: [{ op: "damage", type: "physical", amount: 100 }] };
  const ward = { id: "ward", cast: 0, recovery: 2, cooldown: 20, target: "self", do: [{ op: "heal", amount: 1 }] };
  const run = (abilities: string[], statuses: string[], to = 60) => arena({ party: [{ name: "P", abilities, statuses }], enemies: [BAG], statuses: [mono, ritual, first, single], abilities: [hit, wide, ward], ruleset: { opening: undefined } }).to(to);
  const a = run(["hit", "ward"], ["mono"]);
  assert.deepEqual(amounts(a, "Bag").slice(0, 1), [250]);
  assert.deepEqual([a.acts("P", "hit"), a.acts("P", "ward").slice(0, 2)], [[44], [20, 46]], "twice the cooldown for the one that deals damage; the other untouched, and cast again once the first one's wind-up and recovery are done");
  assert.deepEqual(run(["hit"], ["ritual"]).acts("P", "hit").slice(0, 1), [26], "a wind-up of four, half again as long");
  assert.deepEqual(run(["ward", "hit"], ["first"], 9).acts("P", "ward"), [0.001, 2.001, 4.001, 6.001, 8.001], "no cooldown: again whenever its recovery lets it");
  assert.deepEqual([amounts(run(["hit"], ["single"]), "Bag")[0], amounts(run(["wide"], ["single"]), "Bag")[0]], [200, 100]);
});

test("a change that counts a status's stacks, or the ability's own casts, multiplies its percentages; the count of casts shows as a status", () => {
  const glacier = buff("glacier", { mods: [{ damage: 20, times: { stacks: "cascade" } }] });
  const charm = buff("charm", { mods: [{ damage: 20, mp: 40, times: { casts: true, cap: 2, show: "crescendo" } }] });
  const zap = { id: "zap", mp: 10, cast: 0, recovery: 0, cooldown: 5, do: [{ op: "damage", type: "physical", amount: 100 }] };
  const a = arena({ party: [{ name: "P", stats: { max_mp: 1000 }, abilities: ["zap"], statuses: ["glacier"] }], enemies: [BAG], statuses: [glacier, charm, tally("cascade"), tally("crescendo")], abilities: [zap], ruleset: { opening: undefined } });
  a.unit("P").statuses.push({ uid: 9000, id: "cascade", src: null, at: 0, end: -1, stacks: 3000, nums: [] });
  assert.deepEqual(amounts(a.to(6), "Bag"), [160]);
  const b = arena({ party: [{ name: "P", stats: { max_mp: 1000 }, abilities: ["zap"], statuses: ["charm"] }], enemies: [BAG], statuses: [glacier, charm, tally("cascade"), tally("crescendo")], abilities: [zap], ruleset: { opening: undefined } }).to(21);
  assert.deepEqual(amounts(b, "Bag"), [100, 120, 140, 140], "plain, then a fifth more a cast, to its cap");
  assert.equal(b.unit("P").mp, 1000 - 10 - 14 - 18 - 18, "and two fifths more cost each");
  assert.equal(stacks(b, "P", "crescendo"), 2);
});

test("HP in place of MP: half the share of max HP that the cost is of max MP; a free cast costs no HP; the ability waits rather than go under its floor", () => {
  const robe = buff("robe", { mods: [{ hp: { pct: 50, share: true, floor: 10, instead: true } }] });
  const free = buff("free", { mods: [{ mp: -100 }] });
  const zap = { id: "zap", mp: 200, cast: 0, recovery: 0, cooldown: 5, do: [{ op: "damage", type: "physical", amount: 1 }] };
  const run = (statuses: string[], hp?: number) => arena({ party: [{ name: "P", stats: { max_hp: 3000, max_mp: 1000 }, hp, abilities: ["zap"], statuses }], enemies: [BAG], statuses: [robe, free], abilities: [zap], ruleset: { opening: undefined } }).to(6);
  const a = run(["robe"]);
  assert.deepEqual([a.unit("P").mp, a.unit("P").hp], [1000, 2700], "a fifth of its MP is a tenth of its HP");
  assert.equal(run(["robe", "free"]).unit("P").hp, 3000);
  assert.equal(run(["robe"], 500).acts("P", "zap").length, 0, "300 from 500 would leave it under a tenth");
});

test("a price another unit pays: the caster needs no MP while the payer stands above its floor, and pays its own when the payer can't", () => {
  const aura = buff("aura", { perSource: { endsWithSource: true }, mods: [{ hp: { pct: 50, share: true, floor: 10, instead: true, payer: "source" } }] });
  const chalice = buff("chalice", { reactions: [{ on: { event: "fight_start" }, do: [{ op: "apply", status: "aura", to: { side: "others", pick: "all" } }] }, { on: { event: "hp_paid" }, do: [{ op: "apply", status: "paid", stacks: { scale: [{ ratio: 1, amount: true }] }, to: "holder" }] }] });
  const zap = { id: "zap", mp: 200, cast: 0, recovery: 0, cooldown: 5, do: [{ op: "damage", type: "physical", amount: 1 }] };
  const run = (vampHp: number, mageMp: number) =>
    arena({ party: [{ name: "Vamp", stats: { max_hp: 4000 }, hp: vampHp, statuses: ["chalice"] }, { name: "Mage", stats: { max_mp: 1000 }, mp: mageMp, abilities: ["zap"] }], enemies: [BAG], statuses: [aura, chalice, tally("paid")], abilities: [zap], ruleset: { opening: undefined } }).to(6);
  const a = run(4000, 0);
  assert.deepEqual([a.acts("Mage", "zap").length, a.unit("Vamp").hp, a.unit("Mage").mp, stacks(a, "Vamp", "paid")], [1, 3600, 0, 400], "a fifth of the Mage's MP is a tenth of the Vampire's HP: it pays 400 and the Mage, at no mana, still casts");
  const b = run(700, 1000);
  assert.deepEqual([b.unit("Vamp").hp, b.unit("Mage").mp], [700, 800], "400 from 700 would leave it at a tenth or less: the Mage pays its own");
  assert.equal(run(700, 0).acts("Mage", "zap").length, 0);
});

test("a price on the basic attack is paid as it swings, and the swing can read what it paid", () => {
  const letter = buff("letter", { mods: [{ of: { basic: true }, pay: { scale: [{ ratio: 0.1, stat: "max_hp" }] } }] });
  const a = arena({ party: [{ name: "P", stats: { max_hp: 1000 }, weapon: club({ base: 50, scale: [{ ratio: 4, cost: "hp" }] }), statuses: ["letter"] }], enemies: [BAG], statuses: [letter] }).to(11);
  assert.deepEqual([amounts(a, "Bag"), a.unit("P").hp], [[450], 900]);
  const b = arena({ party: [{ name: "P", stats: { max_hp: 1000 }, hp: 1, weapon: club({ base: 50, scale: [{ ratio: 4, cost: "hp" }] }), statuses: ["letter"] }], enemies: [BAG], statuses: [letter] }).to(11);
  assert.deepEqual(amounts(b, "Bag"), [50], "a swing that can pay nothing adds nothing");
});

// ─── Crits ──────────────────────────────────────────────────────────────────

test("a crit rule can set the chance on a condition, or lift it under a cap", () => {
  const set = buff("set", { crits: [{ when: { has: "stun" }, set: 100 }] });
  const none = buff("none", { crits: [{ set: 0 }] });
  const capped = buff("capped", { crits: [{ times: 2, cap: 80 }, { chance: 50, cap: 80 }] });
  const crits = (statuses: string[], foe: string[] = [], chance = 0) => {
    const a = arena({ party: [{ name: "P", stats: { crit_chance: chance }, weapon: club(100, 1), statuses }], enemies: [{ ...BAG, statuses: foe }], statuses: [set, none, capped, debuff("stun")] }).to(200);
    return a.hits("Bag").filter((e) => e.crit).length / a.hits("Bag").length;
  };
  assert.equal(crits(["set"], ["stun"]), 1);
  assert.equal(crits(["set"]), 0);
  assert.equal(crits(["none"], [], 100), 0, "a set chance has the last word");
  const half = crits(["capped"], [], 30);
  assert.ok(half > 0.7 && half < 0.9, `30 doubled to 60, then up to 80, not past it (${half})`);
  assert.equal(crits(["capped"], [], 100), 1, "a chance already higher stays as it is");
});

// ─── Cooldowns and casts made again ─────────────────────────────────────────

test("cooldown picks: the first-slotted ability, the slowest by whole cooldown, a percent of the full cooldown for each foe hit, and never itself by soonest", () => {
  const x = { id: "x", cooldown: 40, if: NEVER, do: [{ op: "damage", type: "physical", amount: 1 }] };
  const y = { id: "y", cooldown: 60, if: NEVER, do: [{ op: "damage", type: "physical", amount: 1 }] };
  const cast = (set: object) => device("go", { target: "self", do: [{ op: "cooldown", ...set, to: { side: "others" } }] });
  const run = (set: object) => {
    const a = arena({ party: [{ name: "T", abilities: ["x", "y"] }, { name: "C", abilities: ["go"] }], enemies: [BAG], abilities: [x, y, cast(set)] });
    readyAt(a, "T", "x", 30); readyAt(a, "T", "y", 20); readyAt(a, "C", "go", 10);
    a.to(10);
    return [left(a, "T", "x"), left(a, "T", "y")];
  };
  assert.deepEqual(run({ which: "first", set: "ready" }), [0, 10]);
  assert.deepEqual(run({ which: "slowest", set: "ready" }), [20, 0], "y has the longer whole cooldown, though less of it left");
  assert.deepEqual(run({ which: "first", set: { times: 50 } }), [10, 10]);
  // A reaction to its own cast: a tenth of its cooldown off for each foe it hit.
  const robes = buff("robes", { reactions: [{ on: { event: "action_resolve", kind: "ability" }, do: [{ op: "cooldown", which: "event", set: { lessPct: { scale: [{ ratio: 10, count: "hit" }] } }, to: "holder" }] }] });
  const wave = { id: "wave", cast: 0, recovery: 0, cooldown: 20, target: { side: "foes", pick: "all" }, do: [{ op: "damage", type: "physical", amount: 1 }] };
  const b = arena({ party: [{ name: "P", abilities: ["wave"], statuses: ["robes"] }], enemies: [BAG, { ...BAG, name: "B" }, { ...BAG, name: "C" }], statuses: [robes], abilities: [wave], ruleset: { opening: undefined } }).to(50);
  assert.deepEqual(b.acts("P", "wave"), [20, 34, 48], "three foes: three tenths of twenty sooner");
  // An ability that readies its caster's next ability never readies itself.
  const rubato = { id: "rubato", cast: 0, recovery: 0, cooldown: 30, target: { side: "allies", pick: "all" }, do: [{ op: "cooldown", which: "soonest", set: "ready" }] };
  const c = arena({ party: [{ name: "Bard", abilities: ["rubato", "x"] }], enemies: [BAG], abilities: [rubato, x] });
  readyAt(c, "Bard", "rubato", 5); readyAt(c, "Bard", "x", 200);
  c.to(5);
  assert.deepEqual([left(c, "Bard", "rubato") > 0, left(c, "Bard", "x")], [true, 0]);
});

test("a recast can be paid for as a cast of its own (and isn't made when it can't be), and a count can call the first-slotted ability whatever its cooldown", () => {
  const echoes = buff("echoes", { reactions: [{ on: { event: "action_resolve", kind: "ability", repeat: false }, do: [{ op: "recast", paid: true }] }] });
  const counts = buff("counts", { reactions: [{ on: { event: "action_resolve", kind: "ability", counted: true }, do: [{ op: "apply", status: "count", to: "holder" }] }, { on: { event: "action_resolve", kind: "ability", repeat: true }, do: [{ op: "apply", status: "repeats", to: "holder" }] }] });
  const zap = bolt("zap", { mp: 40 });
  const a = arena({ party: [{ name: "P", stats: { max_mp: 100 }, abilities: ["zap"], statuses: ["echoes", "counts"] }], enemies: [BAG], statuses: [echoes, counts, tally("count"), tally("repeats")], abilities: [zap] });
  readyAt(a, "P", "zap", 1);
  a.to(2);
  assert.deepEqual([a.hits("Bag").length, a.unit("P").mp, stacks(a, "P", "count"), stacks(a, "P", "repeats")], [2, 20, 2, 1], "the second is paid, counts as a cast, and is a repeat that nothing repeats");
  readyAt(a, "P", "zap", 3);
  a.to(4);
  assert.deepEqual([a.hits("Bag").length, a.unit("P").mp], [2, 20], "20 MP can't pay for a cast, let alone its second");
  const bell = buff("bell", { reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [{ op: "recast", which: "first", paid: true }] }] });
  const b = arena({ party: [{ name: "P", stats: { max_mp: 100 }, weapon: club(1), abilities: ["zap"], statuses: ["bell"] }], enemies: [BAG], statuses: [bell], abilities: [zap] });
  readyAt(b, "P", "zap", 500);
  b.to(31);
  assert.deepEqual([amounts(b, "Bag"), b.unit("P").mp], [[1, 100, 1, 100, 1], 20], "cast on the swing while the MP lasts, its cooldown left where it was");
  assert.ok(left(b, "P", "zap") > 400);
});

// ─── Statuses picked, the opening again, knockouts, sight ───────────────────

test("one of several statuses: two different ones, the same for every target; or the one the target holds the most stacks of", () => {
  const kinds = ["burn", "chill", "shock", "bleed"].map((id) => debuff(id, { stacking: "intensity" }));
  const plagues = device("plagues", { target: "self", do: [{ op: "one", of: kinds.map((k) => ({ status: k.id, stacks: 2 })), count: 2, same: true, to: { side: "foes", pick: "all" } }] });
  const tinder = device("tinder", { do: [{ op: "one", of: kinds.map((k) => ({ status: k.id, stacks: 3 })), pick: "most" }] });
  const a = arena({ party: [{ name: "P", abilities: ["plagues"] }], enemies: [{ ...BAG, name: "A" }, { ...BAG, name: "B" }], statuses: kinds, abilities: [plagues] });
  readyAt(a, "P", "plagues", 1);
  a.to(2);
  const held = (u: string) => a.unit(u).statuses.map((s) => s.id).sort().join();
  assert.equal(a.unit("A").statuses.length, 2);
  assert.equal(held("A"), held("B"));
  const b = arena({ party: [{ name: "P", abilities: ["tinder"] }], enemies: [BAG], statuses: kinds, abilities: [tinder] });
  readyAt(b, "P", "tinder", 1);
  b.to(2);
  assert.equal(b.unit("Bag").statuses.length, 0, "on a foe that holds none of them, nothing");
  b.unit("Bag").statuses.push({ uid: 9000, id: "chill", src: null, at: 0, end: -1, stacks: 2000, nums: [] }, { uid: 9001, id: "burn", src: null, at: 0, end: -1, stacks: 1000, nums: [] });
  readyAt(b, "P", "tinder", 3);
  b.to(4);
  assert.deepEqual([stacks(b, "Bag", "chill"), stacks(b, "Bag", "burn")], [5, 1]);
});

test("restart makes the fight_start reactions of a unit's opening statuses happen again, once an event, leaving out those for the first start alone", () => {
  const horn = buff("horn", { reactions: [{ on: { event: "fight_start" }, do: [{ op: "apply", status: "gift", to: "holder" }] }, { on: { event: "fight_start", repeat: false }, do: [{ op: "apply", status: "price", to: "holder" }] }] });
  const passive = buff("passive", { reactions: [{ on: { event: "fight_start" }, do: [{ op: "apply", status: "own", to: "holder" }] }] });
  const again = (id: string) => buff(id, { reactions: [{ on: { event: "ko", whose: "foe" }, do: [{ op: "restart", to: { side: "allies", pick: "all" } }] }] });
  const a = arena({ party: [{ name: "P", weapon: club(100), statuses: ["horn", "passive", "coat", "dawn"] }], enemies: [{ name: "A", stats: { max_hp: 50 } }, BAG], statuses: [horn, passive, again("coat"), again("dawn"), tally("gift"), tally("price"), tally("own")] });
  a.unit("P").opening = ["horn"];
  a.to(11);
  assert.deepEqual([stacks(a, "P", "gift"), stacks(a, "P", "price"), stacks(a, "P", "own")], [2, 1, 1], "the gift again, once for the fall though two cards call for it; not the price, nor what isn't its gear's or its seat's");
});

test("fell knocks a unit out past its Shield and its floor; the actor's kill, but no killing blow", () => {
  const page = buff("page", { reactions: [{ on: { event: "ko", whose: "foe" }, do: [{ op: "fell", to: { side: "foes", where: { hpBelow: 10 }, pick: "all" } }] }, { on: { event: "ko", whose: "foe", other: "holder", tags: ["physical"] }, do: [{ op: "apply", status: "blows", to: "holder" }] }] });
  const shell = buff("shell", { floor: {}, reactions: [{ on: { event: "fight_start" }, do: [{ op: "apply", status: "shield", stacks: 500, to: "holder" }] }] });
  const a = arena({
    party: [{ name: "P", weapon: club(100), statuses: ["page"] }],
    enemies: [{ name: "A", stats: { max_hp: 50, aggro: 100000 } }, { name: "B", stats: { max_hp: 1000, aggro: 1 }, hp: 50, statuses: ["shell"] }, { ...BAG, name: "C", stats: { max_hp: 1e6, aggro: 1 } }],
    statuses: [page, shell, tally("shield", { absorb: true }), tally("blows")],
  }).to(11);
  assert.deepEqual([a.unit("A").ko, a.unit("B").ko, a.unit("C").ko], [true, true, false]);
  assert.equal(stacks(a, "P", "blows"), 1);
});

test("someone stays in sight: Hidden doesn't land on the last unit its foes can pick, and when that unit falls the last in slot order steps out", () => {
  const hidden = buff("hidden", { unremovable: true, duration: 50, stats: [{ stat: "forbidden", flat: 1 }] });
  const shadow = buff("shadow", { reactions: [{ on: { event: "fight_start" }, do: [{ op: "apply", status: "hidden", to: "holder" }] }] });
  const a = arena({ party: [{ name: "One", statuses: ["shadow"] }, { name: "Two", statuses: ["shadow"] }, { name: "Three", statuses: ["shadow"] }], enemies: [BAG], statuses: [hidden, shadow] }).to(1);
  assert.deepEqual(["One", "Two", "Three"].map((u) => a.has(u, "hidden").length), [1, 1, 0], "the last in slot order stays out");
  const b = arena({
    party: [{ name: "Light", stats: { max_hp: 5 } }, { name: "One", stats: { max_hp: 1e6 }, statuses: ["shadow"] }, { name: "Two", stats: { max_hp: 1e6 }, statuses: ["shadow"] }],
    enemies: [{ ...BAG, weapon: club(10, 4) }], statuses: [hidden, shadow],
  }).to(5);
  assert.ok(b.unit("Light").ko);
  assert.deepEqual([b.has("One", "hidden").length, b.has("Two", "hidden").length], [1, 0], "the later shadow steps out");
});

// ─── Stats swapped, swings that never wait, a random order ──────────────────

test("swap: two stats change places as they stand from class and gear, and statuses change them as usual after that", () => {
  const turncoat = buff("turncoat", { swap: ["attack", "defense"] });
  const guard = buff("guard", { stats: [{ stat: "defense", flat: 30 }] });
  const a = arena({ party: [{ name: "P", stats: { attack: 50, defense: 10 }, flat: { attack: 5 }, statuses: ["turncoat", "guard"] }], enemies: [BAG], statuses: [turncoat, guard] }).to(1);
  assert.deepEqual([a.unit("P").stats.attack, a.unit("P").stats.defense], [10, 85]);
});

test("a tireless unit keeps swinging on its own clock through an ability's wind-up and recovery; another waits", () => {
  const tireless = buff("tireless", { tireless: true });
  const slow = { id: "slow", cast: 10, recovery: 6, cooldown: 1000, do: [{ op: "damage", type: "physical", amount: 500 }] };
  const run = (statuses: string[]) => {
    const a = arena({ party: [{ name: "P", weapon: club(100, 4), abilities: ["slow"], statuses }], enemies: [BAG], statuses: [tireless], abilities: [slow], ruleset: { opening: undefined } });
    readyAt(a, "P", "slow", 4.5);
    return a.to(24).hits("Bag").map((e) => e.amount);
  };
  assert.equal(run([]).filter((x) => x === 100).length, 2, "a swing at 4, then nothing until the cast and its recovery are done, at 21");
  assert.equal(run(["tireless"]).filter((x) => x === 100).length, 6, "a swing every four ticks, all through");
  assert.equal(run(["tireless"]).filter((x) => x === 500).length, 1);
});

test("order: random casts a ready ability picked at random, whatever order they're slotted in", () => {
  const motley = buff("motley", { order: "random" });
  const mk = (id: string) => ({ id, cast: 0, recovery: 1, cooldown: 1, do: [{ op: "damage", type: "physical", amount: 1 }] });
  const run = (statuses: string[]) => {
    const a = arena({ party: [{ name: "P", abilities: ["a", "b", "c"], statuses }], enemies: [BAG], statuses: [motley], abilities: [mk("a"), mk("b"), mk("c")], ruleset: { opening: undefined } }).to(60);
    return ["a", "b", "c"].map((id) => a.acts("P", id).length);
  };
  const plain = run([]), random = run(["motley"]);
  assert.ok(plain[0] > plain[2] * 3 || plain[2] === 0, `in slot order the first is cast whenever it's ready (${plain})`);
  assert.ok(Math.min(...random) > 8, `at random each takes its share (${random})`);
});

// ─── Tests and targets ──────────────────────────────────────────────────────

test("tests of a side: the most current HP, the top of a stat among the others, a unit in a seat read for a number, and the unit that last hit", () => {
  const tusk = buff("tusk", { boosts: [{ tag: "physical", pct: { scale: [{ ratio: 100, when: { topHp: true }, of: "target" }] } }] });
  const a = arena({ party: [{ name: "P", weapon: club(100), statuses: ["tusk"] }], enemies: [{ name: "Big", stats: { max_hp: 9000, aggro: 100000 } }, { name: "Small", stats: { max_hp: 500, aggro: 1 } }], statuses: [tusk] }).to(11);
  assert.deepEqual(amounts(a, "Big"), [200]);
  const score = buff("score", { reactions: [{ on: { event: "action_resolve", whose: "ally" }, if: { unit: "owner", where: { top: { stats: ["attack"], others: true } } }, do: [{ op: "apply", status: "count", to: "holder" }] }] });
  const zap = bolt("zap");
  const b = arena({ party: [{ name: "Score", stats: { attack: 99 }, statuses: ["score"] }, { name: "High", stats: { attack: 50 }, abilities: ["zap"] }, { name: "Low", stats: { attack: 5 }, abilities: ["zap"] }], enemies: [BAG], statuses: [score, tally("count")], abilities: [zap] });
  readyAt(b, "High", "zap", 1); readyAt(b, "Low", "zap", 2);
  b.to(3);
  assert.equal(stacks(b, "Score", "count"), 1, "the other ally with the highest Attack, the holder itself left out");
  const reaper = buff("reaper", { boosts: [{ tag: "physical", pct: { scale: [{ ratio: 10, stacks: "spite", seat: "wall" }] } }] });
  const c = arena({ party: [{ name: "Wall" }, { name: "Reaper", weapon: club(100), statuses: ["reaper"] }], enemies: [BAG], statuses: [reaper, tally("spite")] });
  c.unit("Wall").seat = "wall"; c.unit("Reaper").seat = "reaper";
  c.unit("Wall").statuses.push({ uid: 9000, id: "spite", src: null, at: 0, end: -1, stacks: 5000, nums: [] });
  assert.deepEqual(amounts(c.to(11), "Bag"), [150]);
  const accuser = buff("accuser", { reactions: [{ on: { event: "healed", whose: "team", other: "holder", notTags: ["pulse"] }, do: [{ op: "apply", status: "marked", to: "assailant" }] }] });
  const mend = device("mend", { target: { side: "others" }, do: [{ op: "heal", amount: 5 }] });
  const d = arena({ party: [{ name: "Priest", abilities: ["mend"], statuses: ["accuser"] }, { name: "Tank", stats: { max_hp: 1000, aggro: 100000 } }], enemies: [{ ...BAG, name: "Hitter", weapon: club(10, 3) }, { ...BAG, name: "Idle" }], statuses: [accuser, debuff("marked")], abilities: [mend] });
  readyAt(d, "Priest", "mend", 4);
  d.to(5);
  assert.deepEqual([d.has("Hitter", "marked").length, d.has("Idle", "marked").length], [1, 0]);
});

test("a strike with Seek picks as an action would: past a Taunt, and its fallback to a random foe follows a Mark; a strike can wait on its holder's count", () => {
  const spear = buff("spear", { reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [{ op: "strike", amount: 77, seek: true, to: { side: "foes", pick: "highest", by: { stacks: "shock" } } }] }] });
  const a = arena({
    party: [{ name: "P", weapon: club(1), statuses: ["spear"] }],
    enemies: [{ ...BAG, name: "Taunter", statuses: ["taunt"] }, { ...BAG, name: "Marked", statuses: ["marked"] }, { ...BAG, name: "Third" }],
    statuses: [spear, buff("taunt", { stats: [{ stat: "forced", flat: 1 }] }), debuff("marked", { focus: true }), debuff("shock", { stacking: "intensity" })],
  }).to(11);
  assert.deepEqual([amounts(a, "Taunter"), amounts(a, "Marked")], [[1], [77]]);
  const volley = buff("volley", { strike: { to: { side: "foes", pick: "all", exclude: "targets" }, kind: "bonus", when: { stacks: { status: "count", atLeast: 2 } } }, reactions: [{ on: { event: "action_resolve", kind: "basic" }, do: [{ op: "apply", status: "count", to: "holder" }] }] });
  const count = tally("count", { cap: 3, trigger: { on: { event: "status_capped", status: "count" } }, drop: "all" });
  const b = arena({ party: [{ name: "P", weapon: club(10, 2), statuses: ["volley"] }], enemies: [{ ...BAG, name: "A", stats: { max_hp: 1e6, aggro: 100000 } }, { ...BAG, name: "B", stats: { max_hp: 1e6, aggro: 1 } }], statuses: [volley, count] }).to(13);
  assert.deepEqual([b.hits("A").length, b.hits("B").map((e) => e.at)], [6, [at(6), at(12)]], "every third basic attack is a volley");
});
