# Step 3 intent

Gathered with `/intent 3` in a fresh session, Oct 16, 2026: the director's answers to the brief, follow-ups, and a read-back. Items marked "picked from options" were reactions to the brief's lists.

## Scope

- [firm] Step 3 builds the simulation and report process, not the reports' content. With no combat, mechanics or real content yet, what a report says can't be detailed until there's a design. A placeholder, generic report is the right output for now.

## What the harness measures

- [firm] The game is about build-making. The skill is party composition and trial and error, not performing with a given tool.
- [lean, partly picked from options] The numbers are mainly for the AI: how close losses were, how many tries a wall takes, the spread, how much a run with the same party varies, what impact perks had, how classes compare in different situations, and broken synergies. The AI uses them to keep balancing, propose design changes, and ask the director plain-language questions about subjective calls.
- [lean] The director's input is on the macro questions: pacing over weeks, how often a player has to wait to keep playing, and how strict build-making is.
- [firm] Strictness isn't "what share of all builds win". The AI works out how custom a party has to be for a challenge, in colour-space terms: in the right colour space and tweaking, or in the wrong one.

## How results reach the director

- [firm, picked from options] Words first, stories second, charts third. Tables aren't important, but stay available. The director doesn't read data reports.
- [lean] Both balance and feel findings reach the director. Variety has to be felt, not just numerical.
- [lean] Stories are the director's main way of catching numbers that have gone wrong.
- [lean] Reports stay in AI chats and the repo for now.
- [lean] This step's test: the director judges the words-first sample report at each level, with a story. (Proposed by the interviewer, agreed by the director.)

## Simulated players

- [firm] The players aren't modelled on the director's history. Memory has no quest board data.
- [firm, picked from options] Tune for the optimizer: a player who does most quests and homes in on build-making. Build requirements can be quite strict.
- [lean] Check that endlessly repeating finished content doesn't pay (see `DECISIONS.md`, step 3). A casual player is of interest. Don't burn compute on play styles we don't expect.

## Quest rates

- [lean, picked from options] Use assumptions, starting at 4 to 7 quests a week. Real quest board data replaces them soon after the first design and implementation pass.

## Feel checks

- [firm] Feel checks mostly check that information is clear, both for build decisions and in tense fights.
- [firm, picked from options] Could you tell why a fight was lost? The bar isn't a report saying "bring more poison". It's perceiving the fight well enough to guess at a strategy.
- [lean, picked from options] Dramatic moments: comebacks, close calls, a win on the last hit.
- [lean, picked from options] Fights in the same dungeon can feel alike, but there must be a range across dungeons.
- [lean, picked from options] Every dungeon builds up to its boss, to different degrees.
- [lean, picked from options] The reader's guess at next time's party is in colour-space terms, not a specific answer.
- [lean] Units that seem to do nothing aren't much of a concern.

## Using the harness

- [lean, picked from options] The director reads reports and asks questions in chat. There's no interface for now, but the build shouldn't close the door on one.

## Left to the designer

- Which players to simulate besides the optimizer, weighed against how much compute they cost.
- How strictness is measured.
- Everything in the brief's "What the designer will decide" list. The director didn't claim any of it.
