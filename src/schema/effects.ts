/** The effects actions, pulses, triggers and reactions are made of. */
import * as z from "zod";
import { DamageType, Id, Kind, Label, PosInt, Tag, Ticks } from "./primitives.js";
import { Num, TargetRule, To } from "./numbers.js";

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
/** What only an apply effect can say (not a hit's attached status). */
const applyMore = {
  passed: z.literal(true).optional().describe("Stacks passed on from a status that capped (a shatter's cold): cut by the status's own `damp` for each time the receiver has capped lately. An application made in answer to a passed one is passed too."),
  copy: z.literal(true).optional().describe("A copy: its status_gained is a repeat, which `repeat: false` filters skip, so what copies a status never copies its own copies."),
  rider: z.literal(false).optional().describe("In a reaction to the holder's own hit_lands, an application to `other` is a rider: part of what the swing carries. false: this one isn't (it isn't borrowed or carried, and a bare hit doesn't skip it)."),
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
    z
      .strictObject({ op: z.literal("heal"), amount: Num, final: z.literal(true).optional().describe("What it would restore past full is lost: it fires no overhealed (healing passed on isn't passed on again)."), to: To.optional() })
      .describe("Restores HP, never above max. Never mitigated."),
    z
      .strictObject({ op: z.literal("mp"), amount: Num, final: z.literal(true).optional().describe("What it would restore past the pool is lost: it fires no mp_over, and nothing diverts it (MP sent on isn't sent on again)."), to: To.optional() })
      .describe("Restores MP (positive) or drains it (negative)."),
    z.strictObject({ op: z.literal("apply"), ...applyFields, ...applyMore, to: To.optional() }).describe("Applies a status, by its stacking mode."),
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
        except: z.array(Id).min(1).optional().describe("Statuses it never removes (the enemy-only ones a theft leaves alone)."),
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
        which: z.union([z.enum(["basic", "abilities", "longest", "soonest", "event", "first", "slowest"]), z.strictObject({ ability: z.array(Id).min(1) })]).describe("Which timers, as COOLDOWN_WHICH says. In an ability's own effect, longest and soonest never pick that ability on its caster."),
        set: z
          .union([
            z.enum(["ready", "full"]),
            z.strictObject({ less: z.number().positive() }),
            z.strictObject({ times: z.number().min(0).max(100) }),
            z.strictObject({ atMost: z.number().min(0).max(100) }),
            z.strictObject({ lessPct: Num }),
          ])
          .describe("What happens to them, as COOLDOWN_SET says."),
        to: To.optional(),
      })
      .describe("Changes the cooldown left on a unit's basic attack or abilities: ready now, a full cooldown, some ticks closer, a share of what's left, or at most a share of its full one. A wind-up already under way carries on."),
    z
      .strictObject({
        op: z.literal("pay"),
        hp: Num.describe("HP paid. Negative pays nothing."),
        drain: z.literal(true).optional().describe("Lost, not paid: a drain or a drawback, which fires no hp_paid."),
        to: To,
      })
      .describe("A price in HP: lost at once, not damage, so no Shield soaks it, no Defense cuts it and nothing reacts to it as damage; it never takes the payer below 1 HP. It fires hp_paid. An ability's HP price is this effect on itself, after whatever reads its HP first."),
    z
      .strictObject({
        op: z.literal("strike"),
        share: z.number().positive().optional().describe("Percent of the damage it's sized from. Default 100."),
        of: z
          .enum(["weapon", "hit", "dealt", "over"])
          .optional()
          .describe(
            "weapon (the default): the actor's basic attack against each target, its damage with the weapon's riders and statuses, in whatever shape its basic attacks have (their boosts). hit: the raw amount of the hit that set the reaction off (before Defense), resolved afresh. dealt: what that hit dealt, again, as it is: no dodge, no crit, no boost and no Defense (a second landing); it's bare. over: what a killing blow had left over (a reaction to ko), which meets Evasion and Defense but isn't boosted or crit again; it's bare.",
          ),
        amount: Num.optional().describe("A hit of its own size, in place of `of` (a blow from Attack, not from the weapon)."),
        apply: z.array(HitApply).optional().describe("With `amount`: statuses the hit applies."),
        kind: z.enum(["extra", "bonus"]).optional().describe("The hit's kind. Default bonus: a hit with its own name, which nothing that waits on basic attacks or extra strikes answers."),
        carry: z.literal(true).optional().describe("The hit carries what the swing carries: the statuses the actor's basic attacks apply, from its statuses' riders (as an extra strike's does under `echo`)."),
        by: TargetRule.optional().describe("Who strikes, in place of the actor: a rule read from the actor (\"the other ally with the highest Attack strikes the attacker\")."),
        tag: Tag.optional().describe("A tag its hit events carry, for filters (`notTags`: a jump that doesn't jump again)."),
        split: z.literal(true).optional().describe("The amount is divided evenly among the targets."),
        seek: z.literal(true).optional().describe("`to` is a rule that picks as an action's own would, past any Taunt: a Mark takes its fallback to a random foe."),
        after: z.number().positive().optional().describe("With `of: dealt`: the hit lands this many ticks later, if its target still stands."),
        to: To.optional(),
      })
      .describe("Reactions only: a hit out of turn by the actor at each target (the dodge's riposte, a second landing, a blow carried past a kill). It fires hit events and never brings extra strikes of its own."),
    z
      .strictObject({
        op: z.literal("one"),
        of: z.array(HitApply).min(2).describe("The statuses to pick from, each with its own stacks."),
        count: PosInt.optional().describe("How many different ones. Default 1."),
        same: z.literal(true).optional().describe("One pick for every target, not one each."),
        pick: z.literal("most").optional().describe("Not at random: the one its target holds the most stacks of (level ones at random); nothing on a target that holds none."),
        to: To.optional(),
      })
      .describe("Applies one of these statuses (or `count` of them), picked at random on the actor's dice."),
    z
      .strictObject({
        op: z.literal("recast"),
        which: z.enum(["event", "first"]).optional().describe("event (the default): the action that set the reaction off. first: the actor's first-slotted ability, whatever its cooldown, if its conditions hold and nothing locks it out."),
        paid: z.literal(true).optional().describe("The cast is paid for as a cast of its own, in MP and any HP price; if it can't be, there is none. Such a cast counts as a cast (`counted`), where a free repeat doesn't."),
      })
      .describe("Reactions only: an ability resolves again at once, with no wind-up, choosing its targets afresh by its own rule, its cooldown untouched; free unless `paid`. By default, in a reaction to the holder's own action_resolve, the action that set it off. The repeat fires its own action events, which `repeat: false` filters skip."),
    z
      .strictObject({
        op: z.literal("spend"),
        status: Id,
        share: z.number().gt(0).max(100).optional().describe("Percent of the stacks held, in whole stacks, rounded down."),
        count: z.number().positive().optional().describe("This many stacks."),
        to: To,
      })
      .describe("Takes stacks off an Intensity status the target holds (all of them, without share or count); under one stack it ends."),
    z
      .strictObject({ op: z.literal("pass"), label: Label, except: z.array(Id).min(1).optional(), to: To })
      .describe("Every status of this label the actor holds passes to each target: the actor is rid of it, and it lands as a fresh application at its own length, with the stacks the actor held. Unremovable statuses stay."),
    z
      .strictObject({ op: z.literal("share"), to: To })
      .describe("Reactions to status_gained only: each target gains the same status in the same stacks, as a copy. Only a status laid at a moment is shared: one with an icon that has a duration, stacks or a block; not a state its holder keeps while something is true of it."),
    z
      .strictObject({ op: z.literal("riders"), plain: z.literal(true).optional().describe("Only the riders every swing adds: none that waits for a crit, a tag or a test, and none borrowed."), to: To })
      .describe("Reactions only: each target gains what the actor's basic attacks carry, in the stacks one swing adds. Two units answering one event add a status from one source once."),
    z
      .strictObject({ op: z.literal("restart"), to: To })
      .describe("The start-of-fight effects of each target's gear and seat happen again: their reactions to fight_start, as a repeat (`repeat: false` keeps a price or a drawback out). One event restarts a unit once."),
    z.strictObject({ op: z.literal("fell"), to: To }).describe("Each target is knocked out at once: not damage, so no Shield, Aegis or floor stands in the way. The actor's kill, but no hit's."),
    z
      .strictObject({ op: z.literal("summon"), enemy: Id, count: PosInt.optional().describe("Default 1."), hp: z.number().int().min(-90).optional().describe("The summoned units' own max HP, +% (default 0); the fight's change to every foe applies on top.") })
      .describe("Brings new units into the fight on the actor's side, up to ruleset.maxEnemies living units on that side. They enter with every action on cooldown."),
    z
      .strictObject({ op: z.literal("replace"), enemy: Id, count: PosInt.optional().describe("Default 1."), to: To.optional() })
      .describe("Each target leaves the fight (not a knockout: its statuses end, nothing reacts to a KO) and `count` new units take its place, up to the cap."),
  ])
  .meta({ id: "Effect" });
export type EffectT = z.infer<typeof Effect>;
export type DamageEffectT = Extract<EffectT, { op: "damage" }>;
export type ApplyT = z.infer<typeof HitApply>;
