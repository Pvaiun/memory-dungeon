# Dungeon Crawler Brainstorm

## 1. Classes

**Knight**: A wall of steel that keeps every blade pointed at itself.
Taunts on a cooldown and shrugs off swarms of small hits behind heavy Armor. A shield bash stuns a foe that's winding up. Passive: takes less damage of every kind while its Taunt is up.
*Statuses:* Taunt, Stun, damage taken down. *Stats:* Stagger.

**Cleric**: A temple healer who keeps the party standing.
Heals whichever ally is lowest and lifts a debuff from an ally who carries one. Passive: every heal also leaves a short Regen behind.
*Statuses:* Regen, debuff removal. *Stats:* Overflow.

**Mage**: A scholar who throws the elements around.
Four spells in four elements, so the player brings the two the enemy is weak to. They hit one foe hard or all foes lightly. Passive: when out of MP it meditates instead of basic attacking, and regains MP quickly.
*Statuses:* MP restore over time. *Stats:* Quickcast, Echo.

**Thief**: A quick blade that's never quite where you swung.
Fast dagger hits and high Evasion. One ability Veils it for a few seconds. Passive: every dodge makes its next hit a guaranteed crit.
*Statuses:* Veiled, crit chance up. *Stats:* Evasion, Crit Damage.

**Ranger**: A hunter who picks the prey and lets the party finish it.
Marks a foe as Hunted, so the whole party's attacks drift onto it, and its arrows rarely miss. Passive: its hits on a Hunted foe always crit.
*Statuses:* Hunted. *Stats:* Accuracy, Crit Damage.

**Paladin**: A holy knight who protects by striking.
A sturdy fighter whose blows carry extra Light damage. One ability briefly Shields the whole party. Passive: whenever it's hit, the lowest-HP ally heals a little.
*Statuses:* Shield, extra Light damage on attacks.

**Monk**: A barefoot fighter whose fists never stop.
Hits several times per swing for small blunt damage and dodges often. Passive: every landed hit builds Momentum.
*Statuses:* Momentum, Stun. *Stats:* Evasion, Counter.

**Bard**: A wanderer whose songs carry the party.
Sings Haste or Regen over the whole party and barely fights. Passive: can't be Silenced, because its songs aren't spells.
*Statuses:* Haste, Regen, Silence immunity. *Stats:* Echo.

**Berserker**: A Norse warrior who stops caring halfway through.
Uses war cries early in the fight, then just swings its axe. Passive: once it drops below half HP, it goes Berserk for the rest of the fight.
*Statuses:* Berserk, Attack up. *Stats:* Lifesteal, Tenacity.

**Druid**: A keeper of the old forest.
Wraps allies in bark that raises their Armor and lays Regen on the party. Passive: an ally hit while under its Regen sends some damage back at the attacker.
*Statuses:* Regen, Armor up. *Stats:* Thorns.

---

**Samurai**: A swordsman who waits for one perfect cut.
Long wind-ups that land enormous slashes and leave Bleed. Passive: if nothing hits it while it winds up, the cut is a guaranteed crit.
*Statuses:* Bleed, a crit buff that breaks when hit. *Stats:* Crit Damage.

**Ninja**: A shadow who strikes before the fight has properly begun.
Starts the fight Veiled and throws poisoned stars at random foes. Passive: whenever it dodges, it re-Veils for a moment.
*Statuses:* Veiled, Poison. *Stats:* Stealth, Evasion.

**Valkyrie**: A chooser of the slain.
Her strikes go to the lowest-HP foe, and the damage from her kills spills onto the next foe. Passive: whenever any unit is knocked out, she gains Haste.
*Statuses:* Haste. *Stats:* Overkill.

**Hoplite**: A Greek spearman who is only as strong as his shield wall.
Taunts and answers hits with spear thrusts. Passive: gains Armor for every ally still standing and loses it as they fall.
*Statuses:* Taunt, Armor up that reacts to knockouts. *Stats:* Counter.

**Oracle**: A seer of Delphi who names the hour of a foe's death.
Dooms the foe with the most HP and Shields the ally most likely to be targeted. Passive: whenever one of her Dooms lands, the party gains Haste.
*Statuses:* Doom, Shield, Haste.

**Alchemist**: A tinkerer with a belt of mixed potions.
Lobs Poison across all foes, or Regen onto a random ally. Passive: when it's knocked out, its satchel breaks and every ally gains Regen.
*Statuses:* Poison, Regen. *Stats:* Potency.

**Necromancer**: A grave-robber who feeds on the fallen.
Shadow spells that drain life and spread Rot, so foes can't heal it away. Passive: whenever any unit is knocked out, it regains MP and its next spell hits harder.
*Statuses:* Rot, spell damage up. *Stats:* Lifesteal.

**Shrine Maiden**: A miko who purifies with bells and paper.
Strips debuffs from allies and buffs from foes. Passive: an ally she cleanses is immune to debuffs for a few seconds.
*Statuses:* buff and debuff removal, debuff immunity. *Stats:* Tenacity.

**Onmyoji**: A court diviner who seals spirits with talismans.
Pins talismans on foes. A foe that starts an ability while carrying one is Silenced and loses its wind-up. Passive: its talismans can't be removed.
*Statuses:* Silence, a talisman that reacts to starting an action. *Stats:* Stagger.

**Yuki-onna**: A snow spirit whose touch slows everything down.
Frost spells pile Chill on foes until they freeze. Passive: whenever a foe freezes, every other foe gains a stack of Chill.
*Statuses:* Chill, Frozen. *Stats:* Potency.

**Duelist**: A fencer who picks one opponent and dances with it.
Challenges a single foe so it must attack her, and her rapier slips past armor. Passive: while her Challenge is up, every dodge becomes a Counter.
*Statuses:* Taunt on one foe. *Stats:* Evasion, Counter, Penetration.

**Gorgon**: A priestess of Medusa whose stare turns flesh to stone.
Turns the strongest foe to Stone, so it can't act but is nearly unhurtable until it cracks. Passive: when Stone wears off, the foe takes damage scaled from her Magic.
*Statuses:* Stone. *Stats:* Potency.

**Plague Doctor**: A beaked healer who fights sickness with sickness.
Piles Poison and Rot on foes. Passive: when a poisoned foe is knocked out, its Poison jumps to a random foe.
*Statuses:* Poison, Rot. *Stats:* Potency.

**Spellblade**: A swordsman who sheathes a spell in steel.
Enchants its blade so basic attacks add elemental damage, and its abilities are quick to cast. Passive: after each ability, its basic attacks take that ability's element for a while.
*Statuses:* extra damage on attacks, element change. *Stats:* Quickcast.

**Einherjar**: A warrior of Valhalla who treats dying as the best part.
Fights hard and dies loudly, lashing every foe as it falls. Passive: its war cry outlives it, and allies keep the Attack bonus for the rest of the fight.
*Statuses:* a buff that survives its holder's knockout. *Stats:* Spite.

## 2. Statuses a player would see

- **Poison** (debuff): loses HP every second, and new doses stack.
- **Regen** (buff): heals a little every second.
- **Haste** (buff): attacks and wind-ups come faster.
- **Shield** (buff): a pool that soaks damage before HP.
- **Stun** (debuff): can't act, and loses whatever it was winding up.
- **Silence** (debuff): can't use abilities, only basic attacks.
- **Taunt** (buff): foes are forced to attack this unit.

---

- **Bleed** (debuff): takes damage each time it starts an action and loses a stack each time.
- **Chill** (debuff): attacks slow with each stack, and at five stacks it becomes Frozen, a short stun.
- **Doom** (debuff): a countdown that ends in one large hit.
- **Hunted** (debuff): the other side is far more likely to pick it as a target.
- **Rot** (debuff): every heal it receives also makes it lose some HP.
- **Momentum** (buff): each hit landed adds attack speed, and a miss halves it.
- **Berserk** (buff): hits much harder but can't use abilities.
- **Stone** (debuff): can't act, but takes almost no damage until it wears off.
- **Veiled** (buff): can't be targeted until it lands a hit.

## 3. Special stats

- **Evasion**: chance to dodge a physical hit.
- **Accuracy**: cancels out the target's Evasion point for point.
- **Crit Damage**: how much harder crits hit.
- **Penetration**: ignores a flat amount of the target's Armor.
- **Lifesteal**: heals for a share of the damage it deals.
- **Thorns**: anyone who hits this unit takes damage back.
- **Tenacity**: debuffs on this unit wear off faster.

---

- **Counter**: chance to answer a hit with an instant basic attack.
- **Quickcast**: shortens ability wind-ups but not basic attacks.
- **Stagger**: chance that a hit cancels the target's wind-up.
- **Overkill**: damage past a knockout spills onto another random foe.
- **Echo**: chance an ability goes off a second time for free.
- **Overflow**: healing past full HP becomes Shield.
- **Potency**: statuses this unit applies land with extra stacks.
- **Stealth**: while above zero, the unit starts each fight Veiled, and a higher value keeps it Veiled longer.
- **Spite**: when knocked out, deals damage to every foe scaled from this stat.

## 4. Elements

- **Fire**: big, eager hits. Beasts and the restless dead fear it.
- **Frost**: slow and steady. The cold of snow spirits and northern giants.
- **Lightning**: sudden strikes from the sky. The element of Zeus and Thor.
- **Earth**: heavy and grinding. Stone, mountains and gorgons.
- **Wind**: light and quick, like a gust of small cuts. Tengu and storm spirits.
- **Light**: holy fire. Undead and demons are weak to it.
- **Shadow**: curses and the grave. Spirits and the living dead drink it in.
