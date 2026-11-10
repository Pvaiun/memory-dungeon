# The loot pass: a brief for a fresh session

Nov 10, 2026. The builds design in this folder (`design.md`) hands off to the loot. This pass designs; nothing is built, and it ends at its gates. Its build and test get a brief of their own after gate 2.

## The director's intent for this pass

- **Design the formations, the gear, the upgrade changes and the base-kit changes the builds need,** from `design.md`: its nine roads, its doors and its twenty-eight engines.
- **Kick it off as the last loot design was:** one lead designer writes the spine, the director reads it at a gate, and parallel agents fill it in. That's the method in `docs/gear-design/philosophy.md` (*How the loot is made*), steps 3 to 5.
- The standing intent holds: the director's words in `philosophy.md` (*The director's intent*) and in `intent.md` here.

## The task

- **Gear:** every piece of every kind, at every rarity, and the 16 mythics, designed again. Nothing earns a place by already existing; a piece of today's that serves a road or an engine may stay because it does.
- **Formations:** common, rare and legendary, designed again.
- **Upgrades:** each ability's and passive's power step and two versions, changed where the roads and engines ask. A version that already serves a road can stay.
- **Base kits:** changed only where a road or an engine needs it. The two approved changes are part of this: Marked takes the party's random picks, and the Hexer's Malison pays for breadth.

It's all designed at once, so every item is judged by the roads and engines it serves and against the items that serve the others.

## What's settled

- **`docs/rules.md`, all of it.** That includes: nothing in the vocabulary is locked to one class, so Aegis and Hidden can appear on gear, formations and other kits; enemy-only statuses stay the enemies'; statuses keep their own lengths and behaviour.
- **`philosophy.md`:** what makes a piece good, rarity, slots, formations, upgrades and mythics, and how a card reads.
- **`loot.md`'s rules:** what each rarity carries, the stat ladder, the sizes for new pieces and the rules for writing pieces. Its stock, its counters and the decisions it lists as lines to change are open to the spine.
- **The slots and kinds:** who wears what, two-handers and the signature stats (*Core set: rules and vocabulary*, Gear and Weapons).
- **The class frame:** a trunk and three identities, each viable, with at least two versions toward it; no two classes share a base ability; a passive works in every fight; no class gains an ability.
- **`design.md`'s rulings** (*Where it stands*). Its own unconfirmed choices (the nine builds, the Storm's hook, the Hunt led by the Mark, the far ends, the engines) are the base. Build on them. If the spine shows one doesn't hold, raise it at gate 1 with the evidence rather than working around it.

## What the design asks of the loot

The spine answers these, and `design.md` says each in full:
- **Each road's** *Through a run* (its sign, its build and its far end, against acts I, II and III) and its *Needs*.
- ***What every build asks of the loot*:** a first step that's seen the first time it fires, a first step that doesn't cost the party its safety, and a formation about one thing.
- ***What a formation has to be*:** about one thing, a promise in plain words, seats many classes can fill, and one for each phase of each road.
- **The engines:** *What the set asks of the loot* and *Parts that recur*. The common half sits in the kits, commons and uncommons; every keystone comes from more than one place; the parts that recur are written first. A mythic may be an engine on its own.
- **The doors:** each has pieces both sides want.
- ***Every class in the set*,** and its notes for the upgrades.

## The amounts

Every amount is chosen by what the roads and engines need, not by a quota: how many pieces a kind holds, how many formations there are, how many versions and kits change. Too much is better than too little.

## How to work

**1. The spine, by the lead alone,** in `spine.md` in this folder.
- **One line per item:** every rare and legendary piece, every formation, every changed version, every mythic and every kit change. Each line says what the item does in plain words, its kind and rarity, the roads, rungs and engines it serves, and how much it's worth to each.
- **Commons and uncommons** get a rule per kind, not lines.
- **The order:** the parts that recur first, then the rest of the gear and formations, then the class-facing items (versions, mythics, kit changes). The class-facing items read what's written before them, so nothing repeats a piece.
- **Then check the web across all nine roads:**
  - every rung of every road is reachable by more than one route;
  - every engine's keystone comes from more than one place, and its common half is close at hand;
  - every door has pieces both sides want;
  - there are exotics that belong to no road;
  - nothing is fenced off;
  - each road's sign can be read in act I.
- **Gate 1:** the director reads the spine's rules, the web and a sample, with what you're least sure of. Stop there.

**2. The fill, in parallel,** after gate 1.
- **The agents:** the lead gives agents bounded shares: a slot's kinds, the formations, or a group of classes' versions and mythics. Brief each from the spine with intent and ranges, never examples: an agent copies any example it's given.
- **What each item gets:** its card text, its numbers within `loot.md`'s sizes, the engine support it needs, and the roads and engines it serves (designer data, never on a card).
- **What each agent returns:** its challenges, and what it's least sure of.
- **Bringing it together:** the lead reads the whole fill as one design, checks it against the spine and the web, and has a fresh reader read it.
- **Gate 2:** the director reviews by sample. Update `intent.md` where the standing intent changes and `CLAUDE.md`'s Status, commit, push and stop.

## Read first

- `CLAUDE.md`, `docs/primer.md` and `docs/rules.md`.
- `docs/gear-design/philosophy.md` and `loot.md`. Not `builds.md`: it describes the twelve builds this design replaces.
- In this folder: `intent.md`, then `design.md`, all of it, then `state-of-play.md` for what happened in play.
- `docs/core-set/classes.md` and `rules-and-vocabulary.md`; `enemies.md` and `rogue-mode.md` as the work needs them.
- Today's loot, to know what exists rather than to keep it: `content/core-set/pieces/`, `formations.ts` and `upgrades/`.
