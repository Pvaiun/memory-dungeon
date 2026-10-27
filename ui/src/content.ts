/**
 * The content the interface shows: the core set pack, loaded once, with the
 * single fights of every dungeon added as one-stage dungeons ("dungeon~stage"),
 * the display scale, and the short names and codes the Game Boy layout uses.
 * The data stores amounts at 1,000 per point of the documents' relative scale;
 * the interface shows 30 per point by default (a Knight has 120 HP, a sword
 * hits for about 24), or 10 or 100 per point (Settings → NUMBERS).
 */
import raw from "../../content/core-set.pack.json";
import { build } from "../../src/sim/content.js";
import type { Content } from "../../src/engine/run.js";
import type { AbilityT, ClassDefT, DungeonT, EnemyT, FormationT, GearT, StatusT, WeaponKindT } from "../../src/schema.js";

/**
 * The NUMBERS setting: how many times the documents' scale the numbers show, ×1 being 10 a point (the Knight's HP 4
 * shows as 40). Measured over the campaign's runs, the share of status ticks and of heals that show as 1 or 0: ×1, 23%
 * and 46%; ×1.6, 17% and 38%; ×2, 15% and 23%; ×2.5, 6% and 2%; ×3 (the default, a basic hit near 24), 4% and 2%.
 */
export const NUMBER_SCALES = [1, 1.3, 1.6, 2, 2.5, 3, 4, 5, 10] as const;
export const DEFAULT_NUMBERS = 3;
export let DISPLAY_DIV = 100 / DEFAULT_NUMBERS;
export const setNumberScale = (m: number) => { DISPLAY_DIV = 100 / (m > 0 ? m : DEFAULT_NUMBERS); };
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
/**
 * Each class in one sentence, for its sheet's head, the class list and the celebration. The interface's own words:
 * the content's text opens with a role word ("Curser.", "Healer.") that read as a label, not a line.
 */
const TAGLINE: Record<string, string> = {
  knight: "Guards the weakest ally and pulls foes onto itself.",
  cleric: "Keeps the party standing with quick heals and Regen.",
  ranger: "Wears down tough foes with barbed and burning arrows.",
  bramble_knight: "Draws foes onto its thorns and leaves them bleeding.",
  hoplite: "Shields the most vulnerable ally and cracks armor.",
  paladin: "Wards the party against magic and smites the strong.",
  valkyrie: "A storm spear that heals and brings back the fallen.",
  bard: "Speeds up and empowers the party, and shocks every foe.",
  hexer: "Curses the most dangerous foe into a crawl.",
  monk: "Breaks armor with a fast blur of blows.",
  assassin: "Picks off the weakest foe and leaves it bleeding.",
  vampire: "Drains life with every hit to outlast the fight.",
  pyromancer: "Piles Burn onto foes, then makes the hottest one pay.",
  frostweaver: "Buries foes in Chill and hits harder the colder they are.",
  stormcaller: "Rains lightning on every foe and charges itself up.",
  geomancer: "Hides behind stone and hits hardest while it holds.",
};
export const tagline = (id: string): string => TAGLINE[id] ?? (c.classes.get(id)?.text ?? "").split(".")[0];
/** The content piece a gear id stands for: itself, or for a rogue run's item (keyed by its own id) the base piece it was rolled from. */
export function baseGearId(id: string): string {
  const note = c.gear.get(id)?.note;
  const m = note && /^rogue \w+: (\w+)/.exec(note);
  return m ? m[1] : id;
}

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
  bleed: "BLD", regen: "RGN", shield: "SHD", might: "MGT", weaken: "WKN", guard: "GRD", stun: "STN", slow: "SLW", haste: "HST", taunt: "TNT",
  burn: "BRN", chill: "CHL", shock: "SHK", ward: "WRD", sunder: "SND", silence: "SIL", hidden: "HID", rot: "ROT", clarity: "CLR", aegis: "AEG",
  doom: "DOOM", bulwark: "BLW", bulwark_broken: "BRK", ice_crust: "CRST", bloodlust_on: "LUST", bedrock_on: "BED",
};
export const statusCode = (id: string): string => STATUS_CODE[id] ?? (c.statuses.get(id)?.name ?? id).replace(/[^a-z]/gi, "").slice(0, 4).toUpperCase();

/** A stat's value as shown: amounts at the display scale, percent stats as they are. */
export function showStat(key: string, v: number): string {
  const def = c.stats.get(key);
  if (key === "crit_chance" || def?.kind === "points" || key.startsWith("resist")) return `${Math.round(v)}%`;
  // Aggro is on its own scale, centred on 100 (the director's rule): shown as it is.
  if (key === "aggro") return `${Math.round(v)}`;
  return `${disp(v)}`;
}
/** The sheet's stats, in order. */
export const SHEET_STATS = ["max_hp", "max_mp", "mp_regen", "attack", "magic", "armor", "crit_chance", "aggro"];
export const SPECIAL_STATS = ["evasion", "accuracy", "crit_multiplier", "double_strike", "thorns", "lifesteal", "siphon", "healing_received", "attack_speed", "cooldown_reduction", "cast_time_reduction"];
