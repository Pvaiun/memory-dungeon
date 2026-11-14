/** The schema's primitives (ids, text, numbers, the sub-tick) and its closed sets: each needs engine code, so adding one is a schema version bump. */
import * as z from "zod";

export const SCHEMA_VERSION = "0.13" as const;

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
export const Fraction = z.number().min(0).max(1);
export const PosInt = z.number().int().min(1);
export const IntRange = z.tuple([z.number().int().min(0), z.number().int().min(0)]);
/** Ticks. The engine counts 1,000 sub-ticks per tick, so a timing has at most 3 decimals. */
export const Ticks = z.number().min(0);

/** A stat key: a registry id, or a family member such as immune:status:stun. */
export const StatKey = z
  .string()
  .regex(/^[a-z][a-z0-9_]*(:[a-z0-9_]+)*$/, { message: "stat keys are lower_snake_case, with ':' between a family's parts" });
/** A tag that boosts, damage-taken modifiers, lockouts, riders and event filters match: see TAGS. */
export const Tag = StatKey;

export function keys<T extends Record<string, string>>(o: T) {
  return Object.keys(o) as [keyof T & string, ...(keyof T & string)[]];
}

// ─────────────────────────────────────────────────────────────────────────────
// Closed sets. Each needs engine code, so adding one is a schema version bump
// plus an engine change. The descriptions are the contract and feed PRIMITIVES.md.
// ─────────────────────────────────────────────────────────────────────────────

export const SUBTICKS = 1000;

export const TYPES = {
  physical: "A hit: meets Evasion and Defense. Every hit is physical.",
  none: "Untyped: never dodged, never reduced by Defense. Not allowed in actions; the type of a status's own damage.",
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
  attack: ["amount", "Scales only what states it."],
  defense: ["amount", "Reduces each hit: to hit² ÷ (hit + ruleset.armorK × Defense) when armorK is set; else a flat ruleset.armorRatio × Defense, down to 0 (BLOCKED)."],
  aggro: ["amount", "Default targeting picks foes weighted by draw: a party unit's Aggro through ruleset.partyDraw (doubling), an enemy's through ruleset.draw's curve, or Aggro itself without either. Its floor must be above 0."],
  attack_speed: ["points", "Basic attack cooldown ÷ (1 + stat/100), down to its recovery. Haste, Slow and Chill act through it."],
  cooldown_reduction: ["points", "Ability cooldowns ÷ (1 + stat/100)."],
  cast_time_reduction: ["points", "Cast times ÷ (1 + stat/100)."],
  crit_chance: ["points", "Percent chance that an action's damage or heal crits."],
  crit_multiplier: ["points", "A crit multiplies by this percent (150 is ×1.5). Crit damage raises it."],
  evasion: ["points", "Percent chance to evade a hit, after Accuracy, under its cap."],
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
  stat: "A stat change, or a stat set to a value. Tag: the stat.",
  boost: "A damage or healing boost. Tag: the boost's tag.",
  taken: "A damage-taken modifier. Tag: its tag, if any.",
  absorb: "An absorb, such as a shield.",
  block: "A block: the next damage above a share of max HP is blocked, then the status ends (Aegis). Also an HP floor or a cover.",
  lockout: "A lockout. Tag: what it covers.",
  action_change: "A rider or an amount added to the holder's hits, Seek, an extra strike, an aim, ability changes, crits by condition, echo, riders borrowed from another unit, a basic attack that never waits, a random order, or a rule for its revives.",
  pulse: "A repeating effect.",
  reaction: "A reaction, or an Intensity event trigger.",
} as const;
export const Kind = z.enum(keys(KINDS));

export const TAGS = {
  basic: "Hits from basic attacks; for lockouts and Seek, basic attacks.",
  ability: "Hits from abilities; for lockouts and Seek, abilities.",
  extra: "Hits from extra strikes (Double strike's second strike, and the strikes it chains): hits, but not basic attacks.",
  bonus: "Hits a card names beyond those (Arc's second hit, a leap, a ring, a volley's arrow, a jump, a strike out of turn, a second landing, a left-over): hits, but not basic attacks, an ability's hits or extra strikes.",
  wide: "Hit events only: a bonus hit a basic attack lands on a unit other than its target (Arc's second hit, a leap, a volley's arrow).",
  bare: "Hit events only: a hit that carries nothing (a second landing, a left-over): no status rides on it, and nothing lands it again.",
  crit: "Hit events only: the hit crit.",
  pulse: "healed and overhealed only: a status's pulse or trigger healed (a Regen's), not an ability or a reaction.",
  physical: "Every hit (and actions with one): not a status's own damage.",
  area: "Hits from a damage effect aimed at two or more units at once (an Area spell, a basic attack aimed at every foe). A hit without it is a single-target hit.",
  "<status>":"A status's id: reaches that status's pulses (\"+20% Burn damage\").",
  "<status tag>": "A tag a status carries, which reaches its pulses.",
  healing: "Boosts only: heals.",
  all: "Lockouts and Seek only: every action.",
} as const;

export const EVENTS = {
  fight_start: "The fight begins. Whose: every unit. A `restart` effect makes the reactions of a unit's gear and seat to it happen again, as a repeat.",
  action_start: "An action starts. Whose: the acting unit. Has `kind`.",
  action_resolve: "An action resolves. Whose: the acting unit; other: its first target. Has `kind`, `amount` (the MP it paid) and `count` (the units on the other side its hits landed on). A recast's is a repeat.",
  action_interrupted: "An action in cast time is canceled by an interrupting lockout. Whose: the casting unit. Has `kind`.",
  hit_lands: "A hit lands (not evaded), riders included. Whose: the attacker; other: the target. Has `kind`, `tags` and `amount`, and for a scale's `event`: `raw` (its amount before Defense) and `stopped` (what the target's Shield soaked and its Aegis blocked of it).",
  hit_taken: "A hit lands on this unit. Whose: the target; other: the attacker. Has `kind`, `tags` and `amount`, and `raw` and `stopped` as hit_lands.",
  hit_evaded: "This unit evades a hit. Whose: the target; other: the attacker. Has `kind`, `tags`, and for a strike `of: hit` its raw amount (after boosts, before Defense).",
  hit_missed: "A hit is evaded. Whose: the attacker; other: the target. Has `kind`, `tags`, and for a strike `of: hit` its raw amount.",
  damage_dealt: "Damage is dealt, including what an absorb soaks. Whose: the dealer, when known; other: the receiver. Has `amount`, and `status` when a status's pulse or reaction dealt it.",
  damage_taken: "Damage is taken, including what an absorb soaks. Whose: the receiver; other: the dealer, when known. Has `amount`, and `status` when a status's pulse or reaction dealt it.",
  hp_lost: "HP is lost to damage. Whose: the unit. Has `amount`. HP paid as a price (the pay effect) isn't lost this way: it fires hp_paid.",
  hp_paid: "HP is paid as a price: the pay effect (unless it's a drain), or an ability's HP price. Whose: the payer. Has `amount`.",
  hp_low: "Its HP goes under a line, the percent of max HP the filter's `line` names, whatever took it there (damage, a price, a drain, a cap on its healing); or it starts a fight, or stands up, under it. It fires again only once the unit has been back at the line or over. Whose: the unit.",
  hp_high: "Its HP comes back to a line or over (the filter's `line`); or it starts a fight, or stands up, there. Whose: the unit.",
  mp_gained: "An effect restores MP. Whose: the receiver; other: the unit whose effect gave it (itself, for its own regen or Clarity). Has `amount` (the MP restored).",
  mp_over: "MP gained past the full pool. Whose: the unit; other: the giver. Has `amount`: the part past full. MP given in answer to it never fires it again.",
  healed: "Healing is received. Whose: the healed unit; other: the healer, when known. Has `amount` (HP restored), `kind` when an action healed (\"a heal given\" is this event with `other: holder`), `status` when a status's pulse or reaction healed, and the tag `pulse` for a pulse.",
  overhealed: "Healing that would go past max HP, or past a cap on the unit's healing. Whose: the healed unit; other: the healer, when known. Has `amount` (the part past full), and `kind`, `status` and `pulse` as healed. Healing given in answer to it, and a heal marked final, never fire it.",
  status_gained: "A status is applied (each application, refreshes and added stacks included). Whose: the holder; other: the applier. Has `status`, `amount` (the stacks it added, Intensity only), and the tag `area` when its effect was aimed at two or more units. An application marked as a copy is a repeat.",
  status_triggered: "A status pulses, or an Intensity status's trigger fires. Whose: the holder. Has `status`.",
  status_ended: "A status ends. Whose: the holder. Has `status` and `cause`. `amount` is the stacks it held as it ended (an Intensity total), but the most an absorb held when damage emptied it (cause stacks), and the damage a block stopped (cause spent); other is the unit whose damage emptied or spent it, or whose effect removed it.",
  status_capped: "An Intensity status stands at its cap after an application (where Chill shatters). Whose: the holder; other: the applier. Has `status`, and `amount`: the stacks it holds.",
  ko: "A unit is KO'd. Whose: that unit; other: the unit whose damage knocked it out, when known. When a hit did it (a killing blow), it has that hit's `kind` and `tags`, the action behind it, and `amount`: what the blow had left over past the HP its target had. The unit's own statuses that survive a KO can still react to it.",
  revived: "A unit is revived. Whose: that unit; other: the reviver.",
  fight_won: "The fight is won, the moment the last foe falls, before statuses end. Whose: every party unit, fallen ones included. Its reactions resolve at once, in slot order, and a fallen unit's statuses that survive a KO act for it.",
} as const;
export const EventName = z.enum(keys(EVENTS));

export const WHOSE = {
  holder: "The event is the holder's own. The default.",
  ally: "The event is another unit's on the holder's side.",
  team: "The event is a unit's on the holder's side, the holder's own included.",
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
  self: "Actions: the acting unit. The default for stats in actions, and for a count of a side's units.",
  target: "Actions: the unit the effect lands on. Boosts: the unit being hit. The default for hp, stacks, conditions and counts of buffs or debuffs in actions.",
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
  owner: "Reactions: the unit the event is about, whoever holds the reacting status (the holder of a status that just capped, the unit knocked out).",
  assailant: "Reactions: the unit that last hit the unit the event is about, this fight, if it still stands (\"the foe that last hit the healed ally\").",
} as const;

export const SIDES = {
  foes: "Living units on the other side.",
  allies: "Living units on the unit's side, itself included.",
  others: "Living units on the unit's side, itself excluded.",
  self: "The unit itself.",
} as const;
export const Side = z.enum(keys(SIDES));

export const PICKS = {
  aggro: "`count` units at random, weighted by draw (a party unit's Aggro through ruleset.partyDraw, an enemy's through ruleset.draw). The default for foes.",
  random: "`count` units at random. The default otherwise.",
  lowest: "`count` units with the lowest `by`; ties at random.",
  highest: "`count` units with the highest `by`; ties at random.",
  all: "Every unit that passes `where`. Area: the Taunt and Hidden rules don't apply.",
} as const;
export const Pick = z.enum(keys(PICKS));

/** A status's label. A marker is bookkeeping: no remove by buff or debuff lifts it, and no count of buffs or debuffs sees it. */
export const LABELS = {
  buff: "Helps its holder. Removed by effects that remove buffs (Dispel); counted by `buffs`.",
  debuff: "Hurts its holder. Removed by effects that remove debuffs (Cleanse); counted by `debuffs`. Its pulses resolve in the batch of the holder's foes.",
  marker: "Neither. Bookkeeping such as \"once a fight\" or \"already hit by it\": only a remove that names it lifts it, no immunity to debuffs stops it, and nothing counts it as a buff or debuff. Its pulses resolve in its holder's own batch.",
} as const;
export const Label = z.enum(keys(LABELS));

/** The closed sets of the `cooldown` effect. */
export const COOLDOWN_WHICH = {
  basic: "The basic attack's timer.",
  abilities: "Each of its equipped abilities.",
  longest: "Its ability with the most cooldown left (ties: slot order). Nothing when every one is ready.",
  soonest: "Its ability with the least cooldown left that isn't ready yet (its \"next ability\").",
  event: "Reactions to an action event only: the ability that set the reaction off.",
  first: "Its first-slotted ability: the one the player put first.",
  slowest: "Its ability with the longest whole cooldown, cooling or not (ties: slot order).",
  "{ ability }": "These abilities by id, each with its trained forms (<id>__p and the rest), if the unit has them equipped.",
} as const;
export const COOLDOWN_SET = {
  ready: "Ready now: no cooldown left. It still needs its MP and its conditions.",
  full: "Its full cooldown left, as if it had just been used.",
  "{ less }": "This many ticks closer, down to ready.",
  "{ times }": "Its cooldown left × times %: 50 halves what's left.",
  "{ atMost }": "Its cooldown left at most atMost % of its full cooldown (\"at least half charged\": 50).",
  "{ lessPct }": "This percent of its full cooldown closer, down to ready (a number, so it can count: \"a tenth sooner for each foe it hit\").",
} as const;

/** The five forms an upgrade has, each content under a fixed id: `<id>__<form>`. */
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

/** What a scale's `count` counts. */
export const COUNTS = {
  buffs: "The buffs the unit read holds.",
  debuffs: "The debuffs the unit read holds.",
  targets: "Actions only: the action's targets, as chosen when it resolved.",
  hit: "The units on the other side an action's hits have landed on so far, each once (an effect after the hits reads them all); in a reaction to action_resolve, that action's.",
  "{ side, where }": "The units on that side of the unit read that pass `where` (and its seat, if given); with `stacks`, the total of that status's stacks across them instead of their number.",
} as const;
