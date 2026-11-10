# The loot pass: the spine

The lead's spine for the loot pass (`brief.md`): every rare and legendary piece, every formation, every changed version, every mythic and every kit change as one line, the commons and uncommons by kind, each engine's link, and the web checked across the nine roads. Nothing here is built. The fill sets the numbers, the card text and the stat steps from it after gate 1.

**How to read a line.** `LS2●●●` means the item serves Landslide at rung 2, and it's worth a lot there. The rungs: **1** is the sign or the first step (what most runs find), **2** the build, **3** the far end. ● is a little, ●● some, ●●● a lot. A road with no rung is a road the item touches without being one of its steps. The roads: **LS** Landslide, **TC** Thousand Cuts, **BF** Bonfire, **CS** Cold Snap, **ST** the Storm, **HU** the Hunt, **TL** the Toll, **BA** Barrage, **BP** Blood Pact. After the roads, the engines it's part of: **◆** its keystone, **◇** its common half, **·** another part. *Seen* says what the player sees when a first step or an engine's part fires.

**Where the numbers in this page come from.** The offer counts are from 40 runs of the simulated player at the content as it stands (a scratch count of every offer, by act, rarity and slot). The player's own picks would move them a little; the offer roll and the stock decide most of it.

---

## Part 1: the rules (gate 1 reads this part)

### The stock it chose

| Slot | Kinds | A kind holds: common · uncommon · rare · legendary | In all |
| --- | --- | --- | --- |
| Weapon | 12 | 2 · 3 · 3 · 2 | 120 |
| Armor | 4 | 3 · 4 · 4 · 3 | 56 |
| Offhand | 13 | 2 · 2 · 2 or 3 · 2 (three rares on the kite shield, totem and tome) | 107 |
| Amulet | 1 | 6 · 8 · 8 · 9 | 31 |
| **All** | | **68 · 86 · 89 · 71** | **314** |

Plus the 12 plain weapons, outside the stock as now, and the 16 mythics. Today's is 272 in even quarters; this is 42 more, all of them uncommons, rares and legendaries.

**Why these counts.** Five facts from the offer roll decide them.
1. **An offer picks its slot, then a class, then a kind, then a piece.** So the count of pieces in a kind at a rarity doesn't change how often that kind is offered at that rarity: it only splits the kind's share. A kind with three rares, one of which serves a road, is as good to that road as a kind with two rares, one of which serves it, is to nobody. Each piece is met a third less often. What a road is offered depends on the share of each kind's pieces that serve it, not on the count.
2. **A run is offered about 34 pieces an act, and a party member about four of them.** In act I, about 10 commons, 9 uncommons, 8 rares and 7 legendaries (elites pay three legendaries each); act II and III the same, give or take one. Each class in the roster is about one offer in six (the roster is 3.7 in act I, 5.2 in act II), so a given party member sees one or two pieces of each of its kinds an act, across all four rarities.
3. **So a specific piece is rare.** A specific weapon uncommon of a party member's kind is offered about once in eight act Is (0.12 offers), and a specific rare about once in ten act IIs. A specific amulet is met nearly twice as often as a specific weapon piece, because every amulet fits everyone. A training offers every version a unit can take (the code offers them all, not three), so by act II a version is on offer to nearly any unit that knows its ability.
4. **Act I offers as many rares as uncommons.** The regular spoils' rarity table is the same in every act. A road's first step can sit on a rare as well as an uncommon and be met in act I as often.
5. **Weapons are what act I fills** (99% of units against 16% to 28% for the other slots). The first steps that have to show in act I sit on weapons, on the kits and on a common formation.

So the spine puts **the variety where the roads are many and the keystones where they're met**:
- **Weapons rise to three uncommons and three rares a kind.** Every weapon kind is worn by classes on four to six roads, and the weapon is the slot act I fills, so its uncommons carry the first steps for nearly every road. A kind's three uncommons each serve two to four of its wearers' roads, so the share that serves any one road stays about the same as today's two.
- **Armor rises to four uncommons and four rares a type, and falls to three legendaries.** Each type is worn by five or six classes across six or seven roads; four of each gives most of them a piece of their own. Legendaries fall because a run sees few of them, and the far ends live on more kinds than armor.
- **Offhands stay at two of each, with a third rare where a kind's wearers walk three roads or more** (kite shield, totem, tome).
- **The amulet rises to eight uncommons and rares and nine legendaries.** It's the one kind everyone wears, so it's where common halves and the keystones of engines that must meet across classes go: an amulet is met nearly twice as often as a weapon piece.
- **No engine's keystone rests on pieces alone where a version or a seat can hold it.** Keystones sit in two to four places: a piece in two kinds, a version, a seat.

**What the counts cost.** Each weapon piece is met a third less often than today's, and each armor rare a quarter less. That's the price of variety, and the director's "too much is better than too little" is the call it follows. If a sample of play shows a road's step isn't met, the lever is the share of a kind's pieces that serve it, not the count.

### New words and counters

**Counters** are statuses of their own, shown as an icon with a number on the holder and kept for the fight, each with one fixed meaning, so none stacks into another. Each is defined once, in `pieces/shared.ts`. How a counter empties is part of its own definition, not something a piece does to it.

| Counter | What it is | Gained by | Used by | State |
| --- | --- | --- | --- | --- |
| **Cuts** | Hits landed: each Cut makes its holder's hits deal a little more, up to a cap. | each hit the holder lands | Thousandth cut, The thousand | kept |
| **Heat** | Speed that builds while the field burns: each Heat makes its holder's actions come a little sooner (attack speed, cooldowns and wind-ups), up to a cap. | every few ticks while any foe burns | Smoulder wand, Kindled robes, The forge, Ember palms | **changed**: was a damage boost; Bonfire's far end is "the party feeds faster the longer the fight runs" |
| **Spite** | Thorns that grow: each Spite adds Thorns, up to a cap. | each hit the holder takes | Thornheart plate | kept |
| **Wrath** | A beating saved for one blow: the holder's next basic attack deals a tenth more for each Wrath, and the Wrath is spent by it. Capped. | each hit an anchor takes (the piece or seat says whose) | Grudgebearer, The anvil, The reckoning | **renamed** from Charge, same meaning; "charge" is the Storm's word for Shock in every document |
| **Beat** | Swings counted to a spell: at its count, the holder casts its first-slotted ability (below) and the Beats are spent. | each basic attack the holder lands | Bell of the beat, The cadence | **new** (the spell on the swing) |
| **Crescendo** | Casts this fight: each makes the holder's abilities (or the one its piece names) deal and heal more and cost more. Capped. | each ability the holder casts | Rising wand, Crescendo staff | **new** (the crescendo) |
| **Cascade** | Shatters this fight: each makes the cold a shatter sends on larger. Capped. | each shatter the holder's piece reacts to | Cascade staff | **new** (Cold Snap's far end) |

**Retired:** Surge (Harvest's), Fervor (Phoenix's) and Tempo (the dodge's speed; the riposte doesn't need it). Seven counters, as today.

**Marked** stays the vocabulary's, with the approved change (Kit changes, below). Nothing else new in the vocabulary.

**"Its first-slotted ability"** is new card wording, for the spell on the swing: the ability first in the order the player set, whether or not it's ready. "Cast off its cooldown" means it resolves now, without its wind-up, without touching its cooldown, and with its MP paid; with too little MP it doesn't fire.

### The rules the pieces bend or add

Kept from today: **extra strikes that chain** (Flurry wraps), **a hit taken for an ally** (Oathbound shield), **effects after a won fight, before statuses end** (Lamp of vigil, The last drink), and the added rule that **Taunt ends Hidden**.

New, each on the items named, each a rule a player can reason from:
1. **Marked takes the party's random picks** (approved). Abilities aimed at "a random foe" (or "a random foe that isn't Taunting") pick a Marked foe while one is, inside the Taunt rule, as basic attacks do; an ability, or a piece, with a target phrase of its own keeps it. With several Marks, the pick goes by draw among the Marked.
2. **Malison pays for breadth** (approved). Its damage rises with each different debuff its target holds.
3. **A foe's action called early** (the goad): "every foe's next action comes at once", and "its target's next action comes at once". Allowed by `docs/rules.md`. The action is the foe's own, chosen by its own rule; what it sets off (Shock, Thorns, a rider) is set off by its own trigger.
4. **A blow as it was struck** (the mirror): retaliation read from the blow's size after the attacker's boosts and before the wall's Defense, Guard, Aegis and Shields.
5. **Damage carried past a kill** (the avalanche): what a killing blow had left over after its target's last HP lands on another foe, and on, while any is left. It's the same hit's damage, so it meets the next foe's Defense.
6. **Damage taken from MP** (mana as armour): while the holder has MP above a line, the damage it takes comes out of its MP first.
7. **An ability cast by a count of swings** (the spell on the swing): the Beat counter, and "cast off its cooldown" (above).
8. **Start-of-fight effects happen again** (the opening, again): when a foe falls, every effect on the holder's own gear and seat that says "when each fight starts" or "at the start of each fight" happens again. Its kit's and other allies' don't.
9. **A status passed on by its holder** (the carrier): a hit gives its target one stack (or one copy) of each debuff the attacker holds; the attacker keeps its own.
10. **An ability brought back by the foes it hit** (the resonance): an ability that hit several foes comes closer by a number of ticks for each.
11. **A gift copied** (the borrowed gift): whatever the holder applies to itself, the other ally with the lowest share of HP gets too, at the same size.
12. **The party's stone read** (Landslide's far end): an amount that reads the Shield every ally holds together, and leaves it.

**What no piece does,** unchanged: grant an ability; apply a status for less or more than its own length; spend, shorten or set off a status early (a payoff reads the stacks and leaves them); use an enemy-only status.

### Code support

Listed once, so the fill can name it by its number. Most of the set is expressible today (PRIMITIVES.md: reactions to hits taken by allies, cooldown changes, counts of debuffs, overheal, fight_won, statuses with stat changes per stack). These are what the engine can't do yet, or does differently; the build stage confirms each against the schema before writing it.

| # | Code support | For |
| --- | --- | --- |
| C1 | Random-foe picks follow a Marked foe, inside the Taunt rule (kit change 1) | Marked, every Mark source |
| C2 | Malison's amount scales by the count of different debuffs on each target (`count: debuffs` exists; Malison's own rework) | Malison, Plague, Focused curse |
| C3 | Counters: Heat redefined as speed; Wrath (Charge renamed); Beat, Crescendo and Cascade new; Surge, Fervor, Tempo retired | the counters |
| C4 | "Cast off its cooldown": resolve an ability now, no wind-up, cooldown untouched, MP paid; and "first-slotted" as a target for it | the spell on the swing |
| C5 | A hit's size as struck (after boosts, before mitigation, Aegis and Shields) readable by a reaction | the mirror |
| C6 | Overkill carried to another foe as the same hit | the avalanche |
| C7 | Damage taken from MP before HP while MP is above a share | mana as armour |
| C8 | Re-run the holder's own gear's and seat's fight-start effects on a trigger | the opening, again |
| C9 | Copy one stack of each of the actor's debuffs onto a target | the carrier |
| C10 | Copy a status the holder applies to itself onto another ally | the borrowed gift |
| C11 | A number that reads the sum of every ally's Shield | Cairnbreaker, The mountain |
| C12 | A foe's next action made ready (cooldown `ready` on a foe's basic attack and soonest ability; may already be expressible) | the goad |
| C13 | Crescendo's per-stack cost and damage change on abilities (mods scaled by a counter's stacks) | the crescendo |
| C14 | A reaction to a status reaching a stack count on a foe ("waits until a foe holds many Burn") as an ability's condition | High pyre |

---

## Part 2: the items

### Kit changes the builds already name

- **K1. Marked takes the party's random picks** (the Paladin's Condemn applies it; so do the pieces). Every ability aimed at a random foe follows the Mark, as basic attacks do, inside the Taunt rule; a target phrase of its own keeps it. Today's kits aimed at a random foe: Shield bash, Barbed arrow, Bramble lash, Spear thrust, Gale spear (past Taunt), Garrote (past Taunt), Blood drain, Chain lightning's first strike, Rockfall, Tremor, and their versions that keep "a random foe". HU2●●●, and every road's aim a little. *The judge's drum*· *Seen:* a foe is Marked and every bolt, arrow and bash in the party turns to it.
- **K2. Malison pays for breadth.** It deals damage, from Attack, to every foe, more for each different debuff that foe holds; then it adds a few Bleed to each, as now (the Bleed lands after, so it counts next time). The Hexer's own swing (Chill) and Enfeeble (Weaken, Sunder) give it three kinds alone, and every other status and debuff in the party adds one. Its hit on every foe also pays every Bleed on the field. Colour◆ for the Hexer's roads; BF/CS/ST/TC ●●; red rain·. *Seen:* the curse's number is biggest on the foe with the longest row of icons. **Assumption to confirm:** the approved change didn't say whether the few Bleed stay; keeping them keeps Thousand Cuts' "four base kits open wounds" true and gives Malison something alone.

### The parts that recur, and where each lives

The common halves come first: each part is in the kits already, and the spine adds it to the commons and uncommons of the kinds the classes who'd want it wear, and to the common formations.

| Part | In the kits | Added by the loot (uncommon unless named) |
| --- | --- | --- |
| **A Shield made by what a unit already does** (detonation, frozen gate, riposte, red stone, brink) | Vanguard, Earthen shell, Shieldmaiden; Rime shield and Rock shelter (versions) | Mason's hammer (its hits), Lattice mail (its hits), Dancer's vest (its dodges), Glyphed robe (its casts), Rimeguard (a shatter), Guardian's blade (the lowest ally, by its swings); at start: Carapace charm, Canopy staff, Sigil blade; rare: Shelter plate, Shield of the sister; the Knight's mythic |
| **A draw on one unit** (frozen gate, mirror, goad, reckoning, riposte, two in the dark) | Stand fast, Thicket; Challenge, Stillness of mind, Over the fallen, Storm shield (versions) | Clarion blade, Portcullis, Red ribbon, Boar spear, Matador's cape, Spinebark pole (Thorns on whoever draws most); common seats in Shieldwall, Ring of steel, Squall line, Heavy line; rare: Gleaming mail |
| **A status on a swing** (lead's colour, every colour, held charge, carrier) | Cold hex, Iron palm, Arc, Thunderstorm; Kindling, Zeal, Hex of flames, Barbed quiver (versions) | Jolt wand, Brand, Spark knuckles, Sleet blade, Thunder spear, Torch mace, Hailbow, Storm bell; common seats in Kindling ring, Snowline, Squall line; rare: Rime knuckles, Ember knuckles, Ember wand, Frostbite bow, Notched knife, Wildmagic wand |
| **A hit on many foes** (red rain, reaping, resonance, blood mage, firecracker string) | Chain lightning, Arc, Fireball, Blizzard, Othismos, Malison; Gale storm, Whipping vines, Funeral pyre, Thunderclap, Aftershock (versions) | Cleaving axe; Cold orb (adds Chill to them); rare: Sweeping blade, Bloodtrail bow; legendary: Volley bow, Skyspear, Oathkeeper |
| **A foe held still** (held charge, shatter bell, emptied quiver) | Shield bash, Tremor, Pressure point, every shatter; Aftershock, Hammer of dawn (versions) | rare: Bellringer (every third swing Stuns); legendary: Worldbreaker |
| **A kill that pays** (reaping, judge's drum, opening again, fuse, avalanche) | Coup de grâce (version) | Cutthroat's knife (next swing at once), Hunter's skull (next hit crits), Bull's horn (the party Hasted), Hare's foot, Charnel icon, Mana pearl, Carrion idol, Boar spear (it Taunts); rare: Hunting spear, Thirsting axe |
| **The slowest, heaviest blow** (judge's drum, avalanche, reckoning, shatter bell, mirror) | Phalanx, Crushing bash, Boulder, Breach, Smite, Pyre | commons that swing heavier (hammer, great weapon); Roaring greataxe (several Might on the slowest swinger, itself); rare: Millstone, War horn (many Might on the slowest), Heartsplitter; legendary: Worldbreaker, Headsman's axe |
| **The ally with the lowest share of HP** (brink, two in the dark, borrowed gift) | eleven kits give to it | Mender's mace, Censer mace, Sheltering kite, Oath targe, Guardian's blade, Hymnal, Charnel icon; rare: Shelter plate, Shield of the sister, Paired shields |
| **A cast that's free, or mana given** (crescendo, mana as armour, resonance, spell on the swing) | Stand fast, Stillness, Blood gift, Refrain, Encore; Overcharge, Deep calm, Recharge (versions) | Matins robe (the first cast free), Shepherd's staff, Reveille, Siphon edge, Novice's robe, Mana pearl, Carrion idol, Waking wand; common seats in Wellspring |

### Commons and uncommons by kind

**Commons, the rule for every kind:** stats only, at the kind's budget (`KIND_BUDGET`), the signature stat first and its common stats after, leaning to the roads in the kind's row; the two or three commons of a kind take different leans, so each is a different careful pick. A weapon's common may step along the swing trade ("a heavier swing", "a lighter swing") and say so. Where a common's lean is a road's careful pick too (Defense on a hammer for Landslide, HP on a mace for Blood Pact), that's the point.

**Uncommons:** one simple effect each, no condition on a class, sized to be seen the first time it fires. Each serves two to four roads a little, and carries a road's first step or an engine's common half.

| Kind | Signature · its commons lean, by road | Uncommon 1 | Uncommon 2 | Uncommon 3 (4) |
| --- | --- | --- | --- | --- |
| **Dagger** (Ranger, Assassin) | Crit chance · TC: Attack speed, Evasion · HU: Crit damage, Attack | **Weeping kris**: its first hit on each foe adds a few Bleed. TC1●● HU1●; red rain◇. *Seen:* a red number beside that foe's next hit | **Cutthroat's knife**: when it lands a killing blow, its next basic attack comes at once. HU1●●● TC●; kill that pays◇. *Seen:* a kill, and a swing in the same tick | **Bleeder's needle**: it crits twice as often against a foe that holds Bleed. TC●● HU●; emptied quiver◇ |
| **Fist weapons** (Monk, Vampire, Stormcaller) | Double strike · TC: Attack speed, Evasion · ST: Attack speed, Attack · BP: Lifesteal, HP | **Wildcat claws**: Hasted when each fight starts. TC1●● ST● BF● CS●; opening again◇ | **Leech knuckles**: its extra strikes heal it for a fifth of their damage. TC● BP1●● | **Spark knuckles**: its extra strikes add a Shock. ST1●● TC●; lead's colour◇. *Seen:* the second blow sparks |
| **Wand** (Bard, Hexer, Pyromancer) | Cooldown · BA: Cast speed, MP regen · BF, ST, CS: Attack speed, Attack | **Jolt wand**: its basic attacks add a Shock. ST1●●● BF●; lead's colour◇, every colour◇. *Seen:* every foe it touches sparks when it moves | **Waking wand**: when each fight starts, the wearer's ability nearest to ready is ready at once. BA1●● HU1● BF● CS●; opening again◇. *Seen:* a spell on the first tick | **Weaving wand**: each time the wearer finishes casting an ability, its next basic attack comes at once. BF● ST● TC● |
| **Sword** (Knight, Hexer, Valkyrie) | Attack · TL: HP, Defense, Aggro · BF, CS: Attack, Crit chance · BP: HP | **Clarion blade**: Taunts when each fight starts. TL1●●● BF1● ST1● LS●; draw◇ | **Brand**: its basic attacks add a Burn. BF1●●● TL●; lead's colour◇. *Seen:* the keeper's swing leaves fire | **Guardian's blade**: each of its basic attacks that lands gives the ally with the lowest share of HP a small Shield, from the wearer's Attack. BP● TL● LS●; brink◇, Shield made◇ |
| **Spear** (Hoplite, Valkyrie, Monk) | Aggro · LS: Defense, Attack · ST, HU: Attack, Crit chance · TL: HP, Defense | **Ox-tongue spear**: its crits add a few Sunder. LS● TC● HU● | **Boar spear**: each time it lands a killing blow, it Taunts. TL1●● HU● LS●; draw◇, kill that pays◇ | **Thunder spear**: its basic attacks add a Shock to their target and to one other random foe. ST1●●●; *Seen:* two foes spark from one thrust |
| **Axe** (Vampire, Assassin) | Lifesteal · BP: HP, Attack · HU: Crit damage, Attack | **Hungry axe**: its hits on a foe below half its HP drink twice as much. BP1●● HU● | **Woodsman's axe**: its first hit each fight deals double. HU1●● BP● | **Cleaving axe**: its basic attacks also strike the foe with the lowest HP, for a third. HU1●● TC●; hit on many◇ |
| **Bow** (Ranger, Bard) | Crit damage · HU: Crit chance, Attack · TC, ST: Attack speed · CS: Attack | **Broadhead bow**: its crits add a few Bleed. TC1●● HU● | **Dawnshot bow**: its first basic attack each fight comes at once and deals double. HU1●●●; *Seen:* the biggest arrow of the fight, on the first tick | **Hailbow**: its basic attacks add a Chill to a foe that already holds Chill. CS1●●; *Seen:* the coldest foe gets colder |
| **Rune sword** (Frostweaver, Stormcaller) | MP regen · CS, TL: HP, Defense · ST, BA: Cooldown, MP | **Sleet blade**: its basic attacks add a Chill. CS1●●● ST●; lead's colour◇, held charge· | **Sigil blade**: starts each fight behind a Shield of a fifth of its max MP. BA●● LS●; detonation◇ | **Siphon edge**: each of its basic attacks that lands gives the ally with the least MP MP equal to a fifth of its damage. BA1●● TL● |
| **Hammer** (Knight, Bramble knight, Geomancer) | Defense · LS: HP, Crit damage, heavier swings · TL: Aggro, Thorns | **Warden's hammer**: its basic attacks deal extra damage from its Defense. LS1●●● TL●. *Seen:* the careful pick's Defense is on the number | **Mason's hammer**: each hit it lands gives it a Shield of a tenth of its Defense. LS●● TL●; detonation◇, Shield made◇ | **Thornmaul**: its basic attacks deal extra damage equal to its Thorns. TL1●● LS● |
| **Mace** (Cleric, Paladin, Bramble knight) | HP · BP: MP regen, Cooldown · TL: Defense, Thorns · BF: Defense, Cooldown | **Mender's mace**: when each fight starts, the ally with the lowest share of HP gains Regen. BP● TL●; lowest ally◇ | **Censer mace**: each of its basic attacks that lands heals the ally with the lowest share of HP for a fifth of its damage. BP1●● TL● | **Torch mace**: its basic attacks add a few Burn, from its max HP. BF1●●● TL●; lead's colour◇. *Seen:* a slow swing that leaves a fire |
| **Staff** (Cleric, Pyromancer, Frostweaver) | Cast speed · BA, BF, CS: Cooldown, MP, MP regen · HP for the healer | **Shepherd's staff**: when each fight starts, the ally with the least MP gains Clarity. BA1●● BF● CS●; mana given◇ | **Canopy staff**: when each fight starts, the wearer and the other ally with the least max HP each gain a Shield from the wearer's Attack. BA● LS●; detonation◇, opening again◇ | **Clear-voice staff**: the first time each fight the wearer is Silenced, the Silence is lifted at once. BA●● BF● |
| **Great weapon** (Hoplite, Paladin, Geomancer) | Attack · LS: HP, Crit damage, heavier swings · HU: Crit damage · BF: HP | **Roaring greataxe**: starts each fight with several Might, from Attack. LS1●● HU●; opening again◇, heaviest blow◇ | **Pole of reach**: its basic attacks ignore Taunt. HU1●● LS● | **Headsplitter**: its basic attacks on a foe below half its HP deal a third more. HU1●● LS● |
| **Plate** (Knight, Bramble knight, Hoplite, Paladin, Geomancer) | by weight: Defense, HP, Aggro, Thorns · LS: Defense, HP · TL: Aggro, Thorns · BF keeper: Defense, Aggro | **Portcullis**: while above half its HP, it draws far more. TL1●● LS● BF● ST●; draw◇ | **Bastion plate**: starts each fight Guarded. LS● TL●; mirror◇ (the cover), opening again◇ | **Rimeguard**: when a foe's Chill shatters, the wearer gains a Shield from its max HP. CS● TL● LS●; frozen gate◇, Shield made◇. *Seen:* SHATTER, and the wall's Shield bar refills | **Spiked plate**: while it Taunts, a foe that hits it takes a share of its Defense back. TL●● LS● |
| **Mail** (Bramble knight, Paladin, Valkyrie, Hexer, Vampire, Frostweaver) | by weight: HP, Attack, Lifesteal · BP: HP, Lifesteal · TC: Attack, Lifesteal · TL, CS: HP, Defense | **Tithing hauberk**: each hit the wearer lands heals it for a small share of its max HP. TC●● BP1● | **Lattice mail**: each hit the wearer lands gives it a Shield of a tenth of the damage. TC● LS●; riposte◇, Shield made◇ | **Reprisal hauberk**: the first time each foe hits it, that foe takes damage from the wearer's max HP. TL● BP● | **Wardmail**: starts each fight with Aegis. BP● TL● LS●; mirror◇, brink◇. *Seen:* BLOCKED on the first big blow |
| **Leather** (Ranger, Valkyrie, Bard, Monk, Assassin, Stormcaller) | by weight: Evasion, Crit chance, Accuracy, Attack · TC: Evasion, Attack speed · HU: Crit chance, Accuracy · ST: Attack | **Dancer's vest**: each time the wearer dodges a hit, it gains a Shield from its Attack. TC● TL●; riposte◇, Shield made◇. *Seen:* MISS, and a grey bar | **Warpaint jerkin**: its first hit each fight always crits. HU1●● TC● | **Stormhide**: each time the wearer dodges a hit, the attacker gains a few Shock. ST● TL●; goad◇ | **Tracker's coat**: its abilities have Seek. HU1●● ST● |
| **Robes** (Cleric, Bard, Pyromancer, Frostweaver, Stormcaller) | by weight: MP, MP regen, Attack, Aggro down · BA: MP, MP regen, Cast speed · BF, CS: Attack, Cast speed | **Matins robe**: the first ability the wearer casts each fight costs no MP. BA1● BF●; crescendo◇ (a free cast) | **Wallflower's robe**: draws far less until the first hit lands on it each fight. BA● BF● CS● | **Glyphed robe**: each ability the wearer finishes casting gives it a Shield from its Attack. BA●● LS●; detonation◇, Shield made◇ | **Novice's robe**: each ability the wearer casts gives the ally with the least MP MP equal to a quarter of the ability's cost. BA1●● BF●; mana given◇ |
| **Kite shield** (Knight, Paladin, Geomancer) | Defense · LS: HP, Attack · TL: Aggro, Thorns | **Sheltering kite**: when each fight starts, the ally with the lowest share of HP is Guarded. TL● BP● LS●; lowest ally◇ | **Beacon shield**: each time its holder Taunts, every foe gains a Burn. BF1●● TL●. *Seen:* the keeper shouts and the whole field catches | | |
| **Round shield** (Hoplite, Bramble knight, Valkyrie) | HP · TL, LS: Defense, Aggro · BP: Attack | **Comrade's targe**: when each fight starts, the other ally with the highest Aggro is Guarded. TL●● LS●; mirror◇ | **Oath targe**: the first time each fight an ally drops below a third of its HP, it gains Aegis. BP● TL● LS●; brink◇ | | |
| **Horn** (Knight, Hoplite) | Aggro · TL: HP, Defense · BA: MP regen · LS: Attack | **Reveille**: the first time each fight an ally falls under half its MP, it gains Clarity. BA1●● TL●; mana given◇ | **Bull's horn**: the first time each fight a foe falls, every ally is Hasted. HU1●● TC● BF●; kill that pays◇ | | |
| **Totem** (Bramble knight, Stormcaller) | Thorns · TL: Defense, Aggro, HP · ST: Attack | **Spinebark pole**: when each fight starts, the ally with the highest Aggro gains Thorns for the fight. TL1●● ST●; draw· | **Stormpole**: when each fight starts, every foe gains a few Shock. ST1●● TL●; every colour◇, held charge◇ | | |
| **Relic** (Cleric, Paladin) | MP regen · BP, TL: HP, Defense · BA: Cast speed | **Holy water**: each time its holder's abilities heal an ally, they also lift one debuff from it. BP● TL● | **Charnel icon**: each time a foe falls, the ally with the lowest share of HP heals a tenth of its max HP. HU● BP●; kill that pays◇ | | |
| **Lantern** (Cleric, Pyromancer) | Cast speed · BF: Attack, Cooldown · BA: MP · BP: HP | **Pitch lantern**: when each fight starts, every foe gains a few Burn. BF1●● HU●; every colour◇, opening again◇ | **Signal lantern**: the first foe its holder hits with an ability each fight is Marked. HU1●● BF● | | |
| **Tome** (Bard, Hexer, Frostweaver) | Cooldown · BA: MP, MP regen · CS, BF, ST: Attack, Cast speed · BP: MP regen | **Snowbound folio**: when each fight starts, every foe gains a few Chill. CS1●● TL●; firecracker string◇, every colour◇ | **Hymnal**: each ability its holder casts gives the ally with the lowest share of HP a small heal. BP● TL● BA● | | |
| **Orb** (Pyromancer, Frostweaver) | MP · BA: MP regen, Cast speed · BF, CS: Attack, Cooldown | **Mana pearl**: each time a foe falls, its holder regains a tenth of its max MP. BA1●● BF●; kill that pays◇, mana given◇ | **Cold orb**: its holder's abilities that hit every foe also add a Chill to each. CS1●● BF●; every colour◇ | | |
| **Idol** (Hexer, Vampire) | Siphon · BA: MP · BP: HP, Lifesteal · colour: Attack | **Carrion idol**: when its holder lands a killing blow, it regains a tenth of its max MP. BA1● HU● | **Hex idol**: when each fight starts, every foe gains a Weaken and a few Sunder. TL●● LS● every colour◇ | | |
| **Vial** (Vampire, Assassin) | Lifesteal · BP: HP, Attack · TC, HU: Crit chance, Crit damage | **Clotting salve**: its holder's crits heal it for a fifth of their damage. BP1●● HU● | **Second wind**: the first time each fight its holder drops below half its HP, it heals a fifth of its max HP. BP● TC● | | |
| **Trophy** (Ranger, Assassin, Geomancer) | Crit damage · HU: Crit chance, Accuracy · LS: Defense, Crit chance | **Hunter's skull**: when its holder lands a killing blow, its next hit always crits. HU1●● LS● TC●; kill that pays◇ | **Giant's knucklebone**: its holder's crits Guard it. LS●● TL● | | |
| **Bell** (Bard, Monk, Stormcaller) | Attack speed · TC, ST: Double strike, Evasion · BA: MP regen | **Waking bell**: the first time each fight an ally is Silenced, the Silence is lifted at once (a cast it broke is still lost). BA●● ST● | **Storm bell**: while its holder is Hasted, its basic attacks add a Shock. ST1●● TC●; lead's colour◇ | | |
| **Cloak** (Valkyrie, Monk, Ranger) | Evasion · TC: Attack speed, Crit chance · HU: Attack · TL dancer: Defense | **Feathered cloak**: the first time each fight its holder drops below half its HP, it's Hidden. BP● HU● TC●; two in the dark◇ | **Matador's cape**: while its holder Taunts, its Evasion is far higher. TL1●● TC●; riposte◇ (a draw on a dodger) | | |
| **Amulet** (everyone) | one each: HP, Defense, MP regen, Evasion, and two with Attack (two steps of mixed stats) | **Red ribbon**: the first time each fight an ally drops below half its HP, the wearer Taunts. TL1●● BP●; draw◇ · **Carapace charm**: starts each fight behind a Shield of a share of its max HP. LS●● all●; detonation◇, opening again◇ · **Hare's foot**: Hasted each time it lands a killing blow. HU1● TC●; kill that pays◇ | **Batwing charm**: the hits of its abilities heal it for a tenth of their damage. BP1● BA●; blood mage◇ · **Urchin shell**: while it holds a Shield, it has Thorns. TL●● LS● · **Wasp charm**: while it's Hasted, it has Double strike. TC1●● ST● | **Spark charm**: when each fight starts, the foe with the highest Attack gains a few Burn, a few Chill and a few Shock. every colour◇; BF● CS● ST● · **Hunter's token**: its hits on a Marked foe deal a fifth more. HU●● |

### Weapons: rares and legendaries

Two-handers (bow, staff, great weapon): a staff's or great weapon's rare or legendary pairs two effects or carries a bigger one; the bow keeps a one-hander's budget (*Gear design: the loot*).

#### Dagger
- **Notched knife** · R · its basic attacks and extra strikes add a few Bleed. TC2●●● HU●; red rain·. *Seen:* the pourer opens its own wound.
- **Marking knife** · R · its basic attacks Mark their target, and its crits on a Marked foe deal a third more. HU2●●● TC●. *Seen:* the Mark icon, and the party's random picks follow it.
- **Mercy blade** · R · its hits on a foe below a third of its HP always crit. HU3●● TC●; emptied quiver·.
- **Thousandth cut** · L · each hit it lands adds a Cut. TC3●●● (the count).
- **Quietus** · L · its hits on a foe that hasn't acted yet this fight always crit, and those crits add twice the crit bonus. HU3●●● (the opening that clears the weak) TC●; emptied quiver·.

#### Fist weapons
- **Rime knuckles** · R · its basic attacks and extra strikes add a few Chill. CS2●●● TC●; lead's colour·. *Seen:* the Monk's blur frosts what it touches.
- **Ember knuckles** · R · its basic attacks go to the foe with the most Burn, and each of its hits there adds a Burn. BF2●●● (the pile). *Seen:* the fists turn to the hottest foe without being told.
- **Gorged claws** · R · below half its HP, its basic attacks come a third faster. BP2●●● TC●●; brink·.
- **Flurry wraps** · L · its extra strikes can strike again: each rolls Double strike for one more, at most two more, each a fifth weaker. TC3●●● (extra strikes chain).
- **Plague fists** · L · each hit it lands gives its target one stack of each debuff the wearer holds; the wearer keeps its own. Exotic; carrier◆. *Seen:* bitten by a hellhound, the Monk burns, and so does everything it touches.

#### Wand
- **Conductor's baton** · R · each time the wearer casts an ability, the other ally with the highest Attack has its slowest ability come 5 ticks closer. BA2●●● LS●. *Seen:* the soloist's spell comes round right after the conductor's.
- **Ember wand** · R · its basic attacks add a few Burn to the foe with the most Burn, wherever they land. BF2●●● (a steady feeder on the pile).
- **Wildmagic wand** · R · each of its basic attacks adds a few stacks of one of Burn, Chill, Shock, Bleed and Sunder, at random. Every colour◆; BF● CS● ST● TC●. *Seen:* a row of every icon on each foe.
- **Rising wand** · L · each ability the wearer casts adds a Crescendo: its abilities deal and heal more, and cost more, for each. BA3●●●; crescendo◆. *Seen:* the same name up the log, bigger each time, the mana bar emptying faster.
- **Smoulder wand** · L · while any foe burns, the wearer gains Heat; at full Heat it can't be Stunned or Silenced. BF3●●● (feeding faster, and the fire holds through what used to put it out).

#### Sword
- **Sweeping blade** · R · its basic attacks also hit a second, random foe for half, and those hits add a Shock. ST2●● TC● TL●; hit on many·, red rain·.
- **Avenger** · R · each time a foe hits the ally with the most Aggro, the wearer's next basic attack comes at once, at that foe. TL2●●● (the free seat finishes what the anchor started) BP●. *Seen:* every blow on the wall is answered by the sword beside it.
- **Champion's blade** · R · each time the wearer Taunts, the other ally with the highest Attack has its slowest ability ready at once. BA2●●● TL●● (a well that holds the foes' attention). *Seen:* the shout, and the soloist's great spell in the same tick.
- **Oathkeeper** · L · while it Taunts, its basic attacks also hit every other foe. TL3●● ST●●; hit on many·, red rain·.
- **Wellkeeper's sword** · L · each hit the wearer takes gives the other ally with the least MP MP equal to a fifth of the hit's damage. BA3●●● TL●●; mana given·. *Seen:* every blow on the knight fills the caster's blue bar.

#### Spear
- **Hunting spear** · R · when it lands a killing blow, its ability with the longest cooldown left is ready at once. HU2●●● BA●; reaping◆. *Seen:* a kill, and the spear's great thrust again.
- **Lightning glaive** · R · its basic attacks deal more for each Shock on their target; the Shock stays. ST2●●● LS●; held charge◆. *Seen:* the slow double thrust lands biggest on the most charged foe.
- **Parrying spear** · R · each time the wearer dodges a hit, it strikes the attacker with its spear. TL2●●● TC●●; riposte◆. *Seen:* MISS, and the thrust back.
- **Skyspear** · L · its basic attacks also strike every other foe that holds Shock, for a third. ST3●●● (a blow on everything charged); hit on many·.
- **Pike wall** · L · when a foe hits an ally with less Defense than the wearer, the wearer strikes that foe with its spear. TL3●● BP●● LS●.

#### Axe
- **Executioner's axe** · R · its hits on a foe below a quarter of its HP deal double. HU2●●● (executes).
- **Thirsting axe** · R · each killing blow it lands heals it for a fifth of its max HP. BP2●●● HU●; kill that pays·.
- **Butcher's axe** · R · its crits add several Bleed, and its hits on a bleeding foe drink twice as much. TC2●● BP2●● (the door from Cuts to Pact, through the drink).
- **The Red Feast** · L · its hits heal it for a fifth of their damage, and healing that would take it past full becomes a Shield on it. BP3●● LS●; red stone◆.
- **Headsman's axe** · L · its basic attacks come half as often and deal double; a killing blow readies its next basic attack at once. HU3●●● LS●; heaviest blow·.

#### Bow
- **Huntsman's bow** · R · its basic attacks Mark their target, and while that Mark holds, every ally crits more often on it. HU2●●● TC●.
- **Frostbite bow** · R · its basic attacks add a few Chill; on a foe with many Chill, they add a few Sunder too. CS2●●● LS●.
- **Bloodtrail bow** · R · its basic attacks also loose an arrow at the foe with the most Bleed, for half. TC2●●● HU●. *Seen:* every shot, a second arrow into the wound.
- **Volley bow** · L · its first basic attack each fight, and every fifth after it, is a volley: a full arrow at every other foe too. HU3●● TC●●; hit on many·, opening again·.
- **Fletcher's bow** · L · each crit it lands looses one more arrow at the same foe at once. TC3●● HU3●●; emptied quiver◆. *Seen:* three, four arrows in one tick, until one fails to crit.

#### Rune sword
- **Spellbinder** · R · after each ability the wearer casts, its next basic attack deals double. BA●● ST●● CS● (the tempest's cast and swing).
- **Frostward blade** · R · foes that hit the ally with the most Aggro gain a Chill. TL2●●● CS2●●; frozen gate◆. *Seen:* the pack slows with every blow it lands on the wall.
- **Stormbrand** · R · its basic attacks add a Shock to every foe that holds Chill. ST●● CS●●; held charge· (a frozen foe keeps its charge).
- **Winter's chain** · L · when a foe's Chill shatters, every other foe gains a few Chill. CS3●● ; firecracker string◆. *Seen:* one bursts and the burst runs down the line.
- **Tempest blade** · L · each ability the wearer casts puts a storm on every ally's swings for a while: their basic attacks add a Shock. ST3●●● (a storm that doesn't lift) CS●.

#### Hammer
- **Rootstone hammer** · R · its basic attacks add a few Sunder, from its Defense. LS2●● TL●●.
- **Grudgebearer** · R · each hit the wearer takes adds a Wrath. TL2●●● LS2●●●; reckoning◆ (on an anchor that swings heavy itself). *Seen:* a counter climbs with every bite, and the swing lands for all of it.
- **Bellringer** · R · every third basic attack it lands Stuns its target. LS●● ST●● CS●; foe held still·.
- **Mountainfall** · L · its basic attacks deal extra damage equal to a fifth of its max HP. LS3●●● BP●● (max HP into the blow).
- **Cairnbreaker** · L · its basic attacks deal extra damage equal to a fifth of all the Shield the party holds; the Shields stay. LS3●●● (the stone loads the blow).

#### Mace
- **Penitent's mace** · R · each hit the wearer takes heals the ally with the lowest share of HP for a tenth of the damage. TL2●●● BP●●.
- **Flagellant's mace** · R · each time the wearer heals an ally, it pays a twentieth of its max HP, and its heals are half again as large. BP2●●● TL●.
- **Thurible** · R · each of its basic attacks that lands on a burning foe adds a Burn to every other burning foe. BF2●●● (the torch).
- **Martyr's mace** · L · its basic attacks deal more the lower its HP (half again below 70%, double below half, two and a half times below 30%, triple below 10%); below 30% each basic attack also heals it for the damage. BP3●●●; brink·.
- **Sunhammer** · L · when a burning foe falls, the wearer's next basic attack also strikes every other foe and adds several Burn to each. BF3●● HU●; fuse· (the fire spreads on a kill).

#### Staff
- **Cataclysm staff** · R · every third ability the wearer casts is cast twice; the second is free. BA2●●● BF●● CS●●.
- **Banked staff** · R · its abilities add half again as many Burn, Chill and Shock stacks. BF2●●● CS●● ST● (a cast that flares).
- **Echoing staff** · R · when one of its abilities hits three or more foes, half that ability's cooldown is given back. BA2●● BF●● CS●●; resonance◆.
- **Crescendo staff** · L · each time the wearer casts its first-slotted ability, that ability gains a Crescendo: it deals more and costs more for each. BA3●●●; crescendo◆.
- **Cascade staff** · L · each shatter adds a Cascade; when a foe's Chill shatters, every other foe gains a few Chill for each Cascade. CS3●●● (the cascade); firecracker string◆. *Seen:* each burst sends more cold than the one before.

#### Great weapon
- **Icebreaker** · R · its hits on a Stunned foe deal double. CS2●●● LS●● ST●; foe held still·.
- **Heartsplitter** · R · its basic attacks scale from max HP in place of Attack. LS2●●● BP●● (the door from Pact to Landslide).
- **Bellbreaker** · R · when a foe's Chill shatters, the wearer's slowest ability is ready at once, and its next hit on that foe deals half again as much. CS●●● LS●●●; shatter bell◆. *Seen:* SHATTER, and the great blow right under it.
- **The rolling hill** · L · when one of its hits knocks a foe out, what's left of the damage lands on another random foe, and on, while any is left. LS3●●● HU●●; avalanche◆. *Seen:* one swing, a falling row of numbers.
- **Worldbreaker** · L · its basic attacks come half as often, deal triple, and Stun their target. LS3●●● CS●● ST●●; foe held still·.

### Armor: rares and legendaries

#### Plate
- **Hoarfrost plate** · R · foes that hit the wearer gain a Chill. TL2●●● CS2●●●; frozen gate◆. *Seen:* the pack freezes itself on the wall.
- **Cinder plate** · R · foes that hit the wearer gain a few Burn. BF2●●● (the keeper feeds by being struck) TL●●.
- **Mirror plate** · R · a foe that hits the wearer takes a share of the blow as it was struck, before Defense, Guard, Aegis and Shields. TL2●●● LS2●●; mirror◆. *Seen:* BLOCKED on the wall, the Crush's own number on the Chief.
- **Shelter plate** · R · each hit the wearer takes gives the ally with the lowest share of HP a Shield of a tenth of the blow. TL●● BP●● LS●●; brink◇, Shield made·.
- **Rubble plate** · L · when the wearer's Shield breaks, every foe takes damage equal to the most that Shield held since it last broke, and a Shield of a quarter of that is rebuilt. LS3●●●; detonation◆ (the break and the return together).
- **Thornheart plate** · L · each hit the wearer takes adds a Spite. TL3●●● (Thorns that grow with the beating).
- **The anvil** · L · each hit the wearer takes adds a Wrath to the ally with the slowest basic attack. TL3●●● LS3●●●; reckoning◆ (two units). *Seen:* the hammer's counter climbs with every bite on the anvil.

#### Mail
- **Static mail** · R · foes that hit the wearer gain a few Shock. TL2●●● ST●●; goad◇.
- **Bloodsworn mail** · R · below half its HP, the wearer has Lifesteal and its hits deal a quarter more. BP2●●●; brink·.
- **Gleaming mail** · R · while it holds a Shield, it draws far more. TL●● LS●● TC●; riposte◇ (a draw on the shieldmaiden).
- **Hexweave mail** · R · its hits deal a tenth more for each different debuff the target holds. Every colour·; BF● CS● ST● TC●.
- **Sanguine mail** · L · below half its HP, the healing it receives is doubled; above half, halved. BP3●●; brink·.
- **Bloodbond mail** · L · each time the wearer is healed, every other ally heals a fifth as much. BP3●●● (life as the party's currency).
- **Plaguebearer's mail** · L · each time the wearer is hit while it holds a debuff, the attacker gains one stack of each debuff it holds. Exotic, TL●; carrier◆.

#### Leather
- **Duelist's leathers** · R · each time the wearer dodges a hit, it strikes the attacker with its weapon. TL2●●● TC●●; riposte◆.
- **Shadow mantle** · R · Hidden when each fight starts, for a while; its hits deal half again as much while it's Hidden. HU●●● BP●; two in the dark◆, opening again·.
- **Galecoat** · R · while any foe holds Shock, its basic attacks come a fifth faster. ST2●● TC●.
- **Skald's jerkin** · R · each time the wearer gives an ally Haste or Might, that ally's next basic attack comes at once. TC2●● LS●● (the loader's gift is seen at once).
- **Pack leader's coat** · L · when the wearer lands a killing blow, every ally's next basic attack comes at once. HU3●●●; judge's drum◆.
- **Shroud of the pair** · L · each time the wearer is Hidden, the other ally with the lowest Aggro is Hidden too. TL●● HU●● BP●; two in the dark◆.
- **Frostwalker's furs** · L · when a foe's Chill shatters, the wearer is Hasted, and its next hit adds a Chill to every foe. CS3●●; firecracker string◆ (the small one).

#### Robes
- **Quiet robes** · R · the wearer can't be Silenced. BA2●●● BF●.
- **Bloodweave robes** · R · its abilities cost half their MP, and HP equal to the other half. BP2●●● BA●●; blood mage◆.
- **Robe of the soloist** · R · while it draws less than every ally, its abilities come round a fifth faster. BA2●●● BF●.
- **Glimmer robe** · R · each time an ally gives it MP, its next ability deals a third more. BA2●● ; mana given·.
- **Kindled robes** · L · while any foe burns, the wearer gains Heat. BF3●●●.
- **Archmage's mantle** · L · its abilities cost half again as much MP, and deal, heal and add half again as much. BA3●● BF●● CS●● (mana as damage).
- **Spellshield robe** · L · while it has more than a quarter of its MP, the damage it takes comes out of its MP first. BA3●●● BP●; mana as armour◆. *Seen:* the blue bar takes the blow, and the red doesn't.

### Offhands: rares and legendaries

#### Kite shield
- **Burst shield** · R · when its holder's Shield breaks, the foe whose blow broke it takes damage equal to the most that Shield held. LS2●●●; detonation◆ (the break).
- **Humbling shield** · R · the first time each foe hits its holder, that foe is Weakened. TL●● BP●.
- **Pavise of the keeper** · R · while its holder Taunts, its basic attacks add several Burn. BF2●●● TL●.
- **The great mirror** · L · a foe that hits its holder takes a share of the blow as it was struck, and the share grows with each blow its holder has taken this fight. TL3●●● LS●●; mirror◆ (the mirror grown).
- **Oathbound shield** · L · when a hit would deal an ally more than a quarter of its max HP, its holder takes the hit instead. TL●● BP●●.

#### Round shield
- **Paired shields** · R · whenever its holder is Guarded, so is the other ally lowest in HP share that isn't Guarded. TL●● BP●● LS●.
- **Shield of the sister** · R · whenever its holder gains a Shield, the ally with the lowest share of HP gains a third as much. BP2●● LS●●; brink◇, Shield made·.
- **Phalanx shield** · L · while its holder stands, allies with less Defense than it take a fifth less damage; its holder deals a fifth less. LS●● TL●● (strong everywhere, and it gives something up).
- **Twin shield** · L · whatever its holder gives itself, the other ally with the lowest share of HP gets too. Exotic; borrowed gift◆.

#### Horn
- **War horn** · R · when each fight starts, the ally with the slowest basic attack gains many Might. LS2●●● HU●; heaviest blow·.
- **Rallying horn** · R · each time its holder Taunts, every ally regains a tenth of its max MP. BA2●●● TL●●; mana given·.
- **Horn of the goad** · L · each time its holder Taunts, every foe's next action comes at once. TL3●●● ST3●●; goad◆. *Seen:* the shout, and every foe swings out of turn, sparks and thorns flying off each one.
- **Horn of the charge** · L · when each fight starts, every ally is Hasted and its first action comes at once; its holder starts every fight with every ability on cooldown. HU3●● TC●●; opening again·.

#### Totem
- **Briar totem** · R · foes that hit its holder gain a few Bleed. TL2●●● TC●●; red rain◇.
- **Taunting totem** · R · its holder's hits make their target's next action come at once. ST2●● TL●●; goad◆. *Seen:* every foe the striker touches lashes out at once, and pays for it.
- **Thunderhead totem** · R · each hit its holder takes adds a Shock to every foe. ST2●●● TL●●.
- **Thornfather totem** · L · while its holder stands, every ally has Thorns equal to the holder's. TL3●●● TC●●; red rain·.
- **Lightning totem** · L · each time a foe pays its Shock, every other foe gains a Shock. ST3●●● (a storm that doesn't lift, on the field).

#### Relic
- **Reliquary of the anchor** · R · its holder's heals on the ally with the most Aggro are doubled. TL2●●● BP●.
- **Censer of mana** · R · each time its holder heals an ally, that ally regains MP equal to a tenth of the heal. BA2●● BP●; mana given·.
- **Phylactery** · L · the part of its holder's heals that would go past full becomes a Shield on the healed ally. BP●● LS●●; red stone◆.
- **Bloodstone reliquary** · L · each time an ally pays HP, the ally with the lowest share of HP heals as much. BP3●●● (a price paid becomes a gift).

#### Lantern
- **Bellows lantern** · R · each hit its holder lands on a burning foe adds a tenth of that foe's Burn. BF2●●● (the flare).
- **Lantern of mercy** · R · each time its holder heals an ally, every burning foe gains a Burn. BF●● BP●● (the healer feeds the fire).
- **Wick** · L · when a burning foe falls, all its Burn passes to the foe with the most HP. BF3●●● HU●●; fuse◆. *Seen:* the smallest foe goes up and its whole fire jumps on.
- **Lamp of vigil** · L · after each won fight, one fallen ally stands up with a quarter of its HP. The net, every road●●.

#### Tome
- **Primer of frost** · R · each time its holder adds Chill to a foe, it adds a quarter more for every four stacks that foe already holds. CS2●●●.
- **Book of hexes** · R · when each fight starts, every foe gains a few stacks of two different afflictions, at random. Every colour◆; BF● CS● ST● TC●.
- **Annotated score** · R · each time its holder casts an ability, the next ability the ally with the highest Attack casts costs no MP. BA2●●●; crescendo· (a free cast).
- **Annotated grimoire** · L · each ability its holder pays for makes the next ability any ally casts free. BA3●●● (a cast that pays for the next).
- **Frozen tome** · L · each time a foe's Chill shatters, every ally's slowest ability comes 5 ticks closer. CS●●● LS●● BA●●; shatter bell◆ (for the whole party).

#### Orb
- **Smouldering orb** · R · when a burning foe falls, every other burning foe gains a third of its Burn. BF2●●● HU●; fuse◆.
- **Mana orb** · R · its holder's abilities deal more the fuller its MP: up to half again at full. BA3●● (mana as damage).
- **The deep well** · L · while its holder holds Clarity, its abilities cost no MP. BA3●●●; mana given·.
- **Orb of the second sun** · L · the first ability its holder casts each fight is cast twice; the second is free. BA●● BF●●; opening again·.

#### Idol
- **Leech idol** · R · MP its Siphon takes past its holder's full pool goes to the ally with the least MP. BA●● BP●.
- **Idol of many faces** · R · its holder's hits on a foe with three or more different debuffs drink a fifth of their damage. Every colour·; BP●● (the door from any status road into Pact).
- **Idol of the hungry dark** · L · every so often, it takes one buff from a foe and gives it to its holder. Exotic.
- **Idol of the blood-well** · L · each time its holder pays HP, the ally with the least MP regains as much MP. BA●●● BP●●; blood mage· (the door from Pact into Barrage).

#### Vial
- **Blood vial** · R · its holder's abilities cost half their MP, plus HP equal to their full cost. BP2●●● BA●; blood mage◆.
- **Venom vial** · R · its holder's crits add several Bleed, and it crits more often on a bleeding foe. TC2●●● HU●●; emptied quiver·.
- **Bloodlust draught** · L · its holder starts every fight at half its HP (it pays), and its Lifesteal is doubled until it's full. BP3●●●; brink◆.
- **The last drink** · L · when a fight is won, every ally heals a third of its max HP; its holder pays a tenth of its max HP when each fight starts. BP3●●● (ending the fight full), every road● (strong everywhere, so it costs its holder).

#### Trophy
- **Ogre's tusk** · R · its holder's hits on a foe above half its HP deal a third more. HU●● LS●●.
- **Hunter's tally** · R · each time its holder lands a killing blow, its start-of-fight effects happen again. HU2●●●; opening again◆.
- **Dragon's tooth** · L · its holder's crits strike again for a third of their damage, past Defense. LS●●● HU●.
- **The king's head** · L · when its holder lands a killing blow, every ally's crit chance is doubled for a while. HU3●●●; emptied quiver·.

#### Bell
- **Tempo bell** · R · each time its holder gains Haste, the other ally with the slowest basic attack that isn't Hasted gains it too. TC2●●● BF●.
- **Thunder chime** · R · each time a foe pays its Shock, its holder's next basic attack comes at once. ST2●● TC●.
- **Bell of the beat** · L · each basic attack its holder lands adds a Beat; at five, its first-slotted ability is cast off its cooldown. TC3●● BA3●●; spell on the swing◆. *Seen:* a counter climbs with each swing, and at the top, the spell.
- **Dancer's bell** · L · each time its holder dodges a hit, every ally's next basic attack comes at once. TL●● TC●●●; riposte·.

#### Cloak
- **Shadow cloak** · R · each time its holder dodges a hit, it's Hidden for a moment. TL●● HU●● TC●; two in the dark◇.
- **Hunter's cloak** · R · its holder follows a Mark past any guard, as Seek does, and crits more often on a Marked foe. HU2●●●.
- **Tempest cloak** · L · each time its holder dodges a hit, its next basic attack comes at once and strikes twice. TL●●● TC●●●; riposte·.
- **Swan's grace** · L · once a fight, the blow that would knock its holder out leaves it at 1 HP and Hidden. The net, BP●●; two in the dark·.

### Amulets: rares and legendaries

- **Millstone** · R · basic attacks come half as often and deal two and a quarter times as much. LS2●●● HU●; heaviest blow·. *Seen:* the number is twice the size.
- **Hummingbird charm** · R · basic attacks come twice as often and deal 45% as much. TC2●●● BF● CS● ST●; status on a swing·.
- **Echo charm** · R · the wearer's extra strikes apply what its basic attacks apply (statuses and on-hit effects; not damage boosts or Lifesteal). TC●● BF●● CS●● ST●●; lead's colour·.
- **Bell charm** · R · when a foe's Chill shatters, the wearer's slowest ability is ready at once. CS●●● LS●● BF●● BA●●; shatter bell◆. *Seen:* SHATTER, and the great spell's name right under it.
- **Charged charm** · R · the wearer's abilities deal more for each Shock their target holds; the Shock stays. ST2●●● LS●; held charge◆ (the reader for every class).
- **Red stone charm** · R · healing that would take the wearer past full becomes a Shield on it. TC●● BP●● LS●●; red stone◆.
- **Resounding charm** · R · when one of the wearer's abilities hits several foes, that ability comes 2 ticks closer for each foe it hit. BA2●●● ST●● BF●● CS●●; resonance◆ (for any class with one wide ability). *Seen:* against six wolves the same spell scrolls again and again.
- **Bounty seal** · R · when one of the wearer's abilities knocks a foe out, that ability is ready again. HU2●●● ST● BF● TL●; reaping◆ (a kill reward of the execute's size, for any class). *Seen:* one name scrolls again and again while the foes fall.
- **Heart of winter** · L · every hit the wearer lands adds a Chill. CS3●●● every colour●.
- **Gambler's coin** · L · the wearer's crit chance is about half; its hits that don't crit deal half; hits that always crit still do. Exotic, LS● HU●; emptied quiver·.
- **Blood covenant** · L · the wearer's abilities cost HP in place of MP: the same share of its max HP as they'd cost of its max MP. It won't cast one that would leave it below a tenth of its HP. BP3●●● BA●●; blood mage◆.
- **Second dawn** · L · each time a foe falls, the wearer's start-of-fight effects happen again. HU3●●● every road●; opening again◆. *Seen:* a foe falls and the opening happens again: stone up, Haste on, frost across the field.
- **Downhill charm** · L · when the wearer's hit knocks a foe out, what's left of the damage lands on the foe with the lowest HP. LS●● HU●●; avalanche◆.
- **Borrowed charm** · L · whatever the wearer gives itself, the other ally with the lowest share of HP gets too. Exotic; borrowed gift◆. *Seen:* the Assassin vanishes, and the most hurt ally vanishes with it.
- **Standard of colours** · L · every ally's basic attacks also carry the statuses the wearer's basic attacks carry. BF3●● CS3●● ST3●● TC●; lead's colour◆. *Seen:* three weapons laying the wearer's status.
- **Ready stance** · L · the wearer's abilities start every fight at least half charged; its cooldowns are a fifth longer. BA●● HU●● every road●.
- **Brinkstone** · L · healing that would take the wearer above half its HP goes instead to the ally with the lowest share of HP; while below half, the wearer's hits deal a third more; when a fight is won, it heals a third of its max HP. BP3●●● LS● TL●; brink◆ (held low by giving its healing away). *Seen:* the unit sits at half all fight, its green numbers landing on someone else.

### Formations

A formation is about one thing, says its promise in plain words, and has seats many classes can fill; a seat that reads who sits in it says so. Every road has a common a run could start in, a rare that reads who sits where, and a legendary that changes how the party fights.

**Common**
- **Neutral** · three seats that do nothing.
- **Shieldwall** · Wall: draws far more, Defense up two steps. Behind ×2: draws less. TL1●● LS1●● BF1● ST1●; draw◇.
- **Heavy line** · Hammer: starts each fight with several Might; draws less. Anvil: draws far more; Guarded when each fight starts. Mason: starts each fight behind a Shield, and the Shields it gives are a fifth larger. LS1●●● TL●.
- **Spur** · Pacer: when each fight starts, the other two are Hasted. Blade ×2: basic attacks a fifth faster; HP down. TC1●●● ST●● BF●.
- **Kindling ring** · Keeper: draws far more; Guarded when each fight starts. Feeder ×2: basic attacks add a Burn. BF1●●● TL●. *Seen:* three weapons, two of them leaving fire.
- **Snowline** · Frost ×2: basic attacks add a Chill. Breaker: its hits on a Stunned foe deal a third more. CS1●●●; foe held still·.
- **Squall line** · Squall ×2: basic attacks add a Shock. Rod: draws far more; Thorns. ST1●●● TL●●; goad◇.
- **Hunting party** · Marker: its basic attacks Mark their target. Chaser: everything it does has Seek. Warden: Taunts when each fight starts. HU1●●● TL●. *Seen:* the Marker's target, and every random pick in the party turning to it.
- **Ring of steel** · Beacon: draws far more; Thorns. Reaper ×2: Attack up. TL1●●● ST●.
- **Wellspring** · Soloist: Cooldown up two steps; draws less. Well ×2: regains MP in fights; Attack down. BA1●●●.
- **Blood oath** · Bleeder: pays a little HP every few ticks; its hits deal a third more. Drinker: Lifesteal. Donor: its heals on the Bleeder are doubled. BP1●●●; brink◆ (the Bleeder held low).
- **First light** · everyone's abilities start each fight at least a third ready; everyone has a step less HP. BA●● HU●● every road●.
- **Arrowhead** · Point: crits far more; draws more. Flank ×2: crits more. HU●● TC●● LS●.

**Rare**
- **Hammer and anvil** · Anvil: draws more; Guarded when each fight starts; when its Shield breaks, every foe takes damage equal to the most that Shield held. Hammer: with a slow weapon, its basic attacks come half as often and deal triple; otherwise Attack up. Mason: when it gives another ally a Shield or a Guard, the Hammer gains the same. LS2●●●; detonation◆ (the Anvil), Shield made·.
- **The reckoning** · Anvil: draws far more; each hit it takes adds a Wrath to the Hammer. Hammer: Attack up. Witness: Attack up. TL2●●● LS2●●●; reckoning◆ (two seats).
- **Hearth** · Keeper: Taunts and is Guarded when each fight starts. Stoker: Hasted when each fight starts; basic attacks a fifth faster. Torch: each of its hits adds a Burn to every foe that's already burning. And when a burning foe falls, its Burn passes to the foe with the most Burn. BF2●●● HU●; fuse◆ (the party effect). *Seen:* a foe falls and its fire jumps to the hottest.
- **Hoarfrost line** · Frost: basic attacks add a Chill. Frost: its abilities also add a Chill to the foe with the most Chill. Breaker: when any foe's Chill shatters, its next hit deals triple. CS2●●●; shatter bell·.
- **Thunderhead** · Rod: draws far more; foes that hit it gain a Shock. Squall: each of its hits that lands on several foes at once adds a Shock to each. Striker: its hits deal more for each Shock on their target. ST2●●● TL●; held charge◆ (the seat), goad◇.
- **Wolf's line** · Marker: its hits Mark their target; when the foe it Marked falls, every ally's next basic attack comes at once. Chaser: everything it does has Seek; it crits more on a Marked foe. Warden: Taunts when each fight starts; Guarded whenever a foe falls. HU2●●●; judge's drum◆ (the seat).
- **Thorn hedge** · Anchor: draws far more; Thorns, high. Sting: foes that hit the Anchor gain a few Bleed. Warden: foes that hit the Anchor are Weakened. TL2●●● TC●; red rain◇.
- **The stage** · Soloist: Cooldown up two steps; draws less; while it has more than a quarter of its MP, the damage it takes comes out of its MP first. Conductor: each ability it casts brings the Soloist's slowest ability 5 ticks closer. Well: each ability it casts gives the Soloist as much MP as it cost. BA2●●●; mana as armour◆ (the Soloist).
- **The covenant** · Bleeder: its abilities cost HP in place of MP. Drinker: Lifesteal; its healing past full goes to the Bleeder. Donor: its heals on the ally with the lowest share of HP are doubled. BP2●●● BA●●; blood mage◆ (the seat), red stone·.
- **The colours** · Lead: nothing. Echo ×2: its basic attacks also carry what the Lead's basic attacks carry (statuses and on-hit effects). BF2●●● CS2●●● ST2●●● TC2●●; lead's colour◆. *Seen:* three weapons laying the same status.
- **Knife line** · Opener: crits far more; its crits add several Bleed. Blade ×2: basic attacks a fifth faster; their hits a fifth smaller. TC2●●●.
- **The cadence** · Cadence: each basic attack it lands adds a Beat; at five, its first-slotted ability is cast off its cooldown. Well: regains MP in fights. Pacer: when each fight starts, the Cadence is Hasted. TC2●● BA2●●; spell on the swing◆ (the seat).
- **The lantern** · Light: draws far more; Guarded when each fight starts. Shade ×2: Hidden when each fight starts, for a while. TL●● HU●● BP●; two in the dark◆ (the seats).
- **The wheel** · every so often the wheel turns, and each unit takes the next seat's part. Wall: draws more; Defense up. Blade: basic attacks a fifth faster; crits more. Well: regains MP in fights; heals on it are stronger. Exotic.

**Legendary**
- **The mountain** · Peak: draws far more; Defense and HP up two steps. Hammer: its slowest ability deals extra damage equal to all the Shield the party holds; the Shields stay. Mason: the Shields it gives are half again as large. LS3●●●.
- **The thousand** · every hit a party member lands adds a Cut to it. TC3●●●.
- **The forge** · while any foe burns, every ally gains Heat. BF3●●●.
- **Black ice** · when a foe's Chill shatters, the Chill it held passes to the other foe with the most Chill. CS3●●●; firecracker string◆ (the cascade, for a cold field). *Seen:* one burst, then the next, down the line, each a Stun.
- **The storm front** · every ally's basic attacks add a Shock, all fight. ST3●●●.
- **The pack** · everyone's basic attacks and random-aimed abilities follow the Lead's last target; when that target falls, every ally's next action comes at once. Lead, Packmate, Packmate. HU3●●●; judge's drum·, reaping·.
- **The mirror** · Anchor: draws far more. Keeper ×2: when a foe hits the Anchor, this Keeper strikes it back for a share of the blow as it was struck. TL3●●●; mirror◆ (two seats).
- **The choir** · each ability a voice casts makes the next voice's next ability free. Nobody regains MP from MP regen. BA3●●●; crescendo· (free casts).
- **Blood moon** · every ally's hits heal it for a fifth of their damage, and healing past full goes to the ally with the lowest share of HP. BP3●●●; red stone·.
- **The ambuscade** · everyone's first action comes at once and lands twice as hard; after that, everyone hits a sixth softer. HU3●● ; opening again·.
- **The kinship** · Giver: nothing. Twin ×2: whatever the Giver gives itself, this seat gets too. Exotic; borrowed gift◆ (the seats).

**Retired:** Skirmish line, Long march, Watchtower, Vigil, Relay, Gaol, Reaping line, Pyre of heroes, Knives drawn, The undying, The hurricane (its count is The thousand's), The vise. Each served a build set aside (Phoenix, Lockdown, Harvest, Overflow, Ambush) or never read in play.

### Versions that change

Every other version stays: each already serves a road, a door or the answer to a cast (the Hexer's spellbreaker and the Frostweaver's disabler).

- **Cleric, Last rites, B: Keeper's rites** (replaces Rite of passage, which waited for a fall). Below 30% of its max HP its cooldowns are halved; while the ally foes are most drawn to is below half its HP, they're a third shorter. TL2●●● BP●.
- **Ranger, Frost arrow, A: Shatter shot** (replaces Pinning arrow, which served no road). An arrow at the foe with the most Chill, adding several Chill; when it makes that foe shatter, Frost arrow is ready again. CS2●●●; shatter bell· (the Ranger as its own bell).
- **Ranger, Rending arrow, B: Gutting arrow**, with a reset. An arrow at the foe with the lowest HP, half again below half its HP, double below a quarter; when it knocks that foe out, it's ready again. HU2●●●; reaping◆.
- **Bramble knight, Thicket, A: Goading thorns** (replaces Overgrowth). Taunts and is Guarded, and every foe's next action comes at once. TL2●●● ST●●; goad◆. *Seen:* the hedge shouts and every foe swings into its thorns at once.
- **Paladin, Condemn, B: Swift justice**, with the drum. Marks the foe with the lowest share of its HP, and every ally's next basic attack comes at once; when that foe falls, it Marks the next lowest and the volley comes again. HU2●●● LS●● BF●●; judge's drum◆. *Seen:* a foe falls, the Mark jumps, and three weapons land together on the next.
- **Hexer, Malison, A: Plague** (redone for the new Malison). Adds a few Burn, Shock and Bleed to every foe, then lands the curse. Every colour◆ (the Hexer's own scatter); BF●● ST●● TC●●.
- **Hexer, Malison, B: Focused curse** (redone). The curse on the foe with the most different debuffs alone, three times as hard. Every colour·; HU●●.
- **Pyromancer, Fireball, B: Flashfire**, with the resonance. A quick blast: smaller damage to every foe, and a little Burn on each; its next cooldown is a tenth shorter for each foe it hit. BA2●●● BF●●; resonance◆ (the Pyromancer as its own soloist).
- **Frostweaver, Blizzard, A: Frost armor**, with the gate. Guards every ally; while that Guard lasts, foes that hit a Guarded ally gain a Chill. No damage, and no Chill on every foe. TL2●●● CS2●● LS●; frozen gate◆ (from the Frostweaver, for whoever is struck). *Seen:* the wall Guarded, and every foe that strikes it slowing.
- **Pyromancer, Pyre, B: High pyre** (replaces Pyre of the fallen). Waits until a foe holds many Burn; then heavy damage to the foe with the most Burn, rising more with each stack than the base does. The Burn stays. BF2●●● (a reader that waits for the height).

### Mythics

Kept where the mythic still pulls toward one of the nine; rewritten where it pulled toward a build set aside. None repeats a piece or a version.

| Class | Mythic | Slot | What it does | Pulls toward |
| --- | --- | --- | --- | --- |
| Knight | **Horn of the keep** (rewritten) | offhand (horn) | While the Knight Taunts, each blow it takes gives every other ally a Shield of a tenth of the blow. | LS●●● TL●●; Shield made· (the detonation's stone, from the Toll) |
| Cleric | **Halo of the saint** (rewritten) | amulet | Last rites always holds: the Cleric's cooldowns are always halved. Its abilities cost HP in place of MP, the same share of its max HP. | BP●●● TL●●; blood mage· |
| Ranger | Huntmaster's quiver (kept) | armor (leather) | All the Ranger's abilities aim past any guard at the foe with the lowest HP; when a foe one of them hit falls, the cooldowns left on its abilities are halved. | HU●●●; reaping· |
| Bramble knight | Heartwood mail (kept) | armor (mail) | Whenever a hit lands on any ally, the Bramble knight's Thorns strike the attacker too. | TL●●● TC●●; red rain· |
| Hoplite | The last wall (kept) | offhand (round shield) | When an Aegis the Hoplite gave blocks a blow, the attacker takes the blocked damage, and Aspis is ready again at once. | TL●●● LS●●; mirror· |
| Paladin | **Chains of light** (rewritten) | offhand (relic) | While a foe is Marked, every hit the party lands on it also strikes each other foe that holds a debuff, for a fifth. | HU●●● TC●● every colour●; red rain· |
| Valkyrie | **Stormspear** (rewritten) | weapon (a spear's swing) | Its basic attacks add a few Shock and strike past any guard; each time any foe pays its Shock, the Valkyrie gains a Shield of the damage it took. | ST●●● TL● |
| Bard | Metronome (kept) | offhand (bell) | Counts every hit the party lands; at 20, War ballad, Allegro and Encore are ready at once, and the count starts again. | TC●●● BA●● |
| Hexer | The witch-blade (kept) | weapon | After each ability the Hexer casts, its next three basic attacks hit every foe that holds a debuff. | Every colour●● red rain●● |
| Monk | Ember palms (kept, with the new Heat) | weapon | Every hit the Monk lands adds a Burn; every few ticks it gains a Heat for each burning foe, up to three at a time. | BF●●● |
| Assassin | Night's edge (kept) | armor | When the Assassin lands a killing blow, it's Hidden for a moment, and its next hit deals double. | HU●●● (the vanishing blade) |
| Vampire | **Thrall's chalice** (rewritten) | offhand | Healing that would take the Vampire past full goes, doubled, to the other ally with the lowest share of HP. | BP●●●; brink· |
| Pyromancer | Crown of embers (kept) | amulet | While the Pyromancer stands, every ally's hits add a Burn. | BF●●●; lead's colour· |
| Frostweaver | Glacier's heart (kept) | armor | Whenever a foe's Chill shatters, the Frostweaver puts half of it back on that foe. | CS●●●; firecracker string· |
| Stormcaller | Eye of the tempest (kept) | weapon | Every hit the Stormcaller lands jumps to one more random foe for half its damage; when a foe falls holding Shock, every other foe gains half of it. | ST●●● |
| Geomancer | Mountain's crown (kept) | amulet | Each crit the Geomancer lands rebuilds its own Shield by the damage the crit dealt. | LS●●● (the stonecutter) |

### Kit changes the gaps call for

None. The web below finds no road whose sign needs a kit it doesn't have, and every engine's common half is in a kit or close by. Two gaps are the balance pass's, not the kits': the Frostweaver's Chill counts (its second shatter), and how big Clarity's and Refrain's mana are.

---

## Part 3: each engine's link

What one part makes, what the other reads; the fill sets the numbers on both sides so the two meet. Engines whose parts sit on one unit, or in a kit and a version, are left out.

| Engine | What one part makes | What the other reads | The fill sizes it so |
| --- | --- | --- | --- |
| The shield detonation | Shields, from every source in the party (start-of-fight pieces, hits, casts, the Knight's mythic) | the most a Shield held, when it breaks (Rubble plate, Burst shield) | a start-of-fight Shield's break is seen as a blow on its own, and a party laying stone from three sources out-damages its swings |
| The frozen gate | Chill on whatever strikes the anchor, a stack or two a blow (Hoarfrost plate, Frostward blade) | a shatter (Rime shield, Rimeguard, any shatter payoff) | a pack shatters on the wall within a few of its swings; a boss within a fight |
| The mirror | cover on the anchor (Guard, Aegis, stone) that makes the blow small for the wall | the blow as struck (Mirror plate, The great mirror, The mirror) | the share returned is seen against a boss's Crush, and covered blows still return in full |
| The goad | foes made to act at once (Horn of the goad, Taunting totem, Goading thorns) | each action a foe takes: Shock pays, Thorns and riders land on the blow | each call costs the pack more than the blow costs the anchor, when the anchor wears its toll |
| The held charge | Shock on the field (Arc, Thunderstorm, the swings) and a foe held still (a Stun, a shatter, a rare action) | the Shock on the target (Lightning glaive, Charged charm, Skyfall, Thunderhead's Striker) | a capped charge doubles the reader's blow or more |
| The reckoning | Wrath on the hammer, one a blow the anchor takes (The anvil, The reckoning) | the hammer's next swing, a tenth more a Wrath | a swarm's bites between two slow swings make the swing the fight's biggest number |
| The reaping | a field sunk together (a storm, fire laid thin, thorns, a wide spell) | the lowest foe, and its fall (Coup de grâce, Gutting arrow, Hunting spear) | the execute kills a sunk foe in one, so it chains |
| The judge's drum | the volley: every ally's next swing at once (Swift justice, Wolf's line, Pack leader's coat) | the slowest swing in the party | "at once" on a slow weapon is a whole swing |
| The opening, again | start-of-fight effects on the holder's gear (the uncommons) | a foe's fall (Second dawn, Hunter's tally) | each start effect is worth seeing twice in a fight |
| The fuse | Burn on a foe, piled by the feeders | the fallen foe's Burn (Wick, Smouldering orb) | the jumped fire is most of the next foe's fire |
| The avalanche | a blow far bigger than what it lands on | what's left after the kill (The rolling hill, Downhill charm) | a heavy blow on a wolf runs through two or three more |
| The spell on the swing | swings: a fast kind, Haste, a second strike | the count of swings (Bell of the beat, The cadence) | five swings come round several times a fight on a fast unit |
| The red rain | Bleed on many foes (Briar, Plague, Weeping kris, Briar totem, Thorn hedge) | any hit on many foes | Bleed's per-hit payment on a pack beats the wide hit's own damage |
| The riposte | blows on the dancer (a draw on a dodger) and its Evasion | each dodge (Duelist's leathers, Parrying spear) and its cover by hitting (Shieldmaiden, Lattice mail) | a dodger who draws dodges often enough to answer twice a fight's worth |
| Every colour | many kinds of debuff, a few stacks each (Wildmagic wand, Book of hexes, Plague, Spark charm) | the count of kinds (Malison, Hexweave mail, Idol of many faces) | four kinds roughly double the curse |
| The lead's colour | what the lead's swing carries (a kit, a version, a piece) | the echo seats (The colours) | the second shatter, the fire that stays up |
| The emptied quiver | crits made near certain on some foes (Bleeder's needle, Mercy blade, Quietus, Venom vial) | each crit (Quick draw, Fletcher's bow) | the burst runs three or four and stops on a failed crit |
| The blood mage | casts paid in HP (Blood covenant, Bloodweave robes, Blood vial, The covenant) | Lifesteal on the caster's hits (Batwing charm, the kits) | against a pack the drink outpaces the price; against a boss it doesn't |
| The resonance | many foes hit by one ability | the count of foes hit (Resounding charm, Echoing staff, Flashfire) | against a full pack the spell comes back two or three times as fast |
| The crescendo | casts (the counter) and free casts (Encore, Overcharge, Deep calm, Matins robe, Annotated score) | the Crescendo stacks (Rising wand, Crescendo staff) | each free cast skips a price that would otherwise empty the pool |
| Mana as armour | MP given (Clarity, Refrain, Blood gift, Rallying horn, Wellkeeper's sword) | blows taken (Spellshield robe) | each note of mana reaching it is a heal |
| The shatter bell | shatters on a beat | the shatter (Bellbreaker, Bell charm, Frozen tome, Shatter shot) | the slowest ability rings once a shatter |
| The firecracker string | a cold field (Blizzard, Stillness, Hail, Snowbound folio, Cold orb) | a shatter (Winter's chain, Cascade staff, Black ice, Glacier's heart) | the sent cold takes a cold neighbour to its cap |
| The brink | a unit held low (Brinkstone, Bloodlust draught, Blood oath's Bleeder, a price) | "the ally with the lowest share of HP" (eleven kits, Shelter plate, Guardian's blade) | the givers' cover outlasts what reaches the low unit |
| Two in the dark | two Hidden (Shadow mantle, Shroud of the pair, The lantern, Shadow cloak, Vanish, Smoke screen) | the one left in the light: every pick | the hiding covers most of a fight's picks |
| The red stone | healing past full (a drinker with a fast weapon, Refrain, a Cleric with nothing to mend) | the overheal (Red stone charm, Phylactery, The Red Feast) | a full drinker's swings build a Shield bar it can see grow |
| The borrowed gift | a kit's gift to itself on a short clock | the copy (Borrowed charm, Twin shield, The kinship) | the copy is the same size, so the joke reads |
| The carrier | debuffs on the wearer (the act's foes) | its hits (Plague fists) or its being hit (Plaguebearer's mail) | one stack a hit on a fast unit adds up |

---

## Part 4: the web, checked

### Every rung of every road, by more than one route

For each road and rung, the homes: kits, versions, pieces (U uncommon, R rare, L legendary), formations (seat). Every rung has three or more, across two or more slots or item types.

| Road | 1: the sign and the first step | 2: the build | 3: the far end |
| --- | --- | --- | --- |
| **Landslide** | kits: Bedrock, Phalanx, Shield bash; U: Warden's hammer, Roaring greataxe, Mason's hammer, Carapace charm; common Heavy line, Shieldwall | War horn, Millstone, Heartsplitter, Rootstone hammer, Burst shield, Skald's jerkin; versions Boulder, Breach, Crushing bash, Rousing chorus; Hammer and anvil, The reckoning | Cairnbreaker, Rubble plate, Worldbreaker, The rolling hill, Mountainfall; The mountain; mythics Mountain's crown, Horn of the keep |
| **Thousand Cuts** | kits: Lacerate, Barbed arrow, Briar, Malison's Bleed; U: Weeping kris, Broadhead bow, Wildcat claws, Wasp charm; common Spur | Notched knife, Bloodtrail bow, Venom vial, Butcher's axe, Tempo bell, Hummingbird charm, Briar totem; versions Savage drain, Static grip, Hundred hands, Barbed quiver; Knife line, The cadence | Thousandth cut, Flurry wraps, Fletcher's bow, Bell of the beat; The thousand; mythic Metronome |
| **Bonfire** | kits: Stoke, Smite, Burning fist; U: Brand, Torch mace, Beacon shield, Pitch lantern; versions Kindling, Zeal, Hex of flames; common Kindling ring | Ember knuckles, Ember wand, Thurible, Cinder plate, Pavise of the keeper, Bellows lantern, Banked staff, Smouldering orb; versions High pyre, Slow burn, Fanned flames; Hearth, The colours | Smoulder wand, Kindled robes, Wick, Sunhammer; The forge; mythics Ember palms, Crown of embers |
| **Cold Snap** | kits: Frost lance, Cold hex, Frost arrow; U: Sleet blade, Hailbow, Snowbound folio, Cold orb, Rimeguard; common Snowline | Rime knuckles, Frostbite bow, Primer of frost, Icebreaker, Bellbreaker, Hoarfrost plate; versions Shatter shot, Icicles, Hail, Frost fist; Hoarfrost line, The colours | Cascade staff, Winter's chain, Heart of winter, Frostwalker's furs; Black ice; mythic Glacier's heart |
| **The Storm** | kits: Arc, Gale spear, Thunderstorm; U: Jolt wand, Thunder spear, Spark knuckles, Stormpole, Storm bell; common Squall line | Lightning glaive, Charged charm, Sweeping blade, Galecoat, Thunderhead totem, Thunder chime, Stormbrand; versions Gale storm, Forked arc, Storm's eye; Thunderhead, The colours | Skyspear, Tempest blade, Lightning totem; The storm front; versions Thunderclap; mythics Stormspear, Eye of the tempest |
| **The Hunt** | kits: Hunter's eye, Backstab, Condemn, Gale spear; U: Cutthroat's knife, Dawnshot bow, Signal lantern, Warpaint jerkin, Woodsman's axe, Pole of reach, Tracker's coat; common Hunting party, Arrowhead | Marking knife, Huntsman's bow, Hunting spear, Executioner's axe, Hunter's cloak, Bounty seal, Hunter's tally; K1 (Marked); versions Swift justice, Gutting arrow, Coup de grâce, Quarry, Spear of the hunt; Wolf's line | Quietus, Mercy blade, Pack leader's coat, Headsman's axe, Volley bow, Second dawn, The king's head; The pack, The ambuscade; mythics Night's edge, Huntmaster's quiver, Chains of light |
| **The Toll** | kits: Briar, Thicket, Stand fast (Hold the line); U: Clarion blade, Portcullis, Spinebark pole, Thornmaul, Red ribbon; common Ring of steel, Shieldwall | Briar totem, Hoarfrost plate, Static mail, Avenger, Penitent's mace, Reliquary of the anchor, Frostward blade, Duelist's leathers, Parrying spear; versions Goading thorns, Keeper's rites, Anchor's blessing, Watch the anchor; Thorn hedge, The reckoning | Mirror plate, The great mirror, Thornheart plate, The anvil, Horn of the goad, Thornfather totem; The mirror; mythics Heartwood mail, The last wall |
| **Barrage** | kits: Stand fast, Stillness, Refrain, Blood gift; U: Shepherd's staff, Reveille, Siphon edge, Novice's robe, Mana pearl, Waking wand; common Wellspring, First light | Conductor's baton, Champion's blade, Cataclysm staff, Resounding charm, Echoing staff, Quiet robes, Robe of the soloist, Rallying horn, Annotated score; versions Encore, Reprise, Recharge, Overcharge, Deep calm; The stage, The cadence | Rising wand, Crescendo staff, Annotated grimoire, The deep well, Mana orb, Spellshield robe, Archmage's mantle, Wellkeeper's sword; The choir |
| **Blood Pact** | kits: Bloodlust, Blood drain, Blood gift; U: Hungry axe, Clotting salve, Leech knuckles, Censer mace, Tithing hauberk; common Blood oath | Bloodsworn mail, Gorged claws, Thirsting axe, Blood vial, Bloodweave robes, Flagellant's mace, Butcher's axe; versions Martyr's raise, Penance, Shared feast, Lament, Triage; The covenant | Martyr's mace, Bloodlust draught, Brinkstone, Blood covenant, Bloodbond mail, Bloodstone reliquary, The last drink; Blood moon; mythics Halo of the saint, Thrall's chalice |

### Every engine's keystone from more than one place, and its common half close at hand

| Engine | Keystone's homes | Common half |
| --- | --- | --- |
| Shield detonation | Rubble plate (L), Burst shield (R), Hammer and anvil (R seat) | stone in four kits and nine uncommons |
| Frozen gate | Hoarfrost plate (R), Frostward blade (R), Frost armor (version) | a draw (kits, uncommons); a shatter payoff: Rime shield, Rimeguard (U) |
| Mirror | Mirror plate (R), The great mirror (L), The mirror (L seats); Hoplite's mythic for its own Aegis | cover: Guard, Aegis, stone (kits, Bastion plate, Wardmail, Comrade's targe) |
| Goad | Horn of the goad (L), Taunting totem (R), Goading thorns (version) | foes' own actions cost them: Shock (Stormcaller, Static mail, Stormhide), Thorns (Bramble), Squall line |
| Held charge | Lightning glaive (R), Charged charm (R), Thunderhead's Striker seat; Skyfall (kit) | the storm (Arc, Thunderstorm), a Stun (Shield bash, Tremor, a shatter, Bellringer) |
| Reckoning | Grudgebearer (R), The anvil (L), The reckoning (R seats) | a draw; a slow swing (Phalanx, hammers, great weapons) |
| Reaping | Coup de grâce, Gutting arrow (versions), Hunting spear (R), Bounty seal (R) | a field sunk together: storm, fire, thorns, wide spells (kits) |
| Judge's drum | Swift justice (version), Pack leader's coat (L), Wolf's line (R seat) | Condemn (kit); slow swings |
| Opening, again | Second dawn (L), Hunter's tally (R) | start-of-fight uncommons in fifteen kinds |
| Fuse | Wick (L), Smouldering orb (R), Hearth (R party effect) | the feeders' aim at the hottest (kits), a pack |
| Avalanche | The rolling hill (L), Downhill charm (L) | heavy blows (kits, Millstone, Worldbreaker) |
| Spell on the swing | Bell of the beat (L), The cadence (R seat) | speed: fast kinds, Haste (Wildcat claws, Allegro, Flow), Double strike |
| Red rain | in the kits (Briar, Plague, Malison's Bleed) and Weeping kris, Briar totem, Thorn hedge | wide hits in the kits |
| Riposte | Duelist's leathers (R), Parrying spear (R) | cover by hitting (Shieldmaiden, Drinking palm, Lattice mail, Dancer's vest); a draw on a dodger (Stillness of mind, Over the fallen, Matador's cape, Gleaming mail) |
| Every colour | Wildmagic wand (R), Book of hexes (R), Plague (version); Spark charm (U) as a small one | Malison (kit) and every status the party lays |
| Lead's colour | The colours (R seats), Standard of colours (L); Crown of embers for fire | a swing that carries a status: three kits, five uncommons |
| Emptied quiver | Quick draw (version), Fletcher's bow (L) | crits lifted: Bleeder's needle (U), Venom vial, Mercy blade, Quietus |
| Blood mage | Blood covenant (L), Bloodweave robes (R), Blood vial (R), The covenant (R seat) | Lifesteal on a caster (Batwing charm, U); wide spells (kits) |
| Resonance | Resounding charm (R), Echoing staff (R), Flashfire (version) | wide spells (kits); Recharge |
| Crescendo | Rising wand (L), Crescendo staff (L) | free casts (Encore, Overcharge, Deep calm, Matins robe, Annotated score) |
| Mana as armour | Spellshield robe (L), The stage (R seat) | the mana-givers (kits, five uncommons) |
| Shatter bell | Bellbreaker (R), Bell charm (R), Frozen tome (L), Shatter shot (version, for itself) | shatters (the Frostweaver's kit, Chill on swings) |
| Firecracker string | Winter's chain (L), Cascade staff (L), Frostwalker's furs (L), Black ice (L), Glacier's heart (mythic) | a cold field: Blizzard, Stillness, Hail, Snowbound folio, Cold orb |
| Brink | Brinkstone (L), Bloodlust draught (L), Blood oath (common seat: the Bleeder) | the kits' gifts to the lowest ally |
| Two in the dark | Shadow mantle (R), Shroud of the pair (L), The lantern (R seats); Vanish and Smoke screen (kit, version) | an anchor (kits) |
| Red stone | Red stone charm (R), Phylactery (L), The Red Feast (L) | overheal: a drinker, Refrain, a Cleric |
| Borrowed gift | Borrowed charm (L), Twin shield (L), The kinship (L seats) | a self-gift on a short clock: about half the kits |
| Carrier | Plague fists (L), Plaguebearer's mail (L) | the act's foes: snakes, hounds, spirits, wisps, witches |


### Every door has pieces both sides want

| Door | Pieces both sides want |
| --- | --- |
| Any status road into another, through a second colour on a swing | Wildmagic wand, Book of hexes, Spark charm, Hexweave mail, Echo charm, The colours, Cold orb (fire casts that chill), Stormbrand |
| Thousand Cuts into the Hunt, through the opener's crits | Bleeder's needle, Mercy blade, Venom vial, Weeping kris, Marking knife |
| Thousand Cuts into Blood Pact, through the drink | Butcher's axe, Leech knuckles, Tithing hauberk, Red stone charm |
| Thousand Cuts into Barrage, through speed | Bell of the beat, The cadence, Weaving wand |
| The Toll into Thousand Cuts, through briars | Briar totem, Thorn hedge, Thornfather totem |
| The Toll into Cold Snap, through frost on the anchor | Hoarfrost plate, Frostward blade, Rimeguard |
| The Toll into Landslide, through Defense and stone | Mirror plate, The anvil, Grudgebearer, Spiked plate, Horn of the keep, Shelter plate |
| The Toll into the Storm, through the foes' own clock | Static mail, Stormhide, Horn of the goad, Taunting totem, Squall line |
| The Toll into Blood Pact, through the lowest ally | Shelter plate, Oath targe, Paired shields, Penitent's mace |
| The Storm into Cold Snap, through a held foe | Stormbrand, Icebreaker, Snowline's Breaker, Bellringer |
| The Storm into the Hunt, through the back row and a field sunk together | Thunder spear, Gutting arrow with any storm, Hunting spear, Skyspear |
| The Hunt into Bonfire, through kills | Wick, Smouldering orb, Sunhammer |
| Landslide into Cold Snap, through the heavy blow on a frozen foe | Bellbreaker, Icebreaker, Bell charm, Frozen tome |
| Landslide into Barrage, through the conductor | Conductor's baton, Champion's blade, Skald's jerkin |
| Landslide into the Hunt, through the first strike | Roaring greataxe, War horn, The rolling hill, Pole of reach |
| Barrage into Bonfire, the Storm or Cold Snap, through the soloist | Resounding charm, Echoing staff, Banked staff, Tempest blade, Cataclysm staff |
| Blood Pact into Barrage, through life for mana | Idol of the blood-well, Bloodweave robes, Blood covenant, The covenant |
| Blood Pact into Landslide, through max HP in the blow | Heartsplitter, Mountainfall, Reprisal hauberk |

### Exotics that belong to no road

Plague fists and Plaguebearer's mail (the carrier); Borrowed charm, Twin shield and The kinship (the borrowed gift); Idol of the hungry dark; Gambler's coin; The wheel. Eight, about one in twenty of the rares and legendaries: more than today's five, short of the one in ten loot.md once named.

### Nothing fenced off

Every class can wear pieces on each of its identities' roads (from `builds.md`, *Every class in the set*), counting rares and legendaries only:

| Class | Roads its identities serve, and the rares and legendaries it can wear on each |
| --- | --- |
| Knight | LS (Cairnbreaker, Rubble plate, Burst shield, War horn…), TL (Mirror plate, Avenger, Horn of the goad…), BF keeper (Cinder plate, Pavise of the keeper), ST rod (Static mail is Mail: not worn; Horn of the goad), BA well (Champion's blade, Wellkeeper's sword, Rallying horn) |
| Cleric | BP (Flagellant's mace, Bloodstone reliquary, Bloodweave robes), TL (Penitent's mace, Reliquary of the anchor), BA (Cataclysm staff, Echoing staff, Quiet robes, Censer of mana) |
| Ranger | HU (Marking knife, Huntsman's bow, Hunter's tally, Hunter's cloak), TC (Notched knife, Bloodtrail bow, Fletcher's bow), CS (Frostbite bow, Frostwalker's furs) |
| Bramble knight | TL (Briar totem, Grudgebearer, Hoarfrost plate, Thornfather totem), LS (Rootstone hammer, Cairnbreaker), BP (Penitent's mace, Shield of the sister), TC (Briar totem) |
| Hoplite | LS (Heartsplitter, Worldbreaker, The rolling hill), HU (Hunting spear), ST (Lightning glaive, Skyspear), TL (Pike wall, Mirror plate), BP (Shield of the sister) |
| Paladin | HU (Bounty seal is an amulet; Hunting spear is not worn; the judge reads its kit and Wolf's line), BP (Flagellant's mace, Martyr's mace, Bloodsworn mail), TL (Reliquary of the anchor, Mirror plate), BF (Thurible, Cinder plate, Pavise of the keeper, Sunhammer) |
| Valkyrie | HU (Hunting spear, Hunter's cloak), ST (Lightning glaive, Skyspear, Sweeping blade, Galecoat), BP (Bloodsworn mail, Shield of the sister), TL (Avenger, Parrying spear, Duelist's leathers), TC (Parrying spear, Tempest cloak) |
| Bard | BA (Conductor's baton, Annotated score, Annotated grimoire, Rising wand), LS loader (Skald's jerkin, Conductor's baton), BP (Glimmer robe is Robes; Bloodweave robes), TC (Bloodtrail bow, Tempo bell, Bell of the beat), ST (Thunder chime, Galecoat) |
| Hexer | colour (Wildmagic wand, Book of hexes, Hexweave mail, Idol of many faces), TL (Avenger, Static mail), BF (Ember wand, Smoulder wand), CS (Primer of frost) |
| Monk | TC (Flurry wraps, Tempo bell, Dancer's bell), ST (Lightning glaive, Galecoat, Thunder chime), TL dancer (Parrying spear, Duelist's leathers, Tempest cloak), HU (Hunting spear, Hunter's cloak), CS (Rime knuckles), BF (Ember knuckles) |
| Assassin | HU (Marking knife, Mercy blade, Quietus, Executioner's axe, Hunter's tally), TC (Notched knife, Venom vial, Butcher's axe), BP (Thirsting axe, Blood vial, Bloodlust draught) |
| Vampire | BP (Gorged claws, Thirsting axe, Bloodsworn mail, Blood vial, Bloodlust draught), BA (Leech idol, Idol of the blood-well), TC (Flurry wraps, Butcher's axe) |
| Pyromancer | BF (Ember wand, Banked staff, Bellows lantern, Wick, Smouldering orb, Kindled robes), BA (Cataclysm staff, Crescendo staff, Rising wand, Mana orb) |
| Frostweaver | CS (Cascade staff, Winter's chain, Primer of frost, Frozen tome), TL warden (Frostward blade), BA (Spellbinder, Echoing staff, Spellshield robe) |
| Stormcaller | ST (Stormbrand, Tempest blade, Thunderhead totem, Lightning totem, Galecoat, Thunder chime), BA (Spellbinder), TL rod (Taunting totem, Thunderhead totem, Static mail is not worn), HU (Galecoat) |
| Geomancer | LS (Cairnbreaker, Heartsplitter, Burst shield, Dragon's tooth, The rolling hill), CS breaker (Bellbreaker, Icebreaker), BP (Mountainfall) |

Thin: **the Paladin's judge** has no rare or legendary piece of its own kinds that Marks (the Hunt's Mark pieces are on dagger, bow, lantern, cloak and the amulet); it judges through its kit, Swift justice, Wolf's line and Bounty seal. **The Stormcaller's lightning rod** has the totems but no Mail. Neither is fenced off: each has a road's pieces in reach.

### Each road's sign read in act I

What act I gives: a weapon on nearly every unit, the other slots rarely filled, an ability or two, mostly Neutral. Each road's sign comes from a kit; its first step sits on a weapon (uncommon or rare, which act I offers about equally), a version, or a common formation.

| Road | The sign, from the kit | The first step act I can find on a weapon |
| --- | --- | --- |
| Landslide | the Geomancer's crits, the Hoplite's double swing, the Knight's bash | Warden's hammer, Roaring greataxe, Mason's hammer; commons that swing heavier; Heartsplitter, Rootstone hammer (R) |
| Thousand Cuts | four kits open wounds | the faster kind (commons), Weeping kris, Broadhead bow, Wildcat claws, Leech knuckles; Notched knife, Bloodtrail bow (R) |
| Bonfire | three kits leave Burn | Brand, Torch mace; Ember knuckles, Ember wand, Thurible (R); versions Kindling, Zeal, Hex of flames |
| Cold Snap | three kits lay Chill | Sleet blade, Hailbow; Rime knuckles, Frostbite bow (R) |
| The Storm | Arc, Gale spear | Jolt wand, Thunder spear, Spark knuckles; Lightning glaive, Sweeping blade (R) |
| The Hunt | Hunter's eye, Backstab, Condemn, Gale spear | Cutthroat's knife, Dawnshot bow, Woodsman's axe, Pole of reach, Headsplitter; Marking knife, Huntsman's bow, Hunting spear (R); common Hunting party |
| The Toll | Briar, Thicket, Hold the line | Clarion blade, Thornmaul; Avenger (R); common Ring of steel, Shieldwall |
| Barrage | Stand fast, Stillness, Refrain | Waking wand, Siphon edge, Shepherd's staff; Conductor's baton, Champion's blade, Cataclysm staff (R); common Wellspring |
| Blood Pact | the Vampire; Lifesteal on any hitter | Hungry axe, Leech knuckles, Censer mace, axe commons (Lifesteal); Thirsting axe, Gorged claws (R) |

### How often a run is offered each sign and keystone

**The count.** For each item, its chance per offer is its slot's weight × the chance the offer is for the wearer class (an open offer: two in three for the roster, shared evenly; a shop: the roster; an elite's first legendary: the party) × one over the class's kinds in that slot × one over the pieces of its kind at its rarity; summed over the offers an act makes at that rarity. A version counts as met once its class knows the ability and trains, which by act II is nearly certain for a seated unit. A formation is its rarity's offers in the act over the formations of that rarity.

*The table below is from a small script over this page's lines and tags, kept as scratch outside the repo; the fill's index can rerun the same count by hand.*

**Roads, by route.** A route is the three classes `builds.md` names for it. *Act I step* is the chance a run on that route is offered at least one of the road's rung-1 pieces or formations in act I (its sign is in the kits, so it's there from the start). *The build by act II* is the chance it's offered at least one rung-2 piece or formation by the end of act II. Neither counts versions, which are on offer to any unit that knows the ability.

| Road | Act I step, by route | The build by act II, by route |
| --- | --- | --- |
| Landslide | 48% to 56% | 89% to 96% |
| Thousand Cuts | 49% (its step is mostly the faster kind and Double strike, commons this count leaves out) | 90% to 94% |
| Bonfire | 58% to 63% | 75% to 86% |
| Cold Snap | **37% to 56%** | **72% to 73%** |
| The Storm | 65% to 71% | 84% to 90% |
| The Hunt | 76% to 84% | 69% to 90% |
| The Toll | 65% to 70% | 80% to 89% |
| Barrage | 49% to 67% | 87% to 95% |
| Blood Pact | 56% to 62% | 71% to 84% |

**Engines, on their own roads.** For each engine, its keystone: the chance a run on one of its roads' routes is offered a piece or seat of it by the end of act I and act II; then the same with its kits and versions (a version counted as met once its class has trained by then); and the route that meets it least.

| Engine | By act I / II, pieces and seats | With kits and versions | Least |
| --- | --- | --- | --- |
| Shield detonation | 42% / 68% | the same | 64% |
| Frozen gate | **11% / 18%** | 25% / 42% | the dancer's route, never |
| Mirror | 23% / 41% | the same | the dancer's route, 8% |
| Goad | **12% / 21%** | **19% / 32%** | the Storm without a Stormcaller, never |
| Held charge | 29% / 54% | 44% / 63% | 49% |
| Reckoning | 32% / 57% | the same | 30% |
| Reaping | 21% / 37% | 34% / 52% | 27% |
| Judge's drum | 22% / 44% | 40% / 68% | 30% |
| Opening, again | 24% / 42% | the same | 38% |
| Fuse | 18% / 38% | the same | 30% |
| Avalanche | 22% / 41% | the same | 23% |
| Spell on the swing | 18% / 39% | the same | 30% |
| Red rain | in the kits | 44% (a Bramble knight or a Hexer) | |
| Riposte | **18% / 29%** | the same | 9% |
| Every colour | **10% / 16%** | 26% / 41% | without a Hexer, never |
| Lead's colour | 22% / 46% | the same | 46% |
| Emptied quiver | **7% / 14%** | 37% / 61% (the Ranger's) | without a Ranger or Bard, never |
| Blood mage | 34% / 60% | the same | 56% |
| Resonance | 18% / 33% | 28% / 47% | 27% |
| Crescendo | 20% / 36% | the same | 21% |
| Mana as armour | 22% / 44% | the same | 30% |
| Shatter bell | 27% / 47% | the same | 27% |
| Firecracker string | 25% / 47% | the same | 29% |
| Brink | 32% / 51% | the same | 48% |
| Two in the dark | 32% / 56% | 51% / 66% | 30% |
| Red stone | 24% / 43% | the same | 27% |
| Borrowed gift, carrier | exotics, on no road: a random party is offered each by act II about a third of the time | | |

**A run, on average:** a random party is offered the keystones of about nine engines by the end of act II from pieces and seats, and about eleven with its kits and versions. So a run meets several engines and not all of them, which is what found synergies should be.

**Flagged, rarely offered:**
- **Cold Snap is the road least offered its pieces,** in act I and by act II. Its versions (Icicles, Hail, Frost fist, Shatter shot, Frost armor) are where a run reliably finds it, and its second shatter is the Chill counts' (the balance pass's first job in *Core set: classes*). Adding pieces wouldn't change the share; adding Cold Snap to more of each kind's pieces would, at other roads' expense.
- **The frozen gate, the goad and the riposte** are each under a third on their roads. Each is an anchor's or a dancer's engine, so the routes without one never meet it, which is right; on the anchor routes they're 40% to 60%.
- **Every colour and the emptied quiver** are a class's: the Hexer's and the Ranger's. With that class, they're met in most runs (its kit, Plague, Quick draw); without it, almost never. `builds.md` writes every colour "through the Hexer" and the quiver on the Ranger's Quick draw, so this holds as designed.
- **The crescendo** is a Barrage soloist's, on two legendaries: about a third of Barrage runs.

**How the count could be wrong.** The offer volumes are the simulated player's, whose path choices (elites, shops) and roster differ from a person's. The class share assumes the roster is shared evenly. A version is counted as met once its class knows the ability, which holds because training offers every option; **if training opportunities become three choices** (the director's stated intent, not built), a version-held keystone is met about a third to a half as often, and the reaping, the judge's drum, the frozen gate and the emptied quiver lean on versions most.

---

## Least sure

- **The counts.** 314 pieces, each met less often than today's. The argument is that a road is offered by the share of a kind's pieces that serve it, not by the count, so more variety costs a road nothing; the cost is that a specific piece, and so a specific piece-held keystone, comes round less. If the director would rather each piece be met more, the weapons can go back to two uncommons and two rares (96 weapons), and armor to three of each, with no road losing a step it has.
- **Marked on random picks** (K1) may make the Hunt too easy to fall into: every random bolt, arrow and bash in a party with one Mark source turns to the Mark, Neutral formation included.
- **The new rules that call foes' actions early** (the goad, Taunting totem) speed the foes up, which a player may never choose; and the Taunting totem on a Stormcaller calls two foes a swing.
- **Black ice** can take a cold field down in one tick (each shatter caps the next foe at once). That's the cascade, but it may read as one burst, not a string.
- **Heat as speed** changes Ember palms and every Heat piece; Bonfire's far end is now "faster", and its "holds through what used to put it out" is Smoulder wand's immunity alone.
- **Generic strength.** Ready stance, Second dawn, The last drink, Lamp of vigil and First light help every build; each gives something up or is narrow in its wearers, but the fill should look again.
- **Cards that may read alike** for a class that wears both kinds (a Shield at the start on several kinds, "first hit" effects on the bow, axe and Leather). The spine checked the pairs it could see; the fresh read and the fill's index check the rest.
- **The Paladin's judge** has no Mark piece of its own kinds; it judges through Condemn, Swift justice, Wolf's line and the amulets.
- **Malison's few Bleed** are kept by assumption (Kit changes).
