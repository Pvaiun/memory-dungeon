# Sample progression report: the placeholder ladder

*A sample for step 3, so judge its shape, not its numbers. It runs on the stand-in fight and the placeholder ladder. The unlocks are the worked example's 10: 3 specializations, 4 formations and 3 pieces of powerful gear.*

**In short.**

- **The optimizer is almost never stuck, because the content runs out.** Most optimizers clear all six dungeons by week 2, and all of them by week 4. They were stuck in 3 of 600 player-weeks. With 4 to 7 quests a week, a pool of 10 unlocks is empty by about week 3. With the same unlocks, the benchmark never cleared more than the optimizer, so there was never a party the optimizer missed for long. This holds for all 50 players.
- **The casual player is stuck in 31% of its weeks, and never by quests.** All 184 stuck weeks were walled by play. In 153 of them, it already owned a party that wins, but it keeps its first full party, which often includes the Mender, who barely fights in the stand-in. 150 of the stuck weeks are at the last dungeon. Ten casual players are still stuck there at week 12. Walls last 4 weeks on average (between 3 and 5), and the longest lasted 10.
- **How walls were sorted matched what ended them, with one twist.** Walls where the player already owned a winning party ended through play, or never. All 17 walls sorted at some point as "challenges left" ended with an unlock instead. The challenge loot that might have helped never did, because the stand-in ignores gear. Once gear works, this is how we'll see whether challenge loot really breaks walls.
- **Strictness at the walls:** the last dungeon, where most walls are, lets 1 colour in 7 win, and 1 build in 3 inside it.
- The optimizer beats the casual player in all 20 seed blocks.

**Questions for you.**

1. A casual player stuck at a wall usually owns a party that would win, and doesn't find it for 4 weeks or more. Is finding it the game, or should the game ever hint?

*(A sample question. It belongs to a later step, such as onboarding.)*

**A casual player's weeks** (the most typical of the 50):

- Week 1: one quest, which gets Ranger: Archer. It clears dungeons 1 to 3 in three runs.
- Week 2: three quests. It clears dungeon 4, then loses dungeon 5 three times. The best try leaves the Grey Mother on 22%.
- Week 3: three quests, including Cleric: Mender, who joins the party. It clears dungeon 5, then loses dungeon 6 twice.
- Week 4: it gets Ranger: Duelist, but the party is full, so the Duelist sits out. It loses dungeon 6 twice. Walled by play: with the Duelist in place of the Mender, the party would win 82% of the time.
- Week 5: two more losses. One leaves the Grey Mother on 16%.
- Week 6: there are no quests left. One run, and the old party scrapes through, as it does about 1 time in 20.

**An optimizer's weeks**, for contrast. Week 1: three quests, including the Archer. It clears dungeons 1 to 4 and loses dungeon 5 22 times. Week 2: six quests, including the Duelist. It clears dungeons 5 and 6. From week 3 on, all that's left is two challenges nobody can win, which it keeps trying.

**Dungeons cleared by week, with the same unlocks** (flat after week 6)
```
week  optimizer     benchmark     casual
  1   ██████ 4.6    ██████▌ 4.7   ████ 2.9
  2   ███████▌ 5.8  ████████ 5.9  ██████ 4.3
  3   ████████ 6.0  ████████ 6.0  ██████▌ 4.9
  4   ████████ 6.0  ████████ 6.0  ███████ 5.1
  5   ████████ 6.0  ████████ 6.0  ███████▌ 5.4
  6   ████████ 6.0  ████████ 6.0  ███████▌ 5.6
```

**How it was run:** 50 players of each kind over 12 weeks: 60,540 runs in 44 seconds, on engine 0.1, the stand-in fight and the placeholder ladder. Quest rates are assumptions. The optimizer does 80% of the board and has 30 tries a week. The casual player does 1 to 3 quests and plays 2 to 4 runs. Tables are in the data file.
