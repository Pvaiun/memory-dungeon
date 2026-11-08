/**
 * The core set's gear: the 12 plain weapons, one per weapon kind, each class's starter. The other pieces are in pieces/.
 */
import type { GearT } from "../../src/schema.js";
import { swingOf } from "./scale.js";
import { weaponKinds } from "./vocabulary.js";

/**
 * One plain weapon per kind: its kind's swing by its words (scale.ts KIND_WORDS), from Attack, nothing carried. Each class
 * arrives with its first kind's.
 */
const plain: GearT[] = weaponKinds.map((k) => ({
  id: `plain_${k.id}`, name: k.name, slot: "weapon", tier: "ordinary", source: "starter",
  text: `A plain ${k.name.toLowerCase()}.`,
  weapon: { kind: k.id, amount: swingOf(k.id) },
}));

export const gear: GearT[] = [...plain];
