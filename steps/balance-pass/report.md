# The balance pass, part one: build parties against chosen fights

The director's intent is in `intent.md`. This part balanced the build parties against the build test's fights and set the knobs' baseline; the whole-run tuning is the next part's. The director approved everything below. Engine 0.22. Everything is committed on `claude/loot-system-balance-8224ot`.

## What part one changed

1. **Barrage, by its own pieces.** These changes take Barrage from 48/70/81% by rung to 62/78/83%; every other build wins 74–100%.
   - **A max MP step brings an HP step beside it** (`MP_STEP_HP`, over the piece's budget): a mana piece's MP comes free.
     - Probed on every class that can wear them, against their slot's average, the casters' mana pieces sit 3.1 points over it, against 1.0 with no bonus.
     - An Attack step as well had made them the casters' best gear in every build (5.6), so it's out.
   - **Barrage's own links and seats, strengthened:**
     - Encore 450 MP (was 650);
     - Twice-told tome every second ability (was every third), Bell of the hour every fourth swing (was fifth), Matins robe every second ability free (was third);
     - Glimmer robe half again (was a third), Tithe wand a tenth of Attack (was 3%);
     - Wellspring's Soloist a third sooner (was a fifth); The stage's a third off per ally cast (was a fifth);
     - both Soloists deal half again as much.

     The other builds didn't move, and the two formations probe 12–13 points over Neutral, like the rest (9–13).
   - **What's left is the routes, not the payoff.**
     - The Knight-Bard-Pyromancer route is in line: 82/83/92%.
     - The three-caster route (Frostweaver, Bard, Stormcaller) stays at 43/63% at rungs 1–2: its soloist, a 2,000-HP Stormcaller, falls with nobody in front.
     - The Cleric route was 62% at rung 1, when its Vampire knew only Blood gift.

     With every soloist and every pair of servers:
     - a Pyromancer or Stormcaller soloist with two sturdy servers wins most;
     - one support (the Bard or the Cleric) among the servers costs a few points;
     - both supports cost far more.

     The swaps below were measured before this round's changes:

     | Route 2 with | Rung 1 / 2 / 3 won |
     | --- | --- |
     | the Bard swapped for a Valkyrie | 70 / 77 / 83% |
     | the Frostweaver swapped for a Knight | 68 / 75 / 94% |

     Elsewhere the Bard and the Frostweaver hold their own:
     - in the Storm's and the Toll's tankless routes, the Bard beats the Cleric in its seat;
     - Cold Snap's tankless route falls from 90/100/92% to 75/88/63% without the Frostweaver.

     Their weakness is damage, not frailty: they have HP 3, the Bard deals 0.29× an average unit, and the Frostweaver 0.85×, the bottom of the dealers' band. Other builds' tankless routes win on their own damage or control.
   - **The build parties' Soloist** slots the abilities that deal damage first, as a player would. The cathedral had freed the Geomancer's Earthen shell, cast 15 times a fight.
   - **The routes stand as builds.md writes them.** Route 3's Vampire knows Blood drain at rung 1: Drain the well, its Barrage version, is tagged for Barrage's first rung, as the mana link it is. That measured 33% to 68% there, before this round's other changes, and the build test hasn't been run with it.
2. **Riders of a damage status are sized to the status.** `APPLIED` in `scale.ts` makes every rider stat-scaled at a share of its words, on the party's side only (applied when the pack is built, `pack.ts`):
   - Chill at 0.2;
   - Burn at 0.25;
   - Bleed at 0.6.

   A stack of Burn or Bleed deals about three swings over its life, and Chill caps at 12, so "a few X" on every swing was worth about three swings, and Chill shattered every couple of hits. Abilities keep their hand-set sizes.

   It changes what the appliers add, not how the statuses work: their caps, values and lengths are untouched.
3. **An engine fix.** A status at its cap capped again on an application that added nothing, before its own shatter had spent it. Two Chilled foes passing cold to each other shattered hundreds of times in one tick, refilling the Frostweaver's MP and readying Icicles each time. Now a status caps only when an application brings it to its cap, as Chill's card says.
4. **Stat lines (contentious):**
   - MP pools raised for longer fights, on half steps: Knight 2, Hoplite 2, Valkyrie 2.5, Monk 1.5, Vampire 2.5. They were sized for "two or three fights" when fights ran about 20 ticks. At the new knobs fights run 40–70, and these classes were short of MP 14–23% of their time (band: 8%). The other pools are as they were.
   - **A half-step pass over every class's stat line.** I don't expect it to balance the game dramatically: the big gaps this pass found were in the loot (riders, stacked Evasion, runaway pieces), and class wins now run −14 to +12 against a ±8 band. A quarter more HP on the Assassin, the class furthest under, lifted its builds only 1–3 points. A targeted half step on the six classes outside the band is worth doing in the next part, once whole runs show which way each leans.
   - A piece's Evasion is its own step, 12 and 20 (`PIECE_SPECIAL`); class lines keep 20 and 35. Thousand Cuts stacked two or three Evasion pieces to 60–75% (the cap), worth 2.5–4× their HP.
5. **Two of loot.md's held-back levers are now in use:**
   - half again in place of double: The Red Feast, Twinfall, Hummingbird charm;
   - no "many" in one application: Bloodied ground.

## What was built

- **The knobs' baseline.** `tools/build-calibrate.ts` (new; in the code map) bisects every regular fight's, elite's and boss's knob against its act's 27 build parties from rolled starts. Targets:
  - regular fights cost about a fifth of HP (about 97% won);
  - elites cost about a third (about 90% won);
  - bosses are won 70%, and lose close more often than not.

  Fights now last about 40 ticks for a regular fight, 55 for an elite and 70 for a boss; before, they lasted 13–30, and abilities fired once a fight. Act I's knobs were measured against rung-1 parties wearing a full set of commons and uncommons, so they sit high for a run's first floors. The easy pool kept its knobs. `rogue:calibrate` overwrites per-fight knobs.
- **Tools.**
  - The build parties hang drawing pieces (a Taunt, or Aggro on the stat line) only on a member that stands in front. Challenger's token had killed the rung-1 Stormcaller and Assassin in nearly every fight.
  - Barrage's formations seat the caster as Soloist first. The Frostweaver and the Vampire can stand in front.
  - The packs list offhands and trained passives. The build test's workers no longer answer other tools' messages.
- **Content, by what each fixed** (each commit message has the numbers):

  | What it fixed | The changes |
  | --- | --- |
  | Runaways | Venom vial (Bleed grew without end), Meltwater orb, Floe charm, The long winter, Glacier's heart, Ritual staff, Monolith shield. |
  | Too strong | Gleaner's leathers, Tallymail, Bloodscent knife, Bloodied ground, Heartsblood, The Red Feast, Twinfall, Canopy staff, The covenant; the Hoarfrost line and Icefall seats at a Chill a swing. |
  | Too weak or never cast | Frost lance and Blizzard a hit word bigger. Pyre, Tremor, Static charge, Flow, Aspis, Spear thrust and Chain lightning cheaper or sooner. Allegro's power step cheaper (it made the party weaker). |
  | Behaviour | Choosing waits for an ally below half, not 80% (it spent the revive's cooldown at tick 3). Saint's mace counts the healing that lands. Penance pays a tenth. The stage's Well Taunts at the start. |

  No enemy changed: no enemy beats most builds (the King's Guard is the hardest, with four builds under half).

## What the numbers say

The build test at the final knobs (own act, 6 seeds), and at every fight's knob +80, where the strong builds come off the ceiling.

| Build | Win r1 / r2 / r3 | At +80 | Bosses | Ticks a fight |
| --- | --- | --- | --- | --- |
| Landslide | 92 / 96 / 88 | 73 / 77 / 72 | 73% | 52 |
| Thousand Cuts | 99 / 95 / 85 | 78 / 76 / 58 | 83% | 44 |
| Bonfire | 100 / 100 / 95 | 76 / **97** / 72 | 96% | 27 |
| Cold Snap | 94 / 98 / 91 | 47 / 78 / 67 | 82% | 36 |
| The Storm | 98 / 83 / 86 | 77 / 70 / 69 | 61% | 31 |
| The Hunt | 81 / 88 / 87 | 36 / 66 / 68 | 57% | 31 |
| The Toll | 98 / 88 / 75 | 71 / 76 / 55 | 62% | 54 |
| Barrage | **52** / 71 / 85 | **6** / 55 / 70 | 35% | 67 |
| Blood Pact | 93 / 91 / 95 | 66 / 83 / 88 | 78% | 79 |

- **Build by build:**
  - The status builds are no longer two to three times faster than the rest. Cold Snap's fights went from 15 to 35 ticks, and Bonfire's from 20 to 27.
  - Cold Snap's Chill now creeps over five hits before a shatter at rung 1.
  - Bonfire's fire rises and sags with the feeding.
  - Thousand Cuts no longer lives by dodging (one dodge in three packs).
- **The rhythm read matches the cards on the main lines:** Bonfire's damage rises across the fight, the Hunt's first kill is the earliest, Blood Pact spends HP over MP, and Barrage spends the most MP.
- **Balance sheet (rogue column).**
  - Burn, Shock and Bleed now sit inside their 5–35% band; the Status had Burn and Shock just over it.
  - Class wins run −14 (Assassin) to +12 (Valkyrie): the Assassin (−14) and Ranger (−9) are under the ±8 band, and the Valkyrie (+12), Bramble knight (+9), Vampire (+9) and Paladin (+8.5) are over it.
  - Formations sit 9–13 points over Neutral (band ±7).
- **How sure.** Each number is about 160 fights a rung (27 parties × the act's fights × 6 seeds), so a few points either way.

## For the next part (whole runs and knobs)

- **The calibration's rosters are refreshed** (`tools/rogue-parties.ts`): each of the twelve plays one of the nine builds, and every build has at least one roster.
  - They stand in that build's formation by act: Neutral at a run's start, then its common, rare and legendary one.
  - Each trio is seated by the formation's seats.
  - Their legendaries and trainings follow the build's tags.

  They had all stood in Neutral with random legendaries and only power steps. Nothing has been measured against them yet: `npm run rogue:calibrate -- --climb` is part two's first step, and a first climb may move the knobs a long way from this part's baseline.

- **Bonfire rung 2** runs about 15 points over the field at the harder knobs. No single item carries it, and the Pyre line formation's two trims moved nothing.
- **Blood Pact rung 1, the Vampire route,** stalls to the enrage. At rung 1 its kit is all healing (Choosing, Cure, Raise), so it ends fights fuller than it starts. The cause is how the filler picks known abilities by the build, not a piece.
- **Bosses.**
  - Physical builds win about 60% of bosses against about 90% for the status builds. The cards allow some of this (Storm, Hunt and Toll name a lone boss as their worst fight).
  - Bosses' great blows kill a full-HP back-row unit outright (Crush about 5,200 on 3,500 HP, Hailstorm about 2,400 on 2,000). That's an enemy question if whole runs show it deciding fights.
- **Trainings are worth little beside pieces.** Over the build test, a version averages 0.9 points of HP a fight and a power step 0.6, against 4.6 for a piece and 8.3 for a formation.
- **Worse to have than not, by the ablation:** Refrain B, Earthen shell B (Rampart), Shieldmaiden A and B, Stand fast A and B, Cold hex A, War ballad B and Encore A.
- **Unchanged and noted:**
  - The Hexer's MP pins at max (Siphon on Malison's many targets).
  - Hoplon prints zero-damage lines.
  - The filler hangs Floe charm on parties with no Chill.
  - The one-swing-shape lever isn't applied: the Landslide Hoplite stacks three slow shapes.
  - Hunter's mark and Gravemark mark the lowest current HP rather than the dangerous foe; that rule is the director's.
- **For the run tuning:**
  - The knobs here were set against strong, on-build parties, and act I's against full rung-1 gear.
  - The build test's rolled start gives every party 50–100% MP, which undervalues mana gear against a run.

## Samples worth looking at

- `npx tsx tools/rogue-feel.ts --builds barrage --rungs 1,2 --packs 3`: Barrage's openings and the Well falling.
- `npx tsx tools/rogue-feel.ts --builds snap --rungs 3 --packs 3`: the cascade as a string.
- `npx tsx tools/rogue-feel.ts --builds bonfire --rungs 2 --packs 3`: the strongest rung.
- `npx tsx tools/build-test.ts` writes the strength, the rhythm read and the ablation (`out/build-test/report.md`). Set `BUILD_TEST_PACK` to a variant pack to price a change.
