# The core set

The core set is a vertical slice of the Memory Dungeon Game, designed by the director as four documents. It's what this repo is building now.

## What it is

The full game is an optional tab in Memory, the director's ADHD memory app, where real-life quests pay unlocks and dungeons pay gear (`docs/concept-spec.md`). That pitch stands. The core set takes the game part of it and sets it out in full: the rules and combat system, 16 classes, the gear and formation lists, and the enemies. It leaves the rest out, so it can be built, played and tuned on its own:

- no quest board, reward streams or unlocks;
- no progression, challenges or perks, in its first version: everything is available, and combat, formations, gear and the battle system are tested freeform;
- nothing about Memory itself.

The slice is the first version of the game, not the whole of it. The full game grows out of it later, in ways not yet known.

## The documents

| Document | What it holds | Status |
| --- | --- | --- |
| `rules-and-vocabulary.md` | The game rules, the combat system, targeting, damage, weapons, the statuses, special stats and effects, the elements, the gear and formation rules, floors and caps | In |
| `classes.md` | The 16 classes: stats, passives, abilities and a test fight each; parties of 3 against sample challenges; the tier check; what to watch | In |
| `gear-and-formation-lists.md` | The build axes; the weapons, armor and amulets; the 10 formations; a coverage check; what to watch | In |
| `enemies.md` | Enemies, encounters and dungeons | Coming. It will add core rules, so `rules-and-vocabulary.md` changes when it lands |

The director wrote them, and they're the approved design: the core set's work starts at the method's build-and-tune stage (`docs/method.md`). They're written to stand on their own and refer to one another by title (*Core set: classes*). Where they mention "stage 3", that's the director's own drafting process, not this repo's steps.

Changes to them go through the director and are recorded in `DECISIONS.md`, as step 4's design was.

## How it relates to the rest of the repo

- **The concept spec** (`docs/concept-spec.md`) is the full game. Where the core set differs from it (party size, class count, gear slots, formation slots, abilities per class), the core set is what gets built, and the spec is brought back in line once the slice has shown what holds.
- **Steps 1 to 3** (`steps/`) built the schema, the headless engine and the simulation harness. They're the machinery the core set runs on, not design.
- **Step 4** built the director's combat design into the engine (`src/engine/combat/`, with its building blocks in `PRIMITIVES.md`). That's what the engine runs today. The core set's rules supersede that design where they differ, and building the core set will change the engine to match.
- **Steps 5 to 12 of the design plan** (`docs/design-plan.md`) were replaced by the core set. The plan's later steps describe the full game and are revisited after the slice.
- **Numbers.** The core set's numbers are a relative scale (stats from 1 to 5, gear steps of +1 or +2, cooldowns short to long). First values and the balance pass by simulation are its next work, after the enemies document.

## Status

Three of the four documents are in (Oct 23, 2026). Nothing is implemented. The director sets the implementation order when the enemies document lands. After the first implementation comes a visual interface, so the director can see and play the slice before more design; they'll detail that then.
