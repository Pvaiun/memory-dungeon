# Sample combat report: the placeholder dungeons

*A sample for step 3, so judge its shape, not its numbers. The fight is step 2's crude stand-in. The worked example has only one dungeon, and nothing can beat it with the stand-in, so the six dungeons here are copies of it with weakened monsters. In the first, the monsters have 30% of their HP and attack; in the sixth, 80%.*

**In short.**

- **The dungeons get stricter as the monsters get stronger.** In the first three dungeons, 6 of the 7 colours can win. In the last, only one colour can, Warrior with Rangers. Inside that colour, only one build of three wins: the Vanguard with both Rangers. It wins 82% of its tries (between 76% and 86%).
- **Who's in the party matters, and nothing else does.** A Warrior helps and a Cleric hurts, in all 20 seed blocks. Formations, gear, abilities and perks make no difference at all, on any seed, because the stand-in ignores them. The harness says so, rather than inventing an effect.
- **Perks were measured four ways, and all four matched.** Perks were picked at random in the main runs. For the best parties, every combination of picks was also played: picking with hindsight, picking as well as a player could know, picking at random, and picking worst. All four came out the same.
- **The what-if:** doubling the Ranger's HP raises wins in five of the six dungeons (all 20 blocks each), and lets two more colours win the last one.

**Questions for you.**

1. The last dungeon lets 1 colour in 7 win, and only 1 build in 3 inside it. Is that what you mean by "requirements can be quite strict", or is it past it?

*(A sample question. With real content, it would come with both versions' numbers.)*

**A fight retold: the closest loss.** The Vanguard, Archer and Duelist clear the three trash fights in 8 rounds, losing a tenth of their HP. Against the Grey Mother, their hits shrink to 2 or 3. She takes the Duelist in round 22 and the Archer in round 25. The Vanguard fights on alone for 18 rounds and falls in round 43, with the Grey Mother on 1 HP of 208.

**Hollow 6: how often each party wins**
```
Vanguard, Archer, Duelist  ████████████████▌    82%
Vanguard, Archer, Mender   █                    5%
Vanguard, Duelist, Mender  █                    5%
Archer, Duelist, Mender                         1%
The other 10 parties                            0%
```

**How it was run:** 14 parties against 6 dungeons and 18 challenges, 200 seeds each, in two versions (as is, and the Ranger with double HP). Perks were picked at random. 205,800 runs in 35 seconds, on engine 0.1 and the stand-in fight. Tables are in the data file.
