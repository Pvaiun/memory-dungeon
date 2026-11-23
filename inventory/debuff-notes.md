# Debuff or disable: notes

140 plays in `debuff.json` (D-001 to D-140). By question: size 52, timing 39, width 36, price 13. 26 need a block, 4 need a ruling.

## What was swept

- **Statuses:** all 27. The plays split them into these families:
  - control: Stun, Silence, Slow, Chill
  - cuts to what foes deal: Weaken, Shock
  - targeting: Fixated, Bewildered, Marked, plus Taunt and Hidden used against foes
  - raising what foes take: Sunder, Brittle, Bleed
  - healing: Rot
  - foes' buffs, each through Dispel
  - Owed, Doom and Bulwark
- **Special stats:** Accuracy, Evasion, Thorns, Siphon, Double strike, Crit damage and the three speed stats.
- **Effects:** Area, Seek, Dispel, Cleanse (the foes'). Every effect op was checked. These are used: `cooldown` on foes, `mp`, `pass`, `share`, `riders`, `recast`, `one`, `strike`, `trade`, `fell`, `replace`, `restart`, `spend`, `pay`.
- **Status fields:** every field was read as a debuff laid on a foe.
- **The rest:** every event, condition, scale source, target pick and cooldown change. Also control resistance, enrage, the weapon kinds' speed, swing and hands, and the formation's seats and party effect.

## Thin or empty, and why

- **Burn, Regen, Clarity, Heal, Revive, Shield and Guard as the party's tools:** these are damage or sustain. Here they appear only as foe buffs to strip, or as damage that Sunder raises.
- **Weapon scaling and hands:** nothing in debuff turns on them. A two-hander only costs the offhand a disable might ride on.
- **Folded in or dropped, because they play like a play already listed:**
  - Attack-down on a foe, and a narrow version of Sunder that names one kind of damage (they play like Weaken and Sunder).
  - A healing cut on a foe healer (plays like Rot on every foe).
  - Bewildered or Brittle that last for a while (upkeep covers them, D-042).
  - Using `drawBy` or Aggro to steer the party's own picks (plays like Marked).
  - `tireless` (plays like D-129).
  - A foe's revives made weaker (revivers fall under D-017).
- **Foes' own Seek abilities** (Fickle, Skips the tank) get past Fixated and Taunt. Only Silence, Stun or Hidden answer them.
- **The price question** stays the thinnest. Most disables cost cooldown, MP and slot order alike, so price only sets a play apart where the cost is HP, dice, being hit, or a unit's life.

## Left out: they'd need a new system

- Turning a foe to the party's side for a while (a change of side).
- Taking a foe's ability into a party unit's kit in mid-fight.
- Pushing a foe out of reach or range (geometry).
- Lowering a foe's rank in mid-fight so it stops resisting control.
- Emptying a foe resource other than MP, such as a charge or rage meter (no such resource exists).
- Anything elemental (a weakness or resistance) or set off by player input.

## Contradictions and open rules

1. **Status length.** `apply` has a `duration` field, but the vocabulary rules that nothing applies a status for less or more than its own length.
2. **Owed.** The vocabulary says "nothing lifts it but its coming due". The primitives say a remove that names a marker lifts it, and `pass` moves markers. D-108 depends on which holds.
3. **Statuses that deal hits.** The vocabulary says a status can be given a hit's damage (the Bomb Bug). The primitives say damage in a pulse or reaction is never a hit.
4. **Foe MP.** Whether foes hold MP pools isn't said; `mpBelow` notes that some units have none. D-036, D-037 and D-126 depend on it.
5. **Timers under Stun and Silence.** Whether cooldowns and swing timers keep running isn't said (bears on D-013).
6. **Shock's order.** It isn't said whether Shock's cut reads the stacks before or after the halving on the same action (D-008).
7. **Slow mid-wind-up.** Slow stretching a wind-up already under way rests on sub-ticks, which Known gaps leaves open (D-023).
8. **When a foe picks its target.** Whether a foe's ability picks its target at the wind-up's start or as it resolves isn't said (D-044).
9. **Bulwark.** As written it only harms its holder: what it gives the holder while it stands isn't said. Nor is whether its Stun counts toward control resistance.
10. **A hole in control resistance.** It covers only Stun, Silence and Slow. These all sit outside it:
    - cooldown changes on foes (D-030 to D-034)
    - tempo changes made through `mods` (D-116, D-124)
    - Chill's slow
    
    A party can lock a boss's swings or abilities and never see RESISTED. This is likely a hole.
11. **Unstated meanings.** `remove`'s `order` field has none given. Neither does `{ times }` above 100 on a cooldown, nor what counts as a "gain" for `divert`.
12. **Removing what a stat brings.** It isn't said whether Dispel can remove a status that a stat brings (Thorns, Lifesteal) while the stat is still above 0.
13. **Blur's kind.** Blur's `dodge` isn't in the effect kinds list, so removal or immunity by kind can't name it.
14. **Buff or debuff.** The vocabulary says every status but Owed is a buff or a debuff, yet the primitives keep a `marker` label for bookkeeping (D-127).
15. **Leaving the fight.** combat.md rules that no unit leaves a fight alive, yet `replace` makes its target leave the fight (D-104 is marked as needing that ruling).
16. **Aiming at one's own side.** It isn't said whether `mods.target` may aim a damage effect at the actor's own side (D-046).
17. **Time left on a status.** No condition reads it, and refreshing "counts as doing something". So upkeep can't wait for a status to lapse; it simply fires on cooldown.
18. **Same-moment order.** The party's batch resolves first, and debuffs' pulses resolve in their holder's foes' batch, so ties go the party's way. Known gaps leaves this open.
