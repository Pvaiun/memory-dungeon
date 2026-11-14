# Kickoff: unique pieces, creative builds

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
- **The point of the pass is unique pieces and inspiring, creative build making.** Each piece should feel like nothing else in the game. A player should often look at something and wonder "how could I make that work?"
- **Builds may soften, a lot.** Depth matters more than clarity: a build can be much less clearly signposted if that makes it deeper. Nothing has to show a player which build to make.
- **An edit, not a redesign.** The nine builds, the statuses' place in the game and the combat rules stay. Change what this page asks for and leave the rest.
- The director finds the game easy. Don't retune. The pass is expected to make the game a little harder, and that's wanted.

## How to work

- **One lead owns the whole pass.** The changes meet on the same pieces, so each piece is changed once, with all of them in mind, never in separate passes by separate agents.
- **Workers, if you use them, write shares of kinds,** never one kind of change. Each worker gets:
  - this whole page;
  - the live list of every card as it stands, current and rewritten;
  - the counts below.
  The lead then reads every share together, looks for what repeats across them, and rewrites the repeats.
- **No examples in any brief.** Give concepts, rules and ranges. An agent copies any example it's given, and copying is what this pass undoes.
- **Order.** Each step is its own commit, with the pack built and the tests passing (the two art tests aside; see *What's free*):
  1. The kinds.
  2. The stat ladder.
  3. The pieces: stats and effects together.
  4. Mythics.
  5. Upgrades and passives.
  6. Formations.
  7. The documents, the Status and the report.
- **Count before and after.** Before writing, tally the recurring effect shapes across every card (`npx tsx tools/loot-list.ts` writes them all to `out/loot-list.md`), and tally again at the end. The shares on this page are rough aims to check by counting, not numbers to hit exactly.
- **Keep the machinery small.** New effects may need engine support: add it plainly, and bump `ENGINE_VERSION` and the schema as `CLAUDE.md` says.

## The changes

### 1. Kinds

- **Three weapon kinds and three offhand kinds a class.** One of the weapon kinds is one-handed, so every class can carry an offhand.
- **Two armor kinds for about three classes in four.**
- **Overlap between classes is welcome.** A kind may have up to about five wearers, so a class's loot is partly its own, not mostly.
- **Pick each class's new kinds by its fantasy and its identities** (`classes.md`), not by its stat line.
- **The kinds themselves don't change:** the twelve weapon kinds with their swing words, the thirteen offhand kinds and the four armor kinds.
- **Retire the rules this replaces:** two kinds a class, at most three classes a kind, two classes sharing at most one kind, and every wearer reading the kind's signature stat.

### 2. The stat ladder

- **Legendaries and mythics carry a rare's stat steps,** on their kind's budget word (`KIND_BUDGET`). Commons and uncommons keep their step counts.
- **Above rare, rarity is strangeness, not power.** A legendary or a mythic is often more exotic than a rare, but it's neither strictly better nor worse.
- **Retire these rules:** higher rarity is generally better, and a mythic carries at least a legendary's stats.

### 3. The pieces

**Stats**
- **Every piece's stats are its own.** Each piece is a unique thing of its kind, and its stats are part of what makes it that thing. There's no on-brand or off-brand. Each kind's general leaning is known (`loot.md`, Commons and uncommons by kind). Think about what a unique piece of that kind would carry, without being held to the leaning.
- **Choose stats for the piece, never from a build.** Taking a piece's stats from the build its effect serves rebuilds the lanes.

**Effects**
- **Cut the repetition.** The most repeated effect shapes (below) fall to roughly half their count. Turn the repeats into exotics, conditional pieces or a build's other threads. Never turn them into a card that names two builds' keywords at once.
- **Exotics: roughly a quarter of rares and legendaries.** An exotic belongs to no build. It's powerful and strange on its own and worth seeing for itself, and a run may build around it.
- **Conditional pieces: roughly a third of rares and legendaries.** A conditional piece is weak until a situation arises and strong when it does.
  - The party must be able to set the situation up: a pairing of units, a seat, a stat, another piece, a class. It's never one the fight has to supply; in play, pieces that wait on what the foes do were never taken.
  - A piece can be conditional through its stats alone.
  - With its full stats, a conditional piece is still worth wearing while the setup is missing.
- **Builds go deeper than their keyword.** Each build in `builds.md` already lists several threads; the loot collapsed onto the one that shows.
  - Spread a build's pieces across its threads, so only a minority of them name its keyword (its status, or the Shield for Landslide). Roughly a third is the aim.
  - Where two or three builds share a thread, that thread is the door between them. A door is never a card that names two keywords.
- **No signposting.** A piece doesn't have to show which build it belongs to, and a build's first steps don't have to point the way. Two things stay:
  - every card says plainly what happens (`loot.md`, Writing cards);
  - an effect is big enough to be seen when it fires.
- **The shares overlap.** Exotics, conditional pieces and a build's deeper threads can be the same pieces.

**What's free**
- **Statuses.** Create, change or delete statuses as the pieces need. An icon pass follows this one.
- **Weapons.** Rename, replace, add or remove weapons as the design needs, and ignore their drawings. An art pass follows that moves the drawings to the new weapons.
- **The two art tests.** In `tests/content.test.ts`, the test that ties each weapon to its drawing and the test that wants an icon for every status that shows are expected to fail until those passes. Leave them as they are, and list in the report every weapon and status left without art. Every other test passes after each step.

**What stays fixed**
- **The stock stays about the same size in each cell.**
- **Card rules still apply:** a card says what happens, briefly, and never what it's for.
- **Serves lines stay true** to what each piece now does. An exotic's names no build.
- **Alike cards.** With more overlap, more pieces meet on one unit, and two pieces one unit can wear together never read the same.

### 4. Mythics

- **Every mythic is exotic:** it turns its class to something it wasn't doing. In the director's words, "Getting a mythic that just makes your class do what it was doing better is not interesting."
- **Its stats are a rare's,** beside the effect.

### 5. Upgrades and passives

- **Roughly two of each class's three abilities have a version that reorients the ability.** Reorienting means pointing the ability at a different job: one of the class's other identities, or a direction the class doesn't have yet. A different flavour of the job it already does doesn't count. The reorienting versions needn't turn the same way.
- **A passive that works only inside one lane gets a version that works outside it,** so no class's passive holds it to one lane.
- **The kit still reads as the class's own:** a trunk and three identities, each viable (`docs/rules.md`).

### 6. Formations

- **A formation is a shape and a rhythm:** who is struck, who acts often, who hits hard, who waits, and what the party trades for it. Seats and whole formations may have effects all their own.
- **Formations themed to a build's keyword are a minority.** Each one asks something real of the party in return, so it isn't the best pick every time.
- **No formation makes a build strong the moment it's seated.** A new formation should leave the player working out how to use it, not confirm what they already have.
- **Don't fix a one-build formation by adding another build's keyword.** A formation with several keywords is worse than one with one.

### 7. Documents, Status and report

- **Documents:** rewrite the lines these changes replace in:
  - `docs/rules.md`;
  - `docs/gear-design/philosophy.md`, `builds.md` and `loot.md`;
  - `docs/core-set/classes.md`;
  - the Gear section of `docs/core-set/rules-and-vocabulary.md`.
- **Retire the signposting requirement** wherever the documents state it, among them the philosophy's intent and the builds' first rungs.
- **Engines aren't protected.** Where a change removes an engine's part, rewrite or drop the engine's entry in `builds.md`.
- **Status:** update `CLAUDE.md`'s Status to what's true now. Write the report to this folder as `report.md`, commit, and stop.
- **The report is for the director, and short.** In order:
  1. The decisions needed.
  2. The counts before and after: repeated shapes, exotics, conditional pieces, keyword share per build, keyword-themed formations, and abilities with a reorienting version.
  3. The weapons and statuses waiting for art.
  4. What changed from this page, and why.
  5. Samples, chosen as much from what you're least sure of as from your best.

## Checks

- **After each step:** `npm test` (the two art tests aside), `npm run typecheck`, `npm run validate`, `npm run content` and `npx tsx tools/piece-check.ts` (every item does what its card says).
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
