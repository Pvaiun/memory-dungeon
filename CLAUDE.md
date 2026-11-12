# Dungeon Game: design repo

## What this is

Design work for a party-based JRPG dungeon crawler with automatic combat, where preparation is the game. Its content is the **core set**, and the rogue mode is the game. Everything here serves the design: a schema, a headless engine, simulations and a phone-sized interface. The director sets the vision; AI designs, generates content and tunes it, using simulation in place of most playtest rounds.

**Read `docs/primer.md` first:** how the game works, in one short read, and where to look for anything else. Read `docs/rules.md` before any design or tuning work. Open a detailed document only for the part the work needs.

- `docs/primer.md`: the game in brief, and the map of where everything is.
- `docs/rules.md`: the director's standing direction, one page. It wins over the design documents where they differ.
- `docs/core-set/`: the detailed reference for the game as built. They give words and behaviour; the numbers are in the content.
  - `rules-and-vocabulary.md`: the combat rules and vocabulary.
  - `classes.md`: the classes.
  - `enemies.md`: the enemies and challenges.
  - `rogue-mode.md`: the rogue mode.
- `docs/gear-design/`: the design of gear, formations, ability upgrades and mythics, which isn't finished. Read it before any work on them.
  - `philosophy.md`: the director's intent, rhythm, what makes a piece good, and how loot is made.
  - `builds.md`: the nine builds the loot is designed from: roads, doors and engines.
  - `loot.md`: the rules the loot is made by.
- `docs/build-cards.md`: what each build should look like in a fight, card by card, for reading build parties against chosen fights; it points to the balance sheet's bands (`BANDS` in `tools/balance/sheet.ts`), the only standing targets for a fight's shape. `docs/feel-reader.md` is the fight reader's brief.
- `docs/code-map.md`: where the code is, one line a file, and where to start for each kind of change. Read it before opening code, rather than listing folders.
- `src/`: the game, pure TypeScript that also runs in the browser: the engine, the rogue mode, the schema, the validator and the simulation library. `tools/`: the Node command lines that measure it.
- `content/core-set/`: the core set as content. `scale.ts` holds every first value by name (the weapon kinds' swing words and budgets among them); the other files hold the classes, gear, formations, upgrades, enemies, dungeons and the rogue mode, with each item's card text. `npm run content` writes `content/core-set.pack.json`, which the engine, tests and studies read.
- `ui/`: the interface (Vite, plain TypeScript), a retro JRPG screen that runs on a phone. `ui/README.md` has the details; `npm run ui` serves it, and GitHub Pages hosts it.
- `steps/`: working folders for open work only, one per step. A closed step's history is in git, not here.
- `PRIMITIVES.md`: the engine's building blocks (what content can express), generated from the schema.

## How to work

- **Steps and gates.** Work comes in steps, in the order the director sets. A step that designs something runs three stages: the director's intent, then a design they approve, then build and tune. Each stage ends with the director: don't move past a gate, or start the next step, without them. Work the director has already designed starts at build.
- **Intent first.** Don't propose a design until the director's intent for the step is recorded, and never write their intent for them. Record it short: what they want, quoting them only where the wording matters.
- **A step's folder is scratch.** `steps/<slug>/` holds the open step's intent, design and report while it runs. When the step closes, fold what lasts into the design documents and `docs/rules.md`, and delete the folder. Keep no tuning trails or logs; generated output goes to `out/`, which git ignores.
- **Documents hold words, data holds numbers.** A design document says what a thing does and why, in the scale's words. Its sizes, costs, timings and stat lines live in `content/core-set/` alone, so name the constant rather than copying a value. Documents keep no history (no "until Oct 28", no "was"): git has it. When a change lands, rewrite the line.
- **The report** is what the director reads at a gate: short and plain, leading with the decisions needed (a challenge with both versions' numbers), then what was built and what changed from the design, what the numbers say and how sure, and the samples worth looking at.
- **Keep the code map true.** Adding, moving, renaming, splitting or deleting a source file, or changing what one is for, means changing its line in `docs/code-map.md` in the same commit. `tests/code-map.test.ts` fails on a missing or stale file; a line that no longer says what its file does is on you. Keep a file to one concern: when one grows past about 600 lines, split it along its sections into a file and a folder of the same name (`fight.ts` and `fight/`: the file re-exports the parts and lists them).
- **Be a designer, not an order-taker.** Direction is guidance. Challenge direction that doesn't fit the game: in the design, before anything is built, and in tuning, as soon as the evidence shows it. Bring reasons or numbers. Never change a direction silently, and never grind around one that's the real problem.
- **Trust by sample.** The director reviews rules and samples, not the full volume. Show what you're least sure about, not just your best work.
- **Flag, don't guess.** When the core set is inconsistent or underspecified, say so. If a step can't wait, state the assumption plainly and continue.
- **Briefs for agents give intent and ranges, never examples:** an agent copies any example it's given. The director's own notes often hold illustrations made up on the spot: read them for the intent behind them.
- **Code serves the design.** The engine, the harness and the interface stay small; don't polish them.
- **Placeholders.** Everything in `fixtures/` is placeholder: the worked example is the machinery's test fixture. The core set's numbers in `content/core-set/scale.ts` are first values on the documents' relative scale, not balanced. Don't present any of these as decided beyond what `docs/rules.md` and the core set record.

## Status

What's true now (Nov 12, 2026). Replace what's done rather than adding to it; history is in git.

- **The game is built and approved as it stands:** the rogue mode (`docs/core-set/rogue-mode.md`; the interface's Settings → MODE → ROGUE) with 16 classes, 322 gear pieces, 16 mythics, 35 formations and Neutral, and 64 ability upgrades. Engine 0.22, schema 0.12. Free play stays as the sandbox. Now: the balance pass, in two parts.
- **Closed, in main: one kind of damage, and class identity after it.** Every hit meets Evasion and Defense, and Magic and Magic resist are gone. Twelve weapon kinds and thirteen offhand kinds by one set of rules, each kind's swing in three words (`KIND_WORDS` in `scale.ts`); stats on every piece at every rarity on a ladder that rises by rarity (`KIND_BUDGET`; the interface shows the stats as values, and the cards don't repeat them in words); the speed stats in four class lines; the kit changes (Hoplite, Paladin, Valkyrie, Bard, Hexer, Pyromancer, Stormcaller, Ranger) and the versions; Ward retired, Marked in the vocabulary. The stats on every piece are a first assignment by rule, and the retired pieces and first fills are listed in `docs/gear-design/loot.md`.
- **Closed, in main: the builds.** `docs/gear-design/builds.md` holds nine builds as roads (four are a status's: Bonfire, Cold Snap, Thousand Cuts for Bleed, the Storm for Shock; five aren't: Landslide, the Hunt, the Toll, Barrage, Blood Pact), the doors between them, and twenty-eight engines: found synergies designed in advance, each written as what combines, what the player sees and the least a run needs to see it, with four more the kits and mythics already make. The loot, its tags (`SERVED`, from each item's Serves line) and the build test's parties name the nine. Two kit changes are built: Marked takes the party's random picks; the Hexer's Malison pays for breadth.
- **Closed: the loot pass.** The new loot is built from the nine builds and approved: 322 pieces in six shares, 35 formations, the changed versions and mythics, and the two kit changes (Marked takes the party's random picks; Malison pays for breadth, a fifth more for each different affliction). Every item carries its Serves line (`SERVED`): its roads, rungs and engines, designer data never shown. The rules the loot is made by, its words, counters and stock are in `docs/gear-design/loot.md`; each engine's keystones are in `builds.md`; the director's rulings are in `docs/rules.md`.
- **Changed in the base rules, on the director's word:** nothing in the vocabulary is locked to one class (Aegis and Hidden included); the Signature tier is folded into Specialist, and enemy-only (Doom, Bulwark) is a tier of its own the party can't use until the director says so; the line that everything scales from its user is gone; an engine is a found synergy, and anything but a mythic takes two parts; a wall is not every build's start; a foe's action can be called early; a knockout keeps carrying; nothing the player has to understand rests on a number they can't see, so a version that drains a foe's MP is a mana gain for its user (`docs/rules.md`, `docs/core-set/`).
- **Open, for later:** whether foes should have MP at all (the director isn't sure).
- **Open: the balance pass** (`steps/balance-pass/`: the director's intent and rulings, part one's report, part two's `report-2.md`). Part one is done and approved: the build parties against chosen fights, the knobs' baseline (`tools/build-calibrate.ts`), the riders sized to their statuses (`APPLIED`), the engine's capping fixed, MP pools on half steps, pieces' own Evasion step (`PIECE_SPECIAL`), `MP_STEP_HP`, Barrage's links and seats. **Part two is done and waits at the gate** (`report-2.md` leads with four decisions): whole runs and the knobs. On the director's ruling, fights by cost: a regular fight's and an elite's knob is what it costs a careful party, and `rogue:tune` sets only the bosses (to 22/35/45% lost) and evens out the regions within an act, each with its own elite knob. Act I is measured against the rosters at act I's power, with a measured climb (`early`), the elites' own gentler climb (`eliteEarly`, new in the schema), 10 a floor above the reference; packs grow from floor 9; the easy pools are measured; bosses have a shape of their own (less HP, more damage). Classes, each keeping its line as a signpost (the director's rule): the Vampire HP 3.5 and Lifesteal medium, the Assassin a bigger Backstab, the Ranger Evasion medium, the Geomancer a heavier, slower Rockfall (`ROCKFALL`), the Knight a bigger Vanguard (`VANGUARD_SHIELD`); the rest as they were. The sheet now starts rogue fights rolled (cooldowns as a run carries them). A class shape check (each class's one line against its fights) is in the report: every class fits but the Paladin, which reads as a second healer with a Smite (left as a hybrid by design). The Storm King's Rally summons Soldiers at half HP (a summon's `hp` share, new in the schema). The simulated player wins 13% at heat 0 (bosses beaten 78/66/55%), each act climbing to its boss; the build parties win bosses 40% (52% from a full start). Open in the report: act III's bosses against the build parties, the Tower Top's bosses still the longest (about 145 ticks), Bonfire rung 2 strong, Barrage weak against bosses. The director is playing it next.
- **Still from earlier, for the balance pass:** wall-less starts lose far more of act I's regular fights than walled ones at any knob, and the director will fix that by other means than the knobs; the director prefers sample parties against sample fights to simulated runs for judging builds; the balance sheet's trios never wear 76 of the pieces, so its gear rows mean little; whether Accuracy goes on more commons is the director's call (Dodgers and Armored shells lost their Fundamental answer). Kits arriving one ability at a time, and cooldowns carrying, are judged once the game is balanced. From the loot pass, still to watch: Frost fist's power step; Marked's length against how long a Marked foe takes to fall; plain riders sized for a slow weapon once The standard or Mimic wand puts them on a fast one; Huntmaster's quiver at "ready again"; a fire that grows by itself on a lone boss under Everflame lantern, Bellows wraps and speed; Unmake fizzling for want of a cast (12%); nine items that never fire in the piece check's fights for want of their condition.
- **Nothing is balanced yet.**
- **The tools** (each file's header says how to run it):
  - `npm run balance`: the balance sheet. Run it after any numbers change, before the knobs.
  - `npm run rogue:calibrate`: each fight's knob against the hand-built rosters of `tools/rogue-parties.ts` (act I's pools; `--climb` measures act I's climb); then `npm run rogue:tune`: the bosses to their targets and the regions within an act evened out.
  - `npx tsx tools/build-calibrate.ts`: each regular fight's, elite's and boss's knob against its act's build parties, from rolled starts (the balance pass's baseline; the easy pool left alone).
  - `npm run rogue`: whole runs with the simulated player (`src/sim/rogue-ai.ts`).
  - `npx tsx tools/build-test.ts`: the nine builds side by side, on the 27 routes of `tools/build-parties.ts` (builds.md's classes, each build's formation a rung; gear, versions and mythics picked from the loot's tags; one or two abilities a unit at rung 1, all three after). Each fight starts rolled, as a good player arrives: HP mostly full, MP partly spent, cooldowns anywhere from ready to just used (`--fixed-start` for the old full start).
  - `npx tsx tools/piece-check.ts`: every item does what its card says.
  - `npx tsx tools/gear-slots.ts`: who wears which kinds, and whether the weapon and offhand rules hold.
  - `npx tsx tools/loot-list.ts`: today's loot as one line per item, with its cards (`out/loot-list.md`).
  - `npx tsx tools/rogue-feel.ts`: fight logs for a feel read; the reader's brief is `docs/feel-reader.md`. `--builds landslide,storm` (or `all`) plays the build test's parties instead, on their rung's fights or `--fights`, with each build's card (`docs/build-cards.md`) beside the packs.
  - `npx tsx tools/rogue-acts.ts`: the act road.
  - `npx tsx tools/rogue-play.ts`: the AI playtester's game.
- **Session pattern:** a piece of work can take one session or several; its `steps/` folder is the handoff. Each session ends at a gate by updating this Status section (what's true now, not a log), committing, and stopping for the director.

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
npm run smoke       # play the core set documents' own test trios (--seeds N, --only <stage>, --log <stage>, --kit best)
npm run dungeon -- --pack content/core-set.pack.json --party content/parties/starters.json --dungeon old_road   # print one run (--seed N, --player)
npm run study -- studies/core-set-starters.json   # run a combat study: prints a digest, writes out/<id>/ (--report, --feel, --final, --workers N)
npm run balance -- --trios 80 --seeds 2   # the balance sheet: both modes at frozen knobs, a spread of parties, every option's line against its band (out/balance/sheet.md; about 4 minutes; --sets free,rogue, --probes off, --set path=value)
npm run ui          # serve the visual interface at http://localhost:5173 (npm run ui:build writes ui/dist; pushes to main publish it to GitHub Pages)
```

When committing, follow any attribution instructions your session gives you.
