# Step 5j report: the cleanup

Oct 29, 2026. 5h and 5i are merged (pull requests #41 and #42). The base game now runs on your rules from 5i: two kinds of damage, no elements, and gear in four slots. Nothing was balanced or tuned. `build.md` lists every change; this page is what needs you.

## What needs you

Nothing blocks the next pass. These surprised me, or will change how the game plays before anything is tuned:

1. **The re-sort leaves some classes with almost no loot of their own.**
   - The Frostweaver's weapon pieces were all fast staves (ice, wind), which went to the wand, and it wears the rod and staff. It keeps a plain rod and the five staff pieces.
   - The wand now holds ten pieces. The rod and the rune sword have only their plain ones.
   - The Hexer, Vampire and Valkyrie lost their staves, and the Bard its dagger.

   The next pass makes the loot anyway, so I left this as your rules made it.
2. **Bulwark on every hit is a big change for the Ice Titan.** Against the hand-built rosters at act II's boss level, it breaks about 2.9 times a fight (was 1.1). The fight runs 60 ticks (was 84), since each break stuns the Titan and doubles what it takes. If that turns the Titan into a pushover in play, the alternative is physical hits only.
3. **Three regions lost their element puzzles.**
   - The Ice Spirit no longer absorbs Ice or melts to Fire. It's a plain caster minion with Rime.
   - Nothing in the Fire Mine resists Fire anymore. Mages there used to print slivers.
   - The themes' small per-element lifts and dips are gone everywhere. Magic meets only Magic resist by rank (10, 15, 25), and the Ghost's 75.

   That makes magical parties relatively stronger where those puzzles were. You asked for no new puzzles, and there are none.
4. **Four classes arrive two-handed:** the Ranger and the Bard (a bow), the Pyromancer (a staff), the Geomancer (a great weapon). Their offhand stays locked until they hold their other weapon kind. It changes nothing until offhands exist. If starters should arrive one-handed, it's a one-line swap each.
5. **The simulated player won 3% of 200 rogue runs (6% before).** That's noisy at this size and nothing was retuned, but it leans harder, mostly in act I. Your next balance pass will set it.
6. **The primer is about twice its 2,000-word target.** It already was before this step. I added this step's lines and didn't compress the rest.

## What was built

- **Damage:**
  - Physical meets Armor and Evasion as before.
  - Magical meets Magic resist, one percentage stat (100 is immune), and is never dodged.
  - Burn, Shock, Bleed, Chill's shatter and Thorns are untyped and never resisted.
  - Ward gives Magic resist.
  - Weaknesses and absorption are gone. The words WEAK and ABSORB no longer appear.
  - Schema 0.7, engine 0.16.
- **Abilities:**
  - Each keeps its type minus the element. Frost arrow, Burning fist and Blood drain are physical, since their classes' weapons all are.
  - Texts that named an element as a damage type now say physical or magical. Themes stay in names ("A bolt of fire…").
- **Classes:**
  - Each wears its weapon kinds, armor types and offhand kinds from `builds.md`.
  - The four classes with elemental resistances lost them.
  - The Hexer: Attack 3 (was 1).
  - The Geomancer: Tremor scales from Armor.
- **Enemies:**
  - Elemental attacks are magical, including the Bomb Bug's death blast. That blast goes off through a status, so the rule that a status's own damage is untyped could also claim it. I read it as an enemy's attack.
  - Rank resistance is Magic resist.
  - Bulwark chips on every hit.
- **Gear:**
  - Four slots, eleven weapon kinds with hands (a two-hander empties the offhand), four armor types, ten offhand kinds, and mythics as a rarity that names one class (crimson).
  - Today's loot is re-sorted as your tie-breaks said. The three resistance-only charms and four resistance affixes are gone.
  - The offhand slot and mythics exist with no pieces yet. The next pass makes them.
- **The rogue's hidden aims and the tuning rosters:**
  - Each legendary's aim is narrowed to classes that can still wear it.
  - Six rostered legendaries that no longer fit were swapped for ones that do.
- **The retired campaign and free play** still run, with the minimum edits.
- **Interface:** see below.
- **Documents:**
  - The four core-set documents, `DECISIONS.md`, the primer, the concept spec and `ui/README.md` are in line with the build.
  - `PRIMITIVES.md` is regenerated.

## The numbers

None were tuned. They moved where the rules moved them: magic past weaknesses and resistances, three abilities now against Armor and Evasion, the mace swinging slow, the wand a little faster than the lightning staff. Tests (321), typecheck, validation and smoke pass. 200 simulated rogue runs play end to end.

## Interface

- Element words and rows are gone.
- Damage reads PHYSICAL (pale), MAGICAL (violet) or UNTYPED, and numbers are coloured by type.
- Magic resist shows as **RES** beside HP, ATK, MAG and ARM.
- The battle says RESIST only when Magic resist took a quarter of a hit or more. Every regular foe now carries 10, which would otherwise put RESIST on every spell.
- Four gear slots, with the offhand LOCKED under a two-hander and two-handers marked 2H.
- Mythics are crimson.
- Elemental looks stay as art: Frost arrow still shows ice, though it's physical now.
- The new weapon kinds, armor types and offhands use stand-ins from the packs until your art arrives.
- A rogue run saved before this step is set aside on load. The leaders, heat and record stay.
- `ui/README.md` lists these decisions. The two I'm least sure of are the RESIST threshold and some offhand icons (a harp for the horn, a jar for the bell).

## Method notes

- The brief's rules settled almost everything. The tie-break list was nine items, and you took every default. Writing the change list before the documents let three agents bring the four core-set documents in line in parallel, each checking against the content.
