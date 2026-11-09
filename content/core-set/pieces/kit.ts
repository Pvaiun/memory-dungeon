/**
 * The helpers every content file writes its items with, so the 272 pieces, 32 formations, 64 upgrades
 * and 16 mythics read alike. Numbers come from scale.ts's words; nothing here decides a value.
 */
import type { GearT, NumT, StatusT, WeaponT } from "../../../src/schema.js";
import { weaponKinds } from "../vocabulary.js";
import { KIND_BUDGET, KIND_WORDS, P, SPECIAL, SPECIAL_KEY, STACKS, SWING_TRADE, crit, stepFor, swingOf, type KindWords, type SpecialLevel, type SpecialStat, type StackWord } from "../scale.js";

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

/**
 * A weapon's hit: its kind's swing by its words (scale.ts KIND_WORDS), the same rule as the plain weapons. A piece may step along
 * the trade (`trade`: a heavier swing for a step fewer, a lighter one for a step more, scale.ts SWING_TRADE), take a different
 * scaling, or swing from another stat in place of Attack (the Heartsplitter's max HP).
 */
export function weaponHit(kind: string, o: Partial<KindWords> & { trade?: Trade; stat?: string } = {}): NumT {
  const n = swingOf(kind, o, o.stat ?? "attack") as Exclude<NumT, number>;
  if (!o.trade) return n;
  const m = o.trade === "heavy" ? SWING_TRADE : 1 / SWING_TRADE;
  return { base: Math.round((n.base ?? 0) * m), scale: n.scale.map((t) => ({ ...t, ratio: Math.round(t.ratio * m * 1e6) / 1e6 })) };
}
export type Trade = "heavy" | "light";
/** The stat steps a kind's pieces carry at a rarity (scale.ts KIND_BUDGET), a step fewer for a heavy piece and one more for a light one. */
export const budgetOf = (kind: string, rarity: Rarity, trade?: Trade): number =>
  rarity === "mythic" ? 0 : Math.max(0, KIND_BUDGET[KIND_WORDS[kind].budget][rarity] + (trade === "heavy" ? -1 : trade === "light" ? 1 : 0));
/**
 * How many steps a piece's stats are: an amount stat's steps (HP's half points, Aggro's tens, MP regen's own), Crit chance's
 * table, a special stat at its medium word one and at its high word two. A stat that shapes a piece (the Worldbreaker's slow
 * swing, the Hummingbird charm's fast one: a special at any other value) or a price (the Phoenix ember's HP) counts none; Aggro
 * down counts, since the casters want it.
 */
export function stepsOf(stats: readonly Change[] = []): number {
  let n = 0;
  for (const c of stats) {
    if (c.stat === "crit_chance") n += c.flat >= crit(2) ? 2 : c.flat > 0 ? 1 : 0;
    else if (c.stat in SPECIAL_LEVELS) n += c.flat === SPECIAL_LEVELS[c.stat].high ? 2 : c.flat === SPECIAL_LEVELS[c.stat].medium ? 1 : 0;
    else if (c.stat === "aggro") n += Math.round(Math.abs(c.flat) / stepFor(c.stat)); // Aggro down is a step the casters want.
    else if (["max_hp", "max_mp", "mp_regen", "attack", "defense"].includes(c.stat) && c.flat > 0) n += Math.round(c.flat / stepFor(c.stat));
  }
  return n;
}
const SPECIAL_LEVELS: Record<string, { medium: number; high: number }> = Object.fromEntries((Object.keys(SPECIAL) as SpecialStat[]).map((s) => [SPECIAL_KEY[s], SPECIAL[s]]));

/** Stacks from the holder's stat, read when a piece's status fires (a passive's words: a few 0.7 a point, several 1.3, many 2.3). */
export const own = (word: StackWord, stat: string, mult = 1): NumT => ({ scale: [{ ratio: (mult * STACKS[word]) / P, stat, of: "holder" }] });

/** The twelve builds, by the spine's short names. */
export type Build = "landslide" | "cuts" | "bonfire" | "snap" | "hunt" | "harvest" | "ambush" | "overflow" | "lockdown" | "toll" | "pact" | "phoenix";
/** What an item is worth to a build: the rung it serves (absent: worth something at any), and ●, ●● or ●●● as 1, 2, 3. Designer data, never shown. */
export type BuildTag = { build: Build; rung?: 1 | 2 | 3; worth: 1 | 2 | 3 };
export type Builds = Record<string, BuildTag[]>;

export type Rarity = "common" | "uncommon" | "rare" | "legendary" | "mythic";
const SPECIAL_NAME: Record<string, string> = { evasion: "Evasion", accuracy: "Accuracy", crit_multiplier: "Crit damage", double_strike: "Double strike", thorns: "Thorns", lifesteal: "Lifesteal", siphon: "Siphon", attack_speed: "Attack speed", cooldown_reduction: "Cooldown", cast_time_reduction: "Cast speed" };
/** The card of a piece that is only its stats (a common): the interface shows the stats, so the card says only that there's nothing more. */
export const PLAIN_CARD = "Nothing beyond its stats.";

type PieceOpts = {
  name: string;
  /** The card's effect, as the player reads it: what the piece does beyond its stats, or nothing for a common. The card is the swing trade, then this. */
  effect?: string;
  /** The whole card, in place of the trade and `effect` (a mythic's). */
  text?: string;
  slot: GearT["slot"];
  rarity: Rarity;
  /** A weapon's kind, an armor's type or an offhand's kind. A mythic weapon may leave it out and state its own speed, type and hands. */
  kind?: string;
  stats?: Change[];
  /** The piece's statuses, given at every fight's start (piece statuses: buffs on the sheet, unremovable). */
  statuses?: string[];
  /** Weapons: the hit (default: its kind's swing by its words), and anything else the weapon states (riders, apply, a mythic's own cooldown). */
  weapon?: Partial<WeaponT>;
  /** Weapons: a step along the trade. heavy: a harder swing for a stat step fewer; light: a lighter swing for one more. The card says it. */
  trade?: Trade;
  /** A mythic: the one class it fits. */
  mythic?: string;
  note?: string;
};
/** One piece of gear, fixed: its rarity is its own (no affixes at any rarity). */
export function piece(o: PieceOpts): GearT {
  const trade = o.trade === "heavy" ? "A heavier swing." : o.trade === "light" ? "A lighter swing." : "";
  // The card is the swing trade and the effect. The stats are the interface's (shown as values beside the name), never words on the card.
  const text = o.text ?? ([trade, o.effect ?? ""].filter(Boolean).join(" ") || PLAIN_CARD);
  const g: GearT = {
    id: idOf(o.name), name: o.name, text, slot: o.slot,
    // The validator's tiers: an ordinary piece drops, a powerful one (legendary, mythic) is an unlock. Neither changes play in the rogue.
    ...(o.rarity === "legendary" || o.rarity === "mythic" ? { tier: "powerful" as const, source: "unlock" as const } : { tier: "ordinary" as const, source: "drop" as const }),
    ...(o.slot === "armor" && o.kind ? { armor: o.kind } : {}),
    ...(o.slot === "offhand" && o.kind ? { offhand: o.kind } : {}),
    ...(o.stats?.length ? { stats: o.stats } : {}),
    ...(o.statuses?.length ? { statuses: o.statuses } : {}),
    ...(o.mythic ? { mythic: o.mythic } : {}),
    ...(o.note ? { note: o.note } : {}),
  };
  if (o.slot === "weapon") {
    const kind = o.weapon?.kind ?? o.kind;
    g.weapon = { ...(kind ? { kind } : {}), amount: kind ? weaponHit(kind, { trade: o.trade }) : 0, ...o.weapon } as WeaponT;
    // Every piece carries its kind's steps at its rarity (the director's rule: stats at every rarity, and the kind's budget says how many).
    if (kind && o.rarity !== "mythic" && stepsOf(o.stats) !== budgetOf(kind, o.rarity, o.trade)) {
      throw new Error(`${o.name}: a ${o.rarity} ${kind} carries ${budgetOf(kind, o.rarity, o.trade)} stat steps, not ${stepsOf(o.stats)}`);
    }
  } else if (o.rarity !== "mythic") {
    // An offhand, armor or amulet has no swing to trade against: the standard budget, exact for an offhand's kind and a common or
    // uncommon of any slot; a rare or legendary armor or amulet carries at least its step beside the effect that is its shape.
    const want = KIND_BUDGET.standard[o.rarity], have = stepsOf(o.stats);
    const exact = o.slot === "offhand" || o.rarity === "common" || o.rarity === "uncommon";
    if (exact ? have !== want : have < want) throw new Error(`${o.name}: a ${o.rarity} ${o.slot} carries ${exact ? "" : "at least "}${want} stat steps, not ${have}`);
  }
  // A special stat on gear is medium, or high on a legendary (the loot's rule).
  if (o.rarity !== "legendary" && o.rarity !== "mythic") {
    const high = o.stats?.find((c) => c.stat in SPECIAL_LEVELS && c.flat === SPECIAL_LEVELS[c.stat].high);
    if (high) throw new Error(`${o.name}: a ${o.rarity} with ${SPECIAL_NAME[high.stat]} high; high is a legendary's`);
  }
  (g as GearT & { rarity?: Rarity }).rarity = o.rarity;
  return g;
}

/** A piece's status: a buff on the unit sheet, unremovable, refreshed by its piece. */
export const pieceStatus = (id: string, name: string, text: string, body: Partial<StatusT>): StatusT =>
  ({ id, name, text, label: "buff", show: "sheet", stacking: "refresh", unremovable: true, ...body }) as StatusT;
