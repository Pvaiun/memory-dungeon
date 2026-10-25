# The campaign: report

You asked for the core set as a game to beat: start with the starters and the first run, unlock everything one node at a time, with remixes and trials that set needs on the party, balanced by simulation. It's built, tuned and on this branch. This report leads with what needs you; `design.md` beside it has the road in full, `intent.md` your words, and `tuning.md` the trail.

**To play it:** `npm install`, then `npm run ui`, and open the address it prints (on a phone on the same Wi-Fi, the Network address). GitHub Pages only publishes `main`, so the published app is still the old version. The game opens on the journey. Your old setup is kept as free play: Settings → MODE → FREE PLAY brings back the everything-available sandbox, with its own party. Settings → RESET JOURNEY starts the road over; with DESIGNER on, CLEAR NEXT skips a node.

## 1. Decisions needed

### A. Vertical progression stops early (your question)

You asked whether there's enough vertical progression to keep the party from being the same over and over. Measured: how much tougher an Old Road the starting trio can clear, kitted from what's owned on reaching each node (foes' HP raised by k%, damage by k/2 %, until it wins half its runs):

| On reaching node | 1 | 2 | 3 | 4 | 6 | 10 | 20 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| The starting trio clears foes at | +18% | +73% | +163% | +170% | +158% | +158% | +180% |

Gear is the whole climb, and it's done by node 3 or 4: the empty armor and amulet slots fill, and after that every piece is a sidegrade, as the gear document intends. Formations add little power (section 3). From node 4 on, progression is breadth: new classes, formations and gear give new answers, not more power. The road stays hard because each node is tuned against what's owned, not because the party grows.

Options, if you want a vertical axis past node 4:

1. **The party grows.** A fourth member mid-road (say after the Fire Mine) and a fifth late. The tech keeps parties of 5; formations would need slots 4 and 5. The most JRPG-like step, and it grows the build space just when the roster is big enough to fill it. **My recommendation** for the next experiment.
2. **Gear tiers:** later nodes pay "+1" versions of pieces you own.
3. **Ability unlocks:** your idea, which you called going nuts for now. It fits the full game's five abilities with three brought.
4. **Accept it:** past node 4 the game is a puzzle box, not a power curve.

### B. The no-rest rule makes a healer mandatory (a direction, priced)

"Nothing restores HP or MP between fights" is the direction the tuning works around hardest. In the simulation's best builds, the Cleric, Vampire, Knight and Valkyrie are each in 41% to 51% of the top builds while owned (a fair share is about 30%), and the playtesters' cores were Knight and Cleric early, then Knight and Valkyrie. I priced it with a variant where a won fight gives back 30% of HP and MP (knockouts stay down), tuned the same way: the Cleric fell from 86 to 54 appearances in the top-10 builds and the Hoplite and Ranger rose; the damage casters barely moved.

Options: keep it (the run as attrition is the core set's identity); give back a little after each won fight (25% to 30%); or give back MP only. I'd try 25% in your next playtest if a healer feeling mandatory bothers you. It's one setting (`ruleset.run.restore` in `content/core-set/vocabulary.ts`).

### C. Class balance is only partly done

Two class passes went in (below). What's left, normalised for how long each class is owned:

| In the top builds while owned | Classes |
| --- | --- |
| 41% to 51% | Cleric, Vampire, Knight, Valkyrie |
| 24% to 37% | Paladin, Assassin, Bard, Bramble knight, Hoplite, Geomancer, Stormcaller |
| 12% to 16% | Hexer, Monk, Ranger, Frostweaver |
| 9% | Pyromancer |

The simulation and the playtesters disagree about the Monk: low in the simulation's kits, but the first playtester's answer to everything (with lifesteal gear the simulation's kit picker doesn't favour). The rest is consistent: sustain classes lead in runs where HP carries, fragile damage dealers trail. Next would be a dedicated class pass, or decision B, which moves it more than numbers do.

### D. Rules and numbers I changed on this branch (confirm or revert)

These change the core set's documents. If you keep the campaign they go into `DECISIONS.md`; until then they live only here.

- **Burn** loses a tenth of its stacks a pulse (was a quarter) at 30 a stack (was 50): it builds to 10 to 25 on a target and lingers. **Poison** 160 a pulse for 12 ticks (was 90 for 10). **Shock** stops at 25 stacks and deals 60 a stack (was uncapped at 80: a slow boss gathered 100 and lost 8,000 to one swing, and the Stormcaller carried the end of the road).
- **HP on gear and formations** is half a point a step (was a whole point: Heartstone doubled a caster's HP, and HP everywhere was every class's best kit).
- **Inferno** 0.35 × Magic (was 0.5: it wiped every party it landed on).
- **A lost cast** (the core set report's decisions A and E): an action interrupted in its wind-up goes on cooldown, so an interrupt buys a whole cooldown; one whose targets are gone costs the unit its recovery, so two Ghouls reaching for one corpse don't loop.
- **Classes:** Valkyrie's Gale spear 0.1 × Attack a hit (was 0.2) and Rally 0.3 × Magic (was 0.6); War ballad many Might (was several); Fireball a normal hit (was light); Blizzard 0.3 × Magic (was 0.2); Mercy heals three quarters of a hit (was half); Fire arrow a heavy hit (was normal).
- **Formations:** Escort's slots lose HP +1 (it was the best formation everywhere); Scatter's Decoy is Armor −1 (was −2).

### E. Numbers on screen

At the default SMALL numbers a Poison tick shows as 2 and a Burn tick as 3 or 4. Settings → NUMBERS → BIG shows 16 and 30 to 40, and an HP of 500 for the Knight. I'd make BIG the default; your call, since you set the scale.

## 2. What was built

- **The road:** 20 nodes. The seven runs of the enemies document (nodes 1, 4, 7, 10, 13, 16, 19), two remixes (*The Road at Night*, the Old Road after dark with the chief's brother; *The Royal Court*, the Storm King and Queen together as the finale) and eleven trials with needs on the party: a new class after it's unlocked ("Bring the Pyromancer"), two at once ("Bring the Vampire and the Bard; pick your third"), a formation ("Stand in Caravan", seven fights with no rest), armor ("Everyone in heavy armor"), and one with Hasted foes. *The Ogre Brothers* is two Ogre Chiefs. A new class arrives just before the content it shines in, and the next node asks for it. Every class, formation and piece of gear is paid exactly once; the table is in `design.md`.
- **Difficulty:** one knob per node, foes' HP and damage, set by simulation against exactly what you own there. It's enemy stats, so the game never shows it.
- **The interface** (`ui/README.md`, "The journey"): JOURNEY is the first menu item. The road lists cleared nodes, the next one, and the rest as "???". A node's page shows its needs ticked against your party, its fights (tap one to practise), and the kind of reward. Clearing a node plays a celebration: CLEARED!, one card per unlock (a class with its face and figure; a formation with its slots; gear with who can wear it, each saying where to find it), then the next node. NEW tags mark what you haven't looked at yet, in the roster, the class list, the formation list and the gear picker, and on the menu items that lead to them. The menus only show what you own; CLASSES says how many of the 16 you've found. Free play keeps its own party.
- **Engine 0.7:** a dungeon can change every foe (HP, damage through a new `power` stat, statuses at fight start, summons included); `ruleset.lostCast` (above); `ruleset.run.restore` (decision B, off). Schema: a `campaign` block, validated (every need meetable with what's owned by then, nothing paid twice). 287 tests pass, four of them new.
- **Tools:** `npm run campaign` searches every node's builds and tunes its knob (`--effects`, `--power`, `--feel`, `--set` for what-ifs); `src/campaign-play.ts` is the game as a command line, which the AI playtesters played.

## 3. What the numbers say

Per node, after the last tuning pass. **Best:** the best build the search finds, first tries, 48 seeds. **Viable:** the share of the node's sampled builds (up to 360: every allowed party, formation and kit style) that win at least half their runs. **Carry:** the previous node's best party, kept as far as the needs allow and re-kitted.

| # | Node | Knob | Best | Viable | Carry |
| --- | --- | --- | --- | --- | --- |
| 1 | The Old Road | −11 | 85% | 100% | – |
| 2 | The Road at Night | −7 | 92% | 100% | 94% |
| 3 | Wildfire | +75 | 100% | 33% | 89% |
| 4 | The Crypt | +224 | 100% | 13% | 33% |
| 5 | The Ossuary | +154 | 75% | 18% | 94% |
| 6 | The Ogre Brothers | +60 | 81% | 25% | 0% |
| 7 | The Fire Mine | −38 | 100% | 13% | 17% |
| 8 | Deep Freeze | −20 | 90% | 21% | 78% |
| 9 | Iron Wall | +1 | 90% | 88% | – |
| 10 | The Ice Pass | +141 | 100% | 9% | 0% |
| 11 | Valhalla | +141 | 100% | 10% | 94% |
| 12 | The Wild Hunt | +80 | 90% | 10% | 61% |
| 13 | The Storm Tower | +85 | 100% | 8% | 56% |
| 14 | Knives Out | +53 | 96% | 9% | 39% |
| 15 | The Long Road | +155 | 90% | 9% | 0% |
| 16 | The Deep Crypt | +154 | 94% | 9% | 67% |
| 17 | Blood Moon | +145 | 100% | 9% | 72% |
| 18 | Judgement | −21 | 92% | 8% | 0% |
| 19 | The Tower Top | +66 | 98% | 4% | 0% |
| 20 | The Royal Court | −12 | 96% | 4% | 72% |

- **Every node has a build that wins 75% to 100% of first tries** (48 seeds each; holds for every node). Node 1 has no choices (three classes, one formation, no gear) and sits at 85%.
- **Viable builds follow the ramp:** a third on node 3, an eighth to a fifth on nodes 4 to 8, about one in eleven from node 10, one in 25 on the last two. Iron Wall forces one party and is set by its best build alone.
- **The knobs are large** (foes at up to three times their written HP) because the documents' numbers were written for an ungeared party. Four nodes need weaker foes than written: the Fire Mine and Deep Freeze (the hounds' Burn wears a party down across the run, and the Fire Giant waits at the end) and Judgement and the Royal Court (bosses whose numbers were never tested in these pairings). Making the Fire Giant itself weaker didn't move the mine's knob (−43 to −48 either way), so it's the mine, not the boss.
- **Party turnover:** the previous node's best party fails nodes 6, 10, 15, 18 and 19 outright and struggles on 4, 7 and 14; it still wins about half the nodes. The two-class trials (17, 18) and the forced-party ones (6, 9) are where the party has to change.
- **Formations** in the top-10 builds across the road: Escort 53, Vanguard 37, Caravan 30, Neutral 21, Blitz 15, Scatter 15, Tortoise 4; Ambush, Champion and Last stand never. A slot is worth about one gear step, as the gear document feared; the document's own fix is a bigger step on every slot.
- **How sure:** knobs and rates hold to a few points (the screen is 6 seeds a build, the best is scored on 48 fresh ones). The sampled builds are a heuristic's kits, not a player's; the playtests are the check on that (section 4).

## 4. Feel

**Two AI playtests.** An agent played the road as a first-time player, through the game as a command line that shows only what a player sees (node pages, owned lists, a summary of each run), up to 8 tries a node.

- **First, at the earlier, gentler target:** all 20 nodes cleared in 28 attempts, 17 on the first try; nothing after node 11 beat it. The two nodes it called "hard and good" (the Ogre Brothers and the Ice Pass) lost the same way every time and had an answer to find. It kept Knight, Valkyrie and one damage dealer in Vanguard from node 10, changing only what needs forced; the Monk was its answer to everything; it never wanted the Ranger, nor the Cleric once it had the Valkyrie; five formations went unused. This is what led to the harder target, the spread-out formations and the class nudges.
- **Second, on this version:** PLAYTEST2

**A fresh reader** (no rules, enemy stats hidden) read six runs from nodes 1, 6, 12 and 19:

- **Your three complaints:** two of the six runs were lost, so it isn't impossible to lose any more. Burn builds to 9 to 13 stacks from one archer, and a Poison is worth about 1,000 HP. Shock ran away on slow bosses (fixed since: capped).
- **What decides fights:** boss fights hinge on timing the party can't steer. The Knight spends its Shield bash on a Bandit just before the Chief's Crush, and at the Ogre Brothers stops bashing after the first fight (most likely its MP: three medium-cooldown abilities on MP 2, with the bash ordered last).
- **Hard to read from the log:** what a foe is weak to, and how close a boss is to dying. The interface shows foes' HP bars, statuses and RESIST and WEAK labels that the log doesn't.
- **Bugs:** Purify kept starting on 2-tick Stuns that ended before it landed (fixed since), and a summon was told as cast "on" a hero (fixed since).

The reader's full answers and both playtest diaries aren't in the repo; the trail in `tuning.md` has what they found.

## 5. Method notes

- **A fixed route makes balance by simulation tractable, as you predicted.** Every node is tuned against exactly what's owned there: a few thousand runs a node, the whole road in about 15 minutes. The trials' needs shrink the space further (Iron Wall has 8 builds).
- **The simulation's "share of builds that win" isn't the player's experience.** The sampled builds include kits and formations no thinking player picks, so "a fifth of builds win" meant a thoughtful player won almost everything. An AI playtester on a command-line version of the game was the check that caught it, in about twelve minutes. It's worth making a standard step: tune by simulation, then play by agent, then retune.
- **Separate causes with a bench before tuning around them.** The casters looked weak everywhere; a small bench (Knight, Cleric and each class against fixed fights) showed it was the difficulty knob's extra damage two-shotting 2-HP casters, plus a route mistake (Veil arriving 16 nodes after the Pyromancer that needs it). The class numbers weren't the first cause.
- **Price the tightest direction** found the no-rest rule's cost in one run of the tuner with one setting changed. A ruleset setting per contested rule makes that cheap.
- **What I didn't do:** ability unlocks, a bestiary filtered to foes met, new enemy art (no new enemies were needed), and the report's decisions A to C, which are yours.
