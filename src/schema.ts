/**
 * Memory Dungeon Game: content schema, v0.3 (design plan step 1, second revision).
 *
 * One data format for everything the engine runs on. The guiding rule is that
 * no game rule lives in prose: every mechanic is either
 *   - a value in a registry (stats, statuses, damage types, behaviours...),
 *   - a formula written in the Expr language, or
 *   - a Rule or Active built from the closed set of engine primitives below.
 *
 * Text fields are split in two kinds:
 *   - `name`, `text`, `word`, `forms`: player-facing. The engine never reads them.
 *   - `note`: designer-only. Never shown, never read by the engine.
 *
 * Verbs and keyholes are design vocabulary. The engine never reads them; they are
 * patterns over the numerical systems (stats, statuses, damage types, flags,
 * targeting) that the validator checks against the data.
 */
import { z } from "zod";

export const SCHEMA_VERSION = "0.3" as const;

// ─────────────────────────────────────────────────────────────────────────────
// Primitives
// ─────────────────────────────────────────────────────────────────────────────

export const Id = z
  .string()
  .regex(/^[a-z][a-z0-9_]*$/, { message: "ids are lower_snake_case and start with a letter" });
export const Text = z.string().min(1).describe("Player-facing text. The engine never reads it.");
export const Note = z
  .string()
  .min(1)
  .describe("Designer note. Never shown to players and never read by the engine.");
const Fraction = z.number().min(0).max(1);
const PosInt = z.number().int().min(1);
const IntRange = z.tuple([z.number().int().min(0), z.number().int().min(0)]);

/** The reserved action reference meaning "this unit's own basic action". */
export const BASIC = "basic" as const;

function keys<T extends Record<string, string>>(o: T) {
  return Object.keys(o) as [keyof T & string, ...(keyof T & string)[]];
}

// ─────────────────────────────────────────────────────────────────────────────
// Engine primitives: closed sets. Each needs engine code, so adding one is a
// schema version bump plus an engine change, never a prose rule.
// The descriptions here are the contract and feed PRIMITIVES.md.
// ─────────────────────────────────────────────────────────────────────────────

export const TURN = [
  "Each turn, a unit goes down its behaviour's modes (or ruleset.defaultModes) and takes the first mode whose `when` holds and that produces an action. If none does, it waits.",
  "A unit's statuses on itself are its states: a mode's `when` can test them with hasStatus, so a boss can switch behaviour once it is frenzied.",
  "Active abilities come from equipped abilities, equipped gear, and an enemy's `actives`. Each has a cooldown counter. Using it sets the counter to `cooldown`; the counter drops by 1 at the end of each of the unit's own turns; it is ready at 0. Each fight it starts at `initialCooldown` (default 0) when ruleset.run.cooldownsResetEachFight, otherwise it carries over.",
  "The basic action has no target of its own: the unit's behaviour (or ruleset.defaultBehaviour) picks it, and modify_action can change that. Every other action carries its own target.",
  "There is no battlefield geometry. Any unit can target any unit; `weighted` picks follow ruleset.targeting.weightStat (aggro), which is how a formation slot makes a unit easier or harder to target.",
  "A status's turns count down at the end of each of its bearer's turns. A status applied during its bearer's turn_end starts counting from the next one.",
  "Damage dealt by a status's own rules counts the unit that applied the status as the attacker in combat formulas.",
] as const;

export const MODE_USE = {
  ability:
    "Use the ready active ability with the highest `priority` (ties: equipped abilities in order, then gear in slot order) whose `useWhen` holds and whose action finds a target. If there is none, go to the next mode.",
  basic: "Use the basic action on the behaviour's basicTarget, as modified. If there is no valid target, go to the next mode.",
} as const;
export const ModeUse = z.enum(keys(MODE_USE));

export const SUBJECTS = {
  self: "The unit that owns the rule: the gear's wearer, the ability's holder, the unit in a formation slot (or every unit, for a formation's party-wide rules), a perk's recipient, or a status's bearer.",
  target: "The unit an effect is being applied to right now; in modify_action, the target of the action being modified.",
  event_source: "Triggered rules only: who caused the event (the attacker, healer or applier).",
  event_target: "Triggered rules only: who received the event (the defender or recipient).",
  candidate: "Inside a selector's where/prefer/by: the unit being considered.",
  attacker: "Combat formulas only: the unit dealing damage.",
  defender: "Combat formulas only: the unit receiving damage.",
} as const;
export const Subject = z.enum(keys(SUBJECTS));
export type Subject = z.infer<typeof Subject>;

export const EVENTS = {
  fight_start: "A fight begins. Actor: every unit.",
  fight_end: "The party wins a fight. Actor: every surviving unit.",
  round_start: "A round begins. Actor: every unit.",
  turn_start: "A unit's turn begins, before it acts. Actor: that unit.",
  turn_end: "A unit's turn ends. Actor: that unit.",
  attack_hit: "An attack lands. Actor: the attacker. Has `amount`.",
  attack_missed: "An attack fails its hit roll. Actor: the attacker.",
  crit: "An attack crits. Actor: the attacker. Has `amount`.",
  kill: "An attack defeats its target. Actor: the attacker.",
  evade: "An attack against the actor fails its hit roll. Actor: the defender.",
  block: "The actor blocks an attack. Actor: the defender.",
  damaged: "The actor takes damage from any source. Actor: the receiver. Has `amount`.",
  healed: "The actor is healed. Actor: the receiver. Has `amount`.",
  hp_below: "The actor's HP drops below the trigger's `below` fraction of its max (fires once per crossing). Actor: that unit.",
  defeated: "The actor is defeated. Actor: the defeated unit.",
  status_applied: "A status is applied to the actor. Actor: the receiver.",
} as const;
export const EventType = z.enum(keys(EVENTS));
export type EventType = z.infer<typeof EventType>;
/** Events whose payload carries an `amount` (readable as {var: "amount"}). */
export const EVENTS_WITH_AMOUNT: EventType[] = ["attack_hit", "crit", "damaged", "healed"];
/** Events caused by an action, so a trigger's `action` filter can test them. */
export const EVENTS_WITH_ACTION: EventType[] = ["attack_hit", "attack_missed", "crit", "kill", "evade", "block", "damaged"];

export const WHO = {
  self: "The event's actor is the rule's owner. The default.",
  ally: "The actor is another unit on the owner's side.",
  self_or_ally: "The actor is the owner or another unit on its side.",
  enemy: "The actor is on the other side.",
  anyone: "Any actor.",
} as const;
export const Who = z.enum(keys(WHO));

export const VIA = {
  basic: "The unit's basic action, used on its turn.",
  ability: "An active ability.",
  reaction: "An action performed by an effect, such as a counterattack or an extra attack.",
} as const;
export const Via = z.enum(keys(VIA));

export const FLAGS = {
  acts_first: "Acts before every unit without this flag, whatever the turn order says.",
  draws_support:
    "When a selector on this unit's side picks a single unit (count 1, any pick but all) from allies or allies_and_self, it picks this unit if it is a candidate.",
  skip_turn: "Loses its turn.",
  untargetable: "Enemy selectors can't pick it.",
  cannot_evade: "Attacks against it skip the hit roll.",
  cannot_block: "Attacks against it skip the block roll.",
} as const;
export const Flag = z.enum(keys(FLAGS));
export type Flag = z.infer<typeof Flag>;

export const SELECTOR_FROM = {
  self: "The rule's owner.",
  allies: "Other living units on the owner's side.",
  allies_and_self: "Every living unit on the owner's side.",
  enemies: "Living units on the other side.",
  everyone: "Every living unit.",
  event_source: "Triggered rules only: the event's source.",
  event_target: "Triggered rules only: the event's target.",
  action_target: "Action effects and modify_action only: every unit the action's target picked.",
  action_target_allies: "Action effects and modify_action only: units on the same side as the action's target, other than the units it picked (for splash and cleave).",
  event_target_allies: "Triggered rules only: units on the same side as the event's target, other than it.",
} as const;
export const SelectorFrom = z.enum(keys(SELECTOR_FROM));
export type SelectorFrom = z.infer<typeof SelectorFrom>;

export const PICKS = {
  all: "Every unit that passes `where`. The default.",
  random: "`count` units at random (default 1).",
  weighted: "`count` units at random, weighted by ruleset.targeting.weightStat (aggro).",
  lowest: "`count` units with the lowest `by` (ties random).",
  highest: "`count` units with the highest `by` (ties random).",
} as const;
export const Pick = z.enum(keys(PICKS));

export const VARS = {
  raw: "Damage before mitigation. Only inside a damage type's mitigation formula.",
  amount: "The triggering event's amount. Only in triggered rules on events that have one.",
  round: "The current round, starting at 1.",
} as const;
export const Var = z.enum(keys(VARS));
export type Var = z.infer<typeof Var>;

export const COMPARISONS = { lt: "<", lte: "≤", eq: "=", gte: "≥", gt: ">" } as const;
export const Comparison = z.enum(keys(COMPARISONS));

export const STATUS_ON = {
  self: "A unit's own state: stacks it builds, stances, rages. Only its bearer applies it, so apply_status must target self.",
  others: "Applied to other units, such as bleed or a stun. Never applied to self.",
  any: "Either.",
} as const;
export const StatusOn = z.enum(keys(STATUS_ON));

export const Mode = z.enum(["add", "mul"]).describe("add: +value. mul: ×value. Stacking order is ruleset.modifierStacking.");

export const PIPELINE = {
  hit: "Roll formulas.hitChance; on failure the attack misses (attack_missed + evade).",
  crit: "Roll formulas.critChance; on success multiply by formulas.critMultiplier (crit).",
  block: "Roll formulas.blockChance; on success multiply by formulas.blockMultiplier (block).",
  scale: "Multiply by formulas.damageScale (e.g. the attacker's damage dealt × the defender's damage taken).",
  mitigate: "Apply the damage type's mitigation formula, with `raw` as the incoming damage.",
  floor: "Round down, then raise to formulas.minDamage.",
} as const;
export const PipelineStep = z.enum(keys(PIPELINE));

// ─────────────────────────────────────────────────────────────────────────────
// Rule language: expressions, conditions, selectors (mutually recursive)
// ─────────────────────────────────────────────────────────────────────────────

export type Expr =
  | number
  | { stat: string; of?: Subject }
  | { stacks: string; of?: Subject }
  | { var: Var }
  | { count: Selector }
  | { add: Expr[] }
  | { mul: Expr[] }
  | { min: Expr[] }
  | { max: Expr[] }
  | { sub: [Expr, Expr] }
  | { div: [Expr, Expr] }
  | { mod: [Expr, Expr] }
  | { clamp: [Expr, Expr, Expr] };

export type Cmp = z.infer<typeof Comparison>;
export type Condition =
  | { all: Condition[] }
  | { any: Condition[] }
  | { not: Condition }
  | { hpBelow: number; of?: Subject }
  | { hpAtLeast: number; of?: Subject }
  | { hasStatus: string; of?: Subject }
  | { isClass: string[]; of?: Subject }
  | { isSpec: string[]; of?: Subject }
  | { hasAbility: string; of?: Subject }
  | { round: { is: Cmp; n: number } }
  | { alive: { side: "allies" | "enemies"; is: Cmp; n: number } }
  | { compare: [Expr, Cmp, Expr] };

export type Selector = {
  from: SelectorFrom;
  where?: Condition;
  prefer?: Condition;
  pick?: z.infer<typeof Pick>;
  by?: Expr;
  count?: number;
};

export const Expr: z.ZodType<Expr> = z
  .lazy(() =>
    z.union([
      z.number(),
      z.strictObject({ stat: Id, of: Subject.optional() }),
      z.strictObject({ stacks: Id, of: Subject.optional() }),
      z.strictObject({ var: Var }),
      z.strictObject({ count: Selector }),
      z.strictObject({ add: z.array(Expr).min(2) }),
      z.strictObject({ mul: z.array(Expr).min(2) }),
      z.strictObject({ min: z.array(Expr).min(2) }),
      z.strictObject({ max: z.array(Expr).min(2) }),
      z.strictObject({ sub: z.tuple([Expr, Expr]) }),
      z.strictObject({ div: z.tuple([Expr, Expr]) }),
      z.strictObject({ mod: z.tuple([Expr, Expr]) }),
      z.strictObject({ clamp: z.tuple([Expr, Expr, Expr]) }),
    ]),
  )
  .meta({ id: "Expr" });

export const Condition: z.ZodType<Condition> = z
  .lazy(() =>
    z.union([
      z.strictObject({ all: z.array(Condition).min(1) }),
      z.strictObject({ any: z.array(Condition).min(1) }),
      z.strictObject({ not: Condition }),
      z.strictObject({ hpBelow: Fraction, of: Subject.optional() }),
      z.strictObject({ hpAtLeast: Fraction, of: Subject.optional() }),
      z.strictObject({ hasStatus: Id, of: Subject.optional() }),
      z.strictObject({ isClass: z.array(Id).min(1), of: Subject.optional() }),
      z.strictObject({ isSpec: z.array(Id).min(1), of: Subject.optional() }),
      z.strictObject({ hasAbility: Id, of: Subject.optional() }),
      z.strictObject({ round: z.strictObject({ is: Comparison, n: z.number().int().min(1) }) }),
      z.strictObject({
        alive: z.strictObject({ side: z.enum(["allies", "enemies"]), is: Comparison, n: z.number().int().min(0) }),
      }),
      z.strictObject({ compare: z.tuple([Expr, Comparison, Expr]) }),
    ]),
  )
  .meta({ id: "Condition" });

export const Selector: z.ZodType<Selector> = z
  .lazy(() =>
    z.strictObject({
      from: SelectorFrom,
      where: Condition.optional().describe("Filter. `candidate` is the unit being considered."),
      prefer: Condition.optional().describe("Pick from units passing this first; fall back to the rest if none do."),
      pick: Pick.optional(),
      by: Expr.optional().describe("Required for pick lowest/highest. `candidate` is in scope."),
      count: PosInt.optional(),
    }),
  )
  .meta({ id: "Selector" });

// ─────────────────────────────────────────────────────────────────────────────
// Effects, rules and actives
// ─────────────────────────────────────────────────────────────────────────────

const ActionRef = Id.describe(`An action id, or "${BASIC}" for the unit's own basic action.`);

const HitRules = z.strictObject({
  canMiss: z.boolean().optional(),
  canCrit: z.boolean().optional(),
  canBlock: z.boolean().optional(),
});

/** Effects that happen once: in actions, triggered rules and between fights. */
export const InstantEffect = z
  .discriminatedUnion("op", [
    z
      .strictObject({
        op: z.literal("damage"),
        type: Id.describe("A damageTypes id."),
        amount: Expr,
        target: Selector,
        hit: HitRules.optional().describe("Which damagePipeline rolls apply. All default to true."),
      })
      .describe(
        "Deals `amount` of `type` damage to each target through ruleset.damagePipeline (`hit` switches the rolls off). Damage from an action is an attack and fires attack_hit, attack_missed, evade, block, crit and kill; damage from rules and statuses fires only damaged and defeated.",
      ),
    z
      .strictObject({ op: z.literal("heal"), amount: Expr, target: Selector })
      .describe("Restores `amount` HP to each target, up to its cap. Fires healed."),
    z
      .strictObject({
        op: z.literal("apply_status"),
        status: Id,
        target: Selector,
        turns: PosInt.optional().describe("Defaults to the status's defaultTurns; if neither, it lasts the fight."),
        stacks: PosInt.optional(),
      })
      .describe("Applies `status` to each target under its stacking rule. Fires status_applied."),
    z
      .strictObject({
        op: z.literal("remove_status"),
        status: Id,
        target: Selector,
        stacks: PosInt.optional().describe("Stacks to remove. Absent: all of them."),
      })
      .describe("Removes stacks of `status` from each target. With self-built stacks, this is how a unit spends them."),
    z
      .strictObject({
        op: z.literal("buff"),
        stat: Id,
        mode: Mode,
        value: z.number(),
        target: Selector,
        turns: PosInt.optional().describe("Turns of the target. Absent: until the fight ends."),
      })
      .describe("Temporarily changes a stat on each target."),
    z
      .strictObject({
        op: z.literal("perform_action"),
        action: ActionRef,
        target: Selector.optional().describe("Overrides the action's target (for basic: the behaviour's basicTarget)."),
      })
      .describe("The owner uses an action at once, outside its turn (via reaction). Its damage is an attack."),
    z
      .strictObject({
        op: z.literal("adjust"),
        stat: Id.describe("A resource stat other than the defeat stat."),
        amount: Expr.describe("Negative to spend, positive to restore."),
        target: Selector,
      })
      .describe("Changes a resource (not HP) on each target by `amount`, clamped between the stat's min and its cap."),
    z
      .strictObject({ op: z.literal("grant_flag"), flag: Flag, target: Selector, turns: PosInt })
      .describe("Gives each target a flag for `turns` of its turns."),
    z
      .strictObject({
        op: z.literal("summon"),
        enemy: Id,
        count: PosInt.optional(),
      })
      .describe("Adds `count` (default 1) copies of `enemy` to the owner's side, up to ruleset.maxEnemies."),
  ])
  .meta({ id: "InstantEffect" });
export type InstantEffect = z.infer<typeof InstantEffect>;

/** Effects that hold while their source is active: passive rules only. They always act on `self`. */
export const PassiveEffect = z
  .discriminatedUnion("op", [
    z
      .strictObject({
        op: z.literal("stat"),
        stat: Id,
        mode: Mode,
        value: z.union([z.number(), Expr]).describe("A number, or an expression (e.g. per stack of a status). Expressions may not read stats."),
      })
      .describe("Changes one of self's stats while the source is active."),
    z.strictObject({ op: z.literal("flag"), flag: Flag }).describe("Gives self a flag while the source is active."),
    z
      .strictObject({
        op: z.literal("modify_action"),
        action: ActionRef,
        if: Condition.optional().describe("Checked per use; `target` is the action's target."),
        target: Selector.optional().describe("Replaces how the action picks its target."),
        hits: PosInt.optional(),
        amountMul: z.number().positive().optional().describe("Multiplies every damage and heal amount in the action."),
        addEffects: z.array(InstantEffect).optional(),
      })
      .describe("Changes every use of an action by self, however it's used: retarget it, repeat it (`hits`), scale it, or add effects that run after its own."),
  ])
  .meta({ id: "PassiveEffect" });
export type PassiveEffect = z.infer<typeof PassiveEffect>;

export const ActionFilter = z.strictObject({
  via: z.array(Via).min(1).describe("How the action was used."),
});

export const Trigger = z.strictObject({
  on: EventType,
  who: Who.optional().describe("Whose event this is, relative to the owner. Default self."),
  below: Fraction.optional().describe("hp_below only: the threshold fraction of max HP."),
  action: ActionFilter.optional().describe("Only events caused by an action that matches."),
});

export const Limit = z.strictObject({
  times: PosInt,
  per: z.enum(["turn", "round", "fight", "run"]),
});

export const Rule = z
  .discriminatedUnion("kind", [
    z.strictObject({
      id: Id,
      kind: z.literal("passive"),
      if: Condition.optional().describe("Re-checked continuously."),
      do: z.array(PassiveEffect).min(1),
      note: Note.optional(),
    }),
    z.strictObject({
      id: Id,
      kind: z.literal("triggered"),
      when: Trigger,
      if: Condition.optional(),
      chance: Fraction.optional(),
      limit: Limit.optional(),
      do: z.array(InstantEffect).min(1),
      note: Note.optional(),
    }),
  ])
  .meta({ id: "Rule" });
export type Rule = z.infer<typeof Rule>;

export const Active = z
  .strictObject({
    action: Id.describe("The action used. It must carry its own target."),
    cooldown: z.number().int().min(0).describe("Own turns before it's ready again after use."),
    initialCooldown: z.number().int().min(0).optional().describe("Own turns before first use each fight. Default 0."),
    useWhen: Condition.optional().describe("Extra condition for using it, on top of the action finding a target."),
    priority: z.number().int().optional().describe("Higher goes first when several are ready. Default 0."),
    limit: Limit.optional(),
  })
  .describe("An ability the unit uses on its own when it's ready. See TURN.");

export const StatBlock = z.record(Id, z.number()).describe("Stat id to value. Missing stats use the stat's default.");
export const StatMod = z.strictObject({
  stat: Id,
  mode: Mode,
  value: z.number(),
  if: Condition.optional().describe("The modifier holds only while this is true. `self` is the wearer."),
});

export const BehaviourMode = z.strictObject({
  when: Condition.optional(),
  use: ModeUse,
});

// ─────────────────────────────────────────────────────────────────────────────
// Design constraints: the concept spec's numbers, as data the validator reads
// ─────────────────────────────────────────────────────────────────────────────

export const Design = z.strictObject({
  note: Note.optional(),
  formationPositions: PosInt,
  partySize: IntRange,
  abilitiesPerSpec: PosInt,
  abilitiesEquipped: PosInt,
  perkPicksPerRun: IntRange,
  perkPoolSize: IntRange,
  perkOptionsPerPick: PosInt,
  keyholesPerBoss: IntRange,
  rules: z.strictObject({
    abilitiesAreBehaviour: z.boolean().describe("An ability must do more than change stats."),
    efficacyGearSimple: z.boolean().describe("Efficacy gear carries stat modifiers, each with at most one simple condition, and no rules or actives."),
  }),
  complete: z
    .strictObject({
      classes: IntRange,
      specsPerClass: IntRange,
      verbs: IntRange,
      maxStatusShare: Fraction.describe("Most specializations whose own kit applies a given status to other units, as a share of all specializations."),
    })
    .describe("Totals checked only with --complete, for a full content set."),
}).describe("Target numbers the validator enforces. Placeholders from the concept spec, which was bullish on them: expect them to change.");

// ─────────────────────────────────────────────────────────────────────────────
// Combat ruleset and registries
// ─────────────────────────────────────────────────────────────────────────────

export const PerkOffer = z.strictObject({
  options: PosInt,
  premiumChance: Fraction.describe("Chance each offered slot rolls a premium perk, if one is available."),
  repeatPicked: z.boolean().describe("Can a perk already picked this run be offered again?"),
  offerInapplicable: z.boolean().describe("Can a perk whose `requires` no party unit meets be offered?"),
});

export const Ruleset = z.strictObject({
  turnOrder: z.discriminatedUnion("kind", [
    z.strictObject({ kind: z.literal("by_stat"), stat: Id, ties: z.enum(["random", "party_first"]) }),
  ]),
  actionsPerTurn: PosInt,
  defaultModes: z.array(BehaviourMode).min(1).describe("Modes for behaviours that don't list their own."),
  defaultBehaviour: Id.describe("The behaviour for units that don't name one."),
  maxRounds: PosInt,
  onTimeout: z.enum(["loss"]),
  defeat: z.strictObject({ stat: Id, atOrBelow: z.number() }),
  damagePipeline: z.array(PipelineStep).min(1),
  formulas: z.strictObject({
    hitChance: Expr,
    critChance: Expr,
    critMultiplier: Expr,
    blockChance: Expr,
    blockMultiplier: Expr,
    damageScale: Expr,
    minDamage: z.number().min(0),
  }),
  modifierStacking: z.enum(["add_then_multiply", "multiply_then_add"]),
  targeting: z.strictObject({ weightStat: Id.describe("The stat `weighted` picks use: a unit's chance to be picked is proportional to it.") }),
  maxEnemies: PosInt.describe("Most enemies on the field at once, including summons."),
  run: z.strictObject({
    betweenFights: z.array(InstantEffect).describe("Applied to each living party unit after each won fight; `self` is that unit."),
    defeatedUnits: z.enum(["stay_down", "revive"]),
    statusesClearAtFightEnd: z.boolean(),
    cooldownsResetEachFight: z.boolean(),
    perkOffer: PerkOffer,
  }),
});

export const StatDef = z.strictObject({
  id: Id,
  name: Text,
  kind: z.enum(["attribute", "resource"]),
  default: z.number(),
  min: z.number().optional(),
  max: z.number().optional(),
  maxStat: Id.optional().describe("Resources only: the stat that caps it. A resource starts each run at its cap."),
  formula: Expr.optional().describe("Attributes only: a derived stat, computed from `self`'s other stats. Modifiers apply on top."),
  persistence: z.enum(["fight", "run"]).optional().describe("Resources only: refilled every fight, or carried across the run."),
  note: Note.optional(),
});

export const DamageType = z.strictObject({
  id: Id,
  name: Text,
  mitigation: Expr.describe("Final damage. `raw`, `attacker` and `defender` are in scope."),
});

export const StatusDef = z.strictObject({
  id: Id,
  name: Text.describe("The word shown in combat, e.g. BLEED."),
  text: Text,
  on: StatusOn,
  flags: z.array(Flag).optional(),
  stacking: z.enum(["refresh", "stack", "independent"]),
  maxStacks: PosInt.optional(),
  defaultTurns: PosInt.optional(),
  rules: z.array(Rule).optional().describe("Owned by the bearer: `self` is the unit carrying the status."),
  note: Note.optional(),
});

export const Signal = z
  .strictObject({
    op: z.string().optional(),
    damageType: Id.optional(),
    statusFlag: Flag.optional(),
    statusTicks: z.literal(true).optional(),
    statusDebuff: z.literal(true).optional(),
    stat: Id.optional(),
    sign: z.enum(["positive", "negative"]).optional(),
    flag: Flag.optional(),
    from: SelectorFrom.optional(),
    pick: Pick.optional(),
    multiHit: z.literal(true).optional(),
    amountUp: z.literal(true).optional(),
    performs: z.enum(["counter", "extra"]).optional(),
    trigger: EventType.optional(),
    conditionAlive: z.literal(true).optional(),
    statAtLeast: z.strictObject({ stat: Id, value: z.number() }).optional(),
  })
  .refine((o) => Object.keys(o).length > 0, { message: "a signal needs at least one field" })
  .describe("A pattern in an entity's data that shows this verb. Every listed field must match one fact.");

export const VerbDef = z.strictObject({
  id: Id,
  name: z.string().min(1).describe("Internal label. Verbs are never shown to players."),
  note: Note.describe("Definition, in terms of the numerical systems."),
  signals: z.array(Signal).min(1),
});

export const TraitDef = z.strictObject({
  id: Id,
  word: Text.describe("The fixed player-facing word or phrase. Its meaning never varies."),
  forms: z.array(Text).optional().describe("Inflections that count as the same word in enemy text."),
  verbs: z.array(Id).min(1).describe("The verb profile this word stands for."),
  note: Note.optional(),
});

export const SlotDef = z.strictObject({
  id: Id,
  name: Text,
  class: Id.optional().describe("Absent: a generic slot every unit has."),
});

export const Action = z
  .strictObject({
    id: Id,
    name: Text.describe("Shown in the combat log."),
    target: Selector.optional().describe("Required for every action except basic actions, which take their target from the unit's behaviour."),
    hits: PosInt.optional().describe("Times `do` repeats per use. Default 1."),
    do: z.array(InstantEffect).min(1),
    verbs: z.array(Id),
    note: Note.optional(),
  })
  .describe("Each use, the target is picked, then `do` runs once (× hits). Each effect picks its own units; action_target means every unit the target picked.");

export const Behaviour = z.strictObject({
  id: Id,
  note: Note.describe("Behaviours are never shown to players."),
  basicTarget: Selector.describe("How the basic action picks its target."),
  modes: z.array(BehaviourMode).min(1).optional().describe("Absent: ruleset.defaultModes. The last mode must have no `when`."),
});

// ─────────────────────────────────────────────────────────────────────────────
// Content
// ─────────────────────────────────────────────────────────────────────────────

const UnlockSource = z.enum(["starter", "unlock"]).describe("starter: owned from the start. unlock: a reward from a real-life quest.");

export const ClassDef = z.strictObject({
  id: Id,
  name: Text,
  text: Text,
  slots: z.array(Id).describe("Class-specific gear slots, on top of the generic ones."),
  stats: StatBlock.describe("Base stats every specialization of the class starts from."),
  note: Note.optional(),
});

export const Specialization = z
  .strictObject({
    id: Id,
    class: Id,
    name: Text.describe('Shown as "Class: Specialization", e.g. "Ranger: Duelist".'),
    text: Text,
    source: UnlockSource,
    stats: StatBlock.optional().describe("Overrides the class's base stats."),
    basicAction: Id,
    behaviour: Id.optional().describe("Absent: ruleset.defaultBehaviour."),
    abilities: z.array(Id),
    verbs: z.array(Id).describe("Verbs this unit can reach. Checked against its actions, behaviour, abilities and stats."),
    note: Note.optional(),
  })
  .describe("A unit. The player owns at most one of each and can field it once per party.");

export const Ability = z.strictObject({
  id: Id,
  class: Id.describe("Owning class. Only that class's specializations may list it."),
  name: Text,
  text: Text,
  rules: z.array(Rule).optional(),
  active: Active.optional(),
  verbs: z.array(Id),
  note: Note.optional(),
});

export const Gear = z.strictObject({
  id: Id,
  name: Text,
  text: Text,
  slot: Id,
  tier: z.enum(["efficacy", "powerful", "capstone"]),
  source: z.enum(["starter", "loot", "unlock"]),
  class: z.array(Id).optional().describe("Classes that can equip it. Absent: any class."),
  rank: PosInt.describe("Progression band, for gear curves and loot tables."),
  stats: z.array(StatMod),
  rules: z.array(Rule).optional(),
  active: Active.optional(),
  verbs: z.array(Id),
  note: Note.optional(),
});

export const Layout = z
  .strictObject({
    line: z.enum(["front", "middle", "back"]),
    column: z.number().int().min(0),
  })
  .describe("Where the slot is drawn. Cosmetic: the engine never reads it.");

export const Position = z
  .strictObject({
    id: Id,
    name: Text,
    text: Text.optional().describe("What the slot does, as the player sees it."),
    layout: Layout,
    rules: z.array(Rule).optional().describe("Apply to the unit in this slot; `self` is that unit. Absent: an empty slot."),
  })
  .describe("A formation slot: its own bespoke effects, open to any unit.");

export const Formation = z.strictObject({
  id: Id,
  name: Text,
  text: Text,
  source: UnlockSource,
  positions: z.array(Position),
  rules: z.array(Rule).optional().describe("Party-wide: apply to every unit in the formation."),
  verbs: z.array(Id),
  note: Note.optional(),
});

export const Keyhole = z
  .strictObject({
    id: Id,
    from: Id.describe("The enemy's own verb this keyhole comes from. It must show in the enemy's data."),
    mechanic: Id
      .optional()
      .describe("The enemy mechanic it comes from: one of its rule ids, an active's action, or its basic action. It must show `from`. Absent: base stats."),
    counteredBy: z.array(Id).min(1).describe("Verbs that work well against it. Any of them helps; none of them wins alone."),
    strongAgainst: z.array(Id).optional().describe("Verbs it blunts."),
    note: Note,
  })
  .describe("Design intent only, for difficulty prediction (step 11). Never shown to players, never read by the engine.");

export const Enemy = z.strictObject({
  id: Id,
  name: Text,
  text: Text.describe("Short description of how it behaves. Must use each trait's word, never say what beats it."),
  rank: z.enum(["minion", "elite", "boss"]),
  traits: z.array(Id),
  stats: StatBlock.describe("Hidden from the player."),
  basicAction: Id,
  behaviour: Id.optional().describe("Absent: ruleset.defaultBehaviour."),
  actives: z.array(Active).optional(),
  rules: z.array(Rule).optional(),
  keyholes: z.array(Keyhole).optional(),
  verbs: z.array(Id),
  note: Note.optional(),
});

export const PerkFamily = z.strictObject({ id: Id, name: Text, text: Text });

export const AbilityPatch = z.strictObject({
  op: z.literal("patch_ability"),
  ability: Id,
  rule: Id.optional().describe("The rule to patch. Absent: the ability's active."),
  addEffects: z.array(InstantEffect).optional().describe("Triggered rules only."),
  amountMul: z.number().positive().optional(),
  chanceAdd: z.number().optional().describe("Triggered rules only."),
  cooldownAdd: z.number().int().optional().describe("Actives only."),
});

export const Perk = z.strictObject({
  id: Id,
  name: Text,
  text: Text,
  family: Id,
  rarity: z.enum(["regular", "premium"]),
  upgradeOf: Id.optional().describe("Premium only: the regular perk this is a stronger version of."),
  requires: Condition.optional().describe("Applicable if at least one party unit (as `self`) meets it."),
  appliesTo: Condition.optional().describe("Which party units receive `rules` (as `self`). Absent: all."),
  rules: z.array(Rule).optional(),
  patches: z.array(AbilityPatch).optional().describe("For this run, change an ability on every unit that has it equipped."),
  verbs: z.array(Id),
  note: Note.optional(),
});

export const FightStage = z.strictObject({
  kind: z.literal("fight"),
  id: Id,
  boss: z.boolean().optional(),
  enemies: z.array(Id).min(1).describe("Enemy ids, in display order. Enemies have no formation."),
  note: Note.optional(),
});
export const PickStage = z.strictObject({ kind: z.literal("perk_pick"), id: Id });
export const Stage = z.discriminatedUnion("kind", [FightStage, PickStage]);

export const LootTable = z.strictObject({
  guaranteed: z.array(Id).optional(),
  rolls: z.number().int().min(0).optional(),
  table: z.array(z.strictObject({ gear: Id, weight: z.number().positive() })).optional(),
});

export const Constraint = z.union([
  z.strictObject({ partySize: z.strictObject({ min: PosInt.optional(), max: PosInt.optional() }) }),
  z.strictObject({
    classCount: z.strictObject({ class: Id, min: z.number().int().min(0).optional(), max: z.number().int().min(0).optional() }),
  }),
  z.strictObject({ includesSpec: Id }),
  z.strictObject({ excludesSpec: Id }),
  z.strictObject({ excludesClass: Id }),
  z.strictObject({ formation: Id }),
]);
export type Constraint = z.infer<typeof Constraint>;

export const Challenge = z.strictObject({
  id: Id,
  text: Text,
  constraints: z.array(Constraint).min(1).describe("Only things the player can see: party size, classes, specializations, formation."),
  loot: LootTable,
  note: Note.optional(),
});

export const Dungeon = z.strictObject({
  id: Id,
  name: Text,
  text: Text,
  partySize: z.strictObject({ max: PosInt }),
  perkPool: z.array(Id),
  stages: z.array(Stage).min(1),
  loot: z.strictObject({ firstClear: LootTable, replay: LootTable }),
  challenges: z.array(Challenge).describe("Fixed sequence. Clearing one reveals the next."),
  note: Note.optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// The pack
// ─────────────────────────────────────────────────────────────────────────────

export const ContentPack = z.strictObject({
  schemaVersion: z.literal(SCHEMA_VERSION),
  id: Id,
  title: z.string().optional(),
  note: Note.optional(),
  design: Design,
  ruleset: Ruleset,
  stats: z.array(StatDef),
  damageTypes: z.array(DamageType),
  statuses: z.array(StatusDef),
  verbs: z.array(VerbDef),
  traits: z.array(TraitDef),
  slots: z.array(SlotDef),
  actions: z.array(Action),
  behaviours: z.array(Behaviour),
  classes: z.array(ClassDef),
  specializations: z.array(Specialization),
  abilities: z.array(Ability),
  gear: z.array(Gear),
  formations: z.array(Formation),
  enemies: z.array(Enemy),
  perkFamilies: z.array(PerkFamily),
  perks: z.array(Perk),
  dungeons: z.array(Dungeon),
  starter: z.strictObject({
    specializations: z.array(Id).min(1),
    formations: z.array(Id).min(1),
    gear: z.array(Id),
  }),
  progression: z.strictObject({ dungeonOrder: z.array(Id).min(1) }),
});
export type ContentPack = z.infer<typeof ContentPack>;

// ─────────────────────────────────────────────────────────────────────────────
// Engine input: a party loadout (player state, not content)
// ─────────────────────────────────────────────────────────────────────────────

export const PartyUnit = z.strictObject({
  spec: Id,
  position: Id,
  abilities: z.array(Id).describe("Equipped abilities, in order."),
  gear: z.record(Id, Id).describe("Slot id to gear id."),
});
export const Party = z.strictObject({
  formation: Id,
  units: z.array(PartyUnit).min(1),
});
export type Party = z.infer<typeof Party>;

// ─────────────────────────────────────────────────────────────────────────────
// Inferred types, for the engine and tooling
// ─────────────────────────────────────────────────────────────────────────────

export type TriggerT = z.infer<typeof Trigger>;
export type ActiveT = z.infer<typeof Active>;
export type BehaviourModeT = z.infer<typeof BehaviourMode>;
export type BehaviourT = z.infer<typeof Behaviour>;
export type StatDefT = z.infer<typeof StatDef>;
export type StatusDefT = z.infer<typeof StatusDef>;
export type VerbDefT = z.infer<typeof VerbDef>;
export type VerbDefSignal = z.infer<typeof Signal>;
export type TraitDefT = z.infer<typeof TraitDef>;
export type SlotDefT = z.infer<typeof SlotDef>;
export type ActionT = z.infer<typeof Action>;
export type ClassDefT = z.infer<typeof ClassDef>;
export type SpecializationT = z.infer<typeof Specialization>;
export type AbilityT = z.infer<typeof Ability>;
export type GearT = z.infer<typeof Gear>;
export type FormationT = z.infer<typeof Formation>;
export type EnemyT = z.infer<typeof Enemy>;
export type KeyholeT = z.infer<typeof Keyhole>;
export type PerkT = z.infer<typeof Perk>;
export type DungeonT = z.infer<typeof Dungeon>;
export type ChallengeT = z.infer<typeof Challenge>;
export type LootTableT = z.infer<typeof LootTable>;
export type PartyUnitT = z.infer<typeof PartyUnit>;
