# Report: one kind of damage (prototype)

Built as you described it: no Magic, no Magic resist, and Armor renamed Defense. Every hit meets Evasion and Defense, and only a status's own damage gets past them. The game plays, all 414 tests pass, and the documents describe it. Intent: `intent.md`. What was built: `design.md`.

Numbers below are the balance sheet's: 96 parties, every free-play run and rogue fight, one seed. Old and new are both on freshly calibrated knobs. The committed knobs turned out to be stale even for the old game, so I recalibrated both versions to compare like for like.

## Decisions for you

1. **Keep the direction?** I think yes. The conversion is faithful where it should be: the Old Road, whose foes were all physical, calibrates to the same knobs as before (normal fights 35 → 32, its bosses −6 → −11). Rogue fights won at calibrated knobs went from 80% to 82%. Class damage shares moved a little, not a lot. The one real shift is item 2.

2. **Walls are stronger everywhere, and fights run longer.** This is the price of one defense stat. Spells used to slip past a wall's Armor; now the wall's Defense cuts them too, and its formula cuts small hits hardest.
   - Damage cut on the Knight: 41% → 57%.
   - Win points over Neutral for the wall formations:
     | Formation | Before | Now |
     | --- | --- | --- |
     | The mountain | +15 | +23 |
     | The choir | +12 | +20 |
     | Heavy line | +13 | +19 |
     | Hearth | +10 | +17 |
     | Shieldwall | under the band | +11 |
   - Fight length: regular fights 45 → 51 ticks, bosses 66 → 76. Fights reaching the enrage went from 10 to 73 (of 9,696). The party is out of MP 8% → 14% of the time.
   - The knobs can't fix length, because they raise foe HP along with damage.
   - **Options:**
     - (a) Accept it: walls answer hits, statuses answer walls. Lean on big blows and statuses in enemy design.
     - (b) Lower `RULES.armorK`: Defense counts for less everywhere, on both sides.
     - (c) Trim the walls' own Defense and Guard (`STATUS.guard`).
   - **I'd test (c) next.** The excess is in walls drawing hits, not in Defense as a whole: foes' Defense took 27% of the party's hits, about what Armor and Magic resist took before (25% and 18%). Option (b) would also move the Old Road, which matches today.

3. **Burn and Shock grew past their band.** Every focus piece's +1 Attack raises every stack by a fifth to a quarter, and the casters' swings shrank. Each status's share of its appliers' damage, against a band that tops out at 35%:
   - Burn: 33% → 40%
   - Shock: 30% → 42%

   I'd trim `BURN_STACKS` and `SHOCK_STACKS` by about a fifth rather than cut the focus Attack, since the Attack is what makes the weapon choice mean something.

4. **Three casters came out weaker, all through their swings.**
   - The Frostweaver is the weakest dealer: 0.72 → 0.59× the average unit's damage, and parties with it win 13 points less (14 before).
   - The Stormcaller is newly flagged: its parties win 11 points less. Arc rides on its basic attack, which is now a light focus swing into Defense.
   - The Cleric is newly flagged: its parties win 10 points less. Its damage halved (0.46 → 0.25×); its healing went up.

   **Options:** soften the focus swing for everyone (`FOCUS.ratio` back to medium), or fix the three one by one. The weapon probes say the trade is close to fair. For the five classes that can wear both kinds, the striking weapon now wins by 1–2 points, about the noise. So I'd fix the three one by one rather than move `FOCUS`.

5. **The Ghost is Incorporeal:** it takes half of every hit, and statuses hurt it in full (`INCORPOREAL`).
   - At three-quarters off, it outlived everything in its fights (2.5× the median minion's life). At half it lives 1.8×; as Spellward it lived 1.5×.
   - The alternatives were very high Defense (a second Skeleton) or very high Evasion (a second Bat).
   - Your call whether a cut to hits on one foe is readable enough. It's on its card.

6. **Ward is "takes less damage from hits":** a 20% cut (`STATUS.ward`), with statuses landing in full. Guard adds Defense, which big hits punch through; Ward cuts every hit alike. The Paladin is now "Shelter", and Sanctuary matters in every region instead of only against casters.
   - The alternatives were Ward as more Defense (a second Guard), or retiring Ward and giving the Paladin something else.

7. **Dodger and Armored shell lost their Fundamental answer.** Magic was the only one listed for each.
   - Dodger is left with Accuracy (a Specialist; only the Ranger has it) and statuses. The Bat now dodges 40% of the party's hits, where it dodged 22% while spells passed it.
   - Armored shell is left with big hits.
   - The starters still answer all three Crypt challenges, through the Ranger alone.
   - Do you want a Fundamental answer to Dodgers, such as Accuracy on more commons?

## What was built, and my calls beyond your words

- **Classes:** each class's Attack is the higher of its old Attack and Magic. Rally's share is trimmed so the Valkyrie's heal stays its size (`RALLY`).
- **Weapons:**
  - The six striking kinds swing as before.
  - The five focus kinds (rune sword, mace, wand, rod, staff) swing at about half: base and ratio at low (`FOCUS`).
  - Every focus piece carries +1 Attack, and its card shows the total ("Attack +3." on the Morningstar).
- **Gear:**
  - Every +Magic is +Attack. A piece that gave both trades the second point for HP or Crit.
  - Armor types already leaned the way you asked, so nothing moved between them.
  - Your new gear direction (identity from ratio and scaling, Attack by armor weight) isn't written into `docs/rules.md` or `philosophy.md` yet. It goes in when the step closes, if you keep it.
- **Enemies:**
  - No Magic resist.
  - Every spell is now a hit, so it can be dodged and meets Defense. At first the caster foes landed only about 40% of their old damage, so I resized them:
    - The casters' touches went from weak to heavy (`CASTER_TOUCH`).
    - Brand, Hailstorm, Tempest and the Bomb Bug's blast grew (`ENEMY_HIT`).
  - After that, the knobs match the old game region by region, except regular fights in Tower Top and the Ice Pass, which are still soft. Their knobs are 30 points higher than before.
- **Knobs:** every rogue fight is recalibrated (`rogue-knobs.json`).
- **Engine:** a hit's rider rolls Evasion on its own, as a physical rider always did. That now applies to every rider. It's the existing rule, and I kept it.
- **Interface:**
  - The sheets show DEF, with no MAG or RES. Hits are one colour.
  - With RESIST gone, nothing in the fight says a hit was cut. Ward and the Ghost just show smaller numbers.
  - Spell names aren't violet any more.
  - Frost arrow, Burning fist and Blood drain now read as spells, because their looks are themed. That's a one-line fix if you want it.

## How sure

- **Direction:** fairly sure, on one seed of a broad spread.
- **Exact sizes:** not sure. Every constant named here is a first value.
- **Not done:** I didn't do a feel read. These are the fights worth reading first:
  - a Ghost fight: `npx tsx tools/rogue-feel.ts --rosters --fights haunted_hall,ghost_lights`
  - a Tower Top fight: `--fights barracks,watch`
  - a wall formation (The mountain) against the Old Road
- **The interface** runs from this branch with `npm run ui`. GitHub Pages only publishes main.
