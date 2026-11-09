/**
 * The four armor types' 48 pieces and the 24 amulets, built from the engine's primitives (PRIMITIVES.md).
 * `gear` joins the pack's gear and the rogue's stock; `statuses` the pack's statuses; `builds` is designer data, never in the pack.
 *
 * Every piece carries stats at every rarity (the standard budget, kit.ts): a rare's or legendary's step sits beside its effect.
 * Statuses are applied at their own length (universal), and nothing here is balanced. A piece's own
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
const both = (pct: NumT) => [{ tag: "physical", pct }];

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
/** A once-a-fight marker: neither buff nor debuff, kept through a knockout so a revive doesn't give the piece back. */
const used = (id: string, name: string): StatusT =>
  ({ id, name, text: "Spent for this fight.", label: "marker", show: "sheet", stacking: "fizzle", survivesKO: true }) as StatusT;

/**
 * Bloodlust's pattern, either way round: a state held while the wearer is below half its HP (or at half or more). Set at the
 * fight's start and on a revive too, since HP carries from fight to fight: set only on a heal or a lost HP, a wearer who
 * started a fight below half would have the card turned over until its first hit.
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
  rarity: Rarity;
  stats?: ReturnType<typeof st>[];
  /** The card, when it says more than the rule's sentence. */
  effect?: string;
  /** The piece's own status, given at every fight's start: its effect's sentence (the card's, unless `effect` says more) and what it does. */
  rule?: { text: string; body: Partial<StatusT> };
  /** Further statuses: states it switches on, markers. */
  more?: StatusT[];
  tags: BuildTag[];
  note?: string;
};
function add(slot: "armor" | "amulet", kind: string | undefined, it: Item) {
  const g = piece({ name: it.name, effect: it.effect ?? it.rule?.text, slot, rarity: it.rarity, kind, stats: it.stats, note: it.note });
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

plate({ name: "Ironclad", rarity: "common", stats: [st("defense", 1)], tags: first("landslide", "toll") });
plate({ name: "Crested plate", rarity: "common", stats: [st("max_hp", 1)], tags: first("toll", "bonfire", "phoenix") });
plate({ name: "Bristled plate", rarity: "common", stats: [sp("thorns", "medium")], tags: first("toll", "landslide") });

plate({
  name: "Portcullis", rarity: "uncommon", stats: [sp("thorns", "medium"), st("defense", 1)],
  rule: { text: "While the wearer is above half its HP, it draws far more (Aggro +20).", body: { reactions: whileHp("portcullis_on", false) } },
  more: [state("portcullis_on", "PORTCULLIS", "Draws far more.", { stats: [st("aggro", 2)] })],
  tags: first("toll", "landslide", "bonfire"),
});
plate({
  name: "Keystone cuirass", rarity: "uncommon", stats: [st("defense", 1), st("aggro", 1)],
  rule: { text: "Its basic attacks deal 2% more for every 1,000 Defense it has.", body: { boosts: [{ tag: "basic", pct: share(0.002, "defense") }] } },
  tags: first("landslide", "toll"),
});
plate({
  name: "Holdfast", rarity: "uncommon", stats: [st("max_hp", 1), st("defense", 1)],
  rule: { text: "The first time each fight the wearer drops below half its HP, it's Guarded.", body: { reactions: [onceBelowHalf("guard", "holdfast_used")] } },
  more: [used("holdfast_used", "HOLDFAST")],
  tags: first("toll", "pact", "bonfire"),
});

plate({
  name: "Bastion plate", rarity: "rare", stats: [st("defense", 1), st("max_hp", 1), st("aggro", 1)],
  rule: { text: "Starts every fight Guarded.", body: { reactions: [when({ event: "fight_start" }, give("guard", "holder"))] } },
  tags: [at("landslide", 2, 3), at("toll", 2, 2), at("bonfire", null, 2)],
});
plate({
  name: "Hoarfrost plate", rarity: "rare", stats: [st("max_hp", 1), st("defense", 1), sp("thorns", "medium")],
  rule: { text: "Foes that hit the wearer gain 2 Chill.", body: { reactions: [when({ event: "hit_taken" }, give("chill", "other", FLAT_STACKS.few))] } },
  tags: [at("toll", 2, 3), at("snap", null, 2), at("lockdown", null, 1)],
});
plate({
  name: "Challenger's plate", rarity: "rare", stats: [st("aggro", 1), st("defense", 1), sp("thorns", "medium")],
  rule: {
    text: "Taunts when the fight starts, and again whenever an ally falls.",
    body: { reactions: [when({ event: "fight_start" }, give("taunt", "holder")), when({ event: "ko", whose: "ally" }, give("taunt", "holder"))] },
  },
  tags: [at("toll", 2, 2), at("phoenix", 2, 2), at("bonfire", null, 2), at("harvest", null, 1)],
});

plate({
  name: "Rubble plate", rarity: "legendary",
  stats: [st("defense", 2), st("max_hp", 1), st("aggro", 1)],
  rule: {
    text: "When the wearer's Shield breaks, every foe takes damage equal to the most that Shield held since it last broke, and a Shield of a quarter of that is rebuilt.",
    body: {
      // A Shield emptied by damage ends (cause stacks) with its peak as the amount. A Dispel (cause removed) doesn't set it off.
      reactions: [when({ event: "status_ended", status: "shield", cause: ["stacks"] }, { op: "damage", type: "none", amount: ofAmount(1), to: everyFoe }, give("shield", "holder", ofAmount(0.25)))],
    },
  },
  tags: [at("landslide", 3, 3), at("toll", null, 2)],
});
plate({
  name: "Thornheart plate", rarity: "legendary", stats: [sp("thorns", "medium"), st("defense", 2), st("aggro", 1)],
  rule: { text: "Each hit the wearer takes adds 1 Spite (+15 Thorns a stack, up to 20) for the rest of the fight.", body: { reactions: [when({ event: "hit_taken" }, give("spite", "holder", FLAT_STACKS.one))] } },
  tags: [at("toll", 3, 3), at("landslide", null, 1)],
});
plate({
  name: "Last bastion", rarity: "legendary",
  stats: [st("max_hp", 1), st("defense", 2), sp("thorns", "medium")],
  rule: {
    text: "Once a fight, a blow that would knock the wearer out leaves it at 1 HP and Guarded instead. Until it's healed back above half its HP, its hits deal double. After a won fight, it's at no less than a fifth of its HP.",
    body: {
      reactions: [
        // The floor comes with the fight's start, not with the piece, so a revive later in the fight doesn't bring a second one.
        when({ event: "fight_start" }, give("last_bastion_floor", "holder")),
        when({ event: "status_ended", status: "last_bastion_floor", cause: ["spent"] }, give("guard", "holder"), give("last_bastion_on", "holder")),
        when({ event: "healed" }, lift("last_bastion_on", self({ hpAtLeast: HALF }))),
        // After a won fight: up to a fifth of its max HP, if it's below that.
        when({ event: "fight_won" }, { op: "heal", amount: { scale: [{ ratio: 0.2, stat: "max_hp", of: "holder" }, { ratio: -1, hp: "current", of: "holder" }] }, to: self({ hpBelow: 20 }) }),
      ],
    },
  },
  more: [
    // An HP floor that's spent on the first blow it holds.
    state("last_bastion_floor", "LAST BASTION", "The next blow that would knock it out leaves it at 1 HP.", { show: "sheet", unremovable: true, floor: { spend: true } }),
    state("last_bastion_on", "BASTION", "Its hits deal double.", { boosts: both(100) }),
  ],
  tags: [at("phoenix", 3, 2), at("pact", 3, 2), at("toll", null, 2)],
});

// ─── Mail (Paladin, Valkyrie, Vampire, Hexer, Bramble knight, Frostweaver) ─────

mail({ name: "Inscribed hauberk", rarity: "common", stats: [st("attack", 1)], tags: first("lockdown", "bonfire", "cuts") });
mail({ name: "Lamprey mail", rarity: "common", stats: [st("max_hp", 1)], tags: first("pact", "cuts") });
mail({ name: "Thick byrnie", rarity: "common", stats: [st("defense", 1)], tags: first("pact", "toll", "phoenix") });

mail({
  name: "Tithing hauberk", rarity: "uncommon", stats: [st("attack", 1), st("max_hp", 1)],
  rule: { text: "Each hit the wearer lands heals it for 1.5% of its max HP.", body: { reactions: [when({ event: "hit_lands" }, { op: "heal", amount: share(0.015, "max_hp"), to: "self" })] } },
  tags: first("pact", "cuts"),
});
mail({
  name: "Reprisal hauberk", rarity: "uncommon", stats: [st("max_hp", 1), sp("lifesteal", "medium")],
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
  name: "Silvered hauberk", rarity: "uncommon", stats: [st("attack", 1), st("defense", 1)],
  rule: { text: "The first hit the wearer takes each fight deals half.", body: { reactions: [when({ event: "fight_start" }, give("silvered_hauberk_on", "holder"))] } },
  more: [
    state("silvered_hauberk_on", "SILVERED", "The next hit it takes deals half.", {
      taken: [{ tag: "physical", pct: -50 }],
      reactions: [when({ event: "hit_taken", tags: ["physical"] }, lift("silvered_hauberk_on", "holder"))],
    }),
  ],
  tags: first("lockdown", "bonfire", "toll"),
});

mail({
  name: "Static mail", rarity: "rare", stats: [st("attack", 1), st("max_hp", 1), sp("lifesteal", "medium")],
  rule: { text: "Foes that hit the wearer gain 2 Shock.", body: { reactions: [when({ event: "hit_taken" }, give("shock", "other", FLAT_STACKS.few))] } },
  tags: [at("toll", 2, 3), at("harvest", null, 1)],
});
mail({
  name: "Mocking mail", rarity: "rare", stats: [st("aggro", 2), st("max_hp", 1)],
  rule: { text: "Taunts when the fight starts.", body: { reactions: [when({ event: "fight_start" }, give("taunt", "holder"))] } },
  // "Toll 1 to 2 ●●●": the anchor at both rungs.
  tags: [at("toll", 1, 3), at("toll", 2, 3), at("phoenix", null, 2), at("bonfire", null, 1)],
});
mail({
  name: "Bloodsworn mail", rarity: "rare", stats: [st("max_hp", 1), st("defense", 1), st("attack", 1)],
  rule: { text: "Below half its HP, the wearer has Lifesteal 10% and its hits deal a quarter more.", body: { reactions: whileHp("bloodsworn_mail_on", true) } },
  more: [state("bloodsworn_mail_on", "BLOODSWORN", "Lifesteal 10%, and its hits deal a quarter more.", { stats: [sp("lifesteal", "medium")], boosts: both(25) })],
  tags: [at("pact", 2, 3), at("phoenix", 2, 2)],
});

mail({
  name: "Sanguine mail", rarity: "legendary", stats: [st("max_hp", 2), { stat: "healing_received", flat: -50 }, st("attack", 1), sp("lifesteal", "medium")],
  rule: { text: "Below half its HP, healing the wearer receives is doubled. Above half, it's halved.", body: { reactions: whileHp("sanguine_mail_on", true) } },
  // On top of the piece's −50: +100 in all, double.
  more: [state("sanguine_mail_on", "SANGUINE", "Healing it receives is doubled.", { stats: [{ stat: "healing_received", flat: 150 }] })],
  tags: [at("pact", 3, 3), at("phoenix", null, 1)],
});
mail({
  name: "Mantle of the fallen", rarity: "legendary",
  stats: [st("attack", 1), st("max_hp", 2), st("defense", 1)],
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
  name: "Hexweave mail", rarity: "legendary", stats: [st("attack", 1), st("defense", 2), sp("lifesteal", "medium")],
  // A count of the target's debuffs (markers never count; Marked does).
  rule: { text: "The wearer's hits deal 10% more to a foe for each debuff it holds.", body: { boosts: both({ scale: [{ ratio: 10, count: "debuffs", of: "target" }] }) } },
  tags: [at("lockdown", 3, 2), at("bonfire", null, 2), at("snap", null, 2), at("toll", null, 2)],
});

// ─── Leather (Ranger, Monk, Assassin, Bard, Valkyrie, Stormcaller) ────────────

leather({ name: "Tumbler's vest", rarity: "common", stats: [sp("evasion", "medium")], tags: first("cuts", "toll") });
leather({ name: "Footpad's jerkin", rarity: "common", stats: [critStep(1)], tags: first("ambush", "hunt") });
leather({ name: "Spotter's coat", rarity: "common", stats: [sp("accuracy", "medium")], tags: first("hunt", "ambush") });

leather({
  name: "Courier's coat", rarity: "uncommon", stats: [st("attack", 1), sp("evasion", "medium")],
  rule: { text: "The first time each fight the wearer drops below half its HP, it's Hasted.", body: { reactions: [onceBelowHalf("haste", "couriers_coat_used")] } },
  more: [used("couriers_coat_used", "COURIER")],
  tags: first("cuts", "pact", "toll"),
});
leather({
  name: "Mottled hide", rarity: "uncommon", stats: [sp("evasion", "medium"), sp("accuracy", "medium")],
  rule: { text: "While the wearer is below half its HP, it draws far less (Aggro −20).", body: { reactions: whileHp("mottled_hide_on", true) } },
  more: [state("mottled_hide_on", "MOTTLED", "Draws far less.", { stats: [st("aggro", -2)] })],
  tags: first("cuts", "hunt", "ambush"),
});
leather({
  name: "Warpaint jerkin", rarity: "uncommon", stats: [critStep(1), sp("evasion", "medium")],
  rule: { text: "Starts every fight with a few Might, from its Attack.", body: { reactions: [when({ event: "fight_start" }, give("might", "holder", own("few", "attack")))] } },
  tags: first("ambush", "hunt", "cuts"),
});

leather({
  name: "Duelist's leathers", rarity: "rare", stats: [sp("evasion", "medium"), critStep(1), sp("accuracy", "medium")],
  // A reaction that strikes: one swing of its weapon at the attacker, a hit of kind extra.
  rule: { text: "Each time the wearer dodges a hit, it strikes the attacker with its weapon.", body: { reactions: [when({ event: "hit_evaded" }, { op: "strike", to: "other" })] } },
  tags: [at("toll", 2, 3), at("cuts", 2, 2)],
});
leather({
  name: "Shadow mantle", rarity: "rare", stats: [critStep(1), sp("evasion", "medium"), st("attack", 1)],
  rule: {
    text: "Hidden when the fight starts. The wearer's hits deal half again as much while it's Hidden.",
    body: { reactions: [when({ event: "fight_start" }, give("hidden", "holder"))], boosts: both({ scale: [{ ratio: 50, when: { has: "hidden" }, of: "holder" }] }) },
  },
  tags: [at("ambush", 2, 3), at("hunt", null, 2), at("phoenix", null, 1)],
});
leather({
  name: "Tracker's coat", rarity: "rare", stats: [st("aggro", -1), sp("evasion", "medium"), st("attack", 1)],
  rule: { text: "The wearer's abilities have Seek.", body: { seek: "ability" } },
  tags: [at("hunt", 2, 3), at("ambush", null, 2), at("lockdown", null, 1)],
});

leather({
  name: "Windrunner's garb", rarity: "legendary",
  stats: [sp("evasion", "high"), critStep(1), sp("accuracy", "medium")],
  rule: {
    text: "Each dodge adds 1 Tempo (+5% speed in everything a stack, up to 10) for the rest of the fight. Each hit the wearer takes spends half its Tempo.",
    body: { reactions: [when({ event: "hit_evaded" }, give("tempo", "holder", FLAT_STACKS.one))] },
  },
  tags: [at("cuts", 3, 3), at("toll", 3, 2)],
});
leather({
  name: "Pack leader's coat", rarity: "legendary", stats: [st("attack", 1), sp("evasion", "high"), sp("accuracy", "medium")],
  rule: {
    text: "When the wearer lands a killing blow, every ally's next basic attack comes at once.",
    // A kill the holder landed (`other: holder`); the basic attack's timer made ready.
    body: { reactions: [when({ event: "ko", whose: "foe", other: "holder" }, { op: "cooldown", which: "basic", set: "ready", to: everyAlly })] },
  },
  tags: [at("hunt", 3, 3), at("ambush", null, 2), at("harvest", null, 1)],
});
leather({
  name: "Frostwalker's furs", rarity: "legendary", stats: [sp("evasion", "high"), st("attack", 1), sp("attack_speed", "medium")],
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

robes({ name: "Magister's robe", rarity: "common", stats: [st("attack", 1)], tags: first("harvest", "bonfire", "snap") });
robes({ name: "Wayfarer's habit", rarity: "common", stats: [st("max_mp", 1)], tags: first("overflow", "bonfire", "phoenix") });
robes({ name: "Hermit's cowl", rarity: "common", stats: [st("aggro", -1)], tags: first("harvest", "bonfire", "overflow") });

robes({
  name: "Matins robe", rarity: "uncommon", stats: [st("attack", 1), st("max_mp", 1)],
  rule: { text: "The first ability the wearer casts each fight costs no MP.", body: { reactions: [when({ event: "fight_start" }, give("matins_robe_on", "holder"))] } },
  more: [
    // An MP cost change: free while held; lifted once a cast has resolved (and paid nothing).
    state("matins_robe_on", "MATINS", "Its next ability costs no MP.", {
      mods: [{ mp: -100 }],
      reactions: [when({ event: "action_resolve", kind: "ability" }, lift("matins_robe_on", "holder"))],
    }),
  ],
  tags: first("overflow", "bonfire", "ambush"),
});
robes({
  name: "Wallflower's robe", rarity: "uncommon", stats: [st("max_hp", 1), st("max_mp", 1)],
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
  name: "Glyphed robe", rarity: "uncommon", stats: [st("mp_regen", 1), st("max_mp", 1)],
  rule: {
    text: "Each ability the wearer finishes casting gives it a Shield of a tenth of its Attack.",
    body: { reactions: [when({ event: "action_resolve", kind: "ability" }, give("shield", "holder", share(0.1, "attack")))] },
  },
  tags: first("overflow", "bonfire", "harvest"),
});

robes({
  name: "Kindled robes", rarity: "rare", stats: [st("attack", 1), st("max_mp", 1), st("mp_regen", 1)],
  rule: {
    text: "While any foe has Burn, the wearer gains 1 Heat every 4 ticks (+3% damage a stack, up to 15) for the rest of the fight.",
    // A pulse with an `if`: it does nothing on a beat when no foe burns.
    body: { pulse: { every: 4, if: { side: "foes", where: { has: "burn" } }, do: [give("heat", "holder", FLAT_STACKS.one)] } },
  },
  tags: [at("bonfire", 2, 3), at("harvest", null, 1)],
});
robes({
  name: "Quiet robes", rarity: "rare", effect: "Can't be Silenced.",
  stats: [st("aggro", -1), { stat: "immune:status:silence", flat: 1 }, st("max_mp", 1), st("attack", 1)],
  tags: [at("overflow", 2, 2), at("lockdown", null, 2), at("phoenix", null, 2)],
});
robes({
  name: "Weaver's robes", rarity: "rare", stats: [st("mp_regen", 1), st("max_mp", 1), st("aggro", -1)],
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
  stats: [st("max_mp", 2), st("mp_regen", 1), st("attack", 1)],
  rule: {
    text: "The wearer's abilities cost half again as much MP, deal half again as much damage, heal half again as much, and add half again as many stacks.",
    // Ability changes to the cost, the heals and every Intensity status its abilities apply; a boost on its abilities' hits.
    body: { mods: [{ mp: 50, heal: 50, stacks: { pct: 50 } }], boosts: [{ tag: "ability", pct: 50 }] },
  },
  tags: [at("overflow", 3, 3), at("bonfire", null, 2), at("harvest", null, 2)],
});
robes({
  name: "Stormweave", rarity: "legendary", stats: [st("attack", 1), st("max_mp", 2), st("aggro", -1)],
  rule: {
    text: "Each of the wearer's actions that hits three or more foes adds 1 Surge (+5% damage a stack, up to 10) for the rest of the fight.",
    // The `countAtLeast` filter: the count of foes the action's hits landed on.
    body: { reactions: [when({ event: "action_resolve", countAtLeast: 3 }, give("surge", "holder", FLAT_STACKS.one))] },
  },
  tags: [at("harvest", 3, 3), at("snap", null, 1)],
});
robes({
  name: "Vestments of return", rarity: "legendary", stats: [st("mp_regen", 1), st("max_mp", 2), st("aggro", -1)],
  rule: {
    text: "While the wearer stands, every ally revived comes back behind a Shield of half its max HP.",
    body: { reactions: [when({ event: "revived", whose: "ally" }, give("shield", "owner", share(STATUS.shield.capShare, "max_hp", "target")))] },
  },
  tags: [at("phoenix", 3, 3)],
});

// ─── Amulets (everyone) ──────────────────────────────────────────────────────

amulet({ name: "Lodestone", rarity: "common", stats: [st("max_hp", 1)], tags: first("toll", "phoenix", "bonfire") });
amulet({ name: "Whetstone", rarity: "common", stats: [st("attack", 1)], tags: first("ambush", "hunt", "landslide") });
amulet({ name: "Moonstone", rarity: "common", stats: [st("aggro", -1)], tags: first("harvest", "bonfire", "snap") });
amulet({ name: "Ironstone", rarity: "common", stats: [st("defense", 1)], tags: first("landslide", "toll") });
amulet({ name: "Dewstone", rarity: "common", stats: [st("mp_regen", 1)], tags: first("overflow", "lockdown", "phoenix") });
amulet({ name: "Quicksilver", rarity: "common", stats: [sp("evasion", "medium")], tags: first("cuts", "toll") });

amulet({
  name: "Red ribbon", rarity: "uncommon", stats: [st("defense", 1), st("attack", 1)],
  rule: {
    text: "The first time an ally drops below half its HP each fight, the wearer Taunts.",
    // A reaction's `if`: the ally that lost HP (the event's owner) is below half, and the wearer hasn't Taunted for it this fight.
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
  name: "Carapace charm", rarity: "uncommon", stats: [st("max_hp", 1), st("attack", 1)],
  rule: { text: "Starts every fight behind a Shield of 15% of its max HP.", body: { reactions: [when({ event: "fight_start" }, give("shield", "holder", share(0.15, "max_hp")))] } },
  tags: first("landslide", "ambush", "phoenix"),
});
amulet({
  name: "Hare's foot", rarity: "uncommon", stats: [st("attack", 1), st("mp_regen", 1)],
  rule: { text: "Starts every fight Hasted.", body: { reactions: [when({ event: "fight_start" }, give("haste", "holder"))] } },
  tags: first("ambush", "bonfire", "overflow", "cuts"),
});
amulet({
  name: "Batwing charm", rarity: "uncommon", stats: [st("attack", 1), sp("evasion", "medium")],
  rule: {
    text: "Hits from the wearer's abilities heal it for 10% of their damage.",
    body: { reactions: [when({ event: "hit_lands", kind: "ability" }, { op: "heal", amount: ofAmount(SPECIAL.lifesteal.medium / 100), to: "self" })] },
  },
  tags: first("pact", "harvest", "lockdown"),
});
amulet({
  name: "Urchin shell", rarity: "uncommon", stats: [st("aggro", 1), st("attack", 1)],
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
  name: "Wasp charm", rarity: "uncommon", stats: [critStep(1), st("attack", 1)],
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
  name: "Millstone", rarity: "rare", effect: "Basic attacks come half as often and deal two and a quarter times as much.",
  stats: [st("attack", 1), { stat: "attack_speed", flat: -100 }, st("max_hp", 1), st("defense", 1)],
  rule: { text: "Basic attacks deal two and a quarter times as much.", body: { boosts: [{ tag: "basic", pct: 125 }] } },
  tags: [at("landslide", 2, 3), at("ambush", null, 1), at("lockdown", null, 1)],
});
amulet({
  name: "Hummingbird charm", rarity: "rare", effect: "Basic attacks come twice as often and deal 45% as much.",
  stats: [sp("evasion", "medium"), { stat: "attack_speed", flat: 100 }, st("attack", 1), st("defense", 1)],
  rule: { text: "Basic attacks deal 45% as much.", body: { boosts: [{ tag: "basic", pct: -55 }] } },
  tags: [at("cuts", 2, 3), at("snap", null, 2), at("bonfire", null, 2)],
});
amulet({
  name: "Echo charm", rarity: "rare", stats: [st("attack", 1), st("mp_regen", 1), sp("evasion", "medium")],
  rule: { text: "The wearer's extra strikes apply what its basic attacks apply: statuses and on-hit effects. Not damage boosts or Lifesteal.", body: { echo: true } },
  tags: [at("cuts", 2, 3), at("bonfire", null, 1), at("toll", null, 1), at("snap", null, 1)],
});
amulet({
  name: "Opportunist's charm", rarity: "rare", stats: [critStep(1), st("attack", 1), sp("evasion", "medium")],
  rule: { text: "Hits on a Stunned or Silenced foe deal a third more.", body: { boosts: both({ scale: [{ ratio: 33, when: { hasAny: ["stun", "silence"] }, of: "target" }] }) } },
  tags: [at("lockdown", 2, 3), at("snap", null, 2), at("landslide", null, 1)],
});
amulet({
  name: "Bounty charm", rarity: "rare", stats: [st("attack", 1), critStep(1), st("max_mp", 1)],
  rule: {
    text: "When the wearer lands a killing blow, it gains 2 Might and its next basic attack comes at once.",
    body: { reactions: [when({ event: "ko", whose: "foe", other: "holder" }, give("might", "holder", FLAT_STACKS.few), { op: "cooldown", which: "basic", set: "ready", to: "holder" })] },
  },
  tags: [at("hunt", 2, 3), at("ambush", null, 1), at("bonfire", null, 1)],
});
amulet({
  name: "Martyr's locket", rarity: "rare", stats: [st("max_hp", 1), st("attack", 1), st("max_mp", 1)],
  rule: {
    text: "When the wearer falls, every other ally heals a fifth of its max HP and is Hasted.",
    // It survives the knockout to answer it; the fallen wearer isn't among the living allies.
    body: { survivesKO: true, reactions: [when({ event: "ko" }, { op: "heal", amount: share(0.2, "max_hp", "target"), to: everyAlly }, give("haste", everyAlly))] },
  },
  tags: [at("phoenix", 2, 3), at("toll", null, 1)],
});

amulet({
  name: "Heart of winter", rarity: "legendary", stats: [st("attack", 2), st("max_hp", 1), st("defense", 1)],
  rule: { text: "Every hit the wearer lands adds a Chill.", body: { reactions: [when({ event: "hit_lands" }, give("chill", "other", FLAT_STACKS.one))] } },
  // "Cuts → Snap (the door)": the way from one into the other.
  tags: [at("snap", 3, 3), at("lockdown", null, 2), at("cuts", null, 1)],
});
amulet({
  name: "Ember heart", rarity: "legendary", stats: [st("attack", 2), st("defense", 1), st("mp_regen", 1)],
  rule: {
    text: "When a burning foe falls, every other foe gains a third of its Burn.",
    // The dying foe's Burn ends (cause ko) before its ko event, with its stacks as the amount.
    body: { reactions: [when({ event: "status_ended", status: "burn", whose: "foe", cause: ["ko"] }, give("burn", everyFoe, ofAmount(1 / 3)))] },
  },
  tags: [at("bonfire", 3, 2), at("harvest", 3, 2)],
});
amulet({
  name: "Phoenix ember", rarity: "legendary", stats: [st("attack", 2), st("max_hp", -1), st("mp_regen", 1), sp("evasion", "medium")],
  rule: {
    text: "Once a fight, when the wearer falls, it stands up 4 ticks later with a fifth of its HP.",
    // A fallen unit can't gain a status, so its fall schedules its own return (a revive on a timer) unless the marker is there,
    // and the marker is set when it stands again by its own hand (`other: holder` on revived). As every revive, it comes back
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
  name: "Ready stance", rarity: "legendary", effect: "The wearer's abilities start every fight at least half charged. Its cooldowns are a fifth longer.",
  // −16.7 makes cooldowns ×1.2, a fifth longer, as the card and the spine say (cooldowns ÷ (1 + stat/100)); −20 would be ×1.25.
  stats: [st("attack", 2), { stat: "cooldown_reduction", flat: -16.7 }, sp("evasion", "medium"), critStep(1)],
  rule: {
    text: "The wearer's abilities start every fight at least half charged.",
    body: { reactions: [when({ event: "fight_start" }, { op: "cooldown", which: "abilities", set: { atMost: 50 }, to: "holder" })] },
  },
  note: "Cooldown reduction −16.7 makes cooldowns ×1.2, a fifth longer, as the card says; −20 would make them ×1.25.",
  tags: [at("ambush", 3, 3), at("phoenix", null, 2)],
});
amulet({
  name: "Blood covenant", rarity: "legendary",
  stats: [st("max_hp", 1), st("attack", 2), critStep(1)],
  rule: {
    text: "The wearer's abilities cost HP in place of MP: the same share of its max HP as they'd cost of its max MP. It won't cast one that would leave it below a tenth of its HP.",
    // Free of MP, and the cost paid as an HP price, a share of max HP, waiting rather than going below a tenth.
    body: { mods: [{ mp: -100, hp: { pct: 100, share: true, floor: 10 } }] },
  },
  tags: [at("pact", 3, 3), at("overflow", null, 1)],
});
amulet({
  name: "Gambler's coin", rarity: "legendary",
  stats: [st("attack", 2), st("max_mp", 1), st("max_hp", 1)],
  rule: {
    text: "The wearer's crit chance is about 50%. Its hits that don't crit deal half; its crits deal what a crit always does. Hits that always crit still do.",
    // `set` fixes the chance after every other stat change (Bedrock doesn't double it); crit rules add after it, hence
    // "about" on the card. Every hit −50%, and the crit multiplier doubled (Bedrock's shape, read at the
    // fight's start), so a crit lands at its usual size.
    body: {
      set: [{ stat: "crit_chance", value: 50 }],
      boosts: both(-50),
      stats: [{ stat: "crit_multiplier", flat: share(1, "crit_multiplier") }],
    },
  },
  tags: [at("landslide", null, 1), at("ambush", null, 1)],
});
