/**
 * The core set's vocabulary (docs/core-set/rules-and-vocabulary.md): the stat
 * registry, elements, weapon kinds, the 22 statuses, the statuses that special
 * stats bring, the ruleset and the design block.
 */
import type { ContentPack, StatDefT, StatusT, WeaponKindT } from "../../src/schema.js";
import { MP_REGEN, P, RULES, SPEED, STATUS, pts } from "./scale.js";

const TIMING = ["attack_speed", "cooldown_reduction", "cast_time_reduction"] as const;

export const stats: StatDefT[] = [
  { id: "max_hp", name: "HP", kind: "amount", default: pts(1), floor: 1 },
  { id: "max_mp", name: "MP", kind: "amount", default: 0, floor: 0 },
  { id: "mp_regen", name: "MP regen", kind: "amount", default: 0, floor: 0, brings: "mp_regen", note: `MP restored every ${MP_REGEN.every} ticks, through the status it brings.` },
  { id: "attack", name: "Attack", kind: "amount", default: 0, floor: 0 },
  { id: "magic", name: "Magic", kind: "amount", default: 0, floor: 0 },
  { id: "armor", name: "Armor", kind: "amount", default: 0, floor: 0, note: `Each physical hit loses ${RULES.armorRatio} × Armor.` },
  { id: "aggro", name: "Aggro", kind: "amount", default: pts(1), floor: 100, note: "Floors above zero: no unit becomes unpickable by numbers alone." },
  { id: "resist", name: "Resistance", kind: "points", default: 0, floor: -100, cap: 200, note: "Past 100 the damage heals instead: absorption, a class and boss trait." },
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
];

export const elements = [
  { id: "fire", name: "Fire" },
  { id: "earth", name: "Earth" },
  { id: "ice", name: "Ice" },
  { id: "lightning", name: "Lightning" },
  { id: "wind", name: "Wind" },
  { id: "light", name: "Light" },
  { id: "dark", name: "Dark" },
];

export const weaponKinds: WeaponKindT[] = [
  { id: "dagger", name: "Dagger", type: "physical", subtype: "pierce", cooldown: SPEED.fast },
  { id: "fist", name: "Fist weapons", type: "physical", subtype: "blunt", cooldown: SPEED.fast },
  { id: "sword", name: "Sword", type: "physical", subtype: "slash", cooldown: SPEED.medium },
  { id: "bow", name: "Bow", type: "physical", subtype: "pierce", cooldown: SPEED.medium },
  { id: "spear", name: "Spear", type: "physical", subtype: "pierce", cooldown: SPEED.medium },
  { id: "axe", name: "Axe", type: "physical", subtype: "blunt", cooldown: SPEED.slow },
  { id: "fire_staff", name: "Fire staff", type: "magical", element: "fire", cooldown: SPEED.slow },
  { id: "lightning_staff", name: "Lightning staff", type: "magical", element: "lightning", cooldown: SPEED.fast },
  { id: "wind_staff", name: "Wind staff", type: "magical", element: "wind", cooldown: SPEED.fast },
  { id: "earth_staff", name: "Earth staff", type: "magical", element: "earth", cooldown: SPEED.medium },
  { id: "ice_staff", name: "Ice staff", type: "magical", element: "ice", cooldown: SPEED.medium },
  { id: "light_staff", name: "Light staff", type: "magical", element: "light", cooldown: SPEED.medium },
  { id: "dark_staff", name: "Dark staff", type: "magical", element: "dark", cooldown: SPEED.medium },
];
/** The speed word of a kind, for weapon damage. */
export const speedOf = (kind: string): "fast" | "medium" | "slow" => {
  const cd = weaponKinds.find((k) => k.id === kind)!.cooldown;
  return cd === SPEED.fast ? "fast" : cd === SPEED.slow ? "slow" : "medium";
};

const timing = (n: number) => TIMING.map((stat) => ({ stat, flat: n }));
const bothKinds = (pct: number) => [{ tag: "physical", pct }, { tag: "magical", pct }];

/** The 22 statuses of the vocabulary. */
export const vocabulary: StatusT[] = [
  // Fundamental
  { id: "poison", name: "POISON", text: "Loses health over time.", label: "debuff", show: "icon", stacking: "refresh", duration: STATUS.poison.duration, pulse: { every: STATUS.poison.every, do: [{ op: "damage", type: "none", amount: STATUS.poison.damage }] } },
  { id: "regen", name: "REGEN", text: "Recovers health over time.", label: "buff", show: "icon", stacking: "refresh", duration: STATUS.regen.duration, pulse: { every: STATUS.regen.every, do: [{ op: "heal", amount: { scale: [{ ratio: STATUS.regen.share, stat: "max_hp", of: "holder" }] } }] } },
  { id: "shield", name: "SHIELD", text: "Soaks damage before health.", label: "buff", show: "icon", stacking: "intensity", absorb: true, cap: { scale: [{ ratio: STATUS.shield.capShare, stat: "max_hp", of: "holder" }] } },
  { id: "might", name: "MIGHT", text: "Deals more damage per stack.", label: "buff", show: "icon", stacking: "intensity", boosts: bothKinds(STATUS.might.perStack), pulse: { every: STATUS.might.every }, drop: { count: 1 } },
  { id: "weaken", name: "WEAKEN", text: "Deals less damage.", label: "debuff", show: "icon", stacking: "refresh", duration: STATUS.weaken.duration, boosts: bothKinds(STATUS.weaken.pct) },
  { id: "guard", name: "GUARD", text: "Armor up.", label: "buff", show: "icon", stacking: "refresh", duration: STATUS.guard.duration, stats: [{ stat: "armor", flat: STATUS.guard.armor }] },
  { id: "stun", name: "STUN", text: "Can't act.", label: "debuff", show: "icon", stacking: "fizzle", duration: STATUS.stun.duration, lockout: { covers: "all", interrupt: true } },
  { id: "slow", name: "SLOW", text: "Slower in everything.", label: "debuff", show: "icon", stacking: "refresh", duration: STATUS.slow.duration, stats: timing(STATUS.slow.speed) },
  { id: "haste", name: "HASTE", text: "Faster in everything.", label: "buff", show: "icon", stacking: "refresh", duration: STATUS.haste.duration, stats: timing(STATUS.haste.speed) },
  { id: "taunt", name: "TAUNT", text: "Foes must pick it.", label: "buff", show: "icon", stacking: "refresh", duration: STATUS.taunt.duration, stats: [{ stat: "forced", flat: 1 }] },
  // Specialist
  { id: "burn", name: "BURN", text: "Burns for each stack, then dies down.", label: "debuff", show: "icon", stacking: "intensity", pulse: { every: STATUS.burn.every, do: [{ op: "damage", type: "none", amount: STATUS.burn.perStack }] }, drop: { fraction: STATUS.burn.drop } },
  { id: "chill", name: "CHILL", text: "Slower for each stack.", label: "debuff", show: "icon", stacking: "intensity", cap: STATUS.chill.cap, stats: timing(STATUS.chill.perStack), pulse: { every: STATUS.chill.every }, drop: { fraction: STATUS.chill.drop } },
  { id: "shock", name: "SHOCK", text: "Hurts for each stack every time it acts.", label: "debuff", show: "icon", stacking: "intensity", trigger: { on: { event: "action_resolve" }, do: [{ op: "damage", type: "none", amount: STATUS.shock.perStack, to: "holder" }] }, drop: { fraction: STATUS.shock.drop } },
  { id: "ward", name: "WARD", text: "Resists every element.", label: "buff", show: "icon", stacking: "refresh", duration: STATUS.ward.duration, stats: [{ stat: "resist", flat: STATUS.ward.resist }] },
  { id: "sunder", name: "SUNDER", text: "Armor down for each stack.", label: "debuff", show: "icon", stacking: "intensity", stats: [{ stat: "armor", flat: STATUS.sunder.perStack }], pulse: { every: STATUS.sunder.every }, drop: { count: 1 } },
  { id: "silence", name: "SILENCE", text: "Can't use abilities.", label: "debuff", show: "icon", stacking: "fizzle", duration: STATUS.silence.duration, lockout: { covers: "ability", interrupt: true } },
  { id: "hidden", name: "HIDDEN", text: "Foes can't pick it.", label: "buff", show: "icon", stacking: "refresh", duration: STATUS.hidden.duration, unremovable: true, stats: [{ stat: "forbidden", flat: 1 }] },
  { id: "rot", name: "ROT", text: "Heals less.", label: "debuff", show: "icon", stacking: "refresh", duration: STATUS.rot.duration, stats: [{ stat: "healing_received", flat: STATUS.rot.healing }] },
  { id: "clarity", name: "CLARITY", text: "Regains MP faster.", label: "buff", show: "icon", stacking: "refresh", duration: STATUS.clarity.duration, stats: [{ stat: "mp_regen", pct: STATUS.clarity.regenPct }] },
  // Signature
  { id: "aegis", name: "AEGIS", text: "Blocks the next big blow.", label: "buff", show: "icon", stacking: "fizzle", block: { share: STATUS.aegis.share } },
  {
    id: "doom", name: "DOOM", text: "A countdown to a heavy blow.", label: "debuff", show: "icon", stacking: "fizzle", duration: STATUS.doom.countdown,
    reactions: [{ on: { event: "status_ended", status: "doom", cause: ["expired"] }, do: [{ op: "damage", type: "none", amount: STATUS.doom.damage, to: "holder" }] }],
  },
  {
    id: "bulwark", name: "BULWARK", text: "Piercing and Wind hits chip it; at zero it breaks.", label: "buff", show: "icon", stacking: "intensity",
    trigger: { on: { event: "hit_taken", tags: ["pierce", "wind"] } }, drop: { count: 1 },
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
  abilityCast: RULES.abilityCast,
  abilityRecovery: RULES.abilityRecovery,
  armorRatio: RULES.armorRatio,
  taken: { floor: -75, cap: 200 },
  unarmed: { type: "physical", subtype: "blunt", cooldown: SPEED.medium, amount: { base: 100, scale: [{ ratio: 0.2, stat: "attack" }] } },
  maxEnemies: RULES.maxEnemies,
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
