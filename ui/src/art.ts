/**
 * Art tables: which sprite shows what. The manifest (ui/public/assets/manifest.json,
 * written by ui/tools/assets.py) maps classes, enemies and statuses to files; this
 * file adds colours, VFX choices and the iconset's coordinates.
 */
import { c } from "./content.js";

export type Manifest = {
  classes: Record<string, string>;
  enemies: Record<string, { file: string; w: number; h: number; scale: number; name?: string }>;
  statuses: Record<string, string>;
  vfx: Record<string, { file: string; frames: number }>;
  frame: number;
};

export let manifest: Manifest;
const images = new Map<string, HTMLImageElement>();

export async function loadArt(): Promise<void> {
  manifest = (await (await fetch(url("manifest.json"))).json()) as Manifest;
  const files = [...Object.values(manifest.classes), ...Object.values(manifest.enemies).map((e) => e.file), ...Object.values(manifest.statuses), ...Object.values(manifest.vfx).map((v) => v.file), "iconset.png"];
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
/** Source rect of a pose's frame on a sheet. */
export function poseRect(sheet: HTMLImageElement, pose: Pose, frame: number): [number, number, number, number] {
  const fw = sheet.width / 9, fh = sheet.height / 6;
  const m = POSE[pose];
  return [((m % 3) * 3 + (frame % 3)) * fw, Math.floor(m / 3) * fh, fw, fh];
}

// ─── Colours ───
export const ELEMENT_COLOR: Record<string, string> = {
  fire: "#ff7a3d", ice: "#8fe3ff", lightning: "#ffe34d", wind: "#b9f5c9", earth: "#d9a86a", light: "#fff4b0", dark: "#b48cff",
  physical: "#ffffff", none: "#ffb3c6", heal: "#7dff8a", shield: "#9ad0ff", mp: "#7fa7ff",
};
export const ELEMENT_ICON_COL: Record<string, number> = { fire: 7, ice: 8, lightning: 9, wind: 12, earth: 11, light: 13, dark: 14 };

/** Which VFX strip an element or damage kind plays on its target. */
export const VFX_FOR: Record<string, string> = {
  fire: "fire2", ice: "ice2", lightning: "lightning3", wind: "wind2", earth: "earth4", light: "holy1", dark: "darkness2",
  slash: "sword1", pierce: "weapon4", blunt: "impact1", bite: "bite1", arrow: "arrow1", staff: "impact4",
  heal: "heal2", revive: "holy3", buff: "status1", debuff: "status7", cleanse: "heal4", dispel: "status6", shield: "diamond1",
  summon: "smoke2", split: "smoke3", explosion: "explosion1", miss: "dust2", burn: "fire1", poison: "status3", shock: "lightning1", chill: "ice3", regen: "heal5",
};

// ─── The iconset (RPG Maker style, 32px, 16 per row) ───
export const ICON = 32;
export type IconRef = [col: number, row: number];
export const WEAPON_ICON: Record<string, IconRef> = {
  dagger: [4, 30], fist: [2, 25], sword: [7, 25], bow: [3, 25], spear: [9, 25], axe: [0, 30],
  fire_staff: [8, 31], lightning_staff: [8, 33], wind_staff: [8, 33], earth_staff: [8, 34], ice_staff: [8, 30], light_staff: [8, 33], dark_staff: [8, 32],
};
export const ARMOR_ICON: Record<string, IconRef> = { heavy: [8, 15], medium: [11, 16], light: [10, 17] };
export const AMULET_ICON: IconRef = [6, 35];
export const STAT_ICON: Record<string, IconRef> = { max_hp: [0, 11], max_mp: [1, 11], attack: [2, 11], armor: [3, 11], magic: [4, 11], mp_regen: [5, 11], aggro: [6, 11], crit_chance: [7, 11] };
export function iconStyle([col, row]: IconRef, scale = 1): string {
  return `background-image:url(${url("iconset.png")});background-position:${-col * ICON * scale}px ${-row * ICON * scale}px;background-size:${512 * scale}px ${1408 * scale}px;width:${ICON * scale}px;height:${ICON * scale}px;image-rendering:pixelated;display:inline-block;vertical-align:middle`;
}
