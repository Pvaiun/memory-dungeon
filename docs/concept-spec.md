# Memory Dungeon Game: Concept Spec

Oct 14, 2026

## Purpose and principles

The game is an optional fourth tab that makes Memory's task system more motivating. The tasks stay the point; the game is a reason to do them.

**The two problems it solves.**

1. **Flat incentive.** An item pulls on you the same on day 30 as on day 1, so anything that slips past its first few showings can slip forever.
2. **Noticing.** Upkeep, chores and goals rarely get captured, because capturing them means noticing them first. That is the core ADHD gap.

**Principles.**

- Real-life quests give the game's most important rewards. Play gives the rest.
- The game tab holds everything, including the quest board. Ignoring it costs nothing. Memory stays fully useful without it.
- The game never appears on the Now map, never sends notifications, and never punishes losing or being away.
- The user always chooses. The AI suggests and never assigns.

## Quest board

Each week the AI deals a board of quests from the user's whole catalog. Every quest is open, and completing any of them pays its reward. Unfinished quests vanish when the board refreshes, though a missed reward can come back on a later board.

- **Built from the whole catalog.** The board draws on every item, its history and the user profile, never on the daily Now map.
- **Fixed size, changing mix.** The board is a fixed size, and the AI varies its mix of quests each week. The user can name a standing focus ("I struggle with cleaning") that appears every week.
- **Rewards shown up front.** Each quest shows its exact reward before the user does it, so they can aim at what their party needs.
- **Paid per quest, not per task.** Extra tasks beyond the board earn nothing in the game.
- **Value comes from the catalog.** Long-stalled, high-priority or big-effort items pay better rewards. The AI judges each case rather than following a formula.
- **Anything done counts.** A quest completes from the real action, wherever it happens in the app. Rewards wait while the user is away.

| Kind | Completed by | Example |
| --- | --- | --- |
| Notice | Capturing something new. The capture alone completes it; boosting an existing item doesn't count. | Look around the bathroom and capture anything that needs doing. |
| Notice and do | Capturing something, then doing it the same week. The AI never suggests anything too big for a week; bigger things belong to Notice. | Find one thing in the kitchen that needs doing, and do it. |
| Want | Setting a goal of the user's own: something they want to do more of, or attempt. Setting it completes the quest, and the goal joins the catalog, where the Now map or a future quest can surface it. | Set a goal, e.g. "cook from scratch three nights a week." |
| Review | Deciding what happens to an item the AI picks: keep it, dismiss it, snooze it, skip a recurrence, or mark it "got it" | Is "learn Spanish" still something you want? |
| Tackle | Getting a big or long-stalled item done | Finally clear out the storage room. |
| Keep | Doing every occurrence of a habit that week. A skipped recurrence leaves it incomplete. Usually a mid- to low-tier reward. | Litter every 2 days, all week. |

Noticing is a skill the app is training, so the user does the noticing. Notice quests can offer a few optional suggestions to pick from, never a single instruction.

## The game at a glance

A party-based JRPG dungeon crawler with automatic combat, where preparation is the game.

**Core loop.** Quests give keys, dungeons give gear, and the build joins them:

1. **Real-life quests** (Notice, Want, Review, Tackle, Keep) pay keys.
2. Keys go into **building a party**: specialization, abilities, gear, formation.
3. The party **runs a dungeon**: automatic fights, perk picks, a boss.
4. Clearing it drops **dungeon loot**: efficacy gear, from first clears and replays, which goes back into the build.
5. Stuck at a wall? Quests are the fast road.

Quests unlock new options, and dungeons supply the gear that makes those options strong enough. When a dungeon is too hard, replaying earlier ones for gear is the slow road and quests are the fast road.

**Look and feel.** The combat UI borrows from Game Boy-era JRPGs like Dragon Quest: mostly text and numbers, nostalgic and instantly readable. Fights play out slowly enough to follow, with chunky damage numbers and big words like MISS and BLOCKED. With enemy stats hidden and no end-of-fight recap, combat feedback is the player's main source of information, so it has to be crystal clear. The writing carries the charm: names, descriptions and jokes. The setting is deliberately generic medieval fantasy, with touches of Greek, Norse and Japanese mythology.

## Building a party

A new player starts with one unit of the starter class, such as a warrior or mercenary. Formations always have 5 positions, and each dungeon sets how many units may enter, from 1 to 5. Each unit is defined by four layers, and each layer has one job.

| Layer | Job | Earned from |
| --- | --- | --- |
| Specialization | Which verbs and numbers a unit can reach | Quests |
| Abilities | What the unit does in combat | Come with the specialization |
| Gear | How well it does those things | Dungeons for most gear, quests for powerful pieces |
| Formation | Which units get multiplied, through positions that amplify specific roles | Quests |

- **Specializations.** Roughly 8 to 10 classes. Each has a base specialization, shown to the player as the plain class, plus 2 to 3 more (e.g. Ranger, Ranger: Duelist, Ranger: Archer). Each specialization is unique: a party can hold a Ranger Duelist and a Ranger Archer, but never two Ranger Archers. A specialization arrives complete and useful from day one. Units don't level up.
- **Abilities.** Each specialization has 4 abilities. A unit equips 2, and they can be swapped freely between runs. Abilities change behaviour rather than add stats: counterattack after a dodge, hit the back row, taunt when an ally drops below half health, act first, cleave adjacent enemies.
- **Gear.** Class-specific slots plus generic slots. Rare cross-class capstones act as signposts for whole builds. Inventory is unlimited for now.
- **Formation.** The lock-and-key multiplier, inspired by Romancing SaGa. A front position that doubles defence makes a tank shine and is a misplay for a healer. The same units in a different formation can beat a different boss.
- **Self-contained units.** Abilities don't chain across classes. That keeps balance simulatable.

## Dungeons and combat

Dungeons are linear, about five minutes long, and fully automatic apart from perk picks between fights.

- **Linear progression.** The player plays the next dungeon. Cleared dungeons can be replayed for gear.
- **A run.** A series of fights ending in a boss, with resources wearing down across the fights.
- **Automatic combat.** No manual abilities, no programmed AI, no button mashing.
- **Perk picks.** 3 to 4 picks per run, between fights. Each dungeon has a themed pool of 10 to 15 perks. The player knows the pool's families before going in, but not which perks will appear or in what order, so they build a party to match the dungeon. Each pick offers 3 perks. Perks come in two rarities: regular, and a very rare premium perk that is either a stronger version or a unique one.
- **Perks amplify the build.** They boost what the party brought rather than replace it. Some modify an equipped ability for that run only, such as "Ranger's counterattack also applies bleed."
- **Fixed formation.** The formation can't change mid-run; solving it is part of preparation.
- **Unlimited retries.** Losing costs nothing, and a run lost halfway earns nothing. Repeating the same strategy rarely wins.

**Dungeon challenges.** Each cleared dungeon shows one next challenge, such as "beat it with two Rangers," "beat it with only two units" or "beat it with this formation." Clearing it pays gear, like a dungeon clear, and reveals the next one. The sequence is fixed, not curated by AI. Challenges turn solved dungeons into new puzzles, and give each new specialization a reason to revisit old content. A challenge that needs a specialization the player doesn't own shows as a teaser, which is a reason to do the quest that grants it. Upcoming boards favour offering a teased specialization, though not immediately every time, and other dungeons should usually be open in the meantime. Being blocked until more quests are done is fine.

## Encounter design (behind the scenes)

Encounters are lock-and-key puzzles built from a hidden vocabulary the player never sees directly.

- **Role verbs.** About 15 to 20 verbs, such as physical damage, magic damage, damage over time, burst or crit, evasion, blocking and healing. Every class, ability, gear piece, formation and enemy is described in this vocabulary.
- **Keys and keyholes.** A party brings about 5 keys, and a boss has about 3 keyholes. Matching enough of them wins. High efficacy can partly make up for missing keys.
- **What the player sees.** Enemy stats stay hidden, as in classic Dragon Quest. Each enemy gets a short description of how it behaves (agile, strong in numbers, hard to pin down, strikes many times a turn), never what beats it. Players infer the rest by watching fights. Trait words come from a fixed vocabulary tied to the role verbs, so "agile" always means the same thing and players learn the language over time. Monsters mix many keys, so no single trait is the whole solution. The dungeon's perk pool adds softer hints.
- **Tuning.** Encounters assume about 75% of best-in-class for that point in progression. Outcomes are pass or fail. Extra power shows up as a cleaner run through less attrition, not as a bigger score.
- **Off-builds.** Unusual builds are allowed and can work, but they can't trivialize content.
- **Built to generate.** Because each layer is self-contained, content can be generated one layer at a time and validated with large-scale simulation.

## Progression and rewards

Quests give keys, and play gives efficacy. Efficacy can partly substitute for keys, so grinding is the slow road past a wall and quests are the fast road.

| Reward | Source |
| --- | --- |
| Specializations | Quests |
| Formations | Quests |
| Powerful gear: class-specific pieces and cross-class capstones | Quests |
| Efficacy gear, which is most gear | Completing dungeons, replays and dungeon challenges |

- **Grinding is intended.** Replaying old dungeons for gear to reach later ones is part of the game. Loot comes only from completing a dungeon or a challenge.
- **Power-leveling isn't.** There are no unit levels and no XP, so there is never a reason to drag a weak unit through content.

## Validated by simulation

The game plays itself through menus and numbers, so thousands of versions of it can be built and tested. Simulation is the main design method, from combat rules and class power to pacing. The director gives intent for each step: references, preferences, ideas. The AI designs from it as a designer would, pushing back on direction that doesn't fit, then builds, simulates and tunes the design, and reports data plus its impression. The director sets the vision and judges the results rather than designing every system by hand. `method.md` has the full method.

- **Combat.** A combat engine with no UI builds and tests many versions of the mechanics: combat rules and whether the system holds up, class power and variance, formations, keys and keyholes, and the 75%-of-best-in-class tuning.
- **Progression.** Simulated players with different quest rates and decision quality play through all of version 1, week by week. Quest rates can be modelled on real data from Memory's event log.
- **AI playtests.** The game is text and numbers, so an AI can play it through the same interface a player uses and report what felt rewarding, confusing or flat.
- **Outputs.** Each run reports rewards per week, time stuck at walls, when party choices become meaningful, how often perks change outcomes, and a written impression.
- **Built for it.** Game logic runs without the UI, and randomness is seeded, so any run can be replayed exactly.

Simulation measures pacing and balance, not fun. AI impressions are a proxy; the real test of whether it motivates is a person using it.

**First questions for simulation.**

- Are 3 to 5 quest rewards a week enough? If not, which of the candidate fixes under Open questions works best?
- What mix of specializations, formations and powerful gear should quests pay?
- How long until party choices become meaningful, given 5-position formations and dungeons that cap party size?

## Version 1 scope

Version 1 is a deliberately narrow slice with at least three months of content. Content is AI-generated, so generate plenty, and add more when players reach the end.

**Sizing content.** The pace of walls is set by quest rewards, not play time, so content is planned by expected reward count. At 3 to 5 quest rewards a week, three months is about 36 to 60 rewards. That sets how many walls version 1 needs, and how many dungeons sit between them. The mix of quest rewards (specializations, formations, powerful gear) comes from number crunching and simulation. Leave headroom in the number ranges so later tiers don't force a rebalance.

**Deferred.**

- Choosing between dungeons or branching paths
- Prestige, tiers or resets
- Changing formation between fights
- An end-of-fight recap
- Retiring old gear, such as disassembling it
- A manual combat action, held in reserve if fights feel too passive: one per fight, with the enemy clearly signalling the moment

## Open questions

1. **Reward volume.** 3 to 5 quests a week is the right size for the board; more would turn it into a second Now map. Whether that yields enough rewards for a 5-unit party is for simulation to answer. Candidate fixes:
   - **Quest rewards as multipliers.** Each key unlocks many play rewards, such as a new specialization opening challenges across every cleared dungeon.
   - **Bundled quest rewards.** Each quest pays its shown headline reward plus supporting gear.
   - **A global level.** A second progression stream alongside gear.
   - **More dungeon rewards.** Play itself pays out more.
   - **A daily hero task.** One item from that day's Now map, picked by the game; the map never knows, and nothing is marked on it. It drops gear, with quality rolled from how hard and how rewarding the task is, while keys still come only from the weekly board. It vanishes at the end of the day with no streak or count, and never picks an item already on this week's board.
   - Other suggestions are possible too.
