# Step 5j: the cleanup, a brief for a fresh session

Oct 29, 2026. Everything on one branch. Then the base game is brought in line with the rules the director set in step 5i, so the next pass can write gear, formations and upgrades against the game as it will be. This step re-wires; it designs nothing.

**No balancing and no difficulty tuning here, not even a little.** The order is:
1. this step fixes base features;
2. a pass makes the gear, formations and upgrades;
3. then the game is balanced.

Numbers will move in this step, and that's fine. The goal is a working set: everything in, the tests, typecheck, validation and smoke green, and the rogue playable end to end.

## 1. Everything into main

- **5h is complete.** Its branch is `ccr-9cf44321-t2g2o5`: the roster, MP drained by fighting, the reward plan, the 12-floor map and hand-built tuning parties. Its last status line says "awaiting the director's play"; mark it done.
- **5i's work** is on `ccr-abdcdac2-r2rl1h`: the builds, the formations, the gear and the standing intent. It already holds everything from `ccr-70168e4e-ttpjgz`, which can be left behind.
- **Order:** merge 5h into main first, then 5i, through pull requests as before. The director merges them.
- **Expect conflicts in three places:**
  - **`CLAUDE.md`'s Status.** Keep one "No control in fights" line, 5h's line marked done, and 5i's line as it stands on the 5i branch.
  - **`steps/05-core-set/5i-synergy/intent.md`.** 5h's branch has an older copy, and the 5i branch's copy wins.
  - **`steps/05-core-set/5i-synergy/kickoff.md`.** 5h's branch adds it, and it stays deleted.
- **Check:** after each merge, `npm test`, `npm run typecheck`, `npm run validate` and `npm run smoke` pass. Do the cleanup on a fresh branch from main.

## 2. What the cleanup does

The director's rules are in `steps/05-core-set/5i-synergy/intent.md` and in the "Gear" section of `builds.md`. Don't reopen them.

### Damage

- **Two kinds of damage.**
  - **Physical** meets Armor (the formula as it is) and Evasion.
  - **Magical** meets magic resist, one percentage stat, and can't be dodged.
- **No elements and no physical subtypes as mechanics.** An element survives only as a theme: names, art, a class's flavour. Scaling from Attack, Magic or any other stat stays.
- **Status damage is untyped and never resisted:** Burn, Shock, Bleed, the shatter and Thorns. A status that read an element or a subtype gets a plain rule.
- **Ward gives magic resist,** in place of every element's resistance.

### Abilities' damage types

An ability keeps the damage type it has now, minus its element, with one exception: a class whose weapons in the "Gear" section are all one type deals that type with its abilities too.

| The class's weapons | Classes | What changes |
| --- | --- | --- |
| All physical | Knight, Hoplite, Ranger, Monk, Assassin, Vampire | The Ranger's Frost arrow, the Monk's Burning fist and the Vampire's Blood drain become physical. |
| All magical | Cleric, Paladin, Pyromancer, Frostweaver, Stormcaller | Nothing: their damaging abilities are already magical. |
| Both | Valkyrie, Bard, Hexer, Geomancer, Bramble knight | Nothing: each keeps its type. The Valkyrie's Gale spear and the Geomancer's Rockfall and Tremor stay magical; the Bramble lash stays physical. |

Basic attacks follow the weapon's kind.

### Enemies and classes

- **Enemies:**
  - their elemental attacks become magical, and their physical attacks stay physical;
  - their resistance by rank becomes magic resist;
  - weaknesses, resistances to one element and absorption go.
- **Bulwark** loses "piercing or Wind": every hit counts, unless the director picks otherwise.
- **No new enemy puzzles.**
- **Classes' elemental resistances and weaknesses go.** That covers the Bramble knight, Paladin, Vampire and Frostweaver.

### The gear structure

- **In the schema, engine, content and interface:**
  - four slots (weapon, armor, offhand, amulet);
  - eleven weapon kinds, each with a speed, a damage type and hands, with a two-hander emptying the offhand;
  - four armor types in place of weights;
  - ten offhand kinds;
  - each class's kinds in every slot;
  - a mythic rarity that names one class.
- **Today's loot stays.** No piece names an element except through resistances.
  - Strip every elemental resistance from the pieces and the affixes. Drop any piece or affix left with nothing.
  - Re-sort the rest into the new kinds. The fast staves go to the wand, the slow ones to the staff, the Light staff to the mace, and the axe to the great weapon. Heavy armor goes to Plate, light to Robes, and each medium piece to Leather or Mail by what it is.
  - Every new weapon kind gets its plain piece, as every kind has today.
  - The offhand slot stays empty until the next pass makes its pieces.

### The two re-themed classes

They change only as far as their weapons need. The director names them later.
- **The Hexer** (spellblade: dagger or rune sword, in Mail): Attack and Magic set so both weapons work.
- **The Geomancer** (earth fighter: great weapon or rune sword, in Plate): Tremor scales from something other than Magic.

### Documents and interface

- **Documents:**
  - the four core-set documents, `DECISIONS.md`, the primer, the concept spec and `ui/README.md` in line with the build;
  - `PRIMITIVES.md` regenerated;
  - `ENGINE_VERSION` bumped.
- **Interface:**
  - element rows and words out (the bestiary, sheets, gear lines);
  - magic resist in;
  - a fourth slot, with the offhand shown locked under a two-hander;
  - a colour for mythics.

  The director sources the art for the new kinds. Until it arrives, use stand-ins.

## How to work

- **Read first:**
  - `CLAUDE.md`;
  - `docs/method.md`;
  - in `steps/05-core-set/5i-synergy/`: `intent.md`, then `builds.md` (its "Gear" section);
  - in `docs/core-set/`: `classes.md` and `rules-and-vocabulary.md`;
  - 5h's `report.md` and `design-round-6.md`.
- **Tie-breaks, before building:** send the director one short list of anything the rules above don't settle, and nothing they do. Examples of what might come up: an enemy whose move only made sense with an element, a medium armor piece that could go either way, the Hexer's and Geomancer's numbers.
- **Then build,** keeping the tests, typecheck, validation and smoke green at every commit.
- **The gate:** a short `report.md` in this folder saying what changed and anything that surprised you. Update `CLAUDE.md`'s Status, commit, push and stop.
- **Briefing subagents:** give intent and ranges, never examples.
