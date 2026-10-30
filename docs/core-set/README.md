# The core set

The core set is a vertical slice of the Memory Dungeon Game, designed by the director as four documents. It's what this repo is building now.

## What it is

The full game is an optional tab in Memory, the director's ADHD memory app, where real-life quests pay unlocks and dungeons pay gear (`docs/concept-spec.md`). That pitch stands. The core set takes the game part of it and sets it out in full: the rules and combat system, 16 classes, the gear and formation lists, and the enemies. It leaves the rest out, so it can be built, played and tuned on its own:

- no quest board, reward streams or unlocks;
- progression started with none: in the first version everything was available, with no challenges or perks, so combat, formations, gear and the battle system could be tested freeform. The campaign (Oct 25, 2026, below) is its first progression, and free play keeps the everything-available version;
- nothing about Memory itself.

The slice is the first version of the game, not the whole of it. The full game grows out of it later, in ways not yet known.

## The documents

| Document | What it holds | Status |
| --- | --- | --- |
| `rules-and-vocabulary.md` | The game rules, the combat system, targeting, damage (physical and magical), the eleven weapon kinds, the statuses, special stats and effects, the gear rules (four slots, armor types, offhand kinds, mythics) and formation rules, floors and caps; elements as themes only | In |
| `classes.md` | The 16 classes: stats, passives, abilities and a test fight each; parties of 3 against sample challenges; the tier check; what to watch | In |
| `gear-and-formation-lists.md` | The build axes; the weapons, armor and amulets (the offhand slot has kinds but no pieces yet); the 10 formations; a coverage check; what to watch | In |
| `enemies-encounters-and-dungeons.md` | The enemy scale and fixed rules; 61 challenges; 29 enemies with a test each; 27 encounters; 7 dungeons, played in order | In |

The director wrote them, and they're the approved design: the core set's work starts at the method's build-and-tune stage (`docs/method.md`). They're written to stand on their own and refer to one another by title (*Core set: classes*).

Changes to them go through the director and are recorded in `DECISIONS.md`, as step 4's design was. The changes from the campaign work (Oct 25 and 26, 2026) and the passes since (5e to 5h, Oct 27 and 28, and the cleanup, 5j, Oct 29) are written into each document, with a note at its top. The rules the enemies document added (summoning, no unit leaving a fight alive, enemy-only Doom and Bulwark, two enemy-only target phrases) are folded into `rules-and-vocabulary.md`, which wins where the two differ. Its known-gaps list at the end holds the open questions.

## How it relates to the rest of the repo

- **The concept spec** (`docs/concept-spec.md`) is the full game. Where the core set differs from it (party size, class count, gear slots, formation slots, abilities per class), the core set is what gets built, and the spec is brought back in line once the slice has shown what holds.
- **Steps 1 to 3** (`steps/`) built the schema, the headless engine and the simulation harness. They're the machinery the core set runs on, not design.
- **Step 4** built the director's combat design into the engine (`src/engine/combat/`, with its building blocks in `PRIMITIVES.md`). That's what the engine runs today. The core set's rules supersede that design where they differ, and building the core set will change the engine to match.
- **Steps 5 to 12 of the design plan** (`docs/design-plan.md`) were replaced by the core set. The plan's later steps describe the full game and are revisited after the slice.
- **Numbers.** The core set's numbers are a relative scale (stats from 1 to 5, gear steps of +1 or +2, cooldowns short to long). First values and the balance pass by simulation are part of building it. **In the data, every number on that scale is multiplied by 1,000** (HP 2 is 2,000, a boss's HP 90 is 90,000), so percentages such as crits and Regen ticks stay whole, and the display divides it back down by a factor tuned for feel.

## Status

**The campaign (Oct 25, 2026; on main since Oct 26):** the director asked for the slice to become a game to beat: start with the starters and the first run, and unlock everything else one node at a time. `steps/05-core-set/5a-campaign/` holds it: a road of 20 nodes (the seven runs, remixes and trials with needs) in `content/core-set/campaign.ts`, each node's difficulty set by simulation (`npm run campaign`), and the interface's journey. It changes some of this set's numbers (Burn, HP steps on gear, a few abilities) and adds rules (a lost cast goes on cooldown, staggered starts, an enrage); the report lists them. Everything-available play stays in the interface as free play. Two passes on the same branch went further, at the director's request, and change more of this set than numbers (`steps/05-core-set/5b-pacing/`, `steps/05-core-set/5c-bleed-mana/`): among them Bleed in place of Poison, a few abilities and passives replaced (Venom arrow, Shadow strike, Lullaby, Mercy, Prayer and Purify), Armor's formula, ability costs set by hand, a campfire, and Aggro picked by draw. The director played it and took it to main (Oct 26, 2026); `DECISIONS.md` (Step 5) has what changed, and the four documents are updated to match. The numbers are still first values.

**The rogue mode (Oct 26, 2026, an experiment on its own branch, from the campaign branch):** the slice as a roguelite on Slay the Spire's structure (`steps/05-core-set/5d-rogue/`). It adds its own legendary pieces, affixes, events and numbers in the pack's `rogue` block and changes none of this set's classes, gear, formations or enemies, except that a fight's log now names each damage's kind. Its supplies since step 5g: a potion (one member regains 30% of max HP) and a tonic (one member regains 50% of max MP), with a slot of two for each kind; after every won fight the party picks one of the two, and the player chooses who drinks.

**The feel pass (step 5g, Oct 27 and 28, 2026; closed at the director's word after playing):** nine rounds of fights read tick by tick, rogue first (`steps/05-core-set/5g-feel/`). It changes numbers and a few rules of this set: the words for time (a quick cooldown word, cooldowns most of the way back toward the earlier, shorter ones), weapons' intervals and swings, crits rarer and smaller, ability cooldowns that carry from fight to fight with no head start (engine 0.15), mana dearer, Armor and themed elemental resistance on every foe, the enrage sooner, and the status table (Burn uncapped and Fire, Shock Lightning, Chill a slow that shatters at its cap, Sunder as damage taken, bigger Regen and Clarity). It also changes kits (the Bard reworked, Frost arrow for Fire arrow, the Frostweaver's Shatterpoint for Brittle) and gives bosses behaviours of their own. `DECISIONS.md` (Step 5g) has the decisions, and the four documents are brought in line with it.

**The cleanup (step 5j, Oct 29, 2026):** the director's rules from step 5i built into the base game, with nothing balanced (`steps/05-core-set/5j-cleanup/`). Damage is physical (against Evasion and Armor) or magical (against one Magic resist, never dodged), and a status's own damage is untyped. Elements are themes only: no weaknesses, no absorption, no resistance to one element. Foes carry Magic resist by rank, Ward gives it, and every hit chips Bulwark. Gear sits in four slots: eleven weapon kinds (a speed, a damage type and hands; a two-hander empties the offhand), four armor types in place of the weights, ten offhand kinds with no pieces yet, and mythic pieces that fit one class (none yet). Today's loot is re-sorted into them, and the Hexer and Geomancer are re-themed as far as their weapons need. The four documents are brought in line with it.

All four documents are in (Oct 23, 2026). **First implementation built (Oct 23, 2026):** every rule, class, piece of gear, formation, enemy, encounter and dungeon is in the engine and the content pack (`content/core-set.pack.json`, generated from `content/core-set/`), with first values for every number and a short ballpark tuning pass. The build's record is `steps/05-core-set/` (`report.md` for the director, `tuning.md` as the trail). The director's sign-off comes next, then the balance pass by simulation. **A first visual interface is in (Oct 24, 2026):** `npm run ui` serves it; `ui/README.md` says what it shows.
