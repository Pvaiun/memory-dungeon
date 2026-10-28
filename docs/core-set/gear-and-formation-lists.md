# Core set: gear and formation lists

Oct 23, 2026 · @Paul Suddaby

*Updated Oct 28, 2026, by the feel pass (step 5g): weapons swing faster again, most of the way back to their pre-5f intervals and with a wider spread (the dagger every 5.6 ticks to the axe every 12.8, the Ice staff the fastest staff), and a swing's base is up and its scaling down, so the kinds table gives each kind's interval and its speed word follows it (the Dark staff now reads fast and the Earth staff slow). Crits are rarer and smaller: a crit step on gear or a formation is read off the same table as the classes' crit words (3, 5, 9, 16, 20%), so Crit chance +1 on gear adds 3 points and +2 adds 5 (a formation's 3.5 and 7), and Crit damage medium and high add 25 and 50 to the 150% multiplier. Lifesteal medium and high are 10% and 20%. The Retainer, Tucked-in and Quartermaster slots give up one step of Attack and Magic, not two. Phalanx swings half as often for double damage, not a third as often for triple, and Brittle is gone (Chill shatters at its cap), so the lines that leaned on them say what's left. Two older changes are caught up here too: the Knight lost Protect and Sworn in step 5f (its Vanguard Shield and Shield bash scale from max HP), and Scatter's Decoy has been Armor −1 since the campaign pass. The gear pieces are as written.*

*Updated Oct 27, 2026, by the balance pass (step 5e) and the combat economy pass (step 5f, awaiting the director's read): a formation slot's step is one and a quarter gear steps (5e set one and a half when the five formations with no effect sat within 3 points of Neutral; 5f's longer fights made the slot formations worth +10 and brought it down), Caravan's Regen is a short one (6 ticks of the status's 24) and its Quartermaster gives one step of MP regen, not two (with mana binding, two were a unit's whole regen), Escort's slots carry Aggro alone and its Shield is 0.12 of max HP, Last stand's Martyr gives up one HP step (two took an HP-2 class to nothing beside Glass heart). Weapons swing half again as slowly and hit half again as hard (5f), the Ice staff the fast light staff among them. The gear pieces are as written.*

*Updated Oct 26, 2026, when the campaign work joined main. The pieces are as written; three things around them changed. Aggro is centred on 100, so an Aggro step here is ±10 and foes pick by draw, which keeps every unit between a third and three times an ordinary unit's pull (*Core set: rules and vocabulary*, Targeting). A step of HP on gear or a formation slot is half a point, not one (at one, HP was every class's best kit). The Cleric lost Mercy and Prayer (*Core set: classes*), so the lines that leaned on them say what's left. `DECISIONS.md` has the reasons.*

## About this doc

The gear and formation lists for the slice, designed against the gear and formation rules in *Core set: rules and vocabulary* and the build axes below.

The aim is build choices. Every fork in the build axes has pieces pointed at it from more than one slot, and most pieces read differently on different classes: a core piece for one build, a sidegrade for another, dead weight on a third. Gear pulls a class along its forks; formations serve the party shapes. Numbers stay in the relative scale in *Core set: classes*, and balancing comes later.

| Kind | Starters | Ordinary | Powerful |
| --- | --- | --- | --- |
| Weapons | 13 plain | 33 named | 7 |
| Armor | – | 14 | 3 |
| Amulets | – | 16 | 4 |
| Formations | 1 neutral | 9 | – |

That's 90 pieces, 76 of them ordinary drops counting the plain weapons, and 10 formations.

Order: weapons, armor, amulets, formations, then a coverage check against every fork, stat and shape, and what to watch in simulation.

## Build axes

What the lists are designed against. A stat is worth carrying when some kit multiplies it, and a fork is a direction a class's kit rewards; every For column and the coverage check name these forks. In the tables, **For** names the forks a piece is made for, by their names here; a piece is usually fine on others too.

### What each stat is for

| Stat | Who multiplies it |
| --- | --- |
| Max HP | Blood drain (Vampire), and the Knight's Vanguard Shield and Shield bash, scale from it. Every holder's Shield cap and Regen ticks grow with it. |
| MP, MP regen | Costly casters over a dungeon: Pyromancer, Cleric (Raise), Paladin (Smite), Valkyrie (Valhalla). The low-MP defenders: Knight, Hoplite, Bramble knight. |
| Attack | Physical damage and its stacks: Ranger, Monk, Hoplite (Sunder), Valkyrie (Gale spear's Shock), Vampire (Frenzy's Might), Assassin (Garrote). |
| Magic | Magical damage and its stacks: Pyromancer, Frostweaver, Stormcaller, Hexer, Bard (War ballad's Might), Valkyrie (Rally), Cleric (Cure), Paladin (Smite), Geomancer (Tremor). |
| Armor | Rockfall and Earthen shell (Geomancer). |
| Resistances | Covering weaknesses: Bramble knight (Fire), Vampire (Light). Answering a foe's element once seen. |
| Crit chance | Backstab (Assassin) scales from it, Bedrock (Geomancer) doubles it, Lacerate (Assassin) bleeds on each crit. |
| Aggro | Up for units that want hits: Knight, Bramble knight, Hoplite, a dodging Monk. Down for fragile ones: Pyromancer and Stormcaller sit at Aggro 1 on HP 2. |
| Evasion | Monk, Assassin. |
| Accuracy | Physical units against high Evasion. The Ranger holds it. |
| Crit damage | Assassin, Geomancer, the Hoplite's doubled blows. |
| Double strike | Monk (Iron palm Sunders on both strikes), fast weapons. A trap for the Hoplite, whose second strike isn't doubled, and for Kindling, Cold hex and Arc, which skip it. |
| Thorns | Bramble knight (Bramble lash). Any unit that draws many hits. |
| Lifesteal | Vampire (doubled by Bloodlust). Fast hitters. |
| Siphon | Hexer. MP-hungry casters on long runs, like the Pyromancer. |

### Forks by class

| Class | Heaviest armor · kinds | Forks |
| --- | --- | --- |
| Knight | Heavy · sword, axe | **Party shield:** max HP, MP regen. **Iron wall:** Armor. |
| Cleric | Light · Light staff | **Battle cleric:** Magic, Crit chance, Double strike (Mercy's build; since Mercy went, a Cleric that also hits). **Pilgrim:** MP, MP regen. |
| Ranger | Medium · bow, dagger | **Marksman:** bow, Attack, Crit damage. **Harrier:** dagger, Double strike, Accuracy. Simple on purpose, as a starter. |
| Bramble knight | Heavy · sword, Earth staff | **Thornwall:** Thorns, Aggro. **Deep roots:** HP, Armor, Fire resistance. |
| Hoplite | Heavy · spear, sword | **Striker:** a high-damage weapon, Attack, Crit damage. **Bodyguard:** Armor, HP, Aggro. |
| Paladin | Heavy · sword, Light staff | **Sword and plate:** heavy armor, sword, Attack. **Staff and robes:** light armor, Light staff, Magic, MP. **Staff and plate:** heavy armor, the Templar staff, Armor. |
| Valkyrie | Medium · spear, sword, Light staff | **Storm:** spear or sword, Attack. **Light:** Light staff, light armor, Magic. |
| Bard | Medium · dagger, bow | **Songs:** light armor, Magic, MP regen. **Blade:** medium armor, Attack, a dagger. |
| Hexer | Light · Ice staff, Dark staff | **Frost:** Magic. **Endurance:** MP regen, Siphon, and max MP with the Glacier staff. |
| Monk | Medium · fist weapons, spear | **Breaker:** fists, Double strike, Attack. **Dodge tank:** Evasion, Aggro. |
| Assassin | Medium · dagger, sword | **Precision:** Crit chance, Crit damage. **Cutthroat:** Attack, a sword. |
| Vampire | Medium · sword, fist weapons, Dark staff | **Blood:** max HP. **Frenzy:** Attack, Lifesteal, fists. |
| Pyromancer | Light · Fire staff, Lightning staff | **Inferno:** Magic. **Slow burn:** MP regen, Siphon. |
| Frostweaver | Light · Ice staff, Wind staff | **Deep freeze:** Magic. **Wellspring:** MP, MP regen, and max MP with the Glacier staff. |
| Stormcaller | Light · Lightning staff, Wind staff | **Overcharge:** Magic. **Grounded:** HP, resistances, low Aggro. |
| Geomancer | Heavy · Earth staff, Fire staff, axe | **Stone:** heavy armor, Armor. **Quake:** light armor, Magic, a staff. **Axe:** medium armor, Crit chance, Attack. |

The Hexer, Frostweaver and Stormcaller stay thin on purpose: Magic is their best stat almost everywhere, so their choices are staff element and how much survival or MP to buy.

### Party shapes

| Shape | Parties in *Core set: classes* | What a formation offers |
| --- | --- | --- |
| One protector, two dealers | Skirmisher, Swarm, Buffer, Hit counter | One high-Aggro defensive slot; low-Aggro slots behind |
| Two protectors, one carry | Tank buster, Executioner | Two defensive slots that share the hits; one boosted slot |
| All defenders | Anti-heal | Defense across the board, damage down |
| All offense | Damage race, Two states | Offense up, defense down; a fight-start Haste or Might |
| No front line | Summoner | Nothing touches Aggro; small bonuses everywhere |
| Long run | Long grind | MP regen and HP up, damage down |
| Burst | Stalker | Crit up |
| One unit carries | A party of one and two supports | One huge slot, two that only take |
| Built around revives | Executioner, Tank buster | A unit meant to fall, and Might for the rest when it does |

## Weapons

Thirteen plain starters, thirty-three named ordinary pieces that each carry a bundle, and seven powerful pieces that change what a basic attack scales from. Every piece belongs to a kind, and the kind is most of what it is.

### Kinds

The kind sets attack speed, damage type and, for a staff, element, as *Core set: rules and vocabulary* has them; recovery is the same for every weapon. Each kind swings on its own interval, in ticks, and its speed word is the nearest of fast (6.5), medium (8.7) and slow (11.3). Speed and damage trade off: a swing is (base + ratio × stat) × interval ÷ 16, so a fast kind hits for less per swing and a slow kind for more, and every kind deals about the same a tick; a dagger's medium damage is a smaller number than a sword's, and a sword's smaller than an axe's. Low, medium and high base are 350, 700 and 1,200, and low, medium and high ratio 0.1, 0.2 and 0.3 of the stat (step 5g: the base is about half a swing at Attack 4, was a seventh). "Medium" in every table below means medium for the kind. A named piece inherits all of this from its kind and changes only what its row says.

| Kind | Speed (ticks a swing) | Damage | Classes |
| --- | --- | --- | --- |
| Dagger | Fast (5.6) | Piercing | Ranger, Bard, Assassin |
| Fist weapons | Fast (6.0) | Blunt | Monk, Vampire |
| Sword | Medium (8.2) | Slashing | Knight, Bramble knight, Hoplite, Paladin, Valkyrie, Assassin, Vampire |
| Bow | Medium (8.8) | Piercing | Ranger, Bard |
| Spear | Medium (9.4) | Piercing | Hoplite, Valkyrie, Monk |
| Axe | Slow (12.8) | Blunt | Knight, Geomancer |
| Fire staff | Slow (11.6) | Fire | Pyromancer, Geomancer |
| Lightning staff | Fast (7.2) | Lightning | Stormcaller, Pyromancer |
| Wind staff | Fast (6.5) | Wind | Stormcaller, Frostweaver |
| Earth staff | Slow (11.0) | Earth | Geomancer, Bramble knight |
| Ice staff | Fast (6.0) | Ice | Frostweaver, Hexer |
| Light staff | Medium (9.8) | Light | Cleric, Paladin, Valkyrie |
| Dark staff | Fast (6.8) | Dark | Hexer, Vampire |

### Plain weapons — the starters

One per kind: medium damage and ratio, the kind's usual stat (Attack, or Magic for a staff), nothing carried. Each class arrives with the plain weapon of its first kind. All thirteen also drop, as the cheapest ordinary pieces, since axe, Wind staff and Dark staff are nobody's first and several second kinds are another class's first.

### Named weapons — Ordinary

Two to four per kind, 33 pieces. Each row repeats its kind's speed, since that's what a fast kind's smaller hit comes from, and spells out damage and ratio, which are medium for the kind unless the row says otherwise; three rows do, and they're the whole of the set's damage variation.

| Piece | Kind | Damage / ratio | Carries | For |
| --- | --- | --- | --- | --- |
| Fang | Dagger · fast | Medium / medium | Attack +2 | Harrier, Blade, Cutthroat: the plain damage dagger, and the Attack counts twice |
| Stiletto | Dagger · fast | Medium / medium | Accuracy medium, Attack +1 | Harrier; an Assassin against Dodgers |
| Bodkin | Dagger · fast | Medium / medium | Crit chance +1, Crit damage medium | Precision; Marksman on a dagger |
| Paired cestus | Fist weapons · fast | Medium / medium | Double strike medium, Attack +1 | Breaker, where Iron palm Sunders on both strikes; Frenzy |
| Bloodied claws | Fist weapons · fast | Medium / medium | Lifesteal medium, HP +1 | Frenzy, Blood; a Monk that needs to last |
| Tiger claws | Fist weapons · fast | Medium / medium | Evasion medium, Crit chance +1 | Dodge tank; a Monk that wants crits on its Sunder |
| Warden's blade | Sword · medium | Medium / medium | Armor +1, Aggro +1 | Iron wall, Bodyguard, Thornwall, Sword and plate |
| Oathblade | Sword · medium | Medium / medium | HP +2 | Party shield, Blood, Deep roots |
| Duellist's sword | Sword · medium | Medium / medium | Crit chance +1, Attack +1 | Cutthroat, Storm |
| Crusader sword | Sword · medium | Medium / medium | Attack +1, Magic +1 | Sword and plate with Smite still worth casting; Storm with Rally |
| Warbow | Bow · medium | Medium / medium | Attack +2 | Marksman: every arrow scales from Attack, and the bow counts it twice |
| Longbow | Bow · medium | Medium / medium | Crit damage medium, Attack +1 | Marksman |
| Minstrel's bow | Bow · medium | Medium / medium | Magic +1, MP regen +1 | Songs: the Bard plays while it shoots |
| Pike | Spear · medium | High / low | Crit damage medium | Striker: Phalanx doubles the big base. The one spear where the damage matters more than the stat, so a Valkyrie or Monk does better elsewhere. |
| Sentinel spear | Spear · medium | Medium / medium | Aggro +1, Armor +1 | Bodyguard, Dodge tank |
| Skyspear | Spear · medium | Medium / medium | Attack +1, Magic +1 | Storm and Light at once: Gale spear on Attack, Rally on Magic |
| Rune axe | Axe · slow | Medium / medium | Crit chance +1, Attack +1 | The Geomancer's Axe fork, with Bedrock doubling the crits |
| Splitter | Axe · slow | High / low | Armor +1 | Iron wall against armored foes: slow, heavy, and it carries plate. Flavor, since nothing in the Knight's kit rides on its swing. |
| Brand staff | Fire staff · slow | Medium / medium | Magic +2 | Inferno; Quake |
| Ember staff | Fire staff · slow | Medium / medium | MP regen +2 | Slow burn |
| Storm rod | Lightning staff · fast | Medium / medium | Magic +2 | Overcharge; Inferno on the fast staff |
| Grounding rod | Lightning staff · fast | Medium / medium | HP +1, Aggro −1 | Grounded: survives, and draws less |
| Zephyr staff | Wind staff · fast | Medium / medium | Double strike medium, Magic +1 | Deep freeze on a Wind staff: more Wind hits for Bulwark. On a Stormcaller, Arc doesn't fire from the second strike. |
| Tailwind staff | Wind staff · fast | Medium / medium | MP regen +2 | Wellspring; Overcharge over a long dungeon |
| Granite staff | Earth staff · slow | Medium / medium | Armor +1, Magic +1 | Stone: Rockfall and Earthen shell scale from Armor, Tremor and the staff from Magic |
| Rootstaff | Earth staff · slow | Medium / medium | Thorns medium, HP +1 | Thornwall with a staff in hand; Deep roots |
| Rime staff | Ice staff · fast | Medium / medium | Magic +2 | Deep freeze; Frost, where Cold hex's stacks scale from Magic |
| Hoarfrost staff | Ice staff · fast | Medium / medium | MP regen +2 | Wellspring, Endurance |
| Sunstaff | Light staff · medium | Medium / medium | Crit chance +1, Magic +1 | Battle cleric: more Magic for Cure |
| Dawn staff | Light staff · medium | High / medium | Nothing | The basic-attack case for a Light caster. (Under Mercy, until Oct 25, 2026, its damage was a Cleric's healing.) |
| Chapel staff | Light staff · medium | Medium / medium | MP regen +2 | Pilgrim; Staff and robes; Light |
| Nightstaff | Dark staff · fast | Medium / medium | Magic +2 | Frost on the Dark staff |
| Leech staff | Dark staff · fast | Medium / medium | Siphon medium, MP regen +1 | Endurance |

### Powerful weapons

Each keeps its kind's speed and type, at medium damage and ratio, and scales from a stat other than Attack or Magic, carrying nothing: the stat is the point, and a class without it gets a poor weapon, which keeps each one a reward for the classes it's for without naming them. None is an upgrade over a named piece; each is a different build. 7 pieces.

| Piece | Kind | Scales from | For | What it opens |
| --- | --- | --- | --- | --- |
| Heartwood staff | Earth staff · slow | Max HP | Bramble knight | Deep roots gets a damage weapon of its own: Earth hits from the HP the fork stacks, reaching the armored and dodging foes its sword can't. Thornwall keeps the Rootstaff and Bramble lash, so the two Bramble knights stay two. |
| Sanguine staff | Dark staff · fast | Max HP | Vampire | Blood as a caster: Blood drain and basic attacks on one stat, Lifesteal on both. |
| Cornerstone axe | Axe · slow | Armor | Geomancer, Knight | Stone on one stat: Rockfall, Earthen shell and basic attacks all from Armor, with Bedrock doubling the crits. It's an axe and not a sword on purpose: an Armor sword would let the Hoplite double an Armor-5 hit in heavy plate and merge Striker into Bodyguard. |
| Needle | Dagger · fast | Crit chance | Assassin, Ranger | Precision: Backstab and basic attacks share a stat, so every Crit piece raises both. |
| Mist claws | Fist weapons · fast | Evasion | Monk | Dodge tank from a stretch to a build: Evasion is defense and damage. Nothing on a Vampire. |
| Glacier staff | Ice staff · fast | Max MP | Frostweaver, Hexer | Wellspring and Endurance stop being pure upkeep: the MP pool is also damage. Scales from max MP, not current, so casting doesn't shrink it. |
| Templar staff | Light staff · medium | Armor | Paladin | A third Paladin build, staff and plate: heavy armor, Light basic attacks from Armor, Judgement doubling them. |

That covers every source *Core set: classes* points at: max HP for the Earth and Dark staffs, Armor for the axe, Crit chance for the dagger. Evasion and max MP are new, and each has a class that holds the stat high or a fork built on it. Thorns gets no weapon: Thornwall already scales Bramble lash from it and carries it on three pieces.

## Armor

Five heavy, five medium, four light, each a bundle that tells its story, and three powerful pieces that each give something up. For a heavy or medium class the real choice is often whether to step down a weight.

### Ordinary

**Heavy** — Knight, Bramble knight, Hoplite, Paladin, Geomancer

| Piece | Stats | For |
| --- | --- | --- |
| Plate | Armor +1, HP +1 | Iron wall, Bodyguard, Stone, Sword and plate, Deep roots |
| Bastion plate | Armor +2 | Iron wall; Stone, where Rockfall and Earthen shell count it twice |
| Tower mail | HP +2 | Party shield: the Vanguard Shield, Shield bash, the Shield cap and every Regen on the Knight grow. Deep roots. |
| Thorn mail | Thorns medium, Aggro +1 | Thornwall; a Knight or Hoplite that draws many hits |
| Ashen plate | Resists Fire, Armor +1 | Deep roots against the Bramble knight's weakness; any wall against a Fire boss |

**Medium** — Ranger, Valkyrie, Bard, Monk, Assassin, Vampire, and any heavy class

| Piece | Stats | For |
| --- | --- | --- |
| Brigandine | Attack +2 | Marksman, Storm, Blade, Breaker, Cutthroat, Frenzy; a Hoplite Striker or a Paladin that trades plate for it |
| Scout leathers | Evasion medium, Attack +1 | Dodge tank, Precision |
| Tracker's jerkin | Accuracy medium, Crit chance +1 | Harrier, Precision; the Geomancer's Axe fork |
| Scale coat | HP +1, Armor +1 | Blood; a Valkyrie or Bard that has to survive; a Dodge tank against magic, which Evasion can't stop |
| Duskhide | Resists Light, HP +1 | Blood against the Vampire's weakness; anyone facing a Light caster |

**Light** — Cleric, Hexer, Pyromancer, Frostweaver, Stormcaller, and anyone

| Piece | Stats | For |
| --- | --- | --- |
| Robes | Magic +2 | Inferno, Deep freeze, Overcharge, Frost, Battle cleric; Quake, Staff and robes, Light and Songs for the classes that step down |
| Vestments | MP +1, MP regen +1 | Pilgrim, Wellspring, Endurance, Slow burn; a Knight that gives up plate to keep Fortify and Stand fast going all dungeon |
| Shadowsilk | Magic +1, Aggro −1 | Inferno and Overcharge at Aggro 1 on HP 2: less Magic than Robes, fewer hits |
| Quiet cloak | MP regen +1, Aggro −1 | Slow burn, Endurance, Wellspring, Grounded: the caster that lasts the dungeon by being hit less and running dry later |

Robes are the default for a caster, and the other three are what it gives up Magic for: a longer dungeon, fewer hits, or both. HP for a light class comes from its amulet, since Heartstone does what a padded coat would and the light slot has better stories to tell. Plate, Bastion plate and Tower mail are one slot's triangle for a wall.

### Powerful

| Piece | Weight | Stats | For |
| --- | --- | --- | --- |
| Thornheart plate | Heavy | Thorns high, Aggro +2, Armor −1 | A wall of thorns that draws everything and relies on them, so the plate is thinner. Thornwall at full size, or a Knight as a second thorn wall. |
| Wraith leathers | Medium | Evasion high, HP −1 | Dodge tank all in: not getting hit is the only defense left. With Mist claws, the Monk's whole build on one stat. |
| Archmage's robes | Light | Magic +2, MP regen +1, Aggro +1 | Inferno, Deep freeze, Overcharge: more and longer than Robes, and the obvious target for it. |

## Amulets

The one slot every class shares. Amulets carry special stats, HP, MP, MP regen, Crit chance and Aggro, and never Attack, Magic or Armor, so the slot stays distinct from weapon and armor: it's where a class buys a stat its kit multiplies but its armor weight doesn't lean toward.

### Ordinary

| Piece | Stats | For |
| --- | --- | --- |
| Twinned charm | Double strike medium, Crit chance +1 | Breaker, Battle cleric, Harrier; any fast weapon. Weak on the Hoplite, and under Kindling, Cold hex and Arc. |
| Serrated charm | Crit damage medium, Aggro −1 | Marksman, Striker, Precision, the Geomancer: the burst dealer that stays out of sight |
| Bloodstone | Lifesteal medium, HP +1 | Frenzy; fast hitters |
| Mana leech | Siphon medium, MP regen +1 | Endurance, Slow burn |
| Thorn charm | Thorns medium, Aggro +1 | Thornwall; any unit that draws hits |
| Hawk's eye | Accuracy medium, Crit chance +1 | Harrier; any physical unit against Dodgers |
| Feather charm | Evasion medium, Aggro −1 | Precision; a Monk that slips hits and draws few |
| Prayer beads | MP regen +2 | Pilgrim, Party shield, Slow burn, Wellspring, Endurance; the low-MP defenders |
| Mana jewel | MP +2 | Pilgrim, Wellspring; the Glacier staff. The pool for the costly casts (Raise, Smite, Valhalla), where Prayer beads are for the long run. |
| Heartstone | HP +2 | Blood, Party shield, Grounded; feeds Regen and the Shield cap on anyone |
| Lucky coin | Crit chance +2 | Precision, Battle cleric; the Geomancer under Bedrock |
| Warhorn | Aggro +2 | Bodyguard, Thornwall, Dodge tank; a Knight that must hold a boss between its Taunts |
| Veil | Aggro −2 | Inferno, Overcharge, Precision: the fragile unit steps out of the line |
| Sun charm | Resists Fire, Lightning and Light | The Bramble knight's and the Vampire's weaknesses in one; against bright casters |
| Moon charm | Resists Ice, Dark and Wind | Against cold and night |
| Mountain charm | Resists Earth, Fire and Ice | Against the ground's elements; Fire and Ice are covered twice, since those are the elements foes bring most |

### Powerful

Bundles, not bigger numbers: none is a superset of an ordinary charm.

| Piece | Stats | For |
| --- | --- | --- |
| Twin-soul charm | Double strike medium, Lifesteal medium | Breaker, Frenzy, Harrier: hits twice and drains on both |
| Vampire's tooth | Lifesteal high, HP −1 | Any fast hitter as a drain build, living by the drain. On the Vampire itself it stacks past high, and Bloodlust doubles it. |
| Thirsting jewel | Siphon high, MP regen −1 | Slow burn and Endurance as a Mana thief: every hit refills what the regen no longer does |
| Glass heart | Crit chance +2, Crit damage medium, HP −1 | Precision, Marksman, Striker, the Geomancer's Axe fork: the crit build in one piece, at the cost of the HP a crit build never has to spare |

## Formations

The neutral formation plus nine, each telling a party's story, with no budget between slots. Some slots are plain bonuses, some are a bonus bought with a penalty, two only take, and the magnitudes differ on purpose: Vanguard is small and costs nothing, Champion and Tortoise swing hard, and the four with an effect carry part of their power there, so their slots are smaller. Every slot says one thing: a unit in it is sturdier or squishier, hits harder or softer, draws more or less, never two of those pulling against each other. "Attack +1, Magic +1" raises both, so one slot serves a physical or a magical unit alike. Effects are flat, every ally on a trigger, and no effect gives Taunt.

**Weight.** A full slot here is worth about one gear piece, so a formation adds roughly a fourth slot to every unit: more on a cursed slot, less on a small one. Whether that's enough to make the formation a decision rather than an afterthought is for the sim. If it isn't, the fix is a bigger step on every slot, not more slots. (The sim said it wasn't, Oct 27, 2026: probed on the same parties, the five formations with no effect sat within 3 points of Neutral while the effects were worth 7 to 20. A slot's step became one and a half gear steps and the effects were trimmed: step 5e. With 5f's longer fights the slot formations ran +10 against Neutral, so the step is one and a quarter.)

### Neutral — the start

Three slots that do nothing, no effect.

### Vanguard — a wall with two behind it

For Skirmisher, Swarm, Buffer, Hit counter, and the starting trio, so it's the natural first unlock.

| Slot | Changes |
| --- | --- |
| Wall | Aggro +2, Armor +1 |
| Behind (two of these) | Aggro −1 |

**Effect:** none.

Small, and it costs nothing. The Knight on the Wall, the Cleric and Ranger behind it: the first formation says only who gets hit.

### Champion — all in on one hero

| Slot | Changes |
| --- | --- |
| Champion | HP +2, Armor +2, Attack +2, Magic +2 |
| Retainer (two of these) | Attack −1, Magic −1 (−2 until step 5g) |

**Effect:** none.

One unit carries the fight and the other two only take, so it's for a party whose other two are support anyway. The cheapest seats are the Retainers, and they suit units whose value isn't in Attack or Magic: a Knight, whose Vanguard Shield and Shield bash scale from max HP; a Bramble knight, whose Thorns don't care; a Hexer, Bard or Paladin, whose Silence, Weaken, Haste, Slow and Ward are fixed in size.

### Ambush — one draws the eye, two strike

For Stalker, and burst in general.

| Slot | Changes |
| --- | --- |
| Bait | Aggro +2 |
| Knife | Crit chance +2, HP −1 |
| Blade | Crit chance +1 |

**Effect:** none.

The two striking seats are tiered: the Knife gives more and costs HP, so it suits a unit that's hard to reach, like an Assassin that goes Hidden or anything already at low Aggro. Against a Stalker, which hunts the lowest HP, the Knife is the trap, so that's the seat for the sturdier striker.

### Tortoise — nobody falls, but fights run long

For Anti-heal.

| Slot | Changes |
| --- | --- |
| Shell | Armor +2 |
| Heart | HP +2 |
| Tucked in | Attack −1, Magic −1 (−2 until step 5g) |

**Effect:** none.

Two ways to be hard to hurt and one seat that hits softer. Tucked in is for the unit whose value isn't damage, as with Champion's Retainers: under Anti-heal, a Paladin's Ward and Cleanse keep working there while its Smite wouldn't have won the fight.

### Scatter — dodge, don't block

For Brute, Tank buster, and any fight of a few big physical swings.

| Slot | Changes |
| --- | --- |
| Decoy | Evasion medium, Aggro +2, Armor −1 (−2 until the campaign pass: the Decoy lost more to Armor than it gained in Evasion, and Scatter lost on every node) |
| Runner (two of these) | Aggro −1 |

**Effect:** none.

Everything goes to the Decoy, and the Decoy dodges it: a Monk there becomes a dodge tank, and a Knight trades its plate for a chance to be missed. Evasion beats a Brute's few big swings, Armor beats many small hits, and neither helps against magic. The Runners just keep out of the way.

### Blitz — win before they hit back

For Damage race, Two states, and a party of three dealers.

| Slot | Changes |
| --- | --- |
| Every slot | Attack +1, Magic +1, HP −1 |

**Effect:** when the fight starts, every ally gains Haste.

The one formation where every slot is the same: the whole party goes all in, and the Haste reaches everyone anyway. It's also the no-front-line formation, since nothing in it touches Aggro and hits fall by the party's own numbers.

### Caravan — pace yourselves for the whole dungeon

For Long grind.

| Slot | Changes |
| --- | --- |
| Quartermaster | MP regen +1, Attack −1, Magic −1 (−2 until step 5g) |
| Traveller (two of these) | HP +1 |

**Effect:** when the fight starts, every ally gains a short Regen (6 ticks of the status's 24, steps 5e and 5f: the full Regen on every ally at every fight's start was worth two Clerics, and the same parties won 20 points more in Caravan than in Neutral).

The Quartermaster gives up some of its hitting to keep its own MP flowing, so it's for a unit whose costly abilities don't scale from Attack or Magic: a Cleric saving for Renew and Raise. A Regen at the start of every fight is real healing in a dungeon that never heals between fights.

### Last stand — the fallen spur the rest on

For Executioner, Tank buster, and any party built around revives.

| Slot | Changes |
| --- | --- |
| Martyr | Aggro +2, HP −1 (−2 until Oct 27, 2026, step 5f) |
| Other (two of these) | Nothing |

**Effect:** when an ally is knocked out, every ally gains Might (several stacks).

Each knockout gives the party Might, so a Cleric or Valkyrie that brings the Martyr back sets up the next one, and a Knight's Stand fast keeps the foes on it meanwhile (its Sworn, a Taunt on the same knockout, until Oct 27, 2026). A sturdy Martyr like the Bramble knight holds out; a fragile one falls early and starts the Might sooner. Either is a plan.

### Escort — two protectors, one carry

For Tank buster, Executioner.

| Slot | Changes |
| --- | --- |
| Escort (two of these) | Aggro +1 (Armor +1 and HP +1 until the campaign and step 5e took them: with every slot a plain bonus and an effect on top, the same parties won 11 points more in it than in Neutral) |
| Charge | Aggro −2, Attack +1, Magic +1, Crit chance +1 |

**Effect:** when an ally is knocked out, every other ally gains Shield; the amount scales from its max HP, as the Knight's Vanguard Shield does (0.12 of it, step 5e).

Moderate slots with nothing taken away: the carry is protected, not stretched. Where Last stand plans for the knockout, Escort insures against it: the Shield is for the fight where a protector falls anyway, so the Charge lives to finish it.

### Shapes to formations

| Shape | Formation | Slots | Effect |
| --- | --- | --- | --- |
| One protector, two dealers | Vanguard | Small, no curses | None |
| One protector, two dealers; burst | Ambush | Small, one cursed | None |
| One protector, two dealers | Scatter | One cursed, two small | None |
| Two protectors, one carry | Escort | Moderate, no curses | Shield on every other ally when one falls |
| All defenders | Tortoise | Big, one that only takes | None |
| All offense; no front line | Blitz | Identical, all cursed | Haste on every ally at start |
| Long run | Caravan | One trade, two small | Regen on every ally at start |
| One unit carries | Champion | One huge, two that only take | None |
| Built around revives | Last stand | One cursed, two empty | Might on every ally when one falls |

## Coverage check

Every fork has pieces in at least two slots, every stat in the build-axes table has at least two ordinary pieces, every party shape has a formation, and the traps are deliberate.

### Every fork has pieces

Ordinary pieces first; powerful ones after a semicolon.

| Class | Fork | Weapon | Armor | Amulet |
| --- | --- | --- | --- | --- |
| Knight | Party shield | Oathblade | Tower mail, Vestments | Heartstone, Prayer beads |
| Knight | Iron wall | Warden's blade, Splitter; Cornerstone axe | Plate, Bastion plate, Ashen plate | Warhorn |
| Cleric | Battle cleric | Sunstaff, Dawn staff | Robes | Lucky coin, Twinned charm; Twin-soul charm |
| Cleric | Pilgrim | Chapel staff | Vestments | Prayer beads, Mana jewel |
| Ranger | Marksman | Warbow, Longbow | Brigandine | Serrated charm; Glass heart |
| Ranger | Harrier | Fang, Stiletto; Needle | Tracker's jerkin | Hawk's eye, Twinned charm |
| Bramble knight | Thornwall | Rootstaff | Thorn mail; Thornheart plate | Thorn charm, Warhorn |
| Bramble knight | Deep roots | Warden's blade, Oathblade; Heartwood staff | Plate, Tower mail, Ashen plate | Heartstone, Sun charm |
| Hoplite | Striker | Pike | Brigandine | Serrated charm; Glass heart |
| Hoplite | Bodyguard | Sentinel spear, Warden's blade | Plate, Bastion plate, Thorn mail | Warhorn, Heartstone |
| Paladin | Sword and plate | Warden's blade, Crusader sword | Plate, Brigandine | Warhorn |
| Paladin | Staff and robes | Chapel staff, Sunstaff | Robes, Vestments | Prayer beads, Mana jewel |
| Paladin | Staff and plate (new) | Templar staff | Plate, Bastion plate | Heartstone |
| Valkyrie | Storm | Duellist's sword, Skyspear | Brigandine | Serrated charm, Mana jewel |
| Valkyrie | Light | Chapel staff, Sunstaff | Robes | Prayer beads |
| Bard | Songs | Minstrel's bow | Robes, Shadowsilk | Prayer beads |
| Bard | Blade | Fang, Stiletto | Brigandine | Twinned charm |
| Hexer | Frost | Rime staff, Nightstaff | Robes, Shadowsilk | Veil, Heartstone |
| Hexer | Endurance | Leech staff, Hoarfrost staff; Glacier staff | Vestments, Quiet cloak | Mana leech, Prayer beads; Thirsting jewel |
| Monk | Breaker | Paired cestus | Brigandine | Twinned charm; Twin-soul charm |
| Monk | Dodge tank | Tiger claws, Sentinel spear; Mist claws | Scout leathers; Wraith leathers | Warhorn, Feather charm |
| Assassin | Precision | Bodkin; Needle | Tracker's jerkin | Lucky coin, Serrated charm; Glass heart |
| Assassin | Cutthroat | Duellist's sword, Fang | Brigandine, Scout leathers | Bloodstone; Vampire's tooth |
| Vampire | Blood | Oathblade, Bloodied claws; Sanguine staff | Scale coat, Duskhide | Heartstone, Sun charm |
| Vampire | Frenzy | Paired cestus, Bloodied claws | Brigandine | Bloodstone; Twin-soul charm |
| Pyromancer | Inferno | Brand staff, Storm rod | Robes, Shadowsilk; Archmage's robes | Veil, Heartstone |
| Pyromancer | Slow burn | Ember staff | Vestments, Quiet cloak | Mana leech, Prayer beads; Thirsting jewel |
| Frostweaver | Deep freeze | Rime staff, Zephyr staff | Robes; Archmage's robes | Twinned charm on the Wind staff; Twin-soul charm |
| Frostweaver | Wellspring | Hoarfrost staff, Tailwind staff; Glacier staff | Vestments | Mana jewel, Prayer beads |
| Stormcaller | Overcharge | Storm rod | Robes, Shadowsilk; Archmage's robes | Veil |
| Stormcaller | Grounded | Grounding rod, Tailwind staff | Quiet cloak, Shadowsilk | Heartstone, Veil |
| Geomancer | Stone | Granite staff; Cornerstone axe | Plate, Bastion plate | Lucky coin |
| Geomancer | Quake | Brand staff | Robes; Archmage's robes | Lucky coin |
| Geomancer | Axe | Rune axe | Tracker's jerkin | Lucky coin, Serrated charm; Glass heart |

The thin spots stay thin on purpose: the Hexer's Frost and the Stormcaller's Overcharge are a Magic +2 staff, Robes or Shadowsilk, and whatever survival the amulet buys.

### Every stat has a home

| Stat | Ordinary pieces | Powerful pieces | Formation slots |
| --- | --- | --- | --- |
| Max HP | Oathblade, Bloodied claws, Rootstaff, Grounding rod, Plate, Tower mail, Scale coat, Duskhide, Heartstone | Thornheart plate; Heartwood and Sanguine staffs as damage | Champion, Ambush, Tortoise, Blitz, Caravan, Last stand, Escort |
| MP, MP regen | Minstrel's bow, Ember, Tailwind, Hoarfrost, Chapel and Leech staffs, Vestments, Quiet cloak, Prayer beads, Mana jewel | Glacier staff as damage, Archmage's robes | Caravan |
| Attack | Fang, Stiletto, Paired cestus, Duellist's sword, Crusader sword, Warbow, Longbow, Skyspear, Rune axe, Brigandine, Scout leathers | – | Champion, Tortoise, Blitz, Caravan, Escort |
| Magic | Crusader sword, Minstrel's bow, Skyspear, Brand staff, Storm rod, Zephyr, Granite, Rime and Nightstaff, Sunstaff, Robes, Shadowsilk | Archmage's robes | Champion, Tortoise, Blitz, Caravan, Escort |
| Armor | Warden's blade, Sentinel spear, Splitter, Granite staff, Plate, Bastion plate, Ashen plate, Scale coat | Cornerstone axe and Templar staff as damage | Vanguard, Champion, Tortoise, Scatter, Escort |
| Resistances | Ashen plate, Duskhide, the three elemental charms | – | – |
| Crit chance | Bodkin, Tiger claws, Duellist's sword, Rune axe, Sunstaff, Tracker's jerkin, Twinned charm, Hawk's eye, Lucky coin | Needle as damage, Glass heart | Ambush, Escort |
| Aggro, up | Warden's blade, Sentinel spear, Thorn mail, Thorn charm, Warhorn | Thornheart plate, Archmage's robes as its cost | Vanguard, Ambush, Scatter, Last stand, Escort |
| Aggro, down | Grounding rod, Shadowsilk, Quiet cloak, Serrated charm, Feather charm, Veil | – | Vanguard, Scatter, Escort |
| Evasion | Tiger claws, Scout leathers, Feather charm | Mist claws as damage, Wraith leathers | Scatter |
| Accuracy | Stiletto, Tracker's jerkin, Hawk's eye | – | – |
| Crit damage | Bodkin, Longbow, Pike, Serrated charm | Glass heart | – |
| Double strike | Paired cestus, Zephyr staff, Twinned charm | Twin-soul charm | – |
| Thorns | Rootstaff, Thorn mail, Thorn charm | Thornheart plate | – |
| Lifesteal | Bloodied claws, Bloodstone | Twin-soul charm, Vampire's tooth | – |
| Siphon | Leech staff, Mana leech | Thirsting jewel | – |

Special stats sit on gear. The one slot that carries one is Scatter's Decoy, where the special stat is the formation's whole story.

### Builds beyond the forks

Pieces that combine into builds the build axes didn't name.

- **Thorn Knight:** Thorn mail and Thorn charm on Aggro 5, or Thornheart plate, so most hits on the party cost their attacker. Vanguard's Wall or Last stand's Martyr feeds it.
- **All-Armor Geomancer:** with the Cornerstone axe, its Shields, Rockfall and basic attacks all scale from Armor, and Bastion plate counts three times.
- **Hybrid Paladin or Valkyrie:** Crusader sword or Skyspear feeds both their physical hits and Smite or Rally.
- **Crit Ranger:** Needle, Tracker's jerkin and Glass heart make a third Ranger build.
- **Drain Monk:** Vampire's tooth, Bloodied claws and Paired cestus, a Monk that lives by Lifesteal and hits twice for it.
- **Dodge wall:** Mist claws, Wraith leathers and Scatter's Decoy on the Monk, the whole build on one stat.

### Traps, on purpose

Each is a piece that reads as an upgrade and isn't, for a class whose kit a player can learn from it.

- Double strike on the Hoplite: the second strike isn't doubled. Under Kindling, Cold hex and Arc it adds damage but no stacks and no second foe.
- The Pike, Splitter and Dawn staff on a class whose kit doesn't ride on its basic attacks: a Valkyrie with a Pike gives up the stat her abilities wanted.
- A powerful weapon on a class without its stat: Mist claws on a Vampire, Sanguine staff on a Hexer, Needle on a Bard, Heartwood staff on a Geomancer at HP 3.
- Thorns with Evasion: a dodged hit never lands, so Thorns never fires. Scatter's Decoy and Thorn mail work against each other, and so do Tiger claws and the Rootstaff on one unit.
- Ambush's Knife on the Stalker's prey, every Blitz slot on a unit at HP 2, and Last stand's Martyr in a party with no revive.
- Thornheart plate on a unit nothing attacks: Thorns high, Aggro +2 and thinner plate are all for the unit that gets hit.

A heavy class in Robes or Brigandine is a trade, not a trap: that's the armor-weight rule doing the work costs would have done.

## What to watch in simulation

- **HP stacking.** Tower mail, Scale coat and Heartstone on a whole party feed Renew's and Caravan's Regen and every Shield cap at once. It may be the strongest generic build; if so, Regen's share comes down before HP gear does.
- **Aggro stacking.** Shadowsilk or Quiet cloak, Veil and a Behind or Runner slot push a mage's Aggro to the bottom. Check that two such units don't just split hits evenly when the player meant one to hide, and that a Wall or Decoy still draws enough with no Taunt. (The draw rule, Oct 26, 2026, answers the bottom: no unit draws less than a third of an ordinary unit.)
- **Off-stat weapons at medium damage and ratio.** Whether Cornerstone axe on Armor 5 lands near a Fang on Attack 5. They should; the build is the reward, not the number.
- **The basic-attack weapons.** Pike under Phalanx (Dawn staff's case, under Mercy, is gone). If they're the obvious pick for those classes every time they're too good; if nobody takes them, cut the variation.
- **High special stats on the class that already holds them.** Thornheart plate on the Bramble knight, Vampire's tooth under Bloodlust, Wraith leathers on the Monk. Check whether stacking past high needs a ceiling, which would be the first cap this set asks for.
- **Resistance.** Whether it does anything at the class level. If the three charms are never worn, resistance needs a bigger step before it needs more pieces.
- **The two knockout effects.** Escort's Shield, scaled from max HP, may be wasted on a Knight already at the Shield cap, and Last stand's Might may fade before a Raise brings the Martyr back to use it.
- **Formation weight.** Whether a slot at about one gear piece makes a formation a decision, and whether the five with no effect read as formations beside the four with one. Vanguard is the smallest on purpose; if it's never picked after the second unlock, that's fine.
- **Champion.** Whether a party of one and two supports is a real party.
- **Scatter.** Evasion medium on the Decoy against a boss with magical hits: the formation has no answer there, and shouldn't.

## Next

The numbers: a first value for every step in the scale in *Core set: classes*, then the balance pass by simulation.
