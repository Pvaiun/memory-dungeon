# Step 5i, step 4: the pieces' design, a brief for a fresh session

Oct 29, 2026. It runs after the cleanup (`steps/05-core-set/5j-cleanup/`), on main, against the game as the cleanup leaves it. Its companion, `pieces-build-brief.md`, builds and tests what this step designs.

## The task

Design all of the rogue's gear, formations and ability upgrades, plus the 16 mythics, from scratch and built backwards from the twelve builds in `builds.md`. All twelve builds are made at once: every piece is judged by the builds it serves and against the pieces that serve the others.

**One lead designer owns the design.** It writes the spine alone, then calls parallel agents to write the pieces in full, then brings their work back together and checks it as one design.

## What's settled (don't reopen)

- `intent.md` (the director's standing intent) and `philosophy.md`.
- **`builds.md`:**
  - the twelve builds, with their rhythms, rungs, needs and routes;
  - the web, the doors and the abilities that sit between builds;
  - what a formation can be;
  - the "Gear" section: who wears which kinds, two-handers, the magical kinds, the offhands, the amulet, rarity and mythics.
- **The cleanup's report:** the damage rules without elements, and the Hexer's and Geomancer's new kits.
- **Rules every piece keeps:**
  - It's worth a lot somewhere and little elsewhere. A piece strong everywhere gives something up.
  - The best choices are between things that are good for different builds.
  - Rarity is mostly how far a piece bends the game and how specific it is. Pieces below legendary carry effects too, and there are no random affixes.
  - Any kind of effect can sit on any slot. No piece, kind or slot says what it's "for", and a card says who can wear it.
  - An amulet never names one class's ability. A two-hander is worth a weapon and an offhand.
  - Every effect is phrased so the player knows what will happen.
  - Numbers stay in today's ranges.
- **Upgrades:**
  - every ability and passive gets one plain power step and a choice between two versions, designed for that ability, with no formula across abilities;
  - what matters is how the two versions differ;
  - targeting and trigger conditions count as much as numbers.
- **Formations:**
  - common, rare and legendary, with no mythic formations;
  - no build fishes for one formation;
  - a new formation should make a player rethink the party.
- **The engine grows as far as the designs need.** `builds.md` lists what's new and what's already there.

## The amounts

- **Gear:** 8 pieces a weapon kind, 12 an armor type, 8 an offhand kind and 24 amulets, about 240, plus 16 mythics (one per class).
- **Formations:** settle the count in the spine. Enough that every build has several that help it, in different ways.
- **Upgrades:** every ability and passive of all 16 classes.

## How to work

**1. The spine, by the lead alone.** One line per thing, in one file (`spine.md`):
- **First, the build-facing things:**
  - every rare and legendary piece and every formation, with what it does in plain words, its kind and rarity, the builds and rungs it serves, and how much it's worth to each;
  - for every kind, a short rule for what its commons and uncommons are like.
- **Then the class-facing things:** every upgrade (its power step and two versions) and the 16 mythics. These are written after the build-facing lines and read them, so that upgrades and mythics don't overlap.
- **Then the web, checked across all twelve builds together:**
  - every rung of every build is reachable through more than one route;
  - the shared needs are met once and pay off several times;
  - the doors between builds exist;
  - there are exotics that belong to no build;
  - no build has its pieces fenced off from the rest.
- **Gate 1:** the director reads the spine's rules, the web and a representative sample, plus what you're least sure of.

**2. The fill, in parallel.**
- **Calling the agents:** the lead calls agents, each with a bounded share. Examples of a share: a few gear kinds, the formations, or one group of classes' upgrades and mythics. Commons and uncommons go with their kinds.
- **What each piece gets:**
  - its effect in the card's words;
  - its numbers;
  - the engine hooks it needs;
  - the builds it serves.
- **Briefing the agents:** brief each agent from the spine, with intent and ranges, never examples. The director: "You will simply get the examples that you listed for sure, verbatim."
- **Bringing it back together:**
  - Check the whole design against the spine and the web again.
  - Count the stock against the amounts.
  - Have one fresh reader read it before the gate.
- **Gate 2:** the director reviews by sample. Update `intent.md` where their standing intent changes, update `CLAUDE.md`'s Status, commit, push and stop.

## Read first

- `CLAUDE.md` and `docs/method.md`.
- In this folder: `intent.md`, `philosophy.md`, then `builds.md`, all of it.
- In `docs/core-set/`: `classes.md` and `rules-and-vocabulary.md`, as the cleanup left them, and the cleanup's report.
- 5h's report, for how loot, formations and training reach a run.
