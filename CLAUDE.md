# Memory Dungeon Game: design repo

## What this is

Design work for an optional game tab in Memory, the director's personal ADHD memory app. The game is a party-based JRPG dungeon crawler with automatic combat. In the full game, real-life quests pay unlocks and dungeons pay gear; that pitch (`docs/concept-spec.md`) stands. Everything here is design: a schema, a headless engine and simulations used to design the game. None of it runs in Memory yet.

**What's being built now is the core set** (`docs/core-set/`): a vertical slice of the game that the director designed as four documents, covering the rules and combat system, 16 classes, gear and formations, and enemies. Its progression is the rogue mode, a roguelite run of three acts; free play keeps everything available as a sandbox, and the campaign (a road of 20 nodes, step 5a) is retired. The quest board, reward streams and unlocks, the ADHD side, stay out of it. The full game grows out of it later, in ways not yet known. The core set replaced the design plan's steps 5 to 12, which turned out too interlocked to design one at a time.

It's also a test of a way of making games. The director sets the vision. AI designs, generates content and tunes it, using simulation in place of most playtest rounds. `docs/method.md` is that method, and every design step follows it.

- `docs/core-set/`: the vertical slice, the current target. Its `README.md` says what's in, what's out, and how it relates to everything else. **Read it before any work on the game.**
- `content/core-set/`: the core set as content, generated: `scale.ts` holds every first value by name, the other files hold the classes, gear, formations, enemies and dungeons in the documents' words, and `npm run content` writes `content/core-set.pack.json`, which the engine, tests and studies read. `content/core-set/tests.ts` is the documents' own test trios, which `npm run smoke` plays.
- `ui/`: the visual interface (Vite, plain TypeScript) on the engine, a retro JRPG screen in colour that runs on a phone: a party screen (party, formation and gear in one), unit sheets, a bestiary, and a battle screen that tells a fight in short English messages as it plays. `ui/README.md` says what it shows, how the art is mapped and how it's published. `npm run ui` serves it; GitHub Pages hosts it.
- `docs/method.md`: how every step is done. **Read it before starting or resuming a step.**
- `DECISIONS.md`: what's been decided, step by step, with the detail and reasons. The concept spec is kept in line with it (see the method); if they ever differ, `DECISIONS.md` wins and the spec gets fixed.
- `docs/concept-spec.md`: the full game, at a high level: what it is and why. Where the core set differs from it, the core set is what's built.
- `docs/design-plan.md`: the original 24-step plan. Steps 1 to 4 are done, 5 to 12 were replaced by the core set, and 13 onward describe the full game's later work. Kept as the record of where the game is headed.
- `docs/primer.md`: the game and where it stands, for a reader with no repo access. Keep it current (see the method).
- `steps/`: working folders for open work only: step 5i's design and build report (`05-core-set/5i-synergy/`), and three designs not yet folded into the core set's documents (step 4's combat design, the rogue mode's `5d-rogue/design.md` and the roster's `5h-roster/`). A closed step's history is in git, not here.
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

What's true now (Nov 3, 2026). Replace what's done rather than adding to it; history is in git.

- **The game:** the rogue mode (the interface's Settings → MODE → ROGUE; rules in `src/rogue.ts`, content in `content/core-set/rogue.ts`): three acts of a 12-floor map, a party of three and a bench that grows from two to four, gear in four slots (weapon, armor, offhand, amulet) and abilities trained one at a time. No control in fights: preparation is the game. The campaign is retired; free play stays as the sandbox.
- **Built, awaiting the director's play:**
  - **Step 5i's pieces** (Oct 30): 240 gear pieces, 32 formations and Neutral, 64 ability upgrades (a power step and two versions each), 16 mythics; engine 0.17, schema 0.8. Unbalanced on purpose. What needs the director is `steps/05-core-set/5i-synergy/build/report.md` (Cold Snap far above the other builds; the far rungs not stronger for half the builds; 195 of 461 items never move a result; the simulated player at 0%). Not done: a feel read, and writing 5i into the core set's documents (after sign-off).
  - **Aggro by doubling** (Nov 3): every 25 Aggro doubles a party member's draw (`ruleset.partyDraw`, engine 0.18), so a unit built to draw fire takes most foes' picks; nothing re-tuned.
- **Next:** the director plays it; then the balance pass, then a harder difficulty pass.
- **The tools** (each file's header says how to run it): `npm run balance` (the balance sheet; run it after any numbers change, before the knobs); `npm run rogue:calibrate` (each fight's knob against the hand-built rosters of `src/rogue-parties.ts`; `--climb`) and `npm run rogue:tune`; `npm run rogue` (whole runs with the simulated player, `src/rogue-ai.ts`); `npx tsx src/build-test.ts` (the twelve builds side by side, on the parties of `src/build-parties.ts`); `npx tsx src/piece-check.ts` (every item does what its card says); `npx tsx src/rogue-feel.ts` (fight logs for a feel read; the reader's brief is `docs/feel-reader.md`); `npx tsx src/rogue-acts.ts` (the act road); `npx tsx src/rogue-play.ts` (the AI playtester's game). The `src/campaign-*.ts` tools are the retired campaign's.
- **Context packs:** for steps that take an intent interview, `npm run pack -- N` joins the step's brief with the primer, the interviewer guide (`docs/interviewer.md`) and the step's plan entry into `steps/NN-slug/pack.md`, which the director can paste into any chat.
- **Session pattern:** a piece of work can take one session or several; its `steps/` folder is the handoff. Each session ends at a gate by updating this Status section (what's true now, not a log), committing, and stopping for the director.

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
npm run balance -- --trios 80 --seeds 2   # the balance sheet: both modes at frozen knobs, a spread of parties, every option's line against its band (out/balance/sheet.md; about 4 minutes; --sets campaign,free,rogue, --probes off, --set path=value)
npm run ui          # serve the visual interface at http://localhost:5173 (npm run ui:build writes ui/dist; pushes to main publish it to GitHub Pages)
```

When committing, follow any attribution instructions your session gives you.
