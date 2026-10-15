# Step 2 design: headless engine

For the director's approval. Built from `intent.md` (Oct 15, 2026). The appendix is for later sessions; you can skip it.

## Needs you

- **Nothing to decide.** There's one gap to look at under Challenges: to replay a run, the server's summary of it needs more than the seed, outcome and loot.
- **Approve this,** and I'll build it.

## The design

**What it does.** The engine takes content, a party, a dungeon and a seed, and plays the run: each fight, each perk offer, the boss and the loot roll. It writes down everything that happens as it goes. Nothing in it reads the clock or the network, so the same inputs always give the same run.

**A run moves one stage at a time.** Between stages, the whole run is a small block of plain data: each unit's HP, the perks picked so far, the next stage, and anything used up, like Second Wind's once-per-run heal. That block can be saved and resumed on another device, or copied to try different paths from the same point. At a perk pick, the engine stops and offers three perks, and whoever is driving the run sends back a choice. That's the player in the game, or a simulation. Perk picks are the run's only input.

**Randomness.** Each run has one seed, a whole number. Each fight, each perk offer and the loot roll get their own slice of it, made by mixing the seed with the stage number. So changing pick 1 doesn't change fight 3's dice or what the next offer shows, which is what makes comparing paths fair. The generator is a standard small one (sfc32) that uses only whole-number arithmetic, so every browser gets the same numbers.

**The same result on every device.** The rule language only has adding, subtracting, multiplying, dividing, min, max, rounding and clamping, and every browser computes those identically. A test checks that the engine never uses the clock, `Math.random`, or the maths functions that can differ between browsers, such as powers, logarithms and trigonometry.

**Every path through the perk picks (your idea).** An explorer plays one seed down every combination of picks, and returns each path's outcome. Paths share their early fights: it saves the run after each fight and branches from there. So the worked example's 3 picks cost 40 fights, not 108. Steps 3 and 10 build their perk studies on it.

Simulations that aren't studying perks use a simple picker instead, either the first option or a random one.

**The fight log.** It's a list of everything that happened, in order, as data for code to count:
- turns and actions, and what caused each: an ability, a perk, a formation slot or a status
- every roll, and the damage before and after each step
- HP, statuses, defeats and summons

Each entry is marked as either something a player could see or a hidden number. A future player-facing log is then just a filter. For debugging there's a plain printout, one line per entry.

Logs can be switched off. Bulk simulations run without them, and any run worth a look is replayed with logs on. Nothing is stored. Each run's record starts with what's needed to replay it: the engine version, the content's id and fingerprint, the party, dungeon, seed and picks.

**How much of the rule language it runs.** It runs three groups:
- everything the worked example uses
- the grammar that holds rules together: the maths, and/or/not, and who picks whom
- the ruleset switches step 4 will want to compare, such as how turn-order ties break, cooldowns carrying over between fights, and statuses lasting between fights

Three building blocks need machinery of their own, and nothing uses them yet:
- resources other than HP
- flags that last a set number of turns
- reviving fallen units between fights, since the schema doesn't say with how much HP

The engine refuses content that uses one of these, naming it, until a step designs it. Content is checked once when it loads, so a refusal comes before any fight.

**Placeholder rules.** The schema leaves some combat details open, such as whether a counterattack lands before the rest of a multi-hit attack. The engine needs an answer for each, so I've picked the simplest. They're placeholders for step 4. The five that most change how a fight plays are under "Least sure", and the full list is in the appendix.

**Where it lives.** It goes in `src/engine/`, with tests beside it, inside the typecheck that keeps out Node-only code. A small Node script runs a dungeon from the command line, prints a log or a summary, and times it. I expect about 1,500 lines, mostly because the rule language has many small pieces.

## Intent map

| Intent | | How |
| --- | --- | --- |
| [lean] Fight logs are mostly for the AI and for debugging | Used | The log is data for code to count, plus a plain printout for debugging. There's no reading copy for you. |
| [idea] Players may eventually see logs | Used | Each entry is marked player-visible or hidden, so a player's log is a filter, with nothing to rewrite. |
| [firm] The building blocks are placeholders | Used | It builds what the worked example needs, plus cheap grammar. It refuses the three unbuilt blocks by name, and every placeholder rule is listed for step 4. |
| [lean] Perk picks are the only in-run choice | Used | Picks are the run's only input. Nothing else in a run asks for a decision. |
| [idea] Simulate every perk choice | Used | Per-stage seed slices, runs that can be saved and branched, and an explorer. There's a caution about hindsight under "For later steps". |
| [lean] It's hard to know the right perks without a human | Used | The explorer shows which picks win, not which are interesting to choose. Perk feel stays with you at step 10. |
| Left to me: run flow, random-number generator, how much to build, log format | Decided | As above. |

## Challenges

1. **A run summary needs more to be replayable.** `DECISIONS.md` has the server keeping each run's seed, outcome and loot. Rebuilding a run also needs the party loadout, the perk picks, and the content and engine versions. I'll treat those as part of the summary unless you object. Step 19 settles the save format.
2. **Replays only hold within a version.** Once the engine or content changes, an old seed plays out differently, and with no stored logs, past fights can't be watched again. Nothing needs that today. If a player-facing log ever shows past fights, it will have to store what it shows. This is a note for that feature, not something to act on now.

## Least sure

These are the five placeholder rules that most change how a fight plays. All are step 4's to decide; say if any looks wrong now.

1. **Reactions happen at once, inside the attack that caused them.** If the Duelist dodges the first of the Grey Mother's three Rend hits, the counter lands before hits two and three.
2. **"Once per turn" resets on every unit's turn,** not just the owner's. So Riposte can counter once during each enemy's turn.
3. **Turn order is set at the start of each round, by speed.** A mid-round speed change, like Frenzy, counts from the next round, and so do summoned wolves.
4. **A multi-hit attack picks its target once.** If the target falls, the remaining hits are lost.
5. **A fight ends the moment one side is wiped out,** and anything still pending is dropped. If both sides fall together, it counts as a loss.

## Variants

None for you. Nothing here is a feel fork. Step 4 will compare rule variants by simulation, and the ruleset switches are built so it can.

## Predictions

Stage 3 checks these.

- **Replay:** the same inputs give an identical log over at least 10,000 seeded runs. A run saved and resumed between stages gives the same log as one played straight through.
- **Speed,** in Node on this machine: under 1 ms per fight, under 5 ms per run, and under 50 ms to explore every path of the worked example. A phone may be a few times slower, which is still instant.
- **Log size:** tens of KB per fight as JSON, and under 250 KB for a whole run. With logs off, close to nothing.
- **End to end:** the worked example runs for a spread of parties across many seeds, with no errors and no fight hitting a safety limit.
- **Lopsided is fine:** the placeholder numbers may make the run lopsided, with the party winning almost always or almost never. That's not step 2's problem unless fights are degenerate, such as ending in the first round or often running out of time. Then I'll adjust numbers, with a budget of 3 rounds. If the build itself runs past about one session, I'll stop and report rather than spiral.

## How it's tested

- **Replay and resume:** the two checks under Predictions.
- **One small test per mechanic,** such as:
  - a dodge triggers Riposte only once per turn
  - bleed stacks and ticks
  - a stun skips a turn
  - an HP threshold fires once per crossing
  - cooldowns and limits count correctly
  - a perk patch changes its ability
  - a summon stops at the enemy cap

  These do the job of checking every number, so nobody has to read logs.
- **A guard test** for the clock, `Math.random` and the maths functions that can differ between browsers.
- **Refusals:** loading content that uses an unbuilt block fails and names it.

## For later steps

- **Hindsight in the explorer (steps 3 and 10).** The best path for a seed knows how every later fight's dice fall, and a player can't. So when step 10 reports how much picks matter, it should give four numbers: the hindsight best, the best without hindsight (the pick that wins most often on average), random picks, and the worst.
- **Where a retry's seed comes from (step 10).** If every retry draws new dice and fights are swingy, a player can retry until they get lucky. That works against "repeating the same strategy rarely wins". Step 4 sets how swingy fights are, and step 10 can decide whether retries reroll.
- **Premium perks (step 10).** Does a premium perk replace its regular version, or stack with it? Placeholder: it replaces it.
- **Challenge loot (step 9 or 10).** Does clearing a challenge also pay the dungeon's replay loot? Placeholder: both pay.

## Appendix: placeholder rules, for step 4

Each is the simplest reading of the schema where it leaves a choice open. Step 4 replaces them as it designs the real rules.

**Rounds and turns**
- At the start of each round, units with `acts_first` go first, then everyone by speed, highest first. Ties break randomly, from the fight's dice. The order is fixed for the round.
- A unit's turn runs in this order:
  1. `turn_start` triggers.
  2. It acts, unless it has `skip_turn`.
  3. `turn_end` triggers, including status ticks.
  4. Its cooldowns drop by 1.
  5. Its statuses and buffs count down, and expired ones end.
- A stunned unit still gets the start and end of its turn, so its bleed ticks and its timers count down.
- Units summoned mid-round act from the next round. A unit that falls loses its remaining turn.
- Reaching `maxRounds` is a loss.

**Actions and damage**
- An action picks its target once, and `hits` repeats its effects on that target. Hits on a fallen target are skipped. A `modify_action` `hits` multiplies the action's own hits.
- Rolls happen in pipeline order. Damage from a status or a rule, with its rolls switched off, still goes through scaling and mitigation. The unit that applied the status counts as the attacker, even if it has fallen.
- Damage and healing round down to whole numbers. HP never goes above `max_hp`, and if `max_hp` drops, HP drops with it.

**Triggers**
- Reactions resolve at once, depth first. Units are checked in a fixed order: the party in formation-slot order, then enemies in the order they appeared. Within a unit, rules are checked in this order: statuses (oldest first), the formation's party-wide rules, its slot's rules, abilities in equipped order, gear in slot order, then perks in pick order.
- A chain of reactions stops at 8 deep, and the log notes it. That's a sign of a loop in the content.
- Limits reset on a schedule: "per turn" when any unit's turn starts, "per round" at the start of a round, "per fight" at the start of a fight, and "per run" never.
- `hp_below` fires when HP goes from at or above the line to below it. It can fire again after healing back above the line.
- A passive rule's `if` is re-checked every time a stat is read.

**Statuses and buffs**
- `stack`: one instance. Stacks add up to `maxStacks`, the duration resets, and the newest applier counts as the attacker.
- `refresh`: one instance. The duration resets, and the stacks are unchanged.
- `independent`: separate instances, each with its own applier and duration.
- With no turns given and no default, a status lasts the fight. Buffs count down on their target's turns, like statuses.

**Targeting**
- `weighted`: each unit's chance is in proportion to its aggro. If every unit's aggro is 0, the chances are equal.
- `lowest` and `highest`: ties break randomly.

**End of a fight**
- After every effect, the engine checks whether a side has no living units, and if so the fight ends. Anything still pending is dropped. If both sides are wiped out, it's a loss.
- On a win, `fight_end` fires for the surviving party. Then statuses clear if the ruleset says so, cooldowns reset, and the `betweenFights` effects apply to each living unit.

**The run**
- HP starts at its maximum when a run begins, and carries between fights. Fallen units stay down.
- A perk offer has 3 options. For each one, roll `premiumChance`. On a success, draw a premium perk if any are left in the pool; otherwise draw a regular one. No perk appears twice in one offer, and picked perks aren't offered again. If the pool runs short, the offer has fewer options. Perks no party unit can use are still offered, as the ruleset says.
- A premium perk replaces its regular version if the party holds it.
- Loot is paid only on a clear. It's the guaranteed items plus weighted draws from the first-clear or replay table; the caller says which applies. If the run was a challenge attempt and the party meets the challenge, its loot is paid too. A loss pays nothing.
