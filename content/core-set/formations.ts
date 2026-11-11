/**
 * The core set's formations: Neutral, the starter, and 35 more (13 common, 12 rare, 10 legendary), one file a rarity in
 * formations/, written with formations/kit.ts:
 *   formations/kit.ts        the words (a seat's steps), the formation builder and the lists
 *   formations/common.ts     the 13 common formations
 *   formations/rare.ts       the 12 rare formations
 *   formations/legendary.ts  the 10 legendary formations
 *
 * A seat is a position: its own stats, and the statuses it gives the unit sitting there. A formation's own stats and statuses
 * are its party effect, given to every unit in it; one marked `party` is a rule the side holds once (the first standing ally
 * answers). Stacks from a seat are flat. `served` is designer data, never in the pack.
 */
import type { FormationT, StatusT } from "../../src/schema.js";
import type { Served } from "./pieces/kit.js";
import { effects_, formations_, neutral, served_ } from "./formations/kit.js";
import "./formations/common.js";
import "./formations/rare.js";
import "./formations/legendary.js";

export { FORMATION_STEP } from "./formations/kit.js";

export const formations: FormationT[] = [neutral, ...formations_];

/** Every status behind a seat or a formation's effect. */
export const effects: StatusT[] = effects_;

/** Designer data, never in the pack: what each formation serves, from its Serves line. */
export const served: Served = served_;
