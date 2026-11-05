/**
 * The core set's vocabulary (docs/core-set/rules-and-vocabulary.md): the stat
 * registry, weapon kinds, armor types and offhand kinds, the 22 statuses, the
 * statuses that special stats bring, the ruleset and the design block.
 */
import type { ContentPack, GearKindT, StatDefT, StatusT, WeaponKindT } from "../../src/schema.js";
import { KIND_SPEED, MP_REGEN, P, RULES, SPEED, STATUS, pts } from "./scale.js";

const TIMING = ["attack_speed", "cooldown_reduction", "cast_time_reduction"] as const;

export const stats: StatDefT[] = [
  // A floor of half a point, so stacked HP cuts can't take a unit to 0 max HP.
  { id: "max_hp", name: "HP", kind: "amount", default: pts(1), floor: pts(1) / 2 },
  { id: "max_mp", name: "MP", kind: "amount", default: 0, floor: 0 },
  { id: "mp_regen", name: "MP regen", kind: "amount", default: 0, floor: 0, brings: "mp_regen", note: `MP restored every ${MP_REGEN.every} ticks, through the status it brings.` },
  { id: "attack", name: "Attack", kind: "amount", default: 0, floor: 0 },
  { id: "defense", name: "Defense", kind: "amount", default: 0, floor: 0, note: `A hit deals hit² ÷ (hit + ${RULES.armorK} × Defense): nearly linear against big hits, never a blank. A status's own damage never meets it.` },
  { id: "aggro", name: "Aggro", kind: "amount", default: 100, floor: 1, note: "Centred on 100 (a word n is 70 + 10n, a gear or formation step 10), never below 1. Foes pick party members by draw from ruleset.partyDraw: an ordinary unit draws 100, and every 25 Aggro doubles it (halves it below 100), from Aggro 25 (12.5) to 200 (1,600). The party picks among foes by ruleset.draw's curve: none draws more than 300 or less than 33." },
  { id: "attack_speed", name: "Attack speed", kind: "points", default: 0, floor: -300, cap: 300, note: "Hidden behind Haste, Slow and Chill." },
  { id: "cooldown_reduction", name: "Cooldown reduction", kind: "points", default: 0, floor: -300, cap: 300, note: "Hidden behind Haste, Slow and Chill." },
  { id: "cast_time_reduction", name: "Cast time reduction", kind: "points", default: 0, floor: -300, cap: 300, note: "Hidden behind Haste, Slow and Chill." },
  { id: "crit_chance", name: "Crit chance", kind: "points", default: 0, floor: 0, cap: 100 },
  { id: "crit_multiplier", name: "Crit damage", kind: "points", default: 150, floor: 100 },
  { id: "evasion", name: "Evasion", kind: "points", default: 0, floor: 0, cap: 75, note: "The cap is a placeholder, meant to sit far out of reach." },
  { id: "accuracy", name: "Accuracy", kind: "points", default: 0 },
  { id: "healing_received", name: "Healing received", kind: "points", default: 0, floor: -100 },
  { id: "forced", name: "Taunting", kind: "points", default: 0, floor: 0 },
  { id: "forbidden", name: "Hidden", kind: "points", default: 0, floor: 0 },
  { id: "thorns", name: "Thorns", kind: "amount", default: 0, floor: 0, brings: "thorns" },
  { id: "lifesteal", name: "Lifesteal", kind: "points", default: 0, floor: 0, brings: "lifesteal" },
  { id: "siphon", name: "Siphon", kind: "points", default: 0, floor: 0, brings: "siphon" },
  { id: "double_strike", name: "Double strike", kind: "points", default: 0, floor: 0, cap: 100, brings: "double_strike" },
  { id: "power", name: "Power", kind: "points", default: 0, floor: -90, note: "Damage dealt by hits and reactions, +%. Only a dungeon's foes modifier sets it: how a fight's knob makes its foes hit harder." },
];

/** Eleven weapon kinds, each a speed, a damage type and hands (rules-and-vocabulary.md, Gear). */
export const weaponKinds: WeaponKindT[] = [
  { id: "dagger", name: "Dagger", type: "physical", cooldown: KIND_SPEED.dagger, hands: 1 },
  { id: "fist", name: "Fist weapons", type: "physical", cooldown: KIND_SPEED.fist, hands: 1 },
  { id: "sword", name: "Sword", type: "physical", cooldown: KIND_SPEED.sword, hands: 1 },
  { id: "spear", name: "Spear", type: "physical", cooldown: KIND_SPEED.spear, hands: 1 },
  { id: "bow", name: "Bow", type: "physical", cooldown: KIND_SPEED.bow, hands: 2 },
  { id: "great_weapon", name: "Great weapon", type: "physical", cooldown: KIND_SPEED.great_weapon, hands: 2, note: "Axes, hammers, pikes and scythes." },
  { id: "rune_sword", name: "Rune sword", type: "physical", cooldown: KIND_SPEED.rune_sword, hands: 1 },
  { id: "mace", name: "Mace", type: "physical", cooldown: KIND_SPEED.mace, hands: 1 },
  { id: "wand", name: "Wand", type: "physical", cooldown: KIND_SPEED.wand, hands: 1 },
  { id: "rod", name: "Rod", type: "physical", cooldown: KIND_SPEED.rod, hands: 1 },
  { id: "staff", name: "Staff", type: "physical", cooldown: KIND_SPEED.staff, hands: 2 },
];

/** Four armor types; a class wears only its own (rules-and-vocabulary.md, Gear). */
export const armorTypes: GearKindT[] = [
  { id: "plate", name: "Plate" },
  { id: "mail", name: "Mail" },
  { id: "leather", name: "Leather" },
  { id: "robes", name: "Robes" },
];

/** Ten offhand kinds, of two or three classes each (rules-and-vocabulary.md, Gear). */
export const offhandKinds: GearKindT[] = [
  { id: "kite_shield", name: "Kite shield" },
  { id: "round_shield", name: "Round shield" },
  { id: "horn", name: "Horn" },
  { id: "tome", name: "Tome" },
  { id: "lantern", name: "Lantern" },
  { id: "relic", name: "Relic" },
  { id: "bell", name: "Bell" },
  { id: "totem", name: "Totem" },
  { id: "vial", name: "Vial" },
  { id: "idol", name: "Idol" },
];
/** The speed word of a kind, for weapon damage. */
export const speedOf = (kind: string): "fast" | "medium" | "slow" => {
  const cd = weaponKinds.find((k) => k.id === kind)!.cooldown ?? SPEED.medium;
  return cd < 7.5 ? "fast" : cd > 10.5 ? "slow" : "medium";
};

const timing = (n: number) => TIMING.map((stat) => ({ stat, flat: n }));
const hits = (pct: number) => [{ tag: "physical", pct }];

/** The 22 statuses of the vocabulary. */
export const vocabulary: StatusT[] = [
  // Fundamental
  // Nothing on its own and no duration; each hit the holder takes opens it.
  {
    id: "bleed", name: "BLEED", text: "Each hit it takes deals damage for each stack, then a third of the stacks close.", label: "debuff", show: "icon", stacking: "intensity",
    trigger: { on: { event: "hit_taken" }, do: [{ op: "damage", type: "none", amount: STATUS.bleed.perStack, to: "holder" }] }, drop: { fraction: STATUS.bleed.drop },
  },
  { id: "regen", name: "REGEN", text: "Recovers health over time.", label: "buff", show: "icon", stacking: "refresh", duration: STATUS.regen.duration, pulse: { every: STATUS.regen.every, do: [{ op: "heal", amount: { scale: [{ ratio: STATUS.regen.share, stat: "max_hp", of: "holder" }] } }] } },
  { id: "shield", name: "SHIELD", text: "Soaks damage before health.", label: "buff", show: "icon", stacking: "intensity", absorb: true, cap: { scale: [{ ratio: STATUS.shield.capShare, stat: "max_hp", of: "holder" }] } },
  // A stack is spent each time the holder acts, not on a timer.
  { id: "might", name: "MIGHT", text: "Deals more damage per stack; each action spends a stack.", label: "buff", show: "icon", stacking: "intensity", boosts: hits(STATUS.might.perStack), cap: STATUS.might.cap, trigger: { on: { event: "action_resolve" } }, drop: { count: 1 } },
  { id: "weaken", name: "WEAKEN", text: "Deals less damage.", label: "debuff", show: "icon", stacking: "refresh", duration: STATUS.weaken.duration, boosts: hits(STATUS.weaken.pct) },
  { id: "guard", name: "GUARD", text: "Defense up.", label: "buff", show: "icon", stacking: "refresh", duration: STATUS.guard.duration, stats: [{ stat: "defense", flat: STATUS.guard.defense }] },
  { id: "stun", name: "STUN", text: "Can't act. A wind-up already under way waits it out, then carries on.", label: "debuff", show: "icon", stacking: "fizzle", duration: STATUS.stun.duration, lockout: { covers: "all", pause: true } },
  { id: "slow", name: "SLOW", text: "Slower in everything.", label: "debuff", show: "icon", stacking: "refresh", duration: STATUS.slow.duration, stats: timing(STATUS.slow.speed) },
  { id: "haste", name: "HASTE", text: "Faster in everything.", label: "buff", show: "icon", stacking: "refresh", duration: STATUS.haste.duration, stats: timing(STATUS.haste.speed) },
  { id: "taunt", name: "TAUNT", text: "Foes must pick it.", label: "buff", show: "icon", stacking: "refresh", duration: STATUS.taunt.duration, stats: [{ stat: "forced", flat: 1 }] },
  // Specialist
  // A status's own damage is untyped and never resisted (Burn, Shock, Bleed, Chill's shatter, Thorns).
  { id: "burn", name: "BURN", text: "Burns for each stack, then dies down.", label: "debuff", show: "icon", stacking: "intensity", pulse: { every: STATUS.burn.every, do: [{ op: "damage", type: "none", amount: STATUS.burn.perStack }] }, drop: { fraction: STATUS.burn.drop } },
  {
    id: "chill", name: "CHILL", text: "Slower for each stack; thaws one stack at a time. At 12 it shatters: damage for each stack, a Stun, and the Chill is spent.", label: "debuff", show: "icon", stacking: "intensity",
    cap: STATUS.chill.cap, stats: timing(STATUS.chill.perStack), pulse: { every: STATUS.chill.every }, drop: { count: 1 },
    // The shatter.
    reactions: [{ on: { event: "status_capped", status: "chill" }, do: [{ op: "damage", type: "none", amount: { scale: [{ ratio: STATUS.chill.shatter, stacks: "chill", of: "holder" }] }, to: "holder" }, { op: "apply", status: "stun", to: "holder" }, { op: "remove", label: "debuff", status: "chill", to: "holder" }] }],
  },
  { id: "shock", name: "SHOCK", text: "Hurts for each stack every time it acts.", label: "debuff", show: "icon", stacking: "intensity", cap: STATUS.shock.cap, trigger: { on: { event: "action_resolve" }, do: [{ op: "damage", type: "none", amount: STATUS.shock.perStack, to: "holder" }] }, drop: { fraction: STATUS.shock.drop } },
  // A cut to the hits it takes, never to a status's own damage: Guard adds Defense, which big hits punch through; Ward cuts every hit alike.
  { id: "ward", name: "WARD", text: "Takes less damage from hits.", label: "buff", show: "icon", stacking: "refresh", duration: STATUS.ward.duration, taken: [{ tag: "physical", pct: STATUS.ward.hits }] },
  // A damage-taken ramp, not a Defense strip (foes carry too little Defense for a strip to show past two stacks): it reads on every
  // foe and gives the Hexer and the Monk a ramp.
  { id: "sunder", name: "SUNDER", text: "Takes more damage for each stack.", label: "debuff", show: "icon", stacking: "intensity", cap: STATUS.sunder.cap, taken: [{ pct: STATUS.sunder.perStack }], pulse: { every: STATUS.sunder.every }, drop: { count: 1 } },
  { id: "silence", name: "SILENCE", text: "Can't use abilities.", label: "debuff", show: "icon", stacking: "fizzle", duration: STATUS.silence.duration, lockout: { covers: "ability", interrupt: true } },
  { id: "hidden", name: "HIDDEN", text: "Foes can't pick it.", label: "buff", show: "icon", stacking: "refresh", duration: STATUS.hidden.duration, unremovable: true, stats: [{ stat: "forbidden", flat: 1 }] },
  { id: "rot", name: "ROT", text: "Heals less.", label: "debuff", show: "icon", stacking: "refresh", duration: STATUS.rot.duration, stats: [{ stat: "healing_received", flat: STATUS.rot.healing }] },
  { id: "clarity", name: "CLARITY", text: "Recovers MP over time.", label: "buff", show: "icon", stacking: "refresh", duration: STATUS.clarity.duration, pulse: { every: STATUS.clarity.every, do: [{ op: "mp", amount: { scale: [{ ratio: STATUS.clarity.share, stat: "max_mp", of: "holder" }] } }] } },
  // Signature
  { id: "aegis", name: "AEGIS", text: "Blocks the next big blow.", label: "buff", show: "icon", stacking: "fizzle", block: { share: STATUS.aegis.share } },
  {
    id: "doom", name: "DOOM", text: "A countdown to a heavy blow: most of its holder's health.", label: "debuff", show: "icon", stacking: "fizzle", duration: STATUS.doom.countdown,
    reactions: [{ on: { event: "status_ended", status: "doom", cause: ["expired"] }, do: [{ op: "damage", type: "none", amount: { scale: [{ ratio: STATUS.doom.share, stat: "max_hp", of: "holder" }] }, to: "holder" }] }],
  },
  {
    id: "bulwark", name: "BULWARK", text: "Every hit chips it; at zero it breaks.", label: "buff", show: "icon", stacking: "intensity",
    trigger: { on: { event: "hit_taken" } }, drop: { count: 1 },
    reactions: [{ on: { event: "status_ended", status: "bulwark", cause: ["stacks"] }, do: [{ op: "apply", status: "bulwark_broken", to: "holder" }] }],
  },
  {
    id: "bulwark_broken", name: "BROKEN", text: "Stunned and takes double damage, until the Bulwark refills.", label: "debuff", show: "icon", stacking: "refresh", unremovable: true, duration: STATUS.bulwark.broken,
    lockout: { covers: "all", interrupt: true }, taken: [{ pct: STATUS.bulwark.takenPct }],
    reactions: [{ on: { event: "status_ended", status: "bulwark_broken", cause: ["expired"] }, do: [{ op: "apply", status: "bulwark", stacks: STATUS.bulwark.stacks, to: "holder" }] }],
  },
];

/** The statuses that special stats bring: machinery, shown as stats. */
export const machinery: StatusT[] = [
  { id: "mp_regen", name: "MP regen", label: "buff", show: "stat", stacking: "refresh", unremovable: true, pulse: { every: MP_REGEN.every, do: [{ op: "mp", amount: { scale: [{ ratio: MP_REGEN.share, stat: "mp_regen", of: "holder" }] } }] } },
  { id: "thorns", name: "Thorns", label: "buff", show: "stat", stacking: "refresh", unremovable: true, reactions: [{ on: { event: "hit_taken" }, do: [{ op: "damage", type: "none", amount: { scale: [{ ratio: 1, stat: "thorns", of: "holder" }] }, to: "other" }] }] },
  { id: "lifesteal", name: "Lifesteal", label: "buff", show: "stat", stacking: "refresh", unremovable: true, reactions: [{ on: { event: "hit_lands" }, do: [{ op: "heal", amount: { scale: [{ ratio: 0.01, amount: true, times: { stat: "lifesteal", of: "holder" } }] }, to: "self" }] }] },
  {
    id: "siphon", name: "Siphon", label: "buff", show: "stat", stacking: "refresh", unremovable: true,
    reactions: [{
      on: { event: "hit_lands" },
      do: [
        { op: "mp", amount: { scale: [{ ratio: -0.01, amount: true, times: { stat: "siphon", of: "holder" } }] }, to: "other" },
        { op: "mp", amount: { scale: [{ ratio: 0.01, amount: true, times: { stat: "siphon", of: "holder" } }] }, to: "self" },
      ],
    }],
    note: "The holder gains the share whether or not the target had that much MP left: a simplification.",
  },
  { id: "double_strike", name: "Double strike", label: "buff", show: "stat", stacking: "refresh", unremovable: true, strike: { scale: "double_strike", to: "target" } },
];

export const ruleset: ContentPack["ruleset"] = {
  basicRecovery: RULES.basicRecovery,
  armorFloor: RULES.armorFloor,
  abilityCast: RULES.abilityCast,
  abilityRecovery: RULES.abilityRecovery,
  armorRatio: RULES.armorRatio,
  armorK: RULES.armorK,
  taken: { floor: -75, cap: 200 },
  unarmed: { type: "physical", cooldown: SPEED.medium, amount: { base: 100, scale: [{ ratio: 0.2, stat: "attack" }] } },
  maxEnemies: RULES.maxEnemies,
  lostCast: RULES.lostCast,
  opening: RULES.opening,
  stagger: RULES.stagger,
  draw: RULES.draw,
  partyDraw: RULES.partyDraw,
  enrage: RULES.enrage,
  control: RULES.control,
  run: { defeatedUnits: "stay_down", perkOffer: { options: 1, premiumChance: 0, repeatPicked: false, offerInapplicable: false } },
};

export const design: ContentPack["design"] = {
  note: "The core set's shape: parties of 3 in formations of 3 slots, classes of 3 abilities all brought, no perks. The tech keeps 5 slots and perk picks for later.",
  formationPositions: 3,
  partySize: [1, 3],
  abilitiesPerClass: 3,
  abilitiesEquipped: 3,
  perkPicksPerRun: [0, 0],
  perkPoolSize: [0, 0],
  perkOptionsPerPick: 1,
  complete: { classes: [16, 16] },
};

/** One point is P in the data; exported for the other content files. */
export { P };
