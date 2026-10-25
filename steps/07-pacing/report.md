# Step 7 report: the Knight and the Cleric, then pacing and value

You asked for three changes to test (the Cleric and Bard, Stun against Silence, a campfire) and a big pass on four problems: action economy, the relative value of actions, pacing, and mobs against bosses. All of it is built, tuned across the whole road, and on this branch. This report leads with what needs you; `design.md` has the changes in full, `intent.md` your words, `tuning.md` the 20 rounds.

**To play it:** as before, `npm install` then `npm run ui`. The journey is re-tuned for the new pacing; a run in progress on your phone carries over (the road is the same), but every fight plays differently now.

## 1. Decisions and open questions

### A. Your three changes: two worked as asked, one worked once the pacing changed

- **Stun pauses, Silence interrupts: it worked.** A Knight with MP to spare no longer locks bosses out: with Prayer beads on the Knight, Crush lands 93% of the time (was 64%) and Inferno 57% (was 2%). The Knight's share of the top builds fell from 40 to 30 of 90 on the nodes I tested it on.
- **The campfire: it worked, and I moved it.** I first put it before the boss; on reading the regular fights (C below) I moved it to the middle, as you'd said: after half the regular fights, rounded up. It splits a run's attrition in two, so each regular fight can hit harder. REST and FOCUS give 40%; in the screenshots it came when the Knight had 4 of 20 MP left, so the choice is real.
- **The Cleric: as specified, it was stronger, not weaker; with the pacing pass it's where it should be.** On the old pacing, Cure (a small, quick heal) fired almost nonstop and healed about 32,000 a run where Mercy had healed 24,000; the Cleric stayed in 77 of 90 top builds. With abilities on long cooldowns, Cure comes every 31 ticks: the Cleric's share of the top builds while owned fell from 58% (pass 9) to 48%, and builds with no healer at all rose from 35 to 42 of 175. **Open:** 48% is still the third-highest; the next levers are Cure's size and the Cleric's MP regen (on the old pacing, a smaller Cure took it from 46 to 39 of 50 top builds, and halving its regen as well to 29).
- **The Bard's Refrain** is in (each basic attack that lands gives a random ally 100 MP). The Bard is still near the bottom (20%), and dies in 30 of 100 fights it's in.

### B. Poison, under your rule

Statuses never scale from their applier; a stackable one scales by stacks applied, an unstackable one by nothing. Poison is flat: **250 a pulse for 10 ticks** (was 160 for 12). Venom arrow is now a 0.15 tap (it was 0.35 of Attack, then a light hit), so its Poison is the damage: five pulses, 1,250 in all. The ceiling was the Old Road's snakes: they Poison with every bite, and the node's difficulty knob doesn't touch a status, so at 400 a pulse the starters got through the Old Road's regular fights in 4 runs of 40, losing at the snake pit and the fight after it; at 250, in 18 (the rest is the run's attrition, which the middle campfire splits).

**Open:** the knob scales foes' hits but not their statuses, so a foe's Poison is the same 250 at node 1 (foes eased) and node 16 (foes at +90%). Letting a node's knob reach its foes' statuses would keep snakes in proportion, but it's a status scaling with something other than its stacks, so it's yours to allow.

### C. Mobs against bosses: two knobs a node, and some bosses are too strong for their nodes

Reading the Old Road by eye showed your problem 4 exactly: bandits at 1,600 HP dying to two swings, wolves to one, minions hitting for 37 to 70. The cause was the tuner: one knob for every foe, set so the boss could be beaten (−60 at node 1), left the regular fights soft. Now each node has **two knobs**: the tuner sets the regular fights first, alone (the hardest at which a good share of the sensible builds still win them, and the best nearly always do), then the boss on full runs. And a knob that eases foes takes k% off their HP but only k/2 % off their damage (it took k% off both), so an eased boss is shorter, not softer.

The result: losses split 151 in regular fights and 127 in boss fights (was 73 and 154); a regular fight costs the party about half its max HP; most knockouts are now the regular fights' chip. **The problem it shows:** six bosses sit at or near the knob's floor (eased by 50% or more): the Fire Giant on the Fire Mine, Deep Freeze and Judgement, the Iron Gate on Iron Wall, the Hive Queen on Knives Out, and the Royal Court. After harder regular fights, their designed moves (Inferno above all) are too much for their nodes even at a fraction of their HP. That's boss content, not tuning. **My proposal:** shrink Inferno (0.35 of Magic to 0.25) and look at the other five in a boss pass.

### D. Class balance is the next pass

Shares of the top builds while owned (a fair share is about 30%):

| | Classes |
| --- | --- |
| 55% to 68% | Vampire (Blood Moon forces it), Knight |
| 34% to 48% | Cleric, Paladin, Monk, Valkyrie, Hoplite, Bramble knight |
| 14% to 26% | Stormcaller, Bard, Assassin, Geomancer, Ranger |
| 9% to 10% | Pyromancer, Hexer, Frostweaver |

The casters at the bottom are the ones the regular fights now kill: knockouts per 100 fights a class is in, the Pyromancer 30, the Bard 30, the Stormcaller 27, against the Knight 11 and the Vampire 4. That's the price of mobs that hurt: a 2-HP caster is fragile against many small hits. The levers are theirs to choose: caster HP or Aggro on the stat lines (yours), the Behind slots and Veil, or a class pass. I'd do it next, now that the pacing holds still.

### E. Changes beyond your direction (confirm or revert)

- **The pacing numbers** (`design.md`): a cadence per weapon kind (5.3 to 10.7 ticks), ability cooldowns 30/48/70 moved up to 15% each by id, abilities about twice as big, actions starting a fight a third to two thirds charged, buff and debuff durations doubled (Haste 14), MP costs up, crit 4% a point (was 5%).
- **Bosses** at 55% of their document HP, their signature moves on a medium cooldown (about 48 ticks), Shield bash a light hit.
- **Armor can't take a hit below a quarter of its size** (`ruleset.armorFloor`): plate on a Knight blanked every weak and normal swing.
- **Two knobs a node**, and the knob's easy side mirroring its hard side.
- Engine 0.8 to 0.10: pausing lockouts, the campfire stage, the opening charge, the armor floor, a dungeon's `bossFoes`; the log names who applied a status.

## 2. Your four problems, before and after

All 20 nodes, each node's best builds, 6 seeds, at each pass's knobs.

| | Before (pass 9) | Now (pass 14) |
| --- | --- | --- |
| **1. Action economy:** party actions that are basic attacks | 32% | 66% |
| Party actions for each foe action, per unit | 2.0 to 1 | 1.4 to 1 (regular), 1.2 to 1 (boss) |
| **2. Value:** party damage from basic attacks, abilities, statuses (regular fights) | 34%, 56%, 9% | 57%, 37%, 5% |
| A Ranger's Poison against the arrow that carries it | a fifth | worth more (1,250 against the tap) |
| Crits | 17% of hits, 23% of damage | 11% of hits, 15% of damage |
| **3. Pacing:** party actions sharing a tick | 21% | 0% |
| Abilities cast straight after another by the same unit | 58% | 22% |
| **4. Mobs and bosses:** minions killed before acting | 14% | 6% |
| A regular fight's cost to the party | 58% of max HP, with foes padded (knobs −38 to +249) | 51%, with foes padded less (regular fights' knobs −46 to +103) |
| A boss fight's length against a regular one | 3.3 times | 1.5 times |
| Losses in regular fights against boss fights | 81 against 149 | 151 against 127 |
| Fights reaching the enrage | 76 | 4 |
| Your guess: losses come from MP running out and stalls | | No: the party has 61% of its MP at a loss, and 4 fights in 990 runs reach the enrage. Most knockouts are chip from swings (1,048 of 1,576), then a boss move's spike (240). |

## 3. The eyeball table

Each class's damage by source, and one use against one of its own swings (from the audit, pass 14):

- **Pyromancer:** swings 32%, Firebolt 26% (×2.3), Fireball 19% (×3.1), Burn 14%, Pyre 9% (×5.4).
- **Ranger:** swings 38%, Fire arrow 27% (×4.9), Rending arrow 22% (×3.0), Venom arrow and its Poison 10%, Burn 4%.
- **Stormcaller:** swings 42%, Chain lightning 31% (×3.0), Thunderstorm 15%, Shock 13%.
- **Bramble knight:** Poison (Briar) 32%, Bramble lash 24% (×3.7), swings 22%, Thorns 21%.
- **Knight:** swings 69%, Shield bash 31% (×4.5). **Paladin:** swings 66%, Smite 34% (×7.8).
- **Monk, Valkyrie, Vampire, Geomancer, Assassin, Frostweaver:** swings 34% to 57%, one or two abilities at ×1.9 to ×5.5.

Statuses carry a class where it's built on them (Briar, Burn, Shock), and little elsewhere. A third of Poison and Burn applications still land on a foe that dies within 4 ticks.

## 4. Feel: the sixth AI playtest

A fresh agent played the whole road as a first-time player, through the command line, seeing only what a player sees: **all 20 nodes in 51 attempts, none stuck** (the fifth playtest, on the old pacing, took 34). Node 10 fell on the 8th and last allowed try; nodes 15 and 19 took 6 and 7.

On your four problems, in its words:

- **Fights play out over time:** regular fights ran 15 to 50 ticks, mostly basic attacks, each unit casting 0 to 2 abilities; "nothing wiped me in one go".
- **Statuses do real work:** Sunder stacked to 50 on the Ice Titan was node 10's answer; Burn at 30 to 40 stacks did 5,000 to 13,000 a fight; the Stormcaller's Shock 10,000 to 17,000 in long fights; Thorns' Poison 2,000 to 6,000; Chill set up WEAK hits; Rot stopped the Bone Priests' healing. Venom arrow's Poison was small (500 to 1,250).
- **The regular fights are the threat:** 18 of its 31 losses were in regular fights, and most boss losses were attrition (arriving with someone down).

What it found wrong:

1. **The campfire isn't a choice yet.** REST was always right: casters ended runs with 2,000 to 5,000 MP. The audit agrees: tanks run low (the Knight starts fights 3 to 5 with a third of its MP, the Hoplite with a fifth to a quarter) but casters hold 70% to 90%. And the game's default picked FOCUS with the tank at a tenth of its HP; fixed (it rests if anyone standing is below a third). **Proposal:** MP regen down by about a third, so casters run short too, and FOCUS is the pick for a caster-heavy party.
2. **Supports don't act in short fights.** First casts come at tick 10 to 15, so in a 15 to 25 tick fight the Cleric sometimes casts nothing. **Proposal:** the opening charge a third to nine tenths (it's a third to two thirds), so most units cast once in a short fight.
3. **Bosses are uneven.** The Fire Giants fold (their knob is at the floor; see C), while the Long Road's Reaper (+110) and the Tower Top's mid-run Storm Queen are the walls. The same boss can be very different nodes apart: the Reaper fell in 48 ticks at node 4 and took about 100,000 damage at node 15. **Proposal:** the boss pass in C, and a cap on how far a boss's knob can rise above its regular fights'.
4. **What doesn't show:** Bulwark's chips, Doom's countdown and blow, the Storm King's anger; "magic passes right through" a Ghost that Burn kills; Valhalla fired once in the whole playtest. Texts naming things the player can't see (Sunstaff's "Mercy", Heartwood staff's "Deep roots fork", the Long Road's "no rest") are fixed.
5. **The Knight and the Stormcaller felt mandatory** (in 17 of its 20 clearing parties, and 8 of the 9 nodes after the Stormcaller unlocked); the late classes appeared only where a trial forced them. The class pass in D.

Its favourite moment: the Ranger, benched since node 2, turned out to be the Tower Top's answer (its basic attacks ignore the Soldiers' Taunt) and finished the Storm King alone on 358 HP. The most frustrating: node 10, seven losses chasing the Bulwark the page and the glossary pointed at.

## 5. Method notes

- **Read the logs before tuning the numbers.** The audit (`src/campaign-audit.ts`) answered three of your four problems in one run, and one log of the Old Road showed the fourth's cause was the tuner, not the content. The per-class table is the eyeballing you asked for, done by the tool.
- **A rule from you changed a number's nature, not just its size:** Poison scaled from Attack for one round. Writing the rule into the design notes keeps it from coming back.
- **Every rule change costs a full re-tune** (about an hour on 4 cores with two knobs). Five this step.
