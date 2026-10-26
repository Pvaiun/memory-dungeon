/**
 * Memory Dungeon Game: content schema, v0.6 (the core set).
 *
 * One data format for everything the engine runs on. Step 4 replaced schema
 * 0.3's turn-based rule language with the director's combat design; the core
 * set (docs/core-set/) builds on it: fights run on ticks, and everything that
 * happens on an event or a timer is a status. Content is built from
 *   - stats (a registry, plus the families resist:<element> and immune:...),
 *   - weapon kinds (speed, damage type and element, shared by gear and enemies),
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
 */
import * as z from "zod";

export const SCHEMA_VERSION = "0.6" as const;

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

/** A stat key: a registry id, or a family member such as resist:fire or immune:status:freeze. */
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

export const SUBTYPES = { slash: "Physical subtype.", pierce: "Physical subtype.", blunt: "Physical subtype." } as const;
export const Subtype = z.enum(keys(SUBTYPES));

export const TYPES = {
  physical: "Has exactly one subtype and no element. Meets Evasion and Armor.",
  magical: "Has exactly one element and no subtype. Meets that element's Resistance: below 0 WEAK, above 0 RESIST, 100 IMMUNE, above 100 ABSORB (heals instead, and applies nothing).",
  none: "Untyped: never meets Evasion or Armor; meets Resistance only if it carries an element. Not allowed in actions; the usual type for a status's own damage.",
} as const;
export const DamageType = z.enum(keys(TYPES));

/** The three gear slots every unit has. */
export const SLOTS = {
  weapon: "Sets the basic attack through its weapon kind. A class can use only its kinds.",
  armor: "Light, medium or heavy. A class can wear its heaviest weight or anything lighter.",
  amulet: "No restrictions.",
} as const;
export const Slot = z.enum(keys(SLOTS));
export type SlotT = z.infer<typeof Slot>;

export const WEIGHTS = { light: "Anyone can wear it.", medium: "Medium and heavy classes.", heavy: "Heavy classes only." } as const;
export const Weight = z.enum(keys(WEIGHTS));
export type WeightT = z.infer<typeof Weight>;

/** Stats the engine itself reads. The registry must define each, with this kind. */
export const ENGINE_STATS = {
  max_hp: ["amount", "Max HP. A unit is KO'd at 0 HP."],
  max_mp: ["amount", "Max MP. Abilities cost MP, paid when they resolve."],
  attack: ["amount", "Scales only what states it. By convention, physical things do."],
  magic: ["amount", "Scales only what states it. By convention, magical things do."],
  armor: ["amount", "Reduces each physical hit: to hit² ÷ (hit + ruleset.armorK × Armor) when armorK is set; else a flat ruleset.armorRatio × Armor, down to 0 (BLOCKED)."],
  aggro: ["amount", "Default targeting picks foes weighted by Aggro. Its floor must be above 0."],
  resist: ["points", "General Resistance, in percent, added to every element's own resist:<element>. Negative shows WEAK, positive RESIST, 100 IMMUNE, above 100 ABSORB."],
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
  "resist:<element>": "Resistance to one element, in percent, added to the general resist.",
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
  action_change: "A rider added to the holder's actions, a change of element or subtype, Seek, or an extra strike.",
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
  "<subtype>": "slash, pierce or blunt.",
  "<element>": "Any element in the pack.",
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
} as const;

export const SIDES = {
  foes: "Living units on the other side.",
  allies: "Living units on the unit's side, itself included.",
  others: "Living units on the unit's side, itself excluded.",
  self: "The unit itself.",
} as const;
export const Side = z.enum(keys(SIDES));

export const PICKS = {
  aggro: "`count` units at random, weighted by Aggro. The default for foes.",
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
  has: z.union([Id, z.array(Id).min(1)]).optional().describe("Has this status (or every one of these)."),
  lacks: z.union([Id, z.array(Id).min(1)]).optional().describe("Doesn't have this status (or any of these)."),
  buffs: z.boolean().optional().describe("true: has any buff. false: has none."),
  debuffs: z.boolean().optional().describe("true: has any debuff. false: has none."),
  kind: z.strictObject({ kind: Kind, tag: Tag.optional() }).optional().describe("Has a status containing this effect kind (narrowed by tag)."),
  stacks: z.strictObject({ status: Id, atLeast: z.number() }).optional().describe("A status's Intensity total, in stacks."),
  atCap: Id.optional().describe("Holds this Intensity status at its cap."),
  belowCap: Id.optional().describe("Doesn't hold this Intensity status at its cap (or at all)."),
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
  z.enum(["hp", "hp_share", "buffs", "debuffs"]),
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
  subtype: Subtype.optional(),
  element: Id.optional(),
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
        subtype: Subtype.optional(),
        element: Id.optional(),
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
  tags: z.array(Tag).min(1).optional().describe("Hit events only: the hit carries at least one of these tags (its kind, type, subtype or element, and \"crit\" when it crits)."),
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
  element: Id.optional().describe("Its damage pulses meet this element's Resistance. Full Resistance makes the unit immune to it."),
  subtype: Subtype.optional().describe("Used only for damage-taken modifiers on its pulses."),
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
  convert: z.strictObject({ element: Id.optional(), subtype: Subtype.optional() }).optional().describe("Changes the element of the holder's magical instances, or the subtype of its physical ones."),
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

export const WeaponKind = z
  .strictObject({
    id: Id,
    name: Text,
    type: z.enum(["physical", "magical"]),
    subtype: Subtype.optional(),
    element: Id.optional(),
    cooldown: z.number().positive().describe("The kind's speed: the base cooldown of its basic attack, in ticks."),
    note: Note.optional(),
  })
  .describe("A kind of weapon: its speed, damage type and element. Every weapon belongs to one, and a class can use only its kinds.");
export type WeaponKindT = z.infer<typeof WeaponKind>;

export const Weapon = z
  .strictObject({
    kind: Id.optional().describe("A weapon kind: sets type, subtype or element, and cooldown. Any field stated here overrides the kind's."),
    type: z.enum(["physical", "magical"]).optional(),
    subtype: Subtype.optional(),
    element: Id.optional(),
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
  if: Condition.optional().describe("Checked when the action starts: what the ability waits for."),
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
    })
    .optional()
    .describe("At fight start each action is already partly charged: it's first ready after a share of its cooldown, rolled between min and max on the unit's dice for each action (but see slots). Absent: every action starts a fight on its full cooldown."),
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

export const ElementDef = z.strictObject({ id: Id, name: Text });

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
  armor: Weight.describe("The heaviest armor it can wear."),
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
  weight: Weight.optional().describe("Armor only."),
  weapon: Weapon.optional().describe("Weapons only: sets the basic attack. Names its kind."),
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
    z.strictObject({ armor: z.enum(["heavy", "medium", "light", "none"]) }).describe("Every member wears armor of exactly this weight (none: no armor)."),
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
  elements: z.array(ElementDef),
  weaponKinds: z.array(WeaponKind),
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
});
export type ContentPack = z.infer<typeof ContentPack>;

// ─────────────────────────────────────────────────────────────────────────────
// Engine input: a party loadout (player state, not content)
// ─────────────────────────────────────────────────────────────────────────────

export const PartyUnit = z.strictObject({
  class: Id,
  position: Id,
  abilities: z.array(Id).describe("Equipped abilities, in slot order."),
  gear: z.record(Id, Id).describe("Slot (weapon, armor, amulet) to gear id."),
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
