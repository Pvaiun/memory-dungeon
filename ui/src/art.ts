/**
 * Art tables: which sprite shows what. The manifest (ui/public/assets/manifest.json,
 * written by ui/tools/assets.py) maps classes, enemies, statuses and VFX strips to
 * files; this file loads them and adds the actor sheets' layout and the VFX choices.
 * pixel.ts turns them into four shades.
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
  const files = [...Object.values(manifest.classes), ...Object.values(manifest.enemies).map((e) => e.file), ...Object.values(manifest.statuses), ...Object.values(manifest.vfx).map((v) => v.file)];
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

/** Which VFX strip an element or damage kind plays on its target. */
export const VFX_FOR: Record<string, string> = {
  fire: "fire2", ice: "ice2", lightning: "lightning3", wind: "wind2", earth: "earth4", light: "holy1", dark: "darkness2",
  slash: "sword1", pierce: "weapon4", blunt: "impact1", bite: "bite1", arrow: "arrow1", staff: "impact4",
  heal: "heal2", revive: "holy3", buff: "status1", debuff: "status7", cleanse: "heal4", dispel: "status6", shield: "diamond1",
  summon: "smoke2", split: "smoke3", explosion: "explosion1", miss: "dust2", burn: "fire1", poison: "status3", shock: "lightning1", chill: "ice3", regen: "heal5",
};
