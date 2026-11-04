# Memory Dungeon Game: design repo

## What this is

Design work for an optional game tab in Memory, the director's personal ADHD memory app: a party-based JRPG dungeon crawler with automatic combat. What's built is the **core set**, a vertical slice of the game whose progression is the rogue mode. Everything here is design (a schema, a headless engine, simulations and an interface), and none of it runs in Memory yet. The director sets the vision; AI designs, generates content and tunes it, using simulation in place of most playtest rounds.

**Read `docs/primer.md` first:** how the game works, in one short read, and where to look for anything else. Read `docs/rules.md` before any design or tuning work. Open a detailed document only for the part the work needs.

- `docs/primer.md`: the game in brief, and the map of where everything is.
- `docs/rules.md`: the director's standing direction, one page. It wins over the design documents where they differ.
- `docs/core-set/`: the detailed reference. It holds the combat rules and vocabulary (`rules-and-vocabulary.md`), the classes (`classes.md`), the enemies and challenges (`enemies.md`) and the rogue mode (`rogue-mode.md`). They give words and behaviour; the numbers are in the content.
- `content/core-set/`: the core set as content. `scale.ts` holds every first value by name; the other files hold the classes, gear, formations, upgrades, enemies, dungeons and the rogue mode, with each item's card text. `npm run content` writes `content/core-set.pack.json`, which the engine, tests and studies read.
- `ui/`: the interface (Vite, plain TypeScript), a retro JRPG screen that runs on a phone. `ui/README.md` has the details; `npm run ui` serves it, and GitHub Pages hosts it.
- `steps/`: working folders for open work only. Today that's step 5i's (`05-core-set/5i-synergy/`): its design (`spine.md`, `builds.md`), the engine spec and the build's report, until the director signs it off and it's written into the core set's documents. They're large: read only the sections the work needs (the primer's map says which). A closed step's history is in git, not here.
- `PRIMITIVES.md`: the engine's building blocks (what content can express), generated from the schema.
- `docs/concept-spec.md` (the full game) and `docs/memory-app-overview.md`, `docs/memory-stack.md` and `docs/memory-design-spec.md` (Memory itself): only for quest-board or integration work.
- Memory's code lives in `Pvaiun/memoryapp`. Never change it from here. Read it only to check that the design fits its tech stack.

## How to work

- **Steps and gates.** Work comes in steps, in the order the director sets. A step that designs something runs three stages: the director's intent, then a design they approve, then build and tune. Each stage ends with the director: don't move past a gate, or start the next step, without them. Work the director has already designed starts at build.
- **Intent first.** Don't propose a design until the director's intent for the step is recorded, and never write their intent for them. Record it short: what they want, quoting them only where the wording matters.
- **A step's folder is scratch.** `steps/<slug>/` holds the open step's intent, design and report while it runs. When the step closes, fold what lasts into the design documents and `docs/rules.md`, and delete the folder. Keep no tuning trails or logs; generated output goes to `out/`, which git ignores.
- **Documents hold words, data holds numbers.** A design document says what a thing does and why, in the scale's words. Its sizes, costs, timings and stat lines live in `content/core-set/` alone, so name the constant rather than copying a value. Documents keep no history (no "until Oct 28", no "was"): git has it. When a change lands, rewrite the line.
- **The report** is what the director reads at a gate: short and plain, leading with the decisions needed (a challenge with both versions' numbers), then what was built and what changed from the design, what the numbers say and how sure, and the samples worth looking at.
- **Be a designer, not an order-taker.** Direction is guidance. Challenge direction that doesn't fit the game: in the design, before anything is built, and in tuning, as soon as the evidence shows it. Bring reasons or numbers. Never change a direction silently, and never grind around one that's the real problem.
- **Trust by sample.** The director reviews rules and samples, not the full volume. Show what you're least sure about, not just your best work.
- **Flag, don't guess.** When the core set or the concept spec is inconsistent or underspecified, say so. If a step can't wait, state the assumption plainly and continue.
- **Briefs for agents give intent and ranges, never examples:** an agent copies any example it's given. The director's own notes often hold illustrations made up on the spot: read them for the intent behind them.
- **Design before implementation.** Don't integrate anything into Memory until the design steps are done. Code here (engine, harness) serves the design, so keep it small and don't polish it.
- **Placeholders.** Everything in `fixtures/` is placeholder: the worked example is the machinery's test fixture. The core set's numbers in `content/core-set/scale.ts` are first values on the documents' relative scale, not balanced. Don't present any of these as decided beyond what `docs/rules.md` and the core set record.

## Status

What's true now (Nov 3, 2026). Replace what's done rather than adding to it; history is in git.

- **The game:** the rogue mode (`docs/core-set/rogue-mode.md`; the interface's Settings → MODE → ROGUE): three acts of a 12-floor map, a party of three and a bench that grows from two to four, gear in four slots (weapon, armor, offhand, amulet) and abilities trained one at a time. No control in fights: preparation is the game. The campaign is retired; free play stays as the sandbox.
- **Built, awaiting the director's play:**
  - **Step 5i's pieces** (Oct 30): 240 gear pieces, 32 formations and Neutral, 64 ability upgrades (a power step and two versions each), 16 mythics; engine 0.17, schema 0.8. Unbalanced on purpose. What needs the director is `steps/05-core-set/5i-synergy/build/report.md` (Cold Snap far above the other builds; the far rungs not stronger for half the builds; 195 of 461 items never move a result; the simulated player at 0%). Not done: a feel read, and writing 5i into the core set's documents (after sign-off).
  - **Aggro by doubling** (Nov 3): every 25 Aggro doubles a party member's draw (`ruleset.partyDraw`, engine 0.18), so a unit built to draw fire takes most foes' picks; nothing re-tuned.
- **Next:** the director plays it; then the balance pass, then a harder difficulty pass.
- **The tools** (each file's header says how to run it): `npm run balance` (the balance sheet; run it after any numbers change, before the knobs); `npm run rogue:calibrate` (each fight's knob against the hand-built rosters of `src/rogue-parties.ts`; `--climb`) and `npm run rogue:tune`; `npm run rogue` (whole runs with the simulated player, `src/rogue-ai.ts`); `npx tsx src/build-test.ts` (the twelve builds side by side, on the parties of `src/build-parties.ts`); `npx tsx src/piece-check.ts` (every item does what its card says); `npx tsx src/rogue-feel.ts` (fight logs for a feel read; the reader's brief is `docs/feel-reader.md`); `npx tsx src/rogue-acts.ts` (the act road); `npx tsx src/rogue-play.ts` (the AI playtester's game). The `src/campaign-*.ts` tools are the retired campaign's.
- **Session pattern:** a piece of work can take one session or several; its `steps/` folder is the handoff. Each session ends at a gate by updating this Status section (what's true now, not a log), committing, and stopping for the director.

## The director's preferences

- Short, plain-language write-ups. Lead with decisions, open questions and anything that changes the design. They won't read data files, so summarize what they need to judge.
- Direction is guidance, not law. They expect a designer to push back with evidence, and would rather hear it early than after a lot of wheel-spinning.
- Design before code. Code that serves the design stays small; avoid bug-fixing spirals.
- Mechanics map onto a few numerical systems (stats, statuses, damage types, flags, targeting). No bespoke words acting as locks, and no complexity that eats the player's brainpower, such as positional targeting.
- Content will come from human-given phrases and gimmicks, which AI interprets, filters and number-crunches through simulation. That's how content gets made; the input tooling gets built when the work needs it.

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
