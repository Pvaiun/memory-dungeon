/**
 * The formations' words and helpers: a seat's stat steps, the formation builder, and the lists each rarity's file adds to
 * (formations.ts gathers them). Statuses are universal: nothing here applies one for less or more than its own length.
 */
import type { FixedStatT, FormationT, StatusT } from "../../../src/schema.js";
import { idOf, pieceStatus, serves, type Served } from "../pieces/kit.js";
import { AGGRO_STEP, SPECIAL, crit, stepFor } from "../scale.js";

// ─── The words, as numbers ───────────────────────────────────────────────────

/** A seat's stat step: one and a quarter gear steps. */
export const FORMATION_STEP = 1.25;
type Change = { stat: string; flat: number };
/**
 * n seat steps of a stat (a negative n gives it up): Attack and Defense 1,250, HP 625, Aggro 13, MP regen 3,750 a step.
 * Halves round away from zero, so "draws less" is −13 (Math.round alone gives −12).
 */
export const st = (stat: string, n: number): Change => {
  const v = n * FORMATION_STEP * stepFor(stat);
  return { stat, flat: Math.sign(v) * Math.round(Math.abs(v)) };
};
/** Crit chance in seat steps: "crits more" +3.5. */
export const critSt = (n: number): Change => ({ stat: "crit_chance", flat: crit(n * FORMATION_STEP) });
/** "Crits far more often": the table's top word. */
export const CRITS_FAR_MORE: Change = { stat: "crit_chance", flat: crit(5) };
/** Special stats sit at their words, unscaled. */
export const EVASION: Change = { stat: "evasion", flat: SPECIAL.evasion.medium };
export const THORNS: Change = { stat: "thorns", flat: SPECIAL.thorns.medium };
export const LIFESTEAL: Change = { stat: "lifesteal", flat: SPECIAL.lifesteal.medium };
export const LIFESTEAL_HIGH: Change = { stat: "lifesteal", flat: SPECIAL.lifesteal.high };
/** "Basic attacks a fifth faster" and "a third faster": a seat may carry Attack speed, which gear doesn't. */
export const FIFTH_FASTER: Change = { stat: "attack_speed", flat: 20 };
export const THIRD_FASTER: Change = { stat: "attack_speed", flat: 33 };
/** "Abilities come round a fifth faster" and "a third faster". */
export const FIFTH_SOONER: Change = { stat: "cooldown_reduction", flat: 20 };
export const THIRD_SOONER: Change = { stat: "cooldown_reduction", flat: 33 };
/** "Heals on it are stronger". */
export const STRONGER_HEALS: Change = { stat: "healing_received", flat: 20 };
void AGGRO_STEP;

// ─── Writing helpers ─────────────────────────────────────────────────────────

/** A seat's or a formation's own status: on the unit sheet, unremovable, as a piece's status is. */
export const held = pieceStatus;

export type Seat = { name: string; text?: string; stats?: Change[]; statuses?: string[] };
const lines = ["front", "middle", "back"] as const;
/**
 * A formation from its seats, in slot order. A seat's position id is its name's id; seats that share a name take _a, _b and _c in
 * order (the parties tool names seats by name, so it places members by slot order).
 */
export function formation(name: string, rarity: NonNullable<FormationT["rarity"]>, text: string, seats: Seat[], party: { text?: string; stats?: FixedStatT[]; statuses?: string[] } = {}): FormationT {
  const names = seats.map((s) => idOf(s.name));
  const positions = seats.map((s, i) => {
    const twin = names.filter((n) => n === names[i]).length > 1;
    const id = twin ? `${names[i]}_${"abc"[names.slice(0, i).filter((n) => n === names[i]).length]}` : names[i];
    return {
      id, name: s.name, ...(s.text ? { text: s.text } : {}), layout: { line: lines[i], column: i },
      ...(s.stats?.length ? { stats: s.stats } : {}), ...(s.statuses?.length ? { statuses: s.statuses } : {}),
    };
  });
  return {
    id: idOf(name), name, text: party.text ? `${text} The party: ${party.text}` : text, rarity, source: "unlock", positions,
    ...(party.stats?.length ? { stats: party.stats } : {}), ...(party.statuses?.length ? { statuses: party.statuses } : {}),
  };
}
export const twice = (s: Seat): Seat[] => [s, s];
export const thrice = (s: Seat): Seat[] => [s, s, s];
export const NOTHING = "Nothing.";

export const formations_: FormationT[] = [];
export const effects_: StatusT[] = [];
export const served_: Served = {};
/** One formation, the statuses behind its seats and party, and its Serves line. */
export function add(f: FormationT, statuses: StatusT[], line: string) {
  if (formations_.some((x) => x.id === f.id)) throw new Error(`two formations named '${f.name}'`);
  formations_.push(f);
  effects_.push(...statuses);
  served_[f.id] = serves(line);
}

// ─── Neutral: the starter ────────────────────────────────────────────────────

export const neutral: FormationT = {
  id: "neutral", name: "Neutral", text: "3 empty seats.", rarity: "common", source: "starter",
  positions: [
    { id: "a", name: "Left", layout: { line: "front", column: 0 } },
    { id: "b", name: "Centre", layout: { line: "middle", column: 1 } },
    { id: "c", name: "Right", layout: { line: "back", column: 2 } },
  ],
};
