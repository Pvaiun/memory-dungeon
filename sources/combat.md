# Core set: combat

How a fight runs: time and actions, targeting, damage, and what every unit has. The exact reference behind `docs/primer.md`. What each status, special stat and effect does is in *Core set: vocabulary* (`vocabulary.md`); weapons, gear and formations are in *Core set: gear and formations* (`gear.md`). Sizes, durations and timings are words here. The number behind each one is in `content/core-set/scale.ts`, under the name given in brackets (`STATUS.burn`, `RULES.enrage`). The classes are in *Core set: classes*, the enemy side in *Core set: enemies*, and how a run works in *Core set: the rogue mode*.

## The director's rulings

The director's standing direction on this page's subject. Direction is guidance, not law: challenge any of it with evidence. Until a line is changed here, it stands, and it wins over the rest of this page: where they differ, fix the page. When the director changes a ruling, rewrite its line; don't add history.

- **A few numerical systems:** mechanics map onto stats, statuses, damage types, flags and targeting. No bespoke words acting as locks. No battlefield geometry (no rows, no reach) and no positional targeting.
- **One kind of hit.** Every hit meets Evasion and Defense (the Path of Exile formula). A status's own damage (Burn, Shock, Bleed, Chill's shatter, Thorns) is untyped: Evasion and Defense never meet it, and it's the one way past them. There are no elements and no subtypes of hit as mechanics: an element is a theme only (names, art, a class's flavour).
- **Every amount states its own scaling,** and nothing scales by default. Attack is the one offensive stat, and anything can scale from any stat.
- **The three speed stats are stats like any other,** in class lines and on gear: Attack speed, Cooldown, Cast speed.
- **A foe's action can be called early,** as when a Taunt makes the foes swing at once. A status the action sets off is set off by its own trigger, not early.
- **MP costs are set by hand on each ability,** with no rule from a stat to a cost.
- **MP is fuel, drained by fighting.** No class regains MP in a fight by itself; regen comes only from gear and a formation seat. What differs between builds is whether they spend more HP or more MP, never how many fights they last.
- **Aggro by doubling:** a party member's draw doubles every 25 Aggro, so one unit built to draw fire takes most foes' picks (85–90% at full build).
- **A wind-up is always an ability's,** never a basic attack's.

## The game

A party-based dungeon crawler in the style of classic JRPGs, with fully automatic combat. Preparation is the game: the player chooses which units to bring, what each one wears and where each one sits, then watches. When a party loses, the player works out why from what they saw and tries another build. Enemy stats are hidden, and fights are shown mostly as text and numbers.

### Units and classes

- **Every unit is a class.** A party holds at most one of each, three to a party; the tech keeps room for five. Units don't level up.
- **A class has** a passive only it has, abilities, and the kinds of gear it can wear: three weapon kinds, one or two armor types and three offhand kinds (see Gear). Each class is a skeleton: its kinds, a passive, three abilities and a plan, and three identities a run can build it toward (*Core set: classes*). Classes may get more later.
- **A unit's weapon sets its basic attack.** The weapon's kind sets its speed, its swing (how hard it hits per tick and how much of that is the wearer's Attack) and its hands (see Weapons). A basic attack is a plain hit; only passives and statuses add anything to it.
- **An ability's damage is a hit like any other,** and its description says what it scales from.
- **Passives and abilities change how a unit behaves,** rather than just adding numbers. They're mostly bespoke, but built from the core set's pieces. A passive can keep its own hidden state, with no icon, as long as its effect shows in the numbers.

### Formations and gear

- **A formation** has three seats, one per unit. A seat changes the unit's numbers, not where it stands: there's no battlefield geometry. The same units in a different formation can beat a different boss.
- **Each unit wears four pieces:** a weapon, armor, an offhand and an amulet. A two-handed weapon leaves the offhand empty.
- **For content design, gear and formations are never counted as answers.** They're power multipliers, even where they swing a result: a class's answers to a challenge come from its own kit.
- The full rules are under Gear, Formations, and Floors and caps below.

### Fights in a run

- **What carries.** HP, MP, knockouts and ability cooldowns carry between a run's fights. A unit knocked out stays down in later fights until something revives it, in any later fight.
- **What doesn't.** Every status ends when its fight ends.
- **What restores HP and MP between fights is the mode's.** The rogue mode has its rooms (*Core set: the rogue mode*). Free play's dungeons have one campfire a run, after half the regular fights, rounded up: REST (HP), FOCUS (MP) or RAISE (one fallen member, offered only when someone is down) (`CAMPFIRE`).
- **Losing.** In free play it costs nothing; in the rogue mode a lost fight ends the run.

### Encounters and enemies

- **Encounters are designed as puzzles.** A party brings strengths, a boss has gimmicks that call for them, and raw power can partly make up for a missing strength.
- **A fight holds at most 8 foes** (`RULES.maxEnemies`). **Summoning:** a unit can bring new foes into a fight, up to that cap, and they count toward it. **No unit leaves a fight alive:** nothing flees, fades or escapes.
- **Enemies use the same rules and stats as the party,** and the same statuses and effects. Doom and Bulwark are enemy-only statuses.

### Design rules

- **Nothing has an element as a mechanic** (see Elements). There's one kind of hit, and every unit meets it with its Evasion and Defense.
- **Every foe carries some Defense,** more by rank (a floor in `enemies.ts`), so every hit meets something.
- **There's no battlefield geometry and no positioning.**
- **This is an auto-battler.** Abilities can have targeting rules, but no mechanic can need very smart targeting or timing.

## Combat system

Fights run in real time, in ticks, with no orders: each unit acts on its own, from its slotted abilities and its basic attack. The system can gain new mechanics when a design needs one.

### Time and actions

- **Every action has a wind-up, a cooldown and a short recovery,** whether it's a basic attack or an ability. Wind-up, cast time and cast speed are the same thing. Basic attacks have no wind-up.
- **What a free unit does.** It uses the first of its abilities that's ready, in the order the player slotted them, and otherwise its basic attack.
- **When an ability is ready.** It's off cooldown, its condition (if it has one) holds, and the unit has the MP to pay for it.
  - An ability can have a trigger condition, or several that must all hold, as well as a targeting rule. Both can read HP or MP as a share of max.
  - **MP is paid when the action resolves,** at the end of its wind-up. If the unit no longer has enough MP then, the ability fizzles: it does nothing and spends no MP, but still goes on cooldown. This has nothing to do with the Fizzle way of stacking.
- **MP costs are set by hand on each ability,** on one ladder in two tiers (`classes.ts`). Skills are cheap; spells cost several times more. The rungs mostly climb with the cooldown word.
- **No class regains MP in a fight by itself.** MP regen comes from gear and a formation seat (`MP_REGEN`, `MP_REGEN_STEP`), and Clarity, Refrain and Siphon give MP. Each class's MP pool is set by how many regular fights it lasts from full (`MP_POOL` in `classes.ts`).
- **Cooldowns carry between fights.** A party unit's abilities start a fight with the cooldown they had left when its last fight ended, or their full cooldown in its first fight. Nothing resets them: not between fights, not at a campfire, not between acts.
  - There's no head start by slot (`RULES.opening.slots`), but the slot order still decides which ability goes first when several are ready, so it stays part of a build.
  - Basic attacks, and every action of a foe, start a fight partly charged, by their own roll (`RULES.opening`), so nothing lines up on the first ticks. Copies of the same enemy start a little apart (`RULES.stagger`).
- **Words for time.**
  - **Cooldowns:** a party ability's is quick, short, medium, long or very long (`COOLDOWN`), and a foe's is short, medium or long (`ENEMY_COOLDOWN`). Each is moved a little by the ability's id, so no two match (`jitter`).
  - **Wind-ups:** quick, normal, long or very long (`WINDUP`). An ability's recovery is fixed.
  - **The word follows the job.** Abilities that apply stacks again and again, and small top-ups, are quick. A buff a unit puts on itself has a cooldown longer than the buff lasts. The biggest spells are long, and the revives very long.
- **Weapons' timing.** Each kind swings on its own interval (`KIND_SPEED`), and a swing's size follows its interval (`SWING_REF`), so a kind's words say what it deals per tick, not per blow (see Weapons).
- **Lost casts.** An action interrupted in its wind-up goes on cooldown. One whose targets are gone when it resolves costs its recovery.
- **Enrage.** Past a set time, every unit on both sides deals more damage, and more again at each step, so no fight stalls (`RULES.enrage`).
- **What interrupts.** Damage doesn't interrupt a cast; only a knockout or an interrupting lockout does.
- **Firing.** An ability fires as soon as it's ready. It waits only when firing would do literally nothing, and reapplying a status that refreshes counts as doing something. Its description says what it waits for, and its targeting conditions are followed as written.
- **Fizzle statuses.** An ability that applies Stun, Silence, Aegis or Doom skips targets that already have it and takes the next one its target phrase allows.
  - If every candidate already has it, an ability that only applies the status waits. One that also deals damage, like Shield bash or Tremor, fires anyway at its usual target, dealing its damage without the status.
  - A Shield at its cap counts as already there. An ability that adds Shield skips a capped ally for the next one its target phrase allows, and waits if every candidate is capped.

### Targeting

- **Units mostly attack a random foe,** weighted by **draw**, which comes from Aggro (below). Basic attacks always do, under the Taunt rule; only passives change that.
- **Taunt and Hidden.** A unit can be made foes' forced target (Taunt) or made untargetable (Hidden).
- **An ability's targeting rule** can pick its own targets instead, by any condition. Targeting rules come free with any ability and aren't a piece.
- **Seek** is a keyword an ability can carry: its targeting gets past Taunt.
- **The Taunt rule.** Taunt decides only the first target an ability or basic attack picks.
  - For that pick, if any foe is Taunting and the ability doesn't have Seek, only Taunting foes can be picked, whatever the target phrase asks for. An ability aimed at the foe with the most Burn hits a Taunting foe even if it has no Burn.
  - Targets after the first (Arc's second hit, Chain lightning's other foes) ignore Taunt.
  - When several units Taunt, foes pick among them weighted by draw.
- **The Hidden rule.** Foes can't pick a Hidden unit as a target by any targeting, Seek included; only their all-foes effects (Area) reach it. Its allies can still pick it.
- **Someone stays in the light.** Hidden never lands where it would leave the foes no ally to pick; where several would hide at once, the last in seat order stays out. If the foes are left with nobody to pick, the last in seat order steps out of hiding.
- **Taunt ends Hidden.** A unit that gains Taunt stops being Hidden, and Hidden doesn't land on a Taunting unit.

**Aggro and draw.** Aggro is centred on 100. A class's or enemy's Aggro word sets it, and gear and seats move it in steps (`aggroOf`, `AGGRO_STEP`). Aggro is never below 1. A unit's chance to be picked is its draw over the total draw of the units that can be picked, and an ordinary unit (Aggro 100) draws 100.

- **Foes picking a party member.** Every 25 Aggro doubles a party unit's draw, and every 25 below 100 halves it, climbing evenly between doublings. Aggro counts between 25 and 200, so a party unit draws between an eighth and 16 times an ordinary unit's (`RULES.partyDraw`).
  - A seat that draws far more doubles a unit's draw; a gear step adds a third to two fifths.
  - A defender built to draw fire takes most foes' picks on its own: 85% to 90% at full build.
- **The party picking a foe.** A gentler curve: no foe draws more than three times an ordinary unit, or less than a third, and +d and −d cancel (`RULES.draw`).

The target phrases in ability descriptions each mean exactly this, and are used word for word. "An ally" always includes the caster, unless the phrase says "other".

| Phrase | Means |
| --- | --- |
| A random foe | Any foe, weighted by draw. |
| A random foe that isn't Taunting | Any foe without Taunt, weighted by draw. If every foe is Taunting, any foe. Only abilities with Seek use it. |
| The foe with the lowest current HP | The foe whose HP is lowest right now. Ties are broken at random. |
| The foe with the highest Attack | The foe whose Attack is highest. Ties are broken at random. |
| The foe with the most Burn (or Chill, or Sunder) | The foe holding the most stacks of that status. If no foe has any, a random foe. |
| A random foe with a buff | Any foe holding at least one buff, weighted by draw. |
| A second, random foe (Arc) | A random foe other than the first target. The Taunt rule doesn't apply. |
| Up to three other random foes (Chain lightning) | Up to three different random foes, none of them the first target; fewer if there aren't enough foes. The Taunt rule doesn't apply. |
| A random foe, ignoring Aggro (Fickle) | Enemy-only, with Seek. Any foe, all equally likely. |
| The foe with the highest current HP that isn't Taunting (Skips the tank) | Enemy-only, with Seek. The foe without Taunt whose HP is highest right now; if every foe is Taunting, the highest among them. Ties are broken at random. |
| The ally with the lowest share of max HP | The ally whose current HP divided by max HP is lowest, the caster included. Ties are broken at random, so at full HP it's any ally. |
| The other ally with the lowest share of max HP | The ally other than the caster whose current HP divided by max HP is lowest. Used by abilities that give something to the caster and one other ally. Ties are broken at random. |
| The ally with the highest Attack | As for foes, the caster included. |
| A random ally | Any living ally, the caster included, all equally likely. |
| A random ally with a debuff | Any ally with a debuff, the caster included, all equally likely. |
| One random other ally with a debuff | Any ally other than the caster that has a debuff, all equally likely. |
| A random knocked-out ally | Any knocked-out ally, all equally likely. |
| Every foe | All living foes, Hidden ones included. |
| Every ally | All living allies, Hidden ones included. |

### Damage

- **One kind of hit.** Damage is a hit or a status's own; there are no elements and no subtypes of hit.
- **Every hit** meets Evasion and Defense.
  - **Evasion** is a chance to dodge it, from a basic attack or an ability alike. A unit holding Blur dodges the next hit outright, whatever its Evasion and the attacker's Accuracy.
  - **Defense** reduces each hit to hit² ÷ (hit + k × Defense) (`RULES.armorK`), the Path of Exile formula. That's nearly linear against big hits, takes a bigger share off small ones, and never blanks a hit. Every point of Defense helps, and many small hits do poorly against high Defense.
- **Untyped** damage is a status's own (Burn, Shock, Chill's shatter, Bleed, Doom), and Thorns. It can't be dodged, and Defense doesn't reduce it. A foe's status can be given a hit's damage instead (see How statuses stack and end).
- **Hits are also a tag** that gear, passives and statuses can hook into: a boost or a damage-taken modifier can name hits alone and leave a status's own damage out, as the Ghost's Incorporeal does.
- **Crits.** Hits can crit. A crit deals half again as much as the hit, and the Crit damage special stat adds to that (`SPECIAL.crit_damage`). A class's Crit chance word reads a table (`CRIT_TABLE`), and Crit chance on gear reads the same table.
- **Scaling.** Every amount states what it scales from, and any stat can be a scaling source, weapons included. Attack is the one offensive stat and the usual source, but that's only a convention.
- **Statuses on hits.** A status carried by a hit lands in full, whatever Defense takes off the hit. A dodged hit applies nothing.

**Hits.** A hit is damage from an ability or a basic attack. Damage from anything else, such as Thorns or a status tick, isn't a hit.

- Each hit of a multi-hit ability is a separate hit: it can be dodged, mitigated and crit, applies its own effects, and counts toward anything that counts hits.
- A basic attack is a hit made by a basic attack, not by an ability. Double strike's second strike and Arc's second hit are hits, not basic attacks. Nothing that reacts to basic attacks (Double strike, Arc, Kindling, Cold hex) triggers from them unless it says so, as Iron palm does, so nothing chains.
- Unless an ability says otherwise, all its hits go to its first target. If that target is knocked out partway, the ability stops.
- Thorns is a reaction, not a hit: its damage is untyped and isn't mitigated, like a status tick.

Damage resolves in this order:

1. Dodge check (Blur first: a unit holding it dodges, and the Blur is spent)
2. Base amount and scaling, including scaling from a condition instead of a stat (Judgement, Pyre)
3. The difficulty dials: the fight's knob for a foe, and the enrage. They scale the hit as a step of their own, so every boost and cut after them is a share of the dialled hit, and Weaken halves a hit at any knob.
4. The attacker's boosts: statuses (Might, Weaken, Shock), gear and passives, added together
5. The target's damage-taken modifiers
6. Crit
7. Mitigation (Defense)
8. Aegis: blocks the damage if it's above a set share of the holder's max HP
9. Shields
10. HP

### Stats every unit has

HP, MP, MP regeneration, Attack, Defense, Crit chance and Aggro. The three speed stats (Attack speed, Cooldown, Cast speed) are special stats: zero unless a class line or gear carries them.

### What players see

Only a few statuses show as icons on a unit; everything else is behind the scenes. The statuses a player meets should be few and easy to recognise. Enemy stats are hidden.

## Floors and caps

- **Draw.** Aggro never goes below 1, and draw keeps every party unit between an eighth and 16 times an ordinary unit's pull, and every foe between a third and three times. So no unit becomes unpickable, or the only pick, by numbers alone: that's Hidden's and Taunt's job.
- **Floors.** Every other stat floors at zero, and HP at one. Max HP floors at half a point.
- **Caps.** Evasion and Crit chance have caps, set in balancing and meant to sit far out of reach (`vocabulary.ts`).

## Known gaps

Open questions where the engine (`src/engine/`) and these rules meet. Where this document is silent, what the engine does today stands.

- **Time under the hood.** The engine counts 1,000 sub-ticks per tick and does all timing maths in whole numbers; players see ticks, rounded. Open: whether sub-ticks stay (they let Haste, Slow and Chill rescale running timers exactly), and what the player sees.
- **Same-moment order.** When several things resolve at the same moment, the engine resolves the party's batch before the enemies', and within a batch pulses, then reactions, then actions, each in seat order. This document says seat order only breaks targeting ties. Open: which order the core set wants, and whether seat order decides it.
- **Timing stats.** Haste, Slow and Chill act through the three speed stats (Attack speed, Cooldown, Cast speed), which are stats like any other: class lines, gear and seats carry them, and the sheet shows them when they're above zero.
- **Dice.** Each unit draws its own dice, so the same seed brings the same luck to the same unit whatever else is in the fight. Keep it unless a reason appears.
- **A fight nobody can win.** The engine stops a fight at 5,000 ticks and counts it a loss, as a safety stop.
- **Rounding.** The engine rounds damage down once, after mitigation, and heals after crit; shields soak whole points. Open: where rounding happens with Aegis and Shields in the chain.
