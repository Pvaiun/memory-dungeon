# Step 5h report: the roster

DRAFT (numbers pending)

## 2. What was built

All of the third design (`design.md`), in the rules (`src/rogue.ts`, the schema), the content (`content/core-set/rogue.ts`, `classes.ts`, `scale.ts`) and the interface. The engine is unchanged.

- **The roster.**
  - A bench of two seats at the start, up to four: a seat at camp is one of the boss's boon options (shuffled with a legendary, a formation and a recruit, three of the four shown) and an Empty Camp's version.
  - Swaps any time outside a fight, from the party screen: tap a seat, then one at camp; TO CAMP and SEND HOME on the unit sheet (never the leader). The campfire's SWAP tab is gone.
  - No reserves rule: a wipe ends the run.
- **What a class knows.**
  - The leader and the two draft picks each know one ability, rolled at random and shown on the draft's cards (the draft keeps its one of three).
  - A recruit knows one, two or all three abilities: weights 70/25/5 in act I, 35/45/20 in act II, 15/45/40 in act III, coloured on its card like gear's rarity. Raise and Valhalla are rolled like any other.
  - Recruits are offered one of two at the Muster.
- **Fresh abilities start half charged:** every ability of a starting unit or a new recruit, and an ability just learned (not upgraded), begins with half its cooldown run. Benched units keep their cooldowns as they left them.
- **MP.**
  - Every class's MP regen is 0, so no class regains MP in a fight by itself.
  - MP regen is now only on gear, Caravan's Quartermaster seat and the rogue's MP regen affix, where a step is three times the old. It works in fights, on whoever wears it.
  - After each won fight, every member who sat it out regains 50% of its max MP, counted from the max it last fought with. Gear doesn't touch it, so there's no cheese.
  - Each class's MP pool is set by how many fights it lasts (below). The campfire's camp share is HP only now.
- **The reward plan.**
  - **Regular fights:** gold, then a pick of three: three pieces of gear in 60% of fights, mixed with a tome or a formation in 40%. Gear rolls common 35, uncommon 30, rare 22, legendary 13. No supplies, since every won fight already drops one. No recruits.
  - **Elites:** the legendary trophy as before, then a pick of three rolling rare 60 and legendary 40; a mixed pick in 30% (a rare piece against a formation, a recruit or a tome).
  - **Chests:** legendary 45, rare 35, or a cage (20%): a recruit with an uncommon piece suited to it.
  - **The shop:** one legendary in act I, two from act II.
  - **Off the roster:** a third of offered gear (spoils, chests, events; not the shop or a trophy) is for classes not in the roster.
  - **The bag:** a piece nobody wears can be dropped any time.
- **New rooms and moments.**
  - Two Musters (one of two recruits) and two Drill grounds (one of two formations, or TRAIN TWO) on every act's map, from floor 2.
  - A stranger at the fire at 30% of campfires (a recruit, taken without using the pick).
  - The campfire's TRAIN teaches or upgrades two members.
  - Formation rarities: common Vanguard, Ambush, Scatter, Tortoise; rare Champion, Blitz, Escort, Last stand, Caravan. Rolled by act (70/28/2, 45/45/10, 25/55/20), with the nearest rarity that has something left.
- **Events.** Six new ones, each rolling one of two or three versions:
  - a Deserter (a hurt recruit with a piece, or its blade);
  - Mercenaries (pay for one of three, or one of two veterans who know everything);
  - a Prisoner Cart (free a recruit and fight the guards, or the elite escort);
  - a Rival Company (trade your newest member for one who knows all three);
  - an Old Banner (a common, rare or highest-rarity formation, the last at an HP cost);
  - a Training Hall (two members train, for gold or for HP).

  The Empty Camp has a version with a seat. The Drill Yard and the Fallen Standard became the Drill ground and the Old Banner.
- **The interface:**
  - the two rooms;
  - recruit cards with what they know and carry;
  - formation cards with their rarity;
  - the seat;
  - the cage;
  - the stranger;
  - one nested training screen everywhere (roster → a member's abilities and passive → what can be done to each);
  - the party screen's bench with MP first, AT CAMP n/seats, DROP;
  - the battle's end without THE CAMP STEPS IN.

  Checked in a browser on a phone-sized screen: every new screen renders with no errors.
- **The puzzle fights back** (with a bench to pick from before every fight):
  - snake packs grow again;
  - the Snake Pit three snakes and the Viper Den four, as first built;
  - the Bomb Room and the Powder Room three Bomb Bugs each.
- **The tools:**
  - **`src/rogue-parties.ts`:** twelve hand-built rosters at each act's and tier's power level (`parties.md`).
  - **`npm run rogue:calibrate`:** now on those rosters by default, each fielding its best three of five for each fight, three plays each.
  - **`npx tsx src/rogue-acts.ts`:** the MP check: the endurance probe, and the act road with and without tonics.
  - The simulated player and the playtester's game follow the new rules; nothing is tuned on the simulated player.
