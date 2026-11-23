# Build up: notes

101 plays in `build.json` (prefix U). By question: width 28, timing 27, size 24, price 22. Three need a block and three need a ruling.

## What was swept

I went family by family through `vocabulary.md`, `combat.md`, `primitives.md` and `gear-rules.md`, and ran each of the four style questions across each family:

- **The five afflictions,** each by its own shape. Burn: no cap, decays by a share, upkeep sets its ceiling. Chill: builds to a shatter, then cycles. Shock: drains only when its holder acts. Bleed: no duration, cashed by hits. Sunder: every kind of damage, drains on a pulse.
- **Might** (spent by each action) and **Shield** (read as stacks, since absorbs are Intensity).
- **Owed**, and the enemy-only **Doom** and **Bulwark**.
- **Every event** as a feed for a counter: time, own actions and hits, crits, foes hit, hits and damage taken, stopped damage, dodges, misses, HP lost and paid, HP lines, heals and overheals, MP over full, statuses gained, ticks and caps on foes, interrupts, kills (own, any foe, ally), KO and revive.
- **Scale sources:** stat, hp missing, stacks, amount, when, event stopped, count (debuffs, buffs, foes hit, units passing a test, total stacks, the fallen), times, seat.
- **Ops:** apply, share, riders, pass, restart, recast, strike, fell, spend, summon, pay, cooldown. **Fields:** adds, boosts, taken, crits, rescale, floor, healCap, cover, borrow, tireless, echo, spare, divert, damp, Per source, survivesKO, trigger and drop, owe and debt, focus and aim. **Target rules:** highest or lowest by stacks, belowCap, all.
- **Speed stats and Haste.** **Weapons:** speed, swing and scaling. **Formations:** seats, party effect, seat filters. **Enrage.**

## Where the space is thin or empty, and why

- **Haste and Slow are Refresh,** not stacking. Growth in tempo needs a counter that carries speed stats (U-045, U-046). Haste itself only opens and closes windows (U-009).
- **Shock on a fast foe** drains about as fast as it's laid, so it doesn't build. Only slow, Stunned or winding-up foes let it pile up.
- **Cooldown changes** are refunds, which is tempo or burst, unless the refund scales with a count that grows. I kept only the growing kind.
- **No bearing on build up:** Guard, Regen, Clarity, Lifesteal, Rot, Cleanse and Dispel, except as feeds or prices. Nothing about weapon hands or budget. Most of the unit conditions (casting, lower, kin, above, swing, top, topHp, canHeal, weapon, offhand, armor, acted).
- **Little that's distinct:** action_start, mp_gained (close to growth on a timer) and fight_won (the fight is over).
- **Foes' answers:** Dispel strips a build held as buffs, and Cleanse lifts afflictions. Those are the foes' plays, not the party's.
- **On bosses,** control resistance takes the Stun out of repeated Chill shatters, but their damage stays.

## Left out: they'd need a new system

- **A build that carries from fight to fight.** Statuses end with the fight, and the bounds rule out lasting more fights.
- **Cashing a build at a moment the player picks.** That's input during a fight.
- **Afflictions that spread to neighbouring foes.** That's geometry.
- **Combos between Burn, Chill and Shock as elements.** Elements are themes only.
- **A party-wide meter as a resource of its own,** beyond a counter one unit holds and others read by seat.
- **Units levelling up, swapping gear or learning abilities mid-fight.** That would be a new layer of the fight.
- **Status damage that crits or scales from its applier.** Bound: a status scales by its stacks, never by its applier.

## Contradictions and open rules

1. **`spend` against the ruling.** primitives.md has a `spend` op, but vocabulary.md rules that no ability spends a status early. U-037 is marked with this ruling.
2. **`apply` has a `duration` field,** but "nothing applies a status for less or more than its own length".
3. **The status `crit` field's `fromSource`** reads the applier's crit stats. That's against "scales by its stacks, never by its applier".
4. **Boosts that name a status are unclear.**
   - The tags table says the `<status>` tag reaches that status's pulses ("+20% Burn damage").
   - The `tags` status field says boosts act on an application's stacks, and damage-taken modifiers on its pulses.
   - vocabulary.md says the applier's damage boosts don't raise a status's damage.
   - Open: does a Burn boost raise the stacks it lays or the damage they deal? U-082 reads it as stacks.
5. **`spare`:** is it a field on Might itself? That would be a variant of Might, which "no variants" forbids. Or is it on another status that names Might? U-040 rests on it.
6. **`divert`** doesn't say what counts as "what the holder would gain" (statuses, heals, MP) or who "another unit" is. U-079 and U-093 rest on it.
7. **`spread`** splits damage evenly across the foes. It's silent on whether the stacks an application lays are split too (U-003).
8. **Party summons.** In primitives, `summon` brings units onto the actor's side, but combat.md only speaks of bringing in foes, and a party is three units. Open whether the party may summon (U-094).
9. **Enrage.** combat.md says every unit "deals more damage", but the damage order puts the dials on hits only. Open whether enrage raises a status's damage (U-095).
10. **Ticks with no known dealer.** A shared Burn tick has no known dealer, so its damage_dealt has no "whose". U-083 reads the foe's damage_taken instead.
11. **The `move` field on `remove`** is never defined.
12. **Owed on a foe.** Owed is described as a marker from the holder's own piece. Open whether the party may lay it on a foe (U-090).
13. **Might's "each action spends one stack"** doesn't say whether a recast or a strike out of turn counts as an action.
14. **How a stack drops.** vocabulary.md lists two ways a total drops (halve, or lose one), while primitives' `drop` takes any amount.
15. **Shield is called a Pool,** but absorbs are Intensity only, so a `stacks` scale can read a Shield. Open whether that's intended (U-089).
16. **`pay` aimed at an ally** (U-101) is allowed by the op's `to`, but nothing in the sources shows it.
17. **Seats as targets.** Seat-based scales and filters (U-075, U-080) read seats as ids, not positions. I've taken that to be inside the no-positional-targeting bound.
