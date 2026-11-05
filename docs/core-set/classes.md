# Core set: classes

The 16 classes: what each one is for, and what each passive and ability does. The numbers live in `content/core-set/classes.ts`: stats, MP pools (`MP_POOL`), cooldown and wind-up words, MP costs and stack sizes. The rules and the words used here (target phrases, Fizzle, firing) are in *Core set: rules and vocabulary*; the challenges named in the tests are in *Core set: enemies*.

## The classes

The Knight, Cleric and Ranger are the starters: a party that clears Fundamental content but struggles with most Specialist bosses.

| Class | Role | Weapons |
| --- | --- | --- |
| Knight (starter) | Protector | Striking |
| Cleric (starter) | Healer | Focus |
| Ranger (starter) | Wears down tough targets | Striking |
| Bramble knight | Thorns tank | Both |
| Hoplite | Bodyguard who opens foes up | Striking |
| Paladin | Shelter | Focus |
| Valkyrie | Storm spear who heals and revives | Both |
| Bard | Party tempo | Both |
| Hexer | Curser | Both |
| Monk | Sunders with a blur of blows | Striking |
| Assassin | Burst killer | Striking |
| Vampire | Drains to outlast | Striking |
| Pyromancer | Ramping Burn | Focus |
| Frostweaver | Freezes and shatters | Focus |
| Stormcaller | Shocks every foe | Focus |
| Geomancer | Hits hardest behind stone | Both |

A striking weapon swings harder; a focus weapon swings lighter and carries Attack (`FOCUS`), which makes everything that scales from Attack bigger: abilities, heals and stacks.

**Not in the core set for now:** the Berserker (the first to add next: Might, Lifesteal and Sunder on a great weapon), the Samurai, Spellblade (the Hexer's new theme), Dark knight, Time mage, Dancer, Alchemist and the rest of the class pool. Each can be built later from these pieces. If 16 proves too many to test, the Hoplite is the first to cut, and Aegis would wait for a later class or a boss.

### Conventions

- **Stats** run from 1 to 5: 1 is very low, 3 average, 5 very high. Special stats are zero unless a class lists them. No class regains MP in a fight by itself, and a class's MP pool is set by how many regular fights it lasts from full: two or three for every class, erring scarce.
- **Gear.** Each class below lists its weapon kinds (it arrives with the plain weapon of the first), its armor types and its offhand kinds; any amulet fits. The rules are under Gear in *Core set: rules and vocabulary*.
- **Timing and MP.** Every ability has a cooldown word, a wind-up word and an MP cost, all in `classes.ts`. The word follows the job: abilities that repeat (stack applicators, top-up heals) are quick, a self-buff's cooldown is longer than the buff lasts, the big nukes are long and the revives very long. Casters' spells cost several times the walls' and fighters' skills, so casters run short of MP and wear MP gear, and walls rarely do.
- **Damage and stacks.** Every ability that deals damage says what it scales from. Every ability that adds a stacking status says how many stacks (a few, several or many) and which stat sets the number. Statuses that don't stack have one fixed size.
- **Tests.** Each class ends with a test: one fight against a challenge it should answer, traced through its kit.

## Starting classes

The starters cover every Fundamental challenge between them: a wall, a healer and an archer. They have no Might, Haste, Silence, Dispel or Area, so most Specialist bosses need another class.

### Knight

**Role:** protector. **Plan:** starts every fight behind its own Shield, Guards whoever is lowest, calls every foe onto itself while an ally regains its mana, and bashes a foe with the weight of its own body.

**Weapons:** sword, great weapon. **Armor:** Plate. **Offhands:** kite shield, horn. **Special stats:** none.

- **Passive – Vanguard.** It starts every fight behind a Shield that scales from its max HP.
- **Fortify.** Applies Guard to the ally with the lowest share of max HP.
- **Stand fast.** Applies Taunt to itself, and Clarity to the ally with the least MP among those under half their max MP (with nobody under half, the ally with the least).
- **Shield bash.** Deals damage that scales from max HP to a random foe, and applies Stun.

*Test, Tank buster:* the Knight starts behind its own Shield and Taunts as soon as Stand fast is ready, so the boss's single-target blows go to it and its Guard goes to itself as the lowest. The Cleric behind it is left alone while the Taunt holds (about two thirds of a fight), and gets Clarity when its MP runs low. Shield bash lands at a random moment, often during the long wind-up.

### Cleric

**Role:** healer. **Plan:** mends whoever is lowest with quick, small heals, lifts a curse and wraps the ally in Regen, raises the fallen, and prays twice as fast when its own life is in danger. An active healer that spends MP: it has no free heal.

**Weapons:** mace, staff. **Armor:** Robes. **Offhands:** relic, bell. **Special stats:** none.

- **Passive – Last rites.** Below 30% of its max HP, its cooldowns are halved; healed back to 30% or more, they return to normal.
- **Renew.** Cleanses an ally with a debuff and applies Regen to it; with no ally debuffed, Regen on the ally with the lowest share of max HP.
- **Cure.** Heals the ally with the lowest share of max HP; the amount scales from Attack. A quick, small top-up. Waits until an ally is below 80% of its max HP.
- **Raise.** Revives a random knocked-out ally with half of its max HP. Waits until an ally is knocked out.

*Test, Raidwide:* every boss hit lands on all three. Cure keeps topping up whoever is lowest and Renew's Regen ticks on one ally at a time, both paid in MP, so a long fight can run it dry. Under Anti-heal, Rot cuts both, so there the Cleric is the wrong pick.

### Ranger

**Role:** wears down tough targets. **Plan:** looses barbed, cold and rending arrows at whatever stands in front, while its plain arrows fly past any guard and open the wounds.

**Weapons:** bow, dagger. **Armor:** Leather. **Offhands:** totem. **Special stats:** Accuracy medium.

- **Passive – Hunter's eye.** Its basic attacks ignore Taunt: they go to a random foe, Taunting or not.
- **Barbed arrow.** Deals light damage that scales from Attack to a random foe, and adds several Bleed; stacks scale from Attack.
- **Frost arrow.** Deals light damage that scales from Attack to the foe with the most Chill, and adds a few Chill; stacks scale from Attack. A second source of Chill, so the Hexer and Frostweaver reach a shatter sooner.
- **Rending arrow.** Deals damage that scales from Attack to the foe with the most Sunder, and adds a few Sunder; stacks scale from Attack.

*Test, Shield wall:* its arrows have no Seek, so they go to the Taunting, Guarded foe, which gets Bleed, Chill and Sunder, and the Sunder raises the damage it takes, offsetting some of its Guard. Its basic attacks ignore Taunt and land on the fragile dealers behind. Against a lone boss, everything stacks on one target.

## Defenders and support

Six classes that win through the party: a tank that punishes, a bodyguard, a shelter for the party, a storm spear who heals and revives, a tempo-setter and a curser.

### Bramble knight

**Role:** thorns tank. **Plan:** draws every foe onto its thorns, where each attacker is left bleeding for the party's blows, regrows whoever is lowest, and lashes out with the thorns themselves.

**Weapons:** sword, staff. **Armor:** Plate, Mail. **Offhands:** totem. **Special stats:** Thorns high.

- **Passive – Briar.** Each time its Thorns damage a foe, that foe gets a few Bleed; stacks scale from Defense.
- **Thicket.** Applies Taunt and Guard to itself.
- **Regrowth.** Applies Regen to the ally with the lowest share of max HP.
- **Bramble lash.** Deals damage that scales from Thorns to a random foe.

*Test, Swarm:* Thicket pulls all eight foes onto the knight. Each basic attack costs its attacker Thorns and leaves it bleeding for the party's next hits, Thicket's Guard blunts the many small hits, and Regrowth mends the knight. Against a Brute it does worse: one big swing triggers Thorns once.

### Hoplite

**Role:** bodyguard who opens foes up. **Plan:** plants its great shield beside the most vulnerable ally to catch the killing blow, locks shields with it, and leaves foes sundered with slow, crushing blows.

**Weapons:** spear, great weapon. **Armor:** Plate. **Offhands:** round shield. **Special stats:** none.

- **Passive – Phalanx.** Its basic attacks come half as often and deal double damage.
- **Aspis.** Applies Aegis to the ally with the lowest share of max HP.
- **Paired guard.** Applies Guard to itself and to the other ally with the lowest share of max HP.
- **Spear thrust.** Deals damage that scales from Attack to a random foe, and adds a few Sunder; stacks scale from Attack.

*Test, Tank buster:* the huge swing lands on whoever the boss picked. Aspis puts Aegis on the lowest ally, which isn't always the target; when it is, the blow is blocked outright. Paired with the Knight it's reliable: the boss hits the Knight, the Knight becomes the lowest, and the Knight holds the Aegis. Between swings, its slow, double-damage basic attacks get through Defense that stops smaller hits, and Spear thrust's Sunder makes the boss take more from every hit.

### Paladin

**Role:** shelter. **Plan:** wards the party against the blows that land, lifts its curses, and brings down slow, heavy, burning judgement, half again as hard on any foe that holds a buff.

**Weapons:** rune sword, mace. **Armor:** Mail, Plate. **Offhands:** kite shield, lantern. **Special stats:** none.

- **Passive – Judgement.** Its hits deal half again as much damage to foes with a buff.
- **Sanctuary.** Applies Ward to every ally.
- **Absolve.** Cleanses and heals itself and the other ally with the lowest share of max HP; the heal scales from Attack. Waits until an ally is below max HP.
- **Smite.** Deals heavy damage that scales from Attack to the foe with the highest Attack, and adds several Burn; stacks scale from Attack. A long wind-up.

*Test, Nuker:* Sanctuary's Ward cuts the heavy spell across the party, and Absolve lifts whatever it leaves behind. Against a Buffer's allies, every hit lands half again as hard while their buffs last; beside a Hexer that strips those buffs, it loses that edge. Smite's long wind-up is its weakness: a fast fight may end before it lands.

### Valkyrie

**Role:** storm spear who heals and revives. **Plan:** a storm-borne spear that reaches past any guard and Shocks what it hits, mends the wounded, and snatches the fallen back ready to fight.

**Weapons:** spear, rune sword. **Armor:** Mail, Leather. **Offhands:** round shield, relic. **Special stats:** none.

- **Passive – Einherjar.** Allies it revives come back with all their actions ready, instead of on cooldown.
- **Gale spear.** Has Seek. Three quick hits on a random foe that isn't Taunting; each deals damage that scales from Attack and adds a few Shock, with stacks that scale from Attack.
- **Rally.** Heals the ally with the lowest share of max HP; the amount scales from Attack. Waits until an ally is below 80% of its max HP.
- **Valhalla.** Revives a random knocked-out ally with a tenth of its max HP. Waits until an ally is knocked out.

*Test, Executioner:* Doom knocks out the Ranger. Valhalla brings it back almost at once, fragile but with every arrow ready, so the party loses little damage. With no Cleanse or Aegis beside her, Doom lands every time: the Valkyrie undoes it rather than stopping it. Next to the Cleric's Raise, Valhalla is the fast, fragile return; Raise is the slow, sturdy one.

### Bard

**Role:** party tempo. **Plan:** a caster at the back whose every note mends an ally a little and gives another mana, with a ballad that steadies the whole party, an allegro that quickens it, and thunder that shocks every foe.

**Weapons:** bow, wand. **Armor:** Leather, Robes. **Offhands:** horn, tome. **Special stats:** none.

- **Passive – Refrain.** Each of its basic attacks that lands heals a random ally and gives a random ally MP, each a share of the damage the attack dealt. So its weapon is a choice: the bow's bigger swings lose less to a foe's Defense, and the wand's Attack raises its Might and Shock.
- **War ballad.** Adds a few Might to every ally; stacks scale from Attack.
- **Allegro.** Applies Haste to every ally.
- **Thunder chord.** Adds several Shock to every foe; stacks scale from Attack.

*Test, Curser:* the Curser Weakens and Slows the party. War ballad's Might, every few ticks on every ally, and Allegro's Haste outweigh both, and Refrain mends the chip damage. It lifts neither debuff, so a Cleric's Renew still helps. Thunder chord makes every foe pay for each action it takes.

### Hexer

**Role:** curser. **Plan:** the debuff bot, the Bard's counterpart: burns and shocks every foe a little so the party's statuses pile up, weakens and sunders the most dangerous one, chills whatever it strikes, and silences a foe mid-cast. Re-themed as a spellblade, and changed only as far as its weapons need; the director names it later.

**Weapons:** dagger, rune sword. **Armor:** Mail. **Offhands:** idol. **Special stats:** Siphon medium.

- **Passive – Cold hex.** Its basic attacks add a few Chill, whatever weapon it carries; stacks scale from Attack.
- **Malison.** Adds a few Burn and a few Shock to every foe; stacks scale from Attack.
- **Unmake.** Applies Silence to the casting foe with the highest Attack, and strips its buffs. Waits until a foe is in a wind-up. (The director's design also named a buffed foe as a trigger; the engine's conditions can't join the two with "or", so it waits for a cast alone, for now.)
- **Enfeeble.** Applies Weaken and adds a few Sunder to the foe with the highest Attack; stacks scale from Attack.

*Test, Buffer:* Unmake waits for the Buffer's wind-up, silences it and strips what it has already given. Malison's Burn and Shock on every foe punish the buffed allies for acting. Enfeeble's Weaken and Sunder go to the foe with the highest Attack, which may be the Buffer's guard rather than the Buffer.

## Fighters

Three damage dealers, each beating Defense its own way: the Monk with Sunder, the Assassin with crits, the Vampire by outlasting it.

### Monk

**Role:** sunders with a blur of blows. **Plan:** every blow leaves the foe a little more open, Flow keeps it fast, burning fists pile onto the hottest foe, and a pressure point drops the most dangerous one for a moment.

**Weapons:** fist weapons, spear. **Armor:** Leather. **Offhands:** bell. **Special stats:** Evasion high, Double strike medium.

- **Passive – Iron palm.** Its basic attacks, and the second strike of its Double strike, add a few Sunder; stacks scale from Attack.
- **Flow.** Applies Haste to itself.
- **Burning fist.** Three quick hits on the foe with the most Burn; each deals damage that scales from Attack and adds a few Burn at three fifths of the word, so the Monk feeds a Pyromancer's fire rather than out-burning it; stacks scale from Attack.
- **Pressure point.** Has Seek. Deals damage that scales from Attack to the foe with the highest Attack, and applies Stun.

*Test, Armored shell:* its first double strikes barely scratch the shell, but each adds Sunder, so every hit after lands harder, and Flow speeds them up. Every strike chips Bulwark too.

### Assassin

**Role:** burst killer. **Plan:** slips out of sight, picks off the weakest foe past any guard, leaves every crit a bleeding wound, and silences the back line.

**Weapons:** dagger, sword. **Armor:** Leather. **Offhands:** vial. **Special stats:** Crit damage high, Evasion medium.

- **Passive – Lacerate.** Each of its crits adds several Bleed to the foe; stacks scale from Attack.
- **Vanish.** Applies Hidden to itself. Waits until it isn't Hidden.
- **Backstab.** Has Seek. Deals damage that scales from Crit chance to the foe with the lowest current HP.
- **Garrote.** Has Seek. Deals damage that scales from Attack to a random foe that isn't Taunting, and applies Silence.

*Test, Stalker:* the Stalker hunts the lowest-HP unit, usually the Assassin. Once Vanish is up, the Assassin is out of reach, and its crits leave Bleed for the party's hits to open. Until then it's exposed, so it wants a Shield or an Area ally beside it.

### Vampire

**Role:** drains to outlast. **Plan:** feeds on everything it hits: the harder it hits, the more it heals, its prey is left weakened, and it bleeds its own life into an ally's wounds and mana. An exotic class, at the director's word. Its identity is healing back from the brink, not sustain all fight.

**Weapons:** fist weapons (claws), great weapon. **Armor:** Mail. **Offhands:** vial, idol. **Special stats:** Lifesteal high.

- **Passive – Bloodlust.** While it's below half of its max HP, its Lifesteal is doubled.
- **Blood drain.** Deals damage that scales from max HP to a random foe, and applies Weaken. The one MP cost off the ladder: very cheap.
- **Blood gift.** Spends a fifth of its max HP to heal the other ally with the lowest share of max HP for as much, and gives it Clarity. Waits until another ally is below 80% of its max HP and the Vampire itself is at 35% of its max HP or more, so the price never kills it.
- **Frenzy.** Adds several Might to itself; stacks scale from Attack.

*Test, Regenerator:* the Vampire out-heals the boss by hitting it. Blood drain's share of max HP and every basic attack feed its Lifesteal, Frenzy raises both, and Blood gift turns the surplus into an ally's HP and mana. Against Anti-heal it falters: Rot cuts its own Lifesteal, and Blood gift's price is still paid.

## Mages

Four mages, each on its theme's job: fire ramps, ice freezes and shatters, lightning spreads, earth crits from behind its Shields. The elements are themes, not damage. The Geomancer is re-themed as an earth fighter and stays here until the director names it. Burn, Chill and Shock each have a source outside their mage, so the mage is the strongest source, not the only one.

### Pyromancer

**Role:** ramping Burn. **Plan:** every strike adds Burn, bolts pile more onto the hottest foe, and a pyre lands on it.

**Weapons:** staff, wand. **Armor:** Robes. **Offhands:** lantern. **Special stats:** none.

- **Passive – Kindling.** Its basic attacks add a few Burn, whatever weapon it carries; stacks scale from Attack.
- **Firebolt.** Deals damage that scales from Attack to the foe with the most Burn, and adds several Burn; stacks scale from Attack.
- **Fireball.** Deals damage that scales from Attack to every foe, and adds a few Burn to each; stacks scale from Attack.
- **Pyre.** Deals heavy damage to the foe with the most Burn; the damage scales from Attack and rises with each Burn stack on that foe. The Burn stays. The dearest ability in the set.

*Test, Two states:* in both phases its hits do little, against very high Defense or Incorporeal, but Burn, untyped, still lands and ticks in full. With a Monk or Hexer adding Burn too, it stays high through both phases.

### Frostweaver

**Role:** freezes and shatters. **Plan:** buries foes in Chill until it shatters into damage and a Stun, leaves the shattered foe sundered for the party, and spends the time it buys keeping an ally's mana flowing.

**Weapons:** rod, staff. **Armor:** Robes. **Offhands:** tome. **Special stats:** none.

- **Passive – Shatterpoint.** When a foe's Chill shatters, that foe takes several Sunder; stacks scale from Attack.
- **Frost lance.** Deals damage that scales from Attack to the foe with the most Chill, and adds several Chill (about half a shatter at base Attack, so one lance never shatters a foe alone); stacks scale from Attack.
- **Blizzard.** Deals damage that scales from Attack to every foe, and adds a few Chill to each; stacks scale from Attack.
- **Stillness.** Applies Clarity to the ally with the least MP among those under half their max MP (with nobody under half, the ally with the least), and adds a few Chill to every foe; stacks scale from Attack.

*Test, Skirmisher:* Blizzard, Frost lance and Stillness build Chill on the fast foes, slowing them, until it shatters for damage and a Stun, and Shatterpoint leaves the foe sundered for the party. Its own basic attacks add no Chill, but Chill thaws slowly, so it builds between casts. With a Hexer or Ranger adding Chill too, the shatters come sooner.

### Stormcaller

**Role:** Shocks every foe. **Plan:** rains quick strikes across every foe so the fast and the many hurt themselves by acting, and charges itself up to strike faster.

**Weapons:** wand, rod. **Armor:** Robes. **Offhands:** bell. **Special stats:** none.

- **Passive – Arc.** Each of its basic attacks also hits a second, random foe, and adds a few Shock to both; stacks scale from Attack.
- **Chain lightning.** Deals damage that scales from Attack to a random foe, then to up to three other random foes, and adds a few Shock to each; stacks scale from Attack.
- **Thunderstorm.** Deals damage that scales from Attack to every foe, and adds a few Shock to each; stacks scale from Attack.
- **Static charge.** Applies Haste to itself.

*Test, Swarm:* Arc, Chain lightning and Thunderstorm Shock all eight foes, and every time one acts, Shock hurts it. Against a lone Nuker it's weak: one slow caster barely sets off Shock, and Arc has no second foe.

### Geomancer

**Role:** hits hardest behind stone. **Plan:** wraps itself and an ally in stone; while its own Shield holds, its rocks crit far more often and far harder, and a tremor drops a foe now and then.

**Weapons:** great weapon, rune sword. **Armor:** Plate. **Offhands:** totem. **Special stats:** Crit damage high.

- **Passive – Bedrock.** While its Shield pool is above zero, its crit chance is doubled.
- **Earthen shell.** Applies Shield to itself and to the other ally with the lowest share of max HP; the amount scales from Defense.
- **Rockfall.** Deals damage that scales from Defense to a random foe.
- **Tremor.** Deals damage that scales from Defense to a random foe, and applies Stun.

*Test, Hit counter:* the boss strikes back every few hits it takes. The Geomancer lands few hits, but while its Shield holds they crit often and hard, so the counter rarely fires. A Shield breaks once hits use up its pool, so the Geomancer crits most while a Knight keeps foes off it. Area damage or a Stalker turns its crits off.

## Parties of 3

Different trios win different fights, and Burn, Chill and Shock each have more than one party built on them. Every class is in at least one winning trio and has fights where it's the wrong pick. These challenges are a sample picked to show how parties differ, not a choice of which challenges the set keeps.

| Challenge | A party that beats it | Why it works | Wrong pick here |
| --- | --- | --- | --- |
| Swarm | Bramble knight, Stormcaller, Valkyrie | Thicket pulls all eight onto Thorns and Bleed; Arc, Chain lightning, Thunderstorm and Gale spear Shock them | Assassin, Hexer: single-target |
| Skirmisher | Hexer, Frostweaver, Knight | Cold hex, Frost lance and Stillness keep Chill high until it shatters; Fortify's Guard blunts the many small hits | Pyromancer: long wind-ups against fast foes |
| Tank buster | Knight, Hoplite, Pyromancer | Aggro keeps the boss on the Knight, who becomes the lowest and so gets Aspis's Aegis; Guard and Shield soften what gets through; Burn ramps safely | Bramble knight: one big swing triggers Thorns once |
| Stalker | Geomancer, Assassin, Stormcaller | Thunderstorm reaches the Hidden Stalker; Vanish hides its usual prey; Earthen shell covers the lowest | Ranger: its arrows can't pick a Hidden foe |
| Summoner | Valkyrie, Ranger, Frostweaver | Gale spear skips the Taunting adds to strike the summoner; the Ranger's basic attacks ignore Taunt; Blizzard thins the adds | Knight: nothing it does gets past the Taunting adds |
| Buffer | Hexer, Assassin, Knight | Unmake silences the Buffer mid-cast and strips its buffs; Garrote Silences another caster; Shield bash Stuns | Stormcaller: spreads damage instead of stopping the Buffer |
| Hit counter (boss) | Geomancer, Knight, Ranger | Shielded, the Geomancer lands few hits that crit hard; Earthen shell keeps it shielded | Monk, Stormcaller: many small hits set off the counter |
| Damage race (boss) | Bard, Monk, Pyromancer | War ballad's Might, and Haste from Allegro and Flow, ramp the party; Burn comes from two sources | Hoplite: protects, but can't win a race |
| Two states (boss) | Pyromancer, Ranger, Monk | Burn from two sources ticks through both phases; Sunder opens the Defense phase, and the Ranger's Bleed adds damage past both | Parties that only hit, without Burn or Bleed |
| Long grind (run) | Cleric, Vampire, Frostweaver | Cure and Renew heal steadily, Raise fixes knockouts, Lifesteal keeps the Vampire full, Stillness refills MP | Pyromancer: burns MP the run can't refill |
| Executioner (boss) | Paladin, Hoplite, Valkyrie | Absolve can lift Doom, Aspis's Aegis may soak it, and Valhalla returns the victim ready | Bard, Hexer: nothing for Doom |
| Anti-heal (boss) | Paladin, Geomancer, Knight | Absolve lifts Rot; Ward, Shields and Guard stop damage instead of healing it | Cleric, Vampire, Bramble knight: their healing is Rotted |

## How the kits fit together

Every piece of the vocabulary is used by a class or an enemy (`classes.ts`, `enemies.ts`), except that Slow and Rot appear only on enemies. Aegis is the Hoplite's alone.

- **Built-up statuses on basic attacks.** Each has a basic-attack source: Burn (Pyromancer), Chill (Hexer), Shock (Stormcaller) and Sunder (Monk).
- **Effects that reach every ally:** Sanctuary, War ballad and Allegro. Thunder chord, Malison and Stillness's Chill reach every foe.
- **Scaling from a stat other than Attack,** the obvious target for gear: Shield bash (max HP), Bramble lash (Thorns), Backstab (Crit chance), Blood drain and Blood gift (max HP), Rockfall and Tremor (Defense), and the Shield amounts of Vanguard (max HP) and Earthen shell (Defense).
- **Striking and focus.** Six classes wear only striking weapons (Knight, Hoplite, Ranger, Monk, Assassin, Vampire), and five only focus weapons (Cleric, Paladin, Pyromancer, Frostweaver, Stormcaller). The five with one of each (Bramble knight, Valkyrie, Bard, Hexer, Geomancer) choose between a harder swing and more Attack for their abilities.
- **Answers to defences.** Sunder (Monk, Ranger, Hoplite) raises the damage a foe takes from every hit, Crit damage (Assassin) beats high Defense, Accuracy (Ranger) beats high Evasion, and a status's own damage meets neither Defense nor Evasion.

## To watch in simulation

- **Stun.** A long-cooldown Stun with no timing condition may rarely catch a wind-up. The fallback is a shorter Stun on a shorter cooldown (`STUN_COOLDOWN`).
- **Pyre** may fire on a foe with very little Burn.
- **Unmake** may strip buffs the moment they land, which could feel like constant reversals.
- **Stand fast.** The Knight's Taunt lasts less than its cooldown, so check it holds bosses on Aggro alone in the gaps.
- **Aspis** goes to the lowest ally, who isn't always the one about to take the big hit. Check how often Aegis catches anything without a Knight drawing the boss.
- **Bedrock** depends on how long the Geomancer's Shield lasts. Check its crit uptime with and without a protector beside it.
