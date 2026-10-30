# Step 5k: the balance pass, a brief for a fresh session

Oct 30, 2026. It runs after the pieces are built (`5i-synergy/pieces-build-brief.md`) and the director has played that build. It replaces the way past passes balanced: no simulated player and no thousands of whole runs.

## Why it's done this way (the director, Oct 30)

The director, on past passes: every time, "the agent spends like 7 hours running every single simulation, thousands and thousands and thousands of them, talking about win rates over the entire content, trying to have a smart selection being done by an AI player. And the truth is, it never works." In rogue mode there are too many choices for a simulated player to make well. And the passes "almost immediately [stop] working on things like damage scaling and abilities and durations of status effects, and immediately [start] going into tuning those knob values." Knobs answer "is the game beatable?" They can't answer "is this strategy too strong or not strong enough?", and that's the question the new gear, formations and upgrades raise.

So this pass balances the player's tools and the enemies against each other on **fixed parties in fixed fights**, measuring what happens in each fight rather than win rates. It checks a run's resources with **fixed written rules**, not a deciding player. It sets the knobs **once, at the end**. Then the director's own saved runs become the data for the next round. Mass simulation comes back only at the director's word, once they say the game feels right.

**The budget is the director's tokens, not computer time.** Simulating a fight costs milliseconds. What costs is an agent reading output, guessing and re-running. Every rule below follows from that: the computer measures everything, and the agent reads one page a round.

## What stands

- Statuses are universal; a status scales by its stacks, never by who applied it. MP costs are set by hand. Aggro works by draw.
- Synergies may be overpowered. The sheet flags outliers, and **the director decides which ones are fun**. The agent proposes; it doesn't flatten them.
- The engine doesn't change, except for log-only additions the measures need. This pass changes numbers.

## Part 1: the bench (tools, built once)

**Build templates, not parties.** For each of the twelve builds (`5i-synergy/builds.md`), write one template:
- its **core:** the classes, pieces, formation and upgrades that make it that build;
- its **open seats:** the rest of the party and gear, each with the options that make sense there.

A script fills each template every working way, about 20 to 30 variants per build, at three stages:
- **act I's middle, act II and act III**, at the power levels in `src/rogue-parties.ts` (`LEVELS`: abilities known, upgrades, rarity, legendaries, HP and MP going in);
- each variant inside its stage's budget, so variants are compared at equal power.

The agent writes 12 templates; the script makes several hundred parties.

**The gauntlet:** about 8 fixed fights at frozen knobs and fixed seeds:
- act I: a regular fight, an elite, the boss;
- act II: the same;
- act III: an elite and the boss.

Pick foes that cover the enemy kinds: packs, a big single target, casters, control-heavy foes.

**The measures,** from the logs (`src/balance.ts` already reads most of them):
- **margin,** the main one: the share of the party's HP left at the end of a fight, or on a loss, minus the share of the foes' HP left. It's one continuous number, so it still moves when win rates are stuck at 100% or 0%.
- time to kill;
- each unit's share of damage dealt and taken;
- MP spent;
- each status's share of its applier's damage;
- each foe's share of the damage taken.

**The report: one page a round** (`out/balance/page.md`), ranked by how far each line is outside its band:
1. **Builds:** each build's best quartile and median margin against the field at each stage. A build's best is where overpowered shows; its median is how forgiving it is.
2. **Builds against fights:** a grid of builds by gauntlet fights.
   - A row out of line points at a build.
   - A column out of line points at a fight or enemy.
   - A single cell out of line is a matchup. The rogue mode wants some of those, so these are reported but not fixed.
3. **Pieces, formations and upgrades:** each one swapped into the parties built for it, against a reference of the same rarity, with the difference in margin. Everything is measured, because measuring is free. Only outliers make the page.
4. **Open seats:** which choices move a build's margin most, which shows which pieces matter.

**Bands:** write them before any fix, each with its reason, as `balance.ts` does. The director reacts to them at the first gate (proposed starting point: a build's best quartile within ±15% of the stage's median margin, a piece's swap difference within its rarity's range).

## Part 2: the relative pass (the levers)

- **At most three rounds.** Each round:
  - read the page;
  - fix the top outliers with numbers on abilities, statuses, pieces, formations, upgrades and enemies' stats and moves;
  - re-run the bench.
- **Knobs are frozen for the whole of parts 1 to 3.** A knob change during the relative pass is a mistake, whatever the page says.
- The agent never reads raw logs or full sheets, only the page. When a line needs explaining, it does one targeted read of one fight (`src/sim/feel.ts`) and says so in the trail.
- After round three, stop and report, even with outliers left. Those are listed with a proposed fix.

## Part 3: a run's resources (rules, not a player)

`src/rogue-acts.ts` already plays an act's fights in order with fixed rules for the bench, tonics, potions and the campfire (its header lists them). Point it at the bench's parties, one or two variants per build, and run it once after part 2. Report each build's:
- fights per class before running dry;
- how often the bench fights;
- tonics drunk;
- losses by fight kind.

Anything wildly off goes to the report. It isn't iterated. The rules are a stand-in for the director's play, and the saved runs (part 5) check them.

## Part 4: the knobs, once

Recalibrate every fight's knob once against the bench's parties at their stage (`npm run rogue:calibrate`, pointed at the bench instead of the old rosters). Use the difficulty targets the director sets at the gate, or round 6's if they don't set new ones. One pass and no whole-run tuning, so the game is playable for the director's runs.

## Part 5: saving the director's runs (interface)

- **SAVE RUN** on the run's end screen, won or lost. It's never automatic: some runs are tries the director abandons. An optional one-line note goes with it ("trying Burn stacking").
- **EXPORT** in Settings: all saved runs as one JSON download. Plus **CLEAR SAVED RUNS**.
- **What a saved run holds:**
  - the content's version and `ENGINE_VERSION`;
  - the run's seed;
  - **every choice, with what was offered beside what was picked:** rewards, shop, events, recruits, campfire, map path, supplies used, swaps;
  - **a snapshot of the run before every fight:** the `RogueRun` state the fight starts from (party, bench, gear, abilities, formation, HP, MP, supplies);
  - each fight's result.
  
  It's stored in `localStorage` under its own key, wrapped like the bestiary's.
- **The replay tool** (`src/replay-runs.ts`):
  - reads an export;
  - re-plays every saved fight from its snapshot under the current numbers, with several seeds, and gives each fight's margin then and now;
  - gives **pick rates:** each piece, formation, upgrade and recruit offered, against how often it was taken.
  
  This is the next balance round's data. A fight snapshot stays valid after numbers change even when the run's path wouldn't, so "would this fight still be won after the nerf?" has a real answer.

## Done means

- the bench, the page, the road on the bench's parties, the knobs, SAVE RUN, EXPORT and the replay tool, with tests, typecheck, validation and smoke green;
- `trail.md`: each round's page and what was changed, with before and after;
- `report.md`, short:
  - decisions for the director;
  - the outliers left, each with a proposed fix;
  - which overpowered synergies were kept for the director to judge;
  - what part 3's rules found.

**Gates:** the bands and templates (end of part 1, before any fix), then the report. Then the director plays and saves about a dozen runs, and the next round starts from the export.

## What it doesn't do

- no simulated player making choices, no `npm run rogue` mass runs, no whole-run knob tuning (`rogue:tune`);
- no feel reads beyond the targeted one-fight reads in part 2;
- no new mechanics: anything that needs one goes to the report.
