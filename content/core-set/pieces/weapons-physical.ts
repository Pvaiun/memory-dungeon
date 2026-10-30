/**
 * Step 5i, step 5: the six physical weapon kinds' 48 pieces, from steps/05-core-set/5i-synergy/fill/weapons-physical.md with fill-rulings.md (its third round wins).
 * A skeleton: the physical weapons share fills it. `gear` joins the pack's gear and the rogue's stock; `statuses` the pack's statuses;
 * `builds` is designer data, never in the pack.
 */
import type { GearT, StatusT } from "../../../src/schema.js";
import type { Builds } from "./kit.js";

export const gear: GearT[] = [];
export const statuses: StatusT[] = [];
export const builds: Builds = {};
