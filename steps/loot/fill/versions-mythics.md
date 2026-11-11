# The fill: versions and mythics

One share of the loot pass's fill, written from `spine.md` by `fill-brief.md`. Nothing here is built, and every number is a first value.

**What it holds:** 60 items.
- **The two kit changes:** Marked, and the Hexer's Malison.
- **42 versions:** 9 changed, written new; 33 kept, each checked against today's card. Two of the kept are resized (Hail, Drinking palm).
- **16 mythics:** 5 changed, written new; 11 kept. Two of the kept are resized (Horn of the keep, Huntmaster's quiver), and one gains a sentence (Eye of the tempest).

**How it's laid out.** The kit changes come first, since everything after reads them. Then one heading a class, in the classes' own order. Under each class: its versions in the spine's order (the changed, then the kept), then its mythic. An entry's **Is** line says changed or kept, and a kept entry's **Notes** start with *Stays* or *Resized*.

**How to read the numbers.**
- A word names its constant in `content/core-set/scale.ts`.
- **"The ability's count"** of a stack word is `ABILITY_STACKS` × `STACKS.<word>` for each point of the stat named, as the kits' abilities have it. **"The passive's count"** is `STACKS.<word>` alone, as the kits' passives have it.
- Sizes worked out in the notes are for the class's own stat line with no gear.
- No card here uses one of the six counters. Stormspear's and Metronome's counts are their own, each shown as an icon with a number.

**Read against `fill/round-1.md`** as it stood when this was handed in (the lead's rulings, in progress). Where one of its rulings for every share touches an entry here, the entry follows it and says so: Rampart, Quick draw's link, Crown of embers, the brink, the frozen gate and the mirror. Nothing else of this file waits on it.

## Kit changes

### Marked
- **Is:** Marked, in the vocabulary · kit change
- **Today:** The party's basic attacks go to it.
- **Card:** The party's basic attacks, and its abilities aimed at a random foe, go to it.
- **Numbers:** None of its own. It keeps its length (`STATUS.marked`), and each applier still keeps one Mark.
- **Code:** 1
- **Serves:** no road or engine on its line. The Hunt asks for it (`builds.md`), and every piece, seat and version that Marks reads it.
- **Notes:** The card is the status's own line, shown with its icon. The rule behind it, for the vocabulary:
  - **What follows a Mark:** a basic attack, as today, and the first pick of any ability whose target phrase is "a random foe" or "a random foe that isn't Taunting". In the base kits that's Shield bash, Barbed arrow, Bramble lash, Spear thrust, Gale spear, Garrote, Blood drain, Chain lightning's first strike, Rockfall and Tremor. The versions that keep the phrase follow too: Crushing bash, Rebuke, Skewer's first thrust, Gale storm's first hit, Bleed them dry, Savage drain, Drain the well, Recharge, Rock shelter and Aftershock.
  - **What doesn't:** an ability with a target phrase of its own; every pick after an ability's first (Chain lightning's three others, Arc's second foe, Skewer's second thrust); anything aimed at every foe; a hit that a piece or a passive makes (a jump, a strike with its weapon).
  - **The Taunt rule stands over it.** While a foe Taunts, an ability without Seek goes to a Taunting foe, Marked or not. With Seek it goes to the Marked foe.
  - **Several Marks:** the pick goes by draw among the Marked.
  - **Three readings the line leaves open** are under Challenges, with what this entry assumes for each.
  - It sizes nothing. What a player sees is every loose arrow, bolt and bash in the party landing on one foe while the Mark lasts, and how long it lasts is the balance pass's (the spine's note on `STATUS.marked`).

### Malison
- **Is:** Hexer, Malison · kit change
- **Today:** Deepens every affliction each foe holds: one more stack of each of Burn, Chill, Shock and Sunder it already has, and a few Bleed.
- **Card:** Curses every foe: light damage that scales from Attack, a fifth more for each different affliction the foe holds (Burn, Chill, Shock, Bleed, Sunder), then a few Bleed; stacks scale from Attack.
- **Numbers:** The hit is `HIT.light` of Attack, on every foe. Each different affliction the foe holds as the hit lands adds a fifth of that, counted once whatever its stacks: five at most, which doubles the hit. A few Bleed is the ability's count from Attack, and lands after the hit. Short cooldown, normal wind-up and 450 MP, as today.
- **Code:** 2
- **Serves:** no road or engine on its line. It's what every colour reads, and a hit on every foe for the red rain.
- **Notes:**
  - **The size.** A touch is the scale's word for an ability whose point is its status, and the change makes the hit the point, so it's a light hit. On a bare Hexer that prints about 950 on a foe that holds nothing and about 2,100 on a foe that holds all five, after a minion's Defense: the curse's own number, on a class whose damage nobody saw in play. Light against touch is under Least sure.
  - **What it counts.** The afflictions on the foe as the hit lands. Its own Bleed lands after, so the first curse of a fight counts none of it and the second finds it there, if the party's hits haven't closed it.
  - **It's a wide hit.** Bleed pays on every hit its holder takes, so each curse cashes every wound on the field and then opens its own.
  - **The power step** today reads "40% more of every status it adds", which now grows only the Bleed. See Challenges.
  - The Hexer's trunk line and *How the kits fit together* in `docs/core-set/classes.md` change with it, when it's built.

## Knight

### Hold the line
- **Is:** Knight, Stand fast B · version · kept
- **Today:** Taunts, and has Thorns for as long as the Taunt. No Clarity.
- **Card:** Taunts, and has Thorns for as long as the Taunt. No Clarity.
- **Numbers:** Taunt at its own length (`STATUS.taunt`). Thorns at medium (`SPECIAL.thorns.medium`) for that length. Medium cooldown, quick wind-up, 200 MP.
- **Code:** as today's Hold the line
- **Serves:** Toll 1 ●●● ⚙ goad (half)
- **Notes:** *Stays.* In play it made a Knight an anchor with no gear: most of its damage against a wolf pack came from these Thorns. For the goad, a called blow has to cost the foe more than it costs the anchor. Medium Thorns do that against a wolf's bite and not against a bandit's sword, so on a Knight the goad's piece wants a second toll beside this one.

### Rally the well
- **Is:** Knight, Stand fast A · version · kept
- **Today:** Gives Clarity to every ally under half its MP. Waits until one is. No Taunt.
- **Card:** Gives Clarity to every ally under half its MP. Waits until one is. No Taunt.
- **Numbers:** Clarity at its own size and length (`STATUS.clarity`). Medium cooldown, quick wind-up, 200 MP.
- **Code:** as today's Rally the well
- **Serves:** Barrage 1 ●●● ⚙ mana as armour (half)
- **Notes:** *Stays.* One Clarity is about a quarter of its holder's pool over its length, which for a mage is a whole cast, and this lays it on everyone who's short. What it's worth is Clarity's own size, which `builds.md` leaves to the balance pass. Clarity flows in over time, so by the spine's words it isn't MP "given": Glimmer robe doesn't read it, and mana as armour does.

### Horn of the keep
- **Is:** Knight · mythic (offhand) · kept
- **Today:** Every hit the Knight takes gives the other ally with the least MP a tenth of the hit's damage as MP. When the Knight's Taunt runs out while another ally is in a wind-up, it Taunts again.
- **Card:** Every hit the Knight takes gives the other ally with the least MP half the hit's damage as MP. When the Knight's Taunt runs out while another ally is in a wind-up, it Taunts again.
- **Numbers:** Half the damage the hit dealt to the Knight, after its Defense and Guard, as MP in one piece. The Taunt is at its own length, laid again each time one runs out during another ally's wind-up, with no limit.
- **Code:** as today's Horn of the keep, at half in place of a tenth
- **Serves:** Barrage 3 ●●●, Toll ●● ⚙ mana as armour (half)
- **Notes:** *Resized:* a tenth to a half.
  - **Why.** A Knight's Defense turns a wolf's bite into about 100 and a bandit's swing into about 290, so a tenth was 10 to 30 MP a hit, against pools of 1,000 to 3,800. That's the link sized below sight that play reported, and `builds.md` asks Barrage for a whole cast's mana, not a tenth. At half a pack gives its caster about a Fireball's worth over a regular fight, and one Crush from a boss refills most of a pool.
  - **The card keeps "other",** as today's: the Knight never feeds itself. The spine's line drops the word.
  - **It's MP given,** by the spine's words, hit by hit. So Glimmer robe on the caster is live nearly all fight beside it.
  - **The two halves pull apart.** The Barrage Knight takes Rally the well, which has no Taunt, so the second sentence does nothing for it unless a piece makes it Taunt. And the Taunt it lays again doesn't bring Hold the line's Thorns back: those ride the cast.

## Cleric

### Shared rites
- **Is:** Cleric, Last rites A · version · kept
- **Today:** While it or any ally is below 30% of max HP, its cooldowns are halved.
- **Card:** While it or any ally is below 30% of max HP, its cooldowns are halved.
- **Numbers:** The line is 30% of max HP, or 40% with the power step. Halved is Cooldown doubled, shown as the LAST RITES icon.
- **Code:** as today's Shared rites
- **Serves:** Pact 2 ●●● ⚙ brink (half)
- **Notes:** *Stays.* A healer at twice the pace is seen: Cure comes every seven ticks or so. It wakes at 30%, which is under where Halved heart holds a unit (half), so on the brink it needs a price or a beating to get there. See Links.

### Halo of the saint
- **Is:** Cleric · mythic (amulet) · changed
- **Today:** While an ally is knocked out, the part of the Cleric's heals that would go past full is kept. When it reaches a quarter of the Cleric's max HP, a fallen ally stands with that much.
- **Card:** Each heal and each Regen the Cleric's abilities give also lands, whole, on every other ally below half its max HP. What lands this way isn't passed on again.
- **Numbers:** The same heal, at the same size, and Regen at its own size and length. "Every other ally" is every ally but the one the ability gave it to, the Cleric included. Below half is under 50% of max HP as the ability resolves.
- **Code:** new, beyond the spine's list: see *Code support beyond the spine's list*. It leans on 23 for the copies.
- **Serves:** Pact 3 ●●● ⚙ brink (half)
- **Notes:**
  - **What it reads.** The heals and Regens of the Cleric's own abilities: Cure, Renew and their versions. Not a Cleanse, a Shield, a revive or Font's Clarity, and not the healing its gear does on a beat or a swing.
  - **Seen:** one Cure, a green number on every ally who's low. With three allies below half, each cast heals three.
  - **What the copies set off.** A copy is the ability's heal landing on one more ally, so a piece that reads "each time one of its holder's abilities heals an ally" reads each ally it lands on. The copy itself is never copied, cast or passed on again.
  - **On the brink.** A unit under Halved heart counts as below half while it sits at half (round 1's ruling on that card). So every heal the Cleric casts reaches it, and the part past its cap is healing past full for the red stone's pieces.
  - Nothing of the old card is kept: no piece wants a fall.

## Ranger

### Barbed volley
- **Is:** Ranger, Barbed arrow B · version · changed
- **Today:** No arrow: for a while, its basic attacks add a few Bleed. (Barbed quiver, which this replaces.)
- **Card:** An arrow at every foe: each deals light damage that scales from Attack and adds a few Bleed; stacks scale from Attack.
- **Numbers:** Each arrow is `HIT.light` of Attack. A few Bleed is the ability's count from Attack: five or six a foe on a bare Ranger. Short cooldown (the base's is quick), quick wind-up, 325 MP (the base's is 200): the step Whipping vines took when the lash went wide. The power step is the base's: two fifths more Bleed.
- **Code:** none. The base ability aimed at every foe, as today's Whipping vines.
- **Serves:** Cuts 2 ●●●, Hunt ● ⚙ red rain (half), emptied quiver (half)
- **Notes:**
  - **Seen** the first time: one cast, and the next hit on each foe prints about 670 in red beside its own number, more than a dagger's swing.
  - **Against one foe** it opens half of Barbed arrow's wound, so it's the pack's version beside Deep barbs, which is the boss's.
  - **A Mark doesn't steer it:** it's aimed at every foe.
  - **With Quick draw.** Its arrows aren't basic attacks, but a crit among them still calls the next swing, once, since "at once" doesn't stack.
  - **Under Huntmaster's quiver** it has to stay an arrow at every foe. See the quiver's notes.

### Quick draw
- **Is:** Ranger, Hunter's eye B · version · kept
- **Today:** Basic attacks ignore Taunt and crit more often. Each crit makes its next basic attack come at once.
- **Card:** Basic attacks ignore Taunt and crit more often. Each crit makes its next basic attack come at once.
- **Numbers:** Two crit steps on basic attacks (`KIT.hunterCrit`), three with the power step. Any crit the Ranger lands, an arrow's included, readies its next basic attack; the swing's recovery (`RULES.basicRecovery`) still passes between two.
- **Code:** as today's Quick draw, and 23: "at once" doesn't stack
- **Serves:** Cuts 2 ●●●, Hunt ●● ⚙ emptied quiver (key)
- **Notes:** *Stays.* "At once" is a whole swing, so there's nothing to size on this side. On its own a bare Ranger crits about one swing in five, so the burst is one extra arrow now and then. How long the quiver's burst runs is the other half's number: see Links.

### Hail
- **Is:** Ranger, Frost arrow B · version · kept
- **Today:** A quick arrow at the foe with the most Chill, and one Chill on every foe.
- **Card:** A quick arrow at the foe with the most Chill, and a few Chill on every foe; stacks scale from Attack.
- **Numbers:** The arrow is `HIT.light` of Attack and carries no Chill of its own, as today. A few Chill on every foe is half the ability's count from Attack, the multiplier Frost arrow uses on its one foe: about 3 a foe on a bare Ranger. Quick cooldown, quick wind-up, 200 MP. The power step is today's: two fifths more Chill.
- **Code:** as today's Hail, with the Chill read from Attack in place of a flat one
- **Serves:** Snap 1 ●●● ⚙ firecracker (half)
- **Notes:** *Resized:* one Chill to a few, as the spine's line has it. One stack against a cap of twelve, thawing a stack in the time between two casts, never moved a counter. At a few, every counter on the field steps up with each cast, and a field the Frostweaver has started is at eight or more by the middle of a regular fight, which is where the firecracker's cold finds a neighbour worth reaching. At this size the Ranger lays more cold on a field than Blizzard and Stillness together: under Least sure.

### Quarry
- **Is:** Ranger, Hunter's eye A · version · kept
- **Today:** Basic attacks ignore Taunt, crit more often, and go to the foe with the lowest share of its max HP.
- **Card:** Basic attacks ignore Taunt, crit more often, and go to the foe with the lowest share of its max HP.
- **Numbers:** Two crit steps on basic attacks (`KIT.hunterCrit`), three with the power step. No other size.
- **Code:** as today's Quarry
- **Serves:** Hunt 1 ●●●
- **Notes:** *Stays.* It changes whom the Ranger shoots, which is the kind of version play took. While a foe is Marked, its arrows follow the Mark first, as basic attacks do today, and Quarry aims them when none is.

### Huntmaster's quiver
- **Is:** Ranger · mythic (armor) · kept
- **Today:** All the Ranger's abilities aim past any guard at the foe with the lowest HP. When a foe one of them hit falls, the cooldowns left on its abilities are halved.
- **Card:** All the Ranger's abilities aim past any guard at the foe with the lowest HP. When a foe one of them hit falls, its abilities are ready again.
- **Numbers:** The aim is "the foe with the lowest current HP", with Seek. Ready is no cooldown left on any of its abilities, whoever landed the kill; each still needs its MP.
- **Code:** as today's Huntmaster's quiver, with ready in place of halved. One thing more, under *Code support beyond the spine's list*: the new aim leaves alone an ability aimed at every foe.
- **Serves:** Hunt 3 ●●● ⚙ reaping (half)
- **Notes:** *Resized:* halved to ready.
  - **Why.** The Ranger's arrows are on the quick and short words. Halving what's left of them saved three to five ticks an arrow: the cooldown a few ticks closer that play never saw, on a mythic. The Hunt asks for a kill reward that's a whole action. Ready again is the same reward at that size: a kill, and three arrows at the next lowest foe.
  - **What it costs.** A round of all three arrows is 725 MP, so a full pool pays for about three rounds, and their wind-ups and recoveries make a round about ten ticks.
  - **It's the biggest resize in this share.** See Challenges.
  - **With Marked.** The quiver gives every arrow a target phrase of its own, so its abilities no longer follow a Mark; its basic attacks still do. Most of the spine's markers Mark the lowest foe, so the two usually agree. Base Condemn, which Marks the highest Attack, doesn't.
  - **With Barbed volley.** The volley stays an arrow at every foe. Every foe it hit counts for the second sentence, so each fall in a pack brings the volley back. See Loops.

## Bramble knight

### Whipping vines
- **Is:** Bramble knight, Bramble lash A · version · kept
- **Today:** Lashes every foe with its thorns, for half.
- **Card:** Lashes every foe with its thorns, for half.
- **Numbers:** Half of Bramble lash on every foe: 2.25 times its Thorns, as a hit. Short cooldown, quick wind-up, 325 MP.
- **Code:** as today's Whipping vines
- **Serves:** Toll 2 ●●, Cuts ●● ⚙ red rain (half)
- **Notes:** *Stays.* A row of numbers on every foe is seen. It's the red rain's cheapest wide hit: after Defense it lands for about 490 on a minion, and a foe that has struck the wall twice pays about as much again from Briar's wound. Its lash at a random foe is gone, so a Mark has nothing of this ability to steer.

### Overgrowth
- **Is:** Bramble knight, Thicket A · version · kept
- **Today:** Taunts itself twice over, and doubles its Thorns while the Taunts last. No Guard.
- **Card:** Taunts itself twice over, and doubles its Thorns while the Taunts last. No Guard.
- **Numbers:** A Taunt at its own length, and a second when the first runs out. Thorns doubled for both. Very long cooldown (long with the power step), quick wind-up, 325 MP.
- **Code:** as today's Overgrowth
- **Serves:** Toll 2 ●●● ⚙ goad (half)
- **Notes:** *Stays.* Doubled Thorns on a bare Bramble knight are 600 a blow landed, more than most minions' blows deal to it, so every swing the goad calls costs the pack more than it costs the wall. "Twice over" is one more Taunt and no more: the second isn't followed by a third.

### Heartwood mail
- **Is:** Bramble knight · mythic (armor) · kept
- **Today:** Whenever a hit lands on any ally, the Bramble knight's Thorns strike the attacker too.
- **Card:** Whenever a hit lands on any ally, the Bramble knight's Thorns strike the attacker too.
- **Numbers:** Its Thorns as they stand when the hit lands, with Briar's Bleed behind them, as today.
- **Code:** as today's Heartwood mail
- **Serves:** Toll 3 ●●●, Cuts ●● ⚙ red rain (half)
- **Notes:** *Stays.* It was never offered in play, so it's untested, not unseen: Thorns flashing on whoever is struck reads at once. Thorns are a reaction and not a hit, so nothing chains from them. Every attacker leaves bleeding, which is the red rain's whole field of wounds from one piece.

## Hoplite

### Watch the anchor
- **Is:** Hoplite, Aspis A · version · kept
- **Today:** Aegis on the ally with the most Aggro that holds none.
- **Card:** Aegis on the ally with the most Aggro that holds none.
- **Numbers:** Aegis as it stands (`STATUS.aegis`). Long cooldown (medium with the power step), quick wind-up, 500 MP.
- **Code:** as today's Watch the anchor
- **Serves:** Toll 2 ●●● ⚙ mirror (half)
- **Notes:** *Stays.* BLOCKED on the wall is seen, and the version puts the Aegis where the blows go, not on whoever is lowest. Aegis blocks only a blow above its own line after the wall's Defense, so on a well-armoured anchor it catches a boss's great blows and little else. See Links, the mirror.

### Opening thrust
- **Is:** Hoplite, Phalanx A · version · kept
- **Today:** Basic attacks come half as often and deal double. The first of each fight comes at once and deals triple.
- **Card:** Basic attacks come half as often and deal double. The first of each fight comes at once and deals triple.
- **Numbers:** Phalanx as it stands. The first swing of a fight is ready at once and deals triple, its first doubling included. With the power step the double is × 2.4.
- **Code:** as today's Opening thrust
- **Serves:** Hunt 1 ●●●, Landslide ●●
- **Notes:** *Stays.* The fight's first number is its biggest swing, at the first tick: about 4,900 with a great weapon. It's a kit's own start-of-fight effect, so the opening's pieces (Tally coat, Second dawn) don't make it happen again.

### Shieldbearer
- **Is:** Hoplite, Phalanx B · version · kept
- **Today:** Basic attacks come half as often and deal double. Defense adds to them half as much as Attack does.
- **Card:** Basic attacks come half as often and deal double. Defense adds to them half as much as Attack does.
- **Numbers:** A tenth of its Defense for each `SWING_REF` ticks of its weapon's swing, added to each basic attack before Phalanx doubles it.
- **Code:** as today's Shieldbearer
- **Serves:** Landslide 1 ●●●
- **Notes:** *Stays,* and it's the kept first step I'm least sure is seen. On a bare Hoplite it adds about 800 to a doubled great-weapon swing of about 3,240: a quarter more on every blow, and a step of Defense on gear adds about 160 more. That's Landslide's sign, the careful pick making the blow bigger, but as a steady quarter it may read as a stat. See Least sure.

### The last wall
- **Is:** Hoplite · mythic (offhand) · kept
- **Today:** When an Aegis the Hoplite gave blocks a blow, the attacker takes the blocked damage, and Aspis is ready again at once.
- **Card:** When an Aegis the Hoplite gave blocks a blow, the attacker takes the blocked damage, and Aspis is ready again at once.
- **Numbers:** All of what the Aegis stopped, sent back: it isn't a hit, so Evasion and Defense don't touch it, as today. Aspis ready needs its 500 MP.
- **Code:** as today's The last wall (4 names it)
- **Serves:** Toll 3 ●●●, Landslide ●● ⚙ mirror (key)
- **Notes:** *Stays.* A boss's great blow printed on the boss is the mirror at its clearest. What's sent back is the blow after the wall's Defense and Guard, which is what an Aegis stops. So better stone sends less here, not more, and enough of it takes a blow under Aegis's line, where nothing is blocked. See Links and Challenges.

## Paladin

### Swift justice
- **Is:** Paladin, Condemn B · version · changed
- **Today:** Marks the foe with the lowest share of its HP, and every ally's next basic attack comes at once.
- **Card:** Marks the foe with the lowest share of max HP, and every ally's next basic attack comes at once. When a foe falls holding the Paladin's Mark, Condemn is ready again.
- **Numbers:** Marked at its own length (`STATUS.marked`). Medium cooldown (short with the power step), quick wind-up, 650 MP, as Condemn. Ready again still needs the 650 MP.
- **Code:** none new: today's Swift justice, and a reaction to a status the Paladin gave ending in its holder's knockout (The last wall hears an Aegis it gave; Pyre of the fallen hears a Burn end in a fall). It leans on 1, and on 23 for "at once".
- **Serves:** Hunt 2 ●●●, Landslide ●●, Bonfire ● ⚙ judge's drum (key)
- **Notes:**
  - **"The judged foe"** is written as a foe that falls with the Paladin's Mark still on it. The player can see that: the icon is on the foe as it drops. It means the kill has to come inside Marked's own length. The other reading is under Challenges.
  - **Whose Mark.** A status knows who applied it, not which ability did, so a Mark the Paladin lays from a piece or a seat counts as well as Condemn's.
  - **Seen:** a foe falls, the Mark jumps to the next lowest, and three weapons land together. Nothing to size: "at once" on a slow weapon is a whole swing.
  - **Its brake is mana.** Every call is a Condemn at 650 MP, so a full pool is five, and a pack of six ends the drum before the pack ends.
  - **Beside Hunting horn** a Marked foe's fall calls the swings twice: once from the horn at once, and again when Condemn lands a tick later. They don't stack into one, since the first has landed.

### Zeal
- **Is:** Paladin, Judgement A · version · kept
- **Today:** Its hits deal half again as much to foes with a buff or a debuff, and its basic attacks add a few Burn to such a foe; stacks scale from Attack.
- **Card:** Its hits deal half again as much to foes with a buff or a debuff, and its basic attacks add a few Burn to such a foe; stacks scale from Attack.
- **Numbers:** Judgement as it stands (+70% with the power step). A few Burn is the passive's count from Attack: about 3 a swing.
- **Code:** as today's Zeal
- **Serves:** Bonfire 1 ●●●
- **Notes:** *Stays.* It was one of the three riders the Bonfire run was built from. With the Marked change a Mark does more for it: the party's loose abilities land on the judged foe, and any affliction they leave keeps Zeal's fire lit there.

### Writ of judgement
- **Is:** Paladin · mythic (offhand) · changed
- **Today:** Smite also Silences its target. The Paladin's hits on a Stunned or Silenced foe heal the ally with the lowest share of HP for half the damage dealt. (Chains of light, which this replaces.)
- **Card:** Whenever the Paladin Marks a foe, a heavy blow falls on that foe at once: heavy damage that scales from Attack, adding several Burn; stacks scale from Attack.
- **Numbers:** The blow is `HIT.heavy` of Attack. Several Burn is the ability's count from Attack, as Smite's. No cooldown and no MP of its own: one blow for each Mark the Paladin lays, a Mark renewed on the same foe included.
- **Code:** none from the spine's list: a reaction to a Mark the Paladin gave landing. See *Code support beyond the spine's list* for the blow as a hit of its own.
- **Serves:** Hunt 3 ●●●, Bonfire ●●, Landslide ●●
- **Notes:**
  - **The blow is a hit** of the Paladin's: it can be dodged and crit, it meets Defense, and a kill it lands is the Paladin's kill. It isn't a basic attack or a cast, so nothing that waits on a swing or a cast reads it.
  - **It's bigger than it looks.** The Mark is a debuff and lands first, so Judgement is on: the blow is half again as hard. On a bare Paladin that's about 4,900 after a minion's Defense, with about ten Burn behind it, on every Condemn.
  - **Seen:** a Mark, and under it the fight's biggest number.
  - **Whose Mark.** Any Mark the Paladin lays, from Condemn or from a piece or a seat it holds. With a marker that lays one "while no foe is Marked", the blow comes each time a Mark runs out or its foe falls, at no cost. That's the loop the spine names, and at these numbers its brake is weak. See Loops.
  - Nothing of the old card is kept.

## Valkyrie

### Over the fallen
- **Is:** Valkyrie, Choosing B · version · kept
- **Today:** Waits until an ally is below 30% of its HP or down. Chooses one: a fallen one, raised; else the lowest, healed for double. The Valkyrie Taunts and is Guarded, standing over the one she chose.
- **Card:** Waits until an ally is below 30% of its HP or down. Chooses one: a fallen one, raised; else the lowest, healed for double. The Valkyrie Taunts and is Guarded, standing over the one she chose.
- **Numbers:** The heal is twice `KIT.choosing` of Attack. A raise brings a tenth of the ally's HP (`REVIVE.tenth`). Taunt and Guard on herself at their own lengths. Medium cooldown, normal wind-up, 650 MP.
- **Code:** as today's Over the fallen
- **Serves:** Toll 2 ●●●, Pact ●● ⚙ riposte (half), brink (half)
- **Notes:** *Stays.* The heal is about 2,200, and the Taunt turns the fight onto her. It's the draw that makes a dodging Valkyrie the riposte's dancer. Like Shared rites it wakes at 30%, under Halved heart's line.

### Thunderclap
- **Is:** Valkyrie, Skyfall A · version · kept
- **Today:** Skyfall on every foe that holds Shock, half as hard on each, rising with each one's Shock. Waits until a foe holds Shock.
- **Card:** Skyfall on every foe that holds Shock, half as hard on each, rising with each one's Shock. Waits until a foe holds Shock.
- **Numbers:** On each foe that holds Shock: half of `HIT.heavy` of Attack, and half of `KIT.skyfallPerShock` for each Shock stack on that foe. The Shock stays. Medium cooldown, normal wind-up, 325 MP.
- **Code:** as today's Thunderclap
- **Serves:** Storm 3 ●●● ⚙ held charge (key)
- **Notes:** *Stays.* On a bare Valkyrie it's about 1,700 a foe and 75 more a stack, so a foe's charge doubles its blow at about 23 stacks and nearly triples it at Shock's cap: the link's size. Each foe it lands on is a hit, so under Stormspear a wide clap is worth a blow from above or two.

### Stormspear
- **Is:** Valkyrie · mythic (weapon) · changed
- **Today:** A medium, one-handed spear with a spear's swing. Its basic attacks ignore Taunt and add a few Shock.
- **Card:** A one-handed spear with a spear's swing. Every fourth hit the Valkyrie lands calls a blow from above on the foe with the most Shock: damage that scales from Attack, rising with each Shock stack on that foe. The Shock stays. The blow's own hit isn't counted.
- **Numbers:**
  - **The swing:** a spear's (`KIND_SPEED.spear`, full, even), one hand, as today's. No stat steps.
  - **The count:** every hit she lands adds one: a swing, each hit of Gale spear, Skyfall, a strike with her weapon. At four the blow falls and the count starts again. It shows as an icon with a number.
  - **The blow:** `HIT.normal` of Attack, and `KIT.skyfallPerShock` more for each Shock stack on its foe: Skyfall's own step, on a smaller hit.
- **Code:** none from the spine's list: a count of its holder's hits, as today's Metronome keeps, and Skyfall's amount. See *Code support beyond the spine's list* for the blow as a hit of its own.
- **Serves:** Storm 3 ●●●, Hunt ● ⚙ held charge (key)
- **Notes:**
  - **Seen:** a count on the Valkyrie, and at four a number from above on the most charged foe. On a bare Valkyrie the blow is about 2,000 with 150 more a stack, so a charge of 13 doubles it and Shock's cap makes it four times the size. With her kit alone a blow falls about every ten ticks.
  - **The blow is a hit** of hers: it meets Evasion and Defense, can crit and builds her Shield. It isn't a basic attack or a cast. It isn't counted, so it can't call the next.
  - **Where it lands.** By its phrase alone: the foe with the most Shock, or a random foe when none holds any. It isn't an ability's or a basic attack's pick, so this entry assumes the Taunt rule doesn't hold it and a Mark doesn't steer it. See Challenges.
  - **What went.** Shock on every swing and basic attacks that ignore Taunt are uncommons' effects now (Jolt spear, Long spear), and she can't hold either beside this. So the charge it reads has to come from Gale spear and from the party.

## Bard

### Rousing chorus
- **Is:** Bard, War ballad B · version · changed
- **Today:** A few Might on every ally, and twice as many on the ally with the slowest basic attack.
- **Card:** All its Might goes to the ally with the slowest basic attack: three times as many as War ballad gives; stacks scale from Attack.
- **Numbers:** Three times the ability's count of a few, from the Bard's Attack: 12 or 13 stacks on a bare Bard, up to Might's own cap (`STATUS.might.cap`). Quick cooldown, quick wind-up, 450 MP, as War ballad. "Slowest" is the longest time between basic attacks as the song lands, the Bard included, ties at random: as today's Rousing chorus reads it.
- **Code:** none. As today's Rousing chorus, with one target and three times the stacks.
- **Serves:** Landslide 2 ●●●, Hunt ●
- **Notes:**
  - **Seen:** one unit with Might near its cap all fight. A slow hitter spends a stack an action and gets a dozen back every ballad, so from the second cast its every blow lands about 90% harder. A few Might on three units was the size play never saw; this is the same Might on the one unit that spends it slowest.
  - **Who it picks.** A Hoplite, whose swings come half as often, or whoever wears Millstone. It reads the weapon's pace, so a party with no slow hitter still sends it all to someone.
  - **The power step** adds two fifths more Might, and one cast already nearly fills Might's cap, so on this version the step buys almost nothing. Under Least sure.
  - **Beside War horn** the cards differ in when: the horn loads the first blow, this keeps it loaded.

### Rubato
- **Is:** Bard, Allegro A · version · changed
- **Today:** Haste on every ally, and each ally's ability with the longest cooldown left comes 4 ticks closer.
- **Card:** Haste on every ally, and every ally's ability nearest to ready is ready at once.
- **Numbers:** Haste at its own size and length (`STATUS.haste`). "Nearest to ready" is the ability with the least cooldown left that isn't ready yet; ready is no cooldown left, and it still needs its MP and whatever it waits for. Long cooldown (medium with the power step), quick wind-up, 650 MP, as Allegro.
- **Code:** none: the cooldown effect already picks "its next ability" for every ally.
- **Serves:** Barrage 2 ●●●, Landslide ●
- **Notes:**
  - **Seen:** Rubato's name, then an ability from each ally right under it. Four ticks closer was the size play never saw; a whole cooldown is the one `builds.md` asks Barrage for. For a soloist with one spell, the nearest ability is the spell.
  - **It can ready itself.** The Bard is one of "every ally", and Rubato has just gone on cooldown when its effect lands. If nothing else of the Bard's is cooling down (it knows only this song, or its other songs are ready and slotted after it), Rubato is the Bard's ability nearest to ready, and it's cast again, until the mana is gone. The card as the line has it allows this. See Loops and Challenges.
  - **Beside Reprise** (Encore A): Reprise readies one ally's longest wait, this readies everyone's shortest.

### Reprise
- **Is:** Bard, Encore A · version · kept
- **Today:** The other ally with the highest Attack has its ability with the longest cooldown left ready at once. No repeat.
- **Card:** The other ally with the highest Attack has its ability with the longest cooldown left ready at once. No repeat.
- **Numbers:** No size: a whole cooldown. Medium cooldown (short with the power step), quick wind-up, 650 MP.
- **Code:** as today's Reprise
- **Serves:** Barrage 2 ●●●, Landslide 2 ●●
- **Notes:** *Stays.* A whole cooldown is the size that's seen: the great spell's name twice in a few ticks. It names another ally, so it can't ready itself.

### Lament
- **Is:** Bard, War ballad A · version · kept
- **Today:** Might to every ally below half its HP, twice as many. Waits until an ally is below half.
- **Card:** Might to every ally below half its HP, twice as many. Waits until an ally is below half.
- **Numbers:** Twice the ability's count of a few, from the Bard's Attack: 8 or 9 stacks a cast, up to Might's cap. Quick cooldown, quick wind-up, 450 MP.
- **Code:** as today's Lament
- **Serves:** Pact 2 ●●● ⚙ brink (half)
- **Notes:** *Stays.* A few Might is on the list of sizes play never saw, and this isn't that: twice as many, on a quick cooldown, on a unit that stays low, reaches Might's cap by the second or third ballad, and every blow from the brink lands most of the way to double. On a unit that dips under half and is healed straight back it's one cast, and little.

### Metronome
- **Is:** Bard · mythic (offhand) · kept
- **Today:** Counts every hit the party lands. At 20, War ballad, Allegro and Encore are ready at once, and the count starts again.
- **Card:** Counts every hit the party lands. At 20, War ballad, Allegro and Encore are ready at once, and the count starts again.
- **Numbers:** Twenty hits: every hit any ally lands, extra strikes and each hit of a multi-hit ability included. Damage sent back and a status's own damage aren't hits. All three songs ready is 1,750 MP if the Bard casts them all.
- **Code:** as today's Metronome (7 and 15 name it)
- **Serves:** Cuts 3 ●●●, Barrage ●●, Storm ● ⚙ spell on the swing (key)
- **Notes:** *Stays.* It was never offered in play. A count on the Bard that climbs with the party's blur and rings three songs at the top is seen, and a fast party fills it every fifteen ticks or so. With the changed songs it readies Rousing chorus and Rubato, and Rubato readies the abilities whose hits fill it. Mana stops that: see Loops.

## Hexer

### Plague
- **Is:** Hexer, Malison A · version · changed
- **Today:** Deepens every affliction each foe holds, and adds a few Burn, a few Shock and a few Bleed of its own to every foe; stacks scale from Attack.
- **Card:** Curses every foe for less than Malison does: touch damage that scales from Attack, a fifth more for each different affliction the foe holds (Burn, Chill, Shock, Bleed, Sunder), then a few Burn, a few Shock and a few Bleed; stacks scale from Attack.
- **Numbers:** The hit is `HIT.touch` of Attack, about three fifths of Malison's, with Malison's fifth for each different affliction. A few of each of Burn, Shock and Bleed is the ability's count from Attack: five or six of each on a bare Hexer, landing after the hit. Short cooldown, normal wind-up, 650 MP: a rung over Malison, as today's Plague is. The power step is Malison's.
- **Code:** 2
- **Serves:** Bonfire ●●, Storm ●●, Cuts ●● ⚙ every colour (key), red rain (half)
- **Notes:**
  - **Seen** the first time: three icons on every foe from one cast.
  - **"The next curse landing bigger"** depends on what's left a cooldown later, and a status keeps its own drain. Five or six Burn laid once are down to about one by the time Malison comes round again. Shock is gone after three of its holder's actions. Bleed lasts until the party's hits close it. So a lone Hexer's second Plague finds one or two of its three, more with Cooldown on its wand. The link expects a stack or two of each, and that's about what there is. Under Least sure.
  - **What holds them up** is the other half: a rider on a swing, Idol of the deepening, a second caster. The Hexer's own Chill and Enfeeble's Sunder drain slowly and stay.
  - **Twice-told tome** makes the second cast land on the first one's three.

### Focused curse
- **Is:** Hexer, Malison B · version · changed
- **Today:** Deepens the afflictions of the foe with the highest Attack alone, three times over, and adds it a few Bleed, three times as many; stacks scale from Attack.
- **Card:** Curses the foe with the highest Attack alone: three times Malison's damage, scaling from Attack, a fifth more for each different affliction it holds (Burn, Chill, Shock, Bleed, Sunder), then three times the Bleed; stacks scale from Attack.
- **Numbers:** The hit is three times `HIT.light` of Attack, with Malison's fifth for each different affliction: about 3,500 before Defense on a bare Hexer, and twice that on a foe that holds all five. The Bleed is three times the ability's count of a few. Short cooldown, normal wind-up, 450 MP, as Malison. The power step is Malison's.
- **Code:** 2
- **Serves:** Hunt ●● ⚙ every colour (half)
- **Notes:** It has a target phrase of its own, so a Mark doesn't steer it, and without Seek a Taunting foe catches it first, as today. Enfeeble aims at the same foe, so the Hexer's own kit puts Sunder, Bleed and Chill under it: three of the five without help. At five it's the biggest single number a Hexer prints, on a short cooldown.

### Hex of flames
- **Is:** Hexer, Cold hex A · version · kept
- **Today:** Its basic attacks add a few Burn, whatever weapon it carries; stacks scale from Attack.
- **Card:** Its basic attacks add a few Burn, whatever weapon it carries; stacks scale from Attack.
- **Numbers:** A few Burn is the passive's count from Attack, times `BURN_STACKS`: about 3 a swing. It takes the Chill's place.
- **Code:** as today's Hex of flames
- **Serves:** Bonfire 1 ●●● ⚙ lead's colour (half)
- **Notes:** *Stays.* It's one of the riders the Bonfire run was built from, and it reads as Spark wand does, which the director has agreed to. For Malison it trades the Hexer's own Chill for Burn: still one colour from the swing.

### The witch-blade
- **Is:** Hexer · mythic (weapon) · kept
- **Today:** After each ability the Hexer casts, its next three basic attacks hit every foe that holds a debuff.
- **Card:** After each ability the Hexer casts, its next three basic attacks hit every foe that holds a debuff.
- **Numbers:** The swing is its own, as today's: one hand, 5.8 ticks, a full, even swing. No stat steps. Each cast sets the count back to three; it doesn't add.
- **Code:** as today's The witch-blade
- **Serves:** Snap 3 ●●●, Bonfire ●●, Storm ●● ⚙ every colour (half), red rain (half)
- **Notes:** *Stays.* It was never offered in play. The Malison change makes it better: every curse leaves Bleed on every foe, so the three swings after it land on the whole field, each carrying the Hexer's Chill and each paying every wound. With no foe holding a debuff, the swings pick as usual.

## Monk

### Stillness of mind
- **Is:** Monk, Flow B · version · kept
- **Today:** Taunts, and raises its Evasion by 35 for as long as the Taunt. No Haste.
- **Card:** Taunts, and raises its Evasion by 35 for as long as the Taunt. No Haste.
- **Numbers:** Taunt at its own length. Evasion up by its high word (`SPECIAL.evasion.high`) for that length. Long cooldown (medium with the power step), quick wind-up, 200 MP.
- **Code:** as today's Stillness of mind
- **Serves:** Toll 2 ●●● ⚙ riposte (half)
- **Notes:** *Stays.* On a Monk it's seven blows in ten missed while every foe aims at it: MISS, over and over, is seen. It's the draw the riposte needs on a dodger. It covers half the fight at most, and the blow that lands still lands in full.

### Drinking palm
- **Is:** Monk, Iron palm B · version · kept
- **Today:** Its basic attacks, and the second strike of its Double strike, add a few Sunder; stacks scale from Attack. Its hits on a Sundered foe heal it for a tenth of the damage.
- **Card:** Its basic attacks, and the second strike of its Double strike, add a few Sunder; stacks scale from Attack. Its hits on a Sundered foe heal it for a fifth of the damage.
- **Numbers:** Sunder as Iron palm's. The heal is a fifth of each hit's damage: the size of Lifesteal's high word, in place of its medium.
- **Code:** as today's Drinking palm, at a fifth
- **Serves:** Pact ●●, Toll ●● ⚙ riposte (half), red stone (half)
- **Notes:** *Resized:* a tenth to a fifth.
  - **Why.** A tenth of a fist's blow is about 45 HP, against blows of 500 and more on a unit with no Defense. It was a common's step of Lifesteal with a condition on it, and a trigger that small is on play's list of things never seen. Both its engines ask it for cover the player can watch build. At a fifth a Taunting dancer drinks back about a third of what gets through.
  - **It isn't Lifesteal** as built: it's a heal the passive gives. The red stone's seat reads Lifesteal past full. See Links.

### Frost fist
- **Is:** Monk, Burning fist A · version · kept
- **Today:** Three quick hits on the foe with the most Chill; each deals physical damage that scales from Attack and adds a little Chill; stacks scale from Attack.
- **Card:** Three quick hits on the foe with the most Chill; each deals physical damage that scales from Attack and adds a little Chill; stacks scale from Attack.
- **Numbers:** Each hit is 0.11 of Attack. "A little" is three tenths of the ability's count of a few: under 2 a hit, about 5 a cast. Quick cooldown, quick wind-up, 200 MP.
- **Code:** as today's Frost fist
- **Serves:** Snap 1 ●●●
- **Notes:** *Stays.* Five Chill on the coldest foe every cast, against a cap of twelve, is a second source the counter shows at once. "A little" isn't one of the scale's three stack words, and "physical" is a word from before there was one kind of hit: both are today's, kept, and under Challenges.

### Ember palms
- **Is:** Monk · mythic (weapon) · changed
- **Today:** Every hit the Monk lands adds a Burn. Every 5 ticks, it gains a Heat for each burning foe, up to three at a time.
- **Card:** Each hit the Monk lands deals 25 extra damage for each Burn stack on its target. The Burn stays.
- **Numbers:**
  - **The swing:** its own, as today's: one hand, 6.0 ticks, a full, even swing. No stat steps.
  - **The extra:** 25 for each Burn stack on the foe as the hit lands, a flat step as Pyre's and Skyfall's are. It's part of the hit: added before the Monk's boosts and its crit, and cut by Defense with the rest.
  - **Which hits:** all of them: basic attacks, Double strike's second strike, each hit of an ability, a strike with its weapon.
- **Code:** none from the spine's list. See *Code support beyond the spine's list* for a rider on every hit.
- **Serves:** Bonfire 3 ●●●, Cuts ●●
- **Notes:**
  - **Seen** the first time it lands on a fire: on six Burn a fist's blow is a quarter bigger, and on thirty it's more than doubled, on every hit of a unit that lands one every two ticks. On a fed fire of thirty it adds about half as much again as the fire itself deals.
  - **It reads and leaves,** like Pyre, so nothing sets it off again.
  - **What went.** Burn on every hit is an uncommon's now (Cinder wraps), which the Monk can't hold beside this, and the Heat is gone with the old counter. So the Monk feeds only through Burning fist and reads a fire the party keeps: the Pyromancer's, a Follower's seat, Tinder charm on its own amulet, or Crown of embers, under which its hits feed and read at once.

## Assassin

### Coup de grâce
- **Is:** Assassin, Backstab A · version · kept
- **Today:** Has Seek. Deals physical damage that scales from Crit chance to the foe with the lowest current HP. When it knocks that foe out, Backstab is ready again.
- **Card:** Has Seek. Deals physical damage that scales from Crit chance to the foe with the lowest current HP. When it knocks that foe out, Backstab is ready again.
- **Numbers:** `HIT.normal` of Crit chance (through `PER_PERCENT.crit_chance`): about 2,000 on a bare Assassin, and twice that on a crit. Medium cooldown, normal wind-up, 325 MP. Ready again has no limit but its MP.
- **Code:** as today's Coup de grâce
- **Serves:** Hunt 2 ●●● ⚙ reaping (key)
- **Notes:** *Stays.* It carried a run: up to 83% of an Assassin's damage. A full pool pays for four stabs, so the reaping's cliff is four foes long before mana ends it. As built, a kill the Assassin lands with any ability readies Backstab, Garrote's too, where the card says "it": a small gap between card and build, for the build to close either way.

### Smoke screen
- **Is:** Assassin, Vanish A · version · kept
- **Today:** Hides the ally with the lowest share of HP that isn't Taunting. Waits until an ally is below 80% of its HP.
- **Card:** Hides the ally with the lowest share of HP that isn't Taunting. Waits until an ally is below 80% of its HP.
- **Numbers:** Hidden at its own length (`STATUS.hidden`). Short cooldown (a quarter off with the power step), quick wind-up, 200 MP.
- **Code:** as today's Smoke screen
- **Serves:** Pact ●●, Toll ●● ⚙ two in the dark (key), brink (half)
- **Notes:** *Stays.* A name fading and the foes turning elsewhere is seen. One cast covers under half of its own cooldown, so on its own it's one unit in the dark about half the time. Two in the dark needs a second hiding that's laid again; Night's edge is one, on the same Assassin. As built it also passes over an ally that's already Hidden, which the card doesn't say.

### Night's edge
- **Is:** Assassin · mythic (armor) · kept
- **Today:** When the Assassin lands a killing blow, it's Hidden for a moment, and its next hit deals double damage.
- **Card:** When the Assassin lands a killing blow, it's Hidden for a moment, and its next hit deals double damage.
- **Numbers:** Hidden at its own length, if it isn't Hidden already. The next hit it lands deals double, once.
- **Code:** as today's Night's edge
- **Serves:** Hunt 3 ●●● ⚙ two in the dark (half)
- **Notes:** *Stays.* It was part of the one full set play saw work. "For a moment" is Hidden's own length; no status is laid for less. With Coup de grâce the doubled hit is the next stab, so a kill makes the next kill likelier, and the foes running out is what ends it.

## Vampire

### Blood for mana
- **Is:** Vampire, Blood gift A · version · kept
- **Today:** Spends a fifth of its max HP to give the other ally with the least MP as much MP, and gives it Clarity. Waits until another ally is under half its MP and the Vampire is at 35% of its max HP or more.
- **Card:** Spends a fifth of its max HP to give the other ally with the least MP as much MP, and gives it Clarity. Waits until another ally is under half its MP and the Vampire is at 35% of its max HP or more.
- **Numbers:** The price is a fifth of its max HP, paid, not damage. The gift is as much MP in one piece (two fifths more with the power step), and Clarity at its own size. Medium cooldown, normal wind-up, 450 MP.
- **Code:** as today's Blood for mana
- **Serves:** Barrage 2 ●●●, Pact ●● ⚙ mana as armour (half)
- **Notes:** *Stays.* About 800 MP at once and a Clarity behind it is more than a mage's cast: the link at the size `builds.md` asks for. It pays HP, so pieces that read a price read it, and its lump is MP given, so Glimmer robe reads that. Under The chalice the Vampire's own abilities still cost it MP.

### Savage drain
- **Is:** Vampire, Blood drain A · version · kept
- **Today:** Three quick hits on a random foe, each a third of the damage, scaling from max HP, each drinking; the foe is Weakened.
- **Card:** Three quick hits on a random foe, each a third of the damage, scaling from max HP, each drinking; the foe is Weakened.
- **Numbers:** Three hits, each a third of 0.4 of max HP. Each is a hit, so its Lifesteal drinks from each. Weaken at its own size. Quick cooldown, quick wind-up, 125 MP.
- **Code:** as today's Savage drain
- **Serves:** Cuts 1 ●●●, Pact ●●
- **Notes:** *Stays.* It made the best Vampire play saw. Three hits where there was one is three payments on a wound and three drinks. Its pick is a random foe, so a Mark takes all three.

### The chalice
- **Is:** Vampire · mythic (offhand) · changed
- **Today:** When an ally falls, the Vampire heals to full. The next time the Vampire lands a killing blow, a fallen ally rises with a quarter of its max HP. (Thrall's chalice, which this replaces.)
- **Card:** Whenever another ally would pay MP for an ability, the Vampire pays HP instead: the same share of its max HP as the cost is of that ally's max MP. It doesn't pay when that would leave it at a tenth of its max HP or less; the ally pays its own MP then.
- **Numbers:** The price is the ability's MP cost, divided by its caster's max MP, times the Vampire's max HP. It's paid as the cast resolves, where the MP would have been, and it's a price, not damage. The floor is a tenth of the Vampire's max HP: it pays the whole price or none. A cast that costs no MP costs no HP.
- **Code:** 20. Two things more, under *Code support beyond the spine's list*.
- **Serves:** Pact 3 ●●●, Barrage ●●● ⚙ blood mage (half), brink (key)
- **Notes:**
  - **Seen:** the Vampire's red bar steps down with every ability the other two cast, and their blue bars never move.
  - **What it does to the Vampire.** Two allies' casting is most of its health bar each fight, so it rides between a tenth and wherever its drinking takes it: the unit that's always lowest, which is the brink, and below half, where Bloodlust doubles its drink.
  - **"The same share"** is the line's, and Sanguine vestments words its price the same way. It means a cheap skill from a small pool costs as much blood as a great spell from a deep one. See Least sure.
  - **Only MP is taken over.** A caster whose abilities already cost HP, by its robe or the party's formation, pays its own.
  - **Who drinks it back.** The Vampire, by its own hits. The caster's Lifesteal heals the caster. See Links, the blood mage.
  - **It takes mana away as a brake** for everything the other two do. See Loops.
  - Nothing of the old card is kept: no piece wants a fall.

## Pyromancer

### High pyre
- **Is:** Pyromancer, Pyre B · version · changed
- **Today:** Deals heavy damage to the foe with the most Burn; the damage scales from Attack and rises by 200 with each Burn stack on that foe. The Burn stays. Whenever a burning foe falls, Pyre comes 4 ticks closer. (Pyre of the fallen, which this replaces.)
- **Card:** Waits until a foe holds 20 Burn or more. Deals heavy damage that scales from Attack to the foe with the most Burn, rising by 500 with each Burn stack on that foe as it lands. The Burn stays.
- **Numbers:**
  - **The wait:** a foe holding 20 Burn stacks or more, a flat count the player reads on the foe. It's checked when the wind-up starts.
  - **The blow:** `HIT.heavy` of Attack, and 500 for each Burn stack on its foe when it lands: two and a half times Pyre's step.
  - Long cooldown, very long wind-up, 1,500 MP, as Pyre. The power step is Pyre's: 40% more damage.
- **Code:** none from the spine's list. A wait on a foe's stacks at a number is noted under *Code support beyond the spine's list*.
- **Serves:** Bonfire 2 ●●●, Barrage ●
- **Notes:**
  - **Seen:** the Pyromancer keeps casting bolts with Pyre unspent, and when the fire stands at 20 the long wind-up starts. On thirty Burn it lands for about 19,000 before Defense, where Pyre lands for about 10,000.
  - **Why 20.** One Firebolt leaves a bare Pyromancer's fire at about 16, so one bolt doesn't open it. Two in a row do, and so does any fire a second feeder is helping to hold. It's a count a fed fire reaches in most fights, since a wait the fights rarely meet is worth nothing.
  - **The wind-up is the catch.** Burn loses nearly half its stacks in the eight ticks the cast takes. A lone Pyromancer's pyre lands on about twelve; a party that keeps feeding lands it on thirty or more. That's the road's own rhythm, on one spell.
  - **Against the base** it gives up the casts on a low fire that `classes.md` already calls a waste.
  - The four ticks closer of the old card are gone: that size was never seen.

### Kindling
- **Is:** Pyromancer, Stoke A · version · kept
- **Today:** Its basic attacks add a few Burn to their target, in place of its casts; stacks scale from Attack.
- **Card:** Its basic attacks add a few Burn to their target, in place of its casts; stacks scale from Attack.
- **Numbers:** A few Burn is the passive's count from Attack, times `BURN_STACKS`: three or four a swing. Its casts no longer stoke.
- **Code:** as today's Kindling
- **Serves:** Bonfire 1 ●●● ⚙ lead's colour (half)
- **Notes:** *Stays.* It was in both Bonfire runs. A swing lands where swings land, so it spreads the fire where Stoke piled it; a Mark gathers it again. It reads as Spark wand does, which the director has agreed to.

### Crown of embers
- **Is:** Pyromancer · mythic (amulet) · kept
- **Today:** While the Pyromancer stands, every ally's hits add a Burn.
- **Card:** While the Pyromancer stands, every ally's hits add a Burn.
- **Numbers:** One Burn stack (`FLAT_STACKS.one`) for each hit any ally lands, the Pyromancer included. It ends when the Pyromancer falls and comes back when it's raised.
- **Code:** as today's Crown of embers
- **Serves:** Bonfire 3 ●●● ⚙ lead's colour (half)
- **Notes:** *Stays.* One stack sounds small and isn't: a Burn stack deals about 370 over its life, and this adds one for every hit of three units, extra strikes and multi-hits included. Play's deepest run ended wearing it. For the lead's colour it's a rider on every ally already, and round 1 rules that a carrier doesn't add a rider its own swing already holds from the same source, so a Follower under the Crown adds one Burn a hit, not two.

## Frostweaver

### Splinters
- **Is:** Frostweaver, Shatterpoint B · version · changed
- **Today:** When a foe's Chill shatters, that foe takes several Sunder, and every other foe takes a third of the shatter's damage; stacks scale from Attack.
- **Card:** When a foe's Chill shatters, that foe takes several Sunder (stacks scale from Attack), and every other foe gains a third of the Chill it held.
- **Numbers:** Several Sunder is the passive's count from Attack, as Shatterpoint's, with its power step. The cold sent on is a third of what the foe held as it shattered: 4 stacks at Chill's cap (`STATUS.chill.cap`), in whole stacks. It's read from the foe, not from anyone's Attack.
- **Code:** 9, 23
- **Serves:** Snap 2 ●●● ⚙ firecracker (key)
- **Notes:**
  - **Seen:** one foe bursts and every other counter steps up by four.
  - **The link's size.** Four takes a neighbour at eight or more to its cap, so it bursts too and sends four on; a neighbour at three goes to seven and waits. It's the cold field that makes the string, and the Frostweaver that makes the field.
  - **The chain's damping** is Chill's own rule and on no card, as ruled. This card says nothing of it.
  - **The third of the shatter's damage** on the other foes is gone: the cold replaces it.
  - **With Glacier's heart, and with Winter's chain,** the string runs much further. See Loops.

### Frost armor
- **Is:** Frostweaver, Blizzard A · version · changed
- **Today:** Guards every ally, and adds a few Chill to every foe; stacks scale from Attack. Deals no damage.
- **Card:** Guards every ally. For as long as that Guard, a foe that hits a Guarded ally gains a few Chill; stacks scale from the Frostweaver's Attack. Deals no damage.
- **Numbers:** Guard at its own size and length (`STATUS.guard`). A few Chill is half again the passive's count from the Frostweaver's Attack, read when it's cast: about 3 for each hit a foe lands. Medium cooldown, long wind-up, 1,000 MP, as Blizzard. The power step is today's for this version: 40% more Chill.
- **Code:** none from the spine's list. A status on every ally for Guard's length that lays a status on whatever hits its holder, sized from its caster: as today's Static field does with Shock.
- **Serves:** Snap 2 ●●, Toll 2 ●●● ⚙ frozen gate (key)
- **Notes:**
  - **Seen:** the pack's counters climb with every blow it lands, on anyone, and its swings come slower each time.
  - **The size.** At about three a blow a foe bursts on its fourth, or its third with a Stillness or a lance behind it. That's the link's "within a few of its swings". At the plain passive's count it would be six blows, which is past the Guard's length, since every stack also slows the foe that's climbing.
  - **Each hit counts.** A wolf's flurry adds for each bite, and a boss's blow on all three allies adds three times. A dodged hit adds nothing.
  - **"That Guard"** is the frost riding the cast for Guard's own length. A Guard laid on an ally by someone else afterwards doesn't lengthen it.
  - **It gives up** Blizzard's damage and its Chill on the whole field: nothing is cold until it strikes.
  - **Beside Hoarfrost plate and Frostward blade** it's the gate's widest home: every ally, for a while, at a cast's price, with no anchor needed. Its link wants theirs at the same three a blow. See Links.

### Rime shield
- **Is:** Frostweaver, Shatterpoint A · version · kept
- **Today:** When a foe's Chill shatters, the ally with the lowest share of HP gains a Shield from the Frostweaver's max HP, in place of the Sunder.
- **Card:** When a foe's Chill shatters, the ally with the lowest share of HP gains a Shield from the Frostweaver's max HP, in place of the Sunder.
- **Numbers:** A Shield of three tenths of the Frostweaver's max HP, two fifths bigger with the power step, up to the Shield's own cap on whoever gets it.
- **Code:** as today's Rime shield
- **Serves:** Snap 2 ●●, Toll ●● ⚙ frozen gate (half), detonation (half), brink (half)
- **Notes:** *Stays.* About 900 of grey bar on a unit of 2,000 to 5,000 HP is seen. It pays once a shatter, so it's worth what the party's shatters are worth: little where the second shatter never comes, a great deal on a frozen gate.

### Deep calm
- **Is:** Frostweaver, Stillness A · version · kept
- **Today:** Applies Clarity to the ally with the least MP, and the Frostweaver's next ability costs nothing. No Chill.
- **Card:** Applies Clarity to the ally with the least MP, and the Frostweaver's next ability costs nothing. No Chill.
- **Numbers:** Clarity at its own size. The next ability the Frostweaver casts after this one costs no MP, once. Medium cooldown, quick wind-up, 650 MP, or 450 with the power step.
- **Code:** as today's Deep calm
- **Serves:** Barrage 2 ●●● ⚙ crescendo (half), mana as armour (half)
- **Notes:** *Stays.* A cast that leaves the blue bar alone is seen. The free cast is whichever comes ready first, often the lance, the cheapest; slotting decides it, which is the kind of choice the game wants. Under a Crescendo it skips the price and still adds the stack.

### Glacier's heart
- **Is:** Frostweaver · mythic (armor) · kept
- **Today:** Whenever a foe's Chill shatters, the Frostweaver puts half of it back: 6 Chill on that foe.
- **Card:** Whenever a foe's Chill shatters, the Frostweaver puts half of it back: 6 Chill on that foe.
- **Numbers:** Half of Chill's cap (`STATUS.chill.cap`), on the foe that shattered, whoever's Chill it was.
- **Code:** as today's Glacier's heart. By the spine's reading, what it puts back isn't damped (23).
- **Serves:** Snap 3 ●●● ⚙ firecracker (key)
- **Notes:** *Stays.* It was never offered in play. It's the second shatter play never saw, in half the time of the first, on a boss as on a wolf. Six can't reach the cap by itself, so alone it never loops. Beside Splinters it nearly can: see Loops.

## Stormcaller

### Static field
- **Is:** Stormcaller, Thunderstorm A · version · kept
- **Today:** For a while, every foe that lands a hit on an ally gains a few Shock; stacks scale from the Stormcaller's Attack. Nothing on the swings.
- **Card:** For a while, every foe that lands a hit on an ally gains a few Shock; stacks scale from the Stormcaller's Attack. Nothing on the swings.
- **Numbers:** A few Shock is the passive's count from the Stormcaller's Attack, times `SHOCK_STACKS`: about 4 for each hit landed. It lasts the storm's length (`KIT.storm`). Medium cooldown, normal wind-up, 650 MP.
- **Code:** as today's Static field
- **Serves:** Toll 2 ●●●, Storm 2 ●● ⚙ goad (half)
- **Notes:** *Stays.* Four Shock cost a foe about 340 at its next action and half that at the one after: more than the Bramble knight's own Thorns, for every blow landed on anyone. It's seen as a number on each foe as it moves. A called swing, under the goad, pays the charge at once and picks up a fresh one.

### Recharge
- **Is:** Stormcaller, Chain lightning B · version · kept
- **Today:** Deals damage that scales from Attack to a random foe, then to up to three other random foes, and adds a few Shock to each; stacks scale from Attack. The Stormcaller regains 120 MP for each foe it hits.
- **Card:** Deals damage that scales from Attack to a random foe, then to up to three other random foes, and adds a few Shock to each; stacks scale from Attack. The Stormcaller regains 120 MP for each foe it hits.
- **Numbers:** Chain lightning as it stands, at 650 MP. 120 MP back for each foe a strike lands on: up to 480.
- **Code:** as today's Recharge
- **Serves:** Barrage 2 ●●●, Storm ●● ⚙ resonance (half)
- **Notes:** *Stays.* On four foes it gives back three quarters of its price: the blue bar drops and steps most of the way back, which is seen. On one foe it's under a fifth, and isn't. That's the line: it pays by the foe. Its first strike follows a Mark; the three others don't.

### Overcharge
- **Is:** Stormcaller, Static charge A · version · kept
- **Today:** Its basic attacks come faster for a while. While that lasts, its next three abilities cost no MP.
- **Card:** Its basic attacks come faster for a while. While that lasts, its next three abilities cost no MP.
- **Numbers:** Static charge as it stands (`KIT.staticCharge`). Three free casts, lost when the charge ends. Long cooldown (medium with the power step), quick wind-up, 650 MP.
- **Code:** as today's Overcharge
- **Serves:** Barrage 2 ●●● ⚙ crescendo (half)
- **Notes:** *Stays.* Three casts with the blue bar still is seen, and it's worth up to three times what it costs. Under a Crescendo each free cast skips the price and adds its stack. A free Recharge still gives its mana back: see Loops.

### Eye of the tempest
- **Is:** Stormcaller · mythic (weapon) · kept
- **Today:** Every hit the Stormcaller lands jumps to one more random foe for half its damage. When a foe falls holding Shock, every other foe gains half of it.
- **Card:** Every hit the Stormcaller lands jumps to one more random foe for half its damage. A jump doesn't jump again. When a foe falls holding Shock, every other foe gains half of it.
- **Numbers:** The swing is its own, as today's: one hand, 6.6 ticks, a full, even swing. No stat steps. A jump is half the hit's damage on one other random foe. Half a fallen foe's Shock, in whole stacks, goes to every other foe.
- **Code:** as today's Eye of the tempest
- **Serves:** Storm 3 ●●●
- **Notes:** *Stays,* with one sentence added: the brief asks a card that lands a blow again to say whether the second can repeat, and today's build already stops it. It was never offered in play. As built, only the hits of basic attacks and abilities jump: Arc's second hit and Double strike's don't, where the card says "every hit". See Challenges. A jump's foe is a second pick, so a Mark doesn't steer it.

## Geomancer

### Rampart
- **Is:** Geomancer, Earthen shell B · version · kept
- **Today:** Applies Shield and Guard to itself. While that Guard lasts, the first time its Shield breaks it's rebuilt at once. No Shield for an ally.
- **Card:** Applies Shield and Guard to itself. While that Guard lasts, the first time its Shield breaks it's rebuilt at once. No Shield for an ally.
- **Numbers:** The Shield is Earthen shell's: its Defense, up to the Shield's cap. Guard at its own size and length. The rebuild is the most that Shield held, once a cast. Medium cooldown (short with the power step), normal wind-up, 650 MP.
- **Code:** as today's Rampart, with the rebuild reading the most the pool held (today's reads the shell's amount from Defense again)
- **Serves:** Landslide 2 ●●● ⚙ detonation (key)
- **Notes:** *Stays.* The grey bar goes and comes back whole: seen. The size of the rebuild follows round 1's ruling for every share: "the most that Shield held" is the pool's highest point since the unit last had none, and Rampart reads it. Today's build reads the shell's own amount again; a Geomancer's Defense is far over its Shield's cap, so on the card and on the bar the two are the same. It's once a cast, so with a break piece it's two detonations a shell and no more.

### Faultline
- **Is:** Geomancer, Bedrock B · version · kept
- **Today:** While its Shield pool is above zero, its crit chance is doubled. When its Shield breaks, its next hit crits for triple damage.
- **Card:** While its Shield pool is above zero, its crit chance is doubled. When its Shield breaks, its next hit crits for triple damage.
- **Numbers:** Bedrock as it stands. After a break its next hit always crits, at three times the hit in place of the Geomancer's two.
- **Code:** as today's Faultline
- **Serves:** Landslide 2 ●●● ⚙ detonation (half)
- **Notes:** *Stays.* A rock for about 7,500 right after the stone breaks is seen, and it gives the break a blow where Bedrock alone made it a loss. A hit that always crits wins over Gambler's coin. With Rampart there are two breaks a shell, so two such rocks.

### Aftershock
- **Is:** Geomancer, Tremor A · version · kept
- **Today:** Deals damage that scales from Defense to a random foe, and Stuns every foe.
- **Card:** Deals damage that scales from Defense to a random foe, and Stuns every foe.
- **Numbers:** `HIT.normal` of Defense on one foe. Stun at its own length on every foe that isn't Stunned already. Long cooldown, very long wind-up, 1,000 MP.
- **Code:** as today's Aftershock
- **Serves:** Landslide ●●, Storm ●● ⚙ held charge (half)
- **Notes:** *Stays.* The whole field stopped for a Stun's length is seen, and it's the held charge's widest hold: no foe can pay its Shock off while the party keeps charging it. A boss shrugs off the later ones, as it does any control. The rock's pick is a random foe, so it follows a Mark.

### Mountain's crown
- **Is:** Geomancer · mythic (amulet) · kept
- **Today:** Each crit the Geomancer lands rebuilds its own Shield by the damage the crit dealt.
- **Card:** Each crit the Geomancer lands rebuilds its own Shield by the damage the crit dealt.
- **Numbers:** The crit's damage, added to its Shield pool, up to the Shield's own cap.
- **Code:** as today's Mountain's crown
- **Serves:** Landslide 3 ●●● ⚙ detonation (half)
- **Notes:** *Stays.* It was never offered in play. With its own passive it's the stonecutter `builds.md` names: while the stone stands it crits, and every crit rebuilds the stone. One crit refills the whole bar, so with it the Shield rarely breaks, which works against Faultline and the break pieces: a Geomancer builds toward the break or away from it.

## Challenges

**The ones that most need a ruling:**

1. **Huntmaster's quiver is resized from "halved" to "ready again".** Halving the cooldowns left on quick and short arrows saved three to five ticks each: the size play never saw, on a mythic. Ready again is the same reward at a size that's seen, and it's a big step: every fall of a foe the Ranger's arrows touched brings all three back, at 725 MP a round. If that's too far for a kept item, the alternative that's still seen is "the arrow that hit it is ready again". The same entry needs the quiver to leave Barbed volley aimed at every foe; today's build would turn the volley into one arrow.
2. **Rubato can ready itself.** As the line has it, "every ally" includes the Bard, and when nothing else of the Bard's is cooling down, Rubato is its ability nearest to ready. It then casts again until its mana is gone: three casts from a full pool, each one readying an ability for both allies. A Bard that knows only this song does it every time. The brief says to report a loop, not fix it, so the card is written to the line. The fix is one clause: "for the Bard, another of its own."
3. **Writ of judgement with a free marker.** The spine lists this loop with "a foe that survives the blow" as its brake. At first values the blow is about 4,900 after a minion's Defense, more than most act I foes hold, so with Hunter's mark on the Paladin the chain runs through a pack at no cost. The numbers can't brake it without making the mythic's blow small. It's the lead's to leave or rule.
4. **Swift justice: what "the judged foe falls" means.** Written as "falls holding the Paladin's Mark", which the player can see and the engine can hear. Marked lasts 14 ticks, so the reset needs the kill inside that. The other reading remembers the last foe Condemn Marked after the Mark has gone, which fires more often and rests on something with no icon.

**Marked: three readings the line leaves open.** What the entry assumes is first each time.
- **A phrase's fallback.** "The foe with the most Burn" falls to a random foe when none burns. Written as not following the Mark, since the line says an ability with a phrase of its own keeps it. I'd rule the other way: the first Firebolt of a fight would land on the Marked foe and the pile would form there, which is a Mark the player can see working.
- **The Fizzle rule.** Shield bash, Tremor and Garrote skip a foe that already holds their status. Written as: the Mark holds, and they land on the Marked foe for their damage alone when every Marked foe already holds it. The other reading sends them off the Mark to a fresh foe.
- **"A random foe that isn't Taunting"** (Gale spear, Garrote), when the Marked foe is the one Taunting. Written as: the Mark takes it.

**Lines and words:**
- **Malison's power step.** "40% more of every status it adds" now grows only the Bleed, which isn't what the curse is for any more. The plain step for a hit is two fifths more damage. The spine says every ability keeps its power step, so it isn't changed here.
- **The chalice and "pays HP".** The spine defines the phrase as a price taken "from its user's own HP". The chalice's price is taken from the Vampire for someone else's ability. The spine's own note has Bloodstone reliquary reading it, so the Vampire is the payer; the definition needs that said.
- **Halo of the saint and "a repeat isn't repeated".** Written as: a cast made twice by another piece has both its heals widened, since widening isn't casting again, and the Halo's own copies are never copied. If the rule is read strictly, the second cast's heal isn't widened.
- **Stormspear and the Taunt rule.** A blow that a piece calls isn't an ability's or a basic attack's first pick. Written as: it lands by its phrase, Taunt or not, and a Mark doesn't steer it. Every blow called by a piece in the fill needs the same answer; it's one ruling for all shares. Stormspear also loses "ignore Taunt" on its swings, which the spine's line drops without saying so.
- **The last wall and the mirror's link.** The link says Hoplon and The last wall both send back what the cover stopped, "so better stone sends more". For the Aegis that isn't so: it's checked after Defense, so better stone sends less, and can take the blow under Aegis's line. Kept as today's; the link's sentence wants changing, or the mythic wants reading the blow as it was struck, which would be a change to a kept item.
- **Eye of the tempest.** The card says every hit jumps; the build leaves out extra strikes. One of the two should move. "A jump doesn't jump again" is added, by the brief's rule for repeats.

**Target phrases today's cards use that the vocabulary's table doesn't have.** The brief asks for the table's phrases word for word. These have no entry, so each is written as today's cards have it:
- "the foe with the lowest share of max HP" (Swift justice, Quarry);
- "the ally with the least MP", by share of max MP, and its "other" form (Deep calm, Blood for mana, Rally the well, Horn of the keep);
- "the ally with the slowest basic attack" (Rousing chorus);
- "the ally with the most Aggro" (Watch the anchor).

Today's cards also shorten two that the table does have: "the lowest share of HP" for "the lowest share of max HP", and "the lowest HP" for "the lowest current HP". The kept cards here repeat today's wording and the changed ones use the table's. One ruling for the whole fill would settle it.

**Stale words on kept cards,** left as they are for a ruling:
- **"Physical damage"** on Coup de grâce and Frost fist. There's one kind of hit now.
- **"A little"** Chill on Frost fist, which isn't one of the scale's stack words.
- **Night's edge's "for a moment"** is Hidden's whole length.

**Cards that say less than the build does:** Coup de grâce (any ability's kill readies Backstab), Smoke screen (it also passes over an ally already Hidden).

**Names.** None clashes. Two notes:
- **Halo of the saint and Heart of the saint** can sit on one Cleric, with Saint's mace in its hand. The Halo's name is today's; the others are another share's.
- **Three pyres** now sit in one fire party: High pyre, Pyre of judgement and Pyre line.

**`fill/shared.md`:** nothing in it fails a card here. No item in this share uses a counter.

## Links

For each engine this share touches: the size of my side, and what the other side needs for the two to meet.

- **The shield detonation.**
  - *My side:* Rampart rebuilds the shell's own amount, once a cast, which is a Geomancer's whole cap. Rime shield lays about 900 a shatter on the lowest ally. Faultline turns a break into a triple crit. Mountain's crown refills the bar on every crit.
  - *The other side:* the break pieces read the most the pool held, whatever filled it, which round 1 rules for all of them and for Rampart. Mountain's crown keeps the stone from breaking at all, so a Geomancer wearing it feeds the detonation least.
- **The frozen gate.**
  - *My side:* Frost armor lays about 3 Chill for each hit a foe lands on any ally, for Guard's length, so a foe bursts on its third or fourth blow. Rime shield answers each burst with about 900 of Shield on the lowest ally.
  - *The other side:* Hoarfrost plate and Frostward blade need about three a blow too. Read off an anchor's own Attack, "a few" is under one and a half on a Knight, and nine blows to a shatter isn't the link. Round 1 has the on-struck pieces reading one stat, and the share that's in reads the holder's Defense: a few from a wall's Defense is about three, which meets it. Frost armor reads its caster's Attack, as Static field does; if the pieces settle on Defense, this version is the one home that doesn't, which is right for a spell.
- **The mirror.**
  - *My side:* The last wall sends back all an Aegis stopped and readies Aspis, at 500 MP. Watch the anchor keeps the Aegis on whoever draws.
  - *The other side:* a draw that holds through a wind-up, and blows big enough to clear Aegis's line after the wall's own Defense. On the best walls only a boss's great blows do. Round 1 rules Hoplon the same way, by the numbers the game prints, so the two pieces agree; the link's sentence about better stone is what's left to change. See Challenges.
- **The goad.**
  - *My side:* the toll a called blow pays. Static field: about 4 Shock, some 340 at the foe's next move. Hold the line: 150 of Thorns. Overgrowth: 600, with Briar's Bleed.
  - *The other side:* the call has to cost the pack more than the blow costs the anchor. A bandit's swing takes about 290 from a Knight. So the goad pays on Overgrowth and under Static field, and on Hold the line alone only against light hitters.
- **The held charge.**
  - *My side:* Thunderclap is doubled by a charge of about 23 on a foe and nearly tripled at the cap. Stormspear's blow is doubled at 13 and four times the size at the cap. Aftershock holds the whole field for a Stun's length.
  - *The other side:* charge enough to matter. A party's riders hold a field at 5 to 15 stacks while it acts, so the readers pay mostly on a held foe or a slow boss, which is the engine. With Stormspear in hand the Valkyrie has no rider of her own: the charge is Gale spear's and the party's.
- **The reaping.**
  - *My side:* Coup de grâce lands for about 2,000 and is ready again at its kill, at 325 MP: four from a full pool. Huntmaster's quiver, resized, readies all three arrows at each fall, at 725 MP a round.
  - *The other side:* a field sunk under about 1,800 HP together, and mana for the reaper. Without mana the cliff is four foes long.
- **The judge's drum.**
  - *My side:* Swift justice's call, made again when a foe falls under the Paladin's Mark, at 650 MP a call. Nothing to size.
  - *The other side:* a kill inside Marked's length, which is three units on one foe that was already the lowest; swings worth calling; and five calls' worth of mana.
- **The spell on the swing.**
  - *My side:* Metronome at twenty hits readies three songs, 1,750 MP if all are cast.
  - *The other side:* hits, which a fast party supplies every fifteen ticks or so, and mana for the Bard, which is the limit the link names.
- **The red rain.**
  - *My side, the wounds:* Barbed volley and Plague each lay five or six Bleed on every foe, which pays about 670 to the next hit on each. Heartwood mail leaves Briar's Bleed on every attacker of anyone.
  - *My side, the wide hits:* Whipping vines (about 490 a foe after Defense), Malison and its versions, and the witch-blade's three swings. The link's size holds for all but Malison itself, whose own hit is bigger than the wound it cashes.
  - *The other side:* nothing: any wide hit in the party pays.
- **The riposte.**
  - *My side:* the draw on a dodger: Stillness of mind (a Taunt with seven blows in ten missed) and Over the fallen (a Taunt and a Guard when an ally is at 30% or down). And cover by hitting: Drinking palm, resized to a fifth of each hit.
  - *The other side:* the answering strike has to be a real swing. On a Valkyrie it banks Shield through her passive. On a Monk, Drinking palm only heals: it banks nothing above full unless something turns healing past full into a Shield, and the Monk's Leather can't hold Red stone mail. For the Monk, "banks cover" needs the cloak that Shields on a dodge.
- **Every colour.**
  - *My side:* Malison pays a fifth for each of the five, double at all five. Plague lays three of them, five or six stacks each, which last about one Malison cooldown. Focused curse triples it on one foe. The witch-blade carries the Hexer's own colour to every cursed foe.
  - *The other side:* afflictions that are still there when the curse comes round: a rider on a swing, the idol that tops each up, the wand that scatters them. Chill and Sunder hold longest; a single lot of Burn or Shock is gone in about a cooldown.
- **The lead's colour.**
  - *My side:* a colour on a swing from the kit: Hex of flames (about 3 Burn a swing), Kindling (3 or 4), and Crown of embers (one Burn for every hit of every ally).
  - *The other side:* The standard and Mimic wand carry what the Lead's swing carries. Under Crown of embers every swing already carries the Crown's Burn, so their cards have to say whether a Follower adds the Lead's on top of its own. I'd say no: it's one aura, not two riders.
- **The emptied quiver.**
  - *My side:* Quick draw: each crit is the next swing at once, with a quarter-tick of recovery between. Barbed volley makes every foe a bleeding one.
  - *The other side:* the crit chance its makers give. The burst runs three or four arrows when a swing crits about seven times in ten. At nine in ten it's ten arrows, and on a foe that hasn't acted or is Stunned that's ten arrows in under three ticks. "Far more often" and "nearly always" on those pieces decide whether this is a burst or a stream.
- **The blood mage.**
  - *My side:* The chalice moves an ally's price onto the Vampire, the same share.
  - *The other side:* the link reads the price back through the caster's Lifesteal, and here the caster isn't the one who paid. What repays the Vampire is its own drinking, or a piece that turns a price into a heal for someone else. The chalice is the blood mage with two bodies; the pieces written for one body don't close it.
- **The resonance.**
  - *My side:* Recharge gives back 120 MP a foe, 480 of the chain's 650 on four.
  - *The other side:* the link says mana stops it. With Recharge, a chain on four foes costs 170, so a full pool is thirteen casts, and at two or three times the pace that's the whole fight. Beside this version the thinning pack is the only brake.
- **The crescendo.**
  - *My side:* the free casts: three for each Overcharge, one for each Deep calm. Each skips the price and still adds a stack.
  - *The other side:* a price that climbs fast enough for the skips to matter.
- **Mana as armour.**
  - *My side:* Horn of the keep, resized, gives half of every blow on the Knight. Blood for mana gives about 800 at once and a Clarity. Rally the well and Deep calm give Clarity, about a quarter of a pool over its length.
  - *The other side:* a piece that takes damage from MP. By the spine's words the Horn's and Blood for mana's are MP given and Clarity's isn't, which matters to Glimmer robe and not to the orb.
- **The firecracker string.**
  - *My side:* Splinters sends 4 to every other foe. Glacier's heart puts 6 back on the foe that burst. Hail, resized, lays about 3 on every foe a cast.
  - *The other side:* a field already at eight or more, which Hail and the Frostweaver's own casts reach by the middle of a regular fight. The other homes send 6 to the coldest foe, or a few to all; any two of them together run long. See Loops.
- **The brink.**
  - *My side, the unit held low:* The chalice keeps the Vampire between a tenth and wherever it drinks to.
  - *My side, the answers:* Halo of the saint (every heal and Regen, on everyone below half), Lament (below half), Rime shield and Smoke screen (the lowest ally, whatever its HP), Shared rites and Over the fallen (below 30%).
  - *The other side:* how low the unit is held. Halved heart holds at half exactly, which wakes none of the "below half" answers until a scratch, and never the two at 30%. A price or a drain goes lower. The engine is fullest with a payer, not a cap.
- **Two in the dark.**
  - *My side:* Smoke screen hides the lowest ally that isn't Taunting for Hidden's length, under half of its own cooldown. Night's edge hides the Assassin at each kill.
  - *The other side:* a second hiding that's laid again and again, and a third unit that wants every blow. With Smoke screen the Assassin no longer hides itself; its mythic gives that back.
- **The red stone.**
  - *My side:* Drinking palm heals the Monk a fifth of each hit on a Sundered foe.
  - *The other side:* something that turns that healing into a Shield once the Monk is full. Red stone mail is Mail, and the Drinker seat reads Lifesteal. As built, Drinking palm's heal is a heal and not Lifesteal, so the seat's card has to read any healing its unit gives itself by hitting, or this half meets nothing.

## Loops

Each with what's in it and what stops it.

- **Rubato, alone.** A Bard with nothing else cooling down readies Rubato with Rubato. *Brake:* mana, 650 a cast: three casts. Weak, and it happens on a one-song Bard every time. Challenge 2.
- **Writ of judgement with a marker that costs nothing** (Hunter's mark, a Marker or Lead seat): a Mark, a blow, a kill, the next Mark. *Brake:* a foe that survives the blow. Weak in a pack of small foes: the blow fells most minions.
- **Swift justice with Writ of judgement:** the same chain through Condemn. *Brakes:* 650 MP a link, so five links, and a foe that survives the blow and the volley together.
- **Huntmaster's quiver, resized, with Barbed volley:** a foe falls, by anyone's hand, and the volley is ready and wounds the whole field again. *Brakes:* 325 MP a volley, its wind-up and recovery, and the foes running out.
- **Splinters with Glacier's heart** (and worse with Winter's chain in the Frostweaver's hand). The ruled damping ends a chain of Splinters alone: a foe that has burst needs twelve from cold that's halved and halved again. Glacier's heart puts six back undamped, so a foe needs only six more. Once the damping is down to one stack a pass, six other foes bursting supply it. In a pack of seven or eight every foe keeps bursting in turn; in a pack of four to six the string runs about two rounds and dies. *Brake at seven or eight:* the shatter's own damage, about 3,000 a burst, which fells most minions in a round or two. The chain ends because the pack does. If that's not the fizzle the director ruled for, the floor of one stack is the number that decides it.
- **Quick draw:** the engine's own loop. *Brake:* the crit that fails, and a quarter-tick between arrows. How long it runs is set by the pieces that make crits near certain: see Links.
- **Coup de grâce with Night's edge, or with Bounty charm:** the spine's kill chain. *Brakes:* 325 MP a stab, and the foes running out.
- **Recharge under Overcharge:** a free chain still gives its mana back, so three casts make up to 1,440 MP where they'd have cost 1,950. It's a mana engine on one unit, not a loop. *Brake:* three casts a Static charge. With a resonance piece as well, mana no longer stops the chain at all while four foes stand; the pack thinning does.
- **The last wall with mana that isn't the Hoplite's** (The chalice): every blow over Aegis's line is blocked, sent back, and the next Aegis is up within three ticks. *Brakes:* the Vampire's health, and the blows under the line, which pass.
- **The chalice with anything whose brake was mana** (The cathedral's Soloist, a resonance, the Paladin's drum, the Bard's songs under Metronome). *Brake:* the Vampire's floor at a tenth, after which each caster pays its own mana again. It moves the brake; it doesn't remove it. Beside Bloodstone reliquary each price is also a heal on the lowest other ally, which is strong and doesn't loop.
- **Metronome with Rubato:** hits ready the songs, Rubato readies abilities, their hits fill the count. *Brake:* the Bard's mana: a full round of songs is 1,750.
- **Horn of the keep:** a Taunt laid again each time one runs out during an ally's wind-up, without limit. Beside a caster with long wind-ups that's a Taunt all fight, which is its purpose. What reads a Taunt held in the Knight's kinds (Oathkeeper's sweep) only lasts longer for it; nothing the Knight can hold beside it is set off by a Taunt being laid.
- **Closed on the card:** Halo of the saint's copies aren't copied; Stormspear's blow isn't counted; a jump of Eye of the tempest's doesn't jump.
- **None found:** the other versions and mythics. Each reads a state and leaves it, or fires on its own cast.

## Code support beyond the spine's list

- **Halo of the saint:** a heal or a Regen that an ability gives, given again whole to every other ally that passes a test, with the copies marked so nothing copies them (23). The list has a cast made twice (16) and nothing that widens one.
- **The chalice,** beyond 20's price paid by one unit for another:
  - an ally's ability counts as affordable when the Vampire can pay for it, so a caster at no mana still casts;
  - the Vampire counts as the one who paid, for the pieces that read a price.
- **A blow dealt by a reaction as a hit of its own,** sized from Attack and not from the weapon: Writ of judgement's and Stormspear's. Today's reactions strike with the weapon or deal untyped damage. With it, whether the Taunt rule holds such a blow.
- **A rider on every hit** its holder lands, sized by a status on the target: Ember palms. Today's riders sit on basic attacks, and per-stack terms sit on abilities.
- **A wait on a foe's stacks at a number:** High pyre's 20 Burn. Today's waits read whether a status is held, or the caster's own count.
- **Marked (1):** the Fizzle rule read among the Marked foes; and a phrase's fallback, if it's ruled to follow.
- **Huntmaster's quiver:** its new aim has to leave alone an ability aimed at every foe.
- **Nothing new** for Swift justice, Rubato, Rousing chorus, Barbed volley, Frost armor, Plague, Focused curse or the resizes: each is today's shape with other numbers, or a primitive that exists.

## Least sure

- **Huntmaster's quiver at "ready again".** The right kind of size, and possibly too much of it. Challenge 1.
- **Malison as a light hit.** It's the Hexer's own number at last, on a short cooldown, on every foe, for 450 MP: more per cast than Fireball's hit. A touch would keep it near today's worth and may not be seen. I chose seen.
- **High pyre's two numbers,** 20 to open and 500 a stack. The count decides whether a lone Pyromancer ever casts it; the long wind-up decides what it lands on. If it lands on twelve most of the time, it reads as a slower Pyre.
- **Plague's stacks.** At a few, its Burn and Shock barely outlast one cooldown, so "the next curse landing bigger" is half true on a lone Hexer. The line's word is a few, so it's a few.
- **The chalice's "same share".** A Monk's Flow costs the Vampire more blood than a Pyromancer's Firebolt, because each is a share of its own caster's pool. It's the line, and it matches Sanguine vestments; a player may find it backwards. MP for HP, one for one, is the other way to say it.
- **Hail at about 3 a foe.** It's seen, and it makes the Ranger a better field of cold than the Frostweaver's own two field spells, for a fraction of the mana. The Frostweaver's counts are the balance pass's first job; this may want to follow them.
- **Frost armor's Chill,** at half again the passive's few. Sized to the link. If Hoarfrost plate and Frostward blade come in at the plain word, the version out-freezes both rares.
- **Rousing chorus and Might's cap.** One cast nearly fills it, so the power step and a second cast add little. It may want fewer stacks more often, or it's simply a version that's done after one song.
- **Drinking palm at a fifth,** and **Horn of the keep at a half.** Both were sizes play named as unseen. Both resizes are my reading of how far "seen" is, and either could sit a step lower.
- **Shieldbearer, left alone.** A quarter more on every blow is a first step that may read as a stat. Doubling it, so Defense counts as Attack does, is the resize I'd make if the lead wants one.
- **Stormspear's blow,** a normal hit on Skyfall's step, about every ten ticks. It may out-earn Skyfall itself, which is what a mythic does, or bury it.
- **Ember palms at 25 a stack.** On a fire of fifty it adds more than the Monk's own blows three times over. It's a mythic on a far end, and it's a guess.
- **Barbed volley's cooldown and cost,** moved a word and a rung as Whipping vines' were. It could as well keep the base's.
- **The kept items I didn't doubt.** Thirty-one versions and nine mythics are marked *Stays* with a line each. Several of those were never fielded in play, so "seen" is my reading of the card, not a fight.
