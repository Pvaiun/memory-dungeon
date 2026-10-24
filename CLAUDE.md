# Memory Dungeon Game: design repo

## What this is

Design work for an optional game tab in Memory, the director's personal ADHD memory app. The game is a party-based JRPG dungeon crawler with automatic combat. In the full game, real-life quests pay unlocks and dungeons pay gear; that pitch (`docs/concept-spec.md`) stands. Everything here is design: a schema, a headless engine and simulations used to design the game. None of it runs in Memory yet.

**What's being built now is the core set** (`docs/core-set/`): a vertical slice of the game that the director designed as four documents, covering the rules and combat system, 16 classes, gear and formations, and enemies. Its progression is still to be decided, starting with none: in the first version everything is available, so combat, formations, gear and the battle system can be built and tested freeform. The quest board, reward streams and unlocks, the ADHD side, stay out of it. The full game grows out of it later, in ways not yet known. The core set replaced the design plan's steps 5 to 12, which turned out too interlocked to design one at a time.

It's also a test of a way of making games. The director sets the vision. AI designs, generates content and tunes it, using simulation in place of most playtest rounds. `docs/method.md` is that method, and every design step follows it.

- `docs/core-set/`: the vertical slice, the current target. Its `README.md` says what's in, what's out, and how it relates to everything else. **Read it before any work on the game.**
- `content/core-set/`: the core set as content, generated: `scale.ts` holds every first value by name, the other files hold the classes, gear, formations, enemies and dungeons in the documents' words, and `npm run content` writes `content/core-set.pack.json`, which the engine, tests and studies read. `content/core-set/tests.ts` is the documents' own test trios, which `npm run smoke` plays.
- `ui/`: the visual interface (Vite, plain TypeScript) on the engine: menus for party, formation, gear and class sheets, a bestiary, and a battle screen that shows a fight as it plays. `ui/README.md` says what it shows and how the art is mapped. `npm run ui` serves it.
- `docs/method.md`: how every step is done. **Read it before starting or resuming a step.**
- `DECISIONS.md`: what's been decided, step by step, with the detail and reasons. The concept spec is kept in line with it (see the method); if they ever differ, `DECISIONS.md` wins and the spec gets fixed.
- `docs/concept-spec.md`: the full game, at a high level: what it is and why. Where the core set differs from it, the core set is what's built.
- `docs/design-plan.md`: the original 24-step plan. Steps 1 to 4 are done, 5 to 12 were replaced by the core set, and 13 onward describe the full game's later work. Kept as the record of where the game is headed.
- `docs/primer.md`: the game and where it stands, for a reader with no repo access. Keep it current (see the method).
- `steps/`: one folder per step done so far (2, 3, 4 and the core set's build, `05-core-set`), holding its brief, intent, design, tuning log and report.
- `PRIMITIVES.md`: the engine's building blocks as they stand (the core set's combat on step 4's machinery), generated from the schema.
- `docs/memory-app-overview.md`: how Memory works today.
- `docs/memory-stack.md`: how Memory is built (stack, data, AI pattern, limits) and what that means for the game.
- `docs/memory-design-spec.md`: Memory's own design spec, copied from `Pvaiun/memoryapp`. The quest board steps work from it.
- Memory's code lives in `Pvaiun/memoryapp`. Never change it from here. Read it only to check that the design fits its tech stack.

## How to work

- **Follow the method.** Each step runs intent, then design, then build and tune, and each stage ends with the director. Don't move past a stage's gate, or start the next step, without them. The core set's documents are its approved design, so its work starts at build and tune, in the order the director sets.
- **Intent first.** Don't propose a design until the director's intent for the step is recorded, and never write their intent for them.
- **Be a designer, not an order-taker.** Direction is guidance. Challenge direction that doesn't fit the game: in the design, before anything is built, and in tuning, as soon as the evidence shows it. Bring reasons or numbers. Never change a direction silently, and never grind around one that's the real problem.
- **Trust by sample.** The director reviews rules, samples and the intent map, not the full volume. Show what you're least sure about, not just your best work.
- **Flag, don't guess.** When the core set or the concept spec is inconsistent or underspecified, say so. If a step can't wait, state the assumption plainly and continue.
- **Design before implementation.** Don't integrate anything into Memory until the design steps are done. Code here (engine, harness) serves the design, so keep it small and don't polish it.
- **Placeholders.** Everything in `fixtures/` is placeholder: the worked example is the machinery's test fixture. The core set's numbers in `content/core-set/scale.ts` are first values on the documents' relative scale, put in the ballpark by a short tuning pass, not balanced. Don't present any of these as decided beyond what `DECISIONS.md` and the core set record.

## Status

- **Steps 1 to 3, the foundation:** done and signed off. Step 1 (content schema) predates the method and was starting context, not design. Step 2 (Oct 16, 2026) is the headless engine in `src/engine/`: seeded dice, runs as plain data, decision points, the explorer and the log, with the battle system behind the `Rules` interface. Step 3 (Oct 16, 2026) is the simulation harness in `src/sim/`, run by `npm run study`, with studies in `studies/` and output in `out/`, which git ignores. The tech-stack brief (Oct 15, 2026) is `docs/memory-stack.md`, and tooling matches Memory. Their records are in `steps/` and their decisions in `DECISIONS.md`. They're the machinery the core set runs on, and their reports' "For later steps" notes now apply to the core set's build.
- **Step 4, combat concepts:** done and signed off (Oct 20, 2026). The director's combat design (`steps/04-combat-concepts/design.md`) is built as `combat-1` in `src/engine/combat/`, content is schema 0.5 (a class is a unit, with five abilities of which three are brought, in the worked example), and `PRIMITIVES.md` lists the building blocks. Its decisions are in `DECISIONS.md`, and they win over `design.md` where they differ. Writing it showed that steps 4 to 12 couldn't be designed one at a time, which led to the core set.
- **The core set (Oct 23, 2026):** the director designed the slice as four documents in `docs/core-set/`. All four are in: rules and vocabulary, classes, gear and formation lists, and enemies, encounters and dungeons. The rules the enemies document added are folded into the rules document, which also lists the known gaps. The core set is the development target: it replaces steps 5 to 12, and its rules supersede step 4's design where they differ. Its record is in `DECISIONS.md`.
- **The core set's first implementation: built, awaiting the director's read (Oct 23, 2026).** Schema 0.6 and engine 0.6 run the core set's rules (`src/engine/combat/`, with the new rules' tests in `coreset.test.ts`); every class, piece of gear, formation, enemy, encounter and dungeon is content, generated from `content/core-set/` with first values for every number; `npm run smoke` plays the documents' own test trios in about two seconds, and a short tuning pass put the numbers in the ballpark. The record is `steps/05-core-set/`: `report.md` (decisions needed, what was built and changed, the numbers, feel, the known gaps' answers) and `tuning.md` (the trail). **Next: the director reads the report.** The balance pass by simulation, in a form that samples rather than sweeps (the report proposes one), comes after it. The full game's later steps come after the slice.
- **The visual interface, first version (Oct 24, 2026):** `ui/` lets the director set up a party, formation and gear, read every class and enemy, and watch any run or single fight on a classic JRPG battle screen: health, Shield and wind-up bars, statuses with stacks and timers, cooldowns, damage numbers by element with crit, miss, block, resist, weak, Aegis and soak words, VFX, a log and an inspect panel, at 100 per point of the documents' scale. The engine is unchanged except for `advanceOnce`, one iteration of the run loop. The art is the director's sprite packs, processed by `ui/tools/assets.py`; seven enemies are renamed on screen only (`ui/README.md`). It's a design tool: nothing runs in Memory. **Next for it:** the director's reactions, then whatever the balance pass needs from it (a fight summary, a replay from a study's seed).
- **Context packs:** for steps that take an intent interview, `npm run pack -- N` joins the step's brief with the primer, the interviewer guide (`docs/interviewer.md`) and the step's plan entry into `steps/NN-slug/pack.md`, which the director can paste into any chat.
- **Session pattern:** a piece of work can take one session or several; its `steps/` folder is the handoff. Each session ends at a gate by updating this Status section, committing, and stopping for the director.

## The director's preferences

- Short, plain-language write-ups. Lead with decisions, open questions and anything that changes the design. They won't read data files, so summarize what they need to judge.
- Direction is guidance, not law. They expect a designer to push back with evidence, and would rather hear it early than after a lot of wheel-spinning.
- Design before code. Code that serves the design stays small; avoid bug-fixing spirals.
- Mechanics map onto a few numerical systems (stats, statuses, damage types, flags, targeting). No bespoke words acting as locks, and no complexity that eats the player's brainpower, such as positional targeting.
- Content will come from human-given phrases and gimmicks, which AI interprets, filters and number-crunches through simulation. That's the method applied to content; the input tooling gets built when the work needs it.

## Tech

This is TypeScript 7.0, tested with Vitest, both at Memory's versions (`docs/memory-stack.md`). The schema uses zod 4, which is allowed in the game's running code too. The schema is in `src/schema.ts` and the validator in `src/validate.ts`.

Keep game logic pure TypeScript with no Node-only APIs, so it can run in the browser (where fights will run) and in a Cloudflare Worker. `tsconfig.core.json` enforces this for the files it lists, so add new game-logic folders there. The engine (`src/engine/`) also never uses the clock, `Math.random` or inexact maths (`Math.pow`, `exp`, `log`, trig), which `src/engine/guard.test.ts` enforces. Bump `ENGINE_VERSION` in `src/engine/run.ts` whenever a change can alter a run's outcome.

Before anything goes into Memory, work through the integration checklist in `docs/memory-stack.md`. Among other things, it makes sure Memory lists zod 4 as its own dependency, so a bare `import 'zod'` doesn't silently pick up the old zod 3 that comes with Wrangler.

```
npm install
npm test            # vitest run
npm run typecheck   # whole repo, plus the no-Node guard on game logic
npm run validate
npm run content     # regenerate content/core-set.pack.json from content/core-set/
npm run smoke       # play the core set documents' own test trios (--seeds N, --only <stage>, --log <stage>, --kit best)
npm run dungeon -- --pack content/core-set.pack.json --party content/parties/starters.json --dungeon old_road   # print one run (--seed N, --player)
npm run study -- studies/core-set-starters.json   # run a study: prints a digest, writes out/<id>/ (--report, --feel, --final, --workers N)
npm run ui          # serve the visual interface at http://localhost:5173 (npm run ui:build writes ui/dist)
```

When committing, follow any attribution instructions your session gives you.
