# Step 3 brief: simulation harness

For the director to answer. You can answer it in the step's session, run `/intent 3` in a fresh session on this repo, or paste this whole file into any chat and bring back the `intent.md` it produces.

## The game, and this step

Memory is a personal memory aid for someone with ADHD. It captures tasks, habits, events and goals, and shows what matters today on a small "Now" map. The game is an optional tab inside it: a party-based JRPG dungeon crawler with automatic combat, where preparation is the game. Real-life quests on a weekly board pay unlocks (new specializations, formations and powerful gear), and dungeons pay ordinary gear. The player builds a party of up to five units, sends it into a dungeon and watches: a few automatic fights, a perk pick between each, then a boss. AI designs the game under the director's direction, and simulation stands in for most playtesting.

Step 3 builds the simulation harness: the tool every later step uses to test its design, and the reports it writes for you. Step 2 built the engine, which plays one dungeon run from a seed in a fraction of a millisecond. The harness runs it thousands of times and turns the results into something you can judge. It works at three levels:

- **Combat:** many parties against many encounters. Win rates, how long fights last, how swingy they are, which units and abilities matter, and how much results differ between builds.
- **Progression:** simulated players playing the game week by week: doing some of each week's quests, building parties and running dungeons. Rewards per week, time stuck at walls, when party choices start to matter, and how often perk picks change the result.
- **Feel checks:** an AI reads fight logs with enemy stats hidden, and says what it could tell about the enemies and what read as flat.

This brief asks what you want reports to show you, and which kinds of player to simulate. Every later step reports to you through what's designed here.

**One thing to know first.** There's no real combat or content yet. Step 4 designs combat, and units, gear and dungeons come at steps 8 to 12. So step 3's sample reports will run on step 2's crude stand-in fight, the one worked-example dungeon, and placeholder progression. You'll be judging whether a report tells you what you need, not what its numbers say.

## Already decided

These aren't asked again.

- **How reports read.** Short and plain. They lead with what needs you: challenges, with both versions' numbers, then open questions.
- **Every conclusion says how sure it is,** such as "holds across all 20 seeds" or "only for skilled players". Results are checked across seeds, and across player skill levels where that matters.
- **No overfitting.** Some builds and encounters are held out of tuning, and the final result is checked on them.
- **You don't read fight logs.** They're data for the AI and for debugging. A fight worth your time is retold in a few lines, 2 or 3 per report.
- **Feel checks** say what the reader can tell about each enemy and what felt flat. Every step from here uses them, and they're the main test for steps 12 (encounters) and 22 (combat presentation).
- **How much perk picks matter** is reported as four numbers: the best picks with hindsight (knowing how every later fight's dice fall), the best picks a player could know to make, random picks, and the worst.
- **Simulation measures balance, not fun.** AI impressions stand in for players, and the real test is a person using it.
- **Targets come later.** This step decides what's measured and how it's shown, not what good numbers are. Win-rate bands and fight length come at step 14. Pacing, including how many quests a week you expect to do and how long being stuck feels fine, comes at step 15.

## Questions

Short answers are fine. "I don't mind" is an answer too: it leaves the call to the designer.

**1. What should reports answer for you?** Of the measures listed above, which do you want in front of you, and which can stay behind the scenes for the AI? Is anything missing? Some things a report could also show:

- how close the losses were: the boss nearly dead, or barely scratched
- how many tries a wall takes, and whether retrying with the same party ever gets through
- whether a stuck player already owned what they needed to win
- which enemy, unit or ability decided a fight
- the spread, not just the average: the luckiest and unluckiest of 100 tries

**2. How do you want results shown?** Pick and mix.

- **a. Words first,** with a few key numbers, like step 2's report.
- **b. Charts:** a few simple ones, such as win rate by party or rewards per week.
- **c. Stories:** one simulated player's weeks told as a short diary ("Week 3: did 2 quests, got Ranger: Archer, beat the Hollow on the fourth try"), or a fight retold.
- **d. Tables** to scan.

Where do you want to read them: a file in the repo opened in the Claude app, a private web page on your phone, or in the chat? And is there a report, stats screen or dashboard you've liked, from work, games or anywhere, and what made it good?

**3. Which kinds of player should be simulated?** Pick any, and add your own. Players differ in how many quests they do, how often they play, and how well they choose.

- **a. Casual:** does a couple of quests most weeks, plays a run or two, keeps whatever party works, and picks perks on a hunch.
- **b. Steady:** does most of the board every week and plays a few times a week.
- **c. Optimizer:** does most quests, and makes the best choices it can in party, formation and perks.
- **d. Quests only:** does quests but rarely replays dungeons for gear. Takes the fast road past walls.
- **e. Grinder:** does few quests and replays dungeons for gear a lot. Takes the slow road.
- **f. Bursty:** a big week, then weeks of nothing, and sometimes a month away. The game must never punish being away.
- **g. You:** modelled on your own habits (see question 4).

If the game can only be tuned well for one of them, which one?

**4. Where should simulated quest rates come from?** The design plan models them on Memory's event log. There's no quest board yet, so there's no quest data; your real history of captures and completions would stand in for it. This is only for simulation; the real board still reads item state, as decided.

- **a. Your real history.** You export Memory's event log, or part of it, and the progression level models its players on your real patterns: busy weeks, quiet weeks and gaps. It's your personal data, so the export stays out of the repo, and only summary numbers, such as weekly rates, are saved.
- **b. Assumptions:** plain made-up rates, such as "3 a week, sometimes none", which step 15 replaces.
- **c. Assumptions now,** and your real history at step 15, when pacing is tuned.

**5. What should feel checks look for?** What the reader can tell about each enemy, and what felt flat, are already set. Anything else? Pick any.

- moments that felt dramatic: comebacks, close calls, a win on the last hit
- fights that felt the same as the one before
- whether you could tell why a fight was lost, and what to change
- units that seemed to do nothing
- whether a dungeon built up to its boss
- the reader's guess at the right party for next time

**6. Do you want to use the harness yourself?**

- **a. No:** you read step reports, and that's all.
- **b. Ask it questions:** in a chat, you ask "what if the Ranger had double HP?" and get a short report back.
- **c. Try things yourself:** a page where you pick a party and a dungeon and see how it does.

## What the designer will decide

So you know what isn't being asked. Say if you want a say in any of it.

- How the harness is built: the scripts, how many runs and seeds, the statistics, and how "how sure" is worked out.
- How simulated players make their choices: how a casual player builds a party, and how an optimizer searches for the best one.
- The placeholder progression that step 3's sample reports run on.
- How feel checks are run: by the AI in a working session, or by automated calls to an AI service, which would need an API key and cost a little per check.
- Whether the feel reader sees only what a player would see, or everything except enemy stats.
- What's kept: reports go in the repo, and raw results are thrown away, since any run can be rebuilt from its seed.

## For the interviewer

If you're an AI reading this in another chat, you're the interviewer. The director's answers become `steps/03-simulation-harness/intent.md`.

- **Ask, don't design.** Where a question is hard to answer cold, offer options to react to, but hold back your own design.
- **Keep it short.** One sitting and the questions above. Follow up only where an answer is ambiguous.
- **Their words, not yours.** Record what the director said, lightly cleaned. Mark the items that were picks from the options above, so the AI doesn't end up quietly writing the vision.
- **Tag every item:**
  - **firm:** bend it only with evidence and the director's agreement.
  - **lean:** the designer may bend it, and says so.
  - **reference:** a game or work, with what to take from it.
  - **idea:** take it or leave it.
- **"I don't mind" is an answer.** Record it under "Left to the designer".
- **Don't re-ask** anything under "Already decided" unless the director reopens it.

Read the result back to the director as a short list and fix whatever they correct. Then output it in this format, so it can be saved as it is:

```
# Step 3 intent

How it was gathered (this session, /intent or another chat) and the date.

- [firm] ...
- [lean] ...
- [lean, picked from options] ...
- [reference] Game or work: what to take from it.
- [idea] ...

## Left to the designer

- ...
```
