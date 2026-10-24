# Core set: first implementation, report

The four core-set documents are built: every rule, class, piece of gear, formation, enemy, encounter and dungeon runs in the engine, with first values for every number and a short tuning pass to get them in the ballpark. This is the record for your sign-off. It leads with what needs you; the numbers and the feel check follow. `tuning.md` beside it is the trail, and `smoke.md` and `smoke-best-kit.md` are the two result tables.

Everything was measured small on purpose: 20 seeds, one formation (Neutral), fresh fights for encounters and full runs for dungeons. These are ballpark numbers, not balance.

## 1. Decisions needed

### A. The Fire Giant's Interrupt check doesn't work as designed (challenge)

The Fire Giant is the one encounter that stays at 0% for its "beats" trio (Frostweaver, Knight, Cleric), with the starting kit and with the best kit, through every tuning round. The log says why. In one fight the Knight's Shield bash interrupted three Infernos in a row; the fourth landed at tick 62 and killed everyone, with the Giant at 50,000 of 95,000 HP. The party needs about 135 ticks to kill it, Inferno comes every 13 ticks, and one miss ends the run. An interrupt that depends on cooldowns lining up is a coin the party has to call right nine or ten times running, so the fight is lost almost surely however the coins are weighted.

I tried the classes document's own fallback (Stuns on a medium cooldown instead of long), which is now in: the bash catches more Infernos but not all. I also tested a rules variant on the side, not kept: an interrupted cast goes on cooldown, like a cast that fizzles for MP. Both versions, same seeds:

| | As built | Variant: interrupted casts go on cooldown |
| --- | --- | --- |
| Fire Giant, beats trio, fresh | 0% | 0% |
| Ogre Chief, "fails" trio (Ranger, Assassin, Stormcaller) | 65% | 100% |
| Ice Titan, "fails" trio (Knight, Geomancer, Pyromancer) | 35% | 80% |
| Storm King, beats trio | 60% | 100% |

The variant doesn't rescue the Giant, and it turns Silence into a hard counter everywhere else (the Assassin's Garrote puts a Crush on a 22-tick cooldown). I don't recommend it.

The options I see:

1. **A Stun that waits for a wind-up.** Shield bash, Pressure point and Tremor hold while a foe is about to wind up and fire into the wind-up when one starts. That makes the Interrupt check a check (do you have an interrupt in the party) instead of a dice roll. It needs one new condition in the engine, "a foe is casting", which is small. The rules say no mechanic may need smart timing from the player; this is the unit timing itself, which is what an auto-battler does. **My recommendation.**
2. **Make Inferno survivable for HP 3 and up** (about 4,200 instead of 7,000; a crit still kills a caster). Interrupts still matter, one miss doesn't end the run. Cheap, but then the pose isn't really an interrupt check.
3. **Cut the Giant's HP** so the fight needs two or three Infernos' worth of time, not five. Makes it the shortest boss in the set.

### B. The first 6 to 16 ticks of every fight are empty (question)

"Every action starts the fight on cooldown" applies to basic attacks too, so nothing happens until the fastest weapon's cooldown runs out: tick 6 for daggers, 10 for swords, 16 for a slow boss. That's a quarter of a 30-tick regular fight. The fresh reader noticed it in every log ("every fight is silent until t6"). The same rule means a Cleric can't Raise anyone in the first 22 ticks of a fight, which cost the starters a run in the feel check (the Ranger fell at tick 10, the Cleric was still waiting at tick 30). I'd let basic attacks start ready and keep the rule for abilities. Your call, since it's a rule.

### C. What kit the documents' tests assume (question for the balance pass)

I played the documents' tests two ways, and the answer changes completely:

| | Starting kit (plain weapon, nothing else) | A generic best kit (HP-leaning, see below) |
| --- | --- | --- |
| Encounters where the "beats" trio wins 60%+ | 28 of 29 | 28 of 29 |
| Encounters where the "fails" trio actually fails | 5 of 28 | 0 of 28 |
| Runs cleared 100% by a "clears it" trio | 1 of 7 | 5 of 7 |

With a kit, every "fails" trio wins every regular fight fresh, the Ogre Chief falls to the three glass cannons meant to lose to it, and only the Fire Mine (0%) and the Storm Tower (25%) hold out. The generic kit my script picks is HP everywhere (Oathblade, Brigandine, Heartstone), which is the gear document's own first warning ("HP stacking may be the strongest generic build"). So two things for the balance pass, which needs your steer on the first: which kit the encounter tests are judged against (I'd define a sensible kit per class from the gear document's For column), and whether HP gear's step comes down before Regen's share does, as that document suggests.

### D. "Fails" trios mostly win fresh regular fights (observation)

With the starting kit, the "fails" trio wins 19 of the 21 regular encounters fresh (the Bomb Room and the Whiteout are the exceptions). The enemies document says every fight outside run 1 is tuned to be failable by most of the 560 trios. At first values that's true inside a run (the Storm Tower's named trio dies at the Wisp Nest, fight 2, 17 times in 20) and false fresh. I read the document's claim as an in-run claim, because that's what the player meets: the balance pass should measure it that way and leave fresh regular fights mostly winnable. Say if you meant fresh fights.

### E. A gap to add to the rules: what an interrupted or target-less cast does

The rules say a cast that fizzles for MP goes on cooldown, and list "an action whose target is gone when it resolves" as a known gap (the engine's default: no MP, no cooldown, try again). An interrupted cast isn't covered; the engine does the same. The retry shows in the feel check: when two Ghouls both start a Raise, the second's fails and it starts again at once, so the Ghoul Pit became a 92-tick loop in which one Ghoul died five times. I'd make all three cases the same: no MP spent, but the action goes on cooldown. The variant table above says what that does for interrupts, so it's a design call, not a tuning one.

### Changes I made that you should know about

These keep what the design is for and are the method's report level: done, listed here.

- **Cooldown words are shorter than planned:** short 6, medium 12, long 22 ticks (ratios kept). At long = 30 the Cleric's Prayer never fired in a regular fight and a boss's signature blow came once in 38 ticks.
- **Stuns run on a medium cooldown** (Shield bash, Pressure point, Tremor), the classes document's own fallback, after Shield bash and Inferno fired in lockstep on long cooldowns, the bash five ticks before every Inferno, in every seed.
- **Enemy basic attacks are set by their words alone** (weak, normal, heavy, massive; the kind sets how often), not by Attack. Scaled from Attack, the Ogre Chief's plain swing came out as big as its Crush. Attack and Magic feed enemy abilities, as the document says.
- **Siphon is simplified:** the holder gains the share whether or not the target had that much MP.
- **Hidden fallback:** if every foe is Hidden, foes pick among them anyway, so a fight can't stall.

## 2. What was built

In the repo's existing structure, as asked, all available, no progression.

- **Schema 0.6:** weapon kinds, three gear slots with armor weights, revive, summon and replace, extra strikes, Seek, the Taunt and Hidden rules, Aegis, absorption, the new target phrases. Verbs, traits and keyholes are gone; perks stay in the tech, unused.
- **Engine:** every rule in the documents, each with a test (27 new arena tests; 283 pass in all). The worked example still runs, migrated, as the machinery's fixture.
- **Content as a generator:** `content/core-set/` builds the pack in the documents' own words, with every first value as a named constant in one file (`scale.ts`). It writes `content/core-set.pack.json`: 16 classes, 48 class abilities and 16 passives, 10 formations, 90 pieces of gear, 36 enemies (32 plus 4 reskins), 29 encounters, 7 dungeons. The validator passes it with no warnings.
- **Smoke check:** `npm run smoke` plays the documents' own tests (the beats and fails trio of every encounter, the "clears it" trios of every run) in about two seconds. `--log <stage>` prints one fight; `--kit best` dresses everyone in the generic kit.
- **Harness:** studies can name trios; the first core-set study runs 320 runs in 1.4 seconds.
- **The numbers:** amount stats at 1,000 per point of the scale, as the README asks. Percent stats (Crit, Evasion, Accuracy, resistances, Lifesteal, Siphon, Double strike) are stored in percent points, since a percentage can't be ×1,000; a class's Crit n is 5n%. Armor takes 12% of its value off each physical hit, a ruleset knob, because a point of Armor can't be worth a point of HP under a flat-per-hit rule.

**The known gaps,** answered with the engine's defaults, as the rules document says to until decided: sub-ticks stay; same-moment order is party batch first, then pulses, reactions, actions in slot order; the three timing stats stay hidden behind Haste, Slow and Chill; per-unit dice; a stated rule that finds nobody fails with no MP and no cooldown (see E); the 5,000-tick safety stop stays; damage is rounded down once after mitigation, Aegis is checked on the rounded amount, shields soak whole points. None of these needed bending to build the set.

## 3. What the numbers say

**Regular encounters behave.** With the starting kit, the "beats" trio wins 24 of 29 encounters in all 20 seeds; of the five that don't, four are bosses and the fifth is the Grave Watch at 70%. Fights last 20 to 40 ticks. The one content bug of the build was found by reading one log, not by a number: Bulwark's, BROKEN's and Doom's "when I end" reactions fired for any status ending on the holder (a Poison expiring refilled the Titan's Bulwark). Fixed; the validator now warns on the pattern.

**Bosses, fresh, starting kit, 20 seeds:**

| Boss | Beats trio wins | Ticks | Fails trio wins |
| --- | --- | --- | --- |
| Ogre Chief | 65% | 109 | 65% |
| Reaper | 100% | 102 | 0% |
| Fire Giant | 0% | 63 | 0% |
| Ice Titan | 100% | 83 | 35% |
| Storm Queen | 75% | 98 | 100% |
| Silent One | 100% | 127 | 100% |
| Storm King | 60% | 102 | 0% |

The Reaper, Ice Titan and Storm King read as designed (the trio with the answer wins, the trio without loses). The Fire Giant is decision A. The Storm Queen's and Silent One's "fails" trios win because they're plate parties that simply outlast, which is decision C's point.

**Runs, 20 seeds:**

| Run | Clears-it trio | Starting kit | Best kit | Where it's lost (starting kit) |
| --- | --- | --- | --- | --- |
| 1 Old Road | Knight, Cleric, Ranger | 50% | 100% | the Chief 7, the Bridge 2 |
| 2 Crypt | Ranger, Cleric, Pyromancer | 35% | 100% | the Ghoul Pit 10 |
| 2 Crypt | Hoplite, Cleric, Stormcaller | 95% | 100% | – |
| 3 Fire Mine | Frostweaver, Knight, Cleric | 0% | 0% | the Giant |
| 3 Fire Mine | Hexer, Geomancer, Cleric | 0% | 0% | the Giant, the Imp Kennel |
| 4 Ice Pass | Ranger, Valkyrie, Cleric | 100% | 100% | – |
| 4 Ice Pass | Hoplite, Ranger, Cleric | 0% | 100% | the Titan |
| 5 Storm Tower | Bramble knight, Assassin, Frostweaver | 0% | 25% | the Wisp Nest 17 |
| 6 Deep Crypt | Bard, Monk, Cleric | 10% | 100% | the Grave Watch 16 |
| 7 Tower Top | Valkyrie, Assassin, Monk | 25% | 100% | the King 11 |

Run 1 is the document's one explicit promise: clearable by the ungeared starting trio. It's at 50% (the harness study says 35% to 65% over 40 seeds), and the party reaches the Chief at 90% HP, so the loss is the boss fight itself, not attrition. I'd want it nearer 75%, which is a Chief number for the balance pass. Everything from run 3 on is out of reach ungeared and in reach with a kit, except the Fire Mine (decision A) and the Storm Tower, where the Queen's Drones outlast even a geared party (25%).

**How sure:** 20 seeds per cell, one formation, the documents' trios only. Enough to say which way a fight goes, not by how much. The harness study on runs 1 and 2 (four trios, 40 seeds) agrees with the smoke table and adds one reading: a Pyromancer in the Crypt lowers a party's wins (holds in 18 of 20 seed blocks), which is the Ranger, Cleric, Pyromancer trio losing to Ghouls that raise each other faster than it kills.

**Held out:** formations other than Neutral, abilities in any order but the documents', every trio but the named ones. Nothing here says how those behave.

## 4. Feel

A fresh reader (an AI with no access to the rules or enemy stats) read five run logs from the harness study, retold them and answered the sheet. Its colour picks for the three lost runs were sensible (plate plus a healer plus area damage) and none of them clears run 1 at 50% ungeared, which says more about run 1 than the reader. What it found:

- **A run is one long fight with scene changes.** No recovery between fights, so the starters' danger peak on the Old Road is the Snake Pit's poison rolling into the Bandit Camp's archer crits, not the boss. Sending a party with two dead members into the next fight "felt broken rather than harsh". That's the rule as written; you should know it reads that way.
- **Boss fights are long and shapeless:** one monstrous move every 30 to 40 ticks and a hundred lines of ticks between, with no sense of how close the boss is to dying. The Chief's plain 500s are noise next to an 8,400 Crush, "so it has effectively one move". The Death Bell read better than Crush "because you can count down to it".
- **The telegraph is ignored.** "Nothing the party does reacts to 'Ogre Chief begins Crush'. The eight-second telegraph is right there and the auto-fight ignores it." Decision A.
- **Promises the log doesn't keep.** The Hoplite "plants its shield beside the most vulnerable ally to catch the killing blow"; in its run the Stormcaller took the killing blow three times and Aegis caught a 20-damage snake bite. At full HP, "the ally with the lowest share of HP" is anyone. The Hoplite's named Spear thrust hits for a quarter of its plain swing, since Phalanx makes the plain swings the crushing blows; it reads oddly. The Stormcaller spent 85 of 290 ticks dead.
- **Dramatic moments exist.** The Chief's Crush crit killing a full-HP Knight through its Shield, the Cleric raising it eight ticks later, and the Knight's next bash cancelling the second Crush: "the one time in five packs where something the party did answered something the enemy was doing". A Knight's lone 90-tick stand that lost on the last hit. Doom taking the Vampire to 500, Bloodlust kicking in, a drain back to full.
- **For the interface, not now:** status numbers mean nothing to a reader ("SHOCK 2.8", "BURN 9.2"); "takes 500, 500 soaked" reads as 1,000; heals have no source; "SHIELD ends" prints before the hit that ended it; "0 BLOCKED" then "POISON" looks like a bug (it's a hit that Armor zeroed, which still lands). The full list is in `feel-answers.md` beside this report and is worth keeping for the interface step.

**Two stories worth your two minutes**, retold from the logs:

*The Old Road, won.* Knight, Cleric, Ranger. The road is quiet until the camp, where the first Prayer of the run finally lands at tick 22. At the Chief, a Crush crits the Knight for 8,400 through a 1,500 Shield and kills it from full. The Cleric raises it. Its next Shield bash lands inside the second Crush's wind-up and cancels it. The third Crush lands for 5,400 and leaves the Knight at 1,100. The Chief dies to a Burn tick.

*The Old Road, lost.* Same trio. The Snake Pit's poison leaves the Cleric at 42% and the Ranger at 33% going into the camp. An Archer's opening crit kills the Ranger; another kills the Cleric twenty ticks later as it starts a Prayer, its Raise still eight ticks from ready. The Knight fights alone for ninety ticks, kills three of the four, sits at 460 HP behind Shields that run out as volleys land, and dies to the last Archer, which needed one more hit.

## 5. Method notes

- **Starting at build-and-tune from four documents worked.** The documents' own tests (a beats and a fails trio per encounter, a clears-it trio per run) became the smoke check unchanged, and that two-second loop is what the tuning ran on. Write content design with its tests in it; they're the harness's input.
- **Read one log before round 2.** The biggest content bug (Bulwark refilling itself) and the Fire Giant's real cause (interrupt timing, not damage) both came from a single log, after totals had pointed the wrong way. Decision A's whole case is one log and one variant run.
- **Do a numbers sanity table before round 1.** Three of eight rounds went on first values a one-page table of "a swing against each HP and Armor" would have caught (enemy swings scaled from Attack; cooldowns longer than fights). Next time, the table first.
- **The feel check earns its cost.** It found the empty opening ticks, the Raise retry loop and the Hoplite's broken promise. No number showed any of them.
- **Sampling, not sweeping, is the right shape for the balance pass.** 560 trios × 29 encounters × 10 formations is out of reach at volume, and unnecessary. Proposed: per encounter, the named trios plus a random sample of about 20 trios in a sensible per-class kit, played in-run (not fresh), 20 seeds, and the "failable by most" claim read off the sample with its confidence. That's a few thousand runs, under a minute, and the harness already does the "how sure".
- **The ×1,000 scale with percent stats in percent points** was fine to build on, but it needs saying in one place for whoever builds the display. It's in `scale.ts` and the README.

## What's next

Your sign-off on this report, with decisions A to E. Then the step's decisions go into `DECISIONS.md`, the concept spec and the primer, and the visual interface comes next, so you can see and play the slice before the balance pass.
