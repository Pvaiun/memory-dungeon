/**
 * Validator for content packs and party loadouts.
 *
 * Three layers of checks:
 *   1. Shape: the zod schema (types, required fields, closed sets).
 *   2. Meaning: every reference resolves, and content follows the combat
 *      rules for what's valid (docs/core-set/rules-and-vocabulary.md):
 *      an action's damage is
 *      physical, percent changes only on amount stats, a weapon
 *      belongs to a kind, a piece fits its kind's classes, and so on.
 *   3. Design rules from the core set, driven by the pack's `design` block.
 *
 * Every issue carries a stable `code`, so tests and later tooling can rely on it.
 *
 * This file is the validator's public face; the checks are in validate/, one file a part:
 *   core.ts      validatePack (which runs every check), the report, the index of ids, references, the design block
 *   combat.ts    the combat rule language: numbers, conditions, targeting, effects, statuses, actions
 *   content.ts   classes, upgrades, gear, formations, enemies and perks
 *   dungeons.ts  dungeons, loot and challenges, the starter and progression, the rogue block, totals, unused entries
 *   party.ts     party loadouts and challenge constraints, and who can wear what and what a class arrives with (canEquip, handsOf, startingWeapon)
 */
export { type Issue, type Pack, Index, type ValidateOptions, type ValidateResult, validatePack } from "./validate/core.js";
export { type Owned, canEquip, handsOf, startingKind, startingWeapon, checkParty, unmetConstraints, type Teaser, teaser } from "./validate/party.js";
