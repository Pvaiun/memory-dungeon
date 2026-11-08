/**
 * The core set's gear: the 11 plain weapons, one per weapon kind, each class's starter. The other pieces are in pieces/.
 */
import type { GearT, NumT } from "../../src/schema.js";
import { FOCUS, KIND_SPEED, PER_PERCENT, SWING_REF, WEAPON, isFocus, type Level } from "./scale.js";
import { weaponKinds } from "./vocabulary.js";

/** A weapon's hit: its kind's speed factor × (base + ratio × stat). */
export function weaponHit(kind: string, base: Level, ratio: Level, stat: string): NumT {
  // The size follows the kind's own cooldown.
  const f = KIND_SPEED[kind] / SWING_REF;
  return { base: Math.round(f * WEAPON.base[base]), scale: [{ ratio: f * WEAPON.ratio[ratio] * (PER_PERCENT[stat] ?? 1), stat }] };
}
/**
 * One plain weapon per kind: medium damage and ratio from Attack, nothing carried; a focus kind swings lighter (scale.ts FOCUS). Each
 * class arrives with its first kind's.
 */
const plain: GearT[] = weaponKinds.map((k) => ({
  id: `plain_${k.id}`, name: k.name, slot: "weapon", tier: "ordinary", source: "starter",
  text: `A plain ${k.name.toLowerCase()}.`,
  weapon: { kind: k.id, amount: isFocus(k.id) ? weaponHit(k.id, FOCUS.base, FOCUS.ratio, "attack") : weaponHit(k.id, "medium", "medium", "attack") },
}));

export const gear: GearT[] = [...plain];
