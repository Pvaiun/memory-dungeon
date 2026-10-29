# Step 5i: the gear slots

Oct 29, 2026. Who shares which kinds of loot in the rogue's four slots; nothing about pieces. This is the second version, after your read.
- `npx tsx src/gear-slots.ts` recounts the widths and overlaps from the tables.
- The "Found" figures came from a quick simulation of offers.

## What your notes changed

1. **The sceptre is now the rune sword,** for the Paladin and the Valkyrie. A rename alone would have put a rune sword in the Cleric's and the Stormcaller's hands, so they moved:
   - the Stormcaller takes the rod;
   - the Cleric takes a **mace** (slow, magical, one hand), shared with the Paladin.
2. **The Hexer is a spellblade:** a rune sword or a dagger, in Mail.
3. **The Geomancer is an earth fighter:** a great weapon or a rune sword, in Plate, with a totem.

   I've assumed both get new kits and stats in the cleanup step: the Geomancer's Tremor off Magic, and perhaps a new name.
4. **What that bought:**
   - **The Paladin's Plate comes back.** It holds its rune sword and mace now, not the great weapon, so it shares only Plate and the kite shield with the Knight.
   - **The Orb is gone.** The Stormcaller joins the Bell (with the Monk and Cleric, each setting its own tempo), and the Geomancer joins the Totem (the wild and the earth).
   - **The cap now costs only the Bard's dagger.**
5. **The Robes knot didn't untie.** It's down from six wearers to five, and from 12 capped pairs to 9. But it's now exactly the four casters plus the Bard, and 9 of their 10 pairs share two kinds: one armor, and weapons drawn from the same few magical kinds. I'd accept it: they're the most alike classes. If it reads muddy when the pieces are made, the first cut is the Bard's Robes second, which frees three pairs.

Settled at your word: two-handers to start, the open amulet (valuable because units switch around), the Hoplite's pike, one mythic per class to start, and you're sourcing the art.

**Still yours to decide:** the cap (two classes share at most two kinds), which costs the Bard its dagger. With the dagger, the Bard and Ranger would share the dagger, the bow and Leather.

## The numbers

| Slot | Kinds | Classes per kind | Kinds per class | Other wearers of a piece in a roster of five |
| --- | --- | --- | --- | --- |
| Weapon | 11 (13 today) | 2 to 4, average 2.9 | 2 | 0.5 |
| Armor | 4 | 5 each | 1 to 2 | 1.1 |
| Offhand | 10 | 2 to 3 | 1 to 2 | 0.3 |
| Amulet | 1 | all 16 | 1 | 4 |

The last column answers one question: when a piece drops for one member of a five-class roster, how many of the other four can wear it too, on average?

- **A kind touches two to five classes.** One class would be a bespoke pool that's dead whenever that class sits out. Past five, a piece can't be checked against every kit it lands on.
- **Two classes share at most two kinds.**
  - Of the 120 pairs, 57 share nothing, 38 share one kind and 25 share two.
  - Every class shares something with five to twelve others.
  - For every class, no other class can wear more than half of its kinds.
- **Apart where it counts.** 59% of the pairs of kinds from different slots never meet on one unit, so pieces in them can be strong together without ever stacking. That counts a two-hander never meeting an offhand; without that rule it's 52%.
- **Build parties.** 30 of the 36 routes in `builds.md` have one to three kinds that two members can both wear.
  - Four have none: Bonfire's Pyromancer, Hexer and Knight; the Hunt's Ranger, Stormcaller and Paladin; and two of Lockdown's.
  - Those routes were written for the old Hexer and Geomancer, so they'll move anyway.
- **Found.** Suppose a run sees about 110 pieces: 5h's volumes, raised a third for the fourth slot. Each fighter then sees about half of what it can wear:
  - 6 or 7 of its 16 weapons;
  - 7 of its 12 to 24 armors;
  - 5 of its 8 to 16 offhands;
  - 12 of the 24 amulets.

## Weapons

A kind has a speed, a damage type and a number of hands, and nothing else. Every piece fits exactly its kind's classes.

| Kind | Speed | Damage | Hands | Classes |
| --- | --- | --- | --- | --- |
| Dagger | fast | physical | one | Assassin, Ranger, Hexer |
| Fist weapons | fast | physical | one | Monk, Vampire |
| Sword | medium | physical | one | Knight, Bramble knight, Assassin |
| Spear | medium | physical | one | Hoplite, Valkyrie, Monk |
| Bow | medium | physical | two | Ranger, Bard |
| Great weapon (axe, hammer, pike, scythe) | slow | physical | two | Knight, Hoplite, Geomancer, Vampire |
| Rune sword | medium | magical | one | Paladin, Valkyrie, Hexer, Geomancer |
| Mace | slow | magical | one | Cleric, Paladin |
| Wand | fast | magical | one | Pyromancer, Stormcaller, Bard |
| Rod | medium | magical | one | Frostweaver, Stormcaller |
| Staff | slow | magical | two | Cleric, Frostweaver, Pyromancer, Bramble knight |

- **Variety within a class:** every class's two kinds differ in speed, damage or hands.
  - The Knight: a sword with a shield, or a two-hander.
  - The Paladin: a rune sword or a mace, both one-handed, so always a shield or a lantern beside it.
  - The Hexer: a fast dagger, or a rune sword that hits with magic.
  - The Geomancer: a great weapon, or a rune sword with a totem.
  - The Cleric: a mace with a relic or a bell, or a staff.
- **Variety between classes:** the 16 classes have 14 different patterns. Two pairs share one: the Knight and Hoplite, and the Monk and Assassin. Neither pair holds the same two kinds.
- **Builds' reach:** nine classes can go slow (Landslide), and eight can go fast (Thousand Cuts, Cold Snap's frost seats).
- **What moved from today:**
  - **Physical kinds:**
    - The Hoplite trades its sword for the great weapon.
    - The Vampire trades its sword and Dark staff for the great weapon.
    - The Valkyrie trades its sword and Light staff for the rune sword.
    - The Bard loses its dagger (the cap). Its fast weapon is now the wand, so in Thousand Cuts' "Monk, Assassin, Bard on daggers and fists" the Bard plays fast with magic.
    - The bow becomes two-handed.
  - **The two you re-themed:**
    - The Paladin's sword and Light staff become the rune sword and the mace.
    - The Hexer's two fast staves become a dagger and the rune sword.
    - The Geomancer's two slow staves and axe become the great weapon and the rune sword.
  - **The casters:**
    - The Frostweaver's two fast staves become a medium rod and a slow staff.
    - The Stormcaller's two fast staves become a fast wand and a medium rod.
    - The Pyromancer keeps its fast and slow pair (wand, staff).
    - The Cleric's Light staff becomes a mace and a staff.
    - The Bramble knight's Earth staff becomes the staff.

**Magical damage.** The kind decides, like speed. The other two ways didn't hold:
- **Piece by piece:** a magical sword in the sword pool would be a dead offer for the Knight and the Assassin.
- **A magical twin of every physical kind:** that doubles the kinds.

How the magical kinds sit:
- **The rune sword and the mace** are magic in a fighter's hand.
- **The wand, rod and staff** are the casters'. The four casters each hold a different pair from the wand, rod, staff and mace, so no two share more than one.
- **Basic attacks that carry a status keep a fast weapon:** the Pyromancer and Stormcaller a wand, the Hexer a dagger.
- **Like the physical kinds,** some magical kinds differ only in who holds them (the rune sword and rod, like the sword and spear).
- **Scaling stays:** physical kinds from Attack, magical kinds from Magic, unless a piece names another stat.

**Two-handers** (great weapon, bow, staff): ten classes have one, and every class also has a one-handed kind. A two-hander empties the offhand, so its pieces are designed to be worth a weapon and an offhand.

## Armor

| Type | Classes (second type in brackets) |
| --- | --- |
| Plate | Knight, Hoplite, Geomancer, Bramble knight, (Paladin) |
| Mail | Paladin, Valkyrie, Vampire, Hexer, (Bramble knight) |
| Leather | Ranger, Monk, Assassin, Bard, (Valkyrie) |
| Robes | Cleric, Pyromancer, Frostweaver, Stormcaller, (Bard) |

This is your draft, the Paladin's Plate included, with the Hexer moved from Robes to Mail as a spellblade. Types replace weights: a class wears only its types, and today's "or anything lighter" goes.

## Offhands

| Kind | Classes | Why these classes |
| --- | --- | --- |
| Kite shield | Knight, Paladin | protectors who shelter the party |
| Round shield | Hoplite, Valkyrie | spear fighters who cover an ally |
| Horn | Knight, Bard | both hand an ally mana |
| Tome | Frostweaver, Bard | both work on the whole field at once |
| Lantern | Paladin, Pyromancer | holy light and fire, and both set foes burning |
| Relic | Cleric, Valkyrie | the two revivers |
| Bell | Monk, Cleric, Stormcaller | each sets its own tempo |
| Totem | Bramble knight, Ranger, Geomancer | the wild and the earth |
| Vial | Assassin, Vampire | poison and blood: hits that pay them back |
| Idol | Hexer, Vampire | the dark arts, and both weaken foes |

- **No offhand joins two classes that already share two kinds,** so no pair reaches three.
- **The column says why the classes are alike,** not what the kind is for. Its pieces can be anything. Step 4 shouldn't make a kind's pieces follow it, or the kind's name becomes the signpost that cards avoid.

## The amulet

It stays open to everyone, as you want:
- **It's never dead:** a run that switches units around keeps its amulets.
- **It reads:** jewellery fits anyone.
- **It's the one slot where a piece can meet any class.**

Today it's the rule slot: 17 of the 29 rogue rule pieces are amulets. Three things work against that now:
- **Every other slot has narrow kinds,** so a piece meant for a few classes has a better home.
- **Amulets are a small part of the stock and the offers:** about a tenth of the stock and 15% of offers. Every amulet fits everyone, though, so a fighter still sees about 12 a run, more than any other slot.
- **No amulet names one class's ability.** It would be dead on fifteen classes and point at the sixteenth.

## Mythic

- **What it is:** a piece that reaches into one class's kit. A legendary bends the game for whoever wears it; a mythic rewrites a class.
- **How it differs from upgrades:** an upgrade is trained. It changes one ability or the passive, in a power step and two versions designed for it. A mythic is found, can be taken off, and goes past any one ability: a rule across the whole kit, or something no version reaches. Step 4 designs both together so they don't overlap.
- **Classes and slots:** it fits exactly one class and can sit in any slot. A mythic weapon has its own speed, damage and hands, even outside the class's kinds. A unit wears one mythic at most.
- **How many:** one per class to start (16), each pulling toward one of the class's builds.

## Each class

What it can wear, with the other classes that share each kind.

| Class | Kinds | Weapons | Armor | Offhand | Shares with |
| --- | --- | --- | --- | --- | --- |
| Knight | 5 | Sword (Bramble knight, Assassin); Great weapon (Hoplite, Geomancer, Vampire) | Plate (Hoplite, Geomancer, Bramble knight, Paladin) | Kite shield (Paladin); Horn (Bard) | 7 |
| Cleric | 5 | Mace (Paladin); Staff (Frostweaver, Pyromancer, Bramble knight) | Robes (Pyromancer, Frostweaver, Stormcaller, Bard) | Relic (Valkyrie); Bell (Monk, Stormcaller) | 8 |
| Ranger | 4 | Dagger (Assassin, Hexer); Bow (Bard) | Leather (Monk, Assassin, Bard, Valkyrie) | Totem (Bramble knight, Geomancer) | 7 |
| Bramble knight | 5 | Sword (Knight, Assassin); Staff (Cleric, Frostweaver, Pyromancer) | Plate (Knight, Hoplite, Geomancer, Paladin); Mail (Paladin, Valkyrie, Vampire, Hexer) | Totem (Ranger, Geomancer) | 12 |
| Hoplite | 4 | Spear (Valkyrie, Monk); Great weapon (Knight, Geomancer, Vampire) | Plate (Knight, Geomancer, Bramble knight, Paladin) | Round shield (Valkyrie) | 7 |
| Paladin | 6 | Rune sword (Valkyrie, Hexer, Geomancer); Mace (Cleric) | Plate (Knight, Hoplite, Geomancer, Bramble knight); Mail (Valkyrie, Vampire, Hexer, Bramble knight) | Kite shield (Knight); Lantern (Pyromancer) | 9 |
| Valkyrie | 6 | Spear (Hoplite, Monk); Rune sword (Paladin, Hexer, Geomancer) | Mail (Paladin, Vampire, Hexer, Bramble knight); Leather (Ranger, Monk, Assassin, Bard) | Round shield (Hoplite); Relic (Cleric) | 11 |
| Bard | 6 | Bow (Ranger); Wand (Pyromancer, Stormcaller) | Leather (Ranger, Monk, Assassin, Valkyrie); Robes (Cleric, Pyromancer, Frostweaver, Stormcaller) | Horn (Knight); Tome (Frostweaver) | 9 |
| Hexer | 4 | Dagger (Assassin, Ranger); Rune sword (Paladin, Valkyrie, Geomancer) | Mail (Paladin, Valkyrie, Vampire, Bramble knight) | Idol (Vampire) | 7 |
| Monk | 4 | Fist weapons (Vampire); Spear (Hoplite, Valkyrie) | Leather (Ranger, Assassin, Bard, Valkyrie) | Bell (Cleric, Stormcaller) | 8 |
| Assassin | 4 | Dagger (Ranger, Hexer); Sword (Knight, Bramble knight) | Leather (Ranger, Monk, Bard, Valkyrie) | Vial (Vampire) | 8 |
| Vampire | 5 | Fist weapons (Monk); Great weapon (Knight, Hoplite, Geomancer) | Mail (Paladin, Valkyrie, Hexer, Bramble knight) | Vial (Assassin); Idol (Hexer) | 9 |
| Pyromancer | 4 | Wand (Stormcaller, Bard); Staff (Cleric, Frostweaver, Bramble knight) | Robes (Cleric, Frostweaver, Stormcaller, Bard) | Lantern (Paladin) | 6 |
| Frostweaver | 4 | Rod (Stormcaller); Staff (Cleric, Pyromancer, Bramble knight) | Robes (Cleric, Pyromancer, Stormcaller, Bard) | Tome (Bard) | 5 |
| Stormcaller | 4 | Wand (Pyromancer, Bard); Rod (Frostweaver) | Robes (Cleric, Pyromancer, Frostweaver, Bard) | Bell (Monk, Cleric) | 5 |
| Geomancer | 4 | Great weapon (Knight, Hoplite, Vampire); Rune sword (Paladin, Valkyrie, Hexer) | Plate (Knight, Hoplite, Bramble knight, Paladin) | Totem (Bramble knight, Ranger) | 8 |

Every class can also wear every amulet. "Shares with" counts the other classes that share at least one of its kinds, not counting amulets.

## What it asks

- **Schema:**
  - an `offhand` slot, so four slots on every unit;
  - weapon kinds with a speed, a damage type and hands, and no element or subtype;
  - four armor types in place of three weights;
  - offhand kinds, with each class listing its kinds in every slot;
  - a mythic rarity that names one class;
  - a rule that a two-hander empties the offhand.
- **The cleanup step:** new kits and stats for the Hexer as a spellblade and the Geomancer as an earth fighter, and perhaps a new name for the Geomancer.
- **Interface:**
  - a fourth slot on the party screen, the sheets and the cards, with the offhand shown locked under a two-hander;
  - a colour for mythics;
  - your art for the new weapon kinds and the ten offhands.
- **5h's loot numbers:**
  - **Volume:** seats grow by a third (12 on the fighters), so about 37 pieces taken and 110 seen a run.
  - **Offers:** each offer picks a slot first (weapons and offhands 30% each, armor 25%, amulets 15%), then a class as 5h does now, then a kind that class wears.
  - **Stock to start:** 8 pieces a weapon kind, 12 an armor type, 8 an offhand kind and 24 amulets, about 240 in all (today's rogue has about 120), plus 16 mythics.

## What I'm least sure of

1. **The Robes knot** (above).
2. **Fits at a glance:**
   - the Cleric's mace dealing magic;
   - the Geomancer's rune sword;
   - the Bard's wand;
   - the Vampire's great weapon;
   - the Bramble knight's staff (at Magic 2, a weak option).
3. **Two-handers worth two pieces:** step 4's test parties will show whether a piece can be worth two without being dead or mandatory.
