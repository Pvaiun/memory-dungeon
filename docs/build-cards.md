# The build cards

What each of the nine builds should look like in a fight, in a form a reader or a check can hold a fight against. It's for the balance pass: hand-built parties against chosen fights, read to see whether each build plays as designed before any knob is tuned. The design is *Gear design: the builds* (`docs/gear-design/builds.md`), and it wins where a card differs; a card only restates it for the read. No numbers: every expectation is in the scale's words, or relative to the other builds, to the same party's other rungs, or to its other fights.

## How to use a card

- **The parties.** `tools/build-parties.ts` holds three routes for each build at three rungs, with their gear, versions and mythics picked from the loot's tags (`SERVED`). Rung 1 is tested on act I's fights, rung 2 on act II's, rung 3 on act III's, and every rung also on act II's so the rungs compare. `npx tsx tools/build-test.ts` measures them; `npx tsx tools/rogue-feel.ts --builds ...` writes their fights as reading packs, against their rung's fights or named ones (`--fights`), with these cards beside them. Both start each fight as a good player arrives, not fresh: HP mostly full, MP partly spent, each ability anywhere from ready to just used (`START` in `tools/build-test.ts`).
- **The fights.** A card's best and worst fights say what to set each build against: at least one of each, and a boss.
- **What to read.** For each fight, check the card's lines in order:
  1. **Watch for:** the one picture that says this build is playing. If a reader can't tell which build it was, that's the finding.
  2. **Damage from:** where the party's damage should come from, biggest first. The build test and the feel tool's tallies split damage into basic attacks, abilities, each status, Thorns and the shatter.
  3. **Rhythm:** the build's row of the rhythm table (*builds*, The rhythm space): when its damage falls, when it's in danger, how often the fight turns, what it spends.
  4. **By rung:** what each rung should add. A later rung should look like more of the build, not just bigger numbers.
  5. **Engines** are reference, not a checklist (see below).
  6. **Wrong looks like:** the failures the design expects or fears.
- **What any build does wrong.** These hold for every card (*Gear design: philosophy*; `docs/rules.md`):
  - a member that's a passenger: it acts, but nothing it does changes the fight;
  - a status or ability that's slotted and never seen, or a piece worn whose effect never shows;
  - a loop that doesn't stop, or a fight that stalls until the enrage;
  - a trigger that always loses the fight it appears in;
  - two builds that play the same fight with different colours on the numbers;
  - a fight decided in its first few ticks, or still running long after it was decided.

## Engines are reference

An engine isn't a build's. It's a found synergy between a few parts, and it sits between builds as often as on one: many show before a build is complete, some only where two roads meet, and most never appear in a given build party at all. A card lists the engines that touch its build so a reader can recognise one when it fires, nothing more. Don't look for them, and never count one that didn't show as a miss. Only when a party holds every part of an engine (its keystone and the rest of *What combines* in `builds.md`, *Engines*) is it worth saying whether it fired and looked as it should.

## The numbers that hold the shape

The design gives no numbers. The balance sheet (`npm run balance`) holds the only standing targets for a fight's shape, the **bands** in `tools/balance/sheet.ts` (`BANDS`, each with its reason). Among them: a damage status's share of its appliers' damage, one ability's share of its class's damage, a dealer's and a support's damage against an average unit, how much a wall and everyone else take, casts in a regular fight and a boss fight, a caster's time short of MP, foes killed before they act, a boss's signature casts and knockouts.

The bands are judged over the sheet's spread of parties, not on one build. A build party may sit outside one by design: a status road leans on its status more than the spread does, and Barrage's soloist does most of its party's damage. Judge a build party by its card and the spread by the bands, and where the two disagree, say so.

## Landslide

*Two load, one strikes.* Routes: Geomancer, Knight, Hoplite · Geomancer, Paladin, Bard · Knight, Hoplite, Bard.

- **Watch for:** long stretches of small numbers behind stone bars; a wind-up on the hammer while Might piles onto it and its target is Sundered; then one number far bigger than anything else in the fight, an elite losing a large share of its HP; the stone rebuilt; again.
- **Damage from:** the hammer's heavy actions (its slow swings and its biggest ability) far above everything else; crits on them; damage read from Defense, max HP or the Shield. Statuses small. The loaders deal little.
- **Rhythm:** a long quiet, then one huge number. Danger steady, soaked by stone. Few turns, each big. Spends MP on stone, to save HP.
- **Against the others:** the lumpiest of the nine (the biggest tenth of hits carries the most of its damage), and among the fewest turns. Its opposite is Thousand Cuts.
- **By rung:** 1, one unit's heavy thing out-sizes everything round it (rocks that crit from behind a Shield, a doubled swing, a bash from max HP). 2, a loading crew: Might aimed at the hammer, the target opened first, stone on everyone; elites lose a large share at a time and a boss takes a handful of blows. 3, the blow reads the stone the whole party holds and leaves it, and lands twice.
- **Best fights:** bosses and armored foes. **Worst:** packs (a blow spent on a wolf is a long wait wasted); its pack game is the shove that hits every foe and aim that saves the blow for the biggest. **Fears:** dodgers, anything that strips Shields.
- **Engines that touch it** (reference only): the shield detonation (most of the party's damage from Shields breaking); the mirror (the boss's great blow lands on the wall as a small number or BLOCKED, and on the boss as its own number); the reckoning (a counter on the hammer climbs with each bite the anchor takes, then one swing for all of it); the avalanche (one swing kills a wolf and the rest of the number rolls down the row); the judge's drum; the shatter bell; the held charge; the brink; the red stone; the quake and the stonecutter in the Geomancer's kit and mythic.
- **Wrong looks like:** the blow never comes round in a regular fight; the blow is ordinary-sized; the stone is worn as plain defence and the blow doesn't grow from it; the loaders out-damage the hammer.

## Thousand Cuts

*One opens, all pour.* Routes: Vampire, Assassin, Monk · Bramble knight, Assassin, Ranger · Valkyrie, Ranger, Vampire.

- **Watch for:** a wound opens (a crit, a barb, a thorn), then tiny numbers several a tick, each paying again in red beside its own white; the wound closing a little with each hit until someone opens it wider.
- **Damage from:** basic attacks and multi-hits, with Bleed the biggest single source after them; the openers' crits. Few abilities in the total: little casting.
- **Rhythm:** spikes when a wound opens, in a dense stream of small hits. Danger even, paid back hit by hit. A turn for each wound opened. Spends HP: little casting.
- **Against the others:** the least lumpy of the nine and the most hits a tick. Armored foes hurt it less than they hurt other hitters, since Bleed goes past Defense.
- **By rung:** 1, a unit that opens wounds, and the party's hits on that foe print twice; more hits from the faster weapon kind or a second strike. 2, an opener and two who pour, a pacer's Haste, units kept standing by their own hits (life drunk, a Shield, an ally mended). 3, the count: every hit landed this fight makes the next worth more, and extra strikes chain.
- **Best fights:** a lone boss (every hit on one foe, the wound never closing). **Worst:** packs, where its swings scatter; its pack game is the Mark, multi-hits that fan out, and wounds opened on every foe at once. **Fears:** foes that harden under many hits (the Ice Golem's crust), dodgers, the Wisps' Shock.
- **Engines that touch it** (reference only): the red rain (one wide cast, a red number on every foe); the riposte (MISS, the answering strike, the dancer's Shield a little taller); the emptied quiver (several arrows in one tick, then a pause); the spell on the swing (a count on a fast unit, and at the top, its spell); the red stone; every colour; the lead's colour; the cull in the Assassin's kit.
- **Wrong looks like:** Bleed a side dish on a party built for it; the party can't stay up by hitting (only the dodge holds it, which play showed fails).

## Bonfire

*Three feed one fire.* Routes: Knight, Pyromancer, Monk · Paladin, Hexer, Pyromancer · Paladin, Monk, Hexer.

- **Watch for:** the Burn on the hottest foe as the party's feeding, live: it leaps when two casts land together and sags when a feeder is stunned or between spells; every feeder on the same foe; the blow that reads the fire landing for the fight's biggest number while the fire is high.
- **Damage from:** Burn, the biggest single source; then the casts and swings that feed it; then the reader. The keeper feeds too.
- **Rhythm:** as high as the party is feeding it right now, leaping when casts land together. Danger early, and whenever the fire sags. A turn at each flare, and at the blow that reads it. Spends MP, on the feeding.
- **Against the others:** its damage rises across a fight more than most (the fire has to be got up), and swings more from moment to moment than Cold Snap's even beat. Its opposite is Cold Snap.
- **By rung:** 1, one unit leaves Burn; the step is a second feeder, and the number stands about twice as high at once. 2, three feeders on one pile, steady and bursting, a keeper who feeds too, and a reader that waits for the height; elites and bosses burn for more than the party hits for. 3, heat: the party feeds faster the longer the fight runs, and the fire holds through what used to put it out.
- **Best fights:** a lone boss (one pile, all fight). **Worst:** packs (every kill throws a fire away); its pack game is fire laid thin on the whole field, and the fuse. **Fears:** fights too short to get a fire up; Silence, or a Stun on a feeder.
- **Engines that touch it** (reference only): the fuse (the smallest foe goes up and its whole fire jumps to the next, which starts roaring); the reaping; the judge's drum (three weapons carrying fire land together, and the fire leaps); the resonance; every colour; the lead's colour; the shatter bell.
- **Wrong looks like:** the fire settles to a level and reads as a status, not upkeep (*builds*, Least sure); the fire never drops between feeds, or never gets up; a fire that grows by itself on a lone boss with no one feeding it (the Status line names Everflame lantern, Bellows wraps and speed).

## Cold Snap

*Two lay frost, one breaks.* Routes: Frostweaver, Hexer, Ranger · Knight, Frostweaver, Monk · Hexer, Ranger, Geomancer.

- **Watch for:** frost creeping up the foes, each swing coming later than the last; then SHATTER (a burst, a Stun) and the party's heaviest hit on the frozen foe; then the next.
- **Damage from:** the shatter and the heavy blows saved for a shattered foe; the many small applications that build the Chill. Safety from the slow: a colder field hits the party less.
- **Rhythm:** bursts on a beat you can count. Danger falls as the field slows. Many medium turns: each shatter. Spends MP.
- **Against the others:** the most regular beat of the nine (its bursts evenly spaced); damage taken falls across a fight, as the Hunt's does, but by the slow and not by kills.
- **By rung:** 1, one Chill source, the foes slow as the counter climbs, and one shatters. 2, the same foe shatters again in the same fight, with a breaker for each (the second shatter is the line between the sign and the build). 3, the cascade: a shatter's cold runs on to the next foe, and the field falls in one long string.
- **Best fights:** a pack spread with cold (the shatters come together, like a string of firecrackers); a boss piled on (a slow all fight and a burst on a beat; the boss shrugs off the Stuns after the first few, not the slow or the burst). **Fears:** fights too short to reach the cap.
- **Engines that touch it** (reference only): the frozen gate (foes slow with every blow they land on the wall, then one bursts and the wall's Shield refills); the firecracker string (one foe bursts and the burst runs down the line, each one a Stun); the shatter bell (SHATTER, and a great spell's name right under it, every time); the held charge; the quake; every colour; the lead's colour; the resonance.
- **Wrong looks like:** one shatter a fight at rung 2 or past it; the slow never visible; shatters that don't reach the cap in a regular fight; a shatter with every cast (the Status line watches Frost fist's power step). The Frostweaver is called weak in the Status: check whether it plays its seat in a Frost party.

## The Storm

*Three charge the field.* Routes: Hoplite, Stormcaller, Valkyrie · Knight, Stormcaller, Monk · Valkyrie, Hexer, Bard.

- **Watch for:** the party's strikes spreading a charge across the whole field, back row included; then each foe that swings, casts, heals or calls for help hurt for it; a wolf pack frying in its own frenzy; a heavy blow on the most charged.
- **Damage from:** Shock, the biggest single source, paid on the foes' actions; the spreading strikes that keep it topped up; the blow that reads the charge.
- **Rhythm:** follows how much the foes act. Danger spread, and highest while a pack still stands. A turn whenever a foe moves. Spends MP, on the spread.
- **Against the others:** its damage depends on the fight more than any other build's (high against fast packs, low against a slow boss); the most foes touched by its damage. Its opposite is the Hunt.
- **By rung:** 1, a unit whose strikes spread and shock; fast foes hurt every time they swing; the back row charged without being aimed at. 2, the whole field charged all fight, the storm on everyone's swings, and a blow that reads the charge; packs burn themselves down. 3, a storm that doesn't lift, and a blow that reads the charge on everything charged.
- **Best fights:** fast packs; then groups with a busy back row (healers, cursers, summoners). **Worst:** a lone, slow boss; its boss game is the blow that reads the charge. **Fears:** Bomb Bugs, Lava Slimes.
- **Engines that touch it** (reference only): the held charge (a stunned foe's charge climbs to its cap, the blow from above lands for its biggest number, and the foe's first move costs it the lot); the goad (the anchor shouts and every foe swings out of turn, sparks flying off each); the reaping; the red rain; the resonance; every colour; the lead's colour; the quake.
- **Wrong looks like:** the back row never charged; a boss fight that's simply the party's basic attacks; Shock sitting over its band (the Status line says it does) as a nuke rather than a tax.

## The Hunt

*Three on one foe.* Routes: Paladin, Assassin, Stormcaller · Hoplite, Valkyrie, Ranger · Assassin, Ranger, Valkyrie.

- **Watch for:** a foe Marked and everything landing on it; it falls, the Mark moves, again; each kill paying for the next (a blow ready again, a volley); the foes' numbers dropping like a staircase.
- **Damage from:** focused basic attacks and abilities on the Marked foe; openers and crits on chosen hits; executes. Statuses small.
- **Rhythm:** a volley at the first Mark, then a staircase of kills. Danger early, falling with each kill. Regular turns: each kill. Spends both: HP in the first moments, MP on reach.
- **Against the others:** the earliest first kill of the nine and the most evenly spaced kills after it; damage taken highest in the first quarter and falling. Most of its damage in the opening of a fight among the nine.
- **By rung:** 1, a unit that picks its prey (the lowest, the back row, past a guard): the dangerous foe dies first, or never acts. 2, a Mark the whole party follows, hunters whose abilities aim where it sits, and a kill that pays; mixed groups fall in a drumbeat that speeds up. 3, an opening that clears the weak, and executes that carry the boss.
- **Best fights:** mixed groups with a dangerous back row. **Worst:** a lone boss until the executes come (one step, no staircase). **Fears:** Ghouls raised behind the hunt; a Taunting front with no reach.
- **Engines that touch it** (reference only): the reaping (for a long while nothing dies, every bar sinks in step, then one name scrolls several times running and the field is empty); the judge's drum (a foe falls, the Mark jumps, three weapons land together on the next); the opening, again (a foe falls and the start-of-fight happens again); the fuse; the avalanche; the emptied quiver; two in the dark; the cull and the vanishing blade in the Assassin's kit and mythic.
- **Wrong looks like:** the Mark ends before its foe falls (the Status line watches Marked's length against how long a Marked foe takes to fall); kill rewards too small to see (a few ticks, not a whole action); the dangerous foe acting freely.

## The Toll

*One is struck, two profit.* Routes: Bramble knight, Cleric, Stormcaller · Knight, Hexer, Hoplite · the dancer: Monk, Valkyrie, Bard.

- **Watch for:** foes crowding onto one unit; every blow coming back (Thorns flash, the attacker leaves bleeding, charged or slowed, and pays again when it next moves); the swarm that rushes the wall dying on it; the rest of the party almost untouched.
- **Damage from:** Thorns and retaliation, the biggest single source; then what attackers carry away from the anchor (Bleed, Shock, Chill); the free seat's own damage.
- **Rhythm:** follows how much the foes attack. All the danger on one unit. Few turns. Spends HP: the anchor's.
- **Against the others:** damage taken concentrated on one member more than any other build; the others' damage taken the lowest of the nine. The one road that waits to be hit.
- **By rung:** 1, from the kit alone: a Bramble knight, or a Knight that Taunts in thorns; packs die on it. 2, the other two join the toll (blows on the anchor set off what they've laid) and the anchor has a keeper; swarms die on the wall while the third seat does something else. 3, the mirror grown: retaliation sized by the blow as struck, growing with every blow the anchor has lived through; a boss's slow swings feed it.
- **Best fights:** swarms and fast foes. **Worst:** a boss or a pair of elites that barely swing (where it died in play; the far end is written for that and untested); foes that don't strike (Bone Priests, Witches); Area, which ignores the draw.
- **Engines that touch it** (reference only): the mirror; the reckoning; the frozen gate; the goad; the riposte (the dancer); the red rain (briars); the brink; two in the dark (two names fade and every blow goes to the one left in the light); the reaping.
- **Wrong looks like:** when the anchor falls the rest fall behind it, with no keeper in the fight; the draw leaking so the others take a real share; a boss fight lost for want of blows to return. The Toll is the road that least needs making stronger.

## Barrage

*Two serve one caster.* Routes: Knight, Bard, Pyromancer · Frostweaver, Bard, Stormcaller · Cleric, Vampire, Geomancer.

- **Watch for:** one caster and the same great spell again and again, its name scrolling up the log twice running; its MP bar refilled by the other two; the spell ready before its cooldown should be done; the party's basic attacks an afterthought.
- **Damage from:** the soloist's one ability, by far; the two who serve deal little. Basic attacks small.
- **Rhythm:** in salvos from one unit. Danger a cliff when the mana or the caster stops. A turn for each salvo. Spends MP, more than any other build.
- **Against the others:** the most damage from one unit and one ability of the nine; the most MP spent and given; the soloist's time short of MP the measure that matters most. Its opposite is Blood Pact.
- **By rung:** 1, a caster with one spell worth repeating and anyone who gives mana; the caster not swinging its staff. 2, a conductor (the spell twice, or ready again), Cooldown and Cast speed on the soloist; the spell lands several times where it used to land once. 3, a cast that pays for the next, and mana as damage.
- **Best fights:** whatever the soloist's spell is. **Fears:** Silence (the Wraiths, the Silent One), Leeches, a fight longer than the mana.
- **Engines that touch it** (reference only): the crescendo (the same name up the log, a bigger number each time, the mana emptying faster except on the free casts); the resonance (against a pack the same spell's name again and again, slowing as the pack thins); mana as armour (the caster's blue bar takes the blow and the red one doesn't); the blood mage; the spell on the swing; the shatter bell.
- **Wrong looks like:** Clarity's and Refrain's mana too small to change what the caster does (*builds* gives that to the balance pass); the servers as batteries with nothing of their own; the build losing where others win (the Status line says Barrage is the one build that loses in acts I and II, and The stage is the single biggest item).

## Blood Pact

*One pays, one drinks, one gives.* Routes: Vampire, Valkyrie, Cleric · Vampire, Bard, Hoplite · Assassin, Paladin, Monk.

- **Watch for:** the party's HP bars swinging; a unit paying a chunk of life for a blow, or riding low on purpose, and drinking it back; healers working twice as fast while someone is at the brink; a Shield or an Aegis over whoever is lowest; the party fighting at half and ending full.
- **Damage from:** hits that drink, and blows bought with HP; power below half on the low unit. Healing and Lifesteal large against the party's damage.
- **Rhythm:** high and steady damage. Danger swings and rights itself. Many medium turns. Spends HP, in place of MP.
- **Against the others:** the lowest HP mid-fight of the builds that win, and the fullest at the end; the least MP spent. The riskiest way to live in the set, on purpose.
- **By rung:** 1, a drinker: a unit that heals itself by hitting, and potions saved. 2, the price: abilities and pieces paid in HP that buy what mana can't, power below half, a net over whoever is low; fights where the mana never runs out. 3, life as the party's one currency: strongest at the brink, full when the fight ends.
- **Best fights:** long fights against things it can drink from. **Fears:** Bats (a dodged hit drinks nothing), the Witch's curse, Rot, burst that catches it low.
- **Engines that touch it** (reference only): the brink (one unit at a third of its health all fight, hitting at its strongest, every Shield and Aegis landing on it); the blood mage (the caster's HP drops at every cast and leaps back when the spell lands on a crowd); the red stone (a full unit's green numbers turn into a grey bar); mana as armour; two in the dark.
- **Wrong looks like:** a unit that can't fall (the brink with an Aegis every time); a fight ended low, not full; the price paid and not bought back inside the same fight. The build test's HP-lost measure counts Halved heart's missing half as damage taken.
