/**
 * The content the interface shows: the core set pack, loaded once, with the
 * single fights of every dungeon added as one-stage dungeons ("dungeon~stage"),
 * and the display scale. The data stores amounts at 1,000 per point of the
 * documents' relative scale; the interface shows them at 100 per point, so a
 * Knight has 500 HP and a sword hits for about 110.
 */
import raw from "../../content/core-set.pack.json";
import { build } from "../../src/sim/content.js";
import type { Content } from "../../src/engine/run.js";
import type { AbilityT, ClassDefT, DungeonT, EnemyT, FormationT, GearT, StatusT, WeaponKindT } from "../../src/schema.js";

export const DISPLAY_DIV = 10;
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
export const statName = (key: string): string => {
  const d = c.stats.get(key);
  if (d) return d.name;
  if (key.startsWith("resist:")) return `${elementName(key.slice(7))} resistance`;
  if (key.startsWith("immune:")) return `Immune: ${key.slice(7).replace(/:/g, " ")}`;
  return key;
};
export const elementName = (id: string): string => c.pack.elements.find((e) => e.id === id)?.name ?? id;

/** Stats that show on a sheet, in order, with how they're displayed. */
export type StatShow = { key: string; name: string; kind: "amount" | "percent" | "points" | "hidden" };
export const SHEET_STATS: StatShow[] = [
  { key: "max_hp", name: "HP", kind: "amount" },
  { key: "max_mp", name: "MP", kind: "amount" },
  { key: "mp_regen", name: "MP regen", kind: "amount" },
  { key: "attack", name: "Attack", kind: "amount" },
  { key: "magic", name: "Magic", kind: "amount" },
  { key: "armor", name: "Armor", kind: "amount" },
  { key: "crit_chance", name: "Crit chance", kind: "percent" },
  { key: "aggro", name: "Aggro", kind: "amount" },
];
export const SPECIAL_STATS: StatShow[] = [
  { key: "evasion", name: "Evasion", kind: "percent" },
  { key: "accuracy", name: "Accuracy", kind: "percent" },
  { key: "crit_multiplier", name: "Crit damage", kind: "percent" },
  { key: "double_strike", name: "Double strike", kind: "percent" },
  { key: "thorns", name: "Thorns", kind: "amount" },
  { key: "lifesteal", name: "Lifesteal", kind: "percent" },
  { key: "siphon", name: "Siphon", kind: "percent" },
  { key: "healing_received", name: "Healing received", kind: "percent" },
  { key: "attack_speed", name: "Attack speed", kind: "percent" },
  { key: "cooldown_reduction", name: "Cooldown reduction", kind: "percent" },
  { key: "cast_time_reduction", name: "Cast speed", kind: "percent" },
];

/** A stat's value, as the sheet shows it: amounts in display units with the relative points beside. */
export function showStat(key: string, v: number, kind: StatShow["kind"]): string {
  if (kind === "amount") return `${disp(v)}`;
  if (kind === "percent") return `${Math.round(v)}%`;
  return String(v);
}
