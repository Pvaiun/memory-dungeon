# Core set: gear and formations

What a weapon kind is, who wears what, and what a formation is, as rules. How loot is designed and written is in `docs/gear-design/`; how a fight runs is in *Core set: combat* (`combat.md`), and the statuses in *Core set: vocabulary* (`vocabulary.md`). The numbers are in `content/core-set/scale.ts`.

## The director's rulings

The director's standing direction on this page's subject. Direction is guidance, not law: challenge any of it with evidence. Until a line is changed here, it stands, and it wins over the rest of this page: where they differ, fix the page. When the director changes a ruling, rewrite its line; don't add history.

- **Gear has four slots** (weapon, armor, offhand, amulet), and slots have no job. Only weapons carry inherent behaviour (a speed, a swing and hands). Every class has an offhand and a one-handed weapon, and arrives with the plain weapon of its one-handed kind. The amulet fits everyone. A mythic fits one class.
- **Each class wears three weapon kinds and three offhand kinds,** at least one weapon kind one-handed, and two armor types for about three classes in four (one where the weight is the class). A kind may have up to about five wearers, so a class's loot is partly its own, not mostly. Kinds are picked by a class's fantasy and identities, not its stat line. A kind keeps a **leaning** (`docs/gear-design/loot.md`): commons draw on it, and nothing else must. Armor types stay the four weight classes, leaning by weight: the heavier the armor, the less Attack and the more Defense and Thorns, and Robes lean to MP regen. Accuracy is never a leaning; Attack is never the leaning of an Attack-heavy kind.
- **A weapon kind is its words:** how hard it swings per tick, how much of that is the wearer's Attack, and how many stats its pieces carry; a kind pays for its swing in stats or the other way round, a two-hander takes both sides, and a piece may step along the trade. The interface shows a weapon's damage per tick.

## Weapons

Twelve kinds, each a speed, hands and three words: a swing, a scaling and a budget (`KIND_WORDS` in `scale.ts`). Every class uses three kinds, at least one of them one-handed, and a kind has three to five wearers. There's no melee or ranged: the kinds are there for different speeds, different swings and the fantasy. Each kind's interval is in `KIND_SPEED`: fast is under 7.5 ticks, slow over 10.5.

- **Swing:** how hard the kind hits per tick at the reference Attack: light, full or heavy (`SWING_POWER`). A swing's size per blow follows its interval, so a fast kind hits for less per blow and a slow one for more.
- **Scaling:** what share of that swing is the wearer's Attack: base-heavy, even or Attack-heavy (`SWING_SCALING`). A base-heavy swing works for any wearer; an Attack-heavy one turns the wearer's own Attack into damage and rewards stacking it. Attack is never the leaning of an Attack-heavy kind, so the Attack a sword or great weapon carries feeds the wearer's abilities rather than cancelling against its own swing.
- **Budget:** how many stat steps the kind's pieces carry at each rarity: lean, standard or rich (`KIND_BUDGET`). A kind pays for its swing in budget or the other way round; a two-hander takes both sides, being worth a weapon and an offhand.
- **Leaning.** Each kind has a leaning: a few stats its commons draw on (*Gear design: the loot*, Commons and uncommons by kind). Every other piece's stats are its own, at most half of them on the leaning, so a kind's pieces don't all pull one way.
- **Within a kind,** the words are the default. A piece may step along the trade (a heavy piece swings harder for a step fewer, a light one lighter for a step more: `SWING_TRADE`), take another scaling, or swing from another stat (the Heartsplitter's max HP), and its card says so. Rarity buys stats and effects, never the swing. Every piece carries stats at every rarity.

| Weapon | Speed | Hands | Swing | Scaling | Budget | Leaning | Classes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Dagger | Fast | One | Light | Attack-heavy | Standard | Crit chance | Ranger, Assassin, Bard, Hexer |
| Fist weapons (knuckles, claws, cestus) | Fast | One | Light | Even | Standard | Double strike | Monk, Vampire, Stormcaller |
| Wand | Fast | One | Light | Base-heavy | Rich | Cooldown | Cleric, Bard, Hexer, Pyromancer |
| Sword | Medium | One | Full | Even | Standard | Attack | Knight, Hoplite, Paladin, Valkyrie, Hexer |
| Spear | Medium | One | Full | Even | Standard | Aggro | Knight, Hoplite, Valkyrie, Monk, Frostweaver |
| Axe | Medium | One | Heavy | Attack-heavy | Lean | Lifesteal | Ranger, Assassin, Vampire, Geomancer |
| Bow | Medium | Two | Heavy | Attack-heavy | Standard | Crit damage | Ranger, Bard, Assassin |
| Rune sword | Slow | One | Full | Base-heavy | Standard | MP regen | Valkyrie, Vampire, Frostweaver, Stormcaller |
| Hammer | Slow | One | Heavy | Base-heavy | Lean | Defense | Knight, Bramble knight, Stormcaller, Geomancer |
| Mace | Slow | One | Light | Base-heavy | Rich | HP | Cleric, Bramble knight, Paladin, Pyromancer |
| Staff | Slow | Two | Light | Base-heavy | Rich | Cast speed | Cleric, Monk, Pyromancer, Frostweaver |
| Great weapon (greataxe, maul, pike, scythe) | Slow | Two | Heavy | Even | Rich | Attack | Bramble knight, Hoplite, Paladin, Geomancer |

The axe and the hammer are the great weapon's one-handed cousins. A second kind changes basic attacks: a Knight's hammer hits like a falling hill without the Attack the Knight lacks, and its sword grows with the Attack it carries. Passives that work on basic attacks keep working. The interface shows a weapon's damage per tick for its holder beside its speed and scaling, so two kinds' swings compare.

## Gear

The four slots and who wears what. What each rarity carries, and the rules for pieces, formations, upgrades and mythics, are in *Gear design: the loot*; the philosophy behind them, in *Gear design: philosophy*.

- **Slots.** Each unit wears a weapon, armor, an offhand and an amulet. Gear is fixed, never generated, and any number of units can wear copies of the same piece. A class arrives with the plain weapon of its first one-handed kind, and its other slots start empty. Slots have no job: any kind of effect can sit in any slot, and only weapons carry behaviour of their own (a speed, a swing and hands).
- **Who wears what.** A class wears only its own kinds: three weapon kinds, one or two armor types (Plate, Mail, Leather, Robes; two for twelve classes of sixteen) and three of the thirteen offhand kinds, picked by its fantasy and identities. Amulets fit everyone. Weapon and offhand kinds follow the same rules: three to five wearers a kind, three kinds a class, and every class has a one-handed weapon kind, so it can always hold an offhand. With that much overlap, a class's loot is partly its own. Armor types stay loot groups by weight. A kind's name says who can hold it, not what its pieces do. *Core set: classes* gives each class's kinds; `npx tsx tools/gear-slots.ts` checks the rules.
- **Two-handers.** The bow, the great weapon and the staff take both hands, so the offhand stays empty under one: a unit can't hold both, and in the rogue mode a two-hander going on sends the offhand to the bag. A two-hander's pieces are meant to be worth a weapon and an offhand.
- **Weapons.** A weapon's kind sets its speed, its swing, scaling and budget words and its hands, as in the weapon table; recovery is the same for every weapon. Each weapon has a damage, a scaling ratio and a scaling stat: usually Attack, another stat on a few pieces. Damage is per hit and relative within the kind: a fast kind hits for less per swing, a slow kind for more. Weapon damage feeds basic attacks only; abilities scale as written.
- **Offhand kinds.** An offhand has no swing, so a kind is its stat profile, its flavour and who shares it.

| Offhand | Leaning | Classes |
| --- | --- | --- |
| Kite shield | Defense | Knight, Paladin, Geomancer, Frostweaver |
| Round shield | HP | Hoplite, Bramble knight, Valkyrie |
| Horn | Aggro | Knight, Hoplite, Ranger, Valkyrie |
| Totem | Thorns | Bramble knight, Stormcaller, Hexer, Pyromancer |
| Relic | MP regen | Cleric, Paladin, Monk, Vampire |
| Lantern | Cast speed | Cleric, Pyromancer, Paladin |
| Tome | Cooldown | Bard, Hexer, Frostweaver |
| Orb | MP | Pyromancer, Frostweaver, Stormcaller |
| Idol | Siphon | Hexer, Vampire, Bramble knight, Geomancer |
| Vial | Lifesteal | Vampire, Assassin, Cleric, Bard |
| Trophy | Crit damage | Knight, Ranger, Assassin, Geomancer |
| Bell | Attack speed | Bard, Monk, Stormcaller |
| Cloak | Evasion | Valkyrie, Monk, Ranger, Hoplite, Assassin |

- **Rarity:** common, uncommon, rare, legendary and mythic. A **mythic** fits one class, in any slot and whatever its kind (a mythic weapon can have its own speed, swing and hands), and a unit wears one at most.
- **What gear carries.** The stats every unit has, the ten special stats (the speed stats included), and effects. Stat steps are +1 or +2 (`STEP`, `HP_STEP`, `AGGRO_STEP`, `MP_REGEN_STEP`), with no half-steps; a piece may carry one stat a step down (−1) for one step more elsewhere. Special stats on gear are medium, or high on a legendary or a mythic, never low. Every piece carries stats at every rarity: a weapon its kind's budget, every other slot the standard one (`KIND_BUDGET`), a rare's, legendary's or mythic's steps beside its effect; a legendary and a mythic carry a rare's. A piece's stats are its own, not its kind's. A stat that matches a weapon's scaling stat counts twice, since it raises the weapon's own damage too.

## Formations

- **Three seats,** one per unit, so every seat is filled; the tech keeps five for later parties. Seat order only breaks targeting ties.
- **A seat** changes the stats of the unit in it, up or down, or gives it statuses, or does nothing. Any stat can move, Aggro and special stats included. Aggro on the seats is how a formation makes a front and back line, since there's no positioning.
- **A party effect** is stats or statuses for every ally, flat rather than aimed at one unit. A formation may have none.
- **No budget** between seats or between formations: each formation is its own thing.
- **Rarity:** common, rare and legendary; there are no mythic formations. The player starts with Neutral: three seats that do nothing, and no effect.
