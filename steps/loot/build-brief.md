# The loot pass: the build's brief

The design is approved (gates 1 and 2, `intent.md`). This stage builds it so the director can play it. Their play is the gate.

## What to build

The new loot, in place of today's: 322 pieces, 35 formations and Neutral, the versions and mythics that change, and the two kit changes (Marked, Malison). With them, whatever engine support the cards need, the designer's tags for the nine builds, and the tools that read the loot (the build test's parties, the rogue's rosters and knobs) brought up to date, so the first playtest isn't played against knobs set for loot that's gone.

## What to read

- `CLAUDE.md`, `docs/primer.md`, `docs/rules.md`, `docs/code-map.md`, and the code, as you would for any change.
- `build/rules.md`: the few rules many cards lean on. One page.
- `build/<share>.md`: the catalog, one file a share, each item's card, stats, numbers, code-support hint and tags. Read the file for what you're building. It's generated from the fill by `catalog.ts`.
- `build/code-support.md`: the design's guesses at what the engine needs, by number. Hints, written without seeing the code.

The rest of this folder is the design's record. Search it for one item's name when a card is unclear; there's no need to read it.

## What's settled

- **A card is the spec,** with its stats and numbers. Build what it says. Where a card is unclear or can't be built as written, make the natural call and list it in the report; don't redesign it.
- **Numbers are first values,** in the scale's words. Nothing is tuned in this stage.
- **Offers aren't aimed** by the tags for the first playtest.
- **Marked and Malison** are each measured against today's game, with both versions' numbers, for the report.

## Done means

- Every item does what its card says: `npx tsx tools/piece-check.ts` shows each firing, with no crash and no loop.
- The tests, the typecheck and `npm run validate` pass; the code map and the documents say what's built.
- `npx tsx tools/build-test.ts` plays the nine builds, and `npm run balance` has run.
- A short report for the director, as `CLAUDE.md` describes: what to decide, what was built and what changed from the cards, what the numbers say, and what to play first.
