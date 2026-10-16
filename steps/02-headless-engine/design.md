# Step 2 design: headless engine

For the director's approval. Second draft, Oct 16, 2026, built from `intent.md`.

## What changed from the first draft

- **Step 2 no longer builds the battle system.** The first draft ran the schema's whole rule language, and picked rules for things like when a counterattack lands. That was designing step 4's battle system before your input on it. This draft builds only the machinery any battle system needs, and tests it with a deliberately crude stand-in fight. Step 4 designs the real combat, starting from your intent, and builds it into this machinery.
- **Inputs are general.** Any point in a run can stop and ask for a decision. Perk picks are the first kind of decision, not the only one.

## Needs you

- **Approve the split.** It changes how the design plan describes steps 2 and 4. The proposed wording is at the end.
- **One gap to look at,** under Challenges: to replay a run, the server's summary of it needs more than the seed, outcome and loot.

## What step 2 builds: the machinery

None of this depends on what the battle system turns out to be.

1. **Seeded dice.** Each run has one seed. Each fight, perk offer and loot roll gets its own slice of it, so changing an early decision doesn't change a later fight's dice, which keeps comparing paths fair. The generator uses only whole-number arithmetic, so every browser gets the same numbers.
2. **A run as plain data.** The run moves forward one step at a time. At any pause it can be saved, resumed on another device, or copied to try different paths.
3. **Decision points.** The engine runs until the run ends or it needs a decision. Then it hands back the options and waits. Whoever is driving the run answers: the player, a simulation's picker, or the explorer.
   - A decision can come between stages, like today's perk picks.
   - It can also come between turns inside a fight, such as the manual combat action the concept spec holds in reserve.
   - Adding a new kind of decision later means defining that decision, not reworking the engine.
4. **The explorer.** It plays one seed down every combination of answers, branching from saved points, and reports each path's outcome. It works for any kind of decision, not just perks.
5. **The log.** It records everything that happened, in order, as data for code to count.
   - Each entry is marked as either something a player could see or a hidden number, so a future player-facing log is just a filter.
   - There's a plain printout for debugging.
   - Logs can be switched off for bulk runs, and a run worth a look is replayed with them on. Nothing is stored.
   - Each run's record starts with what's needed to replay it: the engine version, the content's id and fingerprint, the party, dungeon, seed and every decision.
6. **The same result on every device.** A test checks that the engine never uses the clock, `Math.random`, or the maths functions that can differ between browsers.
7. **Measurement.** It reports the time per fight, per run and per exploration, and the size of a log.

It lives in `src/engine/`, with tests beside it, inside the typecheck that keeps out Node-only code. A small Node script runs a dungeon from the command line. I expect about 500 lines.

## The stand-in fight

The machinery can't be tested without fights to run. The stand-in is crude on purpose, so nobody mistakes it for a design, and step 4 deletes it.

- Units act in speed order. Each attacks a random enemy, rolls to hit using its accuracy, and deals attack minus defence, with a minimum of 1. A side with nobody standing loses.
- It reads only base stats from the worked example. It ignores abilities, statuses, gear effects, formations and perks.
- HP carries between fights, with no healing.
- Perk offers show 3 random perks from the dungeon's pool, which exercises the decision machinery. A picked perk does nothing in the stand-in. To check that the explorer's branches really differ, the tests use a test-only decision that changes a stat.
- Loot rolls from the dungeon's tables.

## What step 4 inherits

- **The machinery above.** Step 4 builds its combat rules into it and replaces the stand-in.
- **The schema's rule language** (statuses, triggers, passives and the rest), as a starting vocabulary to keep, change or drop. It isn't a given.
- **The questions any combat design here has to answer.** I hit these while drafting the first version:
  - When does a reaction like a counterattack land: at once, in the middle of the attack that caused it, or after?
  - What does "once per turn" reset on?
  - Is turn order fixed for a round, or does a speed change take effect mid-round?
  - If a multi-hit attack's target falls, are the remaining hits lost or redirected?
  - When does a fight end, and what if both sides fall together?
  - How do stacks of a status from two different units combine?
  - Does a stunned unit's turn still count for its timers and damage over time?
  - What carries between fights: HP, statuses, cooldowns?
- **Your reaction to five of them.** The first draft answered the first five questions, and you thought those answers were right. Step 4 can start from them, marked as picked from my options rather than given by you:
  1. A counter lands at once.
  2. "Once per turn" resets on every unit's turn.
  3. Turn order is fixed for each round.
  4. Remaining hits on a fallen target are lost.
  5. A fight ends the moment a side is wiped out, and a double wipe is a loss.

## Intent map

| Intent | | How |
| --- | --- | --- |
| [lean] Fight logs are mostly for the AI and for debugging | Used | The log is data for code to count, plus a printout for debugging. |
| [idea] Players may eventually see logs | Used | Entries are marked player-visible or hidden, so a player's log is a filter. |
| [firm] The building blocks are placeholders | Used | Step 2 builds none of them. Step 4 takes them up as a vocabulary to react to. |
| [firm] Input at the start of the battle system | Used | That's the reason for the split. The battle system starts at step 4's intent. |
| [lean] Perk picks are the only in-run choice, for now | Used | They're the only decision the worked example asks for. |
| [lean] Don't make perks the only input | Used | Decision points are general, and can come between stages or between turns. |
| [idea] Simulate every perk choice | Used | The explorer branches on every decision. See "Hindsight" under For later steps. |
| [lean] It's hard to know the right perks without a human | Used | The explorer shows which picks win, not which are interesting to choose. Perk feel stays with you at step 10. |
| Left to me: run flow, random-number generator, log format | Decided | As above. How much of the rule language to build is now settled by the split: none in step 2. |

## Challenges

1. **A run summary needs more to be replayable.** `DECISIONS.md` has the server keeping each run's seed, outcome and loot. Rebuilding a run also needs the party loadout, every decision made, and the content and engine versions. I'll treat those as part of the summary unless you object. Step 19 settles the save format.
2. **Replays only hold within a version.** Once the engine or content changes, an old seed plays out differently, and with no stored logs, past fights can't be watched again. If a player-facing log ever shows past fights, it will have to store what it shows. This is a note for that feature.

## Predictions

Stage 3 checks these.

- **Replay:** the same inputs give an identical log over at least 10,000 seeded runs. A run saved and resumed at a decision gives the same log as one played straight through.
- **Branching:** with the test-only decision, the explorer's paths produce different outcomes. The worked example's 3 picks give 27 paths for the cost of 40 fights, because paths share their early fights.
- **Speed and size:** stand-in fights take well under a millisecond, and exploring all 27 paths takes under 10 ms. These numbers only measure the machinery. The stand-in does so little that real combat will be slower and log more. Step 4 reports the real numbers, which are the ones the tech-stack brief asked for.
- **End to end:** the worked example runs for a spread of parties across many seeds, with no errors.

There's no tuning in this step, since the stand-in's numbers don't matter. If the build runs past about one session, I'll stop and report rather than spiral.

## How it's tested

- **Replay and resume:** the checks under Predictions.
- **Branching:** the test-only decision shows that paths differ, and that the dice for a later fight don't change with an earlier answer.
- **A guard test** for the clock, `Math.random` and the maths functions that can differ between browsers.

## For later steps

- **Hindsight in the explorer (steps 3 and 10).** The best path for a seed knows how every later fight's dice fall, and a player can't. So when step 10 reports how much picks matter, it should give four numbers: the hindsight best, the best without hindsight (the pick that wins most often on average), random picks, and the worst.
- **Where a retry's seed comes from (step 10).** If every retry draws new dice and fights are swingy, a player can retry until they get lucky. That works against "repeating the same strategy rarely wins".
- **Perk offers (step 10).** How premium perks are offered, and whether one replaces its regular version.
- **Challenge loot (step 9 or 10).** Does clearing a challenge also pay the dungeon's replay loot?

## Proposed design plan wording

This applies once the design is approved.

- **Step 2, Designs:** "The machinery under combat and runs: seeded randomness, runs as savable data, decision points, exact replay and logging. It's tested with a throwaway stand-in fight; step 4 builds the real combat into it."
- **Step 4, Designs:** add "Starts from the director's intent, with the schema's rule language as a vocabulary to keep, change or drop, and builds the combat system into the engine, replacing step 2's stand-in."
