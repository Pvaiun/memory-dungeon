# Survivability: the changes

The list to build, with the director's rulings of Nov 15 in it. Sizes are first values. The evidence is in `design.md`, measured before the last rulings.

## Statuses

| | Today | Change |
| --- | --- | --- |
| **Weaken** | −30% damage | **−50% damage.** Same length. |
| **Shock** | Hurts for each stack every time its holder acts. | The same, and **its holder's hits deal less for each stack.** First value 1% a stack; see the notes. |
| **Blur** (new) | | **Automatically dodges the next incoming hit,** then it's gone. It doesn't stack. Its miss counts as a dodge. |

## Hexer

| | Today | Change |
| --- | --- | --- |
| **Enfeeble** | Weakens the foe with the most Attack, adding Sunder. Quick cooldown. | **Weakens every foe. No Sunder. Medium cooldown,** longer than Weaken lasts. |
| Enfeeble, version A | Weakens every foe. No Sunder. | **Weakens every foe and adds Sunder to every foe,** at the size the old power step gave. |
| Enfeeble, version B | Sunder on the foe with the least HP. No Weaken. | **Weakens every foe and adds Shock to every foe.** |
| **Cold hex**, version A | Basic attacks add Burn, not Chill. | **Basic attacks add Chill and Burn.** |
| Cold hex, version B | Basic attacks Weaken their target, not Chill. | **Basic attacks add Chill and Shock.** No Weaken: on every swing it would never lapse, and Enfeeble would have nothing left to do. |

## Vampire

| | Today | Change |
| --- | --- | --- |
| **Blood drain** | Drains a random foe and Weakens it. | **Drains a random foe and adds a bit of Bleed.** |
| Blood drain, version A | 3 quick drains on a random foe, Weakening it. | **3 quick drains on a random foe, adding the same Bleed** across the three. |

## Ranger

| | Today | Change |
| --- | --- | --- |
| **Crit chance** | 16% | **20%** (+4%), on the class itself. |
| **Hunter's eye** (passive) | Basic attacks ignore Taunt and have +5% Crit chance. | **At fight start and on a crit: gains Blur.** Nothing else. |

## Frostweaver

| | Today | Change |
| --- | --- | --- |
| **Shatterpoint** (passive) | A foe whose Chill shatters gains Sunder. | The same, and **at fight start every ally gains a Shield of 15% of the Frostweaver's max HP.** |

## Notes for the implementer

- **Test several sizes of Shock's damage reduction.** The worry is that it makes boss fights irrelevant: a slow boss sits at Shock's cap. Report boss results at each size, and what happens when Weaken and Shock sit on the same foe (today the two would add up).
- **Tune the Hexer's Shock sources** (Enfeeble's version B, Cold hex's version B) so they're a real help to its party's survival, not a token stack.
- **Each changed passive's versions keep the new part:** Shatterpoint's keep the opening Shield, Hunter's eye's keep Blur.
- Nothing else changes: no piece, formation or mythic, and not the Stormcaller, Pyromancer or Bard.

## additional details

1. **The Ranger's basic attacks no longer ignore Taunt.** I read "remove the taunt mention" as removing the effect, not only the words. It costs the Ranger its reach past a Taunting front, and both of Hunter's eye's versions say "ignore Taunt" today, so they and its power step (+9% Crit chance) get rewritten at build.
2. **Enfeeble's power step becomes a shorter cooldown and lower mana cost.** still longer than Weaken lasts. With no Sunder on the base there's nothing for the old step to grow.
3. **Blood drain's Bleed** is "a few" stacks, read from Attack.
