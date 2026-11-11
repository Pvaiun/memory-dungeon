# The loot pass: the spine

The design for the loot the nine builds need (`docs/gear-design/builds.md`), one line an item: what the fill writes from. Nothing here is built, and the fill sets every number. It's two leads' spines merged after gate 1. The director's rulings at that gate are in `intent.md`; what's still theirs to rule is under *Open for the director*, at the end.

**How to read it.**
- **The rules** come first: the stock, the new words, the rules the pieces bend, and the code support, each named once.
- **The lines** follow: the two kit changes, the parts that recur, then the gear kind by kind, the formations, the versions and the mythics.
- **A line** reads: name · kind · rarity · what it does, in plain words. *Sees:* is what the player sees when it fires, on a road's first step and an engine's keystone.
  - After **→**, the roads it serves: a rung (1, 2 or 3) where it's that road's step, and its worth there (● a little, ●● some, ●●● a lot). `Cuts` is Thousand Cuts, `Snap` Cold Snap, `Pact` Blood Pact. A piece can also be `net` (falls and returns), `first move`, `foes do less`, `stops a cast` or `exotic`: builds.md's elements, and the pieces that belong to no road.
  - After **⚙**, the engines it's part of: `key` for a keystone, `half` for the common half.
  - After **◆**, the recurring parts it is.
  - None of this is ever on a card. Names are working names; a name of today's means today's piece, changed as its line says.
- **The tables** between `<!-- markers -->` are written by `npx tsx steps/loot/web-check.ts --write` from the lines, so they can't drift from them. Run it after any change to a line.

## The rules

### The stock

**A cell is one kind at one rarity, and an offer picks one piece from a cell.** So a cell's size doesn't change how often its kind is offered. It changes how often each piece in it is met. Three things follow, and they set every count below:
- **A cell holds what its wearers' roads ask of it, and no more.** Uncommons and rares follow the wearers: a kind worn by three classes on seven roads gets more than one worn by two on three.
- **A first step is a thread, not a piece.** No single uncommon is met often (about one act in ten for a unit that can wear it), so each road's first step sits in seven to fifteen pieces across as many kinds.
- **Legendaries follow the far ends, not the wearers.** A lone legendary is offered every time its cell is rolled, and a second one halves both, so a cell has two or three only where that many far ends or exotics belong on the kind.

**The amulet is the exception, and it costs.** It's the one slot every class wears, so it holds the any-class copy of the first steps and keystones that would otherwise be fenced into a few kinds. That makes its cells the biggest in the stock, and each of its pieces the least often met for a roll of its slot. Every one of those rolls can be worn, which is what it buys.

<!-- stock:start -->
| Kind | Wears | Common | Uncommon | Rare | Legendary | In all |
| --- | --- | --- | --- | --- | --- | --- |
| Dagger | 2 | 2 | 3 | 3 | 2 | 10 |
| Fist weapons | 3 | 2 | 4 | 4 | 2 | 12 |
| Wand | 3 | 2 | 3 | 2 | 2 | 9 |
| Sword | 3 | 2 | 3 | 4 | 1 | 10 |
| Spear | 3 | 2 | 3 | 3 | 1 | 9 |
| Axe | 2 | 2 | 3 | 3 | 2 | 10 |
| Bow | 2 | 2 | 3 | 2 | 1 | 8 |
| Rune sword | 2 | 2 | 3 | 3 | 2 | 10 |
| Hammer | 3 | 2 | 3 | 2 | 1 | 8 |
| Mace | 3 | 2 | 3 | 2 | 2 | 9 |
| Staff | 3 | 2 | 3 | 2 | 1 | 8 |
| Great weapon | 3 | 2 | 3 | 3 | 2 | 10 |
| **Weapons** | | **24** | **37** | **33** | **19** | **113** |
| Plate | 5 | 3 | 4 | 3 | 3 | 13 |
| Mail | 6 | 3 | 4 | 4 | 2 | 13 |
| Leather | 6 | 3 | 4 | 5 | 2 | 14 |
| Robes | 5 | 3 | 4 | 5 | 3 | 15 |
| **Armors** | | **12** | **16** | **17** | **10** | **55** |
| Kite shield | 3 | 2 | 3 | 3 | 1 | 9 |
| Round shield | 3 | 2 | 3 | 3 | 2 | 10 |
| Horn | 2 | 2 | 3 | 2 | 1 | 8 |
| Totem | 2 | 2 | 3 | 4 | 1 | 10 |
| Relic | 2 | 2 | 3 | 2 | 2 | 9 |
| Lantern | 2 | 2 | 2 | 2 | 2 | 8 |
| Tome | 3 | 2 | 3 | 4 | 3 | 12 |
| Orb | 2 | 2 | 2 | 3 | 2 | 9 |
| Idol | 2 | 2 | 2 | 3 | 3 | 10 |
| Vial | 2 | 2 | 2 | 3 | 1 | 8 |
| Trophy | 3 | 2 | 2 | 3 | 1 | 8 |
| Bell | 3 | 2 | 2 | 2 | 1 | 7 |
| Cloak | 3 | 2 | 3 | 3 | 1 | 9 |
| **Offhands** | | **26** | **33** | **37** | **21** | **117** |
| Amulet | everyone | 10 | 7 | 10 | 10 | 37 |
| **All** | | **72** | **93** | **97** | **60** | **322** |
<!-- stock:end -->

Plus the 12 plain weapons and the 16 mythics. Today's stock is 272, in even quarters of 68.

**Why each kind holds what it holds:**
- **Dagger, 10.** Two wearers on three roads. A wound, a second source of cold and a kill reward as first steps; three rares, because the Hunt's Mark and both conditions of the Ranger's crit loop sit on its blade.
- **Fist weapons, 12.** Three wearers on seven roads, the most of any kind: a rider in each of three colours and a drink, and four rares.
- **Wand, 9.** Riders for fire and charge and mana given; two rares that fan a swing out or copy one.
- **Sword, 10.** Three wearers with the widest spread of identities: four rares, one each for the Hunt's Mark, the goad, the anchor's wide swing and the price in life. One legendary.
- **Spear, 9.** Charge, reach and a kill's Shield. One legendary.
- **Axe, 10.** The executes, the avalanche and the last drink: two wearers, but two roads' far ends are an axe's.
- **Bow, 8.** An opener for each of its three roads. One legendary.
- **Rune sword, 10.** Two casters: cold on the ice mage's own swing, mana on a swing; a rare that gives frost from beside the wall. Two legendaries, for Barrage's mana as damage and for the cascade's payoff.
- **Hammer, 8.** A lean kind: three plain promises of a blow, two rares, and the party's stone in the blow as its one legendary.
- **Mace, 9.** Three wearers who keep and mend: fire on a slow swing and two keeper's gifts; a legendary each for Blood Pact and for Bonfire's keeper.
- **Staff, 8.** Mana given, a mender's gift, stone at the start; two rares; the cast twice as its one legendary.
- **Great weapon, 10.** Landslide's kind: three promises of a blow, three rares that read what the party set up (a Stun, a charge, a kill), two legendaries for the far end.
- **Plate, 13.** The draw, and stone turned into a blow. Rares for the frozen gate, the detonation and the Taunt that holds. Three legendaries: the Toll's far end, the reckoning across two units, and the net.
- **Mail, 13.** Six wearers on eight roads: a Shield by hitting, two nets, the first drink. Rares for the red stone, the rod, the brink's healing and breadth.
- **Leather, 14.** Five rares, each an engine's keystone that belongs on a light unit: the dodge answered, the blow from hiding, the kill that calls the volley, the kill that brings the opening back, the cold thrown on. The opening's rare is armor so its wearer's weapon, offhand and amulet are all free for the start-of-fight uncommons it fires again.
- **Robes, 15.** Five casters: four ways to mana or cover, and five rares, the biggest cell outside the amulet: the resonance, the price in life, Heat, Silence, and the soloist's reward for being fed. Three legendaries, one an exotic.
- **Kite shield, 9; round shield, 10; horn, 8; totem, 10.** The walls' offhands: three uncommons each and two to four rares, since the Toll's doors all open here. The goad's shout is a totem, so the Bramble knight can wear it, as builds.md asks. The round shield's second legendary is an exotic.
- **Relic, 9; lantern, 8; orb, 9; idol, 10; vial, 8.** Two wearers each: two or three first steps, two or three rares. Their second and third legendaries are Blood Pact's and Barrage's links (a price paid becomes a heal, or mana), the net, or an exotic.
- **Tome, 12.** Three wearers across Barrage, Cold Snap and the Hexer's curses: four rares and three legendaries, the biggest offhand.
- **Trophy, 8; bell, 7; cloak, 9.** Two or three first steps each.
- **Amulet, 37.** Ten commons, one for each stat a road starts from; seven uncommons, ten rares and ten legendaries, all any-class.

**Why each rarity moved:**
- **Commons, 72 (from 68).** Two a weapon and offhand kind, three an armor type, as today. The amulet goes from six to ten: today's amulet uncommons that were a special stat with a small rider (Lifesteal, Thorns, Double strike) become commons, since a special stat alone is a common's step, and Lifesteal on an amulet is Blood Pact's sign for any class.
- **Uncommons, 93 (from 68).** They carry nine roads' first steps and the engines' common halves, and two a kind couldn't hold them.
- **Rares, 97 (from 68).** An engine's keystone is a rare wherever it's a road's second rung, and about two dozen of today's legendary effects move down. The reason is timing and the pick, not how often a piece is offered: counting elites, a given legendary is offered about as often as a given rare. But rares come one a fight from floor one, and a run keeps one of the three it's shown; legendaries mostly arrive three at a time from an elite, later in the act, and a run keeps one of those. A keystone has to arrive while its other half is still close at hand. Its grown form stays legendary.
- **Legendaries, 60 (from 68).** The far ends, the links that reach across classes, and the exotics.

**What stays of today's loot.** A piece stays where it serves a road or an engine: about half the rares and legendaries keep a card of today's, many at a new rarity or a new size, and a few keep only the name. The pieces made for the builds that were set aside go: the falls (Phoenix), the wait for a wind-up (Lockdown), spread for its own sake (Harvest), the mana relay (Overflow) and the opening with no tail (Ambush). What they had that the nine use is kept under its new road: the kill rewards and openers in the Hunt, the wide hits in each road's pack game, the mana links in Barrage.

**Formations: 35 and Neutral** (13 common, 12 rare, 10 legendary; today 32). Every road has one at each rarity; four commons are shared ground; four more carry an engine, the net or an exotic.

**Versions: 9 of 128 change. Mythics: 5 of 16 change. Kits: the two approved changes, and no other.**

### New words

- **Marked** takes the party's random picks (the first kit change, below). Its length stays its own (`STATUS.marked`).
- **Affliction:** Burn, Chill, Shock, Bleed and Sunder: the debuffs that build in stacks. Malison, the Wildmagic wand and the carrier's pieces use the word.
- **Counters:** six, each a status of its own with one meaning, shown as an icon with a number and kept for the fight unless its card spends it.
  - **Cuts:** hits landed. Thousand Cuts' far end.
  - **Heat:** speed that builds: its holder acts faster in everything, a stack. Bonfire's far end, the kill that speeds up the next, and the dancer's dodge. It takes over what Tempo did; what it did before (damage a stack) goes.
  - **Spite:** blows lived through. The Toll's far end.
  - **Wrath:** hits saved for one blow, then spent. The reckoning. Today's Charge, renamed: "charge" is the Storm's word for Shock in every document.
  - **Crescendo:** times the same ability has been cast this fight, counted ability by ability.
  - **Cascade:** shatters this fight.
  - Tempo, Surge and Fervor go, with the pieces that used them.
  - Each climbs by `loot.md`'s rule for counters: capped, or slow enough that a fight twice as long isn't twice the stack. Heat and Cascade feed themselves (speed brings more of the swings that build it; Chill brings the shatters it counts), so theirs matters most.
- **Phrases a card needs once, each with one meaning:**
  - **"Carrying what the swing carries":** an extra hit that applies the statuses its wearer's basic attack applies to its target, from gear, a seat, a passive or a status it holds (Cold hex's Chill, Iron palm's Sunder, Arc's Shock, a Thunderstorm's). It carries no second target, no damage boost and no Refrain.
  - **"As it was struck":** a blow's size after its attacker's boosts and before Defense, Guard, Aegis and Shields took their share.
  - **"What a killing blow has left over":** its damage past the HP its foe had left. It lands as the same hit, so it meets the next foe's Defense.
  - **"Start-of-fight effects":** whatever a piece, a seat or a formation's rule does as a fight starts, however its card words it ("when each fight starts", "starts every fight"), and whatever it gives its wearer's first swing or cast of a fight. Happening again, each does now what it did then: the status is given again, the strike lands again, the next swing gets what the first one got. A kit's own effects don't happen again, and neither does a price or a drawback paid at the start.
  - **"Its first-slotted ability":** the ability first in the order the player set, ready or not.
  - **"Cast off its cooldown":** the ability resolves now, with no wind-up and its cooldown left as it was, and its MP is paid. With too little MP it doesn't fire.
  - **"Every so often"** stays the short cooldown word.
  - **"The other ally with…"** is the vocabulary's: the holder is left out. A line without "other" can land on its own holder.
  - **"Strikes with its weapon":** a hit of its basic attack's size, out of turn, carrying what the swing carries. It's a hit, so whatever the unit's hits do, it does. It isn't a basic attack: it isn't counted as one, sets off nothing that waits on one, and leaves the unit's own swing where it was.
  - **"Sent back":** damage a foe takes from a piece or a seat for striking a unit, or when a Shield breaks. It's a reaction, as Thorns is, and not a hit: Evasion and Defense don't touch it, it can't crit, and nothing that reads a hit reads it.
  - **"Pays HP":** a price an ability or a swing takes from its user's own HP, or from the Vampire's for an ally's ability under The chalice, where the Vampire is the payer. It isn't damage. HP lost to a drawback at a fight's start, to a drain or to a status isn't a price paid.
  - **"Gives MP":** MP put into another ally's pool in one piece, by an ability, a hit, a piece or a seat. MP that flows in over time (Clarity, The cathedral's Voices) isn't a gift, and neither is what a unit gives itself.
  - **"Gives itself":** a status a unit's own ability, passive, gear or seat lays on that unit, alone or with others. A status it holds because Twins or Twin-knot passed it on isn't one.
  - **"At once"** doesn't stack: a unit whose next basic attack has been called gains nothing from a second call before it lands.

### The rules the pieces bend or add

**Ruled at gate 1** (`intent.md`):
- **One Mark from gear.** A piece or a seat never adds a second Mark. Each lays one "while no foe is Marked", or moves one when its foe falls, so a second marker in a party keeps a Mark up for longer and never splits the party's blows. The Paladin's Condemn still lays its own, as the vocabulary has it. With two Marks up, a random pick goes by draw among the Marked, and only an ability's first pick follows a Mark.
- **Malison counts the five afflictions.**
- **Alike cards.** An upgrade never copies a piece. Two pieces one unit could wear together never read the same. A piece and a formation seat may share a rule: a run finds one or the other, and a party-wide formation is a different commitment from an amulet.
  - **Ruled since:** "the same" is the same sentence. An engine's keystone sits in more than one place by builds.md's own rule, so a second home does the same job and differs in who it lands on, when, or how wide (Hoarfrost plate, Frostward blade and Frost armor). A far end is its keystone grown, as builds.md writes the Toll's (Mirror shield and Thornheart plate). The pairs a fresh reader still found close are under *Least sure*.
- **A plain rider may sit in more than one kind** when no unit could hold both, sized to each kind's swing. A kit's plain rider is read the same way, and the director agreed: Hex of flames and Kindling are versions that read as Spark wand does, and all three stay.
- **A chain of shatters fizzles out** (ruled after the gate). In a chain, where one shatter's cold sets off the next, a foe that has already shattered takes less of the cold passed to it, and less again each time it shatters: about half, then half of that. It never takes none. Nothing on a card says so, and the player learns no rule: they see the chain run and die down. It's a rule of Chill's own, for the vocabulary when it's built, and the numbers are whatever ends every chain.
  - **Why it's needed:** without it Splinters in a pack of four, or Winter's chain beside Glacier's heart, shatters the same foes without end.
  - **How the spine reads it,** for the director to correct: it damps cold that another foe's shatter passes on, not Chill from swings and spells; it's gone when the chain is over; and what Glacier's heart puts back on the foe that burst isn't damped, so a lone boss's second shatter still comes in half the time, as builds.md has it.

**Bent or added by the spine, and still the director's to cut** (*Open for the director*):
- **A status on a swing is an uncommon's effect.** Today's plain riders are rares. They move down, sized to be seen (a few a swing on a fast kind, several or many on a slow one), because they're the four status roads' first step. No rare is a rider made bigger.
- **Two swing shapes are uncommons.** Millstone and Hummingbird charm reshape a unit's basic attacks, and were rares. They're the simplest statement of Landslide's and Thousand Cuts' first steps, and Millstone is the common half of five engines.
- **"All fight" means renewed as it runs out.** Challenger's plate and The palisade's Wall Taunt all fight, as two of today's seats do: the status is laid again each time it ends, and keeps its own length. It makes that length matter less than the rules mean it to.
- **The last drink.** The Red Feast heals its wearer up to half its HP when a fight is won. builds.md asks for power below half that doesn't leave a unit low when the fight ends; `docs/rules.md` says no build is made better at lasting many fights. It's on one legendary.

**Aegis and Hidden appear on gear and seats,** as `docs/rules.md` now allows: Aegis on one legendary, Hidden on five pieces and one formation.

**Chains end.** Three rules, each said once here and written on the card it applies to:
- **A repeat isn't repeated.** What a piece lands, casts, copies, passes on or carries a second time is never repeated again, by that piece or by another, unless its line says it runs on (Overrun, and Flurry wraps up to its count).
- **A redirect is final.** A hit taken for an ally, and a Shield, MP or healing sent on to someone else, isn't sent on again. Two of the same piece in one party don't pass a thing back and forth.
- **A fallen foe's fire moves once.** Where a party holds two pieces or seats that move the same Burn, it's split evenly between the places they send it.

**Healing past full goes one place:** the healed unit's own piece first (Red stone mail), then the healer's (Phylactery), then the formation's (Shared cup).

**Kept from today:** extra strikes that chain; a hit taken for an ally; effects after a won fight; Taunt ends Hidden; paying HP isn't damage.

**Added for the engines** (each is one rule on a card, and each is in the code support below): a foe's swing called early; retaliation sized by the blow as it was struck; damage carried past a kill; damage taken from MP; an ability cast by a count of swings; start-of-fight effects that happen again; a status passed on by its holder; an ability brought back by the foes it hit; a swing that carries another unit's riders; a gift to oneself shared with an ally.

**What no piece does:** grant an ability; resize a status or apply it for less or more than its own length; spend, shorten or set off a status; send a hit past Evasion or Defense; want a fall; give the party an enemy-only status; read a number the player can't see.

### Code support

Named once, so the fill can name it by its number. "New" means no item does it today, judged from today's cards; the build confirms each against `PRIMITIVES.md` before writing it.

1. **Marked steers abilities** aimed at a random foe, inside the Taunt rule; with several Marks, by draw among them. New (a rule).
2. **A count of different afflictions or debuffs on a target** as a size: Malison, Hexweave mail. As today's Hexweave mail.
3. **A foe's next basic attack called at once:** the goad's two pieces. New.
4. **A reaction that reads a blow before mitigation,** and one that reads what the cover stopped: the mirror's places. New; today's The last wall reads what an Aegis blocked.
5. **Damage carried past a kill** into another foe, as the same hit: the avalanche's three pieces. New.
6. **Damage taken from MP first** (Orb of the deep, Idol of the deep), and MP past full made a Shield (Idol of the deep). New. MP past full sent to an ally is today's Leech idol.
7. **An ability cast off its cooldown by a count of basic attacks** (Bell of the hour); a swing that cuts a named ability's cooldown (Baton). New; today's Metronome counts hits to ready abilities.
8. **Start-of-fight effects of gear and seats fired again** on a kill or a fall, prices left out: the opening, again. New.
9. **A status moved or laid elsewhere:** a fallen foe's Burn to another foe, as today's Wick; a share of a shattered foe's cold laid on other foes, where today's Winter's chain lays a fixed few; the wearer's own afflictions onto what it hits, and a whole debuff handed on (Carrier's coat, Scapegoat charm); Chill added to one foe added to all (Heart of winter). The last three are new.
10. **An ability's cooldown cut by the foes it hit:** the resonance. New.
11. **A per-ability cast count that raises what it does, and its cost:** Crescendo. New.
12. **Riders copied between units:** a seat or a wand that carries another unit's basic-attack riders (The standard, Mimic wand); a seat that lays its riders on whatever strikes another seat (Toll gate); an extra hit "carrying what the swing carries"; a rider that reads which status its target holds most of (Tinder charm). Today's Echo charm does the third on one unit; the rest are new.
13. **A status a unit gives itself, copied to an ally:** the borrowed gift's two places. New.
14. **Healing capped at half HP** (Halved heart), and healing past full sent to an ally (Shared cup). New. Healing past full into a Shield is today's Phylactery.
15. **A counter one unit fills and another reads or spends** (Hammer and anvil, The anvil, The palisade), and counters the party shares (The whetstone's Cuts, Cascade). Today's Metronome is a party count; the rest is new.
16. **A blow landed a second time** (Twinfall, The mountain, Hunting spear, Still hand), as today's Dragon's tooth does for crits, and a cast made twice (Staff of echoes, Twice-told tome). The second never happens again.
17. **Strikes on new triggers:** when a foe holding Shock acts (Answering thunder); at every foe that has hit the wearer since its last swing (Sarissa); at a foe that starts a wind-up (Hushing idol); by an ally when the wearer dodges (Parrying spear); basic attacks made during a wind-up (Tireless bell). Strikes on a hit taken and on a dodge are today's Pike wall and Duelist's leathers.
18. **Reading the party's whole Shield** (Cornerstone hammer) and the field's whole Shock (Stormbrand, the Bolt seat). New; today's Cornerstone maul reads its wearer's own Shield.
19. **Marks from new events:** on a crit, on a heal (at the foe that last hit the healed ally), standing on the lowest foe. Moving a Mark at a fall is today's Gravemark, and "the foe its wearer last hit" is as today's The pack follows its Lead. "The foe that last hit an ally" is a memory the engine doesn't keep yet.
20. **Costs in HP** for a whole party (The covenant), for heals alone (Heart of the saint), and paid by one unit for another (The chalice), beside today's Blood covenant; a reaction to an ally paying HP (Bloodstone reliquary, Idol of the blood-well); damage from the MP an ability cost (Brimming blade); a reaction to MP given by an ally (Glimmer robe); a heal as a fight is won, beside today's stand-ups.
21. **Changes to how an ability is cast:** no cooldown, mana its only brake (The cathedral); every other cast with no wind-up (Evensong staff); a random order (Motley robe); abilities that aim at a foe in a wind-up (Marginalia). New.
22. **Small ones:** two stats swapped (Turncoat charm); every Shield an ally would gain sent to one unit (Lodestone shield); a status the wearer lays on itself (Burning heart).
23. **Chains that end:** in a chain of shatters, cold passed to a foe that has already shattered in it is cut by about half for each time it has, in fractions of a stack, so it's never nothing and it always dies down (a floor of one whole stack didn't end a chain in a pack of seven beside Glacier's heart); a repeat, a copy or a carry that's marked so nothing repeats it; a redirect that isn't redirected again; a call for the next basic attack that doesn't stack. New (rules).

## The lines

### The two kit changes already approved

Everything after these reads them.

- **Marked** · vocabulary · kit change · A Marked foe takes the party's random picks: basic attacks, as today, and every ability aimed at "a random foe" (Shield bash, Barbed arrow, Bramble lash, Spear thrust, Gale spear, Garrote, Blood drain, Chain lightning's first strike, Rockfall, Tremor), inside the Taunt rule, with Seek following the Mark past a Taunting foe. An ability with a target phrase of its own keeps it. *Sees:* a Mark lands, and everything the party was going to throw anywhere lands on one foe.
- **Malison** · Hexer · kit change · Curses every foe: a hit, from Attack, that deals more for each different affliction the foe holds, and adds a few Bleed. It no longer adds a stack of each affliction. *Sees:* the curse's number is biggest on the foe with the longest row of icons.
  - **Ruled:** it counts the five afflictions (Burn, Chill, Shock, Bleed and Sunder), each once. The Hexer's own kit reaches three alone (its Chill, its Bleed, Enfeeble's Sunder), and the other two have to come from an ally or a piece. Its few Bleed stay, which keeps builds.md's "four base kits open wounds" true.

### The parts that recur

builds.md's nine parts, each in several engines. They were written first, so a run holding one has more than one partner to meet. The kits hold many of them already; these are the pieces that add to the kits. Each piece's line is under its kind.

<!-- parts:start -->
| A part | Where it sits |
| --- | --- |
| A Shield made by what a unit already does | *Uncommon:* Victor's spear (spear), Mason's hammer (hammer), Scabbed mail (mail), Glyphed robe (robes), Hooded cloak (cloak)<br>*Rare:* Red stone mail (mail), Phylactery (relic) |
| A draw on one unit | *Uncommon:* Portcullis (plate), Watch horn (horn), Matador's cape (cloak), Challenger's token (amulet)<br>*Rare:* Challenger's plate (plate) |
| A status on a swing | *Uncommon:* Weeping kris (dagger), Sleet dirk (dagger), Live-wire knuckles (fist), Cinder wraps (fist), Rime knuckles (fist), Spark wand (wand), Jolt wand (wand), Rimed blade (sword), Jolt spear (spear), Ragged axe (axe), Broadhead bow (bow), Frostbite bow (bow), Sleet blade (rune sword), Censer mace (mace), Tinder charm (amulet) |
| A hit on many foes | *Uncommon:* Ringing bell (bell)<br>*Rare:* Forked knuckles (fist), Chain wand (wand), Oathkeeper (sword), Squall lance (spear), Volley bow (bow) |
| A foe held still | *Uncommon:* Bellringer (hammer)<br>*Rare:* Still hand (fist), Icebreaker (great weapon), Rubble shield (kite shield), Vulture's skull (trophy)<br>*Legendary:* Worldbreaker (great weapon) |
| A kill that pays | *Uncommon:* Second thrust (dagger), Victor's spear (spear), Reaver's axe (axe), Harvest scythe (great weapon), Hunter's buckler (round shield), Bull's horn (horn), Charnel icon (relic), Mana pearl (orb), Hunter's skull (trophy)<br>*Rare:* Thirsting axe (axe), Pack leader's coat (leather), Overture coat (leather), Hunting horn (horn), Shadow cloak (cloak), Bounty charm (amulet)<br>*Legendary:* Headsman's axe (axe), The king's head (trophy) |
| The slowest, heaviest blow | *Uncommon:* Warden's hammer (hammer), Roaring greataxe (great weapon), Giantsbane (great weapon), Harvest scythe (great weapon), Bossed kite (kite shield), Millstone (amulet)<br>*Rare:* Grudgebearer (hammer), Mountainfall (hammer), Overrun (great weapon), Thunderhead maul (great weapon), Monolith shield (kite shield), War horn (horn)<br>*Legendary:* Headsman's axe (axe), Worldbreaker (great weapon), Twinfall (great weapon) |
| The ally with the lowest share of HP | *Uncommon:* Mercy's edge (sword), Mender's mace (mace), Vesper staff (staff), Comrade's targe (round shield), Bear fetish (totem), Charnel icon (relic) |
| A cast that's free, or mana given | *Uncommon:* Tithe wand (wand), Wellblade (rune sword), Shepherd's staff (staff), Matins robe (robes), Acolyte's robe (robes), Font relic (relic), Mana pearl (orb), Leech idol (idol), Clear-headed charm (amulet)<br>*Rare:* Forked knuckles (fist), Spellbinder (rune sword), Twice-told tome (tome), Accompanist's score (tome), Meltwater orb (orb)<br>*Legendary:* Annotated grimoire (tome), The deep well (orb) |
<!-- parts:end -->

What the nine come to, in this stock:
- **A Shield made by what a unit already does** is five uncommons: by hits (Mail, the hammer), by dodges (the cloak), by casts (Robes), by kills (the spear). Healing past full is the red stone's two rares.
- **A draw** is four uncommons: a Taunt at the start on the amulet, for any class; a Taunt whenever an ally is in trouble on the horn; a Taunt on every dodge on the cloak; Aggro while healthy on Plate. A Taunt all fight is Plate's rare.
- **A status on a swing** is fifteen uncommons: twelve riders in nine weapon kinds, Tinder charm on the amulet, which follows whatever colour the party has started, and two openers that wound by crit or first hit.
- **A hit on many foes** is the bell's ring as the uncommon, and five rares that fan a swing out (a fist weapon, a wand, a sword, a spear, a bow). Each carries what the swing carries. builds.md warns that a slot whose whole promise was one more foe was never taken; these still promise more foes, and are under *Least sure*.
- **A foe held still** is the hammer's fourth swing as the uncommon. The pieces that read a held foe are rares.
- **A kill that pays** is nine uncommons, each paying a whole action or a visible status: the next swing at once, a doubled hit, Haste, a Shield, a Heat, mana, a heal.
- **The slowest, heaviest blow** is Millstone on the amulet, as an uncommon, so any class can be the hammer, and five more that make a heavy blow heavier. Monolith shield does for abilities what Millstone does for swings.
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
- **Marking knife** · dagger · rare · While no foe is Marked, its crits Mark their target. *Sees:* the crit that opens a wound calls the whole party onto it. → Hunt 2 ●●●, Cuts ●●
- **Bloodscent knife** · dagger · rare · Its hits on a bleeding foe crit far more often. *Sees:* a run of crits on any wounded foe. → Cuts 2 ●●●, Hunt ●● ⚙ emptied quiver (half)
- **Ambush knife** · dagger · rare · Its hits on a foe that hasn't acted yet this fight nearly always crit. *Sees:* nearly every blow of the first moments is a crit. → Hunt 2 ●●●, Cuts ● ⚙ emptied quiver (half)
- **Thousandth cut** · dagger · legendary · Each hit it lands adds a Cut, kept for the fight. Its hits deal more for each Cut. → Cuts 3 ●●●, Snap ●, Storm ●
- **Quietus** · dagger · legendary · When each fight starts, it strikes every foe once, at once. → Hunt 3 ●●●, Cuts ●● ⚙ red rain (half), opening again (half)

##### Fist weapons
*Wears:* Monk, Vampire, Stormcaller. *Signature:* Double strike. *Stats lean:* Thousand Cuts and the Storm to Attack speed and Double strike; Blood Pact to Lifesteal and HP; the Toll's dancer to Evasion.
- *Commons (2):* one leans to Double strike and Attack speed, one to Double strike and Lifesteal.
- **Live-wire knuckles** · fist · uncommon · Its basic attacks and extra strikes add a few Shock. *Sees:* a second unit charging the field, and foes hurt as they swing. → Storm 1 ●●, Toll ● ⚙ lead's colour (half), held charge (half) ◆ swing-status
- **Cinder wraps** · fist · uncommon · Its basic attacks and extra strikes add a few Burn. *Sees:* the fire's number standing twice as high. → Bonfire 1 ●●, Cuts ● ⚙ lead's colour (half) ◆ swing-status
- **Rime knuckles** · fist · uncommon · Its basic attacks and extra strikes add a few Chill. *Sees:* the frost counter climbing between casts. → Snap 1 ●●, Cuts ● ⚙ lead's colour (half) ◆ swing-status
- **Lamprey claws** · fist · uncommon · Each extra strike it lands heals its wearer (from max HP). *Sees:* a green number with every second strike. → Pact 1 ●●, Cuts 1 ●
- **Gorged claws** · fist · rare · While its wearer is below half its HP, its basic attacks come a third faster. → Pact 2 ●●●, Cuts ●● ⚙ brink (half)
- **Bellows wraps** · fist · rare · Each hit it lands on a burning foe raises that foe's Burn by a twentieth of what it holds. *Sees:* a fast unit's blows make the fire climb on its own. → Bonfire 2 ●●●, Cuts ●
- **Still hand** · fist · rare · Its hits on a Stunned foe strike twice; the second strike doesn't strike again. → Snap 2 ●●, Cuts ●●, Landslide ● ◆ held
- **Forked knuckles** · fist · rare · Its basic attacks leap to one more foe for half, carrying what the swing carries, and each foe they hit after the first gives its wearer some MP. *Sees:* two numbers a swing, and a blue bar that fills as it fights a crowd. → Storm 2 ●●●, Barrage ●●, Cuts ● ⚙ red rain (half), resonance (half) ◆ wide-hit, free-cast
- **Flurry wraps** · fist · legendary · Its extra strikes can strike again: each rolls Double strike for one more, at most two more after the first, each a little weaker than the last. → Cuts 3 ●●●, Storm ●●, Pact ●
- **Answering thunder** · fist · legendary · Each time a foe that holds Shock acts, the wearer strikes it with a basic attack, if it's free to. → Storm 3 ●●●, Cuts ●●, Toll ●

##### Wand
*Wears:* Bard, Hexer, Pyromancer. *Signature:* Cooldown. *Stats lean:* Barrage to Cooldown and Cast speed; Bonfire, Cold Snap and the Storm to Attack speed and Attack; the Bard's songs to Cooldown and MP regen.
- *Commons (2):* one leans to Cooldown and Attack speed, one to Cooldown and MP regen.
- **Spark wand** · wand · uncommon · Its basic attacks add a few Burn. *Sees:* a steady fire under the casts' leaps. → Bonfire 1 ●●, Cuts ● ⚙ lead's colour (half), every colour (half) ◆ swing-status
- **Jolt wand** · wand · uncommon · Its basic attacks add a few Shock. *Sees:* a second unit's charge on the foes, paid when they act. → Storm 1 ●●, Toll ● ⚙ lead's colour (half), every colour (half), held charge (half) ◆ swing-status
- **Tithe wand** · wand · uncommon · Each basic attack it lands gives the ally with the least MP some MP. *Sees:* the caster's blue bar ticking up between its spells. → Barrage 1 ●● ⚙ mana as armour (half) ◆ free-cast
- **Chain wand** · wand · rare · Its basic attacks also strike two other foes for half, carrying what the swing carries. *Sees:* one swing, three numbers, and three foes chilled or burning. → Snap 2 ●●, Bonfire 2 ●●, Storm ●●, Cuts ●● ⚙ red rain (half) ◆ wide-hit
- **Mimic wand** · wand · rare · Its basic attacks carry whatever the basic attacks of the other ally with the highest Attack carry. *Sees:* the wand lays the same status its strongest neighbour's weapon does. → Bonfire 2 ●●, Snap 2 ●●, Storm 2 ●●, Cuts ● ⚙ lead's colour (key), every colour (half)
- **Wildmagic wand** · wand · legendary · Each of its basic attacks adds a few stacks of one of Burn, Chill, Shock, Bleed and Sunder, at random. *Sees:* a different icon with every swing, until each foe wears a row of them. → exotic, Bonfire ●, Snap ●, Storm ●, Cuts ● ⚙ every colour (key)
- **Baton** · wand · legendary · Each basic attack it lands brings its wearer's first-slotted ability round sooner: a fifth of the wait that's left. *Sees:* the spell's name comes round on the beat of the swings. → Barrage 3 ●●●, Cuts ●● ⚙ spell on the swing (key)

##### Sword
*Wears:* Knight, Hexer, Valkyrie. *Signature:* Attack. *Stats lean:* the Toll to HP, Defense and Aggro; the Hunt and the Storm to Crit chance; Barrage's well and Blood Pact to HP.
- *Commons (2):* one leans to Attack and Crit chance, one to Attack and HP or Aggro.
- **Rimed blade** · sword · uncommon · Its basic attacks add a few Chill, read off its wearer's max HP. *Sees:* a wall or a spear-maiden slowing what it strikes. → Snap 1 ●● ⚙ lead's colour (half), every colour (half) ◆ swing-status
- **Drawn steel** · sword · uncommon · Its first hit on each foe deals double. *Sees:* a big number each time it turns to a new foe. → Hunt 1 ●●, Landslide ●
- **Mercy's edge** · sword · uncommon · Each basic attack it lands heals the ally with the lowest share of HP for a share of the damage. *Sees:* a green number on the most hurt ally with every swing. → Pact 1 ●●, Toll ●, Cuts ● ⚙ brink (half) ◆ lowest-ally
- **Gravemark** · sword · rare · Its hits on a Marked foe deal half again as much. When a Marked foe falls and leaves none Marked, it Marks the foe with the lowest HP. *Sees:* the Mark jumps as each foe falls. → Hunt 2 ●●●
- **Provoking blade** · sword · rare · The foe its basic attack lands on makes its own next basic attack at once, at whoever it would have picked. *Sees:* the foe strikes out of turn, and pays whatever its own action costs it. → Storm 2 ●●●, Toll 2 ●●●, Snap ● ⚙ goad (key)
- **Oathkeeper** · sword · rare · While its wearer Taunts, its basic attacks also hit every other foe, carrying what the swing carries. *Sees:* a row of numbers from one swing, for as long as the Taunt lasts. → Toll 2 ●●●, Storm ●●, Cuts ●●, Hunt ● ⚙ red rain (half), reaping (half) ◆ wide-hit
- **Bloodletter** · sword · rare · Each of its swings costs its wearer a little HP, and deals extra damage equal to several times the price. *Sees:* the wearer's bar steps down and its numbers jump; a Shield on it is never spent by the price. → Pact 2 ●●●, Landslide ● ⚙ brink (key)
- **Stormbrand** · sword · legendary · Its hits deal extra damage for each Shock the foes hold. The Shock stays. *Sees:* the more of the field is charged, the bigger every one of its numbers. → Storm 3 ●●●, Toll ● ⚙ held charge (key)

##### Spear
*Wears:* Hoplite, Valkyrie, Monk. *Signature:* Aggro. *Stats lean:* the Toll to Aggro, Defense and HP; the Hunt to Crit chance and Attack; the Storm to Attack speed.
- *Commons (2):* one leans to Aggro and Defense, one to Aggro and Attack.
- **Jolt spear** · spear · uncommon · Its hits add a few Shock, swing or ability. *Sees:* three quick hits, three charges. → Storm 1 ●●, Toll ● ⚙ lead's colour (half), held charge (half) ◆ swing-status
- **Victor's spear** · spear · uncommon · When it lands a killing blow, its wearer gains a Shield (from Attack). *Sees:* a grey bar after each kill. → Hunt 1 ●●, Cuts ● ⚙ detonation (half) ◆ kill-pays, shield-by-doing
- **Long spear** · spear · uncommon · Its basic attacks ignore Taunt. *Sees:* its swings land on the back row while a guard stands in front. → Hunt 1 ●●, Storm ●
- **Hunting spear** · spear · rare · Its hits on a foe below half its HP land twice. → Hunt 2 ●●●, Cuts ●●
- **Parrying spear** · spear · rare · Each time its wearer dodges a hit, the other ally with the highest Attack strikes the attacker with its weapon. *Sees:* MISS, and the blow back comes from the ally beside it. → Toll 2 ●●●, Cuts ●● ⚙ riposte (key)
- **Squall lance** · spear · rare · Every fifth hit its wearer lands, swing or ability, also strikes every other foe (a light hit, from Attack), carrying what the swing carries. The flash's own hits aren't counted. *Sees:* a count, then a flash across the whole field. → Storm 2 ●●●, Cuts ●●, Bonfire ●, Hunt ● ⚙ red rain (half), reaping (half) ◆ wide-hit
- **Sarissa** · spear · legendary · Its basic attacks hit every foe that has hit its wearer since its last swing. → Toll 3 ●●●, Storm ●●, Landslide ●●

##### Axe
*Wears:* Vampire, Assassin. *Signature:* Lifesteal. *Stats lean:* Blood Pact to Lifesteal and HP; the Hunt to Attack and Crit damage.
- *Commons (2):* one carries Lifesteal, one Attack. The axe's budget is lean, so each carries one step.
- **Reaver's axe** · axe · uncommon · When it lands a killing blow, its wearer gains many Might. *Sees:* a kill, and the next blows land with Might behind them. → Hunt 1 ●●, Landslide ● ◆ kill-pays
- **Hungry axe** · axe · uncommon · Its Lifesteal is doubled against a foe below half its HP. *Sees:* the green numbers double as a foe sinks. → Pact 1 ●●, Hunt ●
- **Ragged axe** · axe · uncommon · Its hits add a few Bleed. *Sees:* a wound that never needed a crit. → Cuts 1 ●● ⚙ lead's colour (half) ◆ swing-status
- **Executioner's axe** · axe · rare · Its hits on a foe below a quarter of its HP deal double. → Hunt 2 ●●●
- **Thirsting axe** · axe · rare · Each killing blow it lands heals its wearer for a fifth of its max HP. → Pact 2 ●●, Hunt 2 ●● ◆ kill-pays
- **Overkill axe** · axe · rare · What its wearer's killing blows have left over lands on the foe with the lowest HP, once. *Sees:* the number that killed one foe carries into the next. → Hunt 2 ●●●, Landslide ●● ⚙ avalanche (key)
- **The Red Feast** · axe · legendary · While its wearer is below half its HP, its hits deal double and its Lifesteal is doubled. When a fight is won, its wearer is healed up to half its HP. → Pact 3 ●●●, Cuts ● ⚙ brink (half)
- **Headsman's axe** · axe · legendary · Its basic attacks come half as often and deal double. A killing blow it lands readies its next basic attack at once. → Hunt 3 ●●●, Landslide ●● ◆ heavy-blow, kill-pays

##### Bow
*Wears:* Ranger, Bard. *Signature:* Crit damage. *Stats lean:* the Hunt to Crit damage and Crit chance; Thousand Cuts to Attack speed; the Bard's Refrain to Attack.
- *Commons (2):* one leans to Crit damage and Crit chance, one to Crit damage and Attack speed.
- **Broadhead bow** · bow · uncommon · Its crits add many Bleed. *Sees:* a crit opens a wound wide in one stroke. → Cuts 1 ●●, Hunt ● ◆ swing-status
- **Opening shot** · bow · uncommon · Its first basic attack of each fight comes at once and always crits. *Sees:* an arrow on the first tick, with the crit's number. → Hunt 1 ●●, Barrage ● ⚙ opening again (half)
- **Frostbite bow** · bow · uncommon · Its basic attacks add several Chill. *Sees:* each arrow a visible step up the frost counter. → Snap 1 ●● ⚙ lead's colour (half) ◆ swing-status
- **Huntsman's bow** · bow · rare · While no foe is Marked, its basic attacks Mark their target. Its hits on a Marked foe deal a third more. *Sees:* there's always a Mark on the field, and the party's blows follow it. → Hunt 2 ●●●
- **Volley bow** · bow · rare · Every third basic attack is a volley: it also looses an arrow at every other foe, carrying what the swing carries. *Sees:* a count, then an arrow in every foe. → Cuts 2 ●●●, Hunt ●, Storm ●, Barrage ● ⚙ red rain (half), reaping (half) ◆ wide-hit
- **Executioner's longbow** · bow · legendary · Its basic attacks ignore Taunt, and deal more the less HP their target has. → Hunt 3 ●●●

##### Rune sword
*Wears:* Frostweaver, Stormcaller. *Signature:* MP regen. *Stats lean:* Barrage to MP regen, Cooldown and MP; Cold Snap and the Toll's wardens to HP.
- *Commons (2):* one leans to MP regen and Cooldown, one to MP regen and HP.
- **Sleet blade** · rune sword · uncommon · Its basic attacks add several Chill. *Sees:* the ice mage's own swings carry frost between its casts. → Snap 1 ●●● ⚙ lead's colour (half) ◆ swing-status
- **Sigil blade** · rune sword · uncommon · When each fight starts, its wearer gains a Shield from its max MP. *Sees:* a grey bar on the caster at the first tick. → Barrage ●, Landslide ● ⚙ detonation (half), opening again (half)
- **Wellblade** · rune sword · uncommon · Each basic attack it lands restores some of its wearer's MP. *Sees:* the blue bar ticks up with each swing. → Barrage 1 ●●, Storm ● ◆ free-cast
- **Winter's chain** · rune sword · rare · When a foe's Chill shatters, the other foe with the most Chill gains half the cold it held. *Sees:* one foe bursts, and the next one's counter leaps. → Snap 2 ●●● ⚙ firecracker (key)
- **Frostward blade** · rune sword · rare · Foes that hit the ally with the highest Aggro gain several Chill. *Sees:* the pack slows with every blow it lands on the wall, and the frost comes from the mage beside it. → Toll 2 ●●●, Snap 2 ●● ⚙ frozen gate (key)
- **Spellbinder** · rune sword · rare · After each ability its wearer casts, its next basic attack deals double and gives back half the ability's cost. *Sees:* a cast, a heavy swing, and the blue bar partly refilled. → Barrage 2 ●●●, Storm ● ◆ free-cast
- **Brimming blade** · rune sword · legendary · Its wearer's abilities deal extra damage from the MP they cost. → Barrage 3 ●●●
- **Glacier blade** · rune sword · legendary · Each shatter this fight adds a Cascade. Its wearer's abilities deal more, and add more Chill and Shock, for each Cascade. → Snap 3 ●●●, Storm ●

##### Hammer
*Wears:* Knight, Bramble knight, Geomancer. *Signature:* Defense. *Stats lean:* Landslide to Defense and Crit damage; the Toll to HP, Aggro and Thorns.
- *Commons (2):* one carries Defense, one HP with a lighter swing. The hammer's budget is lean.
- **Warden's hammer** · hammer · uncommon · Its swings deal extra damage from its wearer's Defense. *Sees:* the wall's swing lands a number no sword of its would. → Landslide 1 ●●, Toll ● ◆ heavy-blow
- **Mason's hammer** · hammer · uncommon · Each swing it lands gives its wearer a Shield of a share of the damage dealt. *Sees:* the blow lands and a grey bar grows by it. → Landslide 1 ●●, Toll ● ⚙ detonation (half) ◆ shield-by-doing
- **Bellringer** · hammer · uncommon · Every third swing it lands Stuns its target. *Sees:* a count, and a foe held still. → Landslide ●, Snap ●, Storm ● ⚙ held charge (half), emptied quiver (half) ◆ held
- **Grudgebearer** · hammer · rare · Each hit its wearer takes adds a Wrath. Its next swing deals more for each Wrath, and spends them. *Sees:* a counter climbs with every bite, and the swing lands for all of it. → Toll 2 ●●●, Landslide 2 ●●● ⚙ reckoning (key) ◆ heavy-blow
- **Mountainfall** · hammer · rare · Its swings deal extra damage equal to a share of its wearer's max HP. → Landslide 2 ●●●, Toll ●●, Pact ● ◆ heavy-blow
- **Cornerstone hammer** · hammer · legendary · Its swings deal extra damage equal to a share of all the Shield its party holds. The Shields stay. → Landslide 3 ●●●, Pact ●

##### Mace
*Wears:* Cleric, Paladin, Bramble knight. *Signature:* HP. *Stats lean:* the Toll to HP, Defense and Thorns; Blood Pact to HP and MP regen; Barrage's font to MP regen and Cooldown.
- *Commons (2):* one leans to HP and Defense, one to HP and MP regen. The mace's budget is rich, so each carries two steps.
- **Censer mace** · mace · uncommon · Its basic attacks add many Burn. *Sees:* a slow swing, and the fire's number leaps. → Bonfire 1 ●●●, Toll ● ⚙ lead's colour (half) ◆ swing-status
- **Mender's mace** · mace · uncommon · Every so often, the ally with the lowest share of HP is healed (from its wearer's max HP). *Sees:* a green number on whoever is lowest, on a beat. → Pact 1 ●●, Toll 1 ●● ⚙ brink (half) ◆ lowest-ally
- **Penitent's mace** · mace · uncommon · Each hit its wearer takes heals the ally with the lowest share of HP a little (from its max HP). *Sees:* the wall is struck and someone is mended. → Toll 1 ●●, Pact ●
- **Saint's mace** · mace · rare · Each time its wearer heals an ally, that ally's next hit deals extra damage equal to half the heal. *Sees:* a heal, then a bigger number from the healed. → Pact 2 ●●●, Landslide ●●
- **Anchorite's mace** · mace · rare · Its wearer's heals on the ally with the highest Aggro are doubled. → Toll 2 ●●●, Pact ●●
- **Martyr's mace** · mace · legendary · Its basic attacks deal more the lower its wearer's HP, up to triple. Below a third of its HP, each one also heals its wearer for the damage dealt. → Pact 3 ●●● ⚙ brink (half)
- **Noonday mace** · mace · legendary · Each swing it lands on a burning foe gives every ally a Heat (each acts faster, a stack) for the rest of the fight. → Bonfire 3 ●●●, Toll ●

##### Staff
*Wears:* Cleric, Pyromancer, Frostweaver. *Signature:* Cast speed. *Stats lean:* Barrage to Cast speed, Cooldown and MP; Bonfire and Cold Snap to Cast speed and Attack; the healers to MP regen and HP.
- *Commons (2):* one leans to Cast speed and Cooldown, one to Cast speed and MP regen. The staff's budget is rich.
- **Shepherd's staff** · staff · uncommon · Each ability its wearer casts gives the ally with the least MP some MP. *Sees:* a spell from the staff, and the neediest blue bar steps up. → Barrage 1 ●● ⚙ mana as armour (half) ◆ free-cast
- **Canopy staff** · staff · uncommon · When each fight starts, its wearer and the other ally with the least max HP each gain a Shield (from Attack). *Sees:* two grey bars on the party's frailest at the first tick. → net, Barrage ●, Landslide ● ⚙ opening again (half), detonation (half)
- **Vesper staff** · staff · uncommon · Each ability its wearer casts heals the ally with the lowest share of HP a little (from Attack). *Sees:* a green number with every spell, whatever the spell. → Pact 1 ●●, Toll ● ⚙ brink (half) ◆ lowest-ally
- **Ritual staff** · staff · rare · Its wearer's abilities wind up half again as long, deal half again as much and add twice the stacks. *Sees:* a long bar, then one cast that makes the fire leap or takes a foe to its shatter. → Bonfire 2 ●●●, Snap 2 ●●, Landslide ●, Barrage ●
- **Evensong staff** · staff · rare · Each ability its wearer casts makes its next one cast in a moment, with no wind-up. *Sees:* a long bar, then a spell with none. → Barrage 2 ●●●, Bonfire ●●, Snap ●●, Pact ●
- **Staff of echoes** · staff · legendary · Every ability its wearer casts is cast twice. Both are paid for, and the second isn't cast again. → Barrage 3 ●●●, Bonfire ●●, Snap ●●

##### Great weapon
*Wears:* Hoplite, Paladin, Geomancer. *Signature:* Attack. *Stats lean:* Landslide to HP and Crit damage; the Hunt to Crit damage; Blood Pact to HP and Lifesteal.
- *Commons (2):* one carries Attack with a heavier swing, one leans to Attack and HP. The great weapon's budget is rich.
- **Roaring greataxe** · great weapon · uncommon · Its wearer starts each fight with many Might. *Sees:* the first blows of the fight are the biggest numbers on the screen. → Landslide 1 ●●, Hunt 1 ●● ⚙ opening again (half), judge's drum (half) ◆ heavy-blow
- **Giantsbane** · great weapon · uncommon · Its swings deal half again as much to a foe above half its HP. *Sees:* its biggest numbers land on whatever is still healthy. → Landslide 1 ●●, Hunt ●● ◆ heavy-blow
- **Harvest scythe** · great weapon · uncommon · When it lands a killing blow, its next basic attack comes at once. *Sees:* a slow weapon swings again the moment something dies. → Hunt 1 ●●, Landslide ● ◆ kill-pays, heavy-blow
- **Icebreaker** · great weapon · rare · Its hits on a Stunned foe deal double. → Snap 2 ●●●, Landslide 2 ●● ◆ held
- **Overrun** · great weapon · rare · What its wearer's killing blows have left over carries into another foe, and on again while it kills. *Sees:* one swing, and a falling row of numbers. → Landslide 2 ●●●, Hunt ●● ⚙ avalanche (key) ◆ heavy-blow
- **Thunderhead maul** · great weapon · rare · Its hits deal more for each Shock on their target. The Shock stays. *Sees:* the slow blow lands hardest on the most charged. → Storm 2 ●●●, Landslide ●●, Snap ● ⚙ held charge (key) ◆ heavy-blow
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
- **Last bastion** · plate · legendary · Once a fight, a blow that would knock its wearer out leaves it at 1 HP and Guarded. Until it's next healed, its hits deal double. → net, Pact ●● ⚙ brink (half)
- **The anvil** · plate · legendary · Each hit its wearer takes adds a Wrath to the other ally with the slowest basic attack. That ally's next basic attack deals more for each Wrath, and spends them. *Sees:* the hammer's counter climbs with every bite on the anvil. → Toll 3 ●●●, Landslide ●●● ⚙ reckoning (key)

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
- **Tallymail** · mail · legendary · Each hit its wearer lands adds a Cut, kept for the fight. Its Lifesteal grows with each Cut. → Cuts 3 ●●●, Pact ●●

##### Leather
*Wears:* Ranger, Valkyrie, Bard, Monk, Assassin, Stormcaller. *Stats lean:* Thousand Cuts and the Storm to Evasion and Attack; the Hunt to Crit chance and Accuracy; the Toll's dancer to Evasion.
- *Commons (3):* one leans to Evasion and Attack, one to Crit chance and Attack, one to Accuracy and Crit chance.
- **Tithing leathers** · leather · uncommon · Each hit its wearer lands heals it a little (from max HP). *Sees:* a green number with every hit. → Cuts 1 ●●, Pact 1 ● ⚙ riposte (half), blood mage (half)
- **Tracker's coat** · leather · uncommon · Its wearer's abilities have Seek. *Sees:* its abilities go past the Taunting front, and follow a Mark there. → Hunt 1 ●●
- **Mottled hide** · leather · uncommon · While its wearer is below half its HP, it draws far less. *Sees:* the foes turn away from it when it's hurt. → net, Pact ●
- **Quickstep leathers** · leather · uncommon · Each time its wearer dodges a hit, it's Hasted. *Sees:* MISS, and the Haste icon. → Cuts 1 ●●, Toll ● ⚙ riposte (half)
- **Duelist's leathers** · leather · rare · Each time its wearer dodges a hit, it strikes the attacker with its weapon. *Sees:* MISS, and the answering strike. → Toll 2 ●●●, Cuts 2 ●● ⚙ riposte (key)
- **Shadow mantle** · leather · rare · While its wearer is Hidden, its hits deal double. → Hunt 2 ●●● ⚙ two in the dark (half)
- **Pack leader's coat** · leather · rare · When its wearer lands a killing blow, every ally's next basic attack comes at once. *Sees:* a kill, and three weapons landing together. → Hunt 2 ●●●, Landslide ●●, Bonfire ●● ⚙ judge's drum (key) ◆ kill-pays
- **Frostwalker's furs** · leather · rare · When a foe's Chill shatters, its wearer is Hasted, and its next hit adds a few Chill to every foe. *Sees:* SHATTER, and frost across the whole field on its next blow. → Snap 2 ●●●, Cuts ● ⚙ firecracker (key), frozen gate (half)
- **Overture coat** · leather · rare · Each time its wearer lands a killing blow, the start-of-fight effects of its gear and its seat happen again. *Sees:* a kill, and the opening once more: the Haste, the frost, the first arrow. → Hunt 2 ●●● ⚙ opening again (key) ◆ kill-pays
- **Windrunner's garb** · leather · legendary · Each dodge adds a Heat (its wearer acts faster in everything, a stack) for the rest of the fight. Each hit it takes spends half its Heat. → Cuts 3 ●●, Toll 3 ●● ⚙ riposte (half)
- **Carrier's coat** · leather · legendary · Each hit its wearer lands gives its target one stack of every affliction the wearer itself holds. The wearer keeps its own. *Sees:* a unit bitten by a hellhound burns, and from then on everything it touches burns. → exotic ⚙ carrier (key)

##### Robes
*Wears:* Cleric, Bard, Pyromancer, Frostweaver, Stormcaller. *Stats lean:* Barrage to MP and MP regen; Bonfire, Cold Snap and the Storm to Attack and Cast speed; every caster to Aggro down.
- *Commons (3):* one leans to MP and Attack, one to MP regen and HP, one to MP with Aggro down.
- **Matins robe** · robes · uncommon · Every third ability its wearer casts costs no MP. *Sees:* one cast in three leaves the blue bar where it was. → Barrage 1 ●● ⚙ crescendo (half) ◆ free-cast
- **Banked robe** · robes · uncommon · Its wearer's abilities add half again as many stacks of Burn, Chill and Shock. *Sees:* each cast is a bigger step up the counter. → Bonfire 1 ●●, Snap 1 ●●, Storm 1 ●●
- **Glyphed robe** · robes · uncommon · Each ability its wearer casts gives it a Shield (from max MP). *Sees:* a grey bar that grows with every spell. → Barrage 1 ●, Landslide ● ⚙ detonation (half), mana as armour (half) ◆ shield-by-doing
- **Acolyte's robe** · robes · uncommon · Each time another ally casts an ability, its wearer regains a little MP. *Sees:* the others' spells refill its bar. → Barrage 1 ●● ◆ free-cast
- **Kindled robes** · robes · rare · While any foe burns, its wearer gains a Heat every few ticks (it acts faster, a stack) for the rest of the fight. *Sees:* the caster's spells come quicker the longer the fire is kept up. → Bonfire 2 ●●●, Barrage ●
- **Quiet robes** · robes · rare · Its wearer can't be Silenced. → Barrage 2 ●●, Bonfire ●●, stops a cast
- **Resonant robes** · robes · rare · Each ability its wearer casts comes round sooner for each foe it hit. *Sees:* against a pack the same spell's name scrolls again and again, and slows as the pack thins. → Barrage 2 ●●●, Storm 2 ●●●, Bonfire ●●, Snap ●● ⚙ resonance (key)
- **Flagellant's vestments** · robes · rare · Its wearer's abilities cost HP in place of MP: the same share of its max HP. It won't cast one that would leave it below a tenth of its HP. *Sees:* the red bar drops at every cast and the blue one never moves. → Pact 2 ●●●, Barrage 2 ●● ⚙ blood mage (key), brink (key)
- **Glimmer robe** · robes · rare · Each time an ally gives its wearer MP, its next ability deals a third more. *Sees:* a note of mana lands, and the next spell's number is bigger. → Barrage 2 ●● ⚙ mana as armour (half)
- **Archmage's mantle** · robes · legendary · Its wearer's abilities cost half again as much MP, and deal, heal and add half again as much. → Barrage 3 ●●●, Bonfire ●●, Snap ●●
- **Vestments of return** · robes · legendary · While its wearer stands, every ally revived comes back behind a Shield of half its max HP. → net
- **Motley robe** · robes · legendary · Its wearer casts its abilities in a random order, whatever order they're slotted in, and each costs half. → exotic

#### Offhands

##### Kite shield
*Wears:* Knight, Paladin, Geomancer. *Signature:* Defense. *Stats lean:* Landslide to Defense and HP; the Toll to Aggro and Thorns.
- *Commons (2):* one leans to Defense and HP, one to Defense and Aggro.
- **Emberguard** · kite shield · uncommon · Foes that hit its holder gain a few Burn. *Sees:* the keeper holds the door and the fire climbs on what strikes it. → Bonfire 1 ●●, Toll ● ⚙ goad (half)
- **Sheltering kite** · kite shield · uncommon · When each fight starts, its holder and the other ally with the least Defense are Guarded. *Sees:* two Guard icons at the first tick. → Landslide ●, net ⚙ opening again (half), mirror (half)
- **Bossed kite** · kite shield · uncommon · Its holder's abilities deal extra damage from its Defense. *Sees:* the bash, the Smite or the rock lands bigger. → Landslide 1 ●● ◆ heavy-blow
- **Rubble shield** · kite shield · rare · When its holder's Shield breaks, the foe whose blow broke it is Stunned. → Landslide 2 ●●, Toll ●●, Storm ● ⚙ held charge (half), detonation (half) ◆ held
- **Mirror shield** · kite shield · rare · A foe that hits its holder takes a share of the blow as it was struck, before Defense, Guard and Shields took theirs. *Sees:* a small number on the wall, and the blow's own number on the attacker. → Toll 2 ●●●, Landslide 2 ●● ⚙ mirror (key)
- **Monolith shield** · kite shield · rare · Its holder's damaging abilities take twice as long to come round and land more than twice as hard. *Sees:* the bash, the Smite or the boulder comes rarely, and out-sizes everything. → Landslide 2 ●●●, Hunt ● ⚙ shatter bell (half) ◆ heavy-blow
- **Oathbound shield** · kite shield · legendary · When a hit would deal an ally more than a quarter of its max HP, its holder takes the hit instead. → Toll 3 ●●●, Pact ●●, Barrage ●● ⚙ mirror (half)

##### Round shield
*Wears:* Hoplite, Bramble knight, Valkyrie. *Signature:* HP. *Stats lean:* the Toll to HP, Defense and Aggro; Landslide to HP and Defense; the Hunt and the Storm to Attack.
- *Commons (2):* one leans to HP and Attack, one to HP and Defense.
- **Comrade's targe** · round shield · uncommon · Every so often, the ally with the lowest share of HP gains a Shield (from its holder's max HP). *Sees:* a grey bar on whoever is lowest, on a beat. → Pact 1 ●●, Toll ●, Landslide ● ⚙ brink (half), detonation (half) ◆ lowest-ally
- **Hunter's buckler** · round shield · uncommon · When its holder's hit fells a foe, it's Hasted. *Sees:* a kill, and the Haste icon. → Hunt 1 ●●, Cuts ● ◆ kill-pays
- **Spiked targe** · round shield · uncommon · While its holder is Guarded, it has Thorns. *Sees:* attackers hurt themselves while the Guard lasts. → Toll 1 ●● ⚙ goad (half)
- **Second skin** · round shield · rare · When its holder's Shield breaks, a Shield of half its size is rebuilt at once, every so often. *Sees:* the grey bar goes and half of it is back. → Landslide ●●, Cuts ●●, Toll ● ⚙ detonation (key), riposte (half)
- **Hoplon** · round shield · rare · While its holder holds a Shield or an Aegis, a foe that hits it takes back whatever the Shield soaked and the Aegis blocked of the blow. *Sees:* BLOCKED on the wall, and the blocked number on the attacker. → Toll 2 ●●●, Landslide 2 ●●● ⚙ mirror (key)
- **Tower shield** · round shield · rare · While its holder stands, allies with less Defense than it take a fifth less damage. Its holder deals a fifth less. → Barrage ●●, Bonfire ●●, Toll ●
- **Shield of the chosen** · round shield · legendary · Once a fight, when another ally falls, its holder raises it at once with a tenth of its HP, behind a Shield (from the holder's max HP). → net
- **Lodestone shield** · round shield · legendary · Every Shield another ally would gain goes to its holder instead. → exotic, Landslide ●● ⚙ detonation (half)

##### Horn
*Wears:* Knight, Hoplite. *Signature:* Aggro. *Stats lean:* the Toll to Aggro, HP and Defense; Barrage's well to MP regen; Landslide's loader to Attack.
- *Commons (2):* one leans to Aggro and HP, one to Aggro and MP regen.
- **Reveille** · horn · uncommon · When each fight starts, the ally with the highest Attack has its ability with the longest cooldown ready. *Sees:* the party's biggest ability in the fight's first ticks. → Landslide 1 ●●, Barrage 1 ●●, Hunt ●, first move ⚙ opening again (half)
- **Bull's horn** · horn · uncommon · The first time a foe falls in a fight, every ally is Hasted. *Sees:* the first kill, and three Haste icons. → Hunt 1 ●●, Cuts ● ◆ kill-pays
- **Watch horn** · horn · uncommon · Whenever an ally drops below half its HP, its holder Taunts. *Sees:* the foes turn from the hurt ally to the horn. → Toll 1 ●●, Pact ● ⚙ goad (half), mirror (half), two in the dark (half) ◆ draw
- **War horn** · horn · rare · When each fight starts, the ally with the slowest basic attack gains many Might. *Sees:* the heaviest weapon's first blow lands with a stack of Might behind it. → Landslide 2 ●●● ⚙ judge's drum (half), opening again (half) ◆ heavy-blow
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
- **Goading totem** · totem · rare · Each time its holder Taunts, every foe's next basic attack comes at once. *Sees:* the shout, and every foe swings out of turn, into the thorns. → Storm 2 ●●●, Toll 2 ●●● ⚙ goad (key)
- **Earthmother totem** · totem · legendary · While its holder stands, every Shield an ally gains is a third larger. When an ally's Shield breaks, that ally gains many Might. → Landslide 3 ●●●, Pact ● ⚙ detonation (half)

##### Relic
*Wears:* Cleric, Paladin. *Signature:* MP regen. *Stats lean:* Blood Pact and the Toll's keepers to MP regen and HP; Barrage's font to MP regen and Cast speed.
- *Commons (2):* one leans to MP regen and HP, one to MP regen and Cast speed.
- **Holy water** · relic · uncommon · Each time one of its holder's abilities heals an ally, it also lifts one debuff from that ally. → Toll ●, Pact ●, foes do less
- **Charnel icon** · relic · uncommon · Each time a foe falls, the ally with the lowest share of HP is healed (from its holder's Attack). *Sees:* a kill, and a green number on the most hurt. → Pact 1 ●●, Hunt ● ⚙ brink (half) ◆ kill-pays, lowest-ally
- **Font relic** · relic · uncommon · Each time one of its holder's abilities heals an ally, that ally also regains MP. *Sees:* a heal, and the healed ally's blue bar steps up. → Barrage 1 ●●, Pact ● ⚙ mana as armour (half) ◆ free-cast
- **Phylactery** · relic · rare · The part of its holder's heals that would go past full becomes a Shield on the healed ally. *Sees:* a healer with nothing to mend builds grey bars. → Pact 2 ●●●, Landslide ●●, Toll ●● ⚙ red stone (key), detonation (half) ◆ shield-by-doing
- **Accuser's relic** · relic · rare · While no foe is Marked, each heal its holder gives Marks the foe that last hit the healed ally. *Sees:* the healer mends the wall and the party turns on whatever struck it. → Hunt 2 ●●●, Toll ●●
- **Heart of the saint** · relic · legendary · Its holder's heals are paid in its own HP in place of MP, and are twice as big. *Sees:* the healer's own red bar drops with every heal, and the heals are huge. → Pact 3 ●●● ⚙ brink (key)
- **Bloodstone reliquary** · relic · legendary · Each time an ally pays HP, the ally with the lowest share of HP, the payer aside, is healed for as much. → Pact 3 ●●● ⚙ brink (half), blood mage (half)

##### Lantern
*Wears:* Cleric, Pyromancer. *Signature:* Cast speed. *Stats lean:* Bonfire to Cast speed and Attack; Barrage to Cast speed, MP and Cooldown.
- *Commons (2):* one leans to Cast speed and Attack, one to Cast speed and MP.
- **Pitch lantern** · lantern · uncommon · When each fight starts, every foe gains several Burn. *Sees:* the whole field alight at the first tick. → Bonfire 1 ●● ⚙ opening again (half), every colour (half), reaping (half)
- **Dazzling lantern** · lantern · uncommon · When each fight starts, the two foes with the highest Attack are Weakened. → foes do less, Toll ● ⚙ opening again (half), goad (half)
- **Wick** · lantern · rare · When a burning foe falls, all its Burn passes to the foe with the most Burn left. *Sees:* a foe dies and the next one's fire leaps by all of it. → Bonfire 2 ●●●, Hunt ●● ⚙ fuse (key)
- **Shuttered lantern** · lantern · rare · While its holder is winding up an ability, it takes half damage. → Barrage 2 ●●, Bonfire ●●, Pact ●
- **Everflame lantern** · lantern · legendary · Every few ticks, the foe with the most Burn gains Burn: a tenth of what it holds. → Bonfire 3 ●●●
- **Lamp of vigil** · lantern · legendary · After each won fight, one fallen ally stands up with a quarter of its HP. → net

##### Tome
*Wears:* Bard, Hexer, Frostweaver. *Signature:* Cooldown. *Stats lean:* Barrage to Cooldown, Cast speed and MP; Cold Snap and the Hexer's curses to Cooldown and Attack.
- *Commons (2):* one leans to Cooldown and Attack, one to Cooldown and MP regen.
- **Snowbound folio** · tome · uncommon · When each fight starts, every foe gains a few Chill. *Sees:* every foe a little slower from the first tick. → Snap 1 ●● ⚙ opening again (half), every colour (half), firecracker (half)
- **Marginalia** · tome · uncommon · While a foe is in a wind-up, its holder's abilities aim at it. *Sees:* the lance, the curse or the arrow goes to whoever is casting. → stops a cast, Snap ●, Toll ●
- **Curse-book** · tome · uncommon · Its holder's abilities add a few Bleed to each foe they hit. *Sees:* a spell lands and its targets are wounded. → Cuts 1 ●● ⚙ red rain (half), every colour (half)
- **Primer of frost** · tome · rare · Each time its holder adds Chill to a foe, it adds more the more Chill that foe already holds. → Snap 2 ●●●
- **Twice-told tome** · tome · rare · Every third ability its holder casts is cast twice. The second cast is free. *Sees:* the same name twice running in the log. → Barrage 2 ●●●, Snap ●●, Landslide ● ⚙ crescendo (half) ◆ free-cast
- **Grimoire of plagues** · tome · rare · When each fight starts, every foe gains a few stacks each of two of Burn, Chill, Shock and Bleed, at random. *Sees:* two different icons on every foe at the first tick. → Bonfire ●●, Snap ●●, Storm ●●, Cuts ●● ⚙ every colour (key), opening again (half)
- **Accompanist's score** · tome · rare · Each time the other ally with the highest Attack pays for an ability, its holder's next ability costs no MP. *Sees:* the soloist casts, and the next song leaves its singer's blue bar alone. → Barrage 2 ●● ⚙ crescendo (half) ◆ free-cast
- **Last page** · tome · legendary · When a foe falls, every foe below a tenth of its HP falls too. → Hunt 3 ●●, Storm ● ⚙ reaping (half)
- **Annotated grimoire** · tome · legendary · Each ability its holder pays for makes the next ability any ally casts free. → Barrage 3 ●●● ⚙ crescendo (half) ◆ free-cast
- **Frozen tome** · tome · legendary · Each time a foe's Chill shatters, every ally's ability with the longest cooldown comes half its wait closer. *Sees:* SHATTER, and the whole party's great abilities come round. → Snap 3 ●●●, Landslide ●●, Barrage ●● ⚙ shatter bell (key)

##### Orb
*Wears:* Pyromancer, Frostweaver. *Signature:* MP. *Stats lean:* Barrage to MP, MP regen and Cooldown; Bonfire and Cold Snap to MP and Attack.
- *Commons (2):* one leans to MP and MP regen, one to MP and Attack.
- **Scrying orb** · orb · uncommon · When each fight starts, its holder's ability nearest to ready comes at once. *Sees:* a spell on the first tick. → Barrage 1 ●, Hunt 1 ●, first move ⚙ opening again (half)
- **Mana pearl** · orb · uncommon · Each time a foe falls, its holder regains MP. *Sees:* a kill, and the blue bar steps up. → Barrage 1 ●●, Bonfire ● ⚙ resonance (half) ◆ kill-pays, free-cast
- **Meltwater orb** · orb · rare · When a foe's Chill shatters, its holder regains MP: about a cast's worth. *Sees:* SHATTER, and the blue bar steps up. → Snap 2 ●●●, Barrage 2 ●● ⚙ frozen gate (half), resonance (half) ◆ free-cast
- **Smouldering orb** · orb · rare · When a burning foe falls, every other foe gains a third of its Burn. *Sees:* a foe dies and the whole field flares. → Bonfire 2 ●●●, Hunt ● ⚙ fuse (key)
- **Orb of the deep** · orb · rare · Damage its holder takes comes out of its MP first, while it has any. *Sees:* the blue bar takes the blow and the red one doesn't. → Barrage 2 ●●●, Pact ● ⚙ mana as armour (key)
- **Orb of the rising sun** · orb · legendary · Each time its holder casts the same ability again in a fight, it does more than the time before (Crescendo), and nothing makes it cost more for it. *Sees:* the same name up the log, a bigger number each time. → Barrage 3 ●●●, Bonfire ●● ⚙ crescendo (key)
- **The deep well** · orb · legendary · While its holder holds Clarity, its abilities cost no MP. → Barrage 3 ●●● ⚙ crescendo (half) ◆ free-cast

##### Idol
*Wears:* Hexer, Vampire. *Signature:* Siphon. *Stats lean:* Blood Pact to Lifesteal and HP; Barrage's blood-well to Siphon and MP; the curser to Attack.
- *Commons (2):* one leans to Siphon and Attack, one to Siphon and HP.
- **Fanged idol** · idol · uncommon · Its holder's first hit on each foe Rots it. → foes do less, Pact ●
- **Leech idol** · idol · uncommon · MP its holder gains past its full pool goes to the ally with the least MP. *Sees:* a full blue bar spills into the caster's. → Barrage 1 ●● ⚙ mana as armour (half) ◆ free-cast
- **Hushing idol** · idol · rare · When a foe starts a wind-up, its holder's next basic attack comes at once, at that foe. *Sees:* every cast the foes begin draws a strike. → stops a cast, Toll ●●, Snap ●
- **Festering idol** · idol · rare · Its holder's hits add one more stack of each of Burn, Chill, Shock and Bleed their target already holds. *Sees:* every counter on a foe steps up with each of its blows. → Bonfire 2 ●●, Snap 2 ●●, Storm 2 ●●, Cuts ●● ⚙ every colour (half)
- **Idol of binding** · idol · rare · Foes its holder Weakens are also Slowed, and its hits on a foe that's both deal double. → Toll ●●, foes do less
- **Idol of the hungry dark** · idol · legendary · Every so often, it takes one buff from a foe and gives it to its holder. Never Bulwark. → exotic
- **Idol of the deep** · idol · legendary · Damage its holder takes comes out of its MP first. MP it gains past full becomes a Shield. *Sees:* the blue bar takes the blows, and whatever would overfill it turns grey. → Barrage 3 ●●, Pact ●● ⚙ mana as armour (key)
- **Idol of the blood-well** · idol · legendary · Each time its holder pays HP, the ally with the least MP regains as much MP. → Barrage ●●●, Pact ●● ⚙ blood mage (half)

##### Vial
*Wears:* Vampire, Assassin. *Signature:* Lifesteal. *Stats lean:* Blood Pact to Lifesteal and HP; Thousand Cuts and the Hunt to Crit chance and Crit damage.
- *Commons (2):* one leans to Lifesteal and HP, one to Lifesteal and Crit chance.
- **Crimson dregs** · vial · uncommon · Its holder's hits on a bleeding foe heal it for a share of their damage. *Sees:* a wound opens and its holder starts to drink from it. → Cuts 1 ●●, Pact 1 ●● ⚙ red stone (half)
- **Lancet phial** · vial · uncommon · When each fight starts, every foe gains a few Bleed. *Sees:* the first hit on every foe prints twice. → Cuts 1 ●● ⚙ red rain (half), opening again (half), every colour (half)
- **Blood vial** · vial · rare · Its holder's abilities cost half their MP, plus HP equal to their full cost. The price never takes it below 1 HP. *Sees:* the red bar drops with every ability, and the blue one lasts twice as long. → Pact 2 ●●●, Barrage ● ⚙ brink (key), blood mage (half)
- **Venom vial** · vial · rare · Each hit its holder lands on a bleeding foe raises that foe's Bleed by a share of what it holds. *Sees:* a fast unit's blows make the wound deepen on its own. → Cuts 2 ●●●, Hunt ●
- **Bloodlust draught** · vial · rare · Its holder starts every fight at half its HP, and its Lifesteal is doubled until it's full. What it starts without isn't a price paid. *Sees:* a bar that starts at half and climbs by hitting. → Pact 2 ●●●, Cuts ● ⚙ brink (key)
- **Heartsblood** · vial · legendary · Whatever its holder heals through Lifesteal, every other ally is healed for too. → Pact 3 ●●●, Cuts ●● ⚙ red stone (half)

##### Trophy
*Wears:* Ranger, Assassin, Geomancer. *Signature:* Crit damage. *Stats lean:* the Hunt to Crit damage and Crit chance; Landslide to Crit damage and Defense.
- *Commons (2):* one leans to Crit damage and Crit chance, one to Crit damage and Defense.
- **Hunter's skull** · trophy · uncommon · Each killing blow its holder lands adds a Heat (it acts faster, a stack) for the rest of the fight. *Sees:* each kill comes sooner than the last. → Hunt 1 ●●, Cuts ● ◆ kill-pays
- **Eagle feather** · trophy · uncommon · Its holder's crits Slow their target. → foes do less, Hunt ●, Snap ●
- **Vulture's skull** · trophy · rare · Its holder's hits on a Stunned foe nearly always crit. *Sees:* a foe held still takes crit after crit. → Landslide 2 ●●●, Snap 2 ●●●, Hunt ●● ⚙ emptied quiver (half) ◆ held
- **Ogre's tusk** · trophy · rare · Its holder's hits on the foe with the most HP deal half again as much. → Landslide 2 ●●●
- **Dragon's tooth** · trophy · rare · Its holder's crits strike again for a third of their damage. → Landslide ●●, Hunt ●●, Cuts ●●
- **The king's head** · trophy · legendary · When its holder lands a killing blow, every ally's crit chance is doubled for a while, to four in five at most. *Sees:* a kill, and a spell of crits from everyone. → Hunt 3 ●●●, Landslide ●● ⚙ emptied quiver (half) ◆ kill-pays

##### Bell
*Wears:* Bard, Monk, Stormcaller. *Signature:* Attack speed. *Stats lean:* Thousand Cuts and the Storm to Attack speed and Double strike; Barrage to MP regen.
- *Commons (2):* one leans to Attack speed and Evasion, one to Attack speed and MP regen.
- **Ringing bell** · bell · uncommon · Every fourth basic attack its holder lands rings: a light hit on every foe (from Attack), carrying what the swing carries. *Sees:* a count, and a small number on every foe. → Storm 1 ●●, Cuts 1 ●● ⚙ red rain (half), reaping (half) ◆ wide-hit
- **Pacer's bell** · bell · uncommon · Each time its holder casts an ability, it's Hasted. *Sees:* a spell, then the Haste icon and a run of quick swings. → Cuts 1 ●●, Storm ●, Barrage ●
- **Bell of the hour** · bell · rare · Every fifth basic attack its holder lands casts its first-slotted ability off its cooldown. *Sees:* a count climbs with each swing, and at the top, the spell. → Cuts 2 ●●●, Barrage 2 ●●● ⚙ spell on the swing (key)
- **Warding bell** · bell · rare · Every so often, it lifts one debuff from the ally holding the most, a Silence first. → Barrage ●●, Toll ●
- **Tireless bell** · bell · legendary · Its holder's basic attacks never wait on its abilities: it keeps swinging through their wind-ups and their recoveries. → exotic, Storm ●●, Cuts ●●, Barrage ●●

##### Cloak
*Wears:* Valkyrie, Monk, Ranger. *Signature:* Evasion. *Stats lean:* the Toll's dancer to Evasion and Defense; Thousand Cuts to Evasion and Attack speed; the Hunt to Evasion and Crit chance.
- *Commons (2):* one leans to Evasion and Attack, one to Evasion and Attack speed.
- **Hooded cloak** · cloak · uncommon · Each time its holder dodges a hit, it gains a Shield (from Attack). *Sees:* MISS, and the grey bar a little taller. → Toll 1 ●●, Cuts ● ⚙ riposte (half), detonation (half) ◆ shield-by-doing
- **Feathered cloak** · cloak · uncommon · The first time each fight its holder drops below half its HP, it's Hidden. *Sees:* a hurt unit fades and the foes look elsewhere. → net, Hunt ● ⚙ two in the dark (half)
- **Matador's cape** · cloak · uncommon · Each time its holder dodges a hit, it Taunts. *Sees:* MISS, and the dodger calls the next blows onto itself. → Toll 1 ●●, Cuts ● ⚙ riposte (half) ◆ draw
- **Dancer's cloak** · cloak · rare · Each time its holder dodges a hit, its ability nearest to ready is ready. → Toll 2 ●●, Cuts 2 ●●, Barrage ●
- **Tempest cloak** · cloak · rare · Each time its holder dodges a hit, its next basic attack comes at once and strikes twice. *Sees:* MISS, and two blows back. → Toll 2 ●●●, Cuts 2 ●●● ⚙ riposte (key)
- **Shadow cloak** · cloak · rare · Its holder is Hidden when each fight starts, and again each time a foe falls. *Sees:* a name that fades at the first tick and after every kill. → exotic, Hunt ●● ⚙ two in the dark (key) ◆ kill-pays
- **Swan's grace** · cloak · legendary · Once a fight, the blow that would knock its holder out leaves it at 1 HP and Hidden. → net ⚙ two in the dark (half)

#### Amulets
*Wears:* everyone. *Stats lean:* each common is one road's first stat.
- *Commons (10):* one each of HP, Defense, Attack, Crit chance, MP regen, Evasion, Lifesteal, Thorns, Double strike and Cooldown.
- **Tinder charm** · amulet · uncommon · Its wearer's basic attacks add a few stacks to whichever of Burn, Chill, Shock or Bleed their target holds the most of. *Sees:* whatever the party has started on a foe, this unit's swings keep building. → Bonfire 1 ●●, Snap 1 ●●, Storm 1 ●●, Cuts 1 ● ⚙ lead's colour (half) ◆ swing-status
- **Challenger's token** · amulet · uncommon · Its wearer Taunts when each fight starts. *Sees:* the foes' first blows all go to it. → Toll 1 ●●, Bonfire ●, Storm ●, Hunt ● ⚙ opening again (half), goad (half), frozen gate (half), mirror (half), riposte (half), two in the dark (half) ◆ draw
- **Carapace charm** · amulet · uncommon · Its wearer starts every fight behind a Shield (from max HP). *Sees:* a grey bar at the first tick. → Landslide ●, net ⚙ opening again (half), detonation (half)
- **Hare's foot** · amulet · uncommon · Its wearer starts every fight Hasted. *Sees:* the Haste icon, and the fight's first actions come quickly. → Cuts 1 ●●, Bonfire ●, Storm ●, Barrage ● ⚙ opening again (half), spell on the swing (half)
- **Millstone** · amulet · uncommon · Its wearer's basic attacks come half as often and land more than twice as hard. *Sees:* fewer swings, each a number that out-sizes everything round it. → Landslide 1 ●●●, Hunt ● ⚙ judge's drum (half), avalanche (half), reckoning (half) ◆ heavy-blow
- **Hummingbird charm** · amulet · uncommon · Its wearer's basic attacks come twice as often and deal half as much. *Sees:* a blur of small numbers, and whatever its swings carry laid twice as fast. → Cuts 1 ●●●, Bonfire ●, Snap ●, Storm ● ⚙ spell on the swing (half)
- **Clear-headed charm** · amulet · uncommon · Whenever its wearer drops below half its MP, it gains Clarity, every so often. *Sees:* the blue bar turns round each time it runs low. → Barrage 1 ●● ⚙ mana as armour (half) ◆ free-cast
- **Shatterstone charm** · amulet · rare · When its wearer's Shield breaks, the foe that broke it takes damage equal to twice the most that Shield held. *Sees:* the grey bar goes, and a big number lands on whoever broke it. → Landslide 2 ●●●, Cuts ●, Toll ●● ⚙ detonation (key)
- **Bounty charm** · amulet · rare · When its wearer lands a killing blow, its ability with the longest cooldown left is ready at once. *Sees:* a kill, and the big ability again. → Hunt 2 ●●●, Barrage ●● ⚙ reaping (key) ◆ kill-pays
- **Echo charm** · amulet · rare · Its wearer's extra strikes carry what the swing carries. → Cuts 2 ●●, Bonfire ●, Snap ●, Storm ●
- **Floe charm** · amulet · rare · When a foe's Chill shatters, its wearer's ability with the longest cooldown is ready. *Sees:* SHATTER, and the great spell's name right under it. → Snap 2 ●●●, Landslide ●●, Barrage ●●, Bonfire ●● ⚙ shatter bell (key)
- **Lightning-glass** · amulet · rare · Its wearer's abilities deal more for each Shock on their target. The Shock stays. *Sees:* the bash or the Smite lands hardest on the most charged foe. → Storm 2 ●●●, Landslide ●, Snap ● ⚙ held charge (key)
- **Halved heart** · amulet · rare · Its wearer starts every fight at half its HP and can't be healed above it; healing past that counts as healing past full. At half it counts as below half its HP. It deals half again as much. *Sees:* one unit sits at half all fight, hitting hard. → Pact 2 ●●●, Toll ● ⚙ brink (key)
- **Crescendo charm** · amulet · rare · Each time its wearer casts the same ability again in a fight, it does more and costs more than the time before (Crescendo). *Sees:* the same name up the log with a bigger number each time, and the blue bar emptying faster. → Barrage 2 ●●● ⚙ crescendo (key)
- **Ember heart** · amulet · rare · When a burning foe falls, all its Burn passes to the next foe its wearer hits. *Sees:* a foe dies, and its fire lands whole on whatever this unit strikes next. → Bonfire 2 ●●●, Hunt ●● ⚙ fuse (key)
- **Hunter's mark** · amulet · rare · While no foe is Marked, its wearer Marks the foe with the lowest HP. *Sees:* there's always a Mark on the field, on the foe nearest its end. → Hunt 2 ●●● ⚙ judge's drum (half)
- **Shroud charm** · amulet · rare · Whenever an ally drops below a third of its HP, that ally is Hidden. *Sees:* the most hurt ally fades, and the foes turn elsewhere. → Pact ●●, net ⚙ two in the dark (key), brink (half)
- **Heart of winter** · amulet · legendary · Chill its wearer adds to one foe is added to every other foe too. The Chill it adds isn't added again. → Snap 3 ●●● ⚙ firecracker (half)
- **Second dawn** · amulet · legendary · Each time a foe falls, the start-of-fight effects of every ally's gear and seat happen again. *Sees:* a foe falls and the party's opening happens again: stone up, Haste on, frost across the field. → Hunt 3 ●●● ⚙ opening again (key)
- **Downhill charm** · amulet · legendary · When its wearer's hit knocks a foe out, what the blow had left over is split evenly among the other foes, once. *Sees:* a kill, and a small number on every other foe. → Landslide ●●, Hunt ●● ⚙ avalanche (key)
- **Twin-knot** · amulet · legendary · Whatever status its wearer gives itself, the other ally with the lowest share of HP gains too. *Sees:* something different for each class: the Assassin vanishes and the most hurt ally vanishes with it. → exotic ⚙ borrowed gift (key), brink (half), two in the dark (half)
- **Scapegoat charm** · amulet · legendary · When its wearer is given a debuff, its next hit gives that debuff, with all its stacks, to its target, and the wearer is rid of it. Doom can't be passed on. *Sees:* the witch's curse lands on the unit, and its next blow hands it straight back. → exotic ⚙ carrier (half)
- **Burning heart** · amulet · legendary · Every so often its wearer sets itself alight: a few Burn on itself, often enough that it never goes out. While it burns, it deals half again as much. → exotic, Pact ●, Bonfire ● ⚙ carrier (half)
- **Phoenix ember** · amulet · legendary · Once a fight, when its wearer falls, it stands up a few ticks later with a third of its HP, Hidden. → net
- **Ready stance** · amulet · legendary · Its wearer's abilities start every fight at least half charged. Its cooldowns are a fifth longer. → first move, Hunt ●●, Barrage ●●
- **Gambler's coin** · amulet · legendary · Its wearer's crit chance is about half. Its hits that don't crit deal half; its crits deal what a crit always does. Hits that always crit still do. *Sees:* half its numbers are crits, and the rest are halves. → exotic ⚙ emptied quiver (half)
- **Turncoat charm** · amulet · legendary · Its wearer's Attack and Defense are swapped. → exotic

### Formations

Neutral stays as the start. Thirty-five more: thirteen common, twelve rare, ten legendary. Every road has a common a run could start in, a rare that reads who sits where and a legendary that changes how the party fights. Four commons are shared ground (Shieldwall, The standard, First light, Skirmish line), and four more belong to no one road: Decoy, Vigil, The wheel and Twins.

Each line gives the promise, then the three seats.

#### Common
- **Heavy line** · formation · common · One strikes like a falling hill, one takes the blows, one loads the strike. Seats: Hammer: basic attacks come half as often and land more than twice as hard. / Anvil: draws far more; Defense up. / Loader: when each fight starts, the Hammer gains many Might. *Sees:* one unit's rare, huge swings, biggest at the start. → Landslide 1 ●●●, Hunt ● ⚙ judge's drum (half), avalanche (half), reckoning (half)
- **Spur** · formation · common · One opens the wound; two pour into it. Seats: Opener: crits far more often. / Blade: basic attacks a fifth faster. / Blade: the same. *Sees:* one unit's crits, and two blurs of small numbers. → Cuts 1 ●●●, Bonfire ●, Storm ●, Snap ●
- **Hearth** · formation · common · One holds the door, one feeds the fire, one carries it to every burning foe. Seats: Keeper: Taunts and is Guarded when each fight starts. / Stoker: Hasted when each fight starts; basic attacks a fifth faster. / Torch: each of its hits adds a Burn to every foe that's already burning. *Sees:* one fire becomes a field of fires as the Torch swings. → Bonfire 1 ●●●, Toll ●
- **Hoarfrost line** · formation · common · Two lay frost with every blow; the third breaks what freezes. Seats: Frost: basic attacks add a few Chill. / Frost: the same. / Breaker: while a foe is Stunned, its basic attacks go to that foe; its hits on a Stunned foe deal double. *Sees:* two weapons climbing the frost counter, and the third's double numbers on whatever shatters. → Snap 1 ●●●, Landslide ● ⚙ lead's colour (half)
- **Squall line** · formation · common · Two charge the field; one stands where the foes look. Seats: Squall: its basic attacks add a few Shock, and also hit a second, random foe for half, carrying it. / Squall: the same. / Rod: draws far more; Defense up. *Sees:* two units' swings charging two foes each, and the foes hurt as they act. → Storm 1 ●●●, Toll ●, Cuts ● ⚙ red rain (half), held charge (half)
- **Hunting party** · formation · common · One picks the quarry, one runs it down past any guard, one holds the line. Seats: Marker: while no foe is Marked, its basic attacks Mark their target. / Chaser: everything it does has Seek. / Warden: draws far more; Defense up. *Sees:* a Mark on whatever the Marker strikes, and the party's blows following it. → Hunt 1 ●●●
- **Thorn hedge** · formation · common · A thorned wall that draws the blows, and two who make every blow on it cost. Seats: Anchor: draws far more; Thorns. / Warden: each hit the Anchor takes heals it a little (from the Warden's max HP). / Thorn: a foe that hits the Anchor takes damage (from the Thorn's Attack). *Sees:* each blow on the wall hurts the attacker twice and mends the wall. → Toll 1 ●●●, Pact ●
- **Wellspring** · formation · common · Two keep one caster casting. Seats: Soloist: its abilities come round faster; draws far less. / Conductor: each ability it casts gives the Soloist some MP. / Well: draws more; each hit it takes gives the Soloist some MP. *Sees:* the Soloist's blue bar refilled by the other two's casts and bruises. → Barrage 1 ●●●, Toll ● ⚙ mana as armour (half)
- **Shared cup** · formation · common · Nobody's healing is wasted. Healing any ally receives past full goes to the ally with the lowest share of HP that can be healed. Seats: Drinker: Lifesteal. / Drinker: Lifesteal. / Donor: its heals are a third bigger. *Sees:* a full unit's green numbers land on whoever is lowest. → Pact 1 ●●●, Cuts ●● ⚙ brink (half)
- **Shieldwall** · formation · common · One stands in front with its shield up; two stand behind it. Seats: Wall: draws far more; Defense up two steps. / Behind: draws less. / Behind: draws less. → Toll ●●, Bonfire ●●, Storm ●●, Landslide ●●, Hunt ●, Barrage ●● ⚙ mirror (half), frozen gate (half)
- **The standard** · formation · common · Two follow the lead's colour. Seats: Lead: nothing of its own; its swings carry what they carry. / Follower: its basic attacks carry whatever the Lead's basic attacks carry. / Follower: the same. *Sees:* three weapons laying the same status, and the counter climbing three times as fast. → Bonfire 1 ●●●, Snap 1 ●●●, Storm 1 ●●●, Cuts 1 ●● ⚙ lead's colour (key)
- **First light** · formation · common · Up before dawn. When each fight starts, every ally's ability nearest to ready is ready. Seats: three Risers, nothing of their own. → first move, Hunt ●●, Barrage ●●, Landslide ●
- **Skirmish line** · formation · common · Three who'd rather not be hit at all. Each dodge gives the dodger a small Shield. Seats: three Skirmishers: Evasion up; Defense down. → Toll ●●, Cuts ●● ⚙ riposte (half)

#### Rare
- **Hammer and anvil** · formation · rare · Every blow the Anvil takes is saved for the Hammer. Seats: Anvil: draws far more; each hit it takes adds a Wrath to the Hammer. / Hammer: its next basic attack deals more for each Wrath, and spends them. / Smith: its heals and Shields on the Anvil are a third bigger. *Sees:* a counter on the Hammer climbs with every bite the Anvil takes, then one swing lands for all of it. → Landslide 2 ●●●, Toll 2 ●●● ⚙ reckoning (key)
- **Bloodied ground** · formation · rare · One opens them up; two drink from the wound. Seats: Opener: its crits add many Bleed. / Blade: each hit it lands on a bleeding foe heals it a little. / Blade: the same. → Cuts 2 ●●●, Pact ●●
- **Pyre line** · formation · rare · The fire outlives whatever it's burning. Seats: Keeper: Taunts and is Guarded when each fight starts; foes that hit it gain a few Burn. / Stoker: basic attacks a third faster. / Torch: when a burning foe falls, all its Burn passes to the foe with the most HP. *Sees:* the smallest foe goes up, and its whole fire lands on the biggest. → Bonfire 2 ●●●, Hunt ●● ⚙ fuse (key)
- **Icefall** · formation · rare · Two lay frost, each its own way, and every shatter rings the third's great spell. Seats: Rime: whatever Chill its abilities add, they add half again as much. / Sleet: its basic attacks add a few Chill. / Breaker: when a foe's Chill shatters, its ability with the longest cooldown is ready. *Sees:* SHATTER, and the great spell's name right under it. → Snap 2 ●●●, Landslide ●●, Barrage ●●, Bonfire ● ⚙ shatter bell (key)
- **Storm front** · formation · rare · The more foes one action touches, the more it pays. Seats: Thunderhead: its abilities come round sooner for each foe they hit. / Squall: its basic attacks also hit every foe that holds Shock, for a third. / Rod: draws far more; foes that hit it gain a few Shock. *Sees:* a wide spell's name scrolling again and again, and one swing landing on every charged foe. → Storm 2 ●●●, Barrage ●●, Toll ●● ⚙ resonance (key), red rain (half), goad (half)
- **The pack** · formation · rare · The pack takes them one at a time. Seats: Lead: while no foe is Marked, its hits Mark their target. / Packmate: its hits on a Marked foe deal half again as much. / Packmate: the same. *Sees:* the Lead's blow names the prey, and the other two's numbers jump on it. → Hunt 2 ●●● ⚙ judge's drum (half)
- **Toll gate** · formation · rare · Whatever strikes the gate pays the other two's toll. Seats: Gate: draws far more; Guarded when each fight starts. / Collector: a foe that hits the Gate gains whatever this seat's basic attacks carry. / Collector: the same. *Sees:* the foes strike the wall and leave chilled, charged, bleeding or sundered, by who sits behind it. → Toll 2 ●●●, Snap ●●, Storm ●●, Cuts ●●, Bonfire ● ⚙ frozen gate (key), goad (half), red rain (half)
- **The stage** · formation · rare · Everything the other two cast brings the Soloist's spells round. Seats: Soloist: each ability another ally casts takes a fifth off the cooldowns it has left. / Conductor: its abilities come round a third faster. / Well: draws far more; whenever the Soloist finishes a cast, the Well gains a Shield. → Barrage 2 ●●●, Toll ●
- **Blood oath** · formation · rare · One bleeds for power, one drinks, one pours life into the bleeder. Seats: Bleeder: loses a little HP every tick; its hits deal half again as much. / Drinker: Lifesteal, high; what its Lifesteal would heal past full becomes a Shield on it. / Donor: its heals and Shields on the Bleeder are doubled. *Sees:* one unit rides low all fight, hitting at its strongest, with the party's cover on it. → Pact 2 ●●●, Landslide ● ⚙ brink (key), red stone (key)
- **Decoy** · formation · rare · Two lurk in the dark; one stands in the light. Seats: Light: Taunts and is Guarded when each fight starts. / Shadow: Hidden when each fight starts, and again each time a foe falls. / Shadow: the same. *Sees:* two names fade at the first tick and after every kill, and every blow goes to the one left. → Toll ●●, Hunt ●●, Pact ● ⚙ two in the dark (key)
- **Vigil** · formation · rare · Nobody falls alone. Seats: Sentinel: when an ally falls, it Taunts and is Guarded. / Chaplain: an ally it revives comes back Guarded and behind a Shield. / Watcher: when an ally falls, it gains a Shield. → net
- **The wheel** · formation · rare · Every so often the wheel turns, and each unit takes the next seat's part. Seats: Wall: draws more; Defense up. / Blade: basic attacks a fifth faster; crits more. / Well: regains MP in fights; heals on it are stronger. → exotic

#### Legendary
- **The mountain** · formation · legendary · While the whole party's stone holds, the Peak's blows land twice. Seats: Peak: while every ally holds a Shield, each blow it lands, swing or ability, lands a second time. / Foothill: starts each fight behind a Shield (from max HP), and every Shield it gains is a third bigger. / Foothill: the same. *Sees:* three grey bars, and every one of the Peak's numbers printed twice. → Landslide 3 ●●● ⚙ detonation (half)
- **The whetstone** · formation · legendary · Every hit the party lands sharpens the next. Each hit any ally lands adds a Cut to the party's count, kept for the fight; every ally's hits deal more for each Cut. Everyone's hits start a fifth softer. Seats: three Blades, nothing of their own. → Cuts 3 ●●●, Storm ●●
- **The forge** · formation · legendary · The longer the fire is kept, the faster the party feeds it. While any foe burns, every ally gains a Heat every few ticks (each acts faster, a stack). Whenever an ally is Stunned or Silenced, the foe with the most Burn gains many Burn. Seats: three Forgehands, nothing of their own. → Bonfire 3 ●●●
- **The long winter** · formation · legendary · Every shatter sends its cold down the line, and each sends more than the last. When a foe's Chill shatters, every other foe gains a few Chill, and a few more for each shatter before it this fight (Cascade). Seats: three Winterers, nothing of their own. *Sees:* one burst runs down the whole line. → Snap 3 ●●● ⚙ firecracker (key)
- **Eye of the storm** · formation · legendary · The storm doesn't lift. Every ally's basic attacks add a few Shock, all fight. Seats: Bolt: its abilities deal more for each Shock the foes hold; the Shock stays. / Squall: nothing of its own. / Squall: nothing of its own. *Sees:* every weapon in the party charging the field all fight, and one unit's spells reading all of it. → Storm 3 ●●● ⚙ held charge (key), lead's colour (half)
- **Open season** · formation · legendary · Every kill calls the volley again. While no foe is Marked, the foe with the lowest HP is Marked. When each fight starts, and whenever a Marked foe falls, every ally's next basic attack comes at once. Seats: three Hunters, nothing of their own. *Sees:* a volley on the first tick, and again on every kill. → Hunt 3 ●●●, Landslide ●●, Bonfire ● ⚙ judge's drum (key)
- **The palisade** · formation · legendary · One is struck, two profit, more with every blow. Seats: Wall: Taunts all fight; each blow it takes adds a Spite. / Reaper: its hits deal more for each Spite the Wall holds. / Reaper: the same. *Sees:* a counter on the wall climbs with every blow it takes, and the other two's numbers climb with it. → Toll 3 ●●●, Landslide ●
- **The cathedral** · formation · legendary · Two voices give all their mana to one, and it never stops singing. Seats: Soloist: its first-slotted ability has no cooldown: it's cast whenever there's the mana for it. / Voice: all MP it would regain goes to the Soloist; each cast the Soloist finishes gives this seat a Shield. / Voice: the same. *Sees:* one spell's name down the whole log, until the blue bar is empty. → Barrage 3 ●●● ⚙ mana as armour (half), crescendo (half)
- **The covenant** · formation · legendary · Life is the party's one currency. Every ally's abilities cost HP in place of MP, the same share, and none casts one that would leave it below a tenth of its HP. Every ally has Lifesteal. Seats: three Sworn, nothing of their own. *Sees:* three red bars swinging all fight, and no blue bar moving. → Pact 3 ●●●, Barrage ●● ⚙ blood mage (key), brink (half)
- **Twins** · formation · legendary · Two are bound; what one gives itself, the other has too. Seats: Twin: whatever status it gives itself, the other Twin gains too. / Twin: the same. / Odd one out: Attack up two steps. *Sees:* one Twin vanishes, Taunts or quickens, and the other does it with it. → exotic ⚙ borrowed gift (key), two in the dark (half)

### The versions

Every ability and passive keeps its power step. Of the 128 versions, nine change and the rest stay: the earlier twelve builds' versions already split each class toward identities the nine roads use. A version that changes says so here; a version that stays and is an engine's part, or a road's first step from a kit, is listed after, so the web can see it. Where the old size was one that play never saw (a few ticks closer, a few Might), the fill resizes it to be seen, and the line stays.

#### Changed
- **Barbed volley** · Ranger, Barbed arrow B · version · An arrow at every foe, each a light hit that adds a few Bleed. In place of Barbed quiver. *Sees:* one cast, a wound on every foe. → Cuts 2 ●●●, Hunt ● ⚙ red rain (half), emptied quiver (half)
- **Swift justice** · Paladin, Condemn B · version · Marks the foe with the lowest share of HP, and every ally's next basic attack comes at once. When the judged foe falls, Condemn is ready again. *Sees:* a foe falls, the Mark jumps, and three weapons land together on the next. → Hunt 2 ●●●, Landslide ●●, Bonfire ● ⚙ judge's drum (key)
- **Rousing chorus** · Bard, War ballad B · version · All its Might goes to the ally with the slowest basic attack: three times as many. → Landslide 2 ●●●, Hunt ●
- **Rubato** · Bard, Allegro A · version · Haste on every ally, and every ally's ability nearest to ready is ready at once. It never readies itself: for the Bard, another of its own. → Barrage 2 ●●●, Landslide ●
- **Plague** · Hexer, Malison A · version · Malison, for less damage, and it adds a few Burn and a few Shock to every foe as well as the Bleed. *Sees:* three icons on every foe from one cast, and the next curse landing bigger for them. → Bonfire ●●, Storm ●●, Cuts ●● ⚙ every colour (key), red rain (half)
- **Focused curse** · Hexer, Malison B · version · Malison on the foe with the highest Attack alone, three times as hard, adding three times the Bleed. → Hunt ●● ⚙ every colour (half)
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
- **Reprise** · Bard, Encore A · version (kept) · The ally with the highest Attack has its ability with the longest cooldown left ready at once. → Barrage 2 ●●●, Landslide 2 ●●
- **Smoke screen** · Assassin, Vanish A · version (kept) · Hides the ally with the lowest share of HP that isn't Taunting. → Pact ●●, Toll ●● ⚙ two in the dark (key), brink (half)
- **Shared rites** · Cleric, Last rites A · version (kept) · While any ally is below 30% of its HP, the Cleric's cooldowns are halved. → Pact 2 ●●● ⚙ brink (half)
- **Lament** · Bard, War ballad A · version (kept) · Twice the Might, for every ally below half its HP. → Pact 2 ●●● ⚙ brink (half)
- **Over the fallen** · Valkyrie, Choosing B · version (kept) · Heals for double or raises, and the Valkyrie Taunts and is Guarded. → Toll 2 ●●●, Pact ●● ⚙ riposte (half), brink (half)
- **Stillness of mind** · Monk, Flow B · version (kept) · Taunts, and its Evasion rises for as long as the Taunt. → Toll 2 ●●● ⚙ riposte (half)
- **Drinking palm** · Monk, Iron palm B · version (kept) · Its hits on a Sundered foe heal it. → Pact ●●, Toll ●● ⚙ riposte (half)
- **Watch the anchor** · Hoplite, Aspis A · version (kept) · Aegis on the ally with the most Aggro that holds none. → Toll 2 ●●● ⚙ mirror (half)
- **Blood for mana** · Vampire, Blood gift A · version (kept) · Spends its HP to give the ally with the least MP as much MP, and Clarity. → Barrage 2 ●●●, Pact ●● ⚙ mana as armour (half)
- **Hex of flames** · Hexer, Cold hex A · version (kept) · Its basic attacks add a few Burn in place of the Chill. → Bonfire 1 ●●● ⚙ lead's colour (half)
- **Kindling** · Pyromancer, Stoke A · version (kept) · Its basic attacks add a few Burn, in place of its casts. → Bonfire 1 ●●● ⚙ lead's colour (half)
- **Zeal** · Paladin, Judgement A · version (kept) · Its basic attacks add a few Burn to a foe with a buff or a debuff. → Bonfire 1 ●●●
- **Hold the line** · Knight, Stand fast B · version (kept) · Taunts, with Thorns for as long as the Taunt. → Toll 1 ●●● ⚙ goad (half)
- **Aftershock** · Geomancer, Tremor A · version (kept) · Stuns every foe. → Landslide ●●, Storm ●● ⚙ held charge (half)
- **Thunderclap** · Valkyrie, Skyfall A · version (kept) · Skyfall on every foe that holds Shock, rising with each one's. → Storm 3 ●●● ⚙ held charge (key)
- **Whipping vines** · Bramble knight, Bramble lash A · version (kept) · Lashes every foe for half. → Toll 2 ●●, Cuts ●● ⚙ red rain (half)
- **Overgrowth** · Bramble knight, Thicket A · version (kept) · Taunts twice over, and its Thorns are doubled while the Taunts last. No Guard. → Toll 2 ●●● ⚙ goad (half)
- **Frost fist** · Monk, Burning fist A · version (kept) · Three quick hits on the foe with the most Chill, each adding a little Chill. → Snap 1 ●●●
- **Hail** · Ranger, Frost arrow B · version (kept) · A quick arrow at the foe with the most Chill, and a few Chill on every foe. → Snap 1 ●●● ⚙ firecracker (half)
- **Opening thrust** · Hoplite, Phalanx A · version (kept) · Its first swing of each fight comes at once and deals triple. → Hunt 1 ●●●, Landslide ●●
- **Quarry** · Ranger, Hunter's eye A · version (kept) · Its basic attacks go to the foe with the lowest share of HP, past any guard. → Hunt 1 ●●●
- **Savage drain** · Vampire, Blood drain A · version (kept) · Three quick hits, each drinking. → Cuts 1 ●●●, Pact ●●
- **Rally the well** · Knight, Stand fast A · version (kept) · Clarity for every ally under half its MP. No Taunt. → Barrage 1 ●●● ⚙ mana as armour (half)
- **Shieldbearer** · Hoplite, Phalanx B · version (kept) · Defense adds to its doubled swings. → Landslide 1 ●●●

### The mythics

One a class, as today. Eleven stay as they are; five change. Each line says which road it pulls toward. Two of the five change because their old card is an uncommon's now.

- **Horn of the keep** · Knight · mythic (offhand) · Every hit the Knight takes gives the ally with the least MP a share of the hit as MP. When its Taunt runs out while another ally is in a wind-up, it Taunts again. Kept. → Barrage 3 ●●●, Toll ●● ⚙ mana as armour (half)
- **Halo of the saint** · Cleric · mythic (amulet) · Each heal and Regen the Cleric casts also lands on every other ally below half its HP. Changed: the old one waited for a fall. → Pact 3 ●●● ⚙ brink (half)
- **Huntmaster's quiver** · Ranger · mythic (armor) · All the Ranger's abilities aim past any guard at the foe with the lowest HP. When a foe one of them hit falls, its abilities are ready again. Kept, at a size that's seen. → Hunt 3 ●●● ⚙ reaping (half)
- **Heartwood mail** · Bramble knight · mythic (armor) · Whenever a hit lands on any ally, the Bramble knight's Thorns strike the attacker too. Kept. → Toll 3 ●●●, Cuts ●● ⚙ red rain (half)
- **The last wall** · Hoplite · mythic (offhand) · When an Aegis the Hoplite gave blocks a blow, the attacker takes the blocked damage, and Aspis is ready again. Kept. → Toll 3 ●●●, Landslide ●● ⚙ mirror (key)
- **Writ of judgement** · Paladin · mythic (offhand) · Whenever the Paladin's Condemn Marks a foe, a heavy blow falls on it at once (from Attack), adding several Burn. A Mark from its gear or its seat doesn't call it. Changed: the old one waited for a Stun or a Silence. → Hunt 3 ●●●, Bonfire ●●, Landslide ●●
- **Stormspear** · Valkyrie · mythic (weapon) · A one-handed spear. Every fourth hit the Valkyrie lands calls a blow from above on the foe with the most Shock, past any Taunt, rising with each stack it holds. The Shock stays. Changed: its Shock on every swing is an uncommon's effect now. → Storm 3 ●●●, Hunt ● ⚙ held charge (key)
- **Metronome** · Bard · mythic (offhand) · Counts every hit the party lands. At a set count, War ballad, Allegro and Encore are ready at once, and the count starts again. Kept. → Cuts 3 ●●●, Barrage ●●, Storm ● ⚙ spell on the swing (key)
- **The witch-blade** · Hexer · mythic (weapon) · After each ability the Hexer casts, its next three basic attacks hit every foe that holds a debuff. Kept. → Snap 3 ●●●, Bonfire ●●, Storm ●● ⚙ every colour (half), red rain (half)
- **Ember palms** · Monk · mythic (weapon) · Each hit the Monk lands deals extra damage for each Burn on its target. The Burn stays. Changed: its Burn on every hit is an uncommon's effect now. → Bonfire 3 ●●●, Cuts ●●
- **Night's edge** · Assassin · mythic (armor) · When the Assassin lands a killing blow, it's Hidden for a moment, and its next hit deals double. Kept. → Hunt 3 ●●● ⚙ two in the dark (half)
- **The chalice** · Vampire · mythic (offhand) · Whenever another ally would pay MP for an ability, the Vampire pays the same share in HP instead, while that leaves it above a tenth of its HP. Changed: the old one waited for a fall. → Pact 3 ●●●, Barrage ●●● ⚙ blood mage (half), brink (key)
- **Crown of embers** · Pyromancer · mythic (amulet) · While the Pyromancer stands, every ally's hits add a Burn. Kept. → Bonfire 3 ●●● ⚙ lead's colour (half)
- **Glacier's heart** · Frostweaver · mythic (armor) · Whenever a foe's Chill shatters, the Frostweaver puts half of it back on that foe. Kept. → Snap 3 ●●● ⚙ firecracker (key)
- **Eye of the tempest** · Stormcaller · mythic (weapon) · Every hit the Stormcaller lands jumps to one more random foe for half its damage. When a foe falls holding Shock, every other foe gains half of it. Kept. → Storm 3 ●●●
- **Mountain's crown** · Geomancer · mythic (amulet) · Each crit the Geomancer lands rebuilds its own Shield by the damage the crit dealt. Kept. → Landslide 3 ●●● ⚙ detonation (half)

### Kit changes the gaps call for

None. Every road's sign is in a base kit already, and the loot reaches every rung of every road without one. Blood Pact and the Storm are the nearest to wanting one: their signs are in the fewest kits (the Vampire's passive; the Stormcaller's passive and the Valkyrie's one ability in three), so they're the roads a run is least often shown (*The web*, below). The spine answers both from the loot: Lifesteal is a common on the amulet and in five kinds; three riders and a totem put Shock in nine classes' hands, and a robe deepens it for a tenth.

## Commons and uncommons by kind

Commons are written from the rule in their row. Every uncommon's effect is named, and its line, with what the player sees and what it serves, is under its kind above.

<!-- kinds:start -->
| Kind | Signature | Commons | Uncommons, each effect named | Stats lean, by road |
| --- | --- | --- | --- | --- |
| Dagger | Crit chance | 2: one leans to Crit chance and Attack speed, one to Crit chance and Crit damage. | **Weeping kris:** Its first hit on each foe adds several Bleed.<br>**Sleet dirk:** Its basic attacks add a few Chill.<br>**Second thrust:** When it lands a killing blow, its next basic attack comes at once and always crits. | the Hunt to Crit chance and Crit damage; Thousand Cuts to Attack speed; Cold Snap to Attack speed and Accuracy. |
| Fist weapons | Double strike | 2: one leans to Double strike and Attack speed, one to Double strike and Lifesteal. | **Live-wire knuckles:** Its basic attacks and extra strikes add a few Shock.<br>**Cinder wraps:** Its basic attacks and extra strikes add a few Burn.<br>**Rime knuckles:** Its basic attacks and extra strikes add a few Chill.<br>**Lamprey claws:** Each extra strike it lands heals its wearer (from max HP). | Thousand Cuts and the Storm to Attack speed and Double strike; Blood Pact to Lifesteal and HP; the Toll's dancer to Evasion. |
| Wand | Cooldown | 2: one leans to Cooldown and Attack speed, one to Cooldown and MP regen. | **Spark wand:** Its basic attacks add a few Burn.<br>**Jolt wand:** Its basic attacks add a few Shock.<br>**Tithe wand:** Each basic attack it lands gives the ally with the least MP some MP. | Barrage to Cooldown and Cast speed; Bonfire, Cold Snap and the Storm to Attack speed and Attack; the Bard's songs to Cooldown and MP regen. |
| Sword | Attack | 2: one leans to Attack and Crit chance, one to Attack and HP or Aggro. | **Rimed blade:** Its basic attacks add a few Chill, read off its wearer's max HP.<br>**Drawn steel:** Its first hit on each foe deals double.<br>**Mercy's edge:** Each basic attack it lands heals the ally with the lowest share of HP for a share of the damage. | the Toll to HP, Defense and Aggro; the Hunt and the Storm to Crit chance; Barrage's well and Blood Pact to HP. |
| Spear | Aggro | 2: one leans to Aggro and Defense, one to Aggro and Attack. | **Jolt spear:** Its hits add a few Shock, swing or ability.<br>**Victor's spear:** When it lands a killing blow, its wearer gains a Shield (from Attack).<br>**Long spear:** Its basic attacks ignore Taunt. | the Toll to Aggro, Defense and HP; the Hunt to Crit chance and Attack; the Storm to Attack speed. |
| Axe | Lifesteal | 2: one carries Lifesteal, one Attack. The axe's budget is lean, so each carries one step. | **Reaver's axe:** When it lands a killing blow, its wearer gains many Might.<br>**Hungry axe:** Its Lifesteal is doubled against a foe below half its HP.<br>**Ragged axe:** Its hits add a few Bleed. | Blood Pact to Lifesteal and HP; the Hunt to Attack and Crit damage. |
| Bow | Crit damage | 2: one leans to Crit damage and Crit chance, one to Crit damage and Attack speed. | **Broadhead bow:** Its crits add many Bleed.<br>**Opening shot:** Its first basic attack of each fight comes at once and always crits.<br>**Frostbite bow:** Its basic attacks add several Chill. | the Hunt to Crit damage and Crit chance; Thousand Cuts to Attack speed; the Bard's Refrain to Attack. |
| Rune sword | MP regen | 2: one leans to MP regen and Cooldown, one to MP regen and HP. | **Sleet blade:** Its basic attacks add several Chill.<br>**Sigil blade:** When each fight starts, its wearer gains a Shield from its max MP.<br>**Wellblade:** Each basic attack it lands restores some of its wearer's MP. | Barrage to MP regen, Cooldown and MP; Cold Snap and the Toll's wardens to HP. |
| Hammer | Defense | 2: one carries Defense, one HP with a lighter swing. The hammer's budget is lean. | **Warden's hammer:** Its swings deal extra damage from its wearer's Defense.<br>**Mason's hammer:** Each swing it lands gives its wearer a Shield of a share of the damage dealt.<br>**Bellringer:** Every third swing it lands Stuns its target. | Landslide to Defense and Crit damage; the Toll to HP, Aggro and Thorns. |
| Mace | HP | 2: one leans to HP and Defense, one to HP and MP regen. The mace's budget is rich, so each carries two steps. | **Censer mace:** Its basic attacks add many Burn.<br>**Mender's mace:** Every so often, the ally with the lowest share of HP is healed (from its wearer's max HP).<br>**Penitent's mace:** Each hit its wearer takes heals the ally with the lowest share of HP a little (from its max HP). | the Toll to HP, Defense and Thorns; Blood Pact to HP and MP regen; Barrage's font to MP regen and Cooldown. |
| Staff | Cast speed | 2: one leans to Cast speed and Cooldown, one to Cast speed and MP regen. The staff's budget is rich. | **Shepherd's staff:** Each ability its wearer casts gives the ally with the least MP some MP.<br>**Canopy staff:** When each fight starts, its wearer and the other ally with the least max HP each gain a Shield (from Attack).<br>**Vesper staff:** Each ability its wearer casts heals the ally with the lowest share of HP a little (from Attack). | Barrage to Cast speed, Cooldown and MP; Bonfire and Cold Snap to Cast speed and Attack; the healers to MP regen and HP. |
| Great weapon | Attack | 2: one carries Attack with a heavier swing, one leans to Attack and HP. The great weapon's budget is rich. | **Roaring greataxe:** Its wearer starts each fight with many Might.<br>**Giantsbane:** Its swings deal half again as much to a foe above half its HP.<br>**Harvest scythe:** When it lands a killing blow, its next basic attack comes at once. | Landslide to HP and Crit damage; the Hunt to Crit damage; Blood Pact to HP and Lifesteal. |
| Plate | (by weight) | 3: one leans to Defense, one to HP and Aggro, one to Thorns and Defense. | **Portcullis:** While its wearer is above half its HP, it draws far more.<br>**Keystone cuirass:** While its wearer holds a Shield, its hits deal a third more.<br>**Holdfast:** The first time each fight its wearer drops below half its HP, it's Guarded.<br>**Urchin plate:** While its wearer holds a Shield, it has Thorns. | Landslide to Defense and HP; the Toll to Aggro and Thorns; the keepers and rods of Bonfire and the Storm to Defense and Aggro. |
| Mail | (by weight) | 3: one leans to HP and Attack, one to Lifesteal and HP, one to HP and Defense. | **Scabbed mail:** Each hit its wearer lands gives it a small Shield (from max HP).<br>**Reprisal hauberk:** The first time each foe hits its wearer in a fight, that foe takes damage (from the wearer's max HP).<br>**Bloodsworn mail:** While its wearer is below half its HP, it has Lifesteal.<br>**Warded mail:** The first time each fight its wearer drops below half its HP, it gains a Shield (from max HP). | Blood Pact to HP and Lifesteal; the Toll to HP and Thorns; Thousand Cuts to Attack and Lifesteal; the status roads to Attack. |
| Leather | (by weight) | 3: one leans to Evasion and Attack, one to Crit chance and Attack, one to Accuracy and Crit chance. | **Tithing leathers:** Each hit its wearer lands heals it a little (from max HP).<br>**Tracker's coat:** Its wearer's abilities have Seek.<br>**Mottled hide:** While its wearer is below half its HP, it draws far less.<br>**Quickstep leathers:** Each time its wearer dodges a hit, it's Hasted. | Thousand Cuts and the Storm to Evasion and Attack; the Hunt to Crit chance and Accuracy; the Toll's dancer to Evasion. |
| Robes | (by weight) | 3: one leans to MP and Attack, one to MP regen and HP, one to MP with Aggro down. | **Matins robe:** Every third ability its wearer casts costs no MP.<br>**Banked robe:** Its wearer's abilities add half again as many stacks of Burn, Chill and Shock.<br>**Glyphed robe:** Each ability its wearer casts gives it a Shield (from max MP).<br>**Acolyte's robe:** Each time another ally casts an ability, its wearer regains a little MP. | Barrage to MP and MP regen; Bonfire, Cold Snap and the Storm to Attack and Cast speed; every caster to Aggro down. |
| Kite shield | Defense | 2: one leans to Defense and HP, one to Defense and Aggro. | **Emberguard:** Foes that hit its holder gain a few Burn.<br>**Sheltering kite:** When each fight starts, its holder and the other ally with the least Defense are Guarded.<br>**Bossed kite:** Its holder's abilities deal extra damage from its Defense. | Landslide to Defense and HP; the Toll to Aggro and Thorns. |
| Round shield | HP | 2: one leans to HP and Attack, one to HP and Defense. | **Comrade's targe:** Every so often, the ally with the lowest share of HP gains a Shield (from its holder's max HP).<br>**Hunter's buckler:** When its holder's hit fells a foe, it's Hasted.<br>**Spiked targe:** While its holder is Guarded, it has Thorns. | the Toll to HP, Defense and Aggro; Landslide to HP and Defense; the Hunt and the Storm to Attack. |
| Horn | Aggro | 2: one leans to Aggro and HP, one to Aggro and MP regen. | **Reveille:** When each fight starts, the ally with the highest Attack has its ability with the longest cooldown ready.<br>**Bull's horn:** The first time a foe falls in a fight, every ally is Hasted.<br>**Watch horn:** Whenever an ally drops below half its HP, its holder Taunts. | the Toll to Aggro, HP and Defense; Barrage's well to MP regen; Landslide's loader to Attack. |
| Totem | Thorns | 2: one leans to Thorns and Defense, one to Thorns and Attack. | **Spinebark pole:** When each fight starts, the ally with the highest Aggro gains Thorns for the fight.<br>**Stormglass totem:** When each fight starts, every foe gains a few Shock.<br>**Bear fetish:** Whenever an ally drops below half its HP, it's Guarded. | the Toll to Thorns, Defense and Aggro; the Storm to Attack. |
| Relic | MP regen | 2: one leans to MP regen and HP, one to MP regen and Cast speed. | **Holy water:** Each time one of its holder's abilities heals an ally, it also lifts one debuff from that ally.<br>**Charnel icon:** Each time a foe falls, the ally with the lowest share of HP is healed (from its holder's Attack).<br>**Font relic:** Each time one of its holder's abilities heals an ally, that ally also regains MP. | Blood Pact and the Toll's keepers to MP regen and HP; Barrage's font to MP regen and Cast speed. |
| Lantern | Cast speed | 2: one leans to Cast speed and Attack, one to Cast speed and MP. | **Pitch lantern:** When each fight starts, every foe gains several Burn.<br>**Dazzling lantern:** When each fight starts, the two foes with the highest Attack are Weakened. | Bonfire to Cast speed and Attack; Barrage to Cast speed, MP and Cooldown. |
| Tome | Cooldown | 2: one leans to Cooldown and Attack, one to Cooldown and MP regen. | **Snowbound folio:** When each fight starts, every foe gains a few Chill.<br>**Marginalia:** While a foe is in a wind-up, its holder's abilities aim at it.<br>**Curse-book:** Its holder's abilities add a few Bleed to each foe they hit. | Barrage to Cooldown, Cast speed and MP; Cold Snap and the Hexer's curses to Cooldown and Attack. |
| Orb | MP | 2: one leans to MP and MP regen, one to MP and Attack. | **Scrying orb:** When each fight starts, its holder's ability nearest to ready comes at once.<br>**Mana pearl:** Each time a foe falls, its holder regains MP. | Barrage to MP, MP regen and Cooldown; Bonfire and Cold Snap to MP and Attack. |
| Idol | Siphon | 2: one leans to Siphon and Attack, one to Siphon and HP. | **Fanged idol:** Its holder's first hit on each foe Rots it.<br>**Leech idol:** MP its holder gains past its full pool goes to the ally with the least MP. | Blood Pact to Lifesteal and HP; Barrage's blood-well to Siphon and MP; the curser to Attack. |
| Vial | Lifesteal | 2: one leans to Lifesteal and HP, one to Lifesteal and Crit chance. | **Crimson dregs:** Its holder's hits on a bleeding foe heal it for a share of their damage.<br>**Lancet phial:** When each fight starts, every foe gains a few Bleed. | Blood Pact to Lifesteal and HP; Thousand Cuts and the Hunt to Crit chance and Crit damage. |
| Trophy | Crit damage | 2: one leans to Crit damage and Crit chance, one to Crit damage and Defense. | **Hunter's skull:** Each killing blow its holder lands adds a Heat (it acts faster, a stack) for the rest of the fight.<br>**Eagle feather:** Its holder's crits Slow their target. | the Hunt to Crit damage and Crit chance; Landslide to Crit damage and Defense. |
| Bell | Attack speed | 2: one leans to Attack speed and Evasion, one to Attack speed and MP regen. | **Ringing bell:** Every fourth basic attack its holder lands rings: a light hit on every foe (from Attack), carrying what the swing carries.<br>**Pacer's bell:** Each time its holder casts an ability, it's Hasted. | Thousand Cuts and the Storm to Attack speed and Double strike; Barrage to MP regen. |
| Cloak | Evasion | 2: one leans to Evasion and Attack, one to Evasion and Attack speed. | **Hooded cloak:** Each time its holder dodges a hit, it gains a Shield (from Attack).<br>**Feathered cloak:** The first time each fight its holder drops below half its HP, it's Hidden.<br>**Matador's cape:** Each time its holder dodges a hit, it Taunts. | the Toll's dancer to Evasion and Defense; Thousand Cuts to Evasion and Attack speed; the Hunt to Evasion and Crit chance. |
| Amulet | (everyone) | 10: one each of HP, Defense, Attack, Crit chance, MP regen, Evasion, Lifesteal, Thorns, Double strike and Cooldown. | **Tinder charm:** Its wearer's basic attacks add a few stacks to whichever of Burn, Chill, Shock or Bleed their target holds the most of.<br>**Challenger's token:** Its wearer Taunts when each fight starts.<br>**Carapace charm:** Its wearer starts every fight behind a Shield (from max HP).<br>**Hare's foot:** Its wearer starts every fight Hasted.<br>**Millstone:** Its wearer's basic attacks come half as often and land more than twice as hard.<br>**Hummingbird charm:** Its wearer's basic attacks come twice as often and deal half as much.<br>**Clear-headed charm:** Whenever its wearer drops below half its MP, it gains Clarity, every so often. | each common is one road's first stat. |
<!-- kinds:end -->

## Each engine's link

For each engine: what one part makes, what the other reads, and what the fill sizes the link to do. The fill sets the numbers on both sides so the two meet. No card names its partner.

**The foes do it to themselves**
- **The shield detonation.** *Makes:* any Shield on a unit, from the kits and the Shield-makers. *Reads:* the most that Shield held, when it breaks: Rubble plate deals it to every foe, Shatterstone charm twice over to the foe that broke it. The return reads the same size: Second skin puts half back, Rampart all of it, once. *Sized so:* a start-of-fight Shield's break is seen as a blow on its own, and a party laying stone from three sources out-damages its swings.
- **The frozen gate.** *Makes:* a few Chill on each foe that strikes the anchor (Hoarfrost plate on the anchor, Frostward blade from the mage beside it), any Guarded ally (Frost armor), or the Gate seat with a Chill swing behind it (Toll gate). Chill's own cap makes the shatter. *Reads:* the shatter: Rime shield, Frostwalker's furs, Meltwater orb, the shatter bell. *Sized so:* a pack shatters on the wall within a few of its swings, and a boss within a fight.
- **The mirror.** *Makes:* a blow on the wall, and the cover that stops most of it (Defense, Guard, a Shield, an Aegis). *Reads:* the blow before the cover, in one of two ways. Mirror shield and Thornheart plate send back a share of the whole blow, whatever the cover. Hoplon and The last wall send back exactly what the cover stopped, in numbers the game prints: what a Shield soaked and what an Aegis blocked. *Sized so:* what's sent back is seen against a boss's heaviest blow, on a wall that took a small number or none.
- **The goad.** *Makes:* a foe's next basic attack, now: every foe's when the wearer Taunts (Goading totem), one foe's when a blow lands on it (Provoking blade). *Reads:* nothing of its own: whatever a foe's action already costs it, the Shock it holds, the Thorns and on-struck pieces of whoever it hits. *Sized so:* each call costs the pack more than the blows cost the anchor, when the anchor wears its toll.
- **The held charge.** *Makes:* Shock on the swings, up to its cap, and a foe that can't act to pay it off (a Stun, a shatter, a boss between its moves). *Reads:* the stacks on the target (Skyfall, Thunderhead maul, Lightning-glass, Stormspear) or on the whole field (Stormbrand, Thunderclap, the Bolt seat), and leaves them. *Sized so:* a charge at its cap doubles the reader's blow or more.
- **The reckoning.** *Makes:* one Wrath for each hit the anvil takes: on itself (Grudgebearer), on the party's slowest swinger (The anvil), or on the Hammer seat. *Reads:* the count, on the next swing, and spends it. *Sized so:* a swarm's bites between two slow swings make that swing the fight's biggest number.

**Kills turn them over**
- **The reaping.** *Makes:* a field whose HP bars sink together (any wide hit, thorns on a swarm, fire laid thin). *Reads:* the lowest HP: an execute that's ready again at its own kill (Coup de grâce), or any kill that readies the wearer's longest cooldown, which is the execute it just used (Bounty charm). *Sized so:* the execute kills a sunk foe in one, so it chains down the field.
- **The judge's drum.** *Makes:* every ally's next basic attack at once, made again when a Marked foe falls (Swift justice, Hunting horn, Open season) or when the wearer kills (Pack leader's coat). *Reads:* each ally's swing as it stands: its size, its Might, what it carries. *Sized so:* nothing to size: "at once" on a slow weapon is a whole swing.
- **The opening, again.** *Makes:* a kill or a fall. *Reads:* the start-of-fight effects of gear and seats, and fires them again: its wearer's on its own kills (Overture coat), the whole party's on every fall (Second dawn). Overture coat is armor, so it reads its wearer's weapon, offhand, amulet and seat. *Sized so:* each start-of-fight uncommon is worth seeing twice in a fight.
- **The fuse.** *Makes:* a foe that falls while it burns. *Reads:* the Burn it held at that moment, and moves it: all of it to the hottest foe left (Wick), to the next foe the wearer hits (Ember heart), to the foe with the most HP (the Torch seat), or a third of it to every other foe (Smouldering orb). Two movers in one party split the fire evenly. *Sized so:* the fire that jumps is most of the next foe's fire.
- **The avalanche.** *Makes:* a blow bigger than what it lands on. *Reads:* the damage past the foe's last HP, and deals it to the foe with the lowest HP, once (Overkill axe), to any other foe and on again while it kills (Overrun), or split among all the others, once (Downhill charm). *Sized so:* a heavy blow on a wolf runs through two or three more with Overrun, and one more with the others.

**The party's swings and hits turn them over**
- **The spell on the swing.** *Makes:* basic attacks landed. *Reads:* the count: every fifth casts the first-slotted ability off its cooldown (Bell of the hour); each takes a fifth off the wait that's left (Baton), which is the door's "swings that bring a spell round"; the party's count readies the Bard's songs (Metronome). *Sized so:* the count comes round several times a fight on a fast unit, and mana is what stops it.
- **The red rain.** *Makes:* Bleed on the whole field (Briar, Lancet phial, Barbed volley, Curse-book, Plague, Briar totem). *Reads:* nothing: Bleed pays each hit, so any hit on many foes pays every wound at once. *Sized so:* on a pack, what Bleed pays for one wide hit beats the wide hit's own damage.
- **The riposte.** *Makes:* a dodge, on a unit the foes are aiming at (Matador's cape makes a dodger Taunt). *Reads:* the dodge, as a swing: a strike at the attacker from the dodger (Duelist's leathers) or from the ally beside it (Parrying spear), or the dodger's next basic attack at once, twice (Tempest cloak). That swing builds cover the way its striker already does. *Sized so:* a dodger who draws answers often enough to bank cover for the blow that lands.
- **Every colour.** *Makes:* several different afflictions on one foe, a stack or two of each: a random one a swing (Wildmagic wand), two on every foe at the start (Grimoire of plagues), three a cast (Plague), a rider beside the Hexer's own Chill. *Reads:* how many different ones the foe holds: Malison. Festering idol keeps each one topped up, and Hexweave mail reads every debuff the same way. *Sized so:* all five roughly double the curse.
- **The lead's colour.** *Makes:* a status on one unit's basic attack, from its kit, a piece or a storm. *Reads:* that swing's riders, and puts them on another unit's basic attacks, added as its own weapon would add them: the two Followers behind the Lead (The standard), or the wand that follows the ally with the highest Attack (Mimic wand). *Sized so:* three weapons bring the second shatter, or hold a fire up, where one could only start it.
- **The emptied quiver.** *Makes:* crits that are near certain for a while: on a bleeding foe, one that hasn't acted, a Stunned one, after a kill, or by the coin. Five pieces make them, and none makes a crit certain for more than one swing. *Reads:* each crit, as the next basic attack at once: Quick draw, the Ranger's version, and nothing else. *Sized so:* the burst runs three or four arrows and stops on the crit that fails.

**Casts and mana turn them over**
- **The blood mage.** *Makes:* a price in HP at each cast (Flagellant's vestments on a caster's robes, The covenant; Blood vial for the two classes that hold it, neither with a wide spell). *Reads:* the damage the cast deals, through Lifesteal, foe by foe: a common on the amulet is enough. Bloodstone reliquary and Idol of the blood-well read the price itself, as a heal or as mana for someone else. *Sized so:* a cast loses life on one foe and gains it on three.
- **The resonance.** *Makes:* a cast that hits several foes. *Reads:* how many it hit, and brings that ability round sooner for each. *Sized so:* against a full pack the spell comes back two or three times as fast, and mana is what stops it.
- **The crescendo.** *Makes:* a Crescendo each time the same ability is cast again: more of what it does, at more cost (Crescendo charm), or at none (Orb of the rising sun, whose holder never pays more whatever else it wears). *Reads:* nothing else: a cast that's free for another reason skips the price and still adds the stack. *Sized so:* the price empties a pool within a fight unless the free casts skip it.
- **Mana as armour.** *Makes:* MP given to the wearer: Clarity, Refrain, a heal that gives mana, a wand that tithes. *Reads:* the damage it takes, and takes it from MP first, so every giver heals. *Sized so:* each note of mana that reaches it is seen as a blow not taken.

**A shatter turns them over**
- **The shatter bell.** *Makes:* a shatter, anyone's. *Reads:* it, as the longest cooldown ready: on the wearer of Floe charm, any class, or in the Breaker seat; or as half the wait gone for the whole party (Frozen tome). *Sized so:* the slowest ability rings once a shatter.
- **The firecracker string.** *Makes:* a shatter, which spends a foe's Chill. *Reads:* the shatter, and lays cold again: half of what it held on that foe (Glacier's heart), half on the coldest other foe (Winter's chain), a third on every other foe (Splinters), a few on every other foe and more with each shatter before it (The long winter), or a few on every foe with the wearer's next hit (Frostwalker's furs). A foe that has already burst in the chain takes less of it each time, so the string dies down. *Sized so:* the cold sent on takes a cold neighbour to its cap, and a warm one nowhere near.

**Who gets picked, and who's healed, turns them over**
- **The brink.** *Makes:* a unit that's always the one with the lowest share of HP: by a cap at half (Halved heart), a drain (the Bleeder seat) or a price (Flagellant's vestments, Blood vial, Bloodletter, Heart of the saint, The chalice). *Reads:* nothing new: every kit gift and every uncommon aimed at "the ally with the lowest share of HP" now lands on a unit the player chose. A heal on a unit capped at half counts as healing past full, so it isn't wasted where the red stone's pieces are. *Sized so:* the givers' cover outlasts what reaches the low unit.
- **Two in the dark.** *Makes:* Hidden on two of the party. *Reads:* nothing: foes can't pick a Hidden unit, so every single-target pick goes to the third. *Sized so:* the hiding covers most of a fight's picks, by being laid again: at each fall (Shadow cloak, Decoy's Shadows), or each time an ally drops low (Shroud charm).
- **The red stone.** *Makes:* healing on a unit that's already full. *Reads:* the part past full, as a Shield on it (Red stone mail, the Drinker seat) or on whoever was healed (Phylactery). *Sized so:* a full drinker's swings build a Shield bar the player can watch grow.

**Exotics**
- **The borrowed gift.** *Makes:* any status a unit gives itself. *Reads:* it, and gives the same to the other ally with the lowest share of HP (Twin-knot) or to the other Twin. *Sized so:* the copy is the same size, so the joke reads.
- **The carrier.** *Makes:* an affliction on the wearer, from a foe or from Burning heart. *Reads:* it: a stack of each onto whatever it hits (Carrier's coat). Scapegoat charm is its cousin: it hands on a whole debuff, of any kind. *Sized so:* one stack a hit adds up on a fast unit.

## The web

Checked across all nine roads. The tables are the script's, on offer volumes counted over 40 simulated runs (`offer-count.ts`): about 35 pieces offered an act, a roster of four, five, then six.

### Every rung, by more than one route

<!-- roads:start -->
| Road | Rung 1 | Rung 2 | Rung 3 | Formations (common, rare, legendary) | Versions and mythics |
| --- | --- | --- | --- | --- | --- |
| Landslide | 8 pieces, 6 kinds | 13 pieces, 8 kinds | 4 pieces, 3 kinds | 2, 2, 2 | 11 |
| Thousand Cuts | 15 pieces, 10 kinds | 10 pieces, 9 kinds | 4 pieces, 4 kinds | 4, 2, 1 | 8 |
| Bonfire | 7 pieces, 7 kinds | 9 pieces, 8 kinds | 2 pieces, 2 kinds | 3, 1, 1 | 9 |
| Cold Snap | 8 pieces, 8 kinds | 14 pieces, 12 kinds | 3 pieces, 3 kinds | 2, 2, 1 | 7 |
| The Storm | 7 pieces, 7 kinds | 11 pieces, 10 kinds | 2 pieces, 2 kinds | 3, 2, 2 | 8 |
| The Hunt | 13 pieces, 11 kinds | 15 pieces, 9 kinds | 7 pieces, 7 kinds | 2, 3, 1 | 9 |
| The Toll | 11 pieces, 8 kinds | 18 pieces, 12 kinds | 5 pieces, 4 kinds | 3, 4, 1 | 14 |
| Barrage | 12 pieces, 9 kinds | 13 pieces, 8 kinds | 8 pieces, 7 kinds | 3, 3, 2 | 10 |
| Blood Pact | 11 pieces, 10 kinds | 11 pieces, 9 kinds | 6 pieces, 5 kinds | 1, 2, 1 | 9 |
<!-- roads:end -->

A formation or a version counts for a road here where it's worth ●● or more to it. Every road has first steps and second rungs in six kinds or more, a far end in two to eight pieces, a formation at each rarity, and versions in several classes. Bonfire and the Storm have the thinnest far ends in pieces: two each, beside a legendary formation and two mythics.

**Every class can wear its roads' steps.** Each cell is first steps / second rungs / far ends that the class can wear:

<!-- classes:start -->
| Class | Pieces it can wear, by road (rung 1 / rung 2 / rung 3) |
| --- | --- |
| Knight | Landslide 6/8/1 · Cuts 3/1/0 · Bonfire 2/1/0 · Snap 2/2/1 · Storm 1/2/1 · Hunt 2/4/2 · Toll 4/6/3 · Barrage 2/1/0 · Pact 1/2/0 |
| Cleric | Landslide 1/1/0 · Cuts 3/1/0 · Bonfire 4/4/2 · Snap 2/2/1 · Storm 2/2/0 · Hunt 0/3/1 · Toll 3/1/0 · Barrage 6/7/2 · Pact 3/4/3 |
| Ranger | Landslide 1/3/0 · Cuts 7/6/2 · Bonfire 1/1/0 · Snap 3/3/1 · Storm 1/1/0 · Hunt 4/8/4 · Toll 3/3/1 · Barrage 1/1/0 · Pact 1/1/0 |
| Bramble knight | Landslide 4/5/2 · Cuts 4/3/1 · Bonfire 2/1/1 · Snap 1/2/1 · Storm 2/4/0 · Hunt 1/2/1 · Toll 8/10/2 · Barrage 1/1/0 · Pact 4/4/2 |
| Hoplite | Landslide 5/6/2 · Cuts 3/1/0 · Bonfire 1/1/0 · Snap 1/3/1 · Storm 2/3/0 · Hunt 6/4/2 · Toll 5/4/3 · Barrage 2/1/0 · Pact 1/1/0 |
| Paladin | Landslide 5/7/2 · Cuts 4/2/1 · Bonfire 3/1/1 · Snap 1/3/1 · Storm 1/3/0 · Hunt 2/3/1 · Toll 6/5/3 · Barrage 2/1/0 · Pact 4/5/4 |
| Valkyrie | Landslide 1/2/0 · Cuts 6/5/2 · Bonfire 1/1/0 · Snap 2/2/1 · Storm 2/4/1 · Hunt 5/7/1 · Toll 5/8/2 · Barrage 1/1/0 · Pact 5/4/1 |
| Bard | Landslide 1/1/0 · Cuts 9/4/1 · Bonfire 3/4/0 · Snap 4/5/2 · Storm 4/3/0 · Hunt 2/6/3 · Toll 1/1/1 · Barrage 5/8/3 · Pact 1/2/0 |
| Hexer | Landslide 1/1/0 · Cuts 5/2/1 · Bonfire 2/4/0 · Snap 3/5/2 · Storm 2/5/1 · Hunt 1/3/2 · Toll 2/3/0 · Barrage 3/3/3 · Pact 3/4/1 |
| Monk | Landslide 1/1/0 · Cuts 8/5/2 · Bonfire 2/2/0 · Snap 2/3/1 · Storm 4/3/1 · Hunt 3/6/1 · Toll 3/4/2 · Barrage 1/2/0 · Pact 2/2/0 |
| Assassin | Landslide 1/3/0 · Cuts 9/4/2 · Bonfire 1/1/0 · Snap 2/3/1 · Storm 1/1/0 · Hunt 4/10/4 · Toll 1/1/1 · Barrage 1/1/0 · Pact 3/4/2 |
| Vampire | Landslide 1/1/0 · Cuts 8/3/2 · Bonfire 2/3/0 · Snap 2/3/1 · Storm 2/4/1 · Hunt 1/5/2 · Toll 2/1/0 · Barrage 2/1/1 · Pact 5/7/3 |
| Pyromancer | Landslide 1/1/0 · Cuts 3/1/0 · Bonfire 4/7/1 · Snap 2/5/1 · Storm 3/3/0 · Hunt 1/2/1 · Toll 1/0/0 · Barrage 8/9/5 · Pact 1/2/0 |
| Frostweaver | Landslide 1/1/0 · Cuts 5/2/1 · Bonfire 2/4/0 · Snap 4/6/3 · Storm 2/3/0 · Hunt 1/2/2 · Toll 2/2/0 · Barrage 8/11/6 · Pact 3/4/1 |
| Stormcaller | Landslide 1/1/1 · Cuts 8/4/2 · Bonfire 3/3/0 · Snap 4/5/2 · Storm 5/5/1 · Hunt 1/5/1 · Toll 2/6/1 · Barrage 5/7/2 · Pact 2/3/0 |
| Geomancer | Landslide 7/11/3 · Cuts 3/1/0 · Bonfire 2/1/0 · Snap 1/4/1 · Storm 1/2/0 · Hunt 3/2/2 · Toll 3/4/3 · Barrage 1/1/0 · Pact 0/1/0 |
<!-- classes:end -->

Every class has a first step and a second rung to wear on every road builds.md puts it on. No road's rung sits in one class's kinds alone, so nothing is fenced off.

### How often a run is offered a road's first step

<!-- signs:start -->
| Road | Its sign in the starting three | A first-step piece offered, act I | By act II's end | With its versions and common formations, act I | First steps in the stock | Thinnest route in act I, pieces alone |
| --- | --- | --- | --- | --- | --- | --- |
| Landslide | 67% | 67% | 87% | 90% | 8 pieces in 6 kinds, 1 versions, 1 common formations | Knight, Hoplite, Bard: 62% |
| Thousand Cuts | 77% | 82% | 96% | 92% | 15 pieces in 10 kinds, 1 versions, 2 common formations | Valkyrie, Ranger, Vampire: 78% |
| Bonfire | 57% | 47% | 70% | 99% | 7 pieces in 7 kinds, 3 versions, 2 common formations | Paladin, Monk, Hexer: 41% |
| Cold Snap | 73% | 46% | 69% | 81% | 8 pieces in 8 kinds, 2 versions, 2 common formations | Hexer, Ranger, Geomancer: 42% |
| The Storm | 49% | 51% | 74% | 69% | 7 pieces in 7 kinds, 0 versions, 2 common formations | Valkyrie, Hexer, Bard: 46% |
| The Hunt | 83% | 67% | 87% | 90% | 13 pieces in 11 kinds, 2 versions, 1 common formations | Paladin, Assassin, Stormcaller: 54% |
| The Toll | 54% | 60% | 83% | 73% | 11 pieces in 8 kinds, 1 versions, 1 common formations | Monk, Valkyrie, Bard: 52% |
| Barrage | 94% | 67% | 87% | 78% | 12 pieces in 9 kinds, 1 versions, 1 common formations | Cleric, Vampire, Geomancer: 58% |
| Blood Pact | 39% | 60% | 83% | 68% | 11 pieces in 10 kinds, 0 versions, 1 common formations | Vampire, Bard, Hoplite: 54% |
<!-- signs:end -->

- **The sign** is builds.md's: a passive counts as always there, an ability as known one time in three at the start.
- **A first-step piece** is one tagged rung 1 for the road that someone on the roster can wear, for a party on one of the road's three routes.
- **Act I gives enough to read every sign:** a first step sits on a weapon in every road (the slot act I always fills), in a version for seven roads (a passive's, always trainable, for three), and in a common formation for all nine.
- **Flagged: the three status roads that aren't Bleed's.** Bonfire, Cold Snap and the Storm are offered a first-step piece in about half of act I's, against six in ten or more for the others. Their riders are spread over many kinds, but each party can wear only a few of them. With their versions and formations every road reaches two in three or better.
- **Flagged: Blood Pact and the Storm are shown least.** Blood Pact's sign is in two starting parties in five as a kit (the Vampire alone), and the loot covers it: Lifesteal is a common on the amulet and in five kinds. The Storm's is in half, and neither has a first step in a version.

### How often a run is offered an engine's keystone

<!-- engines:start -->
| Engine | Its keystone, and where | A keystone piece offered to a roster that can wear it: act I, by II, by III | Its common half |
| --- | --- | --- | --- |
| detonation | Rubble plate (plate, rare); Second skin (round shield, rare); Shatterstone charm (amulet, rare); Rampart (version: Geomancer, Earthen shell B) | 22%, 41%, 54% | 18 parts, 9 of them uncommons or common formations |
| frozen gate | Frostward blade (rune sword, rare); Hoarfrost plate (plate, rare); Toll gate (formation, rare: 36% by II); Frost armor (version: Frostweaver, Blizzard A) | 14%, 28%, 38% | 7 parts, 3 of them uncommons or common formations |
| mirror | Thornheart plate (plate, legendary); Mirror shield (kite shield, rare); Hoplon (round shield, rare); The last wall (mythic: Hoplite) | 19%, 37%, 49% | 11 parts, 7 of them uncommons or common formations |
| goad | Provoking blade (sword, rare); Goading totem (totem, rare) | 7%, 13%, 19% | 15 parts, 7 of them uncommons or common formations |
| held charge | Stormbrand (sword, legendary); Thunderhead maul (great weapon, rare); Lightning-glass (amulet, rare); Eye of the storm (formation, legendary: 9% by II); Thunderclap (version: Valkyrie, Skyfall A); Stormspear (mythic: Valkyrie) | 26%, 47%, 60% | 9 parts, 5 of them uncommons or common formations |
| reckoning | Grudgebearer (hammer, rare); The anvil (plate, legendary); Hammer and anvil (formation, rare: 36% by II) | 17%, 31%, 43% | 4 parts, 3 of them uncommons or common formations |
| reaping | Bounty charm (amulet, rare); Coup de grâce (version: Assassin, Backstab A) | 8%, 17%, 24% | 7 parts, 2 of them uncommons or common formations |
| judge's drum | Pack leader's coat (leather, rare); Hunting horn (horn, rare); Open season (formation, legendary: 9% by II); Swift justice (version: Paladin, Condemn B) | 13%, 24%, 34% | 6 parts, 3 of them uncommons or common formations |
| opening again | Overture coat (leather, rare); Second dawn (amulet, legendary) | 15%, 30%, 42% | 20 parts, 16 of them uncommons or common formations |
| fuse | Wick (lantern, rare); Smouldering orb (orb, rare); Ember heart (amulet, rare); Pyre line (formation, rare: 36% by II) | 17%, 32%, 43% | 0 parts, 0 of them uncommons or common formations |
| avalanche | Overkill axe (axe, rare); Overrun (great weapon, rare); Downhill charm (amulet, legendary) | 16%, 31%, 43% | 2 parts, 2 of them uncommons or common formations |
| spell on the swing | Baton (wand, legendary); Bell of the hour (bell, rare); Metronome (mythic: Bard) | 14%, 27%, 38% | 2 parts, 2 of them uncommons or common formations |
| red rain | in the kits | no piece | 19 parts, 5 of them uncommons or common formations |
| riposte | Parrying spear (spear, rare); Duelist's leathers (leather, rare); Tempest cloak (cloak, rare) | 17%, 32%, 43% | 12 parts, 7 of them uncommons or common formations |
| every colour | Wildmagic wand (wand, legendary); Grimoire of plagues (tome, rare); Plague (version: Hexer, Malison A) | 11%, 21%, 30% | 13 parts, 8 of them uncommons or common formations |
| lead's colour | Mimic wand (wand, rare); The standard (formation, common: 32% by II) | 8%, 15%, 21% | 18 parts, 14 of them uncommons or common formations |
| emptied quiver | Quick draw (version: Ranger, Hunter's eye B) | no piece | 7 parts, 1 of them uncommons or common formations |
| blood mage | Flagellant's vestments (robes, rare); The covenant (formation, legendary: 9% by II) | 6%, 12%, 18% | 6 parts, 2 of them uncommons or common formations |
| resonance | Resonant robes (robes, rare); Storm front (formation, rare: 36% by II) | 6%, 13%, 18% | 4 parts, 1 of them uncommons or common formations |
| crescendo | Orb of the rising sun (orb, legendary); Crescendo charm (amulet, rare) | 13%, 25%, 35% | 8 parts, 1 of them uncommons or common formations |
| mana as armour | Orb of the deep (orb, rare); Idol of the deep (idol, legendary) | 7%, 14%, 20% | 13 parts, 7 of them uncommons or common formations |
| shatter bell | Frozen tome (tome, legendary); Floe charm (amulet, rare); Icefall (formation, rare: 36% by II) | 13%, 26%, 36% | 1 parts, 0 of them uncommons or common formations |
| firecracker | Winter's chain (rune sword, rare); Frostwalker's furs (leather, rare); The long winter (formation, legendary: 9% by II); Splinters (version: Frostweaver, Shatterpoint B); Glacier's heart (mythic: Frostweaver) | 11%, 22%, 31% | 3 parts, 1 of them uncommons or common formations |
| brink | Bloodletter (sword, rare); Flagellant's vestments (robes, rare); Heart of the saint (relic, legendary); Blood vial (vial, rare); Bloodlust draught (vial, rare); Halved heart (amulet, rare); Blood oath (formation, rare: 36% by II); The chalice (mythic: Vampire) | 26%, 48%, 62% | 26 parts, 10 of them uncommons or common formations |
| two in the dark | Shadow cloak (cloak, rare); Shroud charm (amulet, rare); Decoy (formation, rare: 36% by II); Smoke screen (version: Assassin, Vanish A) | 14%, 27%, 37% | 9 parts, 3 of them uncommons or common formations |
| red stone | Red stone mail (mail, rare); Phylactery (relic, rare); Blood oath (formation, rare: 36% by II) | 13%, 26%, 35% | 2 parts, 1 of them uncommons or common formations |
| borrowed gift | Twin-knot (amulet, legendary); Twins (formation, legendary: 9% by II) | 8%, 17%, 25% | 0 parts, 0 of them uncommons or common formations |
| carrier | Carrier's coat (leather, legendary) | 17%, 33%, 46% | 2 parts, 0 of them uncommons or common formations |
<!-- engines:end -->

- **Keystones in more than one place:** twenty-five of the twenty-eight, counting pieces, seats, versions and mythics. The red rain's is in the kits.
- **One place:** the emptied quiver's keystone is Quick draw, one version on one class, as builds.md wrote it; a second would copy the version. The carrier's is one legendary.
- **Every common half is close at hand,** in uncommons, common formations or the kits. The fuse's, the shatter bell's and the borrowed gift's are in the kits alone, as builds.md has them.
- **A keystone piece is rarely offered.** To a roster that can wear it, some keystone piece of a given engine is offered in about one act I in seven, and in about a third of full runs. To a party on the engine's own road it's a fifth of act I's and under half of full runs. That's the offer roll, not the stock: a roll picks a slot, a class, a kind and then one piece of two to five.
- **The places that are met are the versions and the common formations.** A version is on offer every time its class trains, once its ability is known: the code offers every open training, where `docs/rules.md` says a training offers three choices. Nine engines have a keystone in a version, and are met by nearly every run that fields that class and trains it. At three choices it would be about three trainings in eight.
- **Met least:** the resonance, mana as armour, the goad and the blood mage, with two or three places and no version; and the borrowed gift, whose two places are both legendary.

### Every door has pieces both sides want

| Door | Pieces both sides want |
| --- | --- |
| Any status road into another | Tinder charm, The standard, Mimic wand, Banked robe, Festering idol, Hexweave mail, Grimoire of plagues, Chain wand |
| Thousand Cuts into the Hunt | Marking knife, Bloodscent knife, Weeping kris, Second thrust, Hunting spear, Dragon's tooth |
| Thousand Cuts into Blood Pact | Red stone mail, Crimson dregs, Lamprey claws, Tithing leathers, Gorged claws, Tallymail, Heartsblood, Bloodied ground |
| Thousand Cuts into Barrage | Bell of the hour, Baton, Tireless bell, Forked knuckles, Dancer's cloak |
| The Toll into Thousand Cuts | Briar totem, Oathkeeper, Duelist's leathers, Parrying spear, Tempest cloak, Matador's cape, Toll gate |
| The Toll into Cold Snap | Hoarfrost plate, Frostward blade, Frost armor, Provoking blade, Toll gate |
| The Toll into Landslide | Mirror shield, Hoplon, Grudgebearer, The anvil, Mountainfall, Thornheart plate, Hammer and anvil |
| The Toll into the Storm | Goading totem, Provoking blade, Static mail, Thunderhead totem, Storm front |
| The Toll into Blood Pact | Halved heart, Mender's mace, Penitent's mace, Watch horn, Aegis mail, Oathbound shield, Thorn hedge |
| The Storm into Cold Snap | Bellringer, Chain wand, Lightning-glass, Thunderhead maul, Glacier blade, Banked robe |
| The Storm into the Hunt | Long spear, Squall lance, Oathkeeper, Last page, Stormspear |
| The Hunt into Bonfire | Wick, Ember heart, Pack leader's coat, Hunting horn, Writ of judgement, Pyre line |
| Landslide into Cold Snap | Icebreaker, Floe charm, Frozen tome, Vulture's skull, Still hand, Worldbreaker, Icefall |
| Landslide into Barrage | Reveille, Twice-told tome, Floe charm, Frozen tome, Rubato, Reprise |
| Landslide into the Hunt | Roaring greataxe, Giantsbane, Overrun, Downhill charm, Hunting horn, Harvest scythe, Headsman's axe, Heavy line |
| Barrage into Bonfire, the Storm or Cold Snap | Resonant robes, Staff of echoes, Evensong staff, Meltwater orb, Kindled robes, Storm front |
| Blood Pact into Barrage | Flagellant's vestments, Idol of the blood-well, The chalice, Orb of the deep, Idol of the deep, The covenant |
| Blood Pact into Landslide | Mountainfall, Bloodletter, Saint's mace, Cornerstone hammer, Blood oath |

### Exotics, and the elements

- **Exotics that belong to no road:** fourteen, about one in thirteen of the rares, legendaries and formations: Wildmagic wand, Carrier's coat, Motley robe, Lodestone shield, Idol of the hungry dark, Tireless bell, Shadow cloak, Twin-knot, Scapegoat charm, Burning heart, Gambler's coin, Turncoat charm, The wheel, Twins.
- **The net** (falls and returns) is about a dozen pieces and one formation, sized as protection, and none wants a fall: a unit that stands back up under cover (Phoenix ember, Swan's grace, Last bastion), the fallen brought back between fights (Lamp of vigil), the returned kept up (Vestments of return, Shield of the chosen, Vigil), and cover for whoever drops low (Holdfast, Warded mail, Feathered cloak, Mottled hide, Shroud charm, Aegis mail).
- **The first move:** First light, Reveille, Scrying orb, Horn of the charge, Ready stance, and each road's own opener.
- **Stopping a cast** is an answer, and two identities live on it (the Hexer's spellbreaker, the Frostweaver's disabler). Their versions wait for a wind-up; the loot gives them pieces that don't wait: Marginalia aims a caster's abilities at whoever is casting, Hushing idol answers each cast begun with a strike, and Quiet robes and Warding bell are the party's own answer to a Silence.
- **Foes that do less** is five pieces, none of them a road's step.

## Open for the director

Not ruled at gate 1. None of these stops the fill, which writes to the spine as it stands; each is a line or two to change if the director rules the other way.

- **How loot is offered.** `loot.md` says the designer's tags aim drops; the offer roll doesn't use them. Aiming one offer of each fight's three at what the party already does would take a keystone, for a party on its road, from a fifth of act I's to nearly three in ten and from under half of full runs to nearly six in ten, and a road's first-step piece to about nine in ten in act I. It's the rogue mode's rule: a line for the build's brief.
- **The counts.** 322 pieces against today's 272, and 35 formations against 32. The place to cut, if it's too much, is the uncommons, and the status roads' first steps pay for it.
- **The four bends** under *The rules the pieces bend or add*: riders as uncommons, two swing shapes as uncommons, "all fight", and the last drink.
- **The loop rules, added after the gate.** A second fresh read found chains with no brake. The director ruled on the cold chain (*Ruled*, above). The spine ends the others by a rule said once each: a repeat isn't repeated; a redirect is final; a fallen foe's fire moves once; "at once" doesn't stack.
- **The mirror reads two ways in builds.md:** a share of the whole blow, or exactly what the wall's cover stopped. The spine has pieces of each.
- **Swift justice and Hunting horn** both bring the party's weapons down together when a Marked foe falls: the version by readying Condemn again, the horn by calling the swings. Kept as different enough; worth the director's eye.
- **Three places where the documents and the game differ:** `docs/rules.md` says a training offers three choices and the code offers everything; `loot.md` says later acts roll more rares and every act's fights roll on one table; `classes.md` names a Hexer version, Culmination, that the content calls Expose.
- **Marked's length** (`STATUS.marked`) is under half the time a Mark's foe takes to fall. The balance pass's.

## Least sure

- **The stock's shape.** 322 pieces is nearly a fifth more to write, build and tune than today. Whether a run can tell 93 uncommons apart is a question for play.
- **Riders as uncommons.** It makes a status road's first step an easy find, which is the point, and it means a third of the weapon uncommons read alike. Three plain riders on the fist weapons is the plainest case.
- **Tinder charm and The standard** make any party's second feeder without a second source. They may make the four status roads feel like one. Tinder charm is also the hardest uncommon to read.
- **Keystones at rare.** About two dozen legendary effects moved down. If rares come to feel like the legendaries did, the far ends have less room above them.
- **The wide hits.** Five rares fan a swing out and carry what it carries. Their promise is still more foes, the promise play never took.
- **Heat as speed.** Speed feeds every status road at once. The Bonfire far end, the Hunt's kill counter and the dancer's dodge all build it.
- **The Toll is over-served.** It sits on the most doors, so it has the most second rungs, and builds.md calls it the road that least needs them.
- **The party-rule formations.** Five legendary formations and First light are a rule for the party with three plain seats. Play fought in formations whose seats had roles.
- **The cathedral and The chalice** are the boldest lines: a spell with no cooldown, and one unit paying for the party's casts. Bloodstone reliquary beside The chalice gives much of that price back.
- **Aegis mail** on the brink may be a unit that can't fall, as builds.md already fears.
- **The goad** is still a piece that speeds the foes up, and Provoking blade does it with every swing.
- **Goading totem on a Stormcaller** does nothing without a Taunt from its amulet. **The standard's Followers and Toll gate's Collectors** do nothing behind a unit whose swing carries nothing.
- **Loops.** The fill checks every share for them, and its lead checks across shares. The ones known, each with what stops it:
  - **The emptied quiver** (the crit that fails) and **the resonance** (a pack that thins, a pool that empties): builds.md's own.
  - **Provoking blade with Tempest cloak:** the foe swings, the dodge answers with a basic attack, and that calls the foe again. The dodge that fails.
  - **Matador's cape, a copied Taunt (Twins, Twin-knot) and Goading totem:** a dodge, a Taunt, every foe swings, a dodge. A round with no dodge, which is weak against a pack.
  - **Writ of judgement with Swift justice:** each Condemn is a heavy blow, and a kill readies the next. Its mana and its wind-up. A Mark from gear or a seat doesn't call the blow: with a free marker the chain ran through a pack at no cost.
  - **The resonance and The cathedral with their mana price gone** (The deep well under Clarity, Flagellant's vestments with Lifesteal, The chalice): wind-up and recovery are all that's left.
  - **Floe charm with Meltwater orb on a Frostweaver:** Blizzard, a shatter, and Blizzard is ready and paid for. Its wind-up, and the cold running short.
  - **Shroud charm or Aegis mail on a unit that pays a price:** each crossing of a third fires it again. Healing back over the line.
  - **The kill chains** (Second dawn, Overture coat, Coup de grâce, Bounty charm, Overrun, Pack leader's coat, Hunting horn, Open season, Last page): the foes run out.
- **Alike, to a fresh reader, and left as they are** by the director's ruling that "the same" is the same sentence. The fill's lead watches each as the cards are written, since two cards can come out as one sentence where two lines didn't.
  - **Worn together:** Mirror shield and Thornheart plate; Duelist's leathers, Tempest cloak and Parrying spear; Overture coat and Second dawn; Thunderhead maul and Lightning-glass; Wick and Ember heart; Floe charm and Frozen tome; Crescendo charm and Orb of the rising sun; Overrun and Downhill charm; Holdfast and Bear fetish.
  - **A version near a piece:** Swift justice and Hunting horn; Shared feast and Heartsblood; Blood for mana and Idol of the blood-well; Forked arc and Forked knuckles; From the shadows and Shadow mantle; Opening wound and Weeping kris; Rampart and Second skin; Battle prayer and Saint's mace; Static field and Static mail; Harmony beside Mercy's edge and Tithe wand.
  - **A mythic near a piece:** Night's edge and Shadow cloak; Eye of the tempest and Forked knuckles; Mountain's crown and Mason's hammer.
- **Damage sent back is untyped,** as Thorns is, so six pieces deal damage Defense doesn't touch (Mirror shield, Hoplon, Thornheart plate, Rubble plate, Shatterstone charm, Reprisal hauberk). builds.md's mirror asks for it; it's a second way past Defense beside the statuses.
- **Last page** fells a foe below a tenth of its HP whatever Shield or Aegis it holds.
- **Three pieces act on a beat** (Mender's mace, Comrade's targe, Warding bell). "Every so often" is today's word, and each is an ability in all but name.
- **Orb of the rising sun** alone is a spell that grows at no price: the crescendo with nothing to skip.
- **Idol of the blood-well** pays out only for a holder with a price of its own (the Vampire's kit, Bloodletter on a Hexer), and under The covenant its mana is worth nothing.
- **Overture coat** has little to fire again on a Monk or a Valkyrie, whose other slots hold few start-of-fight pieces.
- **The versions barely change:** nine of 128. The earlier versions were split toward identities the nine roads use, and each was checked against its road. It may also mean they were read too kindly.
