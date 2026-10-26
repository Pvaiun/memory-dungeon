# Core set: rules and vocabulary

Oct 23, 2026 · @Paul Suddaby

*Updated Oct 26, 2026, when the campaign work joined main: the rules the director changed after playing it (the campfire, the opening by slot, lost casts, enrage, Aggro and draw, Armor's formula, Bleed for Poison, Stun's pause, the status scaling rule) are written in here. `DECISIONS.md` has each one's reasons.*

The game rules, the combat system and the vocabulary for the first playable version. The classes are in *Core set: classes*, the gear and formation pieces in *Core set: gear and formation lists*, and the enemy side in *Core set: enemies*.

## The game

A party-based dungeon crawler in the style of classic JRPGs, with fully automatic combat. Preparation is the game: the player chooses which units to bring, what each one carries and where each one stands, then watches. When a party loses, the player works out why from what they saw and tries a different build.

Enemy stats are hidden, so players learn everything by watching fights, which are shown mostly as text and numbers, in the style of Game Boy-era RPGs.

It's an optional game inside a personal productivity app made for someone with ADHD. Completing real-life tasks pays unlocks: a new class, a formation or a powerful piece of gear. Dungeons pay ordinary gear. So every class is a reward the player earns one at a time, and each should be worth getting on its own.

### Units and parties

- Every unit is a class. The player owns each class once, and a party holds at most one of each.
- Parties are up to 5 units. The first playable version will probably use parties of 3.
- Units don't level up; gear makes them stronger.
- Players start with the Knight, Cleric and Ranger. The other 13 classes are unlocks.

### Classes

- A class has a passive that only it has, abilities, and the weapon kinds it can use.
- Each element's staff is its own weapon kind, so a class can have every element's staff or only some.
- A unit's weapon sets its basic attack. A staff's element applies to that basic attack only: an ability's element, if it has one, belongs to the ability, whatever weapon its unit carries.
- A basic attack's type comes from its weapon: a staff's is magical, and every other weapon's is physical. A basic attack is plain damage of the weapon's type; only passives and statuses add anything to it.
- Any ability can be physical or magical, as its description says, and a class can mix both.
- Passives and abilities change how a unit behaves, rather than just adding numbers. They're mostly bespoke, but built from the core set's pieces.
- A passive can keep its own behind-the-scenes state, with no icon, outside the core set, as long as its effect shows in the numbers.
- In the core set each class is a skeleton: one or more weapon kinds, a passive, three abilities and a plan. The final game will give classes more abilities and choices.

### Formations and gear

- The party stands in a formation of three slots, one per unit. A slot changes the unit's numbers, not where it is: there's no battlefield geometry. The same units in a different formation can beat a different boss.
- Each unit carries three pieces of gear: one weapon, one armor and one amulet.
- Gear and formations are power multipliers in the first playable. Even if they might have a large impact on the outcome due to player experimentation, for content design we don't count gear and formations as explicit answers: a class's answers come from its own kit.
- The full rules are under Gear, Formations, and Floors and caps below.

### Dungeons

- A few automatic fights, then a boss.
- HP, MP and knockouts carry between fights. A unit knocked out stays knocked out in later fights until something revives it, which can happen in any later fight.
- Nothing restores HP or MP between fights, except one **campfire** a run (the campaign, Oct 25–26, 2026): after half the run's regular fights, rounded up, the player picks one of REST (everyone standing regains 40% of max HP), FOCUS (60% of max MP) or RAISE (one knocked-out member of their choice stands with 40% of its HP; offered only when someone is down).
- Statuses don't carry over: every status ends when its fight ends.
- Losing costs nothing, and retries are free.

### Encounters and enemies

- Encounters are designed as puzzles: a party brings strengths, a boss has gimmicks that call for them, and raw power can partly make up for a missing strength.
- A fight holds at most 8 foes.
- **Summoning.** A unit can bring new foes into a fight, up to the 8-foe cap; they count toward it.
- No unit leaves a fight alive: nothing flees, fades or escapes.
- Enemies use the same rules and stats as the party, and can use the same statuses and effects. Doom and Bulwark are enemy-only statuses.

### Design rules

- Units and classes have no element. Each unit has its own resistance to each element, and a resistance can be negative: elemental weaknesses and strengths exist, set unit by unit.
- There's no fixed wheel where one element beats another. Each element has a thematic gameplay shape, rhythm or utility (see Elements). These are themes for its abilities, not rules: any element can still do anything.
- There's no battlefield geometry and no positioning.
- This is an auto-battler: abilities can have targeting rules, but no mechanic can need very smart targeting or timing.

## Combat system

Fights run in real time, in ticks, with no orders: each unit acts on its own, from its slotted abilities and its basic attack. The combat system's numbers are placeholders, and it can gain new mechanics when a design needs one.

### Time and actions

- Fights run in real time, counted in ticks. Nobody gives orders.
- Every action, basic attack or ability, has a cast time (a wind-up), a cooldown and a short recovery. Basic attacks have no wind-up by default. Wind-up, cast time and cast speed are the same thing; other docs often say cast speed.
- When a unit is free, it uses the first of its abilities that's ready, in the order the player slotted them, and otherwise its basic attack.
- Abilities cost MP. Besides its cooldown, an ability can have a trigger condition and a targeting rule.
- An ability is ready only when it's off cooldown, its condition (if it has one) is true, and the unit has the MP to pay for it. MP is paid when the action resolves, at the end of its wind-up. If the unit no longer has enough MP then, the ability fizzles: it does nothing and no MP is spent, but it still goes on cooldown. This is unrelated to the Fizzle stacking rule.
- Every action starts the fight partly charged. A party unit's abilities are charged by the order they're slotted in: the first starts with 20 ticks of its cooldown done, the second 12, the third 6, so the order is part of a build. Basic attacks, and every action of a foe, start a third to two thirds charged, by their own roll, so nothing lines up on the first ticks. Copies of the same enemy start 1.5 ticks apart.
- An action interrupted in its wind-up goes on cooldown, and one whose targets are gone when it resolves costs its recovery.
- **Enrage.** Past 300 ticks, every unit on both sides deals 25% more damage, and 25% more again every 30 ticks, so no fight stalls.
- Damage doesn't interrupt a cast; only a knockout or an interrupting lockout does.
- **Firing.** An ability fires as soon as it's ready. It waits only when firing would do literally nothing; reapplying a status that refreshes counts as doing something. Its description says what it waits for, and its targeting conditions are followed as written.
- **Fizzle statuses.** An ability that applies Stun, Silence, Aegis or Doom skips targets that already have it and takes the next one its target phrase allows: Hush goes to the foe with the next-highest Attack or Magic. If every candidate already has it, an ability that only applies the status waits; one that also deals damage, like Shield bash or Tremor, fires anyway at its usual target, dealing its damage without the status. A Shield at its cap counts as already there under this rule: an ability that adds Shield skips a capped ally for the next one its target phrase allows, and waits if every candidate is capped.

### Targeting

- Units mostly attack a random foe, weighted by **draw**, which comes from Aggro, a stat every unit has (see Aggro and draw below).
- A unit can be made the forced target of foes (Taunt) or made untargetable (Hidden).
- An ability's targeting rule can pick its own targets instead, by any condition. Targeting rules come free with any ability and aren't a piece.
- **Seek** is a keyword an ability can carry: its targeting gets past Taunt.
- **Taunt rule.** Taunt decides only the first target an ability or basic attack picks. For that pick, if any foe is Taunting and the ability doesn't have Seek, only Taunting foes can be picked, whatever the target phrase asks for: an ability aimed at the foe with the most Burn hits a Taunting foe even if it has no Burn. Extra targets after the first (Arc's second hit, Chain lightning's other foes) ignore Taunt. When several units Taunt, foes pick among them weighted by draw.
- **Hidden rule.** Foes can't pick a Hidden unit as a target, by any targeting, Seek included; only their all-foes effects (Area) reach it. Its allies can still pick it. No unit in the first pass is both Hidden and Taunting.
- Basic attacks have no targeting rules: they always use the default, a random foe under the Taunt rule. Passives can change this: the Ranger's Hunter's eye ignores Taunt, and the Stormcaller's Arc adds a hit on a second, random foe.

**Aggro and draw** (the director's rule, Oct 26, 2026). Aggro is centred on 100: a class's or enemy's Aggro word n (1 to 5) is 70 + 10n (80, 90, 100, 110, 120), and gear and formation slots add ±10 a step. Aggro is never below 1. Foes don't pick in proportion to Aggro but to draw: with d how far a unit's Aggro is from 100, draw = 100 × (50 + 3d) ÷ (50 + d) above 100, and 100 × (50 + d) ÷ (50 + 3d) below it. An ordinary unit draws 100; none draws more than three times that, or less than a third; +d and −d cancel. A unit's chance to be picked is its draw over the total draw of the units that can be picked. Aggro 80 draws 64, 90 75, 110 133, 120 157, 140 189; a Knight, Cleric and Ranger at 140, 60 and 70 are picked 63%, 18% and 19% of the time.

The target phrases in ability descriptions each mean exactly this, and are used word for word. "An ally" always includes the caster, unless the phrase says "other".

| Phrase | Means |
| --- | --- |
| A random foe | Any foe, weighted by draw (from Aggro). |
| A random foe that isn't Taunting | Any foe without Taunt, weighted by draw. If every foe is Taunting, any foe. Only abilities with Seek use it. |
| The foe with the lowest current HP | The foe whose HP is lowest right now. Ties are broken at random. |
| The foe with the highest Attack or Magic | For each foe, take its Attack or its Magic, whichever is higher, and pick the foe whose number is highest. Ties are broken at random. |
| The foe with the most Burn (or Chill, or Sunder) | The foe holding the most stacks of that status. If no foe has any, a random foe. |
| A random foe with a buff | Any foe holding at least one buff, weighted by draw. |
| A second, random foe (Arc) | A random foe other than the first target. The Taunt rule doesn't apply. |
| Up to three other random foes (Chain lightning) | Up to three different random foes, none of them the first target; fewer if there aren't enough foes. The Taunt rule doesn't apply. |
| A random foe, ignoring Aggro (Fickle) | Enemy-only, with Seek. Any foe, all equally likely. |
| The foe with the highest current HP that isn't Taunting (Skips the tank) | Enemy-only, with Seek. The foe without Taunt whose HP is highest right now; if every foe is Taunting, the highest among them. Ties are broken at random. |
| The ally with the lowest share of max HP | The ally whose current HP divided by max HP is lowest, the caster included. Ties are broken at random, so at full HP it's any ally. |
| The other ally with the lowest share of max HP | The ally other than the caster whose current HP divided by max HP is lowest. Used by abilities that give something to the caster and one other ally. Ties are broken at random. |
| The ally with the highest Attack or Magic | As for foes, the caster included. |
| A random ally | Any living ally, the caster included, all equally likely. |
| A random ally with a debuff | Any ally with a debuff, the caster included, all equally likely. |
| One random other ally with a debuff | Any ally other than the caster that has a debuff, all equally likely. |
| A random knocked-out ally | Any knocked-out ally, all equally likely. |
| Every foe | All living foes, Hidden ones included. |
| Every ally | All living allies, Hidden ones included. |

### Damage

- **Physical** damage is slashing, piercing or blunt. Evasion is a chance to dodge it, whether it comes from a basic attack or an ability. Armor reduces each hit to hit² ÷ (hit + k × Armor), with k = 0.25 (the director's Path of Exile formula, Oct 26, 2026): nearly linear against big hits, a bigger share off small ones, and never a blank, so every point of Armor helps and many small hits still do poorly against heavy armor.
- The three physical types behave the same by default: Evasion and one Armor stat cover them all. A type is only a tag that gear, passives and statuses can hook into.
- **Magical** damage carries an element. It can't be dodged, and the target's resistance to that element reduces it by a percentage. Negative resistance is a weakness; full resistance is immunity; resistance past full is absorption, where the damage heals instead.
- There's no untyped magic: a unit that resists magic in general has the same resistance in every element.
- **Untyped** damage has no type or element: it can't be dodged, and Armor and resistance don't reduce it.
- Hits can crit.
- Every amount states what it scales from, and any stat can be a scaling source, weapons included: a weapon's damage can scale from any stat. Physical things scaling from Attack, and magical things from Magic, is only a convention.
- A status carried by a hit lands even when the hit is resisted, fully resisted included. A dodged hit or an absorbed one applies nothing.

**Hits.** A hit is damage from an ability or a basic attack. Damage from anything else, such as Thorns or a status tick, isn't a hit.

- Each hit of a multi-hit ability is a separate hit: it can be dodged, mitigated and crit, applies its own effects, and counts toward anything that counts hits.
- A basic attack is a hit made by a basic attack, not by an ability. Double strike's second strike and Arc's second hit are hits, not basic attacks. Nothing that reacts to basic attacks (Double strike, Arc, Kindling, Cold hex) triggers from them unless it says so, as Iron palm does, so nothing chains.
- Unless an ability says otherwise, all its hits go to its first target. If that target is knocked out partway, the ability stops.
- Thorns is a reaction, not a hit: its damage is untyped and isn't mitigated, like a status tick.

Damage resolves in this order:

1. Dodge check
2. Base amount and scaling, including scaling from a condition instead of a stat (Judgement, Brittle, Pyre)
3. The attacker's boosts
4. The target's damage-taken modifiers
5. Crit
6. Mitigation (Armor or resistance)
7. Aegis: blocks the damage if it's above 25% of the holder's max HP
8. Shields
9. HP

### Weapons

Each weapon is its own kind, every staff included, and a class can use more than one kind. There's no melee or ranged: the physical options are there for different attack speeds and to support fantasy. Each staff's speed follows its element's rhythm. Fist weapons are a kind the classes added; every kind is used by at least two classes.

| Weapon | Speed | Damage | Classes |
| --- | --- | --- | --- |
| Dagger | Fast | Piercing | Ranger, Bard, Assassin |
| Fist weapons (knuckles, claws, cestus) | Fast | Blunt | Monk, Vampire |
| Sword | Medium | Slashing | Knight, Bramble knight, Hoplite, Paladin, Valkyrie, Assassin, Vampire |
| Bow | Medium | Piercing | Ranger, Bard |
| Spear | Medium | Piercing | Hoplite, Valkyrie, Monk (as a fighting staff) |
| Axe | Slow | Blunt | Knight, Geomancer (as a war hammer) |
| Fire staff | Slow | Fire | Pyromancer, Geomancer |
| Lightning staff | Fast | Lightning | Stormcaller, Pyromancer |
| Wind staff | Fast | Wind | Stormcaller, Frostweaver |
| Earth staff | Medium | Earth | Geomancer, Bramble knight (living wood) |
| Ice staff | Medium | Ice | Frostweaver, Hexer |
| Light staff | Medium | Light | Cleric, Paladin, Valkyrie |
| Dark staff | Medium | Dark | Hexer, Vampire (a side option: its Magic is low) |

A second staff changes the element of basic attacks only, and passives that work on basic attacks keep working. For example, a Pyromancer with the fast Lightning staff adds Burn more often than with its slow Fire staff, but each hit is weaker.

### Stats every unit has

HP, MP, MP regeneration, Attack, Magic, Armor, a resistance to each element (which can be negative), Crit chance and Aggro.

### Statuses and special stats

- A **status** is a special state on a unit that the player understands as having been put there by someone or something. It shows on the unit as feedback.
- A **special stat** is a stat outside the set every unit has. It's zero by default, isn't shown on the stat sheet until something changes it, and is always active while the unit has it.

A status can:

- change stats, up or down;
- raise the damage or healing a unit deals, by kind: basic attacks, abilities, physical, magical, one physical type or one element;
- change how much damage a unit takes, of every kind or one kind;
- soak a pool of damage before HP (a shield);
- lock out some of a unit's actions (all, basic attacks only, or abilities only), optionally cancelling a wind-up;
- add an extra piece of damage to a unit's attacks, or change their element;
- do something on a timer: deal damage, heal, restore or drain MP, or apply another status;
- react to events: being hit, landing a hit, dodging, missing, dealing or taking damage, losing HP, being healed, starting, finishing or being interrupted in an action, gaining or losing a status, a unit being knocked out, or the fight starting.

Each status has one fixed definition and does the same specific thing every time it's applied. A status has no variants: a version that affects only one element or one kind of damage is a separate status, with its own name.

### How statuses stack and end

- **Refresh:** reapplying replaces the old copy.
- **Fizzle:** reapplying fails while it's there.
- **Stacks:** each application adds stacks to one shared total, and the effect scales with the total. The total can drop on each timer or event (halve each time, or lose one), and the status ends when it falls below one stack.
- **Pool (Shield):** each application adds to one shared pool per unit, up to the pool's cap. The pool has no timer: the status ends when the pool is used up or the fight ends.
- **Per source:** each applier keeps its own copy; it can end when its applier is knocked out (an aura).
- A status has a duration or lasts the whole fight, and every status ends when the fight does. It can be unremovable, or survive its holder being knocked out.
- Effects can remove buffs or debuffs, and units can be immune to particular statuses or kinds of effect. Every status is either a buff or a debuff, and every status that deals damage over time is a debuff; the lists are under Vocabulary: statuses.
- A status's own damage is untyped by default. A status can instead deal physical damage: it still isn't dodged, but Armor reduces each tick as it does a hit.
- Damage-taken modifiers and shields reduce all status damage.
- Status damage isn't a hit: it can't crit, never triggers anything that reacts to hits, and doesn't count toward anything that counts hits.
- A status is fixed when it's applied. The applier's stats can set how many stacks an application adds, and nothing else: its damage boosts don't raise the status's damage. A status never scales from its applier otherwise (the director's rule, Oct 25, 2026): a stacking status scales only by the stacks applied, a single one by nothing.
- A hit's own statuses land after the hit, so a status set off by being hit (Bleed) waits for the next one.

### What players see

Only a few statuses show as icons on a unit; everything else is behind the scenes. The statuses a player meets should be few and easy to recognise. Enemy stats are hidden.

## Tiers

Every status, special stat, effect and challenge has a tier, set by its role. Tiers count across the whole set, every class and enemy together: they say how widely a piece appears, not what each class should hold. Elements aren't tiered: they're themes that touch everything.

| Tier | Role |
| --- | --- |
| Fundamental | The learnable base. Many classes and enemies use it, and players meet it in the first fights. Its variety comes from how differently it's used, not from adding more pieces. |
| Specialist | A few classes make use of it or are built around it, and a few challenges lean on it. |
| Signature | One class or one boss owns it, and it bends a rule. |

The Fundamental pieces were chosen for how they interact: pieces that answer, undo, feed or play against one another.

## Vocabulary: statuses

The vocabulary is 22 statuses, 7 special stats and 6 effects.

| Kind | Fundamental | Specialist | Signature | Total |
| --- | --- | --- | --- | --- |
| Statuses | 10 | 9 | 3 | 22 |
| Special stats | 1 | 6 | 0 | 7 |
| Effects | 3 | 3 | 0 | 6 |

Ten staples make the Fundamental base, each useful from a single application. The three elemental statuses (Burn, Chill, Shock) are built up instead: they stack and drain away, so they pay off only with upkeep.

| Status | Tier | What it does |
| --- | --- | --- |
| Bleed | Fundamental | Stacks, with no duration, and does nothing on its own. Each hit its holder takes deals untyped damage per stack (not a hit itself; past Armor and resistance), then a third of the stacks close. An inverse Shock: it pays a party that keeps the hits coming. Replaced Poison (the director, Oct 26, 2026). |
| Regen | Fundamental | Heals a share of its holder's max HP on each tick. Refresh: a single status that doesn't stack. |
| Shield | Fundamental | Soaks a pool of damage before HP, status damage included. One pool per unit, a second health bar, shown as a bar over HP. Each application adds to the pool, up to a cap of half the holder's max HP; how much an application adds scales from a stat the ability or effect names (Protect from max HP, Earthen shell from Armor, Escort's effect from max HP). The pool has no timer: it lasts until it's used up or the fight ends. Dispel removes the whole pool. If the pool proves too strong, a slow drain is the knob. |
| Might | Fundamental | Deals more damage per stack. Stacks; loses one stack on a timer. |
| Weaken | Fundamental | Deals less damage. Refresh. |
| Guard | Fundamental | Raises Armor. Refresh. Best against many small hits. |
| Stun | Fundamental | Can't act; a wind-up under way waits it out, then carries on (Silence is the interrupt). Fizzle. 5 ticks. |
| Slow | Fundamental | Longer cooldowns, wind-ups and time between attacks. Refresh. |
| Haste | Fundamental | Shorter cooldowns, wind-ups and time between attacks. Refresh. |
| Taunt | Fundamental | Foes' single-target picks must go to a taunting unit; with several taunters, draw (from Aggro) weights the pick. Refresh. Seek gets past it. |
| Burn | Specialist | Stacks. Each tick deals untyped damage per stack, then loses a share of its stacks, so it stays high only while someone keeps applying it. A much higher ceiling than a single application of anything. |
| Chill | Specialist | Stacks up to a cap; each stack slows its holder a little. Loses a share of its stacks on a timer. Full Chill is slower than Slow, and the two add. |
| Shock | Specialist | Stacks. Each time its holder acts (when an action resolves: at the end of its wind-up, or at once for a basic attack), it takes untyped damage per stack and loses some stacks, so it hurts fast units most. |
| Ward | Specialist | Raises resistance to every element. Refresh. |
| Sunder | Specialist | Stacks; each stack lowers Armor. Loses one stack on a timer. |
| Silence | Specialist | Can't use abilities, only basic attacks; loses an ability's wind-up. Fizzle. Lasts longer than Stun. |
| Hidden | Specialist | Foes can't pick it as a target, Seek included; only their Area reaches it. Its allies can still pick it. Lasts a set time and can't be removed. Refresh. |
| Rot | Specialist | Receives less healing; Shields are unaffected. Refresh. |
| Clarity | Specialist | Regenerates MP faster. Refresh. Cast on oneself or an ally. |
| Aegis | Signature | Blocks the next damage above a set share of max HP (25% for now), from any source, then ends. Checked after mitigation, before Shields. Fizzle. Small hits pass; one big one doesn't. |
| Doom | Signature (boss) | A visible countdown; at zero its holder takes heavy untyped damage. Fizzle. Cleanse removes it; Shield and Aegis soak it. |
| Bulwark | Signature (boss) | Starts with a stack count; each piercing or Wind hit removes one. At zero its holder is Stunned and takes double damage for a while, then Bulwark refills. |

**Buffs and debuffs.** Every status is either a buff or a debuff, and every status that deals damage over time is a debuff. Cleanse removes debuffs, Dispel removes buffs, and "with a buff" or "with a debuff" in a target phrase means these lists. Hidden is a buff, but it can't be removed. Taunt and Bulwark are ordinary buffs that Dispel can remove.

| Kind | Statuses |
| --- | --- |
| Buff | Regen, Shield, Might, Guard, Haste, Taunt, Ward, Hidden, Clarity, Aegis, Bulwark |
| Debuff | Bleed, Weaken, Stun, Slow, Burn, Chill, Shock, Sunder, Silence, Rot, Doom |

## Vocabulary: special stats and effects

### Special stats

Evasion is the one Fundamental special stat. The other six act through hits, basic attacks included, so they work without an ability. Classes hold special stats at a level (medium or high), listed in each class.

| Special stat | Tier | What it does |
| --- | --- | --- |
| Evasion | Fundamental | Chance to dodge a physical hit. Magical hits can't be dodged. |
| Accuracy | Specialist | Cancels that much of the target's Evasion: the physical answer to Evasion. |
| Crit damage | Specialist | Its crits hit harder. Crits land before Armor, so big crits get through it: with Sunder, the physical answer to Armor. |
| Double strike | Specialist | Chance a basic attack hits twice. Many small hits: good for breaking, bad against Armor, Thorns and hit counts. |
| Thorns | Specialist | Each time a hit lands on its holder, the attacker takes this much untyped damage. Thorns damage isn't a hit. Free: the holder spends nothing. |
| Lifesteal | Specialist | Each hit heals the holder for a share of its damage. |
| Siphon | Specialist | Each hit takes MP from its target, a share of its damage, and gives it to the holder. |

### Effects

Three Fundamental effects heal, hit everything and lift debuffs. Three Specialist ones get past Taunt, strip buffs and raise the fallen. Targeting rules come free with any ability and aren't a piece.

| Effect | Tier | What it does |
| --- | --- | --- |
| Heal | Fundamental | Restores HP to allies. |
| Area | Fundamental | Hits every foe, Hidden ones included. |
| Cleanse | Fundamental | Removes debuffs from an ally. |
| Seek | Specialist | A keyword an ability can carry: its targeting gets past Taunt. Without it, a taunt decides every single-target pick. |
| Dispel | Specialist | Removes buffs from a foe. |
| Revive | Specialist | Raises a knocked-out ally with some HP, even one knocked out in an earlier fight. The ally comes back with every action on cooldown, as at the start of a fight. |

One class overrides Revive's cooldown rule: the Valkyrie's passive, Einherjar, revives allies with all their actions ready.

## Elements

There are seven elements. Each has a job and a wind-up rhythm its abilities lean toward. These are themes, not rules: any element can still do anything.

| Element | Job |
| --- | --- |
| Fire | Ramp: long wind-ups, big casts, and Burn kept up by repeated hits. |
| Earth | Weight: normal-paced casts with low base damage and a high crit chance, so hits are usually modest and sometimes huge. Shields for allies. |
| Ice | Control: steady wind-ups and damage that build Chill, plus Slow. |
| Lightning | Spread: quick strikes that jump between foes or hit them all, plus Shock. |
| Wind | Reach: quick, light, multi-hit spells that carry Seek. |
| Light | Restore: mostly support (Heal, Regen, Cleanse, Revive, Clarity), plus a few long, costly spells that hit very hard. |
| Dark | Drain: steady spells that wear foes down, with Siphon, Lifesteal, Weaken and Rot. |

## How the Fundamentals play together

Most Fundamentals have a partner that opposes or undoes them, and two have a built-up elemental twin. Stun is the exception: it plays against wind-ups, not against another piece.

| Pieces | How they play |
| --- | --- |
| Might, Weaken | Opposite sides of damage dealt. Dispel strips Might from a foe; Cleanse lifts Weaken from an ally. |
| Haste, Slow | Opposite sides of tempo. Haste also feeds every built-up status, since a faster unit applies more stacks. |
| Guard, Sunder | Armor up, Armor down. |
| Evasion, Accuracy | A chance to dodge, and the stat that cancels it. |
| Bleed, Regen, Cleanse | Bleed bursts with every hit, Regen heals over time, Cleanse lifts Bleed outright. |
| Shield, Heal, Rot | Shield prevents and Heal mends; under Rot, only Shield still works. |
| Taunt, Seek, Area | Taunt decides who foes can pick, split by draw when several units taunt. Seek gets past it, and Area skips picking altogether. |

| Kind | Applied once, full effect | Built up and kept up |
| --- | --- | --- |
| Damage | none since Bleed replaced Poison | Burn, Bleed |
| Control | Slow | Chill |

Shock is built up too, but it drains each time its holder acts, not over time; Bleed drains each time its holder is hit.

## Gear

- **Slots.** Each unit carries one weapon, one armor and one amulet. Gear is fixed, never generated, and any number of units can equip copies of the same piece. A class arrives with the plain weapon of its first kind; its armor and amulet slots start empty.
- **Tiers.** Ordinary pieces drop in dungeons and are sidegrades at a similar power level, so progress comes from filling empty slots and finding pieces that fit a build. Powerful pieces are task rewards: a different build, or a bigger bundle that gives something up, never a pure upgrade over an ordinary piece.
- **Weapons.** The kind sets attack speed, damage type and, for a staff, element, as in the weapon table; recovery is the same for every weapon. Each weapon has a damage, a scaling ratio and a scaling stat: Attack for physical kinds, Magic for staffs, another stat on some powerful pieces. Damage is per hit and relative within the kind: a fast kind hits for less per swing and a slow kind for more. A weapon can also carry stats. Weapon damage feeds basic attacks only; abilities scale as written.
- **Armor weights.** Armor is light, medium or heavy. Each class has a heaviest weight and can wear it or anything lighter. Heavy: Knight, Bramble knight, Hoplite, Paladin, Geomancer. Medium: Ranger, Valkyrie, Bard, Monk, Assassin, Vampire. Light: Cleric, Hexer, Pyromancer, Frostweaver, Stormcaller.
- **Amulets** have no restrictions.
- **What gear carries.** The stats every unit has and the seven special stats. Steps are +1 or +2, relative to each other and not calibrated to the class scale; there are no half-steps. Special stats on gear are medium, or high on a powerful piece, never low. Resistance on gear names elements and never covers all seven. Aggro down is a bonus any piece may carry. Gear has no drawbacks, except on a powerful piece that names one. No new modifiers, and no attack speed on gear: Haste does that job. A stat that matches a weapon's scaling stat counts twice, since it raises the weapon's own damage too.
- **Budget.** An ordinary piece is worth about two steps, a special stat at medium counting as a step, judged by feel. How big a step is against a base stat, and what three gear slots and a formation slot add up to, is set in balancing.

## Formations

- A formation has three slots, one per unit, so every slot is filled. The tech keeps five for later parties. Slot order only breaks targeting ties.
- A slot changes the stats of the unit in it, up or down, or does nothing. Any stat can move, Aggro and special stats included. Slots never give statuses. Aggro in the slots is how a formation makes a front and back line, since there's no positioning.
- A formation has at most one effect, and may have none. An effect is a stat change for every ally, or a Fundamental status given to every ally on a trigger, such as the fight starting or an ally being knocked out. Effects are flat: never aimed at one unit. An effect never gives a Specialist or Signature piece, and never Taunt. An effect that needs a scaling stat names one.
- There is no budget between slots or between formations; each formation is its own thing.
- The player starts with a neutral formation: three slots that do nothing, and no effect.

## Floors and caps

- Aggro never goes below 1, and draw keeps every unit between a third and three times an ordinary unit's pull, so no unit becomes unpickable, or the only pick, by numbers alone; that's Hidden's and Taunt's job. Every other stat floors at zero, and HP at one.
- Evasion and Crit chance have caps, set in balancing and expected to sit far out of reach. Resistance from gear and formations stops short of full; immunity and absorption stay class and boss traits.

## Known gaps

Open questions in the core set, to be answered as it's developed. Each says what applies until it's answered.

### Where step 4's engine meets these rules

The engine's finer rules come from step 4 (`steps/04-combat-concepts/design.md`). What the engine does today stands as the default.

- **Time under the hood.** The engine counts 1,000 sub-ticks per tick and does all timing maths in whole numbers; players see ticks, rounded. This document counts ticks. Whether sub-ticks stay (they let Haste, Slow and Chill rescale running timers exactly), and what the player sees.
- **Same-moment order.** When several things resolve at the same moment, the engine resolves the party's batch before the enemies', and within a batch pulses, then reactions, then actions, each in formation slot order. This document says slot order only breaks targeting ties. Which order the core set wants, and whether slot order decides it.
- **Timing stats.** The engine has Attack Speed, Cooldown Reduction and Cast Time Reduction as stats, which Haste, Slow and Chill would act through. The stat list here has none of them. Whether they stay as hidden stats behind Haste, Slow and Chill, or those statuses are defined directly.
- **Dice.** Each unit draws its own dice, so the same seed brings the same luck to the same unit whatever else is in the fight. This document is silent; keep it unless a reason appears.
- **An action whose target is gone when it resolves.** Answered in the campaign (Oct 25, 2026): it spends no MP and costs its recovery, and a cast interrupted in its wind-up goes on cooldown (Time and actions).
- **A fight nobody can win.** The engine stops a fight at 5,000 ticks and counts it a loss, as a safety stop. This document sets no time limit.
- **Rounding.** The engine rounds damage down once, after mitigation, and heals after crit; shields soak whole points. The resolution order here puts Aegis and Shields after mitigation. Where rounding happens with them in the chain.
