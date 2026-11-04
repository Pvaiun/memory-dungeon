# Core set: enemies

The enemy side: the rules every enemy keeps, the challenges an enemy can pose, and what each of the 29 enemies is. The numbers are in `content/core-set/enemies.ts`: stat lines (HP, MP, MP regen, Attack, Magic, Armor, Crit, Aggro, in that order), basic attacks, cooldown and wind-up words. Free play's encounters and dungeons are in `dungeons.ts`, and each encounter's test trios (one that should beat it, one that should fail for the challenge's own reason) are in `tests.ts`, which `npm run smoke` plays. The combat rules are in *Core set: rules and vocabulary*, which wins where the two differ.

## Fixed rules and scale

- **Enemies run on the class rules:** the same stats, statuses, effects and target phrases. Heal, Area, Cleanse, Seek, Dispel and Revive are all open to enemies, and Doom and Bulwark are enemy-only (the Reaper's and the Ice Titan's).
- **The scale.** Stats mean what they mean for classes, which run 1 to 5 and reach at most 12 with gear.
  - **Regular enemies** sit at 1 to 8, with one standout up to 12 only where that stat is the challenge. Swarm bodies sit at 1 to 3, and large regulars at 10 to 20 HP.
  - **Bosses** run 8 to 14 in their standout stats, and 60 to 120 HP on the line; a boss has only a share of its line's HP (`BOSS_HP`).
  - All of it states relative intent; simulation sets the final values.
- **A stat line is complete,** and a 0 marks a stat the enemy doesn't use. MP 0 means no abilities that cost MP; a foe's self-buffs (Brace, Take aim, Dark ward, Tolling, Kindle) are free.
- **Every enemy carries some Armor and some Magic resist,** more by rank (minion, elite, boss): `RANK_RESIST` and the Armor floor in `enemies.ts`. The Ghost carries far more Magic resist in its rank's place. There are no weaknesses, no resistance to one element and no absorption: a foe's theme (human, beast, undead, fire, ice, storm…) is flavour only.
- **Bosses resist repeated control:** Stun, Silence and Slow shorten on them and then stop landing for a while (`RULES.control`).
- **Abilities and timing.** Enemy abilities scale from Attack (physical) or Magic (magical), unless an ability says otherwise, as Volatile does. Enemy cooldowns are short, medium or long, each moved a little by its id (`ENEMY_COOLDOWN`). A boss's signature blows and spells sit on the short word and its summons on medium, so it casts its moves two or three times a fight.
- **Fights.** A fight holds at most 8 foes, and summoning counts toward that (Split, Call drones, Rally). No unit leaves a fight alive.
- **Hidden state.** Passives may keep it (a counter, a timer) as long as the effect shows in the numbers: Split, Volatile, Ice crust, Vengeance.
- **Enemy revives** return the unit with every action on cooldown (the Ghoul's Raise).
- **Enemy-only target phrases** exist for Seek attackers: Fickle and Skips the tank. No enemy in this set uses them yet.
- **Difficulty is a knob** on top of these lines, which raises foes' HP and damage (*Core set: the rogue mode*, Difficulty).

## Challenges

The full list: 58 challenges, plus two run types, Echo and Lock. Fundamental answers come first in each list, and a semicolon separates them from the rest. "Magic" means any magical hit, and "physical damage" any physical hit. *Built as* names this set's enemy, boss or region for the challenge, or "–" for the next wave. Gear and formations never count as answers: a party's answers come from its classes' kits.

The original design gave Poison as the Fundamental answer to Armored shell, Dodger, Duelist, Spellward, Hardening hide, Mixed defenses, Mixed gauntlet, Spiked, Splitter, Purifier, Counter stance, Hit counter and Burrower. Bleed replaced Poison. Its damage is untyped too, but it comes only when its holder is hit, so it answers these only in part. The answers below leave Poison out.

### Regular enemies: damage profile

| Challenge | Tier | In a fight | Answers | Built as |
| --- | --- | --- | --- | --- |
| Armored shell | Fundamental | Low HP, heavy Armor. | Magic, Sunder, Crit damage | Skeleton |
| Dodger | Fundamental | High Evasion. | Magic, Accuracy | Bat |
| Duelist | Specialist | High Evasion; each dodge strikes the attacker back. Flurries feed it; Double strike is the trap. | Guard; magic, Accuracy | – |
| Spellward | Fundamental | High Magic resist. | Physical damage | Ghost |
| Hardening hide | Specialist | Each hit it takes raises its Armor for a while, so flurries make it tougher. Few heavy hits are the answer. | Magic, Sunder, Crit damage, Phalanx | Ice Golem |

### Regular enemies: pace

| Challenge | Tier | In a fight | Answers | Built as |
| --- | --- | --- | --- | --- |
| Skirmisher | Fundamental | Very fast, weak hits. | Guard, Evasion, Slow; Thorns, Chill, Shock | Wolf, Hellhound |
| Brute | Fundamental | Slow, crushing hits with a visible wind-up. | Taunt, Stun, Weaken, Shield, Evasion; Aegis | Ogre |
| Glass cannon | Fundamental | Very high Attack or Magic, very low HP and Armor. A stat line. | Shield, Stun, Guard, Evasion, Weaken; lowest-HP targeting | Archer |
| Nuker | Fundamental | A long, visible cast of a heavy spell. | Stun, Shield; Silence, Ward, Siphon, Aegis | Lich |
| Bomb | Specialist | Grows stronger, then explodes on the party when it dies or after a wind-up. This set's Bomb explodes on death, so Stun answers only a wind-up variant. | Might, Haste, Shield; Ward, Aegis (Stun: wind-up variant only) | Bomb Bug |

### Regular enemies: support

| Challenge | Tier | In a fight | Answers | Built as |
| --- | --- | --- | --- | --- |
| Healer | Fundamental | Heals its most hurt ally. | Stun, Might; Silence, Rot, Siphon | Bone Priest |
| Raiser | Specialist | Revives a fallen ally with a very long cast; waits for a knockout. | Stun, Area; Silence, Seek, highest-Magic targeting | – |
| Buffer | Specialist | Gives its allies Might, Haste, Guard, Ward or Shield. | Stun; Dispel, Silence | Fire Imp |
| Regenerator | Specialist | Heals itself with Regen and Lifesteal. | Might; Rot, Dispel | – |

### Regular enemies: statuses

| Challenge | Tier | In a fight | Answers | Built as |
| --- | --- | --- | --- | --- |
| Curser | Fundamental | Weakens and Slows the party. | Cleanse, Might, Haste; Silence | Witch |
| Poisoner | Fundamental | Bleeds the party. | Cleanse, Regen, Heal, Shield | Snake |
| Binder | Specialist | Silences a unit. | Cleanse, Stun; Silence, basic attacks | Wraith |
| Mana thief | Specialist | Has Siphon: its hits drain MP. | Evasion, Slow; Siphon, Clarity, Thorns | Leech |

### Regular enemies: behaviour

| Challenge | Tier | In a fight | Answers | Built as |
| --- | --- | --- | --- | --- |
| Spiked | Specialist | Has Thorns. | Heal; Lifesteal, abilities | – |
| Stalker | Specialist | Starts Hidden, ignores Taunt, hits the lowest-HP unit; several are the Ambush group. | Area, Shield, Guard, Evasion; Hidden | – |
| Summoner | Specialist | Calls in more foes, which Taunt to protect it. | Area, Stun; Seek, Silence | Storm Queen (boss) |
| Splitter | Specialist | Below half HP it's replaced by two smaller copies (toward the 8-foe cap). | Area; heavy single hits from above half to zero, Burn | Lava Slime |
| Undying | Specialist | Returns once after its first knockout at a share of HP; as a boss, two forms. | Heal, Regen; Revive, Lifesteal, Siphon, Clarity, both damage kinds | – |
| Cornered | Specialist | Hits harder and faster as its HP drops. | Weaken, Slow, Shield, Guard; Chill, Dispel, Backstab | – |

### Bosses

| Challenge | Tier | In a fight | Answers | Built as |
| --- | --- | --- | --- | --- |
| Damage race | Specialist | Gains a stack of Might every few seconds. | Might, Haste; Burn, Crit damage, Double strike, Dispel | – |
| Escalating attack | Specialist | One ability grows per cast; tempo answers it, Dispel doesn't. | Stun, Slow, Shield; Silence, Chill, Ward | – |
| Interrupt check | Specialist | A long cast that nearly wipes the party. | Stun, Shield; Silence, Ward | Fire Giant |
| Break shield | Signature | Has Bulwark: every hit chips it. | Haste, many hits; Double strike | Ice Titan |
| Shield check | Specialist | A large self-Shield plus a very long cast; the cast cancels if the Shield breaks first. | Stun, Shield; Dispel, Crit damage, heavy single hits, Ward | – |
| Two states | Specialist | Swaps between very high Armor and very high Magic resist. | Burn, Sunder, both damage kinds | – |
| Buff stacker | Specialist | Keeps buffing itself on short cooldowns. | Weaken; Dispel, Judgement, Sunder vs Guard, Accuracy vs Evasion | – |
| Purifier | Specialist | Cleanses itself every so often. | Bleed reapplied; Burn, Chill and Sunder from basic attacks, plain damage | – |
| Counter stance | Specialist | A visible stance during which every hit on it is answered by a heavy strike (high Thorns). Multi-hit is the trap. | Guard, Heal; Burn, Dispel, one heavy hit under Judgement, Lifesteal | – |
| Punisher | Specialist | A stack of Might each time an ability hits it. | Might; Double strike, Crit damage, Thorns, Dispel | – |
| Hit counter | Specialist | Strikes the party after every few hits it takes. | Crit damage, heavy single hits | – |
| Tank buster | Fundamental | A huge, visible wind-up on its current target. | Taunt, Guard, Shield, Weaken, Stun, Evasion; Aegis, Revive | Ogre Chief |
| Tank swap | Specialist | Each hit Sunders its target. | Taunt, Guard, Cleanse, Heal | – |
| Skips the tank | Specialist | Its big strike has Seek, to the highest-HP non-Taunter. | Guard and Shield on a second unit, Evasion; Aegis | – |
| Fickle | Specialist | Seek attacks ignoring Aggro: every hit a uniform random foe. | Guard, Shield, Heal, Regen, Evasion across the party; Ward, Hidden | – |
| Raidwide | Fundamental | Regular hits on the whole party, physical or magical. | Heal, Regen, Weaken; Ward, Chill | Ice Titan (Hailstorm) |
| Anti-heal | Specialist | Puts Rot on the party. | Shield, Cleanse, Weaken, Guard, Evasion; Ward | – |
| Silence field | Specialist | After a visible wind-up, Silences every ally; Cleanse abilities are Silenced too. | Stun on the wind-up; basic-attack passives | Silent One |
| Buff stripper | Specialist | Every so often Dispels every buff on every ally. | Short-cooldown reapplication, Evasion; Hidden, special stats, passives | – |
| Executioner | Signature | Puts Doom on a unit; an execute variant hits the lowest ally instead. | Cleanse, Shield; Aegis, Revive | Reaper |
| Adds shield | Specialist | Takes no damage while any add lives; calls waves. | Area, Stun on the summon; Silence, lowest-HP targeting, burst between waves | – |
| Feeding adds | Specialist | After a wind-up, consumes its living adds to heal or gain Might. | Area, Stun on the wind-up; Silence, spread Burn, Dispel | – |
| Avenger | Specialist | Gains several Might when an add is knocked out; its adds are tough and Taunt. Area is the wrong pick. | Weaken, Shield; Seek that reaches the boss (Gale spear, Garrote, Pressure point), Hunter's eye, Dispel. Abilities without Seek are forced onto the adds by the Taunt rule. | Storm King |
| Burrower | Specialist | Goes Hidden for stretches, leaving Taunting adds. | Area; Seek | – |

### Groups

| Challenge | Tier | In a fight | Answers | Built as |
| --- | --- | --- | --- | --- |
| Shield wall | Fundamental | A Taunting, Guarded unit protects fragile dealers. | Area; Seek, Sunder, magic | Bandit Camp; Lich Lair |
| Swarm | Fundamental | Up to 8 weak, fast units. A magical swarm answers to Area, Ward, Thorns and healing; Guard and Evasion assume a physical one. | Area, Guard, Evasion, Slow; Thorns, Shock | Wolf Pack; Wisp Cloud |
| Healer and brutes | Fundamental | A Healer keeps tough units alive; two Healers is the harder form. | Stun, Might; Silence, Rot, Siphon, Backstab | Grave Watch |
| Mixed defenses | Fundamental | An Armored shell, a Spellward and a Dodger together. | Both damage kinds, Sunder, Accuracy | Dark Hall |
| Linked pack | Specialist | Each unit revives a fallen packmate after a few seconds; all must fall inside the window. | Area, Stun; Silence, spread Burn, Chill or Shock | Ghoul Pit |
| Vengeful pair | Specialist | When one falls, the other gains many Might or heals to full. | Area, Weaken, Shield; Dispel, Burn on both | – |
| Bomb pack | Specialist | Several Bombs; blasts together wipe, so they must fall one at a time. Area is the wrong pick. | Shield, Heal, Regen, single-target damage; Ward, Aegis | Bomb Room |

### Runs

| Challenge | Tier | In a run | Answers | Built as |
| --- | --- | --- | --- | --- |
| Long grind | Fundamental | Early fights cost HP and MP, and knockouts stay down; a Mana drain variant bleeds MP. | Heal, Regen; Revive, Lifesteal, Siphon, Clarity, Thorns | Fire Mine, Storm Tower, Tower Top |
| Mixed gauntlet | Fundamental | Each fight wants a different answer. | Heal, Regen; both damage kinds, Sunder, Accuracy, Area | Old Road, Crypt |
| Elite mid-run | Specialist | A boss-strength fight before the boss. | Heal, Regen; Revive, Lifesteal, Siphon, Clarity | Tower Top |
| Echo | Fundamental | Every fight asks the same question, harder each time; the run fails you at the door, not the boss. | The question's own answers, brought in depth | Ice Pass |
| Lock | Signature | The run is a key-check: a narrow build family clears it, on purpose. | The named key family | Deep Crypt, Tower Top |

## The enemies

By region. In the rogue mode each region is an act, its fight pools made from these foes (`ROGUE_REGIONS` in `content/core-set/rogue.ts`). In free play the regions are seven dungeons, played in order (`dungeons.ts`). The challenge each enemy is built on is in italics; a passive or ability is in bold, and what it does follows.

### Old Road

All Fundamental: the gentle mixed gauntlet, clearable by the ungeared starting trio. Reskins: the Wolf returns as the Snow Wolf in the Ice Pass, and the Ogre as the Troll and the Shieldman as the Mummy in the Crypt.

- **Wolf.** Hunts in packs. *Skirmisher*; packs are the *Swarm* group. It bites twice a swing, each bite a share of one, so Armor, Guard, Thorns and Bleed on the wolf meet it twice.
- **Bandit.** A common road thug, and the yardstick enemy: no challenge. Losing to Bandits means numbers, not builds.
- **Archer.** Hits hard, falls fast. *Glass cannon*: the stat line is the challenge, its Attack geared on purpose. **Take aim:** several Might on itself.
- **Snake.** Its bite leaves a bleeding wound. *Poisoner*. **Venom:** its basic attacks add one Bleed.
- **Shieldman.** Hides behind a big shield, and anchors the *Shield wall* group. **Shield up:** Taunt on itself. **Shield slam:** a blow of its full Attack to a foe that isn't Stunned, and a Stun.
- **Ogre.** Big, slow, and swings a tree. *Brute*, with the set's enemy Stun. Its massive basic attack is slower than any other great weapon. **Flatten:** heavy damage to a random foe and a Stun, after a long wind-up. It carries the Ogre Chief's grammar at regular size.
- **Ogre Chief (boss).** The biggest ogre, with the biggest club. *Tank buster*. **Crush:** massive damage to a random foe after a very long wind-up. It's enough to knock out any caster outright, while a wall at full HP with Guard survives it unless it crits. The one-shot is the Ogre Chief's identity: no other boss has one.

### Crypt

The dead: the second mixed gauntlet.

- **Skeleton.** Old bones in heavy armor. *Armored shell*. **Brace:** Guard on itself.
- **Bat.** Fast, and hard to hit. *Dodger*: Evasion high.
- **Ghost.** Magic passes right through it. *Spellward*: far more Magic resist than its rank's. It returns in the Ice Pass as the Ice Ghost.
- **Bone Priest.** Heals the other dead. *Healer*. **Mend:** a heal on the ally with the lowest share of max HP, about a party's damage output, so a fight against it is a mirror until the priest is stopped.
- **Witch.** Curses the whole party. *Curser*. **Curse:** Weaken and Slow on every foe, after a long wind-up.
- **Lich.** A dead wizard with one big spell. *Nuker*. **Soulfire:** heavy magical damage to a random foe after a very long wind-up, enough to delete a caster. **Dark ward:** Ward on itself, free, so it never takes the Soulfire's MP.
- **Ghoul.** Ghouls dig each other back up: three or four together are the *Linked pack* group. **Raise:** revives a random knocked-out ally at a share of its HP, with every action on cooldown.
- **Reaper (boss).** Death, with a scythe and a bell. *Executioner*: it owns Doom. **Death bell:** Doom on a random foe, skipping one already Doomed. **Reap:** three scythe slashes, each at a random foe (two may land on one).

### Deep Crypt

The Crypt's spike floor, and a Lock. The key is power outside abilities: the Bard, Monk and Cleric. The side keys are the Vampire's Lifesteal, or Stun-intercept (the Knight, the Geomancer) with its own sustain. Its fights draw on the Crypt's foes as well (the Bone Priest with Trolls, the Lich behind a Mummy, Skeletons).

- **Wraith.** Steals voices. *Binder*. **Mute:** Silence on the foe with the highest Attack or Magic; a foe already Silenced is skipped for the next-highest.
- **Silent One (boss).** Its silence falls on everyone. *Silence field*. **Quiet:** Silence on every foe, after a long wind-up; Cleanse abilities are silenced with everything else. **Tolling:** many Might and Haste on itself, so its swings come faster and harder: the silence is the lock, and the sword is the threat.

### Fire Mine

A long grind of Burn attrition. Fire is the region's theme, not a mechanic.

- **Hellhound.** A fire dog whose bite burns. *Skirmisher*, and a Burn source. It bites twice a swing, as the Wolf does. **Fire bite:** each bite adds a stack of Burn.
- **Lava Slime.** Cut it in half and you get two. *Splitter*. **Split:** below half HP it's replaced by two Mini Slimes, smaller and otherwise the same.
  - The Mini Slimes count toward the 8-foe cap and don't split again.
  - They enter as new units: the slime's statuses don't pass to them, and their basic attacks start on cooldown.
  - Being replaced isn't a knockout.
- **Bomb Bug.** Explodes when it dies. *Bomb*; several are the *Bomb pack*. **Volatile:** knocked out, it deals magical damage from its Magic to every foe and adds a few Burn to each. The blast isn't a hit; Magic resist, Shields and Aegis reduce or block it.
- **Fire Imp.** Cheers its friends on. *Buffer*. **Cheer:** several Might, and Haste, on the ally with the highest Attack or Magic.
- **Fire Giant (boss).** Lord of the furnace. *Interrupt check*.
  - **Brand:** magical damage to a random foe and a few Burn, for steady pressure.
  - **Kindle:** several Might and a Ward on itself; the Inferno follows.
  - **Inferno:** a very long cast that waits until the Giant has kindled. It deals magical damage to every foe, with its Might on top, and adds several Burn to each. It's kept short of killing a caster outright, so the fight is a boss and not a race.

### Ice Pass

An Echo: every fight asks what kind of hit you make. The Wolf returns here as the Snow Wolf, and the Ghost as the Ice Ghost.

- **Ice Spirit.** Living ice, whose touch chills. A Chill source. **Rime:** its hits add a stack of Chill.
- **Ice Golem.** Every hit thickens its ice. *Hardening hide*. **Brace:** Guard on itself. **Ice crust:** each hit it takes raises its Armor for a while; it thaws when the hits stop.
- **Ice Titan (boss).** A walking glacier. *Break shield* (it owns Bulwark), and *Raidwide*.
  - **Frozen core:** immune to Dispel, so none of its buffs can be removed, Bulwark included.
  - **Bulwark:** it starts the fight with many stacks, and every hit removes one. At zero it's Stunned and takes double damage for a while, then Bulwark refills.
  - **Hailstorm:** magical damage to every foe, and a stack of Chill on each.

### Storm Tower

A long grind that drains mana. Shock's region; its small enemies attack with magic.

- **Wisp.** A tiny spark with a temper. A magical *Swarm*, and a Shock source. **Static:** its hits add a stack of Shock.
- **Leech.** Drinks mana. *Mana thief*: Siphon high.
- **Storm Queen (boss).** Queen of the storm drones. *Summoner*. **Call drones:** summons two Drones, up to the cap. **Tempest:** three bolts of magical damage, each at a random foe (two may land on one), each adding a stack of Shock. **Drone,** her add: small, fast and weak, with **Shield up** (Taunt on itself).

### Tower Top

The tower's spike floor: a Lock with an elite mid-run (the Storm Queen) and a mana drain. The key is the Seek bench: the Valkyrie, Assassin and Monk.

- **Storm King (boss).** The Storm Queen's mate: hurt his soldiers and he gets angry. *Avenger*, on summon waves. **Vengeance:** when one of his Soldiers is knocked out, he gains several Might. **Rally:** summons two Soldiers, up to the cap. **Soldier,** his add: tougher than a Drone, with **Shield up** (Taunt on itself).

## Encounters

An encounter is a set of enemies inside the 8-foe cap. It poses a challenge (the sum of what's in it) and has two tests: a trio that should beat it, and one that should fail for the challenge's own reason. Outside the Old Road, every fight is tuned to be failable by most of the 560 possible trios. Free play's 27 encounters and seven dungeons are `encounters` and the dungeons in `dungeons.ts`, and their trios are `tests.ts`. The rogue mode's fight pools are in `rogue.ts`.
