# Gear design: the loot

The rules the loot is made by: what each rarity is, how much there is, how commons and uncommons are written, and what formations, upgrades and mythics may do. The philosophy behind them is in *Gear design: philosophy*, and the builds they serve in *Gear design: the builds*. The slots, the kinds and who wears what are under Gear in *Core set: rules and vocabulary*; how loot is offered in a run is in *Core set: the rogue mode*.

Every piece, formation, upgrade and mythic is data with its card text: `content/core-set/pieces/`, `formations.ts` and `upgrades/` (the mythics are in `upgrades/`, beside their class's upgrades). `npx tsx tools/gear-slots.ts` counts who shares which kinds, `npx tsx tools/piece-check.ts` checks that every item does what its card says, and `npx tsx tools/loot-list.ts` lists every item as one line with its card.

## Rarity

Rarity is specificity, not size: how far a piece bends the game. A rare can be bigger than a legendary for the build it serves. Power by act comes from the offers (later acts roll more rares and legendaries), never from per-act versions of a piece.

| Rarity | What it is | Stats | Effect |
| --- | --- | --- | --- |
| **Common** | Fills a slot and carries a build's first stats. | One step as the standard, two on a rich kind (`KIND_BUDGET`). A special stat at medium is a step, at high two. | None. |
| **Uncommon** | A build's first rung: a simple effect most runs find. | Two steps as the standard, one on a lean kind, three on a rich one. | One simple, general effect on a thread (a rider, a start-of-fight status, a reaction), with no condition on a class, sized so it's seen the first time it fires. Each one helps two to four builds a little. |
| **Rare** | A build's second rung: specific, often conditional. | Three steps as the standard, two on a lean kind, four on a rich one, beside the effect. | One designed effect, worth a lot to one or two builds and little elsewhere. |
| **Legendary** | A build's far end, or an exotic: it bends a rule. | Four steps as the standard, three on a lean kind, five on a rich one, beside the effect. The only rarity where a special stat is high. | A rule change, a new trigger or a payoff that grows. Strong where it fits; where it's strong in many places, it gives something up. |
| **Mythic** | Rewrites one class, past any one ability. | As its shape needs. | One per class (see Mythics). |

Every piece carries stats at every rarity, each rarity carries a step more than the last, and higher rarity is generally better: a rare or legendary carries its steps beside its effect, not instead of it. A weapon kind's budget word moves the ladder a step down or up (*Core set: rules and vocabulary*, Weapons); armor, offhands and amulets take the standard ladder. A piece's stats lean to its kind's profile, the signature first. The content checks every piece against its budget as the pack is built. The stats are shown as values beside the piece's name; the card's words are its swing trade and its effect, never its stats.

- **No random affixes,** at any rarity: every piece is fixed. Tempering turns a piece into one of the next rarity, in the same kind, that fits the same wearer.
- **No piece says what it's for.** Which builds a piece serves is the designer's (`PIECE_BUILDS`), used to aim drops, and never on a card.
- **An uncommon never carries a rare's effect at a smaller size** in the same kind: the best choices are between builds, not between a small and a big version of one thing.
- **Two-handers** (bow, great weapon, staff) are worth a weapon and an offhand: the great weapon and the staff take both sides of the swing trade (a heavy swing or the most stats, and a rich budget), and their rares and legendaries pair two effects or carry a bigger one. The bow is the exception: a heavy, Attack-heavy swing at a one-hander's budget, and the marksman pays with the offhand.

## The stock

| Slot | A kind holds | Common | Uncommon | Rare | Legendary | In all |
| --- | --- | --- | --- | --- | --- | --- |
| Weapon (12 kinds) | 8 | 2 | 2 | 2 | 2 | 96 |
| Armor (4 types) | 12 | 3 | 3 | 3 | 3 | 48 |
| Offhand (13 kinds) | 8 | 2 | 2 | 2 | 2 | 104 |
| Amulet | 24 | 6 | 6 | 6 | 6 | 24 |
| **All** | | **68** | **68** | **68** | **68** | **272** |

Plus the 12 plain weapons (the starters, and the cheapest drops) and the 16 mythics. The axe, hammer, orb, trophy and cloak are the newest kinds: their commons and uncommons are written to their profiles, and their rares and legendaries are a first fill for the builds pass to redo. The rod's pieces that didn't fit a new kind (Wayfinder, Bane of the bound, Hexblade, Dawnblade, Nettle blade, Rootstaff, Dowsing rod, Ironbark rod, Glacial rod, Wild hunt totem) are retired for the loot pass to replace rather than keep; the stats on every piece are a first assignment by rule, for the loot pass to redo piece by piece. The stock is even quarters because offers already weight rarity; the split decides how often the same piece comes back. A run sees under half of the legendaries, so two runs toward one build get there through different pieces.

## Sizes, for new pieces

The first values a new piece is written in. They aren't limits: no balancing rules are made while making content (`docs/rules.md`), and synergies may be overpowered. A build's first step is sized so it's seen the first time it fires, whatever its first value; in play, the small end of these was never seen to happen.
- **Stat steps** as gear has them (`STEP`, `HP_STEP`, `AGGRO_STEP`, `MP_REGEN_STEP`). Special stats are medium, high only on a legendary.
- **Stacks** in the classes' words, a few, several or many, read off the applier's stat the way a kit's are. A rider on every hit is "a few" or less.
- **Damage boosts:** a small one 10% to 20%, a narrow one 30% to 50%, and "double" only on a condition a fight meets a few times.
- **Statuses keep their own numbers.** A piece decides who gets a status and when, never what it does.
- **Cooldown changes:** a few ticks, or "ready" only on a trigger a fight meets a few times.
- **Counters that grow over a fight** are capped, or grow slowly enough that a short fight and one twice as long differ by about half.

## Commons and uncommons by kind

Commons and uncommons are written from a rule per kind, not designed one by one: commons lean on the kind's signature stat and its common stats, the kind's profile (*Core set: rules and vocabulary*, Weapons and Gear), and uncommons carry one of these small effects. Every wearer of a kind reads its signature stat, so a kind's pieces suit each of its two or three wearers.

| Kind | Signature | Commons lean | Uncommons' small effects |
| --- | --- | --- | --- |
| Dagger | Crit chance | Attack speed, Evasion, Crit damage, Attack | a crit that opens a little Bleed; basic attacks that ignore Taunt |
| Fist weapons | Double strike | Attack speed, Lifesteal, Evasion | a short Haste at the fight's start; extra strikes that carry a little Sunder |
| Wand | Cooldown | Cast speed, MP regen, Attack, Attack speed | a little Shock on basic attacks; a little MP back on a crit |
| Sword | Attack | HP, Defense, Crit chance, Aggro | a short Taunt at the start; half again on a foe in a wind-up |
| Spear | Aggro | Defense, Attack, Crit chance, HP | a little Sunder on crits; a Guard after a killing blow |
| Axe | Lifesteal | Attack, Crit damage, HP | a few Might on a killing blow; a drink from a foe below half |
| Bow | Crit damage | Crit chance, Attack, Attack speed | a Slow on a foe winding up; a little Bleed on crits |
| Rune sword | MP regen | Cooldown, MP, HP, Siphon | a little Chill on basic attacks; a Shield at the start from max MP |
| Hammer | Defense | HP, Aggro, Crit damage, Thorns | swings that carry a share of Defense; a Shield from Defense on each hit |
| Mace | HP | Defense, MP regen, Cooldown, Thorns | a Regen on the lowest ally at the start; a little healing on each cast |
| Staff | Cast speed | Cooldown, MP, MP regen, HP | a Clarity at the start; a Shield at the start from Attack |
| Great weapon | Attack | HP, Crit damage, Lifesteal, Aggro | a few Might at the start; a Shield at the start from Attack |
| Plate | (by weight) | Defense, HP, Aggro, Thorns | Thorns with Aggro up; a Shield at the start from Defense; a Guard once a fight below half HP |
| Mail | (by weight) | HP, Attack, Lifesteal | Lifesteal; Thorns; the first hit taken at half |
| Leather | (by weight) | Evasion, Crit chance, Accuracy, Attack | a short Haste below half; Evasion with Aggro down; a few Might at the start |
| Robes | (by weight) | MP, MP regen, Attack, Aggro down | a first cast free; HP with Aggro down; a Shield after each cast from Attack |
| Kite shield | Defense | HP, Aggro, Thorns, Attack | less damage while Taunting; a Guard on the lowest ally at the start |
| Round shield | HP | Defense, Attack, Aggro, Crit chance | a Guard on the other anchor at the start; a fifth more on a Taunting foe |
| Horn | Aggro | HP, Defense, Attack, MP regen | a Clarity on the least-MP ally at the start; Haste on the first kill |
| Totem | Thorns | Defense, Aggro, HP, Attack | Thorns on the anchor for the fight; a Guard once a fight when an ally drops below half |
| Relic | MP regen | HP, Attack, Cast speed, Defense | heals that also cleanse one debuff; a mend on each fall |
| Lantern | Cast speed | Attack, MP, HP, Cooldown | a few Burn on every foe at the start; a Weaken on the most dangerous at the start |
| Tome | Cooldown | Attack, MP, MP regen, Cast speed | a few Chill on every foe at the start; abilities that cost a little less |
| Orb | MP | Attack, MP regen, Cast speed, Cooldown | the nearest ability ready at the start; MP back on each foe's fall |
| Idol | Siphon | Attack, HP, MP, Lifesteal | MP on a kill; Rot on crits |
| Vial | Lifesteal | Attack, Crit chance, Crit damage, HP | crits that heal a little; a drink from a bleeding foe |
| Trophy | Crit damage | Crit chance, Attack, Accuracy, Defense | Heat on each kill; a Slow on crits |
| Bell | Attack speed | Attack, Evasion, Double strike, MP regen | a dodge that quickens the next swing; one cleanse of Silence a fight |
| Cloak | Evasion | Attack, Crit chance, Attack speed, Defense | a few Might on each dodge; Hidden once a fight below half |
| Amulet | (everyone) | one each: HP, Defense, MP regen, Evasion, and two with Attack (two steps of mixed stats) | one each: Taunt at the start, a Shield at the start, Haste at the start, Lifesteal, Thorns, Double strike (a step and a small version) |

## New words, and the rules the pieces bend

- **Marked** is the vocabulary's now (the Paladin's Condemn applies it): a debuff on a foe that makes it the pick of the party's basic attacks while it lasts. The Hunt's pieces apply it too.
- **Counters,** shown as an icon with a number on the holder and kept for the fight: Cuts (hits landed), Heat (power that builds), Spite (Thorns that grow), Tempo (speed that builds), Surge (many-foe hits), Fervor (falls and returns) and Charge (hits saved for one blow, then spent). Each is a status of its own with one fixed meaning, so they don't stack into each other. They're in `pieces/shared.ts`.
- **Three rules are bent, each by one or two pieces:** extra strikes that chain (Flurry wraps), a hit taken for an ally (Oathbound shield), and effects after a won fight, before statuses end (Lamp of vigil, Last bastion, The undying).
- **One rule is added:** Taunt ends Hidden. A unit that gains Taunt stops being Hidden, and Hidden doesn't land on a Taunting unit.
- **What no piece does:** grant an ability, or apply a status for less or more than its own length.

## Rules for writing pieces

Rules that hold for every piece, version and mythic, kept from the rulings on the fill. None of them is about balance.
- **Every uncommon carries an effect.** A special stat alone is a common's step.
- **One uncommon effect per wearer group:** two kinds worn by the same classes don't share an uncommon effect.
- **Every piece carries its kind's budget of steps** at its rarity, a rare's or legendary's beside its effect; a piece that steps along the swing trade says so on its card ("a heavier swing").
- **Mythics carry no stat steps** unless the line's shape needs one.
- **A revive** brings its ally back with every ability on full cooldown, whoever revives, unless the Valkyrie's Einherjar version or a piece says otherwise.
- **Paying HP** means losing that much HP at once. It isn't damage, so no Shield soaks it and nothing reacts to it, and it can't take the payer below 1 HP.
- **"Every so often"** is the short cooldown word, unless a line states its own.
- **Hits that always crit** win over Gambler's coin, and its card says so.
- **Each new status or counter is defined once,** for every piece that uses it (Heat, Fervor and the rest in `pieces/shared.ts`; Marked in the vocabulary).
- **Same card, two places:** where two items would read the same, one changes. The best choices are between builds.

## Formations

A formation is a shape: three seats and, if it wants, rules of its own. It gives a squad an identity. It joins the web of builds through seat roles that many builds share (*Gear design: the builds*, The web), and through an identity of its own, which is what makes it more than a sum of seats. Neutral is the start, and there are 32 more: 11 common, 12 rare and 9 legendary. Each build is helped by at least four, in different ways, and no build needs one.

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
| Paladin | Chains of light | offhand (relic) | Lockdown |
| Valkyrie | Stormspear | weapon (a spear's swing) | Thousand Cuts, the Hunt |
| Bard | Metronome | offhand (bell) | Thousand Cuts |
| Hexer | The witch-blade | weapon | Cold Snap, Harvest |
| Monk | Ember palms | weapon | Bonfire |
| Assassin | Night's edge | armor | the Hunt, Ambush |
| Vampire | Thrall's chalice | offhand | Phoenix, Blood Pact |
| Pyromancer | Crown of embers | amulet | Bonfire |
| Frostweaver | Glacier's heart | armor | Cold Snap |
| Stormcaller | Eye of the tempest | weapon | Harvest |
| Geomancer | Mountain's crown | amulet | Landslide |

Ambush and Blood Pact have no mythic of their own; they reach their far ends through gear and upgrades.

## Levers held back for balance

At the director's word, the loot was made with no balancing rules: synergies may be overpowered. These rules were proposed during the fill and withdrawn, and they're kept as levers for a balance pass, to reach for only if the numbers call for them. Statuses stay universal: no lever shortens or lengthens a status.
- **One swing shape per unit.** Phalanx, the Millstone, the Hummingbird charm, the Worldbreaker and the Hammer seats each reshape a unit's basic attacks, and today two shapes on one unit add up. The lever: a unit takes one shape, and each other shape on it gives a stat step instead.
- **No "many" in a single application:** one cast or hit lands at most "several", and "many" is for build-up over a fight.
- **Half again in place of double** where a party can hold the condition all fight.
- **A counter gains at most a stack every couple of ticks,** however many triggers fire, so against a pack it grows at a fight's pace, not a swarm's.
- **No triples** outside the Worldbreaker.
- **Item cuts:** the fill's first, smaller versions of items that went back to the spine's line (a limit on Pike wall, Oathkeeper at half, Thrall's chalice once a fight, and others).
- **Locks that hold a lone boss all fight** (the Withering hex version, Thorn hedge): the design's own answer is bosses that resist repeated control, which is in, not shorter locks.

## Decisions to know, and what's least sure

**Decisions in the loot that might not be expected,** each one a line to change:
- **The stock is even quarters** (sixty-eight of each rarity), with the plain weapons outside it.
- **Commons carry no effect,** only stats, and every rarity carries stats. Uncommons are where the first rungs live.
- **An upgrade is two trainings,** the power step and the version, in either order.
- **Seven counters,** each its own status. Fewer are possible: Heat and Surge could be one, and Charge could be Cuts spent.
- **Three rules bent, one added** (see New words, and the rules the pieces bend).
- **No piece grants an ability,** so more abilities per class stays out.

**Least sure:**
- **Overflow** leans on the engine most (cost changes, an ally's cast as a trigger). If a link reads as bookkeeping in the fight log, it fails.
- **Ambush's tail** may still be all or nothing.
- **The dodge that pays lives only on Leather** (Duelist's leathers, Windrunner's garb), so no Mail or Plate unit can dance.
- **Two-handers:** whether a two-hander's piece is worth giving up an offhand is a test, not a design.
- **Phoenix's far end is crowded** and its second rung thin. Several returns stacked on one unit could make a party that can't lose its first member.
- **Harvest gets the most versions,** because "spread it" is the natural other side of many single-target abilities.
- **Ambush and Blood Pact have no mythic of their own.**
- **Exotics are five,** half the one in ten that would give a run its chaos.
