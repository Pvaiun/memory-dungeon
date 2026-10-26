# Step 5d report: a rogue mode

You asked for a third mode, beside the journey and free play: the core set as a roguelite, on Slay the Spire's structure, built and tuned overnight. It's built, tuned by simulation, and was played by twelve AI playtesters over six rounds, each round fixing what the last one found. It's on this branch (`ccr-9e0c2cb1-in0wcs`, branched from the campaign branch and since merged with main). This report leads with what needs you.

**Since your first read (Oct 26, evening):** the branch is merged with main (your Aggro draw rule and hand-written MP costs), every fight recalibrated for it, and heat 0 made harder at your word: the simulated player now wins **21%** of runs (it was 38%), with the extra difficulty on the bosses. Every number below is this build's. The AI playtests (section 4) ran on the earlier, easier build. `design.md` has the mode in full, `intent.md` your words, and `tuning.md` the 36 rounds.

**To play it:** `npm install`, then `npm run ui`, and open the address it prints (on a phone on the same Wi-Fi, the Network address). Settings → MODE → ROGUE, then ROGUE on the home menu. Pick a leader, take two companions, and climb. Tap a lit room on the map to see what it is, then ENTER; tap BOSS under the map to see what waits at the top. When you enter a fight you see the foes first: change gear (PARTY), then FIGHT. The journey and free play are untouched.

**In one paragraph.** A run is three acts. Each act is a Slay the Spire map of nine floors through a themed region (the Old Road, then a pick of two from the Crypt, the Fire Mine and the Ice Pass, then a pick of two from the Storm Tower, the Deep Crypt and the Tower Top). Each act's boss and its moves are shown from the start, and at the fork. You lead with a class you own, draft two companions from all sixteen, and grow:
- **Abilities:** classes join knowing one ability and learn the rest at campfires, from tomes, at the shop and at a level-up after each boss.
- **Gear** comes in four rarities built on the core set's pieces: affixes, and 43 legendary pieces that bend a rule, each naming the classes it's for.
- **Formations, recruits and supplies** come from spoils, elites, bosses, chests, the shop and twelve events.

HP, MP and knockouts carry from fight to fight. A won run adds its party to the classes you can lead with.

**What needs you, in short:**
1. **The shape:** a leader you own plus two drafted companions, abilities learned one at a time, and fights previewed before they start (1A).
2. **Two exceptions to "swaps at campfires":** the fallen can be replaced from camp between rooms, and after a wipe in a regular fight or elite those standing at camp take the road; a wipe at a boss still ends the run (1A).
3. **The core set's 14 powerful pieces:** in the rogue, most are worth less than an ordinary piece. Leave them, drop the worst from the rogue's pool, or a gear pass (1B).
4. **The class pass,** with the rogue's table as a second measuring stick: the Vampire and Monk win a third of runs as leader, the Bard and Hexer a tenth (1C).
5. **Difficulty:** heat 0 is now 21% for the simulated player, as you asked, and heat steps are 4 at your pick (were 5, which left heat 10 unwinnable). Too hard or too easy once you've played (1D)?
6. **Two core-set questions:** Judgement against Taunt, and a boss's opening seconds (1E). Your draw rule answered the third (the Aggro floor).

## 1. Decisions and open questions

### A. The shape I chose: confirm or change

- **The start: a leader you own, then two companions drafted from all sixteen** (pick one of three, twice). Your words were "start by selecting a class out of the ones that you own". I read that as the leader, not the whole party, so every run has a full party from the first fight and every class can turn up in your first run. The meta still bites: a won run's party becomes leaders. **The alternative** is a whole party from owned classes, so every early run would be the Knight, Cleric and Ranger.
- **Abilities, one at a time: the run's biggest power curve.** A class joins knowing one ability, plus one for each act reached. It learns the rest at campfires (TRAIN), from tomes, at the shop and at the level-up after each boss. If every class joined knowing all three, the simulated player would win 62% of runs instead of 38%, which is more than every legendary piece in a run put together. **No experience levels:** the level-up after each boss (learn one, or make one better) does that job with a choice.
- **Fights are shown before they start.** Entering a fight room shows each foe: what it is, what its moves do, who they aim at, how big they are before Armor, what it hits with and what it resists. The party can still be re-geared, re-seated and re-ordered. Once the fight begins it's set, and leaving replays it from its start, the same way. The first two playtesters asked for this ("gear is a blind guess"), and by the third round the playtesters' favourite moments came from it: "read 'absorbs fire, weak to ice / Inferno: very long cast', benched my best damage dealer, put Hush first: Inferno is lost." **Say if you want the blind version back.**
- **Swaps at campfires, as you asked, with two exceptions I added for those waiting at camp:**
  - a fallen party member can trade places with someone standing at camp any time between rooms;
  - **the reserves:** a lost regular fight or elite with someone standing at camp doesn't end the run. They take the road, and the room is passed with no spoils. One standing at camp can also fill an empty seat any time. **A lost boss still ends the run.**

  Four playtesters in three rounds named the same least favourite moment: a run lost with healthy members watching from camp, almost always mid-act. At bosses, the reserves didn't work either way: met at full HP, the boss was "a loss screen with extra steps" (round 5); left wounded, it was "a wipe that cost nothing", finished by one Firebolt after a phoenix (round 6). So the boss stays the climax. A campfire's swaps also stay open until you leave, not just until you pick (one playtester raised a member at camp, found the window shut, and lost the run to it). **Confirm, or say campfires only.**
- **Those waiting at camp get half a REST and half a FOCUS at every campfire**, whatever you pick (those who were at camp when you arrived). All of both made a fourth member "a free heal battery" (three playtesters). Half keeps the bench worth having, like Darkest Dungeon's roster.
- **Gear changes max HP and MP, never current.** A +HP piece raises the ceiling and doesn't heal; one moved off a fallen member brings nobody HP. Four playtesters used HP and MP gear as heals and ethers while what was missing stayed missing.
- **Elites work like Slay the Spire's elite relic.** An elite pays a legendary piece outright (the trophy, now always one aimed at someone in the party), 50 to 65 gold and a pick of three rares. Without the trophy, avoiding elites won more runs than taking them.
- **Regular fights are longer and softer than the campaign's:** their foes have 80% more HP and deal 30% less a hit, at the same cost to the party. Fights went from 21 to 25 ticks to about 37, and each ability slot fires about twice as often. Before that, the playtesters' "fights are over before the build shows" and "the third ability never fires" were right.
- **While the party has nobody who heals others, each draft offers one who does** (the Cleric, the Bramble knight or the Valkyrie). "Two of my three runs felt lost at the draft": HP carries over, and without a healer it only leaks. Within noise for the simulated player, which drafts by value anyway.
- **Training is repeatable.** The shop teaches and upgrades as often as you can pay, each one 30 gold dearer in the same visit. Two playtesters finished winning runs with 576 and 378 gold unspent when it was once a visit.

### B. Legendary pieces: I lifted the rogue mode's own; the core set's need your call

Each legendary piece was measured by giving it to the simulated player at the start, with no affixes, locked on the party member it suits best for the whole run. That was compared with the same seeds without it (1,000 runs a piece). The zero point is an ordinary piece locked the same way: a +HP amulet is worth +5 points, a sword +7, medium armor +4.

- **Before:** of the 29 pieces this mode adds, only the Herald's horn (+16) clearly beat an ordinary piece's stats. Most rules were worth less than an ordinary piece of their slot, some by 15 points. That matches what four playtesters said: "stat sticks with a small rider".
- **After two passes** (bigger stacks, longer Haste, a Shield for the Stone idol, a self-applied Bleed for the Hunter's bow, a self-applied Burn for the Cinder rod, Silence and Stun immunity for the Silver bell, HP for the Soul jar, a stat step on pieces with none), about two-thirds match an ordinary piece of their slot or beat it.
  - **They beat it clearly:** the Herald's horn (+19: Regen for the whole party at every fight's start is the jackpot, and I left it), the War banner, the Grave lantern, the Frostfang, the Briar coat and the Soul jar.
  - **Still a few points short:** six niche pieces that want a specific class (the Siren shell, the Frost shard, the Shadow cowl, the Wound sigil, the Silver bell, the Earthshaker).
- **The core set's 14 powerful pieces** are sidegrades by the core set's own rule. Measured the same way, most cost 10 to 25 points against an ordinary piece (the Mist claws −25, the Needle and the Glass heart −18, the Thornheart plate −14). I didn't change them, because their numbers are shared with the journey and free play. In the rogue they still drop with two affixes, so they play like rares with a twist. **Options:** leave them, drop the worst from the rogue's pool, or a gear pass in the core set.

### C. Classes: the roguelite makes the spread visible, and it's wide

Each class as leader with two random companions (300 runs each; the average is lower than the run's because the companions are random):

| Wins | Classes |
| --- | --- |
| 34%, 27% | Vampire, Monk |
| 16% to 12% | Valkyrie 16, Ranger 15, Paladin 13, Geomancer 13, Bramble knight 12 |
| 11% to 9% | Hoplite 11, Stormcaller 11, Cleric 10, Assassin 10, Knight 9, Pyromancer 9, Frostweaver 9 |
| 6%, 5% | Hexer, Bard |

Since the merge, the Knight dropped from third (28%) to 9% as a leader: your HP 4 and Protect on a long cooldown, against harder bosses. The starters as leaders, with the simulated player's own drafting: the Cleric 24%, the Ranger and the Knight 20%. (The simulated player still drafts by class values measured before the merge, so it over-values the Knight a little.)

- **The top is the top because attrition rewards sustain.** HP carries over, so lifesteal heals HP that would otherwise need a campfire. The Vampire and the Monk were the playtesters' "mandatory" classes too, and "Knight wall plus Assassin carry" was the reliable pattern. With Blood drain as its first ability the Vampire won 37% when the next best class won 20%. **I start it with Wither instead**, the rogue mode's one class-specific choice.
- **The bottom is the bottom because of the kit, not the start.** The Bard's first ability is War ballad and the Hexer's is Enfeeble: a buff and a debuff, no damage. A rule letting the weakest eight join knowing two abilities moved none of them by more than 4 points, and no other starting ability lifted them.
- **MP binds only for casters.** Every playtester saw it: "the Knight, Monk and Ranger ended every fight at full MP; the Cleric was the real clock". FOCUS is right only for a caster-heavy party.
- **My proposal:** the class pass the 5c report proposed (the casters' survival and MP, the Vampire, the Knight), with this table as a second measuring stick. In a draft, a class that wins 5% is a class nobody takes, and a roguelite lives on variety.

### D. Difficulty, heat and the playtesters

- **The simulated player wins 21% of runs at heat 0,** at your word (it was 38%: a first win should be an achievement). It plays by rules of thumb: it equips by stat weights and drafts by measured class values, with no search, so a careful human should do better. The extra difficulty is on the bosses: they end 23%, 38% and 41% of the runs that reach them in acts I, II and III (targets 22, 35 and 45; before, 12, 20 and 25). Regular fights and elites end 4% to 7% of the runs that enter a region, as before.
- **The AI playtesters won 14 of 36 runs:** 2 and 0 of 3 in round 1, then 1 of 3 for each of the four players of rounds 2 and 3, 2 and 1 in round 4, 1 each in round 5, and 3 and 0 in round 6. Asked how much they'd want another run right away, rounds 4 to 6 said 7, 7, 6, 6, 6 and 6 out of 10. The two of round 6 disagreed on difficulty: "too easy; elites easy and paying well, gold and supplies plentiful" against "two of three losses came from fights whose danger I had no way to see". Bosses ended most of their lost runs, and so did a few big swarms (eight snakes and bandits on act I's floor 7; five Leeches from an Ambush).
- **Act I felt hardest to three of them, and acts II and III easy once a carry came online.** Part of that was two snake fights: the Viper Den and the Snake Pit ended 9% and 7% of the act I runs meeting them, every other act I fight 2% or less, with their knobs already at the floor. Bleed doesn't shrink with a fight's knob, and the regular fights' extra HP gave snakes more hits. Snake packs now never grow and act I's hold two (recalibrated: both cost what the rest do). The rest of the impression, a human's build outgrowing the late acts, is now answered by the harder late bosses.
- **Heat:** a won run opens the next level, each +4 on every knob at your pick: 17%, 12%, 10%, 6%, 3% and 2% at heats 1, 2, 3, 5, 7 and 10. At +5 it was 16%, 11%, 8%, 4% and, at heat 10, 0% (4 runs in 1,000); at +3, 18%, 15%, 12%, 8%, 5% and 2%. The step is one number, `heat.per` in `content/core-set/rogue.ts` (the cap is `heat.max`, 10). The targets themselves are one line in `src/rogue-calibrate.ts` and `src/rogue-tune.ts`.

### E. Measured and left alone

- **Boss lock-out.** Playtesters saw the Storm King stunned out of his Rally and the Fire Giant silenced out of Inferno, so I read every boss fight's log in 300 runs (`src/rogue-bosses.ts`, on the final build). Every boss casts its big move 1.1 to 1.7 times a fight. Silence costs a boss a cast 0.08 times a fight at most, and stuns hold a wind-up 0.1 to 0.5 times. A lock-out needs the right pair (the Knight's Shield bash with the Assassin's Garrote, or the Hexer's Hush against Inferno). That reads as counterplay, and the playtester who did it loved it. No boss rule added.
- **Events and level-ups are close to flavour.** Picking at random wins as often as the simulated player's picks. A level-up can now be taken as 40 gold, so a late one with a single thing left is still a choice. I'd add stakes to events when there's content input from you.
- **Bomb Bugs come at most two to a fight.** Their document says "three together wipe", and a roguelite party can't be built for one fight.
- **Core-set questions the playtesters raised, not rogue rules:**
  - **Aggro had a floor of 100 against a tank's 6,000 or more,** so a member pushed to the floor was hit about 1.6% of the time ("aggro 0 acts like immunity while anyone else is up": two playtesters). Your draw rule on main answers it: nobody draws less than a third of an ordinary member.
  - **The Paladin's Judgement doubles damage against Taunting foes** (Shieldmen, the Tower Top), which one playtester called solved.
  - **A boss's opening seconds.** Squishies (2,000 to 2,500 HP) were killed at t3 to t35 of a boss fight, before a Taunt or a Shield was up, and two playtesters felt runs were decided there. How fights open (5c's slotted head starts) is the core set's; the rogue mode's answer so far is the preview's sizes and targets, and the reserves.

## 2. What was built

- **The mode, in the interface:** a third MODE beside the journey and free play. Its screens:
  - the leader pick (and heat, once won) and the draft;
  - the map, Slay the Spire's: icons per room, the walked path in gold, the reachable rooms pulsing, the boss crowned at the top, and BOSS for its moves;
  - a fight's preview (each foe's moves, targets and sizes, what it hits with and resists), then the battle screen as it is, with the party's HP and MP carried in;
  - spoils, boon and chest cards (rarity by colour and a glow on the art, the legendary's rule, who it's FOR);
  - the shop (BUY, TRAIN, SELL), the campfire (REST, TRAIN, SWAP), events, level-ups, the fork (each way's boss and moves) and the end;
  - the party screen (IN FOR … to put someone from camp in a fallen member's seat, TAKE A SEAT for an empty one), the unit sheet (each ability's size for that unit; tap a number twice to leave an ability out) and the gear picker, on the run's items;
  - a celebration when a won run unlocks leaders.

  The run is saved after every step. `ui/README.md` has the screens.
- **Content** (`content/core-set/rogue.ts`, the pack's `rogue` block, checked by the schema and the validator):
  - seven regions with 100 fights between them (easy, regular, elite, boss);
  - 29 new legendary pieces and the 27 statuses behind them, and who each of the 43 is for;
  - 20 affixes and 12 events;
  - every number, and each fight's knob in `rogue-knobs.json`.

  Nothing in the core set's classes, gear, formations or enemies changed.
- **Rules** (`src/rogue.ts`): the run as plain data, moved one decision at a time. It's pure and deterministic, so the same seed and the same choices make the same run.
- **Tools:**
  - `npm run rogue`: whole runs with the simulated player, a digest, and what-ifs (`--dials` noise, greed, no gear, a locked piece; `--gift`; `--heat`; `--set` to patch the pack; `--diary` to read one run).
  - `npm run rogue:calibrate`: each fight measured against snapshots of real parties.
  - `npm run rogue:tune`: whole runs correct each boss and region.
  - `npm run rogue:legendaries`: each legendary piece priced, locked on all run.
  - `npx tsx src/rogue-bosses.ts`: how bosses fight, from their logs.
  - `npx tsx src/rogue-play.ts`: the AI playtester's game.
  - Tests in `src/rogue.test.ts`.
- **One engine change, to the log only:** each damage entry names its kind (an element, physical or untyped), so a fight summary can break down damage taken. Outcomes are unchanged, and the pinned run's log fingerprint changed for it alone (checked: without the field, the old fingerprint comes back).
- **Fixed from the playtests** (six rounds; `tuning.md`, rounds 16, 17, 24 to 26, 29, 31 and 33):
  - **Exploits and bugs:**
    - a refill from taking MP gear off and back on;
    - a heal from wearing a +HP piece just to rest, and HP and MP gear as heals;
    - an event cost that never applied, and the Pilgrims' text;
    - the same legendary twice in a run.
  - **Information:**
    - foes shown before a fight, with their moves, targets and sizes;
    - the boss from the map and at the fork;
    - each ability's size, and what an upgrade changes in numbers;
    - who a legendary is for;
    - killing blows, how each foe fell, and damage taken by kind;
    - who laid a status that dealt a killing blow.
  - **Rules:**
    - a mid-act campfire on every path, and two shops an act;
    - swaps open until a campfire's LEAVE, the reserves after a wipe on the road, empty seats filled from camp, and half a rest for the bench;
    - gear that changes max HP and MP but never current;
    - a healer offered in each draft while the party has none;
    - snake packs that never grow, two to an act I fight;
    - no fight twice in an act;
    - ordinary offers always wearable, and trophies always aimed at the party;
    - fallen members replaced from camp;
    - repeatable training;
    - abilities that can be left out;
    - level-ups that offer learning or upgrading;
    - recruits that lean toward a class a bagged legendary is for.

## 3. What the numbers say

2,000 runs of the simulated player at heat 0, then 1,000 for each variant (300 a leader), on the merged, harder build. A rate is good to about ±2 points; differences under 3 points are noise.

| | |
| --- | --- |
| Runs won | 21% |
| Runs ended by a boss (acts I, II, III) | 22%, 25%, 15% |
| Runs ended in an act's regular fights and elites | 6%, 7%, 4% |
| Bosses end the runs that reach them | 23%, 38%, 41% |
| Party HP on arriving at a boss | 84% to 85% |
| HP a won fight costs (points of party HP) | regular 11, elite 17, boss 37 |
| Fights started above 80% party HP | 69% |
| A regular fight or elite lost, by HP brought | under 40%: 47%; 40% to 60%: 10%; 60% to 80%: 2% |
| Fights a run (a boss included); elites a run | 10.7; 2.8 |
| Gold earned, spent | 483, 351 |
| Legendary pieces the final party wears | 2.0 |

**What each decision is worth.** The same 1,000 runs, with the simulated player picking at random at one kind of decision:

| Decision made at random | Runs won | Cost |
| --- | --- | --- |
| None (the simulated player) | 21% | |
| Spoils and the boss's boon | 8% | 13 |
| The draft | 11% | 10 |
| The campfire (rest, focus, raise, train) | 11% | 10 |
| The route | 13% | 8 |
| The shop | 15% | 6 |
| Which ability to learn or upgrade | 19% | 2 |
| Events | 20% | 1 |
| No gear at all beyond the plain weapon | 0% | |

At 21% every cost is smaller in points than at 38%, but larger as a share: a random pick at spoils now loses more than half the wins.

**Elites:** avoiding them 17%, taking them when healthy 21%, seeking every one 22%. Taking them pays 4 points.

**What a reward is worth**, handed over at the start: three legendary pieces +16 points, three rares +8, 150 gold +5.

**The rules added from the playtests:** without stand-ins from camp 21%, with training once a visit 20%. Both are within noise: they're about fairness and gold, not balance.

**The power curve:** if every class joined knowing all three abilities, 43% won (+22). Learning is the run's biggest source of growth, then gear.

**Heat** (+4 a level): 17%, 12%, 10%, 6%, 3% and 2% at heats 1, 2, 3, 5, 7 and 10.

**How sure:** the order of the decision costs and of the class table held across every complete pass (`tuning.md`, rounds 18, 21, 28, 30, 32, 34 and 36); their sizes move with the win rate. Every number here is the simulated player's. The playtesters (section 4) are the human-like check, and they played the earlier, easier build.

## 4. Feel: twelve AI playtests

Twelve fresh agents played the rogue mode from a command line that shows only what a player sees, three runs each, about half an hour a player. Every round paired a careful first-timer with an experienced roguelite player, and each round played the build the last round's fixes made. The last three rounds rated wanting another run at 7, 7, 6, 6, 6 and 6 out of 10: "the map, the boss forecast and the legendary hunting pulled me forward, and every boss fight was close"; "the fork, build and gear loop is good and run 3 felt earned"; and against: "fights are hands-off", "two of my three runs were decided by a squishy dying in the boss's first seconds".

**What they liked, every round:**
- the Slay the Spire map with the boss shown from the start;
- the region fork that hints at what counters what;
- the campfire bench ("the best system in the game", "feels like Darkest Dungeon");
- HP that carries over, which makes routing tense;
- synergies found through targeting rules ("foe with the most Sunder/Burn").

**Their best moments:**
- "The Knight alone finishing the Glacier King at t104, after Valhalla dragged the Assassin back."
- "The Knight surviving the Packmaster on 30 HP."
- "The Silent One silenced us twice, and thorns, crits and Sunder (103 stacks) still ground it down."
- "Benching Burning fist against the fire-absorbing Giant felt like real play."
- The Hexer's Hush interrupting Inferno for a clean win, planned from the boss preview.
- "Ogre Chief is stunned: Crush has to wait", then a kill at t33.
- "The Glacier King: the Assassin alone, the Bulwark BROKEN, a win at t103 with 812 HP left."
- "Picking the Deep Crypt because 'power that isn't an ability is the key', then beating the Silent One with an un-Silenceable Cleric and Rime-sigil basic attacks."
- "Buying the Valkyrie to break the Ice Titan's Bulwark, and watching it work."
- "The 26,250 Fire arrow on the same Golem Gate that had killed run 1: Burn piled up, the arrow found it."

**What they asked for, and what happened:**

| Asked for | Rounds | Done |
| --- | --- | --- |
| See the foes before committing the party | 1 | Yes, with moves, targets and sizes by round 3 |
| Deaths that explain themselves | 1, 2 | Killing blows, damage by kind, who laid a status, how each foe fell |
| Recruits who reach the party | 1, 2 | A campfire mid-act on every path; fallen members replaced from camp |
| Legendaries that say what they do, and who they're for | 1, 3 | Rules shown; FOR on every card; trophies aimed at the party |
| Something to spend gold on | 2 | Repeatable training at rising prices |
| Numbers: ability sizes, upgrades, HP moved by gear | 2 | Shown |
| Turn an ability off | 2, 3 | Yes |
| The boss before the last swap | 2 | BOSS on the map and at every campfire; each way's boss at the fork |
| Fights long enough for builds to show | 1, 2 | Regular fights about 37 ticks, slots firing twice as often |
| Legendaries that define a build | 2, 3 | The rogue's own pieces lifted (section 1B); the core set's left to you |
| Enemy intent inside a fight; foe HP numbers | 3 | Not done: fights are automatic and foe stats stay hidden by the core set's rule. The preview's sizes and targets are the substitute. |
| Healthy members at camp to step in | 2, 3, 4, 5 | The fallen replaced between rooms; empty seats filled; the reserves after a wipe on the road (a boss lost still ends the run, round 6) |
| HP and MP gear not acting as a heal | 1, 3, 5, 6 | Gear changes max, never current |
| A healer in reach | 3, 5 | Each draft offers one while the party has none |
| Swaps after a campfire's pick | 4 | Open until LEAVE |
| A smaller free rest for the bench | 2, 4 | Half a REST and half a FOCUS |
| Act I swarms less run-ending | 3, 4 | Snake packs never grow; act I's hold two |
| MP that matters for martial classes | 2, 3, 4 | Not done: the class pass |
| A danger rating or fight timeline | 3, 4, 5 | Not done: previews show moves, targets and sizes; the summary names killing blows |
| Answers to a boss's opening seconds (a squishy dead before the Taunt is up) | 5 | Not done: how fights open is the core set's (5c's slotted head starts); see below |
| Supplies at the moment of a wipe | 4, 5 | Not done: supplies are used between rooms by design; a phoenix now pairs with the empty-seat rule |
| No level-up with a single option | 2, 4, 5 | A level-up can be taken as 40 gold instead |

**What they found broken, and fixed:**
- two refill exploits;
- an event cost that never applied;
- a status's killing blow blamed on its holder ("doom from Valkyrie");
- the same legendary twice;
- a trophy nobody could use well;
- command-line slips (a space in `order` left abilities out silently);
- a campfire's pick that closed the swap window;
- gambles that didn't say how they went.

## 5. Method notes

- **Calibrate each piece, then correct the whole.** Measuring every fight against snapshots of real parties gave each one a sane knob in under a minute. Only whole runs showed the bias: a boss is met by parties shaped by its own region, and a knob's effect on Inferno is steep. A damped correction loop on whole runs (three rounds of 2,000) fixed what the per-fight measure couldn't. Either alone would have been wrong.
- **Price every decision by making it at random.** One table answered "do the choices matter". It found the fake ones (events, which ability to learn) that a design review would have praised.
- **Price a reward by giving it away, against a zero point.** Gifts at the start showed the core set's powerful pieces were sidegrades and that the simulated player hoarded gold. Locking each legendary on for the whole run, against an ordinary piece locked the same way, showed most rules were worth less than plain stats. Without the zero point, every piece read as negative.
- **Playtests found what simulation can't.**
  - Three exploits, an event cost that never applied, a hidden encounter making gear a guess, deaths nobody could explain, and a run lost with healthy members at camp.
  - None of these move a win rate much, and all of them make a game feel broken.
  - Three rounds of two playtesters, each round on the previous round's fixes, ran beside the tuning.
  - The same complaint from two players in different rounds was the strongest signal.
- **Measure before adding a rule.** The boss lock-out looked general in two playtests; the logs said it needs a specific pair of classes, so no rule was added.
- **Isolating a playtester:** the agents' own worktrees came from `main`, which has no rogue mode. A frozen checkout of one commit (`git worktree add` plus a link to `node_modules`) worked.
