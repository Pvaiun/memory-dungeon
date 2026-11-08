/** Numbers and how they scale with stats, conditions, unit tests and targeting rules. */
import * as z from "zod";
import { Id, keys, Kind, Of, Pick, PosInt, Side, StatKey, Tag, TO } from "./primitives.js";

// ─────────────────────────────────────────────────────────────────────────────
// Numbers, conditions and targeting
// ─────────────────────────────────────────────────────────────────────────────

/** Tests on one unit. Every field given must hold. */
export const UnitCond = z.strictObject({
  hpBelow: z.number().min(0).max(100).optional().describe("HP below this percent of max HP."),
  hpAtLeast: z.number().min(0).max(100).optional(),
  mpBelow: z.number().min(0).max(100).optional().describe("MP below this share of max MP (what a Clarity waits for). A unit with no MP pool never passes."),
  mpAtLeast: z.number().min(0).max(100).optional(),
  has: z.union([Id, z.array(Id).min(1)]).optional().describe("Has this status (or every one of these)."),
  lacks: z.union([Id, z.array(Id).min(1)]).optional().describe("Doesn't have this status (or any of these)."),
  buffs: z.boolean().optional().describe("true: has any buff. false: has none."),
  debuffs: z.boolean().optional().describe("true: has any debuff. false: has none."),
  kind: z.strictObject({ kind: Kind, tag: Tag.optional() }).optional().describe("Has a status containing this effect kind (narrowed by tag)."),
  stacks: z.strictObject({ status: Id, atLeast: z.number() }).optional().describe("A status's Intensity total, in stacks."),
  atCap: Id.optional().describe("Holds this Intensity status at its cap."),
  belowCap: Id.optional().describe("Doesn't hold this Intensity status at its cap (or at all)."),
  casting: z.boolean().optional().describe("true: in an action's wind-up right now (what Unmake waits for). false: not."),
  ko: z.boolean().optional().describe("true: knocked out, still in the fight. Sides list living units unless a rule asks for this. Default: living."),
  hasAny: z.array(Id).min(1).optional().describe("Has at least one of these statuses (Stunned or Silenced)."),
  lower: z.strictObject({ stat: StatKey }).optional().describe("This stat is lower than the reading unit's: the acting unit in an action, a reaction's actor, a pulse's holder (an ally with less Defense than the wearer)."),
  acted: z.boolean().optional().describe("true once one of its actions has resolved this fight; false until then (a unit summoned mid-fight starts false)."),
  top: z.strictObject({ stats: z.array(StatKey).min(1) }).optional().describe("No living unit on its side has more of the highest of these stats (\"the foe with the highest Attack\"); ties pass."),
  weapon: z.array(Id).min(1).optional().describe("Wields a weapon of one of these kinds (an enemy's weapon by its kind, if it names one)."),
}).meta({ id: "UnitCond" });
export type UnitCondT = z.infer<typeof UnitCond>;

export const Scale = z
  .strictObject({
    ratio: z.number(),
    stat: StatKey.optional().describe("A stat's current value."),
    hp: z.enum(["current", "missing"]).optional().describe("Current HP, or max HP minus current."),
    stacks: Id.optional().describe("A status's Intensity total, in stacks."),
    amount: z.literal(true).optional().describe("Reactions only: the event's amount."),
    when: UnitCond.optional().describe("1 if the condition holds for the unit read (`of`), else 0: scaling from a condition instead of a stat."),
    count: z
      .union([z.enum(["buffs", "debuffs", "targets", "hit"]), z.strictObject({ side: Side, where: UnitCond.optional(), seat: Id.optional() })])
      .optional()
      .describe("A count, as COUNTS says: the unit's buffs or debuffs, an action's targets or the units its hits landed on, or the units on a side that pass a test."),
    times: z.strictObject({ stat: StatKey, of: Of.optional() }).optional().describe("Multiplies the term by a stat, read live: \"X% per point of Y\" (Lifesteal, Siphon)."),
    of: Of.optional(),
  })
  .refine((s) => [s.stat, s.hp, s.stacks, s.amount, s.when, s.count].filter((x) => x !== undefined).length === 1, {
    message: "a scale names exactly one of stat, hp, stacks, amount, when or count",
  });
export type ScaleT = z.infer<typeof Scale>;

/** A number: base + Σ ratio × source (× times). */
export const Num = z.union([z.number(), z.strictObject({ base: z.number().optional(), scale: z.array(Scale).min(1) })]).meta({ id: "Num" });
export type NumT = z.infer<typeof Num>;

export const Value = z.union([
  z.enum(["hp", "hp_share", "mp_share", "buffs", "debuffs", "swing"]).describe("swing: the basic attack's interval now, its cooldown after Attack speed; highest is the slowest."),
  z.strictObject({ stat: StatKey }),
  z.strictObject({ stats: z.array(StatKey).min(1) }).describe("The highest of these stats (\"the foe with the highest Attack\")."),
  z.strictObject({ stacks: Id }),
]);

/** A seat in the party's formation, by its position id, or next / previous by slot order (wrapping round). */
export const Seat = Id;
const SEAT = "The unit in this seat of the party's formation (a position id), or `next` / `previous`: the seat after or before the reading unit's, by slot order, wrapping round and skipping empty seats.";

export const TargetRule = z.strictObject({
  side: Side,
  where: UnitCond.optional(),
  ifNone: z.literal("any").optional().describe("When `where` leaves nobody, use the whole side instead (\"if every foe is Taunting, any foe\"). With `ko: true`, nobody fallen means the living side, by the rule's other tests (\"a fallen ally, else the lowest\")."),
  exclude: z
    .enum(["targets", "other", "owner"])
    .optional()
    .describe("targets: skip the action's chosen targets (\"a second, random foe\", \"up to three other foes\"). Reactions only: other or owner, skip the event's other unit or the unit it's about (\"every other foe\", \"a random foe other than the one it hit\")."),
  seat: Seat.optional().describe(SEAT),
  pick: Pick.optional(),
  by: Value.optional().describe("Required for lowest and highest."),
  count: PosInt.optional().describe("Default 1."),
}).meta({ id: "TargetRule" });
export type TargetRuleT = z.infer<typeof TargetRule>;

/** True when at least `atLeast` units on `side` pass `where`, and no more than `atMost`. Checked when an action starts, or when a reaction or pulse resolves. */
export const Condition = z.strictObject({
  side: Side,
  where: UnitCond,
  atLeast: PosInt.optional().describe("At least this many pass. Default 1, or 0 when atMost is given."),
  atMost: z.number().int().min(0).optional().describe("At most this many pass (0: none does, \"no foe is Marked\")."),
  seat: Seat.optional().describe(SEAT),
}).meta({ id: "Condition" });
export type ConditionT = z.infer<typeof Condition>;

/** A test of one of a reaction's event units. */
export const EventUnitTest = z
  .strictObject({ unit: z.enum(["other", "owner"]).describe("other: the event's other unit (as `to: other`); owner: the unit the event is about (as `to: owner`)."), where: UnitCond.describe("What it must pass.") })
  .describe("Reactions only: the event's other unit, or the unit it's about, passes `where` (\"the foe it hit is Sundered\", \"the ally that took the hit is below half\").");
export const Test = z.union([Condition, EventUnitTest]);
export type TestT = z.infer<typeof Test>;

export const To = z.union([z.enum(keys(TO)), TargetRule]);
export type ToT = z.infer<typeof To>;
