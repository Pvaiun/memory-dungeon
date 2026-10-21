# Core set design: a brief

You're a game designer joining a project. The director is the person who sets the game's vision, and you'll be working with them. This file is everything you need to begin. Read it all before you start: the task comes first, then the game, then the raw material.

## 1. What I'm asking you to do

Design the **core set** for a party-based dungeon crawler with automatic combat: the first, small foundation of **classes, statuses, special stats and elements** that everything later is built on.

**Why a core set, and why small.** The game is a build-making game, and the director expects most of its long-term interest to come from creative permutations: unusual classes, odd interactions, gear that bends the rules. That can only be added onto a foundation that's already playable and observable. So the first set should be small and mostly made of staples. Generic is fine here; strangeness comes later, from recombining these pieces. There's a trap on both sides:

- **Too wide,** and the game is locked in early: "these are our twelve statuses, all generic", and they can't change later without redoing old content. A game can have many classes, but it has to be careful with its statuses and special stats, because everything else is built from them.
- **Too thin, or too lopsided,** and there's nothing to learn from playing it, because one answer beats everything.

**What you have to work with.** Section 4 holds a brainstorm: lists of classes, statuses, special stats and elements from the director and from five AI models, merged by meaning, with how many sources proposed each idea and the director's quick reactions (keep, maybe, cut, and some notes).

**This is not a trimming job.** Don't build the core by keeping the director's keeps, weighing the maybes and dropping the cuts: that gives a bad result. Those picks were fast reactions to a long list, and a quick brainstorm, not a design. Treat them as one signal among several, next to how many independent sources proposed each idea. The director's general notes (section 4) are more considered than any single pick, so weigh them more.

Instead:

1. **Analyse.** Look at how other games of this kind build their core or starting sets of roles, statuses, stats and elements, and at which of those pieces typically appear together. Say which games you drew on, and what you took from each.
2. **Find what locks together.** Look for classes, statuses, special stats and elements that naturally form groups: a status that several classes use, an element whose gameplay shape suits a status, a class that only works because another one exists, two problems an enemy can pose that need different answers.
3. **Puzzle out one set of combinations** that works as a whole. You may bring in things nobody listed, and leave out things the director kept. Say why whenever you do.

**What a good core set does.**

- **Few statuses and special stats, each pulling its weight.** Each is used by several classes (or will be used by enemies), and each is clearly distinct from the others. Classes can be more numerous than statuses.
- **Room to grow.** Later, stranger classes can be built by recombining the core's pieces, without replacing any of them.
- **No single answer to everything.** Classes need each other, and enemies can later ask for different combinations. See the director's note on armor, evasion and magic.
- **Readable.** A player watching an automatic fight can tell what each status is doing.
- **Fits the combat system** (section 3). Anything that needs a new engine building block is allowed, but it costs something; say so when you use one.
- **A clear line between a status and a special stat.** The brainstorm blurred them (see the director's notes). Section 3 gives the system's definitions; use them.

**What to bring back.**

- **Your analysis,** briefly: the games and typical core sets you looked at, and what they suggest.
- **One proposed core set,** organised as the groups that hold it together. Not three variants: one set you'd defend. It contains:
  - **Classes:** for each, its role, an idea for its passive, four ability ideas in broad strokes (it brings two into a fight), and its weapon types (weapons aren't designed yet, so name the kinds you assume). How many classes is your call, with reasons; parties will probably be small (about 3 units) in the first playable set.
  - **Statuses:** what the player sees, and how it works in system terms (duration or stacks, what it does, how it ends).
  - **Special stats:** what each does, and why it's a stat rather than a status.
  - **Elements:** each one's gameplay shape. The director wants elements to differ in rhythm, shape and utility, not to act as a wheel of counters.
  - **A coverage table:** which classes use which statuses, special stats and elements.
  - **How the set answers each of the director's general notes.**
- **What you considered and left out, and why,** especially any keep you dropped or cut you brought back.
- **Your open questions.**

**How to work with the director.** They'll react and you'll revise, over several turns. They'd rather hear a challenge early, with reasons, than see you follow a direction into a wall. Ask a question when the answer would change the design; otherwise make the call and say so. Keep write-ups short and plain, and lead with decisions and questions.

**One warning.** Everything in the brainstorm is an illustration of what could exist, including the director's own entries. No single item is a requirement, and no example is a rule. Don't build the set around one vivid idea.

## 2. The game

A party-based dungeon crawler in the style of classic JRPGs, with fully automatic combat. Preparation is the game: the player chooses which units to bring, what each one carries and where each one stands, then watches. When a party loses, the player works out why from what they saw and tries a different build. Enemy stats are hidden, so players learn everything by watching fights, which are shown mostly as text and numbers, in the style of Game Boy-era RPGs.

It's an optional game inside a personal productivity app made for someone with ADHD. Completing real-life tasks pays **unlocks**: a new class, a formation or a powerful piece of gear. Dungeons pay ordinary gear. So every class is a reward the player earns one at a time; each class should be worth getting on its own.

- **Units.** Every unit is a class. The player owns each class once, and a party holds at most one of each. Parties are up to 5 units; the first playable set will probably use parties of 3.
- **A class** has a passive that only it has, four abilities of which it brings two into a fight (the player picks which, between runs), and a set of weapon types it can use. A unit's weapon sets its basic attack. Units don't level up; gear makes them stronger. Passives and abilities change how a unit behaves, rather than just adding numbers.
- **Formations.** The party stands in a formation of five slots, each with its own bonuses. A slot changes a unit's numbers, not where it is: there's no battlefield geometry.
- **Dungeons.** A few automatic fights, then a boss. Losing costs nothing, and retries are free.
- **Encounters** are designed as puzzles: a party brings strengths, a boss has gimmicks that call for them, and raw power can partly make up for a missing strength. The same units in a different formation can beat a different boss.
- **Enemies** use the same rules and stats as the party, and can use the same statuses.

**Firm rules for content.**

- Everything maps onto a few numerical systems: stats, statuses, damage types and targeting. No special keywords that only one thing interacts with.
- Nothing that asks the player to track a lot in their head, and nothing positional.
- A player has to be able to tell what's happening by watching.

**What comes after this.** The director's plan for the first playable set: design the core classes with their passives, stat lines and abilities (this brief); then weapons, with their types and class restrictions, and formations; then a first set of regular and boss encounters built to make the choice between these classes interesting; then play it, watch it and learn from it, before designing stranger classes, fuller gear and better encounters.

## 3. The combat system

The director designed this system, and it's built and working. Its numbers are placeholders.

**Time and actions.**

- Fights run in real time, counted in ticks. Nobody gives orders.
- Every action, basic attack or ability, has a cast time (a wind-up), a cooldown and a short recovery. When a unit is free, it uses the first of its abilities that's ready, in the order the player slotted them, and otherwise its basic attack.
- Abilities cost MP. An ability can have a condition, such as "only when an ally is below half health".
- Every action starts the fight on cooldown. Damage doesn't interrupt a cast; only a knockout or an interrupting lockout does.

**Targeting.** Units mostly attack a random foe, weighted by Aggro, a stat every unit has. A stat can force foes to target a unit (a taunt) or forbid them (stealth). An ability can pick its own targets instead: the lowest health, the highest of some stat, all foes, a random ally, and so on. An action can also be set to ignore taunts and stealth.

**Damage.**

- **Physical** damage is slashing, piercing or blunt. Evasion is a chance to dodge it, and Armor takes a flat amount off each hit, so many small hits do poorly against heavy armor.
- **Magical** damage carries an element. It can't be dodged, and the target's resistance to that element reduces it by a percentage. Negative resistance is a weakness; full resistance is immunity.
- Hits can crit.
- Every amount states what it scales from, and any stat can be a scaling source. No stat is tied to a damage type: physical things scaling from Attack, and magical things from Magic, is only a convention.
- Damage resolves in this order: dodge check, base amount and scaling, the attacker's boosts, the target's damage-taken modifiers, crit, mitigation (Armor or resistance), shields, then HP.

**Stats every unit has.** HP, MP, MP regeneration, Attack, Magic, Armor, a resistance to each element, Attack Speed, Cooldown Reduction, Crit chance and Aggro.

**Special stats** sit at zero for most units and only matter for units built around them: Evasion, Accuracy (cancels Evasion), Cast Time Reduction, Crit multiplier and Healing received are already in the engine, and the full set is designed with the classes. A special stat is a number on a unit, from its class or gear. It can do anything that hitting, timing or targeting reads, or it can bring a status with it while it's above zero, which is how a stat gets behaviour of its own.

**Statuses.** Anything that lasts on a unit for a while is a status. Every status is labelled buff or debuff. A status can:

- change stats, up or down;
- raise the damage or healing a unit deals, by kind: basic attacks, abilities, physical, magical, one physical type or one element;
- change how much damage a unit takes, of every kind or one kind;
- soak a pool of damage before HP (a shield);
- lock out some of a unit's actions (all, basic attacks only, or abilities only), optionally cancelling a wind-up;
- add an extra piece of damage to a unit's attacks, or change their element;
- do something on a timer: deal damage, heal, restore or drain MP, or apply another status;
- react to events: being hit, landing a hit, dodging, missing, dealing or taking damage, losing HP, being healed, starting, finishing or being interrupted in an action, gaining or losing a status, a unit being knocked out, or the fight starting.

How statuses stack and end:

- **Refresh:** reapplying replaces the old copy.
- **Fizzle:** reapplying fails while it's there.
- **Stacks:** each application adds stacks to one shared total, and the effect scales with the total. The total can drop on each timer or event (halve each time, or lose one), and the status ends when it falls below one stack.
- **Per source:** each applier keeps its own copy; it can end when its applier is knocked out (an aura).
- A status has a duration or lasts the whole fight. It can be unremovable, or survive its holder being knocked out. Effects can remove buffs or debuffs, and units can be immune to particular statuses or kinds of effect.

Two decided rules shape status design:

- **A status's own damage has no type or element by convention.** It isn't dodged, and Armor and resistance don't reduce it; only damage-taken modifiers and shields do.
- **A status is fixed when it's applied.** The applier's stats can set how many stacks an application adds, and nothing else; a stack is a stack, whoever applied it.

**Not built yet** (each would need new engine work): targeting rules on the attacker (a taunt that names one unit, charm), granting or repeating actions, revives, status resistance, summons or pets as their own units, and Lifesteal as a stat (it needs a second scaling factor).

**What players see.** Most statuses are machinery, invisible to the player. Only a few show as icons on a unit's HP bar, so the player-facing set should be small and easy to recognise.

## 4. The brainstorm

**How it was gathered.** The director wrote their own lists. Then fresh AI chats, blind to the director's ideas and to each other, were given a description of the game like sections 2 and 3 (without the decided-rule details) and asked for about 25 classes, 15 statuses (about 5 staples, then less common ones), 15 special stats and a list of elements, staples first. Opus ran three times, from three angles (A: the genre, B: the system, C: the trouble enemies cause); ChatGPT, Gemini, Grok and DeepSeek ran once each. The lists were then merged by meaning into one entry per idea; the entry names and one-line descriptions are the merge's summaries. The first Opus runs were steered towards mythology by a setting line in the prompt that was later removed, so the mythology classes are mostly that model's.

**How to read an entry.**

- **Sources:** how many of the five models proposed it, plus whether the director's own list had it. Agreement among independent models usually marks a genre staple.
- **Staple for:** the sources that put it above their own staples line.
- **Director's list:** the director's own wording, where their list had it.
- **Most versions use** (classes only): effects that at least half the versions of that class used.
- **Pick** and **Note:** the director's quick reaction. Read section 1 on how much weight these carry.

### The director's general notes

__NOTES__

__ENTRIES__
