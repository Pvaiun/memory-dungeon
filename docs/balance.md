# Balance

The director's rulings on balance and testing, the tools that measure the game, and what's being watched. Read it for balance or tuning work, not otherwise. The standing targets are in the tools (`TARGETS` in `tools/build-calibrate.ts`, `RUN_TARGETS` in `tools/rogue-tune.ts`, `BANDS` in `tools/balance/sheet.ts`); where each open pass stands is in its step's report (`docs/open.md`). Every value is tuned by simulation for a first playtest, and none is final.

## The director's rulings

The director's standing direction on this page's subject. Direction is guidance, not law: challenge any of it with evidence. Until a line is changed here, it stands, and it wins over the rest of this page: where they differ, fix the page. When the director changes a ruling, rewrite its line; don't add history.

- **Balance from what happens in fights** (who does what share of what, the economy of a fight) before win rates. Win rates set difficulty, last. The rogue mode breaks ties.
- **A class's stat line is a signpost** for what it does: a class keeps its extremes and its signature stats, and a stat never makes it read wrong (a Ranger with more HP than a Monk). Balance goes into the source of a strength or a weakness (its kit's amounts, its special stats) before its stat line.
- **Fights by cost.** A regular fight's and an elite's knob is set by what it costs a careful party (in acts II and III about a quarter of its HP, an elite over 40%; in act I a sixth and nearly a third), not by how often the simulated player dies in it: its losses between bosses come mostly from weak parties, and aiming them would make the fights free for everyone else. Whole runs set the bosses and even out the regions within an act.
- **Numbers, not behaviour.** Fix a problem by the amount applied, the cost, the cooldown or the duration, never by a new rule that changes what a thing does (a cap that binds on one hit, a target rule that leaves out the caster). A behaviour change that could read as esoteric goes to the director first.
- **Read fights, not only averages.** A tick-by-tick read of real fights (`tools/rogue-feel.ts`, `docs/feel-reader.md`) finds what the balance sheet's averages hide.
- **Balance is its own pass.** While making content, make no balancing rules: synergies may be overpowered.
- **Test with hand-built parties** (`tools/rogue-parties.ts`, `tools/build-parties.ts`), not the simulated player.
- **Difficulty aims hard:** a first win is an achievement, and each act climbs to its boss, the hardest fight of the act. The simulated player, far weaker than a good player, wins about 5% of runs at heat 0, Destiny Shards included.
- **Checks sized to the need:** run the tests, studies and reads needed to know something, and skip the rest.

## The tools

Each file's header says how to run it.

- `npm run smoke`: play the core set documents' own test trios (`--seeds N`, `--only <stage>`, `--log <stage>`, `--kit best`).
- `npm run dungeon -- --pack content/core-set.pack.json --party content/parties/starters.json --dungeon old_road`: print one run (`--seed N`, `--player`).
- `npm run study -- studies/core-set-starters.json`: run a combat study: prints a digest, writes `out/<id>/` (`--report`, `--feel`, `--final`, `--workers N`).
- `npm run balance -- --trios 80 --seeds 2`: the balance sheet: both modes at frozen knobs, a spread of parties, every option's line against its band (`out/balance/sheet.md`; about 4 minutes; `--sets free,rogue`, `--probes off`, `--set path=value`). Run it after any numbers change, before the knobs.
- `npm run rogue:calibrate`: each fight's knob against the hand-built rosters of `tools/rogue-parties.ts` (act I's pools; `--climb` measures act I's climb); then `npm run rogue:tune`: the bosses to their targets and the regions within an act evened out.
- `npx tsx tools/build-calibrate.ts`: each regular fight's, elite's and boss's knob against its act's build parties, from rolled starts, to its tier's `TARGETS` (every act; the easy pools with `--pools easy`). It set the balance pass's baseline; the whole-run tuning goes on from it (`rogue:tune` for the bosses).
- `npm run rogue`: whole runs with the simulated player (`src/sim/rogue-ai.ts`).
- `npx tsx tools/build-test.ts`: the nine builds side by side, on the 27 routes of `tools/build-parties.ts` (builds.md's classes, each build's formation a rung; gear, versions and mythics picked from the loot's tags; one or two abilities a unit at rung 1, all three after). Each fight starts rolled, as a good player arrives: HP mostly full, MP partly spent, cooldowns anywhere from ready to just used (`--fixed-start` for the old full start). Its By tier table (regular fights, elites, bosses by build and rung, and the boss's HP left in a loss) is the balance pass's measure; a piece a good player wouldn't hang on a member, or wear in its formation, is passed over (`MISFIT` and `AGAINST` in `tools/build-parties/kit.ts`: under The still hour nothing that works through basic attacks, nor Archmage's mantle; under The hundred hands neither Answering thunder nor Provoking blade).
- `npx tsx tools/piece-check.ts`: every item does what its card says.
- `npx tsx tools/gear-slots.ts`: who wears which kinds, and whether the weapon and offhand rules hold.
- `npx tsx tools/loot-list.ts`: today's loot as one line per item, with its cards (`out/loot-list.md`).
- `npx tsx tools/rogue-feel.ts`: fight logs for a feel read; the reader's brief is `docs/feel-reader.md`. `--builds landslide,storm` (or `all`) plays the build test's parties instead, on their rung's fights or `--fights`, with each build's card (`docs/build-cards.md`) beside the packs.
- `npx tsx tools/rogue-acts.ts`: the act road.
- `npx tsx tools/rogue-play.ts`: the AI playtester's game.

## To watch

For the playtest and after. When one is settled, delete its line.

- Wall-less starts lose far more of act I's regular fights than walled ones at any knob; the director will fix that by other means than the knobs.
- Act III's bosses beat most rung-3 build parties (15% won, five builds under 10%) while the simulated player's survivors win 38% of their first tries (the whole-run tuning, decision 1). The Tower Top's bosses are the longest fights (about 145 ticks).
- Bonfire's rung 2 is strong (98%); Barrage is weak against bosses (6% at rung 1). The Vampire and the Valkyrie lead whole runs at well over the field; the Paladin reads as a healer with a Smite (a hybrid by design).
- Dear spells come under once a boss fight (Pyre, Fireball, Tremor, Allegro); bosses' great blows can kill a full-HP back-row unit.
- From part one: Blood Pact's rung-1 Vampire route stalls to the enrage (the filler's picks, not a piece); trainings are worth little beside pieces (a version about 0.9 points of HP a fight, a power step 0.6, a piece 4.6, a formation 8.3); worse to have than not, by the ablation: Refrain B, Earthen shell B, Shieldmaiden A and B, Stand fast A and B, Cold hex A, War ballad B, Encore A; the Hexer's MP pins at max; Hoplon prints zero-damage lines; the one-swing-shape lever isn't applied (the Landslide Hoplite stacks three slow shapes); Hunter's mark and Gravemark mark the lowest current HP (the director's rule).
- The balance sheet: ten formations sit just over their band; its trios never wear 76 of the pieces, so its gear rows mean little. The director prefers sample parties against sample fights to simulated runs for judging builds.
- Whether Accuracy goes on more commons is the director's call (Dodgers and Armored shells lost their Fundamental answer). Kits arriving one ability at a time, and cooldowns carrying, are for the playtest to judge.
- From the loot pass: Frost fist's power step; Marked's length against how long a Marked foe takes to fall; plain riders sized for a slow weapon once The standard or Mimic wand puts them on a fast one; a fire that grows by itself on a lone boss under Everflame lantern, Bellows wraps and speed; Unmake fizzling for want of a cast (12%); nine items that never fire in the piece check's fights for want of their condition.
- The sixteen mythics are the creative-builds pass's new ones; the whole-run numbers were measured before them.
