# Engine primitives

Generated from `src/schema.ts` (schema 0.12) by `npm run docs`. Do not edit by hand.

The engine runs the core set's combat system (`docs/core-set/rules-and-vocabulary.md`); where that document is silent, what the engine does stands. This is the closed set of building blocks it runs on. Each needs engine code, so adding one is a schema version bump plus an engine change. Stats, weapon kinds, armor types, offhand kinds, statuses, abilities and everything else are registries in the pack, and grow without touching the schema. The numbers in the content are first values, placeholders until the balance pass.

## How a fight runs

Time is counted in sub-ticks, 1000 per tick. Each moment is the next sub-tick on which anything happens:
1. Units that are ready start their first available action: equipped abilities in slot order, then the basic attack.
2. Everything due resolves one item at a time: the party batch, then the enemy batch; within a batch, pulses, then reactions, then actions, each in slot order, then in order of creation.
3. Statuses whose last sub-tick this is end.

A unit that becomes ready, or whose action becomes available, because of something resolved in steps 2 or 3 starts on the next sub-tick. Reactions resolve on the sub-tick after their event. A fight ends the moment either side is fully KO'd. Knocked-out party units join later fights knocked out, so a revive can raise them; summoned units join mid-fight with every action on cooldown.

## Gear slots

| Slot | Meaning |
| --- | --- |
| `weapon` | Sets the basic attack through its weapon kind. A class can use only its kinds. A two-handed weapon empties the offhand. |
| `armor` | Of an armor type. A class wears only its types. |
| `offhand` | Of an offhand kind. A class holds only its kinds, and nothing under a two-handed weapon. |
| `amulet` | No restrictions. |

A weapon belongs to a kind (a registry: speed, damage type and hands), a piece of armor to an armor type and an offhand to an offhand kind (registries of names). A class lists the weapon kinds, armor types and offhand kinds it can use. A two-handed weapon empties the offhand. A mythic piece fits one class, in any slot, and a unit wears one at most. Every piece has its own fixed rarity (common, uncommon, rare, legendary, mythic: no affixes), and every formation its own (common, rare, legendary).

## Effects (in actions, pulses, triggers and reactions)

| Op | Fields | Meaning |
| --- | --- | --- |
| `damage` | `type`, `amount`, `hits`, `riders`, `apply`, `to` | Deals damage. In an action, each hit is a hit; in a pulse or reaction it is not, and fires no hit events. |
| `heal` | `amount`, `final`, `to` | Restores HP, never above max. Never mitigated. |
| `mp` | `amount`, `final`, `to` | Restores MP (positive) or drains it (negative). |
| `apply` | `status`, `stacks`, `duration`, `chance`, `passed`, `copy`, `rider`, `to` | Applies a status, by its stacking mode. |
| `remove` | `label`, `status`, `kind`, `tag`, `count`, `order`, `move`, `except`, `to` | Removes buffs or debuffs, optionally narrowed to a named status or an effect kind. Unremovable statuses stay, and so do the buffs of a unit with immune:dispel. |
| `revive` | `hp`, `ready`, `after`, `to` | Raises a knocked-out unit, one knocked out in an earlier fight included. Its targets must ask for `ko: true`. |
| `cooldown` | `which`, `set`, `to` | Changes the cooldown left on a unit's basic attack or abilities: ready now, a full cooldown, some ticks closer, a share of what's left, or at most a share of its full one. A wind-up already under way carries on. |
| `pay` | `hp`, `drain`, `to` | A price in HP: lost at once, not damage, so no Shield soaks it, no Defense cuts it and nothing reacts to it as damage; it never takes the payer below 1 HP. It fires hp_paid. An ability's HP price is this effect on itself, after whatever reads its HP first. |
| `strike` | `share`, `of`, `amount`, `apply`, `kind`, `carry`, `by`, `tag`, `split`, `seek`, `after`, `to` | Reactions only: a hit out of turn by the actor at each target (the dodge's riposte, a second landing, a blow carried past a kill). It fires hit events and never brings extra strikes of its own. |
| `one` | `of`, `count`, `same`, `pick`, `to` | Applies one of these statuses (or `count` of them), picked at random on the actor's dice. |
| `recast` | `which`, `paid` | Reactions only: an ability resolves again at once, with no wind-up, choosing its targets afresh by its own rule, its cooldown untouched; free unless `paid`. By default, in a reaction to the holder's own action_resolve, the action that set it off. The repeat fires its own action events, which `repeat: false` filters skip. |
| `spend` | `status`, `share`, `count`, `to` | Takes stacks off an Intensity status the target holds (all of them, without share or count); under one stack it ends. |
| `pass` | `label`, `except`, `to` | Every status of this label the actor holds passes to each target: the actor is rid of it, and it lands as a fresh application at its own length, with the stacks the actor held. Unremovable statuses stay. |
| `share` | `to` | Reactions to status_gained only: each target gains the same status in the same stacks, as a copy. Only a status laid at a moment is shared: one with an icon that has a duration, stacks or a block; not a state its holder keeps while something is true of it. |
| `riders` | `plain`, `to` | Reactions only: each target gains what the actor's basic attacks carry, in the stacks one swing adds. Two units answering one event add a status from one source once. |
| `restart` | `to` | The start-of-fight effects of each target's gear and seat happen again: their reactions to fight_start, as a repeat (`repeat: false` keeps a price or a drawback out). One event restarts a unit once. |
| `fell` | `to` | Each target is knocked out at once: not damage, so no Shield, Aegis or floor stands in the way. The actor's kill, but no hit's. |
| `summon` | `enemy`, `count` | Brings new units into the fight on the actor's side, up to ruleset.maxEnemies living units on that side. They enter with every action on cooldown. |
| `replace` | `enemy`, `count`, `to` | Each target leaves the fight (not a knockout: its statuses end, nothing reacts to a KO) and `count` new units take its place, up to the cap. |


## Cooldown changes (the `cooldown` effect)

| Which | Meaning |
| --- | --- |
| `basic` | The basic attack's timer. |
| `abilities` | Each of its equipped abilities. |
| `longest` | Its ability with the most cooldown left (ties: slot order). Nothing when every one is ready. |
| `soonest` | Its ability with the least cooldown left that isn't ready yet (its "next ability"). |
| `event` | Reactions to an action event only: the ability that set the reaction off. |
| `first` | Its first-slotted ability: the one the player put first. |
| `slowest` | Its ability with the longest whole cooldown, cooling or not (ties: slot order). |
| `{ ability }` | These abilities by id, each with its trained forms (<id>__p and the rest), if the unit has them equipped. |

| Set | Meaning |
| --- | --- |
| `ready` | Ready now: no cooldown left. It still needs its MP and its conditions. |
| `full` | Its full cooldown left, as if it had just been used. |
| `{ less }` | This many ticks closer, down to ready. |
| `{ times }` | Its cooldown left × times %: 50 halves what's left. |
| `{ atMost }` | Its cooldown left at most atMost % of its full cooldown ("at least half charged": 50). |
| `{ lessPct }` | This percent of its full cooldown closer, down to ready (a number, so it can count: "a tenth sooner for each foe it hit"). |

## Effect targets (`to`)

Or a targeting rule. Extra targets after an action's first ignore Taunt.

| To | Meaning |
| --- | --- |
| `target` | Actions: the action's targets. The default in actions. |
| `self` | The acting unit: an action's user, a reaction's actor, or, for a pulse, its holder. |
| `holder` | Statuses: the holder. The default for pulses. |
| `source` | Statuses that know their source (Refresh, Fizzle, Per source): the unit that applied it. |
| `other` | Reactions: the event's other unit (the attacker for hit_taken, the target for hit_lands). Nothing if unknown. |
| `owner` | Reactions: the unit the event is about, whoever holds the reacting status (the holder of a status that just capped, the unit knocked out). |
| `assailant` | Reactions: the unit that last hit the unit the event is about, this fight, if it still stands ("the foe that last hit the healed ally"). |

## Damage types

| Type | Meaning |
| --- | --- |
| `physical` | A hit: meets Evasion and Defense. Every hit is physical. |
| `none` | Untyped: never dodged, never reduced by Defense. Not allowed in actions; the type of a status's own damage. |

There are no elements and no physical subtypes: an element is a theme in a name, never a mechanic.

## Numbers

A number is a plain number, or `{ base, scale: [...] }`: base + Σ ratio × source (× times). A scale reads one of `stat`, `hp` (current or missing), `stacks` (a status's Intensity total), `amount` (a reaction's event amount) or `when` (1 if a condition holds), from:

| Of | Meaning |
| --- | --- |
| `self` | Actions: the acting unit. The default for stats in actions, and for a count of a side's units. |
| `target` | Actions: the unit the effect lands on. Boosts: the unit being hit. The default for hp, stacks, conditions and counts of buffs or debuffs in actions. |
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
| `event` | Reactions to hit events only: `raw`, the hit's amount before Defense (after boosts and crit); `stopped`, what the unit's Shield soaked and its Aegis blocked of it. |
| `cost` | Actions, and the amounts statuses add to their hits: what this action paid, in MP or as an HP price. |
| `count` | A count, as COUNTS says: the unit's buffs or debuffs, an action's targets or the units its hits landed on, or the units on a side that pass a test. |
| `times` | Multiplies the term by a stat, or by a status's stacks, read live: "X% per point of Y" (Lifesteal, Siphon), "a twentieth more of the blow for each Spite". |
| `of` |  |
| `seat` | Statuses only: read from the unit in this seat of the holder's party, in place of `of` ("for each Spite the Wall holds"). Nothing if nobody sits there. |

A scale's `count`:

| Count | Meaning |
| --- | --- |
| `buffs` | The buffs the unit read holds. |
| `debuffs` | The debuffs the unit read holds. |
| `targets` | Actions only: the action's targets, as chosen when it resolved. |
| `hit` | The units on the other side an action's hits have landed on so far, each once (an effect after the hits reads them all); in a reaction to action_resolve, that action's. |
| `{ side, where }` | The units on that side of the unit read that pass `where` (and its seat, if given); with `stacks`, the total of that status's stacks across them instead of their number. |

## Status fields

| Field | Meaning |
| --- | --- |
| `label` | Drives removal, conditions and the batch its pulses resolve in. marker: neither buff nor debuff. |
| `show` | icon: on the HP bar with its total. sheet: listed on the unit sheet. stat: shown as a stat. |
| `tags` | Tags that boosts (on its applications' stacks) and damage-taken modifiers (on its pulses) can name. |
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
| `adds` | Adds to the amount of the holder's hits that carry `on`, before boosts, crit and Defense ("extra damage equal to a sixth of its Defense"). `target` is the unit hit; an Intensity status adds it for each stack. A bare hit takes none. |
| `seek` | The holder's actions carrying this tag (basic, ability or all) have Seek: their first pick ignores Taunt. |
| `strike` | After each of the holder's basic attacks: one more hit with the weapon's damage, of kind extra, at `to`. Extra strikes don't chain. |
| `pulse` | A repeating effect. Intensity: its trigger. |
| `trigger` | Intensity only: an event trigger. |
| `drop` | Intensity only: how far the total drops on each trigger. |
| `crit` | Turns crits on for its pulses, a rare exception. fromSource: statuses that know their source only, the source's crit stats and dice. |
| `reactions` |  |
| `focus` | Marked: the holder's foes' basic attacks pick a holder while one can be picked, by draw among several, under the Taunt rule (Seek follows it past a Taunting foe). Abilities keep their own targeting. |
| `single` | Marked: each applier keeps one copy: applying it to a unit ends the copy that applier gave anywhere else. Statuses that know their source only. |
| `aim` | The holder's basic attacks pick by this rule. When it finds nobody, the next in line picks: a Marked foe, then the default. |
| `mods` | Changes to the holder's own abilities, read each time one is used. An Intensity status's changes don't grow with its stacks. |
| `crits` | Crits by condition on the holder's hits. |
| `echo` | The holder's extra strikes are heard as basic attacks by its statuses' reactions and triggers that name kind basic, unless that status also names kind extra for the same event, or gives strikes itself. Boosts still see them as extra. |
| `set` | After every other change, the holder's stat is this value while it holds the status. |
| `cover` | When a hit on another living ally would deal it more than share % of its max HP, after its mitigation and before its block and absorbs, the holder takes the whole hit instead: it resolves again against the holder, statuses and riders included, keeping its crit and without a second dodge. A hit moves once. |
| `floor` | The holder's HP can't fall below 1 while it holds this: a blow that would knock it out leaves it at 1, and nothing falls. |
| `heals` | Only its own heals land on the holder (its abilities, its Lifesteal, its statuses' reactions); heals from others, a Regen they gave included, restore nothing. |
| `healCap` | The holder can't be healed above this percent of its max HP, and loses what it has above it as the status lands (not damage, not a price). Healing past it is healing past full; at the cap it reads as just under it ("at half it counts as below half"). |
| `soak` | Damage that would reach the holder's HP comes out of its MP instead, point for point, while it has any: after a block and absorbs, before HP. |
| `divert` | What the holder would gain goes to another unit instead, once: what's sent on isn't sent on again. |
| `party` | A rule its side holds once: of the units on a side that hold this status, only the first standing, in slot order, answers an event with its reactions and trigger. |
| `oncePerEvent` | A counter: one event adds one application to a holder, however many of its reactions count it. |
| `damp` | Intensity with a cap: a chain of cappings dies down. Stacks an application marked `passed` adds to a unit are cut to pct % for each time that unit has capped this status in the last `window` ticks, in fractions of a stack. |
| `swap` | The holder's two stats are swapped as they stand from its class, gear and seat; statuses change them as usual after that. |
| `tireless` | The holder's basic attacks never wait on its abilities: it keeps swinging on its own clock through their wind-ups and recoveries. |
| `order` | Each time the holder is free to act, it uses one of its available abilities picked at random, whatever order they're slotted in. |
| `borrow` | The holder's basic attacks also carry the riders of another unit's: the statuses that unit's basic attacks apply through its statuses' reactions, on the same conditions, with stacks read off the holder, and never twice from a status both hold. What's borrowed isn't borrowed on. |
| `revives` | Every revive the holder makes, from its abilities and its statuses' reactions alike (Einherjar). |

## Status labels

| Label | Meaning |
| --- | --- |
| `buff` | Helps its holder. Removed by effects that remove buffs (Dispel); counted by `buffs`. |
| `debuff` | Hurts its holder. Removed by effects that remove debuffs (Cleanse); counted by `debuffs`. Its pulses resolve in the batch of the holder's foes. |
| `marker` | Neither. Bookkeeping such as "once a fight" or "already hit by it": only a remove that names it lifts it, no immunity to debuffs stops it, and nothing counts it as a buff or debuff. Its pulses resolve in its holder's own batch. |

## Reactions

| Field | Meaning |
| --- | --- |
| `on` |  |
| `actor` | Who acts. source only for statuses that know their source. Default holder. |
| `if` | Checked when the reaction resolves, every one must hold: a side's state (as an ability's `if`, read from the actor's side) or a test of the event's other unit or owner. When one fails, the reaction does nothing. |
| `split` | Reactions that share this word and answer one event share its amount evenly (two pieces that move one fallen foe's fire, or carry one blow's left-over). |
| `do` | Each effect states its target (`to`). |

A reaction's `if` is a condition (below), or a test of one of its event's units:

| Field | Meaning |
| --- | --- |
| `unit` | other: the event's other unit (as `to: other`); owner: the unit the event is about (as `to: owner`). |
| `where` | What it must pass. |

## Ability changes (a status's `mods`)

Each change reaches the holder's own abilities, read each time one is used: when it's checked, when it starts, when it pays, when it picks, when it hits.

| Field | Meaning |
| --- | --- |
| `of` | Absent: every ability the holder has. |
| `if` | The holder passes this when the ability is checked and when it pays ("while it holds over half its MP"). |
| `mp` | Percent change to its MP cost: −20 a fifth less, −100 free, +50 half again. Changes add up; the cost never falls below 0. |
| `hp` | An HP price, paid when the ability resolves: on top of its MP, or in its place. |
| `pay` | An HP price of its own size, paid as the action resolves (a basic attack's: `of: { basic: true }`), never below 1 HP. The action's amounts can read it (`cost: hp`). |
| `cast` | Its wind-up, in ticks, before cast-time reduction, in place of its own ("winds up in a moment": 1). |
| `wind` | Percent change to its wind-up, before cast-time reduction: +50 half again as long. |
| `cooldown` | Percent change to its cooldown: +100 twice as long, −100 none (it's cast again whenever it can be). |
| `damage` | Its hits deal this percent more, with the holder's boosts. |
| `times` | Every percentage of this change (mp, damage, heal, stacks, wind, cooldown) is multiplied by this count. |
| `stacks` | Its applications of these statuses (absent: every Intensity status) add pct % more stacks, on top of the applier's boosts. |
| `heal` | Its heals heal this percent more. |
| `target` | Its own target rule, in place of the ability's (the Taunt rule applies, unless it has Seek). |
| `seek` | It has Seek: its first pick ignores Taunt. |
| `wait` | It also waits for these, as its own `if` does. |
| `apply` | Statuses its hits apply as well, after its own. |

Its `of`:

| Field | Meaning |
| --- | --- |
| `ability` | These abilities by id, each with its trained forms (a mythic naming its class's ability). |
| `does` | Abilities whose effects do one of these: revive, heal or damage, or apply this status (stun, silence, shield, guard...). |
| `single` | Abilities that aim at one foe: default targeting, or a rule that picks one foe first (not one aimed at every foe). |
| `first` | The first-slotted ability: the one the player put first. |
| `basic` | The basic attack, in place of the abilities: only `pay` and `wait` mean anything on it. |

## Crits by condition (a status's `crits`)

| Field | Meaning |
| --- | --- |
| `tag` | Only hits carrying this tag (basic, ability, extra, physical, area). |
| `when` | Only hits on a unit that passes this, read as the hit lands. |
| `chance` | Points added to the hit's crit chance, after every stat change (100: it always crits, whatever else holds, Gambler's coin included). |
| `times` | The hit's crit chance, after every stat change, is multiplied by this before any `chance` is added (3: tripled against the foes `when` names). |
| `cap` | What this rule adds or multiplies never lifts the chance past this; a chance already higher stays as it is. |
| `set` | The hit's crit chance is this, whatever the stat and the other rules say: nothing raises it, and it wins over a stat set to a value (Gambler's coin). A rule that always crits still does. |
| `bonus` | Percent more crit bonus, the part of the crit multiplier above ×1: 100 makes ×1.5 into ×2. |

## Effect kinds (for immunity, removal and conditions)

| Kind | Meaning |
| --- | --- |
| `stat` | A stat change, or a stat set to a value. Tag: the stat. |
| `boost` | A damage or healing boost. Tag: the boost's tag. |
| `taken` | A damage-taken modifier. Tag: its tag, if any. |
| `absorb` | An absorb, such as a shield. |
| `block` | A block: the next damage above a share of max HP is blocked, then the status ends (Aegis). Also an HP floor or a cover. |
| `lockout` | A lockout. Tag: what it covers. |
| `action_change` | A rider or an amount added to the holder's hits, Seek, an extra strike, an aim, ability changes, crits by condition, echo, riders borrowed from another unit, a basic attack that never waits, a random order, or a rule for its revives. |
| `pulse` | A repeating effect. |
| `reaction` | A reaction, or an Intensity event trigger. |

## Tags (for boosts, damage-taken modifiers, lockouts, riders, Seek and event filters)

| Tag | Meaning |
| --- | --- |
| `basic` | Hits from basic attacks; for lockouts and Seek, basic attacks. |
| `ability` | Hits from abilities; for lockouts and Seek, abilities. |
| `extra` | Hits from extra strikes (Double strike's second strike, and the strikes it chains): hits, but not basic attacks. |
| `bonus` | Hits a card names beyond those (Arc's second hit, a leap, a ring, a volley's arrow, a jump, a strike out of turn, a second landing, a left-over): hits, but not basic attacks, an ability's hits or extra strikes. |
| `wide` | Hit events only: a bonus hit a basic attack lands on a unit other than its target (Arc's second hit, a leap, a volley's arrow). |
| `bare` | Hit events only: a hit that carries nothing (a second landing, a left-over): no status rides on it, and nothing lands it again. |
| `crit` | Hit events only: the hit crit. |
| `pulse` | healed and overhealed only: a status's pulse or trigger healed (a Regen's), not an ability or a reaction. |
| `physical` | Every hit (and actions with one): not a status's own damage. |
| `area` | Hits from a damage effect aimed at two or more units at once (an Area spell, a basic attack aimed at every foe). A hit without it is a single-target hit. |
| `<status>` | A status's id: reaches that status's pulses ("+20% Burn damage"). |
| `<status tag>` | A tag a status carries, which reaches its pulses. |
| `healing` | Boosts only: heals. |
| `all` | Lockouts and Seek only: every action. |

## Events

| Event | Meaning |
| --- | --- |
| `fight_start` | The fight begins. Whose: every unit. A `restart` effect makes the reactions of a unit's gear and seat to it happen again, as a repeat. |
| `action_start` | An action starts. Whose: the acting unit. Has `kind`. |
| `action_resolve` | An action resolves. Whose: the acting unit; other: its first target. Has `kind`, `amount` (the MP it paid) and `count` (the units on the other side its hits landed on). A recast's is a repeat. |
| `action_interrupted` | An action in cast time is canceled by an interrupting lockout. Whose: the casting unit. Has `kind`. |
| `hit_lands` | A hit lands (not evaded), riders included. Whose: the attacker; other: the target. Has `kind`, `tags` and `amount`, and for a scale's `event`: `raw` (its amount before Defense) and `stopped` (what the target's Shield soaked and its Aegis blocked of it). |
| `hit_taken` | A hit lands on this unit. Whose: the target; other: the attacker. Has `kind`, `tags` and `amount`, and `raw` and `stopped` as hit_lands. |
| `hit_evaded` | This unit evades a hit. Whose: the target; other: the attacker. Has `kind` and `tags`. |
| `hit_missed` | A hit is evaded. Whose: the attacker; other: the target. Has `kind` and `tags`. |
| `damage_dealt` | Damage is dealt, including what an absorb soaks. Whose: the dealer, when known; other: the receiver. Has `amount`, and `status` when a status's pulse or reaction dealt it. |
| `damage_taken` | Damage is taken, including what an absorb soaks. Whose: the receiver; other: the dealer, when known. Has `amount`, and `status` when a status's pulse or reaction dealt it. |
| `hp_lost` | HP is lost to damage. Whose: the unit. Has `amount`. HP paid as a price (the pay effect) isn't lost this way: it fires hp_paid. |
| `hp_paid` | HP is paid as a price: the pay effect (unless it's a drain), or an ability's HP price. Whose: the payer. Has `amount`. |
| `hp_low` | Its HP goes under a line, the percent of max HP the filter's `line` names, whatever took it there (damage, a price, a drain, a cap on its healing); or it starts a fight, or stands up, under it. It fires again only once the unit has been back at the line or over. Whose: the unit. |
| `hp_high` | Its HP comes back to a line or over (the filter's `line`); or it starts a fight, or stands up, there. Whose: the unit. |
| `mp_gained` | An effect restores MP. Whose: the receiver; other: the unit whose effect gave it (itself, for its own regen or Clarity). Has `amount` (the MP restored). |
| `mp_over` | MP gained past the full pool. Whose: the unit; other: the giver. Has `amount`: the part past full. MP given in answer to it never fires it again. |
| `healed` | Healing is received. Whose: the healed unit; other: the healer, when known. Has `amount` (HP restored), `kind` when an action healed ("a heal given" is this event with `other: holder`), `status` when a status's pulse or reaction healed, and the tag `pulse` for a pulse. |
| `overhealed` | Healing that would go past max HP, or past a cap on the unit's healing. Whose: the healed unit; other: the healer, when known. Has `amount` (the part past full), and `kind`, `status` and `pulse` as healed. Healing given in answer to it, and a heal marked final, never fire it. |
| `status_gained` | A status is applied (each application, refreshes and added stacks included). Whose: the holder; other: the applier. Has `status`, `amount` (the stacks it added, Intensity only), and the tag `area` when its effect was aimed at two or more units. An application marked as a copy is a repeat. |
| `status_triggered` | A status pulses, or an Intensity status's trigger fires. Whose: the holder. Has `status`. |
| `status_ended` | A status ends. Whose: the holder. Has `status` and `cause`. `amount` is the stacks it held as it ended (an Intensity total), but the most an absorb held when damage emptied it (cause stacks), and the damage a block stopped (cause spent); other is the unit whose damage emptied or spent it, or whose effect removed it. |
| `status_capped` | An Intensity status stands at its cap after an application (where Chill shatters). Whose: the holder; other: the applier. Has `status`, and `amount`: the stacks it holds. |
| `ko` | A unit is KO'd. Whose: that unit; other: the unit whose damage knocked it out, when known. When a hit did it (a killing blow), it has that hit's `kind` and `tags`, the action behind it, and `amount`: what the blow had left over past the HP its target had. The unit's own statuses that survive a KO can still react to it. |
| `revived` | A unit is revived. Whose: that unit; other: the reviver. |
| `fight_won` | The fight is won, the moment the last foe falls, before statuses end. Whose: every party unit, fallen ones included. Its reactions resolve at once, in slot order, and a fallen unit's statuses that survive a KO act for it. |

| Field | Meaning |
| --- | --- |
| `whose` |  |
| `kind` | Action and hit events, and ko, healed and overhealed: the kind of the action or hit behind it. |
| `tags` | The event carries at least one of these tags. A hit's: its kind and type, `crit` when it crits, `area` when its effect is aimed at several units, `wide`, `bare`, and any tag its strike names. ko: the killing hit's (`physical`: a killing blow). healed and overhealed: `pulse`. status_gained: `area`. |
| `notTags` | The event carries none of these (`area`: a single-target hit; `bare`: not a second landing or a left-over). |
| `status` | Status events; damage events and heals: the status whose pulse or reaction dealt the damage or healed. |
| `line` | hp_low and hp_high only, and required there: the line, in percent of max HP. |
| `ability` | Action events and ko: the action was one of these abilities, each with its trained forms ("when Backstab knocks a foe out"). |
| `does` | Action events: the action does one of these, as an ability filter's `does` ("the next ability that deals damage"). |
| `paid` | action_resolve only: the action was paid for, in MP or as an HP price (a free cast isn't). |
| `counted` | Action events only: an ordinary action or a paid second cast, which count as casts; not a free repeat. |
| `wasBelow` | Hit events only: the unit hit was below this percent of its max HP as the hit landed, before its damage. |
| `cause` | status_ended only. Default: every cause. |
| `other` | Who the event's other unit is, from the holder's side: holder (a kill it landed, a status it applied, a heal or revive it gave), ally, foe, or any (there is one). |
| `source` | Status events only: the status was applied by the holder (a Mark it gave, an Aegis it gave). |
| `seat` | The unit the event is about sits in this seat of the party's formation (a position id, or next / previous from the holder's). |
| `amountAtLeast` | The event's amount is at least this ("a cast that paid MP": 1). |
| `countAtLeast` | action_resolve only: its hits landed on at least this many units of the other side. |
| `repeat` | true matches only a repeat, false only the first: an action event of a recast; a fight_start a `restart` made happen again; a status_gained of an application marked as a copy. Default: both. |

## Event `whose`

| Value | Meaning |
| --- | --- |
| `holder` | The event is the holder's own. The default. |
| `ally` | The event is another unit's on the holder's side. |
| `team` | The event is a unit's on the holder's side, the holder's own included. |
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
| `aggro` | `count` units at random, weighted by draw (a party unit's Aggro through ruleset.partyDraw, an enemy's through ruleset.draw). The default for foes. |
| `random` | `count` units at random. The default otherwise. |
| `lowest` | `count` units with the lowest `by`; ties at random. |
| `highest` | `count` units with the highest `by`; ties at random. |
| `all` | Every unit that passes `where`. Area: the Taunt and Hidden rules don't apply. |

| Field | Meaning |
| --- | --- |
| `where` |  |
| `ifNone` | When `where` leaves nobody, use the whole side instead ("if every foe is Taunting, any foe"). With `ko: true`, nobody fallen means the living side, by the rule's other tests ("a fallen ally, else the lowest"). |
| `exclude` | targets: skip the action's chosen targets ("a second, random foe", "up to three other foes"). Reactions only: other or owner, skip the event's other unit or the unit it's about ("every other foe", "a random foe other than the one it hit"). |
| `seat` | The unit in this seat of the party's formation (a position id), or `next` / `previous`: the seat after or before the reading unit's, by slot order, wrapping round and skipping empty seats. |
| `by` | Required for lowest and highest. |
| `count` | Default 1. |

`by` (for lowest and highest): `hp`, `hp_share`, `mp_share`, `buffs`, `debuffs`, `swing` (the basic attack's interval now; highest is the slowest), `{ stat }`, `{ stats }` (the highest of several) or `{ stacks }`.

Basic attacks pick in this order: an `aim` with `first` the attacker holds; a foe holding a `focus` status (Marked); its other `aim`; the default. Each step that finds nobody passes to the next.

## Conditions (an ability's `if`, a pulse's or reaction's `if`)

| Field | Meaning |
| --- | --- |
| `atLeast` | At least this many pass. Default 1, or 0 when atMost is given. |
| `atMost` | At most this many pass (0: none does, "no foe is Marked"). |
| `seat` | The unit in this seat of the party's formation (a position id), or `next` / `previous`: the seat after or before the reading unit's, by slot order, wrapping round and skipping empty seats. |

## Unit conditions (`where`, an ability's `if`, and a scale's `when`)

| Field | Meaning |
| --- | --- |
| `hpBelow` | HP below this percent of max HP. |
| `hpAtLeast` |  |
| `mpBelow` | MP below this share of max MP (what a Clarity waits for). A unit with no MP pool never passes. |
| `mpAtLeast` |  |
| `has` | Has this status (or every one of these). |
| `lacks` | Doesn't have this status (or any of these). |
| `buffs` | true: has any buff. false: has none. |
| `debuffs` | true: has any debuff. false: has none. |
| `kind` | Has a status containing this effect kind (narrowed by tag). |
| `stacks` | A status's Intensity total, in stacks. |
| `atCap` | Holds this Intensity status at its cap. |
| `belowCap` | Doesn't hold this Intensity status at its cap (or at all). |
| `casting` | true: in an action's wind-up right now (what Unmake waits for). false: not. |
| `ko` | true: knocked out, still in the fight. Sides list living units unless a rule asks for this. Default: living. |
| `hasAny` | Has at least one of these statuses (Stunned or Silenced). |
| `lower` | This stat is lower than the reading unit's: the acting unit in an action, a reaction's actor, a pulse's holder (an ally with less Defense than the wearer). |
| `acted` | true once one of its actions has resolved this fight; false until then (a unit summoned mid-fight starts false). |
| `top` | No living unit on its side has more of the highest of these stats ("the foe with the highest Attack"); ties pass. |
| `topHp` | No living unit on its side has more current HP; ties pass. |
| `canHeal` | true: can be healed: below its max HP, and under any cap on its healing. false: can't. |
| `weapon` | Wields a weapon of one of these kinds (an enemy's weapon by its kind, if it names one). |

## Stats the engine reads

| Stat | Kind | Meaning |
| --- | --- | --- |
| `max_hp` | amount | Max HP. A unit is KO'd at 0 HP. |
| `max_mp` | amount | Max MP. Abilities cost MP, paid when they resolve. |
| `attack` | amount | Scales only what states it. |
| `defense` | amount | Reduces each hit: to hit² ÷ (hit + ruleset.armorK × Defense) when armorK is set; else a flat ruleset.armorRatio × Defense, down to 0 (BLOCKED). |
| `aggro` | amount | Default targeting picks foes weighted by draw: a party unit's Aggro through ruleset.partyDraw (doubling), an enemy's through ruleset.draw's curve, or Aggro itself without either. Its floor must be above 0. |
| `attack_speed` | points | Basic attack cooldown ÷ (1 + stat/100), down to its recovery. Haste, Slow and Chill act through it. |
| `cooldown_reduction` | points | Ability cooldowns ÷ (1 + stat/100). |
| `cast_time_reduction` | points | Cast times ÷ (1 + stat/100). |
| `crit_chance` | points | Percent chance that an action's damage or heal crits. |
| `crit_multiplier` | points | A crit multiplies by this percent (150 is ×1.5). Crit damage raises it. |
| `evasion` | points | Percent chance to evade a hit, after Accuracy, under its cap. |
| `accuracy` | points | Reduces the target's Evasion, down to 0. Negative adds to it. |
| `healing_received` | points | Heals received × (1 + stat/100). Rot lowers it. |
| `forced` | points | Above 0: Taunting. A foe's first pick must go to a Taunting unit unless its action has Seek. |
| `forbidden` | points | Above 0: Hidden. Foes can't pick this unit by any targeting but `all`, unless every candidate is Hidden. |

Every other stat (MP regen, Thorns, Lifesteal, Siphon, Double strike and the rest) is a registry entry that `brings` a status while it's above 0.

## Stat families

| Key | Meaning |
| --- | --- |
| `immune:status:<status>` | Above 0: immune to that status. |
| `immune:kind:<kind>` | Above 0: immune to every status containing that effect kind. |
| `immune:kind:<kind>:<tag>` | Above 0: immune to statuses containing that effect kind with that tag (a lockout's `covers`, a stat change's stat, a boost's or modifier's tag). |
| `immune:debuffs` | Above 0: immune to every debuff. |
| `immune:damage` | Above 0: takes no damage (IMMUNE), and so is immune to statuses that deal damage. |
| `immune:dispel` | Above 0: none of its buffs can be removed. |

## Control resistance (`ruleset.control`)

Control resistance: hidden stacks, no icon.

| Field | Meaning |
| --- | --- |
| `ranks` | Enemies of these ranks resist control. |
| `statuses` | The control statuses: each one that lands adds a hidden stack (a Chill shatter's Stun included). One that doesn't land (Fizzle, an immunity) adds nothing. |
| `resist` | From `at` stacks, they land for pct % of their own length, and the battle text says RESISTED. |
| `cap` | The most stacks. At the cap they don't land at all, the battle text says IMMUNE, and they add no stack. |
| `drain` | One stack drains away this many ticks after the last stack was gained or lost, so a party that isn't chaining control sits near zero. |

## Upgrades (`upgrades`)

Training is learning an ability, taking an ability's or the passive's power step, or taking its version A or B; the power step and a version are two trainings, in either order, and the version and its power step together are the `ap` or `bp` form.

| Field | Meaning |
| --- | --- |
| `id` | The ability, or the passive status, it upgrades. Its five forms are content under fixed ids: <id>__p, <id>__a, <id>__b, <id>__ap and <id>__bp (UPGRADE_FORMS). |
| `class` | The class it belongs to. |
| `kind` | ability: each form is an ability of the class, in pack.abilities. passive: each form is a status, in pack.statuses, that takes the passive status's place. |
| `power` | The power step's card. |
| `a` | Version A. |
| `b` | Version B. |
| `note` |  |

Its five forms, each content under the id `<id>__<form>`: an ability of the class for an ability's upgrade, a status for a passive's. A party unit equips a form in its ability's place, and names its passive's form in `passive`.

| Form | Meaning |
| --- | --- |
| `p` | The power step: more of the same. |
| `a` | Version A. |
| `b` | Version B. |
| `ap` | Version A with the power step. |
| `bp` | Version B with the power step. |
