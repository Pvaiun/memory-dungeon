# Step 4 report: combat concepts

Built Oct 20, 2026, from your design (`design.md`), which counted as the approved design. **Signed off by the director, Oct 20, 2026,** with the changes below. Its decisions are in `DECISIONS.md`.

## After your read

- **Intensity statuses end below 1 stack,** as challenged. A Burn now just fizzles out.
- **Abilities have a default recovery,** about a sword's (3 ticks in the worked example), which fixes "two actions at once".
- **Status damage is typeless** (your direction; my call on the details): Attack and Magic scale hits only, so neither scales a status's own damage, nor the stacks of a status that deals damage. Statuses keep their elements, and counterattacks, heals and shields scale as usual. Overrule the heal and shield part if I read you wrong. The example's Rot now deals a flat 4.
- **Scaling reset (director, Oct 20, 2026, after sign-off),** replacing the typeless-damage rules above. Every amount states its own scaling, from any stats or none, and nothing scales by default: Attack and Magic are ordinary stats, and weapons state their damage. A status is fixed when applied: only the stacks an application adds can scale, plus boosts that name the status. A Refresh reapplication replaces the old one, and any status with one applier at a time knows its source. Status damage is untyped by convention. Engine 0.4; in the worked example only Bleed's damage changed (4 to 3 a pulse, in 180 of 2,000 runs), and no fight's result changed. Full list in `DECISIONS.md`.
- **The rest is confirmed as built:** the four choices below, and no design for a fight nobody can win until one happens.
- The engine version is now 0.3. All 246 tests pass, and Chrome's and Safari's engines still agree.

## Decisions needed

1. **Sign off step 4.** Every rule in your design works in the engine, shown by 122 tests, most of them your Part 2 examples by name. The stand-in fight is gone. There's one challenge and four small questions below; none of them blocks sign-off.

2. **Challenge: let an Intensity status end when its total drops below 1 stack.** You count stacks in thousandths and end a status at 0. Halving a total of thousandths takes about 10 extra steps to reach 0, so every Burn, whatever its size, ends with 10 pulses that deal nothing, and its icon stays up 20 ticks after its damage is done. Ending below 1 stack removes those and changes no damage:

   | Burn stacks | As designed: pulses (dealing 0), damage | Ending below 1 stack |
   | --- | --- | --- |
   | 3 | 12 (10), 4 | 2 (0), 4 |
   | 10 | 14 (10), 18 | 4 (0), 18 |
   | 300 | 19 (10), 596 | 9 (0), 596 |

   Fractional stacks still work when applying (0.3 × Magic stacks), which I take to be why thousandths are there. It's built as you wrote it; if you agree, it's a two-line change.

3. **Four questions.** Each has a working answer in the build. Answer now, or leave it for the step named.
   - **A fight nobody can win.** With no time limit, a fight where neither side can hurt the other would never end. The engine stops it at 5,000 ticks and counts it a loss, as a safety stop. It never happened in 4,023 sample fights (the longest took 209 ticks). Is a loss right? (Steps 11 or 14.)
   - **Can Attack scale a pulse?** "Attack scales only physical instances", and pulses have no type, so read strictly, a Bleed can't scale from Attack. I allowed it. (Step 6.)
   - **Lifesteal as a stat** can't be written yet. "Heal Lifesteal% of the damage dealt" multiplies two numbers, and a number is base + ratio × one source. A status can heal a fixed share of the damage. If class design wants Lifesteal, or anything like "X% per point of Y", a scale needs a second factor, which is a small change. (Steps 6 or 8.)
   - **Where your design was silent, I chose.** These change what a player sees, so say if any is wrong:
     - Reaction damage is never a hit, so it never triggers on-hit effects and never crits. Two Thorns units can't bounce damage back and forth forever.
     - An action whose stated targeting finds nobody when it resolves fails like one it can't pay for: no MP spent, no cooldown.
     - Immunity to all damage also blocks damage-over-time statuses, since they contain damage.
     - "A random ally" can be the unit itself, so a healer can heal itself.

     The 20 or so smaller choices are in `tuning.md`.

## What was built

- **Your combat, in the engine** (`src/engine/combat/`). Fights run on sub-ticks with your timing, same-sub-tick order, actions, stats, damage, targeting, statuses and reactions. It's about 1,300 lines; the stand-in was 120. Your design has many rules, and that's what they cost.
- **Content in your language** (schema 0.4). Step 1's rule language is replaced by yours: stats, statuses, actions and targeting rules. Class passives, gear, formation slots and perks all give stats and statuses. Dungeons, challenges, loot and parties are unchanged.
- **A validator for your rules.** Your Part 2 cards are its tests: Fire Slash is rejected (physical instances have no element), and so are Strike, Ember Strike, Bolt and "+20% Crit chance".
- **The worked example**, rewritten in your language with the same names. It's still placeholder, but it uses most concepts: weapons with several hits, MP, cast times, a shield, a stun, a taunt, a damage-over-time with an element, a boss immune to stuns, Thorns, and wolves that react when a packmate falls.
- **The harness and its tools** read real combat.

**Changes from your design: none.** Two additions it needed: a reaction can scale from its event's amount ("heal half the damage dealt"), and a scale can read current or missing HP ("5% of the holder's remaining HP", from your examples).

## What the numbers say

- **Every concept works.** All 122 functionality tests pass, holding across every seed they use. Writing them from your examples found one real bug, now fixed: an Intensity status counted the applier's boosts twice.
- **Same result on every device.** Chrome's JavaScript engine and Safari's gave identical results over 10,000 runs. Replaying runs from their records, and saving and loading mid-fight, are still exact.
- **Fast enough to play, slower to simulate.** A fight takes about 0.5 ms, 20 times the stand-in. A phone a few times slower would still take about 2 ms. Studies slow down to match: the combat sample takes 6 to 8 minutes instead of 35 seconds. That's fine for now. Studies that sweep every party at volume (steps 13 to 16) will want seeds run in parallel.
- **The harness now sees real effects.** Formation, gear and abilities each change results, in 20 of 20 seed blocks. Each unit has its own dice, as your design says, so comparisons got cheaper: judging a tweak takes 11 times fewer runs (step 3: 4.4), and comparing two parties that share units 1.6 to 2.2 times fewer (step 3: no saving).
- **A harness finding for steps 14 and 15.** The good-enough benchmark fell behind the optimizer in 3 of 600 player-weeks. In the case I traced, the optimizer cleared a dungeon with a lucky win by a solo Vanguard, a party the benchmark rates unwinnable. More budget didn't fix it.
- **Logs grew.** What a player sees comes to 4 KB per run compressed (the stand-in's was 1.5 KB). It only matters if past fights are stored.
- **Placeholder fights** last a median of 26 ticks; boss fights last 100 to 200. That says nothing about balance, but it gives step 22 a scale: at one tick a second, a boss fight would take 2 to 3 minutes.

## Feel

A fresh AI reader read five fights, seeing only what a player sees. In all 3 lost runs it guessed a party that wins (always "bring the Cleric", which is placeholder balance). Most of its notes are for step 22. The ones worth your attention:

- **Three gaps in my reading packs, now fixed.** They didn't show what each unit wears, so Thorns from the Yata Mirror looked like it came from nowhere. Damage over time had no time stamps, so ticks read as part of the action above them. And end times were rounded differently from event times.
- **"Two actions at once."** Abilities have no recovery, so a unit's basic attack follows its ability a thousandth of a tick later. Rounded for display, they look simultaneous, and the reader couldn't tell whether abilities are free extra actions. That's a question for step 22 (show it differently), or for you (a small default recovery for abilities).
- **No sense of the boss's health,** so a near win reads like a hopeless loss. Step 3 already found this; step 22 owns it.
- **Small wording traps:** "Ash Wolf: MISS" (who missed?), "takes CRIT 0 BLOCKED" (looks broken), and WEAK and RESIST after the number.

Two fights, retold. Both are the worked example's party (Vanguard, Duelist, Archer) against the Grey Mother.

> **A close loss (seed 2).** They reach her worn down from the earlier fights. Her double rends barely scratch the Vanguard's armor, but every 24 ticks she rears up and mauls him, announced 4 ticks ahead, for a fifth of his health. At half health (tick 68) she howls into a frenzy, and her next Maul drops the Vanguard. With nobody drawing her blows, the Duelist falls, then the Archer at tick 122, to a Maul. She had 61 of 650 HP left. A player sees none of how close it was.

> **A win on a bleed tick (seed 3).** The same start, with the Vanguard weaker going in. She howls at tick 63, and her frenzied rends drop the Vanguard at once. The two Rangers fight on alone: the Duelist survives two Mauls, and the Archer's barbed arrows keep her bleeding. Her last 12 HP go to a hit, a crit and a final Bleed tick.

## Method notes

- **A design with worked examples made the best acceptance checklist yet.** Your Part 2 became tests almost one for one, and one of them caught a real bug. I'd suggest future designs carry examples like these.
- **Read a story before trusting a total, again.** Retelling a boss fight showed the Grey Mother never howled: I'd given Howl a huge cooldown to mean "once per fight", and under your rules every action starts the fight on cooldown. No test or number had caught it. It's fixed, and the idiom ("a short cooldown, plus a condition that reads the status it gives") is noted for step 6.
- **Pricing a direction was cheap here,** because the variant was pure arithmetic and could be checked against the engine.
- **The feel check paid for itself on the tools again,** finding three gaps in reading packs that no test would.

## For later steps

- **Step 5:** the verbs list now has no checks behind it; step 1's verb signals read the old rule language. Rebuild them over the new building blocks.
- **Step 6:** there's no "once per fight"; use a condition on the status the ability gives (see Howl). Lifesteal needs a decision (above). A guard stops event chains more than 64 deep. None has happened, but step 6 is where runaway chains get tested.
- **Step 7:** trait words need checking against mechanics. The placeholder wolves are "strong in numbers" but grow stronger as packmates fall, and the reader flagged the mismatch.
- **Step 11:** recovery between fights, revives (statuses can already survive a KO, but nothing revives yet), and what a stalled fight counts as.
- **Steps 14 and 15:** the benchmark's search shape (above). Studies will need parallel seeds at volume.
- **Step 22:** the reader's notes on how fights read (above), and the tick's length in seconds.
