/** The content pack, a party loadout (player state, not content), and the inferred types for the engine and tooling. */
import * as z from "zod";
import { Id, Note, SCHEMA_VERSION } from "./primitives.js";
import { Design, Ruleset, StatDef } from "./ruleset.js";
import { Ability, GearKind, WeaponKind } from "./actions.js";
import { Status } from "./statuses.js";
import { type Challenge, ClassDef, Dungeon, Enemy, Formation, Gear, type LootTable, Perk, PerkFamily } from "./content.js";
import { Rogue, Upgrade } from "./rogue.js";

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
  upgrades: z.array(Upgrade).optional().describe("One for each ability and passive that can be trained. Absent: none."),
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
  rogue: Rogue.optional(),
});
export type ContentPack = z.infer<typeof ContentPack>;

// ─────────────────────────────────────────────────────────────────────────────
// Engine input: a party loadout (player state, not content)
// ─────────────────────────────────────────────────────────────────────────────

export const PartyUnit = z.strictObject({
  class: Id,
  position: Id,
  abilities: z.array(Id).describe("Equipped abilities, in slot order: a class ability, or the trained form of one (<id>__p, __a, __b, __ap or __bp)."),
  passive: Id.optional().describe("The trained form of its class passive (<passive>__p, __a, __b, __ap or __bp): a status that takes the passive status's place at fight start and on a revive. Absent: the class's own."),
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
