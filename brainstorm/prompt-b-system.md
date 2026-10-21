You're helping brainstorm content for a small video game. Below is what the game is and how its combat works, then what I'd like from you.

## The game

A party-based dungeon crawler in the style of classic JRPGs, with fully automatic combat. The player's skill is building a party before a fight, not acting during it: they choose which units to bring, what each one carries and where each one stands, then watch. When a party loses, the player works out why from what they saw and tries a different build. Enemy stats are hidden, so players learn everything by watching fights, which are shown mostly as text and numbers, in the style of Game Boy-era RPGs.

## Units

- Every unit is a class. The player owns each class once, and a party holds at most one of each. Parties are small: 3 units for now, up to 5 later.
- A class has a passive that only it has, four abilities of which it brings two into a fight (the player picks which, between fights), and a set of weapon types it can use.
- A unit's weapon sets its basic attack: its damage type, how many hits, and how often it swings.
- Units don't level up. Gear makes them stronger.
- Passives and abilities change how a unit behaves, rather than just adding numbers.

## How a fight runs

- Fights run in real time, counted in short ticks. Nobody gives orders.
- Every action, basic attack or ability, has a cast time (a wind-up), a cooldown and a short recovery. When a unit is free, it uses the first of its abilities that's ready, in the order the player slotted them, and otherwise its basic attack. Abilities cost MP, and an ability can have a condition, such as "only when an ally is below half health".
- There's no battlefield geometry: no rows, no range, no positions that limit who can hit whom. Units mostly attack a random foe, weighted by a stat that makes a unit more or less likely to be targeted. Effects can force foes to target a unit, or stop a unit from being targeted. An ability can pick its own targets instead: the lowest health, the highest of some stat, all foes, a random ally, and so on.
- The party stands in a formation of five slots, each with its own bonuses. A slot changes a unit's numbers, not where it is.

## Damage

- Physical damage is slashing, piercing or blunt. It can be dodged (Evasion), and Armor takes a flat amount off each hit, so many small hits do poorly against heavy armor.
- Magical damage carries an element; which elements exist isn't decided. It can't be dodged, and the target's resistance to that element reduces it by a percentage. Negative resistance is a weakness.
- Hits can crit.
- A status's own damage has no type or element by default, so it isn't dodged or resisted.
- Every amount states what it scales from, and any stat can be a scaling source.

## Stats every unit has

HP, MP, MP regeneration, Attack, Magic, Armor, a resistance to each element, Attack Speed, Cooldown Reduction, Crit chance, and the targeting stat above.

## What the system can express

Anything that lasts on a unit for a while is a status. A status can:

- change stats, up or down;
- raise the damage or healing a unit deals, by kind: basic attacks, abilities, physical, magical, one physical type or one element;
- change how much damage a unit takes, of every kind or one kind;
- soak a pool of damage before it reaches HP;
- stop a unit from using some of its actions (all of them, basic attacks only or abilities only), and optionally cancel what it's winding up;
- add an extra piece of damage to a unit's attacks, or change their element;
- do something on a timer: deal damage, heal, restore or drain MP, or apply another status;
- react to events: being hit, landing a hit, dodging, missing, dealing or taking damage, losing HP, being healed, starting or finishing an action, gaining or losing a status, a unit being knocked out, or the fight starting.

A status has a duration or lasts the whole fight. When it's reapplied, it either refreshes, fails while it's already there, or adds stacks to a shared total, and stacks can drop on each timer or event (halve each time, say, or lose one). A status can also keep a separate copy per applier, end when its applier is knocked out, be unremovable, or survive its holder being knocked out. Effects can remove buffs or debuffs, and units can be immune to particular statuses or kinds of effect.

Special stats sit at zero for most units and only matter for units built around them. They do things the core stats don't: anything that hitting, timing or targeting can read, or a stat that brings a status with it while it's above zero.

## Firm rules for content

- Everything maps onto a few numerical systems: stats, statuses, damage types and targeting. No special keywords that only one thing interacts with.
- Nothing that makes the player track a lot in their head, and nothing positional.
- A player has to be able to tell what's happening by watching.

## What I'd like

Think from the system described above rather than from other games. Start from the statuses and special stats it can express that would be interesting to build a unit around, then list the classes that would use them.

Make four lists:

1. **Classes.** For each: a name, a one-line fantasy, and two or three lines in plain words on what it does in a fight, including roughly what its passive does. Then name the statuses and special stats it would need, in plain words.
2. **Statuses a player would see.** Only ones a player would notice on a unit and learn to recognise, including ones enemies put on the party; leave out machinery. For each: a name, buff or debuff, and one line on what it does.
3. **Special stats.** For each: a name and one line on what it does. Don't repeat the stats every unit has.
4. **Elements.** The set you'd use for magical damage, as many as you think the game needs. For each: a name and one line on its feel.

Start each of the first three lists with the staples you'd expect any game like this to have, then keep going into less common ones, and draw a line where the staples end. Aim for about 25 classes, 15 statuses (about 5 staples, then about 10 less common ones) and 15 special stats. Keep each entry short. Don't rank them, explain your choices or shape them into a balanced set: just list.
