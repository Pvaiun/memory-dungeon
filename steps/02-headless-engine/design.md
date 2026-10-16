# Step 2 design: headless engine

Approved by the director, Oct 16, 2026 (second draft). Built from `intent.md`.

## What changed from the first draft

- **Step 2 no longer builds the battle system.** The first draft ran the schema's whole rule language, and picked rules for how combat plays out. That was designing step 4's battle system before your input on it. This draft builds only the machinery any battle system needs, and tests it with a deliberately crude stand-in fight. Step 4 designs the real combat, starting from your intent, and builds it into this machinery.
- **Inputs are general.** Any point in a run can stop and ask for a decision. Perk picks are the first kind of decision, not the only one.

## Approval

The director approved the split and the fuller run summary under Challenges on Oct 16. The design plan wording at the end is applied.

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

## What steps 4 and 6 inherit

- **The machinery above.** Step 4 (combat concepts) builds the basics of combat into it and replaces the stand-in; step 6 (mechanics) adds the rest.
- **The schema's rule language** (statuses, triggers, passives and the rest), as a starting point and nothing more. Steps 4 and 6 can keep it, change it, drop parts of it, or start over altogether.

## Intent map

| Intent | | How |
| --- | --- | --- |
| [lean] Fight logs are mostly for the AI and for debugging | Used | The log is data for code to count, plus a printout for debugging. |
| [idea] Players may eventually see logs | Used | Entries are marked player-visible or hidden, so a player's log is a filter. |
| [firm] The building blocks are placeholders | Used | Step 2 builds none of them. Steps 4 and 6 can keep, change or drop them, or start over altogether. |
| [firm] Input at the start of the battle system | Used | That's the reason for the split. The battle system starts at step 4's intent. |
| [lean] Perk picks are the only in-run choice, for now | Used | They're the only decision the worked example asks for. |
| [lean] Don't make perks the only input | Used | Decision points are general, and can come between stages or between turns. |
| [idea] Simulate every perk choice | Used | The explorer branches on every decision. See "Hindsight" under For later steps. |
| [lean] It's hard to know the right perks without a human | Used | The explorer shows which picks win, not which are interesting to choose. Perk feel stays with you at step 11. |
| Left to me: run flow, random-number generator, log format | Decided | As above. How much of the rule language to build is now settled by the split: none in step 2. |

## Challenges

1. **A run summary needs more to be replayable.** `DECISIONS.md` has the server keeping each run's seed, outcome and loot. Rebuilding a run also needs the party loadout, every decision made, and the content and engine versions. Agreed by the director, Oct 16. Step 20 settles the save format.
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

- **Hindsight in the explorer (steps 3 and 11).** The best path for a seed knows how every later fight's dice fall, and a player can't. So when step 11 reports how much picks matter, it should give four numbers: the hindsight best, the best without hindsight (the pick that wins most often on average), random picks, and the worst.
- **Where a retry's seed comes from (step 11).** If every retry draws new dice and fights are swingy, a player can retry until they get lucky. That works against "repeating the same strategy rarely wins".
- **Perk offers (step 11).** How premium perks are offered, and whether one replaces its regular version.
- **Challenge loot (step 10 or 11).** Does clearing a challenge also pay the dungeon's replay loot?

## Design plan wording

Applied to `docs/design-plan.md` on approval:

- **Step 2, Designs:** "The machinery under combat and runs: seeded randomness, runs as savable data, decision points, exact replay and logging. It's tested with a throwaway stand-in fight; step 4 builds the real combat into it."
- **Step 4:** superseded on Oct 16, when step 4 was split into combat concepts (step 4) and mechanics (step 6). See `docs/design-plan.md`.
