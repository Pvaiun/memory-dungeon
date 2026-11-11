# The fill: weapons, the other six kinds

Bow, rune sword, hammer, mace, staff and great weapon: 53 pieces (12 commons, 18 uncommons, 14 rares, 9 legendaries), in the spine's order. Every number is a first value.

How the cards here are worded, so the whole share reads one way:
- **"Basic attack"** where a line of the spine says "swing", as today's cards have it. The spine's own phrases keep their words ("carrying what the swing carries", "a heavier swing").
- **"(from Attack)"** is the wearer's Attack. Where another unit is in the sentence, the card says "its wearer's".
- **"The MP a cast cost"** is the MP its wearer paid for it: a free cast, or one paid in HP, cost no MP (Spellbinder, Brimming blade, Shepherd's staff). "Paid for" is the ruling's: in MP or in HP (Staff of echoes).
- **The signature stat comes first** on every piece. A common on one step takes the first stat its row names; where that would make a kind's two commons the same, the second takes the row's other stat (Short bow, Barrow blade).

## Bow

### War bow
- **Is:** bow · common
- **Card:** Nothing beyond its stats.
- **Stats:** Crit damage medium (1 of 1)
- **Numbers:** none beyond the step (`SPECIAL.crit_damage.medium`).
- **Code:** none
- **Serves:** the Hunt (Crit damage)
- **Notes:** A new name: neither of today's bow commons carries this step (Recurve bow is Attack, Yew bow Crit chance).

### Short bow
- **Is:** bow · common
- **Card:** Nothing beyond its stats.
- **Stats:** Attack speed medium (1 of 1)
- **Numbers:** none beyond the step (`SPECIAL.attack_speed.medium`).
- **Code:** none
- **Serves:** Thousand Cuts (Attack speed)
- **Notes:** A new name. Its row names Crit damage and Attack speed; on one step it takes Attack speed and leaves the signature to War bow.

### Broadhead bow
- **Is:** bow · uncommon
- **Card:** Its wearer's crits add many Bleed to the foe they land on (from Attack).
- **Stats:** Crit damage medium · Crit chance +1 (2 of 2)
- **Numbers:** many: `STACKS.many` through `own()`, from its wearer's Attack: about 9 stacks at Attack 4, 7 at Attack 3. Bleed keeps its own numbers (`STATUS.bleed`).
- **Code:** as today's Broadhead bow, at the word many.
- **Serves:** Cuts 1 ●●, Hunt ● ◆ swing-status
- **Notes:** Today's card with "a few" made "many", as the line says. Any crit counts, an ability's too, as today. Seen: a wound of 9 pays more on the next hit than the arrow that opened it. Crit chance is here because the crit is its trigger. A Ranger's arrows crit about one in five, so it opens about one wound a regular fight; a Bard's crit far less often.

### Opening shot
- **Is:** bow · uncommon
- **Card:** Its first basic attack of each fight comes at once and always crits.
- **Stats:** Crit damage medium · Attack +1 (2 of 2)
- **Numbers:** no amount of its own. "At once": its first basic attack is ready as the fight starts. The crit is a crit's own size: half again, plus Crit damage.
- **Code:** as today's Drawn steel.
- **Serves:** Hunt 1 ●●, Barrage ● ⚙ opening again (half)
- **Notes:** Today's Drawn steel's card, on a bow. Both steps make the one arrow bigger: about 2,000 on the first tick for a Ranger, nearly twice its usual arrow. It's a start-of-fight effect, so the opening again's pieces make it happen again: the next arrow comes at once and always crits, one arrow each time.

### Frostbite bow
- **Is:** bow · uncommon
- **Card:** Its basic attacks add several Chill (from Attack).
- **Stats:** Crit damage medium · Attack speed medium (2 of 2)
- **Numbers:** several: `STACKS.several` through `own()`, from Attack: about 5 a hit at Attack 4, 4 at Attack 3, against a cap of 12 (`STATUS.chill.cap`).
- **Code:** as today's Frostbite bow, without its Sunder, at the word several.
- **Serves:** Snap 1 ●● ⚙ lead's colour (half) ◆ swing-status
- **Notes:** Today's rare added a few, and Sunder past 8 Chill; the line makes it an uncommon that adds several and nothing else. It reads as Sleet blade does; no unit holds both. Seen: each arrow is a third or more of the way to a shatter. Its size against the kits is under *Least sure*.

### Huntsman's bow
- **Is:** bow · rare
- **Card:** While no foe is Marked, its basic attacks Mark their target. Its wearer's hits on a Marked foe deal a third more.
- **Stats:** Crit damage medium · Crit chance +1 · Attack +1 (3 of 3)
- **Numbers:** a third more: +33% on its wearer's hits, basic attack or ability, against a foe that holds Marked, whoever Marked it. Marked at its own length (`STATUS.marked`).
- **Code:** as today's Huntsman's bow; the Mark is laid only while no foe is Marked, as today's Gravemark lays its own.
- **Serves:** Hunt 2 ●●●
- **Notes:** Today's card with "while no foe is Marked" added, by the one-Mark ruling. Today's stats kept. The Mark isn't laid again while it stands, so it runs out at its own length and the next arrow lays a new one wherever it lands.

### Volley bow
- **Is:** bow · rare
- **Card:** Every third basic attack its wearer makes is a volley: it also looses an arrow at every other foe, each a hit of the basic attack's size, carrying what the swing carries. The volley's arrows aren't basic attacks: they aren't counted, and nothing looses them again.
- **Stats:** Crit damage medium · Attack speed medium · Attack +1 (3 of 3)
- **Numbers:** a count of 3, of basic attacks made (a dodged arrow still counts). Each volley arrow is a hit of the basic attack's size, so it takes whatever shape its wearer's basic attacks have (Millstone's, a seat's): about 990 at Attack 4 before Defense. Each can be dodged and can crit, on its own roll. What it carries includes what a status its wearer holds puts on its swings (a Thunderstorm). The arrows are extra hits with their own name, not extra strikes: nothing that reads extra strikes reads them.
- **Code:** as today's Volley bow (a count of basic attacks, a strike at every other foe); 12 for what the arrows carry; 23 for the mark that nothing repeats them.
- **Serves:** Cuts 2 ●●●, Hunt ●, Storm ●, Barrage ● ⚙ red rain (half), reaping (half) ◆ wide-hit
- **Notes:** Today's legendary opened each fight with a volley, then every fifth; the line makes it every third with no opening volley, as a rare. The arrows are what the spine calls "strikes with its weapon". The count should show as a number on the unit, since a count is what the player is meant to see; today's sits on the sheet. Attack speed brings the third round sooner: at about tick 18 to 21, then every 23 ticks, so one volley in a short fight and two or three in a long one.

### Executioner's longbow
- **Is:** bow · legendary
- **Card:** Its basic attacks ignore Taunt, and deal more the less HP their target has: a quarter more below three quarters of its HP, half again as much below half, three quarters more below a quarter, and double below a tenth.
- **Stats:** Crit damage high · Crit chance +1 · Attack +1 (4 of 4)
- **Numbers:** +25%, +50%, +75% and +100% below 75%, 50%, 25% and 10% of the target's max HP, on basic attacks only.
- **Code:** as today's Executioner's longbow.
- **Serves:** Hunt 3 ●●●
- **Notes:** Kept: today's card and sizes. Crit chance takes the place of today's Attack speed, the Hunt's lean. For a Ranger its first clause adds nothing: Hunter's eye already ignores Taunt.

## Rune sword

### Runed saber
- **Is:** rune sword · common
- **Card:** Nothing beyond its stats.
- **Stats:** MP regen +1 (1 of 1)
- **Numbers:** none beyond the step (`MP_REGEN_STEP`).
- **Code:** none
- **Serves:** Barrage (MP regen)
- **Notes:** Today's, as it is.

### Barrow blade
- **Is:** rune sword · common
- **Card:** Nothing beyond its stats.
- **Stats:** HP +1 (1 of 1)
- **Numbers:** none beyond the step (`HP_STEP`).
- **Code:** none
- **Serves:** Cold Snap, and the Toll's wardens (HP)
- **Notes:** A new name: today's Cairn blade carries MP. Its row names MP regen and HP; on one step it takes HP and leaves the signature to Runed saber.

### Sleet blade
- **Is:** rune sword · uncommon
- **Card:** Its basic attacks add several Chill (from Attack).
- **Stats:** MP regen +1 · HP +1 (2 of 2)
- **Numbers:** several: `STACKS.several` through `own()`, from Attack: about 4 a hit at Attack 3 (the Frostweaver), 5 at Attack 4 (the Stormcaller).
- **Code:** as today's Sleet blade, at the word several.
- **Serves:** Snap 1 ●●● ⚙ lead's colour (half) ◆ swing-status
- **Notes:** Today's adds one Chill; the line makes it several. The second hit of the Stormcaller's Arc isn't a basic attack, so it adds none. HP is the careful step: the road's first step never costs the party its safety.

### Sigil blade
- **Is:** rune sword · uncommon
- **Card:** When each fight starts, its wearer gains a Shield of a third of its max MP.
- **Stats:** MP regen +1 · MP +1 (2 of 2)
- **Numbers:** a third of its wearer's max MP, read as the fight starts: about 770 on a pool of 2,300, and 1,100 with this piece's own MP step. It goes into the Shield pool, under its cap (`STATUS.shield.capShare`).
- **Code:** as today's Sigil blade.
- **Serves:** Barrage ●, Landslide ● ⚙ detonation (half), opening again (half)
- **Notes:** Today's is a fifth, about 460: one weak blow takes it before it's seen. A third takes a blow or two, and is a blow worth seeing when it breaks. Changed for that reason alone. The MP step feeds its own Shield.

### Wellblade
- **Is:** rune sword · uncommon
- **Card:** Each basic attack it lands restores a tenth of its wearer's max MP.
- **Stats:** MP regen +1 · Cooldown medium (2 of 2)
- **Numbers:** a tenth of its wearer's max MP for each basic attack that lands: 230 on a pool of 2,300.
- **Code:** as today's Glint wand (MP to its wearer), on each basic attack landed.
- **Serves:** Barrage 1 ●●, Storm ● ◆ free-cast
- **Notes:** New. In play, Clarity once a fight (a quarter of a pool) was never seen. Four swings a fight here give back two fifths of a pool, a tenth at a time on the blue bar. Arc's second hit isn't a basic attack. What a unit gives itself isn't a gift, so Glimmer robe doesn't read it.

### Winter's chain
- **Is:** rune sword · rare
- **Card:** When a foe's Chill shatters, the other foe with the most Chill gains half the Chill the shattered foe held.
- **Stats:** MP regen +1 · HP +1 · Cooldown medium (3 of 3)
- **Numbers:** half of what the foe held as it shattered, which is the cap (`STATUS.chill.cap`): 6 today. Any foe's shatter counts, whoever laid the Chill. With no other foe chilled it goes to a random other foe, by draw: it's cold a piece sends, not a blow, so a Mark doesn't take it, as round 2 rules. With no other foe, nothing happens.
- **Code:** 9 (a share of a shattered foe's cold laid on another foe); 23 (the chain's damping, in fractions of a stack).
- **Serves:** Snap 2 ●●● ⚙ firecracker (key)
- **Notes:** Today's legendary laid a few on every other foe; the line makes it half the cold on one foe, as a rare. The damping of a chain is Chill's own rule and isn't on the card. Half is the link's size exactly: a neighbour already halfway shatters at once, a warm one doesn't.

### Frostward blade
- **Is:** rune sword · rare
- **Card:** Foes that hit the ally with the highest Aggro gain several Chill (from its wearer's Attack).
- **Stats:** MP regen +1 · HP +2 (3 of 3)
- **Numbers:** several: `STACKS.several` through `own()`, from its wearer's Attack: about 4 at Attack 3, 5 at Attack 4, for each hit that lands on that ally: each hit of a multi-hit, and an Area's hit on it. A dodged hit gives nothing.
- **Code:** as today's Hoarfrost plate, answering hits on another unit as today's Heartwood mail does. Picking "the ally with the highest Aggro" is new (*Code support beyond the spine's list*).
- **Serves:** Toll 2 ●●●, Snap 2 ●● ⚙ frozen gate (key)
- **Notes:** New. Several, as round 2 rules and the line now says: at a few a foe shattered on its fifth or sixth blow, and the frozen gate's link asks for "within a few". The ally can be its own wearer. A Taunting ally with less Aggro than another gets nothing from it: the line reads Aggro, not who is being struck. The size against the link is under *Links*.

### Spellbinder
- **Is:** rune sword · rare
- **Card:** After each ability its wearer casts, its next basic attack deals double, and when it lands its wearer regains half the MP that ability cost it. A second cast before the swing takes the first's place; it doesn't add to it.
- **Stats:** MP regen +1 · Cooldown medium · MP +1 (3 of 3)
- **Numbers:** double: +100% on that one basic attack. Half of the MP its wearer paid for the latest ability. A dodged swing spends it and gives nothing back.
- **Code:** as today's Spellbinder; the refund reads what the cast paid, as today's Brimming blade reads it.
- **Serves:** Barrage 2 ●●●, Storm ● ◆ free-cast
- **Notes:** Today's card, plus the refund the line adds. Today's stats kept. Arc's second hit isn't doubled. Half of a Blizzard or a Chain lightning is 325 to 500 MP in one step: seen.

### Brimming blade
- **Is:** rune sword · legendary
- **Card:** Each hit of an ability its wearer casts deals extra damage equal to the MP that cast cost it. A cast that cost no MP adds none.
- **Stats:** MP regen +2 · MP +1 · Cooldown medium (4 of 4)
- **Numbers:** the MP paid for the cast, added to each of its hits before boosts and Defense. At today's costs (`classes.ts`): +450 on a Frost lance, +650 on each foe a Chain lightning strikes, +1,000 on every foe under a Blizzard.
- **Code:** 20 (damage from the MP an ability cost).
- **Serves:** Barrage 3 ●●●
- **Notes:** Only the name is today's. An ability that deals no damage gains nothing. Whatever raises a price raises the blow (Crescendo charm, Archmage's mantle), and whatever makes a cast free takes the blow away: power follows fuel.

### Glacier blade
- **Is:** rune sword · legendary
- **Card:** Its party counts Cascades (a Cascade for each shatter this fight, up to 10). Its wearer's abilities deal a fifth more, and add a fifth more Chill and Shock, for each Cascade.
- **Stats:** MP regen +1 · Cooldown high · HP +1 (4 of 4)
- **Numbers:** a fifth (20%) for each Cascade, on its abilities' damage and on the Chill and Shock stacks they add. Cascade as `fill/shared.md` has it: the party's one count, to 10, so triple at the top.
- **Code:** 15 (Cascade, the party's count); a boost by a counter's stacks on an ability's damage and on the stacks it adds is beyond the list.
- **Serves:** Snap 3 ●●●, Storm ●
- **Notes:** New. A fifth matches what a stack of Crescendo or Wrath is worth, so the counters read alike. Shock a storm puts on allies' swings isn't its abilities' stacks. The chain's damping doesn't reach it: this is Chill from spells.

## Hammer

### War hammer
- **Is:** hammer · common
- **Card:** Nothing beyond its stats.
- **Stats:** Defense +1 (1 of 1)
- **Numbers:** none beyond the step (`STEP`).
- **Code:** none
- **Serves:** Landslide (Defense)
- **Notes:** Today's, as it is.

### Horseman's hammer
- **Is:** hammer · common
- **Card:** A lighter swing.
- **Stats:** a lighter swing · HP +1 · Aggro +1 (2 of 2)
- **Numbers:** the swing a step lighter (`SWING_TRADE`); the steps as gear has them (`HP_STEP`, `AGGRO_STEP`).
- **Code:** none
- **Serves:** the Toll (HP, Aggro)
- **Notes:** Today's, as it is. A common that steps along the trade: its card is the trade's words and nothing more.

### Warden's hammer
- **Is:** hammer · uncommon
- **Card:** Its basic attacks deal extra damage equal to a tenth of its wearer's Defense.
- **Stats:** Defense +1 (1 of 1)
- **Numbers:** a tenth of its wearer's Defense on each basic attack, added before boosts: +500 at Defense 5, on a swing of about 1,140.
- **Code:** as today's Warden's hammer.
- **Serves:** Landslide 1 ●●, Toll ● ◆ heavy-blow
- **Notes:** Kept. Today's adds about three quarters of this (a tenth for every 16 ticks, cut to the hammer's interval); a flat tenth a swing is easier to read and a little bigger, so it's seen. A Guard adds 300 to each swing while it lasts.

### Mason's hammer
- **Is:** hammer · uncommon
- **Card:** Each basic attack it lands gives its wearer a Shield of half the damage dealt.
- **Stats:** Defense +1 (1 of 1)
- **Numbers:** half the damage the basic attack dealt, after its target's Defense. It goes into the Shield pool, under its cap.
- **Code:** as today's Shieldmaiden passive (a Shield from a hit's damage), on basic attacks, at half.
- **Serves:** Landslide 1 ●●, Toll ● ⚙ detonation (half) ◆ shield-by-doing
- **Notes:** Today's gave a tenth of Defense on every hit; the line makes it a share of the damage, on each swing. Half: one swing's Shield takes about one weak blow, so the bar is seen to grow. The Valkyrie's quarter is on every hit of a fast unit; a hammer lands one blow in twelve ticks.

### Bellringer
- **Is:** hammer · uncommon
- **Card:** A lighter swing. Every third basic attack it lands Stuns its target.
- **Stats:** a lighter swing · Defense +1 · HP +1 (2 of 2)
- **Numbers:** a count of 3, of basic attacks landed. Stun at its own length (`STATUS.stun`). A target that's already Stunned, or a boss that's immune, takes none, and the count starts again.
- **Code:** a count of basic attacks as today's Volley bow keeps; a Stun on a weapon's hit as today's Worldbreaker lays.
- **Serves:** Landslide ●, Snap ●, Storm ● ⚙ held charge (half), emptied quiver (half) ◆ held
- **Notes:** Today's rare Stunned a foe in a wind-up; the line makes it a count, as an uncommon. The lighter swing is my choice: its promise is the Stun, not the blow, and the step it buys sets it apart from the kind's other two uncommons. Undone, it's Defense +1 at the kind's own swing. The third lands at about tick 29 to 33: one Stun in most regular fights, two in a long one.

### Grudgebearer
- **Is:** hammer · rare
- **Card:** Each hit its wearer takes gives it a Wrath (its next basic attack deals a fifth more for each Wrath, up to 10, and spends them).
- **Stats:** Defense +1 · Aggro +1 (2 of 2)
- **Numbers:** Wrath as `fill/shared.md` has it: its holder's next basic attack deals a fifth more for each and spends them all, to 10, so triple at the top. A hit counts when it lands, whether a Shield or an Aegis took it.
- **Code:** 15; as today's Grudgebearer, with Charge renamed Wrath and a fifth a stack where today's is a tenth.
- **Serves:** Toll 2 ●●●, Landslide 2 ●●● ⚙ reckoning (key) ◆ heavy-blow
- **Notes:** Today's legendary, as a rare. The line's second sentence is the bracket: Wrath's one wording. Aggro is the step that fills the count.

### Mountainfall
- **Is:** hammer · rare
- **Card:** Its basic attacks deal extra damage equal to a fifth of its wearer's max HP.
- **Stats:** Defense +1 · HP +1 (2 of 2)
- **Numbers:** a fifth of its wearer's max HP on each basic attack, added before boosts: +1,100 on a wall with 5,500 HP, nearly doubling the swing.
- **Code:** as today's Mountainfall.
- **Serves:** Landslide 2 ●●●, Toll ●●, Pact ● ◆ heavy-blow
- **Notes:** Kept: today's card and size, as a rare. The HP step feeds its own blow. Beside Warden's hammer the choice is by wearer: the Geomancer's Defense makes the uncommon its bigger blow, and the two HP walls take this one.

### Cornerstone hammer
- **Is:** hammer · legendary
- **Card:** Its basic attacks deal extra damage equal to half of all the Shield its party holds, its wearer's own included. The Shields stay.
- **Stats:** Defense +2 · Crit damage medium (3 of 3)
- **Numbers:** half of the sum of every ally's Shield pool as the swing lands, added before boosts. Each pool is capped at half its holder's max HP, so three full pools on a stone party are 5,000 to 6,000, and the blow gains 2,500 to 3,000.
- **Code:** 18 (reading the party's whole Shield).
- **Serves:** Landslide 3 ●●●, Pact ●
- **Notes:** Today's Cornerstone maul read half its wearer's own Shield; this keeps the half and reads the party's, on a hammer. With no Shield in the party it's a plain hammer with three steps. Defense feeds the Shields that Earthen shell lays.

## Mace

### Morningstar
- **Is:** mace · common
- **Card:** Nothing beyond its stats.
- **Stats:** HP +1 · Defense +1 (2 of 2)
- **Numbers:** none beyond the steps (`HP_STEP`, `STEP`).
- **Code:** none
- **Serves:** the Toll (HP, Defense)
- **Notes:** Today's, as it is.

### Friar's mace
- **Is:** mace · common
- **Card:** Nothing beyond its stats.
- **Stats:** HP +1 · MP regen +1 (2 of 2)
- **Numbers:** none beyond the steps (`HP_STEP`, `MP_REGEN_STEP`).
- **Code:** none
- **Serves:** Blood Pact, and Barrage's font (HP, MP regen)
- **Notes:** Today's, as it is.

### Censer mace
- **Is:** mace · uncommon
- **Card:** Its basic attacks add many Burn (from Attack).
- **Stats:** HP +2 · Defense +1 (3 of 3)
- **Numbers:** many: `STACKS.many` through `own()`, from Attack: about 9 a hit at Attack 4 (the Paladin), 7 at Attack 3 (the Cleric), 5 at Attack 2 (the Bramble knight). Burn keeps its own numbers (`STATUS.burn`).
- **Code:** as today's Spark wand, at the word many.
- **Serves:** Bonfire 1 ●●●, Toll ● ⚙ lead's colour (half) ◆ swing-status
- **Notes:** Only the name is today's. The steps are the keeper's: the fire's first step that costs no safety. On a Paladin the Burn is a debuff, so its own mace turns Judgement on. Its size against the Pyromancer is under *Least sure*.

### Mender's mace
- **Is:** mace · uncommon
- **Card:** Every so often, the ally with the lowest share of max HP is healed for a fifth of its wearer's max HP.
- **Stats:** HP +2 · MP regen +1 (3 of 3)
- **Numbers:** every so often is the short cooldown word (`COOLDOWN.short`), counted from the fight's start. A fifth of its wearer's max HP: 600 from a Cleric, 1,000 from a Paladin, 1,200 from a Bramble knight, each with this piece's two HP steps.
- **Code:** an effect on a beat, as today's Warding bell.
- **Serves:** Pact 1 ●●, Toll 1 ●● ⚙ brink (half) ◆ lowest-ally
- **Notes:** Today's gave a Regen at the start; the line makes it a heal on a beat. The beat doesn't wait: with everyone full it lands on any ally, as healing past full. A fifth, because the beat comes once or twice a regular fight and has to be seen when it does. HP feeds its own heal.

### Penitent's mace
- **Is:** mace · uncommon
- **Card:** Each hit its wearer takes heals the ally with the lowest share of max HP for 2% of its wearer's max HP.
- **Stats:** HP +1 · Defense +1 · Thorns medium (3 of 3)
- **Numbers:** 2% of its wearer's max HP for each hit that lands on it: 110 from a Bramble knight, 90 from a Paladin, 50 from a Cleric.
- **Code:** as today's Penitent's mace, sized from its wearer's max HP where today's reads the damage taken.
- **Serves:** Toll 1 ●●, Pact ●
- **Notes:** Today's rare healed a tenth of the damage; the line makes it a little from max HP, as an uncommon. The ally is often the wearer itself. Its size against a swarm is under *Least sure*.

### Saint's mace
- **Is:** mace · rare
- **Card:** Each time its wearer heals an ally, that ally's next hit deals extra damage equal to half the heal. Heals that come before that hit add up.
- **Stats:** HP +1 · MP regen +2 · Cooldown medium (4 of 4)
- **Numbers:** half the heal's size as it was given, the part past full included, added to the healed ally's next hit that lands, before boosts. A Cure of about 1,050 is +525 on that hit. One hit takes it all: the first that lands, on one foe.
- **Code:** beyond the list: a heal's size carried onto the healed ally's next hit. Today's Battle prayer carries one onto the healer's own basic attack.
- **Serves:** Pact 2 ●●●, Landslide ●●
- **Notes:** New. "An ally" includes its wearer. A heal is one its wearer's ability or gear gives; a Regen's pulses are the status's own and aren't counted, as ruled (*Least sure*). The Cleric's Battle prayer version pays the healer's own swing; this pays the healed.

### Anchorite's mace
- **Is:** mace · rare
- **Card:** Its wearer's heals on the ally with the highest Aggro are doubled.
- **Stats:** HP +2 · Defense +1 · MP regen +1 (4 of 4)
- **Numbers:** double: +100% on any heal its wearer's ability or gear gives to that ally, its wearer included if it's the one. A Regen and a Shield keep their own sizes.
- **Code:** a boost on heals by who receives them, as today's Blood oath's Donor seat; the pick by Aggro is new (*Code support beyond the spine's list*).
- **Serves:** Toll 2 ●●●, Pact ●●
- **Notes:** New. A Regen isn't a heal, so beside a Bramble knight's own Regrowth it reads nothing (*Least sure*).

### Martyr's mace
- **Is:** mace · legendary
- **Card:** Its basic attacks deal more the lower its wearer's HP: half again as much below 70% of its HP, double below half, two and a half times below a third, and triple below a tenth. Below a third of its HP, each one that lands also heals its wearer for the damage dealt.
- **Stats:** HP +2 · Defense +1 · MP regen +2 (5 of 5)
- **Numbers:** +50% at each of four lines: below 70%, 50%, 33% and 10% of its wearer's max HP. The heal is the damage the basic attack dealt, after Defense, while its wearer is below a third.
- **Code:** as today's Martyr's mace, with its 30% lines at a third.
- **Serves:** Pact 3 ●●● ⚙ brink (half)
- **Notes:** Kept: today's card and stats. The 30% lines move to a third, the line's word, so it meets the brink's other pieces where they fire. The heal rights its wearer: one swing below a third carries it back above the line.

### Noonday mace
- **Is:** mace · legendary
- **Card:** Each basic attack it lands on a burning foe gives every ally a Heat (each acts 5% faster in everything for each Heat, up to 10, for the rest of the fight).
- **Stats:** HP +2 · Defense +2 · Cooldown medium (5 of 5)
- **Numbers:** one Heat to each ally, its wearer included, for each basic attack that lands on a foe holding Burn. Heat as `fill/shared.md` has it: 5 in each of Attack speed, Cooldown and Cast speed a stack, to 10.
- **Code:** Heat as `fill/shared.md` redefines it (today's is damage a stack); a counter given to every ally on a hit against a foe that holds a status is as today's Hunter's skull gives Heat, on a new trigger.
- **Serves:** Bonfire 3 ●●●, Toll ●
- **Notes:** New: it takes the place of today's Sunhammer, and does something else. The mace lays no fire itself: it wants the party's, or its wearer's own (the Paladin's Smite, a kite shield that burns what strikes it). One Heat a swing is the line's size; what that comes to is under *Least sure*.

## Staff

### Rowan staff
- **Is:** staff · common
- **Card:** Nothing beyond its stats.
- **Stats:** Cast speed medium · Cooldown medium (2 of 2)
- **Numbers:** none beyond the steps (`SPECIAL.cast_speed.medium`, `SPECIAL.cooldown.medium`).
- **Code:** none
- **Serves:** Barrage (Cast speed, Cooldown)
- **Notes:** A new name: neither of today's staff commons carries these steps.

### Willow staff
- **Is:** staff · common
- **Card:** Nothing beyond its stats.
- **Stats:** Cast speed medium · MP regen +1 (2 of 2)
- **Numbers:** none beyond the steps (`SPECIAL.cast_speed.medium`, `MP_REGEN_STEP`).
- **Code:** none
- **Serves:** the healers, and Barrage's well (Cast speed, MP regen)
- **Notes:** A new name, for the same reason.

### Shepherd's staff
- **Is:** staff · uncommon
- **Card:** Each ability its wearer casts gives the ally with the least MP half the MP that ability cost it.
- **Stats:** Cast speed medium · Cooldown medium · MP regen +1 (3 of 3)
- **Numbers:** half of the MP its wearer paid for the cast: 225 from a Cure or a Firebolt, 500 from a Fireball or a Blizzard. A free cast gives none.
- **Code:** as today's Brimming blade's gift (a share of a cast's cost to the ally with the least MP), at half.
- **Serves:** Barrage 1 ●● ⚙ mana as armour (half) ◆ free-cast
- **Notes:** Today's gave a Clarity at the start; the line makes it a gift on every cast. The ally can be its wearer, and what it gives itself isn't a gift. Half: a healer's four casts a fight send on about 900 MP, two of a soloist's small spells or most of a great one, the size Barrage's links ask for. Beside Spellbinder it's under *Least sure*.

### Canopy staff
- **Is:** staff · uncommon
- **Card:** When each fight starts, its wearer and the other ally with the least max HP each gain a Shield of a quarter of its wearer's Attack.
- **Stats:** Cast speed medium · MP regen +1 · HP +1 (3 of 3)
- **Numbers:** a quarter of its wearer's Attack, on each of the two: 750 at Attack 3, 1,250 at Attack 5, each under its holder's own Shield cap.
- **Code:** as today's Canopy staff, at a quarter.
- **Serves:** net, Barrage ●, Landslide ● ⚙ opening again (half), detonation (half)
- **Notes:** Kept: today's card and stats. Today's is about an eighth of Attack, 360 from a Cleric: gone under one blow, unseen. A quarter is about a third of a frail unit's health bar. Changed for that reason alone.

### Vesper staff
- **Is:** staff · uncommon
- **Card:** Each ability its wearer casts heals the ally with the lowest share of max HP for a tenth of its wearer's Attack.
- **Stats:** Cast speed medium · Attack +1 · MP regen +1 (3 of 3)
- **Numbers:** a tenth of its wearer's Attack for each ability cast: 400 from a Cleric with this piece's Attack step, 600 from a Pyromancer. About a third of a Cure, with every spell.
- **Code:** as today's Prior's mace (a heal on each cast), aimed at the ally with the lowest share of max HP and sized from Attack.
- **Serves:** Pact 1 ●●, Toll ● ⚙ brink (half) ◆ lowest-ally
- **Notes:** New. The Attack step feeds its own heal, and the Cleric's Cure with it.

### Ritual staff
- **Is:** staff · rare
- **Card:** Its wearer's abilities wind up half again as long, deal half again as much and add twice the stacks.
- **Stats:** Cast speed medium · Attack +2 · MP +1 (4 of 4)
- **Numbers:** wind-ups half again as long, taken before Cast speed shortens them; +50% on its abilities' damage; twice the stacks of any status its abilities add. Costs and cooldowns stay.
- **Code:** 21 (a change to how an ability is cast: a longer wind-up); the stacks as today's Banked staff's, at double and for every status; the damage as Archmage's mantle's.
- **Serves:** Bonfire 2 ●●●, Snap 2 ●●, Landslide ●, Barrage ●
- **Notes:** New. A doubled Firebolt is 26 Burn at the Pyromancer's own Attack, and about 36 with this piece's two Attack steps. A doubled Frost lance is 9 Chill at the Frostweaver's own Attack, and about 15 with the steps: a shatter from nothing (*Least sure*). I read a passive's stacks (Stoke's) as not the ability's, so not doubled. Heals aren't in the line, so a Cleric gets only the longer wind-ups (*Least sure*).

### Evensong staff
- **Is:** staff · rare
- **Card:** Each ability its wearer casts makes the next one cast in a moment, with no wind-up. An ability cast that way doesn't do the same for the one after it.
- **Stats:** Cast speed medium · Cooldown medium · MP +1 · MP regen +1 (4 of 4)
- **Numbers:** no amount: every other cast has no wind-up. Its cost, cooldown and recovery are as usual. It's kept until used, within the fight. A cast repeated by another effect neither uses it nor grants it.
- **Code:** 21 (every other cast with no wind-up).
- **Serves:** Barrage 2 ●●●, Bonfire ●●, Snap ●●, Pact ●
- **Notes:** New. The order of the abilities decides what it's worth: a quick spell slotted ahead of the great one takes the great one's wind-up away. A cast with no wind-up can't be lost to a Silence.

### Staff of echoes
- **Is:** staff · legendary
- **Card:** Every ability its wearer casts is cast twice: the second follows at once with no wind-up, and is paid for as a cast of its own. If it can't be paid for, there's no second. The second is never cast again, by this or by anything else.
- **Stats:** Cast speed high · MP +2 · Cooldown medium (5 of 5)
- **Numbers:** no amount: one more cast for each cast, at its own full cost, paid in MP, or in HP where its wearer's abilities cost HP. Whatever made the first one free is used up by the first. Beside another repeater (the Bard's Encore), each repeats the first cast once: three in all. The second is a cast in every other way: what answers a cast answers it (Stoke, a robe's Shield), and what counts casts counts it (Crescendo, Matins robe).
- **Code:** 16 (a cast made twice). The second being paid for is new: today's repeats are free.
- **Serves:** Barrage 3 ●●●, Bonfire ●●, Snap ●●
- **Notes:** Today's Cataclysm staff repeated every third cast for free; the line makes it every cast, both paid. It empties a pool twice as fast, which is the build's cliff. Two MP steps are there for that.

## Great weapon

### Bardiche
- **Is:** great weapon · common
- **Card:** A heavier swing.
- **Stats:** a heavier swing · Attack +1 (1 of 1)
- **Numbers:** the swing a step heavier (`SWING_TRADE`); the step as gear has it (`STEP`).
- **Code:** none
- **Serves:** Landslide (Attack, in the heaviest swing)
- **Notes:** Today's, as it is.

### Halberd
- **Is:** great weapon · common
- **Card:** Nothing beyond its stats.
- **Stats:** Attack +1 · HP +1 (2 of 2)
- **Numbers:** none beyond the steps (`STEP`, `HP_STEP`).
- **Code:** none
- **Serves:** Landslide, and Blood Pact (Attack, HP)
- **Notes:** A new name: today's Poleaxe carries two steps of HP and no Attack.

### Roaring greataxe
- **Is:** great weapon · uncommon
- **Card:** Its wearer starts each fight with many Might (from Attack).
- **Stats:** Attack +1 · HP +1 · Crit damage medium (3 of 3)
- **Numbers:** many: `STACKS.many` through `own()`, from Attack: about 14 stacks on a Hoplite with this piece's Attack step, 11 on a Paladin, 9 on a Geomancer, under Might's cap (`STATUS.might`). Might keeps its own numbers: more damage a stack, one spent with each action.
- **Code:** as today's Roaring greataxe, at the word many.
- **Serves:** Landslide 1 ●●, Hunt 1 ●● ⚙ opening again (half), judge's drum (half) ◆ heavy-blow
- **Notes:** Today's card with "a few" made "many", as the line says. Today's stats kept. Seen: a Hoplite's first swing lands for about four fifths more, and on a unit that acts this seldom the Might lasts the fight.

### Giantsbane
- **Is:** great weapon · uncommon
- **Card:** Its basic attacks deal half again as much to a foe above half its HP.
- **Stats:** Attack +1 · HP +2 (3 of 3)
- **Numbers:** +50% on basic attacks against a foe above 50% of its max HP.
- **Code:** a boost by its target's HP, as today's Executioner's axe, turned round.
- **Serves:** Landslide 1 ●●, Hunt ●● ◆ heavy-blow
- **Notes:** New. The two HP steps make it Landslide's careful pick.

### Harvest scythe
- **Is:** great weapon · uncommon
- **Card:** When its wearer lands a killing blow, its next basic attack comes at once.
- **Stats:** Attack +2 · Crit damage medium (3 of 3)
- **Numbers:** no amount: "at once" readies its next basic attack. A second kill before that swing lands adds nothing: "at once" doesn't stack.
- **Code:** as today's Headsman's axe's answer to a killing blow.
- **Serves:** Hunt 1 ●●, Landslide ● ◆ kill-pays, heavy-blow
- **Notes:** New on this kind. Any of its wearer's hits can be the killing blow, an ability's too. "At once" on the slowest kind is a whole swing: nothing to size.

### Icebreaker
- **Is:** great weapon · rare
- **Card:** Its wearer's hits on a Stunned foe deal double.
- **Stats:** Attack +2 · HP +1 · Crit damage medium (4 of 4)
- **Numbers:** double: +100% on its wearer's hits, basic attack or ability, against a foe that holds Stun.
- **Code:** as today's Icebreaker.
- **Serves:** Snap 2 ●●●, Landslide 2 ●● ◆ held
- **Notes:** Kept: today's card, size and stats. The Breaker seat of Hoarfrost line doubles the same hits, and aims its unit's basic attacks at a Stunned foe besides; on one unit the two doublings add.

### Overrun
- **Is:** great weapon · rare
- **Card:** A heavier swing. What its wearer's killing blows have left over carries into a random foe, and on again each time it kills.
- **Stats:** a heavier swing · Attack +2 · Crit damage medium (3 of 3)
- **Numbers:** all of what the blow had left over. It's a hit on the foe it reaches: it meets that foe's Evasion and Defense and counts as a hit taken (a wound pays, Thorns answer); it isn't boosted or crit again, and it carries no riders. Each kill it makes carries what's left on, until a foe lives, a foe dodges or none is left. Beside Downhill charm on one unit, the left-over is split evenly between the two. The foe is picked as a target after the first is: by draw among the other foes, outside the Taunt rule, and a Mark doesn't take it, as round 2 rules.
- **Code:** 5 (damage carried past a kill).
- **Serves:** Landslide 2 ●●●, Hunt ●● ⚙ avalanche (key) ◆ heavy-blow
- **Notes:** New. Any of its wearer's hits can be the killing blow. The heavier swing is my choice: the piece wants a blow far bigger than what it lands on, and pays a step for it. The foe it carries into is picked at random, so how far a run goes is partly luck (*Links*).

### Thunderhead maul
- **Is:** great weapon · rare
- **Card:** Its wearer's hits deal 5% more for each Shock on their target. The Shock stays.
- **Stats:** Attack +1 · HP +1 · Crit damage medium · Aggro +1 (4 of 4)
- **Numbers:** 5% a stack on its wearer's hits, basic attack or ability: half again as much at 10 Shock, double at 20, triple at the cap of 40 (`STATUS.shock.cap`). About what Skyfall adds a stack to its own blow.
- **Code:** beyond the list: a boost by the stacks of one status on the target, on every hit. Today's Skyfall reads its target's Shock for one ability.
- **Serves:** Storm 2 ●●●, Landslide ●●, Snap ● ⚙ held charge (key) ◆ heavy-blow
- **Notes:** New. Its hits go where its wearer's hits go, not to the most charged: 5% a stack is sized so a foe with a middling charge already shows it. Aggro is for the unit that holds the field's attention while the others charge it.

### Worldbreaker
- **Is:** great weapon · legendary
- **Card:** Its basic attacks come half as often, deal triple, and Stun their target.
- **Stats:** Attack +2 · Crit damage high · HP +1 (5 of 5)
- **Numbers:** half as often: twice the interval between basic attacks. Triple: +200% on them. Stun at its own length.
- **Code:** as today's Worldbreaker. The Attack speed that shapes its swing counts no steps, as today.
- **Serves:** Landslide 3 ●●●, Snap ●● ⚙ held charge (half) ◆ heavy-blow, held
- **Notes:** Kept: today's card and sizes. HP takes the place of today's Aggro step: the hammer isn't the one meant to draw. On a Hoplite its shape adds to Phalanx's, as today.

### Twinfall
- **Is:** great weapon · legendary
- **Card:** Each hit its wearer lands, a basic attack's or an ability's, lands a second time a moment later: the same damage again, on the same foe. The second carries none of the first's statuses, and nothing repeats it.
- **Stats:** Attack +2 · HP +2 · Crit damage medium (5 of 5)
- **Numbers:** a moment is one tick, the line's own, which round 2 lets stand. In all else it's the ruling's hit that lands a second time: the same damage again on the same foe, with no new dodge or crit roll. It's a hit: a wound pays, Lifesteal drinks, counters count. If the foe has fallen, it's lost. An extra strike is a hit too, and lands twice. Beside another repeater (the Peak seat of The mountain), each repeats the first hit once: three in all.
- **Code:** 16 (a blow landed a second time). The tick between the two is new.
- **Serves:** Landslide 3 ●●●, Hunt ●●, Cuts ● ◆ heavy-blow
- **Notes:** New. The tick matters: a hit's own statuses land after it, so the second landing pays the wound the first one opened.

## Challenges

Round 1's and round 2's rulings are applied above. Round 2 ruled on all four of these, so none is open; each stays here with its ruling.

1. *Ruled in round 2: the moment stands, at one tick.* **Twinfall's line says "a moment later"; the ruling on a hit that lands a second time says "at once".** The card keeps the line's moment, at one tick, and takes everything else from the ruling. If "at once" is meant for Twinfall too, the card loses three words and the code loses the tick.
2. *Ruled in round 2: as written, by draw, and a Mark doesn't take it.* **Whether a Mark takes Overrun's carry.** The ruling makes the left-over a hit on the foe it reaches. It doesn't say how "a random foe" is reached. It's written as a target after the first: by draw among the other foes, outside the Taunt rule, and not taken by a Mark, as Arc's second hit is picked. If a Mark should take it, builds.md's "aimed at the weakest, it runs furthest" has a way to come true.
3. *Ruled in round 2: it doesn't; a Mark steers blows, not what a piece sends. The card's numbers say so now.* **Winter's chain's fallback follows the Mark,** by the letter of the ruling on a phrase's fallback. It's cold passed on, not a blow: flagged in case that ruling meant blows only.
4. *Ruled in round 2: a bracket may be worded to fit its card. Noonday mace's now reads "each acts".* **Heat's bracket says "it acts".** On Noonday mace the holders are every ally. The card uses the wording as given; "each acts" would read truer there.

## Links

- **The shield detonation** (common half). Sigil blade: a third of max MP at the start, 770 to 1,100. Canopy staff: a quarter of Attack on two units, 750 to 1,250 each. Mason's hammer: half of each swing's damage, about 450 to 600 a swing, up to the cap. The other side reads "the most that Shield held", ruled as the pool's highest point since the unit last had none: a bar that Mason's hammer builds swing by swing breaks for its full height. At these sizes Rubble plate's blow on every foe is seen with no multiplier.
- **The frozen gate** (keystone). Frostward blade: several a hit, from the mage's Attack: about 5 from a Stormcaller, 4 from a Frostweaver, as round 2 rules. Alone, a foe that only strikes the wall shatters on its third blow; any other cold on the field brings it sooner. That's the link's "within a few". Hoarfrost plate, on the wall itself, reads the wall's Defense; both in one party stack.
- **The held charge** (keystone and common half). Thunderhead maul: 5% a Shock, double at 20, triple at the cap. The link's "doubles at the cap or more" is met early, on purpose, since the maul doesn't aim at the most charged. The other side has to put about 20 Shock on a foe inside a Stun's 8 ticks, which is three units charging. Bellringer holds a foe at about tick 30, and again in a long fight; Worldbreaker holds one with every swing.
- **The reckoning** (keystone). Grudgebearer: Wrath at `fill/shared.md`'s size. A pack on its wearer fills all ten between two swings; a lone boss gives one or two. Beside a swing that comes half as often (Millstone, the Hammer seat), bites past the tenth are lost: the counter's ceiling is what binds, not the piece.
- **The reaping** (common half). Volley bow sinks every other foe by one arrow at about tick 20, and again every 23 ticks. That's still thin for a field "whose bars sink together": the execute's side needs foes an arrow or two from falling. It's the weakest of the engine's sinkers.
- **The judge's drum** (common half). Roaring greataxe: 9 to 14 Might. Each called swing spends one, so every call in a fight lands with half again or more. Nothing for the other side to size.
- **The opening, again** (common half). Sigil blade's Shield tops up to the cap each time; Roaring greataxe's Might refills to its cap; Canopy staff shields two; Opening shot's next arrow comes at once and always crits. No wearer of a staff or a great weapon wears Leather, so Overture coat never reaches Canopy staff or Roaring greataxe: only Second dawn does. Overture coat reaches Sigil blade on a Stormcaller, and Opening shot on a Ranger or a Bard.
- **The avalanche** (keystone). Overrun: all of the left-over, on while it kills, on a heavier swing. The link's "two or three more" needs a blow three times a small foe's HP, which the other side supplies (Phalanx, Millstone, Might). As ruled, the carry is a hit on the foe it reaches, so a dodge ends a run, and beside Downhill charm the left-over is split evenly. The carry picks by draw where builds.md says "aimed at the weakest, it runs furthest", and round 2 lets the draw stand.
- **The red rain** (common half). Volley bow's arrows are full swings, about 990 each. For Bleed to out-pay the arrow, as the link sizes it, each foe needs 9 stacks or more: a few on every foe won't do it, and many will.
- **The lead's colour** (common half). Frostbite bow and Sleet blade add several Chill, Censer mace many Burn, each sized to a swing that comes every 9 to 11 ticks. As ruled, the carrier takes each rider whole and reads its own Attack. So a Follower's dagger behind a Censer mace adds many Burn at a dagger's pace, and behind either frost piece several Chill. The link's "three weapons bring the second shatter" is met several times over (*Least sure*).
- **The emptied quiver** (common half). Bellringer makes one 8-tick window on one foe at about tick 30. The reading side (a Stunned foe's crits, Quick draw) needs its arrows on that foe, and a Ranger's arrows pick at random: it needs a Mark, or another holder of foes.
- **Mana as armour** (common half). Shepherd's staff: half a cast's cost, 225 to 500, to the ally with the least MP. The wearer of the orb or the idol has to be that ally to receive it; taking blows out of its MP mostly makes it so. A healer's casts send about 1,000 a fight, which is two or three blows not taken.
- **The firecracker string** (keystone). Winter's chain: half the cold, 6. It meets the link exactly. The other side has to hold a second foe at 6 or more: a Blizzard and a Stillness reach about 4, so it wants a rider or a third cast.
- **The brink** (common half). Mender's mace: a fifth of its wearer's max HP every 22 ticks. Vesper staff: a tenth of Attack a cast. Martyr's mace is the low unit's own power, and its heal lifts its wearer out from under a third with one swing. So the other side, the price or the drain that holds a unit low, has to outrun that heal, or the unit sits near half and deals double, not triple.

## Loops

- **Winter's chain with Glacier's heart, on one Frostweaver,** or with Splinters or Heart of winter. A shatter passes half its cold on, the next foe bursts and passes it back. Its brake is the damping of a chain, ruled in fractions of a stack (code support 23), and nothing else. Without that rule it doesn't end.
- **Glacier blade.** A shatter adds a Cascade, each Cascade adds Chill to its casts, more Chill brings more shatters. Brakes: Cascade's ceiling of 10, and each cast's cooldown and mana. A ramp, not a loop.
- **Noonday mace, and Censer mace under Kindled robes or The forge.** Heat quickens the swings that give Heat. Brake: Heat's ceiling of 10.
- **Opening shot with Overture coat and Quick draw, on a Ranger.** A kill makes the next arrow instant and a crit, and each crit calls the next arrow. As ruled, a kill by that arrow is a kill, and calls the opening again, once a kill. Brakes: an arrow that neither kills nor crits, and the foes running out. Harvest scythe and Overrun chain on kills the same way and stop the same way.
- **Volley bow with Quick draw.** A volley's arrows nearly always hold a crit, so each volley calls the next arrow at once. Brake: "at once" doesn't stack, so it's one arrow a volley.
- **Volley bow in the Torch seat of Hearth.** Each arrow adds a Burn to every burning foe: eight arrows on eight burning foes is 64 stacks from one swing. It doesn't repeat; it's a big meeting once every third arrow.
- **Wellblade with Bell of the hour, on a Stormcaller.** The spell on the swing's brake is mana, and the five swings the bell counts restore half a pool, more than the spell it casts costs. What's left as a brake is how fast it swings. Tireless bell, whose holder's swings never wait on its abilities, makes Wellblade pay through every cast.
- **Staff of echoes or Evensong staff in the Soloist seat of The cathedral.** The spine already lists the seat with its mana price gone. Evensong takes away every other wind-up as well; echoes doubles the mana spent. Brakes: mana and the recovery.
- **Staff of echoes under Resonant robes or Crescendo charm.** Both casts count for each, so the spell comes round twice as soon, or climbs twice as fast. Brakes: the pool emptying twice as fast, a thinning pack, Crescendo's ceiling.
- **Staff of echoes beside Encore, and Twinfall in the Peak seat of The mountain.** As ruled, each repeater repeats the first once: three casts, or three landings, and no more.
- **Shepherd's staff landing on its own wearer.** Each cast gives half its cost back when its wearer is the ally with the least MP. Each turn of it loses half, so it stretches a pool to twice its casts at most and never gains.
- **Cornerstone hammer with Mountain's crown; Mason's hammer with Bedrock.** A bigger Shield makes a bigger blow or a likelier crit, which rebuilds the Shield. Brake: the Shield's cap of half max HP.
- **Anchorite's mace with Heart of the saint, on an anchor in Sanguine mail.** Three doublings on one heal. Not a loop: a size.
- **Opened by the ruling on "gives itself": Twin-knot beside Grudgebearer or Noonday mace.** A counter a card gives its wearer is a gift to itself, so Twin-knot hands it on. Each bite on a Grudgebearer's wearer gives the other ally with the lowest share of max HP a Wrath too, and that ally's next swing lands for as much more. Under Noonday mace that ally gains two Heat a swing. Not a loop: each counter's ceiling holds.

## Code support beyond the spine's list

- **"The ally with the highest Aggro" as a standing pick,** read by a reaction to hits on that ally (Frostward blade) and by a boost on heals to it (Anchorite's mace).
- **A heal's size carried onto the healed ally's next hit** (Saint's mace). Today's Battle prayer carries one onto the healer's own swing.
- **A boost by the stacks of one status on the target, on every hit** (Thunderhead maul). Today Skyfall reads it for one ability.
- **A boost by a counter's stacks on an ability's damage and on the stacks it adds** (Glacier blade).
- **A repeat that's paid for** (Staff of echoes). Today's repeats are free.
- **A second landing a tick after the first** (Twinfall): a delayed hit of a recorded size.
- **A count of basic attacks shown as a number on the unit** (Volley bow, Bellringer). Today's Volley count sits on the sheet.
- **Heat as speed, given to every ally by one unit's trigger** (Noonday mace). The counter's new meaning is `fill/shared.md`'s; giving it to the whole party from a piece is new.
- **A wind-up multiplier taken before Cast speed** (Ritual staff), if item 21 doesn't already cover it.

## Least sure

- **The riders, copied whole.** Their sizes against the kits' own casts are the balance pass's, as ruled: a Ranger's Frostbite bow lays more Chill than a Frost lance, and a Paladin's Censer mace two thirds of a Firebolt a swing. The ruling on carried riders adds to it: The standard or a Mimic wand puts a slow kind's "several" or "many" on a fast weapon at the fast weapon's pace.
- **Saint's mace and Anchorite's mace give a Bramble knight only their stats.** A Regen isn't a heal, as ruled, and Regrowth is its only healing. Both stay. The Cleric's Renew feeds neither.
- **Penitent's mace against a swarm.** At 2% of max HP a hit, a Bramble knight heals about what a weak bite does to it after Defense, so small hits stop hurting it. Against a boss it's a trickle.
- **Shepherd's staff beside Spellbinder.** The uncommon gives half a cast's cost to the neediest at once; the rare gives its wearer half back on its next swing, and doubles that swing. For a Frostweaver that is the neediest, the two are close in mana. At a third the staff sits clearly under the rare and is harder to see.
- **Wellblade.** A tenth of a pool a swing is worth four or five steps of MP regen while its wearer swings. It was sized by what play could see, and it may be most of a Stormcaller's mana.
- **Noonday mace at one Heat a swing.** Four swings in a regular fight: the party is a fifth faster by the end, and the first stack isn't seen. It only shows in a boss fight. Hunter's skull and Windrunner's garb give three a trigger; this gives one to each of three units.
- **Mender's mace's first beat is at tick 22,** and stays, as ruled. A short fight sees none.
- **Brimming blade at the whole cost on every foe.** A Blizzard deals three times its damage; a Frost lance half again. It's a wide-spell piece more than a single-target one, which may not be what "mana as damage" meant.
- **Ritual staff on a Frostweaver.** With the piece's two Attack steps, one Frost lance adds about 15 Chill against a cap of 12: a shatter with every lance, from nothing. Attack is the kind's lean for Cold Snap, so the steps are written to it; without them the lance adds 9, and a foe has to be a quarter cold first. On a Cleric the piece does nothing but lengthen its wind-ups: two of its three wearers want it.
- **Saint's mace counts the part of a heal that went past full.** It's simpler to read off the green number, and it lets a healer load a full unit's blow.
- **The lighter swing on Bellringer and the heavier on Overrun** are choices the lines didn't ask for.
- **Executioner's longbow's first clause** is nothing to a Ranger, one of its two wearers.
- **Near pairs, left as they are:** Opening shot and the Hoplite's Opening thrust version (a first swing at once: one always crits, one deals triple); Mason's hammer and the Valkyrie's passive (a Shield from the damage dealt); Thunderhead maul and Lightning-glass, which a unit can wear together and which differ by one word, hits against abilities.
