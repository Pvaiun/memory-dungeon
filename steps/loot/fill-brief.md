# The fill: one brief for every agent

A draft by the spine's lead. The fill's lead checks it before any agent reads it.

You're writing the cards for one share of a game's loot. The design is done: `spine.md` says what every item does, its kind and its rarity. Your job is to turn each line of your share into something the game could be built from: the words a player reads, the stats, the first numbers, and what the code needs. You don't redesign a line. Where a line can't be written as it stands, you say so.

Other agents are writing the other shares at the same time, from this same brief.

## Read first

In this order. The documents hold the rules; this brief doesn't restate them.

1. `CLAUDE.md`, `docs/primer.md`, then `docs/rules.md`, all of it.
2. `docs/gear-design/philosophy.md`: *What makes a piece good*, *Rarity*, *Slots*, *How it reads*, and the section for what your share holds (*Formations*, *Upgrades*, *Mythics*).
3. `docs/gear-design/loot.md`: the rarity table, *Sizes, for new pieces*, *Rules for writing pieces*, and the section for what your share holds.
4. `docs/gear-design/builds.md`: *What every build asks of the loot*, the roads your items are tagged for, and the entry for every engine your items are part of.
5. `docs/core-set/rules-and-vocabulary.md`: the statuses and what each does, *Weapons* and *Gear* (each kind's swing, budget, signature and common stats, and who wears it). `docs/core-set/classes.md` for the kit of every class that wears your kinds, or whose versions and mythics are yours.
6. In this folder: `intent.md`; then `spine.md`: *How to read it*, all of *The rules*, your share's lines, and under *Each engine's link* every engine your items are part of; then `index.md`: your share, and the one-line effect of every item in the other shares.
7. `steps/loot/state-of-play.md`, the section *Statuses are the damage the player watches; small triggers vanish*.
8. Today's cards, for the lines that keep a piece of today's: `npx tsx tools/loot-list.ts` writes `out/loot-list.md`.

## What each item gets

Write every item in your share, the commons included. For each:

- **Its name.** Keep the spine's working name. If it clashes with another name or misleads, keep it and propose another under your challenges.
- **Its card text:** what the player reads. It says what the piece does and who can wear it, never what it's for, and never names an engine, a road or a partner. Every effect is phrased so the player knows what will happen, at whatever length that takes. Use the phrases defined under *New words* in the spine word for word, and the target phrases in *Core set: rules and vocabulary* word for word.
- **Its stat steps,** within its kind's budget at its rarity (`KIND_BUDGET` and `KIND_WORDS` in `content/core-set/scale.ts`; an armor, offhand or amulet takes the standard ladder). The signature stat comes first, then the stats its kind leans to. Within that the choice is yours and it's part of the design: the kind's header in the spine says what its stats lean to on each road, and a piece's steps should make it the careful pick on the road it serves. A common is its stats and nothing else, by the rule in its kind's row of the spine's table.
- **Its numbers,** as first values from `loot.md`'s *Sizes*. They aren't limits, and nothing here is balanced: a synergy may be overpowered. Two things hold whatever the first value:
  - **A road's first step and an engine's part are sized to be seen** the first time they fire. The spine's line says what the player sees; pick a size at which they would.
  - **A status keeps its own numbers and its own length.** A piece decides who gets a status and when, and how many stacks of it, and nothing else about it.
- **Its code support,** by its number in the spine's list. If it needs something the list doesn't have, say what, in a sentence.
- **Its roads and engines,** copied from its line. This is the designer's data, kept beside the card and never on it.

**A line that keeps one of today's** (a version or a mythic marked kept, or a piece the spine says is today's) starts from today's card. Change it only as far as its line says, or where today's size is one the player wouldn't see happen, and say which you did.

## Where an item is part of an engine

Read the engine's link in the spine. It says what one part makes, what the other reads, and what the link is sized to do. Size your side toward that, and in your notes say what the other side would have to be for the two to meet. The other half may be in another agent's share: `index.md` says which. No card names its partner.

## What you don't do

- **Don't change what a line does,** its kind or its rarity. If it can't be written, breaks a rule, has no wearer who could use it, or reads the same as an item in the index, write it as closely as you can and challenge it.
- **Don't add or cut items.**
- **Don't make a balancing rule.** No caps, limits or exceptions added to keep something from being strong.
- **Don't write from another share's line.** The index is there so you know what the others hold, not so you can write it.

## Loops

For every item, ask what could set it off again: its own effect, something else its wearer could hold, or something an ally does. If a chain can turn over without end, or its only brake is weak, report it with the items in it and what stops it. Don't fix it by a new rule; report it. An effect that repeats something (a blow that lands again, an ability cast again, an effect that happens again) says on its card whether the repeat can itself repeat: the spine's rules under *Chains end*, and its string of shatters, are what the card says.

## What you return

One file, named for your share in `index.md` (`steps/loot/fill/…`), holding every item of your share in the spine's order, each with the six things above. Then, at its end:

- **Challenges:** every line you couldn't write as it stands, and why. Wrong wearers, a broken rule, two cards that read alike, a line that's unclear, a name to change.
- **Links:** for each engine your share touches, the size you gave your side and what the other side needs.
- **Loops:** each one you found, and its brake.
- **Code support beyond the spine's list.**
- **Least sure:** the items you'd want a second pair of eyes on, and why.

The lead rules on your challenges, and you apply the rulings to your own file.
