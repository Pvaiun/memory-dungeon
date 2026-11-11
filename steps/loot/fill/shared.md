# The fill: what every share shares

Set by the fill's lead, so eight shares write against one definition. Everything here is a first value, not a balanced one. Challenge any of it in your file; don't write round it.

Rulings that reach every share are added at the end, round by round.

## The counters

The spine's *New words* says what each counter means. This says the rest, once, for every card that uses one (`loot.md`, *Rules for writing pieces*: each counter is defined once).

| Counter | A stack is | Held by | What a stack does by itself | Climbs to |
| --- | --- | --- | --- | --- |
| **Cuts** | a hit its holder landed | the unit. Under The whetstone the party holds one count: every ally's hit adds to it and every ally reads it | nothing: each card says what a Cut is worth to it | 25 |
| **Heat** | given by a card, on the card's own trigger | the unit | its holder acts faster in everything: 5 in each of Attack speed, Cooldown and Cast speed | 10 |
| **Spite** | a blow its holder lived through: a hit it took | the unit | nothing: each card says what a Spite is worth to it | 20 |
| **Wrath** | a hit taken by the unit the card names | the unit that will swing | its holder's next basic attack deals a fifth more for each, and spends them all | 10 |
| **Crescendo** | one more cast of the same ability this fight, counted ability by ability | the caster | that ability deals, heals and adds a fifth more for each | 10 |
| **Cascade** | a shatter this fight, anyone's | the party: one count | nothing: each card says what a Cascade is worth to it | 10 |

- **An event is counted once.** One hit, blow, cast or shatter adds one stack of a counter to a holder, however many of that holder's pieces and seats count it. Two cards on one unit that read the same counter read the same number.
- **Heat is given, not counted.** A card that gives Heat says how many its trigger gives, so a rare trigger (a kill) can give enough to be seen at once.
- **A card that gives or reads a counter says what a stack does,** in a bracket, in these words, so a player meeting the card alone knows what will happen:
  - Cuts: "(a Cut for each hit it lands, kept for the fight, up to 25)", then what a Cut is worth on that card.
  - Heat: "(it acts 5% faster in everything for each Heat, up to 10, for the rest of the fight)".
  - Spite: "(a Spite for each hit it takes, kept for the fight, up to 20)", then what a Spite is worth on that card.
  - Wrath: "(its next basic attack deals a fifth more for each Wrath, up to 10, and spends them)".
  - Crescendo: "(that ability deals, heals and adds a fifth more for each Crescendo it holds, up to 10)".
  - Cascade: "(a Cascade for each shatter this fight, up to 10)", then what a Cascade is worth on that card.
- **Kept for the fight,** unless the card spends it (Wrath on the swing; Heat on Windrunner's garb).

## Stats and budgets

- **Steps are counted as the content counts them:** `stepsOf` and `budgetOf` in `content/core-set/pieces/kit.ts`, on `KIND_BUDGET` and `KIND_WORDS` in `scale.ts`. Every piece carries exactly its budget: a weapon its kind's, with a step fewer for a heavier swing and one more for a lighter; an armor, offhand or amulet the standard ladder.
- ***Core set: rules and vocabulary* says a stat that matches a weapon's scaling stat counts twice. The content's check doesn't count it so, and the fill follows the check.** It's flagged for the director.
- **A common on one step carries one stat.** Where its kind's row in the spine names two stats for it, pick one, so that the kind's commons differ from each other, and say which road's first stat it is.
- **A common needs a name.** Keep today's where a common of today's in that kind carries the same steps (`content/core-set/pieces/`); otherwise name it new. The lead checks names across shares.

## Words that already have a number

Name the word and its constant where the scale has one, and give a value of your own only where it has none.
- **Stacks:** a few, several, many, read off a stat the card names: `STACKS`, through `own()` in `content/core-set/pieces/kit.ts`. Where nothing sets the number, `FLAT_STACKS`.
- **Hits:** touch, light, normal, heavy, as a share of the stat the card names: `HIT`.
- **Timing:** the cooldown and wind-up words, `COOLDOWN` and `WINDUP`.
- **Special stats:** medium, or high on a legendary: `SPECIAL`.
- **Seats:** a seat's step, and its words (draws more, far more, less; a fifth faster): `content/core-set/formations.ts`, *The words, as numbers*.
- **Statuses:** `STATUS`. A status keeps every number it has there.

## Rulings for every share

Round 1. Each is about a word, a loop, an overlap or a card that didn't say what happens; none is about strength.

- **"Every few ticks" is four ticks** (Regen's and Clarity's own beat), on every card that says it, unless the card states a beat of its own.
- **"The most that Shield held"** is the pool's highest point since the unit last had no Shield. Rubble plate, Second skin, Rampart and Shatterstone charm read it. A Shield rebuilt at half sends back half.
- **A Crescendo lands when a cast finishes,** so the first cast of an ability is plain.
- **"Gives itself" is a status laid at a moment:** Hidden, Taunt, Haste, Might, Guard, a Shield, Regen, Clarity, Aegis, and a counter a card gives. A state held only while something is true of the unit (Bloodlust below half, a draw while healthy) isn't a gift. Twin-knot and Twins share the first kind only.
- **Left-over damage is a hit on the foe it reaches.** It meets that foe's Evasion and Defense, and it counts as a hit taken (a wound pays, Thorns answer). It isn't boosted or crit again, and it carries no riders. Where one unit holds two pieces that carry the same left-over, it's split evenly between them, as a fallen foe's fire is.
- **A hit "of its basic attack's size"** (a strike with its weapon, an extra strike) takes whatever shape the unit's basic attacks have: Millstone's, Hummingbird charm's, a Hammer seat's.
- **"Drops below half" (or a third) is a crossing,** whatever took the unit there: a blow, a status, a drain or a price. A watcher of HP isn't a reaction to the paying. A unit that starts a fight under the line has dropped, and the piece fires as the fight starts. "Whenever" fires again each time the unit is back at the line or over it and crosses again; "the first time each fight" fires once. (Watch horn, Bear fetish, Holdfast, Warded mail, Feathered cloak, Mottled hide's and Portcullis's states aside, Shroud charm, Aegis mail.)
- **"Its ability with the longest cooldown"** is its slowest ability, by its whole cooldown, cooling or not. "The longest cooldown left" is the one with the most wait left. A card says which it means. The shatter bell's places (Floe charm, Icefall's Breaker, Frozen tome) and Reveille mean the slowest.
- **"Nearest to ready"** is the least wait left among abilities still cooling (First light, Scrying orb, Dancer's cloak, Rubato).
- **A formation's rule for the whole party isn't an ally's gear or seat.** Overture coat and Second dawn don't make it happen again.
- **Carrying another unit's riders** (The standard, Mimic wand, Toll gate). The carrier takes each rider whole, reads its own stat for the stacks, and meets any condition itself (its own crits, first hits, counts). Toll gate's Collectors pass only what every swing adds. A rider the carrier's own swing already holds from the same source (a storm on the whole party, Crown of embers) isn't added twice.
- **Stacks from a seat are flat** (`FLAT_STACKS`), so a seat pays the same whoever sits in it.
- **"On the field" means on the foes.** Stormbrand and the Bolt seat count the Shock the foes hold; cards say "for each Shock the foes hold".
- **A strike a card aims at a named foe isn't a pick,** so a Taunt doesn't turn it: a strike at the attacker, at the foe that acted, at "that foe" (Duelist's leathers, Parrying spear, Answering thunder, Hushing idol). A rule that changes whom a unit's own swings or abilities pick is a pick, inside the Taunt rule unless it has Seek (Marginalia, Hoarfrost line's Breaker, a Mark).
- **"Nearly always" is four times in five,** a set chance on those hits that nothing raises (Ambush knife, Vulture's skull). A hit that always crits still does. A chance a card sets wins over Gambler's coin, as "always" does. The emptied quiver's link asks for a burst of three or four arrows, and at nine in ten it runs ten.
- **"Far more often" gives its number on the card.** Bloodscent knife and Spur's Opener are different sizes, so each says its own.
- **No card makes a crit certain for longer than one swing.** A card that raises Crit chance by a lot says "to four in five at most" (Bloodscent knife, The king's head). The emptied quiver's only brake is the crit that fails, and at a certain crit Quick draw never ends. Whether plain Crit chance should have a ceiling of its own is flagged for the director.
- **"Its hits", on a weapon,** means every hit its wearer lands: a swing, an extra strike or an ability's hit. The card says "its wearer's hits".
- **"Extra strike" is Double strike's second strike,** and what Flurry wraps chains from it. Arc's second hit, a leap, a ring and a volley are extra hits with their own names; each carries what its card says, and nothing that reads extra strikes reads them.
- **A hit that lands a second time** is the same damage again on the same foe, at once, with no new dodge or crit roll. It's a hit: a wound pays, Lifesteal drinks, counters count. It carries none of the first hit's statuses, and nothing repeats it. Where two cards would each repeat one hit or one cast, each repeats the first once: three in all.
- **A heal is HP an ability or a piece restores at once.** A Regen's pulses are the status's own: no card that reads its wearer's heals reads them, unless it names Regen.
- **Borrowed riders aren't passed on.** What a unit's swing carries by copying another's is part of its own swing and its own extra hits, and no third unit copies it from there.
- **The signature stat comes first unless it works against what the piece does.** Then the road's lean in the kind's header wins (Aggro on a chaser's spear).

- **"Pays for" an ability** means its cost was paid, in MP or in HP. A free cast isn't paid for.
- **"Carrying what the swing carries"** also carries what a status its wearer holds puts on its swings (a Thunderstorm). The spine's phrase gains it.
- **Someone stays in the light.** Hidden doesn't land on a unit when it would leave the foes no ally to pick; where several would hide at once, the last in seat order stays. It's a rule of Hidden's own, for the vocabulary, flagged for the director: gear and seats can now hide a whole party, and the game has no answer for that.
- **A start-of-fight status on every foe** reads its holder's Attack, at the card's word (Stormglass totem, Pitch lantern, Snowbound folio, the phial). As written in both offhands shares.
- **A pick by a phrase is still a pick.** A blow a card calls onto "the foe with the most Shock" (Stormspear) is inside the Taunt rule, and a Mark doesn't steer it, since it has a phrase of its own. Only a named foe is outside it: the attacker, the foe that acted, the foe just Marked.
- **A phrase's fallback to a random foe follows the Mark.** "The foe with the most Burn" with nothing burning is a random pick, and Marked takes the party's random picks.
- **The chalice's payer is the Vampire.** "Pays HP" covers a price taken from one unit for another's ability; the spine's phrase gains it.
- **Cards use the vocabulary's target phrases in full,** kept cards included: "the lowest share of max HP", "the lowest current HP". Kept cards also lose words the game no longer has ("physical damage", "a little" for a stack word, "for a moment" for a status's own length). That's wording, not a redesign.
- **A chain of shatters is damped in fractions of a stack.** A floor of one whole stack doesn't end a chain in a pack of seven or more beside Glacier's heart. In fractions it's never none and it always dies down. Code support 23 changes.
- **A card that gives or reads a counter says what a stack does,** in a bracket, in the counter's one wording. `fill/shared.md` said the opposite and was wrong: in an offer of three, a card that says only "gains a Heat" doesn't tell the player what will happen. The wordings are in `fill/shared.md`.
- **A kill is a kill.** A kill landed by an effect that's happening again (a repeated opening, a called swing, a left-over) still counts as one, and calls whatever a kill calls. What isn't repeated is the effect for the same fall: each start-of-fight effect happens once a fall, whoever calls for it. The kill chains end when the foes run out.
- **"It has Thorns" or "it has Lifesteal" as an effect** is sized as an effect, and may be the high word below legendary. "High only on a legendary" is a rule for stat steps.
- **A common on one step takes the first stat its row names,** where that still leaves the kind's commons different from each other.
- **New target phrases,** for the vocabulary when it's built: the other ally with the least Defense; the ally with the highest Aggro; the ally with the slowest basic attack; the two foes with the highest Attack; the foe that last hit the healed ally; the ally with the lowest share of max HP, the payer aside; the foe with the highest current HP; the ally with the lowest share of max HP that can be healed; the ally with the least MP (the lowest share of max MP, the holder included); the other ally with the least max HP; the other foe with the most Chill; the foe with the lowest share of max HP. "The ally with the highest Aggro" reads Aggro as it stands, gear and seat counted, a Taunt not; a tie goes to the earlier seat.
- **Names changed in round 1,** in the spine, the index and every card that mentions one: Icebreaker charm is now Floe charm; Spiked kite is now Bossed kite; Phalanx shield is now Tower shield; The long wall is now The palisade; Open wound is now Bloodied ground; Bloodletter's phial is now Lancet phial; Idol of the deepening is now Festering idol; Annotated score is now Accompanist's score; Orb of the long winter is now Meltwater orb; Trophy spear is now Victor's spear; Shepherd's mace is now Anchorite's mace; Sunhammer is now Noonday mace; Sanguine vestments is now Flagellant's vestments; Tally coat is now Overture coat; Storm pike is now Squall lance. Two amulet commons: Lodestone is now Bezoar, Whetstone is now Flint. Two mail commons: the Lifesteal one is Lamprey mail, the HP one Thick byrnie.
