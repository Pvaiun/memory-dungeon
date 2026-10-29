# Step 5h report: the roster

## Round 6: after your play (Oct 29, 2026)

You played round 5 (five runs, one won) and gave 26 points. All of them are answered: built, set for 5i, or kept as they are. `feedback.md` has each point's status, `design-round-6.md` the map and campfire design you approved, and `tuning.md` the numbers. Everything is pushed to `ccr-9cf44321-t2g2o5`.

### After your act I play: four wins of four, "trivially"

My tuning parties had fallen behind what a run holds on the 12-floor map. Twice the fights hand out twice the loot. By act I's middle, even the simulated player wears 1.4 legendaries and knows two abilities per member. The act I tuning parties had no legendary and 1.4 abilities. At act I's boss it wears 1.9 legendaries, against the parties' one.

- **The fix:** acts I and II's tuning parties brought up to what runs hold, rounded up because you outplay the simulated player. Then act I's fights and all of act II were recalibrated, and act I's climb into regular fights re-measured.
- **Against the build you played,** act I's fights are harder:
  - about +30 on floor 4;
  - +32 on floor 5;
  - +38 from floor 7;
  - +31 at elites;
  - +18 at the boss.
- **Act II:** its regular fights went up +37 and its elites +13.
- **The simulated player** clears act I in 20% of runs. As you played it, 46%; round 5, which you called challenging, 10%. Floors 1 to 3 still lose almost nothing.

How sure: the rosters now match what the simulated player holds, plus a margin. If you still win act I easily, you're holding more than that margin, and the next step is your own numbers. What did you have at act I's boss: legendaries, formations, abilities known, roster size?

### Decisions for you

Answered (your word, the same day; numbers in `tuning.md`):
- **Mid-act campfires on most paths.** A new map rule adds mid-act campfires until most ways up pass one: 79% of paths over many maps, not a guarantee. A path has 4.6 regular fights and about two campfires. On the road, act II's regular fights lose 10% (17% with no mid-act campfire).
- **The free MP share is 10%** (was 25%). It barely changes how often the bench fights on the road (18 / 38 / 30% by act). What it changes is TRAIN: with MP the bottleneck, the road's rule (TRAIN when the party is over half MP) picks it at 3 of 36 of act II's mid-act campfires (was 14). That's your point about a terrible choice. Your next option, HP or MP first and then rest or train, is the fix I'd try if it reads that way in play.
- **Act III is a step harder again**, before you play it: its targets up (regular fights 23% of HP, elites 30%, bosses beat 52% of the rosters), on top of batch 2's stronger rosters. Its fights' knobs have risen about +25 to +55 since round 5. On the road its regular fights lose 15% (were 7%).

Still open:
1. **Act I's middle may still be harsh.** The first floors are fixed: a random start loses nothing on floors 1 to 3 (floor 3 lost 41% before) and 4% on floor 4. From floor 5 the simulated player still loses a quarter of its fights, nearly half on floor 8. It's weak (it wins 8%), but act I's middle is tuned on rosters wearing a full set of common gear, more than a party has there. If floors 5 to 8 feel unfair when you play, that's the lever.

### What changed

- **Quick fixes (batch 1):**
  - each leader's rolled ability on the start screen;
  - potions and tonics on the party screen and the fight preview;
  - no FOR line on gear;
  - a recruit's sheet from a tap on its face;
  - BACK out of training until someone is trained;
  - MP on the field: a blue number for regen, and a line too for any other gain;
  - the gear picker: what the member wears, then the bag, then what others wear (taking one asks first);
  - a potion and a tonic at the start;
  - a seat at camp with each act;
  - act I recruits know one or two abilities (the two named events keep three);
  - all three supplies at the shop.
- **Rewards (batch 2):**
  - mixed picks in 15% of fights (were 40%);
  - an elite gives a pick of three legendaries, then a pick of two formations (your call);
  - chests 30 in 80 legendary (were 45);
  - act III's fights recalibrated on rosters with the reward plan's legendaries, then on a step higher targets.
- **The map (batch 3):**
  - 12 floors, so a path has 4.9 regular fights and 0.9 elites (were 2.1 and 0.7), and about three events;
  - the Muster and the Drill ground folded into other rewards;
  - campfires guaranteed only before the boss, with a mid-act one on about 79% of paths;
  - enemies as strong as before, the act's climb stretched over 12 floors;
  - a regular fight's gold 7–12 (was 12–20) and its pieces 6% legendary (was 13%).
- **The campfire:**
  - on arrival, everyone recovers 25% of HP and 10% of MP, and the fallen rise at 25%;
  - then REST (25% of each, for everyone) or TRAIN (three members).
- **Lessons:** any recruit you turn down can teach one member instead: a captive, the stranger, the Wounded Traveller, the Deserter.
- **Captives:** after 20% of won fights with people in them, never two running. Take them in at half HP, take a lesson, or let them go.
- **Events:** ten new ones, two versions each:
  - the Master Smith (reforges a rare into a legendary; a drunk version that can crack it);
  - a Prisoner Convoy (each prisoner carries a piece);
  - an Old Soldier;
  - Three Sealed Crates;
  - the Quartermaster's Wagon;
  - a Field Hospital;
  - the War Table;
  - a Duelling Ground;
  - the Abandoned Armoury;
  - a Mana Spring.
- **Two new pick shapes** in mixed picks: a sealed piece (rare or better, unseen until taken) and a bundle (a piece and a supply).
- **The first floors:**
  - easy fights on floors 1 to 3, tuned against random starts;
  - act I's climb into regular fights measured (a new `--climb` on the calibrator) and set at 25.7 a floor below act I's middle.

### What the numbers say

- **The map, on the built generator:** 3 or fewer fights and elites on 6% of paths (was 75%). A run has about 19 fights, bosses included (was about 11.5).
- **Loot,** over the simulated player's runs (information only): per act it's offered about twice the pieces and formations, and plays twice the fights. It holds as many legendaries at each act's end as in round 5 (3 after act I, 6 after act II), among a quarter more pieces. You get more choice, and legendaries are a smaller share of what you carry.
- **TRAIN** is picked at about half of mid-act campfires on the road's stated rule. On that rule REST always comes before the boss.
- **The simulated player** wins 8% (round 5: 2%).

### Not done

- The full balance pass is 5i's (in its intent).
- Act I's middle and the campfire numbers wait on your play.


You asked for a roster to rotate: a small bench that grows by choice, parties changed any time outside a fight to answer each fight's preview, MP drained by fighting and restored on the bench, more loot (legendaries above all), recruits and formations as rewards you route toward, and tuning on hand-built parties rather than the simulated player. It's built, tuned on twelve hand-built rosters, read by a fresh feel reader, and pushed to `ccr-9cf44321-t2g2o5`. `design.md` is the approved design, `intent.md` your words in three rounds, `tuning.md` the five rounds, `parties.md` the rosters, `reads/round-4.md` the feel read.

**To play it:** `npm install`, `npm run ui`, Settings → MODE → ROGUE. Start a run.
- Before any fight, PARTY swaps who's in: tap a seat, then someone at camp.
- The map has two new rooms: a helmet (the Muster: recruits) and a banner (the Drill ground: formations or training).

## Round 5 (before your play)

## 1. Decisions and open questions

1. **Difficulty is set against a good player, and it's harder than the last build.** Every fight is calibrated on twelve hand-built rosters, each fielding a good three of five for the fight: the trio a quarter of the way down the ranking (the 3rd of ten), not the best. The targets are as before: a regular fight costs 18 to 20% of party HP, an elite 25 to 27%, and bosses beat 22 / 35 / 45% of arrivals. Round 5 found two errors in my harness (below), and fixing them moved the knobs up from round 4's: regular fights by a median of +37, easy fights +58, elites and bosses +24. The simulated player, which never counter-picks, now wins 2% of runs (12% in round 4). **Your play is the check: say if it's too hard.** There are two levers, each a four-minute recalibration:
   - `PICK` in `src/rogue-parties.ts`: 0.5 tunes against a middling pick, which is much easier;
   - the targets in `src/rogue-calibrate.ts`.
2. **Tonics don't replace the bench.** With a tonic after every fight where someone's low, a bench member still fights in 44 to 56% of fights (56 to 70% without tonics). Fighters go in under a third of their MP 0 to 6% of the time (4 to 22% without). **My call: keep the tonic at half a pool.** If the bench feels optional when you play, a tonic at a third of a pool is the first knob.
3. **Answered: the revives cost 650,** at your word (were 1,500). The Valkyrie's pool came into line with the others (1.8 → 1.5), since it no longer keeps room for Valhalla. Valhalla is now cast twice as often, and early (first at t26, was t90). Raise still isn't: where an ally fell, the Cleric (HP 2) had usually fallen first. That's a kit question for later, not a price.
4. **Answered by the fix: the Bomb Room is on target** (19% of HP). Its floor came from the rosters' understated openings.
5. **Act I's power level** is my estimate of a careful player there: one or two abilities a member, common gear, no legendary before the first elite, three to four members to pick from until the boss. **Say if** that reads wrong against your own runs. This is where hand-built parties can go wrong.
6. **Free play** loses in-fight MP regen too, since it's one rule in the pack. Its pools are the same smaller ones.
7. **MP does matter inside the long fights, against your words.** You said MP should drain over fights and "not really matter within a fight". At normal lengths that holds. In the long fights it doesn't: a caster runs dry halfway through and basic-attacks for 30 to 110 ticks, which reads as a class switching off, not a choice (four of the reader's ten packs). Almost all of those long fights are slogs: a fight lost at its first death that takes 100 more ticks to end, or an elite where two Bone Priests heal back what the party deals. **Options:**
   - bring the enrage forward from 200 ticks to about 120: only long fights reach it, and it ends the slogs;
   - cap the Bone Priest's Mend;
   - both (my pick: fix the slog, keep the MP);
   - accept it as the price of a long fight.

   Bigger pools wouldn't help without breaking the two-fight drain: a boss fight is twice a regular one, so it spends twice the MP.

**Round 5's two harness errors** (the trail has the numbers):
- **The rosters started every fight with every ability uncharged.** In a run, cooldowns carry between fights. I measured what a run leaves: about 60% charged, and a revive ready 88% of the time. This kept the revives from ever being ready, made third slots look absent, and set every fight too soft against the rosters.
- **The calibration tuned against each roster's best trio,** found by playing all ten on the fight itself. No player can make that pick, and every other pick paid two to three times the target. In act II's regular fights the best trio paid 15% of HP, the 3rd 26%, a roster's own first three 31%, the median 43%.

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
  - **`npm run rogue:calibrate -- --reps 3`:** on the rosters, each fielding a good three (`--pick`), about four minutes for every fight.
  - **`npx tsx src/rogue-acts.ts`:** the MP check.
  - **`npx tsx src/rogue-feel.ts --rosters`:** fight packs from the rosters (`--fights id,id` for named fights).

  The simulated player and the playtester's game follow the rules; nothing is tuned on them.

## 3. What the numbers say

**MP by class:** every class lasts two fights from full before it's under a third (the median of 7 to 21 runs; its roster's three fighting back to back with HP made whole). That's the scarce end of your two or three. Each class's pool is set to reach this (`MP_POOL` in `content/core-set/classes.ts`; your cost ladder untouched). The Monk's runs spread from one fight to all eight: alone it's dry after one, but with the Bard's Refrain or the Vampire's Blood gift beside it, it never runs out. That's the support path you described.

**The bench in use:** an act's fights in order, with a plain stated rotation (under a third of MP sits out; the preferred three who can fight, fight; no counter-pick).

| | A bench member fights | Fighters going in under a third of MP | Fighters' MP going in | Regular fights lost (acts I / II / III) |
| --- | --- | --- | --- | --- |
| Without tonics | 56 to 70% of fights | 4 to 22% | 61 to 75% | 4 / 20 / 16% |
| With tonics | 44 to 56% | 0 to 6% | 71 to 77% | 2 / 8 / 13% |

**Difficulty:**
- **Bosses** beat 19 to 22% of the rosters in act I, 33 to 36% in act II and 44 to 50% in act III (targets 22, 35, 45).
- **Every other fight** is on its cost: regular fights 17 to 21%, elites 25 to 28%, easy fights 12 to 14%.
- **How sure:** 36 plays a fight (twelve rosters, three throws each), so a boss's rate is good to about ±8 points.

**Loot:** over a full run the system offers about 88 pieces (14, 34 and 40 by act), 24 of them legendary. The plan was about 80 and 25. 0.35 pieces a run are taken that nobody in the roster can wear yet (0.05 before), which is the off-roster share making you want a class. Each act's map has two Musters and two Drill grounds. A path taken at random passes about 0.7 of each an act, a path routed for them about 2.6 of the two together. With the shop, the stranger, the cage, the boon and the events, a run gets about eight chances at a recruit and around ten formation offers.

**The simulated player** (information only): wins 2% of runs. 40% of its runs end at act I's first elite and 34% at act I's boss, which beats 78% of the runs that reach it, against 22% of the rosters. It plays well below the rosters: it never counter-picks, and rotates only by MP.

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
2. **The tiers differ in danger, not in shape.** Regular fights are tolls for a good pick: all won, almost no KOs, 18 to 20% of the party's HP. A poor pick pays two to three times that (round 5). Elites are won 94 to 100% of the time. Bosses are the only danger, and they turn on their first 20 to 30 ticks: on whether a big blow lands on a fragile member. Against the rosters, that's the attrition shape the bench is for. **Say if** you want regular fights to threaten too, which means a higher cost target (one line).
3. **Third slots and revives seemed not to exist, and that was mostly my harness** (round 5). Its rosters started every fight uncharged. With cooldowns carried as a run carries them, third slots land around t15 to t32 and twice as often: Pyre 0.52 casts a fight (was 0.16), Fireball 1.05 (0.33), Stillness 0.83 (0.21). Revives: decision 3.
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

- **Hand-built rosters made tuning fast and readable.** A whole recalibration takes about four minutes, against an hour of whole runs before, and every party it tunes on is written down (`parties.md`).
- **Their risk is what they assume, and two assumptions were wrong until round 5:**
  - **every fight opening uncharged:** model the state a run carries, not a fresh start;
  - **a perfect pick:** tune against a pick a player can make.

  Both were invisible in the rosters' own numbers. The revive question exposed the first; the plain road's losses and the simulated player exposed the second.
- **The simulated player is a smoke alarm, not a tuner.** Its act I collapse in round 4 pointed at overstated act I rosters, and its fall in round 5 at the perfect pick.
- **Pick the three on more than one throw of the dice.** On one throw, the feel tool's rosters picked worse trios.
