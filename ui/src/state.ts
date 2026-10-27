/**
 * What the player set up: party, formation, gear, ability order and
 * settings. Kept in localStorage, so a reload keeps the build. The journey and
 * free play each keep their own party, formation and gear (the loadout): the
 * one in use sits in `setup`, the other in `setup.other`, so switching modes
 * loses neither. What isn't owned is dropped on read (journey.ts says what's owned).
 */
import type { Party } from "../../src/schema.js";
import { c, classes, DEFAULT_NUMBERS, formations, NUMBER_SCALES } from "./content.js";
import { plainWeapon } from "../../src/sim/parties.js";
import { mode as journeyMode, owned, ownsGear, resetJourney, setMode as setJourneyMode, type Mode } from "./journey.js";

/** `portraits`: what stands for a class in the menus. "faces" everywhere, "sprites" everywhere, or "mixed": sprites in the party's slots, faces elsewhere. */
export type Portraits = "faces" | "sprites" | "mixed";
/**
 * `numbers`: the display scale, a multiplier of the documents' (content.ts). `hitPause`: how long the fight holds on each message once it's typed, as a
 * share of the base hold. `seedLock`: designer view only, every fight plays `setup.seed`; otherwise each one draws a new seed.
 */
export type Settings = {
  speed: number; step: boolean; partyBars: boolean; sound: boolean; music: boolean; designer: boolean; autoContinue: boolean; theme: string;
  numbers: number; hitPause: number; seedLock: boolean; portraits: Portraits;
};
/** The HIT PAUSE choices, as shares of the base hold (half a second plus a third per line, at 1×). */
export const HIT_PAUSES = [0.25, 0.5, 0.75, 1] as const;

/** Who goes, where they stand and what they carry: one per mode. */
export type Loadout = { party: string[]; formation: string; gear: Record<string, Record<string, string>> };

export type Setup = Loadout & {
  /** The mode the loadout in use belongs to; `other` is the other mode's. An install from before the journey has none: its loadout is free play's. */
  mode?: Mode;
  other?: Loadout;
  abilities: Record<string, string[]>;
  /** The designer's fixed seed (Settings → SEED); players never see a seed. */
  seed: number;
  settings: Settings;
};

const KEY = "memory-dungeon.setup.v2";
const OLD_KEY = "memory-dungeon.setup.v1";

const freshLoadout = (): Loadout => {
  const start = c.pack.campaign?.start ?? c.pack.starter;
  return { party: [...start.classes].slice(0, 3), formation: start.formations[0], gear: {} };
};

function fresh(): Setup {
  return {
    ...freshLoadout(),
    mode: journeyMode(),
    abilities: {},
    seed: 1,
    settings: { speed: 1, step: false, partyBars: false, sound: true, music: true, designer: false, autoContinue: false, theme: "night", numbers: DEFAULT_NUMBERS, hitPause: 0.75, seedLock: false, portraits: "mixed" },
  };
}

export let setup: Setup = load();
useMode(journeyMode());

function load(): Setup {
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(OLD_KEY);
    if (!raw) return fresh();
    const stored = JSON.parse(raw) as Partial<Setup>;
    const s = { ...fresh(), ...stored, mode: stored.mode === "rogue" ? "free" : stored.mode ?? "free" };
    const old = s.settings as Partial<Settings> & { tickMs?: number; palette?: string; bigNumbers?: boolean };
    s.settings = { ...fresh().settings, ...old };
    // NUMBERS was SMALL, MEDIUM or BIG (×1, ×3, ×10) before it took a multiplier, and a BIG NUMBERS switch before that.
    const named: Record<string, number> = { small: 1, medium: 3, big: 10 };
    const was = old.numbers as unknown;
    s.settings.numbers = typeof was === "number" ? was : typeof was === "string" ? named[was] ?? DEFAULT_NUMBERS : old.bigNumbers ? 10 : DEFAULT_NUMBERS;
    delete (s.settings as { bigNumbers?: boolean }).bigNumbers;
    if (!(NUMBER_SCALES as readonly number[]).includes(s.settings.numbers)) s.settings.numbers = DEFAULT_NUMBERS;
    if (!(HIT_PAUSES as readonly number[]).includes(s.settings.hitPause)) s.settings.hitPause = fresh().settings.hitPause;
    if (!(s.settings.speed === 1 || s.settings.speed === 2 || s.settings.speed === 4)) s.settings.speed = 1;
    if (s.settings.theme !== "night" && s.settings.theme !== "day") s.settings.theme = "night";
    if (!["faces", "sprites", "mixed"].includes(s.settings.portraits)) s.settings.portraits = "mixed";
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

/** Everything back to the start: settings, both loadouts, and the journey (in journey mode). */
export function reset() {
  resetJourney();
  setJourneyMode("journey");
  setup = fresh();
  save();
}

/** Puts the mode's loadout in use, keeping the other one, and records the mode. */
export function useMode(m: Mode) {
  setJourneyMode(m);
  // The rogue mode keeps its party in its run (rogue-state.ts): the loadout in use stays as it is.
  if (m === "rogue") return void save();
  if (setup.mode !== m) {
    const { party, formation, gear } = setup;
    Object.assign(setup, setup.other ?? freshLoadout());
    setup.other = { party, formation, gear };
    setup.mode = m;
  }
  sanitize();
  save();
}
/** A fresh journey loadout, the starter party in the starter formation, whichever mode is in use. */
export function resetJourneyLoadout() {
  if (setup.mode === "journey") Object.assign(setup, freshLoadout());
  else setup.other = freshLoadout();
  save();
}
/** Drops party members that aren't owned, and an unowned formation for the first owned one (the journey changed under them). */
export function sanitize() {
  const o = owned();
  setup.party = setup.party.filter((id) => o.classes.includes(id)).slice(0, 3);
  if (!o.formations.includes(setup.formation)) setup.formation = o.formations[0] ?? formations[0].id;
}

/** A class's gear as set up: the plain weapon of its first kind unless the player chose otherwise. Gear that isn't owned is left out. */
export function gearFor(cls: string): Record<string, string> {
  const g = { ...(setup.gear[cls] ?? {}) };
  for (const slot of Object.keys(g)) if (!c.gear.has(g[slot]) || !ownsGear(g[slot])) delete g[slot];
  if (!g.weapon) {
    const plain = plainWeapon(c, cls);
    if (plain) g.weapon = plain;
  }
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
