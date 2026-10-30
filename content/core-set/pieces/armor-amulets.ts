/**
 * Step 5i, step 5: the four armor types' 48 pieces and the 24 amulets, from steps/05-core-set/5i-synergy/fill/armor-amulets.md with fill-rulings.md (its third round wins).
 * A skeleton: the armor and amulets share fills it. `gear` joins the pack's gear and the rogue's stock; `statuses` the pack's statuses;
 * `builds` is designer data, never in the pack.
 */
import type { GearT, StatusT } from "../../../src/schema.js";
import type { Builds } from "./kit.js";

export const gear: GearT[] = [];
export const statuses: StatusT[] = [];
export const builds: Builds = {};
