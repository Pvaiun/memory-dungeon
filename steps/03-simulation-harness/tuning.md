# Step 3 build log

The trail for later sessions. The director doesn't read this; `report.md` is theirs.

Step 3 is machinery, like step 2: the design's predictions are the acceptance checklist, and the budget was time, one session. The build fit in one session, at about twice the estimated size.

## What was built, in order

1. **How sure** (`src/sim/sure.ts`): Wilson ranges for rates, block-mean ranges for averages, and `compare()`. That pairs two measures taken on the same seeds, splits them into 20 blocks by index (mod 20), and calls a difference clear at 16 of 20 blocks agreeing (a two-sided sign test, about 1 in 80 by luck). Fewer is "no clear difference", and all-zero differences are "identical".
2. **Content** (`content.ts`): `patch()` for variants (paths walk keys, and list items by id, e.g. `classes/ranger/stats/max_hp`, with `set`, `mul` or `add`). `ladder()`, the placeholder. `build()` adds single fights as one-stage dungeons ("dungeon~stage"), straight into the loaded content's map, because the validator rightly rejects a dungeon without perk picks and a boss.
3. **Parties** (`parties.ts`): what a player owns, building parties (positions in order, the first two abilities, the best-ranked owned gear), listing them, small tweaks (swap, add or drop a unit; change the formation, gear, abilities or order), and `Colour`, the swappable piece. For now that's `classColour`, the set of classes.
4. **Measuring** (`measure.ts`): a probe wraps any `Rules` and records each fight's HP shares (start, end, low, how far behind, enemy HP left), keyed by run. It reads only `side`, `hp` and `stats.max_hp`, which the run loop also reads. `paths()` is step 2's explorer with each path measured.
5. **Studies** (`study.ts`): zod schemas. Combat: targets, parties, seeds, how perks are picked, perk seeds, effect seeds. Progression: players, weeks, board, the optimizer, casual player and benchmark settings, and the clear bar. Both have variants, a "can win" bar, expected ranges and a held-out flag.
6. **Combat level** (`combat.ts`): every party against every target on the same seeds. Per party: wins, progress, the 10th to 90th percentile, tries to a first win, where losses happen and the enemy HP left, and median rounds per fight. Per target: strictness, the four perk numbers on the best 3 parties, class and size effects, and the pair-synergy check. Per study: tweak effects, and each variant against the baseline.
7. **Progression level** (`progression.ts`): the board, the optimizer (a hill climb on how far it got, which retries close calls, weights unit swaps above formations, gear and abilities, and learns perk values), the casual player, and the benchmark. The benchmark judges each party on 10 fixed seeds, starts with the biggest party of each colour, then tries the other parties in the best 2 colours and tweaks of their best, and stops at 9 in 10. It runs as a shadow with the optimizer's unlocks. It also covers wall sorting, what broke each wall, when choices start to matter, and perks at walls.
8. **Feel** (`feel.ts`): picking runs by rule, reading packs, the sheet, and scoring colour guesses.
9. **Reports** (`report.ts`): the digest, headline numbers for "since last run", flags against expected ranges, and the drafts in the fixed shape, with charts drawn in text.
10. **The script** (`src/study.ts`, `npm run study`), and two sample studies in `studies/`.
11. **Tests**: `sim.test.ts` and `progression.test.ts`, 9 tests against the predictions.

## Choices made along the way

- **The ladder's rungs are 30% to 80%, not up to full strength.** I scanned the stand-in at 30% to 100%. At 90% the best party wins 1 run in 100, and at 100% none of the 14 parties wins any of 1,400 runs. At 80%, only Vanguard, Archer and Duelist win (83%). Max HP, attack and magic are scaled; defence isn't, because the validator checks that "thick-hided" enemies show armour.
- **Clear bar 1 in 10, strictness bar half.** A player who retries can clear a dungeon its best party wins 1 time in 10, so progression counts that as winnable. Strictness keeps the design's "half its tries". Both are placeholders until step 14.
- **"Choices matter"** fires when the player owns more units than fit, and on a dungeon it played that week, its best and worst full parties differ by half their tries won, or a whole fight of progress. First version: checked only the next dungeon at the week's start, so it never fired, because the optimizer cleared that dungeon the same week.
- **What broke a wall** looks at the party that actually won. It's "play" if the player already owned a winner, or won with nothing new. Otherwise it's the new loot or unlocks that party used, if they made the wall winnable, or "both". First version: a purely counterfactual check, which credited the Duelist when a casual player broke through with its old party by luck.
- **The benchmark's budget counts every party it judges, cached or not,** so its answer never depends on what it already knows. Evaluations are cached by party and dungeon, and answers by what's owned and the target.
- **All of a cleared dungeon's challenges are open at once.** The concept spec's one-at-a-time sequence is for steps 10 and 11.
- **Challenge loot is rolled by the harness,** since the stand-in doesn't roll it. A challenge win pays the challenge's table, not the run's replay table.
- **Reading packs hide enemy HP** and show the party's HP, damage numbers, trait words and perk text. The sheet's example colour line was `Colour: Warrior, Ranger`, which is the last dungeon's winning colour, so it was neutralised before the reader ran.
- **"Biggest comeback"** first measured "behind" against full HP, so damage carried in from earlier fights counted as falling behind. The reader caught it: its "comeback" was a close win. Now both sides are measured against where the fight started.
- **Ranges use `Math.sqrt`.** That's reporting, never a game outcome, so the engine's exact-maths rule doesn't apply. `src/sim` is in the no-Node typecheck guard, but not in the engine's determinism guard.
- **Perk paths and tweak checks run on the baseline version only,** to keep the combat sample under a minute (59 s before, 35 s after).
- **Progression versions** were added late: the design asks for versions side by side, and the first build only ran the baseline.

## Checks run (Oct 16)

| Check | Result |
| --- | --- |
| Same study twice | Identical results (combat test, and progression summaries) |
| Tweaks in the stand-in, 6 dungeons × 14 parties × 100 seeds | Formation, gear, abilities: identical on every seed. Unit order: no clear difference (11 of 20 blocks) |
| Four perk numbers, 18 party-dungeons × 20 test seeds | Equal on every one |
| Class and size effects, every dungeon | 20 of 20 blocks. Dungeon 6: warrior +1.86 fights, ranger +0.20, cleric −2.20; 2 units over 1 +1.41, 3 over 2 +0.54 |
| Shared seeds, different parties: 258 pairs on dungeons 4 to 6, 400 seeds | Runs saved ×1.00 (median; ×0.88 to ×1.19 for the middle 80%). No saving |
| Shared seeds, the same party with Ranger +2 attack: 26 cases | ×4.4 median (×1.0 to ×8.7). With +1 attack, Vanguard, Archer and Mender on dungeon 6: ×10 |
| Benchmark budget, progression sample | 100: behind the optimizer in 4 player-weeks, and 5 casual weeks sorted differently. 300: 0 and 0. 3,000: never runs out (the search tops out at 510), same answers as 300 |
| Optimizer vs casual, dungeon-weeks | Higher in 20 of 20 blocks |
| Walls | Every stuck week sorted. No wall ended by loot. Sorted then ended: owns a winner → play 18 (casual) and 2 (optimizer); challenges left → unlock 17; quests → unlock 1; still walled 10 |
| Reader, 7 packs | Honest (called it flat; named no hidden stats). Colour guess right in 2 of 3 losses |
| Digest size | Combat 19 lines, progression 28 (longest line 186 characters) |
| Speed (Node 22, dev container) | Combat sample: 205,800 runs in 35 s. Progression sample: 60,540 runs in 44 s (about 0.7 ms per run, most of it party search and checks, not fights) |
| Whole suite | 130 tests (9 new) pass in 27 s; both typechecks clean |

## After the director's first read (Oct 16)

The director was happy with the build, and raised four points. Changes:

- **The casual player's rule measured itself.** It kept its first full party forever, so most of its stuck weeks (153 of 184 "owns a winner") were the rule, not the game. Now it puts each new unit straight in (in place of a random unit if the party is full), and after two losses in a row swaps one unit, preferring one it hasn't taken into that dungeon yet. Result: stuck 81 of 600 weeks (was 184), walls 2.0 weeks (1.5 to 2.4, was 4.1), longest 7 (was 10), and nobody stuck at week 12 (was 10). The optimizer still beats it in 20 of 20 blocks, and no wall ends by loot.
- **"Ladder", "rung" and "80% strength" read as jargon.** The samples and report now say "six copies of the dungeon with weakened monsters: 30% of their normal HP and attack in the first, up to 80% in the sixth".
- **The "For later steps" list carried placeholder design forward** (descriptions shown in fights, a count of unlocks for content). It's now limited to notes on the simulation system, plus one feel-check lesson for step 22 that holds for any combat that shows exact damage and hides HP. Added: the benchmark picks perks at random, so step 11 should give it the learned list once perks matter.
- **Perks** were explained in the report: how each study picks them, the four numbers, and how the optimizer learns them.
- **New in the digest:** the week each kind of player's board runs dry, so empty weeks aren't read as a finding. **New in the week log:** the party that cleared each dungeon, for the diary.

## Known gaps

- **Class "in different situations"** is per dungeon only, not per fight within a dungeon.
- **The digest doesn't print a ready-made tuning-log line.** The AI writes the line.
- **Feel packs come from combat studies only,** not from a progression player's runs.
- **The optimizer never gives up** on a challenge nobody can win. A real player would.
- **No held-out studies yet.** Step 3 tunes nothing, but the flag and `--final` work.
- **The board deals unowned unlocks uniformly.** The concept's favouring of teased specializations is step 19's.
