/**
 * The 90 pieces of gear (docs/core-set/gear-and-formation-lists.md): 13 plain
 * weapons, 33 named ones, 7 powerful ones; 14 ordinary and 3 powerful armors;
 * 16 ordinary and 4 powerful amulets.
 */
import type { GearT, NumT, WeightT } from "../../src/schema.js";
import { KIND_SPEED, PER_PERCENT, RESIST, SPECIAL, SPECIAL_KEY, stepFor, SWING_REF, WEAPON, crit, type Level, type SpecialLevel, type SpecialStat } from "./scale.js";
import { weaponKinds } from "./vocabulary.js";

type Change = { stat: string; flat: number };
/** A gear step: +1 or +2 on a stat, in the data's units. */
const st = (stat: string, n: number): Change => ({ stat, flat: n * stepFor(stat) });
const critStep = (n: number): Change => ({ stat: "crit_chance", flat: crit(n) });
const sp = (s: SpecialStat, level: SpecialLevel): Change => ({ stat: SPECIAL_KEY[s], flat: SPECIAL[s][level] });
const resists = (...elements: string[]): Change[] => elements.map((e) => ({ stat: `resist:${e}`, flat: RESIST.gear }));

/** A weapon's hit: its kind's speed factor × (base + ratio × stat). */
export function weaponHit(kind: string, base: Level, ratio: Level, stat: string): NumT {
  // Pacing pass: the size follows the kind's own cooldown (it was a factor for each of three speed words).
  const f = KIND_SPEED[kind] / SWING_REF;
  return { base: Math.round(f * WEAPON.base[base]), scale: [{ ratio: f * WEAPON.ratio[ratio] * (PER_PERCENT[stat] ?? 1), stat }] };
}
const usual = (kind: string) => (weaponKinds.find((k) => k.id === kind)!.type === "magical" ? "magic" : "attack");

const weapon = (id: string, name: string, text: string, kind: string, o: { base?: Level; ratio?: Level; stat?: string; carries?: Change[]; tier?: GearT["tier"]; source?: GearT["source"] } = {}): GearT => ({
  id, name, text, slot: "weapon", tier: o.tier ?? "ordinary", source: o.source ?? "drop",
  weapon: { kind, amount: weaponHit(kind, o.base ?? "medium", o.ratio ?? "medium", o.stat ?? usual(kind)) },
  ...(o.carries?.length ? { stats: o.carries } : {}),
});
const armor = (id: string, name: string, text: string, weight: WeightT, carries: Change[], tier: GearT["tier"] = "ordinary"): GearT => ({
  id, name, text, slot: "armor", tier, source: tier === "powerful" ? "unlock" : "drop", weight, stats: carries,
});
const amulet = (id: string, name: string, text: string, carries: Change[], tier: GearT["tier"] = "ordinary"): GearT => ({
  id, name, text, slot: "amulet", tier, source: tier === "powerful" ? "unlock" : "drop", stats: carries,
});

// ─── Weapons ─────────────────────────────────────────────────────────────────

/** One plain weapon per kind: medium damage and ratio, the kind's usual stat, nothing carried. Each class arrives with its first kind's. */
const plain: GearT[] = weaponKinds.map((k) => weapon(`plain_${k.id}`, k.name, `A plain ${k.name.toLowerCase()}.`, k.id, { source: "starter" }));

const named: GearT[] = [
  weapon("fang", "Fang", "The plain damage dagger: its Attack counts twice.", "dagger", { carries: [st("attack", 2)] }),
  weapon("stiletto", "Stiletto", "Finds the gaps.", "dagger", { carries: [sp("accuracy", "medium"), st("attack", 1)] }),
  weapon("bodkin", "Bodkin", "A needle point for crits.", "dagger", { carries: [critStep(1), sp("crit_damage", "medium")] }),
  weapon("paired_cestus", "Paired cestus", "Two fists, twice the strikes.", "fist", { carries: [sp("double_strike", "medium"), st("attack", 1)] }),
  weapon("bloodied_claws", "Bloodied claws", "Drinks a little of every wound.", "fist", { carries: [sp("lifesteal", "medium"), st("max_hp", 1)] }),
  weapon("tiger_claws", "Tiger claws", "Light on the feet, sharp on the mark.", "fist", { carries: [sp("evasion", "medium"), critStep(1)] }),
  weapon("wardens_blade", "Warden's blade", "A wall's sword.", "sword", { carries: [st("armor", 1), st("aggro", 1)] }),
  weapon("oathblade", "Oathblade", "Sworn to stand.", "sword", { carries: [st("max_hp", 2)] }),
  weapon("duellists_sword", "Duellist's sword", "Quick and precise.", "sword", { carries: [critStep(1), st("attack", 1)] }),
  weapon("crusader_sword", "Crusader sword", "Steel and faith in one hand.", "sword", { carries: [st("attack", 1), st("magic", 1)] }),
  weapon("warbow", "Warbow", "Every arrow scales from Attack, and the bow counts it twice.", "bow", { carries: [st("attack", 2)] }),
  weapon("longbow", "Longbow", "Heavier arrows, harder crits.", "bow", { carries: [sp("crit_damage", "medium"), st("attack", 1)] }),
  weapon("minstrels_bow", "Minstrel's bow", "Plays while it shoots.", "bow", { carries: [st("magic", 1), st("mp_regen", 1)] }),
  weapon("pike", "Pike", "A big base, a small ratio: the one spear where the damage matters more than the stat.", "spear", { base: "high", ratio: "low", carries: [sp("crit_damage", "medium")] }),
  weapon("sentinel_spear", "Sentinel spear", "Holds the line.", "spear", { carries: [st("aggro", 1), st("armor", 1)] }),
  weapon("skyspear", "Skyspear", "Storm and Light at once.", "spear", { carries: [st("attack", 1), st("magic", 1)] }),
  weapon("rune_axe", "Rune axe", "Carved for crits.", "axe", { carries: [critStep(1), st("attack", 1)] }),
  weapon("splitter", "Splitter", "Slow, heavy, and it carries plate.", "axe", { base: "high", ratio: "low", carries: [st("armor", 1)] }),
  weapon("brand_staff", "Brand staff", "Fire, and more of it.", "fire_staff", { carries: [st("magic", 2)] }),
  weapon("ember_staff", "Ember staff", "Slow burn.", "fire_staff", { carries: [st("mp_regen", 2)] }),
  weapon("storm_rod", "Storm rod", "Lightning, and more of it.", "lightning_staff", { carries: [st("magic", 2)] }),
  weapon("grounding_rod", "Grounding rod", "Survives, and draws less.", "lightning_staff", { carries: [st("max_hp", 1), st("aggro", -1)] }),
  weapon("zephyr_staff", "Zephyr staff", "Two gusts for one.", "wind_staff", { carries: [sp("double_strike", "medium"), st("magic", 1)] }),
  weapon("tailwind_staff", "Tailwind staff", "Keeps the mana flowing.", "wind_staff", { carries: [st("mp_regen", 2)] }),
  weapon("granite_staff", "Granite staff", "Stone in hand.", "earth_staff", { carries: [st("armor", 1), st("magic", 1)] }),
  weapon("rootstaff", "Rootstaff", "Thorns on living wood.", "earth_staff", { carries: [sp("thorns", "medium"), st("max_hp", 1)] }),
  weapon("rime_staff", "Rime staff", "Deep freeze.", "ice_staff", { carries: [st("magic", 2)] }),
  weapon("hoarfrost_staff", "Hoarfrost staff", "A wellspring of mana.", "ice_staff", { carries: [st("mp_regen", 2)] }),
  weapon("sunstaff", "Sunstaff", "A crit heals more through Mercy.", "light_staff", { carries: [critStep(1), st("magic", 1)] }),
  weapon("dawn_staff", "Dawn staff", "A heavy staff and nothing else: its damage is healing in a Cleric's hands.", "light_staff", { base: "high" }),
  weapon("chapel_staff", "Chapel staff", "For the pilgrim.", "light_staff", { carries: [st("mp_regen", 2)] }),
  weapon("nightstaff", "Nightstaff", "Dark, and more of it.", "dark_staff", { carries: [st("magic", 2)] }),
  weapon("leech_staff", "Leech staff", "Drinks mana.", "dark_staff", { carries: [sp("siphon", "medium"), st("mp_regen", 1)] }),
];

/** Powerful weapons scale from a stat other than Attack or Magic, and carry nothing: the stat is the point. */
const powerfulWeapons: GearT[] = [
  weapon("heartwood_staff", "Heartwood staff", "Earth hits from the HP the Deep roots fork stacks.", "earth_staff", { stat: "max_hp", tier: "powerful", source: "unlock" }),
  weapon("sanguine_staff", "Sanguine staff", "Blood as a caster: Blood drain and basic attacks on one stat.", "dark_staff", { stat: "max_hp", tier: "powerful", source: "unlock" }),
  weapon("cornerstone_axe", "Cornerstone axe", "Stone on one stat: everything from Armor.", "axe", { stat: "armor", tier: "powerful", source: "unlock" }),
  weapon("needle", "Needle", "Backstab and basic attacks share a stat: every Crit piece raises both.", "dagger", { stat: "crit_chance", tier: "powerful", source: "unlock" }),
  weapon("mist_claws", "Mist claws", "Evasion is defense and damage.", "fist", { stat: "evasion", tier: "powerful", source: "unlock" }),
  weapon("glacier_staff", "Glacier staff", "The MP pool is also damage. Scales from max MP, so casting doesn't shrink it.", "ice_staff", { stat: "max_mp", tier: "powerful", source: "unlock" }),
  weapon("templar_staff", "Templar staff", "Light basic attacks from Armor: staff and plate.", "light_staff", { stat: "armor", tier: "powerful", source: "unlock" }),
];

// ─── Armor ───────────────────────────────────────────────────────────────────

const armors: GearT[] = [
  armor("plate", "Plate", "Heavy and whole.", "heavy", [st("armor", 1), st("max_hp", 1)]),
  armor("bastion_plate", "Bastion plate", "Nothing but armor.", "heavy", [st("armor", 2)]),
  armor("tower_mail", "Tower mail", "Nothing but health.", "heavy", [st("max_hp", 2)]),
  armor("thorn_mail", "Thorn mail", "Spiked, and hard to ignore.", "heavy", [sp("thorns", "medium"), st("aggro", 1)]),
  armor("ashen_plate", "Ashen plate", "Forged against fire.", "heavy", [...resists("fire"), st("armor", 1)]),
  armor("brigandine", "Brigandine", "Built for hitting.", "medium", [st("attack", 2)]),
  armor("scout_leathers", "Scout leathers", "Light enough to dodge in.", "medium", [sp("evasion", "medium"), st("attack", 1)]),
  armor("trackers_jerkin", "Tracker's jerkin", "Finds and marks.", "medium", [sp("accuracy", "medium"), critStep(1)]),
  armor("scale_coat", "Scale coat", "Sturdy all round.", "medium", [st("max_hp", 1), st("armor", 1)]),
  armor("duskhide", "Duskhide", "Shades against the light.", "medium", [...resists("light"), st("max_hp", 1)]),
  armor("robes", "Robes", "The caster's default.", "light", [st("magic", 2)]),
  armor("vestments", "Vestments", "For the long dungeon.", "light", [st("max_mp", 1), st("mp_regen", 1)]),
  armor("shadowsilk", "Shadowsilk", "A little less Magic, a few fewer hits.", "light", [st("magic", 1), st("aggro", -1)]),
  armor("quiet_cloak", "Quiet cloak", "Lasts the dungeon by being hit less and running dry later.", "light", [st("mp_regen", 1), st("aggro", -1)]),
  armor("thornheart_plate", "Thornheart plate", "A wall of thorns that draws everything and relies on them, so the plate is thinner.", "heavy", [sp("thorns", "high"), st("aggro", 2), st("armor", -1)], "powerful"),
  armor("wraith_leathers", "Wraith leathers", "Not getting hit is the only defense left.", "medium", [sp("evasion", "high"), st("max_hp", -1)], "powerful"),
  armor("archmages_robes", "Archmage's robes", "More and longer than Robes, and the obvious target for it.", "light", [st("magic", 2), st("mp_regen", 1), st("aggro", 1)], "powerful"),
];

// ─── Amulets ─────────────────────────────────────────────────────────────────

const amulets: GearT[] = [
  amulet("twinned_charm", "Twinned charm", "Strikes twice, crits more.", [sp("double_strike", "medium"), critStep(1)]),
  amulet("serrated_charm", "Serrated charm", "The burst dealer that stays out of sight.", [sp("crit_damage", "medium"), st("aggro", -1)]),
  amulet("bloodstone", "Bloodstone", "A little drain, a little more life.", [sp("lifesteal", "medium"), st("max_hp", 1)]),
  amulet("mana_leech", "Mana leech", "Drinks mana and makes more.", [sp("siphon", "medium"), st("mp_regen", 1)]),
  amulet("thorn_charm", "Thorn charm", "Spikes, and the attention they deserve.", [sp("thorns", "medium"), st("aggro", 1)]),
  amulet("hawks_eye", "Hawk's eye", "Nothing dodges for long.", [sp("accuracy", "medium"), critStep(1)]),
  amulet("feather_charm", "Feather charm", "Slips hits and draws few.", [sp("evasion", "medium"), st("aggro", -1)]),
  amulet("prayer_beads", "Prayer beads", "For the long run.", [st("mp_regen", 2)]),
  amulet("mana_jewel", "Mana jewel", "The pool for the costly casts.", [st("max_mp", 2)]),
  amulet("heartstone", "Heartstone", "Feeds Regen and the Shield cap on anyone.", [st("max_hp", 2)]),
  amulet("lucky_coin", "Lucky coin", "Crits, and nothing else.", [critStep(2)]),
  amulet("warhorn", "Warhorn", "Every foe hears it.", [st("aggro", 2)]),
  amulet("veil", "Veil", "The fragile unit steps out of the line.", [st("aggro", -2)]),
  amulet("sun_charm", "Sun charm", "Against bright casters.", resists("fire", "lightning", "light")),
  amulet("moon_charm", "Moon charm", "Against cold and night.", resists("ice", "dark", "wind")),
  amulet("mountain_charm", "Mountain charm", "Against the ground's elements.", resists("earth", "fire", "ice")),
  amulet("twin_soul_charm", "Twin-soul charm", "Hits twice and drains on both.", [sp("double_strike", "medium"), sp("lifesteal", "medium")], "powerful"),
  amulet("vampires_tooth", "Vampire's tooth", "Living by the drain.", [sp("lifesteal", "high"), st("max_hp", -1)], "powerful"),
  amulet("thirsting_jewel", "Thirsting jewel", "Every hit refills what the regen no longer does.", [sp("siphon", "high"), st("mp_regen", -1)], "powerful"),
  amulet("glass_heart", "Glass heart", "The crit build in one piece, at the cost of the HP a crit build never has to spare.", [critStep(2), sp("crit_damage", "medium"), st("max_hp", -1)], "powerful"),
];

export const gear: GearT[] = [...plain, ...named, ...powerfulWeapons, ...armors, ...amulets];
