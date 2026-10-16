# Decisions

What has been decided, step by step. Where this differs from the concept spec, this wins; the director will update the spec. Each step's report has the full reasoning.

Decisions are direction like any other (see `docs/method.md`): a designer can challenge one with evidence, and until it's changed here, it stands.

## Process

- **Method (Oct 15, 2026):** every design step runs intent, then design, then build and tune, as `docs/method.md` sets out. Direction is guidance: the AI challenges what doesn't fit, with evidence, and never changes it silently.

## Tech-stack brief

Reviewed with the director Oct 15, 2026. Full record: `docs/memory-stack.md`.

- **Build it like a game.** The game is part of Memory to the user, but its tech is free to work like a game. It meets Memory only at fixed points: the same web app and build, a tab, the same TypeScript, reading and creating items through Memory's code, the quest board on Memory's timer, and data synced through Memory's server.
- **Fights run in the browser.** Fights are seeded, so no combat log is stored. The server keeps the game's save and a short summary of each run: its seed, outcome and loot.
- **zod is allowed** in the game's running code.
- **Tooling:** TypeScript 7.0 and Vitest, matching Memory.
- **Game data:** in its own D1 database, as save documents rather than many tables. A debug "reset game" button replaces test data. The live app is the test environment, so there's no staging and no manual backups. Game events stay out of Memory's permanent log during development.
- **Quest board and Memory (for steps 18 to 20):**
  - Quest kinds are the board's own, unrelated to Memory's item types. A Want asks the user to create any kind of item.
  - Memory only reports whether an item is done, from its current state.
  - Rewards are claimed by hand on the board. An item unticked before its claim shows as incomplete again, and nothing rolls back after a claim. The user is trusted.
  - An event counts as done once its time passes, unless the user marks it missed.

## Step 1: content schema

Schema 0.3, approved Oct 15, 2026, before the method existed. Full record: `SCHEMA.md`.

- **Units:** each unit is a class plus a specialization (e.g. Ranger: Duelist). There's no plain class unit, and each specialization is one unit the player owns once.
- **No battlefield geometry:** no rows and no reach.
- **Formations:** Romancing SaGa-style, with 5 bespoke slots each carrying its own effects (aggro, speed, damage multipliers, auto-defend…). Front, middle and back are only where a slot is drawn. A formation can also have party-wide effects.
- **Enemies:** a plain list, with no formation.
- **Targeting:** keep it simple. Units mostly attack by aggro, and a few go for the most wounded. Active abilities fire automatically off cooldown, each with its own targeting.
- **Keys and keyholes:** encounter-design terms only. Quest rewards are "unlocks". Keyholes are predictions, never win rules, and are mostly enemy gimmicks, each countered by several keys. They're tuned by mass simulation.
- **Statuses:** a status lands either on self or on others. Self-built stacks (like Lethality) are preferred. Enemy-facing statuses like bleed stay niche through roster design; some cross-pollination is expected.
- **Verbs:** design vocabulary over the numerical systems. The engine never reads them, and they never gate gameplay.
