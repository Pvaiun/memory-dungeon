# Gear design: the builds

The twelve builds the gear, formations, upgrades and mythics were designed backwards from, and the web between them. They stand (`docs/rules.md`). What a build is, and what rhythm means, is in *Gear design: philosophy*; the rules the loot follows are in *Gear design: the loot*.

Each build has three routes (trios of classes that carry it) at three rungs, as hand-built test parties in `tools/build-parties.ts`, and `npx tsx tools/build-test.ts` plays them side by side. Which builds each piece serves is designer data (`PIECE_BUILDS` in `content/core-set/pieces/index.ts`) and never reaches a card.

## The rhythm space

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

## How each build is written

- **Identity:** what someone watching sees, and what the build is waiting for.
- **Loves and fears:** among the rogue's fights.
- **Threads:** what it's woven from.
- **Routes:** the classes that carry it, in more than one combination. Any formation with the seats it likes helps it, and none is required.
- **Rungs:** what it asks of a run, from what most runs find to its most specific version, with what each pays.
- **Needs:** what it asks of pieces, formations and upgrades, as needs rather than designs.
- **Far end:** what its most specific, most potent pieces do, whatever slot or rarity they're in.

## Landslide

**Identity.** A party in stone that swings rarely and hits like a falling hill. The front wears Shield bars, and foes chip at the stone. Long stretches pass with small numbers. Then a slow swing or a long cast lands far bigger than anything else, and an elite loses a large share of its HP. The stone is rebuilt, and it happens again. It's waiting for its big blow to come round, with the stone holding until then. Fights run long.

- **Loves:** bosses and armored foes (big hits lose little to Defense, and crits land before it), and Lava Slimes (one blow takes a slime from above half to nothing, so it never splits).
- **Fears:** swarms (blows wasted on wolves), dodgers (a missed blow is a long wait wasted), and anything that breaks Shields fast.
- **Threads:**
  - the Shield as a second health bar, and the moment it breaks;
  - Defense as a damage stat;
  - slow, heavy actions;
  - Might on the slowest hitter, since it's spent one stack per action (a thread nobody would look for);
  - crits and crit damage;
  - weight: the biggest blows stagger;
  - max HP feeding the stone and the blow.
- **Routes:** Geomancer, Knight, Hoplite · Geomancer on a great weapon, Paladin, Cleric · no earth at all: Knight on a great weapon, Hoplite, Bard.
- **Seats it likes:** a bulwark that wears the stone and draws the blows; a hammer whose actions come less often and land bigger; a mason that builds stone for the other two.
- **Rungs:**
  1. Any slow weapon and one Shield source: steadier boss fights, and Defense that stops mattering.
  2. Pieces that turn a Shield or Defense into hit size, Guard that reaches the Defense-scalers, Might for the hammer. Elites lose chunks, and most bosses take three or four blows.
  3. The stone itself becomes the weapon. A boss fight is a handful of blows the party lives through comfortably.
- **Needs:**
  - **Pieces:** something that uses the Shield pool or its breaking as damage; Guard or Defense that reaches the units whose kit scales from Defense; a way for any unit's basic attacks to come slower and bigger; Might that suits one slow unit rather than everyone.
  - **Formations:** the hammer seat, and formations that trade the party's speed for size.
  - **Upgrades:** versions of Shield bash, Rockfall, Tremor, Smite, Phalanx, Earthen shell and Vanguard that trade speed for size, or aim the blow (at the foe in a wind-up, at the healthiest).
- **Far end:** the stone becoming the blow, and the heaviest swing.
- **Watch:** the quiet between blows may read as nothing happening; the stone bars have to be what you watch.

## Thousand Cuts

**Identity.** A blur. A stream of tiny numbers, several a tick. Units act constantly, and foes' Bleed counters open with every hit. The party is hard to hit: MISS, MISS. It isn't waiting for anything; it never stops. Most of its damage is basic attacks, and the light bodies pay when the dodges fail.

- **Loves:** Bleed, and Lifesteal, since many hits heal many times.
- **Fears:** Defense (small hits lose most to it), the Ice Golems' crust, Wisps' Shock (fast units pay), and the Lava Slimes' split.
- **Threads:**
  - speed: fast weapons and Haste;
  - many hits: Double strike, multi-hit abilities, extra strikes;
  - Bleed bursting on each hit;
  - riders on every hit, extra strikes included (without them, Double strike is a trap);
  - Evasion as defence, and the dodge as a trigger;
  - Lifesteal on every hit;
  - the status torrent: fast hits that each leave Burn, Shock or Chill, whose own damage never meets Defense; the same rhythm with another answer to Defense (a second route, not a second build).
- **Routes:** Bard, Monk, Assassin · Valkyrie, Ranger, Vampire · the status torrent: Stormcaller and Pyromancer on wands, Hexer on a dagger.
- **Seats it likes:** a pacer that speeds the others; two blades that act more often and hit smaller.
- **Rungs:**
  1. Fast weapons and a little Double strike: steady chip, and little else.
  2. Riders on every hit, extra strikes included, and a Bleed source. Every hit opens a wound, and armored foes stop being walls.
  3. A payoff that grows with how many hits the party has landed this fight. Late in a fight, every tiny hit is worth a big one.
- **Needs:**
  - **Pieces:** riders and multi-hits that count every hit; something that grows with the hits landed; a dodge that pays; an answer to Defense for small hits that isn't simply more Sunder.
  - **Formations:** the pacer seat, and formations that make the whole party faster at a cost.
  - **Upgrades:** versions of Flow, Iron palm, Gale spear, Barbed arrow and Burning fist that add hits or spread them.
- **Far end:** a count of hits that turns into something big, and the fastest blur.

## Bonfire

**Identity.** A fire that grows hotter the longer it burns. Burn climbs on the hottest foe, a bigger number every pulse. When that foe falls, its fire passes to the next, which starts already burning, so each kill comes sooner than the last. The party heats up too: the longer the fight, the harder it hits. Early on, the foes press hard and the party holds. By the end, they fall one after another, faster and faster. It's waiting for the fire to catch.

- **Loves:** long fights, packs (each death feeds the next), and bosses with helpers (the helpers' fire passes to the boss).
- **Fears:** fights too short for the fire to catch, and losing its feeders early.
- Unlike Cold Snap, its curve has no beat of bursts; unlike Landslide, no single blow matters. The Hunt's beat stays steady and Harvest's kills land at once, where Bonfire's speed up.
- **Threads:**
  - Burn on the hottest foe, which drains and needs upkeep;
  - fire that passes on, from a dying foe to the next;
  - Heat that builds in the party: power that grows over a fight, where Might is spent;
  - long wind-ups and big casts, with the danger that a cast is lost;
  - a keeper who holds the early fight (Taunt, Shield, Guard, Aegis);
  - Haste on the stokers.
- **Routes:** Knight, Pyromancer, Hexer · no mage: Paladin, Bard, Monk · Hoplite, Pyromancer on a wand, Cleric.
- **Seats it likes:** a keeper that holds the early danger; a stoker that acts more often; a torch whose fire passes on when its target falls.
- **Rungs:**
  1. Any Burn source (four classes have one): steady damage over long fights.
  2. Fire that passes from a dying foe, Burn on a fast unit's basic attacks, and a keeper. Each kill comes sooner than the last.
  3. The party's own heat, and a Pyre on a fire passed down the line. The catch comes early, and the last foes fall in a rush.
- **Needs:**
  - **Pieces:** something that passes Burn from a dying foe to the next; power that builds in the party as a fight goes on; a choice between a fire that lasts and a fire that flares.
  - **Formations:** the keeper and the torch, and formations that pay more the longer a fight runs.
  - **Upgrades:** versions of Firebolt, Fireball, Pyre, Kindling, Burning fist, Smite and Malison that hold the fire up, pass it on, or flare it.
- **Far end:** fire that outlives its foe, and heat that never stops building.

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
- **Seats it likes:** two frost seats that act often and carry Chill; a breaker that hits a frozen or stunned foe hardest.
- **Rungs:**
  1. A Frostweaver, or one Chill piece on any fast unit: a shatter or two a fight.
  2. Chill on two units' basic attacks, and a payoff for hitting a stunned foe. Shatters every few ticks, across a pack.
  3. A shatter that seeds the next: chain shatters through a pack.
- **Needs:**
  - **Pieces:** Chill on basic attacks for classes with fast weapons; payoffs for hitting a stunned foe; something that makes one shatter the start of the next.
  - **Formations:** the breaker seat, and formations where one seat's hits set up another's.
  - **Upgrades:** versions of Frost lance, Blizzard, Stillness, Shatterpoint, Cold hex and Frost arrow that aim at the foe nearest its shatter or spread the cold wide. A frost version of Burning fist, which the director liked, belongs here.
- **Far end:** a shatter that seeds the next, and frost on every hit.

## The Hunt

**Identity.** The pack singles one out. Every hit in the party goes to the same foe, often one in the back; it falls, and the next is marked. The number of foes drops one by one on a steady beat. It's waiting for the next kill. Harvest's opposite.

- **Loves:** mixed groups with a dangerous back row (Archers, Liches, Bone Priests, Witches).
- **Fears:** a lone boss (one step, no staircase), Ghouls raised behind the hunt, and Taunting fronts if it has no reach.
- **Threads:**
  - focus: the party's picks agreeing (Marked);
  - reach: Seek past a Taunting front, quick, light and multi-hit;
  - the weakest and the furthest back;
  - a reward on each kill, so each step speeds the next;
  - Silence on the back row's casters;
  - an answer for bosses: damage that grows as the foe's HP falls, so a boss is a long staircase of its own.
- **Routes:** Valkyrie, Ranger, Assassin · Assassin, Monk, Hoplite · Ranger, Stormcaller, Paladin.
- **Seats it likes:** a marker whose pick sets the target the others follow; a chaser with reach; a warden that holds the front.
- **Rungs:**
  1. Any Seek ability, or the Ranger: the back row dies first.
  2. Basic attacks that follow the marker, and a reward on each kill. Every kill speeds the next.
  3. The whole party on one foe, and a kill that resets the hunt. Mixed groups fall in a drumbeat.
- **Needs:**
  - **Pieces:** a way to make the party's basic attacks follow one target; Seek on gear; kill rewards that speed the next kill; damage that grows as a foe weakens, for bosses.
  - **Formations:** the marker seat, and formations that point the whole party at one foe.
  - **Upgrades:** versions of Backstab, Gale spear, Garrote, Pressure point, Barbed arrow and Hunter's eye that change what they aim at.
- **Far end:** the party's picks bound to one target, and a kill that sets up the next.

## Harvest

**Identity.** The whole field falls together. Hits land on every foe at once, and nobody dies for a long time. All the HP bars sink in step. Then, in a few ticks, the field is empty. It's waiting for the sweep that finishes them all. The danger stays full until the end, every foe alive and acting, so the party has to hold the whole field's pressure.

- **Loves:** swarms and summons, and Ghouls, which can't raise each other if they fall together.
- **Fears:** Bomb Bugs (every blast at once), Lava Slimes (an even field sends every slime below half, so every one splits), and a lone boss, where spread damage is no different from single.
- **Threads:**
  - Area;
  - spread: strikes that jump (Arc, Chain lightning), with Shock optional;
  - evening out: aiming at the healthiest foe so the field sinks together;
  - a sweep: a blow that carries through to a second foe;
  - the draw: one unit takes the field's attention so the others can spread;
  - a finisher that ends every foe below a line at once.
- **Routes:** Bramble knight, Stormcaller, Bard · Paladin, Pyromancer, Frostweaver · no mages: Knight, Valkyrie, Hoplite.
- **Seats it likes:** a lightning rod that draws everything; two scythes whose hits spread.
- **Rungs:**
  1. Any Area mage: swarms die faster.
  2. Strikes that jump or sweep on units that aren't mages, and the evening-out targeting. The field falls together.
  3. A finisher, and a sweep for units that aren't mages. Swarms are erased in a beat, and Ghouls are beaten clean.
- **Needs:**
  - **Pieces:** blows that reach a second foe or every foe; aiming at the healthiest foe; a finisher for every foe below a line; a payoff that grows with how many foes one action hit.
  - **Formations:** the lightning rod, and formations that reward hitting many foes at once.
  - **Upgrades:** versions of Arc, Chain lightning, Thunderstorm, Fireball, Blizzard, Thunder chord and Malison that even the field rather than pile on one.
- **Far end:** a sweep for units that aren't mages, and a finisher for the whole field.

## Ambush

**Identity.** The opening volley. The fight starts, and the party's first moments land at once: a blade from hiding, a first swing that lands like three, Haste on everyone. The fragile back of the foes' line is gone before it acts. Then a short scramble against what's left. It's waiting for the next fight to begin. The volley comes from what happens when a fight starts, not from abilities, so it spends few cooldowns and little MP. It pays in HP in the exposed tail, and in slots. A run that rotates its members won't play it every fight, which makes it hard to reach. Unlike the Hunt, it hits everything it can reach in the first moments and has little left after.

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
- **Seats it likes:** an opener whose first action lands bigger; a second seat hastened at the start; a rear guard shielded at the start, to hold after the volley.
- **Rungs:**
  1. The slot order and any start-of-fight piece: quicker first ticks.
  2. A first swing that lands bigger, and Hidden and Haste at the start. The back row is gone before it acts.
  3. An opening that clears most regular fights on its own. Bosses still need the tail.
- **Needs:**
  - **Pieces:** effects at the fight's start for more classes (Hidden, Haste, Might, Shields); a first action that lands bigger; something for the tail, so the build isn't all or nothing.
  - **Formations:** the opener seat, and formations that put everything into the first moments.
  - **Upgrades:** versions of Vanish, Backstab, Gale spear, Allegro and War ballad that favour the first moment.
- **Far end:** an opening that clears a room, and a tail that isn't empty.
- **Watch:** the tail. Its second rung is thin, and what keeps a spent volley from being all or nothing is mostly the rear-guard seat.

## Overflow

**Identity.** A party that never stops casting. Spell names scroll one after another, and basic attacks are rare. Mana passes from ally to ally, and the casting moves with it: one member flares, cast after cast, while the others gather; then the next. Each cast leaves the next caster a little more. It's waiting for the mana to reach the next caster, and those small moments are the payoff. The danger is a cliff: a Silence, a mana drain or an empty pool turns the party into staff-bonkers. Its power follows how much fuel it moves.

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
- **Seats it likes:** a wellspring that gives mana; two spenders whose casts are cheaper or come faster.
- **Rungs:**
  1. MP regen gear, and a Clarity giver: the casters last another fight.
  2. Casts that give the next caster something (mana, a shorter cooldown). The party casts all fight.
  3. Mana as damage, and costs that fall as the party casts. A party that ends fights with more mana than it started with.
- **Needs:**
  - **Pieces:** reactions to an ally's cast; things that change MP costs; cooldown refunds; Silence answers on gear; mana as a damage stat.
  - **Formations:** the wellspring, and formations that move mana between seats.
  - **Upgrades:** versions of Stand fast, Stillness, Refrain, Blood gift, Static charge and Chain lightning that pass on mana or tempo.
- **Far end:** casts that pay for the next, and mana as damage.
- **Watch:** it leans on the engine most. If a link reads as bookkeeping in the fight log, it fails the director's "relay is too complicated". It has no amulet of its own.

## Lockdown

**Identity.** Hold them, then hit them. A foe's wind-up bar is struck down, or a Weaken lands. The moment a foe is disabled, the whole party piles in, and the numbers on a stunned, silenced, frozen or weakened foe come out bigger than anywhere else in the fight. Then the foe breaks free, and the party waits for the next opening. It's about capitalizing on disabled foes, not a permanent lock: bosses' control resistance makes a lock a window, not the whole fight. The Toll's opposite.

- **Loves:** bosses and elites with big casts (the Fire Giant, Liches, the Silent One, the Ogre Chief's Crush).
- **Fears:** swarms (too many to lock), and the enrage, which catches long fights.
- **Threads:**
  - piling onto the disabled: hits on a foe that's stunned, silenced, frozen, slowed or weakened;
  - Weaken, a disable of its own: what does land, lands small;
  - interrupts: Silence loses a wind-up, Stun pauses it;
  - waiting for a wind-up;
  - a slow instead of a shatter;
  - heavy blows that stagger;
  - cooldowns: locks have to come round as often as the boss winds up;
  - MP for the locks: Clarity and Siphon.
- **Routes:** Monk, Knight, Hexer · Assassin, Geomancer, Frostweaver · the patient version: Paladin, Cleric, Hexer.
- **Seats it likes:** a warden whose locks come round faster; a watcher that waits for the cast; a gaoler that keeps the foes' attention on the one built to take it.
- **Rungs:**
  1. Any one Stun or Silence: a boss's big move is sometimes stopped.
  2. Locks that wait for a wind-up instead of firing at random, and a second lock on another clock. Big moves are stopped most of the time.
  3. Hits that land hardest on a disabled foe, and locks that come round with every opening. Each window takes a large share of a foe's HP.
- **Needs:**
  - **Pieces:** payoffs for hitting a disabled foe, by whatever disabled it; Weaken on more classes; a slow that holds a foe without bursting it; MP and cooldowns for the locks.
  - **Formations:** the watcher seat, and formations that turn a disabled foe into everyone's target.
  - **Upgrades:** "waits for a foe winding up" as one version of many control abilities (the director's idea, for Shield bash first).
- **Far end:** openings that land as the fight's biggest hits, and locks that come round with every opening.

## The Toll

**Identity.** They hurt themselves. Foes crowd onto one unit, and every blow it takes comes back: Thorns flash, the attacker bleeds, it sparks when it moves next. The swarm that rushes the wall dies against it. It's waiting to be hit. The danger is all on the anchor, and the rest of the party is almost untouched. Thorns cost nothing, so each one stays modest: the Toll's power comes from how often it's hit.

- **Loves:** Wolves, Hellhounds, Wisps, summoned waves.
- **Fears:** slow single hitters (the Ogre Chief, the Fire Giant's few big casts), Area attacks, which ignore the draw, and foes that don't hit (Bone Priests and Witches give the anchor nothing to return).
- **Threads:**
  - the draw: Taunt and Aggro;
  - Thorns and retaliation as one idea: being hit and dodging a hit both strike back;
  - what an attacker carries away: Bleed, Chill (slowing the next blow), Shock (paid when it acts again);
  - Weaken, the Toll's best friend: blows land as often but hurt less, so the anchor survives and every blow still pays (the director's "Weaken in some sort of stall comp");
  - Guard and Defense against many small hits;
  - healing on the anchor;
  - Evasion as the other anchor: a dancer who dodges and answers.
- **Routes:** Bramble knight, Cleric, Stormcaller · a Knight wearing thorns, Hexer, Hoplite · the dancer: a Monk carrying a Taunt, Bard, Assassin.
- **Seats it likes:** an anchor that draws and returns; a warden that keeps the anchor standing; a free seat that finishes what the anchor started.
- **Rungs:**
  1. The Bramble knight, or Thorns on anyone who Taunts: swarms hurt themselves.
  2. What attackers carry away, and Weaken on them. Swarms die on the wall.
  3. Retaliation that counts dodges too, and Thorns that grow with the beating. A wall that even a boss's slow blows feed.
- **Needs:**
  - **Pieces:** Taunt on gear, for more anchors; retaliation on a dodge; Thorns that grow per hit taken or from Defense; pieces that make Weaken an advantage rather than a defence.
  - **Formations:** the anchor seat, and formations built around one unit being hit.
  - **Upgrades:** versions of Thicket, Briar, Bramble lash, Stand fast and Fortify that change who the anchor is and what it returns.
- **Far end:** thorns that grow with the beating, and a dodge that strikes back.

## Blood Pact

**Identity.** Life spent and bought back. The party's HP bars swing hard. A unit pays a chunk of its life for a big blow, then drinks it back from foes, and heals pass from the reckless to the careful. The party fights low and ends full. It's waiting to be low enough for its payoffs (Bloodlust's half). It pays in HP where others pay in MP, a choice of fuel and not more of it: its HP costs must buy what the MP would have, and it reaches for potions where others reach for tonics. HP carries between fights, so it has to end each fight topped up. Phoenix's sibling, with life instead of death.

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
- **Seats it likes:** a bleeder that pays HP for power; a drinker that feeds on hits; a donor that passes life on.
- **Rungs:**
  1. Lifesteal on any fast hitter: HP that carries better.
  2. Pieces paid in HP, and payoffs below half. Fights where the mana never runs out.
  3. Life as the party's one currency. The party ends every fight topped up, having spent half its HP twice.
- **Needs:**
  - **Pieces:** abilities and effects paid in HP; something that rewards a heal given; below-half payoffs that don't leave the unit low for the next fight; max-HP scalers.
  - **Formations:** the bleeder seat, and formations where life moves between seats.
  - **Upgrades:** versions of Blood drain, Blood gift, Frenzy, Bloodlust, Regrowth and Absolve that pay or pass life.
- **Far end:** life as the only cost, and healing that turns into something more.

## Phoenix

**Identity.** The party that wins by falling. A member drops, and the party flares: the others harden and hit harder. Moments later the fallen stands up with everything ready and unloads. A death is a turn in the party's favour, and the fight's story is told in knockouts. It's waiting for someone to fall. A knockout carries into the next fight, so its pieces bring the fallen back between fights as well as during them.

- **Shrugs at:** Doom. Against the Reaper, a Doomed unit is just the next turn.
- **Fears:** burst that drops two at once, and a Silence on the reviver.
- **Threads:**
  - revives, and Einherjar's return with everything ready;
  - an ally's fall as a trigger;
  - a revive as a trigger;
  - low HP as power (Last rites, Bloodlust): a unit near the end is at its best;
  - sacrifice: a unit that falls on purpose and hands its power on;
  - the long, costly spell that hits very hard on the return;
  - Shields and Aegis on the survivors.
- **Routes:** Assassin, Cleric, Valkyrie · Vampire, Valkyrie, Knight · Pyromancer, Cleric (Raise first in its order), Paladin.
- **Seats it likes:** a martyr that falls first (it draws) and whose fall powers the others; a reviver whose revives come faster; a survivor that hardens when an ally falls.
- **Rungs:**
  1. A revive (two classes, phoenix feathers): a knockout isn't the end.
  2. Reactions to a fall and to a return. Each death is a power spike.
  3. A martyr who returns ready and stronger, and returns that cost less. A party that's strongest the second time round.
- **Needs:**
  - **Pieces:** reactions to an ally's fall and to a revive; returns that don't rest on a reviver's ability firing at the right moment, in a fight and between fights (with fights automatic, Raise and Valhalla won't always fire when they're needed); a return with everything ready for more than the Valkyrie; something that makes coming back at low HP survivable into the next fight.
  - **Formations:** the martyr and survivor seats, and formations that answer a fall.
  - **Upgrades:** a revive for one more class, and versions of Raise, Valhalla, Einherjar and Last rites.
- **Far end:** a return stronger than the fall, and a fall that doesn't stay.
- **Watch:** its far end is crowded and its second rung thin. Several returns stacked on one unit could make a party that can't lose its first member.

## The web

The builds share threads, so a piece made on a thread reaches every build in its row, by different amounts and for different reasons. That's how a run drifts from one build to another.

### Threads the builds share

| Thread | Matters most to | Matters some to |
| --- | --- | --- |
| The draw (Taunt, Aggro) | the Toll | Landslide, Harvest, Bonfire, Lockdown, Phoenix (the martyr) |
| Shield | Landslide | Phoenix, Ambush, the Toll |
| Defense and Guard | Landslide, the Toll | Lockdown |
| Might | Landslide (the slow hitter) | Ambush (the first blow), Phoenix (on a fall), Bonfire |
| Haste | Thousand Cuts | Bonfire, Overflow, Ambush |
| Riders on basic attacks | Thousand Cuts, Cold Snap | Bonfire, the Toll |
| Many hits, extra strikes | Thousand Cuts | Cold Snap, Harvest |
| Crits | Landslide | Ambush, the Hunt, Thousand Cuts |
| Stun | Lockdown, Cold Snap | Landslide (its heaviest blows) |
| Silence | Lockdown | the Hunt (the back row) |
| Wind-ups | Lockdown | Landslide, Bonfire |
| Cooldowns | Overflow | Lockdown, the Hunt, Ambush (one saved for the volley) |
| MP flow | Overflow | Lockdown, Bonfire, Phoenix, Blood Pact (by paying HP instead) |
| HP spent, low HP | Blood Pact, Phoenix | Landslide (max HP into the stone and the blow) |
| Heals | Blood Pact | Phoenix, the Toll |
| Kills as triggers | the Hunt, Bonfire (the fire passing on) | Harvest (the finisher) |
| Area and spread | Harvest | Cold Snap, Bonfire |
| Focus and targeting | the Hunt | Cold Snap, Harvest (evening out), Landslide (aiming the blow) |
| Seek and reach | the Hunt | Ambush, Lockdown |
| Bleed | Thousand Cuts | the Toll, the Hunt |
| Burn | Bonfire | Thousand Cuts' status torrent (Kindling) |
| Chill | Cold Snap | Lockdown (the slow), the Toll (the attacker slowed) |
| Shock | the Toll (the attacker pays) | Harvest, Overflow |
| Sunder | Cold Snap | Thousand Cuts (against Defense), the Hunt |
| Weaken | the Toll | Lockdown, Blood Pact |
| Evasion and dodges | Thousand Cuts, the Toll (the dancer) | |
| Lifesteal | Blood Pact | Thousand Cuts |
| Falls and revives | Phoenix | Ambush (a revive in the first slot) |
| The fight's start | Ambush | Landslide, Phoenix |
| Knockouts and cooldowns carried into the next fight | Phoenix | Ambush (a cooldown saved for the volley), Overflow |

### Themes

Elements are themes, not mechanics, and a theme shapes builds far beyond its status. Builds that share a theme should feel nothing alike.

| Theme | Its builds | Its status |
| --- | --- | --- |
| Earth: weight, Shields | Landslide; the Toll (thorns) | none |
| Fire: ramp, big casts | Bonfire; Harvest (Fireball as one of the field's sweeps) | Burn: Bonfire's, and a little in the status torrent |
| Ice: control and shatter | Cold Snap (the shatter); Lockdown (the slow, no shatter needed) | Chill: a payoff in one, a lock on the way up in the other |
| Lightning: spread, quick strikes | Harvest; Thousand Cuts' status torrent; the Toll's spark | Shock: optional in Harvest, central to none |
| Wind: reach, Seek | the Hunt; Thousand Cuts | none |
| Light: restore, the costly blow | Phoenix; Landslide (Smite) | none |
| Dark: drain | Blood Pact; Lockdown and the Toll (Weaken) | none |

### Shared needs

Needs met once and paid off in several builds. Each build wants the same need for its own reason, which is what makes a shared piece worth a different amount in each.

| Need | Who wants it, and why | Met by |
| --- | --- | --- |
| Taunt on gear | the Toll, to return the blows; Landslide, to keep them on the stone; Phoenix, to choose who falls; Harvest, to hold the whole field; Bonfire, to hold the early fight | Challenger's plate, Mocking mail, sword, Plate and amulet uncommons, Thorn hedge, Reaping line |
| Payoffs on a stunned or silenced foe | Cold Snap, after each shatter; Lockdown, to turn its locks into damage; Landslide, after its heaviest blows stagger | Icebreaker, Opportunist's charm, Still hand, Bane of the bound, Hoarfrost line, The vise, Gaol |
| A dodge that pays | Thousand Cuts, as one more hit; the Toll, as the dancer's riposte | Duelist's leathers, Windrunner's garb |
| Riders on every hit, extra strikes included | Thousand Cuts, for the count; Cold Snap, for the Chill; Bonfire, for the Burn | Notched knife, Rime knuckles, Echo charm, Flurry wraps, Flicker wand, Heart of winter |
| A unit's basic attacks reshaped | Landslide, slower and bigger; Thousand Cuts, faster and smaller: one lever pulled two ways, a choice between builds | Millstone and Hummingbird charm, Anvil, Worldbreaker |
| Kills that give something back | the Hunt, to speed the next kill; Bonfire, to pass the fire; Harvest, to finish the field | Hunting spear, Bounty charm, Pack leader's coat, Gravemark, Wick, Ember heart, Last page |
| Changing a cooldown | Overflow, to keep casting; Lockdown, to keep up with the boss; the Hunt, to reset on a kill | Hunting spear, Still hand, Bell of the hour, Relay, Ready stance |
| Max HP that does something | Landslide, into the stone and the blow; Blood Pact, as the pool it spends | Heartsplitter, Cornerstone maul, and the kits |
| Effects at the fight's start | Ambush, for the volley; Landslide, for the stone; Phoenix, for the survivors' cover | Bastion plate, Stone totem, War horn, Shadow cloak, Drawn steel, Horn of the charge, First light, and many uncommons |
| Reactions to a fall or a return | Phoenix, as its turns; the Toll, when the anchor falls and someone must take its place | Challenger's plate, Mantle of the fallen, Rallying horn, Dawnblade, Martyr's locket, Funeral bell, Vigil, Pyre of heroes |
| Seek on gear | the Hunt, for reach; Ambush, so the volley isn't caught by the front; Lockdown, to reach the caster behind a wall | Tracker's coat, Executioner's longbow, dagger and rune-sword uncommons, Hunting party |
| Changing an MP cost | Overflow, as its engine; Phoenix, for cheaper returns; Lockdown, for more locks | Weaver's robes, Annotated grimoire, Archmage's mantle, Brimming rod, Reliquary of mercy, Wellspring, The choir |

### Seat roles the builds share

How most formations reach several builds; a formation's own effects and custom roles are what make it itself.

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

### The doors

Where a run drifts from one build to another: each door has at least two pieces that matter to both sides.
- **Cold Snap into Lockdown, through Stun.** A Frostweaver run that finds payoffs for hitting stunned foes stops chasing bursts and starts holding foes. Icebreaker, Opportunist's charm, Still hand, The vise.
- **Thousand Cuts into the Toll, through Evasion.** A dodgy Monk finds a Taunt and becomes the dancer anchor. Duelist's leathers, Windrunner's garb, Skirmish line, Flow's version B.
- **Thousand Cuts into Cold Snap, through riders.** A blur party picks up a Chill rider, and the shatters start; it's the door the director walked through. Rime knuckles, Echo charm, Hummingbird charm, Heart of winter, Flurry wraps.
- **The Hunt into Bonfire, through kills.** A hunt that finds fire passing from the dead: its steady beat starts to speed up. Signal lantern, Wick, Bounty charm.
- **The Hunt into Ambush, through Hidden and reach.** A hunter that opens from hiding. Shadow cloak, Tracker's coat, Quietus, Night's edge.
- **Landslide into the Toll, through Defense.** Thorns that grow from Defense turn the stone wall into a thorn wall. Spiked bulwark, Thorn hedge, Bastion plate.
- **Landslide into Ambush, through the stone at the start.** Shields and Might at the first tick, on the slowest hitter: the one huge blow, struck first. Stone totem, War horn, Drawn steel, Phalanx's version A.
- **Landslide into Lockdown:** Worldbreaker, Rubble shield.
- **Blood Pact into Phoenix, through low HP.** A pact party that falls and comes back. Last bastion, Bloodsworn mail, Martyr's maul, Bloodlust's version B.
- **Overflow into Lockdown, through MP and cooldowns.** Mana that feeds locks instead of damage. Annotated grimoire, Brimming rod, Bell of the hour, The choir.
- **Overflow into Bonfire, through hungry casts.** Mana makes the fire catch sooner. Archmage's mantle, Cataclysm staff.
- **Bonfire into Harvest:** Ember heart spreads the fire the Wick focuses.
- **The Toll into Overflow:** the Knight's mythic, a beating that feeds the casters.

### Builds nobody planned

They come from pieces meeting by chance; the loot makes them possible without designing them.
- **The frozen gate (the Toll with Cold Snap):** an anchor whose attackers carry Chill away, beside anything that pays on a shatter, so the wall freezes its attackers until they burst. Hoarfrost plate beside any shatter payoff.
- **The second volley (Phoenix with Ambush):** a unit that returns with everything ready opens the fight a second time, in the middle of it. Bones of the returned, Ready stance.
- **The opening freeze (Ambush with Cold Snap):** Chill at the first tick, so the first shatters come before the foes have acted. Horn of the charge with Heart of winter or Frostbite bow.
- **The thorned pact (the Toll with Blood Pact):** an anchor that lives below half on purpose, where the pact's payoffs switch on, while its Thorns do the killing. Last bastion with Thornheart plate.

### Abilities that sit between builds

These abilities sit on a border, so their two versions have somewhere to go.

| Ability | Between |
| --- | --- |
| Shield bash | Landslide (the blow) and Lockdown (the lock) |
| Earthen shell | Landslide and Phoenix (the survivors) |
| Thicket | the Toll and Landslide |
| Fortify | Landslide (Guard on the Defense-scaler) and the Toll (Guard on the anchor) |
| Aspis, Paired guard | the Toll (over the anchor) and Bonfire (holding the early fight) |
| Frost lance | Cold Snap and Lockdown |
| Pyre | Bonfire (on the hottest foe) and Harvest (on every foe, half as hard) |
| Smite | Landslide (the rare blow) and Bonfire (the fire) |
| Sanctuary | Lockdown (what slips through) and Harvest (holding the whole field's pressure) |
| Malison | Bonfire and Harvest |
| Arc | Harvest and Thousand Cuts |
| Chain lightning | Harvest and Overflow |
| Static charge | Overflow and Thousand Cuts |
| Backstab | the Hunt and Ambush |
| Gale spear | the Hunt and Thousand Cuts |
| Refrain | Overflow and Thousand Cuts |
| Blood gift | Blood Pact and Overflow |
| Rally, Renew | Blood Pact (the drop caught) and Phoenix (the return kept standing) |
| Raise | Phoenix and Ambush |
| Enfeeble | the Toll and Lockdown |
| Flow | Thousand Cuts and the Toll (the dancer) |

### Exotics, and nothing fenced off

- **Exotics** belong to no build: the Wildmagic wand, the Cinderheart staff (a flare that undoes Bonfire's ramp), the Idol of the hungry dark, Gambler's coin and The wheel. The Hexblade and Hexweave mail sit near them, worth something to every status party and a lot to none.
- **Nothing is fenced off.** Every build has pieces in every slot and a formation, with pieces worth something to it that 10 to 16 classes can wear. The narrowest are Ambush (its openers sit on the fast and the hidden) and Landslide (its stone on Plate and great weapons), and each has an amulet anyone can wear. Most rares and legendaries matter to two builds or more, by different amounts.

## Checks on the whole set

- **The rhythms spread across the space.** Damage at the start (Ambush), even (Thousand Cuts), in waves round the party (Overflow), rising (Bonfire), in bursts (Cold Snap), in steady steps (the Hunt), all at the end (Harvest), rare and huge (Landslide), following the foe (the Toll), surging after a fall (Phoenix), see-sawing (Blood Pact), in windows on disabled foes (Lockdown).
- **Every class is in some builds,** four to eight each, with routes into more than one.
- **Builds that share a mechanic feel nothing alike.**
  - Chill: Cold Snap's bursts, Lockdown's slow, the Toll's slowed attacker.
  - Kills: the Hunt's steady beat, Bonfire's speeding one, Harvest's all at once, Ambush's spike.
  - HP: Blood Pact's see-saw, Phoenix's deaths.
  - Shield: Landslide's stone, Phoenix's survivors.
- **No two builds differ only by the damage type on the numbers.** Thousand Cuts has a route of plain hits and a status torrent, but that's one build with two answers to Defense.

**Set aside:**
- **A wither build** (attrition: foes weaken, slow and drain while the party sits full). It shared Lockdown's danger shape and the Toll's long fights; its threads (Weaken, Siphon, Slow) are spread across the Toll, Lockdown and Blood Pact.
- **A radiance build** (healing stored and released as one blow). Its rhythm, quiet then huge, is Landslide's; light shapes Phoenix instead.
- **A gambler** (crits on everything, fights won in ten ticks or lost). Landslide's and Ambush's crits cover it, and it may come back as exotics.
