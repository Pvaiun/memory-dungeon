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
/**
 * The Vampire's Lifesteal, halfway between the medium and high words: its sustain, carried from fight to fight, was what made it
 * the strongest class over whole runs, so the trim goes there and its HP keeps the drainer's sturdiness.
 */
const VAMPIRE_LIFESTEAL = SPECIAL.lifesteal.medium;
/** Backstab's hit word, a word above normal: the burst killer kills sooner, and stays glass. Its trained forms read it too. */
export const BACKSTAB_HIT: HitWord = "heavy";
/**
 * Rockfall's hit word and cooldown: a word heavier and a word slower than the plain spell, for the same MP, so the Geomancer
 * hits hardest behind its stone in big, rarer rocks (Boulder, its double hit, takes the next cooldown word again).
 */
export const ROCKFALL = { hit: "heavy" as HitWord, cooldown: "medium" as const, boulder: "long" as const };
/** Vanguard's Shield, a share of the Knight's max HP at each fight's start (Grudge and Stonewall read it too). */
export const VANGUARD_SHIELD = 0.33;
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
  /** A fallen ally, else the ally with the lowest share of max HP (Choosing: one target, the slain first). */
  fallenElseLowestShareAlly: { side: "allies", where: { ko: true }, ifNone: "any", pick: "lowest", by: "hp_share" } satisfies TargetRuleT,
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
/** The afflictions Malison deepens: the built-up statuses, one more stack of each a foe holds. */
/** The five afflictions Malison counts. */
export const AFFLICTIONS = ["burn", "chill", "shock", "bleed", "sunder"] as const;
/** Malison's curse: a hit of `ratio` of Attack, a fifth more for each different affliction its target holds, counted once whatever its stacks. */
export const curse = (ratio: number): NumT => ({
  scale: [{ ratio, stat: "attack" }, ...AFFLICTIONS.map((status) => ({ ratio: ratio / 5, when: { has: status }, of: "target" as const, times: { stat: "attack", of: "self" as const } }))],
});
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
  passive("vanguard", "Vanguard", { text: `At fight start: a Shield of ${Math.round(VANGUARD_SHIELD * 100)}% of max HP.`, reactions: [{ on: { event: "fight_start" }, do: [apply("shield", { stacks: { scale: [{ ratio: VANGUARD_SHIELD, stat: "max_hp", of: "holder" }] }, to: "holder" })] }] }),
  // Two crit steps on basic attacks alone: the marksman's crits, which the dagger's and bow's signatures feed.
  passive("hunters_eye", "Hunter's eye", { text: `Basic attacks ignore Taunt and have +${crit(KIT.hunterCrit)}% Crit chance.`, seek: "basic", crits: [{ tag: "basic", chance: crit(KIT.hunterCrit) }] }),
  // Survivable by attacking: the Shield grows as she fights and is spent as she's hit. It reads Attack (bigger hits) and max HP (the cap).
  passive("shieldmaiden", "Shieldmaiden", { text: `On a hit: a Shield of ${Math.round(KIT.shieldmaiden * 100)}% of the damage.`, reactions: [{ on: { event: "hit_lands" }, do: [apply("shield", { stacks: { scale: [{ ratio: KIT.shieldmaiden, amount: true }] }, to: "holder" })] }] }),
  passive("briar", "Briar", { text: "Its Thorns add Bleed.", reactions: [{ on: { event: "damage_dealt", status: "thorns" }, do: [apply("bleed", { stacks: own("few", "defense"), to: "other" })] }] }),
  passive("phalanx", "Phalanx", { text: "Basic attacks come 50% as often and deal ×2.", stats: [{ stat: "attack_speed", flat: -100 }], boosts: [{ tag: "basic", pct: 100 }] }),
  // The judge: a buff or a debuff, either one, half again (a foe holding both isn't doubled: the second term asks for no debuff).
  passive("judgement", "Judgement", { text: "Hits deal +50% to foes with a buff or a debuff.", boosts: bothKinds({ scale: [{ ratio: 50, when: { debuffs: true }, of: "target" }, { ratio: 50, when: { buffs: true, debuffs: false }, of: "target" }] }) }),
  // Bloodlust's pattern.
  passive("last_rites", "Last rites", {
    text: "Below 30% HP: cooldowns 50% shorter.",
    reactions: [
      { on: { event: "hp_lost" }, do: [apply("last_rites_on", { to: { side: "self", where: { hpBelow: 30 } } })] },
      { on: { event: "healed" }, do: [{ op: "remove", label: "buff", status: "last_rites_on", to: { side: "self", where: { hpAtLeast: 30 } } }] },
    ],
  }),
  { id: "last_rites_on", name: "LAST RITES", text: "Cooldowns 50% shorter.", label: "buff", show: "icon", stacking: "fizzle", stats: [{ stat: "cooldown_reduction", flat: 100 }] },
  // A share of the damage dealt, so the Bard's weapon is a choice against the foe's Defense.
  passive("refrain", "Refrain", { text: `Basic attacks heal a random ally and give a random ally MP, each ${Math.round(STATUS.refrain.share * 100)}% of the damage.`, reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [
    { op: "heal", amount: { scale: [{ ratio: STATUS.refrain.share, amount: true }] }, to: { side: "allies", pick: "random" } },
    { op: "mp", amount: { scale: [{ ratio: STATUS.refrain.share, amount: true }] }, to: { side: "allies", pick: "random" } },
  ] }] }),
  passive("cold_hex", "Cold hex", { text: "Basic attacks add Chill.", reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("chill", { stacks: own("few", "attack", 1.3), to: "other" })] }] }), // A rider, so APPLIED takes it to a fifth: about 0.7 Chill a hit at Attack 4, and the shatter comes from a fight of swings.
  passive("iron_palm", "Iron palm", {
    text: "Basic attacks and extra strikes add Sunder.",
    reactions: [
      { on: { event: "hit_lands", kind: "basic" }, do: [apply("sunder", { stacks: own("few", "attack"), to: "other" })] },
      { on: { event: "hit_lands", kind: "extra" }, do: [apply("sunder", { stacks: own("few", "attack"), to: "other" })] },
    ],
  }),
  passive("lacerate", "Lacerate", { text: "Crits add Bleed.", reactions: [{ on: { event: "hit_lands", tags: ["crit"] }, do: [apply("bleed", { stacks: own("several", "attack"), to: "other" })] }] }),
  passive("bloodlust", "Bloodlust", {
    text: "Below 50% HP: Lifesteal ×2.",
    reactions: [
      { on: { event: "hp_lost" }, do: [apply("bloodlust_on", { to: { side: "self", where: { hpBelow: 50 } } })] },
      { on: { event: "healed" }, do: [{ op: "remove", label: "buff", status: "bloodlust_on", to: { side: "self", where: { hpAtLeast: 50 } } }] },
    ],
  }),
  { id: "bloodlust_on", name: "BLOODLUST", text: "Lifesteal ×2.", label: "buff", show: "icon", stacking: "fizzle", stats: [{ stat: "lifesteal", flat: { scale: [{ ratio: 1, stat: "lifesteal", of: "holder" }] } }] },
  // Burn stoked by its casts, not its swings: the caster. With no foe burning, the pick falls on any foe.
  passive("stoke", "Stoke", { text: "Each cast adds Burn to the foe with the most Burn.", reactions: [{ on: { event: "action_resolve", kind: "ability" }, do: [apply("burn", { stacks: own("few", "attack", BURN_STACKS), to: T.mostFoe("burn") })] }] }),
  passive("shatterpoint", "Shatterpoint", { text: "A foe whose Chill shatters gains Sunder.", reactions: [{ on: { event: "status_capped", status: "chill", whose: "foe" }, do: [apply("sunder", { stacks: own("several", "attack"), to: "owner" })] }] }),
  passive("arc", "Arc", {
    text: "Basic attacks also hit a 2nd random foe; both gain Shock.",
    strike: { to: T.secondFoe },
    reactions: [
      { on: { event: "hit_lands", kind: "basic" }, do: [apply("shock", { stacks: own("few", "attack", SHOCK_STACKS), to: "other" })] },
      { on: { event: "hit_lands", kind: "extra" }, do: [apply("shock", { stacks: own("few", "attack", SHOCK_STACKS), to: "other" })] },
    ],
  }),
  passive("bedrock", "Bedrock", {
    text: "While its Shield holds: Crit chance ×2.",
    reactions: [
      { on: { event: "status_gained", status: "shield" }, do: [apply("bedrock_on", { to: "holder" })] },
      { on: { event: "status_ended", status: "shield" }, do: [{ op: "remove", label: "buff", status: "bedrock_on", to: "holder" }] },
    ],
  }),
  { id: "bedrock_on", name: "BEDROCK", text: "Crit chance ×2.", label: "buff", show: "icon", stacking: "fizzle", stats: [{ stat: "crit_chance", flat: { scale: [{ ratio: 1, stat: "crit_chance", of: "holder" }] } }] },
  // ─── Kit statuses the base abilities apply ───
  // Encore: the ally's next ability resolves again at once, free (a recast), and the Encore is spent. The repeat's own event skips it.
  { id: "encore", name: "ENCORE", text: "Its next ability is cast 2 times; the 2nd is free.", label: "buff", show: "icon", stacking: "refresh", reactions: [{ on: { event: "action_resolve", kind: "ability", repeat: false }, do: [{ op: "recast" }, { op: "remove", label: "buff", status: "encore", to: "holder" }] }] },
  // Thunderstorm: the party's storm. Each ally's swings add Shock sized from the Stormcaller's Attack (the status knows its source).
  { id: "thunderstorm_storm", name: "THUNDERSTORM", text: "Basic attacks add Shock.", label: "buff", show: "icon", stacking: "refresh", perSource: {}, duration: KIT.storm.duration,
    reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("shock", { stacks: { scale: [{ ratio: (STACKS.few * SHOCK_STACKS) / P, stat: "attack", of: "source" }] }, to: "other" })] }] },
  // Static charge: Attack speed, not Haste (the Monk's Flow is Haste).
  { id: "static_charge_on", name: "CHARGED", text: `Basic attacks come ${KIT.staticCharge.speed}% faster.`, label: "buff", show: "icon", stacking: "refresh", duration: KIT.staticCharge.duration, stats: [{ stat: "attack_speed", flat: KIT.staticCharge.speed }] },
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
  a("knight", "fortify", "Fortify", "Guards the ally with the lowest HP%.", { ...timing("long", "quick"), mp: 325, target: T.lowestShareAlly, do: [apply("guard")] }),
  a("knight", "stand_fast", "Stand fast", "Taunts, and gives Clarity to the ally with the lowest MP%.", {
    ...timing("medium", "quick"), mp: 200, target: "self", do: [apply("taunt"), apply("clarity", { to: T.needsMpAlly })],
  }),
  a("knight", "shield_bash", "Shield bash", "Bashes a random foe and Stuns it.", {
    ...timing("medium", "quick"), mp: 325, target: lacking({ side: "foes" }, "stun", true), do: [phys(hit("max_hp", "light"), { apply: [{ status: "stun" }] })], // From max HP: the health tank.
  }),
  // Cleric: an active healer that spends MP, with no free heal.
  a("cleric", "renew", "Renew", "Cleanses the ally with the lowest HP%, a debuffed one first, and gives it Regen.", {
    ...timing("medium", "normal"), mp: 650, target: { side: "allies", where: { debuffs: true }, ifNone: "any", pick: "lowest", by: "hp_share" }, do: [{ op: "remove", label: "debuff" }, apply("regen")],
  }),
  a("cleric", "cure", "Cure", "Heals the ally with the lowest HP%.", {
    ...timing("quick", "quick"), mp: 450, ...waitsFor("allies", { hpBelow: 80 }), target: T.lowestShareAlly, do: [{ op: "heal", amount: from("attack", 0.35) }],
  }),
  a("cleric", "raise", "Raise", `Revives a random fallen ally with ${Math.round(REVIVE.half * 100)}% HP.`, {
    ...timing("very_long", "very_long"), mp: 650, ...waitsFor("allies", { ko: true }), target: T.koAlly, do: [{ op: "revive", hp: { scale: [{ ratio: REVIVE.half, stat: "max_hp", of: "target" }] } }],
  }),
  // Ranger
  a("ranger", "barbed_arrow", "Barbed arrow", "An arrow at a random foe, adding Bleed.", { ...timing("quick", "quick"), mp: 200, do: [phys(hit("attack", "light"), { apply: [{ status: "bleed", stacks: stacks("several", "attack") }] })] }),
  // A quick, light shot that lays a few Chill, so the Ranger helps the Frostweaver and the Hexer reach a shatter.
  a("ranger", "frost_arrow", "Frost arrow", "An arrow at the foe with the most Chill, adding more.", {
    ...timing("quick", "quick"), mp: 200, target: T.mostFoe("chill"), do: [phys(hit("attack", "light"), { apply: [{ status: "chill", stacks: stacks("few", "attack", 0.5) }] })],
  }),
  a("ranger", "rending_arrow", "Rending arrow", "An arrow at the foe with the most Sunder, adding more.", {
    ...timing("short", "normal"), mp: 325, target: T.mostFoe("sunder"), do: [phys(hit("attack", "normal"), { apply: [{ status: "sunder", stacks: stacks("few", "attack") }] })],
  }),
  // Bramble knight
  a("bramble_knight", "thicket", "Thicket", "Taunts and Guards itself.", { ...timing("medium", "quick"), mp: 200, target: "self", do: [apply("taunt"), apply("guard")] }),
  a("bramble_knight", "regrowth", "Regrowth", "Regen on the ally with the lowest HP%.", { ...timing("medium", "normal"), mp: 325, target: T.lowestShareAlly, do: [apply("regen")] }),
  a("bramble_knight", "bramble_lash", "Bramble lash", "Lashes a random foe with its Thorns.", { ...timing("quick", "quick"), mp: 200, do: [phys({ scale: [{ ratio: 4.5, stat: "thorns" }] })] }),
  // Hoplite
  a("hoplite", "aspis", "Aspis", "Aegis on the ally with the lowest HP%.", { ...timing("long", "quick"), mp: 325, ...waitsFor("allies", { lacks: "aegis" }), target: lacking(T.lowestShareAlly, "aegis"), do: [apply("aegis")] }),
  // The shove: the bruiser's Defense as damage on every foe, with Sunder from the same stat. No Taunt anywhere in the kit.
  a("hoplite", "othismos", "Othismos", "Shoves every foe, adding Sunder.", {
    ...timing("medium", "long"), mp: 325, target: T.everyFoe, do: [phys(from("defense", HIT.light * KIT.othismos), { apply: [{ status: "sunder", stacks: stacks("few", "defense") }] })],
  }),
  // Bigger than a normal hit: Phalanx boosts the Hoplite's swing, not the thrust.
  a("hoplite", "spear_thrust", "Spear thrust", "Thrusts at a random foe, adding Sunder.", { ...timing("medium", "normal"), mp: 325, do: [phys(from("attack", 1.1), { apply: [{ status: "sunder", stacks: stacks("few", "attack") }] })] }),
  // Paladin
  // Condemn: Marked is a debuff, so the Mark turns Judgement on, and the party's volley lands on the judged.
  a("paladin", "condemn", "Condemn", "Marks the foe with the most Attack. Every ally's next basic attack comes at once.", {
    ...timing("medium", "quick"), mp: 650, target: T.highestAMFoe, do: [apply("marked"), { op: "cooldown", which: "basic", set: "ready", to: T.everyAlly }],
  }),
  a("paladin", "absolve", "Absolve", "Cleanses and heals itself and the other ally with the lowest HP%.", {
    ...timing("medium", "normal"), mp: 650, ...waitsFor("allies", { hpBelow: 100 }), target: "self",
    do: [{ op: "remove", label: "debuff" }, { op: "heal", amount: from("attack", 0.4) }, { op: "remove", label: "debuff", to: T.otherLowestShareAlly }, { op: "heal", amount: from("attack", 0.4), to: T.otherLowestShareAlly }],
  }),
  a("paladin", "smite", "Smite", "Smites the foe with the most Attack, adding Burn.", {
    ...timing("medium", "long"), mp: 650, target: T.highestAMFoe, do: [phys(hit("attack", "normal"), { apply: [{ status: "burn", stacks: stacks("several", "attack") }] })],
  }),
  // Valkyrie
  a("valkyrie", "gale_spear", "Gale spear", "3 hits on a random foe, each adding Shock. Ignores Taunt.", {
    ...timing("quick", "quick"), mp: 200, seek: true, target: T.notTauntingFoe, do: [phys(from("attack", KIT.galeSpear), { hits: 3, apply: [{ status: "shock", stacks: stacks("few", "attack", 0.5) }] })],
  }),
  // Choosing: one target, a fallen ally first, else the lowest; a revive lands only on the fallen and a heal only on the living, so it does one or the other.
  a("valkyrie", "choosing", "Choosing", `Revives a fallen ally with ${Math.round(REVIVE.tenth * 100)}% HP, or else heals the ally with the lowest HP%.`, {
    // Below half, not below 80%: a good player arrives with someone a little down, and the revive's cooldown spent on a top-up at
    // the first tick leaves nothing for the fall.
    ...timing("medium", "normal"), mp: 650, if: { any: [{ side: "allies", where: { hpBelow: 50 } }, { side: "allies", where: { ko: true } }] }, target: T.fallenElseLowestShareAlly,
    // The heal first: a heal skips a fallen target and a revive skips a living one, so the one target gets the one outcome its state calls for.
    do: [{ op: "heal", amount: from("attack", KIT.choosing) }, { op: "revive", hp: { scale: [{ ratio: REVIVE.tenth, stat: "max_hp", of: "target" }] } }],
  }),
  // Gale spear stacks the Shock, Skyfall cashes it and leaves it: the storm spear's beat.
  a("valkyrie", "skyfall", "Skyfall", "A blow from above on the foe with the most Shock.", {
    ...timing("medium", "normal"), mp: 325, target: T.mostFoe("shock"), do: [phys({ scale: [{ ratio: HIT.heavy, stat: "attack" }, { ratio: KIT.skyfallPerShock, stacks: "shock", of: "target" }] })],
  }),
  // Bard
  a("bard", "war_ballad", "War ballad", "Might on every ally.", { ...timing("quick", "quick"), mp: 450, target: T.everyAlly, do: [apply("might", { stacks: stacks("few", "attack") })] }),
  a("bard", "allegro", "Allegro", "Haste on every ally.", { ...timing("long", "quick"), mp: 650, target: T.everyAlly, do: [apply("haste")] }),
  // The conductor's verb: an ally's next spell sounds twice.
  // Ready only while another ally stands: alone, the Bard swung nothing and fizzled Encore at every turn.
  a("bard", "encore", "Encore", "The other ally with the most Attack casts its next ability 2 times; the 2nd is free.", { ...timing("medium", "quick"), mp: 450, if: { side: "others", where: {} }, target: T.otherHighestAMAlly, do: [apply("encore")] }),
  // Hexer
  // The curse every colour reads: a light hit on every foe, a fifth more for each different affliction it holds, then Bleed of its own.
  a("hexer", "malison", "Malison", "Curses every foe, adding Bleed. +20% damage for each of Burn, Chill, Shock, Bleed and Sunder a foe holds.", {
    ...timing("short", "normal"), mp: 450, target: T.everyFoe, do: [phys(curse(HIT.light)), apply("bleed", { stacks: stacks("few", "attack") })],
  }),
  a("hexer", "unmake", "Unmake", "Waits for a foe to cast, then Silences it and strips its buffs.", {
    ...timing("medium", "quick"), mp: 650, ...waitsFor("foes", { casting: true }), target: T.castingFoe, do: [apply("silence"), { op: "remove", label: "buff" }],
  }),
  a("hexer", "enfeeble", "Enfeeble", "Weakens the foe with the most Attack, adding Sunder.", { ...timing("quick", "normal"), mp: 450, target: T.highestAMFoe, do: [apply("weaken"), apply("sunder", { stacks: stacks("few", "attack") })] }),
  // Monk
  a("monk", "flow", "Flow", "Hastes itself.", { ...timing("medium", "quick"), mp: 200, target: "self", do: [apply("haste")] }),
  a("monk", "burning_fist", "Burning fist", "3 blows on the foe with the most Burn, each adding more.", {
    // About 3 Burn a hit, 9 a cast at base, so the Monk stays a smaller Burn engine than the Pyromancer.
    ...timing("quick", "quick"), mp: 200, target: T.mostFoe("burn"), do: [phys(from("attack", 0.11), { hits: 3, apply: [{ status: "burn", stacks: stacks("few", "attack", 0.6) }] })],
  }),
  a("monk", "pressure_point", "Pressure point", "Stuns the foe with the most Attack. Ignores Taunt.", {
    ...timing("medium", "normal"), mp: 325, seek: true, target: lacking(T.highestAMFoe, "stun", true), do: [phys(hit("attack", "normal"), { apply: [{ status: "stun" }] })],
  }),
  // Assassin
  a("assassin", "vanish", "Vanish", "Goes Hidden.", { ...timing("short", "quick"), mp: 200, ...waitsFor("self", { lacks: "hidden" }), target: "self", do: [apply("hidden")] }),
  a("assassin", "backstab", "Backstab", "Stabs the foe with the least HP. Ignores Taunt.", { ...timing("medium", "normal"), mp: 325, seek: true, target: T.lowestHpFoe, do: [phys(hit("crit_chance", BACKSTAB_HIT))] }),
  a("assassin", "garrote", "Garrote", "Silences a random foe. Ignores Taunt.", {
    ...timing("medium", "quick"), mp: 325, seek: true, target: lacking(T.notTauntingFoe, ["taunt", "silence"], true), do: [phys(hit("attack", "normal"), { apply: [{ status: "silence" }] })],
  }),
  // Vampire
  a("vampire", "blood_drain", "Blood drain", "Drains a random foe and Weakens it.", { ...timing("quick", "quick"), mp: 125, do: [phys(from("max_hp", 0.4), { apply: [{ status: "weaken" }] })] }),
  a("vampire", "blood_gift", "Blood gift", "Pays 20% of its max HP to heal the other ally with the lowest HP% as much, and gives it Clarity.", {
    // It waits until the Vampire itself is at 35% HP or more, so the price (a fifth) never kills it.
    ...timing("medium", "normal"), mp: 450, if: [{ side: "others", where: { hpBelow: 80 } }, { side: "self", where: { hpAtLeast: 35 } }], target: T.otherLowestShareAlly,
    // The price is paid with `pay`, HP lost at once, not damage: no Shield soaks it, nothing reacts, never below 1 HP.
    do: [{ op: "pay", hp: from("max_hp", 0.2), to: "self" }, { op: "heal", amount: from("max_hp", 0.2) }, apply("clarity")],
  }),
  a("vampire", "frenzy", "Frenzy", "Might on itself.", { ...timing("medium", "quick"), mp: 450, target: "self", do: [apply("might", { stacks: stacks("several", "attack") })] }),
  // Pyromancer
  a("pyromancer", "firebolt", "Firebolt", "A bolt at the foe with the most Burn, adding more.", { ...timing("quick", "normal"), mp: 450, target: T.mostFoe("burn"), do: [phys(hit("attack", "light"), { apply: [{ status: "burn", stacks: stacks("several", "attack", BURN_STACKS) }] })] }),
  a("pyromancer", "fireball", "Fireball", "Hits every foe, adding Burn.", { ...timing("medium", "long"), mp: 1000, target: T.everyFoe, do: [phys(hit("attack", "touch"), { apply: [{ status: "burn", stacks: stacks("few", "attack", BURN_STACKS) }] })] }),
  a("pyromancer", "pyre", "Pyre", "Burns down the foe with the most Burn.", {
    // 200 a stack of Burn: the ramp's payoff, not a second ramp.
    // On the medium cooldown with a long wind-up, at 1,000 MP: on the long one with a very long wind-up it came 0.15 times a
    // regular fight and a third of a boss fight, the reader of the fire that the fire never saw. At 800 MP, not 1,000: at 1,000 it
    // still came under once a boss fight (0.7), each cast over the balance sheet's band.
    ...timing("medium", "long"), mp: 800, target: T.mostFoe("burn"), do: [phys({ scale: [{ ratio: HIT.heavy, stat: "attack" }, { ratio: 200, stacks: "burn", of: "target" }] })],
  }),
  // Frostweaver
  // About 6 Chill a lance at Attack 4, so a shatter takes more than one cast.
  a("frostweaver", "frost_lance", "Frost lance", "A lance at the foe with the most Chill, adding more.", { ...timing("quick", "normal"), mp: 450, target: T.mostFoe("chill"), do: [phys(hit("attack", "normal"), { apply: [{ status: "chill", stacks: stacks("several", "attack", 0.6) }] })] }),
  a("frostweaver", "blizzard", "Blizzard", "Hits every foe, adding Chill.", { ...timing("medium", "long"), mp: 1000, target: T.everyFoe, do: [phys(hit("attack", "light"), { apply: [{ status: "chill", stacks: stacks("few", "attack", 0.45) }] })] }),
  a("frostweaver", "stillness", "Stillness", "Chill on every foe, and Clarity on the ally with the lowest MP%.", { ...timing("medium", "quick"), mp: 650, target: T.everyFoe, do: [apply("chill", { stacks: stacks("few", "attack", 0.5) }), apply("clarity", { to: T.needsMpAlly })] }),
  // Stormcaller
  // 450, as the other casters' quick spells: at 650 on the quick cooldown it was the dearest spell a tick in the set, and a
  // Stormcaller with no regen cast it once a fight.
  a("stormcaller", "chain_lightning", "Chain lightning", "Lightning at a random foe and up to 3 others, adding Shock.", {
    ...timing("quick", "quick"), mp: 450,
    do: [
      phys(hit("attack", "light"), { apply: [{ status: "shock", stacks: stacks("few", "attack", SHOCK_STACKS) }] }),
      phys(hit("attack", "touch"), { apply: [{ status: "shock", stacks: stacks("few", "attack", SHOCK_STACKS) }], to: T.threeOtherFoes }),
    ],
  }),
  // The party's storm: Shock on every ally's swings for a while, not a nuke (Fireball is the nuke, Blizzard the field's Chill).
  a("stormcaller", "thunderstorm", "Thunderstorm", `For ${KIT.storm.duration} ticks, every ally's basic attacks add Shock.`, { ...timing("medium", "normal"), mp: 450, target: T.everyAlly, do: [apply("thunderstorm_storm")] }),
  a("stormcaller", "static_charge", "Static charge", `Basic attacks come ${KIT.staticCharge.speed}% faster for ${KIT.staticCharge.duration} ticks.`, { ...timing("medium", "quick"), mp: 325, target: "self", do: [apply("static_charge_on")] }),
  // Geomancer
  a("geomancer", "earthen_shell", "Earthen shell", "Shields itself and the other ally with the lowest HP%.", {
    ...timing("medium", "normal"), mp: 650, ...waitsFor("allies", { belowCap: "shield" }), target: "self",
    do: [apply("shield", { stacks: from("defense", 1.0), to: { side: "self", where: { belowCap: "shield" } } }), apply("shield", { stacks: from("defense", 1.0), to: { ...T.otherLowestShareAlly, where: { belowCap: "shield" } } })],
  }),
  a("geomancer", "rockfall", "Rockfall", "Drops a rock on a random foe.", { ...timing(ROCKFALL.cooldown, "long"), mp: 450, do: [phys(hit("defense", ROCKFALL.hit))] }),
  a("geomancer", "tremor", "Tremor", "Hits a random foe and Stuns it.", { ...timing("long", "long"), mp: 650, target: lacking({ side: "foes" }, "stun", true), do: [phys(hit("defense", "normal"), { apply: [{ status: "stun" }] })] }),
];

// ─── Classes ─────────────────────────────────────────────────────────────────

const cls = (id: string, name: string, text: string, body: Omit<ClassDefT, "id" | "name" | "text" | "source" | "abilities"> & { source?: ClassDefT["source"] }): ClassDefT => ({
  id, name, text, source: body.source ?? "unlock", stats: body.stats, weapons: body.weapons, armor: body.armor, offhands: body.offhands, passive: body.passive,
  abilities: abilities.filter((x) => x.class === id).map((x) => x.id),
});
/** A class's passive: its card is its status's own text, so the sheet and a fight read the same sentence. */
const p = (status: string, name: string) => ({ name, text: passives.find((s) => s.id === status)!.text!, statuses: [status] });

export const classes: ClassDefT[] = [
  cls("knight", "Knight", "Protector. Starts every fight behind its own Shield, Guards the ally with the lowest HP%, calls every foe onto itself while an ally regains its mana, and bashes a foe with the weight of its own body.", {
    source: "starter", stats: stat(5, 2, 2, 2, 4, 1, 5), weapons: ["sword", "hammer", "spear"], armor: ["plate"], offhands: ["kite_shield", "horn", "trophy"], passive: p("vanguard", "Vanguard"),
  }),
  cls("cleric", "Cleric", "Healer. Heals the ally with the lowest HP% with quick, small heals, lifts a curse and wraps the ally in Regen, raises the fallen, and prays 100% faster when its own life is in danger.", {
    source: "starter", stats: stat(2, 5, 4, 3, 2, 1, 1), weapons: ["mace", "staff", "wand"], armor: ["robes", "mail"], offhands: ["relic", "lantern", "vial"], passive: p("last_rites", "Last rites"),
  }),
  cls("ranger", "Ranger", "The marksman. Looses barbed, cold and rending arrows at whatever stands in front, while its plain arrows fly past any guard, crit for a living and open the wounds.", {
    source: "starter", stats: { ...stat(3, 3, 3, 4, 2, 4, 2), ...special("accuracy", "medium"), ...special("evasion", "medium") }, weapons: ["bow", "dagger", "axe"], armor: ["leather"], offhands: ["trophy", "cloak", "horn"], passive: p("hunters_eye", "Hunter's eye"),
  }),
  cls("bramble_knight", "Bramble knight", "Thorns tank. Draws every foe onto its thorns, where each attacker is left bleeding for the party's blows, gives Regen to the ally with the lowest HP%, and lashes out with the thorns themselves.", {
    stats: { ...stat(5, 2, 2, 2, 3, 1, 5), ...special("thorns", "high") }, weapons: ["hammer", "mace", "great_weapon"], armor: ["plate", "mail"], offhands: ["totem", "round_shield", "idol"], passive: p("briar", "Briar"),
  }),
  cls("hoplite", "Hoplite", "The bruiser. Slow swings for ×2, a thrust that opens one foe up, a shove with the whole shield that sunders every foe, and an Aegis on the ally about to take the killing blow. Very tanky and hits hard; nothing it does draws fire.", {
    stats: stat(4, 2, 2, 5, 5, 2, 3), weapons: ["spear", "great_weapon", "sword"], armor: ["plate", "leather"], offhands: ["round_shield", "horn", "cloak"], passive: p("phalanx", "Phalanx"),
  }),
  cls("paladin", "Paladin", "The judge: helper of the righteous, killer of the wicked. Its hits deal +50% to any foe that holds a buff or a debuff; it condemns one foe and the whole party strikes it; it lifts curses and heals; and it brings down a slow, heavy, burning Smite.", {
    stats: { ...stat(4, 3, 3, 4, 4, 2, 3) }, weapons: ["mace", "great_weapon", "sword"], armor: ["mail", "plate"], offhands: ["kite_shield", "relic", "lantern"], passive: p("judgement", "Judgement"),
  }),
  cls("valkyrie", "Valkyrie", "The shieldmaiden: a quick, survivable damage dealer, not a tank. Her spear builds her Shield as it strikes, 3 quick hits reach past any guard and shock what they hit, a heavy blow from above hits harder for each Shock, and she chooses the slain: one ability mends the ally with the lowest HP% or raises a fallen one.", {
    stats: { ...stat(3, 3, 3, 4, 3, 3, 2), ...special("cooldown", "medium") }, weapons: ["spear", "sword", "rune_sword"], armor: ["mail", "leather"], offhands: ["round_shield", "cloak", "horn"], passive: p("shieldmaiden", "Shieldmaiden"),
  }),
  cls("bard", "Bard", "Party tempo. A caster at the back whose every basic attack heals an ally and gives another MP, with a ballad that steadies the party, an allegro that quickens it, and an encore that makes an ally's next spell sound 2 times.", {
    stats: { ...stat(3, 4, 3, 3, 2, 2, 1), ...special("cooldown", "medium") }, weapons: ["bow", "wand", "dagger"], armor: ["leather", "robes"], offhands: ["tome", "bell", "vial"], passive: p("refrain", "Refrain"),
  }),
  cls("hexer", "Hexer", "The spellblade. A blade that carries curses: its swing chills, its curses deepen every affliction a foe already holds, it weakens and sunders the foe with the most Attack, and it silences a foe mid-cast and strips its buffs.", {
    stats: { ...stat(3, 4, 3, 4, 2, 2, 1), ...special("siphon", "medium") }, weapons: ["wand", "sword", "dagger"], armor: ["mail", "robes"], offhands: ["tome", "idol", "totem"], passive: p("cold_hex", "Cold hex"),
  }),
  cls("monk", "Monk", "Sunders with a blur of blows. Every blow adds Sunder, Flow keeps it fast, burning fists pile onto the foe with the most Burn, and a pressure point Stuns the foe with the most Attack.", {
    stats: { ...stat(3, 2, 3, 4, 1, 2, 2), ...special("evasion", "high"), ...special("double_strike", "medium") }, weapons: ["fist", "spear", "staff"], armor: ["leather", "robes"], offhands: ["bell", "cloak", "relic"],
    passive: p("iron_palm", "Iron palm"),
  }),
  cls("assassin", "Assassin", "Burst killer. Slips out of sight, picks off the foe with the least HP past any Taunt, leaves every crit a bleeding wound, and silences the back line.", {
    stats: { ...stat(2, 3, 3, 5, 1, 5, 1), ...special("crit_damage", "high"), ...special("evasion", "medium") }, weapons: ["dagger", "axe", "bow"], armor: ["leather"], offhands: ["vial", "trophy", "cloak"],
    passive: p("lacerate", "Lacerate"),
  }),
  cls("vampire", "Vampire", "Drains to outlast. Feeds on everything it hits: the harder it hits, the more it heals, its prey is left weakened, and it bleeds its own life into an ally's wounds and mana.", {
    stats: { ...stat(3.5, 2, 2, 4, 2, 2, 3), lifesteal: VAMPIRE_LIFESTEAL }, weapons: ["fist", "axe", "rune_sword"], armor: ["mail", "plate"], offhands: ["vial", "idol", "relic"],
    passive: p("bloodlust", "Bloodlust"),
  }),
  cls("pyromancer", "Pyromancer", "The glass cannon of long casts. Every spell it casts stokes the fire on the foe with the most Burn, bolts pile more onto it, a fireball spreads it, and a pyre lands.", {
    stats: { ...stat(2, 5, 2, 5, 1, 2, 1), ...special("cast_speed", "medium") }, weapons: ["staff", "wand", "mace"], armor: ["robes"], offhands: ["lantern", "orb", "totem"], passive: p("stoke", "Stoke"),
  }),
  cls("frostweaver", "Frostweaver", "The ice wall: a chunky supporting mage, and the Chill applier. It lays Chill on the field and on the foe with the most Chill until the Chill itself shatters, leaves the shattered foe sundered, and keeps an ally's mana flowing while the frost builds.", {
    stats: { ...stat(3, 4, 3, 3, 3, 2, 2) }, weapons: ["staff", "rune_sword", "spear"], armor: ["robes", "mail"], offhands: ["tome", "orb", "kite_shield"], passive: p("shatterpoint", "Shatterpoint"),
  }),
  cls("stormcaller", "Stormcaller", "The striker among the mages. Each swing arcs to a 2nd foe, lightning chains, a storm puts Shock on every ally's swings, and it charges itself to swing faster.", {
    stats: { ...stat(2, 3, 3, 4, 1, 2, 1), ...special("attack_speed", "medium") }, weapons: ["fist", "rune_sword", "hammer"], armor: ["robes", "leather"], offhands: ["totem", "bell", "orb"], passive: p("arc", "Arc"),
  }),
  cls("geomancer", "Geomancer", "Hits hardest behind stone. Wraps itself and an ally in stone; while its own Shield holds, its rocks crit far more often and far harder, and a tremor Stuns a foe.", {
    stats: { ...stat(3, 3, 3, 3, 5, 4, 3), ...special("crit_damage", "high") }, weapons: ["hammer", "great_weapon", "axe"], armor: ["plate", "robes"], offhands: ["kite_shield", "trophy", "idol"], passive: p("bedrock", "Bedrock"),
  }),
];
/**
 * Each class's MP pool, in points, set by how many regular fights it lasts from full (`npx tsx tools/rogue-acts.ts`, the
 * endurance line): every class runs dry in about two or three fights, casters and walls close together. MP comes back on the
 * bench, never in a fight by itself. The pool, not the cost ladder, is the class's MP identity. Every pool sits on a half
 * step of the scale, its measured value rounded up (a stat line is a signpost); the Knight's, Hoplite's, Valkyrie's, Monk's
 * and Vampire's were raised for the balance pass's longer fights, where they ran dry inside one.
 */
export const MP_POOL: Record<string, number> = {
  knight: 2, cleric: 2.5, ranger: 2.5, bramble_knight: 2, hoplite: 2, paladin: 3.5,
  valkyrie: 2.5, bard: 2.5, hexer: 2, monk: 1.5, assassin: 1.5, vampire: 2.5,
  pyromancer: 4, frostweaver: 2.5, stormcaller: 2.5, geomancer: 2.5,
};
for (const k of classes) if (MP_POOL[k.id] !== undefined) k.stats.max_mp = pts(MP_POOL[k.id]);

