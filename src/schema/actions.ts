/** Weapon kinds (speed, damage type, hands) and actions: a weapon's basic attack, and abilities. */
import * as z from "zod";
import { Id, Note, PosInt, Text, Ticks } from "./primitives.js";
import { Condition, Num, TargetRule } from "./numbers.js";
import { Effect, HitApply, Instance } from "./effects.js";

// ─────────────────────────────────────────────────────────────────────────────
// Weapon kinds and actions
// ─────────────────────────────────────────────────────────────────────────────

const Hands = z.union([z.literal(1), z.literal(2)]);

export const WeaponKind = z
  .strictObject({
    id: Id,
    name: Text,
    type: z.enum(["physical", "magical"]),
    cooldown: z.number().positive().describe("The kind's speed: the base cooldown of its basic attack, in ticks."),
    hands: Hands.describe("2: a two-handed weapon, which empties the offhand."),
    note: Note.optional(),
  })
  .describe("A kind of weapon: its speed, damage type and hands. Every weapon belongs to one, and a class can use only its kinds.");
export type WeaponKindT = z.infer<typeof WeaponKind>;

/** An armor type or an offhand kind: a name that says who can wear a piece. */
export const GearKind = z
  .strictObject({ id: Id, name: Text, note: Note.optional() })
  .describe("An armor type or an offhand kind. A class wears only its own.");
export type GearKindT = z.infer<typeof GearKind>;

export const Weapon = z
  .strictObject({
    kind: Id.optional().describe("A weapon kind: sets type, cooldown and hands. Any field stated here overrides the kind's."),
    type: z.enum(["physical", "magical"]).optional(),
    hands: Hands.optional(),
    hits: PosInt.optional(),
    cooldown: z.number().positive().optional().describe("The base cooldown, in ticks. Required without a kind."),
    amount: Num.describe("Per hit: a base, plus whatever scaling the weapon states. Nothing scales it by default."),
    cast: Ticks.optional().describe("Default 0: basic attacks have no wind-up unless the weapon states one."),
    recovery: Ticks.optional().describe("Default: ruleset.basicRecovery × the base cooldown."),
    riders: z.array(Instance).optional(),
    apply: z.array(HitApply).optional(),
  })
  .describe("Sets the basic attack.");
export type WeaponT = z.infer<typeof Weapon>;

export const Target = z.union([z.enum(["foe", "ally", "self"]), TargetRule]);

export const Ability = z.strictObject({
  id: Id,
  class: Id.optional().describe("Owning class. Absent: an enemy's ability."),
  name: Text,
  text: Text,
  mp: z.number().min(0).optional(),
  cast: Ticks.optional().describe("Default: ruleset.abilityCast."),
  cooldown: Ticks,
  recovery: Ticks.optional().describe("Default: ruleset.abilityRecovery."),
  if: z
    .union([Condition, z.array(Condition).min(1), z.strictObject({ any: z.array(Condition).min(2) })])
    .optional()
    .describe("Checked when the action starts: what the ability waits for. Several conditions must all hold; `any`: at least one must."),
  target: Target.optional().describe("foe (default): a foe by Aggro, under the Taunt rule. ally: a random ally. Or a stated rule. Chosen when the action resolves."),
  seek: z.boolean().optional().describe("Its first pick ignores Taunt."),
  do: z.array(Effect).min(1),
  statuses: z.array(Id).min(1).optional().describe("Statuses its unit holds while the ability is equipped, applied at fight start and on a revive as gear's are (a version that listens all fight)."),
  note: Note.optional(),
});
export type AbilityT = z.infer<typeof Ability>;
