/**
 * A rogue run's data: the run, its roster, items, offers and pending decision, the meta a run leaves behind, and the
 * small helpers every part reads (the config, a member, the bench, a note, a roll sliced by what it's for).
 */
import type { FoesT, RarityT, RogueFightT, RogueNodeKindT, RogueRegionT, RogueT, SupplyIdT } from "../schema.js";
import type { Content } from "../engine/run.js";
import { int, type Rng, rngFor } from "../engine/rng.js";

/** The version of a saved run's shape: a run saved under another is set aside. */
export const ROGUE_VERSION = 4;
export type Slot = "weapon" | "armor" | "offhand" | "amulet";
export const SLOT_LIST: Slot[] = ["weapon", "armor", "offhand", "amulet"];

// ─── State ──────────────────────────────────────────────────────────────────

/**
 * A piece of gear in a run: a piece of the content (`base`) and its rarity, the piece's own (every piece is fixed, with no
 * affixes at any rarity; a plain weapon is common). Its id in the content is `uid`. `junk`: the player's mark on a piece in
 * the bag, to sell (it changes nothing in play; equipping the piece takes it off).
 */
export type Item = { uid: string; base: string; rarity: RarityT; junk?: boolean };
/** A version of an upgrade. */
export type Version = "a" | "b";
/** What a member has trained on one ability or its passive: the power step, a version, or both (in either order). */
export type Trained = { power?: boolean; version?: Version };
/**
 * A class in the run's roster. HP and MP are kept as what's missing, so gear that raises the max raises the current too.
 * `known` and `order` are base ability ids; `trained` records, by ability id or the passive's status id, the power
 * step and the version taken, and the engine's party gets the forms (`formOf`).
 */
export type Member = {
  cls: string; known: string[]; order: string[]; gear: Partial<Record<Slot, string>>; missHp: number; missMp: number; ko: boolean;
  trained?: Record<string, Trained>;
  /**
   * Ticks of cooldown each ability had left as the last fight ended; the next fight starts from there. By base ability id, so a
   * carried cooldown follows its ability to a new form.
   */
  cooldowns?: Record<string, number>;
  /** Max HP and MP as the last fight ended: a heal by share of max counts from no more than this (see `healMax`). */
  lastMax?: { hp: number; mp: number };
};
export type MapNode = { id: string; floor: number; col: number; kind: RogueNodeKindT; next: string[] };
export type Offer =
  /** `sealed`: its rarity and name hidden until taken (an unknown reward). */
  | { kind: "gear"; item: Item; sealed?: boolean }
  /** A bundle: a piece and a supply together. */
  | { kind: "bundle"; item: Item; supply: SupplyIdT }
  | { kind: "tome"; cls: string; ability: string }
  /** A recruit comes knowing what its offer shows (rolled when offered), and a cage's recruit with a piece. */
  | { kind: "recruit"; cls: string; known?: string[]; item?: Item }
  | { kind: "formation"; id: string }
  | { kind: "supply"; id: SupplyIdT }
  /** One more seat at camp. */
  | { kind: "seat" };
export type ShopSlot = { offer: Offer; price: number; sold: boolean };
export type FightTier = "fight" | "elite" | "boss";
export type FightSpec = { node: string; tier: FightTier; fight: RogueFightT; foes: FoesT; seed: number };
export type Pending =
  | { kind: "draft"; offers: string[]; left: number; known?: Record<string, string[]> }
  | { kind: "map" }
  | ({ kind: "fight"; begun?: boolean } & FightSpec)
  /** A won fight offers a choice of one supply; `then` is what follows the pick (the spoils, or a boss's boon). */
  | { kind: "drop"; options: SupplyIdT[]; then: Pending }
  | { kind: "spoils"; gold: number; offers: Offer[]; tier: FightTier; trophy?: Item; then?: Pending }
  /** An elite's second pick, of formations, after its pick of legendaries. */
  | { kind: "trophy"; offers: Offer[]; then: Pending }
  /** A captive freed after a fight against people: taken in, a lesson, or let go; `then` follows. */
  | { kind: "captive"; offer: Offer; then: Pending }
  | { kind: "boon"; offers: Offer[] }
  | { kind: "shop"; stock: ShopSlot[]; learn: boolean; upgrade: boolean; trained?: number }
  | { kind: "campfire"; used?: boolean; resting?: string[]; stranger?: Offer }
  | { kind: "event"; id: string; v?: number }
  /** The Muster (a pick of recruits) and the Drill ground (a pick of formations, or training). */
  | { kind: "muster"; offers: Offer[]; then?: Pending }
  | { kind: "drill"; offers: Offer[] }
  /**
   * `left` members each take one training (each member once); `then` is what follows. `back`, the room it came from, while nobody
   * is trained yet, so a player can look at the options without being locked in. A training is learning an ability, or an
   * ability's or the passive's power step or version (`trainOptions`).
   */
  | { kind: "train"; left: number; done: string[]; then: Pending; why: string; back?: Pending }
  | { kind: "treasure"; offer: Offer; gold: number }
  | { kind: "choose"; what: "learn" | "upgrade" | "temper"; why: string; from?: RarityT[]; risk?: number }
  | { kind: "levelup"; queue: string[] }
  | { kind: "region"; options: string[] }
  /** A boss's Destiny Shard, to take; `then` follows. */
  | { kind: "shard"; then: Pending }
  /** A lost fight with a Destiny Shard held: spend one to go back to the moment before the fight (`retry`), or end the run. */
  | { kind: "fate"; fight: string }
  | { kind: "over"; won: boolean };

/** One line of what happened, for the run's summary and the playtest's diary. */
export type Note = { act: number; floor: number; text: string };

export type RogueRun = {
  v: number;
  seed: number;
  heat: number;
  leader: string;
  act: number;
  region: string;
  boss: RogueFightT;
  map: MapNode[];
  /** The node last entered, or null at an act's start. */
  at: string | null;
  visited: string[];
  /** Events met this run, so a run doesn't meet the same one twice until it has met them all. */
  seen: string[];
  /** Fights met this act, so an act doesn't repeat one while its pool has others. */
  met: string[];
  roster: Member[];
  /** Classes in the party, in formation slot order; the rest of the roster waits at camp. */
  party: string[];
  formation: string;
  formations: string[];
  /** Seats at camp (the bench), from the config's start up to its max. */
  seats?: number;
  /** The fight (by count) the last captive came after, so none comes two fights running. */
  captiveAt?: number;
  items: Item[];
  supplies: SupplyIdT[];
  gold: number;
  pending: Pending;
  /** Destiny Shards held (a boss gives one): a lost fight can spend one to return to `retry`. */
  shards?: number;
  /** The whole run as the pending fight's preview opened (without itself or the record), kept until the fight ends: a shard returns to it. */
  retry?: RogueRun;
  uid: number;
  /** Counters for the summary and the simulations. */
  stats: { fights: number; elites: number; bosses: number; gold: number; spent: number; events: number; shops: number; campfires: number; picks: Record<string, number> };
  notes: Note[];
  /** How far the run got, for the summary: act and floor of the last room entered. */
  floor: number;
};

/** A saved run brought up to date: fields added since it was saved get their defaults. */
export function migrate(run: RogueRun): RogueRun {
  run.seen ??= [];
  run.met ??= [];
  return run;
}

/** What a player keeps between runs: the classes a run can start with, and how far they've climbed. */
export type RogueMeta = { owned: string[]; heat: number; maxHeat: number; runs: number; wins: number; best: { act: number; floor: number }; /** The next run's dice, kept until a run starts (the start screen shows each leader's roll). */ next?: number };

export const freshMeta = (): RogueMeta => ({ owned: ["knight", "cleric", "ranger"], heat: 0, maxHeat: 0, runs: 0, wins: 0, best: { act: 0, floor: 0 } });

export function rogue(c: Content): RogueT {
  if (!c.pack.rogue) throw new Error("this pack has no rogue block");
  return c.pack.rogue;
}
export const cfg = (c: Content) => rogue(c).config;
export const regionOf = (c: Content, id: string): RogueRegionT => rogue(c).regions.find((r) => r.id === id)!;
export const member = (run: RogueRun, cls: string): Member => run.roster.find((m) => m.cls === cls)!;
export const bench = (run: RogueRun): string[] => run.roster.map((m) => m.cls).filter((cls) => !run.party.includes(cls));
export const note = (run: RogueRun, text: string) => run.notes.push({ act: run.act, floor: run.floor, text });
export const r = (run: RogueRun, label: string): Rng => rngFor(run.seed, `rogue:${label}`);
export const between = (rng: Rng, [a, b]: readonly [number, number] | number[]) => a + int(rng, b - a + 1);

// ─── Meta: what a run leaves behind ────────────────────────────────────────

/** The classes a won run can add to the leaders: those in its final party (the three seated) not yet owned. */
export const unlockable = (meta: RogueMeta, run: RogueRun): string[] => run.party.filter((cls) => !meta.owned.includes(cls));

/**
 * A finished run: a win adds the one class the player picks from its final party (`pick`, one of `unlockable`) to the
 * classes a run can start with, and opens the next heat. A pick outside `unlockable` adds nothing.
 */
export function finish(meta: RogueMeta, run: RogueRun, pick?: string): { unlocked: string[]; heat: boolean } {
  meta.runs++;
  if (run.act > meta.best.act || (run.act === meta.best.act && run.floor > meta.best.floor)) meta.best = { act: run.act, floor: run.floor };
  if (run.pending.kind !== "over" || !run.pending.won) return { unlocked: [], heat: false };
  meta.wins++;
  const unlocked = pick && unlockable(meta, run).includes(pick) ? [pick] : [];
  meta.owned.push(...unlocked);
  const heat = run.heat >= meta.maxHeat;
  if (heat) meta.maxHeat = run.heat + 1;
  return { unlocked, heat };
}
