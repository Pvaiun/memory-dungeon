# Sample progression report: the placeholder dungeons

*A sample for step 3, so judge its shape, not its numbers. It runs on the stand-in fight. The worked example has only one dungeon, and nothing can beat it with the stand-in, so I made six copies with weakened monsters, the first weakest. The unlocks are the worked example's 10: 3 specializations, 4 formations and 3 pieces of powerful gear.*

**In short.**

- **The optimizer is almost never stuck, because the content runs out.** Most optimizers clear all six dungeons by week 2, and all of them by week 4. They were stuck in 3 of 600 player-weeks. With 4 to 7 quests a week, a pool of 10 unlocks is empty by about week 3. With the same unlocks, the benchmark never cleared more than the optimizer, so there was never a party the optimizer missed for long. This holds for all 50 players.
- **The casual player is stuck in 14% of its weeks, and always walled by play, never by quests.** In 50 of its 81 stuck weeks, it already owned a party that wins and hadn't hit on it yet. Walls last 2 weeks on average (between 1.5 and 2.4), and the longest lasted 7. Most casual players clear everything by week 5, and all of them by week 10.
- **How walls were sorted matched what ended them, with one twist.** Walls where the player owned a winning party ended through play, once it found that party. All 17 walls sorted at some point as "challenges left" ended with an unlock instead. The challenge loot that might have helped never did, because the stand-in ignores gear. Once gear works, this is how we'll see whether challenge loot really breaks walls.
- **Strictness at the walls:** the last dungeon, where most walls are, lets 1 colour in 7 win, and 1 build in 3 inside it.
- The optimizer beats the casual player in all 20 seed blocks.

**Questions for you.**

1. A casual player's walls last about 2 weeks, and the longest lasted 7. Is that the kind of wait you'd call fine?

*(A sample question. Wall lengths are step 15's to judge.)*

**A casual player's weeks** (the most typical of the 50). It puts each new unit straight into its party, and after two losses in a row, it swaps one unit.

- Week 1: three quests: Cleric: Mender, Ranger: Duelist and a formation. Both new units join the Vanguard, and it clears dungeons 1 and 2.
- Week 2: two quests, including Ranger: Archer, who takes the Vanguard's place. It clears dungeons 3 and 4.
- Week 3: one quest. It clears dungeon 5, then loses dungeon 6 twice. The best try leaves the Grey Mother on 8%.
- Week 4: after two losses, it swaps the Archer out for the Vanguard. It loses twice more. Walled by play: it owns a party that wins.
- Week 5: it swaps the Mender out for the Archer. The Vanguard, Archer and Duelist win on the first try, and it's done.

**An optimizer's weeks**, for contrast. Week 1: three quests, including the Archer. It clears dungeons 1 to 4, and loses dungeon 5 22 times. Week 2: six quests, including the Duelist. It clears dungeons 5 and 6. From week 3 on, all that's left is two challenges nobody can win, which it keeps trying.

**Dungeons cleared by week, with the same unlocks** (flat after week 7)
```
week  optimizer     benchmark     casual
  1   ██████ 4.6    ██████▌ 4.7   ████ 2.9
  2   ███████▌ 5.8  ████████ 5.9  ██████ 4.3
  3   ████████ 6.0  ████████ 6.0  ██████▌ 4.8
  4   ████████ 6.0  ████████ 6.0  ███████ 5.2
  5   ████████ 6.0  ████████ 6.0  ███████▌ 5.7
  6   ████████ 6.0  ████████ 6.0  ████████ 5.8
  7   ████████ 6.0  ████████ 6.0  ████████ 5.9
```

**How it was run:** 50 players of each kind over 12 weeks: 60,225 runs in 43 seconds, on engine 0.1 and the stand-in fight. Quest rates are assumptions. The optimizer does 80% of the board and has 30 tries a week. The casual player does 1 to 3 quests and plays 2 to 4 runs. Tables are in the data file.
