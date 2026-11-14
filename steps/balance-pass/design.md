# The balance pass: the design, for the director's gate

Your intent is in `intent.md`. This is what I'd do, and why. Nothing is tuned yet.

## What I found

**Your run.** I replayed your second run at its own build and counted every fight.
- **From act I's floor 8 on,** your party (Bramble knight, Cleric, Geomancer, in the Pack) ended most fights with as much HP as it started.
- **Act II's regular fights:** the foes dealt 38–51% of the party's HP. Shields soaked about half of it, and Cure and Regen healed the rest. The net cost was −1% to +12%.
- **Act II's elites** cost −5% and −12%.
- **The lowest anyone fell** was usually 70–80%.
- **The Cleric's MP** stayed at 6,500 of 6,500 through most of act II.
- **Then the Ice Titan** dealt 190–260% of the party's HP and wiped you twice.
- So the road gave no warning before the wall.

**Today's game.** I measured it against the twelve hand-built rosters with a new tool, the road read (`tools/road-read.ts`). The road is uneven, not just soft.

| Act II's regular fights, today | Cost | Fights nearly free | Lowest member |
| --- | --- | --- | --- |
| The two rosters whose trios have a Cleric (holy, tempo) | 5–6% | 69–78% | 48–59% |
| The same two with the Cleric left out | 16–20% | 0–8% | |
| Rosters with no healer (storm, earth-wall) | 33–38% | 0% | 23–24% |
| All twelve | 20% | 26% | 39% |

- **The Cleric takes about two-thirds off a regular fight's cost.** Every draft offers a healer, so nearly every run you play has one. That's why everything was soft.
- **Act III's elites lose 29% of fights on average:** the creative-builds pass left them unbalanced. A single knob can't fix both problems. Set to make the Cleric parties pay, it kills the parties without a healer.
- **Smaller heals don't help.** A Cure 30% weaker moved the Cleric rosters from 5–6% to 6–8%: against foes this soft it over-heals, so it just casts more. What helps is foes that hit faster than the healing can undo, and a healer that heals less often.

**It isn't only the Cleric.** Each class was left out of the rosters that hold it, one at a time. The table shows how many points of party HP that class takes off a fight, averaged over those rosters (2 seeds each, so about ±4).

| Class (rosters holding it) | Act I fights | Act II fights | Act II elites | Act III fights | Fights it makes nearly free (act II) |
| --- | --- | --- | --- | --- | --- |
| Bramble knight (3) | 23 | 15 | 19 | 24 | 8 in 100 |
| Knight (5) | 25 | 10 | 13 | 16 | 14 in 100 (37 in act I) |
| Valkyrie (5) | 6 | 16 | 16 | 17 | 9 in 100 |
| Cleric (6) | 4 | 15 | 15 | 9 | 43 in 100 |
| Paladin (3) | 0 | 5 | 0 | 13 | 8 in 100 |
| Vampire (2) | 9 | 0 | 0 | 10 | none |
| The other ten classes | 7 at most | 3 at most | 12 at most | 12 at most | 7 in 100 at most |

- **The walls and healers** (the Bramble knight, the Knight, the Valkyrie, the Cleric) each take 10–25 points off a fight. A damage dealer takes under 7 on most tiers.
- **The Cleric is the one that makes fights free,** because it tops everyone back up. The others make fights cheaper.
- **Your party had two of the four,** the Bramble knight and the Cleric, plus the Geomancer's Shields.

## Decisions

1. **Protection's lead.**
   - **A (recommended): a ceiling, then a harder road for everyone.**
     - First, fights hit harder (decision 2). At the same average cost, that narrows every protector's lead a little: rosters with a wall or a healer pay 3–7 points more, the others 1–4 less.
     - Then trim at the source whoever still sits over the ceiling. The ceiling: no class takes more than about a third off its rosters' fights, and none makes more than about 1 fight in 5 nearly free. Today that's the Bramble knight, the Knight in act I, the Valkyrie and the Cleric.
     - For the Cleric, the trim is healing less often (Cure on a medium cooldown); its size and MP stay. A smaller Cure barely helped, because it just casts more. The others' levers are found in the tuning: the part of each kit that soaks or heals.
     - Then every fight's knob is set to the harder targets (decision 3).
     - The Cleric's trim plus the harder fights, measured on act II at a 27% average cost: the Cleric rosters pay 13–17%, most others 22–38%, nearly-free fights fall from 26% to 7%, and losses stay at 2%.
     - **The Knight in act I** is the wall problem you've said you'll fix another way. A ceiling would narrow it too. Say whether the Knight stays out of this.
   - **B: leave protection as it is and set the road against the protected parties.**
     - At the level where the Cleric rosters pay 15–22%, the rosters with no healer at all pay about half their HP (47–63%) and lose 8–19% of their regular fights.
     - A wall or a healer would become every run's start.
2. **Fights hit harder and end sooner.**
   - Today a regular fight's foes have +40% HP and −10% damage on top of their knob; I'd turn that around, to about −40% HP and +60% damage. Elites the same way.
   - Every fight's knob is then re-measured, so this changes the shape of a fight, not its cost.
   - At the same cost, danger shows (members fall lower) and the gap narrows a little: the Cleric rosters pay 8–9% instead of 5–6%.
3. **How hard.** Each fight's knob is set so the rosters' average cost is:

   | | Act I | Act II | Act III |
   | --- | --- | --- | --- |
   | Regular fight | 18% (today's target 14) | 25% (15) | 28% (18) |
   | Elite | 30% (20) | 40% (21) | 45% (24) |

   - Two more checks: no roster loses more than about 1 regular fight in 10, and no roster's fights are nearly free more than about 1 in 5.
   - One measure for the whole road: the rosters, in every act. Today acts II and III are set against the build parties, act I against the rosters.
   - I'd add your run-2 party (Bramble knight, Cleric, Geomancer, on the Hunt's formations) as a thirteenth roster, so the road is measured against the kind of party you actually build.
4. **Bosses.**
   - Today the build parties beat act I's, II's and III's bosses 35%, 35% and 20% of the time, from rolled starts.
   - I'd keep each boss about where it stands, re-checked once the road is set, so it stays its act's hardest fight.
   - The road rising is what shrinks the jump from road to boss.

**Not in this pass:** the run's own recovery (a potion or a tonic after every fight, 50% MP to the bench, campfires). If fights that cost more still feel soft over a run, that's the next lever.

**The simulated player** wins 8% today and will win less after this pass. It plays well below you, so its win rate isn't a target. The checks are the road read, the build test, and a feel read of a party with a healer through act II.
