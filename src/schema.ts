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
 *
 * Schema 0.8 (step 5i's build, steps/05-core-set/5i-synergy/build/engine-spec.md):
 * the shapes the gear, formations, upgrades and mythics need. Marked and
 * basic attacks aimed by a rule; markers that are neither buff nor debuff;
 * events that name who did it (the killer, the applier, the breaker) and the
 * tests and filters that read them; seats; ability changes (MP and HP costs,
 * wind-ups, stacks, heals, aim) by what an ability does or by name; crits by
 * condition; extra strikes sized and spread, and strikes fired by reactions;
 * cooldown changes; HP paid; HP floors; revives on a timer; the moment a fight
 * is won; control resistance on bosses; rarities on gear and formations; and
 * the pack's upgrades, each with five forms under fixed ids.
 */
import * as z from "zod";

export const SCHEMA_VERSION = "0.8" as const;

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
  stat: "A stat change, or (step 5i) a stat set to a value. Tag: the stat.",
  boost: "A damage or healing boost. Tag: the boost's tag.",
  taken: "A damage-taken modifier. Tag: its tag, if any.",
  absorb: "An absorb, such as a shield.",
  block: "A block: the next damage above a share of max HP is blocked, then the status ends (Aegis). Step 5i: an HP floor or a cover too.",
  lockout: "A lockout. Tag: what it covers.",
  action_change: "A rider added to the holder's actions, Seek, or an extra strike. Step 5i: an aim, ability changes, crits by condition, echo, or a rule for its revives.",
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
  area: "Step 5i: hits from a damage effect aimed at two or more units at once (an Area spell, a basic attack aimed at every foe). A hit without it is a single-target hit.",
  "<status>":"A status's id: reaches that status's pulses (\"+20% Burn damage\").",
  "<status tag>": "A tag a status carries, which reaches its pulses.",
  healing: "Boosts only: heals.",
  all: "Lockouts and Seek only: every action.",
} as const;

export const EVENTS = {
  fight_start: "The fight begins. Whose: every unit.",
  action_start: "An action starts. Whose: the acting unit. Has `kind`.",
  action_resolve: "An action resolves. Whose: the acting unit. Has `kind`, `amount` (step 5i: the MP it paid) and `count` (step 5i: the units on the other side its hits landed on).",
  action_interrupted: "An action in cast time is canceled by an interrupting lockout. Whose: the casting unit. Has `kind`.",
  hit_lands: "A hit lands (not evaded), riders included. Whose: the attacker; other: the target. Has `kind`, `tags` and `amount`.",
  hit_taken: "A hit lands on this unit. Whose: the target; other: the attacker. Has `kind`, `tags` and `amount`.",
  hit_evaded: "This unit evades a hit. Whose: the target; other: the attacker. Has `kind` and `tags`.",
  hit_missed: "A hit is evaded. Whose: the attacker; other: the target. Has `kind` and `tags`.",
  damage_dealt: "Damage is dealt, including what an absorb soaks. Whose: the dealer, when known; other: the receiver. Has `amount`, and `status` when a status's pulse or reaction dealt it.",
  damage_taken: "Damage is taken, including what an absorb soaks. Whose: the receiver; other: the dealer, when known. Has `amount`, and `status` when a status's pulse or reaction dealt it.",
  hp_lost: "HP is lost. Whose: the unit. Has `amount`. HP paid as a price (the pay effect) isn't lost this way and fires nothing.",
  healed: "Healing is received. Whose: the healed unit; other: the healer, when known. Has `amount` (HP restored), and `kind` when an action healed (step 5i: \"a heal given\" is this event with `other: holder`).",
  overhealed: "Step 5i: healing that would go past max HP. Whose: the healed unit; other: the healer, when known. Has `amount` (the part past full) and `kind` when an action healed.",
  status_gained: "A status is applied (each application, refreshes and added stacks included). Whose: the holder; other (step 5i): the applier. Has `status`, and `amount`: the stacks it added (Intensity only).",
  status_triggered: "A status pulses, or an Intensity status's trigger fires. Whose: the holder. Has `status`.",
  status_ended: "A status ends. Whose: the holder. Has `status` and `cause`. Step 5i: `amount` is the stacks it held as it ended (an Intensity total), but the most an absorb held when damage emptied it (cause stacks), and the damage a block stopped (cause spent); other is the unit whose damage emptied or spent it, or whose effect removed it.",
  status_capped: "An Intensity status stands at its cap after an application (step 5g: Chill shatters). Whose: the holder; other: the applier. Has `status`.",
  ko: "A unit is KO'd. Whose: that unit; other (step 5i): the unit whose damage knocked it out, when known, with `kind` when a hit did it. The unit's own statuses that survive a KO can still react to it.",
  revived: "A unit is revived. Whose: that unit; other: the reviver.",
  fight_won: "Step 5i: the fight is won, the moment the last foe falls, before statuses end. Whose: every party unit, fallen ones included. Its reactions resolve at once, in slot order, and a fallen unit's statuses that survive a KO act for it.",
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

/** Step 5i: a status's label. A marker is bookkeeping: no remove by buff or debuff lifts it, and no count of buffs or debuffs sees it. */
export const LABELS = {
  buff: "Helps its holder. Removed by effects that remove buffs (Dispel); counted by `buffs`.",
  debuff: "Hurts its holder. Removed by effects that remove debuffs (Cleanse); counted by `debuffs`. Its pulses resolve in the batch of the holder's foes.",
  marker: "Step 5i: neither. Bookkeeping such as \"once a fight\" or \"already hit by it\": only a remove that names it lifts it, no immunity to debuffs stops it, and nothing counts it as a buff or debuff. Its pulses resolve in its holder's own batch.",
} as const;
export const Label = z.enum(keys(LABELS));

/** Step 5i: the closed sets of the `cooldown` effect. */
export const COOLDOWN_WHICH = {
  basic: "The basic attack's timer.",
  abilities: "Each of its equipped abilities.",
  longest: "Its ability with the most cooldown left (ties: slot order). Nothing when every one is ready.",
  soonest: "Its ability with the least cooldown left that isn't ready yet (its \"next ability\").",
  event: "Reactions to an action event only: the ability that set the reaction off.",
  "{ ability }": "These abilities by id, each with its trained forms (<id>__p and the rest), if the unit has them equipped.",
} as const;
export const COOLDOWN_SET = {
  ready: "Ready now: no cooldown left. It still needs its MP and its conditions.",
  full: "Its full cooldown left, as if it had just been used.",
  "{ less }": "This many ticks closer, down to ready.",
  "{ times }": "Its cooldown left × times %: 50 halves what's left.",
  "{ atMost }": "Its cooldown left at most atMost % of its full cooldown (\"at least half charged\": 50).",
} as const;

/** Step 5i: the five forms an upgrade has, each content under a fixed id: `<id>__<form>`. */
export const UPGRADE_FORMS = {
  p: "The power step: more of the same.",
  a: "Version A.",
  b: "Version B.",
  ap: "Version A with the power step.",
  bp: "Version B with the power step.",
} as const;
export type UpgradeFormT = keyof typeof UPGRADE_FORMS;
/** The id of an upgrade's form: `fortify__a`. */
export const formId = (id: string, form: UpgradeFormT) => `${id}__${form}`;
/** The ability or passive status a form belongs to, or the id itself when it isn't a form. */
export const formBase = (id: string) => {
  const i = id.lastIndexOf("__");
  return i > 0 && id.slice(i + 2) in UPGRADE_FORMS ? id.slice(0, i) : id;
};

/** Step 5i: what a scale's `count` counts. */
export const COUNTS = {
  buffs: "The buffs the unit read holds.",
  debuffs: "The debuffs the unit read holds.",
  targets: "Actions only: the action's targets, as chosen when it resolved.",
  hit: "Actions only: the units on the other side its hits have landed on so far, each once (an effect after the hits reads them all).",
  "{ side, where }": "The units on that side of the unit read that pass `where` (and its seat, if given).",
} as const;

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
  hasAny: z.array(Id).min(1).optional().describe("Step 5i: has at least one of these statuses (Stunned or Silenced)."),
  lower: z.strictObject({ stat: StatKey }).optional().describe("Step 5i: this stat is lower than the reading unit's: the acting unit in an action, a reaction's actor, a pulse's holder (an ally with less Armor than the wearer)."),
  acted: z.boolean().optional().describe("Step 5i: true once one of its actions has resolved this fight; false until then (a unit summoned mid-fight starts false)."),
  top: z.strictObject({ stats: z.array(StatKey).min(1) }).optional().describe("Step 5i: no living unit on its side has more of the highest of these stats (\"the foe with the highest Attack or Magic\"); ties pass."),
  weapon: z.array(Id).min(1).optional().describe("Step 5i: wields a weapon of one of these kinds (an enemy's weapon by its kind, if it names one)."),
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
      .describe("Step 5i: a count, as COUNTS says: the unit's buffs or debuffs, an action's targets or the units its hits landed on, or the units on a side that pass a test."),
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
  z.enum(["hp", "hp_share", "mp_share", "buffs", "debuffs", "swing"]).describe("swing (step 5i): the basic attack's interval now, its cooldown after Attack speed; highest is the slowest."),
  z.strictObject({ stat: StatKey }),
  z.strictObject({ stats: z.array(StatKey).min(1) }).describe("The highest of these stats (\"the foe with the highest Attack or Magic\")."),
  z.strictObject({ stacks: Id }),
]);

/** Step 5i: a seat in the party's formation, by its position id, or next / previous by slot order (wrapping round). */
const Seat = Id;
const SEAT = "Step 5i: the unit in this seat of the party's formation (a position id), or `next` / `previous`: the seat after or before the reading unit's, by slot order, wrapping round and skipping empty seats.";

export const TargetRule = z.strictObject({
  side: Side,
  where: UnitCond.optional(),
  ifNone: z.literal("any").optional().describe("When `where` leaves nobody, use the whole side instead (\"if every foe is Taunting, any foe\")."),
  exclude: z
    .enum(["targets", "other", "owner"])
    .optional()
    .describe("targets: skip the action's chosen targets (\"a second, random foe\", \"up to three other foes\"). Step 5i, reactions only: other or owner, skip the event's other unit or the unit it's about (\"every other foe\", \"a random foe other than the one it hit\")."),
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
  atLeast: PosInt.optional().describe("At least this many pass. Default 1."),
  atMost: z.number().int().min(0).optional().describe("Step 5i: at most this many pass (0: none does, \"no foe is Marked\")."),
  seat: Seat.optional().describe(SEAT),
}).meta({ id: "Condition" });
export type ConditionT = z.infer<typeof Condition>;

/** Step 5i: a test of one of a reaction's event units. */
export const EventUnitTest = z
  .strictObject({ unit: z.enum(["other", "owner"]).describe("other: the event's other unit (as `to: other`); owner: the unit the event is about (as `to: owner`)."), where: UnitCond.describe("What it must pass.") })
  .describe("Reactions only: the event's other unit, or the unit it's about, passes `where` (\"the foe it hit is Sundered\", \"the ally that took the hit is below half\").");
export const Test = z.union([Condition, EventUnitTest]);
export type TestT = z.infer<typeof Test>;

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
        label: Label.describe("buff or debuff; marker (step 5i) only with `status`, to lift one's own bookkeeping."),
        status: Id.optional(),
        kind: Kind.optional(),
        tag: Tag.optional(),
        count: PosInt.optional().describe("Default: all."),
        order: z.enum(["newest", "random"]).optional().describe("Which go first when fewer than all are removed. Default newest."),
        move: z.literal(true).optional().describe("Step 5i: each status removed passes to the acting unit as it was, its stacks and time left with it, unless the actor is immune to it (a buff stolen)."),
        to: To.optional(),
      })
      .describe("Removes buffs or debuffs, optionally narrowed to a named status or an effect kind. Unremovable statuses stay, and so do the buffs of a unit with immune:dispel."),
    z
      .strictObject({
        op: z.literal("revive"),
        hp: Num.describe("HP the unit comes back with (`target` is the revived unit)."),
        ready: z.boolean().optional().describe("true: every action ready. Default: every action on cooldown, as at the start of a fight. The reviver's `revives` (a status field) wins over this."),
        after: z.number().positive().optional().describe("Step 5i: the unit stands this many ticks later instead, if the fight hasn't ended and nothing has raised it meanwhile; the reviver needn't be standing then (\"stands up a few ticks later\")."),
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
      .describe("Step 5i: changes the cooldown left on a unit's basic attack or abilities: ready now, a full cooldown, some ticks closer, a share of what's left, or at most a share of its full one. A wind-up already under way carries on."),
    z
      .strictObject({ op: z.literal("pay"), hp: Num.describe("HP paid. Negative pays nothing."), to: To })
      .describe("Step 5i: a price in HP (G12): lost at once, not damage, so no Shield soaks it, no Armor cuts it and nothing reacts to it; it never takes the payer below 1 HP. An ability's HP price is this effect on itself, after whatever reads its HP first."),
    z
      .strictObject({
        op: z.literal("strike"),
        share: z.number().positive().optional().describe("Percent of the damage it's sized from. Default 100."),
        of: z.enum(["weapon", "hit"]).optional().describe("weapon (the default): the actor's basic attack against each target, its damage with the weapon's riders and statuses, as an extra strike's. hit: the raw amount of the hit that set the reaction off (before Armor or Magic resist), in that hit's damage type."),
        to: To.optional(),
      })
      .describe("Step 5i, reactions only: a hit of kind extra by the actor at each target (the dodge's riposte, the blow returned for an ally). It can crit and be dodged, meets Armor or Magic resist, and fires hit events; it never brings extra strikes of its own."),
    z
      .strictObject({ op: z.literal("one"), of: z.array(HitApply).min(2).describe("The statuses to pick from, each with its own stacks."), to: To.optional() })
      .describe("Step 5i: applies one of these statuses, picked at random on the actor's dice."),
    z
      .strictObject({ op: z.literal("recast") })
      .describe("Step 5i, reactions to the holder's own action_resolve only: the action that set it off resolves again at once, with no wind-up and no MP, choosing its targets afresh by its own rule, its cooldown untouched. The repeat fires its own action events, which `repeat: false` filters skip."),
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

export const StatChange = z.strictObject({
  stat: StatKey,
  flat: Num.optional(),
  pct: Num.optional(),
  live: z.literal(true).optional().describe("Step 5i: read whenever the holder's stats are worked out, from its other stats as they stand without this change (Thorns from Armor, Guard included), not once at application."),
});
/** A stat change from gear, a passive, a formation or a perk. Plain numbers. */
export const FixedStat = z.strictObject({ stat: StatKey, flat: z.number().optional(), pct: z.number().optional() });
export type FixedStatT = z.infer<typeof FixedStat>;

export const EventSpec = z.strictObject({
  event: EventName,
  whose: Whose.optional(),
  kind: z.enum(["basic", "ability", "extra"]).optional().describe("Action and hit events, and (step 5i) ko, healed and overhealed: the kind of the action or hit behind it."),
  tags: z.array(Tag).min(1).optional().describe("Hit events only: the hit carries at least one of these tags (its kind and type, \"crit\" when it crits, \"area\" when its effect is aimed at several units)."),
  notTags: z.array(Tag).min(1).optional().describe("Step 5i, hit events only: the hit carries none of these (`area`: a single-target hit)."),
  status: Id.optional().describe("Status events, and damage events: the status whose pulse or reaction dealt the damage."),
  cause: z.array(Cause).min(1).optional().describe("status_ended only. Default: every cause."),
  other: Whose.optional().describe("Step 5i: who the event's other unit is, from the holder's side: holder (a kill it landed, a status it applied, a heal or revive it gave), ally, foe, or any (there is one)."),
  source: z.literal("holder").optional().describe("Step 5i, status events only: the status was applied by the holder (a Mark it gave, an Aegis it gave)."),
  seat: Seat.optional().describe("Step 5i: the unit the event is about sits in this seat of the party's formation (a position id, or next / previous from the holder's)."),
  amountAtLeast: z.number().optional().describe("Step 5i: the event's amount is at least this (\"a cast that paid MP\": 1)."),
  countAtLeast: PosInt.optional().describe("Step 5i, action_resolve only: its hits landed on at least this many units of the other side."),
  repeat: z.boolean().optional().describe("Step 5i, action events only: true matches only a recast's repeat, false only ordinary actions. Default: both."),
});
export type EventSpecT = z.infer<typeof EventSpec>;

export const Reaction = z.strictObject({
  on: EventSpec,
  actor: z.enum(["holder", "source"]).optional().describe("Who acts. source only for statuses that know their source. Default holder."),
  if: z.union([Test, z.array(Test).min(1)]).optional().describe("Step 5i: checked when the reaction resolves, every one must hold: a side's state (as an ability's `if`, read from the actor's side) or a test of the event's other unit or owner. When one fails, the reaction does nothing."),
  do: z.array(Effect).min(1).describe("Each effect states its target (`to`)."),
});

/** Step 5i: which abilities an ability change reaches. Both fields given: both must hold. */
export const AbilityFilter = z.strictObject({
  ability: z.array(Id).min(1).optional().describe("These abilities by id, each with its trained forms (a mythic naming its class's ability)."),
  does: z.array(Id).min(1).optional().describe("Abilities whose effects do one of these: revive, heal or damage, or apply this status (stun, silence, shield, guard...)."),
});
export type AbilityFilterT = z.infer<typeof AbilityFilter>;

/** Step 5i: a change to the holder's own abilities (spine additions 3, 4 and 14), read each time one is used. */
export const AbilityMod = z.strictObject({
  of: AbilityFilter.optional().describe("Absent: every ability the holder has."),
  if: UnitCond.optional().describe("The holder passes this when the ability is checked and when it pays (\"while it holds over half its MP\")."),
  mp: z.number().min(-100).optional().describe("Percent change to its MP cost: −20 a fifth less, −100 free, +50 half again. Changes add up; the cost never falls below 0."),
  hp: z
    .strictObject({
      pct: z.number().positive().describe("Percent of the ability's own MP cost (before `mp` changes), paid in HP as the pay effect pays (G12)."),
      share: z.literal(true).optional().describe("Paid as the same share of max HP as the cost is of max MP, not point for point."),
      floor: z.number().min(0).max(100).optional().describe("The ability waits rather than leave the holder below this percent of its max HP."),
    })
    .optional()
    .describe("An HP price on top, paid when the ability resolves, with its MP."),
  cast: z.number().min(0).optional().describe("Its wind-up, in ticks, before cast-time reduction, in place of its own (\"winds up in a moment\": 1)."),
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

/** Step 5i: crits by condition, for the holder's hits. */
export const CritRule = z.strictObject({
  tag: Tag.optional().describe("Only hits carrying this tag (basic, ability, extra, physical, magical, area)."),
  when: UnitCond.optional().describe("Only hits on a unit that passes this, read as the hit lands."),
  chance: z.number().optional().describe("Points added to the hit's crit chance, after every stat change (100: it always crits, whatever else holds, Gambler's coin included)."),
  bonus: z.number().optional().describe("Percent more crit bonus, the part of the crit multiplier above ×1: 100 makes ×1.5 into ×2."),
});
export type CritRuleT = z.infer<typeof CritRule>;

export const Status = z.strictObject({
  id: Id,
  name: Text.describe("Shown on its icon or sheet line, e.g. BURN."),
  text: Text.optional(),
  label: Label.describe("Drives removal, conditions and the batch its pulses resolve in. marker (step 5i): neither buff nor debuff."),
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
      to: z.union([z.literal("target"), TargetRule]).describe("The same target, or a rule (Arc: a second, random foe, excluding the target). Step 5i: a rule that picks several units strikes each of them (every other foe)."),
      share: z.number().positive().optional().describe("Step 5i: percent of the weapon's damage each strike deals. Default 100."),
      chain: z
        .strictObject({ times: PosInt, share: z.number().positive().max(100) })
        .optional()
        .describe("Step 5i: each strike that lands rolls `chance` again for one more, at most `times` more after the first, each share % of the one before. It takes the place of a plain strike on the unit that reads the same `scale` stat (Flurry wraps over Double strike), so a swing rolls that chance once. The one bend of \"extra strikes don't chain\"."),
    })
    .optional()
    .describe("After each of the holder's basic attacks: one more hit with the weapon's damage, of kind extra, at `to`. Extra strikes don't chain."),
  pulse: z
    .strictObject({
      every: z.number().positive(),
      do: z.array(Effect).optional().describe("Absent: the pulse is only a timer, for an Intensity drop."),
      if: z.union([Condition, z.array(Condition).min(1)]).optional().describe("Step 5i: a pulse whose conditions fail does nothing that beat (\"while any foe burns\"); an Intensity drop still happens."),
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
    .describe("Step 5i, Marked: the holder's foes' basic attacks pick a holder while one can be picked, by draw among several, under the Taunt rule (Seek follows it past a Taunting foe). Abilities keep their own targeting."),
  single: z
    .literal(true)
    .optional()
    .describe("Step 5i, Marked: each applier keeps one copy: applying it to a unit ends the copy that applier gave anywhere else. Statuses that know their source only."),
  aim: z
    .strictObject({
      rule: TargetRule.describe("Its Taunt rule is an action's own; an all-pick hits every unit it finds, each hit a basic attack's."),
      first: z.literal(true).optional().describe("Ahead of a Marked foe. Without it, a Marked foe comes first."),
    })
    .optional()
    .describe("Step 5i: the holder's basic attacks pick by this rule. When it finds nobody, the next in line picks: a Marked foe, then the default."),
  mods: z.array(AbilityMod).min(1).optional().describe("Step 5i: changes to the holder's own abilities, read each time one is used. An Intensity status's changes don't grow with its stacks."),
  crits: z.array(CritRule).min(1).optional().describe("Step 5i: crits by condition on the holder's hits."),
  echo: z
    .literal(true)
    .optional()
    .describe("Step 5i: the holder's extra strikes are heard as basic attacks by its statuses' reactions and triggers that name kind basic, unless that status also names kind extra for the same event, or gives strikes itself. Boosts still see them as extra."),
  set: z
    .array(z.strictObject({ stat: StatKey, value: z.number() }))
    .min(1)
    .optional()
    .describe("Step 5i: after every other change, the holder's stat is this value while it holds the status."),
  cover: z
    .strictObject({ share: z.number().gt(0).max(100) })
    .optional()
    .describe("Step 5i: when a hit on another living ally would deal it more than share % of its max HP, after its mitigation and before its block and absorbs, the holder takes the whole hit instead: it resolves again against the holder, statuses and riders included, keeping its crit and without a second dodge. A hit moves once."),
  floor: z
    .strictObject({ spend: z.literal(true).optional().describe("The status ends (cause spent) the first time it holds a blow.") })
    .optional()
    .describe("Step 5i: the holder's HP can't fall below 1 while it holds this: a blow that would knock it out leaves it at 1, and nothing falls."),
  heals: z.literal("own").optional().describe("Step 5i: only its own heals land on the holder (its abilities, its Lifesteal, its statuses' reactions); heals from others, a Regen they gave included, restore nothing."),
  revives: z
    .strictObject({
      ready: z.boolean().optional().describe("true: every action ready; false: every action on cooldown. It wins over the revive's own `ready`, and false wins over true."),
      hp: Num.optional().describe("The HP they come back with, in place of the revive's (target is the revived unit)."),
    })
    .optional()
    .describe("Step 5i: every revive the holder makes, from its abilities and its statuses' reactions alike (Einherjar)."),
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
  if: z
    .union([Condition, z.array(Condition).min(1), z.strictObject({ any: z.array(Condition).min(2) })])
    .optional()
    .describe("Checked when the action starts: what the ability waits for. Several conditions must all hold (step 5g); `any` (step 5i): at least one must."),
  target: Target.optional().describe("foe (default): a foe by Aggro, under the Taunt rule. ally: a random ally. Or a stated rule. Chosen when the action resolves."),
  seek: z.boolean().optional().describe("Its first pick ignores Taunt."),
  do: z.array(Effect).min(1),
  statuses: z.array(Id).min(1).optional().describe("Step 5i: statuses its unit holds while the ability is equipped, applied at fight start and on a revive as gear's are (a version that listens all fight)."),
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

/** An enemy's rank. */
export const Rank = z.enum(["minion", "elite", "boss"]);

/** Step 5i (the director's, Oct 30): bosses resist repeated control, the one exception to universal statuses. */
export const Control = z
  .strictObject({
    ranks: z.array(Rank).min(1).describe("Enemies of these ranks resist control."),
    statuses: z.array(Id).min(1).describe("The control statuses: each one that lands adds a hidden stack (a Chill shatter's Stun included). One that doesn't land (Fizzle, an immunity) adds nothing."),
    resist: z
      .strictObject({ at: PosInt, pct: z.number().gt(0).lt(100) })
      .describe("From `at` stacks, they land for pct % of their own length, and the battle text says RESISTED."),
    cap: PosInt.describe("The most stacks. At the cap they don't land at all, the battle text says IMMUNE, and they add no stack."),
    drain: z.number().positive().describe("One stack drains away this many ticks after the last stack was gained or lost, so a party that isn't chaining control sits near zero."),
  })
  .describe("Control resistance: hidden stacks, no icon.");
export type ControlT = z.infer<typeof Control>;

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
  control: Control.optional().describe("Step 5i: control resistance on bosses. Absent: none."),
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

/** Step 5j: mythic, above legendary, for a piece that fits one class. Step 5i: every piece's own rarity. */
export const Rarity = z.enum(["common", "uncommon", "rare", "legendary", "mythic"]);
export type RarityT = z.infer<typeof Rarity>;
/** Step 5i: a formation's rarity. Neutral is common; no formation is mythic. */
export const FormationRarity = z.enum(["common", "rare", "legendary"]);
export type FormationRarityT = z.infer<typeof FormationRarity>;

export const Gear = z.strictObject({
  id: Id,
  name: Text,
  text: Text,
  slot: Slot,
  rarity: Rarity.optional().describe("Step 5i: the piece's own rarity, fixed: no affixes at any rarity. mythic exactly when it names a `mythic` class."),
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
  rarity: FormationRarity.optional().describe("Step 5i: its rarity (Neutral common), in place of the rogue config's provisional formationRarity."),
  source: UnlockSource,
  positions: z.array(Position),
  ...grants,
  note: Note.optional(),
}).describe("Its own `stats` and `statuses` are its effect: given to every unit in it.");

export const Enemy = z.strictObject({
  id: Id,
  name: Text,
  text: Text.describe("How it behaves, as the player reads it. Never says what beats it."),
  rank: Rank,
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
  legendaries: z.array(Id).describe("The legendary pool, by gear id, in pack.gear or rogue.gear."),
  aims: z.record(Id, z.array(Id).min(1)).optional().describe("Who each legendary piece is for, by class id: an elite's trophy comes from pieces aimed at the party, and a recruit leans toward a class a piece in the bag is for. Never shown (step 5h round 6, the director's: the FOR line “ruins the discovery”)."),
  affixes: z.array(RogueAffix),
  events: z.array(RogueEvent).min(1),
});
export type RogueT = z.infer<typeof Rogue>;

// ─────────────────────────────────────────────────────────────────────────────
// Upgrades (step 5i): each ability and passive's power step and two versions
// ─────────────────────────────────────────────────────────────────────────────

export const UpgradeVersion = z.strictObject({ name: Text, text: Text.describe("Its card, as the training screen reads it.") });

export const Upgrade = z
  .strictObject({
    id: Id.describe("The ability, or the passive status, it upgrades. Its five forms are content under fixed ids: <id>__p, <id>__a, <id>__b, <id>__ap and <id>__bp (UPGRADE_FORMS)."),
    class: Id.describe("The class it belongs to."),
    kind: z.enum(["ability", "passive"]).describe("ability: each form is an ability of the class, in pack.abilities. passive: each form is a status, in pack.statuses, that takes the passive status's place."),
    power: Text.describe("The power step's card."),
    a: UpgradeVersion.describe("Version A."),
    b: UpgradeVersion.describe("Version B."),
    note: Note.optional(),
  })
  .describe("Training is learning an ability, taking an ability's or the passive's power step, or taking its version A or B; the power step and a version are two trainings, in either order, and the version and its power step together are the `ap` or `bp` form.");
export type UpgradeT = z.infer<typeof Upgrade>;

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
  upgrades: z.array(Upgrade).optional().describe("Step 5i: one for each ability and passive that can be trained. Absent: none."),
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
  abilities: z.array(Id).describe("Equipped abilities, in slot order: a class ability, or (step 5i) the trained form of one (<id>__p, __a, __b, __ap or __bp)."),
  passive: Id.optional().describe("Step 5i: the trained form of its class passive (<passive>__p, __a, __b, __ap or __bp): a status that takes the passive status's place at fight start and on a revive. Absent: the class's own."),
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
