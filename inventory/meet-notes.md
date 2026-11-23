# Where mechanics meet: notes

160 plays in `meet.json`, prefix X. Each one needs two mechanics, or three, and disappears if one of them is taken away.

## What I swept

I went family against family across `vocabulary.md`, `combat.md`, `primitives.md` and `gear-rules.md`, and ran the four style questions over each pair.
- **Statuses against statuses,** including the foes' Doom and Bulwark, which the party only answers.
- **Statuses against events and effect ops:** every op from `damage` to `replace`, plus the status_ended causes and the hit, HP, MP, heal and status events.
- **Stats and special stats against statuses:** Defense's formula, the crit order, the Aegis line, draw, and MP as soak and as cost.
- **Status fields, ability changes and cooldown changes:** cover, floor, soak, swap, rescale, echo, borrow, tireless, together, spread, wait, and first, slowest and soonest.
- **Weapon kinds and seats against the rest:** speed, swing, scaling, hands, seat order, seat scales, `next` and `previous`, the side rules and party effects.
- **Targeting against all of it:** the Taunt rule, extra targets past Taunt, Hidden and the last seat, Fizzle walking down a phrase, swing picks and most-stacks picks.
- **Conditions and scale sources:** acted, casting, atLeast, hpAtLeast, when, cost, stacks, side totals, buffs and debuffs counts, raw and stopped.

A second pass went back over families I had touched only once: Fixated, Thorns, `one`, hit_missed, status_triggered, the count conditions, hands, raw amounts and Stun against cooldowns.

## Thin or empty, and why

- **Burn, Chill and Shock against each other:** empty. Afflictions never read one another. They meet only through counts, side totals and Sunder.
- **Bleed against Thorns or reaction damage:** empty. Neither is a hit, so neither sets off Bleed.
- **Silence against Shock:** works against itself. An interrupted cast never resolves, so it never sets off Shock.
- **Regen and Clarity:** thin. They are fixed pulses and meet little beyond Doom, Rot, overheal, soak and MP spill.
- **Enrage:** empty. It's a fight rule that no preparation choice meets.
- **Weapon leanings and budgets:** content, not mechanics, so nothing was taken from them. Hands meet only the offhand conditions.
- **Order, heals, oncePerEvent, revives and critsTaken (status fields):** they meet nothing that makes a new play. Each works alone or as a drawback.
- **Price questions on width plays:** thin. Widening rarely carries its own cost in these rules.

## Left out: each needs a new system

- Ordering or retargeting during a fight: input in a fight.
- Cleaves, rows, splash to neighbours, front and back: geometry.
- Weakness and resistance combos: elements are themes only.
- A status that grows with its applier's stats: against the bounds.
- Rage, combo points or charges spent by abilities: a new resource.
- Statuses or stacks carried into the next fight: a new layer between fights.
- Casting or copying a foe's ability: the engine has no ability theft.
- Swapping a bench unit in mid-fight: the bench has no place in a fight.
- Healing at fight_won so HP carries further: a play about lasting more fights, so out of bounds.
- Lifesteal-like healing from a status's own damage: forbidden by the no-lifesteal ruling, and not worth a ruling flag.

## Contradictions and open rules

- **Applier scaling.** Vocabulary rules that a status scales only by its stacks and never by its applier. But primitives give status pulses `crit: fromSource` (the source's crit stats and dice) and number scales `of: source`.
- **Lengths.** Vocabulary rules that nothing applies a status for less or more than its own length. But primitives' `apply` carries a `duration` field.
- **Spend.** The "status runs its own course" ruling forbids spending stacks early, yet primitives have a `spend` op. X-133 is marked with that ruling.
- **Leaving a fight.** Combat says no unit leaves a fight alive. Primitives' `replace` has a unit leave the fight without a knockout (X-132).
- **Party summons.** Combat says a party is at most three units, one of each class. Primitives let `summon` add units on the actor's side, which includes the party's (X-131). Neither source says whether this is allowed.
- **Bosses.** No immunity is stated against `trade`, `fell` or `rewind` (X-082, X-130). Whether a boss can be traded to 1 HP or felled at a line is open.
- **`remove` with `move`.** The field is listed with no meaning (X-111, X-112). I read it as moving what is removed onto the target.
- **Buff or debuff.** Vocabulary says every status is a buff or a debuff, then exempts Owed as a marker.
- **Basic-attack picks.** Combat says only passives change who a basic attack picks. But Marked, Fixated and Bewildered do it as statuses.
- **Seat order.** Gear rules say seat order only breaks targeting ties. But it also decides who stays out of Hidden, the order of same-moment batches, and the `next`/`previous` seats and the side rule.
- **Same-moment order and enrage.** Same-moment order is an open gap in combat. Whether enrage raises a status's own damage isn't said.
- **Cooldowns carried between fights.** X-146 uses them for an opening burst, not for lasting longer. Check it still sits inside the MP bound.
