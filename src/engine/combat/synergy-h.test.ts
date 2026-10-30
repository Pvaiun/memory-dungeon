/**
 * Step 5i's engine additions, share H ("what happens"): X21 to X41 and R4 of
 * steps/05-core-set/5i-synergy/build/engine-spec.md, each with at least the spec's own test.
 * Every status and ability a test needs is defined here, so nothing waits for content.
 */
import { test } from "vitest";
import assert from "node:assert/strict";
import { arena, weapons } from "./arena.js";
import { combat, type Member } from "./rules.js";
import { advanceOnce, loadContent, newRun, type Content } from "../run.js";
import { checkParty, validatePack } from "../../validate.js";
import * as S from "../../schema.js";
import hollow from "../../../fixtures/hollow.pack.json" with { type: "json" };
import fixtureParty from "../../../fixtures/party.json" with { type: "json" };

const at = (ticks: number) => Math.round(ticks * 1000);
const BAG = { name: "Bag", stats: { max_hp: 1_000_000 } };
const buff = (id: string, x: object = {}) => ({ id, name: id.toUpperCase(), label: "buff", show: "icon", stacking: "refresh", ...x });
const debuff = (id: string, x: object = {}) => buff(id, { label: "debuff", ...x });
/** An Intensity counter with no cap: its stacks show an amount a reaction passed on. */
const tally = (id: string) => buff(id, { stacking: "intensity" });
const byAmount = { scale: [{ ratio: 1, amount: true }] };
/** A test device: no wind-up, no recovery, a long cooldown; `readyAt` says when it goes. */
const device = (id: string, x: object) => ({ id, cast: 0, recovery: 0, cooldown: 1000, ...x });
const readyAt = (a: ReturnType<typeof arena>, unit: string, ability: string, tick: number) => {
  a.unit(unit).acts.find((x) => x.id === ability)!.ready = at(tick);
};
const stacks = (a: ReturnType<typeof arena>, unit: string, status: string) => a.has(unit, status).reduce((s, x) => s + x.stacks, 0) / 1000;
const NEVER = { side: "foes", where: { ko: true } };
const TAUNT = { forced: 1 };
const swing = (attack: number, w: S.WeaponT = weapons.sword) => ({ stats: { attack, max_hp: 1e6 }, weapon: w });

// ─── X21: cooldown and timer changes ────────────────────────────────────────

test("X21: at tick 10 a unit whose Fireball has 20 ticks left gets 5 ticks off its longest cooldown, and casts at 25, not 30", () => {
  const fireball = device("fireball", { do: [{ op: "damage", type: "magical", amount: 1 }] });
  const chime = device("chime", { target: "self", do: [{ op: "cooldown", which: "longest", set: { less: 5 }, to: { side: "others" } }] });
  const play = (bell: boolean) => {
    const a = arena({ party: [{ name: "Mage", abilities: ["fireball"] }, { name: "Bell", abilities: bell ? ["chime"] : [] }], enemies: [BAG], abilities: [fireball, chime] });
    readyAt(a, "Mage", "fireball", 30);
    if (bell) readyAt(a, "Bell", "chime", 10);
    return a.to(40).acts("Mage", "fireball");
  };
  assert.deepEqual(play(false), [30]);
  assert.deepEqual(play(true), [25]);
});

test("X21: `which: basic, set: ready` makes a unit swing on the next sub-tick", () => {
  const horn = device("horn", { target: "self", do: [{ op: "cooldown", which: "basic", set: "ready", to: { side: "others" } }] });
  const a = arena({ party: [{ name: "Axe", ...swing(10, weapons.axe) }, { name: "Horn", abilities: ["horn"] }], enemies: [BAG], abilities: [horn] });
  readyAt(a, "Horn", "horn", 5);
  assert.deepEqual(a.to(30).acts("Axe", "basic"), [5.001, 25.001], "it swings at once, then its swing runs again from there");
});

test("X21: soonest, every ability, a share of what's left, at most a share of the full cooldown, full, and by id with its forms", () => {
  // T's two abilities never come off cooldown by themselves (they wait for a fallen foe), so only the effect moves them.
  const x = { id: "x", cooldown: 40, if: NEVER, do: [{ op: "damage", type: "physical", amount: 1 }] };
  const y = { id: "y__a", cooldown: 60, if: NEVER, do: [{ op: "damage", type: "physical", amount: 1 }] };
  const left = (which: unknown, set: unknown) => {
    const bell = device("bell", { target: "self", do: [{ op: "cooldown", which, set, to: { side: "others" } }] });
    const a = arena({ party: [{ name: "T", abilities: ["x", "y__a"] }, { name: "Bell", abilities: ["bell"] }], enemies: [BAG], abilities: [x, y, bell] });
    readyAt(a, "T", "x", 20);
    readyAt(a, "T", "y__a", 40);
    readyAt(a, "Bell", "bell", 10);
    a.to(10);
    return a.unit("T").acts.slice(0, 2).map((q) => q.ready / 1000 - 10);
  };
  assert.deepEqual(left("soonest", { less: 4 }), [6, 30]);
  assert.deepEqual(left("longest", "ready"), [10, 0]);
  assert.deepEqual(left("abilities", { times: 50 }), [5, 15]);
  assert.deepEqual(left("abilities", { atMost: 25 }), [10, 15], "at most a quarter of 40 and of 60");
  assert.deepEqual(left("abilities", "full"), [40, 60]);
  assert.deepEqual(left({ ability: ["y"] }, "ready"), [10, 0], "y's trained form is reached by its base id");
});

test("X21: `which: event` in a reaction to an action readies the ability that set it off", () => {
  const zap = device("zap", { cooldown: 50, do: [{ op: "damage", type: "physical", amount: 1 }] });
  const again = buff("again", { reactions: [{ on: { event: "action_resolve", kind: "ability" }, do: [{ op: "cooldown", which: "event", set: "ready", to: "self" }] }] });
  const a = arena({ party: [{ name: "Z", abilities: ["zap"], statuses: ["again"] }], enemies: [BAG], abilities: [zap], statuses: [again] });
  readyAt(a, "Z", "zap", 10);
  assert.deepEqual(a.to(10.003).acts("Z", "zap"), [10, 10.002]);
});

// ─── X22: MP cost changes ───────────────────────────────────────────────────

const BOLT = device("bolt", { mp: 400, do: [{ op: "damage", type: "magical", amount: 1 }] });
function cast(mods: unknown[], mp: number, maxMp = 1000) {
  const a = arena({ party: [{ name: "Mage", stats: { max_mp: maxMp }, mp, abilities: ["bolt"], statuses: ["mod"] }], enemies: [BAG], abilities: [BOLT], statuses: [buff("mod", { mods })] });
  readyAt(a, "Mage", "bolt", 1);
  a.to(2);
  return { casts: a.acts("Mage", "bolt").length, mp: a.unit("Mage").mp, a };
}

test("X22: a 400 MP ability with a −20 change costs 320; with −100 it casts at 0 MP; a change for other abilities leaves it at 400", () => {
  assert.deepEqual([cast([{ mp: -20 }], 320).casts, cast([{ mp: -20 }], 320).mp], [1, 0]);
  assert.equal(cast([{ mp: -20 }], 319).casts, 0, "it waits for 320");
  assert.deepEqual([cast([{ mp: -100 }], 0).casts, cast([{ mp: -100 }], 0).mp], [1, 0]);
  assert.equal(cast([{ mp: -50 }, { mp: -60 }], 0).casts, 1, "changes add, and the cost never falls below 0");
  assert.equal(cast([{ mp: -20, of: { ability: ["other"] } }], 320).casts, 0);
  assert.equal(cast([{ mp: 50 }], 1000).mp, 400, "+50 is half again: 600");
});

test("X22: Brimming's change holds while its holder is above half its MP: 300 at 60%, 400 at 40%", () => {
  const brim = [{ mp: -25, if: { mpAtLeast: 50 } }];
  assert.equal(cast(brim, 600).mp, 300);
  assert.equal(cast(brim, 400).mp, 0);
});

// ─── X23: HP as a price ─────────────────────────────────────────────────────

test("X23: a unit at 1,000 HP behind a Shield pays 400: HP 600, Shield untouched, nothing reacts; paying 2,000 leaves 1", () => {
  const shield = buff("shield", { stacking: "intensity", absorb: true });
  const hurt = buff("hurt", { reactions: [{ on: { event: "hp_lost" }, do: [{ op: "apply", status: "felt", to: "holder" }] }, { on: { event: "damage_taken" }, do: [{ op: "apply", status: "felt", to: "holder" }] }] });
  const run = (hp: number) => {
    const price = device("price", { target: "self", do: [{ op: "apply", status: "shield", stacks: 500, to: "self" }, { op: "pay", hp, to: "self" }] });
    const a = arena({ party: [{ name: "P", stats: { max_hp: 5000 }, hp: 1000, abilities: ["price"], statuses: ["hurt"] }], enemies: [BAG], abilities: [price], statuses: [shield, hurt, buff("felt")] });
    readyAt(a, "P", "price", 1);
    return a.to(3);
  };
  const a = run(400);
  assert.equal(a.unit("P").hp, 600);
  assert.equal(stacks(a, "P", "shield"), 500);
  assert.equal(a.has("P", "felt").length, 0, "no hp_lost, no damage taken");
  assert.equal(a.entries("dmg").length, 0);
  assert.equal(run(2000).unit("P").hp, 1);
});

test("X23: an ability's HP price, point for point or as a share, paid with its MP; the floor makes it wait", () => {
  const price = (hp: object, startHp: number) => {
    const a = arena({ party: [{ name: "P", stats: { max_hp: 5000, max_mp: 1000 }, hp: startHp, abilities: ["bolt"], statuses: ["mod"] }], enemies: [BAG], abilities: [BOLT], statuses: [buff("mod", { mods: [{ hp }] })] });
    readyAt(a, "P", "bolt", 1);
    a.to(2);
    return { hp: a.unit("P").hp, mp: a.unit("P").mp, casts: a.acts("P", "bolt").length };
  };
  assert.deepEqual(price({ pct: 100 }, 5000), { hp: 4600, mp: 600, casts: 1 }, "Blood vial: as many HP as MP");
  assert.deepEqual(price({ pct: 100, share: true }, 5000), { hp: 3000, mp: 600, casts: 1 }, "40% of max MP is 40% of max HP");
  assert.deepEqual(price({ pct: 100, share: true, floor: 10 }, 2500), { hp: 500, mp: 600, casts: 1 }, "it may go down to the floor");
  assert.equal(price({ pct: 100, share: true, floor: 10 }, 2499).casts, 0, "it waits rather than go below a tenth");
});

// ─── X24: abilities changed by what they do, or by name ─────────────────────

test("X24: a Smite with Chains of light Silences its target, a trained Smite too; another ability doesn't", () => {
  const silence = debuff("silence", { duration: 20, lockout: { covers: "ability", interrupt: true } });
  const chains = buff("chains", { mods: [{ of: { ability: ["smite"] }, apply: [{ status: "silence" }] }] });
  const hitWith = (ability: string) => {
    const ab = device(ability, { do: [{ op: "damage", type: "magical", amount: 10 }] });
    const a = arena({ party: [{ name: "P", abilities: [ability], statuses: ["chains"] }], enemies: [BAG], abilities: [ab], statuses: [silence, chains] });
    readyAt(a, "P", ability, 1);
    return a.to(1).has("Bag", "silence").length;
  };
  assert.equal(hitWith("smite"), 1);
  assert.equal(hitWith("smite__a"), 1);
  assert.equal(hitWith("jab"), 0);
});

test("X24: a revive with Reliquary of mercy winds up in 1 tick; a Firebolt with Banked staff adds 15 Burn where it added 10", () => {
  const raise = { id: "raise", cast: 10, recovery: 0, cooldown: 1000, if: { side: "allies", where: { ko: true } }, target: { side: "allies", where: { ko: true } }, do: [{ op: "revive", hp: 100 }] };
  const reliquary = buff("reliquary", { mods: [{ of: { does: ["revive"] }, cast: 1 }] });
  const a = arena({ party: [{ name: "C", abilities: ["raise"], statuses: ["reliquary"] }, { name: "Down", ko: true }], enemies: [BAG], abilities: [raise], statuses: [reliquary] });
  readyAt(a, "C", "raise", 1);
  a.to(3);
  assert.deepEqual(a.entries("cast").map((e) => e.ends), [at(2)]);
  assert.deepEqual(a.entries("revive").map((e) => e.at), [at(2)]);

  const burn = debuff("burn", { stacking: "intensity" });
  const firebolt = device("firebolt", { do: [{ op: "damage", type: "magical", amount: 1, apply: [{ status: "burn", stacks: 10 }] }] });
  const banked = buff("banked", { mods: [{ stacks: { pct: 50, statuses: ["burn"] } }] });
  const burnFrom = (st: string[]) => {
    const b = arena({ party: [{ name: "P", abilities: ["firebolt"], statuses: st }], enemies: [BAG], abilities: [firebolt], statuses: [burn, banked] });
    readyAt(b, "P", "firebolt", 1);
    return stacks(b.to(1), "Bag", "burn");
  };
  assert.equal(burnFrom([]), 10);
  assert.equal(burnFrom(["banked"]), 15);
});

test("X24: a change's own target rule and Seek (past a Taunt), what it waits for, and its heals", () => {
  const shot = device("shot", { do: [{ op: "damage", type: "physical", amount: 1 }] });
  const quiver = (seek: boolean) => buff("quiver", { mods: [{ target: { side: "foes", pick: "lowest", by: "hp" }, ...(seek ? { seek: true } : {}) }] });
  const shoot = (seek: boolean) => {
    const a = arena({ party: [{ name: "P", abilities: ["shot"], statuses: ["quiver"] }], enemies: [{ name: "Wall", stats: { max_hp: 1e6, ...TAUNT } }, { name: "Weak", stats: { max_hp: 100 } }], abilities: [shot], statuses: [quiver(seek)] });
    readyAt(a, "P", "shot", 1);
    return a.to(1).entries("dmg").map((e) => a.unit(e.target as string).name);
  };
  assert.deepEqual(shoot(true), ["Weak"]);
  assert.deepEqual(shoot(false), ["Wall"], "without Seek, the Taunt rule holds");

  const kick = device("kick", { do: [{ op: "damage", type: "physical", amount: 1 }] });
  const meteor = { id: "meteor", cast: 10, recovery: 0, cooldown: 1000, do: [{ op: "damage", type: "magical", amount: 1 }] };
  const watcher = buff("watcher", { mods: [{ wait: { side: "foes", where: { casting: true } } }] });
  const w = arena({ party: [{ name: "P", abilities: ["kick"], statuses: ["watcher"] }], enemies: [{ name: "Caster", stats: { max_hp: 1e6 }, abilities: ["meteor"] }], abilities: [kick, meteor], statuses: [watcher] });
  readyAt(w, "P", "kick", 1);
  readyAt(w, "Caster", "meteor", 20);
  assert.deepEqual(w.to(25).acts("P", "kick"), [20.001]);

  const mend = device("mend", { target: { side: "others" }, do: [{ op: "heal", amount: 100 }] });
  const mantle = buff("mantle", { mods: [{ heal: 50 }] });
  const h = arena({ party: [{ name: "P", abilities: ["mend"], statuses: ["mantle"] }, { name: "Hurt", stats: { max_hp: 1000 }, hp: 500 }], enemies: [BAG], abilities: [mend], statuses: [mantle] });
  readyAt(h, "P", "mend", 1);
  assert.equal(h.to(1).unit("Hurt").hp, 650);
});

// ─── X25: crits by condition ────────────────────────────────────────────────

test("X25: with crit chance 0 every hit on a Stunned foe crits and none on another; at crit chance 50 the Stunned foe still always crits", () => {
  const stun = debuff("stun", { lockout: { covers: "all" } });
  const still = buff("still", { crits: [{ when: { has: "stun" }, chance: 100 }] });
  const run = (chance: number) => {
    const a = arena({
      party: [{ name: "P", stats: { attack: 10, crit_chance: chance }, weapon: { ...weapons.dagger, cooldown: 1 }, statuses: ["still"] }],
      enemies: [{ name: "Stunned", stats: { max_hp: 1e6 }, statuses: ["stun"] }, { name: "Free", stats: { max_hp: 1e6 } }], statuses: [stun, still],
    }).to(400);
    const on = (n: string) => a.hits(n).filter((e) => e.part === "hit");
    return { stunned: on("Stunned"), free: on("Free") };
  };
  const zero = run(0);
  assert.ok(zero.stunned.length > 100 && zero.free.length > 100);
  assert.ok(zero.stunned.every((e) => e.crit && e.amount === 15));
  assert.ok(zero.free.every((e) => !e.crit));
  const half = run(50);
  assert.ok(half.stunned.every((e) => e.crit));
  const share = half.free.filter((e) => e.crit).length / half.free.length;
  assert.ok(share > 0.4 && share < 0.6, `${share}`);
});

test("X25: a crit rule's bonus makes the part above ×1 larger (×1.5 into ×2), and its tag narrows it", () => {
  const sure = (tag: string) => buff("sure", { crits: [{ tag, chance: 100, bonus: 100 }] });
  const hitFor = (tag: string) => arena({ party: [{ name: "P", ...swing(100), statuses: ["sure"] }], enemies: [BAG], statuses: [sure(tag)] }).to(12).hits("Bag").map((e) => e.amount);
  assert.deepEqual(hitFor("basic"), [200]);
  assert.deepEqual(hitFor("magical"), [100]);
});

// ─── X26, X27: extra strikes sized, spread and chained ──────────────────────

test("X26: a strike at every other foe for half, from a 1,000 swing, hits each other foe for 500 (as area hits)", () => {
  const sweep = buff("sweep", { stacking: "refresh", strike: { to: { side: "foes", pick: "all", exclude: "targets" }, share: 50 } });
  const a = arena({ party: [{ name: "P", ...swing(1000), statuses: ["sweep"] }], enemies: [{ name: "A", stats: { max_hp: 1e6, ...TAUNT } }, { name: "B", stats: { max_hp: 1e6 } }, { name: "C", stats: { max_hp: 1e6 } }], statuses: [sweep] }).to(12);
  assert.deepEqual(["A", "B", "C"].map((n) => a.hits(n).map((e) => [e.part, e.amount])), [[["hit", 1000]], [["extra", 500]], [["extra", 500]]]);
});

test("X27: a chain of two more at 80% after a 1,000 swing brings strikes of 1,000, 800 and 640", () => {
  const flurry = buff("flurry", { strike: { to: "target", chance: 100, chain: { times: 2, share: 80 } } });
  const a = arena({ party: [{ name: "P", ...swing(1000), statuses: ["flurry"] }], enemies: [BAG], statuses: [flurry] }).to(12);
  assert.deepEqual(a.hits("Bag").map((e) => e.amount), [1000, 1000, 800, 640]);
});

test("X27: a chained strike reading Double strike takes the plain Double strike's place: one roll a swing, chaining from there (Flurry wraps)", () => {
  // Double strike as the core set has it: a stat that brings a strike status reading it. Flurry wraps adds a chained strike reading the same stat.
  const ds = buff("double_strike", { unremovable: true, strike: { to: "target", scale: "double_strike" } });
  const flurry = buff("flurry", { strike: { to: "target", scale: "double_strike", chain: { times: 2, share: 80 } } });
  const stats = [{ id: "double_strike", kind: "points" as const, brings: "double_strike" }];
  const play = (chance: number, wraps: boolean, until: number) =>
    arena({ party: [{ name: "P", ...swing(1000, { ...weapons.sword, cooldown: 1 }), stats: { attack: 1000, double_strike: chance }, statuses: wraps ? ["flurry"] : [] }], enemies: [BAG], statuses: [ds, flurry], stats }).to(until);
  assert.deepEqual(play(100, false, 1).hits("Bag").map((e) => e.amount), [1000, 1000], "plain Double strike: one more");
  assert.deepEqual(play(100, true, 1).hits("Bag").map((e) => e.amount), [1000, 1000, 800, 640], "with the wraps: the chain, and no second roll");
  const half = play(50, true, 4000);
  const swings = half.acts("P", "basic").length, extras = half.hits("Bag").filter((e) => e.part === "extra").length;
  assert.ok(Math.abs(extras / swings - 0.875) < 0.05, `${extras / swings} extra strikes a swing, want 0.875 (0.5 + 0.25 + 0.125)`);
  // One roll a swing, then one after each strike that can still chain: 1 + 0.5 + 0.25 a swing (2.75 if the plain one rolled too).
  const rolls = half.entries("roll", (e) => e.what === "strike").length / swings;
  assert.ok(Math.abs(rolls - 1.75) < 0.05, `${rolls} strike rolls a swing, want 1.75`);
});

// ─── X28: strikes fired by reactions ────────────────────────────────────────

test("X28: a dodge strikes back at the attacker with a basic attack's hit, which can crit", () => {
  const riposte = buff("riposte", { reactions: [{ on: { event: "hit_evaded" }, do: [{ op: "strike", to: "other" }] }] });
  const a = arena({
    party: [{ name: "Duelist", stats: { attack: 100, evasion: 100, crit_chance: 100 }, weapon: { ...weapons.dagger, cooldown: 1000 }, statuses: ["riposte"] }],
    enemies: [{ name: "Brute", ...swing(50) }], statuses: [riposte], stats: [{ id: "evasion", cap: 100 }],
  }).to(13);
  assert.deepEqual(a.hits("Duelist").map((e) => e.word), ["MISS"]);
  assert.deepEqual(a.hits("Brute").map((e) => [e.part, e.amount, e.crit, e.at]), [["extra", 150, true, at(12) + 1]]);
});

test("X28: a quarter of a 1,000 raw magical hit (before the first foe's Magic resist) strikes the next foe, less its own", () => {
  const storm = buff("storm", { reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [{ op: "strike", of: "hit", share: 25, to: { side: "foes", pick: "highest", by: "hp" } }] }] });
  const a = arena({
    party: [{ name: "P", stats: { magic: 1000 }, weapon: { type: "magical", cooldown: 12, amount: { scale: [{ ratio: 1, stat: "magic" }] } }, statuses: ["storm"] }],
    enemies: [{ name: "A", stats: { max_hp: 1e6, magic_resist: 50, ...TAUNT } }, { name: "B", stats: { max_hp: 2e6, magic_resist: 20 } }], statuses: [storm],
  }).to(13);
  assert.deepEqual(a.hits("A").map((e) => e.amount), [500]);
  assert.deepEqual(a.hits("B").map((e) => [e.part, e.amount]), [["extra", 200]]);
});

// ─── X29: what hits, actions, heals and knockouts carry ─────────────────────

test("X29: a Fireball's hits carry `area` and a Firebolt's don't, for boosts and for event filters alike", () => {
  const fireball = device("fireball", { target: { side: "foes", pick: "all" }, do: [{ op: "damage", type: "magical", amount: 100 }] });
  const firebolt = device("firebolt", { do: [{ op: "damage", type: "magical", amount: 100 }] });
  const treatise = buff("treatise", { boosts: [{ tag: "area", pct: 100 }], reactions: [{ on: { event: "hit_lands", tags: ["area"] }, do: [{ op: "apply", status: "wide", to: "self" }] }] });
  const run = (ab: string) => {
    const a = arena({ party: [{ name: "P", abilities: [ab], statuses: ["treatise"] }], enemies: [BAG, BAG, BAG], abilities: [fireball, firebolt], statuses: [treatise, tally("wide")] });
    readyAt(a, "P", ab, 1);
    a.to(2);
    return { dmg: a.entries("dmg").map((e) => e.amount), wide: stacks(a, "P", "wide") };
  };
  assert.deepEqual(run("fireball"), { dmg: [200, 200, 200], wide: 3 });
  assert.deepEqual(run("firebolt"), { dmg: [100], wide: 0 });
});

test("X29: a knockout names its killer: a hit's attacker (with its kind), a Per source status's source, nobody for a shared Burn, the Thorns holder", () => {
  // The Witness marks whoever the ko event names as its other.
  const witness = buff("witness", { reactions: [
    { on: { event: "ko", whose: "any" }, do: [{ op: "apply", status: "killer", to: "other" }] },
    { on: { event: "ko", whose: "any", kind: "basic" }, do: [{ op: "apply", status: "by_basic", to: "other" }] },
  ] });
  const venom = debuff("venom", { stacking: "intensity", perSource: {}, pulse: { every: 1, do: [{ op: "damage", type: "none", amount: 1000 }] } });
  const burn = debuff("burn", { stacking: "intensity", pulse: { every: 1, do: [{ op: "damage", type: "none", amount: 1000 }] } });
  const poison = (st: string) => device("poison", { do: [{ op: "apply", status: st }] });
  const kill = (party: object, st = "venom") => {
    const a = arena({
      party: [{ name: "Killer", ...party }, { name: "Witness", statuses: ["witness"] }],
      enemies: [{ name: "Weak", stats: { max_hp: 500 }, weapon: { ...weapons.sword, amount: 1 } }, BAG],
      abilities: [poison(st)], statuses: [witness, venom, burn, buff("killer"), buff("by_basic")],
    });
    a.unit("Weak").stats.aggro = 1e6;
    if ((party as { abilities?: string[] }).abilities) readyAt(a, "Killer", "poison", 1);
    a.to(20);
    assert.ok(a.unit("Weak").ko);
    return { killer: a.has("Killer", "killer").length, basic: a.has("Killer", "by_basic").length, witness: a.has("Witness", "killer").length };
  };
  assert.deepEqual(kill(swing(1000)), { killer: 1, basic: 1, witness: 0 }, "a hit: its attacker, with kind basic");
  assert.deepEqual(kill({ abilities: ["poison"] }), { killer: 1, basic: 0, witness: 0 }, "a Per source pulse: its source");
  assert.deepEqual(kill({ abilities: ["poison"] }, "burn"), { killer: 0, basic: 0, witness: 0 }, "a shared Burn: nobody");
  assert.deepEqual(kill({ stats: { thorns: 1000, max_hp: 1e6, ...TAUNT } }), { killer: 1, basic: 0, witness: 0 }, "Thorns: its holder");
});

test("X29: action_resolve after a 400 MP cast on three foes carries 400 and 3; heals carry their action's kind", () => {
  const nova = device("nova", { mp: 400, target: { side: "foes", pick: "all" }, do: [{ op: "damage", type: "magical", amount: 1 }] });
  const meter = buff("meter", { reactions: [
    { on: { event: "action_resolve", kind: "ability" }, do: [{ op: "apply", status: "paid", stacks: byAmount, to: "self" }] },
    { on: { event: "action_resolve", countAtLeast: 3 }, do: [{ op: "apply", status: "three", to: "self" }] },
    { on: { event: "action_resolve", countAtLeast: 4 }, do: [{ op: "apply", status: "four", to: "self" }] },
  ] });
  const a = arena({ party: [{ name: "P", stats: { max_mp: 1000 }, abilities: ["nova"], statuses: ["meter"] }], enemies: [BAG, BAG, BAG], abilities: [nova], statuses: [meter, tally("paid"), buff("three"), buff("four")] });
  readyAt(a, "P", "nova", 1);
  a.to(2);
  assert.deepEqual([stacks(a, "P", "paid"), a.has("P", "three").length, a.has("P", "four").length], [400, 1, 0]);

  const mend = device("mend", { do: [{ op: "heal", amount: 10 }], target: "self" });
  const regen = buff("regen", { duration: 3, pulse: { every: 1, do: [{ op: "heal", amount: 10 }] } });
  const ear = buff("ear", { reactions: [{ on: { event: "healed", kind: "ability" }, do: [{ op: "apply", status: "by_ability", to: "self" }] }] });
  const h = arena({ party: [{ name: "P", stats: { max_hp: 1000 }, hp: 100, abilities: ["mend"], statuses: ["ear", "regen"] }], enemies: [BAG], abilities: [mend], statuses: [ear, regen, tally("by_ability")] });
  readyAt(h, "P", "mend", 5);
  h.to(6);
  assert.equal(h.entries("heal").length, 4, "three Regen pulses and the Mend");
  assert.equal(stacks(h, "P", "by_ability"), 1, "only the Mend's heal carries kind ability");
});

// ─── X1's call from take: the breaker and the blocked amount ───────────────

test("X1 (take's part): an Aegis that stops a 900 blow ends naming the attacker and 900; a Shield broken by a hit names the hitter", () => {
  const aegis = buff("aegis", { stacking: "fizzle", block: { share: 25 } });
  const shield = buff("shield", { stacking: "intensity", absorb: true });
  const watch = buff("watch", { reactions: [
    { on: { event: "status_ended", status: "aegis", cause: ["spent"] }, do: [{ op: "apply", status: "seen", stacks: byAmount, to: "other" }] },
    { on: { event: "status_ended", status: "shield", cause: ["stacks"] }, do: [{ op: "apply", status: "broke", to: "other" }] },
  ] });
  const run = (st: string) => arena({
    party: [{ name: "P", stats: { max_hp: 2000 }, statuses: ["watch", st] }],
    enemies: [{ name: "Brute", ...swing(900) }], statuses: [aegis, shield, watch, tally("seen"), buff("broke")],
  }).to(13);
  assert.equal(stacks(run("aegis"), "Brute", "seen"), 900);
  assert.equal(run("shield").has("Brute", "broke").length, 1);
});

// ─── X30: taking a hit for an ally ──────────────────────────────────────────

test("X30: a 3,000 hit on an ally with 4,000 max HP lands on the cover; a 900 hit doesn't move; two covers don't pass it back", () => {
  const oath = buff("oath", { cover: { share: 25 } });
  const run = (attack: number, both = false) => {
    const a = arena({
      party: [{ name: "Holder", stats: { max_hp: 1e6 }, statuses: ["oath"] }, { name: "Ally", stats: { max_hp: 4000, ...TAUNT }, statuses: both ? ["oath"] : [] }],
      enemies: [{ name: "Brute", ...swing(attack) }], statuses: [oath],
    }).to(12);
    return a.entries("dmg").map((e) => [a.unit(e.target as string).name, e.amount]);
  };
  assert.deepEqual(run(3000), [["Holder", 3000]]);
  assert.deepEqual(run(900), [["Ally", 900]]);
  assert.deepEqual(run(3000, true), [["Holder", 3000]], "the Holder's own cover doesn't send it on");
});

// ─── X31: HP floors ─────────────────────────────────────────────────────────

test("X31: a 5,000 blow on a unit with 1,200 HP and a spending floor leaves it at 1 and ends the floor; the next blow knocks it out", () => {
  const bastion = buff("bastion", { floor: { spend: true } });
  const a = arena({ party: [{ name: "P", stats: { max_hp: 1200 }, statuses: ["bastion"] }, { name: "Spare", stats: { max_hp: 1e6 } }], enemies: [{ name: "Brute", ...swing(5000) }], statuses: [bastion] });
  a.unit("P").stats.aggro = 1e6;
  a.to(12);
  assert.equal(a.unit("P").hp, 1);
  assert.deepEqual(a.entries("status_end").map((e) => [e.status, e.cause]), [["bastion", "spent"]]);
  assert.ok(!a.entries("down").length);
  a.to(24);
  assert.ok(a.unit("P").ko);
  const b = arena({ party: [{ name: "P", stats: { max_hp: 1200 }, statuses: ["held"] }], enemies: [{ name: "Brute", ...swing(5000) }], statuses: [buff("held", { floor: {} })] }).to(60);
  assert.equal(b.unit("P").hp, 1, "a floor that doesn't spend holds every blow");
});

// ─── X32: overhealing ───────────────────────────────────────────────────────

test("X32: a 1,000 heal on a unit 300 below full fires healed 300 and overhealed 700; on a full unit, overhealed 1,000 alone", () => {
  const ear = buff("ear", { reactions: [
    { on: { event: "healed" }, do: [{ op: "apply", status: "got", stacks: byAmount, to: "holder" }] },
    { on: { event: "overhealed" }, do: [{ op: "apply", status: "over", stacks: byAmount, to: "holder" }] },
  ] });
  const run = (hp: number) => {
    const mend = device("mend", { target: { side: "others" }, do: [{ op: "heal", amount: 1000 }] });
    const a = arena({ party: [{ name: "C", abilities: ["mend"] }, { name: "T", stats: { max_hp: 5000 }, hp, statuses: ["ear"] }], enemies: [BAG], abilities: [mend], statuses: [ear, tally("got"), tally("over")] });
    readyAt(a, "C", "mend", 1);
    a.to(2);
    return [stacks(a, "T", "got"), stacks(a, "T", "over")];
  };
  assert.deepEqual(run(4700), [300, 700]);
  assert.deepEqual(run(5000), [0, 1000]);
});

// ─── X33: heals from others blocked ─────────────────────────────────────────

test("X33: an ally's Cure on a holder of `heals: own` restores nothing, nor a Regen the ally gave; its own Lifesteal and its own Regen heal", () => {
  const own = buff("own", { heals: "own" });
  const leech = buff("leech", { reactions: [{ on: { event: "hit_lands" }, do: [{ op: "heal", amount: 50, to: "self" }] }] });
  const regen = buff("regen", { duration: 10, pulse: { every: 2, do: [{ op: "heal", amount: 10 }] } });
  const cure = device("cure", { target: { side: "others" }, do: [{ op: "heal", amount: 500 }, { op: "apply", status: "regen" }] });
  const selfRegen = device("self_regen", { target: "self", do: [{ op: "apply", status: "regen" }] });
  const a = arena({
    party: [{ name: "Cleric", abilities: ["cure"] }, { name: "Martyr", stats: { max_hp: 5000, attack: 1, max_mp: 0 }, hp: 1000, weapon: weapons.sword, abilities: ["self_regen"], statuses: ["own", "leech"] }],
    enemies: [BAG], abilities: [cure, selfRegen], statuses: [own, leech, regen],
  });
  readyAt(a, "Cleric", "cure", 1);
  readyAt(a, "Martyr", "self_regen", 1000);
  a.to(13);
  assert.deepEqual(a.entries("heal").map((e) => [e.src, e.amount]), [["leech", 50]], "the Cure and the Cleric's Regen give nothing; the Lifesteal heals");
  readyAt(a, "Martyr", "self_regen", 20);
  a.to(23);
  assert.ok(a.entries("heal").some((e) => e.src === "regen" && e.amount === 10), "its own Regen heals");
});

// ─── X34: revives on a timer ────────────────────────────────────────────────

test("X34: a unit knocked out at tick 10 with a timed revive stands 4 ticks later with 20% HP, every action on cooldown; if the fight is won first, it stays down", () => {
  const phoenix = buff("phoenix", { survivesKO: true, reactions: [{ on: { event: "ko" }, do: [{ op: "revive", hp: { scale: [{ ratio: 0.2, stat: "max_hp", of: "target" }] }, after: 4, to: "self" }] }] });
  const zap = { id: "zap", cooldown: 30, if: NEVER, do: [{ op: "damage", type: "physical", amount: 1 }] };
  const run = (finisher: object) => arena({
    party: [{ name: "Bird", stats: { max_hp: 1000, ...TAUNT }, abilities: ["zap"], statuses: ["phoenix"] }, { name: "Finisher", ...finisher }],
    enemies: [{ name: "Brute", stats: { attack: 5000, max_hp: 1000 }, weapon: { ...weapons.sword, cooldown: 10 } }], abilities: [zap], statuses: [phoenix],
  });
  const a = run({ stats: { max_hp: 1e6 } }).to(15);
  assert.deepEqual(a.entries("down").map((e) => e.at), [at(10)]);
  assert.deepEqual(a.entries("revive").map((e) => [e.at, e.hp, e.ready]), [[at(14) + 1, 200, false]]);
  assert.equal(a.unit("Bird").acts[0].ready, at(14) + 1 + at(30), "its ability starts its cooldown again");
  const b = run({ stats: { attack: 5000, max_hp: 1e6 }, weapon: weapons.sword }).run();
  assert.equal(b.f.result, "won");
  assert.ok(b.unit("Bird").ko && !b.entries("revive").length, "won at tick 12: it stays down");
});

// ─── X35: a reviver's rule ──────────────────────────────────────────────────

test("X35: a reviver with `revives: { ready: true }` raises an ally ready, by ability or by reaction; with Bones too, on cooldown at full HP", () => {
  const raise = device("raise", { if: { side: "allies", where: { ko: true } }, target: { side: "allies", where: { ko: true } }, do: [{ op: "revive", hp: 100 }] });
  const einherjar = buff("einherjar", { revives: { ready: true } });
  const bones = buff("bones", { revives: { ready: false, hp: { scale: [{ ratio: 1, stat: "max_hp", of: "target" }] } } });
  const call = buff("call", { reactions: [{ on: { event: "action_resolve", kind: "basic" }, do: [{ op: "revive", hp: 100, to: { side: "allies", where: { ko: true } } }] }] });
  const zap = { id: "zap", cooldown: 30, if: NEVER, do: [{ op: "damage", type: "physical", amount: 1 }] };
  const run = (statuses: string[], how: "ability" | "reaction") => {
    const a = arena({
      party: [{ name: "Valk", ...(how === "ability" ? { abilities: ["raise"] } : { weapon: weapons.sword, statuses: ["call"] }), statuses: [...statuses, ...(how === "reaction" ? ["call"] : [])] }, { name: "Down", stats: { max_hp: 5000 }, ko: true, abilities: ["zap"] }],
      enemies: [BAG], abilities: [raise, zap], statuses: [einherjar, bones, call],
    });
    if (how === "ability") readyAt(a, "Valk", "raise", 5);
    a.to(13);
    const r = a.entries("revive")[0];
    return { ready: a.unit("Down").acts[0].ready === r.at, hp: r.hp };
  };
  assert.deepEqual(run([], "ability"), { ready: false, hp: 100 });
  assert.deepEqual(run(["einherjar"], "ability"), { ready: true, hp: 100 });
  assert.deepEqual(run(["einherjar"], "reaction"), { ready: true, hp: 100 });
  assert.deepEqual(run(["einherjar", "bones"], "ability"), { ready: false, hp: 5000 }, "false wins over true; Bones's HP");
});

test("revive to owner: a reaction to an ally's ko raises the ally that just fell, not another fallen one (Shield of the chosen); the validator takes it only there", () => {
  const chosen = buff("chosen", { reactions: [{ on: { event: "ko", whose: "ally" }, do: [{ op: "revive", hp: 300, to: "owner" }] }] });
  const a = arena({
    party: [{ name: "Valk", stats: { max_hp: 1e6 }, statuses: ["chosen"] }, { name: "Long down", ko: true }, { name: "Falls", stats: { max_hp: 1000, ...TAUNT } }],
    enemies: [{ name: "Brute", ...swing(5000) }], statuses: [chosen],
  }).to(13);
  assert.deepEqual(a.entries("revive").map((e) => [a.unit(e.unit as string).name, e.at, e.hp]), [["Falls", at(12) + 1, 300]]);
  assert.ok(a.unit("Long down").ko);

  const check = (on: object) => {
    const p = structuredClone(hollow) as unknown as S.ContentPack;
    p.statuses.push(buff("probe", { reactions: [{ on, do: [{ op: "revive", hp: 10, to: "owner" }] }] }) as S.StatusT);
    return validatePack(p).issues.filter((i) => i.level === "error").map((i) => i.code);
  };
  assert.deepEqual(check({ event: "ko", whose: "ally" }), []);
  assert.deepEqual(check({ event: "hit_taken", whose: "ally" }), ["revive.target"]);
});

// ─── X36: after a won fight ─────────────────────────────────────────────────

test("X36: a party wins with one member down; a Lamp holder's fight_won revive leaves it at 25% when the next fight starts", () => {
  const lamp = buff("lamp", { reactions: [{ on: { event: "fight_won" }, do: [{ op: "revive", hp: { scale: [{ ratio: 0.25, stat: "max_hp", of: "target" }] }, to: { side: "allies", where: { ko: true } } }] }] });
  const a = arena({ party: [{ name: "Lamp", ...swing(1000), statuses: ["lamp"] }, { name: "Down", stats: { max_hp: 4000 }, ko: true }], enemies: [{ name: "Foe", stats: { max_hp: 500 } }], statuses: [lamp] }).run();
  assert.equal(a.f.result, "won");
  assert.deepEqual([a.unit("Down").ko, a.unit("Down").hp], [false, 1000]);
  const m = { id: a.unit("Down").id, hp: 0, mp: 0, stats: { max_hp: 4000, max_mp: 0 } } as unknown as Member;
  combat.endFight({ c: a.c, run: { party: [m] } } as never, a.f);
  assert.equal(m.hp, 1000, "endFight carries it standing");
});

test("X36: a fallen unit's status that survives its knockout acts for it when the fight is won (The undying's Martyr)", () => {
  const undying = buff("undying", { survivesKO: true, reactions: [{ on: { event: "fight_won" }, do: [{ op: "revive", hp: { scale: [{ ratio: 0.5, stat: "max_hp", of: "target" }] }, to: "self" }] }] });
  const a = arena({
    party: [{ name: "Martyr", stats: { max_hp: 1000, ...TAUNT }, statuses: ["undying"] }, { name: "Axe", ...swing(1000, weapons.axe) }],
    enemies: [{ name: "Foe", stats: { attack: 5000, max_hp: 500 }, weapon: weapons.sword }], statuses: [undying],
  }).run();
  assert.equal(a.f.result, "won");
  assert.deepEqual(a.entries("down").map((e) => a.unit(e.unit as string).name), ["Martyr", "Foe"]);
  assert.deepEqual([a.unit("Martyr").ko, a.unit("Martyr").hp], [false, 500]);
});

// ─── X37: moving a status ───────────────────────────────────────────────────

test("X37: a foe's Might 6 with 10 ticks left is taken: the foe has none, the taker has Might 6 ending at the same tick", () => {
  const might = buff("might", { stacking: "intensity", duration: 30, boosts: [{ tag: "physical", pct: 8 }] });
  const pump = device("pump", { target: "self", do: [{ op: "apply", status: "might", stacks: 6 }] });
  const take = device("take", { do: [{ op: "remove", label: "buff", status: "might", move: true }] });
  const a = arena({ party: [{ name: "Thief", abilities: ["take"] }], enemies: [{ name: "Foe", stats: { max_hp: 1e6 }, abilities: ["pump"] }], abilities: [pump, take], statuses: [might] });
  readyAt(a, "Foe", "pump", 1);
  readyAt(a, "Thief", "take", 21);
  a.to(21);
  assert.equal(a.has("Foe", "might").length, 0);
  const got = a.has("Thief", "might");
  assert.deepEqual(got.map((s) => [s.stacks, s.end]), [[6000, at(31)]]);
  const immune = arena({ party: [{ name: "Thief", stats: { "immune:status:might": 1 }, abilities: ["take"] }], enemies: [{ name: "Foe", stats: { max_hp: 1e6 }, abilities: ["pump"] }], abilities: [pump, take], statuses: [might] });
  readyAt(immune, "Foe", "pump", 1);
  readyAt(immune, "Thief", "take", 21);
  immune.to(21);
  assert.deepEqual([immune.has("Foe", "might").length, immune.has("Thief", "might").length], [0, 0], "an immune taker strips it and gets nothing");
});

// ─── X38: one of several statuses at random ─────────────────────────────────

test("X38: over 1,000 swings each of five statuses lands about 200 times, one a swing", () => {
  const ids = ["a1", "a2", "a3", "a4", "a5"];
  const wand = buff("wand", { reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [{ op: "one", of: ids.map((status) => ({ status, stacks: 2 })), to: "other" }] }] });
  const a = arena({ party: [{ name: "P", stats: { attack: 1 }, weapon: { ...weapons.dagger, cooldown: 1 }, statuses: ["wand"] }], enemies: [BAG], statuses: [wand, ...ids.map((id) => debuff(id, { stacking: "intensity" }))] }).to(1000.5);
  const swings = a.hits("Bag").length;
  const counts = ids.map((id) => a.entries("status", (e) => e.status === id).length);
  assert.ok(swings >= 990, `${swings}`);
  assert.equal(counts.reduce((x, y) => x + y, 0), swings, "one a swing");
  assert.ok(counts.every((n) => n > 150 && n < 250), counts.join(", "));
  assert.equal(stacks(a, "Bag", "a1"), counts[0] * 2, "each with its own stacks");
});

// ─── X39: recasting ─────────────────────────────────────────────────────────

test("X39: a third Fireball resolves twice, the second free, and the count starts again at 0", () => {
  // The count: two casts fill the tally, which primes the third and empties; the primed cast recasts and clears what the third added.
  const staff = buff("staff", { reactions: [{ on: { event: "action_resolve", kind: "ability", repeat: false }, do: [{ op: "apply", status: "tally", to: "self" }] }] });
  const count = buff("tally", { stacking: "intensity", cap: 2, reactions: [{ on: { event: "status_capped", status: "tally" }, do: [{ op: "apply", status: "primed", to: "holder" }, { op: "remove", label: "buff", status: "tally", to: "holder" }] }] });
  const primed = buff("primed", { reactions: [{ on: { event: "action_resolve", kind: "ability", repeat: false }, do: [{ op: "recast" }, { op: "remove", label: "buff", status: "primed", to: "holder" }, { op: "remove", label: "buff", status: "tally", to: "holder" }] }] });
  const fireball = device("fireball", { mp: 100, cooldown: 10, do: [{ op: "damage", type: "magical", amount: 1 }] });
  const a = arena({ party: [{ name: "Mage", stats: { max_mp: 10_000 }, abilities: ["fireball"], statuses: ["staff"] }], enemies: [BAG], abilities: [fireball], statuses: [staff, count, primed] }).to(65);
  assert.deepEqual(a.acts("Mage", "fireball"), [10, 20, 30, 30.001, 40, 50, 60, 60.001]);
  assert.equal(a.entries("mp", (e) => e.amount === -100).length, 6, "the repeats are free");
  assert.equal(a.unit("Mage").acts[0].ready, at(70), "its cooldown runs from the cast, not the repeat");
});

// ─── X41: "or" between an ability's conditions ──────────────────────────────

test("X41: an ability waiting for any of \"an ally down\" and \"an ally below a third\" waits while neither holds, and casts as soon as either does", () => {
  const ward = device("ward", { cooldown: 5, if: { any: [{ side: "allies", where: { ko: true } }, { side: "allies", where: { hpBelow: 33 } }] }, target: "self", do: [{ op: "heal", amount: 1 }] });
  const a = arena({ party: [{ name: "C", abilities: ["ward"] }, { name: "Ally", stats: { max_hp: 900 } }], enemies: [BAG], abilities: [ward] });
  readyAt(a, "C", "ward", 1);
  a.to(10);
  assert.deepEqual(a.acts("C", "ward"), []);
  a.unit("Ally").hp = 299;
  a.to(20);
  assert.deepEqual(a.acts("C", "ward"), [], "299 of 900 is just above a third");
  a.unit("Ally").hp = 290;
  const now = a.f.now;
  a.to((now + 2) / 1000);
  assert.deepEqual(a.acts("C", "ward"), [(now + 1) / 1000], "below a third: it casts on the next sub-tick");
});

// ─── X40, R4: abilities that bring statuses, trained forms, through the party ─

/** The fixture pack with a Warrior passive (Grit) and Cleave upgraded, every form present, and Cleave bringing a status. */
function trainedPack(): Content {
  const p = structuredClone(hollow) as unknown as S.ContentPack;
  const forms = Object.keys(S.UPGRADE_FORMS) as S.UpgradeFormT[];
  const st = (id: string, armor: number) => ({ id, name: id.toUpperCase(), label: "buff", show: "sheet", stacking: "refresh", unremovable: true, stats: [{ stat: "armor", flat: armor }] }) as S.StatusT;
  p.classes.find((c) => c.id === "warrior")!.passive = { name: "Grit", text: "-", stats: [{ stat: "aggro", flat: 5 }], statuses: ["grit"] };
  p.statuses.push(st("grit", 1), ...forms.map((f, i) => st(S.formId("grit", f), 10 + i)), st("cleaver", 100));
  const cleave = p.abilities.find((a) => a.id === "cleave")!;
  p.abilities.push(...forms.map((f) => ({ ...cleave, id: S.formId("cleave", f) })));
  cleave.statuses = ["cleaver"];
  const v = { name: "V", text: "-" };
  p.upgrades = [{ id: "grit", class: "warrior", kind: "passive", power: "-", a: v, b: v }, { id: "cleave", class: "warrior", kind: "ability", power: "-", a: v, b: v }];
  return loadContent(p);
}
const warriorParty = (x: Partial<S.PartyUnitT>): S.Party => {
  const p = structuredClone(fixtureParty) as unknown as S.Party;
  Object.assign(p.units[0], x);
  return p;
};

test("R4, X40: checkParty accepts an ability's form and the passive's form; the form takes the passive's place, and its stat grants stay", () => {
  const c = trainedPack();
  const party = warriorParty({ passive: "grit__a", abilities: ["cleave__b", "stand_guard", "shield_bash"] });
  assert.deepEqual(checkParty(c.pack, party).filter((i) => i.level === "error"), []);
  assert.ok(checkParty(c.pack, warriorParty({ passive: "cleaver" })).some((i) => i.code === "party.passive"));
  const member = (p: S.Party) => (combat.party(c, { dungeon: "hollow_of_the_grey_mother", party: p, seed: 1 }) as Member[])[0];
  const m = member(party), plain = member(warriorParty({}));
  assert.ok(m.start.includes("grit__a") && !m.start.includes("grit"));
  assert.ok(plain.start.includes("grit") && plain.start.includes("cleaver"));
  assert.equal(m.flat.aggro, plain.flat.aggro, "the passive's own stats stay");
  assert.deepEqual(m.abilities, ["cleave__b", "stand_guard", "shield_bash"]);
  assert.ok(!m.start.includes("cleaver"), "a form brings only its own statuses");
});

test("X40: a unit with an ability that brings a status holds it from tick 0; without the ability equipped, it doesn't", () => {
  const c = trainedPack();
  const holds = (party: S.Party) => {
    const run = newRun(c, combat, { dungeon: "hollow_of_the_grey_mother", party, seed: 3 });
    advanceOnce(c, combat, run);
    advanceOnce(c, combat, run);
    const f = run.fight as unknown as { now: number; units: { ref: string; statuses: { id: string }[] }[] };
    assert.equal(f.now, 0);
    const u = f.units.find((x) => x.ref === "warrior")!;
    return { cleaver: u.statuses.some((s) => s.id === "cleaver"), grit: u.statuses.find((s) => s.id.startsWith("grit"))?.id };
  };
  assert.deepEqual(holds(warriorParty({})), { cleaver: true, grit: "grit" });
  assert.deepEqual(holds(warriorParty({ abilities: ["stand_guard", "shield_bash", "rallying_cry"], passive: "grit__bp" })), { cleaver: false, grit: "grit__bp" });
});
