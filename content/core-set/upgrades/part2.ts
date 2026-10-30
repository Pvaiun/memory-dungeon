/**
 * Step 5i, step 5: the upgrades of the Hexer, Monk, Assassin, Vampire, Pyromancer, Frostweaver, Stormcaller and Geomancer (a power step and two versions for each ability and passive, as five forms
 * each) and their mythics, from steps/05-core-set/5i-synergy/fill/upgrades-2.md with fill-rulings.md (its third round wins).
 * A skeleton: the upgrades share fills it. `upgrades` joins the pack's upgrades, `abilities` (the ability forms) its
 * abilities, `statuses` (passive forms and helpers, and the mythics' statuses) its statuses, `mythics` its gear and the
 * rogue's stock; `builds` is designer data, never in the pack.
 */
import type { AbilityT, GearT, StatusT, UpgradeT } from "../../../src/schema.js";
import type { Builds } from "../pieces/kit.js";

export const upgrades: UpgradeT[] = [];
export const abilities: AbilityT[] = [];
export const statuses: StatusT[] = [];
export const mythics: GearT[] = [];
export const builds: Builds = {};
