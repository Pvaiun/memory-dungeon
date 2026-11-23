# Sustain: notes

176 plays in `sustain.json`: S-001 to S-176. By question: timing 53, size 48, width 47, price 28. Seven need a small new block and three need a ruling changed.

## What I swept

I went through each family in `vocabulary.md`, `combat.md`, `primitives.md` and `gear-rules.md` in turn, asking all four style questions of each.

- **Statuses, all 27:**
  - Kept on the party: Regen, Shield, Guard, Taunt, Hidden, Aegis, Blur, Clarity, Haste, Owed.
  - Laid on foes to cut their harm: Weaken, Slow, Chill, Shock, Stun, Silence, Fixated, Bewildered, Marked, Dispel of Might and Haste.
  - Foes' harm to answer: Rot, Bleed, Burn, Shock, Chill's shatter, Sunder, Brittle, Doom.
  - Checked, with no sustain play: Might, Bulwark.
- **Stats:**
  - All ten special stats.
  - The stats every unit has: max HP, max MP, MP regen, Defense, Aggro and draw.
  - healing_received, and the immunity stat families.
- **Effects:** Heal, Area, Cleanse, Seek, Dispel, Revive.
- **Effect ops:** all nineteen, every cooldown `which` and `set`, and every `to`.
- **Status fields:** all of them, with the labels, reactions, every `mods` field, crits by condition and the effect kinds.
- **Events and filters:** every event, `whose`, the status-ended causes and the event filters.
- **Conditions and numbers:** conditions and unit conditions, scale sources and counts.
- **Target rules:** side, pick, `by`, `ifNone`, `exclude`.
- **Combat rules:**
  - Slot order, MP paid on resolve, firing and waiting, fizzle statuses, the Shield cap skip, lost casts, interrupts, the opening, enrage.
  - The Taunt and Hidden rules, "someone stays in the light", every target phrase (the enemy-only ones included), and the order damage resolves in.
- **Weapons and formations:**
  - Every weapon kind's speed, hands, swing, scaling, budget and leaning.
  - The formation's seats and party effect.

## Where the space was thin or empty, and why

- **Weapons.** Only speed and swing change how a fight plays for sustain: they set how often mending and fuel from hits arrive, and how lumpy they are against Defense. Hands, scaling, budget and leaning only change which stats a unit carries.
- **Formations.** A seat and a party effect carry stats and statuses, so their plays are draw (Aggro on seats), the opening (fight_start), fuel (MP regen) and stat trades. Plays that aim protection at a named seat are left out; see the third item under contradictions.
- **Pieces with no sustain reading.** Might, Brittle, Sunder, Accuracy, Thorns and Seek. The ops and fields strike, riders, adds, echo, borrow, aim, order, spare, damp, oncePerEvent, single, fell and replace. Marked appears once (S-151) and Crit damage once (S-011).
- **Bulwark** hurts whoever holds it, and laid on foes it isn't sustain.
- **Doom** appears only as something to answer: top it off (S-024), soak it with Aegis or Shield (S-065), Cleanse it (S-110). I read a foe's Doom landing on the party as the foes' play, not the party laying or holding it, so these plays carry no ruling mark. If the director reads it the other way, the same ruling applies to all three.
- **Carry between fights.** HP, MP, knockouts and cooldowns carry from fight to fight, and Revive can raise a unit knocked out in an earlier fight. Every play built on that is about lasting more fights, so none is kept, and nothing reacts to fight_won. S-015 uses only the fight's own opening.
- **Reacting to a shatter.** Reactions resolve the sub-tick after their event, so nothing can answer an ally's Chill shatter once it has capped. The only answer is cleansing before the cap (S-113).
- **Passing buffs on a knockout.** A fallen unit's statuses end unless they survive the knockout, so a dying unit can't hand on its Shield or Regen.
- **Fields that change only what an effect reads.** `revives`, `rescale`, `set`, and the conditions `kin`, `weapon`, `offhand`, `armor`, `above`, `lower`, `acted` and `top`. They change who or what a sustain effect reads, but no fight plays differently for it.
- **The guard role that only stops one hit (Aegis)** is the most crowded corner. Aegis, cover, Owed and the ceiling block (S-170) meet there. I kept each meeting only where the fight changes: one blow stopped, many small hits lumped into one, a hit moved, every hit capped.
- **Sustain can't win a fight alone.** Past a set time the enrage raises every unit's damage, and the engine counts a fight stopped at 5,000 ticks as a loss. Every sustain play still needs a kill behind it.

## Left out: would need a new system

- A heal or a defensive cooldown fired by hand during the fight: input during a fight.
- A front line that shields a back line, or cover by reach: battlefield geometry.
- Swapping a benched unit in for a failing one mid-fight: a new layer, the bench in the fight.
- Potions or healing charges separate from MP: a new resource.
- Shields or mending kept from one fight to the next: outside the fight, and about lasting more fights.

## Contradictions and open rules in the sources

1. **`spend`.** The op takes stacks off a status, but vocabulary's ruling says no ability spends, shortens or sets off a status early. S-176 asks for the ruling. I didn't use `spend` to thin an ally's affliction.
2. **Revive's `ready` field.** `revive` has a `ready` field, but vocabulary says a revived ally comes back with every action on full cooldown. S-122 rests on the field.
3. **Targeting by seat.** In primitives, target rules, conditions and scales can name a `seat`, and `next` / `previous` wrap round the seats. But gear-rules says seat order only breaks targeting ties, and the bounds forbid positional targeting. I kept no play that aims protection at a seat. Hidden's rule that "the last in seat order stays out" (S-094) already uses seat order for more than ties.
4. **The HP floor.** combat.md says "HP floors at one", but units are knocked out at 0 HP.
5. **`move` on `remove`** is listed but never defined. S-114 reads it as sending the lifted statuses to the target.
6. **Siphon.** It's open whether Siphon gives anything against a foe with no MP pool (S-130, S-131, S-142).
7. **Summoning on the party's side.** The op allows it ("on the actor's side"), but combat.md describes summoning as bringing in foes and a party as three units. S-092 rests on the op. It may need a ruling.
8. **Where MP comes from.** The ruling says no class regains MP in a fight by itself and that regen comes only from gear and a seat. Yet Clarity can be cast on oneself, and `mp` and reactions give MP freely. I put the MP-gain reactions on pieces (S-036, S-061, S-079, S-134, S-137, S-138, S-139). On a class's kit they would run into the ruling.
9. **Thorns** is a stat that brings a status. It's open whether "no lifesteal from a status's damage" also bars mending from Thorns damage. No play uses it.
10. **rewind and trade** are "not healing". It's open whether they get past a healCap or the `heals` rule.
11. **A foe's target during its wind-up.** It's unclear whether a foe's action has a chosen target while it winds up or picks only as it resolves. S-172's block assumes the target can be read.
12. **Sharing a Shield.** `share` copies only "a status laid at a moment: one with an icon that has a duration, stacks or a block". The Shield pool has none of those, so it's open whether a Shield can be shared. S-163 names only Regen, Guard and Aegis.
13. **Taunt calling foes early.** Taunt "calls a foe's action early" exists only as a combat ruling. The engine's terms say neither how early nor which actions (S-085).
14. **hp_low from an HP price.** hp_low fires on a price, so a unit can set off its own line on purpose (S-100). It's worth confirming that's wanted.
15. **Immunity to pulses.** An immunity to every pulsing status may also shut out the holder's MP regen, if that stat brings a pulsing status (S-108).
