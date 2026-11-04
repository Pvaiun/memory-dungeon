# Primer

The least you need to know to work on the game. Read it first, then open a detailed document only when the work needs it (the map at the end says which). It describes; it doesn't decide. `docs/rules.md` (the director's standing direction) and the detailed documents win where they differ, and no number is given here: numbers live in the data.

## What this is

- **The game** is a party-based JRPG dungeon crawler with automatic combat, played on a phone-sized browser interface.
- **The core set is the game's content:** the combat rules, 16 classes, gear, formations, upgrades and mythics, 29 enemies, and the **rogue mode**, which is the game. Free play keeps everything available as a sandbox, and the campaign is retired.
- **The repo designs it:** a schema, a headless engine, simulations and the interface. Everything is built and approved, and nothing is balanced yet.

## How it plays

- **Preparation is the game.** There's no control during fights. The player chooses who fights, what each one wears, where each one sits and the order of their abilities, then watches. Enemy stats are hidden: the player learns by watching, from fights told mostly in text and numbers, in the style of Game Boy-era JRPGs.
- **A rogue run** is three acts, each a map of 12 floors on Slay the Spire's structure. The rooms are fights, elites, events, shops, chests and campfires, with a boss at the top, shown from the start.
  - **The party** is three units around a leader, with a bench at camp that grows from two seats to four.
  - **What carries:** HP, MP, knockouts and ability cooldowns carry from fight to fight; statuses don't.
  - **Losing:** any lost fight ends the run.
  - **Rewards:** wins pay gear, formations, recruits, training, supplies and gold.
  - *Core set: the rogue mode* has the details.

## Units

- **A class is a unit.** A party holds at most one of each class. Units don't level up. Gear, formations and training make them stronger.
- **A class has** stats on a scale of 1 to 5, a passive only it has, three abilities, and the kinds of gear it can wear. In the rogue mode a unit starts knowing some of its abilities, at random, and learns the rest by training.

| Class | Role | Class | Role |
| --- | --- | --- | --- |
| Knight (starter) | Protector | Monk | Sunders with a blur of blows |
| Cleric (starter) | Healer | Assassin | Burst killer |
| Ranger (starter) | Wears down tough targets | Vampire | Drains to outlast |
| Bramble knight | Thorns tank | Pyromancer | Ramping Burn |
| Hoplite | Bodyguard who opens foes up | Frostweaver | Freezes and shatters |
| Paladin | Shelter against magic | Stormcaller | Shocks every foe |
| Valkyrie | Storm spear who heals and revives | Geomancer | Hits hardest behind stone |
| Bard | Party tempo | Hexer | Curser |

## A fight

- **Time.** A fight runs in real time, counted in ticks, and nobody gives orders. Every action (a basic attack or an ability) has a wind-up, a cooldown and a recovery. Basic attacks never wind up. A free unit uses its first ready ability in the order it was slotted, otherwise its basic attack. An ability is ready when it's off cooldown, its condition holds and the unit has the MP. Past a set time, an enrage makes everyone hit harder, so no fight stalls.
- **MP is fuel.** No class regains MP in a fight by itself. Regen comes only from gear and a formation seat, plus a few abilities and statuses. Builds differ in whether they spend HP or MP.
- **Damage comes in two kinds.**
  - **Physical** can be dodged (Evasion) and is cut by Armor.
  - **Magical** is cut by Magic resist, a percentage, and is never dodged.
  - **A status's own damage** (Burn, Bleed, Shock…) is untyped and never resisted.

  There are no elements as mechanics: fire, ice and the rest are themes only. Every amount says what stat it scales from; nothing scales by default.
- **Targeting.** Foes pick party members at random, weighted by **draw**, which comes from Aggro. Every 25 Aggro doubles a party member's draw, so a unit built to draw fire takes most of the picks. The party picks foes on a gentler curve.
  - **Taunt** forces foes' first pick.
  - **Hidden** can't be picked.
  - **Seek** gets past Taunt.
  - **Area** hits everyone.

  An ability can name its own target with a fixed phrase ("the ally with the lowest share of max HP").
- **Statuses.** Everything that happens on an event or a timer is a status (22 of them), and there are 7 special stats and 6 effects. A status does the same thing whoever applies it: the applier sets only how many stacks it adds. Its length is its own, with one exception: bosses resist repeated Stun, Silence and Slow. The families:
  - **The staples:** Regen, Shield, Might, Weaken, Guard, Stun, Slow, Haste, Taunt, Bleed.
  - **Built up over a fight, and draining away:** Burn, Chill (it shatters at its cap), Shock, Sunder.
  - **The rest:** Ward, Silence, Hidden, Rot, Clarity, Aegis, and Doom and Bulwark, which only enemies use.
- **Tiers** say how widely a piece appears. A Fundamental is in many classes and the first fights, a Specialist in a few, and a Signature belongs to one class or boss and bends a rule.

## Gear, formations and training

- **Gear has four slots:** weapon, armor, offhand and amulet. Slots have no job, and only weapons carry behaviour of their own.
  - **Weapons:** eleven kinds, each a speed, a damage type and one or two hands. The kind sets the unit's basic attack. A two-hander (bow, great weapon, staff) leaves the offhand empty.
  - **Who wears what:** each class wears two weapon kinds, one or two of the four armor types and one or two of the ten offhand kinds. The amulet fits everyone.
- **Rarity is specificity.**
  - **Common:** stats.
  - **Uncommon:** a small, general effect.
  - **Rare:** an effect designed for one or two builds.
  - **Legendary:** bends a rule.
  - **Mythic:** rewrites one class. Each class has one, and a unit wears one at most.

  There are 240 pieces, 16 mythics and a plain weapon of each kind. Every piece is fixed, with no random affixes. A card says what the piece does and who can wear it, never what it's for.
- **A formation** is three seats and maybe a party effect. A seat changes the stats of whoever sits in it, or gives it statuses. There's no battlefield geometry: Aggro on the seats is what makes a front line. A run starts with Neutral (three empty seats), and there are 32 more: common, rare and legendary.
- **Training** is learning an ability, or taking an ability's or passive's power step, or one of its two versions (A or B). Every ability and passive has a power step and two versions: 64 upgrades in all.
- **Builds.** A build is a way to play you can watch: someone watching can tell which build is playing and what it's waiting for. There are twelve, and the gear, formations and upgrades were designed backwards from them (*Gear design: the builds*). The gear design isn't finished: its philosophy is in `docs/gear-design/`.
  - **Landslide:** a few huge blows from behind stone.
  - **Thousand Cuts:** a dense stream of tiny hits and dodges.
  - **Bonfire:** Burn that climbs all fight and passes from foe to foe.
  - **Cold Snap:** Chill that shatters on a beat.
  - **The Hunt:** one marked foe at a time.
  - **Harvest:** the whole field falls at once.
  - **Ambush:** everything at the first tick.
  - **Overflow:** mana passed round a party that never stops casting.
  - **Lockdown:** disable a foe, then pile in.
  - **The Toll:** foes hurt themselves on one anchor.
  - **Blood Pact:** HP spent and drunk back.
  - **Phoenix:** wins by falling and returning.

## Enemies

- **Enemies use the class rules:** the same stats, statuses and target phrases.
- **Ranks:** minion, elite and boss. Every foe carries some Armor and some Magic resist, more by rank. A boss has a signature move or gimmick, and resists repeated control.
- **Each enemy is built on a challenge,** a puzzle that a party answers with the strengths in its own kit. Raw power can partly make up for a missing strength.
- **Fights:** at most 8 foes. Some enemies summon more, and nobody leaves a fight alive.
- **Regions:** the 29 enemies live in seven regions, and each act is one of them. Act I is the Old Road. Act II is the Crypt, the Fire Mine or the Ice Pass. Act III is the Storm Tower, the Deep Crypt or the Tower Top.

## Numbers

- **The documents give words,** never numbers: stats from 1 to 5, quick, short or long cooldowns, a few, several or many stacks.
- **The data turns each word into a number,** in one place: `content/core-set/scale.ts`.
  - **Amounts** are stored at 1,000 a point (HP 2 is 2,000), and the interface divides them back down.
  - **Percentages** stay in percent.
- **Every value is a first value, not a balanced one.** Tune by changing a constant and running `npm run content`. Don't copy numbers into the documents: name the constant instead.

## Words used in this repo

- **Seat:** a formation slot.
- **Bench:** the members at camp.
- **Trio:** a party of three.
- **Rungs:** a build's three levels, from what most runs find to its most specific pieces.
- **Route:** a set of classes that carries a build.
- **Knob:** a fight's difficulty, as a percentage more foe HP and damage.
- **Heat:** the difficulty levels opened by won runs.
- **Pack:** the generated `content/core-set.pack.json` that the engine reads.

## Where to look

| To work on | Read |
| --- | --- |
| Anything about design or tuning | `docs/rules.md`, always: the director's direction, one page |
| Exact combat rules: timing, targeting phrases, the damage order, what each status does | `docs/core-set/rules-and-vocabulary.md` |
| A class's design: its plan, kit, tests, and which parties beat what | `docs/core-set/classes.md`; its numbers in `content/core-set/classes.ts` |
| An enemy's design, and the list of challenges | `docs/core-set/enemies.md`; numbers in `content/core-set/enemies.ts`; free play's encounters and dungeons in `dungeons.ts`; their test trios in `tests.ts` |
| How a run works | `docs/core-set/rogue-mode.md`; numbers in `content/core-set/rogue.ts` and `rogue-knobs.json` |
| Designing or changing gear, formations, upgrades or mythics | `docs/gear-design/philosophy.md` first: the director's intent, rhythm, what makes a piece good, and how loot is made |
| The twelve builds: rhythm, threads, routes, rungs, needs, the web between them, and how they measure | `docs/gear-design/builds.md`; the routes as test parties in `src/build-parties.ts` |
| The loot's rules: each rarity, the stock, writing pieces, formations, upgrades, mythics, levers held back | `docs/gear-design/loot.md`; each item and its card text in `content/core-set/pieces/`, `formations.ts` and `upgrades/` |
| Any number | `content/core-set/scale.ts` |
| What content can express | `PRIMITIVES.md` (generated from `src/schema.ts`) |
| The interface | `ui/README.md` |
| The tools, and what's open right now | `CLAUDE.md` (Status) |
