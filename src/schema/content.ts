/** The content: classes, gear, formations, enemies, perks, and dungeons with their stages, loot and challenges. */
import * as z from "zod";
import { Id, Note, PosInt, Slot, StatKey, Text } from "./primitives.js";
import { FixedStat } from "./statuses.js";
import { Weapon } from "./actions.js";
import { Rank } from "./ruleset.js";

// ─────────────────────────────────────────────────────────────────────────────
// Content
// ─────────────────────────────────────────────────────────────────────────────

const UnlockSource = z.enum(["starter", "unlock"]).describe("starter: owned from the start (the starting classes, the plain weapons). unlock: everything else, found or earned in play. Free play makes everything available.");

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
  weapons: z.array(Id).min(1).describe("The weapon kinds it can use, first kind first: it arrives with the plain weapon of its first one-handed kind."),
  armor: z.array(Id).min(1).describe("The armor types it can wear."),
  offhands: z.array(Id).min(1).describe("The offhand kinds it can hold."),
  passive: z.strictObject({ name: Text, text: Text, ...grants }).optional().describe("The class passive. Its stat grants are stats; its behaviour lives in the statuses it applies at fight start."),
  abilities: z.array(Id),
  note: Note.optional(),
}).describe("A class is a unit. The player owns at most one of each and can field it once per party.");

/** Every piece's own rarity. Mythic, above legendary, is for a piece that fits one class. */
export const Rarity = z.enum(["common", "uncommon", "rare", "legendary", "mythic"]);
export type RarityT = z.infer<typeof Rarity>;
/** A formation's rarity. Neutral is common; no formation is mythic. */
export const FormationRarity = z.enum(["common", "rare", "legendary"]);
export type FormationRarityT = z.infer<typeof FormationRarity>;

export const Gear = z.strictObject({
  id: Id,
  name: Text,
  text: Text,
  slot: Slot,
  rarity: Rarity.optional().describe("The piece's own rarity, fixed: no affixes at any rarity. mythic exactly when it names a `mythic` class."),
  tier: z.enum(["ordinary", "powerful"]).describe("ordinary: drops, sidegrades at a similar power. powerful: a different build, or a bigger bundle that gives something up."),
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
  rarity: FormationRarity.optional().describe("Its rarity (Neutral common)."),
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
  .describe("A change to every foe in a dungeon: how a fight's knob makes its foes tougher. The engine applies it at each fight start and to summons.");
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
