# Core set: gear, formations, upgrades and mythics

How the loot is designed: what each rarity is, how much there is, and what formations, upgrades and mythics may do. The slots, the kinds and who wears what are under Gear in *Core set: rules and vocabulary*; how loot is offered in a run is in *Core set: the rogue mode*. Every piece, formation, upgrade and mythic is data with its card text: `content/core-set/pieces/`, `formations.ts` and `upgrades/` (the mythics are in `upgrades/`, beside their class's upgrades). They were designed backwards from the twelve builds (*Core set: builds*). `npx tsx src/gear-slots.ts` counts who shares which kinds; `npx tsx src/piece-check.ts` checks that every item does what its card says.

## Rarity

Rarity is specificity, not size: how far a piece bends the game. A rare can be bigger than a legendary for the build it serves. Power by act comes from the offers (later acts roll more rares and legendaries), never from per-act versions of a piece.

| Rarity | What it is | Stats | Effect |
| --- | --- | --- | --- |
| **Common** | Fills a slot and carries a build's first stats. | Two steps, leaning by kind; three on a two-hander. A special stat at medium is a step. | None. |
| **Uncommon** | A build's first rung: a small effect most runs find. | One step. | One small, general effect on a thread (a rider, a start-of-fight status, a small reaction), with no condition on a class. Each one helps two to four builds a little. |
| **Rare** | A build's second rung: specific, often conditional. | None, or one step where the effect alone is thin. | One designed effect, worth a lot to one or two builds and little elsewhere. |
| **Legendary** | A build's far end, or an exotic: it bends a rule. | Only where the shape needs them. | A rule change, a new trigger or a payoff that grows. Strong where it fits; where it's strong in many places, it gives something up. |
| **Mythic** | Rewrites one class, past any one ability. | As its shape needs. | One per class (see Mythics). |

- **No random affixes,** at any rarity: every piece is fixed. Tempering turns a piece into one of the next rarity, in the same kind, that fits the same wearer.
- **No piece says what it's for.** Which builds a piece serves is the designer's (`PIECE_BUILDS`), used to aim drops, and never on a card.
- **An uncommon never carries a rare's effect at a smaller size** in the same kind: the best choices are between builds, not between a small and a big version of one thing.
- **Two-handers** (bow, great weapon, staff) are worth a weapon and an offhand: their commons carry three steps, and their rares and legendaries pair two effects or carry a bigger one.

## The stock

| Slot | A kind holds | Common | Uncommon | Rare | Legendary | In all |
| --- | --- | --- | --- | --- | --- | --- |
| Weapon (11 kinds) | 8 | 2 | 2 | 2 | 2 | 88 |
| Armor (4 types) | 12 | 3 | 3 | 3 | 3 | 48 |
| Offhand (10 kinds) | 8 | 2 | 2 | 2 | 2 | 80 |
| Amulet | 24 | 6 | 6 | 6 | 6 | 24 |
| **All** | | **60** | **60** | **60** | **60** | **240** |

Plus the 11 plain weapons (the starters, and the cheapest drops) and the 16 mythics. The stock is even quarters because offers already weight rarity; the split decides how often the same piece comes back. A run sees under half of the legendaries, so two runs toward one build get there through different pieces.

## Sizes, for new pieces

The ranges a new piece is written in, so balance mostly holds:
- **Stat steps** as gear has them (`STEP`, `HP_STEP`, `AGGRO_STEP`, `MP_REGEN_STEP`). Special stats are medium, high only on a legendary.
- **Stacks** in the classes' words, a few, several or many, read off the applier's stat the way a kit's are. A rider on every hit is "a few" or less.
- **Damage boosts:** a small one 10% to 20%, a narrow one 30% to 50%, and "double" only on a condition a fight meets a few times.
- **Statuses keep their own numbers.** A piece decides who gets a status and when, never what it does.
- **Cooldown changes:** a few ticks, or "ready" only on a trigger a fight meets a few times.
- **Counters that grow over a fight** are capped, or grow slowly enough that a short fight and one twice as long differ by about half.

## Commons and uncommons by kind

Commons and uncommons are written from a rule per kind, not designed one by one: commons lean on these stats, and uncommons carry one of these small effects.

| Kind | Commons lean | Uncommons' small effects |
| --- | --- | --- |
| Dagger | Crit chance, Attack, Accuracy, Evasion | a crit that opens a little Bleed; basic attacks that ignore Taunt |
| Fist weapons | Double strike, Attack, Evasion, Lifesteal | a short Haste at the fight's start; extra strikes that carry a little Sunder |
| Sword | Attack, HP, Aggro | a short Taunt at the start; Thorns |
| Spear | Attack, Armor, Crit chance | a little Sunder on crits; a Guard after a killing blow |
| Bow | Attack, Accuracy, Crit damage | abilities with Seek; a little Bleed on crits |
| Great weapon | Attack, HP, Crit damage | a few Might at the start; a Shield at the start from Attack |
| Rune sword | Magic, Attack, Armor | basic attacks that ignore Taunt; a Ward at the start |
| Mace | Magic, HP, MP regen | a Regen on the lowest ally at the start; a Ward at the start |
| Wand | Magic, MP, Double strike | a little Shock on basic attacks; a little MP back on a crit |
| Rod | Magic, MP regen, HP | a little Chill on basic attacks; a Clarity once a fight below a third of MP |
| Staff | Magic, MP, HP | a Clarity at the start; a Shield at the start from Magic |
| Plate | Armor, HP, Aggro, Thorns | Thorns with Aggro up; a Shield at the start from Armor; a Guard once a fight below half HP |
| Mail | HP, Attack, Magic, Lifesteal | Lifesteal; Thorns; a Ward at the start |
| Leather | Evasion, Crit chance, Accuracy, Attack | a short Haste at the start; Evasion with Aggro down; a few Might at the start |
| Robes | MP, MP regen, Magic, Aggro down | a Clarity at the start; HP with Aggro down; a Shield at the start from Magic |
| Kite shield | Armor, HP, Aggro | a Shield at the start from max HP; a Guard on the lowest ally at the start |
| Round shield | Armor, Attack, HP | a Guard at the start; a short Taunt when an ally drops below half |
| Horn | Aggro, MP regen, Attack or Magic | a Clarity on the least-MP ally at the start; a short Taunt at the start |
| Tome | Magic, MP, MP regen | a few Chill on every foe at the start; abilities that cost a little less |
| Lantern | Magic, HP, MP | a few Burn on every foe at the start; a Ward at the start |
| Relic | Magic, MP regen, HP | heals that also cleanse one debuff; a Regen on the lowest ally at the start |
| Bell | MP regen, Evasion, Magic or Attack | a short Haste at the start; one cleanse of Silence a fight |
| Totem | Armor, Attack, Thorns | Thorns; a Guard once a fight when its holder drops below half |
| Vial | Lifesteal, Crit chance, Attack | crits that heal a little; Lifesteal below half HP |
| Idol | Siphon, Magic, HP | MP on a kill; a little Siphon on crits |
| Amulet | one each: HP, Attack, Magic, Armor, MP regen, Evasion (two steps of mixed stats) | one each: Taunt at the start, a Shield at the start, Haste at the start, Lifesteal, Thorns, Double strike (a step and a small version) |

## New words, and the rules the pieces bend

- **Marked** is the one new status a player learns: a debuff on a foe that makes it the pick of the party's basic attacks while it lives. Its abilities still follow their own targeting. It lasts a short while, and reapplying it refreshes it. It's the Hunt's focus.
- **Counters,** shown as an icon with a number on the holder and kept for the fight: Cuts (hits landed), Heat (power that builds), Spite (Thorns that grow), Tempo (speed that builds), Surge (many-foe hits), Fervor (falls and returns) and Charge (hits saved for one blow, then spent). Each is a status of its own with one fixed meaning, so they don't stack into each other. They're in `pieces/shared.ts`.
- **Three rules are bent, each by one or two pieces:** extra strikes that chain (Flurry wraps), a hit taken for an ally (Oathbound shield), and effects after a won fight, before statuses end (Lamp of vigil, Last bastion, The undying).
- **One rule is added:** Taunt ends Hidden. A unit that gains Taunt stops being Hidden, and Hidden doesn't land on a Taunting unit.
- **What no piece does:** grant an ability, give Aegis (it stays the Hoplite's), or apply a status for less or more than its own length.

## Formations

A formation is a shape: three seats and, if it wants, rules of its own. It gives a squad an identity. It joins the web of builds through seat roles that many builds share (*Core set: builds*, The web), and through an identity of its own, which is what makes it more than a sum of seats. Neutral is the start, and there are 32 more: 11 common, 12 rare and 9 legendary. Each build is helped by at least four, in different ways, and no build needs one.

**What a formation may be.** A range, not a menu: any formation takes what its shape needs.
- **What a seat can change** about the unit in it: stats and special stats; statuses, at the start or on a trigger; how the unit acts (what it aims at, how fast it acts, what it waits for); what its hits carry; how it reacts. A seat can also do nothing.
- **Seats needn't match.** One seat can hold most of the formation's power while the others serve it, two can mirror each other, one can work only through another, and one can carry a cost the others profit from.
- **Seats can depend on who sits there:** a class, a kind of weapon or armor, a kind of ability, or what another seat is doing.
- **Party effects:** always, on a condition or on a trigger; a stat, a status, or a rule that changes how the party fights. A formation can have several, or none.
- **It can give something up:** a drawback, a seat that costs, a rule that cuts both ways.
- **The words.** Every effect is phrased so the player knows what will happen, at whatever length that takes.

**By rarity.** Commons lean on the roles builds share and plain party effects. Rares are lopsided and read who sits where. Legendaries change how the party fights. There are no mythic formations.

## Upgrades

Every ability and passive has three upgrades: a **power step** and two **versions** (A and B), 64 abilities and passives in all.
- **The power step** is plain, more of the same: two fifths more of an amount or stacks, one cooldown word shorter, or one rung down the MP ladder.
- **The versions** are designed for that ability, with no formula across abilities. What matters is how the two differ, and either can change whom the ability aims at and when it fires, not only its numbers. A version stands on its own against the base, and the power step lands on whichever version is taken. No version copies a piece: where a version and a piece share a thread, they do it differently.
- **Training.** The power step and a version are two separate trainings, in either order. A fully trained class is eight trainings, plus learning the abilities it didn't start with, and no run trains everyone fully. A training opportunity offers three choices. Where a run's training happens is in *Core set: the rogue mode*.

## Mythics

One per class, shown in crimson and offered in the boss boons that open acts II and III. Each fits one class, in the slot named, and reaches past any one ability. It pulls toward one of the class's builds, and a unit wears one at most. A mythic is found and can be taken off; an upgrade is trained and changes one ability or the passive. None repeats a piece or a version. What each one does is its card text, in `upgrades/`.

| Class | Mythic | Slot | Pulls toward |
| --- | --- | --- | --- |
| Knight | Horn of the keep | offhand | Overflow, the Toll |
| Cleric | Halo of the saint | amulet | Phoenix |
| Ranger | Huntmaster's quiver | armor | the Hunt |
| Bramble knight | Heartwood mail | armor | the Toll |
| Hoplite | The last wall | offhand | the Toll, Bonfire |
| Paladin | Chains of light | offhand | Lockdown |
| Valkyrie | Stormspear | weapon | Thousand Cuts, the Hunt |
| Bard | Metronome | offhand | Thousand Cuts |
| Hexer | The witch-blade | weapon | Cold Snap, Harvest |
| Monk | Ember palms | weapon | Bonfire |
| Assassin | Night's edge | armor | the Hunt, Ambush |
| Vampire | Thrall's chalice | offhand | Phoenix, Blood Pact |
| Pyromancer | Crown of embers | amulet | Bonfire |
| Frostweaver | Glacier's heart | armor | Cold Snap |
| Stormcaller | Eye of the tempest | weapon | Harvest |
| Geomancer | Mountain's crown | amulet | Landslide |

Ambush and Blood Pact have no mythic of their own; they reach their far ends through gear and upgrades.

## To watch

- **Two-handers:** whether a two-hander's piece is worth giving up an offhand is a test, not a design.
- **The dodge that pays lives only on Leather** (Duelist's leathers, Windrunner's garb), so no Mail or Plate unit can dance.
- **Exotics are few** (five), half the one in ten that would give a run its chaos.
