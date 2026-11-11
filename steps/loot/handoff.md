# The loot pass: handoff, at gate 2

Nov 11, 2026. The fill is written, ruled and read fresh, and the pass is stopped for the director. Nothing is running, and nothing is scheduled. A fresh session starts from this page.

## Where it stands

- **`report.md` is what the director reads:** the decisions needed, what stands unless they say otherwise, what the two fresh reads found, and a sample of twenty-five items in full sentences.
- **The fill** (`fill/`, eight shares, 417 entries) has every item's card, stat steps, numbers, code support and tags. `npx tsx steps/loot/fill-check.ts` is clean: every item once, at its kind and rarity, every piece on exactly its budget, no name twice. Its one listing is Frostbite bow and Sleet blade, which no unit can hold together.
- **Three rounds of rulings are applied:** `fill/round-1.md`, `fill/round-2.md` and `fill/round-3.md`, share by share, and `fill/shared.md` for what reaches every share. Each share's *Challenges* marks what rounds 1 and 2 ruled. Rounds 2 and 3 were applied by hand.
- **Two fresh reads are in:** `fill/fresh-read-items.md` (every card, 50 findings, ruled in round 3) and `fill/fresh-read-engines.md` (each engine's parts together: 25 of 28 meet; its last section is the sample).
- **The spine carries every line a ruling changed,** and its tables and `index.md` are regenerated (`npx tsx steps/loot/web-check.ts --write --index`).

## Once the director rules

1. **Record their rulings** in `intent.md`, under a heading for gate 2, short, quoting them only where the wording matters.
2. **Apply each ruling by hand** to the fill and the spine, then run both checks. None needs the fill's agents back. What each of the report's decisions touches:
   - *The price of a spell paid in life:* the cards of Flagellant's vestments, The covenant, The chalice and Heart of the saint, the blood mage's link in the spine, and the sums in the armor and formations shares' *Links*.
   - *Which ability the shatter bell rings:* Floe charm, Frozen tome and Icefall's Breaker, the phrase under *New words* in the spine, the bell's link, the Floe charm loop in the spine's *Least sure*, and one line of `docs/gear-design/builds.md`.
   - *Hidden's rule:* the vocabulary when it's built; the notes of Decoy, Swan's grace and Feathered cloak.
   - *The crescendo's price:* Crescendo charm's card and the link.
   - *The riposte:* `builds.md`'s "enough to see it". The spine's link already says what the cards do.
   - *Frost fist:* its numbers in the versions share.
   - *Lightning-glass and Thunderhead maul:* the maul's card and its line.
3. **Then the build's brief.** The build and test get a brief of their own (`brief.md` says so): the code support by number from the spine, the build test's parties rewritten for the nine builds, Marked and Malison each measured against today's game with both versions' numbers, and whether offers are aimed by the tags, if the director rules that they are.
4. **When the step closes,** fold what lasts into `docs/gear-design/` and `docs/rules.md`, and delete this folder.

## What it cost, for whoever runs the next agents

- **Each fresh reader used about half a million tokens** and took 20 to 25 minutes. They ran one at a time, each writing its file as it went.
- **The engine reader looked parts up by name** in place of reading the shares whole, and that was enough. A reader that has to see every card can't avoid reading all eight files.
- **Rulings were applied by hand** from the lead's session, a field at a time, searching for an entry by name. It's cheaper than bringing an agent back for a word.
