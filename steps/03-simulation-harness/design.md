# Step 3 design: simulation harness

Second draft, Oct 16, 2026, built from `intent.md` and the director's notes on the first draft. **Approved by the director, Oct 16, 2026.** What was built, and what changed in the building, is in `report.md`.

Like step 2, this is mostly machinery. It builds the process that runs simulations and writes reports, not what the reports will say, which is your firm scope for this step.

## What changed from the first draft

- **Built for the AI first.** Most studies are the AI's own, run in a loop while it designs. Every study prints a short digest for the AI, and a report for you is written only when something reaches you.
- **A good-enough benchmark, not the true best.** The challenge about which optimizer to tune for is agreed, with your change. Beside the learning optimizer stands the strongest party the harness finds within a fixed budget, and it appears beside the optimizer in every report, including the sample.
- **Replays are challenges only,** so the grind check is gone. In its place, every stuck week is sorted as walled by quests or walled by play. This is now in `DECISIONS.md`.
- **4 to 7 quests a week,** now decided for the first version, and in `DECISIONS.md`.
- **Colour is classes for this test only.** The real colour will likely be verbs weighted by how well the party does them, with formations and powerful gear counting toward it.
- **Fair comparisons.** Parties being compared play the same seeds, and each study says how perks are picked.
- **Charts: none to three,** not one to three.

## Who it's for

Mostly the AI. While designing and tuning, the AI runs studies in a loop, often hundreds of them, to find a design worth bringing you. You see a report only when something reaches you: a step's report, a challenge with both versions' numbers, or an answer to a what-if. So the harness is built for the loop first:

- **Every study prints a digest** for the AI: one short screen with the key numbers and their ranges, what changed since the previous round, and anything flagged, such as a failed prediction or a result outside its expected range. The full numbers stay in a data file for when it needs to dig, so it isn't wading through dumps between rounds.
- **A report for you** is written only when one's needed, from the same results.
- **Feel checks** cost AI time, so they run at checkpoints, when a design looks ready, not every round.
- **Each round** of the loop is one line in the step's tuning log, as the method says.

## What step 3 builds

### Studies

Everything runs as a **study**: a small data file that says what to run. In go the content, any changes to it ("the Ranger with double HP"), parties, dungeons, simulated players and seeds. Out come the numbers. The same study always gives the same numbers.

- One study can run versions side by side: the content as it is, and with a change. That's how the AI compares candidate designs, how a challenge gets both versions' numbers, and how a what-if you ask in chat gets answered.
- The harness's core is game-safe code like the engine, with no Node, plus a thin command-line wrapper. A page that runs studies on your phone stays possible later, without building one now.

### How sure, and fair comparisons

- Every rate gets a range: "wins 62%, between 57 and 66".
- Seeds are split into 20 blocks. A claim such as "the Phalanx beats Open Order" says how many blocks it held in: "19 of 20". A difference too small to trust is reported as "no clear difference".
- **Parties being compared play the same seeds.** Step 2 gives each fight and each perk offer its own dice, so on the same seed they meet the same perk offers, and each fight starts from the same dice. A difference between them is then the parties, not luck, and it takes far fewer runs to see.
- **Each study says how perks are picked:** by the simulated player, from a fixed list, or every path, using step 2's explorer. Fixing the perks, or trying them all, takes perk luck out when the party is the question.
- Each study is marked as tuning or held out. Held-out studies only run for the final check.

### Combat level

Many parties against many dungeons or single fights, many seeds each, with logs off. It measures what the intent lists for the AI:

- how close the losses were: the enemy HP left, and which fight was lost
- fight length, and the spread of results for the same party across seeds
- how many tries a wall takes
- how each class does in different situations
- synergies far above what their parts predict, found by a cheap check on pairs, so an exploit can't hide behind a search that stopped at good enough
- what perks change, as step 2's four numbers: the best picks with hindsight, the best a player could know to make, random picks, and the worst

### Strictness

Your test: how custom a party has to be. Each party has a **colour**: the broad kind of party it is, meaning what it does and how strongly. **Tweaks** are the exact choices that get it there. For each dungeon or challenge, the harness reports two numbers:

- **Colour strictness:** how many colours can win at all, with their best tweaks. "2 of 7 colours can win."
- **Tweak strictness:** inside the colours that can win, how many tweaks do. "8 in 10 tweaks win."

So a dungeon reads as "the wrong colour can't win, and the right one mostly can", or "the right colour, and then the exact build". What counts as "can win" is a placeholder bar, half its tries, until step 14 sets targets.

**What a colour is will change.** In this step, a party's colour is just the set of classes in it, because that's all the stand-in has. That's only for the test. The real colour will likely be the party's verbs, weighted by how well it does each one: its efficacy, which isn't designed yet. Five healers don't make a strong healing colour if the healing is weak. Formations and powerful gear multiply what a party does, so they count toward its colour rather than being tweaks. The colour definition is one swappable piece of the harness, like the battle system in the engine. Steps 5 (verbs) and 8 to 10 (units, formations and gear) shape it.

**Kept simple.** Strictness stays two numbers. A colour should be broad enough that a player could see it and aim for it, so there are only a handful. If the colour definition gets complicated, that's a sign to simplify it.

### Progression level

Simulated players play week by week. Each week they complete some quests, collect unlocks, adjust their party, and play runs: the next dungeon, or the challenges of dungeons already cleared. Replays are challenges only, so there's no grinding to simulate.

- **The quest board** deals 4 to 7 quests a week. Each shows an unlock the player doesn't own yet. Quest rates are assumptions, as you asked.
- **The optimizer, who we tune for.** It does most of each board, and homes in on builds by trial and error. It sees what a player sees (wins, losses, how far it got), never hidden stats, and has a budget of tries each week. Like a real player, it stops searching once something wins.
- **The benchmark,** beside it. It's the strongest party the harness finds with what the player owns, seeing everything, but within a fixed budget. It searches colour by colour, tries a few tweaks of the best, and stops at the first party that clears exceptionally well, say 9 tries in 10. If nothing does within the budget, it reports the best it found, and says the budget ran out. Finding the true best isn't worth the compute: nobody needs to know which of seven swords wins a turn faster. The benchmark answers one question: when the optimizer is stuck, is there a party it missed, or nothing to find? It's also what "75% of best-in-class" is measured against.
- **The casual player,** as a check. It does 1 to 3 quests a week and plays a few runs. It keeps its party unless a new unit fits, and picks perks at random.
- **Nobody else,** to save compute.

Progression reports lead with your three questions:

- **Pacing over weeks:** unlocks, dungeons and challenges cleared, week by week.
- **Walls, and what the player waits on.** In every week the player is stuck, it's either:
  - **walled by quests:** it has beaten every challenge it can, so only a new unlock moves it on, or
  - **walled by play:** there are still challenges it can win, and their loot might get it past.

  The report gives the share of each, and how long walls last, so the ratio can be understood and agreed as the game is built.
- **Strictness at each wall.**

For the AI, they also track what broke each wall (an unlock, or loot), when party choices start to matter, and how often perks change the result at walls. Party choices "start to matter" in the first week the player owns more than fits in a party, and the best and worst parties it could field differ by a lot.

**Placeholder progression.** There's only one dungeon, and the stand-in never beats its boss. So the samples run on a ladder of six copies of the Hollow, with enemies scaled from weak to full strength, each with the Hollow's three challenges. The pack's specializations, formations and gear are the unlocks. It only exists to give the sample reports something to say, and it's thrown away when real dungeons arrive.

### Feel checks

The harness picks fights worth reading by rule: the closest loss, the biggest comeback, a typical win, a blowout, and one fight from each dungeon. It replays them with logs on and writes each one as a reading pack. A pack holds only what a player would see, plus each enemy's trait words, never its stats.

A fresh AI reader with no other context reads each pack. It's a helper agent in the working session, so it needs no API key and costs nothing extra. It answers a fixed sheet:

1. Retell the fight in 3 to 5 lines.
2. What can you tell about each enemy?
3. If the fight was lost: why, and what colour of party would you try next?
4. Were there dramatic moments: a comeback, a close call, a win on the last hit?
5. What felt flat or unclear?
6. Across a dungeon, did it build up to its boss? Across dungeons, did they feel different?

Question 3 gets a score. The harness knows which colours can win, so a report can say "in 7 of 10 lost fights, the reader guessed a colour that wins". That's a number for whether the information is clear, which is your main feel test. Units that seem to do nothing aren't on the sheet, though the combat numbers still show them to the AI.

### What you see

When a report goes to you, it always has the same shape, in your order:

1. **In short:** words first, a few sentences, each saying how sure it is.
2. **Questions for you,** in plain language, where a call is subjective. Only if there are any.
3. **Stories:** a simulated player's weeks as a short diary, or a fight retold. One to three.
4. **Charts:** none to three, only where one helps. They're drawn in text for now. If they don't earn their place, we switch to another format, or drop them.
5. **How it was run:** one line of seeds, runs and versions.

**Wherever the optimizer appears, the benchmark appears beside it,** so you can always tell a missed build from a real wall.

Tables live in the data file, and get printed when someone asks. Stories come from the same runs as the numbers: the diary from one simulated player's real weeks, and the retelling from a real fight, replayed. So a wrong number shows up as a strange story. The harness drafts the facts, and the AI writes the words on top, because the words need judgement.

Study output goes to a folder git ignores. A report worth keeping is copied into its step's folder, and raw results are thrown away, since any run can be rebuilt from its seed.

### Size

It lives in `src/sim/`, with tests beside it, and runs with `npm run study`. I expect about 800 lines. There's no interface, no calls to AI services, and no parallel processing yet.

## Review sample

What a progression report will look like. The numbers are made up, to show the shape.

> **Progression: the placeholder ladder, optimizer and casual**
>
> **In short.** The optimizer clears 5 of the 6 dungeons by week 3, then is stuck on the last for 3 weeks, until Cleric: Mender arrives in week 7. The benchmark couldn't win it in those weeks either, so there was no party to find. Of the optimizer's 4 stuck weeks, 3 were walled by quests and 1 by play. The one walled by play was week 2, when it missed a party it already owned that could beat dungeon 4; the benchmark found it. The casual player stalls behind dungeon 3 from week 3 to the end. All of this holds in 20 of 20 seed blocks.
>
> **Questions for you.** Is 3 weeks walled by quests too long, when the player has nothing left it can win?
>
> **One optimizer's weeks.**
> Week 1: 5 quests. Got Ranger: Archer and the Phalanx. Cleared dungeons 1 and 2.
> Week 2: 6 quests. Got Ranger: Duelist. Cleared 3. Lost 4 eleven times; the best try left its boss on 8%.
> Week 3: 4 quests, no new unit. Won two of 3's challenges, then cleared 4 and 5. Lost 6 nine times. Nothing left it can win.
>
> **Dungeons cleared by week, with the same unlocks**
> ```
> week  optimizer   benchmark   casual
>  1    ██ 2        ███ 3       █ 1
>  2    ███ 3       ████ 4      ██ 2
>  3    █████ 5     █████ 5     ███ 3
>  4    █████ 5     █████ 5     ███ 3
> ```
> **How it was run:** 50 players of each kind, 12 weeks, engine 0.1, stand-in, content hollow-ladder. Tables in the data file.

What I'm least sure about:

- **The optimizer's trial and error.** How many tries a week, and how cleverly it narrows down, are guesses, and the tuning depends on them. The benchmark beside it shows when the optimizer is too weak.
- **The benchmark's bar and budget.** If either is too low, it calls a wall real when a party exists. Its reports say when the budget ran out, so that's visible.
- **When party choices "start to matter".** My measure is a stand-in for a feeling. It may need your words once real content exists.

## Intent map

| Intent | | How |
| --- | --- | --- |
| [firm] Build the process; a placeholder, generic report | Used | Studies, measures and the report's shape are built. What reports say waits for content. |
| [firm] Build-making and trial and error are the skill | Used | Strictness, the optimizer and the benchmark all measure building, not performing. |
| [lean] The numbers are mainly for the AI, to balance, propose changes and ask you questions | Used | The harness is built for the AI's loop first: a digest per study, with reports for you only when needed. |
| [lean] Your input is on the macro questions | Used | Progression reports lead with pacing, walls and strictness. |
| [firm] Strictness in colour-space terms | Used | Colour and tweak strictness. Classes are the colour for this test only. |
| [firm] Words, then stories, then charts; tables available | Used | The report's order. Charts are none to three, and tables are in the data file. |
| [lean] Balance and feel both reach you; variety must be felt | Used | Feel answers feed the words. Variety is a feel question asked across dungeons. |
| [lean] Stories catch wrong numbers | Used | Stories come from the same runs as the numbers. |
| [lean] Reports stay in chats and the repo | Used | Markdown, with any charts drawn in text. |
| [lean] The test: a words-first sample per level, with a story | Used | See How it's tested. |
| [firm] Not modelled on your history | Used | Quest rates are assumptions. |
| [firm] Tune for the optimizer; requirements can be strict | Used, sharpened | The learning optimizer, with a good-enough benchmark beside it. Agreed in review. |
| [lean] Check that endless repetition doesn't pay | Set aside | Replaced by your decision that replays are challenges only, with a hard cap. There's nothing to grind, so walls are sorted by quests or by play instead. |
| [lean] A casual player is of interest; don't waste compute | Used | The casual player, and no other types. |
| [lean] 4 to 7 quests a week | Used | Now decided for the first version. |
| [firm] Feel checks test that information is clear | Used | The reader only sees what a player sees. |
| [firm] Could you tell why it was lost, well enough to guess a strategy | Used | Sheet question 3, scored against the colours that win. |
| [lean] Dramatic moments | Used | How fights are picked to read, and sheet question 4. |
| [lean] A range across dungeons, not within one | Used | Sheet question 6 compares dungeons. |
| [lean] Every dungeon builds to its boss | Used | Sheet question 6, and which fight runs are lost in. |
| [lean] The next-party guess in colour terms | Used | Sheet question 3. |
| [lean] Units that do nothing aren't a concern | Used | Left off the sheet. |
| [lean] Read reports and ask in chat; leave the door open | Used | Studies are data, and the core can run in a browser. |
| Left to me: other players, how strictness is measured, the brief's list | Decided | As above. |

## Agreed in review

- **Which optimizer we tune for** (the first draft's challenge): agreed, with your change. We tune for the learning optimizer. Beside it is a good-enough benchmark rather than the true best, since finding the best would eat most of the compute for answers that don't matter.
- **Colour** is the broad kind of party, with the caveats under Strictness.
- **Quests a week:** 4 to 7 for the first version, and the board uses the same range. In `DECISIONS.md`.
- **Replays are challenges only,** replacing "repetition yes, endless grinding no". In `DECISIONS.md`.
- **The hard cap** (the second draft's open question): a dungeon's first clear and each of its challenges pay loot once. Nothing already beaten pays again, and anything not yet beaten can be retried as often as the player likes. So everything play can earn is countable. In `DECISIONS.md`.

There are no new challenges, and no open questions.

## Predictions

Stage 3 checks these, as step 2's did.

- **The same study gives the same numbers,** run twice.
- **No made-up effects.** The stand-in ignores formations, abilities, gear and perks, so the harness must report "no clear difference" for each, and the four perk numbers must match. If it finds an effect, the "how sure" machinery is wrong.
- **Real effects show.** Party size and class do change stand-in results, and the harness reports them as holding in most seed blocks.
- **Shared seeds pay off.** Two copies of the same party on shared seeds give identical results. Comparing different parties takes fewer runs for the same certainty than on separate seeds.
- **Optimizer, benchmark, casual.** The benchmark does at least as well as the optimizer every week, and stays inside its budget. The optimizer beats the casual player in all 20 seed blocks.
- **Walls are sorted.** Every stuck week is walled by quests or by play. Stand-in gear does nothing, so every wall should end with an unlock, never with loot.
- **An honest reader.** The stand-in is flat, so the reader should say so. If it calls the fights varied or dramatic, it's flattering, or the reading pack leaks. It also shouldn't be able to name stats it wasn't shown.
- **A digest fits on one screen.**
- **Speed.** The sample combat study runs in under a minute on the dev server, and the progression study in a few minutes.

## How it's tested

You read one sample report per level, words first and with a story, and say whether it tells you what you need. The predictions above are my checklist. If the build runs past about one session, I'll stop and report rather than spiral.

## For later steps

- **Step 4:** real combat will be slower, so studies will sample parties instead of trying them all, and reports will say how many they tried.
- **Steps 5 and 8 to 10:** colour moves from classes to the party's verbs, weighted by efficacy, with formations and powerful gear counting toward it. The harness may read verbs to measure things; the engine still never does.
- **Steps 10 and 11:** replays are challenges only. Step 1's content has a replay loot table, and step 2's run record has a first-clear flag; both become challenge loot. Open there: how many challenges a dungeon has, and whether a challenge changes the enemies or only sets conditions for the player.
- **Step 11:** each simulated try gets fresh dice for now. Where a retry's seed comes from is step 11's call.
- **Step 14** sets the win bar, and how "75% of best-in-class" reads against the benchmark.
- **Step 15** judges wall lengths, and the ratio of walls by quests to walls by play.
- **Step 19** builds a board of 4 to 7 quests. Real quest data replaces the assumed rates after the first implementation pass.
