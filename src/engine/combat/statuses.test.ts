/**
 * Step 4's functionality tests, part 3: statuses, reactions and what the
 * player sees (design sections 7, 8 and 10), mostly the design's Part 2 examples.
 */
import { test } from "vitest";
import assert from "node:assert/strict";
import { arena, weapons } from "./arena.js";

const BAG = { name: "Bag", stats: { max_hp: 1_000_000 } };
const rapid = (w: object = {}) => ({ ...weapons.dagger, cooldown: 1, ...w });
const buff = (id: string, x: object) => ({ id, name: id.toUpperCase(), label: "buff", show: "icon", stacking: "refresh", ...x });
const debuff = (id: string, x: object) => buff(id, { label: "debuff", ...x });
/** An ability that applies a status, usable from `at` ticks. */
const giver = (id: string, status: string, x: object = {}) => ({ id, cast: 0, cooldown: 1000, do: [{ op: "apply", status, ...x }] });
const at = (ticks: number) => ticks * 1000;
/** Make an ability come off cooldown at a given tick instead of its own. */
const readyAt = (a: ReturnType<typeof arena>, unit: string, ability: string, tick: number) => {
  a.unit(unit).acts.find((x) => x.id === ability)!.ready = at(tick);
};
const near = (x: number, want: number, tol = 0.035) => assert.ok(Math.abs(x - want) < tol, `${x.toFixed(3)} isn't near ${want.toFixed(3)}`);

const ARMOR_BREAK = debuff("armor_break", { stacking: "intensity", stats: [{ stat: "armor", flat: -2 }] });
const BURN = debuff("burn", { stacking: "intensity", element: "fire", pulse: { every: 2, do: [{ op: "damage", type: "none", amount: 1 }] }, drop: { fraction: 0.5 } });
const STUN = debuff("stun", { duration: 3, lockout: { covers: "all", interrupt: true } });
const METEOR = { id: "meteor", mp: 10, cast: 30, cooldown: 1, do: [{ op: "damage", type: "magical", element: "fire", amount: 100 }] };

// ─── Applying statuses (7.2) ────────────────────────────────────────────────

test("apply: a status takes effect as soon as its item resolves: a dagger's three hits each add Armor break to Armor 8, and meet Armor 8, 6 and 4", () => {
  const a = arena({ party: [{ name: "Rogue", weapon: { ...weapons.dagger, hits: 3, amount: 10, apply: [{ status: "armor_break" }] } }], enemies: [{ name: "T", stats: { max_hp: 1e6, armor: 8 } }], statuses: [ARMOR_BREAK] }).to(8);
  assert.deepEqual(a.hits("T").map((e) => e.amount), [2, 4, 6]);
  assert.equal(a.has("T", "armor_break")[0].stacks, 3000, "three applications from one action count as three");
});

test("apply: a status attached to a hit applies even when the hit deals nothing (BLOCKED), and never when it's evaded", () => {
  const mark = debuff("mark", { stats: [{ stat: "aggro", flat: 1 }] });
  const a = arena({ party: [{ name: "A", stats: { accuracy: -100 }, weapon: rapid({ amount: 1, apply: [{ status: "mark" }] }) }], enemies: [{ name: "T", stats: { max_hp: 1e6, armor: 8, evasion: 50 } }], statuses: [mark] }).to(400);
  const landed = a.hits("T").filter((e) => e.word === "BLOCKED").length, missed = a.hits("T").filter((e) => e.word === "MISS").length;
  assert.ok(landed > 100 && missed > 100);
  assert.equal(a.entries("status", (e) => e.status === "mark").length, landed);
});

test("apply: an apply effect can state a chance, rolled on the applier's dice; a failed roll shows nothing", () => {
  const mark = debuff("mark", { stats: [{ stat: "aggro", flat: 1 }] });
  const a = arena({ party: [{ name: "A", weapon: rapid({ amount: 1, apply: [{ status: "mark", chance: 30 }] }) }], enemies: [BAG], statuses: [mark] }).to(2000);
  near(a.entries("status").length / a.hits("Bag").length, 0.3);
  assert.equal(a.entries("roll", (e) => e.what === "apply" && e.by === "p1").length, a.hits("Bag").length);
});

test("apply: statuses can't be applied to KO'd units: a lethal hit's attached status doesn't land", () => {
  const mark = debuff("mark", { stats: [{ stat: "aggro", flat: 1 }] });
  const a = arena({ party: [{ name: "A", stats: { attack: 100 }, weapon: { ...weapons.dagger, apply: [{ status: "mark" }] } }], enemies: [{ name: "T", stats: { max_hp: 10 } }, BAG], statuses: [mark] });
  a.unit("T").stats.aggro = 1e6;
  a.to(8);
  assert.ok(a.unit("T").ko);
  assert.equal(a.entries("status", (e) => e.status === "mark").length, 0);
});

// ─── Immunity (7.2) ─────────────────────────────────────────────────────────

const FREEZE = debuff("freeze", { duration: 5, lockout: { covers: "all", interrupt: true }, stats: [{ stat: "resist:fire", flat: -20 }] });
const SILENCE = debuff("silence", { duration: 5, lockout: { covers: "ability", interrupt: true } });

test("immunity: a boss immune to lockouts covering all actions is hit by Freeze; the whole Freeze is blocked and shows IMMUNE, but it can still be silenced", () => {
  const a = arena({
    party: [{ name: "Mage", abilities: ["cast_freeze", "cast_silence"] }],
    enemies: [{ name: "Boss", stats: { max_hp: 1e6, "immune:kind:lockout:all": 1 } }],
    statuses: [FREEZE, SILENCE], abilities: [giver("cast_freeze", "freeze"), giver("cast_silence", "silence")],
  });
  readyAt(a, "Mage", "cast_freeze", 1);
  readyAt(a, "Mage", "cast_silence", 2);
  a.to(2);
  assert.deepEqual(a.entries("immune").map((e) => e.status), ["freeze"]);
  assert.equal(a.unit("Boss").stats["resist:fire"] ?? 0, 0, "the Fire Resistance shred is blocked with the rest");
  assert.equal(a.has("Boss", "silence").length, 1);
});

test("immunity: a unit with full Ice Resistance is immune to a Freeze that carries the ice element; partial Resistance changes nothing", () => {
  const iceFreeze = { ...FREEZE, element: "ice" };
  const run = (resist: number) => {
    const a = arena({ party: [{ name: "Mage", abilities: ["cast"] }], enemies: [{ name: "T", stats: { max_hp: 1e6, "resist:ice": resist } }], statuses: [iceFreeze], abilities: [giver("cast", "freeze")] });
    readyAt(a, "Mage", "cast", 1);
    return a.to(1);
  };
  assert.equal(run(100).entries("immune").length, 1);
  const half = run(50);
  assert.equal(half.has("T", "freeze")[0].end, at(6), "partial Resistance doesn't change a status's duration");
});

test("immunity: immunity stats for a named status, all debuffs, and all damage (Invulnerable)", () => {
  const invulnerable = buff("invulnerable", { stats: [{ stat: "immune:damage", flat: 1 }] });
  const a = arena({
    party: [{ name: "A", stats: { attack: 10 }, weapon: { ...weapons.dagger, apply: [{ status: "burn", stacks: 5 }] } }],
    enemies: [{ name: "T", stats: { max_hp: 1e6, "immune:status:burn": 1 }, statuses: ["invulnerable"] }],
    statuses: [BURN, invulnerable],
  }).to(8);
  assert.deepEqual(a.hits("T").map((e) => [e.amount, e.word]), [[0, "IMMUNE"]]);
  assert.deepEqual(a.entries("immune").map((e) => e.status), ["burn"]);
  const b = arena({ party: [{ name: "A", weapon: { ...weapons.dagger, apply: [{ status: "stun" }] } }], enemies: [{ name: "T", stats: { max_hp: 1e6, "immune:debuffs": 1 } }], statuses: [STUN] }).to(8);
  assert.deepEqual(b.entries("immune").map((e) => e.status), ["stun"]);
});

// ─── Lockouts (7.3) ─────────────────────────────────────────────────────────

test("lockouts: a mage stunned 3 ticks into Meteor's 30-tick cast loses Meteor: no MP spent, no cooldown; its other cooldowns keep running", () => {
  const zap = { id: "zap", cast: 0, cooldown: 20, do: [{ op: "damage", type: "physical", subtype: "blunt", amount: 1 }] };
  const a = arena({
    party: [{ name: "Knight", abilities: ["bash"] }],
    enemies: [{ name: "Mage", stats: { max_hp: 1e6, max_mp: 10 }, abilities: ["meteor", "zap"] }],
    statuses: [STUN], abilities: [METEOR, zap, giver("bash", "stun")],
  });
  readyAt(a, "Knight", "bash", 4);
  a.to(4);
  const mage = a.unit("Mage");
  assert.deepEqual(a.entries("interrupt").map((e) => [e.at, e.act]), [[at(4), "meteor"]]);
  assert.equal(mage.mp, 10);
  assert.equal(mage.acts[0].ready, at(1), "Meteor's cooldown never started");
  assert.equal(mage.acts[1].ready, at(20), "Zap's cooldown kept running");
  // The stun lasts to the end of tick 7; Meteor starts again just after.
  a.to(8);
  assert.deepEqual(a.entries("cast", (e) => e.act === "meteor").map((e) => e.at), [at(1), at(7) + 1]);
});

test("lockouts: a silenced unit basic-attacks; a unit both silenced and disarmed waits", () => {
  const silence = debuff("silence", { lockout: { covers: "ability", interrupt: true } }), disarm = debuff("disarm", { lockout: { covers: "basic", interrupt: true } });
  const zap = { id: "zap", cast: 0, cooldown: 4, do: [{ op: "damage", type: "physical", subtype: "blunt", amount: 1 }] };
  const one = arena({ party: [{ name: "A", weapon: weapons.dagger, abilities: ["zap"], statuses: ["silence"] }], enemies: [BAG], statuses: [silence, disarm], abilities: [zap] }).to(40);
  assert.ok(one.entries("act").length >= 5 && one.entries("act").every((e) => e.act === "basic"));
  const both = arena({ party: [{ name: "A", weapon: weapons.dagger, abilities: ["zap"], statuses: ["silence", "disarm"] }], enemies: [BAG], statuses: [silence, disarm], abilities: [zap] }).to(40);
  assert.equal(both.entries("act").length, 0);
});

test("lockouts: a lockout can cover something narrower, such as one element", () => {
  const smother = debuff("smother", { lockout: { covers: "fire" } });
  const frost = { id: "frost", cast: 0, cooldown: 5, do: [{ op: "damage", type: "magical", element: "ice", amount: 1 }] };
  const a = arena({ party: [{ name: "A", stats: { max_mp: 100 }, abilities: ["meteor", "frost"], statuses: ["smother"] }], enemies: [BAG], statuses: [smother], abilities: [METEOR, frost] }).to(20);
  assert.ok(a.entries("act").length > 0 && a.entries("act").every((e) => e.act === "frost"));
});

test("lockouts: Interrupt is an instant lockout: it leaves no status, and the interrupted unit is ready at once and may restart the same cast", () => {
  const interrupt = debuff("interrupt", { lockout: { covers: "all", interrupt: true } });
  const smash = { id: "smash", cast: 10, cooldown: 1, do: [{ op: "damage", type: "physical", subtype: "blunt", amount: 1 }] };
  const a = arena({ party: [{ name: "A", abilities: ["kick"] }], enemies: [{ name: "Ogre", abilities: ["smash"] }], statuses: [interrupt], abilities: [smash, giver("kick", "interrupt", { duration: 0 })] });
  readyAt(a, "A", "kick", 5);
  a.to(16);
  assert.deepEqual(a.entries("interrupt").map((e) => e.at), [at(5)]);
  assert.equal(a.has("Ogre", "interrupt").length, 0);
  assert.deepEqual(a.entries("cast", (e) => e.act === "smash").map((e) => e.at), [at(1), at(5) + 1]);
  assert.deepEqual(a.acts("Ogre", "smash"), [15.001]);
});

test("lockouts: a lockout without interrupt lets the current cast finish, then blocks what it covers", () => {
  const daze = debuff("daze", { duration: 10, lockout: { covers: "all" } });
  const smash = { id: "smash", cast: 10, cooldown: 1, do: [{ op: "damage", type: "physical", subtype: "blunt", amount: 1 }] };
  const a = arena({ party: [{ name: "A", abilities: ["dazer"] }], enemies: [{ name: "Ogre", abilities: ["smash"] }], statuses: [daze], abilities: [smash, giver("dazer", "daze")] });
  readyAt(a, "A", "dazer", 5);
  a.to(16);
  assert.deepEqual(a.acts("Ogre", "smash"), [11]);
  assert.deepEqual(a.entries("cast", (e) => e.act === "smash").map((e) => e.at), [at(1), at(15) + 1]);
});

test("lockouts: a party stun lands in the party batch on the sub-tick an enemy's Smash would resolve in the enemy batch, and Smash is interrupted", () => {
  const smash = { id: "smash", cast: 10, cooldown: 1, do: [{ op: "damage", type: "physical", subtype: "blunt", amount: 1 }] };
  const a = arena({ party: [{ name: "A", abilities: ["bash"] }], enemies: [{ name: "Ogre", abilities: ["smash"] }], statuses: [STUN], abilities: [smash, giver("bash", "stun")] });
  readyAt(a, "A", "bash", 11);
  a.to(11);
  assert.deepEqual(a.entries("interrupt").map((e) => e.at), [at(11)]);
  assert.equal(a.acts("Ogre").length, 0);
});

test("lockouts: lockouts don't stop reactions: a stunned unit's reactions still fire", () => {
  const spikes = buff("spikes", { show: "sheet", reactions: [{ on: { event: "hit_taken" }, do: [{ op: "damage", type: "none", amount: 3, to: "other" }] }] });
  const a = arena({ party: [{ name: "A", stats: { max_hp: 1e6 }, statuses: ["stun_forever", "spikes"] }], enemies: [{ name: "Foe", stats: { max_hp: 1e6 }, weapon: weapons.dagger }], statuses: [{ ...STUN, id: "stun_forever", duration: undefined }, spikes] }).to(9);
  assert.deepEqual(a.hits("Foe").map((e) => [e.at, e.amount]), [[at(8) + 1, 3]]);
});

// ─── Action changes (7.4) ───────────────────────────────────────────────────

test("action changes: a weapon enchant adds a fire rider to the holder's basic attacks, scaled from the holder's stats", () => {
  const oil = buff("flame_oil", { riders: [{ on: "basic", add: { type: "magical", element: "fire", amount: { scale: [{ ratio: 0.5, stat: "attack", of: "holder" }] } } }] });
  const a = arena({ party: [{ name: "A", stats: { attack: 20 }, weapon: weapons.dagger, statuses: ["flame_oil"] }], enemies: [BAG], statuses: [oil] }).to(8);
  assert.deepEqual(a.hits("Bag").map((e) => [e.part, e.amount]), [["hit", 20], ["rider", 10]]);
});

test("action changes: a rider can name the source's stat instead, fixed when the status was applied", () => {
  const blessing = buff("blessing", { riders: [{ on: "physical", add: { type: "magical", element: "holy", amount: { scale: [{ ratio: 1, stat: "magic", of: "source" }] } } }] });
  const a = arena({ party: [{ name: "Fighter", stats: { attack: 20 }, weapon: weapons.axe }, { name: "Priest", stats: { magic: 15 }, abilities: ["bless"] }], enemies: [BAG], statuses: [blessing], abilities: [{ ...giver("bless", "blessing"), target: { side: "others" } }] });
  readyAt(a, "Priest", "bless", 1);
  a.to(20);
  assert.deepEqual(a.hits("Bag").map((e) => [e.part, e.amount]), [["hit", 20], ["rider", 15]]);
});

test("action changes: Imbue changes the element of the holder's magical instances to ice, which then meets ice Resistance", () => {
  const imbue = buff("imbue", { convert: { element: "ice" } });
  const bolt = { id: "fire_bolt", cast: 0, cooldown: 10, do: [{ op: "damage", type: "magical", element: "fire", amount: 100 }] };
  const a = arena({ party: [{ name: "A", abilities: ["fire_bolt"], statuses: ["imbue"] }], enemies: [{ name: "T", stats: { max_hp: 1e6, "resist:ice": -50, "resist:fire": 100 } }], statuses: [imbue], abilities: [bolt] }).to(10);
  assert.deepEqual(a.hits("T").map((e) => [e.amount, e.word]), [[150, "WEAK"]]);
});

// ─── Repeating effects (7.5) ────────────────────────────────────────────────

/** Apply `stacks` of Burn to the Bag at tick 1, and return its pulses. */
function burn(stacks: number, extra: { statuses?: string[]; more?: unknown[] } = {}) {
  const a = arena({ party: [{ name: "Mage", abilities: ["kindle"], statuses: extra.statuses }], enemies: [BAG], statuses: [BURN, ...(extra.more ?? [])], abilities: [giver("kindle", "burn", { stacks })] });
  readyAt(a, "Mage", "kindle", 1);
  a.to(200);
  return a;
}

test("pulses: Burn triggers every 2 ticks for 1 fire damage per stack, then halves: 10 stacks deal 10 on the first pulse and the total drops to 5", () => {
  const a = burn(10);
  assert.deepEqual(a.hits("Bag").slice(0, 4).map((e) => [e.at, e.amount]), [[at(3), 10], [at(5), 5], [at(7), 2], [at(9), 1]]);
});

test("pulses: Burn counts stacks in thousandths, so it lingers: 10 stacks pulse 14 times, the last 10 for 0 damage (a finding for the report)", () => {
  const a = burn(10);
  assert.equal(a.hits("Bag").length, 14);
  assert.equal(a.hits("Bag").filter((e) => e.amount === 0).length, 10);
});

test("pulses: at half per trigger, each Burn stack is worth about 2 pulses of damage at 300 stacks, but rounding each pulse down costs small totals (a finding)", () => {
  const total = (n: number) => burn(n).hits("Bag").reduce((s, e) => s + (e.amount as number), 0);
  assert.equal(total(300), 596);
  assert.equal(total(3), 4);
});

test("pulses: two Mages each apply 6 Burn stacks to the same enemy, and it has one Burn with a total of 12", () => {
  const a = arena({ party: [{ name: "M1", abilities: ["kindle"] }, { name: "M2", abilities: ["kindle"] }], enemies: [BAG], statuses: [BURN], abilities: [giver("kindle", "burn", { stacks: 6 })] });
  readyAt(a, "M1", "kindle", 1);
  readyAt(a, "M2", "kindle", 1);
  a.to(1);
  assert.deepEqual(a.has("Bag", "burn").map((s) => s.stacks), [12_000]);
});

test("pulses: Bleed is repeating damage with no element: its 5-damage pulses get through Armor 8 and can't be evaded", () => {
  const bleed = debuff("bleed", { duration: 20, pulse: { every: 2, do: [{ op: "damage", type: "none", amount: 5 }] } });
  const a = arena({ party: [{ name: "A", abilities: ["cut"] }], enemies: [{ name: "T", stats: { max_hp: 1e6, armor: 8, evasion: 75 } }], statuses: [bleed], abilities: [giver("cut", "bleed")] });
  readyAt(a, "A", "cut", 1);
  a.to(21);
  assert.deepEqual(a.hits("T").map((e) => e.amount), [5, 5, 5, 5, 5, 5, 5, 5, 5, 5]);
});

test("pulses: a +physical boost never touches Poison; '+20% Poison damage' and '+20% shadow damage' both reach it, fixed from the applier at application", () => {
  const poison = debuff("poison", { element: "shadow", duration: 10, pulse: { every: 2, do: [{ op: "damage", type: "none", amount: 10 }] } });
  const boosts = buff("boosts", { show: "sheet", boosts: [{ tag: "physical", pct: 50 }, { tag: "poison", pct: 20 }, { tag: "shadow", pct: 20 }] });
  const a = arena({ party: [{ name: "A", abilities: ["sting"], statuses: ["boosts"] }], enemies: [BAG], statuses: [poison, boosts], abilities: [giver("sting", "poison")] });
  readyAt(a, "A", "sting", 1);
  a.to(3);
  a.unit("A").statuses = [];
  a.to(5);
  assert.deepEqual(a.hits("Bag").map((e) => e.amount), [14, 14], "fixed at application: removing the boosts later changes nothing");
});

test("pulses: for Intensity, the applier's matching boosts set how many stacks it adds: +40% to Burn turns 10 stacks into 14", () => {
  const boosts = buff("boosts", { show: "sheet", boosts: [{ tag: "burn", pct: 20 }, { tag: "fire", pct: 20 }] });
  const a = burn(10, { statuses: ["boosts"], more: [boosts] });
  assert.equal(a.hits("Bag")[0].amount, 14);
});

test("pulses: the holder's side is read at each pulse (its Resistance), while the applier's stats are fixed at application", () => {
  const rot = debuff("rot", { element: "shadow", duration: 20, pulse: { every: 2, do: [{ op: "damage", type: "none", amount: { scale: [{ ratio: 1, stat: "magic", of: "source" }] } }] } });
  const a = arena({ party: [{ name: "A", stats: { magic: 10 }, abilities: ["curse"] }], enemies: [{ name: "T", stats: { max_hp: 1e6 } }], statuses: [rot], abilities: [giver("curse", "rot")] });
  readyAt(a, "A", "curse", 1);
  a.to(3);
  a.unit("A").base.magic = 1000;
  a.unit("A").stats.magic = 1000;
  a.unit("T").stats["resist:shadow"] = 50;
  a.to(5);
  assert.deepEqual(a.hits("T").map((e) => [e.amount, e.word]), [[10, null], [5, "RESIST"]]);
});

test("pulses: a party Mage's Burn on an enemy pulses in the party batch, and keeps pulsing with its fixed numbers after the Mage is KO'd", () => {
  const a = arena({ party: [{ name: "Mage", stats: { max_hp: 10 }, abilities: ["kindle"] }, { name: "Tank", stats: { max_hp: 1e6 } }], enemies: [{ name: "Foe", stats: { max_hp: 1e6, attack: 100 }, weapon: { ...weapons.dagger, cooldown: 2 } }], statuses: [BURN], abilities: [giver("kindle", "burn", { stacks: 100 })] });
  a.unit("Mage").stats.aggro = 1e6;
  readyAt(a, "Mage", "kindle", 1);
  a.to(2);
  assert.ok(a.unit("Mage").ko);
  assert.equal(a.f.queue.find((it) => it.k === "pulse")!.b, 0, "a debuff's pulse resolves in the batch of the holder's foes");
  a.to(5);
  assert.deepEqual(a.hits("Foe").map((e) => e.amount), [100, 50]);
});

test("pulses: a reaction to being hit doesn't answer Burn's pulses, which aren't hits; a reaction to taking damage does", () => {
  const onHit = buff("on_hit", { show: "sheet", reactions: [{ on: { event: "hit_taken" }, do: [{ op: "mp", amount: 1, to: "holder" }] }] });
  const onDamage = buff("on_damage", { show: "sheet", reactions: [{ on: { event: "damage_taken" }, do: [{ op: "mp", amount: 100, to: "holder" }] }] });
  const a = arena({ party: [{ name: "Mage", abilities: ["kindle"] }], enemies: [{ name: "Bag", stats: { max_hp: 1e6, max_mp: 1e6 }, mp: 0, statuses: ["on_hit", "on_damage"] }], statuses: [BURN, onHit, onDamage], abilities: [giver("kindle", "burn", { stacks: 4 })] });
  readyAt(a, "Mage", "kindle", 1);
  a.to(8);
  assert.equal(a.unit("Bag").mp, 300, "three pulses with damage, no hits");
});

test("pulses: a Regen with interval 3 is applied at tick 0 and reapplied at tick 7; its next pulse still comes at tick 9", () => {
  const regen = buff("regen", { duration: 20, pulse: { every: 3, do: [{ op: "heal", amount: 1 }] } });
  const a = arena({ party: [{ name: "A", stats: { max_hp: 100 }, hp: 50, statuses: ["regen"], abilities: ["renew"] }], enemies: [BAG], statuses: [regen], abilities: [{ ...giver("renew", "regen"), target: "self" }] });
  readyAt(a, "A", "renew", 7);
  a.to(13);
  assert.deepEqual(a.entries("heal").map((e) => e.at), [at(3), at(6), at(9), at(12)]);
});

test("pulses: a pulse on a status's last sub-tick still happens: duration 10 with interval 2 gives 5 pulses", () => {
  const regen = buff("regen", { duration: 10, pulse: { every: 2, do: [{ op: "heal", amount: 1 }] } });
  const a = arena({ party: [{ name: "A", stats: { max_hp: 100 }, hp: 50, statuses: ["regen"] }], enemies: [BAG], statuses: [regen] }).to(30);
  assert.deepEqual(a.entries("heal").map((e) => e.at), [at(2), at(4), at(6), at(8), at(10)]);
});

test("pulses: a Slowing field is a status whose pulse applies Slow to a random foe every 3 ticks", () => {
  const slow = debuff("slow", { duration: 2, stats: [{ stat: "attack_speed", flat: -30 }] });
  const field = buff("slowing_field", { pulse: { every: 3, do: [{ op: "apply", status: "slow", to: { side: "foes" } }] } });
  const a = arena({ party: [{ name: "A", statuses: ["slowing_field"] }], enemies: [{ name: "E1", stats: { max_hp: 1e6 } }, { name: "E2", stats: { max_hp: 1e6 } }], statuses: [slow, field] }).to(60);
  const gained = a.entries("status", (e) => e.status === "slow");
  assert.equal(gained.length, 20);
  assert.ok(gained.some((e) => e.unit === "e1") && gained.some((e) => e.unit === "e2"));
});

test("pulses: pulses don't crit, even from a unit with 100% crit; a status can turn crits on as a rare exception", () => {
  const plain = debuff("plain", { duration: 4, pulse: { every: 2, do: [{ op: "damage", type: "none", amount: 10 }] } });
  const sharp = debuff("sharp", { duration: 4, crit: { chance: 100, multiplier: 200 }, pulse: { every: 2, do: [{ op: "damage", type: "none", amount: 10 }] } });
  const a = arena({ party: [{ name: "A", stats: { crit_chance: 100 }, abilities: ["p", "s"] }], enemies: [BAG], statuses: [plain, sharp], abilities: [giver("p", "plain"), giver("s", "sharp")] });
  readyAt(a, "A", "p", 1);
  readyAt(a, "A", "s", 1);
  a.to(6);
  assert.deepEqual(a.hits("Bag").map((e) => [e.src, e.amount, e.crit]), [["plain", 10, false], ["sharp", 20, true], ["plain", 10, false], ["sharp", 20, true]]);
});

// ─── Stacking (7.6) ─────────────────────────────────────────────────────────

const SLOW = debuff("slow", { stats: [{ stat: "attack_speed", flat: { scale: [{ ratio: -1, stat: "magic", of: "source" }] } }] });

test("stacking: Refresh: −20 for 10 ticks, then −30 for 4: now −30 for 4; then −20 for 10: keeps −30, and the duration resets to 10", () => {
  const a = arena({
    party: [{ name: "Weak", stats: { magic: 20 }, abilities: ["s1", "s3"] }, { name: "Strong", stats: { magic: 30 }, abilities: ["s2"] }],
    enemies: [BAG], statuses: [SLOW],
    abilities: [giver("s1", "slow", { duration: 10 }), giver("s2", "slow", { duration: 4 }), giver("s3", "slow", { duration: 10 })],
  });
  readyAt(a, "Weak", "s1", 1);
  readyAt(a, "Strong", "s2", 2);
  readyAt(a, "Weak", "s3", 3);
  a.to(1);
  assert.deepEqual([a.unit("Bag").stats.attack_speed, a.has("Bag", "slow")[0].end], [-20, at(11)]);
  a.to(2);
  assert.deepEqual([a.unit("Bag").stats.attack_speed, a.has("Bag", "slow")[0].end], [-30, at(6)]);
  a.to(3);
  assert.deepEqual([a.unit("Bag").stats.attack_speed, a.has("Bag", "slow")[0].end], [-30, at(13)]);
  assert.equal(a.has("Bag", "slow").length, 1, "a unit holds one copy of each status, whoever applied it");
});

test("stacking: a Fizzle status reapplied while present fails, with nothing shown", () => {
  const ward = buff("ward", { stacking: "fizzle", duration: 10, stats: [{ stat: "armor", flat: 5 }] });
  const a = arena({ party: [{ name: "A", abilities: ["w1", "w2"] }], enemies: [BAG], statuses: [ward], abilities: [{ ...giver("w1", "ward"), target: "self" }, { ...giver("w2", "ward", { duration: 30 }), target: "self" }] });
  readyAt(a, "A", "w1", 1);
  readyAt(a, "A", "w2", 2);
  a.to(3);
  assert.equal(a.entries("status").length, 1);
  assert.equal(a.has("A", "ward")[0].end, at(11));
});

test("stacking: two different statuses never stack, but their effects add: two slows both apply, and Haste +50 and Slow −50 net to 0", () => {
  const s1 = debuff("slow_a", { stats: [{ stat: "attack_speed", flat: -20 }] }), s2 = debuff("slow_b", { stats: [{ stat: "attack_speed", flat: -20 }] });
  const haste = buff("haste", { stats: [{ stat: "attack_speed", flat: 50 }] }), slow = debuff("slow", { stats: [{ stat: "attack_speed", flat: -50 }] });
  const a = arena({ party: [{ name: "A", statuses: ["slow_a", "slow_b"] }, { name: "B", statuses: ["haste", "slow"] }], enemies: [BAG], statuses: [s1, s2, haste, slow] });
  assert.equal(a.unit("A").stats.attack_speed, -40);
  assert.equal(a.unit("B").stats.attack_speed, 0);
});

test("stacking: three hits applying a Refresh status refresh it three times; an Intensity total has a cap, and stacks beyond it are lost", () => {
  const mark = debuff("mark", { duration: 5, stats: [{ stat: "aggro", flat: 1 }] });
  const capped = { ...ARMOR_BREAK, cap: 5 };
  const a = arena({ party: [{ name: "A", weapon: { ...weapons.dagger, hits: 3, amount: 0, apply: [{ status: "mark" }, { status: "armor_break", stacks: 2 }] } }], enemies: [BAG], statuses: [mark, capped] }).to(8);
  assert.equal(a.entries("status", (e) => e.status === "mark").length, 3);
  assert.equal(a.has("Bag", "armor_break")[0].stacks, 5000);
});

// ─── Intensity triggers (7.7) ───────────────────────────────────────────────

test("intensity: Shock deals damage to its holder per stack when the holder basic attacks, on the next sub-tick, then halves", () => {
  const shock = debuff("shock", { stacking: "intensity", trigger: { on: { event: "action_resolve", kind: "basic" }, do: [{ op: "damage", type: "none", amount: 1, to: "holder" }] }, drop: { fraction: 0.5 } });
  const a = arena({ party: [{ name: "A", stats: { max_hp: 1e6 }, weapon: weapons.dagger }], enemies: [{ name: "Foe", abilities: ["zap"] }], statuses: [shock], abilities: [giver("zap", "shock", { stacks: 10 })] });
  readyAt(a, "Foe", "zap", 1);
  a.to(17);
  assert.deepEqual(a.hits("A").map((e) => [e.at, e.amount]), [[at(8) + 1, 10], [at(16) + 1, 5]]);
});

test("intensity: a Mark for execute (+10% damage taken per stack, gone when hit) on a target struck by a three-hit attack applies only to the first hit", () => {
  const mark = debuff("execute_mark", { stacking: "intensity", taken: [{ pct: 10 }], trigger: { on: { event: "hit_taken" } }, drop: "all" });
  const b = arena({ party: [{ name: "A", weapon: { ...weapons.dagger, hits: 3, amount: 10 }, abilities: ["m"] }], enemies: [BAG], statuses: [mark], abilities: [giver("m", "execute_mark", { stacks: 5 })] });
  readyAt(b, "A", "m", 1);
  b.to(8);
  assert.deepEqual(b.hits("Bag").map((e) => e.amount), [15, 10, 10]);
});

test("intensity: Aegis with 2 stacks blocks the next 2 hits, whether from one multi-hit action or different attackers; charges are stacks that drop by one", () => {
  const aegis = buff("aegis", { stacking: "intensity", stats: [{ stat: "immune:damage", flat: 1 }], trigger: { on: { event: "hit_taken" } }, drop: { count: 1 } });
  const one = arena({ party: [{ name: "A", stats: { max_hp: 1e6 }, abilities: ["shield"] }], enemies: [{ name: "Foe", weapon: { ...weapons.dagger, hits: 3, amount: 10 } }], statuses: [aegis], abilities: [{ ...giver("shield", "aegis", { stacks: 2 }), target: "self" }] });
  readyAt(one, "A", "shield", 1);
  one.to(8);
  assert.deepEqual(one.hits("A").map((e) => [e.amount, e.word]), [[0, "IMMUNE"], [0, "IMMUNE"], [10, null]]);
  const two = arena({
    party: [{ name: "A", stats: { max_hp: 1e6 }, abilities: ["shield"] }],
    enemies: [{ name: "F1", weapon: { ...weapons.dagger, amount: 10 } }, { name: "F2", weapon: { ...weapons.dagger, amount: 10 } }],
    statuses: [aegis], abilities: [{ ...giver("shield", "aegis", { stacks: 1 }), target: "self" }],
  });
  readyAt(two, "A", "shield", 1);
  two.to(8);
  assert.deepEqual(two.hits("A").map((e) => [e.by, e.amount]), [["e1", 0], ["e2", 10]]);
});

test("intensity: Empower next attack is a boost scaled by stacks, cleared when the holder next attacks", () => {
  const empower = buff("empower", { stacking: "intensity", boosts: [{ tag: "basic", pct: 25 }], trigger: { on: { event: "action_resolve", kind: "basic" } }, drop: "all" });
  const a = arena({ party: [{ name: "A", weapon: { ...weapons.dagger, amount: 20 }, abilities: ["pump"] }], enemies: [BAG], statuses: [empower], abilities: [{ ...giver("pump", "empower", { stacks: 2 }), target: "self" }] });
  readyAt(a, "A", "pump", 1);
  a.to(16);
  assert.deepEqual(a.hits("Bag").map((e) => e.amount), [30, 20]);
});

test("intensity: Sleep is a stun whose stacks go to 0 when the holder takes damage", () => {
  const sleep = debuff("sleep", { stacking: "intensity", lockout: { covers: "all", interrupt: true }, trigger: { on: { event: "damage_taken" } }, drop: "all" });
  const poke = { id: "poke", cast: 0, cooldown: 1000, do: [{ op: "damage", type: "physical", subtype: "blunt", amount: 1 }] };
  const a = arena({ party: [{ name: "A", abilities: ["lull", "poke"] }], enemies: [{ name: "Foe", stats: { max_hp: 1e6 }, weapon: weapons.dagger }], statuses: [sleep], abilities: [giver("lull", "sleep"), poke] });
  readyAt(a, "A", "lull", 1);
  readyAt(a, "A", "poke", 20);
  a.to(30);
  assert.deepEqual(a.acts("Foe"), [20.001, 28.001]);
});

// ─── Sources and auras (7.6, 7.8) ───────────────────────────────────────────

test("per source: two Paladins each give a permanent aura that ends with its giver; when one is KO'd its copy ends and the other's stays", () => {
  const aura = buff("aura", { perSource: { endsWithSource: true }, stats: [{ stat: "attack", flat: 5 }] });
  const giverStatus = buff("aura_giver", { show: "sheet", reactions: [{ on: { event: "fight_start" }, do: [{ op: "apply", status: "aura", to: { side: "allies", pick: "all" } }] }] });
  const a = arena({
    party: [{ name: "Fighter", stats: { attack: 10, max_hp: 1e6 } }, { name: "Pal1", stats: { max_hp: 10, aggro: 1e6 }, statuses: ["aura_giver"] }, { name: "Pal2", stats: { max_hp: 1e6, aggro: 1 }, statuses: ["aura_giver"] }],
    enemies: [{ name: "Foe", stats: { max_hp: 1e6, attack: 100 }, weapon: weapons.dagger }],
    statuses: [aura, giverStatus],
  }).to(1);
  assert.equal(a.has("Fighter", "aura").length, 2);
  assert.equal(a.unit("Fighter").stats.attack, 20);
  a.to(8);
  assert.ok(a.unit("Pal1").ko);
  assert.deepEqual(a.has("Fighter", "aura").map((s) => s.src), ["p3"]);
  assert.equal(a.unit("Fighter").stats.attack, 15);
  assert.equal(a.entries("status_end", (e) => e.status === "aura" && e.unit === "p1")[0].cause, "ko");
});

test("per source: a mark that heals its applier when the holder is hit: each applier's reaction heals that applier", () => {
  const leech = debuff("leech", { perSource: {}, reactions: [{ on: { event: "hit_taken" }, actor: "source", do: [{ op: "heal", amount: 5, to: "source" }] }] });
  const a = arena({
    party: [{ name: "Witch", stats: { max_hp: 100 }, hp: 50, abilities: ["mark"] }, { name: "Hag", stats: { max_hp: 100 }, hp: 50, abilities: ["mark"] }, { name: "Fighter", weapon: weapons.dagger }],
    enemies: [BAG], statuses: [leech], abilities: [giver("mark", "leech")],
  });
  readyAt(a, "Witch", "mark", 1);
  readyAt(a, "Hag", "mark", 1);
  a.to(9);
  assert.equal(a.has("Bag", "leech").length, 2);
  assert.deepEqual(a.entries("heal").map((e) => [e.at, e.target]), [[at(8) + 1, "p1"], [at(8) + 1, "p2"]]);
});

// ─── Duration and removal (7.8, 7.9) ────────────────────────────────────────

test("duration: a status lasting 10 ticks affects everything that resolves up to and including its 10th tick", () => {
  const plate = buff("plate", { duration: 10, stats: [{ stat: "armor", flat: 100 }] });
  const a = arena({ party: [{ name: "A", stats: { max_hp: 1e6 }, statuses: ["plate"] }], enemies: [{ name: "F1", weapon: { ...weapons.dagger, cooldown: 10, amount: 10 } }, { name: "F2", weapon: { ...weapons.dagger, cooldown: 10.001, amount: 10 } }], statuses: [plate] }).to(11);
  assert.deepEqual(a.hits("A").map((e) => [e.at, e.word]), [[at(10), "BLOCKED"], [at(10) + 1, null]]);
});

test("removal: a cleanse that removes one debuff takes the newest; it can narrow to an effect kind; unremovable statuses stay", () => {
  const poison = debuff("poison", { stats: [{ stat: "armor", flat: -1 }] }), curse = debuff("curse", { unremovable: true, stats: [{ stat: "armor", flat: -1 }] });
  const cleanse = { id: "cleanse", cast: 0, cooldown: 1000, target: "self", do: [{ op: "remove", label: "debuff", count: 1 }] };
  const unstun = { id: "unstun", cast: 0, cooldown: 1000, target: "self", do: [{ op: "remove", label: "debuff", kind: "lockout" }] };
  const purge = { id: "purge", cast: 0, cooldown: 1000, target: "self", do: [{ op: "remove", label: "debuff" }] };
  const a = arena({ party: [{ name: "A", statuses: ["curse", "poison", "stun_long"], abilities: ["cleanse", "unstun", "purge"] }], enemies: [BAG], statuses: [poison, curse, { ...STUN, id: "stun_long", duration: undefined, lockout: { covers: "basic", interrupt: true } }], abilities: [cleanse, unstun, purge] });
  readyAt(a, "A", "cleanse", 1);
  a.to(1);
  assert.deepEqual(a.unit("A").statuses.map((s) => s.id).filter((s) => s !== "mp_regen"), ["curse", "poison"]);
  const b = arena({ party: [{ name: "A", statuses: ["curse", "poison", "stun_long"], abilities: ["unstun", "purge"] }], enemies: [BAG], statuses: [poison, curse, { ...STUN, id: "stun_long", duration: undefined, lockout: { covers: "basic", interrupt: true } }], abilities: [unstun, purge] });
  readyAt(b, "A", "unstun", 1);
  readyAt(b, "A", "purge", 2);
  b.to(1);
  assert.deepEqual(b.unit("A").statuses.map((s) => s.id), ["curse", "poison"]);
  b.to(2);
  assert.deepEqual(b.unit("A").statuses.map((s) => s.id), ["curse"]);
});

test("KO: a KO'd unit's own statuses end, except those flagged to survive a KO; statuses it applied to others stay", () => {
  const mark = debuff("mark", { stats: [{ stat: "aggro", flat: 1 }] }), oath = buff("oath", { survivesKO: true, stats: [{ stat: "armor", flat: 1 }] }), vigor = buff("vigor", { stats: [{ stat: "armor", flat: 1 }] });
  const a = arena({ party: [{ name: "Mage", stats: { max_hp: 10, aggro: 1e6 }, statuses: ["oath", "vigor"], abilities: ["m"] }, { name: "Tank", stats: { max_hp: 1e6 } }], enemies: [{ name: "Foe", stats: { max_hp: 1e6, attack: 100 }, weapon: weapons.dagger }], statuses: [mark, oath, vigor], abilities: [giver("m", "mark")] });
  readyAt(a, "Mage", "m", 1);
  a.to(8);
  assert.ok(a.unit("Mage").ko);
  assert.deepEqual(a.unit("Mage").statuses.map((s) => s.id), ["oath"]);
  assert.equal(a.has("Foe", "mark").length, 1);
});

// ─── Conditions and targeting (7.10) ────────────────────────────────────────

test("conditions: an ability with condition 'an ally has a lockout covering all actions' starts only while an ally is stunned", () => {
  const rescue = { id: "rescue", cast: 0, cooldown: 1, if: { side: "others", where: { kind: { kind: "lockout", tag: "all" } } }, target: { side: "others", where: { kind: { kind: "lockout" } } }, do: [{ op: "remove", label: "debuff", kind: "lockout" }] };
  const a = arena({ party: [{ name: "Cleric", abilities: ["rescue"] }, { name: "Knight" }], enemies: [{ name: "Foe", abilities: ["bash"] }], statuses: [STUN], abilities: [rescue, giver("bash", "stun")] });
  readyAt(a, "Foe", "bash", 10);
  a.to(9);
  assert.equal(a.acts("Cleric").length, 0);
  a.to(11);
  assert.deepEqual(a.acts("Cleric"), [10.001]);
  assert.equal(a.has("Knight", "stun").length, 0);
});

test("targeting: rules can read statuses: 'a foe without Burn', 'the ally with the most debuffs'", () => {
  const ignite = { id: "ignite", cast: 0, cooldown: 1, target: { side: "foes", where: { lacks: "burn" } }, do: [{ op: "apply", status: "burn", stacks: 100 }] };
  const a = arena({ party: [{ name: "Mage", abilities: ["ignite"] }], enemies: [{ name: "E1", stats: { max_hp: 1e6 } }, { name: "E2", stats: { max_hp: 1e6 } }, { name: "E3", stats: { max_hp: 1e6 } }], statuses: [BURN], abilities: [ignite] }).to(3);
  assert.deepEqual(a.entries("status").map((e) => e.unit).sort(), ["e1", "e2", "e3"]);
  const d1 = debuff("d1", { stats: [{ stat: "armor", flat: -1 }] }), d2 = debuff("d2", { stats: [{ stat: "armor", flat: -1 }] });
  const purify = { id: "purify", cast: 0, cooldown: 5, target: { side: "allies", pick: "highest", by: "debuffs" }, do: [{ op: "remove", label: "debuff", count: 1 }] };
  const b = arena({ party: [{ name: "Cleric", abilities: ["purify"] }, { name: "A", statuses: ["d1"] }, { name: "B", statuses: ["d1", "d2"] }], enemies: [BAG], statuses: [d1, d2], abilities: [purify] }).to(5);
  assert.deepEqual(b.unit("B").statuses.map((s) => s.id).filter((s) => s !== "mp_regen"), ["d1"]);
});

// ─── Events and reactions (7.11, 8) ─────────────────────────────────────────

test("reactions: a hit triggers a reaction that deals damage back on the next sub-tick, never the same one; it isn't a hit", () => {
  const thorns = buff("spikes", { show: "sheet", reactions: [{ on: { event: "hit_taken" }, do: [{ op: "damage", type: "physical", subtype: "pierce", amount: 4, to: "other" }] }] });
  const a = arena({ party: [{ name: "A", stats: { max_hp: 1e6 }, statuses: ["spikes"] }], enemies: [{ name: "Foe", stats: { max_hp: 1e6, armor: 1 }, weapon: weapons.dagger, statuses: ["spikes"] }], statuses: [thorns] }).to(9);
  assert.deepEqual(a.hits("Foe").map((e) => [e.at, e.part, e.amount]), [[at(8) + 1, "reaction", 3]]);
  assert.equal(a.hits("A").length, 1, "the reflected damage isn't a hit, so the Foe's own spikes don't answer it");
});

test("reactions: a status can react to its holder's own actions: 'take 10 damage when basic attacking'", () => {
  const reckless = debuff("reckless", { reactions: [{ on: { event: "action_resolve", kind: "basic" }, do: [{ op: "damage", type: "none", amount: 10, to: "holder" }] }] });
  const a = arena({ party: [{ name: "A", stats: { max_hp: 100 }, weapon: weapons.dagger, statuses: ["reckless"] }], enemies: [BAG], statuses: [reckless] }).to(17);
  assert.deepEqual(a.hits("A").map((e) => [e.at, e.amount]), [[at(8) + 1, 10], [at(16) + 1, 10]]);
});

test("reactions: a reaction whose acting unit is KO'd before it resolves is lost", () => {
  const vengeance = buff("vengeance", { show: "sheet", reactions: [{ on: { event: "hit_taken" }, do: [{ op: "damage", type: "none", amount: 50, to: "other" }] }] });
  const a = arena({ party: [{ name: "A", stats: { max_hp: 5 }, statuses: ["vengeance"] }, { name: "B", stats: { max_hp: 1e6, forbidden: 1 } }], enemies: [{ name: "Foe", stats: { max_hp: 1e6, attack: 100 }, weapon: weapons.dagger }], statuses: [vengeance] }).to(9);
  assert.ok(a.unit("A").ko);
  assert.equal(a.hits("Foe").length, 0);
});

test("reactions: Doom reacts to its own ending when the cause is expiry, dealing damage to its holder; removed early, it does nothing", () => {
  const doom = debuff("doom", { duration: 5, reactions: [{ on: { event: "status_ended", status: "doom", cause: ["expired"] }, do: [{ op: "damage", type: "none", amount: 50, to: "holder" }] }] });
  const cure = { id: "cure", cast: 0, cooldown: 1000, target: "self", do: [{ op: "remove", label: "debuff", status: "doom" }] };
  const a = arena({ party: [{ name: "A", stats: { max_hp: 100 }, statuses: ["doom"] }], enemies: [BAG], statuses: [doom] }).to(6);
  assert.deepEqual(a.hits("A").map((e) => [e.at, e.amount]), [[at(5) + 1, 50]]);
  const b = arena({ party: [{ name: "A", stats: { max_hp: 100 }, statuses: ["doom"], abilities: ["cure"] }], enemies: [BAG], statuses: [doom], abilities: [cure] });
  readyAt(b, "A", "cure", 2);
  b.to(10);
  assert.equal(b.hits("A").length, 0);
  assert.equal(b.entries("status_end")[0].cause, "removed");
});

test("reactions: statuses never consume each other by rule; content does it: 'when this unit gains Burn, remove Freeze'", () => {
  const freeze = debuff("freeze", { stats: [{ stat: "attack_speed", flat: -50 }] });
  const thaw = buff("thaw", { show: "sheet", reactions: [{ on: { event: "status_gained", status: "burn" }, do: [{ op: "remove", label: "debuff", status: "freeze", to: "holder" }] }] });
  const a = arena({ party: [{ name: "Mage", abilities: ["kindle"] }], enemies: [{ ...BAG, statuses: ["freeze", "thaw"] }], statuses: [BURN, freeze, thaw], abilities: [giver("kindle", "burn", { stacks: 4 })] });
  readyAt(a, "Mage", "kindle", 1);
  a.to(1);
  assert.equal(a.has("Bag", "freeze").length, 1, "both present on the sub-tick Burn lands");
  a.to(2);
  assert.equal(a.has("Bag", "freeze").length, 0);
});

test("reactions: a status can listen to its holder's allies and foes: a wolf turns rabid when a packmate falls", () => {
  const rabid = buff("rabid", { stacking: "intensity", stats: [{ stat: "attack_speed", flat: 25 }] });
  const fury = buff("pack_fury", { show: "sheet", reactions: [{ on: { event: "ko", whose: "ally" }, do: [{ op: "apply", status: "rabid", to: "holder" }] }] });
  const a = arena({ party: [{ name: "Hunter", stats: { attack: 100 }, weapon: weapons.dagger }], enemies: [{ name: "W1", stats: { max_hp: 10, aggro: 1e6 }, statuses: ["pack_fury"] }, { name: "W2", stats: { max_hp: 1e6 }, statuses: ["pack_fury"] }], statuses: [rabid, fury] }).to(9);
  assert.equal(a.unit("W2").stats.attack_speed, 25);
  assert.equal(a.has("W1", "rabid").length, 0);
});

// ─── Stats that bring statuses (7.1) ────────────────────────────────────────

test("stats: a buff that raises MP regen from 0 brings the status MP regen needs, and the unit starts restoring MP; at 0 again it loses it", () => {
  const focus = buff("focus", { duration: 10, stats: [{ stat: "mp_regen", flat: 3 }] });
  const a = arena({ party: [{ name: "A", stats: { max_mp: 100 }, mp: 0, abilities: ["f"] }], enemies: [BAG], statuses: [focus], abilities: [{ ...giver("f", "focus"), target: "self" }] });
  assert.equal(a.has("A", "mp_regen").length, 0);
  readyAt(a, "A", "f", 1);
  a.to(1);
  assert.equal(a.has("A", "mp_regen").length, 1);
  a.to(30);
  assert.equal(a.unit("A").mp, 6, "pulses every 5 ticks at 6 and 11");
  assert.equal(a.has("A", "mp_regen").length, 0);
});

test("stats: a unit holds the status a stat brings while the stat is above 0, so a dispel can't strip it for good", () => {
  const regen = buff("mp_regen", { show: "stat", pulse: { every: 5, do: [{ op: "mp", amount: { scale: [{ ratio: 1, stat: "mp_regen", of: "holder" }] } }] } });
  const dispel = { id: "dispel", cast: 0, cooldown: 1000, do: [{ op: "remove", label: "buff" }] };
  const a = arena({ party: [{ name: "A", stats: { max_mp: 100, mp_regen: 2 }, mp: 0 }], enemies: [{ name: "Foe", abilities: ["dispel"] }], statuses: [regen], abilities: [dispel] });
  readyAt(a, "Foe", "dispel", 1);
  a.to(1);
  assert.deepEqual(a.entries("status_end").map((e) => [e.status, e.cause]), [["mp_regen", "removed"]]);
  assert.equal(a.has("A", "mp_regen").length, 1);
  assert.equal(a.has("A", "mp_regen")[0].at, at(1), "a fresh copy, with a fresh rhythm");
});

// ─── What the player sees (section 10) ──────────────────────────────────────

test("display: each status declares its presentation; icon statuses show in the fight, sheet and stat ones don't; IMMUNE shows, a failed chance roll doesn't", () => {
  const icon = debuff("poison", { duration: 4, pulse: { every: 2, do: [{ op: "damage", type: "none", amount: 3 }] } }), sheet = debuff("hex", { show: "sheet", duration: 4, stats: [{ stat: "armor", flat: -1 }] });
  const a = arena({
    party: [{ name: "A", stats: { max_mp: 10, mp_regen: 1 }, abilities: ["p", "h", "s", "miss"] }],
    enemies: [{ name: "T", stats: { max_hp: 1e6, "immune:status:stun": 1 } }], statuses: [icon, sheet, STUN],
    abilities: [giver("p", "poison"), giver("h", "hex"), giver("s", "stun"), giver("miss", "hex", { chance: 0.0001 })],
  });
  for (const x of ["p", "h", "s", "miss"]) readyAt(a, "A", x, 1);
  a.to(6);
  const seen = a.log.filter((e) => e.vis === "player").map((e) => `${e.t}:${e.status ?? e.src ?? ""}`);
  assert.ok(seen.includes("status:poison") && seen.includes("status_end:poison") && seen.includes("dmg:poison"));
  assert.ok(!seen.includes("status:hex") && !seen.includes("status:mp_regen"));
  assert.ok(seen.includes("immune:stun"));
  assert.equal(a.entries("status", (e) => e.status === "hex").length, 1, "only the guaranteed hex; the failed roll shows nothing");
});
