/**
 * The content the interface shows: the core set pack, loaded once, with the
 * single fights of every dungeon added as one-stage dungeons ("dungeon~stage"),
 * the display scale, and the short names and codes the Game Boy layout uses.
 * The data stores amounts at 1,000 per point of the documents' relative scale;
 * the interface shows 10 per point (a Knight has 50 HP, a sword hits for about
 * 11), or 100 per point with the "big numbers" setting.
 */
import raw from "../../content/core-set.pack.json";
import { build } from "../../src/sim/content.js";
import type { Content } from "../../src/engine/run.js";
import type { AbilityT, ClassDefT, DungeonT, EnemyT, FormationT, GearT, StatusT, WeaponKindT } from "../../src/schema.js";

export let DISPLAY_DIV = 100;
export const setDisplayDiv = (d: number) => { DISPLAY_DIV = d; };
/** An amount in the data, as shown. */
export const disp = (n: number) => Math.round(n / DISPLAY_DIV);
/** An amount in the data, in points of the documents' scale (HP 5 is 5,000). */
export const pts = (n: number) => Math.round((n / 1000) * 10) / 10;

export type FightRef = { dungeon: DungeonT; stage: Extract<DungeonT["stages"][number], { kind: "fight" }>; id: string };

const fights: string[] = [];
for (const d of (raw as { dungeons: DungeonT[] }).dungeons) for (const s of d.stages) if (s.kind === "fight") fights.push(`${d.id}/${s.id}`);

export const content: Content = build(raw, [...new Set(fights)]);
export const c = content;

/** The real dungeons, in the order they're played. */
export const dungeons: DungeonT[] = c.pack.progression.dungeonOrder.map((id) => c.dungeons.get(id)!);

/** Every fight, as a one-stage dungeon id. */
export const singleFights: FightRef[] = dungeons.flatMap((d) =>
  d.stages.flatMap((s) => (s.kind === "fight" ? [{ dungeon: d, stage: s, id: `${d.id}~${s.id}` }] : [])),
);

export const classes: ClassDefT[] = c.pack.classes;
export const formations: FormationT[] = c.pack.formations;
export const gear: GearT[] = c.pack.gear;
export const enemies: EnemyT[] = c.pack.enemies;
export const cls = (id: string): ClassDefT => c.classes.get(id)!;
export const ability = (id: string): AbilityT => c.abilities.get(id)!;
export const status = (id: string): StatusT => c.statuses.get(id)!;
export const enemy = (id: string): EnemyT => c.enemies.get(id)!;
export const gearOf = (id: string): GearT => c.gear.get(id)!;
export const kindOf = (id: string): WeaponKindT => c.weaponKinds.get(id)!;
export const elementName = (id: string): string => c.pack.elements.find((e) => e.id === id)?.name ?? id;

// ─── Names and codes ───

const SHORT: Record<string, string> = { bramble_knight: "BRAMBLE", pyromancer: "PYRO", frostweaver: "FROST", stormcaller: "STORM", geomancer: "GEO" };
/** A class's name in eight letters or fewer, for narrow cells. */
export const shortName = (id: string): string => SHORT[id] ?? (c.classes.get(id)?.name ?? id).toUpperCase();
/** A class's full name, as the messages and sheets use it. */
export const className = (id: string): string => c.classes.get(id)?.name ?? id;
/** A run's name without its "Run N:" prefix, a fight's without its number. */
export const runName = (d: DungeonT) => d.name.replace(/^Run \d+: /, "");
export const fightName = (s: { name?: string; id: string }) => (s.name ?? s.id).replace(/^\d+\. /, "");

export const STAT_CODE: Record<string, string> = {
  max_hp: "HP", max_mp: "MP", mp_regen: "REG", attack: "ATK", magic: "MAG", armor: "ARM", crit_chance: "CRT", aggro: "AGG",
  evasion: "EVA", accuracy: "ACC", crit_multiplier: "CRD", double_strike: "DBL", thorns: "THN", lifesteal: "LFS", siphon: "SPH",
  healing_received: "HEAL", attack_speed: "SPD", cooldown_reduction: "CDR", cast_time_reduction: "CAST", resist: "RES",
};
export const ELEMENT_CODE: Record<string, string> = { fire: "FIRE", ice: "ICE", lightning: "LTNG", wind: "WIND", earth: "EARTH", light: "LIGHT", dark: "DARK" };
export function statCode(key: string): string {
  if (STAT_CODE[key]) return STAT_CODE[key];
  if (key.startsWith("resist:")) return ELEMENT_CODE[key.slice(7)] ?? key.slice(7).toUpperCase();
  if (key.startsWith("immune:")) return `NO ${key.slice(7).toUpperCase()}`;
  return key.toUpperCase().slice(0, 4);
}
const STATUS_CODE: Record<string, string> = {
  poison: "PSN", regen: "RGN", shield: "SHD", might: "MGT", weaken: "WKN", guard: "GRD", stun: "STN", slow: "SLW", haste: "HST", taunt: "TNT",
  burn: "BRN", chill: "CHL", shock: "SHK", ward: "WRD", sunder: "SND", silence: "SIL", hidden: "HID", rot: "ROT", clarity: "CLR", aegis: "AEG",
  doom: "DOOM", bulwark: "BLW", bulwark_broken: "BRK", ice_crust: "CRST", shadow_strike_on: "SHDW", bloodlust_on: "BLD", bedrock_on: "BED",
};
export const statusCode = (id: string): string => STATUS_CODE[id] ?? (c.statuses.get(id)?.name ?? id).replace(/[^a-z]/gi, "").slice(0, 4).toUpperCase();

/** A stat's value as shown: amounts at the display scale, percent stats as they are. */
export function showStat(key: string, v: number): string {
  const def = c.stats.get(key);
  if (key === "crit_chance" || def?.kind === "points" || key.startsWith("resist")) return `${Math.round(v)}%`;
  return `${disp(v)}`;
}
/** The sheet's stats, in order. */
export const SHEET_STATS = ["max_hp", "max_mp", "mp_regen", "attack", "magic", "armor", "crit_chance", "aggro"];
export const SPECIAL_STATS = ["evasion", "accuracy", "crit_multiplier", "double_strike", "thorns", "lifesteal", "siphon", "healing_received", "attack_speed", "cooldown_reduction", "cast_time_reduction"];
