# Engine primitives

Generated from `src/schema.ts` (schema 0.3) by `npm run docs`. Do not edit by hand.

These are the closed sets the rule language is built from. Each one needs engine code, so adding one is a schema version bump plus an engine change. Everything else (stats, statuses, damage types, behaviours, verbs, traits, slots) is a registry in the pack and can grow without touching the schema.

## Instant effects (actions, triggered rules, between fights)

| Op | Fields | Meaning |
| --- | --- | --- |
| `damage` | `type`, `amount`, `target`, `hit` | Deals `amount` of `type` damage to each target through ruleset.damagePipeline (`hit` switches the rolls off). Damage from an action is an attack and fires attack_hit, attack_missed, evade, block, crit and kill; damage from rules and statuses fires only damaged and defeated. |
| `heal` | `amount`, `target` | Restores `amount` HP to each target, up to its cap. Fires healed. |
| `apply_status` | `status`, `target`, `turns`, `stacks` | Applies `status` to each target under its stacking rule. Fires status_applied. |
| `remove_status` | `status`, `target`, `stacks` | Removes stacks of `status` from each target. With self-built stacks, this is how a unit spends them. |
| `buff` | `stat`, `mode`, `value`, `target`, `turns` | Temporarily changes a stat on each target. |
| `perform_action` | `action`, `target` | The owner uses an action at once, outside its turn (via reaction). Its damage is an attack. |
| `adjust` | `stat`, `amount`, `target` | Changes a resource (not HP) on each target by `amount`, clamped between the stat's min and its cap. |
| `grant_flag` | `flag`, `target`, `turns` | Gives each target a flag for `turns` of its turns. |
| `summon` | `enemy`, `count` | Adds `count` (default 1) copies of `enemy` to the owner's side, up to ruleset.maxEnemies. |

## Passive effects (passive rules; always act on `self`)

| Op | Fields | Meaning |
| --- | --- | --- |
| `stat` | `stat`, `mode`, `value` | Changes one of self's stats while the source is active. |
| `flag` | `flag` | Gives self a flag while the source is active. |
| `modify_action` | `action`, `if`, `target`, `hits`, `amountMul`, `addEffects` | Changes every use of an action by self, however it's used: retarget it, repeat it (`hits`), scale it, or add effects that run after its own. |

## How a unit takes its turn

- Each turn, a unit goes down its behaviour's modes (or ruleset.defaultModes) and takes the first mode whose `when` holds and that produces an action. If none does, it waits.
- A unit's statuses on itself are its states: a mode's `when` can test them with hasStatus, so a boss can switch behaviour once it is frenzied.
- Active abilities come from equipped abilities, equipped gear, and an enemy's `actives`. Each has a cooldown counter. Using it sets the counter to `cooldown`; the counter drops by 1 at the end of each of the unit's own turns; it is ready at 0. Each fight it starts at `initialCooldown` (default 0) when ruleset.run.cooldownsResetEachFight, otherwise it carries over.
- The basic action has no target of its own: the unit's behaviour (or ruleset.defaultBehaviour) picks it, and modify_action can change that. Every other action carries its own target.
- There is no battlefield geometry. Any unit can target any unit; `weighted` picks follow ruleset.targeting.weightStat (aggro), which is how a formation slot makes a unit easier or harder to target.
- A status's turns count down at the end of each of its bearer's turns. A status applied during its bearer's turn_end starts counting from the next one.
- Damage dealt by a status's own rules counts the unit that applied the status as the attacker in combat formulas.

| Mode `use` | Meaning |
| --- | --- |
| `ability` | Use the ready active ability with the highest `priority` (ties: equipped abilities in order, then gear in slot order) whose `useWhen` holds and whose action finds a target. If there is none, go to the next mode. |
| `basic` | Use the basic action on the behaviour's basicTarget, as modified. If there is no valid target, go to the next mode. |

## Events (triggers)

The *actor* is the unit a trigger's `who` is matched against.

| Event | Meaning |
| --- | --- |
| `fight_start` | A fight begins. Actor: every unit. |
| `fight_end` | The party wins a fight. Actor: every surviving unit. |
| `round_start` | A round begins. Actor: every unit. |
| `turn_start` | A unit's turn begins, before it acts. Actor: that unit. |
| `turn_end` | A unit's turn ends. Actor: that unit. |
| `attack_hit` | An attack lands. Actor: the attacker. Has `amount`. |
| `attack_missed` | An attack fails its hit roll. Actor: the attacker. |
| `crit` | An attack crits. Actor: the attacker. Has `amount`. |
| `kill` | An attack defeats its target. Actor: the attacker. |
| `evade` | An attack against the actor fails its hit roll. Actor: the defender. |
| `block` | The actor blocks an attack. Actor: the defender. |
| `damaged` | The actor takes damage from any source. Actor: the receiver. Has `amount`. |
| `healed` | The actor is healed. Actor: the receiver. Has `amount`. |
| `hp_below` | The actor's HP drops below the trigger's `below` fraction of its max (fires once per crossing). Actor: that unit. |
| `defeated` | The actor is defeated. Actor: the defeated unit. |
| `status_applied` | A status is applied to the actor. Actor: the receiver. |

## Trigger `who`

| Value | Meaning |
| --- | --- |
| `self` | The event's actor is the rule's owner. The default. |
| `ally` | The actor is another unit on the owner's side. |
| `self_or_ally` | The actor is the owner or another unit on its side. |
| `enemy` | The actor is on the other side. |
| `anyone` | Any actor. |

## Subjects (`of`)

| Subject | Meaning |
| --- | --- |
| `self` | The unit that owns the rule: the gear's wearer, the ability's holder, the unit in a formation slot (or every unit, for a formation's party-wide rules), a perk's recipient, or a status's bearer. |
| `target` | The unit an effect is being applied to right now; in modify_action, the target of the action being modified. |
| `event_source` | Triggered rules only: who caused the event (the attacker, healer or applier). |
| `event_target` | Triggered rules only: who received the event (the defender or recipient). |
| `candidate` | Inside a selector's where/prefer/by: the unit being considered. |
| `attacker` | Combat formulas only: the unit dealing damage. |
| `defender` | Combat formulas only: the unit receiving damage. |

## Selector `from`

| From | Meaning |
| --- | --- |
| `self` | The rule's owner. |
| `allies` | Other living units on the owner's side. |
| `allies_and_self` | Every living unit on the owner's side. |
| `enemies` | Living units on the other side. |
| `everyone` | Every living unit. |
| `event_source` | Triggered rules only: the event's source. |
| `event_target` | Triggered rules only: the event's target. |
| `action_target` | Action effects and modify_action only: every unit the action's target picked. |
| `action_target_allies` | Action effects and modify_action only: units on the same side as the action's target, other than the units it picked (for splash and cleave). |
| `event_target_allies` | Triggered rules only: units on the same side as the event's target, other than it. |

## Selector `pick`

| Pick | Meaning |
| --- | --- |
| `all` | Every unit that passes `where`. The default. |
| `random` | `count` units at random (default 1). |
| `weighted` | `count` units at random, weighted by ruleset.targeting.weightStat (aggro). |
| `lowest` | `count` units with the lowest `by` (ties random). |
| `highest` | `count` units with the highest `by` (ties random). |

## Flags

| Flag | Meaning |
| --- | --- |
| `acts_first` | Acts before every unit without this flag, whatever the turn order says. |
| `draws_support` | When a selector on this unit's side picks a single unit (count 1, any pick but all) from allies or allies_and_self, it picks this unit if it is a candidate. |
| `skip_turn` | Loses its turn. |
| `untargetable` | Enemy selectors can't pick it. |
| `cannot_evade` | Attacks against it skip the hit roll. |
| `cannot_block` | Attacks against it skip the block roll. |

## Expression variables

| Var | Meaning |
| --- | --- |
| `raw` | Damage before mitigation. Only inside a damage type's mitigation formula. |
| `amount` | The triggering event's amount. Only in triggered rules on events that have one. |
| `round` | The current round, starting at 1. |

## Trigger `action.via`

| Value | Meaning |
| --- | --- |
| `basic` | The unit's basic action, used on its turn. |
| `ability` | An active ability. |
| `reaction` | An action performed by an effect, such as a counterattack or an extra attack. |

## Status `on`

| Value | Meaning |
| --- | --- |
| `self` | A unit's own state: stacks it builds, stances, rages. Only its bearer applies it, so apply_status must target self. |
| `others` | Applied to other units, such as bleed or a stun. Never applied to self. |
| `any` | Either. |

## Damage pipeline steps

| Step | Meaning |
| --- | --- |
| `hit` | Roll formulas.hitChance; on failure the attack misses (attack_missed + evade). |
| `crit` | Roll formulas.critChance; on success multiply by formulas.critMultiplier (crit). |
| `block` | Roll formulas.blockChance; on success multiply by formulas.blockMultiplier (block). |
| `scale` | Multiply by formulas.damageScale (e.g. the attacker's damage dealt × the defender's damage taken). |
| `mitigate` | Apply the damage type's mitigation formula, with `raw` as the incoming damage. |
| `floor` | Round down, then raise to formulas.minDamage. |

## Condition forms

- `{ all }`
- `{ any }`
- `{ not }`
- `{ hpBelow, of }`
- `{ hpAtLeast, of }`
- `{ hasStatus, of }`
- `{ isClass, of }`
- `{ isSpec, of }`
- `{ hasAbility, of }`
- `{ round }`
- `{ alive }`
- `{ compare }`

## Expression forms

- `number`
- `{ stat, of }`
- `{ stacks, of }`
- `{ var }`
- `{ count }`
- `{ add }`
- `{ mul }`
- `{ min }`
- `{ max }`
- `{ sub }`
- `{ div }`
- `{ mod }`
- `{ clamp }`
