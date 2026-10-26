# Engine primitives

Generated from `src/schema.ts` (schema 0.6) by `npm run docs`. Do not edit by hand.

The engine runs the core set's combat system (`docs/core-set/rules-and-vocabulary.md`) on step 4's machinery (`steps/04-combat-concepts/design.md`), whose finer rules stand where the core set is silent. This is the closed set of building blocks it runs on. Each needs engine code, so adding one is a schema version bump plus an engine change. Stats, weapon kinds, statuses, elements, abilities and everything else are registries in the pack, and grow without touching the schema. The numbers in the content are first values, placeholders until the balance pass.

## How a fight runs

Time is counted in sub-ticks, 1000 per tick. Each moment is the next sub-tick on which anything happens:
1. Units that are ready start their first available action: equipped abilities in slot order, then the basic attack.
2. Everything due resolves one item at a time: the party batch, then the enemy batch; within a batch, pulses, then reactions, then actions, each in slot order, then in order of creation.
3. Statuses whose last sub-tick this is end.

A unit that becomes ready, or whose action becomes available, because of something resolved in steps 2 or 3 starts on the next sub-tick. Reactions resolve on the sub-tick after their event. A fight ends the moment either side is fully KO'd. Knocked-out party units join later fights knocked out, so a revive can raise them; summoned units join mid-fight with every action on cooldown.

## Gear slots and armor weights

| Slot | Meaning |
| --- | --- |
| `weapon` | Sets the basic attack through its weapon kind. A class can use only its kinds. |
| `armor` | Light, medium or heavy. A class can wear its heaviest weight or anything lighter. |
| `amulet` | No restrictions. |

| Weight | Meaning |
| --- | --- |
| `light` | Anyone can wear it. |
| `medium` | Medium and heavy classes. |
| `heavy` | Heavy classes only. |

A weapon belongs to a kind (a registry: speed, damage type and element), and a class lists the kinds it can use and the heaviest armor it can wear.

## Effects (in actions, pulses, triggers and reactions)

| Op | Fields | Meaning |
| --- | --- | --- |
| `damage` | `type`, `subtype`, `element`, `amount`, `hits`, `riders`, `apply`, `to` | Deals damage. In an action, each hit is a hit; in a pulse or reaction it is not, and fires no hit events. |
| `heal` | `amount`, `to` | Restores HP, never above max. Never mitigated. |
| `mp` | `amount`, `to` | Restores MP (positive) or drains it (negative). |
| `apply` | `status`, `stacks`, `duration`, `chance`, `to` | Applies a status, by its stacking mode. |
| `remove` | `label`, `status`, `kind`, `tag`, `count`, `order`, `to` | Removes buffs or debuffs, optionally narrowed to a named status or an effect kind. Unremovable statuses stay, and so do the buffs of a unit with immune:dispel. |
| `revive` | `hp`, `ready`, `to` | Raises a knocked-out unit, one knocked out in an earlier fight included. Its targets must ask for `ko: true`. |
| `summon` | `enemy`, `count` | Brings new units into the fight on the actor's side, up to ruleset.maxEnemies living units on that side. They enter with every action on cooldown. |
| `replace` | `enemy`, `count`, `to` | Each target leaves the fight (not a knockout: its statuses end, nothing reacts to a KO) and `count` new units take its place, up to the cap. |

## Effect targets (`to`)

Or a targeting rule. Extra targets after an action's first ignore Taunt.

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
| `physical` | Has exactly one subtype and no element. Meets Evasion and Armor. |
| `magical` | Has exactly one element and no subtype. Meets that element's Resistance: below 0 WEAK, above 0 RESIST, 100 IMMUNE, above 100 ABSORB (heals instead, and applies nothing). |
| `none` | Untyped: never meets Evasion or Armor; meets Resistance only if it carries an element. Not allowed in actions; the usual type for a status's own damage. |

Physical subtypes: `slash`, `pierce`, `blunt`. Elements are a registry in the pack.

## Numbers

A number is a plain number, or `{ base, scale: [...] }`: base + Σ ratio × source (× times). A scale reads one of `stat`, `hp` (current or missing), `stacks` (a status's Intensity total), `amount` (a reaction's event amount) or `when` (1 if a condition holds), from:

| Of | Meaning |
| --- | --- |
| `self` | Actions: the acting unit. The default for stats in actions. |
| `target` | Actions: the unit the effect lands on. Boosts: the unit being hit. The default for hp, stacks and conditions in actions. |
| `source` | Statuses that know their source (not a shared Intensity total): the unit that applied it, read once at application. |
| `holder` | Statuses: the holder, read each time the number is used (stat changes: once, at application). The default for hp, stacks and conditions in statuses; stats must say whose. |

| Field | Meaning |
| --- | --- |
| `ratio` |  |
| `stat` | A stat's current value. |
| `hp` | Current HP, or max HP minus current. |
| `stacks` | A status's Intensity total, in stacks. |
| `amount` | Reactions only: the event's amount. |
| `when` | 1 if the condition holds for the unit read (`of`), else 0: scaling from a condition instead of a stat. |
| `times` | Multiplies the term by a stat, read live: "X% per point of Y" (Lifesteal, Siphon). |
| `of` |  |

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
| `boosts` | The holder's outgoing damage or healing, by tag. A scale `of: target` reads the unit being hit (Judgement, Brittle). |
| `taken` | Damage-taken modifiers. No tag: all damage. |
| `absorb` | Intensity only: soaks damage after mitigation, one stack per point. |
| `block` | Blocks the next damage above this percent of the holder's max HP, from any source, after mitigation and before absorbs; then the status ends (Aegis). |
| `lockout` |  |
| `riders` | Adds a rider to the holder's hits that carry `on`. |
| `convert` | Changes the element of the holder's magical instances, or the subtype of its physical ones. |
| `seek` | The holder's actions carrying this tag (basic, ability or all) have Seek: their first pick ignores Taunt. |
| `strike` | After each of the holder's basic attacks: one more hit with the weapon's damage, of kind extra, at `to`. Extra strikes don't chain. |
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
| `block` | A block: the next damage above a share of max HP is blocked, then the status ends (Aegis). |
| `lockout` | A lockout. Tag: what it covers. |
| `action_change` | A rider added to the holder's actions, a change of element or subtype, Seek, or an extra strike. |
| `pulse` | A repeating effect. |
| `reaction` | A reaction, or an Intensity event trigger. |

## Tags (for boosts, damage-taken modifiers, lockouts, riders, Seek and event filters)

| Tag | Meaning |
| --- | --- |
| `basic` | Hits from basic attacks; for lockouts and Seek, basic attacks. |
| `ability` | Hits from abilities; for lockouts and Seek, abilities. |
| `extra` | Hits from extra strikes (Double strike's second strike, Arc's second hit): hits, but not basic attacks. |
| `physical` | Physical hits (and actions with one). |
| `magical` | Magical hits (and actions with one). |
| `<subtype>` | slash, pierce or blunt. |
| `<element>` | Any element in the pack. |
| `<status>` | A status's id: reaches that status's pulses ("+20% Burn damage"). |
| `<status tag>` | A tag a status carries, which reaches its pulses. |
| `healing` | Boosts only: heals. |
| `all` | Lockouts and Seek only: every action. |

## Events

| Event | Meaning |
| --- | --- |
| `fight_start` | The fight begins. Whose: every unit. |
| `action_start` | An action starts. Whose: the acting unit. Has `kind`. |
| `action_resolve` | An action resolves. Whose: the acting unit. Has `kind`. |
| `action_interrupted` | An action in cast time is canceled by an interrupting lockout. Whose: the casting unit. Has `kind`. |
| `hit_lands` | A hit lands (not evaded or absorbed), riders included. Whose: the attacker; other: the target. Has `kind`, `tags` and `amount`. |
| `hit_taken` | A hit lands on this unit. Whose: the target; other: the attacker. Has `kind`, `tags` and `amount`. |
| `hit_evaded` | This unit evades a hit. Whose: the target; other: the attacker. Has `kind` and `tags`. |
| `hit_missed` | A hit is evaded. Whose: the attacker; other: the target. Has `kind` and `tags`. |
| `damage_dealt` | Damage is dealt, including what an absorb soaks. Whose: the dealer, when known; other: the receiver. Has `amount`, and `status` when a status's pulse or reaction dealt it. |
| `damage_taken` | Damage is taken, including what an absorb soaks. Whose: the receiver; other: the dealer, when known. Has `amount`, and `status` when a status's pulse or reaction dealt it. |
| `hp_lost` | HP is lost. Whose: the unit. Has `amount`. |
| `healed` | Healing is received. Whose: the healed unit; other: the healer, when known. Has `amount` (HP restored). |
| `status_gained` | A status is applied (each application, refreshes and added stacks included). Whose: the holder. Has `status`. |
| `status_triggered` | A status pulses, or an Intensity status's trigger fires. Whose: the holder. Has `status`. |
| `status_ended` | A status ends. Whose: the holder. Has `status` and `cause`. |
| `ko` | A unit is KO'd. Whose: that unit. The unit's own statuses that survive a KO can still react to it. |
| `revived` | A unit is revived. Whose: that unit; other: the reviver. |

| Field | Meaning |
| --- | --- |
| `whose` |  |
| `kind` | Action and hit events only. |
| `tags` | Hit events only: the hit carries at least one of these tags (its kind, type, subtype or element, and "crit" when it crits). |
| `status` | Status events, and damage events: the status whose pulse or reaction dealt the damage. |
| `cause` | status_ended only. Default: every cause. |

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
| `spent` | Its block was used. |
| `removed` | An effect removed it. |
| `ko` | Its holder was KO'd or replaced, or its source (Per source statuses that end with their source). |
| `fight_end` | The fight ended. |

## Targeting rules

An action's `target` is `foe` (default targeting: a foe by Aggro, under the Hidden rule and, without Seek, the Taunt rule), `ally` (a random ally), `self`, or a rule: a side, an optional `where` filter, a pick and a count. The Taunt rule applies to an action's own rule too: without Seek, its first pick can only go to a Taunting foe, whatever the phrase asks for. Hidden foes can't be picked by any rule but `all`, unless every foe is Hidden.

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
| `all` | Every unit that passes `where`. Area: the Taunt and Hidden rules don't apply. |

| Field | Meaning |
| --- | --- |
| `where` |  |
| `ifNone` | When `where` leaves nobody, use the whole side instead ("if every foe is Taunting, any foe"). |
| `exclude` | Skip the action's chosen targets ("a second, random foe", "up to three other foes"). |
| `by` | Required for lowest and highest. |
| `count` | Default 1. |

`by` (for lowest and highest): `hp`, `hp_share`, `buffs`, `debuffs`, `{ stat }`, `{ stats }` (the highest of several) or `{ stacks }`.

## Unit conditions (`where`, an ability's `if`, and a scale's `when`)

| Field | Meaning |
| --- | --- |
| `hpBelow` | HP below this percent of max HP. |
| `hpAtLeast` |  |
| `has` | Has this status (or every one of these). |
| `lacks` | Doesn't have this status (or any of these). |
| `buffs` | true: has any buff. false: has none. |
| `debuffs` | true: has any debuff. false: has none. |
| `kind` | Has a status containing this effect kind (narrowed by tag). |
| `stacks` | A status's Intensity total, in stacks. |
| `atCap` | Holds this Intensity status at its cap. |
| `belowCap` | Doesn't hold this Intensity status at its cap (or at all). |
| `ko` | true: knocked out, still in the fight. Sides list living units unless a rule asks for this. Default: living. |

## Stats the engine reads

| Stat | Kind | Meaning |
| --- | --- | --- |
| `max_hp` | amount | Max HP. A unit is KO'd at 0 HP. |
| `max_mp` | amount | Max MP. Abilities cost MP, paid when they resolve. |
| `attack` | amount | Scales only what states it. By convention, physical things do. |
| `magic` | amount | Scales only what states it. By convention, magical things do. |
| `armor` | amount | Reduces each physical hit: to hit² ÷ (hit + ruleset.armorK × Armor) when armorK is set; else a flat ruleset.armorRatio × Armor, down to 0 (BLOCKED). |
| `aggro` | amount | Default targeting picks foes weighted by Aggro. Its floor must be above 0. |
| `resist` | points | General Resistance, in percent, added to every element's own resist:<element>. Negative shows WEAK, positive RESIST, 100 IMMUNE, above 100 ABSORB. |
| `attack_speed` | points | Basic attack cooldown ÷ (1 + stat/100), down to its recovery. Haste, Slow and Chill act through it. |
| `cooldown_reduction` | points | Ability cooldowns ÷ (1 + stat/100). |
| `cast_time_reduction` | points | Cast times ÷ (1 + stat/100). |
| `crit_chance` | points | Percent chance that an action's damage or heal crits. |
| `crit_multiplier` | points | A crit multiplies by this percent (150 is ×1.5). Crit damage raises it. |
| `evasion` | points | Percent chance to evade a physical hit, after Accuracy, under its cap. |
| `accuracy` | points | Reduces the target's Evasion, down to 0. Negative adds to it. |
| `healing_received` | points | Heals received × (1 + stat/100). Rot lowers it. |
| `forced` | points | Above 0: Taunting. A foe's first pick must go to a Taunting unit unless its action has Seek. |
| `forbidden` | points | Above 0: Hidden. Foes can't pick this unit by any targeting but `all`, unless every candidate is Hidden. |

Every other stat (MP regen, Thorns, Lifesteal, Siphon, Double strike and the rest) is a registry entry that `brings` a status while it's above 0.

## Stat families

| Key | Meaning |
| --- | --- |
| `resist:<element>` | Resistance to one element, in percent, added to the general resist. |
| `immune:status:<status>` | Above 0: immune to that status. |
| `immune:kind:<kind>` | Above 0: immune to every status containing that effect kind. |
| `immune:kind:<kind>:<tag>` | Above 0: immune to statuses containing that effect kind with that tag (a lockout's `covers`, a stat change's stat, a boost's or modifier's tag). |
| `immune:debuffs` | Above 0: immune to every debuff. |
| `immune:damage` | Above 0: takes no damage (IMMUNE), and so is immune to statuses that deal damage. |
| `immune:dispel` | Above 0: none of its buffs can be removed. |
