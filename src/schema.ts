/**
 * Dungeon Game: content schema (the core set, docs/core-set/).
 *
 * One data format for everything the engine runs on. Fights run on ticks, and
 * everything that happens on an event or a timer is a status. Content is built from
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
 * The core set's vocabulary (statuses, special stats, effects and challenges)
 * lives in the documents, not the data. Perks stay in the tech, unused by the
 * core set.
 *
 * Two kinds of damage and nothing else: physical meets Armor and Evasion;
 * magical meets Magic resist and is never dodged; a status's own damage is
 * untyped. Gear is in four slots (weapon, armor, offhand, amulet), with armor
 * types and offhand kinds, two-handed weapons, and mythic pieces that fit one
 * class.
 *
 * This file is the schema's public face; the definitions are in schema/, one file a part, each building on the ones before:
 *   primitives.ts  ids, text, numbers, the sub-tick, and the closed sets (each needs engine code)
 *   numbers.ts     numbers and how they scale, conditions, unit tests and targeting rules
 *   effects.ts     the effects actions, pulses and reactions are made of
 *   statuses.ts    statuses: duration, stacking, pulses, triggers, reactions, stat changes, lockouts
 *   actions.ts     weapon kinds and actions (basic attacks and abilities)
 *   ruleset.ts     the design constraints the validator reads, the ruleset and the stat registry
 *   content.ts     classes, gear, formations, enemies, perks, dungeons and their stages and challenges
 *   rogue.ts       the rogue mode's data, and the upgrades
 *   pack.ts        the content pack, a party loadout, and the inferred types
 */
export { SCHEMA_VERSION, Id, Text, Note, StatKey, Tag, SUBTICKS, TYPES, DamageType, SLOTS, Slot, type SlotT, ENGINE_STATS, STAT_FAMILIES, KINDS, Kind, TAGS, EVENTS, EventName, WHOSE, Whose, CAUSES, Cause, type CauseT, SCALE_OF, Of, TO, SIDES, Side, PICKS, Pick, LABELS, Label, COOLDOWN_WHICH, COOLDOWN_SET, UPGRADE_FORMS, type UpgradeFormT, formId, formBase, COUNTS } from "./schema/primitives.js";
export { UnitCond, type UnitCondT, Scale, type ScaleT, Num, type NumT, Value, TargetRule, type TargetRuleT, Condition, type ConditionT, EventUnitTest, Test, type TestT, To, type ToT } from "./schema/numbers.js";
export { Instance, type InstanceT, HitApply, Effect, type EffectT, type DamageEffectT, type ApplyT } from "./schema/effects.js";
export { StatChange, FixedStat, type FixedStatT, EventSpec, type EventSpecT, Reaction, AbilityFilter, type AbilityFilterT, AbilityMod, type AbilityModT, CritRule, type CritRuleT, Status, type StatusT, type ReactionT } from "./schema/statuses.js";
export { WeaponKind, type WeaponKindT, GearKind, type GearKindT, Weapon, type WeaponT, Target, Ability, type AbilityT } from "./schema/actions.js";
export { Design, Rank, Control, type ControlT, PerkOffer, Ruleset, StatDef } from "./schema/ruleset.js";
export { StatBlock, ClassDef, Rarity, type RarityT, FormationRarity, type FormationRarityT, Gear, Layout, Position, Formation, Enemy, PerkFamily, Perk, FightStage, PickStage, CampfireStage, Stage, LootTable, Constraint, Challenge, Foes, type FoesT, Dungeon } from "./schema/content.js";
export { RogueNodeKind, type RogueNodeKindT, SupplyId, type SupplyIdT, RogueConfig, type RogueConfigT, RogueFight, type RogueFightT, RogueRegion, type RogueRegionT, type EventOpT, EventOp, RogueEvent, type RogueEventT, Rogue, type RogueT, UpgradeVersion, Upgrade, type UpgradeT } from "./schema/rogue.js";
export { ContentPack, PartyUnit, Party, type StatDefT, type ClassDefT, type GearT, type FormationT, type EnemyT, type PerkT, type DungeonT, type ChallengeT, type LootTableT, type PartyUnitT } from "./schema/pack.js";
