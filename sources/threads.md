# Threads

A list of words effects in this game are written in, for checking a list of plays for gaps. It came from effects made for an earlier way of sorting the game, so it's a check only, never a source of plays.

## The threads

39 words. A thread is something a player could collect and a class could hold: a thing that happens in a fight, a thing a unit holds, or a thing laid on the foes, which one effect makes more of and another profits from. The list isn't sorted by role: the roles aren't designed. The Kind column says what sort of thing a word is, and nothing about what it's for.

| Thread | Kind | Given by | Wanted by | By the rules |
| --- | --- | --- | --- | --- |
| Swings | every unit's | basic attacks made more often (Attack speed, Haste, Heat) or out of turn | whatever happens on each basic attack |  |
| Casts | every unit's | a cooldown cut or readied, Haste, Heat, a cast made twice | whatever happens on each cast |  |
| Attack | every unit's | Attack raised, lent, or made from another stat | what scales from Attack, or reads who has the most |  |
| Extra strikes | happens | a hit that lands more than once (Double strike) | what reads an extra strike or repeats one |  |
| What a hit carries | happens | a status or effect added to its swings or hits as they land | what copies it onto other hits, or sets it off again |  |
| Crits | happens | crits made more often or bigger (Crit chance, Crit damage, Brittle) | what happens on a crit |  |
| A wind-up | happens | wind-ups made longer (Cast speed shortens them) | what pays for each tick of one, or while one lasts |  |
| The dodge | happens | dodges made (Evasion, Blur) | what happens on a dodge |  |
| Blows taken | happens | whatever sends the foes' blows to one unit: the draw (Taunt, Aggro), Fixated, a blow taken in an ally's place | what answers a blow or softens one, on the unit that's struck |  |
| A kill | happens | whatever counts as a foe falling, or fells several at once | what happens when a foe falls |  |
| The fight's start | happens | whatever makes the opening happen again | what happens as the fight starts |  |
| A foe acting | happens | nothing the party does: the foes supply it | what waits for a foe to act or to wind up |  |
| Between fights | happens | nothing yet | what happens when a fight is won, or changes what carries into the next |  |
| Heals | happens | a heal, Regen | what reads a heal, or what spills past full |  |
| Shield | held | a Shield made, or moved to a holder | what reads the Shield held, or pays when one breaks |  |
| Might | held | Might gained | what keeps it, or reads it |  |
| Guard | held | Guard gained | what happens as it's gained | gives Defense |
| Hidden | held | going Hidden | what its holder does while Hidden |  |
| Thorns | held | Thorns held | what scales from it | wants Blows taken |
| Lifesteal | held | Lifesteal held | what multiplies it | gives Heals |
| MP | held | mana regained (Clarity, Siphon), passed to an ally, or a cast made free | what spends more of it, or uses the pool as something else |  |
| HP paid or held low | held | a price paid in HP, or HP kept down | what pays out on a price, or on HP missing |  |
| Defense | a stat | Defense raised | what scales from it, or trades it away |  |
| Max HP | a stat | max HP raised | what scales from it |  |
| Bleed | on the foes | Bleed added | what reads it, or pays when it pays | wants Swings, Extra strikes |
| Burn | on the foes | Burn added, or kept when its foe falls | what reads the fire's height |  |
| Chill | on the foes | Chill added | what answers a shatter | gives Stun |
| Shock | on the foes | Shock added | what reads the charge | wants A foe acting |
| Sunder | on the foes | Sunder added | what reads the stacks |  |
| Stun | on the foes | a Stun landed | what happens when a foe is Stunned |  |
| Slow | on the foes | a Slow landed | what reads it |  |
| Silence | on the foes | a Silence landed | what happens when a foe is Silenced |  |
| The Mark | on the foes | a Mark placed | what its hits do to a Marked foe | gives Focus |
| Weaken | on the foes | a Weaken landed | what reads it |  |
| Spread | where it lands | whatever makes a hit, a status or an ability reach more foes than it was aimed at (Area, a hit that lands on a second foe, damage carried past a kill) | what counts the whole pack, or needs an ability to land on several |  |
| Focus | where it lands | whatever brings the party's hits or stacks onto one foe (a Mark, an ability's own aim, Seek past a Taunt, stacks sent to the foe that holds most) | what pays more the more one foe holds or has lost |  |
| The first-slotted ability | the player's | nothing: every unit has one | what acts on the ability slotted first |  |
| What's worn | the player's | nothing: a slot left empty, one hand or two | what reads it |  |
| A passive | the player's | nothing: every class has one | what doubles one or lends it |  |

- **Three are every unit's:** Swings, Casts and Attack. They're tagged like the rest, and left out when partners and joins are counted, or everything joins everything. Classes differ in how much of each they have, which is what a class's fit is read from.
- **By the rules** is what a status or stat does by itself, in the list's words, the same for whoever gives it. An effect that gives the thread takes it on: one that adds Chill also gives a Stun, at the shatter.
- **Words that stand for several,** for an effect whose own words say "any status":

| Word | Stands for |
| --- | --- |
| Afflictions | Bleed, Burn, Chill, Shock, Sunder |
| Buffs | Shield, Might, Guard, Hidden |

- **The vocabulary's other words have no thread,** because nothing in the web gives or wants them: Rot, Aegis, Bewildered, Owed, Accuracy, Cleanse, Dispel and Revive. One joins the list when an effect or a class takes it. Weaken is listed and empty: the builds page leans on it.
- **A new thread** needs an effect that names it in its own words and can't be written in the 39. Add its row here first; the tool refuses a word that isn't listed.

**How an effect is tagged:**
- **Wants:** what its own words name as its trigger, what it reads, and what it spends. It does nothing without it, or more the more there is.
- **Gives:** what its words say it makes, lays, moves or makes happen again, that another effect could want.
- **Its own damage and its own survival aren't threads.** They're what every party is after. So a payoff's Gives is empty, and an effect that only keeps a unit alive gives nothing here.
- **A price isn't tagged.** It's in the effect's words.
- **(an ally's)** after a want: it's set off by other units too, or read from them. **(to an ally)** after a give: it lands on another unit, or on the whole party. A word with neither is the wearer's own, or sits on the foes, which the whole party shares.
- **Only what its words name.** What follows through a status's own rule is the list's last column; what follows through another effect is in Effects that do something together.

