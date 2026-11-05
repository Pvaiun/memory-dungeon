/**
 * The 16 classes (docs/core-set/classes.md): stats, passives, abilities.
 * Every number comes from scale.ts; the words are the documents'.
 */
import type { AbilityT, ClassDefT, NumT, StatusT, TargetRuleT } from "../../src/schema.js";
import { BURN_STACKS, SHOCK_STACKS, COOLDOWN, HIT, REVIVE, SPECIAL, SPECIAL_KEY, STACKS, STATUS, WINDUP, crit, from, jitter, aggroOf, pts, stacks, type HitWord, type SpecialLevel, type SpecialStat, type StackWord } from "./scale.js";
import { P } from "./vocabulary.js";

type CD = keyof typeof COOLDOWN;
type WU = keyof typeof WINDUP;

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Cooldown and wind-up from their words. Each ability states its own MP cost (see below). */
const timing = (cd: CD, wu: WU) => ({ cooldown: COOLDOWN[cd], cast: WINDUP[wu] });
/** One kind of hit, no elements or subtypes. An element is a theme in a name, never a mechanic. */
const phys = (amount: NumT, extra: object = {}) => ({ op: "damage", type: "physical", amount, ...extra }) as const;
const hit = (stat: string, word: HitWord) => from(stat, HIT[word]);
const apply = (status: string, extra: object = {}) => ({ op: "apply", status, ...extra }) as const;

/** The target phrases of the rules document, word for word. */
export const T = {
  randomFoe: "foe" as const,
  lowestHpFoe: { side: "foes", pick: "lowest", by: "hp" } satisfies TargetRuleT,
  highestAMFoe: { side: "foes", pick: "highest", by: { stats: ["attack"] } } satisfies TargetRuleT,
  mostFoe: (status: string): TargetRuleT => ({ side: "foes", pick: "highest", by: { stacks: status } }),
  buffedFoe: { side: "foes", where: { buffs: true } } satisfies TargetRuleT,
  secondFoe: { side: "foes", pick: "random", exclude: "targets" } satisfies TargetRuleT,
  threeOtherFoes: { side: "foes", pick: "random", count: 3, exclude: "targets" } satisfies TargetRuleT,
  /** Used only with Seek. */
  notTauntingFoe: { side: "foes", where: { lacks: "taunt" }, ifNone: "any" } satisfies TargetRuleT,
  lowestShareAlly: { side: "allies", pick: "lowest", by: "hp_share" } satisfies TargetRuleT,
  otherLowestShareAlly: { side: "others", pick: "lowest", by: "hp_share" } satisfies TargetRuleT,
  highestAMAlly: { side: "allies", pick: "highest", by: { stats: ["attack"] } } satisfies TargetRuleT,
  /** The ally with the least MP, for the Clarity givers. */
  lowestMpAlly: { side: "allies", pick: "lowest", by: "mp_share" } satisfies TargetRuleT,
  /** The ally with the least MP among those under half; with nobody under half, the least all the same (a preference, never a skip). */
  needsMpAlly: { side: "allies", where: { mpBelow: 50 }, ifNone: "any", pick: "lowest", by: "mp_share" } satisfies TargetRuleT,
  /** A foe in a wind-up, for Unmake. */
  castingFoe: { side: "foes", where: { casting: true }, pick: "highest", by: { stats: ["attack"] } } satisfies TargetRuleT,
  randomAlly: "ally" as const,
  debuffedAlly: { side: "allies", where: { debuffs: true } } satisfies TargetRuleT,
  otherDebuffedAlly: { side: "others", where: { debuffs: true } } satisfies TargetRuleT,
  koAlly: { side: "allies", where: { ko: true } } satisfies TargetRuleT,
  everyFoe: { side: "foes", pick: "all" } satisfies TargetRuleT,
  everyAlly: { side: "allies", pick: "all" } satisfies TargetRuleT,
};
/** The Fizzle rule: skip targets that already hold the status; `ifNone: any` for abilities that also deal damage. */
const lacking = (rule: TargetRuleT, status: string | string[], fallback = false): TargetRuleT => ({ ...rule, where: { ...(rule.where ?? {}), lacks: status }, ...(fallback ? { ifNone: "any" as const } : {}) });
const waitsFor = (side: TargetRuleT["side"], where: NonNullable<TargetRuleT["where"]>) => ({ if: { side, where } });

/** A class's line: HP, MP, MP regen, Attack, Defense, Crit, Aggro. Attack feeds whatever states it: swings, spells, heals and stacks alike. */
const stat = (hp: number, mp: number, regen: number, atk: number, def: number, c: number, aggro: number) => ({
  // No MP regen in fights by default. A class's regen word is kept for the record and given 0: MP comes
  // back on the bench after a fight sat out (rogue config benchMp), and in fights only from gear, a seat, Clarity, Refrain or Siphon.
  max_hp: pts(hp), max_mp: pts(mp), mp_regen: 0 * regen, attack: pts(atk), defense: pts(def), crit_chance: crit(c), aggro: aggroOf(aggro),
});
// A class's stat line is its base, so a Crit damage word adds to the default multiplier (150) rather than replacing it.
const special = (s: SpecialStat, level: SpecialLevel) => ({ [SPECIAL_KEY[s]]: (s === "crit_damage" ? 150 : 0) + SPECIAL[s][level] });

/** Stacks a passive's application adds: scaled from the holder's stat, read when it fires. */
const own = (word: StackWord, stat: string, mult = 1): NumT => ({ scale: [{ ratio: (mult * STACKS[word]) / P, stat, of: "holder" }] });
const passive = (id: string, name: string, body: Partial<StatusT>): StatusT =>
  ({ id, name, label: "buff", show: "sheet", stacking: "refresh", unremovable: true, ...body }) as StatusT;
const bothKinds = (pct: StatusT["boosts"] extends (infer B)[] | undefined ? (B extends { pct: infer N } ? N : never) : never) => [{ tag: "physical", pct }];

// ─── Passives ────────────────────────────────────────────────────────────────

export const passives: StatusT[] = [
  passive("vanguard", "Vanguard", { text: "Starts every fight behind a Shield from its max HP.", reactions: [{ on: { event: "fight_start" }, do: [apply("shield", { stacks: { scale: [{ ratio: 0.2, stat: "max_hp", of: "holder" }] }, to: "holder" })] }] }),
  passive("hunters_eye", "Hunter's eye", { text: "Basic attacks ignore Taunt.", seek: "basic" }),
  // Einherjar is a status, so it can be trained.
  passive("einherjar", "Einherjar", { text: "Allies it revives come back with every action ready.", revives: { ready: true } }),
  passive("briar", "Briar", { text: "Foes its Thorns wound start to bleed.", reactions: [{ on: { event: "damage_dealt", status: "thorns" }, do: [apply("bleed", { stacks: own("few", "defense"), to: "other" })] }] }),
  passive("phalanx", "Phalanx", { text: "Basic attacks half as often, for double damage.", stats: [{ stat: "attack_speed", flat: -100 }], boosts: [{ tag: "basic", pct: 100 }] }),
  passive("judgement", "Judgement", { text: "Hits deal half again as much to foes with a buff.", boosts: bothKinds({ scale: [{ ratio: 50, when: { buffs: true }, of: "target" }] }) }),
  // Bloodlust's pattern.
  passive("last_rites", "Last rites", {
    text: "Cooldowns halved below 30% HP.",
    reactions: [
      { on: { event: "hp_lost" }, do: [apply("last_rites_on", { to: { side: "self", where: { hpBelow: 30 } } })] },
      { on: { event: "healed" }, do: [{ op: "remove", label: "buff", status: "last_rites_on", to: { side: "self", where: { hpAtLeast: 30 } } }] },
    ],
  }),
  { id: "last_rites_on", name: "LAST RITES", text: "Cooldowns halved.", label: "buff", show: "icon", stacking: "fizzle", stats: [{ stat: "cooldown_reduction", flat: 100 }] },
  // A share of the damage dealt, so the Bard's weapon is a choice against the foe's Defense.
  passive("refrain", "Refrain", { text: "Basic attacks heal a random ally and give a random ally MP, each a share of the damage dealt.", reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [
    { op: "heal", amount: { scale: [{ ratio: STATUS.refrain.share, amount: true }] }, to: { side: "allies", pick: "random" } },
    { op: "mp", amount: { scale: [{ ratio: STATUS.refrain.share, amount: true }] }, to: { side: "allies", pick: "random" } },
  ] }] }),
  passive("cold_hex", "Cold hex", { text: "Basic attacks add a few Chill.", reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("chill", { stacks: own("few", "attack", 1.3), to: "other" })] }] }), // 3.6 Chill a hit at Attack 4, so the Hexer can reach a shatter alone over a fight.
  passive("iron_palm", "Iron palm", {
    text: "Basic attacks, and Double strike's second strike, add a few Sunder.",
    reactions: [
      { on: { event: "hit_lands", kind: "basic" }, do: [apply("sunder", { stacks: own("few", "attack"), to: "other" })] },
      { on: { event: "hit_lands", kind: "extra" }, do: [apply("sunder", { stacks: own("few", "attack"), to: "other" })] },
    ],
  }),
  passive("lacerate", "Lacerate", { text: "Its crits add several Bleed.", reactions: [{ on: { event: "hit_lands", tags: ["crit"] }, do: [apply("bleed", { stacks: own("several", "attack"), to: "other" })] }] }),
  passive("bloodlust", "Bloodlust", {
    text: "Lifesteal doubles below half HP.",
    reactions: [
      { on: { event: "hp_lost" }, do: [apply("bloodlust_on", { to: { side: "self", where: { hpBelow: 50 } } })] },
      { on: { event: "healed" }, do: [{ op: "remove", label: "buff", status: "bloodlust_on", to: { side: "self", where: { hpAtLeast: 50 } } }] },
    ],
  }),
  { id: "bloodlust_on", name: "BLOODLUST", text: "Lifesteal doubled.", label: "buff", show: "icon", stacking: "fizzle", stats: [{ stat: "lifesteal", flat: { scale: [{ ratio: 1, stat: "lifesteal", of: "holder" }] } }] },
  passive("kindling", "Kindling", { text: "Basic attacks add a few Burn.", reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("burn", { stacks: own("few", "attack", BURN_STACKS), to: "other" })] }] }),
  passive("shatterpoint", "Shatterpoint", { text: "When a foe's Chill shatters, it takes several Sunder.", reactions: [{ on: { event: "status_capped", status: "chill", whose: "foe" }, do: [apply("sunder", { stacks: own("several", "attack"), to: "owner" })] }] }),
  passive("arc", "Arc", {
    text: "Basic attacks also hit a second foe, and Shock both.",
    strike: { to: T.secondFoe },
    reactions: [
      { on: { event: "hit_lands", kind: "basic" }, do: [apply("shock", { stacks: own("few", "attack", SHOCK_STACKS), to: "other" })] },
      { on: { event: "hit_lands", kind: "extra" }, do: [apply("shock", { stacks: own("few", "attack", SHOCK_STACKS), to: "other" })] },
    ],
  }),
  passive("bedrock", "Bedrock", {
    text: "Crit chance doubled while its Shield holds.",
    reactions: [
      { on: { event: "status_gained", status: "shield" }, do: [apply("bedrock_on", { to: "holder" })] },
      { on: { event: "status_ended", status: "shield" }, do: [{ op: "remove", label: "buff", status: "bedrock_on", to: "holder" }] },
    ],
  }),
  { id: "bedrock_on", name: "BEDROCK", text: "Crit chance doubled.", label: "buff", show: "icon", stacking: "fizzle", stats: [{ stat: "crit_chance", flat: { scale: [{ ratio: 1, stat: "crit_chance", of: "holder" }] } }] },
];

// ─── Abilities ───────────────────────────────────────────────────────────────

// MP costs are set by hand, ability by ability (no rule from a stat to a cost), in two tiers: skills (the physical classes' and
// the Valkyrie's spear) and spells (the healers', the Bard's, Hexer's and Paladin's, the four mages', the Vampire's dark arts),
// which cost more: the more a unit is a caster, the more mana matters.
type A = Omit<AbilityT, "class"> & { class: string };
// Each ability's cooldown is its word's, moved by its id (scale.ts, jitter), so no two in a kit are the same.
/** Rally's share of Attack: the Valkyrie's Attack is its spear's, above what its heal is sized for. */
export const RALLY = 0.34;
const a = (cls: string, id: string, name: string, text: string, body: Partial<AbilityT> & { do: AbilityT["do"]; cooldown: number }): A => ({ id, class: cls, name, text, ...body, cooldown: jitter(body.cooldown, id) });

export const abilities: A[] = [
  // Knight
  a("knight", "fortify", "Fortify", "Guards the ally with the lowest share of HP.", { ...timing("long", "quick"), mp: 325, target: T.lowestShareAlly, do: [apply("guard")] }),
  a("knight", "stand_fast", "Stand fast", "Taunts, and gives Clarity to the ally with the least MP.", {
    ...timing("medium", "quick"), mp: 200, target: "self", do: [apply("taunt"), apply("clarity", { to: T.needsMpAlly })],
  }),
  a("knight", "shield_bash", "Shield bash", "Bashes a foe with the shield, which scales from max HP, and Stuns it.", {
    ...timing("medium", "quick"), mp: 325, target: lacking({ side: "foes" }, "stun", true), do: [phys(hit("max_hp", "light"), { apply: [{ status: "stun" }] })], // From max HP: the health tank.
  }),
  // Cleric: an active healer that spends MP, with no free heal.
  a("cleric", "renew", "Renew", "Cleanses an ally with a debuff and gives it Regen; with nobody debuffed, Regen on the lowest ally.", {
    ...timing("medium", "normal"), mp: 650, target: { side: "allies", where: { debuffs: true }, ifNone: "any", pick: "lowest", by: "hp_share" }, do: [{ op: "remove", label: "debuff" }, apply("regen")],
  }),
  a("cleric", "cure", "Cure", "A quick, small heal on the lowest ally.", {
    ...timing("quick", "quick"), mp: 450, ...waitsFor("allies", { hpBelow: 80 }), target: T.lowestShareAlly, do: [{ op: "heal", amount: from("attack", 0.35) }],
  }),
  a("cleric", "raise", "Raise", "Revives a random knocked-out ally with half its HP.", {
    ...timing("very_long", "very_long"), mp: 650, ...waitsFor("allies", { ko: true }), target: T.koAlly, do: [{ op: "revive", hp: { scale: [{ ratio: REVIVE.half, stat: "max_hp", of: "target" }] } }],
  }),
  // Ranger
  a("ranger", "barbed_arrow", "Barbed arrow", "A barbed arrow at a random foe, adding several Bleed.", { ...timing("quick", "quick"), mp: 200, do: [phys(hit("attack", "light"), { apply: [{ status: "bleed", stacks: stacks("several", "attack") }] })] }),
  // A quick, light shot that lays a few Chill, so the Ranger helps the Frostweaver and the Hexer reach a shatter.
  a("ranger", "frost_arrow", "Frost arrow", "A quick, cold arrow at the foe with the most Chill, adding a few.", {
    ...timing("quick", "quick"), mp: 200, target: T.mostFoe("chill"), do: [phys(hit("attack", "light"), { apply: [{ status: "chill", stacks: stacks("few", "attack", 0.5) }] })],
  }),
  a("ranger", "rending_arrow", "Rending arrow", "An arrow at the foe with the most Sunder, adding a few.", {
    ...timing("short", "normal"), mp: 325, target: T.mostFoe("sunder"), do: [phys(hit("attack", "normal"), { apply: [{ status: "sunder", stacks: stacks("few", "attack") }] })],
  }),
  // Bramble knight
  a("bramble_knight", "thicket", "Thicket", "Taunts and Guards itself.", { ...timing("medium", "quick"), mp: 200, target: "self", do: [apply("taunt"), apply("guard")] }),
  a("bramble_knight", "regrowth", "Regrowth", "Regen on the lowest ally.", { ...timing("medium", "normal"), mp: 325, target: T.lowestShareAlly, do: [apply("regen")] }),
  a("bramble_knight", "bramble_lash", "Bramble lash", "Lashes a random foe with its thorns.", { ...timing("quick", "quick"), mp: 200, do: [phys({ scale: [{ ratio: 4.5, stat: "thorns" }] })] }),
  // Hoplite
  a("hoplite", "aspis", "Aspis", "Aegis on the lowest ally.", { ...timing("long", "quick"), mp: 500, ...waitsFor("allies", { lacks: "aegis" }), target: lacking(T.lowestShareAlly, "aegis"), do: [apply("aegis")] }),
  a("hoplite", "paired_guard", "Paired guard", "Guards itself and the other lowest ally.", { ...timing("long", "normal"), mp: 325, target: "self", do: [apply("guard"), apply("guard", { to: T.otherLowestShareAlly })] }),
  // Bigger than a normal hit: Phalanx boosts the Hoplite's swing, not the thrust.
  a("hoplite", "spear_thrust", "Spear thrust", "A thrust at a random foe that adds a few Sunder.", { ...timing("medium", "long"), mp: 325, do: [phys(from("attack", 1.1), { apply: [{ status: "sunder", stacks: stacks("few", "attack") }] })] }),
  // Paladin
  a("paladin", "sanctuary", "Sanctuary", "Ward on every ally.", { ...timing("long", "long"), mp: 1000, target: T.everyAlly, do: [apply("ward")] }),
  a("paladin", "absolve", "Absolve", "Cleanses and heals itself and the lowest other ally; the heal scales from Attack.", {
    ...timing("medium", "normal"), mp: 650, ...waitsFor("allies", { hpBelow: 100 }), target: "self",
    do: [{ op: "remove", label: "debuff" }, { op: "heal", amount: from("attack", 0.4) }, { op: "remove", label: "debuff", to: T.otherLowestShareAlly }, { op: "heal", amount: from("attack", 0.4), to: T.otherLowestShareAlly }],
  }),
  a("paladin", "smite", "Smite", "Heavy damage to the foe with the highest Attack, adding several Burn.", {
    ...timing("medium", "long"), mp: 650, target: T.highestAMFoe, do: [phys(hit("attack", "normal"), { apply: [{ status: "burn", stacks: stacks("several", "attack") }] })],
  }),
  // Valkyrie
  a("valkyrie", "gale_spear", "Gale spear", "Three quick hits on a foe that isn't Taunting, each adding a few Shock.", {
    ...timing("quick", "quick"), mp: 200, seek: true, target: T.notTauntingFoe, do: [phys(from("attack", 0.09), { hits: 3, apply: [{ status: "shock", stacks: stacks("few", "attack", 0.5) }] })],
  }),
  a("valkyrie", "rally", "Rally", "Heals the lowest ally; the amount scales from Attack.", {
    ...timing("medium", "normal"), mp: 650, ...waitsFor("allies", { hpBelow: 80 }), target: T.lowestShareAlly, do: [{ op: "heal", amount: from("attack", RALLY) }],
  }),
  // "Every action ready" is Einherjar's (its passive status's `revives`), so a Valkyrie trained to Chooser of the slain raises on cooldown.
  a("valkyrie", "valhalla", "Valhalla", "Revives a random knocked-out ally with a tenth of its HP.", {
    ...timing("very_long", "quick"), mp: 650, ...waitsFor("allies", { ko: true }), target: T.koAlly, do: [{ op: "revive", hp: { scale: [{ ratio: REVIVE.tenth, stat: "max_hp", of: "target" }] } }],
  }),
  // Bard
  a("bard", "war_ballad", "War ballad", "A few Might on every ally.", { ...timing("quick", "quick"), mp: 450, target: T.everyAlly, do: [apply("might", { stacks: stacks("few", "attack") })] }),
  a("bard", "allegro", "Allegro", "Haste on every ally.", { ...timing("long", "quick"), mp: 650, target: T.everyAlly, do: [apply("haste")] }),
  a("bard", "thunder_chord", "Thunder chord", "Several Shock on every foe.", { ...timing("short", "normal"), mp: 650, target: T.everyFoe, do: [apply("shock", { stacks: stacks("several", "attack") })] }),
  // Hexer
  a("hexer", "malison", "Malison", "A few Burn and a few Shock on every foe.", { ...timing("short", "normal"), mp: 450, target: T.everyFoe, do: [apply("burn", { stacks: stacks("few", "attack") }), apply("shock", { stacks: stacks("few", "attack") })] }),
  a("hexer", "unmake", "Unmake", "Silences the casting foe with the highest Attack and strips its buffs. Waits for a foe to cast.", {
    ...timing("medium", "quick"), mp: 650, ...waitsFor("foes", { casting: true }), target: T.castingFoe, do: [apply("silence"), { op: "remove", label: "buff" }],
  }),
  a("hexer", "enfeeble", "Enfeeble", "Weakens the foe with the highest Attack and adds a few Sunder.", { ...timing("quick", "normal"), mp: 450, target: T.highestAMFoe, do: [apply("weaken"), apply("sunder", { stacks: stacks("few", "attack") })] }),
  // Monk
  a("monk", "flow", "Flow", "Haste on itself.", { ...timing("long", "quick"), mp: 200, target: "self", do: [apply("haste")] }),
  a("monk", "burning_fist", "Burning fist", "Three quick burning blows on the foe with the most Burn, each adding a few.", {
    // About 3 Burn a hit, 9 a cast at base, so the Monk stays a smaller Burn engine than the Pyromancer.
    ...timing("quick", "quick"), mp: 200, target: T.mostFoe("burn"), do: [phys(from("attack", 0.11), { hits: 3, apply: [{ status: "burn", stacks: stacks("few", "attack", 0.6) }] })],
  }),
  a("monk", "pressure_point", "Pressure point", "Stuns the foe with the highest Attack, past any guard.", {
    ...timing("medium", "normal"), mp: 325, seek: true, target: lacking(T.highestAMFoe, "stun", true), do: [phys(hit("attack", "normal"), { apply: [{ status: "stun" }] })],
  }),
  // Assassin
  a("assassin", "vanish", "Vanish", "Goes Hidden.", { ...timing("short", "quick"), mp: 200, ...waitsFor("self", { lacks: "hidden" }), target: "self", do: [apply("hidden")] }),
  a("assassin", "backstab", "Backstab", "Damage scaling from Crit chance to the foe with the lowest HP, past any guard.", { ...timing("medium", "normal"), mp: 325, seek: true, target: T.lowestHpFoe, do: [phys(hit("crit_chance", "normal"))] }),
  a("assassin", "garrote", "Garrote", "Silences a random foe that isn't Taunting, past any guard.", {
    ...timing("medium", "quick"), mp: 325, seek: true, target: lacking(T.notTauntingFoe, ["taunt", "silence"], true), do: [phys(hit("attack", "normal"), { apply: [{ status: "silence" }] })],
  }),
  // Vampire
  a("vampire", "blood_drain", "Blood drain", "Damage scaling from max HP to a random foe, which is Weakened.", { ...timing("quick", "quick"), mp: 125, do: [phys(from("max_hp", 0.4), { apply: [{ status: "weaken" }] })] }),
  a("vampire", "blood_gift", "Blood gift", "Spends a fifth of its max HP to heal the lowest other ally for as much, and gives it Clarity.", {
    // It waits until the Vampire itself is at 35% HP or more, so the price (a fifth) never kills it.
    ...timing("medium", "normal"), mp: 450, if: [{ side: "others", where: { hpBelow: 80 } }, { side: "self", where: { hpAtLeast: 35 } }], target: T.otherLowestShareAlly,
    // The price is paid with `pay`, HP lost at once, not damage: no Shield soaks it, nothing reacts, never below 1 HP.
    do: [{ op: "pay", hp: from("max_hp", 0.2), to: "self" }, { op: "heal", amount: from("max_hp", 0.2) }, apply("clarity")],
  }),
  a("vampire", "frenzy", "Frenzy", "Several Might on itself.", { ...timing("medium", "quick"), mp: 450, target: "self", do: [apply("might", { stacks: stacks("several", "attack") })] }),
  // Pyromancer
  a("pyromancer", "firebolt", "Firebolt", "A bolt of fire at the foe with the most Burn, adding several.", { ...timing("quick", "normal"), mp: 450, target: T.mostFoe("burn"), do: [phys(hit("attack", "light"), { apply: [{ status: "burn", stacks: stacks("several", "attack", BURN_STACKS) }] })] }),
  a("pyromancer", "fireball", "Fireball", "A ball of fire on every foe, adding a few Burn to each.", { ...timing("medium", "long"), mp: 1000, target: T.everyFoe, do: [phys(hit("attack", "touch"), { apply: [{ status: "burn", stacks: stacks("few", "attack", BURN_STACKS) }] })] }),
  a("pyromancer", "pyre", "Pyre", "Heavy damage on the foe with the most Burn, rising with each stack. The Burn stays.", {
    // 200 a stack of Burn: the ramp's payoff, not a second ramp.
    ...timing("long", "very_long"), mp: 1500, target: T.mostFoe("burn"), do: [phys({ scale: [{ ratio: HIT.heavy, stat: "attack" }, { ratio: 200, stacks: "burn", of: "target" }] })],
  }),
  // Frostweaver
  // About 6 Chill a lance at Attack 4, so a shatter takes more than one cast.
  a("frostweaver", "frost_lance", "Frost lance", "A lance of ice at the foe with the most Chill, adding several.", { ...timing("quick", "normal"), mp: 450, target: T.mostFoe("chill"), do: [phys(hit("attack", "light"), { apply: [{ status: "chill", stacks: stacks("several", "attack", 0.6) }] })] }),
  a("frostweaver", "blizzard", "Blizzard", "A blizzard on every foe, adding a few Chill to each.", { ...timing("medium", "long"), mp: 1000, target: T.everyFoe, do: [phys(hit("attack", "touch"), { apply: [{ status: "chill", stacks: stacks("few", "attack", 0.45) }] })] }),
  a("frostweaver", "stillness", "Stillness", "Clarity on the ally with the least MP, if one is under half, and a few Chill on every foe.", { ...timing("medium", "quick"), mp: 650, target: T.everyFoe, do: [apply("chill", { stacks: stacks("few", "attack", 0.5) }), apply("clarity", { to: T.needsMpAlly })] }),
  // Stormcaller
  a("stormcaller", "chain_lightning", "Chain lightning", "Lightning at a random foe, then up to three others, adding a few Shock to each.", {
    ...timing("quick", "quick"), mp: 650,
    do: [
      phys(hit("attack", "light"), { apply: [{ status: "shock", stacks: stacks("few", "attack", SHOCK_STACKS) }] }),
      phys(hit("attack", "touch"), { apply: [{ status: "shock", stacks: stacks("few", "attack", SHOCK_STACKS) }], to: T.threeOtherFoes }),
    ],
  }),
  a("stormcaller", "thunderstorm", "Thunderstorm", "Lightning on every foe, adding a few Shock to each.", { ...timing("medium", "normal"), mp: 1000, target: T.everyFoe, do: [phys(hit("attack", "touch"), { apply: [{ status: "shock", stacks: stacks("few", "attack", SHOCK_STACKS) }] })] }),
  a("stormcaller", "static_charge", "Static charge", "Haste on itself.", { ...timing("long", "quick"), mp: 650, target: "self", do: [apply("haste")] }),
  // Geomancer
  a("geomancer", "earthen_shell", "Earthen shell", "Shields itself and the other lowest ally; the amount scales from Defense.", {
    ...timing("medium", "normal"), mp: 650, ...waitsFor("allies", { belowCap: "shield" }), target: "self",
    do: [apply("shield", { stacks: from("defense", 1.0), to: { side: "self", where: { belowCap: "shield" } } }), apply("shield", { stacks: from("defense", 1.0), to: { ...T.otherLowestShareAlly, where: { belowCap: "shield" } } })],
  }),
  a("geomancer", "rockfall", "Rockfall", "Damage scaling from Defense on a random foe.", { ...timing("short", "long"), mp: 450, do: [phys(hit("defense", "normal"))] }),
  a("geomancer", "tremor", "Tremor", "Damage scaling from Defense on a random foe, which is Stunned.", { ...timing("long", "very_long"), mp: 1000, target: lacking({ side: "foes" }, "stun", true), do: [phys(hit("defense", "normal"), { apply: [{ status: "stun" }] })] }),
];

// ─── Classes ─────────────────────────────────────────────────────────────────

const cls = (id: string, name: string, text: string, body: Omit<ClassDefT, "id" | "name" | "text" | "source" | "abilities"> & { source?: ClassDefT["source"] }): ClassDefT => ({
  id, name, text, source: body.source ?? "unlock", stats: body.stats, weapons: body.weapons, armor: body.armor, offhands: body.offhands, passive: body.passive,
  abilities: abilities.filter((x) => x.class === id).map((x) => x.id),
});
const p = (status: string, name: string, text: string) => ({ name, text, statuses: [status] });

export const classes: ClassDefT[] = [
  cls("knight", "Knight", "Protector. Starts every fight behind its own Shield, Guards whoever is lowest, calls every foe onto itself while an ally regains its mana, and bashes a foe with the weight of its own body.", {
    source: "starter", stats: stat(5, 2, 2, 3, 4, 2, 5), weapons: ["sword", "great_weapon"], armor: ["plate"], offhands: ["kite_shield", "horn"], passive: p("vanguard", "Vanguard", "It starts every fight behind a Shield that scales from its max HP."),
  }),
  cls("cleric", "Cleric", "Healer. Mends whoever is lowest with quick, small heals, lifts a curse and wraps the ally in Regen, raises the fallen, and prays twice as fast when its own life is in danger.", {
    source: "starter", stats: stat(2, 5, 4, 4, 2, 2, 1), weapons: ["mace", "staff"], armor: ["robes"], offhands: ["relic", "bell"], passive: p("last_rites", "Last rites", "Below 30% of its max HP, its cooldowns are halved."),
  }),
  cls("ranger", "Ranger", "Wears down tough targets. Looses barbed, cold and rending arrows at whatever stands in front, while its plain arrows fly past any guard and open the wounds.", {
    source: "starter", stats: { ...stat(3, 3, 3, 4, 2, 3, 2), ...special("accuracy", "medium") }, weapons: ["bow", "dagger"], armor: ["leather"], offhands: ["totem"], passive: p("hunters_eye", "Hunter's eye", "Its basic attacks ignore Taunt."),
  }),
  cls("bramble_knight", "Bramble knight", "Thorns tank. Draws every foe onto its thorns, where each attacker is left bleeding for the party's blows, regrows whoever is lowest, and lashes out with the thorns themselves.", {
    stats: { ...stat(5, 2, 2, 3, 3, 2, 5), ...special("thorns", "high") }, weapons: ["sword", "staff"], armor: ["plate", "mail"], offhands: ["totem"], passive: p("briar", "Briar", "Each time its Thorns damage a foe, that foe gets a few Bleed; stacks scale from Defense."),
  }),
  cls("hoplite", "Hoplite", "Bodyguard who opens foes up. Plants its great shield beside the most vulnerable ally to catch the killing blow, locks shields with it, and leaves foes sundered with slow, crushing blows.", {
    stats: stat(4, 2, 2, 4, 5, 2, 5), weapons: ["spear", "great_weapon"], armor: ["plate"], offhands: ["round_shield"], passive: p("phalanx", "Phalanx", "Its basic attacks come half as often and deal double damage."),
  }),
  cls("paladin", "Paladin", "Shelter. Wards the party against the blows that land, lifts its curses, and brings down slow, heavy, burning judgement, half again as hard on any foe that holds a buff.", {
    stats: { ...stat(4, 3, 3, 4, 4, 2, 4) }, weapons: ["rune_sword", "mace"], armor: ["mail", "plate"], offhands: ["kite_shield", "lantern"], passive: p("judgement", "Judgement", "Its hits deal half again as much damage to foes with a buff."),
  }),
  cls("valkyrie", "Valkyrie", "Storm spear who heals and revives. A storm-borne spear that reaches past any guard and Shocks what it hits, mends the wounded, and snatches the fallen back ready to fight.", {
    stats: stat(3, 3, 3, 4, 3, 3, 3), weapons: ["spear", "rune_sword"], armor: ["mail", "leather"], offhands: ["round_shield", "relic"], passive: p("einherjar", "Einherjar", "Allies it revives come back with all their actions ready, instead of on cooldown."),
  }),
  cls("bard", "Bard", "Party tempo. A caster at the back whose every note mends an ally a little and gives another mana, with a ballad that steadies the whole party, an allegro that quickens it, and thunder that shocks every foe.", {
    stats: stat(3, 4, 3, 3, 3, 2, 1), weapons: ["bow", "wand"], armor: ["leather", "robes"], offhands: ["horn", "tome"], passive: p("refrain", "Refrain", "Each of its basic attacks that lands heals a random ally and gives a random ally MP, each a share of the damage dealt."),
  }),
  cls("hexer", "Hexer", "Curser. The debuff bot: burns and shocks every foe a little so the party's statuses pile up, weakens and sunders the most dangerous one, chills whatever it strikes, and silences a foe mid-cast.", {
    stats: { ...stat(2, 4, 3, 4, 1, 2, 1), ...special("siphon", "medium") }, weapons: ["dagger", "rune_sword"], armor: ["mail"], offhands: ["idol"], passive: p("cold_hex", "Cold hex", "Its basic attacks add a few Chill, whatever weapon it carries; stacks scale from Attack."),
  }),
  cls("monk", "Monk", "Sunders with a blur of blows. Every blow leaves the foe a little more open, Flow keeps it fast, burning fists pile onto the hottest foe, and a pressure point drops the most dangerous one for a moment.", {
    stats: { ...stat(3, 2, 3, 4, 2, 2, 2), attack: 3700, ...special("evasion", "high"), ...special("double_strike", "medium") }, weapons: ["fist", "spear"], armor: ["leather"], offhands: ["bell"],
    passive: p("iron_palm", "Iron palm", "Its basic attacks, and the second strike of its Double strike, add a few Sunder; stacks scale from Attack."),
  }),
  cls("assassin", "Assassin", "Burst killer. Slips out of sight, picks off the weakest foe past any guard, leaves every crit a bleeding wound, and silences the back line.", {
    stats: { ...stat(2, 3, 3, 5, 2, 5, 1), ...special("crit_damage", "high"), ...special("evasion", "medium") }, weapons: ["dagger", "sword"], armor: ["leather"], offhands: ["vial"],
    passive: p("lacerate", "Lacerate", "Each of its crits adds several Bleed to the foe; stacks scale from Attack."),
  }),
  cls("vampire", "Vampire", "Drains to outlast. Feeds on everything it hits: the harder it hits, the more it heals, its prey is left weakened, and it bleeds its own life into an ally's wounds and mana.", {
    stats: { ...stat(4, 2, 2, 4, 2, 2, 3), ...special("lifesteal", "high") }, weapons: ["fist", "great_weapon"], armor: ["mail"], offhands: ["vial", "idol"],
    passive: p("bloodlust", "Bloodlust", "While it's below half of its max HP, its Lifesteal is doubled."),
  }),
  cls("pyromancer", "Pyromancer", "Ramping Burn. Every strike adds Burn, bolts pile more onto the hottest foe, and a pyre lands on it.", {
    stats: stat(2, 5, 2, 5, 1, 2, 1), weapons: ["staff", "wand"], armor: ["robes"], offhands: ["lantern"], passive: p("kindling", "Kindling", "Its basic attacks add a few Burn, whatever weapon it carries; stacks scale from Attack."),
  }),
  cls("frostweaver", "Frostweaver", "Freezes and shatters. Buries foes in Chill until it shatters into damage and a Stun, leaves the shattered foe sundered for the party, and spends the time it buys keeping an ally's mana flowing.", {
    stats: { ...stat(2, 4, 3, 4, 2, 2, 1) }, weapons: ["rod", "staff"], armor: ["robes"], offhands: ["tome"], passive: p("shatterpoint", "Shatterpoint", "When a foe's Chill shatters, that foe takes several Sunder; stacks scale from Attack."),
  }),
  cls("stormcaller", "Stormcaller", "Shocks every foe. Rains quick strikes across every foe so the fast and the many hurt themselves by acting, and charges itself up to strike faster.", {
    stats: stat(2, 3, 3, 4, 1, 2, 1), weapons: ["wand", "rod"], armor: ["robes"], offhands: ["bell"], passive: p("arc", "Arc", "Each of its basic attacks also hits a second, random foe, and adds a few Shock to both; stacks scale from Attack."),
  }),
  cls("geomancer", "Geomancer", "Hits hardest behind stone. Wraps itself and an ally in stone; while its own Shield holds, its rocks crit far more often and far harder, and a tremor drops a foe now and then.", {
    stats: { ...stat(3, 3, 3, 4, 4, 4, 3), ...special("crit_damage", "high") }, weapons: ["great_weapon", "rune_sword"], armor: ["plate"], offhands: ["totem"], passive: p("bedrock", "Bedrock", "While its Shield pool is above zero, its crit chance is doubled."),
  }),
];
/**
 * Each class's MP pool, in points, set by how many regular fights it lasts from full (`npx tsx tools/rogue-acts.ts`, the
 * endurance line): every class runs dry in about two or three fights, casters and walls close together, erring scarce. MP
 * comes back on the bench, never in a fight by itself. The pool, not the cost ladder, is the class's MP identity.
 */
export const MP_POOL: Record<string, number> = {
  knight: 1, cleric: 2.2, ranger: 2.1, bramble_knight: 1.7, hoplite: 1.3, paladin: 3.3,
  valkyrie: 1.5, bard: 2.4, hexer: 1.7, monk: 0.75, assassin: 1.45, vampire: 1.7,
  pyromancer: 3.8, frostweaver: 2.3, stormcaller: 2.3, geomancer: 2.3,
};
for (const k of classes) if (MP_POOL[k.id] !== undefined) k.stats.max_mp = pts(MP_POOL[k.id]);

