/** The effects actions, pulses, triggers and reactions are made of. */
import * as z from "zod";
import { DamageType, Id, Kind, Label, PosInt, Tag, Ticks } from "./primitives.js";
import { Num, To } from "./numbers.js";

// ─────────────────────────────────────────────────────────────────────────────
// Effects
// ─────────────────────────────────────────────────────────────────────────────

export const Instance = z.strictObject({
  type: DamageType,
  amount: Num,
});
export type InstanceT = z.infer<typeof Instance>;

const applyFields = {
  status: Id,
  stacks: Num.optional().describe("Intensity: stacks added, scaled only as stated here, plus the applier's boosts that name the status or its tags. Default 1."),
  duration: z.union([Ticks, z.literal("permanent")]).optional().describe("Default: the status's own. 0 only for an instant lockout."),
  chance: z.number().min(0).max(100).optional().describe("Percent, rolled on the applier's dice. Default: guaranteed."),
};
/** A status attached to a hit: applies whenever the hit occurs, even if BLOCKED or IMMUNE; never if evaded. */
export const HitApply = z.strictObject(applyFields);

export const Effect = z
  .discriminatedUnion("op", [
    z
      .strictObject({
        op: z.literal("damage"),
        type: DamageType,
        amount: Num,
        hits: PosInt.optional().describe("Actions only. Each hit resolves in order and reads the state left by the earlier ones."),
        riders: z.array(Instance).optional().describe("Actions only: extra instances attached to each hit."),
        apply: z.array(HitApply).optional().describe("Actions only: statuses attached to each hit."),
        to: To.optional(),
      })
      .describe("Deals damage. In an action, each hit is a hit; in a pulse or reaction it is not, and fires no hit events."),
    z.strictObject({ op: z.literal("heal"), amount: Num, to: To.optional() }).describe("Restores HP, never above max. Never mitigated."),
    z.strictObject({ op: z.literal("mp"), amount: Num, to: To.optional() }).describe("Restores MP (positive) or drains it (negative)."),
    z.strictObject({ op: z.literal("apply"), ...applyFields, to: To.optional() }).describe("Applies a status, by its stacking mode."),
    z
      .strictObject({
        op: z.literal("remove"),
        label: Label.describe("buff or debuff; marker only with `status`, to lift one's own bookkeeping."),
        status: Id.optional(),
        kind: Kind.optional(),
        tag: Tag.optional(),
        count: PosInt.optional().describe("Default: all."),
        order: z.enum(["newest", "random"]).optional().describe("Which go first when fewer than all are removed. Default newest."),
        move: z.literal(true).optional().describe("Each status removed passes to the acting unit as it was, its stacks and time left with it, unless the actor is immune to it (a buff stolen)."),
        to: To.optional(),
      })
      .describe("Removes buffs or debuffs, optionally narrowed to a named status or an effect kind. Unremovable statuses stay, and so do the buffs of a unit with immune:dispel."),
    z
      .strictObject({
        op: z.literal("revive"),
        hp: Num.describe("HP the unit comes back with (`target` is the revived unit)."),
        ready: z.boolean().optional().describe("true: every action ready. Default: every action on cooldown, as at the start of a fight. The reviver's `revives` (a status field) wins over this."),
        after: z.number().positive().optional().describe("The unit stands this many ticks later instead, if the fight hasn't ended and nothing has raised it meanwhile; the reviver needn't be standing then (\"stands up a few ticks later\")."),
        to: To.optional(),
      })
      .describe("Raises a knocked-out unit, one knocked out in an earlier fight included. Its targets must ask for `ko: true`."),
    z
      .strictObject({
        op: z.literal("cooldown"),
        which: z.union([z.enum(["basic", "abilities", "longest", "soonest", "event"]), z.strictObject({ ability: z.array(Id).min(1) })]).describe("Which timers, as COOLDOWN_WHICH says."),
        set: z
          .union([
            z.enum(["ready", "full"]),
            z.strictObject({ less: z.number().positive() }),
            z.strictObject({ times: z.number().min(0).max(100) }),
            z.strictObject({ atMost: z.number().min(0).max(100) }),
          ])
          .describe("What happens to them, as COOLDOWN_SET says."),
        to: To.optional(),
      })
      .describe("Changes the cooldown left on a unit's basic attack or abilities: ready now, a full cooldown, some ticks closer, a share of what's left, or at most a share of its full one. A wind-up already under way carries on."),
    z
      .strictObject({ op: z.literal("pay"), hp: Num.describe("HP paid. Negative pays nothing."), to: To })
      .describe("A price in HP: lost at once, not damage, so no Shield soaks it, no Armor cuts it and nothing reacts to it; it never takes the payer below 1 HP. An ability's HP price is this effect on itself, after whatever reads its HP first."),
    z
      .strictObject({
        op: z.literal("strike"),
        share: z.number().positive().optional().describe("Percent of the damage it's sized from. Default 100."),
        of: z.enum(["weapon", "hit"]).optional().describe("weapon (the default): the actor's basic attack against each target, its damage with the weapon's riders and statuses, as an extra strike's. hit: the raw amount of the hit that set the reaction off (before Armor or Magic resist), in that hit's damage type."),
        to: To.optional(),
      })
      .describe("Reactions only: a hit of kind extra by the actor at each target (the dodge's riposte, the blow returned for an ally). It can crit and be dodged, meets Armor or Magic resist, and fires hit events; it never brings extra strikes of its own."),
    z
      .strictObject({ op: z.literal("one"), of: z.array(HitApply).min(2).describe("The statuses to pick from, each with its own stacks."), to: To.optional() })
      .describe("Applies one of these statuses, picked at random on the actor's dice."),
    z
      .strictObject({ op: z.literal("recast") })
      .describe("Reactions to the holder's own action_resolve only: the action that set it off resolves again at once, with no wind-up and no MP, choosing its targets afresh by its own rule, its cooldown untouched. The repeat fires its own action events, which `repeat: false` filters skip."),
    z
      .strictObject({ op: z.literal("summon"), enemy: Id, count: PosInt.optional().describe("Default 1.") })
      .describe("Brings new units into the fight on the actor's side, up to ruleset.maxEnemies living units on that side. They enter with every action on cooldown."),
    z
      .strictObject({ op: z.literal("replace"), enemy: Id, count: PosInt.optional().describe("Default 1."), to: To.optional() })
      .describe("Each target leaves the fight (not a knockout: its statuses end, nothing reacts to a KO) and `count` new units take its place, up to the cap."),
  ])
  .meta({ id: "Effect" });
export type EffectT = z.infer<typeof Effect>;
export type DamageEffectT = Extract<EffectT, { op: "damage" }>;
export type ApplyT = z.infer<typeof HitApply>;
