# The fill: amulets

37 pieces, every one worn by any class: 10 commons, 7 uncommons, 10 rares, 10 legendaries, in the spine's order. Every number is a first value. The stats are mine, set for the road each piece serves; the names of five commons are new (Cat's eye, Carnelian, Caltrop, Skipping stone, Tidestone).

## Amulet

### Lodestone
- **Is:** amulet · common
- **Card:** Nothing beyond its stats.
- **Stats:** HP +1 (1 of 1)
- **Numbers:** `HP_STEP`.
- **Code:** as today's Lodestone
- **Serves:** the Toll, Blood Pact: max HP is the anchor's body and the price Blood Pact pays in.
- **Notes:** Today's name and step. The name clashes with Lodestone shield (*Challenges*).

### Ironstone
- **Is:** amulet · common
- **Card:** Nothing beyond its stats.
- **Stats:** Defense +1 (1 of 1)
- **Numbers:** `STEP`.
- **Code:** as today's Ironstone
- **Serves:** Landslide, the Toll: Defense is the stone's damage stat and the wall's cover.
- **Notes:** Today's name and step.

### Whetstone
- **Is:** amulet · common
- **Card:** Nothing beyond its stats.
- **Stats:** Attack +1 (1 of 1)
- **Numbers:** `STEP`.
- **Code:** as today's Whetstone
- **Serves:** Bonfire, Cold Snap, the Storm: their stacks are read off Attack.
- **Notes:** Today's name and step. The name clashes with the formation The whetstone (*Challenges*).

### Cat's eye
- **Is:** amulet · common
- **Card:** Nothing beyond its stats.
- **Stats:** Crit chance +1 (1 of 1)
- **Numbers:** `crit(1)`.
- **Code:** none
- **Serves:** the Hunt: crits on a few chosen hits.
- **Notes:** A new name: today's amulets have no Crit chance common.

### Dewstone
- **Is:** amulet · common
- **Card:** Nothing beyond its stats.
- **Stats:** MP regen +1 (1 of 1)
- **Numbers:** `MP_REGEN_STEP`.
- **Code:** as today's Dewstone
- **Serves:** Barrage: mana in fights.
- **Notes:** Today's name and step.

### Quicksilver
- **Is:** amulet · common
- **Card:** Nothing beyond its stats.
- **Stats:** Evasion medium (1 of 1)
- **Numbers:** `SPECIAL.evasion.medium`.
- **Code:** as today's Quicksilver
- **Serves:** Thousand Cuts, and the Toll's dancer.
- **Notes:** Today's name and step.

### Carnelian
- **Is:** amulet · common
- **Card:** Nothing beyond its stats.
- **Stats:** Lifesteal medium (1 of 1)
- **Numbers:** `SPECIAL.lifesteal.medium`.
- **Code:** none
- **Serves:** Blood Pact: the drinker's sign, for any class.
- **Notes:** A new name. It takes the place of today's Batwing charm, whose rider on abilities goes.

### Caltrop
- **Is:** amulet · common
- **Card:** Nothing beyond its stats.
- **Stats:** Thorns medium (1 of 1)
- **Numbers:** `SPECIAL.thorns.medium`.
- **Code:** none
- **Serves:** the Toll: being struck strikes back.
- **Notes:** A new name. It takes the place of today's Urchin shell; "Thorns while it holds a Shield" is Urchin plate's line now.

### Skipping stone
- **Is:** amulet · common
- **Card:** Nothing beyond its stats.
- **Stats:** Double strike medium (1 of 1)
- **Numbers:** `SPECIAL.double_strike.medium`.
- **Code:** none
- **Serves:** Thousand Cuts: more hits, however they come.
- **Notes:** A new name. It takes the place of today's Wasp charm.

### Tidestone
- **Is:** amulet · common
- **Card:** Nothing beyond its stats.
- **Stats:** Cooldown medium (1 of 1)
- **Numbers:** `SPECIAL.cooldown.medium`.
- **Code:** none
- **Serves:** Barrage, and Bonfire's feeders: abilities round sooner.
- **Notes:** A new name.

### Tinder charm
- **Is:** amulet · uncommon
- **Card:** Its wearer's basic attacks add a few stacks (from Attack) to whichever of Burn, Chill, Shock or Bleed their target holds the most stacks of. If two are level, one of them at random. On a foe that holds none of the four, they add nothing.
- **Stats:** Attack +1 · HP +1 (2 of 2)
- **Numbers:** a few: `STACKS.few` through `own("few", "attack")`, the same word for all four statuses, with no kit multiplier. The target is read as the hit lands, before anything else the swing adds.
- **Code:** 12 (a rider that reads which status its target holds most of)
- **Serves:** Bonfire 1 ●●, Snap 1 ●●, Storm 1 ●●, Cuts 1 ● ⚙ lead's colour (half) ◆ swing-status
- **Notes:** Seen as a second feeder: a few a swing is what Cold hex and Kindling add, so the wearer doubles the kit's own source and the counter climbs twice as fast. It starts nothing, so in a party with no status it's two stat steps. It's a rider on the basic attack, so it's part of "what the swing carries". Attack sizes its stacks; HP makes it the careful pick.

### Challenger's token
- **Is:** amulet · uncommon
- **Card:** Its wearer Taunts when each fight starts.
- **Stats:** Defense +1 · Aggro +1 (2 of 2)
- **Numbers:** Taunt at its own length (`STATUS.taunt`).
- **Code:** as today's Clarion blade
- **Serves:** Toll 1 ●●, Bonfire ●, Storm ●, Hunt ● ⚙ opening again (half), goad (half), frozen gate (half), mirror (half), riposte (half), two in the dark (half) ◆ draw
- **Notes:** A start-of-fight effect. Seen at once: the foes' first picks all go to it. Taunt ends Hidden, so on a unit that also starts a fight Hidden the token wins. The Aggro step keeps part of the draw once the Taunt has run out, which is what the mirror and the frozen gate need from an anchor made this way.

### Carapace charm
- **Is:** amulet · uncommon
- **Card:** Its wearer starts every fight behind a Shield of 15% of its max HP.
- **Stats:** HP +1 · Defense +1 (2 of 2)
- **Numbers:** 15% of max HP (today's), added to the unit's one pool, under its cap (`STATUS.shield.capShare`).
- **Code:** as today's Carapace charm
- **Serves:** Landslide ●, net ⚙ opening again (half), detonation (half)
- **Notes:** Kept: today's card and size. The grey bar is seen at the first tick, and its break under Rubble plate is 15% of the wearer's max HP on every foe. It's kept under Vanguard's fifth on purpose, so the Knight's passive stays the bigger one. A start-of-fight effect: given again, it adds to the pool. Stats changed from HP and Attack to HP and Defense, Landslide's two.

### Hare's foot
- **Is:** amulet · uncommon
- **Card:** Its wearer starts every fight Hasted.
- **Stats:** Attack speed medium · HP +1 (2 of 2)
- **Numbers:** Haste at its own size and length (`STATUS.haste`).
- **Code:** as today's Hare's foot
- **Serves:** Cuts 1 ●●, Bonfire ●, Storm ●, Barrage ● ⚙ opening again (half), spell on the swing (half)
- **Notes:** Kept: today's card. A start-of-fight effect; Haste refreshes, so given again it's renewed and never doubled. Attack speed keeps some of the pace once the Haste is gone, which is Thousand Cuts' step ("anything that makes more hits"); HP is the careful half.

### Millstone
- **Is:** amulet · uncommon
- **Card:** Its wearer's basic attacks come half as often and deal two and a quarter times as much.
- **Stats:** Attack +1 · Defense +1 (2 of 2)
- **Numbers:** half as often: Attack speed −100, a shape that counts no step, as today. Two and a quarter times: +125% on basic attacks, today's size.
- **Code:** as today's Millstone
- **Serves:** Landslide 1 ●●●, Hunt ● ⚙ judge's drum (half), avalanche (half), reckoning (half) ◆ heavy-blow
- **Notes:** Kept: today's card and size, at uncommon, with a step fewer. Seen in the first swing: one number where there were two, bigger than both. Might is spent an action at a time, so it lasts twice as long on this unit. On a Hoplite it adds to Phalanx: a third as often.

### Hummingbird charm
- **Is:** amulet · uncommon
- **Card:** Its wearer's basic attacks come twice as often and deal half as much.
- **Stats:** Double strike medium · Evasion medium (2 of 2)
- **Numbers:** twice as often: Attack speed +100, a shape that counts no step, as today. Half as much: −50% on basic attacks.
- **Code:** as today's Hummingbird charm
- **Serves:** Cuts 1 ●●●, Bonfire ●, Snap ●, Storm ● ⚙ spell on the swing (half)
- **Notes:** Changed as the line says: today's deals 45%, the line says half. Seen at once: twice the numbers, and whatever the swing carries laid twice as fast. Against Defense and Thorns it's a loss, which is what it gives up.

### Clear-headed charm
- **Is:** amulet · uncommon
- **Card:** While its wearer is below half its MP, it gains Clarity every so often: at once when it drops below half or starts a fight there, then again each time the wait is over and it's still below half.
- **Stats:** MP +1 · Aggro −1 (2 of 2)
- **Numbers:** below 50% of max MP. Clarity at its own size and length (`STATUS.clarity`): about a quarter of the pool, close to one spell's cost for a caster. "Every so often" is `COOLDOWN.short` between two.
- **Code:** none new: a reaction with a wait of its own, as the other "every so often" pieces
- **Serves:** Barrage 1 ●● ⚙ mana as armour (half) ◆ free-cast
- **Notes:** Seen as the line says: the blue bar turns round, by about a cast's worth, each time it runs low. It isn't a start-of-fight effect: it fires at a fight's start only because its condition holds. MP sizes the Clarity; Aggro down is the caster's careful step.

### Shatterstone charm
- **Is:** amulet · rare
- **Card:** When a foe breaks its wearer's Shield, twice the most that Shield held is sent back to that foe. A Shield worn through by a status's damage sends nothing back.
- **Stats:** HP +1 · Defense +1 · Aggro +1 (3 of 3)
- **Numbers:** twice the pool's highest point since the wearer last had no Shield. It reads the Shield, not a stat.
- **Code:** as today's Rubble plate (a Shield's break, with the most it held as the amount); the foe that broke it as the target is under *Code support beyond the spine's list*
- **Serves:** Landslide 2 ●●●, Cuts ●, Toll ●● ⚙ detonation (key)
- **Notes:** Seen on the first break: a Knight's opening Shield sends back enough to fell a wolf. The other half is any Shield on the wearer; a Shield rebuilt at half (Second skin) sends back half as much. Damage sent back isn't a hit, so a foe it fells isn't felled by a killing blow. HP raises the pool's cap, and Aggro brings the blows that break it.

### Bounty charm
- **Is:** amulet · rare
- **Card:** When its wearer lands a killing blow, its ability with the longest cooldown left is ready at once. The ability that landed the blow counts.
- **Stats:** Attack +1 · Crit chance +1 · MP +1 (3 of 3)
- **Numbers:** ready: that ability's cooldown left is set to nothing. One ability a kill, so a cast that fells two foes readies two.
- **Code:** as today's Hunting spear
- **Serves:** Hunt 2 ●●●, Barrage ●● ⚙ reaping (key) ◆ kill-pays
- **Notes:** Changed as the line says: today's gives 2 Might and the next basic attack, which play never saw fire. An ability that has just fired has its whole cooldown left, so an execute that kills is the one made ready: that's the reaping. The other half is a blow sized to kill a sunk foe in one, and the mana for it. Today's stats kept: MP is what the chain runs on.

### Echo charm
- **Is:** amulet · rare
- **Card:** Its wearer's extra strikes carry what the swing carries.
- **Stats:** Double strike medium · Attack +1 · Evasion medium (3 of 3)
- **Numbers:** none of its own: each rider lands at the size the basic attack adds it.
- **Code:** 12, as today's Echo charm, narrowed to statuses
- **Serves:** Cuts 2 ●●, Bonfire ●, Snap ●, Storm ●
- **Notes:** Changed to the spine's phrase: today's card also passes on-hit effects, and the phrase is statuses alone, with no second target and no Refrain. Double strike is its first stat so that every wearer has extra strikes for it to work on: a Hexer has none otherwise. Its audience is thinner than today's (*Challenges*).

### Icebreaker charm
- **Is:** amulet · rare
- **Card:** When a foe's Chill shatters, its wearer's ability with the longest cooldown is ready at once. That's its slowest ability, whatever is left on it; if it's ready already, nothing happens.
- **Stats:** Cast speed medium · MP +1 · HP +1 (3 of 3)
- **Numbers:** ready: that ability's cooldown left is set to nothing. The longest cooldown is read as the player sees it, in ticks, after any version or power step.
- **Code:** a shatter is an event today, and readying is today's Hunting spear; choosing by the whole cooldown is under *Code support beyond the spine's list*
- **Serves:** Snap 2 ●●●, Landslide ●●, Barrage ●●, Bonfire ●● ⚙ shatter bell (key)
- **Notes:** Seen as the line says: SHATTER, and the great spell's name under it. The other half is a party that shatters more than once a fight. Cast speed is there so a long wind-up lands while the shattered foe is still Stunned; MP because the slowest ability is usually the dearest. The name clashes with the great weapon Icebreaker (*Challenges*).

### Lightning-glass
- **Is:** amulet · rare
- **Card:** Its wearer's abilities deal 4% more for each Shock on their target. The Shock stays.
- **Stats:** Attack +1 · Cooldown medium · MP +1 (3 of 3)
- **Numbers:** 4% a stack: two fifths more at 10 Shock, double at 25, about two and a half times at the cap (`STATUS.shock.cap`), which is close to what Skyfall gets from a full charge.
- **Code:** none new: a boost sized by its target's stacks, as Skyfall and Pyre read them in the kits
- **Serves:** Storm 2 ●●●, Landslide ●, Snap ● ⚙ held charge (key)
- **Notes:** Sized to the link (a charge at its cap doubles the blow or more) and to be seen below it: a foe holding ten Shock takes two fifths more. The wearer's abilities don't aim at the most charged foe, so the other half is a field charged all over, or a foe held still while the charge climbs.

### Halved heart
- **Is:** amulet · rare
- **Card:** Its wearer starts every fight at half its max HP: anything above half is lost as the fight starts, and it isn't a price paid. It can't be healed above half; healing past that counts as healing past full. At half it counts as below half its HP. Its hits deal half again as much.
- **Stats:** Lifesteal medium · HP +1 · Defense +1 (3 of 3)
- **Numbers:** half of max HP, as the start and as the cap on healing. Hits +50%.
- **Code:** 14
- **Serves:** Pact 2 ●●●, Toll ● ⚙ brink (key)
- **Notes:** "At half it counts as below half" is mine: the line doesn't say it, and the brink needs it (*Challenges*). The drawback at the start isn't a start-of-fight effect that happens again. Shields aren't capped, so the cover the givers lay on it holds. HP carries, so the wearer is at half or less when the charm comes off.

### Crescendo charm
- **Is:** amulet · rare
- **Card:** Each time its wearer casts an ability, that ability gains a Crescendo, kept for the fight. An ability costs a fifth more for each Crescendo it holds, in whatever it's paid in. A cast that costs nothing still gains one.
- **Stats:** MP +1 · MP regen +1 · Cooldown medium (3 of 3)
- **Numbers:** Crescendo as `fill/shared.md` defines it (a fifth more for each, to 10). The cost climbs on the same slope: a fifth of the ability's own cost for each, so triple at 10.
- **Code:** 11
- **Serves:** Barrage 2 ●●● ⚙ crescendo (key)
- **Notes:** The stack lands when a cast is done, so the second cast is the first bigger one. Seen from the third cast: two fifths more on the number and on the price. At this slope a Stormcaller's full pool pays for two Chain lightnings and not the third, which is the link's size; a free cast skips the price and keeps the stack. Beside Orb of the rising sun on one unit the count is one count and the price never rises, so the charm adds only its stats.

### Ember heart
- **Is:** amulet · rare
- **Card:** When a burning foe falls, all its Burn passes to the next foe its wearer hits. Until then the wearer holds it, shown as a number, and it doesn't burn down. A fallen foe's fire moves once: if something else moves it too, they share it evenly.
- **Stats:** Attack +1 · Attack speed medium · HP +1 (3 of 3)
- **Numbers:** all the stacks the foe held as it fell. Fires from several falls before the wearer's next hit add up, and land together on that hit's first target.
- **Code:** 9 (a fallen foe's Burn moved), 23 (the split); the fire held on the wearer is under *Code support beyond the spine's list*
- **Serves:** Bonfire 2 ●●●, Hunt ●● ⚙ fuse (key)
- **Notes:** Changed as the line says: today's card (a third to every other foe) is Smouldering orb's now. Seen on the first kill of a burning foe: the next foe the wearer strikes starts already roaring. A dodged hit passes nothing, and the fire waits. Attack speed is there so the wait is short; the lantern and the orb are the casters' homes for this, so the amulet leans to the feeder that swings.

### Hunter's mark
- **Is:** amulet · rare
- **Card:** While no foe is Marked, its wearer Marks the foe with the lowest current HP.
- **Stats:** Crit chance +1 · Crit damage medium · Attack +1 (3 of 3)
- **Numbers:** Marked at its own length (`STATUS.marked`). It's laid again at once when it runs out or its foe falls, on whichever foe is lowest then.
- **Code:** 19 (a Mark standing on the lowest foe), 1
- **Serves:** Hunt 2 ●●● ⚙ judge's drum (half)
- **Notes:** Laying the Mark isn't an action: it costs nothing and happens whatever its wearer is doing, while it stands. It isn't a start-of-fight effect. The Mark isn't a pick, so it ignores Taunt: behind a Taunting front it sits on a foe only Seek reaches. With a Mark always on the lowest foe, nearly every fall is a Marked foe's fall, which is what the drum's pieces wait for.

### Shroud charm
- **Is:** amulet · rare
- **Card:** Whenever an ally drops below a third of its max HP, that ally is Hidden.
- **Stats:** Evasion medium · Aggro −1 · HP +1 (3 of 3)
- **Numbers:** a third of max HP, counted each time an ally crosses it downward. Hidden at its own length (`STATUS.hidden`).
- **Code:** none new: today's Red ribbon reads an ally dropping below a line
- **Serves:** Pact ●●, net ⚙ two in the dark (key), brink (half)
- **Notes:** "An ally" includes the wearer, and it works while the wearer stands. Hidden doesn't land on a Taunting unit, so it does nothing for an anchor in its Taunt. An ally that starts a fight below a third hasn't dropped, and isn't Hidden until it's healed over the line and falls back. The stats keep the wearer standing and out of the picks.

### Heart of winter
- **Is:** amulet · legendary
- **Card:** Whenever its wearer adds Chill to one foe, every other foe gains as many stacks. What already adds Chill to every foe is unchanged. The Chill it adds isn't added again.
- **Stats:** Attack +1 · Attack speed medium · Cooldown medium · HP +1 (4 of 4)
- **Numbers:** as many stacks as the one foe gained, from the wearer's swings, abilities and gear. Chill keeps its cap and its shatter (`STATUS.chill`).
- **Code:** 9 (Chill added to one foe added to all), 23 (marked so nothing repeats it)
- **Serves:** Snap 3 ●●● ⚙ firecracker (half)
- **Notes:** Changed as the line says: today's adds a Chill on every hit. Seen on the first swing or lance: the whole row's counters rise together. It's the firecracker's cold field from one source. How I read "to one foe", and what it does beside a shatter's own cold, are under *Challenges* and *Loops*.

### Second dawn
- **Is:** amulet · legendary
- **Card:** Each time a foe falls, the start-of-fight effects of every ally's gear and seat happen again. Each happens once a fall, whatever else calls for it, and nothing repeats it.
- **Stats:** Attack +1 · Crit chance +1 · HP +1 · Defense +1 (4 of 4)
- **Numbers:** none of its own: each effect comes at the size it had as the fight started.
- **Code:** 8, 23
- **Serves:** Hunt 3 ●●● ⚙ opening again (key)
- **Notes:** A party's piece: any unit can carry it, and it works while its wearer stands. Prices and drawbacks paid at the start don't happen again (Halved heart's, Horn of the charge's). I read "gear and seat" by the letter, so a formation's own rule doesn't happen again (*Challenges*). A foe felled by an effect that happened again is a fall like any other.

### Downhill charm
- **Is:** amulet · legendary
- **Card:** What its wearer's killing blows have left over is split evenly among the other foes, once: a share that fells a foe carries no further.
- **Stats:** Attack +2 · Crit chance +1 · Crit damage medium (4 of 4)
- **Numbers:** none of its own: the blow's damage past the HP its foe had left, divided by the foes still standing. Each share meets its foe's Defense.
- **Code:** 5
- **Serves:** Landslide ●●, Hunt ●● ⚙ avalanche (key)
- **Notes:** Seen as the line says: a kill, and a small number on every other foe. The other half is a blow far bigger than what it lands on; small shares lose more to Defense, so on an armoured pack it's weak. Whether a share is a hit on the foe it reaches is under *Challenges*.

### Twin-knot
- **Is:** amulet · legendary
- **Card:** Whenever its wearer gives itself a status, the other ally with the lowest share of max HP gains it too, with as many stacks. A state its wearer holds only while something is true of it (while it's below half its HP, while it holds a Shield) isn't given, and isn't shared. What's shared isn't shared again.
- **Stats:** Cooldown medium · Attack +1 · HP +1 · Defense +1 (4 of 4)
- **Numbers:** the copy is the same size: as many stacks, as much Shield. It runs its own course on the ally, at the status's own length.
- **Code:** 13
- **Serves:** exotic ⚙ borrowed gift (key), brink (half), two in the dark (half)
- **Notes:** "Gives itself" is the spine's: from its own ability, passive, gear or seat. So it's a Taunt, a Vanish, a Flow or a Frenzy, and also Vanguard's Shield, each Shield the Valkyrie's hits build, and a counter a piece adds to its wearer. Hidden won't land on a Taunting ally, and a Fizzle status won't land twice. The second sentence of the card is my boundary (*Challenges*), and Twins has to draw the same one.

### Scapegoat charm
- **Is:** amulet · legendary
- **Card:** When its wearer is given a debuff, its next hit that lands gives that debuff, with all the stacks it holds then, to its target, and the wearer is rid of it. It lands on the foe as a fresh one, at its own length. Doom can't be passed on.
- **Stats:** Aggro +1 · Attack speed medium · HP +1 · Defense +1 (4 of 4)
- **Numbers:** all the stacks. Every debuff the wearer holds goes on the one hit.
- **Code:** 9 (a whole debuff handed on)
- **Serves:** exotic ⚙ carrier (half)
- **Notes:** Seen where foes afflict: the curse lands, and the next blow hands it back. A Stun is never passed, since it ends before its holder can hit. A boss still resists a control passed to it. On one unit with Carrier's coat it works against the coat: it clears what the coat reads. Aggro brings it the curses; Attack speed shortens the wait.

### Burning heart
- **Is:** amulet · legendary
- **Card:** Every 10 ticks its wearer sets itself alight: a few Burn on itself, a set number that reads no stat. While it holds any Burn, its hits deal half again as much.
- **Stats:** Lifesteal high · HP +1 · Attack +1 (4 of 4)
- **Numbers:** a few: `FLAT_STACKS.few`, every 10 ticks, which is how long that many stacks take to burn out, so the wearer stays alight. Burn keeps its own numbers (`STATUS.burn`): about 40 HP a tick, some 1,600 over a regular fight. Hits +50%.
- **Code:** 22 (a status the wearer lays on itself)
- **Serves:** exotic, Pact ●, Bonfire ● ⚙ carrier (half)
- **Notes:** The line's "every few ticks" can't be worn: at Burn's numbers it kills its wearer inside one fight (*Challenges*). Any Burn lights it, a foe's included. A Cleanse puts it out until the next beat, and a Shield soaks the fire. Lifesteal high is how a hard hitter pays for it.

### Phoenix ember
- **Is:** amulet · legendary
- **Card:** Once a fight, when its wearer falls, it stands up 4 ticks later with a third of its max HP, Hidden, and with every ability on its full cooldown. If no ally is standing when it falls, the fight is lost before it rises.
- **Stats:** HP +1 · Defense +1 · Evasion medium · MP regen +1 (4 of 4)
- **Numbers:** 4 ticks (today's). A third of max HP (today's is a fifth). Hidden at its own length (`STATUS.hidden`).
- **Code:** as today's Phoenix ember, with Hidden given as it stands
- **Serves:** net
- **Notes:** Changed as the line says: a third in place of a fifth, and Hidden, so the returned unit isn't felled again at once. The last sentence of the card is what the engine does today. Today's HP −1 price is dropped: the net is sized as protection, and its stats are plain cover in place of today's Attack +2.

### Ready stance
- **Is:** amulet · legendary
- **Card:** Its wearer's abilities start every fight at least half charged. Its cooldowns are a fifth longer.
- **Stats:** Attack +1 · Crit chance +1 · MP +1 · Evasion medium (4 of 4)
- **Numbers:** as each fight starts, each ability has at most half its cooldown left. Cooldowns ×1.2: Cooldown −16.7, a shape that counts no step, as today.
- **Code:** as today's Ready stance
- **Serves:** first move, Hunt ●●, Barrage ●●
- **Notes:** Kept: today's card and sizes. Its first half is a start-of-fight effect, so Second dawn on an ally gives it again at each fall; the longer cooldowns aren't. Today's stats kept but for one Attack step, which becomes MP for the abilities it brings forward.

### Gambler's coin
- **Is:** amulet · legendary
- **Card:** Its wearer's crit chance is about half. Its hits that don't crit deal half; its crits deal what a crit always does. Hits that always crit still do.
- **Stats:** Crit damage medium · Attack +1 · HP +1 · MP +1 (4 of 4)
- **Numbers:** crit chance set to 50 after every stat, so nothing that raises the stat moves it; "about", because a rule that lifts crits on some hits adds after it. Hits that don't crit: −50%.
- **Code:** as today's Gambler's coin
- **Serves:** exotic ⚙ emptied quiver (half)
- **Notes:** Kept: today's card and sizes. One Attack step of today's becomes Crit damage: with none, the coin's average is a plain unit's, and what it pays is whatever a crit sets off. Under Quick draw each swing chains to about two arrows on average.

### Turncoat charm
- **Is:** amulet · legendary
- **Card:** Its wearer's Attack and Defense are swapped, as they stand on its sheet with its gear and its seat counted. Statuses change them as usual after that: a Guard still raises its Defense.
- **Stats:** HP +2 · Crit chance +1 · Evasion medium (4 of 4)
- **Numbers:** none.
- **Code:** 22 (two stats swapped), before statuses
- **Serves:** exotic
- **Notes:** It carries neither Attack nor Defense, so its own steps don't swap. What it does depends on the class: a Monk or an Assassin becomes a wall whose stacks shrink, and a Knight in Defense gear a striker. On a Hoplite or a Paladin, whose two stats are level, it does nothing until gear tips them.

## Challenges

Lines I couldn't write as they stand, with what I wrote in their place.

- **Burning heart can't be worn at the line's sizes.** "A few Burn every few ticks" settles at about 150 HP a tick at Burn's own numbers: most of a Knight's bar in one regular fight, from its own amulet. A boss's Brand lays the same few once every 24 ticks. I kept "a few" (the scale's word) and wrote the beat as 10 ticks, the slowest that keeps the wearer alight, which still costs about 1,600 HP a fight. The other way is a single Burn on every pulse (about 27 HP a tick). The line needs one or the other.
- **Heart of winter, "to one foe".** I read it as an application that lands on one foe: a swing's rider, a lance, each hit of a swing that fans out. What adds Chill to every foe at once (Blizzard, Stillness) is left alone, or a pack of eight would take eight times the cast. Under this reading a swing that fans out still multiplies: a Hexer's Chain wand lays its Chill three times over. If the line meant every application, the card's second sentence goes.
- **Heart of winter beside a shatter's own cold** needs code support 23 to reach it. Glacier's heart puts cold back on one foe, and Winter's chain sends it to one foe; on the same wearer, Heart of winter copies either to every other foe. Those copies are cold a shatter passed on and have to be damped as such, or the chain has no brake in a pack (*Loops*).
- **Halved heart at exactly half.** Every "below half" card and kit (Bloodlust, Lament, Gorged claws, Sanguine mail, The Red Feast) is off at exactly half, where this piece heals its wearer back to. builds.md's brink names Bloodlust as the power of a unit that traded away the top half of its bar, so I added "at half it counts as below half its HP". The line doesn't say it.
- **Halved heart between fights.** HP carries, so a potion or a campfire above half is wasted on its wearer, and the unit is at half when the charm comes off. builds.md asks for power below half that doesn't leave a unit low when the fight ends. Written as the line stands.
- **Twin-knot, "gives itself".** By the spine's words a passive's or a piece's state counts: Bloodlust's doubled Lifesteal, Bedrock's doubled crit, Last rites' halved cooldowns, Portcullis's draw. Those states have no length of their own, so a copy would sit on the ally all fight. I drew the line on the card: a state held only while something is true of the wearer isn't given, and isn't shared. Twins, in the formations, needs the same line.
- **Second dawn, "gear and seat".** *Start-of-fight effects* names three things (a piece, a seat, a formation's rule) and the line names two. I read it by the letter: First light and Open season's opening volley don't happen again. The card also says each effect happens once a fall, so Tally coat on the same unit doesn't fire its wearer's effects a second time for the same kill. Both are readings.
- **Shatterstone charm, with no foe to blame.** A Shield worn through by Burn or Bleed on the wearer has no foe that broke it. I wrote that nothing is sent back. Rubble plate has no such gap.
- **Downhill charm: is a share a hit?** The spine says left-over damage "lands as the same hit". If each share counts as a hit landing on its foe, every wound on the field pays and every thorned foe answers. I wrote only that it meets Defense. Overkill axe and Overrun need the same answer, and one unit holding Overrun and this charm would deal the same left-over twice unless they share it as two fire-movers do.
- **Echo charm is thinner than today's.** The fist weapons' riders already cover extra strikes, the Monk's passive does, and the phrase drops on-hit effects. It's left with Arc on a Stormcaller, a rider from a seat or a storm, and Double strike borrowed onto a rider unit. I put Double strike on the piece so it works alone. Whether a Thunderstorm's Shock is "what the swing carries" isn't in the phrase's bracket; I read it as carried.
- **Hunter's mark ignores Taunt.** The Mark isn't a pick, so it goes to the foe with the lowest current HP whoever Taunts, and a party with no Seek can't follow it. If the Mark should sit inside the Taunt rule, the card needs a clause.
- **Clear-headed charm.** "Whenever it drops below half, every so often" reads two ways. I wrote it as a state: below half, a Clarity each short wait, the first one at once.
- **Millstone, Hummingbird charm and other hits of "its basic attack's size".** Today the shape is a boost on basic attacks. Whether an extra strike, or a strike "with its weapon", takes the shape's size isn't said anywhere. I assumed they do.
- **Moonstone has no line.** Today's Aggro-down common isn't among the ten. I put Aggro −1 on Clear-headed charm and Shroud charm.
- **`fill/shared.md`:**
  - "Every few ticks" is on four cards in four shares (Kindled robes, Everflame lantern, The forge, Burning heart) with no number. Mine now states its own.
  - Crescendo: the table doesn't say when the stack lands. I wrote it as landing when a cast is done, so the first cast is plain.
  - "The most that Shield held" is read by four items in four shares (Rubble plate, Second skin, Rampart, Shatterstone charm) and defined nowhere. I used the pool's highest point since the unit last had no Shield.
- **Names:**
  - Icebreaker charm clashes with Icebreaker, the great weapon. Proposed: Floe charm.
  - Lodestone clashes with Lodestone shield, and Whetstone with The whetstone. Both are today's commons, kept by the rule. Proposed: Bezoar and Flint.
  - Shatterstone charm uses Chill's word for a Shield's piece. Proposed: Rubble charm, beside Rubble plate and Rubble shield.
  - Burning heart and Ember heart are two fire hearts in one slot. Proposed: Live coal for Burning heart.
  - Tinder charm reads as fire and serves four statuses. Proposed: Sympathy charm.
  - Turncoat charm may read as a foe changing sides. Proposed: Inside-out charm.

## Links

For each engine, the size on my side and what the other side needs.

- **The shield detonation.** Shatterstone charm sends back twice the pool's peak, to the foe that broke it. Carapace charm adds 15% of max HP at the start. The other side is Shields big enough to be worth breaking, and one meaning for "the most that Shield held". A Shield rebuilt at half sends back half.
- **The frozen gate.** Challenger's token gives one Taunt, for Taunt's own length. A foe lands two to four blows in it, so the Chill-on-struck piece needs three or four stacks a blow to shatter a pack inside the Taunt; after it, the token's Aggro step is all the draw there is.
- **The mirror.** The token's Taunt is over before a boss's heaviest blow comes round. The draw through the wind-up has to come from Aggro or a Taunt that holds.
- **The goad.** The token is one call a fight under Goading totem, at the first tick, when no foe holds a charge yet. It pays through Thorns and what the anchor's gear lays on whoever strikes it, not through Shock.
- **The held charge.** Lightning-glass: 4% a Shock, about two and a half times at the cap. The other side is charge that sits on whatever the wearer's abilities pick: a whole field charged, or a held foe.
- **The reckoning.** Millstone gives Wrath twice the time to climb, and the blow that spends it starts at two and a quarter times a plain one. With Wrath full it's the fight's biggest swing by a wide margin; how the two boosts combine is the build's to check.
- **The reaping.** Bounty charm readies the ability that killed. The other side is an execute that kills a sunk foe in one, a field sunk together, and mana for several casts running.
- **The judge's drum.** Millstone makes each call a whole heavy swing. Hunter's mark keeps a Mark on the lowest foe, so the pieces that wait for a Marked foe's fall fire on nearly every kill.
- **The opening, again.** Second dawn fires every ally's, on every fall. My common half: a Taunt, 15% of max HP as Shield, a Haste, abilities half charged. A status that refreshes is only renewed, so the other shares' start-of-fight uncommons pay best where they add stacks or pool.
- **The fuse.** Ember heart moves all of it, and holds it without loss until its wearer's next hit. The other side is the feeders' own aim at the hottest foe, and a wearer that hits often.
- **The avalanche.** Downhill charm splits the whole left-over, once. Millstone makes the left-over. The other side is foes with little Defense: small shares lose most to it.
- **The spell on the swing.** Hummingbird charm halves the time a count of swings takes, and Hare's foot brings swings two fifths more often for Haste's length. Mana stays the brake.
- **The riposte.** The token puts the foes' picks on a dodger for Taunt's length; after that the draw has to be the dodger's own.
- **The lead's colour.** Tinder charm on a Lead puts its rider on both Followers, but it starts nothing. The other side is one real colour on a swing.
- **The emptied quiver.** Gambler's coin: about half. Under Quick draw a swing averages two arrows; a piece that lifts crits on some hits adds to that.
- **The crescendo.** Crescendo charm's price climbs a fifth a stack, the slope of the counter itself. The other side is casts that are free and still add a stack.
- **Mana as armour.** Clear-headed charm: a Clarity, about a quarter of the pool, each short wait while its wearer is under half its MP. On a unit whose MP takes its damage, that's a quarter of the pool soaked each time.
- **The shatter bell.** Icebreaker charm: the slowest ability ready, once a shatter. The other side is a second and third shatter in the fight, and mana.
- **The firecracker string.** Heart of winter makes one source's cold the whole field's, so a burst foe's neighbours stand at the same count. The other side is the damping reaching its copies.
- **The brink.** Halved heart: a cap at half that counts as below half. Shroud charm hides whoever crosses a third. Twin-knot sends its wearer's own gifts to the lowest ally. The other side is the kits' gifts and the "below half" cards.
- **Two in the dark.** Shroud charm: Hidden's own length at each crossing. Twin-knot doubles one hider's Hidden. The token is the third who wants the blows.
- **The borrowed gift.** Twin-knot: the same size. Twins needs the same reading of "gives itself".
- **The carrier.** Burning heart keeps a stack or two of Burn on its wearer all fight, so Carrier's coat adds a Burn with every hit. Scapegoat charm hands on whole debuffs, and works against the coat on the same unit.

## Loops

Each with the items in it and what stops it.

- **Heart of winter with Glacier's heart or Winter's chain, on one wearer.** A shatter puts cold on one foe, the charm copies it to every other foe, they shatter, and each does the same. What stops it is code support 23, if it counts the charm's copies as cold a shatter passed on. Counted so, the chain runs a few rounds and dies, since each foe takes half as much each time it has burst. Not counted, nothing stops it.
- **Challenger's token, Goading totem and Second dawn** (or Tally coat on the anchor). A fall, the Taunt again, every foe swings at once, Thorns fell another. Each turn needs a fall, and the foes run out. On a thorn wall against a swarm that's a weak brake: a pack can empty in one moment.
- **Hunter's mark on a Paladin holding Writ of judgement.** Each Mark is a heavy blow, and a kill lays the next Mark at once on the next lowest foe. It stops at a foe that survives the blow. At a fight's start it walks up the field from the weakest.
- **Hunter's mark with Hunting horn, Open season or Swift justice.** A Marked foe falls, the volley is called, the Mark is already on the next lowest. It stops at a volley that doesn't kill, and "at once" doesn't stack.
- **Twin-knot, Matador's cape and Goading totem.** A dodge, a Taunt, a copied Taunt on the totem's holder, every foe swings, a dodge. It stops at a round with no dodge, which is weak against a pack.
- **Bounty charm.** A kill readies the ability that killed. It stops at a blow that doesn't kill, at the wind-up, and at the mana.
- **Icebreaker charm on a unit whose slowest ability lays Chill.** A shatter, the spell again, more cold. It stops at the wind-up, the mana, and the cold each shatter spends. Orb of the long winter takes the mana brake away.
- **Second dawn with Reveille, Scrying orb, Ready stance, Quietus or Opening shot.** A fall brings an ability or a strike, which fells the next. The foes run out; summoners make it longer.
- **Shatterstone charm with Second skin or Rampart.** A break, a rebuilt Shield, a break. Each break needs a foe's blow, Second skin waits "every so often", and Rampart rebuilds once.
- **Clear-headed charm with The deep well.** Clarity makes casts free, free casts keep MP up. It stops at the wait between two Clarities and at the half line.
- **Gambler's coin with Quick draw.** builds.md's own. It stops at the crit that fails, about one in two.
- **Shroud charm on a unit that pays or drains across a third.** Each crossing hides it again. Hidden refreshes and doesn't stack, and it has to be healed back over the line first.
- **Ember heart.** The fire moves from kill to kill. The foes run out, and Burn drains once it's back on a foe.

## Code support beyond the spine's list

- **The foe that broke a Shield,** as the target of the break's reaction: Shatterstone charm, and Rubble shield needs it too.
- **An ability chosen by its whole cooldown,** not the cooldown left: Icebreaker charm, and Icefall's Breaker seat.
- **A fallen foe's Burn held on a unit until its next hit,** shown as a number: Ember heart.
- **HP cut to half as a fight starts,** as a drawback that's neither damage nor a price paid, and a unit at its cap counted as below half: Halved heart. Number 14 covers the cap on healing.
- **A stat swap taken before statuses:** Turncoat charm. Number 22 names the swap, not when.
- **Heart of winter's copies carry where their cold came from,** so number 23's damping reaches cold that started as a shatter's.
- **Crescendo is counted ability by ability,** so its icon needs a number for each ability, or shows the highest.
- **Hidden given on a timed return:** Phoenix ember.

## Least sure

- **Burning heart.** Even at 10 ticks it costs about 1,600 HP a fight. It may be worn by nobody without Lifesteal and a healer, or it may be what Blood Pact wants. The size is a guess between killing its wearer and not being seen.
- **Heart of winter.** One Chill rider on its wearer chills the whole field at a single target's pace, and on an anchor with Hoarfrost plate every blow a pack lands chills all of it. It may be Cold Snap's far end in one piece.
- **Twin-knot's boundary.** The second sentence of its card is the hardest in my share to read, and the piece does something different on every class. Vanguard's Shield, the Valkyrie's Shield from every hit and a piece's counters are all shared under it.
- **Halved heart.** Three sentences of rules before its payoff. It also meets Bloodlust draught, whose doubled Lifesteal lasts "until it's full": under this charm that's all fight.
- **Shroud charm when the whole party is low.** An Area blow can drop all three below a third together. All three are Hidden, and foes with no Area have nothing to pick for Hidden's length.
- **Carapace charm** is the thinnest size in my share, and reads as a smaller Vanguard. I kept today's 15% and can't show it's too small.
- **Tinder charm.** The hardest uncommon to read, as the spine says, and blank on a clean foe. With Bleed it re-opens a wound on every swing, which may be more than its ● for Thousand Cuts.
- **Lightning-glass beside Thunderhead maul.** One word apart, and both wearable by a Paladin, a Hoplite or a Geomancer. On their abilities the two add up.
- **Second dawn with Ready stance or Reveille on an ally.** Every fall half-charges a kit or readies an ability. It may be most of the piece's power, and nothing on either card hints at it.
- **The stats.** HP is on 16 of the 27 pieces above common, as the careful step. That may be too even a spread for a slot whose pieces are meant to pull apart.
