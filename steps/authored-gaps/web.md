# The web

What the web holds. First the threads: the one list of words every effect is written in, and every class will be. Then the catalog: every effect the director kept or wrote, one row each, as what it wants and what it gives. Then the count that says what's used too much, what the director has settled, every card asked so far and what came of it, what not to ask again, and the effects seen to do something together. Nothing here is sized or slotted. The director's rulings and how the page works are in `report.md`.

`npx tsx tools/web-threads.ts` reads this page: it stops on a word that isn't in the list, and prints the tally the count is judged from, what joins to what, and how many partners each effect has. `npx tsx tools/web-map.ts` redraws the map from it (`report.md`, The web).

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

## The clocks

A trial, and the agent's reading: what a fight's damage keeps time to. The seven are the rhythm table of `docs/gear-design/builds.md` read as a list of its own, each build a clock tied to a few words. The catalog's Clock column gives an effect one clock, two where it joins them, or none where it's a trade or a seat's shape with no timing of its own. A status brings its own clock: fire is fed, frost breaks, Bleed is cashed by hits, Shock follows the foes.

| Clock | What it is | The builds on it |
| --- | --- | --- |
| Fed | fed, or it falls: as high as it's being kept up right now | Bonfire |
| Breaks | builds until it breaks, on a beat | Cold Snap |
| Hits | opened, then cashed by every hit | Thousand Cuts |
| Foes | follows what the foes do: their actions, their attacks, their misses | The Storm, The Toll |
| Load | a long quiet, then one blow | Landslide |
| Kills | a volley at the start, then each kill sets off the next | The Hunt |
| Fuel | poured out while the fuel lasts, mana or life | Barrage, Blood Pact |

## The catalog

108 effects: the 41 gear effects the director marked Great, 10 from the Great formations, 6 seats they starred in other formations, and 51 from their answers to four batches (41 on gear, 10 formations). A note is there only where something was assumed, or where sizing, slotting or simulation has something to remember.

**Adding an effect:** one row, in words that say what it does; what it wants and what it gives, in the threads' words and by the rules above; its clock, where it has one; then run the tool and recount its words in The count.

| Effect | From | Wants | Gives | Clock | Note |
| --- | --- | --- | --- | --- | --- |
| Damage hits MP in place of HP | Great | Blows taken, MP | — | Fuel |  |
| Overheal becomes a Shield on itself | Great | Heals | Shield | — |  |
| Attack lent to the weakest ally | Great | The fight's start, Attack | Attack (to an ally) | Kills |  |
| Crits heal the lowest ally | Great | Crits | Heals (to an ally) | Hits |  |
| Abilities from the top ally's Attack | Great | Casts, Attack (an ally's) | — | — |  |
| Crescendo on each cast | Great | Casts | — | Fed |  |
| On a dodge: the hit lands on another foe | Great | The dodge | — | Foes |  |
| Readies the top-Attack ally's slowest ability | Great | The fight's start, Attack (an ally's) | Casts (to an ally) | Kills |  |
| Abilities from Defense | Great | Casts, Defense | — | — |  |
| Every other ability free | Great | Casts | MP | Fuel |  |
| While Hidden: hits ×2 | Great | Hidden | — | Load |  |
| An ally's price heals another | Great | HP paid or held low (an ally's) | Heals (to an ally) | Fuel |  |
| On a dodge: strikes the attacker | Great | The dodge | Swings | Foes |  |
| A status given to itself, shared with the lowest ally | Great | Buffs | Buffs (to an ally) | — |  |
| A knockout survived at 1 HP, Hidden | Great | Blows taken | Hidden, HP paid or held low | — |  |
| No offhand: Evasion and harder swings | Great | What's worn, Swings | The dodge | — |  |
| Swings don't spend Might | Great | Swings, Might | — | Load |  |
| Every other ally's Shields go to it | Great | Shield (an ally's) | Shield | — |  |
| Max HP and max MP trade places | Great | Max HP, MP | Max HP, MP | — |  |
| A broken Shield sends back ×2 | Great | Blows taken, Shield | — | Breaks, Foes |  |
| Never swings, Defense ×2 | Great | — | Defense | — |  |
| Abilities deal more per Shock | Great | Casts, Shock | — | Foes |  |
| A foe falls: the party's opening again | Great | A kill | The fight's start (to an ally) | Kills |  |
| Stunned at the start, then everything ready and Hasted | Great | The fight's start | Casts, Swings | Load |  |
| Extra strikes roll Double strike again | Great | Extra strikes | Extra strikes | Hits |  |
| Swings add half the party's Shield | Great | Swings, Shield (an ally's) | — | Fed |  |
| A heal becomes the healed ally's next hit | Great | Heals | — | Load |  |
| +50% Crit chance, other hits halved | Great | — | Crits | Hits |  |
| Swings add Chill from max HP | Great | Swings, Max HP | Chill, What a hit carries | Breaks |  |
| Abilities free under Clarity | Great | Casts, MP | MP | Fuel | It wants Clarity itself, which sits in MP: plain mana doesn't set it off. |
| Its overheal becomes a Shield on the healed ally | Great | Heals | Shield (to an ally) | — |  |
| On a dodge: the next swing at once, 2 times | Great | The dodge | Swings, Extra strikes | Foes |  |
| Half-HP start, Lifesteal ×2 | Great | The fight's start, Lifesteal | HP paid or held low, Lifesteal | Fuel |  |
| Swings 50% as often, ×3 and a Stun | Great | Swings | Stun, What a hit carries | Load |  |
| On a dodge: Heat, lost when it loses HP | Great | The dodge | Swings, Casts | Foes, Fed |  |
| Held at 50% HP for +50% | Great | — | HP paid or held low | Fuel |  |
| Swings paid in HP | Great | Swings, Max HP | HP paid or held low | Fuel |  |
| Swings deal more per Shock | Great | Swings, Shock | — | Foes |  |
| A heal on every cast | Great | Casts, Max HP | Heals | — |  |
| Swings only when a foe acts | Great | A foe acting | — | Foes |  |
| Hits deal more per different debuff | Great | Afflictions | — | — | Tagged with the five afflictions; any other debuff counts too. |
| Icefall, Rime: abilities add more Chill | Great formation | Casts, Chill | Chill | Breaks |  |
| Icefall, Sleet: swings add a Chill | Great formation | Swings | Chill, What a hit carries | Breaks |  |
| Icefall, Breaker ★: a shatter readies its first-slotted ability | Great formation | Chill, The first-slotted ability | Casts | Breaks |  |
| The cathedral, Soloist ★: its first-slotted ability has no cooldown | Great formation | The first-slotted ability, MP | Casts | Fuel |  |
| The cathedral, Voice: its MP goes to the Soloist; a Shield when the Soloist casts | Great formation | MP, Casts (an ally's), Max HP | MP (to an ally), Shield | Fuel |  |
| The standard: Followers' swings carry what the Lead's carry | Great formation | Swings, What a hit carries (an ally's) | What a hit carries | Hits |  |
| Glass and stone ★: one deals and takes ×2, two draw | Great formation | — | Blows taken | — |  |
| Twins ★: what a Twin gives itself, the other gains | Great formation | Buffs | Buffs (to an ally) | — |  |
| Bannerman: one never acts, the others gain its Attack and Defense | Great formation | Attack, Defense | Attack (to an ally), Defense (to an ally) | — |  |
| The shepherd: takes the hits meant for the lowest ally | Great formation | — | Blows taken | — |  |
| Warden ★: a hit on the Anchor heals it from the Warden's max HP | Starred seat | Blows taken (an ally's), Max HP | Heals (to an ally) | Foes |  |
| Peak ★: hits land twice while every ally holds a Shield | Starred seat | Shield (an ally's) | Extra strikes | Breaks |  |
| Torch ★: a fallen foe's Burn passes on | Starred seat | A kill, Burn | Burn | Kills, Fed |  |
| Conductor ★: each cast feeds the Soloist's mana | Starred seat | Casts | MP (to an ally) | Fuel |  |
| Well ★: draws more; blows taken feed the Soloist's mana | Starred seat | Blows taken | Blows taken, MP (to an ally) | Foes, Fuel |  |
| Lifeline ★: takes half of what the Anchor takes | Starred seat | Blows taken (an ally's) | — | — |  |
| Regains MP for each stack of any debuff on the foes | Batch 1 | Afflictions, Spread | MP | Fuel |  |
| Damage statuses it lays (Burn, Bleed, Shock, Chill) go to the foe holding the most of that status, unless that foe is at its cap | Batch 1 | Burn, Bleed, Shock, Chill | Focus | — | Its wearer's own applications only. |
| Every tick of its wind-up lays Shock on every foe | Batch 1 | A wind-up | Shock, Spread | Load, Foes |  |
| Any ability of its that lands on more than one unit, allies included, lays Shock on every foe | Batch 1 | Casts, Spread | Shock, Spread | Foes |  |
| On a dodge: heals a share of the blow it would have been | Batch 1 | The dodge | Heals | Foes |  |
| On a crit, whatever the hit sets off happens 4 times | Batch 1 | Crits, What a hit carries | What a hit carries | Hits | Statuses carried, Double strike's roll, anything worded "on a hit" or "on a basic attack". Never the hit's own damage, so no Lifesteal. Heat on a crit counts once. |
| At fight start: more max HP | Batch 1 | The fight's start | Max HP | Kills | Current HP stays where it is, and the fight's end cuts it back. |
| At fight start: Might | Batch 1 | The fight's start | Might | Kills | A Fine, brought in because the effect that repeats the opening needs openers. |
| At fight start: Blur on every ally | Batch 1 | The fight's start | The dodge (to an ally) | Kills | A Blur's miss is a dodge. |
| Defense while it wears no armor | Batch 1 | What's worn | Defense | — | An amulet. |
| At fight start: a Mark on the foe with the least max HP | Batch 1 | The fight's start | The Mark | Kills | Only while no foe is Marked. It calls a heavy swing onto the smallest foe; damage carried past a kill answers that. |
| Formation: the third seat takes no action of its own and basic attacks whenever either of the others does | Batch 1 | Swings (an ally's), Casts (an ally's) | Swings | Hits | Its swings happen even on a unit that never makes a basic attack. |
| Formation: one seat holds triple the Shield and draws more; the other two can't hold any | Batch 1 | Shield | Shield, Blows taken | — |  |
| Its extra strikes set off what a basic attack sets off | Batch 2 | Extra strikes, What a hit carries | What a hit carries | Hits | A Fine, a little wider. It doesn't roll Double strike again by itself. |
| Each status it lays on itself or an ally adds Chill to the foe with the most Chill | Batch 2 | Buffs | Chill | Breaks | Its own applications, once for each ally a buff lands on; a random foe when none holds Chill. |
| When another ally casts: a fixed amount comes off its cooldowns, split evenly over the abilities it has slotted | Batch 2 | Casts (an ally's) | Casts | Fuel |  |
| When a foe is Stunned: gains Might | Batch 2 | Stun | Might | Breaks, Load | Any Stun that lands, a shatter's included, whoever caused it. |
| A Stun it lands leaves Slow behind | Batch 2 | Stun | Slow | Breaks | On a boss both count toward its resistance to control. |
| When a fight is won: gives up half the HP it has left and gains that share of its max MP | Batch 2 | Between fights | MP, HP paid or held low | Fuel |  |
| Its first-slotted ability adds Burn to every target, allies included | Batch 2 | The first-slotted ability, Casts | Burn | Fed | Burn on an ally is the director's choice. The gathering piece moves only Burn laid on foes. |
| Attack for the HP it is missing | Batch 2 | HP paid or held low, Max HP | Attack | Fuel | Counted in points, not as a share. |
| While Hidden: regains MP every tick | Batch 2 | Hidden | MP | Fuel |  |
| Formation: the first seat pays a share of its max HP for every action; the second raises it when it falls; the third gains Attack for every share of HP the party is missing | Batch 2 | Swings, Casts, HP paid or held low (an ally's) | HP paid or held low, Attack | Fuel | The price can kill the first seat, and a fallen ally counts in full: the one thing in the game that wants a fall. The third seat's Attack is sized to pay for the risk on the second. |
| Its hits add Bleed to a Marked foe | Batch 3 | The Mark | Bleed, What a hit carries | Hits |  |
| Its hits on a Marked foe also land on another foe, carrying what the hit carries | Batch 3 | The Mark, What a hit carries | Spread | Hits |  |
| When a foe is Stunned and no foe is Marked: it is Marked | Batch 3 | Stun | The Mark | Breaks, Kills |  |
| Its hits deal more for each share of HP its target is missing | Batch 3 | Focus | — | Kills | Sized to show on a boss. Its words name no thread: tagged by what brings its target low. |
| When a foe is Silenced: the party's "when a foe falls" effects happen | Batch 3 | Silence | A kill (to an ally) | Kills | Not effects worded "on a kill", and not those that move something off the fallen foe. A boss comes to resist Silence. |
| Becomes Hidden whenever it gains Guard | Batch 3 | Guard | Hidden | — | A Taunt ends Hidden, so it doesn't work on a unit that Taunts as it Guards. Needs Guard on plain gear. |
| Every tick of its wind-up gives it Might | Batch 3 | A wind-up | Might | Load | Sized so one long cast doesn't fill the cap. |
| On a crit: Heat | Batch 3 | Crits | Swings, Casts | Hits, Fed | Heat is lost when its holder loses HP (half each time), not when it's hit: the director changed the rule. |
| Double strike for each stack of Sunder on the foes | Batch 3 | Sunder, Spread | Extra strikes | Hits, Fed | Counted over every foe. Sized so a fully Sundered pack is near a sure second strike. |
| Half its Defense becomes Attack | Batch 3 | Defense | Attack | — |  |
| Applies more stacks of any status it applies, and its hits deal half | Batch 3 | Afflictions, Might | Afflictions, Might | — | Stacking statuses only. The price is on its hits, not its Attack: stacks follow Attack (`STACKS`). |
| Half its Defense for faster basic attacks | Batch 3 | Defense | Swings | — |  |
| Formation: with a two-handed weapon a unit's basic attacks deal ×2 and come half as often; with a one-handed weapon they deal half and come twice as often | Batch 3 | What's worn | Swings | Load, Hits | On basic attacks only, at the agent's suggestion; the director wrote it on Attack. |
| Formation: one seat draws; one crits less often, and each of its crits raises the party's Crit damage for the rest of the fight; one crits more often | Batch 3 | Crits | Crits (to an ally), Blows taken | Hits, Fed | Sized far under what the director wrote, and capped. |
| Formation: the third seat's amulet counts as worn by every member; the other two gain Attack or Defense for an empty amulet slot | Batch 3 | What's worn | Attack, Defense | — | Stats and effect are shared, and the shared amulet doesn't fill the other two's slot. Whether a mythic amulet is shared waits for the mythics. |
| Formation: in the first seat every single-target action lands on every foe or every ally at a share; in the second every multi-target action lands on its first random target for more | Batch 3 | Spread | Spread, Focus | — | Against foes a Mark takes the second seat's pick. |
| Damage left over from a kill carries into another random foe, and on with each kill | Batch 4 | A kill | A kill, Spread | Kills | Its wearer's own hits. What carries is damage, not a new hit. |
| While above 30% HP: when a foe starts a wind-up, pays a share of its max HP and Silences that foe | Batch 4 | A foe acting | Silence, HP paid or held low | Foes, Fuel | Pays only when the Silence lands. A price, not damage. |
| Cooldown for each ability it has slotted | Batch 4 | — | Casts | — | The director slots one or two for uptime, so it's a choice. A full kit lands between a rare's and a legendary's Cooldown (`SPECIAL.cooldown`). |
| Its wind-ups take three times as long; while winding up it has Thorns and Aggro | Batch 4 | A wind-up | A wind-up, Thorns, Blows taken | Load, Foes | The Thorns are gone as the cast lands. Sized under the Bramble knight's own (`SPECIAL.thorns`). Meant for the great weapon's holders. |
| Its wind-ups take twice as long, and each ability is cast twice for twice the mana | Batch 4 | Casts, MP | Casts, A wind-up | Load, Fuel | The second cast is sized as a share of the first. |
| Each time a foe's Burn ticks: gains Might for every 10 Burn on that foe | Batch 4 | Burn, Focus | Might | Fed, Load | No price. Sized so the Might follows the fire's height and doesn't sit at the cap. If it's too easy, an MP price is the one to take back to the director. |
| When hit: strikes the attacker with a basic attack | Batch 4 | Blows taken | Swings | Foes | No cap on how often. The answering swing and what it carries are a share of a basic attack. Works on a unit that never makes one. A Stun it carries can't be sized by a share: watch it in simulation, and go back to the director before changing it. |
| Its basic attacks scale from Thorns | Batch 4 | Swings, Thorns | — | — | Not on a weapon, so it can be worn with the tripled wind-up. Needs Thorns on plain Plate and Mail. |
| Doubles the effect of its wearer's passive | Batch 4 | A passive | A passive | — | No price. What doubles for each of the sixteen is the agent's to say, from each power step, and to show the director by sample. Its own class's passive only. If simulation finds it on every unit, longer cooldowns is the price to take back to them. |
| Formation: the foes' picks are even across the three, and no ally can Taunt; when hit, the first seat's first-slotted ability comes nearer, the second gains Defense, the third Attack | Batch 4 | Blows taken, The first-slotted ability | Blows taken, Casts, Defense, Attack | Foes, Fed | The gains add up over the fight, small and capped. A dodged blow isn't a hit. |
| Formation: two seats each hold the other's passive as well as their own; the third is plain | Batch 4 | A passive (an ally's) | A passive (to an ally) | — | A borrowed passive comes as its owner trained it and reads the borrower's stats. The agent checks each of the sixteen on another class and brings back those that don't work. |
| Formation: a foe that takes Shock damage gains Bleed; the first seat's crits lay Shock, the second swings faster, the third is healed whenever Bleed pays | Batch 4 | Shock, Crits, Bleed | Bleed, Shock, Swings, Heals | Foes, Hits | The heal is a fixed amount, as a trial: the director pictured a share of the Bleed. The second seat has room for another effect of theirs. |

**Kit changes, for build** (the director's, written in an answer; the kits stay as they are until then):
- **Assassin, Vanish, version A: Ambush** (goes Hidden, and Marks the foe with the least current HP), in place of Smoke screen. After it, nothing in the kits hides another unit.
- **Bard, War ballad, version A: March** (Might on every ally, and a Mark on a random foe while no foe is Marked), in place of Lament.

## The count

By thread: every effect that names the word, givers and wanters together. The numbers are the tool's (`npx tsx tools/web-threads.ts`); the verdicts are the agent's. A word is overused when a player could take every piece that names it and be right each time: about one effect in twelve names it, and they add up on one unit. It's underused when the game leans on it and fewer than three effects name it. The line is one effect in twelve: 9 of 108. A word's number is the effects that name it itself; the six that name every affliction or every buff at once have a row of their own.

| Names | Effects | Verdict |
| --- | --- | --- |
| Blows taken | 13 (7 send the foes' blows to a unit, 8 answer a blow or soften it, 2 do both) | Watch, for formations: 8 of the 26 formations and seats turn on who is struck. A party fields one formation, so those eight are rivals and don't pile up; but the next formation card needs a job that isn't the front line. On gear it's 5 of 82, and fine: two soften the blow, two answer it, one draws it while casting |
| MP | 12 | Common, and fine: every caster needs it, and the twelve pull four ways (cheaper casts, mana passed on or regained, MP as a body, casts that cost twice) |
| The fight's start | 9 (8 openers, and the 1 that repeats them; a Silence repeats them too, through a kill) | Overused, at the line: they all fire together, and a foe falling or a Silence fires them again. The shared amulet fires an amulet's opener three times |
| Heals | 9 (6 give one, 3 read one; the doubled Lifesteal heals too, by Lifesteal's own rule) | Watch: at the line. The six that give a heal sit on six different triggers and mend different units, so they don't add up on one; the three readers (overheal into a Shield, twice, and a heal into the next hit) multiply every one of them. No card asks from it, and the next answer that reads a heal is flagged |
| HP paid or held low | 9 (7 pay or hold HP down, 3 read it, 1 does both) | Watch: at the line, with the knockout survived at 1 HP counted for the state it leaves. Five add up on one low unit; the one that pays HP to Silence needs HP to spend, so it pulls against them. What else pulls against them is dying, and healing that takes the bonus away. The director is told: no more asked, and a new answer that names it is flagged |
| Shield | 8 | Overused still, though just under the line by number: five sit on one holder and two more feed it; only the Peak pulls the other way. Heat's rule gives one more reason to hold one, and the three effects that name every buff count a Shield too |
| Defense | 8 | Fine by number: five raise it, two spend half of it, two read it, so they pull against each other. Flagged for its shape: the seven that turn on it lead nowhere but Attack and swing speed, so it's a group on one word with nothing leading out |
| Max HP | 8 | Watch: a stat, but seven effects scale from it, one raises it on every kill, and Attack for HP missing counts in points, so it grows with it too. No more asked from it |
| What a hit carries | 8 (4 add something to a hit, 4 copy it or set it off again) | Fine. The three that repeat it on gear (a crit's 4 times, extra strikes, a Marked foe's second landing) compound on one unit: a fourth is flagged |
| The dodge | 7 (5 "on a dodge", 2 that make dodges) | Watch: under the line by number, and all five stack on one dodger. Two of the five lead out, to extra strikes and to a heal. No card from it yet |
| Spread | 7 | Fine: five widen something and four read width, two doing both |
| Chill | 6 | Watch: five move a foe toward the shatter and one answers it, and the three that name every affliction add to it. The next answer that names it is flagged |
| Shock | 6 | Fine. Three lay it, four read it; the Shock and Bleed shape lays it and turns its damage into Bleed |
| Might | 6 | Fine. Four give it to their wearer on different triggers (the opening, a Stun, a wind-up, a fire), one adds stacks to it and one keeps it |
| Crits | 6 | Watch: crits heal, set off triggers 4 times, give Heat, raise the party's Crit damage from a seat, lay Shock from a seat, and one piece adds Crit chance. All six add up on one unit that crits. No card from it next batch |
| Extra strikes | 5 | Fine: four make them and two read them |
| The first-slotted ability | 4 | Watch: all four stack on one cast (no cooldown, readied by a shatter, readied by blows taken, Burn laid). The card that asked for another slot was withdrawn |
| Burn, the Mark, Focus, Hidden, a kill, Stun, a wind-up, what's worn | 4 each | Fine. Burn has a source, a payoff and a seat that keeps it. The Mark has sources and payoffs, and two kit changes waiting. A kill has the party's opening, the Torch, the damage that carries on and the Silence that counts as one. Two wind-up effects pay for each tick and two make it longer, so all four stack on one caster, and its casts get rare: watch it in simulation. What's worn is an empty offhand, armor and amulet, and one hand or two |
| Bleed | 3 | Fine |
| Thorns, Silence, a passive, a foe acting | 2 each | Thorns sizes a swing and is held while winding up. Silence has a source any class can wear. A passive is shared by two seats, and doubled by a piece. The foes supply their own actions: nothing makes them act sooner |
| Sunder, Guard, Slow, Lifesteal, between fights | 1 each | Guard hides a unit, and needs Guard on gear. Nothing reads a Slow |
| Weaken, and the vocabulary's words with no thread | 0 | Left alone: the Toll has its payoff, and a rare status is allowed to stay rare |
| Every affliction at once; every buff at once | 3 each | Told to the director already: each is every status party's pick. The three on afflictions are hits for each different debuff, mana for the foes' stacks, and more stacks. The three on buffs are the two that share a status and Chill for each status laid on its own side. No more asked |

- **Swings, Casts and Attack aren't judged:** every unit has them. The tool counts them all the same.
- **Overused means no more for now, not too many kept.** Nothing placed is taken out, and the share falls as the web grows.

**What the gear reads more than it gives,** so the supply is a class's, a plain piece's or the foes': the fight's start (8 want it, 1 gives it, as settled), max HP (7 and 2), crits (5 and 2), the dodge (5 and 2), Stun (3, and 1 with every Chill), a wind-up (3 and 2), Sunder (1 by name and nothing that lays it), Guard (1 and none), a foe acting (2, the foes').

**What the gear gives more than anything reads:** HP paid or held low (7 give, 3 want), heals (6 and 3), MP (9 and 6), extra strikes (4 and 2), Slow (1 and none).

**What never meets:** nothing joins a blow taken to any affliction, either way round; nothing joins HP paid or held low to one; nothing joins a blow taken to the dodge. Nothing names Weaken or Seek.

## Settled by the director

Their decisions about what the web is, one line each. They stop a card being asked twice.

- **The Storm has two patterns:** hold the foes slow or still so the charge reaches its cap and is read, or stand under their attacks while it spends itself. Nothing makes the foes act sooner.
- **Shield has two patterns:** one unit holding all of it, or everyone holding some.
- **The unit that doesn't act is there to benefit the others.** Nothing makes it strong itself.
- **Cold Snap is about reaching the shatter.** Nothing pays for a foe left half-frozen.
- **No thread for debuffs held on purpose.**
- **The Toll has its payoff:** the Shield that sends back what it held.
- **The player steers who dies only through a Mark or an ability's own aim.** No reward by who died, beyond a Marked foe falling.
- **The opening repeats when a foe falls, for the whole party, and when a foe is Silenced.** Nothing else repeats it or doubles it.
- **The swing and the cast need no link.** Every unit does both.
- **Nothing pushes a player to slot fewer abilities.** They may choose to, for uptime.
- **Thousand Cuts' piece is about its extra strikes.** Bleed comes from the kits and the plain pieces.
- **A kill needs no formation,** and no reward beyond the opening.
- **Nothing in the loot touches the bench.**
- **A build can't rest on gear and one class,** so an answer may change a kit.
- **No third counter.** Heat comes from more than one trigger, and is lost when its holder loses HP.
- **Two builds' words may share a card.** A shape for statuses pairs two named ones; one for every status at once is every status party's pick.
- **A payoff for a fire reads it and leaves it burning.**

## Cards asked

Every card sent, and what came of it.

- **Batch 1.** Bonfire, keeping it up: placed (mana for debuffs; the gathering piece) · Cold Snap, the climb: wrong question · The Hunt, who dies first: placed (the opening Mark) · The Storm, where the charge comes from: placed (Shock from casting, from wide abilities) · Thousand Cuts, the wound: wrong question, asked again in batch 2 · The Toll, wanting to be hit: wrong question · The dodge and cover: placed · A debuff held on purpose: wrong question · The crit: placed · The unit that stands still: wrong question · An opening worth repeating: placed (max HP, Might) · A change of target: wrong question · A formation about the swing: placed · A formation about who holds the Shield: placed · A party with no wall: placed (party Blur, Defense for no armor) · Open: answered, then cut by the director.
- **Batch 2.** Thousand Cuts, a Bleed piece: placed (extra strikes) · Cold Snap, cold without a wall: placed · The Storm, making them act: wrong question · Barrage, the two who serve: placed · A Stunned foe: placed · Hidden: placed (mana) · The swing and the cast: wrong question · Between fights: placed · A unit with one ability: wrong question · Pyromancer and Bramble knight: placed (Burn from the first slot) · Assassin and Cleric: placed (Attack for HP missing) · A formation about the kill: withdrawn · A formation about HP paid or held low: placed · Open: not answered.
- **Batch 3.** The Mark, a whole direction: placed (three effects, two kit changes) · The Hunt in a fight with one foe: placed (two) · A way to hide: placed · The wind-up: placed (Might) · The bench: wrong question · A count that grows: placed (Heat on a crit) · Monk and Hoplite: placed · Knight and Ranger: a piece placed, the pair withdrawn · Bard and Hexer: placed · Vampire and Stormcaller: placed · Formations about time, crits, what the seats wear, wide and narrow: all four placed · Open: not answered.
- **Batch 4.** Bonfire, a payoff for a high fire: placed (Might for the Burn) · Landslide's blow in a pack: placed · Silence from more hands: placed · An ability slot that isn't the first: job withdrawn, the answer placed · Paladin and Geomancer: placed (two wind-up pieces) · Valkyrie and Frostweaver: placed (the doubled passive) · Bramble knight and Hoplite: placed (two) · Formations with no front, about what a class does, about the statuses on the foes: all three placed · Open: not answered.

## Not to ask again

- **Wrong questions and withdrawn jobs:** a payoff on a half-frozen foe · a reason to want a unit hit · a debuff held on purpose · something for a unit that gives up acting · a redirect for its own sake · a way to make the foes act · a link between swings and casts · a piece for a unit with one ability · a formation about the kill · the bench · another ability slot than the first · a formation for every status at once · a third counter · a third Bleed card.
- **Their plain answer was cut by the director:** a formation whose seats aim the party · a longer wind-up for more of everything · a shape that turns over time (seats that rotate, a party that surges and ebbs).
- **Coverage:** the weapon slot left empty · a formation that reads the party as a set · Clarity from more hands (three base kits give it) · something for the two beside a struck ally (seen three times as a formation and kept only as Fine).
- **Against a rule:** a payoff for a Stun or Silence a boss resists (the resistance is what bounds them) · a piece that answers one kind of foe (no set-up only the foes supply) · a road's far end as a capstone (ruling 14).
- **While overused or on watch:** more from Shields, the fight's start, crits, HP paid or held low, max HP, Chill, heals, the dodge, the first-slotted ability; a formation about who is struck; another effect for every affliction or every buff at once.

**Written by the director and left out,** with the reason, in case one comes back: Chill turned into Bleed (barred then, allowed now) · a Shield when a foe is Stunned (Shield is overused) · Might while Hidden (on top of ×2 while Hidden) · MP for allies on every tick of a wind-up (MP is the most-named thing) · a fire that bursts at a set height and heals the party (two vocabulary rulings; the director agreed) · a heal for a share of each Burn tick (lifesteal from a status) · Thorns while winding up without the Aggro (fewer partners).

## Seen, not yet asked

- **For the plain parts, the agent's to write:** Guard on gear, for units that don't Taunt · Thorns on Plate and Mail · fire on a swing, and on whoever strikes the keeper.
- **Needs a job first:** a second Sunder or Bleed piece · Haste (it pays by itself) · Thorns, an Aegis, Taunt and Weaken, which nothing names.
- **Waiting for the web to grow:** the Knight and the Ranger as a pair (the director's offer) · the Shield and the cast · a formation for the dodge · a formation about heals.
- **Welcome:** a second shape for two named statuses, where neither is on watch.
- **Mythics:** sixteen, one batch, from scratch, once the gear is placed. Not ruled yet.

## Effects that do something together

Seen while placing answers, and told to the director at the time. The only record of which effects meet.

- Party Blur, the opening again on a kill, and any "on a dodge" Great: every kill re-Blurs the party, and each Blur spent sets off a dodge.
- Crits ×4 with Chill from max HP: a wall's crits freeze.
- The two-seats-swing-the-third formation with the ×3 swing that Stuns, or with "never makes a basic attack, Defense ×2": the price costs nothing in that seat.
- The one-Shield formation with the Shield that sends back ×2 and the piece that takes every ally's Shield.
- The pile with Shock from casting: a long cast puts the whole field's charge on one foe.
- The pile with Chill: a wearer's wide Chill gathers on the coldest foe, so foes shatter one after another.
- Chill from statuses with overheal as a Shield: every heal past full is a Shield laid, so a healer freezes foes by healing.
- Chill from statuses with Might when a foe is Stunned, on one unit: a shatter Stuns, the Stun gives Might, the Might lays more Chill.
- Cooldowns from an ally's cast, on two units: each readies the other, and only mana stops them. Beside the Conductor: its casts feed the Soloist's mana, and the Soloist's casts ready it. In the Cathedral, the Voices are readied with no mana to cast.
- Burn from the first-slotted ability in the Soloist's seat: Burn on every cast. With the pile, a wide first ability's Burn lands on one foe; with mana from the foes' debuffs, the fire helps pay for itself.
- Attack for HP missing with more max HP as the fight starts: current HP stays put, so the gap is missing HP and becomes Attack at once, and again on each kill when the opening repeats. With the knockout survived at 1 HP: Hidden, with nearly all of the bonus.
- HP into MP with damage that hits MP in place of HP: the mana is the body, so the trade costs little. It also sends its wearer into the next fight hurt, which Attack for HP missing reads.
- Burn from the first-slotted ability with Chill from statuses: Burn on an ally is a status laid on its own side, so a first-slotted buff burns an ally and chills a foe.
- The paying formation with the Great that heals an ally when another pays HP: the first seat heals the party by acting.
- Mana while Hidden with the knockout survived at 1 HP: a second wind, once a fight, out of reach.
- A Stunned foe is Marked, with Might when a foe is Stunned: one Stun loads the blow and aims it. With the ×3 swing that Stuns, the swing Marks its own target; with any shatter, the party's swings pile onto the frozen foe.
- Might, Shock and Chill from one wind-up: with Shock from casting and Chill from statuses laid on its own side, every tick of a long cast lays Shock on every foe, Might on the caster and Chill on the coldest foe. Three effects on one caster's wait.
- Might from a wind-up with the Great that doesn't spend Might on swings: what the cast built stays. With Twins or the shared-status Great, each tick's Might goes to a second unit.
- Hidden from Guard with mana while Hidden: a Knight's Fortify on the lowest ally hides a hurt caster and refills it. With Twins, one Guard hides two, and the third stays in the light.
- Heat's rule with damage that hits MP in place of HP: no HP lost while the mana holds, so no Heat lost. With any Shield holder, the same.
- Double strike from Sunder on a Monk: its second strikes add Sunder, so it feeds itself; with the two extra-strike pieces, the strikes chain.
- The wide seat with the pile: a status aimed at one foe lands on every foe and gathers on one. With Shock from wide abilities, every ability the seat casts lays Shock. With Chill from statuses, one buff is three applications. A Monk in the seat Sunders the whole pack, which Double strike from Sunder counts.
- The narrow seat with a Mark: if a narrowed action picks at random, the Mark takes it, and the party's wide spells land on the Marked foe.
- Half its Defense into Attack with Defense for wearing no armor: the amulet gives both. Under the Bannerman, a Bearer turns the Banner's Defense into Attack. With the two Greats that read the top-Attack ally, a wall can be that ally.
- The two half-Defense pieces together: a quarter of its Defense, harder and faster swings.
- One amulet for three with Defense for wearing no armor: the whole party gains it. Any amulet's start-of-fight effect happens three times, and again when a foe falls.
- More stacks with nearly everything that lays or counts stacks: the pile, mana from the foes' debuffs, Double strike from Sunder, Might from a wind-up. Its halved hits cost nothing where the damage is the status's own.
- Two pieces now halve hits for something else: this one, and the Great with +50% Crit chance (only its hits that don't crit).
- The no-front formation with Hidden from Guard: with no Taunt, a Bramble knight's Thicket hides it.
- The no-front formation with the piece that strikes back when hit: all three answer.
- Striking back when hit with the ×3 swing that Stuns: every attacker is Stunned, and a share can't size a Stun. Left as it is: two particular pieces, and a boss resists. Watch it in simulation, and go back to the director before changing it. With "never makes a basic attack, Defense ×2": a wall that only answers.
- Paying HP to Silence with a Silenced foe counting as a foe falling: each foe's cast is the party's opening again. With the Great that heals another ally when one pays HP: every Silence is a heal.
- The tripled wind-up with Might and Shock on every tick of one: three times each from every cast. With the piece that strikes back when hit: hit mid-cast, it answers, and with the swing that scales from Thorns that answer is sized by the Thorns it holds while winding up. Three pieces.
- Casting twice with the Great that makes every other ability free: the second cast costs nothing. With Crescendo, Burn from the first-slotted ability and Shock from wide abilities: each happens twice a cast.
- Might for the fire with the pile: one foe's fire stands highest, so the Might does. With the Great that doesn't spend Might on swings: it stays when the fire sags.
- Damage carried past a kill with the Great that repeats the opening: each foe felled on the way fires the openers.
- Shared passives with a doubled passive: read as doubling only the wearer's own.
- The Shock and Bleed shape with Shock from casting or from wide abilities: any Shock becomes Bleed. With crits setting a hit's triggers off 4 times: one crit lays Shock 4 times.
