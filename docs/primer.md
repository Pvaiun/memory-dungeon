# Primer: the Memory Dungeon Game

What the game is, how it's being made, and where it stands. It's written for a reader with no access to the design repo, such as an AI interviewing the director about one design step. It describes; it doesn't decide. Where it and a step's brief differ, the brief is newer.

Updated Oct 23, 2026, after the director's core set.

## Memory, and why the game exists

Memory is the director's personal memory app, built for someone with ADHD. You type anything into one box, and AI splits it into items (tasks, habits, events, facts, goals) and files them. A small "Now" map shows what matters today; everything else waits on the shelves.

The game is an optional tab inside Memory. It exists to fix two problems Memory has:

1. **Flat incentive.** An item pulls on you the same on day 30 as on day 1, so anything that slips past its first few showings can slip forever.
2. **Noticing.** Chores, upkeep and goals rarely get captured, because capturing them means noticing them first. That's the core ADHD gap.

The tasks stay the point, and the game is a reason to do them. These principles are firm:

- Real-life quests give the game's most important rewards. Play gives the rest.
- Ignoring the game costs nothing, and Memory stays fully useful without it.
- The game never appears on the Now map, never sends notifications, and never punishes losing or being away.
- The player always chooses. The AI suggests and never assigns.

## The game

A party-based JRPG dungeon crawler with automatic combat, where preparation is the game. The skill is building a party and learning by trial and error, not performing in a fight.

**Right now, the core set.** What's being built at the moment is a vertical slice of this game, which the director designed as four documents (rules and vocabulary, classes, gear and formation lists, enemies): the game part, without the quest board or reward streams. Its progression is still to be decided, starting with none: everything is available, and combat, formations, gear and the battle system are tested freeform. The full game described below grows out of it later. Where the slice differs from the concept (parties of 3 rather than 5 in the first playable, 16 classes, three gear slots per unit, formations of three slots), the slice is what's built.

**The loop.**

1. Each week the AI deals a **quest board** from the player's real items in Memory: notice something that needs doing, do a long-stalled task, keep a habit all week, review an old item, set a goal. Each quest shows its reward up front, and completing it pays an **unlock**: a new class, formation or powerful piece of gear.
2. The player **builds a party** of up to five units from what they've unlocked.
3. The party **runs a dungeon**: a few automatic fights, a perk pick between each, then a boss. The player watches.
4. A cleared dungeon pays **ordinary gear**, which goes back into the build.
5. **Stuck at a wall?** A cleared dungeon's challenges pay more gear, but there are only so many. Once they're done, only quest unlocks move the player on, because they open new strategies.

**A party.** Each unit is a class; there are no specializations. The player owns each class once and gears it once, and a party holds at most one of each. To start, a class has a unique passive, five abilities of which it brings three into a fight, and a restriction to some weapon types. Units don't level up. Its abilities change how it behaves (counterattack after a dodge, taunt when an ally is hurt) rather than adding stats. Gear sets how well it does those things. The party stands in a **formation** of five slots, each with its own effects, in the style of Romancing SaGa: a slot that makes a unit harder to target, or acts first, or hits harder. The same units in a different formation can beat a different boss. There's no battlefield geometry, so no rows, reach or positional targeting, and units mostly attack by simple, traditional habits.

**A run.** Dungeons are linear and about five minutes long. Resources wear down across the fights. Between fights the player picks one of a few **perks** from the dungeon's themed pool, which amplify what the party brought. The formation can't change mid-run. Losing costs nothing, and retries are unlimited, but repeating the same strategy rarely wins. A cleared dungeon reveals a sequence of **challenges** ("beat it with only two units") that turn solved dungeons into new puzzles.

**How fights read.** Enemy stats stay hidden, as in classic Dragon Quest. Each enemy gets a short description of how it behaves ("agile", "strikes many times a turn") from a fixed vocabulary, never what beats it. Players learn the rest by watching, so combat feedback has to be crystal clear. The look borrows from Game Boy-era JRPGs: mostly text and numbers, chunky damage numbers, big words like MISS and BLOCKED. The writing carries the charm. The setting is generic medieval fantasy with touches of Greek, Norse and Japanese mythology.

**Behind the scenes.** Encounters are designed as lock-and-key puzzles. A party brings strengths (keys), and a boss has gimmicks that call for them (keyholes). Matching enough wins, and raw power can partly make up for a missing key. Keys and keyholes are the designer's predictions, never rules the game checks, and the player never sees them. Content is meant to be generated by AI from the director's phrases and gimmicks, then tuned by simulation.

**Numbers in the concept.** The concept spec gives many numbers: 8 to 10 classes, 5 abilities per class with 3 equipped, 3 or 4 perk picks a run, encounters tuned for a party at 75% of the best possible. Treat these as starting guesses. Most are set or replaced by the steps that design those systems. One is already set: 4 to 7 quests a week for the first version.

## How it's being made

The game is also a test of a way of making games. The director sets the vision and judges the results. AI designs, generates content and tunes it, and simulation stands in for most playtesting: the game plays itself through menus and numbers, so thousands of versions can be tested. Simulation measures balance, not fun. AI reads of fights stand in for players, and the real test is a person using it.

The work was planned as 24 ordered design steps, a first pass to iterate from. The first three built the foundation and the fourth built combat; then steps 4 to 12 proved too interlocked to design one at a time, and the director designed them together as the core set. The steps after it stand. Each step runs three stages, and each stage ends with the director:

1. **Intent.** The director says what they want for the step, through an interview from a short brief. The answers are recorded in the director's words, each tagged firm, lean, reference or idea. The interviewer asks and doesn't design.
2. **Design.** The AI designs from the intent, maps every intent item to the design, and challenges anything it thinks doesn't fit, with reasons. The director approves.
3. **Build and tune.** The AI builds the design, simulates and tunes it, running the checks the step needs (and asking when unsure), and reports in plain words, with how sure each conclusion is.

Direction is guidance, not law. "Firm" means bend it only with evidence and the director's agreement; "lean" means the designer may bend it, and says so. The AI is expected to push back early with evidence, and never to change a direction silently.

**The director's preferences.**

- Short, plain-language write-ups that lead with decisions and open questions. They don't read data files or fight logs.
- Mechanics built from a few numerical systems (stats, statuses, damage types, flags, targeting). No bespoke keywords acting as locks, and nothing that eats the player's brainpower.
- Design before code. Code that serves the design stays small.
- They'd rather hear a challenge early than after a lot of wheel-spinning.

## Where it stands

**Step 1, content schema.** A data format for every kind of content, and one small worked-example dungeon, the Hollow of the Grey Mother. It describes a game much like the one the director wants, but it came before the method, so it's a starting point, a JRPG-style framework, rather than locked design decisions. Its classes, numbers, formulas and rule-language building blocks are all placeholder, and later steps may keep, change or drop them. The ideas from its review that this primer already describes (no geometry, simple targeting, SaGa-style formations, keyholes as predictions) are where later steps start.

**Step 2, headless engine.** The machinery that plays runs with no screen: seeded dice, runs as plain data, pauses for player decisions, exact replay and logs. Fights run in the player's browser from a seed, and the same seed gives the same fight on every device, so the server stores only a small replay record per run. Combat maths uses only basic arithmetic (no powers, roots or logarithms), so curves are written as ratios or small tables. The battle system is one swappable piece, which step 4 filled with real combat without touching the rest.

**Step 3, simulation harness.** The tool every later step uses to test its design. It runs thousands of simulated fights and simulated players' weeks, and says how sure each result is. Reports to the director are words first, then one to three stories (a fight retold in a few lines, or a simulated player's weeks), then at most three simple charts; the director catches wrong numbers mainly through the stories. The game is tuned for the optimizer, a player who does most quests and homes in on a build by trial and error, with a good-enough benchmark beside it and a casual player as a check. Strictness is how custom a party has to be: how many colours (broad kinds of party) can win, and how many tweaks win inside them. For the full game, replays are challenges only, each paying loot once, so there's no endless grinding. Feel checks mainly test that information is clear: a fresh AI reader, seeing only what a player sees, says whether it could tell why a fight was lost.

**Step 4, combat concepts.** The director wrote this design themselves, and it's now the engine's combat. In short:

- Fights are automatic and run on ticks. Every action (a weapon's basic attack, or an ability) has a cast time, a cooldown and a recovery; a unit starts its first available ability, else its basic attack. Abilities have a short default cast and a recovery about a sword's.
- Damage is physical (slash, pierce or blunt: meets Evasion and Armor) or magical (an element: meets that element's Resistance). Every amount states its own scaling, from any stats or none; nothing scales by default, and no stat is tied to a damage type (physical things scaling from Attack is a convention). Boosts, damage-taken modifiers, crits, riders and shields follow one resolution order.
- Everything that happens on an event or a timer is a status: buffs, debuffs, damage over time, stuns and silences (lockouts), auras, and passives' reactions. A status is fixed when applied: the application scales the stacks it adds, from whatever stats it names, and a stack is a stack whoever applied it. Status damage is untyped and unresisted by convention. A reapplied Refresh status replaces the old one. Stacking statuses (Intensity) end below 1 stack.
- Default targeting picks foes weighted by Aggro, which taunts (Forced) and stealth (Forbidden) override; abilities can state their own targeting.
- Content is data built from stats, statuses, actions and targeting rules. The numbers are placeholders.

Writing this step showed that the plan's steps 4 to 12 (verbs, mechanics, traits, units, formations, gear, runs, encounters) interlock too much to design one at a time, which led to the core set.

**The core set.** The director's vertical slice, designed as four documents (Oct 23, 2026). *Rules and vocabulary* has the game rules and the combat system: 22 statuses, 7 special stats and 6 effects, each with a tier (Fundamental, Specialist or Signature), 7 elements with a job each, 13 weapon kinds, and the gear and formation rules. *Classes* has 16 classes, each a passive, three abilities and a plan, with a test fight each and parties of 3 against 12 sample challenges. *Gear and formation lists* has 90 pieces and 10 formations, designed against each class's build forks, with a coverage check. *Enemies, encounters and dungeons* has 29 enemies, 27 encounters and 7 dungeons played in order, built against 61 challenges, and adds a few rules, such as summoning and enemy-only Doom and Bulwark. The core set's rules supersede step 4's design where they differ. **It's built (Oct 23, 2026):** the engine runs the core set's rules, every class, piece of gear, formation, enemy, encounter and dungeon is in the content, and every number on the documents' relative scale has a first value, put in the ballpark by a short tuning pass. The report is with the director; the balance pass by simulation comes after it.

## What's ahead

1. **The core set's sign-off:** the director reads the build's report.
2. **A visual interface,** so the director can see and play the slice before more design. A first version is in (Oct 24, 2026): party, formation and gear menus, class sheets, a bestiary, and a battle screen that shows any fight as it plays, with the director's sprites. The balance pass by simulation, which tunes the first values, comes after the director has looked at it.
3. **The full game,** grown out of the slice: content and balance at volume, progression pacing, the quest board, screens, onboarding, and a review against the principles. The original plan's later steps are the starting point, revisited then.

A question that belongs to later work can be noted and left for it.

## Words

- **Core set:** the vertical slice being built now: rules, combat, classes, gear, formations and enemies, with its progression still to be decided, starting with none.
- **Unlock:** a quest reward (class, formation or powerful gear).
- **Keys and keyholes:** encounter-design terms for a party's strengths and the gimmicks that call for them. Predictions only.
- **Verbs:** a hidden design vocabulary for roles (physical damage, healing, evasion…). The game never reads them.
- **Traits:** the player-facing words that describe enemies.
- **Efficacy:** raw power from gear, which can partly make up for missing keys.
- **Wall:** a dungeon the player's current party can't beat.
- **Feel check:** an AI reading a fight with enemy stats hidden, reporting what it could tell and what felt flat.
- **Worked example:** the placeholder dungeon from step 1, used to test the engine and harness.
