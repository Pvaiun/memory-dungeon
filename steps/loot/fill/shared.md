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
- **A card names the counter and says what it adds to it or reads from it.** It doesn't restate the table: the counter's own line is shown with its icon.
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

None yet.
