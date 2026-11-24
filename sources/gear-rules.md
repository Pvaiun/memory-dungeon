# Gear rules: weapons and formations

The weapon kinds and formations as rules. Which classes wear what is left out on purpose.

## Weapons

Twelve kinds, each a speed, hands and three words: a swing, a scaling and a budget (`KIND_WORDS` in `scale.ts`). Every class uses three kinds, at least one of them one-handed. There's no melee or ranged: the kinds are there for different speeds, different swings and the fantasy. Each kind's interval is in `KIND_SPEED`: fast is under 7.5 ticks, slow over 10.5.

- **Swing:** how hard the kind hits per tick at the reference Attack: light, full or heavy (`SWING_POWER`). A swing's size per blow follows its interval, so a fast kind hits for less per blow and a slow one for more.
- **Scaling:** what share of that swing is the wearer's Attack: base-heavy, even or Attack-heavy (`SWING_SCALING`). A base-heavy swing works for any wearer; an Attack-heavy one turns the wearer's own Attack into damage and rewards stacking it. Attack is never the leaning of an Attack-heavy kind, so the Attack a sword or great weapon carries feeds the wearer's abilities rather than cancelling against its own swing.
- **Budget:** how many stat steps the kind's pieces carry at each rarity: lean, standard or rich (`KIND_BUDGET`). A kind pays for its swing in budget or the other way round; a two-hander takes both sides, being worth a weapon and an offhand.
- **Leaning.** Each kind has a leaning: a few stats its commons draw on (*Gear design: the loot*, Commons and uncommons by kind). Every other piece's stats are its own, at most half of them on the leaning, so a kind's pieces don't all pull one way.
- **Within a kind,** the words are the default. A piece may step along the trade (a heavy piece swings harder for a step fewer, a light one lighter for a step more: `SWING_TRADE`), take another scaling, or swing from another stat (the Heartsplitter's max HP), and its card says so. Rarity buys stats and effects, never the swing. Every piece carries stats at every rarity.

| Weapon | Speed | Hands | Swing | Scaling | Budget | Leaning |
| --- | --- | --- | --- | --- | --- | --- |
| Dagger | Fast | One | Light | Attack-heavy | Standard | Crit chance |
| Fist weapons (knuckles, claws, cestus) | Fast | One | Light | Even | Standard | Double strike |
| Wand | Fast | One | Light | Base-heavy | Rich | Cooldown |
| Sword | Medium | One | Full | Even | Standard | Attack |
| Spear | Medium | One | Full | Even | Standard | Aggro |
| Axe | Medium | One | Heavy | Attack-heavy | Lean | Lifesteal |
| Bow | Medium | Two | Heavy | Attack-heavy | Standard | Crit damage |
| Rune sword | Slow | One | Full | Base-heavy | Standard | MP regen |
| Hammer | Slow | One | Heavy | Base-heavy | Lean | Defense |
| Mace | Slow | One | Light | Base-heavy | Rich | HP |
| Staff | Slow | Two | Light | Base-heavy | Rich | Cast speed |
| Great weapon (greataxe, maul, pike, scythe) | Slow | Two | Heavy | Even | Rich | Attack |

The axe and the hammer are the great weapon's one-handed cousins. A second kind changes basic attacks: a heavy kind hits hard without much Attack behind it, and an Attack-heavy kind grows with the Attack it carries. Passives that work on basic attacks keep working. The interface shows a weapon's damage per tick for its holder beside its speed and scaling, so two kinds' swings compare.

## Formations

- **Three seats,** one per unit, so every seat is filled; the tech keeps five for later parties. Seat order only breaks targeting ties.
- **A seat** changes the stats of the unit in it, up or down, or gives it statuses, or does nothing. Any stat can move, Aggro and special stats included. Aggro on the seats is how a formation makes a front and back line, since there's no positioning.
- **A party effect** is stats or statuses for every ally, flat rather than aimed at one unit. A formation may have none.
- **No budget** between seats or between formations: each formation is its own thing.
- **Rarity:** common, rare and legendary; there are no mythic formations. The player starts with Neutral: three seats that do nothing, and no effect.
