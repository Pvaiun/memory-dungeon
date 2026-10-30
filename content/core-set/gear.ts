/**
 * The 85 pieces of gear (docs/core-set/gear-and-formation-lists.md): 11 plain
 * weapons, 33 named ones, 7 powerful ones; 14 ordinary and 3 powerful armors;
 * 13 ordinary and 4 powerful amulets.
 *
 * Step 5j (the cleanup, no balancing): every elemental resistance stripped (the
 * three charms that had nothing else dropped), the pieces re-sorted into the
 * eleven weapon kinds (the fast staves to the wand, the slow ones to the staff,
 * the Light staff to the mace, the axe to the great weapon) and the four armor
 * types (heavy to Plate, light to Robes, each medium piece to Leather or Mail by
 * what it is). Names stay; texts that would now be false are rewritten. The
 * offhand slot has no pieces yet: the next pass makes them.
 */
import type { GearT, NumT } from "../../src/schema.js";
import { KIND_SPEED, PER_PERCENT, SPECIAL, SPECIAL_KEY, stepFor, SWING_REF, WEAPON, crit, type Level, type SpecialLevel, type SpecialStat } from "./scale.js";
import { weaponKinds } from "./vocabulary.js";

type Change = { stat: string; flat: number };
/** A gear step: +1 or +2 on a stat, in the data's units. */
const st = (stat: string, n: number): Change => ({ stat, flat: n * stepFor(stat) });
const critStep = (n: number): Change => ({ stat: "crit_chance", flat: crit(n) });
const sp = (s: SpecialStat, level: SpecialLevel): Change => ({ stat: SPECIAL_KEY[s], flat: SPECIAL[s][level] });

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
const armor = (id: string, name: string, text: string, type: string, carries: Change[], tier: GearT["tier"] = "ordinary"): GearT => ({
  id, name, text, slot: "armor", tier, source: tier === "powerful" ? "unlock" : "drop", armor: type, stats: carries,
});
const amulet = (id: string, name: string, text: string, carries: Change[], tier: GearT["tier"] = "ordinary"): GearT => ({
  id, name, text, slot: "amulet", tier, source: tier === "powerful" ? "unlock" : "drop", stats: carries,
});

// ─── Weapons ─────────────────────────────────────────────────────────────────

/** One plain weapon per kind (step 5j: eleven): medium damage and ratio, the kind's usual stat, nothing carried. Each class arrives with its first kind's. */
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
  weapon("skyspear", "Skyspear", "Steel and spell at once.", "spear", { carries: [st("attack", 1), st("magic", 1)] }),
  weapon("rune_axe", "Rune axe", "Carved for crits.", "great_weapon", { carries: [critStep(1), st("attack", 1)] }),
  weapon("splitter", "Splitter", "Slow, heavy, and it carries plate.", "great_weapon", { base: "high", ratio: "low", carries: [st("armor", 1)] }),
  weapon("brand_staff", "Brand staff", "A hotter flame: more Magic.", "staff", { carries: [st("magic", 2)] }),
  weapon("ember_staff", "Ember staff", "Slow burn.", "staff", { carries: [st("mp_regen", 2)] }),
  weapon("storm_rod", "Storm rod", "A louder storm: more Magic.", "wand", { carries: [st("magic", 2)] }),
  weapon("grounding_rod", "Grounding rod", "Survives, and draws less.", "wand", { carries: [st("max_hp", 1), st("aggro", -1)] }),
  weapon("zephyr_staff", "Zephyr staff", "Two gusts for one.", "wand", { carries: [sp("double_strike", "medium"), st("magic", 1)] }),
  weapon("tailwind_staff", "Tailwind staff", "Keeps the mana flowing.", "wand", { carries: [st("mp_regen", 2)] }),
  weapon("granite_staff", "Granite staff", "Stone in hand.", "staff", { carries: [st("armor", 1), st("magic", 1)] }),
  weapon("rootstaff", "Rootstaff", "Thorns on living wood.", "staff", { carries: [sp("thorns", "medium"), st("max_hp", 1)] }),
  weapon("rime_staff", "Rime staff", "Deep freeze.", "wand", { carries: [st("magic", 2)] }),
  weapon("hoarfrost_staff", "Hoarfrost staff", "A wellspring of mana.", "wand", { carries: [st("mp_regen", 2)] }),
  weapon("sunstaff", "Sunstaff", "Crits, and more Magic.", "mace", { carries: [critStep(1), st("magic", 1)] }),
  weapon("dawn_staff", "Dawn staff", "Heavy, and nothing else.", "mace", { base: "high" }),
  weapon("chapel_staff", "Chapel staff", "For the pilgrim.", "mace", { carries: [st("mp_regen", 2)] }),
  weapon("nightstaff", "Nightstaff", "A longer night: more Magic.", "wand", { carries: [st("magic", 2)] }),
  weapon("leech_staff", "Leech staff", "Drinks mana.", "wand", { carries: [sp("siphon", "medium"), st("mp_regen", 1)] }),
];

/** Powerful weapons scale from a stat other than Attack or Magic, and carry nothing: the stat is the point. */
const powerfulWeapons: GearT[] = [
  weapon("heartwood_staff", "Heartwood staff", "Hits that scale from max HP.", "staff", { stat: "max_hp", tier: "powerful", source: "unlock" }),
  weapon("sanguine_staff", "Sanguine staff", "Basic attacks that scale from max HP.", "wand", { stat: "max_hp", tier: "powerful", source: "unlock" }),
  weapon("cornerstone_axe", "Cornerstone axe", "Stone on one stat: everything from Armor.", "great_weapon", { stat: "armor", tier: "powerful", source: "unlock" }),
  weapon("needle", "Needle", "Backstab and basic attacks share a stat: every Crit piece raises both.", "dagger", { stat: "crit_chance", tier: "powerful", source: "unlock" }),
  weapon("mist_claws", "Mist claws", "Evasion is defense and damage.", "fist", { stat: "evasion", tier: "powerful", source: "unlock" }),
  weapon("glacier_staff", "Glacier staff", "The MP pool is also damage. Scales from max MP, so casting doesn't shrink it.", "wand", { stat: "max_mp", tier: "powerful", source: "unlock" }),
  weapon("templar_staff", "Templar staff", "Basic attacks that scale from Armor.", "mace", { stat: "armor", tier: "powerful", source: "unlock" }),
];

// ─── Armor ───────────────────────────────────────────────────────────────────

const armors: GearT[] = [
  armor("plate", "Plate", "Heavy and whole.", "plate", [st("armor", 1), st("max_hp", 1)]),
  armor("bastion_plate", "Bastion plate", "Nothing but armor.", "plate", [st("armor", 2)]),
  armor("tower_mail", "Tower mail", "Nothing but health.", "plate", [st("max_hp", 2)]),
  armor("thorn_mail", "Thorn mail", "Spiked, and hard to ignore.", "plate", [sp("thorns", "medium"), st("aggro", 1)]),
  armor("ashen_plate", "Ashen plate", "Forged in ash.", "plate", [st("armor", 1)]),
  armor("brigandine", "Brigandine", "Built for hitting.", "mail", [st("attack", 2)]),
  armor("scout_leathers", "Scout leathers", "Light enough to dodge in.", "leather", [sp("evasion", "medium"), st("attack", 1)]),
  armor("trackers_jerkin", "Tracker's jerkin", "Finds and marks.", "leather", [sp("accuracy", "medium"), critStep(1)]),
  armor("scale_coat", "Scale coat", "Sturdy all round.", "mail", [st("max_hp", 1), st("armor", 1)]),
  armor("duskhide", "Duskhide", "A dark hide.", "leather", [st("max_hp", 1)]),
  armor("robes", "Robes", "The caster's default.", "robes", [st("magic", 2)]),
  armor("vestments", "Vestments", "For the long dungeon.", "robes", [st("max_mp", 1), st("mp_regen", 1)]),
  armor("shadowsilk", "Shadowsilk", "A little less Magic, a few fewer hits.", "robes", [st("magic", 1), st("aggro", -1)]),
  armor("quiet_cloak", "Quiet cloak", "Lasts the dungeon by being hit less and running dry later.", "robes", [st("mp_regen", 1), st("aggro", -1)]),
  armor("thornheart_plate", "Thornheart plate", "A wall of thorns that draws everything and relies on them, so the plate is thinner.", "plate", [sp("thorns", "high"), st("aggro", 2), st("armor", -1)], "powerful"),
  armor("wraith_leathers", "Wraith leathers", "Not getting hit is the only defense left.", "leather", [sp("evasion", "high"), st("max_hp", -1)], "powerful"),
  armor("archmages_robes", "Archmage's robes", "More and longer than Robes, and the obvious target for it.", "robes", [st("magic", 2), st("mp_regen", 1), st("aggro", 1)], "powerful"),
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
  amulet("twin_soul_charm", "Twin-soul charm", "Hits twice and drains on both.", [sp("double_strike", "medium"), sp("lifesteal", "medium")], "powerful"),
  amulet("vampires_tooth", "Vampire's tooth", "Living by the drain.", [sp("lifesteal", "high"), st("max_hp", -1)], "powerful"),
  amulet("thirsting_jewel", "Thirsting jewel", "Every hit refills what the regen no longer does.", [sp("siphon", "high"), st("mp_regen", -1)], "powerful"),
  amulet("glass_heart", "Glass heart", "The crit build in one piece, at the cost of the HP a crit build never has to spare.", [critStep(2), sp("crit_damage", "medium"), st("max_hp", -1)], "powerful"),
];

export const gear: GearT[] = [...plain, ...named, ...powerfulWeapons, ...armors, ...amulets];
