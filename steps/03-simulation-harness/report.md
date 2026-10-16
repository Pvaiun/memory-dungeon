# Step 3 report: simulation harness

Built Oct 16, 2026, from the approved design, then revised the same day after the director's first read (the casual player, plain wording, perks, and the "For later steps" list). For the director's sign-off.

## Decisions needed

1. **Sign off step 3.** This step's test is whether each sample report tells you what you need. There's one per level, all words first and each with a story:
   - [Combat](samples/combat.md): which parties win, how strict each dungeon is, and a what-if.
   - [Progression](samples/progression.md): optimizer, benchmark and casual player week by week, and what walls them.
   - [Feel](samples/feel.md): what a fresh reader could tell from the fights.
2. **Nothing else needs you now.** There are no challenges to your direction. The samples each ask one question, to show where questions go. Each belongs to a later step, so answer them or leave them for that step.

## What was built

All of the design. `npm run study -- studies/<name>.json` runs a study and prints a one-screen digest for the AI. `--report` drafts a report for you in the agreed order (in short, questions, stories, charts, how it was run). `--feel` writes reading packs for a fresh AI reader. Studies are small data files in `studies/`, results go to a folder git ignores, and any run can be rebuilt from its seed. The harness's core has no Node, so a page could run studies later. It's about 1,700 lines, twice my estimate, mostly because the progression level's players and benchmark took more than I guessed.

**How perks are picked.** Every study says how. Combat studies pick at random, or from a fixed priority list. A random pick comes from the seed's own dice, so parties being compared get the same picks from the same offers. For the four perk numbers, each dungeon's 3 best parties play every combination of picks on each seed (27 combinations for 3 picks from 3 offers):

- **Hindsight:** the best combination on each seed, as if the player knew how every later fight's dice would fall.
- **Knowable:** a priority list learned on half the seeds and played on the other half, standing in for the best a player could know.
- **Random:** the average combination.
- **Worst:** the worst combination.

In progression, the optimizer learns perks by trial and error. It tries each perk it hasn't picked yet, then favours the ones its runs did best with. The casual player and the benchmark pick at random. The stand-in ignores perks, so all of these came out the same, which the samples show only in passing.

Changes from the approved design:

- **The six dungeons are weakened copies of the worked example.** It has only one dungeon, and nothing can beat it with the stand-in: none of 1,400 tries won. A progression sample needs dungeons that some parties can beat, so I made six copies. In the first, the monsters have 30% of their normal HP and attack; in the sixth, 80%. The design had the sixth at full strength, but then it would be a dungeon nobody ever clears. This only matters for the samples, and it's thrown away when real dungeons arrive.
- **The casual player now changes its party** (after your first read). The first version kept its first full party forever, so a new unit could sit unused for weeks, and most of its stuck weeks came from that rule, not the game. Now it puts each new unit straight in, and after two losses in a row it swaps one unit, preferring one it hasn't tried there yet. It still never touches formations, gear or abilities, and still picks perks at random. Its stuck weeks fell from 184 to 81 of 600, and none is stuck at the end.
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
| A digest fits on one screen | Holds: 19 lines for combat, 28 for progression |
| Speed | Holds. The combat sample (205,800 runs) takes 35 seconds, and the progression sample takes 43 |

**Why shared seeds don't help between different parties.** Each fight draws all its dice from one stream. Change the units, and they use that stream in a different order, so the same seed no longer means the same luck. The comparisons stay fair; they just aren't cheaper. Step 4 can fix this cheaply by giving each unit its own dice within a fight, so that the same seed brings the same enemy luck whatever party faces it. That's step 4's call, not a decision for you now.

**The price of the "good-enough" benchmark** (your change in the design review). On the progression sample:

| Benchmark budget | Behind the optimizer | Walls sorted differently from a full search |
| --- | --- | --- |
| 100 runs | 4 player-weeks | 5 weeks |
| 300 runs (as built) | 0 | 0 |
| 3,000 runs (never runs out) | 0 | – |

At 300 runs it costs nothing here. Real content has far more parties to search, so later steps should recheck this.

**What the sample progression teaches about the harness itself.** Two things:

- **A study needs enough content for the weeks it covers.** The worked example's 10 unlocks are gone by about week 4, and after that the optimizer is never stuck, so there's nothing left to measure. The digest now says when each kind of player's quest board runs dry, so empty weeks aren't read as a finding.
- **"Walled by play" sometimes isn't.** Walls sorted as "challenges left" all ended with an unlock, because the challenge loot that might have helped never did. The table of how each wall was sorted against what ended it is how to catch this.

## Feel

The reader was the honest critic the design hoped for. Its top complaints:

- boss fights of 27 to 79 identical rounds
- nothing in any description ever happens in a fight
- perks with no visible effect
- close calls that can't be seen

These are all true of the stand-in. It guessed a winning colour in 2 of 3 lost runs. The miss came from trusting a description (Clerics heal) that the stand-in doesn't honour. It also caught a mistake in my pick rules (a "comeback" that wasn't one), which is now fixed. Two things it found matter beyond the stand-in, both for step 22: exact damage numbers let a player work out hidden HP (it estimated the boss at 208, and she has 208), and close calls are invisible. Worth reading: [the reader's answer on pack 1](samples/feel-answers.md), the closest loss.

## For later steps

Notes on the simulation system only. Nothing here carries the placeholder content's mechanics forward.

- **Step 4, the first real combat:**
  - Recheck speed. Real fights will be slower, so studies may need to sample parties rather than try them all.
  - The harness reads only each unit's side, HP and max HP from a fight, so the new battle system needs to keep those.
  - Comparing different parties only gets cheaper if the same seed brings the same luck whatever party plays it, for example if each unit draws its own dice. Weigh that when choosing how fights roll dice.
- **Steps 5 and 8 to 10:** colour is one swappable piece of the harness (`classColour` in `src/sim/parties.ts`). Replace it with the real definition.
- **Steps 10 and 11:** the harness opens all of a cleared dungeon's challenges at once and rolls their loot itself. Match whatever those steps decide.
- **Step 11:** the benchmark picks perks at random, because it searches for parties. Once perks change results, give it the learned perk list, or it will call walls real that good picks would break.
- **Step 14:** the harness's placeholder bars are step 14's to set: half the tries for strictness, 1 try in 10 for clearing, and the "choices matter" threshold.
- **Steps 15 and 16:** recheck the benchmark's budget once there are many more parties to search, and size progression studies to the content.
- **Step 19:** the harness's board deals unowned unlocks evenly. Update it to the real board.
- **Step 22:** one feel-check finding holds for any combat that shows exact damage and hides HP. A careful reader can add up damage to find HP, and a close call reads like any other loss.

## Method notes

- **The feel check tested the tools as well as the game.** The reader caught a mislabelled pick that no unit test would have.
- **My design's review sample used made-up numbers the content couldn't produce:** a key unlock arriving in week 7 from a pool that empties by week 3. For engine-like steps, a crude real run makes a truer review sample than an invented one. I'd add that to the method's stage 2 at sign-off.
- **One reader cost about 6 minutes for 7 runs.** Keeping feel checks to checkpoints, as designed, looks right.
- **Stories caught a wrong number, as your intent said they would.** In the first version, the casual player's stuck weeks measured my rule for it, not the game, and you spotted it from the diary. A simulated player's rules deserve the same check as any other number: read one player's story before trusting its totals.
