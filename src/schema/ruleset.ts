/** The design constraints the validator reads, the ruleset (draw, enrage, the opening, control resistance) and the registries. */
import * as z from "zod";
import { Fraction, Id, IntRange, Note, PosInt, Text, Ticks } from "./primitives.js";
import { Weapon } from "./actions.js";

// ─────────────────────────────────────────────────────────────────────────────
// Design constraints: the slice's shape, as data the validator reads
// ─────────────────────────────────────────────────────────────────────────────

export const Design = z.strictObject({
  note: Note.optional(),
  formationPositions: PosInt,
  partySize: IntRange,
  abilitiesPerClass: PosInt,
  abilitiesEquipped: PosInt,
  perkPicksPerRun: IntRange,
  perkPoolSize: IntRange,
  perkOptionsPerPick: PosInt,
  complete: z.strictObject({ classes: IntRange }).describe("Totals checked only with --complete, for a full content set."),
}).describe("Target numbers the validator enforces.");

// ─────────────────────────────────────────────────────────────────────────────
// Ruleset and registries
// ─────────────────────────────────────────────────────────────────────────────

/** An enemy's rank. */
export const Rank = z.enum(["minion", "elite", "boss"]);

/** Bosses resist repeated control, the one exception to universal statuses. */
export const Control = z
  .strictObject({
    ranks: z.array(Rank).min(1).describe("Enemies of these ranks resist control."),
    statuses: z.array(Id).min(1).describe("The control statuses: each one that lands adds a hidden stack (a Chill shatter's Stun included). One that doesn't land (Fizzle, an immunity) adds nothing."),
    resist: z
      .strictObject({ at: PosInt, pct: z.number().gt(0).lt(100) })
      .describe("From `at` stacks, they land for pct % of their own length, and the battle text says RESISTED."),
    cap: PosInt.describe("The most stacks. At the cap they don't land at all, the battle text says IMMUNE, and they add no stack."),
    drain: z.number().positive().describe("One stack drains away this many ticks after the last stack was gained or lost, so a party that isn't chaining control sits near zero."),
  })
  .describe("Control resistance: hidden stacks, no icon.");
export type ControlT = z.infer<typeof Control>;

export const PerkOffer = z.strictObject({
  options: PosInt,
  premiumChance: Fraction.describe("Chance each offered slot rolls a premium perk, if one is available."),
  repeatPicked: z.boolean().describe("Can a perk already picked this run be offered again?"),
  offerInapplicable: z.boolean().describe("Can a perk no party unit can receive be offered?"),
});

export const Ruleset = z.strictObject({
  basicRecovery: z.number().gt(0).max(1).describe("A basic attack's recovery, as a share of the weapon's base cooldown. Sets the Attack Speed ceiling."),
  abilityCast: Ticks.describe("An ability's cast time unless it states one."),
  abilityRecovery: Ticks.describe("An ability's recovery unless it states one: about a sword's."),
  armorRatio: z.number().min(0).describe("Each physical hit loses armorRatio × the target's Defense, as a flat amount."),
  armorFloor: z.number().min(0).max(100).optional().describe("Defense can't take a physical hit below this % of its size. Absent or 0: enough Defense blanks a hit. Ignored when armorK is set."),
  armorK: z.number().min(0).optional().describe("Defense by the Path of Exile formula: a physical hit deals hit² ÷ (hit + armorK × Defense), so Defense is nearly linear against big hits and never blanks one. Replaces armorRatio and armorFloor when above 0; absent or 0, the flat cut."),
  taken: z.strictObject({ floor: z.number(), cap: z.number() }).describe("Bounds on a unit's total damage-taken modifier, in percent."),
  unarmed: Weapon.describe("The basic attack of a unit with no weapon."),
  maxEnemies: PosInt.describe("Most living units on the enemy side, summons included."),
  enrage: z
    .strictObject({ after: Ticks, every: Ticks.min(1), pct: z.number().min(0) })
    .optional()
    .describe("A fight that runs past `after` ticks: every unit, on both sides, deals pct % more damage with hits and reactions, and pct more again every `every` ticks, so no fight stalls. Absent: fights run to the safety stop."),
  opening: z
    .strictObject({
      min: z.number().min(0).max(1),
      max: z.number().min(0).max(1),
      slots: z.array(z.number().min(0)).optional().describe("A party unit's abilities start this many ticks charged, by the order they're slotted in (first, second, third), in place of the roll: the order is the player's to choose. Its basic attack still rolls."),
      slotShares: z.array(z.number().min(0).max(1)).optional().describe("As slots, but as a share of each ability's own cooldown (0.75 is three quarters charged), so a slow ability's head start is long too. Wins over slots when both are set."),
    })
    .optional()
    .describe("At fight start each action is already partly charged: it's first ready after a share of its cooldown, rolled between min and max on the unit's dice for each action (but see slots). Absent: every action starts a fight on its full cooldown."),
  draw: z
    .strictObject({ centre: z.number().positive(), k: z.number().positive(), max: z.number().min(1) })
    .optional()
    .describe("Foes pick in proportion to draw, not Aggro. With d how far a unit's Aggro is from `centre`: above it, draw = centre × (k + max × d) ÷ (k + d); below it, centre × (k + d) ÷ (k + max × d). An ordinary unit draws `centre`; none draws more than `max` times that or less than 1 ÷ max; +d and −d cancel. `k` sets how much the first steps count. Absent: picks weighted by Aggro itself. With `partyDraw`, this curve is for enemy units only (the party's picks among its foes)."),
  partyDraw: z
    .strictObject({
      centre: z.number().positive().describe("The Aggro of an ordinary unit, which draws this much."),
      double: z.number().positive().describe("Every this many points of Aggro above `centre` doubles a unit's draw, and every this many below halves it; between two doublings it climbs evenly."),
      floor: z.number().positive().describe("Aggro below this counts as this."),
      cap: z.number().positive().describe("Aggro above this counts as this."),
    })
    .optional()
    .describe("How strongly a party unit draws foes' picks, in place of `draw`'s curve, which flattens at a few times an ordinary unit's. Aggro held between `floor` and `cap`; draw = centre × 2^n × (1 + f), with n whole doublings from `centre` and f the share of the next one. An Aggro-stacked unit can take most of the picks on its own. Absent: party units use `draw` too."),
  stagger: Ticks.optional().describe("Copies of the same enemy start a fight this many ticks apart, one after another, so identical foes don't act in lockstep. Absent or 0: they start together."),
  lostCast: z
    .enum(["retry", "cooldown"])
    .optional()
    .describe("An action interrupted in its wind-up, or whose targets are gone when it resolves. retry (the default): no MP, no cooldown, so it can start again at once. cooldown: no MP, but an interrupted action goes on cooldown, as a cast that fizzles for MP does, and one that found no target costs the unit its recovery."),
  control: Control.optional().describe("Control resistance on bosses. Absent: none."),
  run: z.strictObject({
    defeatedUnits: z.enum(["stay_down"]).describe("Knocked-out units stay down between fights until something revives them."),
    restore: z
      .strictObject({ hp: z.number().min(0).max(100).optional(), mp: z.number().min(0).max(100).optional() })
      .optional()
      .describe("After a won fight, every standing member regains these % of its max HP and of its max MP. Absent or 0: nothing restores them between fights (the core set's rule)."),
    perkOffer: PerkOffer,
  }),
});

export const StatDef = z.strictObject({
  id: Id,
  name: Text,
  kind: z.enum(["amount", "points"]).describe("amount: takes flat or percent changes. points: already in points or percent; flat changes only."),
  default: z.number(),
  floor: z.number().optional(),
  cap: z.number().optional(),
  brings: Id.optional().describe("A status the unit holds while the stat is above 0, for behaviour beyond hit resolution, targeting and timing."),
  note: Note.optional(),
});
