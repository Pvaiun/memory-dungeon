/**
 * Step 5i, step 5: the five magical weapon kinds' 40 pieces, from steps/05-core-set/5i-synergy/fill/weapons-magical.md with
 * fill-rulings.md (its third round wins) and build/engine-spec.md (its section 6 fixes Dawnblade and the Lightning rod).
 * `gear` joins the pack's gear and the rogue's stock; `statuses` the pack's statuses; `builds` is designer data, never in the pack.
 *
 * Every weapon here hits as its kind's plain weapon does (damage medium, ratio medium, from Magic: `piece()`'s default); no piece
 * changes its kind's speed, damage type or hands. Every status a card names is at its own length (statuses are universal).
 * Heat and Fervor are shared.ts's.
 */
import type { EffectT, GearT, NumT, StatusT, TargetRuleT, ToT } from "../../../src/schema.js";
import { FLAT_STACKS, STATUS } from "../scale.js";
import { critStep, own, piece, pieceStatus, sp, st, type Build, type BuildTag, type Builds, type Change, type Rarity } from "./kit.js";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Applies a status at its own length (statuses are universal: never a duration here), with stacks for an Intensity one. */
const apply = (status: string, to: ToT, stacks?: NumT): EffectT => ({ op: "apply", status, ...(stacks !== undefined ? { stacks } : {}), to });
/** A reaction to the holder's own basic attacks landing. */
const onBasic = (...effects: EffectT[]) => ({ on: { event: "hit_lands" as const, kind: "basic" as const }, do: effects });
/** A reaction at the fight's start. */
const atStart = (...effects: EffectT[]) => ({ on: { event: "fight_start" as const }, do: effects });

/**
 * One weapon of a kind, through `piece()`. A stand-in until kit.ts or the validator settles it: `piece()` gives a legendary tier
 * powerful and source drop, which the validator's pre-5i rule refuses (powerful comes only from unlock), so a powerful piece here
 * says unlock, as the repo's fixtures do. The rogue's ordinary pool skips powerful pieces either way, so nothing plays differently.
 */
function weapon(name: string, kind: string, rarity: Rarity, text: string, rest: { stats?: Change[]; statuses?: string[]; note?: string } = {}): GearT {
  const g = piece({ name, kind, rarity, text, slot: "weapon", ...(rest.stats ? { stats: rest.stats } : {}), ...(rest.statuses ? { statuses: rest.statuses } : {}), ...(rest.note ? { note: rest.note } : {}) });
  return g.tier === "powerful" ? { ...g, source: "unlock" } : g;
}

const lowestShareAlly: TargetRuleT = { side: "allies", pick: "lowest", by: "hp_share" };
const lowestMpAlly: TargetRuleT = { side: "allies", pick: "lowest", by: "mp_share" };
/** Of a hit's target: 1 if it holds the status, else 0 (Hexblade's "one more stack of each it already holds"). */
const ifHeld = (status: string) => ({ scale: [{ ratio: 1, when: { has: status }, of: "target" as const }] });

/**
 * Cinderheart staff: what one stack of Burn deals over its whole life, read from Burn's own numbers (its damage a stack × the sum of
 * its decay, a stack dropping by its share each pulse until under one), at the fill's 20 stacks: 55 × 6.36, about 350.
 */
const BURN_LIFE = (() => {
  const ref = 20;
  let sum = 0;
  for (let k = 0; ref * (1 - STATUS.burn.drop) ** k >= 1; k++) sum += (1 - STATUS.burn.drop) ** k;
  return Math.round(STATUS.burn.perStack * sum);
})();

/** Martyr's maul: +50% at each of 70, 50, 30 and 10% of max HP. */
const MARTYR_STEPS = [70, 50, 30, 10];

// ─── The pieces' statuses ───────────────────────────────────────────────────

export const statuses: StatusT[] = [
  // Rune sword
  pieceStatus("wayfinder", "Wayfinder", "Its basic attacks ignore Taunt.", { seek: "basic" }),
  pieceStatus("sigil_blade", "Sigil blade", "Gains Ward at the start of each fight.", { reactions: [atStart(apply("ward", "holder"))] }),
  pieceStatus("spellbinder", "Spellbinder", "After each ability it casts, its next basic attack deals double damage.", {
    reactions: [{ on: { event: "action_resolve", kind: "ability" }, do: [apply("spellbound", "holder")] }],
  }),
  {
    id: "spellbound", name: "SPELLBOUND", text: "Its next basic attack deals double damage.", label: "buff", show: "icon", stacking: "fizzle",
    boosts: [{ tag: "basic", pct: 100 }],
    reactions: [{ on: { event: "action_resolve", kind: "basic" }, do: [{ op: "remove", label: "buff", status: "spellbound", to: "holder" }] }],
  },
  pieceStatus("bane_of_the_bound", "Bane of the bound", "Its hits deal half again as much to a foe that is Weakened or Silenced.", {
    boosts: ["physical", "magical"].map((tag) => ({ tag, pct: { scale: [{ ratio: 50, when: { hasAny: ["weaken", "silence"] }, of: "target" as const }] } })),
  }),
  pieceStatus("hexblade", "Hexblade", "Its basic attacks add one more stack of each of Burn, Chill, Shock, Bleed and Sunder their target already holds.", {
    reactions: [onBasic(...["burn", "chill", "shock", "bleed", "sunder"].map((s) => apply(s, "other", ifHeld(s))))],
  }),
  // Engine spec section 6.1: a knocked-out unit can't gain a status, so its own fall is counted on its own return (8 at once).
  pieceStatus("dawnblade", "Dawnblade", "Gains 4 Fervor each time an ally falls or is revived, and 8 when it is revived itself.", {
    survivesKO: true,
    reactions: [
      { on: { event: "ko", whose: "ally" }, do: [apply("fervor", "holder", FLAT_STACKS.several)] },
      { on: { event: "revived", whose: "ally" }, do: [apply("fervor", "holder", FLAT_STACKS.several)] },
      { on: { event: "revived" }, do: [apply("fervor", "holder", 2 * FLAT_STACKS.several)] },
    ],
  }),

  // Mace
  pieceStatus("menders_mace", "Mender's mace", "At the start of each fight, the ally with the lowest share of max HP gains Regen.", { reactions: [atStart(apply("regen", lowestShareAlly))] }),
  pieceStatus("priors_mace", "Prior's mace", "At the start of each fight, the ally with the most Aggro gains Ward.", {
    reactions: [atStart(apply("ward", { side: "allies", pick: "highest", by: { stat: "aggro" } }))],
  }),
  pieceStatus("humbling_mace", "Humbling mace", "Its basic attacks Weaken their target.", { reactions: [onBasic(apply("weaken", "other"))] }),
  pieceStatus("censer_mace", "Censer mace", "Each of its basic attacks that lands heals the ally with the lowest share of max HP for a third of the damage dealt.", {
    reactions: [onBasic({ op: "heal", amount: { scale: [{ ratio: 0.33, amount: true }] }, to: lowestShareAlly })],
  }),
  pieceStatus("sunhammer", "Sunhammer", "Its basic attacks add several Burn. When a burning foe falls, its next basic attack also strikes every other foe.", {
    reactions: [
      onBasic(apply("burn", "other", own("several", "magic"))),
      // A foe's statuses end, cause ko, just before its ko event (engine spec section 5): a burning foe has fallen.
      { on: { event: "status_ended", status: "burn", cause: ["ko"], whose: "foe" }, do: [apply("sunburst", "holder")] },
    ],
  }),
  {
    id: "sunburst", name: "SUNBURST", text: "Its next basic attack also strikes every other foe, and those strikes add several Burn.", label: "buff", show: "icon", stacking: "fizzle",
    strike: { to: { side: "foes", pick: "all", exclude: "targets" } },
    reactions: [
      { on: { event: "hit_lands", kind: "extra" }, do: [apply("burn", "other", own("several", "magic"))] },
      { on: { event: "action_resolve", kind: "basic" }, do: [{ op: "remove", label: "buff", status: "sunburst", to: "holder" }] },
    ],
  },
  pieceStatus("martyrs_maul", "Martyr's maul", "Its basic attacks deal more the lower its HP; below 30% HP they also heal it for the damage dealt.", {
    boosts: [{ tag: "basic", pct: { scale: MARTYR_STEPS.map((hpBelow) => ({ ratio: 50, when: { hpBelow }, of: "holder" as const })) } }],
    reactions: [onBasic({ op: "heal", amount: { scale: [{ ratio: 1, amount: true }] }, to: { side: "self", where: { hpBelow: 30 } } })],
  }),

  // Wand
  pieceStatus("jolt_wand", "Jolt wand", "Its basic attacks add one Shock.", { reactions: [onBasic(apply("shock", "other", FLAT_STACKS.one))] }),
  pieceStatus("glint_wand", "Glint wand", "When one of its hits crits, it regains 6% of its max MP.", {
    reactions: [{ on: { event: "hit_lands", tags: ["crit"] }, do: [{ op: "mp", amount: { scale: [{ ratio: 0.06, stat: "max_mp", of: "holder" }] }, to: "holder" }] }],
  }),
  pieceStatus("spark_wand", "Spark wand", "Its basic attacks add a few Burn.", { reactions: [onBasic(apply("burn", "other", own("few", "magic")))] }),
  pieceStatus("chain_wand", "Chain wand", "Its basic attacks also strike two other foes, each for half.", {
    strike: { to: { side: "foes", pick: "random", count: 2, exclude: "targets" }, share: 50 },
  }),
  pieceStatus("flicker_wand", "Flicker wand", "Its extra strikes add a few Shock.", {
    reactions: [{ on: { event: "hit_lands", kind: "extra" }, do: [apply("shock", "other", own("few", "magic"))] }],
  }),
  pieceStatus("wildmagic_wand", "Wildmagic wand", "Each of its basic attacks adds a few stacks of a random one of Burn, Chill, Shock, Bleed and Sunder.", {
    reactions: [onBasic({ op: "one", of: ["burn", "chill", "shock", "bleed", "sunder"].map((status) => ({ status, stacks: FLAT_STACKS.few })), to: "other" })],
  }),

  // Rod
  pieceStatus("sleet_rod", "Sleet rod", "Its basic attacks add one Chill.", { reactions: [onBasic(apply("chill", "other", FLAT_STACKS.one))] }),
  // Once a fight: a marker that ends with the fight or a knockout, so a revived wearer can have it again.
  pieceStatus("cistern_rod", "Cistern rod", "Once a fight, when it has less than a third of its MP at the fight's start or after it casts, it gains Clarity.", {
    reactions: [atStart(...cistern()), { on: { event: "action_resolve", kind: "ability" }, do: cistern() }],
  }),
  { id: "cistern_spent", name: "CISTERN", text: "Its Cistern rod has given its Clarity this fight.", label: "marker", show: "sheet", stacking: "fizzle" },
  pieceStatus("glacial_rod", "Glacial rod", "Its basic attacks Slow their target.", { reactions: [onBasic(apply("slow", "other"))] }),
  // Engine spec section 6.4: the echo answers `area` hits (a damage effect aimed at two or more units): Chain lightning's bounces, not its first strike.
  pieceStatus("lightning_rod", "Lightning rod", "When one of its abilities hits several foes at once, each of those hits lands again for a quarter of its damage.", {
    reactions: [{ on: { event: "hit_lands", kind: "ability", tags: ["area"] }, do: [{ op: "strike", share: 25, of: "hit", to: "other" }] }],
  }),
  pieceStatus("winters_chain", "Winter's chain", "When a foe's Chill shatters, every other foe gains a few Chill.", {
    reactions: [{ on: { event: "status_capped", status: "chill", whose: "foe" }, do: [apply("chill", { side: "foes", pick: "all", exclude: "owner" }, own("few", "magic"))] }],
  }),
  pieceStatus("brimming_rod", "Brimming rod", "Each ability it casts gives the ally with the least MP a tenth of its cost in MP. While it has more than half its MP, its abilities cost a quarter less.", {
    mods: [{ mp: -25, if: { mpAtLeast: 50 } }],
    reactions: [{ on: { event: "action_resolve", kind: "ability" }, do: [{ op: "mp", amount: { scale: [{ ratio: 0.1, amount: true }] }, to: lowestMpAlly }] }],
  }),

  // Staff
  pieceStatus("shepherds_staff", "Shepherd's staff", "At the start of each fight, the ally with the least MP gains Clarity.", { reactions: [atStart(apply("clarity", lowestMpAlly))] }),
  pieceStatus("canopy_staff", "Canopy staff", "At the start of each fight, it and the other ally with the least max HP each gain a Shield from its Magic.", {
    reactions: [atStart(...(["holder", { side: "others", pick: "lowest", by: { stat: "max_hp" } }] as const).map((to) => apply("shield", to, { scale: [{ ratio: 0.12, stat: "magic", of: "holder" }] })))],
  }),
  pieceStatus("banked_staff", "Banked staff", "Its abilities add half again as many Burn, Chill and Shock stacks.", { mods: [{ stacks: { pct: 50, statuses: ["burn", "chill", "shock"] } }] }),
  pieceStatus("rootstaff", "Rootstaff", "Its Thorns heal it for the damage they deal.", {
    reactions: [{ on: { event: "damage_dealt", status: "thorns" }, do: [{ op: "heal", amount: { scale: [{ ratio: 1, amount: true }] }, to: "holder" }] }],
  }),
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

/** Cistern rod's tap: Clarity, then the once-a-fight marker, each on the wearer only while it's under a third of its MP and hasn't had it. */
function cistern(): EffectT[] {
  const self: TargetRuleT = { side: "self", where: { mpBelow: 33, lacks: "cistern_spent" } };
  return [apply("clarity", self), apply("cistern_spent", self)];
}

// ─── The pieces ─────────────────────────────────────────────────────────────

export const gear: GearT[] = [
  // Rune sword: Paladin, Valkyrie, Hexer, Geomancer. Medium (8.5 ticks), magical, one hand.
  weapon("Runed saber", "rune_sword", "common", "+1 Magic, +1 Attack.", { stats: [st("magic", 1), st("attack", 1)] }),
  weapon("Cairn blade", "rune_sword", "common", "+1 Magic, +1 Armor.", { stats: [st("magic", 1), st("armor", 1)] }),
  weapon("Wayfinder", "rune_sword", "uncommon", "+1 Magic. The wearer's basic attacks ignore Taunt.", { stats: [st("magic", 1)], statuses: ["wayfinder"] }),
  weapon("Sigil blade", "rune_sword", "uncommon", "+1 Armor. At the start of each fight, the wearer gains Ward.", { stats: [st("armor", 1)], statuses: ["sigil_blade"] }),
  weapon("Spellbinder", "rune_sword", "rare", "After each ability the wearer casts, its next basic attack deals double damage.", { statuses: ["spellbinder"] }),
  weapon("Bane of the bound", "rune_sword", "rare", "The wearer's hits deal half again as much to a foe that is Weakened or Silenced.", { statuses: ["bane_of_the_bound"] }),
  weapon("Hexblade", "rune_sword", "legendary", "The wearer's basic attacks add one more stack of each of Burn, Chill, Shock, Bleed and Sunder that their target already holds.", { statuses: ["hexblade"] }),
  weapon("Dawnblade", "rune_sword", "legendary",
    "Each time an ally falls or is revived, the wearer gains 4 Fervor. When the wearer itself is revived, it gains 8. Fervor: the holder deals 5% more damage a stack, up to 20, for the rest of the fight.",
    { statuses: ["dawnblade"], note: "Its own fall counts on its own return (engine spec section 6.1: a knocked-out unit can't gain a status)." }),

  // Mace: Cleric, Paladin. Slow (11 ticks), magical, one hand.
  weapon("Morningstar", "mace", "common", "+2 Magic.", { stats: [st("magic", 2)] }),
  weapon("Friar's mace", "mace", "common", "+1 HP, +1 MP regen.", { stats: [st("max_hp", 1), st("mp_regen", 1)] }),
  weapon("Mender's mace", "mace", "uncommon", "+1 HP. At the start of each fight, the ally with the lowest share of max HP gains Regen.", { stats: [st("max_hp", 1)], statuses: ["menders_mace"] }),
  weapon("Prior's mace", "mace", "uncommon", "+1 Magic. At the start of each fight, the ally with the most Aggro gains Ward.", { stats: [st("magic", 1)], statuses: ["priors_mace"] }),
  weapon("Humbling mace", "mace", "rare", "The wearer's basic attacks Weaken their target.", { statuses: ["humbling_mace"] }),
  weapon("Censer mace", "mace", "rare", "Each of the wearer's basic attacks that lands heals the ally with the lowest share of max HP for a third of the damage it dealt.", { statuses: ["censer_mace"] }),
  weapon("Sunhammer", "mace", "legendary",
    "The wearer's basic attacks add several Burn. When a burning foe falls, the wearer's next basic attack also strikes every other foe, and those strikes add several Burn too.",
    { statuses: ["sunhammer"] }),
  weapon("Martyr's maul", "mace", "legendary",
    "The wearer's basic attacks deal more the lower its HP: half again as much below 70%, double below 50%, two and a half times below 30%, and triple below 10%. Below 30% HP, each basic attack also heals the wearer for the damage it dealt.",
    { statuses: ["martyrs_maul"] }),

  // Wand: Pyromancer, Stormcaller, Bard. Fast (6.6 ticks), magical, one hand.
  weapon("Whipcrack wand", "wand", "common", "Double strike medium, +1 Magic.", { stats: [sp("double_strike", "medium"), st("magic", 1)] }),
  weapon("Birch wand", "wand", "common", "+1 Magic, +1 MP.", { stats: [st("magic", 1), st("max_mp", 1)] }),
  weapon("Jolt wand", "wand", "uncommon", "+1 Magic. The wearer's basic attacks add one Shock.", { stats: [st("magic", 1)], statuses: ["jolt_wand"] }),
  weapon("Glint wand", "wand", "uncommon", "+1 Crit chance. When one of the wearer's hits crits, the wearer regains 6% of its max MP.", { stats: [critStep(1)], statuses: ["glint_wand"] }),
  weapon("Spark wand", "wand", "rare", "The wearer's basic attacks add a few Burn.", { statuses: ["spark_wand"] }),
  weapon("Chain wand", "wand", "rare", "The wearer's basic attacks also strike two other foes, each for half.", { statuses: ["chain_wand"] }),
  weapon("Flicker wand", "wand", "legendary", "Double strike high. The wearer's extra strikes add a few Shock.", { stats: [sp("double_strike", "high")], statuses: ["flicker_wand"] }),
  weapon("Wildmagic wand", "wand", "legendary", "Each of the wearer's basic attacks adds a few stacks of a random one of Burn, Chill, Shock, Bleed and Sunder.", { statuses: ["wildmagic_wand"] }),

  // Rod: Frostweaver, Stormcaller. Medium (9.1 ticks), magical, one hand.
  weapon("Dowsing rod", "rod", "common", "+2 MP regen.", { stats: [st("mp_regen", 2)] }),
  weapon("Ironbark rod", "rod", "common", "+1 Magic, +1 HP.", { stats: [st("magic", 1), st("max_hp", 1)] }),
  weapon("Sleet rod", "rod", "uncommon", "+1 Magic. The wearer's basic attacks add one Chill.", { stats: [st("magic", 1)], statuses: ["sleet_rod"] }),
  weapon("Cistern rod", "rod", "uncommon", "+1 HP. Once a fight, when the wearer has less than a third of its MP (at the fight's start, or after it casts), it gains Clarity.", { stats: [st("max_hp", 1)], statuses: ["cistern_rod"] }),
  weapon("Glacial rod", "rod", "rare", "The wearer's basic attacks Slow their target.", { statuses: ["glacial_rod"] }),
  weapon("Lightning rod", "rod", "rare", "When one of the wearer's abilities hits several foes at once, each of those hits lands again on its foe for a quarter of the damage.",
    { statuses: ["lightning_rod"], note: "Echoes `area` hits (engine spec section 6.4): Chain lightning's bounces, not its first strike; Thunderstorm and Blizzard throughout." }),
  weapon("Winter's chain", "rod", "legendary", "When a foe's Chill shatters, every other foe gains a few Chill.", { statuses: ["winters_chain"] }),
  weapon("Brimming rod", "rod", "legendary",
    "Each ability the wearer casts gives the ally with the least MP a tenth of that ability's cost in MP. While the wearer has more than half its MP, its abilities cost a quarter less.",
    { statuses: ["brimming_rod"], note: "The gift is a tenth of the MP the cast paid (action_resolve's amount, engine spec X29), so 7.5% of the listed cost while the quarter off holds." }),

  // Staff: Cleric, Frostweaver, Pyromancer, Bramble knight. Slow (11.6 ticks), magical, two hands.
  weapon("Ashwood staff", "staff", "common", "+2 Magic, +1 HP.", { stats: [st("magic", 2), st("max_hp", 1)] }),
  weapon("Moonwater staff", "staff", "common", "+2 MP, +1 Magic.", { stats: [st("max_mp", 2), st("magic", 1)] }),
  weapon("Shepherd's staff", "staff", "uncommon", "+1 Magic, +1 HP. At the start of each fight, the ally with the least MP gains Clarity.", { stats: [st("magic", 1), st("max_hp", 1)], statuses: ["shepherds_staff"] }),
  weapon("Canopy staff", "staff", "uncommon", "+1 Magic, +1 HP. At the start of each fight, the wearer and the other ally with the least max HP each gain a Shield from the wearer's Magic.",
    { stats: [st("magic", 1), st("max_hp", 1)], statuses: ["canopy_staff"] }),
  weapon("Banked staff", "staff", "rare", "+1 Magic. The wearer's abilities add half again as many Burn, Chill and Shock stacks.", { stats: [st("magic", 1)], statuses: ["banked_staff"] }),
  weapon("Rootstaff", "staff", "rare", "Thorns medium. The wearer's Thorns heal it for the damage they deal.", { stats: [sp("thorns", "medium")], statuses: ["rootstaff"] }),
  weapon("Cataclysm staff", "staff", "legendary", "Every third ability the wearer casts is cast twice. The second cast is free.", { statuses: ["cataclysm_staff"] }),
  weapon("Cinderheart staff", "staff", "legendary", "The wearer's basic attacks consume their target's Burn and deal at once all the damage it would have dealt.",
    { statuses: ["cinderheart_staff"], note: `The flare is ${BURN_LIFE} a stack: Burn's damage a stack × the sum of its decay at 20 stacks, read from scale.ts.` }),
];

// ─── Designer data: the builds each piece serves (the fill's Builds lines) ──

const t = (build: Build, worth: BuildTag["worth"], rung?: BuildTag["rung"]): BuildTag => ({ build, worth, ...(rung ? { rung } : {}) });

export const builds: Builds = {
  runed_saber: [t("hunt", 1, 1), t("cuts", 1, 1)],
  cairn_blade: [t("landslide", 2, 1), t("toll", 1, 1)],
  wayfinder: [t("hunt", 2, 1), t("ambush", 1, 1), t("lockdown", 1)],
  sigil_blade: [t("toll", 1, 1), t("bonfire", 1, 1), t("landslide", 1, 1)],
  spellbinder: [t("overflow", 2, 2), t("ambush", 1), t("lockdown", 1)],
  bane_of_the_bound: [t("lockdown", 3, 2), t("toll", 2), t("pact", 1)],
  hexblade: [t("snap", 2, 2), t("bonfire", 2, 2), t("toll", 2), t("lockdown", 1)],
  dawnblade: [t("phoenix", 3, 3), t("pact", 1)],

  morningstar: [t("bonfire", 1, 1), t("pact", 1, 1)],
  friars_mace: [t("overflow", 1, 1), t("phoenix", 1, 1)],
  menders_mace: [t("pact", 1, 1), t("phoenix", 1, 1), t("toll", 1, 1)],
  priors_mace: [t("toll", 1, 1), t("bonfire", 1, 1), t("harvest", 1, 1)],
  humbling_mace: [t("lockdown", 3, 2), t("toll", 2, 2), t("pact", 1)],
  censer_mace: [t("pact", 2, 2), t("toll", 2), t("phoenix", 1)],
  sunhammer: [t("bonfire", 3, 3), t("harvest", 2)],
  martyrs_maul: [t("pact", 3, 3), t("phoenix", 2)],

  whipcrack_wand: [t("cuts", 2, 1), t("harvest", 1, 1)],
  birch_wand: [t("overflow", 1, 1), t("harvest", 1, 1)],
  jolt_wand: [t("toll", 1, 1), t("cuts", 1, 1), t("harvest", 1, 1)],
  glint_wand: [t("overflow", 2, 1), t("harvest", 1, 1), t("cuts", 1, 1)],
  spark_wand: [t("bonfire", 3, 2), t("cuts", 2)],
  chain_wand: [t("harvest", 3, 2), t("cuts", 2), t("toll", 1)],
  flicker_wand: [t("cuts", 3, 3), t("harvest", 1), t("toll", 1)],
  // An exotic: a little to every status build, a lot to none (spine section 9).
  wildmagic_wand: [],

  dowsing_rod: [t("overflow", 2, 1), t("lockdown", 1, 1)],
  ironbark_rod: [t("snap", 1, 1), t("harvest", 1, 1)],
  sleet_rod: [t("snap", 2, 1), t("lockdown", 1, 1)],
  cistern_rod: [t("overflow", 2, 1), t("bonfire", 1, 1), t("lockdown", 1, 1), t("harvest", 1, 1)],
  glacial_rod: [t("lockdown", 3, 2), t("snap", 1)],
  lightning_rod: [t("harvest", 3, 2), t("overflow", 1)],
  winters_chain: [t("snap", 3, 3), t("harvest", 2)],
  brimming_rod: [t("overflow", 3, 3), t("lockdown", 2)],

  ashwood_staff: [t("bonfire", 1, 1), t("snap", 1, 1), t("harvest", 1, 1)],
  moonwater_staff: [t("overflow", 1, 1), t("bonfire", 1, 1), t("phoenix", 1, 1)],
  shepherds_staff: [t("overflow", 2, 1), t("bonfire", 1, 1), t("phoenix", 1, 1), t("lockdown", 1, 1)],
  canopy_staff: [t("phoenix", 1, 1), t("bonfire", 1, 1), t("harvest", 1, 1), t("ambush", 1, 1)],
  banked_staff: [t("bonfire", 3, 2), t("snap", 2, 2), t("harvest", 1)],
  rootstaff: [t("toll", 3, 2), t("pact", 2)],
  cataclysm_staff: [t("harvest", 3, 3), t("overflow", 2, 3), t("bonfire", 2)],
  // Exotic in feel: the flare against Bonfire's ramp, worth something to a fire for short fights.
  cinderheart_staff: [t("bonfire", 2), t("harvest", 1)],
};
