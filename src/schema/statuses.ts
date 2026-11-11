/** Statuses: one duration, a stacking mode and removal, and what they do: pulses, triggers, reactions, stat changes, lockouts. */
import * as z from "zod";
import { Cause, EventName, Id, Label, Note, PosInt, StatKey, Tag, Text, Ticks, Whose } from "./primitives.js";
import { Condition, Num, Seat, TargetRule, Test, UnitCond } from "./numbers.js";
import { Effect, HitApply, Instance } from "./effects.js";

// ─────────────────────────────────────────────────────────────────────────────
// Statuses and reactions
// ─────────────────────────────────────────────────────────────────────────────

export const StatChange = z.strictObject({
  stat: StatKey,
  flat: Num.optional(),
  pct: Num.optional(),
  live: z.literal(true).optional().describe("Read whenever the holder's stats are worked out, from its other stats as they stand without this change (Thorns from Defense, Guard included), not once at application."),
});
/** A stat change from gear, a passive, a formation or a perk. Plain numbers. */
export const FixedStat = z.strictObject({ stat: StatKey, flat: z.number().optional(), pct: z.number().optional() });
export type FixedStatT = z.infer<typeof FixedStat>;

export const EventSpec = z.strictObject({
  event: EventName,
  whose: Whose.optional(),
  kind: z.enum(["basic", "ability", "extra", "bonus"]).optional().describe("Action and hit events, and ko, healed and overhealed: the kind of the action or hit behind it."),
  tags: z
    .array(Tag)
    .min(1)
    .optional()
    .describe("The event carries at least one of these tags. A hit's: its kind and type, `crit` when it crits, `area` when its effect is aimed at several units, `wide`, `bare`, and any tag its strike names. ko: the killing hit's (`physical`: a killing blow). healed and overhealed: `pulse`. status_gained: `area`."),
  notTags: z.array(Tag).min(1).optional().describe("The event carries none of these (`area`: a single-target hit; `bare`: not a second landing or a left-over)."),
  status: Id.optional().describe("Status events; damage events and heals: the status whose pulse or reaction dealt the damage or healed."),
  line: z.number().gt(0).max(100).optional().describe("hp_low and hp_high only, and required there: the line, in percent of max HP."),
  ability: z.array(Id).min(1).optional().describe("Action events and ko: the action was one of these abilities, each with its trained forms (\"when Backstab knocks a foe out\")."),
  does: z.array(Id).min(1).optional().describe("Action events: the action does one of these, as an ability filter's `does` (\"the next ability that deals damage\")."),
  paid: z.literal(true).optional().describe("action_resolve only: the action was paid for, in MP or as an HP price (a free cast isn't)."),
  counted: z.literal(true).optional().describe("Action events only: an ordinary action or a paid second cast, which count as casts; not a free repeat."),
  wasBelow: z.number().min(0).max(100).optional().describe("Hit events only: the unit hit was below this percent of its max HP as the hit landed, before its damage."),
  cause: z.array(Cause).min(1).optional().describe("status_ended only. Default: every cause."),
  other: Whose.optional().describe("Who the event's other unit is, from the holder's side: holder (a kill it landed, a status it applied, a heal or revive it gave), ally, foe, or any (there is one)."),
  source: z.literal("holder").optional().describe("Status events only: the status was applied by the holder (a Mark it gave, an Aegis it gave)."),
  seat: Seat.optional().describe("The unit the event is about sits in this seat of the party's formation (a position id, or next / previous from the holder's)."),
  amountAtLeast: z.number().optional().describe("The event's amount is at least this (\"a cast that paid MP\": 1)."),
  countAtLeast: PosInt.optional().describe("action_resolve only: its hits landed on at least this many units of the other side."),
  repeat: z
    .boolean()
    .optional()
    .describe("true matches only a repeat, false only the first: an action event of a recast; a fight_start a `restart` made happen again; a status_gained of an application marked as a copy. Default: both."),
});
export type EventSpecT = z.infer<typeof EventSpec>;

export const Reaction = z.strictObject({
  on: EventSpec,
  actor: z.enum(["holder", "source"]).optional().describe("Who acts. source only for statuses that know their source. Default holder."),
  if: z.union([Test, z.array(Test).min(1)]).optional().describe("Checked when the reaction resolves, every one must hold: a side's state (as an ability's `if`, read from the actor's side) or a test of the event's other unit or owner. When one fails, the reaction does nothing."),
  split: Id.optional().describe("Reactions that share this word and answer one event share its amount evenly (two pieces that move one fallen foe's fire, or carry one blow's left-over)."),
  do: z.array(Effect).min(1).describe("Each effect states its target (`to`)."),
});

/** Which abilities an ability change reaches. Both fields given: both must hold. */
export const AbilityFilter = z.strictObject({
  ability: z.array(Id).min(1).optional().describe("These abilities by id, each with its trained forms (a mythic naming its class's ability)."),
  does: z.array(Id).min(1).optional().describe("Abilities whose effects do one of these: revive, heal or damage, or apply this status (stun, silence, shield, guard...)."),
  single: z.literal(true).optional().describe("Abilities that aim at one foe: default targeting, or a rule that picks one foe first (not one aimed at every foe)."),
  first: z.literal(true).optional().describe("The first-slotted ability: the one the player put first."),
  basic: z.literal(true).optional().describe("The basic attack, in place of the abilities: only `pay` and `wait` mean anything on it."),
});
export type AbilityFilterT = z.infer<typeof AbilityFilter>;

/** A change to the holder's own abilities, read each time one is used. */
export const AbilityMod = z.strictObject({
  of: AbilityFilter.optional().describe("Absent: every ability the holder has."),
  if: UnitCond.optional().describe("The holder passes this when the ability is checked and when it pays (\"while it holds over half its MP\")."),
  mp: z.number().min(-100).optional().describe("Percent change to its MP cost: −20 a fifth less, −100 free, +50 half again. Changes add up; the cost never falls below 0."),
  hp: z
    .strictObject({
      pct: z.number().positive().describe("Percent of the ability's MP cost, as it stands after every other change's `mp` (a free cast costs no HP either), paid in HP as the pay effect pays."),
      share: z.literal(true).optional().describe("Paid as the same share of the payer's max HP as the cost is of the caster's max MP, not point for point."),
      floor: z.number().min(0).max(100).optional().describe("The ability waits rather than leave the holder below this percent of its max HP. With a `payer`: the payer pays only if it's left above this, and otherwise the change doesn't apply."),
      instead: z.literal(true).optional().describe("In place of the MP: the ability then costs no MP."),
      payer: z.literal("source").optional().describe("The unit that gave the status pays, not the caster, while it stands and can (a status that knows its source). An ability it can pay for needs no MP."),
    })
    .optional()
    .describe("An HP price, paid when the ability resolves: on top of its MP, or in its place."),
  pay: Num.optional().describe("An HP price of its own size, paid as the action resolves (a basic attack's: `of: { basic: true }`), never below 1 HP. The action's amounts can read it (`cost: hp`)."),
  cast: z.number().min(0).optional().describe("Its wind-up, in ticks, before cast-time reduction, in place of its own (\"winds up in a moment\": 1)."),
  wind: z.number().min(-100).optional().describe("Percent change to its wind-up, before cast-time reduction: +50 half again as long."),
  cooldown: z.number().min(-100).optional().describe("Percent change to its cooldown: +100 twice as long, −100 none (it's cast again whenever it can be)."),
  damage: z.number().optional().describe("Its hits deal this percent more, with the holder's boosts."),
  times: z
    .union([
      z.strictObject({ stacks: Id }).describe("The holder's stacks of this status (Cascade)."),
      z.strictObject({
        casts: z.literal(true),
        cap: PosInt,
        show: Id.optional().describe("An Intensity status the engine keeps on the holder at its highest count, for the player to see."),
      }).describe("The times this ability has been cast this fight (counted casts, as the cast finishes), up to cap: a count kept ability by ability (Crescendo)."),
    ])
    .optional()
    .describe("Every percentage of this change (mp, damage, heal, stacks, wind, cooldown) is multiplied by this count."),
  stacks: z
    .strictObject({ pct: z.number(), statuses: z.array(Id).min(1).optional() })
    .optional()
    .describe("Its applications of these statuses (absent: every Intensity status) add pct % more stacks, on top of the applier's boosts."),
  heal: z.number().optional().describe("Its heals heal this percent more."),
  target: TargetRule.optional().describe("Its own target rule, in place of the ability's (the Taunt rule applies, unless it has Seek)."),
  seek: z.literal(true).optional().describe("It has Seek: its first pick ignores Taunt."),
  wait: z.union([Condition, z.array(Condition).min(1)]).optional().describe("It also waits for these, as its own `if` does."),
  apply: z.array(HitApply).min(1).optional().describe("Statuses its hits apply as well, after its own."),
});
export type AbilityModT = z.infer<typeof AbilityMod>;

/** Crits by condition, for the holder's hits. */
export const CritRule = z.strictObject({
  tag: Tag.optional().describe("Only hits carrying this tag (basic, ability, extra, physical, area)."),
  when: UnitCond.optional().describe("Only hits on a unit that passes this, read as the hit lands."),
  chance: z.number().optional().describe("Points added to the hit's crit chance, after every stat change (100: it always crits, whatever else holds, Gambler's coin included)."),
  times: z.number().min(0).optional().describe("The hit's crit chance, after every stat change, is multiplied by this before any `chance` is added (3: tripled against the foes `when` names)."),
  cap: z.number().min(0).max(100).optional().describe("What this rule adds or multiplies never lifts the chance past this; a chance already higher stays as it is."),
  set: z.number().min(0).max(100).optional().describe("The hit's crit chance is this, whatever the stat and the other rules say: nothing raises it, and it wins over a stat set to a value (Gambler's coin). A rule that always crits still does."),
  bonus: z.number().optional().describe("Percent more crit bonus, the part of the crit multiplier above ×1: 100 makes ×1.5 into ×2."),
});
export type CritRuleT = z.infer<typeof CritRule>;

export const Status = z.strictObject({
  id: Id,
  name: Text.describe("Shown on its icon or sheet line, e.g. BURN."),
  text: Text.optional(),
  label: Label.describe("Drives removal, conditions and the batch its pulses resolve in. marker: neither buff nor debuff."),
  show: z.enum(["icon", "sheet", "stat"]).describe("icon: on the HP bar with its total. sheet: listed on the unit sheet. stat: shown as a stat."),
  tags: z.array(Tag).optional().describe("Tags that boosts (on its applications' stacks) and damage-taken modifiers (on its pulses) can name."),
  stacking: z.enum(["refresh", "fizzle", "intensity"]),
  perSource: z
    .strictObject({ endsWithSource: z.boolean().optional() })
    .optional()
    .describe("Per source mode: each source keeps its own copy, using `stacking`."),
  duration: Ticks.optional().describe("Absent: permanent, until the fight ends."),
  unremovable: z.boolean().optional(),
  survivesKO: z.boolean().optional(),
  cap: Num.optional().describe("Intensity: the most stacks. `holder` scales read the holder."),
  stats: z.array(StatChange).optional(),
  boosts: z
    .array(z.strictObject({ tag: Tag, pct: Num }))
    .optional()
    .describe("The holder's outgoing damage or healing, by tag. A scale `of: target` reads the unit being hit (Judgement, Brittle)."),
  taken: z.array(z.strictObject({ tag: Tag.optional(), pct: Num })).optional().describe("Damage-taken modifiers. No tag: all damage."),
  absorb: z.literal(true).optional().describe("Intensity only: soaks damage after mitigation, one stack per point."),
  block: z
    .strictObject({ share: z.number().gt(0).max(100) })
    .optional()
    .describe("Blocks the next damage above this percent of the holder's max HP, from any source, after mitigation and before absorbs; then the status ends (Aegis)."),
  lockout: z
    .strictObject({
      covers: Tag,
      interrupt: z.boolean().optional().describe("A cast in progress that the lockout covers is lost (see ruleset.lostCast)."),
      pause: z.boolean().optional().describe("A cast in progress that the lockout covers is held, not lost: its wind-up resumes where it was when the lockout ends."),
    })
    .optional(),
  riders: z.array(z.strictObject({ on: Tag, add: Instance })).optional().describe("Adds a rider to the holder's hits that carry `on`."),
  adds: z
    .array(z.strictObject({ on: Tag, amount: Num }))
    .min(1)
    .optional()
    .describe("Adds to the amount of the holder's hits that carry `on`, before boosts, crit and Defense (\"extra damage equal to a sixth of its Defense\"). `target` is the unit hit; an Intensity status adds it for each stack. A bare hit takes none."),
  seek: Tag.optional().describe("The holder's actions carrying this tag (basic, ability or all) have Seek: their first pick ignores Taunt."),
  strike: z
    .strictObject({
      chance: z.number().min(0).max(100).optional().describe("Percent, rolled on the holder's dice. Default: always."),
      scale: StatKey.optional().describe("A stat read live whose value is added to `chance` (Double strike)."),
      to: z.union([z.literal("target"), TargetRule]).describe("The same target, or a rule (Arc: a second, random foe, excluding the target). A rule that picks several units strikes each of them (every other foe)."),
      share: z.number().positive().optional().describe("Percent of the weapon's damage each strike deals. Default 100."),
      kind: z.enum(["extra", "bonus"]).optional().describe("Default extra: an extra strike (Double strike's). bonus: a hit with its own name (Arc's second hit, a leap, a volley's arrow), which nothing that waits on extra strikes answers; on a unit other than the target it's `wide`."),
      carry: z.literal(true).optional().describe("A bonus strike carries what the swing carries: the weapon's attached statuses, and the statuses the holder's basic attacks apply through its statuses' riders. Without it a bonus strike carries neither. (An extra strike carries the weapon's attached statuses, and the riders under `echo`.)"),
      apply: z.array(HitApply).optional().describe("Statuses each strike applies itself, as a weapon's attached ones (the acting unit is `self`)."),
      when: UnitCond.optional().describe("Only while the holder passes this, read as the basic attack resolves (\"every third basic attack\": a count at two)."),
      tag: Tag.optional().describe("A tag its hit events carry."),
      chain: z
        .strictObject({ times: PosInt, share: z.number().positive().max(100) })
        .optional()
        .describe("Each strike that lands rolls `chance` again for one more, at most `times` more after the first, each share % of the one before. It takes the place of a plain strike on the unit that reads the same `scale` stat (Flurry wraps over Double strike), so a swing rolls that chance once. The one bend of \"extra strikes don't chain\"."),
    })
    .optional()
    .describe("After each of the holder's basic attacks: one more hit with the weapon's damage, of kind extra, at `to`. Extra strikes don't chain."),
  pulse: z
    .strictObject({
      every: z.number().positive(),
      do: z.array(Effect).optional().describe("Absent: the pulse is only a timer, for an Intensity drop."),
      if: z.union([Condition, z.array(Condition).min(1)]).optional().describe("A pulse whose conditions fail does nothing that beat (\"while any foe burns\"); an Intensity drop still happens."),
    })
    .optional()
    .describe("A repeating effect. Intensity: its trigger."),
  trigger: z.strictObject({ on: EventSpec, do: z.array(Effect).optional() }).optional().describe("Intensity only: an event trigger."),
  drop: z
    .union([z.literal("all"), z.strictObject({ fraction: z.number().gt(0).max(1) }), z.strictObject({ count: z.number().positive() })])
    .optional()
    .describe("Intensity only: how far the total drops on each trigger."),
  crit: z
    .strictObject({ chance: z.number().min(0).max(100), multiplier: z.number().min(100).optional(), fromSource: z.boolean().optional() })
    .optional()
    .describe("Turns crits on for its pulses, a rare exception. fromSource: statuses that know their source only, the source's crit stats and dice."),
  reactions: z.array(Reaction).optional(),
  focus: z
    .literal(true)
    .optional()
    .describe("Marked: the holder's foes' basic attacks pick a holder while one can be picked, by draw among several, under the Taunt rule (Seek follows it past a Taunting foe). Abilities keep their own targeting."),
  single: z
    .literal(true)
    .optional()
    .describe("Marked: each applier keeps one copy: applying it to a unit ends the copy that applier gave anywhere else. Statuses that know their source only."),
  aim: z
    .strictObject({
      rule: TargetRule.describe("Its Taunt rule is an action's own; an all-pick hits every unit it finds, each hit a basic attack's."),
      first: z.literal(true).optional().describe("Ahead of a Marked foe. Without it, a Marked foe comes first."),
    })
    .optional()
    .describe("The holder's basic attacks pick by this rule. When it finds nobody, the next in line picks: a Marked foe, then the default."),
  mods: z.array(AbilityMod).min(1).optional().describe("Changes to the holder's own abilities, read each time one is used. An Intensity status's changes don't grow with its stacks."),
  crits: z.array(CritRule).min(1).optional().describe("Crits by condition on the holder's hits."),
  echo: z
    .literal(true)
    .optional()
    .describe("The holder's extra strikes are heard as basic attacks by its statuses' reactions and triggers that name kind basic, unless that status also names kind extra for the same event, or gives strikes itself. Boosts still see them as extra."),
  set: z
    .array(z.strictObject({ stat: StatKey, value: z.number() }))
    .min(1)
    .optional()
    .describe("After every other change, the holder's stat is this value while it holds the status."),
  cover: z
    .strictObject({ share: z.number().gt(0).max(100) })
    .optional()
    .describe("When a hit on another living ally would deal it more than share % of its max HP, after its mitigation and before its block and absorbs, the holder takes the whole hit instead: it resolves again against the holder, statuses and riders included, keeping its crit and without a second dodge. A hit moves once."),
  floor: z
    .strictObject({ spend: z.literal(true).optional().describe("The status ends (cause spent) the first time it holds a blow.") })
    .optional()
    .describe("The holder's HP can't fall below 1 while it holds this: a blow that would knock it out leaves it at 1, and nothing falls."),
  heals: z.literal("own").optional().describe("Only its own heals land on the holder (its abilities, its Lifesteal, its statuses' reactions); heals from others, a Regen they gave included, restore nothing."),
  healCap: z
    .number()
    .gt(0)
    .max(100)
    .optional()
    .describe("The holder can't be healed above this percent of its max HP, and loses what it has above it as the status lands (not damage, not a price). Healing past it is healing past full; at the cap it reads as just under it (\"at half it counts as below half\")."),
  soak: z.literal("mp").optional().describe("Damage that would reach the holder's HP comes out of its MP instead, point for point, while it has any: after a block and absorbs, before HP."),
  divert: z
    .strictObject({
      what: z.string().min(1).describe("`mp`: every MP the holder would gain. Or a status's id: every application of it the holder would gain (a Shield)."),
      to: z.union([z.literal("source"), TargetRule]).describe("Who gets it instead: the unit that gave this status, or a rule read from the holder. With nobody there, the holder keeps it."),
    })
    .optional()
    .describe("What the holder would gain goes to another unit instead, once: what's sent on isn't sent on again."),
  party: z.literal(true).optional().describe("A rule its side holds once: of the units on a side that hold this status, only the first standing, in slot order, answers an event with its reactions and trigger."),
  oncePerEvent: z.literal(true).optional().describe("A counter: one event adds one application to a holder, however many of its reactions count it."),
  damp: z
    .strictObject({ pct: z.number().gt(0).max(100), window: z.number().positive() })
    .optional()
    .describe("Intensity with a cap: a chain of cappings dies down. Stacks an application marked `passed` adds to a unit are cut to pct % for each time that unit has capped this status in the last `window` ticks, in fractions of a stack."),
  swap: z.tuple([StatKey, StatKey]).optional().describe("The holder's two stats are swapped as they stand from its class, gear and seat; statuses change them as usual after that."),
  tireless: z.literal(true).optional().describe("The holder's basic attacks never wait on its abilities: it keeps swinging on its own clock through their wind-ups and recoveries."),
  order: z.literal("random").optional().describe("Each time the holder is free to act, it uses one of its available abilities picked at random, whatever order they're slotted in."),
  borrow: z
    .strictObject({ from: TargetRule.describe("Read from the holder (\"the other ally with the highest Attack\", the unit in a seat).") })
    .optional()
    .describe("The holder's basic attacks also carry the riders of another unit's: the statuses that unit's basic attacks apply through its statuses' reactions, on the same conditions, with stacks read off the holder, and never twice from a status both hold. What's borrowed isn't borrowed on."),
  revives: z
    .strictObject({
      ready: z.boolean().optional().describe("true: every action ready; false: every action on cooldown. It wins over the revive's own `ready`, and false wins over true."),
      hp: Num.optional().describe("The HP they come back with, in place of the revive's (target is the revived unit)."),
    })
    .optional()
    .describe("Every revive the holder makes, from its abilities and its statuses' reactions alike (Einherjar)."),
  note: Note.optional(),
});
export type StatusT = z.infer<typeof Status>;
export type ReactionT = z.infer<typeof Reaction>;
