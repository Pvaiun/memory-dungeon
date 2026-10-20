/**
 * Memory Dungeon Game: content schema, v0.4 (design plan step 4, combat concepts).
 *
 * One data format for everything the engine runs on. Step 4 replaced schema
 * 0.3's turn-based rule language with the director's combat design
 * (steps/04-combat-concepts/design.md): fights run on ticks, and everything
 * that happens on an event or a timer is a status. Content is built from
 *   - stats (a registry, plus the families resist:<element> and immune:...),
 *   - statuses (bundles of effects with one duration, stacking mode and removal),
 *   - actions (a weapon's basic attack, and abilities),
 *   - targeting rules and conditions,
 * and the closed sets below, which each need engine code.
 *
 * Text fields are split in two kinds:
 *   - `name`, `text`, `word`, `forms`: player-facing. The engine never reads them.
 *   - `note`: designer-only. Never shown, never read by the engine.
 *
 * Verbs, traits and keyholes are design vocabulary. The engine never reads them.
 */
import * as z from "zod";

export const SCHEMA_VERSION = "0.4" as const;

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
/** A tag that boosts, damage-taken modifiers, lockouts and riders match: see TAGS. */
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
  physical: "Has exactly one subtype and no element. Meets Evasion and Armor. Attack scales only physical instances.",
  magical: "Has exactly one element and no subtype. Meets that element's Resistance. Magic scales only magical instances.",
  none: "Typeless: never meets Evasion or Armor; meets Resistance only if it carries an element. Not allowed in actions; the usual type for a status's own damage.",
} as const;
export const DamageType = z.enum(keys(TYPES));

/** Stats the engine itself reads. The registry must define each, with this kind. */
export const ENGINE_STATS = {
  max_hp: ["amount", "Max HP. A unit is KO'd at 0 HP."],
  max_mp: ["amount", "Max MP. Abilities cost MP, paid when they resolve."],
  attack: ["amount", "Scales only what states it. By convention, physical things do."],
  magic: ["amount", "Scales only what states it. By convention, magical things do."],
  armor: ["amount", "A flat reduction on each physical instance, down to 0 (BLOCKED)."],
  aggro: ["amount", "Default targeting picks foes weighted by Aggro. Its floor must be above 0."],
  resist: ["points", "General Resistance, in percent, added to every element's own resist:<element>. Negative shows WEAK, positive RESIST, 100 IMMUNE."],
  attack_speed: ["points", "Basic attack cooldown ÷ (1 + stat/100), down to its recovery."],
  cooldown_reduction: ["points", "Ability cooldowns ÷ (1 + stat/100)."],
  cast_time_reduction: ["points", "Cast times ÷ (1 + stat/100)."],
  crit_chance: ["points", "Percent chance that an action's damage or heal crits."],
  crit_multiplier: ["points", "A crit multiplies by this percent (150 is ×1.5)."],
  evasion: ["points", "Percent chance to evade a physical hit, after Accuracy, under its cap."],
  accuracy: ["points", "Reduces the target's Evasion, down to 0. Negative adds to it."],
  healing_received: ["points", "Heals received × (1 + stat/100)."],
  forced: ["points", "Above 0: default targeting must pick this unit (with other forced units)."],
  forbidden: ["points", "Above 0: default targeting can't pick this unit, unless every candidate is."],
} as const;

export const STAT_FAMILIES = {
  "resist:<element>": "Resistance to one element, in percent, added to the general resist.",
  "immune:status:<status>": "Above 0: immune to that status.",
  "immune:kind:<kind>": "Above 0: immune to every status containing that effect kind.",
  "immune:kind:<kind>:<tag>": "Above 0: immune to statuses containing that effect kind with that tag (a lockout's `covers`, a stat change's stat, a boost's or modifier's tag).",
  "immune:debuffs": "Above 0: immune to every debuff.",
  "immune:damage": "Above 0: takes no damage (IMMUNE), and so is immune to statuses that deal damage.",
} as const;

export const KINDS = {
  stat: "A stat change. Tag: the stat.",
  boost: "A damage or healing boost. Tag: the boost's tag.",
  taken: "A damage-taken modifier. Tag: its tag, if any.",
  absorb: "An absorb, such as a shield.",
  lockout: "A lockout. Tag: what it covers.",
  action_change: "A rider added to the holder's actions, or a change of element or subtype.",
  pulse: "A repeating effect.",
  reaction: "A reaction, or an Intensity event trigger.",
} as const;
export const Kind = z.enum(keys(KINDS));

export const TAGS = {
  basic: "Instances from basic attacks; for lockouts, basic attacks.",
  ability: "Instances from abilities; for lockouts, abilities.",
  physical: "Physical instances (and actions with one).",
  magical: "Magical instances (and actions with one).",
  "<subtype>": "slash, pierce or blunt.",
  "<element>": "Any element in the pack.",
  "<status>": "A status's id: reaches that status's pulses (\"+20% Burn damage\").",
  "<status tag>": "A tag a status carries, which reaches its pulses.",
  healing: "Boosts only: heals.",
  all: "Lockouts only: every action.",
} as const;

export const EVENTS = {
  fight_start: "The fight begins. Whose: every unit.",
  action_start: "An action starts. Whose: the acting unit. Has `kind`.",
  action_resolve: "An action resolves. Whose: the acting unit. Has `kind`.",
  action_interrupted: "An action in cast time is canceled by an interrupting lockout. Whose: the casting unit. Has `kind`.",
  hit_lands: "A hit lands (not evaded), riders included. Whose: the attacker; other: the target. Has `kind` and `amount`.",
  hit_taken: "A hit lands on this unit. Whose: the target; other: the attacker. Has `kind` and `amount`.",
  hit_evaded: "This unit evades a hit. Whose: the target; other: the attacker. Has `kind`.",
  hit_missed: "A hit is evaded. Whose: the attacker; other: the target. Has `kind`.",
  damage_dealt: "Damage is dealt, including what an absorb soaks. Whose: the dealer, when known; other: the receiver. Has `amount`.",
  damage_taken: "Damage is taken, including what an absorb soaks. Whose: the receiver; other: the dealer, when known. Has `amount`.",
  hp_lost: "HP is lost. Whose: the unit. Has `amount`.",
  healed: "Healing is received. Whose: the healed unit; other: the healer, when known. Has `amount` (HP restored).",
  status_gained: "A status is applied (each application, refreshes and added stacks included). Whose: the holder. Has `status`.",
  status_triggered: "A status pulses, or an Intensity status's trigger fires. Whose: the holder. Has `status`.",
  status_ended: "A status ends. Whose: the holder. Has `status` and `cause`.",
  ko: "A unit is KO'd. Whose: that unit.",
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
  removed: "An effect removed it.",
  ko: "Its holder was KO'd, or its source (Per source statuses that end with their source).",
  fight_end: "The fight ended.",
} as const;
export const Cause = z.enum(keys(CAUSES));
export type CauseT = z.infer<typeof Cause>;

export const SCALE_OF = {
  self: "Actions: the acting unit. The default for stats in actions.",
  target: "Actions: the unit the effect lands on. The default for hp and stacks in actions.",
  source: "Statuses that know their source (not a shared Intensity total): the unit that applied it, read once at application.",
  holder: "Statuses: the holder, read each time the number is used (stat changes: once, at application). The default for hp and stacks in statuses; stats must say whose.",
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
  all: "Every unit that passes `where`.",
} as const;
export const Pick = z.enum(keys(PICKS));

// ─────────────────────────────────────────────────────────────────────────────
// Numbers, conditions and targeting
// ─────────────────────────────────────────────────────────────────────────────

export const Scale = z
  .strictObject({
    ratio: z.number(),
    stat: StatKey.optional().describe("A stat's current value."),
    hp: z.enum(["current", "missing"]).optional().describe("Current HP, or max HP minus current."),
    stacks: Id.optional().describe("A status's Intensity total, in stacks."),
    amount: z.literal(true).optional().describe("Reactions only: the event's amount."),
    of: Of.optional(),
  })
  .refine((s) => [s.stat, s.hp, s.stacks, s.amount].filter((x) => x !== undefined).length === 1, {
    message: "a scale names exactly one of stat, hp, stacks or amount",
  });
export type ScaleT = z.infer<typeof Scale>;

/** A number: base + Σ ratio × source. */
export const Num = z.union([z.number(), z.strictObject({ base: z.number().optional(), scale: z.array(Scale).min(1) })]);
export type NumT = z.infer<typeof Num>;

export const KindRef = z.strictObject({ kind: Kind, tag: Tag.optional() });

/** Tests on one unit. Every field given must hold. */
export const UnitCond = z.strictObject({
  hpBelow: z.number().min(0).max(100).optional().describe("HP below this percent of max HP."),
  hpAtLeast: z.number().min(0).max(100).optional(),
  has: Id.optional().describe("Has this status."),
  lacks: Id.optional().describe("Doesn't have this status."),
  buffs: z.boolean().optional().describe("true: has any buff. false: has none."),
  debuffs: z.boolean().optional().describe("true: has any debuff. false: has none."),
  kind: KindRef.optional().describe("Has a status containing this effect kind (narrowed by tag)."),
  stacks: z.strictObject({ status: Id, atLeast: z.number() }).optional().describe("A status's Intensity total, in stacks."),
});
export type UnitCondT = z.infer<typeof UnitCond>;

export const Value = z.union([
  z.enum(["hp", "hp_share", "buffs", "debuffs"]),
  z.strictObject({ stat: StatKey }),
  z.strictObject({ stacks: Id }),
]);

export const TargetRule = z.strictObject({
  side: Side,
  where: UnitCond.optional(),
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
/** A status attached to a hit: applies whenever the hit occurs, even if BLOCKED; never if evaded. */
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
        count: PosInt.optional().describe("Default: all. Fewer than all removes the newest first."),
        to: To.optional(),
      })
      .describe("Removes buffs or debuffs, optionally narrowed to a named status or an effect kind. Unremovable statuses stay."),
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
  kind: z.enum(["basic", "ability"]).optional().describe("Action and hit events only."),
  status: Id.optional().describe("Status events only."),
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
  boosts: z.array(z.strictObject({ tag: Tag, pct: Num })).optional().describe("The holder's outgoing damage or healing, by tag."),
  taken: z.array(z.strictObject({ tag: Tag.optional(), pct: Num })).optional().describe("Damage-taken modifiers. No tag: all damage."),
  absorb: z.literal(true).optional().describe("Intensity only: soaks damage after mitigation, one stack per point."),
  lockout: z.strictObject({ covers: Tag, interrupt: z.boolean().optional() }).optional(),
  riders: z.array(z.strictObject({ on: Tag, add: Instance })).optional().describe("Adds a rider to the holder's hits that carry `on`."),
  convert: z.strictObject({ element: Id.optional(), subtype: Subtype.optional() }).optional().describe("Changes the element of the holder's magical instances, or the subtype of its physical ones."),
  pulse: z.strictObject({ every: z.number().positive(), do: z.array(Effect).min(1) }).optional().describe("A repeating effect. Intensity: its trigger."),
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
// Actions
// ─────────────────────────────────────────────────────────────────────────────

export const Weapon = z
  .strictObject({
    type: z.enum(["physical", "magical"]),
    subtype: Subtype.optional(),
    element: Id.optional(),
    hits: PosInt.optional(),
    cooldown: z.number().positive().describe("The base cooldown, in ticks."),
    amount: Num.describe("Per hit: a base, plus whatever scaling the weapon states. Nothing scales it by default."),
    cast: Ticks.optional().describe("Default 0."),
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
  if: Condition.optional().describe("Checked when the action starts."),
  target: Target.optional().describe("foe (default): a foe by Aggro, with overrides. ally: a random ally. Or a stated rule. Chosen when the action resolves."),
  ignoresOverrides: z.boolean().optional(),
  do: z.array(Effect).min(1),
  verbs: z.array(Id),
  note: Note.optional(),
});
export type AbilityT = z.infer<typeof Ability>;

// ─────────────────────────────────────────────────────────────────────────────
// Design constraints: the concept spec's numbers, as data the validator reads
// ─────────────────────────────────────────────────────────────────────────────

export const Design = z.strictObject({
  note: Note.optional(),
  formationPositions: PosInt,
  partySize: IntRange,
  abilitiesPerSpec: PosInt,
  abilitiesEquipped: PosInt,
  perkPicksPerRun: IntRange,
  perkPoolSize: IntRange,
  perkOptionsPerPick: PosInt,
  keyholesPerBoss: IntRange,
  complete: z
    .strictObject({ classes: IntRange, specsPerClass: IntRange, verbs: IntRange })
    .describe("Totals checked only with --complete, for a full content set."),
}).describe("Target numbers the validator enforces. Placeholders from the concept spec, which was bullish on them: expect them to change.");

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
  taken: z.strictObject({ floor: z.number(), cap: z.number() }).describe("Bounds on a unit's total damage-taken modifier, in percent."),
  unarmed: Weapon.describe("The basic attack of a unit with no weapon."),
  maxEnemies: PosInt.describe("Most enemies in a fight."),
  run: z.strictObject({
    defeatedUnits: z.enum(["stay_down"]).describe("Recovery between fights belongs to step 11."),
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

export const VerbDef = z.strictObject({
  id: Id,
  name: z.string().min(1).describe("Internal label. Verbs are never shown to players."),
  note: Note.describe("Definition, in terms of the numerical systems. Step 5 defines the real list."),
});

export const TraitDef = z.strictObject({
  id: Id,
  word: Text.describe("The fixed player-facing word or phrase. Its meaning never varies."),
  forms: z.array(Text).optional().describe("Inflections that count as the same word in enemy text."),
  verbs: z.array(Id).min(1).describe("The verb profile this word stands for."),
  note: Note.optional(),
});

export const SlotDef = z.strictObject({
  id: Id,
  name: Text,
  class: Id.optional().describe("Absent: a generic slot every unit has."),
});

// ─────────────────────────────────────────────────────────────────────────────
// Content
// ─────────────────────────────────────────────────────────────────────────────

const UnlockSource = z.enum(["starter", "unlock"]).describe("starter: owned from the start. unlock: a reward from a real-life quest.");

export const StatBlock = z.record(StatKey, z.number()).describe("Stat key to base value. Missing stats use the registry's default.");

/** What a passive, gear, a formation slot, a formation or a perk gives: stats like gear, and statuses applied at fight start. */
const grants = {
  stats: z.array(FixedStat).optional(),
  statuses: z.array(Id).optional().describe("Applied to the unit at fight start; usually permanent and unremovable."),
};

export const ClassDef = z.strictObject({
  id: Id,
  name: Text,
  text: Text,
  slots: z.array(Id).describe("Class-specific gear slots, on top of the generic ones."),
  stats: StatBlock.describe("Base stats every specialization of the class starts from."),
  passive: z.strictObject(grants).optional().describe("The class passive. Its stat grants are stats; its reactions live in the statuses it applies at fight start."),
  note: Note.optional(),
});

export const Specialization = z
  .strictObject({
    id: Id,
    class: Id,
    name: Text.describe('Shown as "Class: Specialization", e.g. "Ranger: Duelist".'),
    text: Text,
    source: UnlockSource,
    stats: StatBlock.optional().describe("Overrides the class's base stats."),
    abilities: z.array(Id),
    verbs: z.array(Id),
    note: Note.optional(),
  })
  .describe("A unit. The player owns at most one of each and can field it once per party.");

export const Gear = z.strictObject({
  id: Id,
  name: Text,
  text: Text,
  slot: Id,
  tier: z.enum(["efficacy", "powerful", "capstone"]),
  source: z.enum(["starter", "loot", "unlock"]),
  class: z.array(Id).optional().describe("Classes that can equip it. Absent: any class."),
  rank: PosInt.describe("Progression band, for gear curves and loot tables."),
  weapon: Weapon.optional().describe("A weapon: sets the basic attack."),
  ...grants,
  verbs: z.array(Id),
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
  .describe("A formation slot: its own effects, for the unit in it. Its place in the list is the unit's slot order.");

export const Formation = z.strictObject({
  id: Id,
  name: Text,
  text: Text,
  source: UnlockSource,
  positions: z.array(Position),
  ...grants,
  verbs: z.array(Id),
  note: Note.optional(),
});

export const Keyhole = z
  .strictObject({
    id: Id,
    from: Id.describe("The enemy's own verb this keyhole comes from."),
    counteredBy: z.array(Id).min(1).describe("Verbs that work well against it. Any of them helps; none of them wins alone."),
    strongAgainst: z.array(Id).optional().describe("Verbs it blunts."),
    note: Note,
  })
  .describe("Design intent only, for difficulty prediction. Never shown to players, never read by the engine.");

export const Enemy = z.strictObject({
  id: Id,
  name: Text,
  text: Text.describe("Short description of how it behaves. Must use each trait's word, never say what beats it."),
  rank: z.enum(["minion", "elite", "boss"]),
  traits: z.array(Id),
  stats: StatBlock.describe("Hidden from the player. Innate immunities are immune:... stats here."),
  weapon: Weapon.optional().describe("Its basic attack. Absent: ruleset.unarmed."),
  abilities: z.array(Id).optional().describe("Equipped, in slot order."),
  statuses: z.array(Id).optional().describe("Applied at fight start."),
  keyholes: z.array(Keyhole).optional(),
  verbs: z.array(Id),
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
  for: z.strictObject({ classes: z.array(Id).optional(), specs: z.array(Id).optional() }).optional().describe("Which party units receive it. Absent: all."),
  ...grants,
  verbs: z.array(Id),
  note: Note.optional(),
});

export const FightStage = z.strictObject({
  kind: z.literal("fight"),
  id: Id,
  boss: z.boolean().optional(),
  enemies: z.array(Id).min(1).describe("Enemy ids, in slot order. Enemies have no formation."),
  note: Note.optional(),
});
export const PickStage = z.strictObject({ kind: z.literal("perk_pick"), id: Id });
export const Stage = z.discriminatedUnion("kind", [FightStage, PickStage]);

export const LootTable = z.strictObject({
  guaranteed: z.array(Id).optional(),
  rolls: z.number().int().min(0).optional(),
  table: z.array(z.strictObject({ gear: Id, weight: z.number().positive() })).optional(),
});

export const Constraint = z.union([
  z.strictObject({ partySize: z.strictObject({ min: PosInt.optional(), max: PosInt.optional() }) }),
  z.strictObject({
    classCount: z.strictObject({ class: Id, min: z.number().int().min(0).optional(), max: z.number().int().min(0).optional() }),
  }),
  z.strictObject({ includesSpec: Id }),
  z.strictObject({ excludesSpec: Id }),
  z.strictObject({ excludesClass: Id }),
  z.strictObject({ formation: Id }),
]);
export type Constraint = z.infer<typeof Constraint>;

export const Challenge = z.strictObject({
  id: Id,
  text: Text,
  constraints: z.array(Constraint).min(1).describe("Only things the player can see: party size, classes, specializations, formation."),
  loot: LootTable,
  note: Note.optional(),
});

export const Dungeon = z.strictObject({
  id: Id,
  name: Text,
  text: Text,
  partySize: z.strictObject({ max: PosInt }),
  perkPool: z.array(Id),
  stages: z.array(Stage).min(1),
  loot: z.strictObject({ firstClear: LootTable, replay: LootTable }),
  challenges: z.array(Challenge).describe("Fixed sequence. Clearing one reveals the next."),
  note: Note.optional(),
});

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
  statuses: z.array(Status),
  verbs: z.array(VerbDef),
  traits: z.array(TraitDef),
  slots: z.array(SlotDef),
  classes: z.array(ClassDef),
  specializations: z.array(Specialization),
  abilities: z.array(Ability),
  gear: z.array(Gear),
  formations: z.array(Formation),
  enemies: z.array(Enemy),
  perkFamilies: z.array(PerkFamily),
  perks: z.array(Perk),
  dungeons: z.array(Dungeon),
  starter: z.strictObject({
    specializations: z.array(Id).min(1),
    formations: z.array(Id).min(1),
    gear: z.array(Id),
  }),
  progression: z.strictObject({ dungeonOrder: z.array(Id).min(1) }),
});
export type ContentPack = z.infer<typeof ContentPack>;

// ─────────────────────────────────────────────────────────────────────────────
// Engine input: a party loadout (player state, not content)
// ─────────────────────────────────────────────────────────────────────────────

export const PartyUnit = z.strictObject({
  spec: Id,
  position: Id,
  abilities: z.array(Id).describe("Equipped abilities, in slot order."),
  gear: z.record(Id, Id).describe("Slot id to gear id."),
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
export type VerbDefT = z.infer<typeof VerbDef>;
export type TraitDefT = z.infer<typeof TraitDef>;
export type SlotDefT = z.infer<typeof SlotDef>;
export type ClassDefT = z.infer<typeof ClassDef>;
export type SpecializationT = z.infer<typeof Specialization>;
export type GearT = z.infer<typeof Gear>;
export type FormationT = z.infer<typeof Formation>;
export type EnemyT = z.infer<typeof Enemy>;
export type KeyholeT = z.infer<typeof Keyhole>;
export type PerkT = z.infer<typeof Perk>;
export type DungeonT = z.infer<typeof Dungeon>;
export type ChallengeT = z.infer<typeof Challenge>;
export type LootTableT = z.infer<typeof LootTable>;
export type PartyUnitT = z.infer<typeof PartyUnit>;
