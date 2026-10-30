/**
 * Step 5i, step 5: every content share's items gathered, for the pack (pack.ts) and the tools (the test, aiming drops).
 */
import type { AbilityT, GearT, StatusT, UpgradeT } from "../../../src/schema.js";
import type { Builds } from "./kit.js";
import { sharedStatuses } from "./shared.js";
import * as physical from "./weapons-physical.js";
import * as magical from "./weapons-magical.js";
import * as armor from "./armor-amulets.js";
import * as offhands from "./offhands.js";
import * as part1 from "../upgrades/part1.js";
import * as part2 from "../upgrades/part2.js";
import { builds as formationBuilds } from "../formations.js";

const shares = [physical, magical, armor, offhands];
/** The 240 pieces. */
export const pieceGear: GearT[] = shares.flatMap((s) => s.gear);
/** The 16 mythics. */
export const mythicGear: GearT[] = [...part1.mythics, ...part2.mythics];
/** Every status the shares add: the shared ones, the pieces', the upgrades' forms and the mythics'. */
export const pieceStatuses: StatusT[] = [...sharedStatuses, ...shares.flatMap((s) => s.statuses), ...part1.statuses, ...part2.statuses];
/** The upgrades and their ability forms. */
export const upgrades: UpgradeT[] = [...part1.upgrades, ...part2.upgrades];
export const upgradeAbilities: AbilityT[] = [...part1.abilities, ...part2.abilities];
/** Designer data, never in the pack: which builds and rungs each item serves (pieces, mythics, formations, upgrade forms). */
export const PIECE_BUILDS: Builds = Object.assign({}, ...shares.map((s) => s.builds), part1.builds, part2.builds, formationBuilds);
