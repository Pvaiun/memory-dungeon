# Gear design: the builds

The nine builds the gear, formations, upgrades and mythics are designed from, and the web between them: roads, the doors between them, and engines. What a build is, and what rhythm means, is in *Gear design: philosophy*; the rules the loot follows are in *Gear design: the loot*.

Each build is a way to play, with its rhythm, threads, routes, rungs and needs. No pieces and no numbers. Each one also says how a player finds it at each phase of a run, how it stays alive, and what it asks of the kits. Two changes to the kits come with them: **Marked takes the party's random picks** (abilities aimed at a random foe follow the Mark as basic attacks do, inside the Taunt rule, and an ability with a target phrase of its own keeps it), and **the Hexer's Malison pays for breadth** (it does more for each different affliction a foe holds, as its own damage, in place of adding one more stack of each).

The loot is made from these nine: each item's designer tags (`SERVED`, from its Serves line) name the roads, rungs and engines it serves, and the build test's parties (`tools/build-parties.ts`) play each road's three routes.

## The frame

**What a build is** (*Gear design: philosophy*): a way to play you can watch, with a rhythm, woven from several threads, reached by more than one route, in rungs.

**The web has three things:**
- **A road** is a build: broad, easy to see, with a shape and a rhythm.
- **A door** is where a run drifts from one road to its neighbour, through something both want.
- **An engine** is a found synergy, designed in advance for a player to find, on one road or more (*Engines*).

**What a run gives a build.** The rungs are written against the three phases of a run:
- **Act I:** three units knowing an ability or two each, a weapon each and a piece or two more by the boss, mostly in Neutral. A build can show its direction here. It can't be assembled.
- **Act II:** most slots filled, a version or two a unit, formations, a mythic. This is where a build is built.
- **Act III:** whole kits and legendaries. The far end.

**Left unjudged until the playtest:** kits arriving one ability at a time, and cooldowns carrying. The set is written to hold either way.

**A wall is not every build's start,** and neither is a front seat: a wall at the start of every build would make every run feel the same. Staying alive without one isn't the builds' to solve, and not the knobs' either: a party without a wall loses far more of act I's regular fights than one with, at any knob, and the director will fix that by other means (`docs/rules.md`).

**What every build answers:**
- **Through a run:** its three rungs as the first step, the build and the far end. Each says what the player sees, what the step is and what it pays if the run goes no further. A first step doesn't have to point the way (`docs/rules.md`: builds are found, not picked); it has to be seen when it fires.
- **Stays alive:** what the build itself brings to keeping the party standing.
- **Packs and bosses:** it has a game for both, and says which is its worse fight. Bosses and pairs of elites are where most runs ended in play.
- **Asks of the game:** kit or rule changes.

**What every build asks of the loot,** so it isn't repeated nine times:
- **An effect big enough to be seen when it fires.** In play a few Might, a tenth off a cost and a cooldown a few ticks closer were never seen to happen.
- **A first step that doesn't cost the party its safety.** In act I a careful party takes defence first, and it's right to.
- **Pieces on every thread, not one.** Only about a third of a build's pieces name its keyword; the rest sit on its other threads (each build's *Threads*), and a thread two builds share is a door between them. Builds may be much less clearly signposted if that makes them deeper.
- **Formations it can work out.** Nine formations are a road's own keyword shape; most are shapes a build has to find its use for (*Gear design: the loot*, Formations).

## The rhythm space

| Build | Shape | Damage over a fight | Danger | Turns | What it spends |
| --- | --- | --- | --- | --- | --- |
| **Landslide** | two load, one strikes | long quiet, then one huge number | steady, soaked by stone | few, big | MP on stone, to save HP |
| **Thousand Cuts** | one opens, all pour | spikes when a wound opens, in a dense stream of small hits | even, and paid back hit by hit | each wound opened | HP: little casting |
| **Bonfire** | three feed one fire | as high as the party is feeding it right now; it leaps when casts land together | early, and whenever the fire sags | each flare, and the blow that reads it | MP, on the feeding |
| **Cold Snap** | two lay frost, one breaks | bursts on a beat you can count | falls as the field slows | many, medium: each shatter | MP |
| **The Storm** | three charge the field | follows how much the foes act | spread, and highest while a pack still stands | whenever a foe moves | MP, on the spread |
| **The Hunt** | three on one foe | a volley at the first Mark, then a staircase of kills | early, falling with each kill | regular: each kill | both: HP in the first moments, MP on reach |
| **The Toll** | one is struck, two profit | follows how much the foes attack | all on one unit | few | HP: the anchor's |
| **Barrage** | two serve one caster | in salvos from one unit | a cliff when the mana or the caster stops | each salvo | MP, more than any other |
| **Blood Pact** | one pays, one drinks, one gives | high and steady | swings and rights itself | many, medium | HP, in place of MP |

**Four of the nine are a status's road.** Their status comes mostly from the kits; the loot spreads their pieces across the roads' other threads (tempo, spread, aim, readers), so a run finds its fire or its frost as much as it picks it. What keeps the four from being one build in four colours is that each status is set off by a different clock:

| Road | Its status | The clock |
| --- | --- | --- |
| Bonfire | Burn | the party's feeding: it dies unless it's kept up |
| Cold Snap | Chill | its own count: it builds until it breaks |
| Thousand Cuts | Bleed | the party's hits: opened once, cashed by every hit after |
| The Storm | Shock | the foes' actions: everything they do costs them |

**Pairs on opposite sides of the space:**
- **Landslide and Thousand Cuts:** one huge blow, or many tiny ones.
- **Bonfire and Cold Snap:** a fire that dies unless it's fed, or a frost that builds until it breaks.
- **The Hunt and the Storm:** go and kill the back row, or make its own work kill it.
- **Barrage and Blood Pact:** mana poured out, or life.
- **The Toll** stands alone: it's the only one that waits to be hit.

## The builds

### Landslide

**Identity.** A party that loads one blow. Long stretches of small numbers go by behind stone bars. A wind-up bar fills on the hammer while Might piles onto it and its target is opened up. Then one number lands far bigger than anything else in the fight, and an elite loses a large share of its HP. The stone is rebuilt, and it happens again. It's waiting for the blow to come round.

- **Threads:**
  - the heavy action: slow swings, long wind-ups, long cooldowns;
  - loading it: Might on the slowest hitter (it's spent an action at a time, so it lasts where actions are rare), crits and Crit damage, Sunder laid on the target before the blow lands;
  - Defense, max HP and the Shield as damage stats, so the body is the weapon;
  - stone on the whole party, as the time the blow needs;
  - aim: at the healthiest foe, the most armored, the stunned.
- **Routes:** Geomancer, Knight, Hoplite · Geomancer, Paladin, Bard · no earth: Knight, Hoplite, Bard.
- **Seats it likes:** a hammer whose actions come less often and land bigger; an anvil that wears the stone and draws the blows; a loader that gives the hammer what the party has to give (stone, Might).
- **Through a run:**
  1. *The first step.* One unit whose heavy thing already out-sizes everything round it: rocks that crit from behind a Shield, a double swing, a bash from max HP. The sign is the number, and that Defense or HP on a piece makes it bigger: here the careful pick and the build's pick are the same piece. The step is the first piece that says so on its card, heavier and rarer.
  2. *The build.* A loading crew: Might aimed at the hammer, the target opened first, stone on everyone, the blow aimed at something worth it. Elites lose a large share at a time, and a boss takes a handful of blows.
  3. *The far end.* The stone loads the blow. Every blow the hammer lands reads the stone the whole party holds and leaves it, so what keeps the party standing is also the size of the blow. The blow lands twice. The shield detonation pays when stone breaks; this pays while it holds.
- **Stays alive:** stone on everyone: Shields, Guard and an Aegis across three heavy bodies. Fights run long, so the stone has to be rebuilt, and that's where its MP goes.
- **Packs and bosses:** bosses and armored foes are its best fights: a huge hit loses little to Defense. A pack is its worst: a blow spent on a wolf is a long wait wasted. Its pack game is the shove that hits every foe and the aim that saves the blow for the biggest. It fears dodgers, and anything that strips Shields.
- **Needs:**
  - **Pieces:** heavier and rarer, for swings and for abilities; Might for one unit, not three; damage from Defense, max HP and the Shield pool; a Shield's breaking as a blow, and a blow that reads the whole party's stone. Every Landslide piece promises a blow on its card: the ones that promised stone alone were worn as plain defence, by everyone.
  - **Formations:** hammer, anvil, loader; formations that trade the party's speed for size.
  - **Upgrades:** slower and heavier versions; versions that aim the blow.
- **Asks of the game:** none.

### Thousand Cuts

**Identity.** A wound opens on a foe: a crit, a barb, a thorn. Then the party pours hits into it, tiny numbers, several a tick, and every one pays again in red beside its own white. The wound closes a little with each hit, until someone opens it wider. It's waiting for the next wound, and it never stops hitting.

- **Threads:**
  - Bleed: opened wide in one stroke, cashed by every hit after, closing as it pays;
  - the opener and the pourers: a few hits that open (crits, barbs, thorns) and many that cash;
  - speed: fast weapons, Haste, Attack speed;
  - extra strikes: Double strike, multi-hit abilities;
  - staying alive by hitting: life drunk, a Shield built, an ally mended, hit by hit;
  - Evasion, and the dodge as one more trigger;
  - Sunder under it all, its answer to Defense.
- **Routes:** Vampire, Assassin, Monk · behind briars: Bramble knight, Assassin, Ranger · Valkyrie, Ranger, Vampire.
- **Seats it likes:** an opener whose crits come more often; two blades that act more often and hit smaller.
- **Through a run:**
  1. *The first step.* A unit that opens wounds (four base kits do): the party's hits on that foe print twice. Early units mostly swing, so the step is anything that makes more hits: the fastest of a class's weapon kinds, a second strike. It's worth taking on any unit.
  2. *The build.* An opener and two who pour, a pacer's Haste, and units kept standing by their own hits. Armored foes stop being walls: Bleed goes past Defense, and the hits only have to land.
  3. *The far end.* The count: every hit landed this fight makes the next worth more, and extra strikes chain.
- **Stays alive:** by hitting. Each hit drinks, builds a Shield or mends an ally. The dodge alone didn't hold in play.
- **Packs and bosses:** a lone boss suits it: every hit on one foe, the wound never closing. In a pack its swings scatter where Bleed wants them together; its pack game is the Mark, multi-hits that fan out, and wounds opened on every foe at once. It fears foes that harden under many hits (the Ice Golem's crust), dodgers, and the Wisps' Shock, which fast units pay for most.
- **Needs:**
  - **Pieces:** Bleed from more than crits; hits, however they come; a drink or a Shield per hit on Mail and Leather; a count of hits that grows into something.
  - **Formations:** opener and blades; formations that make the whole party faster at a cost.
  - **Upgrades:** versions that add hits, or open a wound on every foe.
- **Asks of the game:** none.

### Bonfire

**Identity.** A fire that dies if it isn't fed. Burn falls away fast, so the number on the hottest foe is the party's feeding, live: it leaps when two casts land together, and sags when a feeder is stunned or between spells. Everyone feeds it: casts, swings that carry fire, the keeper's own blows. While it's high the foe melts, and the blow that reads the fire lands for the fight's biggest number. It's waiting for the fire to roar, and working to keep it there.

- **Threads:**
  - Burn as upkeep: it drains fast, so its height is how hard the party is feeding it right now;
  - two kinds of feeder: swings that carry fire hold it steady, casts make it leap;
  - the pile: every feeder aims at the hottest foe;
  - a blow that reads the fire and leaves it, and that waits for a fire worth reading;
  - tempo for the feeders: Haste, Cooldown, Cast speed, MP;
  - a keeper who holds the early fight, keeps the feeders casting and burns what it holds.
- **Routes:** Knight, Pyromancer, Monk · Paladin, Hexer, Pyromancer · no mage: Paladin, Monk, Hexer.
- **Seats it likes:** a keeper that holds the early danger; a stoker that acts more often; a torch whose fire reaches every foe that's already burning.
- **Through a run:**
  1. *The first step.* One unit that leaves Burn: three base kits do, and a version or a piece puts it on a swing. The fire stands as high as it's fed, and it gets through Defense where hits don't. The step is a second feeder, and because the fire dies so fast the step shows at once: the number stands twice as high. It sits on a weapon or a version, so it takes nothing from the party's safety.
  2. *The build.* Three feeders on one pile, some steady and some in bursts, a keeper who feeds too, and a reader that waits for the height. Elites and bosses burn for more than the party hits for.
  3. *The far end.* Heat: the party feeds faster the longer the fight runs, and the fire holds through what used to put it out.
- **Stays alive:** a keeper who holds the early fight and feeds the fire. A feeder stopped is the fire sagging, so the keeper guards the tempo as well as the HP.
- **Packs and bosses:** a lone boss is its best fight: one pile, all fight. A pack is its worst: every kill throws a fire away. Its pack game is fire laid thin on the whole field. It fears fights too short to get a fire up, and anything that stops its casters (a Silence, a Stun on the wrong unit).
- **Needs:**
  - **Pieces:** fire on swings, for many kinds; a way for a keeper to feed (fire on its slow swing, or on what strikes it); a choice between a fire that lasts and one that flares; tempo where casters wear it; fire that passes on when its foe falls, as something the build finds.
  - **Formations:** keeper, stoker and torch, all three serving the fire.
  - **Upgrades:** versions that move fire from casts to swings, or make one cast a flare; a reader that waits for the fire to be high.
- **Asks of the game:** nothing of Burn's behaviour. Its rhythm is Burn's drain, a number (`STATUS.burn`): fast enough that an unfed fire is gone in a few ticks. That's the balance pass's, and it holds for every use of Burn.

### Cold Snap

**Identity.** Frost creeps up the foes and they visibly slow: each swing comes later than the last. Then a SHATTER: a burst, a Stun, and the party's heaviest hit lands on the frozen foe. Then the next one. It's waiting for the next foe to reach the cap, and the colder the field, the less the party is hit.

- **Threads:**
  - Chill to its cap and the shatter; anyone's Chill counts;
  - the slow on the way up: a colder field hits less often;
  - many small applications: swings that carry Chill, multi-hits;
  - the pile or the spread: one foe shattered again and again, or a pack reaching the cap together;
  - the opening a shatter makes: a stunned, sundered foe, and the heavy blow saved for it;
  - cold that attackers carry away from whoever they strike.
- **Routes:** Frostweaver, Hexer, Ranger · a Knight in frost: Knight, Frostweaver, Monk · no Frostweaver: Hexer, Ranger, Geomancer.
- **Seats it likes:** two frost seats that act often and carry Chill; a breaker that hits a frozen foe hardest.
- **Through a run:**
  1. *The first step.* One Chill source (three base kits have one): the foes slow as the counter climbs, and one shatters. The step is a second source. Every stack also slows a foe, so it's never a pick against the party's safety.
  2. *The build.* Sources enough that the same foe shatters again in the same fight, and a breaker for each one. The second shatter is the line between the sign and the build. It comes from the Chill counts, which *Core set: classes* already makes the balance pass's first job, and from what the build finds.
  3. *The far end.* A shatter's cold runs on to the next foe (Winter's chain), and what the party lays on one foe lands on the rest (Heart of the many), so a cold enough field falls in one long string: Cold Snap's pack game, a thread now, not an engine. It needs the whole field cold.
- **Stays alive:** the cold: a chilled field acts less, and every shatter is a Stun.
- **Packs and bosses:** spread over a pack, the cold slows everything and the shatters come together, like a string of firecrackers. Piled on a boss, it's a slow all fight and a burst on a beat; a boss shrugs off the Stuns after the first few, not the slow or the burst. It fears fights too short to reach the cap.
- **Needs:**
  - **Pieces:** Chill on swings, for the fast kinds; Chill from being struck; payoffs on a frozen foe; a shatter that leaves cold behind or sends it to the next foe, as something the build finds, and a run of shatters that gathers as it goes.
  - **Formations:** the frost seats and the breaker; formations where one seat's hits set up another's.
  - **Upgrades:** versions that aim at the foe nearest its shatter, or spread the cold wide.
- **Asks of the game:** nothing of Chill's behaviour. The Chill counts, as above.

### The Storm

**Identity.** Everything the foes do costs them. The party's strikes spread a charge across the whole field: an arc to the foe beside, a chain down the line. Then the foes move, and each one that swings, casts, heals or calls for help is hurt for it. A wolf pack fries in its own frenzy. A healer behind a shield wall pays for every heal. A heavy blow comes down on the most charged. It's waiting for them to move.

- **Threads:**
  - Shock: paid whenever its holder acts, whatever the action, so the busiest foes pay most;
  - spread: strikes that arc, chain or land on three, so the whole field is charged, back row included, with no need to reach it;
  - quick, light strikes that keep the charge topped up, since half of it goes each time it pays;
  - a storm on the whole party's swings for a while;
  - a blow that reads the charge on its target and leaves it.
- **Routes:** Hoplite, Stormcaller, Valkyrie · Knight, Stormcaller, Monk · no Stormcaller: Valkyrie, Hexer, Bard.
- **Seats it likes:** two squalls whose strikes spread; a rod that holds the field's attention.
- **Through a run:**
  1. *The first step.* A unit whose strikes spread and shock: fast foes take damage every time they swing, and the foe behind the front line is charged without being aimed at. The step is charge from a second unit.
  2. *The build.* The whole field charged all fight, the storm on everyone's swings, and a blow that reads the charge. Packs burn themselves down, and the back row pays for its own work.
  3. *The far end.* A storm that doesn't lift, and a blow that reads the charge on everything charged.
- **Stays alive:** Shock lands hardest on whatever is acting most, which is what's hurting the party most. It punishes a foe for acting and doesn't stop it, so in a pack the danger stays high until late.
- **Packs and bosses:** fast packs are its best fights, and groups with a busy back row (healers, cursers, summoners) its next best. A lone, slow boss is its worst: the charge pays on the boss's schedule, and its boss game is the blow that reads the charge. It fears Bomb Bugs (every blast at once) and Lava Slimes (an even field splits every slime).
- **Needs:**
  - **Pieces:** Shock on swings, for the fast kinds; a blow that reads the charge, for more classes than the Valkyrie; spread that comes with something else on the piece, since a slot whose whole promise was one more foe was never taken; something for a boss that rarely acts.
  - **Formations:** squalls and a rod; formations that pay for how many foes one action touches.
  - **Upgrades:** one foe or every foe; a longer storm or a harder one.
- **Asks of the game:** none.

### The Hunt

**Identity.** The pack takes them one at a time. A foe is Marked, and everything the party has lands on it: swings, arrows, the bolt that was going to go anywhere. It falls, the Mark moves, and it happens again. Each kill pays for the next: a blow ready again, a volley. The foes' numbers drop like a staircase. It's waiting for the next kill.

- **Threads:**
  - focus: the Mark, which takes every pick the party makes at random, and aim at the lowest HP;
  - the first strike: the first Mark and its volley at the first tick, and each class's own opener (a first swing that lands bigger, a first hit that always crits, a strike from hiding);
  - reach: Seek past a Taunting front;
  - the kill as a trigger: a reset, a volley, the Mark moving;
  - executes: damage that grows as the foe's HP falls, so a boss is one long staircase;
  - crits and Crit damage on a few chosen hits;
  - Silence on the back row's casters.
- **Routes:** a judge who calls the target: Paladin, Assassin, Stormcaller · no Assassin: Hoplite, Valkyrie, Ranger · Assassin, Ranger, Valkyrie.
- **Seats it likes:** a marker whose pick sets the target; a chaser with reach; a warden that holds what's left.
- **Through a run:**
  1. *The first step.* A unit that picks its prey (the lowest, the back row, past a guard): the dangerous foe dies first, or never acts. The step is a kill or a first strike that pays something seen on the very next hit.
  2. *The build.* A Mark the whole party follows, hunters whose abilities aim where the Mark sits, and a kill that pays. Mixed groups fall in a drumbeat that speeds up.
  3. *The far end.* An opening that clears the weak, and executes that carry the boss.
- **Stays alive:** kill order: the most dangerous foe dies first, and the dead don't hit. Against a lone boss kill order buys nothing.
- **Packs and bosses:** mixed groups with a dangerous back row are its best fights. A lone boss is its worst until the executes come: one step, no staircase. It fears Ghouls raised behind the hunt, and a Taunting front if it has no reach.
- **Needs:**
  - **Pieces:** the Mark from more hands than the Paladin's; kill rewards sized to be seen (a whole action, not a few ticks of one); executes; openers in each class's own terms, and hiding beyond the Assassin's as something exotic.
  - **Formations:** marker, chaser and warden, all three serving the kill.
  - **Upgrades:** versions that change what an ability aims at, or make it ready again on a kill: the kind that carried a run.
- **Asks of the game:** Marked takes the party's random picks (approved).

### The Toll

**Identity.** They hurt themselves. Foes crowd onto one unit, and every blow they land comes back: Thorns flash, the attacker leaves bleeding, charged or slowed, and it pays again when it next moves. The swarm that rushes the wall dies on it. It's waiting to be hit. The danger is all on the anchor, and the rest of the party is almost untouched.

- **Threads:**
  - the draw: Taunt and Aggro;
  - Thorns and retaliation: being struck strikes back;
  - what an attacker carries away (Bleed, Shock, Chill, Weaken): each ally adds its own toll to the blows on the anchor;
  - a toll that follows the size of the blow, so a boss's few heavy swings pay as a swarm's many do;
  - the anchor's keeper: Guard, Regen, heals, Weaken on what hits it;
  - the dodge as the other anchor: a dancer who slips the blow and answers it.
- **Routes:** Bramble knight, Cleric, Stormcaller · Knight, Hexer, Hoplite · the dancer: Monk, Valkyrie, Bard.
- **Seats it likes:** an anchor that draws and returns; a warden that keeps it standing; a free seat that finishes what the anchor started.
- **Through a run:**
  1. *The first step.* On floor one, from the kit: a Bramble knight, or a Knight that Taunts in thorns. Packs die on it. There's nothing to find, which is why it was in most parties.
  2. *The build.* The other two join the toll: blows on the anchor set off what they've laid (the attacker bleeds, sparks, slows, weakens), and the anchor has a keeper. Swarms die on the wall while the third seat does something else.
  3. *The far end.* The mirror grown. Retaliation sized by the blow as it was struck, and growing with every blow the anchor has lived through this fight. A boss's slow swings feed it, and it needs the keeper as much as the wall. The mirror is its first taste.
- **Stays alive:** it is the tank. Its risk is the one play showed: when the anchor falls, the rest fall behind it. So the keeper is part of the build, not an extra.
- **Packs and bosses:** swarms and fast foes are its best fights. A boss or a pair of elites that barely swing is where it died in play; its far end is written for that, and untested. It gets nothing from foes that don't strike (Bone Priests, Witches), which is the Storm's ground, or from Area, which ignores the draw.
- **Needs:**
  - **Pieces:** Taunt on gear, for more anchors; what an attacker carries away, for the allies to give; retaliation sized by the blow, and Thorns that grow with the beating; a dodge that protects as well as strikes back.
  - **Formations:** the anchor seat, with two seats that add to its toll.
  - **Upgrades:** versions that change who the anchor is and what it returns.
- **Asks of the game:** none.

### Barrage

**Identity.** One caster, and the same great spell again and again. Its name scrolls up the log, twice running. Its MP bar is refilled by the other two, and the spell is ready before its cooldown should be done. The party's basic attacks are an afterthought. It's waiting for the spell to come back round. When the mana or the caster stops, so does the party.

- **Threads:**
  - one ability worth repeating: the soloist's;
  - cooldowns: the Cooldown stat, Haste, an ability made ready at once;
  - the cast twice;
  - MP that flows to the soloist (Clarity, Refrain, Siphon, life for mana);
  - Cast speed, and a wind-up that can be lost;
  - costs that change;
  - mana as a damage stat.
- **Routes:** Knight, Bard, Pyromancer · Frostweaver, Bard, Stormcaller · no Bard: Cleric, Vampire, Geomancer.
- **Seats it likes:** a soloist whose abilities come faster; a conductor who gives it tempo; a well that gives it mana.
- **Through a run:**
  1. *The first step.* A caster with one spell worth repeating, and anyone who gives mana. The sign is the caster not swinging its staff. Every caster party feels the shortage, so the step (mana in fights, however it comes) is one it wants anyway.
  2. *The build.* A conductor: the spell twice, or ready again; Cooldown and Cast speed on the soloist. The spell lands several times in a fight where it used to land once.
  3. *The far end.* A cast that pays for the next, and mana as damage.
- **Stays alive:** the soloist draws little, and its danger is a cliff, not a slope. A well that also holds the foes' attention is worth most (the Knight's Taunt and Clarity are one ability), and mana as armour is the soloist's own, found (*Engines*).
- **Packs and bosses:** whatever the soloist's spell is; choosing the soloist is choosing that. It fears Silence (the Wraiths, the Silent One), Leeches, and a fight longer than the mana.
- **Needs:**
  - **Pieces:** links sized to be seen: a whole cast's mana, a whole cooldown, not a tenth of either; Cooldown and Cast speed where casters wear them; an answer to Silence; something of their own for the two who serve, so they're more than batteries.
  - **Formations:** soloist, conductor, well.
  - **Upgrades:** versions that make an ability ready again on a cast or a kill, or pass mana on.
- **Asks of the game:** none in the kits. Clarity's and Refrain's mana have to be big enough to change what the caster does: the playtest's to judge.

### Blood Pact

**Identity.** Life spent and bought back. The party's HP bars swing. A unit pays a chunk of its life for a blow, or rides low on purpose, and drinks it back off the foes; the healers work twice as fast while someone is at the brink; a Shield or an Aegis sits over whoever is lowest. The party fights at half and ends full. It's waiting to be low enough.

- **Threads:**
  - Lifesteal, and drinking more the lower it is;
  - HP as a price, in place of MP;
  - below half as power: for the one who's low, and for the allies who answer it;
  - nets: a Shield or an Aegis over a low unit (a price paid isn't damage, so it doesn't spend the Shield);
  - life passed on: a heal given as a trigger;
  - max HP as a damage stat;
  - the last drink: ending the fight full.
- **Routes:** Vampire, Valkyrie, Cleric · Vampire, Bard, Hoplite · no Vampire: Assassin, Paladin, Monk.
- **Seats it likes:** a bleeder that pays HP for power; a drinker that feeds on hits; a donor that passes life on.
- **Through a run:**
  1. *The first step.* A drinker: the Vampire, or Lifesteal on anything that hits hard. A unit that heals itself by hitting, and potions saved. It's taken as sustain, which is right: sustain is the build's floor.
  2. *The build.* The price: abilities and pieces paid in HP that buy what mana can't, power below half for the payer and from its allies, and a net over whoever is low. Fights where the mana never runs out.
  3. *The far end.* Life as the party's one currency: strongest at the brink, and full when the fight ends.
- **Stays alive:** drink and nets. The lower it is the more it drinks; the healers quicken at the brink; a Shield or an Aegis takes the blow that would finish a low unit. It's the riskiest way to live in the set, on purpose.
- **Packs and bosses:** long fights against things it can drink from. It fears Bats (a dodged hit drinks nothing), the Witch's curse (a weakened hit drinks less), Rot, and burst that catches it low.
- **Needs:**
  - **Pieces:** prices in HP that buy more than their mana would, repaid inside the same fight; power below half that doesn't leave a unit low when the fight ends; nets; a last drink.
  - **Formations:** bleeder, drinker, donor; formations where life moves between seats.
  - **Upgrades:** versions that pay life or pass it.
- **Asks of the game:** none in the kits. Only the Vampire's base kit pays HP; the build widens through Lifesteal's kinds and versions other kits already hold, and the Berserker, when it's added, is its natural second home.

## Engines

**An engine is a found synergy, designed in advance for a player to find:** a few pieces that turn out to work together into something specific, on one road or more. A happy accident, made on purpose, and there should be many of them.

**What they're for:**
- **A build pays before it's complete.** An engine works with a small number of pieces, so a build doesn't only come online when all of its pieces are there.
- **Builds cross.** An engine that spans more than one road gives a party on one of them a reason to reach into the others, so a player isn't picking a build and then doing only that.
- **The web has many interesting points along the way,** on its roads and at its doors.

**What they aren't:**
- **Not a concept the player is taught.** An engine is a design pattern. Nothing in the game names one, and no card says what a piece combines with.
- **Not builds.** An engine is too narrow and too specific to carry routes and rungs.

**What's ruled about them:**
- **An engine sits on one road or more.** Some belong to a single road; some span two, three or more. Several can play on the same mechanic without touching another build.
- **They're designed as a game designer picks them, for being worth finding, not from a formula.** Two frames are too narrow: that every engine must cross two mechanics, which reads as pattern matching, and that every engine gives a verb to a moment that does nothing today.
- **No engine rests on a number the player can't see,** such as a foe's MP.
- **A mythic may be an engine on its own,** since it rewrites one class. Anything else takes two parts or more.
- **A status's own behaviour stays as it is.** An engine is one of the places a build can make a status do more: fire that passes on, a shatter that leaves cold behind.
- **Where an engine sits on a road's far end,** the far end goes past it, or is the engine's much stronger form that only the whole build reaches. Which it is, road by road, is in *The builds*.

**The first, from the director's play: the shield detonation.** One piece made a Shield deal damage, by its original size, when it broke. Another effect brought a broken Shield back at about half its size. The party was laying Shields on its units from several sources. Together, most of the party's damage came from Shields detonating. Nothing else that party was doing belonged to any build in the set: it was a shield party that hadn't fully come online, and those pieces twisted it into one specific gimmick. It was one of the strongest and clearest rhythms the director met in play. It sits on Landslide, in its stone.

### The set

Thirty-one more, for thirty-two, and three that the kits and the mythics already make (*Already in the game*, below).

**The test each one passed.** It's a test for being worth finding, not a mould: the engines share no shape.
- **Each part earns its slot alone,** for a plain reason. A happy accident needs its parts to be in the party already.
- **Together they change where something comes from:** the party's damage, its safety or its aim. A bigger number isn't an engine.
- **It's seen the first time it fires,** and told in one sentence.
- **It turns over on something a fight is full of:** swings, blows taken, kills, shatters. In play a chain whose second link waited on a cooldown never closed.
- **It's small:** mostly one piece meeting something a party already does, and that something is often in a kit.
- **It's understood from rules the player already knows,** or from one new rule on a card. The best come out of rules already in the game, and they're the ones a player can reason their way to.

**Left out, and why:**
- **Plain multipliers:** Sunder under a fire, Guard on a unit that hits from Defense. They're real, and a player will be glad to find them, but they're threads.
- **A road's own payoff on the road's own state:** a piece that heals while the fire is high, or shields while the field is charged. Each is a good rare for its road, found as any of the road's pieces are found, and not an accident.
- **More of the same, stacked:** cold at the fight's start and cold on the swings; Might at the start, a first swing at once and the heaviest swing.
- **One piece doing it alone,** unless it's a mythic.
- **A route through kits:** a blow that reads a status, cast twice by the Bard; the Stormcaller's chain that pays its mana back, repeated by the Bard. That's a door.
- **Fill-ins by symmetry:** fire on whatever strikes the anchor, beside the frozen gate; a charge that spreads when its foe falls, beside the fuse.
- **Mana as power on a unit that never casts.** It breaks the rule that power follows fuel.
- **Anything that wants a fall,** ends a status early, or reads a number the player can't see.

**How to read an entry.** *What combines* is the parts: a piece, a version, a seat or a class's own passive, and where a kit holds one today the entry names it. *What the player sees* is the fight. *Enough to see it* is the least a run needs before the thing shows, which is how a build pays before it's whole. They're laid out by what turns each one over. That's only a way to lay them out.

#### The foes do it to themselves

**The frozen gate.** *The Toll and Cold Snap.*
- **What combines:** Chill left on whatever strikes the anchor · a draw · the Frostweaver's Rime shield, which turns each shatter into a Shield on the lowest ally, or anything else that pays on a shatter.
- **What the player sees:** foes swing slower with every blow they land on the wall. Then one bursts and stands stunned, and the wall's Shield bar refills. Nobody cast anything: the pack freezes itself, faster the harder it attacks.
- **Enough to see it:** the anchor's piece alone. It's how a second shatter comes without waiting on a cooldown.

**The mirror.** *The Toll and Landslide.*
- **What combines:** retaliation sized by the blow as it was struck, before the wall took its share · the cover that takes that share: Guard, stone, the Hoplite's Aegis kept on the anchor · a draw that holds through the wind-up.
- **What the player sees:** the Ogre Chief's Crush comes down. On the wall, a small number or BLOCKED. On the Chief, the Crush's own number.
- **Enough to see it:** the retaliation on any Guarded anchor. The better the stone, the more goes back, so it's the Toll's game against the bosses that barely swing, where it died in play. Weaken works against it: a weakened blow sends less back.

**The goad.** *The Storm and the Toll.*
- **What combines:** something that makes foes swing at once: when its wearer Taunts, or on the foe its blow lands on · anything that makes a foe's own action cost it: a charge it holds, thorns on what it strikes, frost or a wound it picks up there · Weaken on the field, so the blows called early are small ones.
- **What the player sees:** the anchor shouts and every foe swings out of turn, sparks and thorns flying off each one as it does. The anchor's bar dips, and the pack's drops further. Against a slow boss, the party sets the pace the boss pays at.
- **Enough to see it:** the piece on a Bramble knight, or on anyone under a Stormcaller's storm. The blow taken is real, and that's its price.

**The held charge.** *The Storm, with Cold Snap or Landslide.*
- **What combines:** charge on the party's swings (the Stormcaller's Arc and Thunderstorm) · anything that holds a foe still: a shatter's Stun, the Geomancer's Aftershock on every foe, a bash · a blow that reads the charge and leaves it: the Valkyrie's Skyfall in the kits, and a piece for the classes that lack one.
- **What the player sees:** a stunned foe can't act, so it can't pay its charge off, and the counter climbs to its cap. The blow from above lands for its biggest number. Then the foe wakes, and its first move costs it the lot.
- **Enough to see it:** a storm, one Stun and the reader. A boss that rarely acts is a held foe too: its charge sits at the cap between its moves, so the blow that reads it is strongest where the Storm is weakest.

**The reckoning.** *The Toll and Landslide.*
- **What combines:** a link from one unit's beating to another's blow, each hit the first takes adding to the second's next swing: two seats of a formation, or a piece on an anchor that swings heavy itself · a draw on the one that's struck · a slow, heavy swing, so the count has time to climb.
- **What the player sees:** a counter on the hammer climbs with every bite the anchor takes. Then the swing lands for all of it. The Toll's damage arrives in Landslide's rhythm.
- **Enough to see it:** the formation, with a Bramble knight in front and a Hoplite behind. A swarm's many bites become one blow, which gives Landslide a reason to like packs, and beside the avalanche the blow rolls on through them.

#### Kills turn them over

**The reaping.** *The Hunt, with the Storm, Bonfire or the Toll.*
- **What combines:** an execute at the lowest foe that's ready again when it kills (the Assassin's Coup de grâce, and a kill reward of that size for other hunters) · anything that sinks a whole field together: a storm, fire laid thin, thorns on a swarm, a wide spell.
- **What the player sees:** for a long while nothing dies, and every bar sinks in step. Then one name scrolls five times running and the field is empty.
- **Enough to see it:** the Assassin's version and one wide spell. The staircase becomes a cliff. It's the answer to Ghouls, who have to fall inside one window, and exactly wrong for Bomb Bugs, who all go off at once.

**The judge's drum.** *The Hunt, with Landslide or Bonfire.*
- **What combines:** the Paladin's Condemn: a Mark, and every ally's next swing lands at once · the call made again whenever the judged foe falls · swings worth calling: the slowest and heaviest in the party (the Hoplite's doubled swing, a maul with Might on it), or swings that carry fire.
- **What the player sees:** a foe falls, the Mark jumps, and three weapons land together on the next. The maul that swings once in a long while swings on every kill. Where the swings carry fire, each call is three stacks at once and the fire leaps.
- **Enough to see it:** a Paladin's Condemn beside a Hoplite. The call alone hands the slow swing a free one. "At once" is worth most on whatever comes least often.

**The opening, again.** *The Hunt, with whatever the run holds.*
- **What combines:** something that makes its wearer's start-of-fight effects happen again each time a foe falls · the start-of-fight uncommons every run is full of: a Shield, Haste, a few Might, a Taunt, a little frost or fire on every foe · kills.
- **What the player sees:** a foe falls and the opening happens again: stone up, Haste on, frost across the field.
- **Enough to see it:** the piece, and two of those uncommons on its wearer. The cheapest pieces in the bag become the engine, and which ones a run happens to hold decides what it is.

**The fuse.** *Bonfire in a pack, with the Hunt.*
- **What combines:** something that hands a burning foe's fire on to another foe when it falls (Wick hands on half): a piece or a seat, never Burn itself · a party that kills the weakest first, or a pack of small foes · the feeders' own aim at the hottest foe (the Pyromancer's bolts and pyre, the Monk's fists).
- **What the player sees:** the smallest foe goes up, and its fire jumps to the next, which starts already burning. Every feeder turns to it without being told. Each kill comes sooner than the last, and the big foe at the back meets a fire the pack built. Handed on whole, one cast walked a whole pack down and Bonfire's worst fight became its easiest.
- **Enough to see it:** the piece and one feeder that aims at the hottest. It's Bonfire's pack game: a kill no longer throws the fire away.

**The avalanche.** *Landslide and the Hunt.*
- **What combines:** a piece that carries what a killing blow had left over into another foe · any blow far bigger than what it lands on: the Hoplite's doubled swing, a maul, the Geomancer's Boulder, an execute.
- **What the player sees:** the hammer comes down on a wolf, the wolf is gone, and the rest of the number lands on the next wolf, then the next: one swing, a falling row of numbers. Aimed at the weakest, it runs furthest.
- **Enough to see it:** the piece on any slow, heavy hitter. It's Landslide's pack game: a blow spent on a wolf stops being a long wait wasted.

#### The party's swings and hits turn them over

**The spell on the swing.** *Thousand Cuts and Barrage.*
- **What combines:** something that casts its wearer's first-slotted ability on every few swings, whatever its cooldown, with the mana still paid · speed: a fast kind, Haste, a second strike · the order of its abilities, which now decides what the unit is.
- **What the player sees:** a count climbs on the unit with each swing, and at the top, the spell. A Monk's every few blows is a Stun. A Bard's wand calls an Encore on a beat.
- **Enough to see it:** the piece on any fast unit that knows one ability. Its limit is mana, so it wants a well, and speed gets a payoff of its own.

**The red rain.** *Thousand Cuts in a pack, with the Storm or the Toll.*
- **What combines:** wounds open on the whole field: the Bramble knight's attackers leave bleeding, the Hexer's Plague, an opener that strikes each foe once · any hit that lands on many foes at once, however weak: Chain lightning, an arc, a Blizzard, the Hoplite's shove, a lash of vines.
- **What the player sees:** one cast, and a red number on every foe.
- **Enough to see it:** a Bramble knight and any wide hit. Bleed pays by the hit and not by its size, so the weakest wide spell in the party is its best pourer, and a mage has a place in the blur.

**The riposte.** *The Toll's dancer and Thousand Cuts.*
- **What combines:** a dodge answered with a real swing · cover built by the dodge itself, a Shield on every miss, or by hitting: the Valkyrie's Shield from every hit, the Monk's Drinking palm, Lifesteal · a draw on a dodger: the Monk's Stillness of mind, the Valkyrie's Over the fallen.
- **What the player sees:** MISS. The answering strike. The dancer's Shield bar a little taller. The one blow in three that lands takes only Shield.
- **Enough to see it:** the dodge's piece and a Shield on the dodge, on a Monk. The Valkyrie builds cover by hitting and has no Evasion of her own, so she needs two pieces to dodge with. From the director's chair a dodge wasn't a defence, because the hit that landed still killed. Here every miss banks cover for it.

**Every colour.** *The four statuses' roads, through the Hexer.*
- **What combines:** something that lays a different affliction each time: the chaos wand, which is worth a little to every status party and a lot to none; two small afflictions laid on every foe as the fight starts; or one swing carrying riders from a kit, a piece and a storm · the Hexer's Malison as approved, which pays for each kind a foe holds · the Paladin, whose hits want any affliction at all.
- **What the player sees:** a row of every icon on each foe, a stack or two of each, and the curse landing for its biggest number.
- **Enough to see it:** a Hexer holding the wand. Scattered stacks are worthless to a pile and exactly what breadth wants.

**The lead's colour.** *The four statuses' roads.*
- **What combines:** a formation whose other two seats carry on their swings whatever the lead's swing carries · one unit whose swing carries a status: the Hexer's frost, the Monk's Sunder and the Stormcaller's charge are there from floor one, and fire or a wound is a piece or a version away.
- **What the player sees:** three weapons laying the same status. The counter climbs three times as fast, and what one unit could only start, the party finishes: the second shatter, the fire that stays up.
- **Enough to see it:** the formation and a Hexer. It's what the one formation that made three units one build in play did, for any colour.

**The emptied quiver.** *Thousand Cuts and the Hunt.*
- **What combines:** the Ranger's Quick draw, where each crit brings the next swing at once · crits made near certain for a while: on a bleeding foe, a stunned one, one that hasn't acted yet.
- **What the player sees:** three, four, five arrows in one tick, then a pause. The burst lasts as long as the crits do, and on a wound every arrow pays it again.
- **Enough to see it:** the version and one piece that lifts its crits on some foes. It's a loop, and its brake is the crit that fails.

#### Casts and mana turn them over

**The blood mage.** *Blood Pact and Barrage.*
- **What combines:** spells paid in life in place of mana · Lifesteal on the caster · a spell that lands on many foes.
- **What the player sees:** the caster's HP bar drops at every cast and leaps back when the spell lands on a crowd. Its mana never moves.
- **Enough to see it:** the price and Lifesteal on a caster with one wide spell. Against a pack it never stops. Against one boss each cast costs more than it drinks back, and it needs the party's net.

**The resonance.** *Barrage, with the Storm and every wide cast.*
- **What combines:** a piece that brings an ability back sooner for each foe it just hit · a spell that hits many: Chain lightning, Blizzard, Fireball, the Hoplite's shove · mana for it, which the Stormcaller's Recharge pays back by the foe.
- **What the player sees:** against six wolves the same spell's name scrolls again and again, and it slows as the pack thins. Mana is what stops it.
- **Enough to see it:** the piece on any unit with one wide ability. It's Barrage's pack game, and a loop whose brakes are a thinning pack and an emptying pool.

**The crescendo.** *Barrage.*
- **What combines:** a spell that lands harder and costs more each time it's cast in a fight · mana poured in by the other two · the casts that are free for some other reason: the Bard's repeat, the Stormcaller's Overcharge, the Frostweaver's Deep calm, a first cast free. Each one skips a price that keeps climbing.
- **What the player sees:** the same name up the log, a bigger number each time, and the mana bar emptying faster each time, except on the casts that cost nothing.
- **Enough to see it:** the growing spell and one well. It's what "the same spell again and again" grows into.

**Mana as armour.** *Barrage, and Blood Pact turned round.*
- **What combines:** a piece that takes the damage its wearer suffers out of its MP while it has any · the party's mana-givers: Clarity from the Knight, the Frostweaver or the Vampire; the Bard's Refrain.
- **What the player sees:** the caster's blue bar takes the blow and the red one doesn't. Every note of the Bard's that reaches it is a heal. When the blue runs out, the caster stops casting and starts dying in the same moment.
- **Enough to see it:** the piece on a caster beside one Clarity giver. Its danger is a cliff, which is Barrage's already, and it's the soloist's own way to live.

#### A shatter turns them over

**The shatter bell.** *Cold Snap, with Landslide, Bonfire or Barrage.*
- **What combines:** something that makes its wearer's first-slotted ability ready whenever a foe shatters · a party that shatters on a beat · an ability worth slotting first for it: the Geomancer's Tremor, the Paladin's Smite, the Pyromancer's Pyre, the Hoplite's shove.
- **What the player sees:** SHATTER, and the great spell's name right under it, every time.
- **Enough to see it:** the piece beside one Frostweaver. The frost becomes another unit's clock, so a long cooldown stops mattering, and the foe that just shattered is stunned and sundered when the blow arrives.

#### Who gets picked, and who's healed, turns them over

**The brink.** *Blood Pact, with Landslide's stone and the Toll's keepers.*
- **What combines:** a unit that holds itself low on purpose: by paying, since a price isn't damage and never spends a Shield, or by a piece that trades away the top half of its health bar, with its own power below half (the Vampire's Bloodlust) · the kits' gifts to "the ally with the lowest share of HP": Shields from the Geomancer, the Valkyrie and the Frostweaver, the Knight's Guard, the Hoplite's Aegis, the Assassin's smoke · the versions that wake while an ally is low: the Cleric's cooldowns halved, the Bard's Might doubled, the Valkyrie standing over it.
- **What the player sees:** one unit sits at a third of its health all fight, hitting at its strongest. Every Shield, Guard and Aegis in the party lands on it, and the healer works at twice the pace.
- **Enough to see it:** a Vampire beside any one giver. The lowest ally is a place a player can choose to put someone, and eleven kits give to it. An anchor can sit there too.

**Two in the dark.** *The Toll, Blood Pact and the Hunt.*
- **What combines:** Hidden on two of the party: the Assassin's Vanish, its Smoke screen over the lowest ally, a cloak, a killing blow that hides the killer, the borrowed gift · a third who wants every blow: a thorn wall, a dancer, a shieldmaiden.
- **What the player sees:** two names fade, and every blow the foes aim goes to the one left in the light.
- **Enough to see it:** two hidings, the Assassin's or anyone's, and an anchor. It's a front line with no Taunt and no Aggro, for as long as the hiding lasts, and only what strikes everyone gets past it.

**The red stone.** *Thousand Cuts and Blood Pact, feeding Landslide's stone.*
- **What combines:** a piece that turns healing past full into a Shield · a unit that's often healed while full: a drinker with a fast weapon, whoever the Bard's Refrain lands on, a Cleric with nothing to mend.
- **What the player sees:** once a unit is full, its green numbers turn into a grey bar. A party with no healer finds it's building stone by hitting.
- **Enough to see it:** the piece on a Vampire. The stone feeds the detonation, and whatever reads a Shield (the Geomancer's crits).

#### Exotics

**The borrowed gift.** *No road of its own: whichever the gift belongs to.*
- **What combines:** a piece that gives the other ally with the lowest share of HP whatever its wearer gives itself · a kit with something it gives itself on a short clock.
- **What the player sees:** something different for each class. The Assassin vanishes, and the most hurt ally vanishes with it. The Vampire's Frenzy rouses whoever is lowest, and the Monk's Flow quickens it. A Knight that Taunts makes the lowest ally Taunt too, which is a disaster unless the lowest is the one built to be.
- **Enough to see it:** the piece on any class with a gift to itself. About half the kits have one.

**The carrier.** *No road: the region is the build.*
- **What combines:** a piece that passes a stack of each affliction its wearer holds on to whatever it hits · a way to be afflicted: the act's own foes (the Old Road's snakes, the Fire Mine's hounds, the Ice Pass's spirits, the Storm Tower's wisps, the Crypt's witches), or a piece that sets its wearer alight for power.
- **What the player sees:** the Monk is bitten by a hellhound and catches fire, and from then on everything it touches burns. In the Ice Pass the same unit spreads frost. A Cleanse puts it out.
- **Enough to see it:** the piece on a fast unit, in a region whose foes afflict. The healer's Cleanse turns against it, and that's part of the joke.

#### New in the creative-builds pass

Found in the pass's own pieces, each two parts, each told in one sentence.

**The shield party.** *Landslide, the Toll.*
- **What combines:** a weapon that hits harder for each ally holding a shield (Phalanx pike) · a shield that raises every ally's Defense while every ally holds one (Pavise of the line) · the new kinds' shields: the Frostweaver's kite shield, the Valkyrie's and the Bramble knight's round shields.
- **What the player sees:** three shields up, and everyone's Defense and hits climb together.
- **Enough to see it:** three shield-holders and either piece. A party with no wall in front finds its wall in its offhands.

**The borrowed hand.** *Barrage, Landslide.*
- **What combines:** a tome whose wearer's abilities read the Attack of the ally with the most (Borrowed hand) · a support whose abilities scale from Attack: the Bard's War ballad and songs, the Hexer's curses · a mage with the party's most Attack.
- **What the player sees:** the Bard's Might lands as if a Pyromancer had cast it.
- **Enough to see it:** the tome on a Bard or a Hexer beside a Pyromancer.

**The open book.** *Landslide, the Toll.*
- **What combines:** plate whose wearer's abilities read Defense in place of Attack while its Defense is the greater (Even-keel plate) · a Guard on it: Fortify, Mason's hammer, Glyphed robe, Penitent's mace.
- **What the player sees:** a Paladin's Smite or a Vampire's drain growing with every Guard laid on it.
- **Enough to see it:** the plate on a Paladin or a Vampire in Plate beside one Guard-giver.

**Owed and the healer.** *Blood Pact, the Toll.*
- **What combines:** mail whose wearer's hits wait and land at once (Owing mail) · any healer, or a Shield laid before the debt comes due.
- **What the player sees:** a grey number climbing on the icon, the heal arriving, and the bill landing on a full bar.
- **Enough to see it:** the mail beside a Cleric. It turns a burst into a beat a healer can answer.

**The fixation line.** *The Toll, the Hunt.*
- **What combines:** a Fixate, the Ranger's Lure or the Alarum horn · a Toll anchor that draws the rest.
- **What the player sees:** two anchors, each holding its own foes: the biggest hitter on the Ranger, the pack on the wall.
- **Enough to see it:** either Fixate and an anchor. A way to protect without being the wall.

#### Already in the game

Three engines the kits and the mythics make today, with nothing new. They're named so the loot doesn't repeat them, and so the upgrades and mythics know what the kits already hold.
- **The cull** (the Hunt, Thousand Cuts): the Assassin's Opening wound, Lacerate and Coup de grâce. Every strike on a fresh foe is a crit and a wound, the execute finishes it, and it's ready for the next. Found in play, where it carried a run to act II as the crit-Bleed build.
- **The quake** (Landslide, Cold Snap, the Storm): the Geomancer's Stunning crits beside anything that hits a Stunned foe harder (Icebreaker, Idol of binding's like). A rock crits and the foe is stunned; the next blow lands double on it.
- **The bedrock** (Landslide): the Geomancer's mythic, Bedrock heart. While its stone stands, every hit crits, and Bedrock's own Crit chance has nothing left to add, so the passive's versions decide what the stone is worth.

### Across the web

| Engine | Sits on | Lives on | Its keystones in the loot |
| --- | --- | --- | --- |
| The shield detonation | Landslide | the party | Rubble plate, Shatterstone charm, Second skin, Rampart |
| The frozen gate | the Toll, Cold Snap | two units | Hoarfrost plate, Frost armor |
| The mirror | the Toll, Landslide | two units | Thornheart plate, Mirror shield; Hoplon's Aegis blow beside it |
| The goad | the Storm, the Toll | the party | Provoking blade, Goading totem |
| The held charge | the Storm, Cold Snap, Landslide | the party | Lightning-glass, Thunderclap |
| The reckoning | the Toll, Landslide | two units | Grudgebearer, Hammer and anvil |
| The reaping | the Hunt, the Storm, Bonfire, the Toll | two units | Bounty charm, Coup de grâce |
| The judge's drum | the Hunt, Landslide, Bonfire | two units | Pack leader's coat, Hunting horn, Swift justice |
| The opening, again | the Hunt | one unit | Overture coat |
| The fuse | Bonfire, the Hunt | the party | Wick |
| The avalanche | Landslide, the Hunt | one unit | Overkill axe, Overrun |
| The spell on the swing | Thousand Cuts, Barrage | one unit | Baton, Bell of the hour |
| The red rain | Thousand Cuts, the Storm, the Toll | two units | none of its own: every hit that lands on many foes, with the kits' wide hits |
| The riposte | the Toll, Thousand Cuts | one unit | Parrying spear, Duelist's leathers, Tempest cloak |
| Every colour | Bonfire, Cold Snap, the Storm, Thousand Cuts | one unit | Wildmagic wand, Festering idol, Plague |
| The lead's colour | Bonfire, Cold Snap, the Storm, Thousand Cuts | the party | Mimic wand, The standard |
| The emptied quiver | Thousand Cuts, the Hunt | one unit | Quick draw |
| The blood mage | Blood Pact, Barrage | one unit | Flagellant's vestments, The covenant |
| The resonance | Barrage, the Storm, Bonfire, Cold Snap | one unit | Resonant robes |
| The crescendo | Barrage | one unit | Crescendo charm, Orb of the rising sun |
| Mana as armour | Barrage, Blood Pact | two units | Orb of the deep |
| The shatter bell | Cold Snap, Landslide, Bonfire, Barrage | two units | Frozen tome, Icefall |
| The brink | Blood Pact, Landslide, the Toll | two units | Bloodletter, Flagellant's vestments, Halved heart, Heart of the saint, Blood vial |
| Two in the dark | the Toll, Blood Pact, the Hunt | the party | Shroud charm, Shadow cloak, Smoke screen, Decoy |
| The red stone | Thousand Cuts, Blood Pact, Landslide | one unit | Red stone mail |
| The borrowed gift | none of its own | two units | Twin-knot, Twins |
| The carrier | none | one unit | Carrier's coat |
| The shield party | Landslide, the Toll | the party | Phalanx pike, Pavise of the line |
| The borrowed hand | Barrage, Landslide | two units | Borrowed hand |
| The open book | Landslide, the Toll | two units | Even-keel plate |
| Owed and the healer | Blood Pact, the Toll | two units | Owing mail |
| The fixation line | the Toll, the Hunt | two units | Lure, Alarum |

- **Every road has engines, and none has only its own.** Landslide and the Toll touch nine; Thousand Cuts, Bonfire, Cold Snap, the Storm and the Hunt seven; Barrage six; Blood Pact five.
- **Three sit on one road, sixteen on two, eleven on three or more,** and the two exotics on none.
- **Eleven live on one unit,** where play showed a player builds; fourteen need two units; seven need the party.
- **Five can start in act I** from the kits, a version and a formation: the red rain, the held charge, the reaping, the lead's colour and the brink. The rest are one piece from a party already on a road.
- **Several need the rules to grow:** damage carried past a kill, a foe's swing called early, damage taken from MP, retaliation sized by the blow before the wall's share, an ability cast by a count of swings, start-of-fight effects that happen again, a status passed on by its holder, an ability brought back by the foes it hit. The director's intent allows it (`docs/gear-design/philosophy.md`).
- **Two are loops,** each with a brake of its own: the emptied quiver (a crit that fails) and the resonance (a pack that thins, a pool that empties). Synergies may be overpowered until the balance pass.

### Parts that recur

One part, several engines, so a run holding one part has more than one partner to meet. The spine writes these first.

| A part | The engines it's in |
| --- | --- |
| A Shield made by what a unit already does (hits, dodges, a shatter, healing past full) | the detonation, the frozen gate, the riposte, the red stone, the brink |
| A draw on one unit | the frozen gate, the mirror, the goad, the reckoning, the riposte, two in the dark |
| A status on a swing | the lead's colour, every colour, the held charge, the carrier |
| A hit on many foes | the red rain, the reaping, the resonance, the blood mage |
| A foe held still | the held charge, the shatter bell, the emptied quiver |
| A kill that pays | the reaping, the judge's drum, the opening, again, the fuse, the avalanche |
| The slowest, heaviest blow | the judge's drum, the avalanche, the reckoning, the shatter bell, the mirror |
| The ally with the lowest share of HP | the brink, two in the dark, the borrowed gift |
| A cast that's free, or mana given | the crescendo, mana as armour, the resonance, the spell on the swing |

### What the set asks of the loot

- **The common half comes first.** The shield party was laying Shields long before it found the piece that broke them. So an engine's supply sits in the kits, the commons and the uncommons, and its keystone in a rare, a legendary, a version or a seat.
- **A keystone met alone does nothing, and play showed it.** The dodge that strikes back was worn by units that drew nothing, the shatter that throws cold by a party that shattered once a fight, and the price in life for two fights. What was missing each time was the other half, close at hand.
- **Every keystone comes from more than one place:** a piece in more than one kind, a version, a seat. A run sees under half the legendaries, so twenty-eight engines with one keystone each would mostly never be met.
- **Each part is worth wearing alone on its road,** and no card names its partner.
- **Parts overlap on purpose** (*Parts that recur*). That's how pieces meet in ways nobody wrote down.
- **A class's mythic may be an engine on its own,** and two already are.

## The doors

Where a run drifts from one road to its neighbour, through something both want. Where an engine sits on a door, the door names it.
- **Any status road into another, through a second colour on a swing.** A fire party picks up frost. The Hexer's Malison, which pays for each different affliction a foe holds, is what makes a mixed party worth being. *Every colour.*
- **Thousand Cuts into the Hunt, through the opener's crits.** The crit that opens a wound finishes the weakest. Play found these two as one. *The cull.*
- **Thousand Cuts into Blood Pact, through the drink.** A party that lives on Lifesteal starts paying with it. *The red stone.*
- **Thousand Cuts into Barrage, through speed.** Swings that bring a spell round. *The spell on the swing.*
- **The Toll into Thousand Cuts, through briars.** Foes leave the anchor already bleeding. *The red rain.*
- **The Toll into Cold Snap, through frost on the anchor.** What strikes it slows. *The frozen gate.*
- **The Toll into Landslide, through Defense and stone.** *The mirror, the reckoning.*
- **The Toll into the Storm, through the foes' own clock:** one waits for them to strike, the other for them to move. *The goad.*
- **The Toll into Blood Pact, through the lowest ally:** an anchor held low takes all the party's cover. *The brink.*
- **The Storm into Cold Snap, through a held foe:** a frozen foe keeps its charge until it moves. *The held charge.*
- **The Storm into the Hunt, through the back row:** taxed, or reached. And through a field sunk together, finished in one beat. *The reaping.*
- **The Hunt into Bonfire, through kills:** a fire that outlives its foe. *The fuse.*
- **Landslide into Cold Snap, through the heavy blow on a frozen foe.** *The shatter bell, the quake.*
- **Landslide into Barrage, through the conductor:** the blow twice.
- **Landslide into the Hunt, through the first strike:** Might at the start on the slowest hitter. *The judge's drum, the avalanche.*
- **Barrage into Bonfire, the Storm or Cold Snap, through the soloist:** the spell worth repeating is the one that feeds the fire, spreads the charge or lays the frost. *The resonance.*
- **Blood Pact into Barrage, through life for mana.** *The blood mage,* and *mana as armour* the other way round.
- **Blood Pact into Landslide, through max HP in the blow.**

## Elements, not builds

Things that could be taken for builds, or for a build's whole identity, and are better as things any party can have.

- **Falls and returns: the net.** Nobody chooses who falls, so nothing is built on it. A revive, and whatever softens a fall, serves every build. What the net has to do: the returned stay up (in play, each revive inside a fight was followed by a second fall), the survivors get cover in the moment after, and since a knockout carries, the net can bring the fallen back between fights. It's sized as protection. No piece wants a fall.
- **The first move.** The fight's start is the one trigger nothing gates. It's the Hunt's first Mark, and a thread several others use: stone at the start, cold at the start, a Taunt at the start, a first cast free.
- **Spread.** Reaching more foes is each build's pack game, not a build. The Storm is the one road whose nature is spread.
- **Stopping a cast.** A Stun or a Silence timed to a wind-up is an answer to a boss's great cast, as *Core set: enemies* asks, and the act's boss is shown from the start. The versions that wait for a wind-up are that answer. A wind-up was caught five times in 150 fights, so no build waits for one.
- **Foes that do less.** Weaken, Slow and Silence make a party's fights cheaper. At their sizes today they don't keep one alive.

## The web

### Threads the builds share

| Thread | Matters most to | Matters some to |
| --- | --- | --- |
| The draw (Taunt, Aggro) | the Toll | Bonfire, the Storm, Barrage, Landslide, the Hunt (the warden) |
| Shield | Landslide | Blood Pact (the net), Thousand Cuts (built by hits), the Toll |
| Defense and Guard | Landslide, the Toll | |
| Might | Landslide (the slow hitter) | the Hunt (the first strike), Blood Pact (roused at the brink) |
| Haste and speed | Thousand Cuts, the Storm | Bonfire (the feeders' tempo), Cold Snap, Barrage |
| Riders on basic attacks | Bonfire, Cold Snap, the Storm | Thousand Cuts |
| Many hits, extra strikes | Thousand Cuts | the Storm, Cold Snap |
| Crits | the Hunt, Landslide, Thousand Cuts (the opener) | |
| Stun | Cold Snap (the shatter's) | Landslide (the blow on a held foe), the Storm (a held charge) |
| Cooldowns | Barrage | Bonfire, the Hunt (ready again on a kill) |
| MP flow | Barrage | Bonfire, the Storm, Blood Pact (by paying HP instead) |
| HP spent, low HP | Blood Pact | Landslide (max HP into the blow) |
| Heals | Blood Pact | the Toll (the keeper), Thousand Cuts (a mend per hit) |
| Kills as triggers | the Hunt | Barrage (ready again on a kill) |
| Spread | the Storm | each road's pack game |
| Focus and targeting | the Hunt | Bonfire and Cold Snap (the pile), Thousand Cuts (hits on one wound), Landslide (aiming the blow) |
| Seek and reach | the Hunt | |
| The fight's start | the Hunt | Landslide, Cold Snap, the Toll, Barrage |
| Bleed | Thousand Cuts | the Toll, the Hunt |
| Burn | Bonfire | |
| Chill | Cold Snap | the Toll (the attacker slowed) |
| Shock | the Storm | the Toll (the attacker pays) |
| Sunder | Landslide (the target opened), Thousand Cuts | Cold Snap, the Storm |
| Weaken | the Toll | Blood Pact |
| Evasion and dodges | Thousand Cuts | the Toll (the dancer) |
| Lifesteal | Blood Pact | Thousand Cuts |

### Seat roles the builds share

| Seat role | Builds that use it (their name for the seat) |
| --- | --- |
| Draws the blows | the Toll (anchor), Bonfire (keeper), the Storm (rod), Landslide (anvil), the Hunt (warden) |
| Gives to the others | Landslide (loader), Barrage (conductor, well), Blood Pact (donor), the Toll (warden) |
| Acts often, hits small | Thousand Cuts (blades), Bonfire (stoker), Cold Snap (frost seats), the Storm (squalls) |
| Acts rarely, hits big | Landslide (hammer), Cold Snap (breaker), Thousand Cuts (opener) |
| Picks the target | the Hunt (marker, chaser) |
| Is fed by the other two | Barrage (soloist), Landslide (hammer), Blood Pact (bleeder) |
| Pays to give power | Blood Pact (bleeder) |

**What a formation has to be** for a party to pivot to it, from what was and wasn't fought in:
- **About one thing.** All three seats serve what the build does, and no seat is a tax.
- **A promise in plain words,** big enough to see: a stat, a status by name, who it lands on.
- **Seats many classes can fill.** A seat that reads who sits in it says so on the seat.
- **One for each phase.** Every build has a common formation a run could start in, a rare that reads who sits where, and a legendary that changes how the party fights.

A build still plays in Neutral, and no build needs one formation. How formations arrive in a run is the rogue mode's (*Core set: the rogue mode*), and the formations have to work however they arrive.

### Every class in the set

Each class's three identities (`docs/core-set/classes.md`), and the roads each one serves.

| Class | Its identities' roads |
| --- | --- |
| Knight | stone wall: Landslide · anchor: the Toll, Bonfire (the keeper), the Storm (the rod) · champion: Barrage (the well), Landslide |
| Cleric | mender: Blood Pact · anchor's priest: the Toll · font: Barrage |
| Ranger | marksman: the Hunt · skirmisher: Thousand Cuts · trapper: Thousand Cuts, Cold Snap |
| Bramble knight | anchor: the Toll · field of thorns: the Toll's pack game · grove-keeper: Landslide, Blood Pact · its briars: Thousand Cuts |
| Hoplite | bruiser: Landslide, the Hunt · phalanx: Landslide, the Storm · bodyguard: the Toll, Blood Pact |
| Paladin | judge: the Hunt · healer: Blood Pact · champion of the line: the Toll, Bonfire |
| Valkyrie | storm spear: the Hunt, the Storm · shield-sister: Blood Pact, the Toll · thunderhead: the Storm · her Shield from hits: Thousand Cuts |
| Bard | conductor: Barrage, Landslide · troubadour: Blood Pact · skald: Thousand Cuts, the Storm |
| Hexer | spellbreaker: stopping a cast · curser: the Toll · elemental blade: Bonfire, Cold Snap, the Storm |
| Monk | blur: Thousand Cuts, the Storm · dancer: the Toll · point-striker: the Hunt, Cold Snap · its burning fists: Bonfire |
| Assassin | ambusher: the Hunt · hunter: the Hunt, Thousand Cuts · drinker: Blood Pact |
| Vampire | drinker: Blood Pact · blood-well: Barrage · frenzy: Thousand Cuts |
| Pyromancer | ritualist: Bonfire, Barrage (the soloist) · kindler: Bonfire · conflagration: Bonfire's pack game |
| Frostweaver | ice wall: Cold Snap, the Toll (the warden) · disabler: stopping a cast · shatter killer: Cold Snap, Barrage |
| Stormcaller | tempest: the Storm, Barrage · storm fist: the Storm, the Hunt · lightning rod: the Toll, the Storm |
| Geomancer | landslide: Landslide · quake: Landslide, Cold Snap (the breaker) · stone warden: Landslide, Blood Pact, Barrage |

Four things for the upgrades to know:
- **The Hexer's spellbreaker and the Frostweaver's disabler serve an answer (stopping a cast), not a road.** The class frame wants each identity viable.
- **The Assassin's ambusher and hunter both serve the Hunt.** The hunter also opens the wounds for Thousand Cuts.
- **The Pyromancer is in two roads;** the Cleric, Ranger, Assassin, Vampire and Frostweaver are in three; every other class is in four or more.
- **A version drains a foe's MP:** the Vampire's Drain the well. The player can't see a foe's MP, so it's mana gain for its user, and the drain counts for nothing in a build (`docs/rules.md`).

## Checks on the whole set

- **The rhythms and shapes spread across the space:** rare and huge (Landslide), spikes in a dense stream (Thousand Cuts), a fire that leaps and sags (Bonfire), bursts on a beat (Cold Snap), following the foes' actions (the Storm), a volley and then a staircase (the Hunt), following the foes' attacks (the Toll), in salvos from one unit (Barrage), see-sawing (Blood Pact).
- **Four roads are a status's, each on its own clock,** and five aren't a status's at all. A status the party stacks read as a build in play; it isn't what a build has to be.
- **Every build's sign is in a base kit.** At least one class shows each build's direction with a passive or one ability, before any piece, and most builds have two or three. It's a check on this set, not a rule for what a build is: a sign can as well come from a piece or a formation.
- **Every build has a route with a starter** (the Knight, Cleric or Ranger).
- **Every build has a pack game and a boss game,** and says which is worse.
- **Every build has engines, and shares most of them** (*Engines*, Across the web). Blood Pact has the fewest, and Landslide and the Toll the most.
- **Builds that share a mechanic feel nothing alike.**
  - Being hit: the Toll's return, Blood Pact's brink.
  - Big numbers: Landslide's loaded blow, the Hunt's chosen strike, Barrage's repeated spell.
  - The foes' own doing: the Toll's attackers, the Storm's every action.

**Set aside:**
- **Stranglehold:** a build on debuffs. They can't keep a party alive at today's sizes, and may not neuter a foe team at any number. It could come back if debuffs are ever made big enough to stand on.
- **Phoenix:** a build on falls. Nobody chooses who falls; revives are the net.
- **Ambush alone:** an opening with no tail. Its rhythm is the most distinct of any opening, which is why the first strike is kept in the Hunt.
- **Harvest alone:** spread as a build. It's each build's pack game, and the Storm's nature.
- **Lockdown:** waiting for the foe's wind-up. Stopping a cast is an answer, not a build.
- **Overflow's relay:** mana passed round three casters. Its links can't be made big enough to see without being a build's whole power.
- **The chorus:** the party's own buffs as the thing stacked. Today a buff helps every build about equally, which is what a piece shouldn't do.
- **The gambler:** crits on everything. The Hunt's and Landslide's crits cover it, and it may come back as exotics.

## Least sure

- **The engines that span units.** In play one unit's slots made a synergy and three units' rarely did. Eleven of the twenty-eight live on one unit; the rest need two units or the whole party, and may meet as seldom as cross-unit synergies did in play.
- **The engines held in versions.** The reaping and the emptied quiver, and the cull and the quake already in the kits, are whole only when the right abilities are known and trained, which is late.
- **The Toll and Landslide touch the most engines** (nine each). The anchor is where the foes' own doing lands, so it's the easiest place to find one, and the Toll is the road that least needs making stronger.
- **Engines one by one:**
  - **the goad** speeds the foes up, which a player may never choose;
  - **the fuse** buys less the faster Burn drains, and Bonfire runs on a fast drain;
  - **the crescendo** may be a ramp and no more;
  - **the brink,** with an Aegis landing on it every time, may be a unit that can't fall;
  - **the carrier** may read as clever and pay too little in fights this short.
- **The Storm.** Its hook is real against packs and busy back rows. Against a lone, slow boss it pays on the boss's schedule.
- **Bonfire.** Upkeep is a rhythm only if the fire visibly leaps and sags. If it settles to a level, it reads as a status again.
- **Four of the nine are a status's road.** It's the cheap way in. Whether it's the right one is open.
- **Thousand Cuts,** centred on Bleed, doesn't hold speed for its own sake. Speed is a thread every status road wants.
- **The Hunt** without hiding at its centre may be thin for a class whose kit is hiding.
- **Blood Pact** asks the player to spend what the game drains.
