# Step 5j: the build log

Oct 29, 2026. What the cleanup changed, item by item: the trail for later sessions and the source for the documents. `report.md` is what the director reads.

## The director's tie-breaks (Oct 29, all nine defaults taken)

1. **Bulwark:** every hit chips it (it was piercing and Wind hits).
2. **The eleven kinds' speeds:** the kinds that carry over keep their intervals (dagger 5.6, fist 6.0, sword 8.2, bow 8.8, spear 9.4, and the axe's 12.8 for the great weapon); the wand 6.6 (the middle of the fast staves', 6.0 to 7.2), the rune sword 8.5, the rod 9.1, the mace 11.0 (slow, as the gear table says, though the Light staff it replaces was medium, 9.8) and the staff 11.6 (the fire staff's).
3. **Starting weapons where the old kind is gone:** the Paladin a rune sword, the Bard a bow, the Hexer a dagger, the Vampire fist weapons, the Frostweaver a rod, the Geomancer a great weapon. Every other class keeps its kind (the Cleric's Light staff became the mace, the Pyromancer's fire staff the staff, the Stormcaller's lightning staff the wand).
4. **Medium armor:** Brigandine and Scale coat to Mail; Scout leathers, Tracker's jerkin and Duskhide to Leather; the rogue's Briar coat and Shadow cowl to Leather.
5. **The Hexer:** Attack 1 → 3; Magic stays 4, so its kit (all stacks from Magic) is untouched.
6. **The Geomancer:** Tremor scales from Armor (as Rockfall and Earthen shell do); Attack 3 and Magic 4 stay.
7. **Names:** pieces keep their names when their kind changes; only texts that would now be false are rewritten.
8. **The retired campaign and free play:** kept running with the minimum edits.
9. **Mythics:** crimson.

## Rules (schema 0.7, engine 0.16)

- **Two kinds of damage.** Physical meets Evasion and Armor (the formula as it was). Magical meets **Magic resist** (`magic_resist`, one percentage stat, floor 0, cap 100: 100 is IMMUNE) and is never dodged. Untyped damage (`none`) meets nothing.
- **Gone:** elements (the pack's registry, `element` on damage, weapons, weapon kinds and statuses), physical subtypes (slash, pierce, blunt), `convert` (a status that changed an element or subtype), the general `resist` stat and the `resist:<element>` family, weaknesses (negative resistance), and absorption (resistance past full healing instead). Damage words are RESIST, IMMUNE, BLOCKED, MISS and AEGIS; WEAK and ABSORB are gone.
- **A status's own damage is untyped:** Burn, Shock, Chill's shatter (all three were Fire, Lightning and Ice), Bleed and Thorns (untyped already). An engine status can still deal physical or magical damage if its content says so (the Bomb Bug's death blast is magical: it's an elemental enemy attack).
- **Tags** a boost, a damage-taken modifier, a lockout or an event filter can name: a hit's kind (basic, ability, extra), its type (physical, magical), "crit", a status's id and tags. Elements and subtypes aren't tags anymore.
- **Gear in four slots:** weapon, armor, offhand, amulet.
  - A weapon kind is a speed, a damage type and **hands** (1 or 2). A two-handed weapon empties the offhand: the engine ignores an offhand under one, the validator rejects a party with both, and the rogue's equip sends the offhand to the bag when a two-hander goes on and refuses an offhand under one.
  - **Armor types** (`pack.armorTypes`) and **offhand kinds** (`pack.offhandKinds`) are registries of names. A piece of armor names its type (`gear.armor`, in place of `weight`); an offhand names its kind (`gear.offhand`). A class lists its weapon kinds (first kind first: it arrives with that kind's plain weapon), its armor types and its offhand kinds, and wears only those. Every class needs a one-handed weapon kind (the validator checks it).
  - **Mythic:** a piece with `mythic: <class>` fits that one class in any slot, whatever its kind (a mythic weapon may state its own speed, type and hands instead of a kind); a unit wears one at most (the validator checks a party, and the rogue's equip sends a second one's predecessor to the bag). The rogue's rarities gain `mythic`, priced as a legendary. None exists yet.
- `ENGINE_VERSION` 0.16. The worked example's pinned run changed (its resistances are gone).

## Content

- **Statuses:** Burn, Shock and Chill's shatter untyped; Ward gives +40 Magic resist for 30 ticks ("Magic resist up."); Bulwark chips on every hit. Texts lose their element words.
- **Weapon kinds (11):** dagger, fist weapons, sword, spear (one-handed, physical); bow, great weapon (two-handed, physical); rune sword, mace, wand, rod (one-handed, magical); staff (two-handed, magical). Each has its plain piece. A swing's size still follows its interval, so every kind deals about the same a tick.
- **Armor types:** Plate, Mail, Leather, Robes. **Offhand kinds (10):** kite shield, round shield, horn, tome, lantern, relic, bell, totem, vial, idol. No offhand pieces yet.
- **Classes:** every class's kinds in every slot as `builds.md` (Gear) has them. Elemental resistances and weaknesses gone (the Bramble knight's weakness to Fire, the Paladin's Light, the Vampire's Light and Dark, the Frostweaver's Ice).
  - Abilities keep their type minus the element, except the all-physical classes' three: **Frost arrow, Burning fist and Blood drain are physical.** The Valkyrie's Gale spear, the Paladin's Smite, the Geomancer's Rockfall and Tremor and every caster's spells stay magical.
  - Texts that named an element as a damage type now say physical or magical ("Heavy magical damage…", "Three quick burning blows…"); themes stay in names and flavour (Firebolt, "a lance of ice").
  - The Hexer: Attack 3 (was 1). Cold hex and Kindling: "whatever weapon it carries" (was staff).
  - The Geomancer: Tremor scales from Armor (was Magic), magical, with its Stun.
- **Enemies:** Magic resist by rank (minion 10, elite 15, boss 25), the Ghost 75 (in place of its rank's); the themes' per-element lifts and dips, every weakness, every one-element resistance and both absorptions (the Fire Giant's Fire, the Ice Spirit's Ice) gone. Elemental attacks are magical (Soulfire, Brand, Inferno, Hailstorm, Tempest, the Bomb Bug's blast, the casters' touches); physical attacks stay physical. Enemy basic attacks on the old kinds moved to the new ones (the axe to the great weapon, the same interval; the fire staff to the staff, the same; the lightning staff to the wand, 7.2 → 6.6). The Ice Spirit's line is "Living ice: its touch chills." No new puzzles.
- **Gear (85 pieces, was 90):**
  - Stripped: every elemental resistance. The Sun, Moon and Mountain charms (resistances only) are gone; Ashen plate keeps +1 Armor ("Forged in ash.") and Duskhide +½ HP ("A dark hide.").
  - Re-sorted weapons: the fast staves (ice, wind, dark, lightning) to the wand (Storm rod, Grounding rod, Zephyr staff, Tailwind staff, Rime staff, Hoarfrost staff, Nightstaff, Leech staff, Sanguine staff, Glacier staff); the slow ones (fire, earth) to the staff (Brand staff, Ember staff, Granite staff, Rootstaff, Heartwood staff); the Light staff to the mace (Sunstaff, Dawn staff, Chapel staff, Templar staff); the axe to the great weapon (Rune axe, Splitter, Cornerstone axe). The other kinds' pieces stay where they were.
  - Re-sorted armor: heavy to Plate (Plate, Bastion plate, Tower mail, Thorn mail, Ashen plate, Thornheart plate), light to Robes (Robes, Vestments, Shadowsilk, Quiet cloak, Archmage's robes), medium as tie-break 4 (Wraith leathers to Leather too).
  - Texts rewritten where false: Heartwood staff ("Hits that scale from max HP."), Sanguine staff ("Basic attacks that scale from max HP."), Templar staff ("Basic attacks that scale from Armor."), Dawn staff ("Heavy, and nothing else."), Earthshaker ("A staff that leaves what it strikes sundered."), Cinder rod ("Hits burning foes harder.").
- **The rogue:** four affixes gone (Fireproof, Frostproof, Grounded, Hallowed: resistances only). Legendary weapons on the new kinds (Headsman's axe a great weapon, Gravecaller and Cinder rod wands, Earthshaker a staff). Each legendary's hidden aims are narrowed to the classes that can still wear it, or to everyone who can where none of its aimed classes can (the Sanguine staff, Glacier staff and Gravecaller now aim at the Bard, Pyromancer and Stormcaller; Heartwood staff and Earthshaker at the Bramble knight; the Templar staff at the Paladin; the Hexer, Valkyrie and Bard lost one or two). Offers never roll an offhand (there's nothing to roll).
- **The hand-built tuning rosters** (`src/rogue-parties.ts`): six hand-picked legendaries no longer fit their class and were swapped for one that does (the Hexer's two for Frostfang, the Valkyrie's Templar staff for the Brand of kings, the Frostweaver's Glacier staff for Earthshaker, the Geomancer's Earthshaker for the Cornerstone axe, the Bard's Frostfang for the Glacier staff). The knobs aren't re-tuned.
- **The retired campaign and free play:** its Iron Wall trial needs Plate (was heavy armor: the same five classes); the dropped charms leave its rewards; the plain wind staff reward is the plain rune sword (the Valkyrie's second kind); the plain dark staff and axe rewards are gone (the great weapon arrives with the Geomancer).
- **The worked example** (`fixtures/hollow.pack.json`, the machinery's fixture): schema 0.7, its elements and subtypes stripped, its resistances gone (general resistance became Magic resist), its three weights kept as three armor types with each class listing every type it could wear before, one offhand kind.

## Tools and tests

- The balance sheet reads magical damage as one kind (its "Magic resist" lines replace "Resistances"); the AI playtester's and feel reader's words say physical, magical or untyped; the command line counts armor types and offhand kinds; `PRIMITIVES.md` regenerated; the exported JSON Schema regenerated.
- Tests rewritten for the new rules: Magic resist (30 cuts by 30%, 100 is IMMUNE, no weakness), a fully resisted hit still lands and applies its statuses, boosts and modifiers by type, a lockout covering magical actions, Magic resist never stopping a status, a Bulwark that only magical hits chip (the filter, not the content), the validator's gear slots, two-handers and mythics. The Imbue (element conversion) and absorption tests are gone with their rules.

## Checks at the end

- `npm test`: 321 passing. `npm run typecheck`, `npm run validate` (the core set's one old warning, Rot unused; the worked example's three plain-weapon warnings) and `npm run smoke` pass.
- `npm run rogue -- --runs 200`: runs end to end. The simulated player wins 3% (the build before the cleanup, 200 runs too: 6%; noisy at this size, and nothing was tuned).
- The Ice Titan against the twelve hand-built rosters at act II's boss level (a scratch probe, 36 fights each way): its Bulwark breaks 2.9 times a fight (1.1 before), and the fight runs 60 ticks (84).
- `npm run smoke`: 9 of 29 encounters behave as the documents say, as before.
