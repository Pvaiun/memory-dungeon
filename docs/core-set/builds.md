# Core set: builds

The twelve builds the gear, formations, upgrades and mythics were designed backwards from. A build is a way to play you can watch: someone watching a fight can tell which build is playing and what it's waiting for. It has a rhythm, and it's woven from several threads, never one keyword turned up (`docs/rules.md`). Each build has three routes (trios of classes that carry it) at three rungs, as hand-built test parties in `src/build-parties.ts`; `npx tsx src/build-test.ts` plays them side by side. Which builds each piece serves is designer data, `PIECE_BUILDS` in `content/core-set/pieces/index.ts`, and never reaches a card.

## The rhythm space

A rhythm is how a fight unfolds over time, read four ways:
- **Damage:** where the party's damage falls in a fight: at the start, evenly, rising, in bursts, all at the end, or following the foe.
- **Danger:** where the party is most at risk.
- **Turns:** how often the fight visibly changes, and how big each change is.
- **What it spends:** HP or MP, within a fight. This is never how many fights it lasts: every run has the same fights, so a build that lasted longer would simply be better. It's which fuel the build burns, which decides its gear and whether it reaches for a potion or a tonic. Power follows fuel: a build that spends little has to do less with it.

| Build | Damage over a fight | Danger | Turns | What it spends |
| --- | --- | --- | --- | --- |
| **Landslide** | a few huge blows at uneven moments | steady, soaked by stone; spikes when it breaks | few, big | MP, on stone that saves its HP |
| **Thousand Cuts** | a dense, even stream from the first tick | even; dodges decide it | none | HP: little casting, light bodies |
| **Bonfire** | rises the whole fight; each kill comes sooner than the last | early | one, slow: the catch | MP, on the casts that feed the fire |
| **Cold Snap** | bursts on a beat you can count | falls with each burst | many, medium | both, evenly |
| **The Hunt** | a staircase: a kill every few ticks | early, falling with each kill | regular, medium | both: HP early, MP on reach |
| **Harvest** | nothing, then everything | full until the end | one, huge, late | MP on the sweeps; HP holding the full field |
| **Ambush** | a spike at the start, then a thin tail | late, if the spike doesn't finish it | one, at the first tick | HP, in the exposed tail |
| **Overflow** | in waves passing round the party, almost all casts | a cliff when the mana stops | many, small | MP, passed round the party |
| **Lockdown** | in windows while a foe is disabled | held down; spikes when a lock slips | many: each lock and each window | MP on the locks, to save HP |
| **The Toll** | follows how much the foes attack | all on one unit | few | HP: the anchor's |
| **Blood Pact** | high and steady | swings and rights itself | many, medium | HP, in place of MP |
| **Phoenix** | surges after each fall | embraced, swingy | irregular and big: the deaths | HP on the falls, MP on the returns |

The twelve come in pairs from opposite sides of the space:
- **Landslide and Thousand Cuts:** few huge blows, or many tiny ones.
- **Bonfire and Cold Snap:** a smooth climb, or bursts on a beat.
- **The Hunt and Harvest:** one at a time, or all at once.
- **Ambush and Overflow:** everything at the start, or work that rolls on round the party.
- **Lockdown and the Toll:** deny the foe its moment, or invite every blow.
- **Blood Pact and Phoenix:** life spent and bought back, or death spent and bought back.

Each build below gives its identity (what a watcher sees and what it's waiting for), what it loves and fears among the rogue's fights, its threads, the classes of its three routes, and its three rungs: what it asks of a run and what each pays.

## Landslide

**Identity.** A party in stone that swings rarely and hits like a falling hill. The front wears Shield bars, and foes chip at the stone. Long stretches pass with small numbers. Then a slow swing or a long cast lands far bigger than anything else, and an elite loses a large share of its HP. The stone is rebuilt, and it happens again. It's waiting for its big blow to come round, with the stone holding until then. Fights run long.

- **Loves:** bosses and armored foes (big hits lose little to Armor, and crits land before it), and Lava Slimes (one blow takes a slime from above half to nothing, so it never splits).
- **Fears:** swarms (blows wasted on wolves), dodgers (a missed blow is a long wait wasted), and anything that breaks Shields fast.
- **Threads:**
  - the Shield as a second health bar, and the moment it breaks;
  - Armor as a damage stat;
  - slow, heavy actions;
  - Might on the slowest hitter, since it's spent one stack per action;
  - crits and crit damage;
  - weight: the biggest blows stagger;
  - max HP feeding the stone and the blow.
- **Routes:** Geomancer, Knight, Hoplite · Geomancer on a great weapon, Paladin, Cleric · no earth at all: Knight on a great weapon, Hoplite, Bard.
- **Rungs:**
  1. Any slow weapon and one Shield source: steadier boss fights, and Armor that stops mattering.
  2. Pieces that turn a Shield or Armor into hit size, Guard that reaches the Armor-scalers, Might for the hammer. Elites lose chunks, and most bosses take three or four blows.
  3. The stone itself becomes the weapon. A boss fight is a handful of blows the party lives through comfortably.
- **Watch:** the quiet between blows may read as nothing happening; the stone bars have to be what you watch.

## Thousand Cuts

**Identity.** A blur. A stream of tiny numbers, several a tick. Units act constantly, and foes' Bleed counters open with every hit. The party is hard to hit: MISS, MISS. It isn't waiting for anything; it never stops. Most of its damage is basic attacks, and the light bodies pay when the dodges fail.

- **Loves:** Bleed, and Lifesteal, since many hits heal many times.
- **Fears:** Armor (small hits lose most to it), the Ice Golems' crust, Wisps' Shock (fast units pay), and the Lava Slimes' split.
- **Threads:**
  - speed: fast weapons and Haste;
  - many hits: Double strike, multi-hit abilities, extra strikes;
  - Bleed bursting on each hit;
  - riders on every hit, extra strikes included;
  - Evasion as defence, and the dodge as a trigger;
  - Lifesteal on every hit;
  - the magical torrent: fast magic slips past Armor but meets Magic resist, the same rhythm with another answer to Armor.
- **Routes:** Bard, Monk, Assassin · Valkyrie, Ranger, Vampire · the magical torrent: Stormcaller and Pyromancer on wands, Hexer on a dagger.
- **Rungs:**
  1. Fast weapons and a little Double strike: steady chip, and little else.
  2. Riders on every hit, extra strikes included, and a Bleed source. Every hit opens a wound, and armored foes stop being walls.
  3. A payoff that grows with how many hits the party has landed this fight. Late in a fight, every tiny hit is worth a big one.

## Bonfire

**Identity.** A fire that grows hotter the longer it burns. Burn climbs on the hottest foe, a bigger number every pulse. When that foe falls, its fire passes to the next, which starts already burning, so each kill comes sooner than the last. The party heats up too: the longer the fight, the harder it hits. Early on, the foes press hard and the party holds. By the end, they fall one after another, faster and faster. It's waiting for the fire to catch.

- **Loves:** long fights, packs (each death feeds the next), and bosses with helpers (the helpers' fire passes to the boss).
- **Fears:** fights too short for the fire to catch, and losing its feeders early.
- Unlike Cold Snap, its curve has no beat of bursts; unlike Landslide, no single blow matters.
- **Threads:**
  - Burn on the hottest foe, which drains and needs upkeep;
  - fire that passes on, from a dying foe to the next;
  - Heat that builds in the party, power that grows over a fight where Might is spent;
  - long wind-ups and big casts, with the danger that a cast is lost;
  - a keeper who holds the early fight (Taunt, Shield, Guard, Aegis);
  - Haste on the stokers.
- **Routes:** Knight, Pyromancer, Hexer · no mage: Paladin, Bard, Monk · Hoplite, Pyromancer on a wand, Cleric.
- **Rungs:**
  1. Any Burn source (four classes have one): steady damage over long fights.
  2. Fire that passes from a dying foe, Burn on a fast unit's basic attacks, and a keeper. Each kill comes sooner than the last.
  3. The party's own heat, and a Pyre on a fire passed down the line. The catch comes early, and the last foes fall in a rush.

## Cold Snap

**Identity.** Frost creeps up foes until they burst. Chill counters climb on every foe, and the foes visibly slow. Then a SHATTER: a burst of damage and a Stun on one foe, then another, like a string of firecrackers. It's waiting for the next foe to reach the cap. It's the director's Monk-and-Bard run, as a way to play. Damage between bursts is modest, and the danger falls through the fight, since every burst stuns and Chill slows everyone.

- **Loves:** packs and elites.
- **Fears:** fights too short to reach the cap.
- **Threads:**
  - Chill to its cap and the shatter (anyone's Chill pays);
  - many small applications: basic attacks carrying Chill, fast weapons, multi-hits;
  - the Stun every shatter brings, and what the party does to a stunned foe;
  - Sunder after a shatter (Shatterpoint);
  - a heavy blow on a frozen foe;
  - staggering the bursts across a pack, or stacking them on one foe, which targeting decides.
- **Routes:** Frostweaver, Hexer, Ranger · the Frostweaver between a Monk and a Bard carrying Chill on their weapons · no Frostweaver: Geomancer, Monk, Hexer.
- **Rungs:**
  1. A Frostweaver, or one Chill piece on any fast unit: a shatter or two a fight.
  2. Chill on two units' basic attacks, and a payoff for hitting a stunned foe. Shatters every few ticks, across a pack.
  3. A shatter that seeds the next: chain shatters through a pack.

## The Hunt

**Identity.** The pack singles one out. Every hit in the party goes to the same foe, often one in the back; it falls, and the next is marked. The number of foes drops one by one on a steady beat. It's waiting for the next kill. Harvest's opposite.

- **Loves:** mixed groups with a dangerous back row (Archers, Liches, Bone Priests, Witches).
- **Fears:** a lone boss (one step, no staircase), Ghouls raised behind the hunt, and Taunting fronts if it has no reach.
- **Threads:**
  - focus: the party's picks agreeing (Marked);
  - reach: Seek past a Taunting front;
  - the weakest and the furthest back;
  - a reward on each kill, so each step speeds the next;
  - Silence on the back row's casters;
  - an answer for bosses: damage that grows as the foe's HP falls.
- **Routes:** Valkyrie, Ranger, Assassin · Assassin, Monk, Hoplite · Ranger, Stormcaller, Paladin.
- **Rungs:**
  1. Any Seek ability, or the Ranger: the back row dies first.
  2. Basic attacks that follow the marker, and a reward on each kill. Every kill speeds the next.
  3. The whole party on one foe, and a kill that resets the hunt. Mixed groups fall in a drumbeat.

## Harvest

**Identity.** The whole field falls together. Hits land on every foe at once, and nobody dies for a long time. All the HP bars sink in step. Then, in a few ticks, the field is empty. It's waiting for the sweep that finishes them all. The danger stays full until the end, every foe alive and acting, so the party has to hold the whole field's pressure.

- **Loves:** swarms and summons, and Ghouls, which can't raise each other if they fall together.
- **Fears:** Bomb Bugs (every blast at once), Lava Slimes (an even field sends every slime below half, so every one splits), and a lone boss, where spread damage is no different from single.
- **Threads:**
  - Area;
  - spread: strikes that jump (Arc, Chain lightning), with or without Shock;
  - evening out: aiming at the healthiest foe so the field sinks together;
  - a physical sweep: a blow that carries through to a second foe;
  - the draw: one unit takes the field's attention so the others can spread;
  - a finisher that ends every foe below a line at once.
- **Routes:** Bramble knight, Stormcaller, Bard · Paladin, Pyromancer, Frostweaver · physical: Knight, Valkyrie, Hoplite.
- **Rungs:**
  1. Any Area mage: swarms die faster.
  2. Strikes that jump or sweep on units that aren't mages, and the evening-out targeting. The field falls together.
  3. A finisher, and a sweep for physical units. Swarms are erased in a beat, and Ghouls are beaten clean.

## Ambush

**Identity.** The opening volley. The fight starts, and the party's first moments land at once: a blade from hiding, a first swing that lands like three, Haste on everyone. The fragile back of the foes' line is gone before it acts. Then a short scramble against what's left. It's waiting for the next fight to begin. The volley comes from what happens when a fight starts, not from abilities, so it spends few cooldowns and little MP; it pays in HP in the exposed tail, and in slots. A run that rotates its members won't play it every fight, which makes it hard to reach.

- **Loves:** regular fights with fragile back rows (Archers, Liches, Wisps).
- **Fears:** long boss fights, Taunting fronts that catch the volley, and big lone foes with no back row.
- **Threads:**
  - the fight's start, a trigger that doesn't care about cooldowns;
  - Hidden: unseen at the start, and hitting harder while unseen;
  - the first swing landing bigger, and Might given at the start and spent by the first blow;
  - Haste and Shields at the start;
  - slot order: which ability goes first;
  - carried cooldowns: an ability saved from the last fight joins the volley.
- **Routes:** Assassin, Ranger, Geomancer · Monk, Bard, Bramble knight · Assassin, Cleric, Valkyrie.
- **Rungs:**
  1. The slot order and any start-of-fight piece: quicker first ticks.
  2. A first swing that lands bigger, and Hidden and Haste at the start. The back row is gone before it acts.
  3. An opening that clears most regular fights on its own. Bosses still need the tail.
- **Watch:** the tail. A spent volley may still be all or nothing.

## Overflow

**Identity.** A party that never stops casting. Spell names scroll one after another, and basic attacks are rare. Mana passes from ally to ally, and the casting moves with it: one member flares, cast after cast, while the others gather; then the next. Each cast leaves the next caster a little more. It's waiting for the mana to reach the next caster, and those small moments are the payoff. The danger is a cliff: a Silence, a mana drain or an empty pool turns the party into staff-bonkers.

- **Loves:** regular fights it can finish while the mana lasts.
- **Fears:** Silence (the Wraiths, the Silent One), Leeches, and long boss fights.
- Unlike Thousand Cuts, where every unit acts all the time and nothing passes between them, here the work moves from one member to the next, and you can watch it go.
- **Threads:**
  - MP that flows (Clarity, Refrain, Stand fast, Stillness, Blood gift);
  - casting as a trigger;
  - costs that change;
  - cooldowns shortened or refunded;
  - Haste on casters;
  - "the ally with the least MP" as targeting;
  - mana as a damage stat.
- **Routes:** Bard, Frostweaver, Hexer · Knight, Pyromancer, Cleric · Vampire, Stormcaller, Bard.
- **Rungs:**
  1. MP regen gear, and a Clarity giver: the casters last another fight.
  2. Casts that give the next caster something (mana, a shorter cooldown). The party casts all fight.
  3. Mana as damage, and costs that fall as the party casts. A party that ends fights with more mana than it started with.
- **Watch:** it leans on the engine most. If a link reads as bookkeeping in the fight log, it fails.

## Lockdown

**Identity.** Hold them, then hit them. A foe's wind-up bar is struck down, or a Weaken lands. The moment a foe is disabled, the whole party piles in, and the numbers on a stunned, silenced, frozen or weakened foe come out bigger than anywhere else in the fight. Then the foe breaks free, and the party waits for the next opening. It's about capitalizing on disabled foes, not a permanent lock: bosses' control resistance makes a lock a window, not the whole fight. The Toll's opposite.

- **Loves:** bosses and elites with big casts (the Fire Giant, Liches, the Silent One, the Ogre Chief's Crush).
- **Fears:** swarms (too many to lock), and the enrage, which catches long fights.
- **Threads:**
  - piling onto the disabled: hits on a foe that's stunned, silenced, frozen, slowed or weakened;
  - Weaken: what does land, lands small;
  - interrupts: Silence loses a wind-up, Stun pauses it;
  - waiting for a wind-up;
  - a slow instead of a shatter;
  - heavy blows that stagger;
  - cooldowns: locks have to come round as often as the boss winds up;
  - MP for the locks: Clarity and Siphon.
- **Routes:** Monk, Knight, Hexer · Assassin, Geomancer, Frostweaver · the patient version: Paladin, Cleric, Hexer.
- **Rungs:**
  1. Any one Stun or Silence: a boss's big move is sometimes stopped.
  2. Locks that wait for a wind-up instead of firing at random, and a second lock on another clock. Big moves are stopped most of the time.
  3. Hits that land hardest on a disabled foe, and locks that come round with every opening. Each window takes a large share of a foe's HP.

## The Toll

**Identity.** They hurt themselves. Foes crowd onto one unit, and every blow it takes comes back: Thorns flash, the attacker bleeds, it sparks when it moves next. The swarm that rushes the wall dies against it. It's waiting to be hit. The danger is all on the anchor, and the rest of the party is almost untouched. Thorns cost nothing, so each one stays modest: the Toll's power comes from how often it's hit.

- **Loves:** Wolves, Hellhounds, Wisps, summoned waves.
- **Fears:** slow single hitters (the Ogre Chief, the Fire Giant's few big casts), Area attacks, which ignore the draw, and foes that don't hit (Bone Priests, Witches give the anchor nothing to return).
- **Threads:**
  - the draw: Taunt and Aggro;
  - Thorns and retaliation as one idea: being hit and dodging a hit both strike back;
  - what an attacker carries away: Bleed, Chill (slowing the next blow), Shock (paid when it acts again);
  - Weaken: blows land as often but hurt less, so the anchor survives and every blow still pays;
  - Guard and Armor against many small hits;
  - healing on the anchor;
  - Evasion as the other anchor: a dancer who dodges and answers.
- **Routes:** Bramble knight, Cleric, Stormcaller · a Knight wearing thorns, Hexer, Hoplite · the dancer: a Monk carrying a Taunt, Bard, Assassin.
- **Rungs:**
  1. The Bramble knight, or Thorns on anyone who Taunts: swarms hurt themselves.
  2. What attackers carry away, and Weaken on them. Swarms die on the wall.
  3. Retaliation that counts dodges too, and Thorns that grow with the beating. A wall that even a boss's slow blows feed.

## Blood Pact

**Identity.** Life spent and bought back. The party's HP bars swing hard. A unit pays a chunk of its life for a big blow, then drinks it back from foes, and heals pass from the reckless to the careful. The party fights low and ends full. It's waiting to be low enough for its payoffs (Bloodlust's half). It pays in HP where others pay in MP, a choice of fuel and not more of it, and reaches for potions where others reach for tonics. HP carries between fights, so it has to end each fight topped up. Phoenix's sibling, with life instead of death.

- **Loves:** long fights.
- **Fears:** Bats (a dodged hit drinks nothing), the Witch's curses (a weakened hit drinks less), and burst that catches it low.
- **Threads:**
  - Lifesteal, and healing received;
  - HP as a cost: abilities paid in HP instead of MP;
  - below half as power (Bloodlust);
  - max HP as a damage stat;
  - drain: Siphon (mana) and Weaken (strength);
  - a heal given as a trigger: life passed on;
  - Regen, refilling what the pact costs.
- **Routes:** Vampire, Monk, Cleric · Vampire, Bramble knight, Valkyrie · no Vampire: Knight, Monk, Paladin.
- **Rungs:**
  1. Lifesteal on any fast hitter: HP that carries better.
  2. Pieces paid in HP, and payoffs below half. Fights where the mana never runs out.
  3. Life as the party's one currency. The party ends every fight topped up, having spent half its HP twice.

## Phoenix

**Identity.** The party that wins by falling. A member drops, and the party flares: the others harden and hit harder. Moments later the fallen stands up with everything ready and unloads. A death is a turn in the party's favour, and the fight's story is told in knockouts. It's waiting for someone to fall. A knockout carries into the next fight, so its pieces bring the fallen back between fights as well as during them.

- **Shrugs at:** Doom. Against the Reaper, a Doomed unit is just the next turn.
- **Fears:** burst that drops two at once, and a Silence on the reviver.
- **Threads:**
  - revives, and Einherjar's return with everything ready;
  - an ally's fall as a trigger;
  - a revive as a trigger;
  - low HP as power (Last rites, Bloodlust);
  - sacrifice: a unit that falls on purpose and hands its power on;
  - the long, costly spell that hits very hard on the return;
  - Shields and Aegis on the survivors.
- **Routes:** Assassin, Cleric, Valkyrie · Vampire, Valkyrie, Knight · Pyromancer, Cleric (Raise first in its order), Paladin.
- **Rungs:**
  1. A revive (two classes, phoenix feathers): a knockout isn't the end.
  2. Reactions to a fall and to a return. Each death is a power spike.
  3. A martyr who returns ready and stronger, and returns that cost less. A party that's strongest the second time round.
- **Watch:** its far end is crowded. Several returns stacked on one unit could make a party that can't lose its first member.

## The web

The builds share threads, so a run drifts from one to another, and pieces form a web, not bundles (`docs/rules.md`).

**Seat roles the builds share.** This is how most formations reach several builds; a formation's own effects and custom roles are what make it itself.

| Seat role | Builds that use it (their name for the seat) |
| --- | --- |
| Draws the blows | Landslide (bulwark), Bonfire (keeper), Harvest (lightning rod), Lockdown (gaoler), the Toll (anchor), Phoenix (martyr), Ambush (rear guard), the Hunt (warden) |
| Gives to the others | Landslide (mason: stone), Thousand Cuts (pacer: speed), Overflow (wellspring: mana), Blood Pact (donor: life), Phoenix (reviver: returns) |
| Acts often, hits small | Thousand Cuts (blades), Bonfire (stoker), Cold Snap (frost seats), Ambush (the hastened second) |
| Acts rarely, hits big | Landslide (hammer), Cold Snap (breaker), Ambush (opener) |
| Picks the target, or waits for one | the Hunt (marker, chaser), Lockdown (watcher, warden) |
| Spreads what it does | Harvest (scythes), Bonfire (torch) |
| Pays to give power | Blood Pact (bleeder), Phoenix (martyr) |
| Is fed by the other two | the Hunt (marker), Landslide (hammer), Overflow (spender), Blood Pact (drinker) |

**The doors:** where one build opens into another. Each has at least two pieces that matter to both sides.
- **Cold Snap into Lockdown, through Stun:** Icebreaker, Opportunist's charm, Still hand, The vise.
- **Thousand Cuts into the Toll, through Evasion:** Duelist's leathers, Windrunner's garb, Skirmish line, Flow's version B.
- **Thousand Cuts into Cold Snap, through riders:** Rime knuckles, Echo charm, Hummingbird charm, Heart of winter, Flurry wraps.
- **The Hunt into Bonfire, through kills:** Signal lantern, Wick, Bounty charm.
- **The Hunt into Ambush, through Hidden and reach:** Shadow cloak, Tracker's coat, Quietus, Night's edge.
- **Landslide into the Toll, through Armor:** Spiked bulwark, Thorn hedge, Bastion plate.
- **Landslide into Ambush, through the stone at the start:** Stone totem, War horn, Drawn steel, Phalanx's version A.
- **Landslide into Lockdown:** Worldbreaker, Rubble shield.
- **Blood Pact into Phoenix, through low HP:** Last bastion, Bloodsworn mail, Martyr's maul, Bloodlust's version B.
- **Overflow into Lockdown, through MP and cooldowns:** Annotated grimoire, Brimming rod, Bell of the hour, The choir.
- **Overflow into Bonfire, through hungry casts:** Archmage's mantle, Cataclysm staff.
- **Bonfire into Harvest:** Ember heart spreads the fire that the Wick focuses.
- **The Toll into Overflow:** the Knight's mythic, a beating that feeds the casters.

**Builds nobody planned** are possible too: the frozen gate (Hoarfrost plate beside any shatter payoff), the second volley (Bones of the returned, Ready stance), the opening freeze (Horn of the charge with Heart of winter or Frostbite bow), the thorned pact (Last bastion with Thornheart plate).

**Exotics** belong to no build: the Wildmagic wand, the Cinderheart staff (a flare that undoes Bonfire's ramp), the Idol of the hungry dark, Gambler's coin and The wheel. The Hexblade and Hexweave mail sit near them, worth something to every status party and a lot to none.

**Nothing is fenced off.** Every build has pieces in every slot and a formation, with pieces worth something to it that 10 to 16 classes can wear. The narrowest are Ambush (its openers sit on the fast and the hidden) and Landslide (its stone on Plate and great weapons), and each has an amulet anyone can wear.
