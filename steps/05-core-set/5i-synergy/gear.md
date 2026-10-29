# Step 5i: the gear slots

Oct 29, 2026. A proposal for your gate, from `gear-brief.md`. It covers who shares which kinds of loot in the rogue's four slots, and nothing about pieces.
- `npx tsx src/gear-slots.ts` recounts the widths and overlaps from the tables.
- The "Found" figures came from a quick simulation of offers.
- A fresh reader checked it, and its points are folded in.

## Decisions for you

1. **The shape.** Armor groups classes by weight. Weapons and offhands cut across those groups, so every class shares at least one kind with five to eleven others.
2. **A cap: two classes share at most two kinds.** This is my rule, not yours. It keeps every class's loot its own, and it costs two things:
   - **The Paladin's Plate second (from the draft you liked).** With it, the Knight and Paladin would share the great weapon, Plate and the kite shield.
   - **The Bard's dagger (from today).** With it, the Bard and Ranger would share the dagger, the bow and Leather.

   The alternative is to allow those two pairs at three and keep both.
3. **Two-handed weapons: yes,** for the great weapon, the bow and the staff. A two-hander empties the offhand slot, so its pieces are designed to be worth a weapon and an offhand. Eleven classes have one, and every class also has a one-handed kind.
4. **Magical damage belongs to the kind,** like speed. The seven elemental staves become four magical kinds: wand, rod, sceptre and staff. Classes that fight both ways carry one magical kind beside a physical one.
5. **Offhands: eleven kinds of two classes each.** Ten of the eleven pairs come from different armor groups.
6. **The amulet stays open to everyone.** I think that's acceptable, and no amulet names one class's ability.
7. **Mythic: one class each,** in any slot. A unit wears one at most. One per class to start, offered in act II and III boss boons.

## The numbers

| Slot | Kinds | Classes per kind | Kinds per class | Other wearers of a piece in a roster of five |
| --- | --- | --- | --- | --- |
| Weapon | 10 (13 today) | 2 to 5, average 3.3 | 2 to 3 | 0.6 |
| Armor | 4 | 4 to 6 | 1 to 2 | 1.0 |
| Offhand | 11 | 2 | 1 to 2 | 0.3 |
| Amulet | 1 | all 16 | 1 | 4 |

The last column answers one question: when a piece drops for one member of a five-class roster, how many of the other four can wear it too, on average?

The ranges I set and held:
- **A kind touches two to five classes.** One class would be a bespoke pool that's dead whenever that class sits out. Past five, a piece can't be checked against every kit it lands on.
- **Two classes share at most two kinds.**
  - Of the 120 pairs, 54 share nothing, 40 share one kind, 26 share two, and none share three.
  - For every class, no other class can wear more than half of its kinds.
- **Apart where it counts.** 61% of the pairs of kinds from different slots never meet on one unit, so pieces in them can be strong together without ever stacking. That counts a two-hander never meeting an offhand; without that rule it's 53%.
- **Build parties.** Most of the 36 routes in `builds.md` have one to three kinds that two members can both wear. A found piece often has a second home, and each member's loot is still mostly its own.
- **Found.** Suppose a run sees about 110 pieces: 5h's volumes, raised a third for the fourth slot. Each fighter then sees about half of what it can wear:
  - about 7 of its 16 to 24 weapons;
  - 7 of its 12 to 24 armors;
  - 5 of its 8 to 16 offhands;
  - 12 of the 24 amulets.

  Variety between runs comes from the stock, and findability from the number of offers.

## Weapons

A kind has a speed, a damage type and a number of hands, and nothing else. Every piece fits exactly its kind's classes.

| Kind | Speed | Damage | Hands | Classes |
| --- | --- | --- | --- | --- |
| Dagger | fast | physical | one | Assassin, Ranger |
| Fist weapons | fast | physical | one | Monk, Vampire |
| Sword | medium | physical | one | Knight, Bramble knight, Assassin |
| Spear | medium | physical | one | Hoplite, Valkyrie, Monk |
| Bow | medium | physical | two | Ranger, Bard |
| Great weapon (axe, hammer, pike, scythe) | slow | physical | two | Knight, Hoplite, Paladin, Geomancer, Vampire |
| Wand | fast | magical | one | Pyromancer, Hexer, Stormcaller, Bard |
| Rod | medium | magical | one | Frostweaver, Hexer, Geomancer |
| Sceptre | medium | magical | one | Cleric, Stormcaller, Paladin, Valkyrie |
| Staff | slow | magical | two | Cleric, Frostweaver, Pyromancer, Geomancer, Bramble knight |

- **Variety within a class:** every class's kinds differ in speed, damage or hands, so its weapon is a real choice.
  - The Knight: a sword with a shield, or a two-hander.
  - The Ranger: a dagger with a totem, or a bow.
  - The Paladin: a great weapon, or a sceptre with a shield or a lantern.
  - The Valkyrie: a spear, or a sceptre that hits with magic.
  - The Hoplite: its spear and round shield, or a pike that Phalanx makes the slowest, biggest blow in the game.
- **Variety between classes:** the 16 classes have 12 different patterns. Four repeat:
  - the Knight and Hoplite;
  - the Monk and Assassin;
  - the Hexer and Stormcaller;
  - the Cleric and Frostweaver.

  No two of these classes hold the same pair of kinds.
- **Builds' reach:** nine classes can go slow (Landslide), and eight can go fast (Thousand Cuts, Cold Snap's frost seats).
- **What moved from today:**
  - **Physical kinds:**
    - The Hoplite and the Paladin each trade their sword for the great weapon.
    - The Vampire trades its sword and Dark staff for the great weapon.
    - The Valkyrie loses its sword. It would repeat the spear's speed, damage and hands, and the sword pool stays at three.
    - The Bard loses its dagger (the cap). Its fast weapon is now the wand, so in Thousand Cuts' "Monk, Assassin, Bard on daggers and fists" the Bard plays fast with magic.
    - The bow becomes two-handed.
  - **Staves:**
    - The Frostweaver's two fast staves become a medium rod and a slow staff.
    - The Hexer's two fast staves become a fast wand and a medium rod.
    - The Stormcaller's two fast staves become a fast wand and a medium sceptre.
    - The Geomancer's two slow staves become a medium rod and a slow staff.
    - The Pyromancer keeps its fast and slow pair.
    - The Cleric's staff becomes a sceptre at today's speed, with a slow staff beside it.

**Magical damage.** I looked at three ways:
- **On any weapon, piece by piece:** rejected. A magical sword in the sword pool is a dead offer for the Knight and the Assassin (Magic 1), so every pool would carry pieces half its wearers can't use.
- **A magical twin of every physical kind:** rejected. It doubles the kinds, for the five classes that fight both ways.
- **The kind decides, and the casters' kinds are just kinds:** what I propose. None has an element.
  - Like the physical kinds, some differ in speed or hands. The rod and sceptre, like the sword and spear, differ only in who holds them.
  - The five pure casters each hold a different pair from the four magical kinds, so no two casters share more than one.
  - The three whose basic attacks carry a status (Pyromancer, Hexer, Stormcaller) all keep a fast wand.
  - Scaling stays: physical kinds from Attack, magical from Magic, unless a piece names another stat.

**Two-handers.** I think they're a meaningful pattern, for three reasons:
- They make the big kinds and the bow a choice of gear shape (three pieces or four), not just a speed.
- They keep a two-hander's effect apart from every offhand by rule.
- They read at a glance.

The cost is one rule, and every two-handed piece has to be designed worth two.

## Armor

| Type | Classes (second type in brackets) |
| --- | --- |
| Plate | Knight, Hoplite, Geomancer, Bramble knight |
| Mail | Paladin, Valkyrie, Vampire, (Bramble knight) |
| Leather | Ranger, Monk, Assassin, Bard, (Valkyrie) |
| Robes | Cleric, Hexer, Pyromancer, Frostweaver, Stormcaller, (Bard) |

This is the draft you liked, without the Paladin's Plate (decision 2). Types replace weights: a class wears only its types, and today's "or anything lighter" goes.

**Robes is the tightest group,** and the nearest to "everything must work with everything":
- 12 of its 15 pairs sit at the cap.
- The four wand-holders all wear Robes.

I accept it because the casters are the most alike classes. If it reads muddy in step 4, the first thing to cut is the Bard's Robes second, which frees four capped pairs.

## Offhands

| Kind | Classes | Why these two |
| --- | --- | --- |
| Kite shield | Knight, Paladin | protectors who shelter the party |
| Round shield | Hoplite, Valkyrie | spear fighters who cover an ally |
| Horn | Knight, Bard | both hand an ally mana |
| Tome | Frostweaver, Bard | both work on the whole field at once |
| Lantern | Paladin, Pyromancer | holy light and fire, and both set foes burning |
| Relic | Cleric, Valkyrie | the two revivers |
| Bell | Monk, Cleric | each sets its own tempo |
| Totem | Bramble knight, Ranger | the wild, and both leave foes bleeding |
| Vial | Assassin, Vampire | poison and blood: hits that pay them back |
| Idol | Hexer, Vampire | the dark arts, and both weaken foes |
| Orb | Geomancer, Stormcaller | each powers itself up |

- **No offhand pairs two classes that already share two kinds,** so no pair reaches three.
- **The column says why the two classes are alike,** not what the kind is for. Its pieces can be anything. Step 4 shouldn't make a kind's pieces follow it, or the kind's name becomes the signpost that cards avoid.
- **The stock is eight pieces a kind,** following "better too much than not enough".

## The amulet

It stays open to everyone, which I think is acceptable:
- **Readable:** jewellery fits anyone.
- **Never dead:** a run that swaps members keeps its amulets.
- **Unplanned builds:** it's the one slot where a piece can meet any class.
- **One build needs it:** Thousand Cuts' three routes share no kind, so only the amulet reaches all of them. Every other build has kinds that each of its routes can wear.

Today it's the rule slot: 17 of the 29 rogue rule pieces are amulets. Three things work against that now:
- **Every other slot has narrow kinds,** so a piece meant for a few classes has a better home.
- **Amulets are a small part of the stock and the offers:** about a tenth and 15%. Every amulet fits everyone, though, so a fighter still sees more amulets than anything else (about 12 a run). That's the price of an open slot.
- **No amulet names one class's ability.** It would be dead on fifteen classes and point at the sixteenth.

## Mythic

- **What it is:** a piece that reaches into one class's kit. A legendary bends the game for whoever wears it; a mythic rewrites a class.
- **How it differs from upgrades:** an upgrade is trained. It changes one ability or the passive, in a power step and two versions designed for it. A mythic is found, can be taken off, and goes past any one ability: a rule across the whole kit, or something no version reaches. Step 4 designs both together so they don't overlap.
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
| Assassin | 4 | Dagger (Ranger); Sword (Knight, Bramble knight) | Leather (Ranger, Monk, Bard, Valkyrie) | Vial (Vampire) | 7 |
| Vampire | 5 | Fist weapons (Monk); Great weapon (Knight, Hoplite, Paladin, Geomancer) | Mail (Paladin, Valkyrie, Bramble knight) | Idol (Hexer); Vial (Assassin) | 9 |
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
  - **Stock to start:** 8 pieces a weapon kind, 12 an armor type, 8 an offhand kind and 24 amulets, about 240 in all (today's rogue has about 120), plus 16 mythics.

## What I'm least sure of

1. **Two-handers.** Can one piece be worth two without being either dead or mandatory? Step 4's test parties will show it.
2. **The amulet.** Its limits only hold back how many amulets there are and what they name. A fighter still sees more amulets than anything else, so the design discipline does most of the work.
3. **The Robes knot** (see Armor).
4. **Pairings that rest more on theme than behaviour:**
   - the Orb (Geomancer, Stormcaller);
   - at a glance, the Stormcaller's sceptre, the Bard's wand, the Vampire's great weapon and the Bramble knight's staff (at Magic 2, a weak option).
5. **The Hoplite's pike.** It gives up the round shield the Hoplite is drawn and named with (Aspis), and Phalanx halves its swings to once or twice a regular fight. It could be Landslide's far end, or a trap.
6. **Mythics and upgrades.** Both change a class's kit. If step 4 can't keep them apart, mythics should become something else.
