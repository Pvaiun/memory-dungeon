# The balance pass, part two: whole runs and the knobs

The director's intent and this part's rulings are in `intent.md`; part one's report is `report.md`. Everything is committed on `claude/simulated-run-balancing-pass-d1qyam`. Engine 0.22; the schema gains one optional knob (`eliteEarly`).

## Decisions for the director

1. **Act III's bosses against the build parties.**
   - **As tuned:** the simulated player's parties that reach act III's boss lose 48% (target 45%). The rung-3 build parties win 17–56% of act III's bosses from a full start: six builds win 17–28%, Bonfire 44%, Cold Snap 52% and Blood Pact 56%.
   - **Why the gap:** the simulated player's survivors pick their best three of six or seven for a boss they've seen all act. Each build party is one fixed trio, often against its build's worst kind of fight.
   - **The alternative, measured:** act III's bosses 50 knob points softer. The builds win 44–65%, the simulated player loses 27% there, and the runs won go from 12% to 16%. This was measured before the last two changes (the class steps and the boss shape), so it's indicative.

   **Recommended:** as tuned. The bosses then rise to the last (22 → 35 → 48% lost).
2. **The win rate is 9% at heat 0,** against the 14% estimated when you chose fights by cost. The class half steps (below) trimmed the simulated player's favourite picks, so it now loses more between bosses. To get back to about 14%, lower the bosses' targets (not measured). Otherwise it stays at 9%.
3. **The Tower Top's bosses are slogs.**
   - The King's Guard averages 155 ticks and the Storm King 180, against 62–115 for every other boss. The enrage starts at tick 200.
   - The Storm King is an Avenger: his Soldiers are tough, Taunt and come in waves, and the boss knob scales their HP with his.
   - **The fix is an enemy question:** a smaller share of the knob on summoned adds (a rule), or fewer Soldiers a Rally (content). Nothing is changed.
4. **Wall-less starts:** set aside, as you said. For the record, at today's knobs a party without a wall loses about 15% of act I's regular fights on floors 4–6, against about 2% with one.

## What was built

**Act I, measured against act I's own parties.** Part one set act I's knobs against rung-1 build parties in a full set of commons and uncommons. Act I's regular fights and elites are now measured against the hand-built rosters at act I's power (two abilities, two legendaries, a couple of common pieces). The simulated player's parties on floors 8–11 hold about that: 2.1 abilities a member and 1.8 legendaries.

| What changed | Now | Before |
| --- | --- | --- |
| Climb below the reference floor, regular fights | 36 a floor, measured by `rogue:calibrate --climb` | 28.3, a hand value |
| Elites' own climb below their floor | 20 a floor (`eliteEarly`, new) | the regular fights' climb |
| Act I's climb above the reference | 10 a floor | 4.5 |
| Packs start growing | floor 9 | floor 8 |

- **The elites' own climb:** the floor 5–6 elites were free, losing nothing in 260 meetings. They now lose 4–5% and cost 13–14% of HP, like the later elites.
- **The steeper climb above the reference:** the fights keep rising toward the boss as the party grows.
- **Growth from floor 9:** growing packs on floor 8 as well, just after the chest, made it the hardest regular floor of every act.

**The easy pools are measured,** where part one left them alone:
- act I's against the rosters' real starts (one random ability each);
- acts II and III's against the build parties, like their normal pools. Against the rosters they came out harder than the act's middle.

**The run tuner, on your ruling.** `rogue:tune` sets each boss toward its target and evens out the regions within an act, each region with its own knob for elites. It no longer aims at the losses between bosses.

**Bosses are shorter and harder.**
- A boss shape of −40% HP and +30% damage on top of the knob. At the knobs whole runs need, the knob alone (HP +k%, damage +k/2.5%) gave act III's bosses 2.7–4.5 times their HP. Fights ran to 130–180 ticks, and the enrage decided them.
- Boss fights now run about 65 ticks in act I, 66–99 in act II and 85–115 in act III (except the Tower Top's).

**Class half steps,** on the five classes outside the sheet's ±8 band, where whole runs agreed on the direction.

| Class | Change | Sheet before → after | Whole runs as leader (300 runs, same seeds) |
| --- | --- | --- | --- |
| Vampire | HP 4 → 3 | +11.4 → +6.9 | 27% → 14% |
| Valkyrie | Attack 4 → 3.5, Defense 3 → 2.5 | +12.5 → +9.4 | 12% → 9% |
| Bramble knight | Defense 3 → 2.5 | +9.9 → +7.2 | 13% → 11% |
| Ranger | HP 3 → 3.5 | −10.2 → −7.5 | 5% → 6% |
| Assassin | HP 2 → 3 | −14.2 → −8.8 | 5% → 5% |

- The Vampire was the clearest. Its Lifesteal keeps it whole from fight to fight, which a single fight doesn't show, and it led whole runs at three times the mean.
- The Valkyrie (+9.4) and the Assassin (−8.8) are still just outside the band.
- The sheet's flags fell from 151 to 132.

**Tool fixes:**
- `rogue:calibrate` wrote the measured knob as a fight's own knob, so act I's −25 was counted twice. It now subtracts the act's and region's offsets, as `build-calibrate` does.
- Its `--climb` figure now counts the act's offset.

## What the numbers say

**Whole runs** (the simulated player, 3,000 runs, heat 0):

| | Before | Now |
| --- | --- | --- |
| Runs won | 19% | 9% |
| Lost on act I's road (fights, elites) | 47% of runs | 31% |
| Bosses beaten, acts I / II / III | 91 / 75 / 90% | 76 / 64 / 52% |
| Regions within an act | 18–58% lost | act II 54–56%, act III 57–63% |

Lost by floor, every fight on it, now (before in brackets, act I only, 200 runs):

| Floor | 4 | 5 | 6 | 8 | 9 | 10 | 11 | Boss |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Act I | 2% (7) | 5% (14) | 8% (10) | 11% (28) | 12% (13) | 11% (11) | 14% (17) | 24% (9) |
| Act II | 5% | 10% | 7% | 7% | 8% | 9% | 10% | 36% |
| Act III | 2% | 9% | 3% | 8% | 6% | 5% | 11% | 48% |

Each act climbs to its boss; floors 1–3 lose under 2%.

**By tier, now** (cost is the HP a won fight takes; "close" is a loss with the foes under a quarter of their HP):

| Tier | Lost a fight | Cost | Ticks | Close when lost |
| --- | --- | --- | --- | --- |
| Easy | 0% | 5–9% | 28–36 | — |
| Regular, act I / II / III | 9 / 3–6 / 3–4% | 11 / 6–8 / 7% | 48 / 50 / 40 | about a third |
| Elites | 9–13% | 11–16% | 62–73 | 32–45% |
| Bosses, act I / II / III | 23–27 / 27–35 / 41–53% | 34 / 34–37 / 21–26% | 65 / 80 / 120 | 52–56 / 45–52 / 25–31% |

- **The shape is bimodal:** the simulated player's regular fights are cheap when won, and its losses are wipes of weak parties. That's why the losses between bosses aren't aimed (your ruling).
- **Close when lost:** act I's and II's lost bosses are close about half the time; act III's about a quarter, the Tower Top's least.

**The build test** (own act; formation parties; rolled starts):

| Build | Rung 1 before → now | Rung 2 | Rung 3 |
| --- | --- | --- | --- |
| Landslide | 92 → 87 | 93 → 87 | 88 → 75 |
| Thousand Cuts | 99 → 99 | 94 → 88 | 85 → 70 |
| Bonfire | 100 → 99 | 100 → 98 | 95 → 82 |
| Cold Snap | 93 → 96 | 97 → 95 | 90 → 77 |
| The Storm | 98 → 99 | 82 → 78 | 88 → 74 |
| The Hunt | 80 → 87 | 87 → 84 | 89 → 75 |
| The Toll | 98 → 88 | 88 → 83 | 74 → 65 |
| Barrage | 68 → 80 | 78 → 73 | 83 → 68 |
| Blood Pact | 93 → 86 | 90 → 88 | 95 → 83 |

- **Overall:** the builds sit closer than before: rung 3 spans 65–83%, against 74–95%.
- **Bosses:** the build parties win bosses 42% from rolled starts and 53% from full ones, against 70% at part one's knobs (decision 1).
- **Regular fights and elites:** the build parties still win 99% of regular fights and 91% of elites.

**Heat** still steps evenly: 9% won at heat 0, 8% at 1, 4% at 5, 2% at 10.

**How sure:**
- The whole-run rates are good to a point or two.
- Act III's single bosses have 40–90 meetings a measure, so ±6 points.
- The leader runs are 300 each, so ±3 points.

## Still open, from part one's list

- **Bonfire rung 2** still wins 98% (93% of bosses).
- **Barrage rung 1** can't beat act I's bosses (6%); its rungs 2–3 win 13–28% of bosses.
- Blood Pact rung 1's stall, trainings' worth beside pieces, and the ablation's worse-than-nothing items are untouched.
- **MP across a run:** parties reach bosses with 82–88% of their MP, so the bench and tonics keep up. The run-level worth the single fights missed showed in sustain (the Vampire), not MP.

## Samples worth looking at

- `npx tsx tools/rogue-feel.ts --player --runs 120 --packs 12`: the simulated player's runs. Its Storm Queen pack (before the boss shape) is the slog: half the party's damage went into twelve summoned Drones, and the enrage ended it.
- `npx tsx tools/build-test.ts --fixed-start`: the build parties against bosses as they arrive after a campfire.
- `npm run rogue -- --runs 3000`: the whole-run digest above.
