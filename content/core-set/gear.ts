/**
 * The core set's gear: the 11 plain weapons, one per weapon kind, each class's starter.
 *
 * Step 5i (the build's retire share): every other piece is gone (the 33 named weapons, the 7 powerful ones, the 17 armors
 * and the 17 amulets of docs/core-set/gear-and-formation-lists.md). The director: "I would not keep any loot that we have
 * now just for the sake of keeping it." The pieces of steps/05-core-set/5i-synergy/fill/ take their place.
 */
import type { GearT, NumT } from "../../src/schema.js";
import { KIND_SPEED, PER_PERCENT, SWING_REF, WEAPON, type Level } from "./scale.js";
import { weaponKinds } from "./vocabulary.js";

/** A weapon's hit: its kind's speed factor × (base + ratio × stat). */
export function weaponHit(kind: string, base: Level, ratio: Level, stat: string): NumT {
  // Pacing pass: the size follows the kind's own cooldown (it was a factor for each of three speed words).
  const f = KIND_SPEED[kind] / SWING_REF;
  return { base: Math.round(f * WEAPON.base[base]), scale: [{ ratio: f * WEAPON.ratio[ratio] * (PER_PERCENT[stat] ?? 1), stat }] };
}
const usual = (kind: string) => (weaponKinds.find((k) => k.id === kind)!.type === "magical" ? "magic" : "attack");

/** One plain weapon per kind (step 5j: eleven): medium damage and ratio, the kind's usual stat, nothing carried. Each class arrives with its first kind's. */
const plain: GearT[] = weaponKinds.map((k) => ({
  id: `plain_${k.id}`, name: k.name, text: `A plain ${k.name.toLowerCase()}.`, slot: "weapon", tier: "ordinary", source: "starter",
  weapon: { kind: k.id, amount: weaponHit(k.id, "medium", "medium", usual(k.id)) },
}));

export const gear: GearT[] = [...plain];
