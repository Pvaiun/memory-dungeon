# The fill: one brief for every agent

Drafted by the spine's lead and checked by the fill's lead.

You're writing the cards for one share of a game's loot. The design is done: `spine.md` says what every item does, its kind and its rarity. Your job is to turn each line of your share into something the game could be built from: the words a player reads, the stats, the first numbers, and what the code needs. You don't redesign a line. Where a line can't be written as it stands, you say so.

Other agents are writing the other shares at the same time, from this same brief.

## Read first

In this order. The documents hold the rules; this brief doesn't restate them.

1. `CLAUDE.md`, `docs/primer.md`, then `docs/rules.md`, all of it.
2. `docs/gear-design/philosophy.md`: *What makes a piece good*, *Rarity*, *Slots*, *How it reads*, and the section for what your share holds (*Formations*, *Upgrades*, *Mythics*).
3. `docs/gear-design/loot.md`: the rarity table, *Sizes, for new pieces*, *Rules for writing pieces*, and the section for what your share holds.
4. `docs/gear-design/builds.md`: *What every build asks of the loot*, the roads your items are tagged for, and the entry for every engine your items are part of.
5. `docs/core-set/rules-and-vocabulary.md`: *Targeting* (the target phrases), *Damage*, the statuses and what each does, *Weapons* and *Gear* (each kind's swing, budget, signature and common stats, and who wears it). `docs/core-set/classes.md` for the kit of every class that wears your kinds, or whose versions and mythics are yours.
6. In this folder: `intent.md`; then `spine.md`: *How to read it*, all of *The rules*, your share's lines, and under *Each engine's link* every engine your items are part of; then `fill/shared.md`, all of it; then `index.md`: your share, and the one-line effect of every item in the other shares.
7. `steps/loot/state-of-play.md`, the section *Statuses are the damage the player watches; small triggers vanish*.
8. Today's cards, for the lines that keep a piece of today's and for how a card words an amount: `out/loot-list.md`, already written (search it; don't write it again). An item's numbers today are in `content/core-set/pieces/`, `formations.ts` and `upgrades/`.

## What each item gets

Write every item in your share, the commons included. For each:

- **Its name.** Keep the spine's working name. If it clashes with another name or misleads, keep it and propose another under your challenges.
- **Its card text:** what the player reads. It says what the piece does and who can wear it, never what it's for, and never names an engine, a road or a partner. Every effect is phrased so the player knows what will happen, at whatever length that takes. Use the phrases defined under *New words* in the spine word for word, and the target phrases in *Core set: rules and vocabulary* word for word. Every amount on a card says what it scales from. Who can wear a piece is its kind, which the interface shows: the card doesn't list classes.
- **Its stat steps,** exactly its budget (`fill/shared.md`, *Stats and budgets*). The signature stat comes first, then the stats its kind leans to. Within that the choice is yours and it's part of the design: the kind's header in the spine says what its stats lean to on each road, and a piece's steps should make it the careful pick on the road it serves. A common is its stats and nothing else, by the rule in its kind's row of the spine's table.
- **Its numbers,** as first values from `loot.md`'s *Sizes*, in the scale's words where it has them (`fill/shared.md`, *Words that already have a number*). They aren't limits, and nothing here is balanced: a synergy may be overpowered. Two things hold whatever the first value:
  - **A road's first step and an engine's part are sized to be seen** the first time they fire. The spine's line says what the player sees; pick a size at which they would.
  - **A status keeps its own numbers and its own length.** A piece decides who gets a status and when, and how many stacks of it, and nothing else about it.
- **Its code support,** by its number in the spine's list. If it needs something the list doesn't have, say what, in a sentence.
- **Its roads and engines,** copied from its line. This is the designer's data, kept beside the card and never on it.

**A line that keeps one of today's** (a version or a mythic marked kept, a formation or a piece the spine says is today's) starts from today's card. Change it only as far as its line says, or where today's size is one the player wouldn't see happen, and say which you did.

**The counters are defined once,** in `fill/shared.md`. A card that uses one writes to that definition.

## How an entry is laid out

Every share uses the same layout, so the whole fill reads as one design and a script can check it. One entry an item, in the spine's order, under a heading for its kind (or its rarity, for formations; its class, for versions and mythics).

A piece of gear:

```
### <Name>
- **Is:** <kind> · <rarity>
- **Card:** <the card, as the player reads it; a common's is "Nothing beyond its stats.">
- **Stats:** <stat +n · stat +n · special stat medium> (<steps> of <budget>)
- **Numbers:** <each amount on the card: its word and constant, or its value, and the stat it scales from>
- **Code:** <the spine's numbers; "as today's <item>"; or "none">
- **Serves:** <the line's roads, engines and parts, copied; for a common, the roads whose first stat it carries>
- **Notes:** <only where there's something to say: what you kept or changed from today's and why; why this size is one the player sees; what the other half of its link has to be>
```

- **Stats** are written one way: an amount stat or Crit chance as `HP +1`, `Attack +2`, `Aggro −1`; a special stat as `Evasion medium` or `Lifesteal high`. A piece that steps along the swing trade adds `a heavier swing` or `a lighter swing` to the line, and its card starts with those words.

A formation has no **Stats** line and no budget. Its **Card** is its promise, then each seat as the player reads it, then any rule for the whole party. Its **Numbers** give each seat's words as steps and values.

A version, a mythic or a kit change has no **Stats** line unless its shape needs one. Its **Is** line reads `<Class>, <Ability> <A or B> · version · <changed or kept>`, `<Class> · mythic (<slot>) · <changed or kept>` or `<what it changes> · kit change`. Where an item of today's stands behind it, it adds a line `- **Today:** <today's card, word for word>` above **Card**. A kept item whose card and sizes stay says so in **Notes** and repeats the card.

## Where an item is part of an engine

Read the engine's link in the spine. It says what one part makes, what the other reads, and what the link is sized to do. Size your side toward that, and in your notes say what the other side would have to be for the two to meet. The other half may be in another agent's share: `index.md` says which. No card names its partner.

## What you don't do

- **Don't change what a line does,** its kind or its rarity. If it can't be written, breaks a rule, has no wearer who could use it, or reads the same as an item in the index, write it as closely as you can and challenge it.
- **Don't add or cut items.**
- **Don't make a balancing rule.** No caps, limits or exceptions added to keep something from being strong. A counter's ceiling in `fill/shared.md` is its definition, not yours to add to.
- **Don't write from another share's line.** The index is there so you know what the others hold, not so you can write it.
- **Don't touch a file that isn't yours.** Seven other agents are working in this folder. Write your own file and nothing else: not the spine, the index, another share, the content or the documents. Don't run anything that writes (`npm run content`, `web-check.ts --write`), don't commit, and don't hand your share on to another agent.

## Loops

For every item, ask what could set it off again: its own effect, something else its wearer could hold, or something an ally does. If a chain can turn over without end, or its only brake is weak, report it with the items in it and what stops it. Don't fix it by a new rule; report it. An effect that repeats something (a blow that lands again, an ability cast again, an effect that happens again) says on its card whether the repeat can itself repeat: the spine's rules under *Chains end* are what the card says. The damping of a chain of shatters is never on a card.

## What you return

One file, named for your share in `index.md` (`steps/loot/fill/…`), holding every item of your share in the spine's order, laid out as above. Then, at its end, under these five headings:

- **Challenges:** every line you couldn't write as it stands, and why. Wrong wearers, a broken rule, two cards that read alike, a line that's unclear, a name to change, a definition in `fill/shared.md` that doesn't fit a card.
- **Links:** for each engine your share touches, the size you gave your side and what the other side needs.
- **Loops:** each one you found, and its brake.
- **Code support beyond the spine's list.**
- **Least sure:** the items you'd want a second pair of eyes on, and why.

The file is what you hand in. Your last message to the lead is a few lines: that it's written, how many items, and the two or three challenges that matter most. The lead rules on your challenges, and you apply the rulings to your own file.
