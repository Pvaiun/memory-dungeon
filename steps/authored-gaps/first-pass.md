# The first pass

A draft, made by the agent in one sitting to test a way of tracking the web (`report.md`, ruling 23). It isn't the catalog, and nothing here is the director's. Check each row against the effect's own words before it goes into `web.md`; the effects' names are shortened here.

## The threads

The first 27 are the table in `docs/gear-design/builds.md`, Threads the builds share, with Defense and Guard split in two. The rest are the agent's, added because effects in the web give or want them.

| Thread | From | Gives | Wants |
| --- | --- | --- | --- |
| The draw | The builds page | 7 | 0 |
| Shield | The builds page | 5 | 6 |
| Defense | The builds page | 5 | 3 |
| Guard | The builds page | 0 | 1 |
| Might | The builds page | 7 | 5 |
| Speed, more swings | The builds page | 4 | 7 |
| What a swing carries | The builds page | 6 | 4 |
| Extra strikes | The builds page | 9 | 2 |
| Crits | The builds page | 2 | 5 |
| Stun | The builds page | 1 | 3 |
| Cooldowns, more casts | The builds page | 8 | 9 |
| MP | The builds page | 9 | 4 |
| HP paid or held low | The builds page | 7 | 4 |
| Heals | The builds page | 7 | 3 |
| A kill | The builds page | 1 | 3 |
| Spread | The builds page | 6 | 1 |
| The Mark, the pile | The builds page | 4 | 3 |
| Seek and reach | The builds page | 0 | 0 |
| The fight's start | The builds page | 1 | 8 |
| Bleed | The builds page | 3 | 5 |
| Burn | The builds page | 3 | 6 |
| Chill | The builds page | 5 | 5 |
| Shock | The builds page | 4 | 7 |
| Sunder | The builds page | 1 | 4 |
| Weaken | The builds page | 0 | 0 |
| The dodge | The builds page | 2 | 5 |
| Lifesteal | The builds page | 1 | 1 |
| A wind-up | The agent's | 2 | 2 |
| Hidden | The agent's | 2 | 2 |
| Max HP | The agent's | 2 | 6 |
| The first-slotted ability | The agent's | 0 | 4 |
| Silence | The agent's | 1 | 1 |
| Thorns | The agent's | 1 | 1 |
| Given to an ally | The agent's | 13 | 1 |
| A passive | The agent's | 2 | 2 |
| What's worn | The agent's | 0 | 4 |
| Heat | The agent's | 2 | 0 |
| Slow | The agent's | 1 | 0 |
| Attack | The agent's | 7 | 3 |
| A fall softened | The agent's | 4 | 0 |
| A foe acting | The agent's | 0 | 2 |
| A blow taken | The agent's | 0 | 8 |
| Between fights | The agent's | 0 | 1 |

- **Every unit has them, so they link everything:** speed, cooldowns, Attack, and something given to an ally. The first pass left them out when it counted links.
- **A blow taken** was read as fed by the draw.

## What each effect wants and gives

In the catalog's order.

| Effect | Wants | Gives |
| --- | --- | --- |
| Damage hits MP in place of HP | MP, A blow taken | — |
| Overheal becomes a Shield on itself | Heals | Shield |
| Attack lent to the weakest ally | The fight's start, Attack | Given to an ally, Attack |
| Crits heal the lowest ally | Crits | Heals |
| Abilities from the top ally's Attack | Attack, Given to an ally | — |
| Crescendo on each cast | Cooldowns, more casts | — |
| On a dodge: the hit lands on another foe | The dodge | — |
| Readies the top-Attack ally's slowest ability | The fight's start, Attack | Cooldowns, more casts, Given to an ally |
| Abilities from Defense | Defense | — |
| Every other ability free | Cooldowns, more casts | MP |
| While Hidden: hits ×2 | Hidden | — |
| An ally's price heals another | HP paid or held low | Heals |
| On a dodge: strikes the attacker | The dodge | Extra strikes |
| A status given to itself, shared with the lowest ally | Might | Given to an ally, Might |
| A knockout survived at 1 HP, Hidden | A blow taken | A fall softened, Hidden, HP paid or held low |
| No offhand: Evasion and harder swings | What's worn | The dodge |
| Swings don't spend Might | Might | — |
| Every other ally's Shields go to it | Shield | Shield |
| Max HP and max MP trade places | Max HP, MP | MP, Max HP |
| A broken Shield sends back ×2 | Shield, A blow taken | — |
| Never swings, Defense ×2 | — | Defense |
| Abilities deal more per Shock | Shock | — |
| A foe falls: the party's opening again | A kill | The fight's start |
| Stunned at the start, then everything ready and Hasted | The fight's start | Cooldowns, more casts, Speed, more swings |
| Extra strikes roll Double strike again | Extra strikes | Extra strikes |
| Swings add half the party's Shield | Shield, Speed, more swings | — |
| A heal becomes the healed ally's next hit | Heals | Given to an ally |
| +50% Crit chance, other hits halved | — | Crits |
| Swings add Chill from max HP | Max HP, Speed, more swings | Chill, What a swing carries |
| Abilities free under Clarity | — | MP |
| Its overheal becomes a Shield on the healed ally | Heals | Shield |
| On a dodge: the next swing at once, 2 times | The dodge | Extra strikes |
| Half-HP start, Lifesteal ×2 | The fight's start, Lifesteal | HP paid or held low, Lifesteal, Heals |
| Swings 50% as often, ×3 and a Stun | — | Stun |
| On a dodge: Heat, lost when it loses HP | The dodge | Heat |
| Held at 50% HP for +50% | — | HP paid or held low |
| Swings paid in HP | Max HP | HP paid or held low |
| Swings deal more per Shock | Shock, Speed, more swings | — |
| A heal on every cast | Cooldowns, more casts | Heals |
| Swings only when a foe acts | A foe acting | — |
| Hits deal more per different debuff | Burn, Chill, Shock, Bleed, Sunder | — |
| Icefall, Rime: abilities add more Chill | Cooldowns, more casts | Chill |
| Icefall, Sleet: swings add a Chill | Speed, more swings | Chill, What a swing carries |
| Icefall, Breaker: a shatter readies its first-slotted ability | Chill, The first-slotted ability | Cooldowns, more casts |
| The cathedral, Soloist: first-slotted ability has no cooldown | The first-slotted ability, MP | Cooldowns, more casts |
| The cathedral, Voice: its MP goes to the Soloist; a Shield when the Soloist casts | Cooldowns, more casts | MP, Given to an ally, Shield |
| The standard: Followers' swings carry what the Lead's carry | What a swing carries | What a swing carries, Given to an ally |
| Glass and stone: one deals and takes ×2, two draw | — | The draw |
| Twins: what a Twin gives itself, the other gains | Might | Given to an ally, Might |
| Bannerman: one never acts, the others gain its Attack and Defense | — | Given to an ally, Attack, Defense |
| The shepherd: takes the hits meant for the lowest ally | HP paid or held low | The draw, A fall softened |
| Warden: a hit on the Anchor heals it from the Warden's max HP | A blow taken, Max HP | Heals, Given to an ally |
| Peak: hits land twice while every ally holds a Shield | Shield | Extra strikes |
| Torch: a fallen foe's Burn passes on | A kill, Burn | Burn, Spread |
| Conductor: each cast feeds the Soloist's mana | Cooldowns, more casts | MP, Given to an ally |
| Well: draws more; blows taken feed the Soloist's mana | A blow taken | The draw, MP, Given to an ally |
| Lifeline: takes half of what the Anchor takes | A blow taken | The draw, A fall softened |
| Regains MP for each stack of any debuff on the foes | Burn, Chill, Shock, Bleed, Sunder | MP |
| Damage statuses it lays go to the foe holding the most | Burn, Bleed, Shock, Chill | The Mark, the pile |
| Every tick of its wind-up lays Shock on every foe | A wind-up | Shock, Spread |
| Any ability landing on more than one unit lays Shock on every foe | Spread, Cooldowns, more casts | Shock, Spread |
| On a dodge: heals a share of the blow | The dodge | Heals |
| On a crit, whatever the hit sets off happens 4 times | Crits, What a swing carries | What a swing carries |
| At fight start: more max HP | The fight's start | Max HP |
| At fight start: Might | The fight's start | Might |
| At fight start: Blur on every ally | The fight's start | The dodge |
| Defense while it wears no armor | What's worn | Defense |
| At fight start: a Mark on the foe with the least max HP | The fight's start | The Mark, the pile |
| Formation: the third seat basic attacks whenever either other acts | Speed, more swings | Extra strikes |
| Formation: one seat holds triple the Shield and draws; the others hold none | Shield | Shield, The draw |
| Its extra strikes set off what a basic attack sets off | Extra strikes, What a swing carries | What a swing carries |
| Each status it lays on its own side adds Chill to the coldest foe | Might, Shield | Chill |
| When another ally casts: cooldown comes off its abilities | Cooldowns, more casts | Cooldowns, more casts |
| When a foe is Stunned: gains Might | Stun | Might |
| A Stun it lands leaves Slow behind | Stun | Slow |
| When a fight is won: half its HP for MP | Between fights | MP, HP paid or held low |
| Its first-slotted ability adds Burn to every target | The first-slotted ability, Cooldowns, more casts | Burn |
| Attack for the HP it is missing | HP paid or held low, Max HP | Attack |
| While Hidden: regains MP every tick | Hidden | MP |
| Formation: one pays HP per action, one raises it, one gains Attack for HP missing | HP paid or held low, Max HP, Speed, more swings | HP paid or held low, A fall softened, Attack |
| Its hits add Bleed to a Marked foe | The Mark, the pile | Bleed, What a swing carries |
| Its hits on a Marked foe also land on another foe | The Mark, the pile, What a swing carries | Spread, Extra strikes |
| When a foe is Stunned and no foe is Marked: it is Marked | Stun | The Mark, the pile |
| Hits deal more for each share of HP the target is missing | The Mark, the pile | — |
| When a foe is Silenced: "when a foe falls" effects happen | Silence | A kill |
| Becomes Hidden whenever it gains Guard | Guard | Hidden |
| Every tick of its wind-up gives it Might | A wind-up | Might |
| On a crit: Heat | Crits | Heat |
| Double strike for each stack of Sunder on the foes | Sunder | Extra strikes |
| Half its Defense becomes Attack | Defense | Attack |
| Applies more stacks of any status it applies, hits deal half | Burn, Chill, Shock, Bleed, Sunder, Might | Burn, Chill, Shock, Bleed, Sunder, Might |
| Half its Defense for faster basic attacks | Defense | Speed, more swings |
| Formation: two-handers swing ×2 half as often, one-handers half twice as often | What's worn | Speed, more swings, Extra strikes |
| Formation: crits: one draws, one's crits raise party Crit damage, one crits more | Crits | Crits, The draw |
| Formation: the third seat's amulet is worn by all; stats for an empty amulet slot | What's worn | Given to an ally, Attack, Defense |
| Formation: wide seat and narrow seat | — | Spread, The Mark, the pile |
| Damage left over from a kill carries into another foe | A kill | Spread |
| Pays HP to Silence a foe that starts a wind-up | A foe acting | Silence, HP paid or held low |
| Cooldown for each ability it has slotted | — | Cooldowns, more casts |
| Wind-ups ×3 long; Thorns and Aggro while winding up | — | A wind-up, Thorns, The draw |
| Wind-ups ×2 long; each ability cast twice for twice the mana | MP | A wind-up, Cooldowns, more casts |
| Each time a foe's Burn ticks: Might for every 10 Burn | Burn | Might |
| When hit: strikes the attacker with a basic attack | A blow taken | Extra strikes |
| Its basic attacks scale from Thorns | Thorns, Speed, more swings | — |
| Doubles the effect of its wearer's passive | A passive | A passive |
| Formation: no front; when hit: an ability nearer, Defense, Attack | A blow taken, The first-slotted ability | Cooldowns, more casts, Defense, Attack |
| Formation: two seats hold each other's passive | A passive | A passive, Given to an ally |
| Formation: Shock damage becomes Bleed; crits lay Shock; healed when Bleed pays | Shock, Crits, Bleed | Bleed, Shock, Speed, more swings, Heals |
