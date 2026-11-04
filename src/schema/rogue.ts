/** The rogue mode's data (its rules are src/rogue.ts), and the upgrades: each ability and passive's power step and two versions. */
import * as z from "zod";
import { Id, IntRange, Note, PosInt, Text } from "./primitives.js";
import { Rarity, type RarityT } from "./content.js";

// ─────────────────────────────────────────────────────────────────────────────
// The rogue mode: a roguelite on Slay the Spire's structure (docs/core-set/rogue-mode.md).
// Its rules are src/rogue.ts; this is the data they read.
// ─────────────────────────────────────────────────────────────────────────────

/** The Muster (a pick of recruits) and the Drill ground (a pick of formations, or training). */
export const RogueNodeKind = z.enum(["fight", "elite", "event", "campfire", "shop", "treasure", "boss", "muster", "drill"]);
export type RogueNodeKindT = z.infer<typeof RogueNodeKind>;
/** A potion heals one unit, a tonic restores one unit's MP. */
export const SupplyId = z.enum(["potion", "tonic", "phoenix"]);
export type SupplyIdT = z.infer<typeof SupplyId>;
const Pct = z.number().min(0).max(100);
const RarityOdds = z.strictObject({ common: z.number().min(0), uncommon: z.number().min(0), rare: z.number().min(0), legendary: z.number().min(0) });
const Spoils = z.strictObject({
  count: PosInt,
  rarity: RarityOdds,
  tome: Pct.describe("Chance, in percent, that an offer is a tome (a member learns an ability) instead of gear."),
  recruit: Pct.describe("Chance an offer is a recruit."),
  supply: Pct.describe("Chance an offer is a supply."),
  legendaries: z.number().int().min(0).optional().describe("How many of the offers are always a legendary piece."),
  trophy: z.boolean().optional().describe("A legendary piece is won outright, on top of the pick."),
  aimed: z.number().int().min(0).optional().describe("The first this many offers are pieces aimed at someone in the party."),
  formations: z.number().int().min(0).optional().describe("A second pick follows, of this many formations (an elite's)."),
  extra: Pct.optional().describe("Chance, in percent, that a second pick of `count` pieces follows the first (gear only, from the same rarity table): a third more gear for the fourth slot."),
  mixed: Pct.optional().describe("Chance, in percent, that the pick mixes kinds: one piece of gear, then offers rolled from `mix` (the rest stay gear)."),
  mix: z.strictObject({ tome: z.number().min(0), formation: z.number().min(0), recruit: z.number().min(0), sealed: z.number().min(0).optional().describe("A piece whose rarity (rare or better) and name stay hidden until taken."), bundle: z.number().min(0).optional().describe("A common piece and a potion or a tonic together.") }).optional().describe("Weights of the other kinds in a mixed pick."),
});
const KnownOdds = z.array(z.number().min(0)).length(3).describe("Weights for knowing one, two or three abilities.");

export const RogueConfig = z.strictObject({
  start: z.strictObject({ gold: z.number().int().min(0), offers: PosInt, picks: z.number().int().min(0), known: PosInt.optional().describe("Abilities a class knows on joining in act I (default 1); one more an act after."), healer: z.boolean().optional().describe("While the party has nobody who heals others, each draft offers one who does."), supplies: z.array(SupplyId).optional().describe("Supplies in the bag at the start.") }).describe("Gold at the start; the draft after the leader: `picks` picks of one from `offers` classes."),
  firstAbility: z.record(Id, Id).optional().describe("The ability each class would know on joining. Not read: what a class knows is rolled."),
  startKnown: z.record(Id, PosInt).optional().describe("Classes that join knowing more than start.known abilities in act I, by class."),
  party: PosInt,
  bench: z.number().int().min(0).describe("Seats at camp at a run's start, besides the party (two in the core set)."),
  benchMax: z.number().int().min(0).optional().describe("Seats at camp at most; the others are won (a boon's seat, an event)."),
  benchByAct: z.array(z.number().int().min(0)).min(1).optional().describe("Seats at camp by act; a new act brings the run up to its act's (never down)."),
  recruits: z.strictObject({ offers: PosInt, known: z.array(KnownOdds).min(1).describe("By act: how many abilities a recruit knows, rolled at random from its three.") }).optional(),
  benchMp: Pct.optional().describe("Share of max MP a member regains after each won fight it sat out (from the max it last fought with)."),
  fresh: Pct.optional().describe("Share of its cooldown already run for a fresh ability: a starting unit's, a recruit's, one just learned."),
  muster: z.strictObject({ offers: PosInt }).optional().describe("The Muster's pick of recruits."),
  drill: z.strictObject({ offers: PosInt, train: PosInt }).optional().describe("The Drill ground's pick of formations, or this many members trained."),
  formationOdds: z.array(z.strictObject({ common: z.number().min(0), rare: z.number().min(0), legendary: z.number().min(0) })).min(1).optional().describe("By act: the rarity a formation offer rolls."),
  map: z.strictObject({
    floors: PosInt,
    width: PosInt,
    paths: PosInt,
    fixed: z.record(z.string(), RogueNodeKind).describe("Floor number to the kind every node on it has."),
    odds: z.record(z.string(), z.number().min(0)).describe("Room odds for the other floors, by kind."),
    lateFrom: PosInt.describe("Elites and campfires only from this floor."),
    ensure: z.record(z.string(), z.number().int().min(0)).optional().describe("Rooms of a kind an act has at least, where the rules allow."),
    easyTo: PosInt.optional().describe("The easy pool's last floor (default 2)."),
    campPaths: Pct.optional().describe("Mid-act campfires are added until at least this share of the ways up pass one before the last floor."),
    ref: z.strictObject({ easy: PosInt, normal: PosInt, elite: PosInt }).optional().describe("Each pool's reference floor, where its fights' own knobs hold (default 1, 5, 6)."),
  }),
  gold: z.strictObject({ fight: IntRange, elite: IntRange, boss: IntRange, perAct: z.number().int().min(0) }),
  spoils: z.strictObject({ fight: Spoils, elite: Spoils, offRoster: Pct.describe("Share of offered gear (spoils, chests, events; not the shop or a trophy) rolled for classes not in the roster, where there is such a piece.") }),
  boon: z.strictObject({
    count: PosInt,
    seat: z.boolean().optional().describe("A seat at camp is among the options, while there's one to win."),
    mythic: z.array(PosInt).optional().describe("The acts whose opening boon (the boss's before them) offers a mythic in place of its legendary piece: one for a roster member's class (the party first) that the run doesn't hold, while one is left."),
  }),
  slots: z.strictObject({ weapon: z.number().min(0), armor: z.number().min(0), offhand: z.number().min(0), amulet: z.number().min(0) }).optional().describe("An offered piece's slot is rolled first, by these weights; then a class (the roster's, or one off it by `spoils.offRoster`), a kind it wears in that slot, the rarity, and a piece of that kind and rarity. Absent: every slot alike."),
  lesson: PosInt.optional().describe("Members a lesson (a captive's or a stranger's) trains, each once (default 3)."),
  treasure: z.strictObject({ rarity: RarityOdds, gold: IntRange, cage: Pct.optional().describe("Chance the chest is a cage: a recruit with a piece suited to it.") }),
  campfire: z.strictObject({
    hp: Pct, mp: Pct, revive: Pct,
    camp: Pct.optional().describe("The share of REST those standing at camp get, whatever the pick (default all)."),
    train: PosInt.optional().describe("Members TRAIN teaches or upgrades (default one)."),
    stranger: Pct.optional().describe("Chance a stranger at the fire asks to join."),
    auto: z.strictObject({ hp: Pct, mp: Pct, revive: Pct }).optional().describe("On arrival everyone recovers this (HP and MP, the fallen rise); then one pick, REST (`hp` and `mp` again, everyone) or TRAIN. Without it, one pick of REST, FOCUS, RAISE or TRAIN."),
  }),
  captive: z.strictObject({ chance: Pct, hp: Pct, people: z.array(Id) }).optional().describe("After a won fight with any of `people` in it, a captive this often (never two fights running), taken in at `hp`%, or a lesson."),
  prices: z.strictObject({
    common: z.number().int().min(0), uncommon: z.number().int().min(0), rare: z.number().int().min(0), legendary: z.number().int().min(0),
    recruit: z.number().int().min(0), formation: z.number().int().min(0), learn: z.number().int().min(0), upgrade: z.number().int().min(0),
    trainStep: z.number().int().min(0).optional().describe("A shop's training can be bought again in the same visit, each time this much dearer (learning and upgrading alike); without it, once each a visit."),
    supply: z.record(z.string(), z.number().int().min(0)), sell: Pct,
  }),
  shop: z.strictObject({ gear: RarityOdds.describe("How many pieces of each rarity."), legendaryByAct: z.array(z.number().int().min(0)).optional().describe("Legendary pieces a visit, by act (in place of gear.legendary)."), recruits: z.number().int().min(0), formations: z.number().int().min(0), supplies: z.number().int().min(0) }),
  supplies: z.strictObject({ potion: z.strictObject({ hp: Pct }), tonic: z.strictObject({ mp: Pct }), phoenix: z.strictObject({ revive: Pct }) }),
  /** After every won fight the party picks one of these; a kind whose slot in the bag is full isn't offered. */
  drops: z.array(SupplyId).optional().describe("Offered as a choice of one after every won fight."),
  bag: z.strictObject({ potion: z.number().int().min(0), tonic: z.number().int().min(0), phoenix: z.number().int().min(0) }).describe("Supplies carried at most, a slot a kind."),
  knobs: z.array(z.strictObject({ mob: z.number(), step: z.number(), early: z.number().optional().describe("The climb a floor below a pool's reference floor (default `step`)."), elite: z.number(), boss: z.number() })).min(1).describe("Per act, added to each fight's own knob (HP +k %, damage +k/2.5 %): regular fights, the rise per floor from each pool's reference floor, elites, the boss."),
  heat: z.strictObject({ per: z.number(), max: z.number().int().min(0) }),
  shape: z.record(z.string(), z.strictObject({ hp: z.number(), power: z.number() })).optional().describe("By tier (fight, elite, boss): HP % and damage % added to every foe on top of the knob, so a tier's fights can be longer and softer at the same cost."),
  growFrom: PosInt.describe("From this floor, each pack of two or more may gain one more foe."),
  levelGold: z.number().int().min(0).optional().describe("A level-up can be taken as this much gold instead."),
  neverGrow: z.array(Id).optional().describe("Enemies whose packs never grow (Snakes: their Bleed doesn't shrink with a fight's knob)."),
});
export type RogueConfigT = z.infer<typeof RogueConfig>;

export const RogueFight = z.strictObject({ id: Id, name: Text, enemies: z.array(Id).min(1).max(8), knob: z.number().optional().describe("Its own knob, set by the rogue calibration: what makes it cost what its tier should.") });
export type RogueFightT = z.infer<typeof RogueFight>;
export const RogueRegion = z.strictObject({
  id: Id,
  name: Text,
  text: Text,
  act: PosInt,
  knob: z.strictObject({ mob: z.number(), elite: z.number(), boss: z.number() }).describe("The region's own adjustment to its act's knobs."),
  easy: z.array(RogueFight).min(1),
  normal: z.array(RogueFight).min(1),
  elite: z.array(RogueFight).min(1),
  bosses: z.array(RogueFight).min(1),
});
export type RogueRegionT = z.infer<typeof RogueRegion>;

export type EventOpT =
  | { op: "gold"; amount: number }
  | { op: "hp"; pct: number; one?: boolean }
  | { op: "mp"; pct: number }
  | { op: "gear"; rarity: RarityT }
  | { op: "recruit"; hp?: number; known?: number; gear?: RarityT; healer?: boolean }
  | { op: "learn" }
  | { op: "upgrade" }
  | { op: "temper"; from?: RarityT[]; risk?: number }
  | { op: "revive"; pct: number }
  | { op: "formation"; rarity?: RarityT }
  | { op: "seat" }
  | { op: "train"; n: number }
  | { op: "muster"; n: number; known?: number; gear?: RarityT }
  | { op: "trade" }
  | { op: "supply"; id: SupplyIdT }
  | { op: "fight"; tier: "normal" | "elite" }
  | { op: "camp" }
  | { op: "chance"; pct: number; then: EventOpT[]; else: EventOpT[] };
export const EventOp: z.ZodType<EventOpT> = z.lazy(() =>
  z.union([
    z.strictObject({ op: z.literal("gold"), amount: z.number().int() }),
    z.strictObject({ op: z.literal("hp"), pct: z.number(), one: z.boolean().optional() }),
    z.strictObject({ op: z.literal("mp"), pct: z.number() }),
    z.strictObject({ op: z.literal("gear"), rarity: Rarity }),
    z.strictObject({ op: z.literal("recruit"), hp: Pct.optional(), known: z.number().int().min(1).max(3).optional(), gear: Rarity.optional(), healer: z.boolean().optional().describe("A class that heals or raises others.") }),
    z.strictObject({ op: z.literal("learn") }),
    z.strictObject({ op: z.literal("upgrade") }),
    z.strictObject({ op: z.literal("temper"), from: z.array(Rarity).optional().describe("The rarities a piece can be tempered from (default common, uncommon). A piece becomes a piece of the next rarity of its slot and kind that its wearer can wear (a rare one a legendary)."), risk: Pct.optional().describe("Chance the piece cracks and is lost instead.") }),
    z.strictObject({ op: z.literal("revive"), pct: Pct }).describe("Every fallen member rises at this share of HP."),
    z.strictObject({ op: z.literal("formation"), rarity: Rarity.optional() }),
    z.strictObject({ op: z.literal("seat") }),
    z.strictObject({ op: z.literal("train"), n: PosInt }).describe("n members (three, as every training opportunity) each take one training: learn an ability, or an ability's or the passive's power step or version."),
    z.strictObject({ op: z.literal("muster"), n: PosInt, known: z.number().int().min(1).max(3).optional(), gear: Rarity.optional().describe("Each carries a piece of this rarity suited to it.") }),
    z.strictObject({ op: z.literal("trade") }),
    z.strictObject({ op: z.literal("supply"), id: SupplyId }),
    z.strictObject({ op: z.literal("fight"), tier: z.enum(["normal", "elite"]) }),
    z.strictObject({ op: z.literal("camp") }),
    z.strictObject({ op: z.literal("chance"), pct: Pct, then: z.array(EventOp), else: z.array(EventOp) }),
  ]),
);
const EventOption = z.strictObject({ id: Id, label: Text, text: Text, gold: z.number().int().min(0).optional().describe("Gold it costs; it can't be picked without."), do: z.array(EventOp) });
export const RogueEvent = z.strictObject({
  id: Id,
  name: Text,
  text: Text,
  options: z.array(EventOption).min(1),
  variants: z.array(z.strictObject({ text: Text.optional(), options: z.array(EventOption).min(1) })).optional().describe("Versions of the event; one is rolled on entering, its text and options in place of the first's."),
});
export type RogueEventT = z.infer<typeof RogueEvent>;

export const Rogue = z.strictObject({
  config: RogueConfig,
  regions: z.array(RogueRegion).min(1),
  events: z.array(RogueEvent).min(1),
});
export type RogueT = z.infer<typeof Rogue>;

// ─────────────────────────────────────────────────────────────────────────────
// Upgrades: each ability and passive's power step and two versions
// ─────────────────────────────────────────────────────────────────────────────

export const UpgradeVersion = z.strictObject({ name: Text, text: Text.describe("Its card, as the training screen reads it.") });

export const Upgrade = z
  .strictObject({
    id: Id.describe("The ability, or the passive status, it upgrades. Its five forms are content under fixed ids: <id>__p, <id>__a, <id>__b, <id>__ap and <id>__bp (UPGRADE_FORMS)."),
    class: Id.describe("The class it belongs to."),
    kind: z.enum(["ability", "passive"]).describe("ability: each form is an ability of the class, in pack.abilities. passive: each form is a status, in pack.statuses, that takes the passive status's place."),
    power: Text.describe("The power step's card."),
    a: UpgradeVersion.describe("Version A."),
    b: UpgradeVersion.describe("Version B."),
    note: Note.optional(),
  })
  .describe("Training is learning an ability, taking an ability's or the passive's power step, or taking its version A or B; the power step and a version are two trainings, in either order, and the version and its power step together are the `ap` or `bp` form.");
export type UpgradeT = z.infer<typeof Upgrade>;
