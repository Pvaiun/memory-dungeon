# Cards

Every card, kept as written. The pilot's forty were written by one agent that read only `sources/ways-to-win.md`, `vocabulary.md`, `combat.md`, `primitives.md` and `gear-rules.md`, and was told nothing of what the cards are for. The director's own cards, when they come, are added here and marked as theirs.

Each card's kind, way to win, mechanics and the building block it needs are the writer's tags, for the session's use. The page shows only the text.

| Way | Ability | Version | Piece | Seat | All |
| --- | --- | --- | --- | --- | --- |
| Burst | 2 | 2 | 4 | 2 | 10 |
| Build up | 1 | 2 | 4 | 3 | 10 |
| Debuff or disable | 3 | 2 | 3 | 2 | 10 |
| Sustain | 3 | 2 | 3 | 2 | 10 |
| All | 9 | 8 | 14 | 9 | 40 |

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
<br>*seat · status_triggered; Bleed; the cooldown effect (soonest, less) · not yet in a triad*

**P20.** Once the fight has gone on long enough to enrage, this unit's abilities wind up in a moment.
<br>*piece · enrage; ability changes: cast (winds up in a moment) · **needs a new block:** a condition that reads whether the fight has enraged · in triad pilot-07*

## Debuff or disable

**P21.** Silences a foe that is winding up an ability, so it loses the wind-up; it waits until some foe is winding up.
<br>*ability · Silence (loses an ability's wind-up); casting · in triad pilot-03*

**P22.** Bewilders the foe with the highest Attack, so its next basic attack strikes one of its own side.
<br>*ability · Bewildered; the foe with the highest Attack · in triad pilot-06*

**P23.** Each time a foe hits another ally, that foe becomes Fixated on this unit.
<br>*piece · Fixated; hit_taken (whose: ally); to: other · not yet in a triad*

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

## Sustain

**P31.** When a hit on another ally would take a large share of its max HP, this unit takes the whole hit instead.
<br>*piece · cover · not yet in a triad*

**P32.** Damage that would reach the HP of the unit in this seat comes out of its MP instead, while it has any.
<br>*seat · soak · not yet in a triad*

**P33.** This heal instead sets its ally's HP back to what it was a short while ago; that isn't healing, so Rot can't cut it.
<br>*version · rewind (not healing); Rot · not yet in a triad*

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

## The director's cards

None yet.
