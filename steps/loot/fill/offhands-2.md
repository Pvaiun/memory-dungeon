# The fill: offhands, the other seven kinds

Tome, orb, idol, vial, trophy, bell and cloak: 63 pieces (14 commons, 16 uncommons, 21 rares, 12 legendaries), in the spine's order. Every offhand takes the standard ladder: one step, two, three, four. Every value is a first value. Round 1's rulings are applied; what's still open is under *Challenges*.

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
- **Notes:** Today's name and step. Both rows name Cooldown first and the two commons have to differ, so this one takes its row's other stat.

### Hymnal
- **Is:** tome · common
- **Card:** Nothing beyond its stats.
- **Stats:** Cooldown medium (1 of 1)
- **Numbers:** `SPECIAL.cooldown.medium`.
- **Code:** none.
- **Serves:** Barrage.
- **Notes:** Today's name and step: the first stat its row names, and the signature.

### Snowbound folio
- **Is:** tome · uncommon
- **Card:** When each fight starts, every foe gains a few Chill (from its holder's Attack).
- **Stats:** Cooldown medium · Attack +1 (2 of 2)
- **Numbers:** a few: `STACKS.few` from the holder's Attack, through `own()`. About two on a Bard or a Frostweaver, about three on a Hexer, of `STATUS.chill.cap`.
- **Code:** as today's Snowbound folio. 8 fires it again.
- **Serves:** Snap 1 ●● ⚙ opening again (half), every colour (half), firecracker (half)
- **Notes:** Today's card and size. It's what one Blizzard or one Stillness lays on a field, free and at the first tick: an icon and a number on every foe, and one cast fewer to the first shatter.

### Marginalia
- **Is:** tome · uncommon
- **Card:** While a foe is in a wind-up, its holder's abilities that aim at one foe aim at the casting foe with the highest Attack instead. A Taunt still decides the pick for an ability without Seek.
- **Stats:** Cooldown medium · Cast speed medium (2 of 2)
- **Numbers:** none.
- **Code:** 21.
- **Serves:** stops a cast, Snap ●, Toll ●
- **Notes:** It changes whom an ability picks, so it's inside the Taunt rule. Abilities that hit every foe or aim at an ally aren't touched; an ability that picks several foes changes its first pick only. The new phrase is the ability's own, so a Mark doesn't steer it. Cast speed is the careful stat: the redirected cast has to land inside the foe's wind-up. Does nothing on a Bard (*Least sure*).

### Curse-book
- **Is:** tome · uncommon
- **Card:** Its holder's abilities add several Bleed to each foe they hit (from its holder's Attack).
- **Stats:** Cooldown medium · MP regen +1 (2 of 2)
- **Numbers:** several: `STACKS.several` through `own()`, from its holder's Attack. About four a foe on a Frostweaver, five or six on a Hexer.
- **Code:** none: a rider on an ability's hit, as the kits' are.
- **Serves:** Cuts 1 ●● ⚙ red rain (half), every colour (half)
- **Notes:** "Hit" is the vocabulary's: an ability that deals no damage (Enfeeble, Stillness, Unmake) adds nothing. The Bleed lands after the hit, so it pays on the next one. Sized to come at a cast's pace: at a few a Blizzard's wounds paid half what the Blizzard dealt. The card says "several" (round 3): a piece's stack word is the piece's count whatever hit carries it, and its first card said "a few" for twice Jolt spear's few. Does nothing on a Bard (*Least sure*).

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
- **Notes:** The second cast gains a Crescendo as it finishes and skips a climbing price; being free, it isn't paid for. Where an Encore lands on the same cast, each repeats the first cast once: three in all.

### Grimoire of plagues
- **Is:** tome · rare
- **Card:** When each fight starts, two of Burn, Chill, Shock and Bleed are picked at random, and every foe gains a few stacks of each (from its holder's Attack).
- **Stats:** Cooldown medium · Attack +1 · MP regen +1 (3 of 3)
- **Numbers:** a few of each: `own("few", "attack")`, the same size as Snowbound folio's. Two different statuses, the same two on every foe, picked afresh each time it happens.
- **Code:** as today's Wildmagic wand's random pick, at a fight's start. 8 fires it again, with a new pick.
- **Serves:** Bonfire ●●, Snap ●●, Storm ●●, Cuts ●● ⚙ every colour (key), opening again (half)
- **Notes:** One pick for the whole field, so the fight reads as one thing ("fire and frost") and the party's piles have somewhere to start. Kept at the folio's size so the folio isn't this piece made smaller. The pair is on the director's list (*Challenges*).

### Accompanist's score
- **Is:** tome · rare
- **Card:** Each time the other ally with the highest Attack pays for an ability, its holder's next ability is free. It holds one free cast at a time.
- **Stats:** Cooldown medium · Attack +1 · MP +1 (3 of 3)
- **Numbers:** a whole cast's cost, in MP or in HP. "Pays for" is a cost paid, in MP or in HP; a free cast isn't paid for.
- **Code:** as today's Annotated grimoire's free-cast marker, set when a named ally pays for a cast.
- **Serves:** Barrage 2 ●● ⚙ crescendo (half) ◆ free-cast
- **Notes:** The free cast still gains a Crescendo. Two of these facing each other no longer run free: a free cast sets nothing off, so one of the two always pays. The card says "is free", as round 2 rules: a free cast costs nothing, so its holder under The covenant or Flagellant's vestments pays no HP for it either.

### Last page
- **Is:** tome · legendary
- **Card:** When a foe falls, every foe below a tenth of its max HP falls too.
- **Stats:** Cooldown high · Attack +1 · MP +1 (4 of 4)
- **Numbers:** a tenth of max HP.
- **Code:** as today's Last page.
- **Serves:** Hunt 3 ●●, Storm ● ⚙ reaping (half)
- **Notes:** Kept: card, size and stats are today's. Each fall it causes checks again, and the foes run out. Its falls are nobody's killing blow: "when a foe falls" pieces fire, "a killing blow its holder lands" pieces don't. Today it deals damage worth the foe's HP and Shield, which an Aegis over a big Shield could block; the card promises a fall, so build it as one.

### Annotated grimoire
- **Is:** tome · legendary
- **Card:** Each ability its holder pays for makes the next ability any ally casts free.
- **Stats:** Cooldown high · MP +1 · MP regen +1 (4 of 4)
- **Numbers:** a whole cast's cost, whatever it's paid in. One free cast is held at a time, and a free cast doesn't make another.
- **Code:** as today's Annotated grimoire, with a cost paid in HP counted as one paid in MP (*Code support*).
- **Serves:** Barrage 3 ●●● ⚙ crescendo (half) ◆ free-cast
- **Notes:** Kept: card, size and stats are today's. "Any ally" includes its holder. "Pays for" is in MP or in HP, so it works under an HP price.

### Frozen tome
- **Is:** tome · legendary
- **Card:** Each time a foe's Chill shatters, every ally's first-slotted ability comes half its wait closer.
- **Stats:** Cooldown medium · Attack +2 · Cast speed medium (4 of 4)
- **Numbers:** half of the wait left, each shatter, anyone's, on each ally's first-slotted ability, by the director's ruling after gate 2: the player picks what rings by the order they slot abilities in.
- **Code:** the trigger as today's Orb of the long winter. Two things are new: a cut by a share of the wait in place of a count of ticks, and a pick by an ability's whole cooldown (*Code support*).
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
- **Notes:** Today's name and step: the first stat its row names.

### Ember orb
- **Is:** orb · common
- **Card:** Nothing beyond its stats.
- **Stats:** Attack +1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** Bonfire and Cold Snap.
- **Notes:** Today's name and step. Its row names MP first, which Glass orb carries, so it takes Attack.

### Scrying orb
- **Is:** orb · uncommon
- **Card:** When each fight starts, its holder's ability nearest to ready is ready at once.
- **Stats:** MP +1 · Attack +1 (2 of 2)
- **Numbers:** a whole cooldown: the ability with the least wait left among those still cooling.
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

### Meltwater orb
- **Is:** orb · rare
- **Card:** When a foe's Chill shatters, its holder regains a quarter of its max MP.
- **Stats:** MP +1 · Attack +1 · Cooldown medium (3 of 3)
- **Numbers:** a quarter of max MP a shatter, anyone's: between a Frost lance and a Stillness for the Frostweaver, a Fireball for the Pyromancer.
- **Code:** the trigger as today's Orb of the long winter; the gain as today's Mana pearl.
- **Serves:** Snap 2 ●●●, Barrage 2 ●● ⚙ frozen gate (half), resonance (half) ◆ free-cast
- **Notes:** Today's Orb of the long winter, renamed and changed as its line says: mana in place of a few ticks. "About a cast's worth" is the middle spell of each wearer.

### Smouldering orb
- **Is:** orb · rare
- **Card:** When a burning foe falls, every other foe gains a third of the Burn it held. A fallen foe's fire moves once: if something else in the party moves it too, it's split evenly between them.
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
- **Notes:** A price isn't damage, so paying HP never touches the MP. A blow that empties the pool mid wind-up makes that cast fizzle: the cliff the engine asks for. While the MP holds, its holder's HP never drops, so nothing that watches for it dropping below half fires.

### Orb of the rising sun
- **Is:** orb · legendary
- **Card:** Each time its holder casts an ability, that ability gains a Crescendo as the cast finishes (that ability deals, heals and adds a fifth more for each Crescendo it holds, up to 10). Nothing makes its abilities cost more for the Crescendo they hold.
- **Stats:** MP +1 · Cooldown high · Cast speed medium (4 of 4)
- **Numbers:** one Crescendo a cast, to the counter's own definition (`fill/shared.md`). It lands as the cast finishes, so the first cast of an ability is plain and each one after does a fifth more than the last.
- **Code:** 11.
- **Serves:** Barrage 3 ●●●, Bonfire ●● ⚙ crescendo (key)
- **Notes:** Beside Crescendo charm one cast adds one stack, and the charm's price is switched off. Every kind of cast adds: a repeat, a free one. The card's last sentence stays (round 3): it's the orb's own rule, and the only price a Crescendo has is the one it switches off.

### The deep well
- **Is:** orb · legendary
- **Card:** While its holder holds Clarity, its abilities are free.
- **Stats:** MP +2 · Attack +1 · MP regen +1 (4 of 4)
- **Numbers:** a whole cost, in MP or in HP, for Clarity's own length (`STATUS.clarity`).
- **Code:** as today's The deep well.
- **Serves:** Barrage 3 ●●● ⚙ crescendo (half) ◆ free-cast
- **Notes:** Kept: size and stats are today's. The card says "are free" for today's "cost no MP", as round 2 rules, so under an HP price its casts cost no HP either. A cast under Clarity is free, so it isn't paid for.

## Idol

*Wears:* Hexer, Vampire. *Signature:* Siphon.

### Night mask
- **Is:** idol · common
- **Card:** Nothing beyond its stats.
- **Stats:** Siphon medium (1 of 1)
- **Numbers:** `SPECIAL.siphon.medium`.
- **Code:** none.
- **Serves:** Barrage (the blood-well).
- **Notes:** Today's name and step: the first stat its row names.

### Carved effigy
- **Is:** idol · common
- **Card:** Nothing beyond its stats.
- **Stats:** HP +1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** Blood Pact.
- **Notes:** Today's name and step. Its row names Siphon first, which Night mask carries, so it takes HP.

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
- **Numbers:** all of the overflow, point for point. "The ally with the least MP" is the lowest share of max MP, the holder included; a holder at full is never it unless everyone is full.
- **Code:** 6, as today's Leech idol for Siphon's gain; reading every other gain past full (Clarity, Refrain, a gift) is the new part. 23.
- **Serves:** Barrage 1 ●● ⚙ mana as armour (half) ◆ free-cast
- **Notes:** MP it sends is MP given, so a piece that reacts to a gift reacts to it. Its size is Siphon's, which this piece can't change (*Least sure*). No MP step: a bigger pool spills later.

### Hushing idol
- **Is:** idol · rare
- **Card:** When a foe starts a wind-up, its holder's next basic attack comes at once, at that foe, whatever Taunts.
- **Stats:** Siphon medium · Attack +1 · Lifesteal medium (3 of 3)
- **Numbers:** a whole swing a cast begun. "At once" doesn't stack: two foes starting together draw one swing.
- **Code:** 17, 23.
- **Serves:** stops a cast, Toll ●●, Snap ●
- **Notes:** The swing is aimed at a named foe, so it isn't a pick and a Taunt doesn't turn it. It's a real basic attack, so it carries what the swing carries: a Hexer's answers a cast with Chill, or with Weaken under Withering hex. If its holder is busy, the swing lands when it's next free.

### Festering idol
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
- **Notes:** Today's piece and stats; "Never Bulwark" added as its line says. A buff that can't be removed stays where it is. A stolen Taunt makes its holder Taunt. A buff it's handed this way isn't one its holder gives itself.

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
- **Numbers:** one MP for one HP paid. "Pays HP" is the spine's: a price, not a drain or a drawback. "The ally with the least MP" is the lowest share of max MP, the holder included.
- **Code:** 20.
- **Serves:** Barrage ●●●, Pact ●● ⚙ blood mage (half)
- **Notes:** It's MP given. On a Vampire the price is Blood gift's fifth of max HP, which is a Fireball's cost. The chalice takes the same slot, so the two never meet.

## Vial

*Wears:* Vampire, Assassin. *Signature:* Lifesteal.

### Red tincture
- **Is:** vial · common
- **Card:** Nothing beyond its stats.
- **Stats:** Lifesteal medium (1 of 1)
- **Numbers:** `SPECIAL.lifesteal.medium`.
- **Code:** none.
- **Serves:** Blood Pact.
- **Notes:** Today's name and step: the first stat its row names.

### Hemlock phial
- **Is:** vial · common
- **Card:** Nothing beyond its stats.
- **Stats:** Crit chance +1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** Thousand Cuts and the Hunt.
- **Notes:** Today's name and step. Its row names Lifesteal first, which Red tincture carries, so it takes Crit chance.

### Crimson dregs
- **Is:** vial · uncommon
- **Card:** Its holder's hits on a bleeding foe heal its holder for a fifth of their damage.
- **Stats:** Lifesteal medium · HP +1 (2 of 2)
- **Numbers:** a fifth of the damage dealt (the size of `SPECIAL.lifesteal.high`), on top of any Lifesteal. It's a heal of its own, so nothing that doubles Lifesteal doubles it.
- **Code:** as today's Crimson dregs.
- **Serves:** Cuts 1 ●●, Pact 1 ●● ⚙ red stone (half)
- **Notes:** Today's card. Size changed from a tenth: on an Assassin's hit that was a number too small to read.

### Lancet phial
- **Is:** vial · uncommon
- **Card:** When each fight starts, every foe gains a few Bleed (from its holder's Attack).
- **Stats:** Lifesteal medium · Crit chance +1 (2 of 2)
- **Numbers:** a few: `own("few", "attack")`, about three on a Vampire and three or four on an Assassin. The first hit on each foe pays about a third of an ordinary swing again, in red.
- **Code:** as today's Snowbound folio, with Bleed. 8 fires it again.
- **Serves:** Cuts 1 ●● ⚙ red rain (half), opening again (half), every colour (half)
- **Notes:** New. A kill it's fired again by is a kill like any other, and it happens once a fall, whoever calls for it.

### Blood vial
- **Is:** vial · rare
- **Card:** Its holder's abilities cost half their MP, plus HP equal to their full cost. The price never takes it below 1 HP.
- **Stats:** Lifesteal medium · HP +2 (3 of 3)
- **Numbers:** half the MP; HP equal to the full MP cost. On an Assassin a Backstab is a sixth of its HP; on a Vampire a Frenzy is a ninth.
- **Code:** as today's Blood vial.
- **Serves:** Pact 2 ●●●, Barrage ● ⚙ brink (key), blood mage (half)
- **Notes:** Kept: today's card and size. HP +2 is the careful stat for a unit that pays in it. A price that takes it under half is a crossing like any other, so a piece that watches for one fires.

### Venom vial
- **Is:** vial · rare
- **Card:** A foe's Bleed doesn't close under its holder's hits: the wound pays for the hit and stays as deep as it was. It still closes under everyone else's.
- **Stats:** Lifesteal medium · Crit chance +1 · Crit damage medium (3 of 3)
- **Numbers:** after each of its holder's hits on a bleeding foe, the stacks that hit closed are put back: whatever `STATUS.bleed.drop` takes, so the card stays true if that number moves.
- **Code:** as today's Bellows lantern, with Bleed, read after the wound's own reaction to the hit.
- **Serves:** Cuts 2 ●●●, Hunt ●
- **Notes:** Changed from its line, which had each hit raise the Bleed by a share of what it holds (round 3). Any share that out-ran the closing grew the wound with no ceiling, since Bleed has none, and the share that didn't was exactly what closed: the card said a raise and then said it came to nothing. So it says the one thing that happens. The wound never closes under its holder's hits and still closes under everyone else's. Seen: a fast unit cashes one wound on every hit, and the counter doesn't fall.

### Ravening draught
- **Is:** vial · rare
- **Card:** Its holder starts every fight at half its max HP, and its Lifesteal is doubled until it's healed to full. The HP it starts without isn't damage, and isn't a price paid.
- **Stats:** Lifesteal medium · HP +1 · Attack +1 (3 of 3)
- **Numbers:** half of max HP; Lifesteal doubled. A holder that starts below half keeps what it has.
- **Code:** as today's Ravening draught.
- **Serves:** Pact 2 ●●●, Cuts ● ⚙ brink (key)
- **Notes:** Today's legendary at rare: the size stays, Lifesteal drops to medium. Nothing that reads a price paid reads its start. Fired again by the opening, the drop doesn't happen and the doubling does. On a Vampire it multiplies with Bloodlust. The doubling is a state held until it's full, not a status its holder gives itself. Renamed from Bloodlust draught in round 3: Bloodlust is the Vampire's passive, which doubles the same stat, and a Vampire holds this.

### Heartsblood
- **Is:** vial · legendary
- **Card:** Whatever its holder's Lifesteal would heal it for, full or not, every other ally is healed for the same. Healing given this way isn't passed on again.
- **Stats:** Lifesteal high · HP +1 · Attack +1 (4 of 4)
- **Numbers:** the same amount to each other ally, every hit, counted before any of it is lost to a full HP bar.
- **Code:** a reaction to its holder's own Lifesteal that reads the amount before overheal (*Code support*). 23.
- **Serves:** Pact 3 ●●●, Cuts ●● ⚙ red stone (half)
- **Notes:** A full drinker still feeds the party, which is the red stone's supply. What it gives is a heal, at once, so a piece that reads heals reads it.

## Trophy

*Wears:* Ranger, Assassin, Geomancer. *Signature:* Crit damage.

### Wolf pelt
- **Is:** trophy · common
- **Card:** Nothing beyond its stats.
- **Stats:** Crit damage medium (1 of 1)
- **Numbers:** `SPECIAL.crit_damage.medium`.
- **Code:** none.
- **Serves:** the Hunt, and Landslide's crits.
- **Notes:** Today's name and step: the first stat its row names.

### Geode
- **Is:** trophy · common
- **Card:** Nothing beyond its stats.
- **Stats:** Defense +1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** Landslide.
- **Notes:** Today's name and step. Its row names Crit damage first, which Wolf pelt carries, so it takes Defense.

### Hunter's skull
- **Is:** trophy · uncommon
- **Card:** Each killing blow its holder lands gives it 3 Heat (it acts 5% faster in everything for each Heat, up to 10, for the rest of the fight).
- **Stats:** Crit damage medium · Crit chance +1 (2 of 2)
- **Numbers:** 3 Heat a killing blow, to Heat's own definition (`fill/shared.md`): a medium special stat's worth of speed in everything, at once.
- **Code:** as today's Hunter's skull, on Heat's new meaning.
- **Serves:** Hunt 1 ●●, Cuts ● ◆ kill-pays
- **Notes:** The line says "a Heat"; the count is the card's to set, and one Heat is a twentieth faster, which a kill wouldn't show. Three shows on the next swing. A kill by a status isn't a killing blow. Heat a card gives is a status its holder gives itself.

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
- **Card:** Its holder's hits on a Stunned foe crit 80% of the time, whatever its holder's Crit chance. Nothing raises that chance.
- **Stats:** Crit damage medium · Defense +1 · Attack +1 (3 of 3)
- **Numbers:** "nearly always" is 80%, a set chance on those hits. A hit that always crits still does, and the set chance wins over Gambler's coin.
- **Code:** a crit rule on a condition, as today's Venom vial's; set, and closed to doublings (*Code support*).
- **Serves:** Landslide 2 ●●●, Snap 2 ●●●, Hunt ●● ⚙ emptied quiver (half) ◆ held
- **Notes:** Four in five is the link's size: a run of three or four, ended by the crit that fails.

### Ogre's tusk
- **Is:** trophy · rare
- **Card:** Its holder's hits on the foe with the highest current HP deal half again as much.
- **Stats:** Crit damage medium · Defense +1 · Crit chance +1 (3 of 3)
- **Numbers:** 50% more. Foes tied for the highest all count.
- **Code:** as today's Ogre's tusk, on a new condition: the target's rank among the foes (*Code support*).
- **Serves:** Landslide 2 ●●●
- **Notes:** Changed as its line says, from a third more above half HP. Against a lone boss it's always on. It's a condition on a hit, not a pick: it changes nobody's aim.

### Dragon's tooth
- **Is:** trophy · rare
- **Card:** A third of the damage of each crit its holder lands lands a second time on the same foe, at once. The second landing takes no new roll to dodge or to crit, and nothing repeats it.
- **Stats:** Crit damage medium · Crit chance +1 · Attack +1 (3 of 3)
- **Numbers:** a third of the damage the crit dealt. The second hit is a hit: a wound pays, Lifesteal drinks, counters count. It carries none of the crit's statuses.
- **Code:** 16, 23, as today's Dragon's tooth, with a hit in place of untyped damage.
- **Serves:** Landslide ●●, Hunt ●●, Cuts ●●
- **Notes:** Today's legendary at rare. "Past Defense" goes: no piece sends a hit past it. Written to round 1's rule for a hit that lands a second time, at a third of the size. It isn't an extra strike, so nothing that reads extra strikes reads it.

### The king's head
- **Is:** trophy · legendary
- **Card:** When its holder lands a killing blow, every ally's Crit chance is doubled for 20 ticks, up to 80%.
- **Stats:** Crit damage high · Crit chance +1 · Accuracy medium (4 of 4)
- **Numbers:** doubled for 20 ticks, renewed by each killing blow. The doubling never lifts a chance past 80%; a chance already higher stays as it is.
- **Code:** as today's The king's head, with a ceiling on the doubled chance (*Code support*).
- **Serves:** Hunt 3 ●●●, Landslide ●● ⚙ emptied quiver (half) ◆ kill-pays
- **Notes:** Today's card with the ceiling its line gained, and today's stats. "A while" changed from 10 ticks to 20: in 10 each ally swings once, which isn't a spell of crits. It's this piece's own status, so its length is this piece's.

## Bell

*Wears:* Bard, Monk, Stormcaller. *Signature:* Attack speed.

### Prayer bell
- **Is:** bell · common
- **Card:** Nothing beyond its stats.
- **Stats:** Attack speed medium (1 of 1)
- **Numbers:** `SPECIAL.attack_speed.medium`.
- **Code:** none.
- **Serves:** Thousand Cuts and the Storm.
- **Notes:** Today's name and step: the first stat its row names.

### Cantor's bell
- **Is:** bell · common
- **Card:** Nothing beyond its stats.
- **Stats:** MP regen +1 (1 of 1)
- **Numbers:** `MP_REGEN_STEP`.
- **Code:** none.
- **Serves:** Barrage.
- **Notes:** A new name. Its row names Attack speed first, which Prayer bell carries, so it takes MP regen. Today's Temple bell carried Evasion and goes.

### Ringing bell
- **Is:** bell · uncommon
- **Card:** Every fourth basic attack its holder lands rings: a light hit on every foe (from its holder's Attack), carrying what the swing carries. The ring's hits aren't counted, and nothing repeats them.
- **Stats:** Attack speed medium · Attack +1 (2 of 2)
- **Numbers:** every fourth basic attack landed, on a count shown and kept for the fight; a light hit, `HIT.light` of Attack. A fist weapon comes round in about 24 ticks.
- **Code:** 12, 23; the count as 7's.
- **Serves:** Storm 1 ●●, Cuts 1 ●● ⚙ red rain (half), reaping (half) ◆ wide-hit
- **Notes:** The ring is an extra hit with its own name: its hits pay a wound and add the riders, a Thunderstorm's Shock among them, and nothing that reads extra strikes reads them. Extra strikes don't count toward the fourth. "Light" is the line's word; against a fast kind's swing it's two swings' worth on every foe (*Least sure*). Beside Squall lance on a Monk it's on the director's list (*Challenges*).

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
- **Card:** Every fifth basic attack its holder lands casts its first-slotted ability at once, whatever its cooldown, with no wind-up. Its cooldown stays where it was, and its MP is paid.
- **Stats:** Attack speed medium · MP regen +2 (3 of 3)
- **Numbers:** every fifth basic attack landed, on a count shown and kept for the fight: about 30 ticks on a fist weapon, 21 under Haste, 15 on Hummingbird charm. The MP is paid; with too little the cast doesn't fire and the count starts again.
- **Code:** 7.
- **Serves:** Cuts 2 ●●●, Barrage 2 ●●● ⚙ spell on the swing (key)
- **Notes:** Today's name, a new effect. The cast is a cast like any other: it's paid for, it gains a Crescendo, it counts for a third-cast piece, and an Encore can repeat it. An ability waiting on its own condition doesn't fire. Extra strikes don't count.

### Warding bell
- **Is:** bell · rare
- **Card:** Every so often, it lifts one debuff from the ally holding the most debuffs. A Silence comes first: while any ally is Silenced, it lifts that.
- **Stats:** Attack speed medium · MP regen +1 · Evasion medium (3 of 3)
- **Numbers:** every so often: `COOLDOWN.short`, the first beat halfway, as today's. "The most" is the most different debuffs.
- **Code:** as today's Warding bell, with a named debuff picked first as today's Waking bell picks it.
- **Serves:** Barrage ●●, Toll ●
- **Notes:** Today's card, stats and beat, with the Silence clause its line adds.

### Tireless bell
- **Is:** bell · legendary
- **Card:** Its holder's basic attacks never wait on its abilities: it keeps swinging through their wind-ups and their recoveries.
- **Stats:** Attack speed high · Double strike medium · Attack +1 (4 of 4)
- **Numbers:** its swings come on their own interval through every cast: a wind-up (`WINDUP`) and a recovery (`RULES.abilityRecovery`), three to five ticks a cast for its three wearers.
- **Code:** 17, widened to recoveries: a basic attack on its own clock (*Code support*).
- **Serves:** exotic, Storm ●●, Cuts ●●, Barrage ●●
- **Notes:** Written to its line as round 1 widened it. Those swings are basic attacks like any other: they carry what the swing carries and count for whatever counts swings. A Stun still stops them. A unit that casts a quick ability on every cooldown swings about a quarter more (*Least sure*).

## Cloak

*Wears:* Valkyrie, Monk, Ranger. *Signature:* Evasion.

### Traveller's cloak
- **Is:** cloak · common
- **Card:** Nothing beyond its stats.
- **Stats:** Evasion medium (1 of 1)
- **Numbers:** `SPECIAL.evasion.medium`.
- **Code:** none.
- **Serves:** the Toll's dancer, Thousand Cuts and the Hunt: Evasion is the cloak's first stat on all three.
- **Notes:** Today's name and step: the first stat its row names.

### Swallowtail cloak
- **Is:** cloak · common
- **Card:** Nothing beyond its stats.
- **Stats:** Attack speed medium (1 of 1)
- **Numbers:** `SPECIAL.attack_speed.medium`.
- **Code:** none.
- **Serves:** Thousand Cuts.
- **Notes:** A new name. Its row names Evasion first, which Traveller's cloak carries, so it takes Attack speed. Today's Swan-feather cloak carried Defense, which neither row names, and goes.

### Hooded cloak
- **Is:** cloak · uncommon
- **Card:** Each time its holder dodges a hit, it gains a Shield of a sixth of its Attack.
- **Stats:** Evasion medium · Attack +1 (2 of 2)
- **Numbers:** a sixth of Attack (the size of `HIT.touch`), into its one Shield pool, up to the pool's cap. At Attack 4 that's most of a minion's swing.
- **Code:** a dodge's reaction as today's Hooded cloak, giving a Shield as today's Glyphed robe does.
- **Serves:** Toll 1 ●●, Cuts ● ⚙ riposte (half), detonation (half) ◆ shield-by-doing
- **Notes:** Today's name, changed as its line says: a Shield in place of a few Might. Sized so one dodge banks about the blow that lands next. It's a status its holder gives itself.

### Feathered cloak
- **Is:** cloak · uncommon
- **Card:** The first time each fight its holder drops below half its max HP, it's Hidden.
- **Stats:** Evasion medium · Crit chance +1 (2 of 2)
- **Numbers:** Hidden at its own length (`STATUS.hidden`), once a fight.
- **Code:** as today's Feathered cloak, fired on any crossing.
- **Serves:** net, Hunt ● ⚙ two in the dark (half)
- **Notes:** Kept: card, size and stats are today's. Dropping below half is a crossing, whatever took it there, and a holder that starts a fight under half is Hidden as the fight starts. The Hidden doesn't land on a Taunting holder, or on the last ally the foes can pick; the once is spent all the same.

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
- **Numbers:** a whole cooldown a dodge: the least wait left among its abilities still cooling.
- **Code:** as today's Dancer's cloak, with ready in place of a few ticks.
- **Serves:** Toll 2 ●●, Cuts 2 ●●, Barrage ●
- **Notes:** Today's piece, changed as its line says. Mana is what it runs out of, and the Monk's pool is the smallest in the set.

### Tempest cloak
- **Is:** cloak · rare
- **Card:** Each time its holder dodges a hit, its next basic attack comes at once and lands twice. The second landing is the same damage again on the same foe, and nothing repeats it.
- **Stats:** Evasion medium · Attack speed medium · Attack +1 (3 of 3)
- **Numbers:** one swing at once, whose hit lands a second time. The second landing takes no new roll to dodge or to crit. It's a hit: a wound pays, Lifesteal drinks, a Shield from hits builds, counters count. It carries none of the swing's statuses. "At once" doesn't stack.
- **Code:** as today's Tempest cloak, on 16's second landing. 23.
- **Serves:** Toll 2 ●●●, Cuts 2 ●●● ⚙ riposte (key)
- **Notes:** Today's legendary at rare: the card stays, Evasion drops to medium. The swing is a basic attack at whoever it picks, not at the attacker. Written to round 1's rule for a hit that lands a second time: the second strike isn't an extra strike, so Flurry wraps doesn't chain from it and Echo charm doesn't read it. Double strike rolls on the swing as ever, and its extra strike isn't landed twice.

### Shadow cloak
- **Is:** cloak · rare
- **Card:** Its holder is Hidden when each fight starts, and again each time a foe falls.
- **Stats:** Evasion medium · Crit chance +1 · Attack +1 (3 of 3)
- **Numbers:** Hidden at its own length (`STATUS.hidden`), at the start and at every foe's fall, anyone's kill.
- **Code:** none: Hidden at the start as today's Shadow mantle, and on a fall. 8 fires the start again, once a fall.
- **Serves:** exotic, Hunt ●● ⚙ two in the dark (key) ◆ kill-pays
- **Notes:** The Decoy's Shadow seat shares its sentence, as a piece and a seat may. A Taunting holder isn't Hidden. Someone stays in the light: its Hidden doesn't land when it would leave the foes no ally to pick, and where several would hide at once the last in seat order stays. It's a status its holder gives itself.

### Swan's grace
- **Is:** cloak · legendary
- **Card:** Once a fight, damage that would knock its holder out leaves it at 1 HP and Hidden.
- **Stats:** Evasion high · Attack +1 · Crit chance +1 (4 of 4)
- **Numbers:** 1 HP; Hidden at its own length.
- **Code:** as today's Swan's grace.
- **Serves:** net ⚙ two in the dark (half)
- **Notes:** Kept: card, size and stats are today's. Any damage that would knock it out, a status's included; the card says "damage" (round 3). The Hidden doesn't land on a Taunting holder, or on the last ally the foes can pick: it stands at 1 HP in the light (*Least sure*).

## Challenges

Round 1 ruled on the rest, and round 2 on the first, fourth and fifth of these, which are applied above. The second and third are for the director's list.

1. *Ruled in round 2: all three are free, in MP or in HP, and the two cards say so.* **"Costs no MP" under an HP price.** Annotated grimoire makes a cast "free", which waives whatever it costs. Accompanist's score and The deep well say "costs no MP". Now that "pays for" is in MP or in HP, a soloist under Flagellant's vestments sets the score off, but by the letter the score's own holder under The covenant gets nothing from it, and The deep well does nothing beside the vestments. I left both cards on their lines' words. I'd read all three as free.
2. **For the director's list: Ringing bell and Squall lance on a Monk.** Every fourth basic attack, or every fifth hit: a light hit on every foe, or every other foe, carrying what the swing carries. One unit can hold both.
3. **For the director's list: Snowbound folio beside Grimoire of plagues, in one kind.** When the grimoire rolls Chill it's the folio and one more. They're the same size, so the choice is certainty against breadth.
4. *Ruled in round 2: as written. Neither carries the swing.* **Two second hits, written to the rule for a hit that lands a second time.** Tempest cloak's "strikes twice" and Dragon's tooth's "strike again" were extra strikes in my first draft. An extra strike is now Double strike's alone, so both are a second landing: no new roll, no riders, and nothing that reads extra strikes reads them. The tooth's is a third of the damage the crit dealt. Say so if either was meant to be an extra hit that carries the swing.
5. *Ruled in round 2: as written.* **The tome's commons under the first-stat rule.** Both rows name Cooldown first, so one has to give way. I kept Hymnal on Cooldown and Scholar's codex on Attack, which keeps both of today's commons. Going down the rows in order would give Cooldown and MP regen, with a new name for the second.

## Links

- **Detonation** (Hooded cloak, half). A sixth of Attack a dodge, into the one pool. The readers want the most that Shield held: a dancer's pool is small and breaks often, so its breaks are many and small.
- **Frozen gate** (Meltwater orb, half). A quarter of max MP a shatter. The other side has to shatter a pack on the wall several times a fight, and the mage beside the wall holds the orb.
- **Reaping** (Last page and Ringing bell, halves). Last page fells everything under a tenth when anything falls; the ring is a light hit on every foe each fourth swing. The other side is the execute that makes the first kill.
- **Opening again** (Snowbound folio, Grimoire of plagues, Scrying orb and Lancet phial, halves). Each does again what it did, at the same size, once a fall. Overture coat is Leather, so it meets the phial on an Assassin, the tome only on a Bard, and never an orb. For the rest the keystone is Second dawn alone.
- **Fuse** (Smouldering orb, key). A third of the fallen foe's Burn to each other foe. It needs a burning foe to fall while others stand, so a party that kills the weakest first.
- **Spell on the swing** (Bell of the hour, key). Every fifth basic attack. It needs speed (one speed piece brings it round two or three times a regular fight), a well, and the right ability slotted first.
- **Red rain** (Curse-book, Lancet phial and Ringing bell, halves). Curse-book lays about four Bleed a foe with each wide cast, which pays about what a Blizzard deals on the next wide hit. The phial lays about three, once. The ring is the pourer. The link's size is met only by Curse-book; the phial needs a wide hit early, before single hits close its wounds.
- **Riposte** (Tempest cloak, key; Hooded cloak and Matador's cape, halves). One swing at once whose hit lands twice, a dodge; both landings build cover the way their striker does. All three are cloaks, so the cape's draw can't sit under the Tempest cloak: its draw has to be a kit's (Stillness of mind, Over the fallen) or the amulet's. The cape pairs with Duelist's leathers and Parrying spear.
- **Every colour** (Grimoire of plagues, key; Snowbound folio, Curse-book, Festering idol and Lancet phial, halves). Two afflictions at two or three stacks on every foe. Malison has to land early: at that size the Burn is gone in about ten ticks unless fed, and Shock after two of the foe's actions. The idol's one stack a hit keeps a kind alive on what its holder is hitting.
- **Emptied quiver** (Vulture's skull and The king's head, halves). Four in five on a Stunned foe; crit chance doubled for 20 ticks after a kill, to four in five at most. The reader is Quick draw, and either way the burst ends on the one crit in five that fails.
- **Blood mage** (Blood vial and Idol of the blood-well, halves). The vial's price is the full MP cost in HP; the idol turns a price into MP, one for one. Neither wearer of the vial has a wide spell, as the spine says. The idol needs a price of real size: Blood gift's fifth.
- **Resonance** (Mana pearl and Meltwater orb, halves). 15% of max MP a fall; a quarter a shatter. Between them a pack that's falling or shattering keeps the spell paid for, which takes away the link's mana brake.
- **Crescendo** (Orb of the rising sun, key; Twice-told tome, Accompanist's score, Annotated grimoire and The deep well, halves). The orb can't sit with either tome. So the tomes' free casts skip Crescendo charm's price only, and the orb's holder never has a price to skip.
- **Mana as armour** (Orb of the deep and Idol of the deep, keys; Leech idol, half). One MP for one damage. A giver has to give about a foe's swing at a time (500 or more) for a gift to read as a blow not taken. Clarity does. Leech idol's spill is a tenth of a hit and doesn't.
- **Shatter bell** (Frozen tome, key). Half the wait on each ally's first-slotted ability. It needs shatters on a beat, and abilities worth slotting first on the other two.
- **Firecracker** (Snowbound folio, half). Two or three Chill on every foe. That makes a field "already cold" only beside another wide source.
- **Brink** (Blood vial and Ravening draught, keys). The draught puts its holder at half from the first tick. The vial keeps an Assassin low and a Vampire barely. The other side is the gifts to the ally with the lowest share of max HP.
- **Two in the dark** (Shadow cloak, key; Feathered cloak and Swan's grace, halves). Hidden for its own length at the start and at each fall: most of a pack fight, and the first moments of a boss fight. It needs a second hider and an anchor that wants every blow; the third always stays in the light.
- **Red stone** (Crimson dregs and Heartsblood, halves). A fifth of each hit on a bleeding foe; Lifesteal's amount, full or not, to both other allies. The keystone on a healed ally (Red stone mail) turns Heartsblood into stone for the party.

## Loops

Found in this share, each with its brake:
- **The king's head beside a Quick draw Ranger.** The doubling stops at four in five, so the burst ends on the crit that fails. It runs about four arrows a time, for 20 ticks after each kill.
- **Vulture's skull with Quick draw.** A burst on a Stunned foe that takes no time. The one crit in five that fails, and nothing raises the chance.
- **Venom vial.** At a half there's none. With a Bleed rider on the same unit (Ragged axe) the wound grows by the rider's stacks every hit. The other allies' hits close it.
- **Three Shadow cloaks,** or cloaks under a Decoy. Someone stays in the light, so the foes always have a pick. Two stay hidden for Hidden's own length after every fall, which is the engine at its fullest, and the gap between kills is the brake.
- **Frozen tome in a chain of shatters.** Each shatter halves the wait on every ally's first-slotted ability, so a chain of four leaves a sixteenth. The chain's own damping, wind-ups and mana.
- **The deep well beside Clear-headed charm.** Below half its MP it gains Clarity, and while that lasts it casts free. It settles round half a pool and never runs dry. Clarity's length against the charm's beat.
- **Bell of the hour with Cadenza slotted first.** Three swings at once count toward the next five. Two real swings a round, and Cadenza's cost.
- **Smouldering orb in a pack.** A fall flares the field, which fells the next, which flares it again. The foes run out.
- **Scrying orb under Second dawn.** Every fall readies its nearest ability, once a fall. The foes run out; mana and wind-ups slow it.
- **Hunter's skull.** Heat brings kills sooner and kills bring Heat. Heat's ceiling of ten.
- **Pacer's bell.** Haste brings casts sooner and casts renew Haste. It's a refresh, so it settles at Haste all fight. Mana.
- **Dancer's cloak under a draw.** Every dodge readies an ability, the Taunt among them. The foes' swings and the holder's mana.

Known to the spine, with this share's side:
- **Tempest cloak with Provoking blade,** on a Valkyrie. The dodge that fails.
- **Matador's cape, a copied Taunt and Goading totem.** The cape lays its Taunt again on every dodge, which is what turns it. A round with no dodge.
- **Meltwater orb with Floe charm,** and the same with Resonant robes. At a quarter of max MP a shatter, one shatter doesn't pay for a Blizzard and three do.
- **Last page.** The foes run out.
- **Shroud charm or Aegis mail on a Blood vial's holder.** A price that takes it under the line is a crossing, so each crossing fires it. Healing back over the line.

Closed in round 1, or not loops:
- **Two Accompanist's scores facing each other.** A free cast isn't paid for, so it sets the other score off no more: one of the two always pays.
- **Tireless bell.** Nothing in it feeds itself: swings and casts run side by side. Beside Baton a Bard's swings never pause, so its first-slotted spell comes round faster, and mana stops it.
- **Tempest cloak with Flurry wraps** on a Monk: the second landing isn't an extra strike, so Flurry wraps chains only from the swing's own Double strike.
- **Idol of binding under Withering hex** holds its double on every foe its holder swings at twice. Bosses resist the Slow, not the double.
- **Orb of the deep with Flagellant's vestments:** the casts are paid in HP and the blows are taken in MP. The two bars swap jobs.
- **Leech idol beside Glimmer robe:** every hit of a full holder is MP given.

## Code support beyond the spine's list

- **Two different statuses picked at random, the same pair for every foe** (Grimoire of plagues). Today's pick is one status a hit.
- **A cooldown cut by a share of the wait left,** and **an ability picked by its whole cooldown** (Frozen tome). Today's cut is a count of ticks, on the longest wait left.
- **A set crit chance on a condition that nothing doubles** (Vulture's skull), and **a ceiling on a doubled chance** (The king's head).
- **A cost paid in HP read as a cost paid** (Annotated grimoire, Accompanist's score). Today's reads MP paid.
- **A basic attack on its own clock, through an ability's wind-up and its recovery** (Tireless bell). 17 names the wind-up.
- **A boost that reads the target's rank among the foes** (Ogre's tusk: the highest current HP, ties included).
- **A reaction to a unit's own Lifesteal that reads the amount before overheal** (Heartsblood).
- **Every MP gain past full as an event** (Leech idol, Idol of the deep). Today's Leech idol reads Siphon on a hit, with a full pool as its test.
- **A count of casts in a fight, shown on the unit** (Twice-told tome).
- **A share of a status read after that status's own reaction to the same hit** (Venom vial: Bleed pays and closes, then the vial reads what's left).
- **A fall that isn't damage** (Last page), so no Shield or Aegis stands in its way.

## Least sure

- **Marginalia and Curse-book do nothing on a Bard.** No Bard ability aims at a foe or hits one, so two of the tome's three uncommons are their stats there.
- **Tireless bell, widened.** A wind-up and a recovery are three to five ticks a cast for its wearers, so it's about a quarter more swings on a unit that casts often. That reads, and it may still be thin for a legendary.
- **Someone stays in the light, against the net.** Swan's grace on the last ally standing leaves it at 1 HP and not Hidden, which is when the piece is wanted most. Feathered cloak has the same gap.
- **Bell of the hour at five.** On a Monk with a Stun slotted first it's a Stun every 20 to 30 ticks, until its small pool is gone.
- **The start-of-fight sizes.** Two or three Chill of a cap of twelve is what a Blizzard lays, and Chill's counts are already the balance pass's first job. The folio is seen as an icon on every foe; whether it's felt is another matter.
- **Ringing bell's "light".** On a fast kind the ring is worth two swings on every foe, so in a pack it's most of its holder's damage. The spine's "a small number on every foe" suggests `HIT.touch`.
- **Leech idol.** Its link is as big as Siphon medium: about a tenth of each hit, one cast's worth to the caster in a fight. Siphon also still reads a foe's MP, which the player can't see.
- **Fanged idol.** One Rot a foe a fight is nothing against a boss that heals all fight.
- **Warding bell against a Silence.** Its beat is 22 ticks and a Silence lasts 16, so it lifts about half of each one on average, and misses some altogether.
- **Mana pearl and Meltwater orb together** on the roads' two biggest pools. I sized each to be seen alone.
- **Heartsblood.** It triples what Lifesteal heals, every hit, full or not, and a Vampire's Lifesteal is already high.
- **Idol of binding at rare.** Double, held all fight by a Hexer's swings or a Vampire's cheapest spell.
- **Marginalia** scatters a pile to chase a caster, and does nothing in a fight with no wind-ups.
- **The stats.** Each piece's steps are my read of its road's careful pick. Three I'd look at: no MP on Leech idol, MP regen +2 on Bell of the hour, and Defense on two trophies for the Geomancer's sake.
- **Cantor's bell and Swallowtail cloak** are new names for the lead's check.
