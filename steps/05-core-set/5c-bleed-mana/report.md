# Step 5c report: Bleed, slotted openings, hungry casters, a three-way campfire

You reacted to the 5b report with a list of changes. All of them are built, the road is re-tuned on them (four passes), and it's on this branch. This report leads with what needs you. `intent.md` has your words, `design.md` the changes in full, `tuning.md` the 19 rounds.

**To play it:** `npm install`, then `npm run ui`. A journey in progress carries over (same road), but fights play differently. On a class's sheet each ability card now says when it's first ready in a fight. Tap two numbers to swap the order.

## 1. Decisions and open questions

### A. Armor: your formula, with k = 0.25, not 1

A physical hit now deals **hit² ÷ (hit + k × Armor)**. Every point of Armor helps against any hit, and nothing is ever blanked. **I set k to 0.25.** On this scale Armor 5 is 5,000 and a minion's swing 700, so the two are the same size, and k = 1 makes Armor about four times what it was:

| A plated, Guarded Knight (Armor 8,000) takes | from a minion's swing (700) | from Crush (6,000) |
| --- | --- | --- |
| k = 1 | 8% | 43% |
| **k = 0.25** | **26%** | **75%** |
| the old flat cut and its floor | 25% | 84% |

At k = 1 the same builds win 93% against 79% at k = 0.25 (80% under the old rule), because the walls shrug off minions, who only swing. And the Tower Top drops to 42%: its foes hit with magic, which Armor never meets, while the party's blows into the Soldiers' plate shrink. k = 0.25 keeps the old balance and gives Armor the shape you asked for. **Confirm, or say if you want k = 1 tried with a full re-tune.**

### B. The opening: slotted, but 20, 12 and 6 ticks, not 25, 15 and 10

Abilities now start a fight charged by the order they're slotted in, with no dice. **Your 25 brought back your own 5b complaint.** Every short ability in a first slot (cooldowns 20 to 28) fired on the first tick, the whole party together, and 19% of minions died before acting (5b had it down to 6%). At 20, 12 and 6 it's 11%. That's still above 5b: it's the price of a fixed opening (the old roll gave 5%).

- **Basic attacks and foes still roll** their first moment, a few ticks, so two swords don't swing in lockstep all fight. Neither is your preparation. **Say if you want them fixed too.**
- **Party cooldowns are 24, 32 and 42** (were 30, 48 and 70; foes unchanged). At the old lengths the Paladin, Hexer and Assassin sat out half or more of their regular fights. Your rule ("those cooldowns are too long") applied.
- **Ability order now matters:** the simulations try two orders per build (the documents' order, and shortest cooldown first) and the climb swaps them.

### C. Mana: priced by Magic

**A class's abilities cost their word's MP times a factor by its Magic:** a quarter at Magic 1 (Knight, Hoplite, Ranger, Monk, Assassin), half at 2 (Bramble knight, Vampire), the word at 3 (Valkyrie, Bard), double at 4 (Cleric, Paladin, Hexer, Frostweaver, Stormcaller, Geomancer), two and a half times at 5 (Pyromancer). MP regen is unchanged. This is a new rule, so it's yours to accept.

| Time with an ability ready and no MP for it, over a run | 5b | now |
| --- | --- | --- |
| Knight, Hoplite, Bramble knight, Vampire | 23% to 32% | 0% to 2% |
| Cleric, Geomancer, Pyromancer | 0% | 27% to 45% |
| Paladin, Frostweaver, Stormcaller | 0% to 4% | 14% to 20% |
| Casters with MP gear in their best builds | 0% to 8% | 30% to 100% (the Pyromancer still none) |

Your Cleric guess holds: it now spends a third of its time waiting on MP. What it adds to a build's wins fell from +17 points to +5. **The sharp end:** the casters reach the boss short of MP. In boss fights the walls and fighters cast each of their abilities one to three times, but the Pyromancer casts about once in all (0.9, 0, 0 by slot), the Stormcaller about twice, and the Frostweaver and Paladin about once or twice. That's the gate you asked for, and it's what FOCUS buys back. But the Pyromancer pays most: it takes HP gear over MP gear because it's fragile, and arrives dry.

**Your other idea, regen zero for every class with gear the only source:** at these prices the same builds win 21%, against 79%. Every class lives on its regen, the walls too, so it needs costs cut about fourfold and turns the pool into the run's whole budget. I don't recommend it.

### D. The campfire: RAISE earns its place, FOCUS does in parties with casters

REST gives 40% of max HP, **FOCUS 60% of max MP** (40% was too little to matter), RAISE stands one fallen member of your choice up with 40% of its HP. A new tool copies every run at the fire and plays each option out on the same dice:

- **The choice decides the run in 31% of visits.** REST is the only winning pick in 287, FOCUS in 49, RAISE in 44.
- **With someone down,** RAISE wins 57% of runs and REST 43%.
- **By casters in the party** (Magic 4 or more), the only winning pick in decided visits: with none, REST 111, FOCUS 0. With one, 137 / 31 / 24 (REST / FOCUS / RAISE). With two, 36 / 17 / 12.

So FOCUS is the pick for a caster party about a fifth of the time, and never for walls. That's the shape I'd want. It isn't more often because the best builds lean on walls, so REST stays the usual answer. Pushing MP harder would make FOCUS matter more but weaken the casters further, and they're already the weakest classes (E). **My proposal:** keep these numbers, and let a caster pass decide how hungry casters can afford to be.

### E. Classes: the shape is 5b's, and the Knight isn't playtester bias

Share of each node's top builds while owned (a fair share is about 20% to 35%):

| | Classes |
| --- | --- |
| 67% to 78% | Vampire (Blood Moon requires it), Knight |
| 29% to 41% | Valkyrie, Paladin, Monk, Cleric, Stormcaller, Hoplite, Bramble knight |
| 16% to 22% | Bard, Assassin, Ranger, Geomancer |
| 9% to 11% | Pyromancer, Frostweaver, Hexer |

**On your Knight question:** the simulations have no starter habit, and still the Knight adds 18 points to a build's wins on average (5b: 17), the most of any class. It's strong in its own right: cheap MP now, a Stun every 32 ticks, and Armor that matters. **Your Valkyrie guess:** RAISE at the campfire didn't move it (41%; 5b 39%).

The Stormcaller overshot to 57% when I also raised Shock to 80 a stack. With Shock back at 60 (cap 40) it's 31%. The bottom three are the Magic-4 and Magic-5 casters, fragile (2 HP, the Pyromancer with Aggro 3) and now MP-hungry, so they reach the boss dry (C). **My proposal:** a class pass next, on the casters' survival and the Knight. Easing the Pyromancer to double costs (as Magic 4) is a one-line test I'd fold into it.

### F. Readings and choices to confirm

- **Bleed:** 120 a stack each time its holder is hit, then a third of the stacks close. That puts it level with Burn and Shock in their classes: 29% of the Bramble knight's damage, 17% of the Assassin's, 11% of the Ranger's. **One engine change:** a hit's statuses now land after its hit events, so the hit that applies Bleed doesn't set it off. Without it, the applying hit would cash a third of every application at once, as a delayed rider.
- **The Bramble knight:** I read "the amount of attacks… should scale through Armor" as **Briar's Bleed stacks** (from Armor), in parallel with the Ranger's sentence. Bramble lash still scales from Thorns. Say if you meant the lash.
- **The Assassin's Lacerate:** stacks from Attack (Crit chance already decides how often it fires).
- **Burn and Shock:** the Pyromancer's Burn stacks are 2.5 times the word's, the Stormcaller's Shock stacks double. Shock's cap rose from 25 to 40 (it held the doubled stacks back). Burn is 22% of the Pyromancer's damage (was 14%), Shock 21% of the Stormcaller's (was 13%), Thunder chord's Shock 33% of the Bard's.

## 2. What was built

- **Engine 0.11:** `ruleset.armorK` (the PoE formula), `ruleset.opening.slots` (head starts by slot), a campfire RAISE option (one per fallen member), a "crit" tag on hit events, and a hit's statuses landing after its events. Each has a test.
- **Content:** Bleed (in place of Poison) on the Ranger's **Barbed arrow** (a light hit at a random foe, several Bleed from Attack), the Bramble knight's **Briar** (a few, from Armor), the Assassin's **Lacerate** (crits add several, from Attack) and the snakes. **Thunder chord** (several Shock on every foe, from Magic) for Lullaby. **Smite** adds several Burn, on a medium cooldown. Costs by Magic, cooldowns 24/32/42, the campfire's three options.
- **The bug:** designer view worked out every amount and printed a bare number, so Bramble lash didn't say it scales from Thorns (nor any ability its stat). Every worked-out amount now names what it grows with ("≈ 1,800, from Thorns").
- **Interface:** a RAISE button per fallen member at the campfire, Bleed's red drop icon and its messages ("bleeds for 252"), each ability's first tick on its card.
- **Tools:** the audit's MP and casting section, `src/campaign-campfire.ts` (plays every option out, `--harder N`), `src/campaign-shares.ts`, and the playtest command line now shows stats, MP costs and cooldowns. A full re-tune now takes about ten minutes.

## 3. The numbers, 5b against now

All 20 nodes, each node's best builds, 6 to 8 seeds, at each version's own knobs.

| | 5b (pass 14) | Now (pass 18) |
| --- | --- | --- |
| Basic attacks, share of party actions | 66% | 57% |
| Party damage from basics, abilities, statuses (regular fights) | 57%, 38%, 4% | 44%, 47%, 8% |
| Statuses' share in boss fights | 6% | 12% |
| Abilities cast straight after another by the same unit | 22% | 16% |
| Party actions sharing a tick | 0% | 0% |
| Minions killed before acting | 6% | 11% |
| A first-slot ability's first cast (median tick, by class) | 14 to 33 | 3 to 17 |
| Regular fights with no cast: Paladin, Hexer, Assassin, Bard | 59%, 19%, 33%, 13% | 42%, 24%, 21%, 17% |
| Losses in regular fights against boss fights | 129 against 133 | 115 against 146 |
| The party's MP share when it loses | 57% | 74% |

**How sure:** class shares and knobs move a few points between passes (6 seeds a build to screen, the best on 48 fresh ones). The campfire counts come from about 1,300 visits each. The direction of every row above held across all four passes.

## 4. Feel

*(The sixth AI playtest's findings go here.)*

Three fights, retold:

- **Briar at work (the Long Road, hound pack).** Thicket taunts and Guards the Bramble knight. Every hound that bites it takes its Thorns and starts to bleed: 2 stacks, 3.5 under Guard, more with every bite. Then the Monk's double strikes and the Valkyrie's spear open the wounds. One hound takes 672 from a single blow; another, at 9 stacks, takes 1,092, 727 and 485 from three blows in a row as the stacks close: 2,300, most of what it had left. Bleed and Thorns together are half the Bramble knight's damage across the road.
- **A Stormcaller running dry (the Wild Hunt).** Chain lightning and Thunderstorm clear the wolves, and the Stormcaller has 1,500 of its 3,000 MP left after one fight and 450 after two. The campfire's FOCUS refills it for the hounds. It's dry again by the Huntmaster, where the Cleric's Raise brings the Knight back from Crush.
- **The opening, by slot.** In a regular fight (about 42 ticks) the first-slot short abilities (Barbed arrow, Flow, Gale spear, Blood drain, Firebolt) come at ticks 3 to 8, staggered by their cooldowns and the head starts. Second slots come around ticks 11 to 26, third slots 15 to 44 (a long third ability often not at all). In a boss fight (about 71 ticks) the walls and fighters cast each slot one to three times.

## 5. Method notes

- **A tool that plays every choice out answered "are they all useful" directly.** The campfire oracle replaced arguing about percentages with counts of runs each option alone wins, and showed FOCUS's usefulness depends on the party, which a single average hid.
- **Your numbers were "made up", and two of them (k = 1, a 25-tick head start) broke something you'd asked for before.** Pricing each against the version I shipped, at fixed knobs, made the case in one table each. That's the method's "price the direction", done per number.
- **Re-tunes got cheap** (about ten minutes, from an hour), which made four passes possible. The audit, the oracle and class shares after each pass are what decided the next change.
