# Dungeon Game: design repo

## What this is

Design work for a party-based JRPG dungeon crawler with automatic combat, where preparation is the game. Its content is the **core set**, and the rogue mode is the game. Everything here serves the design: a schema, a headless engine, simulations and a phone-sized interface. The director sets the vision; AI designs, generates content and tunes it, using simulation in place of most playtest rounds.

- `docs/`: the design, in words. `docs/primer.md` is the game in brief and the map of every other document.
- `content/core-set/`: the core set as content, and every number (`scale.ts` holds the first values by name). `npm run content` writes `content/core-set.pack.json`, which the engine, tests and studies read.
- `src/`: the game, pure TypeScript that also runs in the browser. `tools/`: the Node command lines that measure it. `docs/code-map.md` says where each file is.
- `ui/`: the interface (Vite, plain TypeScript), a retro JRPG screen that runs on a phone. `ui/README.md` has the details.
- `steps/`: working folders for open work only, one per step.
- `PRIMITIVES.md`: the engine's building blocks, generated from the schema.

## What to read

An agent that reads everything does worse work, not safer work: what it needs gets lost among what it doesn't. Read little, on purpose.

- **Always: `docs/primer.md`.** How the game works, in one short read, and where to look for anything else.
- **Then the step's `brief.md`** (`steps/<slug>/`) and what its reading list names. Nothing else is required reading.
- **Everything else is reference.** The detailed documents are long. List a document's headings (`grep -n '^##' <file>`), and read the one section a specific question needs. Don't read a document whole because the work is about its subject, or to be safe.
- **The director's rulings** are the first section of each subject's document: combat, vocabulary, gear, classes, the rogue mode, builds, loot, balance. They win over the rest of their page. Before designing or tuning in a subject, read that subject's rulings, and only that subject's.
- **Code:** find a file's line in `docs/code-map.md` by searching it, before opening code or listing folders.
- **A check against a reference goes to a subagent.** "Does this break a rule?" and "does something already do this job?" are questions for an agent that reads the reference and returns a verdict with the line it rests on. The lead holds the director's words and the step's state, not the reference.
- **A brief carries a closed reading list.** Opening a step means writing one: the sections every session of the step needs, what to open only when a named case comes up, and what to leave alone. What the step needs from a long document goes into the brief in a few lines, so later sessions don't each read the document.

## How to work

- **Steps and gates.** Work comes in steps, in the order the director sets. A step that designs something runs three stages: the director's intent, then a design they approve, then build and tune. Each stage ends with the director: don't move past a gate, or start the next step, without them. Work the director has already designed starts at build.
- **Intent first.** Don't propose a design until the director's intent for the step is recorded, and never write their intent for them. Record it short: what they want, quoting them only where the wording matters.
- **A step's folder is scratch.** `steps/<slug>/` holds the open step's brief, intent, design and report while it runs. When the step closes, fold what lasts into the design documents (a ruling into its page's rulings), and delete the folder. Keep no tuning trails or logs; generated output goes to `out/`, which git ignores.
- **Documents hold words, data holds numbers.** A design document says what a thing does and why, in the scale's words. Its sizes, costs, timings and stat lines live in `content/core-set/` alone, so name the constant rather than copying a value. Documents keep no history (no "until Oct 28", no "was", no "fixed", no "closed"): git has it. When a change lands, rewrite the line.
- **The report** is what the director reads at a gate: short and plain, leading with the decisions needed (a challenge with both versions' numbers), then what was built and what changed from the design, what the numbers say and how sure, and the samples worth looking at.
- **Keep the code map true.** Adding, moving, renaming, splitting or deleting a source file, or changing what one is for, means changing its line in `docs/code-map.md` in the same commit. `tests/code-map.test.ts` fails on a missing or stale file; a line that no longer says what its file does is on you. Keep a file to one concern: when one grows past about 600 lines, split it along its sections into a file and a folder of the same name (`fight.ts` and `fight/`: the file re-exports the parts and lists them).
- **Keep documents to one subject,** in sections a reader can take one at a time. When a document comes to hold two subjects, split it and fix the primer's map.
- **Be a designer, not an order-taker.** Direction is guidance. Challenge direction that doesn't fit the game: in the design, before anything is built, and in tuning, as soon as the evidence shows it. Bring reasons or numbers. Never change a direction silently, and never grind around one that's the real problem.
- **Trust by sample.** The director reviews rules and samples, not the full volume. Show what you're least sure about, not just your best work.
- **Flag, don't guess.** When the core set is inconsistent or underspecified, say so. If a step can't wait, state the assumption plainly and continue.
- **Briefs for agents give intent and ranges, never examples:** an agent copies any example it's given. The director's own notes often hold illustrations made up on the spot: read them for the intent behind them.
- **Code serves the design.** The engine, the harness and the interface stay small; don't polish them.
- **Placeholders.** Everything in `fixtures/` is placeholder: the worked example is the machinery's test fixture. The core set's numbers in `content/core-set/scale.ts` are first values on the documents' relative scale, not balanced. Don't present any of these as decided beyond what the rulings and the core set record.
- **Sessions are short.** A piece of work can take one session or several; its `steps/` folder is the handoff. A session ends at a gate: bring the step's `report.md` up to date, change `docs/open.md` if what's open changed and Now (below) if the current step did, commit, and stop for the director. A fresh session on a short brief does better than a long one carrying all it has read.

## Now

Three lines, replaced when they change. What's done isn't listed anywhere: it's in the documents, the code and git.

- **The game is built and approved as it stands:** the rogue mode (the interface's Settings → MODE → ROGUE), engine 0.29, schema 0.14. It's tuned by simulation for a first playtest, and nothing is final. Free play stays as the sandbox.
- **The current step is authored gaps** (`steps/authored-gaps/brief.md`): a new way to make loot. It lives on its own branch until merged; the brief says which.
- **Everything else that's open** (built and waiting on the director's read or playtest, and the open questions) is one line each in `docs/open.md`. Open it only when the work touches one.

## The director's preferences

- Short, plain-language write-ups. Lead with decisions, open questions and anything that changes the design. They won't read data files, so summarize what they need to judge.
- Direction is guidance, not law. They expect a designer to push back with evidence, and would rather hear it early than after a lot of wheel-spinning.
- Design before code. Code that serves the design stays small; avoid bug-fixing spirals.
- Mechanics map onto a few numerical systems (stats, statuses, damage types, flags, targeting). No bespoke words acting as locks, and no complexity that eats the player's brainpower, such as positional targeting.
- Content will come from human-given phrases and gimmicks, which AI interprets, filters and number-crunches through simulation. That's how content gets made; the input tooling gets built when the work needs it.

## Tech

This is TypeScript 7.0, tested with Vitest. The schema uses zod 4, which is allowed in the game's running code too. The schema is in `src/schema/` and the validator in `src/validate/`.

Keep game logic pure TypeScript with no Node-only APIs, so it runs in the browser, where fights run. `tsconfig.core.json` enforces this for everything in `src/`; Node code goes in `tools/`. The engine (`src/engine/`) also never uses the clock, `Math.random` or inexact maths (`Math.pow`, `exp`, `log`, trig), so the same seed plays the same fight everywhere; `src/engine/guard.test.ts` enforces it. Bump `ENGINE_VERSION` in `src/engine/run.ts` whenever a change can alter a run's outcome.

```
npm install
npm test            # vitest run
npm run typecheck   # whole repo, plus the no-Node guard on src/
npm run validate
npm run content     # regenerate content/core-set.pack.json from content/core-set/
npm run ui          # serve the visual interface at http://localhost:5173 (pushes to main publish ui/dist to GitHub Pages)
```

The measuring tools (the balance sheet, the calibrations, the build test, whole runs, the feel reads) and how to run each are in `docs/balance.md`, The tools.

When committing, follow any attribution instructions your session gives you.
