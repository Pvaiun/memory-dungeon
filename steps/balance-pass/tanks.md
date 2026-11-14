# The walls in regular fights

Why walls make regular fights cheap, and what would change it. Measured on the build test's formation parties, each on its own act's fights from rolled starts (as the build test's By tier table plays them), with every knob set again after each change (`tools/build-calibrate.ts`, then `npm run content`). **Walled** is a party whose most-struck unit in its regular fights is a Knight, Bramble knight, Hoplite, Paladin, Valkyrie or Geomancer and takes at least half the hits: 18, 15 and 17 of the 27 routes at rungs 1, 2 and 3. `npx tsx tools/wall-read.ts` prints the split (`--layers` for each party's breakdown). Nothing is landed: no content change I measured narrows the gap.

## 1. The decision

No option closes the gap between walled and unwalled parties. In act III a wall halves what any fight costs: regular fights 14% against 29% of the party's HP, elites 25% against 52%. Only the stacked walls go much further: Landslide's two Knight routes and the Toll's Knight–Hexer–Hoplite pay 4–5%. Three options, each with the knobs set again:

- **A. The Banner of the last keep's extra HP arrives empty** (content, but it changes what a mythic does, so it's your call). Today its ×1.5 max HP comes filled at every fight's start, so it's a buffer of half the Knight's HP each fight, and it tops up HP carried from earlier fights. Empty, it's room to be healed into. Measured with its healing cut (−50%) kept, which should go with it; Landslide's Knight routes heal 0–3% of their HP a fight, so the cut barely matters there.
  - **What it does:** Landslide's two Knight routes go from 4% and 5% to 9% and 10%, and the Toll's Knight–Hexer–Hoplite from 4% to 8%. Their boss wins go from 100% to 83%, 83% to 78%, and 50% to 50%.
  - **What it doesn't do:** the gap between walled and unwalled parties doesn't move.
  - **What it costs:** the Knight's mythic loses most of its worth in a run.
- **B. Defense takes at most half of a hit** (a rule, yours). It's the floor the flat formula already has (`armorFloor`), applied to today's formula at 50%.
  - **Who it moves:** it bites only where Defense would cut a hit by more than half, which means armored units against small hits. Act III's regular hits stop meeting more Defense at about 5.
  - **What it does:** the Toll's Knight–Hexer–Hoplite, armored on all three (Defense 7, 6 and 4), goes from 4% to 26%. Act I's unwalled parties pay less (13% to 10%), which is the one help for wall-less starts anywhere in this work. The act III gap narrows from 15 to 13.
  - **What it costs:** that same Toll route loses its bosses (rung 3: 50% to 33%; rung 1: 67% to 25%). It is also a cap that binds on one hit, which `docs/rules.md` (Numbers, not behaviour) rules out. A swarm would read against plate as against cloth, only halved; big blows don't change.
- **C. A and B together.** Landslide and the Toll go from 6% to 13% in act III. The gap narrows from 15 to 12, and act I's unwalled parties pay 10%.

**My pick:** C, if you'll take a cap on Defense. Otherwise A, with the act III gap closed from the other end: the unwalled routes that pay 44–46% (Cold Snap's two rung-3 routes, the Storm's Valkyrie–Hexer–Bard) are weak in every tier, and they win 17–22% of their bosses. The knobs aim at the mean, so lifting them raises everyone's knob, and the walls pay more.

**Walled / unwalled, before and after.** Landslide and the Toll's six rung-3 routes in the last column. The bound is every fight-start Shield and the Banner's HP gone, with the knobs set again: it's the most that taking buffers away can do, and it takes the Knight's own Vanguard Shield.

Regular fights (cost):

| | Rung 1 | Rung 2 | Rung 3 | Landslide, Toll |
| --- | --- | --- | --- | --- |
| Today | 15 / 13 | 14 / 21 | 14 / 29 | 6 |
| A | 15 / 13 | 14 / 21 | 14 / 29 | 8 |
| B | 16 / 10 | 15 / 20 | 15 / 27 | 10 |
| C | 16 / 10 | 15 / 20 | 15 / 27 | 13 |
| Bound | 16 / 9 | 17 / 17 | 17 / 24 | 14 |

Elites (cost):

| | Rung 1 | Rung 2 | Rung 3 | Landslide, Toll |
| --- | --- | --- | --- | --- |
| Today | 27 / 20 | 27 / 35 | 25 / 52 | 17 |
| A | 27 / 20 | 27 / 35 | 26 / 51 | 19 |
| B | 27 / 20 | 28 / 33 | 26 / 49 | 21 |
| C | 27 / 20 | 28 / 33 | 27 / 49 | 24 |
| Bound | 29 / 18 | 30 / 31 | 27 / 46 | 24 |

Bosses (won):

| | Rung 1 | Rung 2 | Rung 3 | Landslide, Toll |
| --- | --- | --- | --- | --- |
| Today | 65 / 53 | 54 / 69 | 66 / 50 | 71 |
| A | 65 / 53 | 54 / 69 | 65 / 52 | 68 |
| B | 63 / 54 | 53 / 69 | 65 / 53 | 66 |
| C | 63 / 54 | 53 / 69 | 64 / 53 | 63 |
| Bound | 64 / 56 | 50 / 73 | 62 / 56 | 58 |

Walls stay worth taking against act III's bosses under every option. In acts I and II, walls aren't cheaper than the rest in these parties. Your note that wall-less starts lose act I comes from whole runs' bad starts, not from these parties' full kits.

## 2. What makes a wall soak a regular fight

Act III regular fights, as shares of the party's max HP a fight. Landslide and the Toll against the unwalled parties:

| | Swung at it | Dodged | Cut by Defense | Soaked by Shield | Shield held at the start | Reached HP | Healed | Cost |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Landslide and the Toll | 81 | 4 | 45 | 14 | 22 | 15 | 12 | 5 |
| Unwalled | 94 | 8 | 35 | 6 | 2 | 41 | 31 | 29 |

- **It isn't who gets hit.** In HP the same damage is swung at both groups (about 11–12 points a fight; the walls have bigger pools). With foes picking at random, with no draw and no Taunt, Landslide and the Toll still pay 6%, against 5% today. Their whole party is armored and shielded, so it doesn't matter who's struck. Draw alone, or Taunt alone, moves no one. The regular foes' lack of reach is not the cause.
- **Defense** is the biggest layer. It cuts 58% of what lands on them, against 41% on the unwalled. Act III's regular hits are small (about 1.2 points before Defense) beside Defense 5–7, and today's formula cuts small hits hardest. With the party's Defense halved, they pay 12%; with no Shield at all, 14% (knobs unchanged).
- **Buffers laid once a fight:** the start Shields, often at their cap of half the holder's max HP, and the Banner's +50% HP, filled. A regular fight deals Landslide's Knight routes about a third of their HP after Defense, and their buffers are about 60%. In a boss fight they're swung at for 2.4 times their max HP, so the same buffers are a small share. That's why walls make regular fights free but stay fair against bosses.
- **The buffers are redundant**, which is why cutting one piece never moved them (the earlier Banner and Thornheart cuts, and mine). With knobs unchanged, Landslide's Knight routes pay:
  - Banner taken away: 13% and 12%, from 4% and 5%.
  - Start Shields taken away: 14% and 13%.
  - Both taken away: 33% and 30%.
  - Every start Shield halved, or the Banner at ×1.25: no move, since the cap and the other buffer cover.
- **Retaliation and max HP:** retaliation shortens the Toll's fights (13–40% of its damage) but is 2–3% of Landslide's. Max HP counts mostly through the Banner, a buffer as above.

**The cheapest act III routes are cheap for three reasons.**

| Reason | Routes and regular cost | What moves them |
| --- | --- | --- |
| The Knight's two buffers | Landslide's Geomancer–Knight–Hoplite 4%, Knight–Hoplite–Bard 5% | Only the buffers |
| Defense on all three | The Toll's Knight–Hexer–Hoplite 4% | Only option B |
| Strength, not a wall | The Hunt's Hoplite–Valkyrie–Ranger 7% and Assassin–Ranger–Valkyrie 8% (fights of 9–12 ticks); the Toll's Monk–Valkyrie–Bard 4% (the Monk dodges; the Valkyrie's Shield grows from her own hits); Landslide's Geomancer–Paladin–Bard 6% | Nothing here (3–11% under every lever). They win 89–100% of their bosses; a matter for the whole-run tuning or the parties, not for walls. |

The gap is the same in every one of act III's 16 regular fights (walled 11–16%, unwalled 24–33%), so it isn't a pool or a foe either.

## 3. Ruled out

Act III regular fights, knobs set again: walled / unwalled, and Landslide and the Toll.

| Lever | Walled / unwalled | Landslide, Toll |
| --- | --- | --- |
| Today | 14 / 29 | 6 |
| Acts II and III's minions swing half as often, twice as hard | 14 / 28 | 7 |
| Every fight-start Shield halved | 14 / 28 | 6 |
| Stonewall's second Shield and the Mountain's Foothill Shield halved, the Banner ×1.25 | 14 / 29 | 6 |
| The same two Shields removed, the Banner ×1.25 | 14 / 29 | 8 |
| The same two Shields removed, the Banner empty | 14 / 29 | 9 |
| Shield's cap 25% of max HP, not 50% (rule) | 14 / 29 | 7 |
| Defense half as strong (`armorK` 0.125; rule) | 14 / 28 | 8 |
| Defense takes at most 60% of a hit (rule) | 14 / 29 | 7 |
| Bound with B: no fight-start buffers, and Defense at most half a hit | 17 / 23 | 18 |

With the knobs as they stand, a Shield that fades 15% every 4 ticks changes nothing either (Landslide and the Toll 6%).

## 4. How sure, and what to look at

- **How sure:** six seeds a fight, 27 routes a rung. With nothing changed and the knobs set again, the table repeats to the point (three knobs move). A route's cost moves 2–3 points from seed to seed; the group means are firmer.
- **Least sure:** A's Banner was measured with its healing cut kept. B and C were measured with a temporary engine change, now reverted: building B means applying `armorFloor` to today's formula and bumping `ENGINE_VERSION`.
- **Samples:**
  - Barracks, Landslide's Geomancer–Knight–Hoplite, the first seed (`npx tsx tools/rogue-feel.ts --builds landslide --rungs 3 --routes geomancer-knight-hoplite --fights barracks`). The Knight starts behind a capped Shield of 4,875, and a Soldier's hit reaches him as 476 after Defense, so the Shield takes ten hits before his HP moves. The same hit is 844 on the Cuts party's Monk, whose party has half the HP.
  - Court Wisps, the Toll's Knight–Hexer–Hoplite. Wisps land 125 at a time on the Hoplite, and the fight is over by tick 9.
