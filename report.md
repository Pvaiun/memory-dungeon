# Report

## For the director now

**Batch 1 is up: 21 problems to answer.** [Wheel B Problems](https://claude.ai/artifact/43PnTmEay97YFozWNbvuUj)

- Answer each in a few lines, in any form. Mark a problem **Skip** or **Wrong question** if that's the truer answer; a line on why helps. Answers save as you type.
- The page shows the problems only. Which way to win each was drafted under, and the rules it stands on, are in `problems.md`, kept off the page so they don't steer the answers.
- When you're done, or done enough, say so in the chat. The next session reads the answers back, copies them into `problems.md` and aims batch 2.

## Handoffs

### Session 1: batch 1 posed

- **Drafting.** Five agents worked alone. Four took one way to win each, and the fifth took the places where the ways meet. Each read the six sources the brief names, and nothing else. Their prompts gave the game in brief, what a problem is and the rules for a good one, the way's definition from `sources/colours.md`, and ranges to cover (scale, timing, targets, cost, the run, what the player sees and chooses). There were no examples. They drafted 89 candidates.
- **Choosing.** Four per way and five between ways, 21 in all (`problems.md`). The drafters converged on a few clusters. Abilities that fire the moment they're ready, bosses' control resistance, cooldowns and MP carried into the boss, knockouts across an act, and a player who can't see what worked each came up three or four times. One of each cluster was kept at most. Candidates whose likeliest answer is already among the earlier answers were dropped: damage carried past a kill, the struck unit striking back, missing-HP scaling, seats that join units.
- **Sharpening.** Each problem now opens with what's wanted. Grounding moved to the notes, and wording that leaned toward a fix was cut.
- **Spread against `sources/threads.md`.** Most words are touched, Weaken (the empty one) included. **Gaps for batch 2:** Guard, Hidden, the dodge on the party's side, and the party's own wind-up. Defense, the Mark, what's worn and a passive are untouched on purpose here: the earlier answers already hold three or four each. Details are at the end of batch 1 in `problems.md`.
- **The page.** `page.html` is published as the artifact above. Answers go to the artifact's database as `answers/b1-01` … `answers/b1-21`, each holding the problem's label, its text, a status (`answered`, `skipped`, `wrong`, `open`) and the answer text. Only the owner can write; a write at a lower level was tested and refused. Read them back with ArtifactData `list` on collection `answers`. For batch 2, append to `PROBLEMS` in `page.html` with ids `b2-…` and republish to the same URL, so the link stays.
- **Next:** wait for the director to say the batch is answered. Then copy the answers into `problems.md` and aim batch 2 from them: thin answers, ways few answers serve, answers that pull apart, an attitude showing in only one way, and the gaps above.
