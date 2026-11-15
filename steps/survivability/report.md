# Survivability: the report

Built from the director's list (`changes.md`, with the rulings of Nov 15). `design.md`, which the list cites for its evidence, isn't in the repo, so everything below was measured here, on main's build-test parties (with the fix that stops pieces fighting their formation).

## Decisions

1. **Shock's cut on hits: keep it at 1% a stack** (`STATUS.shock.hits`). The worry was right in shape: Shock's size moves bosses for the Storm and barely for anyone else. Against Storm parties, 96–99% of a boss's hits come while it's Shocked, at about 29 stacks, and 35–41% at the cap (40). Storm boss wins, by the cut a stack:

   | | before | 0% | 0.5% | 1% | 1.5% | 2% |
   | --- | --- | --- | --- | --- | --- | --- |
   | Storm, rung 2 | 37% | 48% | 59% | 70% | 74% | 87% |
   | Storm, rung 3 | 28% | 44% | 57% | 69% | 78% | 91% |
   | Every build, rung 3 | 62% | 69% | 71% | 73% | 75% | 77% |

   At 1% the Storm goes from the weakest build against bosses to about the bosses' 60% target. At 2% it wins nine act III bosses in ten. 0.5% is the softer choice if 1% plays too strong.

2. **Weaken and Shock add up. Keep it, at 1%.** At the cap the two cut a foe's hits by 90% (Weaken's 50 plus Shock's 40). At 2% a stack they'd cut 130%, so nothing would get through. In play they meet on 8–16% of a boss's hits against the Storm (about 35 stacks, so cut about 85%), and on 36% against the Toll at rung 2 (about 13 stacks, cut about 63%). Multiplying the two instead would cap them at 70%, but every boost in the engine adds (Might too), so that's a rule change, and I don't think the numbers need it.

3. **The whole list makes fights cheaper, not only bosses easier.** No knob was moved. The "All" rows of the build test's By tier table, before and after:

   | | Regular, cost | Elite, cost | Bosses won |
   | --- | --- | --- | --- |
   | Rung 1 (act I) | 15% → 13% | 26% → 22% | 58% → 68% |
   | Rung 2 (act II) | 18% → 15% | 32% → 25% | 58% → 69% |
   | Rung 3 (act III) | 19% → 16% | 36% → 31% | 62% → 73% |

   The gain lands where it was aimed:
   - The builds without a wall: Cold Snap's act III regular fights cost 23% of its HP, not 38%; its elites 47%, not 61%.
   - Bosses: the Storm (above), the Hunt at rung 1 (28% → 67%) and the Toll at rung 1 (17% → 31%).
   - Landslide, Bonfire and Blood Pact barely move. Act III bosses spread 28–96% by build before and 52–96% now.

   Two ways to go:
   - **(a) Leave the knobs (my pick):** the step is the weak builds' survival, and re-setting the knobs would take it back from everyone.
   - **(b) Re-set the bosses** with `rogue:tune` to bring the average back to target.

4. **The Ranger's crit sits on the Assassin's word** (20%, the class line's 5). That's your ruling. Note it, since a stat line is a signpost. It's also the change that moves a class most. On the balance sheet's rogue set, parties with the Ranger win 8.0 points over parties without it, up from 4.1, at the band's edge (±8). The Hunt's and Thousand Cuts' Rangers are much of the bosses' gain above.
   - Other classes moved less: the Frostweaver −4.4 → −1.6, the Stormcaller −6.5 → −5.3, the Hexer +0.2 → +1.1, and every other class within about 1.5 points.
   - The Cleric was outside the band before (−8.7) and is now −9.3: the walls' new layers leave its heals less to do.
   - If the Ranger reads too strong in play, its crit back at 16% is the first lever: Dodge rides on its crits.

## What I chose where the list left it open

- **Hunter's eye's power step:** +5% Crit chance on every hit (`KIT.hunterCrit`). More crits means more Dodges. Quarry keeps aiming at the foe with the lowest HP%; Quick draw keeps its ready swing. Both keep the Dodge, and neither ignores Taunt any more.
- **Enfeeble's power step:** its cooldown goes from 27.1 ticks to 23, and its cost from 650 MP to 450. The short word would give 19.8 ticks, under Weaken's 20, and the Weaken would never lapse. Wither's Sunder is the few word ×1.4, the old step's size.
- **The Hexer's Shock** (decision-free, but you asked for it):
  - **Withering hex** (Cold hex B) lays Shock on every swing at the size the Stormcaller's Arc lays.
  - **Shackle** (Enfeeble B) lays the several word on every foe. At the few word it was a token: Shock halves every time a foe acts, so one cast was about 4 stacks by the foes' swings, a 4% cut.

  With both, a Hexer party takes about a quarter less damage from bosses (act III: 80% → 60% of its HP a fight, bosses won 75% → 89%), a fifth less from elites, and an eighth less from regular fights. Foes hold 7–15 stacks when they swing. Measured with every Hexer party's Hexer on both versions, against the same party with the Shock taken out.
- **Blood drain's Bleed:** the few word from Attack, on an ability (about 5–6 stacks at Attack 4). Savage drain lays a third of it on each of its 3 hits.
- **Shatterpoint's opening Shield** is 15% of the Frostweaver's max HP on every ally, itself included (`SHATTERPOINT_SHIELD`). Every version keeps it, and the power step doesn't grow it.
- **Tags:** I tagged Withering hex for the Storm and Cold Snap (Withering hex used to be the Toll's), and Shackle for the Toll and the Storm. So the Storm's Hexer now takes both, and Cold Snap's Hexers take Withering hex.

## Built

- **Dodge,** a new status (`dodge` on a status in the schema; engine 0.28, schema 0.14). The next hit on its holder misses whatever its Evasion and the attacker's Accuracy, and the Dodge is spent. Its miss fires as a dodge, so whatever answers a dodge answers it. It doesn't stack. It has a test in `creative.test.ts`.
- **Weaken** is −50%. **Shock** cuts its holder's hits 1% a stack, read when the hit lands (before Shock drains for the action).
- **Hexer:** Enfeeble Weakens every foe on a medium cooldown. Wither adds Sunder, and Shackle adds Shock. Hex of flames adds Chill and Burn, and Withering hex Chill and Shock.
- **Vampire:** Blood drain and Savage drain add Bleed, and Drain the well says "No Bleed."
- **Ranger:** Crit 20%. Hunter's eye gives Dodge at fight start and on a crit, and nothing ignores Taunt.
- **Frostweaver:** Shatterpoint opens each fight with the Shield on every ally.
- **Documents:** the vocabulary (Weaken, Shock, Dodge, 27 statuses), the four classes, the primer, and two stray mentions of Hunter's eye's Taunt (the Summoner trio, the Avenger's answers).

## Side effects to know

- Foes use these statuses too. The enemy Curse now Weakens the party for −50%, and foes that Shock (Static, Tempest) soften the party's hits a little a stack.
- **Dodge has no icon yet.** It joins the statuses waiting for the art pass, and the icon test lists it.
- The piece check passes: every changed form fires. The balance sheet's other flags are unchanged in kind: the free-play class lines, the never-worn kinds and the statuses that never fire.

## How sure

- **The build test:** six seeds, every build party, against its own act's fights.
- **The Shock and Hexer probes:** scratch scripts that read the fight at each foe hit (in `out/surv/`, not kept).
- The Shock sizes are clear at the Storm's end; elsewhere they sit within the seed noise.
- The whole-run numbers weren't measured.

## Worth looking at

- A Storm boss fight with the Hexer: Weaken and Shock together on one boss (`npx tsx tools/rogue-feel.ts --builds storm`).
- A Hunt rung 1 boss: the Ranger's Dodges against a slow, heavy hitter (`--builds hunt`).
