# Design: the builds

The design stage of the builds pass, for the director's gate. The intent is `intent.md`; the evidence is `state-of-play.md`. It's written the way `docs/gear-design/philosophy.md` asks for a builds stage: each build as a way to play, with its rhythm, threads, routes, rungs and needs, and the web between them. No pieces, and no numbers but the measurements under *Staying alive*. Each build also says what the intent asks of it: how a player finds it at each phase of a run, how it stays alive, and what it asks of the kits.

Nothing here is built. Approved, it replaces `docs/gear-design/builds.md`, and the loot's spine is written from it.

## For the director

### Decisions

1. **The set is ten builds, not twelve.** Six keep their heart and are rebuilt on what play showed. Three are new, each standing where a build failed. Two stop being builds and become things every party has. The table below says what became of each; *Set aside* at the end says what I'd grow first if you want twelve.
2. **Four changes to the game,** each for one build (*Changes asked of the game*). Three touch a status or a class's base ability, so they're yours to rule on.
3. **Half the set is designed to stand without a wall.** That's my answer to "maybe every build needs a tank": no, but every build needs a plan for who is being hit, and two of the four plans that aren't a wall are unproven. *Staying alive* has the plans, the numbers I have and what would prove me wrong.
4. **Every build answers a pack and a lone boss.** A test I've added. Three of the twelve were written to fear a lone boss, and bosses and pairs of elites are where most of the sample's runs ended.
5. **Three new names:** Stranglehold, the Storm, Barrage.

### What became of the twelve

| Of the twelve | Now | Why |
| --- | --- | --- |
| Bonfire | **Bonfire** | It worked. Its rhythm didn't show, so the fire now passes on as part of Burn, and the keeper feeds it. |
| The Toll | **The Toll** | It worked from the kit and had nowhere to go. Now the party joins the toll, and the toll follows the size of the blow, for the bosses where it died. |
| Landslide | **Landslide** | Its first step read as plain defence. It's now the party that loads one blow; the stone is how it lives long enough. |
| Thousand Cuts | **Thousand Cuts** | It never formed as a party. Rebuilt on Bleed opened and cashed, and on staying alive by hitting. |
| The Hunt, Ambush | **The Hunt** | The kill reset and the execute carried a run, the Mark was never seen, and the opening was never tried and has no tail. One build: it opens from hiding, and every kill is a new opening. The player already took the two names for one thing. |
| Cold Snap | **Cold Snap** | It shattered once and stopped. Same heart, with the cold as its defence, a shatter that leaves cold behind, and Lockdown's pile-in on the frozen foe. |
| Lockdown | **Stranglehold** (new) | Its window came too rarely and the player couldn't make it come. In its place, afflictions that stay: the more kinds a foe holds, the less it does and the more it takes. |
| Harvest | **The Storm** (new) | Spread was never seen as a build, and lost to focus on every slot. Spread becomes each build's pack game. The build is the storm: Shock on everything, set off by the foes' own actions. |
| Overflow | **Barrage** (new) | The relay's links were too small to see and its engine sat on the frailest units. In its place, one caster's great spell again and again, fed by the other two. |
| Blood Pact | **Blood Pact** | Kept, and the least proven. Widened from one payer to a party that fights at the brink, with nets over whoever is low. |
| Phoenix | no build | Nobody chooses who falls. Revives, and what softens a fall, sit under every build (*Elements, not builds*). |

### Least sure

- **Stranglehold** may read as "debuffs are good" and not as a build. It needs the count of kinds on screen.
- **The Storm** may read as Bonfire or Thousand Cuts in yellow. Its claim is that its damage follows the foes' actions and falls everywhere.
- **Barrage** is two units serving one. The Bard read as a dead unit in play; if the conductor's gifts aren't seen, this fails the same way.
- **Blood Pact** asks the player to spend what the game drains. I've kept it because HP is one of the two fuels the philosophy names and a class is built on it.
- **Cold Snap and Stranglehold without a wall.** Their plan is to make the foes do less, and nothing I can measure today says that holds.
- **Ten.** Each of the ten has a reason to exist that the others don't cover. I couldn't say that of an eleventh.

## Changes asked of the game

| # | Change | For | Why |
| --- | --- | --- | --- |
| 1 | **Marked takes the party's random picks:** abilities aimed at a random foe follow the Mark as basic attacks do, inside the Taunt rule. An ability with a target phrase of its own keeps it. | The Hunt | The Mark was on the field in about twenty fights and nobody saw it, because abilities scattered while swings obeyed. With this, a Mark looks like everything landing on one foe. The two Marks the Paladin's kit already holds (the highest Attack, the lowest HP) match the two aims most hunters' abilities already have. |
| 2 | **Burn passes on:** when a burning foe falls, a share of its Burn goes to the foe with the most. Part of Burn itself, so every fire does it. | Bonfire | Each kill coming sooner than the last is the build's rhythm, and it never showed. The pieces that passed fire on were offered and skipped: a slot spent on the next foe lost to one spent on the foe already burning. So it can't cost a slot. In the status, the route with no mage gets it too. |
| 3 | **A shatter leaves cold behind:** it spends part of the Chill, not all of it (a number in `STATUS.chill`). | Cold Snap | In play Chill reached its cap, shattered once and thawed. With cold left behind, the second shatter is nearer than the first, and the foe stays slowed when its Stun ends. |
| 4 | **Malison pays for breadth:** the Hexer's curse does more for each different affliction a foe holds, as its own damage, in place of one more stack of each. | Stranglehold | It puts the build's sign in a base kit, and the Hexer's work shows as the Hexer's. In play the Hexer had the lowest damage share of any class, and was benched or fell in a third of its fights. |

Changes 1 and 2 change what a status does, and 4 a base ability; each goes past "numbers, not behaviour", which is why they're here and not in a tuning pass. None spends or sets off a status early. Change 3 is a number.

**Two flags, no change asked:**
- **Only the Vampire's base kit pays HP.** Blood Pact widens through Lifesteal's kinds and versions other kits already hold. The Berserker, when it's added, is its natural second home.
- **`docs/core-set/classes.md` names a Hexer version the data doesn't have** (Culmination; the data has Expose). The upgrades are redesigned after this pass, so I've left it.

## The frame

**What a build is doesn't change** (`docs/gear-design/philosophy.md`): a way to play you can watch, with a rhythm, woven from several threads, reached by more than one route, in rungs.

**What a run gives a build.** The rungs are written against the three phases of a run:
- **Act I:** three units knowing an ability or two each, a weapon each and a piece or two more by the boss, mostly in Neutral. A build can show its direction here. It can't be assembled.
- **Act II:** most slots filled, a version or two a unit, formations, a mythic. This is where a build is built.
- **Act III:** whole kits and legendaries. The far end.

**Left unjudged, as the intent asks:** kits arriving one ability at a time, and cooldowns carrying. The set is written to hold either way. The two builds that would feel a change most are Barrage (making a spell ready again is worth more while cooldowns carry) and the Hunt (its opening is the one thing a carried cooldown can't delay).

**What every build answers,** beyond the old headings:
- **Through a run:** its three rungs as the sign, the build and the far end. Each says what the player sees, what the step is, and what it pays if the run goes no further.
- **Stays alive:** its plan for who is being hit.
- **Packs and bosses:** it has a game for both, and says which is its worse fight.
- **Asks of the game:** kit or rule changes, by number from the table above.

**What every build asks of the loot,** so it isn't repeated ten times:
- **A first step that's seen the first time it fires.** In play a few Might, a tenth off a cost and a cooldown a few ticks closer were never seen to happen.
- **A first step that doesn't cost the front.** In act I a careful party takes defence first, and it's right to.
- **A formation about one thing:** three seats that all serve what the build does. The one formation that made three units one build in play was that.

## The rhythm space

| Build | Damage over a fight | Danger | Turns | What it spends |
| --- | --- | --- | --- | --- |
| **Landslide** | long quiet, then one huge number | steady, soaked by stone | few, big | MP on stone, to save HP |
| **Thousand Cuts** | a dense, even stream from the first tick | even, and paid back hit by hit | none | HP: little casting |
| **Bonfire** | rises all fight; each kill comes sooner than the last | early, while the fire is small | one, slow: the catch | MP, on the casts that feed the fire |
| **Cold Snap** | bursts on a beat you can count | falls as the field slows | many, medium: each shatter | MP |
| **The Hunt** | a spike at the first tick, then a staircase of kills | early, falling with each kill | regular: each kill | both: HP in the first moments, MP on reach |
| **The Storm** | in squalls, wherever the foes are busiest | full until the field falls, and on the rod | each storm rolling in | MP, on the storms |
| **The Toll** | follows how much the foes attack | all on one unit | few | HP: the anchor's |
| **Stranglehold** | low and level, creeping up as the afflictions pile | low and flat; the fight is long | few, small: a cast lost | MP on curses, to save HP |
| **Barrage** | in salvos from one unit | a cliff when the mana or the caster stops | each salvo | MP, more than any other |
| **Blood Pact** | high and steady | swings and rights itself | many, medium | HP, in place of MP |

The ten sit in pairs on opposite sides of the space:
- **Landslide and Thousand Cuts:** one huge blow, or many tiny ones.
- **Bonfire and Cold Snap:** a smooth climb, or bursts on a beat.
- **The Hunt and the Storm:** one at a time, or everything at once.
- **The Toll and Stranglehold:** invite every blow, or let none land whole.
- **Barrage and Blood Pact:** mana poured out, or life.

## The builds

### Landslide

**Identity.** A party that loads one blow. Long stretches of small numbers go by behind stone bars. A wind-up bar fills on the hammer while Might piles onto it and its target is opened up. Then one number lands far bigger than anything else in the fight, and an elite loses a large share of its HP. The stone is rebuilt, and it happens again. It's waiting for the blow to come round.

- **Threads:**
  - the heavy action: slow swings, long wind-ups, long cooldowns;
  - loading it: Might on the slowest hitter (it's spent an action at a time, so it lasts where actions are rare), crits and Crit damage, Sunder laid on the target before the blow lands;
  - Defense, max HP and the Shield as damage stats, so the body is the weapon;
  - stone on the whole party, as the time the blow needs;
  - the break: a Shield breaking as a trigger;
  - the blow twice, or ready again;
  - aim: at the healthiest foe, the most armored, the stunned.
- **Routes:** Geomancer, Knight, Hoplite · Geomancer, Paladin, Bard · no earth: Knight, Hoplite, Bard.
- **Seats it likes:** a hammer whose actions come less often and land bigger; an anvil that wears the stone and draws the blows; a loader that gives the hammer what the party has to give (stone, Might).
- **Through a run:**
  1. *The sign.* One unit whose heavy thing already out-sizes everything round it: rocks that crit from behind a Shield, a double swing, a bash from max HP. The sign is the number, and that Defense or HP on a piece makes it bigger: here the careful pick and the build's pick are the same piece. The step is the first piece that says so on its card, heavier and rarer.
  2. *The build.* A loading crew: Might aimed at the hammer, the target opened first, stone on everyone, the blow aimed at something worth it. Elites lose a large share at a time, and a boss takes a handful of blows.
  3. *The far end.* The stone becomes the blow: the Shield pool and its breaking are damage, and the blow lands twice.
- **Stays alive:** stone on everyone. Shields, Guard and an Aegis across three heavy bodies, not one anchor. Fights run long, so the stone has to be rebuilt, and that's where its MP goes.
- **Packs and bosses:** bosses and armored foes are its best fights: a huge hit loses little to Defense. A pack is its worst: a blow spent on a wolf is a long wait wasted. Its pack game is the shove that hits every foe and the aim that saves the blow for the biggest. It fears dodgers, and anything that strips Shields.
- **Needs:**
  - **Pieces:** heavier and rarer, for swings and for abilities; Might for one unit, not three; damage from the Shield pool, Defense and max HP; a Shield's breaking as a blow. Every Landslide piece promises a blow on its card: the ones that promised stone alone were worn as plain defence, by everyone.
  - **Formations:** hammer, anvil, loader; formations that trade the party's speed for size.
  - **Upgrades:** slower and heavier versions; versions that aim the blow.
- **Asks of the game:** none. Its miss was the loot's signposting, not the kits.
- **Least sure:** the quiet between blows. The stone bars have to be what you watch.

### Thousand Cuts

**Identity.** A blur. Tiny numbers, several a tick. A wound opens on a foe and every hit after cashes it in, red beside white. The party is hard to pin down: a MISS, a Shield bar rebuilt by every hit, HP drunk back as fast as it's lost. It isn't waiting for anything; it never stops.

- **Threads:**
  - speed: fast weapons, Haste, Attack speed;
  - extra strikes: Double strike, multi-hit abilities;
  - Bleed opened wide (a crit, a barb, a thorn) and cashed by every hit after, which is why a wounder and a blur want each other;
  - riders that count every hit, extra strikes included;
  - staying alive by hitting: life drunk, a Shield built, an ally mended, hit by hit;
  - Evasion, and the dodge as one more trigger;
  - a count of hits landed this fight that turns into something;
  - Sunder under it all, its answer to Defense beside Bleed.
- **Routes:** no wall: Valkyrie, Vampire, Monk · wounders behind briars: Bramble knight, Assassin, Ranger · a pacer and two blurs: Bard, Monk, Stormcaller.
- **Seats it likes:** a pacer that speeds the others; two blades that act more often and hit smaller.
- **Through a run:**
  1. *The sign.* Early units mostly swing, so this build starts by itself: a fast weapon, and a passive that pays on every hit (a wound, a Sunder, a Shield, a mend). The step is the faster of a class's two weapon kinds and one rider, and it's worth taking on any unit.
  2. *The build.* A wounder and a blur together, a pacer, and a front kept standing by its own hits. Bleed opens wide and is cashed fast, and armored foes stop being walls.
  3. *The far end.* The count: every hit landed this fight makes the next worth more, and extra strikes chain.
- **Stays alive:** by hitting. Each hit drinks, shields or mends, and some blows miss. Its front is whoever does that best, not a wall. The dodge alone didn't hold in play, so the plan leans on the drink and the Shield.
- **Packs and bosses:** a lone boss suits it: every hit on one foe, the wounds never closing. In a pack its swings scatter where Bleed wants them together; its pack game is multi-hits that fan out and riders that pay wherever they land. It fears heavy Defense before the Sunder builds, foes that harden under many hits (the Ice Golem's crust), and the Wisps' Shock, which fast units pay for most.
- **Needs:**
  - **Pieces:** riders that count every hit; Bleed from more than crits; a drink or a Shield per hit on Mail and Leather; a count that grows; a dodge that pays, on more than Leather.
  - **Formations:** pacer and blades; formations that make the whole party faster at a cost.
  - **Upgrades:** versions that add hits or spread them.
- **Asks of the game:** none.
- **Least sure:** whether it stays a party's build, or again becomes one unit's four slots with two passengers.

### Bonfire

**Identity.** A fire the whole party feeds. Burn climbs on the hottest foe, a bigger number every pulse, until it's most of the damage on screen. When that foe falls its fire goes to the next, which starts already burning, so each kill comes sooner than the last. Early on the foes press and the keeper holds; by the end they fall one after another. It's waiting for the fire to catch.

- **Threads:**
  - Burn that needs feeding: it drains, so its height is how fast the party feeds it;
  - many feeders: casts, swings that carry fire, and the keeper's own blows;
  - the pile: every feeder aims at the hottest foe;
  - fire that passes on when its foe falls;
  - a keeper who holds the early fight (Taunt, Shield, Guard, Aegis) and burns what it holds;
  - a blow that reads the fire and leaves it;
  - heat: the party feeds faster the longer the fight runs (Haste on the stokers, power that builds).
- **Routes:** Knight, Pyromancer, Monk · Paladin, Hexer, Pyromancer · no mage: Paladin, Monk, Hexer.
- **Seats it likes:** a keeper that holds the early danger; a stoker that acts more often; a torch whose fire reaches every foe that's already burning.
- **Through a run:**
  1. *The sign.* One unit that leaves Burn: three base kits do, and a version or a piece puts it on a swing. In the act's long fights the fire's own numbers pass that unit's hits, and they get through Defense where its hits don't. The step is a second feeder. It sits on a weapon or a version, so it takes nothing from the front.
  2. *The build.* Three feeders on one pile, a keeper who feeds too, and fire that passes on. Elites and bosses burn for more than the party hits for, and in a pack each kill comes sooner than the last.
  3. *The far end.* Heat: the feeding speeds up through the fight. The blow that reads the fire lands on a pile handed down the whole line.
- **Stays alive:** a keeper. A wall holds the early fight, and because it feeds the fire the seat isn't lost to the build. The late fight shortens itself. It has no plan without one.
- **Packs and bosses:** a lone boss is its best fight: one pile, all fight. In a pack the fire passes down the line; without the passing, every kill starts the climb again. It fears fights too short to catch, and losing a feeder early.
- **Needs:**
  - **Pieces:** fire on swings, for many kinds; a way for a wall to feed (fire on its slow swing, or on what strikes it); a choice between a fire that lasts and one that flares; power that builds as a fight runs.
  - **Formations:** keeper, stoker and torch, all three serving the fire.
  - **Upgrades:** versions that move fire from casts to swings, hold it up, spread it, or flare it.
- **Asks of the game:** Burn passes on (change 2). The length of the climb is Burn's drain (`STATUS.burn`), for the balance pass: the fire should still be rising at the end of a regular fight.
- **Least sure:** whether the catch shows even so. In play Burn was most of the damage and the kills still came evenly.

### Cold Snap

**Identity.** Frost creeps up the foes and they visibly slow: each swing comes later than the last. Then a SHATTER: a burst, a Stun, and the party's heaviest hit lands on the frozen foe. Then the next one. It's waiting for the next foe to reach the cap, and the colder the field, the less the party is hit.

- **Threads:**
  - Chill to its cap and the shatter; anyone's Chill counts;
  - the slow on the way up: the cold is the party's defence;
  - many small applications: swings that carry Chill, multi-hits;
  - the pile or the spread: one foe shattered again and again, or a pack reaching the cap together;
  - the opening a shatter makes: a stunned, sundered foe, and the heavy blow saved for it;
  - cold that attackers carry away from a front.
- **Routes:** Frostweaver, Hexer, Ranger · a front in frost: Knight, Frostweaver, Monk · no Frostweaver: Hexer, Ranger, Geomancer.
- **Seats it likes:** two frost seats that act often and carry Chill; a breaker that hits a frozen foe hardest.
- **Through a run:**
  1. *The sign.* One Chill source (three base kits have one): the foes slow as the counter climbs, and one shatters. The step is a second source. Every stack is also defence, so it's never a pick against the party's safety.
  2. *The build.* Two or three sources and a breaker. A shatter every few ticks, each one a stunned, sundered foe for the heaviest hit in the party.
  3. *The far end.* A shatter that seeds the next, and a field that never thaws.
- **Stays alive:** the cold. A chilled field acts far less, and every shatter is a Stun. It has no front, so the cold has to reach the whole field early.
- **Packs and bosses:** spread over a pack, the cold slows everything and the shatters come together, like a string of firecrackers. Piled on a boss, it's a slow all fight and a burst on a beat; a boss shrugs off the Stuns after the first few, not the slow or the burst. It fears fights too short to reach the cap.
- **Needs:**
  - **Pieces:** Chill on swings, for the fast kinds; Chill from being struck, for Plate and shields; payoffs on a frozen foe; something that makes one shatter the start of the next.
  - **Formations:** the frost seats and the breaker; formations where one seat's hits set up another's.
  - **Upgrades:** versions that aim at the foe nearest its shatter, or spread the cold wide.
- **Asks of the game:** a shatter leaves cold behind (change 3). The Chill counts are set so one source shatters a foe more than once in a regular fight, which *Core set: classes* already makes the balance pass's first job.
- **Least sure:** the plan without a wall (*Staying alive*).

### The Hunt

**Identity.** The pack takes them one at a time. It opens from hiding: the first strike lands before the foes have acted, on the weakest or the most dangerous, and it's a kill or nearly. Every kill sets up the next: a blow ready again, a volley, a moment unseen. The foes' numbers drop like a staircase. It's waiting for the next kill.

- **Threads:**
  - the first move: unseen at the start, a first strike that lands bigger, the fight's start as a trigger no cooldown gates;
  - focus: the party's picks agreeing (Marked, aim at the lowest HP);
  - reach: Seek past a Taunting front;
  - the kill as a trigger: a reset, a volley, Hidden again;
  - executes: damage that grows as the foe's HP falls, so a boss is one long staircase;
  - crits and Crit damage on a few chosen hits;
  - Silence on the back row's casters.
- **Routes:** no wall: Assassin, Ranger, Valkyrie · a judge who calls the target and holds the front: Paladin, Assassin, Stormcaller · no Assassin: Hoplite, Valkyrie, Ranger.
- **Seats it likes:** a marker whose pick sets the target; a chaser with reach, unseen at the start; a warden that holds the front.
- **Through a run:**
  1. *The sign.* A unit that picks its prey (the lowest, the back row, past a guard): the dangerous foe dies first, or never acts. The step is a kill or a first strike that pays something seen on the very next hit.
  2. *The build.* The party's picks agree, the fight opens from hiding, and every kill pays. Mixed groups fall in a drumbeat that speeds up.
  3. *The far end.* An opening that clears the weak, and executes that carry the boss.
- **Stays alive:** kill order. The most dangerous foe dies first and the dead don't hit; the frail hunter is unseen while it matters; a warden holds what's left. Against a lone boss kill order buys nothing, and the warden is the plan.
- **Packs and bosses:** mixed groups with a dangerous back row are its best fights. A lone boss is its worst until the executes come: one step, no staircase. It fears Ghouls raised behind the hunt, and a Taunting front if it has no reach.
- **Needs:**
  - **Pieces:** kill rewards sized to be seen (a whole action, not a few ticks of one); executes; Hidden and a bigger first strike at a fight's start, for more classes than the Assassin; the Mark from more hands.
  - **Formations:** marker, chaser and warden, all three serving the kill.
  - **Upgrades:** versions that change what an ability aims at, or make it ready again on a kill: the kind that carried a run.
- **Asks of the game:** Marked takes the party's random picks (change 1).
- **Least sure:** whether one build can hold an opening and a chain without being two half-builds. The claim is that a kill is a new opening.

### The Storm

**Identity.** Sparks everywhere. While the storm is up, every swing in the party leaves Shock on what it hits, arcs jump to the foe beside it, and each time a foe moves it's hurt for it. The busier the enemy, the faster it dies, and a pack's bars sink together. Then a heavy blow comes down on the most charged foe. It's waiting for the storm to roll in again.

- **Threads:**
  - Shock: paid each time its holder acts, so fast foes and hasted foes pay most;
  - spread: strikes that arc, chain or land on three;
  - the squall: a storm on the whole party for a while, and what the party does while it's up;
  - quick, light strikes: Attack speed, extra strikes;
  - the cash: a blow that reads the Shock on its target and leaves it, on one foe or on every charged one;
  - the rod: one unit holds the field's attention while it charges.
- **Routes:** Bramble knight, Stormcaller, Valkyrie · Knight, Stormcaller, Monk · no Stormcaller: Valkyrie, Hoplite, Hexer.
- **Seats it likes:** a rod that draws everything; two squalls whose hits spread.
- **Through a run:**
  1. *The sign.* A unit whose strikes spread and shock: packs sink together, and spark when they swing. The step is Shock from a second unit's swings.
  2. *The build.* The storm on everyone's swings, a rod, and a blow that cashes the charge. Packs are erased, and a boss sits near Shock's cap and pays every time it acts.
  3. *The far end.* A storm that doesn't lift, and a cash that falls on everything charged.
- **Stays alive:** a rod. Shock punishes a foe for acting; it doesn't stop it, and in a pack every foe is alive and acting until late. One unit holds the field, and the best rod charges what strikes it.
- **Packs and bosses:** packs and fast foes are its best fights, and a foe that's hasted fries itself. Against a lone, slow boss the Shock piles between its actions and pays in big, rare bolts, and the cash blow does the rest. It fears Bomb Bugs (every blast at once) and Lava Slimes (an even field splits every slime).
- **Needs:**
  - **Pieces:** Shock on swings, for the fast kinds; a cash for more classes than the Valkyrie; spread that comes with something else on the piece (a slot whose whole promise was one more foe was never taken); Shock laid on whatever strikes the rod.
  - **Formations:** rod and squalls; formations that pay for how many foes one action touches.
  - **Upgrades:** one foe or every foe; a longer storm or a harder one.
- **Asks of the game:** none.
- **Least sure:** whether it plays apart from Bonfire and Thousand Cuts.

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
  1. *The sign.* On floor one, from the kit: a Bramble knight, or a Knight that Taunts in thorns. Packs die on it. There's nothing to find, which is why it's in most parties; the question it puts is what the wall wears next.
  2. *The build.* The other two join the toll: blows on the anchor set off what they've laid (the attacker bleeds, sparks, slows, weakens), and the anchor has a keeper. Swarms die on the wall while the third seat does something else.
  3. *The far end.* The toll follows the blow: retaliation sized by the hit taken, and growing with the beating. A boss's slow swings feed it.
- **Stays alive:** it is the wall. Its risk is the one play showed: when the anchor falls, the rest fall behind it. So the keeper is part of the build, not an extra.
- **Packs and bosses:** swarms and fast foes are its best fights. A boss or a pair of elites that barely swing is where it died in play; the third rung is written for that, and untested. It gets nothing from foes that don't strike (Bone Priests, Witches), or from Area, which ignores the draw.
- **Needs:**
  - **Pieces:** Taunt on gear, for more anchors; what an attacker carries away, for the allies to give; retaliation sized by the blow, and Thorns that grow with the beating; a dodge that protects as well as strikes back, so a dancer's one landed blow isn't the end of it.
  - **Formations:** the anchor seat, with two seats that add to its toll.
  - **Upgrades:** versions that change who the anchor is and what it returns.
- **Asks of the game:** none.
- **Least sure:** whether its second rung gets taken when dressing the wall for another build is the rival pick. That's the right rival to have.

### Stranglehold

**Identity.** Nothing the foes do lands whole. A row of afflictions grows on every one of them: weakened, chilled, sundered, bleeding, silenced, marked. Their hits print small, their swings come late, their casts are lost, and the party's hits print bigger with every kind on the target. Fights run long and the party ends them nearly full. It's waiting for the row to fill.

- **Threads:**
  - breadth: how many different afflictions a foe holds, not how deep any one runs;
  - Weaken as the staple: what lands, lands small;
  - hits that grow on an afflicted foe (Judgement; a curse that reads the row);
  - Silence and Stun as the grip's peaks: a cast lost, a foe out of the fight for a moment;
  - drain: Siphon, MP taken from the foes' casters, buffs stripped;
  - Sunder under everything;
  - MP for the curses, and Siphon paying some of it back.
- **Routes:** Hexer, Paladin, Ranger · Weaken from three hands: Hexer, Vampire, Hoplite · no Hexer: Paladin, Assassin, Frostweaver.
- **Seats it likes:** three seats that each lay a different affliction; or a curser, a judge whose hits read the row, and a jailer whose lockouts come round faster.
- **Through a run:**
  1. *The sign.* A curse beside a hit that reads it: the cursed foe hits for less and takes more. The step is a second kind of affliction, not more of the first. Each kind blunts the foes, so it's a pick for the party's safety too.
  2. *The build.* Three or four kinds on every foe, Weaken across the field, and hits that count the kinds. Fights end with the party near full.
  3. *The far end.* The grip closes: afflictions feed each other, casters run dry, and an elite barely acts.
- **Stays alive:** denial. What lands, lands small and late, and the great casts are lost. Medium bodies in Mail, no wall.
- **Packs and bosses:** curses that reach every foe are its pack game. On a boss, Stun, Silence and Slow wear off, but Weaken, Sunder and every damaging status don't, so the grip holds where a lock wouldn't. It deals the least damage in the set, so the enrage is its clock, and a healer among the foes is its worst fight.
- **Needs:**
  - **Pieces:** one more kind of affliction from a swing or a fight's start, across many gear kinds; payoffs that count kinds, in damage dealt and in damage not taken; Weaken from more classes; MP back from afflicted foes.
  - **Formations:** three seats with a different affliction each; a party effect that reads the row.
  - **Upgrades:** versions that trade one affliction for another, or widen one to every foe.
- **Asks of the game:** Malison pays for breadth (change 4).
- **Least sure:** whether it reads as a build. Its pieces have to be worth little to a party that lays one kind deep, and the count has to be on screen.

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
  1. *The sign.* A caster with one spell worth repeating, and anyone who gives mana. The sign is the caster not swinging its staff. Every caster party feels the shortage, so the step (mana in fights, however it comes) is one it wants anyway.
  2. *The build.* A conductor: the spell twice, or ready again; Cooldown and Cast speed on the soloist. The spell lands several times in a fight where it used to land once.
  3. *The far end.* A cast that pays for the next, and mana as damage.
- **Stays alive:** a keeper, who is the well where it can be: the Knight's Taunt and Clarity are one ability, and the Frostweaver is a sturdy well. The soloist draws little. Its danger is a cliff, not a slope.
- **Packs and bosses:** whatever the soloist's spell is; choosing the soloist is choosing that. It fears Silence (the Wraiths, the Silent One), Leeches, and a fight longer than the mana.
- **Needs:**
  - **Pieces:** links sized to be seen: a whole cast's mana, a whole cooldown, not a tenth of either; Cooldown and Cast speed where casters wear them; an answer to Silence; something of their own for the two who serve, so they're more than batteries.
  - **Formations:** soloist, conductor, well.
  - **Upgrades:** versions that make an ability ready again on a cast or a kill, or pass mana on.
- **Asks of the game:** none in the kits. Clarity's and Refrain's mana have to be big enough to change what the caster does: the balance pass's.
- **Least sure:** two units serving one.

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
  1. *The sign.* A drinker: the Vampire, or Lifesteal on anything that hits hard. A unit that heals itself by hitting, and potions saved. It's taken as sustain, which is right: sustain is the build's floor.
  2. *The build.* The price: abilities and pieces paid in HP that buy what mana can't, power below half for the payer and from its allies, and a net over whoever is low. Fights where the mana never runs out.
  3. *The far end.* Life as the party's one currency: strongest at the brink, and full when the fight ends.
- **Stays alive:** drink and nets. The lower it is the more it drinks; the healers quicken at the brink; a Shield or an Aegis takes the blow that would finish a low unit. It's the riskiest plan in the set, on purpose.
- **Packs and bosses:** long fights against things it can drink from. It fears Bats (a dodged hit drinks nothing), the Witch's curse (a weakened hit drinks less), Rot, and burst that catches it low.
- **Needs:**
  - **Pieces:** prices in HP that buy more than their mana would, repaid inside the same fight; power below half that doesn't leave a unit low when the fight ends; nets; a last drink.
  - **Formations:** bleeder, drinker, donor; formations where life moves between seats.
  - **Upgrades:** versions that pay life or pass it.
- **Asks of the game:** none in the kits; see the flag under *Changes asked of the game*.
- **Least sure:** all of it. HP is what the game drains, and in play nobody paid it.

## Staying alive

The intent's question: does every build need a tank? **No. Every build needs a plan for who is being hit,** and the wall is one plan of five.

| Plan | What it is | Builds | From floor one? |
| --- | --- | --- | --- |
| **A wall** | one unit draws the blows and soaks them | the Toll, Bonfire, the Storm, Barrage | yes: a Taunt and a body |
| **Stone on everyone** | Shields, Guard and Aegis across heavy bodies | Landslide | yes |
| **By hitting** | each hit shields, drinks or mends | Thousand Cuts, Blood Pact | yes: they're passives |
| **Kill order** | the dangerous die first; the frail one is unseen | the Hunt | partly |
| **Denial** | the foes slowed, weakened, silenced | Cold Snap, Stranglehold | no: it builds over a fight |

Every build that stands without a wall also has a route with a wall or a heavy body in front.

**What I can measure.** Today's hand-built parties for the twelve (`npx tsx tools/build-test.ts --quick --no-ablate`): whole kits, every fight from full HP, two seeds, today's knobs. Nearly every fight is won at those knobs, so the read is HP lost per won fight, on act II's fights at rung 2. The pieces are the old ones, so it's a pointer, not a verdict.

| Party | Its plan | HP lost per won fight |
| --- | --- | --- |
| Knight, Hexer, Hoplite | a wall | 6% |
| Knight, Pyromancer, Hexer | a wall | 7% |
| Bramble knight, Cleric, Stormcaller | a wall | 8% |
| Valkyrie, Ranger, Vampire | by hitting | 6% |
| Vampire, Monk, Cleric | by hitting, and a healer | 9% |
| Valkyrie, Ranger, Assassin | kill order | 11% |
| Frostweaver, Hexer, Ranger | denial | 28% |
| Stormcaller, Hexer, Pyromancer | none | 30% |
| Bard, Frostweaver, Hexer | none | 37% |

Across all thirty-six routes: with a Knight or a Bramble knight, 3% to 29%, the middle one 11%; without, 4% to 40%, the middle one 14%.

- **A real plan with no wall already costs no more HP than a wall,** once the party is built. What costs three to five times as much is three light bodies with no plan.
- **By hitting and kill order hold. Denial doesn't yet.** The cold, as the kits and Chill's numbers stand, doesn't protect a party the way a wall does. Stranglehold's denial is untested: nothing today is built on it.
- **Half-built, the gap is wider.** The same parties at rung 1 on act II's fights: the walls 7% to 17%, by hitting 14% and 19%, kill order 37%. On the way to the build, the Hunt's route without a wall is the one that most needs its warden.
- **This says nothing about act I,** where the sample's runs died with one ability a unit. There a wall's plan is whole on floor one, and so is hitting's (the Valkyrie's Shield and the Vampire's drink are passives). Denial has to build first.

**The challenge.** The wall isn't one plan among equals. A unit built to draw takes 85–90% of the foes' picks by rule (`docs/rules.md`, Aggro by doubling), and under one kind of damage the prototype's own report found walls stronger still. Anything that costs less than every other option is what the player takes, and every run that left act I had one. So:
- **The balance pass prices the other plans against the wall,** with hand-built parties that have none, at each rung. Denial first.
- **If denial can't be made to hold,** Cold Snap and Stranglehold take their wall routes. That loses less than it sounds, because a wall is a seat each build dresses its own way (*The web*).
- **What would prove me wrong:** if at the harder knobs the difficulty pass is aiming for, even Valkyrie, Ranger, Vampire can't live, then the game is saying every party needs a wall. I'd look at the draw rule before I accepted that, since it's what makes one unit worth three.

**Walls fail suddenly, the other plans gradually.** In play the anchor fell first in most fights where anyone fell, and the others, near full, fell after it. That's the wall's own danger, and the reason a keeper is written into the Toll.

## Elements, not builds

Four things the twelve treated as builds, or as a build's whole identity, that are better as things any party can have.

- **Falls and returns: the net.** Nobody chooses who falls, so nothing is built on it. A revive, and whatever softens a fall, serves every build. What the net has to do: the returned stay up (each of the five revives inside a fight in the sample was followed by a second fall), the survivors get cover in the moment after, and a knockout needn't be carried into the next fight. It's sized as protection. No piece wants a fall.
- **The first move.** The fight's start is the one trigger nothing gates. It's the Hunt's opening, and a thread several others use: stone at the start, cold at the start, a Taunt at the start, a first cast free.
- **Spread.** Reaching more foes is each build's pack game, not a build: the fire lit across a field, the cold spread wide, thorns that strike a second foe. The Storm is the one build whose nature is spread.
- **Stopping a cast.** A Stun or a Silence timed to a wind-up is an answer to a boss's great cast, as *Core set: enemies* asks, and the act's boss is shown from the start. The versions that wait for a wind-up are that answer. A wind-up was caught five times in 150 fights, so no build waits for one.

## The web

### Threads the builds share

| Thread | Matters most to | Matters some to |
| --- | --- | --- |
| The draw (Taunt, Aggro) | the Toll | Bonfire, the Storm, Barrage, Landslide, the Hunt (the warden) |
| Shield | Landslide | Blood Pact (the net), Thousand Cuts (built by hits), the Toll |
| Defense and Guard | Landslide, the Toll | Cold Snap (a front in frost) |
| Might | Landslide (the slow hitter) | the Hunt (the first strike), Blood Pact (roused at the brink) |
| Haste and speed | Thousand Cuts | the Storm, Bonfire (the stokers), Barrage |
| Riders on basic attacks | Thousand Cuts | Bonfire, the Storm, Cold Snap, Stranglehold |
| Many hits, extra strikes | Thousand Cuts | the Storm, Cold Snap |
| Crits | the Hunt, Landslide | Thousand Cuts (the wounder) |
| Stun | Cold Snap (the shatter's) | Stranglehold, Landslide (the blow on a held foe) |
| Silence | Stranglehold | the Hunt (the back row) |
| Cooldowns | Barrage | the Hunt (ready again on a kill) |
| MP flow | Barrage | Stranglehold, Bonfire, Blood Pact (by paying HP instead) |
| HP spent, low HP | Blood Pact | Landslide (max HP into the blow) |
| Heals | Blood Pact | the Toll (the keeper), Thousand Cuts (a mend per hit) |
| Kills as triggers | the Hunt | Bonfire (the fire passing on) |
| Spread | the Storm | each build's pack game |
| Focus and targeting | the Hunt | Bonfire and Cold Snap (the pile), Landslide (aiming the blow) |
| Seek and reach | the Hunt | Stranglehold (the caster behind a wall) |
| The fight's start | the Hunt | Landslide, Cold Snap, the Toll, Barrage |
| Bleed | Thousand Cuts | the Toll, the Hunt, Stranglehold (one more kind) |
| Burn | Bonfire | Stranglehold |
| Chill | Cold Snap | Stranglehold (the slow), the Toll (the attacker slowed) |
| Shock | the Storm | the Toll (the attacker pays) |
| Sunder | Landslide (the target opened), Thousand Cuts | Cold Snap, Stranglehold |
| Weaken | Stranglehold | the Toll, Blood Pact |
| Evasion and dodges | Thousand Cuts | the Toll (the dancer) |
| Lifesteal | Blood Pact | Thousand Cuts |

### The wall, dressed for each build

Half the set keeps a wall, and what that wall wears is one of a run's real choices, between builds and not between sizes. Thorns (the Toll) are what it wears for free. It can wear fire and be Bonfire's keeper, sparks and be the Storm's rod, frost and front Cold Snap, weakening thorns and front Stranglehold. It can be Landslide's anvil, Barrage's well or the Hunt's warden. So a party with a wall isn't the Toll by default, and the Toll's second rung has rivals.

### The doors

Where a run drifts from one build to its neighbour. Each is named by the thread it goes through; the spine gives each door its pieces.
- **Thousand Cuts into Bonfire, the Storm or Cold Snap, through riders.** A blur picks up fire, sparks or frost on its swings, and becomes that party. With frost, it's the door the director walked through.
- **Thousand Cuts into the Hunt, through the wounder.** The crits that open Bleed are the crits that finish the weakest. Play found the two as one.
- **Thousand Cuts into Blood Pact, through the drink.** A blur that lives on Lifesteal starts paying with it.
- **The Toll into Thousand Cuts, through Bleed.** Foes leave the briars already bleeding, and a blur cashes it.
- **The Toll into the Storm, Cold Snap, Stranglehold or Bonfire, through the wall's dress.**
- **Landslide into the Toll, through Defense and the Shield.** Stone that returns the blow.
- **Landslide into Barrage, through the conductor.** The blow twice.
- **Landslide into Cold Snap, through the breaker.** The heavy blow saved for the frozen foe.
- **Landslide into the Hunt, through the first strike.** Might at the start on the slowest hitter: the one huge blow, struck first.
- **Cold Snap into Stranglehold, through the frozen foe.** Chill is one of the row, and a stunned foe is an afflicted one.
- **Any status build into Stranglehold, through a second kind.** A fire party that picks up Weaken and Sunder starts counting kinds.
- **The Hunt into Bonfire, through kills.** A hunt whose kills pass fire on.
- **The Hunt into Stranglehold, through the Mark.** The judged foe is an afflicted one.
- **Barrage into Bonfire or the Storm, through the soloist.** The spell worth repeating is the one that feeds the fire, or calls the storm.
- **Blood Pact into Barrage, through life for mana.** HP poured into the soloist's pool.

### Seat roles the builds share

| Seat role | Builds that use it (their name for the seat) |
| --- | --- |
| Draws the blows | the Toll (anchor), Bonfire (keeper), the Storm (rod), Landslide (anvil), Barrage (the well, where it can be), the Hunt (warden) |
| Gives to the others | Landslide (loader), Thousand Cuts (pacer), Barrage (conductor, well), Blood Pact (donor), the Toll (warden) |
| Acts often, hits small | Thousand Cuts (blades), Bonfire (stoker), Cold Snap (frost seats), the Storm (squalls) |
| Acts rarely, hits big | Landslide (hammer), Cold Snap (breaker) |
| Picks the target | the Hunt (marker, chaser) |
| Lays something on the foes | Stranglehold (each seat its own affliction), Bonfire (torch) |
| Is fed by the other two | Barrage (soloist), Landslide (hammer), Blood Pact (bleeder) |
| Pays to give power | Blood Pact (bleeder) |

**What a formation has to be** for a party to pivot to it, from what was and wasn't fought in:
- **About one thing.** All three seats serve what the build does, and no seat is a tax.
- **A promise in plain words,** big enough to see: a stat, a status by name, who it lands on.
- **Seats many classes can fill.** A seat that reads who sits in it says so on the seat.
- **One for each phase.** Every build has a common formation a run could start in (its front, and its simplest promise), a rare that reads who sits where, and a legendary that changes how the party fights.

A build still plays in Neutral, and no build needs one formation. How formations arrive in a run is outside this pass. If they stay late, each build's formation is its biggest step in act II; if they come at the start, the common one is a way in.

### Every class in the set

Each class's three identities (`docs/core-set/classes.md`), and the builds each one serves.

| Class | Its identities' builds |
| --- | --- |
| Knight | stone wall: Landslide · anchor: the Toll, Bonfire (the keeper) · champion: Barrage (the well), Landslide |
| Cleric | mender: Blood Pact · anchor's priest: the Toll · font: Barrage |
| Ranger | marksman: the Hunt · skirmisher: Thousand Cuts · trapper: Stranglehold, Cold Snap |
| Bramble knight | anchor: the Toll · field of thorns: the Toll's pack game, the Storm (the rod) · grove-keeper: Landslide, Blood Pact · its briars: Thousand Cuts |
| Hoplite | bruiser: Landslide, the Hunt (the first swing) · phalanx: Landslide, the Storm · bodyguard: the Toll, Stranglehold, Blood Pact (the net) |
| Paladin | judge: the Hunt, Stranglehold · healer: Blood Pact · champion of the line: the Toll, Bonfire |
| Valkyrie | storm spear: the Hunt · shield-sister: Blood Pact, the Toll · thunderhead: the Storm · her Shield from hits: Thousand Cuts |
| Bard | conductor: Barrage, Landslide · troubadour: Blood Pact · skald: Thousand Cuts |
| Hexer | spellbreaker and curser: Stranglehold, the Toll · elemental blade: Bonfire, Cold Snap, the Storm |
| Monk | blur: Thousand Cuts · dancer: the Toll · point-striker: the Hunt, Cold Snap, Stranglehold · its burning fists: Bonfire |
| Assassin | ambusher: the Hunt · hunter: the Hunt, Thousand Cuts (the wounder) · drinker: Blood Pact, Stranglehold |
| Vampire | drinker: Blood Pact · blood-well: Barrage, Stranglehold · frenzy: Thousand Cuts |
| Pyromancer | ritualist: Bonfire, Barrage (the soloist) · kindler: Thousand Cuts, Bonfire · conflagration: Bonfire's pack game |
| Frostweaver | ice wall: Cold Snap, Barrage (the well) · disabler: Stranglehold · shatter killer: Cold Snap |
| Stormcaller | tempest: the Storm, Barrage · storm fist: Thousand Cuts, the Hunt · lightning rod: the Toll, the Storm |
| Geomancer | landslide: Landslide · quake: Cold Snap (the breaker), Stranglehold · stone warden: Landslide, Blood Pact (the net) |

Two things for the upgrades pass to know:
- **The Hexer's spellbreaker and curser now serve one build,** and so do most of the versions that wait for a wind-up. The class frame wants each identity viable and distinct, so those two need pulling apart when the versions are redesigned.
- **The Assassin's ambusher and hunter both serve the Hunt:** the first move and the chain. The hunter also opens the wounds for Thousand Cuts.

## Checks on the whole set

- **The rhythms spread across the space.** Rare and huge (Landslide), a dense even stream (Thousand Cuts), rising (Bonfire), bursts on a beat (Cold Snap), a spike and then a staircase (the Hunt), in squalls following the foes (the Storm), following the foes' attacks (the Toll), low and level (Stranglehold), in salvos from one unit (Barrage), see-sawing (Blood Pact).
- **Every build's sign is in a base kit.** At least one class shows each build's direction with a passive or one ability, before any piece, and most builds have two or three: that's the content letting a player see where to push. It's a check on this set, not a rule for what a build is: a sign can as well come from a piece or a formation.
- **Every build has a route with a starter** (the Knight, Cleric or Ranger), since a first run leads with one.
- **Every class is in three builds or more** (the Cleric, Pyromancer and Frostweaver in three), and every identity serves at least one.
- **Half the set has no status at its centre** (Landslide, the Hunt, Stranglehold, Barrage, Blood Pact), and the five that do each weave it with threads that aren't it. A status the party stacks read as a build in play; it isn't what a build has to be.
- **Builds that share a mechanic feel nothing alike.**
  - Statuses on swings: fire that climbs, frost that bursts, sparks that follow the foe, wounds cashed by the next hit.
  - Being hit: the Toll's return, Blood Pact's brink.
  - Big numbers: Landslide's loaded blow, the Hunt's chosen strike, Barrage's repeated spell.
  - Foes that do less: Cold Snap's slow, Stranglehold's row.
- **Every build has a pack game and a boss game,** and says which is worse.

**Set aside:**
- **Phoenix:** a build on falls. Nobody chooses who falls; revives are the net.
- **Ambush alone:** an opening with no tail. On the test parties it has the most distinct rhythm of the twelve, which is why it's kept as the Hunt's opening and not dropped.
- **Harvest alone:** spread as a build. It's each build's pack game.
- **Lockdown:** waiting for the foe's wind-up. Stopping a cast is an answer, not a build.
- **Overflow's relay:** mana passed round three casters. Its links can't be made big enough to see without being a build's whole power.
- **The dance:** a whole party on Evasion. It's the Toll's other anchor and a thread of Thousand Cuts. It becomes a build if Evasion at reachable levels becomes a defence; that's the first I'd grow.
- **The chorus:** the party's own buffs as the thing stacked, the mirror of Stranglehold. The second I'd grow, and the Bard's natural home; today a buff helps every build about equally, which is what a piece shouldn't do.
- **Radiance:** healing stored and released as one blow. Its rhythm is Landslide's, and a heal given as a trigger is Blood Pact's.
- **The gambler:** crits on everything. The Hunt's and Landslide's crits cover it, and it may come back as exotics.

## If it's approved

- **The four changes** go in first, each measured against today's game, with both versions' numbers at the build gate.
- **The spine** is written from these ten: one line for every rare, legendary, formation, upgrade and mythic, all together, with the doors' pieces named.
- **The documents** change when the step closes: this replaces `docs/gear-design/builds.md`; `docs/rules.md` stops saying the twelve stand; the primer's list, the mythics' table in `docs/gear-design/loot.md` and the test parties in `tools/build-parties.ts` follow.
