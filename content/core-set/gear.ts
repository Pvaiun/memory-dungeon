/**
 * The core set's gear: the 11 plain weapons, one per weapon kind, each class's starter. The other pieces are in pieces/.
 */
import type { GearT, NumT } from "../../src/schema.js";
import { KIND_SPEED, PER_PERCENT, SWING_REF, WEAPON, type Level } from "./scale.js";
import { weaponKinds } from "./vocabulary.js";

/** A weapon's hit: its kind's speed factor × (base + ratio × stat). */
export function weaponHit(kind: string, base: Level, ratio: Level, stat: string): NumT {
  // The size follows the kind's own cooldown.
  const f = KIND_SPEED[kind] / SWING_REF;
  return { base: Math.round(f * WEAPON.base[base]), scale: [{ ratio: f * WEAPON.ratio[ratio] * (PER_PERCENT[stat] ?? 1), stat }] };
}
const usual = (kind: string) => (weaponKinds.find((k) => k.id === kind)!.type === "magical" ? "magic" : "attack");

/** One plain weapon per kind: medium damage and ratio, the kind's usual stat, nothing carried. Each class arrives with its first kind's. */
const plain: GearT[] = weaponKinds.map((k) => ({
  id: `plain_${k.id}`, name: k.name, text: `A plain ${k.name.toLowerCase()}.`, slot: "weapon", tier: "ordinary", source: "starter",
  weapon: { kind: k.id, amount: weaponHit(k.id, "medium", "medium", usual(k.id)) },
}));

export const gear: GearT[] = [...plain];
