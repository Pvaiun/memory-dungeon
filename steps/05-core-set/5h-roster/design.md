# Step 5h design: the roster, MP across fights, and the reward plan

The director's words are in `intent.md`. This is the second version, revised from their ten notes on the first (session of Oct 28, 2026). Every choice below is taken unless marked **Asking**. Gear, formations and upgrades are step 5i (`../5i-synergy/kickoff.md`). This step builds the structure they're found in, the reward economy they drop into, and the training screen they'll fill.

## The idea in one line

Every fight's preview is a chance to adjust the party from a small roster. Fighting costs MP and sitting on the bench restores it, so a party is a build to keep running, not a list to rotate. Rewards come rarer and as choices between kinds (gear or a formation, a recruit or a camp seat), so a run's build stays open longer.

## The roster

- **Party of three, bench of two at the start (a roster of five, as today), up to four on the bench.** A third and fourth seat are rewards you choose over something else: one of the boss's boon options, and an occasional event. The director's concern was that eight seats and many recruits make every run the same build. A small roster with 1-of-2 offers forces creativity, and a seat costs a reward.
- **The start:** the leader, then two drafted picks, each **one of two** (was one of three). While the party has no healer, one of the two heals, as today.
- **Every starting unit, the leader included, knows one ability, rolled at random** and shown on its card. That includes Raise and Valhalla. A bad roll is a choice the player can decline.
- **Recruits are offered one of two** (was one of three). A recruit's rarity is what it knows: **one, two or all three** of its abilities, at random, leaning higher by act. Recruit offers never show a class already in the roster.
- **Swaps any time outside a fight.** The campfire's SWAP tab goes. A full roster sends someone home to take a recruit.
- **The reserves rule is gone.** A wipe ends the run.
- **Cooldowns:** benched units keep their cooldowns as they left them. **Fresh abilities start half charged:** every ability of the starting party, of a new recruit, and an ability just learned (not upgraded) begins with half its cooldown already run. That's the director's fix for a Raise learned after a knockout that then can't come round in the boss fight.

## MP: drained by fighting, restored on the bench

- **No MP regen in fights by default.** Every class's MP regen stat goes to 0.
- **MP regen stays as a stat on gear** (and on Caravan's Quartermaster seat): a fighter wearing it regains MP during fights. That makes it a build choice, "this caster lasts a third fight". It only works in fights, on whoever wears it, so there's no bench cheese. The share it gives is raised so a piece is felt.
- **The bench recovers a flat share of max MP after each fight it sat out.** Every class is the same and no gear touches it, just as a tonic restores a flat share. It counts from the max the member last fought with, the rule REST and tonics already follow, so +MP gear worn on the bench adds nothing. The starting value is 50% with a bench of two, then tuned.
- **The target: from full, every class runs dry in about two to three fights** (casters two, walls three), erring scarce. No class goes an act without the bench, and no party is built around a wall that never rests. Costs and pools are tuned class by class to reach it. There's no global scaling, which the director agreed changes nothing alone.
- **Fighters' other MP:** Clarity, Refrain, Siphon, the Soul jar, tonics and FOCUS. That's the support path.
- **Unchanged:** the act's start restores everyone. Free play loses in-fight regen too, since it's one rule in the pack.

## The reward plan

### What the numbers say about gear today

From 300 runs of the simulated player at heat 0:

- **A run that reaches the end takes about 17 pieces:** 6.7 in act I, 5.6 in act II, 5.0 in act III.
- **The rarities are upside down:** a full run takes about 4.7 legendary, 6 rare, 3 uncommon and 3.7 common pieces. In act I alone it takes **more legendaries (2.1) than commons (1.5)**.
- **Where they come from, per run:**

  | Source | Pieces a run |
  | --- | --- |
  | Fight spoils | 4.0 |
  | Elite trophies (a legendary outright) | 2.4 |
  | Chests (70% rare, 30% legendary) | 2.0 |
  | Shop | 1.9, of 36 offered |
  | Elite spoils (a pick of three rares) | 1.7 |
  | The boss's boon | 0.5 |
  | Events | 0.25 |
- **Builds feel complete early.** By act I's boss the party wears real gear in 5.4 of its 9 slots, 1.4 of them legendary and 1.9 rare. By act II's boss it's 7.3 of 9. The armor and amulet slots are all filled by act II's floor 4 (the median run). Unworn pieces in the bag: 2.4, 5.9 and 10 at the three bosses.
- **You never fish for a class.** 0.05 pieces a run were ones nobody could wear: drops are restricted to what the roster can use.

So, of the director's five suspicions:
- **too many drops:** yes, 17 pieces for 9 seats;
- **rarities too generous:** yes, an upside-down pyramid;
- **too few commons:** yes;
- **drops restricted to usable:** yes, it removes the fishing;
- **slots not restricted enough:** this is the least of the five. Slot rules stay as they are here; making pieces specific enough to switch for is 5i's job.

(The simulated player takes gear greedily; a human may skip some. The offers are the system's either way.)

### The plan

**The targets for a full run:**
- about **10 pieces** (from 17), roughly three or four an act;
- a pyramid: about **five common or uncommon, three rare, two or three legendary**;
- **a third of offered pieces** (outside the shop) **for a class not in the roster**, so a piece can make you want a class. Recruit offers already lean toward classes a bagged legendary is for.

**Rewards as choices between kinds** (the director's type A versus type B):

| Where | Was | Now |
| --- | --- | --- |
| Regular fight | Gold, then a pick of 3, mostly gear (rare 12%) | Gold, then a pick of **2** from a mixed table: gear (common 65%, uncommon 28%, rare 7%), a tome, a supply or more gold. Some fights offer no gear at all. |
| Elite | Gold, a legendary outright, then a pick of 3 rares | Gold, then a pick of **2**: a legendary piece, against a rare formation, a recruit or a rare piece. An elite still pays a legendary if you want it (5d found elites need it). |
| Chest | A rare (70%) or legendary (30%) piece | A rare (55%), a legendary (15%), or a cage: a recruit with an uncommon piece suited to it (30%). |
| Shop | 6 pieces a visit, 1 recruit, 1 formation | 5 pieces (2 common, 1 uncommon, 1 rare, 1 legendary), 1 recruit, 1 formation. |
| Boss's boon | A pick of 3: legendary, formation, recruit | A pick of 3 from: a legendary, a formation (rare or better), a recruit (two or three known), **a seat at camp** (up to four). |
| **The Muster** (new room) | | A pick of **1 of 2** recruits, or none. |
| **The Drill ground** (new room) | | A pick of **1 of 2** formations, or TRAIN two members instead. |

- **The new rooms:** about two Musters and two Drill grounds an act, on different paths, so routing toward a recruit or a formation is a choice.
- **Also:** a stranger at the fire at some campfires (one recruit, take it or not).
- **Events with variants.** Each event rolls one of two or three versions. About six new ones around the roster: a Deserter, Mercenaries, a Prisoner Cart, a Rival Company, an Old Banner, a Training Hall. The Drill Yard and the Fallen Standard fold into the Drill ground and the Old Banner.
- **Formation rarities:** common, rare, legendary, rolled by act. The nine formations get provisional rarities; 5i sets the final ones and adds more.

### Training

- **More chances to train, in one nested screen** (member → its abilities and passive → that one's upgrades), built with today's single upgrade. 5i fills in two branches for every ability and passive.
- **Where it comes from:**
  - the Drill ground and the campfire each train two members;
  - the act's level-up;
  - the shop (repeatable);
  - tomes;
  - the Old Master and the Training Hall;
  - recruits arriving with more known.

## Testing: hand-built parties, not a simulated player

The director's point: a rules-of-thumb player can't come near a human who uses potions and builds well, and whole-run simulation has burned hours on something obviously wrong from the start. So this step tunes without it:

1. **Representative parties, built by hand:** about three dozen, three or four per act and tier (regular, elite, boss). They span the classes and the build shapes, with the gear, known abilities and formation a run would have there under the new reward plan. They're written down in the step folder so the director can read them.
2. **Each fight's knob** from those parties: the calibrator, fed by them instead of by the simulated player's snapshots.
3. **The MP economy:** each act's representative roster plays its act's fights in sequence with a plain, stated rotation rule. The rule: bench whoever is under a third of its MP, field the best of the rest. This measures fights-to-dry by class and how often the bench is used.
4. **A feel read** of a few fights, then the report.

The simulated player is kept working so runs can be played end to end (tests, the interface), but nothing is tuned on it. Whole-run simulation comes back after 5i, when every system is in, if it stays cheap.

## Intent map

| The director's item | | |
| --- | --- | --- |
| Bench of 5 or 6 (first message) | bent, at their word | Two at the start, up to four, the extra seats as chosen rewards (their later notes). |
| A small roster that grows, or a seat as a reward over something else | used | The boon's seat and an event. |
| Recruit picks one of two | used | Recruits and the start draft. |
| A starting unit knows one random ability; Raise isn't special | used | |
| Recruit rarity is what it knows | used | |
| Recruits more common; at campfires or chests; with a piece of gear | used | The Muster, the stranger at the fire, the cage. |
| Swap any time outside a fight; no reserves rule | used | |
| MP back on the bench, not HP; a flat share, not the regen stat; no gear cheese | used | A flat 50% (tuned), from the last-fought max. |
| MP regen stays as a choice, default zero, from gear | used | Their alternative. |
| Raise MP costs and pools | set aside, at their word | The ratio does it. |
| Casters and walls run dry close together, scarce | used | Two to three fights for every class. |
| Fresh units and new abilities start partly charged | used | Half charged. |
| Gear economy: check counts, rarities, slots, usable-only drops | used | The numbers above; counts, rarities and usable-only change here, slots in 5i. |
| Choices between kinds | used | Fight spoils, elites, chests, the boon, the Drill ground. |
| Not a choice after every fight | used | Recruits and formations live in their own rooms; fight spoils are a pick of two. |
| Formation rarities | used | Three. |
| More training, a cleaner screen | used | |
| More events, with variants | used | |
| Test with representative parties, not a dumb picker | used | |
| Enemies harder for the new flexibility | used | The knobs, on the hand-built parties. |
| Potions, the Hourglass, six abilities | set aside | Their word. |

## Predictions (checked in the report)

- Every class runs dry in two to three fights from full; none goes an act without the bench.
- A full run takes about 10 pieces, two or three of them legendary. The party's slots fill around act III, not act II's floor 4. The bag holds three or four pieces, not ten.
- Four to six formation picks a run (were one or two).
- Fights the rogue softened for a fixed party come back without a spike: Bomb Bugs three to a fight, snake packs that grow.

## Asking

1. **Fight spoils with no gear.** On a regular fight, a pick of two that is sometimes a tome against a supply, with no gear at all. That's my pick, since it's the biggest lever on the count. Or should every regular fight keep at least one piece of gear in its two?

## The build

- **Rules and content:** `src/rogue.ts` and `content/core-set/rogue.ts`. MP regen off by default in the pack (`ENGINE_VERSION` bumped if regen is engine-side).
- **The interface:**
  - the party screen with the bench, MP bars reading first;
  - the two rooms;
  - recruit and formation cards with rarity;
  - the mixed spoils;
  - the nested training screen;
  - the events.
- **The tuning tools** (the hand-built parties, the act sequence for MP). A budget of eight tuning rounds.
