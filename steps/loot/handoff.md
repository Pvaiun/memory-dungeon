# The loot pass: handoff, gate 2 passed

Nov 11, 2026. The design is approved and nothing is built. Nothing is running, and nothing is scheduled. A fresh session starts from this page, then reads `build-brief.md`.

## Where it stands

- **Gate 2 is passed.** The director took all seven of the report's recommendations, approved the counts, the spine's rules and its four bends, and doesn't want offers aimed for the first playtest. It's recorded in `intent.md` (*Direction from gate 2*).
- **Their rulings are applied,** by hand, to the cards, the spine, `fill/shared.md` and two lines of `docs/gear-design/builds.md`:
  - a spell paid in life costs half the share (Flagellant's vestments, The covenant, The chalice, Heart of the saint);
  - the shatter bell rings the slowest ability that deals damage (Floe charm, Frozen tome, Icefall's Breaker);
  - someone always stands in the light, with the gap closed (Decoy's card says it);
  - a Crescendo's price is two fifths more cost a stack (Crescendo charm);
  - Thunderhead maul reads its basic attacks alone;
  - the riposte is its keystone and a Shield on the dodge (`builds.md`);
  - Frost fist stays as written.
- **The design is in three places:** `spine.md` (one line an item, its rules and the code support by number), `fill/` (eight shares, 417 entries: every card, stat step and number), and the rulings (`fill/shared.md`, `fill/round-1.md` to `fill/round-3.md`). `npx tsx steps/loot/fill-check.ts` and `npx tsx steps/loot/web-check.ts --write --index` both pass.
- **`report.md` is gate 2 as the director read it.** Its sums for the ruled decisions are from before the rulings; a note at its top says so.

## What's next

**The build:** `build-brief.md`. It starts with the two kit changes, measured on today's game before today's loot goes; then the code support by one lead; then the content a file at a time; then tags, parties, tools and documents; then the measuring and the report. It ends when the director plays it.

## One thing read, not ruled

The director didn't name the mirror's two readings. The lead took "ok with your rules" to cover it, so the fill keeps pieces of each. `intent.md` says so, and the director can say otherwise.

## What it cost, for whoever runs the next agents

- **Each fresh reader used about half a million tokens** and took 20 to 25 minutes. They ran one at a time, each writing its file as it went.
- **Rulings were applied by hand** from the lead's session, a field at a time, searching for an entry by name. It's cheaper than bringing an agent back for a word.
- **The build is bigger than the fill.** `build-brief.md` says how to split it into sessions.
