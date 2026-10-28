# Step 5h report: the roster

You asked for a roster to rotate: a small bench that grows by choice, parties changed any time outside a fight to answer each fight's preview, MP drained by fighting and restored on the bench, more loot (legendaries above all), recruits and formations as rewards you route toward, and tuning on hand-built parties rather than the simulated player. It's built, tuned on twelve hand-built rosters, read by a fresh feel reader, and pushed to `ccr-9cf44321-t2g2o5`. `design.md` is the approved design, `intent.md` your words in three rounds, `tuning.md` the four rounds, `parties.md` the rosters, `reads/round-4.md` the feel read.

**To play it:** `npm install`, `npm run ui`, Settings → MODE → ROGUE. Start a run.
- Before any fight, PARTY swaps who's in: tap a seat, then someone at camp.
- The map has two new rooms: a helmet (the Muster: recruits) and a banner (the Drill ground: formations or training).

## 1. Decisions and open questions

1. **Difficulty is now set against competent play.** Every fight was recalibrated against the twelve rosters, each fielding its best three of five for that fight. The targets are the same costs as before (a regular fight 18 to 20 points of party HP, an elite 25 to 27, bosses beating 22 / 35 / 45% of arrivals). Against rosters that counter-pick, most fights got harder (the median regular knob is +30). The simulated player, which plays far worse, now wins 12% of runs (21% on the last build), and most of its losses are in act I. Your play is the check: **say if it's too hard**. The lever is one line of targets in `src/rogue-calibrate.ts`, and a recalibration takes four minutes.
2. **Tonics don't replace the bench, at these numbers.** With a tonic taken after every fight where someone is low, the bench still fights in 43 to 47% of fights (54 to 62% without tonics). Fighters go in under a third of their MP 0 to 4% of the time, against 9 to 17% without. Tonics carry about a quarter to a third of the rotation's load. **My call: keep the tonic at half a pool.** If the bench feels optional when you play, a tonic at a third of a pool is the first knob.
3. **Two classes last longer than the rest, on purpose.** The Valkyrie (a median of four fights) and the Cleric (three, with long tails) keep room for their 1,500-MP revives. A smaller pool would put Valhalla out of reach, and both hold MP for their revive when nobody's down. **Say if** you'd rather they run dry like the others, which means a cheaper Valhalla and Raise.
4. **The Bomb Room has a floor.** Two Bomb Bugs and two hounds cost a counter-picked party 25% of its HP even at the knob's lowest (its target is 18). A Bomb Bug explodes when it dies, so its damage doesn't shrink with the knob; a stronger party only sets it off sooner. It was the same before this step, hidden by weaker parties. The three-Bug fight you wanted back is now an elite, the **Bomb Nest**, on target at 26%. **Options:** leave the Bomb Room as the one spiky regular fight (my pick, as a puzzle that rewards a counter-pick), cut it to one Bug, or make explosions shrink with the knob (a rules change).
5. **Two overestimates were caught by the simulated player's numbers,** and I fixed both: act I's rosters had been given more than a careful player has there, and five members to pick from from the first floor. Act I is now calibrated at one or two abilities a member, common gear and no legendary before the first elite, with three to four members to pick from until the boss. **Say if** that reads wrong against your own runs. This is the place hand-built parties can go wrong.
6. **Free play** loses in-fight MP regen too, since it's one rule in the pack. Its pools are the same smaller ones.
7. **MP does matter inside the long fights, against your words.** You said MP should drain over fights and "not really matter within a fight". At normal lengths that holds: a class is short of MP 1 to 14% of its time (the Monk most). In the long fights it doesn't hold. A caster runs dry halfway through and basic-attacks for 30 to 110 ticks, which reads as a class switching off, not a choice (four of the reader's ten packs). Almost all of those long fights are slogs: a fight lost at its first death that takes 100 more ticks to end, or an elite where two Bone Priests heal back what the party deals. **Options:**
   - bring the enrage forward from 200 ticks to about 120: only long fights reach it, and it ends the slogs;
   - cap the Bone Priest's Mend;
   - both (my pick: fix the slog, keep the MP);
   - accept it as the price of a long fight.

   Bigger pools wouldn't help without breaking the two-or-three-fight drain: a boss fight is twice a regular one, so it spends twice the MP.
8. **Revives are almost never cast,** which weakens decision 3. Valhalla is cast 0.03 times a fight and Raise 0.05. In won fights nobody's down, and in lost ones the reviver is often dry first: the Cleric in pack 8 never got near Raise's 1,500. The bigger pools buy the Valkyrie and Cleric very few revives. **Options:** cheaper Raise and Valhalla, with their pools brought into line (costs are yours to set); or keep revives as rare insurance at today's price.

## 2. What was built

All of the third design, in the rules (`src/rogue.ts`, the schema), the content and the interface. The engine is unchanged.

- **The roster.**
  - Two seats at camp at the start, up to four: a seat is one of the boss's boon options (three of a legendary, a formation, a recruit and a seat are shown) and a version of the Empty Camp.
  - Swaps any time outside a fight, from the party screen; TO CAMP and SEND HOME on the unit sheet (never the leader). The campfire's SWAP tab is gone.
  - The reserves rule is gone: a wipe ends the run.
- **What a class knows.**
  - The leader and the draft's picks know one ability each, rolled and shown on the cards (the draft keeps its one of three).
  - A recruit knows one, two or three abilities, more likely more in later acts, coloured on its card like gear's rarity. Raise and Valhalla are rolled like any other.
  - The Muster offers one of two.
- **Fresh abilities start half charged:** a starting unit's, a new recruit's, one just learned. Benched units keep their cooldowns.
- **MP.**
  - No class regains MP in a fight by itself: MP regen is 0 on every class.
  - MP regen lives on gear, Caravan's Quartermaster seat and the rogue's MP regen affix, at three times the old step. It works in fights, on the wearer.
  - After each won fight, those who sat it out regain 50% of their max MP (from the max they last fought with; no gear touches it).
  - The campfire's share for those at camp is HP only now.
- **The reward plan.**
  - **Regular fights:** a pick of three. Gear in 60% of fights, gear mixed with a tome or a formation in 40%. The gear rolls 13% legendary. No supplies, no recruits.
  - **Elites:** the trophy, then a pick of three at 40% legendary (sometimes mixed).
  - **Chests:** 45% legendary, or a caged recruit with a piece (20%).
  - **The shop:** two legendaries from act II.
  - **Off the roster:** a third of offered gear is for classes not in the roster.
  - **The bag:** a piece nobody wears can be dropped any time.
- **New rooms and moments.**
  - Two Musters and two Drill grounds on every act's map.
  - A stranger at the fire at 30% of campfires.
  - The campfire's TRAIN does two members.
  - Formation rarities, provisional until 5i: common Vanguard, Ambush, Scatter, Tortoise; rare Champion, Blitz, Escort, Last stand, Caravan; legendary none yet.
- **Events.** Six new ones, each rolling one of two or three versions: a Deserter, Mercenaries, a Prisoner Cart, a Rival Company, an Old Banner, a Training Hall. The Empty Camp has a version with a seat. The Drill Yard and the Fallen Standard became the Drill ground and the Old Banner.
- **The interface:**
  - the two rooms;
  - recruit and formation cards with what they know or their rarity;
  - the seat, the cage, the stranger;
  - one nested training screen everywhere (the roster, then a member's abilities and passive, then what can be done to each);
  - the bench on the party screen, MP first;
  - DROP;
  - the battle's end without THE CAMP STEPS IN.

  Checked in a browser at phone size: every new screen renders, with no errors.
- **The puzzle fights back:** snake packs grow again (the Snake Pit three, the Viper Den four); three Bomb Bugs as the new Bomb Nest elite.
- **Tools:**
  - **`src/rogue-parties.ts`:** the rosters.
  - **`npm run rogue:calibrate -- --reps 3`:** on the rosters, each fielding its best three, about four minutes for every fight.
  - **`npx tsx src/rogue-acts.ts`:** the MP check.
  - **`npx tsx src/rogue-feel.ts --rosters`:** fight packs from the rosters (`--fights id,id` for named fights).

  The simulated player and the playtester's game follow the rules; nothing is tuned on them.

## 3. What the numbers say

**MP by class:** fights from full before a class is under a third, its roster's three fighting back to back with HP made whole (the median of 7 to 21 runs).

| Fights | Classes |
| --- | --- |
| 2 | Paladin, Stormcaller, Knight, Monk |
| 2.5 | Pyromancer |
| 3 | Frostweaver, Bard, Vampire, Geomancer, Hexer, Bramble knight, Ranger, Assassin, Hoplite, Cleric |
| 4 | Valkyrie |

Each class's pool was set to reach this (`MP_POOL` in `content/core-set/classes.ts`; your cost ladder untouched). The Monk lasts longer in rosters with the Bard or the Vampire: their Refrain and Blood gift top up a small pool. That's the support path you described.

**The bench in use:** an act's fights in order, with a plain stated rotation (under a third of MP sits out; the preferred three who can fight, fight).

| | A bench member fights | Fighters going in under a third of MP | Fighters' MP going in |
| --- | --- | --- | --- |
| Without tonics | 54 to 62% of fights | 9 to 17% | 65 to 74% |
| With tonics | 43 to 47% | 0 to 4% | 75 to 78% |

**Difficulty:** bosses beat 19 to 22% of the rosters in act I, 33 to 36% in act II, 42 to 47% in act III (targets 22, 35, 45). Every regular fight and elite is on its cost, except the Bomb Room (above). How sure: 36 plays a fight (twelve rosters, three throws each); a boss's rate is good to about ±8 points.

**Loot:** over a full run the system offers about 88 pieces (14, 34 and 40 by act), 24 of them legendary. The plan was about 80 and 25. 0.35 pieces a run are taken that nobody in the roster can wear yet (0.05 before), which is the off-roster share making you want a class. Each act's map has two Musters and two Drill grounds. A path taken at random passes about 0.7 of each an act, a path routed for them about 2.6 of the two together. With the shop, the stranger, the cage, the boon and the events, a run gets about eight chances at a recruit and around ten formation offers.

**The simulated player** (information only): wins 12% of runs. Act I's boss beats half of the runs that reach it, against 22% of the rosters. It plays well below the rosters: it never counter-picks, and rotates only by MP.

## 4. Feel

A fresh reader read ten fights from the rosters tick by tick (`reads/round-4.md`). I read six more of the puzzle fights, which its packs missed.

**What reads well:**
- **Wind-ups:** Crush gives 8 ticks of warning, Inferno 8, Flatten and a Troll's swing 6.
- **Status shapes:**
  - Briar's Bleed ramps;
  - Burn fades visibly;
  - a Chill shatter is the best moment in the game.
- **Tempo:** each class has one you can read.
- **Near misses:** a Rally 1.7 ticks late, a Vanish 0.6 ticks late.
- **Best fight:** the Ogre Bridge elite, a plan you can watch work. The Hexer's Chill and Sunder set up the Monk, and a shatter finishes the Ogre.

**What doesn't:**
1. **Lost fights are decided at the first death, then drag on.** Every lost fight lost its first member by t29 and none recovered. Three of them ran 100 to 140 ticks past that point (decision 7).
2. **The tiers differ in danger, not in shape.** Regular fights are tolls: all 168 won, almost no KOs, 18 to 20% of the party's HP. Elites are won 94 to 100% of the time. Bosses are the only danger, and they turn on their first 20 to 30 ticks: on whether a big blow lands on a fragile member. Against the rosters, that's the attrition shape the bench is for. **Say if** you want regular fights to threaten too, which means a higher cost target (one line).
3. **Third slots and revives hardly exist.** Third slots start uncharged on cooldowns of 33 to 63 ticks, so a 40-tick fight barely sees them (Tremor first lands at t50). Pyre, the biggest number in the game, comes once in six fights. This belongs to 5i: an upgrade branch can answer it. It's in the kickoff.
4. **The puzzle fights don't play as puzzles yet.**
   - **Snakes:** their Bleed lands one stack at a time and closes at once, about 300 to 650 damage a snake. The bandits beside them are the threat.
   - **Bomb fights:** a toll of explosions, over in 17 to 24 ticks. The counter-pick is fire resistance and HP, which fits "preparation is the game", but nothing in the order of kills matters. The last Bug's blast never goes off, because the fight ends when it dies. So the Nest costs two blasts, not three.
5. **Balance items found, not 5h's.** These are for the next balance pass (or 5i's numbers):
   - **Bone Priests' Mend:** in pack 8 it healed 36,211 against the party's 45,774, and nothing died in 124 ticks.
   - **A Chill engine stun-locks the act III boss:** the Silent One was stunned about 48 of 70 ticks, with a Stun on every shatter.
   - **Blood gift can still kill its caster.**
   - **Siphon pays on overkill:** a Backstab into 266 HP refunded 615 MP.
   - **The Hexer dies to ordinary basics:** 33 KOs per 100 fights, the most of any class.
   - **The Cleric's Cure+ goes on itself** (four of five in pack 8).
   - **Hellhounds do nothing:** 135 damage an appearance.

**Feel by class:**
- **Worst:** the Cleric (its heals miss the moment), the Hoplite (its kit arrives after the fight) and the Hexer (dies before its kit plays).
- **Best:** the Monk, the Geomancer and the Bramble knight, each a loop you can watch.
- **Dominant:** the Stormcaller, Ranger and Pyromancer decide regular fights in one volley, and the Bramble knight out-damages its own party.

**Tool fixes from the read:**
- **Gear:** the packs printed another roster's gear, because item ids collided across rosters. Each roster and level now has its own seed. The rosters are unchanged (`parties.md` is identical), and fights were never affected: gear is registered before every fight.
- **Shatter damage:** it is now credited to the party member whose Chill shattered, not to the foe it hit.
- **Packs for named fights:** the feel tool takes `--fights snake_pit,bomb_nest`.
- **One open:** the War Banner's Might at a fight's start shows in the log under the wearer's name, with no piece named.

## 5. Method notes

- **Hand-built rosters with a counter-pick made tuning fast and readable.** A whole recalibration takes about four minutes, against an hour of whole runs before, and every party it tunes on is written down (`parties.md`).
- **Its risk is the power level, and the simulated player is a good smoke alarm for it.** Its act I collapse (46% of its runs ended at an act I elite) pointed at two overstatements in my rosters that I wouldn't have seen otherwise. Keep it as an alarm, not a tuner.
- **Pick the three on more than one throw of the dice.** On one throw, the feel tool's rosters picked worse trios and showed the act I bosses winning 7 of 12.
