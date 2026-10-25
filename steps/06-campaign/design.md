# Step 6 design: the campaign

The core set as a road to walk instead of a sandbox. Written and built in one overnight session, at the director's request ("don't be afraid to make decisions"), so this design never had its own gate: the report is where the director first reacts to it, and everything here is open to change.

## The shape

- **A road of 20 nodes**, cleared one at a time. The player starts with the Knight, Cleric and Ranger, their plain weapons, the Neutral formation and node 1. Clearing a node (winning its whole run) pays its reward once and reveals the next node; nothing else does. Cleared nodes can be replayed for nothing.
- **Three kinds of node**, all built from the core set's enemies and rules:
  - **Runs (7):** the enemies document's seven dungeons, in order: nodes 1, 4, 7, 10, 13, 16 and 19.
  - **Remixes (3):** new runs from the same enemies, unlocked like any node: *The Road at Night* (the Old Road after dark, the chief with his brother), *The Royal Court* (the Storm King and Queen together) and, for the record, the remixed fights inside every trial.
  - **Trials (10):** runs with **needs**, things the party must be, never things it can't: "Bring the Pyromancer", "Bring the Knight and Hoplite; stand in Escort", "Everyone in heavy armor", "Stand in Caravan". A trial can also change its foes ("every foe starts each fight Hasted"). The party screen shows each need met or unmet, and START waits until all are met.
- **Two of the same boss:** *The Ogre Brothers* (two Ogre Chiefs), and *The Royal Court* (the King and Queen at once).

## The route

The unlock order follows one rule: **a new class arrives just before the content it shines in, and the next node asks for it.** The Pyromancer arrives before the hill swarms and the Ghoul Pit; the Hoplite before the Reaper and the Ogre Brothers; the Frostweaver before the Fire Mine's deep halls; the Valkyrie before the Ice Titan; the Stormcaller, Bramble knight and Assassin before the Storm Tower; the Bard and Vampire before the Deep Crypt. The trial after an unlock says "bring it", so every unlock is used at least once, on content made for it.

| # | Node | Kind | Needs | Pays |
| --- | --- | --- | --- | --- |
| 1 | The Old Road | run | – | Vanguard; Plate, Robes, Brigandine |
| 2 | The Road at Night | remix | – | **Pyromancer**; Brand staff, Heartstone, Warbow |
| 3 | Wildfire | trial | Pyromancer | **Hoplite**; Oathblade, Prayer beads |
| 4 | The Crypt | run | – | **Monk**; Sunstaff, Bastion plate, Fang |
| 5 | The Ossuary | trial | Monk | Escort; Paired cestus, Scout leathers, Mana jewel |
| 6 | The Ogre Brothers | trial | Knight, Hoplite, Escort | **Hexer**; Rime staff, Hawk's eye, Vestments |
| 7 | The Fire Mine | run | – | **Frostweaver**; Hoarfrost staff, Ashen plate, Mountain charm |
| 8 | Deep Freeze | trial | Frostweaver | **Geomancer**; Granite staff, Lucky coin, Tower mail, Glacier staff★ |
| 9 | Iron Wall | trial | heavy armor | **Valkyrie**; Skyspear, Chapel staff, Rune axe, Cornerstone axe★ |
| 10 | The Ice Pass | run | – | Scatter; Pike, Sentinel spear, Tiger claws, Feather charm, Longbow |
| 11 | Valhalla | trial | Valkyrie | **Stormcaller**; Storm rod, Wind staff, Quiet cloak, Wraith leathers★ |
| 12 | The Wild Hunt | trial | Stormcaller; foes Hasted | **Bramble knight**; Rootstaff, Thorn mail, Thorn charm |
| 13 | The Storm Tower | run | – | **Assassin**; Bodkin, Stiletto, Tracker's jerkin, Thornheart plate★ |
| 14 | Knives Out | trial | Assassin | Caravan; Duellist's sword, Zephyr and Tailwind staffs, Mana leech, Glass heart★ |
| 15 | The Long Road | trial | Caravan; seven fights | **Bard**; Minstrel's bow, Shadowsilk, Twinned charm, Warhorn, Twin-soul charm★ |
| 16 | The Deep Crypt | run | – | **Vampire**; Bloodied claws, Bloodstone, Duskhide, Dark staff, Nightstaff |
| 17 | Blood Moon | trial | Vampire | **Paladin**, Blitz; Crusader sword, Warden's blade, Sun and Moon charms, Vampire's tooth★, Sanguine staff★ |
| 18 | Judgement | trial | Paladin | Ambush, Tortoise; Dawn staff, Scale coat, Serrated charm, Veil, Templar staff★, Needle★ |
| 19 | The Tower Top | run | – | Last stand, Champion; the rest of the gear |
| 20 | The Royal Court | remix | – | the end |

★ is a powerful piece. Every class, formation and piece of gear is paid exactly once.

**Vertical progression** comes from three places. Gear fills empty slots: a class arrives with a plain weapon and nothing else, and the road pays 3 to 6 pieces a node, so the starting trio wears full kits by node 4. New classes widen what a party can answer. Formations come one every few nodes. Whether that's enough to keep the party changing is measured (the "carry" number below) rather than assumed.

## Making it beatable, and hard: one knob per node

Each node has one difficulty knob, **k**: its foes deal k% more damage and have k/2 % more HP (negative k makes them weaker). Because the route is fixed, the simulation knows exactly what the player owns at every node, and a tuner sets k so that **the best build the search can find wins about 85% of first tries**. The knob lives in `content/core-set/campaign-knobs.json`; the node's own foe changes (Hasted) sit on top of it.

The simulation (`npm run campaign`, `src/campaign-sim.ts`): for each node, every party of three the node allows from what's owned, in every owned formation (or the one it needs), each in three kit styles (plain, sturdy, sharp) picked from the owned gear by what each class's kit multiplies (`src/sim/kits.ts`), with the formation's slots handed out the same way. Up to 360 builds are screened on 6 seeds; the best 20 get 18 more; a climb of 48 small changes (swap a class, a formation, a seat, a piece of gear, an ability order) starts from the best three; the winner is scored on 48 fresh seeds. A node takes a few thousand runs and about five seconds.

What each node reports:

- **best:** the best build's first-try win rate. Target 85%.
- **win½:** the share of screened builds that win at least half their runs: how many solutions there are.
- **median:** the median screened build: what a random sensible party does.
- **carry:** the previous node's best party, kept as far as the needs allow and re-kitted from what's owned now: whether the player has to change anything.
- **new in top10:** how often the newest unlock is in the ten best builds: whether the reward matters.

## Rules and numbers changed for the campaign

The director's three complaints (too easy; Burn never stacks; Poison does 1) and two open questions from the core set's report:

- **Burn** loses a tenth of its stacks a pulse, not a quarter, and each stack burns for 20, not 50. It now builds over a fight (a Pyromancer keeps 15 to 25 on its target) and lingers when the burning stops. At a quarter, an application of 6 was down to 2 within six ticks, which is what the director saw.
- **Poison** deals 160 a pulse for 12 ticks, not 90 for 10: about a third of a caster's HP per application, and 2 on screen instead of 1.
- **HP on gear and formations** is half a point a step, not a whole one. Heartstone doubled a caster's HP (and its Regen and Shield cap); HP everywhere was every class's best kit.
- **Inferno** hits for 0.35 × Magic, not 0.5: "nearly wipes", as the enemies document says, instead of always wiping.
- **A lost cast goes on cooldown** (the core set report's decisions A and E): an action interrupted in its wind-up, or whose targets are gone when it resolves, spends no MP but goes on cooldown, as a cast that fizzles for MP already did. A Stun in Inferno's wind-up now buys a whole cooldown instead of a few ticks, and two Ghouls reaching for one corpse no longer loop. It's a ruleset setting (`lostCast`), so the worked example keeps the old rule.
- **Engine:** a dungeon can carry a change to every foe (`foes`: HP %, damage %, statuses at fight start), applied to summons too, through a new `power` stat that only foes use. Engine 0.7.

## Predictions

- Every node's best build wins 75% to 95% after tuning; the knob rises along the road as gear accumulates.
- Most nodes have several solutions (win½ above 10%), and the trials fewer than the runs.
- The carry party fails most trials (they ask for something new) and does middling on runs.
- The newest class is in most top-10 lists of the trial that asks for it, by construction, and in some of the run after it.

## Open questions for the director

Listed in the report, with the numbers.
