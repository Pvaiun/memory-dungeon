# Aggro: the rule

## Aggro

Every unit's Aggro is centred on 100. A class's or enemy's Aggro word n (1 to 5) is **70 + 10n**:

| Word | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Aggro | 80 | 90 | 100 | 110 | 120 |

Gear and formation slots add to it as before: ±10 a step (Veil −20, Warhorn +20, Wall +20, Behind −10). Aggro is clamped at **1** and is never negative.

## Draw

Foes don't pick in proportion to Aggro. They pick in proportion to **draw**, which comes from Aggro through a curve. Let d be how far a unit's Aggro is from 100:

- **Aggro above 100:** draw = 100 × (50 + 3d) ÷ (50 + d)
- **Aggro below 100:** draw = 100 × (50 + d) ÷ (50 + 3d)

A unit's chance to be picked is its draw divided by the total draw of all the units that can be picked.

- An ordinary unit (Aggro 100) draws 100.
- No unit ever draws more than 3 times (300), or less than a third (33), as often as an ordinary unit.
- +d and −d cancel exactly: draw(100 + d) × draw(100 − d) = 10,000.
- The 50 sets how much the first steps count. A smaller number gives a steeper middle, and a bigger one a flatter middle.

## Example values

| Aggro | 1 | 40 | 60 | 80 | 90 | 100 | 110 | 120 | 140 | 160 | 200 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Draw | 43 | 48 | 53 | 64 | 75 | 100 | 133 | 157 | 189 | 209 | 233 |

## Example parties (Knight / Cleric / Ranger)

| Aggro | Draw | Share of picks |
|---|---|---|
| 120 / 90 / 90 | 157 / 75 / 75 | 51% / 24% / 24% |
| 140 / 60 / 70 | 189 / 53 / 57 | 63% / 18% / 19% |
| 170 / 50 / 50 | 217 / 50 / 50 | 68% / 16% / 16% |
