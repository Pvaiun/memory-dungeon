/**
 * The 16 classes (docs/core-set/classes.md): stats, passives, abilities.
 * Every number comes from scale.ts; the words are the documents'.
 */
import type { AbilityT, ClassDefT, NumT, StatusT, TargetRuleT } from "../../src/schema.js";
import { BURN_STACKS, SHOCK_STACKS, COOLDOWN, HIT, REVIVE, RESIST, SPECIAL, SPECIAL_KEY, STACKS, STATUS, WINDUP, crit, from, jitter, aggroOf, pts, stacks, type HitWord, type SpecialLevel, type SpecialStat, type StackWord } from "./scale.js";
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
  /** Step 5f: the ally with the least MP, for the Clarity givers (`mp_share`, engine 0.13). */
  lowestMpAlly: { side: "allies", pick: "lowest", by: "mp_share" } satisfies TargetRuleT,
  /** Step 5g: the ally with the least MP among those under half (`mpBelow`, engine 0.14), or nobody: a Clarity on a full pool was the usual case. */
  needsMpAlly: { side: "allies", where: { mpBelow: 50 }, ifNone: "any", pick: "lowest", by: "mp_share" } satisfies TargetRuleT, // Round 6 (the director's): a preference, never a skip: with nobody under half, the least.
  /** Step 5f: a foe in a wind-up, for Unmake (`casting`, engine 0.13). */
  castingFoe: { side: "foes", where: { casting: true }, pick: "highest", by: { stats: ["attack", "magic"] } } satisfies TargetRuleT,
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
  // Step 5h (the director's): no MP regen in fights by default. A class's regen word is kept for the record and given 0: MP comes
  // back on the bench after a fight sat out (rogue config benchMp), and in fights only from gear, a seat, Clarity, Refrain or Siphon.
  max_hp: pts(hp), max_mp: pts(mp), mp_regen: 0 * regen, attack: pts(atk), magic: pts(mag), armor: pts(armor), crit_chance: crit(c), aggro: aggroOf(aggro),
});
// Step 5g round 7 (a feel reader's catch): a class's stat line is its base, so "Crit damage high" had set the Geomancer's and Assassin's
// multiplier to 100 (crits for no extra damage) in place of the default 150 plus the word. The word adds to the default now.
const special = (s: SpecialStat, level: SpecialLevel) => ({ [SPECIAL_KEY[s]]: (s === "crit_damage" ? 150 : 0) + SPECIAL[s][level] });
const resist = (element: string, kind: "resists" | "weak") => ({ [`resist:${element}`]: RESIST[kind] });

/** Stacks a passive's application adds: scaled from the holder's stat, read when it fires. */
const own = (word: StackWord, stat: string, mult = 1): NumT => ({ scale: [{ ratio: (mult * STACKS[word]) / P, stat, of: "holder" }] });
const passive = (id: string, name: string, body: Partial<StatusT>): StatusT =>
  ({ id, name, label: "buff", show: "sheet", stacking: "refresh", unremovable: true, ...body }) as StatusT;
const bothKinds = (pct: StatusT["boosts"] extends (infer B)[] | undefined ? (B extends { pct: infer N } ? N : never) : never) => [{ tag: "physical", pct }, { tag: "magical", pct }];

// ─── Passives ────────────────────────────────────────────────────────────────

export const passives: StatusT[] = [
  // Step 5f (the director's): Sworn (Taunt when an ally falls) rarely fired and came too late; the Knight starts behind a Shield instead.
  passive("vanguard", "Vanguard", { text: "Starts every fight behind a Shield from its max HP.", reactions: [{ on: { event: "fight_start" }, do: [apply("shield", { stacks: { scale: [{ ratio: 0.2, stat: "max_hp", of: "holder" }] }, to: "holder" })] }] }),
  passive("hunters_eye", "Hunter's eye", { text: "Basic attacks ignore Taunt.", seek: "basic" }),
  // Step 5c (the director's): Bleed, not Poison, with stacks from Armor.
  passive("briar", "Briar", { text: "Foes its Thorns wound start to bleed.", reactions: [{ on: { event: "damage_dealt", status: "thorns" }, do: [apply("bleed", { stacks: own("few", "armor"), to: "other" })] }] }),
  // Step 5g round 5 (the director's): half as often for double damage (was a third for triple: one swing a fight, "a statue").
  passive("phalanx", "Phalanx", { text: "Basic attacks half as often, for double damage.", stats: [{ stat: "attack_speed", flat: -100 }], boosts: [{ tag: "basic", pct: 100 }] }),
  // Step 5f (the director's): +50%, not double: "very situational and probably too powerful when it's relevant".
  passive("judgement", "Judgement", { text: "Hits deal half again as much to foes with a buff.", boosts: bothKinds({ scale: [{ ratio: 50, when: { buffs: true }, of: "target" }] }) }),
  // Step 5f (the director's): Encore (can't be Silenced) worked against two enemies; Last rites halves its cooldowns below 30% HP (Bloodlust's pattern).
  passive("last_rites", "Last rites", {
    text: "Cooldowns halved below 30% HP.",
    reactions: [
      { on: { event: "hp_lost" }, do: [apply("last_rites_on", { to: { side: "self", where: { hpBelow: 30 } } })] },
      { on: { event: "healed" }, do: [{ op: "remove", label: "buff", status: "last_rites_on", to: { side: "self", where: { hpAtLeast: 30 } } }] },
    ],
  }),
  { id: "last_rites_on", name: "LAST RITES", text: "Cooldowns halved.", label: "buff", show: "icon", stacking: "fizzle", stats: [{ stat: "cooldown_reduction", flat: 100 }] },
  // Follow-up redesign (the director's): the Bard's tempo includes mana. Its old passive, Encore, went to the Cleric.
  // Step 5f (the director's): the MP given grows with Attack, so the Bard's weapon is a choice.
  // Step 5g round 6 (the director's rework): the old Cleric's Mercy comes to the Bard, small: each landed basic attack heals a random ally for a share of
  // the damage dealt, and gives a random ally MP for the same share; so its weapon is a choice against the foe's Armor and resistance.
  passive("refrain", "Refrain", { text: "Basic attacks heal a random ally and give a random ally MP, each a share of the damage dealt.", reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [
    { op: "heal", amount: { scale: [{ ratio: STATUS.refrain.share, amount: true }] }, to: { side: "allies", pick: "random" } },
    { op: "mp", amount: { scale: [{ ratio: STATUS.refrain.share, amount: true }] }, to: { side: "allies", pick: "random" } },
  ] }] }),
  passive("cold_hex", "Cold hex", { text: "Basic attacks add a few Chill.", reactions: [{ on: { event: "hit_lands", kind: "basic" }, do: [apply("chill", { stacks: own("few", "magic", 1.3), to: "other" })] }] }), // Round 9 (the director's): more Chill a hit (3.6 at Magic 4, was 2.8), so the Hexer can reach a shatter alone over a fight.
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
  // Step 5g round 5 (the director's redesign): Chill shatters at its cap; the Frostweaver's passive rides the shatter. Brittle (more damage per Chill stack) is gone.
  passive("shatterpoint", "Shatterpoint", { text: "When a foe's Chill shatters, it takes several Sunder.", reactions: [{ on: { event: "status_capped", status: "chill", whose: "foe" }, do: [apply("sunder", { stacks: own("several", "magic"), to: "owner" })] }] }),
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
  // Step 5f: Blood gift's price. An action can't deal untyped damage, and a Dark hit on itself would meet its own resistance and Lifesteal; a status pays it the moment it lands.
  { id: "blood_price", name: "BLOOD PRICE", text: "Pays a fifth of its max HP.", label: "buff", show: "icon", stacking: "fizzle", unremovable: true, duration: 1, reactions: [{ on: { event: "status_gained", status: "blood_price" }, do: [{ op: "damage", type: "none", amount: { scale: [{ ratio: 0.2, stat: "max_hp", of: "holder" }] }, to: "holder" }] }] },
  { id: "bedrock_on", name: "BEDROCK", text: "Crit chance doubled.", label: "buff", show: "icon", stacking: "fizzle", stats: [{ stat: "crit_chance", flat: { scale: [{ ratio: 1, stat: "crit_chance", of: "holder" }] } }] },
];

// ─── Abilities ───────────────────────────────────────────────────────────────

// Step 5g round 6 (the director's): every cost up by about a third and MP regen halved, so that potions, tonics and Clarity matter. Round 8
// (the director's: "healthy, not punishing"; the read: the 2,000 to 3,000 MP classes paying spell prices were short most of a fight): skills
// back to 5f's 150 / 250 / 400 / 600, spells 350 / 500 / 800 / 1,200, with the tonic at half a pool and regen at 1.2%.
// MP costs are set by hand, ability by ability (step 5c, the director's: no rule from a stat to a cost). Step 5f (the director's:
// "mana needs to be normalized to values that make sense across the roster", and "the more a unit is a caster the more mana
// matters"): two tiers on one ladder by cooldown word. Skills (the physical classes' and the Valkyrie's spear): 150 / 250 / 400 / 600.
// Spells (the healers', the Bard's, Hexer's and Paladin's, the four mages', the Vampire's dark arts): 300 / 500 / 800 / 1,200, the
// big ones a rung up (Fireball, Blizzard, Thunderstorm 800; Pyre, Raise, Valhalla 1,200). Round 3: one ladder for everyone (250 / 400
// / 650 / 1,000 at 2% regen) starved the 2,000-pool fighters a third of their time and the 5,000-pool casters never.
type A = Omit<AbilityT, "class"> & { class: string };
// Pacing pass: each ability's cooldown is its word's, moved by its id (scale.ts, jitter), so no two in a kit are the same.
const a = (cls: string, id: string, name: string, text: string, body: Partial<AbilityT> & { do: AbilityT["do"]; cooldown: number }): A => ({ id, class: cls, name, text, ...body, cooldown: jitter(body.cooldown, id) });

export const abilities: A[] = [
  // Knight
  // Round 5: Fortify medium (the Knight cast 7 times a regular fight on two shorts).
  a("knight", "fortify", "Fortify", "Guards the ally with the lowest share of HP.", { ...timing("long", "quick"), mp: 325, target: T.lowestShareAlly, do: [apply("guard")] }),
  // Step 5c (the director's, to try): a long cooldown (was medium). How often it comes was the Knight's strength; its size isn't,
  // since a Shield can't pass half its target's max HP.
  // Step 5f (the director's): Protect (a Shield on the lowest ally) overlapped the Hoplite; Stand fast is Taunt on the Knight and mana for an ally.
  a("knight", "stand_fast", "Stand fast", "Taunts, and gives Clarity to the ally with the least MP.", {
    // Round 4: short (was medium): the first Taunt came at tick 18, and the casters died at 17.
    // Step 5g round 5 (the director's): the Clarity goes to an ally under half MP, or nobody; the Taunt always lands.
    ...timing("medium", "quick"), mp: 200, target: "self", do: [apply("taunt"), apply("clarity", { to: T.needsMpAlly })],
  }),
  // Pacing pass: a light hit (was normal): at normal it was seven or eight of the Knight's swings, a tank's nuke.
  a("knight", "shield_bash", "Shield bash", "Bashes a foe with the shield, which scales from max HP, and Stuns it.", {
    ...timing("medium", "quick"), mp: 325, target: lacking({ side: "foes" }, "stun", true), do: [phys("blunt", hit("max_hp", "light"), { apply: [{ status: "stun" }] })], // Step 5f (the director's): from max HP, not Armor: the health tank.
  }),
  // Cleric. Follow-up redesign (the director's): no free heal (Mercy healed three quarters of every staff hit), an active
  // healer that spends MP. Prayer (Regen on every ally) and Purify (a cleanse) became Renew, on one ally that's never idle.
  a("cleric", "renew", "Renew", "Cleanses an ally with a debuff and gives it Regen; with nobody debuffed, Regen on the lowest ally.", {
    ...timing("medium", "normal"), mp: 650, target: { side: "allies", where: { debuffs: true }, ifNone: "any", pick: "lowest", by: "hp_share" }, do: [{ op: "remove", label: "debuff" }, apply("regen")],
  }),
  a("cleric", "cure", "Cure", "A quick, small heal on the lowest ally.", {
    // Step 5e: 0.55 of Magic for 1,000 MP (was 0.45 for 1,280): Cure healed a third of a unit's HP a cast while the Valkyrie's Rally healed half for half the MP, so the healer was the worse healer.
    // Step 5g round 3: waits for an ally under 80% (was 100%): "heals overkill or nothing"; a 2,600 Cure on a unit missing 300 HP was the Cleric's most frequent act.
    ...timing("quick", "quick"), mp: 450, ...waitsFor("allies", { hpBelow: 80 }), target: T.lowestShareAlly, do: [{ op: "heal", amount: from("magic", 0.35) }], // Round 9 (the director's: "a top up character", "never seen it not heal someone to full"): 0.35 on the quick word (was 0.65 on short). // round 5: 0.65, so the healer out-heals the Valkyrie.
  }),
  a("cleric", "raise", "Raise", "Revives a random knocked-out ally with half its HP.", {
    ...timing("very_long", "very_long"), mp: 1500, ...waitsFor("allies", { ko: true }), target: T.koAlly, do: [{ op: "revive", hp: { scale: [{ ratio: REVIVE.half, stat: "max_hp", of: "target" }] } }],
  }),
  // Ranger
  // Step 5c (the director's): Bleed for Poison, stacks from Attack, at a random foe (it sought a foe without Poison).
  a("ranger", "barbed_arrow", "Barbed arrow", "A barbed arrow at a random foe, adding several Bleed.", { ...timing("quick", "quick"), mp: 200, do: [phys("pierce", hit("attack", "light"), { apply: [{ status: "bleed", stacks: stacks("several", "attack") }] })] }),
  // Step 5g round 9 (the director's): Fire arrow was "overtuned ... more base damage and more Burn than anything the Pyromancer can do", and the Ranger
  // read as "a 3 nuke unit". It becomes Frost arrow: a quick, light shot that lays a few Chill, so the Ranger helps the Frostweaver and the Hexer reach a shatter.
  a("ranger", "frost_arrow", "Frost arrow", "A quick, cold arrow at the foe with the most Chill, adding a few.", {
    ...timing("quick", "quick"), mp: 200, target: T.mostFoe("chill"), do: [magic("ice", hit("attack", "light"), { apply: [{ status: "chill", stacks: stacks("few", "attack", 0.5) }] })],
  }),
  a("ranger", "rending_arrow", "Rending arrow", "An arrow at the foe with the most Sunder, adding a few.", {
    ...timing("short", "normal"), mp: 325, target: T.mostFoe("sunder"), do: [phys("pierce", hit("attack", "normal"), { apply: [{ status: "sunder", stacks: stacks("few", "attack") }] })], // Round 9: normal and a few (were heavy and several: 6,905 a cast, and Sunder now ramps damage taken to a cap of 20).
  }),
  // Bramble knight
  a("bramble_knight", "thicket", "Thicket", "Taunts and Guards itself.", { ...timing("medium", "quick"), mp: 200, target: "self", do: [apply("taunt"), apply("guard")] }),
  a("bramble_knight", "regrowth", "Regrowth", "Regen on the lowest ally.", { ...timing("medium", "normal"), mp: 325, target: T.lowestShareAlly, do: [apply("regen")] }),
  a("bramble_knight", "bramble_lash", "Bramble lash", "Lashes a random foe with its thorns.", { ...timing("quick", "quick"), mp: 200, do: [phys("pierce", { scale: [{ ratio: 4.5, stat: "thorns" }] })] }),
  // Hoplite
  a("hoplite", "aspis", "Aspis", "Aegis on the lowest ally.", { ...timing("long", "quick"), mp: 500, ...waitsFor("allies", { lacks: "aegis" }), target: lacking(T.lowestShareAlly, "aegis"), do: [apply("aegis")] }),
  a("hoplite", "paired_guard", "Paired guard", "Guards itself and the other lowest ally.", { ...timing("long", "normal"), mp: 325, target: "self", do: [apply("guard"), apply("guard", { to: T.otherLowestShareAlly })] }),
  // Step 5e: 1.5 of Attack (was a normal hit, 0.75): Phalanx triples the swing and not the thrust, so the thrust dealt 0.9 of the Hoplite's own swing.
  a("hoplite", "spear_thrust", "Spear thrust", "A thrust at a random foe that adds a few Sunder.", { ...timing("medium", "long"), mp: 325, do: [phys("pierce", from("attack", 1.1), { apply: [{ status: "sunder", stacks: stacks("few", "attack") }] })] }),
  // Paladin
  a("paladin", "sanctuary", "Sanctuary", "Ward on every ally.", { ...timing("long", "long"), mp: 1000, target: T.everyAlly, do: [apply("ward")] }),
  // Step 5f (the director's): Absolve heals as it cleanses, and fires whether or not there's a debuff to lift.
  a("paladin", "absolve", "Absolve", "Cleanses and heals itself and the lowest other ally; the heal scales from Magic.", {
    ...timing("medium", "normal"), mp: 650, ...waitsFor("allies", { hpBelow: 100 }), target: "self",
    do: [{ op: "remove", label: "debuff" }, { op: "heal", amount: from("magic", 0.4) }, { op: "remove", label: "debuff", to: T.otherLowestShareAlly }, { op: "heal", amount: from("magic", 0.4), to: T.otherLowestShareAlly }],
  }),
  // Step 5c (the director's): Smite Burns, on a medium cooldown (was long).
  // Step 5g round 4: a long wind-up (6), not very long (8): the Paladin cast nothing in three of twelve read fights, dying in Smite's wind-up.
  a("paladin", "smite", "Smite", "Heavy Light damage to the foe with the highest Attack or Magic, adding several Burn.", {
    ...timing("medium", "long"), mp: 650, target: T.highestAMFoe, do: [magic("light", hit("magic", "normal"), { apply: [{ status: "burn", stacks: stacks("several", "magic") }] })],
  }),
  // Valkyrie
  a("valkyrie", "gale_spear", "Gale spear", "Three quick Wind hits on a foe that isn't Taunting, each adding a few Shock.", {
    // Campaign pass: 0.1 of Attack a hit, not light's 0.2. Three undodgeable hits with Seek on a short cooldown made the Valkyrie the best class on every node.
    // Step 5e: 0.2 a hit (was 0.25): Gale spear was 45% of the Valkyrie's damage at 2.7 swings a cast, 1.4 casts a regular fight, and its parties won 15 to 32 points more than parties without it.
    // Round 6: 500, 800 and 1,500 MP (were 400, 650 and 1,200): a spear that heals and revives is a mid-tier caster, and it was short of MP 3% of its time.
    ...timing("quick", "quick"), mp: 200, seek: true, target: T.notTauntingFoe, do: [magic("wind", from("attack", 0.09), { hits: 3, apply: [{ status: "shock", stacks: stacks("few", "attack", 0.5) }] })],
  }),
  a("valkyrie", "rally", "Rally", "Heals the lowest ally; the amount scales from Magic.", {
    // Campaign pass: 0.3 of Magic, not 0.6.
    // Step 5e: 0.55 of Magic (was 0.7): see Cure. The Valkyrie healed more a fight than the Cleric and its parties won 13 to 31 points more than parties without it.
    ...timing("medium", "normal"), mp: 650, ...waitsFor("allies", { hpBelow: 80 }), target: T.lowestShareAlly, do: [{ op: "heal", amount: from("magic", 0.45) }], // round 5: 0.45; at 0.55 the Valkyrie still healed as much a fight as the Cleric. // Step 5g round 3: waits for 80%.
  }),
  a("valkyrie", "valhalla", "Valhalla", "Revives a random knocked-out ally with a tenth of its HP, every action ready.", {
    ...timing("very_long", "quick"), mp: 1500, ...waitsFor("allies", { ko: true }), target: T.koAlly, do: [{ op: "revive", hp: { scale: [{ ratio: REVIVE.tenth, stat: "max_hp", of: "target" }] }, ready: true }],
  }),
  // Bard
  // Step 5e: Haste on the ally with the highest Attack or Magic (was a random ally), and the Bard's songs at 400 MP (were 650): it never
  // ran short of MP, and its parties won 13 to 25 points less than parties without it.
  // Step 5f (the director's): Allegro and War ballad merged into one short song on a random ally, and a small heal on every ally in the slot it frees.
  // Round 6: several Might (was many: 20 stacks, the cap, every 14 ticks).
  // Step 5g round 6 (the director's): merging the two songs was a mistake. War ballad: a few Might on every ally on a short cooldown; Allegro: Haste on every ally on a medium one.
  a("bard", "war_ballad", "War ballad", "A few Might on every ally.", { ...timing("quick", "quick"), mp: 450, target: T.everyAlly, do: [apply("might", { stacks: stacks("few", "magic") })] }),
  // Step 5g round 3: 0.25 of Magic (was 0.15: 450 an ally against 6,800 incoming), and it waits for an ally under 80%.
  a("bard", "allegro", "Allegro", "Haste on every ally.", { ...timing("long", "quick"), mp: 650, target: T.everyAlly, do: [apply("haste")] }),
  // Step 5c (the director's): Lullaby (Slow on one foe) became a Shock on every foe.
  // Many, not several: at several an AI playtester saw it peak at 10 stacks for under 2,000 a fight, the Bard a passenger.
  // Step 5g round 4: several (was many): with gear and the rogue's upgrade one chord put 40 Shock (the cap) on a boss, which then paid 3,200 for a 560 swing.
  a("bard", "thunder_chord", "Thunder chord", "Several Shock on every foe.", { ...timing("short", "normal"), mp: 650, target: T.everyFoe, do: [apply("shock", { stacks: stacks("several", "magic") })] }),
  // Hexer
  // Step 5e: 1,200, 900 and 1,000 MP (were 1,600, 1,300 and 1,300): the Hexer's parties won 9 to 17 points less than parties without it, and it cast 1.3 abilities a regular fight.
  // Step 5f (the director's rework): the debuff bot. Hush (Silence on one foe) became Malison, Unravel (one buff off one foe) became Unmake.
  a("hexer", "malison", "Malison", "A few Burn and a few Shock on every foe.", { ...timing("short", "normal"), mp: 450, target: T.everyFoe, do: [apply("burn", { stacks: stacks("few", "magic") }), apply("shock", { stacks: stacks("few", "magic") })] }),
  a("hexer", "unmake", "Unmake", "Silences the casting foe with the highest Attack or Magic and strips its buffs. Waits for a foe to cast.", {
    ...timing("medium", "quick"), mp: 650, ...waitsFor("foes", { casting: true }), target: T.castingFoe, do: [apply("silence"), { op: "remove", label: "buff" }],
  }),
  a("hexer", "enfeeble", "Enfeeble", "Weakens the foe with the highest Attack or Magic and adds a few Sunder.", { ...timing("quick", "normal"), mp: 450, target: T.highestAMFoe, do: [apply("weaken"), apply("sunder", { stacks: stacks("few", "magic") })] }), // Round 9: a few Sunder (several was 10 of the cap of 20 in one cast). // Step 5f: Sunder for Slow (Chill covers it).
  // Monk
  a("monk", "flow", "Flow", "Haste on itself.", { ...timing("long", "quick"), mp: 200, target: "self", do: [apply("haste")] }),
  a("monk", "burning_fist", "Burning fist", "Three quick Fire hits on the foe with the most Burn, each adding a few.", {
    // Step 5g round 2: about 3 Burn a hit, 9 a cast at base (was 5 a hit): three touches on a short cooldown made the Monk a bigger Burn engine than the Pyromancer (a near-dead Monk's one cast took a ghoul to 40 stacks and 39% of a fight's damage).
    ...timing("quick", "quick"), mp: 200, target: T.mostFoe("burn"), do: [magic("fire", from("attack", 0.11), { hits: 3, apply: [{ status: "burn", stacks: stacks("few", "attack", 0.6) }] })],
  }),
  a("monk", "pressure_point", "Pressure point", "Stuns the foe with the highest Attack or Magic, past any guard.", {
    ...timing("medium", "normal"), mp: 325, seek: true, target: lacking(T.highestAMFoe, "stun", true), do: [phys("blunt", hit("attack", "normal"), { apply: [{ status: "stun" }] })],
  }),
  // Assassin
  a("assassin", "vanish", "Vanish", "Goes Hidden.", { ...timing("short", "quick"), mp: 200, ...waitsFor("self", { lacks: "hidden" }), target: "self", do: [apply("hidden")] }),
  a("assassin", "backstab", "Backstab", "Damage scaling from Crit chance to the foe with the lowest HP, past any guard.", { ...timing("medium", "normal"), mp: 325, seek: true, target: T.lowestHpFoe, do: [phys("pierce", hit("crit_chance", "normal"))] }), // Round 9 (the director's: "super OP in the first starting fights"): normal (was heavy).
  a("assassin", "garrote", "Garrote", "Silences a random foe that isn't Taunting, past any guard.", {
    ...timing("medium", "quick"), mp: 325, seek: true, target: lacking(T.notTauntingFoe, ["taunt", "silence"], true), do: [phys("pierce", hit("attack", "normal"), { apply: [{ status: "silence" }] })],
  }),
  // Vampire
  // Step 5e: 0.5 of max HP (was a normal hit, 0.75): at 4 swings a cast twice a fight it was 60% of the Vampire's damage, and
  // through Lifesteal most of the 3,850 HP it healed itself a fight; parties with the Vampire won 37 points more than without.
  a("vampire", "blood_drain", "Blood drain", "Dark damage scaling from max HP to a random foe, which is Weakened.", { ...timing("quick", "quick"), mp: 125, do: [magic("dark", from("max_hp", 0.4), { apply: [{ status: "weaken" }] })] }), // Step 5g round 4: 100 MP (was 150): the Vampire arrived dry in four of six read fights; its 2,000 pool is the roster's smallest and its loop the most frequent. // round 6: 0.4 (the Vampire still +11 / +25 / +9 at 0.5).
  // Step 5f (the director's): Wither's Rot met one enemy heal in the whole roster. Blood gift spends the Vampire's own HP on an ally.
  a("vampire", "blood_gift", "Blood gift", "Spends a fifth of its max HP to heal the lowest other ally for as much, and gives it Clarity.", {
    // Step 5g round 3: 300 MP (was 500) and it waits for an ally under 80%: it already costs a fifth of the Vampire's HP, and the Vampire was the one class short of MP (21% of its time).
    // Round 5 (the director's): it also waits until the Vampire itself is above 35% HP, so the price (a fifth) never kills it.
    ...timing("medium", "normal"), mp: 450, if: [{ side: "others", where: { hpBelow: 80 } }, { side: "self", where: { hpAtLeast: 35 } }], target: T.otherLowestShareAlly,
    do: [apply("blood_price", { to: { side: "self" } }), { op: "heal", amount: from("max_hp", 0.2) }, apply("clarity")],
  }),
  a("vampire", "frenzy", "Frenzy", "Several Might on itself.", { ...timing("medium", "quick"), mp: 450, target: "self", do: [apply("might", { stacks: stacks("several", "attack") })] }), // Step 5g round 3: 300 MP (was 500).
  // Pyromancer
  a("pyromancer", "firebolt", "Firebolt", "Fire at the foe with the most Burn, adding several.", { ...timing("quick", "normal"), mp: 450, target: T.mostFoe("burn"), do: [magic("fire", hit("magic", "light"), { apply: [{ status: "burn", stacks: stacks("several", "magic", BURN_STACKS) }] })] }),
  // Campaign pass: normal hits (0.35 of Magic), not light. Squishy damage dealers were in few winning builds; the run's attrition favours sustain.
  // Pacing pass: a light hit on each (was normal): about one swing a foe, for every foe.
  a("pyromancer", "fireball", "Fireball", "Fire on every foe, adding a few Burn to each.", { ...timing("medium", "long"), mp: 1000, target: T.everyFoe, do: [magic("fire", hit("magic", "touch"), { apply: [{ status: "burn", stacks: stacks("few", "magic", BURN_STACKS) }] })] }),
  a("pyromancer", "pyre", "Pyre", "Heavy Fire on the foe with the most Burn, rising with each stack. The Burn stays.", {
    // Round 5: medium (was long): on a long cooldown with a 10-tick wind-up, a caster that lives 19 ticks cast it 0.03 times a fight.
    // Step 5g: 200 a stack (was 300), with Burn uncapped: at 25 stacks a Pyre is 9,250, the ramp's payoff, not a second ramp.
    ...timing("long", "very_long"), mp: 1500, target: T.mostFoe("burn"), do: [magic("fire", { scale: [{ ratio: HIT.heavy, stat: "magic" }, { ratio: 200, stacks: "burn", of: "target" }] })],
  }),
  // Frostweaver
  // Step 5g (the director's deep freeze with upkeep): about 6 Chill a lance at Magic 4 (was 16 against a cap of 12: one cast froze a foe solid). The third lance, or the second with a Blizzard between, reaches 12; a stack thaws every 6 ticks.
  // Round 6: ×0.4 (was 0.6): with gear and the rogue's upgrade a lance put 12 Chill, the cap, in one cast, an instant 6,630 shatter and Stun for 300 MP every 13 ticks.
  a("frostweaver", "frost_lance", "Frost lance", "Ice at the foe with the most Chill, adding several.", { ...timing("quick", "normal"), mp: 450, target: T.mostFoe("chill"), do: [magic("ice", hit("magic", "light"), { apply: [{ status: "chill", stacks: stacks("several", "magic", 0.6) }] })] }), // Round 9: 0.6 (the director: "a little bit", with Chill thawing slowly). // Round 8: 0.5 (at 0.4 eight lances peaked at 6 of 12 and the shatter never came).
  // Campaign pass: 0.3 of Magic, not light's 0.2, for the same reason as Fireball.
  // Step 5e: Blizzard 1,000 MP (was 1,300): cast 0.44 times a regular fight.
  a("frostweaver", "blizzard", "Blizzard", "Ice on every foe, adding a few Chill to each.", { ...timing("medium", "long"), mp: 1000, target: T.everyFoe, do: [magic("ice", hit("magic", "touch"), { apply: [{ status: "chill", stacks: stacks("few", "magic", 0.45) }] })] }), // Step 5g: about 2.5 a foe (round 8: 0.45).
  // Step 5e: 400 MP (was 1,600: it cost more than the Clarity it gave back, and fired 0.04 times a regular fight).
  // Step 5g round 5 (the director's: "a strictly worse version of the Knight's Clarity"): Clarity to an ally under half MP, and a few Chill on every foe, so it feeds the shatter too.
  a("frostweaver", "stillness", "Stillness", "Clarity on the ally with the least MP, if one is under half, and a few Chill on every foe.", { ...timing("medium", "quick"), mp: 650, target: T.everyFoe, do: [apply("chill", { stacks: stacks("few", "magic", 0.5) }), apply("clarity", { to: T.needsMpAlly })] }),
  // Stormcaller
  a("stormcaller", "chain_lightning", "Chain lightning", "Lightning at a random foe, then up to three others, adding a few Shock to each.", {
    ...timing("quick", "quick"), mp: 650,
    do: [
      // Pacing pass: 0.6 and 0.3 of Magic (were normal and light), so four foes take about two and a half swings, not five.
      magic("lightning", hit("magic", "light"), { apply: [{ status: "shock", stacks: stacks("few", "magic", SHOCK_STACKS) }] }),
      magic("lightning", hit("magic", "touch"), { apply: [{ status: "shock", stacks: stacks("few", "magic", SHOCK_STACKS) }], to: T.threeOtherFoes }),
    ],
  }),
  a("stormcaller", "thunderstorm", "Thunderstorm", "Lightning on every foe, adding a few Shock to each.", { ...timing("medium", "normal"), mp: 1000, target: T.everyFoe, do: [magic("lightning", hit("magic", "touch"), { apply: [{ status: "shock", stacks: stacks("few", "magic", SHOCK_STACKS) }] })] }),
  // Step 5e: 400 MP (was 1,200 for the same Haste the Monk's Flow gives for 100; it fired 0.02 times a regular fight).
  // Round 5: Static charge medium and quick (was long with a 6-tick wind-up: 0.06 casts a fight).
  a("stormcaller", "static_charge", "Static charge", "Haste on itself.", { ...timing("long", "quick"), mp: 650, target: "self", do: [apply("haste")] }),
  // Geomancer
  a("geomancer", "earthen_shell", "Earthen shell", "Shields itself and the other lowest ally; the amount scales from Armor.", {
    ...timing("medium", "normal"), mp: 650, ...waitsFor("allies", { belowCap: "shield" }), target: "self",
    do: [apply("shield", { stacks: from("armor", 1.0), to: { side: "self", where: { belowCap: "shield" } } }), apply("shield", { stacks: from("armor", 1.0), to: { ...T.otherLowestShareAlly, where: { belowCap: "shield" } } })],
  }),
  a("geomancer", "rockfall", "Rockfall", "Earth damage scaling from Armor on a random foe.", { ...timing("short", "long"), mp: 450, do: [magic("earth", hit("armor", "normal"))] }),
  a("geomancer", "tremor", "Tremor", "Earth damage on a random foe, which is Stunned.", { ...timing("long", "very_long"), mp: 1000, target: lacking({ side: "foes" }, "stun", true), do: [magic("earth", hit("magic", "normal"), { apply: [{ status: "stun" }] })] }),
];

// ─── Classes ─────────────────────────────────────────────────────────────────

const cls = (id: string, name: string, text: string, body: Omit<ClassDefT, "id" | "name" | "text" | "source" | "abilities"> & { source?: ClassDefT["source"] }): ClassDefT => ({
  id, name, text, source: body.source ?? "unlock", stats: body.stats, weapons: body.weapons, armor: body.armor, passive: body.passive,
  abilities: abilities.filter((x) => x.class === id).map((x) => x.id),
});
const p = (status: string, name: string, text: string) => ({ name, text, statuses: [status] });

export const classes: ClassDefT[] = [
  cls("knight", "Knight", "Protector. Starts every fight behind its own Shield, Guards whoever is lowest, calls every foe onto itself while an ally regains its mana, and bashes a foe with the weight of its own body.", {
    // Step 5c (the director's, to try): HP 4 (the document's 5), with Protect on a long cooldown: the Knight was in 69% of top builds.
    source: "starter", stats: stat(5, 2, 2, 3, 1, 4, 2, 5), weapons: ["sword", "axe"], armor: "heavy", passive: p("vanguard", "Vanguard", "It starts every fight behind a Shield that scales from its max HP."), // Step 5f (the director's): HP 5, Armor 4: the health tank beside the Hoplite's plate.
  }),
  cls("cleric", "Cleric", "Healer. Mends whoever is lowest with quick, small heals, lifts a curse and wraps the ally in Regen, raises the fallen, and prays twice as fast when its own life is in danger.", {
    source: "starter", stats: stat(2, 5, 4, 1, 4, 2, 2, 1), weapons: ["light_staff"], armor: "light", passive: p("last_rites", "Last rites", "Below 30% of its max HP, its cooldowns are halved."),
  }),
  cls("ranger", "Ranger", "Wears down tough targets. Looses barbed, cold and rending arrows at whatever stands in front, while its plain arrows fly past any guard and open the wounds.", {
    source: "starter", stats: { ...stat(3, 3, 3, 4, 1, 2, 3, 2), ...special("accuracy", "medium") }, weapons: ["bow", "dagger"], armor: "medium", passive: p("hunters_eye", "Hunter's eye", "Its basic attacks ignore Taunt."),
  }),
  cls("bramble_knight", "Bramble knight", "Thorns tank. Draws every foe onto its thorns, where each attacker is left bleeding for the party's blows, regrows whoever is lowest, and lashes out with the thorns themselves.", {
    stats: { ...stat(5, 2, 2, 3, 2, 3, 2, 5), ...special("thorns", "high"), ...resist("fire", "weak") }, weapons: ["sword", "earth_staff"], armor: "heavy", passive: p("briar", "Briar", "Each time its Thorns damage a foe, that foe gets a few Bleed; stacks scale from Armor."),
  }),
  cls("hoplite", "Hoplite", "Bodyguard who opens foes up. Plants its great shield beside the most vulnerable ally to catch the killing blow, locks shields with it, and leaves foes sundered with slow, crushing blows.", {
    stats: stat(4, 2, 2, 4, 1, 5, 2, 5), weapons: ["spear", "sword"], armor: "heavy", passive: p("phalanx", "Phalanx", "Its basic attacks come half as often and deal double damage."),
  }),
  cls("paladin", "Paladin", "Shelter against magic. Shelters the party from spells and curses, and brings down slow, heavy, burning judgement, half again as hard on any foe that holds a buff.", {
    stats: { ...stat(4, 3, 3, 3, 4, 4, 2, 4), ...resist("light", "resists") }, weapons: ["sword", "light_staff"], armor: "heavy", passive: p("judgement", "Judgement", "Its hits deal half again as much damage to foes with a buff."),
  }),
  cls("valkyrie", "Valkyrie", "Storm spear who heals and revives. A storm-borne spear that reaches past any guard and Shocks what it hits, mends the wounded, and snatches the fallen back ready to fight.", {
    stats: stat(3, 3, 3, 4, 3, 3, 3, 3), weapons: ["spear", "sword", "light_staff"], armor: "medium", passive: { name: "Einherjar", text: "Allies it revives come back with all their actions ready, instead of on cooldown." },
  }),
  cls("bard", "Bard", "Party tempo. A caster at the back whose every note mends an ally a little and gives another mana, with a ballad that steadies the whole party, an allegro that quickens it, and thunder that shocks every foe.", {
    // Step 5g round 6 (the director's): HP 3 and Armor 3 (were 2 and 2): a buffer that doesn't deal damage needn't be glass.
    stats: stat(3, 4, 3, 3, 3, 3, 2, 1), weapons: ["dagger", "bow", "light_staff"], armor: "medium", passive: p("refrain", "Refrain", "Each of its basic attacks that lands heals a random ally and gives a random ally MP, each a share of the damage dealt."),
  }),
  cls("hexer", "Hexer", "Curser. The debuff bot: burns and shocks every foe a little so the party's statuses pile up, weakens and sunders the most dangerous one, chills whatever it strikes, and silences a foe mid-cast.", {
    // Step 5f: HP 2 again (the director's: not HP).
    stats: { ...stat(2, 4, 3, 1, 4, 1, 2, 1), ...special("siphon", "medium") }, weapons: ["ice_staff", "dark_staff"], armor: "light", passive: p("cold_hex", "Cold hex", "Its basic attacks add a few Chill, whatever staff it carries; stacks scale from Magic."),
  }),
  cls("monk", "Monk", "Sunders with a blur of blows. Every blow leaves the foe a little more open, Flow keeps it fast, burning fists pile onto the hottest foe, and a pressure point drops the most dangerous one for a moment.", {
    // Step 5f (the director's): Attack 3,700, Crit 2, Aggro 2.
    stats: { ...stat(3, 2, 3, 4, 1, 2, 2, 2), attack: 3700, ...special("evasion", "high"), ...special("double_strike", "medium") }, weapons: ["fist", "spear"], armor: "medium",
    passive: p("iron_palm", "Iron palm", "Its basic attacks, and the second strike of its Double strike, add a few Sunder; stacks scale from Attack."),
  }),
  cls("assassin", "Assassin", "Burst killer. Slips out of sight, picks off the weakest foe past any guard, leaves every crit a bleeding wound, and silences the back line.", {
    // Step 5f: HP 2 again (the director's: not HP).
    stats: { ...stat(2, 3, 3, 5, 1, 2, 5, 1), ...special("crit_damage", "high"), ...special("evasion", "medium") }, weapons: ["dagger", "sword"], armor: "medium",
    passive: p("lacerate", "Lacerate", "Each of its crits adds several Bleed to the foe; stacks scale from Attack."),
  }),
  cls("vampire", "Vampire", "Drains to outlast. Feeds on everything it hits: the harder it hits, the more it heals, its prey is left weakened, and it bleeds its own life into an ally's wounds and mana.", {
    stats: { ...stat(4, 2, 2, 4, 2, 2, 2, 3), ...special("lifesteal", "high"), ...resist("light", "weak"), ...resist("dark", "resists") }, weapons: ["sword", "fist", "dark_staff"], armor: "medium",
    passive: p("bloodlust", "Bloodlust", "While it's below half of its max HP, its Lifesteal is doubled."),
  }),
  cls("pyromancer", "Pyromancer", "Ramping Burn. Every strike adds Burn, bolts pile more onto the hottest foe, and a pyre lands on it.", {
    stats: stat(2, 5, 2, 1, 5, 1, 2, 1), weapons: ["fire_staff", "lightning_staff"], armor: "light", passive: p("kindling", "Kindling", "Its basic attacks add a few Burn, whatever staff it carries; stacks scale from Magic."),
  }),
  cls("frostweaver", "Frostweaver", "Freezes and shatters. Buries foes in Chill until it shatters into damage and a Stun, leaves the shattered foe sundered for the party, and spends the time it buys keeping an ally's mana flowing.", {
    stats: { ...stat(2, 4, 3, 1, 4, 2, 2, 1), ...resist("ice", "resists") }, weapons: ["ice_staff", "wind_staff"], armor: "light", passive: p("shatterpoint", "Shatterpoint", "When a foe's Chill shatters, that foe takes several Sunder; stacks scale from Magic."),
  }),
  cls("stormcaller", "Stormcaller", "Shocks every foe. Rains quick strikes across every foe so the fast and the many hurt themselves by acting, and charges itself up to strike faster.", {
    stats: stat(2, 3, 3, 1, 4, 1, 2, 1), weapons: ["lightning_staff", "wind_staff"], armor: "light", passive: p("arc", "Arc", "Each of its basic attacks also hits a second, random foe, and adds a few Shock to both; stacks scale from Magic."),
  }),
  cls("geomancer", "Geomancer", "Hits hardest behind stone. Wraps itself and an ally in stone; while its own Shield holds, its rocks crit far more often and far harder, and a tremor drops a foe now and then.", {
    stats: { ...stat(3, 3, 3, 3, 4, 4, 4, 3), ...special("crit_damage", "high") }, weapons: ["earth_staff", "fire_staff", "axe"], armor: "heavy", passive: p("bedrock", "Bedrock", "While its Shield pool is above zero, its crit chance is doubled."),
  }),
];
