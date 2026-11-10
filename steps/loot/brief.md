# The loot pass: a brief for a fresh session

Nov 10, 2026. The builds (`docs/gear-design/builds.md`, approved) hand off to the loot. This pass designs; nothing is built, and it ends at its gates. **Gate 1 is passed: the spine is written and the director has ruled on it. This session starts at step 2, the fill.** The build and test get a brief of their own after gate 2. When it's built, Marked and Malison go in, each measured against today's game with both versions' numbers.

In this brief an **engine** is always one of `builds.md`'s found synergies. What the game's code needs for an item is its **code support**.

## The director's intent

In `intent.md` in this folder: the formations, gear, upgrade changes and kit changes the nine builds need, by the method in `docs/gear-design/philosophy.md` (*How the loot is made*, steps 3 to 5), and their direction from gate 1. The standing intent is `philosophy.md`'s *The director's intent*.

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
- **`loot.md`'s rules:** what each rarity carries, the stat ladder, the sizes for new pieces and the rules for writing pieces. Its sizes are first values, not limits, and synergies may be overpowered.
- **The slots and kinds:** who wears what, two-handers, and each kind's budget, signature and common stats (*Core set: rules and vocabulary*, Gear and Weapons).
- **The class frame:** a trunk and three identities, each viable, with at least two versions toward it; no two classes share a base ability; a passive works in every fight; no class gains an ability.
- **`docs/gear-design/builds.md`, all of it:** the nine builds, their far ends, the doors and the engines.
- **Nothing rests on a foe's MP.**
- **The spine** (`spine.md`): what each item does, its kind and rarity, and the stock. The fill writes to it. A line changes only by a ruling.
- **The director's rulings at gate 1** (`intent.md`): one Mark from gear; Malison counts five statuses; Hearth stays as it is, as a common; an upgrade never copies a piece, two pieces one unit could wear together never read the same, and a piece and a formation seat may share a rule.

## What the builds ask of the loot

The spine answers these, the fill has to keep answering them, and `builds.md` says each in full:
- **Each road's** *Through a run* (its sign, its build and its far end, against acts I, II and III) and its *Needs*.
- ***What every build asks of the loot*:** a first step that's seen the first time it fires, a first step that doesn't cost the party its safety, and a formation about one thing. **Seen** is a size: a first step, and an engine's common half, are sized so the player sees them happen. In play, the small end of today's sizes was never seen to fire (`state-of-play.md`, *Statuses are the damage the player watches; small triggers vanish*). An uncommon's effect is small in scope, one simple thing on one thread, not in size.
- ***What a formation has to be*:** about one thing, a promise in plain words, seats many classes can fill, and one for each phase of each road.
- **The engines:** *What the set asks of the loot* and *Parts that recur*. The common half sits in the kits, commons and uncommons; every keystone comes from more than one place. A mythic may be an engine on its own.
- **The doors:** each has pieces both sides want.
- ***Every class in the set*,** and its notes for the upgrades.

## Where it stands

- **`spine.md`** is the design, one line an item: its rules (the stock by kind and rarity with the why of each kind, the new words, the rules the pieces bend, the code support by number), the two kit changes, the parts that recur, every uncommon, rare and legendary piece, the formations, the versions that change, the mythics, a table of commons and uncommons by kind, each engine's link with what the fill sizes it to do, and the web's checks. It's two leads' spines merged on the director's rulings, and a fresh reader has read it twice.
- **Its tables are generated.** `npx tsx steps/loot/web-check.ts --write` reads the lines' tags and rewrites the tables between the spine's markers; `--index` writes `index.md`. Run both after any change to a line. It fails on a tag it doesn't know or a name used twice.
- **Offer volumes are counted,** not estimated: `npx tsx steps/loot/offer-count.ts` plays 40 simulated runs and prints what a run is offered in each act. Its figures are in `web-check.ts` (`RUN`).
- **Open for the director:** the list at the end of `spine.md`. None of it stops the fill. Ask at gate 2, or sooner if a ruling would change a share.
- **Where the lead's first round starts:** *Least sure* in the spine lists the loops known and the pairs the second fresh read found alike and the spine left, by its reading of the director's ruling.
- **`fill-brief.md` and `index.md` are drafted** by the spine's lead, for the fill's lead to check and change before any agent reads them.

## How to work

**1. The spine** is written and past its gate (*Where it stands*).

**2. The fill, in parallel.**
- **One brief for every agent,** `fill-brief.md` in this folder, with intent and ranges, never examples: an agent copies any example it's given. It points at `docs/rules.md`, `philosophy.md` and `loot.md` rather than restating them. A brief's own paraphrase of a rule is where a fill goes wrong.
- **The agents:** the lead gives agents bounded shares: a slot's kinds, the formations, or a group of classes' versions and mythics. `index.md` proposes eight.
- **A shared index, before anyone writes:** `index.md`, every share's items with a one-line effect each, and for each engine, its parts and which share holds each. It's what keeps two shares from writing the same card. An agent writing one half of an engine also learns from it what the other half reads.
- **What each item gets:**
  - its card text;
  - its stat steps, within its kind's budget;
  - its numbers, from `loot.md`'s sizes as first values, with a first step sized to be seen;
  - the code support it needs, by its number in the spine;
  - the roads and engines it serves (designer data, never on a card).
- **What each agent returns:** its challenges, what it's least sure of, the loops it found, and any code support beyond the spine's list.
- **Rulings, in rounds.**
  - The lead reads the whole fill as one design, checks it against the spine and the web, and rules on every challenge.
  - A ruling is about loops, overlaps, broken rules, wrong wearers or unclear cards, never strength. Synergies may be overpowered, and the balance pass has its own levers.
  - **Loops get their own check.** Each agent reports any chain in its share that can set itself off again, and what stops it. The lead checks across shares, since most loops span two. The ones known, with what stops each, are under *Least sure* in the spine, and the spine's rules under *Chains end* are what the cards say.
  - **Alike cards follow the director's ruling** (*What's settled*). The index is where two shares see they're about to write the same card.
  - A ruling that changes what a line does changes the line in `spine.md`, and the tables are regenerated.
  - The agent that wrote a file applies its rulings, so its context is kept.
  - Between rounds, a fresh reader reads the whole fill, once item by item and once engine by engine, each engine's parts together, to see that they meet at the size its link names.
- **Gate 2:** the director reviews by sample. The fresh reader picks the sample across the range, with the items it's least sure of. The sample is written in full sentences: what each item is and who wears it, what it does, and what there is to judge. Update `intent.md` where the standing intent changes and `CLAUDE.md`'s Status, commit, push and stop.

## Read first

- `CLAUDE.md`, `docs/primer.md` and `docs/rules.md`.
- `docs/gear-design/philosophy.md`, `builds.md` (all of it) and `loot.md`.
- In this folder: `intent.md`, then `spine.md`, then `fill-brief.md` and `index.md`; `state-of-play.md` for what happened in play.
- `docs/core-set/classes.md` and `rules-and-vocabulary.md`; `rogue-mode.md`'s Loot section for the offer roll; `enemies.md` and the rest of `rogue-mode.md` as the work needs them.
- Today's loot, to know what exists rather than to keep it: `npx tsx tools/loot-list.ts` writes `out/loot-list.md`. Open `content/core-set/pieces/`, `formations.ts` and `upgrades/` only for how a particular item works.
