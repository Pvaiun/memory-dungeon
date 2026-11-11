/**
 * The five base-heavy kinds' 40 pieces (scale.ts KIND_WORDS): wand, rune sword, hammer, mace and staff, whose swing works for any
 * wearer and grows little with Attack. Each kind's pieces carry its budget of stat steps at every rarity (kit.ts budgetOf), leaning
 * to the kind's profile: its signature stat and its commons (docs/gear-design/loot.md, the leans by kind). The rich kinds (wand, mace, staff)
 * are carried for what's on them; the lean hammer for its blow.
 *
 * `gear` joins the pack's gear and the rogue's stock; `statuses` the pack's statuses; `builds` is designer data, never in the pack.
 * Every weapon here swings as its kind's plain weapon does unless its card says otherwise; no piece changes its kind's speed or hands.
 * Every status a card names is at its own length (statuses are universal). Heat and Fervor are shared.ts's.
 */
import type { EffectT, GearT, NumT, StatusT, TargetRuleT, ToT } from "../../../src/schema.js";
import { FLAT_STACKS, KIND_SPEED, STATUS, SWING_REF } from "../scale.js";
import { own, piece, pieceStatus, sp, st, weaponHit, type Build, type BuildTag, type Builds, type Change, type Rarity, type Trade } from "./kit.js";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Applies a status at its own length (statuses are universal: never a duration here), with stacks for an Intensity one. */
const apply = (status: string, to: ToT, stacks?: NumT): EffectT => ({ op: "apply", status, ...(stacks !== undefined ? { stacks } : {}), to });
/** A reaction to the holder's own basic attacks landing. */
const onBasic = (...effects: EffectT[]) => ({ on: { event: "hit_lands" as const, kind: "basic" as const }, do: effects });
/** A reaction at the fight's start. */
const atStart = (...effects: EffectT[]) => ({ on: { event: "fight_start" as const }, do: effects });
/** A share of a stat read off the holder. */
const ofHolder = (ratio: number, stat: string): NumT => ({ scale: [{ ratio, stat, of: "holder" }] });

/** One weapon of a kind, through `piece()`: its effect (the card, after any swing trade), stats, statuses and the rest. */
function weapon(name: string, kind: string, rarity: Rarity, rest: { effect?: string; stats?: Change[]; statuses?: string[]; trade?: Trade; weapon?: GearT["weapon"]; note?: string }): GearT {
  return piece({ name, kind, rarity, slot: "weapon", ...rest });
}

const lowestShareAlly: TargetRuleT = { side: "allies", pick: "lowest", by: "hp_share" };
const lowestMpAlly: TargetRuleT = { side: "allies", pick: "lowest", by: "mp_share" };

/**
 * Cinderheart staff: what one stack of Burn deals over its whole life, read from Burn's own numbers (its damage a stack × the sum of
 * its decay, a stack dropping by its share each pulse until under one), at 20 stacks: 55 × 6.36, about 350.
 */
const BURN_LIFE = (() => {
  const ref = 20;
  let sum = 0;
  for (let k = 0; ref * (1 - STATUS.burn.drop) ** k >= 1; k++) sum += (1 - STATUS.burn.drop) ** k;
  return Math.round(STATUS.burn.perStack * sum);
})();

/** Martyr's mace: +50% at each of 70, 50, 30 and 10% of max HP. */
const MARTYR_STEPS = [70, 50, 30, 10];
/** Warden's hammer: a tenth of the wearer's Defense on each swing, sized by the hammer's interval as a swing is. */
const WARDEN = Math.round((0.1 * KIND_SPEED.hammer) / SWING_REF * 1e6) / 1e6;
/** Grudgebearer: a tenth more per Charge held. */
const GRUDGE = 10;

// ─── The pieces' statuses ───────────────────────────────────────────────────

export const statuses: StatusT[] = [
  // Wand
  pieceStatus("jolt_wand", "Jolt wand", "Its basic attacks add one Shock.", { reactions: [onBasic(apply("shock", "other", FLAT_STACKS.one))] }),
  pieceStatus("glint_wand", "Glint wand", "When one of its hits crits, it regains 6% of its max MP.", {
    reactions: [{ on: { event: "hit_lands", tags: ["crit"] }, do: [{ op: "mp", amount: { scale: [{ ratio: 0.06, stat: "max_mp", of: "holder" }] }, to: "holder" }] }],
  }),
  pieceStatus("spark_wand", "Spark wand", "Its basic attacks add a few Burn.", { reactions: [onBasic(apply("burn", "other", own("few", "attack")))] }),
  pieceStatus("chain_wand", "Chain wand", "Its basic attacks also strike two other foes, each for half.", {
    strike: { to: { side: "foes", pick: "random", count: 2, exclude: "targets" }, share: 50 },
  }),
  pieceStatus("flicker_wand", "Flicker wand", "Its extra strikes add a few Shock.", {
    reactions: [{ on: { event: "hit_lands", kind: "extra" }, do: [apply("shock", "other", own("few", "attack"))] }],
  }),
  pieceStatus("wildmagic_wand", "Wildmagic wand", "Each of its basic attacks adds a few stacks of a random one of Burn, Chill, Shock, Bleed and Sunder.", {
    reactions: [onBasic({ op: "one", of: ["burn", "chill", "shock", "bleed", "sunder"].map((status) => ({ status, stacks: FLAT_STACKS.few })), to: "other" })],
  }),

  // Rune sword
  pieceStatus("sleet_blade", "Sleet blade", "Its basic attacks add one Chill.", { reactions: [onBasic(apply("chill", "other", FLAT_STACKS.one))] }),
  pieceStatus("sigil_blade", "Sigil blade", "Starts each fight behind a Shield of a fifth of its max MP.", { reactions: [atStart(apply("shield", "holder", ofHolder(0.2, "max_mp")))] }),
  pieceStatus("spellbinder", "Spellbinder", "After each ability it casts, its next basic attack deals double damage.", {
    reactions: [{ on: { event: "action_resolve", kind: "ability" }, do: [apply("spellbound", "holder")] }],
  }),
  {
    id: "spellbound", name: "SPELLBOUND", text: "Its next basic attack deals double damage.", label: "buff", show: "icon", stacking: "fizzle",
    boosts: [{ tag: "basic", pct: 100 }],
    reactions: [{ on: { event: "action_resolve", kind: "basic" }, do: [{ op: "remove", label: "buff", status: "spellbound", to: "holder" }] }],
  },
  // The echo answers `area` hits (a damage effect aimed at two or more units): Chain lightning's bounces, not its first strike.
  pieceStatus("conductors_blade", "Conductor's blade", "When one of its abilities hits several foes at once, each of those hits lands again for a quarter of its damage.", {
    reactions: [{ on: { event: "hit_lands", kind: "ability", tags: ["area"] }, do: [{ op: "strike", share: 25, of: "hit", to: "other" }] }],
  }),
  pieceStatus("winters_chain", "Winter's chain", "When a foe's Chill shatters, every other foe gains a few Chill.", {
    reactions: [{ on: { event: "status_capped", status: "chill", whose: "foe" }, do: [apply("chill", { side: "foes", pick: "all", exclude: "owner" }, own("few", "attack"))] }],
  }),
  pieceStatus("brimming_blade", "Brimming blade", "Each ability it casts gives the ally with the least MP a tenth of its cost in MP. While it has more than half its MP, its abilities cost a quarter less.", {
    mods: [{ mp: -25, if: { mpAtLeast: 50 } }],
    reactions: [{ on: { event: "action_resolve", kind: "ability" }, do: [{ op: "mp", amount: { scale: [{ ratio: 0.1, amount: true }] }, to: lowestMpAlly }] }],
  }),

  // Hammer
  pieceStatus("masons_hammer", "Mason's hammer", "Each hit it lands gives it a Shield of a tenth of its Defense.", { reactions: [{ on: { event: "hit_lands" }, do: [apply("shield", "holder", ofHolder(0.1, "defense"))] }] }),
  pieceStatus("bellringer", "Bellringer", "Its basic attacks on a foe in a wind-up Stun it.", {
    reactions: [{ on: { event: "hit_lands", kind: "basic" }, if: { unit: "other", where: { casting: true } }, do: [apply("stun", "other")] }],
  }),
  pieceStatus("rootstone_hammer", "Rootstone hammer", "Its basic attacks add a few Sunder, from its Defense.", { reactions: [onBasic(apply("sunder", "other", own("few", "defense")))] }),
  // Charge is shared.ts's counter: hits saved for one blow. Each hit taken saves one; the swing reads them and spends them.
  pieceStatus("grudgebearer", "Grudgebearer", "Each hit it takes adds a Charge, up to 10. Its basic attacks deal a tenth more for each Charge, and spend them.", {
    boosts: [{ tag: "basic", pct: { scale: [{ ratio: GRUDGE, stacks: "charge", of: "holder" }] } }],
    reactions: [
      { on: { event: "hit_taken" }, do: [apply("charge", "holder", 1)] },
      { on: { event: "action_resolve", kind: "basic" }, do: [{ op: "remove", label: "buff", status: "charge", to: "holder" }] },
    ],
  }),

  // Mace
  pieceStatus("menders_mace", "Mender's mace", "At the start of each fight, the ally with the lowest share of max HP gains Regen.", { reactions: [atStart(apply("regen", lowestShareAlly))] }),
  pieceStatus("priors_mace", "Prior's mace", "Each ability it casts heals it for 3% of its max HP.", {
    reactions: [{ on: { event: "action_resolve", kind: "ability" }, do: [{ op: "heal", amount: ofHolder(0.03, "max_hp"), to: "holder" }] }],
  }),
  pieceStatus("penitents_mace", "Penitent's mace", "Each hit it takes heals the ally with the lowest share of max HP for a tenth of the damage.", {
    reactions: [{ on: { event: "hit_taken" }, do: [{ op: "heal", amount: { scale: [{ ratio: 0.1, amount: true }] }, to: lowestShareAlly }] }],
  }),
  pieceStatus("censer_mace", "Censer mace", "Each of its basic attacks that lands heals the ally with the lowest share of max HP for a third of the damage dealt.", {
    reactions: [onBasic({ op: "heal", amount: { scale: [{ ratio: 0.33, amount: true }] }, to: lowestShareAlly })],
  }),
  pieceStatus("sunhammer", "Sunhammer", "Its basic attacks add several Burn. When a burning foe falls, its next basic attack also strikes every other foe.", {
    reactions: [
      onBasic(apply("burn", "other", own("several", "attack"))),
      // A foe's statuses end, cause ko, just before its ko event: a burning foe has fallen.
      { on: { event: "status_ended", status: "burn", cause: ["ko"], whose: "foe" }, do: [apply("sunburst", "holder")] },
    ],
  }),
  {
    id: "sunburst", name: "SUNBURST", text: "Its next basic attack also strikes every other foe, and those strikes add several Burn.", label: "buff", show: "icon", stacking: "fizzle",
    strike: { to: { side: "foes", pick: "all", exclude: "targets" } },
    reactions: [
      { on: { event: "hit_lands", kind: "extra" }, do: [apply("burn", "other", own("several", "attack"))] },
      { on: { event: "action_resolve", kind: "basic" }, do: [{ op: "remove", label: "buff", status: "sunburst", to: "holder" }] },
    ],
  },
  pieceStatus("martyrs_mace", "Martyr's mace", "Its basic attacks deal more the lower its HP; below 30% HP they also heal it for the damage dealt.", {
    boosts: [{ tag: "basic", pct: { scale: MARTYR_STEPS.map((hpBelow) => ({ ratio: 50, when: { hpBelow }, of: "holder" as const })) } }],
    reactions: [onBasic({ op: "heal", amount: { scale: [{ ratio: 1, amount: true }] }, to: { side: "self", where: { hpBelow: 30 } } })],
  }),

  // Staff
  pieceStatus("shepherds_staff", "Shepherd's staff", "At the start of each fight, the ally with the least MP gains Clarity.", { reactions: [atStart(apply("clarity", lowestMpAlly))] }),
  pieceStatus("canopy_staff", "Canopy staff", "At the start of each fight, it and the other ally with the least max HP each gain a Shield from its Attack.", {
    reactions: [atStart(...(["holder", { side: "others", pick: "lowest", by: { stat: "max_hp" } }] as const).map((to) => apply("shield", to, { scale: [{ ratio: 0.12, stat: "attack", of: "holder" }] })))],
  }),
  pieceStatus("banked_staff", "Banked staff", "Its abilities add half again as many Burn, Chill and Shock stacks.", { mods: [{ stacks: { pct: 50, statuses: ["burn", "chill", "shock"] } }] }),
  // Once a fight: a marker that ends with the fight or a knockout, so a revived wearer can have it again.
  pieceStatus("cistern_staff", "Cistern staff", "Once a fight, when it has less than a third of its MP at the fight's start or after it casts, it gains Clarity.", {
    reactions: [atStart(...cistern()), { on: { event: "action_resolve", kind: "ability" }, do: cistern() }],
  }),
  { id: "cistern_spent", name: "CISTERN", text: "Its Cistern staff has given its Clarity this fight.", label: "marker", show: "sheet", stacking: "fizzle" },
  // The count: +1 on each ordinary cast (a repeat isn't counted); on the third, the cast resolves again (free, no wind-up) and the count clears.
  pieceStatus("cataclysm_staff", "Cataclysm staff", "Every third ability it casts is cast twice; the second cast is free.", {
    reactions: [
      { on: { event: "action_resolve", kind: "ability", repeat: false }, do: [apply("cataclysm_count", "holder", 1)] },
      {
        on: { event: "action_resolve", kind: "ability", repeat: false },
        if: { side: "self", where: { stacks: { status: "cataclysm_count", atLeast: 3 } } },
        do: [{ op: "recast" }, { op: "remove", label: "marker", status: "cataclysm_count", to: "holder" }],
      },
    ],
  }),
  { id: "cataclysm_count", name: "CATACLYSM", text: "Abilities cast toward the next repeat.", label: "marker", show: "sheet", stacking: "intensity" },
  pieceStatus("cinderheart_staff", "Cinderheart staff", "Its basic attacks consume their target's Burn and deal at once all the damage it would have dealt.", {
    reactions: [onBasic(
      { op: "damage", type: "none", amount: { scale: [{ ratio: BURN_LIFE, stacks: "burn", of: "target" }] }, to: "other" },
      { op: "remove", label: "debuff", status: "burn", to: "other" },
    )],
  }),
];

/** Cistern staff's tap: Clarity, then the once-a-fight marker, each on the wearer only while it's under a third of its MP and hasn't had it. */
function cistern(): EffectT[] {
  const self: TargetRuleT = { side: "self", where: { mpBelow: 33, lacks: "cistern_spent" } };
  return [apply("clarity", self), apply("cistern_spent", self)];
}

// ─── The pieces ─────────────────────────────────────────────────────────────

export const gear: GearT[] = [
  // Wand (Bard, Hexer, Pyromancer): fast, one hand; light, base-heavy, rich. Cooldown; Cast speed, MP regen, Attack, Attack speed.
  weapon("Whipcrack wand", "wand", "common", { stats: [sp("cooldown", "medium"), st("attack", 1)] }),
  weapon("Birch wand", "wand", "common", { stats: [st("attack", 1), st("mp_regen", 1)] }),
  weapon("Jolt wand", "wand", "uncommon", { effect: "The wearer's basic attacks add one Shock.", stats: [st("attack", 1), sp("cooldown", "medium"), sp("cast_speed", "medium")], statuses: ["jolt_wand"] }),
  weapon("Glint wand", "wand", "uncommon", { effect: "When one of the wearer's hits crits, the wearer regains 6% of its max MP.", stats: [sp("cast_speed", "medium"), st("mp_regen", 1), sp("cooldown", "medium")], statuses: ["glint_wand"] }),
  weapon("Spark wand", "wand", "rare", { effect: "The wearer's basic attacks add a few Burn.", stats: [st("attack", 1), sp("attack_speed", "medium"), sp("cooldown", "medium"), sp("cast_speed", "medium")], statuses: ["spark_wand"] }),
  weapon("Chain wand", "wand", "rare", { effect: "The wearer's basic attacks also strike two other foes, each for half.", stats: [sp("cooldown", "medium"), st("attack", 1), st("mp_regen", 1), sp("cast_speed", "medium")], statuses: ["chain_wand"] }),
  weapon("Flicker wand", "wand", "legendary", { effect: "The wearer's extra strikes add a few Shock.", stats: [sp("double_strike", "high"), sp("cooldown", "high"), sp("cast_speed", "medium")], statuses: ["flicker_wand"] }),
  weapon("Wildmagic wand", "wand", "legendary", { effect: "Each of the wearer's basic attacks adds a few stacks of a random one of Burn, Chill, Shock, Bleed and Sunder.", stats: [sp("cooldown", "high"), sp("cast_speed", "medium"), st("mp_regen", 2)], statuses: ["wildmagic_wand"] }),

  // Rune sword (Frostweaver, Stormcaller): slow, one hand; full, base-heavy, standard. MP regen; Cooldown, MP, HP, Siphon.
  weapon("Runed saber", "rune_sword", "common", { stats: [st("mp_regen", 1)] }),
  weapon("Cairn blade", "rune_sword", "common", { stats: [st("max_mp", 1)] }),
  weapon("Sleet blade", "rune_sword", "uncommon", { effect: "The wearer's basic attacks add one Chill.", stats: [st("mp_regen", 1), sp("cooldown", "medium")], statuses: ["sleet_blade"] }),
  weapon("Sigil blade", "rune_sword", "uncommon", { effect: "At the start of each fight, the wearer gains a Shield of a fifth of its max MP.", stats: [st("max_hp", 1), st("mp_regen", 1)], statuses: ["sigil_blade"] }),
  weapon("Spellbinder", "rune_sword", "rare", { effect: "After each ability the wearer casts, its next basic attack deals double damage.", stats: [st("mp_regen", 1), sp("cooldown", "medium"), st("max_mp", 1)], statuses: ["spellbinder"] }),
  weapon("Conductor's blade", "rune_sword", "rare", { effect: "When one of the wearer's abilities hits several foes at once, each of those hits lands again on its foe for a quarter of the damage.", stats: [sp("cooldown", "medium"), st("mp_regen", 1), st("max_hp", 1)], statuses: ["conductors_blade"], note: "Echoes `area` hits (a damage effect aimed at two or more units): Chain lightning's bounces, not its first strike; Blizzard throughout." }),
  weapon("Winter's chain", "rune_sword", "legendary", { effect: "When a foe's Chill shatters, every other foe gains a few Chill.", stats: [st("mp_regen", 2), sp("cooldown", "medium"), st("max_mp", 1)], statuses: ["winters_chain"] }),
  weapon("Brimming blade", "rune_sword", "legendary",
    { effect: "Each ability the wearer casts gives the ally with the least MP a tenth of that ability's cost in MP. While the wearer has more than half its MP, its abilities cost a quarter less.", stats: [st("max_mp", 1), st("mp_regen", 2), st("max_hp", 1)], statuses: ["brimming_blade"], note: "The gift is a tenth of the MP the cast paid (action_resolve's amount), so 7.5% of the listed cost while the quarter off holds." }),

  // Hammer (Knight, Bramble knight, Geomancer): slow, one hand; heavy, base-heavy, lean. Defense; HP, Aggro, Crit damage, Thorns.
  // The wall's weapon: big slow blows that don't need the Attack the walls lack, and little carried.
  weapon("War hammer", "hammer", "common", { stats: [st("defense", 1)] }),
  weapon("Horseman's hammer", "hammer", "common", { trade: "light", stats: [st("max_hp", 1), st("aggro", 1)] }),
  weapon("Warden's hammer", "hammer", "uncommon", { effect: "The wearer's basic attacks deal extra damage from its Defense.",
    stats: [st("defense", 1)], weapon: { amount: { ...(weaponHit("hammer") as Exclude<NumT, number>), scale: [...(weaponHit("hammer") as Exclude<NumT, number>).scale, { ratio: WARDEN, stat: "defense", of: "self" }] } },
  }),
  weapon("Mason's hammer", "hammer", "uncommon", { effect: "Each hit the wearer lands gives it a Shield of a tenth of its Defense.", stats: [st("max_hp", 1)], statuses: ["masons_hammer"] }),
  weapon("Bellringer", "hammer", "rare", { effect: "The wearer's basic attacks on a foe in a wind-up Stun it.", stats: [st("defense", 1), st("max_hp", 1)], statuses: ["bellringer"] }),
  weapon("Rootstone hammer", "hammer", "rare", { effect: "The wearer's basic attacks add a few Sunder, from its Defense.", stats: [st("defense", 1), st("aggro", 1)], statuses: ["rootstone_hammer"] }),
  weapon("Mountainfall", "hammer", "legendary", { effect: "The wearer's basic attacks deal extra damage equal to a fifth of its max HP.", stats: [st("defense", 1), st("max_hp", 1), st("aggro", 1)],
    weapon: { amount: { ...(weaponHit("hammer") as Exclude<NumT, number>), scale: [...(weaponHit("hammer") as Exclude<NumT, number>).scale, { ratio: 0.2, stat: "max_hp", of: "self" }] } },
  }),
  weapon("Grudgebearer", "hammer", "legendary", { effect: "Each hit the wearer takes adds a Charge, up to 10. Its basic attacks deal a tenth more for each Charge, and spend them.", stats: [st("defense", 1), st("aggro", 1), sp("crit_damage", "medium")], statuses: ["grudgebearer"] }),

  // Mace (Cleric, Paladin, Bramble knight): slow, one hand; light, base-heavy, rich. HP; Defense, MP regen, Cooldown, Thorns.
  weapon("Morningstar", "mace", "common", { stats: [st("max_hp", 1), st("defense", 1)] }),
  weapon("Friar's mace", "mace", "common", { stats: [st("max_hp", 1), st("mp_regen", 1)] }),
  weapon("Mender's mace", "mace", "uncommon", { effect: "At the start of each fight, the ally with the lowest share of max HP gains Regen.", stats: [st("max_hp", 1), st("mp_regen", 1), st("defense", 1)], statuses: ["menders_mace"] }),
  weapon("Prior's mace", "mace", "uncommon", { effect: "Each ability the wearer casts heals it for 3% of its max HP.", stats: [st("max_hp", 1), sp("cooldown", "medium"), st("mp_regen", 1)], statuses: ["priors_mace"] }),
  weapon("Penitent's mace", "mace", "rare", { effect: "Each hit the wearer takes heals the ally with the lowest share of max HP for a tenth of the damage.", stats: [sp("thorns", "medium"), st("max_hp", 2), st("defense", 1)], statuses: ["penitents_mace"] }),
  weapon("Censer mace", "mace", "rare", { effect: "Each of the wearer's basic attacks that lands heals the ally with the lowest share of max HP for a third of the damage it dealt.", stats: [st("max_hp", 2), st("mp_regen", 1), sp("cooldown", "medium")], statuses: ["censer_mace"] }),
  weapon("Sunhammer", "mace", "legendary",
    { effect: "The wearer's basic attacks add several Burn. When a burning foe falls, the wearer's next basic attack also strikes every other foe, and those strikes add several Burn too.", stats: [st("max_hp", 2), st("mp_regen", 1), st("defense", 2)], statuses: ["sunhammer"] }),
  weapon("Martyr's mace", "mace", "legendary",
    { effect: "The wearer's basic attacks deal more the lower its HP: half again as much below 70%, double below 50%, two and a half times below 30%, and triple below 10%. Below 30% HP, each basic attack also heals the wearer for the damage it dealt.", stats: [st("max_hp", 2), st("defense", 1), st("mp_regen", 2)], statuses: ["martyrs_mace"] }),

  // Staff (Cleric, Pyromancer, Frostweaver): slow, two hands; light, base-heavy, rich. Cast speed; Cooldown, MP, MP regen, HP.
  weapon("Ashwood staff", "staff", "common", { stats: [sp("cast_speed", "medium"), st("max_hp", 1)] }),
  weapon("Moonwater staff", "staff", "common", { stats: [st("max_mp", 2)] }),
  weapon("Shepherd's staff", "staff", "uncommon", { effect: "At the start of each fight, the ally with the least MP gains Clarity.", stats: [sp("cast_speed", "medium"), st("max_hp", 1), sp("cooldown", "medium")], statuses: ["shepherds_staff"] }),
  weapon("Canopy staff", "staff", "uncommon", { effect: "At the start of each fight, the wearer and the other ally with the least max HP each gain a Shield from the wearer's Attack.", stats: [st("max_hp", 1), st("mp_regen", 1), sp("cast_speed", "medium")], statuses: ["canopy_staff"] }),
  weapon("Banked staff", "staff", "rare", { effect: "The wearer's abilities add half again as many Burn, Chill and Shock stacks.", stats: [sp("cast_speed", "medium"), sp("cooldown", "medium"), st("max_mp", 1), st("mp_regen", 1)], statuses: ["banked_staff"] }),
  weapon("Cistern staff", "staff", "rare", { effect: "Once a fight, when the wearer has less than a third of its MP (at the fight's start, or after it casts), it gains Clarity.", stats: [st("max_mp", 1), st("max_hp", 1), sp("cast_speed", "medium"), sp("cooldown", "medium")], statuses: ["cistern_staff"] }),
  weapon("Cataclysm staff", "staff", "legendary", { effect: "Every third ability the wearer casts is cast twice. The second cast is free.", stats: [sp("cast_speed", "high"), st("max_mp", 1), sp("cooldown", "high")], statuses: ["cataclysm_staff"] }),
  weapon("Cinderheart staff", "staff", "legendary", { effect: "The wearer's basic attacks consume their target's Burn and deal at once all the damage it would have dealt.", stats: [sp("cast_speed", "high"), st("mp_regen", 1), st("max_mp", 2)], statuses: ["cinderheart_staff"], note: `The flare is ${BURN_LIFE} a stack: Burn's damage a stack × the sum of its decay at 20 stacks, read from scale.ts.` }),
];

// ─── Designer data: the builds each piece serves ─────────────────────────────

const t = (build: Build, worth: BuildTag["worth"], rung?: BuildTag["rung"]): BuildTag => ({ build, worth, ...(rung ? { rung } : {}) });

export const builds: Builds = {
  whipcrack_wand: [t("cuts", 2, 1), t("harvest", 1, 1)],
  birch_wand: [t("overflow", 1, 1), t("bonfire", 1, 1)],
  jolt_wand: [t("toll", 1, 1), t("cuts", 1, 1), t("harvest", 1, 1)],
  glint_wand: [t("overflow", 2, 1), t("harvest", 1, 1), t("cuts", 1, 1)],
  spark_wand: [t("bonfire", 3, 2), t("cuts", 2)],
  chain_wand: [t("harvest", 3, 2), t("cuts", 2), t("toll", 1)],
  flicker_wand: [t("cuts", 3, 3), t("harvest", 1), t("toll", 1)],
  // An exotic: a little to every status build, a lot to none.
  wildmagic_wand: [],

  runed_saber: [t("overflow", 1, 1), t("snap", 1, 1)],
  cairn_blade: [t("overflow", 1, 1), t("harvest", 1, 1)],
  sleet_blade: [t("snap", 2, 1), t("lockdown", 1, 1)],
  sigil_blade: [t("toll", 1, 1), t("landslide", 1, 1), t("overflow", 1, 1)],
  spellbinder: [t("overflow", 2, 2), t("ambush", 1), t("lockdown", 1)],
  conductors_blade: [t("harvest", 3, 2), t("overflow", 1)],
  winters_chain: [t("snap", 3, 3), t("harvest", 2)],
  brimming_blade: [t("overflow", 3, 3), t("lockdown", 2)],

  war_hammer: [t("landslide", 1, 1), t("toll", 1, 1)],
  horsemans_hammer: [t("toll", 1, 1), t("landslide", 1, 1)],
  wardens_hammer: [t("landslide", 1, 1), t("toll", 1, 1)],
  masons_hammer: [t("landslide", 1, 1), t("toll", 1, 1)],
  bellringer: [t("lockdown", 3, 2), t("toll", 1)],
  rootstone_hammer: [t("landslide", 2, 2), t("toll", 2, 2)],
  mountainfall: [t("landslide", 3, 3), t("toll", 2)],
  grudgebearer: [t("toll", 3, 3), t("landslide", 2)],

  morningstar: [t("toll", 1, 1), t("pact", 1, 1)],
  friars_mace: [t("overflow", 1, 1), t("phoenix", 1, 1)],
  menders_mace: [t("pact", 1, 1), t("phoenix", 1, 1), t("toll", 1, 1)],
  priors_mace: [t("toll", 1, 1), t("pact", 1, 1), t("overflow", 1, 1)],
  penitents_mace: [t("toll", 3, 2), t("pact", 2, 2)],
  censer_mace: [t("pact", 2, 2), t("toll", 2), t("phoenix", 1)],
  sunhammer: [t("bonfire", 3, 3), t("harvest", 2)],
  martyrs_mace: [t("pact", 3, 3), t("phoenix", 2)],

  ashwood_staff: [t("bonfire", 1, 1), t("snap", 1, 1), t("harvest", 1, 1)],
  moonwater_staff: [t("overflow", 1, 1), t("bonfire", 1, 1), t("phoenix", 1, 1)],
  shepherds_staff: [t("overflow", 2, 1), t("bonfire", 1, 1), t("phoenix", 1, 1), t("lockdown", 1, 1)],
  canopy_staff: [t("phoenix", 1, 1), t("bonfire", 1, 1), t("harvest", 1, 1), t("ambush", 1, 1)],
  banked_staff: [t("bonfire", 3, 2), t("snap", 2, 2), t("harvest", 1)],
  cistern_staff: [t("overflow", 2, 2), t("bonfire", 1), t("lockdown", 1)],
  cataclysm_staff: [t("harvest", 3, 3), t("overflow", 2, 3), t("bonfire", 2)],
  // Exotic in feel: the flare against Bonfire's ramp, worth something to a fire for short fights.
  cinderheart_staff: [t("bonfire", 2), t("harvest", 1)],
};
