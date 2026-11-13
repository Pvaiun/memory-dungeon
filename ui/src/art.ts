/**
 * Art tables: which sprite, icon or glyph shows what. The manifest
 * (ui/public/assets/manifest.json, written by ui/tools/assets.py) maps classes,
 * enemies and VFX strips to files; this file loads them and adds the actor
 * sheets' layout, the looks (an action's theme or motion), the iconset cells
 * for gear and ability tags, the weapon strips, the faces, the backdrops and
 * the status colours. pixel.ts draws them; effects.ts picks the VFX strips.
 */
import { BUILD } from "./update.js";
import type { GearT, WeaponT } from "../../src/schema.js";
import { baseGearId, c } from "./content.js";

export type Manifest = {
  classes: Record<string, string>;
  enemies: Record<string, { file: string; w: number; h: number; scale: number; name?: string }>;
  statuses: Record<string, string>;
  /** An ability's own icon by base id: 32×32, one pixel per art pixel. */
  abilities?: Record<string, string>;
  /** VFX strips by name: `frames` frames of w×h side by side, cropped from the pack's 64×64 at (ox, oy). */
  vfx: Record<string, { file: string; frames: number; w: number; h: number; ox: number; oy: number }>;
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
  /** Gear icons, 16×16 at art size in a 16-column sheet: a cell per piece that isn't a weapon, by id, and per "kind:<kind>" and "slot:<slot>". */
  gearSheet?: string;
  gear?: Record<string, number>;
};

export let manifest: Manifest;
const images = new Map<string, HTMLImageElement>();

export async function loadArt(): Promise<void> {
  manifest = (await (await fetch(url("manifest.json"))).json()) as Manifest;
  manifest.iconset ??= "iconset.png";
  manifest.weapons ??= {};
  manifest.faces ??= {};
  manifest.backdrops ??= {};
  manifest.abilities ??= {};
  // The plain pieces of kinds with no art of their own borrow a strip.
  for (const [id, from] of Object.entries(WEAPON_STAND_INS)) if (!manifest.weapons[id] && manifest.weapons[from]) manifest.weapons[id] = manifest.weapons[from];
  const files = [
    ...Object.values(manifest.classes), ...Object.values(manifest.enemies).map((e) => e.file), ...Object.values(manifest.vfx).map((v) => v.file), manifest.iconset,
    ...Object.values(manifest.statuses), ...Object.values(manifest.abilities), ...Object.values(manifest.weapons), ...Object.values(manifest.faces), ...Object.values(manifest.backdrops),
    ...(manifest.campfire ? [manifest.campfire.file] : []), ...(manifest.chest ? [manifest.chest.file] : []), ...(manifest.gearSheet ? [manifest.gearSheet] : []),
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
 * Stand-in strips for the plain pieces of kinds with no art of their own, from the strips the packs give: the great weapon and
 * the axe hold the axe; the hammer the Earthshaker's maul; the rune sword the Oathblade's glowing blade; the fist weapons the dagger's
 * strip; the mace, the wand and the staff the plain staffs whose look fits who carries them first (the Light staff for the mace;
 * the Bard's and Hexer's lightning wand, the Pyromancer's fire staff).
 */
const WEAPON_STAND_INS: Record<string, string> = {
  plain_great_weapon: "plain_axe", plain_axe: "plain_axe", plain_hammer: "earthshaker", plain_rune_sword: "oathblade", plain_fist: "plain_dagger", plain_mace: "plain_light_staff",
  plain_wand: "plain_lightning_staff", plain_staff: "plain_fire_staff",
};
/**
 * The mythic weapons the data gives no kind (a mythic can have its own swing), drawn as the kind each reads as; art only.
 * The Stormcaller's Eye of the tempest is drawn as its other kind, the rune sword, so it shows in the hand.
 */
const MYTHIC_WEAPON_KIND: Record<string, string> = { stormspear: "spear", the_witch_blade: "sword", ember_palms: "fist", eye_of_the_tempest: "rune_sword" };
/** A weapon's kind as drawn: its own, else a kindless mythic's (a rogue run's item, its base piece's). */
export const drawnKind = (g: GearT): string | undefined => g.weapon?.kind ?? MYTHIC_WEAPON_KIND[g.id] ?? MYTHIC_WEAPON_KIND[baseGearId(g.id)];
/** A weapon's strip: its own, or for a rogue run's item, its base piece's, or else its kind's plain piece's. */
export function weaponArt(gearId: string | undefined): string | undefined {
  if (!gearId) return undefined;
  const own = manifest.weapons[gearId] ?? manifest.weapons[baseGearId(gearId)];
  if (own) return own;
  const g = c.gear.get(gearId);
  const kind = g ? drawnKind(g) : undefined;
  return kind ? manifest.weapons[`plain_${kind}`] : undefined;
}

// ─── Actor sheets: RPG Maker MV sideview layout, 18 poses × 3 frames ───
export const POSE = { walk: 0, wait: 1, chant: 2, guard: 3, damage: 4, evade: 5, thrust: 6, swing: 7, missile: 8, skill: 9, spell: 10, item: 11, escape: 12, victory: 13, dying: 14, abnormal: 15, sleep: 16, dead: 17 } as const;
export type Pose = keyof typeof POSE;


// ─── Looks: themes, art only ───
/*
 * One kind of hit, and no elements or subtypes as mechanics. An element is only a theme: the battle's fire, ice and
 * lightning effects and icons, and the hits' slash, thrust and impact, are set by id here, in the art, since the data
 * doesn't say. A look picks an action's icon, its effect on the target, and whether a damaging ability reads as a spell
 * (a theme) or a weapon skill (a motion): its pose, its sound and its verb. Nothing else: every hit meets the same defenses.
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
/** A piece's own look: a caster's weapon's theme, by piece (a rogue run's item takes its base piece's). */
const PIECE_LOOK: Record<string, string> = {
  plain_staff: "fire", plain_wand: "lightning", plain_rune_sword: "ice", plain_mace: "light",
  brand_staff: "fire", ember_staff: "fire", storm_rod: "lightning", grounding_rod: "lightning", zephyr_staff: "wind", tailwind_staff: "wind",
  granite_staff: "earth", rootstaff: "earth", heartwood_staff: "earth", rime_staff: "ice", hoarfrost_staff: "ice", glacier_staff: "ice",
  sunstaff: "light", dawn_staff: "light", chapel_staff: "light", templar_staff: "light", nightstaff: "dark", leech_staff: "dark", sanguine_staff: "dark",
  gravecaller: "dark", cinder_rod: "lightning", earthshaker: "earth",
};
/** A piece's own theme, if it has one (a rogue run's item takes its base piece's). */
export const pieceLook = (ref: string): string | undefined => PIECE_LOOK[ref] ?? PIECE_LOOK[baseGearId(ref)];
/** A weapon kind's look: how its swing lands. */
const KIND_LOOK: Record<string, string> = {
  dagger: "pierce", fist: "slash", sword: "slash", spear: "pierce", axe: "slash", bow: "pierce", great_weapon: "blunt",
  rune_sword: "slash", hammer: "blunt", mace: "blunt", wand: "arcane", staff: "arcane",
};
const weaponKindLook = (wp: WeaponT | undefined): string => (wp?.kind && KIND_LOOK[wp.kind]) || "blunt";
/** An ability's look, when it deals damage: its theme or motion, else a plain hit's. */
export const abilityLook = (id: string): string => ABILITY_LOOK[id.replace(/__\w+$/, "")] ?? "physical";
/** The looks that are a theme, not a weapon's motion: a damaging ability with one is a spell (cast, with the spell's pose and sound). */
const THEMES = new Set(["fire", "ice", "lightning", "wind", "earth", "light", "dark", "arcane"]);
export const isTheme = (look: string): boolean => THEMES.has(look);
/** A basic attack's look, from its weapon's ref (a gear id, "enemy:<id>" or "unarmed"), or a foe's own. */
export function weaponLook(ref: string, enemy?: string): string {
  if (enemy && ENEMY_LOOK[enemy]) return ENEMY_LOOK[enemy];
  if (ref.startsWith("enemy:")) return ENEMY_LOOK[ref.slice(6)] ?? weaponKindLook(c.enemies.get(ref.slice(6))?.weapon);
  if (ref === "unarmed") return "blunt";
  return PIECE_LOOK[ref] ?? PIECE_LOOK[baseGearId(ref)] ?? weaponKindLook(c.gear.get(ref)?.weapon);
}

// ─── The iconset: [row, col] of a 16-column sheet of 32×32 cells (16×16 art pixels) ───
export type Cell = readonly [number, number];
/** Colour rows of the iconset's weapon, armour and trinket sets: blue, orange, purple, yellow, brown. */
const SHADE = { blue: 0, orange: 1, purple: 2, yellow: 3, brown: 4 } as const;
type Shade = keyof typeof SHADE;
/** Weapon kinds: a cell in the blue row of weapon set A (row 25) or B (row 30); some are stand-ins until a kind has its own art. */
const KIND_CELL: Record<string, Cell> = {
  dagger: [25, 0], fist: [25, 2], sword: [25, 7], spear: [25, 14], axe: [30, 0], bow: [25, 3], great_weapon: [30, 0],
  rune_sword: [25, 12], hammer: [30, 7], mace: [30, 7], wand: [25, 5], staff: [25, 10],
};
/** Armor types: a cell in the blue row of the armour set (row 15), and its shade. */
const ARMOR_CELL: Record<string, Cell> = { plate: [15, 7], mail: [15, 12], leather: [15, 8], robes: [15, 9] };
const ARMOR_SHADE: Record<string, Shade> = { plate: "blue", mail: "blue", leather: "brown", robes: "purple" };
/** Offhand kinds: stand-ins from the trinket and weapon sets, in their shade. */
const OFFHAND_CELL: Record<string, [Cell, Shade]> = {
  kite_shield: [[20, 6], "blue"], round_shield: [[30, 12], "brown"], horn: [[25, 8], "yellow"], tome: [[20, 12], "purple"], lantern: [[20, 10], "yellow"],
  relic: [[35, 6], "yellow"], bell: [[20, 9], "yellow"], totem: [[20, 14], "brown"], vial: [[20, 8], "purple"], idol: [[20, 15], "purple"],
  orb: [[20, 4], "purple"], trophy: [[20, 15], "brown"], cloak: [[15, 8], "blue"],
};
const AMULET_CELL: Cell = [20, 4];
const shade = (cell: Cell, s: Shade): Cell => [cell[0] + SHADE[s], cell[1]];

/**
 * A piece's cell in the gear sheet (ui/tools/gear_icons.py): its own, or for a rogue run's item its base piece's, else
 * its kind's; undefined for a weapon, which keeps the iconset and its strip.
 */
export function gearCell(g: GearT): number | undefined {
  if (g.slot === "weapon" || !manifest.gear) return undefined;
  const kind = g.armor ?? g.offhand ?? (g.slot === "amulet" ? "amulet" : undefined);
  // A run's item names its base piece in its note, whether or not it's been taken (and so registered) yet.
  const base = /^rogue \w+: (\w+)/.exec(g.note ?? "")?.[1] ?? baseGearId(g.id);
  return manifest.gear[g.id] ?? manifest.gear[base] ?? (kind ? manifest.gear[`kind:${kind}`] : undefined) ?? manifest.gear[`slot:${g.slot}`];
}
/** An empty slot's cell in the gear sheet, dimmed; undefined for the weapon's, which keeps the iconset's. */
export const slotCell = (slot: string): number | undefined => manifest.gear?.[`slot:${slot}`];

/** The iconset cell for a piece of gear, where the gear sheet has none (a weapon): its kind's or type's icon, the casters' weapons purple and the rest blue, gold for legendary and mythic pieces. */
export function gearIcon(g: GearT): Cell {
  const gold = g.tier === "powerful";
  if (g.slot === "weapon") return kindIcon(drawnKind(g) ?? "sword", gold);
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
/** The casters' weapon kinds, drawn purple by kind (art only: their hits are everyone's). */
const CASTER_KINDS = new Set(["rune_sword", "mace", "wand", "staff"]);
/** A weapon kind's cell: a caster's purple, the rest blue (gold for a powerful piece). */
export function kindIcon(kind: string, gold = false): Cell {
  return shade(KIND_CELL[kind] ?? KIND_CELL.sword, gold ? "yellow" : CASTER_KINDS.has(kind) ? "purple" : "blue");
}
/** An empty slot's cell: the plain grey set. */
export const SLOT_ICON: Record<string, Cell> = { weapon: [5, 1], armor: [7, 5], offhand: [7, 0], amulet: [6, 9] };

/** Cells for what an ability or hit looks like (a theme, a weapon's motion, a plain hit) or does. */
export const TAG_ICON: Record<string, Cell> = {
  fire: [9, 7], ice: [9, 15], lightning: [9, 9], wind: [9, 12], earth: [9, 11], light: [9, 13], dark: [9, 14], arcane: [9, 6],
  slash: [5, 1], pierce: [5, 14], blunt: [5, 11], physical: [5, 1],
  heal: [10, 6], revive: [13, 8], cleanse: [13, 9], dispel: [10, 10], buff: [13, 14], debuff: [13, 15], shield: [20, 6], summon: [13, 8], split: [13, 8],
};
export const MISC_ICON = { skull: [10, 1], star: [9, 13], boss: [9, 3], question: [0, 12], check: [13, 9] } as const satisfies Record<string, Cell>;

// ─── Status colours, for their names and numbers; the icons are the pack's 16px ones (assets/status/) ───
export const STATUS_STYLE: Record<string, { color: string; light?: string }> = {
  bleed: { color: "#e8384a", light: "#ffc0c8" }, regen: { color: "#7ee07e" }, shield: { color: "#6ec8ff", light: "#e8f8ff" }, might: { color: "#ff6e5a" }, weaken: { color: "#ffa062" },
  guard: { color: "#d8dde8" }, stun: { color: "#ffe14d" }, slow: { color: "#ffa062" }, haste: { color: "#6ef0e0" }, taunt: { color: "#ff5a5a" },
  burn: { color: "#ff7a3c", light: "#ffe14d" }, chill: { color: "#8ae6ff" }, shock: { color: "#ffe14d", light: "#ffffff" }, sunder: { color: "#dcae6e" },
  silence: { color: "#b8b8c8" }, hidden: { color: "#9aa0b4", light: "#ffffff" }, rot: { color: "#a8c050" }, clarity: { color: "#86cfff", light: "#ffffff" }, aegis: { color: "#ffd54a", light: "#fff8d0" },
  doom: { color: "#ff4a6a", light: "#ffd0d8" }, bulwark: { color: "#c9d3e0" }, bulwark_broken: { color: "#ff7b6b" }, ice_crust: { color: "#8ae6ff", light: "#ffffff" },
  bloodlust_on: { color: "#ff4a6a", light: "#ffb0b8" }, bedrock_on: { color: "#dcae6e", light: "#f8e0b0" }, generic: { color: "#c8c8d8" },
  // Marked and the counters, in their stand-in icons' colours.
  marked: { color: "#f05a4a" }, cuts: { color: "#c8d2e0" }, heat: { color: "#f05a4a" }, spite: { color: "#e8284e" }, wrath: { color: "#fad040" },
  crescendo: { color: "#c46ef0" }, cascade: { color: "#8ae6ff" },
};
/** A status's colour: its own, else a buff's cool or a debuff's warm. */
export function statusStyle(id: string): { color: string; light?: string } {
  if (STATUS_STYLE[id]) return STATUS_STYLE[id];
  const label = c.statuses.get(id)?.label;
  return label === "buff" ? { color: "#86cfff" } : label === "debuff" ? { color: "#ffa062" } : STATUS_STYLE.generic;
}

