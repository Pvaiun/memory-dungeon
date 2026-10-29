# Step 5i gap map

Oct 28, 2026. Built from the content as it stands on main (engine 0.15): `content/core-set/classes.ts` (kits and passives), `gear.ts` and the gear document (ordinary and powerful pieces), `rogue.ts` (the 29 rogue rule pieces, their `aims`, the 20 affixes), `formations.ts`, `enemies.ts` and `vocabulary.ts`, plus the engine's events and conditions in `src/schema.ts`. It's a tool, not a checklist: nothing has to cover every row.

**How to read a row.** *Gives it* lists the enablers by source: a class kit (ability or passive), ordinary or powerful gear (G), a rogue legendary (L, with the slot that decides who can wear it), an affix (A), a formation (F). *Pays it off* lists what cashes it in. *Answers* is what the party has against it when a foe brings it. **Marks:** ○ empty, ◔ thin, ① one class only, ● strong everywhere (no build needed).

Who can wear what: amulets anyone; light armor anyone; medium armor the Ranger, Valkyrie, Bard, Monk, Assassin, Vampire and every heavy class; heavy armor the Knight, Bramble knight, Hoplite, Paladin, Geomancer; a weapon only its kind's classes (rules document, weapon table).

## What the map says, in short

1. **Enablers are wide, payoffs are narrow.** Burn comes from four classes and two rogue pieces, and pays off in one ability (the Pyromancer's Pyre) and one weapon (the Cinder rod). Shock comes from four classes and two pieces, and has no payoff at all beyond its own trigger. Bleed's only explicit payoff is the Hunter's bow. Chill is the exception, because the shatter pays anyone's Chill: that's why the director's Monk-and-Bard Chill build worked.
2. **Whole trigger families have no listener:** a dodge, a heal given, a Shield breaking, a revive, a foe Stunned or Silenced, the party's own casts. Engines built on those don't exist yet.
3. **Answers sit on one or two classes:** Dispel (the Hexer, 0.18 casts a fight), Ward (the Paladin), Cleanse (the two healers), Seek (four abilities, the Ranger's basics, no gear), Rot (nobody, and no rogue foe uses it either). Physical Area is empty: no physical unit hits every foe.
4. **The amulet is the rule slot.** Of the 29 rogue rule pieces, 17 are amulets, 4 armor, 8 weapons. A unit carries one rule, and every rule competes for the same seat. Light armor, the casters' slot, carries no rule at all.
5. **The strong-everywhere bucket is the fight's start:** party buffs at the first tick (the Herald's horn, the War banner, Blitz), heals on any kill (the Grave lantern, the Soul jar), and Sunder, which multiplies all damage.
6. **Basic-attack riders are the richest row** (seven passives, eleven rogue pieces) and the one the director's example lives in. Double strike's second strike feeds almost none of them: every rider says "basic attacks", and extra strikes aren't.
7. **Formations only change numbers.** Every seat is stats and Aggro; the four effects are a Fundamental status on a trigger. Nothing changes how a unit acts, and no seat has its own status.
8. **Nothing reads the bench** (5h's new pillar), and nothing reacts to MP except Clarity's target rule.

## 1. Statuses

| Status | Gives it | Pays it off | Answers (when foes bring it) | Mark |
| --- | --- | --- | --- | --- |
| **Bleed** | Ranger Barbed arrow; Bramble knight Briar (Thorns → Bleed, from Armor); Assassin Lacerate (crits). L Wound sigil (amulet: crits), Briar coat (medium armor: attackers), Hunter's bow (bow: Ranger, Bard) | Every hit its holder takes: so many-hit units (Gale spear and Burning fist, 3 hits; Double strike; Arc, Cleaving charm and Storm edge's extra hits; fast weapons). Explicit: Hunter's bow only (+50% to bleeding foes). No ability aims at the most Bleed; no Area Bleed | Cleanse (Cleric, Paladin). Snakes | ◔ payoff |
| **Regen** | Cleric Renew; Bramble knight Regrowth. F Caravan (6 ticks at start). L Herald's horn (every ally at start) | Max HP (8% of it a pulse). Nothing reads "has Regen" | – | Herald's horn ● |
| **Shield** | Knight Vanguard (itself, at start); Geomancer Earthen shell (itself and the other lowest). L Stone idol (itself, at start). F Escort (every other ally when one falls) | Geomancer Bedrock; L Stone idol (crit chance doubled while it holds). Its cap reads max HP. Nothing reads a Shield breaking, or scales from a Shield | – | ◔ on allies, ① payoff, ○ on break |
| **Might** | Bard War ballad (every ally); Vampire Frenzy (itself). L War banner (every ally, many, at start), Siren shell (basics: a random ally), Gravecaller (a foe falls: itself). F Last stand (an ally falls) | Itself (6% a stack, one spent an action), so slow, big actions gain most (Phalanx, axes, Pyre, Smite). Nothing reads its stacks | Foes: Take aim, Kindle, Tolling, Cheer, Vengeance → Dispel ① | War banner ● |
| **Weaken** | Hexer Enfeeble; Vampire Blood drain | Defensive only | Witch's Curse → Cleanse | can't carry a build |
| **Guard** | Knight Fortify (lowest ally); Bramble knight Thicket (itself); Hoplite Paired guard (itself and the other lowest) | Everything that scales from Armor: Geomancer Rockfall and Earthen shell, Briar's stacks; G Cornerstone axe, Templar staff; L Spiked bulwark (Thorns from Armor). +3,000 Armor is worth three Armor points to them, but Guard goes by HP share, never to them | Foes: Brace, Shieldman | ◔ (no one aims it) |
| **Stun** | Knight Shield bash; Monk Pressure point; Geomancer Tremor; every Chill shatter (any source); Bulwark breaking | Nothing reads a Stunned foe. A Stun in a wind-up holds it | Foes: Shield slam, Flatten → L Silver bell (immune), Cleanse | ○ payoff |
| **Slow** | No class (Chill slows; Enfeeble's Slow went in 5f) | – (and fewer foe actions means less Shock) | Witch's Curse → Cleanse | can't carry a build |
| **Haste** | Bard Allegro (every ally); Monk Flow, Stormcaller Static charge (itself). L Hourglass (itself, 40 ticks at start). F Blitz (every ally at start) | Everything per action: every basic-attack rider, Refrain, quick abilities. Spends Might faster | Foes: Cheer, Tolling → Dispel ① | Hourglass, Blitz ● |
| **Taunt** | Knight Stand fast; Bramble knight Thicket | When-hit pieces: Thorns; L Static coil, Frozen heart, Briar coat, Spiked bulwark. Judgement and Verdict (Taunt is a buff) | Shieldmen, Drones, Soldiers → Seek (Gale spear, Pressure point, Backstab, Garrote), Hunter's eye, Area, a second foe (Arc, Cleaving charm, Storm edge), Dispel. No Seek on gear | ◔ (two classes) |
| **Burn** | Pyromancer Kindling, Firebolt, Fireball; Monk Burning fist; Paladin Smite; Hexer Malison (every foe). L Ember sigil (amulet), Cinder rod (Lightning staff: Stormcaller, Pyromancer) | Itself (uncapped, Fire, 15% gone a pulse). Pyromancer Pyre (+200 a stack); L Cinder rod (+60% to burning foes). Firebolt, Burning fist and Pyre aim at the most Burn. Nothing spreads it | Hellhounds, Brand, Inferno → Cleanse, Fire resistance, Ward ① | ① payoff |
| **Chill** | Frostweaver Frost lance, Blizzard, Stillness; Hexer Cold hex (basics); Ranger Frost arrow. L Rime sigil (amulet), Frostfang (dagger: Ranger, Bard, Assassin), Frozen heart (heavy armor: attackers), Frost shard (amulet) | The shatter at 12, from anyone's Chill (250 Ice a stack and a Stun). Frostweaver Shatterpoint (Sunder on a shatter); L Frost shard (+12% a stack). Frost lance and Frost arrow aim at the most Chill | Ice foes' Rime, Hailstorm → Cleanse, Ice resistance | the best-covered row; shatter payoffs off the Frostweaver ◔ |
| **Shock** | Stormcaller Arc, Chain lightning, Thunderstorm; Valkyrie Gale spear; Bard Thunder chord (every foe); Hexer Malison (every foe). L Static coil (amulet: attackers), Storm edge (sword) | Itself only (80 Lightning a stack when its holder acts, then half gone): fast and many foes. No piece reads Shock | Wisps' Static, Tempest → Cleanse, Lightning resistance | ○ payoff |
| **Ward** | Paladin Sanctuary (every ally) | Defensive only | Foes: Dark ward, Kindle → Dispel ① | ① answer |
| **Sunder** | Monk Iron palm (basics and extra strikes); Ranger Rending arrow; Hoplite Spear thrust; Hexer Enfeeble; Frostweaver Shatterpoint. L Shatter sigil (amulet), Earthshaker (Earth staff: Geomancer, Bramble knight) | Every hit and tick on its holder (+1.5% a stack, +30% at 20). Rending arrow aims at the most Sunder | – | ● (a team multiplier; fine as an enabler) |
| **Silence** | Hexer Unmake (waits for a cast); Assassin Garrote | Control only; nothing reads a Silenced foe | Wraiths' Mute, the Silent One's Quiet → L Silver bell, Cleanse | ◔ |
| **Hidden** | Assassin Vanish. L Shadow cowl (medium armor: at start, and +80% damage while Hidden) | Shadow cowl only; Hidden sends hits to allies | – | ① |
| **Rot** | Nobody | – | No rogue foe uses it. Foes that heal (Bone Priest's Mend, Ghouls digging each other up) have no anti-heal answer: burst or Silence | ○ answer |
| **Clarity** | Knight Stand fast; Frostweaver Stillness; Vampire Blood gift | MP (see run-level resources) | – | can't carry a build (the director's) |
| **Aegis** | Hoplite Aspis | – | – | ① signature, leave |
| **Doom** (foes) | Reaper's Death bell | – | Cleanse (Cleric, Paladin), Shield and Aegis soak it, revive after | ◔ answer |
| **Bulwark** (foes) | Ice Titan's Frozen core | – | Piercing or Wind hits: Gale spear (3 Wind), daggers, bows, spears, Wind staffs, the arrows, Spear thrust | answered |

## 2. Special stats

| Stat | Gives it | Pays it off | Mark |
| --- | --- | --- | --- |
| **Evasion** | Monk high, Assassin medium. G Tiger claws (fist), Scout leathers (medium), Feather charm; Wraith leathers (high, medium), Mist claws (scales from it). L Shadow cowl. A Nimble. F Scatter's Decoy | Only the Mist claws (damage from Evasion). Nothing reacts to a dodge. It works against Thorns and every when-hit piece (a dodged hit never lands) | ○ on dodge |
| **Accuracy** | Ranger medium. G Stiletto, Tracker's jerkin, Hawk's eye. A True | Only Bats dodge (5e: it never binds) | can't carry a build |
| **Crit chance / Crit damage** | Assassin (Crit 5, damage high), Geomancer (4, high). G Bodkin, Longbow, Pike, Serrated charm, Lucky coin and six more with crit chance; Glass heart, Needle (scales from crit chance). A Lucky, Cruel. F Ambush, Escort's Charge | Backstab scales from crit chance; Bedrock and Stone idol double it; Lacerate and Wound sigil bleed on a crit. Heals can crit too. Nothing else reacts to a crit | ◔ (crit → only Bleed) |
| **Double strike** | Monk medium. G Paired cestus, Zephyr staff, Twinned charm; Twin-soul charm. A Twin | Iron palm and Storm edge (they say "extra"); Bleed (it's a hit). Kindling, Cold hex, Arc and every rogue rider skip it | ◔ (a trap by default) |
| **Thorns** | Bramble knight high. G Rootstaff, Thorn mail, Thorn charm, Thornheart plate. L Spiked bulwark (from Armor). A Thorned | Bramble lash (scales from it), Briar (→ Bleed). Wants Taunt or Aggro | ① payoffs |
| **Lifesteal** | Vampire high. G Bloodied claws, Bloodstone, Twin-soul charm, Vampire's tooth. A Thirsty | Bloodlust (the Vampire). With HP carried between fights, it pays any fast hitter (5d: sustain tops the class table) | ● under attrition |
| **Siphon** | Hexer medium. G Leech staff, Mana leech, Thirsting jewel. A Draining | MP; under 5h a fighter's fuel (5g: the Monk and Valkyrie sat full on it) | MP row, revalue |

## 3. Effects

| Effect | Who has it | Pays it off, or reacts | Mark |
| --- | --- | --- | --- |
| **Heal** | Cleric Cure; Valkyrie Rally; Paladin Absolve; Bard Refrain (each landed basic); Vampire Blood gift; Lifesteal. L Grave lantern, Soul jar (a foe falls) | Nothing reacts to giving a heal, or to healing past full. Being healed only switches Last rites and Bloodlust off | ○ heal given, ○ overheal; Lantern, Soul jar ● |
| **Area** (damage on every foe) | Pyromancer Fireball; Frostweaver Blizzard; Stormcaller Thunderstorm. Statuses on every foe: Thunder chord, Malison, Stillness | Swarms (wolves 6 to 7, wisps 8, hounds 5 to 6), summons. Physical: the Cleaving charm and Storm edge reach one more foe | ○ physical |
| **Cleanse** | Cleric Renew; Paladin Absolve | The answer to Doom, curses, Bleed, Burn, Silence on the party | ◔ (two healers) |
| **Seek** | Valkyrie Gale spear; Monk Pressure point; Assassin Backstab, Garrote; Ranger Hunter's eye (basics) | The answer to Taunting fronts (the Old Road's Shieldmen, act 3's Drones and Soldiers) | ○ on gear |
| **Dispel** | Hexer Unmake (0.18 casts a fight) | The answer to self-buffing bosses (Kindle, Tolling) and their helpers (Cheer, Take aim, Brace, Dark ward, Shield up). Works against Judgement | ① |
| **Revive** | Cleric Raise; Valkyrie Valhalla (Einherjar: ready). Phoenix feathers, RAISE at a campfire | F Last stand (Might) and Escort (Shield) react to the knockout. Nothing reacts to the revive | ○ on revive |

## 4. Stats

| Stat | What scales from it or reads it | Mark |
| --- | --- | --- |
| HP | Shield bash, Vanguard, Blood drain, Blood gift; Heartwood and Sanguine staffs; Stone idol; every Shield cap and Regen pulse | ● (halved as a gear step in 5a for that reason) |
| MP, MP regen | Pools; the Glacier staff scales from max MP. Under 5h every class's regen is 0, gear's works in fights on the wearer, the bench recovers a flat share no gear touches | revalue (below) |
| Attack, Magic | Almost everything | universal |
| Armor | Rockfall, Earthen shell, Briar's stacks; Cornerstone axe, Templar staff; Spiked bulwark. The Hoplite has Armor 5 and nothing in its kit reads it | ◔ |
| Resistances | Gear names elements: answers | answers only |
| Aggro and draw | Walls up, casters down; F seats; G Warhorn, Veil and the rest | fine |

## 5. Damage kinds

- **Slashing, piercing, blunt:** tags with one reader (Bulwark, piercing). Can't carry a build without adding words for the player to learn.
- **Elements:** each class's element is set by its kit and staff; nothing on the party boosts an element. They matter against foes' themed resistances, which the preview shows: an answer, swapped by staff. The three elemental statuses carry Fire, Ice and Lightning as builds.
- **Untyped:** Thorns, Bleed, Blood price, Doom.

## 6. Actions

| | Today | Mark |
| --- | --- | --- |
| **Basic attacks** | Riders: Kindling, Cold hex, Iron palm, Arc, Refrain, Hunter's eye, Phalanx; L Ember, Rime, Shatter and Frost shard sigils, Siren shell, Cleaving charm, Storm edge, Hunter's bow, Cinder rod, Frostfang, Earthshaker. Speed from the weapon kind (dagger 5.6 to axe 12.8), Haste, Double strike | the richest row |
| **Abilities** | No piece reacts to the wearer casting. Casters' gear is stats (Robes, Archmage's robes) | ○ casting payoff |
| **Wind-ups** | Unmake reads a foe casting; Stun holds a wind-up, Silence loses it. Nothing else reacts to a foe winding up, or to the party's own casts being interrupted | ◔ |
| **Cooldowns** | Carry between fights (5g); the bench keeps them (5h); Haste and Last rites shorten them. Gear never touches them | ○ "ready on X" |
| **Multi-hits** | Gale spear, Burning fist (3). Foes: Reap, Tempest | feeds Bleed |
| **MP costs** | By hand, one ladder in two tiers; nothing changes a cost | ○ |

## 7. Reactions and triggers: who listens today

| Trigger | Party pieces that react | Mark |
| --- | --- | --- |
| The fight's start | Vanguard; L War banner, Hourglass, Herald's horn, Shadow cowl, Stone idol; F Blitz, Caravan | ● |
| A basic attack landing | Seven passives, eleven rogue pieces (above) | ● |
| Any hit landing | L Verdict, Executioner, Hunter, Cinder, Frost shard (boosts against a kind of foe) | fine |
| A hit taken | Thorns; L Static coil, Frozen heart, Briar coat | fine |
| A dodge | – | ○ |
| A miss | – (one foe dodges) | skip |
| A crit | Lacerate, L Wound sigil (both Bleed) | ◔ |
| Damage dealt or taken | Briar (from Thorns). Nothing reacts to status damage | ◔ |
| An HP threshold | Last rites (30%), Bloodlust (50%); L Berserker's torc, Executioner (a foe below half); Backstab aims at the lowest HP | fine |
| A heal given or taken | – | ○ |
| The holder's own action starting, resolving or interrupted | – | ○ |
| A status gained or lost | Bedrock and Stone idol (Shield) | ◔ |
| A status at its cap | Shatterpoint (Chill) | ① |
| An ally knocked out | F Last stand, Escort | ◔ |
| A foe knocked out | L Grave lantern, Soul jar, Gravecaller | ● (any party kills) |
| A revive | – | ○ |
| A foe winding up | Unmake | ① |
| A foe buffed | Judgement; L Verdict, Brand of kings (payoff); Unmake (strip) | fine |
| A foe Stunned or Silenced | – | ○ |

## 8. Targeting

| Phrase | Used by | Mark |
| --- | --- | --- |
| The foe with the lowest current HP | Backstab | ◔ (focus fire) |
| The foe with the highest Attack or Magic | Smite, Enfeeble, Pressure point, Unmake | fine |
| The foe with the most Burn, Chill or Sunder | Firebolt, Burning fist, Pyre; Frost lance, Frost arrow; Rending arrow. Most Bleed or Shock: nothing | ◔ |
| A random foe with a buff | In the rules; no party ability uses it | ○ |
| The ally with the lowest share of HP, the other one | Every heal, Guard, Aegis, Earthen shell, Blood gift | fine |
| The ally with the least MP | Stand fast, Stillness | MP row |
| A random knocked-out ally | Raise, Valhalla | fine |
| Every foe, every ally | See Area | fine |
| Seek, Taunt, Hidden | See above | |
| Basic attacks | Always a random foe by draw; only Hunter's eye changes them. Nothing focuses a party's swings | ○ focus |

## 9. Run-level resources (as 5h sets them)

| Resource | What touches it | Mark |
| --- | --- | --- |
| HP carried | Lifesteal, Regen, L Grave lantern, Soul jar; potions, REST | ● Lifesteal |
| MP carried | The bench's flat share (no gear); MP regen gear (in fights, on the wearer); Clarity (three classes); Refrain (the Bard); Siphon (the Hexer, gear); L Soul jar; tonics, FOCUS. The Thirsting jewel's MP regen −1 is now nothing | revalue: MP regen is a fighter's way to last another fight; Clarity, Refrain, Siphon and the Soul jar are the support path |
| Knockouts carried | Raise, Valhalla, phoenix feathers, RAISE | fine |
| Cooldowns carried | Carried, kept on the bench; fresh abilities half charged (5h) | ○ pieces |
| The bench | Nothing reads it | ○ |
| Supplies | No piece interacts (more potion types are out of scope) | skip |

## 10. Formation seats

- **Aggro front and back:** Vanguard, Scatter, Ambush, Last stand, Escort. **Stat changes:** all nine.
- **Seat statuses:** none (the old rule forbade them; lifted).
- **Effects:** Haste (Blitz) or Regen (Caravan) at the start, Might (Last stand) or Shield (Escort) when an ally falls. Five formations have none.
- None changes how a unit acts: what it aims at, how often it swings, what its hits carry.

## 11. Threats in the rogue, and the party's answers

| Threat | Where | Answers today | Mark |
| --- | --- | --- | --- |
| Taunting fronts | Old Road (Shieldmen), Storm Tower and Tower Top (Drones, Soldiers) | Seek on four abilities, Hunter's eye, Area, a second foe, Dispel | ◔ (none on gear) |
| Dodgers | Crypt (Bats) | Accuracy, magic | fine |
| Armor | Skeletons, Shieldmen, Ice Golems' crust | Magic, Sunder, crit damage, big slow hits | fine |
| Magic-proof | Ghosts | Physical | fine |
| Healers | Bone Priests' Mend, Ghouls digging each other up | Burst, Silence the cast | ○ Rot |
| Doom | The Reaper | Cleanse (two healers), Shield, Aegis, revive | ◔ |
| Curses on the party | Witch (Weaken and Slow on every foe) | Cleanse (two healers), Might and Haste over them | ◔ |
| Silence on the party | Wraiths, the Silent One (every foe) | L Silver bell, Cleanse, basic-attack builds | ◔ |
| Mana drain | Leeches (Siphon high) | MP sources | fine |
| Self-buffs | Kindle, Tolling, Cheer, Take aim, Brace, Dark ward, Shield up | Dispel (the Hexer), Silence or Stun the cast; Judgement profits | ① |
| Big casts | Inferno, Soulfire, Lich, Hailstorm, Tempest | Ward (the Paladin), resistance gear, Shield, Aegis, Stun, Unmake | ◔ |
| Swarms and summons | Wolves, Wisps, Hounds, Drones, Soldiers, Mini Slimes | Three mages' Area, Arc and Chain lightning, Thorns behind Taunt, a second foe | ○ physical |
| Bulwark | The Ice Titan | Piercing and Wind multi-hits | fine |
| Splitters, bombs | Lava Slimes, Bomb Bugs | Burst, HP | fine |

## 12. Slots: where the rules live

| Slot | Rogue rule pieces | Who can wear | Note |
| --- | --- | --- | --- |
| Amulet | 17 | Anyone | Every rule competes for one seat a unit |
| Weapon | 8 | The kind's classes | A reason to want a class (good) |
| Heavy armor | 2 (Frozen heart, Spiked bulwark) | Five classes | |
| Medium armor | 2 (Briar coat, Shadow cowl) | Eleven classes | |
| Light armor | 0 | Anyone | The casters' slot has no rule |

No slot rule is the problem; where the rules were put is.

## 13. The marks, gathered

- **Empty (○):** payoffs for Shock and Stun; a Shield breaking; a dodge; a heal given or healing past full; a revive; a foe Stunned or Silenced; the party's own casts; physical Area; Seek on gear; anti-heal (Rot); focus fire on basic attacks; pieces that read the bench or cooldowns; rules on light armor; seat statuses; anything that changes an MP cost.
- **Thin (◔):** payoffs for Bleed and Burn (one piece each, plus Pyre); shatter payoffs off the Frostweaver; Shields on allies; Guard reaching the Armor scalers; Taunt (two classes); Cleanse (two healers); Double strike's second strike; crit payoffs other than Bleed; ally-knockout payoffs; Armor on the Hoplite.
- **One class (①):** Pyre; Shatterpoint; Thorns payoffs; Bloodlust; Ward; Dispel; Hidden; Aegis; Bedrock.
- **Strong everywhere (●):** party buffs at the fight's start (Herald's horn, War banner, Hourglass, Blitz); heals and MP on any kill (Grave lantern, Soul jar); Lifesteal under attrition; HP; Sunder (fine: a multiplier, not a build).

## 14. Rows that can't carry a build, and why

- **Clarity's ticks** (the director's example of a strange synergy), **Accuracy** (one foe dodges), **Slow** (no class source; Chill does its job), **physical subtypes** (tags with one reader), **Aegis** (the Hoplite's signature), **Weaken** (defensive), **resistances and Ward** (answers, not engines), **Regen as a payoff** (it's healing), **elements apart from their statuses** (the preview's answer, by staff), **a miss** (one foe dodges), **supplies** (more potion types are out of scope).
