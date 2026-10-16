# Step 3 report: simulation harness

Built Oct 16, 2026, from the approved design. For the director's sign-off.

## Decisions needed

1. **Sign off step 3.** This step's test is whether each sample report tells you what you need. There's one per level, all words first and each with a story:
   - [Combat](samples/combat.md): which parties win, how strict each dungeon is, and a what-if.
   - [Progression](samples/progression.md): optimizer, benchmark and casual player week by week, and what walls them.
   - [Feel](samples/feel.md): what a fresh reader could tell from the fights.
2. **Nothing else needs you now.** There are no challenges to your direction. The samples each ask one question, to show where questions go. Each belongs to a later step, so answer them or leave them for that step.

## What was built

All of the design. `npm run study -- studies/<name>.json` runs a study and prints a one-screen digest for the AI. `--report` drafts a report for you in the agreed order (in short, questions, stories, charts, how it was run). `--feel` writes reading packs for a fresh AI reader. Studies are small data files in `studies/`, results go to a folder git ignores, and any run can be rebuilt from its seed. The harness's core has no Node, so a page could run studies later. It's about 1,700 lines, twice my estimate, mostly because the progression level's players and benchmark took more than I guessed.

Changes from the approved design:

- **The ladder's top rung is at 80% strength, not full.** Nothing beats the full-strength Hollow in the stand-in (0 of 1,400 runs), so a full-strength top would be a wall no unlock breaks, which hides every other wall. The rungs run from 30% to 80%.
- **Two placeholder bars the design left open.** In progression, a dungeon counts as winnable if the best party wins 1 try in 10, since a player who retries will clear it. Strictness keeps "half its tries". Party choices "start to matter" when the best and worst full parties differ by half their tries, or a whole fight. Step 14 sets the real bars.
- **What broke a wall is judged from the party that actually won.** If it already owned a winner, or won with nothing new, the wall was broken by play.
- **The progression digest shows how each wall was sorted against what ended it.** This proved the most telling number in the sample (see below).
- **Reading packs hide enemy HP,** as in Dragon Quest. They show the party's HP, damage numbers, trait words and perk text.
- **A cleared dungeon's challenges all open at once.** The concept's one-at-a-time sequence is for steps 10 and 11.

## What the numbers say

The design's predictions, as the checklist:

| Prediction | Result |
| --- | --- |
| The same study gives the same numbers | Holds, run twice |
| No made-up effects | Holds. Formation, gear and abilities: identical on every seed. Changing only the unit order: no clear difference. The four perk numbers match in all 18 cases |
| Real effects show | Holds. Class and party size, in 20 of 20 seed blocks on every dungeon |
| Shared seeds pay off | **Half holds.** Copies match exactly. Judging a tweak to one party takes 4.4 times fewer runs (the median of 26 cases). **But comparing two different parties saves nothing** (×1.0 across 258 pairs). See below |
| Benchmark, optimizer, casual | Holds. The benchmark was never behind the optimizer in 600 player-weeks, and never over its budget. The optimizer beats the casual player in 20 of 20 blocks |
| Walls are sorted | Holds. Every stuck week was sorted, and no wall ended by loot. Not every wall ended with an unlock, as I'd predicted: walls where the player already owned a winner ended through play |
| An honest reader | Holds, for one reader. It called the stand-in flat, and named no stat it wasn't shown |
| A digest fits on one screen | Holds: 22 lines for combat, 31 for progression |
| Speed | Holds. The combat sample (205,800 runs) takes 35 seconds, and the progression sample takes 44 |

**Why shared seeds don't help between different parties.** Each fight draws all its dice from one stream. Change the units, and they use that stream in a different order, so the same seed no longer means the same luck. The comparisons stay fair; they just aren't cheaper. Step 4 can fix this cheaply by giving each unit its own dice within a fight, so that the same seed brings the same enemy luck whatever party faces it. That's step 4's call, not a decision for you now.

**The price of the "good-enough" benchmark** (your change in the design review). On the progression sample:

| Benchmark budget | Behind the optimizer | Walls sorted differently from a full search |
| --- | --- | --- |
| 100 runs | 4 player-weeks | 5 weeks |
| 300 runs (as built) | 0 | 0 |
| 3,000 runs (never runs out) | 0 | – |

At 300 runs it costs nothing here. Real content has far more parties to search, so later steps should recheck this.

**What the sample progression says, placeholders and all.** Two findings are worth carrying forward:

- **Content runs out fast.** With 4 to 7 quests a week, the optimizer earns about 4.4 unlocks a week. The worked example's 10 unlocks are gone by week 3, after which the optimizer is never stuck. Twelve weeks would take 50 to 65 unlocks, which fits the concept's 36 to 60 for three months. This is for steps 15 and 16.
- **"Walled by play" sometimes isn't.** Walls sorted as "challenges left" all ended with an unlock, because the challenge loot that might have helped never did. With real gear, the sorted-against-ended table will show whether challenge loot really breaks walls.

## Feel

The reader was the honest critic the design hoped for. Its top complaints:

- boss fights of 27 to 79 identical rounds
- nothing in any description ever happens in a fight
- perks with no visible effect
- close calls that can't be seen

These are all true of the stand-in. It guessed a winning colour in 2 of 3 lost runs. The miss came from trusting a description (Clerics heal) that the stand-in doesn't honour. It also caught a mistake in my pick rules (a "comeback" that wasn't one), which is now fixed. Two things it found matter beyond the stand-in, both for step 22: exact damage numbers let a player work out hidden HP (it estimated the boss at 208, and she has 208), and close calls are invisible. Worth reading: [the reader's answer on pack 1](samples/feel-answers.md), the closest loss.

## For later steps

- **Step 4:** give each unit its own dice within a fight, so different parties can share luck, and bump the engine version if you do. Real combat will be slower, so recheck speed, and sample parties rather than trying them all. The harness reads only units' side, HP and max HP from a fight. The reader's main complaint will be step 4's test: descriptions must show up in fights.
- **Steps 5 and 8 to 10:** replace `classColour` in `src/sim/parties.ts` with the real colour.
- **Steps 10 and 11:** decide the challenge sequence. Watch the sorted-against-ended table once gear works.
- **Step 14:** set the win bars (half for strictness, 1 in 10 for clearing) and the "choices matter" threshold.
- **Steps 15 and 16:** about 50 to 65 unlocks for twelve weeks at 4 to 7 quests a week.
- **Step 19:** the board here deals unowned unlocks evenly. The concept favours teased specializations.
- **Step 22:** exact damage numbers reveal hidden HP, and close calls need a visible sign.

## Method notes

- **The feel check tested the tools as well as the game.** The reader caught a mislabelled pick that no unit test would have.
- **My design's review sample used made-up numbers the content couldn't produce:** a key unlock arriving in week 7 from a pool that empties by week 3. For engine-like steps, a crude real run makes a truer review sample than an invented one. I'd add that to the method's stage 2 at sign-off.
- **One reader cost about 6 minutes for 7 runs.** Keeping feel checks to checkpoints, as designed, looks right.
