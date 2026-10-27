# Step 5e report: the balance pass

You asked for a balance audit of the core set in both modes, done from what happens in fights rather than from win rates, with the problems found by the pass itself. It's done and on this branch: a balance sheet (`npm run balance`) that reads the logs of 200,000 runs and gives every class, ability, status, enemy, piece of gear and formation a line against a written band; 61 flags on the numbers as they stood; six rounds of fixes at frozen knobs, upstream first; then the difficulty re-tuned in both modes; then a fresh agent's read. This report leads with what needs you. `intent.md` has your words, `design.md` how the sheet is built, `findings.md` the ranked list as it was before any fix, `tuning.md` the rounds, `sheet-before.md` and `sheet-after-fixes.md` the whole sheet at the start and after the fixes (same knobs), `sheet-after.md` the sheet at the new knobs, and `fresh-eyes.md` the outside read.

**To play it:** `npm install`, `npm run ui`. A journey in progress carries over (the road is the same), but every node plays differently: the knobs moved. Free play now has the campfire the rules promised.

## 1. Decisions and open questions

### A. Three classes at HP 3: the Bard, the Hexer and the Assassin (your stat table)

The sheet's worst class findings were three passengers: the Bard's parties won **16 points** less than parties without it, the Hexer's 10, the Assassin's 9 (in the campaign; two to three times that in free play), and all three were knocked out in 41 to 60 of 100 campaign fights, around tick 17 to 20 of a 31-tick fight, before their second ability came round. I gave the three a point of HP (2 → 3), with the Knight's precedent. **It bought little:** the Bard is now knocked out in 49 fights of 100 (was 51), the Hexer 55 (60), the Assassin 39 (41), each a tick or two later. The Assassin's recovery (−9 → −3, within band) came from its cooldowns, not its HP (section C). **This is the one change that touches your table, and the least effective one I made. Keep it or revert it; nothing else leans on it.** The classes document says so at its top.

### B. The Bard and the Hexer are still passengers, and numbers won't fix them

| | before | after, at the same knobs | the band |
| --- | --- | --- | --- |
| The Bard: its parties' win rate against parties without it | −16 / −30 / −21 | **−10 / −25 / −15** | ±8 |
| The Hexer | −10 / −16 / −14 | **−6 / −19 / −10** | ±8 |

(Three numbers are campaign / free play / rogue, here and throughout.) Three rounds moved their numbers: the songs 650 → 400 MP and Allegro's Haste on the hardest hitter rather than a random ally; the curses 1,600 / 1,300 / 1,300 → 1,200 / 900 / 1,000 MP; HP 3; the long cooldown 42 → 36 so their second ability comes. Each cast more (Hush 0.46 → 0.71 casts a regular fight, Allegro about 0.7, War ballad 0.44, Thunder chord 0.48) and each stayed a passenger. **No progress in three rounds, so I stopped, as you asked.** The sheet shows why: in a party of three, a unit that buffs one ally or curses one foe for 30 ticks is worth less than a third body that deals or heals, whatever the buff's size. War ballad's 19 Might and Thunder chord's 23 Shock on every foe land as written; it's the shape, not the numbers. The options are design, so they're yours:

1. **Make their kits reach the party or the pack.** Allegro on every ally, Hush and Enfeeble on every foe, at smaller sizes. Within the systems (every ally / every foe is a targeting rule the documents already use), and the most likely to work: Thunder chord, the Bard's one ability on every foe, is already a third of its damage.
2. **Give them a body's worth of something else:** a damage line on the Hexer's staff (its Siphon already regains twice a Frostweaver's MP; it has nothing to spend it on) or healing on the Bard.
3. **Leave them for the party of five.** The concept spec's party is five; in a party of three a buffer is a third of the party. If the slice stays at three, this answer makes them a known weak pick, which your principle rules out.

I'd try the first, on both, in the next pass.

### C. What moved the most: how often units act, and what sustain was free (confirm)

Upstream first, as you asked. These are all numbers in `scale.ts`, and they changed how every fight plays:

- **Cooldowns:** the party's long cooldown 42 → 36 ticks; the foes' medium and long 48 → 40 and 70 → 60; the very long wind-up 8 → 6. The head starts by slot 20 / 12 / 6 → **16 / 12 / 8**. Before, bosses cast their signature move 0.5 to 0.9 times a fight in free play (the Ogre Chief's Crush 0.5) against the enemies document's two or three, and a third of the Wolves, Wisps and Drones died before acting because every first-slot ability fired at ticks 2 to 6. Now every boss casts its move about once a fight (0.74 for the Ogre Chief, 1.0 to 1.1 for the rest), and the minions act first (Wolves 18%, Skeletons 9%, Drones 7% killed before acting; the Wisp, with 1 HP, 32%). The Assassin's Vanish and Garrote, at 47 and 45 ticks, now come at 40 and 38, and the Assassin went from −9 to −3.
- **Lifesteal and Regen were the party's sustain, for free.** Lifesteal was 54% of all healing on the party in the campaign; Regen, from Caravan's effect, was 36% of every unit's max HP a fight, more than a Cleric heals. Lifesteal high 30% → **15%**, medium 15% → 8%; Regen 36% → **16%** of max HP (8 pulses of 2%). Healing in boss fights fell from 38% of the party's max HP to 14%. MP regen 5% → 4% of the stat every 4 ticks: the party regained 113% of the MP it spent over a campaign run; now 102%.
- **The Vampire,** your "required" class: +37 / +45 / +18 → **+9.5 / +24 / +8**. It healed itself 3,900 a fight through Lifesteal (the Cleric heals the whole party 1,450) and was knocked out 13 times in 100 fights, the fewest by far. Blood drain, a normal hit from max HP, was 60% of its damage at 4 swings a cast; it's 0.75 → **0.4** of max HP, 2 swings. It still leads free play; in the two modes people play it's beside the Monk and the Stormcaller.
- **The formations:** probed on the same forty parties, Caravan won **+20.5 points** against Neutral, Escort +11, Blitz +8, and the five with no effect sat within 3 points of Neutral. The gear document's own fix applied: **a formation slot's step is one and a half gear steps** (was one), Caravan's Regen is short (8 ticks of the status's 16), Escort's slots carry Aggro alone and its Shield is 0.12 of max HP (was 0.25). Now Caravan +8, Escort +8, Blitz +6, Vanguard and Champion +4, Tortoise +3, Scatter +2, Ambush −2, Last stand −4: the band is ±7, so two sit just outside, and every formation is a different choice.
- **The two healers:** the Cleric's Cure healed a third of a unit's HP for 1,280 MP, the Valkyrie's Rally half for 650. The healer was the worse healer. Cure 0.45 → **0.65** of Magic for 1,000 MP; Rally 0.7 → 0.45 for 800. The Cleric heals 1,550 a fight, the Valkyrie 1,220 (they were 1,450 and 1,780). The Valkyrie's spells cost 500 / 800 / 1,500 (were 400 / 650 / 1,200): a mid-tier caster that never ran short of MP.
- **The Hoplite's Spear thrust** dealt 0.9 of its own basic attack (Phalanx triples the swing, not the thrust), so casting it lost damage. It's 1.5 of Attack (was 0.75): the Hoplite −8 / −20 / −7 → −1 / −10 / −2. Three dead abilities got a price they can be paid: the Stormcaller's Static charge and the Frostweaver's Stillness 1,200 and 1,600 MP → 400 (section 4 says why they're still rare).

### D. The campfire in free play (confirm)

The rules say every run has one campfire; the spine runs free play uses (and the sheet's free set) had none. They do now (`withCampfire` in `dungeons.ts`, the same rule the campaign used). It changes free play's feel more than any number here.

### E. Where the classes stand (confirm the shape)

In the two modes people play, every class is now within 10 points of the rest except the Bard and the Hexer:

| | campaign | rogue | free play |
| --- | --- | --- | --- |
| Vampire | +9.5 | +8 | +24 |
| Valkyrie | +8 | +7 | +23 |
| Monk | +6 | +6 | +20 |
| Stormcaller | +6 | +8 | +8 |
| Bramble knight | +5 | +8 | +10 |
| Knight | +4 | +1.5 | +1 |
| Ranger | 0 | 0 | +6 |
| Hoplite | −1 | −2 | −10 |
| Cleric | −1 | −7 | −2 |
| Paladin | −2.5 | +2 | −3 |
| Assassin | −3 | −3 | −10 |
| Geomancer | −3 | −1 | −8 |
| Frostweaver | −5 | −4.5 | −14 |
| Hexer | −6 | −10 | −19 |
| Pyromancer | −7 | +2 | −2.5 |
| Bard | −10 | −15 | −25 |

Before the pass the spread ran from +37 to −16 in the campaign and from +45 to −30 in free play. **Free play spreads two to three times wider than the other two,** both ways, in every round: it's the one set with no knob, full gear and six-fight runs at 45% won, so a class's worth shows undamped. The campaign at its knobs and the rogue at its calibration compress everything. I read the two played modes as the measure and free play as the magnifying glass. **Say if free play should be balanced on its own.**

### F. Three casters die before their third slot comes

The Pyromancer and the Stormcaller (HP 2) are knocked out at tick 13 to 14 on average, the earliest of all, so their third-slot abilities never come: Pyre 0.03 casts a regular fight, Static charge 0.07, the Frostweaver's Stillness 0.13 (the band starts at 0.45). I didn't give them HP: the Stormcaller already deals 1.8× an average unit's damage and the Pyromancer 1.5 to 1.8×, and a point of HP would push them past the Vampire. The honest fix is in the kits: a third slot on a 40-tick cooldown behind two 24- and 32-tick spells, for a unit that lives 14 ticks, is a slot that never fires. Your call: shorter cooldowns on the big spells, or accept that their third ability is for boss fights with a wall in front (Pyre 0.14 casts a boss fight in the rogue, where parties are full).

### G. Your three rules: none was the problem

- **A status scales by its stacks:** no finding touched it. War ballad's 19 Might, Thunder chord's 23 Shock, Bleed's 4 stacks a hit all land as written.
- **MP costs by hand:** it works where it's meant to. The Geomancer is short of MP 17% of its time in the campaign, the Valkyrie 9%, the Cleric and Stormcaller 3%, the Hexer 2%; the Bard, Paladin, Pyromancer and Frostweaver 0 to 1% (the Pyromancer dies before it can spend). The band asks a caster to be short 3% to 30% of its time; four aren't. Only the Paladin's is a cost question (700 / 500 / 800 on a 3,000 pool with slow casts); the others die too soon to run dry.
- **Aggro by draw:** no finding. One thing it shows: the Hoplite and the Paladin, at Aggro 3, draw like anyone (0.93 and 0.96 of an average unit's hits), because 3 is the ordinary word and the draw is centred there. The Hoplite's document calls it a bodyguard. The sheet judges them as supports now (the Hoplite's Phalanx guards by shielding, not by drawing); **if you want them hit, they need Aggro 4 or 5, not a rule change.**

### H. Readings to confirm

- **Gear is fine piece by piece.** Every piece, probed alone on a bare unit beside the same companions, sits within ±3 points of the mean of its slot; the Herald's horn (+9, from Regen) came in with Regen's cut. The sensible kits win 8 points more than the gear rotation, so gear matters as a whole, but no piece is the pick. The Heartstone (HP) is in nearly every best build the campaign tuner finds: it's +0.8 against the other amulets, and +2.7 against an empty slot. It's the kit search's habit, not a dominant piece.
- **Bosses and minions by design:** the Bomb Bug deals 3.5× the median minion's damage per appearance (was 4.9; its blast is the point); the Wisp has 1 HP and dies before acting a third of the time; the Ghoul lives 2.6× a minion's life (Rot and its heal). Left as they are.
- **The Stormcaller** deals 1.8× an average unit's damage at 1.3 casts a regular fight (the band is 0.8 to 1.7 for a dealer). Its MP binds it, as 5c intended: it's short of MP 3% of its time and ends a run at 58% MP. Within reach of a cost nudge if you want it level with the Pyromancer.
- **The Knight** at HP 4 with Protect on a long cooldown is +4 / +1.5 / +1: an ordinary wall, in 14 of 20 best builds (the tuner's, not a player's). Protect comes 0.75 times a regular fight (was 0.46) with the long cooldown at 36.

## 2. The biggest problems, before and after

At the same frozen knobs (`sheet-before.md` against `sheet-after-fixes.md`):

| Finding | before | after |
| --- | --- | --- |
| The Vampire required | +37 / +45 / +18 pts | +9.5 / +24 / +8 |
| Caravan the formation | +20.5 pts against Neutral | +8.1 |
| The Bard a passenger | −16 / −30 / −21 | −10 / −25 / −15 |
| The Hexer a passenger | −10 / −16 / −14 | −6 / −19 / −10 |
| The Assassin a passenger | −9 / −26 / −12 | −3 / −10 / −3 |
| The Hoplite's thrust worse than its swing | 0.9 swings a cast, −8 / −20 / −7 | 2.0, −1 / −10 / −2 |
| Bosses' signature move a fight (free play) | 0.5 to 0.95 | 0.74 to 1.07 |
| Minions killed before acting (free play) | Wolf 33%, Skeleton 29%, Drone 36%, Hellhound 25% | 18%, 9%, 7%, 10% |
| Dead abilities (casts a regular fight) | Pyre 0.01, Static charge 0.02, Stillness 0.04, Vanish 0.18, Garrote 0.18 | 0.03, 0.07, 0.13, 0.34, 0.36 |
| MP regained as a share of MP spent | 113% / 114% / 109% | 102% / 104% / 97% |
| Lifesteal's share of the party's healing | 54% / 43% / 35% | 47% / 39% / 30% |
| Healing in a boss fight, share of the party's max HP | 38% / 31% / 32% | 14% / 18% / 16% |
| The healer heals less than the Valkyrie | Cleric 1,450, Valkyrie 1,780 a fight | 1,550, 1,220 |
| Flags | 61 | 54 |

The flag count barely moved because the sheet's bands are strict and the same things are flagged smaller (the Vampire at +14 pooled is still a flag). The worst halved; the list's tail is section 4.

## 3. What was built

- **`npm run balance`** (`src/balance.ts`): three sets on fixed seeds (every campaign node at its knobs; the seven free-play runs at the documents' numbers; every rogue fight at its calibrated knob), played by a spread of 80 trios in which every class appears in about 15 parties, each trio twice (a rotation that wears every piece its classes can wear in turn, and the campaign tuning's sensible kit), in all ten formations; plus two probes (every piece of gear alone on a bare unit beside the same four companions; the same forty parties in every formation). It reads the logs and writes `out/balance/sheet.md`: the flags ranked by how far outside their band, then a table for classes, abilities, enemy abilities, statuses, enemies, gear, formations, resources, every stat, and every log event kind, and the bands with their reasons. About four minutes on four cores for 200,000 runs. `design.md` has the design; the bands are in the code and at the end of every sheet.
- **One log-only engine change:** each damage entry carries `raw`, the amount before Armor and resistance, so mitigation can be measured. No outcome changes; the pinned log fingerprint moved. `ENGINE_VERSION` stays 0.12.
- **The campfire in every spine run** (`withCampfire` in `content/core-set/dungeons.ts`; the campaign's own copy of the rule now calls it).
- **Every number changed,** each with a comment naming this step: in `scale.ts` the cooldown words, the foes' cooldowns, the very long wind-up, the head starts, MP regen, Volatile, Thorns, Lifesteal, Regen, Shock (70 a stack) and Hidden (20 ticks); in `classes.ts` Blood drain, Spear thrust, Cure, Rally, Gale spear, the Valkyrie's, Bard's, Hexer's, Frostweaver's and Stormcaller's MP costs, Allegro's target and the three HP 3s; in `formations.ts` the slot step, Caravan's Regen and Escort's slots and Shield. The three core-set documents say what changed at their tops, with the numbers beside the words they change.

## 4. Still flagged, and why

At the frozen knobs, 54 flags, of which these are real and left for you or the next pass:

- **The Bard and the Hexer** (section 1B): a design question.
- **Third-slot abilities of the casters that die first** (1F): Pyre, Static charge, Stillness, plus Fireball, Tremor, Thunderstorm and Blizzard under 0.6 casts a boss fight in the campaign (their casters are down by then).
- **The Vampire, the Valkyrie and the Monk** at +6 to +9.5 in the campaign, +20 to +24 in free play: above the ±8 band when the three sets are averaged. The Vampire's heal is now 2,150 a fight; the Valkyrie's worth is Rally, Valhalla and a 3 / 3 / 3 body; the Monk's is 3.2 actions every 10 ticks. One more cut each would land them, at the cost of free play's strongest picks; I stopped where the two played modes were inside ±10.
- **Caravan and Escort** at +8 against Neutral (band ±7): a point over.
- **The Stormcaller** at 1.8× (1H).
- **Casters that are never short of MP:** the Bard, the Paladin, the Pyromancer and the Frostweaver (1G).
- **By design, left alone:** the Wisp, the Bomb Bug, the Ghoul's long life.
- **What the sheet can't see:** a buff's worth (Haste, Might, Guard, Ward have no damage line) shows only through its class's marginal win rate; feel; and anything about the player's choices (the AI playtests stand in).

## 5. Difficulty, re-tuned

Win rates set difficulty, never balance, as you said: the knobs were frozen through the six rounds and moved only now, with the balance changes fixed.

### The campaign

`npm run campaign -- --tune` on the new numbers (460,000 runs), then one node by hand: Wildfire's best build came out at 73% because its regular fights, not its boss, were losing whole runs (the tuner's safety loop eases bosses only, as in 5c's Knives Out), so its mob knob is 18 (the tuner's 25), best build 92%. **Every node's best build wins 81% to 100% of first tries.**

| # | Node | regular fights' knob | boss's knob | best build |
| --- | --- | --- | --- | --- |
| 1 | The Old Road | −24 → −26 | −88 → −74 | 85% |
| 2 | The Road at Night | +8 → +4 | −50 → −20 | 81% |
| 3 | Wildfire | +31 → +18 | +18 → −37 | 92% |
| 4 | The Crypt | +88 → +88 | −80 → −7 | 85% |
| 5 | The Ossuary | +78 → +76 | −21 → +32 | 88% |
| 6 | The Ogre Brothers | +100 → +96 | −45 → −28 | 81% |
| 7 | The Fire Mine | +27 → +57 | −88 → −75 | 96% |
| 8 | Deep Freeze | +71 → +67 | −50 → −66 | 92% |
| 9 | Iron Wall | −6 → +4 | −82 → −76 | 85% |
| 10 | The Ice Pass | +89 → +72 | +7 → −12 | 94% |
| 11 | Valhalla | +110 → +95 | −8 → −30 | 83% |
| 12 | The Wild Hunt | +91 → +72 | −7 → +8 | 96% |
| 13 | The Storm Tower | +146 → +120 | +12 → +1 | 83% |
| 14 | Knives Out | +74 → +48 | −37 → −17 | 98% |
| 15 | The Long Road | +108 → +57 | +141 → +38 | 98% |
| 16 | The Deep Crypt | +148 → +122 | +94 → +43 | 92% |
| 17 | Blood Moon | +119 → +72 | +167 → +28 | 100% |
| 18 | Judgement | +44 → +37 | −39 → −56 | 90% |
| 19 | The Tower Top | +108 → +76 | +41 → −40 | 96% |
| 20 | The Royal Court | +139 → +115 | −57 → −72 | 96% |

What the knobs say: **no boss sits at the floor any more** (four did, at −80 to −88: the party's abilities came too fast for them to be anything but a speed bump), the regular fights' knobs fell on fifteen nodes (mean +77 → +64: the party's free sustain is gone, so the foes don't need +148% HP to hurt), and the late bosses came down hard (the Long Road +141 → +38, Blood Moon +167 → +28) because the best builds there leaned on the Vampire, the Valkyrie and Caravan. The spread of the knobs narrowed from 255 points to 119: the knobs absorb less of what the classes do, which was your complaint.

### The rogue

`npm run rogue:calibrate` set every fight's knob again against snapshots of real parties (100 fights, 74 seconds), then `npm run rogue:tune` corrected the bosses and the regions over whole runs with the simulated player, five rounds of 1,500 runs (the 5d targets: a boss beats 22%, 35% and 45% of the parties that reach it by act; a region's road ends 6%, 9% and 12% of the runs that enter it). Confirmed on 2,000 fresh runs at heat 0: **the simulated player wins 23%** (5d had 21%); the bosses beat 24%, 36% and 39% of the parties that reach them; 73% of runs reach act 2 and 43% act 3. The Tower Top's road still ends 18% of the runs that enter it (target 12) after five rounds moved its region knob from +31 to −15; the tuner moves a region ten points a round, and I stopped with the headline on target rather than chase one region. Heat adds 4 to every knob a level, as 5d set it: heats 1, 3, 5 and 10 win 19%, 12%, 6% and 1% (1,000 runs each; 5d had 17%, 10%, 6% and 2%).

What the knobs say, as in the campaign: the regular fights' and elites' knobs fell (84 fights, mean +81 → +52: the easy tier 76 → 54, the normal 79 → 43, the elites 90 → 67), and every boss came down (the Reaper +193 → +129, the Silent One +388 → +298, the Storm Queen +172 → +112, the Storm King +131 → +61, the Ogre Chief +38 → +19), because the parties that reach them no longer heal themselves for free. The rogue's knobs had carried the Vampire and Lifesteal as much as the campaign's.

## 6. Fresh eyes

The fresh agent's read is still running as this is committed; its list goes here as it writes it (`fresh-eyes.md`).

## 7. What to do next

1. **Your decisions above:** the HP 3s (A), the Bard and the Hexer (B), the Hoplite's and Paladin's Aggro (G), free play as its own target or not (E).
2. **A kit pass on the casters** (F): the third slots that never come, and MP costs for the four that never run dry.
3. **One more sheet round** on the Vampire, the Valkyrie and the Monk if you want free play tight too; and the Stormcaller's cost.
4. **Rules the sheet suggests but didn't take:** nothing. None of your three rules was behind a finding.
5. **The tools stay:** `npm run balance` is the check to run after any numbers change, before the knobs; `tuning.md` says what to look for.

## 8. Method notes

- **The sheet found what win rates hid.** Past passes tuned knobs until the best builds won 85%; the knobs absorbed the Vampire, Caravan and the party's free sustain, and the bosses sat at the floor because the party's abilities came too fast. Reading shares (who deals what, who's hit, what heals) and comparing like with like found all of it in one run of the tool. Your instinct was right.
- **A control probe beats a spread for gear and formations.** The spread drowned a single piece's worth in party composition (±3 points of noise on a ±7 band); the probe (one piece on a bare unit beside fixed companions) read it clean. The same for formations.
- **Pool rates, not runs.** The first pooled sheet weighted the rogue's 32,000 single fights five to one against the campaign's 6,400 runs; averaging each set's rate fixed it.
- **Free play as a magnifier.** The set with no knob shows class worth undamped; the knobbed sets compress it. Read both.
- **Three rounds without progress, then stop:** the Bard and the Hexer. Their numbers were never the problem, and the sheet said so by round 3; the rule saved a night of grinding.
- **HP 3 taught the least.** A stat-table change for a tick or two of life; the cooldowns did the work. Upstream first was the right order, and HP is downstream.
- **Cost:** a sheet is four minutes; a full round (sheet, read, change, sheet) about fifteen; the re-tune of both modes about forty minutes of machine time.
