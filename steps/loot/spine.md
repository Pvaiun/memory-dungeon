# The loot pass: the spine

The lead's design for the loot the nine builds need (`docs/gear-design/builds.md`), one line an item, for gate 1. Nothing here is built, and the fill sets every number. The director's intent is in `intent.md`; the brief this follows is `brief.md`; the report for the gate is `report.md`.

**How to read it.**
- **The rules** come first: the stock, the new words, the rules the pieces bend, and the code support, each named once.
- **The lines** follow, in the order they were written: the two kit changes, the parts that recur, then the gear kind by kind, the formations, the versions and the mythics.
- **A line** reads: name · kind · rarity · what it does, in plain words. *Sees:* is what the player sees when it fires, on a road's first step and an engine's keystone.
  - After **→**, the roads it serves: a rung (1, 2 or 3) where it's that road's step, and its worth there (● a little, ●● some, ●●● a lot). `Cuts` is Thousand Cuts, `Snap` Cold Snap, `Pact` Blood Pact. A piece can also be `net` (falls and returns), `first move`, `foes do less`, `stops a cast` or `exotic`: builds.md's elements, and the pieces that belong to no road.
  - After **⚙**, the engines it's part of: `key` for a keystone, `half` for the common half.
  - After **◆**, the recurring parts it is.
  - None of this is ever on a card. Names are working names.
- **The tables** between `<!-- markers -->` are written by `npx tsx steps/loot/web-check.ts --write` from the lines, so they can't drift from them.

## The rules

### The stock

**A cell is one kind at one rarity, and an offer picks one piece from a cell.** So a cell's size doesn't change how often its kind is offered. It changes how often each piece in it is met. Three things follow, and they set every count below:
- **A cell holds what its wearers' roads ask of it, and no more.** A kind worn by three classes on seven roads gets more uncommons than one worn by two classes on three.
- **A first step is a thread, not a piece.** No single uncommon is met often (about one act in six for a class that can wear it), so each road's first step sits in six to fifteen pieces across as many kinds, and the amulet, which everyone wears, holds a first step for most roads.
- **One legendary is enough where one is enough.** A lone legendary is offered every time its cell is rolled; a second one halves both.

<!-- stock:start -->
| Kind | Wears | Common | Uncommon | Rare | Legendary | In all |
| --- | --- | --- | --- | --- | --- | --- |
| Dagger | 2 | 2 | 3 | 3 | 3 | 11 |
| Fist weapons | 3 | 2 | 4 | 3 | 2 | 11 |
| Wand | 3 | 2 | 3 | 3 | 2 | 10 |
| Sword | 3 | 2 | 3 | 4 | 1 | 10 |
| Spear | 3 | 2 | 3 | 3 | 1 | 9 |
| Axe | 2 | 2 | 3 | 3 | 2 | 10 |
| Bow | 2 | 2 | 3 | 2 | 2 | 9 |
| Rune sword | 2 | 2 | 3 | 3 | 2 | 10 |
| Hammer | 3 | 2 | 3 | 2 | 1 | 8 |
| Mace | 3 | 2 | 3 | 3 | 1 | 9 |
| Staff | 3 | 2 | 3 | 2 | 1 | 8 |
| Great weapon | 3 | 2 | 3 | 3 | 2 | 10 |
| **Weapons** | | **24** | **37** | **34** | **20** | **115** |
| Plate | 5 | 3 | 4 | 3 | 2 | 12 |
| Mail | 6 | 3 | 4 | 4 | 1 | 12 |
| Leather | 6 | 3 | 4 | 5 | 2 | 14 |
| Robes | 5 | 3 | 4 | 4 | 2 | 13 |
| **Armors** | | **12** | **16** | **16** | **7** | **51** |
| Kite shield | 3 | 2 | 3 | 3 | 1 | 9 |
| Round shield | 3 | 2 | 3 | 3 | 1 | 9 |
| Horn | 2 | 2 | 3 | 3 | 1 | 9 |
| Totem | 2 | 2 | 3 | 3 | 1 | 9 |
| Relic | 2 | 2 | 3 | 3 | 1 | 9 |
| Lantern | 2 | 2 | 2 | 2 | 2 | 8 |
| Tome | 3 | 2 | 3 | 3 | 2 | 10 |
| Orb | 2 | 2 | 2 | 3 | 2 | 9 |
| Idol | 2 | 2 | 2 | 3 | 2 | 9 |
| Vial | 2 | 2 | 2 | 3 | 1 | 8 |
| Trophy | 3 | 2 | 2 | 3 | 1 | 8 |
| Bell | 3 | 2 | 2 | 2 | 1 | 7 |
| Cloak | 3 | 2 | 2 | 3 | 1 | 8 |
| **Offhands** | | **26** | **32** | **37** | **17** | **112** |
| Amulet | everyone | 10 | 8 | 10 | 10 | 38 |
| **All** | | **72** | **93** | **97** | **54** | **316** |
<!-- stock:end -->

Plus the 12 plain weapons and the 16 mythics. Today's stock is 272, in even quarters of 68.

**Why each rarity moved:**
- **Commons, 72 (from 68).** Two a weapon and offhand kind, three an armor type, as today. The amulet goes from six to ten: its four uncommons that were a special stat with a small rider (Lifesteal, Thorns, Double strike) become commons, since a special stat alone is a common's step, and Lifesteal on an amulet is Blood Pact's sign for any class.
- **Uncommons, 93 (from 68).** They carry nine roads' first steps and the engines' common halves, and two a kind couldn't hold them. Three a kind as the standard; four on the fist weapons and on each armor type; two on seven offhand kinds, where two first steps were all their wearers' roads asked; eight on the amulet.
- **Rares, 97 (from 68).** An engine's keystone is a rare wherever it's a road's second rung: two dozen of today's legendary effects move down to rare, because a keystone has to be met while its other half is still close at hand. Its grown form stays legendary.
- **Legendaries, 54 (from 68).** The far ends and the exotics. Fewer, so each is met more often: a full run is offered about twenty legendaries, which is three in ten of today's and nearer four in ten of these.

**What stays of today's loot.** A piece stays where it serves a road or an engine: about half the rares and legendaries keep a card of today's, many at a new rarity or a new size. The pieces made for the builds that were set aside go: the falls (Phoenix), the wait for a wind-up (Lockdown), spread for its own sake (Harvest), the mana relay (Overflow) and the opening with no tail (Ambush). What they had that the nine use is kept under its new road: the kill rewards and openers in the Hunt, the wide hits in each road's pack game, the mana links in Barrage.

**Formations: 36 and Neutral** (13 common, 12 rare, 11 legendary; today 32). Every road has one at each rarity; three commons are shared ground; six carry an engine or an exotic.

**Versions: 11 of 128 change. Mythics: 4 of 16 change. Kits: the two approved changes, and no other.**

### New words

- **Marked** takes the party's random picks (the first kit change, below). Its length stays its own (`STATUS.marked`).
- **Counters:** six, each a status of its own with one meaning, shown as an icon with a number and kept for the fight.
  - **Cuts:** hits landed. Thousand Cuts' far end.
  - **Heat:** speed that builds: its holder acts faster in everything, a stack. Bonfire's far end, and the kill that speeds up the next. It takes over what Tempo did; what it did before (damage a stack) goes.
  - **Spite:** blows lived through. The Toll's far end: Thorns that grow, and the mirror that grows.
  - **Charge:** hits saved for one blow, then spent. The reckoning.
  - **Crescendo:** times a spell has been cast this fight. Each makes it land harder and cost more.
  - **Cascade:** shatters this fight. Each sends on more cold than the last.
  - Tempo, Surge and Fervor go, with the pieces that used them.
- **Phrases a card needs once, each with one meaning:**
  - **"Carrying what the swing carries":** an extra hit that applies the statuses and on-hit effects the basic attack applies, not its damage boosts.
  - **"As it was struck":** a blow's size before Defense, Guard, Aegis and Shields took their share.
  - **"What a killing blow has left over":** its damage past the HP its foe had left.
  - **"Start-of-fight effects":** everything on a unit that says "when each fight starts", from its gear, its seat and its kit.
  - **"Affliction":** only on the carrier's two pieces: a debuff its holder can hold in stacks.

### The rules the pieces bend or add

- **A status on a swing is an uncommon's effect.** Today's plain riders are rares. They move down, sized to be seen (a few a swing on a fast kind, several or many on a slow one), because they're the four status roads' first step. No rare is a rider made bigger.
- **A plain rider may sit in more than one kind, when no unit could hold both, sized to each kind's swing.** *Same card, two places* (`loot.md`) is read as being about one unit's choice. builds.md asks for fire on swings "for many kinds", and cold and charge "for the fast kinds", so the same rider has to exist more than once. Flagged for the gate.
- **Aegis and Hidden appear on gear and seats,** as `docs/rules.md` now allows: Aegis on one legendary, Hidden on five pieces and one formation.
- **"All fight" means renewed as it runs out.** A piece or seat that Taunts all fight, and the storm that doesn't lift, lay the status again each time it ends. The status keeps its own length.
- **Kept from today:** extra strikes that chain; a hit taken for an ally; effects after a won fight (now also a heal, on two items); Taunt ends Hidden; paying HP isn't damage.
- **Added for the engines** (each is one rule on a card, and each is in the code support below): a foe's swing called early; retaliation sized by the blow as it was struck; damage carried past a kill; damage taken from MP; an ability cast by a count of swings; start-of-fight effects that happen again; a status passed on by its holder; an ability brought back by the foes it hit; a swing that carries another unit's riders; a gift to oneself shared with an ally; a cap on healing at half HP.
- **What no piece does:** grant an ability; apply a status for less or more than its own length; spend, shorten or set off a status; want a fall; read a number the player can't see.

### Code support

Named once, so the fill can name it. "New" means no item does it today.

1. **Marked steers abilities** aimed at a random foe, inside the Taunt rule. New (a rule).
2. **A count of different debuffs on a target** as a size: Malison, Hexweave mail. As today's Hexweave mail.
3. **A foe's next basic attack called at once:** the goad's four places. New.
4. **A reaction that reads a blow before mitigation,** and one that reads what the cover stopped: the mirror's places. New; today's The last wall reads what an Aegis blocked.
5. **Damage carried past a kill** into another foe: the avalanche's two pieces. New.
6. **Damage taken from MP first:** mana as armour's two pieces. New.
7. **An ability cast by a count of basic attacks,** off its cooldown, the mana paid (Bell of the hour); a swing that cuts a named ability's cooldown (Baton). New; today's Metronome counts hits to ready abilities.
8. **Start-of-fight effects fired again** on a foe's fall: the opening, again. New.
9. **A status moved:** a fallen foe's Burn to another foe, and a shattered foe's cold sent on, as today's Wick and Winter's chain; the wearer's own afflictions onto what it hits, and a whole debuff handed on (the carrier's two pieces). The last two are new.
10. **An ability's cooldown cut by the foes it hit:** the resonance. New.
11. **A per-ability cast count that raises its size and its cost:** Crescendo. New.
12. **Riders copied between units:** a seat or a wand that carries another unit's basic-attack riders (The standard, Mimic wand); a seat that lays its riders on whatever strikes another seat (Toll gate); an extra hit "carrying what the swing carries". Today's Echo charm does the last on one unit; across units is new.
13. **A status a unit gives itself, copied to an ally:** the borrowed gift's two places. New.
14. **Healing capped at half HP,** and healing past a cap sent elsewhere: Halved heart, the Bleeder seat, The chalice, Shared cup. New. Healing past full into a Shield is today's Phylactery.
15. **A counter one unit fills and another spends** (Hammer and anvil), and counters the party shares (The whetstone's Cuts, Cascade). Today's Metronome is a party count; the shared spend is new.
16. **A blow landed a second time** (Twinfall), as today's Dragon's tooth does for crits.
17. **Reaction strikes on new triggers:** when a foe holding Shock acts (Answering thunder); at every foe that has hit the wearer since its last swing (Sarissa). Strikes on a hit taken and on a dodge are today's Pike wall and Duelist's leathers.
18. **Reading the party's whole Shield** (Cornerstone hammer, The mountain) and the field's whole Shock (Stormbrand, the Bolt seat). New; today's Cornerstone maul reads its wearer's own Shield.
19. **Marks from new events:** on a crit, on a heal (at the foe that last hit the healed ally), at the fight's start. Moving a Mark at a fall is today's Gravemark. "The foe that last hit an ally" and "the foe its wearer last hit" are a memory the engine doesn't keep yet.
20. **Costs in HP** for a whole party (The covenant) and for heals alone (Heart of the saint), as today's Blood covenant; a heal after a won fight, beside today's stand-ups.
21. **Small ones:** two stats swapped (Turncoat charm); the most Burn any foe has held this fight (Everflame lantern); a state that ends at the first hit taken (Glass dagger); MP gains sent to another seat (The cathedral).

## The lines

### The two kit changes already approved

Everything after these reads them.

- **Marked** · vocabulary · kit change · A Marked foe takes the party's random picks: basic attacks, as today, and every ability aimed at "a random foe" (Shield bash, Barbed arrow, Bramble lash, Spear thrust, Gale spear, Garrote, Blood drain, Chain lightning's first strike, Rockfall, Tremor), inside the Taunt rule, with Seek following the Mark past a Taunting foe. An ability with a target phrase of its own keeps it. *Sees:* a Mark lands, and everything the party was going to throw anywhere lands on one foe.
- **Malison** · Hexer · kit change · Curses every foe: a hit, from Attack, that deals more for each different debuff the foe holds, and adds a few Bleed. It no longer adds a stack of each affliction. *Sees:* the curse's number is biggest on the foe with the longest row of icons.
  - **An assumption, to confirm:** every debuff in the vocabulary counts, each kind once (Bleed, Burn, Chill, Shock, Sunder, Weaken, Slow, Stun, Silence, Rot, Marked). So the Hexer's own kit reaches four alone (its Chill, its Bleed, Enfeeble's Weaken and Sunder), which is what lets it do something by itself. If only the four statuses' colours should count, it's one line.

### The parts that recur

builds.md's nine parts, each in several engines. They were written first, so a run holding one has more than one partner to meet. The kits hold many of them already; these are the pieces that add to the kits. Each piece's line is under its kind.

<!-- parts:start -->
| A part | Where it sits |
| --- | --- |
| A Shield made by what a unit already does | *Uncommon:* Trophy spear (spear), Mason's hammer (hammer), Scabbed mail (mail), Glyphed robe (robes), Hooded cloak (cloak)<br>*Rare:* Red stone mail (mail), Phylactery (relic) |
| A draw on one unit | *Uncommon:* Portcullis (plate), Watch horn (horn), Challenger's token (amulet)<br>*Rare:* Challenger's plate (plate) |
| A status on a swing | *Uncommon:* Weeping kris (dagger), Sleet dirk (dagger), Live-wire knuckles (fist), Cinder wraps (fist), Rime knuckles (fist), Spark wand (wand), Jolt wand (wand), Rimed blade (sword), Jolt spear (spear), Ragged axe (axe), Broadhead bow (bow), Frostbite bow (bow), Sleet blade (rune sword), Censer mace (mace), Tinder charm (amulet) |
| A hit on many foes | *Uncommon:* Ringing bell (bell)<br>*Rare:* Chain wand (wand), Oathkeeper (sword), Storm pike (spear), Volley bow (bow), Conductor's blade (rune sword) |
| A foe held still | *Uncommon:* Bellringer (hammer)<br>*Rare:* Still hand (fist), Icebreaker (great weapon), Rubble shield (kite shield), Vulture's skull (trophy)<br>*Legendary:* Worldbreaker (great weapon) |
| A kill that pays | *Uncommon:* Second thrust (dagger), Trophy spear (spear), Reaver's axe (axe), Harvest scythe (great weapon), Hunter's buckler (round shield), Bull's horn (horn), Charnel icon (relic), Mana pearl (orb), Hunter's skull (trophy)<br>*Rare:* Hunting spear (spear), Thirsting axe (axe), Pack leader's coat (leather), Dawn runner's coat (leather), Hunting horn (horn), Shadow cloak (cloak), Bounty charm (amulet)<br>*Legendary:* Headsman's axe (axe), The king's head (trophy) |
| The slowest, heaviest blow | *Uncommon:* Warden's hammer (hammer), Roaring greataxe (great weapon), Heartsplitter (great weapon), Harvest scythe (great weapon), Spiked kite (kite shield), Millstone (amulet)<br>*Rare:* Grudgebearer (hammer), Mountainfall (hammer), Overrun (great weapon), Thunderhead maul (great weapon), War horn (horn)<br>*Legendary:* Headsman's axe (axe), Worldbreaker (great weapon), Twinfall (great weapon) |
| The ally with the lowest share of HP | *Uncommon:* Mercy's edge (sword), Mender's mace (mace), Vesper staff (staff), Comrade's targe (round shield), Bear fetish (totem), Charnel icon (relic) |
| A cast that's free, or mana given | *Uncommon:* Tithe wand (wand), Wellblade (rune sword), Shepherd's staff (staff), Matins robe (robes), Acolyte's robe (robes), Font relic (relic), Mana pearl (orb), Leech idol (idol), Clear-headed charm (amulet)<br>*Rare:* Spellbinder (rune sword), Twice-told tome (tome)<br>*Legendary:* Annotated grimoire (tome), The deep well (orb) |
<!-- parts:end -->

What the nine come to, in this stock:
- **A Shield made by what a unit already does** is five uncommons: by hits (Mail, the hammer), by dodges (the cloak), by casts (Robes), by kills (the spear). Healing past full is the red stone's two rares.
- **A draw** is on the amulet (Taunt at the start, for any class), the horn (a Taunt whenever an ally is in trouble) and Plate (Aggro while healthy; a Taunt all fight as its rare).
- **A status on a swing** is fifteen uncommons: twelve riders in nine weapon kinds, Tinder charm on the amulet, which follows whatever colour the party has started, and two openers that wound by crit or first hit.
- **A hit on many foes** is the bell's ring as the uncommon, and five rares that fan a swing out (a wand, a sword, a spear, a bow, a rune sword). Each carries what the swing carries, so none is a slot spent on one more foe.
- **A foe held still** is the hammer's fourth swing as the uncommon. The pieces that read a held foe are rares.
- **A kill that pays** is nine uncommons, each paying a whole action or a visible status: the next swing at once, a doubled hit, Haste, a Shield, a Heat, mana, a heal.
- **The slowest, heaviest blow** is Millstone on the amulet, as an uncommon, so any class can be the hammer, and five more that make a heavy blow heavier.
- **The ally with the lowest share of HP** gets six uncommon gifts beside the eleven kits': a heal on a beat, a Shield on a beat, a Guard when it drops, a heal with each swing, cast or kill.
- **A cast that's free, or mana given** is nine uncommons across eight kinds.

### The gear, kind by kind

Every uncommon, rare and legendary piece has a line here. A kind's header says who wears it, its signature stat, the rule its commons are written by, and what its pieces' stats lean to on each road.

#### Weapons

##### Dagger
*Wears:* Ranger, Assassin. *Signature:* Crit chance. *Stats lean:* the Hunt to Crit chance and Crit damage; Thousand Cuts to Attack speed; Cold Snap to Attack speed and Accuracy.
- *Commons (2):* one leans to Crit chance and Attack speed, one to Crit chance and Crit damage.
- **Weeping kris** · dagger · uncommon · Its first hit on each foe adds several Bleed. *Sees:* a wound on every foe it touches, and the party's hits on each print twice. → Cuts 1 ●●, Hunt ● ⚙ red rain (half) ◆ swing-status
- **Sleet dirk** · dagger · uncommon · Its basic attacks add a few Chill. *Sees:* a second counter climbing on the foes, and their swings coming later. → Snap 1 ●● ⚙ lead's colour (half) ◆ swing-status
- **Second thrust** · dagger · uncommon · When it lands a killing blow, its next basic attack comes at once and always crits. *Sees:* a kill, and the next foe struck in the same tick. → Hunt 1 ●●, Cuts ● ◆ kill-pays
- **Marking knife** · dagger · rare · Its crits Mark their target. *Sees:* the crit that opens a wound calls the whole party onto it. → Hunt 2 ●●●, Cuts ●●
- **Bloodscent knife** · dagger · rare · Its hits on a bleeding foe crit far more often. *Sees:* a run of crits on any wounded foe. → Cuts 2 ●●●, Hunt ●● ⚙ emptied quiver (key)
- **Ambush knife** · dagger · rare · Its hits on a foe that hasn't acted yet this fight always crit. *Sees:* every blow of the first moments is a crit. → Hunt 2 ●●●, Cuts ● ⚙ emptied quiver (key)
- **Thousandth cut** · dagger · legendary · Each hit it lands adds a Cut, kept for the fight. Its hits deal more for each Cut. → Cuts 3 ●●●, Snap ●, Storm ●
- **Quietus** · dagger · legendary · When each fight starts, it strikes every foe once, at once. → Hunt 3 ●●●, Cuts ●● ⚙ red rain (half)
- **Glass dagger** · dagger · legendary · Its hits deal triple until its wearer is first hit in a fight. → Hunt ●●, exotic ⚙ two in the dark (half)

##### Fist weapons
*Wears:* Monk, Vampire, Stormcaller. *Signature:* Double strike. *Stats lean:* Thousand Cuts and the Storm to Attack speed and Double strike; Blood Pact to Lifesteal and HP; the Toll's dancer to Evasion.
- *Commons (2):* one leans to Double strike and Attack speed, one to Double strike and Lifesteal.
- **Live-wire knuckles** · fist · uncommon · Its basic attacks and extra strikes add a few Shock. *Sees:* a second unit charging the field, and foes hurt as they swing. → Storm 1 ●●, Toll ● ⚙ lead's colour (half), held charge (half) ◆ swing-status
- **Cinder wraps** · fist · uncommon · Its basic attacks and extra strikes add a few Burn. *Sees:* the fire's number standing twice as high. → Bonfire 1 ●●, Cuts ● ⚙ lead's colour (half) ◆ swing-status
- **Rime knuckles** · fist · uncommon · Its basic attacks and extra strikes add a few Chill. *Sees:* the frost counter climbing between casts. → Snap 1 ●●, Cuts ● ⚙ lead's colour (half) ◆ swing-status
- **Lamprey claws** · fist · uncommon · Each extra strike it lands heals its wearer (from max HP). *Sees:* a green number with every second strike. → Pact 1 ●●, Cuts 1 ●
- **Gorged claws** · fist · rare · While its wearer is below half its HP, its basic attacks come a third faster. → Pact 2 ●●●, Cuts ●● ⚙ brink (half)
- **Bellows wraps** · fist · rare · Each hit it lands on a burning foe raises that foe's Burn by a tenth of what it holds. *Sees:* a fast unit's blows make the fire climb on its own. → Bonfire 2 ●●●, Cuts ●
- **Still hand** · fist · rare · Its hits on a Stunned foe strike twice. → Snap 2 ●●, Cuts ●●, Landslide ● ◆ held
- **Flurry wraps** · fist · legendary · Its extra strikes can strike again: each rolls Double strike for one more, each a little weaker than the last. → Cuts 3 ●●●, Storm ●●, Pact ●
- **Answering thunder** · fist · legendary · Each time a foe that holds Shock acts, the wearer strikes it with a basic attack, if it's free to. → Storm 3 ●●●, Cuts ●●, Toll ●

##### Wand
*Wears:* Bard, Hexer, Pyromancer. *Signature:* Cooldown. *Stats lean:* Barrage to Cooldown and Cast speed; Bonfire, Cold Snap and the Storm to Attack speed and Attack; the Bard's songs to Cooldown and MP regen.
- *Commons (2):* one leans to Cooldown and Attack speed, one to Cooldown and MP regen.
- **Spark wand** · wand · uncommon · Its basic attacks add a few Burn. *Sees:* a steady fire under the casts' leaps. → Bonfire 1 ●●, Cuts ● ⚙ lead's colour (half), every colour (half) ◆ swing-status
- **Jolt wand** · wand · uncommon · Its basic attacks add a few Shock. *Sees:* a second unit's charge on the foes, paid when they act. → Storm 1 ●●, Toll ● ⚙ lead's colour (half), every colour (half), held charge (half) ◆ swing-status
- **Tithe wand** · wand · uncommon · Each basic attack it lands gives the ally with the least MP some MP. *Sees:* the caster's blue bar ticking up between its spells. → Barrage 1 ●● ⚙ mana as armour (half) ◆ free-cast
- **Chain wand** · wand · rare · Its basic attacks also strike two other foes for half, carrying what the swing carries. *Sees:* one swing, three numbers, three foes charged or burning. → Storm 2 ●●●, Cuts 2 ●●, Bonfire ●●, Snap ●● ⚙ red rain (half) ◆ wide-hit
- **Crescendo wand** · wand · rare · Each time its wearer casts the same ability again in a fight, that ability deals more and costs more than the time before (Crescendo). *Sees:* the same name up the log with a bigger number each time, and the blue bar emptying faster. → Barrage 2 ●●● ⚙ crescendo (key)
- **Mimic wand** · wand · rare · Its basic attacks carry whatever the last ally's basic attack on that foe carried. *Sees:* the wand lays the same status its neighbour's weapon does. → Bonfire 2 ●●, Snap 2 ●●, Storm 2 ●●, Cuts ● ⚙ lead's colour (key), every colour (half)
- **Wildmagic wand** · wand · legendary · Each of its basic attacks adds a few stacks of one of Burn, Chill, Shock, Bleed and Sunder, at random. *Sees:* a different icon with every swing, until each foe wears a row of them. → exotic, Bonfire ●, Snap ●, Storm ●, Cuts ● ⚙ every colour (key)
- **Baton** · wand · legendary · Each basic attack it lands takes a fifth off the cooldown left on its wearer's first-slotted ability. *Sees:* the spell's name comes round on the beat of the swings. → Barrage 3 ●●●, Cuts ●● ⚙ spell on the swing (key)

##### Sword
*Wears:* Knight, Hexer, Valkyrie. *Signature:* Attack. *Stats lean:* the Toll to HP, Defense and Aggro; the Hunt and the Storm to Crit chance; Barrage's well and Blood Pact to HP.
- *Commons (2):* one leans to Attack and Crit chance, one to Attack and HP or Aggro.
- **Rimed blade** · sword · uncommon · Its basic attacks add a few Chill. *Sees:* a wall or a spear-maiden slowing what it strikes. → Snap 1 ●● ⚙ lead's colour (half), every colour (half) ◆ swing-status
- **Drawn steel** · sword · uncommon · Its first basic attack of each fight comes at once and deals double. *Sees:* a big number on the first tick. → Hunt 1 ●●, Landslide ●
- **Mercy's edge** · sword · uncommon · Each basic attack it lands heals the ally with the lowest share of HP for a share of the damage. *Sees:* a green number on the most hurt ally with every swing. → Pact 1 ●●, Toll ●, Cuts ● ⚙ brink (half) ◆ lowest-ally
- **Gravemark** · sword · rare · Its hits on a Marked foe deal half again as much. When a Marked foe falls, it Marks the foe with the lowest HP. *Sees:* the Mark jumps as each foe falls. → Hunt 2 ●●●
- **Provoking blade** · sword · rare · The foe its basic attack lands on swings at once. *Sees:* the foe strikes out of turn, and pays whatever its own action costs it. → Storm 2 ●●●, Toll 2 ●●●, Snap ● ⚙ goad (key)
- **Oathkeeper** · sword · rare · While its wearer Taunts, its basic attacks also hit every other foe. *Sees:* a row of numbers from one swing, for as long as the Taunt lasts. → Toll 2 ●●●, Storm ●●, Cuts ●● ⚙ red rain (half), reaping (half) ◆ wide-hit
- **Bloodletter** · sword · rare · Each of its swings costs its wearer a little HP, and deals extra damage equal to several times the price. *Sees:* the wearer's bar steps down and its numbers jump; a Shield on it is never spent by the price. → Pact 2 ●●●, Landslide ● ⚙ brink (key)
- **Stormbrand** · sword · legendary · Its hits deal extra damage for each Shock held anywhere on the field. The Shock stays. *Sees:* the more of the field is charged, the bigger every one of its numbers. → Storm 3 ●●●, Toll ● ⚙ held charge (key)

##### Spear
*Wears:* Hoplite, Valkyrie, Monk. *Signature:* Aggro. *Stats lean:* the Toll to Aggro, Defense and HP; the Hunt to Crit chance and Attack; the Storm to Attack speed.
- *Commons (2):* one leans to Aggro and Defense, one to Aggro and Attack.
- **Jolt spear** · spear · uncommon · Its hits add a few Shock, swing or ability. *Sees:* three quick hits, three charges. → Storm 1 ●●, Toll ● ⚙ lead's colour (half), held charge (half) ◆ swing-status
- **Trophy spear** · spear · uncommon · When it lands a killing blow, its wearer gains a Shield (from Attack). *Sees:* a grey bar after each kill. → Hunt 1 ●●, Cuts ● ⚙ detonation (half) ◆ kill-pays, shield-by-doing
- **Bristling spear** · spear · uncommon · When a foe hits its wearer, the wearer's next basic attack comes at once. *Sees:* every blow taken is answered. → Toll 1 ●●, Cuts ●, Storm ●
- **Hunting spear** · spear · rare · When it lands a killing blow, its wearer's ability with the longest cooldown left is ready at once. *Sees:* a kill, and the big ability again. → Hunt 2 ●●●, Barrage ● ⚙ reaping (key) ◆ kill-pays
- **Pike wall** · spear · rare · When a foe hits an ally with less Defense than the wearer, the wearer strikes that foe with its spear. *Sees:* whoever touches the back row is struck for it. → Toll 2 ●●●, Landslide ●●, Storm ●
- **Storm pike** · spear · rare · Every fifth hit it lands also strikes every other foe (a light hit, from Attack), carrying what its swings carry. *Sees:* a count, then a flash across the whole field. → Storm 2 ●●●, Cuts ●●, Bonfire ● ⚙ red rain (half), reaping (half) ◆ wide-hit
- **Sarissa** · spear · legendary · Its basic attacks hit every foe that has hit its wearer since its last swing. → Toll 3 ●●●, Storm ●●, Landslide ●●

##### Axe
*Wears:* Vampire, Assassin. *Signature:* Lifesteal. *Stats lean:* Blood Pact to Lifesteal and HP; the Hunt to Attack and Crit damage.
- *Commons (2):* one carries Lifesteal, one Attack. The axe's budget is lean, so each carries one step.
- **Reaver's axe** · axe · uncommon · When it lands a killing blow, its next hit deals double. *Sees:* a kill, and a number twice the size on the next foe. → Hunt 1 ●●, Landslide ● ◆ kill-pays
- **Hungry axe** · axe · uncommon · It drinks twice as deep from a foe below half its HP. *Sees:* the green numbers double as a foe sinks. → Pact 1 ●●, Hunt ●
- **Ragged axe** · axe · uncommon · Its hits add a few Bleed. *Sees:* a wound that never needed a crit. → Cuts 1 ●● ⚙ lead's colour (half) ◆ swing-status
- **Executioner's axe** · axe · rare · Its hits on a foe below a quarter of its HP deal double. → Hunt 2 ●●●
- **Thirsting axe** · axe · rare · Each killing blow it lands heals its wearer for a fifth of its max HP. → Pact 2 ●●, Hunt 2 ●● ◆ kill-pays
- **Overkill axe** · axe · rare · What its wearer's killing blows have left over lands on the foe with the lowest HP. *Sees:* the number that killed one foe carries into the next. → Hunt 2 ●●●, Landslide ●● ⚙ avalanche (key)
- **The Red Feast** · axe · legendary · While its wearer is below half its HP, its hits deal double and drink double. When a fight is won, its wearer is healed to full. → Pact 3 ●●●, Cuts ● ⚙ brink (half)
- **Headsman's axe** · axe · legendary · Its basic attacks come half as often and deal double. A killing blow it lands readies its next basic attack at once. → Hunt 3 ●●●, Landslide ●● ◆ heavy-blow, kill-pays

##### Bow
*Wears:* Ranger, Bard. *Signature:* Crit damage. *Stats lean:* the Hunt to Crit damage and Crit chance; Thousand Cuts to Attack speed; the Bard's Refrain to Attack.
- *Commons (2):* one leans to Crit damage and Crit chance, one to Crit damage and Attack speed.
- **Broadhead bow** · bow · uncommon · Its crits add many Bleed. *Sees:* a crit opens a wound wide in one stroke. → Cuts 1 ●●, Hunt ● ◆ swing-status
- **Opening shot** · bow · uncommon · Its first basic attack of each fight comes at once and always crits. *Sees:* an arrow on the first tick, with the crit's number. → Hunt 1 ●●, Barrage ●
- **Frostbite bow** · bow · uncommon · Its basic attacks add several Chill. *Sees:* each arrow a visible step up the frost counter. → Snap 1 ●● ⚙ lead's colour (half) ◆ swing-status
- **Huntsman's bow** · bow · rare · While no foe is Marked, its basic attacks Mark their target. Its hits on a Marked foe deal a third more. *Sees:* there's always a Mark on the field, and the party's blows follow it. → Hunt 2 ●●●
- **Volley bow** · bow · rare · Every fourth basic attack is a volley: it also looses an arrow at every other foe. *Sees:* a count, then an arrow in every foe. → Cuts 2 ●●●, Hunt ●, Storm ●, Barrage ● ⚙ red rain (half), reaping (half) ◆ wide-hit
- **Executioner's longbow** · bow · legendary · Its basic attacks ignore Taunt, and deal more the less HP their target has. → Hunt 3 ●●●
- **Heartseeker** · bow · legendary · Its arrows can't be dodged and ignore Defense. It never crits. → exotic

##### Rune sword
*Wears:* Frostweaver, Stormcaller. *Signature:* MP regen. *Stats lean:* Barrage to MP regen, Cooldown and MP; Cold Snap and the Toll's wardens to HP.
- *Commons (2):* one leans to MP regen and Cooldown, one to MP regen and HP.
- **Sleet blade** · rune sword · uncommon · Its basic attacks add several Chill. *Sees:* the ice mage's own swings carry frost between its casts. → Snap 1 ●●● ⚙ lead's colour (half) ◆ swing-status
- **Sigil blade** · rune sword · uncommon · When each fight starts, its wearer gains a Shield from its max MP. *Sees:* a grey bar on the caster at the first tick. → Barrage ●, Landslide ● ⚙ detonation (half), opening again (half)
- **Wellblade** · rune sword · uncommon · Each basic attack it lands restores some of its wearer's MP. *Sees:* the blue bar ticks up with each swing. → Barrage 1 ●●, Storm ● ◆ free-cast
- **Conductor's blade** · rune sword · rare · When one of its wearer's abilities hits several foes at once, each hit lands again for a quarter. → Storm 2 ●●, Barrage 2 ●●, Cuts ● ⚙ red rain (half) ◆ wide-hit
- **Winter's chain** · rune sword · rare · When a foe's Chill shatters, the foe with the most Chill left gains half the cold it held. *Sees:* one foe bursts, and the next one's counter leaps. → Snap 2 ●●● ⚙ firecracker (key)
- **Spellbinder** · rune sword · rare · After each ability its wearer casts, its next basic attack deals double and gives back half the ability's cost. *Sees:* a cast, a heavy swing, and the blue bar partly refilled. → Barrage 2 ●●●, Storm ● ◆ free-cast
- **Brimming blade** · rune sword · legendary · Its wearer's abilities deal extra damage from its current MP. While it's above half its MP, they cost a quarter less. → Barrage 3 ●●●
- **Glacier blade** · rune sword · legendary · When a foe's Chill shatters, every other foe gains a few Chill, and a few more for each shatter before it this fight (Cascade). *Sees:* each burst sends more cold down the line than the last, and a cold field falls in one string. → Snap 3 ●●● ⚙ firecracker (key)

##### Hammer
*Wears:* Knight, Bramble knight, Geomancer. *Signature:* Defense. *Stats lean:* Landslide to Defense and Crit damage; the Toll to HP, Aggro and Thorns.
- *Commons (2):* one carries Defense, one HP with a lighter swing. The hammer's budget is lean.
- **Warden's hammer** · hammer · uncommon · Its swings deal extra damage from its wearer's Defense. *Sees:* the wall's swing lands a number no sword of its would. → Landslide 1 ●●, Toll ● ◆ heavy-blow
- **Mason's hammer** · hammer · uncommon · Each swing it lands gives its wearer a Shield of a share of the damage dealt. *Sees:* the blow lands and a grey bar grows by it. → Landslide 1 ●●, Toll ● ⚙ detonation (half) ◆ shield-by-doing
- **Bellringer** · hammer · uncommon · Every fourth swing it lands Stuns its target. *Sees:* a count, and a foe held still. → Landslide ●, Snap ●, Storm ● ⚙ held charge (half), emptied quiver (half) ◆ held
- **Grudgebearer** · hammer · rare · Each hit its wearer takes adds a Charge. Its next swing deals more for each Charge, and spends them. *Sees:* a counter climbs with every bite, and the swing lands for all of it. → Toll 2 ●●●, Landslide 2 ●●● ⚙ reckoning (key) ◆ heavy-blow
- **Mountainfall** · hammer · rare · Its swings deal extra damage equal to a share of its wearer's max HP. → Landslide 2 ●●●, Toll ●●, Pact ● ◆ heavy-blow
- **Cornerstone hammer** · hammer · legendary · Its swings deal extra damage equal to a share of all the Shield its party holds. The Shields stay. → Landslide 3 ●●●, Pact ●

##### Mace
*Wears:* Cleric, Paladin, Bramble knight. *Signature:* HP. *Stats lean:* the Toll to HP, Defense and Thorns; Blood Pact to HP and MP regen; Barrage's font to MP regen and Cooldown.
- *Commons (2):* one leans to HP and Defense, one to HP and MP regen. The mace's budget is rich, so each carries two steps.
- **Censer mace** · mace · uncommon · Its basic attacks add many Burn. *Sees:* a slow swing, and the fire's number leaps. → Bonfire 1 ●●●, Toll ● ⚙ lead's colour (half) ◆ swing-status
- **Mender's mace** · mace · uncommon · Every so often, the ally with the lowest share of HP is healed (from its wearer's max HP). *Sees:* a green number on whoever is lowest, on a beat. → Pact 1 ●●, Toll 1 ●● ⚙ brink (half) ◆ lowest-ally
- **Penitent's mace** · mace · uncommon · Each hit its wearer takes heals the ally with the lowest share of HP a little (from its max HP). *Sees:* the wall is struck and someone is mended. → Toll 1 ●●, Pact ●
- **Saint's mace** · mace · rare · Each time its wearer heals an ally, that ally's next hit deals extra damage equal to half the heal. *Sees:* a heal, then a bigger number from the healed. → Pact 2 ●●●, Landslide ●●
- **Shepherd's mace** · mace · rare · Its wearer's heals and Regen on the ally foes are most drawn to are doubled. → Toll 2 ●●●, Pact ●●
- **Sunhammer** · mace · rare · Its basic attacks add many Burn to the foe with the most Burn, wherever they land. *Sees:* the keeper swings at whatever is in front of it, and the pile grows. → Bonfire 2 ●●●
- **Martyr's mace** · mace · legendary · Its basic attacks deal more the lower its wearer's HP, up to triple. Below a third of its HP, each one also heals its wearer for the damage dealt. → Pact 3 ●●● ⚙ brink (half)

##### Staff
*Wears:* Cleric, Pyromancer, Frostweaver. *Signature:* Cast speed. *Stats lean:* Barrage to Cast speed, Cooldown and MP; Bonfire and Cold Snap to Cast speed and Attack; the healers to MP regen and HP.
- *Commons (2):* one leans to Cast speed and Cooldown, one to Cast speed and MP regen. The staff's budget is rich.
- **Shepherd's staff** · staff · uncommon · When each fight starts, the ally with the least MP gains Clarity. *Sees:* a blue bar refilling through the fight's first stretch. → Barrage 1 ●● ⚙ mana as armour (half), opening again (half) ◆ free-cast
- **Banked staff** · staff · uncommon · Its wearer's abilities add half again as many Burn and Chill stacks. *Sees:* each cast is a bigger step up the counter. → Bonfire 1 ●●, Snap 1 ●●
- **Vesper staff** · staff · uncommon · Each ability its wearer casts heals the ally with the lowest share of HP a little (from Attack). *Sees:* a green number with every spell, whatever the spell. → Pact 1 ●●, Toll ● ⚙ brink (half) ◆ lowest-ally
- **Ritual staff** · staff · rare · Its wearer's abilities wind up half again as long, deal half again as much and add twice the stacks. *Sees:* a long bar, then one cast that makes the fire leap or takes a foe to its shatter. → Bonfire 2 ●●●, Snap 2 ●●, Landslide ●, Barrage ●
- **Vigil staff** · staff · rare · Its wearer's heals are half again as big on an ally below half its HP. → Pact 2 ●●●, Toll ●● ⚙ brink (half)
- **Staff of echoes** · staff · legendary · Every ability its wearer casts is cast twice. Both are paid for. → Barrage 3 ●●●, Bonfire ●●, Snap ●●

##### Great weapon
*Wears:* Hoplite, Paladin, Geomancer. *Signature:* Attack. *Stats lean:* Landslide to HP and Crit damage; the Hunt to Crit damage; Blood Pact to HP and Lifesteal.
- *Commons (2):* one carries Attack with a heavier swing, one leans to Attack and HP. The great weapon's budget is rich.
- **Roaring greataxe** · great weapon · uncommon · Its wearer starts each fight with many Might. *Sees:* the first blows of the fight are the biggest numbers on the screen. → Landslide 1 ●●, Hunt 1 ●● ⚙ opening again (half), judge's drum (half) ◆ heavy-blow
- **Heartsplitter** · great weapon · uncommon · Its swings deal extra damage from its wearer's max HP. *Sees:* a heavy body swings heavier. → Landslide 1 ●●, Pact ● ◆ heavy-blow
- **Harvest scythe** · great weapon · uncommon · When it lands a killing blow, its next basic attack comes at once. *Sees:* a slow weapon swings again the moment something dies. → Hunt 1 ●●, Landslide ● ◆ kill-pays, heavy-blow
- **Icebreaker** · great weapon · rare · Its hits on a Stunned foe deal double. → Snap 2 ●●●, Landslide 2 ●● ◆ held
- **Overrun** · great weapon · rare · What its wearer's killing blows have left over carries into another foe, and on again while it kills. *Sees:* one swing, and a falling row of numbers. → Landslide 2 ●●●, Hunt ●● ⚙ avalanche (key) ◆ heavy-blow
- **Thunderhead maul** · great weapon · rare · Its hits deal more for each Shock on their target. The Shock stays. *Sees:* the slow blow lands hardest on the most charged. → Storm 2 ●●●, Landslide ●● ⚙ held charge (key) ◆ heavy-blow
- **Worldbreaker** · great weapon · legendary · Its basic attacks come half as often, deal triple, and Stun their target. → Landslide 3 ●●●, Snap ●● ⚙ held charge (half) ◆ heavy-blow, held
- **Twinfall** · great weapon · legendary · Each blow its wearer lands, swing or ability, lands a second time a moment later. → Landslide 3 ●●●, Hunt ●●, Cuts ● ◆ heavy-blow

#### Armor

##### Plate
*Wears:* Knight, Bramble knight, Hoplite, Paladin, Geomancer. *Stats lean:* Landslide to Defense and HP; the Toll to Aggro and Thorns; the keepers and rods of Bonfire and the Storm to Defense and Aggro.
- *Commons (3):* one leans to Defense, one to HP and Aggro, one to Thorns and Defense.
- **Portcullis** · plate · uncommon · While its wearer is above half its HP, it draws far more. *Sees:* the foes' blows gather on it while it's healthy. → Toll 1 ●●, Bonfire ●, Storm ● ⚙ frozen gate (half), mirror (half), reckoning (half) ◆ draw
- **Keystone cuirass** · plate · uncommon · While its wearer holds a Shield, its hits deal a third more. *Sees:* bigger numbers for as long as the grey bar stands. → Landslide 1 ●●
- **Holdfast** · plate · uncommon · The first time each fight its wearer drops below half its HP, it's Guarded. *Sees:* the Guard icon when the fight turns. → Toll ●, Landslide ●, net ⚙ mirror (half)
- **Urchin plate** · plate · uncommon · While its wearer holds a Shield, it has Thorns. *Sees:* attackers hurt themselves on the stone. → Toll 1 ●●, Landslide ● ⚙ goad (half)
- **Challenger's plate** · plate · rare · Its wearer Taunts all fight. → Toll 2 ●●●, Bonfire ●●, Storm ●● ⚙ mirror (half), goad (half), frozen gate (half), reckoning (half), two in the dark (half) ◆ draw
- **Hoarfrost plate** · plate · rare · Foes that hit its wearer gain a few Chill. *Sees:* the pack slows with every blow it lands on the wall, and then one bursts. → Toll 2 ●●●, Snap 2 ●●● ⚙ frozen gate (key)
- **Rubble plate** · plate · rare · When its wearer's Shield breaks, every foe takes damage equal to the most that Shield held. *Sees:* the grey bar goes, and a number lands on every foe. → Landslide 2 ●●●, Toll ●● ⚙ detonation (key)
- **Thornheart plate** · plate · legendary · A foe that hits its wearer takes a share of the blow as it was struck, and a larger share for each blow the wearer has lived through this fight (Spite). *Sees:* a counter on the wall climbs with every blow, and each blow sends more of itself back. → Toll 3 ●●●, Landslide ●● ⚙ mirror (key)
- **Last bastion** · plate · legendary · Once a fight, a blow that would knock its wearer out leaves it at 1 HP and Guarded. Until it's healed back above half its HP, its hits deal double. After a won fight it's at no less than a fifth of its HP. → net, Pact ●● ⚙ brink (half)

##### Mail
*Wears:* Bramble knight, Paladin, Valkyrie, Hexer, Vampire, Frostweaver. *Stats lean:* Blood Pact to HP and Lifesteal; the Toll to HP and Thorns; Thousand Cuts to Attack and Lifesteal; the status roads to Attack.
- *Commons (3):* one leans to HP and Attack, one to Lifesteal and HP, one to HP and Defense.
- **Scabbed mail** · mail · uncommon · Each hit its wearer lands gives it a small Shield (from max HP). *Sees:* a grey bar that grows as it hits. → Cuts 1 ●●, Landslide ● ⚙ detonation (half), riposte (half), brink (half) ◆ shield-by-doing
- **Reprisal hauberk** · mail · uncommon · The first time each foe hits its wearer in a fight, that foe takes damage (from the wearer's max HP). *Sees:* each foe pays once for touching it. → Toll 1 ●●, Storm ●
- **Bloodsworn mail** · mail · uncommon · While its wearer is below half its HP, it has Lifesteal. *Sees:* a hurt unit starts healing by hitting. → Pact 1 ●●, Cuts ● ⚙ brink (half), blood mage (half)
- **Warded mail** · mail · uncommon · The first time each fight its wearer drops below half its HP, it gains a Shield (from max HP). *Sees:* a grey bar when the fight turns. → Pact 1 ●, Toll ●, net ⚙ brink (half)
- **Static mail** · mail · rare · Foes that hit its wearer gain a few Shock. *Sees:* whatever strikes it is charged, and pays on its next move. → Toll 2 ●●●, Storm 2 ●●● ⚙ goad (half)
- **Red stone mail** · mail · rare · Healing its wearer receives past full becomes a Shield on it. *Sees:* once it's full, its green numbers turn into a grey bar. → Pact 2 ●●●, Cuts 2 ●●, Landslide ●● ⚙ red stone (key), detonation (half) ◆ shield-by-doing
- **Sanguine mail** · mail · rare · Below half its HP, healing its wearer receives is doubled. Above half, it's halved. → Pact 2 ●●●, Toll ● ⚙ brink (half)
- **Hexweave mail** · mail · rare · Its wearer's hits deal more for each different debuff their target holds. → Bonfire ●●, Snap ●●, Storm ●●, Cuts ●●, Toll ●● ⚙ every colour (half)
- **Aegis mail** · mail · legendary · Whenever an ally drops below a third of its HP, it gains Aegis. → Pact 3 ●●●, Toll ●●, net ⚙ brink (half), mirror (half)

##### Leather
*Wears:* Ranger, Valkyrie, Bard, Monk, Assassin, Stormcaller. *Stats lean:* Thousand Cuts and the Storm to Evasion and Attack; the Hunt to Crit chance and Accuracy; the Toll's dancer to Evasion.
- *Commons (3):* one leans to Evasion and Attack, one to Crit chance and Attack, one to Accuracy and Crit chance.
- **Tithing leathers** · leather · uncommon · Each hit its wearer lands heals it a little (from max HP). *Sees:* a green number with every hit. → Cuts 1 ●●, Pact 1 ● ⚙ riposte (half), red stone (half), blood mage (half)
- **Tracker's coat** · leather · uncommon · Everything its wearer does has Seek. *Sees:* its blows go past the Taunting front, and follow a Mark there. → Hunt 1 ●●
- **Mottled hide** · leather · uncommon · While its wearer is below half its HP, it draws far less. *Sees:* the foes turn away from it when it's hurt. → net, Pact ●
- **Quickstep leathers** · leather · uncommon · Each time its wearer dodges a hit, it's Hasted. *Sees:* MISS, and the Haste icon. → Cuts 1 ●●, Toll ● ⚙ riposte (half)
- **Duelist's leathers** · leather · rare · Each time its wearer dodges a hit, it strikes the attacker with its weapon. *Sees:* MISS, and the answering strike. → Toll 2 ●●●, Cuts 2 ●● ⚙ riposte (key)
- **Shadow mantle** · leather · rare · While its wearer is Hidden, its hits deal double. → Hunt 2 ●●● ⚙ two in the dark (half)
- **Pack leader's coat** · leather · rare · When its wearer lands a killing blow, every ally's next basic attack comes at once. *Sees:* a kill, and three weapons landing together. → Hunt 2 ●●●, Landslide ●●, Bonfire ●● ⚙ judge's drum (key) ◆ kill-pays
- **Frostwalker's furs** · leather · rare · When a foe's Chill shatters, its wearer is Hasted, and its next hit adds a few Chill to every foe. *Sees:* SHATTER, and frost across the whole field on its next blow. → Snap 2 ●●●, Cuts ● ⚙ firecracker (key), frozen gate (half)
- **Dawn runner's coat** · leather · rare · The first time a foe falls in each fight, its wearer's start-of-fight effects happen again. *Sees:* the first kill, and the opening once more: the Shield, the Haste, the frost. → Hunt 2 ●●, first move ⚙ opening again (key) ◆ kill-pays
- **Windrunner's garb** · leather · legendary · Each dodge adds a Heat (its wearer acts faster in everything, a stack) for the rest of the fight. Each hit it takes spends half its Heat. → Cuts 3 ●●, Toll 3 ●● ⚙ riposte (half)
- **Carrier's coat** · leather · legendary · Each hit its wearer lands passes on one stack of every affliction the wearer itself holds. *Sees:* a unit bitten by a hellhound burns, and from then on everything it touches burns. → exotic ⚙ carrier (key)

##### Robes
*Wears:* Cleric, Bard, Pyromancer, Frostweaver, Stormcaller. *Stats lean:* Barrage to MP and MP regen; Bonfire, Cold Snap and the Storm to Attack and Cast speed; every caster to Aggro down.
- *Commons (3):* one leans to MP and Attack, one to MP regen and HP, one to MP with Aggro down.
- **Matins robe** · robes · uncommon · Every third ability its wearer casts costs no MP. *Sees:* one cast in three leaves the blue bar where it was. → Barrage 1 ●● ⚙ crescendo (half) ◆ free-cast
- **Wallflower's robe** · robes · uncommon · Its wearer draws far less until the first hit lands on it each fight. → Barrage ●, net
- **Glyphed robe** · robes · uncommon · Each ability its wearer casts gives it a Shield (from max MP). *Sees:* a grey bar that grows with every spell. → Barrage 1 ●, Landslide ● ⚙ detonation (half), mana as armour (half) ◆ shield-by-doing
- **Acolyte's robe** · robes · uncommon · Each time an ally casts an ability, its wearer regains a little MP. *Sees:* the others' spells refill its bar. → Barrage 1 ●● ◆ free-cast
- **Kindled robes** · robes · rare · While any foe burns, its wearer gains a Heat every few ticks (it acts faster, a stack) for the rest of the fight. *Sees:* the caster's spells come quicker the longer the fire is kept up. → Bonfire 2 ●●●, Barrage ●
- **Quiet robes** · robes · rare · Its wearer can't be Silenced, and a Stun never loses it a cast. → Barrage 2 ●●, Bonfire ●●
- **Resonant robes** · robes · rare · Each ability its wearer casts comes round sooner for each foe it hit. *Sees:* against a pack the same spell's name scrolls again and again, and slows as the pack thins. → Barrage 2 ●●●, Storm 2 ●●●, Bonfire ●●, Snap ●● ⚙ resonance (key)
- **Sanguine vestments** · robes · rare · Hits from its wearer's abilities heal it for a share of their damage. *Sees:* a wide spell, and the caster's own bar leaps. → Pact 2 ●●, Barrage ●● ⚙ blood mage (half)
- **Archmage's mantle** · robes · legendary · Its wearer's abilities cost half again as much MP, and deal, heal and add half again as much. → Barrage 3 ●●●, Bonfire ●●, Snap ●●
- **Vestments of return** · robes · legendary · While its wearer stands, every ally revived comes back behind a Shield of half its max HP. → net

#### Offhands

##### Kite shield
*Wears:* Knight, Paladin, Geomancer. *Signature:* Defense. *Stats lean:* Landslide to Defense and HP; the Toll to Aggro and Thorns.
- *Commons (2):* one leans to Defense and HP, one to Defense and Aggro.
- **Emberguard** · kite shield · uncommon · Foes that hit its holder gain a few Burn. *Sees:* the keeper holds the door and the fire climbs on what strikes it. → Bonfire 1 ●●, Toll ● ⚙ goad (half)
- **Sheltering kite** · kite shield · uncommon · When each fight starts, its holder and the ally with the least Defense are Guarded. *Sees:* two Guard icons at the first tick. → Landslide ●, net ⚙ opening again (half), mirror (half)
- **Spiked kite** · kite shield · uncommon · Its holder's abilities deal extra damage from its Defense. *Sees:* the bash, the Smite or the rock lands bigger. → Landslide 1 ●● ◆ heavy-blow
- **Rubble shield** · kite shield · rare · When its holder's Shield breaks, the foe whose blow broke it is Stunned. → Landslide 2 ●●, Toll ●●, Storm ● ⚙ held charge (half), detonation (half) ◆ held
- **Humbling shield** · kite shield · rare · The first time each foe hits its holder, that foe is Weakened. → Toll 2 ●●, foes do less
- **Mirror shield** · kite shield · rare · A foe that hits its holder takes a share of the blow as it was struck, before Defense, Guard and Shields took theirs. *Sees:* a small number on the wall, and the blow's own number on the attacker. → Toll 2 ●●●, Landslide 2 ●● ⚙ mirror (key)
- **Oathbound shield** · kite shield · legendary · When a hit would deal an ally more than a quarter of its max HP, its holder takes the hit instead. → Toll 3 ●●●, Pact ●●, Barrage ●● ⚙ mirror (half)

##### Round shield
*Wears:* Hoplite, Bramble knight, Valkyrie. *Signature:* HP. *Stats lean:* the Toll to HP, Defense and Aggro; Landslide to HP and Defense; the Hunt and the Storm to Attack.
- *Commons (2):* one leans to HP and Attack, one to HP and Defense.
- **Comrade's targe** · round shield · uncommon · Every so often, the ally with the lowest share of HP gains a Shield (from its holder's max HP). *Sees:* a grey bar on whoever is lowest, on a beat. → Pact 1 ●●, Toll ●, Landslide ● ⚙ brink (half), detonation (half) ◆ lowest-ally
- **Hunter's buckler** · round shield · uncommon · When its holder's hit fells a foe, it's Hasted. *Sees:* a kill, and the Haste icon. → Hunt 1 ●●, Cuts ● ◆ kill-pays
- **Spiked targe** · round shield · uncommon · While its holder is Guarded, it has Thorns. *Sees:* attackers hurt themselves while the Guard lasts. → Toll 1 ●● ⚙ goad (half)
- **Second skin** · round shield · rare · When its holder's Shield breaks, a Shield of half its size is rebuilt at once, every so often. *Sees:* the grey bar goes and half of it is back. → Landslide 2 ●●●, Cuts ●● ⚙ detonation (key), riposte (half)
- **Hoplon** · round shield · rare · While its holder is Guarded or holds a Shield or an Aegis, a foe that hits it takes back whatever that cover stopped. *Sees:* BLOCKED on the wall, and the blocked number on the attacker. → Toll 2 ●●●, Landslide 2 ●●● ⚙ mirror (key)
- **Phalanx shield** · round shield · rare · While its holder stands, allies with less Defense than it take a fifth less damage. Its holder deals a fifth less. → Barrage ●●, Bonfire ●●, Toll ●
- **Shield of the chosen** · round shield · legendary · Once a fight, when another ally falls, its holder raises it at once with a tenth of its HP. → net

##### Horn
*Wears:* Knight, Hoplite. *Signature:* Aggro. *Stats lean:* the Toll to Aggro, HP and Defense; Barrage's well to MP regen; Landslide's loader to Attack.
- *Commons (2):* one leans to Aggro and HP, one to Aggro and MP regen.
- **Reveille** · horn · uncommon · When each fight starts, the ally with the highest Attack has its ability with the longest cooldown ready. *Sees:* the party's biggest ability in the fight's first ticks. → Landslide 1 ●●, Barrage 1 ●●, Hunt ●, first move ⚙ opening again (half)
- **Bull's horn** · horn · uncommon · The first time a foe falls in a fight, every ally is Hasted. *Sees:* the first kill, and three Haste icons. → Hunt 1 ●●, Cuts ● ◆ kill-pays
- **Watch horn** · horn · uncommon · Whenever an ally drops below half its HP, its holder Taunts. *Sees:* the foes turn from the hurt ally to the horn. → Toll 1 ●●, Pact ● ⚙ goad (half), mirror (half), two in the dark (half) ◆ draw
- **War horn** · horn · rare · Every so often, the ally with the slowest basic attack gains several Might. *Sees:* Might piling onto the slowest hitter between its blows. → Landslide 2 ●●● ⚙ judge's drum (half) ◆ heavy-blow
- **Goading horn** · horn · rare · Each time its holder Taunts, every foe's next basic attack comes at once. *Sees:* the shout, and every foe swings out of turn. → Storm 2 ●●●, Toll 2 ●●● ⚙ goad (key)
- **Hunting horn** · horn · rare · When a Marked foe falls, every ally's next basic attack comes at once. *Sees:* the Mark's kill, and three weapons landing together on the next foe. → Hunt 2 ●●●, Landslide ●●, Bonfire ● ⚙ judge's drum (key) ◆ kill-pays
- **Horn of the charge** · horn · legendary · When each fight starts, every ally is Hasted and its first action comes at once. Its holder starts every fight with every ability on cooldown. → Hunt 3 ●●●, Cuts ●●, first move ⚙ opening again (half)

##### Totem
*Wears:* Bramble knight, Stormcaller. *Signature:* Thorns. *Stats lean:* the Toll to Thorns, Defense and Aggro; the Storm to Attack.
- *Commons (2):* one leans to Thorns and Defense, one to Thorns and Attack.
- **Spinebark pole** · totem · uncommon · When each fight starts, the ally with the highest Aggro gains Thorns for the fight. *Sees:* the anchor's attackers take a number back. → Toll 1 ●●, Landslide ● ⚙ goad (half), opening again (half)
- **Stormglass totem** · totem · uncommon · When each fight starts, every foe gains a few Shock. *Sees:* every foe pays for its first move. → Storm 1 ●● ⚙ opening again (half), every colour (half)
- **Bear fetish** · totem · uncommon · Whenever an ally drops below half its HP, it's Guarded. *Sees:* the Guard icon on whoever is in trouble. → Toll ●, Pact ●, net ⚙ brink (half), mirror (half) ◆ lowest-ally
- **Briar totem** · totem · rare · Foes that hit its holder gain a few Bleed. *Sees:* attackers leave bleeding, and the party's hits on them print twice. → Toll 2 ●●●, Cuts 2 ●●● ⚙ red rain (half)
- **Spite totem** · totem · rare · Each hit its holder takes adds a Spite: its Thorns grow for the rest of the fight. → Toll 2 ●●●
- **Thunderhead totem** · totem · rare · Each hit its holder takes adds a Shock to every foe. *Sees:* the rod is struck and the whole field is charged. → Storm 2 ●●●, Toll 2 ●● ⚙ goad (half), held charge (half)
- **Earthmother totem** · totem · legendary · While its holder stands, every Shield an ally gains is a third larger. When an ally's Shield breaks, that ally gains many Might. → Landslide 3 ●●●, Pact ● ⚙ detonation (half)

##### Relic
*Wears:* Cleric, Paladin. *Signature:* MP regen. *Stats lean:* Blood Pact and the Toll's keepers to MP regen and HP; Barrage's font to MP regen and Cast speed.
- *Commons (2):* one leans to MP regen and HP, one to MP regen and Cast speed.
- **Holy water** · relic · uncommon · Each time one of its holder's abilities heals an ally, it also lifts one debuff from that ally. → Toll ●, Pact ●, foes do less
- **Charnel icon** · relic · uncommon · Each time a foe falls, the ally with the lowest share of HP is healed (from its holder's Attack). *Sees:* a kill, and a green number on the most hurt. → Pact 1 ●●, Hunt ● ⚙ brink (half) ◆ kill-pays, lowest-ally
- **Font relic** · relic · uncommon · Each time one of its holder's abilities heals an ally, that ally also regains MP. *Sees:* a heal, and the healed ally's blue bar steps up. → Barrage 1 ●●, Pact ● ⚙ mana as armour (half) ◆ free-cast
- **Phylactery** · relic · rare · The part of its holder's heals that would go past full becomes a Shield on the healed ally. *Sees:* a healer with nothing to mend builds grey bars. → Pact 2 ●●●, Landslide ●●, Toll ●● ⚙ red stone (key), detonation (half) ◆ shield-by-doing
- **Reliquary of mercy** · relic · rare · Its holder's revives cost half their MP and wind up in a moment. → net
- **Accuser's relic** · relic · rare · Each time its holder heals an ally, it Marks the foe that last hit that ally. *Sees:* the healer mends the wall and the party turns on whatever struck it. → Hunt 2 ●●●, Toll ●●
- **Heart of the saint** · relic · legendary · Its holder's heals are paid in its own HP in place of MP, and are twice as big. *Sees:* the healer's own red bar drops with every heal, and the heals are huge. → Pact 3 ●●● ⚙ brink (key)

##### Lantern
*Wears:* Cleric, Pyromancer. *Signature:* Cast speed. *Stats lean:* Bonfire to Cast speed and Attack; Barrage to Cast speed, MP and Cooldown.
- *Commons (2):* one leans to Cast speed and Attack, one to Cast speed and MP.
- **Pitch lantern** · lantern · uncommon · When each fight starts, every foe gains a few Burn. *Sees:* the whole field alight at the first tick. → Bonfire 1 ●● ⚙ opening again (half), every colour (half), reaping (half)
- **Dazzling lantern** · lantern · uncommon · When each fight starts, the two foes with the highest Attack are Weakened. → foes do less, Toll ● ⚙ opening again (half), goad (half)
- **Wick** · lantern · rare · When a burning foe falls, all its Burn passes to the foe with the most Burn left. *Sees:* a foe dies and the next one's fire leaps by all of it. → Bonfire 2 ●●●, Hunt ●● ⚙ fuse (key)
- **Signal lantern** · lantern · rare · A foe its holder hits with an ability is Marked. Abilities that hit every foe don't Mark. *Sees:* the bolt lands and the party's blows follow it. → Hunt 2 ●●, Bonfire 2 ●●
- **Everflame lantern** · lantern · legendary · Every few ticks, the foe with the most Burn gains Burn: a share of the most any foe has held this fight. → Bonfire 3 ●●●
- **Lamp of vigil** · lantern · legendary · After each won fight, one fallen ally stands up with a quarter of its HP. → net

##### Tome
*Wears:* Bard, Hexer, Frostweaver. *Signature:* Cooldown. *Stats lean:* Barrage to Cooldown, Cast speed and MP; Cold Snap and the Hexer's curses to Cooldown and Attack.
- *Commons (2):* one leans to Cooldown and Attack, one to Cooldown and MP regen.
- **Snowbound folio** · tome · uncommon · When each fight starts, every foe gains a few Chill. *Sees:* every foe a little slower from the first tick. → Snap 1 ●● ⚙ opening again (half), every colour (half), firecracker (half)
- **Abridged lexicon** · tome · uncommon · Its holder's first-slotted ability comes round a third faster. *Sees:* that spell's name in the log more often than any other. → Barrage 1 ●●, Bonfire ●, Snap ●
- **Curse-book** · tome · uncommon · Its holder's abilities add a few Bleed to each foe they hit. *Sees:* a spell lands and its targets are wounded. → Cuts 1 ●● ⚙ red rain (half), every colour (half)
- **Primer of frost** · tome · rare · Each time its holder adds Chill to a foe, it adds more the more Chill that foe already holds. → Snap 2 ●●●
- **Twice-told tome** · tome · rare · Every third ability its holder casts is cast twice. The second cast is free. *Sees:* the same name twice running in the log. → Barrage 2 ●●●, Snap ●●, Landslide ● ⚙ crescendo (half) ◆ free-cast
- **Grimoire of plagues** · tome · rare · When each fight starts, every foe gains a few stacks each of two of Burn, Chill, Shock and Bleed, at random. *Sees:* two different icons on every foe at the first tick. → Bonfire ●●, Snap ●●, Storm ●●, Cuts ●● ⚙ every colour (key), opening again (half)
- **Last page** · tome · legendary · When a foe falls, every foe below a tenth of its HP falls too. → Hunt 3 ●●, exotic ⚙ reaping (half)
- **Annotated grimoire** · tome · legendary · Each ability its holder pays for makes the next ability any ally casts free. → Barrage 3 ●●● ⚙ crescendo (half) ◆ free-cast

##### Orb
*Wears:* Pyromancer, Frostweaver. *Signature:* MP. *Stats lean:* Barrage to MP, MP regen and Cooldown; Bonfire and Cold Snap to MP and Attack.
- *Commons (2):* one leans to MP and MP regen, one to MP and Attack.
- **Scrying orb** · orb · uncommon · When each fight starts, its holder's ability nearest to ready comes at once. *Sees:* a spell on the first tick. → Barrage 1 ●, Hunt 1 ●, first move ⚙ opening again (half)
- **Mana pearl** · orb · uncommon · Each time a foe falls, its holder regains MP. *Sees:* a kill, and the blue bar steps up. → Barrage 1 ●●, Bonfire ● ⚙ resonance (half) ◆ kill-pays, free-cast
- **Orb of the long winter** · orb · rare · When a foe's Chill shatters, its holder's ability with the longest cooldown is ready. *Sees:* SHATTER, and the great spell's name right under it. → Snap 2 ●●●, Barrage 2 ●●, Bonfire ●● ⚙ shatter bell (key)
- **Smouldering orb** · orb · rare · When a burning foe falls, every other foe gains a third of its Burn. *Sees:* a foe dies and the whole field flares. → Bonfire 2 ●●●, Hunt ● ⚙ fuse (key)
- **Orb of the deep** · orb · rare · Damage its holder takes comes out of its MP first, while it has any. *Sees:* the blue bar takes the blow and the red one doesn't. → Barrage 2 ●●●, Pact ● ⚙ mana as armour (key)
- **Orb of the rising sun** · orb · legendary · Each ability its holder casts deals more and costs more than its last, for the rest of the fight (Crescendo). *Sees:* every spell bigger and dearer than the one before it. → Barrage 3 ●●●, Bonfire ●● ⚙ crescendo (key)
- **The deep well** · orb · legendary · While its holder holds Clarity, its abilities cost no MP. → Barrage 3 ●●● ⚙ crescendo (half), mana as armour (half) ◆ free-cast

##### Idol
*Wears:* Hexer, Vampire. *Signature:* Siphon. *Stats lean:* Blood Pact to Lifesteal and HP; Barrage's blood-well to Siphon and MP; the curser to Attack.
- *Commons (2):* one leans to Siphon and Attack, one to Siphon and HP.
- **Fanged idol** · idol · uncommon · Its holder's first hit on each foe Rots it. → foes do less, Pact ●
- **Leech idol** · idol · uncommon · MP its holder gains past its full pool goes to the ally with the least MP. *Sees:* a full blue bar spills into the caster's. → Barrage 1 ●● ⚙ mana as armour (half) ◆ free-cast
- **Withering idol** · idol · rare · Its holder's hits on a Weakened foe deal a third more. → Toll ●●, Pact ●●
- **Idol of the deepening** · idol · rare · Its holder's hits add one more stack of each of Burn, Chill, Shock and Bleed their target already holds. *Sees:* every counter on a foe steps up with each of its blows. → Bonfire 2 ●●, Snap 2 ●●, Storm 2 ●●, Cuts ●● ⚙ every colour (half)
- **Idol of binding** · idol · rare · Foes its holder Weakens are also Slowed, and its hits on a foe that's both deal double. → Toll ●●, foes do less
- **Idol of the hungry dark** · idol · legendary · Every so often, it takes one buff from a foe and gives it to its holder. → exotic
- **Idol of the deep** · idol · legendary · Damage its holder takes comes out of its MP first. MP it gains past full becomes a Shield. *Sees:* the blue bar takes the blows, and whatever would overfill it turns grey. → Barrage 3 ●●, Pact ●● ⚙ mana as armour (key)

##### Vial
*Wears:* Vampire, Assassin. *Signature:* Lifesteal. *Stats lean:* Blood Pact to Lifesteal and HP; Thousand Cuts and the Hunt to Crit chance and Crit damage.
- *Commons (2):* one leans to Lifesteal and HP, one to Lifesteal and Crit chance.
- **Crimson dregs** · vial · uncommon · Its holder's hits on a bleeding foe heal it for a share of their damage. *Sees:* a wound opens and its holder starts to drink from it. → Cuts 1 ●●, Pact 1 ●● ⚙ red stone (half)
- **Bloodletter's phial** · vial · uncommon · When each fight starts, every foe gains a few Bleed. *Sees:* the first hit on every foe prints twice. → Cuts 1 ●● ⚙ red rain (half), opening again (half), every colour (half)
- **Blood vial** · vial · rare · Its holder's abilities cost half their MP, plus HP equal to their full cost. The price never takes it below 1 HP. *Sees:* the red bar drops with every ability, and the blue one lasts twice as long. → Pact 2 ●●●, Barrage ● ⚙ blood mage (key), brink (key)
- **Venom vial** · vial · rare · Its holder's crits add several Bleed, and it crits more often on a bleeding foe. → Cuts 2 ●●●, Hunt ●●
- **Bloodlust draught** · vial · rare · Its holder starts every fight at half its HP (it pays), and its Lifesteal is doubled until it's full. *Sees:* a bar that starts at half and climbs by hitting. → Pact 2 ●●●, Cuts ● ⚙ brink (key)
- **Heartsblood** · vial · legendary · What its holder drinks, every other ally is healed for too. → Pact 3 ●●●, Cuts ●● ⚙ red stone (half)

##### Trophy
*Wears:* Ranger, Assassin, Geomancer. *Signature:* Crit damage. *Stats lean:* the Hunt to Crit damage and Crit chance; Landslide to Crit damage and Defense.
- *Commons (2):* one leans to Crit damage and Crit chance, one to Crit damage and Defense.
- **Hunter's skull** · trophy · uncommon · Each killing blow its holder lands adds a Heat (it acts faster, a stack) for the rest of the fight. *Sees:* each kill comes sooner than the last. → Hunt 1 ●●, Cuts ● ◆ kill-pays
- **Eagle feather** · trophy · uncommon · Its holder's crits Slow their target. → foes do less, Hunt ●, Snap ●
- **Vulture's skull** · trophy · rare · Its holder's hits on a Stunned foe always crit. *Sees:* a foe held still takes nothing but crits. → Landslide 2 ●●●, Snap 2 ●●●, Hunt ●● ⚙ emptied quiver (key) ◆ held
- **Ogre's tusk** · trophy · rare · Its holder's hits on the foe with the most HP deal half again as much. → Landslide 2 ●●●
- **Dragon's tooth** · trophy · rare · Its holder's crits strike again for a third of their damage, past Defense. → Landslide ●●, Hunt ●●, Cuts ●●
- **The king's head** · trophy · legendary · When its holder lands a killing blow, every ally's crit chance is doubled for a while. *Sees:* a kill, and a spell of crits from everyone. → Hunt 3 ●●●, Landslide ●● ⚙ emptied quiver (key) ◆ kill-pays

##### Bell
*Wears:* Bard, Monk, Stormcaller. *Signature:* Attack speed. *Stats lean:* Thousand Cuts and the Storm to Attack speed and Double strike; Barrage to MP regen.
- *Commons (2):* one leans to Attack speed and Evasion, one to Attack speed and MP regen.
- **Ringing bell** · bell · uncommon · Every fourth basic attack its holder lands rings: a light hit on every foe (from Attack), carrying what the swing carries. *Sees:* a count, and a small number on every foe. → Storm 1 ●●, Cuts 1 ●● ⚙ red rain (half), reaping (half), resonance (half) ◆ wide-hit
- **Pacer's bell** · bell · uncommon · Every so often, the ally with the fastest basic attack is Hasted. *Sees:* the Haste icon comes back on the party's quickest hitter. → Cuts 1 ●●, Storm ●, Bonfire ●
- **Bell of the hour** · bell · rare · Every eighth basic attack its holder lands casts its first-slotted ability at once, whatever its cooldown. The mana is still paid. *Sees:* a count climbs with each swing, and at the top, the spell. → Cuts 2 ●●●, Barrage 2 ●●● ⚙ spell on the swing (key)
- **Warding bell** · bell · rare · Every so often, it lifts one debuff from the ally holding the most, a Silence first. → Barrage ●●, Toll ●
- **Storm bell** · bell · legendary · While any foe holds Shock, every ally's basic attacks add a few Shock. → Storm 3 ●●● ⚙ lead's colour (half), held charge (half)

##### Cloak
*Wears:* Valkyrie, Monk, Ranger. *Signature:* Evasion. *Stats lean:* the Toll's dancer to Evasion and Defense; Thousand Cuts to Evasion and Attack speed; the Hunt to Evasion and Crit chance.
- *Commons (2):* one leans to Evasion and Attack, one to Evasion and Attack speed.
- **Hooded cloak** · cloak · uncommon · Each time its holder dodges a hit, it gains a Shield (from Attack). *Sees:* MISS, and the grey bar a little taller. → Toll 1 ●●, Cuts ● ⚙ riposte (half), detonation (half) ◆ shield-by-doing
- **Feathered cloak** · cloak · uncommon · The first time each fight its holder drops below half its HP, it's Hidden. *Sees:* a hurt unit fades and the foes look elsewhere. → net, Hunt ● ⚙ two in the dark (half)
- **Dancer's cloak** · cloak · rare · Each time its holder dodges a hit, its ability nearest to ready is ready. → Toll 2 ●●, Cuts 2 ●●, Barrage ●
- **Tempest cloak** · cloak · rare · Each time its holder dodges a hit, its next basic attack comes at once and strikes twice. *Sees:* MISS, and two blows back. → Toll 2 ●●●, Cuts 2 ●●● ⚙ riposte (key)
- **Shadow cloak** · cloak · rare · Its holder is Hidden when each fight starts, and again each time a foe falls. *Sees:* a name that fades at the first tick and after every kill. → Hunt 2 ●●, exotic ⚙ two in the dark (key) ◆ kill-pays
- **Swan's grace** · cloak · legendary · Once a fight, the blow that would knock its holder out leaves it at 1 HP and Hidden. → net ⚙ two in the dark (half)

#### Amulets
*Wears:* everyone. *Stats lean:* each common is one road's first stat.
- *Commons (10):* one each of HP, Defense, Attack, Crit chance, MP regen, Evasion, Lifesteal, Thorns, Double strike and Cooldown.
- **Tinder charm** · amulet · uncommon · Its wearer's basic attacks add a few more stacks of whichever of Burn, Chill, Shock or Bleed their target holds most. *Sees:* whatever the party has started on a foe, this unit's swings keep building. → Bonfire 1 ●●, Snap 1 ●●, Storm 1 ●●, Cuts 1 ● ⚙ lead's colour (half) ◆ swing-status
- **Challenger's token** · amulet · uncommon · Its wearer Taunts when each fight starts. *Sees:* the foes' first blows all go to it. → Toll 1 ●●, Bonfire ●, Storm ●, Hunt ● ⚙ opening again (half), goad (half), frozen gate (half), mirror (half), riposte (half), two in the dark (half) ◆ draw
- **Carapace charm** · amulet · uncommon · Its wearer starts every fight behind a Shield (from max HP). *Sees:* a grey bar at the first tick. → Landslide ●, net ⚙ opening again (half), detonation (half)
- **Hare's foot** · amulet · uncommon · Its wearer starts every fight Hasted. *Sees:* the Haste icon, and the fight's first actions come quickly. → Cuts 1 ●●, Bonfire ●, Storm ●, Barrage ● ⚙ opening again (half), spell on the swing (half)
- **Batwing charm** · amulet · uncommon · Hits from its wearer's abilities heal it for a share of their damage. *Sees:* a spell lands and its caster's bar steps up. → Pact 1 ●●, Barrage ● ⚙ blood mage (half)
- **Millstone** · amulet · uncommon · Its wearer's basic attacks come half as often and land more than twice as hard. *Sees:* fewer swings, each a number that out-sizes everything round it. → Landslide 1 ●●●, Hunt ● ⚙ judge's drum (half), avalanche (half), reckoning (half) ◆ heavy-blow
- **Hummingbird charm** · amulet · uncommon · Its wearer's basic attacks come twice as often and deal half as much. *Sees:* a blur of small numbers, and whatever its swings carry laid twice as fast. → Cuts 1 ●●●, Bonfire ●, Snap ●, Storm ● ⚙ spell on the swing (half)
- **Clear-headed charm** · amulet · uncommon · Its wearer starts every fight with Clarity. *Sees:* the blue bar refilling through the fight's first stretch. → Barrage 1 ●● ⚙ opening again (half), mana as armour (half) ◆ free-cast
- **Shatterstone charm** · amulet · rare · When its wearer's Shield breaks, the foe that broke it takes damage equal to twice the most that Shield held. *Sees:* the grey bar goes, and a big number lands on whoever broke it. → Landslide 2 ●●●, Cuts ●, Toll ●● ⚙ detonation (key)
- **Bounty charm** · amulet · rare · When its wearer lands a killing blow, its ability nearest to ready is ready at once. *Sees:* a kill, and an ability right after it. → Hunt 2 ●●●, Barrage ●● ⚙ reaping (key) ◆ kill-pays
- **Echo charm** · amulet · rare · Its wearer's extra strikes carry what its basic attacks carry: statuses and on-hit effects. → Cuts 2 ●●, Bonfire ●, Snap ●, Storm ●
- **Icebreaker charm** · amulet · rare · When a foe's Chill shatters, its wearer's next hit deals triple. *Sees:* SHATTER, and the party's heaviest number on the frozen foe. → Snap 2 ●●●, Landslide ●● ⚙ shatter bell (key)
- **Lightning-glass** · amulet · rare · Its wearer's abilities deal more for each Shock on their target. The Shock stays. *Sees:* the bash or the Smite lands hardest on the most charged foe. → Storm 2 ●●●, Landslide ● ⚙ held charge (key)
- **Blood pact charm** · amulet · rare · Its wearer's abilities cost HP in place of MP: the same share of its max HP. It won't cast one that would leave it below a tenth of its HP. *Sees:* the red bar drops at every cast and the blue one never moves. → Pact 2 ●●●, Barrage 2 ●● ⚙ blood mage (key), brink (key)
- **Halved heart** · amulet · rare · Its wearer starts every fight at half its HP and can't be healed above it. It deals half again as much. *Sees:* one unit sits at half all fight, hitting hard. → Pact 2 ●●●, Toll ● ⚙ brink (key)
- **Ember heart** · amulet · rare · When a burning foe falls, all its Burn passes to the foe its wearer last hit. *Sees:* a foe dies and its fire jumps to whatever this unit is fighting. → Bonfire 2 ●●●, Hunt ●● ⚙ fuse (key)
- **Hunter's mark** · amulet · rare · When each fight starts, its wearer Marks the foe with the lowest HP. When a foe it Marked falls, it Marks the next lowest. *Sees:* a Mark from the first tick, moving down the line as foes fall. → Hunt 2 ●●● ⚙ opening again (half), judge's drum (half)
- **Shroud charm** · amulet · rare · Whenever an ally drops below a third of its HP, that ally is Hidden. *Sees:* the most hurt ally fades, and the foes turn elsewhere. → Pact ●●, net ⚙ two in the dark (key), brink (half)
- **Heart of winter** · amulet · legendary · Every hit its wearer lands adds a Chill. → Snap 3 ●●●, Cuts ●
- **Heart of the forge** · amulet · legendary · While any foe burns, every ally gains a Heat every few ticks (each acts faster, a stack) for the rest of the fight. → Bonfire 3 ●●●, Barrage ●
- **Second dawn** · amulet · legendary · Each time a foe falls, its wearer's start-of-fight effects happen again. *Sees:* a foe falls and the opening happens again, every time. → Hunt 3 ●●●, exotic ⚙ opening again (key)
- **Twin-knot** · amulet · legendary · Whatever status its wearer gives itself, the other ally with the lowest share of HP gains too. *Sees:* something different for each class: the Assassin vanishes and the most hurt ally vanishes with it. → exotic ⚙ borrowed gift (key), brink (half), two in the dark (half)
- **Scapegoat charm** · amulet · legendary · When its wearer is given a debuff, its next hit gives that debuff, whole, to its target, and the wearer is rid of it. Doom can't be passed on. *Sees:* the witch's curse lands on the unit, and its next blow hands it straight back. → exotic ⚙ carrier (key)
- **Burning heart** · amulet · legendary · Its wearer starts every fight with several Burn on itself, and deals half again as much while it holds any affliction. → exotic, Pact ●, Bonfire ● ⚙ carrier (half)
- **Phoenix ember** · amulet · legendary · Once a fight, when its wearer falls, it stands up a few ticks later with a fifth of its HP. → net
- **Ready stance** · amulet · legendary · Its wearer's abilities start every fight at least half charged. Its cooldowns are a fifth longer. → first move, Hunt ●●, Barrage ●●
- **Gambler's coin** · amulet · legendary · Its wearer's crit chance is about half. Its hits that don't crit deal half; its crits deal what a crit always does. Hits that always crit still do. *Sees:* half its numbers are crits, and the rest are halves. → exotic ⚙ emptied quiver (key)
- **Turncoat charm** · amulet · legendary · Its wearer's Attack and Defense are swapped. → exotic

### Formations

Neutral stays as the start. Thirty-six more: thirteen common, twelve rare, eleven legendary. Every road has a common a run could start in, a rare that reads who sits where and a legendary that changes how the party fights. Three commons are shared ground (Shieldwall, The standard, First light), and six formations carry an engine or an exotic and belong to no one road.

Each line gives the promise, then the three seats.

#### Common
- **Heavy line** · formation · common · One strikes like a falling hill, one takes the blows, one loads the strike. Seats: Hammer: basic attacks come half as often and land more than twice as hard. / Anvil: draws far more; Defense up. / Loader: when each fight starts, the Hammer gains many Might. → Landslide 1 ●●●, Hunt ● ⚙ judge's drum (half), avalanche (half), reckoning (half)
- **Spur** · formation · common · One opens the wound; two pour into it. Seats: Opener: crits far more often. / Blade: basic attacks a third faster; HP down. / Blade: the same. → Cuts 1 ●●●, Bonfire ●, Storm ●, Snap ●
- **Hearth** · formation · common · One holds the door, one feeds the fire, one carries it to every burning foe. Seats: Keeper: Taunts and is Guarded when each fight starts. / Stoker: Hasted when each fight starts. / Torch: each of its hits adds a Burn to every foe that's already burning. → Bonfire 1 ●●●, Toll ●
- **Hoarfrost line** · formation · common · Two lay frost with every blow; the third breaks what freezes. Seats: Frost: basic attacks add a few Chill. / Frost: the same. / Breaker: its hits on a Stunned foe deal double. → Snap 1 ●●●, Landslide ● ⚙ lead's colour (half)
- **Squall line** · formation · common · Two spread the charge; one stands where the foes look. Seats: Squall: basic attacks also hit a second, random foe for half, carrying what the swing carries. / Squall: the same. / Rod: draws far more; foes that hit it gain a few Shock. → Storm 1 ●●●, Toll ●, Cuts ● ⚙ red rain (half), goad (half)
- **Hunting party** · formation · common · One picks the quarry, one runs it down past any guard, one holds the line. Seats: Marker: when each fight starts, and whenever a foe it Marked falls, it Marks the foe with the lowest HP. / Chaser: everything it does has Seek. / Warden: draws far more; Defense up. → Hunt 1 ●●●
- **Thorn hedge** · formation · common · A thorned wall that draws the blows, and two who weaken whatever strikes it. Seats: Anchor: draws far more; Thorns. / Hedge: a foe that hits the Anchor is Weakened. / Hedge: the same. → Toll 1 ●●●, Storm ● ⚙ goad (half)
- **Wellspring** · formation · common · Two keep one caster casting. Seats: Soloist: its abilities come round faster; draws far less. / Conductor: each ability it casts gives the Soloist some MP. / Well: draws more; each hit it takes gives the Soloist some MP. → Barrage 1 ●●●, Toll ● ⚙ mana as armour (half)
- **Shared cup** · formation · common · Nobody's healing is wasted. Healing any ally receives past full goes to the ally with the lowest share of HP. Seats: Drinker: Lifesteal. / Drinker: Lifesteal. / Donor: its heals are a third bigger. → Pact 1 ●●●, Cuts ●● ⚙ brink (half)
- **Shieldwall** · formation · common · One stands in front with its shield up; two stand behind it. Seats: Wall: draws far more; Defense up two steps. / Behind: draws less. / Behind: draws less. → Toll ●●, Bonfire ●●, Storm ●●, Landslide ●●, Hunt ●, Barrage ●● ⚙ mirror (half), frozen gate (half)
- **The standard** · formation · common · Two follow the lead's colour. Seats: Lead: nothing of its own; its swings carry what they carry. / Follower: its basic attacks carry whatever the Lead's basic attacks carry. / Follower: the same. *Sees:* three weapons laying the same status, and the counter climbing three times as fast. → Bonfire 1 ●●●, Snap 1 ●●●, Storm 1 ●●●, Cuts 1 ●● ⚙ lead's colour (key)
- **First light** · formation · common · Up before dawn. When each fight starts, every ally's ability nearest to ready is ready. Seats: three Risers, nothing of their own. → first move, Hunt ●●, Barrage ●●, Landslide ●
- **Skirmish line** · formation · common · Three who'd rather not be hit at all. Each dodge gives the dodger a small Shield. Seats: three Skirmishers: Evasion up; Defense down. → Toll ●●, Cuts ●● ⚙ riposte (half)

#### Rare
- **Hammer and anvil** · formation · rare · Every blow the Anvil takes is saved for the Hammer. Seats: Anvil: draws far more; each hit it takes adds a Charge to the Hammer. / Hammer: its next basic attack deals more for each Charge, and spends them. / Smith: its heals, Shields and Guards on the Anvil are a third bigger. *Sees:* a counter on the Hammer climbs with every bite the Anvil takes, then one swing lands for all of it. → Landslide 2 ●●●, Toll 2 ●●● ⚙ reckoning (key)
- **Open wound** · formation · rare · One opens them up; two drink from the wound. Seats: Opener: its crits add many Bleed. / Blade: each hit it lands on a bleeding foe heals it a little. / Blade: the same. → Cuts 2 ●●●, Pact ●●
- **Pyre line** · formation · rare · The fire outlives whatever it's burning. Seats: Keeper: Taunts and is Guarded when each fight starts; foes that hit it gain a few Burn. / Stoker: basic attacks a third faster. / Torch: when a burning foe falls, all its Burn passes to the foe the Torch last hit. *Sees:* the smallest foe goes up, and its whole fire jumps to the next. → Bonfire 2 ●●●, Hunt ●● ⚙ fuse (key)
- **Icefall** · formation · rare · Two lay frost, and each shatter rings the third's great spell. Seats: Frost: its hits add a Chill, and a few with a fast weapon. / Frost: the same. / Breaker: when a foe's Chill shatters, its ability with the longest cooldown is ready. *Sees:* SHATTER, and the great spell's name right under it. → Snap 2 ●●●, Landslide ●●, Barrage ●●, Bonfire ● ⚙ shatter bell (key)
- **Storm front** · formation · rare · The more foes one action touches, the more it pays. Seats: Thunderhead: its abilities come round sooner for each foe they hit. / Squall: its basic attacks also hit every foe that holds Shock, for a third. / Rod: draws far more; each time it Taunts, every foe's next basic attack comes at once. *Sees:* a wide spell's name scrolling again and again, and a field that pays for every swing it's goaded into. → Storm 2 ●●●, Barrage ●●, Toll ●● ⚙ resonance (key), goad (key), red rain (half)
- **The pack** · formation · rare · The pack takes them one at a time. Seats: Lead: while no foe is Marked, its hits Mark their target; when a foe it Marked falls, its ability with the longest cooldown is ready. / Packmate: its hits on a Marked foe deal a third more, and half again as much below half the foe's HP. / Packmate: the same. → Hunt 2 ●●● ⚙ reaping (half), judge's drum (half)
- **Toll gate** · formation · rare · Whatever strikes the gate pays the other two's toll. Seats: Gate: draws far more; Guarded when each fight starts. / Collector: a foe that hits the Gate gains whatever this seat's basic attacks carry. / Collector: the same. *Sees:* the foes strike the wall and leave chilled, charged, bleeding or sundered, by who sits behind it. → Toll 2 ●●●, Snap ●●, Storm ●●, Cuts ●●, Bonfire ● ⚙ frozen gate (key), goad (half), red rain (half)
- **The stage** · formation · rare · Everything the other two cast brings the Soloist's spells round. Seats: Soloist: each ability another ally casts takes a fifth off the cooldowns it has left. / Conductor: its abilities come round a third faster. / Well: draws far more; whenever the Soloist finishes a cast, the Well gains a Shield. → Barrage 2 ●●●, Toll ●
- **Blood oath** · formation · rare · One bleeds for power, one drinks, one pours life into the bleeder. Seats: Bleeder: can't be healed above half its HP; its hits deal half again as much. / Drinker: Lifesteal, high; what it drinks past full becomes a Shield on it. / Donor: its heals, Shields and Guards on the Bleeder are doubled. *Sees:* one unit sits at half all fight, hitting at its strongest, with the party's cover on it. → Pact 2 ●●●, Landslide ● ⚙ brink (key), red stone (key)
- **Decoy** · formation · rare · Two lurk in the dark; one stands in the light. Seats: Light: Taunts and is Guarded when each fight starts. / Shadow: Hidden when each fight starts. / Shadow: the same. *Sees:* two names fade at the first tick, and every blow goes to the one left. → Toll ●●, Hunt ●●, Pact ● ⚙ two in the dark (key)
- **Vigil** · formation · rare · Nobody falls alone. When an ally falls, the others are Guarded and gain a Shield. An ally revived comes back Guarded. Seats: three Watchers, nothing of their own. → net
- **The wheel** · formation · rare · Every so often the wheel turns, and each unit takes the next seat's part. Seats: Wall: draws more; Defense up. / Blade: basic attacks a fifth faster; crits more. / Well: regains MP in fights; heals on it are stronger. → exotic

#### Legendary
- **The mountain** · formation · legendary · The whole party's stone loads one unit's blows. Seats: Peak: its hits deal extra damage equal to a share of all the Shield the party holds; the Shields stay. / Foothill: starts each fight behind a Shield (from max HP), and every Shield it gains is a third bigger. / Foothill: the same. → Landslide 3 ●●● ⚙ detonation (half)
- **The whetstone** · formation · legendary · Every hit the party lands sharpens the next. Each hit any ally lands adds a Cut to the party's count, kept for the fight; every ally's hits deal more for each Cut. Everyone's hits start a fifth softer. Seats: three Blades, nothing of their own. → Cuts 3 ●●●, Storm ●●
- **The forge** · formation · legendary · The longer the fire is kept, the faster the party feeds it. While any foe burns, every ally gains a Heat every few ticks (each acts faster, a stack). Whenever an ally is Stunned or Silenced, the foe with the most Burn gains many Burn. Seats: three Forgehands, nothing of their own. → Bonfire 3 ●●●
- **The long winter** · formation · legendary · Every shatter sends its cold down the line, and each sends more than the last. When a foe's Chill shatters, every other foe gains a few Chill, and a few more for each shatter before it this fight (Cascade). Seats: three Winterers, nothing of their own. *Sees:* one burst runs down the whole line. → Snap 3 ●●● ⚙ firecracker (key)
- **Eye of the storm** · formation · legendary · The storm doesn't lift. Every ally's basic attacks add a few Shock, all fight. Seats: Bolt: its abilities deal more for each Shock held anywhere on the field; the Shock stays. / Squall: nothing of its own. / Squall: nothing of its own. *Sees:* every weapon in the party charging the field all fight, and one unit's spells reading all of it. → Storm 3 ●●● ⚙ held charge (key), lead's colour (half)
- **Open season** · formation · legendary · Every kill calls the volley again. When each fight starts, the foe with the lowest HP is Marked and every ally's first basic attack comes at once. Whenever a Marked foe falls, the next lowest is Marked and every ally's next basic attack comes at once. Seats: three Hunters, nothing of their own. *Sees:* a volley on the first tick, and again on every kill. → Hunt 3 ●●●, Landslide ●●, Bonfire ● ⚙ judge's drum (key)
- **The long wall** · formation · legendary · Every blow the wall has lived through comes back harder. Seats: Wall: Taunts all fight; a foe that hits it takes a share of the blow as it was struck, and a larger share for each blow it has lived through this fight (Spite). / Keeper: its heals, Shields and Guards on the Wall are doubled. / Keeper: the same. *Sees:* the boss's blow comes down, and most of it lands on the boss. → Toll 3 ●●●, Landslide ●● ⚙ mirror (key)
- **The cathedral** · formation · legendary · Two voices give all their mana to one. Seats: Soloist: its abilities deal extra damage from its current MP, and each ability it casts makes its next cost a third less. / Voice: all MP it would regain goes to the Soloist. / Voice: the same. → Barrage 3 ●●● ⚙ mana as armour (half), crescendo (half)
- **The covenant** · formation · legendary · Life is the party's one currency. Every ally's abilities cost HP in place of MP, the same share. Every ally has Lifesteal. When a fight is won, every ally is healed for a large share of its max HP. Seats: three Sworn, nothing of their own. *Sees:* three red bars swinging all fight, no blue bar moving, and the party ending near full. → Pact 3 ●●●, Barrage ●● ⚙ blood mage (key), brink (half)
- **Twins** · formation · legendary · Two are bound; what one gives itself, the other has too. Seats: Twin: whatever status it gives itself, the other Twin gains too. / Twin: the same. / Odd one out: Attack up two steps. *Sees:* one Twin vanishes, Taunts or quickens, and the other does it with it. → exotic ⚙ borrowed gift (key), two in the dark (half)
- **Daybreak** · formation · legendary · Every kill is a new dawn. Whenever a foe falls, every ally's start-of-fight effects happen again. Seats: three Risers, nothing of their own. *Sees:* a foe falls, and every Shield, Haste and Taunt the party opened with comes back. → Hunt 3 ●●, exotic ⚙ opening again (key)

### The versions

Every ability and passive keeps its power step. Of the 128 versions, eleven change and the rest stay: the earlier twelve builds' versions already split each class toward identities the nine roads use. A version that changes says so here; a version that stays and is an engine's part, or a road's first step from a kit, is listed after, so the web can see it. Where the old size was one that play never saw (a few ticks closer, a few Might), the fill resizes it to be seen, and the line stays.

#### Changed
- **Quarry** · Ranger, Hunter's eye A · version · Its basic attacks ignore Taunt, crit more often, and go to the foe with the lowest share of HP, which they Mark. *Sees:* the Ranger's arrow picks the prey, and the party's blows follow it. → Hunt 2 ●●●
- **Barbed volley** · Ranger, Barbed arrow B · version · An arrow at every foe, each a light hit that adds a few Bleed. In place of Barbed quiver. *Sees:* one cast, a wound on every foe. → Cuts 2 ●●●, Hunt ● ⚙ red rain (half), emptied quiver (half)
- **Overgrowth** · Bramble knight, Thicket A · version · Taunts, and every foe's next basic attack comes at once, onto its thorns. No Guard. *Sees:* the shout, every foe swings out of turn, and thorns fly off each one. → Toll 2 ●●●, Storm ●● ⚙ goad (key)
- **Swift justice** · Paladin, Condemn B · version · Marks the foe with the lowest share of HP, and every ally's next basic attack comes at once. When the judged foe falls, Condemn is ready again. *Sees:* a foe falls, the Mark jumps, and three weapons land together on the next. → Hunt 2 ●●●, Landslide ●●, Bonfire ● ⚙ judge's drum (key)
- **Rousing chorus** · Bard, War ballad B · version · All its Might goes to the ally with the slowest basic attack: three times as many. → Landslide 2 ●●●, Hunt ●
- **Rubato** · Bard, Allegro A · version · Haste on every ally, and every ally's ability nearest to ready is ready at once. → Barrage 2 ●●●, Landslide ●
- **Plague** · Hexer, Malison A · version · Malison, for less damage, and it adds a few Burn and a few Shock to every foe beside the Bleed. *Sees:* three icons on every foe from one cast, and the next curse landing bigger for them. → Bonfire ●●, Storm ●●, Cuts ●● ⚙ every colour (key), red rain (half)
- **Focused curse** · Hexer, Malison B · version · Malison on the foe with the highest Attack alone, three times as hard, adding three times the Bleed. → Hunt ●●, stops a cast ⚙ every colour (half)
- **High pyre** · Pyromancer, Pyre B · version · Waits until a foe holds many Burn, then lands on it for far more per stack than Pyre does. The Burn stays. In place of Pyre of the fallen. *Sees:* the Pyromancer holds the spell until the fire is high, then the fight's biggest number. → Bonfire 2 ●●●, Barrage ●
- **Splinters** · Frostweaver, Shatterpoint B · version · When a foe's Chill shatters, it takes several Sunder, and a third of the cold it held goes to every other foe. *Sees:* one foe bursts, and every other counter steps up. → Snap 2 ●●● ⚙ firecracker (key)
- **Frost armor** · Frostweaver, Blizzard A · version · Guards every ally. While that Guard lasts, a foe that hits a Guarded ally gains a few Chill. No damage. *Sees:* the pack slows with every blow it lands, on anyone. → Snap 2 ●●, Toll 2 ●●● ⚙ frozen gate (key)

#### Kept, and an engine's part or a road's first step
- **Coup de grâce** · Assassin, Backstab A · version (kept) · Backstab is ready again when it knocks its foe out. → Hunt 2 ●●● ⚙ reaping (key)
- **Quick draw** · Ranger, Hunter's eye B · version (kept) · Each crit makes its next basic attack come at once. → Cuts 2 ●●●, Hunt ●● ⚙ emptied quiver (key)
- **Rime shield** · Frostweaver, Shatterpoint A · version (kept) · A shatter gives the lowest ally a Shield from the Frostweaver's max HP. → Snap 2 ●●, Toll ●● ⚙ frozen gate (half), detonation (half), brink (half)
- **Rampart** · Geomancer, Earthen shell B · version (kept) · Shield and Guard on itself; the first time that Shield breaks, it's rebuilt at once. → Landslide 2 ●●● ⚙ detonation (key)
- **Faultline** · Geomancer, Bedrock B · version (kept) · When its Shield breaks, its next hit crits for triple. → Landslide 2 ●●● ⚙ detonation (half)
- **Static field** · Stormcaller, Thunderstorm A · version (kept) · For a while, every foe that hits an ally gains a few Shock. → Toll 2 ●●●, Storm 2 ●● ⚙ goad (half)
- **Recharge** · Stormcaller, Chain lightning B · version (kept) · The chain gives back MP for each foe it hits. → Barrage 2 ●●●, Storm ●● ⚙ resonance (half)
- **Overcharge** · Stormcaller, Static charge A · version (kept) · Its next three abilities cost no MP. → Barrage 2 ●●● ⚙ crescendo (half)
- **Deep calm** · Frostweaver, Stillness A · version (kept) · Clarity for the ally with the least MP, and its own next ability is free. → Barrage 2 ●●● ⚙ crescendo (half), mana as armour (half)
- **Reprise** · Bard, Encore A · version (kept) · The ally with the highest Attack has its ability with the longest cooldown ready at once. → Barrage 2 ●●●, Landslide 2 ●●
- **Smoke screen** · Assassin, Vanish A · version (kept) · Hides the ally with the lowest share of HP that isn't Taunting. → Pact ●●, Toll ●● ⚙ two in the dark (key), brink (half)
- **Shared rites** · Cleric, Last rites A · version (kept) · While any ally is below 30% of its HP, the Cleric's cooldowns are halved. → Pact 2 ●●● ⚙ brink (half)
- **Lament** · Bard, War ballad A · version (kept) · Twice the Might, for every ally below half its HP. → Pact 2 ●●● ⚙ brink (half)
- **Over the fallen** · Valkyrie, Choosing B · version (kept) · Heals for double or raises, and the Valkyrie Taunts and is Guarded. → Toll 2 ●●●, Pact ●● ⚙ riposte (half), brink (half)
- **Stillness of mind** · Monk, Flow B · version (kept) · Taunts, and its Evasion rises for as long as the Taunt. → Toll 2 ●●● ⚙ riposte (half)
- **Drinking palm** · Monk, Iron palm B · version (kept) · Its hits on a Sundered foe heal it. → Pact ●●, Toll ●● ⚙ riposte (half), red stone (half)
- **Watch the anchor** · Hoplite, Aspis A · version (kept) · Aegis on the ally with the most Aggro that holds none. → Toll 2 ●●● ⚙ mirror (half)
- **Blood for mana** · Vampire, Blood gift A · version (kept) · Spends its HP to give the ally with the least MP as much MP, and Clarity. → Barrage 2 ●●●, Pact ●● ⚙ mana as armour (half)
- **Hex of flames** · Hexer, Cold hex A · version (kept) · Its basic attacks add a few Burn in place of the Chill. → Bonfire 1 ●●● ⚙ lead's colour (half)
- **Kindling** · Pyromancer, Stoke A · version (kept) · Its basic attacks add a few Burn, in place of its casts. → Bonfire 1 ●●● ⚙ lead's colour (half)
- **Zeal** · Paladin, Judgement A · version (kept) · Its basic attacks add a few Burn to a foe with a buff or a debuff. → Bonfire 1 ●●●
- **Hold the line** · Knight, Stand fast B · version (kept) · Taunts, with Thorns for as long as the Taunt. → Toll 1 ●●● ⚙ goad (half)
- **Aftershock** · Geomancer, Tremor A · version (kept) · Stuns every foe. → Landslide ●●, Storm ●● ⚙ held charge (half)
- **Thunderclap** · Valkyrie, Skyfall A · version (kept) · Skyfall on every foe that holds Shock, rising with each one's. → Storm 3 ●●● ⚙ held charge (key)
- **Whipping vines** · Bramble knight, Bramble lash A · version (kept) · Lashes every foe for half. → Toll 2 ●●, Cuts ●● ⚙ red rain (half)
- **Frost fist** · Monk, Burning fist A · version (kept) · Three quick hits on the foe with the most Chill, each adding a little Chill. → Snap 1 ●●●
- **Hail** · Ranger, Frost arrow B · version (kept) · A quick arrow at the foe with the most Chill, and a few Chill on every foe. → Snap 1 ●●● ⚙ firecracker (half)
- **Opening thrust** · Hoplite, Phalanx A · version (kept) · Its first swing of each fight comes at once and deals triple. → Hunt 1 ●●●, Landslide ●●
- **Savage drain** · Vampire, Blood drain A · version (kept) · Three quick hits, each drinking. → Cuts 1 ●●●, Pact ●●
- **Rally the well** · Knight, Stand fast A · version (kept) · Clarity for every ally under half its MP. No Taunt. → Barrage 1 ●●● ⚙ mana as armour (half)
- **Shieldbearer** · Hoplite, Phalanx B · version (kept) · Defense adds to its doubled swings. → Landslide 1 ●●●

### The mythics

One a class, as today. Twelve stay as they are; four change. Each line says which road it pulls toward.

- **Horn of the keep** · Knight · mythic (offhand) · Every hit the Knight takes gives the ally with the least MP a share of the hit as MP. When its Taunt runs out while another ally is in a wind-up, it Taunts again. Kept. → Barrage 3 ●●●, Toll ●● ⚙ mana as armour (half)
- **Halo of the saint** · Cleric · mythic (amulet) · Each heal and Regen the Cleric casts also lands on every other ally below half its HP. Changed: the old one waited for a fall. → Pact 3 ●●● ⚙ brink (half)
- **Huntmaster's quiver** · Ranger · mythic (armor) · All the Ranger's abilities aim past any guard at the foe with the lowest HP. When a foe one of them hit falls, the cooldowns left on its abilities are halved. Kept. → Hunt 3 ●●● ⚙ reaping (half)
- **Heartwood mail** · Bramble knight · mythic (armor) · Whenever a hit lands on any ally, the Bramble knight's Thorns strike the attacker too. Kept. → Toll 3 ●●●, Cuts ●● ⚙ red rain (half)
- **The last wall** · Hoplite · mythic (offhand) · When an Aegis the Hoplite gave blocks a blow, the attacker takes the blocked damage, and Aspis is ready again. Kept. → Toll 3 ●●●, Landslide ●● ⚙ mirror (key)
- **Writ of judgement** · Paladin · mythic (offhand) · Every ally's hits deal half again as much to a foe the Paladin has Marked: Judgement, for the whole party. Changed: the old one waited for a Stun or a Silence. → Hunt 3 ●●●, Landslide ●●
- **Stormspear** · Valkyrie · mythic (weapon) · A one-handed spear. Its basic attacks ignore Taunt and add a few Shock. Kept. → Storm 3 ●●●, Hunt ●● ⚙ held charge (half)
- **Metronome** · Bard · mythic (offhand) · Counts every hit the party lands. At a set count, War ballad, Allegro and Encore are ready at once, and the count starts again. Kept. → Cuts 3 ●●●, Barrage ●●, Storm ● ⚙ spell on the swing (key)
- **The witch-blade** · Hexer · mythic (weapon) · After each ability the Hexer casts, its next three basic attacks hit every foe that holds a debuff. Kept. → Snap 3 ●●●, Bonfire ●●, Storm ●● ⚙ every colour (half), red rain (half)
- **Ember palms** · Monk · mythic (weapon) · Every hit the Monk lands adds a Burn. It gains Heat for each burning foe. Kept. → Bonfire 3 ●●●, Cuts ●●
- **Night's edge** · Assassin · mythic (armor) · When the Assassin lands a killing blow, it's Hidden for a moment, and its next hit deals double. Kept. → Hunt 3 ●●● ⚙ two in the dark (half)
- **The chalice** · Vampire · mythic (offhand) · The Vampire can't be healed above half its HP. Whatever it would drink past that heals the ally with the lowest share of HP. Changed: the old one waited for a fall. → Pact 3 ●●●, Cuts ● ⚙ brink (key)
- **Crown of embers** · Pyromancer · mythic (amulet) · While the Pyromancer stands, every ally's hits add a Burn. Kept. → Bonfire 3 ●●● ⚙ lead's colour (key)
- **Glacier's heart** · Frostweaver · mythic (armor) · Whenever a foe's Chill shatters, the Frostweaver puts half of it back on that foe. Kept. → Snap 3 ●●● ⚙ firecracker (key)
- **Eye of the tempest** · Stormcaller · mythic (weapon) · Every hit the Stormcaller lands jumps to one more random foe for half its damage. Its Thunderstorm, once cast, lasts the rest of the fight. Changed: its second half was a charge passed on at a fall, which the builds left out. → Storm 3 ●●●, Barrage ● ⚙ lead's colour (half)
- **Mountain's crown** · Geomancer · mythic (amulet) · Each crit the Geomancer lands rebuilds its own Shield by the damage the crit dealt. Kept. → Landslide 3 ●●● ⚙ detonation (half)

### Kit changes the gaps call for

None. Every road's sign is in a base kit already, and the loot reaches every rung of every road without one. The Storm is the nearest to wanting one: its sign is in the fewest kits (the Stormcaller's passive, and the Valkyrie's one ability in three), so it's the road a run is least often shown (*The web*, below). The spine answers it from the loot: three riders, a totem and a bell put Shock on any unit's hands. If the director would rather it came from a kit, that's a version on a third class, and it's theirs to ask for.

## Commons and uncommons by kind

Commons are written from the rule in their row. Every uncommon's effect is named, and its line, with what the player sees and what it serves, is under its kind above.

<!-- kinds:start -->
| Kind | Signature | Commons | Uncommons, each effect named | Stats lean, by road |
| --- | --- | --- | --- | --- |
| Dagger | Crit chance | 2: one leans to Crit chance and Attack speed, one to Crit chance and Crit damage. | **Weeping kris:** Its first hit on each foe adds several Bleed.<br>**Sleet dirk:** Its basic attacks add a few Chill.<br>**Second thrust:** When it lands a killing blow, its next basic attack comes at once and always crits. | the Hunt to Crit chance and Crit damage; Thousand Cuts to Attack speed; Cold Snap to Attack speed and Accuracy. |
| Fist weapons | Double strike | 2: one leans to Double strike and Attack speed, one to Double strike and Lifesteal. | **Live-wire knuckles:** Its basic attacks and extra strikes add a few Shock.<br>**Cinder wraps:** Its basic attacks and extra strikes add a few Burn.<br>**Rime knuckles:** Its basic attacks and extra strikes add a few Chill.<br>**Lamprey claws:** Each extra strike it lands heals its wearer (from max HP). | Thousand Cuts and the Storm to Attack speed and Double strike; Blood Pact to Lifesteal and HP; the Toll's dancer to Evasion. |
| Wand | Cooldown | 2: one leans to Cooldown and Attack speed, one to Cooldown and MP regen. | **Spark wand:** Its basic attacks add a few Burn.<br>**Jolt wand:** Its basic attacks add a few Shock.<br>**Tithe wand:** Each basic attack it lands gives the ally with the least MP some MP. | Barrage to Cooldown and Cast speed; Bonfire, Cold Snap and the Storm to Attack speed and Attack; the Bard's songs to Cooldown and MP regen. |
| Sword | Attack | 2: one leans to Attack and Crit chance, one to Attack and HP or Aggro. | **Rimed blade:** Its basic attacks add a few Chill.<br>**Drawn steel:** Its first basic attack of each fight comes at once and deals double.<br>**Mercy's edge:** Each basic attack it lands heals the ally with the lowest share of HP for a share of the damage. | the Toll to HP, Defense and Aggro; the Hunt and the Storm to Crit chance; Barrage's well and Blood Pact to HP. |
| Spear | Aggro | 2: one leans to Aggro and Defense, one to Aggro and Attack. | **Jolt spear:** Its hits add a few Shock, swing or ability.<br>**Trophy spear:** When it lands a killing blow, its wearer gains a Shield (from Attack).<br>**Bristling spear:** When a foe hits its wearer, the wearer's next basic attack comes at once. | the Toll to Aggro, Defense and HP; the Hunt to Crit chance and Attack; the Storm to Attack speed. |
| Axe | Lifesteal | 2: one carries Lifesteal, one Attack. The axe's budget is lean, so each carries one step. | **Reaver's axe:** When it lands a killing blow, its next hit deals double.<br>**Hungry axe:** It drinks twice as deep from a foe below half its HP.<br>**Ragged axe:** Its hits add a few Bleed. | Blood Pact to Lifesteal and HP; the Hunt to Attack and Crit damage. |
| Bow | Crit damage | 2: one leans to Crit damage and Crit chance, one to Crit damage and Attack speed. | **Broadhead bow:** Its crits add many Bleed.<br>**Opening shot:** Its first basic attack of each fight comes at once and always crits.<br>**Frostbite bow:** Its basic attacks add several Chill. | the Hunt to Crit damage and Crit chance; Thousand Cuts to Attack speed; the Bard's Refrain to Attack. |
| Rune sword | MP regen | 2: one leans to MP regen and Cooldown, one to MP regen and HP. | **Sleet blade:** Its basic attacks add several Chill.<br>**Sigil blade:** When each fight starts, its wearer gains a Shield from its max MP.<br>**Wellblade:** Each basic attack it lands restores some of its wearer's MP. | Barrage to MP regen, Cooldown and MP; Cold Snap and the Toll's wardens to HP. |
| Hammer | Defense | 2: one carries Defense, one HP with a lighter swing. The hammer's budget is lean. | **Warden's hammer:** Its swings deal extra damage from its wearer's Defense.<br>**Mason's hammer:** Each swing it lands gives its wearer a Shield of a share of the damage dealt.<br>**Bellringer:** Every fourth swing it lands Stuns its target. | Landslide to Defense and Crit damage; the Toll to HP, Aggro and Thorns. |
| Mace | HP | 2: one leans to HP and Defense, one to HP and MP regen. The mace's budget is rich, so each carries two steps. | **Censer mace:** Its basic attacks add many Burn.<br>**Mender's mace:** Every so often, the ally with the lowest share of HP is healed (from its wearer's max HP).<br>**Penitent's mace:** Each hit its wearer takes heals the ally with the lowest share of HP a little (from its max HP). | the Toll to HP, Defense and Thorns; Blood Pact to HP and MP regen; Barrage's font to MP regen and Cooldown. |
| Staff | Cast speed | 2: one leans to Cast speed and Cooldown, one to Cast speed and MP regen. The staff's budget is rich. | **Shepherd's staff:** When each fight starts, the ally with the least MP gains Clarity.<br>**Banked staff:** Its wearer's abilities add half again as many Burn and Chill stacks.<br>**Vesper staff:** Each ability its wearer casts heals the ally with the lowest share of HP a little (from Attack). | Barrage to Cast speed, Cooldown and MP; Bonfire and Cold Snap to Cast speed and Attack; the healers to MP regen and HP. |
| Great weapon | Attack | 2: one carries Attack with a heavier swing, one leans to Attack and HP. The great weapon's budget is rich. | **Roaring greataxe:** Its wearer starts each fight with many Might.<br>**Heartsplitter:** Its swings deal extra damage from its wearer's max HP.<br>**Harvest scythe:** When it lands a killing blow, its next basic attack comes at once. | Landslide to HP and Crit damage; the Hunt to Crit damage; Blood Pact to HP and Lifesteal. |
| Plate | (by weight) | 3: one leans to Defense, one to HP and Aggro, one to Thorns and Defense. | **Portcullis:** While its wearer is above half its HP, it draws far more.<br>**Keystone cuirass:** While its wearer holds a Shield, its hits deal a third more.<br>**Holdfast:** The first time each fight its wearer drops below half its HP, it's Guarded.<br>**Urchin plate:** While its wearer holds a Shield, it has Thorns. | Landslide to Defense and HP; the Toll to Aggro and Thorns; the keepers and rods of Bonfire and the Storm to Defense and Aggro. |
| Mail | (by weight) | 3: one leans to HP and Attack, one to Lifesteal and HP, one to HP and Defense. | **Scabbed mail:** Each hit its wearer lands gives it a small Shield (from max HP).<br>**Reprisal hauberk:** The first time each foe hits its wearer in a fight, that foe takes damage (from the wearer's max HP).<br>**Bloodsworn mail:** While its wearer is below half its HP, it has Lifesteal.<br>**Warded mail:** The first time each fight its wearer drops below half its HP, it gains a Shield (from max HP). | Blood Pact to HP and Lifesteal; the Toll to HP and Thorns; Thousand Cuts to Attack and Lifesteal; the status roads to Attack. |
| Leather | (by weight) | 3: one leans to Evasion and Attack, one to Crit chance and Attack, one to Accuracy and Crit chance. | **Tithing leathers:** Each hit its wearer lands heals it a little (from max HP).<br>**Tracker's coat:** Everything its wearer does has Seek.<br>**Mottled hide:** While its wearer is below half its HP, it draws far less.<br>**Quickstep leathers:** Each time its wearer dodges a hit, it's Hasted. | Thousand Cuts and the Storm to Evasion and Attack; the Hunt to Crit chance and Accuracy; the Toll's dancer to Evasion. |
| Robes | (by weight) | 3: one leans to MP and Attack, one to MP regen and HP, one to MP with Aggro down. | **Matins robe:** Every third ability its wearer casts costs no MP.<br>**Wallflower's robe:** Its wearer draws far less until the first hit lands on it each fight.<br>**Glyphed robe:** Each ability its wearer casts gives it a Shield (from max MP).<br>**Acolyte's robe:** Each time an ally casts an ability, its wearer regains a little MP. | Barrage to MP and MP regen; Bonfire, Cold Snap and the Storm to Attack and Cast speed; every caster to Aggro down. |
| Kite shield | Defense | 2: one leans to Defense and HP, one to Defense and Aggro. | **Emberguard:** Foes that hit its holder gain a few Burn.<br>**Sheltering kite:** When each fight starts, its holder and the ally with the least Defense are Guarded.<br>**Spiked kite:** Its holder's abilities deal extra damage from its Defense. | Landslide to Defense and HP; the Toll to Aggro and Thorns. |
| Round shield | HP | 2: one leans to HP and Attack, one to HP and Defense. | **Comrade's targe:** Every so often, the ally with the lowest share of HP gains a Shield (from its holder's max HP).<br>**Hunter's buckler:** When its holder's hit fells a foe, it's Hasted.<br>**Spiked targe:** While its holder is Guarded, it has Thorns. | the Toll to HP, Defense and Aggro; Landslide to HP and Defense; the Hunt and the Storm to Attack. |
| Horn | Aggro | 2: one leans to Aggro and HP, one to Aggro and MP regen. | **Reveille:** When each fight starts, the ally with the highest Attack has its ability with the longest cooldown ready.<br>**Bull's horn:** The first time a foe falls in a fight, every ally is Hasted.<br>**Watch horn:** Whenever an ally drops below half its HP, its holder Taunts. | the Toll to Aggro, HP and Defense; Barrage's well to MP regen; Landslide's loader to Attack. |
| Totem | Thorns | 2: one leans to Thorns and Defense, one to Thorns and Attack. | **Spinebark pole:** When each fight starts, the ally with the highest Aggro gains Thorns for the fight.<br>**Stormglass totem:** When each fight starts, every foe gains a few Shock.<br>**Bear fetish:** Whenever an ally drops below half its HP, it's Guarded. | the Toll to Thorns, Defense and Aggro; the Storm to Attack. |
| Relic | MP regen | 2: one leans to MP regen and HP, one to MP regen and Cast speed. | **Holy water:** Each time one of its holder's abilities heals an ally, it also lifts one debuff from that ally.<br>**Charnel icon:** Each time a foe falls, the ally with the lowest share of HP is healed (from its holder's Attack).<br>**Font relic:** Each time one of its holder's abilities heals an ally, that ally also regains MP. | Blood Pact and the Toll's keepers to MP regen and HP; Barrage's font to MP regen and Cast speed. |
| Lantern | Cast speed | 2: one leans to Cast speed and Attack, one to Cast speed and MP. | **Pitch lantern:** When each fight starts, every foe gains a few Burn.<br>**Dazzling lantern:** When each fight starts, the two foes with the highest Attack are Weakened. | Bonfire to Cast speed and Attack; Barrage to Cast speed, MP and Cooldown. |
| Tome | Cooldown | 2: one leans to Cooldown and Attack, one to Cooldown and MP regen. | **Snowbound folio:** When each fight starts, every foe gains a few Chill.<br>**Abridged lexicon:** Its holder's first-slotted ability comes round a third faster.<br>**Curse-book:** Its holder's abilities add a few Bleed to each foe they hit. | Barrage to Cooldown, Cast speed and MP; Cold Snap and the Hexer's curses to Cooldown and Attack. |
| Orb | MP | 2: one leans to MP and MP regen, one to MP and Attack. | **Scrying orb:** When each fight starts, its holder's ability nearest to ready comes at once.<br>**Mana pearl:** Each time a foe falls, its holder regains MP. | Barrage to MP, MP regen and Cooldown; Bonfire and Cold Snap to MP and Attack. |
| Idol | Siphon | 2: one leans to Siphon and Attack, one to Siphon and HP. | **Fanged idol:** Its holder's first hit on each foe Rots it.<br>**Leech idol:** MP its holder gains past its full pool goes to the ally with the least MP. | Blood Pact to Lifesteal and HP; Barrage's blood-well to Siphon and MP; the curser to Attack. |
| Vial | Lifesteal | 2: one leans to Lifesteal and HP, one to Lifesteal and Crit chance. | **Crimson dregs:** Its holder's hits on a bleeding foe heal it for a share of their damage.<br>**Bloodletter's phial:** When each fight starts, every foe gains a few Bleed. | Blood Pact to Lifesteal and HP; Thousand Cuts and the Hunt to Crit chance and Crit damage. |
| Trophy | Crit damage | 2: one leans to Crit damage and Crit chance, one to Crit damage and Defense. | **Hunter's skull:** Each killing blow its holder lands adds a Heat (it acts faster, a stack) for the rest of the fight.<br>**Eagle feather:** Its holder's crits Slow their target. | the Hunt to Crit damage and Crit chance; Landslide to Crit damage and Defense. |
| Bell | Attack speed | 2: one leans to Attack speed and Evasion, one to Attack speed and MP regen. | **Ringing bell:** Every fourth basic attack its holder lands rings: a light hit on every foe (from Attack), carrying what the swing carries.<br>**Pacer's bell:** Every so often, the ally with the fastest basic attack is Hasted. | Thousand Cuts and the Storm to Attack speed and Double strike; Barrage to MP regen. |
| Cloak | Evasion | 2: one leans to Evasion and Attack, one to Evasion and Attack speed. | **Hooded cloak:** Each time its holder dodges a hit, it gains a Shield (from Attack).<br>**Feathered cloak:** The first time each fight its holder drops below half its HP, it's Hidden. | the Toll's dancer to Evasion and Defense; Thousand Cuts to Evasion and Attack speed; the Hunt to Evasion and Crit chance. |
| Amulet | (everyone) | 10: one each of HP, Defense, Attack, Crit chance, MP regen, Evasion, Lifesteal, Thorns, Double strike and Cooldown. | **Tinder charm:** Its wearer's basic attacks add a few more stacks of whichever of Burn, Chill, Shock or Bleed their target holds most.<br>**Challenger's token:** Its wearer Taunts when each fight starts.<br>**Carapace charm:** Its wearer starts every fight behind a Shield (from max HP).<br>**Hare's foot:** Its wearer starts every fight Hasted.<br>**Batwing charm:** Hits from its wearer's abilities heal it for a share of their damage.<br>**Millstone:** Its wearer's basic attacks come half as often and land more than twice as hard.<br>**Hummingbird charm:** Its wearer's basic attacks come twice as often and deal half as much.<br>**Clear-headed charm:** Its wearer starts every fight with Clarity. | each common is one road's first stat. |
<!-- kinds:end -->

## Each engine's link

For each engine, in plain words: what one part makes and what the other reads. The fill sets the numbers on both sides of the link, and no card names its partner.

**The foes do it to themselves**
- **The shield detonation.** *Makes:* any Shield on a unit, from the kits and the Shield-makers. *Reads:* the most that Shield held, when it breaks: Rubble plate deals it to every foe, Shatterstone charm twice over to the foe that broke it. The return reads the same size: Second skin puts half back, Rampart all of it, once. The link is a Shield's size against a foe's HP: a Shield has to be worth breaking.
- **The frozen gate.** *Makes:* a few Chill on each foe that strikes the anchor (Hoarfrost plate), any Guarded ally (Frost armor), or the Gate seat with a Chill swing behind it (Toll gate). Chill's own cap makes the shatter. *Reads:* the shatter: Rime shield, Frostwalker's furs, the shatter bell's pieces. The link is Chill per blow taken against Chill's cap: how many blows a foe lands before it bursts.
- **The mirror.** *Makes:* a blow on the wall, and the cover that stops most of it (Defense, Guard, a Shield, an Aegis). *Reads:* the blow before the cover: Mirror shield a share of all of it, Hoplon exactly what the cover stopped, The last wall what an Aegis blocked. Thornheart plate and The long wall grow the share with each blow lived through.
- **The goad.** *Makes:* a foe's next basic attack, now: every foe's when the wearer Taunts (Goading horn, Overgrowth, the Rod seat), one foe's when a blow lands on it (Provoking blade). *Reads:* nothing of its own: whatever a foe's action already costs it, the Shock it holds, the Thorns and on-struck pieces of whoever it hits. The link is how often the call comes against what one swing costs a foe.
- **The held charge.** *Makes:* Shock on the swings, up to its cap, and a foe that can't act to pay it off (a Stun, a shatter, a boss between its moves). *Reads:* the stacks on the target (Skyfall, Thunderhead maul, Lightning-glass) or on the whole field (Stormbrand, Thunderclap, the Bolt seat), and leaves them.
- **The reckoning.** *Makes:* one Charge for each hit the anvil takes: on itself (Grudgebearer) or on the Hammer seat. *Reads:* the count, on the next swing, and spends it. The link is hits taken between two slow swings.

**Kills turn them over**
- **The reaping.** *Makes:* a field whose HP bars sink together (any wide hit, thorns on a swarm, fire laid thin). *Reads:* the lowest HP: an execute that's ready again at its own kill (Coup de grâce), or any kill that readies the wearer's big ability (Hunting spear) or its nearest (Bounty charm).
- **The judge's drum.** *Makes:* every ally's next basic attack at once, made again when a Marked foe falls (Swift justice, Hunting horn, Open season) or when the wearer kills (Pack leader's coat). *Reads:* each ally's swing as it stands: its size, its Might, what it carries. The link is the slowest swing's size against how often something falls.
- **The opening, again.** *Makes:* a fall. *Reads:* every start-of-fight effect on the wearer, from its other slots, its seat and its kit, and fires them again: on the first fall (Dawn runner's coat), on every fall (Second dawn), for the whole party (Daybreak).
- **The fuse.** *Makes:* a foe that falls while it burns. *Reads:* the Burn it held at that moment, and moves it whole: to the hottest foe left (Wick), to the foe the wearer last hit (Ember heart, the Torch seat), or a third of it to every other foe (Smouldering orb).
- **The avalanche.** *Makes:* a blow bigger than what it lands on. *Reads:* the damage past the foe's last HP, and deals it to the foe with the lowest HP (Overkill axe) or to any other foe, and on again while it kills (Overrun).

**The party's swings and hits turn them over**
- **The spell on the swing.** *Makes:* basic attacks landed. *Reads:* the count: every eighth casts the first-slotted ability, mana paid (Bell of the hour); each takes a fifth off its cooldown (Baton); the party's count readies the Bard's songs (Metronome).
- **The red rain.** *Makes:* Bleed on the whole field (Briar, Bloodletter's phial, Barbed volley, Curse-book, Plague, Briar totem). *Reads:* nothing: Bleed pays each hit, so any hit on many foes pays every wound at once.
- **The riposte.** *Makes:* a dodge, on a unit the foes are aiming at. *Reads:* the dodge, as a swing: a strike at the attacker (Duelist's leathers), or the next basic attack at once, twice (Tempest cloak). That swing builds cover the way the unit already does: a Shield from hits, a drink.
- **Every colour.** *Makes:* several different debuffs on one foe, a stack or two of each: a random one a swing (Wildmagic wand), two on every foe at the start (Grimoire of plagues), three a cast (Plague), a rider beside the Hexer's own Chill. *Reads:* how many different ones the foe holds: Malison, and Hexweave mail. Idol of the deepening keeps each one topped up.
- **The lead's colour.** *Makes:* a status on one unit's basic attack, from its kit, a piece or a storm. *Reads:* that swing's riders, and puts them on another unit's basic attacks, added as its own weapon would add them: the two Followers (The standard), or the wand that follows whoever struck last (Mimic wand).
- **The emptied quiver.** *Makes:* crits that are near certain for a while: on a bleeding foe, one that hasn't acted, a Stunned one, after a kill, or by the coin. *Reads:* each crit, as the next basic attack at once (Quick draw). Its brake is the crit that fails.

**Casts and mana turn them over**
- **The blood mage.** *Makes:* a price in HP at each cast. *Reads:* the damage the cast deals, as a drink, foe by foe. The link is the price against the drink from one foe: it should lose life on one foe and gain it on three.
- **The resonance.** *Makes:* a cast that hits several foes. *Reads:* how many it hit, and brings that ability round sooner for each. Mana and a thinning pack are its brakes.
- **The crescendo.** *Makes:* a Crescendo each time the same spell is cast: more damage, more cost. *Reads:* nothing else: a cast that's free for another reason skips the price and still adds the stack.
- **Mana as armour.** *Makes:* MP given to the wearer: Clarity, Refrain, a heal that gives mana, a wand that tithes. *Reads:* the damage it takes, and takes it from MP first, so every giver heals.

**A shatter turns them over**
- **The shatter bell.** *Makes:* a shatter, anyone's. *Reads:* it, as the wearer's longest cooldown ready (Orb of the long winter, the Breaker seat) or its next hit tripled (Icebreaker charm).
- **The firecracker string.** *Makes:* a shatter, which spends a foe's Chill. *Reads:* the cold it held, and lays part of it again: on that foe (Glacier's heart), on the coldest foe left (Winter's chain), on every other foe (Splinters, Frostwalker's furs), and more with each shatter before it (Glacier blade, The long winter).

**Who gets picked, and who's healed, turns them over**
- **The brink.** *Makes:* a unit that's always the one with the lowest share of HP: by a cap at half (Halved heart, the Bleeder seat, The chalice) or by paying (Blood pact charm, Blood vial, Bloodletter, Heart of the saint). *Reads:* nothing new: every kit gift and every uncommon aimed at "the ally with the lowest share of HP" now lands on a unit the player chose.
- **Two in the dark.** *Makes:* Hidden on two of the party. *Reads:* nothing: foes can't pick a Hidden unit, so every single-target pick goes to the third. The link is Hidden's length against how often it's laid again.
- **The red stone.** *Makes:* healing on a unit that's already full. *Reads:* the part past full, as a Shield on it (Red stone mail, the Drinker seat) or on whoever was healed (Phylactery).

**Exotics**
- **The borrowed gift.** *Makes:* any status a unit gives itself. *Reads:* it, and gives the same to the other ally with the lowest share of HP (Twin-knot) or to the other Twin.
- **The carrier.** *Makes:* an affliction on the wearer, from a foe or from Burning heart. *Reads:* it: a stack of each onto whatever it hits (Carrier's coat), or the whole debuff handed to its next target (Scapegoat charm).

## The web

Checked across all nine roads. The tables are the script's; the estimates behind them are in its header.

### Every rung, by more than one route

<!-- roads:start -->
| Road | Rung 1 | Rung 2 | Rung 3 | Formations (common, rare, legendary) | Versions and mythics |
| --- | --- | --- | --- | --- | --- |
| Landslide | 8 pieces, 6 kinds | 13 pieces, 8 kinds | 4 pieces, 3 kinds | 2, 2, 3 | 11 |
| Thousand Cuts | 15 pieces, 10 kinds | 11 pieces, 10 kinds | 3 pieces, 3 kinds | 4, 2, 1 | 8 |
| Bonfire | 7 pieces, 7 kinds | 10 pieces, 9 kinds | 2 pieces, 2 kinds | 3, 1, 1 | 8 |
| Cold Snap | 8 pieces, 8 kinds | 12 pieces, 12 kinds | 2 pieces, 2 kinds | 2, 2, 1 | 7 |
| The Storm | 6 pieces, 6 kinds | 12 pieces, 11 kinds | 3 pieces, 3 kinds | 3, 2, 2 | 9 |
| The Hunt | 12 pieces, 11 kinds | 17 pieces, 11 kinds | 7 pieces, 7 kinds | 2, 3, 2 | 10 |
| The Toll | 11 pieces, 9 kinds | 18 pieces, 12 kinds | 4 pieces, 4 kinds | 3, 4, 1 | 14 |
| Barrage | 13 pieces, 10 kinds | 10 pieces, 7 kinds | 8 pieces, 7 kinds | 3, 3, 2 | 9 |
| Blood Pact | 12 pieces, 11 kinds | 13 pieces, 10 kinds | 5 pieces, 5 kinds | 1, 2, 1 | 9 |
<!-- roads:end -->

A formation or a version counts for a road here where it's worth ●● or more to it. Every road has pieces at every rung in three kinds or more, a formation at each rarity, and versions in several classes.

**Every class can wear its roads' steps.** Each cell is first steps / second rungs / far ends that the class can wear:

<!-- classes:start -->
| Class | Pieces it can wear, by road (rung 1 / rung 2 / rung 3) |
| --- | --- |
| Knight | Landslide 6/7/1 · Cuts 3/1/0 · Bonfire 2/1/1 · Snap 2/2/1 · Storm 1/3/1 · Hunt 2/4/2 · Toll 4/8/2 · Barrage 2/1/0 · Pact 2/3/0 |
| Cleric | Landslide 1/1/0 · Cuts 3/1/0 · Bonfire 4/6/2 · Snap 2/2/1 · Storm 1/2/0 · Hunt 0/4/1 · Toll 3/1/0 · Barrage 6/3/2 · Pact 4/6/2 |
| Ranger | Landslide 1/3/0 · Cuts 7/6/2 · Bonfire 1/1/1 · Snap 3/3/1 · Storm 1/1/0 · Hunt 4/9/4 · Toll 2/3/1 · Barrage 1/1/0 · Pact 2/2/0 |
| Bramble knight | Landslide 4/6/2 · Cuts 4/3/0 · Bonfire 2/2/1 · Snap 1/2/1 · Storm 2/3/0 · Hunt 1/2/1 · Toll 8/9/1 · Barrage 1/1/0 · Pact 5/5/2 |
| Hoplite | Landslide 5/7/2 · Cuts 3/1/0 · Bonfire 1/1/1 · Snap 1/3/1 · Storm 2/4/0 · Hunt 5/4/2 · Toll 6/5/2 · Barrage 2/1/0 · Pact 2/2/0 |
| Paladin | Landslide 5/6/2 · Cuts 4/2/0 · Bonfire 3/2/1 · Snap 1/3/1 · Storm 1/3/0 · Hunt 2/3/1 · Toll 6/6/2 · Barrage 2/1/0 · Pact 5/6/3 |
| Valkyrie | Landslide 1/3/0 · Cuts 6/5/1 · Bonfire 1/1/1 · Snap 2/2/1 · Storm 2/4/1 · Hunt 4/8/1 · Toll 5/8/2 · Barrage 1/1/0 · Pact 6/5/1 |
| Bard | Landslide 1/1/0 · Cuts 9/5/1 · Bonfire 2/3/1 · Snap 3/4/1 · Storm 3/4/1 · Hunt 2/6/3 · Toll 1/1/1 · Barrage 6/6/3 · Pact 2/3/0 |
| Hexer | Landslide 1/1/0 · Cuts 5/3/0 · Bonfire 2/3/1 · Snap 3/4/1 · Storm 2/6/1 · Hunt 1/3/2 · Toll 2/3/0 · Barrage 4/3/3 · Pact 4/5/1 |
| Monk | Landslide 1/1/0 · Cuts 8/5/2 · Bonfire 2/2/1 · Snap 2/3/1 · Storm 4/2/2 · Hunt 2/7/1 · Toll 3/4/2 · Barrage 1/2/0 · Pact 3/3/0 |
| Assassin | Landslide 1/3/0 · Cuts 9/4/2 · Bonfire 1/1/1 · Snap 2/3/1 · Storm 1/1/0 · Hunt 4/10/4 · Toll 1/1/1 · Barrage 1/1/0 · Pact 4/5/2 |
| Vampire | Landslide 1/1/0 · Cuts 8/3/1 · Bonfire 2/3/1 · Snap 2/3/1 · Storm 2/3/1 · Hunt 1/5/2 · Toll 2/1/0 · Barrage 2/1/1 · Pact 6/8/3 |
| Pyromancer | Landslide 1/1/0 · Cuts 3/2/0 · Bonfire 4/7/2 · Snap 2/4/1 · Storm 2/4/0 · Hunt 1/3/1 · Toll 1/0/0 · Barrage 8/6/5 · Pact 2/4/0 |
| Frostweaver | Landslide 1/1/0 · Cuts 5/2/0 · Bonfire 2/4/1 · Snap 4/5/2 · Storm 1/4/0 · Hunt 1/2/2 · Toll 2/1/0 · Barrage 9/8/6 · Pact 4/6/1 |
| Stormcaller | Landslide 1/1/1 · Cuts 8/4/2 · Bonfire 2/3/1 · Snap 3/4/2 · Storm 4/4/2 · Hunt 1/5/1 · Toll 2/4/1 · Barrage 5/6/2 · Pact 3/4/0 |
| Geomancer | Landslide 7/10/3 · Cuts 3/1/0 · Bonfire 2/1/1 · Snap 1/4/1 · Storm 1/2/0 · Hunt 3/2/2 · Toll 3/5/2 · Barrage 1/1/0 · Pact 1/2/0 |
<!-- classes:end -->

Every class has a first step and a second rung to wear on every road builds.md puts it on. No road's rung sits in one class's kinds alone, so nothing is fenced off: each route of each road reaches its second rung through pieces at least two of its three classes can wear.

### How often a run is offered a road's first step

<!-- signs:start -->
| Road | Its sign in the starting three | A first-step piece offered, act I | By act II's end | With its versions and common formations, act I | First steps in the stock | Thinnest route in act I, pieces alone |
| --- | --- | --- | --- | --- | --- | --- |
| Landslide | 67% | 73% | 91% | 84% | 8 pieces in 6 kinds, 1 versions, 1 common formations | Knight, Hoplite, Bard: 68% |
| Thousand Cuts | 77% | 86% | 98% | 93% | 15 pieces in 10 kinds, 1 versions, 2 common formations | Valkyrie, Ranger, Vampire: 83% |
| Bonfire | 57% | 51% | 75% | 88% | 7 pieces in 7 kinds, 3 versions, 2 common formations | Paladin, Monk, Hexer: 45% |
| Cold Snap | 73% | 52% | 75% | 76% | 8 pieces in 8 kinds, 2 versions, 2 common formations | Hexer, Ranger, Geomancer: 46% |
| The Storm | 49% | 52% | 75% | 72% | 6 pieces in 6 kinds, 0 versions, 2 common formations | Valkyrie, Hexer, Bard: 47% |
| The Hunt | 83% | 71% | 90% | 80% | 12 pieces in 11 kinds, 1 versions, 1 common formations | Paladin, Assassin, Stormcaller: 59% |
| The Toll | 54% | 68% | 89% | 77% | 11 pieces in 9 kinds, 1 versions, 1 common formations | Monk, Valkyrie, Bard: 62% |
| Barrage | 94% | 75% | 92% | 82% | 13 pieces in 10 kinds, 1 versions, 1 common formations | Cleric, Vampire, Geomancer: 64% |
| Blood Pact | 39% | 71% | 91% | 78% | 12 pieces in 11 kinds, 0 versions, 1 common formations | Vampire, Bard, Hoplite: 65% |
<!-- signs:end -->

- **The sign** is builds.md's: a passive counts as always there, an ability as known one time in three at the start.
- **A first-step piece** is one tagged rung 1 for the road that someone on the roster can wear, for a party on one of the road's three routes.
- **Act I gives enough to read every sign:** a first step sits on a weapon in every road (the slot act I always fills), in a version for seven roads (a passive's, always trainable, for three), and in a common formation for all nine.
- **Flagged: the three status roads that aren't Bleed's.** Bonfire, Cold Snap and the Storm are offered a first-step piece in about half of act I's, against seven in ten or more for the others. Their riders are spread over many kinds, but each party can wear only a few of them. With their versions and formations they reach seven to nine in ten.
- **Flagged: the Storm** is shown least. Its sign is in half of starting parties, it has no first step in a version, and its route without a Stormcaller is among the three thinnest in the set.
- **Flagged: Blood Pact's sign** is in two starting parties in five as a kit (the Vampire). The loot covers it: Lifesteal is a common on the amulet and in five kinds.

### How often a run is offered an engine's keystone

<!-- engines:start -->
| Engine | Its keystone, and where | A keystone piece offered to a roster that can wear it: act I, by II, by III | Its common half |
| --- | --- | --- | --- |
| detonation | Rubble plate (plate, rare); Second skin (round shield, rare); Shatterstone charm (amulet, rare); Rampart (version: Geomancer, Earthen shell B) | 26%, 45%, 59% | 16 parts, 8 of them uncommons or common formations |
| frozen gate | Hoarfrost plate (plate, rare); Toll gate (formation, rare: 26% by II); Frost armor (version: Frostweaver, Blizzard A) | 13%, 24%, 33% | 6 parts, 3 of them uncommons or common formations |
| mirror | Thornheart plate (plate, legendary); Mirror shield (kite shield, rare); Hoplon (round shield, rare); The long wall (formation, legendary: 5% by II); The last wall (mythic: Hoplite) | 24%, 41%, 54% | 11 parts, 7 of them uncommons or common formations |
| goad | Provoking blade (sword, rare); Goading horn (horn, rare); Storm front (formation, rare: 26% by II); Overgrowth (version: Bramble knight, Thicket A) | 9%, 17%, 25% | 15 parts, 9 of them uncommons or common formations |
| held charge | Stormbrand (sword, legendary); Thunderhead maul (great weapon, rare); Lightning-glass (amulet, rare); Eye of the storm (formation, legendary: 5% by II); Thunderclap (version: Valkyrie, Skyfall A) | 27%, 46%, 60% | 10 parts, 4 of them uncommons or common formations |
| reckoning | Grudgebearer (hammer, rare); Hammer and anvil (formation, rare: 26% by II) | 9%, 16%, 23% | 4 parts, 3 of them uncommons or common formations |
| reaping | Hunting spear (spear, rare); Bounty charm (amulet, rare); Coup de grâce (version: Assassin, Backstab A) | 16%, 29%, 40% | 8 parts, 2 of them uncommons or common formations |
| judge's drum | Pack leader's coat (leather, rare); Hunting horn (horn, rare); Open season (formation, legendary: 5% by II); Swift justice (version: Paladin, Condemn B) | 13%, 24%, 34% | 6 parts, 3 of them uncommons or common formations |
| opening again | Dawn runner's coat (leather, rare); Second dawn (amulet, legendary); Daybreak (formation, legendary: 5% by II) | 16%, 29%, 41% | 19 parts, 16 of them uncommons or common formations |
| fuse | Wick (lantern, rare); Smouldering orb (orb, rare); Ember heart (amulet, rare); Pyre line (formation, rare: 26% by II) | 20%, 35%, 47% | 0 parts, 0 of them uncommons or common formations |
| avalanche | Overkill axe (axe, rare); Overrun (great weapon, rare) | 10%, 18%, 26% | 2 parts, 2 of them uncommons or common formations |
| spell on the swing | Baton (wand, legendary); Bell of the hour (bell, rare); Metronome (mythic: Bard) | 14%, 27%, 37% | 2 parts, 2 of them uncommons or common formations |
| red rain | in the kits | no piece | 19 parts, 5 of them uncommons or common formations |
| riposte | Duelist's leathers (leather, rare); Tempest cloak (cloak, rare) | 15%, 27%, 37% | 11 parts, 6 of them uncommons or common formations |
| every colour | Wildmagic wand (wand, legendary); Grimoire of plagues (tome, rare); Plague (version: Hexer, Malison A) | 12%, 22%, 31% | 13 parts, 8 of them uncommons or common formations |
| lead's colour | Mimic wand (wand, rare); The standard (formation, common: 35% by II); Crown of embers (mythic: Pyromancer) | 6%, 12%, 17% | 19 parts, 14 of them uncommons or common formations |
| emptied quiver | Bloodscent knife (dagger, rare); Ambush knife (dagger, rare); Vulture's skull (trophy, rare); The king's head (trophy, legendary); Gambler's coin (amulet, legendary); Quick draw (version: Ranger, Hunter's eye B) | 29%, 48%, 62% | 2 parts, 1 of them uncommons or common formations |
| blood mage | Blood vial (vial, rare); Blood pact charm (amulet, rare); The covenant (formation, legendary: 5% by II) | 13%, 25%, 35% | 4 parts, 3 of them uncommons or common formations |
| resonance | Resonant robes (robes, rare); Storm front (formation, rare: 26% by II) | 9%, 17%, 24% | 3 parts, 2 of them uncommons or common formations |
| crescendo | Crescendo wand (wand, rare); Orb of the rising sun (orb, legendary) | 10%, 19%, 27% | 7 parts, 1 of them uncommons or common formations |
| mana as armour | Orb of the deep (orb, rare); Idol of the deep (idol, legendary) | 8%, 17%, 24% | 13 parts, 7 of them uncommons or common formations |
| shatter bell | Orb of the long winter (orb, rare); Icebreaker charm (amulet, rare); Icefall (formation, rare: 26% by II) | 14%, 26%, 36% | 0 parts, 0 of them uncommons or common formations |
| firecracker | Winter's chain (rune sword, rare); Glacier blade (rune sword, legendary); Frostwalker's furs (leather, rare); The long winter (formation, legendary: 5% by II); Splinters (version: Frostweaver, Shatterpoint B); Glacier's heart (mythic: Frostweaver) | 17%, 31%, 42% | 2 parts, 1 of them uncommons or common formations |
| brink | Bloodletter (sword, rare); Heart of the saint (relic, legendary); Blood vial (vial, rare); Bloodlust draught (vial, rare); Blood pact charm (amulet, rare); Halved heart (amulet, rare); Blood oath (formation, rare: 26% by II); The chalice (mythic: Vampire) | 35%, 57%, 72% | 26 parts, 10 of them uncommons or common formations |
| two in the dark | Shadow cloak (cloak, rare); Shroud charm (amulet, rare); Decoy (formation, rare: 26% by II); Smoke screen (version: Assassin, Vanish A) | 16%, 29%, 41% | 10 parts, 3 of them uncommons or common formations |
| red stone | Red stone mail (mail, rare); Phylactery (relic, rare); Blood oath (formation, rare: 26% by II) | 14%, 26%, 36% | 4 parts, 2 of them uncommons or common formations |
| borrowed gift | Twin-knot (amulet, legendary); Twins (formation, legendary: 5% by II) | 7%, 15%, 21% | 0 parts, 0 of them uncommons or common formations |
| carrier | Carrier's coat (leather, legendary); Scapegoat charm (amulet, legendary) | 21%, 39%, 53% | 1 parts, 0 of them uncommons or common formations |
<!-- engines:end -->

- **Every keystone comes from more than one place:** two to eight each, counting pieces, seats, versions and mythics. The red rain's is in the kits.
- **Every common half is close at hand,** in uncommons, common formations or the kits. The fuse's, the shatter bell's and the borrowed gift's are in the kits alone, as builds.md has them.
- **Flagged: a keystone piece is rarely offered.** To a roster that can wear it, some keystone piece of a given engine is offered in one act I in six, on average, and in about four full runs in ten. That's the offer roll, not the stock: a roll picks a slot, a class, a kind and then one piece of two to five. More places help little; fewer pieces a cell would cost the roads their steps.
- **The places that are met are the versions and the common formations.** A version is in about three of every eight trainings its class takes, so an engine with a keystone in a version (ten have one) is met by most runs that field that class.
- **Flagged, met least:** the reckoning, the avalanche, the resonance, the crescendo and mana as armour, with two places each and no version; and the borrowed gift, whose two places are both legendary.
- **This is the gate's first decision** (`report.md`): leave the offer roll as it is, or aim it.

### Every door has pieces both sides want

| Door | Pieces both sides want |
| --- | --- |
| Any status road into another | Tinder charm, The standard, Mimic wand, Idol of the deepening, Hexweave mail, Grimoire of plagues, Chain wand |
| Thousand Cuts into the Hunt | Marking knife, Bloodscent knife, Weeping kris, Second thrust, Venom vial, Dragon's tooth |
| Thousand Cuts into Blood Pact | Red stone mail, Crimson dregs, Lamprey claws, Tithing leathers, Gorged claws, Heartsblood, Open wound |
| Thousand Cuts into Barrage | Bell of the hour, Baton, Hummingbird charm, Dancer's cloak |
| The Toll into Thousand Cuts | Briar totem, Bristling spear, Duelist's leathers, Tempest cloak, Toll gate |
| The Toll into Cold Snap | Hoarfrost plate, Frost armor, Rimed blade, Toll gate |
| The Toll into Landslide | Mirror shield, Hoplon, Grudgebearer, Hammer and anvil, Urchin plate, Mountainfall |
| The Toll into the Storm | Goading horn, Provoking blade, Static mail, Thunderhead totem, Squall line, Storm front |
| The Toll into Blood Pact | Halved heart, Mender's mace, Penitent's mace, Watch horn, Aegis mail, Oathbound shield |
| The Storm into Cold Snap | Bellringer, Still hand, Rubble shield, Chain wand, Lightning-glass |
| The Storm into the Hunt | Tracker's coat, Storm pike, Oathkeeper, Ringing bell, Last page |
| The Hunt into Bonfire | Wick, Ember heart, Signal lantern, Pack leader's coat, Pyre line |
| Landslide into Cold Snap | Icebreaker, Icebreaker charm, Vulture's skull, Worldbreaker, Icefall |
| Landslide into Barrage | Reveille, Twice-told tome, Ritual staff, Rubato, Reprise |
| Landslide into the Hunt | Roaring greataxe, Overrun, Hunting horn, Harvest scythe, Headsman's axe, Heavy line |
| Barrage into Bonfire, the Storm or Cold Snap | Resonant robes, Staff of echoes, Orb of the long winter, Kindled robes, Storm front |
| Blood Pact into Barrage | Blood pact charm, Sanguine vestments, Batwing charm, Idol of the deep, The covenant |
| Blood Pact into Landslide | Heartsplitter, Mountainfall, Saint's mace, Cornerstone hammer, Blood oath |

### Exotics, and the elements

- **Exotics that belong to no road:** sixteen, about one in ten of the rares, legendaries and formations: Glass dagger, Wildmagic wand, Heartseeker, Carrier's coat, Last page, Idol of the hungry dark, Shadow cloak, Second dawn, Twin-knot, Scapegoat charm, Burning heart, Gambler's coin, Turncoat charm, The wheel, Twins, Daybreak.
- **The net** (falls and returns) is eleven pieces and one formation, sized as protection, and none wants a fall: a unit that stands back up (Phoenix ember, Swan's grace, Last bastion), the fallen brought back between fights (Lamp of vigil), the returned kept up (Vestments of return, Vigil), a quicker revive (Reliquary of mercy, Shield of the chosen), and cover for whoever drops low (Holdfast, Warded mail, Feathered cloak, Mottled hide).
- **The first move:** First light, Reveille, Scrying orb, Horn of the charge, Ready stance, and each road's own opener.
- **Stopping a cast** stays where builds.md puts it, in the versions that wait for a wind-up. The loot adds no piece that waits for one: Quiet robes and Warding bell are the party's own answer to a Silence.
- **Foes that do less** is six pieces and Thorn hedge, none of them a road's step.

## Least sure

- **The stock's shape.** 316 pieces is a sixth more to write, build and tune than today. The count follows the roads, kind by kind; whether a run can tell 93 uncommons apart is a question for play.
- **Riders as uncommons.** It makes a status road's first step an easy find, which is the point, and it means a third of the weapon uncommons read alike. Three plain riders on the fist weapons is the plainest case.
- **Tinder charm and The standard** make any party's second feeder without a second source. They may make the four status roads feel like one.
- **Keystones at rare.** Two dozen legendary effects moved down. If rares come to feel like the legendaries did, the far ends have less room above them.
- **The Hunt's Mark.** Marked lasts as long as `STATUS.marked` says, which is under half the time a Mark's foe takes to fall. The marker pieces lay it again; whether the party's blows stay together between Marks is a number, the balance pass's.
- **Malison counting every debuff.** It may pay too easily: a Marked, Weakened, Sundered foe is three kinds before any colour.
- **Heat as speed.** Speed feeds every status road at once. The Bonfire far end, the Hunt's kill counter and the dancer's dodge all build it.
- **The covenant** heals the party after every won fight, which is close to lasting more fights. builds.md asks for the last drink; a formation that gives it to three units may be too much of it.
- **Aegis mail** on the brink may be a unit that can't fall, as builds.md already fears.
- **The goad** is still a piece that speeds the foes up.
- **Two seats that read who sits in them:** The standard's Followers and Toll gate's Collectors do nothing behind a unit whose swing carries nothing.
- **The versions barely change:** eleven of 128. The earlier versions were split toward identities the nine roads use, and each was checked against its road. It may also mean the lead read them too kindly.
