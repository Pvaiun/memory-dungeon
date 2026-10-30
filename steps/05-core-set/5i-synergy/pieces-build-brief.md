# Step 5i, step 5: the pieces' build and test, a brief for a fresh session

Oct 29, 2026. It runs after the pieces' design (`pieces-design-brief.md`) has passed the director's gate. It puts the whole design into the game and measures all twelve builds together. Balancing and the difficulty pass come after it, as a pass of their own.

## The task

Build the gear, formations, upgrades and mythics as designed, and the engine additions they need. Then test every build against the others on the same fights. As in the design, one lead owns the build and calls parallel agents for the volume.

## What it builds

- **Engine additions:** `builds.md` lists them, plus whatever the design added. Each gets its own tests, and `ENGINE_VERSION` is bumped.
- **Content:** every piece, formation, upgrade and mythic, schema-checked.
- **The rogue's loot,** from the "Gear" section of `builds.md`:
  - a third more gear for the fourth slot;
  - offers that pick a slot first;
  - the stock;
  - mythics in act II and III boss boons;
  - formations by rarity.
- **Interface:**
  - the training screen's power step and two versions;
  - cards with who can wear a piece;
  - the mythic colour;
  - the director's art where it has arrived.

The lead splits the volume among parallel agents with bounded shares: the engine additions, groups of gear kinds, formations, upgrades and the interface. Brief them with intent and ranges, never examples. The lead joins their work, and the tests, typecheck, validation and smoke stay green at every commit.

## Also in this build (the director's, Oct 30, after the design's gate 2)

- **Control resistance on bosses** (`intent.md` has their words). A boss gains a hidden stack each time it's Stunned (a Chill shatter's Stun included), Silenced or Slowed. Past a first threshold, those statuses land on it for less time; at the most stacks, it's immune to them. The stacks drain over time, so a party that isn't chaining control sits near zero. The battle text says RESISTED or IMMUNE. The thresholds, the cap and the drain are first values for the balance pass. It's the one exception to universal statuses.
- **Training:** a fresh unit needs about ten trainings now. For a start, every training opportunity gives three: the campfire's TRAIN already does; the training events (two today) and lessons (one) go up to three. A new act's "everyone learns one" and the shop's paid training stay as they are. The rest is decided later.
- **Marked** gets the director's icon art.

## How to test

- **The parties:** hand-built parties for every route of every build, at each of its three rungs (what most runs find, specific pieces, the far end). Build them with 5h's party tool (`src/rogue-parties.ts`). Neutral and formation versions both count.
- **One set of fights for all twelve builds at once:** the rogue's own fights, across the acts, with fixed seeds.
- **What to measure, across all builds side by side:**
  - **The rhythm read** (`npx tsx src/rhythm-read.ts`, moved onto these parties). Each build should land where its row in the rhythm table puts it, and away from the others.
  - **Strength by rung, for every build in one table.** What a build gives back should rise with what it asks, it should rarely be all or nothing, and no build should stand far above the rest at the same rung.
  - **Which pieces carry each build, and which never matter.**
  - **A feel read** of fights from several builds (`npx tsx src/rogue-feel.ts`).
- **The gate:** a short report for the director. It shows the rhythm read and the strength table for all builds, what lands and what doesn't, and the fixes you propose. The director plays it. Update `CLAUDE.md`'s Status, commit, push and stop.
- **Next, its own pass:** balancing (with the levers at the end of `fill-rulings.md`; statuses stay universal), then the difficulty pass aimed harder than today (the director: "I am 100% sure the game is going to be dramatically too easy with that pass").

## Read first

- `CLAUDE.md` and `docs/method.md`.
- In this folder: `intent.md`, `builds.md`, and the design the previous step wrote: `spine.md`, then the pieces in full in `fill/`, with `fill-rulings.md` (the lead's rulings, which win where they differ, and the engine additions gathered) and `fill-report.md` (gate 2).
- The cleanup's report, and 5h's report and tools.
