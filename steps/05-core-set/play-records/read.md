# The director's recorded runs, read (Nov 3, 2026)

Seventeen rogue runs the director played and exported, all lost: eleven at act I's full knobs (Oct 31, the build after the pieces' build) and six after their snap cut of act I (fights and elites −25, the boss −15; Nov 1 to 3). Every record is complete, and every one replays exactly under the pack of the build it was played on, so all 111 fights were played again with the engine's log on and read from it. The director called the two builds one build; so does this read. The tool is `npm run records` (below); `tables.md` beside this file holds every fight, every run and every fight as a player remembers it.

## The short version

- **The cut did what it was for.** Act I was cleared once in eleven runs before it and three times in six after; the act's boss fell once in five tries, then three in four. The ordinary act I fight now costs a median 9% of the party's HP (target 18), an elite 13% (target 25), and the boss beats the parties that reach it at about its target (22%). Part of that is the director playing better by the later runs (the deeper runs come late in both sets), but act I reads as playable now and its ordinary fights as easy.
- **Runs don't bleed out; they are killed in one fight.** Ten of the seventeen deaths were parties at 85% HP or more wiped in a single fight. Three more walked into a forced fight with a member already down. Only nine fights in 111 were entered below 70% HP: potions, tonics and the bench carry the attrition fine. So the difficulty the director met isn't the run's economy; it's the spread between fights.
- **Four fights did the killing.** The Ogre Chief's Crush (all five boss deaths; 14 of the 69 knockouts in every fight together, more than any other cause, with 4,400 to 7,200 a blow against members of 2,000 to 6,250 HP). The wolf packs at +110% to +200% HP (two deaths, both caster parties shredded in 21 to 31 ticks). The archers (three deaths: 600 to 1,250 an arrow with Take aim up, a Cleric dead at tick 11). And act II, where all four runs that reached it died: the crypt's fights at +240% to +320% HP and +70% to +100% damage, a Lich's Soulfire of 7,518 on a full-HP Bramble knight on floor 2, a 167-tick lava flow against four Mini Slimes, and a Burn chain from seven hellhounds.
- **The knob's damage term is what turns a designed "kills a caster" into "kills anyone".** This is the open question from 5e and 5f ("knobs on HP only"), answered by play, below.
- **The calibration is specific to its rosters, and the director's parties aren't the rosters.** The pack fights carry the act's highest knobs because the hand-built rosters handle packs; a drafted trio without thorns or an area spell meets fourteen bites a swing at +40% damage. Below.
- **Act II is the wall now.** Four attempts, four deaths, three of them on floor 11, one on floor 2. Below.

## What changes the design

### 1. The knob scales signature moves (recommend: stop it, or cap them)

The knob raises foes' HP by k% and their damage by k/2.5%, and the damage term multiplies every move, the signature ones included. Crush is 0.4 of the Ogre Chief's Attack, set in 5g so that "casters die, a full wall with Guard stands, and a crit is what one-shots it". At the boss's +14% to +20% damage it killed on 14 of its 22 casts across nine boss fights, Knights with 5,000 to 5,500 HP among them. Soulfire is 0.6 of the Lich's Magic, "deletes a caster"; at the lich lair's +79% damage it deleted the Bramble knight at 5,500 HP. Shield slam, Flatten and the Mini Slimes' touches follow the same line.

The first Crush comes early, on whoever the draw picks: four of the five lost boss fights had a member dead to it at tick 15 to 17, so a boss fight opens with one member down unless the draw found a Guarded wall. The director's answer in play was to bench the Knight to heal and bring it back for the boss; it still died to the opening Crush at tick 17 twice, and fell later in three of the four boss fights that were won. With no control in fights, there is nothing to do about a 5,000-point blow at tick 15 except have 5,001 HP and Guard up.

Recommendation: the knob's damage term applies to basic attacks only, and a signature move keeps its designed size (or is capped at a share of its target's max HP). Then the calibration is run again, since every knob was set with the term on. The boss targets may need raising afterwards; that's the right order.

### 2. Calibrate against the party that meets the fight, not the best party for it

Act I's regular fights sit at knobs from −57 (toll gate) to +150 (wolf pack): night wolves at +125, wolf pack +150, snake pit +54, bandit horde +35, archers' nest −22. The calibration sets each fight's knob so it costs the rosters their target share of HP, so a fight the rosters handle well (packs, against thorns and area damage) climbs until it hurts them, and then wipes a party built another way: the Cleric, Hexer and Pyromancer lost 91% to 0% to seven wolves in 21 ticks; the Cleric, Stormcaller and Monk in 31. A party with a wall and a Vampire beat the same room losing 6%.

Two ways to narrow that spread, either to measure before choosing: set each fight's knob against the weakest third of the rosters instead of the middle (the fights with the widest spread across rosters are the ones to look at; `npm run rogue:calibrate` has the per-roster costs), or widen the rosters with the kinds of trio the director actually drafts (two walls and a striker; a leader and two casters) so the knobs see them. The cost is that the best parties find pack fights trivial, which the director has said they prefer to a wipe.

### 3. Act II's entry

The act I rosters at the boss assume 2.4 abilities each and three legendaries; the act II rosters assume three abilities, one upgraded, three legendaries and better ordinary gear. The director arrived in act II with about two abilities a member, two to six legendaries and act I's gear, and met the crypt's floor 1 at +298% HP and +93% damage (a 40% HP cost), floor 4 at +236% (52%, two knocked out), floor 6 at +316%. The fire mine's fights run from −118 to +135 at the same floors. So the region pick at the end of act I is a hidden difficulty choice, and the crypt's calibrated knobs say its foes are weak at base and inflated to the target.

Act I has an `early` ramp (28 points a floor below the reference floor 7) that makes floors 1 to 6 gentler than the fight's own knob; act II has none, so floor 1 of act II is a floor-7 fight. Proposal: an `early` ramp for act II too, measured the way act I's was (`npm run rogue:calibrate -- --climb` against parties as they leave act I), and the regions' knobs compared so a region is a theme, not a difficulty.

### 4. Smaller things the records show

- **The slogs are real.** The ogre bridge ran 79 to 120 ticks in four of eight meetings; the packmaster 162; the lava flow 167, with the party at 0 MP for its second half. 5h proposed an earlier enrage; the records support it.
- **The archers.** An Archer with Take aim up hits 600 to 1,250 at −15% to −22% damage; the Shieldman's Slam stuns. Two of the three archer deaths began with the Cleric or the Vampire dead inside the first eleven ticks. This is one knob below the others and still the second killer among regular fights.
- **The Knight is knocked out 17 times of 69,** more than the next two classes together: it draws everything (Aggro 120 to 155 plus Taunt) and survives nothing signature. The director keeps drafting it and anchors boss fights on it, which is the design; the fix is item 1, not the Knight.
- **Interface:** before a fight the director flips through every formation (up to twelve changes in a row) and equips and unequips pieces to compare them. The formation list and the gear picker should show the comparison without having to set each one.

## What the director did (the habits, as evidence)

- **Avoids ordinary fights when the map allows.** With rooms of different kinds on offer they picked an event 27 times of 44, a fight 14 of 55, an elite 9 of 11, a campfire 10 of 12, a shop 7 of 22. Their road to the boss held about 4.2 fights and 1.6 elites against the simulated player's 4.9 and 0.9: an elite's legendary and formation are worth the risk; a regular fight's spoils aren't.
- **Trains rather than rests.** 22 trainings to 10 rests at campfires; HP comes from potions, MP from tonics (tonics chosen 43 times of 49 at the drop). Shop gold went 1,320 on training and 1,160 on everything else.
- **Declines the casters.** The Pyromancer taken once in ten offers, the Hexer once in seven, the Bard once in six, the Frostweaver once in six; the Vampire four of six, the Paladin four of nine, the Monk four of seven. The Cleric led six runs (one reached act II), the Knight six (one), the Ranger five (two).
- **Learned the bench.** 68 swaps, most in the last five runs (11, 19 and 15 in three of them): members rotated out to recover and the wall brought back for the boss. That is 5h's bench working as meant.
- **Reads the boss screen and still loses to it.** Every boss party arrived at 71% to 100% HP, most with a wall seated first; the boss's moves are shown, but not that Crush does 5,000.

## Decisions for the director

- **A.** Knobs on HP only, or signature moves capped (item 1). Recommended; then recalibrate.
- **B.** Which spread to calibrate to (item 2): the weakest third of the rosters, or rosters that look like drafted parties. Recommended to measure both before choosing.
- **C.** An `early` ramp for act II and the regions' knobs compared (item 3).
- **D.** The earlier enrage for the slogs (5h's proposal).
- **E.** Whether the archers get a look at their own, or wait for A.

## The tool and the records

`npm run records -- <files> [--packs out] [--fights] [--out file.md]` replays exported records with the logs on and prints the tables in `tables.md`: every run, every fight (foes' change, HP in and out, who fell to what), each fight id's cost across runs, what hurt the party and what it dealt, how fights were entered, and the player's habits. A record replays faithfully only under the pack of its build; `--packs` takes a folder of `pack-<build>.json` files (`git show <build>:content/core-set.pack.json`). `records/` holds the seventeen, in the director's two folders. More runs go the same way: export, drop the files in a folder, run the tool.
