# Design: class identity after Magic

The design as approved by the director at its gate (`intent.md` has their answers on each draft). The next stage is build and tune, costed under *What the build step has to do*. It reads with the director's findings document (the weapon rules, the twelve kinds, their stat profiles). Nothing here is built, and no number is final: sizes belong to `content/core-set/scale.ts` when the build step comes.

## The frame

**A class has a trunk and several identities.** The trunk is its base kit, what every build of it does. Its identities are the two or three ways a run can build it, each a way to play you can watch, and each has to be viable: it needs a payoff inside the kit (in the base or a version), a weapon kind whose signature leans to it, and loot that serves it. The design never picks one identity over another; it makes each one stand. Where an identity isn't viable today, the sheet says what it lacks, structurally; sizes are the build step's.

**The stack.** Kit first: the trunk and the versions. Gear kinds next: a kind's signature stat says which way a piece pushes its wearer, so a class's two kinds are two of its directions, and its offhand and armor lean the same ways. Stat line last: a template of strengths and weaknesses that gear stretches far.

**What "reads" means.** A class reads a stat when its kit scales from it, triggers on it, or is kept standing by it the way a wall is kept standing by HP and Defense. A version that scales from a stat counts: scaling can be part of a version's identity. Every wearer reads its kind's signature stat; this design closes every gap in that rule.

**The rules carried from the findings** (weapons): at most three classes a kind (the findings' mace exception isn't needed once the Valkyrie wears the sword); two classes share at most one weapon kind; every class has a one-handed kind; a class may have up to three kinds. Accuracy is never a signature. All gear carries stats; higher rarity is generally better. Everything scales from the user, revives excepted.

**New rules this design proposes** (for `docs/rules.md` if kept):
- **A class has two or three identities, and each is viable.** Its versions split toward them; no identity is the class.
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
| Pyromancer | 2 | 5 | 1 | 2 | 1 | — | the glass cannon |
| Frostweaver | 2 | 3 | 2 | 2 | 1 | Cast speed medium | the controller |
| Stormcaller | 2 | 4 | 1 | 2 | 1 | Attack speed medium | the storm in motion |
| Geomancer | 3 | 3 | 5 | 4 | 3 | Crit damage high | stone, then the crit |

What moved, and why:
- **Attack:** the Knight and Bramble knight drop to 2 (nothing in their kits scales from it; the sword stretches a Knight that wants to fight). The Cleric, Bard and Frostweaver drop to 3: the Cleric's heals and the Bard's stacks still read it, but their power isn't in their numbers, and the Frostweaver's shatter doesn't read Attack at all. The Geomancer drops to 3 and its Defense rises to 5. **The Hoplite rises to 5:** the bruiser's numbers are its identity.
- **The Hoplite's Aggro drops to 3,** average: it draws no more than anyone, which is the director's weakness for it, and the spear is where a run buys it the draw.
- **The three mages are three lines now.** The Pyromancer is the glass cannon (Attack 5, Defense 1). The Frostweaver has Attack 3 and Cast speed: its power is in denying foes their actions and casting its long spells sooner, not in hit size. The Stormcaller has Attack speed and Defense 1: it swings often and takes hits badly.
- **The speed stats enter four lines:** the Bard's and the Valkyrie's Cooldown, the Frostweaver's Cast speed, the Stormcaller's Attack speed, all medium at a level `SPECIAL` will name. The Pyromancer gets none on purpose.
- **The Valkyrie's Aggro drops to 2:** the director's shieldmaiden isn't a tank. Her Cooldown is her "relatively fast"; her passive is her "relatively survivable".
- **Defense 1** on the Monk (it dodges, it doesn't absorb), the Assassin and the Stormcaller. **Crit 1** on the Knight, Cleric and Bramble knight; the Paladin keeps 2, a floor for Verdict.
- **The Hexer** rises to HP 3 and Defense 2, a spellblade's body. **The Ranger's** Crit rises to 4.

## The classes

Each sheet: the trunk in a line; the identities, each with what you watch, what leans to it (kind, armor, offhand) and the versions that make it; then what changes in the kit and the upgrades. "Kept" means today's version stands as written in `content/core-set/upgrades/`. Builds are named in the findings' and `docs/gear-design/builds.md`'s words. A version marked **reads** closes a signature gap.

### Knight

**Trunk.** Starts behind stone, Guards the lowest, calls the fight onto itself, bashes with its own weight. Nothing in it scales from Attack. Kinds: sword (Attack), hammer (Defense) · Plate · kite shield, horn.

- **The stone wall** (Landslide). You watch the Shield bar and the one big bash. Hammer, kite shield, Plate. Versions: Stonewall, Stone guard (**reads** Defense), Crushing bash.
- **The anchor** (the Toll). Every hit it takes comes back. Sword (Aggro common) or hammer (Thorns common), horn. Versions: Grudge, Hold the line.
- **The keeper** (Overflow, Lockdown). Holds the line while the casters work, and stops a cast. Horn (MP regen), either kind. Versions: Rally the well, Cover, Measured blow.

**Kit:** unchanged. **Upgrades:** all kept but one. Crushing bash changes its scaling: **bashes a random foe for double, scaling from Attack and its current Shield together.** No Stun, a longer cooldown. The sword's blow; it **reads** Attack where the base reads max HP, and the fighting Knight is the stone wall with a sword.

### Cleric

**Trunk.** Quick top-ups, a cleanse and Regen, a slow raise, prayers twice as fast when its own life is in danger. Spends MP for every heal. Kinds: mace (HP), staff (Cast speed) · Robes · relic, lantern.

- **The mender** (Blood Pact, Phoenix). Heals that give of its own body, and a quicker raise. Mace, lantern. Versions: Triage, Martyr's raise, Shared rites.
- **The anchor's priest** (the Toll). Keeps one wall standing. Mace (Thorns common), relic. Versions: Anchor's blessing, Ward of life, Rite of passage.
- **The font** (Overflow). Mana as much as health. Staff (MP regen common), or the mace with the relic. Versions: Font, Battle prayer.

**Kit:** unchanged. **Upgrades:** all kept but two scalings. Triage **heals from the Cleric's max HP** (twice as much, below 40%): it **reads** HP. Ward of life's Shield **scales from the Cleric's max HP,** not the raised ally's: the user-scaling rule. Martyr's raise already reads HP, paying the Cleric's own.

### Ranger

**Trunk.** Arrows that bleed, chill and sunder whatever stands in front; plain arrows past any guard that crit for a living. Kinds: bow (Crit damage), dagger (Crit chance) · Leather · trophy, cloak.

- **The hunter** (the Hunt). One foe at a time, the weakest first. Dagger with the trophy or the cloak, Leather. Versions: Quarry, Deep barbs, Gutting arrow.
- **The overwatch** (Lockdown). Shoots the one winding up. Bow. Versions: Overwatch, Pinning arrow, Armor breaker.
- **The spreader** (Harvest, Cold Snap). A barb on everything. Bow (Attack speed common). Versions: Scatter barbs, Hail.

**Kit:** Hunter's eye changes: **its basic attacks ignore Taunt and crit more often** (two crit steps on basic attacks; the engine has the rule). Nothing in the kit touched crit, which was the Ranger's gap in the findings' rule; this one line makes both kinds' signatures read in the base. **Upgrades:** all kept.

### Bramble knight

**Trunk.** Draws every foe onto its thorns, where each attacker bleeds; regrows the lowest; lashes with the thorns themselves. Kinds: hammer (Defense), mace (HP) · Plate, Mail · totem, round shield.

- **The anchor** (the Toll). Hammer (Thorns common), Plate, totem. Versions: Bloodroot (**reads** HP), Overgrowth, Deep roots, Rebuke.
- **The field of thorns** (Harvest). Everything that hits it, and everything near, bleeds. Either kind, totem. Versions: Spreading thorns, Whipping vines.
- **The grove-keeper** (Landslide, Blood Pact as support). Guard and Regen for the party. Mace, round shield, Mail. Versions: Grove, Blossom.

**Kit:** unchanged. **Upgrades:** all kept. Briar reads Defense in the base. **Watch:** the flattest weapon pair in the set (see Third kinds).

### Hoplite

**Trunk.** The game's bruiser: slow double swings, a thrust that opens one foe up, a slow charge that strikes every foe, and an Aegis on the ally about to take the killing blow. Very tanky, big hits, team support, and it draws no fire through its abilities: that's its weakness, and the spear and the horn are where a run buys the draw. Kinds: spear (Aggro), great weapon (Attack) · Plate · round shield, horn.

- **The bruiser** (Landslide, Ambush). The biggest swings in the party. Great weapon, Plate. Versions: Opening thrust, Shieldbearer (**reads** Defense), Shield advance.
- **The line-breaker** (Harvest). Hits that carry through the whole line. Spear, round shield. Versions: Skewer, Breaking charge, Shield wall.
- **The hunter** (the Hunt). Spear, round shield. Versions: Hunter's thrust, Watch the anchor.

**Kit:** Phalanx, Aspis and Spear thrust unchanged. **Paired guard is replaced by Phalanx charge:** a slow charge that strikes every foe; the damage scales from Attack. Medium cooldown, long wind-up; the Area hit's word is sized at build. The director's ask: a slow, tanky, big-hit team support with an Area attack here. No Taunt anywhere in the kit.
- Phalanx charge, power step: deals two fifths more.
- A **Shield advance:** when it lands, the Hoplite and the ally with the lowest share of HP are Guarded. The defensive option, where Paired guard went.
- B **Breaking charge:** adds a few Sunder (from Attack) to every foe it hits. The whole field opened for the party.

**Upgrades:** Phalanx, Aspis and Spear thrust kept. The old Paired guard versions (Line of shields, Guard the blade) go with it.

### Paladin

**Trunk.** A tanky supporting damage dealer. Its hits land half again as hard on debuffed foes; its faith shields the whole party from its own Attack; it lifts curses and heals; it brings down a slow, heavy, burning Smite. Ward is retired. Kinds: mace (HP), great weapon (Attack) · Mail, Plate · kite shield, relic.

- **The crusader** (Bonfire, Harvest). Shields, then fire. Great weapon, Mail. Versions: Zeal, Consecration, Pyre of judgement.
- **The bulwark** (Landslide, Lockdown). Shields from its own body, a Stun from the sky, and crits on the condemned. Mace, kite shield, Plate. Versions: Bulwark of faith (**reads** HP), Hammer of dawn, Verdict.
- **The penitent** (Blood Pact, Phoenix). Heals paid in its own blood, and a raise. Mace, relic. Versions: Penance (**reads** HP), Absolution.

**Kit:** two changes.
- **Judgement: its hits deal half again as much to foes with a debuff** (the old Inquisition, by the director's word: few foes buff themselves). Power step: +70%. A **Zeal:** the bonus, and its basic attacks add a few Burn (from Attack) to a foe that holds a debuff. B **Verdict:** the bonus, and its crit chance is tripled against a foe that holds a debuff. Both versions keep the fantasy whole and add to it, as the director asked; Sentence (the bonus moved to the highest-Attack foe) goes. Verdict **reads** Crit chance, which the Paladin's kinds carry as a common.
- **Sanctuary: a Shield on every ally; the amount scales from the Paladin's Attack.** Long cooldown and wind-up as now. Power step: Shields two fifths bigger. A **Bulwark of faith:** the Shields scale from the Paladin's max HP, half again as big. B **Consecration:** the Shields, and a few Burn on every foe (from Attack).

**Upgrades:** Absolve and Smite kept (Penance, Absolution; Hammer of dawn, Pyre of judgement).

### Valkyrie

**Trunk.** The offensive shieldmaiden: a quick, survivable damage dealer, not a tank. Her spear builds her shield as it strikes; three quick hits reach past any guard and shock what they hit; a heavy blow from above cashes the Shock in; and she chooses the slain: one ability mends the lowest ally or raises a fallen one. Kinds: spear (Aggro), sword (Attack) · Mail, Leather · round shield, cloak.

The sword replaces the mace. A damage dealer reads Attack in everything she does, and the sword's commons (HP, Defense, Crit chance) are the shieldmaiden's "relatively survivable"; the mace's HP and MP regen were the healer's, and she isn't one any more. Spear and sword with a round shield, or a swan-feather cloak, is the Norse picture. The mace falls to three wearers and the findings' exception disappears; the sword rises to three (Knight, Hexer, Valkyrie), each pair sharing it alone.

- **The storm spear** (the Hunt, Thousand Cuts). Shock, then the sky falls. Spear, Leather, cloak. Versions: Spear of the hunt, Valkyrie's descent, Chooser of the slain.
- **The shield-sister** (the Toll, Blood Pact). Her shield on whoever needs it, a Taunt when an ally is nearly down. Sword, Mail, round shield. Versions: Shield-sister, Last stand (**reads** Aggro), Gale storm.
- **The thunderhead** (Harvest). Shock on everything, then every shocked foe struck at once. Spear. Versions: Gale storm, Thunderclap.
- **The reviver** (Phoenix). A build a run can go for, not the class; its pieces are the loot's, not a kind's. Versions: Einherjar, Dawn muster.

**Kit:** rebuilt around Gale spear, as the director asked.
- **Passive, Shieldmaiden:** each hit she lands gives her a Shield of a share of the damage dealt. Survivable by attacking: her Shield bar grows as she fights and is spent as she's hit, and it soaks a status's damage too. It reads Attack (bigger hits, bigger shield) and HP (the Shield's cap). Power step: a bigger share. A **Chooser of the slain:** no Shield; her hits deal a fifth more to foes below half their HP (offense in place of defence). B **Shield-sister:** the Shield goes to the ally with the lowest share of HP instead of her.
- **Gale spear:** kept, with its versions (Gale storm, Spear of the hunt).
- **Choosing:** heals the ally with the lowest share of max HP, the amount scaling from Attack; if an ally is knocked out, it raises that ally instead, with a tenth of its HP. Waits until an ally is below 80% or down. Medium cooldown, normal wind-up. The heal is smaller than Rally's was and comes round less often: slightly worse at healing, and it revives. Power step: heals, or raises with, two fifths more. A **Einherjar:** an ally it raises comes back with every action ready (the old passive, now a choice). B **Last stand:** waits until an ally is below 30% or down; heals for double; the Valkyrie Taunts.
- **Skyfall:** a heavy blow from above on the foe with the most Shock; the damage scales from Attack and rises with each Shock stack on that foe. The Shock stays. Medium cooldown, normal wind-up. Gale spear stacks the Shock, Skyfall cashes it: the storm spear's beat, and the single-target Shock payoff no class has (the Bard's Resonance is every foe's). Power step: deals two fifths more. A **Thunderclap:** Skyfall on every foe that holds Shock, half as hard. B **Valkyrie's descent:** Skyfall past any guard on the foe with the lowest HP, double below a quarter of its HP; no Shock bonus.
- **Retired:** Einherjar as the passive, Rally, Valhalla, Flight of the valkyries, Battle hymn, Chosen, Chooser of the slain as an aura (Chooser's blessing is dropped; the self version lives on as the passive's A). Dawn muster moves to Choosing as its reliability version if the director wants three Phoenix versions; otherwise it goes too.

**Watch:** Choosing is a revive on a medium cooldown where the documents give revives the very long word. It's also the heal, and it brings a tenth, so the word fits; the balance pass may lengthen it. The Shieldmaiden's Shield-from-damage shares a thread with the Geomancer's mythic (Mountain's crown rebuilds its Shield on crits); the loot step decides whether the mythic moves.

### Bard

**Trunk.** Every note mends and refuels; a ballad steadies the party, an allegro quickens it, thunder makes every foe pay for acting. Its Cooldown is its tempo, now in its line. Kinds: bow (Crit damage), wand (Cooldown) · Leather, Robes · tome, bell.

- **The pacer** (Thousand Cuts, Landslide). Might and Haste where they count. Bow, or the wand with the bell; Leather. Versions: Battle song, Marching song, Accelerando.
- **The wellspring** (Overflow). Mana round the party. Wand, Robes, tome. Versions: Harmony, Rubato.
- **The dirge** (Harvest, Lockdown). Shock that comes due, and a Slow on everyone. Wand, tome. Versions: Resonance, Lullaby.

**Kit:** unchanged. **Upgrades:** all kept. Refrain reads Crit damage: a crit is the biggest hit, and Refrain is a share of it.

### Hexer

**Trunk.** A blade that carries curses: its swing chills, its curses burn, shock, weaken and sunder, and it silences a foe mid-cast and strips what it was given. Re-themed as a spellblade; the director names it. Kinds: wand (Cooldown), sword (Attack) · Mail · tome, idol. Two identities, both to stand; neither feels viable today, and the director has taken both structural adds below.

- **The status torrent** (Harvest, Bonfire, Cold Snap). Six statuses on the field, each a little, all scaling from Attack; the wand and the tome bring them round faster, the sword makes each bigger. Versions: Hex of flames, Deep cold, Plague, Focused curse. What it lacks: a payoff of its own. The statuses' own damage is the payoff, and it's the balance pass's to size; the structural add is Culmination (below), which pays for every debuff on a foe.
- **The witch-hunter** (Lockdown, the Toll). Shuts casters and buffers down, weakens everything. Sword, idol (Siphon). Versions: Silence all, Broken spell, Wither, Culmination. What it lacks: Unmake fires only on a cast, so against a pack with no caster the hunter has nothing to hunt, and its payoff is the party's (Weaken, Sunder, Silence make everyone else's fight easier) with none of its own. Two structural adds: Unmake's condition widens, and Culmination.

**Kit:** one change. **Unmake waits until a foe is in a wind-up or holds a buff,** and aims at the casting foe with the highest Attack, else the buffed one. The classes document records that the director's design named both triggers and the engine couldn't join them with "or"; it can now (`if: { any }`, used by Ward of life). The hunter fires in every fight that has a caster or a buff.
**Upgrades:** Cold hex, Malison and Unmake kept. Enfeeble: Wither kept; Expose becomes **Culmination:** Weakens the foe with the highest Attack and deals damage to it for each debuff it holds (from Attack). The curses come due. Both identities feed it, which is the web working: the torrent piles the debuffs on, the hunter chooses the foe.

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

**Kit:** unchanged. **Upgrades:** all kept but one. Garrote wire becomes **Bleed them dry:** Seek, damage from Attack to a random foe that isn't Taunting, Rot and many Bleed, and the Assassin's Lifesteal is doubled for a while. No Silence. Nothing in the kit touched the axe's signature; this does.

### Vampire

**Trunk.** Feeds on everything it hits, hardest when nearly dead; its prey is weakened; it bleeds its own life into an ally. Kinds: claws (Double strike), axe (Lifesteal) · Mail · vial, idol.

- **The drinker** (Blood Pact). Claws for more hits, the axe for the drinking. Versions: Shared feast, Bloodletting, Feeding frenzy.
- **The blood-well** (Overflow). Its blood is the party's mana. Idol. Versions: Drain the well, Blood for mana.
- **The undying** (Phoenix, Blood Pact). Versions: Undying thirst, Lifeblood, Blood rage.

**Kit:** unchanged. **Upgrades:** all kept.

### Pyromancer

**Trunk.** The glass cannon of long wind-ups: every strike adds Burn, bolts pile onto the hottest foe, a pyre lands. The one mage with no speed stat, because its slowness is the point. Kinds: staff (Cast speed), wand (Cooldown) · Robes · lantern, orb.

- **The pyre-keeper** (Bonfire). Staff. Versions: Searing, Slow burn, Conflagration, Pyre of the fallen.
- **The field-burner** (Harvest). The staff, or the wand with the lantern. Versions: Wildfire, Funeral pyre.
- **The flash-caster** (Thousand Cuts, Overflow). Wand, orb. Versions: Flash bolt, Flashfire.

**Kit:** unchanged. **Upgrades:** all kept; they already split by kind.

### Frostweaver

**Trunk.** Decides when foes act: Chill slows them a little more with every stack and shatters into damage and a Stun, the shattered foe is left sundered, and the time it buys goes to an ally's mana. Its power is in the lock, not the number: Attack 3, Cast speed in its line. Kinds: staff (Cast speed), rune sword (MP regen) · Robes · tome, orb.

- **The shatterer** (Cold Snap). Staff. Versions: Splinters, Icicles, Whiteout, Avalanche.
- **The lock** (Lockdown). Rune sword, tome. Versions: Brittle, Ice spear, Frozen moment.
- **The deep calm** (Overflow). Rune sword, orb. Versions: Deep calm, Frozen moment.

**Kit:** unchanged. **Upgrades:** all kept. **Watch:** the weakest dealer in the prototype; its identities are sound and its numbers are the balance pass's.

### Stormcaller

**Trunk.** Everything it does is quick and spreads: each swing arcs to a second foe, lightning chains, a storm shocks everyone, and it charges itself to swing faster. The striker among the mages. Kinds: claws (Double strike), rune sword (MP regen) · Robes, Leather · totem, bell.

- **The storm** (Harvest). Rune sword, Robes. Versions: Forked arc, Supercell, Recharge.
- **The striker** (Thousand Cuts, the Hunt). Claws, Leather, bell. Versions: Static grip, Ball lightning, Overcharge.
- **The live wire** (the Toll). Struck, it strikes back. Either kind, totem, Robes. Versions: Static field, Storm shield.

**Kit:** one change. **Static charge: its basic attacks come faster for a while** (Attack speed, not Haste). Today it's "Haste on itself", the Monk's Flow word for word; this is the storm's own word and it reads the claws: more swings, more Double strike, more Arc. **Upgrades:** Arc, Chain lightning and Thunderstorm kept. Static charge: Overcharge keeps its idea on the new base (while the charge lasts, its next three abilities cost no MP); Storm shield kept.

### Geomancer

**Trunk.** Wraps itself and an ally in stone, and while its own stone holds its blows crit far more often and far harder. Defense is its spell stat; the great weapon is where its Attack comes from. Kinds: hammer (Defense), great weapon (Attack) · Plate · kite shield, trophy.

- **The landslide** (Landslide). Great weapon. Versions: Faultline, Boulder, Fissure, Rampart.
- **The quake** (Lockdown, Cold Snap). Hammer, trophy. Versions: Stunning crits, Aftershock.
- **The stone-skin** (Harvest, Phoenix as support). Hammer, kite shield. Versions: Stone skin, Rockslide.

**Kit:** unchanged. **Upgrades:** all kept. **Watch:** with the Knight's sword, the thinnest Attack read in the set: the swing, which Bedrock's doubled crits and Faultline's triple land on. Boulder is the version that could take Attack as its scaling if the read proves too thin in play.

## Who reads what

The findings' list, after this design. Every signature of every weapon and offhand kind is read by every wearer, in the base kit, a version, or the survival of a body built for it.

| Stat | Read by |
| --- | --- |
| Attack | nearly every hit and stack; the Cleric's Cure, the Paladin's Sanctuary and heals, the Vampire's Frenzy, the Hoplite's Phalanx charge, the Hexer's Culmination, the Valkyrie's Shieldmaiden, Choosing and Skyfall. The Knight and Geomancer read it in the swing, and the Knight in Crushing bash. |
| HP | Knight (Vanguard, Shield bash), Vampire (Blood drain, Blood gift), Cleric (Martyr's raise, Triage, Ward of life), Paladin (Bulwark of faith, Penance), Bramble knight (Regen, Bloodroot), Valkyrie (the Shield's cap), Hoplite and the walls' survival. |
| Defense | Geomancer (Earthen shell, Rockfall, Tremor), Bramble knight (Briar), Knight (Stone guard), Hoplite (Shieldbearer), Paladin and the walls' survival. |
| Crit chance | Assassin (Backstab, Lacerate), Geomancer (Bedrock), Ranger (Hunter's eye), Paladin (Verdict). |
| Crit damage | Assassin, Geomancer, Ranger (Hunter's eye), Bard (Refrain). |
| Double strike | Monk (Iron palm), Stormcaller (Arc), Vampire (more drinking). |
| Attack speed | the basic-attack riders: Hexer (Cold hex), Pyromancer (Kindling), Stormcaller (Arc, its own), Ranger (Hunter's eye), Bard (Refrain), Monk (Iron palm), Paladin (Zeal), Valkyrie (Shieldmaiden). |
| Cast speed | Pyromancer (Pyre, Fireball), Frostweaver (its own, Blizzard), Cleric (Raise), Paladin (Smite, Sanctuary), Geomancer (Tremor), Hoplite (Phalanx charge). |
| Cooldown | the classes that lead with abilities: Bard (its own), Valkyrie (its own), Hexer, Pyromancer, Cleric (Last rites). |
| Aggro | the walls (Knight, Bramble knight), Valkyrie (Last stand), Monk (Stillness of mind), Hoplite (the tanky bruiser the spear turns into a wall). |
| Lifesteal | Vampire (Bloodlust, Feeding frenzy), Assassin (Bleed them dry). |
| MP regen | Frostweaver, Stormcaller, Cleric, Paladin: dear spells and no free heal. |
| MP | Pyromancer, Frostweaver: the dearest spells in the set. |
| Thorns | Bramble knight; Stormcaller (Storm shield, the live wire), Knight (Hold the line). |
| Evasion | Monk (its own, Stillness of mind), Assassin, Valkyrie and Ranger (light bodies kept standing), the Stormcaller's leather. |
| Siphon | Hexer; Vampire (its blood-well versions move MP). |
| Accuracy | Ranger. Never a signature. |

## Decisions

Settled by the director across the three drafts: a class has several identities and the design serves each; Sanctuary as a Shield from Attack; Judgement on debuffed foes, with Zeal and Verdict; the Hoplite's second guard replaced by Phalanx charge, with Shield advance and Breaking charge, no Taunt in its kit; Einherjar retired and the Valkyrie rebuilt as the offensive shieldmaiden (Shieldmaiden, Gale spear, Choosing, Skyfall) on spear and sword; the Hexer's two structural adds.

Also settled: the offhand kinds by the weapon rules (thirteen kinds, two a class, the orb, trophy and cloak new), and armor left as the four weight classes.

Designer's calls, open to being overruled at the gate:
- **Hunter's eye crits more often** on basic attacks (the Ranger's crit read in the base).
- **Static charge is Attack speed, not Haste.**
- **The speed stats enter four lines:** Bard and Valkyrie Cooldown, Frostweaver Cast speed, Stormcaller Attack speed.
- **The Stormcaller wears Leather as well as Robes.**
- **Armor types unchanged.** They have five or six wearers each and the same mismatch the bell had (a Bard doesn't want Leather's Evasion); whether they get the same pass, which means more types, is the director's call.
- **The stat lines** as tabled.
- **No third kinds now;** the Bramble knight first if one is wanted.
- **Scaling fixed to the user** where a class's own content read the target: Ward of life's Shield.
- **Dawn muster** goes with Valhalla unless the director wants a third Phoenix version on Choosing.

## What the build step has to do

Not this step's work, listed so the design is honest about its cost.

- **Kinds:** the vocabulary's weapon table (twelve kinds; rod gone, fist renamed claws, axe and hammer added; rune sword and mace slow), `KIND_SPEED` for the new kinds, the classes' kinds, the gear-slots tool's tables.
- **Pieces:** eight rod pieces rehomed; sixteen axe and hammer pieces written to the kinds' profiles; twenty-four offhand pieces written for the orb, trophy and cloak, and the eighty existing offhands re-read against their kinds' new profiles and wearers (the bell's Cleric pieces, the horn's Bard pieces, the totem's Ranger and Geomancer pieces move or change); the loot stock table (twelve weapon kinds, thirteen offhand kinds); the commons-and-uncommons lean table rewritten from both profile tables. Wearer lists change on many cards, and the Shadow cloak (a leather rare) wants a new name.
- **Ward retired:** Sanctuary (above), Sigil blade and Prior's mace (new uncommon effects), the Lich's Dark ward and the Fire Giant's Kindle (Guard or Shield in its place), the Buffer's list, and every challenge whose answers name Ward.
- **Mythics touched:** Stormspear (the Valkyrie's) still fits the storm spear. The last wall (the Hoplite's) reads Aspis, which stays. Mountain's crown (the Geomancer's) shares a thread with Shieldmaiden; the loot step decides. Two offhand mythics sit in kinds their class no longer wears: Metronome (a horn, the Bard's) and Chains of light (a lantern, the Paladin's) take a kind their class wears, or none, as a mythic may. None depends on Einherjar, Rally, Valhalla or Paired guard; the Valkyrie's build parties and routes in `tools/build-parties/` and `docs/gear-design/builds.md` (Phoenix's routes, Valhalla and Rally in the border table) need rewriting.
- **Scaling from the user, on pieces:** several pieces heal or shield from the receiving ally's max HP (Rallying horn, Charnel icon, Martyr's locket, Mantle of the fallen, Vestments of return). The director's rule is for classes here; whether it reaches pieces is their call, flagged.
- **Engine:** a class line carrying a speed stat (a `SPECIAL` entry and the sheet showing it); a heal-or-revive ability (two effects, each with its own target, as Ward of life already does). Nothing else new: crit steps on basic attacks, Attack speed self-buffs, Lifesteal doubling, Shield from a hit's damage, "or" conditions and per-stack and per-debuff scaling all exist.
- **Documents at close:** `classes.md` (every changed line), `rules-and-vocabulary.md` (the weapon table, Ward, the speed stats), `loot.md` (stock, leans), `builds.md` (the Valkyrie's routes and border abilities), `philosophy.md` (slots), `rules.md` (the frame's rules, the findings' weapon rules), the code map if files split.
- **Then measure:** `npm run balance`, the build test on the routes that changed (every Stormcaller, Hoplite, Paladin, Valkyrie and Hexer route), and a feel read of a Hoplite's charge landing on a pack, a Valkyrie's Shield bar through a fight, and a Skyfall after three Gale spears.

## Checks

- **The four weapon rules hold with no exception.** Wearers a kind: 2 to 3. No two classes share more than one weapon kind (checked pair by pair; the sword's three wearers each share it alone). Every class has a one-handed kind. No class has three.
- **The offhand rules hold:** thirteen kinds of two or three wearers, two a class, no pair sharing more than one, checked by script.
- **Every signature is read by every wearer,** per *Who reads what*. The thinnest reads are the Knight's and Geomancer's Attack (the swing), the Vampire's Siphon and the Ranger's Evasion, all flagged.
- **No two classes share a base ability** once Static charge changes, and **every passive works in every fight** once Einherjar goes.
- **Every class has two or three identities,** each with a kind that leans to it and at least two versions that make it.
- **The three mages differ in kinds, armor and line:** staff and wand in robes at Attack 5; staff and rune sword in robes at Attack 3 with Cast speed; claws and rune sword in robes or leather with Attack speed.
