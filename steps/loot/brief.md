# The loot pass: a brief for a fresh session

Nov 10, 2026. The builds (`docs/gear-design/builds.md`, approved) hand off to the loot. This pass designs; nothing is built, and it ends at its gates. Its build and test get a brief of their own after gate 2. When it's built, Marked and Malison go in, each measured against today's game with both versions' numbers.

In this brief an **engine** is always one of `builds.md`'s found synergies. What the game's code needs for an item is its **code support**.

## The director's intent

In `intent.md` in this folder: the formations, gear, upgrade changes and kit changes the nine builds need, by the method in `docs/gear-design/philosophy.md` (*How the loot is made*, steps 3 to 5). The standing intent is `philosophy.md`'s *The director's intent*.

## The task

- **Gear:** every piece of every kind, at every rarity, and the 16 mythics, designed again. Nothing earns a place by already existing; a piece of today's that serves a road or an engine may stay because it does.
- **Stats:** every piece's stat steps, set piece by piece. Today's are a first assignment by rule. A piece's steps stay within its kind's budget and lean to its kind's signature and common stats. Within that, they're part of the design: they're how a first step can also be the careful pick.
- **Formations:** common, rare and legendary, designed again.
- **Upgrades:** each ability's and passive's power step and two versions, changed where the roads and engines ask. A version that already serves a road can stay.
- **Base kits:** changed only where a road or an engine needs it. The two approved changes are part of this: Marked takes the party's random picks, and the Hexer's Malison pays for breadth.

It's all designed at once, so every item is judged by the roads and engines it serves and against the items that serve the others.

## What's settled

- **`docs/rules.md`, all of it.** That includes: nothing in the vocabulary is locked to one class, so Aegis and Hidden can appear on gear, formations and other kits; enemy-only statuses stay the enemies'; statuses keep their own lengths and behaviour; no balancing rules while making content.
- **`philosophy.md`:** what makes a piece good, rarity, slots, formations, upgrades and mythics, and how a card reads.
- **`loot.md`'s rules:** what each rarity carries, the stat ladder, the sizes for new pieces and the rules for writing pieces. Its sizes are first values, not limits, and synergies may be overpowered. Its stock, its counters, its table of commons and uncommons by kind, and the decisions it lists as lines to change are open to the spine.
- **The slots and kinds:** who wears what, two-handers, and each kind's budget, signature and common stats (*Core set: rules and vocabulary*, Gear and Weapons).
- **The class frame:** a trunk and three identities, each viable, with at least two versions toward it; no two classes share a base ability; a passive works in every fight; no class gains an ability.
- **`docs/gear-design/builds.md`, all of it:** the nine builds, their far ends, the doors and the engines. If the spine shows something in it doesn't hold, raise it at gate 1 with the evidence rather than working around it.
- **Nothing rests on a foe's MP:** the two versions that drain it (`builds.md`, *Every class in the set*) are mana gain for their user, and stay as that.

## What the builds ask of the loot

The spine answers these, and `builds.md` says each in full:
- **Each road's** *Through a run* (its sign, its build and its far end, against acts I, II and III) and its *Needs*.
- ***What every build asks of the loot*:** a first step that's seen the first time it fires, a first step that doesn't cost the party its safety, and a formation about one thing. **Seen** is a size: a first step, and an engine's common half, are sized so the player sees them happen. In play, the small end of today's sizes was never seen to fire (`state-of-play.md`, *Statuses are the damage the player watches; small triggers vanish*). An uncommon's effect is small in scope, one simple thing on one thread, not in size.
- ***What a formation has to be*:** about one thing, a promise in plain words, seats many classes can fill, and one for each phase of each road.
- **The engines:** *What the set asks of the loot* and *Parts that recur*. The common half sits in the kits, commons and uncommons; every keystone comes from more than one place; the parts that recur are written first. A mythic may be an engine on its own.
- **The doors:** each has pieces both sides want.
- ***Every class in the set*,** and its notes for the upgrades.

## The amounts

Every amount is chosen by what the roads and engines need, not by a quota: how many pieces a kind holds, how many formations there are, how many versions and kits change. Too much is better than too little.

The spine states the counts it chose, kind by kind and rarity by rarity, and why. An offer picks a piece from within one kind at one rarity, so the more pieces a kind holds at a rarity, the less often each of them is met.

## How to work

**1. The spine, by the lead alone,** in `spine.md` in this folder.
- **Today's loot from its list.** `npx tsx tools/loot-list.ts` writes every item as one line, with its card and the builds it was tagged for (`out/loot-list.md`). Read that, not the content files.
- **The rules, first:** the stock it chose (kind by kind, by rarity); new words and counters; the rules the pieces bend or add; and the code support the design needs, listed once so the fill can name it. `builds.md`'s *Across the web* names the rule changes the engines need. Gate 1 reads this section.
- **One line per item:** every rare and legendary piece, every formation, every changed version, every mythic and every kit change. Each line says what the item does in plain words, its kind and rarity, the roads, rungs and engines it serves, and how much it's worth to each. A road's first step and an engine's part also say, in a few words, what the player sees when it fires.
- **Commons and uncommons by kind,** in one table. Commons get a rule per kind. Each uncommon's effect is named, because the uncommons carry the roads' first steps and the engines' common halves, and the web has to be able to see them. Each kind's row also says what its pieces' stats lean to on each road.
- **Each engine's link,** in plain words: for an engine whose parts can sit in different places, what one part makes and what the other reads. The fill sets the numbers on both sides of that link.
- **The order:**
  1. The kit changes the builds already name: Marked and Malison. Versions are versions of kit abilities, and the kits hold every road's sign, so everything after reads them.
  2. The parts that recur.
  3. The rest of the gear and formations.
  4. The versions and the mythics. They read what's written before them, so nothing repeats a piece.
  5. Any kit change the gaps call for. Then that class's lines are read again against it.
- **Then check the web across all nine roads:**
  - every rung of every road is reachable by more than one route;
  - every engine's keystone comes from more than one place, and its common half is close at hand;
  - every door has pieces both sides want;
  - there are exotics that belong to no road;
  - nothing is fenced off;
  - each road's sign can be read in act I, with what act I gives: a weapon on nearly every unit, the other slots rarely filled, an ability or two, mostly Neutral (`state-of-play.md`);
  - **each road's sign and each engine's keystone is met often enough.** That a route exists isn't enough: in play, routes the old web counted were rarely met. For each one, work out roughly how often a run is offered it, from:
    - its rarity and its slot;
    - the chance a class that wears its kind is in the party, and that wearer's other kind in the same slot;
    - how many pieces share its kind and rarity.

    The offer roll is in `docs/core-set/rogue-mode.md` (Loot), its weights in `content/core-set/rogue.ts` (`slots`, `spoils.fight.rarity`). An engine's two halves have to meet, so its common half should be the one most runs see. Flag the ones a run would rarely be offered. Count by hand, or with a small script over the spine's tags.
- **A fresh reader** reads the spine before the gate, against `builds.md` and this brief. It takes no part in writing the spine.
- **Gate 1:** the director reads the spine's rules, the web and a sample, with what you're least sure of. The report leads with the decisions: the counts chosen and anything in `builds.md` the spine shows doesn't hold. Commit and push the spine, update `CLAUDE.md`'s Status, and stop.

**2. The fill, in parallel,** after gate 1.
- **One brief for every agent,** `fill-brief.md` in this folder, written from the spine with intent and ranges, never examples: an agent copies any example it's given. It points at `docs/rules.md`, `philosophy.md` and `loot.md` rather than restating them. A brief's own paraphrase of a rule is where a fill goes wrong.
- **The agents:** the lead gives agents bounded shares: a slot's kinds, the formations, or a group of classes' versions and mythics.
- **A shared index, before anyone writes:** every share's items with a one-line effect each, and for each engine, its parts and which share holds each. It's what keeps two shares from writing the same card. An agent writing one half of an engine also learns from it what the other half reads. Start it from the spine and `out/loot-list.md`.
- **What each item gets:**
  - its card text;
  - its stat steps, within its kind's budget;
  - its numbers, from `loot.md`'s sizes as first values, with a first step sized to be seen;
  - the code support it needs;
  - the roads and engines it serves (designer data, never on a card).
- **What each agent returns:** its challenges, what it's least sure of, and any code support beyond the spine's list.
- **Rulings, in rounds.**
  - The lead reads the whole fill as one design, checks it against the spine and the web, and rules on every challenge.
  - A ruling is about loops, overlaps, broken rules, wrong wearers or unclear cards, never strength. Synergies may be overpowered, and the balance pass has its own levers.
  - The agent that wrote a file applies its rulings, so its context is kept.
  - Between rounds, a fresh reader reads the whole fill, once item by item and once engine by engine, each engine's parts together, to see that they meet.
- **Gate 2:** the director reviews by sample. The fresh reader picks the sample across the range, with the items it's least sure of. Update `intent.md` where the standing intent changes and `CLAUDE.md`'s Status, commit, push and stop.

## Read first

- `CLAUDE.md`, `docs/primer.md` and `docs/rules.md`.
- `docs/gear-design/philosophy.md`, `builds.md` (all of it) and `loot.md`.
- In this folder: `intent.md`, then `state-of-play.md` for what happened in play.
- `docs/core-set/classes.md` and `rules-and-vocabulary.md`; `rogue-mode.md`'s Loot section for the offer roll; `enemies.md` and the rest of `rogue-mode.md` as the work needs them.
- Today's loot, to know what exists rather than to keep it: `out/loot-list.md`. Open `content/core-set/pieces/`, `formations.ts` and `upgrades/` only for how a particular item works.
