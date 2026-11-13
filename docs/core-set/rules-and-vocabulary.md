# Core set: rules and vocabulary

The combat system and the vocabulary that every class, piece and enemy is built from: the exact reference behind `docs/primer.md`. Sizes, durations and timings are words here. The number behind each one is in `content/core-set/scale.ts`, under the name given in brackets (`STATUS.burn`, `RULES.enrage`). The classes are in *Core set: classes*, the enemy side in *Core set: enemies*, and how a run works in *Core set: the rogue mode*. Where `docs/rules.md` and this document differ, `docs/rules.md` wins.

## The game

A party-based dungeon crawler in the style of classic JRPGs, with fully automatic combat. Preparation is the game: the player chooses which units to bring, what each one wears and where each one sits, then watches. When a party loses, the player works out why from what they saw and tries another build. Enemy stats are hidden, and fights are shown mostly as text and numbers.

### Units and classes

- **Every unit is a class.** A party holds at most one of each, three to a party; the tech keeps room for five. Units don't level up. The Knight, Cleric and Ranger are the starters.
- **A class has** a passive only it has, abilities, and the kinds of gear it can wear: two weapon kinds, one or two armor types and two offhand kinds (see Gear). Each class is a skeleton: its kinds, a passive, three abilities and a plan, and three identities a run can build it toward (*Core set: classes*). Classes may get more later.
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
- **MP costs are set by hand on each ability,** on one ladder in two tiers (`classes.ts`). Skills (the walls', the fighters' and the Valkyrie's spear) are cheap. Spells (the healers', the Bard's, Hexer's and Paladin's, the four mages', the Vampire's dark arts) cost several times more. The rungs mostly climb with the cooldown word.
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
  - **Evasion** is a chance to dodge it, from a basic attack or an ability alike.
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

1. Dodge check
2. Base amount and scaling, including scaling from a condition instead of a stat (Judgement, Pyre)
3. The attacker's boosts
4. The target's damage-taken modifiers
5. Crit
6. Mitigation (Defense)
7. Aegis: blocks the damage if it's above a set share of the holder's max HP
8. Shields
9. HP

### Weapons

Twelve kinds, each a speed, hands and three words: a swing, a scaling and a budget (`KIND_WORDS` in `scale.ts`). Every class uses two kinds, at most three classes use a kind, two classes share at most one kind, and every class has a one-handed kind. There's no melee or ranged: the kinds are there for different speeds, different swings and the fantasy. Each kind's interval is in `KIND_SPEED`: fast is under 7.5 ticks, slow over 10.5.

- **Swing:** how hard the kind hits per tick at the reference Attack: light, full or heavy (`SWING_POWER`). A swing's size per blow follows its interval, so a fast kind hits for less per blow and a slow one for more.
- **Scaling:** what share of that swing is the wearer's Attack: base-heavy, even or Attack-heavy (`SWING_SCALING`). A base-heavy swing works for any wearer; an Attack-heavy one turns the wearer's own Attack into damage and rewards stacking it. Attack is never the signature of an Attack-heavy kind, so the Attack a sword or great weapon carries feeds the wearer's abilities rather than cancelling against its own swing.
- **Budget:** how many stat steps the kind's pieces carry at each rarity: lean, standard or rich (`KIND_BUDGET`). A kind pays for its swing in budget or the other way round; a two-hander takes both sides, being worth a weapon and an offhand.
- **Signature and commons.** Each kind has a signature stat every wearer reads, and a few common stats its pieces lean to; a piece of a kind is relevant to every class that can wear it.
- **Within a kind,** the words are the default. A piece may step along the trade (a heavy piece swings harder for a step fewer, a light one lighter for a step more: `SWING_TRADE`), take another scaling, or swing from another stat (the Heartsplitter's max HP), and its card says so. Rarity buys stats and effects, never the swing. Every piece carries stats at every rarity.

| Weapon | Speed | Hands | Swing | Scaling | Budget | Signature | Classes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Dagger | Fast | One | Light | Attack-heavy | Standard | Crit chance | Ranger, Assassin |
| Fist weapons (knuckles, claws, cestus) | Fast | One | Light | Even | Standard | Double strike | Monk, Vampire, Stormcaller |
| Wand | Fast | One | Light | Base-heavy | Rich | Cooldown | Bard, Hexer, Pyromancer |
| Sword | Medium | One | Full | Even | Standard | Attack | Knight, Hexer, Valkyrie |
| Spear | Medium | One | Full | Even | Standard | Aggro | Hoplite, Valkyrie, Monk |
| Axe | Medium | One | Heavy | Attack-heavy | Lean | Lifesteal | Vampire, Assassin |
| Bow | Medium | Two | Heavy | Attack-heavy | Standard | Crit damage | Ranger, Bard |
| Rune sword | Slow | One | Full | Base-heavy | Standard | MP regen | Frostweaver, Stormcaller |
| Hammer | Slow | One | Heavy | Base-heavy | Lean | Defense | Knight, Bramble knight, Geomancer |
| Mace | Slow | One | Light | Base-heavy | Rich | HP | Cleric, Paladin, Bramble knight |
| Staff | Slow | Two | Light | Base-heavy | Rich | Cast speed | Cleric, Pyromancer, Frostweaver |
| Great weapon (greataxe, maul, pike, scythe) | Slow | Two | Heavy | Even | Rich | Attack | Hoplite, Paladin, Geomancer |

The axe and the hammer are the great weapon's one-handed cousins. A second kind changes basic attacks: a Knight's hammer hits like a falling hill without the Attack the Knight lacks, and its sword grows with the Attack it carries. Passives that work on basic attacks keep working. The interface shows a weapon's damage per tick for its holder beside its speed and scaling, so two kinds' swings compare.

### Stats every unit has

HP, MP, MP regeneration, Attack, Defense, Crit chance and Aggro. The three speed stats (Attack speed, Cooldown, Cast speed) are special stats: zero unless a class line or gear carries them.

### Statuses and special stats

- A **status** is a special state on a unit that the player understands as having been put there by someone or something. It shows on the unit as feedback.
- A **special stat** is a stat outside the set every unit has. It's zero by default, isn't shown on the stat sheet until something changes it, and is always active while the unit has it.

A status can:

- change stats, up or down;
- raise the damage or healing a unit deals, by kind: basic attacks, abilities, hits, or one status's damage;
- change how much damage a unit takes, of every kind or one kind;
- soak a pool of damage before HP (a shield);
- lock out some of a unit's actions (all, basic attacks only, or abilities only), optionally cancelling a wind-up;
- add an extra piece of damage to a unit's attacks;
- do something on a timer: deal damage, heal, restore or drain MP, or apply another status;
- react to events: being hit, landing a hit, dodging, missing, dealing or taking damage, losing HP, being healed, starting, finishing or being interrupted in an action, gaining or losing a status, a stacking status reaching its cap (Chill's shatter), a unit being knocked out, or the fight starting.

Each status has one fixed definition and does the same specific thing every time it's applied. A status has no variants: a version that affects only one kind of damage is a separate status, with its own name.

### How statuses stack and end

- **Refresh:** reapplying replaces the old copy.
- **Fizzle:** reapplying fails while it's there.
- **Stacks:** each application adds stacks to one shared total, and the effect scales with the total. The total can drop on each timer or event (halve each time, or lose one), and the status ends when it falls below one stack. A status starts at one stack: on a unit that doesn't hold it, applications under one stack wait on that unit and add up, doing nothing and never fading, until together they make a stack; then the status lands with all of them.
- **Pool (Shield):** each application adds to one shared pool per unit, up to the pool's cap. The pool has no timer: the status ends when the pool is used up or the fight ends.
- **Per source:** each applier keeps its own copy; it can end when its applier is knocked out (an aura).

How statuses end, and what they can't do:

- **Length.** A status has a duration or lasts the whole fight, and every status ends when the fight does. It can be unremovable, or survive its holder being knocked out.
- **Removal and immunity.** Effects can remove buffs or debuffs, and units can be immune to particular statuses or kinds of effect. Every status is either a buff or a debuff, and every status that deals damage over time is a debuff (the lists are under Vocabulary: statuses).
- **A status's own damage is untyped:** it isn't dodged, and Defense doesn't reduce it. A status can still be given a hit's damage, which meets what a hit meets (Evasion, Defense); only foes use that (the Bomb Bug's death blast).
- **Status damage and defences.** Shields soak status damage, and damage-taken modifiers reach it, except one that names hits alone (Incorporeal). Status damage isn't a hit: it can't crit, never triggers anything that reacts to hits, and doesn't count toward anything that counts hits.
- **A status is fixed when it's applied.** The applier's stats can set how many stacks an application adds, and nothing else: its damage boosts don't raise the status's damage. A stacking status scales only by the stacks applied, and a single one by nothing.
- **A hit's own statuses land after the hit,** so a status set off by being hit (Bleed) waits for the next one.
- **Lengths are universal:** nothing applies a status for less or more than its own length. The one exception is bosses' control resistance (`RULES.control`). Each Stun, Silence or Slow that lands on a boss, Chill's stun included, adds a hidden stack. The stacks first halve the next control and then make the boss immune (RESISTED, IMMUNE), and they drain over time.

### What players see

Only a few statuses show as icons on a unit; everything else is behind the scenes. The statuses a player meets should be few and easy to recognise. Enemy stats are hidden.

## Tiers

Every status, special stat, effect and challenge has a tier, set by its role. Tiers count across the whole set, every class and enemy together: they say how widely a piece appears, not what each class should hold. Outside the enemy-only tier, nothing is locked to one class: a piece that one class uses today can appear on other classes, on gear and on formations.

| Tier | Role |
| --- | --- |
| Fundamental | The learnable base. Many classes and enemies use it, and players meet it in the first fights. Its variety comes from how differently it's used, not from adding more pieces. |
| Specialist | A few classes or foes make use of it or are built around it, and a few challenges lean on it. Some are one class's in the core set as built, and bend a rule. |
| Enemy-only | Only enemies use it. The party can't, until the director says so. |

The Fundamental pieces were chosen for how they interact: pieces that answer, undo, feed or play against one another.

## Vocabulary: statuses

The vocabulary is 22 statuses, 10 special stats and 6 effects. The pieces add six counters (*Gear design: the loot*).

| Kind | Fundamental | Specialist | Enemy-only | Total |
| --- | --- | --- | --- | --- |
| Statuses | 10 | 10 | 2 | 22 |
| Special stats | 1 | 9 | 0 | 10 |
| Effects | 3 | 3 | 0 | 6 |

Ten staples make the Fundamental base, each useful from a single application. Three Specialist statuses (Burn, Chill, Shock) are built up instead: they stack and drain away, so they pay off only with upkeep. Each status's sizes and lengths are in `STATUS`, under its name.

| Status | Tier | What it does |
| --- | --- | --- |
| Bleed | Fundamental | Stacks, with no duration, and does nothing on its own. Each hit its holder takes deals untyped damage per stack (not a hit itself), then a share of the stacks close. An inverse Shock: it pays a party that keeps the hits coming. |
| Regen | Fundamental | Heals a share of its holder's max HP on a pulse, for a set time, big enough to see. Refresh. |
| Shield | Fundamental | Soaks a pool of damage before HP, status damage included: a second health bar, shown over HP. One pool per unit. Each application adds to the pool, up to a cap of a share of the holder's max HP. How much an application adds scales from a stat the ability or effect names (Vanguard from max HP, Earthen shell from Defense). The pool has no timer, and Dispel removes the whole pool. If the pool proves too strong, a slow drain is the knob. |
| Might | Fundamental | More damage per stack, up to a cap. Stacks; each action its holder takes spends one stack. |
| Weaken | Fundamental | Deals less damage. Refresh. |
| Guard | Fundamental | Raises Defense for a while. Refresh. Best against many small hits. |
| Stun | Fundamental | Can't act. A wind-up under way waits it out, then carries on (Silence is the interrupt). Fizzle. |
| Slow | Fundamental | Longer cooldowns, wind-ups and time between attacks. Refresh. |
| Haste | Fundamental | Shorter cooldowns, wind-ups and time between attacks. Refresh. |
| Taunt | Fundamental | Foes' single-target picks must go to a Taunting unit; with several, draw weights the pick. Refresh. Seek gets past it. |
| Burn | Specialist | Stacks, with no cap. On a short pulse it deals damage per stack, then loses a share of its stacks, so it stays high only while someone keeps applying it. Each application is small against the ceiling that upkeep reaches. |
| Chill | Specialist | Stacks up to a cap, each stack slowing its holder a little. It thaws a stack at a time, slowly, so it builds over a fight. At the cap it shatters: its holder takes damage for each stack and a Stun, and the Chill is spent. Near the cap it slows as much as Slow, and the two add. A chain of shatters dies down: Chill that one foe's shatter passes to another foe that has shattered lately is cut by about half for each time it has, never to nothing (Chill from swings and spells is untouched). |
| Shock | Specialist | Stacks up to a cap. Each time its holder acts (when an action resolves: at the end of its wind-up, or at once for a basic attack), it takes damage per stack and loses half its stacks, so it hurts fast units most. |
| Marked | Specialist | A debuff on a foe: the party's basic attacks, and its abilities aimed at a random foe (a phrase's fallback to a random foe included), pick a Marked foe while it lasts, inside the Taunt rule (Seek follows it past a Taunting foe); an ability whose phrase finds its foe keeps its own targeting. With several Marks, the pick is by draw among them. Each applier keeps one Mark, so a new one it applies moves its old one. Refresh. The Paladin's Condemn applies it; so do the Hunt's pieces and seats, each only while no foe is Marked. |
| Sunder | Specialist | Stacks up to a cap; each stack makes its holder take a little more damage of every kind. Loses a stack on a pulse. |
| Silence | Specialist | Can't use abilities, only basic attacks; loses an ability's wind-up. Fizzle. |
| Hidden | Specialist | Foes can't pick it as a target, Seek included; only their Area reaches it. Its allies can still pick it. Lasts a set time and can't be removed. Refresh. |
| Rot | Specialist | Receives less healing; Shields are unaffected. Refresh. |
| Clarity | Specialist | Regen for mana: restores a share of its holder's max MP on a pulse, for a set time. Refresh. Cast on oneself or an ally. |
| Aegis | Specialist | Blocks the next damage above a set share of max HP, from any source, then ends. Checked after mitigation, before Shields. Fizzle. Small hits pass; one big one doesn't. |
| Doom | Enemy-only | A visible countdown; at zero its holder takes untyped damage of a large share of its max HP, so a unit at full HP survives it and a hurt one doesn't. Fizzle. Cleanse removes it; Shield and Aegis soak it. |
| Bulwark | Enemy-only | Starts with a stack count, and every hit its holder takes removes one. At zero its holder is Stunned and takes double damage for a while, then Bulwark refills. |

**Buffs and debuffs.** Every status is either a buff or a debuff. Cleanse removes debuffs, Dispel removes buffs, and "with a buff" or "with a debuff" in a target phrase means these lists. Hidden is a buff, but it can't be removed. Taunt and Bulwark are ordinary buffs that Dispel can remove.

| Kind | Statuses |
| --- | --- |
| Buff | Regen, Shield, Might, Guard, Haste, Taunt, Hidden, Clarity, Aegis, Bulwark |
| Debuff | Bleed, Weaken, Stun, Slow, Burn, Chill, Shock, Marked, Sunder, Silence, Rot, Doom |

## Vocabulary: special stats and effects

### Special stats

Evasion is the one Fundamental special stat. Six act through hits, basic attacks included, so they work without an ability; the three speed stats quicken one kind of action each. Classes and gear hold special stats at a level, medium or high (`SPECIAL`).

| Special stat | Tier | What it does |
| --- | --- | --- |
| Evasion | Fundamental | Chance to dodge a hit. |
| Accuracy | Specialist | Cancels that much of the target's Evasion: the answer to Evasion. |
| Crit damage | Specialist | Its crits hit harder. Crits land before Defense, so big crits get through it: an answer to Defense. |
| Double strike | Specialist | Chance a basic attack hits twice. Many small hits: good for breaking, bad against Defense, Thorns and hit counts. |
| Thorns | Specialist | Each time a hit lands on its holder, the attacker takes this much untyped damage. Thorns damage isn't a hit. Free: the holder spends nothing. |
| Lifesteal | Specialist | Each hit heals the holder for a share of its damage. |
| Siphon | Specialist | Each hit takes MP from its target, a share of its damage, and gives it to the holder. |
| Attack speed | Specialist | Basic attacks come sooner. Haste, Slow and Chill move it too, hidden. |
| Cooldown | Specialist | Abilities come round sooner. |
| Cast speed | Specialist | Shorter wind-ups. |

### Effects

Three Fundamental effects heal, hit everything and lift debuffs. Three Specialist ones get past Taunt, strip buffs and raise the fallen.

| Effect | Tier | What it does |
| --- | --- | --- |
| Heal | Fundamental | Restores HP to allies. |
| Area | Fundamental | Hits every foe, Hidden ones included. |
| Cleanse | Fundamental | Removes debuffs from an ally. |
| Seek | Specialist | A keyword an ability can carry: its targeting gets past Taunt. Without it, a taunt decides every single-target pick. |
| Dispel | Specialist | Removes buffs from a foe. |
| Revive | Specialist | Raises a knocked-out ally with some HP, even one knocked out in an earlier fight. The ally comes back with every action on its full cooldown; the Valkyrie's Einherjar version brings it back with all its actions ready. |

## Elements

Elements are themes only: names, art, and a class's or a region's flavour (Firebolt, a lance of ice, the Pyromancer, the Fire Mine). No damage, weapon, status or unit carries an element. There's no wheel, no resistance to one element, no weakness and no absorption. Burn, Chill and Shock keep their fire, ice and lightning looks, and their damage is untyped.

## How the Fundamentals play together

Most Fundamentals have a partner that opposes or undoes them, and two have a built-up twin. Stun is the exception: it plays against wind-ups, not against another piece.

| Pieces | How they play |
| --- | --- |
| Might, Weaken | Opposite sides of damage dealt. Dispel strips Might from a foe; Cleanse lifts Weaken from an ally. |
| Haste, Slow | Opposite sides of tempo. Haste also feeds every built-up status, since a faster unit applies more stacks. |
| Guard, Sunder | Guard raises Defense against hits; Sunder raises all the damage its holder takes. |
| Evasion, Accuracy | A chance to dodge, and the stat that cancels it. |
| Bleed, Regen, Cleanse | Bleed bursts with every hit, Regen heals over time, Cleanse lifts Bleed outright. |
| Shield, Heal, Rot | Shield prevents and Heal mends; under Rot, only Shield still works. |
| Taunt, Seek, Area | Taunt decides who foes can pick, split by draw when several units taunt. Seek gets past it, and Area skips picking altogether. |

Built up and kept up: Burn and Bleed for damage, Chill for control (its once-applied partner is Slow). Shock is built up too, but drains each time its holder acts, not over time; Bleed drains each time its holder is hit.

## Gear

The four slots and who wears what. What each rarity carries, and the rules for pieces, formations, upgrades and mythics, are in *Gear design: the loot*; the philosophy behind them, in *Gear design: philosophy*.

- **Slots.** Each unit wears a weapon, armor, an offhand and an amulet. Gear is fixed, never generated, and any number of units can wear copies of the same piece. A class arrives with the plain weapon of its first kind, and its other slots start empty. Slots have no job: any kind of effect can sit in any slot, and only weapons carry behaviour of their own (a speed, a swing and hands).
- **Who wears what.** A class wears only its own kinds: two weapon kinds, one or two armor types (Plate, Mail, Leather, Robes) and two of the thirteen offhand kinds. Amulets fit everyone. Weapon and offhand kinds follow the same rules: two or three wearers a kind, two kinds a class, two classes share at most one kind of a slot, and every class has a one-handed weapon kind, so it can always hold an offhand. Every wearer of a kind reads its signature stat, so every piece of a kind is relevant to every class that can wear it. Armor types stay loot groups by weight. A kind's name says who can hold it, not what its pieces do. *Core set: classes* gives each class's kinds; `npx tsx tools/gear-slots.ts` checks the rules.
- **Two-handers.** The bow, the great weapon and the staff take both hands, so the offhand stays empty under one: a unit can't hold both, and in the rogue mode a two-hander going on sends the offhand to the bag. A two-hander's pieces are meant to be worth a weapon and an offhand.
- **Weapons.** A weapon's kind sets its speed, its swing, scaling and budget words and its hands, as in the weapon table; recovery is the same for every weapon. Each weapon has a damage, a scaling ratio and a scaling stat: usually Attack, another stat on a few pieces. Damage is per hit and relative within the kind: a fast kind hits for less per swing, a slow kind for more. Weapon damage feeds basic attacks only; abilities scale as written.
- **Offhand kinds.** An offhand has no swing, so a kind is its stat profile, its flavour and who shares it.

| Offhand | Signature | Classes |
| --- | --- | --- |
| Kite shield | Defense | Knight, Paladin, Geomancer |
| Round shield | HP | Hoplite, Bramble knight, Valkyrie |
| Horn | Aggro | Knight, Hoplite |
| Totem | Thorns | Bramble knight, Stormcaller |
| Relic | MP regen | Cleric, Paladin |
| Lantern | Cast speed | Cleric, Pyromancer |
| Tome | Cooldown | Bard, Hexer, Frostweaver |
| Orb | MP | Pyromancer, Frostweaver |
| Idol | Siphon | Hexer, Vampire |
| Vial | Lifesteal | Vampire, Assassin |
| Trophy | Crit damage | Ranger, Assassin, Geomancer |
| Bell | Attack speed | Bard, Monk, Stormcaller |
| Cloak | Evasion | Valkyrie, Monk, Ranger |

- **Rarity:** common, uncommon, rare, legendary and mythic. A **mythic** fits one class, in any slot and whatever its kind (a mythic weapon can have its own speed, swing and hands), and a unit wears one at most.
- **What gear carries.** The stats every unit has, the ten special stats (the speed stats included), and effects. Stat steps are +1 or +2 (`STEP`, `HP_STEP`, `AGGRO_STEP`, `MP_REGEN_STEP`), with no half-steps. Special stats on gear are medium, or high on a legendary, never low. Every piece carries stats at every rarity: a weapon its kind's budget, every other slot the standard one (`KIND_BUDGET`), a rare's or legendary's step beside its effect. A stat that matches a weapon's scaling stat counts twice, since it raises the weapon's own damage too.

## Formations

- **Three seats,** one per unit, so every seat is filled; the tech keeps five for later parties. Seat order only breaks targeting ties.
- **A seat** changes the stats of the unit in it, up or down, or gives it statuses, or does nothing. Any stat can move, Aggro and special stats included. Aggro on the seats is how a formation makes a front and back line, since there's no positioning.
- **A party effect** is stats or statuses for every ally, flat rather than aimed at one unit. A formation may have none.
- **No budget** between seats or between formations: each formation is its own thing (`docs/rules.md`).
- **Rarity:** common, rare and legendary; there are no mythic formations. The player starts with Neutral: three seats that do nothing, and no effect.

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
