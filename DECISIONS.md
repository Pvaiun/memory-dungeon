# Decisions

What has been decided, step by step. Where this differs from the concept spec, this wins; the director will update the spec. Each step's report has the full reasoning.

Decisions are direction like any other (see `docs/method.md`): a designer can challenge one with evidence, and until it's changed here, it stands.

## Process

- **Method (Oct 15, 2026):** every design step runs intent, then design, then build and tune, as `docs/method.md` sets out. Direction is guidance: the AI challenges what doesn't fit, with evidence, and never changes it silently.

- **A first pass (Oct 16, 2026):** the 24 steps are a first pass. Each step aims for the best starting point to iterate from, not a final answer, and any step can be revisited at any time after the full pass, as in any game's development.

- **Context packs (Oct 16, 2026):** an interviewer outside the repo gets one generated file: the primer (`docs/primer.md`), the interviewer guide, the step's plan entry and the brief. The primer is the only place the game is explained to an outsider, and it's kept current whenever this file changes. Briefs cover their step only, and add "why it's hard".

- **Checks sized to the need (director, Oct 20, 2026):** a step runs the tests, studies and feel checks it needs to know something, and skips the ones it doesn't. When unsure, it asks the director. There's no fixed list of checks per step.

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

Schema 0.3, approved Oct 15, 2026, before the method existed. Since this is built before the method existed it's placeholder and considered inspiration at best. Its old write-up was cut (it's in git history); `SCHEMA.md` is now a short historical note.

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

## Step 3: simulation harness

Signed off by the director, Oct 16, 2026. Full record: `steps/03-simulation-harness/` (`design.md` and `report.md`, with sample reports in `samples/`).

- **Every later step tests its design with the harness** (`src/sim/`, run by `npm run study`). A study is a small data file: content, any changes to it, parties, dungeons, simulated players, seeds and how perks are picked. The same study always gives the same numbers. Versions run side by side on the same seeds, which is how a challenge gets both versions' numbers and a what-if gets answered.
- **How sure:** every rate has a range, and seeds are split into 20 blocks. A claim says how many blocks it held in, and under 16 of 20 it's "no clear difference". Studies are marked as tuning or held out, and held-out studies only run for the final check.
- **Built for the AI's loop.** Every study prints a one-screen digest for the AI. A report goes to the director only when something reaches them, always in this order: in short (words first, each point saying how sure), questions (only if any), one to three stories (a simulated player's weeks, or a fight retold), none to three charts drawn in text, and how it was run. Tables stay in the data file. Stories come from the same runs as the numbers, so a wrong number shows up as a strange story.
- **Simulated players.** We tune for the optimizer: it does most quests, sees only what a player sees, and homes in on builds by trial and error within a weekly budget of tries. Beside it is a good-enough benchmark: the strongest party the harness finds with the same unlocks, seeing everything, within a fixed budget, stopping at the first party that wins 9 tries in 10. Wherever the optimizer appears, the benchmark appears beside it. A casual player is the only other kind, as a check. Quest rates are assumptions until there's real quest board data.
- **Strictness** is two numbers for each dungeon or challenge: how many colours can win at all, and inside those, how many tweaks win. A colour is the broad kind of party, and it's one swappable piece of the harness. For now it's the set of classes in the party; steps 5 and 8 to 10 define the real one, likely the party's verbs weighted by efficacy, with formations and powerful gear counting toward it. It stays two numbers, with only a handful of colours.
- **Walls.** Every stuck week is sorted as walled by quests (only a new unlock moves the player on) or walled by play (it owns a party that wins, or has challenges left it can win). Reports give the share of each, how long walls last, what ended each wall, and how each wall was sorted against what ended it.
- **Perks** are measured as step 2's four numbers. "The best a player could know" is a priority list learned on half the seeds and played on the other half.
- **Feel checks** run at checkpoints, not every round. A fresh helper agent in the working session reads reading packs, so there's no API key to set up. It uses the plan's usage like the rest of the session, a small amount per check. A pack holds only what a player would see, plus each enemy's trait words, and never enemy stats or HP. The reader answers a fixed sheet. Its guess at the colour to try next after a loss is scored against the colours that win.
- **Placeholders, for step 14:** "can win" for strictness is half the tries. In progression, a dungeon counts as winnable at 1 try in 10. Party choices "start to matter" when the best and worst full parties differ by half their tries, or a whole fight. The benchmark's budget is 300 runs per question, which matched a full search on the sample.

Direction the director gave in the intent interview and the design review, Oct 16, 2026:

- **Replays are challenges only** (design review, replacing the intent interview's "repetition yes, endless grinding no" and the concept spec's "grinding is intended"). A cleared dungeon can only be replayed through its challenges. Each challenge pays loot, and there should be many per dungeon, perhaps generated later, but there's a hard cap. A dungeon's first clear and each challenge pay once: nothing already beaten pays again, and anything not yet beaten can be retried freely. A player who has beaten every challenge they can is as strong as play makes them, and only quest unlocks move them on. So there's no endless grinding to design around or simulate. How often a player is walled by quests versus walled by play is measured as the game is built, and has to be understood and agreed. Whether a challenge changes the enemies or only sets conditions for the player is open, for steps 10 and 11.
- **Quests a week** (design review, replacing the concept spec's 3 to 5): 4 to 7 for the first version. The quest board (step 19) uses the same range.

## Step 4: combat concepts

Signed off by the director, Oct 20, 2026. The director wrote the design themselves (`steps/04-combat-concepts/design.md`); where these decisions differ from it, they win. Full record: `steps/04-combat-concepts/` (`report.md` and `tuning.md`).

- **Combat is the director's design,** built as `combat-1` in `src/engine/combat/`, replacing step 2's stand-in. Content is schema 0.4: stats, statuses, actions and targeting rules replace step 1's rule language. `PRIMITIVES.md` lists the building blocks.
- **An Intensity status ends when its total falls below 1 stack** (replacing "when its total reaches 0"), and never exists below 1 stack. Stacks are still counted in thousandths. This removes the 10 pulses of 0 damage that ended every Burn.
- **Abilities have a default recovery,** about a sword's (the ruleset's `abilityRecovery`: 3 ticks in the worked example), replacing "no recovery". Any ability can state its own. This came from a feel check, where an ability and the attack right after it read as two actions at once.
- **Scaling, as the director set it after sign-off (Oct 20, 2026).** This replaces "Attack scales only physical instances", "physical instances scale from Attack by default", "Attack and Magic scale hits only" and the heal and shield exception.
  - **Every amount states its own scaling, and nothing scales by default.** That covers a hit, a rider, a heal, a shield, reaction damage, the stacks an application adds and a status's own numbers. Each is a base plus any number of stat ratios (usually one), or a flat number.
  - **No stat is tied to a damage type.** Attack and Magic are ordinary stats. By convention physical things scale from Attack and magical things from Magic, and a content editor can fill that in. Breaking the convention is for things meant to feel special: a Shield Bash from Armor, a legendary axe from Speed, a passive that makes basic attacks scale from Magic.
  - **Weapons.** A basic attack deals the weapon's base damage plus whatever scaling the weapon states. Its type (physical or magical) is the designer's choice, apart from its scaling. A weapon's damage never affects abilities. A weapon reaches abilities only through the stats it grants, such as +Attack.
  - **Tag boosts multiply on top** ("+50% fire damage" on a Fireball), as before.
- **A status is fixed when it's applied.** The application can scale the stacks it adds, from any stats it states. The applier's boosts that name the status or one of its tags ("+20% Burn") add stacks too. Boosts by element or type don't: Burn isn't a property of fire damage. The applier's boosts never reach a status's own numbers. A status's own numbers come from its definition and read the holder; a status that knows its source can also read the source's stats, once, at application. A Burn stack is a Burn stack, whoever applied it. Starting content won't use boosts to stacks or source stats; the engine supports both.
- **A Refresh reapplication replaces the old one:** its duration, numbers and source (replacing "each number keeps the stronger of old and new", and the edge case it caused). To let an applier scale a status, make it Intensity: a Chilled at −20 Attack Speed that refreshes, or a Fatigue at −1 per stack.
- **A status with one applier at a time knows its source:** Refresh (the latest applier), Fizzle and each Per source copy. A shared Intensity total doesn't. This replaces "only Per source statuses know their source", for statuses such as a single-target taunt or "if I die, you die".
- **Status damage is untyped and unresisted by convention.** Pulses can still be typed, or carry an element, as data; starting content won't use that. This replaces "type none is the only type for a status's own damage".
- **Pulse damage belongs to the holder, not the applier** (director, Oct 20, 2026). Once applied, a status's damage has nothing to do with whoever applied it, so it doesn't count as their damage dealt: lifesteal-style effects don't work from it by default. The one exception, as built, is Per source statuses, whose pulses are still credited to their source. That's a small set, to revisit if a class (a soul link, say) needs more.
- **Where the design was silent, confirmed:** reaction damage is never a hit (no hit events, no crit); an action whose stated targeting finds nobody when it resolves fails, with no MP spent and no cooldown; immunity to all damage also blocks damage-over-time statuses; "a random ally" can be the unit itself. The smaller choices in `tuning.md` stand until challenged.
- **A fight nobody can win isn't designed for** until it happens. The engine's 5,000-tick safety stop, counted as a loss, is engineering, not a rule.
- **Each unit draws its own dice** (party units by specialization, enemies by slot), so the same seed brings the same luck to the same unit, whatever else is in the fight.
- **Still open, for steps 6 and 8:** Lifesteal as a stat needs a scale with a second factor ("X% per point of Y").
- **Simulation speed (director, Oct 20, 2026).** Fast enough for now means the combat sample runs in under 2 minutes in a cloud session, and a normal tuning study finishes inside one command. Re-check at step 13, on real content. Studies run as one prebuilt file, a combat study's jobs are shared out across every core, and each party is checked once per study rather than on every seed: the combat sample went from 307 s to 64 s with identical numbers. A study's running time costs no tokens, because a cloud session's machine isn't charged; waiting and the 10-minute command limit are the costs. When volume outgrows a cloud session, studies run in a Claude Code session on the director's PC. A deeper rewrite of the engine for speed waits until step 13 shows it's needed.
