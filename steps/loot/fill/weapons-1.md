# The fill: weapons, the first six kinds

60 pieces: 12 commons, 19 uncommons, 19 rares, 10 legendaries. Dagger, fist weapons, wand, sword, spear, axe, in the spine's order. Every number is a first value. Round 1's rulings are applied (`fill/shared.md`, *Rulings for every share*; `fill/round-1.md`). "Its wearer's hits" on these cards means every hit the wearer lands: a swing, an extra strike or an ability's hit. An extra strike is Double strike's second strike.

## Dagger

### Stiletto
- **Is:** dagger · common
- **Card:** Nothing beyond its stats.
- **Stats:** Attack speed medium (1 of 1)
- **Numbers:** none of its own: the step is `SPECIAL.attack_speed.medium`.
- **Code:** none
- **Serves:** Cuts, Snap
- **Notes:** The spine's common that leans to Crit chance and Attack speed, on one step. Both rows name Crit chance first, so one common has to take its second stat to differ: this one takes Attack speed, and Keen dirk the signature. It's Thousand Cuts' first stat (more hits). New name: today's Parrying dagger carried Evasion, which the dagger no longer leans to.

### Keen dirk
- **Is:** dagger · common
- **Card:** Nothing beyond its stats.
- **Stats:** Crit chance +1 (1 of 1)
- **Numbers:** none of its own: one step of `CRIT_TABLE`.
- **Code:** as today's Keen dirk
- **Serves:** Hunt, Cuts
- **Notes:** The spine's common that leans to Crit chance and Crit damage, on one step: the signature. The Hunt's first stat, and the opener's in Thousand Cuts. Today's piece, same step, name kept.

### Weeping kris
- **Is:** dagger · uncommon
- **Card:** The first hit its wearer lands on each foe adds several Bleed (from Attack).
- **Stats:** Crit chance +1 · Attack speed medium (2 of 2)
- **Numbers:** several: `STACKS.several` through `own()`, from the wearer's Attack (about 5 stacks at Attack 4, 6 or 7 at Attack 5). Once a foe, each fight. Bleed keeps its own numbers (`STATUS.bleed`).
- **Code:** as today's Weeping kris, with several in place of a few
- **Serves:** Cuts 1 ●●, Hunt ● ⚙ red rain (half) ◆ swing-status
- **Notes:** Today's card, one word bigger, as the line says. At a few, the wound paid less than the dagger's own blow and was gone in three hits. At several, the next hit on that foe pays about 620 against the dagger's 420, and the wound lasts five hits: that's the party's hits printing twice. On an Assassin with Opening wound the first hit is also a crit, so Lacerate's Bleed and this one land together.

### Sleet dirk
- **Is:** dagger · uncommon
- **Card:** Its basic attacks add a few Chill (from Attack).
- **Stats:** Crit chance +1 · Accuracy medium (2 of 2)
- **Numbers:** a few: `STACKS.few` through `own()`, from Attack (about 3 at Attack 4), on every swing (`KIND_SPEED.dagger`). Chill keeps its own numbers (`STATUS.chill`).
- **Code:** as today's Spark wand, with Chill
- **Serves:** Snap 1 ●● ⚙ lead's colour (half) ◆ swing-status
- **Notes:** Basic attacks only: an extra strike lays it only where something says it carries what the swing carries. Seen: on one foe, a Ranger's dirk alone takes the counter to its cap in about five swings; in a pack its swings scatter and the whole field slows. Accuracy is the header's lean for Cold Snap (a dodged swing lays no frost), and Weeping kris holds the Attack speed line.

### Second thrust
- **Is:** dagger · uncommon
- **Card:** When its wearer lands a killing blow, its next basic attack comes at once and always crits.
- **Stats:** Crit chance +1 · Crit damage medium (2 of 2)
- **Numbers:** none to set: the reward is a whole swing, and a crit at the wearer's own Crit damage.
- **Code:** as today's Headsman's axe for the swing made ready by a kill, and today's Drawn steel for the crit on the next basic attack; 23 for a call that doesn't stack
- **Serves:** Hunt 1 ●●, Cuts ● ◆ kill-pays
- **Notes:** A killing blow is any hit of its wearer's that fells a foe, swing or ability. "At once" doesn't stack: a second kill before the called swing lands calls nothing more. The called swing crits under Gambler's coin too. With Quick draw the certain crit calls one more swing, at the wearer's own chance.

### Marking knife
- **Is:** dagger · rare
- **Card:** While no foe is Marked, each crit its wearer lands Marks its target.
- **Stats:** Crit chance +2 · Attack speed medium (3 of 3)
- **Numbers:** none of its own. Marked keeps its own length (`STATUS.marked`).
- **Code:** 19 (a Mark on a crit); the test that no foe is Marked as today's Gravemark; 1
- **Serves:** Hunt 2 ●●●, Cuts ●●
- **Notes:** Today's Marked on every swing, changed as the line says: one Mark from gear, laid by a crit. A crit by any hit counts, so an Assassin's Lacerate and the Mark land on the same blow. How often: with these steps a Ranger's swing or an Assassin's crits about one time in four, so a fresh Mark comes about every 20 ticks against a Mark that lasts 14. Its steps are both its trigger: more crits, and more swings to crit with.

### Bloodscent knife
- **Is:** dagger · rare
- **Card:** Its wearer's hits on a bleeding foe crit far more often: 50 more Crit chance, to four in five at most.
- **Stats:** Crit chance +1 · Attack speed medium · Crit damage medium (3 of 3)
- **Numbers:** +50 Crit chance on a hit against a foe that holds Bleed when the hit lands, up to a chance of 80% on that hit. The 50 is my value; the ceiling is round 1's (no card makes a crit certain for longer than one swing).
- **Code:** as today's Venom vial's crit rule on a foe that holds Bleed, at 50; the ceiling on what the rule lifts the chance to is new (see *Code support*)
- **Serves:** Cuts 2 ●●●, Hunt ●● ⚙ emptied quiver (half)
- **Notes:** Added to the wearer's own chance, so the dagger's signature still counts: a Ranger's swing goes from about one in four to three in four, an Assassin's the same. The lift stops at four in five, so the wearer's own Crit chance counts up to 30 and no further on a wound, and one hit in five always fails. A hit that always crits still does. A hit's own Bleed lands after the hit, so the hit that opens a wound isn't lifted by it.

### Ambush knife
- **Is:** dagger · rare
- **Card:** Its wearer's hits on a foe that hasn't acted yet this fight crit four times in five, whatever its Crit chance.
- **Stats:** Crit chance +2 · Crit damage medium (3 of 3)
- **Numbers:** a set chance of 80% in place of the wearer's own, which nothing raises, on a foe none of whose actions has resolved this fight. Round 1's value for "nearly always".
- **Code:** as today's Quietus's crit rule on a foe that hasn't acted; the chance is set, as Gambler's coin sets one, where today's rule adds (see *Code support*)
- **Serves:** Hunt 2 ●●●, Cuts ● ⚙ emptied quiver (half)
- **Notes:** A foe has acted once a basic attack or an ability of its own has resolved; a foe in its first wind-up, a foe Stunned since the start and a foe just summoned haven't. Set, not added, so it's never certain and the crit that fails stays. A hit that always crits still does (Opening wound's first hit), and the set chance wins over Gambler's coin. Its window is the first few ticks, so its steps are for after: its own Crit chance, and Crit damage for the crits the window gives.

### Thousandth cut
- **Is:** dagger · legendary
- **Card:** Its wearer gathers Cuts (a Cut for each hit it lands, kept for the fight, up to 25). Its wearer's hits deal 2% more for each Cut.
- **Stats:** Crit chance +2 · Attack speed high (4 of 4)
- **Numbers:** 2% more a Cut, as today. Cuts climbs to 25 (`fill/shared.md`), so half again at the top.
- **Code:** as today's Thousandth cut
- **Serves:** Cuts 3 ●●●, Snap ●, Storm ●
- **Notes:** Kept: today's card and size, with the counter's bracket in `fill/shared.md`'s words, then what a Cut is worth here. Stats changed: Attack speed high is the legendary's step, since the count is hits. A dagger alone reaches 8 to 10 Cuts in a regular fight and the cap only in a long boss fight or with a second strike.

### Quietus
- **Is:** dagger · legendary
- **Card:** When each fight starts, its wearer strikes every foe with its weapon, once each.
- **Stats:** Crit chance +2 · Crit damage high (4 of 4)
- **Numbers:** each strike is a hit of its basic attack's size (about 420 a foe at Attack 4, 495 at Attack 5), able to crit. It takes the shape its wearer's basic attacks have: more than twice as hard under Millstone, half under Hummingbird charm.
- **Code:** today's strike (Pike wall's) on the fight's start, at every foe; 12 for what the strikes carry; 8 reads it as a start-of-fight effect
- **Serves:** Hunt 3 ●●●, Cuts ●● ⚙ red rain (half), opening again (half)
- **Notes:** Keeps the name only. "Strikes with its weapon" is the spine's phrase: hits, not basic attacks, carrying what the swing carries. So Hunter's eye adds nothing to them, and Lacerate, Opening wound and Quick draw answer their crits. With Opening wound every foe starts the fight wounded. It's a start-of-fight effect, so Overture coat and Second dawn land it again, once for each fall whoever calls for it, and a kill by a repeated strike is a kill (*Loops*).

## Fist weapons

### Mantis claws
- **Is:** fist · common
- **Card:** Nothing beyond its stats.
- **Stats:** Double strike medium (1 of 1)
- **Numbers:** none of its own: `SPECIAL.double_strike.medium`.
- **Code:** as today's Mantis claws
- **Serves:** Cuts, Storm
- **Notes:** The spine's common that leans to Double strike and Attack speed, on one step: the signature. Thousand Cuts' first stat (a second strike), and the Storm's. Today's piece, name kept.

### Red talons
- **Is:** fist · common
- **Card:** Nothing beyond its stats.
- **Stats:** Lifesteal medium (1 of 1)
- **Numbers:** none of its own: `SPECIAL.lifesteal.medium`.
- **Code:** as today's Red talons
- **Serves:** Pact
- **Notes:** The spine's common that leans to Double strike and Lifesteal, on one step: Lifesteal, so the two differ. Blood Pact's sign for a Monk or a Stormcaller. Today's piece, name kept.

### Live-wire knuckles
- **Is:** fist · uncommon
- **Card:** Its basic attacks and extra strikes add a few Shock (from Attack).
- **Stats:** Double strike medium · Attack speed medium (2 of 2)
- **Numbers:** a few: `STACKS.few`, from Attack (about 3 at Attack 4), on every swing and every extra strike. Shock keeps its own numbers (`STATUS.shock`).
- **Code:** as today's Rime knuckles, with Shock
- **Serves:** Storm 1 ●●, Toll ● ⚙ lead's colour (half), held charge (half) ◆ swing-status
- **Notes:** Seen: against one foe swinging at a medium pace, the charge it pays each time it acts comes to about what the knuckles' own blows deal. An extra strike is Double strike's second strike: on a Stormcaller the knuckles' Shock lands on the swing's target beside Arc's, and Arc's second hit carries only Arc's own. Under Echo charm an extra strike lays it once, not twice.

### Cinder wraps
- **Is:** fist · uncommon
- **Card:** Its basic attacks and extra strikes add a few Burn (from Attack).
- **Stats:** Double strike medium · Attack speed medium (2 of 2)
- **Numbers:** a few: `STACKS.few`, from Attack (about 3 at Attack 4), on every swing and every extra strike. Burn keeps its own numbers (`STATUS.burn`).
- **Code:** as today's Rime knuckles, with Burn
- **Serves:** Bonfire 1 ●●, Cuts ● ⚙ lead's colour (half) ◆ swing-status
- **Notes:** Seen: kept on one foe, the fire it holds up deals two to three times what the wraps' own blows do. About two thirds of what the Monk's Burning fist feeds, and steady where the fist comes in bursts.

### Rime knuckles
- **Is:** fist · uncommon
- **Card:** Its basic attacks and extra strikes add a few Chill (from Attack).
- **Stats:** Double strike medium · Attack speed medium (2 of 2)
- **Numbers:** a few: `STACKS.few`, from Attack (about 3 at Attack 4), on every swing and every extra strike. Chill keeps its own numbers (`STATUS.chill`).
- **Code:** as today's Rime knuckles
- **Serves:** Snap 1 ●●, Cuts ● ⚙ lead's colour (half) ◆ swing-status
- **Notes:** Kept: today's card and size, a rare made an uncommon as the spine says, on two steps for three (Lifesteal goes). Seen: on one foe it reaches Chill's cap alone in four or five swings.

### Lamprey claws
- **Is:** fist · uncommon
- **Card:** Each extra strike its wearer lands heals it for a tenth of its max HP.
- **Stats:** Double strike medium · HP +1 (2 of 2)
- **Numbers:** 10% of the wearer's max HP an extra strike: 200 for a Stormcaller, 300 for a Monk, 400 for a Vampire, before the piece's own HP step. My value: a little over one pulse of Regen (`STATUS.regen`), the scale's own size for a heal that's seen.
- **Code:** as today's Brass knuckles' trigger (an extra strike landing), with a heal from the holder's max HP as today's Prior's mace
- **Serves:** Pact 1 ●●, Cuts 1 ●
- **Notes:** An extra strike is Double strike's second strike, by round 1's ruling, so the heal comes as often as its wearer's Double strike: on about half a Monk's swings with the claws' own step, and a quarter of a Vampire's or a Stormcaller's. Arc's second hit isn't one. Resized for that: the first hand-in had a twentieth, counted on every extra hit of a swing; at a quarter of the swings a twentieth wouldn't be seen (*Least sure*). Much bigger than Tithing leathers' "a little" a hit, since it fires far less often; both can sit on a Monk. Both steps feed it: the chance of the strike, and the bar the heal is read from.

### Gorged claws
- **Is:** fist · rare
- **Card:** While its wearer is below half its max HP, its basic attacks come a third faster.
- **Stats:** Double strike medium · Lifesteal medium · HP +1 (3 of 3)
- **Numbers:** a third faster: Attack speed +33 while it holds, as today.
- **Code:** as today's Gorged claws
- **Serves:** Pact 2 ●●●, Cuts ●● ⚙ brink (half)
- **Notes:** Kept: today's card and size. Stats moved to Blood Pact's lean (HP for Evasion): the unit that sits below half wants the bar and the drink.

### Bellows wraps
- **Is:** fist · rare
- **Card:** Each hit its wearer lands on a burning foe adds Burn to it: a tenth of what it holds.
- **Stats:** Double strike medium · Attack speed medium · Evasion medium (3 of 3)
- **Numbers:** a tenth of the Burn stacks on the foe when the hit lands, the line's own size. Nothing scales it but the fire.
- **Code:** a rider whose stacks are read off its target's own Burn (see *Code support*); today's Cinderheart staff reads a target's Burn the same way, for damage
- **Serves:** Bonfire 2 ●●●, Cuts ●
- **Notes:** It reads the fire and leaves it; it lays none itself. Seen on a fire worth having: at 20 stacks each blow steps the counter up by 2, at 5 by half a stack. On a plain fist it holds a fed fire about a fifth higher; with a second strike, Haste or Hummingbird charm it can out-run Burn's drain (*Loops*). Evasion as the third step: a feeder that falls is the fire gone.

### Still hand
- **Is:** fist · rare
- **Card:** Each hit its wearer lands on a Stunned foe strikes twice. The second strike is the same damage again, and is never repeated: not by this, and not by anything else.
- **Stats:** Double strike medium · Attack speed medium · Lifesteal medium (3 of 3)
- **Numbers:** the second strike deals what the first dealt. A Stun lasts `STATUS.stun`: one or two swings of a fist, or a whole Burning fist.
- **Code:** 16
- **Serves:** Snap 2 ●●, Cuts ●●, Landslide ● ◆ held
- **Notes:** Today's legendary, changed as the line says and made a rare. The second strike is a hit that lands a second time, as `fill/shared.md` defines one: no new dodge or crit roll; Bleed pays on it, Lifesteal drinks from it, a count of hits counts it; it carries none of the first's statuses and isn't an extra strike. Where another card would repeat the same hit, each repeats the first once. A Double strike on a Stunned foe is four hits. Attack speed gets more blows into the window, and every doubled blow drinks twice.

### Forked knuckles
- **Is:** fist · rare
- **Card:** Its basic attacks also hit a second, random foe for half, carrying what the swing carries. Each time one of its basic attacks hits a foe other than its target, its wearer regains a twentieth of its max MP.
- **Stats:** Double strike medium · Attack speed medium · HP +1 (3 of 3)
- **Numbers:** the leap: half the swing's damage. MP: 5% of the wearer's max MP for each other foe a basic attack hits (about 115 for a Stormcaller, 85 for a Vampire, 40 for a Monk).
- **Code:** as today's Sweeping blade for the second foe; 12 for what it carries; the MP as today's Glint wand's gain, on an extra hit that lands on a foe other than the swing's target (see *Code support*)
- **Serves:** Storm 2 ●●●, Barrage ●●, Cuts ● ⚙ red rain (half), resonance (half) ◆ wide-hit, free-cast
- **Notes:** The leap is an extra hit of its own, not an extra strike: it carries what the swing carries because the card says so, and nothing that reads extra strikes reads it. The MP counts every other foe a swing reaches, by this piece, by Arc or by a seat: a Stormcaller's swing reaches two and pays twice, about what Recharge pays a foe (*Challenges*, 2). Double strike's second strike lands on the target and pays nothing. Against one foe it does nothing at all, which is its shape. HP as the third step: the unit that fights a crowd is hit by one.

### Flurry wraps
- **Is:** fist · legendary
- **Card:** Its extra strikes can strike again: each one rolls Double strike for one more, at most two more after the first, and each is a fifth weaker than the strike before it.
- **Stats:** Double strike high · Attack speed medium · Lifesteal medium (4 of 4)
- **Numbers:** each strike in the chain deals four fifths of the one before; at most three extra strikes a swing. "A little weaker" in the line is today's fifth.
- **Code:** as today's Flurry wraps
- **Serves:** Cuts 3 ●●●, Storm ●●, Pact ●
- **Notes:** Kept: today's card, size and stats. The card gives its count, as *Chains end* asks. An extra strike is Double strike's second strike, and what this chains from it: the card and the build agree, and a swing rolls once. Arc's second hit or a leap doesn't start it. A Monk wearing it lands about one and a third extra strikes a swing.

### Answering thunder
- **Is:** fist · legendary
- **Card:** Each time a foe that holds Shock acts, its wearer strikes that foe with its weapon, unless the wearer is Stunned or winding up an ability.
- **Stats:** Double strike medium · Attack speed medium · Lifesteal medium · Evasion medium (4 of 4)
- **Numbers:** each strike is a hit of its basic attack's size (about 450 at Attack 4), in whatever shape its wearer's basic attacks have. One strike for each action of each charged foe, with no limit.
- **Code:** 17; 12 for what the strike carries
- **Serves:** Storm 3 ●●●, Cuts ●●, Toll ●
- **Notes:** Written with the spine's "strikes with its weapon", as round 1 rules: a hit, not a basic attack, so Arc's second hit and Double strike don't fire from it, and it leaves the wearer's own swing where it was. It's aimed at a named foe, so a Taunt doesn't turn it. It carries what the swing carries, so a Stormcaller's answer charges the foe again, and a foe once charged is answered for the rest of the fight. "If it's free to" is written out: not Stunned, not in a wind-up. Its steps are spread across the kind's leans, since no stat speeds a strike that runs on the foes' clock.

## Wand

### Quickbeam wand
- **Is:** wand · common
- **Card:** Nothing beyond its stats.
- **Stats:** Cooldown medium · Attack speed medium (2 of 2)
- **Numbers:** none of its own: `SPECIAL.cooldown.medium`, `SPECIAL.attack_speed.medium`.
- **Code:** none
- **Serves:** Bonfire, Snap, Storm, Cuts
- **Notes:** The spine's common that leans to Cooldown and Attack speed. Attack speed is the first stat of a status on a swing (the Hexer's Chill, Kindling's fire), on a wand as anywhere. New name: today's Whipcrack wand carried Attack, not Attack speed.

### Hazel wand
- **Is:** wand · common
- **Card:** Nothing beyond its stats.
- **Stats:** Cooldown medium · MP regen +1 (2 of 2)
- **Numbers:** none of its own: `SPECIAL.cooldown.medium`, `MP_REGEN_STEP`.
- **Code:** none
- **Serves:** Barrage
- **Notes:** The spine's common that leans to Cooldown and MP regen: Barrage's first stat, mana in fights. New name: today's Birch wand carried Attack and MP regen.

### Spark wand
- **Is:** wand · uncommon
- **Card:** Its basic attacks add a few Burn (from Attack).
- **Stats:** Cooldown medium · Attack speed medium · Attack +1 (3 of 3)
- **Numbers:** a few: `STACKS.few`, from Attack (2 at Attack 3, about 3 at Attack 4, 3 or 4 at Attack 5), every swing (`KIND_SPEED.wand`).
- **Code:** as today's Spark wand
- **Serves:** Bonfire 1 ●●, Cuts ● ⚙ lead's colour (half), every colour (half) ◆ swing-status
- **Notes:** Kept: today's card and size, a rare made an uncommon as the spine says, on three steps for four. Seen: kept on one foe, the fire it holds deals about twice the wand's own blows. Reads as Kindling and Hex of flames do, which the spine keeps.

### Jolt wand
- **Is:** wand · uncommon
- **Card:** Its basic attacks add a few Shock (from Attack).
- **Stats:** Cooldown medium · Attack speed medium · Attack +1 (3 of 3)
- **Numbers:** a few: `STACKS.few`, from Attack, every swing.
- **Code:** as today's Jolt wand, with a few from Attack in place of one stack
- **Serves:** Storm 1 ●●, Toll ● ⚙ lead's colour (half), every colour (half), held charge (half) ◆ swing-status
- **Notes:** Today's added one Shock: changed, because one stack pays once, for less than a fifth of the wand's own blow, and is gone. At a few, a foe that acts between two swings pays about half a swing more.

### Tithe wand
- **Is:** wand · uncommon
- **Card:** Each basic attack it lands gives the ally with the least MP some MP: 3% of its wearer's Attack.
- **Stats:** Cooldown medium · Attack speed medium · MP regen +1 (3 of 3)
- **Numbers:** 3% of the wearer's Attack a swing: 90 MP from a Bard, 120 from a Hexer, 150 from a Pyromancer; about 18 MP a tick at Attack 4. My value: the scale has no word for an amount of MP.
- **Code:** as today's Glint wand's MP gain, on a basic attack landing, to the ally with the least MP (today's lowest share of max MP)
- **Serves:** Barrage 1 ●● ⚙ mana as armour (half) ◆ free-cast
- **Notes:** Over a regular fight it gives about what one Clarity does, or three and a half steps of MP regen, to someone else. No "other" in the line, so when the wearer has the least MP it keeps the MP, and that isn't a gift (Glimmer robe on the same unit doesn't answer it). A Bard's Refrain and this give on the same swing, to different picks. Attack speed is the step that tithes more often.

### Chain wand
- **Is:** wand · rare
- **Card:** Its basic attacks also hit up to two other random foes, each for half, carrying what the swing carries.
- **Stats:** Cooldown medium · Attack speed medium · Attack +1 · MP regen +1 (4 of 4)
- **Numbers:** each extra hit: half the swing's damage (about 250 at Attack 4).
- **Code:** as today's Chain wand; 12 for what it carries
- **Serves:** Snap 2 ●●, Bonfire 2 ●●, Storm ●●, Cuts ●● ⚙ red rain (half) ◆ wide-hit
- **Notes:** Kept: today's card and size, with "carrying what the swing carries" added as the line says. That clause is the piece: a Hexer's swing chills three foes. Its two extra hits are the chain's own, not extra strikes: nothing that reads extra strikes reads them.

### Mimic wand
- **Is:** wand · rare
- **Card:** Its basic attacks carry whatever statuses the basic attacks of the other ally with the highest Attack add to their target. They're added as this wand's own would be: on the same condition, with stacks from its own wearer's stats. What it borrows isn't borrowed on by anyone else.
- **Stats:** Cooldown medium · Attack speed medium · Attack +2 (4 of 4)
- **Numbers:** none of its own: each borrowed status keeps its word (a few, several) and is read off the wand's wearer.
- **Code:** 12 (a wand that carries another unit's basic-attack riders); a borrowed rider keeps its condition (see *Code support*)
- **Serves:** Bonfire 2 ●●, Snap 2 ●●, Storm 2 ●●, Cuts ● ⚙ lead's colour (key), every colour (half)
- **Notes:** What it borrows is what "carrying what the swing carries" covers: the statuses that ally's basic attack lays on its target, from its passive, its gear, its seat or a storm, and no second target, boost or Refrain. A rider with a condition comes with it: Lacerate's Bleed on the wand's own crits, Zeal's Burn on a judged foe. Its own extra hits carry the borrowed riders as part of its swing; another unit that copies its swing (a Follower, a second Mimic wand) gets only what's the wearer's own (*Challenges*, 6). It does nothing beside an ally whose swing lays nothing, and the ally is picked by Attack. Attack +2, since the borrowed stacks are read off its wearer.

### Wildmagic wand
- **Is:** wand · legendary
- **Card:** Each of its basic attacks adds a few stacks (from Attack) of one of Burn, Chill, Shock, Bleed and Sunder, picked at random.
- **Stats:** Cooldown high · Attack speed medium · Attack +1 · MP regen +1 (5 of 5)
- **Numbers:** a few: `STACKS.few`, from Attack (2 at Attack 3, about 3 at Attack 4), of one affliction in five, each as likely.
- **Code:** as today's Wildmagic wand, with stacks from Attack
- **Serves:** exotic, Bonfire ●, Snap ●, Storm ●, Cuts ● ⚙ every colour (key)
- **Notes:** Kept: today's card. One change: its few is read from Attack, as every other rider in the kind is, where today's is a flat 2 (the same at Attack 3, nearly one more for a Hexer). Cooldown high brings Malison round, which is what reads the row.

### Baton
- **Is:** wand · legendary
- **Card:** Each basic attack it lands brings its wearer's first-slotted ability round sooner: a fifth of the wait that's left.
- **Stats:** Cooldown medium · Attack speed high · Cast speed medium · MP regen +1 (5 of 5)
- **Numbers:** a fifth of that ability's remaining cooldown, each landed basic attack, the line's own size. On the wand's own swing a medium cooldown comes round about a quarter sooner and a long one a third; with Hummingbird charm, about two fifths.
- **Code:** 7 (a swing that cuts a named ability's cooldown)
- **Serves:** Barrage 3 ●●●, Cuts ●● ⚙ spell on the swing (key)
- **Notes:** Basic attacks only: an extra strike or a strike with its weapon cuts nothing. A fifth of what's left never reaches nothing, so it has no loop of its own. Attack speed high is the step that drives it, and it's why speed has a payoff on a caster.

## Sword

### Arming sword
- **Is:** sword · common
- **Card:** Nothing beyond its stats.
- **Stats:** Attack +1 (1 of 1)
- **Numbers:** none of its own: `STEP`.
- **Code:** as today's Arming sword
- **Serves:** Hunt, Storm, Snap
- **Notes:** The spine's common that leans to Attack and Crit chance, on one step: the signature. Attack is what the Valkyrie's and the Hexer's stacks and blows are read from, so it's the first stat of the Storm and Cold Snap on a sword, and of the Hunt's strike. Today's piece, name kept.

### Gilded sword
- **Is:** sword · common
- **Card:** Nothing beyond its stats.
- **Stats:** HP +1 (1 of 1)
- **Numbers:** none of its own: `HP_STEP`.
- **Code:** as today's Gilded sword
- **Serves:** Toll, Pact, Barrage
- **Notes:** The spine's common that leans to Attack and HP or Aggro, on one step: HP, so the two differ. The anchor's first stat, the well's, and the bar Blood Pact spends. Today's piece, name kept.

### Rimed blade
- **Is:** sword · uncommon
- **Card:** Its basic attacks add a few Chill (from Attack).
- **Stats:** Attack +1 · Defense +1 (2 of 2)
- **Numbers:** a few: `STACKS.few`, from Attack, every swing (`KIND_SPEED.sword`): about 3 for a Valkyrie or a Hexer, 2 for a Knight with the blade's own step.
- **Code:** as today's Spark wand, with Chill
- **Serves:** Snap 1 ●● ⚙ lead's colour (half), every colour (half) ◆ swing-status
- **Notes:** The same sentence as Sleet dirk's, which no unit can hold beside it. On a Hexer it lands beside Cold hex, and the two reach Chill's cap in two swings on one foe. On a Knight it's small (*Challenges*, 8). The blade's Attack step is the one the rider reads; Defense is the wall's.

### Drawn steel
- **Is:** sword · uncommon
- **Card:** The first hit its wearer lands on each foe in a fight deals double.
- **Stats:** Attack +1 · Crit chance +1 (2 of 2)
- **Numbers:** double, once a foe, each fight.
- **Code:** today's Weeping kris's marker for a first hit on each foe, as the condition of a doubled hit
- **Serves:** Hunt 1 ●●, Landslide ●
- **Notes:** Keeps the name only: today's first swing at once is Opening shot's now. Any hit counts, so it's worth most when the first hit on a foe is the wearer's biggest: a Knight's Shield bash, a Valkyrie's Skyfall. Malison, once it's a hit on every foe, is doubled on each foe it's the Hexer's first hit on.

### Mercy's edge
- **Is:** sword · uncommon
- **Card:** Each basic attack it lands heals the ally with the lowest share of max HP for a third of the damage dealt.
- **Stats:** Attack +1 · HP +1 (2 of 2)
- **Numbers:** a third of the damage the swing dealt, after Defense: about 190 a swing from a Knight, 255 at Attack 4.
- **Code:** as today's Censer mace
- **Serves:** Pact 1 ●●, Toll ●, Cuts ● ⚙ brink (half) ◆ lowest-ally
- **Notes:** Today's Censer mace's effect and size, on a sword. The ally can be its wearer. Seen: a green number on the most hurt ally with every swing, a twentieth to a tenth of its bar.

### Gravemark
- **Is:** sword · rare
- **Card:** Its wearer's hits on a Marked foe deal half again as much. When a Marked foe falls and no foe is left Marked, the foe with the lowest current HP is Marked.
- **Stats:** Attack +2 · Crit chance +1 (3 of 3)
- **Numbers:** half again as much (+50%), as today. The Mark it moves is its wearer's, at Marked's own length.
- **Code:** as today's Gravemark, without the Mark its basic attacks laid
- **Serves:** Hunt 2 ●●●
- **Notes:** Today's legendary made a rare, less its own first Mark, as the line says: it pays on a Mark and moves one, and never starts one (*Challenges*, 7). One step fewer than today (Defense goes).

### Provoking blade
- **Is:** sword · rare
- **Card:** When one of its basic attacks lands, the foe it hit makes its own next basic attack at once, at whoever that foe would have picked.
- **Stats:** Attack +1 · Aggro +1 · Defense +1 (3 of 3)
- **Numbers:** none: one call for each swing that lands (`KIND_SPEED.sword`). The called blow is the foe's own, at its full size.
- **Code:** 3; 23 for a call that doesn't stack
- **Serves:** Storm 2 ●●●, Toll 2 ●●●, Snap ● ⚙ goad (key)
- **Notes:** The foe's swing is ready at once and its wait starts again from that swing; a foe that's Stunned or winding up swings as soon as it's free. It picks as it always does (Taunt, draw, Hidden), so the blow isn't always the wearer's to take. Only a basic attack calls: an extra strike or a strike with its weapon doesn't. A call buys about half a swing from a foe in a pack, and sets a slow boss swinging at the sword's pace. The blade lays nothing of its own; on a Hexer the called foe is also chilled. Aggro and Defense, so the wearer is the one answered and stands it.

### Oathkeeper
- **Is:** sword · rare
- **Card:** While its wearer is Taunting, its basic attacks also hit every other foe, carrying what the swing carries.
- **Stats:** Attack +1 · HP +1 · Defense +1 (3 of 3)
- **Numbers:** each extra hit is the swing's full damage, as today (about 580 a foe from a Knight).
- **Code:** as today's Oathkeeper; 12 for what it carries
- **Serves:** Toll 2 ●●●, Storm ●●, Cuts ●●, Hunt ● ⚙ red rain (half), reaping (half) ◆ wide-hit
- **Notes:** Today's legendary made a rare, with "carrying what the swing carries" added, as the line says. The Knight's Stand fast keeps it on about two thirds of a fight; the Hexer and the Valkyrie need a Taunt from a piece or a version. Its extra hits are extra strikes.

### Bloodletter
- **Is:** sword · rare
- **Card:** Each of its swings pays HP: a twentieth of its wearer's max HP. The swing deals extra damage equal to four times what it paid. The price never takes its wearer below 1 HP.
- **Stats:** Attack +1 · HP +2 (3 of 3)
- **Numbers:** the price: 5% of max HP a basic attack. The extra: four times the price paid (`FLAT_STACKS.several` for "several times"), a fifth of max HP when it's paid in full: 600 on a 770 swing for a Valkyrie or a Hexer, 1,000 on a 580 swing for a Knight, before the piece's HP steps.
- **Code:** 20 (a price on a swing: today's pay, as Blood gift's); a weapon term from max HP as today's Mountainfall; the extra reads the price actually paid (see *Code support*)
- **Serves:** Pact 2 ●●●, Landslide ● ⚙ brink (key)
- **Notes:** Paid as the swing is made, landed or dodged, and not by an extra strike. It isn't damage: a Shield isn't spent and nothing reacts to it but what reads a price paid (Bloodstone reliquary, Idol of the blood-well). The extra is part of the swing's hit. Unanswered, the price takes about a quarter of the bar in a regular fight and half in a boss fight, which is what holds its wearer lowest; one step of Lifesteal gives most of it back. A Valkyrie's Shield from hits grows faster than the price falls. HP +2 is both sides of the trade.

### Stormbrand
- **Is:** sword · legendary
- **Card:** Each hit its wearer lands deals extra damage for each Shock stack on the field, whoever holds it (from Attack). The Shock stays.
- **Stats:** Attack +2 · Crit chance +2 (4 of 4)
- **Numbers:** 0.5% of the wearer's Attack for each stack on any unit: 20 a stack at Attack 4, 30 at Attack 6. One foe at Shock's cap (`STATUS.shock.cap`) adds 800 to 1,200 to every hit, which is the sword's own swing again or more. My value.
- **Code:** 18 (the field's whole Shock)
- **Serves:** Storm 3 ●●●, Toll ● ⚙ held charge (key)
- **Notes:** The extra is part of each hit: it meets Defense and can crit. Every hit takes it, so the three hits of a Gale spear each do, and a Malison does on every foe. "Anywhere on the field" is read as written: Shock on an ally counts too (*Challenges*, 10). Attack +2 is the stat its extra reads.

## Spear

### Pennon spear
- **Is:** spear · common
- **Card:** Nothing beyond its stats.
- **Stats:** Aggro +1 (1 of 1)
- **Numbers:** none of its own: `AGGRO_STEP`.
- **Code:** none
- **Serves:** Toll
- **Notes:** The spine's common that leans to Aggro and Defense, on one step: the signature. The Toll's first stat, the draw, and where a Hoplite first buys one. New name: today's Ironwood spear carried Defense.

### Boar spear
- **Is:** spear · common
- **Card:** Nothing beyond its stats.
- **Stats:** Attack +1 (1 of 1)
- **Numbers:** none of its own: `STEP`.
- **Code:** none
- **Serves:** Hunt, Storm
- **Notes:** The spine's common that leans to Aggro and Attack, on one step: Attack, so the two differ. The Hunt's first stat on a spear, and what the Valkyrie's Shock is read from. New name: today's Partisan carried Crit chance.

### Jolt spear
- **Is:** spear · uncommon
- **Card:** Every hit its wearer lands adds a few Shock (from Attack): swings, extra strikes and abilities alike.
- **Stats:** Aggro +1 · Attack speed medium (2 of 2)
- **Numbers:** a few: `STACKS.few`, from Attack, on every hit (about 3 at Attack 4, 3 or 4 for a Hoplite). A plain few on an ability's hit too, not an ability's doubled count.
- **Code:** a reaction to any hit landing, as today's Thousandth cut's, applying Shock as today's Spark wand applies Burn
- **Serves:** Storm 1 ●●, Toll ● ⚙ lead's colour (half), held charge (half) ◆ swing-status
- **Notes:** Seen where its wearer hits many: a Hoplite's shove charges every foe at once, a Gale spear adds three charges to its own three. What a copy of its swing carries is the part on the basic attack.

### Trophy spear
- **Is:** spear · uncommon
- **Card:** When its wearer lands a killing blow, it gains a Shield equal to a quarter of its Attack.
- **Stats:** Aggro +1 · Attack +1 (2 of 2)
- **Numbers:** 25% of the wearer's Attack a kill: 1,000 at Attack 4, 1,250 at Attack 5, up to the Shield's cap (`STATUS.shield.capShare`). My value.
- **Code:** as today's Trophy spear, with a Shield from Attack (as today's Ironbound maul's) in place of the Guard
- **Serves:** Hunt 1 ●●, Cuts ● ⚙ detonation (half) ◆ kill-pays, shield-by-doing
- **Notes:** Today's piece, its Guard made a Shield as the line says. Sized to be seen as a kill's pay: a grey bar a third or more of a Valkyrie's or a Monk's health. Same steps as today.

### Long spear
- **Is:** spear · uncommon
- **Card:** Its basic attacks ignore Taunt: they pick among every foe, Taunting or not.
- **Stats:** Aggro +1 · Crit chance +1 (2 of 2)
- **Numbers:** none.
- **Code:** as today's Misericorde
- **Serves:** Hunt 1 ●●, Storm ●
- **Notes:** Today's Misericorde's effect, on a spear. A Mark is followed past a Taunting foe. It shows only where a foe Taunts.

### Hunting spear
- **Is:** spear · rare
- **Card:** Each hit its wearer lands on a foe below half its max HP lands twice. The second landing is the same damage again, and is never repeated: not by this, and not by anything else.
- **Stats:** Aggro +1 · Attack +1 · Crit chance +1 (3 of 3)
- **Numbers:** the second landing deals what the first dealt. The foe is below half when the hit lands, before its damage.
- **Code:** 16
- **Serves:** Hunt 2 ●●●, Cuts ●●
- **Notes:** Keeps the name only. The second landing is a hit (a Valkyrie's Shield grows from it, Bleed pays on it), carries none of the first's statuses and isn't an extra strike (*Challenges*, 1). If it fells the foe, that's its wearer's killing blow.

### Parrying spear
- **Is:** spear · rare
- **Card:** Each time its wearer dodges a hit, the other ally with the highest Attack strikes the attacker with its weapon.
- **Stats:** Aggro +2 · HP +1 (3 of 3)
- **Numbers:** none of its own: one strike for each dodge, a hit of that ally's basic attack's size, with no limit.
- **Code:** 17 (a strike by an ally when the wearer dodges)
- **Serves:** Toll 2 ●●●, Cuts ●● ⚙ riposte (key)
- **Notes:** The strike is the ally's: it carries what that ally's swing carries, its Lifesteal drinks, and it isn't a basic attack. Read with the size of the ally's basic attack as it stands, so beside a Hoplite each dodge is a doubled blow. It does nothing for a wearer that can't dodge, which is the Hoplite without an Evasion piece. Aggro +2 so the dodger is the one aimed at; HP for the blow that lands.

### Storm pike
- **Is:** spear · rare
- **Card:** Every fifth hit its basic attacks and extra strikes land also hits every other foe: a light hit (from Attack), carrying what the swing carries. The flash's own hits aren't counted.
- **Stats:** Aggro +1 · Attack speed medium · Attack +1 (3 of 3)
- **Numbers:** the count: five landed basic attacks and extra strikes. The flash: light (`HIT.light`), from the wearer's Attack, on every foe but the one just hit: about 1,160 a foe at Attack 4.
- **Code:** today's Volley bow's count of swings, to five and counting extra strikes; today's Storm pike's flash, on every other foe; 12 for what it carries
- **Serves:** Storm 2 ●●●, Cuts ●●, Bonfire ●, Hunt ● ⚙ red rain (half), reaping (half) ◆ wide-hit
- **Notes:** Today's legendary made a rare and reworked as the line says: its own count in place of Charges, swings and extra strikes in place of every hit. Written as the line stands, but the count is too slow on a spear to be seen (*Challenges*, 2). Attack speed brings the count round; Attack is what the flash is read from.

### Sarissa
- **Is:** spear · legendary
- **Card:** Each of its basic attacks also hits every foe that has hit its wearer since its last basic attack, each for the swing's full damage.
- **Stats:** Aggro +2 · Defense +1 · HP +1 (4 of 4)
- **Numbers:** each extra hit is the swing's full damage (about 880 at Attack 4; a Hoplite's is doubled by Phalanx).
- **Code:** 17 (at every foe that has hit the wearer since its last swing), with the memory it names
- **Serves:** Toll 3 ●●●, Storm ●●, Landslide ●●
- **Notes:** A foe has hit the wearer when a hit of its own landed on it; a dodged blow and Thorns don't count. The memory is emptied each time the wearer's basic attack resolves. The foe the swing was aimed at is hit once. The extra hits are extra strikes, and as the line stands they don't carry what the swing carries (*Challenges*, 4). The slower the swing, the more foes each one answers: it's a Hoplite's piece first.

## Axe

### Hand axe
- **Is:** axe · common
- **Card:** Nothing beyond its stats.
- **Stats:** Lifesteal medium (1 of 1)
- **Numbers:** none of its own: `SPECIAL.lifesteal.medium`.
- **Code:** as today's Hand axe
- **Serves:** Pact
- **Notes:** The spine's Lifesteal common: Blood Pact's sign on an Assassin, and more of it on a Vampire. Today's piece, name kept.

### Cleaver
- **Is:** axe · common
- **Card:** Nothing beyond its stats.
- **Stats:** Attack +1 (1 of 1)
- **Numbers:** none of its own: `STEP`.
- **Code:** as today's Cleaver
- **Serves:** Hunt
- **Notes:** The spine's Attack common: the Hunt's first stat on the kind whose swing reads Attack most. Today's piece, name kept.

### Reaver's axe
- **Is:** axe · uncommon
- **Card:** When its wearer lands a killing blow, the next hit it lands deals double.
- **Stats:** Crit damage medium (1 of 1)
- **Numbers:** double, on one hit, swing or ability. A second kill before that hit lands adds nothing.
- **Code:** today's kill trigger (Trophy spear's), setting a next-hit buff as today's Spellbinder's, read by any hit
- **Serves:** Hunt 1 ●●, Landslide ● ◆ kill-pays
- **Notes:** Today's piece, its few Might made a doubled hit as the line says: a few Might was never seen. Its one step is the Hunt's, Crit damage, so the kind's three uncommons carry three different stats. It reads as half of Night's edge, which the same Assassin can wear (*Challenges*, 3).

### Hungry axe
- **Is:** axe · uncommon
- **Card:** Its wearer's Lifesteal is doubled on hits against a foe below half its max HP.
- **Stats:** Lifesteal medium (1 of 1)
- **Numbers:** double the Lifesteal its wearer has, from everything it wears and is. On an Assassin that's this piece's own step: a tenth made a fifth, about 240 a swing.
- **Code:** as today's Hungry axe's reaction on a foe below half, with the heal read from the wearer's Lifesteal in place of a fixed tenth (see *Code support*)
- **Serves:** Pact 1 ●●, Hunt ●
- **Notes:** Today's piece, changed as the line says. Its one step has to be Lifesteal: an Assassin has none, and double nothing is nothing. With the Vampire's Bloodlust the two doublings add, as boosts do: three times its Lifesteal.

### Ragged axe
- **Is:** axe · uncommon
- **Card:** Every hit its wearer lands adds a few Bleed (from Attack).
- **Stats:** Attack +1 (1 of 1)
- **Numbers:** a few: `STACKS.few`, from Attack, on every hit (about 3 at Attack 4, 4 at Attack 5 with the axe's own step).
- **Code:** as Jolt spear: a reaction to any hit landing, applying Bleed
- **Serves:** Cuts 1 ●● ⚙ lead's colour (half) ◆ swing-status
- **Notes:** Seen: the next hit on that foe, anyone's, pays 420 to 500 in red. A slow kind that opens for the fast ones to cash. What a copy of its swing carries is the part on the basic attack. Attack is the stat its Bleed reads.

### Executioner's axe
- **Is:** axe · rare
- **Card:** Its wearer's hits on a foe below a quarter of its max HP deal double.
- **Stats:** Lifesteal medium · Attack +1 (2 of 2)
- **Numbers:** double, below 25% of the foe's max HP, as today.
- **Code:** as today's Executioner's axe
- **Serves:** Hunt 2 ●●●
- **Notes:** Kept: today's card, size and stats.

### Thirsting axe
- **Is:** axe · rare
- **Card:** Each killing blow its wearer lands heals it for a fifth of its max HP.
- **Stats:** Lifesteal medium · Crit damage medium (2 of 2)
- **Numbers:** 20% of the wearer's max HP a kill, as today.
- **Code:** as today's Thirsting axe
- **Serves:** Pact 2 ●●, Hunt 2 ●● ◆ kill-pays
- **Notes:** Kept: today's card, size and stats, one step for each of its two roads.

### Overkill axe
- **Is:** axe · rare
- **Card:** When its wearer lands a killing blow, what the blow has left over lands on the foe with the lowest current HP. It carries once: if that fells the second foe too, nothing carries on.
- **Stats:** Attack +1 · Crit damage medium (2 of 2)
- **Numbers:** all of what's left over: the blow's damage past the HP its foe had left. It lands as the same hit, so it meets the second foe's Defense.
- **Code:** 5
- **Serves:** Hunt 2 ●●●, Landslide ●● ⚙ avalanche (key)
- **Notes:** Any killing blow carries, swing or ability. The second fall is the wearer's killing blow too, so what pays on a kill pays again; only the carry stops. Both steps are the blow's, and it's the one piece in the kind without its signature: on two steps there's no room for both, and the blow is what it reads.

### The Red Feast
- **Is:** axe · legendary
- **Card:** While its wearer is below half its max HP, its hits deal double and its Lifesteal is doubled. When a fight is won, its wearer, if it's standing, is healed up to half its max HP.
- **Stats:** Lifesteal high · HP +1 (3 of 3)
- **Numbers:** double, and double, below 50% of max HP; healed to 50% of max HP at a won fight's end if it's below that. The line's own sizes.
- **Code:** boosts and a Lifesteal change switched as today's Bloodlust is; 20 (a heal as a fight is won)
- **Serves:** Pact 3 ●●●, Cuts ● ⚙ brink (half)
- **Notes:** Keeps the name only. Its own Lifesteal step is high so it works on an Assassin alone: a fifth, two fifths below half. With Bloodlust the doublings add: three times. Its own drinking lifts it back over half and switches it off, which is the build's see-saw. A fallen wearer isn't healed. The last drink is one of the spine's four bends.

### Headsman's axe
- **Is:** axe · legendary
- **Card:** Its basic attacks come half as often and deal double. A killing blow its wearer lands readies its next basic attack at once.
- **Stats:** Lifesteal medium · Crit damage high (3 of 3)
- **Numbers:** half as often, double, as today (the halved swing is its shape and counts no step). A kill by any hit readies the next swing.
- **Code:** as today's Headsman's axe
- **Serves:** Hunt 3 ●●●, Landslide ●● ◆ heavy-blow, kill-pays
- **Notes:** Kept: today's card and size. Stats changed: Crit damage high is the legendary's step, for a blow that comes rarely and has to end something (today's had Crit damage medium and HP). "At once" doesn't stack.

## Challenges

1. **Words this share needed and `fill/shared.md` doesn't have.** Each is used by other shares too, so each wants one definition. What I wrote to:
   - **"Its hits", on a weapon.** Every hit its wearer lands: a swing, an extra strike or an ability's hit, as the spine glosses it on Jolt spear. The cards say "its wearer's hits". It matters most on Bloodscent knife, Ambush knife, Still hand, Hunting spear, Stormbrand, Ragged axe and Bellows wraps. If any of those lines meant the weapon's own swings, the card shrinks a lot.
   - **"Extra strike."** Any hit a basic attack makes past its first: Double strike's second strike, Arc's second hit, and the extra hits a piece or a seat adds to a swing (a leap, a sweep, a flash). Not a strike "with its weapon", not a hit landed a second time, not an ability's hits. Lamprey claws, the three fist riders, Storm pike's count and Echo charm all turn on it. By it, a Stormcaller's Arc heals it through Lamprey claws on every swing.
   - **A hit that lands a second time** (Still hand, Hunting spear; Twinfall, The mountain and Dragon's tooth elsewhere). I wrote: the same damage again on the same foe, at once, with no new dodge or crit roll; a hit, so Bleed pays, Lifesteal drinks and counters count; it carries none of the first hit's statuses; it isn't an extra strike; nothing repeats it. Where two things would each repeat one hit (Still hand in The mountain's Peak seat), I read that each repeats the first once: three landings.
   - **"Nearly always crit"** (Ambush knife; Vulture's skull elsewhere): nine times in ten, set, whatever the wearer's Crit chance. **"Crit far more often"** (Bloodscent knife; Spur's Opener elsewhere): 50 more Crit chance, added.
   - **"The ally with the least MP"** (Tithe wand, and a dozen lines elsewhere) isn't in the vocabulary's table of target phrases. Today's data reads it as the lowest share of max MP, the wearer included.
2. **Storm pike's count doesn't come round.** Five landed swings on a spear is 40 to 47 ticks: once in a regular fight for a Valkyrie, and never for a Hoplite, whose Phalanx halves its swings (80 to 94 ticks). Only a Monk's second strikes, Hummingbird charm or a Squall seat bring it under 30. As a rare it can't be the Storm's second rung at that pace. Either count every hit its wearer lands, as today's does (a Gale spear is three, a shove is one a foe), or make it every third. I wrote the line as it stands.
3. **Reaver's axe reads as half of Night's edge.** "When its wearer lands a killing blow, the next hit it lands deals double" is the mythic's second clause, and the Assassin can wear both. By "the same sentence" it passes, since the mythic also hides. Together the two doubles add: triple. Worth a ruling.
4. **Sarissa's extra hits: do they carry?** The five rares that fan a swing out all say "carrying what the swing carries"; Sarissa's line doesn't. I wrote it as not carrying, at the swing's full damage. If it should carry, one clause is added.
5. **Answering thunder: "strikes it with a basic attack".** I wrote the spine's defined "strikes with its weapon", so it isn't a basic attack: no Arc, no Double strike, nothing that counts swings. If a true basic attack out of turn was meant, the card changes, and Baton, Bell of the hour and Forked knuckles' MP would all answer it. It has no limit: eight charged wolves are eight strikes a round of swings.
6. **Mimic wand and the chain rule.** "What a piece copies is never repeated again" could mean its own bell or its own extra hit doesn't carry the riders it borrowed. I wrote it the other way: borrowed riders are part of its own swing for its own extra hits, and are never passed on to another unit that copies its swing (a Follower, a Collector, a second Mimic wand). That needs to match how The standard and Toll gate are written. It's also the card with the most to explain: which statuses count, the condition coming with them, and whose stat sizes them.
7. **Gravemark starts no Mark, and none of its wearers has one.** As the line stands it pays on a Mark and moves one. A Knight, Hexer or Valkyrie holding it in a party with no marker has three stat steps. That follows from one Mark from gear; flagged as a piece that does nothing alone.
8. **Rimed blade on a Knight.** A few from Attack 2 or 3 is one or two stacks a swing, barely ahead of Chill's own thaw, and the line's *Sees* names the wall first. The spine's rule gives a medium kind a few. If the wall is meant to be a real second source of cold, the word wants to be several; I kept the line's.
9. **Flurry wraps and the wider "extra strike".** Its line says "its extra strikes can strike again". As built it chains Double strike's second strike only. I kept today's card and today's behaviour; if Arc's second hit or a leap should start the chain too, that's a change to a kept piece.
10. **Stormbrand: "anywhere on the field".** Read as written: Shock on an ally counts, so a party charged by Wisps hits harder with it. If foes only was meant, it's two words.
11. **Overkill axe beside Downhill charm on one unit.** Both carry what the same killing blow has left over, to different places. Nothing says whether the leftover is dealt twice or shared. By the rule for a fallen foe's fire I'd split it evenly between the two. It's the amulets' share as much as mine.
12. **"Below half" beside Halved heart.** Gorged claws and The Red Feast wake below half. A unit capped at half by Halved heart, and healed to its cap, is at half and not below it, so both sleep until the first scratch and again after every heal. If the brink's pieces should meet, one of the two wordings moves to "at half or below".
13. **The spear's signature on the Hunt's and the Storm's pieces.** Every spear above common carries Aggro +1 or +2, signature first, as today's did. On Long spear, Hunting spear, Jolt spear and Storm pike that makes a chaser draw more. If the lead would rather those four drop it for a second road stat, each is one step to swap.
14. **Names.** Kept as the spine has them. To consider:
    - **Storm pike** is a spear, and the vocabulary lists the pike as a great weapon. "Storm spear" would clash with the Valkyrie's Stormspear; "Squall lance" doesn't.
    - **Bloodletter** (sword) and **Bloodletter's phial** (vial) read as a pair and aren't one.
    - **Trophy spear** uses the name of an offhand kind.
    - **Tithe wand** and **Tithing leathers** tithe different things to different units.
    - The five new commons (Stiletto, Quickbeam wand, Hazel wand, Pennon spear, Boar spear), for the lead to check across shares. Hazel wand was Willow wand in the first hand-in: weapons-2 has a Willow staff, and a Pyromancer wears both kinds.

## Links

- **Detonation** (Trophy spear, half). A Shield of a quarter of Attack on each kill, 1,000 to 1,250. For its break to read as a blow, the readers (Rubble plate, Shatterstone charm) need to read the most the pool held since it was last empty, so two kills' Shields break as one number.
- **Goad** (Provoking blade, key). Nothing to size: one foe's swing called for each swing landed. For the call to cost the foe more than it costs the party, what the swing sets off has to beat one foe blow after Defense: about ten Shock on the foe, or Thorns high with Briar behind it. Weaken on the field is what makes the trade safe. The wearer has to be the one picked, which the blade's Aggro step only starts.
- **Held charge** (Stormbrand, key; Live-wire knuckles, Jolt wand and Jolt spear, halves). Stormbrand adds half a percent of Attack a stack on the field: a foe at Shock's cap doubles a sword swing, as the link asks, and it takes every hit, not one blow. The riders lay a few a hit. A Stun holds a foe for one or two fast swings, about six stacks from one rider, so the cap is reached on a boss between its moves or by the whole party's storm, not by one unit and one Stun.
- **Reaping** (Oathkeeper and Storm pike, halves). Oathkeeper sinks every foe by a full swing each swing while its wearer Taunts; Storm pike by a light hit on its count (see *Challenges*, 2). The execute on the other side has to kill from the HP those leave.
- **Avalanche** (Overkill axe, key). All of the leftover, once, to the lowest foe. It needs a blow far bigger than its foe, and its own kind's heaviest (Headsman's axe) can't be worn with it: the blow is an Assassin's crit or Backstab, or Millstone's.
- **Spell on the swing** (Baton, key). A fifth of the wait left for each swing landed: one more cast a fight on a wand's own pace, and nearly twice the casts with Hummingbird charm and Haste. The other side is speed and a well; a Bard can hold Bell of the hour beside it, and the two stack on the first slot.
- **Red rain** (Weeping kris and Quietus open; Forked knuckles, Chain wand, Oathkeeper and Storm pike pour). The kris's wound pays about 620 on a hit. The fast kinds' wide hits are 225 to 250 a foe, so the wound pays more than twice the hit, as the link asks; Oathkeeper's and Storm pike's are bigger than the wound. For the link to hold on the kits' side, a few Bleed on every foe is enough for the fast kinds.
- **Riposte** (Parrying spear, key). One strike of the ally's basic attack for each dodge. The cover that strike builds lands on the ally who struck, not on the dodger, so this home of the riposte moves damage and banks nothing for the blow that lands. For the two to meet, the striker's hits have to give to someone else (the Valkyrie's Shield-sister, a Vampire's Shared feast), or the dodger's cover comes from the dodge itself (Hooded cloak).
- **Every colour** (Wildmagic wand, key; Spark wand, Jolt wand, Rimed blade and Mimic wand, halves). A few stacks of one kind in five each swing. A few Burn, Shock, Bleed or Sunder drains in a couple of swings, so the wand alone holds two or three kinds on a boss at once, and all five need the Hexer's own three and a top-up. Malison has to pay visibly at three and four kinds, not only at five.
- **Lead's colour** (Mimic wand, key; nine riders, halves). The riders are a few a hit from Attack. Mimic wand follows the other ally with the highest Attack, so beside a Hoplite whose swing lays nothing it's blank whatever the third unit carries. Three weapons reach a second shatter only when they land on one foe, which takes a Mark or a lone boss.
- **Emptied quiver** (Bloodscent knife and Ambush knife, halves). Bloodscent takes a Ranger's swing to about three in four on a wound: a burst of about four arrows, as the link asks. Ambush knife is nine in ten until a foe has acted: three to six arrows in the first ticks, closed by the foes' first moves as much as by the crit that fails. The wound has to last the burst: each arrow closes a third, so it wants several stacks or more, which Barbed arrow lays.
- **Resonance** (Forked knuckles, half). A twentieth of max MP for each other foe a swing reaches: 230 a swing for a Stormcaller. With Recharge, Chain lightning against four foes pays for itself, so on this side mana no longer stops the loop; the pack thinning does.
- **Mana as armour** (Tithe wand, half). 90 to 150 MP a swing. A foe's plain blow is 500 to 1,600, so one tithe is a tenth to a quarter of a blow. For "each note is a blow not taken", the Orb has to trade a point of MP for several of damage, or the notes that read are Clarity's.
- **Brink** (Bloodletter, key; Gorged claws, Mercy's edge and The Red Feast, halves). Bloodletter's price takes a quarter of the bar in a regular fight. That makes its wearer the lowest only while nobody else is being beaten and it isn't drinking. The givers' Shields are never spent by the price, which is what the other side needs to keep true.

## Loops

- **Bloodscent knife, Quick draw and a wound kept open.** Its 50 is added, so a Ranger that brings 50 Crit chance of its own to a basic attack crits every arrow on a bleeding foe, and every crit calls the next arrow. A Ranger reaches about 45 from its line, Hunter's eye's power step and a crit step in each slot; a seat that lifts crits takes it over. Then the brake is only the wound closing (a third an arrow) and the swing's recovery, and Open wound's Opener seat reopens the wound on every crit. Weak brake. Written as a set chance, like Ambush knife, it couldn't happen; I didn't, because then the dagger's own Crit chance stops counting.
- **Ambush knife and Quick draw.** One arrow in ten fails, and the foes act. Sound.
- **Bellows wraps past about seven hits in eight ticks on one foe.** Each hit adds a tenth and each pulse of Burn takes 15%, so two hits a pulse out-run the drain and the fire climbs with nobody feeding it; Burn has no cap. A Monk with Hummingbird charm, Haste and a second strike is at about that pace. What stops it: it needs a fire to start from, the hits have to stay on one foe, Haste lapses, and the foe dies of it. Weak brake against a boss.
- **Quietus with Tally coat or Second dawn.** A kill by the opening strike lands the opening strike again, on every foe. It stops on a round that kills nobody, or when the foes run out; against a pack already sunk it clears the field in one tick. I read a strike landed by a repeated opening as able to kill and call the opening again, as the spine's list of kill chains does. If "a repeat isn't repeated" should stop it after one round, Tally coat's card says so, not this one.
- **Provoking blade and Tempest cloak on a Valkyrie** (the spine's). The called foe has to pick her, she has to dodge, and her answering swing has to land on the same foe. Against a pack the third rarely happens. Against one boss with a Taunt on her it's her Evasion each turn, and each failure is a real blow taken.
- **Answering thunder.** It turns over on the foes' own clock and calls nothing, so it isn't a loop. The goad feeds it: Goading totem on the same Stormcaller, or Provoking blade beside it, turns each call into a strike. The brake is the goad's own pace.
- **Forked knuckles under the loops that mana stops.** Against three foes or more it pays most of a Stormcaller's casts, so the resonance and Bell of the hour lose their mana brake on that unit. The pack thinning, the bell's count and wind-ups remain.
- **Overkill axe, Headsman's axe, Second thrust, Reaver's axe, Thirsting axe, Trophy spear, Gravemark, Marking knife.** Kill chains: the foes run out. Overkill's carry is once and says so. Trophy spear with Rubble plate on a Hoplite (a kill, a Shield, its break, a blast, a kill) waits each time for the foes to break the Shield.
- **Baton.** A fifth of what's left never reaches nothing. With Cadenza first-slotted, its three swings at once take half the wait; mana and the swings in between hold it.
- **Still hand and Hunting spear.** The second landing is never repeated, on the card.
- **Mimic wand.** Two of them, or one beside The standard, pass nothing round: what's borrowed isn't borrowed on, on the card.
- **Bloodletter with Shroud charm or Aegis mail** is one more price for the spine's known loop: each crossing of a third fires them again, and healing back over the line is what resets it.

## Code support beyond the spine's list

- **A crit chance set on a condition** (Ambush knife). Today's crit rules add to the chance; Gambler's coin sets one with no condition.
- **A rider sized by its target's own stacks** (Bellows wraps). Today a target's stacks size damage, not an application. Venom vial and Everflame lantern, in other shares, need the same.
- **A special stat doubled by what the hit lands on** (Hungry axe). Today a target's state changes boosts and crits, not Lifesteal.
- **A swing's extra read from the price that swing paid** (Bloodletter), so a swing that can pay nothing adds nothing.
- **A test that an extra hit's foe isn't the swing's own target** (Forked knuckles' MP).
- **A borrowed rider that keeps its condition** (Mimic wand): 12 copies riders, and this asks that a crit's, a first hit's or a judged foe's rider is read on the borrower's own swing.
- **A test that the wearer isn't Stunned or winding up**, for a strike out of turn (Answering thunder).
- Nothing new for Quietus, Drawn steel, Reaver's axe, Jolt spear, Ragged axe, Lamprey claws, Tithe wand or Trophy spear: each is a trigger and an effect today's pieces already use, joined differently.

## Least sure

- **Mimic wand.** The longest card in the share, and the one a player is most likely to misread. It's also blank beside a high-Attack ally that lays nothing.
- **Storm pike** as the line stands (*Challenges*, 2), and **Gravemark** alone (7).
- **Hunting spear.** Every hit lands twice on half of every bar. It's the line's size; it may be the strongest rare here.
- **Provoking blade.** No number to tune, a price that's real, and a pay-off that's all in other slots. Whether a player ever picks a sword that makes foes swing is the spine's own doubt.
- **Bloodscent knife added, Ambush knife set.** Two sister cards in two forms. I'd defend it, but one ruling should cover both and Vulture's skull.
- **Bloodletter's size.** A twentieth for a fifth. On a Knight the extra is nearly twice his swing, and his Vanguard Shield sits untouched over a bar he's spending.
- **Tithe wand and Lamprey claws** are the two first steps whose single event is small (a tenth of a caster's spell; a twentieth of a bar). They read over a fight more than on the first swing.
- **Wildmagic wand.** A few stacks at random still rarely makes a row by itself; the engine rests on the Hexer's own three kinds.
- **Thousandth cut at 2%.** Kept, but a dagger reaches a third of its cap in a regular fight.
- **The three fist riders** share a card shape and a stat line, on purpose: the colour is the choice. The spine already doubts three plain riders in one kind.
- **Sleet dirk's Accuracy** in place of a second Attack speed line, and **Aggro on every spear** (*Challenges*, 13).
- **Stormbrand's size** rests on how much Shock a field really holds, which I couldn't read from the scale: Shock halves each time its holder acts.
