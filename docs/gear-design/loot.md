# Gear design: the loot

The rules the loot is made by: what each rarity is, how much there is, how commons and uncommons are written, the words and rules the cards lean on, and what formations, upgrades and mythics may do. The philosophy behind them is in *Gear design: philosophy*, and the builds they serve in *Gear design: the builds*. The slots, the kinds and who wears what are under Gear in *Core set: rules and vocabulary*; how loot is offered in a run is in *Core set: the rogue mode*.

The loot is made from the nine builds. Every piece, formation, upgrade and mythic is data with its card text and its Serves line: `content/core-set/pieces/` (six shares, the helpers in `kit.ts`, the counters in `shared.ts`), `formations.ts` and `formations/`, and `upgrades/` (the mythics are in `upgrades/mythics.ts`). `npx tsx tools/gear-slots.ts` counts who shares which kinds, `npx tsx tools/piece-check.ts` checks that every item does what its card says, and `npx tsx tools/loot-list.ts` lists every item as one line with its card.

## Rarity

Rarity is specificity, not size: how far a piece bends the game. A rare can be bigger than a legendary for the build it serves. Power by act comes from the offers (later acts roll more rares and legendaries), never from per-act versions of a piece.

| Rarity | What it is | Stats | Effect |
| --- | --- | --- | --- |
| **Common** | Fills a slot and carries a build's first stats. | One step as the standard, two on a rich kind (`KIND_BUDGET`). A special stat at medium is a step, at high two. | None. |
| **Uncommon** | A build's first rung: a simple effect most runs find. | Two steps as the standard, one on a lean kind, three on a rich one. | One simple, general effect on a thread (a rider, a start-of-fight status, a reaction), with no condition on a class, sized so it's seen the first time it fires. Each one helps two to four builds a little. |
| **Rare** | A build's second rung: specific, often conditional. | Three steps as the standard, two on a lean kind, four on a rich one, beside the effect. | One designed effect, worth a lot to one or two builds and little elsewhere. |
| **Legendary** | A build's far end, or an exotic: it bends a rule. | Four steps as the standard, three on a lean kind, five on a rich one, beside the effect. With the mythic, the only rarity where a special stat is high. | A rule change, a new trigger or a payoff that grows. Strong where it fits; where it's strong in many places, it gives something up. |
| **Mythic** | Rewrites one class, past any one ability. | A legendary's, beside the effect. | One per class (see Mythics). |

Every piece carries stats at every rarity, each rarity up to the legendary carries a step more than the last, and higher rarity is generally better: a rare, legendary or mythic carries its steps beside its effect, not instead of it. A weapon kind's budget word moves the ladder a step down or up (*Core set: rules and vocabulary*, Weapons); armor, offhands and amulets take the standard ladder. A piece's stats lean to its kind's profile, the signature first. The content checks every piece against its budget as the pack is built. The stats are shown as values beside the piece's name; the card's words are its swing trade and its effect, never its stats.

- **No random affixes,** at any rarity: every piece is fixed. Tempering turns a piece into one of the next rarity, in the same kind, that fits the same wearer.
- **No piece says what it's for.** Which builds, rungs and engines an item serves is the designer's: its Serves line, gathered as `SERVED` (`content/core-set/pieces/index.ts`), never on a card. Offers aren't aimed by it yet: the first playtest rolls them without it.
- **An uncommon never carries a rare's effect at a smaller size** in the same kind: the best choices are between builds, not between a small and a big version of one thing.
- **Two-handers** (bow, great weapon, staff) are worth a weapon and an offhand: the great weapon and the staff take both sides of the swing trade (a heavy swing or the most stats, and a rich budget), and their rares and legendaries pair two effects or carry a bigger one. The bow is the exception: a heavy, Attack-heavy swing at a one-hander's budget, and the marksman pays with the offhand.

## The stock

**A cell is one kind at one rarity, and an offer picks one piece from a cell.** A cell's size doesn't change how often its kind is offered; it changes how often each piece in it is met. So:
- **A cell holds what its wearers' roads ask of it, and no more.** Uncommons and rares follow the wearers: a kind worn by three classes on seven roads gets more than one worn by two on three.
- **A first step is a thread, not a piece.** No single uncommon is met often, so each road's first step sits in seven to fifteen pieces across as many kinds.
- **Legendaries follow the far ends, not the wearers.** A lone legendary is offered every time its cell is rolled and a second one halves both, so a cell has two or three only where that many far ends or exotics belong on the kind.
- **The amulet is the exception.** It's the one slot every class wears, so it holds the any-class copy of the first steps and keystones that would otherwise be fenced into a few kinds. Its cells are the biggest, and each of its pieces the least often met for a roll of its slot.
- **An engine's keystone is a rare** wherever it's a road's second rung: rares come one a fight from floor one, and a keystone has to arrive while its other half is still close at hand. Its grown form stays legendary.

| Kind | Wears | Common | Uncommon | Rare | Legendary | In all |
| --- | --- | --- | --- | --- | --- | --- |
| Dagger | 2 | 2 | 3 | 3 | 2 | 10 |
| Fist weapons | 3 | 2 | 4 | 4 | 2 | 12 |
| Wand | 3 | 2 | 3 | 2 | 2 | 9 |
| Sword | 3 | 2 | 3 | 4 | 1 | 10 |
| Spear | 3 | 2 | 3 | 3 | 1 | 9 |
| Axe | 2 | 2 | 3 | 3 | 2 | 10 |
| Bow | 2 | 2 | 3 | 2 | 1 | 8 |
| Rune sword | 2 | 2 | 3 | 3 | 2 | 10 |
| Hammer | 3 | 2 | 3 | 2 | 1 | 8 |
| Mace | 3 | 2 | 3 | 2 | 2 | 9 |
| Staff | 3 | 2 | 3 | 2 | 1 | 8 |
| Great weapon | 3 | 2 | 3 | 3 | 2 | 10 |
| **Weapons** | | **24** | **37** | **33** | **19** | **113** |
| Plate | 5 | 3 | 4 | 3 | 3 | 13 |
| Mail | 6 | 3 | 4 | 4 | 2 | 13 |
| Leather | 6 | 3 | 4 | 5 | 2 | 14 |
| Robes | 5 | 3 | 4 | 5 | 3 | 15 |
| **Armor** | | **12** | **16** | **17** | **10** | **55** |
| Kite shield | 3 | 2 | 3 | 3 | 1 | 9 |
| Round shield | 3 | 2 | 3 | 3 | 2 | 10 |
| Horn | 2 | 2 | 3 | 2 | 1 | 8 |
| Totem | 2 | 2 | 3 | 4 | 1 | 10 |
| Relic | 2 | 2 | 3 | 2 | 2 | 9 |
| Lantern | 2 | 2 | 2 | 2 | 2 | 8 |
| Tome | 3 | 2 | 3 | 4 | 3 | 12 |
| Orb | 2 | 2 | 2 | 3 | 2 | 9 |
| Idol | 2 | 2 | 2 | 3 | 3 | 10 |
| Vial | 2 | 2 | 2 | 3 | 1 | 8 |
| Trophy | 3 | 2 | 2 | 3 | 1 | 8 |
| Bell | 3 | 2 | 2 | 2 | 1 | 7 |
| Cloak | 3 | 2 | 3 | 3 | 1 | 9 |
| **Offhands** | | **26** | **33** | **37** | **21** | **117** |
| Amulet | everyone | 10 | 7 | 10 | 10 | 37 |
| **All** | | **72** | **93** | **97** | **60** | **322** |

Plus the 12 plain weapons (the starters, and the cheapest drops) and the 16 mythics. A run sees under half of the legendaries, so two runs toward one build get there through different pieces.

## Sizes, for new pieces

The first values a new piece is written in. They aren't limits: no balancing rules are made while making content (`docs/rules.md`), and synergies may be overpowered. A build's first step is sized so it's seen the first time it fires, whatever its first value; in play, the small end of these was never seen to happen.
- **Stat steps** as gear has them (`STEP`, `HP_STEP`, `AGGRO_STEP`, `MP_REGEN_STEP`). Special stats are medium, high only on a legendary. A piece's Evasion is its own, smaller step than a class line's (`PIECE_SPECIAL`): its worth climbs steeply as it stacks. A max MP step brings an HP step beside it, over the budget (`MP_STEP_HP`): MP is worth little in a fight beside the other stats, so a mana piece's MP comes free.
- **Stacks** in the classes' words, a few, several or many, read off the applier's stat the way a kit's are. A rider on every hit is "a few" or less. A rider of a damage status adds its status's share of the word (`APPLIED`: Chill, Burn and Bleed riders are smaller than their words, since a stack of each is worth so much more than a swing); abilities keep their own sizes.
- **Damage boosts:** a small one 10% to 20%, a narrow one 30% to 50%, and "double" only on a condition a fight meets a few times.
- **Statuses keep their own numbers.** A piece decides who gets a status and when, never what it does.
- **Cooldown changes:** a few ticks, or "ready" only on a trigger a fight meets a few times (on a trigger it meets every few ticks, a shatter, half the wait).
- **Counters that grow over a fight** are capped, or grow slowly enough that a short fight and one twice as long differ by about half.

## Commons and uncommons by kind

Commons are written from a rule per kind, not designed one by one: they lean on the kind's signature stat and its common stats, the kind's profile (*Core set: rules and vocabulary*, Weapons and Gear), and carry nothing beyond their stats. Uncommons carry a road's first step, a thread rather than a piece: a status on a swing, a start-of-fight status, a reaction, sized to be seen the first time it fires. Every wearer of a kind reads its signature stat, so a kind's pieces suit each of its two or three wearers.

| Kind | Signature | Commons lean |
| --- | --- | --- |
| Dagger | Crit chance | Attack speed, Evasion, Crit damage, Attack |
| Fist weapons | Double strike | Attack speed, Lifesteal, Evasion |
| Wand | Cooldown | Cast speed, MP regen, Attack, Attack speed |
| Sword | Attack | HP, Defense, Crit chance, Aggro |
| Spear | Aggro | Defense, Attack, Crit chance, HP |
| Axe | Lifesteal | Attack, Crit damage, HP |
| Bow | Crit damage | Crit chance, Attack, Attack speed |
| Rune sword | MP regen | Cooldown, MP, HP, Siphon |
| Hammer | Defense | HP, Aggro, Crit damage, Thorns |
| Mace | HP | Defense, MP regen, Cooldown, Thorns |
| Staff | Cast speed | Cooldown, MP, MP regen, HP |
| Great weapon | Attack | HP, Crit damage, Lifesteal, Aggro |
| Plate | (by weight) | Defense, HP, Aggro, Thorns |
| Mail | (by weight) | HP, Attack, Lifesteal |
| Leather | (by weight) | Evasion, Crit chance, Accuracy, Attack |
| Robes | (by weight) | MP, MP regen, Attack, Aggro down |
| Kite shield | Defense | HP, Aggro, Thorns, Attack |
| Round shield | HP | Defense, Attack, Aggro, Crit chance |
| Horn | Aggro | HP, Defense, Attack, MP regen |
| Totem | Thorns | Defense, Aggro, HP, Attack |
| Relic | MP regen | HP, Attack, Cast speed, Defense |
| Lantern | Cast speed | Attack, MP, HP, Cooldown |
| Tome | Cooldown | Attack, MP, MP regen, Cast speed |
| Orb | MP | Attack, MP regen, Cast speed, Cooldown |
| Idol | Siphon | Attack, HP, MP, Lifesteal |
| Vial | Lifesteal | Attack, Crit chance, Crit damage, HP |
| Trophy | Crit damage | Crit chance, Attack, Accuracy, Defense |
| Bell | Attack speed | Attack, Evasion, Double strike, MP regen |
| Cloak | Evasion | Attack, Crit chance, Attack speed, Defense |
| Amulet | (everyone) | one each for a stat a road starts from: HP, Defense, Attack, Crit chance, MP regen, Evasion, Lifesteal, Thorns, Double strike, Cooldown |

## Writing cards

Every card the player reads (an ability, a passive, an upgrade, a piece, a mythic, a formation, a seat, a status) says what happens once, in the fewest words a new player can follow. Words only where a player would otherwise misread the fight.
- **Never repeat the screen.** An ability's card shows its MP, cooldown and wind-up in its head, and a size line under the text: each hit's damage, heals, Shields, MP given and stacks of a stacking status, with the stats each scales from. Its text never says a cost, a timing, a damage word (light, heavy) or a stack word, or what anything scales from; it says the action, its target, its condition, and the statuses that show no number (Stun, Guard, Taunt, Haste, Clarity and the like). A training card shows the changes in MP, cooldown, wind-up and size, so a version never mentions them. A piece's stats and swing, and a seat's stat changes, show as values, so their cards say only the effect.
- **No stack words on a card.** "A few", "several" and "many" are the documents' words, never a card's. A stacking status that grows with a stat shows as a number for the unit in view, with its stat, under the card's text: a piece, a passive and its versions, a state an ability lays, a status tapped in a fight (`heldParts` in `ui/src/describe.ts`; with no unit in view, a piece's first wearer). The text only names the status. A flat count (a seat's, a formation's, a foe's) prints its number, written from `FLAT_STACKS`. Any other amount on a card is a share of a stat it names ("5% of max HP").
- **No subject.** A card is read on its holder: it says "hits on", not "its wearer's hits on". It names a unit only when it isn't the holder.
- **The trigger first:** "On a kill:", "On a crit:", "When hit:", "At fight start:", "Below half HP:", "While Taunting:".
- **Numbers, not fractions in words:** +50%, not "half again as much"; 5% of max HP, not "a twentieth". "Double" stays.
- **One phrase for each target:** "lowest HP%" and "lowest MP%" for a share of max (the ally with the lowest HP%, the foe with the lowest HP%, the ally with the lowest MP%); "least" and "most" for an amount (the foe with the least HP, the foe with the most Attack, the foe with the most of a status, the ally with the most Aggro, the ally with the slowest basic attack); a random foe, every foe, a fallen ally. "Other" when the holder is left out. "Ignores Taunt" is Seek; "attacks at once" is a next basic attack called at once. "Effects included" is carrying what the swing carries.
- **Time in ticks:** anything on a timer says its ticks ("every 22 ticks", "for 20 ticks"), written from its constant, and a first beat that comes early says when ("the first at 11"). No "every so often", "for a while" or "for a moment"; no "a little", "faster" or "more" without its number.
- **The rules below hold without being printed.** A card leaves out what this page already rules (chains end, a redirect is final, a price never takes its payer below 1 HP, Stun holds a wind-up), and keeps only a clause that changes what the player would predict. Nothing restates a rule: no "the Shock stays" (a payoff always leaves its status, `docs/rules.md`), no "a wipe is still lost", no "as hits" on a left-over.
- **A cost stays in words** ("pays", "costs", "less", "down", "no"): the piece check reads them.
- **A power step's card** is its change in a few words. One that only moves numbers the ability's card shows (cost, cooldown, wind-up, damage, stacks) is marked `shown` in `upgrades/`, so it isn't added to the trained ability's card.

## Words the cards lean on

- **Marked** takes the party's basic attacks and its abilities aimed at a random foe (*Core set: rules and vocabulary*). A piece or a seat Marks only while no foe is Marked, so gear never adds a second Mark.
- **Affliction:** Burn, Chill, Shock, Bleed and Sunder, the debuffs that build in stacks. The Hexer's Malison does a fifth more for each different one a foe holds.
- **Six counters,** each a status of its own with one meaning, shown as an icon with a number and kept for the fight unless its card spends it, each capped (`pieces/shared.ts`). One event adds one stack to a holder, however many of its cards count it. The card says what a stack is worth, in a bracket.
  - **Cuts:** hits landed (The whetstone keeps one count for the party).
  - **Heat:** given by a card on its trigger; each stack is speed in everything.
  - **Spite:** hits taken.
  - **Wrath:** hits taken by the unit the card names; its holder's next basic attack deals more for each, and spends them.
  - **Crescendo:** one more cast of the same ability this fight, counted ability by ability; that ability deals, heals and adds more for each.
  - **Cascade:** shatters, anyone's; the party's count.
- **A hit** is damage from a basic attack or an ability. Damage sent back, Thorns and a status's own damage aren't hits, and a foe felled by them isn't anyone's killing blow.
- **An extra strike** is Double strike's second strike. A leap, a ring, a volley's arrow and Arc's second hit are extra hits with names of their own, and nothing that waits on extra strikes or basic attacks hears them.
- **"Strikes with its weapon":** a hit of its basic attack's size out of turn, in whatever shape its basic attacks have, carrying what the swing carries. It isn't a basic attack.
- **"Carrying what the swing carries":** applying the statuses its wearer's basic attack applies, from gear, a seat, a passive or a status it holds. No second target, no damage boost.
- **"Lands twice":** the same damage again on the same foe, at once unless the card says otherwise, with no new dodge or crit roll. It's a hit, carries none of the first's statuses, and is never repeated.
- **"What a killing blow has left over":** its damage past the HP its foe had left, a hit on the foe it reaches (that foe's Evasion and Defense apply), not boosted or crit again, carrying nothing. Where it lands is the card's words or a draw; a Taunt and a Mark don't steer it.
- **"As it was struck":** a blow's size after its attacker's boosts and before Defense, Guard, Aegis and Shields took their share.
- **"Sent back":** damage a foe takes from a piece or a seat for striking a unit, or when a Shield breaks. Like Thorns it isn't a hit: Evasion and Defense don't touch it, and it can't crit.
- **A pick:** a card's target phrase picks inside the Taunt rule unless it has Seek. What a piece or a seat sends to a random foe (a status, a left-over) goes by draw, and a Mark doesn't take it.
- **A crossing:** "drops below half" (or a third) fires as the unit goes under the line, whatever took it there, a price included, and as a fight starts if it starts under. "Whenever" fires again only after the unit is back at the line; "the first time each fight", once. It reads HP; a watcher of MP keeps its card's words.
- **"Start-of-fight effects":** what gear and seats do as a fight starts. Overture coat and Second dawn make them happen again, once for each kill or fall, prices and drawbacks left out. A crossing that fires as a fight starts isn't one, and neither is a formation's rule for the whole party.
- **A heal** is HP an ability or a piece restores at once; a Regen's pulses aren't unless a card names Regen. **Healing received** is all of it.
- **Paid in life:** a card that makes an ability cost HP costs half the share of max HP that the ability would cost of max MP. "Pays for" is a cost paid in MP or HP; **a free cast** costs neither and isn't paid for. HP lost to a drawback, a drain or a status isn't a price paid.
- **"Gives MP":** MP put into another ally's pool in one piece. MP that flows in over time, and what a unit gives itself, aren't gifts.
- **"Gives itself":** a status a unit's own ability, passive, gear or seat lays on that unit. One that Twins or Twin-knot passed on isn't.
- **"Its first-slotted ability":** the one the player put first, ready or not. "Its slowest ability" is by whole cooldown; "the longest cooldown left" is the most wait left.
- **"At once"** doesn't stack: a unit whose next basic attack has been called gains nothing from a second call before it lands.
- **"Every so often"** is the short cooldown word (`COOLDOWN.short`); "every few ticks" is 4. A card with its own beat prints it.
- **Stacks from a seat are flat** (`FLAT_STACKS`); stacks from a piece read the stat the card names.

## The rules the pieces bend or add

- **Alike cards.** An upgrade never copies a piece. Two pieces one unit could wear together never read the same, and "the same" is the same sentence: an engine's keystone may sit in more than one place, differing in who it lands on, when, or how wide. A piece and a formation seat may share a rule. A plain rider may sit in more than one kind when no unit could hold both, sized to each kind's swing.
- **A status on a swing is an uncommon's effect,** sized to be seen: a few a swing on a fast kind, several or many on a slow one. No rare is a rider made bigger.
- **Two swing shapes are uncommons:** Millstone and Hummingbird charm.
- **"All fight" means renewed as it runs out:** a Taunt laid again each time it ends, at its own length.
- **The last drink:** The Red Feast heals its wearer up to half its HP when a fight is won.
- **Chains end.** A repeat isn't repeated: what a piece lands, casts, copies, passes on or carries a second time is never repeated again unless its card says it runs on (Overrun, and Flurry wraps up to its count). A redirect is final: a hit taken for an ally, and a Shield, MP or healing sent on, isn't sent on again. A fallen foe's fire moves once: where two pieces or seats move the same Burn, it's split evenly between them. A chain of shatters dies down by Chill's own rule.
- **Healing past full goes one place:** the healed unit's own piece first (Red stone mail), then the healer's (Phylactery), then the formation's (Shared cup).
- **Crit:** a card that sets a chance on some hits wins over Gambler's coin; Bloodscent knife stops at 60% and The king's head at 80%.
- **Kept:** extra strikes that chain (Flurry wraps); a hit taken for an ally (Oathbound shield); effects after a won fight, before statuses end; Taunt ends Hidden.
- **Added for the engines,** each one rule on a card: a foe's swing called early; retaliation sized by the blow as it was struck; damage carried past a kill; damage taken from MP; an ability cast by a count of swings; start-of-fight effects that happen again; a status passed on by its holder; an ability brought back by the foes it hit; a swing that carries another unit's riders; a gift to oneself shared with an ally.
- **What no piece does:** grant an ability; resize a status or apply it for less or more than its own length; send a hit past Evasion or Defense; want a fall; give the party an enemy-only status; read a number the player can't see.

## Rules for writing pieces

Rules that hold for every piece, version and mythic. None of them is about balance.
- **Every uncommon carries an effect.** A special stat alone is a common's step.
- **Every piece carries its kind's budget of steps** at its rarity, a rare's or legendary's beside its effect; a piece may step along the swing trade, which its swing's values show. A stat that shapes a swing (half as often, twice as often) counts no step.
- **A mythic carries a legendary's steps,** checked as any piece's are, its stats leaning to its kind's or armor's profile, the signature first, and to what its class and its effect read.
- **A revive** brings its ally back with every ability on full cooldown, whoever revives, unless the Valkyrie's Einherjar version or a piece says otherwise.
- **Paying HP** means losing that much HP at once. It isn't damage, so no Shield soaks it and nothing reacts to it, and it can't take the payer below 1 HP.
- **Each status or counter is defined once,** for every piece that uses it (the counters in `pieces/shared.ts`; Marked in the vocabulary).
- **A card is its own spec:** its stats, its card text word for word, and its Serves line, as the content writes them.

## Formations

A formation is a shape: three seats and, if it wants, rules of its own. It gives a squad an identity. It joins the web of builds through seat roles that many builds share (*Gear design: the builds*, The web), and through an identity of its own, which is what makes it more than a sum of seats. Neutral is the start, and there are 35 more: 13 common, 12 rare and 10 legendary. Every road has one at each rarity; four commons are shared ground, and four more carry an engine, the net or an exotic. No build needs one.

**What a formation may be.** A range, not a menu: any formation takes what its shape needs.
- **What a seat can change** about the unit in it: stats and special stats; statuses, at the start or on a trigger; how the unit acts (what it aims at, how fast it acts, what it waits for); what its hits carry; how it reacts. A seat can also do nothing.
- **Seats needn't match.** One seat can hold most of the formation's power while the others serve it, two can mirror each other, one can work only through another, and one can carry a cost the others profit from.
- **Seats can depend on who sits there:** a class, a kind of weapon or armor, a kind of ability, or what another seat is doing.
- **Party effects:** always, on a condition or on a trigger; a stat, a status, or a rule that changes how the party fights. A formation can have several, or none.
- **It can give something up:** a drawback, a seat that costs, a rule that cuts both ways.
- **The words.** Every effect is phrased so the player knows what will happen, as briefly as that takes (Writing cards).

**By rarity.** Commons lean on the roles builds share and plain party effects. Rares are lopsided and read who sits where. Legendaries change how the party fights. There are no mythic formations.

## Upgrades

Every ability and passive has three upgrades: a **power step** and two **versions** (A and B), 64 abilities and passives in all.
- **The power step** is plain, more of the same: two fifths more of an amount or stacks, one cooldown word shorter, or one rung down the MP ladder.
- **The versions** are designed for that ability, with no formula across abilities. What matters is how the two differ, and either can change whom the ability aims at and when it fires, not only its numbers. A version stands on its own against the base, and the power step lands on whichever version is taken. No version copies a piece: where a version and a piece share a thread, they do it differently.
- **Training.** The power step and a version are two separate trainings, in either order. A fully trained class is eight trainings, plus learning the abilities it didn't start with, and no run trains everyone fully. A training opportunity offers three choices. Where a run's training happens is in *Core set: the rogue mode*.

## Mythics

One per class, shown in crimson and offered in the boss boons that open acts II and III. Each fits one class, in the slot named, and reaches past any one ability. Each carries a legendary's stats beside its effect, so it's never a downgrade for the stats it replaces. It pulls toward the class's roads, and a unit wears one at most. A mythic is found and can be taken off; an upgrade is trained and changes one ability or the passive. None repeats a piece or a version. What each one does is its card text, in `upgrades/mythics.ts`.

| Class | Mythic | Slot | Pulls toward |
| --- | --- | --- | --- |
| Knight | Horn of the keep | offhand (horn) | Barrage, the Toll |
| Cleric | Halo of the saint | amulet | Blood Pact |
| Ranger | Huntmaster's quiver | armor (leather) | the Hunt |
| Bramble knight | Heartwood mail | armor (mail) | the Toll, Thousand Cuts |
| Hoplite | The last wall | offhand (round shield) | the Toll, Landslide |
| Paladin | Writ of judgement | offhand (relic) | the Hunt, Bonfire, Landslide |
| Valkyrie | Stormspear | weapon (a spear's swing) | the Storm, the Hunt |
| Bard | Metronome | offhand (bell) | Thousand Cuts, Barrage, the Storm |
| Hexer | The witch-blade | weapon | Cold Snap, Bonfire, the Storm |
| Monk | Ember palms | weapon | Bonfire, Thousand Cuts |
| Assassin | Night's edge | armor | the Hunt |
| Vampire | The chalice | offhand | Blood Pact, Barrage |
| Pyromancer | Crown of embers | amulet | Bonfire |
| Frostweaver | Glacier's heart | armor | Cold Snap |
| Stormcaller | Eye of the tempest | weapon | the Storm |
| Geomancer | Mountain's crown | amulet | Landslide |

## Levers held back for balance

At the director's word, the loot was made with no balancing rules: synergies may be overpowered. These rules were proposed while it was written and withdrawn, and they're kept as levers, to reach for only if the numbers call for them. Statuses stay universal: no lever shortens or lengthens a status.
- **One swing shape per unit.** Phalanx, Millstone, Hummingbird charm, Headsman's axe, Worldbreaker and the Heavy line's Hammer each reshape a unit's basic attacks, and two shapes on one unit add up. The lever: a unit takes one shape, and each other shape on it gives a stat step instead.
- **No "many" in a single application:** one cast or hit lands at most "several", and "many" is for build-up over a fight. In use on Bloodied ground's Opener.
- **Half again in place of double** where a party can hold the condition all fight. In use on The Red Feast's hits, Twinfall's second landing and Hummingbird charm's swing.
- **A counter gains at most a stack every couple of ticks,** however many triggers fire, so against a pack it grows at a fight's pace, not a swarm's.
- **No triples** outside Worldbreaker.
- **Locks that hold a lone boss all fight** (the Withering hex version): the design's own answer is bosses that resist repeated control, which is in, not shorter locks.

## Decisions to know, and what's least sure

**Decisions in the loot that might not be expected,** each one a line to change:
- **The stock follows the roads, not even quarters:** 72 commons, 93 uncommons, 97 rares, 60 legendaries, with the plain weapons outside it.
- **Commons carry no effect,** only stats, and every rarity carries stats. Uncommons are where the first rungs live; keystones are rares.
- **An upgrade is two trainings,** the power step and the version, in either order.
- **Six counters,** each its own status.
- **No piece grants an ability,** so more abilities per class stays out.
- **A rider is a rider everywhere:** "its basic attacks add X" rides the swing on every piece, so The standard, Mimic wand, Toll gate and Echo charm read it.

**Least sure:**
- **The stock's size.** Whether a run can tell 93 uncommons apart is a question for play, and a third of the weapon uncommons are riders that read alike.
- **Tinder charm and The standard** make any party's second feeder without a second source, and may make the four status roads feel like one.
- **Keystones at rare.** If rares come to feel like the legendaries did, the far ends have less room above them.
- **The wide hits.** Five rares fan a swing out; their promise is still more foes, the promise play never took.
- **Heat as speed** feeds every status road at once.
- **The Toll is over-served:** it sits on the most doors, so it has the most second rungs.
- **The party-rule formations.** Five legendary formations and First light are a rule for the party with three plain seats; play fought in formations whose seats had roles.
- **The cathedral and The chalice** are the boldest lines: a spell with no cooldown, and one unit paying for the party's casts.
- **Loops,** each with what stops it: the emptied quiver (a crit that fails) and the resonance (a pack that thins, a pool that empties); Provoking blade with Tempest cloak (the dodge that fails); Matador's cape with a copied Taunt and Goading totem (a round with no dodge); Writ of judgement with Swift justice (its mana and wind-up); the resonance and The cathedral with their mana price gone (wind-up and recovery); Floe charm with Meltwater orb (Blizzard's wind-up, the cold running short); Everflame lantern with Bellows wraps on a fast Monk (the fight ending); The covenant with Bloodstone reliquary (cooldowns); the kill chains (the foes run out).
- **Damage sent back** is untyped, as Thorns is, so six pieces deal damage Defense doesn't touch.
- **Two cards act on what they can't tell apart:** Shatterstone charm sends back the damage when a foe's Burn empties the Shield, not only a blow; Accuser's relic counts its holder's Lifesteal as a heal it gives.
- **The versions barely change:** the loot pass changed nine of 128.
