# The fill's index

Written by `npx tsx steps/loot/web-check.ts --index` from the lines of `spine.md`. Don't edit it: change the line in the spine and run it again.

It's what every fill agent reads before writing: the shares, every item in one line, and each engine's parts with the share that holds each. It's here so two shares don't write the same card, and so an agent writing one half of an engine knows where the other half is. An item's full line, with what the player sees and its tags, is in the spine; write from that, not from this.

## The shares

| Share | Its file | What it holds |
| --- | --- | --- |
| Weapons, the first six kinds | `fill/weapons-1.md` | 60 pieces: 12 commons, 19 uncommons, 19 rares, 10 legendaries |
| Weapons, the other six kinds | `fill/weapons-2.md` | 53 pieces: 12 commons, 18 uncommons, 14 rares, 9 legendaries |
| Armor | `fill/armor.md` | 55 pieces: 12 commons, 16 uncommons, 17 rares, 10 legendaries |
| Offhands, the first six kinds | `fill/offhands-1.md` | 54 pieces: 12 commons, 17 uncommons, 16 rares, 9 legendaries |
| Offhands, the other seven kinds | `fill/offhands-2.md` | 63 pieces: 14 commons, 16 uncommons, 21 rares, 12 legendaries |
| Amulets | `fill/amulets.md` | 37 pieces: 10 commons, 7 uncommons, 10 rares, 10 legendaries |
| Formations | `fill/formations.md` | 35 formations: 13 common, 12 rare, 10 legendary |
| Versions and mythics | `fill/versions-mythics.md` | the two kit changes (Marked, Malison); 9 versions and 5 mythics that change, written new; 33 versions and 11 mythics that stay, each checked against today's card |

A version or mythic the spine doesn't list stays as it is today, and isn't part of the fill.

## Weapons, the first six kinds

*Engines it's part of:* detonation, goad, held charge, reaping, avalanche, spell on the swing, red rain, riposte, every colour, lead's colour, emptied quiver, resonance, mana as armour, brink.

### Dagger

*Wears:* Ranger, Assassin.

- *Commons (2):* one leans to Crit chance and Attack speed, one to Crit chance and Crit damage.
- **Weeping kris** · uncommon · Its first hit on each foe adds several Bleed.
- **Sleet dirk** · uncommon · Its basic attacks add a few Chill.
- **Second thrust** · uncommon · When it lands a killing blow, its next basic attack comes at once and always crits.
- **Marking knife** · rare · While no foe is Marked, its crits Mark their target.
- **Bloodscent knife** · rare · Its hits on a bleeding foe crit far more often.
- **Ambush knife** · rare · Its hits on a foe that hasn't acted yet this fight nearly always crit.
- **Thousandth cut** · legendary · Each hit it lands adds a Cut, kept for the fight. Its hits deal more for each Cut.
- **Quietus** · legendary · When each fight starts, it strikes every foe once, at once.

### Fist weapons

*Wears:* Monk, Vampire, Stormcaller.

- *Commons (2):* one leans to Double strike and Attack speed, one to Double strike and Lifesteal.
- **Live-wire knuckles** · uncommon · Its basic attacks and extra strikes add a few Shock.
- **Cinder wraps** · uncommon · Its basic attacks and extra strikes add a few Burn.
- **Rime knuckles** · uncommon · Its basic attacks and extra strikes add a few Chill.
- **Lamprey claws** · uncommon · Each extra strike it lands heals its wearer (from max HP).
- **Gorged claws** · rare · While its wearer is below half its HP, its basic attacks come a third faster.
- **Bellows wraps** · rare · Each hit it lands on a burning foe raises that foe's Burn by a tenth of what it holds.
- **Still hand** · rare · Its hits on a Stunned foe strike twice; the second strike doesn't strike again.
- **Forked knuckles** · rare · Its basic attacks leap to one more foe for half, carrying what the swing carries, and each foe they hit after the first gives its wearer some MP.
- **Flurry wraps** · legendary · Its extra strikes can strike again: each rolls Double strike for one more, at most two more after the first, each a little weaker than the last.
- **Answering thunder** · legendary · Each time a foe that holds Shock acts, the wearer strikes it with a basic attack, if it's free to.

### Wand

*Wears:* Bard, Hexer, Pyromancer.

- *Commons (2):* one leans to Cooldown and Attack speed, one to Cooldown and MP regen.
- **Spark wand** · uncommon · Its basic attacks add a few Burn.
- **Jolt wand** · uncommon · Its basic attacks add a few Shock.
- **Tithe wand** · uncommon · Each basic attack it lands gives the ally with the least MP some MP.
- **Chain wand** · rare · Its basic attacks also strike two other foes for half, carrying what the swing carries.
- **Mimic wand** · rare · Its basic attacks carry whatever the basic attacks of the other ally with the highest Attack carry.
- **Wildmagic wand** · legendary · Each of its basic attacks adds a few stacks of one of Burn, Chill, Shock, Bleed and Sunder, at random.
- **Baton** · legendary · Each basic attack it lands brings its wearer's first-slotted ability round sooner: a fifth of the wait that's left.

### Sword

*Wears:* Knight, Hexer, Valkyrie.

- *Commons (2):* one leans to Attack and Crit chance, one to Attack and HP or Aggro.
- **Rimed blade** · uncommon · Its basic attacks add a few Chill.
- **Drawn steel** · uncommon · Its first hit on each foe deals double.
- **Mercy's edge** · uncommon · Each basic attack it lands heals the ally with the lowest share of HP for a share of the damage.
- **Gravemark** · rare · Its hits on a Marked foe deal half again as much. When a Marked foe falls and leaves none Marked, it Marks the foe with the lowest HP.
- **Provoking blade** · rare · The foe its basic attack lands on makes its own next basic attack at once, at whoever it would have picked.
- **Oathkeeper** · rare · While its wearer Taunts, its basic attacks also hit every other foe, carrying what the swing carries.
- **Bloodletter** · rare · Each of its swings costs its wearer a little HP, and deals extra damage equal to several times the price.
- **Stormbrand** · legendary · Its hits deal extra damage for each Shock held anywhere on the field. The Shock stays.

### Spear

*Wears:* Hoplite, Valkyrie, Monk.

- *Commons (2):* one leans to Aggro and Defense, one to Aggro and Attack.
- **Jolt spear** · uncommon · Its hits add a few Shock, swing or ability.
- **Trophy spear** · uncommon · When it lands a killing blow, its wearer gains a Shield (from Attack).
- **Long spear** · uncommon · Its basic attacks ignore Taunt.
- **Hunting spear** · rare · Its hits on a foe below half its HP land twice.
- **Parrying spear** · rare · Each time its wearer dodges a hit, the other ally with the highest Attack strikes the attacker with its weapon.
- **Storm pike** · rare · Every fifth hit its basic attacks and extra strikes land also strikes every other foe (a light hit, from Attack), carrying what the swing carries. The flash's own hits aren't counted.
- **Sarissa** · legendary · Its basic attacks hit every foe that has hit its wearer since its last swing.

### Axe

*Wears:* Vampire, Assassin.

- *Commons (2):* one carries Lifesteal, one Attack. The axe's budget is lean, so each carries one step.
- **Reaver's axe** · uncommon · When it lands a killing blow, its next hit deals double.
- **Hungry axe** · uncommon · Its Lifesteal is doubled against a foe below half its HP.
- **Ragged axe** · uncommon · Its hits add a few Bleed.
- **Executioner's axe** · rare · Its hits on a foe below a quarter of its HP deal double.
- **Thirsting axe** · rare · Each killing blow it lands heals its wearer for a fifth of its max HP.
- **Overkill axe** · rare · What its wearer's killing blows have left over lands on the foe with the lowest HP, once.
- **The Red Feast** · legendary · While its wearer is below half its HP, its hits deal double and its Lifesteal is doubled. When a fight is won, its wearer is healed up to half its HP.
- **Headsman's axe** · legendary · Its basic attacks come half as often and deal double. A killing blow it lands readies its next basic attack at once.

## Weapons, the other six kinds

*Engines it's part of:* detonation, frozen gate, held charge, reckoning, reaping, judge's drum, opening again, avalanche, red rain, lead's colour, emptied quiver, mana as armour, firecracker, brink.

### Bow

*Wears:* Ranger, Bard.

- *Commons (2):* one leans to Crit damage and Crit chance, one to Crit damage and Attack speed.
- **Broadhead bow** · uncommon · Its crits add many Bleed.
- **Opening shot** · uncommon · Its first basic attack of each fight comes at once and always crits.
- **Frostbite bow** · uncommon · Its basic attacks add several Chill.
- **Huntsman's bow** · rare · While no foe is Marked, its basic attacks Mark their target. Its hits on a Marked foe deal a third more.
- **Volley bow** · rare · Every fourth basic attack is a volley: it also looses an arrow at every other foe, carrying what the swing carries.
- **Executioner's longbow** · legendary · Its basic attacks ignore Taunt, and deal more the less HP their target has.

### Rune sword

*Wears:* Frostweaver, Stormcaller.

- *Commons (2):* one leans to MP regen and Cooldown, one to MP regen and HP.
- **Sleet blade** · uncommon · Its basic attacks add several Chill.
- **Sigil blade** · uncommon · When each fight starts, its wearer gains a Shield from its max MP.
- **Wellblade** · uncommon · Each basic attack it lands restores some of its wearer's MP.
- **Winter's chain** · rare · When a foe's Chill shatters, the other foe with the most Chill gains half the cold it held.
- **Frostward blade** · rare · Foes that hit the ally with the highest Aggro gain a few Chill.
- **Spellbinder** · rare · After each ability its wearer casts, its next basic attack deals double and gives back half the ability's cost.
- **Brimming blade** · legendary · Its wearer's abilities deal extra damage from the MP they cost.
- **Glacier blade** · legendary · Each shatter this fight adds a Cascade. Its wearer's abilities deal more, and add more Chill and Shock, for each Cascade.

### Hammer

*Wears:* Knight, Bramble knight, Geomancer.

- *Commons (2):* one carries Defense, one HP with a lighter swing. The hammer's budget is lean.
- **Warden's hammer** · uncommon · Its swings deal extra damage from its wearer's Defense.
- **Mason's hammer** · uncommon · Each swing it lands gives its wearer a Shield of a share of the damage dealt.
- **Bellringer** · uncommon · Every fourth swing it lands Stuns its target.
- **Grudgebearer** · rare · Each hit its wearer takes adds a Wrath. Its next swing deals more for each Wrath, and spends them.
- **Mountainfall** · rare · Its swings deal extra damage equal to a share of its wearer's max HP.
- **Cornerstone hammer** · legendary · Its swings deal extra damage equal to a share of all the Shield its party holds. The Shields stay.

### Mace

*Wears:* Cleric, Paladin, Bramble knight.

- *Commons (2):* one leans to HP and Defense, one to HP and MP regen. The mace's budget is rich, so each carries two steps.
- **Censer mace** · uncommon · Its basic attacks add many Burn.
- **Mender's mace** · uncommon · Every so often, the ally with the lowest share of HP is healed (from its wearer's max HP).
- **Penitent's mace** · uncommon · Each hit its wearer takes heals the ally with the lowest share of HP a little (from its max HP).
- **Saint's mace** · rare · Each time its wearer heals an ally, that ally's next hit deals extra damage equal to half the heal.
- **Shepherd's mace** · rare · Its wearer's heals on the ally with the highest Aggro are doubled.
- **Martyr's mace** · legendary · Its basic attacks deal more the lower its wearer's HP, up to triple. Below a third of its HP, each one also heals its wearer for the damage dealt.
- **Sunhammer** · legendary · Each swing it lands on a burning foe gives every ally a Heat (each acts faster, a stack) for the rest of the fight.

### Staff

*Wears:* Cleric, Pyromancer, Frostweaver.

- *Commons (2):* one leans to Cast speed and Cooldown, one to Cast speed and MP regen. The staff's budget is rich.
- **Shepherd's staff** · uncommon · Each ability its wearer casts gives the ally with the least MP some MP.
- **Canopy staff** · uncommon · When each fight starts, its wearer and the other ally with the least max HP each gain a Shield (from Attack).
- **Vesper staff** · uncommon · Each ability its wearer casts heals the ally with the lowest share of HP a little (from Attack).
- **Ritual staff** · rare · Its wearer's abilities wind up half again as long, deal half again as much and add twice the stacks.
- **Evensong staff** · rare · Each ability its wearer casts makes its next one cast in a moment, with no wind-up.
- **Staff of echoes** · legendary · Every ability its wearer casts is cast twice. Both are paid for, and the second isn't cast again.

### Great weapon

*Wears:* Hoplite, Paladin, Geomancer.

- *Commons (2):* one carries Attack with a heavier swing, one leans to Attack and HP. The great weapon's budget is rich.
- **Roaring greataxe** · uncommon · Its wearer starts each fight with many Might.
- **Giantsbane** · uncommon · Its swings deal half again as much to a foe above half its HP.
- **Harvest scythe** · uncommon · When it lands a killing blow, its next basic attack comes at once.
- **Icebreaker** · rare · Its hits on a Stunned foe deal double.
- **Overrun** · rare · What its wearer's killing blows have left over carries into another foe, and on again while it kills.
- **Thunderhead maul** · rare · Its hits deal more for each Shock on their target. The Shock stays.
- **Worldbreaker** · legendary · Its basic attacks come half as often, deal triple, and Stun their target.
- **Twinfall** · legendary · Each blow its wearer lands, swing or ability, lands a second time a moment later.

## Armor

*Engines it's part of:* detonation, frozen gate, mirror, goad, reckoning, judge's drum, opening again, riposte, every colour, blood mage, resonance, crescendo, mana as armour, firecracker, brink, two in the dark, red stone, carrier.

### Plate

*Wears:* Knight, Bramble knight, Hoplite, Paladin, Geomancer.

- *Commons (3):* one leans to Defense, one to HP and Aggro, one to Thorns and Defense.
- **Portcullis** · uncommon · While its wearer is above half its HP, it draws far more.
- **Keystone cuirass** · uncommon · While its wearer holds a Shield, its hits deal a third more.
- **Holdfast** · uncommon · The first time each fight its wearer drops below half its HP, it's Guarded.
- **Urchin plate** · uncommon · While its wearer holds a Shield, it has Thorns.
- **Challenger's plate** · rare · Its wearer Taunts all fight.
- **Hoarfrost plate** · rare · Foes that hit its wearer gain a few Chill.
- **Rubble plate** · rare · When its wearer's Shield breaks, every foe takes damage equal to the most that Shield held.
- **Thornheart plate** · legendary · A foe that hits its wearer takes a share of the blow as it was struck, and a larger share for each blow the wearer has lived through this fight (Spite).
- **Last bastion** · legendary · Once a fight, a blow that would knock its wearer out leaves it at 1 HP and Guarded. Until it's next healed, its hits deal double.
- **The anvil** · legendary · Each hit its wearer takes adds a Wrath to the other ally with the slowest basic attack. That ally's next basic attack deals more for each Wrath, and spends them.

### Mail

*Wears:* Bramble knight, Paladin, Valkyrie, Hexer, Vampire, Frostweaver.

- *Commons (3):* one leans to HP and Attack, one to Lifesteal and HP, one to HP and Defense.
- **Scabbed mail** · uncommon · Each hit its wearer lands gives it a small Shield (from max HP).
- **Reprisal hauberk** · uncommon · The first time each foe hits its wearer in a fight, that foe takes damage (from the wearer's max HP).
- **Bloodsworn mail** · uncommon · While its wearer is below half its HP, it has Lifesteal.
- **Warded mail** · uncommon · The first time each fight its wearer drops below half its HP, it gains a Shield (from max HP).
- **Static mail** · rare · Foes that hit its wearer gain a few Shock.
- **Red stone mail** · rare · Healing its wearer receives past full becomes a Shield on it.
- **Sanguine mail** · rare · Below half its HP, healing its wearer receives is doubled. Above half, it's halved.
- **Hexweave mail** · rare · Its wearer's hits deal more for each different debuff their target holds.
- **Aegis mail** · legendary · Whenever an ally drops below a third of its HP, it gains Aegis.
- **Tallymail** · legendary · Each hit its wearer lands adds a Cut, kept for the fight. Its Lifesteal grows with each Cut.

### Leather

*Wears:* Ranger, Valkyrie, Bard, Monk, Assassin, Stormcaller.

- *Commons (3):* one leans to Evasion and Attack, one to Crit chance and Attack, one to Accuracy and Crit chance.
- **Tithing leathers** · uncommon · Each hit its wearer lands heals it a little (from max HP).
- **Tracker's coat** · uncommon · Its wearer's abilities have Seek.
- **Mottled hide** · uncommon · While its wearer is below half its HP, it draws far less.
- **Quickstep leathers** · uncommon · Each time its wearer dodges a hit, it's Hasted.
- **Duelist's leathers** · rare · Each time its wearer dodges a hit, it strikes the attacker with its weapon.
- **Shadow mantle** · rare · While its wearer is Hidden, its hits deal double.
- **Pack leader's coat** · rare · When its wearer lands a killing blow, every ally's next basic attack comes at once.
- **Frostwalker's furs** · rare · When a foe's Chill shatters, its wearer is Hasted, and its next hit adds a few Chill to every foe.
- **Tally coat** · rare · Each time its wearer lands a killing blow, the start-of-fight effects of its gear and its seat happen again.
- **Windrunner's garb** · legendary · Each dodge adds a Heat (its wearer acts faster in everything, a stack) for the rest of the fight. Each hit it takes spends half its Heat.
- **Carrier's coat** · legendary · Each hit its wearer lands gives its target one stack of every affliction the wearer itself holds. The wearer keeps its own.

### Robes

*Wears:* Cleric, Bard, Pyromancer, Frostweaver, Stormcaller.

- *Commons (3):* one leans to MP and Attack, one to MP regen and HP, one to MP with Aggro down.
- **Matins robe** · uncommon · Every third ability its wearer casts costs no MP.
- **Banked robe** · uncommon · Its wearer's abilities add half again as many stacks of Burn, Chill and Shock.
- **Glyphed robe** · uncommon · Each ability its wearer casts gives it a Shield (from max MP).
- **Acolyte's robe** · uncommon · Each time an ally casts an ability, its wearer regains a little MP.
- **Kindled robes** · rare · While any foe burns, its wearer gains a Heat every few ticks (it acts faster, a stack) for the rest of the fight.
- **Quiet robes** · rare · Its wearer can't be Silenced.
- **Resonant robes** · rare · Each ability its wearer casts comes round sooner for each foe it hit.
- **Sanguine vestments** · rare · Its wearer's abilities cost HP in place of MP: the same share of its max HP. It won't cast one that would leave it below a tenth of its HP.
- **Glimmer robe** · rare · Each time an ally gives its wearer MP, its next ability deals a third more.
- **Archmage's mantle** · legendary · Its wearer's abilities cost half again as much MP, and deal, heal and add half again as much.
- **Vestments of return** · legendary · While its wearer stands, every ally revived comes back behind a Shield of half its max HP.
- **Motley robe** · legendary · Its wearer casts its abilities in a random order, whatever order they're slotted in, and each costs half.

## Offhands, the first six kinds

*Engines it's part of:* detonation, mirror, goad, held charge, reaping, judge's drum, opening again, fuse, red rain, riposte, every colour, blood mage, mana as armour, shatter bell, brink, two in the dark, red stone.

### Kite shield

*Wears:* Knight, Paladin, Geomancer.

- *Commons (2):* one leans to Defense and HP, one to Defense and Aggro.
- **Emberguard** · uncommon · Foes that hit its holder gain a few Burn.
- **Sheltering kite** · uncommon · When each fight starts, its holder and the ally with the least Defense are Guarded.
- **Spiked kite** · uncommon · Its holder's abilities deal extra damage from its Defense.
- **Rubble shield** · rare · When its holder's Shield breaks, the foe whose blow broke it is Stunned.
- **Mirror shield** · rare · A foe that hits its holder takes a share of the blow as it was struck, before Defense, Guard and Shields took theirs.
- **Monolith shield** · rare · Its holder's damaging abilities take twice as long to come round and land more than twice as hard.
- **Oathbound shield** · legendary · When a hit would deal an ally more than a quarter of its max HP, its holder takes the hit instead.

### Round shield

*Wears:* Hoplite, Bramble knight, Valkyrie.

- *Commons (2):* one leans to HP and Attack, one to HP and Defense.
- **Comrade's targe** · uncommon · Every so often, the ally with the lowest share of HP gains a Shield (from its holder's max HP).
- **Hunter's buckler** · uncommon · When its holder's hit fells a foe, it's Hasted.
- **Spiked targe** · uncommon · While its holder is Guarded, it has Thorns.
- **Second skin** · rare · When its holder's Shield breaks, a Shield of half its size is rebuilt at once, every so often.
- **Hoplon** · rare · While its holder is Guarded or holds a Shield or an Aegis, a foe that hits it takes back whatever that cover stopped.
- **Phalanx shield** · rare · While its holder stands, allies with less Defense than it take a fifth less damage. Its holder deals a fifth less.
- **Shield of the chosen** · legendary · Once a fight, when another ally falls, its holder raises it at once with a tenth of its HP, behind a Shield (from the holder's max HP).
- **Lodestone shield** · legendary · Every Shield another ally would gain goes to its holder instead.

### Horn

*Wears:* Knight, Hoplite.

- *Commons (2):* one leans to Aggro and HP, one to Aggro and MP regen.
- **Reveille** · uncommon · When each fight starts, the ally with the highest Attack has its ability with the longest cooldown ready.
- **Bull's horn** · uncommon · The first time a foe falls in a fight, every ally is Hasted.
- **Watch horn** · uncommon · Whenever an ally drops below half its HP, its holder Taunts.
- **War horn** · rare · When each fight starts, the ally with the slowest basic attack gains many Might.
- **Hunting horn** · rare · When a Marked foe falls, every ally's next basic attack comes at once.
- **Horn of the charge** · legendary · When each fight starts, every ally is Hasted and its first action comes at once. Its holder starts every fight with every ability on cooldown.

### Totem

*Wears:* Bramble knight, Stormcaller.

- *Commons (2):* one leans to Thorns and Defense, one to Thorns and Attack.
- **Spinebark pole** · uncommon · When each fight starts, the ally with the highest Aggro gains Thorns for the fight.
- **Stormglass totem** · uncommon · When each fight starts, every foe gains a few Shock.
- **Bear fetish** · uncommon · Whenever an ally drops below half its HP, it's Guarded.
- **Briar totem** · rare · Foes that hit its holder gain a few Bleed.
- **Spite totem** · rare · Each hit its holder takes adds a Spite: its Thorns grow for the rest of the fight.
- **Thunderhead totem** · rare · Each hit its holder takes adds a Shock to every foe.
- **Goading totem** · rare · Each time its holder Taunts, every foe's next basic attack comes at once.
- **Earthmother totem** · legendary · While its holder stands, every Shield an ally gains is a third larger. When an ally's Shield breaks, that ally gains many Might.

### Relic

*Wears:* Cleric, Paladin.

- *Commons (2):* one leans to MP regen and HP, one to MP regen and Cast speed.
- **Holy water** · uncommon · Each time one of its holder's abilities heals an ally, it also lifts one debuff from that ally.
- **Charnel icon** · uncommon · Each time a foe falls, the ally with the lowest share of HP is healed (from its holder's Attack).
- **Font relic** · uncommon · Each time one of its holder's abilities heals an ally, that ally also regains MP.
- **Phylactery** · rare · The part of its holder's heals that would go past full becomes a Shield on the healed ally.
- **Accuser's relic** · rare · While no foe is Marked, each heal its holder gives Marks the foe that last hit the healed ally.
- **Heart of the saint** · legendary · Its holder's heals are paid in its own HP in place of MP, and are twice as big.
- **Bloodstone reliquary** · legendary · Each time an ally pays HP, the ally with the lowest share of HP, the payer aside, is healed for as much.

### Lantern

*Wears:* Cleric, Pyromancer.

- *Commons (2):* one leans to Cast speed and Attack, one to Cast speed and MP.
- **Pitch lantern** · uncommon · When each fight starts, every foe gains several Burn.
- **Dazzling lantern** · uncommon · When each fight starts, the two foes with the highest Attack are Weakened.
- **Wick** · rare · When a burning foe falls, all its Burn passes to the foe with the most Burn left.
- **Shuttered lantern** · rare · While its holder is winding up an ability, it takes half damage.
- **Everflame lantern** · legendary · Every few ticks, the foe with the most Burn gains Burn: a tenth of what it holds.
- **Lamp of vigil** · legendary · After each won fight, one fallen ally stands up with a quarter of its HP.

## Offhands, the other seven kinds

*Engines it's part of:* detonation, frozen gate, reaping, opening again, fuse, spell on the swing, red rain, riposte, every colour, emptied quiver, blood mage, resonance, crescendo, mana as armour, shatter bell, firecracker, brink, two in the dark, red stone.

### Tome

*Wears:* Bard, Hexer, Frostweaver.

- *Commons (2):* one leans to Cooldown and Attack, one to Cooldown and MP regen.
- **Snowbound folio** · uncommon · When each fight starts, every foe gains a few Chill.
- **Marginalia** · uncommon · While a foe is in a wind-up, its holder's abilities aim at it.
- **Curse-book** · uncommon · Its holder's abilities add a few Bleed to each foe they hit.
- **Primer of frost** · rare · Each time its holder adds Chill to a foe, it adds more the more Chill that foe already holds.
- **Twice-told tome** · rare · Every third ability its holder casts is cast twice. The second cast is free.
- **Grimoire of plagues** · rare · When each fight starts, every foe gains a few stacks each of two of Burn, Chill, Shock and Bleed, at random.
- **Annotated score** · rare · Each time the other ally with the highest Attack casts an ability, its holder's next ability costs no MP.
- **Last page** · legendary · When a foe falls, every foe below a tenth of its HP falls too.
- **Annotated grimoire** · legendary · Each ability its holder pays for makes the next ability any ally casts free.
- **Frozen tome** · legendary · Each time a foe's Chill shatters, every ally's ability with the longest cooldown comes half its wait closer.

### Orb

*Wears:* Pyromancer, Frostweaver.

- *Commons (2):* one leans to MP and MP regen, one to MP and Attack.
- **Scrying orb** · uncommon · When each fight starts, its holder's ability nearest to ready comes at once.
- **Mana pearl** · uncommon · Each time a foe falls, its holder regains MP.
- **Orb of the long winter** · rare · When a foe's Chill shatters, its holder regains MP: about a cast's worth.
- **Smouldering orb** · rare · When a burning foe falls, every other foe gains a third of its Burn.
- **Orb of the deep** · rare · Damage its holder takes comes out of its MP first, while it has any.
- **Orb of the rising sun** · legendary · Each time its holder casts the same ability again in a fight, it does more than the time before (Crescendo), and nothing makes it cost more for it.
- **The deep well** · legendary · While its holder holds Clarity, its abilities cost no MP.

### Idol

*Wears:* Hexer, Vampire.

- *Commons (2):* one leans to Siphon and Attack, one to Siphon and HP.
- **Fanged idol** · uncommon · Its holder's first hit on each foe Rots it.
- **Leech idol** · uncommon · MP its holder gains past its full pool goes to the ally with the least MP.
- **Hushing idol** · rare · When a foe starts a wind-up, its holder's next basic attack comes at once, at that foe.
- **Idol of the deepening** · rare · Its holder's hits add one more stack of each of Burn, Chill, Shock and Bleed their target already holds.
- **Idol of binding** · rare · Foes its holder Weakens are also Slowed, and its hits on a foe that's both deal double.
- **Idol of the hungry dark** · legendary · Every so often, it takes one buff from a foe and gives it to its holder. Never Bulwark.
- **Idol of the deep** · legendary · Damage its holder takes comes out of its MP first. MP it gains past full becomes a Shield.
- **Idol of the blood-well** · legendary · Each time its holder pays HP, the ally with the least MP regains as much MP.

### Vial

*Wears:* Vampire, Assassin.

- *Commons (2):* one leans to Lifesteal and HP, one to Lifesteal and Crit chance.
- **Crimson dregs** · uncommon · Its holder's hits on a bleeding foe heal it for a share of their damage.
- **Bloodletter's phial** · uncommon · When each fight starts, every foe gains a few Bleed.
- **Blood vial** · rare · Its holder's abilities cost half their MP, plus HP equal to their full cost. The price never takes it below 1 HP.
- **Venom vial** · rare · Each hit its holder lands on a bleeding foe raises that foe's Bleed by a share of what it holds.
- **Bloodlust draught** · rare · Its holder starts every fight at half its HP (it pays), and its Lifesteal is doubled until it's full.
- **Heartsblood** · legendary · Whatever its holder heals through Lifesteal, every other ally is healed for too.

### Trophy

*Wears:* Ranger, Assassin, Geomancer.

- *Commons (2):* one leans to Crit damage and Crit chance, one to Crit damage and Defense.
- **Hunter's skull** · uncommon · Each killing blow its holder lands adds a Heat (it acts faster, a stack) for the rest of the fight.
- **Eagle feather** · uncommon · Its holder's crits Slow their target.
- **Vulture's skull** · rare · Its holder's hits on a Stunned foe nearly always crit.
- **Ogre's tusk** · rare · Its holder's hits on the foe with the most HP deal half again as much.
- **Dragon's tooth** · rare · Its holder's crits strike again for a third of their damage.
- **The king's head** · legendary · When its holder lands a killing blow, every ally's crit chance is doubled for a while.

### Bell

*Wears:* Bard, Monk, Stormcaller.

- *Commons (2):* one leans to Attack speed and Evasion, one to Attack speed and MP regen.
- **Ringing bell** · uncommon · Every fourth basic attack its holder lands rings: a light hit on every foe (from Attack), carrying what the swing carries.
- **Pacer's bell** · uncommon · Each time its holder casts an ability, it's Hasted.
- **Bell of the hour** · rare · Every eighth basic attack its holder lands casts its first-slotted ability off its cooldown.
- **Warding bell** · rare · Every so often, it lifts one debuff from the ally holding the most, a Silence first.
- **Tireless bell** · legendary · Its holder keeps making basic attacks while it winds up an ability.

### Cloak

*Wears:* Valkyrie, Monk, Ranger.

- *Commons (2):* one leans to Evasion and Attack, one to Evasion and Attack speed.
- **Hooded cloak** · uncommon · Each time its holder dodges a hit, it gains a Shield (from Attack).
- **Feathered cloak** · uncommon · The first time each fight its holder drops below half its HP, it's Hidden.
- **Matador's cape** · uncommon · Each time its holder dodges a hit, it Taunts.
- **Dancer's cloak** · rare · Each time its holder dodges a hit, its ability nearest to ready is ready.
- **Tempest cloak** · rare · Each time its holder dodges a hit, its next basic attack comes at once and strikes twice.
- **Shadow cloak** · rare · Its holder is Hidden when each fight starts, and again each time a foe falls.
- **Swan's grace** · legendary · Once a fight, the blow that would knock its holder out leaves it at 1 HP and Hidden.

## Amulets

*Engines it's part of:* detonation, frozen gate, mirror, goad, held charge, reckoning, reaping, judge's drum, opening again, fuse, avalanche, spell on the swing, riposte, lead's colour, emptied quiver, crescendo, mana as armour, shatter bell, firecracker, brink, two in the dark, borrowed gift, carrier.

### Amulet

*Wears:* everyone.

- *Commons (10):* one each of HP, Defense, Attack, Crit chance, MP regen, Evasion, Lifesteal, Thorns, Double strike and Cooldown.
- **Tinder charm** · uncommon · Its wearer's basic attacks add a few stacks to whichever of Burn, Chill, Shock or Bleed their target holds the most of.
- **Challenger's token** · uncommon · Its wearer Taunts when each fight starts.
- **Carapace charm** · uncommon · Its wearer starts every fight behind a Shield (from max HP).
- **Hare's foot** · uncommon · Its wearer starts every fight Hasted.
- **Millstone** · uncommon · Its wearer's basic attacks come half as often and land more than twice as hard.
- **Hummingbird charm** · uncommon · Its wearer's basic attacks come twice as often and deal half as much.
- **Clear-headed charm** · uncommon · Whenever its wearer drops below half its MP, it gains Clarity, every so often.
- **Shatterstone charm** · rare · When its wearer's Shield breaks, the foe that broke it takes damage equal to twice the most that Shield held.
- **Bounty charm** · rare · When its wearer lands a killing blow, its ability with the longest cooldown left is ready at once.
- **Echo charm** · rare · Its wearer's extra strikes carry what the swing carries.
- **Icebreaker charm** · rare · When a foe's Chill shatters, its wearer's ability with the longest cooldown is ready.
- **Lightning-glass** · rare · Its wearer's abilities deal more for each Shock on their target. The Shock stays.
- **Halved heart** · rare · Its wearer starts every fight at half its HP and can't be healed above it; healing past that counts as healing past full. It deals half again as much.
- **Crescendo charm** · rare · Each time its wearer casts the same ability again in a fight, it does more and costs more than the time before (Crescendo).
- **Ember heart** · rare · When a burning foe falls, all its Burn passes to the next foe its wearer hits.
- **Hunter's mark** · rare · While no foe is Marked, its wearer Marks the foe with the lowest HP.
- **Shroud charm** · rare · Whenever an ally drops below a third of its HP, that ally is Hidden.
- **Heart of winter** · legendary · Chill its wearer adds to one foe is added to every other foe too. The Chill it adds isn't added again.
- **Second dawn** · legendary · Each time a foe falls, the start-of-fight effects of every ally's gear and seat happen again.
- **Downhill charm** · legendary · When its wearer's hit knocks a foe out, what the blow had left over is split evenly among the other foes, once.
- **Twin-knot** · legendary · Whatever status its wearer gives itself, the other ally with the lowest share of HP gains too.
- **Scapegoat charm** · legendary · When its wearer is given a debuff, its next hit gives that debuff, with all its stacks, to its target, and the wearer is rid of it. Doom can't be passed on.
- **Burning heart** · legendary · Every few ticks its wearer sets itself alight: a few Burn on itself. While it burns, it deals half again as much.
- **Phoenix ember** · legendary · Once a fight, when its wearer falls, it stands up a few ticks later with a third of its HP, Hidden.
- **Ready stance** · legendary · Its wearer's abilities start every fight at least half charged. Its cooldowns are a fifth longer.
- **Gambler's coin** · legendary · Its wearer's crit chance is about half. Its hits that don't crit deal half; its crits deal what a crit always does. Hits that always crit still do.
- **Turncoat charm** · legendary · Its wearer's Attack and Defense are swapped.

## Formations

*Engines it's part of:* detonation, frozen gate, mirror, goad, held charge, reckoning, judge's drum, fuse, avalanche, red rain, riposte, lead's colour, blood mage, resonance, crescendo, mana as armour, shatter bell, firecracker, brink, two in the dark, red stone, borrowed gift.

### Common

- **Heavy line** · One strikes like a falling hill, one takes the blows, one loads the strike. Seats: Hammer: basic attacks come half as often and land more than twice as hard. / Anvil: draws far more; Defense up. / Loader: when each fight starts, the Hammer gains many Might.
- **Spur** · One opens the wound; two pour into it. Seats: Opener: crits far more often. / Blade: basic attacks a fifth faster. / Blade: the same.
- **Hearth** · One holds the door, one feeds the fire, one carries it to every burning foe. Seats: Keeper: Taunts and is Guarded when each fight starts. / Stoker: Hasted when each fight starts; basic attacks a fifth faster. / Torch: each of its hits adds a Burn to every foe that's already burning.
- **Hoarfrost line** · Two lay frost with every blow; the third breaks what freezes. Seats: Frost: basic attacks add a few Chill. / Frost: the same. / Breaker: its hits on a Stunned foe deal double.
- **Squall line** · Two charge the field; one stands where the foes look. Seats: Squall: its basic attacks add a few Shock, and also hit a second, random foe for half, carrying it. / Squall: the same. / Rod: draws far more; Defense up.
- **Hunting party** · One picks the quarry, one runs it down past any guard, one holds the line. Seats: Marker: while no foe is Marked, its basic attacks Mark their target. / Chaser: everything it does has Seek. / Warden: draws far more; Defense up.
- **Thorn hedge** · A thorned wall that draws the blows, and two who make every blow on it cost. Seats: Anchor: draws far more; Thorns. / Warden: each hit the Anchor takes heals it a little (from the Warden's max HP). / Thorn: a foe that hits the Anchor takes damage (from the Thorn's Attack).
- **Wellspring** · Two keep one caster casting. Seats: Soloist: its abilities come round faster; draws far less. / Conductor: each ability it casts gives the Soloist some MP. / Well: draws more; each hit it takes gives the Soloist some MP.
- **Shared cup** · Nobody's healing is wasted. Healing any ally receives past full goes to the ally with the lowest share of HP. Seats: Drinker: Lifesteal. / Drinker: Lifesteal. / Donor: its heals are a third bigger.
- **Shieldwall** · One stands in front with its shield up; two stand behind it. Seats: Wall: draws far more; Defense up two steps. / Behind: draws less. / Behind: draws less.
- **The standard** · Two follow the lead's colour. Seats: Lead: nothing of its own; its swings carry what they carry. / Follower: its basic attacks carry whatever the Lead's basic attacks carry. / Follower: the same.
- **First light** · Up before dawn. When each fight starts, every ally's ability nearest to ready is ready. Seats: three Risers, nothing of their own.
- **Skirmish line** · Three who'd rather not be hit at all. Each dodge gives the dodger a small Shield. Seats: three Skirmishers: Evasion up; Defense down.

### Rare

- **Hammer and anvil** · Every blow the Anvil takes is saved for the Hammer. Seats: Anvil: draws far more; each hit it takes adds a Wrath to the Hammer. / Hammer: its next basic attack deals more for each Wrath, and spends them. / Smith: its heals and Shields on the Anvil are a third bigger.
- **Open wound** · One opens them up; two drink from the wound. Seats: Opener: its crits add many Bleed. / Blade: each hit it lands on a bleeding foe heals it a little. / Blade: the same.
- **Pyre line** · The fire outlives whatever it's burning. Seats: Keeper: Taunts and is Guarded when each fight starts; foes that hit it gain a few Burn. / Stoker: basic attacks a third faster. / Torch: when a burning foe falls, all its Burn passes to the foe with the most HP.
- **Icefall** · Two lay frost, each its own way, and every shatter rings the third's great spell. Seats: Rime: whatever Chill its abilities add, they add half again as much. / Sleet: its basic attacks add a few Chill. / Breaker: when a foe's Chill shatters, its ability with the longest cooldown is ready.
- **Storm front** · The more foes one action touches, the more it pays. Seats: Thunderhead: its abilities come round sooner for each foe they hit. / Squall: its basic attacks also hit every foe that holds Shock, for a third. / Rod: draws far more; foes that hit it gain a few Shock.
- **The pack** · The pack takes them one at a time. Seats: Lead: while no foe is Marked, its hits Mark their target. / Packmate: its hits on a Marked foe deal half again as much. / Packmate: the same.
- **Toll gate** · Whatever strikes the gate pays the other two's toll. Seats: Gate: draws far more; Guarded when each fight starts. / Collector: a foe that hits the Gate gains whatever this seat's basic attacks carry. / Collector: the same.
- **The stage** · Everything the other two cast brings the Soloist's spells round. Seats: Soloist: each ability another ally casts takes a fifth off the cooldowns it has left. / Conductor: its abilities come round a third faster. / Well: draws far more; whenever the Soloist finishes a cast, the Well gains a Shield.
- **Blood oath** · One bleeds for power, one drinks, one pours life into the bleeder. Seats: Bleeder: loses a little HP every tick; its hits deal half again as much. / Drinker: Lifesteal, high; what its Lifesteal would heal past full becomes a Shield on it. / Donor: its heals and Shields on the Bleeder are doubled.
- **Decoy** · Two lurk in the dark; one stands in the light. Seats: Light: Taunts and is Guarded when each fight starts. / Shadow: Hidden when each fight starts, and again each time a foe falls. / Shadow: the same.
- **Vigil** · Nobody falls alone. Seats: Sentinel: when an ally falls, it Taunts and is Guarded. / Chaplain: an ally it revives comes back Guarded and behind a Shield. / Watcher: when an ally falls, it gains a Shield.
- **The wheel** · Every so often the wheel turns, and each unit takes the next seat's part. Seats: Wall: draws more; Defense up. / Blade: basic attacks a fifth faster; crits more. / Well: regains MP in fights; heals on it are stronger.

### Legendary

- **The mountain** · While the whole party's stone holds, the Peak's blows land twice. Seats: Peak: while every ally holds a Shield, each blow it lands, swing or ability, lands a second time. / Foothill: starts each fight behind a Shield (from max HP), and every Shield it gains is a third bigger. / Foothill: the same.
- **The whetstone** · Every hit the party lands sharpens the next. Each hit any ally lands adds a Cut to the party's count, kept for the fight; every ally's hits deal more for each Cut. Everyone's hits start a fifth softer. Seats: three Blades, nothing of their own.
- **The forge** · The longer the fire is kept, the faster the party feeds it. While any foe burns, every ally gains a Heat every few ticks (each acts faster, a stack). Whenever an ally is Stunned or Silenced, the foe with the most Burn gains many Burn. Seats: three Forgehands, nothing of their own.
- **The long winter** · Every shatter sends its cold down the line, and each sends more than the last. When a foe's Chill shatters, every other foe gains a few Chill, and a few more for each shatter before it this fight (Cascade). Seats: three Winterers, nothing of their own.
- **Eye of the storm** · The storm doesn't lift. Every ally's basic attacks add a few Shock, all fight. Seats: Bolt: its abilities deal more for each Shock held anywhere on the field; the Shock stays. / Squall: nothing of its own. / Squall: nothing of its own.
- **Open season** · Every kill calls the volley again. While no foe is Marked, the foe with the lowest HP is Marked. When each fight starts, and whenever a Marked foe falls, every ally's next basic attack comes at once. Seats: three Hunters, nothing of their own.
- **The long wall** · One is struck, two profit, more with every blow. Seats: Wall: Taunts all fight; each blow it takes adds a Spite. / Reaper: its hits deal more for each Spite the Wall holds. / Reaper: the same.
- **The cathedral** · Two voices give all their mana to one, and it never stops singing. Seats: Soloist: its first-slotted ability has no cooldown: it's cast whenever there's the mana for it. / Voice: all MP it would regain goes to the Soloist; each cast the Soloist finishes gives this seat a Shield. / Voice: the same.
- **The covenant** · Life is the party's one currency. Every ally's abilities cost HP in place of MP, the same share, and every ally has Lifesteal. Seats: three Sworn, nothing of their own.
- **Twins** · Two are bound; what one gives itself, the other has too. Seats: Twin: whatever status it gives itself, the other Twin gains too. / Twin: the same. / Odd one out: Attack up two steps.

## Versions and mythics

*Engines it's part of:* detonation, frozen gate, mirror, goad, held charge, reaping, judge's drum, spell on the swing, red rain, riposte, every colour, lead's colour, emptied quiver, blood mage, resonance, crescendo, mana as armour, firecracker, brink, two in the dark, red stone.

### The two kit changes

- **Marked** · vocabulary · A Marked foe takes the party's random picks: basic attacks, as today, and every ability aimed at "a random foe" (Shield bash, Barbed arrow, Bramble lash, Spear thrust, Gale spear, Garrote, Blood drain, Chain lightning's first strike, Rockfall, Tremor), inside the Taunt rule, with Seek following the Mark past a Taunting foe. An ability with a target phrase of its own keeps it.
- **Malison** · Hexer · Curses every foe: a hit, from Attack, that deals more for each different affliction the foe holds, and adds a few Bleed. It no longer adds a stack of each affliction.

### Versions that change

- **Barbed volley** · Ranger, Barbed arrow B · An arrow at every foe, each a light hit that adds a few Bleed. In place of Barbed quiver.
- **Swift justice** · Paladin, Condemn B · Marks the foe with the lowest share of HP, and every ally's next basic attack comes at once. When the judged foe falls, Condemn is ready again.
- **Rousing chorus** · Bard, War ballad B · All its Might goes to the ally with the slowest basic attack: three times as many.
- **Rubato** · Bard, Allegro A · Haste on every ally, and every ally's ability nearest to ready is ready at once.
- **Plague** · Hexer, Malison A · Malison, for less damage, and it adds a few Burn and a few Shock to every foe as well as the Bleed.
- **Focused curse** · Hexer, Malison B · Malison on the foe with the highest Attack alone, three times as hard, adding three times the Bleed.
- **High pyre** · Pyromancer, Pyre B · Waits until a foe holds many Burn, then lands on it for far more per stack than Pyre does. The Burn stays. In place of Pyre of the fallen.
- **Splinters** · Frostweaver, Shatterpoint B · When a foe's Chill shatters, it takes several Sunder, and a third of the cold it held goes to every other foe.
- **Frost armor** · Frostweaver, Blizzard A · Guards every ally. While that Guard lasts, a foe that hits a Guarded ally gains a few Chill. No damage.

### Versions that stay

- **Coup de grâce** · Assassin, Backstab A · Backstab is ready again when it knocks its foe out.
- **Quick draw** · Ranger, Hunter's eye B · Each crit makes its next basic attack come at once.
- **Rime shield** · Frostweaver, Shatterpoint A · A shatter gives the lowest ally a Shield from the Frostweaver's max HP.
- **Rampart** · Geomancer, Earthen shell B · Shield and Guard on itself; the first time that Shield breaks, it's rebuilt at once.
- **Faultline** · Geomancer, Bedrock B · When its Shield breaks, its next hit crits for triple.
- **Static field** · Stormcaller, Thunderstorm A · For a while, every foe that hits an ally gains a few Shock.
- **Recharge** · Stormcaller, Chain lightning B · The chain gives back MP for each foe it hits.
- **Overcharge** · Stormcaller, Static charge A · Its next three abilities cost no MP.
- **Deep calm** · Frostweaver, Stillness A · Clarity for the ally with the least MP, and its own next ability is free.
- **Reprise** · Bard, Encore A · The ally with the highest Attack has its ability with the longest cooldown ready at once.
- **Smoke screen** · Assassin, Vanish A · Hides the ally with the lowest share of HP that isn't Taunting.
- **Shared rites** · Cleric, Last rites A · While any ally is below 30% of its HP, the Cleric's cooldowns are halved.
- **Lament** · Bard, War ballad A · Twice the Might, for every ally below half its HP.
- **Over the fallen** · Valkyrie, Choosing B · Heals for double or raises, and the Valkyrie Taunts and is Guarded.
- **Stillness of mind** · Monk, Flow B · Taunts, and its Evasion rises for as long as the Taunt.
- **Drinking palm** · Monk, Iron palm B · Its hits on a Sundered foe heal it.
- **Watch the anchor** · Hoplite, Aspis A · Aegis on the ally with the most Aggro that holds none.
- **Blood for mana** · Vampire, Blood gift A · Spends its HP to give the ally with the least MP as much MP, and Clarity.
- **Hex of flames** · Hexer, Cold hex A · Its basic attacks add a few Burn in place of the Chill.
- **Kindling** · Pyromancer, Stoke A · Its basic attacks add a few Burn, in place of its casts.
- **Zeal** · Paladin, Judgement A · Its basic attacks add a few Burn to a foe with a buff or a debuff.
- **Hold the line** · Knight, Stand fast B · Taunts, with Thorns for as long as the Taunt.
- **Aftershock** · Geomancer, Tremor A · Stuns every foe.
- **Thunderclap** · Valkyrie, Skyfall A · Skyfall on every foe that holds Shock, rising with each one's.
- **Whipping vines** · Bramble knight, Bramble lash A · Lashes every foe for half.
- **Overgrowth** · Bramble knight, Thicket A · Taunts twice over, and its Thorns are doubled while the Taunts last. No Guard.
- **Frost fist** · Monk, Burning fist A · Three quick hits on the foe with the most Chill, each adding a little Chill.
- **Hail** · Ranger, Frost arrow B · A quick arrow at the foe with the most Chill, and a few Chill on every foe.
- **Opening thrust** · Hoplite, Phalanx A · Its first swing of each fight comes at once and deals triple.
- **Quarry** · Ranger, Hunter's eye A · Its basic attacks go to the foe with the lowest share of HP, past any guard.
- **Savage drain** · Vampire, Blood drain A · Three quick hits, each drinking.
- **Rally the well** · Knight, Stand fast A · Clarity for every ally under half its MP. No Taunt.
- **Shieldbearer** · Hoplite, Phalanx B · Defense adds to its doubled swings.

### Mythics that change

- **Halo of the saint** · Cleric (amulet) · Each heal and Regen the Cleric casts also lands on every other ally below half its HP. Changed: the old one waited for a fall.
- **Writ of judgement** · Paladin (offhand) · Whenever the Paladin Marks a foe, a heavy blow falls on it at once (from Attack), adding several Burn. Changed: the old one waited for a Stun or a Silence.
- **Stormspear** · Valkyrie (weapon) · A one-handed spear. Every fourth hit the Valkyrie lands calls a blow from above on the foe with the most Shock, rising with each stack it holds. The Shock stays. Changed: its Shock on every swing is an uncommon's effect now.
- **Ember palms** · Monk (weapon) · Each hit the Monk lands deals extra damage for each Burn on its target. The Burn stays. Changed: its Burn on every hit is an uncommon's effect now.
- **The chalice** · Vampire (offhand) · Whenever another ally would pay MP for an ability, the Vampire pays the same share in HP instead, while that leaves it above a tenth of its HP. Changed: the old one waited for a fall.

### Mythics that stay

- **Horn of the keep** · Knight (offhand) · Every hit the Knight takes gives the ally with the least MP a share of the hit as MP. When its Taunt runs out while another ally is in a wind-up, it Taunts again. Kept.
- **Huntmaster's quiver** · Ranger (armor) · All the Ranger's abilities aim past any guard at the foe with the lowest HP. When a foe one of them hit falls, the cooldowns left on its abilities are halved. Kept.
- **Heartwood mail** · Bramble knight (armor) · Whenever a hit lands on any ally, the Bramble knight's Thorns strike the attacker too. Kept.
- **The last wall** · Hoplite (offhand) · When an Aegis the Hoplite gave blocks a blow, the attacker takes the blocked damage, and Aspis is ready again. Kept.
- **Metronome** · Bard (offhand) · Counts every hit the party lands. At a set count, War ballad, Allegro and Encore are ready at once, and the count starts again. Kept.
- **The witch-blade** · Hexer (weapon) · After each ability the Hexer casts, its next three basic attacks hit every foe that holds a debuff. Kept.
- **Night's edge** · Assassin (armor) · When the Assassin lands a killing blow, it's Hidden for a moment, and its next hit deals double. Kept.
- **Crown of embers** · Pyromancer (amulet) · While the Pyromancer stands, every ally's hits add a Burn. Kept.
- **Glacier's heart** · Frostweaver (armor) · Whenever a foe's Chill shatters, the Frostweaver puts half of it back on that foe. Kept.
- **Eye of the tempest** · Stormcaller (weapon) · Every hit the Stormcaller lands jumps to one more random foe for half its damage. When a foe falls holding Shock, every other foe gains half of it. Kept.
- **Mountain's crown** · Geomancer (amulet) · Each crit the Geomancer lands rebuilds its own Shield by the damage the crit dealt. Kept.

## Each engine's parts, and the share that holds each

What the two sides make and read, and what the link is sized to do, is under *Each engine's link* in the spine. A part that's in a base kit isn't listed here: the link names it.

### detonation

- *Keystone:* Rubble plate (armor: plate, rare); Second skin (offhands-1: round shield, rare); Shatterstone charm (amulets: amulet, rare); Rampart (versions-mythics: version: Geomancer, Earthen shell B)
- *Common half:* Trophy spear (weapons-1: spear, uncommon); Sigil blade (weapons-2: rune sword, uncommon); Mason's hammer (weapons-2: hammer, uncommon); Canopy staff (weapons-2: staff, uncommon); Scabbed mail (armor: mail, uncommon); Red stone mail (armor: mail, rare); Glyphed robe (armor: robes, uncommon); Rubble shield (offhands-1: kite shield, rare); Comrade's targe (offhands-1: round shield, uncommon); Lodestone shield (offhands-1: round shield, legendary); Earthmother totem (offhands-1: totem, legendary); Phylactery (offhands-1: relic, rare); Hooded cloak (offhands-2: cloak, uncommon); Carapace charm (amulets: amulet, uncommon); The mountain (formations: formation, legendary); Rime shield (versions-mythics: version: Frostweaver, Shatterpoint A); Faultline (versions-mythics: version: Geomancer, Bedrock B); Mountain's crown (versions-mythics: mythic: Geomancer)

### frozen gate

- *Keystone:* Frostward blade (weapons-2: rune sword, rare); Hoarfrost plate (armor: plate, rare); Toll gate (formations: formation, rare); Frost armor (versions-mythics: version: Frostweaver, Blizzard A)
- *Common half:* Portcullis (armor: plate, uncommon); Challenger's plate (armor: plate, rare); Frostwalker's furs (armor: leather, rare); Orb of the long winter (offhands-2: orb, rare); Challenger's token (amulets: amulet, uncommon); Shieldwall (formations: formation, common); Rime shield (versions-mythics: version: Frostweaver, Shatterpoint A)

### mirror

- *Keystone:* Thornheart plate (armor: plate, legendary); Mirror shield (offhands-1: kite shield, rare); Hoplon (offhands-1: round shield, rare); The last wall (versions-mythics: mythic: Hoplite)
- *Common half:* Portcullis (armor: plate, uncommon); Holdfast (armor: plate, uncommon); Challenger's plate (armor: plate, rare); Aegis mail (armor: mail, legendary); Sheltering kite (offhands-1: kite shield, uncommon); Oathbound shield (offhands-1: kite shield, legendary); Watch horn (offhands-1: horn, uncommon); Bear fetish (offhands-1: totem, uncommon); Challenger's token (amulets: amulet, uncommon); Shieldwall (formations: formation, common); Watch the anchor (versions-mythics: version: Hoplite, Aspis A)

### goad

- *Keystone:* Provoking blade (weapons-1: sword, rare); Goading totem (offhands-1: totem, rare)
- *Common half:* Urchin plate (armor: plate, uncommon); Challenger's plate (armor: plate, rare); Static mail (armor: mail, rare); Emberguard (offhands-1: kite shield, uncommon); Spiked targe (offhands-1: round shield, uncommon); Watch horn (offhands-1: horn, uncommon); Spinebark pole (offhands-1: totem, uncommon); Thunderhead totem (offhands-1: totem, rare); Dazzling lantern (offhands-1: lantern, uncommon); Challenger's token (amulets: amulet, uncommon); Storm front (formations: formation, rare); Toll gate (formations: formation, rare); Static field (versions-mythics: version: Stormcaller, Thunderstorm A); Hold the line (versions-mythics: version: Knight, Stand fast B); Overgrowth (versions-mythics: version: Bramble knight, Thicket A)

### held charge

- *Keystone:* Stormbrand (weapons-1: sword, legendary); Thunderhead maul (weapons-2: great weapon, rare); Lightning-glass (amulets: amulet, rare); Eye of the storm (formations: formation, legendary); Thunderclap (versions-mythics: version: Valkyrie, Skyfall A); Stormspear (versions-mythics: mythic: Valkyrie)
- *Common half:* Live-wire knuckles (weapons-1: fist, uncommon); Jolt wand (weapons-1: wand, uncommon); Jolt spear (weapons-1: spear, uncommon); Bellringer (weapons-2: hammer, uncommon); Worldbreaker (weapons-2: great weapon, legendary); Rubble shield (offhands-1: kite shield, rare); Thunderhead totem (offhands-1: totem, rare); Squall line (formations: formation, common); Aftershock (versions-mythics: version: Geomancer, Tremor A)

### reckoning

- *Keystone:* Grudgebearer (weapons-2: hammer, rare); The anvil (armor: plate, legendary); Hammer and anvil (formations: formation, rare)
- *Common half:* Portcullis (armor: plate, uncommon); Challenger's plate (armor: plate, rare); Millstone (amulets: amulet, uncommon); Heavy line (formations: formation, common)

### reaping

- *Keystone:* Bounty charm (amulets: amulet, rare); Coup de grâce (versions-mythics: version: Assassin, Backstab A)
- *Common half:* Oathkeeper (weapons-1: sword, rare); Storm pike (weapons-1: spear, rare); Volley bow (weapons-2: bow, rare); Pitch lantern (offhands-1: lantern, uncommon); Last page (offhands-2: tome, legendary); Ringing bell (offhands-2: bell, uncommon); Huntmaster's quiver (versions-mythics: mythic: Ranger)

### judge's drum

- *Keystone:* Pack leader's coat (armor: leather, rare); Hunting horn (offhands-1: horn, rare); Open season (formations: formation, legendary); Swift justice (versions-mythics: version: Paladin, Condemn B)
- *Common half:* Roaring greataxe (weapons-2: great weapon, uncommon); War horn (offhands-1: horn, rare); Millstone (amulets: amulet, uncommon); Hunter's mark (amulets: amulet, rare); Heavy line (formations: formation, common); The pack (formations: formation, rare)

### opening again

- *Keystone:* Tally coat (armor: leather, rare); Second dawn (amulets: amulet, legendary)
- *Common half:* Sigil blade (weapons-2: rune sword, uncommon); Canopy staff (weapons-2: staff, uncommon); Roaring greataxe (weapons-2: great weapon, uncommon); Sheltering kite (offhands-1: kite shield, uncommon); Reveille (offhands-1: horn, uncommon); War horn (offhands-1: horn, rare); Horn of the charge (offhands-1: horn, legendary); Spinebark pole (offhands-1: totem, uncommon); Stormglass totem (offhands-1: totem, uncommon); Pitch lantern (offhands-1: lantern, uncommon); Dazzling lantern (offhands-1: lantern, uncommon); Snowbound folio (offhands-2: tome, uncommon); Grimoire of plagues (offhands-2: tome, rare); Scrying orb (offhands-2: orb, uncommon); Bloodletter's phial (offhands-2: vial, uncommon); Challenger's token (amulets: amulet, uncommon); Carapace charm (amulets: amulet, uncommon); Hare's foot (amulets: amulet, uncommon)

### fuse

- *Keystone:* Wick (offhands-1: lantern, rare); Smouldering orb (offhands-2: orb, rare); Ember heart (amulets: amulet, rare); Pyre line (formations: formation, rare)
- *Common half:* in the kits

### avalanche

- *Keystone:* Overkill axe (weapons-1: axe, rare); Overrun (weapons-2: great weapon, rare); Downhill charm (amulets: amulet, legendary)
- *Common half:* Millstone (amulets: amulet, uncommon); Heavy line (formations: formation, common)

### spell on the swing

- *Keystone:* Baton (weapons-1: wand, legendary); Bell of the hour (offhands-2: bell, rare); Metronome (versions-mythics: mythic: Bard)
- *Common half:* Hare's foot (amulets: amulet, uncommon); Hummingbird charm (amulets: amulet, uncommon)

### red rain

- *Keystone:* in the kits
- *Common half:* Weeping kris (weapons-1: dagger, uncommon); Quietus (weapons-1: dagger, legendary); Forked knuckles (weapons-1: fist, rare); Chain wand (weapons-1: wand, rare); Oathkeeper (weapons-1: sword, rare); Storm pike (weapons-1: spear, rare); Volley bow (weapons-2: bow, rare); Briar totem (offhands-1: totem, rare); Curse-book (offhands-2: tome, uncommon); Bloodletter's phial (offhands-2: vial, uncommon); Ringing bell (offhands-2: bell, uncommon); Squall line (formations: formation, common); Storm front (formations: formation, rare); Toll gate (formations: formation, rare); Barbed volley (versions-mythics: version: Ranger, Barbed arrow B); Plague (versions-mythics: version: Hexer, Malison A); Whipping vines (versions-mythics: version: Bramble knight, Bramble lash A); Heartwood mail (versions-mythics: mythic: Bramble knight); The witch-blade (versions-mythics: mythic: Hexer)

### riposte

- *Keystone:* Parrying spear (weapons-1: spear, rare); Duelist's leathers (armor: leather, rare); Tempest cloak (offhands-2: cloak, rare)
- *Common half:* Scabbed mail (armor: mail, uncommon); Tithing leathers (armor: leather, uncommon); Quickstep leathers (armor: leather, uncommon); Windrunner's garb (armor: leather, legendary); Second skin (offhands-1: round shield, rare); Hooded cloak (offhands-2: cloak, uncommon); Matador's cape (offhands-2: cloak, uncommon); Challenger's token (amulets: amulet, uncommon); Skirmish line (formations: formation, common); Over the fallen (versions-mythics: version: Valkyrie, Choosing B); Stillness of mind (versions-mythics: version: Monk, Flow B); Drinking palm (versions-mythics: version: Monk, Iron palm B)

### every colour

- *Keystone:* Wildmagic wand (weapons-1: wand, legendary); Grimoire of plagues (offhands-2: tome, rare); Plague (versions-mythics: version: Hexer, Malison A)
- *Common half:* Spark wand (weapons-1: wand, uncommon); Jolt wand (weapons-1: wand, uncommon); Mimic wand (weapons-1: wand, rare); Rimed blade (weapons-1: sword, uncommon); Hexweave mail (armor: mail, rare); Stormglass totem (offhands-1: totem, uncommon); Pitch lantern (offhands-1: lantern, uncommon); Snowbound folio (offhands-2: tome, uncommon); Curse-book (offhands-2: tome, uncommon); Idol of the deepening (offhands-2: idol, rare); Bloodletter's phial (offhands-2: vial, uncommon); Focused curse (versions-mythics: version: Hexer, Malison B); The witch-blade (versions-mythics: mythic: Hexer)

### lead's colour

- *Keystone:* Mimic wand (weapons-1: wand, rare); The standard (formations: formation, common)
- *Common half:* Sleet dirk (weapons-1: dagger, uncommon); Live-wire knuckles (weapons-1: fist, uncommon); Cinder wraps (weapons-1: fist, uncommon); Rime knuckles (weapons-1: fist, uncommon); Spark wand (weapons-1: wand, uncommon); Jolt wand (weapons-1: wand, uncommon); Rimed blade (weapons-1: sword, uncommon); Jolt spear (weapons-1: spear, uncommon); Ragged axe (weapons-1: axe, uncommon); Frostbite bow (weapons-2: bow, uncommon); Sleet blade (weapons-2: rune sword, uncommon); Censer mace (weapons-2: mace, uncommon); Tinder charm (amulets: amulet, uncommon); Hoarfrost line (formations: formation, common); Eye of the storm (formations: formation, legendary); Hex of flames (versions-mythics: version: Hexer, Cold hex A); Kindling (versions-mythics: version: Pyromancer, Stoke A); Crown of embers (versions-mythics: mythic: Pyromancer)

### emptied quiver

- *Keystone:* Quick draw (versions-mythics: version: Ranger, Hunter's eye B)
- *Common half:* Bloodscent knife (weapons-1: dagger, rare); Ambush knife (weapons-1: dagger, rare); Bellringer (weapons-2: hammer, uncommon); Vulture's skull (offhands-2: trophy, rare); The king's head (offhands-2: trophy, legendary); Gambler's coin (amulets: amulet, legendary); Barbed volley (versions-mythics: version: Ranger, Barbed arrow B)

### blood mage

- *Keystone:* Sanguine vestments (armor: robes, rare); The covenant (formations: formation, legendary)
- *Common half:* Bloodsworn mail (armor: mail, uncommon); Tithing leathers (armor: leather, uncommon); Bloodstone reliquary (offhands-1: relic, legendary); Idol of the blood-well (offhands-2: idol, legendary); Blood vial (offhands-2: vial, rare); The chalice (versions-mythics: mythic: Vampire)

### resonance

- *Keystone:* Resonant robes (armor: robes, rare); Storm front (formations: formation, rare)
- *Common half:* Forked knuckles (weapons-1: fist, rare); Mana pearl (offhands-2: orb, uncommon); Orb of the long winter (offhands-2: orb, rare); Recharge (versions-mythics: version: Stormcaller, Chain lightning B)

### crescendo

- *Keystone:* Orb of the rising sun (offhands-2: orb, legendary); Crescendo charm (amulets: amulet, rare)
- *Common half:* Matins robe (armor: robes, uncommon); Twice-told tome (offhands-2: tome, rare); Annotated score (offhands-2: tome, rare); Annotated grimoire (offhands-2: tome, legendary); The deep well (offhands-2: orb, legendary); The cathedral (formations: formation, legendary); Overcharge (versions-mythics: version: Stormcaller, Static charge A); Deep calm (versions-mythics: version: Frostweaver, Stillness A)

### mana as armour

- *Keystone:* Orb of the deep (offhands-2: orb, rare); Idol of the deep (offhands-2: idol, legendary)
- *Common half:* Tithe wand (weapons-1: wand, uncommon); Shepherd's staff (weapons-2: staff, uncommon); Glyphed robe (armor: robes, uncommon); Glimmer robe (armor: robes, rare); Font relic (offhands-1: relic, uncommon); The deep well (offhands-2: orb, legendary); Leech idol (offhands-2: idol, uncommon); Clear-headed charm (amulets: amulet, uncommon); Wellspring (formations: formation, common); The cathedral (formations: formation, legendary); Deep calm (versions-mythics: version: Frostweaver, Stillness A); Blood for mana (versions-mythics: version: Vampire, Blood gift A); Rally the well (versions-mythics: version: Knight, Stand fast A); Horn of the keep (versions-mythics: mythic: Knight)

### shatter bell

- *Keystone:* Frozen tome (offhands-2: tome, legendary); Icebreaker charm (amulets: amulet, rare); Icefall (formations: formation, rare)
- *Common half:* Monolith shield (offhands-1: kite shield, rare)

### firecracker

- *Keystone:* Winter's chain (weapons-2: rune sword, rare); Frostwalker's furs (armor: leather, rare); The long winter (formations: formation, legendary); Splinters (versions-mythics: version: Frostweaver, Shatterpoint B); Glacier's heart (versions-mythics: mythic: Frostweaver)
- *Common half:* Snowbound folio (offhands-2: tome, uncommon); Heart of winter (amulets: amulet, legendary); Hail (versions-mythics: version: Ranger, Frost arrow B)

### brink

- *Keystone:* Bloodletter (weapons-1: sword, rare); Sanguine vestments (armor: robes, rare); Heart of the saint (offhands-1: relic, legendary); Blood vial (offhands-2: vial, rare); Bloodlust draught (offhands-2: vial, rare); Halved heart (amulets: amulet, rare); Blood oath (formations: formation, rare); The chalice (versions-mythics: mythic: Vampire)
- *Common half:* Gorged claws (weapons-1: fist, rare); Mercy's edge (weapons-1: sword, uncommon); The Red Feast (weapons-1: axe, legendary); Mender's mace (weapons-2: mace, uncommon); Martyr's mace (weapons-2: mace, legendary); Vesper staff (weapons-2: staff, uncommon); Last bastion (armor: plate, legendary); Scabbed mail (armor: mail, uncommon); Bloodsworn mail (armor: mail, uncommon); Warded mail (armor: mail, uncommon); Sanguine mail (armor: mail, rare); Aegis mail (armor: mail, legendary); Comrade's targe (offhands-1: round shield, uncommon); Bear fetish (offhands-1: totem, uncommon); Charnel icon (offhands-1: relic, uncommon); Bloodstone reliquary (offhands-1: relic, legendary); Shroud charm (amulets: amulet, rare); Twin-knot (amulets: amulet, legendary); Shared cup (formations: formation, common); The covenant (formations: formation, legendary); Rime shield (versions-mythics: version: Frostweaver, Shatterpoint A); Smoke screen (versions-mythics: version: Assassin, Vanish A); Shared rites (versions-mythics: version: Cleric, Last rites A); Lament (versions-mythics: version: Bard, War ballad A); Over the fallen (versions-mythics: version: Valkyrie, Choosing B); Halo of the saint (versions-mythics: mythic: Cleric)

### two in the dark

- *Keystone:* Shadow cloak (offhands-2: cloak, rare); Shroud charm (amulets: amulet, rare); Decoy (formations: formation, rare); Smoke screen (versions-mythics: version: Assassin, Vanish A)
- *Common half:* Challenger's plate (armor: plate, rare); Shadow mantle (armor: leather, rare); Watch horn (offhands-1: horn, uncommon); Feathered cloak (offhands-2: cloak, uncommon); Swan's grace (offhands-2: cloak, legendary); Challenger's token (amulets: amulet, uncommon); Twin-knot (amulets: amulet, legendary); Twins (formations: formation, legendary); Night's edge (versions-mythics: mythic: Assassin)

### red stone

- *Keystone:* Red stone mail (armor: mail, rare); Phylactery (offhands-1: relic, rare); Blood oath (formations: formation, rare)
- *Common half:* Tithing leathers (armor: leather, uncommon); Crimson dregs (offhands-2: vial, uncommon); Heartsblood (offhands-2: vial, legendary); Drinking palm (versions-mythics: version: Monk, Iron palm B)

### borrowed gift

- *Keystone:* Twin-knot (amulets: amulet, legendary); Twins (formations: formation, legendary)
- *Common half:* in the kits

### carrier

- *Keystone:* Carrier's coat (armor: leather, legendary)
- *Common half:* Scapegoat charm (amulets: amulet, legendary); Burning heart (amulets: amulet, legendary)
