# Step 6 design: the campaign

The core set as a road to walk instead of a sandbox. Written and built in one overnight session, at the director's request ("don't be afraid to make decisions"), so this design never had its own gate: the report is where the director first reacts to it. It describes the road as it stands after tuning; `tuning.md` has how it got there.

## The shape

- **A road of 20 nodes**, cleared one at a time. The player starts with the Knight, Cleric and Ranger, their plain weapons, the Neutral formation and node 1. Clearing a node (winning its whole run) pays its reward once and reveals the next node; nothing else does. Cleared nodes can be replayed for nothing.
- **Three kinds of node**, all built from the core set's enemies and rules:
  - **Runs (7):** the enemies document's seven dungeons, in order: nodes 1, 4, 7, 10, 13, 16 and 19.
  - **Remixes (2):** new runs from the same enemies with no needs: *The Road at Night* (the Old Road after dark, the chief with his brother) and *The Royal Court* (the Storm King and Queen together), the finale.
  - **Trials (11):** runs with **needs**, things the party must be, never things it can't: "Bring the Pyromancer", "Bring the Vampire and the Bard; pick your third", "Bring the Knight and Hoplite; stand in Escort", "Everyone in heavy armor", "Stand in Caravan". One also changes its foes ("every foe starts each fight Hasted"). The node's page checks each need against the party, and START waits until all are met.
- **Two of the same boss:** *The Ogre Brothers* (two Ogre Chiefs), and *The Royal Court* (the King and Queen at once).

## The route

The unlock order follows one rule: **a new class arrives just before the content it shines in, and the next node asks for it.** The Pyromancer arrives before the hill swarms and the Ghoul Pit; the Hoplite before the Reaper and the Ogre Brothers; the Hexer and Frostweaver before the Fire Mine; the Valkyrie before the Ice Titan; the Stormcaller, Bramble knight and Assassin before the Storm Tower; the Bard and Vampire before the Deep Crypt. The trial after an unlock says "bring it", so every unlock is used at least once, on content made for it. Three trials ask for two things at once, so the party can't stay as it was.

| # | Node | Kind | Needs | Pays |
| --- | --- | --- | --- | --- |
| 1 | The Old Road | run | – | Vanguard; Plate, Robes, Brigandine |
| 2 | The Road at Night | remix | – | **Pyromancer**; Brand staff, Veil, Heartstone, Warbow |
| 3 | Wildfire | trial | Pyromancer | **Hoplite**; Oathblade, Prayer beads |
| 4 | The Crypt | run | – | **Monk**; Sunstaff, Bastion plate, Fang |
| 5 | The Ossuary | trial | Monk | Escort; Paired cestus, Scout leathers, Shadowsilk, Mana jewel |
| 6 | The Ogre Brothers | trial | Knight and Hoplite; Escort | **Hexer**; Rime staff, Hawk's eye, Vestments |
| 7 | The Fire Mine | run | – | **Frostweaver**; Hoarfrost staff, Ashen plate, Mountain charm |
| 8 | Deep Freeze | trial | Frostweaver | **Geomancer**, Blitz; Granite staff, Lucky coin, Tower mail, Glacier staff★ |
| 9 | Iron Wall | trial | heavy armor | **Valkyrie**; Skyspear, Chapel staff, Rune axe, Cornerstone axe★ |
| 10 | The Ice Pass | run | – | Scatter; Pike, Sentinel spear, Tiger claws, Feather charm, Longbow |
| 11 | Valhalla | trial | Valkyrie | **Stormcaller**, Ambush; Storm rod, Wind staff, Quiet cloak, Wraith leathers★ |
| 12 | The Wild Hunt | trial | Stormcaller; Scatter; foes Hasted | **Bramble knight**; Rootstaff, Thorn mail, Thorn charm |
| 13 | The Storm Tower | run | – | **Assassin**, Tortoise; Bodkin, Stiletto, Tracker's jerkin, Thornheart plate★ |
| 14 | Knives Out | trial | Assassin | Caravan; Duellist's sword, Zephyr and Tailwind staffs, Mana leech, Glass heart★ |
| 15 | The Long Road | trial | Caravan; seven fights | **Bard**; Minstrel's bow, Twinned charm, Warhorn, Twin-soul charm★ |
| 16 | The Deep Crypt | run | – | **Vampire**, Last stand; Bloodied claws, Bloodstone, Duskhide, Dark staff, Nightstaff |
| 17 | Blood Moon | trial | Vampire and Bard | **Paladin**, Champion; Crusader sword, Warden's blade, Sun and Moon charms, Vampire's tooth★, Sanguine staff★ |
| 18 | Judgement | trial | Paladin and Hexer | Dawn staff, Scale coat, Serrated charm, Templar staff★, Needle★ |
| 19 | The Tower Top | run | – | the rest of the gear |
| 20 | The Royal Court | remix | – | the end |

★ is a powerful piece. Every class, formation and piece of gear is paid exactly once. A new class's plain weapon comes with it.

**Vertical progression** comes from three places: gear fills empty slots (a class arrives with a plain weapon and nothing else), new classes widen what a party can answer, and formations arrive every two or three nodes. The report measures how far each carries.

## Making it beatable, and hard: one knob per node

Each node has one difficulty knob, **k**: its foes have k% more HP and deal k/2 % more damage (a negative k takes k% off both). Because the route is fixed, the simulation knows exactly what the player owns at every node, and the tuner sets k for each node. The knob is the designer's: it's enemy stats, so the player never sees it. It lives in `content/core-set/campaign-knobs.json`; a node's own foe changes (Hasted) sit on top of it.

**The target**, per node, is two conditions at once, and k is the hardest setting that meets both: **the best builds win at least 85% of first tries**, and **a share of the node's sensible builds win at least half their runs**. The share is a ramp: 30% on nodes 1 to 3 (they teach), 12% on 4 to 9, 8% on 10 to 17, 6% on the last three. It started at a fifth everywhere; the AI playtest showed a thoughtful player always lands in the top fifth, so that was too easy (`tuning.md`, rounds 10 and 13).

The simulation (`npm run campaign`, `src/campaign-sim.ts`): for each node, every party of three the node allows from what's owned, in every owned formation (or the one it needs), each in three kit styles (plain, sturdy, sharp) picked from the owned gear by what each class's kit multiplies (`src/sim/kits.ts`), with the formation's slots handed out the same way. Up to 360 builds are screened on 6 seeds; the best 20 get 18 more; a climb of 48 small changes (swap a class, a formation, a seat, a piece of gear, an ability order) starts from the best three; the winner is scored on 48 fresh seeds. A node takes a few thousand runs and a few seconds; tuning the whole road takes about 15 minutes on 4 cores.

Its other modes: `--effects` (what each class and formation adds to a build's wins, node by node), `--power` (how much tougher an Old Road a party clears, node by node), `--feel` (reading packs for a fresh reader), `--set path=value` (a what-if), and `src/campaign-play.ts`, the game as a command line, for an AI playtester.

## Rules and numbers changed for the campaign

The director's three complaints (too easy; Burn never stacks; Poison does 1), two open questions from the core set's report, and what the simulation and the playtests found:

- **Burn** loses a tenth of its stacks a pulse (was a quarter), at 30 a stack (was 50). It builds over a fight and lingers when the burning stops.
- **Poison** deals 160 a pulse for 12 ticks (was 90 for 10).
- **Shock** stops at 25 stacks (no cap before; a slow boss gathered 100).
- **HP on gear and formations** is half a point a step (was a whole point).
- **Inferno** hits for 0.35 × Magic (was 0.5).
- **A lost cast:** an action interrupted in its wind-up spends no MP but goes on cooldown; one whose targets are gone costs the unit its recovery (the core-set report's decisions A and E). It's a ruleset setting (`lostCast`), so the worked example keeps the old rule.
- **Classes:** Gale spear 0.1 × Attack a hit (was 0.2), Rally 0.3 × Magic (was 0.6), War ballad many Might (was several), Fireball a normal hit (was light), Blizzard 0.3 × Magic (was 0.2), Mercy three quarters of a hit (was half), Fire arrow a heavy hit (was normal).
- **Formations:** Escort's two slots lose HP +1; Scatter's Decoy is Armor −1 (was −2).
- **Engine 0.7:** a dungeon can carry a change to every foe (`foes`: HP %, damage % through a new `power` stat, statuses at fight start), applied to summons too; `ruleset.run.restore` (a share of HP and MP back after a won fight) exists for pricing the no-rest rule and is off.

## Predictions, checked in the report

- Every node's best build wins 85% or more, and the share of viable builds follows the ramp.
- A thoughtful player clears most nodes in two to four tries, and the trials that ask for two things change the party.
- The newest class is in most top-10 lists of the trial that asks for it (by construction) and in some of the run after it.
