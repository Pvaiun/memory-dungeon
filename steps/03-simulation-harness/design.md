# Step 3 design: simulation harness

First draft, for the director's review, Oct 16, 2026. Built from `intent.md`.

Like step 2, this is mostly machinery. It builds the process that runs simulations and writes reports, not what the reports will say, which is your firm scope for this step. The design calls are what it measures, how results reach you, and who the simulated players are.

## What step 3 builds

### Studies

Everything runs as a **study**: a small data file that says what to run. In go the content, any changes to it ("the Ranger with double HP"), parties, dungeons, simulated players and seeds. Out come the numbers, stories and a draft report. The same study always gives the same numbers.

- One study can run versions side by side: the content as it is, and with a change. That's how a challenge gets both versions' numbers, and how a what-if you ask in chat gets answered: the AI writes the study, runs it and brings back the words.
- The harness's core is game-safe code like the engine, with no Node, plus a thin command-line wrapper. A page that runs studies on your phone stays possible later, without building one now.

### How sure

- Every rate gets a range: "wins 62%, between 57 and 66".
- Seeds are split into 20 blocks. A claim such as "the Phalanx beats Open Order" says how many blocks it held in: "19 of 20". A difference too small to trust is reported as "no clear difference".
- Each study is marked as tuning or held out. Held-out studies only run for the final check, and the report says which kind it is.

### Combat level

Many parties against many dungeons or single fights, many seeds each, with logs off. It measures what the intent lists for the AI:

- how close the losses were: the enemy HP left, and which fight was lost
- fight length, and the spread of results for the same party across seeds
- how many tries a wall takes
- how each class does in different situations
- synergies far above what their parts predict
- what perks change, as step 2's four numbers: the best picks with hindsight, the best a player could know to make, random picks, and the worst

**Strictness, in your terms.** Each party has a **colour**: the broad kind of party it is. Everything else is a **tweak**: formation, abilities, gear and perks. For each dungeon or challenge, the harness reports two numbers:

- **Colour strictness:** how many colours can win at all, with their best tweaks. "2 of 7 colours can win."
- **Tweak strictness:** inside the colours that can win, how many tweaks do. "8 in 10 tweaks win."

So a dungeon reads as "the wrong colour can't win, and the right one mostly can", or "the right colour, and then the exact build". Until verbs exist (step 5), a party's colour is the set of classes in it, such as Warrior + Cleric. After that it's the party's verb profile. What counts as "can win" is a placeholder bar, half its tries, until step 14 sets targets.

### Progression level

Simulated players play week by week. Each week they complete some quests, collect unlocks, adjust their party, and play runs: the next dungeon, its challenges, or replays.

- **The optimizer, who we tune for.** It does 4 to 7 quests a week and aims them at rewards it needs. It homes in on builds by trial and error: it sees what a player sees (wins, losses, how far it got), never hidden stats, and has a budget of tries each week. See Challenges.
- **The casual player,** as a check. It does 1 to 3 quests a week and plays a few runs. It keeps its party unless a new unit fits, and picks perks at random.
- **Nobody else,** to save compute. Another player type is one more definition, if it's ever needed.
- **The quest board** is a placeholder: 7 quests a week, each showing an unlock the player doesn't own yet. Quest rates are assumptions, as you asked.
- **The grind check.** At every wall, the harness also tries the slow road: replaying finished content many times. It reports how much that raised the chance of beating the wall, beside what the next quest unlock did. If replays help more than a little, the report says so. That's "repetition yes, endless grinding no", as a test.

Progression reports lead with your three questions:

- **Pacing over weeks:** unlocks, dungeons and challenges cleared, week by week.
- **How often a player waits to keep playing:** weeks with nothing new it can win.
- **Strictness at each wall.**

For the AI, they also track how long each wall lasted and what broke it, when party choices start to matter, and how often perks change the result at walls. Party choices "start to matter" in the first week the player owns more than fits in a party, and the best and worst parties it could field differ by a lot.

**Placeholder progression.** There's only one dungeon, and the stand-in never beats its boss. So the samples run on a ladder of six copies of the Hollow, with enemies scaled from weak to full strength, and the pack's specializations, formations and gear as unlocks. It only exists to give the sample reports something to say, and it's thrown away when real dungeons arrive.

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

### Reports

Each study writes a draft report and a data file. The data file holds every number, for the AI. The report always has the same shape, in your order:

1. **In short:** words first, a few sentences, each saying how sure it is.
2. **Questions for you,** in plain language, where a call is subjective. Only if there are any.
3. **Stories:** a simulated player's weeks as a short diary, or a fight retold. One to three.
4. **Charts:** one to three, drawn in text, so they read in the repo and in chat.
5. **How it was run:** one line of seeds, runs and versions.

Tables live in the data file, and get printed when someone asks.

Stories come from the same runs as the numbers: the diary from one simulated player's real weeks, and the retelling from a real fight, replayed. So a wrong number shows up as a strange story. The harness drafts the facts, and the AI writes the words on top, because the words need judgement.

Study output goes to a folder git ignores. A report worth keeping is copied into its step's folder, and raw results are thrown away, since any run can be rebuilt from its seed.

### Size

It lives in `src/sim/`, with tests beside it, and runs with `npm run study`. I expect about 800 lines. There's no interface, no calls to AI services, and no parallel processing yet.

## Review sample

What a progression report will look like. The numbers are made up, to show the shape.

> **Progression: the placeholder ladder, optimizer and casual**
>
> **In short.** The optimizer clears 5 of the 6 dungeons by week 3, then waits 3 weeks on the last, which only falls when Cleric: Mender arrives. The casual player stalls behind dungeon 3 from week 3 to the end. Replays never got either of them past a wall. All of this holds in 20 of 20 seed blocks.
>
> **Questions for you.** Is 3 weeks waiting on one dungeon too long, when the player has nothing else new to try?
>
> **One optimizer's weeks.**
> Week 1: 5 quests. Got Ranger: Archer and the Phalanx. Cleared dungeons 1 and 2.
> Week 2: 6 quests. Got Ranger: Duelist. Cleared 3. Lost 4 eleven times; the best try left its boss on 8%.
> Week 3: 4 quests, no new unit. Cleared 4 and 5, then tried 6 nine times. Waiting.
>
> **Dungeons cleared by week**
> ```
> week  optimizer   casual
>  1    ██ 2        █ 1
>  2    ███ 3       ██ 2
>  3    █████ 5     ███ 3
>  4    █████ 5     ███ 3
> ```
> **How it was run:** 50 players of each kind, 12 weeks, engine 0.1, stand-in, content hollow-ladder. Tables in the data file.

What I'm least sure about:

- **The optimizer's trial and error.** How many tries a week, and how cleverly it narrows down, are guesses. The tuning depends on them, so the report will always show this optimizer next to the all-knowing one (see Challenges).
- **When party choices "start to matter".** My measure is a stand-in for a feeling. It may need your words once real content exists.
- **The colour reading** (open question 1).

## Intent map

| Intent | | How |
| --- | --- | --- |
| [firm] Build the process; a placeholder, generic report | Used | Studies, measures and the report's shape are built. What reports say waits for content. |
| [firm] Build-making and trial and error are the skill | Used | Strictness and the optimizer both measure building, not performing. |
| [lean] The numbers are mainly for the AI | Used | Every listed number is measured and kept in the data file. Few reach your words. |
| [lean] Your input is on the macro questions | Used | Progression reports lead with pacing, waiting and strictness. |
| [firm] Strictness in colour-space terms | Used | Colour and tweak strictness. Open question 1 checks my reading. |
| [firm] Words, then stories, then charts; tables available | Used | The report's order. Tables are in the data file. |
| [lean] Balance and feel both reach you; variety must be felt | Used | Feel answers feed the words. Variety is a feel question asked across dungeons. |
| [lean] Stories catch wrong numbers | Used | Stories come from the same runs as the numbers. |
| [lean] Reports stay in chats and the repo | Used | Markdown, with charts drawn in text. |
| [lean] The test: a words-first sample per level, with a story | Used | See How it's tested. |
| [firm] Not modelled on your history | Used | Quest rates are assumptions. |
| [firm] Tune for the optimizer; requirements can be strict | Used, sharpened | Challenge 1: which optimizer. |
| [lean] Grinding mustn't pay; casual is of interest; don't waste compute | Used | The grind check at every wall, the casual player, and no other types. |
| [lean] 4 to 7 quests a week | Used | Open question 2, on board size. |
| [firm] Feel checks test that information is clear | Used | The reader only sees what a player sees. |
| [firm] Could you tell why it was lost, well enough to guess a strategy | Used | Sheet question 3, scored against the colours that win. |
| [lean] Dramatic moments | Used | How fights are picked to read, and sheet question 4. |
| [lean] A range across dungeons, not within one | Used | Sheet question 6 compares dungeons. |
| [lean] Every dungeon builds to its boss | Used | Sheet question 6, and which fight runs are lost in. |
| [lean] The next-party guess in colour terms | Used | Sheet question 3. |
| [lean] Units that do nothing aren't a concern | Used | Left off the sheet. |
| [lean] Read reports and ask in chat; leave the door open | Used | Studies are data, and the core can run in a browser. |
| Left to me: other players, how strictness is measured, the brief's list | Decided | As above. |

## Challenges

1. **Which optimizer we tune for.** A simulated optimizer could know everything: every hidden stat, and every party's exact chance, from testing them all. Tuning for that player would set walls that a real optimizer can't find, when they're learning by trial and error with stats hidden. "Requirements can be quite strict" makes that gap worse, and your firm line that the skill is trial and error points the same way. So I propose two:
   - **The learning optimizer,** described above, is who we tune for.
   - **The all-knowing optimizer** is used only to measure the best possible party, which "75% of best-in-class" is measured against.

   The gap between them is useful in itself: it says how hard the right build is to find.

## Open questions

1. **Colour.** I've read "colour space" as the broad kind of party, like a Magic deck's colours, with everything else as tweaks. Is that what you meant?
2. **Quests a week and board size.** I've taken 4 to 7 as quests completed each week, from a board of 7. The concept spec has 3 to 5 on the board. Board size belongs to step 19, so this only sets the simulation's placeholder. Is that all right?

## Predictions

Stage 3 checks these, as step 2's did.

- **The same study gives the same numbers,** run twice.
- **No made-up effects.** The stand-in ignores formations, abilities, gear and perks, so the harness must report "no clear difference" for each, and the four perk numbers must match. If it finds an effect, the "how sure" machinery is wrong.
- **Real effects show.** Party size and class do change stand-in results, and the harness reports them as holding in most seed blocks.
- **The optimizer beats the casual player** on the ladder, in all 20 seed blocks. The all-knowing optimizer does at least as well as the learning one.
- **The grind check passes, trivially.** Stand-in gear does nothing, so this only proves the check runs, not that the rule holds.
- **An honest reader.** The stand-in is flat, so the reader should say so. If it calls the fights varied or dramatic, it's flattering, or the reading pack leaks. It also shouldn't be able to name stats it wasn't shown.
- **Speed.** The sample combat study runs in under a minute on the dev server, and the progression study in a few minutes.

## How it's tested

You read one sample report per level, words first and with a story, and say whether it tells you what you need. The predictions above are my checklist. If the build runs past about one session, I'll stop and report rather than spiral.

## For later steps

- **Step 4:** real combat will be slower, so studies will sample parties instead of trying them all, and reports will say how many they tried.
- **Step 5:** colour moves from classes to verb profiles. The harness may read verbs to measure things; the engine still never does.
- **Step 11:** each simulated try gets fresh dice for now. Where a retry's seed comes from is step 11's call.
- **Steps 14 and 15** set the win bar and judge wall lengths and waiting weeks. Step 3 only measures them.
- **Step 19** sets the board size. Real quest data replaces the assumed rates after the first implementation pass.
