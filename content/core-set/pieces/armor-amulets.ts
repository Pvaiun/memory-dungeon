/**
 * Step 5i, step 5: the four armor types' 48 pieces and the 24 amulets, from steps/05-core-set/5i-synergy/fill/armor-amulets.md with
 * fill-rulings.md (its third round wins) and build/engine-spec.md (the shapes, numbered X1 onward, and its section 6's fixes).
 * `gear` joins the pack's gear and the rogue's stock; `statuses` the pack's statuses; `builds` is designer data, never in the pack.
 *
 * Every number is the fill's. Statuses are applied at their own length (universal), and nothing here is balanced. A piece's own
 * statuses take its id, or its id with a suffix: `_on` for a state it switches on and off, `_used` for a once-a-fight marker,
 * `_mark` for the marker it leaves on a foe. Heat, Spite, Tempo and Surge are shared.ts's.
 */
import type { EffectT, EventSpecT, GearT, NumT, ReactionT, StatusT, TargetRuleT, UnitCondT } from "../../../src/schema.js";
import { FLAT_STACKS, HIT, SPECIAL, STATUS } from "../scale.js";
import { critStep, own, piece, pieceStatus, sp, st, type Build, type BuildTag, type Builds, type Rarity } from "./kit.js";

// ─── Words ───────────────────────────────────────────────────────────────────

/** "Half its HP", the line every below-half and above-half piece reads. */
const HALF = 50;
/** Boosts on both kinds of hit. */
const both = (pct: NumT) => [{ tag: "physical", pct }, { tag: "magical", pct }];

type To = Extract<EffectT, { op: "apply" }>["to"];
const give = (status: string, to: To, stacks?: NumT): EffectT => ({ op: "apply", status, to, ...(stacks !== undefined ? { stacks } : {}) });
const lift = (status: string, to: To): EffectT => ({ op: "remove", label: "buff", status, to });
const self = (where?: UnitCondT): TargetRuleT => ({ side: "self", ...(where ? { where } : {}) });
const everyFoe: TargetRuleT = { side: "foes", pick: "all" };
const everyAlly: TargetRuleT = { side: "allies", pick: "all" };
const when = (on: EventSpecT, ...effects: EffectT[]): ReactionT => ({ on, do: effects });
/** A share of a stat, read off the holder (or the effect's target, the revived ally), when the effect lands. */
const share = (ratio: number, stat: string, of: "holder" | "target" | "source" = "holder"): NumT => ({ scale: [{ ratio, stat, of }] });
/** A share of the event's amount. */
const ofAmount = (ratio: number): NumT => ({ scale: [{ ratio, amount: true }] });

/** A state a piece switches on and off: a buff with an icon (Bloodlust's pattern), Fizzle unless it says otherwise. */
const state = (id: string, name: string, text: string, body: Partial<StatusT>): StatusT =>
  ({ id, name, text, label: "buff", show: "icon", stacking: "fizzle", ...body }) as StatusT;
/** A once-a-fight marker (X14): neither buff nor debuff, kept through a knockout so a revive doesn't give the piece back. */
const used = (id: string, name: string): StatusT =>
  ({ id, name, text: "Spent for this fight.", label: "marker", show: "sheet", stacking: "fizzle", survivesKO: true }) as StatusT;

/**
 * Bloodlust's pattern, either way round: a state held while the wearer is below half its HP (or at half or more). Set at the
 * fight's start and on a revive too, since HP carries from fight to fight: the fill's hooks set it only on a heal or a lost
 * HP, so a wearer who started a fight below half had the card turned over until its first hit.
 */
function whileHp(stateId: string, below: boolean): ReactionT[] {
  const inside: UnitCondT = below ? { hpBelow: HALF } : { hpAtLeast: HALF };
  const outside: UnitCondT = below ? { hpAtLeast: HALF } : { hpBelow: HALF };
  return [
    when({ event: "fight_start" }, give(stateId, self(inside))),
    when({ event: "revived" }, give(stateId, self(inside))),
    when({ event: below ? "hp_lost" : "healed" }, give(stateId, self(inside))),
    when({ event: below ? "healed" : "hp_lost" }, lift(stateId, self(outside))),
  ];
}
/** Holdfast's shape: the first time each fight the wearer drops below half, it gains a status; a marker keeps it to once. */
const onceBelowHalf = (status: string, mark: string): ReactionT =>
  when({ event: "hp_lost" }, give(status, self({ hpBelow: HALF, lacks: mark })), give(mark, self({ hpBelow: HALF })));

// ─── Builds (designer data) ──────────────────────────────────────────────────

/** A rare's or legendary's tag: its rung (absent: any) and its worth (●, ●● or ●●●). */
const at = (build: Build, rung: 1 | 2 | 3 | null, worth: 1 | 2 | 3): BuildTag => (rung ? { build, rung, worth } : { build, worth });
/** Commons and uncommons name the builds whose first rung they serve; they help each "a little" (the spine's uncommon). */
const first = (...bs: Build[]): BuildTag[] => bs.map((build) => ({ build, rung: 1, worth: 1 }));

// ─── The collection ──────────────────────────────────────────────────────────

export const gear: GearT[] = [];
export const statuses: StatusT[] = [];
export const builds: Builds = {};

type Item = {
  name: string;
  text: string;
  rarity: Rarity;
  stats?: ReturnType<typeof st>[];
  /** The piece's own status, given at every fight's start: its effect's sentence and what it does. */
  rule?: { text: string; body: Partial<StatusT> };
  /** Further statuses: states it switches on, markers. */
  more?: StatusT[];
  tags: BuildTag[];
  note?: string;
};
function add(slot: "armor" | "amulet", kind: string | undefined, it: Item) {
  const g = piece({ name: it.name, text: it.text, slot, rarity: it.rarity, kind, stats: it.stats, note: it.note });
  if (it.rule) {
    statuses.push(pieceStatus(g.id, it.name.toUpperCase(), it.rule.text, it.rule.body));
    g.statuses = [g.id];
  }
  statuses.push(...(it.more ?? []));
  gear.push(g);
  builds[g.id] = it.tags;
}
const plate = (it: Item) => add("armor", "plate", it);
const mail = (it: Item) => add("armor", "mail", it);
const leather = (it: Item) => add("armor", "leather", it);
const robes = (it: Item) => add("armor", "robes", it);
const amulet = (it: Item) => add("amulet", undefined, it);

// ─── Plate (Knight, Hoplite, Geomancer, Bramble knight, Paladin) ─────────────

plate({ name: "Ironclad", rarity: "common", text: "Armor +2.", stats: [st("armor", 2)], tags: first("landslide", "toll") });
plate({ name: "Crested plate", rarity: "common", text: "HP +1, Aggro +1.", stats: [st("max_hp", 1), st("aggro", 1)], tags: first("toll", "bonfire", "phoenix") });
plate({ name: "Bristled plate", rarity: "common", text: "Thorns 150, Armor +1.", stats: [sp("thorns", "medium"), st("armor", 1)], tags: first("toll", "landslide") });

plate({
  name: "Portcullis", rarity: "uncommon", text: "Thorns 150. While the wearer is above half its HP, it draws far more (Aggro +20).",
  stats: [sp("thorns", "medium")],
  rule: { text: "While the wearer is above half its HP, it draws far more (Aggro +20).", body: { reactions: whileHp("portcullis_on", false) } },
  more: [state("portcullis_on", "PORTCULLIS", "Draws far more.", { stats: [st("aggro", 2)] })],
  tags: first("toll", "landslide", "bonfire"),
});
plate({
  name: "Keystone cuirass", rarity: "uncommon", text: "Armor +1. Its basic attacks deal 2% more for every 1,000 Armor it has.",
  stats: [st("armor", 1)],
  rule: { text: "Its basic attacks deal 2% more for every 1,000 Armor it has.", body: { boosts: [{ tag: "basic", pct: share(0.002, "armor") }] } },
  tags: first("landslide", "toll"),
});
plate({
  name: "Holdfast", rarity: "uncommon", text: "HP +1. The first time each fight the wearer drops below half its HP, it's Guarded.",
  stats: [st("max_hp", 1)],
  rule: { text: "The first time each fight the wearer drops below half its HP, it's Guarded.", body: { reactions: [onceBelowHalf("guard", "holdfast_used")] } },
  more: [used("holdfast_used", "HOLDFAST")],
  tags: first("toll", "pact", "bonfire"),
});

plate({
  name: "Bastion plate", rarity: "rare", text: "Starts every fight Guarded.",
  rule: { text: "Starts every fight Guarded.", body: { reactions: [when({ event: "fight_start" }, give("guard", "holder"))] } },
  tags: [at("landslide", 2, 3), at("toll", 2, 2), at("bonfire", null, 2)],
});
plate({
  name: "Hoarfrost plate", rarity: "rare", text: "Foes that hit the wearer gain 2 Chill.",
  rule: { text: "Foes that hit the wearer gain 2 Chill.", body: { reactions: [when({ event: "hit_taken" }, give("chill", "other", FLAT_STACKS.few))] } },
  tags: [at("toll", 2, 3), at("snap", null, 2), at("lockdown", null, 1)],
});
plate({
  name: "Challenger's plate", rarity: "rare", text: "Taunts when the fight starts, and again whenever an ally falls.",
  rule: {
    text: "Taunts when the fight starts, and again whenever an ally falls.",
    body: { reactions: [when({ event: "fight_start" }, give("taunt", "holder")), when({ event: "ko", whose: "ally" }, give("taunt", "holder"))] },
  },
  tags: [at("toll", 2, 2), at("phoenix", 2, 2), at("bonfire", null, 2), at("harvest", null, 1)],
});

plate({
  name: "Rubble plate", rarity: "legendary",
  text: "When the wearer's Shield breaks, every foe takes damage equal to the most that Shield held since it last broke, and a Shield of a quarter of that is rebuilt.",
  rule: {
    text: "When the wearer's Shield breaks, every foe takes damage equal to the most that Shield held since it last broke, and a Shield of a quarter of that is rebuilt.",
    body: {
      // X1: a Shield emptied by damage ends (cause stacks) with its peak as the amount. A Dispel (cause removed) doesn't set it off.
      reactions: [when({ event: "status_ended", status: "shield", cause: ["stacks"] }, { op: "damage", type: "none", amount: ofAmount(1), to: everyFoe }, give("shield", "holder", ofAmount(0.25)))],
    },
  },
  tags: [at("landslide", 3, 3), at("toll", null, 2)],
});
plate({
  name: "Thornheart plate", rarity: "legendary", text: "Each hit the wearer takes adds 1 Spite (+15 Thorns a stack, up to 20) for the rest of the fight.",
  rule: { text: "Each hit the wearer takes adds 1 Spite (+15 Thorns a stack, up to 20) for the rest of the fight.", body: { reactions: [when({ event: "hit_taken" }, give("spite", "holder", FLAT_STACKS.one))] } },
  tags: [at("toll", 3, 3), at("landslide", null, 1)],
});
plate({
  name: "Last bastion", rarity: "legendary",
  text: "Once a fight, a blow that would knock the wearer out leaves it at 1 HP and Guarded instead. Until it's healed back above half its HP, its hits deal double. After a won fight, it's at no less than a fifth of its HP.",
  rule: {
    text: "Once a fight, a blow that would knock the wearer out leaves it at 1 HP and Guarded instead. Until it's healed back above half its HP, its hits deal double. After a won fight, it's at no less than a fifth of its HP.",
    body: {
      reactions: [
        // The floor comes with the fight's start, not with the piece, so a revive later in the fight doesn't bring a second one.
        when({ event: "fight_start" }, give("last_bastion_floor", "holder")),
        when({ event: "status_ended", status: "last_bastion_floor", cause: ["spent"] }, give("guard", "holder"), give("last_bastion_on", "holder")),
        when({ event: "healed" }, lift("last_bastion_on", self({ hpAtLeast: HALF }))),
        // X36: up to a fifth of its max HP, if it's below that.
        when({ event: "fight_won" }, { op: "heal", amount: { scale: [{ ratio: 0.2, stat: "max_hp", of: "holder" }, { ratio: -1, hp: "current", of: "holder" }] }, to: self({ hpBelow: 20 }) }),
      ],
    },
  },
  more: [
    // X31: a floor that's spent on the first blow it holds.
    state("last_bastion_floor", "LAST BASTION", "The next blow that would knock it out leaves it at 1 HP.", { show: "sheet", unremovable: true, floor: { spend: true } }),
    state("last_bastion_on", "BASTION", "Its hits deal double.", { boosts: both(100) }),
  ],
  tags: [at("phoenix", 3, 2), at("pact", 3, 2), at("toll", null, 2)],
});

// ─── Mail (Paladin, Valkyrie, Vampire, Hexer, Bramble knight) ─────────────────

mail({ name: "Inscribed hauberk", rarity: "common", text: "Attack +1, Magic +1.", stats: [st("attack", 1), st("magic", 1)], tags: first("lockdown", "bonfire", "cuts") });
mail({ name: "Lamprey mail", rarity: "common", text: "HP +1, Lifesteal 10%.", stats: [st("max_hp", 1), sp("lifesteal", "medium")], tags: first("pact", "cuts") });
mail({ name: "Thick byrnie", rarity: "common", text: "HP +2.", stats: [st("max_hp", 2)], tags: first("pact", "toll", "phoenix") });

mail({
  name: "Tithing hauberk", rarity: "uncommon", text: "Attack +1. Each hit the wearer lands heals it for 1.5% of its max HP.",
  stats: [st("attack", 1)],
  rule: { text: "Each hit the wearer lands heals it for 1.5% of its max HP.", body: { reactions: [when({ event: "hit_lands" }, { op: "heal", amount: share(0.015, "max_hp"), to: "self" })] } },
  tags: first("pact", "cuts"),
});
mail({
  name: "Reprisal hauberk", rarity: "uncommon", text: "HP +1. The first time each foe hits the wearer in a fight, that foe takes damage equal to 17% of the wearer's max HP.",
  stats: [st("max_hp", 1)],
  rule: { text: "The first time each foe hits the wearer in a fight, that foe takes damage equal to 17% of the wearer's max HP.", body: { reactions: [when({ event: "hit_taken" }, give("reprisal_hauberk_mark", "other"))] } },
  more: [
    // Blood price's pattern on the foe: the marker deals the damage as it lands, and Fizzle keeps it to once a foe. The wearer (its
    // source) acts, as Thorns' holder does, so a foe it kills is its kill.
    {
      id: "reprisal_hauberk_mark", name: "REPRISAL", text: "Has paid for hitting the wearer.", label: "marker", show: "sheet", stacking: "fizzle", unremovable: true,
      reactions: [{ on: { event: "status_gained", status: "reprisal_hauberk_mark" }, actor: "source", do: [{ op: "damage", type: "none", amount: share(HIT.touch, "max_hp", "source"), to: "holder" }] }],
    },
  ],
  tags: first("toll", "harvest"),
});
mail({
  name: "Silvered hauberk", rarity: "uncommon", text: "Magic +1. The first magical hit the wearer takes each fight deals half.",
  stats: [st("magic", 1)],
  rule: { text: "The first magical hit the wearer takes each fight deals half.", body: { reactions: [when({ event: "fight_start" }, give("silvered_hauberk_on", "holder"))] } },
  more: [
    state("silvered_hauberk_on", "SILVERED", "The next magical hit it takes deals half.", {
      taken: [{ tag: "magical", pct: -50 }],
      reactions: [when({ event: "hit_taken", tags: ["magical"] }, lift("silvered_hauberk_on", "holder"))],
    }),
  ],
  tags: first("lockdown", "bonfire", "toll"),
});

mail({
  name: "Static mail", rarity: "rare", text: "Foes that hit the wearer gain 2 Shock.",
  rule: { text: "Foes that hit the wearer gain 2 Shock.", body: { reactions: [when({ event: "hit_taken" }, give("shock", "other", FLAT_STACKS.few))] } },
  tags: [at("toll", 2, 3), at("harvest", null, 1)],
});
mail({
  name: "Mocking mail", rarity: "rare", text: "Aggro +20. Taunts when the fight starts.",
  stats: [st("aggro", 2)],
  rule: { text: "Taunts when the fight starts.", body: { reactions: [when({ event: "fight_start" }, give("taunt", "holder"))] } },
  // "Toll 1 to 2 ●●●": the anchor at both rungs.
  tags: [at("toll", 1, 3), at("toll", 2, 3), at("phoenix", null, 2), at("bonfire", null, 1)],
});
mail({
  name: "Bloodsworn mail", rarity: "rare", text: "Below half its HP, the wearer has Lifesteal 10% and its hits deal a quarter more.",
  rule: { text: "Below half its HP, the wearer has Lifesteal 10% and its hits deal a quarter more.", body: { reactions: whileHp("bloodsworn_mail_on", true) } },
  more: [state("bloodsworn_mail_on", "BLOODSWORN", "Lifesteal 10%, and its hits deal a quarter more.", { stats: [sp("lifesteal", "medium")], boosts: both(25) })],
  tags: [at("pact", 2, 3), at("phoenix", 2, 2)],
});

mail({
  name: "Sanguine mail", rarity: "legendary", text: "Below half its HP, healing the wearer receives is doubled. Above half, it's halved.",
  stats: [{ stat: "healing_received", flat: -50 }],
  rule: { text: "Below half its HP, healing the wearer receives is doubled. Above half, it's halved.", body: { reactions: whileHp("sanguine_mail_on", true) } },
  // On top of the piece's −50: +100 in all, double.
  more: [state("sanguine_mail_on", "SANGUINE", "Healing it receives is doubled.", { stats: [{ stat: "healing_received", flat: 150 }] })],
  tags: [at("pact", 3, 3), at("phoenix", null, 1)],
});
mail({
  name: "Mantle of the fallen", rarity: "legendary",
  text: "When an ally falls, the wearer is Hasted and Guarded and gains 4 Might. When an ally is revived, the wearer heals it for a third of its max HP.",
  rule: {
    text: "When an ally falls, the wearer is Hasted and Guarded and gains 4 Might. When an ally is revived, the wearer heals it for a third of its max HP.",
    body: {
      reactions: [
        when({ event: "ko", whose: "ally" }, give("haste", "holder"), give("guard", "holder"), give("might", "holder", FLAT_STACKS.several)),
        when({ event: "revived", whose: "ally" }, { op: "heal", amount: share(1 / 3, "max_hp", "target"), to: "owner" }),
      ],
    },
  },
  tags: [at("phoenix", 3, 3), at("toll", null, 1)],
});
mail({
  name: "Hexweave mail", rarity: "legendary", text: "The wearer's hits deal 10% more to a foe for each debuff it holds.",
  // X8: a count of the target's debuffs (markers never count; Marked does).
  rule: { text: "The wearer's hits deal 10% more to a foe for each debuff it holds.", body: { boosts: both({ scale: [{ ratio: 10, count: "debuffs", of: "target" }] }) } },
  tags: [at("lockdown", 3, 2), at("bonfire", null, 2), at("snap", null, 2), at("toll", null, 2)],
});

// ─── Leather (Ranger, Monk, Assassin, Bard, Valkyrie) ─────────────────────────

leather({ name: "Tumbler's vest", rarity: "common", text: "Evasion 20, Attack +1.", stats: [sp("evasion", "medium"), st("attack", 1)], tags: first("cuts", "toll") });
leather({ name: "Footpad's jerkin", rarity: "common", text: "Crit chance +3%, Attack +1.", stats: [critStep(1), st("attack", 1)], tags: first("ambush", "hunt") });
leather({ name: "Spotter's coat", rarity: "common", text: "Accuracy 20, Crit chance +3%.", stats: [sp("accuracy", "medium"), critStep(1)], tags: first("hunt", "ambush") });

leather({
  name: "Courier's coat", rarity: "uncommon", text: "Attack +1. The first time each fight the wearer drops below half its HP, it's Hasted.",
  stats: [st("attack", 1)],
  rule: { text: "The first time each fight the wearer drops below half its HP, it's Hasted.", body: { reactions: [onceBelowHalf("haste", "couriers_coat_used")] } },
  more: [used("couriers_coat_used", "COURIER")],
  tags: first("cuts", "pact", "toll"),
});
leather({
  name: "Mottled hide", rarity: "uncommon", text: "Evasion 20. While the wearer is below half its HP, it draws far less (Aggro −20).",
  stats: [sp("evasion", "medium")],
  rule: { text: "While the wearer is below half its HP, it draws far less (Aggro −20).", body: { reactions: whileHp("mottled_hide_on", true) } },
  more: [state("mottled_hide_on", "MOTTLED", "Draws far less.", { stats: [st("aggro", -2)] })],
  tags: first("cuts", "hunt", "ambush"),
});
leather({
  name: "Warpaint jerkin", rarity: "uncommon", text: "Crit chance +3%. Starts every fight with a few Might, from its Attack.",
  stats: [critStep(1)],
  rule: { text: "Starts every fight with a few Might, from its Attack.", body: { reactions: [when({ event: "fight_start" }, give("might", "holder", own("few", "attack")))] } },
  tags: first("ambush", "hunt", "cuts"),
});

leather({
  name: "Duelist's leathers", rarity: "rare", text: "Evasion 20. Each time the wearer dodges a hit, it strikes the attacker with its weapon.",
  stats: [sp("evasion", "medium")],
  // X28: one swing of its weapon at the attacker, a hit of kind extra.
  rule: { text: "Each time the wearer dodges a hit, it strikes the attacker with its weapon.", body: { reactions: [when({ event: "hit_evaded" }, { op: "strike", to: "other" })] } },
  tags: [at("toll", 2, 3), at("cuts", 2, 2)],
});
leather({
  name: "Shadow cloak", rarity: "rare", text: "Hidden when the fight starts. The wearer's hits deal half again as much while it's Hidden.",
  rule: {
    text: "Hidden when the fight starts. The wearer's hits deal half again as much while it's Hidden.",
    body: { reactions: [when({ event: "fight_start" }, give("hidden", "holder"))], boosts: both({ scale: [{ ratio: 50, when: { has: "hidden" }, of: "holder" }] }) },
  },
  tags: [at("ambush", 2, 3), at("hunt", null, 2), at("phoenix", null, 1)],
});
leather({
  name: "Tracker's coat", rarity: "rare", text: "Aggro −10. The wearer's abilities have Seek.",
  stats: [st("aggro", -1)],
  rule: { text: "The wearer's abilities have Seek.", body: { seek: "ability" } },
  tags: [at("hunt", 2, 3), at("ambush", null, 2), at("lockdown", null, 1)],
});

leather({
  name: "Windrunner's garb", rarity: "legendary",
  text: "Evasion 20. Each dodge adds 1 Tempo (+5% speed in everything a stack, up to 10) for the rest of the fight. Each hit the wearer takes spends half its Tempo.",
  stats: [sp("evasion", "medium")],
  rule: {
    text: "Each dodge adds 1 Tempo (+5% speed in everything a stack, up to 10) for the rest of the fight. Each hit the wearer takes spends half its Tempo.",
    body: { reactions: [when({ event: "hit_evaded" }, give("tempo", "holder", FLAT_STACKS.one))] },
  },
  tags: [at("cuts", 3, 3), at("toll", 3, 2)],
});
leather({
  name: "Pack leader's coat", rarity: "legendary", text: "When the wearer lands a killing blow, every ally's next basic attack comes at once.",
  rule: {
    text: "When the wearer lands a killing blow, every ally's next basic attack comes at once.",
    // X2 and X29: a kill the holder landed; X21: the basic attack's timer made ready.
    body: { reactions: [when({ event: "ko", whose: "foe", other: "holder" }, { op: "cooldown", which: "basic", set: "ready", to: everyAlly })] },
  },
  tags: [at("hunt", 3, 3), at("ambush", null, 2), at("harvest", null, 1)],
});
leather({
  name: "Frostwalker's furs", rarity: "legendary", text: "When a foe's Chill shatters, the wearer is Hasted, and its next hit adds a Chill to every foe.",
  rule: {
    text: "When a foe's Chill shatters, the wearer is Hasted, and its next hit adds a Chill to every foe.",
    body: { reactions: [when({ event: "status_capped", status: "chill", whose: "foe" }, give("haste", "holder"), give("frostwalkers_furs_on", "holder"))] },
  },
  more: [
    state("frostwalkers_furs_on", "FROSTWALK", "Its next hit adds a Chill to every foe.", {
      stacking: "refresh",
      reactions: [when({ event: "hit_lands" }, give("chill", everyFoe, FLAT_STACKS.one), lift("frostwalkers_furs_on", "holder"))],
    }),
  ],
  tags: [at("snap", 3, 3), at("cuts", null, 2)],
});

// ─── Robes (Cleric, Pyromancer, Frostweaver, Stormcaller, Bard) ───────────────

robes({ name: "Magister's robe", rarity: "common", text: "Magic +2.", stats: [st("magic", 2)], tags: first("harvest", "bonfire", "snap") });
robes({ name: "Wayfarer's habit", rarity: "common", text: "MP +1, MP regen +1.", stats: [st("max_mp", 1), st("mp_regen", 1)], tags: first("overflow", "bonfire", "phoenix") });
robes({ name: "Hermit's cowl", rarity: "common", text: "Magic +1, Aggro −1.", stats: [st("magic", 1), st("aggro", -1)], tags: first("harvest", "bonfire", "overflow") });

robes({
  name: "Matins robe", rarity: "uncommon", text: "Magic +1. The first ability the wearer casts each fight costs no MP.",
  stats: [st("magic", 1)],
  rule: { text: "The first ability the wearer casts each fight costs no MP.", body: { reactions: [when({ event: "fight_start" }, give("matins_robe_on", "holder"))] } },
  more: [
    // X22: free while held; lifted once a cast has resolved (and paid nothing).
    state("matins_robe_on", "MATINS", "Its next ability costs no MP.", {
      mods: [{ mp: -100 }],
      reactions: [when({ event: "action_resolve", kind: "ability" }, lift("matins_robe_on", "holder"))],
    }),
  ],
  tags: first("overflow", "bonfire", "ambush"),
});
robes({
  name: "Wallflower's robe", rarity: "uncommon", text: "HP +1. Draws far less (Aggro −20) until the first hit lands on it each fight.",
  stats: [st("max_hp", 1)],
  rule: { text: "Draws far less (Aggro −20) until the first hit lands on it each fight.", body: { reactions: [when({ event: "fight_start" }, give("wallflowers_robe_on", "holder"))] } },
  more: [
    state("wallflowers_robe_on", "UNNOTICED", "Draws far less until a hit lands on it.", {
      stats: [st("aggro", -2)],
      reactions: [when({ event: "hit_taken" }, lift("wallflowers_robe_on", "holder"))],
    }),
  ],
  tags: first("overflow", "harvest", "phoenix"),
});
robes({
  name: "Glyphed robe", rarity: "uncommon", text: "MP regen +1. Each ability the wearer finishes casting gives it a Shield of a tenth of its Magic.",
  stats: [st("mp_regen", 1)],
  rule: {
    text: "Each ability the wearer finishes casting gives it a Shield of a tenth of its Magic.",
    body: { reactions: [when({ event: "action_resolve", kind: "ability" }, give("shield", "holder", share(0.1, "magic")))] },
  },
  tags: first("overflow", "bonfire", "harvest"),
});

robes({
  name: "Kindled robes", rarity: "rare", text: "While any foe has Burn, the wearer gains 1 Heat every 4 ticks (+3% damage a stack, up to 15) for the rest of the fight.",
  rule: {
    text: "While any foe has Burn, the wearer gains 1 Heat every 4 ticks (+3% damage a stack, up to 15) for the rest of the fight.",
    // X3: a pulse that does nothing on a beat when no foe burns.
    body: { pulse: { every: 4, if: { side: "foes", where: { has: "burn" } }, do: [give("heat", "holder", FLAT_STACKS.one)] } },
  },
  tags: [at("bonfire", 2, 3), at("harvest", null, 1)],
});
robes({
  name: "Quiet robes", rarity: "rare", text: "Aggro −10. Can't be Silenced.",
  stats: [st("aggro", -1), { stat: "immune:status:silence", flat: 1 }],
  tags: [at("overflow", 2, 2), at("lockdown", null, 2), at("phoenix", null, 2)],
});
robes({
  name: "Weaver's robes", rarity: "rare", text: "When an ally finishes casting an ability, the wearer's next ability costs a fifth less MP.",
  rule: {
    text: "When an ally finishes casting an ability, the wearer's next ability costs a fifth less MP.",
    body: { reactions: [when({ event: "action_resolve", kind: "ability", whose: "ally" }, give("weavers_robes_on", "holder"))] },
  },
  more: [
    // Refresh, so two allies' casts before the wearer's still take a fifth off.
    state("weavers_robes_on", "WOVEN", "Its next ability costs a fifth less MP.", {
      stacking: "refresh",
      mods: [{ mp: -20 }],
      reactions: [when({ event: "action_resolve", kind: "ability" }, lift("weavers_robes_on", "holder"))],
    }),
  ],
  tags: [at("overflow", 2, 3)],
});

robes({
  name: "Archmage's mantle", rarity: "legendary",
  text: "The wearer's abilities cost half again as much MP, deal half again as much damage, heal half again as much, and add half again as many stacks.",
  rule: {
    text: "The wearer's abilities cost half again as much MP, deal half again as much damage, heal half again as much, and add half again as many stacks.",
    // X22 and X24: the cost, the heals and every Intensity status its abilities apply; a boost on its abilities' hits.
    body: { mods: [{ mp: 50, heal: 50, stacks: { pct: 50 } }], boosts: [{ tag: "ability", pct: 50 }] },
  },
  tags: [at("overflow", 3, 3), at("bonfire", null, 2), at("harvest", null, 2)],
});
robes({
  name: "Stormweave", rarity: "legendary", text: "Each of the wearer's actions that hits three or more foes adds 1 Surge (+5% damage a stack, up to 10) for the rest of the fight.",
  rule: {
    text: "Each of the wearer's actions that hits three or more foes adds 1 Surge (+5% damage a stack, up to 10) for the rest of the fight.",
    // X2 and X29: the count of foes the action's hits landed on.
    body: { reactions: [when({ event: "action_resolve", countAtLeast: 3 }, give("surge", "holder", FLAT_STACKS.one))] },
  },
  tags: [at("harvest", 3, 3), at("snap", null, 1)],
});
robes({
  name: "Vestments of return", rarity: "legendary", text: "While the wearer stands, every ally revived comes back behind a Shield of half its max HP.",
  rule: {
    text: "While the wearer stands, every ally revived comes back behind a Shield of half its max HP.",
    body: { reactions: [when({ event: "revived", whose: "ally" }, give("shield", "owner", share(STATUS.shield.capShare, "max_hp", "target")))] },
  },
  tags: [at("phoenix", 3, 3)],
});

// ─── Amulets (everyone) ──────────────────────────────────────────────────────

amulet({ name: "Lodestone", rarity: "common", text: "HP +1, Aggro +1.", stats: [st("max_hp", 1), st("aggro", 1)], tags: first("toll", "phoenix", "bonfire") });
amulet({ name: "Whetstone", rarity: "common", text: "Attack +1, Crit chance +3%.", stats: [st("attack", 1), critStep(1)], tags: first("ambush", "hunt", "landslide") });
amulet({ name: "Moonstone", rarity: "common", text: "Magic +1, Aggro −1.", stats: [st("magic", 1), st("aggro", -1)], tags: first("harvest", "bonfire", "snap") });
amulet({ name: "Ironstone", rarity: "common", text: "Armor +1, Attack +1.", stats: [st("armor", 1), st("attack", 1)], tags: first("landslide", "toll") });
amulet({ name: "Dewstone", rarity: "common", text: "MP regen +1, MP +1.", stats: [st("mp_regen", 1), st("max_mp", 1)], tags: first("overflow", "lockdown", "phoenix") });
amulet({ name: "Quicksilver", rarity: "common", text: "Evasion 20, HP +1.", stats: [sp("evasion", "medium"), st("max_hp", 1)], tags: first("cuts", "toll") });

amulet({
  name: "Red ribbon", rarity: "uncommon", text: "Armor +1. The first time an ally drops below half its HP each fight, the wearer Taunts.",
  stats: [st("armor", 1)],
  rule: {
    text: "The first time an ally drops below half its HP each fight, the wearer Taunts.",
    // X3: the ally that lost HP (the event's owner) is below half, and the wearer hasn't Taunted for it this fight.
    body: {
      reactions: [{
        on: { event: "hp_lost", whose: "ally" },
        if: [{ unit: "owner", where: { hpBelow: HALF } }, { side: "self", where: { lacks: "red_ribbon_used" } }],
        do: [give("taunt", "holder"), give("red_ribbon_used", "holder")],
      }],
    },
  },
  more: [used("red_ribbon_used", "RED RIBBON")],
  tags: first("toll", "bonfire", "pact"),
});
amulet({
  name: "Carapace charm", rarity: "uncommon", text: "HP +1. Starts every fight behind a Shield of 15% of its max HP.",
  stats: [st("max_hp", 1)],
  rule: { text: "Starts every fight behind a Shield of 15% of its max HP.", body: { reactions: [when({ event: "fight_start" }, give("shield", "holder", share(0.15, "max_hp")))] } },
  tags: first("landslide", "ambush", "phoenix"),
});
amulet({
  name: "Hare's foot", rarity: "uncommon", text: "Magic +1. Starts every fight Hasted.",
  stats: [st("magic", 1)],
  rule: { text: "Starts every fight Hasted.", body: { reactions: [when({ event: "fight_start" }, give("haste", "holder"))] } },
  tags: first("ambush", "bonfire", "overflow", "cuts"),
});
amulet({
  name: "Batwing charm", rarity: "uncommon", text: "Attack +1. Hits from the wearer's abilities heal it for 10% of their damage.",
  stats: [st("attack", 1)],
  rule: {
    text: "Hits from the wearer's abilities heal it for 10% of their damage.",
    body: { reactions: [when({ event: "hit_lands", kind: "ability" }, { op: "heal", amount: ofAmount(SPECIAL.lifesteal.medium / 100), to: "self" })] },
  },
  tags: first("pact", "harvest", "lockdown"),
});
amulet({
  name: "Urchin shell", rarity: "uncommon", text: "Aggro +1. While the wearer holds a Shield, it has Thorns 150.",
  stats: [st("aggro", 1)],
  rule: {
    text: "While the wearer holds a Shield, it has Thorns 150.",
    // Bedrock's pattern.
    body: {
      reactions: [
        when({ event: "status_gained", status: "shield" }, give("urchin_shell_on", "holder")),
        when({ event: "status_ended", status: "shield" }, lift("urchin_shell_on", "holder")),
      ],
    },
  },
  more: [state("urchin_shell_on", "URCHIN", "Thorns 150.", { stats: [sp("thorns", "medium")] })],
  tags: first("toll", "landslide", "phoenix"),
});
amulet({
  name: "Wasp charm", rarity: "uncommon", text: "Crit chance +3%. While the wearer is Hasted, it has Double strike 25%.",
  stats: [critStep(1)],
  rule: {
    text: "While the wearer is Hasted, it has Double strike 25%.",
    body: {
      reactions: [
        when({ event: "status_gained", status: "haste" }, give("wasp_charm_on", "holder")),
        when({ event: "status_ended", status: "haste" }, lift("wasp_charm_on", "holder")),
      ],
    },
  },
  more: [state("wasp_charm_on", "WASP", "Double strike 25%.", { stats: [sp("double_strike", "medium")] })],
  tags: first("cuts", "bonfire", "snap"),
});

amulet({
  name: "Millstone", rarity: "rare", text: "Basic attacks come half as often and deal two and a quarter times as much.",
  stats: [{ stat: "attack_speed", flat: -100 }],
  rule: { text: "Basic attacks deal two and a quarter times as much.", body: { boosts: [{ tag: "basic", pct: 125 }] } },
  tags: [at("landslide", 2, 3), at("ambush", null, 1), at("lockdown", null, 1)],
});
amulet({
  name: "Hummingbird charm", rarity: "rare", text: "Basic attacks come twice as often and deal 45% as much.",
  stats: [{ stat: "attack_speed", flat: 100 }],
  rule: { text: "Basic attacks deal 45% as much.", body: { boosts: [{ tag: "basic", pct: -55 }] } },
  tags: [at("cuts", 2, 3), at("snap", null, 2), at("bonfire", null, 2)],
});
amulet({
  name: "Echo charm", rarity: "rare", text: "The wearer's extra strikes apply what its basic attacks apply: statuses and on-hit effects. Not damage boosts or Lifesteal.",
  rule: { text: "The wearer's extra strikes apply what its basic attacks apply: statuses and on-hit effects. Not damage boosts or Lifesteal.", body: { echo: true } },
  tags: [at("cuts", 2, 3), at("bonfire", null, 1), at("toll", null, 1), at("snap", null, 1)],
});
amulet({
  name: "Opportunist's charm", rarity: "rare", text: "Hits on a Stunned or Silenced foe deal a third more.",
  rule: { text: "Hits on a Stunned or Silenced foe deal a third more.", body: { boosts: both({ scale: [{ ratio: 33, when: { hasAny: ["stun", "silence"] }, of: "target" }] }) } },
  tags: [at("lockdown", 2, 3), at("snap", null, 2), at("landslide", null, 1)],
});
amulet({
  name: "Bounty charm", rarity: "rare", text: "When the wearer lands a killing blow, it gains 2 Might and its next basic attack comes at once.",
  rule: {
    text: "When the wearer lands a killing blow, it gains 2 Might and its next basic attack comes at once.",
    body: { reactions: [when({ event: "ko", whose: "foe", other: "holder" }, give("might", "holder", FLAT_STACKS.few), { op: "cooldown", which: "basic", set: "ready", to: "holder" })] },
  },
  tags: [at("hunt", 2, 3), at("ambush", null, 1), at("bonfire", null, 1)],
});
amulet({
  name: "Martyr's locket", rarity: "rare", text: "When the wearer falls, every other ally heals a fifth of its max HP and is Hasted.",
  rule: {
    text: "When the wearer falls, every other ally heals a fifth of its max HP and is Hasted.",
    // It survives the knockout to answer it; the fallen wearer isn't among the living allies.
    body: { survivesKO: true, reactions: [when({ event: "ko" }, { op: "heal", amount: share(0.2, "max_hp", "target"), to: everyAlly }, give("haste", everyAlly))] },
  },
  tags: [at("phoenix", 2, 3), at("toll", null, 1)],
});

amulet({
  name: "Heart of winter", rarity: "legendary", text: "Every hit the wearer lands adds a Chill.",
  rule: { text: "Every hit the wearer lands adds a Chill.", body: { reactions: [when({ event: "hit_lands" }, give("chill", "other", FLAT_STACKS.one))] } },
  // "Cuts → Snap (the door)": the way from one into the other.
  tags: [at("snap", 3, 3), at("lockdown", null, 2), at("cuts", null, 1)],
});
amulet({
  name: "Ember heart", rarity: "legendary", text: "When a burning foe falls, every other foe gains a third of its Burn.",
  rule: {
    text: "When a burning foe falls, every other foe gains a third of its Burn.",
    // Spec section 6.3: the dying foe's Burn ends (cause ko) before its ko event, with its stacks as the amount (X1).
    body: { reactions: [when({ event: "status_ended", status: "burn", whose: "foe", cause: ["ko"] }, give("burn", everyFoe, ofAmount(1 / 3)))] },
  },
  tags: [at("bonfire", 3, 2), at("harvest", 3, 2)],
});
amulet({
  name: "Phoenix ember", rarity: "legendary", text: "HP −1. Once a fight, when the wearer falls, it stands up 4 ticks later with a fifth of its HP.",
  stats: [st("max_hp", -1)],
  rule: {
    text: "Once a fight, when the wearer falls, it stands up 4 ticks later with a fifth of its HP.",
    // Spec section 6.1: a fallen unit can't gain a status, so its fall schedules its own return (X34) unless the marker is there,
    // and the marker is set when it stands again by its own hand (X2's `other: holder` on revived). As every revive, it comes back
    // with its actions on full cooldown.
    body: {
      survivesKO: true,
      reactions: [
        when({ event: "ko" }, { op: "revive", hp: share(0.2, "max_hp", "target"), after: 4, to: self({ ko: true, lacks: "phoenix_ember_used" }) }),
        when({ event: "revived", other: "holder" }, give("phoenix_ember_used", "holder")),
      ],
    },
  },
  more: [used("phoenix_ember_used", "PHOENIX EMBER")],
  tags: [at("phoenix", 3, 3), at("pact", null, 2)],
});
amulet({
  name: "Ready stance", rarity: "legendary", text: "The wearer's abilities start every fight at least half charged. Its cooldowns are a fifth longer.",
  // −16.7 makes cooldowns ×1.2, a fifth longer, as the card and the spine say (cooldowns ÷ (1 + stat/100)); the fill's −20 is ×1.25.
  stats: [{ stat: "cooldown_reduction", flat: -16.7 }],
  rule: {
    text: "The wearer's abilities start every fight at least half charged.",
    body: { reactions: [when({ event: "fight_start" }, { op: "cooldown", which: "abilities", set: { atMost: 50 }, to: "holder" })] },
  },
  note: "Cooldown reduction −16.7 (cooldowns ×1.2, a fifth longer, as the card says), not the fill's −20 (×1.25).",
  tags: [at("ambush", 3, 3), at("phoenix", null, 2)],
});
amulet({
  name: "Blood covenant", rarity: "legendary",
  text: "The wearer's abilities cost HP in place of MP: the same share of its max HP as they'd cost of its max MP. It won't cast one that would leave it below a tenth of its HP.",
  rule: {
    text: "The wearer's abilities cost HP in place of MP: the same share of its max HP as they'd cost of its max MP. It won't cast one that would leave it below a tenth of its HP.",
    // X22 and X23: free of MP, and the cost paid as a share of max HP (G12), waiting rather than going below a tenth.
    body: { mods: [{ mp: -100, hp: { pct: 100, share: true, floor: 10 } }] },
  },
  tags: [at("pact", 3, 3), at("overflow", null, 1)],
});
amulet({
  name: "Gambler's coin", rarity: "legendary",
  text: "The wearer's crit chance is about 50%. Its hits that don't crit deal half; its crits deal what a crit always does. Hits that always crit still do.",
  rule: {
    text: "The wearer's crit chance is about 50%. Its hits that don't crit deal half; its crits deal what a crit always does. Hits that always crit still do.",
    // X17 sets the chance after every other stat change (Bedrock doesn't double it); crit rules (X25) add after it (G17), hence
    // "about" on the card (spec section 6.6). Every hit −50%, and the crit multiplier doubled (Bedrock's shape, read at the
    // fight's start), so a crit lands at its usual size.
    body: {
      set: [{ stat: "crit_chance", value: 50 }],
      boosts: both(-50),
      stats: [{ stat: "crit_multiplier", flat: share(1, "crit_multiplier") }],
    },
  },
  tags: [at("landslide", null, 1), at("ambush", null, 1)],
});
