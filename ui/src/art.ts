/**
 * Art tables: which sprite, icon or glyph shows what. The manifest
 * (ui/public/assets/manifest.json, written by ui/tools/assets.py) maps classes,
 * enemies and VFX strips to files; this file loads them and adds the actor
 * sheets' layout, the VFX choices, the iconset cells for gear and ability tags,
 * the weapon strips, the faces, the backdrops and the status colours. pixel.ts
 * draws them.
 */
import { BUILD } from "./update.js";
import type { GearT, WeaponT } from "../../src/schema.js";
import { resolveWeapon } from "../../src/engine/combat/fight.js";
import { baseGearId, c } from "./content.js";

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
  /** The campfire's frames in one strip, square, at art size. */
  campfire?: { file: string; frames: number; size: number };
  /** Chests: an object sheet of square cells, each colour's column opening down its rows. */
  chest?: { file: string; cell: number; frames: number; columns: Record<string, number> };
};

export let manifest: Manifest;
const images = new Map<string, HTMLImageElement>();

export async function loadArt(): Promise<void> {
  manifest = (await (await fetch(url("manifest.json"))).json()) as Manifest;
  manifest.iconset ??= "iconset.png";
  manifest.weapons ??= {};
  manifest.faces ??= {};
  manifest.backdrops ??= {};
  // Step 5j: the new kinds' plain pieces borrow a strip until the director's art arrives.
  for (const [id, from] of Object.entries(WEAPON_STAND_INS)) if (!manifest.weapons[id] && manifest.weapons[from]) manifest.weapons[id] = manifest.weapons[from];
  const files = [
    ...Object.values(manifest.classes), ...Object.values(manifest.enemies).map((e) => e.file), ...Object.values(manifest.vfx).map((v) => v.file), manifest.iconset,
    ...Object.values(manifest.statuses), ...Object.values(manifest.weapons), ...Object.values(manifest.faces), ...Object.values(manifest.backdrops),
    ...(manifest.campfire ? [manifest.campfire.file] : []), ...(manifest.chest ? [manifest.chest.file] : []),
  ];
  await Promise.all(files.map(load));
}

/** An asset's URL, with the build's id so a new build's art is never served from an old cache. */
export const url = (file: string) => `${import.meta.env.BASE_URL}assets/${file}?v=${BUILD}`;

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
/**
 * Stand-in strips for the plain pieces of the kinds step 5j added, from the strips the packs already gave, until the
 * director supplies their own: the great weapon holds the old axe; the rune sword the Oathblade's glowing blade; the mace,
 * the wand, the rod and the staff the old plain staffs whose look fits who carries them first (the Light staff went to the
 * mace; the Stormcaller's wand, the Frostweaver's rod, the Pyromancer's staff).
 */
const WEAPON_STAND_INS: Record<string, string> = {
  plain_great_weapon: "plain_axe", plain_rune_sword: "oathblade", plain_mace: "plain_light_staff",
  plain_wand: "plain_lightning_staff", plain_rod: "plain_ice_staff", plain_staff: "plain_fire_staff",
};
/** A weapon's strip: its own, or for a rogue run's item, its base piece's, or else its kind's plain piece's. */
export function weaponArt(gearId: string | undefined): string | undefined {
  if (!gearId) return undefined;
  const own = manifest.weapons[gearId] ?? manifest.weapons[baseGearId(gearId)];
  if (own) return own;
  const kind = c.gear.get(gearId)?.weapon?.kind;
  return kind ? manifest.weapons[`plain_${kind}`] : undefined;
}

// ─── Actor sheets: RPG Maker MV sideview layout, 18 poses × 3 frames ───
export const POSE = { walk: 0, wait: 1, chant: 2, guard: 3, damage: 4, evade: 5, thrust: 6, swing: 7, missile: 8, skill: 9, spell: 10, item: 11, escape: 12, victory: 13, dying: 14, abnormal: 15, sleep: 16, dead: 17 } as const;
export type Pose = keyof typeof POSE;

/** Which VFX strip a look or effect plays on its target. A look is art only (see LOOKS below): a theme or a weapon's motion. */
export const VFX_FOR: Record<string, string> = {
  fire: "fire2", ice: "ice2", lightning: "lightning3", wind: "wind2", earth: "earth4", light: "holy1", dark: "darkness2", magical: "impact4",
  slash: "sword1", pierce: "weapon4", blunt: "impact1", bite: "bite1", arrow: "arrow1",
  heal: "heal2", revive: "holy3", buff: "status1", debuff: "status7", cleanse: "heal4", dispel: "status6", shield: "diamond1",
  summon: "smoke2", split: "smoke3", explosion: "explosion1", miss: "dust2", burn: "fire1", bleed: "claw", shock: "lightning1", chill: "ice3", regen: "heal5",
};

// ─── Looks: themes, art only ───
/*
 * Step 5j (the director's rule of Oct 29, 2026): two kinds of damage and no elements or physical subtypes as mechanics.
 * An element survives only as a theme, so the battle keeps its fire, ice and lightning effects and icons, and the hits
 * keep their slash, thrust and impact, by id here, in the art: the data no longer says. A look picks an action's icon,
 * its effect on the target and nothing else; what defends against it is its damage type, which the sheets and the
 * numbers show. These are the looks the data had before the rule.
 */
const ABILITY_LOOK: Record<string, string> = {
  shield_bash: "blunt", barbed_arrow: "pierce", frost_arrow: "ice", rending_arrow: "pierce", bramble_lash: "pierce", spear_thrust: "pierce",
  smite: "light", gale_spear: "wind", burning_fist: "fire", pressure_point: "blunt", backstab: "pierce", garrote: "pierce", blood_drain: "dark",
  firebolt: "fire", fireball: "fire", pyre: "fire", frost_lance: "ice", blizzard: "ice", chain_lightning: "lightning", thunderstorm: "lightning",
  rockfall: "earth", tremor: "earth",
  // the foes'
  shield_slam: "blunt", flatten: "blunt", crush: "blunt", soulfire: "dark", reap: "slash", brand: "fire", inferno: "fire", hailstorm: "ice", tempest: "lightning",
};
/** A foe's basic attack, where its weapon's kind doesn't say (or it bites). */
const ENEMY_LOOK: Record<string, string> = {
  wolf: "bite", snow_wolf: "bite", snake: "bite", bat: "bite", hellhound: "bite", leech: "bite",
  ghost: "dark", bone_priest: "dark", witch: "dark", lich: "dark", wraith: "dark", ice_ghost: "dark",
  fire_imp: "fire", fire_giant: "fire", ice_spirit: "ice", wisp: "lightning", drone: "lightning", soldier: "lightning", storm_queen: "lightning", storm_king: "lightning",
  lava_slime: "blunt", mini_slime: "blunt", bomb_bug: "blunt",
};
/** A piece's own look: the old staffs' themes, kept by piece (a rogue run's item takes its base piece's). */
const PIECE_LOOK: Record<string, string> = {
  plain_staff: "fire", plain_wand: "lightning", plain_rod: "ice", plain_mace: "light",
  brand_staff: "fire", ember_staff: "fire", storm_rod: "lightning", grounding_rod: "lightning", zephyr_staff: "wind", tailwind_staff: "wind",
  granite_staff: "earth", rootstaff: "earth", heartwood_staff: "earth", rime_staff: "ice", hoarfrost_staff: "ice", glacier_staff: "ice",
  sunstaff: "light", dawn_staff: "light", chapel_staff: "light", templar_staff: "light", nightstaff: "dark", leech_staff: "dark", sanguine_staff: "dark",
  gravecaller: "dark", cinder_rod: "lightning", earthshaker: "earth",
};
/** A weapon kind's look: how its swing lands. */
const KIND_LOOK: Record<string, string> = {
  dagger: "pierce", fist: "blunt", sword: "slash", spear: "pierce", bow: "pierce", great_weapon: "blunt",
  rune_sword: "slash", mace: "blunt", wand: "magical", rod: "magical", staff: "magical",
};
const weaponKindLook = (wp: WeaponT | undefined): string => (wp?.kind && KIND_LOOK[wp.kind]) || (wp && resolveWeapon(c, wp).type === "magical" ? "magical" : "blunt");
/** An ability's look, when it deals damage: its theme or motion, else its damage type. */
export const abilityLook = (id: string, type: "physical" | "magical"): string => ABILITY_LOOK[id.replace(/__\w+$/, "")] ?? type;
/** A basic attack's look, from its weapon's ref (a gear id, "enemy:<id>" or "unarmed"), or a foe's own. */
export function weaponLook(ref: string, enemy?: string): string {
  if (enemy && ENEMY_LOOK[enemy]) return ENEMY_LOOK[enemy];
  if (ref.startsWith("enemy:")) return ENEMY_LOOK[ref.slice(6)] ?? weaponKindLook(c.enemies.get(ref.slice(6))?.weapon);
  if (ref === "unarmed") return "blunt";
  return PIECE_LOOK[ref] ?? PIECE_LOOK[baseGearId(ref)] ?? weaponKindLook(c.gear.get(ref)?.weapon);
}

// ─── Colour: the two kinds of damage (the stylesheet's --phys and --magic), and the rarities ───
export const TYPE_COLOR: Record<string, string> = { physical: "#ffffff", magical: "#c8a0ff" };

// ─── The iconset: [row, col] of a 16-column sheet of 32×32 cells (16×16 art pixels) ───
export type Cell = readonly [number, number];
/** Colour rows of the iconset's weapon, armour and trinket sets: blue, orange, purple, yellow, brown. */
const SHADE = { blue: 0, orange: 1, purple: 2, yellow: 3, brown: 4 } as const;
type Shade = keyof typeof SHADE;
/** Weapon kinds: a cell in the blue row of weapon set A (row 25) or B (row 30). Stand-ins for the step 5j kinds until the director's art. */
const KIND_CELL: Record<string, Cell> = {
  dagger: [25, 0], sword: [25, 7], bow: [25, 3], spear: [25, 14], fist: [25, 2], great_weapon: [30, 0],
  rune_sword: [25, 12], mace: [30, 7], wand: [25, 5], rod: [30, 8], staff: [25, 10],
};
/** Armor types: a cell in the blue row of the armour set (row 15), and its shade. */
const ARMOR_CELL: Record<string, Cell> = { plate: [15, 7], mail: [15, 12], leather: [15, 8], robes: [15, 9] };
const ARMOR_SHADE: Record<string, Shade> = { plate: "blue", mail: "blue", leather: "brown", robes: "purple" };
/** Offhand kinds (step 5j; no pieces yet): stand-ins from the trinket and weapon sets, in their shade. */
const OFFHAND_CELL: Record<string, [Cell, Shade]> = {
  kite_shield: [[20, 6], "blue"], round_shield: [[30, 12], "brown"], horn: [[25, 8], "yellow"], tome: [[20, 12], "purple"], lantern: [[20, 10], "yellow"],
  relic: [[35, 6], "yellow"], bell: [[20, 9], "yellow"], totem: [[20, 14], "brown"], vial: [[20, 8], "purple"], idol: [[20, 15], "purple"],
};
const AMULET_CELL: Cell = [20, 4];
const shade = (cell: Cell, s: Shade): Cell => [cell[0] + SHADE[s], cell[1]];

/** The iconset cell for a piece of gear: its kind's or type's icon, physical weapons blue and magical ones purple, gold for legendary and mythic pieces. */
export function gearIcon(g: GearT): Cell {
  const gold = g.tier === "powerful";
  if (g.slot === "weapon") return kindIcon(g.weapon?.kind ?? "sword", gold);
  if (g.slot === "armor") {
    const t = g.armor ?? "mail";
    return shade(ARMOR_CELL[t] ?? ARMOR_CELL.mail, gold ? "yellow" : ARMOR_SHADE[t] ?? "blue");
  }
  if (g.slot === "offhand") {
    const [cell, s] = OFFHAND_CELL[g.offhand ?? ""] ?? OFFHAND_CELL.kite_shield;
    return shade(cell, gold ? "yellow" : s);
  }
  return shade(AMULET_CELL, gold ? "yellow" : "blue");
}
/** A weapon kind's cell: physical blue, magical purple (gold for a powerful piece). */
export function kindIcon(kind: string, gold = false): Cell {
  const def = c.weaponKinds.get(kind);
  return shade(KIND_CELL[kind] ?? KIND_CELL.sword, gold ? "yellow" : def?.type === "magical" ? "purple" : "blue");
}
/** An empty slot's cell: the plain grey set. */
export const SLOT_ICON: Record<string, Cell> = { weapon: [5, 1], armor: [7, 5], offhand: [7, 0], amulet: [6, 9] };

/** Cells for what an ability or hit looks like (a theme, a weapon's motion, its damage type) or does. */
export const TAG_ICON: Record<string, Cell> = {
  fire: [9, 7], ice: [9, 15], lightning: [9, 9], wind: [9, 12], earth: [9, 11], light: [9, 13], dark: [9, 14], magical: [9, 6],
  slash: [5, 1], pierce: [5, 14], blunt: [5, 11], physical: [5, 1],
  heal: [10, 6], revive: [13, 8], cleanse: [13, 9], dispel: [10, 10], buff: [13, 14], debuff: [13, 15], shield: [20, 6], summon: [13, 8], split: [13, 8],
};
export const MISC_ICON = { skull: [10, 1], star: [9, 13], boss: [9, 3], question: [0, 12], check: [13, 9] } as const satisfies Record<string, Cell>;

// ─── Status colours, for their names and numbers; the icons are the pack's 16px ones (assets/status/) ───
export const STATUS_STYLE: Record<string, { color: string; light?: string }> = {
  bleed: { color: "#e8384a", light: "#ffc0c8" }, regen: { color: "#7ee07e" }, shield: { color: "#6ec8ff", light: "#e8f8ff" }, might: { color: "#ff6e5a" }, weaken: { color: "#ffa062" },
  guard: { color: "#d8dde8" }, stun: { color: "#ffe14d" }, slow: { color: "#ffa062" }, haste: { color: "#6ef0e0" }, taunt: { color: "#ff5a5a" },
  burn: { color: "#ff7a3c", light: "#ffe14d" }, chill: { color: "#8ae6ff" }, shock: { color: "#ffe14d", light: "#ffffff" }, ward: { color: "#c892ff", light: "#f0e0ff" }, sunder: { color: "#dcae6e" },
  silence: { color: "#b8b8c8" }, hidden: { color: "#9aa0b4", light: "#ffffff" }, rot: { color: "#a8c050" }, clarity: { color: "#86cfff", light: "#ffffff" }, aegis: { color: "#ffd54a", light: "#fff8d0" },
  doom: { color: "#ff4a6a", light: "#ffd0d8" }, bulwark: { color: "#c9d3e0" }, bulwark_broken: { color: "#ff7b6b" }, ice_crust: { color: "#8ae6ff", light: "#ffffff" },
  bloodlust_on: { color: "#ff4a6a", light: "#ffb0b8" }, bedrock_on: { color: "#dcae6e", light: "#f8e0b0" }, generic: { color: "#c8c8d8" },
  // Step 5i: Marked and the counters, in their stand-in icons' colours.
  marked: { color: "#f05a4a" }, cuts: { color: "#c8d2e0" }, heat: { color: "#f05a4a" }, spite: { color: "#e8284e" }, tempo: { color: "#6ea0f0" },
  surge: { color: "#c46ef0" }, fervor: { color: "#fad040" }, charge: { color: "#8ae6ff" },
};
/** A status's colour: its own, else a buff's cool or a debuff's warm (step 5i: the new statuses have no entry of their own). */
export function statusStyle(id: string): { color: string; light?: string } {
  if (STATUS_STYLE[id]) return STATUS_STYLE[id];
  const label = c.statuses.get(id)?.label;
  return label === "buff" ? { color: "#86cfff" } : label === "debuff" ? { color: "#ffa062" } : STATUS_STYLE.generic;
}
