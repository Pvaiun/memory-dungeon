/**
 * Every content file's items gathered, for the pack (pack.ts) and the tools.
 */
import type { AbilityT, GearT, StatusT, UpgradeT } from "../../../src/schema.js";
import type { Builds, Served, Tags } from "./kit.js";
import { sharedStatuses } from "./shared.js";
import * as weapons1 from "./weapons-1.js";
import * as weapons2 from "./weapons-2.js";
import * as armor from "./armor.js";
import * as amulets from "./amulets.js";
import * as offhands1 from "./offhands-1.js";
import * as offhands2 from "./offhands-2.js";
import * as ups from "../upgrades/index.js";
import * as forms from "../formations.js";

/** The six shares of pieces, by name. */
export const SHARES = { "weapons-1": weapons1, "weapons-2": weapons2, armor, amulets, "offhands-1": offhands1, "offhands-2": offhands2 } as const;
const shares = Object.values(SHARES);
/** The 324 pieces: 113 weapons, 55 armor, 119 offhands, 37 amulets. */
export const pieceGear: GearT[] = shares.flatMap((s) => s.gear);
/** The 16 mythics. */
export const mythicGear: GearT[] = ups.mythics;
/** Every status the shares add: the shared ones, the pieces', the upgrades' forms and the mythics'. */
export const pieceStatuses: StatusT[] = [...sharedStatuses, ...shares.flatMap((s) => s.statuses), ...ups.statuses];
/** The upgrades and their ability forms. */
export const upgrades: UpgradeT[] = ups.upgrades;
export const upgradeAbilities: AbilityT[] = ups.abilities;
/** A file's tags: its `served`, or (a file not yet rewritten) its builds alone. */
const servedOf = (m: { served?: Served; builds?: Builds }): Served =>
  m.served ?? Object.fromEntries(Object.entries(m.builds ?? {}).map(([id, builds]): [string, Tags] => [id, { builds, engines: [], threads: [], other: [] }]));
/** Designer data, never in the pack: what each item serves (pieces, mythics, formations, upgrade forms): builds and rungs, engines, threads. */
export const SERVED: Served = Object.assign({}, ...shares.map((s) => s.served), servedOf(ups), servedOf(forms));
/** The builds and rungs alone. */
export const PIECE_BUILDS: Builds = Object.fromEntries(Object.entries(SERVED).map(([id, t]) => [id, t.builds]));
