# Step 5f report: the combat economy, from the fights up

You gave a per-fight list (`intent.md`): pacing with room to breathe and a tempo per class, cast times that read, mana that matters to every class, statuses that carry their appliers' damage, bosses whose moves come several times a fight, enemies with resistance, and a class pass (the Bard, Hexer, Knight, Vampire, Paladin, Cleric, Hoplite, Assassin, Monk). All of it is built and on this branch, in seven rounds at frozen knobs with the balance sheet after each, a feel read by an agent that watched fights tick by tick, then the knobs re-tuned in both modes. This report leads with what needs you. `design.md` checks every claim on your list against the engine and the logs (one wasn't true, one was truer than you thought), `tuning.md` is the trail, `reads-round4.md` the feel read, `fresh-eyes.md` the outside read, and `sheet-a.md` to `sheet-g.md` the sheets.

**To play it:** `npm install`, `npm run ui`. Every fight plays differently now, and the knobs moved with it.

## 1. Decisions and open questions

### A. Your eight questions, answered by the build

| You asked | What's built | Say if |
| --- | --- | --- |
| The Knight's "Sanctuary" | I read it as Protect (the Knight's Shield, which overlapped the Hoplite). Protect → **Stand fast**: Taunt on itself, Clarity on the ally with the least MP. Short cooldown, so the Knight taunts from tick 6. | you meant the Paladin's Sanctuary. |
| Aggro's variance | Words only, your rule intact: the casters, Cleric, Bard and Hexer at 1 (draw 64), the Hoplite, Bramble knight and Knight at 5 (157), the Paladin 4. Beside a Knight a word-1 unit now takes 22% of single-target picks (was 24% at word 2); the Knight's early Taunt did more than the words. | you want the step to move: at 15 a word the wall takes 60%, at 20, 64%. |
| Lifesteal | Back at your 30 / 15, with Blood gift (a fifth of the Vampire's max HP into an ally's HP and Clarity) in Wither's place. **Rogue +5.3, campaign +28** (B below). | you'd rather trim it. |
| The Bard's staff | Light staff (Light is restore, for Chorus). | wind. |
| Unmake's wait | A `casting` condition in the engine (0.13); Unmake waits for a foe in a wind-up and silences and dispels it. Your "casting or buffed" needs an "or" the conditions don't have, so it's casting alone. It interrupted every boss move it reached in the feel read. | you want buffed foes too (a small engine rule). |
| Fight length | A regular fight is **44 ticks** (was 31), a boss fight **63 to 81** (was 32 to 54), at the frozen knobs. | you want longer or shorter. |
| Stun | 8 ticks (was 5), no wind-up targeting. | |
| Resistance by rank | Elites 15, bosses 25 to every element; minions none. | a minion rank should carry some. |

### B. The Vampire is the campaign's carry, and the rogue's equal

With Lifesteal at your 30 / 15 and Blood gift, parties with the Vampire win **+5.3 points** more in the rogue (the band is ±8) and **+28 in the campaign**. It's knocked out 15 times in 100 campaign fights (the next fewest, the Cleric, 28), and it's short of MP 45% of its time (its limiter: Blood drain, Blood gift and Frenzy on a 2,000 pool). Rogue is your tiebreaker, so I left it. Your call: the exotic class as it is, or Lifesteal at 20 / 10 for the campaign's sake (5e's 15 / 8 made it +9.5 there).

### C. The campaign spreads toward sustain; the rogue doesn't

In the rogue, the main mode, **every class is within ±6.4 points** (the Assassin −6.4, the Vampire +5.3, the rest within ±3.4). In the campaign the same classes run from the Vampire +28, the Knight +9, the Valkyrie +9, the Bramble knight +9 and the Cleric +5 down to the Assassin **−16**, the Frostweaver −13, the Pyromancer −12 and the Geomancer −8. The campaign's six fights carry HP with one campfire, so what heals or shields for free compounds, and an HP-2 unit that dies once stays dead to the boss unless RAISE is spent on it. That's the mode's shape, not the classes'. **Your call whether the campaign should get a revive at its campfire for everyone, or a second campfire, or stay the attrition mode it is.** Free play, with no knob and full gear, spreads about as wide as the campaign.

### D. Mana binds, but the casters feel it over a run, not within a fight

Every ability's cost is on one ladder by cooldown word, in two tiers: skills (the physical classes' and the Valkyrie's spear) 150 / 250 / 400 / 600, spells (the healers', the Bard's, Hexer's and Paladin's, the four mages', the Vampire's dark arts) 300 / 500 / 800 / 1,200. MP regen is 1.5% of the stat every 4 ticks (was 4%). The party now spends 2,895 MP a fight and regains 1,995 (it regained 102% of what it spent before). Within a fight the Vampire is short 45% of its time, the Paladin 11%, the Stormcaller 10%, the Geomancer 9%; the casters 0% to 3%, because they die at ticks 20 to 30 and a 4,000- to 5,000-pool outlasts that, but they end a run at 67% to 89% MP (the Bard 67%, the Frostweaver 68%, the Pyromancer 76%; the walls at 97% before). Three rounds (regen 2.5%, 2%, 1.5%; Clarity 32%, 24%, 16% of max MP) moved it from "never" to "over a run"; I stopped there. To make a caster hungry inside a fight, the levers are its pool (your stat table) or spells at half again the price. **Say which, if either.** A single ladder for all (round 2) starved the 2,000-pool fighters a third of their time while the 5,000-pool casters never noticed: pools decide hunger as much as prices do.

### E. Statuses carry their appliers now, and Burn is a ramp again

Shares of their appliers' damage, before → after at the same knobs: Burn 9% → **28%**, Shock 20% → **40%**, Bleed 12% → **20%**. By class: the Hexer's statuses are 78% of its damage, the Pyromancer's 44%, the Stormcaller's 45%, the Monk's 34%, the Valkyrie's 32%, the Ranger's 27%, the Paladin's 16%; the Bramble knight's Thorns and Bleed half of its. The applier abilities give up their hit for their stacks (a new "touch" hit word, triple stacks), the nukes keep theirs. The feel read caught what the sheet's averages hid: at triple stacks and 60 a stack, a Firebolt was an 88-stack, 5,265-damage nuke that killed the Ogre Chief in 14 ticks. Burn is now **50 a stack, 15% lost a pulse, capped at 40**: a Pyromancer reaches the cap in two casts and holds it with Kindling, 2,000 a pulse at the ceiling. The other numbers: Chill to a cap of 12, 5% a stack, thawing one stack every 6 ticks; Clarity a pulse of 2% of max MP every 2 ticks for 16; Might 8% a stack to a cap of 15, spent one stack per action; Shock 120 a stack to a cap of 30; Sunder capped at 20; Guard +3,000 for 28 ticks; Ward +40 for 30; Taunt 20; Silence 16; Stun 8; Haste and Slow 20 and 24 ticks. The Pyromancer's 44% is below your "even higher" for a class built on it: the cap holds it; one more rung (60 a stack) is the knob.

### F. Pacing: fewer, bigger, slower, with a tempo per class

Weapons swing half again as slowly and hit half again as hard (the Ice staff is now the fast, light staff, for Cold hex and Brittle). Cooldown words are 16 / 28 / 44 / 60 (were 24 / 32 / 36), wind-ups 1 / 3 / 6 / 10 (were 0.5 / 1.5 / 4 / 6), head starts by slot 8 / 4 / 0, so a kit's two shorts fire at ticks 8 and 12 rather than together. Each class mixes the words by its tempo (the Bard, Monk, Stormcaller and Vampire quick; the Hoplite, Paladin and Geomancer slow). Damage a tick was cut by about a third on both sides to get there (fights didn't lengthen on slower swings alone: bigger swings and more casts kept the pace). Casts are 40% of the party's actions (were 34%). The feel read, on round 4, saw cast times read (Fire arrow six ticks, Crush ten) and fights in two waves (ticks 5 to 9, then 18 to 27); round 6's head starts answer the waves, and the fresh read (section 6) says whether they did.

### G. Bosses cast their moves

Signature casts a fight (campaign / free play / rogue), before → after: the Ogre Chief 0.4 / 0.7 / 0.6 → **1.2 / 1.5 / 1.5**, the Reaper 1.0 / 1.0 / 1.5 → 2.5 / 2.0 / 3.1, the Silent One 1.3 / 1.0 / 1.4 → 4.9 / 2.2 / 4.3, the Ice Titan 1.3 / 1.1 / 1.6 → 3.8 / 2.5 / 2.9, the Storm Queen 1.0 / 1.0 / 1.1 → 2.2 / 1.9 / 1.7, the Storm King 0.6 / 1.1 / 1.3 → 1.2 / 1.7 / 2.0, the Fire Giant 0.9 / 1.0 / 1.1 → 1.0 / 1.2 / 1.0. The blows and spells are on short cooldowns (22), the summons medium. The Fire Giant dies in 30 ticks (weak to Ice, a 10-tick Inferno): the knob's job, or a shorter Inferno.

### H. A rule that never held: floors

Your question "is Sunder eventually boosting damage past 0 Armor? It shouldn't" was truer than the design answered. The registry floors Armor at 0 and max HP at 1, but the engine applied a floor only when the stat also had a cap; **Sunder has been taking Armor below zero all along**, and a Last stand Martyr in Glass heart reached 0 max HP (a Raise brought it back at 0 HP; a lowest-HP pick divided by zero and crashed one fight in the sheet, which is how it was found). Fixed in the engine (0.13, with Unmake's condition and the Clarity givers' "least MP" target); max HP floors at half a point. Outcomes change only where a floor used to fail.

### I. What's still off, and why I stopped

- **Pyre** 0.11 casts a regular fight (medium cooldown now, a 10-tick wind-up on a caster that lives 21 ticks); Static charge 0.19; Fireball and Tremor 0.5 a boss fight. Third slots on the casters that die first: a kit question (5e's F), not a number.
- **The Assassin in the campaign** (−16; rogue −6.4): HP 2 in a six-fight mode, and Hidden shifts every hit onto its two allies while it lasts (on a short Vanish with Hidden 14 it hid 85% of a fight and its parties lost 20 points; Hidden 10 now). Structural in a party of three.
- **The Frostweaver** (−13 campaign, −3.4 rogue): Chill lingers now (cap 12, a stack lost every 6 ticks) and Brittle is 12% a stack, and it's still the dealer that deals least (1.1× an average unit) and dies early. Chill has no damage line; its worth is in Brittle and the foes' slower swings, which the sheet can't price.
- **Caravan** +7.6 against Neutral (band ±7), its Quartermaster's MP regen worth a lot now that mana binds; the other formations within ±7.
- By design and left: the Wisp (1 HP) dies before acting 29% of the time in free play, the Bomb Bug deals 3.7× the median minion's damage, Glass heart probes under an empty slot (−2.4; a crit piece for crit classes).
- About 0.5% of fights reach the enrage (85 of 16,000 in the campaign): sustain parties against sustain bosses, as before, a little more with longer fights.
- **Not built, as you allowed:** enemy buffs, taunts and multi-hits (the resistance was). The class changes came first.

### J. Three HP 3s reverted; nothing else of 5e's stat changes stands against your list

The Bard, Hexer and Assassin are at HP 2 again. 5e's other numbers (Lifesteal, Regen, Thorns, the formation step) were all revisited here under your list: Lifesteal and Thorns are back at your values, Regen is 24% of max HP over 24 ticks with Caravan's at 6 ticks, the formation step is 1.25 gear steps.

## 2. Before and after, at the same knobs

5e's sheet at its final knobs against round 6's at the same knobs (campaign / free play / rogue):

| | Before | After |
| --- | --- | --- |
| Ticks a regular fight | 31 / 24 / 34 | **44 / 32 / 44** |
| Ticks a boss fight | 33 / 45 / 54 | **63 / 68 / 81** |
| Casts, share of the party's actions | 34% | **40%** |
| MP regained, share of MP spent | 102% | **69%** |
| Burn, share of its appliers' damage | 9% | **28%** |
| Shock | 20% | **40%** |
| Bleed | 12% | **20%** |
| The Pyromancer's statuses, share of its damage | 23% | **44%** |
| The Hexer's | 0% | **78%** |
| The Ogre Chief's Crush, casts a fight | 0.4 / 0.7 / 0.6 | **1.2 / 1.5 / 1.5** |
| Bosses' moves a fight, the six others | 0.6 to 1.6 | **1.0 to 4.9** |
| Knockouts a regular fight (party) | 1.0 / 0.3 / 0.4 | 0.8 / 0.2 / 0.3 |
| The Pyromancer knocked out, per 100 campaign fights | 47 | **35** |
| The Hexer | 53 | **36** |
| The Bard | 47 | **30** |
| Class spread in the rogue (worst to best) | −5.4 to +5.7 | **−6.4 to +5.3** |
| Class spread in the campaign | −12 to +11 | −16 to +28 |
| The Bard | −12 / −25 / −11 | **−2 / +2 / −2** |
| The Hexer | −8 / −19 / −5 | **−4 / −2 / +1** |
| The Monk | +10 / +20 / +5 | **+1 / +6 / +2** |
| The Vampire | +11 / +24 / +6 | +28 / +21 / +5 |
| Formations against Neutral, probed | −6 to +10 | **−3 to +8** |

## 3. What was built

- **Pacing** (`scale.ts`): weapon intervals half again as long, with the Ice staff fast; foes' touches and swing words to match; cooldown words 16 / 28 / 44 / 60 (foes 22 / 34 / 48); wind-ups 1 / 3 / 6 / 10; recovery 2; head starts 8 / 4 / 0; damage a tick cut on both sides (swing size ÷ 16 of the interval, the hit words 0.17 / 0.29 / 0.5 / 0.85 with a new "touch").
- **Mana:** two tiers on one ladder, by hand on every ability (`classes.ts`); MP regen 1.5%; Clarity a pulse of MP; Refrain 60 + 3% of Attack a landed basic; two new Clarity givers (Stand fast, Blood gift).
- **Statuses** (`scale.ts`, `vocabulary.ts`): the table in section 1E; Might spent by action; Burn and Sunder capped; applier abilities on light or touch hits with triple stacks.
- **Enemies:** resistance by rank (elites 15, bosses 25); signature blows and spells on short cooldowns.
- **Classes** (`classes.ts`): the Knight's Vanguard (a start Shield, 0.2 of max HP) and Stand fast, HP 5 and Armor 4, Shield bash from max HP; the Cleric's Last rites (cooldowns halved below 30% HP); the Bard's Anthem (Haste and several Might on a random ally), Chorus (a small heal on every ally), a Light staff, Refrain by Attack, Aggro 1; the Hexer's Malison (a few Burn and Shock on every foe), Unmake, Enfeeble with Sunder, Aggro 1; the Paladin's Absolve that heals and fires without a debuff, Judgement at +50%, Aggro 4; the Vampire's Blood gift for Wither; the Frostweaver's Stillness on the least-MP ally, Brittle 12%; the Assassin's Vanish short with Hidden 10; the Hoplite's Attack 4 and Aggro 5; the Monk's Attack 3,700, Crit 2, Aggro 2, Burning fist 0.11 of Attack a hit; the Bramble knight's Aggro 5 and Thorns 300; the casters' Aggro 1; the HP 3s reverted.
- **Formations** (`formations.ts`): the step 1.25; Caravan's Regen 6 ticks and its Quartermaster +1 MP regen; Last stand's Martyr −1 HP step.
- **Engine 0.13:** the `casting` condition, `mp_share` as a target value, and the floor fix (section 1H). The pinned fixture's log is unchanged.
- **Tools:** the sheet names a fight that crashes; the feel tool prints the campfire's offer; the log prints a held cast. The documents (`docs/core-set/`) carry every changed word and number, each marked.

## 4. Difficulty

### The campaign

`npm run campaign -- --tune` on the final numbers (469,000 runs), then two nodes by hand: the tuner's safety loop had pushed the Ogre Brothers' and Iron Wall's boss knobs past the −88 floor (to −104 and −156, a boss with 500 HP) because their losses were on the road, not at the boss, so their bosses sit at the floor and their regular fights are eased (the Ogre Brothers +121 → +100, Iron Wall +24 → 0). **Every node's best build wins 81% to 100% of first tries** (the Ogre Brothers 94%, Iron Wall 88%, Blood Moon 81%).

| # | Node | regular fights' knob | boss's knob | best build |
| --- | --- | --- | --- | --- |
| 1 | The Old Road | -26 → +7 | -74 → -24 | 90% |
| 2 | The Road at Night | +4 → +57 | -20 → -2 | 85% |
| 3 | Wildfire | +18 → +86 | -37 → +53 | 92% |
| 4 | The Crypt | +88 → +211 | -7 → +306 | 88% |
| 5 | The Ossuary | +76 → +144 | +32 → +182 | 90% |
| 6 | The Ogre Brothers | +96 → +100 | -28 → -88 | 94% |
| 7 | The Fire Mine | +57 → +85 | -75 → -75 | 98% |
| 8 | Deep Freeze | +67 → +110 | -66 → -74 | 90% |
| 9 | Iron Wall | +4 → +0 | -76 → -88 | 88% |
| 10 | The Ice Pass | +72 → +117 | -12 → +23 | 98% |
| 11 | Valhalla | +95 → +135 | -30 → -10 | 98% |
| 12 | The Wild Hunt | +72 → +130 | +8 → -3 | 100% |
| 13 | The Storm Tower | +120 → +135 | +1 → -5 | 88% |
| 14 | Knives Out | +48 → +66 | -17 → -56 | 90% |
| 15 | The Long Road | +57 → +85 | +38 → +138 | 100% |
| 16 | The Deep Crypt | +122 → +137 | +43 → +163 | 98% |
| 17 | Blood Moon | +72 → +142 | +28 → +45 | 81% |
| 18 | Judgement | +37 → +97 | -56 → -69 | 85% |
| 19 | The Tower Top | +76 → +54 | -40 → -17 | 83% |
| 20 | The Royal Court | +115 → +168 | -72 → -69 | 98% |

What the knobs say: **the regular fights' knobs rose by two thirds** (mean +64 → +103) and the bosses' by a third (mean -23 → +16). The party is sturdier now: with damage a tick cut by a third on both sides, fights of 44 ticks at the old knobs, and three new heals (Chorus, Absolve, Blood gift) and a Knight that taunts from the start, the sensible builds outlast the foes, so the tuner gives the foes HP. **That lengthens the campaign's fights:** a knob is HP +k% and damage +k/2%, so difficulty bought with HP is bought with time. The best build's run at Iron Wall, at a knob of +10, has regular fights of 85 to 114 ticks. The fresh read's sheet at the new knobs (section 5) has the campaign's fight lengths; if they run long, the knob's shape (more damage, less HP) is the lever, and it's a decision for you (section 1F).

### The rogue

(The rogue's re-tune and the fresh read were running as this was committed; their numbers follow in the next commit.)

## 5. Fresh eyes

(The rogue's re-tune and the fresh read were running as this was committed; their numbers follow in the next commit.)

## 6. What to do next

1. **Your decisions above:** the Vampire (B), the campaign's attrition shape (C), the casters' hunger (D), Burn's ceiling (E), the Knight's second ability and Aggro's step (A).
2. **A kit pass on the third slots** that never fire (Pyre, Static charge, Tremor, Fireball in boss fights), and the Assassin's place in a party of three.
3. **The enemy side you deferred:** buffs, taunts and multi-hits on more foes, now that Unmake, Judgement and the Hexer's dispel have something to meet.
4. **Two sheet measures the pass needed and lacked:** the spread of stacks an application adds (the mean hid the Burn nuke) and the party's actions by tick (the feel read saw the waves; the sheet couldn't). Both are small additions to `src/balance.ts`.

## 7. Method notes

- **The feel read earned its place.** The sheet said Burn was 37% of its appliers' damage and the Pyromancer fine; an agent reading one fight saw an 88-stack Firebolt end a boss in 14 ticks. Averages over 200,000 runs hide a shape that one log shows. Your "use AI agents watching fights" was right, and the next pass should run one after every round, not once.
- **Pacing is damage a tick, not swing speed.** Slower, bigger swings and shorter cooldowns left fights exactly as long; only cutting damage on both sides lengthened them. Fight length is a budget: how much the party and the foes deal a tick against how much they can take.
- **Mana is pools as much as prices.** One ladder for all classes starved the small pools and never touched the large ones.
- **A patch that doesn't apply is worse than one that fails loudly.** One round's edits aborted on a mismatched line, the sheet ran on the previous round, and I read and logged it as the new one before noticing; the trail says so where it happened. Edits are checked against the built pack now.
- **Four engine-side fixes came out of a numbers pass** (the floor, a crash, two tool texts): reading fights closely finds machinery bugs as well as balance.
- **Cost:** seven rounds of about fifteen minutes each, a feel read of about fifteen, the re-tune of both modes about an hour.
