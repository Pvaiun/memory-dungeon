/**
 * What the player set up: party, formation, gear, ability order and
 * settings, for free play. Kept in localStorage, so a reload keeps the build.
 * The rogue mode keeps its party in its run (rogue/state.ts).
 */
import type { Party } from "../../src/schema.js";
import { c, classes, DEFAULT_NUMBERS, formations, NUMBER_SCALES } from "./content.js";
import { plainWeapon } from "../../src/sim/parties.js";
import { handsOf } from "../../src/validate.js";
import { setMode } from "./mode.js";

/** `portraits`: what stands for a class in the menus. "faces" everywhere, "sprites" everywhere, or "mixed": sprites in the party's slots, faces elsewhere. */
export type Portraits = "faces" | "sprites" | "mixed";
/** Whose HP or MP bars the field draws under the units: nobody's, the party's, the foes', or everyone's. */
export type BarShow = "off" | "party" | "foes" | "both";
export const BAR_SHOWS: readonly BarShow[] = ["off", "party", "foes", "both"];
/**
 * `numbers`: the display scale, a multiplier of the documents' (content.ts). `hitPause`: how long the fight holds on each message once it's typed, as a
 * share of the base hold. `hpBars`, `mpBars`: whose HP and MP bars show on the field. `seedLock`: designer view only, every fight plays `setup.seed`; otherwise each one draws a new seed.
 */
export type Settings = {
  speed: number; step: boolean; hpBars: BarShow; mpBars: BarShow; sound: boolean; music: boolean; designer: boolean; autoContinue: boolean; theme: string;
  numbers: number; hitPause: number; seedLock: boolean; portraits: Portraits;
  /** The ticks each ability slot starts charged by (first, second, third); zero by default. */
  headStart: [number, number, number];
  /** How fast the field's effects play, against their own pace (FX SPEED). */
  fxSpeed: number;
};
/** The HEAD START choices, in ticks. */
export const HEAD_STARTS = [0, 2, 4, 6, 9, 12, 16, 20] as const;
/** Writes the setting into the content's opening rule, which every fight reads at its start. */
export function applyHeadStart(hs: [number, number, number]) {
  const o = c.pack.ruleset.opening;
  if (o) o.slots = [...hs];
}
/** The SPEED choices, shared by Settings and the battle's speed button. */
export const SPEEDS = [1, 1.5, 2, 2.5, 3, 4, 5] as const;

/** The HIT PAUSE choices, as shares of the base hold (half a second plus a third per line, at 1×). */
export const HIT_PAUSES = [0.25, 0.5, 0.75, 1] as const;
/** The FX SPEED choices: how fast the field's effects play, whatever the fight's speed. */
export const FX_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;

/** Who goes, where they stand and what they carry. */
export type Loadout = { party: string[]; formation: string; gear: Record<string, Record<string, string>> };

export type Setup = Loadout & {
  abilities: Record<string, string[]>;
  /** The designer's fixed seed (Settings → SEED); players never see a seed. */
  seed: number;
  settings: Settings;
};

const KEY = "memory-dungeon.setup.v2";
const OLD_KEY = "memory-dungeon.setup.v1";

const freshLoadout = (): Loadout => ({ party: [...c.pack.starter.classes].slice(0, 3), formation: c.pack.starter.formations[0], gear: {} });

function fresh(): Setup {
  return {
    ...freshLoadout(),
    abilities: {},
    seed: 1,
    settings: { speed: 1, step: false, hpBars: "both", mpBars: "party", sound: true, music: true, designer: false, autoContinue: false, theme: "night", numbers: DEFAULT_NUMBERS, hitPause: 0.75, seedLock: false, portraits: "mixed", headStart: [0, 0, 0], fxSpeed: 1 },
  };
}

export let setup: Setup = load();
applyHeadStart(setup.settings.headStart);

function load(): Setup {
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(OLD_KEY);
    if (!raw) return fresh();
    // An older save kept the retired journey's loadout in use and free play's in `other`.
    const stored = JSON.parse(raw) as Partial<Setup> & { mode?: string; other?: Loadout };
    const { mode: oldMode, other, ...kept } = stored;
    const s: Setup = { ...fresh(), ...kept, ...(oldMode === "journey" && other ? other : {}) };
    const old = s.settings as Partial<Settings> & { tickMs?: number; palette?: string; bigNumbers?: boolean };
    s.settings = { ...fresh().settings, ...old };
    // An older save holds NUMBERS as SMALL, MEDIUM or BIG (×1, ×3, ×10), or as a BIG NUMBERS switch.
    const named: Record<string, number> = { small: 1, medium: 3, big: 10 };
    const was = old.numbers as unknown;
    s.settings.numbers = typeof was === "number" ? was : typeof was === "string" ? named[was] ?? DEFAULT_NUMBERS : old.bigNumbers ? 10 : DEFAULT_NUMBERS;
    delete (s.settings as { bigNumbers?: boolean }).bigNumbers;
    if (!(NUMBER_SCALES as readonly number[]).includes(s.settings.numbers)) s.settings.numbers = DEFAULT_NUMBERS;
    if (!(HIT_PAUSES as readonly number[]).includes(s.settings.hitPause)) s.settings.hitPause = fresh().settings.hitPause;
    if (!(FX_SPEEDS as readonly number[]).includes(s.settings.fxSpeed)) s.settings.fxSpeed = 1;
    if (!(SPEEDS as readonly number[]).includes(s.settings.speed)) s.settings.speed = 1;
    if (s.settings.theme !== "night" && s.settings.theme !== "day") s.settings.theme = "night";
    if (!["faces", "sprites", "mixed"].includes(s.settings.portraits)) s.settings.portraits = "mixed";
    // An older save had a PARTY HP switch, with the foes' HP always shown: both now take the defaults.
    if (!BAR_SHOWS.includes(s.settings.hpBars)) s.settings.hpBars = fresh().settings.hpBars;
    if (!BAR_SHOWS.includes(s.settings.mpBars)) s.settings.mpBars = fresh().settings.mpBars;
    delete (s.settings as { partyBars?: boolean }).partyBars;
    if (!Array.isArray(s.settings.headStart) || s.settings.headStart.length !== 3 || !s.settings.headStart.every((n) => (HEAD_STARTS as readonly number[]).includes(n))) s.settings.headStart = [0, 0, 0];
    delete (s.settings as { tickMs?: number }).tickMs;
    delete (s.settings as { palette?: string }).palette;
    s.party = s.party.filter((id) => c.classes.has(id)).slice(0, 3);
    if (!c.formations.has(s.formation)) s.formation = fresh().formation;
    return s;
  } catch {
    return fresh();
  }
}

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(setup));
  } catch {
    /* private mode: nothing to do */
  }
}

/** Everything back to the start: the settings and the loadout, in free play. */
export function reset() {
  setMode("free");
  setup = fresh();
  applyHeadStart(setup.settings.headStart);
  save();
}

/** A class's gear as set up: the plain weapon of its first kind unless the player chose otherwise. Gear no longer in the content is left out. */
export function gearFor(cls: string): Record<string, string> {
  const g = { ...(setup.gear[cls] ?? {}) };
  for (const slot of Object.keys(g)) if (!c.gear.has(g[slot])) delete g[slot];
  if (!g.weapon) {
    const plain = plainWeapon(c, cls);
    if (plain) g.weapon = plain;
  }
  // A two-handed weapon leaves no hand for an offhand.
  if (g.offhand && handsOf(c.pack, c.gear.get(g.weapon ?? "")) === 2) delete g.offhand;
  return g;
}

export function abilitiesFor(cls: string): string[] {
  const all = c.classes.get(cls)!.abilities;
  const chosen = (setup.abilities[cls] ?? []).filter((a) => all.includes(a));
  for (const a of all) if (!chosen.includes(a)) chosen.push(a);
  return chosen.slice(0, c.pack.design.abilitiesEquipped);
}

/** The party as the engine takes it. */
export function party(): Party {
  const f = c.formations.get(setup.formation)!;
  return {
    formation: setup.formation,
    units: setup.party.map((cls, i) => ({ class: cls, position: f.positions[i].id, abilities: abilitiesFor(cls), gear: gearFor(cls) })),
  };
}

/** A party of one class, plain weapon, neutral formation: for a class sheet outside the party. */
export function soloParty(cls: string): Party {
  const f = formations[0];
  return { formation: f.id, units: [{ class: cls, position: f.positions[0].id, abilities: abilitiesFor(cls), gear: gearFor(cls) }] };
}

export const classIds = classes.map((x) => x.id);

/** The seed for a fight or run about to start: a new one every time, unless the designer locked one. */
export const nextSeed = (): number => (setup.settings.designer && setup.settings.seedLock ? setup.seed : Math.floor(Math.random() * 1e9) + 1);
