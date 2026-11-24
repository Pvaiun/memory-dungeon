# Cards

Every card, kept as written, except 111 of the agents' cards reworded at the director's request so that each says plainly whose hits, abilities or HP it means (this unit, the unit in this seat, this ability), the content unchanged. The deck was written by agents that read only `sources/ways-to-win.md`, `vocabulary.md`, `combat.md`, `primitives.md` and `gear-rules.md`, and were told nothing of what the cards are for: the pilot's forty by one agent (P), then five working alone at once, one for each way to win (R Burst, S Build up, T Debuff or disable, V Sustain) and one for where the ways meet (W), and after the gap check a sixth for the corners the five left thin (X). The director's own cards are marked D, each in their words as they gave it in *Add a fourth*, with the triad it came from.

Each card's kind, way to win, the other ways it serves, mechanics and the building block it needs are the writer's tags, for the session's use. The page shows only the text. Cards taken out as doubles are at the end, with the card each one doubles.

## Counts

The cards in play, by the way each serves most (the director's are counted apart):

| Way | Ability | Version | Piece | Seat | All |
| --- | --- | --- | --- | --- | --- |
| Burst | 15 | 11 | 21 | 9 | 56 |
| Build up | 11 | 13 | 23 | 14 | 61 |
| Debuff or disable | 16 | 9 | 20 | 8 | 53 |
| Sustain | 17 | 11 | 19 | 16 | 63 |
| All | 59 | 44 | 83 | 47 | 233 |

By writer: what each wrote, what's in play, and what was taken out as a double.

| Writer | Ids | Wrote | In play | Taken out |
| --- | --- | --- | --- | --- |
| the pilot's | P | 40 | 40 | 0 |
| Burst | R | 50 | 37 | 13 |
| Build up | S | 53 | 42 | 11 |
| Debuff or disable | T | 55 | 35 | 20 |
| Sustain | V | 55 | 42 | 13 |
| where the ways meet | W | 50 | 26 | 24 |
| thin corners | X | 15 | 11 | 4 |
| the director | D | 14 | 14 | 0 |

**247 cards in play,** 233 written by the agents and 14 the director's.

## Burst

**P01.** The unit in this seat always crits a foe that is winding up an ability.
<br>*seat · crits by condition (when, chance); casting · in triad pilot-05*

**P02.** This ability hits a lot harder against a foe that hasn't acted yet this fight.
<br>*version · acted; scaling from a condition (when) · in triad pilot-01*

**P03.** When a fight is won, the ability this unit has first in its order comes off cooldown, ready to open the next fight.
<br>*piece · fight_won; the cooldown effect (first, ready); cooldowns carry between fights · in triad pilot-09*

**P04.** When this unit's hit knocks a foe out, whatever that blow had left over strikes another random foe.
<br>*piece · ko (amount left over past the target's HP); strike (a blow carried past a kill) · not yet in a triad*

**P05.** Pays half this unit's current HP, then hits a foe for a great deal more than the HP it paid.
<br>*ability · pay (an HP price); cost (what this action paid) · in triad pilot-01*

**P06.** This unit's damaging abilities wait for one another: once all are ready, they go off together and only one is paid for.
<br>*piece · ability changes: together; of: does damage · in triad pilot-05*

**P07.** After its hits, this ability knocks out every foe left with only a small share of its HP.
<br>*version · fell; a targeting rule (foes, where hpBelow, pick all) · in triad pilot-09*

**P08.** While this unit holds Haste, each of its abilities that deals damage goes off a second time at once, free.
<br>*piece · recast (free unless paid); Haste; action_resolve (repeat: false) · in triad pilot-09*

**P09.** Marks the foe with the lowest current HP and hits it, harder the more HP it is missing.
<br>*ability · Marked; the foe with the lowest current HP; a scale reading missing HP · in triad pilot-05*

**P10.** The unit in this seat keeps swinging its basic attack through its own wind-ups and recoveries.
<br>*seat · tireless; wind-up, cooldown and recovery · in triad pilot-01*

**R01.** This unit gains a lot of Might, and its next ability is ready at once.
<br>*ability · Might; cooldown: soonest, ready · writer: Burst · not yet in a triad*

**R02.** Gives every ally Haste. It has a long cooldown.
<br>*ability · Haste; every ally; cooldown: long · writer: Burst · also Build up · in triad b1-13*

**R03.** Readies the ability with the most cooldown left on the other ally with the highest Attack.
<br>*ability · cooldown: longest, ready; targeting rule: others, highest by attack · writer: Burst · not yet in a triad*

**R04.** Makes every foe Brittle, so the next hit on each one crits.
<br>*ability · Brittle; every foe · writer: Burst · not yet in a triad*

**R06.** Strikes a foe several times, each strike adding Sunder, so each lands harder than the last.
<br>*ability · Sunder; each hit of a multi-hit ability is a separate hit; a hit's own statuses land after the hit · writer: Burst · also Debuff or disable · in triad b1-03*

**R07.** Strikes the foe with the most Bleed many times in a row, for a little each.
<br>*ability · Bleed; the foe with the most (by stacks); hits · writer: Burst · also Build up · in triad b1-01*

**R09.** Strikes the foe with the highest current HP for a share of its current HP.
<br>*ability · pick: highest, by hp; scale: hp (current) of target · writer: Burst · in triad b1-14*

**R10.** Hits every foe, harder on each the more foes it hits.
<br>*ability · Area; count: targets · writer: Burst · in triad b1-19*

**R12.** Strikes a random foe with a buff, harder for each buff it holds, then removes its buffs.
<br>*ability · a random foe with a buff; count: buffs; Dispel · writer: Burst · also Debuff or disable · not yet in a triad*

**R13.** Strikes the foe with the most debuffs, harder for each debuff it holds.
<br>*ability · mostDebuffs; count: debuffs · writer: Burst · also Debuff or disable · not yet in a triad*

**R14.** Waits until this unit is below half HP, then swaps HP shares with the foe with the highest current HP. It has a very long cooldown.
<br>*ability · trade; hpBelow; pick: highest, by hp · writer: Burst · also Sustain · not yet in a triad*

**R16.** This ability winds up in a moment, but deals a little less.
<br>*version · mods: cast ("winds up in a moment"); mods: damage · writer: Burst · in triad b1-19*

**R17.** This ability has no cooldown, but costs much more MP.
<br>*version · mods: cooldown ("none: it's cast again whenever it can be"); mods: mp · writer: Burst · not yet in a triad*

**R19.** This ability comes round a little sooner for each foe its hits land on.
<br>*version · cooldown: lessPct; count: hit · writer: Burst · in triad b1-01*

**R21.** This ability's first hit makes its foe Brittle, so the hit after it crits.
<br>*version · Brittle; a hit's own statuses land after the hit · writer: Burst · not yet in a triad*

**R22.** This ability deals much more, but its cooldown is much longer.
<br>*version · mods: damage; mods: cooldown · writer: Burst · in triad b1-14*

**R23.** This ability goes to a Stunned foe when there is one, and deals much more to it.
<br>*version · has: Stun; ifNone; when · writer: Burst · not yet in a triad*

**R25.** This ability hits every foe instead of one, for a little less on each.
<br>*version · Area; every foe · writer: Burst · in triad b1-04*

**R26.** This unit starts each fight with all its abilities at least half charged.
<br>*piece · fight_start; cooldown: atMost ("at least half charged") · writer: Burst · not yet in a triad*

**R27.** This unit's hits always crit a foe that is still at full HP.
<br>*piece · crits: when (hpAtLeast); crits: chance ("it always crits") · writer: Burst · not yet in a triad*

**R28.** This unit's ability hits always crit, and its basic attacks never do.
<br>*piece · crits: tag ability, chance; crits: tag basic, set · writer: Burst · in triad b1-04*

**R29.** When this unit knocks a foe out, its ability with the most cooldown left is ready.
<br>*piece · ko; cooldown: longest, ready · writer: Burst · not yet in a triad*

**R31.** When this unit knocks a foe out, the start-of-fight effects of its gear and seat happen again.
<br>*piece · ko; restart · writer: Burst · not yet in a triad*

**R32.** This unit strikes every foe at the start of each fight.
<br>*piece · fight_start; strike ("a hit out of turn") · writer: Burst · not yet in a triad*

**R35.** When this unit crits a foe, that foe becomes Brittle, so the next hit on it crits too.
<br>*piece · hit_lands, tag crit; Brittle · writer: Burst · not yet in a triad*

**R36.** When an ally crits a foe, this unit strikes that foe out of turn.
<br>*piece · hit_lands, whose ally, tag crit; strike · writer: Burst · in triad b1-01*

**R37.** When a foe's Shield soaks part of this unit's hit, this unit strikes that foe again for what was soaked.
<br>*piece · hit_lands: stopped ("what the target's Shield soaked"); strike · writer: Burst · **needs a new block:** a reaction filter on a hit's stopped part (some was soaked), so no empty strike follows a hit that nothing soaked · not yet in a triad*

**R38.** Each time this unit dodges a hit, its next ability comes a good way closer.
<br>*piece · hit_evaded; cooldown: soonest, lessPct · writer: Burst · also Sustain · in triad b1-13*

**R39.** When this unit's Shield breaks, this unit deals damage to every foe for a share of the most the Shield held.
<br>*piece · status_ended, cause stacks ("the most an absorb held when damage emptied it"); Shield · writer: Burst · also Sustain · in triad b1-03*

**R41.** This unit's first ability each fight goes off a second time at once, free.
<br>*piece · action_resolve, repeat: false; recast; marker ("once a fight") · writer: Burst · not yet in a triad*

**R43.** The unit in this seat starts each fight with a lot of Might.
<br>*seat · fight_start; Might · writer: Burst · in triad b1-14*

**R44.** After each ability of the unit in this seat, its basic attack is ready at once.
<br>*seat · action_resolve, kind ability; cooldown: basic, ready · writer: Burst · not yet in a triad*

**R46.** The unit in this seat has much more Cast speed and Cooldown, but a lot less max HP.
<br>*seat · Cast speed; Cooldown; max HP · writer: Burst · not yet in a triad*

**R47.** The unit in this seat starts each fight Hidden, and its hits deal much more while it's Hidden.
<br>*seat · Hidden; boosts; when (has Hidden) · writer: Burst · also Sustain · in triad b1-04*

**R48.** When any foe's Chill shatters, the next ability of the unit in this seat is ready.
<br>*seat · status_capped ("Chill's shatter"); cooldown: soonest, ready · writer: Burst · also Build up · in triad b1-03*

**R49.** When an ally gains Might, the unit in this seat gains the same Might.
<br>*seat · status_gained, whose ally; share · writer: Burst · in triad b1-13*

**R50.** When the unit in this seat drops below half HP, all its abilities are ready.
<br>*seat · hp_low (line); cooldown: abilities, ready · writer: Burst · not yet in a triad*

**W05.** This ability resolves again at once, for free, when its user holds a lot of Might.
<br>*version · recast, Might, stacks · writer: where the ways meet · also Build up · not yet in a triad*

**W11.** This unit's hits deal extra damage equal to a share of the Shield it holds.
<br>*piece · adds, Shield, stacks · writer: where the ways meet · also Sustain · not yet in a triad*

**W17.** Damage from hits on this unit is held and lands all at once a while after the first; until it lands, this unit's hits deal more the more damage is held.
<br>*piece · Owed, debt, boosts · writer: where the ways meet · also Sustain · not yet in a triad*

**W20.** This unit's hits are a little more likely to crit for each debuff their target holds.
<br>*piece · crits by condition, count (debuffs) · writer: where the ways meet · also Debuff or disable, Build up · in triad b1-19*

**W25.** Knocks out at once a Stunned foe below a small share of its max HP, past any Taunt. Waits until there is one; long cooldown.
<br>*ability · fell, Stun, Seek · writer: where the ways meet · also Debuff or disable · not yet in a triad*

**X01.** Gives Haste for a while to every other ally that wields the same kind of weapon as this unit.
<br>*ability · kin: "Wields a weapon of the reading unit's kind"; Haste: "Shorter cooldowns, wind-ups and time between attacks"; a targeting rule's `where` · writer: thin corners · also Build up · not yet in a triad*

**X06.** If this ability lands the blow that wins a fight, it starts the next fight ready.
<br>*version · fight_won: "the moment the last foe falls, before statuses end"; cooldown set ready: "Ready now: no cooldown left"; "Cooldowns carry between fights" · writer: thin corners · **needs a new block:** a fight_won filter that names the ability whose hit felled the last foe, as ko's `ability` filter does · not yet in a triad*

**X08.** When one of this unit's basic attacks strikes twice, the second strike always crits.
<br>*piece · Double strike: "Chance a basic attack hits twice"; crits by condition: `tag` extra, `chance` 100: "it always crits"; "Crits land before Defense, so big crits get through it" · writer: thin corners · not yet in a triad*

**X14.** When an ally drops below half HP, the foe that last hit it becomes Marked.
<br>*piece · Marked: "the party's basic attacks ... pick a Marked foe while it lasts"; hp_low: "Its HP goes under a line"; assailant: "the unit that last hit the unit the event is about" · writer: thin corners · also Sustain · not yet in a triad*

## Build up

**P11.** When Chill from this unit makes a foe shatter, every other foe gains a little Chill.
<br>*piece · status_capped (where Chill shatters); damp and passed · not yet in a triad*

**P12.** This ability adds more Burn the more Burn its target already holds.
<br>*version · Burn; a scale reading the target's stacks · in triad pilot-07*

**P13.** Lays a lot of Shock on the foe with the fastest basic attack and on the foe with the slowest.
<br>*ability · Shock; by swing (the basic attack's interval now) · in triad pilot-02*

**P14.** This ability adds a stack of Sunder for each debuff its target already holds.
<br>*version · Sunder; a scale's count: debuffs · not yet in a triad*

**P15.** While this unit is below half HP, its abilities add a lot more stacks of everything they lay.
<br>*piece · ability changes: stacks; if, with hpBelow · not yet in a triad*

**P16.** This unit's extra strikes, such as Double strike's second hit, count as basic attacks for everything its basic attacks lay on foes.
<br>*piece · echo; extra strikes; Double strike · in triad pilot-02*

**P17.** Whenever the unit in this seat gains Might, every other ally gains as many stacks.
<br>*seat · share (reactions to status_gained); Might · in triad pilot-02*

**P18.** Each time a foe hits another ally, that foe gains whatever the basic attacks of the unit in this seat lay on a foe.
<br>*seat · the riders effect; hit_taken (whose: ally) · in triad pilot-07*

**P19.** Each time Bleed on any foe deals its damage, the next ability of the unit in this seat comes a little closer.
<br>*seat · status_triggered; Bleed; the cooldown effect (soonest, less) · in triad b1-05*

**P20.** Once the fight has gone on long enough to enrage, this unit's abilities wind up in a moment.
<br>*piece · enrage; ability changes: cast (winds up in a moment) · **needs a new block:** a condition that reads whether the fight has enraged · in triad pilot-07*

**S02.** Deals damage to the foe with the most Burn, more for each Burn stack it holds. The Burn stays as it was.
<br>*ability · stacks; a payoff reads the stacks and leaves them; The foe with the most Burn · writer: Build up · not yet in a triad*

**S03.** Hits every foe, dealing more for all the Chill the foes hold between them.
<br>*ability · Area; count { side, where } with stacks (the total of that status's stacks across them); Chill · writer: Build up · not yet in a triad*

**S05.** Strikes a foe several times in quick succession, each hit adding Bleed. Each hit after the first sets off the Bleed the hit before it left.
<br>*ability · Each hit of a multi-hit ability is a separate hit; Bleed; A hit's own statuses land after the hit · writer: Build up · also Burst · in triad b1-15*

**S07.** Adds an affliction, picked at random, to every foe.
<br>*ability · one (picked at random on the actor's dice); affliction; Every foe · writer: Build up · not yet in a triad*

**S08.** Knocks out a foe below half its HP that holds every affliction. It waits until there is one.
<br>*ability · fell; has (every one of these); hpBelow · writer: Build up · also Burst · in triad b1-23*

**S10.** Adds a lot of Sunder to the foe with the highest current HP.
<br>*ability · Sunder (stacks up to a cap); highest, by: hp · writer: Build up · in triad b1-05*

**S11.** Strikes the foe this unit has struck most this fight, dealing more for each time it has struck that foe.
<br>*ability · marker (bookkeeping such as "already hit by it"); stacks; highest by { stacks } · writer: Build up · also Burst · in triad b1-16*

**S12.** Gives the ally with the highest Attack a stack of Might for each foe holding an affliction.
<br>*ability · Might; count { side, where }; The ally with the highest Attack · writer: Build up · not yet in a triad*

**S13.** Brings each ally's next ability a little closer for each foe holding an affliction.
<br>*ability · cooldown (soonest; lessPct: a number, so it can count); count { side, where }; Every ally · writer: Build up · also Burst · not yet in a triad*

**S14.** This ability now lands on every foe instead of one: each takes a share of its damage, but every status it carries lands in full.
<br>*version · spread; a status carried by a hit lands in full, whatever Defense takes off the hit · writer: Build up · not yet in a triad*

**S15.** A foe that shatters from this ability's Chill is left holding some Chill afterwards.
<br>*version · status_capped; Chill (at the cap it shatters); marker · writer: Build up · also Debuff or disable · not yet in a triad*

**S16.** This ability deals a little more each time it's cast in a fight, up to a limit.
<br>*version · action_resolve; Intensity cap; stacks · writer: Build up · in triad b1-05*

**S17.** This ability now also gives its user a stack of Might for each foe its hits land on.
<br>*version · Might; count: hit (the units on the other side an action's hits have landed on) · writer: Build up · in triad b1-16*

**S18.** This ability now deals more for each buff its user holds.
<br>*version · count: buffs; of: self · writer: Build up · not yet in a triad*

**S19.** This ability now comes round on a quick cooldown, adding fewer stacks each time.
<br>*version · abilities that apply stacks again and again are quick; Burn (each application is small against the ceiling that upkeep reaches) · writer: Build up · in triad b1-15*

**S20.** This ability now strikes once more for every few Bleed stacks its target holds.
<br>*version · hits; stacks; Bleed (each hit its holder takes deals untyped damage per stack) · writer: Build up · also Burst · **needs a new block:** a hit count that scales from the target's stacks · not yet in a triad*

**S21.** This ability now aims at the foe with the fewest stacks of what it adds, spreading them across the foes.
<br>*version · lowest by { stacks }; targeting rule · writer: Build up · in triad b1-08*

**S22.** This heal now also gives the ally it heals a stack of Might.
<br>*version · heal; Might; apply · writer: Build up · also Sustain · in triad b1-23*

**S23.** Each hit this unit lands raises the damage of its hits a little for the rest of the fight, up to a limit.
<br>*piece · hit_lands; Intensity cap; boosts · writer: Build up · not yet in a triad*

**S24.** Each time a foe falls, this unit deals a little more damage for the rest of the fight.
<br>*piece · ko (whose: foe); Intensity; boosts · writer: Build up · not yet in a triad*

**S25.** Each hit this unit dodges raises its crit chance a little for the rest of the fight.
<br>*piece · hit_evaded; crit_chance; Intensity · writer: Build up · not yet in a triad*

**S26.** Healing past this unit's full HP becomes Might: the more goes past, the more stacks.
<br>*piece · overhealed (amount: the part past full); Might; amount · writer: Build up · not yet in a triad*

**S27.** This unit's basic attacks add Sunder.
<br>*piece · riders; Sunder · writer: Build up · not yet in a triad*

**S29.** This unit's basic attacks also apply whatever its allies' basic attacks apply.
<br>*piece · borrow; riders · writer: Build up · **needs a new block:** borrow reading every other ally at once, not one unit · not yet in a triad*

**S30.** Each time this unit casts an ability, every foe gains what one of its basic attacks applies.
<br>*piece · riders effect (each target gains what the actor's basic attacks carry, in the stacks one swing adds); action_resolve; Every foe · writer: Build up · not yet in a triad*

**S31.** This unit's basic attacks deal extra damage for each Chill stack held by the foe they hit.
<br>*piece · adds (target is the unit hit; an Intensity status adds it for each stack); Chill · writer: Build up · not yet in a triad*

**S32.** This unit's hits on a foe at its Sunder cap always crit.
<br>*piece · crits (when; chance 100: it always crits); atCap; Sunder · writer: Build up · also Burst · in triad b1-23*

**S33.** Once this unit has landed a great many hits in a fight, its basic attacks strike an extra time for the rest of it.
<br>*piece · strike (one more hit with the weapon's damage, of kind extra); status_capped; cap · writer: Build up · not yet in a triad*

**S35.** When this unit falls, the buffs it holds pass to the ally with the highest Attack.
<br>*piece · pass (label buff); survivesKO; ko · writer: Build up · not yet in a triad*

**S37.** When a foe holding Burn falls, its Burn lands on another random foe.
<br>*piece · status_ended (cause ko; amount: the stacks it held as it ended); apply; Burn · writer: Build up · in triad b1-16*

**S40.** When this unit brings a foe's affliction to its cap, this unit's first ability resolves again at once, free.
<br>*piece · status_capped (other: holder); recast; first · writer: Build up · also Burst · in triad b1-22*

**S43.** While this unit stands, every ally adds a little more of every affliction it applies.
<br>*piece · perSource (an aura); mods stacks · writer: Build up · not yet in a triad*

**S44.** This unit's abilities also cost a little HP, and each payment raises its damage a little for the rest of the fight.
<br>*piece · mods hp (an HP price); hp_paid; Intensity · writer: Build up · not yet in a triad*

**S45.** The unit in this seat gains a little Attack on a steady pulse for the whole fight, and starts with less.
<br>*seat · pulse; apply; stats · writer: Build up · not yet in a triad*

**S46.** The unit in this seat adds more stacks with every affliction it applies, and its hits deal less.
<br>*seat · mods stacks; boosts · writer: Build up · in triad b1-25*

**S47.** The unit in this seat draws more of the foes' picks, and gains a little Thorns for each hit it takes, for the rest of the fight.
<br>*seat · Aggro; hit_taken; Thorns · writer: Build up · also Sustain · not yet in a triad*

**S48.** The unit in this seat gains a little Accuracy each time one of its hits is dodged, for the rest of the fight.
<br>*seat · hit_missed; accuracy; Intensity · writer: Build up · in triad b1-22*

**S49.** The unit in this seat deals more for each foe holding an affliction, and has less Attack.
<br>*seat · count { side, where }; hasAny; boosts · writer: Build up · not yet in a triad*

**S50.** The unit in this seat gains Haste briefly each time a foe's affliction reaches its cap.
<br>*seat · status_capped (whose: foe); Haste (also feeds every built-up status) · writer: Build up · not yet in a triad*

**S51.** The unit in this seat gains a stack of Might each time another ally adds an affliction to a foe.
<br>*seat · status_gained (other: ally); Might · writer: Build up · not yet in a triad*

**S52.** The unit in this seat's basic attacks quicken a little each time it adds an affliction, for the rest of the fight, up to a limit.
<br>*seat · status_gained (other: holder); attack_speed; cap · writer: Build up · in triad b1-08*

**S53.** The unit in this seat's abilities come round a little sooner each time it casts one, for the rest of the fight, and it has less Attack.
<br>*seat · action_resolve; cooldown_reduction; Intensity · writer: Build up · not yet in a triad*

**W03.** Each time anyone in the party lands a crit, the unit in this seat gains a little Crit damage for the rest of the fight.
<br>*seat · hit_lands (crit), Crit damage, whose team · writer: where the ways meet · also Burst · not yet in a triad*

**W04.** For a long while, the basic attacks of the other ally with the highest Attack also carry whatever this unit's basic attacks carry. Long cooldown.
<br>*ability · borrow, riders, the ally with the highest Attack · writer: where the ways meet · also Burst, Debuff or disable · not yet in a triad*

**W06.** This unit's crits add Bleed to their target, more the harder the crit.
<br>*piece · crit (tag), Bleed, amount · writer: where the ways meet · also Burst · in triad b1-08*

**W29.** This ability adds a lot more stacks to a target that holds Slow.
<br>*version · Slow, stacks, when · writer: where the ways meet · also Debuff or disable · in triad b1-22*

**W30.** While this unit Taunts, each hit it takes adds Sunder to the attacker.
<br>*piece · Taunt, hit_taken, Sunder · writer: where the ways meet · also Debuff or disable, Sustain · not yet in a triad*

**W36.** Each time this unit gains Guard, it gains a little Thorns for the rest of the fight.
<br>*piece · Guard, status_gained, Thorns · writer: where the ways meet · also Sustain · in triad b1-25*

**W37.** Each time the unit in this seat is hit, every ally with less Defense than it gains Might.
<br>*seat · hit_taken, lower, Might · writer: where the ways meet · also Sustain · in triad b1-15*

**W38.** When this unit dodges a hit, the attacker gains whatever this unit's basic attacks carry.
<br>*piece · hit_evaded, riders, Evasion · writer: where the ways meet · also Sustain · not yet in a triad*

**X05.** Each hit of this ability also sets off whatever its user's basic attacks set off, its passive included. It never brings an extra strike.
<br>*version · echo: "extra strikes are heard as basic attacks by its statuses' reactions and triggers that name kind basic"; "Passives that work on basic attacks keep working"; mods: "Changes to the holder's own abilities" · writer: thin corners · also Burst · **needs a new block:** a `mods` change that makes an ability's hits heard as basic attacks, as `echo` does for extra strikes · in triad b1-25*

## Debuff or disable

**P21.** Silences a foe that is winding up an ability, so it loses the wind-up; it waits until some foe is winding up.
<br>*ability · Silence (loses an ability's wind-up); casting · in triad pilot-03*

**P22.** Bewilders the foe with the highest Attack, so its next basic attack strikes one of its own side.
<br>*ability · Bewildered; the foe with the highest Attack · in triad pilot-06*

**P23.** Each time a foe hits another ally, that foe becomes Fixated on this unit.
<br>*piece · Fixated; hit_taken (whose: ally); to: other · in triad b1-20*

**P24.** This ability also strips a buff from its target and gives it to this unit.
<br>*version · Dispel (remove); move · in triad pilot-03*

**P25.** Whenever this unit gains a debuff, all its debuffs move onto a random foe.
<br>*piece · pass (lands as a fresh application at its own length); status_gained · in triad pilot-10*

**P26.** When an Aegis on the unit in this seat blocks a hit, the attacker is Weakened.
<br>*seat · Aegis; status_ended (cause: spent); Weaken · in triad pilot-10*

**P27.** Whenever a foe is healed, the unit in this seat gives it Rot.
<br>*seat · healed (whose: foe); Rot · in triad pilot-03*

**P28.** This ability also sends its target's next ability back to a full cooldown.
<br>*version · the cooldown effect (soonest, full) · in triad pilot-06*

**P29.** Makes a foe that holds Guard Brittle, or a random foe if none does.
<br>*ability · Brittle; has, with ifNone; crits land before Defense · in triad pilot-10*

**P30.** Whenever an ally falls below half HP, the foe that last hit it is Stunned.
<br>*piece · hp_low (line); assailant; Stun · in triad pilot-06*

**T02.** Weakens the foe with the highest Attack.
<br>*ability · Weaken (its hits deal much less damage); the foe with the highest Attack · writer: Debuff or disable · also Sustain · not yet in a triad*

**T03.** Removes every buff from the foe holding the most buffs.
<br>*ability · Dispel (removes buffs from a foe); by: buffs, highest · writer: Debuff or disable · not yet in a triad*

**T05.** Removes Taunt from every foe. It waits until a foe is Taunting.
<br>*ability · remove, narrowed to a named status; the Taunt rule; every foe · writer: Debuff or disable · in triad b1-21*

**T06.** Drains a lot of MP from a foe that is winding up, so its cast fizzles if it can no longer pay. It waits until a foe is winding up.
<br>*ability · mp (drains it); casting; fizzles: it does nothing and spends no MP, but still goes on cooldown · writer: Debuff or disable · not yet in a triad*

**T08.** Adds Shock on a quick cooldown to the foe with the slowest basic attack, so its heavy blows land weaker.
<br>*ability · Shock (a slow foe kept charged swings at the cap); by: swing (highest is the slowest) · writer: Debuff or disable · also Sustain · in triad b1-20*

**T10.** Marks the foe holding the most debuffs, so the party's basic attacks go to it.
<br>*ability · Marked (the party's basic attacks pick a Marked foe); mostDebuffs · writer: Debuff or disable · also Burst · in triad b1-24*

**T11.** Gives each foe one of Weaken, Slow or Silence, picked at random for each.
<br>*ability · one (picked at random on the actor's dice); every foe · writer: Debuff or disable · in triad b1-10*

**T12.** Adds Chill to the foe that already holds the most, pushing it toward a shatter, which Stuns it.
<br>*ability · Chill (at the cap it shatters: damage for each stack and a Stun); the foe with the most Chill · writer: Debuff or disable · also Build up · not yet in a triad*

**T13.** Rots the foe with the lowest share of its HP, so heals on it do much less.
<br>*ability · Rot (receives less healing); by: hp_share, lowest · writer: Debuff or disable · in triad b1-07*

**T15.** Moves every debuff on the caster except Doom onto a random foe. It waits until the caster has a debuff.
<br>*ability · pass (lands as a fresh application at its own length); label: debuff; except · writer: Debuff or disable · also Sustain · in triad b1-02*

**T16.** Stuns every foe. It has a long cooldown.
<br>*ability · Stun (can't act); every foe; control resistance (RESISTED, IMMUNE) · writer: Debuff or disable · not yet in a triad*

**T18.** Each hit of this ability sets the target's basic attack back to the start of its swing.
<br>*version · cooldown; basic (the basic attack's timer); full · writer: Debuff or disable · in triad b1-02*

**T21.** This ability's hits Fixate their target on the caster.
<br>*version · Fixated (picks the unit that fixated it while that unit can be picked); apply · writer: Debuff or disable · also Sustain · not yet in a triad*

**T22.** This ability comes back much sooner when its target was winding up as it landed.
<br>*version · casting; when (1 if the condition holds); cooldown, lessPct · writer: Debuff or disable · not yet in a triad*

**T23.** This ability also Stuns every foe holding Sunder at its cap.
<br>*version · Sunder (stacks up to a cap); atCap; Stun · writer: Debuff or disable · also Build up · in triad b1-07*

**T25.** This ability also Weakens every foe that is Stunned or Silenced.
<br>*version · hasAny (Stunned or Silenced); Weaken · writer: Debuff or disable · also Sustain · not yet in a triad*

**T26.** When this unit heals an ally, the foe that last hit that ally is Weakened.
<br>*piece · healed ("a heal given"); assailant ("the foe that last hit the healed ally"); Weaken · writer: Debuff or disable · also Sustain · not yet in a triad*

**T29.** At the start of each fight, each foe's ability with the longest cooldown starts on its full cooldown.
<br>*piece · fight_start; cooldown, slowest; full · writer: Debuff or disable · in triad b1-21*

**T30.** When a foe dodges one of this unit's hits, that foe gains Brittle.
<br>*piece · hit_missed; Brittle; to: other · writer: Debuff or disable · also Burst · not yet in a triad*

**T32.** After each of this unit's hits on a foe holding a Shield, the Shield is removed.
<br>*piece · hit_lands; kind: absorb; remove · writer: Debuff or disable · in triad b1-02*

**T33.** This unit's abilities get past Taunt.
<br>*piece · seek (actions carrying this tag have Seek); the Taunt rule · writer: Debuff or disable · in triad b1-07*

**T34.** This unit's hits drain a little MP from the foe they land on.
<br>*piece · hit_lands; mp (drains it); to: other · writer: Debuff or disable · not yet in a triad*

**T35.** This unit's abilities that Stun or Silence wind up in a moment.
<br>*piece · mods: cast ("winds up in a moment"); of: does (stun, silence) · writer: Debuff or disable · not yet in a triad*

**T36.** This unit's basic attacks go to the foe holding the fewest debuffs, so what they apply spreads across the foes.
<br>*piece · aim (the holder's basic attacks pick by this rule); by: debuffs, lowest · writer: Debuff or disable · not yet in a triad*

**T37.** When this unit gives a foe a debuff, a second, random foe gains it too.
<br>*piece · status_gained, source; share (as a copy); exclude: owner · writer: Debuff or disable · also Build up · not yet in a triad*

**T39.** When a foe's ability hits two or more allies at once, that foe is Weakened.
<br>*piece · action_resolve, whose: foe; countAtLeast; Weaken · writer: Debuff or disable · also Sustain · not yet in a triad*

**T40.** When a foe drops below a third of its HP, it is Silenced.
<br>*piece · hp_low (line); Silence; owner · writer: Debuff or disable · not yet in a triad*

**T41.** When a foe lifts a debuff from itself or another foe, the foe that lifted it is Silenced.
<br>*piece · status_ended (cause: removed); other (whose effect removed it); Silence · writer: Debuff or disable · not yet in a triad*

**T42.** This unit's hits push the target's abilities a little further from ready.
<br>*piece · cooldown (ready now, a full cooldown, some ticks closer, a share of what's left); hit_lands · writer: Debuff or disable · **needs a new block:** a cooldown change that moves a cooldown further from ready by some ticks, never past its full cooldown · in triad b1-24*

**T44.** The unit in this seat has a lot more Accuracy.
<br>*seat · Accuracy (cancels that much of the target's Evasion); a seat changes the stats of the unit in it · writer: Debuff or disable · also Burst · in triad b1-20*

**T46.** Abilities of the unit in this seat that Stun, Silence or Slow come round much sooner.
<br>*seat · mods: cooldown; of: does (stun, silence, slow) · writer: Debuff or disable · in triad b1-21*

**T48.** At the start of each fight, the unit in this seat Slows every foe.
<br>*seat · fight_start; Slow; every foe · writer: Debuff or disable · not yet in a triad*

**T49.** Abilities of the unit in this seat go to the foe with the highest Attack.
<br>*seat · mods: target (its own target rule); top (Attack) · writer: Debuff or disable · not yet in a triad*

**T52.** When a foe's Stun ends, the unit in this seat Slows it.
<br>*seat · status_ended (cause: expired); Slow; owner · writer: Debuff or disable · not yet in a triad*

**T53.** When the unit in this seat dodges a hit, the attacker is Weakened.
<br>*seat · hit_evaded; Weaken; to: other · writer: Debuff or disable · also Sustain · in triad b1-24*

**W21.** This ability is ready again at once whenever a foe's wind-up is cut off.
<br>*version · action_interrupted, cooldown (ready) · writer: where the ways meet · also Burst · not yet in a triad*

**W26.** Each time a foe resists a Stun, Silence or Slow, every ally gains Haste.
<br>*piece · control resistance (RESISTED, IMMUNE), Haste · writer: where the ways meet · also Burst · **needs a new block:** an event that fires when control resistance shortens or refuses a control status · not yet in a triad*

**W32.** Slows the foe with the fastest basic attack and gives Haste to the ally with the fastest basic attack. Short cooldown.
<br>*ability · Slow, Haste, swing · writer: where the ways meet · also Build up · not yet in a triad*

**W46.** Fixates the foe with the highest Attack on this unit, and gives this unit Blur. Medium cooldown.
<br>*ability · Fixated, Blur, the foe with the highest Attack · writer: where the ways meet · also Sustain · not yet in a triad*

**W48.** This unit's basic attacks go to a foe that is winding up when there is one, and its hits on such a foe take MP from it and give it to this unit.
<br>*piece · aim, casting, mp · writer: where the ways meet · also Sustain · in triad b1-10*

**W49.** This unit's hits add Rot, and whenever Rot cuts a foe's healing, this unit heals by the amount cut.
<br>*piece · Rot, healing_received, healed · writer: where the ways meet · also Sustain · **needs a new block:** an event for healing that a cut to healing received held back, carrying the amount held back · not yet in a triad*

**X02.** While its user's other hand is empty, this ability also adds Sunder to each foe it hits.
<br>*version · offhand false: "an offhand under a two-handed weapon is none"; Sunder: "each stack makes its holder take a little more damage of every kind"; a scale's `when`: "1 if the condition holds" · writer: thin corners · also Build up · in triad b1-10*

**X07.** When a fight is won, this unit's abilities that Stun or Silence start the next fight ready.
<br>*piece · fight_won; cooldown set ready; does: "apply this status (stun, silence, shield, guard...)" · writer: thin corners · **needs a new block:** a `cooldown` `which` that picks abilities by what they do, as an ability filter's `does` · not yet in a triad*

## Sustain

**P31.** When a hit on another ally would take a large share of its max HP, this unit takes the whole hit instead.
<br>*piece · cover · in triad b1-12*

**P32.** Damage that would reach the HP of the unit in this seat comes out of its MP instead, while it has any.
<br>*seat · soak · not yet in a triad*

**P33.** This heal instead sets its ally's HP back to what it was a short while ago; that isn't healing, so Rot can't cut it.
<br>*version · rewind (not healing); Rot · in triad b1-17*

**P34.** Trades HP shares with the other ally with the lowest share of max HP, leaving each at the other's share.
<br>*ability · trade; the other ally with the lowest share of max HP · in triad pilot-04*

**P35.** Hits on this unit don't hurt at once: their damage adds up and lands all together a while after the first.
<br>*piece · Owed (owe, debt); a Shield present then soaks · in triad pilot-04*

**P36.** Foes pick among the party by each ally's max HP instead of by its Aggro.
<br>*seat · drawBy · in triad pilot-04*

**P37.** This revive brings its ally back with every ability ready, not on a full cooldown.
<br>*version · Revive; the revive effect's ready · in triad pilot-08*

**P38.** Shields the ally with the most debuffs, more for each debuff it holds, then Cleanses it.
<br>*ability · Shield; mostDebuffs; Cleanse · not yet in a triad*

**P39.** MP this unit gains past full goes to the ally with the lowest share of max MP.
<br>*piece · mp_over; by mp_share · in triad pilot-08*

**P40.** Taunts, and makes every other ally Hidden for a while.
<br>*ability · Taunt; Hidden; Taunt ends Hidden; someone stays in the light · in triad pilot-08*

**V01.** Gives a Shield, sized from the caster's max HP, to the caster and the other ally with the lowest share of HP.
<br>*ability · Shield; the other ally with the lowest share of max HP; scale (stat: max HP) · writer: Sustain · not yet in a triad*

**V03.** This ability's Shield grows for each foe still standing.
<br>*version · Shield; count ({ side, where }) · writer: Sustain · in triad b1-06*

**V04.** The unit in this seat starts each fight with a Shield sized from its max HP.
<br>*seat · fight_start; Shield · writer: Sustain · not yet in a triad*

**V05.** Healing past this unit's full HP becomes a Shield.
<br>*piece · overhealed; Shield; amount · writer: Sustain · not yet in a triad*

**V06.** Each time this unit gains a Shield, the other ally with the lowest share of HP gains half as much.
<br>*piece · share; status_gained; Shield · writer: Sustain · in triad b1-17*

**V07.** Gives Aegis to the ally with the lowest share of HP that doesn't hold one.
<br>*ability · Aegis; Fizzle statuses; the ally with the lowest share of max HP · writer: Sustain · not yet in a triad*

**V08.** When this unit's Aegis blocks a hit, it gains a Shield sized from the damage blocked.
<br>*piece · status_ended (cause spent); Aegis; Shield · writer: Sustain · not yet in a triad*

**V09.** Gives Guard to every ally with less Defense than the caster.
<br>*ability · Guard; lower; Defense · writer: Sustain · in triad b1-11*

**V10.** Hits on this unit never crit.
<br>*piece · critsTaken (never); Crits · writer: Sustain · in triad b1-09*

**V11.** The unit in this seat takes much less damage from hits aimed at more than one unit.
<br>*seat · taken; area (tag) · writer: Sustain · not yet in a triad*

**V12.** While the unit in this seat stands, every ally takes a little less damage.
<br>*seat · Per source (an aura); taken · writer: Sustain · not yet in a triad*

**V13.** The unit in this seat takes much less damage, but its HP can't rise above half.
<br>*seat · healCap; taken · writer: Sustain · not yet in a triad*

**V17.** The unit in this seat draws far more of the foes' picks, and gains Defense.
<br>*seat · Aggro; draw; Defense · writer: Sustain · in triad b1-18*

**V19.** Makes the ally with the most current HP Taunt, and gives it Guard.
<br>*ability · Taunt; Guard; highest (by hp) · writer: Sustain · not yet in a triad*

**V20.** This ability's Taunt also keeps the caster from being knocked out for a while.
<br>*version · Taunt; floor · writer: Sustain · not yet in a triad*

**V21.** When another ally falls under a quarter of its HP, this unit Taunts.
<br>*piece · hp_low (whose ally); Taunt · writer: Sustain · not yet in a triad*

**V22.** Makes the ally with the lowest share of HP Hidden.
<br>*ability · Hidden; the ally with the lowest share of max HP; Someone stays in the light · writer: Sustain · not yet in a triad*

**V24.** Brings a decoy into the fight that draws the foes' picks until it falls; long cooldown.
<br>*ability · summon; Aggro; draw · writer: Sustain · **needs a new block:** a summon for the party's side: a unit that isn't a party member, doesn't keep the party standing once every member is down, and is gone when the fight ends · in triad b1-09*

**V25.** Each time this unit dodges a hit, the other ally with the lowest share of HP gains Blur.
<br>*piece · hit_evaded; Blur; Evasion · writer: Sustain · not yet in a triad*

**V26.** Makes the ally with the lowest share of HP take no damage for a brief time; very long cooldown.
<br>*ability · immune:damage; the ally with the lowest share of max HP · writer: Sustain · in triad b1-18*

**V27.** The unit in this seat can't be given debuffs for a while at the start of each fight.
<br>*seat · fight_start; immune:debuffs · writer: Sustain · in triad b1-12*

**V28.** Lifts every debuff from the ally that holds the most.
<br>*ability · Cleanse; mostDebuffs · writer: Sustain · in triad b1-17*

**V31.** Heals the ally with the lowest share of HP.
<br>*ability · Heal; the ally with the lowest share of max HP; canHeal · writer: Sustain · not yet in a triad*

**V33.** On an ally under Rot, this heal gives a Shield of the same size instead.
<br>*version · Rot; Shield; when · writer: Sustain · not yet in a triad*

**V34.** When one of this unit's heals leaves the ally still under half its HP, the heal goes off again at once, free.
<br>*piece · recast; action_resolve; hpBelow · writer: Sustain · in triad b1-06*

**V35.** Gives Regen to every ally; long cooldown.
<br>*ability · Regen; Every ally · writer: Sustain · in triad b1-12*

**V37.** While the unit in this seat stands, all healing an ally receives is shared evenly among the living allies.
<br>*seat · sharesHeals; Heal · writer: Sustain · not yet in a triad*

**V39.** Gives Lifesteal for a while to the ally with the highest Attack.
<br>*ability · Lifesteal; the ally with the highest Attack · writer: Sustain · not yet in a triad*

**V41.** Raises a knocked-out ally with some HP; very long cooldown.
<br>*ability · Revive; a random knocked-out ally · writer: Sustain · not yet in a triad*

**V42.** This revive raises every knocked-out ally at once, each with a little HP.
<br>*version · Revive; ko: true; all (pick) · writer: Sustain · not yet in a triad*

**V43.** This revive brings the ally back with much more HP, paid for with the caster's own HP.
<br>*version · revive (hp); pay · writer: Sustain · not yet in a triad*

**V44.** Once a fight, when another ally is knocked out, this unit raises a knocked-out ally with a little HP.
<br>*piece · ko (whose ally); revive; marker · writer: Sustain · not yet in a triad*

**V46.** This heal also gives its target Clarity.
<br>*version · Heal; Clarity · writer: Sustain · not yet in a triad*

**V47.** The unit in this seat regains MP steadily through each fight.
<br>*seat · MP regeneration; MP_REGEN_STEP · writer: Sustain · not yet in a triad*

**V48.** Each hit this unit takes restores a little of its MP.
<br>*piece · hit_taken; mp · writer: Sustain · not yet in a triad*

**V49.** This unit's hits drain MP from their target into its own.
<br>*piece · Siphon; hit · writer: Sustain · also Debuff or disable · in triad b1-18*

**V50.** Each time another ally heals this unit, that ally regains a little MP.
<br>*piece · healed; mp; other · writer: Sustain · not yet in a triad*

**V51.** While this unit is under a quarter of its MP, its abilities cost HP instead of MP.
<br>*piece · mods (hp); mpBelow; hp_paid · writer: Sustain · in triad b1-11*

**V52.** This ability costs no MP, but its cooldown is much longer.
<br>*version · MP costs are set by hand on each ability; cooldown words · writer: Sustain · not yet in a triad*

**V53.** This unit's abilities that heal or give Shield go off together: each waits until all are ready, and the rest come free with the first.
<br>*piece · together; does · writer: Sustain · not yet in a triad*

**V54.** When any ally falls under a quarter of its HP, this unit's first ability in order is ready at once.
<br>*piece · hp_low (whose team); cooldown (first, ready) · writer: Sustain · not yet in a triad*

**V55.** While the unit in this seat is under half its HP, its abilities that heal or give Shield come round much sooner.
<br>*seat · mods (cooldown, if); hpBelow; does · writer: Sustain · not yet in a triad*

**W13.** When this ability knocks out a foe, the ally with the lowest share of HP is healed by what was left of the blow.
<br>*version · ko (amount), Heal, the ally with the lowest share of max HP · writer: where the ways meet · also Burst · not yet in a triad*

**W16.** Gives Clarity to the ally with the lowest share of MP and brings that ally's next ability to ready. Long cooldown.
<br>*ability · Clarity, cooldown (soonest, ready), mp_share · writer: where the ways meet · also Burst · not yet in a triad*

**W18.** The unit in this seat has its Attack and Defense swapped.
<br>*seat · swap, Attack, Defense · writer: where the ways meet · also Burst · in triad b1-06*

**W35.** The first time in a fight this unit's HP falls below half, the start-of-fight effects of its gear and seat happen again.
<br>*piece · restart, hp_low, fight_start · writer: where the ways meet · also Build up, Burst · not yet in a triad*

**W39.** Each time a foe's Chill shatters, every ally gains Regen.
<br>*seat · status_capped, Chill, Regen · writer: where the ways meet · also Build up, Debuff or disable · not yet in a triad*

**W40.** Heals every ally a little, and a little more for every affliction stack across all foes. Medium cooldown.
<br>*ability · Heal, count (side, stacks), affliction · writer: where the ways meet · also Build up · not yet in a triad*

**W41.** This ability also gives the ally it cleanses Might for each debuff it removes.
<br>*version · Cleanse, Might, count (debuffs) · writer: where the ways meet · also Build up · in triad b1-11*

**X03.** Every ally that wears the same type of armor as the unit in this seat takes a little less damage.
<br>*seat · party effect: "stats or statuses for every ally"; armor: "Wears armor of one of these types"; damage-taken modifiers · writer: thin corners · **needs a new block:** an armor condition that matches the reading unit's own type, as `kin` does for weapons · in triad b1-09*

**X09.** The unit in this seat gains Blur each time one of its basic attacks strikes twice.
<br>*seat · Double strike's second strike: "hits, not basic attacks"; Blur: "the next hit on its holder misses ... one Blur waits at a time"; hit_lands with tag extra · writer: thin corners · not yet in a triad*

**X10.** Healing from this unit's Lifesteal goes to the ally with the lowest share of max HP instead.
<br>*piece · Lifesteal: "Each hit heals the holder for a share of its damage"; divert: "What the holder would gain goes to another unit instead"; "The ally with the lowest share of max HP" · writer: thin corners · not yet in a triad*

**X15.** The unit in this seat takes a little less damage for each foe holding Burn.
<br>*seat · Burn; damage-taken modifiers; count { side, where }: "the units on that side of the unit read that pass where" · writer: thin corners · not yet in a triad*

## The director's cards

The director's own, D01 onward, each the words from their *Add a fourth* that state the card, exactly as given; the whole answer is in `triads.md` under its triad. The director wasn't shown a triad's way to win, so their way is a guess. The session's reading of each card's way, from what it does, is given beside it: only a card that really sits in another way than its triad's counts as a distinction crossing the ways. None is in a triad yet. Each has a proposed line for the page, written by the session in the cards' plain style; the director checks it, or rewrites it, before it goes in a triad.

| | From | Triad's way | The director's guess | The session's reading |
| --- | --- | --- | --- | --- |
| D01 | pilot-01 | Burst | Debuff or disable | Debuff or disable: another way |
| D02 | pilot-02 | Build up | Sustain | Sustain: another way |
| D03 | pilot-03 | Debuff or disable | Sustain | Sustain: another way |
| D04 | pilot-03 | Debuff or disable | Sustain | Sustain: another way |
| D05 | pilot-03 | Debuff or disable | Burst | Burst: another way |
| D06 | pilot-04 | Sustain | Build up | Build up: another way |
| D07 | pilot-05 | Burst | Burst | Burst: the same way |
| D08 | pilot-06 | Debuff or disable | Build up | Build up: another way |
| D09 | pilot-06 | Debuff or disable | Sustain | Debuff or disable: the same way |
| D10 | pilot-07 | Build up | Burst | Build up, leaning Burst: not counted as another way |
| D11 | pilot-08 | Sustain | Burst, Build up | Burst: another way |
| D12 | pilot-09 | Burst | Build up, Sustain | Sustain and Build up: another way |
| D13 | pilot-10 | Debuff or disable | Burst, Debuff or disable | Debuff or disable: the same way |
| D14 | pilot-10 | Debuff or disable | none given apart from D13 | Sustain: another way |

Ten in another way than their triad's, three in the same, one unclear.

**D01** · the director's · from pilot-01
> a version that says this ability waits until a foe is casting before being used on it. And that ability would be one that silences.

*Session: Debuff or disable. Close to P21, which the director hadn't yet seen (it was in pilot-03). Needs: none.*

*Proposed line, the session's, for the director to check before it goes in a triad (version):* This ability waits until a foe is winding up, then Silences that foe so it loses the wind-up.

**D02** · the director's · from pilot-02
> an effect that makes a heel target more than the original target. So target the whole party, for example.

*Session: Sustain ("heel" is the dictation's spelling of heal). Needs: none.*

*Proposed line, the session's, for the director to check before it goes in a triad (piece):* This unit's heals that aim at one ally land on every ally instead.

**D03** · the director's · from pilot-03
> an effect that waits until an ally reaches under a certain health threshold. before healing them.

*Session: Sustain. Needs: none.*

*Proposed line, the session's, for the director to check before it goes in a triad (version):* This heal waits until an ally falls below a set share of its HP, then heals that ally.

**D04** · the director's · from pilot-03
> Or waiting until they're under a certain mana threshold before applying clarity or mana regen to them.

*Session: Sustain. The sources already have Clarity wait for low MP (`mpBelow`), so as a card it would need its own twist. Needs: none.*

*Proposed line, the session's, for the director to check before it goes in a triad (version):* This ability waits until an ally falls below a set share of its MP, then gives that ally Clarity.

**D05** · the director's · from pilot-03
> wait until an enemy is under a certain health threshold for the specific damaging ability to fire.

*Session: Burst. Needs: none.*

*Proposed line, the session's, for the director to check before it goes in a triad (version):* This damaging ability waits until a foe falls below a set share of its HP, then hits that foe.

**D06** · the director's · from pilot-04
> one that has the effect of stopping a unit from doing any basic attacks. like the player's own unit.

*Session: Build up, on the director's own reason (Might is spent one stack per action, so abilities would land at full Might). Likely needs a new block: a change that stops the holder's basic attacks.*

*Proposed line, the session's, for the director to check before it goes in a triad (piece):* This unit never makes basic attacks.

**D07** · the director's · from pilot-05
> a unit casts its abilities three times every time it casts one paying full cost every time.

*Session: Burst, the same way as its triad. Needs: none (paid recasts).*

*Proposed line, the session's, for the director to check before it goes in a triad (piece):* Each ability this unit uses goes off three times, paying its full cost each time.

**D08** · the director's · from pilot-06
> gain might whenever you get hit.

*Session: Build up. Needs: none.*

*Proposed line, the session's, for the director to check before it goes in a triad (piece):* This unit gains Might each time it's hit.

**D09** · the director's · from pilot-06
> when this unit uses an ability, apply shock to the entire enemy party.

*Session: Debuff or disable, the same way as its triad: Shock is a debuff on the foes, and the sustain the director sees comes through it. Needs: none.*

*Proposed line, the session's, for the director to check before it goes in a triad (piece):* Each time this unit uses an ability, every foe gains Shock.

**D10** · the director's · from pilot-07
> apply more sunder based on the percentage of missing health of the enemy.

*Session: Build up or Debuff or disable (Sunder stacks on foes), leaning Burst as it piles on the nearly dead. The director's own words call it "still a build up strategy". Not counted as another way. Needs: none.*

*Proposed line, the session's, for the director to check before it goes in a triad (version):* This ability adds more Sunder the more HP its target is missing.

**D11** · the director's · from pilot-08
> this unit gives 75% of its attack to the unit with the highest attack.

*Session: Burst, a boost there from the start of every fight. Likely needs a new block: a stat one unit lends another.*

*Proposed line, the session's, for the director to check before it goes in a triad (piece):* This unit lends most of its Attack to the ally with the highest Attack.

**D12** · the director's · from pilot-09
> when this unit's shield reaches max capacity, detonate it dealing that much damage to enemies and reform it at half the size.

*Session: Sustain and Build up. Needs a new block: a reaction to a Shield pool reaching its cap (`status_capped` covers stacking statuses only). The director's longer answer says "the enemies around it"; the game has no positions, so its targets would need a rule.*

*Proposed line, the session's, for the director to check before it goes in a triad (piece):* When this unit's Shield fills to its cap, every foe takes damage equal to the Shield, and the Shield drops to half.

**D13** · the director's · from pilot-10
> Apply sunder to a foe. Double if they're taunting.

*Session: Debuff or disable, the same way as its triad. Given as one of "a lot of these that are easy to make", not one the director held up as interesting. Needs: none.*

*Proposed line, the session's, for the director to check before it goes in a triad (ability):* Adds Sunder to a foe, twice as much if that foe is Taunting.

**D14** · the director's · from pilot-10
> if an enemy ever heals, gain regen or heal yourself

*Session: Sustain. Given in passing, as "a sort of version of" D13's kind. Needs: none.*

*Proposed line, the session's, for the director to check before it goes in a triad (piece):* Whenever a foe is healed, this unit gains Regen.


## Taken out

Cards taken out at the merge, each kept here with the card in play that it doubles. A **double** is the same choice in other words; **close to** is a near-double, taken out in a second, stricter pass so that the deck keeps one card per distinct choice.

- **R05** (ability, Burst): Makes every ally's basic attack ready at once. *close to R44.*
- **R08** (ability, Burst): Lays a lot of Shock on the foe with the fastest basic attack. *a double of P13.*
- **R11** (ability, Burst): Strikes a foe, dealing much more if that foe hasn't acted yet this fight. *a double of P02.*
- **R15** (ability, Burst): Marks the foe with the lowest current HP, so the party's basic attacks go to it. *a double of P09.*
- **R18** (version, Burst): This ability also costs some HP, and deals extra damage for the HP it paid. *a double of P05.*
- **R20** (version, Burst): This ability goes to the foe with the lowest current HP, getting past Taunt. *close to P09.*
- **R24** (version, Burst): This ability also brings its user's next ability a good way closer to ready. *close to R19.*
- **R30** (piece, Burst): When its hit knocks a foe out, what the blow had left over strikes another random foe. *a double of P04.*
- **R33** (piece, Burst): Its damaging abilities go off as one: each waits until all are ready, then they're cast together, the others free. *a double of P06.*
- **R34** (piece, Burst): Its basic attacks never wait on its abilities; it keeps swinging through their wind-ups. *a double of P10.*
- **R40** (piece, Burst): Its hits knock out a foe they leave with only a sliver of HP. *a double of P07.*
- **R42** (piece, Burst): Healing past its full HP turns into Might. *a double of S26.*
- **R45** (seat, Burst): Its first ability in order is ready when each fight starts. *a double of P03.*
- **S01** (ability, Build up): Adds Burn to the foe with the most Burn, adding more the more Burn it already holds. *a double of P12.*
- **S04** (ability, Build up): Deals damage to a foe, more for each debuff it holds. *a double of R13.*
- **S06** (ability, Build up): Adds Shock to the foe with the fastest basic attack. *a double of P13.*
- **S09** (ability, Build up): Marks the foe with the most debuffs, drawing the party's basic attacks to it. *a double of T10.*
- **S28** (piece, Build up): Its extra strikes, Double strike's included, also apply whatever its basic attacks apply. *a double of P16.*
- **S34** (piece, Build up): Each time a foe falls, the start-of-fight effects of its gear and seat happen again. *a double of R31.*
- **S36** (piece, Build up): Whenever it adds an affliction to a foe, another random foe gains half as much. *a double of T37.*
- **S38** (piece, Build up): When a foe's Chill shatters, a random other foe gains half of that Chill. *a double of P11.*
- **S39** (piece, Build up): Each ability it casts while every foe holds an affliction comes round a good deal sooner. *close to S13.*
- **S41** (piece, Build up): Its abilities that add afflictions wait until all of them are ready and are cast together, the rest free. *close to P06.*
- **S42** (piece, Build up): Whenever a foe's affliction deals its damage, its next ability comes a little closer. *a double of P19.*
- **T01** (ability, Debuff or disable): Silences a foe that is winding up, cutting its cast off. It waits until a foe is winding up. *a double of P21.*
- **T04** (ability, Debuff or disable): Takes one buff from a foe that has one and gives it to the caster. Bulwark is never taken. *a double of P24.*
- **T07** (ability, Debuff or disable): Puts a foe's next ability back on its full cooldown. *a double of P28.*
- **T09** (ability, Debuff or disable): Bewilders every foe, so each one's next basic attack strikes a unit of its own side. *close to P22.*
- **T14** (ability, Debuff or disable): Gives Brittle to the foe with the highest Defense, so the next hit on it crits. *a double of P29.*
- **T17** (version, Debuff or disable): Also Weakens each foe it hits. *close to T02.*
- **T19** (version, Debuff or disable): Comes round a little sooner for each foe that holds a debuff. *close to S13.*
- **T20** (version, Debuff or disable): Also drains MP from its target, more for each debuff the target holds. *close to T34.*
- **T24** (version, Debuff or disable): Also Silences every foe that is winding up as it lands. *close to P21.*
- **T27** (piece, Debuff or disable): When a foe is healed, it gains Rot. *a double of P27.*
- **T28** (piece, Debuff or disable): Once a fight, the first foe to start winding up an ability is Silenced, losing the cast. *a double of P21.*
- **T31** (piece, Debuff or disable): When a foe hits this unit, that foe gains whatever this unit's basic attacks apply. *a double of P18.*
- **T38** (piece, Debuff or disable): When a foe's Chill shatters, every other foe gains some Chill. *a double of P11.*
- **T43** (piece, Debuff or disable): When a foe falls, the debuffs it held pass to a random other foe. *a double of S37.*
- **T45** (seat, Debuff or disable): Abilities of the unit here that aim at one foe land on every foe instead, their damage split evenly among them. *a double of S14.*
- **T47** (seat, Debuff or disable): Abilities of the unit here add half again as many stacks of each affliction, but its hits deal a little less. *a double of S46.*
- **T50** (seat, Debuff or disable): Basic attacks of the unit here add a little Sunder. *a double of S27.*
- **T51** (seat, Debuff or disable): Every so often, the unit here removes one buff from a random foe that has one. *close to T03.*
- **T54** (seat, Debuff or disable): Abilities of the unit here that Stun, Silence or Slow wait until all of them are ready, then go off together, the others free. *close to P06.*
- **T55** (seat, Debuff or disable): When a foe hits an ally that is below half HP, that foe is Fixated on the unit here. *a double of P23.*
- **V02** (version, Sustain): The Shield goes on every ally instead of one, each a smaller amount. *a double of D02.*
- **V14** (piece, Sustain): Hits on it don't land at once: their damage adds up and lands all together a while after the first. *a double of P35.*
- **V15** (piece, Sustain): Damage that would reach its HP comes out of its MP instead, while it has any. *a double of P32.*
- **V16** (piece, Sustain): When a hit on another ally would take more than a big share of that ally's max HP, it takes the whole hit instead. *a double of P31.*
- **V18** (seat, Sustain): While it stands, foes choose among the party by each unit's max HP instead of by draw. *a double of P36.*
- **V23** (version, Sustain): Hides every ally but the one with the most current HP, instead of just one. *a double of P40.*
- **V29** (version, Sustain): The cleanse also heals the ally a little for each debuff it lifts. *a double of P38.*
- **V30** (ability, Sustain): Moves its own debuffs, all but Doom, onto a random foe. *a double of T15.*
- **V32** (version, Sustain): The heal waits until an ally is under half its HP, then heals that ally much more. *a double of D03.*
- **V36** (piece, Sustain): Every so often, it heals the ally with the lowest share of HP a little. *close to V31.*
- **V38** (ability, Sustain): Puts the ally with the lowest share of HP back to the HP it had a short while ago, if that was more. *a double of P33.*
- **V40** (piece, Sustain): Once a fight, when its HP falls under a quarter, it swaps shares of HP with the foe whose share is highest. *a double of R14.*
- **V45** (ability, Sustain): Gives Clarity to the ally with the lowest share of MP. *a double of D04.*
- **W01** (piece, Build up): Its extra strikes count as basic attacks for everything that answers its basic attacks. *a double of P16.*
- **W02** (ability, Burst): Hits the foe with the most Bleed many times, a little each. Short cooldown. *a double of R07.*
- **W07** (piece, Build up): Its basic attacks keep their own pace through its wind-ups and recoveries, but its wind-ups take half again as long. *a double of P10.*
- **W08** (version, Burst): This ability deals a little more for each buff its user holds. *a double of S18.*
- **W09** (piece, Burst): Its abilities wait until all of them are ready, then go off together, all but the first for free. *a double of P06.*
- **W10** (ability, Sustain): Swaps shares of HP with the foe at the highest share of its max HP, each left at the other's share. Waits until its own HP is below a quarter; very long cooldown. *a double of R14.*
- **W12** (seat, Sustain): Healing any ally receives is shared evenly across the party, and the unit here heals for a share of the damage its hits deal. *a double of V37.*
- **W14** (version, Burst): This ability costs a share of its user's current HP instead of MP, and hits harder for the HP it paid. *a double of P05.*
- **W15** (version, Sustain): Allies this ability revives come back with every ability ready. *a double of P37.*
- **W19** (seat, Burst): At the start of each fight, every foe gains Brittle. *a double of R04.*
- **W22** (ability, Burst): Hits a random foe with a buff, a lot harder for each buff it holds, then strips its buffs. Medium cooldown. *a double of R12.*
- **W23** (ability, Burst): Marks the foe with the lowest current HP, so the party's basic attacks go to it. Quick cooldown. *a double of P09.*
- **W24** (ability, Debuff or disable): Bewilders every foe, so each one's next basic attack strikes its own side. Long cooldown. *a double of T09.*
- **W27** (piece, Build up): When a foe gains an affliction from it, another random foe gains half as many stacks of it. *a double of T37.*
- **W28** (version, Debuff or disable): This ability also Silences its target if that target's Shock is at its cap. *a double of T23.*
- **W31** (piece, Build up): Its basic attacks add a random affliction to their target. *close to S07.*
- **W33** (version, Debuff or disable): This ability lands on every foe instead of one, its damage split evenly among them and its statuses landing in full on each. *a double of S14.*
- **W34** (seat, Build up): The basic attacks of the unit here go to the foe holding the most debuffs. *a double of T10.*
- **W42** (ability, Build up): Goes Hidden for a while, and its abilities add a lot more stacks for as long. Long cooldown. *close to R47.*
- **W43** (version, Debuff or disable): This ability also moves every debuff its user holds but Doom onto its target. *a double of T15.*
- **W44** (ability, Debuff or disable): Takes a buff other than Bulwark from a random foe with a buff and keeps it. Short cooldown. *a double of P24.*
- **W45** (piece, Sustain): When a hit on an ally would take a large share of that ally's max HP, this unit takes the hit instead and the attacker gains Weaken. *a double of P31.*
- **W47** (piece, Debuff or disable): When it heals an ally, the foe that last hit that ally gains Slow. *a double of T26.*
- **W50** (seat, Debuff or disable): Each time an Aegis on anyone in the party blocks damage, the foe that dealt it is Stunned. *a double of P26.*
- **X04** (ability, Build up): For a while, every other ally's basic attacks also lay whatever this unit's basic attacks lay. *close to W04.*
- **X11** (piece, Build up): Healing from its Lifesteal that would go past full HP gives it Might instead, more Might for more healing. *a double of S26.*
- **X12** (seat, Build up): The unit in this seat gains a little Thorns each time a hit lands on it, for the rest of the fight. *a double of S47.*
- **X13** (ability, Debuff or disable): Lays a lot of Shock on the foe with the fastest basic attack. *a double of P13.*
