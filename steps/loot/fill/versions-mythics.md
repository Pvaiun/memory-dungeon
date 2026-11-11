# The fill: versions and mythics

One share of the loot pass's fill, written from `spine.md` by `fill-brief.md`. Nothing here is built, and every number is a first value.

**What it holds:** 60 items.
- **The two kit changes:** Marked, and the Hexer's Malison.
- **42 versions:** 9 changed, written new; 33 kept, each checked against today's card. Three of the kept are resized (Hail, Drinking palm, Frost fist).
- **16 mythics:** 5 changed, written new; 11 kept. Two of the kept are resized (Horn of the keep, Huntmaster's quiver), and one gains a sentence (Eye of the tempest).

**Round 1's rulings are applied:** those for every share (`fill/shared.md`) and those for this share (`fill/round-1.md`).

**How it's laid out.** The kit changes come first, since everything after reads them. Then one heading a class, in the classes' own order. Under each class: its versions in the spine's order (the changed, then the kept), then its mythic. An entry's **Is** line says changed or kept, and a kept entry's **Notes** start with *Stays* or *Resized*. A kept card whose only change is its wording (the vocabulary's target phrases in full, a stale word gone, as round 1 rules for every share) still *Stays*, and its note says what was reworded.

**How to read the numbers.**
- A word names its constant in `content/core-set/scale.ts`.
- **"The ability's count"** of a stack word is `ABILITY_STACKS` × `STACKS.<word>` for each point of the stat named, as the kits' abilities have it. **"The passive's count"** is `STACKS.<word>` alone, as the kits' passives have it.
- Sizes worked out in the notes are for the class's own stat line with no gear.
- No card here uses one of the six counters. Stormspear's and Metronome's counts are their own, each shown as an icon with a number.

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
  - **A fallback follows it too.** A phrase that falls to a random foe when it finds nobody is a random pick then, and the Mark takes it: "the foe with the most Burn" with nothing burning, and the same for Chill, Sunder and Shock. So the first Firebolt of a fight lands on the Marked foe, and the pile forms there. That reaches Frost arrow, Rending arrow, Skyfall, Firebolt, Pyre, Burning fist and Frost lance, the versions with such a phrase, and Stormspear's blow.
  - **What doesn't:** a phrase of its own that finds its foe (the most Burn, with something burning; the highest Attack; the lowest current HP); every pick after an ability's first (Chain lightning's three others, Arc's second foe, Skewer's second thrust); anything aimed at every foe; a strike a card aims at a named foe.
  - **The Taunt rule stands over it.** While a foe Taunts, an ability without Seek goes to a Taunting foe, Marked or not. With Seek it goes to the Marked foe, and "a random foe that isn't Taunting" goes to a Marked foe even when that foe Taunts.
  - **The Fizzle rule gives way to it.** An ability that would skip the Marked foe because it already holds the Stun or the Silence lands on it anyway, for its damage alone.
  - **Several Marks:** the pick goes by draw among the Marked.
  - It sizes nothing. What a player sees is every loose arrow, bolt and bash in the party landing on one foe while the Mark lasts, and how long it lasts is the balance pass's (the spine's note on `STATUS.marked`).

### Malison
- **Is:** Hexer, Malison · kit change
- **Today:** Deepens every affliction each foe holds: one more stack of each of Burn, Chill, Shock and Sunder it already has, and a few Bleed.
- **Card:** Curses every foe: light damage that scales from Attack, a fifth more for each different affliction the foe holds (Burn, Chill, Shock, Bleed, Sunder), then a few Bleed; stacks scale from Attack.
- **Numbers:** The hit is `HIT.light` of Attack, on every foe. Each different affliction the foe holds as the hit lands adds a fifth of that, counted once whatever its stacks: five at most, which doubles the hit. A few Bleed is the ability's count from Attack, and lands after the hit. Short cooldown, normal wind-up and 450 MP, as today. The power step is two fifths more damage and two fifths more of every status the cast adds: on Malison, the Bleed.
- **Code:** 2
- **Serves:** no road or engine on its line. It's what every colour reads, and a hit on every foe for the red rain.
- **Notes:**
  - **The size.** A touch is the scale's word for an ability whose point is its status, and the change makes the hit the point, so it's a light hit. On a bare Hexer that prints about 950 on a foe that holds nothing and about 2,100 on a foe that holds all five, after a minion's Defense: the curse's own number, on a class whose damage nobody saw in play. Light against touch is under Least sure.
  - **What it counts.** The afflictions on the foe as the hit lands. Its own Bleed lands after, so the first curse of a fight counts none of it and the second finds it there, if the party's hits haven't closed it.
  - **It's a wide hit.** Bleed pays on every hit its holder takes, so each curse cashes every wound on the field and then opens its own.
  - **The power step** is the plain one on the new base, as round 2 rules: two fifths more damage and two fifths more of every status the cast adds. On Malison that's the Bleed; on Plague it's the Burn and the Shock too. Today's read "40% more of every status it adds", which would have left the hit alone.
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
- **Card:** Gives Clarity to every ally under half its max MP. Waits until one is. No Taunt.
- **Numbers:** Clarity at its own size and length (`STATUS.clarity`). Medium cooldown, quick wind-up, 200 MP.
- **Code:** as today's Rally the well
- **Serves:** Barrage 1 ●●● ⚙ mana as armour (half)
- **Notes:** *Stays.* Reworded: "max MP", in full. One Clarity is about a quarter of its holder's pool over its length, which for a mage is a whole cast, and this lays it on everyone who's short. What it's worth is Clarity's own size, which `builds.md` leaves to the balance pass. Clarity flows in over time, so by the spine's words it isn't MP "given": Glimmer robe doesn't read it, and mana as armour does.

### Horn of the keep
- **Is:** Knight · mythic (offhand) · kept
- **Today:** Every hit the Knight takes gives the other ally with the least MP a tenth of the hit's damage as MP. When the Knight's Taunt runs out while another ally is in a wind-up, it Taunts again.
- **Card:** Every hit the Knight takes gives the other ally with the least MP half the hit's damage as MP. When the Knight's Taunt runs out while another ally is in a wind-up, it Taunts again.
- **Numbers:** Half the damage the hit dealt to the Knight, after its Defense and Guard, as MP in one piece. The Taunt is at its own length, laid again each time one runs out during another ally's wind-up, with no limit.
- **Code:** as today's Horn of the keep, at half in place of a tenth
- **Serves:** Barrage 3 ●●●, Toll ●● ⚙ mana as armour (half)
- **Notes:** *Resized:* a tenth to a half.
  - **Why.** A Knight's Defense turns a wolf's bite into about 100 and a bandit's swing into about 290, so a tenth was 10 to 30 MP a hit, against pools of 1,000 to 3,800. That's the link sized below sight that play reported, and `builds.md` asks Barrage for a whole cast's mana, not a tenth. At half a pack gives its caster about a Fireball's worth over a regular fight, and one Crush from a boss refills most of a pool.
  - **The card keeps "other",** as today's: the Knight never feeds itself. The spine's line drops the word. "The ally with the least MP" is the new phrase round 1 adds to the vocabulary: the lowest share of max MP.
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
  - **What the copies set off.** A copy of a heal is the ability's heal landing on one more ally, so a piece that reads "each time one of its holder's abilities heals an ally" reads each ally it lands on. A copy of a Regen is a Regen, and a Regen isn't a heal: only a card that names Regen reads it. The copy itself is never copied, cast or passed on again.
  - **A cast made twice** by another piece has both its heals widened: as ruled, widening a heal isn't casting it again.
  - **On the brink.** A unit under Halved heart counts as below half while it sits at half, as that card now says. So every heal the Cleric casts reaches it, and the part past its cap is healing past full for the red stone's pieces.
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
- **Notes:** *Stays.* "At once" is a whole swing, so there's nothing to size on this side. On its own a bare Ranger crits about one swing in five, so the burst is one extra arrow now and then. How long the quiver's burst runs is the other half's number, and round 1 holds that number to four in five at most, so the burst always ends: see Links.

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
- **Card:** Basic attacks ignore Taunt, crit more often, and go to the foe with the lowest share of max HP.
- **Numbers:** Two crit steps on basic attacks (`KIT.hunterCrit`), three with the power step. No other size.
- **Code:** as today's Quarry
- **Serves:** Hunt 1 ●●●
- **Notes:** *Stays.* Reworded: the target phrase as round 1 adds it to the vocabulary. It changes whom the Ranger shoots, which is the kind of version play took. While a foe is Marked, its arrows follow the Mark first, as basic attacks do today, and Quarry aims them when none is.

### Huntmaster's quiver
- **Is:** Ranger · mythic (armor) · kept
- **Today:** All the Ranger's abilities aim past any guard at the foe with the lowest HP. When a foe one of them hit falls, the cooldowns left on its abilities are halved.
- **Card:** The Ranger's abilities that aim at one foe aim past any guard at the foe with the lowest current HP. When a foe one of its abilities hit falls, the Ranger's abilities are ready again.
- **Numbers:** The aim has Seek. Ready is no cooldown left on any of its abilities, whoever landed the kill; each still needs its MP.
- **Code:** as today's Huntmaster's quiver, with ready in place of halved. One thing more, under *Code support beyond the spine's list*: the new aim leaves alone an ability aimed at every foe.
- **Serves:** Hunt 3 ●●● ⚙ reaping (half)
- **Notes:** *Resized:* halved to ready.
  - **Why.** The Ranger's arrows are on the quick and short words. Halving what's left of them saved three to five ticks an arrow: the cooldown a few ticks closer that play never saw, on a mythic. The Hunt asks for a kill reward that's a whole action. Ready again is the same reward at that size: a kill, and three arrows at the next lowest foe.
  - **What it costs.** A round of all three arrows is 725 MP, so a full pool pays for about three rounds, and their wind-ups and recoveries make a round about ten ticks.
  - **It's the biggest resize in this share.** Round 1 lets it stand, as the Hunt's kill reward at a size that's seen, with mana as its brake, and puts it in the director's sample. The spine's line reads "ready again" now.
  - **Reworded:** "the lowest current HP", the vocabulary's phrase in full.
  - **With Marked.** The quiver gives every arrow a target phrase of its own that always finds a foe, so its abilities no longer follow a Mark; its basic attacks still do. Most of the spine's markers Mark the lowest foe, so the two usually agree. Base Condemn, which Marks the highest Attack, doesn't.
  - **With Barbed volley.** The volley stays an arrow at every foe, as ruled. Every foe it hit counts for the second sentence, so each fall in a pack brings the volley back. See Loops.
  - **The card, in round 3.** "Abilities that aim at one foe", since Barbed volley stays an arrow at every foe; and "the Ranger's abilities are ready again", since "its abilities" read as the fallen foe's.

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
- **Card:** Aegis on the ally with the highest Aggro that holds none.
- **Numbers:** Aegis as it stands (`STATUS.aegis`). "The highest Aggro" reads Aggro as it stands, gear and seat counted and a Taunt not, with a tie going to the earlier seat. Long cooldown (medium with the power step), quick wind-up, 500 MP.
- **Code:** as today's Watch the anchor
- **Serves:** Toll 2 ●●● ⚙ mirror (half)
- **Notes:** *Stays.* Reworded: "the highest Aggro", the phrase round 1 adds to the vocabulary, for today's "the most". BLOCKED on the wall is seen, and the version puts the Aegis where the blows go, not on whoever is lowest. Aegis blocks only a blow above its own line after the wall's Defense, so on a well-armoured anchor it catches a boss's great blows and little else. See Links, the mirror.

### Opening thrust
- **Is:** Hoplite, Phalanx A · version · kept
- **Today:** Basic attacks come half as often and deal double. The first of each fight comes at once and deals triple.
- **Card:** Basic attacks come half as often and deal double. The first of each fight comes at once and deals triple.
- **Numbers:** Phalanx as it stands. The first swing of a fight is ready at once and deals triple, its first doubling included. With the power step the double is × 2.4.
- **Code:** as today's Opening thrust
- **Serves:** Hunt 1 ●●●, Landslide ●●
- **Notes:** *Stays.* The fight's first number is its biggest swing, at the first tick: about 4,900 with a great weapon. It's a kit's own start-of-fight effect, so the opening's pieces (Overture coat, Second dawn) don't make it happen again.

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
- **Notes:** *Stays.* A boss's great blow printed on the boss is the mirror at its clearest. What's sent back is the blow after the wall's Defense and Guard, which is what an Aegis stops. So better stone sends less here, not more, and enough of it takes a blow under Aegis's line, where nothing is blocked. Round 1 keeps it as today's, and the mirror's link in the spine no longer says better stone sends more.

## Paladin

### Swift justice
- **Is:** Paladin, Condemn B · version · changed
- **Today:** Marks the foe with the lowest share of its HP, and every ally's next basic attack comes at once.
- **Card:** Marks the foe with the lowest share of max HP, and every ally's next basic attack comes at once. When a foe falls holding the Paladin's Mark, Condemn is ready again.
- **Numbers:** Marked at its own length (`STATUS.marked`). Medium cooldown (short with the power step), quick wind-up, 650 MP, as Condemn. Ready again still needs the 650 MP.
- **Code:** none new: today's Swift justice, and a reaction to a status the Paladin gave ending in its holder's knockout (The last wall hears an Aegis it gave; Pyre of the fallen hears a Burn end in a fall). It leans on 1, and on 23 for "at once".
- **Serves:** Hunt 2 ●●●, Landslide ●●, Bonfire ● ⚙ judge's drum (key)
- **Notes:**
  - **"The judged foe"** is written as a foe that falls with the Paladin's Mark still on it. The player can see that: the icon is on the foe as it drops. It means the kill has to come inside Marked's own length. Round 1 lets this reading stand.
  - **Whose Mark.** A status knows who applied it, not which ability did, so a Mark the Paladin lays from a piece or a seat counts as well as Condemn's. That's this version's rule alone: the Paladin's mythic answers Condemn and nothing else.
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
- **Card:** Whenever the Paladin's Condemn Marks a foe, a heavy blow falls on that foe at once: heavy damage that scales from Attack, adding several Burn; stacks scale from Attack. A Mark from its gear or its seat doesn't call it.
- **Numbers:** The blow is `HIT.heavy` of Attack. Several Burn is the ability's count from Attack, as Smite's. No cooldown and no MP of its own: one blow for each Condemn that lands its Mark, a Mark renewed on the same foe included.
- **Code:** none from the spine's list: a change to Condemn by name, in every form of it, as today's Chains of light changes Smite. See *Code support beyond the spine's list* for the blow as a hit of its own.
- **Serves:** Hunt 3 ●●●, Bonfire ●●, Landslide ●●
- **Notes:**
  - **The blow is a hit** of the Paladin's: it can be dodged and crit, it meets Defense, and a kill it lands is the Paladin's kill. It isn't a basic attack or a cast, so nothing that waits on a swing or a cast reads it. It falls on the foe just Marked, a named foe, so a Taunt doesn't turn it.
  - **It's bigger than it looks.** The Mark is a debuff and lands first, so Judgement is on: the blow is half again as hard. On a bare Paladin that's about 4,900 after a minion's Defense, with about ten Burn behind it, on every Condemn.
  - **Seen:** a Mark, and under it the fight's biggest number.
  - **Condemn alone,** as round 1 rules and the spine's line now says: with a marker that costs nothing the chain ran through a pack for free, and no number braked it without shrinking the blow. "Condemn" is the ability in whichever version the Paladin has trained: Challenge and Swift justice call the blow too.
  - **With Swift justice** each call is still a Condemn, paid for. See Loops.
  - It goes in the director's sample. Nothing of the old card is kept.

## Valkyrie

### Over the fallen
- **Is:** Valkyrie, Choosing B · version · kept
- **Today:** Waits until an ally is below 30% of its HP or down. Chooses one: a fallen one, raised; else the lowest, healed for double. The Valkyrie Taunts and is Guarded, standing over the one she chose.
- **Card:** Waits until an ally is below 30% of its max HP or down. Chooses one: a fallen one, raised; else the ally with the lowest share of max HP, healed for double. The Valkyrie Taunts and is Guarded, standing over the one she chose.
- **Numbers:** The heal is twice `KIT.choosing` of Attack. A raise brings a tenth of the ally's max HP (`REVIVE.tenth`). Taunt and Guard on herself at their own lengths. Medium cooldown, normal wind-up, 650 MP.
- **Code:** as today's Over the fallen
- **Serves:** Toll 2 ●●●, Pact ●● ⚙ riposte (half), brink (half)
- **Notes:** *Stays.* Reworded: "max HP", and "the ally with the lowest share of max HP" for "the lowest". The heal is about 2,200, and the Taunt turns the fight onto her. It's the draw that makes a dodging Valkyrie the riposte's dancer. Like Shared rites it wakes at 30%, under Halved heart's line.

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
- **Card:** A one-handed spear with a spear's swing. Every fourth hit the Valkyrie lands calls a blow from above on the foe with the most Shock, past any Taunt: damage that scales from Attack, rising with each Shock stack on that foe. The Shock stays. The blow's own hit isn't counted.
- **Numbers:**
  - **The swing:** a spear's (`KIND_SPEED.spear`, full, even), one hand, as today's. No stat steps.
  - **The count:** every hit she lands adds one: a swing, each hit of Gale spear, Skyfall, a strike with her weapon. At four the blow falls and the count starts again. It shows as an icon with a number.
  - **The blow:** `HIT.normal` of Attack, and `KIT.skyfallPerShock` more for each Shock stack on its foe: Skyfall's own step, on a smaller hit. It has Seek.
- **Code:** none from the spine's list: a count of its holder's hits, as today's Metronome keeps, and Skyfall's amount. See *Code support beyond the spine's list* for the blow as a hit of its own.
- **Serves:** Storm 3 ●●●, Hunt ● ⚙ held charge (key)
- **Notes:**
  - **Seen:** a count on the Valkyrie, and at four a number from above on the most charged foe. On a bare Valkyrie the blow is about 2,000 with 150 more a stack, so a charge of 13 doubles it and Shock's cap makes it four times the size. With her kit alone a blow falls about every ten ticks.
  - **The blow is a hit** of hers: it meets Evasion and Defense, can crit and builds her Shield. It isn't a basic attack or a cast. It isn't counted, so it can't call the next.
  - **Where it lands.** The blow has Seek, as round 2 rules: Gale spear has Seek and charges the back row past a Taunting front, and the blow that reads that charge shouldn't land on the guard. So it lands on the most charged foe, Taunting or not. A Mark doesn't steer it while any foe holds Shock, since it has a phrase of its own. With no Shock on any foe the phrase falls to a random foe, and that pick follows a Mark like any other.
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
- **Card:** Haste on every ally, and every ally's ability nearest to ready is ready at once. It never readies itself: for the Bard, another of its own.
- **Numbers:** Haste at its own size and length (`STATUS.haste`). "Nearest to ready" is the least wait left among abilities still cooling; ready is no cooldown left, and it still needs its MP and whatever it waits for. For the Bard, Rubato isn't counted among them. Long cooldown (medium with the power step), quick wind-up, 650 MP, as Allegro.
- **Code:** the cooldown effect already picks "its next ability" for every ally. For the caster it has to leave out the ability being cast: under *Code support beyond the spine's list*.
- **Serves:** Barrage 2 ●●●, Landslide ●
- **Notes:**
  - **Seen:** Rubato's name, then an ability from each ally right under it. Four ticks closer was the size play never saw; a whole cooldown is the one `builds.md` asks Barrage for. For a soloist with one spell, the nearest ability is the spell.
  - **It never readies itself,** as round 1 rules and the spine's line now says. Rubato has just gone on cooldown when its effect lands, so without the clause a Bard with nothing else cooling cast it again until its mana was gone. A Bard that knows only this song gets the Haste and nothing more for itself.
  - **Beside Reprise** (Encore A): Reprise readies one ally's longest wait, this readies everyone's shortest.

### Reprise
- **Is:** Bard, Encore A · version · kept
- **Today:** The other ally with the highest Attack has its ability with the longest cooldown left ready at once. No repeat.
- **Card:** The other ally with the highest Attack has its ability with the longest cooldown left ready at once. No repeat.
- **Numbers:** No size: a whole cooldown. Medium cooldown (short with the power step), quick wind-up, 650 MP.
- **Code:** as today's Reprise
- **Serves:** Barrage 2 ●●●, Landslide 2 ●●
- **Notes:** *Stays.* A whole cooldown is the size that's seen: the great spell's name twice in a few ticks. It names another ally, so it can't ready itself. The card says "the longest cooldown left", which by round 1's ruling is the ability with the most wait left, as today's build reads it. The spine's line carries the word now, as round 2 rules. Reveille means the slowest ability, so the two differ by more than their moment.

### Lament
- **Is:** Bard, War ballad A · version · kept
- **Today:** Might to every ally below half its HP, twice as many. Waits until an ally is below half.
- **Card:** Might to every ally below half its max HP, twice as many. Waits until an ally is below half.
- **Numbers:** Twice the ability's count of a few, from the Bard's Attack: 8 or 9 stacks a cast, up to Might's cap. Quick cooldown, quick wind-up, 450 MP.
- **Code:** as today's Lament
- **Serves:** Pact 2 ●●● ⚙ brink (half)
- **Notes:** *Stays.* Reworded: "max HP". A few Might is on the list of sizes play never saw, and this isn't that: twice as many, on a quick cooldown, on a unit that stays low, reaches Might's cap by the second or third ballad, and every blow from the brink lands most of the way to double. On a unit that dips under half and is healed straight back it's one cast, and little.

### Metronome
- **Is:** Bard · mythic (offhand) · kept
- **Today:** Counts every hit the party lands. At 20, War ballad, Allegro and Encore are ready at once, and the count starts again.
- **Card:** Counts every hit the party lands. At 20, War ballad, Allegro and Encore are ready at once, and the count starts again.
- **Numbers:** Twenty hits: every hit any ally lands, of any kind: a swing, an extra strike, an extra hit a card names (a jump, a ring, a volley), each hit of a multi-hit ability. Damage sent back and a status's own damage aren't hits. All three songs ready is 1,750 MP if the Bard casts them all.
- **Code:** as today's Metronome (7 and 15 name it)
- **Serves:** Cuts 3 ●●●, Barrage ●●, Storm ● ⚙ spell on the swing (key)
- **Notes:** *Stays.* It was never offered in play. A count on the Bard that climbs with the party's blur and rings three songs at the top is seen, and a fast party fills it every fifteen ticks or so. With the changed songs it readies Rousing chorus and Rubato, and Rubato readies the abilities whose hits fill it. Mana stops that: see Loops.

## Hexer

### Plague
- **Is:** Hexer, Malison A · version · changed
- **Today:** Deepens every affliction each foe holds, and adds a few Burn, a few Shock and a few Bleed of its own to every foe; stacks scale from Attack.
- **Card:** Curses every foe for three fifths of Malison's damage, scaling from Attack, a fifth more for each different affliction the foe holds (Burn, Chill, Shock, Bleed, Sunder), then a few Burn, a few Shock and a few Bleed; stacks scale from Attack.
- **Numbers:** The hit is `HIT.touch` of Attack, about three fifths of Malison's, with Malison's fifth for each different affliction. A few of each of Burn, Shock and Bleed is the ability's count from Attack: five or six of each on a bare Hexer, landing after the hit. Short cooldown, normal wind-up, 650 MP: a rung over Malison, as today's Plague is. The power step is Malison's: two fifths more damage and two fifths more of every status the cast adds, so of its Burn, its Shock and its Bleed.
- **Code:** 2
- **Serves:** Bonfire ●●, Storm ●●, Cuts ●● ⚙ every colour (key), red rain (half)
- **Notes:**
  - **Seen** the first time: three icons on every foe from one cast.
  - **"The next curse landing bigger"** depends on what's left a cooldown later, and a status keeps its own drain. Five or six Burn laid once are down to about one by the time Malison comes round again. Shock is gone after three of its holder's actions. Bleed lasts until the party's hits close it. So a lone Hexer's second Plague finds one or two of its three, more with Cooldown on its wand. The link expects a stack or two of each, and that's about what there is. Under Least sure.
  - **What holds them up** is the other half: a rider on a swing, Festering idol, a second caster. The Hexer's own Chill and Enfeeble's Sunder drain slowly and stay.
  - **Twice-told tome** makes the second cast land on the first one's three.
  - **The power step** grows the damage and all three statuses, as round 2 rules: with it a bare Hexer lays seven or eight of each.
  - **The card, in round 3:** "three fifths of Malison's damage" for "touch damage", which is the scale's word and on no card a player has read.

### Focused curse
- **Is:** Hexer, Malison B · version · changed
- **Today:** Deepens the afflictions of the foe with the highest Attack alone, three times over, and adds it a few Bleed, three times as many; stacks scale from Attack.
- **Card:** Curses the foe with the highest Attack alone: three times Malison's damage, scaling from Attack, a fifth more for each different affliction it holds (Burn, Chill, Shock, Bleed, Sunder), then three times the Bleed; stacks scale from Attack.
- **Numbers:** The hit is three times `HIT.light` of Attack, with Malison's fifth for each different affliction: about 3,500 before Defense on a bare Hexer, and twice that on a foe that holds all five. The Bleed is three times the ability's count of a few. Short cooldown, normal wind-up, 450 MP, as Malison. The power step is Malison's: two fifths more damage and Bleed.
- **Code:** 2
- **Serves:** Hunt ●● ⚙ every colour (half)
- **Notes:** It has a target phrase of its own that always finds a foe, so a Mark doesn't steer it, and without Seek a Taunting foe catches it first, as today. Enfeeble aims at the same foe, so the Hexer's own kit puts Sunder, Bleed and Chill under it: three of the five without help. At five it's the biggest single number a Hexer prints, on a short cooldown.

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
- **Serves:** Pact ●●, Toll ●● ⚙ riposte (half)
- **Notes:** *Resized:* a tenth to a fifth.
  - **Why.** A tenth of a fist's blow is about 45 HP, against blows of 500 and more on a unit with no Defense. It was a common's step of Lifesteal with a condition on it, and a trigger that small is on play's list of things never seen. The riposte asks it for cover the player can watch build. At a fifth a Taunting dancer drinks back about a third of what gets through.
  - **It isn't Lifesteal** as built: it's a heal the passive gives. The red stone's seat reads Lifesteal past full, and nothing a Monk can wear or sit in reads this heal as a Shield, so the red stone's tag is off its line, as round 2 rules.

### Frost fist
- **Is:** Monk, Burning fist A · version · kept
- **Today:** Three quick hits on the foe with the most Chill; each deals physical damage that scales from Attack and adds a little Chill; stacks scale from Attack.
- **Card:** Three quick hits on the foe with the most Chill; each deals damage that scales from Attack and adds a few Chill; stacks scale from Attack.
- **Numbers:** Each hit is 0.11 of Attack. A few Chill is the few its base adds: the ability's count of a few at Burning fist's own multiplier (`FIST_BURN`, three fifths of the word), in place of today's three tenths. About 3 a hit and 10 a cast on a bare Monk, against a cap of 12. Quick cooldown, quick wind-up, 200 MP.
- **Code:** as today's Frost fist, at Burning fist's multiplier
- **Serves:** Snap 1 ●●●
- **Notes:** *Resized:* three tenths of the word to three fifths, and reworded, as ruled for every share: "physical" goes, since there's one kind of hit, and "a little" becomes "a few".
  - **Why.** Round 2 rules that its "a few" is the scale's few and not today's smaller size: it's Cold Snap's first step from a kit, and it has to be seen. Read as the few its own base ability adds, a cast takes the coldest foe most of the way to a shatter, and the second cast, or any other cold, bursts it.
  - **Not the plain word.** At the whole of the ability's few, three hits are about 17 Chill: a shatter with every cast, on a quick cooldown, which is the lock round 2 took off Rimed blade. With the power step this size passes the cap in one cast too (*Least sure*).
  - With no foe chilled its pick falls to a random foe, and follows a Mark.

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
- **Card:** Has Seek. Deals damage that scales from Crit chance to the foe with the lowest current HP. When it knocks that foe out, Backstab is ready again.
- **Numbers:** `HIT.normal` of Crit chance (through `PER_PERCENT.crit_chance`): about 2,000 on a bare Assassin, and twice that on a crit. Medium cooldown, normal wind-up, 325 MP. Ready again has no limit but its MP.
- **Code:** as today's Coup de grâce, narrowed to Backstab's own kill: under *Code support beyond the spine's list*
- **Serves:** Hunt 2 ●●● ⚙ reaping (key)
- **Notes:** *Stays.* Reworded: "physical" goes. It carried a run: up to 83% of an Assassin's damage. A full pool pays for four stabs, so the reaping's cliff is four foes long before mana ends it. Today's build readies Backstab on a kill by any of the Assassin's abilities, Garrote's too. Round 1 rules the card is the design: only Backstab's own kill readies it, and the build follows.

### Smoke screen
- **Is:** Assassin, Vanish A · version · kept
- **Today:** Hides the ally with the lowest share of HP that isn't Taunting. Waits until an ally is below 80% of its HP.
- **Card:** Hides the ally with the lowest share of max HP that isn't Taunting or already Hidden. Waits until an ally is below 80% of its max HP.
- **Numbers:** Hidden at its own length (`STATUS.hidden`). Short cooldown (a quarter off with the power step), quick wind-up, 200 MP.
- **Code:** as today's Smoke screen
- **Serves:** Pact ●●, Toll ●● ⚙ two in the dark (key), brink (half)
- **Notes:** *Stays.* Reworded: "max HP" in full, and the card gains what the build already does, as ruled: it passes over an ally already Hidden. A name fading and the foes turning elsewhere is seen. One cast covers under half of its own cooldown, so on its own it's one unit in the dark about half the time. Two in the dark needs a second hiding that's laid again; Night's edge is one, on the same Assassin. By Hidden's new rule someone stays in the light: it doesn't land on the last ally the foes could pick.

### Night's edge
- **Is:** Assassin · mythic (armor) · kept
- **Today:** When the Assassin lands a killing blow, it's Hidden for a moment, and its next hit deals double damage.
- **Card:** When the Assassin lands a killing blow, it's Hidden, and its next hit deals double damage.
- **Numbers:** Hidden at its own length, if it isn't Hidden already. The next hit it lands deals double, once.
- **Code:** as today's Night's edge
- **Serves:** Hunt 3 ●●● ⚙ two in the dark (half)
- **Notes:** *Stays.* Reworded: "for a moment" goes, since Hidden is laid at its own length and no status is laid for less. It was part of the one full set play saw work. Hidden doesn't land on it when it's the last ally the foes could pick; the doubled hit still does. With Coup de grâce the doubled hit is the next stab, so a kill makes the next kill likelier, and the foes running out is what ends it.

## Vampire

### Blood for mana
- **Is:** Vampire, Blood gift A · version · kept
- **Today:** Spends a fifth of its max HP to give the other ally with the least MP as much MP, and gives it Clarity. Waits until another ally is under half its MP and the Vampire is at 35% of its max HP or more.
- **Card:** Spends a fifth of its max HP to give the other ally with the least MP as much MP, and gives it Clarity. Waits until another ally is under half its max MP and the Vampire is at 35% of its max HP or more.
- **Numbers:** The price is a fifth of its max HP, paid, not damage. The gift is as much MP in one piece (two fifths more with the power step), and Clarity at its own size. Medium cooldown, normal wind-up, 450 MP.
- **Code:** as today's Blood for mana
- **Serves:** Barrage 2 ●●●, Pact ●● ⚙ mana as armour (half)
- **Notes:** *Stays.* Reworded: "max MP". About 800 MP at once and a Clarity behind it is more than a mage's cast: the link at the size `builds.md` asks for. It pays HP, so pieces that read a price read it, and its lump is MP given, so Glimmer robe reads that. Under The chalice the Vampire's own abilities still cost it MP.

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
- **Card:** Whenever another ally would pay MP for an ability, the Vampire pays HP instead: half the share of its max HP that the cost is of that ally's max MP. It doesn't pay when that would leave it at a tenth of its max HP or less; the ally pays its own MP then.
- **Numbers:** The price is half of the ability's MP cost, divided by its caster's max MP, times the Vampire's max HP: a Monk's Flow costs the Vampire about 535 HP and a Pyromancer's Firebolt about 235. It's paid as the cast resolves, where the MP would have been, and it's a price, not damage. The floor is a tenth of the Vampire's max HP: it pays the whole price or none. A cast that costs no MP costs no HP.
- **Code:** 20. Two things more, under *Code support beyond the spine's list*.
- **Serves:** Pact 3 ●●●, Barrage ●●● ⚙ blood mage (half), brink (key)
- **Notes:**
  - **Seen:** the Vampire's red bar steps down with every ability the other two cast, and their blue bars never move.
  - **What it does to the Vampire.** Two allies' casting is most of its health bar each fight, so it rides between a tenth and wherever its drinking takes it: the unit that's always lowest, which is the brink, and below half, where Bloodlust doubles its drink.
  - **"Half the share"** is the director's ruling at gate 2, for this card, Flagellant's vestments, The covenant and Heart of the saint. It's still a share of the caster's own pool, so a cheap skill from a small pool costs as much blood as a great spell from a deep one. See Least sure.
  - **The Vampire is the payer,** as ruled: "pays HP" covers a price taken from it for an ally's ability. So a piece that answers an ally paying HP answers each of these, with the Vampire as the one who paid, and the cast counts as paid for.
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
- **Notes:** *Stays.* One stack sounds small and isn't: a Burn stack deals about 370 over its life, and this adds one for every hit of three units, whatever kind of hit it is. Play's deepest run ended wearing it. For the lead's colour it's a rider on every ally already, and round 1 rules that a carrier doesn't add a rider its own swing already holds from the same source, so a Follower under the Crown adds one Burn a hit, not two.

## Frostweaver

### Splinters
- **Is:** Frostweaver, Shatterpoint B · version · changed
- **Today:** When a foe's Chill shatters, that foe takes several Sunder, and every other foe takes a third of the shatter's damage; stacks scale from Attack.
- **Card:** When a foe's Chill shatters, that foe takes several Sunder (stacks scale from Attack), and every other foe gains a third of the Chill it held.
- **Numbers:** Several Sunder is the passive's count from Attack, as Shatterpoint's, with its power step. The cold sent on is a third of what the foe held as it shattered: 4 stacks at Chill's cap (`STATUS.chill.cap`). It's read from the foe, not from anyone's Attack.
- **Code:** 9, 23
- **Serves:** Snap 2 ●●● ⚙ firecracker (key)
- **Notes:**
  - **Seen:** one foe bursts and every other counter steps up by four.
  - **The link's size.** Four takes a neighbour at eight or more to its cap, so it bursts too and sends four on; a neighbour at three goes to seven and waits. It's the cold field that makes the string, and the Frostweaver that makes the field.
  - **The chain's damping** is Chill's own rule and on no card, as ruled. This card says nothing of it. Round 1 sets it in fractions of a stack: a foe that has already burst in the chain takes half of what's passed to it, then a quarter, and so on, never none.
  - **The third of the shatter's damage** on the other foes is gone: the cold replaces it.
  - **With Glacier's heart, and with Winter's chain,** the string runs further, and now always dies down. See Loops.

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
  - **Beside Hoarfrost plate and Frostward blade** it's the gate's widest home: every ally, for a while, at a cast's price, with no anchor needed. The plate reads its wall's Defense at a few, and the blade its mage's Attack at several since round 2. See Links.

### Rime shield
- **Is:** Frostweaver, Shatterpoint A · version · kept
- **Today:** When a foe's Chill shatters, the ally with the lowest share of HP gains a Shield from the Frostweaver's max HP, in place of the Sunder.
- **Card:** When a foe's Chill shatters, the ally with the lowest share of max HP gains a Shield from the Frostweaver's max HP, in place of the Sunder.
- **Numbers:** A Shield of three tenths of the Frostweaver's max HP, two fifths bigger with the power step, up to the Shield's own cap on whoever gets it.
- **Code:** as today's Rime shield
- **Serves:** Snap 2 ●●, Toll ●● ⚙ frozen gate (half), detonation (half), brink (half)
- **Notes:** *Stays.* Reworded: the target phrase in full. About 900 of grey bar on a unit of 2,000 to 5,000 HP is seen. It pays once a shatter, so it's worth what the party's shatters are worth: little where the second shatter never comes, a great deal on a frozen gate.

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
- **Notes:** *Stays.* It was never offered in play. It's the second shatter play never saw, in half the time of the first, on a boss as on a wolf. Six can't reach the cap by itself, so alone it never loops. Beside Splinters the string runs longest, and with the damping in fractions it ends: see Loops.

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
- **Numbers:** The swing is its own, as today's: one hand, 6.6 ticks, a full, even swing. No stat steps. Every hit jumps: a swing, Arc's second hit, Double strike's second strike, each hit of an ability. A jump is half the hit's damage on one other random foe, and it's an extra hit of its own name: nothing that reads extra strikes reads it. Half a fallen foe's Shock, in whole stacks, goes to every other foe.
- **Code:** as today's Eye of the tempest, with every hit jumping and the jump marked so it doesn't jump (23): under *Code support beyond the spine's list*
- **Serves:** Storm 3 ●●●
- **Notes:** *Stays,* with one sentence added: the brief asks a card that lands a blow again to say whether the second can repeat. It was never offered in play. Today's build leaves Arc's second hit and Double strike's second strike out of the jumping, so that a jump couldn't hear itself. Round 1 rules the card is the design: every hit jumps, and the build follows. That's more lightning than today's, on every swing. A jump's foe is a second pick, so a Mark doesn't steer it.

## Geomancer

### Rampart
- **Is:** Geomancer, Earthen shell B · version · kept
- **Today:** Applies Shield and Guard to itself. While that Guard lasts, the first time its Shield breaks it's rebuilt at once. No Shield for an ally.
- **Card:** Applies Shield and Guard to itself. While that Guard lasts, the first time its Shield breaks it's rebuilt at once. No Shield for an ally.
- **Numbers:** The Shield is Earthen shell's: its Defense, up to the Shield's cap. Guard at its own size and length. The rebuild is the most that Shield held, once a cast. Medium cooldown (short with the power step), normal wind-up, 650 MP.
- **Code:** as today's Rampart, with the rebuild reading the most the pool held (today's reads the shell's amount from Defense again)
- **Serves:** Landslide 2 ●●● ⚙ detonation (key)
- **Notes:** *Stays.* The grey bar goes and comes back whole: seen. The size of the rebuild is as ruled for every share: "the most that Shield held" is the pool's highest point since the unit last had none, and Rampart reads it. Today's build reads the shell's own amount again; a Geomancer's Defense is far over its Shield's cap, so on the card and on the bar the two are the same. It's once a cast, so with a break piece it's two detonations a shell and no more.

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

Round 1 ruled on everything this section held, and each ruling is applied in the entries above. What's left is what the rulings didn't reach, and what they opened.

**Opened by the rulings:**
- *Ruled in round 2: the step grows every status the cast adds, and it's applied.* **Plague's power step.** As ruled in round 1, Malison's step is two fifths more damage and Bleed. On Plague that leaves its Burn and its Shock alone, where today's step ("40% more of every status it adds") grew them. Written as ruled. If the step is meant to stay plain on each version, Plague's would read "two fifths more damage, and of every status it adds".
- *Ruled in round 2: as written. The blow also has Seek now.* **Stormspear's blow when no foe holds Shock.** Two rulings meet. Its phrase is a pick of its own, which a Mark doesn't steer; and a phrase's fallback to a random foe follows the Mark. Written as both: a Mark steers the blow only when no foe holds any Shock.
- *Ruled in round 2: as written.* **Writ of judgement and Condemn's versions.** Written as: Challenge and Swift justice are Condemn, and each calls the blow. Under Challenge that's a Mark, a heavy blow and a Taunt from one cast.
- *Ruled in round 2: today's words stay, and the spine's line carries "left" now.* **Reprise and "the longest cooldown".** The spine's line for it read "its ability with the longest cooldown ready at once", which by the ruling means its slowest ability. Today's card says "the longest cooldown left", the most wait left. Kept as today's. Round 1 notes that Reveille reads as Reprise does; by the same ruling Reveille means the slowest, so the two now differ in which ability as well as when.

**Not ruled in round 1:**
- *Ruled in round 2: the tag is off.* **Drinking palm's red stone tag.** On a Monk nothing reads its heal as a Shield. Red stone mail is Mail. Phylactery reads what its holder heals on others. Blood oath's Drinker seat reads Lifesteal, and this heal is a heal the passive gives, not Lifesteal. Round 1 took the same tag off Gleaner's leathers for the same reason. Either the tag comes off the spine's line, or the version's drink is written as Lifesteal on those hits, which would be a change to a kept version.
- *Done in round 2: the spine's line reads "ready again".* **Huntmaster's quiver in the spine.**
- **"Crit more often"** on Quick draw and Quarry is the base passive's wording, with no number: it's two crit steps. Round 1 has "far more often" say its number on a piece. Left as today's, since it's the kit's own sentence on both versions.

**Names.** None clashes. Two notes, neither ruled:
- **Halo of the saint and Heart of the saint** can sit on one Cleric, with Saint's mace in its hand. The Halo's name is today's; the others are another share's.
- **Three pyres** now sit in one fire party: High pyre, Pyre of judgement and Pyre line.

**`fill/shared.md`:** nothing in it fails a card here. No item in this share uses a counter.

## Links

For each engine this share touches: the size of my side, and what the other side needs for the two to meet.

- **The shield detonation.**
  - *My side:* Rampart rebuilds the most its Shield held, once a cast, which is a Geomancer's whole cap. Rime shield lays about 900 a shatter on the ally with the lowest share of max HP. Faultline turns a break into a triple crit. Mountain's crown refills the bar on every crit.
  - *The other side:* the break pieces read the most the pool held, whatever filled it, as ruled for all of them. Mountain's crown keeps the stone from breaking at all, so a Geomancer wearing it feeds the detonation least.
- **The frozen gate.**
  - *My side:* Frost armor lays about 3 Chill for each hit a foe lands on any ally, for Guard's length, so a foe bursts on its third or fourth blow. Rime shield answers each burst with about 900 of Shield.
  - *The other side:* as ruled, Hoarfrost plate reads its wall's Defense at a few, and Frostward blade its mage's Attack at several since round 2: three or four a blow from a Knight's plate, four or five from the blade, so the third or fourth blow. Frost armor reads its caster's Attack at half again the few, since a spell that ends with its Guard has less time than a piece that's worn. The three homes are within a blow of each other.
- **The mirror.**
  - *My side:* The last wall sends back all an Aegis stopped and readies Aspis, at 500 MP. Watch the anchor keeps the Aegis on whoever draws.
  - *The other side:* a draw that holds through a wind-up, and blows big enough to clear Aegis's line after the wall's own Defense. On the best walls only a boss's great blows do. Hoplon now reads the same printed numbers, and the link no longer says better stone sends more.
- **The goad.**
  - *My side:* the toll a called blow pays. Static field: about 4 Shock, some 340 at the foe's next move. Hold the line: 150 of Thorns. Overgrowth: 600, with Briar's Bleed.
  - *The other side:* the call has to cost the pack more than the blow costs the anchor. A bandit's swing takes about 290 from a Knight. So the goad pays on Overgrowth and under Static field, and on Hold the line alone only against light hitters.
- **The held charge.**
  - *My side:* Thunderclap is doubled by a charge of about 23 on a foe and nearly tripled at the cap. Stormspear's blow is doubled at 13 and four times the size at the cap. Aftershock holds the whole field for a Stun's length.
  - *The other side:* charge enough to matter, on a foe the blow can reach. A party's riders hold a field at 5 to 15 stacks while it acts, so the readers pay mostly on a held foe or a slow boss, which is the engine. With Stormspear in hand the Valkyrie has no rider of her own, so the charge is Gale spear's and the party's. Her blow has Seek since round 2, so it reaches the most charged foe behind a Taunting front.
- **The reaping.**
  - *My side:* Coup de grâce lands for about 2,000 and is ready again at Backstab's own kill, at 325 MP: four from a full pool. Huntmaster's quiver, resized, readies all three arrows at each fall, at 725 MP a round.
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
  - *My side:* the draw on a dodger: Stillness of mind (a Taunt with seven blows in ten missed) and Over the fallen (a Taunt and a Guard when an ally is under 30% or down). And cover by hitting: Drinking palm, resized to a fifth of each hit.
  - *The other side:* the answering strike has to be a real swing. On a Valkyrie it banks Shield through her passive. On a Monk, Drinking palm only heals: it banks nothing above full. For the Monk, "banks cover" needs the cloak that Shields on a dodge.
- **Every colour.**
  - *My side:* Malison pays a fifth for each of the five, double at all five. Plague lays three of them, five or six stacks each, which last about one Malison cooldown. Focused curse triples it on one foe. The witch-blade carries the Hexer's own colour to every cursed foe.
  - *The other side:* afflictions that are still there when the curse comes round: a rider on a swing, Festering idol topping each up, the wand that scatters them. Chill and Sunder hold longest; a single lot of Burn or Shock is gone in about a cooldown.
- **The lead's colour.**
  - *My side:* a colour on a swing from the kit: Hex of flames (about 3 Burn a swing), Kindling (3 or 4), and Crown of embers (one Burn for every hit of every ally).
  - *The other side:* The standard and Mimic wand carry what the Lead's swing carries. Under Crown of embers every swing already carries the Crown's Burn, and as ruled it isn't added twice: it's one aura, not two riders.
- **The emptied quiver.**
  - *My side:* Quick draw: each crit is the next swing at once, with a quarter-tick of recovery between. Barbed volley makes every foe a bleeding one.
  - *The other side:* the crit chance its makers give. As ruled, "nearly always" is four times in five, nothing raises it, and a card that lifts Crit chance by a lot stops at four in five. That's five arrows on average where the link asks for three or four, and it always ends. What isn't held is plain Crit chance from stats, which the lead has flagged for the director: Quick draw's own two crit steps add to it.
- **The blood mage.**
  - *My side:* The chalice moves an ally's price onto the Vampire, at half the share. The Vampire is the payer.
  - *The other side:* the link reads the price back through the caster's Lifesteal, and here the caster isn't the one who paid. What repays the Vampire is its own drinking. Bloodstone reliquary reads each payment as a heal for the lowest ally other than the Vampire. The chalice is the blood mage with two bodies; the pieces written for one body don't close it.
- **The resonance.**
  - *My side:* Recharge gives back 120 MP a foe, 480 of the chain's 650 on four.
  - *The other side:* the link says mana stops it. With Recharge, a chain on four foes costs 170, so a full pool is thirteen casts, and at two or three times the pace that's the whole fight. Beside this version the thinning pack is the only brake.
- **The crescendo.**
  - *My side:* the free casts: three for each Overcharge, one for each Deep calm. Each skips the price and still adds a stack when the cast finishes.
  - *The other side:* a price that climbs fast enough for the skips to matter.
- **Mana as armour.**
  - *My side:* Horn of the keep, resized, gives half of every blow on the Knight. Blood for mana gives about 800 at once and a Clarity. Rally the well and Deep calm give Clarity, about a quarter of a pool over its length.
  - *The other side:* a piece that takes damage from MP. By the spine's words the Horn's and Blood for mana's are MP given and Clarity's isn't, which matters to Glimmer robe and not to the orb.
- **The firecracker string.**
  - *My side:* Splinters sends 4 to every other foe. Glacier's heart puts 6 back on the foe that burst. Hail, resized, lays about 3 on every foe a cast.
  - *The other side:* a field already at eight or more, which Hail and the Frostweaver's own casts reach by the middle of a regular fight. The other homes send 6 to the coldest other foe, or a few to all; any two of them together run long, and with the damping in fractions they end. See Loops.
- **The brink.**
  - *My side, the unit held low:* The chalice keeps the Vampire between a tenth and wherever it drinks to.
  - *My side, the answers:* Halo of the saint (every heal and Regen, on everyone below half), Lament (below half), Rime shield and Smoke screen (the ally with the lowest share of max HP, whatever that share is), Shared rites and Over the fallen (below 30%).
  - *The other side:* how low the unit is held. Halved heart's unit counts as below half at half, so it wakes Halo of the saint and Lament from the first tick, and never the two at 30%. A price or a drain goes lower. The engine is fullest with a payer, not a cap.
- **Two in the dark.**
  - *My side:* Smoke screen hides the ally with the lowest share of max HP that isn't Taunting or already Hidden, for Hidden's length, under half of its own cooldown. Night's edge hides the Assassin at each kill.
  - *The other side:* a second hiding that's laid again and again, and a third unit that wants every blow. With Smoke screen the Assassin no longer hides itself; its mythic gives that back. Hidden's new rule keeps someone in the light, so the pair can never hide the third.
- **The red stone.** No part in this share now: Drinking palm's tag is off, as round 2 rules, since nothing a Monk can wear or sit in turns its healing into a Shield.

## Loops

Each with what's in it and what stops it.

- **Closed by round 1:**
  - **Rubato alone** never readies itself: it's on the card.
  - **Writ of judgement with a marker that costs nothing** no longer chains: the blow answers Condemn alone.
  - **Splinters with Glacier's heart.** With the damping in fractions of a stack, a foe that has burst takes 2, then 1, then half a stack from each pass, and needs six more than the heart puts back. That's three other foes bursting, then six, then twelve, which no pack holds. So the string runs two rounds in a pack of four to six and three in a pack of seven or eight, and dies down. Winter's chain in the same hand adds about one round. Each burst still deals about 3,000, so most packs end before the string does.
- **Swift justice with Writ of judgement:** each Condemn is a Mark, a heavy blow and a volley, and a foe that falls under the Mark readies the next. *Brakes:* 650 MP a link, so five links; Condemn's wind-up and recovery; a foe that survives the blow and the volley together.
- **Swift justice with a marker on the Paladin** (Hunter's mark, a Marker seat): the Mark it keeps on the field is the Paladin's, so any fall under it readies Condemn. More calls, each one still a paid Condemn. *Brake:* mana.
- **Huntmaster's quiver, resized, with Barbed volley:** a foe falls, by anyone's hand, and the volley is ready and wounds the whole field again. *Brakes:* 325 MP a volley, its wind-up and recovery, and the foes running out.
- **Quick draw:** the engine's own loop. *Brake:* the crit that fails, and a quarter-tick between arrows. As ruled, no card makes a crit certain for longer than one swing, so it always ends. A Ranger whose plain Crit chance is stacked high from stats is the case left, and it's with the director.
- **Coup de grâce with Night's edge, or with Bounty charm:** the spine's kill chain. *Brakes:* 325 MP a stab, and the foes running out. Only Backstab's own kill readies it now, which takes Garrote's kills out of the chain.
- **Recharge under Overcharge:** a free chain still gives its mana back, so three casts make up to 1,440 MP where they'd have cost 1,950. It's a mana engine on one unit, not a loop. *Brake:* three casts a Static charge. With a resonance piece as well, mana no longer stops the chain at all while four foes stand; the pack thinning does.
- **The last wall with mana that isn't the Hoplite's** (The chalice): every blow over Aegis's line is blocked, sent back, and the next Aegis is up within three ticks. *Brakes:* the Vampire's health, and the blows under the line, which pass.
- **The chalice with anything whose brake was mana** (The cathedral's Soloist, a resonance, the Paladin's drum, the Bard's songs under Metronome). *Brake:* the Vampire's floor at a tenth, after which each caster pays its own mana again. It moves the brake; it doesn't remove it. Beside Bloodstone reliquary each price is also a heal on the lowest ally other than the Vampire, which is strong and doesn't loop.
- **Metronome with Rubato:** hits ready the songs, Rubato readies abilities, their hits fill the count. Metronome readying Rubato isn't Rubato readying itself. *Brake:* the Bard's mana: a full round of songs is 1,750.
- **Horn of the keep:** a Taunt laid again each time one runs out during an ally's wind-up, without limit. Beside a caster with long wind-ups that's a Taunt all fight, which is its purpose. What reads a Taunt held in the Knight's kinds (Oathkeeper's sweep) only lasts longer for it; nothing the Knight can hold beside it is set off by a Taunt being laid.
- **Eye of the tempest, with every hit jumping:** more jumps than today's build, and on a wide hit one for each foe it lands on. A jump doesn't jump, so it's wide and never a loop.
- **Closed on the card:** Halo of the saint's copies aren't copied; Stormspear's blow isn't counted; a jump of Eye of the tempest's doesn't jump; Rubato doesn't ready itself.
- **None found:** the other versions and mythics. Each reads a state and leaves it, or fires on its own cast.

## Code support beyond the spine's list

- **Halo of the saint:** a heal or a Regen that an ability gives, given again whole to every other ally that passes a test, with the copies marked so nothing copies them (23). The list has a cast made twice (16) and nothing that widens one.
- **The chalice,** beyond 20's price paid by one unit for another: an ally's ability counts as affordable when the Vampire can pay for it, so a caster at no mana still casts.
- **A blow dealt by a reaction as a hit of its own,** sized from Attack and not from the weapon: Writ of judgement's and Stormspear's. Today's reactions strike with the weapon or deal untyped damage.
  - Writ of judgement's is called by Condemn, by name, in every form of it. A status doesn't know which ability laid it, so the build can't hear "a Mark Condemn gave"; it changes Condemn, as today's Chains of light changes Smite.
  - Stormspear's picks by a phrase, with Seek, with the phrase's fallback following a Mark.
- **A rider on every hit** its holder lands, sized by a status on the target: Ember palms. Today's riders sit on basic attacks, and per-stack terms sit on abilities.
- **A wait on a foe's stacks at a number:** High pyre's 20 Burn. Today's waits read whether a status is held, or the caster's own count.
- **Marked (1),** as ruled: a phrase's fallback to a random foe follows the Mark; the Fizzle rule and Seek's "isn't Taunting" give way to it.
- **Huntmaster's quiver:** its new aim has to leave alone an ability aimed at every foe.
- **Rubato:** the cooldown effect's "next ability" pick has to leave out, for the caster, the ability being cast.
- **Coup de grâce:** a kill has to say which ability landed it. Today's kill event names the killer and the hit's kind, which is why any ability's kill readies Backstab.
- **Eye of the tempest:** every hit jumps, extra hits included, with the jump itself marked (23) so it isn't heard as a hit to jump from. Today's build avoids that by not listening to extra hits at all.
- **Nothing new** for Swift justice, Rousing chorus, Barbed volley, Frost armor, Plague, Focused curse, Rampart or the resizes: each is today's shape with other numbers, or a primitive that exists.

## Least sure

- **Huntmaster's quiver at "ready again".** It stands, and it's in the director's sample. The right kind of size, and possibly too much of it.
- **Malison as a light hit.** It's the Hexer's own number at last, on a short cooldown, on every foe, for 450 MP: more per cast than Fireball's hit. A touch would keep it near today's worth and may not be seen. I chose seen.
- **High pyre's two numbers,** 20 to open and 500 a stack. The count decides whether a lone Pyromancer ever casts it; the long wind-up decides what it lands on. If it lands on twelve most of the time, it reads as a slower Pyre.
- **Plague's stacks.** At a few, its Burn and Shock barely outlast one cooldown, so "the next curse landing bigger" is half true on a lone Hexer. The line's word is a few, so it's a few. Its power step grows them again, by round 2.
- **The chalice's share.** A Monk's Flow costs the Vampire more blood than a Pyromancer's Firebolt (about 535 against 235), because each is a share of its own caster's pool. It's half the share since gate 2, as on Flagellant's vestments and The covenant; a player may still find it backwards. MP for HP at a set rate is the other way to say it.
- **Stormspear's blow's size,** a normal hit on Skyfall's step, about every ten ticks. It may out-earn Skyfall itself, which is what a mythic does, or bury it.
- **Eye of the tempest at "every hit".** With Arc's second hit and Double strike's second strike jumping, it's a good deal more than the build that was never offered. The card was always this; nobody has seen it.
- **Writ of judgement, answering Condemn alone.** One blow a Condemn is the size of a second Smite on a medium cooldown. It may now be small for a mythic unless Swift justice is beside it.
- **Hail at about 3 a foe.** It's seen, and it makes the Ranger a better field of cold than the Frostweaver's own two field spells, for a fraction of the mana. The Frostweaver's counts are the balance pass's first job; this may want to follow them.
- **Frost armor's Chill,** at half again the few, where the gate's plate is at the plain few and its blade at several. Sized to the link and to a spell's shorter time; it's now the smallest of the three a blow, and the widest.
- **Rousing chorus and Might's cap.** One cast nearly fills it, so the power step and a second cast add little. It may want fewer stacks more often, or it's simply a version that's done after one song.
- **Drinking palm at a fifth,** and **Horn of the keep at a half.** Both were sizes play named as unseen. Both resizes are my reading of how far "seen" is, and either could sit a step lower.
- **Shieldbearer, left alone.** A quarter more on every blow is a first step that may read as a stat. Doubling it, so Defense counts as Attack does, is the resize I'd make if the lead wants one.
- **Ember palms at 25 a stack.** On a fire of fifty it adds more than the Monk's own blows three times over. It's a mythic on a far end, and it's a guess.
- **Barbed volley's cooldown and cost,** moved a word and a rung as Whipping vines' were. It could as well keep the base's.
- **Frost fist at its base's few.** Round 2 asks for the scale's few; it's written at Burning fist's own three fifths of the word, about 10 Chill a cast, since the whole word is a shatter a cast. With the power step it's about 14 a cast: a shatter and a Stun on the coldest foe every cast, on a quick cooldown, for 200 MP. In a pack the pick moves on after each burst; a lone foe that isn't a boss is held for more than half of every cooldown.
- **The kept items I didn't doubt.** Thirty versions and nine mythics are marked *Stays* with a line each. Several of those were never fielded in play, so "seen" is my reading of the card, not a fight.
