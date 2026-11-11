# The fill: offhands, the other seven kinds

Tome, orb, idol, vial, trophy, bell and cloak: 63 pieces (14 commons, 16 uncommons, 21 rares, 12 legendaries), in the spine's order. Every offhand takes the standard ladder: one step, two, three, four. Every value is a first value.

How the stack words are read here, once:
- **A rider or a start-of-fight status** is the plain word from its holder's Attack: `STACKS.few` through `own("few", "attack")`, about two stacks at Attack 3 and about three at Attack 4.
- **A status that rides a cast** (Curse-book) is the word as a kit's ability adds it: `own("few", "attack", ABILITY_STACKS)`, twice the plain word.
- **A status keeps every number it has in `STATUS`.**

## Tome

*Wears:* Bard, Hexer, Frostweaver. *Signature:* Cooldown.

### Scholar's codex
- **Is:** tome · common
- **Card:** Nothing beyond its stats.
- **Stats:** Attack +1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** Cold Snap, and the Hexer's curses: Attack sets the stacks.
- **Notes:** Today's name and step. The row's "Cooldown and Attack", with Attack picked.

### Hymnal
- **Is:** tome · common
- **Card:** Nothing beyond its stats.
- **Stats:** Cooldown medium (1 of 1)
- **Numbers:** `SPECIAL.cooldown.medium`.
- **Code:** none.
- **Serves:** Barrage.
- **Notes:** Today's name and step. The row's "Cooldown and MP regen", with Cooldown picked, so the signature is on one common.

### Snowbound folio
- **Is:** tome · uncommon
- **Card:** When each fight starts, every foe gains a few Chill (from its holder's Attack).
- **Stats:** Cooldown medium · Attack +1 (2 of 2)
- **Numbers:** a few: `STACKS.few` from the holder's Attack, through `own()`. About two on a Bard or a Frostweaver, about three on a Hexer, of `STATUS.chill.cap`.
- **Code:** as today's Snowbound folio. 8 fires it again.
- **Serves:** Snap 1 ●● ⚙ opening again (half), every colour (half), firecracker (half)
- **Notes:** Today's card and size. It's what one Blizzard or one Stillness lays on a field, free and at the first tick: an icon and a number on every foe, and one cast fewer to the first shatter. See *Least sure*.

### Marginalia
- **Is:** tome · uncommon
- **Card:** While a foe is in a wind-up, its holder's abilities that aim at one foe aim at the casting foe with the highest Attack instead. A Taunt still decides the pick for an ability without Seek.
- **Stats:** Cooldown medium · Cast speed medium (2 of 2)
- **Numbers:** none.
- **Code:** 21.
- **Serves:** stops a cast, Snap ●, Toll ●
- **Notes:** It changes the target phrase and nothing else. Abilities that hit every foe or aim at an ally aren't touched; an ability that picks several foes changes its first pick only. The new phrase is the ability's own, so it wins over a Mark. Cast speed is the careful stat: the redirected cast has to land inside the foe's wind-up. Does nothing on a Bard (*Challenges*).

### Curse-book
- **Is:** tome · uncommon
- **Card:** Its holder's abilities add a few Bleed to each foe they hit (from its holder's Attack).
- **Stats:** Cooldown medium · MP regen +1 (2 of 2)
- **Numbers:** a few, as a kit's ability adds it: `own("few", "attack", ABILITY_STACKS)`. About four a foe on a Frostweaver, five or six on a Hexer.
- **Code:** none: a rider on an ability's hit, as the kits' are.
- **Serves:** Cuts 1 ●● ⚙ red rain (half), every colour (half)
- **Notes:** "Hit" is the vocabulary's: an ability that deals no damage (Enfeeble, Stillness, Unmake) adds nothing. The Bleed lands after the hit, so it pays on the next one. Sized as a cast's because it comes at a cast's pace: at the plain word a Blizzard's wounds paid half what the Blizzard dealt. Does nothing on a Bard (*Challenges*).

### Primer of frost
- **Is:** tome · rare
- **Card:** Each time its holder adds Chill to a foe, it adds a tenth more for each stack of Chill that foe already holds.
- **Stats:** Cooldown medium · Attack +2 (3 of 3)
- **Numbers:** 10% more for each stack held, read on the foe as the Chill lands. Any Chill its holder adds counts: abilities, swings, a piece.
- **Code:** as today's Primer of frost, at a new ratio.
- **Serves:** Snap 2 ●●●
- **Notes:** Today's piece. Size changed: today's quarter more for every four stacks turned a lance of five into six on a half-cold foe, which nobody would see. At a tenth a stack, a foe at six takes that lance to the cap, so the shatter comes a cast early.

### Twice-told tome
- **Is:** tome · rare
- **Card:** Every third ability its holder casts in a fight is cast twice. The second cast comes at once and is free; it isn't counted, and it isn't cast again.
- **Stats:** Cooldown medium · Cast speed medium · MP +1 (3 of 3)
- **Numbers:** every third cast that resolves, on a count shown on its holder and kept for the fight.
- **Code:** 16, 23. The second cast as today's Encore.
- **Serves:** Barrage 2 ●●●, Snap ●●, Landslide ● ⚙ crescendo (half) ◆ free-cast
- **Notes:** The second cast adds a Crescendo and skips a climbing price. Where an Encore lands on the same cast, each adds one repeat of the first cast, so it's cast three times, and neither repeat is repeated.

### Grimoire of plagues
- **Is:** tome · rare
- **Card:** When each fight starts, two of Burn, Chill, Shock and Bleed are picked at random, and every foe gains a few stacks of each (from its holder's Attack).
- **Stats:** Cooldown medium · Attack +1 · MP regen +1 (3 of 3)
- **Numbers:** a few of each: `own("few", "attack")`, the same size as Snowbound folio's. Two different statuses, the same two on every foe, picked afresh each time it happens.
- **Code:** as today's Wildmagic wand's random pick, at a fight's start. 8 fires it again, with a new pick.
- **Serves:** Bonfire ●●, Snap ●●, Storm ●●, Cuts ●● ⚙ every colour (key), opening again (half)
- **Notes:** One pick for the whole field, so the fight reads as one thing ("fire and frost") and the party's piles have somewhere to start. Kept at the folio's size so the folio isn't this piece made smaller. Reads close to the folio all the same (*Challenges*).

### Annotated score
- **Is:** tome · rare
- **Card:** Each time the other ally with the highest Attack casts an ability, its holder's next ability costs no MP. It holds one free cast at a time.
- **Stats:** Cooldown medium · Attack +1 · MP +1 (3 of 3)
- **Numbers:** a whole cast's cost.
- **Code:** as today's Annotated grimoire's free-cast marker, set by a named ally's cast.
- **Serves:** Barrage 2 ●● ⚙ crescendo (half) ◆ free-cast
- **Notes:** The free cast still adds a Crescendo. Two of these facing each other is a loop (*Loops*).

### Last page
- **Is:** tome · legendary
- **Card:** When a foe falls, every foe below a tenth of its HP falls too.
- **Stats:** Cooldown high · Attack +1 · MP +1 (4 of 4)
- **Numbers:** a tenth of max HP.
- **Code:** as today's Last page.
- **Serves:** Hunt 3 ●●, Storm ● ⚙ reaping (half)
- **Notes:** Kept: card, size and stats are today's. Each fall it causes checks again, and the foes run out. Its falls are nobody's killing blow: "when a foe falls" pieces fire, "a killing blow its holder lands" pieces don't. Today it deals damage worth the foe's HP and Shield, which an Aegis over a big Shield could block; the card promises a fall, so build it as one.

### Annotated grimoire
- **Is:** tome · legendary
- **Card:** Each ability its holder pays for makes the next ability any ally casts free.
- **Stats:** Cooldown high · MP +1 · MP regen +1 (4 of 4)
- **Numbers:** a whole cast's cost. One free cast is held at a time, and a free cast doesn't make another.
- **Code:** as today's Annotated grimoire.
- **Serves:** Barrage 3 ●●● ⚙ crescendo (half) ◆ free-cast
- **Notes:** Kept: card, size and stats are today's. "Any ally" includes its holder. "Pays for" is unclear once casts cost HP (*Challenges*).

### Frozen tome
- **Is:** tome · legendary
- **Card:** Each time a foe's Chill shatters, every ally's ability with the longest cooldown comes half its wait closer.
- **Stats:** Cooldown medium · Attack +2 · Cast speed medium (4 of 4)
- **Numbers:** half of the wait left, each shatter, anyone's. For each ally it's the ability whose full cooldown is longest, whatever is left on it.
- **Code:** the trigger as today's Orb of the long winter. Two things are new: a cut by a share of the wait in place of a count of ticks, and a pick by an ability's full cooldown (*Code support*).
- **Serves:** Snap 3 ●●●, Landslide ●●, Barrage ●● ⚙ shatter bell (key)
- **Notes:** Half of a long wait is one or two cooldown words, so it's seen on the first shatter; a second shatter leaves a quarter. Cooldown stays medium because the piece is its own Cooldown.

## Orb

*Wears:* Pyromancer, Frostweaver. *Signature:* MP.

### Glass orb
- **Is:** orb · common
- **Card:** Nothing beyond its stats.
- **Stats:** MP +1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** Barrage.
- **Notes:** Today's name and step.

### Ember orb
- **Is:** orb · common
- **Card:** Nothing beyond its stats.
- **Stats:** Attack +1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** Bonfire and Cold Snap.
- **Notes:** Today's name and step. The row's "MP and Attack", with Attack picked, so the two commons differ.

### Scrying orb
- **Is:** orb · uncommon
- **Card:** When each fight starts, its holder's ability nearest to ready is ready at once.
- **Stats:** MP +1 · Attack +1 (2 of 2)
- **Numbers:** a whole cooldown: the ability with the least wait left that isn't ready yet.
- **Code:** as today's Scrying orb. 8 fires it again.
- **Serves:** Barrage 1 ●, Hunt 1 ●, first move ⚙ opening again (half)
- **Notes:** Today's card and size; "is ready" in place of "comes at once", since the ability still winds up. Cooldowns carry, so on a unit with one ability this is that ability at the start of every fight.

### Mana pearl
- **Is:** orb · uncommon
- **Card:** Each time a foe falls, its holder regains 15% of its max MP.
- **Stats:** MP +1 · MP regen +1 (2 of 2)
- **Numbers:** 15% of max MP a fall, anyone's kill: about a Firebolt for the Pyromancer, three quarters of a Frost lance for the Frostweaver.
- **Code:** as today's Mana pearl.
- **Serves:** Barrage 1 ●●, Bonfire ● ⚙ resonance (half) ◆ kill-pays, free-cast
- **Notes:** Today's piece. Size changed from 8%: a kill reward has to be near a whole cast to be seen.

### Orb of the long winter
- **Is:** orb · rare
- **Card:** When a foe's Chill shatters, its holder regains a quarter of its max MP.
- **Stats:** MP +1 · Attack +1 · Cooldown medium (3 of 3)
- **Numbers:** a quarter of max MP a shatter, anyone's: between a Frost lance and a Stillness for the Frostweaver, a Fireball for the Pyromancer.
- **Code:** the trigger as today's Orb of the long winter; the gain as today's Mana pearl.
- **Serves:** Snap 2 ●●●, Barrage 2 ●● ⚙ frozen gate (half), resonance (half) ◆ free-cast
- **Notes:** Changed as its line says: mana in place of a few ticks. "About a cast's worth" is the middle spell of each wearer.

### Smouldering orb
- **Is:** orb · rare
- **Card:** When a burning foe falls, every other foe gains a third of the Burn it held. A fallen foe's fire moves once: if another piece or seat in the party also moves it, the fire is split evenly between them first.
- **Stats:** MP +1 · Attack +1 · Cast speed medium (3 of 3)
- **Numbers:** a third of the Burn held at the fall, to each other foe.
- **Code:** 9, as today's Ember heart.
- **Serves:** Bonfire 2 ●●●, Hunt ● ⚙ fuse (key)
- **Notes:** Today's Ember heart's card. With four or more foes left it lays more fire than fell.

### Orb of the deep
- **Is:** orb · rare
- **Card:** Damage that would reach its holder's HP comes out of its MP instead, point for point, while it has any. A Shield still takes the damage first.
- **Stats:** MP +2 · MP regen +1 (3 of 3)
- **Numbers:** one MP for one damage, of any kind, a status's included. It sits after Defense, Aegis and Shields and before HP. A blow bigger than the MP left takes the rest from HP.
- **Code:** 6.
- **Serves:** Barrage 2 ●●●, Pact ● ⚙ mana as armour (key)
- **Notes:** A price isn't damage, so paying HP never touches the MP. A blow that empties the pool mid wind-up makes that cast fizzle: the cliff the engine asks for.

### Orb of the rising sun
- **Is:** orb · legendary
- **Card:** Each time its holder casts an ability it has already cast this fight, that ability gains a Crescendo. Nothing makes its abilities cost more for the Crescendo they hold.
- **Stats:** MP +1 · Cooldown high · Cast speed medium (4 of 4)
- **Numbers:** one Crescendo a repeat cast, to the counter's own definition (`fill/shared.md`).
- **Code:** 11.
- **Serves:** Barrage 3 ●●●, Bonfire ●● ⚙ crescendo (key)
- **Notes:** Beside Crescendo charm one cast adds one stack, and the charm's price is switched off. Every kind of cast adds: a repeat, a free one.

### The deep well
- **Is:** orb · legendary
- **Card:** While its holder holds Clarity, its abilities cost no MP.
- **Stats:** MP +2 · Attack +1 · MP regen +1 (4 of 4)
- **Numbers:** a whole cost, for Clarity's own length (`STATUS.clarity`).
- **Code:** as today's The deep well.
- **Serves:** Barrage 3 ●●● ⚙ crescendo (half), mana as armour (half) ◆ free-cast
- **Notes:** Kept: card, size and stats are today's. Its mana as armour tag doesn't hold (*Challenges*).

## Idol

*Wears:* Hexer, Vampire. *Signature:* Siphon.

### Night mask
- **Is:** idol · common
- **Card:** Nothing beyond its stats.
- **Stats:** Siphon medium (1 of 1)
- **Numbers:** `SPECIAL.siphon.medium`.
- **Code:** none.
- **Serves:** Barrage (the blood-well).
- **Notes:** Today's name and step.

### Carved effigy
- **Is:** idol · common
- **Card:** Nothing beyond its stats.
- **Stats:** HP +1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** Blood Pact.
- **Notes:** Today's name and step.

### Fanged idol
- **Is:** idol · uncommon
- **Card:** Its holder's first hit on each foe in a fight Rots that foe.
- **Stats:** Siphon medium · Lifesteal medium (2 of 2)
- **Numbers:** Rot at its own size and length (`STATUS.rot`), once a foe a fight.
- **Code:** the first hit on each foe as today's Weeping kris.
- **Serves:** foes do less, Pact ●
- **Notes:** Today's piece, changed as its line says: the first hit on each foe in place of crits.

### Leech idol
- **Is:** idol · uncommon
- **Card:** MP its holder gains past its full pool goes to the ally with the least MP. MP sent on this way isn't sent on again.
- **Stats:** Siphon medium · Attack +1 (2 of 2)
- **Numbers:** all of the overflow, point for point. "The least MP" is the lowest share, as the kits read it.
- **Code:** 6, as today's Leech idol for Siphon's gain; reading every other gain past full (Clarity, Refrain, a gift) is the new part. 23.
- **Serves:** Barrage 1 ●● ⚙ mana as armour (half) ◆ free-cast
- **Notes:** MP it sends is MP given, so a piece that reacts to a gift reacts to it. Its size is Siphon's, which this piece can't change (*Least sure*). No MP step: a bigger pool spills later.

### Hushing idol
- **Is:** idol · rare
- **Card:** When a foe starts a wind-up, its holder's next basic attack comes at once, at that foe, past any Taunt.
- **Stats:** Siphon medium · Attack +1 · Lifesteal medium (3 of 3)
- **Numbers:** a whole swing a cast begun. "At once" doesn't stack: two foes starting together draw one swing.
- **Code:** 17, 23.
- **Serves:** stops a cast, Toll ●●, Snap ●
- **Notes:** It's a real basic attack, so it carries what the swing carries: a Hexer's answers a cast with Chill, or with Weaken under Withering hex. If its holder is busy, the swing lands when it's next free. "Past any Taunt" is my reading of "at that foe" (*Challenges*).

### Idol of the deepening
- **Is:** idol · rare
- **Card:** Each hit its holder lands adds one more stack of each of Burn, Chill, Shock and Bleed that its target already holds.
- **Stats:** Siphon medium · Attack +2 (3 of 3)
- **Numbers:** one stack of each (`FLAT_STACKS.one`), every hit, swing or ability. "Already holds" is what the foe held as the hit landed, before the hit's own riders.
- **Code:** today's Malison's deepening, moved to a hit's rider.
- **Serves:** Bonfire 2 ●●, Snap 2 ●●, Storm 2 ●●, Cuts ●● ⚙ every colour (half)
- **Notes:** One stack a hit is enough to keep a lone stack of Burn or Shock from dying between swings on a wand or a sword, which is its job in the link. On a wound it settles Bleed at about three under its holder's own hits.

### Idol of binding
- **Is:** idol · rare
- **Card:** Foes its holder Weakens are also Slowed, and its hits on a foe that's both deal double.
- **Stats:** Siphon medium · Attack +1 · HP +1 (3 of 3)
- **Numbers:** Slow at its own length (`STATUS.slow`); double.
- **Code:** as today's Idol of binding.
- **Serves:** Toll ●●, foes do less
- **Notes:** Today's legendary at rare: the card and sizes stay, Siphon drops to medium and it carries three steps.

### Idol of the hungry dark
- **Is:** idol · legendary
- **Card:** Every so often, it takes one buff from a random foe with a buff and gives it to its holder, with its stacks and the time it has left. Never Bulwark.
- **Stats:** Siphon high · HP +1 · MP +1 (4 of 4)
- **Numbers:** every so often: `COOLDOWN.short`, the first beat halfway, as today's.
- **Code:** as today's Idol of the hungry dark, with the enemy-only statuses left out of what it can take.
- **Serves:** exotic
- **Notes:** Today's piece and stats; "Never Bulwark" added as its line says. A buff that can't be removed stays where it is. A stolen Taunt makes its holder Taunt.

### Idol of the deep
- **Is:** idol · legendary
- **Card:** Damage that would reach its holder's HP comes out of its MP instead, point for point, while it has any; a Shield still takes the damage first. MP it gains past its full pool becomes a Shield on it, point for point.
- **Stats:** Siphon high · MP +2 (4 of 4)
- **Numbers:** one MP for one damage; one Shield for one MP past full, up to the Shield's own cap (`STATUS.shield.capShare`).
- **Code:** 6.
- **Serves:** Barrage 3 ●●, Pact ●● ⚙ mana as armour (key)
- **Notes:** Its first sentence is Orb of the deep's, on purpose: no unit holds both kinds. Siphon high is the refill.

### Idol of the blood-well
- **Is:** idol · legendary
- **Card:** Each time its holder pays HP, the ally with the least MP regains as much MP.
- **Stats:** Siphon medium · HP +2 · Lifesteal medium (4 of 4)
- **Numbers:** one MP for one HP paid. "Pays HP" is the spine's: a price, not a drain or a drawback.
- **Code:** 20.
- **Serves:** Barrage ●●●, Pact ●● ⚙ blood mage (half)
- **Notes:** No "other": the MP can land on its holder. It's MP given. On a Vampire the price is Blood gift's fifth of max HP, which is a Fireball's cost; The chalice takes the same slot, so the two never meet.

## Vial

*Wears:* Vampire, Assassin. *Signature:* Lifesteal.

### Red tincture
- **Is:** vial · common
- **Card:** Nothing beyond its stats.
- **Stats:** Lifesteal medium (1 of 1)
- **Numbers:** `SPECIAL.lifesteal.medium`.
- **Code:** none.
- **Serves:** Blood Pact.
- **Notes:** Today's name and step.

### Hemlock phial
- **Is:** vial · common
- **Card:** Nothing beyond its stats.
- **Stats:** Crit chance +1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** Thousand Cuts and the Hunt.
- **Notes:** Today's name and step.

### Crimson dregs
- **Is:** vial · uncommon
- **Card:** Its holder's hits on a bleeding foe heal it for a fifth of their damage.
- **Stats:** Lifesteal medium · HP +1 (2 of 2)
- **Numbers:** a fifth of the damage dealt (the size of `SPECIAL.lifesteal.high`), on top of any Lifesteal. It's a heal of its own, so nothing that doubles Lifesteal doubles it.
- **Code:** as today's Crimson dregs.
- **Serves:** Cuts 1 ●●, Pact 1 ●● ⚙ red stone (half)
- **Notes:** Today's card. Size changed from a tenth: on an Assassin's hit that was a number too small to read.

### Bloodletter's phial
- **Is:** vial · uncommon
- **Card:** When each fight starts, every foe gains a few Bleed (from its holder's Attack).
- **Stats:** Lifesteal medium · Crit chance +1 (2 of 2)
- **Numbers:** a few: `own("few", "attack")`, about three on a Vampire and three or four on an Assassin. The first hit on each foe pays about a third of an ordinary swing again, in red.
- **Code:** as today's Snowbound folio, with Bleed. 8 fires it again.
- **Serves:** Cuts 1 ●● ⚙ red rain (half), opening again (half), every colour (half)
- **Notes:** The name sits beside Bloodletter, the sword (*Challenges*).

### Blood vial
- **Is:** vial · rare
- **Card:** Its holder's abilities cost half their MP, plus HP equal to their full cost. The price never takes it below 1 HP.
- **Stats:** Lifesteal medium · HP +2 (3 of 3)
- **Numbers:** half the MP; HP equal to the full MP cost. On an Assassin a Backstab is a sixth of its HP; on a Vampire a Frenzy is a ninth.
- **Code:** as today's Blood vial.
- **Serves:** Pact 2 ●●●, Barrage ● ⚙ brink (key), blood mage (half)
- **Notes:** Kept: today's card and size. HP +2 is the careful stat for a unit that pays in it.

### Venom vial
- **Is:** vial · rare
- **Card:** Each hit its holder lands on a bleeding foe raises that foe's Bleed by half of what it holds, once the wound has paid for the hit and closed. Its own hits leave a wound as deep as they found it.
- **Stats:** Lifesteal medium · Crit chance +1 · Crit damage medium (3 of 3)
- **Numbers:** half of the Bleed left after the hit's own closing (`STATUS.bleed.drop`), which is exactly what closed.
- **Code:** as today's Bellows lantern, with Bleed, read after the wound's own reaction to the hit.
- **Serves:** Cuts 2 ●●●, Hunt ●
- **Notes:** Changed as its line says. At a half, the wound never closes under its holder's hits and still closes under everyone else's; any share above a half makes it grow with no ceiling (*Challenges*, *Loops*).

### Bloodlust draught
- **Is:** vial · rare
- **Card:** Its holder starts every fight at half its HP: anything it has above half is lost, as a drawback, which isn't damage and isn't a price paid. Its Lifesteal is doubled until it's healed to full.
- **Stats:** Lifesteal medium · HP +1 · Attack +1 (3 of 3)
- **Numbers:** half of max HP; Lifesteal doubled. A holder that starts below half keeps what it has.
- **Code:** as today's Bloodlust draught.
- **Serves:** Pact 2 ●●●, Cuts ● ⚙ brink (key)
- **Notes:** Today's legendary at rare: the size stays, Lifesteal drops to medium. Its line says "(it pays)" and the spine's own definition says a drawback at a fight's start isn't a price paid; the card follows the definition (*Challenges*). Fired again by the opening, the drop doesn't happen and the doubling does. On a Vampire it multiplies with Bloodlust.

### Heartsblood
- **Is:** vial · legendary
- **Card:** Whatever its holder's Lifesteal heals it for, every other ally is healed for the same. The amount is counted before any of it is lost to a full HP bar, and healing given this way isn't passed on again.
- **Stats:** Lifesteal high · HP +1 · Attack +1 (4 of 4)
- **Numbers:** the same amount to each other ally, every hit.
- **Code:** a reaction to its holder's own Lifesteal that reads the amount before overheal (*Code support*). 23.
- **Serves:** Pact 3 ●●●, Cuts ●● ⚙ red stone (half)
- **Notes:** Counted before overheal so a full drinker still feeds the party, which is the red stone's supply. Near the Vampire's Shared feast (*Challenges*).

## Trophy

*Wears:* Ranger, Assassin, Geomancer. *Signature:* Crit damage.

### Wolf pelt
- **Is:** trophy · common
- **Card:** Nothing beyond its stats.
- **Stats:** Crit damage medium (1 of 1)
- **Numbers:** `SPECIAL.crit_damage.medium`.
- **Code:** none.
- **Serves:** the Hunt, and Landslide's crits.
- **Notes:** Today's name and step.

### Geode
- **Is:** trophy · common
- **Card:** Nothing beyond its stats.
- **Stats:** Defense +1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** Landslide.
- **Notes:** Today's name and step.

### Hunter's skull
- **Is:** trophy · uncommon
- **Card:** Each killing blow its holder lands gives it 3 Heat.
- **Stats:** Crit damage medium · Crit chance +1 (2 of 2)
- **Numbers:** 3 Heat a killing blow, to Heat's own definition (`fill/shared.md`): a medium special stat's worth of speed in everything, at once.
- **Code:** as today's Hunter's skull, on Heat's new meaning.
- **Serves:** Hunt 1 ●●, Cuts ● ◆ kill-pays
- **Notes:** The line says "a Heat"; the count is the card's to set, and one Heat is a twentieth faster, which a kill wouldn't show. Three shows on the next swing. A kill by a status isn't a killing blow.

### Eagle feather
- **Is:** trophy · uncommon
- **Card:** Its holder's crits Slow their target.
- **Stats:** Crit damage medium · Accuracy medium (2 of 2)
- **Numbers:** Slow at its own size and length (`STATUS.slow`).
- **Code:** as today's Eagle feather.
- **Serves:** foes do less, Hunt ●, Snap ●
- **Notes:** Kept: card, size and stats are today's.

### Vulture's skull
- **Is:** trophy · rare
- **Card:** Its holder's hits on a Stunned foe crit four times in five, whatever its crit chance. Nothing raises that chance.
- **Stats:** Crit damage medium · Defense +1 · Attack +1 (3 of 3)
- **Numbers:** 80%, a set chance on those hits. A hit that always crits still does.
- **Code:** a crit rule on a condition, as today's Venom vial's; set, and closed to doublings (*Code support*).
- **Serves:** Landslide 2 ●●●, Snap 2 ●●●, Hunt ●● ⚙ emptied quiver (half) ◆ held
- **Notes:** "Nearly always" needs one number across the shares (*Challenges*). Four in five is the link's size: a run of three or four, ended by the crit that fails.

### Ogre's tusk
- **Is:** trophy · rare
- **Card:** Its holder's hits on the foe with the highest current HP deal half again as much.
- **Stats:** Crit damage medium · Defense +1 · Crit chance +1 (3 of 3)
- **Numbers:** 50% more. Foes tied for the highest all count.
- **Code:** as today's Ogre's tusk, on a new condition: the target's rank among the foes (*Code support*).
- **Serves:** Landslide 2 ●●●
- **Notes:** Changed as its line says, from a third more above half HP. Against a lone boss it's always on. "The foe with the highest current HP" mirrors the vocabulary's phrase for the lowest.

### Dragon's tooth
- **Is:** trophy · rare
- **Card:** Each crit its holder lands strikes its target again: a second hit for a third of the crit as it was struck. The second hit can't crit and doesn't strike again.
- **Stats:** Crit damage medium · Crit chance +1 · Attack +1 (3 of 3)
- **Numbers:** a third of the crit before Defense. The second hit is a hit: it meets Evasion and Defense, pays a wound and drinks.
- **Code:** 16, 23, as today's Dragon's tooth, with a hit in place of untyped damage.
- **Serves:** Landslide ●●, Hunt ●●, Cuts ●●
- **Notes:** Today's legendary at rare. "Past Defense" goes: no piece sends a hit past it. The second hit is an extra strike.

### The king's head
- **Is:** trophy · legendary
- **Card:** When its holder lands a killing blow, every ally's crit chance is doubled for a while.
- **Stats:** Crit damage high · Crit chance +1 · Accuracy medium (4 of 4)
- **Numbers:** doubled for 20 ticks, renewed by each killing blow.
- **Code:** as today's The king's head.
- **Serves:** Hunt 3 ●●●, Landslide ●● ⚙ emptied quiver (half) ◆ kill-pays
- **Notes:** Kept: today's card and stats. "A while" changed from 10 ticks to 20: in 10 each ally swings once, which isn't a spell of crits. It's this piece's own status, so its length is this piece's. See *Loops*.

## Bell

*Wears:* Bard, Monk, Stormcaller. *Signature:* Attack speed.

### Prayer bell
- **Is:** bell · common
- **Card:** Nothing beyond its stats.
- **Stats:** Attack speed medium (1 of 1)
- **Numbers:** `SPECIAL.attack_speed.medium`.
- **Code:** none.
- **Serves:** Thousand Cuts and the Storm.
- **Notes:** Today's name and step.

### Cantor's bell
- **Is:** bell · common
- **Card:** Nothing beyond its stats.
- **Stats:** MP regen +1 (1 of 1)
- **Numbers:** `MP_REGEN_STEP`.
- **Code:** none.
- **Serves:** Barrage.
- **Notes:** A new name. The row's "Attack speed and MP regen", with MP regen picked, since Barrage is the road the bell's other common doesn't start. Today's Temple bell carried Evasion, which is no road's first stat on a bell; it could stand in place of this one if the lead prefers the kept name.

### Ringing bell
- **Is:** bell · uncommon
- **Card:** Every fourth basic attack its holder lands rings: a light hit on every foe (from its holder's Attack), carrying what the swing carries. The ring's hits aren't counted, and nothing repeats them.
- **Stats:** Attack speed medium · Attack +1 (2 of 2)
- **Numbers:** every fourth basic attack landed, on a count shown and kept for the fight; a light hit, `HIT.light` of Attack. A fist weapon comes round in about 24 ticks.
- **Code:** 12, 23; the count as 7's.
- **Serves:** Storm 1 ●●, Cuts 1 ●● ⚙ red rain (half), reaping (half) ◆ wide-hit
- **Notes:** The ring's hits are hits, so each pays a wound and each adds the riders. Extra strikes don't count toward the fourth. "Light" is the line's word; against a fast kind's swing it's two swings' worth on every foe (*Least sure*). Reads close to Storm pike on a Monk (*Challenges*).

### Pacer's bell
- **Is:** bell · uncommon
- **Card:** Each time its holder casts an ability, it's Hasted.
- **Stats:** Attack speed medium · MP regen +1 (2 of 2)
- **Numbers:** Haste at its own size and length (`STATUS.haste`), when the cast resolves.
- **Code:** none.
- **Serves:** Cuts 1 ●●, Storm ●, Barrage ●
- **Notes:** Haste outlasts a quick cooldown, so a unit with a quick ability and the mana is Hasted all fight. Mana is what it costs, which is the stat it carries. It's a status its holder gives itself.

### Bell of the hour
- **Is:** bell · rare
- **Card:** Every fifth basic attack its holder lands casts its first-slotted ability off its cooldown.
- **Stats:** Attack speed medium · MP regen +2 (3 of 3)
- **Numbers:** every fifth basic attack landed, on a count shown and kept for the fight. The MP is paid; with too little the cast doesn't fire and the count starts again.
- **Code:** 7.
- **Serves:** Cuts 2 ●●●, Barrage 2 ●●● ⚙ spell on the swing (key)
- **Notes:** Today's name, a new effect. **The line says every eighth; I've written every fifth** (*Challenges*). The cast is a cast like any other: it adds a Crescendo, counts for a third-cast piece, and an Encore can repeat it. An ability waiting on its own condition doesn't fire. Extra strikes don't count.

### Warding bell
- **Is:** bell · rare
- **Card:** Every so often, it lifts one debuff from the ally holding the most. A Silence comes first: while any ally is Silenced, it lifts that.
- **Stats:** Attack speed medium · MP regen +1 · Evasion medium (3 of 3)
- **Numbers:** every so often: `COOLDOWN.short`, the first beat halfway, as today's. "The most" is the most different debuffs.
- **Code:** as today's Warding bell, with a named debuff picked first as today's Waking bell picks it.
- **Serves:** Barrage ●●, Toll ●
- **Notes:** Today's card, stats and beat, with the Silence clause its line adds.

### Tireless bell
- **Is:** bell · legendary
- **Card:** Its holder keeps making basic attacks while it winds up an ability.
- **Stats:** Attack speed high · Double strike medium · Attack +1 (4 of 4)
- **Numbers:** none: its swings come on their own interval through a wind-up.
- **Code:** 17.
- **Serves:** exotic, Storm ●●, Cuts ●●, Barrage ●●
- **Notes:** Written as its line stands, and it does almost nothing for any of its three wearers (*Challenges*, first).

## Cloak

*Wears:* Valkyrie, Monk, Ranger. *Signature:* Evasion.

### Traveller's cloak
- **Is:** cloak · common
- **Card:** Nothing beyond its stats.
- **Stats:** Evasion medium (1 of 1)
- **Numbers:** `SPECIAL.evasion.medium`.
- **Code:** none.
- **Serves:** the Toll's dancer, Thousand Cuts and the Hunt: Evasion is the cloak's first stat on all three.
- **Notes:** Today's name and step.

### Swallowtail cloak
- **Is:** cloak · common
- **Card:** Nothing beyond its stats.
- **Stats:** Attack speed medium (1 of 1)
- **Numbers:** `SPECIAL.attack_speed.medium`.
- **Code:** none.
- **Serves:** Thousand Cuts.
- **Notes:** A new name. The row's "Evasion and Attack speed", with Attack speed picked. Today's Swan-feather cloak carried Defense, which neither row names.

### Hooded cloak
- **Is:** cloak · uncommon
- **Card:** Each time its holder dodges a hit, it gains a Shield of a sixth of its Attack.
- **Stats:** Evasion medium · Attack +1 (2 of 2)
- **Numbers:** a sixth of Attack (the size of `HIT.touch`), into its one Shield pool, up to the pool's cap. At Attack 4 that's most of a minion's swing.
- **Code:** a dodge's reaction as today's Hooded cloak, giving a Shield as today's Glyphed robe does.
- **Serves:** Toll 1 ●●, Cuts ● ⚙ riposte (half), detonation (half) ◆ shield-by-doing
- **Notes:** Today's name, changed as its line says: a Shield in place of a few Might. Sized so one dodge banks about the blow that lands next.

### Feathered cloak
- **Is:** cloak · uncommon
- **Card:** The first time each fight its holder drops below half its HP, it's Hidden.
- **Stats:** Evasion medium · Crit chance +1 (2 of 2)
- **Numbers:** Hidden at its own length (`STATUS.hidden`), once a fight.
- **Code:** as today's Feathered cloak.
- **Serves:** net, Hunt ● ⚙ two in the dark (half)
- **Notes:** Kept: card, size and stats are today's. A Taunting holder isn't Hidden, and the once is spent.

### Matador's cape
- **Is:** cloak · uncommon
- **Card:** Each time its holder dodges a hit, it Taunts.
- **Stats:** Evasion medium · Defense +1 (2 of 2)
- **Numbers:** Taunt at its own length (`STATUS.taunt`), laid again on every dodge.
- **Code:** none.
- **Serves:** Toll 1 ●●, Cuts ● ⚙ riposte (half) ◆ draw
- **Notes:** After its first dodge a good dodger Taunts for the rest of the fight. It's a status its holder gives itself, and it ends any Hidden. Defense is for the blows it now takes.

### Dancer's cloak
- **Is:** cloak · rare
- **Card:** Each time its holder dodges a hit, its ability nearest to ready is ready at once.
- **Stats:** Evasion medium · Defense +1 · Attack +1 (3 of 3)
- **Numbers:** a whole cooldown a dodge.
- **Code:** as today's Dancer's cloak, with ready in place of a few ticks.
- **Serves:** Toll 2 ●●, Cuts 2 ●●, Barrage ●
- **Notes:** Today's piece, changed as its line says. Mana is what it runs out of, and the Monk's pool is the smallest in the set.

### Tempest cloak
- **Is:** cloak · rare
- **Card:** Each time its holder dodges a hit, its next basic attack comes at once and strikes twice. The cloak adds no third strike.
- **Stats:** Evasion medium · Attack speed medium · Attack +1 (3 of 3)
- **Numbers:** one swing at once, with one extra strike on the same target. "At once" doesn't stack.
- **Code:** as today's Tempest cloak. 23.
- **Serves:** Toll 2 ●●●, Cuts 2 ●●● ⚙ riposte (key)
- **Notes:** Today's legendary at rare: the card stays, Evasion drops to medium. The swing is a basic attack at whoever it picks, not at the attacker. Its second strike is an extra strike, on top of Double strike's own.

### Shadow cloak
- **Is:** cloak · rare
- **Card:** Its holder is Hidden when each fight starts, and again each time a foe falls.
- **Stats:** Evasion medium · Crit chance +1 · Attack +1 (3 of 3)
- **Numbers:** Hidden at its own length (`STATUS.hidden`), at the start and at every foe's fall, anyone's kill.
- **Code:** none: Hidden at the start as today's Shadow mantle, and on a fall. 8 fires the start again.
- **Serves:** exotic, Hunt ●● ⚙ two in the dark (key) ◆ kill-pays
- **Notes:** The Decoy's Shadow seat shares its sentence, as a piece and a seat may. A Taunting holder isn't Hidden. Three of them on one party is a problem (*Loops*).

### Swan's grace
- **Is:** cloak · legendary
- **Card:** Once a fight, the blow that would knock its holder out leaves it at 1 HP and Hidden.
- **Stats:** Evasion high · Attack +1 · Crit chance +1 (4 of 4)
- **Numbers:** 1 HP; Hidden at its own length.
- **Code:** as today's Swan's grace.
- **Serves:** net ⚙ two in the dark (half)
- **Notes:** Kept: card, size and stats are today's. "The blow" is any damage that would knock it out, a status's included.

## Challenges

In the order they matter.

1. **Tireless bell has no wearer who can use it.** Every base ability of the Bard, the Monk and the Stormcaller winds up for 1 tick, or 3 (Pressure point, Thunderstorm), and no version of theirs lengthens one. Against swings of 6 ticks or more, the bell is about one extra swing in three casts. The long wind-ups are the Pyromancer's, the Frostweaver's, the Geomancer's, the Paladin's and the Hoplite's, and none holds a bell. It wants another kind (the orb, the lantern or the tome) or a wider rule (its swings never wait on its abilities, recovery included).
2. **Bell of the hour: every eighth doesn't meet its link.** The link is sized so the count "comes round several times a fight on a fast unit". Eight swings are 48 ticks on a fist weapon and 53 on a wand, against regular fights of 20 to 60: once in a long fight, and never in a short one, since the count ends with the fight. builds.md says "every few swings". I wrote every fifth: 30 ticks plain, about 21 under Haste, about 15 on Hummingbird charm. Mana still stops it. Put back to eight if the count is the line's and not the fill's.
3. **Two of the tome's three uncommons do nothing on a Bard.** No Bard ability aims at a foe or hits one, so Marginalia and Curse-book are their stats. The kind rule only asks that every wearer reads the signature, and it does.
4. **"At that foe": does a Taunt turn it?** The lines don't say. I wrote Hushing idol's called swing as going past any Taunt, as a reaction's strike does, because a caster behind a Taunting front is the case the piece exists for. I wrote Marginalia inside the Taunt rule, because it only changes a target phrase and gives no Seek. One ruling should cover both.
5. **Bloodlust draught's "(it pays)" against the spine's own "Pays HP".** *New words* says HP lost to a drawback at a fight's start isn't a price paid. If the card says "it pays", a player expects Bloodstone reliquary to answer it with a heal of half a health bar. The card follows the definition and says it isn't a price.
6. **Annotated grimoire's "pays for" under an HP price.** Today it reads MP paid. Under Sanguine vestments or The covenant its holder pays HP and no MP, so the grimoire either never fires or always does. I kept today's card; "pays MP for" would settle it as never.
7. **"Nearly always" needs one number and one rule.** Vulture's skull is mine, Ambush knife is weapons-1's. I wrote four in five, a set chance that nothing raises. It also needs an answer against Gambler's coin, which sets crit chance to about half and only spares hits that always crit; I'd let the narrower piece win.
8. **Venom vial can't deepen a wound without a loop.** Bleed has no cap. At any share above a half each of its holder's hits leaves the wound bigger than it found it, with no end but the other allies' hits. I sized it at exactly a half, so the line's "deepen on its own" reads as "never closes" on the card.
9. **Snowbound folio beside Grimoire of plagues, in one kind.** When the grimoire rolls Chill it's the folio and one more. I kept them the same size, so the choice is certainty against breadth, not small against big. A fresh reader may still call the folio the rare made smaller.
10. **Ringing bell and Storm pike on a Monk** come out as nearly one sentence: every fourth basic attack, or every fifth hit, a light hit on every foe carrying what the swing carries. One unit can hold both.
11. **The deep well's mana as armour tag.** It can't sit with either keystone (one is an orb, and the other is an idol its wearers don't hold), and it gives no mana to anyone. I copied the tag and can't size a link for it.
12. **Heartsblood: counted before overheal?** Read to the letter, a full drinker heals nothing and so gives nothing. I wrote the amount as counted before it's lost, which is what makes it the red stone's supply. It's also the Vampire's Shared feast made wider and unconditional; the ruling is that an upgrade never copies a piece, and these don't share a sentence.
13. **"The longest cooldown" or "the longest cooldown left"?** Frozen tome's line and Icebreaker charm's say the first, Bounty charm's the second. I wrote Frozen tome on the ability's full cooldown, so every shatter rings the same great spell.
14. **"Carrying what the swing carries" leaves out the storm.** The definition lists gear, a seat and a passive. Thunderstorm's Shock is a status from an ability, so by the letter the Ringing bell doesn't carry it, though builds.md counts a storm among a swing's riders.
15. **Names.**
    - **Bloodletter's phial** beside **Bloodletter**, the sword rare. I'd call the vial *Lancet phial*.
    - **Idol of the deepening** beside **Idol of the deep**, in one kind, doing unrelated things. I'd call the first *Festering idol*.
    - **Annotated score** and **Annotated grimoire** are both tomes about free casts; one could change.
    - **Cantor's bell** and **Swallowtail cloak** are new commons; Temple bell and Swan-feather cloak are dropped.
16. **Start-of-fight "a few" should be one size in every share.** Mine are the plain word from Attack. Stormglass totem and Pitch lantern are offhands-1's.

## Links

- **Detonation** (Hooded cloak, half). A sixth of Attack a dodge, into the one pool. The readers want "the most that Shield held": a dancer's pool is small and breaks often, so its breaks are many and small.
- **Frozen gate** (Orb of the long winter, half). A quarter of max MP a shatter. The other side has to shatter a pack on the wall several times a fight, and the mage beside the wall holds the orb.
- **Reaping** (Last page and Ringing bell, halves). Last page fells everything under a tenth when anything falls; the ring is a light hit on every foe each fourth swing. The other side is the execute that makes the first kill.
- **Opening again** (Snowbound folio, Grimoire of plagues, Scrying orb and Bloodletter's phial, halves). Each does again what it did, at the same size. Tally coat is Leather, so it meets the phial on an Assassin, the tome only on a Bard, and never an orb. For the rest the keystone is Second dawn alone.
- **Fuse** (Smouldering orb, key). A third of the fallen foe's Burn to each other foe. It needs a burning foe to fall while others stand, so a party that kills the weakest first.
- **Spell on the swing** (Bell of the hour, key). Every fifth basic attack. It needs speed (one speed piece brings it round two or three times a regular fight), a well, and the right ability slotted first.
- **Red rain** (Curse-book, Bloodletter's phial and Ringing bell, halves). Curse-book lays about four Bleed a foe with each wide cast, which pays about what a Blizzard deals on the next wide hit. The phial lays about three, once. The ring is the pourer. The link's size is met only by Curse-book; the phial needs a wide hit early, before single hits close its wounds.
- **Riposte** (Tempest cloak, key; Hooded cloak and Matador's cape, halves). One swing at once with two strikes, a dodge. All three are cloaks, so the cape's draw can't sit under the Tempest cloak: its draw has to be a kit's (Stillness of mind, Over the fallen) or the amulet's. The cape pairs with Duelist's leathers and Parrying spear.
- **Every colour** (Grimoire of plagues, key; Snowbound folio, Curse-book, Idol of the deepening and Bloodletter's phial, halves). Two afflictions at two or three stacks on every foe. Malison has to land early: at that size the Burn is gone in about ten ticks unless fed, and Shock after two of the foe's actions. The idol's one stack a hit keeps a kind alive on what its holder is hitting.
- **Emptied quiver** (Vulture's skull and The king's head, halves). Four in five on a Stunned foe; crit chance doubled for 20 ticks after a kill. The reader is Quick draw. See *Loops*.
- **Blood mage** (Blood vial and Idol of the blood-well, halves). The vial's price is the full MP cost in HP; the idol turns a price into MP, one for one. Neither wearer of the vial has a wide spell, as the spine says. The idol needs a price of real size: Blood gift's fifth.
- **Resonance** (Mana pearl and Orb of the long winter, halves). 15% of max MP a fall; a quarter a shatter. Between them a pack that's falling or shattering keeps the spell paid for, which takes away the link's mana brake.
- **Crescendo** (Orb of the rising sun, key; Twice-told tome, Annotated score, Annotated grimoire and The deep well, halves). The orb can't sit with either tome. So the tomes' free casts skip Crescendo charm's price only, and the orb's holder never has a price to skip.
- **Mana as armour** (Orb of the deep and Idol of the deep, keys; Leech idol, half). One MP for one damage. A giver has to give about a foe's swing at a time (500 or more) for a gift to read as a blow not taken. Clarity does. Leech idol's spill is a tenth of a hit and doesn't.
- **Shatter bell** (Frozen tome, key). Half the wait, for the whole party. It needs shatters on a beat, and abilities worth ringing for on the other two.
- **Firecracker** (Snowbound folio, half). Two or three Chill on every foe. That makes a field "already cold" only beside another wide source.
- **Brink** (Blood vial and Bloodlust draught, keys). The draught puts its holder at half from the first tick. The vial keeps an Assassin low and a Vampire barely. The other side is the gifts to the ally with the lowest share of HP.
- **Two in the dark** (Shadow cloak, key; Feathered cloak and Swan's grace, halves). Hidden for its own length at the start and at each fall: most of a pack fight, and the first moments of a boss fight. It needs a second hider and an anchor that wants every blow.
- **Red stone** (Crimson dregs and Heartsblood, halves). A fifth of each hit on a bleeding foe; Lifesteal's amount to both other allies. The keystone on a healed ally (Red stone mail) turns Heartsblood into stone for the party.

## Loops

Found in this share:
- **Two Annotated scores, each on the other's highest-Attack ally.** Each cast makes the other's next cast free, so neither pays again. Cooldowns and wind-ups are the only brake. Reading only casts that were paid for would end it.
- **The king's head beside a Quick draw Ranger.** Crit chance caps at 100. A Ranger at half or more is certain to crit for 20 ticks, every crit brings the next arrow at once, and no crit fails. The foes running out is the only brake.
- **Vulture's skull with Quick draw.** A burst on a Stunned foe that takes no time. Its brake is the one crit in five that fails, which is why the card closes that chance to doublings.
- **Venom vial.** Sized at a half so there's none. With a Bleed rider on the same unit (Ragged axe) the wound grows by the rider's stacks every hit. The other allies' hits close it.
- **Three Shadow cloaks** (Valkyrie, Monk and Ranger each hold one), or one under a Decoy. All three are Hidden at the start and after every fall, and the foes have nobody to pick. Hidden's own length against the gap between kills is the brake, and a lone boss gets only the first moments. The engine needs an answer for a foe with no one to pick.
- **Frozen tome in a chain of shatters.** Each shatter halves every ally's longest wait, so a chain of four leaves a sixteenth. The chain's own damping, wind-ups and mana are the brakes.
- **The deep well beside Clear-headed charm.** Below half its MP it gains Clarity, and while that lasts it casts free. It settles round half a pool and never runs dry. Clarity's length against the charm's beat is the brake.
- **Bell of the hour with Cadenza slotted first.** Three swings at once count toward the next five. Two real swings a round and Cadenza's cost are the brakes.
- **Smouldering orb in a pack.** A fall flares the field, which fells the next, which flares it again. The foes run out.
- **Scrying orb under Second dawn.** Every fall readies its nearest ability. The foes run out; mana and wind-ups slow it.
- **Hunter's skull.** Heat brings kills sooner and kills bring Heat. Heat's ceiling of ten ends it.
- **Pacer's bell.** Haste brings casts sooner and casts renew Haste. It's a refresh, so it settles at Haste all fight. Mana.
- **Dancer's cloak under a draw.** Every dodge readies an ability, the Taunt among them. The foes' swings and the holder's mana are the brakes.

Known to the spine, with this share's side:
- **Tempest cloak with Provoking blade,** on a Valkyrie. The dodge that fails.
- **Matador's cape, a copied Taunt and Goading totem.** The cape lays its Taunt again on every dodge, which is what turns it. A round with no dodge.
- **Orb of the long winter with Icebreaker charm,** and the same with Resonant robes. At a quarter of max MP a shatter, one shatter doesn't pay for a Blizzard and three do.
- **Last page.** The foes run out.
- **Shroud charm or Aegis mail on a Blood vial's holder.** Healing back over the line.

Not loops, and worth knowing:
- **Tempest cloak with Flurry wraps** on a Monk: the cloak's second strike is an extra strike, so Flurry rolls on from it, up to its own count.
- **Idol of binding under Withering hex** holds its double on every foe its holder swings at twice. Bosses resist the Slow, not the double.
- **Orb of the deep with Sanguine vestments:** the casts are paid in HP and the blows are taken in MP. The two bars swap jobs.
- **Leech idol beside Glimmer robe:** every hit of a full holder is MP given.

## Code support beyond the spine's list

- **Two different statuses picked at random, the same pair for every foe** (Grimoire of plagues). Today's pick is one status a hit.
- **A cooldown cut by a share of the wait left,** and **an ability picked by its full cooldown** (Frozen tome). Today's cut is a count of ticks, on the longest wait left.
- **A set crit chance on a condition that nothing doubles** (Vulture's skull).
- **A boost that reads the target's rank among the foes** (Ogre's tusk: the highest current HP, ties included).
- **A reaction to a unit's own Lifesteal heal that reads the amount before overheal** (Heartsblood).
- **Every MP gain past full as an event** (Leech idol, Idol of the deep). Today's Leech idol reads Siphon on a hit, with a full pool as its test.
- **A count of casts in a fight, shown on the unit** (Twice-told tome).
- **A basic attack called at a named foe, past a Taunt** (Hushing idol), if the ruling keeps it.
- **A share of a status read after that status's own reaction to the same hit** (Venom vial: Bleed pays and closes, then the vial reads what's left).
- **A foe with no one to pick** (three Shadow cloaks): what it does with its action.
- **A fall that isn't damage** (Last page), so no Shield or Aegis stands in its way.

## Least sure

- **Bell of the hour's count.** Five is my number against the line's eight. On a Monk with a Stun slotted first it's a Stun every 20 to 30 ticks, until its small pool is gone.
- **Tireless bell.** A legendary that reads as its stats.
- **The start-of-fight sizes.** Two or three Chill of a cap of twelve is what a Blizzard lays, and Chill's counts are already the balance pass's first job. The folio is seen as an icon on every foe; whether it's felt is another matter. Twice the word is the lever, for the folio and the grimoire together.
- **Ringing bell's "light".** On a fast kind the ring is worth two swings on every foe, so in a pack it's most of its holder's damage. The spine's "a small number on every foe" suggests `HIT.touch`.
- **Hunter's skull at three Heat a kill.** Two kills are a Haste's worth in everything, for the fight, on an uncommon.
- **Leech idol.** Its link is as big as Siphon medium: about a tenth of each hit, one cast's worth to the caster in a fight. Siphon also still reads a foe's MP, which the player can't see.
- **Fanged idol.** One Rot a foe a fight is nothing against a boss that heals all fight.
- **Warding bell against a Silence.** Its beat is 22 ticks and a Silence lasts 16, so it lifts about half of each one on average, and misses some altogether.
- **Mana pearl and Orb of the long winter together** on the roads' two biggest pools. I sized each to be seen alone.
- **Heartsblood.** It triples what Lifesteal heals, every hit, and a Vampire's Lifesteal is already high.
- **Idol of binding at rare.** Double, held all fight by a Hexer's swings or a Vampire's cheapest spell.
- **Marginalia.** It scatters a pile to chase a caster, and it does nothing in a fight with no wind-ups.
- **The stats.** Each piece's steps are my read of its road's careful pick. Three I'd look at: no MP on Leech idol, MP regen +2 on Bell of the hour, and Defense on two trophies for the Geomancer's sake.
- **The two commons I renamed,** and the choice of MP regen over Evasion for the bell's second.
