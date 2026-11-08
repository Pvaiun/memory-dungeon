/**
 * The 16 classes (docs/core-set/classes.md): stats, passives, abilities.
 * Every number comes from scale.ts; the words are the documents'.
 */
import type { AbilityT, ClassDefT, NumT, StatusT, TargetRuleT } from "../../src/schema.js";
import { BURN_STACKS, SHOCK_STACKS, COOLDOWN, HIT, KIT, REVIVE, SPECIAL, SPECIAL_KEY, STACKS, STATUS, WINDUP, crit, from, jitter, aggroOf, pts, stacks, type HitWord, type SpecialLevel, type SpecialStat, type StackWord } from "./scale.js";
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
  otherHighestAMAlly: { side: "others", pick: "highest", by: { stats: ["attack"] } } satisfies TargetRuleT,
  /** A foe in a wind-up, else the foe with the highest Attack (Unmake, which waits for a cast or a buff). */
  castingElseHighestAMFoe: { side: "foes", where: { casting: true }, ifNone: "any", pick: "highest", by: { stats: ["attack"] } } satisfies TargetRuleT,
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
/** Of a hit's or application's target: 1 if it holds the status, else 0 (Malison deepens what a foe already holds). */
const ifHeld = (status: string): NumT => ({ scale: [{ ratio: 1, when: { has: status }, of: "target" }] });
/** The afflictions Malison deepens: the built-up statuses, one more stack of each a foe holds. */
export const DEEPENED = ["burn", "chill", "shock", "sunder"] as const;
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
  // Two crit steps on basic attacks alone: the marksman's crits, which the dagger's and bow's signatures feed.
  passive("hunters_eye", "Hunter's eye", { text: "Basic attacks ignore Taunt and crit more often.", seek: "basic", crits: [{ tag: "basic", chance: crit(KIT.hunterCrit) }] }),
  // Survivable by attacking: the Shield grows as she fights and is spent as she's hit. It reads Attack (bigger hits) and max HP (the cap).
  passive("shieldmaiden", "Shieldmaiden", { text: "Each hit it lands gives it a Shield of a share of the damage dealt.", reactions: [{ on: { event: "hit_lands" }, do: [apply("shield", { stacks: { scale: [{ ratio: KIT.shieldmaiden, amount: true }] }, to: "holder" })] }] }),
  passive("briar", "Briar", { text: "Foes its Thorns wound start to bleed.", reactions: [{ on: { event: "damage_dealt", status: "thorns" }, do: [apply("bleed", { stacks: own("few", "defense"), to: "other" })] }] }),
  passive("phalanx", "Phalanx", { text: "Basic attacks half as often, for double damage.", stats: [{ stat: "attack_speed", flat: -100 }], boosts: [{ tag: "basic", pct: 100 }] }),
  // The judge: a buff or a debuff, either one, half again (a foe holding both isn't doubled: the second term asks for no debuff).
  passive("judgement", "Judgement", { text: "Hits deal half again as much to foes with a buff or a debuff.", boosts: bothKinds({ scale: [{ ratio: 50, when: { debuffs: true }, of: "target" }, { ratio: 50, when: { buffs: true, debuffs: false }, of: "target" }] }) }),
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
  // Burn stoked by its casts, not its swings: the caster. With no foe burning, the pick falls on any foe.
  passive("stoke", "Stoke", { text: "Each ability it casts adds a few Burn to the foe with the most Burn.", reactions: [{ on: { event: "action_resolve", kind: "ability" }, do: [apply("burn", { stacks: own("few", "attack", BURN_STACKS), to: T.mostFoe("burn") })] }] }),
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
  // ─── Kit statuses the base abilities apply ───
  // Encore: the ally's next ability resolves again at once, free (a recast), and the Encore is spent. The repeat's own event skips it.
  { id: "encore", name: "ENCORE", text: "Its next ability is cast twice; the second cast is free.", label: "buff", show: "icon", stacking: "refresh", reactions: [{ on: { event: "action_resolve", kind: "ability", repeat: false }, do: [{ op: "recast" }, { op: "remove", label: "buff", status: "encore", to: "holder" }] }] },
  // Thunderstorm: the party's storm. Each ally's swings add Shock sized from the Stormcaller's Attack (the status knows its source).
  { id: "thunderstorm_storm", name: "THUNDERSTORM", text: "Its basic attacks add a few Shock.", label: "buff", show: "icon", stacking: "refresh", perSource: {}, duration: KIT.storm.duration,
    reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("shock", { stacks: { scale: [{ ratio: (STACKS.few * SHOCK_STACKS) / P, stat: "attack", of: "source" }] }, to: "other" })] }] },
  // Static charge: Attack speed, not Haste (the Monk's Flow is Haste).
  { id: "static_charge_on", name: "CHARGED", text: "Basic attacks come faster.", label: "buff", show: "icon", stacking: "refresh", duration: KIT.staticCharge.duration, stats: [{ stat: "attack_speed", flat: KIT.staticCharge.speed }] },
];

// ─── Abilities ───────────────────────────────────────────────────────────────

// MP costs are set by hand, ability by ability (no rule from a stat to a cost), in two tiers: skills (the physical classes' and
// the Valkyrie's spear) and spells (the healers', the Bard's, Hexer's and Paladin's, the four mages', the Vampire's dark arts),
// which cost more: the more a unit is a caster, the more mana matters.
type A = Omit<AbilityT, "class"> & { class: string };
// Each ability's cooldown is its word's, moved by its id (scale.ts, jitter), so no two in a kit are the same.
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
  // The shove: the bruiser's Defense as damage on every foe, with Sunder from the same stat. No Taunt anywhere in the kit.
  a("hoplite", "othismos", "Othismos", "A shove with the whole shield: damage scaling from Defense to every foe, adding a few Sunder to each.", {
    ...timing("medium", "long"), mp: 325, target: T.everyFoe, do: [phys(hit("defense", "light"), { apply: [{ status: "sunder", stacks: stacks("few", "defense") }] })],
  }),
  // Bigger than a normal hit: Phalanx boosts the Hoplite's swing, not the thrust.
  a("hoplite", "spear_thrust", "Spear thrust", "A thrust at a random foe that adds a few Sunder.", { ...timing("medium", "long"), mp: 325, do: [phys(from("attack", 1.1), { apply: [{ status: "sunder", stacks: stacks("few", "attack") }] })] }),
  // Paladin
  // Condemn: Marked is a debuff, so the Mark turns Judgement on, and the party's volley lands on the judged.
  a("paladin", "condemn", "Condemn", "Marks the foe with the highest Attack, and every ally's next basic attack comes at once.", {
    ...timing("medium", "quick"), mp: 650, target: T.highestAMFoe, do: [apply("marked"), { op: "cooldown", which: "basic", set: "ready", to: T.everyAlly }],
  }),
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
  // Choosing: the heal and the revive in one. Each part has its own target, so with an ally down and another hurt it does both.
  a("valkyrie", "choosing", "Choosing", "Heals the lowest ally; the amount scales from Attack. If an ally is down, raises it with a tenth of its HP.", {
    ...timing("medium", "normal"), mp: 650, if: { any: [{ side: "allies", where: { hpBelow: 80 } }, { side: "allies", where: { ko: true } }] }, target: T.lowestShareAlly,
    do: [{ op: "heal", amount: from("attack", KIT.choosing) }, { op: "revive", hp: { scale: [{ ratio: REVIVE.tenth, stat: "max_hp", of: "target" }] }, to: T.koAlly }],
  }),
  // Gale spear stacks the Shock, Skyfall cashes it and leaves it: the storm spear's beat.
  a("valkyrie", "skyfall", "Skyfall", "A heavy blow from above on the foe with the most Shock, rising with each Shock stack on it. The Shock stays.", {
    ...timing("medium", "normal"), mp: 325, target: T.mostFoe("shock"), do: [phys({ scale: [{ ratio: HIT.heavy, stat: "attack" }, { ratio: KIT.skyfallPerShock, stacks: "shock", of: "target" }] })],
  }),
  // Bard
  a("bard", "war_ballad", "War ballad", "A few Might on every ally.", { ...timing("quick", "quick"), mp: 450, target: T.everyAlly, do: [apply("might", { stacks: stacks("few", "attack") })] }),
  a("bard", "allegro", "Allegro", "Haste on every ally.", { ...timing("long", "quick"), mp: 650, target: T.everyAlly, do: [apply("haste")] }),
  // The conductor's verb: an ally's next spell sounds twice.
  a("bard", "encore", "Encore", "The other ally with the highest Attack casts its next ability twice; the second cast is free.", { ...timing("medium", "quick"), mp: 650, target: T.otherHighestAMAlly, do: [apply("encore")] }),
  // Hexer
  // The status amplifier: one more stack of each affliction a foe holds (nothing lands on a foe that holds none), and Bleed of its own.
  a("hexer", "malison", "Malison", "Deepens every affliction each foe holds: one more stack of each of Burn, Chill, Shock and Sunder it already has, and a few Bleed.", {
    ...timing("short", "normal"), mp: 450, target: T.everyFoe, do: [...DEEPENED.map((st) => apply(st, { stacks: ifHeld(st) })), apply("bleed", { stacks: stacks("few", "attack") })],
  }),
  // It waits for a cast or a buff. A caster is the pick; with none casting, the foe with the highest Attack (usually the buffed one).
  a("hexer", "unmake", "Unmake", "Silences the casting foe with the highest Attack and strips its buffs. Waits for a foe to cast or to hold a buff.", {
    ...timing("medium", "quick"), mp: 650, if: { any: [{ side: "foes", where: { casting: true } }, { side: "foes", where: { buffs: true } }] }, target: T.castingElseHighestAMFoe, do: [apply("silence"), { op: "remove", label: "buff" }],
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
  // The party's storm: Shock on every ally's swings for a while, not a nuke (Fireball is the nuke, Blizzard the field's Chill).
  a("stormcaller", "thunderstorm", "Thunderstorm", "For a while, every ally's basic attacks add a few Shock; stacks scale from the Stormcaller's Attack.", { ...timing("medium", "normal"), mp: 650, target: T.everyAlly, do: [apply("thunderstorm_storm")] }),
  a("stormcaller", "static_charge", "Static charge", "Its basic attacks come faster for a while.", { ...timing("long", "quick"), mp: 650, target: "self", do: [apply("static_charge_on")] }),
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
    source: "starter", stats: stat(5, 2, 2, 2, 4, 1, 5), weapons: ["sword", "hammer"], armor: ["plate"], offhands: ["kite_shield", "horn"], passive: p("vanguard", "Vanguard", "It starts every fight behind a Shield that scales from its max HP."),
  }),
  cls("cleric", "Cleric", "Healer. Mends whoever is lowest with quick, small heals, lifts a curse and wraps the ally in Regen, raises the fallen, and prays twice as fast when its own life is in danger.", {
    source: "starter", stats: stat(2, 5, 4, 3, 2, 1, 1), weapons: ["mace", "staff"], armor: ["robes"], offhands: ["relic", "lantern"], passive: p("last_rites", "Last rites", "Below 30% of its max HP, its cooldowns are halved."),
  }),
  cls("ranger", "Ranger", "The marksman. Looses barbed, cold and rending arrows at whatever stands in front, while its plain arrows fly past any guard, crit for a living and open the wounds.", {
    source: "starter", stats: { ...stat(3, 3, 3, 4, 2, 4, 2), ...special("accuracy", "medium") }, weapons: ["bow", "dagger"], armor: ["leather"], offhands: ["trophy", "cloak"], passive: p("hunters_eye", "Hunter's eye", "Its basic attacks ignore Taunt and crit more often."),
  }),
  cls("bramble_knight", "Bramble knight", "Thorns tank. Draws every foe onto its thorns, where each attacker is left bleeding for the party's blows, regrows whoever is lowest, and lashes out with the thorns themselves.", {
    stats: { ...stat(5, 2, 2, 2, 3, 1, 5), ...special("thorns", "high") }, weapons: ["hammer", "mace"], armor: ["plate", "mail"], offhands: ["totem", "round_shield"], passive: p("briar", "Briar", "Each time its Thorns damage a foe, that foe gets a few Bleed; stacks scale from Defense."),
  }),
  cls("hoplite", "Hoplite", "The bruiser. Slow double swings, a thrust that opens one foe up, a shove with the whole shield that sunders every foe, and an Aegis on the ally about to take the killing blow. Very tanky and hits hard; nothing it does draws fire.", {
    stats: stat(4, 2, 2, 5, 5, 2, 3), weapons: ["spear", "great_weapon"], armor: ["plate"], offhands: ["round_shield", "horn"], passive: p("phalanx", "Phalanx", "Its basic attacks come half as often and deal double damage."),
  }),
  cls("paladin", "Paladin", "The judge: helper of the righteous, killer of the wicked. Its hits land half again as hard on any foe that holds a buff or a debuff; it condemns one foe and the whole party strikes it; it lifts curses and heals; and it brings down a slow, heavy, burning Smite.", {
    stats: { ...stat(4, 3, 3, 4, 4, 2, 3) }, weapons: ["mace", "great_weapon"], armor: ["mail", "plate"], offhands: ["kite_shield", "relic"], passive: p("judgement", "Judgement", "Its hits deal half again as much damage to foes with a buff or a debuff."),
  }),
  cls("valkyrie", "Valkyrie", "The shieldmaiden: a quick, survivable damage dealer, not a tank. Her spear builds her Shield as it strikes, three quick hits reach past any guard and shock what they hit, a heavy blow from above cashes the Shock in, and she chooses the slain: one ability mends the lowest ally or raises a fallen one.", {
    stats: { ...stat(3, 3, 3, 4, 3, 3, 2), ...special("cooldown", "medium") }, weapons: ["spear", "sword"], armor: ["mail", "leather"], offhands: ["round_shield", "cloak"], passive: p("shieldmaiden", "Shieldmaiden", "Each hit it lands gives it a Shield of a share of the damage dealt."),
  }),
  cls("bard", "Bard", "Party tempo. A caster at the back whose every note mends an ally a little and gives another mana, with a ballad that steadies the party, an allegro that quickens it, and an encore that makes an ally's next spell sound twice.", {
    stats: { ...stat(3, 4, 3, 3, 2, 2, 1), ...special("cooldown", "medium") }, weapons: ["bow", "wand"], armor: ["leather", "robes"], offhands: ["tome", "bell"], passive: p("refrain", "Refrain", "Each of its basic attacks that lands heals a random ally and gives a random ally MP, each a share of the damage dealt."),
  }),
  cls("hexer", "Hexer", "The spellblade. A blade that carries curses: its swing chills, its curses deepen every affliction a foe already holds, it weakens and sunders the most dangerous one, and it silences a foe mid-cast and strips what it holds.", {
    stats: { ...stat(3, 4, 3, 4, 2, 2, 1), ...special("siphon", "medium") }, weapons: ["wand", "sword"], armor: ["mail"], offhands: ["tome", "idol"], passive: p("cold_hex", "Cold hex", "Its basic attacks add a few Chill, whatever weapon it carries; stacks scale from Attack."),
  }),
  cls("monk", "Monk", "Sunders with a blur of blows. Every blow leaves the foe a little more open, Flow keeps it fast, burning fists pile onto the hottest foe, and a pressure point drops the most dangerous one for a moment.", {
    stats: { ...stat(3, 2, 3, 4, 1, 2, 2), ...special("evasion", "high"), ...special("double_strike", "medium") }, weapons: ["claws", "spear"], armor: ["leather"], offhands: ["bell", "cloak"],
    passive: p("iron_palm", "Iron palm", "Its basic attacks, and the second strike of its Double strike, add a few Sunder; stacks scale from Attack."),
  }),
  cls("assassin", "Assassin", "Burst killer. Slips out of sight, picks off the weakest foe past any guard, leaves every crit a bleeding wound, and silences the back line.", {
    stats: { ...stat(2, 3, 3, 5, 1, 5, 1), ...special("crit_damage", "high"), ...special("evasion", "medium") }, weapons: ["dagger", "axe"], armor: ["leather"], offhands: ["vial", "trophy"],
    passive: p("lacerate", "Lacerate", "Each of its crits adds several Bleed to the foe; stacks scale from Attack."),
  }),
  cls("vampire", "Vampire", "Drains to outlast. Feeds on everything it hits: the harder it hits, the more it heals, its prey is left weakened, and it bleeds its own life into an ally's wounds and mana.", {
    stats: { ...stat(4, 2, 2, 4, 2, 2, 3), ...special("lifesteal", "high") }, weapons: ["claws", "axe"], armor: ["mail"], offhands: ["vial", "idol"],
    passive: p("bloodlust", "Bloodlust", "While it's below half of its max HP, its Lifesteal is doubled."),
  }),
  cls("pyromancer", "Pyromancer", "The glass cannon of long casts. Every spell it casts stokes the fire on the hottest foe, bolts pile more onto it, a fireball spreads it, and a pyre lands.", {
    stats: { ...stat(2, 5, 2, 5, 1, 2, 1), ...special("cast_speed", "medium") }, weapons: ["staff", "wand"], armor: ["robes"], offhands: ["lantern", "orb"], passive: p("stoke", "Stoke", "Each ability it casts adds a few Burn to the foe with the most Burn; stacks scale from Attack."),
  }),
  cls("frostweaver", "Frostweaver", "The ice wall: a chunky supporting mage, and the Chill applier. It lays Chill on the field and on the most-chilled foe until the Chill itself shatters, leaves the shattered foe sundered, and keeps an ally's mana flowing while the frost builds.", {
    stats: { ...stat(3, 4, 3, 3, 3, 2, 2) }, weapons: ["staff", "rune_sword"], armor: ["robes", "mail"], offhands: ["tome", "orb"], passive: p("shatterpoint", "Shatterpoint", "When a foe's Chill shatters, that foe takes several Sunder; stacks scale from Attack."),
  }),
  cls("stormcaller", "Stormcaller", "The striker among the mages. Each swing arcs to a second foe, lightning chains, a storm puts Shock on every ally's swings, and it charges itself to swing faster.", {
    stats: { ...stat(2, 3, 3, 4, 1, 2, 1), ...special("attack_speed", "medium") }, weapons: ["claws", "rune_sword"], armor: ["robes", "leather"], offhands: ["totem", "bell"], passive: p("arc", "Arc", "Each of its basic attacks also hits a second, random foe, and adds a few Shock to both; stacks scale from Attack."),
  }),
  cls("geomancer", "Geomancer", "Hits hardest behind stone. Wraps itself and an ally in stone; while its own Shield holds, its rocks crit far more often and far harder, and a tremor drops a foe now and then.", {
    stats: { ...stat(3, 3, 3, 3, 5, 4, 3), ...special("crit_damage", "high") }, weapons: ["hammer", "great_weapon"], armor: ["plate"], offhands: ["kite_shield", "trophy"], passive: p("bedrock", "Bedrock", "While its Shield pool is above zero, its crit chance is doubled."),
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

