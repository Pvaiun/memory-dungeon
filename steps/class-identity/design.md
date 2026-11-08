# Design: class identity after Magic

The fifth draft: the approved design, reworked on the director's feedback from a parallel thread (`intent.md`, last section). Where that feedback reverses a decision taken here, the sheet says so and *Decisions* lists it. Build and tune follow, costed under *What the build step has to do*. It reads with the director's findings document (the weapon rules, the twelve kinds, their stat profiles). Nothing here is built, and no number is final: sizes belong to `content/core-set/scale.ts` when the build step comes.

## The frame

**A class has a trunk and three identities.** The trunk is its base kit, what every build of it does. Its identities are the three ways a run can build it, each a way to play you can watch, and each has to be viable: it needs a payoff inside the kit (in the base or a version), a weapon kind whose signature leans to it, and loot that serves it. The design never picks one identity over another; it makes each one stand. Where an identity isn't viable today, the sheet says what it lacks, structurally; sizes are the build step's.

**The stack.** Kit first: the trunk and the versions. Gear kinds next: a kind's signature stat says which way a piece pushes its wearer, so a class's two kinds are two of its directions, and its offhand and armor lean the same ways. Stat line last: a template of strengths and weaknesses that gear stretches far.

**What "reads" means.** A class reads a stat when its kit scales from it, triggers on it, or is kept standing by it the way a wall is kept standing by HP and Defense. A version that scales from a stat counts: scaling can be part of a version's identity. Every wearer reads its kind's signature stat; this design closes every gap in that rule.

**The rules carried from the findings** (weapons): at most three classes a kind (the findings' mace exception isn't needed once the Valkyrie wears the sword); two classes share at most one weapon kind; every class has a one-handed kind; a class may have up to three kinds. Accuracy is never a signature. All gear carries stats; higher rarity is generally better. Everything scales from the user, revives excepted.

**New rules this design proposes** (for `docs/rules.md` if kept):
- **A class has three identities, and each is viable.** Its versions split toward them, every identity has at least two, and no identity is the class.
- **The Chill class doesn't Slow.** Slow is a player status like any other, but no Frostweaver ability applies it: Chill is its slow, and the two never stack from one kit.
- **A status runs its own course.** No ability spends, shortens or sets off a status early; a payoff reads the stacks and leaves them (Pyre, Skyfall, Culmination, Rupture).
- **The mages share no template.** Each class's abilities have shapes of their own; where two classes held the same shape, one changed.
- **Offhand kinds follow the weapon rules.** Every piece of a kind is relevant to every class that can wear it: at most three wearers a kind, every wearer reads the kind's signature stat, two classes share at most one offhand kind, and every class has two. Slots still have no job: the kind says what stats a piece leans to, never what it's for. **Armor types stay loot groups** (the weight classes) until the director says otherwise.
- **The three speed stats are stats like any other,** on gear and in class lines: Attack speed (basic attacks sooner), Cooldown (abilities round sooner), Cast speed (shorter wind-ups).
- **No two classes share a base ability,** and **a passive works in every fight:** a passive that waits for a rare event (Einherjar) isn't an identity.

## Weapon kinds

The findings' allocation, taken as settled, with two corrections and one change: the Valkyrie wears the sword, not the mace (its sheet says why), so the mace has three wearers and the findings' one exception is gone.

| Kind | Swing | Signature | Common | Never | Worn by |
| --- | --- | --- | --- | --- | --- |
| Dagger | fast, one hand | Crit chance | Attack speed, Evasion, Crit damage, Attack | Defense, Aggro | Ranger, Assassin |
| Claws | fast, one hand | Double strike | Attack speed, Lifesteal, Evasion | Cooldown, Cast speed, MP regen | Monk, Vampire, Stormcaller |
| Wand | fast, one hand | Cooldown | Cast speed, MP regen, Attack, Attack speed | Defense, Thorns, Aggro | Bard, Hexer, Pyromancer |
| Rune sword | slow, one hand | MP regen | Cooldown, MP, HP, Siphon | Evasion, Double strike, Aggro | Frostweaver, Stormcaller |
| Sword | medium, one hand | Attack | HP, Defense, Crit chance, Aggro | none | Knight, Hexer, Valkyrie |
| Spear | medium, one hand | Aggro | Defense, Attack, Crit chance, HP | Lifesteal | Hoplite, Valkyrie, Monk |
| Axe | medium, one hand | Lifesteal | Attack, Crit damage, HP | Cast speed, MP regen | Vampire, Assassin |
| Hammer | slow, one hand | Defense | HP, Aggro, Crit damage, Thorns | Evasion, Attack speed, Double strike | Knight, Bramble knight, Geomancer |
| Mace | slow, one hand | HP | Defense, MP regen, Cooldown, Thorns | Evasion, Double strike | Cleric, Paladin, Bramble knight |
| Bow | medium, two hands | Crit damage | Crit chance, Attack, Attack speed | Defense, Thorns, Aggro | Ranger, Bard |
| Great weapon | slow, two hands | Attack | HP, Crit damage, Lifesteal, Aggro | Evasion, Cast speed, MP regen | Hoplite, Paladin, Geomancer |
| Staff | slow, two hands | Cast speed | Cooldown, MP, MP regen, HP | Evasion, Double strike, Attack speed | Cleric, Pyromancer, Frostweaver |

Corrections to the findings:
- **The Stormcaller's row** in the findings' class table reads "claws, orb"; its explanation and the kinds table say rune sword. Rune sword it is: no orb kind exists or is proposed.
- **The great weapon** keeps its two-handed family (greataxes, mauls, pikes, scythes); the new axe and hammer are its one-handed cousins, and their piece names should say so.

| Class | Kinds | One hand |
| --- | --- | --- |
| Knight | sword, hammer | both |
| Cleric | mace, staff | mace |
| Ranger | bow, dagger | dagger |
| Bramble knight | hammer, mace | both |
| Hoplite | spear, great weapon | spear |
| Paladin | mace, great weapon | mace |
| Valkyrie | spear, sword | both |
| Bard | bow, wand | wand |
| Hexer | wand, sword | both |
| Monk | claws, spear | both |
| Assassin | dagger, axe | both |
| Vampire | claws, axe | both |
| Pyromancer | staff, wand | wand |
| Frostweaver | staff, rune sword | rune sword |
| Stormcaller | claws, rune sword | both |
| Geomancer | hammer, great weapon | hammer |

**Third kinds: none now.** The one pair that gives its class two swings of the same shape is the Bramble knight's (hammer and mace, both slow one-handers); its choice is Defense against HP and the kinds' own base and scaling, which the findings leave to the swing design. If play shows the pair flat, the Bramble knight is the first candidate for a third kind, and the sword is ruled out (it would share two kinds with the Knight).

**Retired kinds:** rod (its eight pieces rehomed in the build step, mostly onto the rune sword and staff) and fist weapons (renamed claws, pieces kept). **New kinds:** axe and hammer, sixteen pieces to write.

## Swings and budgets

Today every kind deals about the same per tick: a swing's size follows its interval (`SWING_REF`), its base is about half of a swing at the reference Attack (`WEAPON`), and every common carries the same two steps (three on a two-hander). The director's read is right: the kinds differ in speed, hands and stats, and in nothing else, so a weapon is a stat profile with a rhythm, and the choice between two kinds is only the choice between two stat lists. Three more levers make a kind a weapon.

**The levers.** Speed and hands stay the kind's fixed part, as the findings set them. Each kind now also has three words, in the scale's way (first values in `scale.ts`, named below):
- **Swing:** how hard it hits per tick at the reference Attack. Light, full or heavy (`SWING_POWER`).
- **Scaling:** what share of that swing comes from Attack. Base-heavy, even or Attack-heavy (`SWING_SCALING`). A base-heavy swing works for any wearer; an Attack-heavy one turns the wearer's own Attack into damage and rewards stacking it.
- **Budget:** how many stat steps its pieces carry. Lean, standard or rich: a step fewer or a step more than today's at every rarity where stats appear (`KIND_BUDGET`).

**The trade.** A kind pays for its swing in budget, or the other way round: heavy swings on lean kinds, light swings on rich ones, and a two-hander takes both sides, since it's worth a weapon and an offhand. The scaling word follows the wearers and the signature: **Attack is never the signature of an Attack-heavy kind.** A kind whose signature is Attack (sword, great weapon) swings base-heavy or even, so the Attack on every one of its pieces feeds abilities rather than cancelling against its own swing (the findings' warning); the Attack-heavy kinds are the ones worn by high-Attack fighters whose signature is something else. Attack stays a common stat on them (the dagger, axe and bow): a common isn't on every piece, so the choice between a dagger that scales and a dagger that also carries Attack is a real one.

| Kind | Speed, hands | Swing | Scaling | Budget | Why |
| --- | --- | --- | --- | --- | --- |
| Dagger | fast, one | light | Attack-heavy | standard | the Assassin's Attack 5 makes a knife of it; the Ranger's crits land often |
| Claws | fast, one | light | even | standard | many hits for Double strike, Arc and Iron palm to ride |
| Wand | fast, one | light | base-heavy | rich | the caster's stat stick that still swings often for Cold hex and Refrain |
| Rune sword | slow, one | full | base-heavy | standard | a sword a mage can swing: solid for Attack 3, and its stats |
| Sword | medium, one | full | even | standard | the plain blade, the reference |
| Spear | medium, one | full | even | standard | the Hoplite doubles it, the Valkyrie shields from it, the Monk rides it |
| Axe | medium, one | heavy | Attack-heavy | lean | the brute's blade: hits hardest of the one-handers and carries least |
| Hammer | slow, one | heavy | base-heavy | lean | the wall's weapon: big slow blows that don't need the Attack the walls lack |
| Mace | slow, one | light | base-heavy | rich | the priest's weapon: carried for what's on it |
| Bow | medium, two | heavy | Attack-heavy | standard | the marksman's scaling swing; the Bard at Attack 3 chooses it for Refrain's hit size, and pays |
| Great weapon | slow, two | heavy | even | rich | worth a weapon and an offhand: the heaviest swing and the stats |
| Staff | slow, two | light | base-heavy | rich | two hands for a caster: the lightest swing and the most stats |

**Within a kind.** The kind's three words are its default, not every piece's: a piece may take one step along the trade: a heavy piece swings harder for a step fewer, a light piece swings lighter for a step more, and a piece may swap the swing's stat (the Heartsplitter's max HP). The loot pass uses it so a kind's eight pieces aren't one weapon with eight stat lists, and a card says it plainly ("a heavy blade", "scales from Defense"). Rarity buys stats and effects, never the swing. **Every piece carries stats, at every rarity:** the budget word says how many, and a rare or legendary carries its steps beside its effect rather than instead of it (the director's rule, which also stands in the findings: all gear has stats, and higher rarity is generally better). A handful of exotics may be the exception, and they're the exception.

**What this does for the pairs.** The Knight's hammer hits like a falling hill without Attack and its sword grows with the Attack it carries; the Hoplite's great weapon and spear are both full-or-heavy but one is rich and two-handed; the Cleric's mace and staff are both light stat sticks, one with an offhand; the Assassin's dagger scales where its axe hits; the Pyromancer's wand and staff are both light, rich and base-heavy, and differ in speed and hands alone, which is right for the one class that never swings for a living.

**What the player sees.** None of this reads unless the interface shows it: a weapon's card and the unit sheet show its damage per tick for its holder, beside the swing's speed and what it scales from, and a comparison shows both weapons' per tick side by side. The words on the card stay the kind's ("a heavy blade"); the number is the swing done.

**What must be measured, not reasoned.** The exchange rate: how many win points a stat step is worth against a tenth of swing damage, class by class on the build parties, since a step of a stat a class reads is worth far more to it than to one that doesn't. That rate sets what "a step fewer" buys in swing, and it's the build session's first measurement, before any kind's words are sized.

## Offhand kinds

**Thirteen kinds, two a class, by the weapon rules.** The director's read of the game as built: the bell's wearers (Monk, Cleric, Stormcaller) never want the same stats, so a bell with Evasion is a Monk tool and a bell with MP regen a Cleric tool, and ten classes had one offhand kind and no other. The weapon method fixes both: a kind is two or three classes that all read its signature stat, two classes share at most one offhand kind, and every class has two kinds, so the offhand is a choice the way the weapon is. An offhand has no swing, so a kind's whole identity is its stat profile, its flavour and who shares it. Classes with a two-hander give the slot up on that side; their offhand pairs with their one-hander.

| Kind | Signature | Common | Never | Worn by |
| --- | --- | --- | --- | --- |
| Kite shield | Defense | HP, Aggro, Thorns, Attack | Evasion, Attack speed, Double strike | Knight, Paladin, Geomancer |
| Round shield | HP | Defense, Attack, Aggro, Crit chance | Evasion, Cast speed | Hoplite, Bramble knight, Valkyrie |
| Horn | Aggro | HP, Defense, Attack, MP regen | Evasion, Crit damage | Knight, Hoplite |
| Totem | Thorns | Defense, Aggro, HP, Attack | Evasion, Crit chance, Cast speed | Bramble knight, Stormcaller |
| Relic | MP regen | HP, Attack, Cast speed, Defense | Evasion, Double strike, Crit damage | Cleric, Paladin |
| Lantern | Cast speed | Attack, MP, HP, Cooldown | Evasion, Double strike, Aggro | Cleric, Pyromancer |
| Tome | Cooldown | Attack, MP, MP regen, Cast speed | Defense, Thorns, Aggro | Bard, Hexer, Frostweaver |
| Orb | MP | Attack, MP regen, Cast speed, Cooldown | Defense, Thorns, Aggro, Lifesteal | Pyromancer, Frostweaver |
| Idol | Siphon | Attack, HP, MP, Lifesteal | Defense, Aggro, Cast speed | Hexer, Vampire |
| Vial | Lifesteal | Attack, Crit chance, Crit damage, HP | Defense, Aggro, MP regen | Vampire, Assassin |
| Trophy | Crit damage | Crit chance, Attack, Accuracy, Defense | Aggro, MP regen, Cast speed | Ranger, Assassin, Geomancer |
| Bell | Attack speed | Attack, Evasion, Double strike, MP regen | Defense, Thorns, Aggro | Bard, Monk, Stormcaller |
| Cloak | Evasion | Attack, Crit chance, Attack speed, Defense | Thorns, MP regen, Cast speed | Valkyrie, Monk, Ranger |

| Class | Offhands | What each gives it |
| --- | --- | --- |
| Knight | kite shield, horn | Defense for the stone wall; Aggro for the anchor |
| Cleric | relic, lantern | MP regen for a healer with no free heal; Cast speed for Raise |
| Ranger | trophy, cloak | Crit damage for the marksman; Evasion for a light body at the back |
| Bramble knight | totem, round shield | Thorns for the anchor; HP for the body its Regen heals |
| Hoplite | round shield, horn | HP for the bruiser's body; Aggro, with the spear, is where a run makes it the wall |
| Paladin | kite shield, relic | Defense for the bulwark; MP regen for its dear spells |
| Valkyrie | round shield, cloak | HP for the Shield's cap; Evasion for the swan-feather cloak: survivable, not a tank |
| Bard | tome, bell | Cooldown for the songs; Attack speed for Refrain |
| Hexer | tome, idol | Cooldown for the torrent; Siphon for the witch-hunter |
| Monk | bell, cloak | Attack speed for the blur; Evasion for the dancer |
| Assassin | vial, trophy | Lifesteal for the drinker; Crit damage for the ambusher |
| Vampire | vial, idol | Lifesteal for the drinker; Siphon and HP for the blood-well |
| Pyromancer | lantern, orb | Cast speed for Pyre; MP for the dearest spells in the set |
| Frostweaver | tome, orb | Cooldown for the lock; MP for the deep calm |
| Stormcaller | totem, bell | Thorns for the live wire; Attack speed for the striker |
| Geomancer | kite shield, trophy | Defense for the stone; Crit damage for the crit behind it |

What changed and why:
- **Three new kinds:** the orb (the mages' MP), the trophy (a pelt, a skull, a geode: the crit hunters') and the cloak (Evasion for the quick; the Valkyrie's is a swan-feather cloak, the Ranger's and Monk's their own). Thirteen kinds, a hundred and four pieces, twenty-four to write.
- **Kinds that lost a wearer who didn't read them:** the bell loses the Cleric (its Attack speed is for riders on basic attacks: Refrain, Iron palm, Arc), the horn loses the Bard (it wants Aggro down), the totem loses the Ranger and Geomancer (neither reads Thorns), the relic loses the Valkyrie (no longer a healer), the lantern loses the Paladin and the round shield gains the Bramble knight, the kite shield the Geomancer, the tome the Hexer.
- **Checked:** every kind has two or three wearers, every class two kinds, no two classes share more than one offhand kind, and every wearer reads its kinds' signatures (the *Who reads what* table). Eleven pairs share a weapon kind and an offhand kind across slots (the Monk and Stormcaller claws and bell, the Pyromancer and Frostweaver staff and orb, and so on), which the findings allow and which keeps each pair's loot close where their play is close.
- **The thinnest reads:** the Vampire's Siphon (its blood-well versions move MP, and the idol's HP and Lifesteal commons are its own), the Ranger's Evasion (survival for a light body), the Paladin's Defense (a Plate wearer's survival).

## Armor

**The four types stay; one class gains a second.** Plate (Defense, HP, Aggro, Thorns), Mail (HP, Attack, Lifesteal), Leather (Evasion, Crit chance, Accuracy, Attack) and Robes (MP, MP regen, Attack, Aggro down) already lean the way the director asked in the no-magic step.

- **The Stormcaller wears Robes or Leather.** It's a claws striker as much as a caster, and the robe (MP for its dear spells) against the leather (Evasion and Attack speed for its swings) is the choice between its identities told again in armor. Leather goes to six wearers.
- **The Hexer stays in Mail** and its line rises to meet it: a spellblade in a hauberk with very low HP and Defense read wrong.
- **The Frostweaver wears Robes or Mail.** It's the chunky ice wall now, by the director's word, and Mail (HP, Attack) is the armor of a mage who stands in the second rank. Mail goes to six wearers.

## Stat lines

Each line is a shape you can name, with at least one stat at the top or the bottom of the scale, and a special stat wherever the trunk wants one. Attack is no longer four for everyone: fighters and the fire mage sit high, walls and healers low, and the classes whose power isn't in their numbers sit in the middle. MP pools stay as `MP_POOL` sets them. The lines are templates: the mace takes a two-HP Cleric to four, and that's the point.

| Class | HP | Attack | Defense | Crit | Aggro | Special stats | The shape |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Knight | 5 | 2 | 4 | 1 | 5 | — | all body, no edge |
| Cleric | 2 | 3 | 2 | 1 | 1 | — | frail; heals from Attack |
| Ranger | 3 | 4 | 2 | 4 | 2 | Accuracy medium | the marksman |
| Bramble knight | 5 | 2 | 3 | 1 | 5 | Thorns high | the thorn wall |
| Hoplite | 4 | 5 | 5 | 2 | 3 | — | the bruiser: hits and takes hits, draws none |
| Paladin | 4 | 4 | 4 | 2 | 3 | — | strong body, little finesse |
| Valkyrie | 3 | 4 | 3 | 3 | 2 | Cooldown medium | the shieldmaiden: quick, survivable, draws little |
| Bard | 3 | 3 | 2 | 2 | 1 | Cooldown medium | tempo |
| Hexer | 3 | 4 | 2 | 2 | 1 | Siphon medium | the spellblade |
| Monk | 3 | 4 | 1 | 2 | 2 | Evasion high, Double strike medium | dodges, hits often |
| Assassin | 2 | 5 | 1 | 5 | 1 | Crit damage high, Evasion medium | the glass dagger |
| Vampire | 4 | 4 | 2 | 2 | 3 | Lifesteal high | body as fuel |
| Pyromancer | 2 | 5 | 1 | 2 | 1 | Cast speed medium | the glass cannon of long casts |
| Frostweaver | 3 | 3 | 3 | 2 | 2 | — | the ice wall: a chunky supporting mage |
| Stormcaller | 2 | 4 | 1 | 2 | 1 | Attack speed medium | the storm in motion |
| Geomancer | 3 | 3 | 5 | 4 | 3 | Crit damage high | stone, then the crit |

What moved, and why:
- **Attack:** the Knight and Bramble knight drop to 2 (nothing in their kits scales from it; the sword stretches a Knight that wants to fight). The Cleric, Bard and Frostweaver drop to 3: the Cleric's heals and the Bard's stacks still read it, but their power isn't in their numbers, and the Frostweaver's shatter doesn't read Attack at all. The Geomancer drops to 3 and its Defense rises to 5. **The Hoplite rises to 5:** the bruiser's numbers are its identity.
- **The Hoplite's Aggro drops to 3,** average: it draws no more than anyone, which is the director's weakness for it, and the spear is where a run buys it the draw.
- **The three mages are three lines, and three kits** (their sheets). The Pyromancer is the glass cannon of long casts: Attack 5, Defense 1, and Cast speed in its line so the long casts land. The Frostweaver is the ice wall: HP 3, Defense 3, no speed stat, its power in the field's Chill and the shelter it gives. The Stormcaller has Attack speed and Defense 1: it swings often and takes hits badly.
- **The speed stats enter four lines:** the Bard's and the Valkyrie's Cooldown, the Pyromancer's Cast speed, the Stormcaller's Attack speed, all medium at a level `SPECIAL` will name. The Frostweaver gets none: its body is its stat.
- **The Valkyrie's Aggro drops to 2:** the director's shieldmaiden isn't a tank. Her Cooldown is her "relatively fast"; her passive is her "relatively survivable".
- **Defense 1** on the Monk (it dodges, it doesn't absorb), the Assassin and the Stormcaller. **Crit 1** on the Knight, Cleric and Bramble knight; the Paladin keeps 2, a floor for Verdict.
- **The Hexer** rises to HP 3 and Defense 2, a spellblade's body. **The Ranger's** Crit rises to 4.

## The classes

Each sheet: the trunk in a line; the identities, each with what you watch, what leans to it (kind, armor, offhand) and the versions that make it; then what changes in the kit and the upgrades. "Kept" means today's version stands as written in `content/core-set/upgrades/`. Builds are named in the findings' and `docs/gear-design/builds.md`'s words. A version marked **reads** closes a signature gap.

### Knight

**Trunk.** Starts behind stone, Guards the lowest, calls the fight onto itself, bashes with its own weight. Nothing in it scales from Attack. Kinds: sword (Attack), hammer (Defense) · Plate · kite shield, horn.

- **The stone wall** (Landslide). You watch the Shield bar and the one big bash. Hammer, kite shield, Plate. Versions: Stonewall, Stone guard (**reads** Defense), Crushing bash.
- **The anchor** (the Toll). Every hit it takes comes back. Sword (Aggro common) or hammer (Thorns common), horn. Versions: Grudge, Hold the line.
- **The champion** (Lockdown, Overflow, the fighting Knight). Holds the line while the casters work, stops a cast, and swings with something behind it. Sword, horn. Versions: Valor (**reads** Attack), Measured blow, Rally the well.

**Kit:** unchanged. **Upgrades:** Vanguard, Stand fast and Shield bash kept as they are (Crushing bash stays from max HP and its Shield). Fortify: Stone guard kept; Cover becomes **Valor:** Guards itself and gains several Might; stacks scale from Attack. The sword finally has something in the kit to feed, and the two Fortify versions are the two weapon routes.

### Cleric

**Trunk.** Quick top-ups, a cleanse and Regen, a slow raise, prayers twice as fast when its own life is in danger. Spends MP for every heal. Kinds: mace (HP), staff (Cast speed) · Robes · relic, lantern.

- **The mender** (Blood Pact, Phoenix). Heals that give of its own body, and a quicker raise. Mace, lantern. Versions: Triage, Martyr's raise, Shared rites.
- **The anchor's priest** (the Toll). Keeps one wall standing. Mace (Thorns common), relic. Versions: Anchor's blessing, Ward of life, Rite of passage.
- **The font** (Overflow). Mana as much as health. Staff (MP regen common), or the mace with the relic. Versions: Font, Battle prayer.

**Kit:** unchanged. **Upgrades:** all kept but two scalings. Triage **heals from the Cleric's max HP** (twice as much, below 40%): it **reads** HP. Ward of life's Shield **scales from the Cleric's max HP,** not the raised ally's: the user-scaling rule. Martyr's raise already reads HP, paying the Cleric's own.

### Ranger

**Trunk.** Arrows that bleed, chill and sunder whatever stands in front; plain arrows past any guard that crit for a living. Kinds: bow (Crit damage), dagger (Crit chance) · Leather · trophy, cloak.

- **The marksman** (the Hunt). One foe at a time, the weakest first. Dagger with the trophy, Leather. Versions: Quarry, Gutting arrow.
- **The skirmisher** (Thousand Cuts). Every crit another shot, every shot a wound. Dagger with the cloak. Versions: Quick draw (**reads** Crit chance), Barbed quiver.
- **The trapper** (Cold Snap, Lockdown). The field held: Chill where it hurts, Sunder on the armored, Bleed deepest on one. Bow. Versions: Pinning arrow, Hail, Armor breaker, Deep barbs.

**Kit:** Hunter's eye: **its basic attacks ignore Taunt and crit more often** (two crit steps on basic attacks). Nothing in the kit touched crit, which was the Ranger's gap in the findings' rule. **Upgrades:** Hunter's eye: Quarry kept; Overwatch becomes **Quick draw:** each crit makes its next basic attack come at once. Barbed arrow: Deep barbs kept; Scatter barbs becomes **Barbed quiver:** no arrow; for a while its basic attacks add a few Bleed (from Attack). Frost arrow kept (Pinning arrow, Hail). Rending arrow kept (Armor breaker, Gutting arrow). The skirmisher had no version before; now it has two.

### Bramble knight

**Trunk.** Draws every foe onto its thorns, where each attacker bleeds; regrows the lowest; lashes with the thorns themselves. Kinds: hammer (Defense), mace (HP) · Plate, Mail · totem, round shield.

- **The anchor** (the Toll). Hammer (Thorns common), Plate, totem. Versions: Bloodroot (**reads** HP), Overgrowth, Deep roots, Rebuke.
- **The field of thorns** (Harvest). Everything that hits it, and everything near, bleeds. Either kind, totem. Versions: Spreading thorns, Whipping vines.
- **The grove-keeper** (Landslide, Blood Pact as support). Guard and Regen for the party. Mace, round shield, Mail. Versions: Grove, Blossom.

**Kit:** unchanged. **Upgrades:** all kept. Briar reads Defense in the base. **Watch:** the flattest weapon pair in the set (see Third kinds).

### Hoplite

**Trunk.** The game's bruiser: slow double swings, a thrust that opens one foe up, a shove with the whole shield that sunders every foe, and an Aegis on the ally about to take the killing blow. Very tanky, big hits, team support, and it draws no fire through its abilities: that's its weakness, and the spear and the horn are where a run buys the draw. Kinds: spear (Aggro), great weapon (Attack) · Plate · round shield, horn.

- **The bruiser** (Landslide, Ambush). The biggest swings in the party. Great weapon, Plate. Versions: Opening thrust, Shieldbearer (**reads** Defense), Breach, Skewer.
- **The phalanx** (Harvest, the Toll). Shields locked, the whole line sundered. Spear, round shield. Versions: Locked shields, Shield wall.
- **The bodyguard** (the Hunt, Lockdown). Stands by one ally and takes the teeth out of the worst foe. Spear, round shield. Versions: Watch the anchor, Disarm.

**Kit:** Phalanx, Aspis and Spear thrust unchanged. **Paired guard is replaced by Othismos:** the shove: damage that scales from Defense to every foe, adding a few Sunder to each; stacks scale from Defense. Medium cooldown, long wind-up. The director's design from the parallel thread, in place of my Phalanx charge from Attack: it reads the Hoplite's Defense 5 in the base kit, and a shove is a shape no other Area ability has. No Taunt anywhere in the kit.
- Othismos, power step: two fifths more Sunder.
- A **Locked shields:** the shove also Guards the Hoplite and the ally with the lowest share of HP. The defensive option, where Paired guard went.
- B **Breach:** one foe only, the one with the most Defense, for triple, adding several Sunder.

**Upgrades:** Phalanx and Aspis kept. Spear thrust: Skewer kept; Hunter's thrust becomes **Disarm:** at the foe with the highest Attack, which is Weakened; no Sunder. Weaken on one more class, which Lockdown asked for, and the bodyguard's own act.

### Paladin

**Trunk.** The judge: helper of the righteous, killer of the wicked. Its hits land half again as hard on any foe that holds a buff or a debuff; it condemns one foe and the whole party strikes it; it lifts curses and heals; it brings down a slow, heavy, burning Smite. Ward is retired. Kinds: mace (HP), great weapon (Attack) · Mail, Plate · kite shield, relic.

- **The judge** (the Hunt, Lockdown, Bonfire). Points at the wicked and the party follows; crits and fire on the condemned. Great weapon, Mail. Versions: Swift justice, Verdict (**reads** Crit chance), Hammer of dawn, Pyre of judgement.
- **The healer** (Blood Pact, Phoenix). Heals paid in its own blood, and a raise. Mace, relic. Versions: Absolution, Penance (**reads** HP).
- **The champion of the line** (the Toll, Landslide). Condemns and Taunts: the wicked come to it. Mace, kite shield, Plate. Versions: Challenge, Zeal, Penance.

**Kit:** two changes, one of them a reversal.
- **Judgement: its hits deal half again as much to foes with a buff or a debuff.** Power step: +70%. A **Zeal:** the bonus, and its basic attacks add a few Burn (from Attack) to such a foe. B **Verdict:** the bonus, and its crit chance is tripled against such a foe.
- **Sanctuary is replaced by Condemn:** Marks the foe with the highest Attack, and every ally's next basic attack comes at once. Medium cooldown, quick wind-up. Marked is a debuff, so Condemn turns Judgement on, and the party's volley lands on the judged. **This reverses the Shield Sanctuary approved in the second draft,** on the director's word from the parallel thread: a Shield on every ally made the Paladin a fifth protector beside the Knight, Hoplite, Bramble knight and Geomancer, and Condemn is a verb no other class has in its kit. The party's Shields are theirs now. Power step: comes round sooner. A **Challenge:** Marks the foe with the highest Attack and the Paladin Taunts; no volley. B **Swift justice:** Marks the foe with the lowest share of its HP, then the volley.

**Upgrades:** Absolve and Smite kept (Penance, Absolution; Hammer of dawn, Pyre of judgement). Sentence, Bulwark of faith and Consecration go with Sanctuary.

### Valkyrie

**Trunk.** The offensive shieldmaiden: a quick, survivable damage dealer, not a tank. Her spear builds her shield as it strikes; three quick hits reach past any guard and shock what they hit; a heavy blow from above cashes the Shock in; and she chooses the slain: one ability mends the lowest ally or raises a fallen one. Kinds: spear (Aggro), sword (Attack) · Mail, Leather · round shield, cloak.

The sword replaces the mace. A damage dealer reads Attack in everything she does, and the sword's commons (HP, Defense, Crit chance) are the shieldmaiden's "relatively survivable"; the mace's HP and MP regen were the healer's, and she isn't one any more. Spear and sword with a round shield, or a swan-feather cloak, is the Norse picture. The mace falls to three wearers and the findings' exception disappears; the sword rises to three (Knight, Hexer, Valkyrie), each pair sharing it alone.

- **The storm spear** (the Hunt, Thousand Cuts). Shock, then the sky falls. Spear, Leather, cloak. Versions: Spear of the hunt, Valkyrie's descent, Chooser of the slain.
- **The shield-sister** (the Toll, Blood Pact). Her shield on whoever needs it, a Taunt when an ally is nearly down. Sword, Mail, round shield. Versions: Shield-sister, Over the fallen (**reads** Aggro), Gale storm.
- **The thunderhead** (Harvest). Shock on everything, then every shocked foe struck at once. Spear. Versions: Gale storm, Thunderclap.
- **The reviver** (Phoenix). A build a run can go for, not the class; its pieces are the loot's, not a kind's. Versions: Einherjar, Over the fallen.

**Kit:** rebuilt around Gale spear, as the director asked.
- **Passive, Shieldmaiden:** each hit she lands gives her a Shield of a share of the damage dealt. Survivable by attacking: her Shield bar grows as she fights and is spent as she's hit, and it soaks a status's damage too. It reads Attack (bigger hits, bigger shield) and HP (the Shield's cap). Power step: a bigger share. A **Chooser of the slain:** no Shield; her hits deal a fifth more to foes below half their HP (offense in place of defence). B **Shield-sister:** the Shield goes to the ally with the lowest share of HP instead of her.
- **Gale spear:** kept, with its versions (Gale storm, Spear of the hunt).
- **Choosing:** heals the ally with the lowest share of max HP, the amount scaling from Attack; if an ally is knocked out, it raises that ally instead, with a tenth of its HP. Waits until an ally is below 80% or down. Medium cooldown, normal wind-up. The heal is smaller than Rally's was and comes round less often: slightly worse at healing, and it revives. Power step: heals, or raises with, two fifths more. A **Einherjar:** an ally it raises comes back with every action ready (the old passive, now a choice). B **Over the fallen:** waits until an ally is below 30% or down; heals for double, or raises; the Valkyrie Taunts and is Guarded, standing over the one she chose.
- **Skyfall:** a heavy blow from above on the foe with the most Shock; the damage scales from Attack and rises with each Shock stack on that foe. The Shock stays. Medium cooldown, normal wind-up. Gale spear stacks the Shock, Skyfall cashes it: the storm spear's beat, and the single-target Shock payoff no class has (the Bard's Resonance is every foe's). Power step: deals two fifths more. A **Thunderclap:** Skyfall on every foe that holds Shock, half as hard. B **Valkyrie's descent:** Skyfall past any guard on the foe with the lowest HP, double below a quarter of its HP; no Shock bonus.
- **Retired:** Einherjar as the passive, Rally, Valhalla, Flight of the valkyries, Battle hymn, Chosen, Chooser of the slain as an aura (Chooser's blessing is dropped; the self version lives on as the passive's A). Dawn muster goes too.

**Upgrades:** Gale spear kept (Gale storm, Spear of the hunt); Shieldmaiden's, Choosing's and Skyfall's versions are above. Over the fallen carries the kit's one Aggro read, as the findings accepted for a version.

**Watch:** Choosing is a revive on a medium cooldown where the documents give revives the very long word. It's also the heal, and it brings a tenth, so the word fits; the balance pass may lengthen it. The Shieldmaiden's Shield-from-damage shares a thread with the Geomancer's mythic (Mountain's crown rebuilds its Shield on crits); the loot step decides whether the mythic moves.

### Bard

**Trunk.** Every note mends and refuels; a ballad steadies the party, an allegro quickens it, and an encore makes an ally's next spell sound twice. Pure support: it deals no damage of its own, as the Cleric deals none. Its Cooldown is its tempo, in its line. Kinds: bow (Crit damage), wand (Cooldown) · Leather, Robes · tome, bell.

- **The conductor** (Overflow, Landslide). The party's casts and blows arranged. Wand, tome, Robes. Versions: Rubato, Rousing chorus, Reprise.
- **The troubadour** (Overflow, Blood Pact). Mends and refuels whoever is lowest. Wand, tome. Versions: Harmony, Lament, Reprise.
- **The skald** (Thousand Cuts, Landslide). Might and Haste on the hitters, and its own three notes in a breath. Bow, or the wand with the bell; Leather. Versions: Battle song, Accelerando, Cadenza.

**Kit:** **Thunder chord is replaced by Encore:** the other ally with the highest Attack casts its next ability twice; the second cast is free. Medium cooldown. Thunder chord was the Bard's one offensive spell and the Stormcaller's Thunderstorm in another key; Encore is the conductor's own verb and Overflow's. Resonance and Lullaby go with it. Power step: comes round sooner. A **Reprise:** in place of the repeat, that ally's ability with the longest cooldown left is ready at once (the director's idea; a version aimed at the ally with the least MP would fire on an empty pool, and isn't a fork worth having). B **Cadenza:** no Encore for an ally; the Bard's own next three basic attacks come at once, three Refrains in a breath. Esoteric, and worth trying.
**Upgrades:** Refrain and Allegro kept. War ballad: Lament kept; Marching song becomes **Rousing chorus:** a few Might on every ally, twice as many on the ally with the slowest basic attack. Landslide's Might on the slow hitter, and the party volley now belongs to the Paladin's Condemn.

### Hexer

**Trunk.** A blade that carries curses: its swing chills, its curses deepen every affliction a foe already holds, it weakens and sunders the most dangerous one, and it silences a foe mid-cast and drinks the spell's mana. Re-themed as a spellblade; the director names it. Kinds: wand (Cooldown), sword (Attack) · Mail · tome, idol. Three identities, by the director's word; none felt viable before, and each has a structural add.

- **The spellbreaker** (Lockdown, Overflow). Shuts casters down and drinks their mana. Sword, idol (Siphon). Versions: Silence all, Mana burn, Focused curse.
- **The curser** (the Toll, Lockdown). Weaken on everything, and the curses come due. Sword, Mail. Versions: Wither, Withering hex, Culmination.
- **The elemental blade** (Harvest, Bonfire, Cold Snap). Burn, Shock and Chill on everything, a little each, deepened by every Malison. Wand, tome. Versions: Hex of flames, Plague, Focused curse.

**Kit:** two changes.
- **Malison deepens:** adds one more stack of each of Burn, Chill, Shock and Sunder every foe already holds, and a few Bleed (from Attack). The Hexer is the status amplifier where the mages are the sources, and the Bleed means it does something alone. The Hexblade (a legendary rune sword) does this on swings today; the loot pass changes it.
- **Unmake waits until a foe is in a wind-up or holds a buff** (approved in the third draft).

**Upgrades:** Cold hex: Hex of flames kept; Deep cold becomes **Withering hex:** its basic attacks Weaken in place of Chill. (The Humbling mace does this on a rare; the loot pass changes the mace, whose wearers changed anyway.) Malison: **Plague** changes to add a few Burn and Shock of its own to every foe as well as deepening; Focused curse kept (one foe, three times as much). Unmake: Silence all kept; Broken spell becomes **Mana burn:** Silences the casting foe, and drains a share of its MP, which the Hexer gains. Siphon's shape in one burst, and it works whenever a foe casts: the director ruled out Spellsteal (bosses' own buffs would need exceptions, and foes almost never buff), and Broken spell paid per buff stripped, which is the same emptiness. Enfeeble: Wither kept; Culmination kept (approved).

### Monk

**Trunk.** Every blow leaves the foe more open, Flow keeps it fast, burning fists pile onto the hottest foe, a pressure point drops the most dangerous one. Kinds: claws (Double strike), spear (Aggro) · Leather · bell, cloak.

- **The blur** (Thousand Cuts). Claws, bell. Versions: Hundred hands, Flow state, Fanned flames.
- **The dancer** (the Toll). Taunts and dodges, and the attackers pay. Spear (Aggro), cloak (Evasion), Leather. Versions: Stillness of mind (**reads** Aggro), Drinking palm.
- **The point-striker** (Lockdown, the Hunt, Cold Snap). Spear. Versions: Lingering point, Vital strike, Frost fist.

**Kit:** unchanged; Flow keeps Haste, and the Stormcaller's duplicate changes. **Upgrades:** all kept.

### Assassin

**Trunk.** Slips out of sight, picks off the weakest past any guard, leaves every crit a wound, silences the back line. Kinds: dagger (Crit chance), axe (Lifesteal) · Leather · vial, trophy.

- **The ambusher** (Ambush). Everything in the first moment. Dagger, trophy. Versions: Opening wound, Shadow step, From the shadows.
- **The hunter** (the Hunt). Kill, reset, kill. Dagger or axe. Versions: Rupture, Coup de grâce, Smoke screen.
- **The drinker** (Blood Pact, Lockdown). A fragile class buying its sustain from the kill. Axe, vial. Versions: Bleed them dry (**reads** Lifesteal), Choke.

**Kit:** unchanged. **Upgrades:** all kept but two. Rupture changes: **its crits deal more for each Bleed the foe holds, and the Bleed stays;** it used to set the Bleed off early and close it, which no ability does now (a status runs its own course). Garrote wire becomes **Bleed them dry:** Seek, damage from Attack to a random foe that isn't Taunting, Rot and many Bleed, and the Assassin's Lifesteal is doubled for a while. No Silence. Nothing in the kit touched the axe's signature; this does.

### Vampire

**Trunk.** Feeds on everything it hits, hardest when nearly dead; its prey is weakened; it bleeds its own life into an ally. Kinds: claws (Double strike), axe (Lifesteal) · Mail · vial, idol.

- **The drinker** (Blood Pact). Claws for more hits, the axe for the drinking. Versions: Shared feast, Undying thirst, Feeding frenzy.
- **The blood-well** (Overflow). Its blood is the party's mana. Idol. Versions: Drain the well, Blood for mana, Lifeblood.
- **The frenzy** (Thousand Cuts, Blood Pact). Faster and faster, every hit a drink. Claws, vial. Versions: Savage drain, Bloodthirst, Feeding frenzy.

**Kit:** unchanged. **Upgrades:** the frenzy had no version; now it has two. Blood drain: Bloodletting becomes **Savage drain:** three quick hits that scale from max HP, a third each, and the foe is Weakened; each hit drinks. Drain the well kept. Frenzy: Feeding frenzy kept; Blood rage becomes **Bloodthirst:** while it holds Might, its basic attacks come a third faster. Bloodlust and Blood gift kept.

### Pyromancer

**Trunk.** The glass cannon of long casts: every spell it casts stokes the fire on the hottest foe, bolts pile more onto it, a fireball spreads it, and a pyre lands. Cast speed is its stat, in its line and on its staff, so the long casts land. Kinds: staff (Cast speed), wand (Cooldown) · Robes · lantern, orb.

- **The ritualist** (Bonfire). The longest casts, the biggest payoff. Staff, lantern. Versions: Slow burn, Conflagration, Pyre of the fallen.
- **The kindler** (Thousand Cuts, Overflow). Fire on every swing, quick bolts. Wand, orb. Versions: Kindling, Flash bolt, Flashfire.
- **The conflagration** (Harvest). The whole field alight. Staff or wand, orb. Versions: Wildfire, Funeral pyre.

**Kit:** **Kindling is replaced as the passive by Stoke:** each ability it casts adds a few Burn to the foe with the most Burn; stacks scale from Attack. The director's call: Burn is stoked by its casts, so the Pyromancer is the caster and its swings are the wand's version. Power step: two fifths more Burn. A **Kindling:** its basic attacks add a few Burn in place of Stoke (the wand's). B **Wildfire:** Stoke adds Burn to every burning foe, half as much to each.
**Upgrades:** Firebolt and Pyre kept. Fireball: Conflagration changes to **many Burn on each foe with a very long wind-up** in place of a longer cooldown (the ritualist's cast; Cast speed pays); Flashfire kept. Searing goes with Kindling.

### Frostweaver

**Trunk.** The ice wall: a chunky supporting mage, and the Chill applier. It lays Chill on the field and on the most-chilled foe until the Chill itself shatters, leaves the shattered foe sundered, and keeps an ally's mana flowing while the frost builds. HP 3, Defense 3, Robes or Mail. Kinds: staff (Cast speed), rune sword (MP regen) · Robes, Mail · tome, orb.

- **The ice wall** (the Toll, Landslide as support). Shelter from each shatter and Guard for everyone. Rune sword, Mail, orb. Versions: Rime shield (**reads** HP), Frost armor, Deep calm.
- **The disabler** (Lockdown). Chill on the dangerous one past any guard, and a Stun when it shatters. Rune sword, tome. Versions: Ice spear, Frozen moment.
- **The shatter killer** (Cold Snap). Shatters on a beat you can count. Staff. Versions: Splinters, Icicles, Avalanche.

**Kit:** unchanged. Shatterpoint (several Sunder on the shattered foe), Frost lance (damage and several Chill on the most-chilled foe), Blizzard (damage and a few Chill on every foe) and Stillness (Clarity on the ally who needs it, and a few Chill on every foe) stand as they are. By the director's word, nothing in the kit triggers a shatter: Chill detonates itself at its cap, and the Frostweaver's identity is applying it. **Shattering reliably is a matter of stacks,** set at build: the words "several" on the lance and "a few" on Blizzard and Stillness (`LANCE_CHILL`, `BLIZZARD_CHILL`, `STILLNESS_CHILL`, against `STATUS.chill.cap` and its thaw) are sized so that a Frostweaver working alone on one foe shatters it within a few casts, and more than once in a regular fight; the balance pass holds them there.

**Upgrades:** Shatterpoint: Brittle becomes **Rime shield:** when a foe shatters, the ally with the lowest share of HP gains a Shield from the Frostweaver's max HP, in place of the Sunder. It reads the wall's body, which Mail and the rune sword carry, rather than Defense, which nothing of its wears. Splinters kept. Frost lance: Ice spear changes to **a lance past any guard at the foe with the highest Attack, adding several Chill; no Slow** (the Chill class doesn't Slow); Icicles kept. Blizzard: Whiteout becomes **Frost armor:** Guards every ally, and a few Chill on every foe; Avalanche kept. Stillness: Deep calm and Frozen moment kept.

**Watch:** the weakest dealer in the prototype. Its line is sturdier and two versions make it the wall; its Chill counts are the balance pass's first job.

### Stormcaller

**Trunk.** Everything it does is quick and spreads: each swing arcs to a second foe, lightning chains, a storm puts Shock on every ally's swings, and it charges itself to swing faster. The striker among the mages. Kinds: claws (Double strike), rune sword (MP regen) · Robes, Leather · totem, bell.

- **The tempest** (Harvest, Overflow). Rune sword, Robes. Versions: Forked arc, Recharge, Overcharge.
- **The storm fist** (Thousand Cuts, the Hunt). Claws, Leather, bell. Versions: Static grip, Ball lightning, Storm's eye.
- **The lightning rod** (the Toll). Struck, it and its allies strike back. Either kind, totem. Versions: Static field, Storm shield.

**Kit:** two changes.
- **Thunderstorm is the party's storm:** for a while, every ally's basic attacks add a few Shock; stacks scale from the Stormcaller's Attack. The old Thunderstorm was Fireball in another colour. Power step: two fifths more Shock. A **Static field:** in place of the swings, every foe that hits an ally gains a few Shock while it lasts. B **Storm's eye:** the swings' Shock goes to the foe with the most Shock, wherever they land, three times as much. The storm fist's Hunt: the whole party's swings pile Shock on one foe, and Ball lightning finishes it. (Ride the lightning, which sped the Stormcaller from the party's swings, was too esoteric; this is the focus pattern Searing and Deep cold used.)
- **Static charge: its basic attacks come faster for a while** (Attack speed, not Haste: the Monk's Flow is Haste). Overcharge keeps its idea on the new base (its next three abilities cost no MP while it lasts); Storm shield kept.

**Upgrades:** Arc and Chain lightning kept. Supercell goes with the old Thunderstorm.

### Geomancer

**Trunk.** Wraps itself and an ally in stone, and while its own stone holds its blows crit far more often and far harder. Defense is its spell stat; the great weapon is where its Attack comes from. Kinds: hammer (Defense), great weapon (Attack) · Plate · kite shield, trophy.

- **The landslide** (Landslide). Great weapon. Versions: Faultline, Boulder, Fissure, Rampart.
- **The quake** (Lockdown, Cold Snap). Hammer, trophy. Versions: Stunning crits, Aftershock.
- **The stone warden** (Landslide and Phoenix as support). Stone for the others. Hammer, kite shield. Versions: Stone skin, Rock shelter.

**Kit:** unchanged. **Upgrades:** all kept but one. Rockslide becomes **Rock shelter:** the ally with the lowest share of HP gains a Shield as large as the damage Rockfall dealt. It pulls Rockfall apart from Tremor (both were a Defense hit at a random foe) and gives the stone warden a second version. **Watch:** with the Knight's sword, the thinnest Attack read in the set: the swing, which Bedrock's doubled crits and Faultline's triple land on. Boulder is the version that could take Attack as its scaling if the read proves too thin in play.

## Who reads what

The findings' list, after this design. Every signature of every weapon and offhand kind is read by every wearer, in the base kit, a version, or the survival of a body built for it.

| Stat | Read by |
| --- | --- |
| Attack | nearly every hit and stack; the Cleric's Cure, the Paladin's heals and Smite, the Vampire's Frenzy, the Hexer's Culmination, the Valkyrie's Shieldmaiden, Choosing and Skyfall, the Knight's Valor, the Pyromancer's Stoke. The Geomancer reads it in the swing. |
| HP | Knight (Vanguard, Shield bash), Vampire (Blood drain, Savage drain, Blood gift), Cleric (Martyr's raise, Triage, Ward of life), Paladin (Penance), Bramble knight (Regen, Bloodroot), Valkyrie (the Shield's cap), Frostweaver (Rime shield, its body), Hoplite and the walls' survival. |
| Defense | Geomancer (Earthen shell, Rockfall, Tremor), Bramble knight (Briar), Hoplite (Othismos, Shieldbearer), Knight (Stone guard), Paladin, Frostweaver and the walls' survival. |
| Crit chance | Assassin (Backstab, Lacerate), Geomancer (Bedrock), Ranger (Hunter's eye, Quick draw), Paladin (Verdict). |
| Crit damage | Assassin, Geomancer, Ranger (Hunter's eye), Bard (Refrain). |
| Double strike | Monk (Iron palm), Stormcaller (Arc), Vampire (more drinking). |
| Attack speed | the basic-attack riders: Hexer (Cold hex), Stormcaller (Arc, its own), Ranger (Hunter's eye), Bard (Refrain), Monk (Iron palm), Paladin (Zeal), Valkyrie (Shieldmaiden), Vampire (Bloodthirst), Pyromancer (the Kindling version). |
| Cast speed | Pyromancer (its own; Pyre, Conflagration), Frostweaver (Blizzard), Cleric (Raise), Paladin (Smite), Geomancer (Tremor), Hoplite (Othismos). |
| Cooldown | the classes that lead with abilities: Bard (its own), Valkyrie (its own), Hexer, Pyromancer, Cleric (Last rites). |
| Aggro | the walls (Knight, Bramble knight), Valkyrie (Over the fallen), Monk (Stillness of mind), Hoplite (the tanky bruiser the spear turns into a wall). |
| Lifesteal | Vampire (Bloodlust, Feeding frenzy), Assassin (Bleed them dry). |
| MP regen | Frostweaver, Stormcaller, Cleric, Paladin: dear spells and no free heal. |
| MP | Pyromancer, Frostweaver: the dearest spells in the set. |
| Thorns | Bramble knight; Stormcaller (Storm shield, the live wire), Knight (Hold the line). |
| Evasion | Monk (its own, Stillness of mind), Assassin, Valkyrie and Ranger (light bodies kept standing), the Stormcaller's leather. |
| Siphon | Hexer; Vampire (its blood-well versions move MP). |
| Accuracy | Ranger. Never a signature. |

## Decisions

Settled by the director across the drafts: a class has three identities and the design serves each; the weapon and offhand kinds by the same rules, the Valkyrie on spear and sword; armor as the four weight classes; Judgement on debuffed foes, with Zeal and Verdict; the Hoplite's second guard replaced by an offensive Area ability with a defensive version and no Taunt; Einherjar retired and the Valkyrie rebuilt as the offensive shieldmaiden; the Hexer's structural adds.

From the parallel thread's feedback, taken into this draft, with what they reverse:
1. **Condemn in place of Sanctuary** (the Paladin Marks and the party strikes). This reverses the Shield-on-every-ally Sanctuary approved in the second draft, and its versions Bulwark of faith and Consecration go. The Paladin stops being a party-Shield source; the Knight, Hoplite, Bramble knight, Geomancer and Cleric are. I think the reversal is right: Condemn is a verb nobody else has, and Marked being a debuff makes Judgement and Condemn one idea.
2. **The Pyromancer has Cast speed in its line and Stoke as its passive;** Kindling becomes the wand's version. This reverses "no speed stat on purpose".
3. **The Frostweaver is the ice wall:** HP 3, Defense 3, Robes or Mail, no speed stat; Rime shield (from its max HP) and Frost armor are new; the kit is otherwise unchanged, and nothing triggers a shatter. This reverses the squishy controller line.
4. **Othismos from Defense** in place of Phalanx charge from Attack, with Locked shields and Breach; Disarm in place of Hunter's thrust.
5. **Encore** in place of Thunder chord, with Reprise and Cadenza; Rousing chorus in place of Marching song.
6. **Malison deepens;** Plague, Withering hex and Mana burn; three Hexer identities.
7. **Thunderstorm is the party's storm,** with Static field and Storm's eye; Supercell goes.
8. **The Chill class doesn't Slow:** Ice spear uses Chill and Seek. Slow stays a player status everywhere else.
9. **Rupture reads the Bleed and leaves it;** Savage drain and Bloodthirst; Valor; Quick draw and Barbed quiver; Rock shelter; Over the fallen.

Where I pushed back, or didn't take the other thread's version:
- **Judgement's versions stay Zeal and Verdict,** which the director chose here, over Grace and a Marked-only Sentence.
- **Culmination stays** over Expose: the director agreed the Hexer lacked a payoff of its own.
- **Bleed them dry stays** over Garrote wire: the axe's Lifesteal needs a reader in the Assassin's kit.
- **The Valkyrie stays as approved here** (Shieldmaiden, Choosing, Skyfall), not the other thread's Einherjar kit; its Over the fallen is taken as a Choosing version.
- **Blizzard keeps its damage,** and Stillness its Chill. The Frostweaver's kit stands as it was; the director's three objections to the fifth draft (the Defense read, the trigger lance, Clarity alone) are all withdrawn.
- **Locked shields Guards two,** not every ally, so it doesn't repeat the Bramble knight's Grove.

Least sure, flagged for the build and the balance pass: Cadenza (esoteric, and worth trying by the director's word), Mana burn's size, and the Frostweaver's Chill counts.

Settled on the director's last notes: **the swing, scaling and budget words per kind** (*Swings and budgets*) as a default a piece may step from; Attack never the signature of an Attack-heavy kind, and a common where the findings have it; **stats on every piece at every rarity;** and **a weapon's damage per tick shown in the interface.**

Designer's calls still open to being overruled:
- **Hunter's eye crits more often** on basic attacks.
- **The speed stats in four lines:** Bard and Valkyrie Cooldown, Pyromancer Cast speed, Stormcaller Attack speed.
- **The Stormcaller in Leather, the Frostweaver in Mail,** each beside Robes.
- **The stat lines** as tabled; **no third kinds now.**
- **Scaling fixed to the user** where a class's own content read the target: Ward of life's Shield.

## What the build step has to do

Not this step's work, listed so the design is honest about its cost. **The sequence, by the director's word:** build this pass on the current gear first, then redesign the builds on the new classes, then the loot. So this pass spends least on what the builds pass will redo: the new kinds' commons and uncommons are written by their profiles, since those survive any builds redesign, and their rares and legendaries are a first fill flagged for the builds pass. The twelve builds stop being a standing rule when this step closes (`docs/rules.md`), and the build test runs on minimally repaired routes for the measurements only.

- **Kinds:** the vocabulary's weapon table (twelve kinds; rod gone, fist renamed claws, axe and hammer added; rune sword and mace slow), `KIND_SPEED` for the new kinds, the classes' kinds, the gear-slots tool's tables.
- **Swings:** `WEAPON` grows per-kind words (`SWING_POWER`, `SWING_SCALING`, `KIND_BUDGET`), `weaponHit` reads them, the plain weapons follow, and the exchange rate is measured first (`npx tsx tools/build-test.ts` with a stat step against a swing step, class by class).
- **Stats at every rarity:** the loot's rarity table (`docs/gear-design/loot.md`) changes: rares and legendaries carry their kind's steps beside their effect, and the 240 pieces are re-read for it with the offhand pass.
- **The interface:** a weapon's damage per tick for its holder on the card, the sheet and the comparison, beside its speed and scaling (`ui/src/describe.ts`, `sheet.ts`).
- **Pieces:** eight rod pieces rehomed; sixteen axe and hammer pieces written to the kinds' profiles; twenty-four offhand pieces written for the orb, trophy and cloak, and the eighty existing offhands re-read against their kinds' new profiles and wearers (the bell's Cleric pieces, the horn's Bard pieces, the totem's Ranger and Geomancer pieces move or change); the loot stock table (twelve weapon kinds, thirteen offhand kinds); the commons-and-uncommons lean table rewritten from both profile tables. Wearer lists change on many cards, and the Shadow cloak (a leather rare) wants a new name.
- **Ward retired:** Sigil blade and Prior's mace (new uncommon effects), the Lich's Dark ward and the Fire Giant's Kindle (Guard or Shield in its place), the Buffer's list, and every challenge whose answers name Ward.
- **Pieces the kit now does:** the Hexblade (Malison deepens) and the Humbling mace (Withering hex); the Notched knife beside Barbed quiver and Static mail beside Static field share a thread in a different shape, a check and not a change.
- **Mythics touched:** Stormspear (the Valkyrie's) still fits the storm spear. The last wall (the Hoplite's) reads Aspis, which stays. Mountain's crown (the Geomancer's) shares a thread with Shieldmaiden; the loot step decides. Two offhand mythics sit in kinds their class no longer wears: Metronome (a horn, the Bard's; it also readies Thunder chord, now Encore) and Chains of light (a lantern, the Paladin's) take a kind their class wears, or none, as a mythic may. None depends on Einherjar, Rally, Valhalla or Paired guard; the build parties and routes in `tools/build-parties/` and `docs/gear-design/builds.md` need rewriting: the Valkyrie's everywhere, Harvest without the Bard, Rockslide and Supercell, the Hunt with Condemn and without Hunter's thrust.
- **Scaling from the user, on pieces:** several pieces heal or shield from the receiving ally's max HP (Rallying horn, Charnel icon, Martyr's locket, Mantle of the fallen, Vestments of return). The director's rule is for classes here; whether it reaches pieces is their call, flagged.
- **Engine:** a class line carrying a speed stat (a `SPECIAL` entry and the sheet showing it); a heal-or-revive ability (two effects, each with its own target, as Ward of life already does); Encore's marker (an ally's next ability resolves twice, the second free: the Cataclysm staff's recast on a given marker). The rest exists: an MP drain on a hit's target and a cooldown readied on an ally (Mana burn, Reprise), crit steps on basic attacks, Attack speed self-buffs, Lifesteal doubling, Shield from a hit's damage, Marked and the party volley (Marching song's effect), buff stealing (the idol's `move`), "or" conditions and per-stack and per-debuff scaling.
- **Documents at close:** `classes.md` (every changed line), `rules-and-vocabulary.md` (the weapon table, Ward, the speed stats), `loot.md` (stock, leans), `builds.md` (the Valkyrie's routes and border abilities), `philosophy.md` (slots), `rules.md` (the frame's rules, the findings' weapon rules), the code map if files split.
- **Then measure:** `npm run balance`, the build test on every route that changed, and feel reads of a Frostweaver building a shatter alone, a Paladin's Condemn and the volley that follows, a Hoplite's shove, a Valkyrie's Shield bar through a fight, and a Skyfall after three Gale spears.

## Checks

- **No two kinds share a profile:** every pair of kinds differs in at least two of speed, hands, swing, scaling and budget, checked against the table.
- **The four weapon rules hold with no exception.** Wearers a kind: 2 to 3. No two classes share more than one weapon kind (checked pair by pair; the sword's three wearers each share it alone). Every class has a one-handed kind. No class has three.
- **The offhand rules hold:** thirteen kinds of two or three wearers, two a class, no pair sharing more than one, checked by script.
- **Every signature is read by every wearer,** per *Who reads what*. The thinnest reads are the Knight's and Geomancer's Attack (the swing), the Vampire's Siphon and the Ranger's Evasion, all flagged.
- **No two classes share a base ability** once Static charge changes, **every passive works in every fight** once Einherjar goes, and **the mages share no template:** Fireball is the nuke, Blizzard the field's Chill, Thunderstorm the party's swings.
- **No Frostweaver ability applies Slow, and none triggers a shatter;** **no ability sets a status off early** once Rupture changes.
- **Every class has three identities,** each with a kind that leans to it and at least two versions that make it; the skirmisher, the frenzy and the ice wall had none before.
- **The three mages differ in kinds, armor, line and kit:** staff and wand in robes at Attack 5 with Cast speed, stoking a fire with every cast; staff and rune sword in robes or mail at HP 3 and Defense 3, laying Chill until it bursts; claws and rune sword in robes or leather with Attack speed, putting the storm on everyone's swings.
