/**
 * Every content file's items gathered, for the pack (pack.ts) and the tools (the test, aiming drops).
 */
import type { AbilityT, GearT, StatusT, UpgradeT } from "../../../src/schema.js";
import type { Builds } from "./kit.js";
import { sharedStatuses } from "./shared.js";
import * as scaling from "./weapons-scaling.js";
import * as base from "./weapons-base.js";
import * as armor from "./armor-amulets.js";
import * as offhands from "./offhands.js";
import * as ups from "../upgrades/index.js";
import { builds as formationBuilds } from "../formations.js";

const shares = [scaling, base, armor, offhands];
/** The 272 pieces: 96 weapons, 48 armor, 104 offhands, 24 amulets. */
export const pieceGear: GearT[] = shares.flatMap((s) => s.gear);
/** The 16 mythics. */
export const mythicGear: GearT[] = ups.mythics;
/** Every status the shares add: the shared ones, the pieces', the upgrades' forms and the mythics'. */
export const pieceStatuses: StatusT[] = [...sharedStatuses, ...shares.flatMap((s) => s.statuses), ...ups.statuses];
/** The upgrades and their ability forms. */
export const upgrades: UpgradeT[] = ups.upgrades;
export const upgradeAbilities: AbilityT[] = ups.abilities;
/** Designer data, never in the pack: which builds and rungs each item serves (pieces, mythics, formations, upgrade forms). */
export const PIECE_BUILDS: Builds = Object.assign({}, ...shares.map((s) => s.builds), ups.builds, formationBuilds);
