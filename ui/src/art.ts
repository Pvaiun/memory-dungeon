/**
 * Art tables: which sprite, icon or glyph shows what. The manifest
 * (ui/public/assets/manifest.json, written by ui/tools/assets.py) maps classes,
 * enemies and VFX strips to files; this file loads them and adds the actor
 * sheets' layout, the VFX choices, the iconset cells for gear and ability tags,
 * the weapon strips, the faces, the backdrops and the status colours. pixel.ts
 * draws them.
 */
import type { GearT } from "../../src/schema.js";
import { c } from "./content.js";

export type Manifest = {
  classes: Record<string, string>;
  enemies: Record<string, { file: string; w: number; h: number; scale: number; name?: string }>;
  statuses: Record<string, string>;
  vfx: Record<string, { file: string; frames: number }>;
  /** Weapon strips by gear id: three frames of 48×32, drawn in the hand of a party member. */
  weapons: Record<string, string>;
  /** A 36×36 face per class. */
  faces: Record<string, string>;
  /** A 270×224 scene per dungeon, and the home strip. */
  backdrops: Record<string, string>;
  frame: number;
  iconset: string;
  actorFrame?: number;
};

export let manifest: Manifest;
const images = new Map<string, HTMLImageElement>();

export async function loadArt(): Promise<void> {
  manifest = (await (await fetch(url("manifest.json"))).json()) as Manifest;
  manifest.iconset ??= "iconset.png";
  manifest.weapons ??= {};
  manifest.faces ??= {};
  manifest.backdrops ??= {};
  const files = [
    ...Object.values(manifest.classes), ...Object.values(manifest.enemies).map((e) => e.file), ...Object.values(manifest.vfx).map((v) => v.file), manifest.iconset,
    ...Object.values(manifest.statuses), ...Object.values(manifest.weapons), ...Object.values(manifest.faces), ...Object.values(manifest.backdrops),
  ];
  await Promise.all(files.map(load));
}

export const url = (file: string) => `${import.meta.env.BASE_URL}assets/${file}`;

function load(file: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = () => reject(new Error(`can't load ${file}`));
    im.src = url(file);
    images.set(file, im);
  });
}
export const image = (file: string): HTMLImageElement | undefined => images.get(file);

/** The enemy's name as shown: the manifest's rename where there is one, keeping the fight's letter ("Bandit A"). */
export function enemyName(ref: string, unitName: string): string {
  const art = manifest?.enemies[ref];
  const base = c.enemies.get(ref)?.name ?? ref;
  if (!art?.name) return unitName;
  return unitName.startsWith(base) ? art.name + unitName.slice(base.length) : art.name;
}
export const enemyDisplayName = (ref: string): string => manifest?.enemies[ref]?.name ?? c.enemies.get(ref)?.name ?? ref;

// ─── Actor sheets: RPG Maker MV sideview layout, 18 poses × 3 frames ───
export const POSE = { walk: 0, wait: 1, chant: 2, guard: 3, damage: 4, evade: 5, thrust: 6, swing: 7, missile: 8, skill: 9, spell: 10, item: 11, escape: 12, victory: 13, dying: 14, abnormal: 15, sleep: 16, dead: 17 } as const;
export type Pose = keyof typeof POSE;

/** Which VFX strip an element, damage kind or effect plays on its target. */
export const VFX_FOR: Record<string, string> = {
  fire: "fire2", ice: "ice2", lightning: "lightning3", wind: "wind2", earth: "earth4", light: "holy1", dark: "darkness2",
  slash: "sword1", pierce: "weapon4", blunt: "impact1", bite: "bite1", arrow: "arrow1", staff: "impact4",
  heal: "heal2", revive: "holy3", buff: "status1", debuff: "status7", cleanse: "heal4", dispel: "status6", shield: "diamond1",
  summon: "smoke2", split: "smoke3", explosion: "explosion1", miss: "dust2", burn: "fire1", bleed: "status3", shock: "lightning1", chill: "ice3", regen: "heal5",
};

// ─── Colour ───
export const ELEMENT_COLOR: Record<string, string> = { fire: "#ff8a4a", ice: "#8ae6ff", lightning: "#ffe14d", wind: "#9af09a", earth: "#dcae6e", light: "#fff4b8", dark: "#c892ff" };
export const ELEMENTS = Object.keys(ELEMENT_COLOR);

// ─── The iconset: [row, col] of a 16-column sheet of 32×32 cells (16×16 art pixels) ───
export type Cell = readonly [number, number];
/** Colour rows of the iconset's weapon, armour and trinket sets: blue, orange, purple, yellow, brown. */
const SHADE = { blue: 0, orange: 1, purple: 2, yellow: 3, brown: 4 } as const;
type Shade = keyof typeof SHADE;
const ELEMENT_SHADE: Record<string, Shade> = { fire: "orange", ice: "blue", lightning: "yellow", wind: "purple", earth: "brown", light: "yellow", dark: "purple" };
/** Weapon kinds: a cell in the blue row of weapon set A (row 25) or B (row 30). */
const KIND_CELL: Record<string, Cell> = { dagger: [25, 0], sword: [25, 7], bow: [25, 3], spear: [25, 14], fist: [25, 2], axe: [30, 0] };
const STAFF_CELL: Cell = [25, 15];
const ARMOR_CELL: Record<string, Cell> = { heavy: [15, 7], medium: [15, 11], light: [15, 9] };
const ARMOR_SHADE: Record<string, Shade> = { heavy: "blue", medium: "brown", light: "purple" };
const AMULET_CELL: Cell = [20, 4];
const CHARM_CELL: Cell = [20, 15];
const shade = (cell: Cell, s: Shade): Cell => [cell[0] + SHADE[s], cell[1]];

/** The iconset cell for a piece of gear: its kind's icon, coloured by element, weight, and gold for powerful pieces. */
export function gearIcon(g: GearT): Cell {
  const gold = g.tier === "powerful";
  if (g.slot === "weapon") {
    const kind = g.weapon?.kind ?? "sword";
    const def = c.weaponKinds.get(kind);
    if (def?.type === "magical") return shade(STAFF_CELL, gold ? "yellow" : ELEMENT_SHADE[def.element ?? "fire"] ?? "blue");
    return shade(KIND_CELL[kind] ?? KIND_CELL.sword, gold ? "yellow" : "blue");
  }
  if (g.slot === "armor") {
    const w = g.weight ?? "medium";
    return shade(ARMOR_CELL[w] ?? ARMOR_CELL.medium, gold ? "yellow" : ARMOR_SHADE[w] ?? "blue");
  }
  const resists = (g.stats ?? []).every((s) => s.stat.startsWith("resist")) && (g.stats ?? []).length > 0;
  return shade(resists ? CHARM_CELL : AMULET_CELL, gold ? "yellow" : resists ? "purple" : "blue");
}
/** Cells for weapon kinds on class sheets. */
export function kindIcon(kind: string): Cell {
  const def = c.weaponKinds.get(kind);
  if (def?.type === "magical") return shade(STAFF_CELL, ELEMENT_SHADE[def.element ?? "fire"] ?? "blue");
  return KIND_CELL[kind] ?? KIND_CELL.sword;
}
export const SLOT_ICON: Record<string, Cell> = { weapon: [5, 1], armor: [7, 5], amulet: [6, 9] };

/** Cells for what an ability or hit is: its element, physical kind or effect. */
export const TAG_ICON: Record<string, Cell> = {
  fire: [9, 7], ice: [9, 15], lightning: [9, 9], wind: [9, 12], earth: [9, 11], light: [9, 13], dark: [9, 14], magical: [9, 8],
  slash: [5, 1], pierce: [5, 14], blunt: [5, 11], physical: [5, 1],
  heal: [10, 6], revive: [13, 8], cleanse: [13, 9], dispel: [10, 10], buff: [13, 14], debuff: [13, 15], shield: [20, 6], summon: [13, 8], split: [13, 8],
};
export const MISC_ICON = { skull: [10, 1], star: [9, 13], boss: [9, 3], question: [0, 12], check: [13, 9] } as const satisfies Record<string, Cell>;

// ─── Status colours, for their names and numbers; the icons are the pack's 16px ones (assets/status/) ───
export const STATUS_STYLE: Record<string, { color: string; light?: string }> = {
  bleed: { color: "#ff4a5a", light: "#ffc0c8" }, regen: { color: "#7ee07e" }, shield: { color: "#6ec8ff", light: "#e8f8ff" }, might: { color: "#ff6e5a" }, weaken: { color: "#ffa062" },
  guard: { color: "#d8dde8" }, stun: { color: "#ffe14d" }, slow: { color: "#ffa062" }, haste: { color: "#6ef0e0" }, taunt: { color: "#ff5a5a" },
  burn: { color: "#ff7a3c", light: "#ffe14d" }, chill: { color: "#8ae6ff" }, shock: { color: "#ffe14d", light: "#ffffff" }, ward: { color: "#c892ff", light: "#f0e0ff" }, sunder: { color: "#dcae6e" },
  silence: { color: "#b8b8c8" }, hidden: { color: "#9aa0b4", light: "#ffffff" }, rot: { color: "#a8c050" }, clarity: { color: "#86cfff", light: "#ffffff" }, aegis: { color: "#ffd54a", light: "#fff8d0" },
  doom: { color: "#ff4a6a", light: "#ffd0d8" }, bulwark: { color: "#c9d3e0" }, bulwark_broken: { color: "#ff7b6b" }, ice_crust: { color: "#8ae6ff", light: "#ffffff" },
  bloodlust_on: { color: "#ff4a6a", light: "#ffb0b8" }, bedrock_on: { color: "#dcae6e", light: "#f8e0b0" }, generic: { color: "#c8c8d8" },
};
