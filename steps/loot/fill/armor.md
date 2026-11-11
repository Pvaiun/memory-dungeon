# The fill: Armor

Plate, Mail, Leather and Robes: 55 pieces (12 commons, 16 uncommons, 17 rares, 10 legendaries), in the spine's order.

- **Budgets.** Every armor takes the standard ladder: one step for a common, two for an uncommon, three for a rare, four for a legendary. Armor has no signature stat, so a piece's steps are what its type leans to on the road it serves.
- **Amounts on cards.** A stack count keeps its word and says its stat. Where the scale has no word for an amount, the card gives the figure, as today's cards do.
- **Round 1's rulings are applied** (`fill/shared.md`, and *Armor* in `fill/round-1.md`): the counters' brackets, the names, "drops below" as a crossing, a kill by a repeat, the Robes' commons, three Heat a dodge.
- **"Drops below"** is a crossing, whatever took the unit there, a price included. A unit that starts a fight under the line has dropped, and the piece fires as the fight starts.
- **"A killing blow"** is a hit of its wearer's that knocks a foe out, one landed by an effect that's happening again included. A status, Thorns and damage sent back aren't blows.

## Plate

*Wears:* Knight, Bramble knight, Hoplite, Paladin, Geomancer.

### Ironclad
- **Is:** plate · common
- **Card:** Nothing beyond its stats.
- **Stats:** Defense +1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** Landslide (Defense is its stone and its damage stat); the keepers and rods of Bonfire and the Storm.
- **Notes:** Today's name and step.

### Crested plate
- **Is:** plate · common
- **Card:** Nothing beyond its stats.
- **Stats:** HP +1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** Landslide (max HP is the Knight's bash and the size of its Shield).
- **Notes:** Today's name and step. The row gives it HP and Aggro; it takes HP, so the three commons are three stats. Aggro sits on the kind's uncommons and rares, and on the spear, horn and kite shield commons.

### Bristled plate
- **Is:** plate · common
- **Card:** Nothing beyond its stats.
- **Stats:** Thorns medium (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** the Toll.
- **Notes:** Today's name and step.

### Portcullis
- **Is:** plate · uncommon
- **Card:** While its wearer is above half its HP, it draws far more (Aggro +25).
- **Stats:** Thorns medium · HP +1 (2 of 2)
- **Numbers:** "draws far more" is the seat word's number: two seat steps of Aggro, +25, which doubles its draw (`formations.ts`, `RULES.partyDraw`).
- **Code:** as today's Portcullis.
- **Serves:** Toll 1 ●●, Bonfire ●, Storm ● ⚙ frozen gate (half), mirror (half), reckoning (half) ◆ draw
- **Notes:** Today's piece, card kept. The size moves from today's +20 to the seat's +25, so "far more" means one thing on a seat and on a card. HP takes the place of today's Defense step: it's the stat the card reads, and a bigger bar stays above half for longer. It lets go of the draw when its wearer is hurt, which is its difference from a Taunt. By the lead's ruling it's a state, not a status given, so nothing copies it.

### Keystone cuirass
- **Is:** plate · uncommon
- **Card:** While its wearer holds a Shield, its hits deal a third more.
- **Stats:** Defense +1 · HP +1 (2 of 2)
- **Numbers:** a third more on every hit, swing or ability: a narrow boost on a condition (`loot.md`, *Sizes*).
- **Code:** none: a boost that reads a status its wearer holds, as today's Shadow mantle reads Hidden.
- **Serves:** Landslide 1 ●●
- **Notes:** Keeps today's name only; today's card raised basic attacks by Defense. The steps are the two stats that keep the grey bar standing: Defense takes less out of it each blow, HP raises its cap. The Knight and the Geomancer bring their own Shield. The Hoplite, the Paladin and the Bramble knight need one from another slot or an ally.

### Holdfast
- **Is:** plate · uncommon
- **Card:** The first time each fight its wearer drops below half its HP, it's Guarded.
- **Stats:** Defense +2 (2 of 2)
- **Numbers:** Guard at its own size and length (`STATUS.guard`).
- **Code:** as today's Holdfast.
- **Serves:** Toll ●, Landslide ●, net ⚙ mirror (half)
- **Notes:** Today's piece, card and size kept; the Guard icon is what's seen. A price that takes it under half sets it off, and a wearer that starts a fight under half is Guarded as it starts. Steps: Defense twice, where today's has HP and Defense, so the plate net is stone and the mail one (Warded mail) is body. On a Bramble knight beside Bear fetish it adds nothing: the fetish Guards it at the same crossing.

### Urchin plate
- **Is:** plate · uncommon
- **Card:** While its wearer holds a Shield, it has Thorns, high, on top of its own.
- **Stats:** Aggro +1 · Defense +1 (2 of 2)
- **Numbers:** Thorns at the high word's value (`SPECIAL.thorns.high`) for as long as its Shield pool is above zero.
- **Code:** none: a state switched on when its wearer gains a Shield and off when the Shield ends.
- **Serves:** Toll 1 ●●, Landslide ● ⚙ goad (half)
- **Notes:** The effect of today's Urchin shell (an amulet, at the medium word). Raised to the high word, as an effect's size and not a stat step, which the lead's ruling allows: Bristled plate carries the medium word all fight for one step, so a medium that comes and goes wouldn't be seen as a card. It's worded as Spiked targe is, and a Hoplite or a Bramble knight can wear both. The draw brings the blows onto the stone, and Defense keeps the stone up. It's Portcullis turned round: this draws always and has thorns behind stone; Portcullis has thorns always and draws while healthy.

### Challenger's plate
- **Is:** plate · rare
- **Card:** Its wearer Taunts all fight: its Taunt is laid again each time it ends.
- **Stats:** Defense +1 · HP +1 · Thorns medium (3 of 3)
- **Numbers:** Taunt at its own length (`STATUS.taunt`), laid as the fight starts, each time it runs out or is stripped, and when its wearer is revived.
- **Code:** as today's seats that Taunt all fight (the Beacon and the Peak: `TAUNTS_ALL_FIGHT` in `formations.ts`).
- **Serves:** Toll 2 ●●●, Bonfire ●●, Storm ●● ⚙ mirror (half), goad (half), frozen gate (half), reckoning (half), two in the dark (half) ◆ draw
- **Notes:** Today's piece, changed as its line says (today's Taunts at the start and when an ally falls). Each renewal is a Taunt laid, so whatever waits on its wearer Taunting sees one a Taunt's length: Goading totem calls the foes' swings, and Twin-knot or Twins copies it. Its wearer can never be Hidden. No Aggro in its steps: a Taunt already takes every aimed pick, so the steps are the body that takes them.

### Hoarfrost plate
- **Is:** plate · rare
- **Card:** Foes that hit its wearer gain a few Chill (from its wearer's Defense).
- **Stats:** Defense +2 · Aggro +1 (3 of 3)
- **Numbers:** a few, from Defense: `STACKS.few` through `own()`. A Knight in this piece lays about four a blow, five while Guarded.
- **Code:** as today's Hoarfrost plate, with the stacks read from the wearer's Defense.
- **Serves:** Toll 2 ●●●, Snap 2 ●●● ⚙ frozen gate (key)
- **Notes:** Today's piece, card kept. The size changes because today's flat 2 a blow never reached Chill's cap on the wall inside a fight (`STATUS.chill`: twelve stacks, one thawing every 14 ticks). At about four, a foe that keeps striking the wall bursts on its third or fourth blow. It reads Defense as Emberguard and Briar totem do in their share. Both steps of Defense feed the frost, and the Aggro brings the blows. Portcullis and Challenger's plate are the same slot, so its draw comes from a kit, a horn, the token or a seat.

### Rubble plate
- **Is:** plate · rare
- **Card:** When its wearer's Shield breaks, the most that Shield held is sent back to every foe.
- **Stats:** Defense +1 · HP +1 · Aggro +1 (3 of 3)
- **Numbers:** one for one: the pool's highest point since its wearer last had no Shield, to each foe. Never more than half its wearer's max HP, the Shield's own cap (`STATUS.shield`).
- **Code:** as today's Rubble plate, without the rebuild.
- **Serves:** Landslide 2 ●●●, Toll ●● ⚙ detonation (key)
- **Notes:** Today's legendary as a rare, changed as its line says: the rebuilt quarter goes (the return is Second skin's and Rampart's). "Breaks" is emptied by damage of any kind, a status's included; a Dispel isn't a break. A Knight's opening Shield alone sends back about one of its own swings to every foe, so the first break reads as a blow. Sent back isn't a hit, so a foe it fells isn't felled by a killing blow. The Aggro step gets the Shield broken.

### Thornheart plate
- **Is:** plate · legendary
- **Card:** Its wearer gathers Spite (a Spite for each hit it takes, kept for the fight, up to 20). A third of each blow, as it was struck, is sent back to the foe that struck it, and a twentieth more of the blow for each Spite.
- **Stats:** Thorns high · Aggro +1 · Defense +1 (4 of 4)
- **Numbers:** a third of the blow, and a twentieth more a Spite. The Spite a blow adds counts for that blow. Spite climbs to 20 (`fill/shared.md`): the fourth blow sends back over half, the fourteenth the whole blow, the twentieth a third more than the blow.
- **Code:** 4; Spite as `fill/shared.md` defines it (today's Spite carries Thorns a stack: that's Spite totem's card now).
- **Serves:** Toll 3 ●●●, Landslide ●● ⚙ mirror (key)
- **Notes:** Keeps today's name; today's card grew Thorns. The bracket is the counter's own wording. Sized against Mirror shield as its share wrote it (half the blow): this starts under it and passes it at the fourth blow, so the far end is the keystone grown. A dodged hit sends nothing. A blow an Aegis blocks sends its share all the same. On one unit with Mirror shield or Hoplon the returns add, and more than the blow comes back.

### Last bastion
- **Is:** plate · legendary
- **Card:** Once a fight, a blow that would knock its wearer out leaves it at 1 HP and Guarded. From then until it's next healed, by anyone or anything, its hits deal double.
- **Stats:** Defense +2 · HP +2 (4 of 4)
- **Numbers:** Guard at its own size and length; double is on every hit.
- **Code:** as today's Last bastion, with the doubling lifted by any heal and no heal after the fight.
- **Serves:** net, Pact ●● ⚙ brink (half)
- **Notes:** Today's piece, changed as its line says: the doubling ends at the next heal of any size (today's: when healed back above half), and the fifth of its HP after a won fight goes. "By anyone or anything" is added so the card says that its own Lifesteal or a Regen pulse ends it. A Shield isn't healing, so cover keeps it doubled. After the save everything rests on its cover: Defense makes each point of Shield last, and HP sets the Shield's cap.

### The anvil
- **Is:** plate · legendary
- **Card:** Each hit its wearer takes gives a Wrath to the other ally with the slowest basic attack (its next basic attack deals a fifth more for each Wrath, up to 10, and spends them).
- **Stats:** Aggro +2 · Defense +1 · HP +1 (4 of 4)
- **Numbers:** one Wrath a hit taken. Wrath is `fill/shared.md`'s: a fifth more a stack on its holder's next basic attack, all spent, to ten.
- **Code:** 15.
- **Serves:** Toll 3 ●●●, Landslide ●●● ⚙ reckoning (key)
- **Notes:** New. The bracket is the counter's own wording, and it sits after the ally so that "its" is the ally's swing. "The slowest basic attack" is read at each hit and it's the longest interval, whatever that unit does: beside a Cleric and a Ranger the Wrath goes to the Cleric's mace. One hit adds one Wrath to a holder, however many cards count it, so this in Hammer and anvil's Anvil seat doesn't double.

## Mail

*Wears:* Bramble knight, Paladin, Valkyrie, Hexer, Vampire, Frostweaver.

### Inscribed hauberk
- **Is:** mail · common
- **Card:** Nothing beyond its stats.
- **Stats:** Attack +1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** Thousand Cuts; Bonfire, Cold Snap and the Storm.
- **Notes:** Today's name and step.

### Lamprey mail
- **Is:** mail · common
- **Card:** Nothing beyond its stats.
- **Stats:** Lifesteal medium (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** Blood Pact (its sign, for six classes); Thousand Cuts.
- **Notes:** Today's name on a new step, by the lead's ruling: today's Lamprey mail carries HP, and the name reads as a drinker's.

### Thick byrnie
- **Is:** mail · common
- **Card:** Nothing beyond its stats.
- **Stats:** HP +1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** Blood Pact; the Toll.
- **Notes:** Today's name on a new step, by the lead's ruling: today's Thick byrnie carries Defense, which isn't in Mail's lean. The three rows name HP, Lifesteal and HP first, so the first row takes its second stat (Attack, on Inscribed hauberk) and this one keeps HP.

### Scabbed mail
- **Is:** mail · uncommon
- **Card:** Each hit its wearer lands gives it a Shield of 3% of its max HP.
- **Stats:** HP +1 · Lifesteal medium (2 of 2)
- **Numbers:** 3% of max HP a hit, a value of its own: the scale has no word this small.
- **Code:** none: the Valkyrie's Shieldmaiden, read from max HP.
- **Serves:** Cuts 1 ●●, Landslide ● ⚙ detonation (half), riposte (half), brink (half) ◆ shield-by-doing
- **Notes:** New; it takes the place of today's Tithing hauberk, whose heal moves to Leather. 3% is a sliver of grey on the first hit, and it grows because nothing drains a Shield. Every hit counts, so a wide spell or a triple strike lays several at once. The steps make it the unit that covers itself and drinks by the same hits.

### Reprisal hauberk
- **Is:** mail · uncommon
- **Card:** The first time each foe hits its wearer in a fight, damage equal to 17% of its wearer's max HP is sent back to that foe.
- **Stats:** HP +1 · Thorns medium (2 of 2)
- **Numbers:** a touch, from max HP (`HIT.touch`), once a foe.
- **Code:** as today's Reprisal hauberk.
- **Serves:** Toll 1 ●●, Storm ●
- **Notes:** Today's piece, card and size kept: on a wall it's about one of its own swings, on each foe once. Thorns takes the place of today's Lifesteal step, so the blows after the first still pay.

### Bloodsworn mail
- **Is:** mail · uncommon
- **Card:** While its wearer is below half its HP, it has Lifesteal, high, on top of its own.
- **Stats:** HP +1 · Attack +1 (2 of 2)
- **Numbers:** Lifesteal at the high word's value (`SPECIAL.lifesteal.high`) while below half.
- **Code:** as today's Bloodsworn mail, with Lifesteal alone.
- **Serves:** Pact 1 ●●, Cuts ● ⚙ brink (half), blood mage (half)
- **Notes:** Today's rare as an uncommon, changed as its line says: the quarter more damage goes. Its Lifesteal rises from today's medium to the high word, as an effect's size, which the lead's ruling allows: Lamprey mail carries the medium word all fight for one step. No Lifesteal in its steps, so above half it doesn't drink and the switch is what's seen. On a Vampire it adds before Bloodlust doubles.

### Warded mail
- **Is:** mail · uncommon
- **Card:** The first time each fight its wearer drops below half its HP, it gains a Shield of a quarter of its max HP.
- **Stats:** HP +2 (2 of 2)
- **Numbers:** a quarter of max HP, a value of its own: half the Shield's cap.
- **Code:** as today's Holdfast, giving a Shield.
- **Serves:** Pact 1 ●, Toll ●, net ⚙ brink (half)
- **Notes:** New: Holdfast's shape with a Shield. A quarter of the bar in grey is seen at a glance. Both steps feed it. A price that takes its wearer under half sets it off, and a wearer that starts a fight under half gains the Shield as it starts.

### Static mail
- **Is:** mail · rare
- **Card:** Foes that hit its wearer gain a few Shock (from its wearer's Defense).
- **Stats:** HP +1 · Defense +1 · Aggro +1 (3 of 3)
- **Numbers:** a few, from Defense: `STACKS.few` through `own()`. Two to three and a half a blow on Mail's wearers in this piece, five while Guarded.
- **Code:** as today's Static mail, with the stacks read from the wearer's Defense.
- **Serves:** Toll 2 ●●●, Storm 2 ●●● ⚙ goad (half)
- **Notes:** Today's piece, card kept. The stacks are read from a stat in place of today's flat 2, and from Defense so the four pieces of this sentence agree (Emberguard, Briar totem, Hoarfrost plate). A foe that keeps striking it holds twice a blow's stacks when it next acts, so each of its swings costs it more than high Thorns would. Mail's wearers have less Defense than Plate's, so one step is Defense.

### Red stone mail
- **Is:** mail · rare
- **Card:** Healing its wearer receives past full becomes a Shield on it, a Regen's pulses included.
- **Stats:** HP +1 · Attack +1 · Lifesteal medium (3 of 3)
- **Numbers:** one for one, up to the Shield's own cap.
- **Code:** as today's Phylactery, read on the unit that's healed. The order among the three places that take healing past full is in *Code support beyond the spine's list*.
- **Serves:** Pact 2 ●●●, Cuts 2 ●●, Landslide ●● ⚙ red stone (key), detonation (half) ◆ shield-by-doing
- **Notes:** New. All healing it receives counts: a heal, Lifesteal, a Refrain, and a Regen's pulses, which the card names because the lead's ruling leaves Regen out of "a heal" unless a card does. builds.md's red stone counts on it: a Cleric with nothing to mend lays Regen on a full ally. Its own Lifesteal step lets it work alone on anything that hits. It takes the healing past full before Phylactery or Shared cup sees any. Under Halved heart everything past half is past full, so it all turns to Shield.

### Sanguine mail
- **Is:** mail · rare
- **Card:** While its wearer is below half its HP, healing it receives is doubled. At half or more, it's halved.
- **Stats:** HP +2 · Lifesteal medium (3 of 3)
- **Numbers:** doubled and halved, on all healing it receives: heals, its own Lifesteal, and a Regen's pulses (it changes what its wearer receives; it doesn't read a heal).
- **Code:** as today's Sanguine mail.
- **Serves:** Pact 2 ●●●, Toll ● ⚙ brink (half)
- **Notes:** Today's legendary as a rare; card and sizes kept, one step fewer. "At half or more" takes the place of the line's "above half", so the card covers a unit standing at exactly half. A Halved heart wearer counts as below half by that card's own words, so its healing is always doubled.

### Hexweave mail
- **Is:** mail · rare
- **Card:** Its wearer's hits deal 10% more for each different debuff their target holds.
- **Stats:** Attack +2 · HP +1 (3 of 3)
- **Numbers:** 10% a debuff, each counted once whatever its stacks: half again on a foe that holds all five afflictions, and Marked, Weaken, Stun and the rest count beside them.
- **Code:** 2 (as today's Hexweave mail).
- **Serves:** Bonfire ●●, Snap ●●, Storm ●●, Cuts ●●, Toll ●● ⚙ every colour (half)
- **Notes:** Today's legendary as a rare; the size is kept. "Different" changes nothing in how it counts.

### Aegis mail
- **Is:** mail · legendary
- **Card:** Whenever an ally drops below a third of its HP, that ally gains Aegis.
- **Stats:** HP +2 · Defense +1 · Lifesteal medium (4 of 4)
- **Numbers:** Aegis as it stands (`STATUS.aegis`). The line is a third of max HP.
- **Code:** a watch on each ally's HP that sees a crossing whatever made it, a price and the fight's start included, with a marker on each ally that keeps it to once a crossing (*Code support beyond the spine's list*).
- **Serves:** Pact 3 ●●●, Toll ●●, net ⚙ brink (half), mirror (half)
- **Notes:** New. "An ally" includes its wearer. A crossing by any means: a blow, a status, a price. An ally that starts a fight under a third gains it as the fight starts. "Whenever": again each time the ally is back at a third or over and crosses again. An ally that already holds an Aegis gains nothing. The Lifesteal step is its wearer's own way back over the line, which is also what arms it again.

### Tallymail
- **Is:** mail · legendary
- **Card:** Its wearer counts Cuts (a Cut for each hit it lands, kept for the fight, up to 25), and has Lifesteal +2% for each Cut.
- **Stats:** HP +1 · Attack +2 · Lifesteal medium (4 of 4)
- **Numbers:** one Cut a hit; 2% Lifesteal a Cut, so half again of each hit's damage at Cuts' 25.
- **Code:** Cuts as `fill/shared.md` defines it, and a stat read from its stacks. Today's Cuts carries 2% damage inside the counter: that's Thousandth cut's card now.
- **Serves:** Cuts 3 ●●●, Pact ●●
- **Notes:** New. 2% matches Thousandth cut's size. At 1% a regular fight ends at eight or ten Cuts, before the drink is worth a legendary. Under The whetstone it reads the party's count. The bracket is the counter's own wording.

## Leather

*Wears:* Ranger, Valkyrie, Bard, Monk, Assassin, Stormcaller.

### Tumbler's vest
- **Is:** leather · common
- **Card:** Nothing beyond its stats.
- **Stats:** Evasion medium (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** Thousand Cuts; the Storm; the Toll's dancer.
- **Notes:** Today's name and step.

### Footpad's jerkin
- **Is:** leather · common
- **Card:** Nothing beyond its stats.
- **Stats:** Crit chance +1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** the Hunt.
- **Notes:** Today's name and step.

### Spotter's coat
- **Is:** leather · common
- **Card:** Nothing beyond its stats.
- **Stats:** Accuracy medium (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** the Hunt.
- **Notes:** Today's name and step.

### Tithing leathers
- **Is:** leather · uncommon
- **Card:** Each hit its wearer lands heals it for 3% of its max HP.
- **Stats:** Evasion medium · HP +1 (2 of 2)
- **Numbers:** 3% of max HP a hit, a value of its own.
- **Code:** as today's Tithing hauberk.
- **Serves:** Cuts 1 ●●, Pact 1 ● ⚙ riposte (half), blood mage (half)
- **Notes:** Today's Tithing hauberk, moved to Leather and renamed by its line. Its red stone tag is gone, by the lead's ruling: nothing reads its heal as a Shield. The size is doubled: at 1.5% it printed numbers under 50 beside hits in the hundreds. A set heal a hit pays most on many small hits, where Lifesteal pays most on a few big ones. HP is outside Leather's lean; it's the stat the card reads.

### Tracker's coat
- **Is:** leather · uncommon
- **Card:** Its wearer's abilities have Seek.
- **Stats:** Crit chance +1 · Accuracy medium (2 of 2)
- **Numbers:** none.
- **Code:** as today's Tracker's coat.
- **Serves:** Hunt 1 ●●
- **Notes:** Today's rare as an uncommon; card kept. It does nothing for a unit whose abilities don't aim at foes (the Bard).

### Mottled hide
- **Is:** leather · uncommon
- **Card:** While its wearer is below half its HP, it draws far less (Aggro −25).
- **Stats:** Evasion medium · Crit chance +1 (2 of 2)
- **Numbers:** "draws far less" is the seat word's number: two seat steps down, −25, which halves its draw.
- **Code:** as today's Mottled hide.
- **Serves:** net, Pact ●
- **Notes:** Today's piece, card kept; the size moves from today's −20 to the seat word's.

### Quickstep leathers
- **Is:** leather · uncommon
- **Card:** Each time its wearer dodges a hit, it's Hasted.
- **Stats:** Evasion medium · Attack +1 (2 of 2)
- **Numbers:** Haste at its own size and length (`STATUS.haste`), refreshed by each dodge.
- **Code:** none: a reaction to a dodge, as today's Duelist's leathers has one.
- **Serves:** Cuts 1 ●●, Toll ● ⚙ riposte (half)
- **Notes:** New. It sits beside Windrunner's garb in the same kind (*Least sure*).

### Duelist's leathers
- **Is:** leather · rare
- **Card:** Each time its wearer dodges a hit, it strikes the attacker with its weapon.
- **Stats:** Evasion medium · Aggro +1 · Attack +1 (3 of 3)
- **Numbers:** a hit of its basic attack's size, in whatever shape its basic attacks have.
- **Code:** as today's Duelist's leathers; 12, for what the strike carries.
- **Serves:** Toll 2 ●●●, Cuts 2 ●● ⚙ riposte (key)
- **Notes:** Today's piece, card kept. In play it was worn by units that drew nothing, so its steps carry a draw of its own. The strike is aimed at a named foe, so a Taunt doesn't turn it. It isn't a basic attack, so Provoking blade on the same unit isn't set off by it.

### Shadow mantle
- **Is:** leather · rare
- **Card:** While its wearer is Hidden, its hits deal double.
- **Stats:** Crit chance +2 · Attack +1 (3 of 3)
- **Numbers:** double, on every hit, for as long as Hidden lasts (`STATUS.hidden`).
- **Code:** as today's Shadow mantle, the boost alone.
- **Serves:** Hunt 2 ●●● ⚙ two in the dark (half)
- **Notes:** Today's piece, changed as its line says: it no longer hides its wearer at the start, and the boost is double where today's is half again. Something else has to hide it.

### Pack leader's coat
- **Is:** leather · rare
- **Card:** When its wearer lands a killing blow, every ally's next basic attack comes at once.
- **Stats:** Attack +1 · Crit chance +1 · Accuracy medium (3 of 3)
- **Numbers:** none: "at once" on a slow weapon is a whole swing.
- **Code:** as today's Pack leader's coat; 23, for the call that doesn't stack.
- **Serves:** Hunt 2 ●●●, Landslide ●●, Bonfire ●● ⚙ judge's drum (key) ◆ kill-pays
- **Notes:** Today's legendary as a rare; card kept. "Every ally" includes its wearer. A second kill before a called swing lands calls nothing more.

### Frostwalker's furs
- **Is:** leather · rare
- **Card:** When a foe's Chill shatters, its wearer is Hasted, and its next hit adds a few Chill (from its wearer's Attack) to every foe.
- **Stats:** Evasion medium · Attack +1 · Attack speed medium (3 of 3)
- **Numbers:** Haste as it stands; a few, from Attack (`STACKS.few` through `own()`): about three a foe.
- **Code:** as today's Frostwalker's furs, with the stacks read from Attack; 23.
- **Serves:** Snap 2 ●●●, Cuts ● ⚙ firecracker (key), frozen gate (half)
- **Notes:** Today's legendary as a rare, changed as its line says: a few Chill where today's adds one. Several shatters before its next hit make one throw. The throw isn't a hit, so it doesn't call itself. Cold it lays on a foe that has already burst in the chain is damped by Chill's own rule, which isn't on the card.

### Overture coat
- **Is:** leather · rare
- **Card:** Each time its wearer lands a killing blow, the start-of-fight effects of its gear and its seat happen again. Each happens once a kill, whatever else calls for it.
- **Stats:** Attack +2 · Crit chance +1 (3 of 3)
- **Numbers:** none of its own: each effect does again what it did, at its own size, prices and drawbacks left out.
- **Code:** 8; 23.
- **Serves:** Hunt 2 ●●● ⚙ opening again (key) ◆ kill-pays
- **Notes:** New. The second sentence is Second dawn's "once a fall" for this card: beside Second dawn, one kill fires its wearer's opening once. A kill landed by the opening as it happens again is a kill, and calls it again (the lead's ruling), so an opening that strikes runs on until a round fells nobody. Its seat is its own seat: a formation's rule for the whole party doesn't happen again.

### Windrunner's garb
- **Is:** leather · legendary
- **Card:** Each time its wearer dodges a hit, it gains 3 Heat (it acts 5% faster in everything for each Heat, up to 10, for the rest of the fight). Each hit it takes spends half its Heat.
- **Stats:** Evasion high · Attack +1 · Aggro +1 (4 of 4)
- **Numbers:** 3 Heat a dodge; half of all the Heat it holds, rounded down, spent a hit taken. Heat is `fill/shared.md`'s, to ten.
- **Code:** as today's Windrunner's garb with Heat in Tempo's place. The spending moves from the counter to this card.
- **Serves:** Cuts 3 ●●, Toll 3 ●● ⚙ riposte (half)
- **Notes:** Today's piece. Three a dodge, by the lead's ruling, as Hunter's skull gives three a kill: its third dodge passes Quickstep leathers' Haste, and a dodger hit one time in three holds six to ten Heat. The bracket is the counter's own wording; the sentence after it is the one card that spends Heat. The hit spends half of all its Heat, whichever card gave it. The Aggro step is the dancer's: it grows by being aimed at.

### Carrier's coat
- **Is:** leather · legendary
- **Card:** Each hit its wearer lands gives its target one stack of every affliction its wearer holds: Burn, Chill, Shock, Bleed and Sunder. The wearer keeps its own.
- **Stats:** Attack speed high · HP +2 (4 of 4)
- **Numbers:** one stack of each affliction held, a hit.
- **Code:** 9.
- **Serves:** exotic ⚙ carrier (key)
- **Notes:** New. No Evasion: a dodged hit afflicts nobody, and this is the one Leather piece that wants its wearer bitten. HP is what carries the afflictions it keeps, and speed is how often it passes them on.

## Robes

*Wears:* Cleric, Bard, Pyromancer, Frostweaver, Stormcaller.

### Wayfarer's habit
- **Is:** robes · common
- **Card:** Nothing beyond its stats.
- **Stats:** MP +1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** Barrage (the pool its soloist spends, and the one mana as armour reads).
- **Notes:** Today's name and step. It takes the place of the Attack common, by the lead's ruling: MP is the first stat its row names. Today's Magister's robe (Attack) goes.

### Rainwater robe
- **Is:** robes · common
- **Card:** Nothing beyond its stats.
- **Stats:** MP regen +1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** Barrage (mana inside a fight).
- **Notes:** A new name: today's Robes have no MP regen common.

### Hermit's cowl
- **Is:** robes · common
- **Card:** Nothing beyond its stats.
- **Stats:** Aggro −1 (1 of 1)
- **Numbers:** none.
- **Code:** none.
- **Serves:** every caster; Barrage's soloist, who draws little.
- **Notes:** Today's name and step. Its row names MP first, which Wayfarer's habit already carries, so it takes Aggro down. Attack is on no Robes common now; the status roads find it on the type's uncommons and rares, and on the tome, lantern, orb and amulet commons.

### Matins robe
- **Is:** robes · uncommon
- **Card:** Every third ability its wearer casts in a fight costs no MP.
- **Stats:** MP +1 · Attack +1 (2 of 2)
- **Numbers:** the third, sixth and ninth cast of each fight are free.
- **Code:** as today's Matins robe, on a count of its wearer's casts.
- **Serves:** Barrage 1 ●● ⚙ crescendo (half) ◆ free-cast
- **Notes:** Today's piece, changed as its line says (today's: the first cast of each fight). The count starts again each fight. It counts the casts its wearer makes, free or paid; a second cast something else makes for it isn't counted, as Twice-told tome counts. In a fight with fewer than three casts it does nothing.

### Banked robe
- **Is:** robes · uncommon
- **Card:** Its wearer's abilities add half again as many stacks of Burn, Chill and Shock.
- **Stats:** Attack +1 · Cast speed medium (2 of 2)
- **Numbers:** half again, on the stacks its abilities themselves add.
- **Code:** none: today's Archmage's mantle changes stacks the same way, for every status.
- **Serves:** Bonfire 1 ●●, Snap 1 ●●, Storm 1 ●●
- **Notes:** New. It doesn't reach what a passive or a piece adds beside a cast (Stoke), or what allies' swings add under Thunderstorm. It sits beside Archmage's mantle in the same kind (*Least sure*).

### Glyphed robe
- **Is:** robes · uncommon
- **Card:** Each ability its wearer casts gives it a Shield of a tenth of its max MP.
- **Stats:** MP +1 · Aggro −1 (2 of 2)
- **Numbers:** a tenth of max MP a cast, given as the cast finishes.
- **Code:** as today's Glyphed robe, read from max MP.
- **Serves:** Barrage 1 ●, Landslide ● ⚙ detonation (half), mana as armour (half) ◆ shield-by-doing
- **Notes:** Today's piece, changed as its line says: read from max MP, where today's reads Attack. A tenth of a caster's pool is about a seventh of its HP bar a cast. The MP step makes each one bigger, and drawing less lets the bar grow.

### Acolyte's robe
- **Is:** robes · uncommon
- **Card:** Each time another ally casts an ability, its wearer regains a twentieth of its max MP.
- **Stats:** MP +1 · MP regen +1 (2 of 2)
- **Numbers:** a twentieth of its own max MP for each cast another ally finishes.
- **Code:** none: today's Weaver's robes waits on an ally's cast the same way.
- **Serves:** Barrage 1 ●● ◆ free-cast
- **Notes:** New. "Another ally" is the line's word now. Beside two allies that cast it's about a quarter of its pool in a regular fight. It isn't MP given in the spine's sense: its wearer's own piece restores it.

### Kindled robes
- **Is:** robes · rare
- **Card:** While any foe burns, its wearer gains a Heat every 4 ticks (it acts 5% faster in everything for each Heat, up to 10, for the rest of the fight).
- **Stats:** Attack +1 · Cast speed medium · MP regen +1 (3 of 3)
- **Numbers:** one Heat every four ticks while a foe holds Burn. Heat is `fill/shared.md`'s: ten after forty ticks of fire.
- **Code:** as today's Kindled robes.
- **Serves:** Bonfire 2 ●●●, Barrage ●
- **Notes:** Today's piece. Heat is speed now, so the same card makes its spells come quicker where today's makes them hit harder. Four ticks is today's beat and the lead's ruling. The bracket is the counter's own wording.

### Quiet robes
- **Is:** robes · rare
- **Card:** Its wearer can't be Silenced.
- **Stats:** MP +1 · MP regen +1 · Aggro −1 (3 of 3)
- **Numbers:** none.
- **Code:** as today's Quiet robes.
- **Serves:** Barrage 2 ●●, Bonfire ●●, stops a cast
- **Notes:** Today's piece, card kept.

### Resonant robes
- **Is:** robes · rare
- **Card:** Each ability its wearer casts comes round a tenth sooner for each foe it hit.
- **Stats:** MP +1 · MP regen +1 · Cast speed medium (3 of 3)
- **Numbers:** a tenth of that ability's cooldown for each foe its hits landed on, each foe once: five foes halve the wait, eight leave a fifth.
- **Code:** 10.
- **Serves:** Barrage 2 ●●●, Storm 2 ●●●, Bonfire ●●, Snap ●● ⚙ resonance (key)
- **Notes:** New. The same size and the same words as Storm front's Thunderhead seat, as that share asked; on one unit the two add. Once the cooldown is short the wind-up is what's left, so the third step is Cast speed.

### Flagellant's vestments
- **Is:** robes · rare
- **Card:** Its wearer's abilities cost HP in place of MP: the same share of its max HP as they'd cost of its max MP. It won't cast one that would leave it below a tenth of its HP.
- **Stats:** MP +2 · Aggro −1 (3 of 3)
- **Numbers:** the line's size. In this robe a wide spell costs a sixth to a quarter of its wearer's max HP (a quarter to two fifths before the robe's own MP steps). The floor is a tenth of max HP.
- **Code:** 20 (as today's Blood covenant).
- **Serves:** Pact 2 ●●●, Barrage 2 ●● ⚙ blood mage (key), brink (key)
- **Notes:** Today's Blood covenant, an amulet and a legendary, as a robe and a rare; today's card kept. Each cast is HP paid, in the spine's sense, and an ability paid in HP is paid for. A price that takes its wearer under a line is a crossing, so the party's nets answer its casts. The price is a share of the pool, so a bigger pool makes every cast cheaper in life: that's what the MP steps are for. No Lifesteal on it: the engine takes two parts. It draws less because its wearer lives low.

### Glimmer robe
- **Is:** robes · rare
- **Card:** Each time an ally gives its wearer MP, the next ability its wearer casts that deals damage deals a third more.
- **Stats:** Attack +1 · MP +1 · Aggro −1 (3 of 3)
- **Numbers:** a third more, on every hit of that one ability.
- **Code:** 20.
- **Serves:** Barrage 2 ●● ⚙ mana as armour (half)
- **Notes:** New. "That deals damage" is added so a heal or a buff cast in between doesn't spend it. Gifts before the cast don't add up. Clarity and its own regen aren't gifts.

### Archmage's mantle
- **Is:** robes · legendary
- **Card:** Its wearer's abilities cost half again as much MP, deal half again as much damage, heal half again as much, and add half again as many stacks.
- **Stats:** MP +2 · MP regen +1 · Attack +1 (4 of 4)
- **Numbers:** half again on each of the four.
- **Code:** as today's Archmage's mantle.
- **Serves:** Barrage 3 ●●●, Bonfire ●●, Snap ●●
- **Notes:** Today's piece: card, sizes and steps kept.

### Vestments of return
- **Is:** robes · legendary
- **Card:** While its wearer stands, every ally revived comes back behind a Shield of half that ally's max HP.
- **Stats:** MP +2 · MP regen +1 · Aggro −1 (4 of 4)
- **Numbers:** half the revived ally's max HP: the Shield's whole cap.
- **Code:** as today's Vestments of return.
- **Serves:** net
- **Notes:** Today's piece: card, size and steps kept. It works whoever does the reviving.

### Motley robe
- **Is:** robes · legendary
- **Card:** Its wearer casts its abilities in a random order, whatever order they're slotted in, and each costs half its MP.
- **Stats:** Attack +2 · Cast speed medium · Aggro −1 (4 of 4)
- **Numbers:** half the MP cost. Each time its wearer is free to act, it casts one of its ready abilities, picked at random.
- **Code:** 21; the half cost is today's cost change.
- **Serves:** exotic
- **Notes:** New. "First-slotted" keeps its meaning for the cards that read it. With mana no longer the brake, its steps are Attack and Cast speed.

## Challenges

Round 1 ruled on twelve of the thirteen challenges handed in; the rulings are applied above. These are the one it left, and four the rulings open.

1. **Bloodsworn mail and Tithing leathers can't sit under Flagellant's vestments,** which is the same slot. Their blood mage tags hold only under The covenant, which gives everyone Lifesteal already, or beside Blood vial. Not ruled in round 1.
2. **"A heal", and healing received.** The ruling leaves a Regen's pulses out of "a heal" for cards that read their wearer's heals. Three of mine act on the healing their wearer receives, and I read the pulses as counting. Red stone mail's card now names Regen, since builds.md's red stone counts on a Cleric's Regen landing on a full ally. Sanguine mail doubles or halves whatever its wearer receives. Last bastion's "by anyone or anything" ends on a pulse. If the ruling was meant to reach them, Red stone mail loses a clause and the other two need one.
3. **A piece that fires as the fight starts because its wearer is already under the line.** By the crossing ruling Holdfast, Warded mail and Aegis mail do. The spine's *start-of-fight effects* covers whatever a piece does as a fight starts, however its card words it. Read to the letter, Second dawn would then Guard, Shield or Aegis again at every fall. I read these as crossings, not openings: they don't happen again.
4. **Mail's commons under "the first stat its row names".** The three rows name HP, Lifesteal and HP. I kept Attack, Lifesteal and HP under the names as ruled, so the first row gives way. Read row by row, the third gives way instead and Mail has a Defense common in place of the Attack one.
5. **The Heat bracket on Windrunner's garb.** The counter's wording ends "for the rest of the fight", and the card's next sentence spends half of it at every hit. It's the one card where the two pull against each other. Written as ruled.

## Links

- **Detonation** (Rubble plate, key; Scabbed mail, Glyphed robe, Red stone mail, halves). *Mine:* the break sends the Shield's highest point to every foe, one for one. The makers: 3% of max HP a hit; a tenth of max MP a cast; all healing past full. *The other side:* a first Shield of about a fifth of a wall's max HP reads as a blow, which Vanguard is. The Hoplite, the Paladin and the Bramble knight make no Shield of their own. None of my three makers can sit under Rubble plate: they meet Shatterstone charm, or Second skin on a Valkyrie or a Bramble knight.
- **Frozen gate** (Hoarfrost plate, key; Portcullis, Challenger's plate, Frostwalker's furs, halves). *Mine:* about four Chill a blow on a wall in the piece, so a foe bursts on its third or fourth blow and a boss about twice a fight. *The other side:* a draw from outside the armor slot, and readers that pay once a shatter. The two plate halves serve the engine's other homes (Frostward blade, Frost armor, Toll gate), not this one.
- **Mirror** (Thornheart plate, key; Portcullis, Holdfast, Challenger's plate, Aegis mail, halves). *Mine:* a third of the blow, a twentieth more a Spite. *The other side:* Mirror shield stays at half, so this passes it at the fourth blow. A boss that lands eight or ten blows a fight leaves it at about three quarters by the end, so it needs the keeper as much as the wall.
- **Goad** (Urchin plate, Challenger's plate, Static mail, halves). *Mine:* high Thorns behind a Shield; a Taunt laid once a Taunt's length; about three Shock a blow. *The other side:* Goading totem's call on each Taunt. A foe called early pays the Shock it holds and the Thorns it meets, about 500 to 800 on a wall in these pieces, against a blow the wall mostly stops.
- **Reckoning** (The anvil, key; Portcullis, Challenger's plate, halves). *Mine:* one Wrath a hit taken, to the slowest other swing. *The other side:* a swing slow enough for ten bites to land between two of them, and the party's slowest basic attack being its hammer and not a caster's staff.
- **Judge's drum** (Pack leader's coat, key). Nothing to size. *The other side:* a slow, heavy swing somewhere in the party.
- **Opening again** (Overture coat, key). *Mine:* each effect in full at each of its wearer's killing blows, once a kill; a kill by the opening as it happens again calls it again. *The other side:* start-of-fight pieces a Leather wearer can hold. The other shares count them: a phial on an Assassin, a tome on a Bard, a totem on a Stormcaller, an opening bow or dagger, the amulets, a seat.
- **Riposte** (Duelist's leathers, key; Scabbed mail, Tithing leathers, Quickstep leathers, Windrunner's garb, halves). *Mine:* a whole weapon strike a dodge, with a draw in its own steps. The halves: 3% of max HP a hit as Shield or as healing; Haste a dodge; three Heat a dodge. *The other side:* about two dodges in three, or a second cover-maker such as Shieldmaiden, for the banked cover to equal the blow that lands. The three Leather halves can't sit under Duelist's leathers; they pair with Parrying spear and Tempest cloak.
- **Every colour** (Hexweave mail, half). *Mine:* 10% a different debuff. *The other side:* nothing needed; it rises beside Malison on the same foe.
- **Blood mage** (Flagellant's vestments, key; Bloodsworn mail, Tithing leathers, halves). *Mine:* the price is the line's: a sixth to a quarter of max HP for a wide spell, with the robe's MP steps. *The other side:* "loses on one, gains on three" needs Lifesteal of about a fifth for a Stormcaller and more for a Pyromancer. A common's tenth breaks even at four or five foes for those two, and never for a Frostweaver, whose Blizzard is a touch a foe. To meet the size at a common, the price would have to be about half the share. The lead has taken the price's size to the director.
- **Resonance** (Resonant robes, key). *Mine:* a tenth of the cooldown a foe. *The other side:* Storm front's seat is the same size and adds. The mana comes from Recharge, Mana pearl and Meltwater orb, which between them take the mana brake away.
- **Crescendo** (Matins robe, half). *Mine:* the third, sixth and ninth cast free. *The other side:* Crescendo charm's fifth more a stack. The first cast of an ability is plain, so its third cast costs two fifths more and is the one worth skipping.
- **Mana as armour** (Glyphed robe, Glimmer robe, halves). *Mine:* a tenth of max MP as Shield a cast; a third more on the next damaging cast after a gift. *The other side:* gifts that arrive in one piece and often: Refrain, Tithe wand, Shepherd's staff, a Wellspring seat.
- **Firecracker** (Frostwalker's furs, key). *Mine:* about three Chill on every foe with its next hit. *The other side:* a field already at nine or more, from Blizzard, Stillness, Hail or Snowbound folio. On a warm field it lays three and nothing bursts.
- **Brink** (Flagellant's vestments, key; Last bastion, Scabbed mail, Bloodsworn mail, Warded mail, Sanguine mail, Aegis mail, halves). *Mine:* the vestments hold a caster between a tenth and about a third of its HP. The halves give cover or a drink to whoever is low. A price is a crossing now, so Warded mail and Aegis mail answer the cast that takes a payer under the line. *The other side:* givers that aim at the lowest ally.
- **Two in the dark** (Challenger's plate, Shadow mantle, halves). *Mine:* the one left in the light Taunts all fight and can't be hidden; the mantle doubles a hidden unit's hits. *The other side:* Hidden laid again every ten ticks or so, its own length.
- **Red stone** (Red stone mail, key). *Mine:* all healing past full, one for one, a Regen's pulses included. *The other side:* healing that lands on a full unit: its own Lifesteal step, Heartsblood, Refrain, a Cleric's Regen.
- **Carrier** (Carrier's coat, key). *Mine:* one stack of each affliction held, a hit. *The other side:* Burning heart keeps a few Burn on its wearer. Scapegoat charm on the same unit takes each affliction away at its next hit, so the two work against each other.

## Loops

- **Acolyte's robe under The cathedral.** Two Voices in the robe each regain a twentieth of their pool at each of the Soloist's casts, and a Voice's MP goes to the Soloist: 220 to 380 MP a cast. A first-slotted ability that costs less (most skills, at 125 to 325) is cast without end. *Brake:* its wind-up and recovery only. It's one more way into the spine's known loop of The cathedral with its price gone.
- **Overture coat with an opening that kills.** A kill by the opening as it happens again calls it again, by the ruling. Quietus on an Assassin or a Ranger strikes every foe at each kill, and each of those strikes that kills strikes every foe once more. *Brake:* a round that fells nobody, and the foes running out. Against a pack already sunk it clears the field in one moment.
- **Aegis mail beside a unit that pays.** A price that takes an ally under a third is a crossing, and each drink or heal back over the line arms it again. On the wearer of Flagellant's vestments or a Blood vial with Lifesteal that's an Aegis every cast or two, and the unit falls only to blows under a quarter of its max HP. *Brake:* it has to be back at a third or over between crossings. The spine's own doubt; the price now sets it off directly.
- **Scabbed mail beside Earthmother totem** (one Bramble knight can hold both). Each hit lays a small Shield, the next blow breaks it, and each break gives many Might. A small Shield serves better than a big one. *Brake:* Might's own cap, and a stack spent each action. The same shape as the first share's Rubble shield note.
- **Challenger's plate with Goading totem** (a Bramble knight can hold both). Each renewal of the Taunt calls every foe's swing. *Brake:* the Taunt's own length. A foe that strips the Taunt brings the next call early, at its own cooldown.
- **Rubble plate with Second skin** (a Hoplite or a Bramble knight). A break sends the Shield at every foe and half is rebuilt, which breaks and sends half. *Brake:* Second skin's "every so often", and the halving.
- **Frostwalker's furs in a cold pack.** The throw takes a foe to its cap, and the shatter readies the next throw. *Brake:* each throw waits for its wearer's next hit; the damping, in fractions of a stack; the cold running out.
- **Pack leader's coat.** A called swing that kills calls again. *Brake:* each link needs a kill, "at once" doesn't stack, and the foes run out.
- **Resonant robes with the price gone** (The deep well under Clarity on the same Pyromancer or Frostweaver; The chalice), or twice on one unit under Storm front's Thunderhead, where five foes make the spell ready as it lands. *Brake:* wind-up and recovery, and the pack thinning. Known to the spine and the formations share.
- **Flagellant's vestments with Lifesteal on a wide spell,** as The cathedral's Soloist or in the Thunderhead seat. *Brake:* the floor at a tenth of HP, the wind-up, the pack thinning. Known.
- **Checked, and not loops:** Kindled robes (Heat stops at ten); Windrunner's garb at three Heat a dodge (speed brings no dodges); Heat, Spite or Cuts copied by Twin-knot (each stops at its own ceiling); Static mail under a called swing (one call a swing or a Taunt); Thornheart plate (what's sent back isn't a hit and nothing answers it); Red stone mail (a Shield isn't healing); Glimmer robe (a boost brings no gift).

## Code support beyond the spine's list

- **A watch on HP that sees every crossing.** Holdfast, Warded mail and Aegis mail fire on a crossing made by a price or a drain, and as a fight starts on a unit already under the line. Today's pieces wait on HP lost, and a price fires no event. Aegis mail also needs a marker on each ally, lifted when it's back at a third or over, to keep "whenever" to once a crossing. The states that read half HP (Portcullis, Mottled hide, Bloodsworn mail, Sanguine mail) need the same watch, or a price leaves them a beat behind.
- **The order for healing past full:** Red stone mail on the healed unit first, then the healer's Phylactery, then Shared cup; and Halved heart's cap counting as "past full" for all three. The spine states the order as a rule and its list doesn't carry it.
- **"A killing blow" as a hit.** Today's Pack leader's coat fires on any kill its wearer is credited with, Thorns included. Pack leader's coat and Overture coat need the kill filtered to a hit, with a hit landed by a repeated opening or a called swing counted.
- **A counter spent by a card.** Windrunner's garb removes half its wearer's Heat on a hit taken. Today's Tempo carries that inside the counter; Heat is shared, so the spending moves to the piece.
- **A boost that waits for a damaging cast** (Glimmer robe): held through heals and buffs, spent by the first ability that deals damage.
- **A count of casts on the wearer** (Matins robe), which leaves out a second cast something else makes.

## Least sure

- **Quickstep leathers beside Windrunner's garb,** ruled to stay. Both are "a dodge makes its wearer faster", in one kind. At three Heat a dodge the legendary passes the uncommon's Haste at its third dodge, and then loses half at each hit, where Haste loses nothing. A dodger that's hit one time in three sits between the two sizes. Whether the legendary feels like the far end is for play.
- **Banked robe beside Archmage's mantle,** ruled to stay. For a status caster the uncommon is the legendary's best part, without its price.
- **Last bastion leaves its wearer at 1 HP when the fight is won,** as its line says, and HP carries. A unit it saved starts the next fight one blow from down.
- **Flagellant's vestments.** A caster in it pays a quarter of its bar for a wide spell and drinks back a third of that at a Lifesteal common; the price's size is with the director. In play the price in life was worn for two fights. Beside Orb of the deep the bars swap jobs: casts come out of HP and blows out of a pool it no longer spends. That may be the best thing the piece does, and nobody designed it.
- **Counters as gifts.** A counter a card gives is now something a unit gives itself, so Twin-knot or Twins copies Windrunner's Heat, Kindled robes' Heat, Thornheart plate's Spite and Tallymail's Cuts. The copied Heat is real, and on the ally nothing spends it: Windrunner's halving is its wearer's alone. The copied Spite and Cuts do nothing without a reader.
- **Thornheart plate's numbers.** A third and a twentieth a Spite passes the whole blow at fourteen Spite. Against a swarm that's reached in one fight; against a boss it ends near three quarters. With Mirror shield or Hoplon on the same wall, more than the blow comes back from the first hit.
- **The 3% pieces** (Scabbed mail, Tithing leathers). Twice today's size, and still numbers under 150 a hit. They're seen as a bar that grows and a bar that doesn't fall, not as a number.
- **Quiet robes.** Silence comes from two enemies. In every other fight it's three stat steps and no effect.
- **Motley robe.** On a unit that knows one ability, which was most units in play, the random order costs nothing and the card is half-price spells.
- **The anvil.** Its Wrath goes to whoever swings slowest, which the party has to arrange. Beside two fast units it loads a wand.
- **Carrier's coat.** Its steps are a guess at an exotic nobody has seen play: no Evasion on a Leather piece, and a body to carry what it catches. By the ruling on carried riders a follower meets a rider's condition itself, so under The standard or Mimic wand I read a follower's swing as passing on the follower's own afflictions, not the Lead's.
- **Acolyte's robe at a twentieth.** It's the small end of the mana links the other shares wrote (a tenth, 15%, a quarter). It fires on every cast of two allies, so I left it there; it may not be seen.
- **Hoarfrost plate under Guard.** Guard raises the Defense it reads, so a Guarded wall lays five or six Chill a blow and a pack bursts on its second or third. With Heart of winter on the same wall, every blow chills the whole field, as the amulets share notes.
- **The commons.** By the first-stat ruling Plate has no Aggro common and Robes no Attack common. Mail's are a reading (*Challenges*, 4).
