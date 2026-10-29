# Step 5i, step 3: the builds and the web between them

Oct 29, 2026, approved by the director, the gear included. About a dozen builds as ways to play, the web that connects them, and what they say about the slots. Every build is judged against `philosophy.md`. No piece, formation or upgrade is designed here, and there are no numbers: those are step 4, built backwards from whatever survives this read. The builds' routes become step 4's hand-built test parties.

**Revised twice after your reads (Oct 29).** What still stands of your intent is in `intent.md`. What changed:
- **MP:** each build says which fuel it spends (HP or MP), not how many fights it lasts.
- **Lockdown:** it's framed around piling onto disabled foes.
- **Phoenix:** its needs include returns that don't wait on a reviver.
- **Formations:** they're described as what they're allowed to be: seats that share roles across builds, but also their own roles, lopsided seats, effects on the whole party and costs.
- **The gear:** settled in a session of its own and merged in (the section "Gear").

## What needs you

1. **Formations** (the section "Formations: what they can be"). It now says what a formation is allowed to be, broadly, with the shared seat roles as one part of it. Does it read right?
2. **The gear is settled** (the section "Gear"): who shares which kinds of loot, the two-handers, the magical kinds, the offhands, the amulet and the mythic.
3. **Settled from your reads:**
   - MP is fuel, measured within a fight.
   - No mythic formations in this pass.
   - Lockdown, Ambush and Phoenix stay.
   - All twelve builds stay.

## How fights unfold today: a quick read

To see whether the rhythm claims below are real or only on paper, I played each build's nearest party with today's classes:
- **The setup:** plain weapons, every ability known, no gear, the Neutral formation, cooldowns 60% charged as a run carries them.
- **The fights:** six rogue fights (a wolf pack, a bandit camp behind a Shieldman, skeletons, ghouls, the Ogre Chief, the Fire Giant), foes eased by 50 so the ungeared parties finish them, 20 seeds each. `npx tsx src/rhythm-read.ts` reruns it.

What it says:
- **Today, every party plays nearly the same fight.** Averaged over its six fights, each of the twelve parties:
  - deals 10% to 25% of its damage in a fight's first quarter, and 20% to 40% in each of the other three;
  - deals 23% to 37% of its damage with its biggest tenth of hits;
  - makes its first kill 31% to 53% of the way through a fight;
  - takes 53% to 70% of its damage in the first half, while all the foes are alive.

  The first quarter is the quietest for almost every party. No build front-loads.
- **Four seeds already show:**
  - **The Toll:** the Bramble knight's Thorns deal 22% of the party's damage against six wolves, and 6% to 8% against skeletons, ghouls and both bosses. Its damage already follows how much the foes attack.
  - **Harvest:** the three parties that put Shock on every foe make their first kill latest: 48% to 53% of the way through, on average. These are Harvest's and the Toll's (the Stormcaller), and Overflow's (Thunder chord and Malison). Against skeletons, Harvest's first kill comes 77% of the way through, and the rest within the next fifth. Nothing, nothing, everything is there in seed.
  - **Bonfire:** Burn deals 37% to 54% of the party's damage in every fight but the Fire Giant's, who absorbs Fire. Its first quarter is its quietest in five of the six (9% to 17%). The ramp is real.
  - **Cold Snap:** the shatter makes the two parties with the Frostweaver and the Hexer the lumpiest against packs (their top tenth of hits deals 38% to 39% against skeletons and ghouls). Cold Snap's damage bulges in the third quarter (40%).
- **The rest don't exist yet:**
  - **Landslide** is only a little lumpier than average (34%), and the Assassin's crits make the blur party lumpier (37%).
  - **The Hunt** kills on everyone's schedule (36% of the way through; the Phoenix party's first kill comes sooner).
  - **Ambush** deals 9% to 23% of its damage in its first quarter.
  - **Phoenix and Blood Pact** show nothing of their own.
  - **Overflow's** party reads today as a Shock and Chill party, not a casting one.

The pieces have to make the rhythms. Today's kits mostly don't.

## The rhythm space

The philosophy defines a rhythm as how a fight unfolds over time. For the set, I read it four ways:
- **Damage:** where the party's damage falls in a fight. At the start, evenly, rising, in bursts, all at the end, or following the foe.
- **Danger:** where the party is most at risk.
- **Turns:** how often the fight visibly changes, and how big each change is.
- **What it spends:** HP or MP, within a fight. It isn't how many fights a build lasts. Every run has the same fights, so a build that lasts longer would simply be better (your word). It's which fuel the build burns, and that decides its gear and whether it reaches for a potion or a tonic after a fight. Power follows fuel: a build that spends little has to do less with it.

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

The dozen come in pairs that sit on opposite sides of the space, so they're written that way:
- Landslide and Thousand Cuts: few huge blows, or many tiny ones.
- Bonfire and Cold Snap: a smooth climb, or bursts on a beat.
- The Hunt and Harvest: one at a time, or all at once.
- Ambush and Overflow: everything at the start, or work that rolls on round the party.
- Lockdown and the Toll: deny the foe its moment, or invite every blow.
- Blood Pact and Phoenix: life spent and bought back, or death spent and bought back.

## How each build is written

- **Identity:** what someone watching sees, and what the build is waiting for.
- **Rhythm:** its place in the space above, and what it fears and loves among the rogue's fights.
- **Threads:** what it's woven from.
- **Routes:** classes that carry it, in more than one combination, and the seat roles that suit it. Any formation with those seats helps it, and none is required ("Formations in the web").
- **What it asks of a run:** three rungs, from what most runs find to its most specific version, with what each pays.
- **Needs:** from pieces, formations and upgrades, as needs, not designs.
- **Its far end:** what its most specific, most potent pieces would do, whatever slot or rarity they end up in.
- **Engine:** what it would need added. Several "empty" rows in the gap map turn out to be empty in content only; the engine can already listen for them.
- **How sure:** my confidence, and why.

---

## 1. Landslide

**Identity.** A party in stone that swings rarely and hits like a falling hill. The front wears Shield bars, and foes chip at the stone. Long stretches pass with small numbers. Then a slow swing or a long cast lands far bigger than anything else, and an elite loses a large share of its HP. The stone is rebuilt, and it happens again. It's waiting for its big blow to come round, with the stone holding until then.

**Rhythm.** Damage comes in a few huge blows, never quite when you expect them: Earth's "usually modest, sometimes huge". The danger is steady and soaked: the party's HP barely moves while the stone holds, and drops fast when it breaks. Few turns, each big. Fights run long. It spends MP on its stone to keep its HP: few actions, but the Shields are casts.
- **It loves:** bosses and armored foes (big hits lose little to Armor, and crits land before it), and Lava Slimes (one blow takes a slime from above half to nothing, so it never splits).
- **It fears:** swarms (wasted blows on 2-HP wolves), dodgers (a missed blow is a long wait wasted), and anything that breaks Shields fast.

**Threads.**
- **The Shield as a second health bar,** and the moment it breaks. Earth's "Shields for allies".
- **Armor as a damage stat.** Rockfall and Earthen shell scale from it. Guard (+3,000 Armor) never reaches those abilities today, because it goes by HP share.
- **Slow, heavy actions:** axes, the Earth and Fire staffs, Phalanx's double swings, long wind-ups.
- **Might,** which is spent one stack per action. A unit that acts rarely keeps it longest, so Might is worth most on the slowest hitter. This thread isn't obvious, and nothing uses it today.
- **Crits and crit damage:** the Geomancer's Bedrock, and big hits that crit before Armor.
- **Weight:** the biggest blows stagger.
- **Max HP feeding the stone and the blow:** Vanguard's Shield and Shield bash's damage both scale from it.

**Routes.**
- **Geomancer, Knight, Hoplite.** Earthen shell keeps the Geomancer's Bedrock lit while the Knight's Vanguard and Taunt keep the blows off it; Phalanx's double swings and the Geomancer's crits are the blows.
- **Geomancer with an axe, Paladin, Cleric.** The stone caster swings a war hammer, Smite lands rarely and hard, and the Cleric keeps everyone up.
- **No Earth at all: Hoplite, Knight with an axe, Bard.** The weight is slow steel, and the Bard's Might sits on the slowest swings.

**Seats that suit it:**
- a bulwark seat that wears the stone and draws the blows;
- a hammer seat whose actions come less often and land bigger;
- a mason seat that builds stone for the other two.

**What it asks of a run.**
- **From what most runs find:** any slow weapon and one Shield source (the Knight, the Geomancer). It pays a little: steadier boss fights and Armor that stops mattering.
- **With specific pieces:** pieces that turn a Shield or Armor into hit size, Guard that reaches the Armor-scalers, Might for the hammer. Elites lose chunks, and most bosses take three or four blows.
- **At the far end:** the stone itself becomes the weapon, and the hammer seat on a legendary formation. A boss fight is a handful of blows the party lives through comfortably.

**Needs.**
- **Pieces:**
  - something that uses the Shield pool or its breaking as damage;
  - Guard or Armor that reaches the units whose kit scales from Armor;
  - a way for any unit's basic attacks to come slower and bigger (only the Hoplite has it);
  - Might that suits one slow unit rather than everyone.
- **Formations:** the hammer seat, and formations that trade the party's speed for size.
- **Upgrades:** versions of Shield bash, Rockfall, Tremor, Smite, Phalanx, Earthen shell and Vanguard that trade speed for size, or aim the blow (at the foe in a wind-up, at the healthiest).
- **Its far end:** the stone becoming the blow, and the heaviest swing.

**Engine.**
- **Nothing new.** A Shield breaking already fires an event: its pool ends.
- **Damage scaling from the Shield:** exists (a scale on a status's stacks).
- **Slower, bigger swings:** exist as a stat and a boost.

**How sure.** Fairly. The pieces exist in the kits, but today's party is only a little lumpier than any other, so the rhythm has to come from step 4. The risk is that the quiet between blows reads as nothing happening. The stone bars have to be what you watch.

---

## 2. Thousand Cuts

**Identity.** A blur. A stream of tiny numbers, several a tick. Units act constantly, and foes' Bleed counters open with every hit. The party is hard to hit: MISS, MISS. It isn't waiting for anything; it never stops.

**Rhythm.** Landslide's opposite. Damage is dense and even from the first tick, with no turns. The danger is even too: the bodies are light, and luck (dodges) decides how it goes. It spends HP more than MP: most of its damage is basic attacks, and the light bodies pay when the dodges fail.
- **It loves:** Bleed, and lifesteal, since many hits heal many times.
- **It fears:**
  - Armor: small hits lose most to it.
  - The Ice Golems' crust, which thickens with every hit.
  - Wisps' Shock, which makes fast units pay.
  - The Lava Slimes' split.

**Threads.**
- **Speed:** fast weapons (daggers, fists, fast staves) and Haste.
- **Many hits:** Double strike, multi-hit abilities, extra strikes.
- **Bleed bursting on each hit:** many hits are what Bleed was made for.
- **Riders on every hit.** Today extra strikes carry almost none, so Double strike is a trap.
- **Evasion as defence,** and the dodge as a trigger.
- **Lifesteal on every hit.**
- **The magical torrent:** fast staves slip past Armor but meet magic resist. A second route, not a second build: the same rhythm with a different answer to Armor.

**Routes.**
- **Monk, Assassin, Bard on daggers and fists.** Double strike, Flow and the Bard's Haste.
- **Valkyrie, Ranger, Vampire.** The Valkyrie's three-hit spear, the Ranger's dagger and Bleed, the Vampire drinking from every claw.
- **The magical torrent: Stormcaller on a Wind staff, Hexer on an Ice staff, Pyromancer on a Lightning staff.** Fast magic that never meets Armor.

**Seats that suit it:**
- a pacer seat that speeds the others;
- two blade seats that act more often and hit smaller.

**What it asks of a run.**
- **From what most runs find:** fast weapons and a little Double strike. It pays steady chip and little else.
- **With specific pieces:** riders that ride every hit, extra strikes included, and a Bleed source. Every hit opens a wound, and armored foes stop being walls.
- **At the far end:** a payoff that grows with how many hits the party has landed this fight. Late in a fight, every tiny hit is worth a big one.

**Needs.**
- **Pieces:**
  - riders and multi-hits that count every hit;
  - something that grows with the hits landed;
  - a dodge that pays;
  - an answer to Armor for small hits that isn't simply "more Sunder".
- **Formations:** the pacer seat, and formations that make the whole party faster at a cost.
- **Upgrades:** versions of Flow, Iron palm, Gale spear, Barbed arrow and Burning fist that add hits or spread them.
- **Its far end:** a count of hits that turns into something big, and the fastest blur.

**Engine.**
- **Nothing new.** Extra strikes can already carry a reaction that names them, and a dodge already fires an event nobody listens to.
- **A hit counter:** a stacking status gained per hit.

**How sure.** Sure of the rhythm, less sure it's fun for long. A torrent has no turns, so it lives on what the counters show.

---

## 3. Bonfire

**Identity.** A fire that grows hotter the longer it burns. Burn climbs on the hottest foe: every two ticks, a bigger Fire number. When that foe falls, its fire passes to the next, which starts already burning, so each kill comes sooner than the last. The party heats up too: the longer the fight, the harder it hits. Early on, the foes press hard and the party holds. By the end, they fall one after another, faster and faster. It's waiting for the fire to catch.

**Rhythm.** Damage rises the whole fight: Fire's ramp. Kills come on a beat that speeds up: the first is slow, and each one after comes sooner. The Hunt's beat stays steady, and Harvest's kills all land at once. The danger is early, while the foes are at full strength and the party spends its first actions on the fire. One slow turn, the catch, after which the fight is decided. It spends MP: the fire needs feeding casts.
- **It loves:** long fights, packs (each death feeds the next), and bosses with helpers (the helpers' fire passes to the boss).
- **It fears:**
  - Fights too short for the fire to catch.
  - Losing its feeders early.

Unlike Cold Snap, its curve has no beat of bursts; unlike Landslide, no single blow matters.

**Threads.**
- **Burn on the hottest foe,** uncapped and decaying 15% a pulse, so it needs upkeep. Firebolt, Burning fist and Pyre already aim at the most Burn.
- **Fire that passes on:** a dying foe's Burn going to the next. Empty today.
- **Heat that builds in the party:** power that grows over a fight instead of being spent. Might is spent by each action; this is its opposite.
- **Long wind-ups and big casts,** Fire's own, with the danger that a cast is lost.
- **A keeper who holds the early fight:** Taunt, Shield, Guard, Aegis.
- **Haste on the stokers.**

**Routes.**
- **Pyromancer, Hexer, Knight.** Kindling and Firebolt keep the hottest foe burning, Malison lights the rest a little, and the Knight holds the early fight.
- **Monk, Paladin, Bard: no mage.** Burning fist and Smite feed it, and the Bard's Haste and Might speed the stoking. A fire made by fists and judgement.
- **Pyromancer on a Lightning staff, Hoplite, Cleric.** Fast Kindling. The Hoplite's Aspis and Paired guard hold the early fight, and the Cleric's Renew lifts the burns the Fire Mine hands back.

**Seats that suit it:**
- a keeper seat that holds the early danger;
- a stoker seat that acts more often;
- a torch seat whose fire passes on when its target falls.

**What it asks of a run.**
- **From what most runs find:** any Burn source (four classes have one). It pays steady damage over long fights.
- **With specific pieces:** fire that passes from a dying foe, Burn on a fast unit's basic attacks, and a keeper. Each kill comes sooner than the last.
- **At the far end:** the party's own heat, and a Pyre on a fire that's been passed down the line. The catch comes early, and the last foes fall in a rush.

**Needs.**
- **Pieces:**
  - something that passes Burn from a dying foe to the next;
  - power that builds in the party as a fight goes on;
  - a choice between a fire that lasts and a fire that flares.
- **Formations:** the keeper and the torch, and formations that pay more the longer a fight runs.
- **Upgrades:** versions of Firebolt, Fireball, Pyre, Kindling, Burning fist, Smite and Malison that hold the fire up, pass it on, or flare it.
- **Its far end:** fire that outlives its foe, and heat that never stops building.

**Engine.**
- **Reading a dying foe's stacks,** to pass them on: new.
- **Power that builds over a fight:** exists (a stacking status gained on a timer).

**How sure.** Sure of the ramp: it shows in seed today. The accelerating kills are new, and they rest on the piece that passes the fire on.

---

## 4. Cold Snap

**Identity.** Frost creeps up foes until they burst. Chill counters climb on every foe, and the foes visibly slow. Then a SHATTER: 3,000 Ice and a Stun on one foe, then another, like a string of firecrackers. It's waiting for the next foe to reach twelve. This is your Monk-and-Bard run, as a way to play.

**Rhythm.** Bursts on a beat a watcher can count, each one a turn: a foe stunned and gutted. Damage between bursts is modest. The danger falls through the fight, because every burst stuns and Chill slows everyone.
- **It loves:** packs, elites, and the Fire Giant and Lava Slimes (weak to Ice).
- **It fears:** fights too short to reach twelve.

Unlike Bonfire's smooth climb, its damage comes in pops.

**Threads.**
- **Chill to its cap and the shatter.** Anyone's Chill pays.
- **Many small applications:** basic attacks carrying Chill, fast weapons, multi-hits.
- **The Stun every shatter brings,** and what the party does to a stunned foe.
- **Sunder after a shatter** (Shatterpoint), so the gutted foe takes more.
- **A heavy blow on a frozen foe:** a thread nobody would look for.
- **Staggering the bursts across a pack,** or stacking them on one foe. Targeting decides which.

**Routes.**
- **Frostweaver, Hexer, Ranger.** Three Chill sources, and the shatters come fast.
- **Frostweaver between a Monk and a Bard carrying Chill on their weapons.** Fighters that never apply Chill feed the shatter: your run.
- **No Frostweaver: Hexer on a fast Ice staff, Monk, Geomancer with an axe.** Chill from basic attacks, and the war hammer's slow, heavy blows are the smash.

**Seats that suit it:**
- two frost seats that act often and carry Chill;
- a breaker seat that hits a frozen or stunned foe hardest.

**What it asks of a run.**
- **From what most runs find:** a Frostweaver, or one Chill piece on any fast unit. It pays a shatter or two a fight.
- **With specific pieces:** Chill on two units' basic attacks, and a payoff for hitting a stunned foe. Shatters every few ticks, across a pack.
- **At the far end:** a shatter that seeds the next. Chain shatters through a pack.

**Needs.**
- **Pieces:**
  - Chill on basic attacks for classes with fast weapons;
  - payoffs for hitting a stunned foe;
  - something that makes one shatter the start of the next.
- **Formations:** the breaker seat, and formations where one seat's hits set up another's.
- **Upgrades:** versions of Frost lance, Blizzard, Stillness, Shatterpoint, Cold hex and Frost arrow that aim at the foe nearest its shatter or spread the cold wide. A Frost version of Burning fist, which you liked, belongs here.
- **Its far end:** a shatter that seeds the next, and frost on every hit.

**Engine.**
- **Nothing new.** Hits on a stunned foe can already scale from the foe's state (Judgement does it for buffs).
- **A shatter that seeds the next:** content on the shatter's own trigger (a fixed amount of Chill to the shattered foe's neighbours).

**How sure.** Sure. It's the one combo you've played, and it shows in seed.

---

## 5. The Hunt

**Identity.** The pack singles one out. Every hit in the party goes to the same foe, often one in the back; it falls, and the next is marked. The number of foes drops one by one on a steady beat. It's waiting for the next kill.

**Rhythm.** A staircase: regular, medium turns, one per kill. Damage is concentrated. The danger is front-loaded and falls with each step, since each kill removes a source of damage.
- **It loves:** mixed groups with a dangerous back row (Archers, Liches, Bone Priests, Witches).
- **It fears:**
  - a lone boss: one step, and no staircase;
  - Ghouls, raised behind the hunt;
  - Taunting fronts, if it has no reach.

Harvest's opposite.

**Threads.**
- **Focus:** the party's picks agreeing. Empty today: basic attacks always go to a random foe.
- **Reach:** Seek past a Taunting front. Wind's job: quick, light, multi-hit, with Seek.
- **The weakest and the furthest back:** Backstab's lowest HP, the low-Aggro rows.
- **Kill rewards:** something back on each kill, so each step speeds the next.
- **Silence on the back row's casters.**
- **An answer for bosses:** damage that grows as the foe's HP falls, so a boss is a long staircase of its own.

**Routes.**
- **Valkyrie, Ranger, Assassin.** Gale spear's Seek, Hunter's eye, Backstab on the weakest: three ways past the front.
- **Monk, Assassin, Hoplite.** Pressure point's Seek and Backstab hunt while the Hoplite holds the front and Aspis covers the hunters.
- **Ranger, Stormcaller on a Wind staff, Paladin.** The hunt by arrow and wind, and Smite on the most dangerous foe, which is the hunt's own target.

**Seats that suit it:**
- a marker seat whose pick sets the target the others follow;
- a chaser seat with reach;
- a warden seat that holds the front.

**What it asks of a run.**
- **From what most runs find:** any Seek ability, or the Ranger. The back row dies first.
- **With specific pieces:** basic attacks that follow the marker, and a reward on each kill. Every kill speeds the next.
- **At the far end:** the whole party on one foe, and a kill that resets the hunt. Mixed groups fall in a drumbeat.

**Needs.**
- **Pieces:**
  - a way to make the party's basic attacks follow one target;
  - Seek on gear;
  - kill rewards that speed the next kill;
  - damage that grows as a foe weakens, for bosses.
- **Formations:** the marker seat, and formations that point the whole party at one foe.
- **Upgrades:** versions of Backstab, Gale spear, Garrote, Pressure point, Barbed arrow and Hunter's eye that change what they aim at.
- **Its far end:** the party's picks bound to one target, and a kill that sets up the next.

**Engine.**
- **Basic attacks aimed by a status (a mark): new.**
- **Changing a cooldown** (a kill gives some back): new, shared with Ambush and Overflow.
- **Damage from the foe's missing HP:** exists.

**How sure.** Fairly sure of the identity. Today it doesn't exist (it kills on everyone's schedule), so it lives or dies by the focus piece. Its boss answer is the weak point.

---

## 6. Harvest

**Identity.** The whole field falls together. Hits land on every foe at once, and nobody dies for a long time. All the HP bars sink in step. Then, in a few ticks, the field is empty. It's waiting for the sweep that finishes them all.

**Rhythm.** The Hunt's inverse: nothing, nothing, everything. One big, late turn. The danger stays full until the end, every foe alive and acting, so the party has to hold the whole field's pressure.
- **It loves:**
  - swarms and summons;
  - the Ghouls: they can't raise each other if they fall together.
- **It fears:**
  - Bomb Bugs (every blast at once);
  - Lava Slimes (a field that sinks evenly sends every slime below half, so every one splits);
  - a lone boss, where spread damage is no different from single.

**Threads.**
- **Area:** hits on every foe. Three mages have it; no physical unit does.
- **Spread:** Lightning's job, a strike that jumps (Arc, Chain lightning). Here Lightning is a theme without its status: Shock is optional.
- **Evening out:** aiming at the healthiest foe so the field sinks together. A targeting thread.
- **A physical sweep:** a blow that carries through to a second foe.
- **The draw:** one unit takes the field's attention so the others can spread.
- **A finisher:** something that ends every foe below a line at once.

**Routes.**
- **Stormcaller, Bard, Bramble knight.** Arc and chains spread, Thunder chord reaches everything, and the Bramble draws the swarm onto its thorns.
- **Pyromancer, Frostweaver, Paladin.** Two Area casters, with Sanctuary and Absolve holding the whole field's pressure.
- **Physical: Valkyrie and a Knight on blades that sweep, Hoplite.** A physical harvest. It doesn't exist yet; it's built from pieces.

**Seats that suit it:**
- a lightning-rod seat that draws everything;
- two scythe seats whose hits spread.

**What it asks of a run.**
- **From what most runs find:** any Area mage. Swarms die faster.
- **With specific pieces:** strikes that jump or sweep on units that aren't mages, and the evening-out targeting. The field falls together.
- **At the far end:** a finisher, and a sweep for physical units. Swarms are erased in a beat, and Ghouls are beaten clean.

**Needs.**
- **Pieces:**
  - physical blows that reach a second foe or every foe;
  - aiming at the healthiest foe;
  - a finisher for every foe below a line;
  - a payoff that grows with how many foes one action hit.
- **Formations:** the lightning rod, and formations that reward hitting many foes at once.
- **Upgrades:** versions of Arc, Chain lightning, Thunderstorm, Fireball, Blizzard, Thunder chord and Malison that even the field rather than pile on one.
- **Its far end:** a sweep for physical units, and a finisher for the whole field.

**Engine.**
- **Mostly nothing new.** Physical Area, a second target, the healthiest foe and "every foe below X" exist.
- **New:** a number that counts the foes an action hit.

**How sure.** Sure of the rhythm; it shows in seed. Unsure of the physical route, which is all pieces.

---

## 7. Ambush

**Identity.** The opening volley. The fight starts, and the party's first moments land at once: a blade from hiding, a first swing that lands like three, Haste on everyone. The fragile back of the foes' line is gone before it acts. Then a short scramble against what's left. It's waiting for the next fight to begin.

**Rhythm.** A spike at the first tick, then a thin tail. The danger is late: if the volley doesn't finish the fight, the party is exposed for the rest of it. One big turn, at the very start.

The volley comes from what happens when a fight starts, not from abilities, so it doesn't spend cooldowns and spends little MP. It pays in HP instead, in the exposed tail, and in what its pieces cost it: low fuel means the volley's power has to be bought with slots. It needs to come online, and a run that rotates its members won't play it every fight, which is what makes it hard to reach (your word).
- **It loves:** regular fights with fragile back rows (Archers, Liches, Wisps).
- **It fears:** long boss fights, Taunting fronts that catch the volley, and big lone foes with no back row.

Unlike the Hunt, which picks off one foe at a time all fight, it hits everything it can reach in the first moments and has little left after. Overflow's opposite: everything at once, against work that rolls on.

**Threads.**
- **The fight's start:** the busiest trigger in the game today, and one that doesn't care about cooldowns.
- **Hidden:** unseen at the start, and hitting harder while unseen.
- **The first swing:** a first action that lands bigger, and Might given at the start and spent by the first blow.
- **Haste and Shields at the start:** the volley comes sooner, and the party survives its own exposure.
- **Slot order:** which ability goes first when several are ready (your Raise in the first slot).
- **Carried cooldowns:** an ability saved from the last fight joins the volley; a spent one doesn't.

**Routes.**
- **Assassin, Geomancer, Ranger.** A knife from hiding, a crit from behind stone, arrows past the front.
- **Monk, Bard, Bramble knight.** The Bard's Haste and Might land at the first tick, the Monk's quick hits spend the Might, and the Bramble takes the counter-rush.
- **Valkyrie, Assassin, Cleric.** Gale spear and Backstab at the first tick, and Raise first in the order for whoever falls in the scramble.

**Seats that suit it:**
- an opener seat whose first action lands bigger;
- a second seat hastened at the start;
- a rear-guard seat shielded at the start, to hold after the volley.

**What it asks of a run.**
- **From what most runs find:** the slot order and any start-of-fight piece. Quicker first ticks.
- **With specific pieces:** a first swing that lands bigger, and Hidden and Haste at the start. The back row is gone before it acts.
- **At the far end:** an opening that clears most regular fights on its own. Regular fights end before most foes act; bosses still need the tail.

**Needs.**
- **Pieces:**
  - effects at the fight's start for more classes (Hidden, Haste, Might, Shields);
  - a first action that lands bigger;
  - something for the tail, so the build isn't all or nothing.
- **Formations:** the opener seat, and formations that put everything into the first moments.
- **Upgrades:** versions of Vanish, Backstab, Gale spear, Allegro and War ballad that favour the first moment.
- **Its far end:** an opening that clears a room, and a tail that isn't empty.

**Engine.**
- **Nothing new.** Effects at the fight's start exist, and a bonus that ends on the holder's first action is a status that removes itself.

**How sure.** Surer after your read. You see it as a shape you like: a build that has to come online, painful until it does, and hard to keep online in a run that rotates its members. Its volley comes from the fight's start rather than from cooldowns, so it doesn't lean on the bench. Its tail still needs a design, so it pays something before it's complete.

---

## 8. Overflow

**Identity.** A party that never stops casting. Spell names scroll one after another, and basic attacks are rare. Mana passes from ally to ally, and the casting moves with it: one member flares, cast after cast, while the others gather; then the next. Each cast leaves the next caster a little more. It's waiting for the mana to reach the next caster: at your word, those small moments are the payoff.

**Rhythm.** Waves that pass round the party: the damage comes from one member, then another, as the mana moves. Many small turns. Damage is high while the mana flows. The danger is a cliff: a Silence, a mana drain or an empty pool turns the party into staff-bonkers.

It spends MP and passes it round: the fuel is the engine, so its power follows how much fuel it moves. Your MP points (16 to 18) bear on it most. Its pieces are where the threshold you described (scarce early, steady once mana pieces arrive) gets crossed.
- **It fears:** Silence (the Wraiths, the Silent One), Leeches, and long boss fights.
- **It loves:** regular fights it can finish while the mana lasts.

Unlike Thousand Cuts, where every unit acts all the time and nothing passes between them, here the work moves from one member to the next, and you can watch it go.

**Threads.**
- **MP that flows:** Clarity, Refrain, Stand fast, Stillness, Blood gift.
- **Casting as a trigger:** empty today; nothing reacts to the party's own casts.
- **Costs that change:** empty; nothing changes an MP cost.
- **Cooldowns shortened or refunded.**
- **Haste on casters.**
- **"The ally with the least MP"** as targeting.
- **Mana as a damage stat:** max MP or MP spent.

**Routes.**
- **Bard, Frostweaver, Hexer.** Refrain and Stillness pass mana on, and the Hexer's Siphon feeds itself from foes, so the mana given goes to the other two.
- **Knight, Pyromancer, Cleric.** A wall's Clarity feeding two hungry casters.
- **Vampire, Stormcaller, Bard.** Blood gift's Clarity, the Stormcaller's Static charge hastening its casts, and Chain lightning on a loop.

**Seats that suit it:**
- a wellspring seat that gives mana;
- two spender seats whose casts are cheaper or come faster.

**What it asks of a run.**
- **From what most runs find:** MP regen gear, and a Clarity giver. The casters last another fight.
- **With specific pieces:** casts that give the next caster something (mana, a shorter cooldown). The party casts all fight.
- **At the far end:** mana as damage, and costs that fall as the party casts. A party that ends fights with more mana than it started with.

**Needs.**
- **Pieces:**
  - reactions to an ally's cast;
  - things that change MP costs;
  - cooldown refunds;
  - Silence answers on gear;
  - mana as a damage stat.
- **Formations:** the wellspring, and formations that move mana between seats.
- **Upgrades:** versions of Stand fast, Stillness, Refrain, Blood gift, Static charge and Chain lightning that pass on mana or tempo.
- **Its far end:** casts that pay for the next, and mana as damage.

**Engine.**
- **Changing a cost:** new, shared with Phoenix.
- **Changing a cooldown:** new, shared with the Hunt and Lockdown.
- **Reacting to an ally's cast:** exists.

**How sure.** Middling. It's the most engine-dependent of the twelve, and it could slide toward your "relay is too complicated". The guard is to keep every link small and local.

---

## 9. Lockdown

**Identity.** Hold them, then hit them. A foe's wind-up bar is struck down, or a Weaken lands. The moment a foe is disabled, the whole party piles in, and the numbers on a stunned, silenced, frozen or weakened foe come out bigger than anywhere else in the fight. Then the foe breaks free, and the party waits for the next opening. It's waiting for a foe to be disabled. At your word, it's about capitalizing on disabled foes, not about a permanent lock.

**Rhythm.** Lock, pounce, wait: a cycle. Damage comes in windows while a foe is disabled, and is small between them. The danger is held down while the locks land, and spikes when one slips and a cast lands. Many turns: each lock and each window is an event you can see. It spends MP on its locks to keep its HP.
- **It loves:** bosses and elites with big casts (the Fire Giant, Liches, the Silent One, the Ogre Chief's Crush).
- **It fears:** swarms (too many to lock), and the enrage, which catches long fights.

The Toll's opposite: deny every blow, against invite every blow.

**On permanent locks.** You've locked a boss down for a whole fight with Chill alone. Your fix (bosses and lone foes less open to control) is also what gives this build its rhythm: with it, a lock is a window, not the whole fight.

One way to do it, for later: each Stun or Silence a boss takes leaves it briefly resistant to the next. Locks then come on a beat the party can keep up but can't hold forever.

**Threads.**
- **Piling onto the disabled:** hits on a foe that's stunned, silenced, frozen, slowed or weakened. It's the build's payoff, and it's empty today.
- **Weaken:** a disable of its own. What does land, lands small, and the party knows where to pile on.
- **Interrupts:** Silence loses a wind-up, Stun pauses it, and Unmake waits for one.
- **Waiting for a wind-up:** only Unmake reads it today.
- **A slow instead of a shatter:** Ice as control. Chill slows on the way up, and Slow, which no class applies today, holds without bursting.
- **Concussion:** heavy blows that stagger.
- **Cooldowns:** locks have to come round as often as the boss winds up.
- **MP for the locks:** Clarity and Siphon.

**Routes.**
- **Knight, Hexer, Monk.** Shield bash, Unmake and Pressure point: three locks on three clocks.
- **Assassin, Geomancer, Frostweaver.** Garrote's Silence past the front, Tremor's Stun, and Chill's slow and its Stun.
- **Hexer, Paladin, Cleric.** The patient version: few locks, timed by upgrades that wait for a wind-up, Sanctuary's Ward on what slips through, and sustain for the leaks.

**Seats that suit it:**
- a warden seat whose locks come round faster;
- a watcher seat that waits for the cast;
- a gaoler seat that keeps the foes' attention on the one built to take it.

**What it asks of a run.**
- **From what most runs find:** any one Stun or Silence (six classes have one, counting the Frostweaver's shatter). A boss's big move is sometimes stopped.
- **With specific pieces:** locks that wait for a wind-up instead of firing at random, and a second lock on another clock. Big moves are stopped most of the time.
- **At the far end:** hits that land hardest on a disabled foe, and locks that come round with every opening. Each window takes a large share of a foe's HP.

**Needs.**
- **Pieces:**
  - payoffs for hitting a disabled foe, by whatever disabled it;
  - Weaken on more classes;
  - a slow that holds a foe without bursting it: Slow, which no class applies today (a Chill that never shatters would be a status of its own);
  - MP and cooldowns for the locks.
- **Formations:** the watcher seat, and formations that turn a disabled foe into everyone's target.
- **Upgrades:** "waits for a foe winding up" as one version of many control abilities. You proposed Shield bash doing this (Oct 28).
- **Its far end:** openings that land as the fight's biggest hits, and locks that come round with every opening.

**Engine.**
- **Likely nothing new.** "A foe is winding up" exists as a condition and a target; a foe gaining a Stun is an event; hits scaling from the foe's state exist.
- **Faster locks** need cooldown changes: new, shared.

**How sure.** Surer after your read. Framed around the windows, it doesn't need a permanent lock to work, and your fix for bosses gives it its beat.

---

## 10. The Toll

**Identity.** They hurt themselves. Foes crowd onto one unit, and every blow it takes comes back: Thorns flash, the attacker bleeds, it sparks when it moves next. The swarm that rushes the wall dies against it. It's waiting to be hit.

**Rhythm.** Damage follows how much the foes attack. Against a fast swarm it's huge and early, and the rush kills the rush. Against a single slow boss it's slow. The danger is all on the anchor; the rest of the party is almost untouched. Few turns. It spends the anchor's HP, not MP. Thorns cost nothing, so each one has to stay modest; the Toll's power comes from how often it's hit.
- **It loves:** Wolves, Hellhounds, Wisps, summoned waves.
- **It fears:**
  - slow single hitters (the Ogre Chief, the Fire Giant's few big casts);
  - Area attacks, which ignore the draw;
  - foes that don't hit: healers and cursers (Bone Priests, Witches) give the anchor nothing to return.

Today's read already shows it: Thorns are 22% of the party's damage against wolves, and 6% to 8% against bosses.

**Threads.**
- **The draw:** Taunt and Aggro. Two classes Taunt today.
- **Thorns, and retaliation as one idea:** being hit and dodging a hit both strike back. You proposed a shared word for Thorns and a riposte.
- **What an attacker carries away:**
  - Bleed (Briar);
  - Chill, which slows the next blow;
  - Shock, which it pays when it acts again.
- **Weaken.** Blows still land as often but hurt less, so the anchor survives and every blow still pays. Weaken is the Toll's best friend: it takes the danger out without taking out the blows. Your "Weaken in some sort of stall comp".
- **Guard and Armor** against many small hits.
- **Healing on the anchor.**
- **Evasion as the other anchor:** a dancer who dodges and answers.

**Routes.**
- **Bramble knight, Cleric, Stormcaller.** Thicket draws, Briar bleeds, Cure keeps it up, and Arc's extra hits burst the Bleed.
- **Knight wearing thorns, Hexer, Hoplite.** Stand fast draws; Enfeeble weakens the hardest hitter, and Malison's Shock on every foe makes each attack cost; Paired guard and Aspis keep the Knight standing.
- **The dancer: a Monk carrying a Taunt, Bard, Assassin.** Evasion high, dodges that strike back, Refrain mending the misses, and Backstab finishing the weakest.

**Seats that suit it:**
- an anchor seat that draws and returns;
- a warden seat that keeps the anchor standing;
- a free seat that finishes what the anchor started.

**What it asks of a run.**
- **From what most runs find:** the Bramble knight, or Thorns on anyone who Taunts. Swarms hurt themselves.
- **With specific pieces:** what attackers carry away, and Weaken on them. Swarms die on the wall.
- **At the far end:** retaliation that counts dodges too, and Thorns that grow with the beating. A wall even a boss's slow blows feed.

**Needs.**
- **Pieces:**
  - Taunt on gear, for more anchors;
  - retaliation on a dodge;
  - Thorns that grow per hit taken or from Armor;
  - pieces that make Weaken an advantage rather than a defence.
- **Formations:** the anchor seat, and formations built around one unit being hit.
- **Upgrades:** versions of Thicket, Briar, Bramble lash, Stand fast and Fortify that change who the anchor is and what it returns.
- **Its far end:** thorns that grow with the beating, and a dodge that strikes back.

**Engine.**
- **Nothing new.** Dodges already fire an event.

**How sure.** Sure. It shows in seed, and every piece it needs is content.

---

## 11. Blood Pact

**Identity.** Life spent and bought back. The party's HP bars swing hard. A unit pays a chunk of its life for a big blow, then drinks it back from foes, and heals pass from the reckless to the careful. The party fights low and ends full. It's waiting to be low enough for its payoffs (Bloodlust's half).

**Rhythm.** A see-saw: HP falls and rises several times a fight. Many medium turns. Damage is high and steady. The danger swings but rights itself, since the build heals by hitting.

It pays in HP where others pay in MP: a choice of fuel, not more of it. Its HP costs must buy what the MP would have, and it reaches for potions where others reach for tonics. HP carries between fights, so it has to end each fight topped up.
- **It loves:** long fights.
- **It fears:** Bats (a dodged hit drinks nothing), the Witch's curses (a weakened hit drinks less), and burst that catches it low.

Phoenix's sibling, with life instead of death.

**Threads.**
- **Lifesteal,** and healing received.
- **HP as a cost:** abilities paid in HP instead of MP. Only Blood gift has a price in HP today.
- **Below half as power:** Bloodlust.
- **Max HP as a damage stat:** Blood drain, Shield bash.
- **Dark's drain:** Siphon (mana drained), Weaken (strength drained).
- **A heal given as a trigger:** life passed on.
- **Regen,** refilling what the pact costs.

**Routes.**
- **Vampire, Cleric, Monk.** The Vampire pays and drinks, the Monk drinks fast with Lifesteal on its claws, and Cure and Renew catch the drop.
- **Vampire, Bramble knight, Valkyrie.** High HP and Regrowth beside the Vampire, and Rally passing life to whoever paid most.
- **No Vampire: Knight, Paladin, Monk with Lifesteal.** Max HP, Absolve healing itself and another, and a fist that drinks.

**Seats that suit it:**
- a bleeder seat that pays HP for power;
- a drinker seat that feeds on hits;
- a donor seat that passes life on.

**What it asks of a run.**
- **From what most runs find:** Lifesteal on any fast hitter. HP that carries better.
- **With specific pieces:** pieces paid in HP, and payoffs below half. Fights where the mana never runs out.
- **At the far end:** life as the party's one currency. The party ends every fight topped up, having spent half its HP twice.

**Needs.**
- **Pieces:**
  - abilities and effects paid in HP;
  - something that rewards a heal given;
  - below-half payoffs that don't leave the unit low for the next fight;
  - max-HP scalers.
- **Formations:** the bleeder seat, and formations where life moves between seats.
- **Upgrades:** versions of Blood drain, Blood gift, Frenzy, Bloodlust, Regrowth and Absolve that pay or pass life.
- **Its far end:** life as the only cost, and healing that turns into something more.

**Engine.**
- **HP as a cost:** new.
- **"A heal given"** (the healer's side of a heal): new and small.

**How sure.** Fairly. The HP-for-MP angle is what sets it apart under 5h. Without it, it's just Lifesteal.

---

## 12. Phoenix

**Identity.** The party that wins by falling. A member drops, and the party flares: the others harden and hit harder. Moments later the fallen stands up with everything ready and unloads. A death is a turn in the party's favour. It's waiting for someone to fall.

**Rhythm.** The danger is embraced and swings hard. Damage surges after each fall and each return. Turns are irregular and big, and the fight's story is told in knockouts.

It spends HP on its falls and MP on its returns (650 MP a revive under 5h, 1,500 on main today). A knockout carries into the next fight, so its pieces must bring the fallen back between fights as well as during them.
- **It shrugs at:** Doom. Against the Reaper, a Doomed unit is just the next turn.
- **It fears:** burst that drops two at once, and a Silence on the reviver.

**Threads.**
- **Revives,** and Einherjar's return with everything ready.
- **An ally's fall as a trigger.** Only two formations react today.
- **A revive as a trigger:** empty.
- **Low HP as power:** Last rites, Bloodlust. A unit near the end is at its best.
- **Sacrifice:** a unit that falls on purpose and hands its power on.
- **Light's restore and revive,** and the long, costly spell that hits very hard on the return.
- **Shields and Aegis on the survivors.**

**Routes.**
- **Valkyrie, Cleric, Assassin.** Two revives, and the Assassin falls and comes back with Vanish and Backstab ready.
- **Valkyrie, Vampire, Knight.** Bloodlust near the brink, Rally for the one who comes back low, and the Knight as the one who doesn't fall.
- **Cleric with Raise first in the order, Paladin, Pyromancer.** Raise brings the caster back on full cooldowns; a piece that returns it ready makes its first act a Fireball.

**Seats that suit it:**
- a martyr seat that falls first (it draws) and whose fall powers the others;
- a reviver seat whose revives come faster;
- a survivor seat that hardens when an ally falls.

**What it asks of a run.**
- **From what most runs find:** a revive (two classes, phoenix feathers). A knockout isn't the end.
- **With specific pieces:** reactions to a fall and to a return. Each death is a power spike.
- **At the far end:** a martyr who returns ready and stronger, and returns that cost less. A party that's strongest the second time round.

**Needs.**
- **Pieces:**
  - reactions to an ally's fall and to a revive;
  - returns that don't rest on a reviver's ability firing at the right moment, in a fight and between fights (your word: with fights automatic, Raise and Valhalla won't always fire when they're needed);
  - a return with everything ready for more than the Valkyrie;
  - something that makes coming back at low HP survivable into the next fight.
- **Formations:** the martyr and survivor seats, and formations that answer a fall.
- **Upgrades:** a revive for one more class, and versions of Raise, Valhalla, Einherjar and Last rites.
- **Its far end:** a return stronger than the fall, and a fall that doesn't stay.

**Engine.**
- **Mostly nothing new.** A fall, a revive and a return with actions ready all exist. The martyr falls first by draw, not by choice, since there's no control in fights.
- **Returns that cost less** need cost changes: new, shared with Overflow.

**How sure.** Less unsure after your read. The two risks (knockouts and low HP carried between fights, and the price of a revive) have answers in pieces and formations, as you said. I'd still want a fight read with a hand-built party before step 4 commits pieces to it.

---

## The web

### Threads the builds share

Each thread is listed with the builds it matters most to, and the builds it matters some to. A piece made on a thread reaches every build in its row, by different amounts and for different reasons.

| Thread | Matters most to | Matters some to |
| --- | --- | --- |
| The draw (Taunt, Aggro) | Toll | Landslide, Harvest, Bonfire, Lockdown, Phoenix (the martyr) |
| Shield | Landslide | Phoenix, Ambush, Toll |
| Armor and Guard | Landslide, Toll | Lockdown |
| Might | Landslide (the slow hitter) | Ambush (the first blow), Phoenix (on a fall), Bonfire |
| Haste | Thousand Cuts | Bonfire, Overflow, Ambush |
| Riders on basic attacks | Thousand Cuts, Cold Snap | Bonfire, Toll |
| Many hits, extra strikes | Thousand Cuts | Cold Snap, Harvest |
| Crits | Landslide | Ambush, Hunt, Thousand Cuts |
| Stun | Lockdown, Cold Snap | Landslide (its heaviest blows) |
| Silence | Lockdown | Hunt (the back row) |
| Wind-ups | Lockdown | Landslide, Bonfire |
| Cooldowns | Overflow | Lockdown, Hunt, Ambush (one saved for the volley) |
| MP flow | Overflow | Lockdown, Bonfire, Phoenix, Blood Pact (by paying HP instead) |
| HP spent, low HP | Blood Pact, Phoenix | Landslide (max HP into the stone and the blow) |
| Heals | Blood Pact | Phoenix, Toll |
| Kills as triggers | Hunt, Bonfire (the fire passing on) | Harvest (the finisher) |
| Area and spread | Harvest | Cold Snap, Bonfire |
| Focus and targeting | Hunt | Cold Snap, Harvest (evening out), Landslide (aiming the blow) |
| Seek and reach | Hunt | Ambush, Lockdown |
| Bleed | Thousand Cuts | Toll, Hunt |
| Burn | Bonfire | Thousand Cuts' magical route (Kindling) |
| Chill | Cold Snap | Lockdown (the slow), Toll (the attacker slowed) |
| Shock | Toll (the attacker pays) | Harvest, Overflow |
| Sunder | Cold Snap | Thousand Cuts (against Armor), Hunt |
| Weaken | Toll | Lockdown, Blood Pact |
| Evasion and dodges | Thousand Cuts, Toll (the dancer) | |
| Lifesteal | Blood Pact | Thousand Cuts |
| Falls and revives | Phoenix | Ambush (a revive in the first slot) |
| The fight's start | Ambush | Landslide, Phoenix |
| Knockouts and cooldowns carried into the next fight | Phoenix | Ambush (a cooldown saved for the volley), Overflow |

**Elements as themes.** Since Oct 29 the game has two kinds of damage, physical and magical, and no elements or physical subtypes as mechanics (`intent.md`). An element survives as a class's or a build's theme:

| Theme | Its builds | Its status |
| --- | --- | --- |
| Earth: weight, Shields | Landslide; Toll (thorns) | Earth has none |
| Fire: ramp, big casts | Bonfire; Harvest (Fireball as one of the field's sweeps) | Burn: Bonfire's, and a little in the magical torrent |
| Ice: control and shatter | Cold Snap (the shatter); Lockdown (the slow, no shatter needed) | Chill: a payoff in one, a lock on the way up in the other |
| Lightning: spread, quick strikes | Harvest; Thousand Cuts' magical route; Toll's spark | Shock optional in Harvest, central to none |
| Wind: reach, Seek | the Hunt; Thousand Cuts | Wind has none |
| Light: restore, the costly blow | Phoenix; Landslide (Smite) | Light has none |
| Dark: drain | Blood Pact; Lockdown and Toll (Weaken) | Dark has none |

### Formations: what they can be

A formation is a shape: three seats and, if it wants, rules of its own. It gives a squad an identity and a fantasy (the philosophy). It joins the web two ways:
- **through seat roles that many builds share,** so one formation suits several builds;
- **through its own identity,** which is what makes it more than a sum of seats.

**What a formation is allowed to be.** A range, not a menu; any formation takes what its shape needs:
- **Its seats can change anything about the unit in them:**
  - stats and special stats;
  - statuses, at the start or on a trigger;
  - how the unit acts: what it aims at, how fast it acts, what it waits for;
  - what its hits carry;
  - how it reacts.

  A seat can also do nothing.
- **Its seats needn't match.** One seat can hold most of the formation's power while the others serve it. Two can mirror each other. One can work only through another. One can carry a cost the others profit from.
- **Its seats can depend on who sits there:** a class, a kind of weapon or armor, having a kind of ability, or what another seat is doing. A formation can be strong for one kind of unit in one seat and plain for anyone else.
- **Its roles can be shared or its own.** The table below lists the roles the builds share. A formation can also have a role found nowhere else, or break a shared role's usual pattern.
- **It can have effects on the whole party:** always, on a condition, or on a trigger; a stat, a status, or a rule that changes how the party fights. It can have several, or none.
- **It can give something up:** a drawback, a seat that costs, a rule that cuts both ways.
- **Every effect is phrased so the player knows what will happen,** at whatever length that takes.

**The roles the builds share.** This is how most formations reach several builds. A formation's own effects and custom roles are what make it itself.

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

**Shapes.** A formation's shape is what its three seats add up to: how the party's power and danger are spread across them, and what the formation as a whole makes the squad do. There will be many shapes.

**What that means for a run:**
- **No build fishes for one formation.** Each build is helped by several formations, in different ways, and most formations suit several builds. A build plays in Neutral, gets more from a formation with its seats or a party effect it wants, and most from one built further in its direction. That's its ask range, as with gear.
- **Rarity follows the philosophy:** common, rare and legendary. Common formations lean on shared roles and plain party effects. Rare and legendary ones go further: lopsided seats, seats that depend on who sits there, rules that change how the party fights. No mythic formations in this pass (your word).
- **A new formation is a door.** You said a new formation makes you rethink your party. In the web, it's one of the ways a run drifts from one build to its neighbour.

### Shared needs, and why each build wants them

These are the needs step 4 builds once and pays off in several builds. Each build wants the same need for its own reason, which is what makes a shared piece worth a different amount in each.

| Need | The builds that want it, and why |
| --- | --- |
| Taunt on gear | the Toll, to return the blows; Landslide, to keep them on the stone; Phoenix, to choose who falls; Harvest, to hold the whole field; Bonfire, to hold the early fight |
| Payoffs for hitting a stunned or silenced foe | Cold Snap, after each shatter; Lockdown, to turn its locks into damage; Landslide, after its heaviest blows stagger |
| A dodge that pays | Thousand Cuts, as one more hit; the Toll, as the dancer's riposte |
| Riders on every hit, extra strikes included | Thousand Cuts, for the count; Cold Snap, for the Chill; Bonfire, for the Burn |
| A unit's basic attacks reshaped | Landslide, slower and bigger; Thousand Cuts, faster and smaller (one lever, pulled two ways: a choice between builds) |
| Kills that give something back | the Hunt, to speed the next kill; Bonfire, to pass the fire; Harvest, to finish the field |
| Changing a cooldown | Overflow, to keep casting; Lockdown, to keep up with the boss; the Hunt, to reset on a kill |
| Max HP as a stat that does something | Landslide, into the stone and the blow; Blood Pact, as the pool it spends |
| Effects at the fight's start | Ambush, for the volley; Landslide, for the stone; Phoenix, for the survivors' cover |
| Reactions to an ally's fall or return | Phoenix, as its turns; the Toll, when the anchor falls and someone must take its place |
| Seek on gear | the Hunt, for reach; Ambush, so the volley isn't caught by the front; Lockdown, to reach the caster behind a wall |
| Something that changes an MP cost | Overflow, as its engine; Phoenix, for cheaper returns; Lockdown, for more locks |

### Where a run drifts from one build to another

A run finds its build in what it's given. These are the doors between builds: a piece that matters to both, so a run can start on one and end on the other.
- **Cold Snap into Lockdown, through Stun.** A Frostweaver run that finds payoffs for hitting stunned foes, and a Knight, stops chasing bursts and starts holding foes.
- **Thousand Cuts into the Toll, through Evasion.** A dodgy Monk finds a Taunt and becomes the dancer anchor.
- **Thousand Cuts into Cold Snap, through basic-attack riders.** A blur party picks up a Chill rider, and the shatters start. This is the door you walked through.
- **The Hunt into Bonfire, through kills.** A hunt that finds fire that passes from the dead: its steady beat starts to speed up.
- **The Hunt into Ambush, through Hidden and reach.** A hunter that opens from hiding.
- **Landslide into the Toll, through Armor.** Thorns that grow from Armor turn the stone wall into a thorn wall.
- **Landslide into Ambush, through the stone at the start.** Shields and Might at the first tick, on the slowest hitter: the one huge blow, struck first.
- **Blood Pact into Phoenix, through low HP.** A pact party that falls and comes back.
- **Overflow into Lockdown, through MP and cooldowns.** Mana that feeds locks instead of damage.
- **Overflow into Bonfire, through hungry casts.** Mana makes the fire catch sooner.

### Builds nobody planned

These come from pieces meeting by chance. Step 4 should make them possible, not design them:
- **The frozen gate (the Toll with Cold Snap).** An anchor whose attackers carry Chill away, beside anything that pays on a shatter. The wall freezes its attackers until they burst.
- **The second volley (Phoenix with Ambush).** A unit that returns with everything ready opens the fight a second time, in the middle of it.
- **The opening freeze (Ambush with Cold Snap).** Chill at the first tick, so the first shatters come before the foes have acted.
- **The thorned pact (the Toll with Blood Pact).** An anchor that lives below half on purpose, where the pact's payoffs switch on, while its Thorns do the killing.

### Abilities that sit between builds

The philosophy wants each ability's two versions to pull toward different builds. These abilities already sit on a border, so their versions have somewhere to go. Step 4 designs them; this only says where they point.

| Ability | Between |
| --- | --- |
| Shield bash | Landslide (the blow) and Lockdown (the lock) |
| Earthen shell | Landslide and Phoenix (the survivors) |
| Thicket | the Toll and Landslide |
| Fortify | Landslide (Guard on the Armor-scaler) and the Toll (Guard on the anchor) |
| Aspis, Paired guard | the Toll (over the anchor) and Bonfire (holding the early fight) |
| Frost lance | Cold Snap and Lockdown |
| Pyre | Bonfire (on the hottest foe) and Harvest (on every foe, half as hard, as in the Wildfire version you liked) |
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

## Gear

Settled with the director on Oct 29, in a session of its own. This section is who shares which kinds of loot in the rogue's four slots: weapon, armor, offhand and amulet. It designs no pieces.

The build routes above still name today's weapons, and the Hexer and Geomancer before their re-theme. Read them through this section.

`npx tsx src/gear-slots.ts` holds the tables below as data, and recounts every width and overlap after a change.

### Rules the slots keep

- **Slots have no job.**
  - Any kind of effect can sit on any slot.
  - Stats lean softly by slot: Armor more often on armor, damage on weapons.
  - Nothing says what a slot, a kind or a piece is "for".
- **Only weapons carry inherent behaviour:** a speed, a damage type (physical or magical) and a number of hands. A two-hander empties the offhand, so its pieces are designed to be worth a weapon and an offhand.
- **Every piece fits exactly its kind's classes,** and its card says who can wear it. A mythic fits one class.
- **Every class has at least one kind in every slot,** including a one-handed weapon, so it can always use an offhand.
- **Two classes share at most two kinds.** The cap keeps every class's loot mostly its own. It costs the Bard the dagger it has today; with it, the Bard and Ranger would share the dagger, the bow and Leather.

### The shape

Armor groups classes by weight. Weapons and offhands cut across those groups.

| Slot | Kinds | Classes per kind | Kinds per class | Other wearers of a piece in a roster of five |
| --- | --- | --- | --- | --- |
| Weapon | 11 (13 today) | 2 to 4 | 2 | 0.5 |
| Armor | 4 | 5 each | 1 to 2 | 1.1 |
| Offhand | 10 | 2 to 3 | 1 to 2 | 0.3 |
| Amulet | 1 | all 16 | 1 | 4 |

- **The last column:** when a piece drops for one member of a five-class roster, how many of the other four can wear it too, on average.
- **Overlaps:**
  - Of the 120 pairs of classes, 57 share nothing, 38 share one kind and 25 share two.
  - Every class shares something with five to twelve others.
  - For every class, no other class can wear more than half of its kinds.
- **Apart where it counts:** 59% of the pairs of kinds from different slots never meet on one unit, so pieces in them can be strong together without ever stacking.
- **How much a run shows:** at about 110 pieces seen a run (5h's volumes, raised a third for the fourth slot), each fighter sees about half of what it can wear in each slot.

### Weapons

| Kind | Speed | Damage | Hands | Classes |
| --- | --- | --- | --- | --- |
| Dagger | fast | physical | one | Assassin, Ranger, Hexer |
| Fist weapons | fast | physical | one | Monk, Vampire |
| Sword | medium | physical | one | Knight, Bramble knight, Assassin |
| Spear | medium | physical | one | Hoplite, Valkyrie, Monk |
| Bow | medium | physical | two | Ranger, Bard |
| Great weapon (axe, hammer, pike, scythe) | slow | physical | two | Knight, Hoplite, Geomancer, Vampire |
| Rune sword | medium | magical | one | Paladin, Valkyrie, Hexer, Geomancer |
| Mace | slow | magical | one | Cleric, Paladin |
| Wand | fast | magical | one | Pyromancer, Stormcaller, Bard |
| Rod | medium | magical | one | Frostweaver, Stormcaller |
| Staff | slow | magical | two | Cleric, Frostweaver, Pyromancer, Bramble knight |

- **Magical damage belongs to the kind,** like speed.
  - The seven elemental staves are gone.
  - The rune sword (the director's name) and the mace are magic in a fighter's hand.
  - The wand, rod and staff are the casters'.
  - The four casters each hold a different pair from the wand, rod, staff and mace, so no two share more than one.
  - Scaling stays: physical kinds from Attack, magical from Magic, unless a piece names another stat.
- **Variety within a class:** each class's two kinds differ in speed, damage or hands.
- **Variety between classes:** the 16 classes have 14 different weapon patterns.
- **Builds' reach:**
  - nine classes can go slow (Landslide);
  - eight can go fast (Thousand Cuts, Cold Snap's frost seats);
  - ten have a two-hander.
- **Re-themed at the director's word:** the Hexer as a spellblade (dagger or rune sword, in Mail) and the Geomancer as an earth fighter (great weapon or rune sword, in Plate). Their kits and stats follow in the cleanup step: the Geomancer's Tremor comes off Magic, and the name may change.

### Armor

| Type | Classes (second type in brackets) |
| --- | --- |
| Plate | Knight, Hoplite, Geomancer, Bramble knight, (Paladin) |
| Mail | Paladin, Valkyrie, Vampire, Hexer, (Bramble knight) |
| Leather | Ranger, Monk, Assassin, Bard, (Valkyrie) |
| Robes | Cleric, Pyromancer, Frostweaver, Stormcaller, (Bard) |

- **Types replace weights:** a class wears only its types, and today's "or anything lighter" goes.
- **Robes is the tightest group.** 9 of its 10 pairs share two kinds: one armor, and weapons drawn from the same few magical kinds. It's accepted because the casters are the most alike classes. If it reads muddy once pieces exist, the first cut is the Bard's Robes second.

### Offhands

| Kind | Classes | Why these classes |
| --- | --- | --- |
| Kite shield | Knight, Paladin | protectors who shelter the party |
| Round shield | Hoplite, Valkyrie | spear fighters who cover an ally |
| Horn | Knight, Bard | both hand an ally mana |
| Tome | Frostweaver, Bard | both work on the whole field at once |
| Lantern | Paladin, Pyromancer | holy light and fire, and both set foes burning |
| Relic | Cleric, Valkyrie | the two revivers |
| Bell | Monk, Cleric, Stormcaller | each sets its own tempo |
| Totem | Bramble knight, Ranger, Geomancer | the wild and the earth |
| Vial | Assassin, Vampire | poison and blood: hits that pay them back |
| Idol | Hexer, Vampire | the dark arts, and both weaken foes |

The last column is why the classes are alike, not what the kind is for. A kind's pieces can be anything. If they all followed this column, the kind's name would become the signpost that cards avoid.

### The amulet

- **It fits everyone,** so a run that switches units around never loses one. That's why it's valuable.
- **It's a small part of the stock and the offers:** about a tenth of the stock and 15% of offers. A fighter still sees more amulets than anything else.
- **No amulet names one class's ability.** It would be dead on fifteen classes and point at the sixteenth.
- **It's the rule slot today** (17 of the 29 rogue rule pieces). Now that every other slot has narrow kinds, a piece meant for a few classes has a better home there.

### Rarity and mythic

- **Rarity is mostly how far a piece bends the game and how specific it is,** within its kind. Pieces below legendary carry effects too, and there are no random affixes on rare and legendary pieces.
- **A mythic reaches into one class's kit.** A legendary bends the game for whoever wears it; a mythic rewrites a class.
  - It fits one class and can sit in any slot. A mythic weapon has its own speed, damage and hands.
  - A unit wears one at most.
  - There's one per class to start (16), each pulling toward one of the class's builds, offered in act II and III boss boons.
- **Mythics against upgrades:** an upgrade is trained, and changes one ability or the passive. A mythic is found, can be taken off, and goes past any one ability. Step 4 designs both together so they don't overlap.

### Each class

What it can wear, with the other classes that share each kind. Every class also wears every amulet.

| Class | Weapons | Armor | Offhand |
| --- | --- | --- | --- |
| Knight | Sword (Bramble knight, Assassin); Great weapon (Hoplite, Geomancer, Vampire) | Plate (Hoplite, Geomancer, Bramble knight, Paladin) | Kite shield (Paladin); Horn (Bard) |
| Cleric | Mace (Paladin); Staff (Frostweaver, Pyromancer, Bramble knight) | Robes (Pyromancer, Frostweaver, Stormcaller, Bard) | Relic (Valkyrie); Bell (Monk, Stormcaller) |
| Ranger | Dagger (Assassin, Hexer); Bow (Bard) | Leather (Monk, Assassin, Bard, Valkyrie) | Totem (Bramble knight, Geomancer) |
| Bramble knight | Sword (Knight, Assassin); Staff (Cleric, Frostweaver, Pyromancer) | Plate (Knight, Hoplite, Geomancer, Paladin); Mail (Paladin, Valkyrie, Vampire, Hexer) | Totem (Ranger, Geomancer) |
| Hoplite | Spear (Valkyrie, Monk); Great weapon (Knight, Geomancer, Vampire) | Plate (Knight, Geomancer, Bramble knight, Paladin) | Round shield (Valkyrie) |
| Paladin | Rune sword (Valkyrie, Hexer, Geomancer); Mace (Cleric) | Plate (Knight, Hoplite, Geomancer, Bramble knight); Mail (Valkyrie, Vampire, Hexer, Bramble knight) | Kite shield (Knight); Lantern (Pyromancer) |
| Valkyrie | Spear (Hoplite, Monk); Rune sword (Paladin, Hexer, Geomancer) | Mail (Paladin, Vampire, Hexer, Bramble knight); Leather (Ranger, Monk, Assassin, Bard) | Round shield (Hoplite); Relic (Cleric) |
| Bard | Bow (Ranger); Wand (Pyromancer, Stormcaller) | Leather (Ranger, Monk, Assassin, Valkyrie); Robes (Cleric, Pyromancer, Frostweaver, Stormcaller) | Horn (Knight); Tome (Frostweaver) |
| Hexer | Dagger (Assassin, Ranger); Rune sword (Paladin, Valkyrie, Geomancer) | Mail (Paladin, Valkyrie, Vampire, Bramble knight) | Idol (Vampire) |
| Monk | Fist weapons (Vampire); Spear (Hoplite, Valkyrie) | Leather (Ranger, Assassin, Bard, Valkyrie) | Bell (Cleric, Stormcaller) |
| Assassin | Dagger (Ranger, Hexer); Sword (Knight, Bramble knight) | Leather (Ranger, Monk, Bard, Valkyrie) | Vial (Vampire) |
| Vampire | Fist weapons (Monk); Great weapon (Knight, Hoplite, Geomancer) | Mail (Paladin, Valkyrie, Hexer, Bramble knight) | Vial (Assassin); Idol (Hexer) |
| Pyromancer | Wand (Stormcaller, Bard); Staff (Cleric, Frostweaver, Bramble knight) | Robes (Cleric, Frostweaver, Stormcaller, Bard) | Lantern (Paladin) |
| Frostweaver | Rod (Stormcaller); Staff (Cleric, Pyromancer, Bramble knight) | Robes (Cleric, Pyromancer, Stormcaller, Bard) | Tome (Bard) |
| Stormcaller | Wand (Pyromancer, Bard); Rod (Frostweaver) | Robes (Cleric, Pyromancer, Frostweaver, Bard) | Bell (Monk, Cleric) |
| Geomancer | Great weapon (Knight, Hoplite, Vampire); Rune sword (Paladin, Valkyrie, Hexer) | Plate (Knight, Hoplite, Bramble knight, Paladin) | Totem (Bramble knight, Ranger) |

**Every class is in the routes of four to eight builds.** The Knight, Cleric, Bard and Monk are in eight; the Geomancer, Ranger, Vampire, Frostweaver and Bramble knight in four.

### What it asks

- **Schema:**
  - an `offhand` slot;
  - weapon kinds with a speed, a damage type and hands (no element or subtype);
  - four armor types in place of weights;
  - offhand kinds;
  - each class's kinds in every slot;
  - a mythic rarity that names one class;
  - a two-hander emptying the offhand.
- **The cleanup step:** the Hexer's and Geomancer's new kits and stats.
- **Interface:** a fourth slot, with the offhand shown locked under a two-hander; a colour for mythics. The director sources the art for the new weapon kinds and the ten offhands.
- **5h's loot numbers:**
  - **Volume:** a third more gear, about 37 pieces taken and 110 seen a run.
  - **Offers:** a slot first (weapons and offhands 30% each, armor 25%, amulets 15%), then a class as 5h does now, then a kind that class wears.
  - **Stock to start:** 8 pieces a weapon kind, 12 an armor type, 8 an offhand kind and 24 amulets, about 240, plus 16 mythics.

### Still open

- **Fits at a glance:**
  - the Cleric's mace dealing magic;
  - the Geomancer's rune sword;
  - the Bard's wand;
  - the Vampire's great weapon;
  - the Bramble knight's staff (at Magic 2, a weak option).
- **Two-handers:** whether a piece can be worth two without being dead or mandatory. Step 4's test parties will show it.

## What the builds say about rarity and difficulty (your round-5 notes)

- **Rarity (points 21 and 22).** Every build's first rung starts from what most runs find. If only legendaries carry effects, every build starts at a legendary, and you get what you described: one legendary and everything else a sidegrade. So pieces below legendary have to carry effects too: small ones that start a build. The rarest pieces are the far end. How the rarities divide each kind's stock is step 4's.
- **Difficulty (point 25).** Each build's far end is meant to be much stronger than today's parties. Step 4 tests with these routes as hand-built parties, at each rung. After the content is in, it runs the full difficulty pass you asked for, aimed harder than today's target. Your round-5 play says today's target is too easy for a human.

## Checks on the whole set

- **The rhythms spread across the space:**
  - **Damage:**
    - at the start: Ambush;
    - even: Thousand Cuts;
    - in waves passing round the party: Overflow;
    - rising, with kills that speed up: Bonfire;
    - in bursts: Cold Snap;
    - in steady steps: the Hunt;
    - all at the end: Harvest;
    - rare and huge: Landslide;
    - following the foe: the Toll;
    - surging after a fall: Phoenix;
    - see-sawing: Blood Pact;
    - in windows on disabled foes: Lockdown.
  - **Danger:**
    - early: Bonfire, the Hunt;
    - late: Ambush, Overflow;
    - held down, with spikes: Lockdown;
    - on one unit: the Toll;
    - full until the end: Harvest;
    - swingy: Blood Pact, Phoenix.
  - **What it spends:**
    - HP: the Toll, Thousand Cuts, Ambush, Blood Pact;
    - MP: Overflow, Lockdown, Landslide, Bonfire;
    - both: Cold Snap, the Hunt, Harvest, Phoenix.

  This is asserted for eight of them: the quick read shows a seed for only four. Step 4's rhythm check is where the rest are shown or not.
- **Every class is in some builds, with routes into more than one:** four to eight builds each.
- **Elements are themes, not only statuses:**
  - Earth, Wind, Light and Dark have no status, and each shapes a build anyway.
  - Ice runs two builds that feel nothing alike: bursts against denial.
  - Lightning's main build leaves Shock optional.
- **Builds that share an element or a mechanic feel nothing alike:**
  - Chill: Cold Snap's bursts, Lockdown's slow, the Toll's slowed attacker.
  - Kills: the Hunt's steady beat, Bonfire's speeding one, Harvest's all at once, Ambush's spike.
  - HP: Blood Pact's see-saw, Phoenix's deaths.
  - Shield: Landslide's stone, Phoenix's survivors.
- **No two builds differ only by the damage type on the numbers.** Thousand Cuts has a physical and a magical route, but that's one build with two answers to Armor, not two builds.

## Set aside, and why

- **A wither build** (Dark attrition: foes weaken, slow and drain while the party sits full). It shares Lockdown's danger shape and the Toll's long fights. Its threads (Weaken, Siphon, Slow) are spread across the Toll, Lockdown and Blood Pact instead.
- **A radiance build** (healing stored and released as a Light blow). Its rhythm, quiet then huge, is Landslide's. Light shapes Phoenix instead.
- **A gambler** (crits on everything, fights won in ten ticks or lost). Landslide's and Ambush's crits cover it. It may come back as exotics.
- **Exotics** belong to no build by design. Step 4 adds them.

## Engine additions, gathered

**New (seven, the last small):**
1. Changing a cooldown: refunded or shortened. For Overflow, Lockdown and the Hunt.
2. Basic attacks aimed by a status on a foe (a mark). For the Hunt.
3. Changing an MP cost. For Overflow and Phoenix.
4. HP as an ability's cost. For Blood Pact.
5. Reading the other unit of an event, such as a dying foe's stacks, to pass them on. For Bonfire.
6. A number that counts the foes an action hit. For Harvest.
7. "A heal given," from the healer's side. For Blood Pact. Today the healed unit hears a heal, but the healer doesn't.

**Already in the engine, waiting for content.** These are rows the gap map marked empty:
- reacting to a dodge, a foe gaining a Stun or Silence, a revive, an ally's cast, a Shield breaking;
- hits that scale from the foe's state (stunned, silenced, below half);
- physical Area and a second target;
- aiming at the healthiest foe;
- riders on extra strikes;
- effects at the fight's start, and power that builds on a timer.

## For step 4

- **Test parties:** each build's routes, as hand-built parties, at each rung of what it asks.
- **Pieces, formations and upgrades:** built backwards from the needs above, in the gear structure above. The shared needs come first, since each pays off in several builds.
- **A rhythm check:** the quick read here (`npx tsx src/rhythm-read.ts`), rerun with those parties in place of today's trios. Each build should land where the rhythm table puts it, and away from the others. Today they all sit on top of each other.
- **Then the difficulty pass** your round-5 notes ask for.
