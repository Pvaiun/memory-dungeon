/**
 * What the player set up: party, formation, gear, ability order, seed and
 * settings. Kept in localStorage, so a reload keeps the build.
 */
import type { Party } from "../../src/schema.js";
import { c, classes, formations } from "./content.js";
import { plainWeapon } from "../../src/sim/parties.js";

export type Settings = { tickMs: number; sound: boolean; designer: boolean; autoContinue: boolean; showEnemyNumbers: boolean };

export type Setup = {
  party: string[];
  formation: string;
  gear: Record<string, Record<string, string>>;
  abilities: Record<string, string[]>;
  seed: number;
  settings: Settings;
};

const KEY = "memory-dungeon.setup.v1";

function fresh(): Setup {
  return {
    party: [...c.pack.starter.classes],
    formation: c.pack.starter.formations[0],
    gear: {},
    abilities: {},
    seed: 1,
    settings: { tickMs: 500, sound: true, designer: true, autoContinue: false, showEnemyNumbers: true },
  };
}

export let setup: Setup = load();

function load(): Setup {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fresh();
    const s = { ...fresh(), ...(JSON.parse(raw) as Partial<Setup>) };
    s.settings = { ...fresh().settings, ...s.settings };
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
