/**
 * The 10 formations (docs/core-set/gear-and-formation-lists.md): the neutral
 * one and nine with a story each. Slots change stats; effects are statuses
 * every unit holds, reacting to the fight starting or an ally falling.
 */
import type { FormationT, StatusT } from "../../src/schema.js";
import { FLAT_STACKS, SPECIAL, STEP, crit } from "./scale.js";

type Change = { stat: string; flat: number };
const st = (stat: string, n: number): Change => ({ stat, flat: n * STEP });
const critStep = (n: number): Change => ({ stat: "crit_chance", flat: crit(n) });
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
  { id: "caravan_pace", name: "Caravan", text: "Regen when the fight starts.", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, reactions: [{ on: { event: "fight_start" }, do: [{ op: "apply", status: "regen", to: "holder" }] }] },
  { id: "last_stand_spur", name: "Last stand", text: "Several Might when an ally falls.", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, reactions: [{ on: { event: "ko", whose: "ally" }, do: [{ op: "apply", status: "might", stacks: FLAT_STACKS.several, to: "holder" }] }] },
  { id: "escort_insurance", name: "Escort", text: "A Shield when an ally falls, scaling from max HP.", label: "buff", show: "sheet", stacking: "refresh", unremovable: true, reactions: [{ on: { event: "ko", whose: "ally" }, do: [{ op: "apply", status: "shield", stacks: { scale: [{ ratio: 0.25, stat: "max_hp", of: "holder" }] }, to: "holder" }] }] },
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
    slot("decoy", "Decoy", "Dodges, draws more, thin armor.", 0, [{ stat: "evasion", flat: SPECIAL.evasion.medium }, st("aggro", 2), st("armor", -2)]),
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
    slot("martyr", "Martyr", "Draws more, much frailer.", 0, [st("aggro", 2), st("max_hp", -2)]),
    slot("other_a", "Other", undefined, 1, []),
    slot("other_b", "Other", undefined, 2, []),
  ], "last_stand_spur"),
  formation("escort", "Escort", "Two protectors, one carry. A Shield for the others when an ally falls.", [
    slot("escort_a", "Escort", "Draws more, sturdier, armored.", 0, [st("aggro", 1), st("armor", 1), st("max_hp", 1)]),
    slot("escort_b", "Escort", "Draws more, sturdier, armored.", 1, [st("aggro", 1), st("armor", 1), st("max_hp", 1)]),
    slot("charge", "Charge", "Draws far less, hits harder, crits more.", 2, [st("aggro", -2), st("attack", 1), st("magic", 1), critStep(1)]),
  ], "escort_insurance"),
];
