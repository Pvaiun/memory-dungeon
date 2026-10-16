# Sample feel check: the placeholder ladder

*A sample for step 3. A fresh AI reader with no other context read 7 runs from the sample combat study, seeing only what a player sees. The runs were picked by rule: the closest loss, the biggest comeback, a typical win, a blowout, and one from each dungeon not yet covered. Its full answers are in `feel-answers.md`.*

**In short.**

- **The reader was honest, which is what this sample tests.** The stand-in is flat, and the reader said so. Boss fights run 27 to 79 rounds of "X hits Y for N". Nothing in any class, enemy or perk description ever happens. The six dungeons don't feel different. It didn't flatter the game, and it didn't name any stat it wasn't shown. That holds for one reader; a second would firm it up.
- **It could mostly tell why a run was lost.** In 2 of the 3 lost runs, it guessed a colour that wins. The miss is telling. On the closest loss, it added a Cleric because the Cleric's description promises healing, but the stand-in's Clerics never heal. The reader flagged this itself: "If Clerics don't really heal, the same party with a little more luck would probably win." It was right: that party wins 82% of the time.
- **Hidden stats can be worked out.** The reader added up damage and put the last boss at "about 208" HP. She has 208. It called the closest loss "lost by about one hit", and she had 1 HP left. A careful player could do the same.
- **Close calls are invisible.** With enemy HP hidden, a loss by one hit reads exactly like a loss by half.
- **It caught a mistake in the harness.** The run picked as "the biggest comeback" was really a close win with no comeback, because my measure counted damage carried in from earlier fights as falling behind. That's fixed. The new pick is a run where the party falls to 3% of its HP and still wins.

**Questions for you** (both are for step 22, combat presentation):

1. Exact damage numbers let a careful player work out an enemy's HP. Is that fine, as part of learning by watching, or should it stay fuzzier?
2. Should a fight show when an enemy is nearly dead (say, "she's staggering"), so that a close call reads as close?

**A fight, as the reader told it** (the closest loss): "The three trash fights took 2 or 3 rounds each and cost almost nothing ... Against the Grey Mother every hit shrank to 2 or 3 damage ... The Duelist fell in round 22 and the Archer in round 25. The Vanguard then stood alone for 18 more rounds, losing exactly 5 HP a round, and went down in round 43."

**How it was run:** 7 runs from the sample combat study (engine 0.1, the stand-in fight), replayed with logs on. Each is rebuilt from its seed: the closest loss is dungeon 6, Vanguard, Archer and Duelist, seed 87. One reader, a helper agent in the working session, took about 6 minutes.
