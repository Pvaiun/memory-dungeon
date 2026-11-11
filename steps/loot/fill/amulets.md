# The fill: amulets

37 pieces, every one worn by any class: 10 commons, 7 uncommons, 10 rares, 10 legendaries, in the spine's order. Every number is a first value. The stats are mine, set for the road each piece serves. Five commons carry new names of mine (Cat's eye, Carnelian, Caltrop, Skipping stone, Tidestone), and round 1 renamed two more (Bezoar, Flint) and Floe charm. Round 1's rulings are applied throughout.

## Amulet

### Bezoar
- **Is:** amulet · common
- **Card:** Nothing beyond its stats.
- **Stats:** HP +1 (1 of 1)
- **Numbers:** `HP_STEP`.
- **Code:** as today's Lodestone
- **Serves:** the Toll, Blood Pact: max HP is the anchor's body and the price Blood Pact pays in.
- **Notes:** Today's Lodestone and its step, renamed in round 1.

### Ironstone
- **Is:** amulet · common
- **Card:** Nothing beyond its stats.
- **Stats:** Defense +1 (1 of 1)
- **Numbers:** `STEP`.
- **Code:** as today's Ironstone
- **Serves:** Landslide, the Toll: Defense is the stone's damage stat and the wall's cover.
- **Notes:** Today's name and step.

### Flint
- **Is:** amulet · common
- **Card:** Nothing beyond its stats.
- **Stats:** Attack +1 (1 of 1)
- **Numbers:** `STEP`.
- **Code:** as today's Whetstone
- **Serves:** Bonfire, Cold Snap, the Storm: their stacks are read off Attack.
- **Notes:** Today's Whetstone and its step, renamed in round 1.

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
- **Notes:** Seen as a second feeder: a few a swing is what Cold hex and Kindling add, so the wearer doubles the kit's own source and the counter climbs twice as fast. It starts nothing, so in a party with no status it's two stat steps. It's a rider on the basic attack, so it's part of "what the swing carries"; a unit that carries it from another reads its own Attack. Attack sizes its stacks; HP makes it the careful pick.

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
- **Numbers:** half as often: Attack speed −100, a shape that counts no step, as today. Two and a quarter times: +125% on basic attacks, today's size. By round 1's ruling, a hit "of its basic attack's size" (an extra strike, a strike with its weapon) takes this size too.
- **Code:** as today's Millstone
- **Serves:** Landslide 1 ●●●, Hunt ● ⚙ judge's drum (half), avalanche (half), reckoning (half) ◆ heavy-blow
- **Notes:** Kept: today's card and size, at uncommon, with a step fewer. Seen in the first swing: one number where there were two, bigger than both. Might is spent an action at a time, so it lasts twice as long on this unit. On a Hoplite it adds to Phalanx: a third as often.

### Hummingbird charm
- **Is:** amulet · uncommon
- **Card:** Its wearer's basic attacks come twice as often and deal half as much.
- **Stats:** Double strike medium · Evasion medium (2 of 2)
- **Numbers:** twice as often: Attack speed +100, a shape that counts no step, as today. Half as much: −50% on basic attacks. By round 1's ruling, a hit "of its basic attack's size" (an extra strike, a strike with its weapon) is halved too.
- **Code:** as today's Hummingbird charm
- **Serves:** Cuts 1 ●●●, Bonfire ●, Snap ●, Storm ● ⚙ spell on the swing (half)
- **Notes:** Changed as the line says: today's deals 45%, the line says half. Seen at once: twice the numbers, and whatever the swing carries laid twice as fast. Against Defense and Thorns it's a loss, which is what it gives up.

### Clear-headed charm
- **Is:** amulet · uncommon
- **Card:** While its wearer is below half its MP, it gains Clarity every so often, the first at once.
- **Stats:** MP +1 · Aggro −1 (2 of 2)
- **Numbers:** half of max MP, as a state: a Clarity as the wearer's MP goes under half, or as a fight starts with it under, and another each time the wait ends with it still under. "Every so often" is `COOLDOWN.short` between two, counted from the last one given, so going over half and back under inside the wait gives nothing. Clarity at its own size and length (`STATUS.clarity`): about a quarter of the pool, close to one spell's cost for a caster.
- **Code:** none new: a state of its wearer's MP on a beat of its own, as the other "every so often" pieces
- **Serves:** Barrage 1 ●● ⚙ mana as armour (half) ◆ free-cast
- **Notes:** The first card, back by round 2's ruling: the crossing ruling is for HP, and a watcher of MP keeps its own card's words. Fired once a crossing, it was worth least to the driest caster, which is the one it's for. Seen as the line says: the blue bar turns round, by about a cast's worth, when it runs low, and again for as long as it stays low. Clarity lasts 16 ticks of each 22, so a dry caster holds it most of the time. It isn't a start-of-fight effect, so nothing makes it happen again. MP sizes the Clarity; Aggro down is the caster's careful step.

### Shatterstone charm
- **Is:** amulet · rare
- **Card:** When a foe breaks its wearer's Shield, twice the most that Shield held is sent back to that foe. A Shield worn through by a status's damage sends nothing back.
- **Stats:** HP +1 · Defense +1 · Aggro +1 (3 of 3)
- **Numbers:** twice the pool's highest point since the wearer last had no Shield (`fill/shared.md`). It reads the Shield, not a stat.
- **Code:** as today's Rubble plate (a Shield's break, with the most it held as the amount); the foe that broke it as the target is under *Code support beyond the spine's list*
- **Serves:** Landslide 2 ●●●, Cuts ●, Toll ●● ⚙ detonation (key)
- **Notes:** Seen on the first break: a Knight's opening Shield sends back enough to fell a wolf. The other half is any Shield on the wearer; a Shield rebuilt at half sends back half. The second sentence of the card stands by round 1's ruling. HP raises the pool's cap, and Aggro brings the blows that break it.

### Bounty charm
- **Is:** amulet · rare
- **Card:** When its wearer lands a killing blow, its ability with the longest cooldown left is ready at once. The ability that landed the blow counts.
- **Stats:** Attack +1 · Crit chance +1 · MP +1 (3 of 3)
- **Numbers:** ready: that ability's cooldown left is set to nothing. "The longest cooldown left" is the one with the most wait left. One ability a kill, so a cast that fells two foes readies two.
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
- **Notes:** Changed to the spine's phrase: today's card also passes on-hit effects, and the phrase is statuses alone, with no second target and no Refrain. By round 1 it carries a Thunderstorm's Shock too, and "extra strikes" are Double strike's second strike and what Flurry wraps chains from it. Double strike is its first stat so that every wearer has extra strikes for it to work on: a Hexer has none otherwise. Its audience is thinner than today's (*Challenges*).

### Floe charm
- **Is:** amulet · rare
- **Card:** When a foe's Chill shatters, its wearer's ability with the longest cooldown is ready at once: its slowest ability, by its whole cooldown. If that one is ready already, nothing happens.
- **Stats:** Cast speed medium · MP +1 · HP +1 (3 of 3)
- **Numbers:** ready: that ability's cooldown left is set to nothing. The slowest is read as the player sees it, in ticks, after any version or power step.
- **Code:** a shatter is an event today, and readying is today's Hunting spear; choosing by the whole cooldown is under *Code support beyond the spine's list*
- **Serves:** Snap 2 ●●●, Landslide ●●, Barrage ●●, Bonfire ●● ⚙ shatter bell (key)
- **Notes:** Renamed in round 1 from Icebreaker charm. Seen as the line says: SHATTER, and the great spell's name under it. The other half is a party that shatters more than once a fight. Cast speed is there so a long wind-up lands while the shattered foe is still Stunned; MP because the slowest ability is usually the dearest.

### Lightning-glass
- **Is:** amulet · rare
- **Card:** Its wearer's abilities deal 4% more for each Shock on their target. The Shock stays.
- **Stats:** Attack +1 · Cooldown medium · MP +1 (3 of 3)
- **Numbers:** 4% a stack: two fifths more at 10 Shock, double at 25, about two and a half times at the cap (`STATUS.shock.cap`), which is close to what Skyfall gets from a full charge.
- **Code:** none new: a boost sized by its target's stacks, as Skyfall and Pyre read them in the kits
- **Serves:** Storm 2 ●●●, Landslide ●, Snap ● ⚙ held charge (key)
- **Notes:** Sized to the link (a charge at its cap doubles the blow or more) and to be seen below it: a foe holding ten Shock takes two fifths more. The wearer's abilities don't aim at the most charged foe, so the other half is a field charged all over, or a foe held still while the charge climbs. One word from Thunderhead maul, which three classes wear beside it; both stay as they are and the pair goes to the director, first on the list of cards alike (round 3).

### Halved heart
- **Is:** amulet · rare
- **Card:** Its wearer starts every fight at half its max HP: anything above half is lost as the fight starts, and it isn't a price paid. It can't be healed above half; healing past that counts as healing past full. At half it counts as below half its max HP. Its wearer's hits deal half again as much.
- **Stats:** Lifesteal medium · HP +1 · Defense +1 (3 of 3)
- **Numbers:** half of max HP, as the start and as the cap on healing. Hits +50%.
- **Code:** 14
- **Serves:** Pact 2 ●●●, Toll ● ⚙ brink (key)
- **Notes:** "At half it counts as below half" is the spine's line now. The drawback at the start isn't a start-of-fight effect that happens again. Shields aren't capped, so the cover the givers lay on it holds. A Regen's pulses stop at half too, and what they'd add past it counts as healing past full like any other: healing received is all of it, as round 2 rules. Healing that Shared cup sends on passes over it at its cap. Its wearer starts every fight under the line, so every "drops below half" piece that watches it fires as the fight starts, and a "whenever" one doesn't fire again. Round 2 rules that this stands: it's the brink doing what it's for, and nothing goes on the card. HP carries, so the wearer is at half or less when the charm comes off.

### Crescendo charm
- **Is:** amulet · rare
- **Card:** Each time its wearer finishes casting an ability, that ability gains a Crescendo (that ability deals, heals and adds a fifth more for each Crescendo it holds, up to 10), kept for the fight. An ability costs a fifth more for each Crescendo it holds, in whatever it's paid in. A cast that costs nothing still gains one.
- **Stats:** MP +1 · MP regen +1 · Cooldown medium (3 of 3)
- **Numbers:** Crescendo as `fill/shared.md` defines it. The cost climbs on the same slope: a fifth of the ability's own cost for each, so triple at 10.
- **Code:** 11
- **Serves:** Barrage 2 ●●● ⚙ crescendo (key)
- **Notes:** The stack lands when a cast finishes, so the first cast is plain and the second is the first bigger one. Seen from the third cast: two fifths more on the number and on the price. At this slope a Stormcaller's full pool pays for two Chain lightnings and not the third, which is the link's size; a free cast skips the price and keeps the stack. Beside Orb of the rising sun on one unit the count is one count and the price never rises, so the charm adds only its stats.

### Ember heart
- **Is:** amulet · rare
- **Card:** When a burning foe falls, all its Burn passes to the next foe its wearer hits. Until then the charm keeps it, shown as a number on its wearer: it isn't Burn on the wearer, and it doesn't burn down. A fallen foe's fire moves once: if something else in the party moves it too, it's split evenly between them.
- **Stats:** Attack +1 · Attack speed medium · HP +1 (3 of 3)
- **Numbers:** all the stacks the foe held as it fell. Fires from several falls before the wearer's next hit add up, and land together on that hit's first target.
- **Code:** 9 (a fallen foe's Burn moved), 23 (the split); the fire held on the wearer is under *Code support beyond the spine's list*
- **Serves:** Bonfire 2 ●●●, Hunt ●● ⚙ fuse (key)
- **Notes:** Changed as the line says: today's card (a third to every other foe) is Smouldering orb's now. Seen on the first kill of a burning foe: the next foe the wearer strikes starts already roaring. A dodged hit passes nothing, and the fire waits. Attack speed is there so the wait is short; the lantern and the orb are the casters' homes for this, so the amulet leans to the feeder that swings. The fire it keeps isn't a status on its wearer (round 3): it doesn't hurt the wearer, light Burning heart or pass by Carrier's coat.

### Hunter's mark
- **Is:** amulet · rare
- **Card:** While no foe is Marked, its wearer Marks the foe with the lowest current HP.
- **Stats:** Crit chance +1 · Crit damage medium · Attack +1 (3 of 3)
- **Numbers:** Marked at its own length (`STATUS.marked`). It's laid again at once when it runs out or its foe falls, on whichever foe is lowest then.
- **Code:** 19 (a Mark standing on the lowest foe), 1
- **Serves:** Hunt 2 ●●● ⚙ judge's drum (half)
- **Notes:** Laying the Mark isn't an action: it costs nothing and happens whatever its wearer is doing, while it stands. It isn't a start-of-fight effect. By round 1's ruling the Mark sits where it sits: behind a Taunting front it's on a foe only Seek reaches. With a Mark always on the lowest foe, nearly every fall is a Marked foe's fall, which is what the drum's pieces wait for.

### Shroud charm
- **Is:** amulet · rare
- **Card:** Whenever an ally drops below a third of its max HP, that ally is Hidden.
- **Stats:** Evasion medium · Aggro −1 · HP +1 (3 of 3)
- **Numbers:** a third of max HP, as a crossing: whatever takes the ally under it, and an ally that starts a fight under it is Hidden as the fight starts. It fires again each time the ally has been back at a third or over and crosses again. Hidden at its own length (`STATUS.hidden`).
- **Code:** none new: today's Red ribbon reads an ally dropping below a line
- **Serves:** Pact ●●, net ⚙ two in the dark (key), brink (half)
- **Notes:** "An ally" includes the wearer, and it works while the wearer stands. Hidden doesn't land on a Taunting unit, so it does nothing for an anchor in its Taunt, and by round 1's rule someone stays in the light: when all three would hide, the last in seat order doesn't. I read it as a watcher, not a start-of-fight effect. The stats keep the wearer standing and out of the picks.

### Heart of winter
- **Is:** amulet · legendary
- **Card:** Whenever its wearer adds Chill to one foe, every other foe gains as many stacks. What already adds Chill to every foe is unchanged. The Chill it adds isn't added again.
- **Stats:** Attack +1 · Attack speed medium · Cooldown medium · HP +1 (4 of 4)
- **Numbers:** as many stacks as the one foe gained, from the wearer's swings, abilities and gear. Chill keeps its cap and its shatter (`STATUS.chill`). Where the one foe's cold was passed on by a shatter, each copy is damped as that cold is.
- **Code:** 9 (Chill added to one foe added to all), 23 (marked so nothing repeats it; its copies of a shatter's cold damped as that cold is)
- **Serves:** Snap 3 ●●● ⚙ firecracker (half)
- **Notes:** Changed as the line says: today's adds a Chill on every hit. Seen on the first swing or lance: the whole row's counters rise together. It's the firecracker's cold field from one source. Round 1 ruled the reading: it copies Chill that lands on one foe, each hit of a swing that fans out included, and leaves alone what already lands on every foe.

### Second dawn
- **Is:** amulet · legendary
- **Card:** Each time a foe falls, the start-of-fight effects of every ally's gear and seat happen again, once for each fall.
- **Stats:** Attack +1 · Crit chance +1 · HP +1 · Defense +1 (4 of 4)
- **Numbers:** none of its own: each effect comes at the size it had as the fight started.
- **Code:** 8, 23
- **Serves:** Hunt 3 ●●● ⚙ opening again (key)
- **Notes:** A party's piece: any unit can carry it, and it works while its wearer stands. Prices and drawbacks paid at the start don't happen again (Halved heart's, Horn of the charge's). By round 1's ruling a formation's rule for the whole party isn't an ally's gear or seat, so it doesn't happen again; and a kill is a kill, so a foe felled by an effect that happened again is a fall like any other. "Once for each fall" is all the card says of the ruling (round 3): whatever else calls for the same fall's opening, it happens once, and nothing repeats it.

### Downhill charm
- **Is:** amulet · legendary
- **Card:** What its wearer's killing blows have left over is split evenly among the other foes, as a hit on each. It carries once: a share that fells a foe carries no further.
- **Stats:** Attack +2 · Crit chance +1 · Crit damage medium (4 of 4)
- **Numbers:** none of its own: the blow's damage past the HP its foe had left, divided by the foes still standing. Each share is a hit on the foe it reaches, by the ruling on left-over damage: it can be dodged and meets Defense, it isn't boosted or crit again, and it carries none of the blow's statuses. If another of its wearer's pieces carries the same left-over, the two share it evenly.
- **Code:** 5
- **Serves:** Landslide ●●, Hunt ●● ⚙ avalanche (key)
- **Notes:** The second and third sentences are round 1's ruling on left-over damage. Seen as the line says: a kill, and a small number on every other foe. Each share counts as a hit taken, so every wound on the field pays and every thorned foe answers. A foe a share fells is a kill, and calls whatever a kill calls. The other half is a blow far bigger than what it lands on; small shares lose more to Defense, so on an armoured pack it's weak.

### Twin-knot
- **Is:** amulet · legendary
- **Card:** Whenever its wearer gives itself a status, the other ally with the lowest share of max HP gains it too, with as many stacks. A state its wearer holds only while something is true of it (while it's below half its max HP, while it holds a Shield) isn't given, and isn't shared. What's shared isn't shared again.
- **Stats:** Cooldown medium · Attack +1 · HP +1 · Defense +1 (4 of 4)
- **Numbers:** the copy is the same size: as many stacks, as much Shield. It runs its own course on the ally, at the status's own length.
- **Code:** 13
- **Serves:** exotic ⚙ borrowed gift (key), brink (half), two in the dark (half)
- **Notes:** The boundary is round 1's ruling: a status laid at a moment is a gift (Hidden, Taunt, Haste, Might, Guard, a Shield, Regen, Clarity, Aegis, a counter a card gives), and a state held while something is true isn't. So it's a Taunt, a Vanish, a Flow or a Frenzy, and also Vanguard's Shield and each Shield the Valkyrie's hits build. Hidden won't land on a Taunting ally, a Fizzle status won't land twice, and a copied Hidden doesn't land where it would leave the foes nobody to pick.

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
- **Card:** Every 10 ticks, its wearer sets itself alight: a few Burn on itself, a set number that reads no stat. While it holds any Burn, its wearer's hits deal half again as much.
- **Stats:** Lifesteal high · HP +1 · Attack +1 (4 of 4)
- **Numbers:** a few: `FLAT_STACKS.few`, every 10 ticks, the card's own beat: it's how long that many stacks take to burn out. Burn keeps its own numbers (`STATUS.burn`): about 40 HP a tick, some 1,600 over a regular fight. Hits +50%.
- **Code:** 22 (a status the wearer lays on itself)
- **Serves:** exotic, Pact ●, Bonfire ● ⚙ carrier (half)
- **Notes:** The size stands by round 1's ruling, and the spine's line now reads "every so often… often enough that it never goes out". Any Burn lights it, a foe's included. A Cleanse puts it out until the next beat, and a Shield soaks the fire. Lifesteal high is how a hard hitter pays for it.

### Phoenix ember
- **Is:** amulet · legendary
- **Card:** Once a fight, when its wearer falls, it stands up 4 ticks later with a third of its max HP, Hidden, and with every ability on its full cooldown. If no ally is standing when it falls, the fight is lost before it rises.
- **Stats:** HP +1 · Defense +1 · Evasion medium · MP regen +1 (4 of 4)
- **Numbers:** 4 ticks (today's, and round 1's "a few ticks"). A third of max HP (today's is a fifth). Hidden at its own length (`STATUS.hidden`).
- **Code:** as today's Phoenix ember, with Hidden given as it stands
- **Serves:** net
- **Notes:** Changed as the line says: a third in place of a fifth, and Hidden, so the returned unit isn't felled again at once. The last sentence of the card is what the engine does today. By round 1's rule someone stays in the light, so it rises unhidden when every other standing ally is Hidden. Today's HP −1 price is dropped: the net is sized as protection, and its stats are plain cover in place of today's Attack +2.

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
- **Card:** Its wearer's crit chance is about half. Its wearer's hits that don't crit deal half; its crits deal what a crit always does. Hits that always crit still do, and a chance another card sets on some hits wins over the coin's.
- **Stats:** Crit damage medium · Attack +1 · HP +1 · MP +1 (4 of 4)
- **Numbers:** crit chance set to 50 after every stat, so nothing that raises the stat moves it. "About", because a rule that lifts crits on some hits adds after it, and a chance a card sets on some hits (four in five, always) replaces it there. Hits that don't crit: −50%.
- **Code:** as today's Gambler's coin
- **Serves:** exotic ⚙ emptied quiver (half)
- **Notes:** Kept: today's card and sizes; the last clause is round 1's ruling that a set chance wins over the coin. One Attack step of today's becomes Crit damage: with none, the coin's average is a plain unit's, and what it pays is whatever a crit sets off. Under Quick draw each swing chains to about two arrows on average.

### Turncoat charm
- **Is:** amulet · legendary
- **Card:** Its wearer's Attack and Defense are swapped, as they stand on its sheet with its gear and its seat counted. Statuses change them as usual after that: a Guard still raises its Defense.
- **Stats:** HP +2 · Crit chance +1 · Evasion medium (4 of 4)
- **Numbers:** none.
- **Code:** 22 (two stats swapped), before statuses
- **Serves:** exotic
- **Notes:** It carries neither Attack nor Defense, so its own steps don't swap. What it does depends on the class: a Monk or an Assassin becomes a wall whose stacks shrink, and a Knight in Defense gear a striker. On a Hoplite or a Paladin, whose two stats are level, it does nothing until gear tips them.

## Challenges

What round 1 didn't rule, and what its rulings opened. Round 2 ruled on five of these, marked below and applied above. Three are left: Halved heart between fights, Echo charm, and Moonstone.

- *Ruled in round 2: the crossing ruling is for HP, and the first card is back.* **Clear-headed charm: I applied the crossing ruling to MP.** The ruling names the watchers of HP, but the line's words are the same ("whenever… drops below half"), so I read them the same way. My first card gave a Clarity every short wait for as long as the wearer stayed under half. Now it's one for each crossing, and a caster drained far under half gets one a fight, at its start. If the line was meant as a state, the first card comes back.
- *Ruled in round 2: yes, and nothing goes on the card.* **Halved heart and the watchers of HP.** Its wearer starts every fight under the line, and at its cap it still counts as below half. So by the crossing ruling every "drops below half" piece that watches it fires as each fight starts (Holdfast, Warded mail, Bear fetish, Watch horn, Feathered cloak), and a "whenever" one never fires again, since the wearer is never back at the line. I've written nothing on the card for it. It needs a yes or a no.
- *Ruled in round 2: no. A crossing isn't a start-of-fight effect.* **Do the watchers count as start-of-fight effects?** Shroud charm and Clear-headed charm now fire as a fight starts on a unit already under the line. I read them as watchers, which Second dawn and Overture coat don't fire again. The spine's phrase ("whatever a piece does as a fight starts, however its card words it") could be read the other way.
- *Ruled in round 2: no. A killing blow is a hit.* **Is a foe felled by damage sent back a kill for its wearer?** "A kill is a kill" covers effects that happen again, called swings and left-overs. Damage sent back isn't a hit, by the spine's phrase. I've assumed it calls nothing that waits on a killing blow (Shatterstone charm).
- **Halved heart between fights.** HP carries, so a potion or a campfire above half is wasted on its wearer, and the unit is at half when the charm comes off. builds.md asks for power below half that doesn't leave a unit low when the fight ends. Written as the line stands.
- **Echo charm is thinner than today's.** The fist weapons' riders already cover extra strikes, the Monk's passive does, and the phrase drops on-hit effects. It's left with Arc on a Stormcaller, a rider from a seat or a storm, and Double strike borrowed onto a rider unit. I put Double strike on the piece so it works alone.
- *Ruled in round 2: as written.* **Gambler's coin and a raised chance.** A set chance wins over the coin, by the ruling. A card that raises Crit chance "to four in five at most" isn't a set chance; I've kept today's behaviour, where it adds to the coin's half. On a bleeding foe that puts a coin-holder with Bloodscent knife at four in five.
- **Moonstone has no line.** Today's Aggro-down common isn't among the ten. I put Aggro −1 on Clear-headed charm and Shroud charm.

## Links

For each engine, the size on my side and what the other side needs.

- **The shield detonation.** Shatterstone charm sends back twice the pool's peak, to the foe that broke it. Carapace charm adds 15% of max HP at the start. The other side is Shields big enough to be worth breaking. A Shield rebuilt at half sends back half.
- **The frozen gate.** Challenger's token gives one Taunt, for Taunt's own length. A foe lands two to four blows in it, so the Chill-on-struck piece needs three or four stacks a blow to shatter a pack inside the Taunt; after it, the token's Aggro step is all the draw there is.
- **The mirror.** The token's Taunt is over before a boss's heaviest blow comes round. The draw through the wind-up has to come from Aggro or a Taunt that holds.
- **The goad.** The token is one call a fight under Goading totem, at the first tick, when no foe holds a charge yet. It pays through Thorns and what the anchor's gear lays on whoever strikes it, not through Shock.
- **The held charge.** Lightning-glass: 4% a Shock, about two and a half times at the cap. The other side is charge that sits on whatever the wearer's abilities pick: a whole field charged, or a held foe.
- **The reckoning.** Millstone gives Wrath twice the time to climb, and the blow that spends it starts at two and a quarter times a plain one. With Wrath full it's the fight's biggest swing by a wide margin; how the two boosts combine is the build's to check.
- **The reaping.** Bounty charm readies the ability that killed. The other side is an execute that kills a sunk foe in one, a field sunk together, and mana for several casts running.
- **The judge's drum.** Millstone makes each call a whole heavy swing. Hunter's mark keeps a Mark on the lowest foe, so the pieces that wait for a Marked foe's fall fire on nearly every kill.
- **The opening, again.** Second dawn fires every ally's, on every fall, once a fall. My common half: a Taunt, 15% of max HP as Shield, a Haste, abilities half charged. A status that refreshes is only renewed, so the other shares' start-of-fight uncommons pay best where they add stacks or pool.
- **The fuse.** Ember heart moves all of it, and holds it without loss until its wearer's next hit. The other side is the feeders' own aim at the hottest foe, and a wearer that hits often.
- **The avalanche.** Downhill charm splits the whole left-over, once, and each share is a hit. Millstone makes the left-over. The other side is foes with little Defense: small shares lose most to it. Since a share is a hit taken, the charm is also a wide hit for the red rain: one kill pays every wound on the field.
- **The spell on the swing.** Hummingbird charm halves the time a count of swings takes, and Hare's foot brings swings two fifths more often for Haste's length. Mana stays the brake.
- **The riposte.** The token puts the foes' picks on a dodger for Taunt's length; after that the draw has to be the dodger's own.
- **The lead's colour.** Tinder charm on a Lead puts its rider on both Followers, each reading its own Attack, but it starts nothing. The other side is one real colour on a swing.
- **The emptied quiver.** Gambler's coin: about half. Under Quick draw a swing averages two arrows. A chance a card sets on some hits (four in five) replaces the coin's there, and runs five.
- **The crescendo.** Crescendo charm's price climbs a fifth a stack, the slope of the counter itself. The other side is casts that are free and still add a stack.
- **Mana as armour.** Clear-headed charm: a Clarity, about a quarter of the pool, every 22 ticks while its wearer's MP is under half. On a unit whose MP takes its damage, the blows themselves hold it there.
- **The shatter bell.** Floe charm: the slowest ability ready, once a shatter. The other side is a second and third shatter in the fight, and mana.
- **The firecracker string.** Heart of winter makes one source's cold the whole field's, so a burst foe's neighbours stand at the same count. Its copies of a shatter's cold are damped as that cold is.
- **The brink.** Halved heart: a cap at half that counts as below half, so the "below half" cards are on all fight, and the watchers of a drop below half fire on it as each fight starts. Shroud charm hides whoever crosses a third. Twin-knot sends its wearer's own gifts to the lowest ally. The other side is the kits' gifts.
- **Two in the dark.** Shroud charm: Hidden's own length at each crossing. Twin-knot doubles one hider's Hidden. The token is the third who wants the blows. Someone always stays in the light, so the engine can't hide all three.
- **The borrowed gift.** Twin-knot: the same size, for gifts laid at a moment. Twins reads the same ruling.
- **The carrier.** Burning heart keeps a stack or two of Burn on its wearer all fight, so Carrier's coat adds a Burn with every hit. Scapegoat charm hands on whole debuffs, and works against the coat on the same unit.

## Loops

Each with the items in it and what stops it.

- **Heart of winter with Glacier's heart or Winter's chain, on one wearer.** A shatter puts cold on one foe, the charm copies it to every other foe, they shatter, and each does the same. Code support 23 stops it, as ruled: the copies are damped as a shatter's cold is, in fractions of a stack, so each foe takes half as much each time it has burst and the chain dies down.
- **Challenger's token, Goading totem and Second dawn** (or Overture coat on the anchor). A fall, the Taunt again, every foe swings at once, Thorns fell another. Each turn needs a fall, and the foes run out. On a thorn wall against a swarm that's a weak brake: a pack can empty in one moment.
- **Hunter's mark on a Paladin holding Writ of judgement.** Each Mark is a heavy blow, and a kill lays the next Mark at once on the next lowest foe. It stops at a foe that survives the blow. At a fight's start it walks up the field from the weakest.
- **Hunter's mark with Hunting horn, Open season or Swift justice.** A Marked foe falls, the volley is called, the Mark is already on the next lowest. It stops at a volley that doesn't kill, and "at once" doesn't stack.
- **Downhill charm with a kill that calls the next swing** (Harvest scythe, Headsman's axe, Pack leader's coat). Opened by round 1: a share that fells a foe is a kill. A blow kills, its shares kill two more, each kill calls the next swing. It stops at a swing that doesn't kill; a share's own left-over goes no further, "at once" doesn't stack, and the foes run out.
- **Twin-knot, Matador's cape and Goading totem.** A dodge, a Taunt, a copied Taunt on the totem's holder, every foe swings, a dodge. It stops at a round with no dodge, which is weak against a pack.
- **Bounty charm.** A kill readies the ability that killed. It stops at a blow that doesn't kill, at the wind-up, and at the mana.
- **Floe charm on a unit whose slowest ability lays Chill.** A shatter, the spell again, more cold. It stops at the wind-up, the mana, and the cold each shatter spends. Meltwater orb takes the mana brake away.
- **Second dawn with Reveille, Scrying orb, Ready stance, Quietus or Opening shot.** A fall brings an ability or a strike, which fells the next. Each effect happens once a fall, and the foes run out; summoners make it longer.
- **Shatterstone charm with Second skin or Rampart.** A break, a rebuilt Shield, a break. Each break needs a foe's blow, Second skin waits "every so often", and Rampart rebuilds once.
- **Clear-headed charm with The deep well.** Below half the charm gives Clarity, and while Clarity lasts the well makes casts free. Clarity lasts 16 ticks of the charm's 22, so a wearer under half pays for about a quarter of its casts, and the Clarity itself lifts it back over the line. It settles near half a pool and doesn't run dry. *Brake:* over half there's no Clarity and every cast is paid; wind-ups and cooldowns. A size, not a loop: nothing is cast sooner.
- **Gambler's coin with Quick draw.** builds.md's own. It stops at the crit that fails, about one in two; beside a card that sets or raises the chance on some hits, one in five.
- **Shroud charm on a unit that pays or drains across a third.** Each crossing hides it again. Hidden refreshes and doesn't stack, and it has to be back at the line first.
- **Ember heart.** The fire moves from kill to kill. The foes run out, and Burn drains once it's back on a foe.

## Code support beyond the spine's list

- **The foe that broke a Shield,** as the target of the break's reaction: Shatterstone charm, and Rubble shield needs it too.
- **An ability chosen by its whole cooldown,** not the cooldown left: Floe charm, and the other places round 1 names (Icefall's Breaker, Frozen tome, Reveille).
- **A fallen foe's Burn held on a unit until its next hit,** shown as a number: Ember heart.
- **HP cut to half as a fight starts,** as a drawback that's neither damage nor a price paid, and a unit at its cap counted as below half: Halved heart. Number 14 covers the cap on healing.
- **A stat swap taken before statuses:** Turncoat charm. Number 22 names the swap, not when.
- **A copy that knows where its cold came from:** number 23, as ruled, damps Heart of winter's copies of a shatter's cold, so each copy has to carry that.
- **A state of MP under a line,** with a wait between two firings: Clear-headed charm. The watchers of HP are today's.
- **Crescendo is counted ability by ability,** so its icon needs a number for each ability, or shows the highest.
- **Hidden given on a timed return:** Phoenix ember.

## Least sure

- **Burning heart.** The size is ruled, and it still costs about 1,600 HP a fight. It may be worn by nobody without Lifesteal and a healer, or it may be what Blood Pact wants.
- **Heart of winter.** One Chill rider on its wearer chills the whole field at a single target's pace, and on an anchor with Hoarfrost plate every blow a pack lands chills all of it. It may be Cold Snap's far end in one piece.
- **Halved heart.** Three sentences of rules before its payoff, and two things nobody wrote: every watcher of a drop below half fires on it at each fight's start, and Ravening draught's doubled Lifesteal, which lasts "until it's full", lasts all fight.
- **Clear-headed charm beside The deep well.** As a state it's Barrage's first step at a size that's seen. With the well, a caster under half casts free three ticks in four.
- **Downhill charm as a wide hit.** With each share a hit taken, one kill cashes every wound on the field and takes every Thorns back. That's more than its line's "a small number on every other foe" suggests, for Thousand Cuts and against thorned packs alike.
- **Twin-knot.** Its boundary is ruled, and the second sentence of its card is still the hardest in my share to read. Vanguard's Shield, the Valkyrie's Shield from every hit and a counter a piece gives are all shared under it.
- **Shroud charm and who stays in the light.** When all three drop together, the last in seat order is the one left for every pick, whoever that is. A player can't see that rule on the card.
- **Carapace charm** is the thinnest size in my share, and reads as a smaller Vanguard. I kept today's 15% and can't show it's too small.
- **Tinder charm.** The hardest uncommon to read, as the spine says, and blank on a clean foe. With Bleed it re-opens a wound on every swing, which may be more than its ● for Thousand Cuts.
- **Lightning-glass beside Thunderhead maul.** One word apart, and both wearable by a Paladin, a Hoplite or a Geomancer. On their abilities the two add up.
- **Second dawn with Ready stance or Reveille on an ally.** Every fall half-charges a kit or readies an ability. It may be most of the piece's power, and nothing on either card hints at it.
- **The stats.** HP is on 16 of the 27 pieces above common, as the careful step. That may be too even a spread for a slot whose pieces are meant to pull apart.
