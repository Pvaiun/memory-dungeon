# Step 2 report: headless engine

Built Oct 16, 2026, from the approved design. For the director's sign-off.

## Decisions needed

1. **Sign off step 2.** The engine machinery works, and every prediction in the design held. There are no challenges.
2. **The run summary, for `DECISIONS.md`.** As agreed on Oct 16, this goes in at sign-off: *"A run's server summary holds its replay record (the engine and battle-system versions, the content's id and fingerprint, the party, dungeon, seed, whether it was a first clear, and every decision), plus its outcome and loot. A record only replays on the same versions."* Two things are new since the design. The record names the battle system, and it notes whether the run was a first clear, because first clears and replays roll loot from different tables. It comes to about 0.8 KB a run.

## What was built

All of the design, in `src/engine/`: seeded dice, a run as plain data, decision points, the explorer, the log, the stand-in fight, and tests. The tests cover replay, resume, branching, end-to-end runs, and the rule against inexact maths. A command-line script, `npm run dungeon`, prints a run, explores a seed, or measures speed and size. The engine is about 570 lines, of which the stand-in is 120.

Changes from the design, all small:

- **The battle system plugs in as one piece.** The stand-in is a single module behind a fixed interface. Step 4 writes its own module and deletes the stand-in, without touching the machinery.
- **Content is checked once, when it loads** (15 ms). The party is checked when a run starts.
- **A decision with no options is skipped**, rather than leaving the run stuck.
- **A safety stop at 500 rounds** counts as a loss, in case content ever makes a fight that can't end. It never fires with the worked example.
- **Perk offers leave out perks already picked**, as the worked example's settings say. Premium perks aren't treated differently yet.
- **Challenge loot isn't rolled.** That's still open for steps 10 and 11.

## What the numbers say

- **Replay holds.** 10,000 runs across all 70 small parties rebuilt identical logs from their records. 900 runs saved and reloaded at every decision, including in the middle of a fight, matched runs played straight through. That held for every run tested.
- **Chrome and Safari agree.** I ran the same 10,000 runs on the JavaScript engine inside Chrome (through Node) and the one inside Safari (through Bun), and they matched exactly. Firefox's engine isn't tested. A guard test also fails if the engine ever uses the clock, `Math.random` or the inexact maths functions.
- **Branching works.** On each of the 20 seeds tested, exploring the worked example gave 27 paths for the cost of 40 fights, as predicted. When the test-only decision changes a stat, the paths' outcomes differ, and 13 of the 20 seeds have both wins and losses. A different first pick leaves the boss fight's dice unchanged. A decision in the middle of a fight branches too: 432 paths for 259 fights on one seed.
- **It's fast.** A stand-in fight takes 31 µs (0.03 ms), and a run takes 0.12 ms. Exploring all 27 paths takes 2.4 ms, but the very first exploration after start-up took 16 ms while the JavaScript engine warmed up. These are on the dev server. A phone will probably be a few times slower, which would still be far inside the budget. They measure the machinery only, so real combat will be slower. Step 4 reports the real numbers.
- **Logs are small.** A run's log is 30 KB, or 3.8 KB compressed. The part a player could see is 1.5 KB compressed.
- **End to end works.** 7,000 runs (70 parties × 100 seeds) finished with no errors. **The stand-in never beats the boss** (0 of 7,000): her defence of 12 leaves 2 or 3 damage a hit under "attack minus defence". That says nothing about the game, because the stand-in ignores abilities, gear, formations and perks. It does mean loot was only tested through the test-only decision, which makes the party strong enough to win.

## Sample: seed 1, the worked example's party

The stand-in isn't a design, so this is only to show what a run looks like.

> The Vanguard, Duelist and Archer clear the den mouth's two wolves in 2 rounds, the drowned path in 3 and the wight pool in 4, losing 41 HP between them. They pick Red Riposte, Wolf's Blood and Swift Feet, none of which does anything in the stand-in. Against the Grey Mother, each hit lands for 2 or 3 damage, and she hits back for 8 to 11. The Duelist falls in round 22, the Vanguard in 26 and the Archer in 28, with the Grey Mother on 72 of 260 HP. Run lost.

`npm run dungeon -- --seed 1` prints the full log, with the hidden rolls in brackets.

## For later steps

- **Steps 4 and 6: the price of "basic arithmetic only".** Formulas can't use powers, roots or logarithms. Curves like diminishing returns need ratio forms such as `x / (x + 100)`, or small lookup tables. This costs little, but it shapes how formulas are written.
- **Challenge 2, past fights in a player-facing log:** storing what a player sees costs about 1.5 KB a run compressed today. Real combat will log more, so step 4 should re-measure it.
- **Steps 3 and 4: decisions between turns multiply fast.** If manual combat actions arrive, exploring every combination stops scaling, and the explorer will need to sample. For now it has a cap.

## Method notes

- With no tuning, the design's predictions made a good acceptance checklist. Stage 3 for an engine-like step is really "build, then check the predictions", and the round budget is a time budget. I'd add that line to the method's "How steps vary" table at sign-off.
- Having a second JavaScript engine to hand (Bun runs on Safari's engine) made the "same result on every device" decision cheap to check. Step 4 should rerun `bun src/dungeon.ts --digest` against Node once real combat is in.
