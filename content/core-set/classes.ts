/**
 * The 16 classes (docs/core-set/classes.md): stats, passives, abilities.
 * Every number comes from scale.ts; the words are the documents'.
 */
import type { AbilityT, ClassDefT, NumT, StatusT, TargetRuleT } from "../../src/schema.js";
import { BURN_STACKS, SHOCK_STACKS, COOLDOWN, HIT, REVIVE, RESIST, SPECIAL, SPECIAL_KEY, STACKS, STATUS, STUN_COOLDOWN, WINDUP, crit, from, jitter, aggroOf, pts, stacks, type HitWord, type SpecialLevel, type SpecialStat, type StackWord } from "./scale.js";
import { P } from "./vocabulary.js";

type CD = keyof typeof COOLDOWN;
type WU = keyof typeof WINDUP;

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Cooldown and wind-up from their words. Each ability states its own MP cost (see below). */
const timing = (cd: CD, wu: WU) => ({ cooldown: COOLDOWN[cd], cast: WINDUP[wu] });
const phys = (subtype: "slash" | "pierce" | "blunt", amount: NumT, extra: object = {}) => ({ op: "damage", type: "physical", subtype, amount, ...extra }) as const;
const magic = (element: string, amount: NumT, extra: object = {}) => ({ op: "damage", type: "magical", element, amount, ...extra }) as const;
const hit = (stat: string, word: HitWord) => from(stat, HIT[word]);
const apply = (status: string, extra: object = {}) => ({ op: "apply", status, ...extra }) as const;

/** The target phrases of the rules document, word for word. */
export const T = {
  randomFoe: "foe" as const,
  lowestHpFoe: { side: "foes", pick: "lowest", by: "hp" } satisfies TargetRuleT,
  highestAMFoe: { side: "foes", pick: "highest", by: { stats: ["attack", "magic"] } } satisfies TargetRuleT,
  mostFoe: (status: string): TargetRuleT => ({ side: "foes", pick: "highest", by: { stacks: status } }),
  buffedFoe: { side: "foes", where: { buffs: true } } satisfies TargetRuleT,
  secondFoe: { side: "foes", pick: "random", exclude: "targets" } satisfies TargetRuleT,
  threeOtherFoes: { side: "foes", pick: "random", count: 3, exclude: "targets" } satisfies TargetRuleT,
  /** Used only with Seek. */
  notTauntingFoe: { side: "foes", where: { lacks: "taunt" }, ifNone: "any" } satisfies TargetRuleT,
  lowestShareAlly: { side: "allies", pick: "lowest", by: "hp_share" } satisfies TargetRuleT,
  otherLowestShareAlly: { side: "others", pick: "lowest", by: "hp_share" } satisfies TargetRuleT,
  highestAMAlly: { side: "allies", pick: "highest", by: { stats: ["attack", "magic"] } } satisfies TargetRuleT,
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

const stat = (hp: number, mp: number, regen: number, atk: number, mag: number, armor: number, c: number, aggro: number) => ({
  max_hp: pts(hp), max_mp: pts(mp), mp_regen: pts(regen), attack: pts(atk), magic: pts(mag), armor: pts(armor), crit_chance: crit(c), aggro: aggroOf(aggro),
});
const special = (s: SpecialStat, level: SpecialLevel) => ({ [SPECIAL_KEY[s]]: SPECIAL[s][level] });
const resist = (element: string, kind: "resists" | "weak") => ({ [`resist:${element}`]: RESIST[kind] });

/** Stacks a passive's application adds: scaled from the holder's stat, read when it fires. */
const own = (word: StackWord, stat: string, mult = 1): NumT => ({ scale: [{ ratio: (mult * STACKS[word]) / P, stat, of: "holder" }] });
const passive = (id: string, name: string, body: Partial<StatusT>): StatusT =>
  ({ id, name, label: "buff", show: "sheet", stacking: "refresh", unremovable: true, ...body }) as StatusT;
const bothKinds = (pct: StatusT["boosts"] extends (infer B)[] | undefined ? (B extends { pct: infer N } ? N : never) : never) => [{ tag: "physical", pct }, { tag: "magical", pct }];

// ─── Passives ────────────────────────────────────────────────────────────────

export const passives: StatusT[] = [
  passive("sworn", "Sworn", { text: "Taunts when an ally falls.", reactions: [{ on: { event: "ko", whose: "ally" }, do: [apply("taunt", { to: "holder" })] }] }),
  passive("hunters_eye", "Hunter's eye", { text: "Basic attacks ignore Taunt.", seek: "basic" }),
  // Step 5c (the director's): Bleed, not Poison, with stacks from Armor.
  passive("briar", "Briar", { text: "Foes its Thorns wound start to bleed.", reactions: [{ on: { event: "damage_dealt", status: "thorns" }, do: [apply("bleed", { stacks: own("few", "armor"), to: "other" })] }] }),
  passive("phalanx", "Phalanx", { text: "Basic attacks a third as often, for triple damage.", stats: [{ stat: "attack_speed", flat: -200 }], boosts: [{ tag: "basic", pct: 200 }] }),
  passive("judgement", "Judgement", { text: "Hits deal double damage to foes with a buff.", boosts: bothKinds({ scale: [{ ratio: 100, when: { buffs: true }, of: "target" }] }) }),
  passive("encore", "Encore", { text: "Can't be Silenced.", stats: [{ stat: "immune:status:silence", flat: 1 }] }),
  // Follow-up redesign (the director's): the Bard's tempo includes mana. Its old passive, Encore, went to the Cleric.
  passive("refrain", "Refrain", { text: "Basic attacks give a random ally a little MP.", reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [{ op: "mp", amount: STATUS.refrain.mp, to: { side: "allies", pick: "random" } }] }] }),
  passive("cold_hex", "Cold hex", { text: "Basic attacks add a few Chill.", reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("chill", { stacks: own("few", "magic"), to: "other" })] }] }),
  passive("iron_palm", "Iron palm", {
    text: "Basic attacks, and Double strike's second strike, add a few Sunder.",
    reactions: [
      { on: { event: "hit_lands", kind: "basic" }, do: [apply("sunder", { stacks: own("few", "attack"), to: "other" })] },
      { on: { event: "hit_lands", kind: "extra" }, do: [apply("sunder", { stacks: own("few", "attack"), to: "other" })] },
    ],
  }),
  // Step 5c (the director's): crits that bleed, in place of Shadow strike (every hit a crit while Hidden).
  passive("lacerate", "Lacerate", { text: "Its crits add several Bleed.", reactions: [{ on: { event: "hit_lands", tags: ["crit"] }, do: [apply("bleed", { stacks: own("several", "attack"), to: "other" })] }] }),
  passive("bloodlust", "Bloodlust", {
    text: "Lifesteal doubles below half HP.",
    reactions: [
      { on: { event: "hp_lost" }, do: [apply("bloodlust_on", { to: { side: "self", where: { hpBelow: 50 } } })] },
      { on: { event: "healed" }, do: [{ op: "remove", label: "buff", status: "bloodlust_on", to: { side: "self", where: { hpAtLeast: 50 } } }] },
    ],
  }),
  { id: "bloodlust_on", name: "BLOODLUST", text: "Lifesteal doubled.", label: "buff", show: "icon", stacking: "fizzle", stats: [{ stat: "lifesteal", flat: { scale: [{ ratio: 1, stat: "lifesteal", of: "holder" }] } }] },
  passive("kindling", "Kindling", { text: "Basic attacks add a few Burn.", reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("burn", { stacks: own("few", "magic", BURN_STACKS), to: "other" })] }] }),
  passive("brittle", "Brittle", { text: "Hits deal more damage for each Chill stack on the target.", boosts: bothKinds({ scale: [{ ratio: 8, stacks: "chill", of: "target" }] }) }),
  passive("arc", "Arc", {
    text: "Basic attacks also hit a second foe, and Shock both.",
    strike: { to: T.secondFoe },
    reactions: [
      { on: { event: "hit_lands", kind: "basic" }, do: [apply("shock", { stacks: own("few", "magic", SHOCK_STACKS), to: "other" })] },
      { on: { event: "hit_lands", kind: "extra" }, do: [apply("shock", { stacks: own("few", "magic", SHOCK_STACKS), to: "other" })] },
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

// MP costs are set by hand, ability by ability (step 5c, the director's: no rule from a stat to a cost). The casters' spells
// cost more than the walls' and fighters' skills, so the casters run short over a run and want MP gear, and the walls don't.

type A = Omit<AbilityT, "class"> & { class: string };
// Pacing pass: each ability's cooldown is its word's, moved by its id (scale.ts, jitter), so no two in a kit are the same.
const a = (cls: string, id: string, name: string, text: string, body: Partial<AbilityT> & { do: AbilityT["do"]; cooldown: number }): A => ({ id, class: cls, name, text, ...body, cooldown: jitter(body.cooldown, id) });

export const abilities: A[] = [
  // Knight
  a("knight", "fortify", "Fortify", "Guards the ally with the lowest share of HP.", { ...timing("medium", "quick"), mp: 160, target: T.lowestShareAlly, do: [apply("guard")] }),
  // Step 5c (the director's, to try): a long cooldown (was medium). How often it comes was the Knight's strength; its size isn't,
  // since a Shield can't pass half its target's max HP.
  a("knight", "protect", "Protect", "Shields the lowest ally; the amount scales from the Knight's max HP.", {
    ...timing("long", "normal"), mp: 160, ...waitsFor("allies", { belowCap: "shield" }), target: { ...T.lowestShareAlly, where: { belowCap: "shield" } },
    do: [apply("shield", { stacks: from("max_hp", 0.6) })],
  }),
  // Pacing pass: a light hit (was normal): at normal it was seven or eight of the Knight's swings, a tank's nuke.
  a("knight", "shield_bash", "Shield bash", "Bashes a foe with the shield, which scales from Armor, and Stuns it.", {
    ...timing(STUN_COOLDOWN, "quick"), mp: 160, target: lacking({ side: "foes" }, "stun", true), do: [phys("blunt", hit("armor", "light"), { apply: [{ status: "stun" }] })],
  }),
  // Cleric. Follow-up redesign (the director's): no free heal (Mercy healed three quarters of every staff hit), an active
  // healer that spends MP. Prayer (Regen on every ally) and Purify (a cleanse) became Renew, on one ally that's never idle.
  a("cleric", "renew", "Renew", "Cleanses an ally with a debuff and gives it Regen; with nobody debuffed, Regen on the lowest ally.", {
    ...timing("medium", "normal"), mp: 1300, target: { side: "allies", where: { debuffs: true }, ifNone: "any", pick: "lowest", by: "hp_share" }, do: [{ op: "remove", label: "debuff" }, apply("regen")],
  }),
  a("cleric", "cure", "Cure", "A quick, small heal on the lowest ally.", {
    ...timing("short", "quick"), mp: 1280, ...waitsFor("allies", { hpBelow: 100 }), target: T.lowestShareAlly, do: [{ op: "heal", amount: from("magic", 0.45) }],
  }),
  a("cleric", "raise", "Raise", "Revives a random knocked-out ally with half its HP.", {
    ...timing("long", "very_long"), mp: 2000, ...waitsFor("allies", { ko: true }), target: T.koAlly, do: [{ op: "revive", hp: { scale: [{ ratio: REVIVE.half, stat: "max_hp", of: "target" }] } }],
  }),
  // Ranger
  // Step 5c (the director's): Bleed for Poison, stacks from Attack, at a random foe (it sought a foe without Poison).
  a("ranger", "barbed_arrow", "Barbed arrow", "A barbed arrow at a random foe, adding several Bleed.", { ...timing("short", "quick"), mp: 100, do: [phys("pierce", hit("attack", "light"), { apply: [{ status: "bleed", stacks: stacks("several", "attack") }] })] }),
  a("ranger", "fire_arrow", "Fire arrow", "A burning arrow at the foe with the most Burn, adding many.", {
    // Campaign pass: a heavy hit, not normal. The AI playtester never wanted the Ranger after the first node.
    ...timing("medium", "long"), mp: 160, target: T.mostFoe("burn"), do: [magic("fire", hit("attack", "heavy"), { apply: [{ status: "burn", stacks: stacks("many", "attack") }] })],
  }),
  a("ranger", "rending_arrow", "Rending arrow", "An arrow at the foe with the most Sunder, adding several.", {
    ...timing("medium", "normal"), mp: 160, target: T.mostFoe("sunder"), do: [phys("pierce", hit("attack", "normal"), { apply: [{ status: "sunder", stacks: stacks("several", "attack") }] })],
  }),
  // Bramble knight
  a("bramble_knight", "thicket", "Thicket", "Taunts and Guards itself.", { ...timing("medium", "quick"), mp: 330, target: "self", do: [apply("taunt"), apply("guard")] }),
  a("bramble_knight", "regrowth", "Regrowth", "Regen on the lowest ally.", { ...timing("medium", "normal"), mp: 330, target: T.lowestShareAlly, do: [apply("regen")] }),
  a("bramble_knight", "bramble_lash", "Bramble lash", "Lashes a random foe with its thorns.", { ...timing("short", "quick"), mp: 200, do: [phys("pierce", { scale: [{ ratio: 6, stat: "thorns" }] })] }),
  // Hoplite
  a("hoplite", "aspis", "Aspis", "Aegis on the lowest ally.", { ...timing("medium", "quick"), mp: 160, ...waitsFor("allies", { lacks: "aegis" }), target: lacking(T.lowestShareAlly, "aegis"), do: [apply("aegis")] }),
  a("hoplite", "paired_guard", "Paired guard", "Guards itself and the other lowest ally.", { ...timing("medium", "normal"), mp: 160, target: "self", do: [apply("guard"), apply("guard", { to: T.otherLowestShareAlly })] }),
  // Step 5e: 1.5 of Attack (was a normal hit, 0.75): Phalanx triples the swing and not the thrust, so the thrust dealt 0.9 of the Hoplite's own swing.
  a("hoplite", "spear_thrust", "Spear thrust", "A thrust at a random foe that adds a few Sunder.", { ...timing("short", "quick"), mp: 100, do: [phys("pierce", from("attack", 1.5), { apply: [{ status: "sunder", stacks: stacks("few", "attack") }] })] }),
  // Paladin
  a("paladin", "sanctuary", "Sanctuary", "Ward on every ally.", { ...timing("long", "long"), mp: 700, target: T.everyAlly, do: [apply("ward")] }),
  a("paladin", "absolve", "Absolve", "Cleanses itself and one random other ally with a debuff.", {
    ...timing("long", "quick"), mp: 500, ...waitsFor("allies", { debuffs: true }), target: "self", do: [{ op: "remove", label: "debuff" }, { op: "remove", label: "debuff", to: T.otherDebuffedAlly }],
  }),
  // Step 5c (the director's): Smite Burns, on a medium cooldown (was long).
  a("paladin", "smite", "Smite", "Heavy Light damage to the foe with the highest Attack or Magic, adding several Burn.", {
    ...timing("medium", "very_long"), mp: 800, target: T.highestAMFoe, do: [magic("light", hit("magic", "heavy"), { apply: [{ status: "burn", stacks: stacks("several", "magic") }] })],
  }),
  // Valkyrie
  a("valkyrie", "gale_spear", "Gale spear", "Three quick Wind hits on a foe that isn't Taunting, each adding a few Shock.", {
    // Campaign pass: 0.1 of Attack a hit, not light's 0.2. Three undodgeable hits with Seek on a short cooldown made the Valkyrie the best class on every node.
    ...timing("short", "quick"), mp: 400, seek: true, target: T.notTauntingFoe, do: [magic("wind", from("attack", 0.25), { hits: 3, apply: [{ status: "shock", stacks: stacks("few", "attack") }] })],
  }),
  a("valkyrie", "rally", "Rally", "Heals the lowest ally; the amount scales from Magic.", {
    // Campaign pass: 0.3 of Magic, not 0.6.
    ...timing("medium", "normal"), mp: 650, ...waitsFor("allies", { hpBelow: 100 }), target: T.lowestShareAlly, do: [{ op: "heal", amount: from("magic", 0.7) }],
  }),
  a("valkyrie", "valhalla", "Valhalla", "Revives a random knocked-out ally with a tenth of its HP, every action ready.", {
    ...timing("long", "quick"), mp: 1200, ...waitsFor("allies", { ko: true }), target: T.koAlly, do: [{ op: "revive", hp: { scale: [{ ratio: REVIVE.tenth, stat: "max_hp", of: "target" }] }, ready: true }],
  }),
  // Bard
  a("bard", "allegro", "Allegro", "Haste on a random ally.", { ...timing("medium", "normal"), mp: 650, target: "ally", do: [apply("haste")] }),
  // Campaign pass: many Might, not several. The Bard was in no winning build on any node.
  a("bard", "war_ballad", "War ballad", "Many Might on the ally with the highest Attack or Magic.", { ...timing("medium", "normal"), mp: 650, target: T.highestAMAlly, do: [apply("might", { stacks: stacks("many", "magic") })] }),
  // Step 5c (the director's): Lullaby (Slow on one foe) became a Shock on every foe.
  // Many, not several: at several an AI playtester saw it peak at 10 stacks for under 2,000 a fight, the Bard a passenger.
  a("bard", "thunder_chord", "Thunder chord", "Many Shock on every foe.", { ...timing("medium", "normal"), mp: 650, target: T.everyFoe, do: [apply("shock", { stacks: stacks("many", "magic") })] }),
  // Hexer
  a("hexer", "hush", "Hush", "Silences the foe with the highest Attack or Magic.", { ...timing("long", "quick"), mp: 1600, ...waitsFor("foes", { lacks: "silence" }), target: lacking(T.highestAMFoe, "silence"), do: [apply("silence")] }),
  a("hexer", "unravel", "Unravel", "Strips one random buff from a random foe with a buff.", { ...timing("medium", "normal"), mp: 1300, ...waitsFor("foes", { buffs: true }), target: T.buffedFoe, do: [{ op: "remove", label: "buff", count: 1, order: "random" }] }),
  a("hexer", "enfeeble", "Enfeeble", "Weakens and Slows the foe with the highest Attack or Magic.", { ...timing("medium", "normal"), mp: 1300, target: T.highestAMFoe, do: [apply("weaken"), apply("slow")] }),
  // Monk
  a("monk", "flow", "Flow", "Haste on itself.", { ...timing("short", "quick"), mp: 100, target: "self", do: [apply("haste")] }),
  a("monk", "burning_fist", "Burning fist", "Three quick Fire hits on the foe with the most Burn, each adding a few.", {
    ...timing("short", "quick"), mp: 100, target: T.mostFoe("burn"), do: [magic("fire", from("attack", 0.25), { hits: 3, apply: [{ status: "burn", stacks: stacks("few", "attack") }] })],
  }),
  a("monk", "pressure_point", "Pressure point", "Stuns the foe with the highest Attack or Magic, past any guard.", {
    ...timing(STUN_COOLDOWN, "normal"), mp: 160, seek: true, target: lacking(T.highestAMFoe, "stun", true), do: [phys("blunt", hit("attack", "normal"), { apply: [{ status: "stun" }] })],
  }),
  // Assassin
  a("assassin", "vanish", "Vanish", "Goes Hidden.", { ...timing("long", "quick"), mp: 250, ...waitsFor("self", { lacks: "hidden" }), target: "self", do: [apply("hidden")] }),
  a("assassin", "backstab", "Backstab", "Heavy damage, scaling from Crit chance, to the foe with the lowest HP, past any guard.", { ...timing("medium", "normal"), mp: 160, seek: true, target: T.lowestHpFoe, do: [phys("pierce", hit("crit_chance", "heavy"))] }),
  a("assassin", "garrote", "Garrote", "Silences a random foe that isn't Taunting, past any guard.", {
    ...timing("long", "quick"), mp: 250, seek: true, target: lacking(T.notTauntingFoe, ["taunt", "silence"], true), do: [phys("pierce", hit("attack", "normal"), { apply: [{ status: "silence" }] })],
  }),
  // Vampire
  // Step 5e: 0.5 of max HP (was a normal hit, 0.75): at 4 swings a cast twice a fight it was 60% of the Vampire's damage, and
  // through Lifesteal most of the 3,850 HP it healed itself a fight; parties with the Vampire won 37 points more than without.
  a("vampire", "blood_drain", "Blood drain", "Dark damage scaling from max HP to a random foe, which is Weakened.", { ...timing("short", "quick"), mp: 200, do: [magic("dark", from("max_hp", 0.5), { apply: [{ status: "weaken" }] })] }),
  a("vampire", "wither", "Wither", "Rot on the foe with the lowest HP.", { ...timing("medium", "normal"), mp: 330, target: T.lowestHpFoe, do: [apply("rot")] }),
  a("vampire", "frenzy", "Frenzy", "Several Might on itself.", { ...timing("medium", "quick"), mp: 330, target: "self", do: [apply("might", { stacks: stacks("several", "attack") })] }),
  // Pyromancer
  a("pyromancer", "firebolt", "Firebolt", "Fire at the foe with the most Burn, adding several.", { ...timing("short", "normal"), mp: 800, target: T.mostFoe("burn"), do: [magic("fire", hit("magic", "normal"), { apply: [{ status: "burn", stacks: stacks("several", "magic", BURN_STACKS) }] })] }),
  // Campaign pass: normal hits (0.35 of Magic), not light. Squishy damage dealers were in few winning builds; the run's attrition favours sustain.
  // Pacing pass: a light hit on each (was normal): about one swing a foe, for every foe.
  a("pyromancer", "fireball", "Fireball", "Fire on every foe, adding a few Burn to each.", { ...timing("medium", "long"), mp: 1300, target: T.everyFoe, do: [magic("fire", hit("magic", "light"), { apply: [{ status: "burn", stacks: stacks("few", "magic", BURN_STACKS) }] })] }),
  a("pyromancer", "pyre", "Pyre", "Heavy Fire on the foe with the most Burn, rising with each stack. The Burn stays.", {
    ...timing("long", "very_long"), mp: 2000, target: T.mostFoe("burn"), do: [magic("fire", { scale: [{ ratio: HIT.heavy, stat: "magic" }, { ratio: 300, stacks: "burn", of: "target" }] })],
  }),
  // Frostweaver
  a("frostweaver", "frost_lance", "Frost lance", "Ice at the foe with the most Chill, adding several.", { ...timing("short", "normal"), mp: 800, target: T.mostFoe("chill"), do: [magic("ice", hit("magic", "normal"), { apply: [{ status: "chill", stacks: stacks("several", "magic") }] })] }),
  // Campaign pass: 0.3 of Magic, not light's 0.2, for the same reason as Fireball.
  a("frostweaver", "blizzard", "Blizzard", "Ice on every foe, adding a few Chill to each.", { ...timing("medium", "long"), mp: 1300, target: T.everyFoe, do: [magic("ice", hit("magic", "light"), { apply: [{ status: "chill", stacks: stacks("few", "magic") }] })] }),
  // Step 5e: 400 MP (was 1,600: it cost more than the Clarity it gave back, and fired 0.04 times a regular fight).
  a("frostweaver", "stillness", "Stillness", "Clarity on a random ally.", { ...timing("long", "quick"), mp: 400, target: "ally", do: [apply("clarity")] }),
  // Stormcaller
  a("stormcaller", "chain_lightning", "Chain lightning", "Lightning at a random foe, then up to three others, adding a few Shock to each.", {
    ...timing("short", "quick"), mp: 800,
    do: [
      // Pacing pass: 0.6 and 0.3 of Magic (were normal and light), so four foes take about two and a half swings, not five.
      magic("lightning", from("magic", 0.6), { apply: [{ status: "shock", stacks: stacks("few", "magic", SHOCK_STACKS) }] }),
      magic("lightning", from("magic", 0.3), { apply: [{ status: "shock", stacks: stacks("few", "magic", SHOCK_STACKS) }], to: T.threeOtherFoes }),
    ],
  }),
  a("stormcaller", "thunderstorm", "Thunderstorm", "Lightning on every foe, adding a few Shock to each.", { ...timing("medium", "normal"), mp: 1200, target: T.everyFoe, do: [magic("lightning", hit("magic", "light"), { apply: [{ status: "shock", stacks: stacks("few", "magic", SHOCK_STACKS) }] })] }),
  // Step 5e: 400 MP (was 1,200 for the same Haste the Monk's Flow gives for 100; it fired 0.02 times a regular fight).
  a("stormcaller", "static_charge", "Static charge", "Haste on itself.", { ...timing("long", "long"), mp: 400, target: "self", do: [apply("haste")] }),
  // Geomancer
  a("geomancer", "earthen_shell", "Earthen shell", "Shields itself and the other lowest ally; the amount scales from Armor.", {
    ...timing("medium", "normal"), mp: 1200, ...waitsFor("allies", { belowCap: "shield" }), target: "self",
    do: [apply("shield", { stacks: from("armor", 1.0), to: { side: "self", where: { belowCap: "shield" } } }), apply("shield", { stacks: from("armor", 1.0), to: { ...T.otherLowestShareAlly, where: { belowCap: "shield" } } })],
  }),
  a("geomancer", "rockfall", "Rockfall", "Earth damage scaling from Armor on a random foe.", { ...timing("short", "normal"), mp: 800, do: [magic("earth", hit("armor", "normal"))] }),
  a("geomancer", "tremor", "Tremor", "Earth damage on a random foe, which is Stunned.", { ...timing(STUN_COOLDOWN, "very_long"), mp: 1200, target: lacking({ side: "foes" }, "stun", true), do: [magic("earth", hit("magic", "normal"), { apply: [{ status: "stun" }] })] }),
];

// ─── Classes ─────────────────────────────────────────────────────────────────

const cls = (id: string, name: string, text: string, body: Omit<ClassDefT, "id" | "name" | "text" | "source" | "abilities"> & { source?: ClassDefT["source"] }): ClassDefT => ({
  id, name, text, source: body.source ?? "unlock", stats: body.stats, weapons: body.weapons, armor: body.armor, passive: body.passive,
  abilities: abilities.filter((x) => x.class === id).map((x) => x.id),
});
const p = (status: string, name: string, text: string) => ({ name, text, statuses: [status] });

export const classes: ClassDefT[] = [
  cls("knight", "Knight", "Protector. Stands in front in heavy plate, Guards and Shields whoever is lowest, bashes a foe now and then, and when an ally falls, calls every foe onto itself.", {
    // Step 5c (the director's, to try): HP 4 (the document's 5), with Protect on a long cooldown: the Knight was in 69% of top builds.
    source: "starter", stats: stat(4, 2, 2, 3, 1, 5, 2, 5), weapons: ["sword", "axe"], armor: "heavy", passive: p("sworn", "Sworn", "When an ally is knocked out, the Knight gains Taunt."),
  }),
  cls("cleric", "Cleric", "Healer. Mends whoever is lowest with quick, small heals, lifts a curse and wraps the ally in Regen, raises the fallen, and nothing silences its prayers.", {
    source: "starter", stats: stat(2, 5, 4, 1, 4, 2, 2, 2), weapons: ["light_staff"], armor: "light", passive: p("encore", "Encore", "It can't be Silenced."),
  }),
  cls("ranger", "Ranger", "Wears down tough targets. Looses barbed, fire and armor-rending arrows at whatever stands in front, while its plain arrows fly past any guard and open the wounds.", {
    source: "starter", stats: { ...stat(3, 3, 3, 4, 1, 2, 3, 2), ...special("accuracy", "medium") }, weapons: ["bow", "dagger"], armor: "medium", passive: p("hunters_eye", "Hunter's eye", "Its basic attacks ignore Taunt."),
  }),
  cls("bramble_knight", "Bramble knight", "Thorns tank. Draws every foe onto its thorns, where each attacker is left bleeding for the party's blows, regrows whoever is lowest, and lashes out with the thorns themselves.", {
    stats: { ...stat(5, 2, 2, 3, 2, 3, 2, 4), ...special("thorns", "high"), ...resist("fire", "weak") }, weapons: ["sword", "earth_staff"], armor: "heavy", passive: p("briar", "Briar", "Each time its Thorns damage a foe, that foe gets a few Bleed; stacks scale from Armor."),
  }),
  cls("hoplite", "Hoplite", "Bodyguard who breaks armor. Plants its great shield beside the most vulnerable ally to catch the killing blow, locks shields with it, and cracks armor with slow, crushing blows.", {
    stats: stat(4, 2, 2, 3, 1, 5, 2, 3), weapons: ["spear", "sword"], armor: "heavy", passive: p("phalanx", "Phalanx", "Its basic attacks come a third as often and deal triple damage."),
  }),
  cls("paladin", "Paladin", "Shelter against magic. Shelters the party from spells and curses, and brings down slow, heavy, burning judgement, twice as hard on any foe that holds a buff.", {
    stats: { ...stat(4, 3, 3, 3, 4, 4, 2, 3), ...resist("light", "resists") }, weapons: ["sword", "light_staff"], armor: "heavy", passive: p("judgement", "Judgement", "Its hits deal double damage to foes with a buff."),
  }),
  cls("valkyrie", "Valkyrie", "Storm spear who heals and revives. A storm-borne spear that reaches past any guard and Shocks what it hits, mends the wounded, and snatches the fallen back ready to fight.", {
    stats: stat(3, 3, 3, 4, 3, 3, 3, 3), weapons: ["spear", "sword", "light_staff"], armor: "medium", passive: { name: "Einherjar", text: "Allies it revives come back with all their actions ready, instead of on cooldown." },
  }),
  cls("bard", "Bard", "Party tempo. Plays the fight's tempo: allies faster and stronger, every foe shocked by its thunder, and every note it strikes gives an ally a little mana.", {
    stats: stat(2, 4, 3, 3, 3, 2, 2, 2), weapons: ["dagger", "bow"], armor: "medium", passive: p("refrain", "Refrain", "Each of its basic attacks that lands gives a random ally a little MP."),
  }),
  cls("hexer", "Hexer", "Curser. Curses the most dangerous foe into a crawl, silenced, weakened, slowed and chilled, and strips foes' buffs one at a time.", {
    stats: { ...stat(2, 4, 3, 1, 4, 1, 2, 2), ...special("siphon", "medium") }, weapons: ["ice_staff", "dark_staff"], armor: "light", passive: p("cold_hex", "Cold hex", "Its basic attacks add a few Chill, whatever staff it carries; stacks scale from Magic."),
  }),
  cls("monk", "Monk", "Breaks armor with a blur of blows. Every blow cracks armor, Flow keeps it fast, burning fists pile onto the hottest foe, and a pressure point drops the most dangerous one for a moment.", {
    stats: { ...stat(3, 2, 3, 4, 1, 2, 3, 3), ...special("evasion", "high"), ...special("double_strike", "medium") }, weapons: ["fist", "spear"], armor: "medium",
    passive: p("iron_palm", "Iron palm", "Its basic attacks, and the second strike of its Double strike, add a few Sunder; stacks scale from Attack."),
  }),
  cls("assassin", "Assassin", "Burst killer. Slips out of sight, picks off the weakest foe past any guard, leaves every crit a bleeding wound, and silences the back line.", {
    stats: { ...stat(2, 3, 3, 5, 1, 2, 5, 1), ...special("crit_damage", "high"), ...special("evasion", "medium") }, weapons: ["dagger", "sword"], armor: "medium",
    passive: p("lacerate", "Lacerate", "Each of its crits adds several Bleed to the foe; stacks scale from Attack."),
  }),
  cls("vampire", "Vampire", "Drains to outlast. Feeds on everything it hits: the harder it hits, the more it heals, and its prey is left weakened and unable to mend.", {
    stats: { ...stat(4, 2, 2, 4, 2, 2, 2, 3), ...special("lifesteal", "high"), ...resist("light", "weak"), ...resist("dark", "resists") }, weapons: ["sword", "fist", "dark_staff"], armor: "medium",
    passive: p("bloodlust", "Bloodlust", "While it's below half of its max HP, its Lifesteal is doubled."),
  }),
  cls("pyromancer", "Pyromancer", "Ramping Burn. Every strike adds Burn, bolts pile more onto the hottest foe, and a pyre lands on it.", {
    stats: stat(2, 5, 2, 1, 5, 1, 2, 3), weapons: ["fire_staff", "lightning_staff"], armor: "light", passive: p("kindling", "Kindling", "Its basic attacks add a few Burn, whatever staff it carries; stacks scale from Magic."),
  }),
  cls("frostweaver", "Frostweaver", "Locks foes down with Chill. Buries foes in Chill and keeps them crawling, its hits landing harder the colder they are, and spends the time it buys keeping an ally's mana flowing.", {
    stats: { ...stat(2, 4, 3, 1, 4, 2, 2, 2), ...resist("ice", "resists") }, weapons: ["ice_staff", "wind_staff"], armor: "light", passive: p("brittle", "Brittle", "Its hits deal more damage for each Chill stack on the target. The Chill stays."),
  }),
  cls("stormcaller", "Stormcaller", "Shocks every foe. Rains quick strikes across every foe so the fast and the many hurt themselves by acting, and charges itself up to strike faster.", {
    stats: stat(2, 3, 3, 1, 4, 1, 2, 3), weapons: ["lightning_staff", "wind_staff"], armor: "light", passive: p("arc", "Arc", "Each of its basic attacks also hits a second, random foe, and adds a few Shock to both; stacks scale from Magic."),
  }),
  cls("geomancer", "Geomancer", "Hits hardest behind stone. Wraps itself and an ally in stone; while its own Shield holds, its rocks crit far more often and far harder, and a tremor drops a foe now and then.", {
    stats: { ...stat(3, 3, 3, 3, 4, 4, 4, 3), ...special("crit_damage", "high") }, weapons: ["earth_staff", "fire_staff", "axe"], armor: "heavy", passive: p("bedrock", "Bedrock", "While its Shield pool is above zero, its crit chance is doubled."),
  }),
];
