# Step 5i, step 5: the build, report

Oct 30, 2026. Everything you designed is in the game, measured, and on `ccr-5dc41450-i30lpg`. That's 240 pieces, 32 formations, 64 upgrades (each a power step and two versions), 16 mythics and the engine they need. No balancing was done: one correction was made, and it didn't fix the item it was for. The fixes I'd propose are below, for the balance pass.

**To play it:** `npm install`, `npm run ui`, Settings → MODE → ROGUE. A saved run from before is set aside on load.

## What needs you

1. **Play it.** That's the gate.
2. **Cold Snap stands far above the rest.** At its top rung, on act III's fights, it wins 97% of fights. The other eleven win 35% to 73%. Its act III fights last 20 ticks; most builds take 40 to 60.
   - What carries it: Rime knuckles, Winter's chain, the Snowbound folio, Cold hex's power step and version B, and Glacier's heart.
   - The cause: chain shatters across packs. Shatter damage is 34% of the build's damage.
   - Proposed fix, for the balance pass: Winter's chain gives a single Chill to each other foe, not "a few"; then re-measure.
3. **For half the builds, the top rung isn't stronger.** On the same fights (act II), Lockdown wins 94% at rung 1, 76% at rung 2 and 74% at rung 3. Phoenix, Harvest, Thousand Cuts and the Hunt are flat or fall too. Landslide (74%, 77%, 98%) and the Toll rise.
   - Likely cause, not measured: rarity is specificity, not size. A common carries two stat steps; a rare or legendary carries an effect and at most one step. So a far-end party loses raw stats and wins only where its synergy fires.
   - It isn't control resistance: without it, Lockdown's rungs read 94%, 83%, 80%.
   - Proposed: see in play whether a legendary feels like a step down. If it does, the balance pass's lever is one stat step on every rare and legendary.
4. **The forge took the one correction, and it didn't work.**
   - Before: Bonfire's top rung won 86% in Neutral and 68% in The forge, so the formation cost 17 points.
   - The change: Heat every 2 ticks (the fill's 4). After: still −16.6.
   - Why: the cost is the whole party Slowed for 24 ticks, which is Slow's own length since statuses are universal. And Heat never reaches Burn, which is half of Bonfire's damage.
   - Proposed: The forge gives up something other than a Slow, or its Heat reaches Burn. Your call: it's the line's idea.
5. **Many items barely matter in these fights.** 195 of the 461 items in the test parties never move a result past noise; Glaive, Humbling shield, Stillness's power step and Valhalla B never change a single fight. Versions (61 of 120) and power steps (45 of 63) matter least.
   - Part of this is the fights: rung 1 wins 90% to 100% of act I's, so there's little to move.
   - The difficulty pass will show more of them.
6. **24 items make their party worse.** Their give-up outweighs what they give. The biggest:
   - The forge −17
   - Blood covenant −9
   - Horn of the charge −9
   - Penance (Absolve A) −8
   - Rally the well (Stand fast A) −8
   - Hex of flames (Cold hex A) −7
   - Marching song (War ballad B) −6

   They're for the balance pass. The full list is in `measure-2.md`.
7. **The simulated player won 0 of 60 runs** (3% before this step), and 87% of its runs end in act I. Nothing was re-tuned. The fights were calibrated against the old loot, whose rares and legendaries carried two random affixes each. The difficulty pass recalibrates on the new loot, against hand-built parties as 5h does.
8. **Calls I made that you might not expect.** Each is one line to change.
   - The old loot is gone everywhere, free play included. The retired campaign still plays, without the rewards that named old pieces.
   - "Three trainings an opportunity" means three members, one each, as the campfire's TRAIN already did.
   - Mythics are offered in the two boss boons (after acts I and II, opening acts II and III), in the legendary piece's place. There's no boon after act III's boss: winning it ends the run.
   - A third more gear: 70% of regular fights pay a second pick of three, and the shop shows two more pieces. On a stock in the spine's shape, a run is offered about 115 pieces (was 81) and takes about 37 (was 28).
   - Boosts and Attack speed still add, as they have since step 4. So two swing shapes on one unit add up: Phalanx in a Scythe seat hits every foe at 1.2×, not 0.4×. That's the "one swing shape" lever.
   - Marked and about sixty new statuses have stand-in icons until your art arrives. I couldn't find the Marked icon in the repo.
9. **Your word on control resistance is in.** It counts Stun, Silence and Slow, with first values: half length from 2 stacks, immune at 4, one stack drained 22 ticks after the last change. It costs Lockdown 3 to 7 points of win rate; Cold Snap, Landslide and Phoenix moved a point or less (the other builds weren't kept from that run).

## The rhythm read

All twelve builds side by side, on their own act's fights, formation parties, all three routes and rungs averaged. Damage by quarter is the share of the party's damage in each quarter of a fight. "Top tenth" is the share dealt by its biggest tenth of hits, so higher means lumpier. "First kill" is how far into the fight, in %.

| Build | Should be | Damage by quarter | Top tenth | First kill | Reads as its row? |
| --- | --- | --- | --- | --- | --- |
| Landslide | a few huge blows | 23 / 34 / 25 / 18 | **43** (the lumpiest) | 39 | yes |
| Thousand Cuts | a dense even stream | 20 / 30 / 28 / 21 | 34 | 39 | weakly: it's Overflow's rhythm (0.82 apart) |
| Bonfire | rises the whole fight | **15** / 27 / 31 / 26 | 34 | 44 | yes: Burn 53% of its damage, the quietest start |
| Cold Snap | bursts on a beat | 17 / 22 / 29 / **32** | 38 | 45 | yes: the shatter 34%, damage late |
| The Hunt | a staircase of kills | 21 / 32 / 25 / 22 | 33 | **32** | yes: the earliest kills but Ambush's |
| Harvest | nothing, then everything | 25 / 31 / 25 / 19 | 36 | 42 | **no**: as even as the rest |
| Ambush | a spike, then a tail | **30** / 28 / 23 / 19 | 33 | **27** | yes (rung 3: 38% in the first quarter) |
| Overflow | waves of casts round the party | 22 / 30 / 28 / 21 | 31 | 40 | can't tell from damage |
| Lockdown | windows on a disabled foe | 20 / 30 / 29 / 21 | 34 | 41 | can't tell from damage |
| The Toll | follows the foes | 21 / 30 / 28 / 20 | 34 | 43 | Thorns only 10% |
| Blood Pact | high and steady, HP as fuel | 27 / 29 / 25 / 20 | 35 | 37 | yes: pays 34% of its HP as prices |
| Phoenix | surges after each fall | 25 / 30 / 26 / 19 | 30 | 36 | no surge seen; 80-tick fights |

How sure: every fight on six seeds, over thousands of fights a build; the quarters are averages, so a surge after a fall or a lock's window can hide in them. Before this step, the quick read found all twelve on top of each other. Now each build sits 0.82 to 1.21 from its nearest neighbour (0 is the same rhythm, about 1.4 is unrelated). Bonfire, Cold Snap, Landslide and Ambush are distinct; Thousand Cuts, Overflow, Harvest and the Toll are close to each other.

## Strength by rung

Win rate on the build's own act's fights (rung 1: act I, rung 2: act II, rung 3: act III), formation parties. The routes' range is in brackets. Every party starts each fight full, with abilities 60% charged.

| Build | Rung 1 | Rung 2 | Rung 3 | Same fights (act II): rung 1 / 2 / 3 |
| --- | --- | --- | --- | --- |
| Landslide | 93% | 77% | 72% (64–78) | 74 / 77 / **98** |
| Thousand Cuts | 98% | 89% | 49% (24–68) | 88 / 89 / 82 |
| Bonfire | 100% | 98% | 69% (63–81) | 99 / 98 / 95 |
| Cold Snap | 99% | 99% | **97%** (96–99) | 94 / 99 / 99 |
| The Hunt | 99% | 80% | 56% (42–78) | 85 / 80 / 82 |
| Harvest | 98% | 71% | 62% (44–75) | 86 / 71 / 79 |
| Ambush | 96% | 94% | 61% (43–71) | 81 / 94 / 82 |
| Overflow | 93% | 80% | 57% (15–82) | 85 / 80 / 90 |
| Lockdown | 98% | 76% | **35%** (18–44) | 94 / 76 / 74 |
| The Toll | 97% | 90% | 69% (42–100) | 84 / 90 / 89 |
| Blood Pact | 98% | 96% | 73% (56–94) | 93 / 96 / 94 |
| Phoenix | 90% | 75% | 47% (31–63) | 73 / 75 / 68 |

- **All or nothing:** rarely at rungs 1 and 2. At rung 3 several builds wipe in a third to a half of their act III fights: Lockdown 50%, Phoenix 47%, Thousand Cuts 37%, the Hunt 35%.
- **The formation against Neutral:** most formations add 2 to 9 points. The mountain (+15) and Landslide's and the Toll's far ends stand out; The forge (−17) is the exception.
- **How sure:** six seeds a fight, ten to twelve fights an act. The ranges between routes are wide (Overflow 15% to 82%), so a build's single number hides a lot.

## What carries each build

The items whose removal costs their party most, in points of HP a fight (a loss counts 100):

| Build | Carriers |
| --- | --- |
| Landslide | Pike wall, Rubble plate, The mountain |
| Thousand Cuts | Notched knife, Glint wand, Chain wand, Duelist's leathers |
| Bonfire | Phalanx shield, Spark wand, Hearth, Wick |
| Cold Snap | Winter's chain, Rime knuckles, Cold hex (power and B), Snowbound folio, Glacier's heart |
| The Hunt | Gale spear B, Notched knife, Broadhead bow, Huntmaster's quiver |
| Harvest | Banked staff, Gatekeeper's kite, Storm pike, Ring of steel |
| Ambush | Canopy staff, Shadow cloak, Drawn steel, Knives drawn |
| Overflow | Cataclysm staff, Glyphed robe, Relay |
| Lockdown | Snowbound folio, Chains of light, Idol of binding |
| The Toll | The mountain, Windrunner's garb, Jolt wand, Duelist's leathers |
| Blood Pact | Rootstaff, Martyr's maul, Phylactery, Censer mace |
| Phoenix | Shield of the chosen, Vestments of return, Dawnblade, Vial of the last breath |

Worth most anywhere: Rubble plate (16 points), Winter's chain (14), Rime knuckles (14, 31 in one party), Rootstaff (14), The mountain (14).

## Does every item work?

A piece check (`npx tsx src/piece-check.ts`) played all 608 items against the same party without them, over 25,000 fights.
- **Results:** no crashes, no loops, and nothing that works against its card.
- **Its flags:** it marked four items as never firing, one with no effect, and eight it couldn't test. I checked each one by hand, and every flag came from the party it was put on, not from the item:
  - **Echo charm:** with a Double strike wand and Kindling, its extra strikes carry Burn (62 Burns against 47 without).
  - **Valhalla and Einherjar:** every form works when an ally falls.
  - **Marching song:** cast, and it changes cooldowns.
  - **Batwing charm and Pyre of judgement:** they need ability hits and burning foes, which their test party didn't have.

## What was built

- **Engine 0.17, schema 0.8:** 41 additions, all in their full shape (`engine-spec.md`), with their tests (413 in all, 85 new).
  - 14 of them serve a single item. Each has a simpler shape, in `engine-spec.md` section 4, if any proves a burden. Three save real work if simplified: the live stat for Spiked bulwark, the cover for Oathbound shield, the recast for Cataclysm staff.
  - Control resistance on bosses.
  - Today's content plays exactly as before: the log fingerprints are unchanged.
- **Content:** all of the fill, the rulings winning, with fixes only where something couldn't work as written. `build.md` lists every change by share, about forty. The biggest:
  - Cover can't pick by wind-up left (no such pick exists), so it Guards a casting ally.
  - Eye of the tempest's jumps don't jump again, so Arc's and Double strike's extra hits don't jump.
  - Ready stance is −16.7 so that cooldowns are "a fifth longer", as the card says.
- **The loot:** fixed pieces with no affixes, slot-first offers, mythics in boss boons, formations by rarity, tempering within a kind, training as learn, power step or version, three a training opportunity.
- **The interface:**
  - training with power steps and versions everywhere it happens;
  - FITS and the class names on every card;
  - rarity in words;
  - mythic crimson;
  - formation rarity;
  - RESISTED and IMMUNE in the battle text;
  - stand-in icons.

  It loads cleanly at phone size. The agent's own play-through was cut off by the usage limit, so play is the check.
- **Tools:**
  - `npx tsx src/piece-check.ts`: does every item fire?
  - `npx tsx src/build-test.ts`: the rhythm read, strength by rung, and carriers. It takes about 2 to 3 minutes; `BUILD_TEST_PACK=<pack>` prices a rule.
  - `src/build-parties.ts`: the 216 test parties.

## Not done

- **The feel read:** the agent reading fights tick by tick was stopped by the weekly usage limit before it wrote anything. Its partial work is in its worktree. Run it next session, or let your play be the feel read.
- **The documents:** the core set's gear and formation list (`docs/core-set/gear-and-formation-lists.md`), `DECISIONS.md` and the primer still describe the old loot. They're brought in line after your sign-off, as the method says.

## Method notes

- **Writing the schema first worked.** One agent wrote the spec and every schema shape before anyone built, so the seven content shares and the two engine shares worked in parallel against one contract. The merges were small. The two engine halves met in the same functions and needed one reconciling pass.
- **Worktrees start from main, not the build branch.** Every agent had to be told to fast-forward. Next time, say it in the first brief.
- **Usage limits shape the plan.** Twice, every running agent stopped at once. Their work survived on disk and resumed, but the last two shares couldn't finish. Fewer, longer agents at the end would have fit.
