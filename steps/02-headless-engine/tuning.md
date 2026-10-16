# Step 2 build log

The trail for later sessions. The director doesn't read this; `report.md` is theirs.

Step 2 has no tuning: the stand-in's numbers don't matter. So this is a build log, and the budget was time: one session, then stop and report. The build fit in one session.

## What was built, in order

1. **Dice** (`src/engine/rng.ts`). sfc32, seeded per slice by hashing `seed:label` (FNV-1a plus an avalanche). Whole-number operations only. The state is 4 numbers, so it saves as JSON. Slices: `fight:<stage id>`, `stage:<stage id>` (perk offers), `loot`, and `picker` for the random picker's own dice.
2. **The run** (`src/engine/run.ts`). `newRun` → `advance` (plays until a decision or the end) → `answer` → `advance`… A run is plain data: `saveRun` is `JSON.stringify`, and a branch is `structuredClone`. `play` drives a run with a picker, and `replay` drives it from its record.
3. **The seam for step 4.** The battle system is a `Rules` object: party setup, start a fight, an optional `beforeTurn` that can return a decision, take a turn, end a fight, handle a non-fight stage, apply an answer, and roll loot. The run loop never looks inside a fight. Step 4 writes a new `Rules` and deletes `standin.ts`.
4. **Decisions.** `{ kind, at, options }`. They come from `rules.stage` (between stages) or `rules.beforeTurn` (between turns). A new kind of decision is a new `kind` that the rules ask and `apply` handles; the engine doesn't change. A decision with no options is skipped.
5. **The stand-in** (`src/engine/standin.ts`), as the design says, plus: offers skip perks already picked (the pack's `repeatPicked: false`), premium rarity is ignored, and a 500-round safety stop counts as a loss (it never fires with this content).
6. **The log** (`src/engine/log.ts`). Flat entries `{ t, vis, ... }`, where `vis` is `player` or `hidden`. Hidden: `run` (the record's header), `dice` (each slice's starting state) and `roll`. `playerView` filters, and `printLog` prints. Rules log through `x.log?.(...)`, which skips building the entry when logging is off.
7. **The explorer** (`src/engine/explore.ts`). Depth-first: advance to a decision, then copy the run once per option. It counts fights started, and stops at `maxPaths` (default 10,000) with `truncated: true`.
8. **The script** (`src/dungeon.ts`, `npm run dungeon`): print a run, `--explore`, `--bench`, and `--digest` (one fingerprint of 10,000 runs' logs, to compare across JavaScript engines).
9. **Tests** next to the engine: `rng`, `run`, `explore` and `guard`, with `testkit.ts` (the worked example, all 70 small parties, and test-only rules whose picks add attack, with an optional mid-fight "stance" decision).

## Choices made along the way

- **The record carries `rules` and `firstClear`.** `rules` says which battle system made the run, next to the engine version. `firstClear` is needed to replay the loot roll, because first clears and replays roll on different tables.
- **The content is checked when it loads** (`loadContent` runs the validator, 15 ms once), and the party when a run starts (`checkParty`). Neither happens inside fights.
- **The content fingerprint** is a hash of the validated pack's JSON. Editing a note changes it too, which is safe: a record just stops replaying.
- **Pinned values.** `rng.test.ts` pins the dice and `run.test.ts` pins one run's log hash. If either changes, old records replay differently, so bump `ENGINE_VERSION`.
- **Determinism guard.** It works two ways: a scan of the engine's source for `Math.*` outside a safe list, `Date`, `performance`, `**` and similar; and a runtime trap that makes `Math.random`, `pow`, `exp`, `log`, the trig functions, `Date` and `performance.now` throw while runs and explorations play.

## Checks run (Oct 16)

| Check | Result |
| --- | --- |
| Replay: 10,000 runs (all 70 parties, random picks) against their records | Identical logs, all 10,000 |
| Resume: save and load as JSON at every decision, including mid-fight, 3 rule sets × 300 seeds | Identical logs, all 900 |
| Explorer, worked example, seeds 1 to 20 | 27 paths and 40 fights on every seed |
| Explorer with the stat-changing test decision | Paths differ on every seed; 13 of 20 seeds have both wins and losses |
| Explorer with a mid-fight decision too (2 stances per fight) | 432 paths for 259 fights, seed 1 |
| Boss fight's dice after a different first pick | Same starting dice, different fight |
| End to end: 70 parties × 100 seeds | 7,000 runs, no errors. The stand-in never beats the boss (0 of 7,000) |
| V8 (Node) against JavaScriptCore (Bun 1.4.2, Safari's engine), `--digest` | Same fingerprint over 10,000 runs: `b15b9f21d8abb34f` |
| Speed (`npm run dungeon -- --bench`, Node 22 on the dev container) | 31 µs per fight with logs off, 47 µs with them on; 124 µs per run; 2.4 ms per exploration (16 ms for the first one, cold) |
| Size | Log: 30 KB per run as JSON (332 entries), 3.8 KB gzipped, of which the player-visible part is 1.5 KB. Record: 0.8 KB |

## Known gaps, for step 4

- **Firefox's engine (SpiderMonkey)** isn't tested. Only V8 and JavaScriptCore are.
- **Challenge loot** isn't rolled. It's open for steps 10 and 11 (see the design's "For later steps").
- **Between-turn decisions multiply fast** in the explorer: every fight with a decision per turn branches every turn. The cap stops it; sampling would be needed if step 4 adds manual actions.
- **The fight state shape** (`Unit`, `Fight` in `run.ts`) is the stand-in's. Step 4 will reshape it, and the run loop only reads `stage`, `boss`, `units`, `round`, `result` and `decided`.
