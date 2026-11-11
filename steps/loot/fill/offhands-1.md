# The fill: offhands, the first six kinds

Kite shield, round shield, horn, totem, relic and lantern: 54 pieces (12 commons, 17 uncommons, 16 rares, 9 legendaries), in the spine's order. Every number is a first value.

How to read it:
- **Every offhand takes the standard ladder:** 1, 2, 3 and 4 steps. The signature stat comes first on every piece of two steps or more, but for Shuttered lantern, where it works against the piece.
- **"When each fight starts"** is the wording of every start-of-fight effect here, today's cards included, so the eight that can happen again read alike.
- **"Drops below half"** is the crossing `fill/shared.md` defines, on the two cards that use it (Watch horn, Bear fetish): whatever took the unit under, a price included. A unit that starts a fight under half has dropped as the fight starts, and "whenever" fires again each time the unit is back at half or over and crosses again.
- **Round 1's rulings are applied.** Bossed kite was Spiked kite and Tower shield was Phalanx shield. Each kind's first common takes the first stat its row names, and the second takes its other stat.
- **Four commons are named new,** for the lead's check across shares: Blazoned kite, Blackthorn stake, Litany beads, Bullseye lantern. Eight keep today's name and step.

## Kite shield

### Pavise
- **Is:** kite shield · common
- **Card:** Nothing beyond its stats.
- **Stats:** Defense +1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** Landslide: Defense is its first stat.
- **Notes:** Today's common, name and step kept.

### Blazoned kite
- **Is:** kite shield · common
- **Card:** Nothing beyond its stats.
- **Stats:** Aggro +1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** the Toll: the draw is its first stat.
- **Notes:** A new name. The row gives this common Defense and Aggro; on one step it takes Aggro, so the kind's two commons differ and each is a road's. Today's Banner kite (HP +1) goes.

### Emberguard
- **Is:** kite shield · uncommon
- **Card:** Foes that hit its holder gain a few Burn (from its holder's Defense).
- **Stats:** Defense +1 · Aggro +1 (2 of 2)
- **Numbers:** a few (`STACKS.few`, through `own()`), read off its holder's Defense: about three a blow on a Knight. Burn keeps `STATUS.burn`.
- **Code:** as today's Nettle totem, with Burn.
- **Serves:** Bonfire 1 ●●, Toll ● ⚙ goad (half)
- **Notes:** It reads Defense, as Briar does, so the careful stat is also the fire's size. A foe that keeps striking the keeper holds five or six stacks, which is a number the player sees pulse. Aggro brings the blows that feed it.

### Sheltering kite
- **Is:** kite shield · uncommon
- **Card:** When each fight starts, its holder and the other ally with the least Defense are Guarded.
- **Stats:** Defense +1 · HP +1 (2 of 2)
- **Numbers:** none of its own: Guard keeps `STATUS.guard`. Ties for the least Defense are broken at random.
- **Code:** as today's Sheltering kite, with a second pick (the lowest Defense among the others).
- **Serves:** Landslide ●, net ⚙ opening again (half), mirror (half)
- **Notes:** Changed from today's as the line says: today's Guarded the ally with the lowest share of max HP alone. Happening again, both Guards are refreshed.

### Bossed kite
- **Is:** kite shield · uncommon
- **Card:** Each hit of its holder's abilities deals extra damage equal to a sixth of its Defense.
- **Stats:** Defense +2 (2 of 2)
- **Numbers:** a sixth on the card is a touch (`HIT.touch`) of its holder's Defense, added to the hit before boosts, crits and the foe's Defense.
- **Code:** none: a rider on its holder's ability hits, which a status's `riders` gives today.
- **Serves:** Landslide 1 ●● ◆ heavy-blow
- **Notes:** A touch of Defense is about half again on the Knight's bash and a third more on a Smite or a rock: the number is seen to grow, and it stays under the kind's rare. Both steps are Defense, so the piece's own stats make its blow bigger.

### Rubble shield
- **Is:** kite shield · rare
- **Card:** When its holder's Shield breaks, the foe whose blow broke it is Stunned.
- **Stats:** Defense +1 · HP +1 · Aggro +1 (3 of 3)
- **Numbers:** none of its own: Stun keeps `STATUS.stun`, and it's a Fizzle status, so a foe already Stunned isn't Stunned again.
- **Code:** as today's Rubble shield.
- **Serves:** Landslide 2 ●●, Toll ●●, Storm ● ⚙ held charge (half), detonation (half) ◆ held
- **Notes:** Kept from today's: card and steps, in the signature's order. HP raises the Shield's cap and Aggro brings the blow that breaks it. See *Loops* for small Shields.

### Mirror shield
- **Is:** kite shield · rare
- **Card:** Each foe that hits its holder is sent back half of the blow as it was struck: before Defense, Guard, an Aegis and Shields took theirs.
- **Stats:** Defense +1 · Aggro +1 · Thorns medium (3 of 3)
- **Numbers:** half (50%) of the blow as it was struck. It's sent back, so it isn't a hit: nothing cuts it and nothing reads it.
- **Code:** 4.
- **Serves:** Toll 2 ●●●, Landslide 2 ●● ⚙ mirror (key)
- **Notes:** At half, a Guarded Knight takes a smaller number from an ordinary swing than its attacker takes back, which is the picture the line asks for; a boss's heaviest blow sends back about a fourteenth of the boss's HP. A blocked or fully Shielded blow sends back the same; a dodged one sends nothing; a Weakened blow sends less. The Thorns step covers the small bites where half a blow is little.

### Monolith shield
- **Is:** kite shield · rare
- **Card:** Its holder's abilities that deal damage take twice as long to come round, and their hits land two and a half times as hard. What they apply is unchanged.
- **Stats:** Defense +2 · HP +1 (3 of 3)
- **Numbers:** cooldown twice as long; hits two and a half times as hard. Stacks, statuses and MP costs stay as they are. Abilities that deal no damage are untouched. The doubled cooldown is that ability's whole cooldown, for whatever reads its holder's slowest ability.
- **Code:** beyond the list: an ability change that lengthens the cooldown and multiplies the damage of abilities that deal damage.
- **Serves:** Landslide 2 ●●●, Hunt ● ⚙ shatter bell (half) ◆ heavy-blow
- **Notes:** Today's Millstone is two and a quarter for swings. An ability's doubled cooldown costs more than a swing's, since cooldowns carry and a fight is short, so this one pays a little more. Whatever readies an ability skips the doubled wait, and that's where it's worth most.

### Oathbound shield
- **Is:** kite shield · legendary
- **Card:** When a hit would deal an ally more than a quarter of its max HP, its holder takes the hit instead. A hit taken this way isn't passed on again.
- **Stats:** Defense +2 · HP +1 · Thorns medium (4 of 4)
- **Numbers:** a quarter (25%) of the ally's max HP, counted after that ally's Defense and before its Aegis and Shields. The hit then lands on the holder afresh, against the holder's own Defense and cover.
- **Code:** as today's Oathbound shield (`cover`); 23 for the redirect that's final.
- **Serves:** Toll 3 ●●●, Pact ●●, Barrage ●● ⚙ mirror (half)
- **Notes:** Kept from today's: card and steps. The second sentence is the spine's rule for a redirect, written on the card; today's engine already moves a hit once.

## Round shield

### Linden shield
- **Is:** round shield · common
- **Card:** Nothing beyond its stats.
- **Stats:** HP +1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** the Toll and Landslide: HP is their first stat on this kind.
- **Notes:** Today's common, name and step kept. It's the row's first common, so it takes the signature.

### Bronze buckler
- **Is:** round shield · common
- **Card:** Nothing beyond its stats.
- **Stats:** Defense +1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** the Toll and Landslide: Defense, beside the other common's HP.
- **Notes:** Today's common, name and step kept. The row gives this one HP and Defense; HP is taken, so it carries Defense. Round 1's ruling on commons turned the pair round: the Attack common I had is gone, and the kind has no common for the Hunt or the Storm.

### Comrade's targe
- **Is:** round shield · uncommon
- **Card:** Every so often, the ally with the lowest share of max HP gains a Shield of a fifth of its holder's max HP.
- **Stats:** HP +1 · Defense +1 (2 of 2)
- **Numbers:** a fifth of its holder's max HP, the share Vanguard uses. Every so often is `COOLDOWN.short`, with the first beat halfway to it, as today's beats run.
- **Code:** as today's Warding bell's beat, with a Shield.
- **Serves:** Pact 1 ●●, Toll ●, Landslide ● ⚙ brink (half), detonation (half) ◆ lowest-ally
- **Notes:** Only the name is today's. A fifth of a wall's HP is a third to a half of a caster's bar: a grey bar the player sees arrive. A beat on an ally whose Shield is at its cap is lost.

### Hunter's buckler
- **Is:** round shield · uncommon
- **Card:** When its holder lands a killing blow, its holder is Hasted.
- **Stats:** HP +1 · Attack +1 (2 of 2)
- **Numbers:** none of its own: Haste keeps `STATUS.haste`.
- **Code:** as today's Hunter's buckler, without its Shield.
- **Serves:** Hunt 1 ●●, Cuts ● ◆ kill-pays
- **Notes:** Kept from today's and moved down from rare: the Shield on a kill goes, as the line says. A kill by a status's damage isn't its holder's hit.

### Spiked targe
- **Is:** round shield · uncommon
- **Card:** While its holder is Guarded, it has Thorns, high, on top of its own.
- **Stats:** HP +1 · Aggro +1 (2 of 2)
- **Numbers:** `SPECIAL.thorns.high`, added while the Guard lasts and gone when it ends.
- **Code:** as today's Urchin shell, on Guard in place of a Shield.
- **Serves:** Toll 1 ●● ⚙ goad (half)
- **Notes:** High, where Spinebark pole gives medium for a whole fight: this one lasts only as long as a Guard and sits on its holder alone. Round 1 ruled that an effect may give the high word below legendary. It's a state held while its holder is Guarded, not a status laid at a moment, so nothing that shares what a unit gives itself shares it. Of its three holders only the Bramble knight Guards itself in its base kit; the other two need a Guard from the party. "Thorns, high" stays a word on the card, as on Urchin plate: the build prints the amount (round 3).

### Second skin
- **Is:** round shield · rare
- **Card:** When its holder's Shield breaks, half of the most it held is rebuilt at once, as a new Shield. This can happen every so often. The rebuilt Shield can break and be rebuilt in its turn.
- **Stats:** HP +2 · Attack +1 (3 of 3)
- **Numbers:** half of the most that Shield held: the pool's highest point since its holder last had no Shield. Every so often is `COOLDOWN.short`, counted from the last rebuild.
- **Code:** as today's Rubble plate's rebuild, at half, behind a wait.
- **Serves:** Landslide ●●, Cuts ●●, Toll ● ⚙ detonation (key), riposte (half)
- **Notes:** HP raises the Shield's cap, and Attack is for the shieldmaiden, whose hits build the Shield. The rebuilt Shield is a Shield like any other: it breaks as one, for whatever reads a break.

### Hoplon
- **Is:** round shield · rare
- **Card:** While its holder holds a Shield or an Aegis, each foe that hits it is sent back whatever the Shield soaked and the Aegis blocked of the blow.
- **Stats:** HP +2 · Aggro +1 (3 of 3)
- **Numbers:** all of what the Shield soaked and the Aegis blocked of that blow: both are counted after its holder's Defense and Guard, and both are numbers the game prints. It's sent back, so it isn't a hit.
- **Code:** 4.
- **Serves:** Toll 2 ●●●, Landslide 2 ●●● ⚙ mirror (key)
- **Notes:** Written to the line as round 1 changed it: Guard is out of the card. An Aegis sends back a boss's whole blow as it reached the wall, and a Shield sends back all it soaks. Its Defense step went with the Guard: Defense now shrinks what the cover has left to stop, so the steps are HP, which is the Shield's cap, and the draw.

### Tower shield
- **Is:** round shield · rare
- **Card:** While its holder stands, allies with less Defense than it take a fifth less damage. Its holder deals a fifth less.
- **Stats:** HP +2 · Defense +1 (3 of 3)
- **Numbers:** a fifth (20%) less damage of every kind for those allies; a fifth (20%) less on its holder's hits. Who has less Defense is read when the fight starts and when an ally is revived, as today.
- **Code:** as today's Phalanx shield, which this is under its new name.
- **Serves:** Barrage ●●, Bonfire ●●, Toll ●
- **Notes:** Kept from today's Phalanx shield and moved down from legendary: card and sizes stay, and the step that goes is its Attack. Renamed in round 1, since Phalanx is the Hoplite's passive.

### Shield of the chosen
- **Is:** round shield · legendary
- **Card:** Once a fight, when another ally falls, its holder raises it at once with a tenth of its max HP, behind a Shield of a third of its holder's max HP.
- **Stats:** HP +2 · Aggro +1 · Attack +1 (4 of 4)
- **Numbers:** `REVIVE.tenth` of the raised ally's max HP. The Shield is a third of its holder's max HP, under the raised ally's own cap.
- **Code:** as today's Shield of the chosen, with a Shield on the ally it raised.
- **Serves:** net
- **Notes:** Kept from today's, with the Shield the line adds. A third of a wall's HP fills a caster's Shield cap, which is what keeps the returned standing. As today, with an ally already down from an earlier fight, the raise can land on either.

### Lodestone shield
- **Is:** round shield · legendary
- **Card:** Every Shield another ally would gain goes to its holder instead. A Shield sent on this way isn't sent on again.
- **Stats:** HP +2 · Aggro +1 · Defense +1 (4 of 4)
- **Numbers:** all of each Shield, whoever gives it, its own giver included. Its holder's Shield keeps its own cap (`STATUS.shield`), and what would pass the cap is lost.
- **Code:** 22, and 23 for the redirect that's final.
- **Serves:** exotic, Landslide ●● ⚙ detonation (half)
- **Notes:** What it gives up is on the card: every other ally's own Shield, the Knight's Vanguard and the Geomancer's stone included. HP is the cap everything now pours into, and Aggro puts the blows where the cover is.

## Horn

### Ram's horn
- **Is:** horn · common
- **Card:** Nothing beyond its stats.
- **Stats:** Aggro +1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** the Toll: the draw is its first stat.
- **Notes:** Today's common, name and step kept.

### Ivory horn
- **Is:** horn · common
- **Card:** Nothing beyond its stats.
- **Stats:** MP regen +1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** Barrage: the well's mana.
- **Notes:** Today's common, name and step kept.

### Reveille
- **Is:** horn · uncommon
- **Card:** When each fight starts, the ally with the highest Attack has its ability with the longest cooldown ready at once: its slowest ability, by its whole cooldown.
- **Stats:** Aggro +1 · MP regen +1 (2 of 2)
- **Numbers:** "its ability with the longest cooldown" is its slowest ability, by its whole cooldown, cooling or not (`fill/shared.md`). Whatever wait that ability had left is gone; it still needs its MP and its condition. If it's already ready, nothing happens, whatever else is cooling.
- **Code:** a cooldown made ready is today's; picking the ability by its whole cooldown isn't (*Code support beyond the spine's list*).
- **Serves:** Landslide 1 ●●, Barrage 1 ●●, Hunt ●, first move ⚙ opening again (half)
- **Notes:** Only the name is today's. Cooldowns carry, so most fights start with the party's biggest ability far from ready: this is a whole action in the first ticks. The ally can be its own holder. The Bard's Reprise readies the ability with the most wait left, so the two now differ in what they ready as well as when; the pair is on the director's list.

### Bull's horn
- **Is:** horn · uncommon
- **Card:** The first time in a fight that a foe falls, every ally is Hasted.
- **Stats:** Aggro +1 · Attack +1 (2 of 2)
- **Numbers:** none of its own: Haste keeps `STATUS.haste`.
- **Code:** as today's Bull's horn.
- **Serves:** Hunt 1 ●●, Cuts ● ◆ kill-pays
- **Notes:** Kept from today's: the card stays. Its steps now start with the signature.

### Watch horn
- **Is:** horn · uncommon
- **Card:** Whenever an ally drops below half its max HP, its holder Taunts.
- **Stats:** Aggro +1 · HP +1 (2 of 2)
- **Numbers:** none of its own: Taunt keeps `STATUS.taunt`, and a second one refreshes it. The drop is a crossing, whatever caused it. An ally that starts a fight under half has dropped, so the horn sounds as the fight starts; it sounds again each time an ally is back at half or over and crosses again.
- **Code:** a crossing of half HP that a price makes too, and one counted as the fight starts (*Code support beyond the spine's list*).
- **Serves:** Toll 1 ●●, Pact ● ⚙ goad (half), mirror (half), two in the dark (half) ◆ draw
- **Notes:** "An ally" includes its holder, as ruled: a holder that drops below half Taunts too. A Taunt is a whole status with an icon, and the foes visibly turn. The Taunt is a status its holder gives itself.

### War horn
- **Is:** horn · rare
- **Card:** When each fight starts, the ally with the slowest basic attack gains many Might.
- **Stats:** Aggro +1 · Attack +1 · Defense +1 (3 of 3)
- **Numbers:** many as a fixed count (`FLAT_STACKS.many`), as today. Might keeps `STATUS.might`: the first blow lands about two fifths harder, and a slow hitter spends the stacks over a whole fight.
- **Code:** as today's War horn.
- **Serves:** Landslide 2 ●●● ⚙ judge's drum (half), opening again (half) ◆ heavy-blow
- **Notes:** Kept from today's: card and size. The count stays fixed, as ruled: the gift is usually to another unit, and the horn's two wearers hold the set's lowest and highest Attack. The ally can be its own holder.

### Hunting horn
- **Is:** horn · rare
- **Card:** When a Marked foe falls, every ally's next basic attack comes at once.
- **Stats:** Aggro +1 · Attack +1 · HP +1 (3 of 3)
- **Numbers:** nothing to size: a whole swing from each ally. The foe has to hold a Mark as it falls, whatever fells it.
- **Code:** as today's Pack leader's coat calls the swings, on a Mark that ends with its foe's fall (as today's Wick reads a fallen foe's Burn); 23 for a call that doesn't stack.
- **Serves:** Hunt 2 ●●●, Landslide ●●, Bonfire ● ⚙ judge's drum (key) ◆ kill-pays
- **Notes:** A Mark that moves at the fall is laid before the called swings pick, so they land on it together. The horn fires only while the Mark is still up, and `STATUS.marked` is short (*Links*).

### Horn of the charge
- **Is:** horn · legendary
- **Card:** When each fight starts, every ally is Hasted and its first action comes at once. Its holder starts every fight with every ability on cooldown.
- **Stats:** Aggro +2 · HP +1 · Defense +1 (4 of 4)
- **Numbers:** Haste keeps `STATUS.haste`. "At once" is each ally's basic attack ready at the first tick; an ability that's already ready still goes first. Its holder's abilities start on their full cooldowns.
- **Code:** as today's Horn of the charge; 8 for what happens again.
- **Serves:** Hunt 3 ●●●, Cuts ●●, first move ⚙ opening again (half)
- **Notes:** Kept from today's: card and steps. Happening again, the Haste and the swing come again and the drawback doesn't, by the spine's rule.

## Totem

### Blackthorn stake
- **Is:** totem · common
- **Card:** Nothing beyond its stats.
- **Stats:** Thorns medium (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** the Toll: Thorns is its first stat.
- **Notes:** A new name. The row gives this common Thorns and Defense; it takes the signature. Today's Standing stone (Defense +1) goes.

### Hawthorn fetish
- **Is:** totem · common
- **Card:** Nothing beyond its stats.
- **Stats:** Attack +1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** the Storm: Attack sets its Shock.
- **Notes:** Today's common, name and step kept.

### Spinebark pole
- **Is:** totem · uncommon
- **Card:** When each fight starts, the ally with the highest Aggro gains Thorns, medium, for the fight.
- **Stats:** Thorns medium · Defense +1 (2 of 2)
- **Numbers:** `SPECIAL.thorns.medium`, added to whatever Thorns that ally has, and kept through a fall. The highest Aggro is read as it stands, gear and seat counted and a Taunt not; a tie goes to the earlier seat.
- **Code:** as today's Spinebark pole.
- **Serves:** Toll 1 ●●, Landslide ● ⚙ goad (half), opening again (half)
- **Notes:** Kept from today's: card, size and steps. On an anchor with no Thorns of its own, every blow it takes now prints a number on the attacker. Happening again, it changes nothing unless the highest Aggro has moved. "Thorns, medium" stays a word on the card: the build prints the amount (round 3).

### Stormglass totem
- **Is:** totem · uncommon
- **Card:** When each fight starts, every foe gains a few Shock (from its holder's Attack).
- **Stats:** Thorns medium · Attack +1 (2 of 2)
- **Numbers:** a few (`STACKS.few`, through `own()`), times `SHOCK_STACKS` as the Stormcaller's own Shock is, read off its holder's Attack: about four on a Stormcaller. Shock keeps `STATUS.shock`.
- **Code:** as today's Pitch lantern, with Shock.
- **Serves:** Storm 1 ●● ⚙ opening again (half), every colour (half)
- **Notes:** Sized as one of the Stormcaller's own arcs on every foe, so each foe's first action prints a number. On a Bramble knight it's half that.

### Bear fetish
- **Is:** totem · uncommon
- **Card:** Whenever an ally drops below half its max HP, that ally is Guarded.
- **Stats:** Thorns medium · HP +1 (2 of 2)
- **Numbers:** none of its own: Guard keeps `STATUS.guard`, and a second one refreshes it. The drop is a crossing, whatever caused it. An ally that starts a fight under half has dropped, and is Guarded as the fight starts.
- **Code:** as today's Bear fetish without its once-a-fight marker, on the crossing Watch horn uses (*Code support beyond the spine's list*).
- **Serves:** Toll ●, Pact ●, net ⚙ brink (half), mirror (half) ◆ lowest-ally
- **Notes:** Changed from today's as the line says: every time, where today's was the first ally each fight. "An ally" includes its holder. A unit that rides the line is Guarded again each time it's back at half or over and crosses again, whether a blow, a status or a price took it across.

### Nettle totem
- **Is:** totem · rare
- **Card:** Foes that hit its holder gain a few Bleed (from its holder's Defense).
- **Stats:** Thorns medium · Defense +1 · Aggro +1 (3 of 3)
- **Numbers:** a few (`STACKS.few`, through `own()`), read off its holder's Defense: about two a blow on a Bramble knight. Bleed keeps `STATUS.bleed`.
- **Code:** as today's Nettle totem.
- **Serves:** Toll 2 ●●●, Cuts 2 ●●● ⚙ red rain (half)
- **Notes:** Kept from today's: card, size and steps; the card now names the stat. On a Bramble knight it adds to Briar's own, so an attacker leaves with twice the wound. Renamed from Briar totem in round 3: Briar is the Bramble knight's passive, which does nearly the same thing, and a Bramble knight holds this.

### Spite totem
- **Is:** totem · rare
- **Card:** Its holder gathers Spite (a Spite for each hit it takes, kept for the fight, up to 20). Each Spite adds 15 to its Thorns.
- **Stats:** Thorns medium · Aggro +2 (3 of 3)
- **Numbers:** 15 Thorns for each Spite (`COUNTER.spite.thorns`, today's step), so twenty Spite add as much as `SPECIAL.thorns.high`. Spite's own numbers are the bracket's (`fill/shared.md`).
- **Code:** as today's Thornheart plate adds Spite; the Thorns are the totem's own now, a stat read off its holder's Spite.
- **Serves:** Toll 2 ●●●
- **Notes:** A swarm fills the count in its first few swings and a boss barely moves it. Both Aggro steps are there because every blow it draws is a Spite. With another card on the same unit that reads Spite, one count serves both.

### Thunderhead totem
- **Is:** totem · rare
- **Card:** Each hit its holder takes adds a Shock to every foe.
- **Stats:** Thorns medium · Aggro +1 · HP +1 (3 of 3)
- **Numbers:** one stack (`FLAT_STACKS.one`) on every foe for each hit taken. Shock keeps `STATUS.shock`.
- **Code:** as today's Thunderhead totem.
- **Serves:** Storm 2 ●●●, Toll 2 ●● ⚙ goad (half), held charge (half)
- **Notes:** Kept from today's and moved down from legendary: the card and its size stay, and its Thorns go from high to medium. One stack a hit is a lot in a pack, where the hits come eight at a time, and close to nothing against a lone boss.

### Goading totem
- **Is:** totem · rare
- **Card:** Each time its holder Taunts, every foe's next basic attack comes at once.
- **Stats:** Thorns medium · Defense +1 · HP +1 (3 of 3)
- **Numbers:** nothing to size: a whole swing from every foe, each time its holder gains Taunt from anything. A Stunned foe swings when it wakes, and a foe in a wind-up when its cast is done.
- **Code:** 3; 23 for a call that doesn't stack.
- **Serves:** Storm 2 ●●●, Toll 2 ●●● ⚙ goad (key)
- **Notes:** Each called swing is an ordinary basic attack: it picks under the Taunt rule and pays whatever a swing costs that foe. The steps are body, since the whole field is about to land on its holder at once. I read a Taunt renewed "all fight" as a Taunt gained each time (*Loops*).

### Earthmother totem
- **Is:** totem · legendary
- **Card:** While its holder stands, every Shield an ally gains is a third larger. When an ally's Shield breaks, that ally gains many Might.
- **Stats:** Thorns high · HP +1 · Defense +1 (4 of 4)
- **Numbers:** a third (33%) larger, under each Shield's own cap. Many as a fixed count (`FLAT_STACKS.many`). Might keeps `STATUS.might`.
- **Code:** as today's Earthmother totem.
- **Serves:** Landslide 3 ●●●, Pact ● ⚙ detonation (half)
- **Notes:** Kept from today's but for the Might: a few became many, as the line says. A few Might was never seen to fire in play. The count is fixed, as ruled.

## Relic

### Shrine token
- **Is:** relic · common
- **Card:** Nothing beyond its stats.
- **Stats:** MP regen +1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** Blood Pact, the Toll's keepers and Barrage's font: MP regen is every healer's first stat.
- **Notes:** Today's common, name and step kept. It's the row's first common, so it takes the signature.

### Litany beads
- **Is:** relic · common
- **Card:** Nothing beyond its stats.
- **Stats:** Cast speed medium (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** Barrage: the font's casts land sooner.
- **Notes:** A new name. The row gives this common MP regen and Cast speed; MP regen is taken, so it carries Cast speed. Round 1's ruling on commons turned the pair round: the HP common I had is gone, and today's Blessed knot (Attack +1) goes too.

### Holy water
- **Is:** relic · uncommon
- **Card:** Each time one of its holder's abilities heals an ally, it also lifts one debuff from that ally.
- **Stats:** MP regen +1 · Attack +1 (2 of 2)
- **Numbers:** one debuff for each ally healed, picked as today. An ability that only lays Regen heals nobody at once, so it lifts nothing.
- **Code:** as today's Holy water.
- **Serves:** Toll ●, Pact ●, foes do less
- **Notes:** Kept from today's: card and steps, in the signature's order. It does nothing on a Paladin, one of its two holders: Absolve is its only heal, and it cleanses already.

### Charnel icon
- **Is:** relic · uncommon
- **Card:** Each time a foe falls, the ally with the lowest share of max HP is healed for three tenths of its holder's Attack.
- **Stats:** MP regen +1 · HP +1 (2 of 2)
- **Numbers:** three tenths on the card is `HIT.light` of its holder's Attack, a little under a Cure.
- **Code:** as today's Charnel icon, with the heal read off its holder's Attack.
- **Serves:** Pact 1 ●●, Hunt ● ⚙ brink (half) ◆ kill-pays, lowest-ally
- **Notes:** Kept from today's, resized: today's healed 6% of the healed ally's max HP, a number nobody saw. This is nearly a cast's worth for each kill. It's a heal its holder gives, for whatever reads one.

### Font relic
- **Is:** relic · uncommon
- **Card:** Each time one of its holder's abilities heals an ally, it also gives that ally MP: a fifth of that ally's max MP.
- **Stats:** MP regen +1 · Cast speed medium (2 of 2)
- **Numbers:** a fifth (20%) of the healed ally's max MP, for each ally an ability heals at once. A Regen's pulses give none.
- **Code:** none new: Holy water's trigger, with MP to the healed ally.
- **Serves:** Barrage 1 ●●, Pact ● ⚙ mana as armour (half) ◆ free-cast
- **Notes:** A fifth of a pool is about one cast for most classes, and it shows as a step on the blue bar. The card says "gives", the spine's word, so whatever answers MP given answers this. A holder that heals itself regains the MP too, though that isn't MP given (*Loops*).

### Phylactery
- **Is:** relic · rare
- **Card:** The part of its holder's heals, and of its Regen's pulses, that would go past full becomes a Shield on the healed ally.
- **Stats:** MP regen +1 · HP +1 · Attack +1 (3 of 3)
- **Numbers:** all of the part past full, from every heal its holder gives: HP its abilities and its pieces restore at once, its own Lifesteal, and each pulse of a Regen it laid. The Shield keeps its own cap.
- **Code:** as today's Phylactery; 14 for where healing past full goes when more than one thing claims it.
- **Serves:** Pact 2 ●●●, Landslide ●●, Toll ●● ⚙ red stone (key), detonation (half) ◆ shield-by-doing
- **Notes:** Kept from today's and moved down from legendary, with a step fewer of MP regen. The card names Regen, as round 2 rules: a Regen isn't a heal unless a card names it, and with nothing to mend a healer casts only Regen, so without the name the line's own sight never happened. It's what today's piece does. Seen: a Cleric's Renew on a full ally builds a grey bar pulse by pulse; so do a Paladin's Absolve on itself at full, a heal on a beat from a mace, and any heal on a unit capped at half.

### Accuser's relic
- **Is:** relic · rare
- **Card:** While no foe is Marked, each heal its holder gives Marks the foe that last hit the healed ally.
- **Stats:** MP regen +1 · Attack +1 · Defense +1 (3 of 3)
- **Numbers:** none of its own: Marked keeps `STATUS.marked`. "Each heal" is HP its holder's abilities or pieces restore at once; a Regen's pulses aren't heals. If no foe has hit that ally this fight, or the one that did has fallen, nothing is Marked.
- **Code:** 19, with its memory of who last hit each ally.
- **Serves:** Hunt 2 ●●●, Toll ●●
- **Notes:** It lays a Mark only while none is up, by the gate's ruling. An ability that heals two allies Marks for the first one.

### Heart of the saint
- **Is:** relic · legendary
- **Card:** Its holder's abilities that heal cost HP in place of MP: half the share of its max HP that they'd cost of its max MP. Their heals are twice as big. The price never takes it below 1 HP.
- **Stats:** MP regen +1 · HP +2 · Attack +1 (4 of 4)
- **Numbers:** the price is half the share of its max HP that the ability's MP cost was of its max MP, and no MP is paid. Heals are doubled. A status the ability lays keeps its own numbers.
- **Code:** 20.
- **Serves:** Pact 3 ●●● ⚙ brink (key)
- **Notes:** Its holder's heals are abilities that heal directly, as ruled: an ability that only lays Regen keeps its MP cost and its size, and heals from gear cost nothing and aren't doubled. HP is its fuel now, so two steps of it. Beside another effect that makes abilities cost HP (Flagellant's vestments on the same Cleric, The covenant), there's still one price, and the stricter floor holds: it won't cast a heal that would leave it below a tenth of its max HP (round 3). At half the share, as the director rules at gate 2, the price holds its healer less low than the brink's link pictures: a Cleric's Cure is about a tenth of its bar (*Least sure*).

### Bloodstone reliquary
- **Is:** relic · legendary
- **Card:** Each time an ally pays HP, the ally with the lowest share of max HP, the payer aside, is healed for as much.
- **Stats:** MP regen +2 · HP +2 (4 of 4)
- **Numbers:** as much as the price paid. "An ally" includes its holder. Where one unit pays for another's ability, the one whose HP goes is the payer. With nobody but the payer standing, nothing happens.
- **Code:** 20.
- **Serves:** Pact 3 ●●● ⚙ brink (half), blood mage (half)
- **Notes:** With the payer left out, the one who pays stays the lowest while the others are kept full. The heal is its holder's, for whatever reads one.

## Lantern

### Bullseye lantern
- **Is:** lantern · common
- **Card:** Nothing beyond its stats.
- **Stats:** Cast speed medium (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** Bonfire: the feeders' casts land sooner.
- **Notes:** A new name. The row gives this common Cast speed and Attack; it takes the signature. Today's Brass lantern (Attack +1) goes.

### Hooded lantern
- **Is:** lantern · common
- **Card:** Nothing beyond its stats.
- **Stats:** MP +1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** Barrage: MP is its first stat.
- **Notes:** Today's common, name and step kept.

### Pitch lantern
- **Is:** lantern · uncommon
- **Card:** When each fight starts, every foe gains several Burn (from its holder's Attack).
- **Stats:** Cast speed medium · Attack +1 (2 of 2)
- **Numbers:** several (`STACKS.several`, through `own()`), read off its holder's Attack: about six on a Pyromancer, close to one Fireball's. Burn keeps `STATUS.burn`.
- **Code:** as today's Pitch lantern.
- **Serves:** Bonfire 1 ●● ⚙ opening again (half), every colour (half), reaping (half)
- **Notes:** Kept from today's, with a few made several, as the line says. Unfed, that fire takes roughly a wolf's worth of HP off each foe before it dies down.

### Dazzling lantern
- **Is:** lantern · uncommon
- **Card:** When each fight starts, the two foes with the highest Attack are Weakened.
- **Stats:** Cast speed medium · HP +1 (2 of 2)
- **Numbers:** none of its own: Weaken keeps `STATUS.weaken`. Against one foe, that one.
- **Code:** as today's Dazzling lantern, picking two.
- **Serves:** foes do less, Toll ● ⚙ opening again (half), goad (half)
- **Notes:** Changed from today's as the line says: two foes, where today's Weakened one.

### Wick
- **Is:** lantern · rare
- **Card:** When a burning foe falls, all its Burn passes to the foe with the most Burn. A fallen foe's fire moves once: if something else in the party moves it too, it's split evenly between them.
- **Stats:** Cast speed medium · Attack +1 · MP +1 (3 of 3)
- **Numbers:** all the Burn the foe held as it fell. With no other foe burning, it goes to a foe picked by draw: it's fire a piece sends, not a blow, so a Mark doesn't take it, as round 2 rules.
- **Code:** 9 (today's Wick, aimed anew); 23 for the even split.
- **Serves:** Bonfire 2 ●●●, Hunt ●● ⚙ fuse (key)
- **Notes:** Kept from today's and moved down from legendary: the fire now goes to the hottest foe left, not the healthiest, and the Heat goes, as the line says. The feeders' own aim is at that same foe.

### Shuttered lantern
- **Is:** lantern · rare
- **Card:** While its holder is winding up an ability, it takes half damage.
- **Stats:** Cooldown medium · MP +1 · HP +1 (3 of 3)
- **Numbers:** half (50%) less damage of every kind, from the start of a wind-up to its end.
- **Code:** as today's Gatekeeper's kite reads a Taunt, reading a wind-up.
- **Serves:** Barrage 2 ●●, Bonfire ●●, Pact ●
- **Notes:** It carries no Cast speed. The kind's signature shortens the wind-ups this protects, and by round 1's ruling a signature that works against its piece gives way to the road's lean: Barrage's Cooldown and MP, which are more casts and more time under the shutter. It stays a lantern, as ruled: it covers a Pyromancer's long casts, and a Cleric's Renew and Raise.

### Everflame lantern
- **Is:** lantern · legendary
- **Card:** Every 3 ticks, the foe with the most Burn gains Burn: a tenth of what it holds.
- **Stats:** Cast speed high · Attack +2 (4 of 4)
- **Numbers:** a tenth (10%) of the stacks that foe holds, every 3 ticks: a beat of its own, stated on the card. With no foe burning, nothing.
- **Code:** as today's Bellows lantern sizes its Burn, on a beat of its holder's.
- **Serves:** Bonfire 3 ●●●
- **Notes:** "Every few ticks" is four by round 1's ruling, so the card gives its own beat in place of the line's words. At 3 ticks a fed fire stands about three fifths higher, and a fire nobody feeds for a Stun's length keeps two thirds of itself where it kept half. At four it would add a third; at Burn's own pulse it would more than double the fire. See *Loops*.

### Lamp of vigil
- **Is:** lantern · legendary
- **Card:** After each won fight, one fallen ally stands up with a quarter of its max HP, if its holder is standing.
- **Stats:** Cast speed high · HP +1 · MP +1 (4 of 4)
- **Numbers:** a quarter (25%) of the ally's max HP; one fallen ally, at random.
- **Code:** as today's Lamp of vigil.
- **Serves:** net
- **Notes:** Kept from today's: size and steps. The last clause is what today's piece already does, now on the card.

## Challenges

Round 1 ruled all fourteen of the first round's, and round 2 these four, which its rulings opened. All are applied above, so none is open; each stays here with its ruling.

1. *Ruled in round 2: the card names Regen.* **Phylactery has lost its plainest sight.** A Regen's pulses aren't a heal now, so the Regen its holder lays makes no Shield. The line's sight is a healer with nothing to mend building grey bars, and with nothing to mend a healer casts only Regen: Cure waits for a hurt ally and Absolve for one below full. On a Cleric the piece now turns only a heal's overshoot into stone. The ruling lets a card name Regen, and I'd have this one do it ("the part of its holder's heals, and of the Regen it lays, that would go past full"), which is what today's piece does. Written without it, by the ruling.
2. *Ruled in round 2: no. A crossing isn't a start-of-fight effect.* **A watcher that fires as the fight starts: is that a start-of-fight effect?** By the ruling, Watch horn and Bear fetish fire as a fight starts when an ally starts it under half. The spine defines a start-of-fight effect as whatever a piece does as a fight starts, however its card words it. I read these two as a crossing counted at the start, not an opening, so nothing makes them happen again. Read the other way, the horn Taunts again at every fall while any ally is under half.
3. *Ruled in round 2: it stands. It's the brink doing what it's for.* **A unit capped at half sets the watchers off once a fight.** Halved heart's wearer counts as below half at half, so it has dropped as each fight starts and never gets back to the line. Watch horn then Taunts as every fight starts, and Bear fetish Guards that unit once. On the brink's plainest unit, "whenever" comes to "once a fight". Written to the ruling.
4. *Ruled in round 2: it stands.* **Charnel icon and Bloodstone reliquary heal the lowest share, capped or not.** Round 1 made Shared cup pass over an ally that can't be healed. These two keep the line's phrase, so beside a unit capped at half their heal lands on it and counts as healing past full: a Shield where a red stone piece is worn, and nothing where none is. The brink's link reads that as intended. It's one phrase on each card if it isn't.

## Links

For each engine: the size on my side, and what the other side needs.

- **The shield detonation.** *Mine:* Second skin puts back half of the most that Shield held, every so often, and the rebuilt Shield breaks as a Shield does. The makers: Comrade's targe, a fifth of its holder's max HP on a beat; Phylactery, all of a heal past full; Earthmother totem, a third larger; Lodestone shield, the whole party's Shields on one unit under its one cap. Rubble shield Stuns the foe at each break. *The other side* (Rubble plate, Shatterstone charm): read the most that Shield held, as `fill/shared.md` now has it, and treat a rebuilt Shield as a new one, so its break is a second, smaller blow. A targe's Shield is 600 to 1,000, which is a blow worth seeing on every foe.
- **The mirror.** *Mine:* Mirror shield sends back half the blow as it was struck. Hoplon sends back all that a Shield soaked and an Aegis blocked of the blow, counted after its holder's Defense. Guard from Sheltering kite and Bear fetish makes the wall's own number smaller under Mirror shield, and feeds Hoplon nothing now. The draw is Watch horn's, and the big hits come by Oathbound shield. *The other side:* Thornheart plate should start at or under Mirror shield's half and pass it within a few Spite, so the far end is the keystone grown; a Knight can wear both, and they add. Hoplon needs a Shield or an Aegis that lands on its own holder: the Valkyrie's from her hits, a targe's beat, Watch the anchor, Aegis mail.
- **The goad.** *Mine:* Goading totem calls a whole swing from every foe each time its holder gains Taunt. What a called swing costs the foe: Spinebark pole's Thorns at medium, Spiked targe's at high under a Guard, Emberguard's few Burn, Thunderhead totem's Shock on the whole field. Dazzling lantern makes the two heaviest of those swings three tenths smaller for the fight's first stretch. On a Guarded Bramble knight a called wolf's bite costs the knight a small fraction of what it costs the wolf, before either of these pieces is added. *The other side:* Provoking blade's one foe a swing; a call that doesn't stack.
- **The held charge.** *Mine:* Rubble shield's Stun, a foe held for `STATUS.stun`; Thunderhead totem's Shock on every foe, the held one included. *The other side:* the readers, sized so a charge at its cap doubles their blow.
- **The reaping.** *Mine:* Pitch lantern's several Burn on every foe sinks a whole field by about a wolf's HP each. *The other side:* an execute sized to kill a foe sunk that far, in one.
- **The judge's drum.** *Mine:* Hunting horn calls every ally's swing when a foe falls Marked; War horn puts many Might on the slowest of them. *The other side:* a Mark that's still up when its foe falls. `STATUS.marked` runs out well before most Marked foes die, so the horn fires only where something keeps or renews the Mark, and a Mark that moves at the fall (Gravemark, Hunter's mark, Swift justice, Open season) is what lands the three swings on one foe.
- **The opening, again.** *Mine:* eight start-of-fight pieces. Happening again, once a fall: two Guards refreshed (Sheltering kite); the slowest ability ready (Reveille); many Might, to Might's cap (War horn); Haste and a swing for every ally, the drawback left out (Horn of the charge); Thorns on whoever now draws most (Spinebark pole); a few Shock on every foe (Stormglass totem); several Burn on every foe (Pitch lantern); Weaken on the two strongest (Dazzling lantern). *The other side:* Overture coat is Leather. The eight sit on the kite shield, the horn, the totem and the lantern, and of those kinds' wearers only the Stormcaller wears Leather. So Overture coat can reach two of the eight, the totem's, and the other six happen again only under Second dawn.
- **The fuse.** *Mine:* Wick moves all of a fallen foe's Burn to the foe with the most Burn. *The other side:* the kits' aim at that same foe; a second mover splits the fire evenly.
- **The red rain.** *Mine:* Nettle totem's few Bleed on each foe that strikes its holder, about two on a Bramble knight, beside Briar's own two. *The other side:* any wide hit. A foe that has struck the wall twice pays more to the wound than a light wide hit deals.
- **The riposte.** *Mine:* Second skin gives a dancer back half its broken cover, once every so often. *The other side:* the dodge's answering swings, which build the Shield in the first place.
- **Every colour.** *Mine:* Stormglass totem's Shock and Pitch lantern's Burn, a colour each on every foe as the fight starts. *The other side:* Malison has to land early. A few Shock is gone after three of a foe's actions, and unfed Burn within about twenty ticks.
- **The blood mage.** *Mine:* Bloodstone reliquary turns the whole price into a heal on the lowest ally who didn't pay. *The other side:* a price sized as a share of max HP, so the heal is a number worth seeing.
- **Mana as armour.** *Mine:* Font relic gives a fifth of the healed ally's pool with each heal. On a Pyromancer that's about one ordinary swing's worth of mana. *The other side:* MP that soaks damage point for point.
- **The shatter bell.** *Mine:* Monolith shield makes its holder's damaging abilities come half as often and land two and a half times as hard. *The other side:* the bell readies its wearer's slowest ability. On this holder that's the doubled one, since the doubled cooldown is the ability's whole cooldown.
- **The brink.** *Mine:* Heart of the saint makes the healer the one who pays. Comrade's targe's Shield, Bear fetish's Guard and Charnel icon's heal all go to whoever is lowest; Bloodstone reliquary keeps everyone but the payer full. *The other side:* the kits' gifts to the lowest ally. On a unit capped at half, the fetish's Guard comes once a fight and the icon's heal counts as healing past full, which round 2 lets stand.
- **Two in the dark.** *Mine:* Watch horn makes its holder the one in the light whenever an ally is hurt. *The other side:* two hidings.
- **The red stone.** *Mine:* Phylactery turns all of a heal past full into a Shield on the healed ally, the pulses of its holder's Regen included. *The other side:* the order for healing past full (the healed unit's own piece first), and a unit capped at half counting as full, which is now where a Cleric's Phylactery has most to turn into stone.

## Loops

- **Everflame lantern beside Bellows wraps.** The lantern adds a tenth of the hottest foe's Burn on its beat, and the wraps a twentieth on every hit, since round 2. Burn has no cap. With the lantern's beat at 3 ticks, it takes about a hit a tick on that foe to add more than Burn's own drain takes away. A Hasted Monk with Hummingbird charm and a second strike lands about seven in eight ticks, and about eight with Burning fist's hits: at the line, where the fire stops draining. With The forge's Heat or Tireless bell on that Monk it's over the line, and the fire grows by 1% to 3% a pulse with nobody feeding it. *Brake:* a lone boss taking every hit, 40 ticks for the Heat to fill, the Monk's mana for the fist's share, and the fight ending, which a fire that size brings. Left as the Bonfire's far end; the lantern is in the director's sample for it. At a beat of 2 ticks it would run away from a plain Monk.
- **Second dawn over the start-of-fight pieces.** Each fall brings Pitch lantern's fire back on every foe, which fells the next. Reveille readies the party's slowest ability at every fall, and Horn of the charge calls a volley and a Haste. A kill by any of these is a kill, as ruled, and each effect happens once a fall. *Brake:* the foes run out; Reveille's also stops at the mana.
- **Hunting horn with a Mark that moves at the fall.** A Marked foe falls, three swings land on the next Mark, it falls, and so on. *Brake:* a foe that survives the volley.
- **Goading totem.** The spine's loop (a dodge, a copied Taunt, every foe swings, a dodge) stands. A second one: Watch horn on a holder wearing Twin-knot, beside a Goading totem's holder who is the lowest ally. An ally drops below half, the horn Taunts, the Taunt is copied, every foe swings, and another ally drops below half. *Brake:* each ally sets it off once until it's back at half or over. A price is a crossing now, so a unit that pays its way under half and is healed back over, cast after cast, turns it once a cast: the brake there is that unit's cooldowns. Under Challenger's plate I read each renewal of the Taunt as a Taunt gained, so the field swings out of turn on a beat; that's a rhythm, not a loop.
- **Rubble shield with a Shield made by every swing** (Mason's hammer on a Knight or a Geomancer, Scabbed mail on a Paladin). Each small Shield breaks on the next blow and Stuns the foe that broke it, and a small Shield serves better than a big one. *Brake:* Stun doesn't land on a Stunned foe, it's one foe a break, and bosses resist. A lone elite can be held for most of a fight.
- **Font relic on a healer that heals itself.** The Paladin's Absolve gives back about what it cost each time it's cast. *Brake:* its cooldown.
- **Heart of the saint at 1 HP.** A price never takes its holder below 1 HP, so a healer at the floor heals for nothing, and its doubled heal lifts it straight back up when it's the lowest. A Paladin's Absolve heals the Paladin for four times its price. *Brake:* cooldowns alone, and the Cleric's own passive halves those when it's low.
- **Second skin.** A Shield breaks, half comes back, and that breaks. *Brake:* the wait, and each return is half the last; two thirds under Earthmother totem, which still shrinks.
- **Two Lodestone shields in one party.** Each takes the other's own Shields, and both claim a third ally's. *Brake:* a redirect is final. Which holder gets the third ally's Shield needs an order: seat order, as the engine breaks ties.
- **Wick.** The fuse is a kill chain by design. *Brake:* Burn's drain, and the foes run out.
- **Monolith shield under anything that readies an ability** (a kill, a shatter, a fight's start). The doubled wait is skipped every time. *Brake:* the trigger's own, and the mana.

## Code support beyond the spine's list

- **Monolith shield:** an ability change that lengthens the cooldown and multiplies the damage of the abilities that deal damage, and leaves the rest. A status's `mods` has neither field today.
- **Reveille:** a cooldown change aimed at a unit's slowest ability, by its whole cooldown. Today's effect picks by the wait left.
- **Watch horn, Bear fetish:** the crossing as round 1 rules it. Today's `hp_lost` doesn't fire on a price, and nothing today counts a unit that starts a fight under the line.
- **Hoplon,** inside 4: what a Shield soaked of one blow, blow by blow. Today the engine reports an Aegis's block, and a Shield's whole pool only as it ends.
- **Spite totem:** `fill/shared.md` has a Spite do nothing by itself, where today's Spite carries its Thorns. The totem needs a stat that reads its holder's Spite as it stands.
- **Horn of the charge,** inside 8: its gift and its drawback are one reaction today. They have to be told apart for the gift alone to happen again.
- **Accuser's relic,** inside 19: the memory of who last hit each ally has to forget a foe that has fallen.
- **Lodestone shield,** inside 22 and 23: an order for two holders in one party.
- Everything else is one of the spine's numbers or something a piece does today.

## Least sure

- **Hoplon.** With Guard out it needs a Shield or an Aegis on its own holder. Of its three wearers only the Valkyrie makes her own; the Hoplite's Aegis goes to the lowest ally, and the Bramble knight has neither.
- **Phylactery names Regen,** the one card that reads its holder's heals and counts the pulses. A Cleric's Renew on a full ally is now a Shield every four ticks for Regen's length.
- **Monolith shield.** With cooldowns carrying, a doubled medium cooldown may mean the blow doesn't come at all in many fights unless something readies it. The size is a guess at what makes the wait worth it.
- **Everflame lantern.** The beat decides whether it's a legendary or a rare, and beside Bellows wraps whether the fire runs away. I picked the middle, and it's on the card.
- **Heart of the saint.** On a Paladin it may never hold its wearer low, since Absolve heals the Paladin for more than it costs, so the brink it's the keystone of only forms on a Cleric.
- **Font relic.** A fifth of a pool for each heal is big, and it mostly lands on the wall, whoever the party's caster is. Smaller and it isn't seen.
- **Lodestone shield.** One cap for the whole party's stone wastes much of it, and it switches off what allies build on their own Shields. It may be a trap more often than an exotic.
- **Hunting horn.** It fires only on a foe that falls while still Marked, and the Mark is short. If the Mark stays short, the horn is rarer than its line reads.
- **Thunderhead totem and Spite totem.** Both are a swarm's pieces: strong in a pack and close to nothing against the bosses and elite pairs where the Toll died in play.
- **Rubble shield.** Kept as today's, and the small-Shield lock on a lone elite is the reason to look again.
- **Tower shield and Shuttered lantern.** Neither is seen to fire: each is damage that didn't happen. The lantern covers little on a Cleric, and it's the one piece of its kind without the signature stat.
- **The commons, after the ruling.** The round shield's two are HP and Defense, so the kind has no common for the Hunt or the Storm. The relic's second is Cast speed, which is also the signature of the Cleric's other offhand kind, and the keepers have no HP common.
