/**
 * Memory Dungeon Game: content schema, v0.7 (the core set).
 *
 * One data format for everything the engine runs on. Step 4 replaced schema
 * 0.3's turn-based rule language with the director's combat design; the core
 * set (docs/core-set/) builds on it: fights run on ticks, and everything that
 * happens on an event or a timer is a status. Content is built from
 *   - stats (a registry, plus the immune:... families),
 *   - weapon kinds (speed, damage type and hands, shared by gear and enemies),
 *     armor types and offhand kinds (who wears what),
 *   - statuses (bundles of effects with one duration, stacking mode and removal),
 *   - actions (a weapon's basic attack, and abilities),
 *   - targeting rules and conditions,
 * and the closed sets below, which each need engine code.
 *
 * Text fields are split in two kinds:
 *   - `name`, `text`: player-facing. The engine never reads them.
 *   - `note`: designer-only. Never shown, never read by the engine.
 *
 * Schema 0.6 dropped step 1's verbs, traits and keyholes: the core set's own
 * vocabulary (statuses, special stats, effects and challenges) replaces them,
 * and lives in the documents, not the data. Perks stay in the tech, unused by
 * the core set, which has no progression yet.
 *
 * Schema 0.7 (step 5j, the director's rule of Oct 29, 2026): two kinds of
 * damage and nothing else. Physical meets Armor and Evasion; magical meets
 * Magic resist and is never dodged; a status's own damage is untyped. No
 * elements and no physical subtypes. Gear in four slots (weapon, armor,
 * offhand, amulet), with armor types and offhand kinds, two-handed weapons,
 * and mythic pieces that fit one class.
 */
import * as z from "zod";

export const SCHEMA_VERSION = "0.7" as const;

// ─────────────────────────────────────────────────────────────────────────────
// Primitives
// ─────────────────────────────────────────────────────────────────────────────

export const Id = z
  .string()
  .regex(/^[a-z][a-z0-9_]*$/, { message: "ids are lower_snake_case and start with a letter" });
export const Text = z.string().min(1).describe("Player-facing text. The engine never reads it.");
export const Note = z
  .string()
  .min(1)
  .describe("Designer note. Never shown to players and never read by the engine.");
const Fraction = z.number().min(0).max(1);
const PosInt = z.number().int().min(1);
const IntRange = z.tuple([z.number().int().min(0), z.number().int().min(0)]);
/** Ticks. The engine counts 1,000 sub-ticks per tick, so a timing has at most 3 decimals. */
const Ticks = z.number().min(0);

/** A stat key: a registry id, or a family member such as immune:status:stun. */
export const StatKey = z
  .string()
  .regex(/^[a-z][a-z0-9_]*(:[a-z0-9_]+)*$/, { message: "stat keys are lower_snake_case, with ':' between a family's parts" });
/** A tag that boosts, damage-taken modifiers, lockouts, riders and event filters match: see TAGS. */
export const Tag = StatKey;

function keys<T extends Record<string, string>>(o: T) {
  return Object.keys(o) as [keyof T & string, ...(keyof T & string)[]];
}

// ─────────────────────────────────────────────────────────────────────────────
// Closed sets. Each needs engine code, so adding one is a schema version bump
// plus an engine change. The descriptions are the contract and feed PRIMITIVES.md.
// ─────────────────────────────────────────────────────────────────────────────

export const SUBTICKS = 1000;

export const TYPES = {
  physical: "Meets Evasion and Armor.",
  magical: "Meets Magic resist, a percentage: above 0 RESIST, 100 IMMUNE. Never dodged.",
  none: "Untyped: never dodged, never reduced by Armor or Magic resist. Not allowed in actions; the type of a status's own damage.",
} as const;
export const DamageType = z.enum(keys(TYPES));

/** The four gear slots every unit has. */
export const SLOTS = {
  weapon: "Sets the basic attack through its weapon kind. A class can use only its kinds. A two-handed weapon empties the offhand.",
  armor: "Of an armor type. A class wears only its types.",
  offhand: "Of an offhand kind. A class holds only its kinds, and nothing under a two-handed weapon.",
  amulet: "No restrictions.",
} as const;
export const Slot = z.enum(keys(SLOTS));
export type SlotT = z.infer<typeof Slot>;

/** Stats the engine itself reads. The registry must define each, with this kind. */
export const ENGINE_STATS = {
  max_hp: ["amount", "Max HP. A unit is KO'd at 0 HP."],
  max_mp: ["amount", "Max MP. Abilities cost MP, paid when they resolve."],
  attack: ["amount", "Scales only what states it. By convention, physical things do."],
  magic: ["amount", "Scales only what states it. By convention, magical things do."],
  armor: ["amount", "Reduces each physical hit: to hit² ÷ (hit + ruleset.armorK × Armor) when armorK is set; else a flat ruleset.armorRatio × Armor, down to 0 (BLOCKED)."],
  aggro: ["amount", "Default targeting picks foes weighted by draw: Aggro through ruleset.draw's curve, or Aggro itself without one. Its floor must be above 0."],
  magic_resist: ["points", "Magic resist, in percent: cuts each magical hit or pulse by that share. Positive shows RESIST, 100 IMMUNE."],
  attack_speed: ["points", "Basic attack cooldown ÷ (1 + stat/100), down to its recovery. Haste, Slow and Chill act through it."],
  cooldown_reduction: ["points", "Ability cooldowns ÷ (1 + stat/100)."],
  cast_time_reduction: ["points", "Cast times ÷ (1 + stat/100)."],
  crit_chance: ["points", "Percent chance that an action's damage or heal crits."],
  crit_multiplier: ["points", "A crit multiplies by this percent (150 is ×1.5). Crit damage raises it."],
  evasion: ["points", "Percent chance to evade a physical hit, after Accuracy, under its cap."],
  accuracy: ["points", "Reduces the target's Evasion, down to 0. Negative adds to it."],
  healing_received: ["points", "Heals received × (1 + stat/100). Rot lowers it."],
  forced: ["points", "Above 0: Taunting. A foe's first pick must go to a Taunting unit unless its action has Seek."],
  forbidden: ["points", "Above 0: Hidden. Foes can't pick this unit by any targeting but `all`, unless every candidate is Hidden."],
} as const;

export const STAT_FAMILIES = {
  "immune:status:<status>": "Above 0: immune to that status.",
  "immune:kind:<kind>": "Above 0: immune to every status containing that effect kind.",
  "immune:kind:<kind>:<tag>": "Above 0: immune to statuses containing that effect kind with that tag (a lockout's `covers`, a stat change's stat, a boost's or modifier's tag).",
  "immune:debuffs": "Above 0: immune to every debuff.",
  "immune:damage": "Above 0: takes no damage (IMMUNE), and so is immune to statuses that deal damage.",
  "immune:dispel": "Above 0: none of its buffs can be removed.",
} as const;

export const KINDS = {
  stat: "A stat change. Tag: the stat.",
  boost: "A damage or healing boost. Tag: the boost's tag.",
  taken: "A damage-taken modifier. Tag: its tag, if any.",
  absorb: "An absorb, such as a shield.",
  block: "A block: the next damage above a share of max HP is blocked, then the status ends (Aegis).",
  lockout: "A lockout. Tag: what it covers.",
  action_change: "A rider added to the holder's actions, Seek, or an extra strike.",
  pulse: "A repeating effect.",
  reaction: "A reaction, or an Intensity event trigger.",
} as const;
export const Kind = z.enum(keys(KINDS));

export const TAGS = {
  basic: "Hits from basic attacks; for lockouts and Seek, basic attacks.",
  ability: "Hits from abilities; for lockouts and Seek, abilities.",
  extra: "Hits from extra strikes (Double strike's second strike, Arc's second hit): hits, but not basic attacks.",
  physical: "Physical hits (and actions with one).",
  magical: "Magical hits (and actions with one).",
  "<status>": "A status's id: reaches that status's pulses (\"+20% Burn damage\").",
  "<status tag>": "A tag a status carries, which reaches its pulses.",
  healing: "Boosts only: heals.",
  all: "Lockouts and Seek only: every action.",
} as const;

export const EVENTS = {
  fight_start: "The fight begins. Whose: every unit.",
  action_start: "An action starts. Whose: the acting unit. Has `kind`.",
  action_resolve: "An action resolves. Whose: the acting unit. Has `kind`.",
  action_interrupted: "An action in cast time is canceled by an interrupting lockout. Whose: the casting unit. Has `kind`.",
  hit_lands: "A hit lands (not evaded or absorbed), riders included. Whose: the attacker; other: the target. Has `kind`, `tags` and `amount`.",
  hit_taken: "A hit lands on this unit. Whose: the target; other: the attacker. Has `kind`, `tags` and `amount`.",
  hit_evaded: "This unit evades a hit. Whose: the target; other: the attacker. Has `kind` and `tags`.",
  hit_missed: "A hit is evaded. Whose: the attacker; other: the target. Has `kind` and `tags`.",
  damage_dealt: "Damage is dealt, including what an absorb soaks. Whose: the dealer, when known; other: the receiver. Has `amount`, and `status` when a status's pulse or reaction dealt it.",
  damage_taken: "Damage is taken, including what an absorb soaks. Whose: the receiver; other: the dealer, when known. Has `amount`, and `status` when a status's pulse or reaction dealt it.",
  hp_lost: "HP is lost. Whose: the unit. Has `amount`.",
  healed: "Healing is received. Whose: the healed unit; other: the healer, when known. Has `amount` (HP restored).",
  status_gained: "A status is applied (each application, refreshes and added stacks included). Whose: the holder. Has `status`.",
  status_triggered: "A status pulses, or an Intensity status's trigger fires. Whose: the holder. Has `status`.",
  status_ended: "A status ends. Whose: the holder. Has `status` and `cause`.",
  status_capped: "An Intensity status stands at its cap after an application (step 5g: Chill shatters). Whose: the holder; other: the applier. Has `status`.",
  ko: "A unit is KO'd. Whose: that unit. The unit's own statuses that survive a KO can still react to it.",
  revived: "A unit is revived. Whose: that unit; other: the reviver.",
} as const;
export const EventName = z.enum(keys(EVENTS));

export const WHOSE = {
  holder: "The event is the holder's own. The default.",
  ally: "The event is another unit's on the holder's side.",
  foe: "The event is a unit's on the other side.",
  any: "Any unit's.",
} as const;
export const Whose = z.enum(keys(WHOSE));

export const CAUSES = {
  expired: "Its duration ran out.",
  stacks: "Its Intensity total fell below 1 stack.",
  spent: "Its block was used.",
  removed: "An effect removed it.",
  ko: "Its holder was KO'd or replaced, or its source (Per source statuses that end with their source).",
  fight_end: "The fight ended.",
} as const;
export const Cause = z.enum(keys(CAUSES));
export type CauseT = z.infer<typeof Cause>;

export const SCALE_OF = {
  self: "Actions: the acting unit. The default for stats in actions.",
  target: "Actions: the unit the effect lands on. Boosts: the unit being hit. The default for hp, stacks and conditions in actions.",
  source: "Statuses that know their source (not a shared Intensity total): the unit that applied it, read once at application.",
  holder: "Statuses: the holder, read each time the number is used (stat changes: once, at application). The default for hp, stacks and conditions in statuses; stats must say whose.",
} as const;
export const Of = z.enum(keys(SCALE_OF));

export const TO = {
  target: "Actions: the action's targets. The default in actions.",
  self: "The acting unit: an action's user, a reaction's actor, or, for a pulse, its holder.",
  holder: "Statuses: the holder. The default for pulses.",
  source: "Statuses that know their source (Refresh, Fizzle, Per source): the unit that applied it.",
  other: "Reactions: the event's other unit (the attacker for hit_taken, the target for hit_lands). Nothing if unknown.",
  owner: "Reactions: the unit the event is about, whoever holds the reacting status (the holder of a status that just capped, the unit knocked out). Step 5g.",
} as const;

export const SIDES = {
  foes: "Living units on the other side.",
  allies: "Living units on the unit's side, itself included.",
  others: "Living units on the unit's side, itself excluded.",
  self: "The unit itself.",
} as const;
export const Side = z.enum(keys(SIDES));

export const PICKS = {
  aggro: "`count` units at random, weighted by draw (Aggro through ruleset.draw). The default for foes.",
  random: "`count` units at random. The default otherwise.",
  lowest: "`count` units with the lowest `by`; ties at random.",
  highest: "`count` units with the highest `by`; ties at random.",
  all: "Every unit that passes `where`. Area: the Taunt and Hidden rules don't apply.",
} as const;
export const Pick = z.enum(keys(PICKS));

// ─────────────────────────────────────────────────────────────────────────────
// Numbers, conditions and targeting
// ─────────────────────────────────────────────────────────────────────────────

/** Tests on one unit. Every field given must hold. */
export const UnitCond = z.strictObject({
  hpBelow: z.number().min(0).max(100).optional().describe("HP below this percent of max HP."),
  hpAtLeast: z.number().min(0).max(100).optional(),
  mpBelow: z.number().min(0).max(100).optional().describe("MP below this share of max MP (step 5g: what a Clarity waits for). A unit with no MP pool never passes."),
  mpAtLeast: z.number().min(0).max(100).optional(),
  has: z.union([Id, z.array(Id).min(1)]).optional().describe("Has this status (or every one of these)."),
  lacks: z.union([Id, z.array(Id).min(1)]).optional().describe("Doesn't have this status (or any of these)."),
  buffs: z.boolean().optional().describe("true: has any buff. false: has none."),
  debuffs: z.boolean().optional().describe("true: has any debuff. false: has none."),
  kind: z.strictObject({ kind: Kind, tag: Tag.optional() }).optional().describe("Has a status containing this effect kind (narrowed by tag)."),
  stacks: z.strictObject({ status: Id, atLeast: z.number() }).optional().describe("A status's Intensity total, in stacks."),
  atCap: Id.optional().describe("Holds this Intensity status at its cap."),
  belowCap: Id.optional().describe("Doesn't hold this Intensity status at its cap (or at all)."),
  casting: z.boolean().optional().describe("true: in an action's wind-up right now (step 5f: what Unmake waits for). false: not."),
  ko: z.boolean().optional().describe("true: knocked out, still in the fight. Sides list living units unless a rule asks for this. Default: living."),
});
export type UnitCondT = z.infer<typeof UnitCond>;

export const Scale = z
  .strictObject({
    ratio: z.number(),
    stat: StatKey.optional().describe("A stat's current value."),
    hp: z.enum(["current", "missing"]).optional().describe("Current HP, or max HP minus current."),
    stacks: Id.optional().describe("A status's Intensity total, in stacks."),
    amount: z.literal(true).optional().describe("Reactions only: the event's amount."),
    when: UnitCond.optional().describe("1 if the condition holds for the unit read (`of`), else 0: scaling from a condition instead of a stat."),
    times: z.strictObject({ stat: StatKey, of: Of.optional() }).optional().describe("Multiplies the term by a stat, read live: \"X% per point of Y\" (Lifesteal, Siphon)."),
    of: Of.optional(),
  })
  .refine((s) => [s.stat, s.hp, s.stacks, s.amount, s.when].filter((x) => x !== undefined).length === 1, {
    message: "a scale names exactly one of stat, hp, stacks, amount or when",
  });
export type ScaleT = z.infer<typeof Scale>;

/** A number: base + Σ ratio × source (× times). */
export const Num = z.union([z.number(), z.strictObject({ base: z.number().optional(), scale: z.array(Scale).min(1) })]);
export type NumT = z.infer<typeof Num>;

export const Value = z.union([
  z.enum(["hp", "hp_share", "mp_share", "buffs", "debuffs"]),
  z.strictObject({ stat: StatKey }),
  z.strictObject({ stats: z.array(StatKey).min(1) }).describe("The highest of these stats (\"the foe with the highest Attack or Magic\")."),
  z.strictObject({ stacks: Id }),
]);

export const TargetRule = z.strictObject({
  side: Side,
  where: UnitCond.optional(),
  ifNone: z.literal("any").optional().describe("When `where` leaves nobody, use the whole side instead (\"if every foe is Taunting, any foe\")."),
  exclude: z.literal("targets").optional().describe("Skip the action's chosen targets (\"a second, random foe\", \"up to three other foes\")."),
  pick: Pick.optional(),
  by: Value.optional().describe("Required for lowest and highest."),
  count: PosInt.optional().describe("Default 1."),
});
export type TargetRuleT = z.infer<typeof TargetRule>;

/** True when at least `atLeast` units on `side` pass `where`. Checked when an action starts. */
export const Condition = z.strictObject({ side: Side, where: UnitCond, atLeast: PosInt.optional() });
export type ConditionT = z.infer<typeof Condition>;

export const To = z.union([z.enum(keys(TO)), TargetRule]);
export type ToT = z.infer<typeof To>;

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
/** A status attached to a hit: applies whenever the hit occurs, even if BLOCKED or IMMUNE; never if evaded or absorbed. */
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
        label: z.enum(["buff", "debuff"]),
        status: Id.optional(),
        kind: Kind.optional(),
        tag: Tag.optional(),
        count: PosInt.optional().describe("Default: all."),
        order: z.enum(["newest", "random"]).optional().describe("Which go first when fewer than all are removed. Default newest."),
        to: To.optional(),
      })
      .describe("Removes buffs or debuffs, optionally narrowed to a named status or an effect kind. Unremovable statuses stay, and so do the buffs of a unit with immune:dispel."),
    z
      .strictObject({
        op: z.literal("revive"),
        hp: Num.describe("HP the unit comes back with (`target` is the revived unit)."),
        ready: z.boolean().optional().describe("true: every action ready. Default: every action on cooldown, as at the start of a fight."),
        to: To.optional(),
      })
      .describe("Raises a knocked-out unit, one knocked out in an earlier fight included. Its targets must ask for `ko: true`."),
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

// ─────────────────────────────────────────────────────────────────────────────
// Statuses and reactions
// ─────────────────────────────────────────────────────────────────────────────

export const StatChange = z.strictObject({ stat: StatKey, flat: Num.optional(), pct: Num.optional() });
/** A stat change from gear, a passive, a formation or a perk. Plain numbers. */
export const FixedStat = z.strictObject({ stat: StatKey, flat: z.number().optional(), pct: z.number().optional() });
export type FixedStatT = z.infer<typeof FixedStat>;

export const EventSpec = z.strictObject({
  event: EventName,
  whose: Whose.optional(),
  kind: z.enum(["basic", "ability", "extra"]).optional().describe("Action and hit events only."),
  tags: z.array(Tag).min(1).optional().describe("Hit events only: the hit carries at least one of these tags (its kind and type, and \"crit\" when it crits)."),
  status: Id.optional().describe("Status events, and damage events: the status whose pulse or reaction dealt the damage."),
  cause: z.array(Cause).min(1).optional().describe("status_ended only. Default: every cause."),
});
export type EventSpecT = z.infer<typeof EventSpec>;

export const Reaction = z.strictObject({
  on: EventSpec,
  actor: z.enum(["holder", "source"]).optional().describe("Who acts. source only for statuses that know their source. Default holder."),
  do: z.array(Effect).min(1).describe("Each effect states its target (`to`)."),
});

export const Status = z.strictObject({
  id: Id,
  name: Text.describe("Shown on its icon or sheet line, e.g. BURN."),
  text: Text.optional(),
  label: z.enum(["buff", "debuff"]).describe("Drives removal, conditions and the batch its pulses resolve in."),
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
  seek: Tag.optional().describe("The holder's actions carrying this tag (basic, ability or all) have Seek: their first pick ignores Taunt."),
  strike: z
    .strictObject({
      chance: z.number().min(0).max(100).optional().describe("Percent, rolled on the holder's dice. Default: always."),
      scale: StatKey.optional().describe("A stat read live whose value is added to `chance` (Double strike)."),
      to: z.union([z.literal("target"), TargetRule]).describe("The same target, or a rule (Arc: a second, random foe, excluding the target)."),
    })
    .optional()
    .describe("After each of the holder's basic attacks: one more hit with the weapon's damage, of kind extra, at `to`. Extra strikes don't chain."),
  pulse: z.strictObject({ every: z.number().positive(), do: z.array(Effect).optional().describe("Absent: the pulse is only a timer, for an Intensity drop.") }).optional().describe("A repeating effect. Intensity: its trigger."),
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
  note: Note.optional(),
});
export type StatusT = z.infer<typeof Status>;
export type ReactionT = z.infer<typeof Reaction>;

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
  if: z.union([Condition, z.array(Condition).min(1)]).optional().describe("Checked when the action starts: what the ability waits for. Several conditions must all hold (step 5g)."),
  target: Target.optional().describe("foe (default): a foe by Aggro, under the Taunt rule. ally: a random ally. Or a stated rule. Chosen when the action resolves."),
  seek: z.boolean().optional().describe("Its first pick ignores Taunt."),
  do: z.array(Effect).min(1),
  note: Note.optional(),
});
export type AbilityT = z.infer<typeof Ability>;

// ─────────────────────────────────────────────────────────────────────────────
// Design constraints: the slice's shape, as data the validator reads
// ─────────────────────────────────────────────────────────────────────────────

export const Design = z.strictObject({
  note: Note.optional(),
  formationPositions: PosInt,
  partySize: IntRange,
  abilitiesPerClass: PosInt,
  abilitiesEquipped: PosInt,
  perkPicksPerRun: IntRange,
  perkPoolSize: IntRange,
  perkOptionsPerPick: PosInt,
  complete: z.strictObject({ classes: IntRange }).describe("Totals checked only with --complete, for a full content set."),
}).describe("Target numbers the validator enforces.");

// ─────────────────────────────────────────────────────────────────────────────
// Ruleset and registries
// ─────────────────────────────────────────────────────────────────────────────

export const PerkOffer = z.strictObject({
  options: PosInt,
  premiumChance: Fraction.describe("Chance each offered slot rolls a premium perk, if one is available."),
  repeatPicked: z.boolean().describe("Can a perk already picked this run be offered again?"),
  offerInapplicable: z.boolean().describe("Can a perk no party unit can receive be offered?"),
});

export const Ruleset = z.strictObject({
  basicRecovery: z.number().gt(0).max(1).describe("A basic attack's recovery, as a share of the weapon's base cooldown. Sets the Attack Speed ceiling."),
  abilityCast: Ticks.describe("An ability's cast time unless it states one."),
  abilityRecovery: Ticks.describe("An ability's recovery unless it states one: about a sword's."),
  armorRatio: z.number().min(0).describe("Each physical hit loses armorRatio × the target's Armor, as a flat amount."),
  armorFloor: z.number().min(0).max(100).optional().describe("Armor can't take a physical hit below this % of its size. Absent or 0: enough Armor blanks a hit. Ignored when armorK is set."),
  armorK: z.number().min(0).optional().describe("Armor by the Path of Exile formula: a physical hit deals hit² ÷ (hit + armorK × Armor), so Armor is nearly linear against big hits and never blanks one. Replaces armorRatio and armorFloor when above 0; absent or 0, the flat cut."),
  taken: z.strictObject({ floor: z.number(), cap: z.number() }).describe("Bounds on a unit's total damage-taken modifier, in percent."),
  unarmed: Weapon.describe("The basic attack of a unit with no weapon."),
  maxEnemies: PosInt.describe("Most living units on the enemy side, summons included."),
  enrage: z
    .strictObject({ after: Ticks, every: Ticks.min(1), pct: z.number().min(0) })
    .optional()
    .describe("A fight that runs past `after` ticks: every unit, on both sides, deals pct % more damage with hits and reactions, and pct more again every `every` ticks, so no fight stalls. Absent: fights run to the safety stop."),
  opening: z
    .strictObject({
      min: z.number().min(0).max(1),
      max: z.number().min(0).max(1),
      slots: z.array(z.number().min(0)).optional().describe("A party unit's abilities start this many ticks charged, by the order they're slotted in (first, second, third), in place of the roll: the order is the player's to choose. Its basic attack still rolls."),
      slotShares: z.array(z.number().min(0).max(1)).optional().describe("Step 5g: as slots, but as a share of each ability's own cooldown (0.75 is three quarters charged), so a slow ability's head start is long too. Wins over slots when both are set."),
    })
    .optional()
    .describe("At fight start each action is already partly charged: it's first ready after a share of its cooldown, rolled between min and max on the unit's dice for each action (but see slots). Absent: every action starts a fight on its full cooldown."),
  draw: z
    .strictObject({ centre: z.number().positive(), k: z.number().positive(), max: z.number().min(1) })
    .optional()
    .describe("Foes pick in proportion to draw, not Aggro. With d how far a unit's Aggro is from `centre`: above it, draw = centre × (k + max × d) ÷ (k + d); below it, centre × (k + d) ÷ (k + max × d). An ordinary unit draws `centre`; none draws more than `max` times that or less than 1 ÷ max; +d and −d cancel. `k` sets how much the first steps count. Absent: picks weighted by Aggro itself."),
  stagger: Ticks.optional().describe("Copies of the same enemy start a fight this many ticks apart, one after another, so identical foes don't act in lockstep. Absent or 0: they start together."),
  lostCast: z
    .enum(["retry", "cooldown"])
    .optional()
    .describe("An action interrupted in its wind-up, or whose targets are gone when it resolves. retry (the default): no MP, no cooldown, so it can start again at once. cooldown: no MP, but an interrupted action goes on cooldown, as a cast that fizzles for MP does, and one that found no target costs the unit its recovery."),
  run: z.strictObject({
    defeatedUnits: z.enum(["stay_down"]).describe("Knocked-out units stay down between fights until something revives them."),
    restore: z
      .strictObject({ hp: z.number().min(0).max(100).optional(), mp: z.number().min(0).max(100).optional() })
      .optional()
      .describe("After a won fight, every standing member regains these % of its max HP and of its max MP. Absent or 0: nothing restores them between fights (the core set's rule)."),
    perkOffer: PerkOffer,
  }),
});

export const StatDef = z.strictObject({
  id: Id,
  name: Text,
  kind: z.enum(["amount", "points"]).describe("amount: takes flat or percent changes. points: already in points or percent; flat changes only."),
  default: z.number(),
  floor: z.number().optional(),
  cap: z.number().optional(),
  brings: Id.optional().describe("A status the unit holds while the stat is above 0, for behaviour beyond hit resolution, targeting and timing."),
  note: Note.optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Content
// ─────────────────────────────────────────────────────────────────────────────

const UnlockSource = z.enum(["starter", "unlock"]).describe("starter: owned from the start. unlock: a reward from a real-life quest. The core set makes everything available.");

export const StatBlock = z.record(StatKey, z.number()).describe("Stat key to base value. Missing stats use the registry's default.");

/** What a passive, gear, a formation slot, a formation or a perk gives: stats like gear, and statuses applied at fight start. */
const grants = {
  stats: z.array(FixedStat).optional(),
  statuses: z.array(Id).optional().describe("Applied to the unit at fight start, and again when it's revived; usually permanent and unremovable."),
};

export const ClassDef = z.strictObject({
  id: Id,
  name: Text,
  text: Text,
  source: UnlockSource,
  stats: StatBlock.describe("The unit's base stats."),
  weapons: z.array(Id).min(1).describe("The weapon kinds it can use, first kind first: it arrives with that kind's plain weapon."),
  armor: z.array(Id).min(1).describe("The armor types it can wear."),
  offhands: z.array(Id).min(1).describe("The offhand kinds it can hold."),
  passive: z.strictObject({ name: Text, text: Text, ...grants }).optional().describe("The class passive. Its stat grants are stats; its behaviour lives in the statuses it applies at fight start."),
  abilities: z.array(Id),
  note: Note.optional(),
}).describe("A class is a unit. The player owns at most one of each and can field it once per party.");

export const Gear = z.strictObject({
  id: Id,
  name: Text,
  text: Text,
  slot: Slot,
  tier: z.enum(["ordinary", "powerful"]).describe("ordinary: drops in dungeons, sidegrades. powerful: task rewards, a different build."),
  source: z.enum(["starter", "drop", "unlock"]),
  armor: Id.optional().describe("Armor only: its armor type."),
  offhand: Id.optional().describe("Offhands only: its offhand kind."),
  weapon: Weapon.optional().describe("Weapons only: sets the basic attack. Names its kind, unless it's a mythic with its own speed, damage type and hands."),
  mythic: Id.optional().describe("A mythic piece: it fits this one class, in any slot, whatever its kind; a unit wears one at most."),
  ...grants,
  note: Note.optional(),
});

export const Layout = z
  .strictObject({
    line: z.enum(["front", "middle", "back"]),
    column: z.number().int().min(0),
  })
  .describe("Where the slot is drawn. Cosmetic: the engine never reads it.");

export const Position = z
  .strictObject({
    id: Id,
    name: Text,
    text: Text.optional().describe("What the slot does, as the player sees it."),
    layout: Layout,
    ...grants,
  })
  .describe("A formation slot: its own stat changes, for the unit in it. Its place in the list is the unit's slot order.");

export const Formation = z.strictObject({
  id: Id,
  name: Text,
  text: Text,
  source: UnlockSource,
  positions: z.array(Position),
  ...grants,
  note: Note.optional(),
}).describe("Its own `stats` and `statuses` are its effect: given to every unit in it.");

export const Enemy = z.strictObject({
  id: Id,
  name: Text,
  text: Text.describe("How it behaves, as the player reads it. Never says what beats it."),
  rank: z.enum(["minion", "elite", "boss"]),
  stats: StatBlock.describe("Hidden from the player. Innate immunities are immune:... stats here."),
  weapon: Weapon.optional().describe("Its basic attack. Absent: ruleset.unarmed."),
  abilities: z.array(Id).optional().describe("Equipped, in slot order."),
  statuses: z.array(Id).optional().describe("Applied at fight start: its passive."),
  note: Note.optional(),
});

export const PerkFamily = z.strictObject({ id: Id, name: Text, text: Text });

export const Perk = z.strictObject({
  id: Id,
  name: Text,
  text: Text,
  family: Id,
  rarity: z.enum(["regular", "premium"]),
  upgradeOf: Id.optional().describe("Premium only: the regular perk this is a stronger version of."),
  for: z.strictObject({ classes: z.array(Id).optional() }).optional().describe("Which party units receive it. Absent: all."),
  ...grants,
  note: Note.optional(),
});

export const FightStage = z.strictObject({
  kind: z.literal("fight"),
  id: Id,
  name: Text.optional().describe("The encounter's name."),
  boss: z.boolean().optional(),
  enemies: z.array(Id).min(1).describe("Enemy ids, in slot order. Enemies have no formation."),
  note: Note.optional(),
});
export const PickStage = z.strictObject({ kind: z.literal("perk_pick"), id: Id });
export const CampfireStage = z
  .strictObject({
    kind: z.literal("campfire"),
    id: Id,
    hp: z.number().min(0).max(100).describe("REST: every standing member regains this % of its max HP."),
    mp: z.number().min(0).max(100).describe("FOCUS: every standing member regains this % of its max MP."),
    revive: z.number().min(0).max(100).optional().describe("RAISE: one knocked-out member of the player's choice stands again with this % of its max HP. Absent: no raise."),
  })
  .describe("A rest between two fights where the player picks one: HP back, MP back, or (with revive) one fallen member back. Knocked-out members otherwise stay down.");
export const Stage = z.discriminatedUnion("kind", [FightStage, PickStage, CampfireStage]);

export const LootTable = z.strictObject({
  guaranteed: z.array(Id).optional(),
  rolls: z.number().int().min(0).optional(),
  table: z.array(z.strictObject({ gear: Id, weight: z.number().positive() })).optional(),
});

export const Constraint = z.union([
  z.strictObject({ partySize: z.strictObject({ min: PosInt.optional(), max: PosInt.optional() }) }),
  z.strictObject({ includesClass: Id }),
  z.strictObject({ excludesClass: Id }),
  z.strictObject({ formation: Id }),
]);
export type Constraint = z.infer<typeof Constraint>;

export const Challenge = z.strictObject({
  id: Id,
  text: Text,
  constraints: z.array(Constraint).min(1).describe("Only things the player can see: party size, classes, formation."),
  loot: LootTable,
  note: Note.optional(),
});

export const Foes = z
  .strictObject({
    hp: z.number().int().min(-90).optional().describe("Every foe's max HP, +% (summoned foes too)."),
    power: z.number().int().min(-90).optional().describe("Every foe's damage dealt, +%: the power stat, added to its hits' boosts."),
    statuses: z.array(Id).optional().describe("Applied to every foe at fight start, after its own."),
    text: Text.optional().describe("What the player is told about it."),
  })
  .describe("A change to every foe in a dungeon: how a campaign trial or remix makes its foes tougher. The engine applies it at each fight start and to summons.");
export type FoesT = z.infer<typeof Foes>;

export const Dungeon = z.strictObject({
  id: Id,
  name: Text,
  text: Text,
  partySize: z.strictObject({ max: PosInt }),
  foes: Foes.optional(),
  bossFoes: Foes.optional().describe("A change to the foes of the run's boss fight, in its place: the regular fights and the boss can be set apart."),
  perkPool: z.array(Id).default([]),
  stages: z.array(Stage).min(1),
  loot: z.strictObject({ firstClear: LootTable, replay: LootTable }).optional().describe("Absent: a win pays nothing. The core set has no progression yet."),
  challenges: z.array(Challenge).default([]).describe("Fixed sequence. Clearing one reveals the next. The core set has none yet."),
  note: Note.optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// The campaign: a fixed road of dungeons and trials, each cleared once, each
// paying a fixed reward and revealing the next (the progression experiment).
// ─────────────────────────────────────────────────────────────────────────────

export const Need = z
  .union([
    z.strictObject({ includes: z.array(Id).min(1) }).describe("The party brings every one of these classes."),
    z.strictObject({ excludes: z.array(Id).min(1) }).describe("The party brings none of these classes."),
    z.strictObject({ formation: Id }).describe("The party stands in this formation."),
    z.strictObject({ armor: Id }).describe("Every member wears armor of this type (or \"none\": no armor)."),
    z.strictObject({ weapons: z.array(Id).min(1) }).describe("Every member's weapon is of one of these kinds."),
    z.strictObject({ size: PosInt }).describe("The party has at most this many members."),
  ])
  .describe("A requirement a trial sets on the party. Only things the player can see and change in the menus.");
export type NeedT = z.infer<typeof Need>;

export const CampaignNode = z.strictObject({
  id: Id,
  name: Text,
  kind: z.enum(["dungeon", "remix", "trial"]).describe("dungeon: one of the seven runs. remix: a new run from the same enemies. trial: a run with requirements."),
  dungeon: Id.describe("The run it plays."),
  text: Text.describe("The node's line, as the player reads it."),
  needs: z.array(Need).default([]),
  rewards: z.strictObject({ classes: z.array(Id).default([]), formations: z.array(Id).default([]), gear: z.array(Id).default([]) }),
  note: Note.optional(),
});
export type CampaignNodeT = z.infer<typeof CampaignNode>;

export const Campaign = z.strictObject({
  start: z.strictObject({ classes: z.array(Id).min(1), formations: z.array(Id).min(1), gear: z.array(Id) }).describe("Owned at the start. A class's plain weapon always comes with it."),
  nodes: z.array(CampaignNode).min(1).describe("In order. Clearing one pays its rewards once and reveals the next."),
});
export type CampaignT = z.infer<typeof Campaign>;

// ─────────────────────────────────────────────────────────────────────────────
// The rogue mode: a roguelite on Slay the Spire's structure (steps/05-core-set/5d-rogue).
// Its rules are src/rogue.ts; this is the data they read.
// ─────────────────────────────────────────────────────────────────────────────

/** Step 5h: the Muster (a pick of recruits) and the Drill ground (a pick of formations, or training). */
export const RogueNodeKind = z.enum(["fight", "elite", "event", "campfire", "shop", "treasure", "boss", "muster", "drill"]);
export type RogueNodeKindT = z.infer<typeof RogueNodeKind>;
/** Step 5j: mythic, above legendary, for a piece that fits one class. None is offered yet. */
export const Rarity = z.enum(["common", "uncommon", "rare", "legendary", "mythic"]);
export type RarityT = z.infer<typeof Rarity>;
/** Step 5g (the director's): a potion heals one unit, a tonic restores one unit's MP (the old tonic healed the party, the old ether its MP). */
export const SupplyId = z.enum(["potion", "tonic", "phoenix"]);
export type SupplyIdT = z.infer<typeof SupplyId>;
const Pct = z.number().min(0).max(100);
const RarityOdds = z.strictObject({ common: z.number().min(0), uncommon: z.number().min(0), rare: z.number().min(0), legendary: z.number().min(0) });
const Spoils = z.strictObject({
  count: PosInt,
  rarity: RarityOdds,
  tome: Pct.describe("Chance, in percent, that an offer is a tome (a member learns an ability) instead of gear."),
  recruit: Pct.describe("Chance an offer is a recruit."),
  supply: Pct.describe("Chance an offer is a supply."),
  legendaries: z.number().int().min(0).optional().describe("How many of the offers are always a legendary piece."),
  trophy: z.boolean().optional().describe("A legendary piece is won outright, on top of the pick."),
  aimed: z.number().int().min(0).optional().describe("Step 5h round 6: the first this many offers are pieces aimed at someone in the party."),
  formations: z.number().int().min(0).optional().describe("Step 5h round 6: a second pick follows, of this many formations (an elite's)."),
  mixed: Pct.optional().describe("Step 5h: chance, in percent, that the pick mixes kinds: one piece of gear, then offers rolled from `mix` (the rest stay gear)."),
  mix: z.strictObject({ tome: z.number().min(0), formation: z.number().min(0), recruit: z.number().min(0), sealed: z.number().min(0).optional().describe("Step 5h round 6: a piece whose rarity (rare or better) and name stay hidden until taken."), bundle: z.number().min(0).optional().describe("Step 5h round 6: a common piece and a potion or a tonic together.") }).optional().describe("Weights of the other kinds in a mixed pick."),
});
const KnownOdds = z.array(z.number().min(0)).length(3).describe("Weights for knowing one, two or three abilities.");

export const RogueConfig = z.strictObject({
  start: z.strictObject({ gold: z.number().int().min(0), offers: PosInt, picks: z.number().int().min(0), known: PosInt.optional().describe("Abilities a class knows on joining in act I (default 1); one more an act after."), healer: z.boolean().optional().describe("While the party has nobody who heals others, each draft offers one who does."), supplies: z.array(SupplyId).optional().describe("Step 5h round 6: supplies in the bag at the start.") }).describe("Gold at the start; the draft after the leader: `picks` picks of one from `offers` classes."),
  firstAbility: z.record(Id, Id).optional().describe("Before step 5h: the ability each class knew on joining. Step 5h rolls what a class knows instead."),
  startKnown: z.record(Id, PosInt).optional().describe("Classes that join knowing more than start.known abilities in act I, by class."),
  party: PosInt,
  bench: z.number().int().min(0).describe("Seats at camp at a run's start, besides the party (step 5h: two)."),
  benchMax: z.number().int().min(0).optional().describe("Step 5h: seats at camp at most; the others are won (a boon's seat, an event)."),
  benchByAct: z.array(z.number().int().min(0)).min(1).optional().describe("Step 5h round 6: seats at camp by act; a new act brings the run up to its act's (never down)."),
  recruits: z.strictObject({ offers: PosInt, known: z.array(KnownOdds).min(1).describe("By act: how many abilities a recruit knows, rolled at random from its three.") }).optional(),
  benchMp: Pct.optional().describe("Step 5h: share of max MP a member regains after each won fight it sat out (from the max it last fought with)."),
  fresh: Pct.optional().describe("Step 5h: share of its cooldown already run for a fresh ability: a starting unit's, a recruit's, one just learned."),
  muster: z.strictObject({ offers: PosInt }).optional().describe("Step 5h: the Muster's pick of recruits."),
  drill: z.strictObject({ offers: PosInt, train: PosInt }).optional().describe("Step 5h: the Drill ground's pick of formations, or this many members trained."),
  formationRarity: z.record(Id, Rarity).optional().describe("Step 5h: each formation's rarity (provisional until step 5i); unlisted ones are common."),
  formationOdds: z.array(z.strictObject({ common: z.number().min(0), rare: z.number().min(0), legendary: z.number().min(0) })).min(1).optional().describe("By act: the rarity a formation offer rolls."),
  map: z.strictObject({
    floors: PosInt,
    width: PosInt,
    paths: PosInt,
    fixed: z.record(z.string(), RogueNodeKind).describe("Floor number to the kind every node on it has."),
    odds: z.record(z.string(), z.number().min(0)).describe("Room odds for the other floors, by kind."),
    lateFrom: PosInt.describe("Elites and campfires only from this floor."),
    ensure: z.record(z.string(), z.number().int().min(0)).optional().describe("Rooms of a kind an act has at least, where the rules allow."),
    easyTo: PosInt.optional().describe("Step 5h round 6: the easy pool's last floor (default 2)."),
    campPaths: Pct.optional().describe("Step 5h round 6: mid-act campfires are added until at least this share of the ways up pass one before the last floor."),
    ref: z.strictObject({ easy: PosInt, normal: PosInt, elite: PosInt }).optional().describe("Step 5h round 6: each pool's reference floor, where its fights' own knobs hold (default 1, 5, 6)."),
  }),
  gold: z.strictObject({ fight: IntRange, elite: IntRange, boss: IntRange, perAct: z.number().int().min(0) }),
  spoils: z.strictObject({ fight: Spoils, elite: Spoils, offRoster: Pct.describe("Step 5h: share of offered gear (spoils, chests, events; not the shop or a trophy) rolled for classes not in the roster, where there is such a piece.") }),
  boon: z.strictObject({ count: PosInt, seat: z.boolean().optional().describe("Step 5h: a seat at camp is among the options, while there's one to win.") }),
  treasure: z.strictObject({ rarity: RarityOdds, gold: IntRange, cage: Pct.optional().describe("Step 5h: chance the chest is a cage: a recruit with a piece suited to it.") }),
  campfire: z.strictObject({
    hp: Pct, mp: Pct, revive: Pct,
    camp: Pct.optional().describe("The share of REST those standing at camp get, whatever the pick (default all)."),
    train: PosInt.optional().describe("Step 5h: members TRAIN teaches or upgrades (default one)."),
    stranger: Pct.optional().describe("Step 5h: chance a stranger at the fire asks to join."),
    auto: z.strictObject({ hp: Pct, mp: Pct, revive: Pct }).optional().describe("Step 5h round 6: on arrival everyone recovers this (HP and MP, the fallen rise); then one pick, REST (`hp` and `mp` again, everyone) or TRAIN. Without it, the old pick of REST, FOCUS, RAISE or TRAIN."),
  }),
  captive: z.strictObject({ chance: Pct, hp: Pct, people: z.array(Id) }).optional().describe("Step 5h round 6: after a won fight with any of `people` in it, a captive this often (never two fights running), taken in at `hp`%, or a lesson."),
  prices: z.strictObject({
    common: z.number().int().min(0), uncommon: z.number().int().min(0), rare: z.number().int().min(0), legendary: z.number().int().min(0),
    recruit: z.number().int().min(0), formation: z.number().int().min(0), learn: z.number().int().min(0), upgrade: z.number().int().min(0),
    trainStep: z.number().int().min(0).optional().describe("A shop's training can be bought again in the same visit, each time this much dearer (learning and upgrading alike); without it, once each a visit."),
    supply: z.record(z.string(), z.number().int().min(0)), sell: Pct,
  }),
  shop: z.strictObject({ gear: RarityOdds.describe("How many pieces of each rarity."), legendaryByAct: z.array(z.number().int().min(0)).optional().describe("Step 5h: legendary pieces a visit, by act (in place of gear.legendary)."), recruits: z.number().int().min(0), formations: z.number().int().min(0), supplies: z.number().int().min(0) }),
  supplies: z.strictObject({ potion: z.strictObject({ hp: Pct }), tonic: z.strictObject({ mp: Pct }), phoenix: z.strictObject({ revive: Pct }) }),
  /** Step 5g (the director's): after every won fight the party is handed these, free, up to the bag. */
  drops: z.array(SupplyId).optional().describe("Round 9: offered as a choice of one after every won fight."),
  bag: z.strictObject({ potion: z.number().int().min(0), tonic: z.number().int().min(0), phoenix: z.number().int().min(0) }).describe("Supplies carried at most, a slot a kind."),
  knobs: z.array(z.strictObject({ mob: z.number(), step: z.number(), early: z.number().optional().describe("Step 5h round 6: the climb a floor below a pool's reference floor (default `step`)."), elite: z.number(), boss: z.number() })).min(1).describe("Per act, added to each fight's own knob (HP +k %, damage +k/2.5 %): regular fights, the rise per floor from each pool's reference floor, elites, the boss."),
  heat: z.strictObject({ per: z.number(), max: z.number().int().min(0) }),
  shape: z.record(z.string(), z.strictObject({ hp: z.number(), power: z.number() })).optional().describe("By tier (fight, elite, boss): HP % and damage % added to every foe on top of the knob, so a tier's fights can be longer and softer at the same cost."),
  growFrom: PosInt.describe("From this floor, each pack of two or more may gain one more foe."),
  levelGold: z.number().int().min(0).optional().describe("A level-up can be taken as this much gold instead."),
  neverGrow: z.array(Id).optional().describe("Enemies whose packs never grow (Snakes: their Bleed doesn't shrink with a fight's knob)."),
});
export type RogueConfigT = z.infer<typeof RogueConfig>;

export const RogueFight = z.strictObject({ id: Id, name: Text, enemies: z.array(Id).min(1).max(8), knob: z.number().optional().describe("Its own knob, set by the rogue calibration: what makes it cost what its tier should.") });
export type RogueFightT = z.infer<typeof RogueFight>;
export const RogueRegion = z.strictObject({
  id: Id,
  name: Text,
  text: Text,
  act: PosInt,
  knob: z.strictObject({ mob: z.number(), elite: z.number(), boss: z.number() }).describe("The region's own adjustment to its act's knobs."),
  easy: z.array(RogueFight).min(1),
  normal: z.array(RogueFight).min(1),
  elite: z.array(RogueFight).min(1),
  bosses: z.array(RogueFight).min(1),
});
export type RogueRegionT = z.infer<typeof RogueRegion>;

export const RogueAffix = z.strictObject({ id: Id, prefix: Text, suffix: Text, stats: z.array(FixedStat).min(1) });
export type RogueAffixT = z.infer<typeof RogueAffix>;

export type EventOpT =
  | { op: "gold"; amount: number }
  | { op: "hp"; pct: number; one?: boolean }
  | { op: "mp"; pct: number }
  | { op: "gear"; rarity: RarityT }
  | { op: "recruit"; hp?: number; known?: number; gear?: RarityT; healer?: boolean }
  | { op: "learn" }
  | { op: "upgrade" }
  | { op: "temper"; from?: RarityT[]; risk?: number }
  | { op: "revive"; pct: number }
  | { op: "formation"; rarity?: RarityT }
  | { op: "seat" }
  | { op: "train"; n: number }
  | { op: "muster"; n: number; known?: number; gear?: RarityT }
  | { op: "trade" }
  | { op: "supply"; id: SupplyIdT }
  | { op: "fight"; tier: "normal" | "elite" }
  | { op: "camp" }
  | { op: "chance"; pct: number; then: EventOpT[]; else: EventOpT[] };
export const EventOp: z.ZodType<EventOpT> = z.lazy(() =>
  z.union([
    z.strictObject({ op: z.literal("gold"), amount: z.number().int() }),
    z.strictObject({ op: z.literal("hp"), pct: z.number(), one: z.boolean().optional() }),
    z.strictObject({ op: z.literal("mp"), pct: z.number() }),
    z.strictObject({ op: z.literal("gear"), rarity: Rarity }),
    z.strictObject({ op: z.literal("recruit"), hp: Pct.optional(), known: z.number().int().min(1).max(3).optional(), gear: Rarity.optional(), healer: z.boolean().optional().describe("Step 5h round 6: a class that heals or raises others.") }),
    z.strictObject({ op: z.literal("learn") }),
    z.strictObject({ op: z.literal("upgrade") }),
    z.strictObject({ op: z.literal("temper"), from: z.array(Rarity).optional().describe("Step 5h round 6: the rarities a piece can be tempered from (default common, uncommon); a rare is reforged into a legendary of its slot."), risk: Pct.optional().describe("Step 5h round 6: chance the piece cracks and is lost instead.") }),
    z.strictObject({ op: z.literal("revive"), pct: Pct }).describe("Step 5h round 6: every fallen member rises at this share of HP."),
    z.strictObject({ op: z.literal("formation"), rarity: Rarity.optional() }),
    z.strictObject({ op: z.literal("seat") }),
    z.strictObject({ op: z.literal("train"), n: PosInt }),
    z.strictObject({ op: z.literal("muster"), n: PosInt, known: z.number().int().min(1).max(3).optional(), gear: Rarity.optional().describe("Step 5h round 6: each carries a piece of this rarity suited to it.") }),
    z.strictObject({ op: z.literal("trade") }),
    z.strictObject({ op: z.literal("supply"), id: SupplyId }),
    z.strictObject({ op: z.literal("fight"), tier: z.enum(["normal", "elite"]) }),
    z.strictObject({ op: z.literal("camp") }),
    z.strictObject({ op: z.literal("chance"), pct: Pct, then: z.array(EventOp), else: z.array(EventOp) }),
  ]),
);
const EventOption = z.strictObject({ id: Id, label: Text, text: Text, gold: z.number().int().min(0).optional().describe("Gold it costs; it can't be picked without."), do: z.array(EventOp) });
export const RogueEvent = z.strictObject({
  id: Id,
  name: Text,
  text: Text,
  options: z.array(EventOption).min(1),
  variants: z.array(z.strictObject({ text: Text.optional(), options: z.array(EventOption).min(1) })).optional().describe("Step 5h: versions of the event; one is rolled on entering, its text and options in place of the first's."),
});
export type RogueEventT = z.infer<typeof RogueEvent>;

export const Rogue = z.strictObject({
  config: RogueConfig,
  regions: z.array(RogueRegion).min(1),
  gear: z.array(Gear).describe("Legendary pieces that only the rogue mode drops (the core set's own powerful pieces are in pack.gear)."),
  legendaries: z.array(Id).min(1).describe("The legendary pool, by gear id, in pack.gear or rogue.gear."),
  aims: z.record(Id, z.array(Id).min(1)).optional().describe("Who each legendary piece is for, by class id: an elite's trophy comes from pieces aimed at the party, and a recruit leans toward a class a piece in the bag is for. Never shown (step 5h round 6, the director's: the FOR line “ruins the discovery”)."),
  affixes: z.array(RogueAffix).min(2),
  events: z.array(RogueEvent).min(1),
});
export type RogueT = z.infer<typeof Rogue>;

// ─────────────────────────────────────────────────────────────────────────────
// The pack
// ─────────────────────────────────────────────────────────────────────────────

export const ContentPack = z.strictObject({
  schemaVersion: z.literal(SCHEMA_VERSION),
  id: Id,
  title: z.string().optional(),
  note: Note.optional(),
  design: Design,
  ruleset: Ruleset,
  stats: z.array(StatDef),
  weaponKinds: z.array(WeaponKind),
  armorTypes: z.array(GearKind),
  offhandKinds: z.array(GearKind),
  statuses: z.array(Status),
  classes: z.array(ClassDef),
  abilities: z.array(Ability),
  gear: z.array(Gear),
  formations: z.array(Formation),
  enemies: z.array(Enemy),
  perkFamilies: z.array(PerkFamily).default([]),
  perks: z.array(Perk).default([]),
  dungeons: z.array(Dungeon),
  starter: z.strictObject({
    classes: z.array(Id).min(1),
    formations: z.array(Id).min(1),
    gear: z.array(Id),
  }),
  progression: z.strictObject({ dungeonOrder: z.array(Id).min(1) }),
  campaign: Campaign.optional(),
  rogue: Rogue.optional(),
});
export type ContentPack = z.infer<typeof ContentPack>;

// ─────────────────────────────────────────────────────────────────────────────
// Engine input: a party loadout (player state, not content)
// ─────────────────────────────────────────────────────────────────────────────

export const PartyUnit = z.strictObject({
  class: Id,
  position: Id,
  abilities: z.array(Id).describe("Equipped abilities, in slot order."),
  gear: z.record(Id, Id).describe("Slot (weapon, armor, offhand, amulet) to gear id."),
});
export const Party = z.strictObject({
  formation: Id,
  units: z.array(PartyUnit).min(1),
});
export type Party = z.infer<typeof Party>;

// ─────────────────────────────────────────────────────────────────────────────
// Inferred types, for the engine and tooling
// ─────────────────────────────────────────────────────────────────────────────

export type StatDefT = z.infer<typeof StatDef>;
export type ClassDefT = z.infer<typeof ClassDef>;
export type GearT = z.infer<typeof Gear>;
export type FormationT = z.infer<typeof Formation>;
export type EnemyT = z.infer<typeof Enemy>;
export type PerkT = z.infer<typeof Perk>;
export type DungeonT = z.infer<typeof Dungeon>;
export type ChallengeT = z.infer<typeof Challenge>;
export type LootTableT = z.infer<typeof LootTable>;
export type PartyUnitT = z.infer<typeof PartyUnit>;
