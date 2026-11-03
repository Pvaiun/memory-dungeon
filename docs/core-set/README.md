# The core set

The core set is a vertical slice of the Memory Dungeon Game, designed by the director as four documents. It's what this repo is building now.

## What it is

The full game is an optional tab in Memory, the director's ADHD memory app, where real-life quests pay unlocks and dungeons pay gear (`docs/concept-spec.md`). That pitch stands. The core set takes the game part of it and sets it out in full: the rules and combat system, 16 classes, the gear and formation lists, and the enemies. It leaves the rest out, so it can be built, played and tuned on its own:

- no quest board, reward streams or unlocks;
- progression is the rogue mode (a run of three acts; `src/rogue.ts`, `content/core-set/rogue.ts`), and free play keeps everything available as a sandbox;
- nothing about Memory itself.

The slice is the first version of the game, not the whole of it. The full game grows out of it later, in ways not yet known.

## The documents

| Document | What it holds | Status |
| --- | --- | --- |
| `rules-and-vocabulary.md` | The game rules, the combat system, targeting, damage (physical and magical), the eleven weapon kinds, the statuses, special stats and effects, the gear rules (four slots, armor types, offhand kinds, mythics) and formation rules, floors and caps; elements as themes only | In |
| `classes.md` | The 16 classes: stats, passives, abilities and a test fight each; parties of 3 against sample challenges; the tier check; what to watch | In |
| `gear-and-formation-lists.md` | The build axes; the weapons, armor and amulets; the 10 formations; a coverage check; what to watch | **Out of date:** its pieces and formations were replaced by step 5i's (see Status) |
| `rogue-mode.md` | How a run works: its acts, map and rooms, the party and bench, what carries between fights, loot and training, difficulty | Current |
| `enemies-encounters-and-dungeons.md` | The enemy scale and fixed rules; 61 challenges; 29 enemies with a test each; 27 encounters; 7 dungeons, played in order | In |

The director wrote them, and they're the approved design, so work on them starts at build and tune. They're written to stand on their own and refer to one another by title (*Core set: classes*).

Changes to them go through the director and are written into the documents. The rules the enemies document added (summoning, no unit leaving a fight alive, enemy-only Doom and Bulwark, two enemy-only target phrases) are folded into `rules-and-vocabulary.md`, which wins where the two differ. Its known-gaps list at the end holds the open questions.

## How it relates to the rest of the repo

- **The concept spec** (`docs/concept-spec.md`) is the full game. Where the core set differs from it (party size, class count, gear slots, formation slots, abilities per class), the core set is what gets built, and the spec is brought back in line once the slice has shown what holds.
- **Steps 1 to 3** built the schema, the headless engine and the simulation harness (`src/`). They're the machinery the core set runs on, not design.
- **Step 4** built the director's first combat design into the engine (`src/engine/combat/`, with its building blocks in `PRIMITIVES.md`). The core set's rules supersede it where they differ.
- **Numbers.** The core set's numbers are a relative scale (stats from 1 to 5, gear steps of +1 or +2, cooldowns short to long). First values and the balance pass by simulation are part of building it. **In the data, every number on that scale is multiplied by 1,000** (HP 2 is 2,000, a boss's HP 90 is 90,000), so percentages such as crits and Regen ticks stay whole, and the display divides it back down by a factor tuned for feel.

## Status

The rogue mode is the game; the campaign is retired, and free play stays as the sandbox. Everything in the four documents is built (engine, content pack, interface), and the numbers are first values, not balanced.

**Not yet in the documents: step 5i** (240 gear pieces with offhands, 32 formations, 64 ability upgrades, 16 mythics, and the engine additions they need). It replaced the pieces and formations in `gear-and-formation-lists.md` and waits on the director's sign-off before it's written in. Until then its design is `steps/05-core-set/5i-synergy/` (`spine.md`, `builds.md`) and the built pieces are `content/core-set/pieces/`, `formations.ts` and `upgrades/`, each with its card text.

What's next is in the Status section of `CLAUDE.md`.
