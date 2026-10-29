# Step 5i: the gear slots

Oct 29, 2026. A proposal for your gate, from `gear-brief.md`. It covers who shares which kinds of loot in the rogue's four slots, and nothing about pieces. `npx tsx src/gear-slots.ts` recounts the widths and overlaps from the tables; the "Found" figures came from a quick simulation of offers.

## Decisions for you

1. **The shape.** Armor groups classes by weight. Weapons and offhands cut across those groups. So no two classes share more than two kinds of loot, and every class shares at least one kind with five to eleven others.
2. **Two-handed weapons: yes,** for the two slow kinds (the great weapon and the staff). A two-hander empties the offhand slot, so its pieces are designed to be worth a weapon and an offhand. Nine classes have one, as an option: every class also has a one-handed kind.
3. **Magical damage belongs to the kind,** like speed. The seven elemental staves become four magical kinds: wand, rod, sceptre and staff. Classes that fight both ways carry one magical kind beside a physical one.
4. **Offhands: eleven kinds of two classes each,** each pair from different armor groups and alike in one behaviour.
5. **The amulet stays open to everyone.** That's acceptable with two limits: amulets come less often than the other slots, and an amulet never names one class's ability.
6. **Mythic: one class each,** in any slot. A unit wears one at most. One per class to start, offered in act II and III boss boons.
7. **One change to the armor draft:** the Paladin wears Mail only. With Plate as well, three quarters of the Knight's loot would be the Paladin's.

## The numbers

| Slot | Kinds | Classes per kind | Kinds per class | Other wearers of a piece in a roster of five |
| --- | --- | --- | --- | --- |
| Weapon | 10 (13 today) | 2 to 5, average 3.3 | 2 to 3 | 0.6 |
| Armor | 4 | 4 to 6 | 1 to 2 | 1.0 |
| Offhand | 11 | 2 | 1 to 2 | 0.3 |
| Amulet | 1 | all 16 | 1 | 4 |

The ranges I set and held:
- **A kind touches two to five classes.** One class would be a bespoke pool that's dead whenever that class sits out. Past five, a piece can't be checked against every kit it lands on.
- **Two classes share at most two kinds.** Of the 120 pairs, 54 share nothing, 40 share one kind, 26 share two, and none share three. No class has more than half its kinds inside another class's.
- **Apart where it counts.** 60% of the pairs of kinds from different slots never meet on one unit, so pieces in them can be strong together without ever stacking.
- **Build parties.** The 36 routes in `builds.md` mostly have one to three kinds that two members can both wear: a found piece often has a second home, and each member's loot is still mostly its own.
- **Found.** Suppose a run sees about 110 pieces: 5h's volumes, raised a third for the fourth slot. Each fighter then sees about half of what it can wear: about 7 of its 16 weapons, 6 or 7 of its 14 armors, 4 of its 8 offhands and 12 to 14 of 24 amulets. Variety between runs comes from the stock, and findability from the offer count.

## Weapons

A kind has a speed, a damage type and a number of hands, and nothing else. Every piece fits exactly its kind's classes.

| Kind | Speed | Damage | Hands | Classes |
| --- | --- | --- | --- | --- |
| Dagger | fast | physical | one | Assassin, Ranger |
| Fist weapons | fast | physical | one | Monk, Vampire |
| Sword | medium | physical | one | Knight, Bramble knight, Assassin |
| Spear | medium | physical | one | Hoplite, Valkyrie, Monk |
| Bow | medium | physical | one | Ranger, Bard |
| Great weapon (axe, hammer, pike, scythe) | slow | physical | two | Knight, Hoplite, Paladin, Geomancer, Vampire |
| Wand | fast | magical | one | Pyromancer, Hexer, Stormcaller, Bard |
| Rod | medium | magical | one | Frostweaver, Hexer, Geomancer |
| Sceptre | medium | magical | one | Cleric, Stormcaller, Paladin, Valkyrie |
| Staff | slow | magical | two | Cleric, Frostweaver, Pyromancer, Geomancer, Bramble knight |

- **Variety within a class:** every class's kinds differ in speed, damage or hands, so its weapon is a real choice.
  - The Knight: a sword with a shield, or a two-hander.
  - The Paladin: a great weapon, or a sceptre with a shield or lantern.
  - The Valkyrie: a spear, or a sceptre that hits with magic.
  - The Hoplite: its spear, or a pike that Phalanx makes the slowest, biggest blow in the game.
- **Variety between classes:** the 16 classes have 11 different patterns. Four patterns repeat:
  - the Knight and Hoplite;
  - the Ranger, Monk and Assassin;
  - the Hexer and Stormcaller;
  - the Cleric and Frostweaver.

  No two of these classes hold the same pair of kinds.
- **Builds' reach:** nine classes can go slow (Landslide), and eight can go fast (Thousand Cuts, Cold Snap's frost seats).
- **What moved from today:**
  - The Hoplite trades its sword for the great weapon.
  - The Paladin trades its sword for the great weapon.
  - The Valkyrie loses its sword.
  - The Vampire trades its sword and Dark staff for the great weapon.
  - The Bard loses its dagger.
  - The Frostweaver and Stormcaller each lose one of their two fast staves.
  - Every staff becomes one of the four magical kinds.

**Magical damage.** I looked at three ways:
- **On any weapon, piece by piece:** rejected. A magical sword in the sword pool is a dead offer for the Knight and the Assassin (Magic 1), so every pool would carry pieces half its wearers can't use.
- **A magical twin of every physical kind:** rejected. It doubles the kinds, for the five classes that fight both ways.
- **The kind decides, and the casters' kinds are just kinds:** what I propose. They differ the way the physical ones do (speed, hands, who holds them), and none has an element.
  - The five pure casters each hold a different pair from the four magical kinds, so no two casters share more than one.
  - The three whose basic attacks carry a status (Pyromancer, Hexer, Stormcaller) all keep a fast wand.
  - Scaling stays: physical kinds from Attack, magical from Magic, unless a piece names another stat.

**Two-handers.** I think they're a meaningful pattern, for three reasons:
- They make the slow kinds a choice of gear shape (three pieces or four), not just a speed.
- They keep a big weapon's effect apart from every offhand by rule.
- They read at a glance.

The cost is one rule, and every two-handed piece has to be designed worth two.

## Armor

| Type | Classes (second type in brackets) |
| --- | --- |
| Plate | Knight, Hoplite, Geomancer, Bramble knight |
| Mail | Paladin, Valkyrie, Vampire, (Bramble knight) |
| Leather | Ranger, Monk, Assassin, Bard, (Valkyrie) |
| Robes | Cleric, Hexer, Pyromancer, Frostweaver, Stormcaller, (Bard) |

This is the draft you liked, without the Paladin's Plate. Types replace weights: a class wears only its types, and today's "or anything lighter" goes. Robes, at six, is the widest pool. It holds because the casters are the most alike group, and their weapons and offhands keep them apart.

## Offhands

| Kind | Classes | What the pair has in common |
| --- | --- | --- |
| Kite shield | Knight, Paladin | shelter for the party (Fortify, Sanctuary) |
| Round shield | Hoplite, Valkyrie | spear fighters who cover an ally (Aspis, Rally) |
| Horn | Knight, Bard | both hand an ally mana (Stand fast, Refrain) |
| Tome | Frostweaver, Bard | both work on the whole field at once (Stillness and Blizzard, the songs and Thunder chord) |
| Lantern | Paladin, Pyromancer | Burn (Smite, Kindling) |
| Relic | Cleric, Valkyrie | the two revivers |
| Bell | Monk, Cleric | their own tempo (Flow, Last rites) |
| Totem | Bramble knight, Ranger | Bleed (Briar, Barbed arrow) |
| Knife | Assassin, Vampire | hits that pay (crits that bleed, Lifesteal) |
| Idol | Hexer, Vampire | Weaken (Enfeeble, Blood drain) |
| Orb | Geomancer, Stormcaller | each powers itself up (a Shield that doubles its crits, Haste) |

No offhand pairs two classes that already share two kinds, so no two classes reach three. Ten of the eleven pairs come from different armor groups; the Tome's two share Robes, the Bard's second. What a pair has in common is why its pieces can lean on both kits; a piece can still be anything.

## The amulet

It stays open to everyone, which I think is acceptable:
- **Readable:** jewellery fits anyone.
- **Never dead:** a run that swaps members keeps its amulets.
- **The chaos lives here:** it's the one slot where any piece can meet any class.
- **One build needs it:** Thousand Cuts' three routes share no kind, so only the amulet reaches all of them. Every other build has kinds that each of its routes can wear.

What keeps it from becoming the rule slot again (17 of today's 29 rule pieces are amulets):
- **Every other slot now has narrow kinds,** so a piece for a few classes has a better home.
- **Amulets come less often:** about 15% of gear offers.
- **An amulet never names one class's ability.** It names what any unit can have or do: a status, a stat, a kill, a fall, the fight's start. It's dead on fifteen classes and a signpost otherwise.

## Mythic

- **What it is:** a piece that reaches into one class's kit (its passive or an ability). A legendary bends the game for whoever wears it; a mythic rewrites a class.
- **Classes and slots:** it fits exactly one class and can sit in any slot. A mythic weapon has its own speed, damage and hands, even outside the class's kinds. A unit wears one mythic at most.
- **Do we need it?** Yes. It's the only class-unique loot. The kinds share every piece between two and five classes on purpose, and mythics give each class a far end of its own without making the pools bespoke.
- **How many:** one per class to start (16), each pulling toward one of the class's builds. A second per class can come later.

## Each class

What it can wear, with the other classes that share each kind.

| Class | Kinds | Weapons | Armor | Offhand | Shares with |
| --- | --- | --- | --- | --- | --- |
| Knight | 5 | Sword (Bramble knight, Assassin); Great weapon (Hoplite, Paladin, Geomancer, Vampire) | Plate (Hoplite, Geomancer, Bramble knight) | Kite shield (Paladin); Horn (Bard) | 7 |
| Cleric | 5 | Sceptre (Stormcaller, Paladin, Valkyrie); Staff (Frostweaver, Pyromancer, Geomancer, Bramble knight) | Robes (Hexer, Pyromancer, Frostweaver, Stormcaller, Bard) | Relic (Valkyrie); Bell (Monk) | 10 |
| Ranger | 4 | Dagger (Assassin); Bow (Bard) | Leather (Monk, Assassin, Bard, Valkyrie) | Totem (Bramble knight) | 5 |
| Bramble knight | 5 | Sword (Knight, Assassin); Staff (Cleric, Frostweaver, Pyromancer, Geomancer) | Plate (Knight, Hoplite, Geomancer); Mail (Paladin, Valkyrie, Vampire) | Totem (Ranger) | 11 |
| Hoplite | 4 | Spear (Valkyrie, Monk); Great weapon (Knight, Paladin, Geomancer, Vampire) | Plate (Knight, Geomancer, Bramble knight) | Round shield (Valkyrie) | 7 |
| Paladin | 5 | Great weapon (Knight, Hoplite, Geomancer, Vampire); Sceptre (Cleric, Stormcaller, Valkyrie) | Mail (Valkyrie, Vampire, Bramble knight) | Kite shield (Knight); Lantern (Pyromancer) | 9 |
| Valkyrie | 6 | Spear (Hoplite, Monk); Sceptre (Cleric, Stormcaller, Paladin) | Mail (Paladin, Vampire, Bramble knight); Leather (Ranger, Monk, Assassin, Bard) | Round shield (Hoplite); Relic (Cleric) | 10 |
| Bard | 6 | Bow (Ranger); Wand (Pyromancer, Hexer, Stormcaller) | Leather (Ranger, Monk, Assassin, Valkyrie); Robes (Cleric, Hexer, Pyromancer, Frostweaver, Stormcaller) | Horn (Knight); Tome (Frostweaver) | 10 |
| Hexer | 4 | Wand (Pyromancer, Stormcaller, Bard); Rod (Frostweaver, Geomancer) | Robes (Cleric, Pyromancer, Frostweaver, Stormcaller, Bard) | Idol (Vampire) | 7 |
| Monk | 4 | Fist weapons (Vampire); Spear (Hoplite, Valkyrie) | Leather (Ranger, Assassin, Bard, Valkyrie) | Bell (Cleric) | 7 |
| Assassin | 4 | Dagger (Ranger); Sword (Knight, Bramble knight) | Leather (Ranger, Monk, Bard, Valkyrie) | Knife (Vampire) | 7 |
| Vampire | 5 | Fist weapons (Monk); Great weapon (Knight, Hoplite, Paladin, Geomancer) | Mail (Paladin, Valkyrie, Bramble knight) | Idol (Hexer); Knife (Assassin) | 9 |
| Pyromancer | 4 | Wand (Hexer, Stormcaller, Bard); Staff (Cleric, Frostweaver, Geomancer, Bramble knight) | Robes (Cleric, Hexer, Frostweaver, Stormcaller, Bard) | Lantern (Paladin) | 8 |
| Frostweaver | 4 | Rod (Hexer, Geomancer); Staff (Cleric, Pyromancer, Geomancer, Bramble knight) | Robes (Cleric, Hexer, Pyromancer, Stormcaller, Bard) | Tome (Bard) | 7 |
| Stormcaller | 4 | Wand (Pyromancer, Hexer, Bard); Sceptre (Cleric, Paladin, Valkyrie) | Robes (Cleric, Hexer, Pyromancer, Frostweaver, Bard) | Orb (Geomancer) | 8 |
| Geomancer | 5 | Great weapon (Knight, Hoplite, Paladin, Vampire); Rod (Frostweaver, Hexer); Staff (Cleric, Frostweaver, Pyromancer, Bramble knight) | Plate (Knight, Hoplite, Bramble knight) | Orb (Stormcaller) | 10 |

Every class can also wear every amulet. "Shares with" counts the other classes that share at least one of its kinds, not counting amulets.

## What it asks

- **Schema:**
  - an `offhand` slot, so four slots on every unit;
  - weapon kinds with a speed, a damage type and hands, and no element or subtype (the cleanup step);
  - four armor types in place of three weights;
  - offhand kinds, with each class listing its kinds in every slot;
  - a mythic rarity that names one class;
  - a rule that a two-hander empties the offhand.
- **Interface:**
  - a fourth slot on the party screen, the sheets and the cards, with the offhand shown locked under a two-hander;
  - a colour for mythics;
  - sprites for the great weapon, wand, rod and sceptre and for eleven offhands. Today's packs may not have the offhands: is that art yours to find, or should I look?
- **5h's loot numbers:**
  - **Volume:** seats grow by a third (12 on the fighters), so about 37 pieces taken and 110 seen a run.
  - **Offers:** each offer picks a slot first (weapons and offhands 30% each, armor 25%, amulets 15%), then a class as 5h does now, then a kind that class wears.
  - **Stock to start:** 8 pieces a weapon kind, 12 an armor type, 6 an offhand kind and 24 amulets, about 200 in all (today's rogue has about 120), plus 16 mythics.

## What I'm least sure of

1. **Two-handers.** Can one piece be worth two without being either dead or mandatory? Step 4's test parties will show it.
2. **The amulet's limits:** whether fewer offers and "no class abilities" keep it from filling up with rules again.
3. **Pairings that rest more on theme than behaviour:**
   - the Orb (Geomancer, Stormcaller);
   - at a glance, the Stormcaller's sceptre, the Bard's wand, the Vampire's great weapon and the Bramble knight's staff (at Magic 2, a weak option).
4. **The offhand pools are small.** Eleven kinds of six pieces, each for two classes: enough variety for a pair, or too thin?
5. **The Hoplite's pike.** Phalanx halves its swings, so it lands once or twice a regular fight: Landslide's far end, or a trap.
6. **The Paladin without Plate.** It changes a draft you liked.
