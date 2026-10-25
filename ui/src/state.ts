/**
 * What the player set up: party, formation, gear, ability order, seed and
 * settings. Kept in localStorage, so a reload keeps the build.
 */
import type { Party } from "../../src/schema.js";
import { c, classes, formations } from "./content.js";
import { plainWeapon } from "../../src/sim/parties.js";

/** `portraits`: what stands for a class in the menus. "faces" everywhere, "sprites" everywhere, or "mixed": sprites in the party's slots, faces elsewhere. */
export type Portraits = "faces" | "sprites" | "mixed";
export type Settings = { speed: number; sound: boolean; music: boolean; designer: boolean; autoContinue: boolean; theme: string; bigNumbers: boolean; portraits: Portraits };

export type Setup = {
  party: string[];
  formation: string;
  gear: Record<string, Record<string, string>>;
  abilities: Record<string, string[]>;
  seed: number;
  settings: Settings;
};

const KEY = "memory-dungeon.setup.v2";
const OLD_KEY = "memory-dungeon.setup.v1";

function fresh(): Setup {
  return {
    party: [...c.pack.starter.classes],
    formation: c.pack.starter.formations[0],
    gear: {},
    abilities: {},
    seed: 1,
    settings: { speed: 1, sound: true, music: true, designer: false, autoContinue: false, theme: "night", bigNumbers: false, portraits: "mixed" },
  };
}

export let setup: Setup = load();

function load(): Setup {
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem(OLD_KEY);
    if (!raw) return fresh();
    const s = { ...fresh(), ...(JSON.parse(raw) as Partial<Setup>) };
    const old = s.settings as Partial<Settings> & { tickMs?: number; palette?: string };
    s.settings = { ...fresh().settings, ...old };
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

export function reset() {
  setup = fresh();
  save();
}

/** A class's gear as set up: the plain weapon of its first kind unless the player chose otherwise. */
export function gearFor(cls: string): Record<string, string> {
  const g = { ...(setup.gear[cls] ?? {}) };
  if (!g.weapon) {
    const plain = plainWeapon(c, cls);
    if (plain) g.weapon = plain;
  }
  for (const slot of Object.keys(g)) if (!c.gear.has(g[slot])) delete g[slot];
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
