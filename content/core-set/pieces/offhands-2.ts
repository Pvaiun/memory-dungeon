/**
 * Seven offhand kinds' pieces: tome, orb, idol, vial, trophy, bell and cloak.
 *
 * `gear` joins the pack's gear and the rogue's stock; `statuses` the pack's statuses; `served` is designer data, never in the pack.
 */
import { shelf } from "./kit.js";

const S = shelf();

export const gear = S.gear;
export const statuses = S.statuses;
export const served = S.served;
