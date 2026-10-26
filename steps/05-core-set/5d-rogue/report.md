# Step 5d report: a rogue mode

You asked for a third mode, beside the journey and free play: the core set as a roguelite, on Slay the Spire's structure, built and tuned overnight. It's built, tuned by simulation, playtested by four AI players, and on this branch (`ccr-9e0c2cb1-in0wcs`, branched from the campaign branch). This report leads with what needs you. `design.md` has the mode in full, `intent.md` your words, and `tuning.md` the 22 rounds.

**To play it:** `npm install`, then `npm run ui`, and open the address it prints (on a phone on the same Wi-Fi, the Network address). Settings → MODE → ROGUE, then ROGUE on the home menu. Pick a leader, take two companions, and climb. Tap a lit room on the map to see what it is, then ENTER. When you enter a fight you see the foes first: change gear (PARTY), then FIGHT. The journey and free play are untouched.

**In one paragraph.** A run is three acts. Each act is a Slay the Spire map of nine floors through a themed region (the Old Road, then a pick of two from the Crypt, the Fire Mine and the Ice Pass, then from the Storm Tower, the Deep Crypt and the Tower Top), with its boss shown from the start. You lead with a class you own, draft two companions from all sixteen, and grow: classes join knowing one ability and learn the rest (campfires, tomes, the shop, a level-up after each boss); gear comes in four rarities built on the core set's pieces (affixes, and 43 legendary pieces that bend a rule); formations, recruits and supplies come from spoils, elites, bosses, chests, the shop and twelve events. HP, MP and knockouts carry from fight to fight. A won run adds its party to the classes you can lead with.

## 1. Decisions and open questions

### A. The shape I chose: confirm or change

- **The start: a leader you own, then two companions drafted from all sixteen** (pick one of three, twice). Your words were "start by selecting a class out of the ones that you own". I read that as the leader, not the whole party, so every run has a full party from the first fight and every class can turn up in your first run. The meta still bites, since a won run's party becomes leaders. **The alternative** is the whole party from owned classes: every early run would then be the Knight, Cleric and Ranger.
- **Abilities, one at a time: the run's biggest power curve.** A class joins knowing one ability, one more for each act reached, and learns the rest at campfires (TRAIN), from tomes, at the shop and at the level-up after each boss. Priced: if every class joined knowing all three, the simulated player would win **64% of runs instead of 43%**. Learning is worth more than every legendary piece in a run put together. I kept **no experience levels**: the level-up after each boss (learn one, or make one better) does the job with a choice.
- **Fights are shown before they start.** Entering a fight room shows the foes (what they are, what they hit with, what they resist), and the party can still be re-geared, re-seated and re-ordered. Once the fight begins it's set, and leaving replays it from its start, the same way. Both of the first playtesters asked for this ("gear is a blind guess"). It fits the core set's "preparation is the game". **Say if you want the blind version back.**
- **Swaps only at campfires, as you asked; so every way up an act now passes a campfire mid-act.** Before, recruits waited at camp all act (the playtesters picked up a Monk on floor 3 and never fielded it).
- **Elites: Slay the Spire's relic.** An elite pays a legendary piece outright (the trophy), 50 to 65 gold and a pick of three rares. Without the trophy, avoiding elites won more runs than taking them. Now taking them when healthy wins 43% against 41% for avoiding them, and seeking every one 44%: they pay a little, and the tuning around them puts the risk in the bosses, not the elites.
- **Legendary pieces carry two affixes on top of their rule.** The core set's powerful pieces are sidegrades by its own rule ("a different build, never a pure upgrade"). In a run, three of them were worth a third of three rares. Now three legendaries at the start are worth +13 points of wins and three rares +12.

### B. Classes: the roguelite makes the spread visible, and it's wide

Each class as leader with two random companions (300 runs each; the run's average is lower than 40% because the companions are random):

| Wins | Classes |
| --- | --- |
| 48%, 37% | Vampire, Monk |
| 31% to 23% | Knight 31, Valkyrie 28, Bramble knight 25, Ranger 23 |
| 21% to 15% | Stormcaller 21, Paladin 20, Cleric 19, Assassin 17, Geomancer 17, Pyromancer 15, Frostweaver 15 |
| 14% to 8% | Hoplite 14, Hexer 10, Bard 8 |

- **Why the top is the top: attrition rewards sustain.** HP carries over, so lifesteal heals HP that would otherwise need a campfire. The Vampire (Lifesteal high, doubled below half HP) and the Monk (fast hits, cheap MP, a Stun) were the playtesters' "mandatory" classes too, and "Knight wall plus Assassin carry" was the reliable pattern. With Blood drain as its first ability the Vampire won 37% when the next best class won 20%. **I start it with Wither instead**, the rogue mode's one class-specific choice.
- **Why the bottom is the bottom: the kit, not the start.**
  - The Bard's first ability is War ballad and the Hexer's is Enfeeble: a buff and a debuff, no damage. They die in act I (the Bard reaches act II in a third of its runs).
  - I tested a rule of this mode for them: the weakest eight join knowing two abilities. It moves none of them by more than 4 points (the Bard 9%, the Hexer 10%), and no other starting ability lifts them either.
  - Their trouble is the class itself.
- **My proposal:** the class pass the 5c report proposed (casters' survival, the Vampire, the Knight), now with a second measuring stick. In a draft, a class that wins 8% is a class nobody takes, and a roguelite lives on variety.

### C. Attrition: HP yes, MP mostly not

- **HP is the resource the run turns on.** The campfire is the most valuable decision in the game: picking at random there costs 29 points of wins (REST, FOCUS, RAISE or TRAIN). The route costs 9 points and the spoils 25. A party that enters a regular fight or elite below 40% HP loses 68% of the time; at 60% to 80%, 3%.
- **But most fights start healthy.** 72% of fights start above 80% party HP. Healers and lifesteal top the party up inside fights, and a campfire waits right before each boss, so **bosses test the build, not the HP left**. Bosses end 38% of runs, elites and regular fights 20%.
- **MP rarely binds.** Parties start a fight with about 90% of their MP, below 40% in 1% of fights. The simulated player avoids the casters, the weakest classes, and the playtesters found MP mattered only for the Cleric. FOCUS is almost never the right pick. It's the class pass's question again, not a rule of this mode.
- **Short fights.** An experienced playtester: "fights last 14 to 35 ticks and cooldowns are 22 to 47, so slots 2 and 3 fire once or not at all". Ability order matters for the first slot and little after. The 5b and 5c pacing passes set this; the roguelite's early acts make it starker.

### D. Difficulty, and heat

- **The simulated player wins 43% of runs at heat 0.** It's a rules-of-thumb player that equips by stat weights and drafts by measured class values; it's no search. Bosses beat 11%, 19% and 21% of the parties that reach them (acts I to III); regular fights and elites end 6% to 12% of the runs that enter a region.
- **The AI playtesters:** [ROUND 1 AND 2 RESULTS]
- **Heat:** a won run opens the next level, each +5 on every knob, about 6 points of the simulated player's wins a level (37%, 30%, 23% and 13% at heats 1, 2, 3 and 5). **Say if heat 0 should be harder or easier.** The targets are one line in `src/rogue-calibrate.ts` and `src/rogue-tune.ts`.

### E. Smaller calls you may want to change

- **Bomb Bugs, at most two to a fight.** Their document says "three together wipe", and a roguelite party can't be built for one fight. They never grow late.
- **Events are flavour more than decisions.** Picking at random wins as often as the simulated player's picks. I'd add stakes when there's content input from you.
- **Level-ups are close to flavour too.** Which ability to learn first costs nothing at random, because by act III everyone knows all three.
- **Boss signature moves can be stunned away.** The Fire Giant's Inferno "never landed" in two playtests (stuns and silences take it). The 5b boss pass is still open.

## 2. What was built

- **The mode, in the interface:** a third MODE beside the journey and free play. Its screens:
  - the leader pick (and heat, once won) and the draft;
  - the map, Slay the Spire's: icons per room, the walked path in gold, the rooms you can reach pulsing, the boss crowned at the top;
  - a fight's preview (the foes, what they hit with and resist), then the battle screen as it is, with the party's HP and MP carried in;
  - spoils, boon and chest cards (rarity by colour and a glow on the art, the legendary's rule, who a piece fits or "NOBODY CAN USE IT YET");
  - the shop (BUY, TRAIN, SELL), the campfire (REST, TRAIN, SWAP), events, level-ups, the fork and the end;
  - the party, unit sheet and gear picker on the run's items;
  - a celebration when a won run unlocks leaders.
  
  The run is saved after every step. `ui/README.md` has the screens.
- **Content** (`content/core-set/rogue.ts`, the pack's `rogue` block, checked by the schema and the validator):
  - seven regions with 100 fights between them (easy, regular, elite, boss);
  - 29 new legendary pieces and the 27 statuses behind them;
  - 20 affixes and 12 events;
  - every number, and each fight's knob in `rogue-knobs.json`.
  
  Nothing in the core set's classes, gear, formations or enemies changed.
- **Rules** (`src/rogue.ts`): the run as plain data, moved one decision at a time. It's pure and deterministic, so the same seed and the same choices make the same run.
- **Tools:**
  - `npm run rogue`: whole runs with the simulated player, a digest, and what-ifs (`--dials` noise, greed or no gear; `--gift`; `--heat`; `--set` to patch the pack; `--diary` to read one run).
  - `npm run rogue:calibrate`: each fight measured against snapshots of real parties.
  - `npm run rogue:tune`: whole runs correct each boss and region.
  - `npx tsx src/rogue-play.ts`: the AI playtester's game.
  - Tests in `src/rogue.test.ts`.
- **One engine change, to the log only:** each damage entry names its kind (an element, physical or untyped), so a fight summary can break down damage taken. Outcomes are unchanged.
- **Fixed from the first two playtests:**
  - foes shown before a fight;
  - no refills from swapping gear (an MP exploit);
  - an event's costs before its choices (the Old Master's HP cost never applied);
  - options that can't happen greyed out;
  - a mid-act campfire on every path, and two shops an act;
  - no fight twice in an act, and no two of the same piece in one offer;
  - ordinary offers always wearable;
  - legendaries' rules printed;
  - level-ups that offer learning or upgrading, and upgrades that say what they change;
  - fight summaries that name the killing blow and break down damage taken by kind;
  - a living foe never shown at 0%;
  - the Gambler at a slight edge, and a second choice at the Empty Camp.

## 3. What the numbers say

2,000 runs of the simulated player at heat 0, then 1,000 for each variant. A rate is good to about ±2 points; differences under 3 points are noise.

| | |
| --- | --- |
| Runs won | 43% |
| Runs ended by a boss (acts I, II, III) | 11%, 15%, 12% |
| Runs ended in an act's regular fights and elites | 5%, 8%, 7% |
| Bosses beat the parties that reach them | 11%, 19%, 21% |
| Party HP on arriving at a boss | 87% to 89% |
| Fights a run (a boss included); elites a run | 12.3; 3.3 |
| Gold earned, spent | 612, 420 |
| Legendary pieces the final party wears | 1.9 |

**What each decision is worth.** The same 1,000 runs, with the simulated player picking at random at one kind of decision:

| Decision made at random | Runs won | Cost |
| --- | --- | --- |
| None (the simulated player) | 43% | |
| The campfire (rest, focus, raise, train) | 14% | 29 |
| Spoils and the boss's boon | 18% | 25 |
| The draft | 24% | 19 |
| The route | 34% | 9 |
| The shop | 37% | 6 |
| Events | 43% | 0 |
| Which ability to learn or upgrade | 41% | 2 |
| No gear at all beyond the plain weapon | 0% | |

**What a reward is worth**, handed over at the start: three legendary pieces +13 points, three rares +12, 150 gold +9.

**Elites:** avoiding them 41%, taking them when healthy 43%, seeking every one 44%. They pay a little now; before the trophy, avoiding them won more.

**The power curve:** if every class joined knowing all three abilities, 64% won (+21). Learning is the run's biggest source of growth, then gear.

**Heat:** 37%, 30%, 23% and 13% at heats 1, 2, 3 and 5.

**How sure:** the class table and the decision costs held across two complete passes (the first at 40% won, `tuning.md` rounds 18 and 21) within 3 points. Every number here is the simulated player's. The playtesters (section 4) are the human-like check.

## 4. Feel: four AI playtests

[FILLED BELOW]

## 5. Method notes

- **Calibrate each piece, then correct the whole.** Measuring every fight against snapshots of real parties gave each one a sane knob in under a minute. Only whole runs showed the bias: a boss is met by parties shaped by its own region, and a knob's effect on Inferno is steep. A damped correction loop on whole runs (three rounds of 2,000) fixed what the per-fight measure couldn't. Either alone would have been wrong.
- **Price every decision by making it at random.** One table answered "do the choices matter", and it found the fake ones (events, which ability to learn) that a design review would have praised.
- **Gifts price rewards.** Handing a run three legendaries, three rares or 150 gold at the start showed at once that the core set's powerful pieces were sidegrades and that the simulated player hoarded gold. Both were fixed the same hour.
- **Playtests found what simulation can't.** A refill exploit, an event cost that never applied, a hidden encounter making gear a guess, and deaths nobody could explain. None of these move a win rate much, and all of them make a game feel broken. Four playtesters on two versions, at about half an hour each, ran beside the tuning.
- **Isolating a playtester:** the agents' own worktrees came from `main`, which has no rogue mode. One playtester ran in my working copy while I changed it. The second round used a frozen checkout of one commit (`git worktree add` plus a link to `node_modules`), which worked.
