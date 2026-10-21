# Memory Dungeon Game: design repo

## What this is

Design work for an optional game tab in Memory, the director's personal ADHD memory app. The game is a party-based JRPG dungeon crawler with automatic combat. Real-life quests pay unlocks, and dungeons pay gear. Everything here is design: a schema, a headless engine and simulations used to design the game. None of it runs in Memory yet.

It's also a test of a way of making games. The director sets the vision. AI designs, generates content and tunes it, using simulation in place of most playtest rounds. `docs/method.md` is that method, and every design step follows it.

- `docs/primer.md`: the game and where it stands, for a reader with no repo access. Keep it current (see the method).
- `docs/method.md`: how every step is done. **Read it before starting or resuming a step.**
- `docs/design-plan.md`: the 24 ordered design steps, each with what to ask the director and how it's tested. **Work through them one at a time.**
- `DECISIONS.md`: what's been decided, step by step, with the detail and reasons. The concept spec is kept in line with it (see the method); if they ever differ, `DECISIONS.md` wins and the spec gets fixed.
- `docs/concept-spec.md`: what the game is and why, at a high level. It's the game-wide intent, kept in line with `DECISIONS.md`.
- `steps/`: one folder per step, holding its brief, intent, design, tuning log and report.
- `docs/memory-app-overview.md`: how Memory works today.
- `docs/memory-stack.md`: how Memory is built (stack, data, AI pattern, limits) and what that means for the game.
- `docs/memory-design-spec.md`: Memory's own design spec, copied from `Pvaiun/memoryapp`. Phase 4 works from it.
- Memory's code lives in `Pvaiun/memoryapp`. Never change it from here. Read it only to check that the design fits its tech stack.

## How to work

- **Follow the method.** Each step runs intent, then design, then build and tune, and each stage ends with the director. Don't move past a stage's gate, or start the next step, without them.
- **Intent first.** Don't propose a design until the director's intent for the step is recorded, and never write their intent for them.
- **Be a designer, not an order-taker.** Direction is guidance. Challenge direction that doesn't fit the game: in the design, before anything is built, and in tuning, as soon as the evidence shows it. Bring reasons or numbers. Never change a direction silently, and never grind around one that's the real problem.
- **Trust by sample.** The director reviews rules, samples and the intent map, not the full volume. Show what you're least sure about, not just your best work.
- **Flag, don't guess.** When the concept spec is inconsistent or underspecified, say so. If a step can't wait, state the assumption plainly and continue.
- **Design before implementation.** Don't integrate anything into Memory until the design steps are done. Code here (engine, harness) serves the design, so keep it small and don't polish it.
- **Placeholders.** Everything in `fixtures/` is placeholder, as are the `design` block's numbers. Since step 4, the rule language's building blocks (`PRIMITIVES.md`) are the director's own combat design, but its numbers (floors, caps, default timings) are placeholder, and steps 5 to 12 will add to the building blocks. Don't present any of these as decided beyond what `DECISIONS.md` records.

## Status

- **Step 1, content schema:** done and approved (schema 0.3). It predates the method and was starting context, not design; its surviving ideas are in `DECISIONS.md`.
- **Method:** adopted (`docs/method.md`). Steps 2 onward follow it.
- **Tech-stack brief:** done and reviewed by the director (Oct 15, 2026). The write-up is `docs/memory-stack.md`, and its decisions are in `DECISIONS.md`. Tooling matches Memory: TypeScript 7.0, Vitest, `isolatedModules`, and a typecheck guard that keeps game logic free of Node APIs.
- **Step 2, headless engine:** done and signed off (Oct 16, 2026). The machinery is in `src/engine/` (seeded dice, runs as plain data, decision points, the explorer, the log), with the battle system behind the `Rules` interface (step 4 replaced its stand-in fight). Its record is `steps/02-headless-engine/`, and its decisions are in `DECISIONS.md`. The report's "For later steps" notes are for steps 3, 4 and 6. Step 4 reran the Chrome-against-Safari check (`bun src/dungeon.ts --digest` against `npm run dungeon -- --digest`) with real combat: identical.
- **Step 3, simulation harness:** done and signed off (Oct 16, 2026). The harness is in `src/sim/` (game-safe, in the no-Node guard), run by `npm run study`. Study files are in `studies/`, and output goes to `out/`, which git ignores. Its record is `steps/03-simulation-harness/` (sample reports in `samples/`), and its decisions are in `DECISIONS.md`. The report's "For later steps" notes are for steps 4, 5, 8 to 11, 14 to 16, 19 and 22. All of them are about the harness, except one feel-check lesson for step 22.
- **Step 4, combat concepts:** done and signed off (Oct 20, 2026), with three changes made after the director's read: Intensity statuses end below 1 stack, abilities have a default recovery, and status damage is typeless. After sign-off, the director reset scaling: every amount states its own scaling and nothing scales by default, statuses are fixed at application (only the stacks an application adds can scale), and a Refresh reapplication replaces the old one (engine 0.4). The director wrote the design themselves (`steps/04-combat-concepts/design.md`; it also covers statuses, which the plan had at step 6). Combat is `src/engine/combat/` (`combat-1`), content is schema 0.4, and the record is `report.md` and `tuning.md`. Its decisions are in `DECISIONS.md`, and they win over `design.md` where they differ. The report's "For later steps" notes are for steps 5 to 7, 11, 14, 15 and 22. After sign-off, studies were sped up (bundled, and combat studies on every core): the combat sample takes about a minute here, with identical numbers. The speed bar is in `DECISIONS.md`.
- **Specializations removed (Oct 21, 2026):** the code now matches the director's units decision. A class is a unit (schema 0.5, engine 0.5). The worked example's Archer and Duelist are now the Ranger and Duelist classes. Step 4's recorded numbers predate this, so a rerun won't match them exactly.
- **Five abilities, three brought (Oct 21, 2026):** the director changed the units decision from four abilities with two brought. The docs and the worked example follow it: each class has a placeholder fifth ability, and every party brings three per unit.
- **Next: step 5, role verbs.** Not started; begin with its brief (`docs/method.md`).
- **Context packs:** adopted Oct 16, 2026, for steps after 3's intent. A brief covers its step only. `npm run pack -- N` joins it with the primer, the interviewer guide (`docs/interviewer.md`) and the step's plan entry into `steps/NN-slug/pack.md`, which the director can paste into any chat.
- **Session pattern:** a step can take one session or several; its `steps/` folder is the handoff. Each session ends at a gate by updating this Status section, committing, and stopping for the director.

## The director's preferences

- Short, plain-language write-ups. Lead with decisions, open questions and anything that changes the design. They won't read data files, so summarize what they need to judge.
- Direction is guidance, not law. They expect a designer to push back with evidence, and would rather hear it early than after a lot of wheel-spinning.
- Design before code. Code that serves the design stays small; avoid bug-fixing spirals.
- Mechanics map onto a few numerical systems (stats, statuses, damage types, flags, targeting). No bespoke words acting as locks, and no complexity that eats the player's brainpower, such as positional targeting.
- Content will come from human-given phrases and gimmicks, which AI interprets, filters and number-crunches through simulation. That's the method applied to content; the input tooling gets built at the steps that need it (12 to 16).

## Tech

This is TypeScript 7.0, tested with Vitest, both at Memory's versions (`docs/memory-stack.md`). The schema uses zod 4, which is allowed in the game's running code too. The schema is in `src/schema.ts` and the validator in `src/validate.ts`.

Keep game logic pure TypeScript with no Node-only APIs, so it can run in the browser (where fights will run) and in a Cloudflare Worker. `tsconfig.core.json` enforces this for the files it lists, so add new game-logic folders there. The engine (`src/engine/`) also never uses the clock, `Math.random` or inexact maths (`Math.pow`, `exp`, `log`, trig), which `src/engine/guard.test.ts` enforces. Bump `ENGINE_VERSION` in `src/engine/run.ts` whenever a change can alter a run's outcome.

Before anything goes into Memory, work through the integration checklist in `docs/memory-stack.md`. Among other things, it makes sure Memory lists zod 4 as its own dependency, so a bare `import 'zod'` doesn't silently pick up the old zod 3 that comes with Wrangler.

```
npm install
npm test            # vitest run
npm run typecheck   # whole repo, plus the no-Node guard on game logic
npm run validate
npm run dungeon     # print a run of the worked example (--seed N, --explore, --bench, --digest)
npm run study -- studies/combat-sample.json   # run a study: prints a digest, writes out/<id>/ (--report, --feel, --final, --workers N)
```

When committing, follow any attribution instructions your session gives you.
