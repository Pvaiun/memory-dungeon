# Step 5e design: the balance sheet

The director set the method for this step themselves (`intent.md`): a sheet first, then fixes from the top of its list, upstream first, with the knobs frozen; then difficulty; then fresh eyes; then the report. This file says how the sheet is built and what its bands are for. The bands themselves, with their reasons, are in `src/balance.ts` (`BANDS`) and printed at the end of every sheet.

## What the sheet plays

Three sets, always on the same seeds:

- **The campaign:** every node's run at the knobs in `content/core-set/campaign-knobs.json`, as the pack holds them. MP, HP and knockouts carry between fights, so this is where MP binds and attrition shows.
- **Free play:** the seven runs of the enemies document at the documents' numbers, with no knob. This is where the enemies are judged: a knob at −88 or +148 makes any foe die early or live long, so the enemy bands are read here.
- **The rogue:** every fight in every region's pools at its calibrated knob (`rogue-knobs.json`, heat 0, its pool's reference floor), with the tier's shape. Single fights with full parties, so no attrition; this is where the rogue's own gear is measured.

## Who plays

A spread, not the best builds: 80 trios picked so every class appears in about the same number of parties (15 each), each trio twice: once wearing a rotation that brings every piece its classes can wear round in turn (an empty armor or amulet slot too), once in the campaign tuning's sensible kit (`src/sim/kits.ts`), in all ten formations round robin, with the abilities in the documents' order or the shortest cooldown first. In the rogue set the rotation also wears the rogue mode's own legendary pieces. So what nobody picks is still measured, and a class's or formation's number is its own rather than its company's.

Two probes answer what the spread can't, because party composition drowns a single piece: every piece of gear alone on a bare unit of every class that can wear it (its plain weapon, no armor, no amulet), beside the same four kitted companions in Neutral, on the same 41 fights (the campaign, free play, the rogue bosses); and the same forty kitted parties in every formation. A piece's number is its wearers' win rate against the mean of every piece they could have worn in that slot, and against the bare unit; a formation's is against Neutral on the same parties.

## What it reads

Every line comes from the logs, with one log-only change to the engine: each damage entry carries `raw`, the amount before Armor or resistance, so mitigation can be measured (no outcome changes; the pinned log fingerprint moved). The sheet has a line for every class, ability (the party's and the foes'), status, enemy, piece of gear and formation; a table of the resources (HP, MP, shields, the campfire, knockouts by what did them); a measure for every stat a unit carries (what Armor took off, what resistances took off, crits, dodges, extra strikes, Thorns, Lifesteal, Siphon, Haste and Slow uptime, Aggro as hits drawn); and a count of every kind of log event per fight.

## Bands

Each band has a reason, from the documents (what a thing is for: a wall is hit, a dealer deals, a boss casts its move two or three times, an ordinary piece is a sidegrade) or from the one principle the director set: every option is a real choice, so nothing is useless, dominated or required, and nothing wins on its own. A band says on which set it's read where that matters (MP on the campaign's runs, enemies in free play, gear and formations on their probes). A flag's severity is how far outside the band it falls, in band widths; the flags are ranked by it.

## What it doesn't do

It doesn't judge difficulty: win rates are context. It doesn't read feel. It can't see a buff's worth directly (Haste, Might, Guard, Ward have no damage line), only through the class's marginal win rate and the status's uptime. And a pass of the sheet is one sample: about ±2 points on a class's marginal win rate, ±3 on a probed piece's.
