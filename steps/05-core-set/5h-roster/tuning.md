# Step 5h tuning trail

One entry a round. The tools: `npx tsx src/rogue-parties.ts` (the hand-built rosters, written to `parties.md`), `npm run rogue:calibrate` (each fight's knob against those rosters, each fielding its best three of five for the fight), `npx tsx src/rogue-acts.ts` (MP: the endurance probe and the act road, with and without tonics). No whole-run simulation and no simulated picker are tuned on (the director's call). Budget: eight rounds.

## Before: the gear economy, measured (for the reward plan)

300 runs of the simulated player at heat 0, with every piece offered and taken tallied (a scratch script, not kept). A run that reaches the end took about 17 pieces (6.7 / 5.6 / 5.0 by act), 4.7 of them legendary against 3.7 common (in act I, 2.1 legendaries against 1.5 commons). The party wore real gear in 5.4 of 9 seats at act I's boss and 7.3 at act II's, and its armor and amulet seats were full by act II's floor 4. 0.05 pieces a run were ones nobody in the roster could wear. The director's read of those numbers ("the AI is really bad" and gets far less than a human; 10 pieces a run could never fill a roster's seats) led to the reward plan of design.md: about 28 pieces and 12 legendaries a full run, worked out from the roster's seats.

## Round 1: MP pools by class

The rules as built: no class MP regen in fights, the bench regaining 50% of max MP after each won fight it sits out, MP regen on gear a step three times the old.

**The endurance probe at the old pools** (fights from full MP before a class is under a third, its roster's three fighting the act's regular fights back to back with HP made whole): the Paladin 2.1, the Pyromancer, Geomancer and Stormcaller 2.6, the Vampire 2.8, the Bramble knight 3.0, the Ranger 3.2, the Frostweaver and Bard 3.7, the Hoplite 3.9, the Assassin 4.0, the Knight 4.3, the Hexer 4.4, the Cleric 4.5, the Valkyrie 4.6, the Monk 5.4. The director's target is two or three for every class, casters and walls close, erring scarce.

**The lever: each class's MP pool** (`MP_POOL` in `content/core-set/classes.ts`), not the costs. The cost ladder is the director's rule (one ladder by cooldown word, two tiers), and a pool sized by how many fights a class lasts is the class's MP identity. Two passes: the Knight 2 → 1.2, the Cleric 5 → 2.5, the Ranger 3 → 2.5, the Hoplite 2 → 1.5, the Paladin 3 → 3.3, the Valkyrie 3 → 1.8, the Bard 4 → 2.8, the Hexer 4 → 2, the Monk 2 → 0.75, the Assassin 3 → 1.7, the Pyromancer 5 → 4.5, the Frostweaver 4 → 2.7, the Stormcaller and Geomancer 3 → 2.7 (the Bramble knight and Vampire unchanged at 2).

**After:** every class 2.1 to 3.1 except two, each for a reason:
- the Valkyrie (3.8) keeps room for Valhalla (1,500 MP; a smaller pool would put its revive out of reach), and holds MP for it;
- the Monk (4.0) is fed by its supports: its two rosters carry the Bard (Refrain gives MP from every basic attack) and the Vampire or Valkyrie, and its abilities cost 200 and 325, so the gifts keep a small pool topped up (a probe of its fights shows it regaining up to 286 MP in a fight). That's the director's support path working.

**The road at these pools** (the stated rotation: those under a third sit out, the first three of the roster's preference who can fight, fight): without tonics the bench is used in 43% of act I's fights and two thirds of act II's and III's; with tonics, in 17% of act I's and about half of the later acts'. Act II and III fights were lost far too often (a third), because the knobs were still the simulated player's: calibration next.

## Round 2: the knobs on the hand-built rosters

The region corrections from the simulated player's whole runs (`region/<id>/mob`, −28 to +6) set to 0: they corrected that player's runs, not these parties. Every fight recalibrated against the rosters (twelve rosters at each act's and tier's power level, each fielding its best three of five for the fight), toward the same costs as before: a regular fight 18 / 19 / 20 points of party HP by act, an elite 25 / 26 / 27, a boss beating 22 / 35 / 45% of arrivals.

**First pass** (one play a roster): bosses came out in steps of 8 points (twelve rosters), so the calibrator got `--reps` (each roster plays three times, on its own dice); 36 plays a fight. **Second pass** (three plays): bosses beat 19 to 22% of the rosters in act I (target 22), 31 to 36% in act II (35), 44 to 47% in act III (45); regular fights and elites on their costs. The regular fights' and elites' knobs spread wide (−118 to +234, median +30): against rosters that pick their best three, most fights got harder than the simulated player's calibration had them (the director's "enemies harder for the new flexibility").

**The puzzle fights.** With the restorations in (the Snake Pit three snakes, the Viper Den four, snake packs that grow, three Bomb Bugs in the Bomb Room and the Powder Room): the snake fights calibrate normally (knobs +24 and −9). Three Bomb Bugs don't: the Bomb Room cost 30% and the Powder Room 34% at the knob's floor. The Bomb Bug explodes when it dies, so its damage doesn't shrink with the knob (a stronger party only sets it off sooner). Three Bugs alone still cost 25% at the floor, an elite's cost. So the three-Bug fight became a new Fire Mine elite, the **Bomb Nest** (26%, on target), and the Bomb Room and the Powder Room keep two (the Powder Room calibrates; **the Bomb Room still costs 25% at the floor, against 18**, the same floor two Bugs and two hounds had before this step, now visible because the rosters are stronger: flagged in the report).

**The road after calibration** (act road, the stated rotation): without tonics, a bench member fights in 55 to 60% of fights and fighters go in under a third of their MP 9 to 15% of the time; with tonics, 40 to 47% and 0 to 3%. Tonics carry about a quarter to a third of the rotation's load; the bench is still in about every other fight (the director's worry, that tonics invalidate the mechanic: they don't, at these numbers).

## Round 3: scarcer pools, then the knobs again

Endurance medians after round 2 sat at three fights for every class (the Ranger 3.5, the Valkyrie 4), the top of the director's "two or three" and they said to err scarce. Every pool a sixth smaller but the revivers' (the Knight 1, the Cleric 2.2, the Ranger 2.1, the Bramble knight 1.7, the Hoplite 1.3, the Paladin 2.8, the Bard 2.4, the Hexer 1.7, the Monk 0.65, the Assassin 1.45, the Vampire 1.7, the Pyromancer 3.8, the Frostweaver, Stormcaller and Geomancer 2.3; the Valkyrie stays 1.8 for Valhalla). Endurance medians: two fights for the Paladin, Monk and Knight, two and a half for the Pyromancer, Stormcaller and Frostweaver, three for the rest, four for the Valkyrie. Every fight recalibrated on the smaller pools.

**After** (every fight recalibrated, three plays a roster): bosses beat 19 to 22% of the rosters in act I, 33 to 36% in act II, 42 to 47% in act III, every other fight on its cost. Endurance medians two to three for every class, the Valkyrie four. The road: without tonics the bench fights in 54 to 62% of fights and fighters go in under a third of their MP 9 to 17% of the time; with tonics 43 to 47% and 0 to 4%. (The road's losses, 10 to 23% of fights, are no reading of difficulty: it plays every fight with the act's regular kit and a plain rotation that never counter-picks.)

**The reward plan's volume**, tallied over 300 of the simulated player's runs (it takes little, so the offers are the reading): a full run is offered about 88 pieces (14, 34 and 40 by act), 24 of them legendary (the plan: about 80 and 25), and the player took 0.35 pieces a run that nobody in its roster could wear yet (0.05 before): the off-roster share at work.

## Round 4: act I's power level, and how many it picks from

**The simulated player, as information only** (nothing is tuned on it): at round 3's knobs it won 5% of runs, and 46% of its runs ended at an act I elite. Part of that is the player (it plays far below the rosters and never counter-picks); part was the rosters' power level in act I, which overstated a careful player: every member on two abilities with uncommon gear and a legendary at the first elite, and five to pick from. Under the reward plan a careful player at the first elite (floor 4 or 5) has most members on their first ability, a few pieces, and its first legendary from that elite's trophy; and a run starts with three, its recruits coming from floor 2.

**Changed:** act I's regular fights at 1.4 abilities known (two of five members on their second) with common gear and no legendary, its elites at 1.6; and a roster size by level (`roster`): three to pick from in act I's easy fights, four in its regular fights and elites, five at its boss and after. Act I recalibrated (the Old Road's 17 fights): its regular knobs fell (bandit camp −62, archers' nest −74, the Viper Den −34; the wolf packs stay high, +55 and +80), its elites by up to 60, its bosses unchanged (they were measured at the boss's level). The simulated player now wins 12% (act I's boss beats half of the runs that reach it, against 22% of the rosters).

**The feel tool** gained `--rosters` (the hand-built rosters' fights, each picking its best three on two throws of the dice, as the calibration does; one throw picked worse trios and showed the act I bosses winning 7 of 12). A fresh reader reads its packs: `reads/round-4.md`.

**The read** (ten packs and the summary of 336 fights), in the report's §4. What it changes:
- **Nothing tuned.** Its findings are either the director's decisions or balance items from before 5h:
  - long fights drain casters mid-fight, against "MP doesn't really matter within a fight": decision 7, which proposes an earlier enrage and a capped Mend, not bigger pools;
  - revives almost never cast: decision 8;
  - balance items for the next pass, and third slots for 5i's kickoff.
- **Three tool fixes:**
  - each roster and level gets its own seed, because item ids collided and the packs printed another roster's gear. `parties.md` came out identical, and fights were never affected, since gear is registered before each fight;
  - Chill shatter damage is credited to the party, not to the foe that held the Chill;
  - `--fights` picks the fights to pack.
- **The puzzle fights** (the reader saw none): six packs read here.
  - Snakes are a light tax: one Bleed stack at a time, closing at once.
  - The Bomb fights are explosion tolls over in 17 to 24 ticks. The last Bug's blast never goes off, because the fight ends when it dies.

## Round 5: the revives, and two errors in the harness

**The director's word on the report:** "just lower the cost of the revives". Raise and Valhalla were 1,500, the dearest abilities in the game, and were cast 0.05 and 0.03 times a fight.

**Price wasn't what stopped them.** At 1,000 or 650 the rosters still cast them as rarely. The rosters started every fight with every ability uncharged, so a revive wasn't ready until t56 to t63, and the first death came at t15 to t29. In a run, cooldowns carry between fights (step 5g). Measured over the rosters' third to sixth regular fights in a row, an ability starts a fight with 0.38 of its cooldown left on average, whatever its length, and a revive is ready 88% of the time, since it waits for a knockout most fights never bring. The rosters now start that way: 60% charged, a revive ready.

**With the revive ready, price matters.** Probe: an ally falls beside a standing reviver with the revive slotted. How often is it cast?

| Price | Cleric (Raise) | Valkyrie (Valhalla) |
| --- | --- | --- |
| 1,500 | 32% | 24% |
| 1,000 | 32% | 41% |
| 650 | 52% | 57% |

The rest of the time the reviver was dry from casting, or fell first. Both went to **650**, the second spell rung (Rally's and Renew's price). The Valkyrie's pool came into line with the others (1.8 → 1.5), since it no longer keeps room for Valhalla.

**The openings changed the difficulty.** Recalibrated on them, the knobs rose by a median of +70 on regular fights, +88 on easy fights, +51 on elites and +30 on bosses. The rosters had been understated, so every fight had been set too soft against them. Endurance fell to two fights from full for every class, the Paladin and the Monk to one. Round 3 had cut their pools on the uncharged openings, so that cut was undone for those two (the Paladin 2.8 → 3.3, the Monk 0.65 → 0.75).

**The second error: the pick.** The simulated player fell from 12% to 1%, and the MP road (a plain rotation, no counter-pick) lost 27 to 35% of act II's regular fights. A probe at those knobs, act II's regular fights, what each of a roster's ten trios pays:

| Trio | HP cost |
| --- | --- |
| Best | 15% |
| 2nd | 21% |
| 3rd | 26% |
| 4th | 32% |
| The roster's own first three | 31% |
| Median | 43% |

Any trio lost 13% of its plays. The calibration had set every fight against the best trio, found by playing all ten on the fight itself: a pick no player can make. With the bar there, any other pick paid two to three times the target. **The calibration now fields the trio a quarter of the way down the ranking** (`PICK` in `src/rogue-parties.ts`; `--pick` on the calibrator): the 3rd of ten, the 2nd of four, the only one of one. That's a good pick from the preview, not the perfect one. A perfect pick pays less than the target, and the roster's first three a little more. The feel tool picks the same way.

**After** (every fight recalibrated, three plays a roster):
- **Bosses** beat 19 to 22% of the rosters in act I, 33 to 36% in act II, 44 to 50% in act III.
- **Other fights:** regular fights cost 17 to 21% of HP, elites 25 to 28%, easy fights 12 to 14%. The Bomb Room is on target (19%): its floor in round 2 came from the understated openings.
- **Against round 4,** the knobs are higher: regular fights by a median of +37, easy fights +58 (the openings alone; act I's first floors have one trio), elites and bosses +24.
- **Endurance:** two fights from full for every class.
- **The road with tonics:** a bench member fights in 44 to 56% of fights, and fighters go in under a third of their MP 0 to 6% of the time. It loses 1 of act I's 48 regular fights and 11 and 18 of act II's and III's 144. Without tonics, 54 to 70% and 4 to 22%.
- **Revives:** Valhalla is cast 0.06 times a fight (was 0.03), first at t26 (was t90). Raise is cast 0.02 times. In the probe's fights where an ally fell, the Cleric (HP 2) had fallen first in three of five, so a cheaper Raise can't help there; the Cleric's frailty is a kit question.
- **The simulated player** (information only) wins 2% of runs; 40% of its runs end at act I's first elite and 34% at act I's boss. It never counter-picks, and plays well below the rosters.
