/**
 * The core set's formations: Neutral, three slots that do nothing, every party's start.
 *
 * Step 5i (the build's retire share): the nine others of docs/core-set/gear-and-formation-lists.md (Vanguard, Champion,
 * Ambush, Tortoise, Scatter, Blitz, Caravan, Last stand, Escort) and the four statuses behind their effects are gone. The
 * formations of steps/05-core-set/5i-synergy/fill/ take their place.
 */
import type { FormationT, StatusT } from "../../src/schema.js";
import type { Builds } from "./pieces/kit.js";

type Change = { stat: string; flat: number };
const lines = ["front", "middle", "back"] as const;

const slot = (id: string, name: string, text: string | undefined, i: number, stats: Change[]) => ({
  id, name, ...(text ? { text } : {}), layout: { line: lines[i], column: i }, ...(stats.length ? { stats } : {}),
});
const formation = (id: string, name: string, text: string, slots: ReturnType<typeof slot>[], effect?: string, source: FormationT["source"] = "unlock"): FormationT => ({
  id, name, text, source, positions: slots, ...(effect ? { statuses: [effect] } : {}),
});

/** The statuses behind formations' effects: every unit in the formation holds one. None now. */
export const effects: StatusT[] = [];

export const formations: FormationT[] = [
  formation("neutral", "Neutral", "Three slots that do nothing.", [slot("a", "Left", undefined, 0, []), slot("b", "Centre", undefined, 1, []), slot("c", "Right", undefined, 2, [])], undefined, "starter"),
];

/** Designer data, never in the pack: which builds and rungs each formation serves. */
export const builds: Builds = {};
