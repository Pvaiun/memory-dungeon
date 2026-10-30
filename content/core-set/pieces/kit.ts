/**
 * Step 5i, step 5: the helpers every content share writes its items with, so the 240 pieces, 32 formations, 64 upgrades
 * and 16 mythics read alike. Numbers come from scale.ts's words; nothing here decides a value.
 */
import type { GearT, NumT, StatusT, WeaponT } from "../../../src/schema.js";
import { weaponKinds } from "../vocabulary.js";
import { KIND_SPEED, P, PER_PERCENT, SPECIAL, SPECIAL_KEY, STACKS, SWING_REF, WEAPON, crit, stepFor, type Level, type SpecialLevel, type SpecialStat, type StackWord } from "../scale.js";

/** An item's id from its name: lower case, apostrophes dropped, every other run of non-letters and non-digits an underscore. */
export const idOf = (name: string): string =>
  name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

export type Change = { stat: string; flat: number };
/** A gear step: +1 or +2 on a stat (a negative n gives it up), in the data's units: a point 1,000, HP half a point, Aggro 10, MP regen as scale.ts sets it. */
export const st = (stat: string, n: number): Change => ({ stat, flat: n * stepFor(stat) });
/** A special stat at its word (Evasion, Accuracy, Crit damage, Double strike, Thorns, Lifesteal, Siphon). */
export const sp = (s: SpecialStat, level: SpecialLevel): Change => ({ stat: SPECIAL_KEY[s], flat: SPECIAL[s][level] });
/** Crit chance in steps: +1 is 3 points, +2 is 5. */
export const critStep = (n: number): Change => ({ stat: "crit_chance", flat: crit(n) });

/** A kind's usual stat: Magic for the magical kinds, Attack for the physical. */
export const usual = (kind: string) => (weaponKinds.find((k) => k.id === kind)?.type === "magical" ? "magic" : "attack");
/** A weapon's hit: its kind's speed factor × (base + ratio × stat), the same rule as the plain weapons. */
export function weaponHit(kind: string, base: Level = "medium", ratio: Level = "medium", stat = usual(kind)): NumT {
  const f = KIND_SPEED[kind] / SWING_REF;
  return { base: Math.round(f * WEAPON.base[base]), scale: [{ ratio: f * WEAPON.ratio[ratio] * (PER_PERCENT[stat] ?? 1), stat }] };
}

/** Stacks from the holder's stat, read when a piece's status fires (a passive's words: a few 0.7 a point, several 1.3, many 2.3). */
export const own = (word: StackWord, stat: string, mult = 1): NumT => ({ scale: [{ ratio: (mult * STACKS[word]) / P, stat, of: "holder" }] });

/** The twelve builds, by the spine's short names. */
export type Build = "landslide" | "cuts" | "bonfire" | "snap" | "hunt" | "harvest" | "ambush" | "overflow" | "lockdown" | "toll" | "pact" | "phoenix";
/** What an item is worth to a build: the rung it serves (absent: worth something at any), and ●, ●● or ●●● as 1, 2, 3. Designer data, never shown. */
export type BuildTag = { build: Build; rung?: 1 | 2 | 3; worth: 1 | 2 | 3 };
export type Builds = Record<string, BuildTag[]>;

export type Rarity = "common" | "uncommon" | "rare" | "legendary" | "mythic";
type PieceOpts = {
  name: string;
  /** The card's effect, as the player reads it. Not the kind and not the wearers: the interface shows both. */
  text: string;
  slot: GearT["slot"];
  rarity: Rarity;
  /** A weapon's kind, an armor's type or an offhand's kind. A mythic weapon may leave it out and state its own speed, type and hands. */
  kind?: string;
  stats?: Change[];
  /** The piece's statuses, given at every fight's start (piece statuses: buffs on the sheet, unremovable). */
  statuses?: string[];
  /** Weapons: the hit (default medium, medium, from the kind's usual stat), and anything else the weapon states (riders, apply, a mythic's own cooldown). */
  weapon?: Partial<WeaponT>;
  /** A mythic: the one class it fits. */
  mythic?: string;
  note?: string;
};
/** One piece of gear, fixed: its rarity is its own (no affixes at any rarity). */
export function piece(o: PieceOpts): GearT {
  const g: GearT = {
    id: idOf(o.name), name: o.name, text: o.text, slot: o.slot,
    tier: o.rarity === "legendary" || o.rarity === "mythic" ? "powerful" : "ordinary", source: "drop",
    ...(o.slot === "armor" && o.kind ? { armor: o.kind } : {}),
    ...(o.slot === "offhand" && o.kind ? { offhand: o.kind } : {}),
    ...(o.stats?.length ? { stats: o.stats } : {}),
    ...(o.statuses?.length ? { statuses: o.statuses } : {}),
    ...(o.mythic ? { mythic: o.mythic } : {}),
    ...(o.note ? { note: o.note } : {}),
  };
  if (o.slot === "weapon") {
    const kind = o.weapon?.kind ?? o.kind;
    g.weapon = { ...(kind ? { kind } : {}), amount: kind ? weaponHit(kind) : 0, ...o.weapon } as WeaponT;
  }
  // Gear.rarity lands with schema 0.8; set it this way so the file compiles on either side of that change.
  (g as GearT & { rarity?: Rarity }).rarity = o.rarity;
  return g;
}

/** A piece's status: a buff on the unit sheet, unremovable, refreshed by its piece. */
export const pieceStatus = (id: string, name: string, text: string, body: Partial<StatusT>): StatusT =>
  ({ id, name, text, label: "buff", show: "sheet", stacking: "refresh", unremovable: true, ...body }) as StatusT;
