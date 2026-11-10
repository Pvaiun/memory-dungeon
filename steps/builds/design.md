# Builds: the design

The builds pass's design: the set of builds the loot, formations and upgrades will be redesigned from, written the way `docs/gear-design/philosophy.md`'s method writes a builds stage. Each build is a way to play, with its rhythm, threads, routes, rungs and needs, and the web between them. No pieces, no numbers. The intent is `intent.md`; what the old twelve did in real play is `state-of-play.md`. Once approved, this replaces `docs/gear-design/builds.md`.

## At the gate

**Decisions for you.**

1. **Nine builds, not twelve.** Seven of the old twelve go on, each rebuilt around what the fights showed: Bonfire, Cold Snap, Harvest, the Hunt, the Toll, Landslide and Blood Pact. Two are new: the Champion and the Curse. Five are set aside, with their threads moved into the nine: Thousand Cuts, Overflow, Lockdown, Ambush and Phoenix. In play, three of the old twelve happened (Bonfire, the Toll, and the Hunt as a crit-and-Bleed set) and nine didn't. I'd rather have nine that each have a mechanism that can work on screen than twelve for the count. If you want more, Ambush and Phoenix are the two I'd rebuild; each has a paragraph under Set aside saying what it would take.

2. **Who tanks.** You asked whether every build might need a tank. My answer is yes at the start, and that's fine: act I puts a wall in nearly every party. What a build owns is the cover that takes over as it grows. There are six covers (the wall, the line, the hold, the race, the drink and the escort), and by rung 3 six of the nine builds stand without a wall.
   - **The real problem:** today only the wall holds. Squishies die in three or four hits, heals land a few times a fight, Evasion is a chance nobody trusts, and Stuns on foes come once or twice a fight.
   - **If it isn't fixed:** every party stays a wall and two, the Toll stays every run's default, and six of these builds are wall builds in disguise.
   - **So:** your intent says the game changes, not the builds. I'd make the other five covers holding up in act II the balance pass's first job.

3. **Three kit changes.** Each is a change of behaviour, so each is yours to rule on.
   - **Marked steers the party's random picks,** its abilities' as well as its basic attacks. Without this the Hunt's focus never shows.
   - **Shatterpoint chains:** when a foe shatters, every other foe gains a few Chill, and the Sunder moves to a version. Without this Cold Snap's second shatter never comes.
   - **Malison deals damage for each kind of debuff a foe holds,** as well as deepening them. The Curse's turn needs a number of its own, and the Hexer was the class nobody could see.

4. **Two rules the set is written by.** They bind the loot pass, so they're yours to approve (both under How the set is made):
   - **A rhythm shows only through a ledger.**
   - **Rung 1 is one unit.**

**Challenges to the documents.**
- **The loot's uncommons** are "a small, general effect", a build's first rung. In play, small triggers never registered. Under this design a first-rung piece is what shows the player the direction, so it has to be big enough to see on its own. The loot pass should size uncommons to be seen.
- **Formations.** `loot.md` says every build is helped by four formations and needs none. This design keeps that, and asks for more: each build gets one formation that can carry its second rung on its own. That's what would make a formation worth a pivot, as your intent asks, but it means a build's own formation is far stronger for it than any other.
- **Kits arriving one ability at a time, and cooldowns carrying,** aren't judged here, as your intent says. The set is written so its ledgers fill without waiting on a cooldown, so it doesn't depend on how that's decided.

**Next, at your word:** the spine (one line for every rare, legendary, formation, upgrade and mythic, built backwards from these nine). With it, each class's three identities in `classes.md` move onto these builds.

## How the set is made

What a build is hasn't changed (`philosophy.md`). These rules say how this set makes a build show on screen, survive, and get found. Each comes from what the fights showed.

1. **A rhythm shows only through a ledger.** Every build has one thing on screen that fills over a fight, and one moment when it pays: its turn. The ledger can be a status on a foe, a bar, a mark, a row of icons or one unit's buffs. Someone watching follows the ledger and waits for the turn, and that's how they tell which build is playing and what it's waiting for.
   - **Why:** the old set's rhythms (the pass, the beat, the volley, the window) were in the design but never on screen, because nothing carried them. Burn, Bleed and Thorns read at once, because each is a number that grows.
   - **What it doesn't mean:** "a status the whole party stacks". Three of the nine ledgers are that. The other six are a mark, a reaction, a bar, one unit's glow, the HP bars and a row of debuffs.

2. **Rung 1 is one unit, rung 2 brings in the party, rung 3 makes the turn the fight.**
   - **Rung 1** comes from one unit's passive or swings, plus at most one piece or seat. That's what act I supplies: a piece a unit, Neutral, and one known ability. Rung 1 shows the ledger, and the ledger points the way to push.
   - **Rung 2** brings in the other two units, usually through a formation or a version. This is when the turn shows.
   - **Rung 3** makes the turn come often or land big.
   - **Why:** in the sample, everything that happened in act I happened on one unit. Everything that needed two or three pieces to meet on one unit was still waiting when the run ended.

3. **Every link pays alone.** No piece, seat or version is worth nothing until another arrives, so each step along the way is worth taking.

4. **The ledger fills without waiting on a cooldown.** Swings, hits, hits taken, kills and passives fill it, and abilities are its turns.
   - **Why:** the two chains that closed in the sample rode swings and a reset. Every chain that waited on a cooldown stalled.

5. **A build waits only for what every fight supplies, or what the party makes itself:** hits, kills, time, its own statuses climbing, its own HP falling. It never waits for a foe's wind-up, Silence or Stun, which most fights don't have.

6. **Every build owns its cover, and its formation carries it** (the next two sections).

## Covers: how each build survives

Survivability was the scarce thing in every saved run. A wall was mandatory and a healer wasn't. The first unit to fall was nearly always the one drawing the hits, and then the other two collapsed. The intent makes survivability a constraint on every build, so each build names its cover: how it keeps the party standing, where its danger is, and what breaks it.

| Cover | How it survives | Its builds | What breaks it |
| --- | --- | --- | --- |
| **The wall** | One unit draws nearly every pick and is built to take them. | the Toll (the anchor is the build), Bonfire (the keeper stokes), Harvest (the rod sends Shock back) | The wall falling: the two behind it have no cover. |
| **The line** | Nobody draws more than the rest; every unit is armoured and shielded. | Landslide | A big Area blow that breaks every Shield at once. |
| **The hold** | Foes are kept from hitting: slowed, stunned, weakened, silenced. | Cold Snap (Chill), the Curse (Weaken) | Bosses resisting control, a cleanse, a fresh foe. |
| **The race** | The dangerous foes die before their damage adds up. | the Hunt | A foe that won't die fast. |
| **The drink** | Damage taken is drunk back within the fight. | Blood Pact | Foes it can't drink from; a burst while it's low. |
| **The escort** | Everything protects the one unit that matters, and someone else draws. | the Champion | Anything that reaches the champion. |

**The cover's arc.** In act I every build stands behind a wall, by design: the starters and the draft put a wall in nearly every party, and a build's first rung costs the party nothing it needs to survive. As the build grows, its own cover takes over. The wall either joins the build (Bonfire's keeper stokes, Harvest's rod sends Shock back) or gives up its seat. By rung 3, three builds keep a wall as part of what they are, and six stand without one.

**Each build plans its cliff.** Where the cover is one unit (the wall, the escort), losing that unit loses the fight. Those builds value their cover's sustain over their own damage at rung 1, and put a relief in rung 2: someone who takes up the draw when the anchor falls, or an anchor that stands again after a won fight.

## Formations: worth a pivot

The intent asks that a good formation be worth reshaping a party for. In the sample only one formation made three units work together: Hearth, whose three seats all served one fire, with one of them holding the door. Formations about the front line were used for their front, and formations that were engines were refused. So in this set:
- **Each build has a formation about it:** three seats that serve its ledger, one of which carries its cover.
- **That formation can carry the build's second rung on its own.** A party sat in it plays the turn with none of the build's pieces. That's what makes it worth a pivot, and it's a door into the build for a party one member or one piece away.
- **Its seats read what a unit does** (its swings, its casts, the hits it takes), never which class it is. Any party can sit in it, and the build's own party sits in it best.
- **It helps at every rung,** so it works however it arrives in a run.

Seat roles that several builds share (under The web) are how one formation serves more than one build.

## The nine

| Build | Damage over a fight | Danger | Turns | What it spends |
| --- | --- | --- | --- | --- |
| **Bonfire** | rises all fight; each kill comes sooner than the last | early, until the fire catches | one slow (the catch), then each leap | MP on the casts; little on the riders |
| **Cold Snap** | bursts on a beat you can count | falls with each burst | many, medium | both, evenly |
| **Harvest** | nothing, then everything | full until the end, thinning as the Shock bites | one, huge, late | MP on the spread |
| **The Hunt** | a spike at the first tick, then a staircase | early, falling with each kill | regular, medium: each kill | HP: light bodies running the race |
| **The Toll** | follows how much the foes attack | all on the anchor | few | HP: the anchor's |
| **Landslide** | a few huge blows at uneven moments | low and steady, spread over three bodies | few, big | MP on the stone |
| **The Champion** | in one unit's bursts | on the champion, if it's reached | each of its big casts | MP: the servants pour theirs in |
| **Blood Pact** | high and steady | swings and rights itself | many, medium | HP, in place of MP |
| **The Curse** | climbs in steps | falls as the foes weaken | regular: each curse | MP on the curses |

**How a run finds each one.** The rungs under each build give the detail.

| Build | What act I shows | The turn appears (act II) | The far end (act III) |
| --- | --- | --- | --- |
| **Bonfire** | one foe's Burn climbing | the fire leaping from a dying foe | fire that leaps whole, cashed in |
| **Cold Snap** | a shatter, and a pack slowing | shatters every few ticks, a breaker waiting | strings of shatters through a pack |
| **Harvest** | two numbers on every swing; Shock on several foes | every HP bar sinking in step | the field erased in a beat; a boss takes every jump |
| **The Hunt** | the back row dying first; Bleed bursting on each hit | the Mark, and every kill speeding the next | the whole party on one foe; the first kill at the first tick |
| **The Toll** | attackers hurt by the wall | swarms die on the wall; two-foe elites stop being the end | a boss's slow blows feed it |
| **Landslide** | a defensive piece making the blow bigger | the break as a blow; elites losing chunks | a boss fight of a handful of blows |
| **The Champion** | one unit doing most of the damage | its casts landing twice | its biggest ability doubled and ready again |
| **Blood Pact** | green numbers on every hit; HP carrying better | HP paid for power; payoffs below half | life as the party's only currency |
| **The Curse** | foes wearing several debuffs; the judge's hits jumping | the curse turning every one up at once | every kind adding to every hit |

## What became of the twelve

| Old build | In this set |
| --- | --- |
| Bonfire | Goes on. The leap is now its core and has to show on screen. |
| Cold Snap | Goes on, rebuilt: the chain and the riders bring the second shatter, and Lockdown's payoff becomes its breaker. |
| Harvest | Goes on, rebuilt around a Shock ledger, with a boss answer. |
| The Hunt | Goes on, merged with the crit-and-Bleed set the player found; Marked made to matter. |
| The Toll | Goes on, with a relief for its cliff and a boss answer at its far end. |
| Landslide | Goes on, rebuilt: the armour becomes the blow, and the line is its cover. |
| Blood Pact | Goes on: the drink first, then the cost; Phoenix's low-HP threads join it. |
| Thousand Cuts | Set aside. Its blur is a route for Cold Snap and the Hunt. |
| Overflow | Set aside. Its mana goes into the Champion. |
| Lockdown | Set aside. Its window is Cold Snap's shatter; its Weaken and Silence go to the Curse. |
| Ambush | Set aside. Its opening is a thread any build can take. |
| Phoenix | Set aside. Its low HP goes to Blood Pact, and a fall that doesn't carry goes to the walls. |
| (new) | The Champion: two units pour everything into one. |
| (new) | The Curse: many kinds of debuff at once, deepened. |

## Bonfire

**Identity.** One foe burns brighter than the rest. Its Burn number climbs every pulse, fed by every cast and, further in, every swing. When it falls, its fire leaps whole to the next foe, which starts already burning, so each kill comes sooner than the last. Early on the foes press at full strength while the keeper holds; by the end they drop one after another, faster and faster. It's waiting for the fire to catch, and then for each leap.

- **On screen:** the Burn on the hottest foe is the ledger. The turn is the leap: a line in the log, and the next foe's number jumping.
- **Loves:** long fights, packs (each death feeds the next), bosses with helpers (the helpers' fire ends on the boss).
- **Fears:** fights too short for the fire to catch, foes that cleanse, losing the keeper before the catch.
- **Bosses:** a lone boss gets no leap, but it gets the whole fire, and a long fight is where Burn is at its best.
- **Threads:**
  - Burn on the hottest foe: casts and swings aimed at the foe with the most Burn;
  - the leap: fire that passes from a dying foe to the next;
  - riders: swings that add Burn, for classes with no fire of their own;
  - upkeep: Burn drains away, so the build lives on tempo (Haste and swing speed on the stokers);
  - the cash-in: a blow that reads the stacks and leaves them (Pyre);
  - a keeper who holds the early fight and feeds the fire too.
- **Cover: the wall, then a fire that thins the field.**
  - **The danger** is all early, before the catch, so the build needs a keeper.
  - **The keeper isn't a tax:** a wall with a Burn rider stokes like anyone else.
  - **Once the fire catches,** the field thins faster than it can hurt.
  - **If the keeper falls before the catch,** the fight is lost, so at rung 1 a run should value the keeper's sustain over its own fire.
- **Routes:** Pyromancer, Paladin, Knight · no mage: Monk, Hexer, Paladin · Pyromancer, Hexer, Bramble knight.
- **Rungs, and when a run finds them:**
  1. **Any Burn source,** from floor one: the Pyromancer, the Paladin's Smite, the Monk's Burning fist, or a rider piece on anyone. One foe's number climbs over a fight, and that climbing number is the signpost. It costs the party nothing.
  2. **A second feeder and the leap,** in act II: a rider on another unit, a formation about the fire, or a version that passes it on. Kills come sooner each time, and the rhythm shows.
  3. **Fire that leaps whole, and a cash-in that reads it.** The catch comes early, and the last foes fall in a rush.
- **Needs:**
  - **Pieces:** Burn riders for classes without fire; the leap; a choice between fire that drains slower and fire that's cashed in.
  - **Formation:** a keeper, a stoker that acts often, and a torch whose fire leaps when its foe falls. The torch alone carries the leap.
  - **Upgrades:** versions that aim at the hottest foe, put fire on swings, or make the leap.
- **Kit changes:** none. The leap goes in a version, in pieces and in a seat, not in Burn itself. Enemies use Burn too (the Hellhounds), and a rule that passed Burn on a fall would pass it across the party when a member fell.

## Cold Snap

**Identity.** Frost creeps up every foe, and the foes visibly slow. One reaches its cap and SHATTERS: a burst, and a Stun. The shatter throws frost onto the foes beside it, so the next one is nearer, and the shatters come like a string of firecrackers. Then they come round again as the party's swings refill the stacks. Between bursts the damage is modest, and the party's heaviest hitter waits for a frozen foe to break. The danger falls through the fight, since every burst stuns and every stack slows. It's waiting for the next foe to reach its cap.

- **On screen:** the Chill counters climbing to their cap are the ledger; the shatter is the turn.
- **Loves:** packs and elites; fast foes, which the slow hurts most.
- **Fears:** fights too short to reach the cap; foes that arrive fresh and unchilled (summons, a split slime).
- **Bosses:** the shatter's Stun is resisted and then blanked, so against a boss the hold is the slow alone, and the shatters are damage on a beat. There it wants a wall beside it.
- **Threads:**
  - Chill to its cap and the shatter (anyone's Chill pays);
  - many small applications: Chill on swings, fast weapons, multi-hits, Haste;
  - the chain: a shatter that throws Chill onto the others;
  - the hold: slowed foes act less, and stunned ones not at all;
  - the breaker: a heavy hit saved for the shattered, stunned foe;
  - the shattered foe left open for the party (Sunder).
- **Cover: the hold.**
  - **Chill is its cover:** the foes' tempo falls as the counters climb, and each shatter takes one of them out for a moment.
  - **Before the Chill builds,** it needs a light front. The Frostweaver's own body and Frost armor's Guard can be that front.
  - **What breaks it:** a foe that arrives fresh and hits at full speed.
- **Routes:** Frostweaver, Hexer, Monk (the blur carrying frost) · Frostweaver, Bard, Ranger · no Frostweaver: Hexer, Ranger, Geomancer (the breaker).
- **Rungs, and when a run finds them:**
  1. **Any Chill source,** from floor one: the Hexer's Cold hex, the Ranger's Frost arrow, or the Frostweaver. A shatter or two a fight, and a pack that slows. The shatter is the signpost.
  2. **Chill on two units' swings, and a breaker.** Shatters come every few ticks across a pack, and the field is slowed. Act I can reach the first half with one rider piece beside the Hexer; act II adds the breaker's seat.
  3. **The chain, and frost on every hit.** Packs freeze and burst in strings, and a boss shatters on a beat it can't escape.
- **Needs:**
  - **Pieces:** Chill riders for fast classes; payoffs for hitting a stunned foe; something for the unchilled newcomer.
  - **Formation:** two frost seats whose swings chill, one of them chunky enough to hold, and a breaker whose next hit after a shatter lands far bigger. The frost seats alone make any party shatter.
  - **Upgrades:** versions that aim at the foe nearest its cap, spread the cold, or put it on swings.
- **Kit change: the chain goes in the Frostweaver's passive.** Shatterpoint becomes: when a foe's Chill shatters, every other foe gains a few Chill, with stacks that scale from Attack. The Sunder on the shattered foe moves to a version.
  - **Why:** today the cap spends the stacks and the next application is a cooldown away, so the second shatter never comes.
  - **It keeps the rule:** nothing triggers a shatter, and each foe still shatters on its own Chill.
  - **And it gives the weakest class** the build's signature from rung 1.

## Harvest

**Identity.** Every hit lands on more than one foe. Shock crackles across the whole field, and every foe pays each time it acts, the fast ones most. Nobody dies for a long time, and all the HP bars sink in step. Then, in a few ticks, the field empties: the blow that cashes the Shock lands everywhere at once. It's waiting for the sweep.

- **On screen:** the Shock on every foe, and the HP bars level with each other, are the ledger. The turn is the field emptying at once.
- **Loves:** swarms and summons; Ghouls, which can't raise each other if they fall together; fast foes, which pay Shock with every bite.
- **Fears:** Bomb Bugs (every blast at once), Lava Slimes (an even field splits every one), a few slow, heavy hitters.
- **Bosses:** most act bosses stand alone, where spread has no second foe and a slow boss barely sets off Shock. Its answer is the fold (below) and a cash-in on the boss's Shock. Until rung 3 it leans on the rest of its party at a boss.
- **Threads:**
  - spread: hits that jump to a second foe or to every foe (Arc, Chain lightning, Area);
  - Shock on every foe;
  - evening out: aiming at the healthiest foe, so the field sinks together;
  - the cash-in on every shocked foe at once (Thunderclap);
  - a finisher for every foe below a line;
  - the rod: one unit takes the field's attention, and its attackers carry Shock away;
  - the fold: spread that lands on the one foe there is when no other stands.
- **Cover: the wall, and a field that pays to attack.**
  - **The danger is full:** every foe stays alive and acting until the end, so the build needs a rod that draws.
  - **The Shock is a cover too:** each foe pays every time it acts, so a swarm's pressure thins as the storm builds.
  - **What breaks it:** big, slow hitters, which barely act and so barely pay.
- **Routes:** Stormcaller, Valkyrie, Bramble knight (the rod) · Pyromancer (Fireball), Frostweaver (Blizzard), Knight · no mage: Valkyrie, Hoplite (Othismos, Skewer), Knight.
- **Rungs, and when a run finds them:**
  1. **Any unit whose hits reach more than one foe,** from floor one: the Stormcaller's Arc, the Valkyrie's Gale spear, the Pyromancer's Fireball, or a sweep piece. Swarms fall faster, and Shock shows on several foes at once. Two numbers on every Stormcaller swing are the signpost.
  2. **Spread on a second unit, the evening out, and Shock on the party's swings,** in act II. The field sinks together.
  3. **The cash-in and the fold.** Swarms are erased in a beat, and a lone boss takes every jump.
- **Needs:**
  - **Pieces:** spread for units that aren't mages; aiming at the healthiest foe; a finisher; the fold; a payoff that grows with how many foes one action hit.
  - **Formation:** a rod whose attackers carry Shock away, and two scythes whose hits spread. The scythes alone level the field.
  - **Upgrades:** versions that even the field rather than pile on one foe.
- **Kit changes:** none. The fold belongs in pieces and versions, not in Arc. The Stormcaller's weakness against a lone foe is its kit's designed weak spot, and the build should pay to remove it.

## The Hunt

**Identity.** The pack singles one out. A Mark shows on a foe, often one at the back, and every hit in the party goes there. The opener strikes first, often from hiding: a crit that opens a deep wound. The others' hits tear it, each one bursting the Bleed. The foe falls, the hunter's blade is ready again, and the Mark moves on. The foes drop one by one on a steady beat, the dangerous back row first. It's waiting for the next kill.

- **On screen:** the Mark and the Bleed on the hunted foe are the ledger. The turn is the kill, and the Mark moving on.
- **Loves:** mixed groups with a dangerous back row (Archers, Liches, Bone Priests, Witches).
- **Fears:** Ghouls raised behind the hunt, Taunting fronts if it has no reach, cleansers that wash out the Bleed.
- **Bosses:** a lone boss is one step, not a staircase. Its answers are the Bleed that every hit bursts, and damage that grows as the foe's HP falls.
- **Threads:**
  - focus: the party's picks agreeing on the Marked foe;
  - the wound: crits that lay Bleed, and barbed arrows;
  - the tearing: many hits on the wounded foe (fast weapons, Double strike, multi-hits);
  - reach: Seek past a Taunting front;
  - the weakest and the back row: aiming at the lowest HP;
  - a reward on each kill, so each step speeds the next (the reset);
  - the opener: Hidden at the start, and a first hit that always crits;
  - damage that grows as a foe's HP falls.
- **Cover: the race.**
  - **The danger** is early, in the back row's first actions, and falls with each kill. The Hunt survives by killing first.
  - **Its hunters are light,** so the opener hides and the rest draw little.
  - **At rung 1** it needs a front for the first ticks. By rung 3 the back row dies before it acts, and a front is a choice.
  - **What breaks it:** a foe that won't die fast, so the race turns into a long fight its light bodies can't stand.
- **Routes:** Assassin, Ranger, Paladin (Condemn marks; Judgement on the bleeding) · Assassin, Monk, Valkyrie (Seek blades) · Ranger, Bramble knight, Vampire (the wall's Briar wounds every attacker, and the hunters tear).
- **Rungs, and when a run finds them:**
  1. **One hunter,** from floor one: the Ranger's swings past Taunt, the Assassin's crits that bleed and its Backstab on the lowest, or the Valkyrie's spear past any guard. The back row dies first, and red Bleed numbers burst on every hit.
  2. **The Mark, and a second unit that tears,** from act I's end into act II: a marker seat, Condemn, or a version that resets on a kill. The party's picks agree, and each kill pays.
  3. **The whole party on one foe, and a kill that resets the hunt.** Mixed groups fall in a drumbeat, the first at the first tick.
- **Needs:**
  - **Pieces:** a Mark for more classes; Seek on gear; kill rewards that speed the next kill; crits that wound; damage that grows as a foe weakens.
  - **Formation:** a marker whose pick the others follow, a chaser with reach, and a warden for the first ticks. The marker alone points the party.
  - **Upgrades:** versions that change what an ability aims at, or reset it on a kill.
- **Kit change: Marked steers every random pick the party makes.**
  - **Today** Marked steers basic attacks only, and abilities keep their own targets, so the party's picks never agree and nobody sees a marker. It was on the field in about twenty fights and never mattered.
  - **Changed,** a Marked foe takes the party's basic attacks and every ability aimed at "a random foe", inside the Taunt rule as now. Abilities with a phrase of their own (the lowest HP, the most Burn) keep it. The log says when the party turns.
  - **It's a vocabulary change,** so it reaches the Paladin's Condemn too, which is what Condemn was for.

## The Toll

**Identity.** They hurt themselves. Foes crowd onto one unit, and every blow it takes comes back: Thorns flash on the attacker, a wound opens, it sparks the next time it moves. The swarm that rushes the wall dies against it, and the rest of the party, barely touched, finishes what the wall starts. It's waiting to be hit.

- **On screen:** the Thorns numbers on the attackers, and what they carry away, are the ledger. The turn is attackers dropping on the wall.
- **Loves:** Wolves, Hellhounds, Wisps, summoned waves.
- **Fears:** Area attacks, which ignore the draw; foes that don't hit (Bone Priests, Witches).
- **Bosses:** slow single hitters (the Ogre Chief, the Fire Giant) and two-foe elites are where every Toll run ended. Its far end has to answer them: a reply sized to the blow, not only to the number of blows.
- **Threads:**
  - the draw: Taunt and Aggro;
  - retaliation: being hit strikes back (Thorns);
  - what attackers carry away: Bleed, Chill, Shock;
  - Weaken on the attackers: blows land as often but hurt less;
  - Guard and Defense against many small hits, and healing on the anchor;
  - a reply sized to the blow;
  - the dancer: an anchor that dodges and answers.
- **Cover: the wall, which is the build.**
  - **The danger** is all on the anchor, and the anchor's sustain is the build's survival: Guard, Regen, heals aimed at it, Weaken on whoever hits it.
  - **Its cliff is the sharpest in the set:** when the anchor falls, the other two have nothing between them and the foes. So the Toll's second rung includes a relief: someone who takes up the draw when the anchor falls, or an anchor that stands again after a won fight.
- **Routes:** Bramble knight, Cleric, Stormcaller (its attackers gain Shock) · Knight (Hold the line), Hexer (Weaken), Hoplite · the dancer: Monk (Stillness of mind), Bard, Valkyrie.
- **Rungs, and when a run finds them:**
  1. **Any wall with Thorns,** online on floor one: the Bramble knight's Thicket and Briar, the Knight's Hold the line, or a Thorns piece on any unit that Taunts. Swarms hurt themselves. It's the first build of most runs, by design.
  2. **What attackers carry away, Weaken on them, and the relief,** in act II. Swarms die on the wall, and two-foe elites stop being the end.
  3. **Thorns that grow with the beating, and a reply sized to the blow.** A wall that even a boss's slow blows feed.
- **Needs:**
  - **Pieces:** Taunt and Thorns for more anchors; retaliation on a dodge; Thorns that grow with each blow taken or from Defense; a reply sized to the blow; the relief.
  - **Formation:** an anchor that draws and returns, a warden that keeps it standing, and a free seat that finishes. The anchor's seat alone turns any wall into a Toll.
  - **Upgrades:** versions that change who the anchor is and what it returns.
- **Kit changes:** none.
- **Watch:** it's the first build online, which is fine as long as the other builds' first rungs show as early. The Toll being every run's default is the cover problem (decision 2), not the Toll's.

## Landslide

**Identity.** A party in stone. Every unit wears a Shield bar, and none of them is fragile. They swing rarely and hit like a falling hill, and the blow scales from the Defense and the stone they piled on to stay alive. Long stretches pass with small numbers while the stone holds. Then a slow swing or a long cast lands far bigger than anything else, and an elite loses a large share of its HP. When a Shield breaks, the stone flies: the break is a blow of its own. It's waiting for its next big blow.

- **On screen:** the Shield bars and the size of the blow are the ledger; the blow, and the break, are the turn.
- **Loves:** armored foes and Hit counters (big hits lose little to Defense and come rarely); Lava Slimes (one blow from above half to nothing).
- **Fears:** swarms (blows wasted, stone chipped by many small hits), dodgers (a missed blow is a long wait wasted), anything that strips Shields.
- **Bosses:** its best fight: a handful of blows the party lives through.
- **Threads:**
  - Defense as a damage stat;
  - the Shield as a second health bar, and its break as a blow;
  - max HP feeding the stone and the blow;
  - slow, heavy actions;
  - crits behind stone, and crit damage;
  - Might on the slowest hitter, who spends it slowest;
  - heavy blows that stagger;
  - Sunder: the stone falls on a cracked foe.
- **Cover: the line.**
  - **Nobody draws more than the rest, and nobody needs to:** every unit is armoured and shielded, so the danger is low and steady and spread over three bodies.
  - **It starts from what a player takes first, defence,** and turns it into damage, so the path never trades safety for the build.
  - **What breaks it:** a big Area blow that breaks every Shield at once, which is also when the breaks fly.
- **Routes:** Geomancer, Knight, Hoplite · Geomancer, Paladin (great weapon), Cleric · no earth: Knight (hammer), Hoplite, Bramble knight.
- **Rungs, and when a run finds them:**
  1. **A unit whose kit reads Defense or the Shield, and one defensive piece,** in act I: the Geomancer's rocks, the Knight's bash from max HP, or the Hoplite's Phalanx and shove. The piece makes the blow visibly bigger. That's the signpost: the defensive piece the player would take anyway, paying twice.
  2. **The break as a blow, a hammer that swings slower and bigger, and a mason who shields it,** in act II. Elites lose chunks, and bosses take three or four blows.
  3. **The stone becomes the weapon.** A boss fight is a handful of blows the party lives through comfortably.
- **Needs:**
  - **Pieces:** something that turns the Shield or its breaking into damage; Defense that reaches the units whose kit reads it; a way for any unit's swings to come slower and bigger; Might for one slow unit.
  - **Formation:** a hammer whose actions come rarely and land big, a mason who builds stone for it, and a third that shields itself. No seat draws. The hammer and mason alone make any armoured party hit like this.
  - **Upgrades:** versions that trade speed for size, or aim the blow (at the foe in a wind-up, the healthiest, the stunned).
- **Kit changes:** none.
- **Watch:** the quiet between blows may read as nothing happening, so the Shield bars have to be what you watch. And its first rung mustn't read as plain defence, as it did in the sample: the blow has to be on screen, growing with the Defense.

## The Champion

**Identity.** One unit glows. The other two hand it everything: Might, Haste, mana, a Shield, an Aegis. Their songs and prayers land on it, and when it casts, the cast lands twice. It hits like a boss, and the others barely deal damage at all. It's waiting for the champion's next big ability.

- **On screen:** the buffs piled on one unit, and its numbers, are the ledger. The turn is its big casts, doubled.
- **Loves:** elites and bosses: one big target for one big hitter.
- **Fears:** packs (one unit can't reach them all, unless its big ability is Area), anything that picks the champion out (Stalkers, Seek), and Dispel or Silence on it.
- **Bosses:** its best fight.
- **Threads:**
  - buffs aimed at one ally, the one with the highest Attack;
  - the echo: an ability cast twice, or ready again at once;
  - mana poured into it;
  - Might, which a slow champion keeps longest;
  - Haste on it;
  - protection on it: Aegis, Shield, Guard, Hidden, and the draw kept off it;
  - the champion's own big ability.
- **Cover: the escort.**
  - **The danger is on the champion** if it's picked. One servant draws and the other shields it, so the champion is the last unit the foes can reach.
  - **Its cliff is sharp:** if the champion falls, the party has no damage left. So the escort comes before the echo at every rung.
- **Routes:** Bard (Encore) and Knight (the draw, and Clarity) serving the Pyromancer · Hoplite (Aspis) and Cleric serving the Geomancer · Frostweaver (Stillness) and Vampire (Blood gift) serving the Assassin.
- **Rungs, and when a run finds them:**
  1. **One unit stronger than the rest, with the run's best pieces on it,** in act I. The fight's summary shows one unit dealing most of the damage, and the player feeds it the next piece. That summary is the signpost: the player's own instinct, taken all the way.
  2. **Servants whose buffs land on it, and a formation with a crown seat,** in act II. The champion casts often, and casts twice.
  3. **The echo and the refund:** its biggest ability doubled and ready again, and mana for every cast.
- **Needs:**
  - **Pieces:** effects that send a servant's buffs to the ally with the highest Attack; the echo for more classes; protection that goes to one ally; mana given to another.
  - **Formation:** a crown fed by the other two seats, one seat that draws and one that gives. The crown seat alone makes the strongest unit stronger for whatever the others do.
  - **Upgrades:** servants' versions that aim at one ally (the Bard's songs, Aspis, Renew, Stand fast), and champions' versions that make one ability the whole kit.
- **Kit changes:** none to the base kits. The Bard is this build's servant, and its versions should aim its songs at one ally. Today they spread a little over everyone, which is why the Bard read as a dead unit.
- **Watch:** the servants deal almost nothing, so what they give has to show as plainly as what they'd have dealt.

## Blood Pact

**Identity.** Life spent and bought back. The party's HP bars swing hard. A unit pays a chunk of its life for a big blow and drops below half, and then its drinking doubles: green numbers on every hit pull it back up. Heals pass from the reckless to the careful. The party fights low and ends full. It's waiting to be low enough for its payoffs.

- **On screen:** the HP bars, with the dip below half and the green drink, are the ledger. The turn is crossing below half, where the payoffs switch on.
- **Loves:** long fights against foes that hit and can be hit.
- **Fears:** Bats and dodgers (a dodged hit drinks nothing), Ghosts (a hit that's cut drinks less), Rot, and a burst that catches it low.
- **Bosses:** good: a long fight against one foe that's always there to drink from.
- **Threads:**
  - Lifesteal, and healing received;
  - HP as a cost: abilities and effects paid in HP, which buy more than the MP they replace;
  - below half as power (Bloodlust, Last rites);
  - a floor: a moment, once a fight, when it can't fall;
  - max HP as a damage stat;
  - life passed on: heals given, and heals that strike;
  - Regen, refilling what the pact costs;
  - drain: Weaken on its prey.
- **Cover: the drink.**
  - **Every unit heals by hitting,** so the HP it pays comes back within the fight, and the floor makes the dip safe.
  - **HP carries between fights,** so the build is made to end each fight full: the drink comes before the cost at every rung.
  - **What breaks it:** foes it can't drink from, and a big blow that lands while it's low.
- **Routes:** Vampire, Monk, Cleric · Vampire, Assassin, Bramble knight · no Vampire: Valkyrie (Shieldmaiden), Paladin (Penance), Cleric.
- **Rungs, and when a run finds them:**
  1. **The Vampire, the Assassin on an axe or a vial, or Lifesteal on any hitter,** in act I. The Valkyrie's Shieldmaiden, a Shield from every hit, is the drink's cousin. Green numbers on every hit, and HP that carries better between fights. A player takes it as sustain, and that's the point: it's the cover first.
  2. **Costs paid in HP, payoffs below half, and a donor,** in act II. Fights where the mana never runs out.
  3. **Life as the party's only currency.** It ends every fight topped up, having spent half its HP twice.
- **Needs:**
  - **Pieces:** effects paid in HP that plainly buy more than MP would; the floor; something that rewards a heal given; below-half payoffs that don't leave the unit low for the next fight; max-HP scalers.
  - **Formation:** a bleeder that pays HP for power, a drinker that feeds on hits, and a donor that passes life on. The drinker's seat alone gives any hitter the cover.
  - **Upgrades:** versions that pay or pass life.
- **Kit changes:** none.
- **Watch:** no player in the sample ever paid HP. An HP cost has to read as plainly better than the MP it replaces, and the floor has to be in sight wherever the cost is.

## The Curse

**Identity.** Foes wear a row of marks: Burn, Chill, Bleed, Sunder, Weaken, Shock, more kinds at once than any other build lays. Every so often the curse lands, and every mark on every foe grows at once, while the judge's hits land hardest on the foes wearing the most. The foes die slowly and hit softly. It's waiting for the next curse.

- **On screen:** the row of debuffs on each foe is the ledger; the curse, every icon ticking up at once, is the turn.
- **Loves:** elites and bosses (time for the row to fill); Healers and Regenerators (Bleed and Burn outpace the mend).
- **Fears:** Purifiers and anything that cleanses; short fights; swarms (too many foes to mark).
- **Bosses:** its best fight, with time for every kind to land, and Weaken softening a boss's big blow.
- **Threads:**
  - many kinds of debuff, each from its own source;
  - deepening: a stack more of every debuff a foe already holds;
  - payoffs that count kinds: the more kinds a foe holds, the more it takes;
  - Weaken and the slow of Chill, debuffs that are also its cover;
  - Silence on the casters;
  - spreading debuffs to every foe (Plague).
- **Cover: the hold, by Weaken.**
  - **The more a foe is cursed, the softer it hits:** Weaken, Chill's slow and Silence on the casters are marks in the row, so the danger falls through the fight.
  - **Early, before the row fills,** it needs a light front.
  - **What breaks it:** a cleanse that wipes the row.
- **Routes:** Hexer, Ranger, Paladin · Hexer, Stormcaller, Monk (Shock, Sunder, Chill and Bleed from four kits) · no Hexer: Ranger, Paladin, Vampire (Weaken).
- **Rungs, and when a run finds them:**
  1. **A unit that lays two kinds, or a judge,** from floor one: the Ranger's three arrows, the Hexer's Cold hex and Enfeeble, or the Paladin's Judgement on any foe with a debuff. Foes wear several icons, and the judge's numbers jump on them.
  2. **A new kind on a second unit, and the deepening,** in act II. The row fills, and the curse becomes the fight's turn.
  3. **Every kind deepened, and each kind adding to every hit.**
- **Needs:**
  - **Pieces:** debuffs of a kind the wearer's class doesn't lay; payoffs that count kinds; an answer to cleansing.
  - **Formation:** seats that each lay a different kind, one of them chunky enough to hold, and a third whose hits read the row. The kind-laying seats alone give any party a row.
  - **Upgrades:** versions that add a kind, or count them.
- **Kit change: Malison deals damage to each foe for each kind of debuff it holds,** as well as deepening them.
  - **Today** the Hexer is the status amplifier nobody can see. Its damage is everyone else's statuses, it had the lowest damage share of any class, and it was benched or fell in more than a third of its fights.
  - **With the change,** the curse has its own number, and that number rises with the row.
- **Watch:** I'm least sure of this build. Its ledger is a count of kinds, which no screen shows today, so the interface has to show the row as the thing that grows (work for the build stage).

## The web

The builds share threads, so a piece made on a thread reaches every build in its row, by different amounts and for different reasons. That's how a run drifts from one build to another.

### Threads the builds share

| Thread | Matters most to | Matters some to |
| --- | --- | --- |
| Riders: a status on every swing | Bonfire, Cold Snap | Harvest (Shock), the Hunt (Bleed), the Curse (any kind) |
| Many hits | Cold Snap (Chill), the Hunt (bursting Bleed) | Harvest, Blood Pact (many drinks) |
| The draw (Taunt, Aggro) | the Toll | Bonfire (the keeper), Harvest (the rod), the Champion (kept off it) |
| Defense and Shield | Landslide | the Toll, the Champion (on the champion) |
| Might | the Champion | Landslide (the slow hitter), Blood Pact |
| Haste and swing speed | Cold Snap | Bonfire (upkeep), the Hunt, the Champion |
| Crits | the Hunt (crits that wound) | Landslide (behind stone), the Champion |
| Stun | Cold Snap (the shatter) | Landslide (the stagger) |
| Weaken | the Curse | the Toll, Blood Pact |
| Silence | the Curse | the Hunt (the back row's casters) |
| Kills as triggers | the Hunt (the reset), Bonfire (the leap) | Harvest (the finisher) |
| Focus and targeting | the Hunt (the Mark) | Bonfire (the hottest), Harvest (the healthiest), the Champion (one ally) |
| Spread | Harvest | Cold Snap (the chain), the Curse (Plague), Bonfire (Fireball) |
| Bleed | the Hunt | the Toll (Briar), the Curse |
| Burn | Bonfire | the Curse |
| Chill | Cold Snap | the Curse, the Toll (the attacker slowed) |
| Shock | Harvest | the Toll (the rod), the Curse |
| Sunder | Landslide (the cracked foe) | the Hunt, the Curse, Cold Snap |
| Lifesteal and heals | Blood Pact | the Toll (the anchor), the Hunt (light drinkers) |
| HP spent, low HP | Blood Pact | Landslide (max HP into the blow) |
| MP given | the Champion | Blood Pact (HP in place of MP) |
| Seek and reach | the Hunt | the Curse (Silence on the casters behind) |
| The opening: Hidden, a first hit, a Shield, an ability ready at the first tick | the Hunt | Landslide (the first blow), Cold Snap (the first frost), the Champion (its first cast) |
| A fall that doesn't carry, and a relief | the Toll | the Champion, Bonfire's keeper, Harvest's rod |

### The doors

Where a run drifts from one build to another. Each door needs at least two pieces that matter to both sides (the spine's job).
- **Bonfire and the Curse, through the Hexer.** A fire party that takes a Hexer finds its Burn is one mark among several, and the curse deepens them all.
- **Cold Snap and Landslide, through the stunned foe.** The shatter's Stun is a heavy hitter's window. A Geomancer that waits for a stunned foe finds the frost making its windows.
- **Cold Snap and the Curse, through Chill and the hold.** Both slow the field. A frost party that picks up Weaken and Bleed finds the curse.
- **The Hunt and the Toll, through Bleed.** The anchor's Briar wounds every attacker, and a hunter's hits burst the wounds.
- **The Hunt and the Champion, through one hunter.** An Assassin with everything on it stops being a hunt and becomes a champion.
- **The Hunt and Blood Pact, through light drinkers.** Lifesteal on the fast hitters, and the wounds they open.
- **Harvest and the Toll, through the rod.** An anchor whose attackers carry Shock away is the Toll; the same anchor beside two scythes is Harvest.
- **Harvest and Bonfire, through fire on every foe.** Fireball fills the field; the leap concentrates it.
- **Landslide and the Toll, through Defense.** Thorns that grow from Defense turn the stone wall into a thorn wall.
- **Landslide and the Champion, through the slow hitter.** The mason's stone and the servants' Might, all on one hammer.
- **Blood Pact and the Toll, through low HP.** An anchor that lives below half, where the pact switches on, while its Thorns do the killing.
- **The Champion and Bonfire, through the Pyromancer.** A Pyre cast twice.

### Seat roles the builds share

| Seat role | Builds that use it (their name for the seat) |
| --- | --- |
| Draws the blows | the Toll (anchor), Bonfire (keeper), Harvest (rod), the Champion (shield-bearer), the Hunt (warden, early) |
| Its swings carry a status | Bonfire (stoker), Cold Snap (frost), Harvest (spark), the Curse (one kind a seat) |
| Spreads what it does | Harvest (scythe), Bonfire (torch), Cold Snap (the chain) |
| Fed by the other two | the Champion (crown), Landslide (hammer) |
| Gives to another seat | the Champion (herald), Landslide (mason), Blood Pact (donor) |
| Waits for a moment | Cold Snap (breaker), Landslide (hammer) |
| Picks the target | the Hunt (marker) |
| Pays to give power | Blood Pact (bleeder) |

### Abilities that sit between builds

These abilities sit on a border, so their two versions have somewhere to go.

| Ability | Between |
| --- | --- |
| Stoke, Fireball | Bonfire (the hottest foe) and Harvest (every foe) |
| Pyre, Smite | Bonfire (the cash-in) and the Champion (one blow, cast twice) |
| Shatterpoint | Cold Snap (the chain) and Landslide (the shattered foe opened for the blow) |
| Frost lance, Frost arrow | Cold Snap (the foe nearest its cap) and the Curse (a kind in the row) |
| Stillness | Cold Snap (frost on the field) and the Champion (mana for the champion) |
| Thunderstorm | Harvest (Shock on every swing) and the Toll (Shock on every attacker) |
| Gale spear, Skyfall | Harvest (the field) and the Hunt or the Champion (one foe, one blow) |
| Hunter's eye, Barbed arrow | the Hunt (the wound) and the Curse (a kind in the row) |
| Condemn | the Hunt (the Mark) and the Toll (the Paladin Taunts) |
| Judgement | the Curse (any debuff) and the Hunt (the bleeding foe) |
| Briar, Thicket | the Toll (the anchor) and the Hunt or Landslide (the wound, the Guard) |
| Earthen shell, Aspis | Landslide (the line) and the Champion (the escort) |
| War ballad, Allegro, Encore | the Champion (on one ally) and Cold Snap (tempo for the riders) |
| Stand fast | the Toll (the Taunt) and the Champion (the Clarity) |
| Lacerate, Backstab | the Hunt and the Champion |
| Bloodlust, Blood gift | Blood Pact (life spent) and the Champion (life and mana given) |
| Burning fist | Bonfire and Cold Snap (the frost fist) |
| Malison, Enfeeble | the Curse and every build that lays a status |

### Builds nobody planned

They come from pieces meeting by chance; the loot makes them possible without designing them.
- **The frozen gate** (the Toll with Cold Snap): attackers carry Chill away from the anchor and shatter on it.
- **The burning hunt** (the Hunt with Bonfire): Bleed and Burn on the Marked foe, and its fire leaps to the next mark.
- **The stone champion** (Landslide with the Champion): every Shield the party makes goes to one Geomancer.
- **The drinking storm** (Blood Pact with Harvest): Lifesteal on every jump.

### Themes

Elements are themes, not mechanics, and a theme shapes builds far beyond its status. Builds that share a theme should feel nothing alike.

| Theme | Its builds | Its status |
| --- | --- | --- |
| Earth: weight, Shields | Landslide; the Toll's thorns | none |
| Fire: the ramp, the long cast | Bonfire; Harvest's Fireball | Burn |
| Ice: the slow and the burst | Cold Snap; the Curse's slow | Chill |
| Lightning: spread, quick strikes | Harvest; the Toll's rod | Shock |
| Wind: reach | the Hunt | none |
| Light: service, the costly blow | the Champion's servants (Bard, Cleric, Paladin); Bonfire's Smite | none |
| Dark: drain and hex | Blood Pact; the Curse | Bleed, Weaken |

### Exotics, and nothing fenced off

- **Exotics** belong to no build: a strange effect worth seeing. The loot keeps room for about one in ten.
- **Nothing is fenced off.** Every build has pieces in every slot and a formation, with pieces worth something to it that most classes can wear. Its first rung is reachable from three classes or more and from a piece on anyone, so a run can find any build whichever leader it starts with.

## Set aside

Five of the twelve, and why. Each one's live threads have moved into the nine.
- **Thousand Cuts.** A stream with no turn has nothing to wait for, and it's weakest exactly where it's most common: against Defense. Its two live threads, many hits and riders on every hit, are what make Cold Snap beat and the Hunt's wounds burst. Your Monk-and-Bard run is a Cold Snap route.
- **Overflow.** A relay of small links read as bookkeeping, and its engine seats were the units that fell first. Mana poured into one unit reads as one thing, so it belongs to the Champion.
- **Lockdown.** Its window comes from the foes, a wind-up, rarely, so the player can't make it happen. Making it common would mean more foe wind-ups, which would change every fight for every build. The window the party makes itself, on a beat, is Cold Snap's shatter, and Lockdown's payoff is the breaker waiting for it. Weaken and Silence go to the Curse. The versions that wait for a wind-up stay in the kits as options that sometimes pay.
- **Ambush.** An opening with no tail can't be built toward without losing the fights on the way, and first-strike effects fade in long fights. The opening becomes a thread instead: the Hunt opens from hiding, and Landslide's first blow, Cold Snap's first frost and the Champion's first cast can all come at the first tick.
  - **To bring it back:** an Ambush whose opening repeats. The hider vanishes again after each strike and strikes from the dark again, with the veil (Hidden, so it can't be picked) as its cover. It's thin on classes (only the Assassin hides from its kit) and would lean on Hidden pieces.
- **Phoenix.** A build whose turn is a knockout fights the run's rules (a knockout carries and can't be potioned) and the targeting (who falls is up to the dice). Its live threads move: low HP as power and a floor go to Blood Pact; a fall that doesn't carry, and a relief, go to the walls.
  - **To bring it back:** the martyr's fall made a choice. A unit gives itself up at a threshold, flares the other two, and stands again after a won fight. That puts the whole build on one unit choosing to die and on two survivors winning the fight alone, which I'd test with sample parties before writing it.

The ones the old set put aside stay aside: the wither is now the Curse's cover, radiance is Blood Pact's heals that strike, and the gambler is for exotics.

## Checks on the whole set

- **The rhythms spread:** rising (Bonfire), bursts on a beat (Cold Snap), all at the end (Harvest), a spike then steps (the Hunt), following the foes (the Toll), rare and huge (Landslide), one unit's bursts (the Champion), see-sawing (Blood Pact), climbing in steps (the Curse).
- **The covers spread:** three builds keep a wall as part of what they are, and six stand without one by rung 3.
- **Every class is in three builds or more:**
  - six: Bramble knight, Monk;
  - five: Knight, Paladin;
  - four: Cleric, Hoplite, Valkyrie, Hexer, Vampire;
  - three: Ranger, Bard, Assassin, Pyromancer, Frostweaver, Stormcaller, Geomancer.
- **Builds that share a mechanic feel nothing alike:**
  - **Status:** Bonfire, Cold Snap and Harvest each carry one. They differ in what they aim at (one foe, the foe nearest its cap, the field), in their cover (the wall, the hold, the rod) and in their turn (the leap, the shatter, the sweep).
  - **Focus:** the Hunt focuses on a foe, the Champion on an ally.
  - **HP:** Blood Pact spends it, while the Toll and Landslide guard it.
- **Every build has a formation that can carry its second rung on its own,** and one of its seats holds its cover.

## Least sure

- **The cover's arc.** The whole set leans on the balance pass making five covers besides the wall hold up in act II (decision 2).
- **The Curse.** It needs a screen that shows a count of kinds, and Malison's change.
- **The Champion.** Whether two servants who deal almost nothing can ever beat three units who deal damage. That's a test with sample parties, not a design.
- **Cold Snap's chain** may cascade until every foe shatters at once, which is Harvest's turn, not Cold Snap's. If it does, the chain's size (a few Chill, not a cap's worth) is the knob.
- **Harvest at a boss** stays weak until rung 3, and most act bosses stand alone.
- **Blood Pact.** Whether any player pays HP, however well it pays back.
