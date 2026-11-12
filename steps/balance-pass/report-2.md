# The balance pass, part two: whole runs and the knobs

The director's intent and this part's rulings are in `intent.md`; part one's report is `report.md`. Everything is committed on `claude/simulated-run-balancing-pass-d1qyam`. Engine 0.22; the schema gains an optional knob (`eliteEarly`) and a summon's `hp` share.

## Decisions for the director

1. **Act III's bosses against the build parties.**
   - **As tuned:** the simulated player's parties that reach act III's boss lose 48% (target 45%). The rung-3 build parties win 17–56% of act III's bosses from a full start: six builds win 17–28%, Bonfire 44%, Cold Snap 52% and Blood Pact 56%.
   - **Why the gap:** the simulated player's survivors pick their best three of six or seven for a boss they've seen all act. Each build party is one fixed trio, often against its build's worst kind of fight.
   - **The alternative, measured:** act III's bosses 50 knob points softer. The builds win 44–65%, the simulated player loses 27% there, and the runs won go from 12% to 16%. This was measured before the last two changes (the class steps and the boss shape), so it's indicative.

   **Recommended:** as tuned. The bosses then rise to the last (22 → 35 → 48% lost).
2. **The win rate is 10% at heat 0,** against the 14% estimated when you chose fights by cost. The class changes (below) trimmed the simulated player's favourite picks, so it now loses more between bosses. To get back to about 14%, lower the bosses' targets (not measured). Otherwise it stays at 9%.
3. **The Tower Top's bosses (settled, on your word).** The Storm King's Rally summons Soldiers at half a Soldier's HP (an `hp` share on the summon effect, new in the schema); the Soldiers that start beside him, and the Soldier everywhere else, are unchanged. With the bosses re-tuned, the Storm King runs 145 ticks (was 180) and the King's Guard 143 (was 155), against 75–107 for act III's other bosses. What's left is the King's own HP at the knob whole runs ask: at equal difficulty, Soldiers at a quarter HP measured no shorter than at half.
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

**Classes.** On the director's ruling, a stat line is a signpost (`docs/rules.md`): a class keeps its extremes, and balance goes into the source of a strength first. From rolled starts (the sheet's measure since this part), the session's original lines ran −8.7 (Assassin) to +6.2 (Vampire): only the Assassin was outside the band, and the Vampire led whole runs at three times the mean. So two classes changed, and the Ranger on the director's idea:

| Class | Change | Sheet from rolled starts: original → now | Whole runs as leader (300 runs, same seeds) |
| --- | --- | --- | --- |
| Vampire | HP 4 → 3.5, Lifesteal high → medium (its own line) | +6.2 → +4.1 | 27% → 16% |
| Assassin | Backstab a hit word bigger (its trained forms too); HP 2, Evasion medium as they were | −8.7 → −7.7 | 5% → 5% |
| Ranger | Evasion medium; HP 3, Aggro 2 as they were | −3.9 → −1.6 | 5% → 9% |

- **The Vampire:** at HP 4 with medium Lifesteal it still won 20% of the runs it led: its Blood drain scales from max HP, so HP brings back its damage and its healing together.
- **The Assassin:** the bigger Backstab put its damage in the dealers' band (1.38× an average unit, was 1.03×). High Evasion was tried and dropped: it made the Assassin's line match the Monk's (they dodged 43% and 50%).
- **The Valkyrie and the Bramble knight** keep their original lines: half steps were tried, then dropped once the sheet's rolled starts showed them inside the band (+5.5, +3.6).
- **The builds** moved 1–3 points.

**The class shape check** (each class's one line from `classes.md` against what it does in the sheet's fights, from rolled starts; ×avg is against the average unit):

| Class | Should | Does | Fits |
| --- | --- | --- | --- |
| Knight | draw the fight and soak it, little damage | draws the most (2.3× hits), 57% mitigated, deals 0.50× | yes, but it falls 1.31× as often as average while the Bramble knight falls 0.85× and the Hoplite 0.70× |
| Cleric | heal the lowest with quick heals, raise | Cure 2.4 a fight, the most healing given to others, deals 0.15× | yes |
| Ranger | a top dealer: crits, arrows that bleed, chill and sunder | 1.43× damage (2nd), 27% crit, each arrow's status lands | yes |
| Bramble knight | draw foes onto thorns; they bleed; regrow the lowest | 2.2× hits, 62% of its damage from thorns and Bleed, heals 1,368 a fight | yes |
| Hoplite | very tanky, big hits, an Aegis for the ally about to fall | biggest swing in the cast, 1.38× damage, falls least but one (0.70×); Aspis 0.7 a fight | yes; the Aegis is rare |
| Paladin | the judge: hits harder on afflicted foes, Marks one, heals, heavy burning Smite | the second healer (2,571 a fight), Condemn 1.2 a fight, deals 0.70× | partly: it reads as a healer with a Smite more than as a killer |
| Valkyrie | a quick, survivable dealer; her strikes build her Shield; Skyfall cashes Shock | 1.34× damage, the most Shield in the game, falls least (0.58×), Skyfall 45% of her damage | yes |
| Bard | party tempo: mends, gives mana, Might, Haste, Encore; no damage | War ballad 2.3 a fight, among the busiest (3.0 actions a 10 ticks), deals 0.23× | yes; Allegro comes 0.7 a regular fight |
| Hexer | the spellblade: curses that deepen afflictions, weakens, silences mid-cast | Malison 57% of its damage, Enfeeble 2.1 a fight, the most interrupts | partly: the blade is 12% of its damage; it reads as a curse caster |
| Monk | sunders with a blur of blows | the busiest (3.0 actions a 10 ticks), dodges the most (50%), stuns with Pressure point | yes |
| Assassin | burst killer: picks off the weakest past any guard | the top crit (29%, 43% of its damage from crits), kills 1.75 a fight (2nd), Backstab 6.3 swings a cast | yes |
| Vampire | drains to outlast: heals back by hitting | heals itself the most of anyone, takes 1.23× damage, falls 0.73×, deals 0.98× | yes |
| Pyromancer | the glass cannon of long casts | the top damage (1.49×), 46% from Burn, falls 1.11× | yes, but Pyre lands about once every two fights (0.53) and Fireball 0.84 |
| Frostweaver | the ice wall: a chunky supporting mage, the Chill applier | spends the most MP, its spells lay Chill, Stillness gives Clarity; middle on survival (0.98×) | yes |
| Stormcaller | the quick, spreading striker among the mages | 1.17× damage, 45% from Shock, busy (2.6 actions a 10 ticks), falls most (1.32×) | yes |
| Geomancer | hits hardest behind stone | the second-most Shield, 39% of its damage from crits, the second-biggest swing, but 0.94× damage, the slowest (1.2 actions a 10 ticks), rocks 2.4 swings a cast | no: the stone and the crits show, the hardest hits don't |

**Tool fixes:**
- `rogue:calibrate` wrote the measured knob as a fight's own knob, so act I's −25 was counted twice. It now subtracts the act's and region's offsets, as `build-calibrate` does.
- Its `--climb` figure now counts the act's offset.

## What the numbers say

**Whole runs** (the simulated player, 3,000 runs, heat 0):

| | Before | Now |
| --- | --- | --- |
| Runs won | 19% | 10% |
| Lost on act I's road (fights, elites) | 47% of runs | 31% |
| Bosses beaten, acts I / II / III | 91 / 75 / 90% | 76 / 63 / 55% |
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

**Heat** still steps evenly: 10% won at heat 0; measured before the last two changes, 9% at heat 0, 8% at 1, 4% at 5, 2% at 10.

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
