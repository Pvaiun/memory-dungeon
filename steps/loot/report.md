# The loot pass: gate 1

For the director. The spine (`spine.md`) is the lead's design for the loot the nine builds need: its rules, one line an item, each engine's link and the web's checks. Nothing is built, and no number is set. This page leads with what needs your word.

## Decisions

**1. How loot is offered, not only what there is.** The spine's count of the web found the thing you asked it to look for.
- **What a run is offered today.** A party on a road is offered one of that road's first-step pieces in about half of act I's for Bonfire, Cold Snap and the Storm, and seven in ten or more for the other six. With the versions and common formations that also carry a first step, every road reaches seven to nine in ten.
- **An engine's keystone is another matter.** A party on an engine's road is offered a keystone piece it can wear in about a fifth of act I's, a third of runs by the end of act II, and under half of full runs. That's with every keystone in two to eight places.
- **Why.** An offer rolls a slot, then a class, then one of its kinds, then one piece of the two to five in that kind at that rarity. No stock gets a given piece in front of a run often. More places help little.
- **What's met.** A version is in about three of every eight trainings its class takes. Ten engines have a keystone in a version, and those are met by most runs that field the class.
- **`loot.md` says the designer's tags are "used to aim drops". The offer roll doesn't use them.**
- **The choice:**
  - **Leave it.** Engines stay rare finds, and the ten with a version carry the idea.
  - **Aim one offer of each fight's three** at what the party is already doing, by the designer's tags. On the script's estimate that takes a keystone from about a fifth of act I's to a third, and from under half of full runs to over six in ten. It takes every road's first-step piece to over nine in ten in act I.
- **I'd aim it.** It's the rogue mode's rule, not this pass's, so it would be a line in the build's brief. The fill doesn't wait on it.

**2. The counts.** The stock follows the roads, kind by kind, in place of even quarters.

| | Today | The spine |
| --- | --- | --- |
| Commons | 68 | 72 |
| Uncommons | 68 | 93 |
| Rares | 68 | 97 |
| Legendaries | 68 | 54 |
| **Pieces** | **272** | **316** |
| Formations, beside Neutral | 32 | 36 (13 common, 12 rare, 11 legendary) |
| Versions changed | | 11 of 128 |
| Mythics changed | | 4 of 16 |
| Kit changes | | the two you approved, and no other |

- **More uncommons,** because they carry nine roads' first steps and the engines' common halves.
- **More rares, fewer legendaries,** because of decision 4.
- **It's a sixth more to write and tune.** If that's too much, the place to cut is the uncommons, and the status roads' first steps pay for it.

**3. A status on a swing is an uncommon now, and the same plain rider sits in several kinds.**
- Today's riders are rares. builds.md makes a second source of fire, cold or charge a road's first step, so they move down, sized to be seen.
- `loot.md` says that where two items would read the same, one changes. The spine reads that as being about one unit's choice: a plain rider sits in more than one kind when no unit could hold both. builds.md asks for fire on swings "for many kinds".
- The plainest case: the fist weapons have three riders (Shock, Burn, Chill) that differ in one word.

**4. An engine's keystone is a rare; its grown form is the legendary.** Two dozen of today's legendary effects move down a rarity: the cold a shatter throws, the kill that calls the volley, the Shield that breaks as a blow. builds.md says a keystone has to be met while its other half is close at hand, and a fight's spoils roll a rare more than four times as often as a legendary. The far ends keep the legendaries.

**5. Malison counts every debuff.** builds.md says it pays for "each different affliction a foe holds". The spine counts every debuff in the vocabulary, each kind once, so the Hexer's own kit reaches four alone. If only Burn, Chill, Shock and Bleed should count, it's one line.

**6. Where the spine found builds.md or the core set doesn't hold.** None of these stopped the design. Each is a line to fix or a thing to know.
- **"Every keystone comes from more than one place" isn't enough for it to be met.** Decision 1.
- **The Storm is the road a run is shown least.** Its sign is in half of starting parties (the Stormcaller's passive, and the Valkyrie's one ability in three), and no version gives a first step. The spine answers it from the loot. A version on a third class would do more, and it's yours to ask for.
- **The opening, again can't keep its keystone on the amulet alone.** The amulet holds most of the start-of-fight uncommons it wants to fire again, and a unit wears one amulet. Its first taste is on Leather.
- **The red stone is in the game today.** builds.md's table says nothing does it. The Red Feast and Phylactery both turn healing past full into a Shield.
- **The Hunt's Mark is short.** Marked lasts under half the time its foe takes to fall (`STATUS.marked`). The spine's marker pieces lay it again. How long it lasts is the balance pass's.
- **`classes.md` names a Hexer version, Culmination, that isn't in the content.** Enfeeble's second version is Expose.

## What the spine holds

- **The rules:** the stock by kind and rarity, six counters (Cuts, Heat, Spite, Charge, Crescendo, Cascade; Tempo, Surge and Fervor go, and Heat now means speed), the rules the pieces bend, and twenty-one lines of code support.
- **The lines:** 244 uncommon, rare and legendary pieces, 36 formations, 11 changed versions, 31 kept versions the web needs to see, and 16 mythics. A road's first step and an engine's keystone say what the player sees.
- **Commons and uncommons by kind,** in one table, with what each kind's stats lean to on each road.
- **Each engine's link,** in plain words: what one part makes and what the other reads.
- **The web,** checked for rungs, routes, doors, exotics, and how often a run is offered a first step or a keystone.

**What changed from the brief:** nothing in its order or its scope. The spine adds a small script (`web-check.ts`) that reads its tags and writes its tables, so the counts can't drift from the lines.

## What the numbers say, and how sure

- **The counts are exact:** they're read from the lines.
- **The offer estimates are rough.** They use the real offer roll and its weights, and an estimate of a run's shape (six regular fights, an elite and a chest an act; a roster of four, five, then six). Read them for which threads are thin, not to a decimal.
- **Thin by that count:** the three status roads' first steps as pieces; the Storm overall; and six engines with two places and no version (the reckoning, the avalanche, the resonance, the crescendo, mana as armour, the borrowed gift).
- **Nothing here says any of it is fun or strong.** That's the build's test parties and your play.

## A sample worth reading

SAMPLE

## Least sure

- **Whether 93 uncommons can be told apart,** and whether riders as uncommons make the four status roads feel like one. Tinder charm and The standard, which follow whatever colour a party has, press on the same doubt.
- **Rares that used to be legendaries.** If they come to feel like the legendaries did, the far ends have less room above them.
- **Heat as speed.** Speed feeds every status road at once, and three roads build it.
- **The covenant,** which heals the party after every won fight: close to lasting more fights, which the rules rule out.
- **Aegis mail on the brink,** a unit that may not fall.
- **How few versions change.** Eleven of 128. The earlier versions were split toward identities the nine roads use; it may also mean they were read too kindly.
