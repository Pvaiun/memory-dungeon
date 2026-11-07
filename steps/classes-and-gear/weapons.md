# Weapons without Magic: findings

What a design conversation with the director settled about weapons, after the prototype on branch `ccr-4254e0d6-dn2hnp` removed Magic and Magic resist. That branch makes Attack the only offensive stat and renames Armor to Defense. This file covers weapons only. It records:

- what the director decided
- the weapon allocation and each kind's stats
- the rules behind them
- what was tried and dropped, and why
- what is still open

## Status

- **Settled:** the rules for weapon kinds, the twelve kinds, each class's two kinds, each kind's stat profile, and Accuracy coming off every signature and common list.
- **Not settled:**
  - the swing numbers and how stat amounts grow with rarity
  - whether gear is rolled
  - the upgrade audit and the stat lines
  - armor and offhands
  - the re-theming of the elemental classes

Nothing is built.

## The director's direction, as it bears on weapons

- **A class's identity is its kit first,** meaning its passive and abilities. Its gear kinds come next and its stats last. The stat line is a template, and gear can stretch a class far from it. A few roles are off-limits by identity, not by gear limits; the Hoplite is never a healer and the Pyromancer never a tank.
- **A weapon kind carries a direction to whoever holds it.** The kind is one of the strongest levers for a build.
- **All gear has stats, and higher rarity is generally better.** Many pieces will carry both stats and effects. Procedurally generated gear is under consideration but undecided: fixed effects, with rolled stats within a kind's allowances.
- **Special stats are not reserved.** They can be widespread where the classes want them; "odd" is about theme. Large amounts belong to high rarity, and lower rarities have to be stacked to match.
- **Toughness is designed class by class.** Frailty is an identity for some classes; the Assassin is never really tough.
- **No "caster" tier.** The elemental classes all feel like different-coloured mages. Pick a couple to be frail spellcasters and let others be sturdier. Renames, new art and changed abilities are allowed.
- **Everything scales from the user,** never from the target, including heals.
- **Upgrades keep their format:** a plain power step and two versions, the same for every class and ability. The versions themselves can be redesigned. Upgrades are the strongest commitment lever. Scaling can be part of a version's identity, never the whole of it.
- **Gear must be balanced on its own.** How the rogue mode offers gear is not the balancing tool.
- **Accuracy is never a signature stat.** The director is close to removing it.
- **Readability is not a worry for now.**
- **Every class has a one-hander,** so it can always use an offhand.

## The rules for weapon kinds

1. **At most three classes a kind,** and every wearer reads the kind's signature stat: its kit makes use of it. There is one exception, the mace, with four wearers (below).
2. **Two classes share at most one weapon kind.** This counts weapons only; armor and offhands don't count. It keeps any class's weapons from copying another's.
3. **Every class has a one-handed kind.**
4. **A class has two kinds.** A third is allowed where a role needs a swing neither kind gives; none needed one in this pass.

Why these rules:
- They make any piece of a kind relevant to every class that can wear it, which is what lets gear be balanced on its own.
- The older rules counted sharing across all slots, and that forced odd kinds: a dodging polearm on the Valkyrie, a spear on the Ranger, a scepter that was the rod renamed.
- Dropping the rules entirely left five wearers on the sword, wand and staff. Those kinds turned generic, and the director rejected that.

## Stat profiles

Every stat can appear on most kinds. A kind's identity is in how often each stat appears and how much of it.

- **Signature:** on most of the kind's pieces, in its biggest amounts. Each kind has its own signature, except Attack, which the sword (one hand) and the great weapon (two hands) share.
- **Common:** often, in normal amounts.
- **Occasional:** any stat not listed for the kind. It turns up now and then, in smaller amounts.
- **Never:** only where the theme forbids it.

Higher rarity means more stats and bigger amounts. That works the same for fixed pieces and rolled ones: if gear is rolled, the profile becomes the roll's odds.

Three speed stats become real gear stats:
- **Attack speed:** basic attacks come sooner.
- **Cooldown:** abilities come round sooner (the engine's `cooldown_reduction`).
- **Cast speed:** shorter wind-ups (`cast_time_reduction`).

The engine already has all three. Today's gear uses Attack speed on three pieces, Cooldown on one, and Cast speed on none.

## The kinds

The rune sword retires. The rod becomes the orb, with an identity of its own. The hammer and axe are new. That makes twelve kinds.

| Kind | Swing | Signature | Common | Never | Worn by |
| --- | --- | --- | --- | --- | --- |
| Dagger | fast, one hand | Crit chance | Attack speed, Evasion, Crit damage, Attack | Defense, Aggro | Ranger, Assassin |
| Claws (today's fist weapons) | fast, one hand | Double strike | Attack speed, Lifesteal, Evasion | Cooldown, Cast speed, MP regen | Monk, Vampire, Stormcaller |
| Wand | fast, one hand, light | Cooldown | Cast speed, MP regen, Attack, Attack speed | Defense, Thorns, Aggro | Bard, Hexer, Pyromancer |
| Orb | slow, one hand, light | MP regen | Cooldown, MP, HP, Siphon | Evasion, Double strike, Aggro | Frostweaver, Stormcaller |
| Sword | medium, one hand | Attack | HP, Defense, Crit chance, Aggro | none | Knight, Hexer |
| Spear | medium, one hand | Aggro | Defense, Attack, Crit chance, HP | Lifesteal | Hoplite, Valkyrie, Monk |
| Axe | medium, one hand | Lifesteal | Attack, Crit damage, HP | Cast speed, MP regen | Vampire, Assassin |
| Hammer | slow, one hand | Defense | HP, Aggro, Crit damage, Thorns | Evasion, Attack speed, Double strike | Knight, Bramble knight, Geomancer |
| Mace | slow, one hand | HP | Defense, MP regen, Cooldown, Thorns | Evasion, Double strike | Cleric, Paladin, Bramble knight, Valkyrie |
| Bow | medium, two hands | Crit damage | Crit chance, Attack, Attack speed | Defense, Thorns, Aggro | Ranger, Bard |
| Great weapon | slow, two hands | Attack | HP, Crit damage, Lifesteal, Aggro | Evasion, Cast speed, MP regen | Hoplite, Paladin, Geomancer |
| Staff | slow, two hands, light | Cast speed | Cooldown, MP, MP regen, HP | Evasion, Double strike, Attack speed | Cleric, Pyromancer, Frostweaver |

"Light" means a small swing: most of the kind's value is in its stats.

**The one exception:** the mace has four wearers. The director treats the Valkyrie as an exotic class, allowed to share one weapon with the Cleric instead of wearing the axe, which it doesn't read. It shares only the mace with the Cleric, so the second rule still holds.

**A small leak the director accepted:** the axe lists HP as common for the Vampire, and the axe also reaches the Assassin, which is frail by identity.

## Each class's pair

| Class | Today (prototype) | Proposed | What each kind gives it |
| --- | --- | --- | --- |
| Knight | sword, great weapon | **sword, hammer** | Sword: Attack, which it reads only through its swing (an upgrade version should give it something that scales from Attack). Hammer: Defense. |
| Cleric | mace, staff | mace, staff | Mace: HP. Staff: Cast speed, for Raise's very long wind-up. |
| Ranger | bow, dagger | bow, dagger | Bow: Crit damage. Dagger: Crit chance, plus the offhand. |
| Bramble knight | sword, staff | **hammer, mace** | Hammer: Defense, which Briar reads. Mace: HP. A choice of how it tanks, but both are slow one-handers. |
| Hoplite | spear, great weapon | spear, great weapon | Spear: Aggro, plus the round shield. Great weapon: Attack, through Phalanx. |
| Paladin | rune sword, mace | **mace, great weapon** | Mace: HP. Great weapon: Attack, for Smite and Judgement. |
| Valkyrie | spear, rune sword | **spear, mace** | Spear: Aggro, on its fighting side. Mace: HP, with common Cooldown and MP regen for Rally and Valhalla. |
| Bard | bow, wand | bow, wand | Bow: Crit damage (Refrain is a share of the hit). Wand: Cooldown, for the songs. |
| Hexer | dagger, rune sword | **wand, sword** | Wand: Cooldown, for the curses. Sword: Attack, which its curses' stacks read; this fits the Spellblade theme the classes document names for the Hexer. |
| Monk | fist, spear | claws, spear | Claws: Double strike (Iron palm adds Sunder on the extra strike). Spear: Aggro. |
| Assassin | dagger, sword | **dagger, axe** | Dagger: Crit chance, for Backstab and more crits. Axe: Lifesteal, with Crit damage common. |
| Vampire | fist, great weapon | **claws, axe** | Claws: Double strike. Axe: Lifesteal. |
| Pyromancer | staff, wand | staff, wand | Staff: Cast speed, for Pyre. Wand: Cooldown, and a fast swing for Kindling. |
| Frostweaver | rod, staff | **staff, orb** | Staff: Cast speed. Orb: MP regen. |
| Stormcaller | wand, rod | **claws, orb** | Claws: Double strike (Arc rides extra strikes too). Orb: MP regen, since its spells cost a lot. |
| Geomancer | great weapon, rune sword | **hammer, great weapon** | Hammer: Defense, for its rocks and shields. Great weapon: Attack, for the swing that crits behind its Shield. |

The assignment was checked against the four rules. Every class has a one-hander, and wearers run two to three a kind, with the mace's four as the one exception.

## What each class's kit reads

The allocation used this list to decide which classes read which signature. It's derived from the base kits in `content/core-set/classes.ts` and from how each class stays alive. The director hasn't confirmed it.

- **Attack:** nearly every class's hits; the Cleric's Cure, the Vampire's Frenzy. The Knight, Bramble knight and Geomancer read it only through their swing.
- **HP:** the Knight (Vanguard, Shield bash), the Vampire (Blood drain, Blood gift), and the walls' survival.
- **Defense:** the Geomancer (Earthen shell, Rockfall, Tremor), the Bramble knight (Briar), and the walls' survival.
- **Crit chance:** the Assassin (Backstab), the Geomancer (Bedrock), the Ranger and the Valkyrie.
- **Crit damage:** the Assassin, Geomancer, Ranger, Bard and Hoplite.
- **Double strike:** the Monk (Iron palm), Stormcaller (Arc), Vampire and Assassin.
- **Attack speed:** classes with riders on basic attacks: the Hexer (Cold hex), Pyromancer (Kindling), Stormcaller (Arc), Ranger (Hunter's eye), Bard (Refrain) and Monk (Iron palm).
- **Cast speed:** long wind-ups: the Pyromancer (Pyre), Geomancer (Tremor), Cleric (Raise), Frostweaver (Blizzard) and Paladin (Smite, Sanctuary).
- **Cooldown:** the classes that lead with abilities.
- **Aggro:** the walls, and the Monk and Valkyrie through their Taunting upgrade versions.
- **Lifesteal:** the Vampire. **MP regen:** classes whose spells cost a lot.

## The swing

Each kind's swing is its fixed part: its speed, its hands, and a power that may differ between kinds. None of it is sized yet. These levers were discussed and stand as guidance:

- **Speed** decides how often riders land and how much of each hit Defense takes. It says nothing about power or stats.
- **Power,** damage per tick, can differ between kinds of the same speed when something visible pays for it.
- **Base against Attack scaling:**
  - A swing that is mostly base works for any wearer.
  - A swing that scales steeply from Attack turns the unit's own Attack into damage, and its kind should not carry Attack itself. Otherwise the two halves cancel: the weak base is made up by the kind's own Attack, and the pair choice collapses to the remaining stats.
- **Two-handers** give up the offhand, so they can be stronger in damage, stats or effects.

A light swing still carries a unit's full riders: Kindling, Cold hex and Arc's Shock count their stacks from Attack, not from the size of the hit. Refrain is a share of the hit, so a light swing starves it. The same weapon means different things to different classes.

## Tried and dropped

| Approach | Why it was dropped |
| --- | --- |
| Weight buckets (heavy, keen, even, light) combining hit size, scaling and stat budget | It tracked speed, so "heavy" meant "slow." Most pairs collapsed to "small hits with an offhand, or big hits without one." "Even" was never defined. The director rejected it. |
| One scaling stat per class, dropping Attack to 1–2 on walls and healers | It renamed Attack and repeated the old pattern. Weapon choices flattened to "how much of my one stat, and how big a swing." |
| Splitting abilities everywhere: the hit from one stat, the status from another; riders from Accuracy | Weird and complex as a rule. It's acceptable only where theme earns it, such as a status that deals damage. |
| Heals scaling from the target's max HP | Rejected: everything scales from the user. |
| Two stats a kind, fixed leanings | It would make a stale game ("every sword has Attack or Defense"). Replaced by the profiles. |
| Rules relaxed to five wearers a kind | Kinds turned generic, with no guarantee a sword is relevant to the class that finds it. |
| Counting the sharing rule across all slots | It forced the polearm, the Ranger's spear and the scepter. |
| A power step plus three versions | Rejected. The format is a power step and two versions, or three versions; keep the current one unless there's good reason. |
| Giving each slot a soft job (armor for staying up, offhands for what you add) | The director strongly rejected it. The weapon method is not to be pattern-matched onto armor and offhands, and the exploration stopped here for that reason. |

## Still open

- **The Knight** reads the sword's Attack only through its swing. Fix it with an upgrade version that scales from Attack.
- **The Bramble knight's** hammer and mace are both slow one-handers. Their signatures differ (Defense or HP), but their swings are alike.
- **The mace's four wearers** are the one exception to the rules.
- **The elemental classes:**
  - **Discussed, never decided:** keep the Pyromancer as the frail spellcaster, make the Frostweaver the sturdier one that leads with abilities, and turn the Stormcaller into a fighter.
  - **The allocation already leans that way:** the Stormcaller on claws and an orb reads as a fighter who also casts.
  - **The Stormcaller's armor:** whether it stays in robes belongs to the armor work.
- **Accuracy:** off every signature and common list; its future is undecided. If it goes, foes' Evasion needs another answer: the Dodger challenge today has Accuracy as its main gear answer.
- **The swing numbers** per kind, and the sizes of the three speed stats on gear.
- **Rarity amounts,** and whether gear is rolled.
- **The upgrade audit:** check that every class's roles can be reached through its versions. The Knight's Attack version is one known gap.
- **The stat lines,** which should follow how each class stays alive.
- **Rehoming the existing pieces:**
  - The rune sword's eight move or go: Runed saber, Cairn blade, Wayfinder, Sigil blade, Spellbinder, Bane of the bound, Hexblade, Dawnblade.
  - The rod's eight move to the orb: Dowsing rod, Ironbark rod, Sleet rod, Cistern rod, Glacial rod, Lightning rod, Winter's chain, Brimming rod.
  - The hammer and axe need pieces of their own.
  - The great weapon loses the Vampire; the staff loses the Bramble knight; the sword loses the Bramble knight and the Assassin.

## Facts from the data

- **Where the weapons are** on the prototype branch:
  - `content/core-set/pieces/weapons-physical.ts` and `weapons-focus.ts`
  - the plain weapons in `content/core-set/gear.ts`
  - the swing constants in `content/core-set/scale.ts` (`KIND_SPEED`, `SWING_REF`, `WEAPON`, `FOCUS`)
  - the classes' kinds in `content/core-set/classes.ts`
- **Special stats on gear today** (prototype): Evasion on 9 pieces, Thorns 5, Double strike 5, Lifesteal 4, Accuracy 4, Crit damage 4, Attack speed 3, Siphon 2, Cooldown 1, Cast speed 0. Almost all sit on kinds worn by the classes that already have the stat.
- **Upgrade versions that already change what a number reads:**
  - Shieldbearer: Defense adds to the Hoplite's swing.
  - Stone guard: a Shield from the Knight's Defense.
  - Crushing bash: adds the Knight's current Shield.
  - Bloodletting: Bleed from max HP.
  - Sanctum: a Shield from Attack.
- **Nearly every class's second and third roles today come from its upgrade versions,** not its base kit. The Monk's Taunt is in Flow's version Stillness of mind; the Stormcaller's Thorns and Aggro are in Static charge's version Storm shield.
