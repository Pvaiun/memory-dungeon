/**
 * The building blocks the creative-builds pass added (PRIMITIVES.md), each in a small fight: Bewildered, Fixated, crits
 * taken always or never, a debt that comes due (Owed), a cover by tag and for the lowest, healing shared by a side, picks
 * by max HP, a trigger spared, HP traded and rewound, a status shared at a share, an ability spread over every foe, an
 * ability that reads another stat or another unit's, an extra strike that lands elsewhere, and the tests on what a unit
 * wears and on its own stats.
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
/** Every ability of every unit ready at the fight's first moment (they start on cooldown). */
const ready = (a: A) => {
  for (const u of a.f.units) for (const x of u.acts) if (x.id !== "basic") x.ready = 0;
  return a;
};

test("Bewildered: the holder's basic attack goes to one of its own side; with nobody there, a foe", () => {
  const bew = debuff("bew", { confuse: true });
  const a = arena({ party: [{ name: "P", stats: { max_hp: 1e6 } }], enemies: [{ name: "F", weapon: club(10, 5), statuses: ["bew"] }, { name: "G", stats: { max_hp: 1e6 } }], statuses: [bew] }).to(6);
  assert.deepEqual(amounts(a, "G"), [10]);
  assert.equal(a.hits("P").length, 0);
  const b = arena({ party: [{ name: "P", stats: { max_hp: 1e6 } }], enemies: [{ name: "F", weapon: club(10, 5), statuses: ["bew"] }], statuses: [bew] }).to(6);
  assert.deepEqual(amounts(b, "P"), [10], "alone, it strikes a foe");
});

test("Fixated: the holder's picks go to the unit that fixated it, inside the Taunt rule", () => {
  const fix = debuff("fix", { fixate: true, duration: 50 });
  const lure = device("lure", { target: "foe", do: [{ op: "damage", type: "physical", amount: 1, apply: [{ status: "fix" }] }] });
  const a = arena({
    party: [{ name: "A", stats: { max_hp: 1e6, aggro: 200 } }, { name: "B", stats: { max_hp: 1e6 }, abilities: ["lure"] }],
    enemies: [{ name: "F", stats: { max_hp: 1e6 }, weapon: club(10, 3) }], statuses: [fix], abilities: [lure],
  });
  ready(a).to(20);
  const onB = a.hits("B").filter((e) => e.by === a.unit("F").id).length, onA = a.hits("A").length;
  assert.ok(onB >= 5 && onA <= 1, `fixated on B: ${onB} on B, ${onA} on A`);
  const taunt = buff("tnt", { stats: [{ stat: "forced", flat: 1 }] });
  const b = arena({
    party: [{ name: "A", stats: { max_hp: 1e6 }, statuses: ["tnt"] }, { name: "B", stats: { max_hp: 1e6 }, abilities: ["lure"] }],
    enemies: [{ name: "F", stats: { max_hp: 1e6 }, weapon: club(10, 3) }], statuses: [fix, taunt], abilities: [lure],
  });
  ready(b).to(20);
  assert.equal(b.hits("B").filter((e) => e.by === b.unit("F").id).length, 0, "a Taunt still takes the pick");
});

test("crits taken: always on a Brittle holder, never on a holder that takes none, which wins", () => {
  const brittle = debuff("brittle", { critsTaken: "always" });
  const plain = buff("plain", { critsTaken: "never" });
  const a = arena({ party: [{ name: "P", weapon: club(100, 5) }], enemies: [{ ...BAG, statuses: ["brittle"] }], statuses: [brittle] }).to(6);
  assert.deepEqual(amounts(a, "Bag"), [150]);
  const b = arena({ party: [{ name: "P", stats: { crit_chance: 100 }, weapon: club(100, 5) }], enemies: [{ ...BAG, statuses: ["brittle", "plain"] }], statuses: [brittle, plain] }).to(6);
  assert.deepEqual(amounts(b, "Bag"), [100]);
});

test("Owed: hits on its holder wait as a debt, which comes due at once when it runs out, and a Shield soaks it", () => {
  const owed = tally("owed", { label: "marker", debt: true, duration: 10 });
  const mail = buff("mail", { owe: "owed" });
  const a = arena({ party: [{ name: "P", stats: { max_hp: 1000 }, statuses: ["mail"] }], enemies: [{ name: "F", weapon: club(100, 4) }], statuses: [owed, mail] }).to(30);
  const owing = a.hits("P").filter((e) => e.word === "OWED");
  const due = a.hits("P").find((e) => e.src === "owed")!;
  assert.equal((due.at as number) - (owing[0].at as number), at(10), "due ten ticks after the first, whatever came after");
  const before = owing.filter((e) => (e.at as number) < (due.at as number)).reduce((n, e) => n + (e.amount as number), 0);
  assert.equal(due.amount, before);
  assert.ok(before >= 200);
  assert.equal(a.unit("P").hp < 1000, true);
});

test("a cover by tag takes only Area hits, once for each ally struck; a cover for the lowest only hits on the lowest", () => {
  const wall = buff("wall", { cover: { share: 0, tag: "area" } });
  const blast = device("blast", { target: { side: "foes", pick: "all" }, do: [{ op: "damage", type: "physical", amount: 10 }] });
  const a = arena({
    party: [{ name: "W", stats: { max_hp: 1e6 }, statuses: ["wall"] }, { name: "X", stats: { max_hp: 1e6 } }, { name: "Y", stats: { max_hp: 1e6 } }],
    enemies: [{ name: "F", abilities: ["blast"], weapon: club(5, 400) }], statuses: [wall], abilities: [blast],
  });
  ready(a).to(1);
  assert.equal(a.hits("W").filter((e) => e.amount === 10).length, 3);
  assert.equal(a.hits("X").filter((e) => e.amount === 10).length + a.hits("Y").filter((e) => e.amount === 10).length, 0);
  const shep = buff("shep", { cover: { share: 0, lowest: true } });
  const b = arena({
    party: [{ name: "S", stats: { max_hp: 1e6 }, statuses: ["shep"] }, { name: "Low", stats: { max_hp: 1000 }, hp: 100 }, { name: "Hi", stats: { max_hp: 1000, aggro: 400 } }],
    enemies: [{ name: "F", weapon: club(5, 2) }], statuses: [shep],
  }).to(9);
  assert.ok(b.hits("Hi").length > 0 && b.hits("Low").length === 0);
});

test("healing shared by a side: a heal on one is split evenly across its living units", () => {
  const pool = buff("pool", { sharesHeals: true });
  const mend = device("mend", { target: "self", do: [{ op: "heal", amount: 300 }] });
  const a = ready(arena({ party: [{ name: "H", stats: { max_hp: 1000 }, hp: 500, abilities: ["mend"], statuses: ["pool"] }, { name: "X", stats: { max_hp: 1000 }, hp: 500 }, { name: "Y", stats: { max_hp: 1000 }, hp: 500 }], enemies: [BAG], statuses: [pool], abilities: [mend] })).to(1);
  assert.deepEqual(["H", "X", "Y"].map((n) => a.unit(n).hp), [600, 600, 600]);
});

test("picks by max HP: a side that holds the rule is weighed by max HP, not by its draw", () => {
  const lode = buff("lode", { drawBy: "max_hp" });
  const a = arena({ party: [{ name: "Big", stats: { max_hp: 1e7 }, statuses: ["lode"] }, { name: "Loud", stats: { max_hp: 1e5, aggro: 200 } }], enemies: [{ name: "F", weapon: club(1, 1) }], statuses: [lode] }).to(40);
  assert.ok(a.hits("Big").length > 30 && a.hits("Loud").length < 5);
});

test("a spared trigger: the holder's basic attacks keep its Might, its abilities spend it", () => {
  const might = tally("might2", { trigger: { on: { event: "action_resolve" } }, drop: { count: 1 } });
  const keep = buff("keep", { spare: { status: "might2", kind: "basic" } });
  const load = device("load", { target: "self", cooldown: 100, do: [{ op: "apply", status: "might2", stacks: 3 }] });
  const a = ready(arena({ party: [{ name: "P", weapon: club(1, 2), abilities: ["load"], statuses: ["keep"] }], enemies: [BAG], statuses: [might, keep], abilities: [load] })).to(7);
  assert.equal(stacks(a, "P", "might2"), 2, "the load's own resolve spends one; the swings spend none");
});

test("HP traded and rewound", () => {
  const swap = buff("swap", { reactions: [{ on: { event: "fight_start" }, do: [{ op: "trade", to: { side: "foes", pick: "all" } }] }] });
  const a = arena({ party: [{ name: "P", stats: { max_hp: 1000 }, hp: 250, statuses: ["swap"] }], enemies: [{ name: "F", stats: { max_hp: 4000 } }], statuses: [swap] }).to(1);
  assert.deepEqual([a.unit("P").hp, a.unit("F").hp], [1000, 1000]);
  const glass = buff("glass", { reactions: [{ on: { event: "hp_low", line: 40 }, do: [{ op: "rewind", ticks: 6, to: "holder" }] }] });
  const b = arena({ party: [{ name: "P", stats: { max_hp: 1000 }, statuses: ["glass"] }], enemies: [{ name: "F", weapon: club(200, 3) }], statuses: [glass] }).to(9.5);
  // Hits at 3, 6 and 9: 800, 600, 400 is still at the line; the fourth would cross it.
  b.to(12.5);
  assert.ok(b.unit("P").hp > 400, `rewound to ${b.unit("P").hp}`);
});

test("a share at a share of the stacks, an ability spread over every foe, an ability that reads another stat or another unit's", () => {
  const heart = buff("heart", { reactions: [{ on: { event: "status_gained", whose: "foe", other: "holder", repeat: false }, do: [{ op: "share", ratio: 0.5, to: { side: "foes", pick: "all", exclude: "owner" } }] }] });
  const ember = tally("ember", { label: "debuff" });
  const lay = device("lay", { target: "foe", do: [{ op: "apply", status: "ember", stacks: 4 }] });
  const a = ready(arena({ party: [{ name: "P", abilities: ["lay"], statuses: ["heart"] }], enemies: [{ ...BAG, name: "B1" }, { ...BAG, name: "B2" }], statuses: [heart, ember], abilities: [lay] })).to(2);
  assert.deepEqual([stacks(a, "B1", "ember") + stacks(a, "B2", "ember")], [6]);
  const orb = buff("orb", { mods: [{ of: { single: true }, spread: true }] });
  const bolt = device("bolt", { target: "foe", do: [{ op: "damage", type: "physical", amount: 90 }] });
  const b = ready(arena({ party: [{ name: "P", abilities: ["bolt"], statuses: ["orb"] }], enemies: [{ ...BAG, name: "B1" }, { ...BAG, name: "B2" }, { ...BAG, name: "B3" }], statuses: [orb], abilities: [bolt] })).to(1);
  assert.deepEqual(["B1", "B2", "B3"].map((n) => amounts(b, n)), [[30], [30], [30]]);
  const plate = buff("plate", { rescale: { from: "attack", to: "defense", if: { above: { stat: "defense", over: "attack" } } } });
  const smack = device("smack", { target: "foe", do: [{ op: "damage", type: "physical", amount: { scale: [{ ratio: 1, stat: "attack" }] } }] });
  const c = ready(arena({ party: [{ name: "P", stats: { attack: 10, defense: 50 }, weapon: club({ scale: [{ ratio: 1, stat: "attack" }] }, 5), abilities: ["smack"], statuses: ["plate"] }], enemies: [BAG], statuses: [plate], abilities: [smack] })).to(6);
  assert.deepEqual((amounts(c, "Bag") as number[]).sort((x, y) => y - x), [50, 10], "the ability reads Defense, the basic attack still Attack");
  const hand = buff("hand", { rescale: { from: "attack", best: true } });
  const d = ready(arena({ party: [{ name: "P", stats: { attack: 10 }, abilities: ["smack"], statuses: ["hand"] }, { name: "Q", stats: { attack: 70 } }], enemies: [BAG], statuses: [hand], abilities: [smack] })).to(1);
  assert.deepEqual(amounts(d, "Bag"), [70]);
});

test("an extra strike that replaces the plain one lands elsewhere, once", () => {
  const ds = buff("ds", { strike: { scale: "double_strike", to: "target" } });
  const weave = buff("weave", { strike: { scale: "double_strike", replace: true, to: { side: "foes", exclude: "targets", pick: "random" } } });
  const a = arena({ party: [{ name: "P", stats: { double_strike: 100 }, weapon: club(10, 5), statuses: ["ds", "weave"] }], enemies: [{ ...BAG, name: "B1" }, { ...BAG, name: "B2" }], statuses: [ds, weave] }).to(6);
  assert.equal(a.hits("B1").length + a.hits("B2").length, 2);
  assert.ok(a.hits("B1").length === 1 && a.hits("B2").length === 1);
});

test("tests on what a unit wears, its kin, its own stats against each other, the fastest swing and the most debuffs", () => {
  const count = (where: S.UnitCondT) => buff(`c${JSON.stringify(where).length}`, { stats: [{ stat: "attack", flat: { scale: [{ ratio: 1, count: { side: "allies", where } }] } }] });
  const shields = count({ offhand: ["kite_shield"] }), none = count({ offhand: false }), robes = count({ armor: ["robes"] }), not = count({ offhandNot: ["kite_shield"] });
  const a = arena({
    party: [{ name: "P", held: { offhand: "kite_shield", armor: "robes" }, statuses: [shields.id] }, { name: "Q", held: { armor: "robes" }, statuses: [none.id] }, { name: "R", statuses: [robes.id, not.id] }],
    enemies: [BAG], statuses: [shields, none, robes, not],
  }).to(1);
  const base = a.unit("P").stats.attack - 1;
  assert.deepEqual(["P", "Q", "R"].map((n) => a.unit(n).stats.attack - base), [1, 2, 4]);
  const kin = buff("kin", { stats: [{ stat: "attack", flat: { scale: [{ ratio: 5, count: { side: "allies", where: { kin: true } } }] } }] });
  const above = buff("above", { stats: [{ stat: "attack", flat: { scale: [{ ratio: 7, when: { above: { stat: "evasion", over: "defense", ratio: 0.001 } } }] } }] });
  const fast = buff("fast", { stats: [{ stat: "attack", flat: { scale: [{ ratio: 3, when: { swing: "fastest" } }] } }] });
  const b = arena({ party: [{ name: "P", stats: { evasion: 20, defense: 3000 }, statuses: ["kin", "above", "fast"] }, { name: "Q" }], enemies: [BAG], statuses: [kin, above, fast] }).to(1);
  assert.equal(b.unit("P").stats.attack - b.unit("Q").stats.attack, 7 + 3, "no kin (an arena weapon names no kind), Evasion over Defense in points, the fastest swing (a tie passes)");
  const most = buff("most", { boosts: [{ tag: "physical", pct: { scale: [{ ratio: 100, when: { mostDebuffs: true }, of: "target" }] } }] });
  const sore = debuff("sore");
  const c = arena({ party: [{ name: "P", weapon: club(10, 5), statuses: ["most"] }], enemies: [{ ...BAG, name: "B1", statuses: ["sore"] }], statuses: [most, sore] }).to(6);
  assert.deepEqual(amounts(c, "B1"), [20]);
});

test("a dodged hit's raw amount sizes a strike: the hit lands on another foe", () => {
  const mirror = buff("mirror", { reactions: [{ on: { event: "hit_evaded" }, do: [{ op: "strike", of: "hit", to: { side: "foes", exclude: "other", pick: "random" } }] }] });
  const a = arena({ party: [{ name: "P", stats: { max_hp: 1e6, evasion: 100 }, statuses: ["mirror"] }], enemies: [{ name: "F", weapon: club(70, 5) }, { ...BAG, name: "G" }], statuses: [mirror] }).to(6);
  assert.deepEqual(amounts(a, "G"), [70]);
});

test("abilities cast as one wait for each other, and the others come free with the first", () => {
  const chord = buff("chord", { mods: [{ of: { ability: ["s1", "s2"] }, together: true }] });
  const s1 = device("s1", { target: "self", cooldown: 10, mp: 5, do: [{ op: "heal", amount: 1 }] });
  const s2 = device("s2", { target: "self", cooldown: 30, mp: 5, do: [{ op: "heal", amount: 1 }] });
  const a = arena({ party: [{ name: "P", stats: { max_mp: 100 }, abilities: ["s1", "s2"], statuses: ["chord"] }], enemies: [BAG], statuses: [chord], abilities: [s1, s2] });
  a.unit("P").acts.find((x) => x.id === "s1")!.ready = 0;
  a.unit("P").acts.find((x) => x.id === "s2")!.ready = at(12);
  a.to(40);
  assert.deepEqual(a.acts("P", "s1"), [12, 42].filter((t) => t <= 40));
  assert.deepEqual(a.acts("P", "s2"), [12]);
  assert.equal(a.unit("P").mp, 95, "the one cast with it is free");
});
