# The fresh read: two briefs

For two readers who haven't seen the design. Each writes one file and changes nothing else. Run them one at a time. Each writes its file as it goes, a part at a time, so a reader that's stopped early leaves what it has found.

## Both read first

1. `CLAUDE.md`, `docs/primer.md`, `docs/rules.md`.
2. `docs/gear-design/philosophy.md`: *What makes a piece good*, *Rarity*, *How it reads*. `docs/gear-design/loot.md`: the rarity table, *Sizes, for new pieces*, *Rules for writing pieces*.
3. `docs/core-set/rules-and-vocabulary.md`: *Targeting*, *Damage*, the statuses and special stats, *Weapons*, *Gear*. The table of classes at the top of `docs/core-set/classes.md`.
4. In `steps/loot/`: `intent.md`; `spine.md`: *How to read it* and all of *The rules*; `fill/shared.md`, which ends with both rounds' rulings. Rounds 1 and 2 are applied to every entry; each file's *Challenges* says what was ruled, so don't report what's ruled there.

Neither judges strength: nothing is balanced, on purpose, and synergies may be overpowered. Neither proposes caps or redesigns an item. Neither commits, runs anything that writes, or hands its work to another agent.

## The item reader

Reads every entry in the eight share files in `fill/`, the commons included, then each file's closing sections, so it doesn't repeat what's flagged. For each card it asks, as a player meeting it in an offer of three:
- Do I know what will happen? Is a word undefined, or used differently from the spine's *New words*, `fill/shared.md` or the vocabulary's target phrases?
- Does the card say what the piece is for, or name a build, an engine or a partner?
- Does it break a rule: a status at other than its own length or numbers, an amount with no scaling, a counter not written to its definition?
- Does the entry do what its line in the spine says, at its kind and rarity?
- Could every class that wears it use it? Do its steps suit it? Is its size one the player would see?
- Does it read the same, or nearly, as another item, above all one the same unit could wear?

It writes `fill/fresh-read-items.md`: findings share by share (only the items with something wrong, and the fix if it's plain); the cards that read alike across the fill; words used two ways; and the fifteen items it's least sure of, a few of the best among them.

## The engine reader

Also reads `docs/gear-design/builds.md` (*What every build asks of the loot* and all of *Engines*), the spine's *Each engine's link* and *Least sure*, the last section of `index.md` (each engine's parts by share), `content/core-set/scale.ts` for what a word is as a number, and `state-of-play.md` (*In brief*, and *Statuses are the damage the player watches; small triggers vanish*).

For each of the twenty-eight engines it finds every part's entry in the fill by name and reads them together with the kit abilities the link names. From the numbers on the entries it works out whether the two sides meet at the size the link's *Sized so* names, in a fight of 20 to 60 ticks. For each: meets, doesn't meet or can't tell, with the sum in a sentence or two; any part whose card would stop the engine working or keep a player from finding it; any loop across the parts with a weak brake or none, beyond those already listed.

Then it picks the director's sample: about twenty-four items across every slot, every rarity, formations at each rarity, versions, a mythic that changed and one that was kept, and the two kit changes. It weights the sample toward what's least sure (each file's *Least sure* and *Challenges*, the spine's *Least sure*, its own doubts) and includes several of the best.

It writes `fill/fresh-read-engines.md`: the engines in the spine's order, led by a count; any new loops; and the sample in full sentences: what each item is and who wears it, what it does (its card and its stats), and what there is to judge, saying whether it's there as a doubt or as one of the best.
