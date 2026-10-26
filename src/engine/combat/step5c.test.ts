/**
 * Step 5c's engine changes (steps/05-core-set/5c-armor-bleed-mana): Armor on a curve, Bleed (a status set off by each hit
 * its holder takes, which the hit that applies it doesn't set off), an opening set by ability slot, and a crit filter on hit
 * events.
 */
import { test } from "vitest";
import assert from "node:assert/strict";
import { arena } from "./arena.js";

const at = (ticks: number) => ticks * 1000;
const punch = (amount: number, x: object = {}) => ({ id: "punch", cast: 0, recovery: 0, cooldown: 5, do: [{ op: "damage", type: "physical", subtype: "blunt", amount, ...x }] });
const bleed = {
  id: "bleed", name: "BLEED", label: "debuff", show: "icon", stacking: "intensity",
  trigger: { on: { event: "hit_taken" }, do: [{ op: "damage", type: "none", amount: 50, to: "holder" }] }, drop: { fraction: 0.2 },
};

test("armorK: a hit H deals H² ÷ (H + k × armorRatio × Armor): about linear for big hits, half at k × A, never blanked", () => {
  const dealt = (hit: number) => {
    const a = arena({
      party: [{ name: "A", abilities: ["punch"] }], enemies: [{ name: "T", stats: { max_hp: 1e6, armor: 1000 } }],
      abilities: [punch(hit)], ruleset: { armorRatio: 1, armorK: 1, armorFloor: 90 },
    });
    a.unit("A").acts[0].ready = at(1);
    a.to(1);
    return a.hits("T")[0].amount;
  };
  assert.equal(dealt(1000), 500, "a hit the size of the armor value loses half");
  assert.equal(dealt(3000), 2250, "a big hit loses about the armor value");
  assert.equal(dealt(100), 9, "a small hit loses most of itself, not all, and the old floor is ignored");
});

test("Bleed: each hit its holder takes deals X × stacks, untyped, the next sub-tick, then a share of the stacks go; the hit that applies it doesn't set it off", () => {
  const a = arena({
    party: [{ name: "A", abilities: ["cut", "punch"] }], enemies: [{ name: "T", stats: { max_hp: 1e6, armor: 1000 } }],
    statuses: [bleed],
    abilities: [{ id: "cut", cast: 0, recovery: 0, cooldown: 1000, do: [{ op: "damage", type: "physical", subtype: "slash", amount: 1, apply: [{ status: "bleed", stacks: 10 }] }] }, punch(1)],
    ruleset: { armorRatio: 1 },
  });
  a.unit("A").acts[0].ready = at(1);
  a.unit("A").acts[1].ready = at(3);
  a.to(2);
  assert.deepEqual(a.entries("dmg", (e) => e.src === "bleed"), [], "the cut that applies 10 Bleed doesn't set it off");
  assert.equal(a.has("T", "bleed")[0].stacks, 10_000);
  a.to(4);
  const b = a.entries("dmg", (e) => e.src === "bleed");
  assert.equal(b.length, 1);
  assert.equal(b[0].amount, 500, "the next hit sets off 10 × 50, past Armor 1,000");
  assert.equal(b[0].at, at(3) + 1, "on the sub-tick after the hit");
  assert.equal(a.has("T", "bleed")[0].stacks, 8_000, "and a fifth of the stacks go");
});

test("Bleed: no timer, and its own damage isn't a hit, so it doesn't set itself off", () => {
  const a = arena({
    party: [{ name: "A", abilities: ["punch"] }], enemies: [{ name: "T", stats: { max_hp: 1e6 }, statuses: [] }],
    statuses: [bleed], abilities: [punch(1)],
  });
  a.unit("A").acts[0].ready = at(200);
  a.f.units[1].statuses.push({ uid: 999, id: "bleed", src: null, at: 0, end: -1, stacks: 5000, nums: [] });
  a.to(199);
  assert.equal(a.has("T", "bleed")[0].stacks, 5000, "nothing happens without hits");
  a.to(201);
  assert.equal(a.entries("dmg", (e) => e.src === "bleed").length, 1, "one hit, one bleed");
});

test("opening by slot: the first ability starts with the most of its cooldown done, then the second, then the third; a basic attack a share of its own, later by party slot", () => {
  const cd = (id: string, cooldown: number) => ({ id, cast: 0, recovery: 0, cooldown, do: [{ op: "damage", type: "physical", subtype: "blunt", amount: 1 }] });
  const a = arena({
    party: [{ name: "A", abilities: ["one", "two", "three"], weapon: { type: "physical", subtype: "blunt", cooldown: 10, amount: 1 } }, { name: "B", weapon: { type: "physical", subtype: "blunt", cooldown: 10, amount: 1 } }],
    enemies: [{ name: "T", stats: { max_hp: 1e6 }, abilities: ["two"] }],
    abilities: [cd("one", 30), cd("two", 40), cd("three", 50)],
    ruleset: { opening: { abilities: [25, 15, 10], basic: 0.5, step: 1 } },
  });
  assert.deepEqual(a.unit("A").acts.map((x) => x.ready / 1000), [5, 25, 40, 5]);
  assert.equal(a.unit("B").acts[0].ready / 1000, 6, "a slot later, a tick later");
  assert.equal(a.unit("T").acts[0].ready / 1000, 15, "an enemy's first ability gets the first number");
});

test("crit filter: a reaction on hit_lands with crit: true fires on crits only", () => {
  const mark = { id: "mark", name: "MARK", label: "debuff", show: "icon", stacking: "intensity" };
  const keen = { id: "keen", name: "Keen", label: "buff", show: "sheet", stacking: "refresh", reactions: [{ on: { event: "hit_lands", crit: true }, do: [{ op: "apply", status: "mark", to: "other" }] }] };
  const marks = (crit: number) => {
    const a = arena({ party: [{ name: "A", abilities: ["punch"], stats: { crit_chance: crit }, statuses: ["keen"] }], enemies: [{ name: "T", stats: { max_hp: 1e6 } }], statuses: [mark, keen], abilities: [punch(100)] });
    a.to(30);
    return a.entries("status", (e) => e.status === "mark").length;
  };
  assert.equal(marks(0), 0);
  assert.ok(marks(100) >= 5);
});

test("stat floors hold on stats with no cap: Armor taken below zero by a debuff stays at zero, so a hit gains nothing from it", () => {
  const sunder = { id: "sunder", name: "SUNDER", label: "debuff", show: "icon", stacking: "intensity", stats: [{ stat: "armor", flat: -600 }] };
  const a = arena({
    party: [{ name: "A", abilities: ["cut", "punch"] }], enemies: [{ name: "T", stats: { max_hp: 1e6, armor: 1000 } }],
    statuses: [sunder], abilities: [{ id: "cut", cast: 0, recovery: 0, cooldown: 1000, do: [{ op: "apply", status: "sunder", stacks: 10 }] }, punch(100)],
    ruleset: { armorRatio: 1 }, stats: [{ id: "armor", floor: 0 }],
  });
  a.unit("A").acts[0].ready = at(1);
  a.unit("A").acts[1].ready = at(3);
  a.to(4);
  assert.equal(a.unit("T").stats.armor, 0, "10 Sunder on Armor 1,000 leaves 0, not -5,000");
  assert.equal(a.hits("T")[0].amount, 100, "and the hit lands for its own size, no more");
});
