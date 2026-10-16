# Decisions

What has been decided, step by step. Where this differs from the concept spec, this wins; the director will update the spec. Each step's report has the full reasoning.

Decisions are direction like any other (see `docs/method.md`): a designer can challenge one with evidence, and until it's changed here, it stands.

## Process

- **Method (Oct 15, 2026):** every design step runs intent, then design, then build and tune, as `docs/method.md` sets out. Direction is guidance: the AI challenges what doesn't fit, with evidence, and never changes it silently.

## Tech-stack brief

Reviewed with the director Oct 15, 2026. Full record: `docs/memory-stack.md`.

- **Build it like a game.** The game is part of Memory to the user, but its tech is free to work like a game. It meets Memory only at fixed points: the same web app and build, a tab, the same TypeScript, reading and creating items through Memory's code, the quest board on Memory's timer, and data synced through Memory's server.
- **Fights run in the browser.** Fights are seeded, so no combat log is stored. The server keeps the game's save and a short summary of each run. Step 2 widened the summary from seed, outcome and loot to a full replay record (see below).
- **zod is allowed** in the game's running code.
- **Tooling:** TypeScript 7.0 and Vitest, matching Memory.
- **Game data:** in its own D1 database, as save documents rather than many tables. A debug "reset game" button replaces test data. The live app is the test environment, so there's no staging and no manual backups. Game events stay out of Memory's permanent log during development.
- **Quest board and Memory (for steps 18 to 20):**
  - Quest kinds are the board's own, unrelated to Memory's item types. A Want asks the user to create any kind of item.
  - Memory only reports whether an item is done, from its current state.
  - Rewards are claimed by hand on the board. An item unticked before its claim shows as incomplete again, and nothing rolls back after a claim. The user is trusted.
  - An event counts as done once its time passes, unless the user marks it missed.

## Step 1: content schema

Schema 0.3, approved Oct 15, 2026, before the method existed. Since this is built before the method existed it's placeholder and considered inspiration at best. Full record: `SCHEMA.md`.

- **Units:** each unit is a class plus a specialization (e.g. Ranger: Duelist). There's no plain class unit, and each specialization is one unit the player owns once.
- **No battlefield geometry:** no rows and no reach.
- **Formations:** Romancing SaGa-style, with 5 bespoke slots each carrying its own effects (aggro, speed, damage multipliers, auto-defend…). Front, middle and back are only where a slot is drawn.
- **Enemies:** a plain list, with no formation.
- **Targeting:** keep it simple. Units mostly attack by aggro, and a few go for the most wounded. Active abilities fire automatically off cooldown, each with its own targeting.
- **Keys and keyholes:** encounter-design terms only. Quest rewards are "unlocks". Keyholes are predictions, never win rules, and are mostly enemy gimmicks, each countered by several keys. They're tuned by mass simulation.
- **Verbs:** design vocabulary over the numerical systems. The engine never reads them, and they never gate gameplay.

## Step 2: headless engine

Signed off by the director, Oct 16, 2026. Full record: `steps/02-headless-engine/` (`design.md` and `report.md`).

- **Machinery only.** Step 2 built what any battle system needs: seeded dice, runs as plain data, decision points, the explorer and the log. A crude stand-in fight tests it. Step 4 builds the real combat into it and deletes the stand-in. Neither step 2 nor the stand-in builds the schema's rule language; steps 4 and 6 may keep it, change it, drop parts of it or start over.
- **The battle system is one swappable piece** (the `Rules` interface in `src/engine/run.ts`). Replacing it doesn't touch the run machinery.
- **Dice:** one seed per run. Each fight, perk offer and loot roll gets its own slice, so an earlier decision never changes a later slice's dice.
- **The same result on every device:** the engine never uses the clock, `Math.random`, or inexact maths (powers, roots, logarithms, trig). Formulas use basic arithmetic, so curves are written as ratios or small tables. A guard test enforces this. Chrome's and Safari's JavaScript engines gave identical results over 10,000 runs.
- **Decisions are general.** A run pauses for a decision between stages or between turns, and adding a new kind of decision doesn't change the engine. Perk picks are the only kind the worked example asks for.
- **Logs** are data for code to count. Each entry is marked player-visible or hidden, so a player's log is a filter. Logs are off for bulk runs, and nothing is stored.
- **Run summary** (agreed Oct 16, replacing seed, outcome and loot): the server keeps each run's replay record, plus its outcome and loot. The record holds the engine and battle-system versions, the content's id and fingerprint, the party, dungeon, seed, whether it was a first clear, and every decision. It's about 0.8 KB. A record only replays on the same versions, so the engine version is bumped whenever a change can alter a run's outcome. Step 20 settles the save format.
