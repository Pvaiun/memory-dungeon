# The campaign: report

You asked for the core set as a game to beat: start with the starters and the first run, unlock everything one node at a time, with remixes and trials that set needs on the party, balanced by simulation. It's built, tuned, playtested by AI five times, and on this branch. This report leads with what needs you; `design.md` beside it has the road in full, `intent.md` your words, and `tuning.md` the trail.

**To play it:** `npm install`, then `npm run ui`, and open the address it prints (on a phone on the same Wi-Fi, the Network address). GitHub Pages only publishes `main`, so the published app is still the old version. The game opens on the journey. Your old setup is kept as free play: Settings → MODE → FREE PLAY brings back the everything-available sandbox, with its own party. Settings → RESET JOURNEY starts the road over; with DESIGNER on, CLEAR NEXT skips a node. **Two tips the playtesters had to discover:** ability order matters (on a class's sheet, tap two numbers to swap; the Knight's Shield bash and the Valkyrie's Rally sit last by default and are often better first), and MP runs out across a run (watch the blue bars).

## 1. Decisions needed

### A. Vertical progression stops early (your question)

You asked whether there's enough vertical progression to keep the party from being the same over and over. Measured: how much tougher an Old Road the starting trio can clear, kitted from what's owned on reaching each node (foes' HP raised by k% and damage by k/2 %, until the trio wins half its runs):

| On reaching node | 1 | 2 | 3 | 4 | 6 | 10 | 20 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| The starting trio clears foes at | +18% | +73% | +163% | +170% | +158% | +158% | +180% |

Gear is the whole climb, and it's done by node 3 or 4: the empty armor and amulet slots fill, and after that every piece is a sidegrade, as the gear document intends. Formations add little power (section 3). From node 4 on, progression is breadth: new classes, formations and gear give new answers, not more power. The road stays hard because each node is tuned against what's owned, not because the party grows. The playtesters felt this: late rewards, the powerful pieces included, mostly went unworn.

Options, if you want a vertical axis past node 4:

1. **The party grows.** A fourth member mid-road (say after the Fire Mine) and a fifth late. The tech keeps parties of 5; formations would need slots 4 and 5. The most JRPG-like step, but while the Knight and Cleric are this strong, a fourth slot is a Knight, a Cleric and two free picks, which is flatter, not less flat.
2. **Gear tiers:** later nodes pay "+1" versions of pieces you own.
3. **Ability unlocks:** your idea, which you called going nuts for now. It fits the full game's five abilities with three brought.
4. **Accept it:** past node 4 the game is a puzzle box, not a power curve.

**My view, after the follow-up probes:** fix B, D and E first, then decide. On a fixed road where replays pay nothing, power the player gains is power the tuner takes back at the next node, so vertical progression adds the feeling of growing, not decisions. What made the last playtest easy (34 attempts) isn't a flat power curve; it's that a Knight in Prayer beads plus a Cleric answers almost every node, so each node's puzzle was only "which third member". With that core weakened, the viable share of builds the tuner aims at starts meaning what it says. If the road still feels like "same numbers, new enemies" after that, a small vertical layer is worth a try, and the party growing is the one I'd try.

### B. The Cleric's strength is Mercy, a free heal (and MP is the other half)

"Nothing restores HP or MP between fights" looked like the reason the Cleric is everywhere. The probe says it's mostly the Cleric's passive. Each node's best builds (up to 9) at the shipped difficulty, 12 seeds, all 20 nodes:

| Change | Wins |
| --- | --- |
| as shipped | 78% |
| **the Cleric's Mercy switched off** | **45%** |
| 30% of MP back after each won fight | 84% |
| 30% of HP back after each won fight | 82% |

And re-tuned, so difficulty is equal, on the nine nodes where the Cleric is in 8 to 10 of the top 10 builds: the Cleric's place in those 90 top builds goes from 77 to 69 with MP back, 66 with HP back, and **30 with Mercy off** (the Valkyrie, the other healer, rises from 37 to 50, and the Knight from 40 to 50; for the same difficulty the foes have to be up to 30% weaker, at the Ossuary).

- **Mercy** heals the lowest ally for three quarters of every staff hit the Cleric lands, for no MP: about 24,000 HP a run where a Cleric is in the party, the largest single heal in the game (a party takes about 59,000 damage a run). Off, the Crypt falls from 56% to 1%, the Storm Tower from 97% to 19%, Knives Out from 94% to 11%.
- **The Cleric never runs short.** It casts well under one ability per 10 ticks and starts every fight with 97% or more of its MP. Its 5,000 MP and the best regen in the game (500 every 10 ticks) are almost unused.
- **Everyone else's sustain costs MP, and the 2,000-MP classes run dry.** The Knight starts fight 3 with about a fifth of its MP and fight 5 with a tenth; the Hoplite is under a tenth by fight 3, the Vampire by fight 4, the Monk by fight 5, and their casts per 10 ticks fall by a quarter to a half over a run. A 2,000-MP class regains 250 every 10 ticks and its abilities cost 300 each on 12-tick cooldowns. The casters (3,000 to 5,000 MP) hold 80% to 90% through four fights; on the longest runs the Pyromancer and Stormcaller run low too.

So your reading is right for half the roster: the no-rest rule drains the classes whose value is in their spells, and the Cleric's value isn't. Restoring HP or MP between fights moves the Cleric a little; Mercy moves it a lot. MP also gates decision D: a Knight with MP to spend locks bosses out of their big moves.

### C. Class balance is only partly done

Two class passes went in (below). What's left, normalised for how long each class is owned:

| In the top builds while owned | Classes |
| --- | --- |
| 40% to 51% | Cleric, Vampire, Valkyrie, Knight |
| 22% to 33% | Paladin, Assassin, Stormcaller, Geomancer, Hoplite, Bramble knight, Bard |
| 13% to 17% | Monk, Hexer, Frostweaver, Ranger |
| 10% | Pyromancer |

The sustain classes lead in runs where HP carries; the fragile damage dealers trail. The playtesters agreed on the shape and added two things the simulation can't see: the Knight's Shield bash is the answer to every long wind-up (in 18 of 20 winning parties in one playtest), and the default ability orders hide each class's key move. Next would be a dedicated class pass, or decision B, which moves it more than numbers do.

### D. Bosses lose to interrupts, when the Knight has MP

The last playtest's loudest note: the Knight's Shield bash interrupts nearly every boss wind-up, and the Fire Giant's Inferno landed once in four fights. The simulation disagreed (re-tuning under the documents' lost-cast rule barely moved anything), and the probe (`src/campaign-probe.ts`, which reads the logs of each node's best builds) says why. Knight builds on nodes 4 to 20 at the shipped difficulty, 12 seeds each:

| The Knight | Wins | Inferno lands | Crush lands | Shield bash interrupts |
| --- | --- | --- | --- | --- |
| as the simulation kits it (Heartstone) | 77% | 60% | 82% | 646 |
| in Prayer beads, as the playtesters wore it | 85% | **2%** | 64% | 1,749 |
| in Prayer beads, interrupts switched off | 68% | 82% | 95% | – |
| in Prayer beads, the documents' retry rule | 84% | 3% | 66% | 1,886 |

- **MP decides it.** The Knight has 2,000 MP and regains 250 every 10 ticks; Fortify, Protect and Shield bash cost 300 each. In a Heartstone it starts the third fight with about a fifth of its MP and the bash mostly stops. In Prayer beads it never stops, and a boss with one big move is locked out of it.
- **It decides the Fire Giant and little else.** Switching interrupts off (Knight in beads) takes Deep Freeze from 99% to 13% and Judgement from 75% to 0%, and Iron Wall (no healer allowed) from 97% to 69%. On the other nodes it changes a few points either way: the Crushes and Tempests that land are survivable. Inferno is the one move that ends a run.
- **The lost-cast rule isn't the cause.** I adopted it overnight to settle the core set's open question (what an interrupted or target-less cast does) the way the rules already treat a cast that fizzles for MP, and to stop the Ghouls' Raise loop. That went against my own advice in the core-set report, which tested it and found it made Silence a hard counter; I should have said so. Under the documents' rule the Giant restarts at once, but it casts Brand first and Chill stretches Inferno's 8-tick wind-up past 10 ticks, so the bash is back (every 12 ticks) before it lands. The documents' rule still wins as many fights, and its target-less half is moot now that the enrage ends any loop, so reverting is cheap.

Options (you have your own; these are mine):

1. **One bash per big move:** after a boss is interrupted, its next big move can't be. My earlier wording, "for a few ticks", wouldn't work: the bash is back before the boss is.
2. **Interrupts delay, they don't cancel** (the boss keeps its wind-up progress after the Stun).
3. **Cost:** Shield bash on a longer cooldown or a higher MP cost, so the Knight chooses between it and Protect.

### E. Most trials ask for a handicap, not the answer (your question)

Each trial after an unlock says "bring it", which reads as "here's the key". I searched the nine class trials again with their needs removed (same foes, every owned class allowed) to see whether the best builds bring the class anyway:

| Trial | Asks for | In the top 10 without the need | Its effect on wins |
| --- | --- | --- | --- |
| Deep Freeze | Frostweaver | 8 of 10 | +10 |
| Blood Moon | Vampire and Bard | 7 and 3 of 10 | +14 and −4 |
| The Ogre Brothers | Knight and Hoplite | 8 and 4 of 10 | +3 and −10 |
| Wildfire | Pyromancer | 6 of 8 (three of the four owned classes are in most parties) | −47 |
| Valhalla | Valkyrie | 5 of 10 | +5 |
| The Ossuary | Monk | 4 of 10 | −11 |
| The Wild Hunt | Stormcaller | 0 of 10 | −18 |
| Knives Out | Assassin | 0 of 10 | −17 |
| Judgement | Paladin and Hexer | 0 of 10 | −18 and −14 |

Only the Frostweaver and the Vampire are the answer to their trial. Elsewhere the class is neutral or a handicap, and the knob was tuned with it in the party, so the handicap is priced in. That's your "requirements as debuffs" already, by accident, with the wrong framing: the text sells the class as the key, the player builds around it, and it rides along (the playtesters' "passenger" complaint). The cheap version of your idea is mostly rewording ("The Paladin insists on coming. Win anyway."); the full version picks each trial's handicap on purpose, from the effect column, and pairs it with a restriction.

### F. Rules and numbers I changed on this branch (confirm or revert)

These change the core set's documents. If you keep the campaign they go into `DECISIONS.md`; until then they live only here.

- **Burn** loses a tenth of its stacks a pulse (was a quarter) at 30 a stack (was 50): it builds to 10 to 25 on a target and lingers. **Poison** 160 a pulse for 12 ticks (was 90 for 10). **Shock** stops at 25 stacks and deals 60 a stack (was uncapped at 80: a slow boss gathered 100 and lost 8,000 to one swing, and the Stormcaller carried the end of the road).
- **HP on gear and formations** is half a point a step (was a whole point: Heartstone doubled a caster's HP, and HP everywhere was every class's best kit).
- **Inferno** 0.35 × Magic (was 0.5: it wiped every party it landed on).
- **A lost cast** (the core set report's decisions A and E): an action interrupted in its wind-up goes on cooldown, so an interrupt buys a whole cooldown; one whose targets are gone costs the unit its recovery, so two Ghouls reaching for one corpse don't loop.
- **Copies of an enemy start a fight 1.5 ticks apart.** Starting together, three Ghosts hit one unit on one beat and twin Ogre Chiefs wound up every Crush in lockstep; now a pack ripples. New: no document asked about it.
- **An enrage.** Past 300 ticks, every unit on both sides deals 25% more damage, and 25% more again every 30 ticks; the fight announces it once ("The fight drags on: every blow lands harder!"). A playtester met a Vampire and two Bone Priests healing each other to the engine's 5,000-tick safety stop, and Ghouls raising each other for 2,600 ticks. The rules document set no time limit "until it happens"; it happened. Boss fights end in 100 to 250 ticks, so the enrage rarely touches a fight that's going somewhere.
- **Might** stops at 25 stacks (a hidden Bard stacked 123 on itself, about +1,000% damage).
- **Classes:** Valkyrie's Gale spear 0.1 × Attack a hit (was 0.2) and Rally 0.3 × Magic (was 0.6); War ballad many Might (was several); Fireball a normal hit (was light); Blizzard 0.3 × Magic (was 0.2); Mercy heals three quarters of a hit (was half); Fire arrow a heavy hit (was normal).
- **Formations:** Escort's slots lose HP +1 (it was the best formation everywhere); Scatter's Decoy is Armor −1 (was −2).

### G. Smaller calls

- **Numbers on screen.** At the default SMALL numbers a Poison tick shows as 2 and a Burn tick as 3 or 4. Settings → NUMBERS → BIG shows 16 and 30 to 40, and 500 HP for the Knight. I'd make BIG the default; your call, since you set the scale.
- **Default ability orders.** The documents' order puts the Knight's Shield bash, the Valkyrie's Rally and the Monk's Pressure point last, where low MP or short-cooldown abilities starve them. I left the documents' order; reordering the defaults would help a first-time player.
- **What a foe's hits can't be.** Nothing on screen says the Wisps' and Ghosts' hits are magical, so Armor and Evasion don't touch them; two playtesters lost attempts learning it. A line in the bestiary would do it.

## 2. What was built

- **The road:** 20 nodes. The seven runs of the enemies document (nodes 1, 4, 7, 10, 13, 16, 19), two remixes (*The Road at Night*, the Old Road after dark with the chief's brother; *The Royal Court*, the Storm King and Queen together as the finale) and eleven trials with needs on the party: a new class after it's unlocked ("Bring the Pyromancer"), two at once ("Bring the Vampire and the Bard; pick your third"), a formation ("Stand in Caravan", seven fights with no rest), armor ("Everyone in heavy armor"), and one with Hasted foes. *The Ogre Brothers* is two Ogre Chiefs. A new class arrives just before the content it shines in, and the next node asks for it. Every class, formation and piece of gear is paid exactly once; the table is in `design.md`.
- **Difficulty:** one knob per node, foes' HP and damage, set by simulation against exactly what you own there. It's enemy stats, so the game never shows it.
- **The interface** (`ui/README.md`, "The journey"): JOURNEY is the first menu item. The road lists cleared nodes, the next one, and the rest as "???". A node's page shows its needs ticked against your party, its fights (tap one to practise), and the kind of reward. Clearing a node plays a celebration: CLEARED!, one card per unlock (a class with its face and figure; a formation with its slots; gear with who can wear it, each saying where to find it), then the next node. NEW tags mark what you haven't looked at yet, in the roster, the class list, the formation list and the gear picker, and on the menu items that lead to them. The menus only show what you own; CLASSES says how many of the 16 you've found. Free play keeps its own party.
- **Engine 0.7:** a dungeon can change every foe (HP, damage through a new `power` stat, statuses at fight start, summons included); `ruleset.lostCast`, `ruleset.stagger` and `ruleset.enrage` (above); `ruleset.run.restore` (decision B, off). Schema: a `campaign` block, validated (every need meetable with what's owned by then, nothing paid twice). 289 tests pass, six of them new.
- **Tools:** `npm run campaign` searches every node's builds and tunes its knob (`--effects`, `--power`, `--feel`, `--set` for what-ifs); `src/campaign-play.ts` is the game as a command line (node pages, owned lists, a glossary, a run summary with MP and both sides' statuses), which the AI playtesters played.

## 3. What the numbers say

Per node, after the last tuning pass. **Best:** the best build the search finds, first tries, 48 fresh seeds. **Viable:** the share of the node's sampled builds (up to 600: every allowed party, formation and kit style) that win at least half their runs. **Carry:** the previous node's best party, kept as far as the needs allow and re-kitted.

| # | Node | Knob | Best | Viable | Carry |
| --- | --- | --- | --- | --- | --- |
| 1 | The Old Road | −8 | 90% | 100% | – |
| 2 | The Road at Night | −4 | 88% | 100% | 61% |
| 3 | Wildfire | +105 | 92% | 33% | 6% |
| 4 | The Crypt | +249 | 100% | 19% | 78% |
| 5 | The Ossuary | +190 | 94% | 14% | 100% |
| 6 | The Ogre Brothers | +55 | 92% | 25% | 0% |
| 7 | The Fire Mine | −38 | 98% | 14% | 11% |
| 8 | Deep Freeze | −17 | 88% | 13% | 44% |
| 9 | Iron Wall | +1 | 90% | 100% | – |
| 10 | The Ice Pass | +138 | 98% | 10% | 0% |
| 11 | Valhalla | +150 | 100% | 10% | 0% |
| 12 | The Wild Hunt | +105 | 88% | 13% | 44% |
| 13 | The Storm Tower | +129 | 100% | 12% | 67% |
| 14 | Knives Out | +66 | 100% | 10% | 67% |
| 15 | The Long Road | +212 | 96% | 9% | 6% |
| 16 | The Deep Crypt | +152 | 83% | 9% | 33% |
| 17 | Blood Moon | +138 | 100% | 10% | 67% |
| 18 | Judgement | −25 | 90% | 10% | 0% |
| 19 | The Tower Top | +52 | 100% | 11% | 0% |
| 20 | The Royal Court | −11 | 98% | 7% | 56% |

- **Every node has a build that wins 83% to 100% of first tries,** checked on 48 fresh seeds per node (the tuner eases a node until it does). Node 1 has no choices (three classes, one formation, no gear) and sits at 90%.
- **Viable builds follow the ramp:** a third on node 3, an eighth to a quarter on nodes 4 to 8, about one in ten from node 10, one in fourteen on the finale. Iron Wall forces one party and is set by its best build alone.
- **The knobs are large** (foes at up to three times their written HP) because the documents' numbers were written for an ungeared party. Four nodes need weaker foes than written: the Fire Mine and Deep Freeze (the hounds' Burn wears a party down across the run, with the Fire Giant at the end; weakening the Giant alone didn't move the mine's knob) and Judgement and the Royal Court (boss pairings never tested before).
- **Party turnover:** the previous node's best party fails five nodes outright (6, 10, 11, 18, 19) and wins under half on six more (3, 7, 8, 12, 15, 16); it wins the rest. The two-class trials and the forced-party ones are where the party has to change.
- **Formations** in the top-10 builds across the road: Escort 60, Vanguard 35, Caravan 29, Neutral 22, Scatter 16, Blitz 8, Tortoise 4, Ambush 1; Champion and Last stand never. A slot is worth about one gear step, as the gear document feared; its own suggested fix is a bigger step on every slot.
- **How sure:** knobs and rates hold to a few points (6 seeds a build to screen, the best scored on 48 fresh ones). The sampled builds are a heuristic's kits, not a player's; the playtests are the check on that.

## 4. Feel

**Five AI playtests.** Each time a fresh agent played the road as a first-time player, through the game as a command line showing only what a player sees, up to 8 tries a node, then reported.

| Playtest, on | Attempts for 20 nodes | First-try clears | Stuck | What changed after it |
| --- | --- | --- | --- | --- |
| 1, the first tuning (a fifth of builds viable everywhere) | 28 | 17 | none | the harder target, formations spread out, class nudges |
| 2, round two | 42 | 10 | none | Shock trimmed, the end tightened |
| 3, round three | 47 | 9 | **node 5** | the Ossuary reworked, enemies staggered, the tuner's fresh-seed check |
| 4, round four | 51 | 11 | **node 19** | no node narrower than one build in eleven (the finale one in twenty), a hint at the Tower Top, the enrage, the Might cap |
| 5, this version | 34 | 14 | none | the Ice Pass's hint corrected; the rest is for you (decision D) |

What they agreed on:

- **The road works as a road.** New classes felt like progress when they were the answer the node's text pointed at (the Pyromancer for the hills, the Hexer and Frostweaver for the Fire Mine, the Valkyrie for the Ice Pass, the Stormcaller for the Wisps). The best moments were eurekas: dropping the tank and going Blitz against the Wisps, the Valkyrie as a second healer against the Ice Ghosts, Tortoise turning the Vampire into a wall that healed 12,600 of the 12,700 it took.
- **The core rarely changes unless a node forces it:** a Knight in the wall, a healer behind, Veils on the back line, and a damage dealer chosen by the node's elements.
- **What reads poorly:** MP (now in the summary; the interface always showed it), that some foes' hits ignore Armor and Evasion, and ability order.
- **The finale and the late rewards don't land.** Even after tightening, the last nodes fell quickly to a strong party, and the late gear went unworn. Decision A is the real answer.

What the last one found, on this version:

- **The hardest stretch is the middle, not the end.** The Ice Pass took 4 tries and Valhalla 7; from node 12 on, everything but Judgement fell first try. The finale was easier than the Tower Top, as in three of the five playtests. The difficulty dial for the end is one setting (the late share); I left it at one build in eleven because one in 25 walled the playtest before.
- **Bosses lose to interrupts** (decision D): the Fire Giant's Inferno landed once in four fights.
- **Forced classes ride along.** In the two-class trials the class the node asked for was often a passenger: the Bard died early with no effect, the Paladin's Smite fired once or twice a fight, and Judgement was won by the third pick (a Knight for its Shield bash). Valhalla's Valkyrie is a worse healer than the Cleric it replaces there (Rally fires once or twice a fight). That's decision C's class pass.
- **The Knight's MP:** Prayer beads on the Knight were a must from node 6, since nothing refills MP between fights (decision B).
- **Its favourite moment** was the Ice Pass: after three losses, the Monk's Sunder stacked on the Titan and it died in 92 ticks. The node's hint had pointed it the wrong way ("the Titan shrugs off all but one kind", which isn't true of the Titan); it's corrected.

**A fresh reader** (no rules, enemy stats hidden) read six runs from nodes 1, 6, 12 and 19 after the first tuning:

- **Your three complaints:** two of the six runs were lost, so it isn't impossible to lose any more. Burn builds to 9 to 13 stacks from one archer, and a Poison is worth about 1,000 HP. Shock ran away on slow bosses (fixed since).
- **What decides fights:** boss fights hinge on timing the party can't steer, such as the Knight spending its bash on a Bandit just before the Chief's Crush (the stagger and the lost-cast rule help).
- **Bugs:** Purify kept starting on 2-tick Stuns that ended before it landed, and a summon was told as cast "on" a hero (both fixed since).

The playtest diaries and the reader's answers are session files, not in the repo; `tuning.md` has what each found.

## 5. Method notes

- **A fixed route makes balance by simulation tractable, as you predicted.** Every node is tuned against exactly what's owned there: a few thousand runs a node, the whole road in about 30 minutes. The trials' needs shrink the space further (Iron Wall has 8 builds).
- **The simulation's "share of builds that win" isn't the player's experience, and an AI playtester is the check.** The sampled builds include kits and formations no thinking player picks, so "a fifth of builds win" meant a thoughtful player won almost everything. Playing the game through a command line, an agent found that in 12 minutes, and later found the one node that walled a player, which the simulation had flagged (best build 75%) but nothing acted on. Worth making standard: tune by simulation, play by agent, retune, and gate on the best build's fresh-seed rate.
- **Separate causes with a bench before tuning around them.** The casters looked weak everywhere; a small bench showed it was the difficulty knob's extra damage two-shotting 2-HP casters, plus a route mistake (Veil arriving 16 nodes after the Pyromancer that needs it). The class numbers weren't the first cause.
- **Price the tightest direction** found the no-rest rule's cost in one run of the tuner with one setting changed. A ruleset setting per contested rule makes that cheap.
- **What I didn't do:** ability unlocks, a bestiary filtered to foes met, new enemy art (no new enemies were needed), and decisions A to E, which are yours.
