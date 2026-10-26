# Step 5c report: armor, Bleed, ability order, mana, the campfire, Burn and Shock

You sent seven reactions to the 5b report. All of them are built, the whole road is re-tuned, and everything is on this branch. This report leads with what needs you. `design.md` has the changes in full, `intent.md` your words, and `tuning.md` the 25 rounds.

**To play it:** as before, `npm install` then `npm run ui`. Fights play differently now, and the road is the same, so a run in progress carries over.

## 1. Decisions and open questions

### A. The campfire: REVIVE and REST matter, FOCUS only where a party runs on MP (open)

You asked for three useful options, and for the mana pass to make FOCUS matter: "keep tuning it until it does." I measured it by playing every node's best builds to the campfire, then playing the rest of the run three ways on the same dice (REST, FOCUS, REVIVE) and counting which picks go on to win.

| At the campfire | Every pick wins | Only REST wins | Only FOCUS wins | Only REVIVE wins |
| --- | --- | --- | --- | --- |
| Everyone standing | 55% | 31% | 4% | – |
| Someone down | 32% | 1% | 1% | 14% |
| Everyone standing, party with a Cleric | 58% | 16% | 10% | – |
| Everyone standing, party with a Geomancer | 41% | 35% | 9% | – |

**REVIVE works.** With someone down, it's the pick that most often decides the run, and reviving by reflex loses only 2% of runs that another pick would have won. I set it at 35% of max HP, below Raise's 50%: at 50% it decided 20% of these campfires rather than 14%, but it would match the Cleric's own revive for free, and the classes that revive in a fight should keep an edge.

**FOCUS doesn't yet.** It matters in parties whose power runs through MP: a Cleric that stops healing when dry, or a Geomancer that stops shielding. Elsewhere HP decides runs. What I tried:

- **Bigger FOCUS:** at 70% or even 100%, against REST at 30%, it decided at most 8%.
- **The campfire before the boss:** 1%. The boss is decided by HP and revives.
- **Steeper costs:** they just make every run harder.
- **Staves that count Magic at half,** so a damage caster out of MP is weak, as you described ("not that useful without their spells"): FOCUS with a Pyromancer went from 6% to 9%, with a Frostweaver from 2% to 6%, and every build lost ground (wins at fixed knobs fell from 72% to 58%). The Pyromancer's staff swing was the biggest in the game, so a dry Pyromancer still hits hard.

**My read:** FOCUS will matter when casters matter. The strongest parties now are tank-heavy and run on HP, and the casters sit in the bottom half (F below). **The proposal:** fold it into the class pass. Make damage casters weaker without MP (smaller staff swings) and stronger with it (spells), then measure FOCUS again. The lever is in place (`STAFF_MAGIC`, now 1); it's yours whether staves should be weak.

### B. Armor: built as asked; how I read k = 1

A physical hit H deals H² ÷ (H + k × A), with k = 1. **A is the armor value:** 0.12 × the Armor stat, which is exactly what Armor took off every hit before (Armor 5 is 600).

| Armor 5 (A = 600), k = 1 | The hit gets through |
| --- | --- |
| A 3,000 blow | 2,500, about 600 less, as before |
| A 600 hit | half |
| A 300 hit | 100, never nothing |

Read on the raw stat instead (Armor 5 is 5,000 in the data), k = 1 would take 83% off a 1,000 hit; on the number the sheet shows (5), it would do nothing. **Priced:** at k = 2, after a re-tune, the Knight's share of the top builds rises from 59% to 63% and the casters' falls. So k = 1 stays.

**A bug fixed on the way:** a stat's floor only held on stats that also had a cap, so Sunder took Armor below zero. Under the old flat rule, each physical hit then gained what the Armor was below zero: 50 Sunder on the Ice Titan added about 2,900 to every hit. That was the 5b playtester's answer to node 10, and it wasn't the rule ("every other stat floors at zero"). Under the curve it made one Shield bash hit for 22 million. Armor now stops at zero. That makes Sunder weaker than it played in 5b: it only takes away the Armor a foe has.

### C. Bleed: built; X = 120, Y = 0.25

- **What it does:** each hit its holder takes deals **120 a stack**, untyped, then **a quarter of the stacks go**. A stack is worth up to 480 and is spent over three to five hits. Bleed has no timer, isn't a hit, and ignores Armor and resistance.
- **The Ranger: Barbed arrow,** a light hit at a random foe, adding several Bleed from Attack. **The Bramble knight: Briar,** each foe that hits it gets several Bleed, from Armor. **The Assassin: Lacerate,** each crit adds several Bleed, from Attack. **Snakes:** one stack a bite.
- **What the grid showed:** at 60 a stack and a fifth gone a hit, an arrow's Bleed was worth half the arrow's own hit. At 120 and a quarter it's worth the hit (each about 1.8 of the Ranger's swings). Bleed is then 11% of the Ranger's damage, 40% of the Bramble knight's (your whittling tank) and 24% of the Assassin's.
- **One call of mine:** a hit that applies Bleed doesn't set off the stacks it adds; the next hit does. Otherwise every arrow would cash a quarter of its own Bleed at once, and Bleed would be part of the arrow rather than a reward for the hits that follow.
- **The Bramble lash bug** was the display. Its damage did scale from Thorns, but the designer view printed the number alone, for every ability. It now names the scaling: "≈ 18 (6 × Thorns)".
- **The Assassin's Vanish** now only hides it; it no longer makes its hits crit.

### D. Ability order sets the opening; cooldowns had to come down

- **The opening:** the first ability slotted starts a fight with 25 ticks of its cooldown done, the second 15, the third 10, your numbers. A basic attack starts half charged, a tick later for each party slot so two swords don't swing together. Enemies follow the same rule by their list order. There are no dice: the same build opens the same way every time.
- **Your guess was right: cooldowns 30, 48 and 70 were too long.** A long ability slotted third came up at tick 60, after most regular fights had ended, and the Paladin cast nothing in 99% of them.
- **At 30, 38 and 46:** any ability in any slot comes up once in a regular fight of 30 ticks or more. In regular fights of 25 ticks or more, every class casts in at least 9 of 10 fights except the Paladin (30% without a cast; its wind-ups are 4 and 8 ticks) and the Bard (32%; it's knocked out the most). The short fights, where nobody casts a second ability, are content: Knives Out's archers and drones, Judgement's liches, the Storm Tower's wisps die in 7 to 15 ticks.
- **Bosses:** their signature moves now use the long word (46), keeping 5b's "about every 48 ticks".
- **Basic attacks** are 61% of party actions (66% in 5b), and abilities cast straight after another by the same unit 17% (22%).

### E. Mana: costs by class MP did what regen couldn't

**An ability costs its price × (its class's MP − 1) ÷ 2.** A class with MP 5 (Cleric, Pyromancer) pays four times what a class with MP 2 (Knight, Bramble knight, Hoplite, Monk, Vampire) pays. MP regen is down by two fifths (0.05 to 0.03 a point). Your guess, low or zero regen across the board, does the opposite of what you want on its own: the tanks have the smallest pools, so they run dry first (at a two-fifths cut, the Vampire was dry in 59% of runs, the Hoplite 38%, the Knight 32%). Pricing spells by the class's MP is what turns it around.

| | MP at the boss, 5b → now | Runs in which it ran dry, 5b → now |
| --- | --- | --- |
| Cleric | 87% → 35% | 0% → 31% |
| Geomancer | 78% → 40% | 0% → 38% |
| Pyromancer, Frostweaver, Bard | 77–96% → 43–47% | 0% → 9–15% |
| Knight, Hoplite | 26–30% → 60–64% | 50% → 0–8% |
| Monk, Bramble knight | 30–35% → 66–73% | 32% → 0–9% |
| Vampire | 24% → 37% | 44% → 31% |

**Cure is no longer "costly":** with the doubled price on top, the Cleric fell from 49% of the top builds to 18%. At the normal price it's at 26%. **Open:** the Stormcaller has MP 3, so it pays the old price and doesn't run short (70% at the boss). The documents' stat line decides that; a lower MP regen for it, or MP 4, would make it hungry.

### F. Class balance after the pass (the class pass is next)

Shares of the top builds at the nodes where each class is owned (a fair share is about 30%):

| | 5b | Now |
| --- | --- | --- |
| Vampire, Knight | 70%, 59% | 63%, 59% |
| Stormcaller | 23% | 51% |
| Paladin, Monk, Valkyrie, Hoplite | 33–40% | 29–43% |
| Cleric | 49% | 26% |
| Bramble knight, Bard, Ranger | 13–24% | 24–25% |
| Assassin, Pyromancer, Geomancer, Frostweaver | 9–19% | 15–20% |
| Hexer | 9% | 8% |

The Stormcaller's jump came with the extra Shock stacks and the shorter cooldowns. It was already at 51% before Shock went from 60 to 90 a stack, and it's the only caster that doesn't pay the higher price. The Knight is still top, after Armor lost its floor: it pays the lowest price for its abilities, and its armor still counts against the many small hits. The Hexer has no damage spells and pays the higher price. **Proposal:** a class pass next, now that the rules hold still. It should look at the Knight, the Vampire and the Stormcaller at the top, the Hexer and the damage casters at the bottom, and FOCUS with them (A).

### G. Changes beyond your direction (confirm or revert)

- **Cooldowns 30, 38 and 46** (were 30, 48 and 70), so casters cast (D).
- **Burn 40 a stack a pulse (was 30), Shock 90 (was 60).** More stacks from the Pyromancer and Stormcaller alone barely moved them: the Stormcaller's own swings already fill Shock's cap of 25. A cap of 40 added a fifth of what 90 did. Statuses are now 9% of the party's damage in regular fights and 14% against bosses (4% and 6% in 5b). Burn is 23% of the Pyromancer's damage, Shock 19% of the Stormcaller's, 27% of the Bard's (Thunder chord) and 14% of the Valkyrie's.
- **Thunder chord** (the Bard, in Lullaby's place): several Shock on every foe from Magic, with no hit, on a medium cooldown. **Smite:** several Burn from Magic, on a medium cooldown (was long).
- **FOCUS gives 50% of max MP** (was 40); **REVIVE 35% of max HP.**
- **Cure at the normal price** (E).
- **The tuner keeps every boss at half its HP or more.** When the regular fights' wear leaves less room than that, it eases the regular fights instead. Without it, nine bosses went to −60 or below; the Ogre Chief, at −88, died in 14 ticks. **The cost:** the regular fights bite less than in 5b. A regular fight takes 44% of the party's max HP (54% in 5b), and a third of losses come in regular fights (half in 5b). Minions killed before they act rose from 6% to 14%, as the first-slotted abilities now come up in the first few ticks. If you'd rather keep the regular fights' bite, the other lever is the 95% the tuner asks of the best builds on the regular fights alone.
- **The simulations try ability orders:** the documents' order and the longest cooldown first, plus reorders in the climb.
- **Engine 0.11:** Armor on a curve (`ruleset.armorK`), the opening by slot, a hit's own statuses after its hit events, a crit filter on hit events, the campfire's REVIVE, and the stat floor fix.

## 2. Before and after

All 20 nodes, each node's best builds, 6 to 8 seeds, at each pass's knobs: 5b's final state (pass 14) against now (pass E).

| | 5b | Now |
| --- | --- | --- |
| Party actions that are basic attacks (regular, boss) | 66%, 69% | 61%, 64% |
| Party actions for each foe action, per unit (regular, boss) | 1.4, 1.2 | 1.5, 1.1 |
| Party damage, regular fights: basic attacks, abilities, statuses | 57%, 38%, 4% | 46%, 44%, 9% |
| Party damage, boss fights | 61%, 31%, 6% | 46%, 39%, 14% |
| A status application's damage: Poison / Bleed, Burn, Shock | 760, 1,009, 513 | 1,375, 1,683, 905 |
| Abilities cast straight after another by the same unit | 22% | 17% |
| A regular fight's length, a boss fight's | 43, 65 ticks | 31, 56 ticks |
| Losses in regular fights against boss fights | 49% against 51% | 33% against 67% |
| Bosses eased by half or more (of 20) | 7 | 4, none below −50 |

How sure: the shares hold across the 6 to 8 seeds and up to 9 builds a node. The campfire counts rest on 1,342 campfires; the "party with a Cleric" rows on about 335.

## 3. Feel: the seventh AI playtest

A fresh agent played the road as a first-time player, through the command line, seeing only what a player sees.

- **How far:** it cleared 17 of 20 nodes in its allowed 60 plays. The 5b playtest cleared all 20 in 51.
- **Walls:** the Long Road (node 15) beat it 8 times, always at the Ghoul Pit with the tank worn down by wisps. The Tower Top (node 19) did too: the Storm Queen's Tempest killed its Cleric from full HP on every run (3,586 against 3,000 HP), and the bestiary's "Lightning on every foe, with a stack of Shock" reads as mild. Judgement fell on the last allowed try. The Tempest spike belongs to the boss pass 5b proposed.

On your points, in its words where they help:

- **Bleed was readable from the totals:** the Ranger's Barbed arrow and Taunt-ignoring arrows won node 13 (12,055 Bleed on the Queen), and the Bramble knight did 11,800 to 18,700 Bleed on whatever kept hitting it, but almost nothing on wisps, which die first. The Assassin's crits did 10,400 to 15,600. It never noticed the snakes' Bleed on its own party, and the glossary doesn't say how big a stack is.
- **Ability order:** "I used it every node, and it changed outcomes." Shield bash first gave "Ogre Chief is stunned: Crush has to wait" in the run that cleared node 9. Sanctuary first held a Lich's damage on the Paladin to 2,286, against 5,368 with Smite first. "In short fights, the order decides which abilities happen at all."
- **The campfire:** "REST against FOCUS is a real choice." On node 15, REST left the Pyromancer below Fireball's cost, and FOCUS left the tank too low for the Ghoul Pit. REVIVE "felt great when it fired, but a member back at 35% often died straight away." Its biggest frustration was the tool: it had to choose before the run, so a fixed REST was wasted with someone down, and a revive with nobody down fell back to the simulations' pick. The interface asks in the moment, so this is the command line's limit; it now takes a list in order of preference ("revive:cleric,rest").
- **Mana mattered, and it picked gear for it:** Prayer beads on the Knight cleared node 9 after six losses (node 9's leeches drain MP), and Vestments with beads on the Frostweaver cleared node 8. It saw the Cleric end long boss fights on 40 to 260 MP, and the Assassin's Garrote stop firing.
- **Burn:** "the strongest thing in the game": 19,700 on the Reaper at 66 stacks, 36,700 on the Silent One at 84. The Bard's War ballad with the Pyromancer was its favourite moment ("something I built"). The Pyromancer is still in only a fifth of the top builds, so Burn is strong in long boss fights rather than everywhere; worth watching in the class pass.
- **Shock** was strong against Hasted foes (15,400 to 19,900 on Hasted ghouls), and modest from the Valkyrie.
- **Other notes:** Garrote silenced a Drone instead of the Queen (it picks a random foe that isn't Taunting, as the documents say), and wisps did 5,000 to 9,000 to the tank in a fight.

## 4. Method notes

- **Re-tuning is cheap now.** A full re-tune takes about four minutes here (an hour in 5b's sessions), so every rule change was re-tuned rather than read at stale knobs. Stale knobs misled twice early on: Knives Out's 7-tick fights read as "the Assassin never casts".
- **Ask what decides a choice, not how often it wins.** Branching a run at the campfire on the same dice answered "does FOCUS matter" directly, and showed the answer depends on the party, which a win rate hides.
- **An outsized number is worth chasing.** A 22-million Shield bash led to the stat floor bug, which had been quietly shaping Sunder since the core set's build.
