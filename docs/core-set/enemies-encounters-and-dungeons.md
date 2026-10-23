# Core set: enemies, encounters and dungeons

Oct 23, 2026 · @Paul Suddaby

The complete enemy-side content spec for the first playable: rules the engine must honor, 29 enemies, 27 encounters and 7 dungeons. Companion to *Core set: rules and vocabulary* and *Core set: classes*.

## Fixed rules and scale

Everything here is binding on the content below. The combat rules themselves are in *Core set: rules and vocabulary*; where that doc and this one differ, that one wins.

- **Enemies run on the class rules.** Same stats, statuses, effects and target phrases; Heal, Area, Cleanse, Seek, Dispel and Revive are all available to enemies.
- **Class scale:** stats run 1–5; gear takes a class stat to at most 12.
- **Enemy scale:** same stat meanings. Regular enemies sit at 1–8, with one standout up to 12 only where that stat is the challenge. Swarm bodies sit at 1–3. Large regulars sit at 10–20 HP. Bosses run 8–14 in their standout stats; boss HP runs 60–120. All numbers state relative intent; simulation sets final values.
- **A fight holds at most 8 foes.** Parties are 3. The player owns all 16 classes.
- **Statuses end when a fight ends.** HP, MP and knockouts carry between a run's fights, and nothing restores them between fights. Losing costs nothing; retries are free.
- **Dungeons are played in order 1–7** with no progression between them. Run 1 is additionally clearable by the ungeared starting trio (Knight, Cleric, Ranger).
- **Summoning** exists: a unit can bring new foes into a fight, up to the cap. Used by: Split (Lava Slime), Call Drones (Storm Queen), Rally (Storm King).
- **No unit leaves a fight alive.** Nothing flees, fades or escapes.
- **Doom and Bulwark are enemy-only statuses**, owned by the Reaper and the Ice Titan.
- **The Interrupt exception:** hits of a named element break a named cast (Ice breaks the Fire Giant's Inferno). Damage never interrupts otherwise.
- **Enemy-only target phrases** exist in the rules doc for Seek attackers: a random foe ignoring Aggro (Fickle), and the foe with the highest current HP that isn't Taunting (Skips the tank). No enemy in this set uses them yet.
- **Passives may keep hidden state** (a counter, a timer) as long as the effect shows in the numbers: Split, Volatile, Ice Crust, Vengeance.
- **Enemy revives** return the unit with every action on cooldown (the Ghoul's Raise). Only the Valkyrie's Einherjar overrides that rule, on the class side.

## Challenges

The full list: 61 challenges plus two run types, Echo and Lock. Fundamental answers come first in each list; a semicolon separates them from the rest. "Any element" means any magical hit; "physical damage" means any physical hit. *Built as* names this set's enemy, boss or run for the challenge, or – for the next wave.

### Regular enemies — damage profile

| Challenge | Tier | In a fight | Answers | Built as |
| --- | --- | --- | --- | --- |
| Armored shell | Fundamental | Low HP, heavy Armor. | Poison; any element, Sunder, Crit damage | Skeleton |
| Dodger | Fundamental | High Evasion. | Poison; any element, Accuracy | Bat |
| Duelist | Specialist | High Evasion; each dodge strikes the attacker back. Flurries feed it; Double strike is the trap. | Poison, Guard; any element, Accuracy | – |
| Spellward | Fundamental | Resists every element. | Poison; physical damage | Ghost |
| Elemental | Specialist | Absorbs one element, weak to another. | Poison; any other element, physical damage | Ice Spirit |
| Hardening hide | Specialist | Each hit it takes raises its Armor for a while; flurries make it tougher. Few heavy hits are the answer. | Poison; any element, Sunder, Crit damage, Phalanx | Ice Golem |

### Regular enemies — pace

| Challenge | Tier | In a fight | Answers | Built as |
| --- | --- | --- | --- | --- |
| Skirmisher | Fundamental | Very fast, weak hits. | Guard, Evasion, Slow; Thorns, Chill, Shock | Wolf, Hellhound |
| Brute | Fundamental | Slow, crushing hits with a visible wind-up. | Taunt, Stun, Weaken, Shield, Evasion; Aegis | Ogre |
| Glass cannon | Fundamental | Very high Attack or Magic, very low HP and Armor. A stat line. | Shield, Stun, Guard, Evasion, Weaken; lowest-HP targeting | Archer |
| Nuker | Fundamental | A long, visible cast of a heavy spell. | Stun, Shield; Silence, Ward, Siphon, Aegis | Lich |
| Bomb | Specialist | Grows stronger, then explodes on the party when it dies or after a wind-up. This set's Bomb explodes on death, so Stun answers only a wind-up variant. | Might, Haste, Shield; Ward, Aegis (Stun: wind-up variant only) | Bomb Bug |

### Regular enemies — support

| Challenge | Tier | In a fight | Answers | Built as |
| --- | --- | --- | --- | --- |
| Healer | Fundamental | Heals its most hurt ally. | Stun, Might; Silence, Rot, Siphon | Bone Priest |
| Raiser | Specialist | Revives a fallen ally with a very long cast; waits for a knockout. | Stun, Area; Silence, Seek, highest-Magic targeting | – |
| Buffer | Specialist | Gives its allies Might, Haste, Guard, Ward or Shield. | Stun; Dispel, Silence | Fire Imp |
| Regenerator | Specialist | Heals itself with Regen and Lifesteal. | Might; Rot, Dispel | – |

### Regular enemies — statuses

| Challenge | Tier | In a fight | Answers | Built as |
| --- | --- | --- | --- | --- |
| Curser | Fundamental | Weakens and Slows the party. | Cleanse, Might, Haste; Silence | Witch |
| Poisoner | Fundamental | Poisons the party. | Cleanse, Regen, Heal, Shield | Snake |
| Binder | Specialist | Silences a unit. | Cleanse, Stun; Silence, basic attacks | Wraith |
| Mana thief | Specialist | Has Siphon: its hits drain MP. | Evasion, Slow; Siphon, Clarity, Thorns | Leech |

### Regular enemies — behaviour

| Challenge | Tier | In a fight | Answers | Built as |
| --- | --- | --- | --- | --- |
| Spiked | Specialist | Has Thorns. | Poison, Heal; Lifesteal, abilities | – |
| Stalker | Specialist | Starts Hidden, ignores Taunt, hits the lowest-HP unit; several are the Ambush group. | Area, Shield, Guard, Evasion; Hidden | – |
| Summoner | Specialist | Calls in more foes, which Taunt to protect it. | Area, Stun; Seek, Silence | Storm Queen (boss) |
| Splitter | Specialist | Below half HP it's replaced by two smaller copies (toward the 8-foe cap). | Area, Poison; heavy single hits from above half to zero, Burn | Lava Slime |
| Undying | Specialist | Returns once after its first knockout at a share of HP; as a boss, Two forms. | Heal, Regen; Revive, Lifesteal, Siphon, Clarity, both damage kinds | – |
| Cornered | Specialist | Hits harder and faster as its HP drops. | Weaken, Slow, Shield, Guard; Chill, Dispel, Backstab | – |

### Bosses

| Challenge | Tier | In a fight | Answers | Built as |
| --- | --- | --- | --- | --- |
| Damage race | Specialist | Gains a stack of Might every few seconds. | Might, Haste; Burn, Crit damage, Double strike, Dispel | – |
| Escalating attack | Specialist | One ability grows per cast; tempo answers it, Dispel doesn't. | Stun, Slow, Shield; Silence, Chill, Ward | – |
| Interrupt check | Specialist | A long cast that nearly wipes the party; hits of one element break it. | Stun, Shield; Silence, Ward, the breaking element | Fire Giant |
| Break shield | Signature | Has Bulwark: piercing and Wind hits break it. | Haste; Double strike on a piercing weapon, Wind | Ice Titan |
| Shield check | Specialist | A large self-Shield plus a very long cast; the cast cancels if the Shield breaks first. | Stun, Shield; Dispel, Crit damage, heavy single hits, Ward | – |
| Shifting weakness | Specialist | Its weak and resisted elements change; a Copycat variant mirrors the last element in. | Burn, two or more elements, physical damage | – |
| Two states | Specialist | Swaps between very high Armor and very high resistance. | Burn, Sunder, both damage kinds | – |
| Buff stacker | Specialist | Keeps buffing itself on short cooldowns. | Weaken; Dispel, Judgement, Sunder vs Guard, Accuracy vs Evasion | – |
| Purifier | Specialist | Cleanses itself every so often. | Poison reapplied; Burn, Chill and Sunder from basic attacks, plain damage | – |
| Counter stance | Specialist | A visible stance during which every hit on it is answered by a heavy strike (high Thorns). Multi-hit is the trap. | Poison, Guard, Heal; Burn, Dispel, one heavy hit under Judgement, Lifesteal | – |
| Punisher | Specialist | A stack of Might each time an ability hits it. | Might; Double strike, Crit damage, Thorns, Dispel | – |
| Hit counter | Specialist | Strikes the party after every few hits it takes. | Poison; Crit damage, Earth, Fire | – |
| Tank buster | Fundamental | A huge, visible wind-up on its current target. | Taunt, Guard, Shield, Weaken, Stun, Evasion; Aegis, Revive | Ogre Chief |
| Tank swap | Specialist | Each hit Sunders its target. | Taunt, Guard, Cleanse, Heal | – |
| Skips the tank | Specialist | Its big strike has Seek, to the highest-HP non-Taunter. | Guard and Shield on a second unit, Evasion; Aegis | – |
| Fickle | Specialist | Seek attacks ignoring Aggro: every hit a uniform random foe. | Guard, Shield, Heal, Regen, Evasion across the party; Ward, Hidden | – |
| Raidwide | Fundamental | Regular hits on the whole party; an Elemental aura variant deals one element. | Heal, Regen, Weaken; Ward, Chill | Ice Titan (Hailstorm) |
| Anti-heal | Specialist | Puts Rot on the party. | Shield, Cleanse, Weaken, Guard, Evasion; Ward | – |
| Silence field | Specialist | After a visible wind-up, Silences every ally; Cleanse abilities are Silenced too. | Stun on the wind-up; Encore, basic-attack passives | Silent One |
| Buff stripper | Specialist | Every so often Dispels every buff on every ally. | Short-cooldown reapplication, Evasion; Hidden, special stats, passives | – |
| Executioner | Signature | Puts Doom on a unit; an execute variant hits the lowest ally instead. | Cleanse, Shield; Aegis, Revive | Reaper |
| Adds shield | Specialist | Takes no damage while any add lives; calls waves. | Area, Stun on the summon; Silence, lowest-HP targeting, burst between waves | – |
| Feeding adds | Specialist | After a wind-up, consumes its living adds to heal or gain Might. | Area, Stun on the wind-up; Silence, spread Burn, Dispel | – |
| Avenger | Specialist | Gains several Might when an add is knocked out; its adds are tough and Taunt. Area is the wrong pick. | Weaken, Shield; Seek that reaches the boss (Gale spear, Garrote, Pressure point), Hunter's eye, Dispel (partial — a random buffed foe may be an add's Taunt). Smite and Hush lack Seek and are forced onto the adds by the Taunt rule. | Storm King |
| Burrower | Specialist | Goes Hidden for stretches, leaving Taunting adds. | Area, Poison; Seek | – |

### Groups

| Challenge | Tier | In a fight | Answers | Built as |
| --- | --- | --- | --- | --- |
| Shield wall | Fundamental | A Taunting, Guarded unit protects fragile dealers. | Area; Seek, Sunder, any element | Bandit Camp; Lich Lair |
| Swarm | Fundamental | Up to 8 weak, fast units. A magical swarm answers to Area, Ward, Thorns and healing — Guard and Evasion assume a physical one. | Area, Guard, Evasion, Slow; Thorns, Shock | Wolf Pack; Wisp Cloud |
| Healer and brutes | Fundamental | A Healer keeps tough units alive; two Healers is the harder form. | Stun, Might; Silence, Rot, Siphon, Backstab | Grave Watch |
| Mixed defenses | Fundamental | An Armored shell, a Spellward and a Dodger together. | Poison; both damage kinds, Sunder, Accuracy | Dark Hall |
| Linked pack | Specialist | Each unit revives a fallen packmate after a few seconds; all must fall inside the window. | Area, Stun; Silence, spread Burn, Chill or Shock | Ghoul Pit |
| Vengeful pair | Specialist | When one falls, the other gains many Might or heals to full. | Area, Weaken, Shield; Dispel, Burn on both | – |
| Bomb pack | Specialist | Several Bombs; blasts together wipe, so they must fall one at a time. Area is the wrong pick. | Shield, Heal, Regen, single-target damage; Ward, Aegis | Bomb Room |
| Opposite elementals | Specialist | One absorbs what the other is weak to; random spells heal one. | Poison; physical damage, a third element | – |

### Runs

| Challenge | Tier | In a run | Answers | Built as |
| --- | --- | --- | --- | --- |
| Long grind | Fundamental | Early fights cost HP and MP, knockouts stay down; a Mana drain variant bleeds MP. | Heal, Regen; Revive, Lifesteal, Siphon, Clarity, Thorns | Runs 3, 5, 7 |
| Mixed gauntlet | Fundamental | Each fight wants a different answer. | Poison, Heal, Regen; both damage kinds, Sunder, Accuracy, Area | Runs 1, 2 |
| Elite mid-run | Specialist | A boss-strength fight before the boss. | Heal, Regen; Revive, Lifesteal, Siphon, Clarity | Run 7 |
| Echo | Fundamental | Every fight asks the same question, harder each time; the run fails you at the door, not the boss. | The question's own answers, brought in depth | Run 4 |
| Lock | Signature | The run is a key-check: a narrow build family clears it, on purpose. | The named key family | Runs 6, 7 |

## Vocabulary placement

Which classes and which of this set's enemies hold each piece. Doom and Bulwark are enemy-only.

| Piece | Tier | Classes | Enemies in this set |
| --- | --- | --- | --- |
| Area | Fundamental | Pyromancer, Frostweaver, Stormcaller | Fire Giant, Ice Titan, Storm Queen |
| Evasion | Fundamental | Monk, Assassin | Bat |
| Poison | Fundamental | Ranger, Bramble knight | Snake |
| Taunt | Fundamental | Knight, Bramble knight | Shieldman, Mummy; Drone; Soldier |
| Might | Fundamental | Bard, Vampire | Fire Imp, Storm King |
| Guard | Fundamental | Knight, Bramble knight, Hoplite | Shieldman, Mummy |
| Shield | Fundamental | Knight, Geomancer | – |
| Stun | Fundamental | Knight, Monk, Geomancer | Ogre |
| Haste | Fundamental | Bard, Monk, Stormcaller | Fire Imp |
| Slow | Fundamental | Bard, Hexer | Witch |
| Weaken | Fundamental | Hexer, Vampire | Witch |
| Regen | Fundamental | Cleric, Bramble knight | – |
| Heal | Fundamental | Cleric, Valkyrie | Bone Priest |
| Cleanse | Fundamental | Cleric, Paladin | – |
| Burn | Specialist | Pyromancer, Ranger, Monk | Hellhound, Bomb Bug, Fire Giant |
| Chill | Specialist | Hexer, Frostweaver | Ice Spirit, Ice Titan |
| Shock | Specialist | Stormcaller, Valkyrie | Wisp, Storm Queen |
| Sunder | Specialist | Monk, Ranger, Hoplite | – |
| Seek | Specialist | Ranger (basics), Valkyrie, Monk, Assassin | – |
| Silence | Specialist | Hexer, Assassin | Wraith, Silent One |
| Revive | Specialist | Cleric, Valkyrie | Ghoul |
| Crit damage | Specialist | Assassin, Geomancer | – |
| Hidden | Specialist | Assassin | – |
| Thorns | Specialist | Bramble knight | – |
| Lifesteal | Specialist | Vampire | – |
| Siphon | Specialist | Hexer | Leech |
| Rot | Specialist | Vampire | – |
| Ward | Specialist | Paladin | – |
| Clarity | Specialist | Frostweaver | – |
| Accuracy | Specialist | Ranger | – |
| Double strike | Specialist | Monk | – |
| Dispel | Specialist | Hexer | – |
| Aegis | Signature | Hoplite | – |
| Doom | Signature | – | Reaper |
| Bulwark | Signature | – | Ice Titan |

## Enemies — Old Road

All Fundamental. Reskins: the Wolf returns as the Snow Wolf in the Ice Pass; the Ogre as the Troll and the Shieldman as the Mummy in the Crypt.

### Wolf

Hunts in packs. **Challenge:** Skirmisher; packs are the Swarm group.

**Stats:** HP 2, Attack 2, Armor 0, Crit 2, Aggro 2. **Basic attack:** fast, weak, piercing.

*Beats it — Knight, Cleric, Ranger vs six:* Aggro 5 draws most bites onto Armor 5; Regen outheals the leaks while two weapons thin the pack a wolf a swing. *Fails — Assassin, Vampire, Hexer:* single-target overkill, no Armor, no Area, no front line; the pack wins the race.

### Bandit

A common road thug. **Challenge:** none — the yardstick enemy.

**Stats:** HP 4, Attack 3, Armor 1, Crit 2, Aggro 3. **Basic attack:** medium, slashing.

*Beats it:* any trio. *Fails:* none should; losing to Bandits means numbers, not builds.

### Archer

Hits hard, falls fast. **Challenge:** Glass cannon — the stat line is the challenge; Attack 7 reads geared on purpose.

**Stats:** HP 2, Attack 7, Armor 0, Crit 4, Aggro 2. **Basic attack:** medium, piercing, heavy for its speed.

*Beats it — Knight, Cleric, Ranger vs two Archers and two Bandits:* arrows spread by Aggro mostly onto a Shielded, Guarded Knight; each Archer dies to two hits. *Fails — Cleric, Hexer, Pyromancer:* an arrow takes most of a 2-HP caster before a wind-up finishes; two Archers alive is a knockout per volley.

### Snake

Its bite poisons. **Challenge:** Poisoner.

**Stats:** HP 2, Attack 2, Armor 0, Crit 2, Aggro 1. **Basic attack:** fast, weak, piercing.

**Passive – Venom.** Its basic attacks apply Poison (refresh).

*Beats it — Knight, Cleric, Ranger vs three Snakes and a Bandit:* Poison refreshes rather than stacks, so three Snakes are no worse than one per target; Regen on every ally outruns the ticks. *Fails — Ranger, Bard, Assassin:* three low-HP bodies, no Heal, Cleanse or Shield; the ticks finish what the swords start.

### Shieldman

Hides behind a big shield. **Challenge:** anchors the Shield wall group.

**Stats:** HP 10, MP 3, MP regen 2, Attack 2, Armor 5, Crit 1, Aggro 4. **Basic attack:** medium, slashing.

- **Shield Up.** Applies Taunt to itself. Short cooldown, quick wind-up.
- **Brace.** Applies Guard to itself. Medium cooldown, quick wind-up.

*Beats it — Knight, Cleric, Ranger in the Shield wall group:* Hunter's eye ignores the Taunt and kills the Archers behind the wall; Light prints true past Guard and Armor. The wall falls last, alone. *Fails — Knight, Bard, Vampire:* every first pick is forced onto Guard and Armor 5, chipping two points a swing, while the Archers shoot the Bard off the board.

### Ogre

Big, slow, and swings a tree. **Challenge:** Brute; carries the set's enemy Stun.

**Stats:** HP 16, MP 2, MP regen 1, Attack 6, Armor 2, Crit 2, Aggro 4. **Basic attack:** slow, heavy, blunt, with a long wind-up (an exception to the no-wind-up default).

- **Flatten.** Deals heavy blunt damage to a random foe and applies Stun. Long cooldown, long wind-up.

*Beats it — Knight, Cleric, Ranger:* Aggro 5 pulls the club onto Guard and plate; Protect's Shield soaks Flatten, and a Stunned Knight is still doing his job while 16 HP falls. *Fails — Assassin, Pyromancer, Hexer:* no front line; each swing deletes most of a caster, and by the second Flatten someone is down.

*Design note:* the Ogre carries the Ogre Chief's grammar at regular size.

### Ogre Chief — boss

The biggest ogre, with the biggest club. **Challenge:** Tank buster.

**Stats:** HP 60, MP 4, MP regen 2, Attack 12, Armor 3, Crit 2. **Basic attack:** slow, heavy, blunt.

- **Crush.** Deals massive blunt damage to a random foe: enough to knock out any unguarded caster outright; a Guarded, Shielded Knight survives it. Long cooldown, very long wind-up.

*Beats it — Knight, Cleric, Ranger:* the rules doc's Knight test at boss scale — Fortify and Protect land inside the wind-up, Mercy refills the Knight, Poison and Sunder strip 60 HP while the boss spends its biggest numbers on the one unit built for them. *Fails — Ranger, Assassin, Stormcaller:* nobody holds the Crush; each one is a knockout, and 60 HP does not fall inside three of them.

## Enemies — Crypt and Deep Crypt

The dead. The Ogre stands here as the Troll, the Shieldman as the Mummy. The last two entries belong to the Deep Crypt, the Crypt's spike floor.

### Skeleton

Old bones in heavy armor. **Challenge:** Armored shell.

**Stats:** HP 3, Attack 3, Armor 8, Crit 2, Aggro 3. **Basic attack:** slow, slashing.

*Beats it — Ranger, Hexer, Geomancer:* Poison ignores the plate, Sunder strips it, Ice and Earth never meet it, and Bedrock crits land before Armor does. *Fails — Knight, Bard, Vampire:* three swords print zeros into Armor 8; Might grinds through eventually, and eventually is how the chip wins.

### Bat

Fast, and hard to hit. **Challenge:** Dodger.

**Stats:** HP 2, Attack 2, Armor 0, Crit 2, Aggro 2. **Special stats:** Evasion high. **Basic attack:** fast, weak, piercing.

*Beats it — Knight, Cleric, Hexer:* magic can't be dodged; one Light or Ice hit ends a 2-HP Bat. *Fails — Monk, Assassin, Bard vs four:* three physical kits whiff; Double strike just misses twice while the chip adds up.

### Ghost

Magic passes right through it. **Challenge:** Spellward. Returns in the Ice Pass as the Ice Ghost.

**Stats:** HP 6, Magic 3, Armor 0, Aggro 2. **Resistances:** high against every element. **Basic attack:** medium, magical Dark touch.

*Beats it — Knight, Ranger, Monk:* swords, arrows and fists ignore resistance; six HP falls in a few swings. *Fails — Pyromancer, Frostweaver, Stormcaller vs three:* three mages print slivers while the Dark touches outlast their MP.

### Bone Priest

Heals the other dead. **Challenge:** Healer.

**Stats:** HP 3, MP 6, MP regen 3, Magic 4, Armor 1, Aggro 1. **Basic attack:** medium, weak, magical Dark bolt.

- **Mend.** Heal on the ally with the lowest share of max HP. Short cooldown, normal wind-up.

*Beats it — Hexer, Knight, Ranger in the Healer-and-brutes group:* Hush finds the highest Magic in the room — the Bone Priest — and a Silenced priest is a bad archer. *Fails — Knight, Cleric, Bramble knight:* a sustain mirror with no priest answer; Mend undoes every wound and the party's MP empties first.

### Witch

Curses the whole party. **Challenge:** Curser.

**Stats:** HP 3, MP 5, MP regen 3, Magic 4, Armor 0, Aggro 2. **Basic attack:** medium, weak, magical Dark bolt.

- **Curse.** Applies Weaken and Slow to every foe. Long cooldown, long wind-up.

*Beats it — Cleric, Bard, Knight:* Purify lifts the curses one ally at a time; Haste and Might out-sing them. *Fails — Knight, Hoplite, Geomancer:* Weakened swings, Slowed casts, nothing lifts it; the room wins by stretching time.

### Lich

A dead wizard with one big spell. **Challenge:** Nuker.

**Stats:** HP 2, MP 6, MP regen 2, Magic 7, Armor 0, Aggro 2. **Basic attack:** medium, weak, magical Dark bolt.

- **Soulfire.** Deals heavy Dark damage to a random foe. Long cooldown, very long wind-up.

*Beats it — Knight, Cleric, Ranger:* the cast is a clock; Shield bash lands in the wind-up often enough, and a 2-HP caster dies to one arrow. *Fails — Bramble knight, Vampire, Bard:* nobody can stop the cast, only Slow it; Soulfire deletes the back line, and Taunt was never the answer.

### Ghoul

Ghouls dig each other back up. **Challenge:** the Linked pack group (three or four together).

**Stats:** HP 8, MP 3, MP regen 2, Attack 4, Armor 1, Aggro 3. **Basic attack:** medium, slashing claws.

- **Raise.** Revive on a random knocked-out ally, returning it at a share of its HP, with every action on cooldown. Medium cooldown, long wind-up.

*Beats it — Pyromancer, Stormcaller, Knight vs four:* spread Burn and Thunderstorm put the pack in knockout range together, inside one Raise window. *Fails — Assassin, Ranger, Cleric:* one Ghoul dies at a time and is raised before the second falls; they kill seven and the pack is still four.

### Reaper — boss

Death, with a scythe and a bell. **Challenge:** Executioner (owns Doom).

**Stats:** HP 85, MP 8, MP regen 3, Attack 9, Magic 12, Armor 4. **Basic attack:** medium, heavy, slashing (a scythe).

- **Death Bell.** Applies Doom to a random foe. Long cooldown, long wind-up. Fizzle: it skips a foe already Doomed.

*Beats it — Cleric, Hoplite, Ranger:* the Reaper applies no other debuff, so the Doomed unit is usually the only debuffed ally and Purify finds it; Aegis blocks the toll that slips through, and 85 HP falls to Poison, Sunder and arrows between bells. *Fails — Monk, Stormcaller, Bard:* no Cleanse, Shield, Aegis or Revive; the first Doom resolves and the three-becomes-two arithmetic repeats.

### Wraith — Deep Crypt

Steals voices. **Challenge:** Binder.

**Stats:** HP 4, MP 5, MP regen 3, Magic 5, Armor 0, Aggro 2. **Basic attack:** medium, weak, magical Dark touch.

- **Mute.** Applies Silence to the foe with the highest Attack or Magic. Medium cooldown, normal wind-up. Fizzle: a foe already Silenced is skipped for the next-highest, as Hush does.

*Beats it — Bard, Monk, Cleric:* Encore can't be muted, and a muted Monk still carries Iron palm and Double strike. *Fails — Pyromancer, Frostweaver, Hexer:* the Wraiths mute the biggest Magic in turn; three casters take turns as furniture.

### Silent One — Deep Crypt boss

Its silence falls on everyone. **Challenge:** Silence field.

**Stats:** HP 90, MP 10, MP regen 3, Attack 11, Magic 12, Armor 5. **Basic attack:** medium, heavy, slashing.

- **Quiet.** After a long, visible wind-up, applies Silence to every foe, lasting long. Long cooldown. Purify and Absolve are abilities and are silenced with everything else.

*Beats it — Bard, Monk, Cleric:* Encore keeps Haste and Might flowing through the silence, Iron palm and Double strike never stop, Mercy heals on every Light basic; between Quiets the abilities burst. Second key: a Stun landing in the wind-up cancels the Quiet (Knight, Geomancer), for parties with their own sustain. *Fails — Frostweaver, Stormcaller, Paladin:* kits that are all ability; each Quiet is a stretch of staff bonks with no healing while Attack 11 grinds three light bodies down.

## Enemies — Fire Mine

Everything here resists Fire; Hellhounds and Lava Slimes are weak to Ice.

### Hellhound

A fire dog; its bite burns. **Challenge:** Skirmisher; a Burn source.

**Stats:** HP 3, Attack 3, Armor 0, Crit 2, Aggro 2. **Resistances:** resists Fire, weak to Ice. **Basic attack:** fast, weak, piercing.

**Passive – Fire Bite.** Its basic attacks apply a stack of Burn.

*Beats it — Frostweaver, Knight, Cleric vs a pack of five:* Ice prints double, Chill slows the bites that feed the Burn, Regen outheals the ticks. *Fails — Pyromancer, Vampire, Assassin:* Fire slivers into Fire resistance while three low-Armor bodies wear climbing counters.

### Lava Slime

Cut it in half and you get two. **Challenge:** Splitter.

**Stats:** HP 14, Attack 4, Armor 1, Aggro 3. **Resistances:** resists Fire, weak to Ice. **Basic attack:** slow, blunt slam.

**Passive – Split.** When it falls below half HP it is replaced by two Mini Slimes (HP 7, Attack 3, otherwise the same). They count toward the 8-foe cap and don't split again.

*Beats it — Geomancer, Hoplite, Cleric:* a Bedrock crit or a Phalanx swing takes it from above half to zero, and no Mini Slimes ever exist. *Fails — Bard, Monk, Hexer:* many small hits split everything at speed; the room runs toward the cap.

### Bomb Bug

Explodes when it dies. **Challenge:** Bomb; several are the Bomb pack.

**Stats:** HP 6, Attack 2, Armor 3, Aggro 2. **Resistances:** resists Fire. **Basic attack:** medium, blunt.

**Passive – Volatile.** When it is knocked out, it deals Fire damage to every foe and applies a few Burn to each. The blast is not a hit; Fire resistance, Shields and Aegis reduce or block it.

*Beats it — Knight, Cleric, Geomancer vs three:* single-target damage drops them one at a time behind Shields and Regen, so each blast lands alone on a protected party. *Fails — Pyromancer, Stormcaller, Frostweaver:* Area drops the pack together and the blasts go off together.

### Fire Imp

Cheers its friends on. **Challenge:** Buffer.

**Stats:** HP 3, MP 5, MP regen 3, Magic 3, Armor 1, Aggro 1. **Basic attack:** medium, weak, magical Fire bolt.

- **Cheer.** Applies several Might, and Haste, to the ally with the highest Attack or Magic. Medium cooldown, normal wind-up.

*Beats it — Hexer, Knight, Frostweaver:* Unravel strips the Cheer's work, Shield bash stops the Imp; the Paladin's Judgement, doubling into buffed foes, is the other key. *Fails — Cleric, Bramble knight, Valkyrie:* no strip, stop or Silence — and the Bramble is weak to Fire, so Hasted burning bites melt the hedge.

### Fire Giant — boss

Lord of the furnace. **Challenge:** Interrupt check.

**Stats:** HP 95, MP 10, MP regen 3, Magic 14, Armor 5. **Resistances:** absorbs Fire, weak to Ice. **Basic attack:** slow, heavy, magical Fire.

- **Brand.** Deals Fire damage to a random foe and applies a few Burn. Short cooldown, quick wind-up.
- **Inferno.** A very long, visible cast: huge Fire damage to every foe and many Burn on each. Long cooldown. Any Ice hit on the Fire Giant breaks the cast — the accepted Interrupt exception.

*Beats it — Frostweaver, Knight, Cleric:* any Ice hit breaks Inferno, Brittle pays double into the weakness, Shield bash is the backup when the timing slips. *Fails — Pyromancer, Ranger, Vampire:* Fire heals an absorber, and an absorbed hit applies no Burn, so half the party's damage is a gift; the first uninterrupted Inferno ends the run.

## Enemies — Ice Pass

The Wolf returns here as the Snow Wolf, the Ghost as the Ice Ghost.

### Ice Spirit

Living ice: ice heals it, fire melts it. **Challenge:** Elemental (absorbs Ice, weak to Fire); a Chill source.

**Stats:** HP 5, Magic 4, Armor 1, Aggro 2. **Resistances:** absorbs Ice, weak to Fire. **Basic attack:** medium, magical Ice touch.

**Passive – Rime.** Its hits apply a stack of Chill.

*Beats it — Pyromancer, Knight, Cleric:* Fire prints double and Burn's untyped ticks ignore the ice. *Fails — Frostweaver, Hexer, Valkyrie:* two-thirds of the party's spells feed it (absorbed hits apply nothing) while Chill slows everyone; a party loses to its own damage numbers.

### Ice Golem

Every hit thickens its ice. **Challenge:** Hardening hide.

**Stats:** HP 14, Attack 5, Armor 2, Aggro 3. **Resistances:** resists Ice. **Basic attack:** slow, heavy, blunt.

**Passive – Ice Crust.** Each hit it takes raises its Armor for a while (hidden state; it thaws when the hits stop).

*Beats it — Geomancer, Hoplite, Cleric:* few, heavy hits land before the crust grows, and magic never meets it at all. *Fails — Monk, Bard, Vampire:* the flurry party — Double strike and fast swords feed both crusts until everything prints zero.

### Ice Titan — boss

A walking glacier. **Challenge:** Break shield (owns Bulwark), plus Raidwide as an Ice aura.

**Stats:** HP 110, MP 6, MP regen 2, Attack 14, Magic 8, Armor 6. **Resistances:** resists Ice. **Basic attack:** slow, massive, blunt.

- **Bulwark** (Signature status). It starts the fight with many stacks; each piercing or Wind hit removes one. At zero it is Stunned and takes double damage for a while, then Bulwark refills.
- **Hailstorm.** Deals Ice damage to every foe and applies a stack of Chill to each. Medium cooldown, normal wind-up.

*Beats it — Ranger, Valkyrie, Cleric:* bow, spear and Gale spear's three Wind hits strip the stacks fast; every break window is a Stunned Titan taking double arrows while the Cleric mends the Hailstorms. *Fails — Knight, Geomancer, Pyromancer:* no piercing, no Wind, no windows — only the long race against 110 HP and Attack 14, with the party moving slower every Hailstorm.

## Enemies — Storm Tower and Tower Top

Shock's region; its small enemies attack with magic. The last entry belongs to Tower Top, the tower's spike floor.

### Wisp

A tiny spark with a temper. **Challenge:** Swarm — a magical one; a Shock source.

**Stats:** HP 1, Magic 2, Armor 0, Aggro 1. **Basic attack:** fast, weak, magical Lightning zap.

**Passive – Static.** Its hits apply a stack of Shock.

*Beats it — Stormcaller, Cleric, Bramble knight vs eight:* Thunderstorm halves the cloud in one cast, Thorns kills a Wisp per bite it takes, Regen covers the leaks. *Fails — Monk, Assassin, Valkyrie:* the set's fastest units — Evasion means nothing to Lightning, and Shock taxes every one of their many actions.

### Leech

Drinks mana. **Challenge:** Mana thief.

**Stats:** HP 3, Attack 3, Armor 1, Aggro 2. **Special stats:** Siphon high. **Basic attack:** fast, piercing.

*Beats it — Monk, Bramble knight, Ranger:* Evasion whiffs the bites, Thorns pays them back, and Attack-stat kits make a poor meal. *Fails — Pyromancer, Hexer, Cleric:* three deep blue bars are the banquet; what the Leeches drink never reaches the boss fight.

### Storm Queen — boss

Queen of the storm drones. **Challenge:** Summoner (summoning tech).

**Stats:** HP 85, MP 10, MP regen 4, Magic 13, Armor 3. **Basic attack:** medium, magical Lightning.

- **Call Drones.** Summons two Drones, up to the 8-foe cap. Long cooldown, long wind-up.
- **Tempest.** Deals Lightning damage to every foe and applies a stack of Shock to each. Long cooldown, long wind-up.

**Drone** — her add, only here: HP 2, Magic 2, Armor 0, Aggro 3. Fast, weak magical Lightning zap. **Shield Up:** applies Taunt to itself; short cooldown, quick wind-up.

*Beats it — Stormcaller, Assassin, Cleric:* Thunderstorm deletes each wave of Drones as it lands, Garrote's Seek Silences the next Call Drones in her throat, the Cleric absorbs the Tempests. *Fails — Knight, Hoplite, Vampire:* every pick is Taunted onto an endless supply of Drones; each call rebuilds the wall faster than three swords clear it.

### Storm King — Tower Top boss

The Storm Queen's mate. Hurt his soldiers and he gets angry. **Challenge:** Avenger, on summon waves.

**Stats:** HP 100, MP 10, MP regen 4, Attack 13, Magic 10, Armor 4. **Basic attack:** slow, very heavy, magical Lightning.

- **Passive – Vengeance.** When one of his Soldiers is knocked out, he gains several Might.
- **Rally.** Summons two Soldiers, up to the 8-foe cap. Long cooldown, long wind-up.

**Soldier** — his add, only here: HP 9, Magic 2, Armor 2, Aggro 3. Fast, weak magical Lightning zap. **Shield Up:** applies Taunt to itself; short cooldown, quick wind-up.

*Beats it — Valkyrie, Assassin, Monk (the Seek bench):* Gale spear goes over the Soldiers' heads, Garrote silences the next Rally, Pressure point stuns the hammer, Einherjar's revives absorb the mistakes; the party's Taunted basics chip the Soldiers slowly, so his Might comes in drips the downtime can carry. *Fails — Pyromancer, Stormcaller, Frostweaver:* every Area cast kills Soldiers in pairs; four casts in, the hammer one-shots through anything.

*Note:* the Taunt rule forces Smite and Hush onto the Soldiers (neither has Seek) — see the Avenger row in Challenges; Unravel is a partial key, since a random buffed foe is sometimes a Soldier's Taunt rather than his Might.

## Encounters 1–13

An encounter is a set of enemies inside the 8-foe cap, the challenge it poses (the sum of what's in it) and two tests: a trio that should beat it and one that should fail for the challenge's own reason. Outside run 1, every fight is tuned to be failable by most of the 560 possible trios. Boss encounters share their boss's name.

**1. Toll Gate** — 3× Bandit. **Poses:** none. *Beats:* the starting trio, barely paying attention. *Fails:* nobody should.

**2. Wolf Pack** — 6× Wolf. **Poses:** Swarm (F). *Beats:* Knight, Cleric, Ranger — Aggro and Armor turn the bites to scraps; Regen covers the rest. *Fails:* Assassin, Vampire, Hexer — single-target overkill, no front line.

**3. Snake Pit** — 3× Snake, 2× Bandit. **Poses:** Poisoner (F). *Beats:* Knight, Cleric, Ranger — Regen on every ally outruns the ticks, Purify lifts the worst. *Fails:* Ranger, Bard, Assassin — three low-HP bodies, no Heal, Cleanse or Shield.

**4. Bandit Camp** — 1× Shieldman, 2× Archer, 1× Bandit. **Poses:** Shield wall (F), Glass cannons behind it. *Beats:* Knight, Cleric, Ranger — Hunter's eye and Light go past the wall; it falls last, alone. *Fails:* Knight, Bard, Vampire — all steel, Taunted onto the wall while the Archers shoot the Bard.

**5. Ogre Bridge** — 1× Ogre, 2× Bandit. **Poses:** Brute (F), with the enemy Stun. *Beats:* Knight, Cleric, Ranger — the club lands on Guard and plate. *Fails:* Assassin, Pyromancer, Hexer — each swing deletes most of a caster.

**6. Ogre Chief — boss** — 1× Ogre Chief, 2× Bandit. **Poses:** Tank buster (F). *Beats:* Knight, Cleric, Ranger — Fortify and Protect land inside the wind-up; once the Bandits die, Shield bash's only target is the boss, so bashes cancel Crushes. *Fails:* Ranger, Assassin, Stormcaller — nobody holds the Crush; 60 HP doesn't fall in three of them.

**7. Bone Yard** — 4× Skeleton. **Poses:** Armored shell (F). *Beats:* Ranger, Hexer, Geomancer — Poison, Sunder, magic and pre-Armor crits. *Fails:* Knight, Bard, Vampire — twelve total HP the party can't reach.

**8. Dark Hall** — 1× Skeleton, 1× Ghost, 2× Bat. **Poses:** Mixed defenses (F). *Beats:* Ranger, Cleric, Monk — Accuracy and Light find the Bats, fists and arrows end the Ghost, Poison and Iron palm open the Skeleton. *Fails:* Knight, Bard, Vampire — they can only kill the Ghost; two-thirds of the room never stops hitting back.

**9. Curse Room** — 1× Witch, 2× Skeleton. **Poses:** Curser stacked on Armored shell (F×2). *Beats:* Cleric, Bard, Ranger — Purify lifts it, tempo out-sings it, Poison cares about neither Weaken nor Armor. *Fails:* Knight, Hoplite, Geomancer — Weakened steel into Armor 8, Slowed casts, no lifting any of it.

**10. Grave Watch** — 1× Bone Priest, 2× Troll (Ogre). **Poses:** Healer and brutes (F). Harder form: 2× Bone Priest, 1× Troll. *Beats:* Hexer, Knight, Ranger — Hush finds the priest; the Trolls then die in order. *Fails:* Knight, Cleric, Bramble knight — a sustain mirror whose MP empties first.

**11. Ghoul Pit** — 4× Ghoul. **Poses:** Linked pack (S). *Beats:* Pyromancer, Stormcaller, Knight — spread Burn and Thunderstorm drop all four inside one Raise window. *Fails:* Assassin, Ranger, Cleric — one at a time, raised before the second falls.

**12. Lich Lair** — 1× Lich, 1× Mummy (Shieldman). **Poses:** Nuker behind a Shield wall (F×2). *Beats:* Assassin, Knight, Cleric — Garrote Silences the Lich through the wall, Backstab deletes the lowest HP in the room, which is the Lich. Other keys past the Taunt: Pressure point, Hunter's eye. *Fails:* Knight, Bard, Vampire — Taunted onto the Mummy while Soulfire deletes the back line.

**13. Reaper — boss** — 1× Reaper, 2× Bat. **Poses:** Executioner (Signature). *Beats:* Cleric, Hoplite, Ranger — the Doomed unit is the only debuffed ally, so Purify finds it; Aegis blocks the toll that slips through. *Fails:* Monk, Stormcaller, Bard — no Cleanse, Shield, Aegis or Revive; three-becomes-two repeats.

## Encounters 14–27

**14. Hound Pack** — 5× Hellhound. **Poses:** Skirmisher (F), with Burn. *Beats:* Frostweaver, Knight, Cleric — Ice doubles, Chill slows the bites, Regen outheals the ticks. *Fails:* Pyromancer, Vampire, Assassin — Fire slivers while low-Armor bodies wear climbing counters.

**15. Lava Flow** — 2× Lava Slime. **Poses:** Splitter (S). Worst case four Mini Slimes. *Beats:* Geomancer, Hoplite, Cleric — heavy single hits skip the split entirely. *Fails:* Bard, Monk, Hexer — small fast hits split everything; the room runs toward the cap.

**16. Bomb Room** — 3× Bomb Bug. **Poses:** Bomb pack (S). *Beats:* Knight, Cleric, Geomancer — one at a time behind Shields and Regen. *Fails:* Pyromancer, Stormcaller, Frostweaver — Area drops the pack together and the blasts go off together.

**17. Imp Kennel** — 1× Fire Imp, 3× Hellhound. **Poses:** Buffer (S), on a canvas of Fundamental hounds. *Beats:* Hexer, Knight, Frostweaver — Unravel strips, Shield bash stops the Imp, Ice handles the hounds; Judgement is the other key. *Fails:* Cleric, Bramble knight, Valkyrie — no strip, stop or Silence, and the Bramble is weak to Fire.

**18. Fire Giant — boss** — 1× Fire Giant. **Poses:** Interrupt check (S). *Beats:* Frostweaver, Knight, Cleric — any Ice hit breaks Inferno; Shield bash is the backup. *Fails:* Pyromancer, Ranger, Vampire — their Fire heals it and leaves no Burn; the first uninterrupted Inferno ends the run.

**19. Golem Hall** — 2× Ice Golem. **Poses:** Hardening hide (S). *Beats:* Geomancer, Hoplite, Cleric — few heavy hits land before the crusts grow; magic never meets them. *Fails:* Monk, Bard, Vampire — the flurry party feeds both crusts to zero.

**20. Ice Heart** — 3× Ice Spirit. **Poses:** Elemental (S). *Beats:* Pyromancer, Knight, Cleric. *Fails:* Frostweaver, Hexer, Valkyrie — two-thirds of their spells feed the room.

**21. Whiteout** — 2× Ice Ghost (Ghost), 1× Ice Spirit. **Poses:** Spellward beside Elemental (F + S) — the anti-mage room. *Beats:* Monk, Ranger, Knight — pure steel ignores every resistance; Blazing arrow doubles into the one Fire weakness. *Fails:* Hexer, Frostweaver, Stormcaller — Ice heals, everything else slivers, Chill slows what works.

**22. Ice Titan — boss** — 1× Ice Titan. **Poses:** Break shield + Raidwide (Signature). *Beats:* Ranger, Valkyrie, Cleric — bow, spear and Gale spear strip the stacks; every break window is doubled arrows. *Fails:* Knight, Geomancer, Pyromancer — no piercing, no Wind, no windows; the long race is lost slower every Hailstorm.

**23. Wisp Cloud** — 8× Wisp. **Poses:** Swarm, magical (F). *Beats:* Stormcaller, Cleric, Bramble knight — Thunderstorm halves the cloud, Thorns kills a Wisp per bite. *Fails:* Monk, Assassin, Valkyrie — the fastest units, taxed by Shock, dodging nothing.

**24. Wisp Nest** — 4× Wisp, 2× Leech. **Poses:** Swarm + Mana thief (F + S) — the drain fight. *Beats:* Bramble knight, Knight, Ranger — Thorns deletes Wisps, plate blanks the Leech bites, shallow MP starves the theft. *Fails:* Pyromancer, Hexer, Cleric — three deep blue bars are the banquet.

**25. Leech Den** — 4× Leech. **Poses:** Mana thief (S), at the boss door. *Beats:* Monk, Bramble knight, Ranger — Evasion whiffs the bites, Thorns pays them back. *Fails:* Pyromancer, Hexer, Cleric — drained dry; Pyre and Revive never come.

**26. Storm Queen — boss** — 1× Storm Queen, 2× Drone out at the start. **Poses:** Summoner (S). *Beats:* Stormcaller, Assassin, Cleric — Thunderstorm deletes each wave, Garrote Silences the next Call Drones. *Fails:* Knight, Hoplite, Vampire — Taunted onto an endless supply of Drones.

**27. Silent Hall** — 2× Wraith, 2× Skeleton. **Poses:** Binder + Armored shell (S + F). *Beats:* Bard, Monk, Cleric — Encore can't be muted, and a muted Monk still Sunders the Skeletons. *Fails:* Pyromancer, Frostweaver, Hexer — the Wraiths mute the armor answers in turn and the Skeletons do the rest.

## Dungeons

Seven runs, played in order. Encounter numbers refer to the sections above; each row is the fight's exact contents. The last fight of every run is its boss.

### Run 1 — Old Road

Mixed gauntlet, gentle. Clearable by the ungeared starting trio. **Clears it:** front line + healer + steady damage; Knight, Cleric, Ranger above all.

| Order | Encounter | Enemies |
| --- | --- | --- |
| 1 | 1. Toll Gate | 3× Bandit |
| 2 | 2. Wolf Pack | 6× Wolf |
| 3 | 3. Snake Pit | 3× Snake, 2× Bandit |
| 4 | 4. Bandit Camp | 1× Shieldman, 2× Archer, 1× Bandit |
| 5 | 5. Ogre Bridge | 1× Ogre, 2× Bandit |
| 6 — boss | 6. Ogre Chief | 1× Ogre Chief, 2× Bandit |

### Run 2 — Crypt

Mixed gauntlet. **Clears it:** Ranger, Cleric, Pyromancer; Hoplite, Cleric, Stormcaller.

| Order | Encounter | Enemies |
| --- | --- | --- |
| 1 | 7. Bone Yard | 4× Skeleton |
| 2 | 8. Dark Hall | 1× Skeleton, 1× Ghost, 2× Bat |
| 3 | 9. Curse Room | 1× Witch, 2× Skeleton |
| 4 | 11. Ghoul Pit | 4× Ghoul |
| 5 — boss | 13. Reaper | 1× Reaper, 2× Bat |

### Run 3 — Fire Mine

Long grind (Burn attrition). **Clears it:** Frostweaver, Knight, Cleric; Hexer, Geomancer, Cleric.

| Order | Encounter | Enemies |
| --- | --- | --- |
| 1 | 14. Hound Pack | 5× Hellhound |
| 2 | 15. Lava Flow | 2× Lava Slime |
| 3 | 16. Bomb Room | 3× Bomb Bug |
| 4 | 17. Imp Kennel | 1× Fire Imp, 3× Hellhound |
| 5 — boss | 18. Fire Giant | 1× Fire Giant |

### Run 4 — Ice Pass

Echo: every fight asks what kind of hit you make. **Clears it:** Ranger, Valkyrie, Cleric; Hoplite, Ranger, Cleric.

| Order | Encounter | Enemies |
| --- | --- | --- |
| 1 | 2. Wolf Pack (as Snow Wolves) | 6× Snow Wolf (Wolf) |
| 2 | 19. Golem Hall | 2× Ice Golem |
| 3 | 20. Ice Heart | 3× Ice Spirit |
| 4 | 21. Whiteout | 2× Ice Ghost (Ghost), 1× Ice Spirit |
| 5 — boss | 22. Ice Titan | 1× Ice Titan |

### Run 5 — Storm Tower

Long grind, Mana drain variant. **Clears it:** Bramble knight, Assassin, Frostweaver; Hexer variants (Siphon steals the MP back).

| Order | Encounter | Enemies |
| --- | --- | --- |
| 1 | 23. Wisp Cloud | 8× Wisp |
| 2 | 24. Wisp Nest | 4× Wisp, 2× Leech |
| 3 | 25. Leech Den | 4× Leech |
| 4 — boss | 26. Storm Queen | 1× Storm Queen, 2× Drone |

### Run 6 — Deep Crypt (spike)

Lock, beneath the Crypt. **The lock:** power outside abilities — core key Bard, Monk, Cleric; side keys Vampire's Lifesteal, or Stun-intercept (Knight, Geomancer) with their own sustain.

| Order | Encounter | Enemies |
| --- | --- | --- |
| 1 | 10. Grave Watch | 1× Bone Priest, 2× Troll (Ogre) |
| 2 | 12. Lich Lair | 1× Lich, 1× Mummy (Shieldman) |
| 3 | 27. Silent Hall | 2× Wraith, 2× Skeleton |
| 4 — boss | — Silent One | 1× Silent One |

### Run 7 — Tower Top (spike)

Lock + Elite mid-run + Mana drain, above the Storm Tower. **The lock:** the Seek bench — Valkyrie, Assassin, Monk.

| Order | Encounter | Enemies |
| --- | --- | --- |
| 1 | 24. Wisp Nest | 4× Wisp, 2× Leech |
| 2 — elite | 26. Storm Queen | 1× Storm Queen, 2× Drone |
| 3 — boss | — Storm King | 1× Storm King |
