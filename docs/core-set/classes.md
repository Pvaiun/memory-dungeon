# Core set: classes

The 16 classes: what each one is for, and what each passive and ability does. The numbers live in `content/core-set/classes.ts`: stats, MP pools (`MP_POOL`), cooldown and wind-up words, MP costs and stack sizes; the kits' own words are in `scale.ts` (`KIT`). The rules and the words used here (target phrases, Fizzle, firing) are in *Core set: rules and vocabulary*; the challenges named in the tests are in *Core set: enemies*; each class's upgrades (a power step and two versions an ability) are in `content/core-set/upgrades/`.

## The frame

**A class has a trunk and three identities.** The trunk is its base kit, what every build of it does. Its identities are the ways a run can build it, each a way to play you can watch, and each has a payoff inside the kit (in the base or a version), a weapon kind whose signature stat leans to it, and loot that serves it. The design never picks one identity over another.

**The stack.** Kit first: the trunk and the versions. Gear kinds next: a kind's signature stat says which way a piece pushes its wearer, so a class's two weapon kinds and two offhand kinds are its directions, and its armor leans the same ways. Stat line last: a template of strengths and weaknesses that gear stretches far. Every wearer of a kind reads the kind's signature stat, in its base kit, a version, or the survival of a body built for it.

## The classes

The Knight, Cleric and Ranger are the starters: a party that clears Fundamental content but struggles with most Specialist bosses.

| Class | Role | Weapons | Offhands | Armor |
| --- | --- | --- | --- | --- |
| Knight (starter) | Protector | sword, hammer | kite shield, horn | Plate |
| Cleric (starter) | Healer | mace, staff | relic, lantern | Robes |
| Ranger (starter) | The marksman | bow, dagger | trophy, cloak | Leather |
| Bramble knight | Thorns tank | hammer, mace | totem, round shield | Plate, Mail |
| Hoplite | The bruiser | spear, great weapon | round shield, horn | Plate |
| Paladin | The judge | mace, great weapon | kite shield, relic | Mail, Plate |
| Valkyrie | The shieldmaiden | spear, sword | round shield, cloak | Mail, Leather |
| Bard | Party tempo | bow, wand | tome, bell | Leather, Robes |
| Hexer | The spellblade | wand, sword | tome, idol | Mail |
| Monk | Sunders with a blur of blows | fist weapons, spear | bell, cloak | Leather |
| Assassin | Burst killer | dagger, axe | vial, trophy | Leather |
| Vampire | Drains to outlast | fist weapons, axe | vial, idol | Mail |
| Pyromancer | The glass cannon of long casts | staff, wand | lantern, orb | Robes |
| Frostweaver | The ice wall | staff, rune sword | tome, orb | Robes, Mail |
| Stormcaller | The striker among the mages | fist weapons, rune sword | totem, bell | Robes, Leather |
| Geomancer | Hits hardest behind stone | hammer, great weapon | kite shield, trophy | Plate |

A class arrives with the plain weapon of its first kind. Every kind's swing, scaling and budget words are under Weapons in *Core set: rules and vocabulary*.

**Not in the core set for now:** the Berserker (the first to add next: Might, Lifesteal and Sunder on a great weapon), the Samurai, Dark knight, Time mage, Dancer, Alchemist and the rest of the class pool. Each can be built later from these pieces.

### Conventions

- **Stats** run from 1 to 5: 1 is very low, 3 average, 5 very high. Special stats, the three speed stats included (Attack speed, Cooldown, Cast speed), are zero unless a class lists them. No class regains MP in a fight by itself, and a class's MP pool is set by how many regular fights it lasts from full: two or three for every class, erring scarce.
- **Gear.** Each class below lists its weapon kinds (it arrives with the plain weapon of the first), its armor types and its offhand kinds; any amulet fits. The rules are under Gear in *Core set: rules and vocabulary*.
- **Timing and MP.** Every ability has a cooldown word, a wind-up word and an MP cost, all in `classes.ts`. The word follows the job: abilities that repeat (stack applicators, top-up heals) are quick, a self-buff's cooldown is longer than the buff lasts, the big nukes are long and the revives very long. Casters' spells cost several times the walls' and fighters' skills, so casters run short of MP and wear MP gear, and walls rarely do.
- **Damage and stacks.** Every ability that deals damage says what it scales from. Every ability that adds a stacking status says how many stacks (a few, several or many) and which stat sets the number. Statuses that don't stack have one fixed size.
- **Identities.** Each class lists its identities with the versions that make them (named as in `upgrades/`); a version in bold **reads** a kind's signature stat that nothing else in the kit does.
- **Tests.** Each class ends with a test: one fight against a challenge it should answer, traced through its kit.

## Starting classes

The starters cover every Fundamental challenge between them: a wall, a healer and an archer. They have no Might, Haste, Silence, Dispel or Area, so most Specialist bosses need another class.

### Knight

**Role:** protector. **Trunk:** starts behind stone, Guards the lowest, calls the fight onto itself, bashes with its own weight. Nothing in the trunk scales from Attack.

**Weapons:** sword, hammer. **Armor:** Plate. **Offhands:** kite shield, horn. **Special stats:** none. **The line:** all body, no edge: HP and Aggro at the top, Attack and Crit at the bottom.

- **Passive – Vanguard.** It starts every fight behind a Shield that scales from its max HP.
- **Fortify.** Applies Guard to the ally with the lowest share of max HP.
- **Stand fast.** Applies Taunt to itself, and Clarity to the ally with the least MP among those under half their max MP (with nobody under half, the ally with the least).
- **Shield bash.** Deals damage that scales from max HP to a random foe, and applies Stun.

**Identities.** The stone wall (hammer, kite shield): Stonewall, **Stone guard** (Defense), Crushing bash. The anchor (sword or hammer, horn): Grudge, Hold the line. The champion (sword, horn): **Valor** (Guards itself and gains several Might, from Attack: the sword has something in the kit to feed), Measured blow, Rally the well.

*Test, Tank buster:* the Knight starts behind its own Shield and Taunts as soon as Stand fast is ready, so the boss's single-target blows go to it and its Guard goes to itself as the lowest. The Cleric behind it is left alone while the Taunt holds (about two thirds of a fight), and gets Clarity when its MP runs low. Shield bash lands at a random moment, often during the long wind-up.

### Cleric

**Role:** healer. **Trunk:** mends whoever is lowest with quick, small heals, lifts a curse and wraps the ally in Regen, raises the fallen, and prays twice as fast when its own life is in danger. An active healer that spends MP: it has no free heal.

**Weapons:** mace, staff. **Armor:** Robes. **Offhands:** relic, lantern. **Special stats:** none. **The line:** frail, with average Attack, which its heals read; the mace takes a two-HP Cleric to four, and that's the point.

- **Passive – Last rites.** Below 30% of its max HP, its cooldowns are halved; healed back to 30% or more, they return to normal.
- **Renew.** Cleanses an ally with a debuff and applies Regen to it; with no ally debuffed, Regen on the ally with the lowest share of max HP.
- **Cure.** Heals the ally with the lowest share of max HP; the amount scales from Attack. A quick, small top-up. Waits until an ally is below 80% of its max HP.
- **Raise.** Revives a random knocked-out ally with half of its max HP. Waits until an ally is knocked out.

**Identities.** The mender (mace, lantern): **Triage** (heals from the Cleric's own max HP), Martyr's raise, Shared rites. The anchor's priest (mace, relic): Anchor's blessing, Ward of life (its Shield from the Cleric's max HP), Rite of passage. The font (staff, or the mace with the relic): Font, Battle prayer.

*Test, Raidwide:* every boss hit lands on all three. Cure keeps topping up whoever is lowest and Renew's Regen ticks on one ally at a time, both paid in MP, so a long fight can run it dry. Under Anti-heal, Rot cuts both, so there the Cleric is the wrong pick.

### Ranger

**Role:** the marksman. **Trunk:** arrows that bleed, chill and sunder whatever stands in front; plain arrows past any guard that crit for a living.

**Weapons:** bow, dagger. **Armor:** Leather. **Offhands:** trophy, cloak. **Special stats:** Accuracy medium, Evasion medium. **The line:** Attack and Crit high, a light body that slips aside rather than takes the blow.

- **Passive – Hunter's eye.** Its basic attacks ignore Taunt (they go to a random foe, Taunting or not) and crit more often (`KIT.hunterCrit` steps).
- **Barbed arrow.** Deals light damage that scales from Attack to a random foe, and adds several Bleed; stacks scale from Attack.
- **Frost arrow.** Deals light damage that scales from Attack to the foe with the most Chill, and adds a few Chill; stacks scale from Attack. A second source of Chill, so the Frostweaver and the Hexer reach a shatter sooner.
- **Rending arrow.** Deals damage that scales from Attack to the foe with the most Sunder, and adds a few Sunder; stacks scale from Attack.

**Identities.** The marksman (dagger, trophy): Quarry, Gutting arrow. The skirmisher (dagger, cloak): **Quick draw** (each crit makes its next basic attack come at once), Barbed volley (a light arrow at every foe, each adding a few Bleed). The trapper (bow): Pinning arrow, Hail (a quick arrow, and a few Chill on every foe), Armor breaker, Deep barbs.

*Test, Shield wall:* its arrows have no Seek, so they go to the Taunting, Guarded foe, which gets Bleed, Chill and Sunder, and the Sunder raises the damage it takes, offsetting some of its Guard. Its basic attacks ignore Taunt and land, often critting, on the fragile dealers behind. Against a lone boss, everything stacks on one target.

## Defenders and support

Six classes that win through the party: a tank that punishes, a bruiser that helps, a judge, a shieldmaiden, a tempo-setter and a spellblade.

### Bramble knight

**Role:** thorns tank. **Trunk:** draws every foe onto its thorns, where each attacker is left bleeding for the party's blows, regrows whoever is lowest, and lashes out with the thorns themselves.

**Weapons:** hammer, mace. **Armor:** Plate, Mail. **Offhands:** totem, round shield. **Special stats:** Thorns high. **The line:** the thorn wall: HP and Aggro at the top, Attack and Crit at the bottom.

- **Passive – Briar.** Each time its Thorns damage a foe, that foe gets a few Bleed; stacks scale from Defense.
- **Thicket.** Applies Taunt and Guard to itself.
- **Regrowth.** Applies Regen to the ally with the lowest share of max HP.
- **Bramble lash.** Deals damage that scales from Thorns to a random foe.

**Identities.** The anchor (hammer, Plate, totem): **Bloodroot** (HP), Overgrowth, Deep roots, Rebuke. The field of thorns (either kind, totem): Spreading thorns, Whipping vines. The grove-keeper (mace, round shield, Mail): Grove, Blossom. Its two kinds are both slow one-handers; the hammer's heavy blow against the mace's stats is the choice.

*Test, Swarm:* Thicket pulls all eight foes onto the knight. Each basic attack costs its attacker Thorns and leaves it bleeding for the party's next hits, Thicket's Guard blunts the many small hits, and Regrowth mends the knight. Against a Brute it does worse: one big swing triggers Thorns once.

### Hoplite

**Role:** the bruiser. **Trunk:** slow double swings, a thrust that opens one foe up, a shove with the whole shield that sunders every foe, and an Aegis on the ally about to take the killing blow. Very tanky, big hits, team support; nothing it does draws fire, which is its weakness. The spear and the horn are where a run buys it the draw.

**Weapons:** spear, great weapon. **Armor:** Plate. **Offhands:** round shield, horn. **Special stats:** none. **The line:** Attack and Defense at the top, average Aggro.

- **Passive – Phalanx.** Its basic attacks come half as often and deal double damage.
- **Aspis.** Applies Aegis to the ally with the lowest share of max HP.
- **Othismos.** The shove: deals damage that scales from Defense to every foe, and adds a few Sunder to each; stacks scale from Defense. A medium cooldown and a long wind-up.
- **Spear thrust.** Deals damage that scales from Attack to a random foe, and adds a few Sunder; stacks scale from Attack.

**Identities.** The bruiser (great weapon, Plate): Opening thrust, **Shieldbearer** (Defense), Breach (the shove on one foe, the most Defense, for triple), Skewer. The phalanx (spear, round shield): Locked shields (the shove, and the Hoplite and the lowest ally are Guarded), Shield wall. The bodyguard (spear, round shield): Watch the anchor, Disarm (the thrust at the foe with the highest Attack, which is Weakened; no Sunder). No Taunt anywhere in the kit.

*Test, Tank buster:* the huge swing lands on whoever the boss picked. Aspis puts Aegis on the lowest ally, which isn't always the target; when it is, the blow is blocked outright. Paired with the Knight it's reliable: the boss hits the Knight, the Knight becomes the lowest, and the Knight holds the Aegis. Between swings, its slow, double-damage basic attacks get through Defense that stops smaller hits, and Othismos and Spear thrust leave the boss taking more from every hit.

### Paladin

**Role:** the judge, helper of the righteous and killer of the wicked. **Trunk:** its hits land half again as hard on any foe that holds a buff or a debuff; it condemns one foe and the whole party strikes it; it lifts curses and heals; and it brings down a slow, heavy, burning Smite.

**Weapons:** mace, great weapon. **Armor:** Mail, Plate. **Offhands:** kite shield, relic. **Special stats:** none. **The line:** a strong body, little finesse.

- **Passive – Judgement.** Its hits deal half again as much damage to foes with a buff or a debuff (a foe holding both isn't doubled).
- **Condemn.** Marks the foe with the highest Attack, and every ally's next basic attack comes at once. Marked is a debuff, so Condemn turns Judgement on, and the party's volley lands on the judged. A medium cooldown.
- **Absolve.** Cleanses and heals itself and the other ally with the lowest share of max HP; the heal scales from Attack. Waits until an ally is below max HP.
- **Smite.** Deals heavy damage that scales from Attack to the foe with the highest Attack, and adds several Burn; stacks scale from Attack. A long wind-up.

**Identities.** The judge (great weapon, Mail): Swift justice (Marks the foe with the lowest share of max HP, then the volley; a foe that falls holding the Mark makes Condemn ready again), **Verdict** (its crit chance is tripled against a judged foe: Crit chance), Hammer of dawn, Pyre of judgement. The healer (mace, relic): Absolution, **Penance** (HP). The champion of the line (mace, kite shield, Plate): Challenge (Marks the foe with the highest Attack and the Paladin Taunts; no volley), Zeal (its basic attacks add a few Burn to a judged foe), Penance.

*Test, Buffer:* the Fire Imp's Cheer buffs its strongest ally, and every hit on it lands half again as hard; Condemn Marks the most dangerous foe and the party's swings pile onto it. Against a Nuker, Smite's long wind-up is its weakness: a fast fight may end before it lands.

### Valkyrie

**Role:** the shieldmaiden: a quick, survivable damage dealer, not a tank. **Trunk:** her spear builds her Shield as it strikes; three quick hits reach past any guard and shock what they hit; a heavy blow from above cashes the Shock in; and she chooses the slain: one ability mends the lowest ally or raises a fallen one.

**Weapons:** spear, sword. **Armor:** Mail, Leather. **Offhands:** round shield, cloak. **Special stats:** Cooldown medium. **The line:** Attack high, Crit above average, Aggro low: she draws little, and her Cooldown is her "relatively fast".

- **Passive – Shieldmaiden.** Each hit she lands gives her a Shield of a share of the damage dealt (`KIT.shieldmaiden`). Survivable by attacking: her Shield bar grows as she fights and is spent as she's hit, and it soaks a status's damage too. It reads Attack (bigger hits, bigger Shield) and max HP (the Shield's cap).
- **Gale spear.** Has Seek. Three quick hits on a random foe that isn't Taunting; each deals damage that scales from Attack and adds a few Shock, with stacks that scale from Attack.
- **Choosing.** Chooses one ally: a fallen one first, raised with a tenth of its HP; else the ally with the lowest share of max HP, healed for an amount that scales from Attack (`KIT.choosing`, under the Cleric's Cure). One target, one outcome a cast. Waits until an ally is below 80% of its max HP or down. A medium cooldown: slightly worse at healing than a healer, and it revives.
- **Skyfall.** A heavy blow from above on the foe with the most Shock; the damage scales from Attack and rises with each Shock stack on that foe (`KIT.skyfallPerShock`). The Shock stays. Gale spear stacks the Shock, Skyfall cashes it: the storm spear's beat.

**Identities.** The storm spear (spear, Leather, cloak): Spear of the hunt, Valkyrie's descent (Skyfall past any guard on the lowest foe, double below a quarter), Chooser of the slain (no Shield; a fifth more to foes below half). The shield-sister (sword, Mail, round shield): Shield-sister (the Shield goes to the lowest ally), **Over the fallen** (waits until an ally is below 30% or down, heals for double or raises, and the Valkyrie Taunts and is Guarded: Aggro), Gale storm. The thunderhead (spear): Gale storm, Thunderclap (Skyfall on every shocked foe, half as hard). The reviver is a build a run can go for, not the class: Einherjar (an ally Choosing raises comes back with every action ready) and Over the fallen.

*Test, Executioner:* Doom knocks out the Ranger. Choosing brings it back at once with a tenth of its HP, and keeps the rest of the party topped up between its spears. With no Cleanse or Aegis beside her, Doom lands every time: the Valkyrie undoes it rather than stopping it. Her own Shield, built from every spear, is what keeps her standing through the fight.

### Bard

**Role:** party tempo. **Trunk:** every note mends an ally a little and gives another mana; a ballad steadies the party, an allegro quickens it, and an encore makes an ally's next spell sound twice. Pure support: it deals no damage of its own beyond its swings.

**Weapons:** bow, wand. **Armor:** Leather, Robes. **Offhands:** tome, bell. **Special stats:** Cooldown medium. **The line:** average everything, Aggro at the bottom; its Cooldown is its tempo.

- **Passive – Refrain.** Each of its basic attacks that lands heals a random ally and gives a random ally MP, each a share of the damage the attack dealt. So its weapon is a choice: the bow's heavy swing is Refrain's hit size, and the wand's stats are the songs'.
- **War ballad.** Adds a few Might to every ally; stacks scale from Attack.
- **Allegro.** Applies Haste to every ally.
- **Encore.** The other ally with the highest Attack casts its next ability twice; the second cast is free. A medium cooldown.

**Identities.** The conductor (wand, tome, Robes): Rubato (Haste on every ally, and each ally's ability nearest to ready is ready at once), Rousing chorus (all its Might, three times as many, on the ally with the slowest basic attack), Reprise (in place of the repeat, that ally's ability with the longest cooldown left is ready at once). The troubadour (wand, tome): Harmony, Lament, Reprise. The skald (bow, or the wand with the bell; Leather): Battle song, Accelerando, Cadenza (no Encore for an ally: the Bard's own next three basic attacks come at once).

*Test, Curser:* the Curser Weakens and Slows the party. War ballad's Might, every few ticks on every ally, and Allegro's Haste outweigh both, and Refrain mends the chip damage. It lifts neither debuff, so a Cleric's Renew still helps. Encore makes the party's best spell land twice.

### Hexer

**Role:** the spellblade. **Trunk:** a blade that carries curses: its swing chills, its curses deepen every affliction a foe already holds, it weakens and sunders the most dangerous one, and it silences a foe mid-cast and strips what it holds.

**Weapons:** wand, sword. **Armor:** Mail. **Offhands:** tome, idol. **Special stats:** Siphon medium. **The line:** Attack high, a spellblade's body (HP and Defense average), Aggro at the bottom.

- **Passive – Cold hex.** Its basic attacks add a few Chill, whatever weapon it carries; stacks scale from Attack.
- **Malison.** Curses every foe: a light hit from Attack, a fifth more for each different affliction the foe holds (Burn, Chill, Shock, Bleed, Sunder), then a few Bleed. The Hexer pays for breadth where the mages are the sources: a mixed party is what makes it big, and the hit and the Bleed mean it does something alone.
- **Unmake.** Applies Silence to the casting foe with the highest Attack and strips its buffs. Waits until a foe is in a wind-up; a buff alone doesn't draw it.
- **Enfeeble.** Applies Weaken and adds a few Sunder to the foe with the highest Attack; stacks scale from Attack.

**Identities.** The spellbreaker (sword, idol): Silence all, Mana burn (Silences the casting foe and drains a fifth of its MP, which the Hexer gains), Focused curse. The curser (sword, Mail): Wither, Withering hex (its basic attacks Weaken in place of Chill), Culmination. The elemental blade (wand, tome): Hex of flames, Plague (a lighter curse on every foe, then a few Burn, Shock and Bleed), Focused curse (three times the curse and the Bleed, on the foe with the highest Attack alone).

*Test, Buffer:* Unmake waits for the Buffer's wind-up, silences it and strips what it has already given. Malison's curse grows with every affliction the party has laid on the Buffer's allies. Enfeeble's Weaken and Sunder go to the foe with the highest Attack, which may be the Buffer's guard rather than the Buffer.

## Fighters

Three damage dealers, each beating Defense its own way: the Monk with Sunder, the Assassin with crits, the Vampire by outlasting it.

### Monk

**Role:** sunders with a blur of blows. **Trunk:** every blow leaves the foe a little more open, Flow keeps it fast, burning fists pile onto the hottest foe, and a pressure point drops the most dangerous one for a moment.

**Weapons:** fist weapons, spear. **Armor:** Leather. **Offhands:** bell, cloak. **Special stats:** Evasion high, Double strike medium. **The line:** Attack high, Defense at the bottom: it dodges, it doesn't absorb.

- **Passive – Iron palm.** Its basic attacks, and the second strike of its Double strike, add a few Sunder; stacks scale from Attack.
- **Flow.** Applies Haste to itself.
- **Burning fist.** Three quick hits on the foe with the most Burn; each deals damage that scales from Attack and adds a few Burn at three fifths of the word, so the Monk feeds a Pyromancer's fire rather than out-burning it; stacks scale from Attack.
- **Pressure point.** Has Seek. Deals damage that scales from Attack to the foe with the highest Attack, and applies Stun.

**Identities.** The blur (fist weapons, bell): Hundred hands, Flow state, Fanned flames. The dancer (spear, cloak, Leather): **Stillness of mind** (Taunts and raises its Evasion: Aggro), Drinking palm. The point-striker (spear): Lingering point, Vital strike, Frost fist.

*Test, Armored shell:* its first double strikes barely scratch the shell, but each adds Sunder, so every hit after lands harder, and Flow speeds them up. Every strike chips Bulwark too.

### Assassin

**Role:** burst killer. **Trunk:** slips out of sight, picks off the weakest foe past any guard, leaves every crit a bleeding wound, and silences the back line.

**Weapons:** dagger, axe. **Armor:** Leather. **Offhands:** vial, trophy. **Special stats:** Crit damage high, Evasion medium. **The line:** the glass dagger: Attack and Crit at the top, HP and Defense at the bottom.

- **Passive – Lacerate.** Each of its crits adds several Bleed to the foe; stacks scale from Attack.
- **Vanish.** Applies Hidden to itself. Waits until it isn't Hidden.
- **Backstab.** Has Seek. Deals heavy damage that scales from Crit chance to the foe with the lowest current HP.
- **Garrote.** Has Seek. Deals damage that scales from Attack to a random foe that isn't Taunting, and applies Silence.

**Identities.** The ambusher (dagger, trophy): Opening wound, Shadow step, From the shadows. The hunter (dagger or axe): Rupture (its crits deal extra damage for each Bleed the foe holds, and the Bleed stays), Coup de grâce, Smoke screen. The drinker (axe, vial): **Bleed them dry** (Seek, Rot and many Bleed on a random foe that isn't Taunting, and the Assassin's Lifesteal is doubled for a while; no Silence: Lifesteal), Choke.

*Test, Stalker:* the Stalker hunts the lowest-HP unit, usually the Assassin. Once Vanish is up, the Assassin is out of reach, and its crits leave Bleed for the party's hits to open. Until then it's exposed, so it wants a Shield or an Area ally beside it.

### Vampire

**Role:** drains to outlast. **Trunk:** feeds on everything it hits: the harder it hits, the more it heals, its prey is left weakened, and it bleeds its own life into an ally's wounds and mana. An exotic class, at the director's word. Its identity is healing back from the brink, not sustain all fight.

**Weapons:** fist weapons, axe. **Armor:** Mail. **Offhands:** vial, idol. **Special stats:** Lifesteal medium. **The line:** body as fuel: HP above average, Attack high.

- **Passive – Bloodlust.** While it's below half of its max HP, its Lifesteal is doubled.
- **Blood drain.** Deals damage that scales from max HP to a random foe, and applies Weaken. The one MP cost off the ladder: very cheap.
- **Blood gift.** Spends a fifth of its max HP to heal the other ally with the lowest share of max HP for as much, and gives it Clarity. Waits until another ally is below 80% of its max HP and the Vampire itself is at 35% of its max HP or more, so the price never kills it.
- **Frenzy.** Adds several Might to itself; stacks scale from Attack.

**Identities.** The drinker (fist weapons for more hits, the axe for the drinking): Shared feast, Undying thirst, Feeding frenzy. The blood-well (idol): Drain the well, Blood for mana, Lifeblood. The frenzy (fist weapons, vial): Savage drain (three quick hits from max HP, a third each, each drinking; the foe is Weakened), Bloodthirst (while it holds Might, its basic attacks come a third faster), Feeding frenzy.

*Test, Regenerator:* the Vampire out-heals the boss by hitting it. Blood drain's share of max HP and every basic attack feed its Lifesteal, Frenzy raises both, and Blood gift turns the surplus into an ally's HP and mana. Against Anti-heal it falters: Rot cuts its own Lifesteal, and Blood gift's price is still paid.

## Mages

Four mages, and they share no template: fire is the long cast, ice the wall that shatters, lightning the striker, earth the crit behind stone. The elements are themes, not damage. Burn, Chill and Shock each have a source outside their mage, so the mage is the strongest source, not the only one.

### Pyromancer

**Role:** the glass cannon of long casts. **Trunk:** every spell it casts stokes the fire on the hottest foe, bolts pile more onto it, a fireball spreads it, and a pyre lands. Cast speed is its stat, in its line and on its staff, so the long casts land.

**Weapons:** staff, wand. **Armor:** Robes. **Offhands:** lantern, orb. **Special stats:** Cast speed medium. **The line:** Attack at the top, HP and Defense at the bottom.

- **Passive – Stoke.** Each ability it casts adds a few Burn to the foe with the most Burn; stacks scale from Attack. The caster: its swings carry no fire unless a version says so.
- **Firebolt.** Deals damage that scales from Attack to the foe with the most Burn, and adds several Burn; stacks scale from Attack.
- **Fireball.** Deals damage that scales from Attack to every foe, and adds a few Burn to each; stacks scale from Attack.
- **Pyre.** Deals heavy damage to the foe with the most Burn; the damage scales from Attack and rises with each Burn stack on that foe. The Burn stays. With Fireball, its dearest ability.

**Identities.** The ritualist (staff, lantern): Slow burn, Conflagration (many Burn on each foe, with a very long wind-up: Cast speed pays), High pyre (waits for a foe holding a deep fire, then a heavy blow that cashes each stack). The kindler (wand, orb): Kindling (its basic attacks add a few Burn, in place of its casts), Flash bolt, Flashfire. The conflagration (staff or wand, orb): Wildfire (each cast adds Burn to every burning foe, half as much each), Funeral pyre.

*Test, Two states:* in both phases its hits do little, against very high Defense or Incorporeal, but Burn, untyped, still lands and ticks in full. With a Monk or Hexer adding Burn too, it stays high through both phases.

### Frostweaver

**Role:** the ice wall: a chunky supporting mage, and the Chill applier. **Trunk:** it lays Chill on the field and on the most-chilled foe until the Chill itself shatters, leaves the shattered foe sundered for the party, and keeps an ally's mana flowing while the frost builds. Nothing in its kit triggers a shatter and nothing applies Slow: Chill is its slow, and Chill detonates itself at its cap. Shattering reliably is a matter of stacks (`LANCE_CHILL`, `BLIZZARD_CHILL`, `STILLNESS_CHILL` against `STATUS.chill`).

**Weapons:** staff, rune sword. **Armor:** Robes, Mail. **Offhands:** tome, orb. **Special stats:** none. **The line:** HP and Defense average, Attack average: its power is in the field's Chill and the shelter it gives, and its body is its stat.

- **Passive – Shatterpoint.** When a foe's Chill shatters, that foe takes several Sunder; stacks scale from Attack.
- **Frost lance.** Deals damage that scales from Attack to the foe with the most Chill, and adds several Chill; stacks scale from Attack.
- **Blizzard.** Deals damage that scales from Attack to every foe, and adds a few Chill to each; stacks scale from Attack.
- **Stillness.** Applies Clarity to the ally with the least MP among those under half their max MP (with nobody under half, the ally with the least), and adds a few Chill to every foe; stacks scale from Attack.

**Identities.** The ice wall (rune sword, Mail, orb): **Rime shield** (when a foe shatters, the lowest ally gains a Shield from the Frostweaver's max HP, in place of the Sunder: HP), Frost armor (Guards every ally; while the Guard lasts, a foe that hits one gains a few Chill), Deep calm. The disabler (rune sword, tome): Ice spear (past any guard at the foe with the highest Attack, several Chill), Frozen moment. The shatter killer (staff): Splinters (a shatter passes a third of its cold to every other foe), Icicles, Avalanche.

*Test, Skirmisher:* Blizzard, Frost lance and Stillness build Chill on the fast foes, slowing them, until it shatters for damage and a Stun, and Shatterpoint leaves the foe sundered for the party. Its own basic attacks add no Chill, but Chill thaws slowly, so it builds between casts. With a Hexer or Ranger adding Chill too, the shatters come sooner.

### Stormcaller

**Role:** the striker among the mages. **Trunk:** everything it does is quick and spreads: each swing arcs to a second foe, lightning chains, a storm puts Shock on every ally's swings, and it charges itself to swing faster.

**Weapons:** fist weapons, rune sword. **Armor:** Robes, Leather. **Offhands:** totem, bell. **Special stats:** Attack speed medium. **The line:** Attack high, HP and Defense at the bottom: it swings often and takes hits badly.

- **Passive – Arc.** Each of its basic attacks also hits a second, random foe, and adds a few Shock to both; stacks scale from Attack.
- **Chain lightning.** Deals damage that scales from Attack to a random foe, then to up to three other random foes, and adds a few Shock to each; stacks scale from Attack.
- **Thunderstorm.** For a while (`KIT.storm`), every ally's basic attacks add a few Shock; stacks scale from the Stormcaller's Attack. The party's storm, not a nuke.
- **Static charge.** Its basic attacks come faster for a while (`KIT.staticCharge`): Attack speed, not Haste.

**Identities.** The tempest (rune sword, Robes): Forked arc, Recharge, Overcharge (while the charge lasts, its next three abilities cost no MP). The storm fist (fist weapons, Leather, bell): Static grip, Ball lightning, Storm's eye (the party's swings' Shock goes to the foe with the most Shock, three times as much). The lightning rod (either kind, totem): Static field (every foe that hits an ally gains a few Shock while the storm lasts), Storm shield.

*Test, Swarm:* Arc and Chain lightning Shock all eight foes, Thunderstorm puts Shock on every ally's swings too, and every time a foe acts, Shock hurts it. Against a lone Nuker it's weak: one slow caster barely sets off Shock, and Arc has no second foe.

### Geomancer

**Role:** hits hardest behind stone. **Trunk:** wraps itself and an ally in stone; while its own Shield holds, its rocks crit far more often and far harder, and a tremor drops a foe now and then. Defense is its spell stat; the great weapon is where its Attack comes from.

**Weapons:** hammer, great weapon. **Armor:** Plate. **Offhands:** kite shield, trophy. **Special stats:** Crit damage high. **The line:** Defense at the top, Crit high, Attack average.

- **Passive – Bedrock.** While its Shield pool is above zero, its crit chance is doubled.
- **Earthen shell.** Applies Shield to itself and to the other ally with the lowest share of max HP; the amount scales from Defense.
- **Rockfall.** Deals heavy damage that scales from Defense to a random foe, on a medium cooldown: big, rarer rocks.
- **Tremor.** Deals damage that scales from Defense to a random foe, and applies Stun.

**Identities.** The landslide (great weapon): Faultline, Boulder, Fissure, Rampart. The quake (hammer, trophy): Stunning crits, Aftershock. The stone warden (hammer, kite shield): Stone skin, Rock shelter (the ally with the lowest share of HP gains a Shield as large as the damage Rockfall dealt).

*Test, Hit counter:* the boss strikes back every few hits it takes. The Geomancer lands few hits, but while its Shield holds they crit often and hard, so the counter rarely fires. A Shield breaks once hits use up its pool, so the Geomancer crits most while a Knight keeps foes off it. Area damage or a Stalker turns its crits off.

## Parties of 3

Different trios win different fights, and Burn, Chill and Shock each have more than one party built on them. Every class is in at least one winning trio and has fights where it's the wrong pick. These challenges are a sample picked to show how parties differ, not a choice of which challenges the set keeps.

| Challenge | A party that beats it | Why it works | Wrong pick here |
| --- | --- | --- | --- |
| Swarm | Bramble knight, Stormcaller, Valkyrie | Thicket pulls all eight onto Thorns and Bleed; Arc, Chain lightning, Thunderstorm and Gale spear Shock them | Assassin, Hexer: single-target |
| Skirmisher | Hexer, Frostweaver, Knight | Cold hex, Frost lance and Stillness keep Chill high until it shatters; Fortify's Guard blunts the many small hits | Pyromancer: long wind-ups against fast foes |
| Tank buster | Knight, Hoplite, Pyromancer | Aggro keeps the boss on the Knight, who becomes the lowest and so gets Aspis's Aegis; Guard and Shield soften what gets through; Burn ramps safely | Bramble knight: one big swing triggers Thorns once |
| Stalker | Geomancer, Assassin, Stormcaller | Chain lightning reaches the Hidden Stalker; Vanish hides its usual prey; Earthen shell covers the lowest | Ranger: its arrows can't pick a Hidden foe |
| Summoner | Valkyrie, Ranger, Frostweaver | Gale spear skips the Taunting adds to strike the summoner; the Ranger's basic attacks ignore Taunt; Blizzard thins the adds | Knight: nothing it does gets past the Taunting adds |
| Buffer | Hexer, Paladin, Knight | Unmake silences the Buffer mid-cast and strips its buffs; Judgement lands half again as hard on whatever is still buffed; Shield bash Stuns | Stormcaller: spreads damage instead of stopping the Buffer |
| Hit counter (boss) | Geomancer, Knight, Ranger | Shielded, the Geomancer lands few hits that crit hard; Earthen shell keeps it shielded | Monk, Stormcaller: many small hits set off the counter |
| Damage race (boss) | Bard, Monk, Pyromancer | War ballad's Might, Haste from Allegro and Flow, and Encore on the Pyromancer's casts; Burn comes from two sources | Hoplite: protects, but can't win a race |
| Two states (boss) | Pyromancer, Ranger, Monk | Burn from two sources ticks through both phases; Sunder opens the Defense phase, and the Ranger's Bleed adds damage past both | Parties that only hit, without Burn or Bleed |
| Long grind (run) | Cleric, Vampire, Frostweaver | Cure and Renew heal steadily, Raise fixes knockouts, Lifesteal keeps the Vampire full, Stillness refills MP | Pyromancer: burns MP the run can't refill |
| Executioner (boss) | Paladin, Hoplite, Valkyrie | Absolve can lift Doom, Aspis's Aegis may soak it, and Choosing returns the victim | Bard, Hexer: nothing for Doom |
| Anti-heal (boss) | Paladin, Geomancer, Knight | Absolve lifts Rot; Shields and Guard stop damage instead of healing it | Cleric, Vampire, Bramble knight: their healing is Rotted |

## How the kits fit together

Every piece of the vocabulary is used by a class or an enemy (`classes.ts`, `enemies.ts`), except that Slow and Rot appear only on enemies and the pieces. In the kits, Aegis is the Hoplite's and Marked the Paladin's; neither is locked to them, and the Hunt's pieces apply Marked too.

- **No two classes share a base ability, and every passive works in every fight.**
- **Built-up statuses on basic attacks.** Each has a basic-attack source: Chill (Hexer), Shock (Stormcaller, and the party under its Thunderstorm) and Sunder (Monk). Burn is stoked by the Pyromancer's casts, and its Kindling version puts it back on swings.
- **Effects that reach every ally:** Thunderstorm, War ballad, Allegro and Frost armor. Othismos, Malison, Blizzard and Stillness reach every foe; Condemn brings every ally's swing onto one foe.
- **Scaling from a stat other than Attack,** the obvious target for gear: Shield bash (max HP), Bramble lash (Thorns), Othismos (Defense, its Sunder too), Backstab (Crit chance), Blood drain and Blood gift (max HP), Rockfall and Tremor (Defense), the Shield amounts of Vanguard (max HP), Earthen shell (Defense) and Shieldmaiden (the damage dealt), and the versions Triage, Ward of life and Rime shield (max HP).
- **Who reads what.** Every signature stat of every weapon and offhand kind is read by every wearer: Attack by nearly every hit and stack; HP by the Knight, Vampire, Cleric, Paladin, Bramble knight, Valkyrie, Frostweaver and the walls' survival; Defense by the Geomancer, Bramble knight, Hoplite, Knight and the walls; Crit chance by the Assassin, Geomancer, Ranger and Paladin; Crit damage by the Assassin, Geomancer, Ranger and Bard; Double strike by the Monk, Stormcaller and Vampire; Attack speed by the basic-attack riders (Hexer, Stormcaller, Ranger, Bard, Monk, Paladin, Valkyrie, Vampire, Pyromancer's Kindling); Cast speed by the Pyromancer, Frostweaver, Cleric, Paladin, Geomancer and Hoplite; Cooldown by the Bard, Valkyrie, Hexer, Pyromancer and Cleric; Aggro by the walls, the Valkyrie, Monk and Hoplite; Lifesteal by the Vampire and Assassin; MP regen by the Frostweaver, Stormcaller, Cleric and Paladin; MP by the Pyromancer and Frostweaver; Thorns by the Bramble knight, Stormcaller and Knight; Evasion by the Monk, Assassin, Valkyrie, Ranger and the Stormcaller's leather; Siphon by the Hexer and Vampire. The thinnest reads are the Knight's and Geomancer's Attack (the swing), the Vampire's Siphon and the Ranger's Evasion.
- **Answers to defences.** Sunder (Monk, Ranger, Hoplite) raises the damage a foe takes from every hit, Crit damage (Assassin, Ranger, Geomancer) beats high Defense, Accuracy (Ranger) beats high Evasion, and a status's own damage meets neither Defense nor Evasion.

## To watch in simulation

- **Stun.** A long-cooldown Stun with no timing condition may rarely catch a wind-up. The fallback is a shorter Stun on a shorter cooldown (`STUN_COOLDOWN`).
- **Pyre** may fire on a foe with very little Burn.
- **Unmake** waits for a cast, so a buff laid without a wind-up stands until the next one; check how often a buffed foe never casts again. On the balance sheet it fizzles 14% of its casts for want of a target: the foe's wind-up ends before Unmake's own quick one does.
- **Stand fast.** The Knight's Taunt lasts less than its cooldown, so check it holds bosses on Aggro alone in the gaps.
- **Aspis** goes to the lowest ally, who isn't always the one about to take the big hit. Check how often Aegis catches anything without a Knight drawing the boss.
- **Bedrock** depends on how long the Geomancer's Shield lasts. Check its crit uptime with and without a protector beside it.
- **Choosing** is a revive on a medium cooldown where the documents give revives the very long word; it brings a tenth, and a playtest may lengthen it. With an ally down and another hurt it raises, and the hurt one waits for the next cast.
- **The Frostweaver's shatters:** a Frostweaver working alone on one foe should shatter it within a few casts, and more than once in a regular fight. Its Chill counts are the balance pass's first job.
- **Cadenza** is esoteric, and worth trying by the director's word.
