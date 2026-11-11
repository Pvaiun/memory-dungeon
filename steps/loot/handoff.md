# The loot pass: handoff, gate 2 passed

Nov 11, 2026. The design is approved and nothing is built. Nothing is running, and nothing is scheduled. A fresh session starts from this page, then reads `build-brief.md`, which points at `build/`: the catalog and one page of rules.

## Where it stands

- **Gate 2 is passed.** The director took all seven of the report's recommendations, approved the counts, the spine's rules and its four bends, and doesn't want offers aimed for the first playtest. It's recorded in `intent.md` (*Direction from gate 2*).
- **Their rulings are applied,** by hand, to the cards, the spine, `fill/shared.md` and two lines of `docs/gear-design/builds.md`:
  - a spell paid in life costs half the share (Flagellant's vestments, The covenant, The chalice, Heart of the saint);
  - the shatter bell rings the first-slotted ability (Floe charm, Frozen tome, Icefall's Breaker), so the player picks what rings;
  - someone always stands in the light, with the gap closed (Decoy's card says it);
  - a Crescendo's price is two fifths more cost a stack (Crescendo charm);
  - Thunderhead maul reads its basic attacks alone;
  - the riposte is its keystone and a Shield on the dodge (`builds.md`);
  - Frost fist stays as written.
- **The design is in three places:** `spine.md` (one line an item, its rules and the code support by number), `fill/` (eight shares, 417 entries: every card, stat step and number), and the rulings (`fill/shared.md`, `fill/round-1.md` to `fill/round-3.md`). `npx tsx steps/loot/fill-check.ts` and `npx tsx steps/loot/web-check.ts --write --index` both pass.
- **`report.md` is gate 2 as the director read it.** Its sums for the ruled decisions are from before the rulings; a note at its top says so.

## What's next

**The build:** `build-brief.md`. It reads `build/` (the catalog, generated from the fill by `catalog.ts`, and `build/rules.md`), not the fill. Run `npx tsx steps/loot/catalog.ts` after any change to the fill.

## One thing read, not ruled

The director didn't name the mirror's two readings. The lead took "ok with your rules" to cover it, so the fill keeps pieces of each. `intent.md` says so, and the director can say otherwise.

## What it cost

The fill's agents and the fresh readers each read the whole design (100k to 270k tokens) before doing anything, and the design had grown into edge-case notes. The build reads the catalog instead: about 56k tokens in all, under 8k a file.
