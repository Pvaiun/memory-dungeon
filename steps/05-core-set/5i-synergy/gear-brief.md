# Step 5i: the gear slots, a brief for a fresh session

Rewritten Oct 29, 2026, at the director's word, after a first session overthought this and missed it. Where this brief and `intent.md` differ, `intent.md` wins.

## The task

Decide, for the rogue's four gear slots (weapon, armor, offhand, amulet), **which classes share which kinds of loot.** That's all. Bring it to the director as proposal, at a gate. No pieces are designed here.

## The director's framing (the gist of what's wanted)

- **Slots have no job.** Special effects, the crux of the system, have no tie to a slot: any kind of effect can be on any slot. Stats lean softly by slot (Armor more often on armor, damage on weapons), and with four slots that barely matters. Don't define what each slot is "for": that makes every build the same shape.
- **Only weapons carry inherent behaviour:** speed and damage type (physical or magical). Every other slot is open for anything. So weapon pairings need the most intent: good variety within a class (not every weapon a class holds fills the same role) and between classes (not every class has the same pattern of weapons).
- **The real question is how wide each slot's pool is.**
  - The fewer classes a kind of loot touches, and the more alike they are, the more its effects can be made to work with those classes and with the other loot those classes wear.
  - Too separated, and there are too many bespoke pieces and looting becomes impossible.
  - Too shared, and looting gets confusing and the design muddy, with everything needing to work with everything.
  - Judge it by combinations: does each class have enough of its own loot to build sensible combinations, while unreasonable ones stay apart? And since loot is biased toward the classes you own, are good combinations likely to be found?
- **Armor** is themed by weight. Four types is a good number (three or five would also be fine).
- **Weapons** have speed and damage type, so some mesh with some builds more than others. A few kinds per class is easy to justify thematically, and it can be fairly random (a staff and a sword on one class is fine) as long as it's slightly justifiable.
- **The offhand** is undesigned: a free-for-all. Invent whatever theme fits the pairing you want. It exists to give specific classes another vector for more specific behaviour, so expect several kinds, each shared by few classes.
- **The amulet** is shared by nature, a muddy design space. Decide whether that's acceptable, or what to do about it.
- **Staves** right now are 7 weapon kinds with very similar properties to other weapons, except they deal magic damage with an element. Elements are gone (below), so is magical damage something that should be a property of any weapon? Or should we imagine separate magical versions of regular weapons? Or something else? We need a cleaner design than what's in the build. 
- **Mythic rarity** How does it fit into the system, what are its rules in terms of slots and classes. Do we need it.
  
## How to work

- **Start with the combinatorics, not class by class.** First settle the numbers: how many kinds each slot has, how many classes carry each kind, how many kinds each class carries, how much classes' loot overlaps, and what freedom that gives (combinations a class can build, pieces it shares, variety between classes). Don't start by designing what's thematically cool for each class and then trying to merge it. Once the numbers are roughly clear (this should be fast) then move to comparing and contrasting class behaviours and fantasies (`docs/core-set/classes.md`), with influence from the builds (`builds.md`, read their routes for which classes meet), knowing we're focused on shape and number of options, not functions.
- **Be careful with theming.** Every pairing should read as plausible for its class at a glance.
- **Don't go wide.** No proving needs from counts, no per-slot purposes, no long rationales. One fresh reader before the gate is enough.
- **Briefing subagents:** give intent and ranges, never examples (the director: "You will simply get the examples that you listed for sure, verbatim").

## What to bring: `gear.md` in this folder

- **For every slot,** a table of classes by kind: which kinds exist and who wears each.
- **For each class,** how many kinds of loot it can wear, and which other classes share each of them.
- **The overlap** between classes' loot, and whether it's in the right range: enough to find combinations, not so much that everything must work with everything.
- **The answers** on the amulet, on how magical damage fits the weapons, and on mythics.
- **What it asks** of the schema, the interface and 5h's loot numbers, in a few lines.
- **What you're least sure of.**

**Gate:** the director reads `gear.md`. Update `intent.md` where their standing intent changes, update `CLAUDE.md`'s Status, commit, push and stop.

## What's settled (don't reopen)

- **Two kinds of damage, no elements, no physical subtypes** (the director, Oct 29). The base game still has them; they're removed in a cleanup after this design, so design as if they're gone.
  - **Physical damage** meets Armor (the Path of Exile formula, tuned to be mostly flat, so a big hit gets through big Armor) and Evasion (a chance to dodge it).
  - **Magical damage** meets magic resist, a percentage: a foe with high magic resist takes a big share of a magical build's damage away, which Armor and Evasion never do. Magic can't be dodged.
  - **Burn, Shock and Chill aren't magical.** They're statuses, not resisted; if a foe should ever shrug one off, it would be with a resist stat for that status.
  - **An element can still be a theme:** an earth-themed physical class, a fire-themed Burn class. Scaling from Attack, Magic or other stats stays.
- The twelve builds in `builds.md` and the philosophy in `philosophy.md`.
- Rarity is mostly how far a piece bends the game and how specific it is; there are no random affixes on rare and legendary pieces; pieces below legendary carry effects too. A tier above legendary (mythic) is wanted: say briefly what it means and whether it's tied to classes.
- Cards show who can wear a piece, never what it's "for".
- Loot starts from scratch; how much drops follows this design.

## Read first

- `CLAUDE.md`, then `docs/core-set/classes.md` (kits and today's weapon kinds) and the Weapons and Gear sections of `docs/core-set/rules-and-vocabulary.md`.
- In this folder: `intent.md`, `philosophy.md`, and `builds.md` (its routes and its armor draft under "Gear: an open gap").
- Step 5h's reward plan, for how loot reaches a run (not its amounts): `git show origin/ccr-9cf44321-t2g2o5:steps/05-core-set/5h-roster/design.md`.

A first attempt at this (Oct 29) gave each slot a job and was set aside. It's in git history; don't build on it.
