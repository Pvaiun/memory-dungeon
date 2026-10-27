/**
 * The 10 formations (docs/core-set/gear-and-formation-lists.md): the neutral
 * one and nine with a story each. Slots change stats; effects are statuses
 * every unit holds, reacting to the fight starting or an ally falling.
 */
import type { FormationT, StatusT } from "../../src/schema.js";
import { FLAT_STACKS, SPECIAL, stepFor, crit } from "./scale.js";

type Change = { stat: string; flat: number };
/**
 * Step 5e: a formation slot's step is one and a half gear steps (was one). Probed on the same parties, the five formations with no
 * effect sat within 3 points of Neutral while the effects were worth 7 to 14: the gear document's own fix, "a bigger step on every slot".
 */
export const FORMATION_STEP = 1.25; // Step 5f round 4: 1.25 (5e's 1.5): with longer fights the slot formations ran +10 against Neutral, Last stand −10.
const st = (stat: string, n: number): Change => ({ stat, flat: Math.round(n * FORMATION_STEP * stepFor(stat)) });
const critStep = (n: number): Change => ({ stat: "crit_chance", flat: crit(n * FORMATION_STEP) });
const lines = ["front", "middle", "back"] as const;

const slot = (id: string, name: string, text: string | undefined, i: number, stats: Change[]) => ({
  id, name, ...(text ? { text } : {}), layout: { line: lines[i], column: i }, ...(stats.length ? { stats } : {}),
});
const formation = (id: string, name: string, text: string, slots: ReturnType<typeof slot>[], effect?: string, source: FormationT["source"] = "unlock"): FormationT => ({
  id, name, text, source, positions: slots, ...(effect ? { statuses: [effect] } : {}),
});

/** The effects: every unit in the formation holds one of these. */
export const effects: StatusT[] = [
  { id: "blitz_charge", name: "Blitz", text: "Haste when the fight starts.", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, reactions: [{ on: { event: "fight_start" }, do: [{ op: "apply", status: "haste", to: "holder" }] }] },
  // Step 5e: a short Regen, 10 ticks (the status's own is 16). The same parties won 12 to 20 points more in Caravan than in Neutral: a full Regen on every ally at every fight's start was two Clerics for nothing.
  { id: "caravan_pace", name: "Caravan", text: "A short Regen when the fight starts.", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, reactions: [{ on: { event: "fight_start" }, do: [{ op: "apply", status: "regen", duration: 8, to: "holder" }] }] }, // round 6: 8 ticks (Caravan still +9.5 at 10).
  { id: "last_stand_spur", name: "Last stand", text: "Several Might when an ally falls.", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, reactions: [{ on: { event: "ko", whose: "ally" }, do: [{ op: "apply", status: "might", stacks: FLAT_STACKS.several, to: "holder" }] }] },
  { id: "escort_insurance", name: "Escort", text: "A Shield when an ally falls, scaling from max HP.", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, reactions: [{ on: { event: "ko", whose: "ally" }, do: [{ op: "apply", status: "shield", stacks: { scale: [{ ratio: 0.12, stat: "max_hp", of: "holder" }] }, to: "holder" }] }] }, // Step 5e: 0.12 of max HP (was 0.25, then 0.15): the same parties won 9 to 13 points more in Escort than in Neutral.
];

export const formations: FormationT[] = [
  formation("neutral", "Neutral", "Three slots that do nothing.", [slot("a", "Left", undefined, 0, []), slot("b", "Centre", undefined, 1, []), slot("c", "Right", undefined, 2, [])], undefined, "starter"),
  formation("vanguard", "Vanguard", "A wall with two behind it.", [
    slot("wall", "Wall", "Draws more. Armor up.", 0, [st("aggro", 2), st("armor", 1)]),
    slot("behind_a", "Behind", "Draws less.", 1, [st("aggro", -1)]),
    slot("behind_b", "Behind", "Draws less.", 2, [st("aggro", -1)]),
  ]),
  formation("champion", "Champion", "All in on one hero.", [
    slot("champion", "Champion", "Sturdier and far stronger.", 0, [st("max_hp", 2), st("armor", 2), st("attack", 2), st("magic", 2)]),
    slot("retainer_a", "Retainer", "Hits much softer.", 1, [st("attack", -2), st("magic", -2)]),
    slot("retainer_b", "Retainer", "Hits much softer.", 2, [st("attack", -2), st("magic", -2)]),
  ]),
  formation("ambush", "Ambush", "One draws the eye, two strike.", [
    slot("bait", "Bait", "Draws more.", 0, [st("aggro", 2)]),
    slot("knife", "Knife", "Crits far more, but frailer.", 1, [critStep(2), st("max_hp", -1)]),
    slot("blade", "Blade", "Crits more.", 2, [critStep(1)]),
  ]),
  formation("tortoise", "Tortoise", "Nobody falls, but fights run long.", [
    slot("shell", "Shell", "Armor far up.", 0, [st("armor", 2)]),
    slot("heart", "Heart", "Much sturdier.", 1, [st("max_hp", 2)]),
    slot("tucked_in", "Tucked in", "Hits much softer.", 2, [st("attack", -2), st("magic", -2)]),
  ]),
  formation("scatter", "Scatter", "Dodge, don't block.", [
    // Campaign pass: Armor −1, not −2. At −2 the Decoy lost more to Armor than it gained in Evasion, and Scatter lost on every node.
    slot("decoy", "Decoy", "Dodges, draws more, thinner armor.", 0, [{ stat: "evasion", flat: SPECIAL.evasion.medium }, st("aggro", 2), st("armor", -1)]),
    slot("runner_a", "Runner", "Draws less.", 1, [st("aggro", -1)]),
    slot("runner_b", "Runner", "Draws less.", 2, [st("aggro", -1)]),
  ]),
  formation("blitz", "Blitz", "Win before they hit back. Everyone starts Hasted.", [
    slot("charge_a", "Charge", "Hits harder, frailer.", 0, [st("attack", 1), st("magic", 1), st("max_hp", -1)]),
    slot("charge_b", "Charge", "Hits harder, frailer.", 1, [st("attack", 1), st("magic", 1), st("max_hp", -1)]),
    slot("charge_c", "Charge", "Hits harder, frailer.", 2, [st("attack", 1), st("magic", 1), st("max_hp", -1)]),
  ], "blitz_charge"),
  formation("caravan", "Caravan", "Pace yourselves for the whole dungeon. Everyone starts each fight with Regen.", [
    slot("quartermaster", "Quartermaster", "MP flows, but hits much softer.", 0, [st("mp_regen", 2), st("attack", -2), st("magic", -2)]),
    slot("traveller_a", "Traveller", "Sturdier.", 1, [st("max_hp", 1)]),
    slot("traveller_b", "Traveller", "Sturdier.", 2, [st("max_hp", 1)]),
  ], "caravan_pace"),
  formation("last_stand", "Last stand", "The fallen spur the rest on: Might for everyone when an ally falls.", [
    slot("martyr", "Martyr", "Draws more, frailer.", 0, [st("aggro", 2), st("max_hp", -1)]), // Step 5f: −1 (was −2: with Glass heart it took an HP-2 class to nothing).
    slot("other_a", "Other", undefined, 1, []),
    slot("other_b", "Other", undefined, 2, []),
  ], "last_stand_spur"),
  formation("escort", "Escort", "Two protectors, one carry. A Shield for the others when an ally falls.", [
    // Campaign pass: no HP on the Escort slots. With it, Escort was the best formation on every node (nothing taken away, plus an effect).
    // Step 5e: no Armor on the Escort slots either (5a took their HP): with every slot a plain bonus and an effect on top, the same parties won 11 to 13 points more in Escort than in Neutral.
    slot("escort_a", "Escort", "Draws more.", 0, [st("aggro", 1)]),
    slot("escort_b", "Escort", "Draws more.", 1, [st("aggro", 1)]),
    slot("charge", "Charge", "Draws far less, hits harder, crits more.", 2, [st("aggro", -2), st("attack", 1), st("magic", 1), critStep(1)]),
  ], "escort_insurance"),
];
