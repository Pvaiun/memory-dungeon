# Kickoff: the variety pass

**For the agent who runs it.** Read `CLAUDE.md`, `docs/primer.md` and `docs/rules.md` first, then this page. This page is the step's intent and its approved design, so start at build: run the whole pass, then stop for the director's playtest. There's no gate in between. Where this page is silent, choose, and list the choice in the report.

## Intent

The director, Nov 14, after playing the game the loot pass made:

- The game is "more functional, but less interesting" than the version before. Builds are picked, not found: a player reads the keyword on a card, takes everything that shares it, and plays the lane their classes chose for them. Doors and half-builds don't feel real.
- The causes, as the director and the designer read them:
  - every piece was written as the answer to a build;
  - a few effects repeat across many cards;
  - each build collapsed onto its one keyword;
  - stats follow the kind, so every piece of a kind pulls the same way and each class's gear reinforces its own lane;
  - formations colour-match a build and make it strong at once;
  - an ability's two versions are often two flavours of the same job.
- **Variety is the point of the pass.** Each piece should feel special. A player should often look at something and wonder "how could I make that work?"
- **An edit, not a redesign.** The nine builds, the statuses and the combat rules stay. Change what this page asks for and leave the rest.
- The director finds the game easy. Don't retune. The pass is expected to make the game a little harder, and that's wanted.

## How to work

- **One lead owns the whole pass.** The changes meet on the same pieces, so each piece is changed once, with all of them in mind, never in separate passes by separate agents.
- **Workers, if you use them, write shares of kinds,** never one kind of change. Each worker gets:
  - this whole page;
  - the live list of every card as it stands, current and rewritten;
  - the counts below.
  The lead then reads every share together, looks for what repeats across them, and rewrites the repeats.
- **No examples in any brief.** Give concepts, rules and ranges. An agent copies any example it's given, and copying is what this pass undoes.
- **Order.** Each step is its own commit, with the pack built and the tests passing:
  1. The kinds.
  2. The stat ladder.
  3. The pieces: stats and effects together.
  4. Mythics.
  5. Upgrades and passives.
  6. Formations.
  7. The documents, the Status and the report.
- **Count before and after.** Before writing, tally the recurring effect shapes across every card (`npx tsx tools/loot-list.ts` writes them all to `out/loot-list.md`), and tally again at the end. Check the shares this page asks for by counting, not by opinion.
- **Keep the machinery small.** New effects may need engine support: add it plainly, and bump `ENGINE_VERSION` and the schema as `CLAUDE.md` says.

## The changes

### 1. Kinds

- **Three weapon kinds and three offhand kinds a class.** At least one of the weapon kinds is one-handed.
- **Two armor kinds for about three classes in four.**
- **Overlap between classes is welcome.** A kind may have up to about five wearers, so a class's loot is partly its own, not mostly.
- **Pick each class's new kinds by its fantasy and its identities** (`classes.md`), not by its stat line.
- **The kinds themselves don't change:** the twelve weapon kinds with their swing words, the thirteen offhand kinds and the four armor kinds.
- **Retire the rules this replaces:** two kinds a class, at most three classes a kind, two classes sharing at most one kind, and every wearer reading the kind's signature stat.

### 2. The stat ladder

- **Legendaries and mythics carry a rare's stat steps,** on their kind's budget word (`KIND_BUDGET`). Commons and uncommons stay as they are.
- **Above rare, rarity is strangeness, not power.** A legendary or a mythic is often more exotic than a rare, but it's neither strictly better nor worse.
- **Retire these rules:** higher rarity is generally better, and a mythic carries at least a legendary's stats.

### 3. The pieces

**Stats**
- **A common keeps its kind's stats** (`loot.md`, Commons and uncommons by kind): a common is its kind.
- **From uncommon up, stats come from the piece, not its kind.** They're part of its character, what makes it this piece and not its neighbour. The kind still shapes what a piece is, but nothing holds a piece to its kind's stats.
- **About a fifth of pieces from uncommon up carry stats that point away from their wearers' lines,** so they're worth most to a unit built against its type.
- **Avoid the trap.** Choosing stats by the build a piece's effect serves rebuilds the lanes. Stats that agree with the effect are allowed, but they're not the default.

**Effects**
- **Cut the repetition.** The most repeated effect shapes (below) fall to about half their count. Turn the repeats into exotics, conditional pieces or a build's other threads. Never turn them into a card that names two builds' keywords at once.
- **Exotics: a quarter of rares and legendaries.** An exotic belongs to no build. It's powerful and strange on its own and worth seeing for itself, and a run may build around it.
- **Conditional pieces: at least a third of rares and legendaries.** A conditional piece is weak until a situation arises and strong when it does.
  - The party must be able to set the situation up: a pairing of units, a seat, a stat, another piece, a class. It's never one the fight has to supply; in play, pieces that wait on what the foes do were never taken.
  - A piece can be conditional through its stats alone.
  - With its full stats, a conditional piece is still worth wearing while the setup is missing.
- **Builds go deeper than their keyword.** Each build in `builds.md` already lists several threads; the loot collapsed onto the one that shows.
  - Spread a build's pieces across its threads. No more than about a third of the pieces serving a build name its keyword (its status, or the Shield for Landslide).
  - Where two or three builds share a thread, that thread is the door between them. A door is never a card that names two keywords.
- **The shares overlap.** Exotics, conditional pieces and a build's deeper threads can be the same pieces. The shares are floors, not separate stocks.

**What stays fixed**
- **The stock stays about the same size in each cell.**
- **Keep every weapon's id and name.** Each weapon has its own drawing, and `tests/content.test.ts` ties them together, so no weapon is added or removed. A rewritten weapon's new effect should suit its name.
- **New statuses are a last resort.** A new status that shows on the battle screen needs an icon the director picks. Prefer existing statuses and hidden workings, and list any new status that shows in the report.
- **Card rules still apply** (`loot.md`, Writing cards): a card says what happens, briefly, and never what it's for.
- **Serves lines stay true** to what each piece now does. An exotic's names no build.
- **Alike cards.** With more overlap, more pieces meet on one unit, and two pieces one unit can wear together never read the same.

### 4. Mythics

- **Every mythic is exotic:** it turns its class to something it wasn't doing. In the director's words, "Getting a mythic that just makes your class do what it was doing better is not interesting."
- **Its stats are a rare's,** beside the effect.

### 5. Upgrades and passives

- **At least two of a class's three abilities have a version that reorients the ability.** Reorienting means pointing the ability at a different job: one of the class's other identities, or a direction the class doesn't have yet. A different flavour of the job it already does doesn't count. The two reorienting versions needn't turn the same way.
- **A passive that works only inside one lane gets a version that works outside it,** so no class's passive holds it to one lane.
- **The kit still reads as the class's own:** a trunk and three identities, each viable (`docs/rules.md`).

### 6. Formations

- **A formation is a shape and a rhythm:** who is struck, who acts often, who hits hard, who waits, and what the party trades for it. Seats and whole formations may have effects all their own.
- **A formation themed to a build's keyword is rare,** about one in ten at most. Such a formation asks something real of the party in return, so it isn't the best pick every time.
- **No formation makes a build strong the moment it's seated.** A new formation should leave the player working out how to use it, not confirm what they already have.
- **Don't fix a one-build formation by adding another build's keyword.** A formation with several keywords is worse than one with one.

### 7. Documents, Status and report

- **Documents:** rewrite the lines these changes replace in:
  - `docs/rules.md`;
  - `docs/gear-design/philosophy.md`, `builds.md` and `loot.md`;
  - `docs/core-set/classes.md`;
  - the Gear section of `docs/core-set/rules-and-vocabulary.md`.
- **Engines aren't protected.** Where a change removes an engine's part, rewrite or drop the engine's entry in `builds.md`.
- **Status:** update `CLAUDE.md`'s Status to what's true now. Write the report to this folder as `report.md`, commit, and stop.
- **The report is for the director, and short.** In order:
  1. The decisions needed.
  2. The counts before and after: repeated shapes, exotics, conditional pieces, keyword share per build, keyword-themed formations, and abilities with a reorienting version.
  3. What changed from this page, and why.
  4. Samples, chosen as much from what you're least sure of as from your best.

## Checks

- **After each step:** `npm test`, `npm run typecheck`, `npm run validate`, `npm run content` and `npx tsx tools/piece-check.ts` (every item does what its card says).
- **After the kinds:** `npx tsx tools/gear-slots.ts`.
- **Skip** the balance sheet, the build test, the calibrators and `rogue:tune`. The build test's parties pick gear by its tags and will drift; that's expected.
- **Optional:** one `npm run rogue` at heat 0, so the report can say how much harder the game got. No tuning on it.

---

## Facts to count from

Not examples: where the pass starts, measured on the pack of Nov 13.

- **Effect shapes** across the 450 lines of `out/loot-list.md` (gear, mythics, formations, upgrades), by the words on the card:
  - Shield 41, Burn 31, Chill 29, Shock 27, Bleed 18;
  - "At fight start" 30, on a kill or a foe falling 20, a status on basic attacks 17;
  - "When hit" 13, Stun 13, Thorns 10.
- **Exotics** (no build served): about 15 of the 350-odd items above common.
- **Formations:** about 20 of 35 serve one build mainly.
- **Stats:** a standard kind carries 1, 2, 3, 4 and 4 steps from common to mythic, and every plate piece draws only on Defense, HP, Aggro and Thorns.
- **A passive that holds a class to one lane:** the Geomancer's Bedrock, and both its versions, work only while its Shield holds.
