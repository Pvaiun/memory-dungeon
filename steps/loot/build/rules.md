# The rules the loot needs

The few rules that reach many cards, as ruled across the fill and both gates. A card in the catalog is the spec for its item; this page is what a card leans on and doesn't say. Anything not here, decide in the way that reads most naturally from the card, and say so in the report. The fill's notes (`fill/`) argue the edge cases: search them for one item's name when a card is unclear; don't read them whole.

## Two kit changes

- **Marked** takes the party's basic attacks, as today, and also the first pick of any ability aimed at "a random foe" (or "a random foe that isn't Taunting"), including a phrase's fallback to a random foe when it finds nobody. An ability whose phrase finds its foe ignores the Mark. The Taunt rule stands over it; Seek follows a Mark past a Taunt. An ability that would skip the Marked foe for holding a Stun or Silence lands on it for its damage. With several Marks, the pick is by draw among them. A piece or a seat never adds a second Mark to a party that has one.
- **Malison** curses every foe: a light hit from Attack, a fifth more for each different affliction the foe holds (Burn, Chill, Shock, Bleed, Sunder), then a few Bleed. It no longer adds a stack of each affliction. Its power step is two fifths more damage and two fifths more of every status the cast adds.

## Statuses

- **Someone stays in the light.** Hidden never lands where it would leave the foes no ally to pick; where several would hide at once, the last in seat order stays out. If the foes are left with nobody to pick, the last in seat order steps out of hiding.
- **A chain of shatters fizzles out.** Chill that one foe's shatter passes to another foe that has already shattered in the same chain is cut by about half for each time it has, in fractions of a stack: never to nothing, always dying down. It's on no card, and doesn't touch Chill from swings and spells.
- **A status keeps its own length and numbers.** A status moved or copied keeps its stacks and the time it has left.

## The six counters

Each is kept for the fight unless the card spends it, and its card says what a stack does in a bracket.

| Counter | A stack is | Held by | A stack by itself | Up to |
| --- | --- | --- | --- | --- |
| Cuts | a hit its holder landed | the unit (The whetstone: one count for the party) | nothing: the card says what it's worth | 25 |
| Heat | given by a card, on its trigger | the unit | 5 in each of Attack speed, Cooldown and Cast speed | 10 |
| Spite | a hit its holder took | the unit | nothing: the card says | 20 |
| Wrath | a hit taken by the unit the card names | the unit that will swing | its next basic attack deals a fifth more each, and spends them | 10 |
| Crescendo | one more cast of the same ability this fight, landing as the cast finishes | the caster | that ability deals, heals and adds a fifth more each | 10 |
| Cascade | a shatter, anyone's | the party | nothing: the card says | 10 |

One event adds one stack to a holder, however many of its cards count it.

## Words on many cards

- **A hit** is damage from a basic attack or an ability. Damage sent back, Thorns and a status's own damage aren't hits, and a foe felled by them isn't anyone's killing blow. "Its wearer's hits" is every hit its wearer lands.
- **An extra strike** is Double strike's second strike. Arc's second hit, a leap, a ring and a volley are extra hits with their own names.
- **"Strikes with its weapon"** is a hit of its basic attack's size out of turn, in whatever shape its basic attacks have (Millstone's, Hummingbird charm's). It isn't a basic attack.
- **"Carrying what the swing carries"** is applying the statuses its wearer's basic attack applies, from gear, a seat, a passive or a status it holds.
- **A hit that lands a second time** ("lands twice") is the same damage again on the same foe, at once unless the card says otherwise, with no new dodge or crit roll. It's a hit, carries none of the first's statuses, and is never repeated.
- **Left-over damage** (past a kill) is a hit on the foe it reaches: that foe's Evasion and Defense apply, it isn't boosted or crit again, and it carries no statuses. Where it lands is by the card's words or by draw; a Taunt and a Mark don't steer it.
- **A pick.** A card's target phrase is a pick, inside the Taunt rule unless it has Seek. A strike aimed at a named foe (the attacker, the foe that acted) isn't. What a piece or a seat sends to a random foe (a status, a left-over) goes by draw, and a Mark doesn't take it.
- **A crossing.** "Drops below half" (or a third) fires as the unit goes under the line, whatever took it there, a price included, and as a fight starts if it starts under. "Whenever" fires again only after the unit is back at the line or over; "the first time each fight", once. This is for HP; a watcher of MP keeps its card's words.
- **Start-of-fight effects** are what gear and seats do "when each fight starts". Overture coat and Second dawn make them happen again, once for each kill or fall, prices left out. A crossing that fires as a fight starts isn't one, and neither is a formation's rule for the whole party.
- **A heal** is HP an ability or a piece restores at once. A Regen's pulses aren't a unit's heals unless a card names Regen. **Healing received** is all of it: a heal, a pulse, Lifesteal. Healing past full goes to the healed unit's own piece first (Red stone mail), then the healer's (Phylactery), then the formation's (Shared cup).
- **Paid in life.** A card that makes an ability cost HP costs half the share of max HP that the ability would cost of max MP. "Pays for" an ability is a cost paid in MP or HP. **A free cast** costs nothing, in MP or HP, and isn't paid for.
- **The first-slotted ability** is the one the player put first. Bell of the hour, The cathedral, Floe charm, Frozen tome and Icefall's Breaker read it. "Its slowest ability" (Reveille) is by whole cooldown; "the longest cooldown left" (Reprise, Bounty charm) is the most wait left.
- **"At once"** doesn't stack: a second call before the first lands calls nothing more.
- **A repeat isn't repeated, and a redirect is final.** What a piece lands, casts, copies or sends on a second time is never repeated or sent on again, unless its card says it runs on. Two cards that each repeat one hit repeat the first once each: three in all.
- **A fallen foe's fire moves once.** Where two pieces or seats move the same Burn, it's split evenly between them.
- **Crit.** A card that sets a chance on some hits wins over Gambler's coin. Bloodscent knife and The king's head stop at 80%.
- **Beats.** "Every so often" is `COOLDOWN.short`; "every few ticks" is 4. A card with its own beat prints it.
- **Stacks from a seat are flat** (`FLAT_STACKS`). Stacks from a piece read the stat the card names, through `own()`.
