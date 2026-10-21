# Core set, step 2: the challenges

You're a game designer joining a project. The director is the person who sets the game's vision. You'll work with them in rounds: you bring a first version, they react, and you revise until they accept it. Then you produce the final output described below, which is handed on by itself. Keep what you write short and plain.

## Your objective

The project needs a list of the **challenges** this game's fights can pose: the kinds of enemies, bosses and enemy groups a party will face. The list will be used to test whether a set of classes and effects can handle the fights this game will have. So it should come from the genre and from what this combat system can express, not from any particular set of classes.

Make a list of **staple adversarial content**:

- **Regular enemies:** the kinds of foe a party meets again and again.
- **Bosses:** look through boss fights in JRPGs and other party-based games for the problems they pose, and translate those problems into this combat system.
- **Enemy groups:** which kinds of enemy come together, and what the combination asks of a party.
- **Pressure across a dungeon run,** if you see any worth listing: what wears a party down over a few fights before the boss.

Each entry is a kind of challenge, not a designed monster: no numbers or names needed. Be creative and generous; this list doesn't need to be minimal. Every challenge has to be expressible in the combat system below, and readable by a player watching the fight. For each one, name the kinds of answer it calls for, at least two different ones, so no challenge has a single solution.

## What to bring back

- **First, a write-up for the director:** the games and fights you drew on, and the list as it stands. Expect a few rounds.
- **Then, once the director accepts it, the final list,** grouped as above. Each entry is a name, one or two plain lines on what it does in a fight, and the kinds of answer it calls for. Nothing else.

## The game

A party-based dungeon crawler in the style of classic JRPGs, with fully automatic combat. Preparation is the game: the player chooses which units to bring, what each one carries and where each one stands, then watches. When a party loses, the player works out why from what they saw and tries a different build. Enemy stats are hidden, so players learn everything by watching fights, which are shown mostly as text and numbers, in the style of Game Boy-era RPGs.

It's an optional game inside a personal productivity app made for someone with ADHD. Completing real-life tasks pays **unlocks**: a new class, a formation or a powerful piece of gear. Dungeons pay ordinary gear. So every class is a reward the player earns one at a time, and each should be worth getting on its own.

- **Units.** Every unit is a class. The player owns each class once, and a party holds at most one of each. Parties are up to 5 units; the first playable version will probably use parties of 3.
- **A class** has a passive that only it has, four abilities of which it brings two into a fight (the player picks which, between runs), and a set of weapon types it can use. A unit's weapon sets its basic attack. Units don't level up; gear makes them stronger. Passives and abilities change how a unit behaves, rather than just adding numbers.
- **Formations.** The party stands in a formation of five slots, each with its own bonuses. A slot changes a unit's numbers, not where it is: there's no battlefield geometry.
- **Dungeons.** A few automatic fights, then a boss, with HP and MP carrying between fights. Losing costs nothing, and retries are free.
- **Encounters** are designed as puzzles: a party brings strengths, a boss has gimmicks that call for them, and raw power can partly make up for a missing strength. The same units in a different formation can beat a different boss.
- **Enemies** use the same rules and stats as the party, and can use the same statuses.

**Design rules.**

- Everything maps onto a few numerical systems: stats, statuses, damage types and targeting. No special keywords that only one thing interacts with.
- Nothing that asks the player to track a lot in their head, and nothing positional.
- A player has to be able to tell what's happening by watching.
- Elements differ from one another by gameplay shape, rhythm and utility, not mainly as a wheel of counters.

## The combat system

It's built and working. Its numbers are placeholders.

**Time and actions.**

- Fights run in real time, counted in ticks. Nobody gives orders.
- Every action, basic attack or ability, has a cast time (a wind-up), a cooldown and a short recovery. When a unit is free, it uses the first of its abilities that's ready, in the order the player slotted them, and otherwise its basic attack.
- Abilities cost MP. An ability can have a condition, such as "only when an ally is below half health".
- Every action starts the fight on cooldown. Damage doesn't interrupt a cast; only a knockout or an interrupting lockout does.

**Targeting.** Units mostly attack a random foe, weighted by Aggro, a stat every unit has. A unit can be made the forced target of foes (a taunt) or made untargetable (stealth). An ability can pick its own targets instead: the lowest health, the highest of some stat, all foes, a random ally, and so on. An action can also be set to ignore taunts and stealth.

**Damage.**

- **Physical** damage is slashing, piercing or blunt. Evasion is a chance to dodge it, and Armor takes a flat amount off each hit, so many small hits do poorly against heavy armor.
- **Magical** damage carries an element. It can't be dodged, and the target's resistance to that element reduces it by a percentage. Negative resistance is a weakness; full resistance is immunity.
- Hits can crit.
- Every amount states what it scales from, and any stat can be a scaling source. Physical things scaling from Attack, and magical things from Magic, is only a convention.
- Damage resolves in this order: dodge check, base amount and scaling, the attacker's boosts, the target's damage-taken modifiers, crit, mitigation (Armor or resistance), shields, then HP.

**Stats every unit has.** HP, MP, MP regeneration, Attack, Magic, Armor, a resistance to each element, Attack Speed, Cooldown Reduction, Crit chance and Aggro.

**Statuses and special stats** are different things:

- A **status** is a special state on a unit that the player understands as having been put there by someone or something. It shows on the unit as feedback.
- A **special stat** is a stat outside the set every unit has. It's zero by default, isn't shown on the stat sheet until something changes it, and is always active while the unit has it.
- **Thorns** is a stat: it returns a share of the damage taken, it's a number you can gain more of, and it's always on. **Riposte** is a status: a state a unit puts itself in, where after dodging an attack it strikes back. There's no Riposte number; it's on or off, or it stacks.

**What a status can do.**

- change stats, up or down;
- raise the damage or healing a unit deals, by kind: basic attacks, abilities, physical, magical, one physical type or one element;
- change how much damage a unit takes, of every kind or one kind;
- soak a pool of damage before HP (a shield);
- lock out some of a unit's actions (all, basic attacks only, or abilities only), optionally cancelling a wind-up;
- add an extra piece of damage to a unit's attacks, or change their element;
- do something on a timer: deal damage, heal, restore or drain MP, or apply another status;
- react to events: being hit, landing a hit, dodging, missing, dealing or taking damage, losing HP, being healed, starting, finishing or being interrupted in an action, gaining or losing a status, a unit being knocked out, or the fight starting.

**How statuses stack and end.**

- **Refresh:** reapplying replaces the old copy.
- **Fizzle:** reapplying fails while it's there.
- **Stacks:** each application adds stacks to one shared total, and the effect scales with the total. The total can drop on each timer or event (halve each time, or lose one), and the status ends when it falls below one stack.
- **Per source:** each applier keeps its own copy; it can end when its applier is knocked out (an aura).
- A status has a duration or lasts the whole fight. It can be unremovable, or survive its holder being knocked out. Effects can remove buffs or debuffs, and units can be immune to particular statuses or kinds of effect.
- A status's own damage has no type or element: it isn't dodged, and Armor and resistance don't reduce it. Only damage-taken modifiers and shields do.
- A status is fixed when it's applied. The applier's stats can set how many stacks an application adds, and nothing else.

**Not built yet** (each would need new engine work): targeting rules on the attacker (a taunt that names one unit, charm), granting or repeating actions, revives, resistance to statuses, summons or pets as their own units, and Lifesteal (it needs a second scaling factor).

**What players see.** Only a few statuses show as icons on a unit; everything else is behind the scenes. The statuses a player meets should be few and easy to recognise.
