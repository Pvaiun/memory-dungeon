# Whole-run tuning: the report

The director's aim (`intent.md`): the simulated player wins 5% of runs. It does: **5.1%** of 3,000 runs on fresh dice at heat 0, Destiny Shards included (±0.8 points).

## Decisions

1. **Act III's bosses are now beyond most well-built parties. Keep them for the playtest?**
   - **The build test's rung 3 parties win 15% of act III's bosses,** and the boss keeps 75% of its HP when they fall.
   - **Five builds win under 10%:** the Storm 0%, Thousand Cuts, Cold Snap and the Hunt 2%, Barrage 7%. Blood Pact wins 54%, the Toll 28%, Landslide 24% and Bonfire 15%.
   - **Act II's bosses:** the build parties win 26%. Landslide and Thousand Cuts win under 10%.
   - **The simulated player's survivors do better,** winning 38% of their first tries at act III's boss. They're its strongest 13% of runs.
   - **My pick: keep them.** A player sees the boss from the act's start and prepares for it, which neither the build parties nor the simulated player do. A prepared retry with a shard is worth far more than the simulated player's random one (decision 4).
   - **The alternative is to take act III's bosses down,** but the 5% then has to come from acts I and II. Each point act III gives back costs more than a point there, since fewer runs reach act III. Not measured.
   - **Either way, a lost boss fight isn't close:** the build parties leave act I's boss 43% of its HP, act II's 57% and act III's 75%. The balance pass flagged this, and it is worse now.

2. **Regular fights still cost a good party little, and the knobs can't change that. Open a step for it?**
   - **A third of the won fights in acts II and III cost the party 5 points of HP or less** (31–40%), with a healer or without (35% and 25%).
   - **Version B, probed and not kept:** regular fights a third of a careful party's HP and elites about half, in acts II and III. It killed more weak parties: act II elites lost 22% → 28% of tries, act III 18% → 30%. A won fight barely got dearer (act II 14% → 16% of the party's HP, act III 11% → 12.5%), and as many were nearly free (30–36%).
   - **A fight's cost is all or nothing:** a party handles a fight or dies in it. Raising a fight's knob turns into deaths for the weak, not cost for the strong. Healing in a fight also mends the damage carried in from the last one, so parties reach the bosses at 91–94% HP.
   - Making every fight cost a good party something is a design question, not a knob: what carries damage from fight to fight and what mends it.

3. **Act I still decides most runs.** 61% of runs end there (39% before), and 39% of all runs end in its regular fights and elites. This is the wall-less starts the director means to fix by other means.
   - **The Cleric is the weak starter.** As leader it wins 2% of runs, against 7% for the Knight and the Ranger. A Cleric in the final party wins 0% (of 982 such runs).

4. **The 5% counts Destiny Shards. Is that the aim?** Without shards the same knobs win 3.2%: they're worth 2 points to the simulated player, because it prepares a retry at random and loses about 9 boss retries in 10. A player who prepares the retry gets far more from a shard.

## What changed

- **The cost targets** (`TARGETS` in `tools/build-calibrate.ts`), as a share of a build party's HP:

  | Tier | Act I | Act II | Act III |
  | --- | --- | --- | --- |
  | Regular fight | 14% → 16% | 17% → 24% | 19% → 27% |
  | Elite | 26% → 30% | 30% → 42% | 33% → 46% |

  Every regular fight's and elite's knob was set again against the build parties. The easy pools (each act's first floors) are as they were.
- **The bosses:** `RUN_TARGETS` in `tools/rogue-tune.ts` is now 35%, 72% and 82% of the tries they win (was 22%, 35% and 45%). Seven rounds of 2,000 runs (`npm run rogue:tune`) set each boss and evened out the regions within each act. Bosses rose by about 30 knob points in act I, 70–150 in act II and 165–195 in act III.
- **The documents:** `docs/rules.md` (fights by cost; difficulty aims hard, the 5%), `docs/core-set/rogue-mode.md` (knobs are measured), and the tools' and heat's comments.
- **No engine change and no new behaviour:** the knobs and the pack only.

## Where it stands

Simulated runs at heat 0, Destiny Shards spent (before: 400 runs at the old knobs; now: 3,000 on fresh dice):

| | Before | Now |
| --- | --- | --- |
| Runs won | 40% | 5.1% (3.2% without shards) |
| Runs that clear act I / II / III, of those that enter | 61% / 79% / 83% | 39% / 33% / 39% |
| Bosses: first tries lost, act I / II / III | 16% / 21% / 13% | 36% / 59% / 62% |
| Elites: tries lost | 10% / 6% / 10% | 12% / 22% / 18% |
| A won regular fight's cost, of the party's HP | 10% / 11% / 10% | 11% / 14% / 11% |
| HP on reaching a boss | 93–96% | 91–94% |

- **Each act still climbs to its boss:** the boss is its act's hardest fight in every act (act III's elites lose 18% of tries, its boss 62% of first tries). The regions within an act end runs at about the same rate (act II 63–69%, act III 57–67%).
- **Heat:** 4.6% at heat 1 and 3.7% at heat 2, under a point a level (`heat.per`).
- **The build parties** (`npx tsx tools/build-test.ts`, all builds, on their own act's fights), before (the survivability report) and now:

  | | Regular, cost | Elite, cost | Bosses won |
  | --- | --- | --- | --- |
  | Rung 1 (act I) | 13% → 16% | 22% → 29% | 68% → 45% |
  | Rung 2 (act II) | 15% → 24% | 25% → 43% | 69% → 26% |
  | Rung 3 (act III) | 16% → 28% | 31% → 47% | 73% → 15% |

**How sure.** The win rate is good to about a point (3,000 runs). Each boss moves about 5 points between tuning rounds, so a single boss's own rate is rough, and act III's bosses are met only 50–95 times a round. A build's boss rate in the build test moves ±10 points from seed to seed.

## Worth looking at

- **A won run:** `npm run rogue -- --diary 500024 --leader ranger` (Monk, Valkyrie, Knight).
- **An act I run lost to a regular fight:** `npm run rogue -- --diary 500008 --leader cleric` (falls to the Archers' Nest on floor 9).
- **Act III's bosses against a build that can't beat them:** `npx tsx tools/rogue-feel.ts --builds storm` (the Storm wins none at rung 3).
- **Least sure:** whether act III's bosses are a wall or a puzzle for a player who prepares (decision 1); and act II's and III's elites, lost on about a fifth of tries, which is a lot of risk for a room a player can choose.
