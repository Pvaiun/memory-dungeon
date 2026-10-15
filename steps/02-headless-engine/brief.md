# Step 2 brief: headless engine

For the director to answer. You can answer it in the step's session, run `/intent 2` in a fresh session on this repo, or paste this whole file into any chat and bring back the `intent.md` it produces.

## The game, and this step

Memory is a personal memory aid for someone with ADHD. It captures tasks, habits, events and goals, and shows what matters today on a small "Now" map. The game is an optional tab inside it: a party-based JRPG dungeon crawler with automatic combat, where preparation is the game. Real-life quests on a weekly board pay unlocks (new specializations, formations and powerful gear), and dungeons pay ordinary gear. The player builds a party of up to five units, sends it into a dungeon and watches: a few automatic fights, a perk pick between each, then a boss. AI designs the game under the director's direction, and simulation stands in for most playtesting.

Step 2 builds the headless engine: the game's combat and run logic, with no screen. It takes content data (classes, abilities, enemies and dungeons, in the format step 1 designed), a party and a seed. It plays out a fight or a whole dungeon run, and writes everything that happened into a fight log. The same seed always gives the same fight. Every later step leans on it: simulations will run thousands of fights through it, and the finished game will run it in the browser. It's infrastructure, so this brief is light. It's mostly about what you want to see when you read a fight log.

## Already decided

These aren't asked again.

- **Fights run in the browser, from a seed.** No fight log is stored anywhere, because the seed, party, content and engine version rebuild it exactly. The server keeps a short summary of each run: its seed, outcome and loot.
- **The same seed gives the same fight on every device.** Combat math sticks to basic arithmetic, so Chrome and Safari agree to the last digit.
- **Pure game logic.** No Node-only code, so the engine runs in a browser, on Memory's server, and in Node for simulations.
- **All rules come from data.** The engine reads the step 1 schema and nothing else. It never reads verbs or keyholes, which are design notes and predictions, never win rules.
- **The combat rules are placeholders.** The engine runs the rough rules and numbers in the worked example, the Hollow of the Grey Mother. Steps 4 to 11 replace them piece by piece, so step 2 is judged on working, not on balance or feel.
- **Whole runs, not just fights.** The engine plays whole dungeons: the fights, perk picks between them, the boss and the loot roll.
- **How it's tested:** exact replay from a seed, and the worked example running end to end. You'll also get the time per fight and per run, and the size of a fight log.
- **Not this step:** win rates and other stats across many fights (step 3), the real combat rules (step 4), and how a fight looks on a phone (step 21).

## Questions

Short answers are fine. "I don't mind" is an answer too: it leaves the call to the designer. The examples use names from the worked example, with made-up numbers.

**1. How much should each turn show?** The engine can record more than you read; this is about what you read.

- **a. What a player would see:** who acted, the damage, MISS, BLOCKED or CRIT, statuses landing, and who fell. No hidden stats.
  `The Grey Mother attacks Warrior: Vanguard. BLOCKED! 6 damage.`
- **b. That, plus the numbers behind it:** the hit chance, damage before and after armour, and HP left.
  `The Grey Mother attacks Warrior: Vanguard (80% to hit). BLOCKED! 14 → 7, 6 after armour. Vanguard 38/50.`
- **c. Everything:** every roll, every modifier, and every rule the engine checked, including the ones that didn't fire.

**2. Should the log say why things happen?** Fights are full of reactions: counterattacks, taunts, perks and formation effects.

- **a. Just what happened.**
  `Ranger: Duelist dodges. Ranger: Duelist attacks Ash Wolf for 7.`
- **b. Name the cause** of anything that isn't a plain turn.
  `Ranger: Duelist dodges. Riposte! Strikes back at Ash Wolf for 7.`
- **c. Also say why each unit picked its action and target.**
  `Cleric: Mender uses Mend on Ranger: Archer (lowest health, below 60%).`

**3. What should a log tell you before the turns start?** Pick any.

- the result, and how many rounds it took
- each unit's HP at the end
- damage dealt and taken, per unit
- how often each ability, perk and formation effect fired
- misses, crits and blocks
- the seed and versions, so it can be replayed
- nothing: just the turns

Is there anything else you'd want to see at a glance?

**4. How do you want to read this step's sample run?** At the end of step 2 you'll read one run of the worked example. Step 3 designs how you read fights for good; this is only for now.

- **a.** A text file in the repo, opened in the Claude app.
- **b.** A small private web page you open on your phone, with the run laid out fight by fight.
- **c.** Pasted into the chat.

**5. What would convince you the engine works?** Replay from a seed and the worked example running end to end are already planned. Would you add anything?

- **a.** Following one fight by hand: every number in the log checks out against the rules.
- **b.** Proof on your own phone: a page that replays a seed in your phone's browser and shows the fight matches the computer's.
- **c.** The tests passing is enough.

## What the designer will decide

So you know what isn't being asked. Say if you want a say in any of it.

- How the log is stored as data, and how it's turned into text.
- The random-number generator, and how one seed covers fights, perk offers and loot.
- How automated runs pick perks. In the real game, the player picks.
- Whether to build every rule the schema can express now, or only what the worked example uses, adding the rest as later steps need it.
- Whether to nudge placeholder numbers so the sample run reads sensibly, for example if a fight ends in one round or runs out of time.

## For the interviewer

If you're an AI reading this in another chat, you're the interviewer. The director's answers become `steps/02-headless-engine/intent.md`.

- **Ask, don't design.** Where a question is hard to answer cold, offer options to react to, but hold back your own design.
- **Keep it short.** One sitting and the questions above. Follow up only where an answer is ambiguous.
- **Their words, not yours.** Record what the director said, lightly cleaned. Mark the items that were picks from the options above, so the AI doesn't end up quietly writing the vision.
- **Tag every item:**
  - **firm:** bend it only with evidence and the director's agreement.
  - **lean:** the designer may bend it, and says so.
  - **reference:** a game or work, with what to take from it.
  - **idea:** take it or leave it.
- **"I don't mind" is an answer.** Record it under "Left to the designer".
- **Don't re-ask** anything under "Already decided" unless the director reopens it.

Read the result back to the director as a short list and fix whatever they correct. Then output it in this format, so it can be saved as it is:

```
# Step 2 intent

How it was gathered (this session, /intent or another chat) and the date.

- [firm] ...
- [lean] ...
- [lean, picked from options] ...
- [reference] Game or work: what to take from it.
- [idea] ...

## Left to the designer

- ...
```
