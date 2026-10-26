# Step 5c report: Bleed, slotted openings, hungry casters, a three-way campfire

You reacted to the 5b report with a list of changes. All of them are built and on this branch. The road is re-tuned on them over five passes, and two AI playtests played it. This report leads with what needs you. `intent.md` has your words, `design.md` the changes in full, `tuning.md` the 23 rounds.

**To play it:** `npm install`, then `npm run ui`. A journey in progress carries over (same road), but fights play differently. On a class's sheet each ability card now says when it's first ready in a fight. Tap two numbers to swap the order.

## 1. Decisions and open questions

### A. Armor: your formula, with k = 0.25, not 1

A physical hit now deals **hit² ÷ (hit + k × Armor)**. Every point of Armor helps against any hit, and nothing is ever blanked. **I set k to 0.25.** On this scale Armor 5 is 5,000 and a minion's swing 700, so the two are the same size, and k = 1 makes Armor about four times what it was:

| A plated, Guarded Knight (Armor 8,000) takes | from a minion's swing (700) | from Crush (6,000) |
| --- | --- | --- |
| k = 1 | 8% | 43% |
| **k = 0.25** | **26%** | **75%** |
| the old flat cut and its floor | 25% | 84% |

At the same knobs, the same builds win 93% at k = 1, 79% at k = 0.25 and 80% under the old rule. At k = 1 the walls shrug off minions, who only swing. The Tower Top falls to 42%: its foes hit with magic, which Armor never meets, while the party's blows into the Soldiers' plate shrink. k = 0.25 keeps the old balance and gives Armor the shape you asked for. **Confirm, or say if you want k = 1 tried with a full re-tune.**

### B. The opening: slotted, but 20, 12 and 6 ticks, not 25, 15 and 10

Abilities now start a fight charged by the order they're slotted in, with no dice. **Your 25 brought back your own 5b complaint.** Every short ability in a first slot (cooldowns 20 to 28) fired on the first tick, the whole party together, and 19% of minions died before acting (5b had it down to 6%). At 20, 12 and 6 it's 12%. That's still above 5b: it's the price of a fixed opening (the old roll gave 5%).

- **Basic attacks and foes still roll** their first moment, a few ticks, so two swords don't swing in lockstep all fight. Neither is your preparation. **Say if you want them fixed too.**
- **Party cooldowns are 24, 32 and 42** (were 30, 48 and 70; foes unchanged). At the old lengths the Paladin, Hexer and Assassin sat out half or more of their regular fights. Your rule ("those cooldowns are too long") applied.
- **A thing to know:** the head start is in ticks, as you asked, so a short ability in the second slot can still come before a long one in the first. A playtester put Fireball first and saw Firebolt fire first. The ability card's "FIRST nT" shows it.

### C. Mana: priced by Magic

**A class's abilities cost their word's MP times a factor by its Magic:**

| Magic | Classes | Factor |
| --- | --- | --- |
| 1 | Knight, Hoplite, Ranger, Monk, Assassin | a quarter |
| 2 | Bramble knight, Vampire | half |
| 3 | Valkyrie, Bard | the word |
| 4 and 5 | Cleric, Paladin, Hexer, Frostweaver, Stormcaller, Geomancer, Pyromancer | double |

No ability costs more than 40% of its class's MP pool. At double, the first playtester's Paladin could afford one spell a fight, and its Cleric never cast Raise (3,200 of 5,000). MP regen is unchanged. This is a new rule, so it's yours to accept.

| | 5b | now |
| --- | --- | --- |
| Time with an ability ready and no MP for it, over a run: Knight, Hoplite, Bramble knight, Vampire | 23% to 32% | 0% to 2% |
| The same: Geomancer, Cleric, Frostweaver, Stormcaller, Pyromancer | 0% | 12% to 37% |
| Casters with MP gear in their best builds | 0% to 8% | 26% to 100% (the Pyromancer 11%) |

Your Cleric guess holds: it spends a quarter of its time waiting on MP, and what it adds to a build's wins fell from +17 points to +5. **The sharp end:** casters reach the boss short. In boss fights the walls and fighters cast each ability one to three times, the Pyromancer, Frostweaver, Stormcaller and Paladin about once or twice in all. That's the gate you asked for, and FOCUS buys it back.

**Your other idea, regen zero for every class with gear the only source:** at these prices the same builds win 21% against 79%. Every class lives on its regen, the walls too, so it needs costs cut about fourfold and turns the pool into the run's whole budget. I don't recommend it.

### D. The campfire: REST is the usual pick, RAISE when someone's down, FOCUS in parties with casters

REST gives 40% of max HP, **FOCUS 60% of max MP** (40% was too little to matter), and RAISE stands one fallen member of your choice up with 40% of its HP. A new tool copies every run at the fire and plays each option out on the same dice:

- **The choice decides the run in 31% of visits.** REST is the only winning pick in 299, FOCUS in 50, RAISE in 45.
- **With someone down,** RAISE wins 51% of runs, REST 39%.
- **By casters in the party** (Magic 4 or more), the only winning pick in decided visits:

| Casters | REST | FOCUS | RAISE |
| --- | --- | --- | --- |
| none | 113 | 1 | 10 |
| one | 127 | 32 | 22 |
| two | 49 | 17 | 13 |

- **Which picker wins most:** a picker that takes FOCUS when the party is shorter of MP than of HP wins 363 of the 412 decided visits. "REST, or RAISE if someone's down" (what the first playtester settled on) wins 346.

So all three earn runs, FOCUS only for parties with casters. **My proposal:** keep these numbers. Pushing MP harder would make FOCUS matter more but weaken the casters further, and they're already the weakest classes (E).

### E. Classes: the shape is 5b's, and the Knight isn't playtester bias

Share of each node's top builds while owned (a fair share is about 20% to 35%):

| | Classes |
| --- | --- |
| 69% to 73% | Vampire (Blood Moon requires it), Knight |
| 26% to 42% | Valkyrie, Paladin, Cleric, Stormcaller, Monk, Hoplite, Bramble knight |
| 17% to 21% | Assassin, Bard, Ranger, Geomancer |
| 9% to 13% | Pyromancer, Frostweaver, Hexer |

- **On your Knight question:** the simulations have no starter habit, and the Knight still adds 17 points to a build's wins on average, as in 5b and the most of any class you start with. It's strong in its own right: cheap MP now, a Stun every 32 ticks, and Armor that counts.
- **Your Valkyrie guess:** RAISE at the campfire didn't move it (42%, was 39%).
- **The Stormcaller** overshot to 57% when I also raised Shock to 80 a stack. With Shock back at 60 (cap 40) it's 33%.
- **The bottom three** are the casters: fragile (2 HP, the Pyromancer with Aggro 3), MP-hungry, and knocked out twice as often as the walls (the Pyromancer 20 times in 100 fights, the Knight 10). Price isn't their main trouble: easing the Pyromancer from 2.5 times to double gained its builds 4 points.

**My proposal:** a class pass next, on the casters' survival and the Knight.

### F. Readings and choices to confirm

- **Bleed:** 120 a stack each time its holder is hit, then a third of the stacks close. That puts it level with Burn and Shock in their classes: 27% of the Bramble knight's damage, 17% of the Assassin's, 12% of the Ranger's. **One engine change:** a hit's statuses now land after its hit events, so the hit that applies Bleed doesn't set it off. Without it, the applying hit would cash a third of every application at once.
- **The Bramble knight:** I read "the amount of attacks… should scale through Armor" as **Briar's Bleed stacks** (from Armor), in parallel with the Ranger's sentence. Bramble lash still scales from Thorns. Say if you meant the lash.
- **The Assassin's Lacerate:** stacks from Attack (Crit chance already decides how often it fires).
- **Burn, Shock and Thunder chord:**
  - The Pyromancer's Burn stacks are 2.5 times the word's, the Stormcaller's Shock stacks double, and Shock's cap rose from 25 to 40 (it held the doubled stacks back).
  - Thunder chord adds many Shock, not several: at several the first playtester saw it peak at 10 stacks.
  - Burn is 25% of the Pyromancer's damage (was 14%), Shock 22% of the Stormcaller's (was 13%), and Thunder chord's Shock 45% of the Bard's.
  - Smite's new Burn is small: the Paladin casts Smite about once every two regular fights.

## 2. What was built

- **Engine 0.11:** `ruleset.armorK` (the PoE formula), `ruleset.opening.slots` (head starts by slot), a campfire RAISE option (one per fallen member), a "crit" tag on hit events, and a hit's statuses landing after its events. Each has a test.
- **Content:**
  - Bleed, in place of Poison, on the Ranger's **Barbed arrow** (a light hit at a random foe, several Bleed from Attack), the Bramble knight's **Briar** (a few, from Armor), the Assassin's **Lacerate** (crits add several, from Attack) and the snakes.
  - **Thunder chord** (many Shock on every foe, from Magic) for Lullaby.
  - **Smite** adds several Burn, on a medium cooldown.
  - Costs by Magic, capped at 40% of the pool; cooldowns 24/32/42; the campfire's three options.
- **The bug:** designer view worked out every amount and printed a bare number, so Bramble lash didn't say it scales from Thorns (nor any ability its stat). Every worked-out amount now names what it grows with ("≈ 1,800, from Thorns").
- **Interface:** a RAISE button per fallen member at the campfire, Bleed's red drop icon and its messages ("bleeds for 252"), each ability's first tick on its card.
- **Tools:**
  - The audit's MP and casting sections.
  - `src/campaign-campfire.ts`: plays every option out, with `--harder N`, and scores pickers.
  - `src/campaign-shares.ts`: class shares of the top builds.
  - The playtest command line now shows stats, MP costs and cooldowns.
  - A full re-tune now takes about ten minutes (it was an hour).

## 3. The numbers, 5b against now

All 20 nodes, each node's best builds, 6 to 8 seeds, at each version's own knobs.

| | 5b (pass 14) | Now (pass 19) |
| --- | --- | --- |
| Basic attacks, share of party actions | 66% | 57% |
| Party damage from basics, abilities, statuses (regular fights) | 57%, 38%, 4% | 44%, 48%, 8% |
| Statuses' share in boss fights | 6% | 12% |
| Abilities cast straight after another by the same unit | 22% | 17% |
| Party actions sharing a tick | 0% | 0% |
| Minions killed before acting | 6% | 12% |
| A first-slot ability's first cast (median tick, by class) | 14 to 33 | 1 to 20 |
| Regular fights with no cast: Paladin, Hexer, Assassin, Bard | 59%, 19%, 33%, 13% | 33%, 14%, 21%, 17% |
| Losses in regular fights against boss fights | 129 against 133 | 122 against 169 |
| The party's MP share when it loses | 57% | 75% |

**How sure:** class shares and knobs move a few points between passes (6 seeds a build to screen, the best on 48 fresh ones). The campfire counts come from about 1,300 visits each. Every row's direction held across the last three passes.

## 4. Feel: two AI playtests

*(Filled in below.)*

Three fights, retold:

- **Briar at work (the Long Road, hound pack).** Thicket taunts and Guards the Bramble knight. Every hound that bites it takes its Thorns and starts to bleed: 2 stacks, 3.5 under Guard, more with every bite. Then the Monk's double strikes and the Valkyrie's spear open the wounds. One hound takes 672 from a single blow; another, at 9 stacks, takes 1,092, 727 and 485 from three blows in a row as the stacks close: 2,300, most of what it had left. Bleed and Thorns together are about half the Bramble knight's damage across the road.
- **A Stormcaller running dry (the Wild Hunt).** Chain lightning and Thunderstorm clear the wolves, and the Stormcaller has 1,500 of its 3,000 MP left after one fight and 450 after two. The campfire's FOCUS refills it for the hounds. It's dry again by the Huntmaster, where the Cleric's Raise brings the Knight back from Crush.
- **The opening, by slot.** In a regular fight (about 42 ticks) the first-slot short abilities (Barbed arrow, Flow, Gale spear, Blood drain, Firebolt) come at ticks 3 to 8, staggered by their cooldowns and the head starts. Second slots come around ticks 11 to 26, third slots 15 to 44 (a long third ability often not at all). In a boss fight (about 72 ticks) the walls and fighters cast each slot one to three times.

## 5. Method notes

- **A tool that plays every choice out answered "are they all useful" directly.** The campfire oracle replaced arguing about percentages with counts of runs each option alone wins. It showed that FOCUS's value depends on the party, which a single average hid, and it scored the playtester's rule of thumb against the simulations' picker.
- **Your numbers were "made up", and two of them (k = 1, a 25-tick head start) broke something you'd asked for before.** Pricing each against the version I shipped, at fixed knobs, made the case in one table each. That's the method's "price the direction", done per number.
- **The playtest found what the averages hid.** A Paladin that could afford one spell a fight, and a Raise that never fired: both read as "casts a little less" in the audit. Cheap re-tunes (ten minutes) let a playtest's findings go into the same step.
