# Engine primitives

Generated from `src/schema.ts` (schema 0.5) by `npm run docs`. Do not edit by hand.

Step 4's combat design (`steps/04-combat-concepts/design.md`) is what the engine runs today, and this is the closed set of building blocks it runs on. Each needs engine code, so adding one is a schema version bump plus an engine change. Stats, statuses, elements, abilities and everything else are registries in the pack, and grow without touching the schema. The core set (`docs/core-set/`) is the target the engine moves to next, and its build will add and change building blocks. The numbers in the worked example (floors, caps, default timings) are placeholders.

## How a fight runs

Time is counted in sub-ticks, 1000 per tick. Each moment is the next sub-tick on which anything happens:
1. Units that are ready start their first available action: equipped abilities in slot order, then the basic attack.
2. Everything due resolves one item at a time: the party batch, then the enemy batch; within a batch, pulses, then reactions, then actions, each in slot order, then in order of creation.
3. Statuses whose last sub-tick this is end.

A unit that becomes ready, or whose action becomes available, because of something resolved in steps 2 or 3 starts on the next sub-tick. Reactions resolve on the sub-tick after their event. A fight ends the moment either side is fully KO'd.

## Effects (in actions, pulses, triggers and reactions)

| Op | Fields | Meaning |
| --- | --- | --- |
| `damage` | `type`, `subtype`, `element`, `amount`, `hits`, `riders`, `apply`, `to` | Deals damage. In an action, each hit is a hit; in a pulse or reaction it is not, and fires no hit events. |
| `heal` | `amount`, `to` | Restores HP, never above max. Never mitigated. |
| `mp` | `amount`, `to` | Restores MP (positive) or drains it (negative). |
| `apply` | `status`, `stacks`, `duration`, `chance`, `to` | Applies a status, by its stacking mode. |
| `remove` | `label`, `status`, `kind`, `tag`, `count`, `to` | Removes buffs or debuffs, optionally narrowed to a named status or an effect kind. Unremovable statuses stay. |

## Effect targets (`to`)

Or a targeting rule.

| To | Meaning |
| --- | --- |
| `target` | Actions: the action's targets. The default in actions. |
| `self` | The acting unit: an action's user, a reaction's actor, or, for a pulse, its holder. |
| `holder` | Statuses: the holder. The default for pulses. |
| `source` | Statuses that know their source (Refresh, Fizzle, Per source): the unit that applied it. |
| `other` | Reactions: the event's other unit (the attacker for hit_taken, the target for hit_lands). Nothing if unknown. |

## Damage types

| Type | Meaning |
| --- | --- |
| `physical` | Has exactly one subtype and no element. Meets Evasion and Armor. Attack scales only physical instances. |
| `magical` | Has exactly one element and no subtype. Meets that element's Resistance. Magic scales only magical instances. |
| `none` | Typeless: never meets Evasion or Armor; meets Resistance only if it carries an element. Not allowed in actions; the usual type for a status's own damage. |

Physical subtypes: `slash`, `pierce`, `blunt`. Elements are a registry in the pack.

## Numbers

A number is a plain number, or `{ base, scale: [...] }`: base + Σ ratio × source. A scale reads one of `stat`, `hp` (current or missing), `stacks` (a status's Intensity total) or `amount` (a reaction's event amount), from:

| Of | Meaning |
| --- | --- |
| `self` | Actions: the acting unit. The default for stats in actions. |
| `target` | Actions: the unit the effect lands on. The default for hp and stacks in actions. |
| `source` | Statuses that know their source (not a shared Intensity total): the unit that applied it, read once at application. |
| `holder` | Statuses: the holder, read each time the number is used (stat changes: once, at application). The default for hp and stacks in statuses; stats must say whose. |

## Status fields

| Field | Meaning |
| --- | --- |
| `label` | Drives removal, conditions and the batch its pulses resolve in. |
| `show` | icon: on the HP bar with its total. sheet: listed on the unit sheet. stat: shown as a stat. |
| `tags` | Tags that boosts (on its applications' stacks) and damage-taken modifiers (on its pulses) can name. |
| `element` | Its damage pulses meet this element's Resistance. Full Resistance makes the unit immune to it. |
| `subtype` | Used only for damage-taken modifiers on its pulses. |
| `stacking` |  |
| `perSource` | Per source mode: each source keeps its own copy, using `stacking`. |
| `duration` | Absent: permanent, until the fight ends. |
| `unremovable` |  |
| `survivesKO` |  |
| `cap` | Intensity: the most stacks. `holder` scales read the holder. |
| `stats` |  |
| `boosts` | The holder's outgoing damage or healing, by tag. |
| `taken` | Damage-taken modifiers. No tag: all damage. |
| `absorb` | Intensity only: soaks damage after mitigation, one stack per point. |
| `lockout` |  |
| `riders` | Adds a rider to the holder's hits that carry `on`. |
| `convert` | Changes the element of the holder's magical instances, or the subtype of its physical ones. |
| `pulse` | A repeating effect. Intensity: its trigger. |
| `trigger` | Intensity only: an event trigger. |
| `drop` | Intensity only: how far the total drops on each trigger. |
| `crit` | Turns crits on for its pulses, a rare exception. fromSource: statuses that know their source only, the source's crit stats and dice. |
| `reactions` |  |

## Effect kinds (for immunity, removal and conditions)

| Kind | Meaning |
| --- | --- |
| `stat` | A stat change. Tag: the stat. |
| `boost` | A damage or healing boost. Tag: the boost's tag. |
| `taken` | A damage-taken modifier. Tag: its tag, if any. |
| `absorb` | An absorb, such as a shield. |
| `lockout` | A lockout. Tag: what it covers. |
| `action_change` | A rider added to the holder's actions, or a change of element or subtype. |
| `pulse` | A repeating effect. |
| `reaction` | A reaction, or an Intensity event trigger. |

## Tags (for boosts, damage-taken modifiers, lockouts and riders)

| Tag | Meaning |
| --- | --- |
| `basic` | Instances from basic attacks; for lockouts, basic attacks. |
| `ability` | Instances from abilities; for lockouts, abilities. |
| `physical` | Physical instances (and actions with one). |
| `magical` | Magical instances (and actions with one). |
| `<subtype>` | slash, pierce or blunt. |
| `<element>` | Any element in the pack. |
| `<status>` | A status's id: reaches that status's pulses ("+20% Burn damage"). |
| `<status tag>` | A tag a status carries, which reaches its pulses. |
| `healing` | Boosts only: heals. |
| `all` | Lockouts only: every action. |

## Events

| Event | Meaning |
| --- | --- |
| `fight_start` | The fight begins. Whose: every unit. |
| `action_start` | An action starts. Whose: the acting unit. Has `kind`. |
| `action_resolve` | An action resolves. Whose: the acting unit. Has `kind`. |
| `action_interrupted` | An action in cast time is canceled by an interrupting lockout. Whose: the casting unit. Has `kind`. |
| `hit_lands` | A hit lands (not evaded), riders included. Whose: the attacker; other: the target. Has `kind` and `amount`. |
| `hit_taken` | A hit lands on this unit. Whose: the target; other: the attacker. Has `kind` and `amount`. |
| `hit_evaded` | This unit evades a hit. Whose: the target; other: the attacker. Has `kind`. |
| `hit_missed` | A hit is evaded. Whose: the attacker; other: the target. Has `kind`. |
| `damage_dealt` | Damage is dealt, including what an absorb soaks. Whose: the dealer, when known; other: the receiver. Has `amount`. |
| `damage_taken` | Damage is taken, including what an absorb soaks. Whose: the receiver; other: the dealer, when known. Has `amount`. |
| `hp_lost` | HP is lost. Whose: the unit. Has `amount`. |
| `healed` | Healing is received. Whose: the healed unit; other: the healer, when known. Has `amount` (HP restored). |
| `status_gained` | A status is applied (each application, refreshes and added stacks included). Whose: the holder. Has `status`. |
| `status_triggered` | A status pulses, or an Intensity status's trigger fires. Whose: the holder. Has `status`. |
| `status_ended` | A status ends. Whose: the holder. Has `status` and `cause`. |
| `ko` | A unit is KO'd. Whose: that unit. |

## Event `whose`

| Value | Meaning |
| --- | --- |
| `holder` | The event is the holder's own. The default. |
| `ally` | The event is another unit's on the holder's side. |
| `foe` | The event is a unit's on the other side. |
| `any` | Any unit's. |

## Status-ended causes

| Cause | Meaning |
| --- | --- |
| `expired` | Its duration ran out. |
| `stacks` | Its Intensity total fell below 1 stack. |
| `removed` | An effect removed it. |
| `ko` | Its holder was KO'd, or its source (Per source statuses that end with their source). |
| `fight_end` | The fight ended. |

## Targeting rules

An action's `target` is `foe` (default targeting: a foe by Aggro, with Forced and Forbidden), `ally` (a random ally), `self`, or a rule: a side, an optional `where` filter, a pick and a count.

| Side | Meaning |
| --- | --- |
| `foes` | Living units on the other side. |
| `allies` | Living units on the unit's side, itself included. |
| `others` | Living units on the unit's side, itself excluded. |
| `self` | The unit itself. |

| Pick | Meaning |
| --- | --- |
| `aggro` | `count` units at random, weighted by Aggro. The default for foes. |
| `random` | `count` units at random. The default otherwise. |
| `lowest` | `count` units with the lowest `by`; ties at random. |
| `highest` | `count` units with the highest `by`; ties at random. |
| `all` | Every unit that passes `where`. |

`by` (for lowest and highest): `hp`, `hp_share`, `buffs`, `debuffs`, `{ stat }` or `{ stacks }`.

## Unit conditions (`where`, and an ability's `if`)

| Field | Meaning |
| --- | --- |
| `hpBelow` | HP below this percent of max HP. |
| `hpAtLeast` |  |
| `has` | Has this status. |
| `lacks` | Doesn't have this status. |
| `buffs` | true: has any buff. false: has none. |
| `debuffs` | true: has any debuff. false: has none. |
| `kind` | Has a status containing this effect kind (narrowed by tag). |
| `stacks` | A status's Intensity total, in stacks. |

## Stats the engine reads

| Stat | Kind | Meaning |
| --- | --- | --- |
| `max_hp` | amount | Max HP. A unit is KO'd at 0 HP. |
| `max_mp` | amount | Max MP. Abilities cost MP, paid when they resolve. |
| `attack` | amount | Scales only what states it. By convention, physical things do. |
| `magic` | amount | Scales only what states it. By convention, magical things do. |
| `armor` | amount | A flat reduction on each physical instance, down to 0 (BLOCKED). |
| `aggro` | amount | Default targeting picks foes weighted by Aggro. Its floor must be above 0. |
| `resist` | points | General Resistance, in percent, added to every element's own resist:<element>. Negative shows WEAK, positive RESIST, 100 IMMUNE. |
| `attack_speed` | points | Basic attack cooldown ÷ (1 + stat/100), down to its recovery. |
| `cooldown_reduction` | points | Ability cooldowns ÷ (1 + stat/100). |
| `cast_time_reduction` | points | Cast times ÷ (1 + stat/100). |
| `crit_chance` | points | Percent chance that an action's damage or heal crits. |
| `crit_multiplier` | points | A crit multiplies by this percent (150 is ×1.5). |
| `evasion` | points | Percent chance to evade a physical hit, after Accuracy, under its cap. |
| `accuracy` | points | Reduces the target's Evasion, down to 0. Negative adds to it. |
| `healing_received` | points | Heals received × (1 + stat/100). |
| `forced` | points | Above 0: default targeting must pick this unit (with other forced units). |
| `forbidden` | points | Above 0: default targeting can't pick this unit, unless every candidate is. |

## Stat families

| Key | Meaning |
| --- | --- |
| `resist:<element>` | Resistance to one element, in percent, added to the general resist. |
| `immune:status:<status>` | Above 0: immune to that status. |
| `immune:kind:<kind>` | Above 0: immune to every status containing that effect kind. |
| `immune:kind:<kind>:<tag>` | Above 0: immune to statuses containing that effect kind with that tag (a lockout's `covers`, a stat change's stat, a boost's or modifier's tag). |
| `immune:debuffs` | Above 0: immune to every debuff. |
| `immune:damage` | Above 0: takes no damage (IMMUNE), and so is immune to statuses that deal damage. |
