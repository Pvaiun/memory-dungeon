# The fill: formations

Thirty-five formations, in the spine's order: 13 common, 12 rare, 10 legendary. Neutral stays as it is and isn't here. Written to the spine's lines as they stand after round 1, and to `fill/shared.md`.

## How this share is written

- **A card** is the formation's promise, then each seat under its name, then the party's rule where it has one. Two or three seats that read the same are written once.
- **What's kept.**
  - *Word for word:* Hearth, Shieldwall, The wheel.
  - *From today's card, changed as the line says:* Hoarfrost line, Hunting party, Skirmish line, First light, The pack, Blood oath.
  - *A name of today's on a new formation:* Heavy line, Spur, Thorn hedge, Wellspring, Hammer and anvil, Vigil, The forge, The mountain.
  - *New:* the other eighteen.
- **The seats' words, as numbers** (`content/core-set/formations.ts`, *The words, as numbers*). A seat step is one and a quarter gear steps.

| On the card | The number |
| --- | --- |
| Draws far more, far less | Aggro +25, −25: two seat steps, so its draw doubles or halves |
| Draws more, less | Aggro +13, −13: one seat step |
| Defense up; up two steps | Defense +1,250; +2,500 |
| Attack up two steps | Attack +2,500 |
| Evasion up | Evasion medium (`SPECIAL.evasion`, 20) |
| Thorns | Thorns medium (`SPECIAL.thorns`, 150) |
| Lifesteal; Lifesteal, high | 10%; 20% (`SPECIAL.lifesteal`) |
| Basic attacks a fifth faster; a third faster | Attack speed +20 (`FIFTH_FASTER`); +33 |
| Abilities come round a fifth faster; a third faster | Cooldown +20; +33 |

- **Stacks from a seat or a party rule are flat:** a few is 2, several 4, many 7 (`FLAT_STACKS`), whoever sits there, so the card names no stat (`fill/shared.md`, *Rulings for every share*).
- **A status keeps its own numbers** (`STATUS`): a seat that Taunts, Guards, Hastes, Hides or Marks says when, never for how long.
- **A counter's bracket** is `fill/shared.md`'s wording, on the seat or the rule that holds the count.
- **Other shares' items are named in Notes and at the end, never on a card.**

## Common

### Heavy line
- **Is:** formation · common
- **Card:** One strikes like a falling hill, one takes the blows, one loads the strike. **Hammer:** Its basic attacks come half as often and deal two and a quarter times as much. **Anvil:** Draws far more. Defense up. **Loader:** When each fight starts, the Hammer gains many Might.
- **Numbers:** Hammer: Attack speed −100 and basic attacks +125%, the shape of today's Millstone. Anvil: Aggro +25, Defense +1,250. Loader: many Might, flat (`FLAT_STACKS.many`, 7): +42% on the Hammer's first action and a stack less on each one after (`STATUS.might`).
- **Code:** none new. The Hammer is today's Millstone on a seat; the Loader's gift goes to a named seat when the fight starts, as today's Spur's Pacer Hastes the other two.
- **Serves:** Landslide 1 ●●●, Hunt ● ⚙ judge's drum (half), avalanche (half), reckoning (half)
- **Notes:** Today's Heavy line (Bruiser, Holder, Free) goes; the name stays. Seen: with seven Might the first swing lands for about three times a plain one, and it's the fight's biggest number. Might is spent an action at a time, so an ability the Hammer casts first spends a stack: its ability order decides. A hit "of its basic attack's size" on the Hammer (a strike with its weapon) takes the seat's shape too. A Hoplite in the seat, or a Hammer wearing Millstone, holds two swing shapes, and today they add (`loot.md`, *Levers held back*). The Loader's gift is a seat's start-of-fight effect, so a piece that makes those happen again gives the Might again.

### Spur
- **Is:** formation · common
- **Card:** One opens the wound; two pour into it. **Opener:** Crits far more often: +20% Crit chance. **Blade** (two seats): Basic attacks a fifth faster.
- **Numbers:** Opener: Crit chance +20 points, the table's top word (`CRIT_TABLE[5]`). Blade: Attack speed +20 (`FIFTH_FASTER`).
- **Code:** none: stats on seats.
- **Serves:** Cuts 1 ●●●, Bonfire ●, Storm ●, Snap ●
- **Notes:** Today's Spur (a Pacer who Hastes two Blades, HP down) goes; the Blade keeps its speed and loses its cost. The seat word "crits far more" is +7 points today (`critSt(2)`): on a dagger that's about one more crit every two fights, which nobody would see. At +20 a unit that crits one swing in five crits two in five, and one that never crits does it once or twice a fight. The number is on the card, as round 1 rules for "far more often". It's plain Crit chance, a stat on a seat, so it carries no ceiling of its own: see *Least sure*.

### Hearth
- **Is:** formation · common
- **Card:** One holds the door, one feeds the fire, one carries it to every burning foe. **Keeper:** Taunts and is Guarded when each fight starts. **Stoker:** Hasted when each fight starts. Basic attacks a fifth faster. **Torch:** Each of its hits adds a Burn to every foe that's already burning.
- **Numbers:** Keeper: Taunt and Guard, at their own lengths. Stoker: Haste; Attack speed +20. Torch: one Burn (`FLAT_STACKS.one`) on each burning foe for each hit it lands: basic attacks, abilities and extra strikes.
- **Code:** as today's Hearth.
- **Serves:** Bonfire 1 ●●●, Toll ●
- **Notes:** Today's Hearth, word for word and number for number, by the director's ruling. Only its rarity changes, from rare to common.

### Hoarfrost line
- **Is:** formation · common
- **Card:** Two lay frost with every blow; the third breaks what freezes. **Frost** (two seats): Basic attacks add a few Chill. **Breaker:** While a foe is Stunned, its basic attacks go to that foe. Its hits on a Stunned foe deal double.
- **Numbers:** Frost: a few Chill, flat (2). Breaker: the aim is a pick, so it's inside the Taunt rule; with several foes Stunned, it picks among them by draw; it has a phrase of its own, so a Mark doesn't steer its swings while a foe is Stunned. +100% on its hits against a foe that holds Stun, whatever Stunned it.
- **Code:** the Frost seats as today's Hoarfrost line's, at two stacks. The Breaker's aim as today's The vise's (basic attacks go to a Stunned foe), on one seat; its double as today's Icebreaker.
- **Serves:** Snap 1 ●●●, Landslide ● ⚙ lead's colour (half)
- **Notes:** Today's Hoarfrost line, from rare to common. Frost goes from one Chill to a few: at one, Chill peaked at 2 to 8 in play and never shattered. At two, two sword-speed sitters take a lone foe to its cap in about 30 ticks. Spread over a pack of four they don't reach it alone; the seats are a second and third source, not the only ones. The Breaker is the line's, with the aim round 1 gave it: a shatter's Stun lasts 8 ticks, and now the Breaker's next swing inside it lands on that foe, for double. It reads any Stun (a bash, a tremor, a hammer's third swing), so the seat pays in a party with no frost at all.

### Squall line
- **Is:** formation · common
- **Card:** Two charge the field; one stands where the foes look. **Squall** (two seats): Its basic attacks add a few Shock, and also hit a second, random foe for half as much, adding the same Shock to it. The second hit leaps no further. **Rod:** Draws far more. Defense up.
- **Numbers:** Squall: a few Shock, flat (2), on each of the two foes. The second hit is half the swing's damage: an extra hit of its own kind, as Arc's second is, not a basic attack and not an extra strike, so nothing that waits on either answers it. Rod: Aggro +25, Defense +1,250.
- **Code:** as today's Sweeping blade (a second, random foe for half), with the seat's Shock laid on both foes as Arc lays its own.
- **Serves:** Storm 1 ●●●, Toll ●, Cuts ● ⚙ red rain (half), held charge (half)
- **Notes:** New. "A second, random foe" is the vocabulary's phrase: the Taunt rule doesn't apply to it. The line says the second hit carries "it": I read that as the seat's Shock and nothing else of the swing, which is what keeps it apart from the five rares that fan a swing out. Seen: each foe that acts with two stacks takes 160 and keeps one (`STATUS.shock`); the sign is the yellow number on a foe nobody aimed at. A Stormcaller here arcs twice, to Arc's foe and to the seat's.

### Hunting party
- **Is:** formation · common
- **Card:** One picks the quarry, one runs it down past any guard, one holds the line. **Marker:** While no foe is Marked, its basic attacks Mark their target. **Chaser:** Everything it does has Seek. **Warden:** Draws far more. Defense up.
- **Numbers:** Marker: Marked, at its own length (`STATUS.marked`). Chaser: Seek on its basic attacks and every ability. Warden: Aggro +25, Defense +1,250.
- **Code:** 1. The Marker as today's Hunting party's, under the test today's Gravemark uses (no foe Marked); the Chaser as today's.
- **Serves:** Hunt 1 ●●●
- **Notes:** Today's Hunting party, from rare to common. The Marker Marks only while no foe is Marked (one Mark from gear). The Warden's Taunt at the start becomes a draw and Defense, as the line says; the Chaser is unchanged. Inside the Taunt rule the Marker's swing Marks a Taunting foe unless the Marker has Seek, and the Chaser is the one who follows a Mark past a guard. What makes it seen is the kit change, not the seat: a Mark that takes the party's random picks.

### Thorn hedge
- **Is:** formation · common
- **Card:** A thorned wall that draws the blows, and two who make every blow on it cost. **Anchor:** Draws far more. Thorns. **Warden:** Each hit the Anchor takes heals the Anchor for 3% of the Warden's max HP. **Barb:** A foe that hits the Anchor has damage sent back at it: a twentieth of the Barb's Attack.
- **Numbers:** Anchor: Aggro +25; Thorns medium (150 a hit taken). Warden: 3% of the Warden's own max HP a hit (60 from a Cleric's 2,000, 120 from a Paladin's 4,000). Thorn: 5% of the Thorn's Attack a hit (200 at Attack 4), sent back: a reaction as Thorns is, untyped, not a hit. The scale has no word this small (`HIT.touch` is 17%), so both values are mine.
- **Code:** reactions to a hit on a named seat, as today's Thorn hedge's two seats, with a heal and a damage in place of their Weaken.
- **Serves:** Toll 1 ●●●, Pact ●
- **Notes:** Today's Thorn hedge (Thorns high on the Anchor, two seats that Weaken its attackers) goes; the name and the Anchor stay, the Anchor's Thorns at medium as the line has it. Seen: a wolf's bite on a Plate wall lands for 100 to 130 and a bandit's swing for about 300, so the mend is a number the size of the bite, and the attacker reads two numbers where it read one. The Thorn's size is near Thorns' own on purpose: at `HIT.touch` it would be four Thorns a bite, on the road that least needs it. The third seat is the Barb, renamed from Thorn in round 3: what it sends back isn't Thorns, so nothing that reads Thorns reads it, and the name said otherwise.

### Wellspring
- **Is:** formation · common
- **Card:** Two keep one caster casting. **Soloist:** Its abilities come round a fifth faster. Draws far less. **Conductor:** Each ability it casts gives the Soloist MP: a tenth of the Soloist's max MP. **Well:** Draws more. Each hit it takes gives the Soloist MP: a twentieth of the Soloist's max MP.
- **Numbers:** Soloist: Cooldown +20; Aggro −25. Conductor: 10% of the Soloist's max MP a cast (380 for a Pyromancer, 230 for a Stormcaller). Well: Aggro +13; 5% of the Soloist's max MP for each hit it takes.
- **Code:** as today's Relay's Well (a cast gives a named seat MP) and Horn of the keep (a hit taken gives MP), each read off the receiver's max MP.
- **Serves:** Barrage 1 ●●●, Toll ● ⚙ mana as armour (half)
- **Notes:** Today's Wellspring (a Source that regains MP, two Spenders at a tenth off) goes: it read as a debuff in play, and a tenth off a cost was never seen. The name stays. Both gifts are "gives MP" in the spine's sense: one piece, into another ally's pool. Sized to builds.md's "a whole cast's mana": one Conductor cast is most of a Firebolt, and a pack's ten bites on the Well are half a pool. A Conductor with a quick ability slotted first gives most, so the seat has a use for a unit's cheapest skill. The Soloist's "faster" has no word in the line: I gave it the commons' fifth.

### Shared cup
- **Is:** formation · common
- **Card:** Nobody's healing is wasted. **Drinker** (two seats): Lifesteal. **Donor:** Its heals are a third bigger. **The party:** Healing any ally receives past full goes to the ally with the lowest share of max HP that can be healed. Healing sent on this way isn't sent on again.
- **Numbers:** Drinker: Lifesteal medium (10%). Donor: +33% on its heals: the HP its abilities and pieces restore at once, not a Regen's pulses. The party: the whole part past full of any healing an ally receives: a heal, Lifesteal's healing, a Regen's pulse. An ally at full, or at a cap it can't be healed over, is passed by for the next lowest; if nobody can be healed, it's lost.
- **Code:** 14, with a pick that passes by an ally that can't be healed.
- **Serves:** Pact 1 ●●●, Cuts ●● ⚙ brink (half)
- **Notes:** New. The order the spine gives holds: healing past full goes to the healed unit's own piece first, then the healer's, then here. Seen: a full Drinker's green numbers appear on someone else. "That can be healed" is round 1's: an ally capped at half is passed by, so the cup no longer pours onto the unit that can't take it. A Regen's pulse past full is sent on too: the cup reads healing received, which is all of it, as round 2 rules. The Donor's third is on the heals it gives, so its Regen's pulses aren't bigger.

### Shieldwall
- **Is:** formation · common
- **Card:** One stands in front with its shield up; two stand behind it. **Wall:** Draws far more. Defense up two steps. **Behind** (two seats): Draws less.
- **Numbers:** Wall: Aggro +25, Defense +2,500. Behind: Aggro −13.
- **Code:** as today's Shieldwall.
- **Serves:** Toll ●●, Bonfire ●●, Storm ●●, Landslide ●●, Hunt ●, Barrage ●● ⚙ mirror (half), frozen gate (half)
- **Notes:** Today's Shieldwall, word for word and number for number. It was fought in for its plain promise, which is what the shared ground needs.

### The standard
- **Is:** formation · common
- **Card:** Two follow the lead's colour. **Lead:** Nothing of its own. **Follower** (two seats): Its basic attacks add whatever statuses the Lead's basic attacks add to their target. They're added as its own would be: on the same condition, with stacks from the Follower's own stats, and never twice from one source. What it borrows isn't borrowed on by anyone else.
- **Numbers:** none of its own. What's borrowed is every status the Lead's swing adds to its target, from the Lead's passive, its gear or a buff it holds. One that waits for a crit, a first hit or a count waits for the Follower's own. One the Follower's swing already holds from the same source is added once, not twice. Nothing else of the Lead's swing passes. Each rider keeps its word (a few, several, many) and reads the Follower's stat where the Lead's reads the Lead's.
- **Code:** 12.
- **Serves:** Bonfire 1 ●●●, Snap 1 ●●●, Storm 1 ●●●, Cuts 1 ●● ⚙ lead's colour (key)
- **Notes:** New. The card says more than the line, as round 1 settled "carry": the Follower takes each rider whole, reads its own stat and meets any condition itself. "Nothing else" is the spine's phrase for a carried swing: no second target, no damage boost, no heal, no MP. "The same source" is a storm on the whole party or Crown of embers: the Follower has that rider already and doesn't take the Lead's copy. A rider the Lead's own swing borrows from someone else isn't the Lead's to pass. Behind a Lead whose swing adds nothing the Followers do nothing, and with the Lead down they carry nothing. The card is in Mimic wand's words (round 3): "a rider" is the design's word and no player has been given it, and this is a common. The ruling on carrying is whole in the numbers.

### First light
- **Is:** formation · common
- **Card:** Up before dawn. **Riser** (all three seats): Nothing of its own. **The party:** When each fight starts, every ally's ability nearest to ready is ready: the one with the least cooldown left, among those still cooling down.
- **Numbers:** a whole cooldown, whatever was left on it; one ability an ally.
- **Code:** as today's First light, with `soonest` set ready where today's takes 5 ticks off every ability.
- **Serves:** first move, Hunt ●●, Barrage ●●, Landslide ●
- **Notes:** Today's First light gave 5 ticks and cost a step of Defense; it was owned five times and fought in once. A whole cooldown is the size that's seen, and the Defense cost goes, as the line says. Cooldowns carry, so nearly every unit starts a fight with something cooling (402 of 450 unit-fights in play). An ability made ready still needs its MP and its condition. It's the party's rule, not an ally's gear or seat, so nothing that makes start-of-fight effects happen again reaches it: it fires once a fight.

### Skirmish line
- **Is:** formation · common
- **Card:** Three who'd rather not be hit at all. **Skirmisher** (all three seats): Evasion up. Defense down. **The party:** Each time an ally dodges a hit, it gains a small Shield: a tenth of its max HP.
- **Numbers:** Skirmisher: Evasion medium (20); Defense −1,250. The party: a Shield of 10% of the dodger's max HP a dodge (200 to 500), up to the Shield's own cap.
- **Code:** as today's Skirmish line; the Shield answers a dodge as today's Hooded cloak's Might does.
- **Serves:** Toll ●●, Cuts ●● ⚙ riposte (half)
- **Notes:** Today's seats, with the party's rule added by the line. From the director's chair a dodge wasn't a defence, because the blow that landed still killed. Here a dodge banks about one bite's worth of cover, which is the size that makes the next blow land on grey. It scales from max HP where Hooded cloak's scales from Attack, so the two on one unit read differently and both pay.

## Rare

### Hammer and anvil
- **Is:** formation · rare
- **Card:** Every blow the Anvil takes is saved for the Hammer. **Anvil:** Draws far more. Each hit it takes adds a Wrath to the Hammer. **Hammer:** Holds the Wrath (its next basic attack deals a fifth more for each Wrath, up to 10, and spends them). **Smith:** Its heals and Shields on the Anvil are a third bigger.
- **Numbers:** Anvil: Aggro +25. Wrath as `fill/shared.md` has it: one a hit the Anvil takes, a fifth more a stack, to 10, all spent on the swing. Smith: +33% on the heals and Shields it gives the unit in the Anvil seat; a Regen it gives is the status's own and isn't bigger.
- **Code:** 15. The Smith as today's Blood oath's Donor (a heal that reads who's healed) and Earthmother totem (a Shield a third larger), aimed at one seat.
- **Serves:** Landslide 2 ●●●, Toll 2 ●●● ⚙ reckoning (key)
- **Notes:** Today's Hammer and anvil goes (an Anvil Guarded at the start, a slow triple swing, a Mason copying its Shields); the name and the two roles stay. The Hammer seat no longer slows the swing, so the sitter's weapon decides how much is banked: a great weapon's 12.8 ticks, or a Hoplite's twice that, banks a swarm's bites to the full ten, and a dagger spends one or two a swing. One hit adds one Wrath to the Hammer, however many cards count it. The bracket sits on the Hammer's seat, so that its "its" is the unit that swings.

### Bloodied ground
- **Is:** formation · rare
- **Card:** One opens them up; two drink from the wound. **Opener:** Its crits add many Bleed. **Blade** (two seats): Each hit it lands on a bleeding foe heals the Blade for 3% of its max HP.
- **Numbers:** Opener: many Bleed, flat (7), on each crit, swing or ability. Blade: 3% of its own max HP a hit (90 at 3,000 HP); every hit counts, extra strikes and each hit of an ability.
- **Code:** the Opener as Lacerate answers a crit; the Blade as today's Crimson dregs (a hit on a bleeding foe heals), read off max HP.
- **Serves:** Cuts 2 ●●●, Pact ●●
- **Notes:** New. Seen: seven Bleed pay 840 on the next hit that foe takes and about 2,500 before they close (`STATUS.bleed`), so one crit turns the next few small hits red. The Blade's mend is from max HP where Crimson dregs' is a share of the damage: a fast Blade with small hits is the one it suits. A dozen hits a fight mend about a third of a bar.

### Pyre line
- **Is:** formation · rare
- **Card:** The fire outlives whatever it's burning. **Keeper:** Taunts and is Guarded when each fight starts. Foes that hit it gain a few Burn. **Stoker:** Basic attacks a third faster. **Torch:** When a burning foe falls, all its Burn passes to the foe with the highest current HP. A fallen foe's fire moves once: if something else in the party moves it too, it's split evenly between them.
- **Numbers:** Keeper: Taunt and Guard, at their own lengths; a few Burn, flat (2), on a foe for each hit it lands on the Keeper. Stoker: Attack speed +33. Torch: every stack the foe held as it fell.
- **Code:** 9, as today's Wick, which sends the fire to the foe with the most HP. The Keeper's Burn is a reaction to a hit taken, as Thorn hedge's seats react today.
- **Serves:** Bonfire 2 ●●●, Hunt ●● ⚙ fuse (key)
- **Notes:** New; Hearth's shape, with each seat changed. The fire passes whoever lands the killing blow, while the Torch stands. The biggest foe is rarely the hottest, so the fire arrives on it and every feeder that aims at the most Burn turns to it. "The foe with the highest current HP" is one of round 1's new target phrases. The Keeper's Burn is flat, as a seat's is; the pieces that burn or chill an attacker read their wearer's Defense.

### Icefall
- **Is:** formation · rare
- **Card:** Two lay frost, each its own way, and every shatter rings the third's great spell. **Rime:** Whatever Chill its abilities add, they add half again as much. **Sleet:** Its basic attacks add a few Chill. **Breaker:** When a foe's Chill shatters, its first-slotted ability is ready.
- **Numbers:** Rime: +50% on the Chill stacks its abilities add. Sleet: a few Chill, flat (2). Breaker: a whole cooldown, on its first-slotted ability. Anyone's shatter rings it; if that ability is already ready, nothing more happens.
- **Code:** Rime as today's Archmage's mantle's stacks, for Chill alone. Sleet as Hoarfrost line's Frost. The Breaker hears a shatter as today's Hoarfrost line's does; its pick by whole cooldown is beyond the list (end of file).
- **Serves:** Snap 2 ●●●, Landslide ●●, Barrage ●●, Bonfire ● ⚙ shatter bell (key)
- **Notes:** New. Rime reads who sits in it: a unit whose abilities add Chill (a Frostweaver, a Ranger's frost arrows, a Monk's Frost fist). Sleet suits anyone who swings. The Breaker suits anyone with one ability worth ringing for. It's the first-slotted ability, by the director's ruling after gate 2: the player picks what rings by the order they slot abilities in, the same in every place the shatter bell sits. A Frostweaver in the Breaker seat rings its own Blizzard: under *Loops*.

### Storm front
- **Is:** formation · rare
- **Card:** The more foes one action touches, the more it pays. **Thunderhead:** Each ability it casts comes round a tenth sooner for each foe it hit. **Squall:** Its basic attacks also hit every other foe that holds Shock, for a third as much. Those hits strike nothing further. **Rod:** Draws far more. Foes that hit it gain a few Shock.
- **Numbers:** Thunderhead: 10% of that ability's cooldown off for each foe the cast hit, a foe hit several times counting once: two fifths off at four foes, four fifths at eight. Squall: a third of the swing's damage to each other foe holding at least one Shock; extra hits of their own kind, not basic attacks and not extra strikes, and they carry nothing. Rod: Aggro +25; a few Shock, flat (2), on a foe for each hit it lands on the Rod.
- **Code:** 10. The Squall as today's The witch-blade aims a swing at every foe holding a debuff, for Shock alone, at a third. The Rod's Shock is a reaction to a hit taken.
- **Serves:** Storm 2 ●●●, Barrage ●●, Toll ●● ⚙ resonance (key), red rain (half), goad (half)
- **Notes:** New. Today's legendary The storm front, which struck the healthiest other foe, goes. Seen: against six foes a wide spell is back in under half its time, and one swing prints a number on every charged foe. The Squall's extra hits add no Shock themselves: the Thunderhead's spells and the Rod's attackers charge the field for it. With the same rule on its robes, a Thunderhead takes a fifth off a foe: under *Loops*.

### The pack
- **Is:** formation · rare
- **Card:** The pack takes them one at a time. **Lead:** While no foe is Marked, its hits Mark their target. A hit on several foes Marks the first it lands on. **Packmate** (two seats): Its hits on a Marked foe deal half again as much.
- **Numbers:** Lead: Marked, at its own length. Packmate: +50% on its hits against a Marked foe, whoever Marked it.
- **Code:** 1. The Lead as today's The pack's, under the no-foe-Marked test; the Packmates as today's Gravemark's boost.
- **Serves:** Hunt 2 ●●● ⚙ judge's drum (half)
- **Notes:** Today's The pack, from legendary to rare. The Lead Marks only while no foe is Marked (one Mark from gear), and loses the 5 ticks off its cooldowns, which was never seen. The Packmates, empty today, get the line's half again. Half again is the top of `loot.md`'s narrow range, on a condition the formation makes itself.

### Toll gate
- **Is:** formation · rare
- **Card:** Whatever strikes the gate pays the other two's toll. **Gate:** Draws far more. Guarded when each fight starts. **Collector** (two seats): A foe that hits the Gate gains whatever statuses this seat's basic attacks add to their target with every swing, in the stacks one swing adds. One that waits for a crit, a first hit or a count doesn't pass, and neither does one its swing borrows from another unit. Where both Collectors would add a status from one source, it's added once. What's added this way is never carried or spread again.
- **Numbers:** Gate: Aggro +25; Guard, at its own length. Collector: each rider's own word, read off the Collector's stat, once from each Collector for each hit the Gate takes.
- **Code:** 12.
- **Serves:** Toll 2 ●●●, Snap ●●, Storm ●●, Cuts ●●, Bonfire ● ⚙ frozen gate (key), goad (half), red rain (half)
- **Notes:** New. Seen: a Hexer behind the Gate lays about three Chill on every foe that strikes it, so a foe shatters on its fourth or fifth blow on the wall, and with two frost Collectors on its second or third. A Collector whose swing adds nothing does nothing, so both seats read who sits in them, and the card says how. Round 1's ruling stands behind the card: a Collector passes only what every swing adds. Two sentences on the card go a step past its words, and are under *Challenges*: one source laid once, and no borrowed rider through the Gate.

### The stage
- **Is:** formation · rare
- **Card:** Everything the other two cast brings the Soloist's spells round. **Soloist:** Each ability another ally casts takes a fifth off the cooldowns it has left. **Conductor:** Its abilities come round a third faster. **Well:** Draws far more. Whenever the Soloist finishes a cast, the Well gains a Shield: a tenth of the Well's max HP.
- **Numbers:** Soloist: what's left on each of its abilities' cooldowns ×0.8, for each ability another ally casts. Conductor: Cooldown +33. Well: Aggro +25; a Shield of 10% of its own max HP for each ability the Soloist casts (500 on a Knight).
- **Code:** as today's Relay's Spender (an ally's cast moves this seat's cooldowns), by a share of what's left; the Well's Shield is a reaction to a named seat's cast.
- **Serves:** Barrage 2 ●●●, Toll ●
- **Notes:** New. A fifth of what's left is worth most on a long cooldown: with an ally casting every six ticks, a 40-tick spell is back in about 26 and a 14-tick one in about 12. So the seat wants the Soloist's slowest spell, which is the line's point, and I've left the number as the line gives it. The Well's Shield is about one swing's worth a cast, so the wall's grey bar steps up under each spell's name.

### Blood oath
- **Is:** formation · rare
- **Card:** One bleeds for power, one drinks, one pours life into the bleeder. **Bleeder:** Loses a little HP every tick: half a hundredth of its max HP, never below 1 HP. It isn't damage, so no Shield soaks it. Its hits deal half again as much. **Drinker:** Lifesteal, high. What its Lifesteal would heal past full becomes a Shield on it. **Donor:** Its heals and Shields on the Bleeder are doubled.
- **Numbers:** Bleeder: 0.5% of its max HP a tick, a fifth of its bar over 40 ticks; +50% on its hits. Drinker: Lifesteal high (20%); the whole part past full, as Shield, up to the Shield's cap. Donor: +100% on the heals and Shields it gives the unit in the Bleeder seat; a Regen it gives stays an ordinary Regen.
- **Code:** as today's Blood oath. The Drinker's Shield as today's Phylactery turns healing past full into a Shield, for its Lifesteal's healing; the Donor's Shields as Earthmother totem's larger ones, aimed at one seat.
- **Serves:** Pact 2 ●●●, Landslide ● ⚙ brink (key), red stone (key)
- **Notes:** Today's Blood oath, changed as the line says: the Drinker's Lifesteal goes to high and what it wastes becomes a Shield, and the Donor doubles Shields as well as heals. The Bleeder is today's, number for number. Its loss is a drain in the spine's words, not a price: nothing that answers an ally paying HP answers it. It is a crossing, by round 1: a piece that watches for an ally dropping below half or a third fires when the drain takes the Bleeder there (*Loops*). At today's size the Bleeder is the party's lowest by share from the first tick, which is what the gifts read, but it reaches half only in a long fight or under fire: under *Least sure*.

### Decoy
- **Is:** formation · rare
- **Card:** Two lurk in the dark; one stands in the light. **Light:** Taunts and is Guarded when each fight starts. **Shadow** (two seats): Hidden when each fight starts, and again each time a foe falls. Someone always stands in the light: Hidden never lands where it would leave the foes no ally to pick, and if the Light falls while both Shadows are hidden, the later Shadow steps out.
- **Numbers:** Taunt, Guard and Hidden, each at its own length (`STATUS.hidden` is 10 ticks). "The later Shadow" is the last in seat order, as Hidden's own rule has it.
- **Code:** none new: the Light as Hearth's Keeper; Hidden on a foe's fall as today's Night's edge hides its wearer on a kill. "Someone stays in the light" is Hidden's rule, for the vocabulary.
- **Serves:** Toll ●●, Hunt ●●, Pact ● ⚙ two in the dark (key)
- **Notes:** New. Seen: two names fade on the first tick and every blow goes to the third. Against a pack the falls come often enough to cover most of a fight; against a lone boss it's ten ticks and then nothing, so the hidings that don't wait for a fall are what it needs there. Round 1's rule is on the card because this formation is where a player meets it. At gate 2 the director closed its gap: when nobody is left in the light, the last in seat order steps out of hiding.

### Vigil
- **Is:** formation · rare
- **Card:** Nobody falls alone. **Sentinel:** When an ally falls, it Taunts and is Guarded. **Chaplain:** An ally it revives comes back Guarded, behind a Shield of a quarter of that ally's max HP. **Watcher:** When an ally falls, it gains a Shield: a quarter of its max HP.
- **Numbers:** Sentinel: Taunt and Guard, at their own lengths. Chaplain: Guard, and a Shield of 25% of the revived ally's max HP. Watcher: a Shield of 25% of its own max HP.
- **Code:** reactions to an ally's fall as today's Pyre of heroes' Survivor; the Chaplain reads the `revived` event's reviver.
- **Serves:** net
- **Notes:** Today's Vigil paid its Mourners while an ally was down, which wants a fall; it goes, and the name stays. Sized as protection: in play every revive inside a fight was followed by a second fall, so the returned come back under Guard and a quarter of a bar, half of what the legendary robes give. The Chaplain does nothing unless its sitter can revive, by an ability or a piece, and the card says so by saying "it revives".

### The wheel
- **Is:** formation · rare
- **Card:** Every so often the wheel turns, and each unit takes the next seat's part. **Wall:** Draws more. Defense up. **Blade:** Basic attacks a fifth faster. Crits more. **Well:** Regains MP in fights. Heals on it are stronger.
- **Numbers:** A turn every `COOLDOWN.short` (22 ticks), the first after half of one. Wall: Aggro +13, Defense +1,250. Blade: Attack speed +20; Crit chance +3.5 points (`critSt(1)`). Well: MP regen +3,750, one seat step; healing it receives +20%.
- **Code:** as today's The wheel.
- **Serves:** exotic
- **Notes:** Today's The wheel, word for word and number for number: an exotic kept for its own sake. What's seen is the turn, three icons changing places. The parts themselves are small, and "crits more" is one the player won't see; I've left them, since the line keeps today's words.

## Legendary

### The mountain
- **Is:** formation · legendary
- **Card:** While the whole party's stone holds, the Peak's blows land twice. **Peak:** While every ally holds a Shield, itself included, each blow it lands, swing or ability, lands a second time: the same damage again on the same foe, at once. Nothing repeats the second landing. **Foothill** (two seats): Starts each fight behind a Shield: a fifth of its max HP. Every Shield it gains, that one included, is a third bigger.
- **Numbers:** Peak: the second landing is as `fill/shared.md` rules it: the first hit's damage again, with no new dodge or crit roll; a hit, so a wound pays, Lifesteal drinks and counters count; it carries none of the first hit's statuses. Foothill: a Shield of 20% of its own max HP, Vanguard's size; +33% on every Shield it gains.
- **Code:** 16. The Foothill's larger Shields as today's Earthmother totem's, on one seat.
- **Serves:** Landslide 3 ●●● ⚙ detonation (half)
- **Notes:** Today's The mountain (a Peak that Taunts, Foothills that hit a third harder while it stands) goes; the name and the seat names stay. The Peak gets no Shield from its seat, so it has to bring one: the seat reads who sits in it, and "itself included" says so. Three Shields have to stand at once, and one bite breaks a small Foothill's, so the doubling comes and goes with the stone: that's the far end's ask. A Peak holding a weapon that also lands its blows twice lands three: each repeats the first once. The Foothill's Shield is a seat's start-of-fight effect.

### The whetstone
- **Is:** formation · legendary
- **Card:** Every hit the party lands sharpens the next. **Blade** (all three seats): Nothing of its own. **The party:** The party keeps one count of Cuts (a Cut for each hit it lands, kept for the fight, up to 25), and every ally's hits add to it. Every ally's hits start a fifth softer, and deal 3% more for each Cut.
- **Numbers:** −20% on every ally's hits, and +3% a Cut added to that. Cuts climb to 25 (`fill/shared.md`): even at 7 Cuts, +55% at 25.
- **Code:** 15.
- **Serves:** Cuts 3 ●●●, Storm ●●
- **Notes:** New. Three units reach seven Cuts in the first ten ticks or so and the full count by the middle of a regular fight, sooner with fast weapons, extra strikes and hits on many foes. Under it the party's count is each unit's count, so a piece that reads its wearer's Cuts reads the party's, as `fill/shared.md` has it. The softer start is what it gives up for being the whole party's. In the bracket, "it" is the party.

### The forge
- **Is:** formation · legendary
- **Card:** The longer the fire is kept, the faster the party feeds it. **Forgehand** (all three seats): Nothing of its own. **The party:** While any foe burns, every ally gains a Heat every 4 ticks (each acts 5% faster in everything for each Heat, up to 10, for the rest of the fight). Whenever an ally is Stunned or Silenced, the foe with the most Burn gains many Burn.
- **Numbers:** one Heat an ally every 4 ticks while any foe holds Burn ("every few ticks", by round 1), to Heat's own 10: the full count after 40 burning ticks. Many Burn, flat (7), each time an ally gains Stun or Silence.
- **Code:** the Heat as today's Kindled robes' pulse, on every ally. The Burn is a reaction to an ally gaining Stun or Silence, as today's Gaol's Turnkey hears a foe's.
- **Serves:** Bonfire 3 ●●●
- **Notes:** Today's The forge (Heat as damage, a Slow at the start) goes; the name stays, and Heat is speed now. A regular fight ends near the full count and a short one at half. Heat is given, not counted, so a unit that also wears the robes gains two a beat. Against a Silence that falls on all three, the second rule fires three times at once. With nothing burning, "the foe with the most Burn" is a foe picked by draw: it's fire a seat sends, not a blow, so a Mark doesn't take it (round 3, as round 2 rules for a piece). The card's bracket says "each acts", since every ally gains the Heat, and "every 4 ticks", as Kindled robes does.

### The long winter
- **Is:** formation · legendary
- **Card:** Every shatter sends its cold down the line, and each sends more than the last. **Winterer** (all three seats): Nothing of its own. **The party:** When a foe's Chill shatters, every other foe gains a few Chill, and a few more for each Cascade the party held before it (a Cascade for each shatter this fight, up to 10).
- **Numbers:** 2 Chill, flat, and 2 more for each Cascade: the first shatter of a fight sends 2, the second 4, the sixth 12, which is a cap on its own. Cascade climbs to 10 (`fill/shared.md`), so 22 at most.
- **Code:** 9, 15, 23.
- **Serves:** Snap 3 ●●● ⚙ firecracker (key)
- **Notes:** New. Seen: the first shatters send little, so a warm field stays warm; by the third, a field already at 8 or more goes in one string. The damping of a chain is Chill's own rule, in fractions of a stack by round 1, and isn't on the card. Against a lone foe the formation does nothing at all: under *Least sure*. The chain it makes is under *Loops*.

### Eye of the storm
- **Is:** formation · legendary
- **Card:** The storm doesn't lift. **Bolt:** Its abilities deal 3% more for each Shock the foes hold. The Shock stays. **Squall** (two seats): Nothing of its own. **The party:** Every ally's basic attacks add a few Shock, for the whole fight.
- **Numbers:** Bolt: +3% on its abilities' damage for each Shock stack on any foe: +120% when one foe holds the cap of 40. The party: a few Shock, flat (2), on each basic attack that lands.
- **Code:** 18. The party's Shock as Thunderstorm's rider, with no end.
- **Serves:** Storm 3 ●●● ⚙ held charge (key), lead's colour (half)
- **Notes:** New. "All fight" here is the formation's own rule, always on: nothing is laid again, so it isn't the spine's bend. The rider is under half a Stormcaller's own storm a swing, and adds to it: the two are different sources. The Bolt counts the foes' Shock alone, as round 1 rules "on the field". Sized to the link: a charge at its cap more than doubles the Bolt's spell.

### Open season
- **Is:** formation · legendary
- **Card:** Every kill calls the party's weapons down again. **Hunter** (all three seats): Nothing of its own. **The party:** While no foe is Marked, the foe with the lowest current HP is Marked. When each fight starts, and whenever a Marked foe falls, every ally's next basic attack comes at once. A swing already called gains nothing from a second call.
- **Numbers:** Marked, at its own length, and laid again the moment no foe holds one. "At once": each ally's basic attack is made ready.
- **Code:** 19, 1, 23. The volley as today's Pack leader's coat.
- **Serves:** Hunt 3 ●●●, Landslide ●●, Bonfire ● ⚙ judge's drum (key)
- **Notes:** New. Nothing to size: "at once" on a slow weapon is a whole swing. At the first tick every foe is full, so the Mark falls on the smallest, which is the opening that clears the weak. The Mark is the formation's, one for the party, not a unit's. The whole rule is the party's, not an ally's gear or seat, so nothing that makes start-of-fight effects happen again calls its opening volley. A kill by a called swing is a kill, and calls the next. A foe that falls un-Marked, to a wide spell or a status, calls nothing.

### The palisade
- **Is:** formation · legendary
- **Card:** One is struck, two profit, more with every blow. **Wall:** Taunts all fight: its Taunt is laid again each time it runs out. Holds Spite (a Spite for each hit it takes, kept for the fight, up to 20). **Reaper** (two seats): Its hits deal 4% more for each Spite the Wall holds.
- **Numbers:** Wall: Taunt at its own length, renewed; one Spite a hit taken, to 20 (`fill/shared.md`). Reaper: +4% a Spite, +80% at the full count.
- **Code:** 15. "All fight" as today's `TAUNTS_ALL_FIGHT`.
- **Serves:** Toll 3 ●●●, Landslide ●
- **Notes:** New. A swarm fills the count by the middle of a fight; a boss that lands eight blows gives each Reaper about a third more by the end. The count is the Wall's own, so anything else on the Wall that reads Spite reads the same number, and if the Wall falls the count goes with it.

### The cathedral
- **Is:** formation · legendary
- **Card:** Two voices give all their mana to one, and it never stops singing. **Soloist:** Its first-slotted ability has no cooldown: it's cast again whenever there's the MP for it. Its wind-up, its cost and whatever it waits for stay. **Voice** (two seats): All MP it would regain in a fight goes to the Soloist instead, and isn't sent on again. Each cast the Soloist finishes gives this seat a Shield: a twentieth of its max HP.
- **Numbers:** Soloist: no cooldown on the ability first in its order; a cast takes its wind-up and its recovery, 3 to 10 ticks. Voice: all of what it would gain, from MP regen, Clarity, a gift or a hit; a Shield of 5% of its own max HP a cast.
- **Code:** 21. The Voices' MP is beyond the list (end of file).
- **Serves:** Barrage 3 ●●● ⚙ mana as armour (half), crescendo (half)
- **Notes:** New. Seen: a Firebolt every five ticks empties a Pyromancer's pool in about forty, which is the line's picture. The Voices keep the pools they bring and can't refill them in a fight: that's what the formation gives up. What they pass on flows in over time, so by the spine's words it isn't a gift. The Shield is small because the casts come back to back: ten casts are half a bar. A self-buff or a Taunt slotted first is cast until the pool is gone: under *Least sure*.

### The covenant
- **Is:** formation · legendary
- **Card:** Life is the party's one currency. **Sworn** (all three seats): Nothing of its own. **The party:** Every ally's abilities cost HP in place of MP: half the share of its max HP that they'd cost of its max MP. No ally casts one that would leave it below a tenth of its max HP. Every ally has Lifesteal, high.
- **Numbers:** the price is half of (the ability's MP cost ÷ the unit's max MP) × its max HP: a Pyromancer's Fireball is 13% of its bar, a Knight's Fortify a sixth, a Monk's Pressure point or a Frostweaver's Blizzard about a fifth. The floor at a tenth is today's Blood covenant's. Lifesteal high (20%).
- **Code:** 20, as today's Blood covenant, on every ally.
- **Serves:** Pact 3 ●●●, Barrage ●● ⚙ blood mage (key), brink (half)
- **Notes:** New: today's amulet as the party's rule, with Lifesteal for all. The price is "pays HP" in the spine's sense, so whatever answers an ally paying answers every cast, and a cast paid in HP is paid for. The floor is in the line now. The Lifesteal is high, as round 1 rules. The price is half the share, as the director rules at gate 2: after Defense a Fireball costs about 263 and drinks back about 130 a foe, so it's even on two foes and ahead on three, and a Chain lightning costs about 283 and drinks back about 390 from three.

### Twins
- **Is:** formation · legendary
- **Card:** Two are bound; what one gives itself, the other has too. **Twin** (two seats): Whatever status it gives itself, the other Twin gains too, in the same stacks: a status laid on it at a moment (a Taunt, a Haste, a Shield, a counter a card gives), not a state it holds while something is true of it. A status passed on this way isn't passed on again. **Odd one out:** Attack up two steps.
- **Numbers:** the copy is the same status at the same stacks or pool, at its own length. Odd one out: Attack +2,500.
- **Code:** 13.
- **Serves:** exotic ⚙ borrowed gift (key), two in the dark (half)
- **Notes:** New. "Gives itself" is as round 1 rules it: Hidden, Taunt, Haste, Might, Guard, a Shield, Regen, Clarity, Aegis and a counter a card gives pass; a state held while something is true (a Lifesteal doubled below half, a draw while healthy) doesn't. So a Twin's Vanish hides both, its Taunt makes both Taunt, a Shield it builds by hitting is built on both, and its Heat quickens both. Hidden's own rule holds for the copy: it doesn't land if it would leave the foes no ally to pick. Attack +2,500 is the largest plain stat on any seat.

## Challenges

Round 1 ruled on the rest. Round 2 ruled on five of these, marked below and applied above. One is left, the seat names, which goes to the director's list.

- *Ruled in round 2: both sentences stand.* **Toll gate: two sentences that go a step past the ruling on carrying.** Both are on the card, and both are mine.
  - *One source, laid once.* The ruling says a carrier doesn't add a rider its own swing already holds from the same source. On the Gate there are two carriers and one foe: under a storm on the whole party each Collector's swing holds the storm's Shock, and by the card's first sentence each would lay it. I wrote that it's laid once a hit.
  - *No borrowed rider through the Gate.* The ruling says borrowed riders aren't passed on, and names a third unit copying them. A Collector holding Mimic wand isn't a third unit; it's the borrower. I wrote that what its swing borrows doesn't pass, by the ruling's first sentence. Read the other way, the Gate lays a whole second unit's riders.
- *Ruled in round 2: the cup counts a Regen's pulse past full.* **Shared cup and a Regen.** Round 1 says a Regen's pulses aren't a heal, and that no card reading its wearer's heals reads them unless it names Regen. The cup reads healing an ally receives, which the ruling doesn't quite reach. I applied the ruling: a pulse past full isn't sent on. If "nobody's healing is wasted" should cover it, the card names Regen. Red stone mail, in armor, meets the same question.
- *Ruled at gate 2: when nobody is left in the light, the last in seat order steps out of hiding. Decoy's card says so.* **Decoy when the Light falls after the Shadows have hidden.** "Someone stays in the light" stops Hidden landing. It doesn't lift a hiding already held, and Hidden can't be removed. So if the Light falls with both Shadows hidden, the foes have no ally to pick for up to ten ticks. It's Hidden's own rule to settle; the same is true of any party that hides two beside one who can fall.
- *Ruled in round 2: as written, so it passes.* **Twins and a debuff a unit lays on itself.** The ruling's list of what "gives itself" covers is all buffs and counters. Burning heart's fire is a status its wearer's gear lays on it at a moment, which fits the ruling's first words and isn't in its list. The card's sentence follows the first words, so by the card it passes. If it shouldn't, the card says "a buff or a counter".
- *Ruled in round 2: no mismatch. "Lifesteal, high" is the fill's size for the line's words.* **The spine's line for The covenant** still reads "Every ally has Lifesteal", and round 1 rules that high stands. My card says "Lifesteal, high". One of the two needs the word.
- **The same seat name is a different rule in each formation:** Soloist in three, Well in four, Breaker, Hammer, Anvil, Squall, Blade, Opener, Lead, Warden and Wall in two or three. They're builds.md's role names, and each card says what its own seat does; a player who learns "Soloist" from Wellspring will still have to read The cathedral's. Not ruled in round 1.

## Links

For each engine this share touches: the size on my side, and what the other side has to be.

- **The shield detonation** (The mountain, half). A Foothill starts behind a Shield of about 27% of its max HP (a fifth, a third bigger), 530 to 1,330, and every later Shield on it is a third bigger. "The most that Shield held" reads the pool at its highest, the third included, so the break is a blow on its own. The two pull apart on purpose: the Peak pays while the stone holds, the break when it goes.
- **The frozen gate** (Toll gate, key; Shieldwall, half). Each hit on the Gate lays one swing's worth of each Collector's rider: about three Chill from a Hexer, so a shatter on a foe's fourth or fifth blow, and a boss within a fight only with two frost Collectors. A Collector's rider keeps the size its own card gives it for a swing. Shieldwall gives the anchor's piece its draw: Aggro +25.
- **The mirror** (Shieldwall, half). The Wall's two steps of Defense turn a 1,600 blow into about 800, so half the blow is cover. A mirror that sends back a share of the whole blow reads it. One that sends back what a Shield soaked and an Aegis blocked doesn't count plain Defense, so for that one the Wall's part is only the draw.
- **The goad** (Storm front and Toll gate, halves). A called swing on the Rod costs its foe two more Shock and pays out all it holds; on the Gate it costs one swing's worth of both Collectors' riders. Neither seat Taunts, so the totem's holder needs a Taunt of its own, from its kit or its amulet; the blade needs nothing, since the foe it calls most likely picks the Rod or the Gate.
- **The held charge** (Eye of the storm, key; Squall line, half). The Bolt reads 3% for each Shock the foes hold: +120% at one foe's cap. The party's rider is two stacks a swing, about 0.8 a tick on a lone foe, so a held foe needs most of a boss's pause, or other riders beside it, to reach the cap. Squall line charges two foes a swing for two stacks each. The other side is whatever holds a foe still.
- **The reckoning** (Hammer and anvil, key; Heavy line, half). Wrath is `fill/shared.md`'s: a fifth a stack, to ten. My seat adds one a hit the Anvil takes. Heavy line's Hammer makes its sitter the party's slowest swinger, which is who the plate legendary aims its Wrath at. One hit is one Wrath, whichever of the three counts it.
- **The judge's drum** (Open season, key; Heavy line and The pack, halves). Nothing to size on the call. Heavy line gives the swing worth calling: two and a quarter times, with seven Might at the start. The pack gives the Mark the horn waits for, and its Packmates' half again on the judged foe. Every other call in the party is "at once", so none stacks with Open season's.
- **The fuse** (Pyre line, key). All of a fallen foe's Burn, to the foe with the highest current HP. The feeders' aim at the most Burn is what follows it there. Where another mover is held, the fire is split evenly.
- **The avalanche** (Heavy line, half). The Hammer's first swing is about three plain swings: on a Hoplite's great weapon, several thousand onto a 2,000-HP wolf. The other side reads what's left over, and by round 1 it lands as a hit that isn't boosted again and carries no riders.
- **The red rain** (Squall line, Storm front and Toll gate, halves). Squall line's swing lands on two foes; Storm front's Squall on every charged foe for a third of a swing, about 250, which three Bleed already out-pay. Toll gate passes Bleed only from a rider that every swing adds. The other side is wounds on the whole field.
- **The riposte** (Skirmish line, half). Evasion medium on all three, and a Shield of a tenth of max HP a dodge. The formation gives no draw, so the dodger needs one from elsewhere, and the answering swing is the other share's.
- **The lead's colour** (The standard, key; Hoarfrost line and Eye of the storm, halves). The Followers add the Lead's riders at the riders' own words, off their own stats, so three weapons lay three times the status. The other side is one rider on the Lead, sized by its kind's swing. Hoarfrost line's and the Eye's riders are a status on a swing that the wand can copy.
- **The blood mage** (The covenant, key). The price is half the cost's share of the pool, in HP, as the director rules at gate 2; Lifesteal is high. After Defense, a Pyromancer's Fireball pays about 263 and drinks back about 130 a foe, so it's even on two and ahead on three; a Stormcaller's Chain lightning pays about 283 and drinks back about 390 from three. A Frostweaver's Blizzard pays about 650 and drinks back about 70 a foe, so it never pays. The other side is one wide spell on a hard hitter.
- **The resonance** (Storm front, key). A tenth of the cooldown a foe: twice as fast at five foes, five times at eight. Resonant robes should be the same size, since one unit can hold both and they add to a fifth.
- **The crescendo** (The cathedral, half). The formation gives the repetition: ten casts of one spell in under a minute of ticks, so a Crescendo count fills in one fight, the first cast plain. It gives no free casts, so with the charm the price climbs unbroken and the Voices' mana is all that pays it.
- **Mana as armour** (Wellspring and The cathedral, halves). Wellspring's gifts are a tenth and a twentieth of the Soloist's pool, 115 to 380 at a time, each about a blow where damage comes out of MP one for one. In The cathedral the same mana is the spell's fuel, so the armour and the song spend one pool.
- **The shatter bell** (Icefall, key). The Breaker's first-slotted ability, whole, at every shatter. The other side is shatters on a beat: the formation's own Rime and Sleet.
- **The firecracker string** (The long winter, key). Two Chill to every other foe, and two more for each shatter before it. It needs the first shatters from elsewhere, and a field already cold; its damping is code 23's, in fractions.
- **The brink** (Blood oath, key; Shared cup and The covenant, halves). The Bleeder is the lowest by share from the first tick, and the Donor doubles what it gives it; a doubled Cure is a hundred ticks of the drain, so the cover outlasts what reaches it. Shared cup sends full allies' healing to the lowest ally that can be healed, all of it, and passes by a unit capped at half. The covenant holds units low by its prices.
- **Two in the dark** (Decoy, key; Twins, half). Hidden for ten ticks at the start and at each fall: most of a pack fight, a sixth of a boss fight. The hidings that don't wait for a fall are the other side. A Twin's hiding hides both Twins, at the same length, while the Odd one out stands to be picked.
- **The red stone** (Blood oath, key). The Drinker's Lifesteal is 20%, so a full Drinker's 800 swing adds 160 Shield, to the cap. Nothing else is needed; whatever reads a Shield reads this one.
- **The borrowed gift** (Twins, key). The copy is the same stacks at the status's own length, for a status laid at a moment or a counter a card gives. The other side is any kit with a gift to itself.

## Loops

- **Icefall's Breaker on a Frostweaver with Blizzard slotted first.** A shatter readies Blizzard, which lays Chill on every foe; with Meltwater orb the shatter pays for the cast. The spine's known loop. Brakes: the wind-up, and the cold each shatter spends.
- **The resonance twice on one unit:** Storm front's Thunderhead in Resonant robes. A fifth off a foe, so five foes make the spell ready as it lands. Brakes: its wind-up and recovery, the pool (which Recharge refills by the foe), and the pack thinning.
- **The covenant with Bloodstone reliquary in the party:** every price one unit pays is healed onto another, so the party's casts cost it nothing in sum. Brakes: cooldowns and wind-ups, which nothing here shortens. A size.
- **The cathedral with the mana price gone:** The deep well while the Soloist holds Clarity, Flagellant's vestments with Lifesteal, The chalice. The spine's known loop. Brakes: wind-up and recovery, 3 to 10 ticks a cast, and the floor at a tenth of HP where the price is life.
- **The long winter's string.** Each shatter passes cold on, and at five Cascades what it passes is a cap on its own. Its brake is the damping, which the card never states. Round 1 closed the hole I reported: damped in fractions of a stack, the string dies down in any pack, beside Glacier's heart too. Before it does, each foe bursts several times, at 3,000 a burst.
- **Open season's kills.** A Marked foe falls, three swings land at once, and the next falls; a kill by a called swing is a kill. Brake: a foe that survives the volley, and the foes running out. "At once" doesn't stack, so the horn and the coat add no second volley at the same moment; Swift justice's Condemn, once it's cast again, calls a later one.
- **A piece that fires start-of-fight effects again, over the seats.** Second dawn at every fall, Overture coat at its wearer's kills: a Keeper's Taunt and Guard, a Stoker's Haste, a Loader's seven Might, a Gate's Guard, a Foothill's Shield, a Shadow's hiding. Each happens once a fall, whoever calls for it. Brake: the foes run out. First light and Open season are the party's rules and aren't fired again.
- **The Bleeder's drain as a crossing.** Round 1 makes "drops below half" a crossing whatever took the unit there, a drain included, and "whenever" fires at each new crossing. Blood oath's Donor lifts the Bleeder with doubled heals and the drain takes it back down, so a piece that answers an ally dropping below half or a third (a Guard, a Taunt, an Aegis, a hiding) fires each time. Brake: each crossing needs a heal big enough to lift it back over the line, and the answers refresh or fizzle, they don't stack. It turns over at the healer's pace, not the drain's.
- **Twins, a dodge that Taunts, and the goad.** One Twin dodges and Taunts, the other Taunts with it and its totem calls every foe's swing, and the swings bring more dodges. The spine's known loop, through the Twin seats. Brake: a round with no dodge.
- **The goad on the Rod or the Gate.** Each Taunt calls every foe's swing onto a seat that charges or marks them for it. Brake: the Taunt's own cooldown; a call doesn't stack.
- **Not loops, checked:** The mountain's second landing beside another repeat (three landings, no more); The forge's Heat (speed doesn't bring more Heat; it stops at ten); The stage (the Soloist's casts shield the Well and bring nothing round); Shared cup, the Voices' mana and Twins (each sent on once); Hammer and anvil under a called swing (Wrath stops at ten); Wellspring (mana moves, no cooldown does); Hoarfrost line's Breaker with a weapon that Stuns (the Stun is over before a slow weapon swings again). A Mark from a seat no longer calls the Paladin's Writ, which answers Condemn alone.

## Code support beyond the spine's list

- **A rule the party holds once.** Today a formation's party effect is a status on each ally, so "when a foe's Chill shatters" or "when a Marked foe falls" would fire three times. The long winter, Open season, The forge's second rule, Shared cup and The whetstone's count each need a rule that fires once for the party. Open season's Mark needs one applier for the party, so it's one Mark.
- **The first-slotted ability** for Icefall's Breaker, as Bell of the hour reads it: no new support.
- **Every MP gain of one unit sent to a seat** (The cathedral's Voices). Today's Leech idol sends on only what's past full.
- **Healing past full, told apart by its source** (Blood oath's Drinker: its Lifesteal's alone). The `overhealed` event names a kind only when an action healed.
- **A pick that passes by an ally that can't be healed** (Shared cup): at full, or at a cap on its healing.
- **Amounts read off another seat's unit:** the Warden's max HP for a heal on the Anchor, the Barb's Attack for damage on the Anchor's attacker, the Soloist's max MP for a gift to it, the Wall's Spite for a Reaper's boost. The last is in 15; I haven't checked the others against `PRIMITIVES.md`.
- **A test that every ally holds a Shield,** read each time the Peak lands a blow (The mountain).

## Least sure

- **Hoarfrost line in a pack.** Two Frost seats at two Chill a swing shatter a lone foe and not a spread pack. With its aim the Breaker now pays on every Stun, so the seat is sound; the frost seats are still the road's first step, and may still read as they did in play: frost that climbs and never breaks.
- **Spur's Opener is plain Crit chance.** Twenty points on a seat is a stat, so it has no "four in five at most" of its own, where round 1 gives one to the cards that raise a crit by a lot. A unit that multiplies its own chance passes four in five with it and one crit piece: a Geomancer behind stone doubles 41 points to 82, a Paladin's Verdict triples 30 to 90. None of them is the Ranger, whose loop the ceiling guards, and the Ranger in the seat stands near 41. It's the question the lead has already flagged for the director: whether plain Crit chance has a ceiling.
- **The covenant's sums.** Ruled at gate 2: half the share. Pools are sized to last two or three fights, so one cast is 7% to 43% of a pool and half that of the bar: a Knight's Fortify is a sixth of its bar, a Monk's Pressure point and a Valkyrie's Choosing about a fifth. The price still falls hardest on the units whose skills are cheapest in mana, because their pools are small, and a wall's skills drink back almost nothing. Most units can pay for four to six casts a fight.
- **A slow kind's rider, carried.** Round 1 rules the carrier takes each rider whole. A mace's many Burn is sized to a swing every 11 ticks; behind The standard a dagger lays it every 5.6, and on the Gate it's laid as often as the pack bites. A player would be glad to find it. It's also two or three times what the rider was sized to do, which is the balance pass's.
- **Two fifths that may be under what's seen.** Spur's Blades (the line's number) and Wellspring's Soloist (mine, for a line that says only "faster"). A fifth off a 30-tick cooldown is 5 ticks, and play never saw a few ticks. Both formations rest on their other seat.
- **Blood oath's Bleeder doesn't "ride low" on its own.** Today's drain takes a fifth of a bar in a regular fight. It's the lowest by share at once, which the gifts need, and it gets to half only over two fights unhealed or under fire. A drain twice the size would show the line's picture; I kept today's because the line didn't change it.
- **The party-rule legendaries.** The whetstone, The forge, The long winter, Open season and The covenant have three plain seats, so nothing in them asks who sits where. Play fought in formations whose seats had roles. The spine names this already; writing them didn't change my mind.
- **The long winter does nothing against a lone foe,** and late in a pack fight every shatter is a cap for every other foe. It's the widest swing in the share between its worst fight and its best.
- **The cathedral.** A self-buff or a Taunt slotted first is cast until the pool is empty, since a status that refreshes counts as doing something. The pool carries into the next fight, and the Voices can't refill theirs. It may read as a formation that spends a run's mana in one fight.
- **The mountain asks for three Shields at once** and gives the Peak none. A small Foothill's Shield is one bite. It may be on for the first ten ticks and rarely after, unless the party is already a stone party, which is the point and also a narrow door.
- **Thorn hedge's two sizes are mine,** with no word of the scale behind them: 3% of max HP and a twentieth of Attack. Chosen to sit beside Thorns' own number.
- **The forge's many Burn is seven.** It covers a swing-feeder's Stun. A caster Silenced for 16 ticks misses a cast or two of about sixteen Burn each, so for the unit the rule most wants to cover it's under half.
- **Twins' Odd one out** is Attack +2,500, more than half again on most units, for a seat with no rule. The line's number; the largest plain stat in the share.
- **Vigil with no reviver** has one seat that does nothing, and the other two wait for a fall the party hopes not to see. It's the net, sized as protection, and may be owned and never fought in, as First light was.
- **Hunting party's Mark hops.** It lasts 14 ticks, and when it runs out the Marker's next swing picks at random and names a new foe. That's Marked's length, already on the director's list; this is where a player meets it first.
- **Squall line's seat is the Stormcaller's Arc at half size,** on two units. No rule is broken: nothing in the vocabulary is one class's. It's the nearest any seat comes to handing out a passive.
- **Seats that read as a piece's card does,** allowed by the ruling, listed so they can be seen together: Heavy line's Hammer and Millstone; Hoarfrost line's Breaker and Icebreaker; Decoy's Shadow and Shadow cloak; Storm front's Thunderhead and Resonant robes, and its Rod and Static mail; Pyre line's Keeper and Emberguard; Icefall's Breaker and Floe charm; The forge and Kindled robes; The mountain's Peak and Twinfall; The covenant and Flagellant's vestments; Blood oath's Drinker and Red stone mail; Twins and Twin-knot; Hammer and anvil and The anvil. The seats' stacks are flat where the on-struck pieces read Defense, so the Rod and the Keeper differ from their pieces in size.
