# Gear design: philosophy

The philosophy behind the game's gear, formations, ability upgrades and mythics, and what every build and every piece is judged against. **This design isn't finished.** What's in the game is approved as it stands, and further work on any of it starts here.

This folder has three documents:
- **This page:** the director's intent, the philosophy, and how loot gets made.
- ***Gear design: the builds*** (`builds.md`): the nine builds the loot is designed from, their rhythms, what each asks of the loot, and the web between them: roads, doors and engines.
- ***Gear design: the loot*** (`loot.md`): what each rarity is, the stock, the rules for writing pieces, formations, upgrades and mythics, and what's open.

The game's combat rules are in *Core set: rules and vocabulary* (its Gear section has the slots and who wears what), and how loot is offered in a run is in *Core set: the rogue mode*.

## The director's intent

What the director wants from the loot, distilled, with their words quoted where the wording matters. Where it's wrong, they correct it, and their latest word wins.

- **Designed things, built backwards from builds,** not rules with pieces fitted to them: "It should be designed entities that you build." Depth before width. Nothing earns a place by already existing: "I would not keep any loot that we have now just for the sake of keeping it."
- **No limit on the type of effect,** on gear or formations, as long as each one is phrased so the player knows what will happen.
- **The engine can grow** with the designs: "You can go as far as you want with that." "Engine growing is totally fine."
- **Chaos and exotics:** "These types of games are about finding the chaos, finding the build in the chaos."
- **Statuses are universal:** a piece never applies a status for less, or more, than its own length. "I would keep statuses universal. You can't apply a shorter status."
- **No balancing rules while making content:** "don't make rules about balancing. We're gonna do that in the balancing pass." Synergies may be overpowered: "We're trying synergies now, it's okay if they're OP." Number ranges are first values, not limits.
- **Plenty of loot:** "It's better to have too much than not enough if you're unsure for the first versions." How much drops follows the gear's design, not the other way round.
- **Cards say who can wear a piece, never what it's for:** "the signposting who the designer had in mind for that gear ruins the discovery".
- **Rarity is mostly specificity,** plus power that grows by act and stays narrow. Tiers below legendary carry effects too: legendary shouldn't be "the only interesting gear".
- **Choices that hurt the right way:** not "picking which of your favourite toys you wanted to throw in the garbage".
- **Every class has an offhand:** "every class has at least one offhand that they can wield, no question". Two-handers that take the offhand's place are in.
- **The amulet fits everyone,** valuable "in a game where you can switch units around".
- **Formations have their own identity:** "formations also have their own identity". No lock-and-key fishing for one formation. A new formation should make you rethink your party; that's what worked best in play. No mythic formations for now.
- **Upgrades:** one plain power step and a choice of two versions for each ability and passive. "The importance is the difference, not that they're not better." Triggers and targeting are undervalued: "I like things that play on triggering conditions or targeting conditions." A training opportunity offers three choices: "For now I would start by just making training opportunities give 3 choices, and we can decide what else to do later."
- **Elements are themes only.** A build is never one keyword turned up ("red fire or blue fire or gray fire").
- **MP is fuel.** No build is made better at lasting many fights; what differs is whether it spends more HP or more MP.
- **Signposting and power at each phase of a run** are among the things a build is judged by. At its first rung the content lets a player see the direction to push in, not the whole build. Each phase's step is worth taking, and the path to a build never leaves the team unable to beat the content.
- **Every build manages survivability:** a constraint, not a design. How each build does it is the build's to say.
- **Kits may change** where a build needs it.
- **Formations are important,** enough that a build pivots to match a good one, and they have to work however they arrive in a run.
- **Engines:** many happy accidents designed in advance, which work with a small number of pieces, so that a build doesn't only come online when all of its pieces are there, and so that builds cross and a player isn't just picking a build and doing only that. A design pattern, not a concept the player has to understand. They're picked as a game designer would, for being worth finding, not from a formula or a grid of build pairs, and the count is whatever comes out.
- **Working with the director:** don't ask for coverage of every mechanic; pick what's interesting, as a game designer would. They review a representative sample at a gate, not every piece. Test with hand-built parties, not a simulated player.

## A build is a way to play

- **It can be watched.** Someone watching a fight should be able to tell which build is playing and what it's waiting for. That's its identity.
- **It has a rhythm** (see Rhythm, below).
- **It's woven from several threads,** never one mechanic turned up. Any mechanic, stat, damage kind, timing, targeting rule or resource can be a thread, including the ones that look minor.
- **A theme is more than its status.** What a theme (fire, ice, earth…) is like can shape a build's rhythm and identity far beyond the status that bears its name. A theme's builds may leave that status out, and builds that share a theme should feel nothing alike.
- **Two builds that differ only in which damage type shows on the numbers are one build.**

## Rhythm

A build's rhythm is how a fight unfolds over time for it. It's read four ways:
- **Damage:** where the party's damage falls in a fight: at the start, evenly, rising, in bursts, all at the end, or following the foe.
- **Danger:** where the party is most at risk.
- **Turns:** how often the fight visibly changes, and how big each change is.
- **What it spends:** HP or MP, within a fight. This is never how many fights it lasts: every run has the same fights, so a build that lasted longer would simply be better. It's which fuel the build burns, which decides its gear and whether it reaches for a potion or a tonic after a fight. Power follows fuel: a build that spends little has to do less with it.

Every point in that space is open. The builds spread across it, and two builds rarely share a rhythm unless something else sets them clearly apart. The builds sit in pairs on opposite sides of it, with the Toll alone (*Gear design: the builds*).

**The pieces make the rhythms.** Before the loot was designed, a read of the builds' nearest parties with plain kits found every party playing nearly the same fight: the same share of damage in each quarter, the same lumpiness, the same first kill. The kits alone don't make rhythms, so the loot has to.

**How a rhythm is measured.** `npx tsx tools/rhythm-read.ts` (plain kits) and `npx tsx tools/build-test.ts` (the builds' test parties) read each party's fights for:
- the share of the party's damage in each quarter of a fight;
- the share dealt by its biggest tenth of hits (lumpiness);
- when the first foe dies and how spread out the kills are;
- the share of the damage it takes in each quarter, and its lowest HP;
- where its damage comes from (basic attacks, abilities, each status, Thorns, the shatter).

Averages can hide a rhythm: a surge after a fall or a lock's window can vanish in a quarter's average. Where the numbers can't tell, a feel read can (`npx tsx tools/rogue-feel.ts`).

## How builds come together

- **What a build asks of a run is a range.** At one end it starts from what most runs find and gives back a little. At the other it needs specific pieces that may come late, and gives back far more. What it gives back rises with what it asks, and it should rarely be all or nothing: it pays something before it's complete. A build's three rungs are this range.
- **More than one route.** The same build can be reached through different classes, pieces and formations.
- **A web, not bundles.** Most pieces matter to more than one build, by different amounts and for different reasons, some of them not obvious. Builds connect through the pieces they share, and a run drifts from one build to its neighbour through them.
- **Engines.** A few parts that turn out to work together into something specific, on one road or more: found synergies, designed in advance. Each part earns its slot alone, the common half sits in the kits, commons and uncommons, and the keystone comes from more than one place. The set, and the test each engine passed, are in *Gear design: the builds*.
- **Exotics.** Some pieces exist for their own sake: a strange effect worth seeing that belongs to no build.
- **Chaos.** A run finds its build in what it's given. Two runs toward the same build should get there differently, and a run should be able to land on a build nobody planned.

## What makes a piece good

- **It's worth a lot somewhere and little elsewhere.** The gap matters more than the average.
- **A piece that's strong everywhere gives something up for it,** and what it gives up is designed for that piece.
- **The best choices are between things that are good for different builds,** not between a smaller and a bigger version of one thing.

## Rarity

Rarity is mostly how far a piece bends the game and how specific it is. It also means more power as the acts go on, as long as that power is narrow: a legendary can be far stronger than a rare for the builds that want it, and not for the rest. There are no random affixes. Beyond that, each piece is whatever it needs to be. What each rarity carries is in *Gear design: the loot*.

## Slots

What the slot structure has to give:
- **gear that can be kept apart,** so pieces that would be too strong together on one unit can still exist;
- **rewards a player can read at a glance;**
- **choices that aren't throwing a favourite toy away.**

How the four slots do it:
- **Slots have no job.** Any effect can sit on any slot. Stats lean softly by slot (Defense more often on armor, damage on weapons), and nothing says what a slot, a kind or a piece is for.
- **Only weapons carry behaviour of their own:** a speed, a swing (its three words: how hard per tick, how much of it is Attack, how many stats its pieces carry) and hands. A two-hander empties the offhand, so its pieces are worth a weapon and an offhand.
- **Every piece fits exactly its kind's classes,** and every class has two kinds in the weapon and offhand slots, including a one-handed weapon, so it can always use an offhand. Every wearer of a kind reads its signature stat, so a piece of a kind is relevant to every class that can wear it.
- **Two classes share at most one weapon kind and one offhand kind,** so every class's loot is mostly its own. Armor groups classes by weight, and weapons and offhands cut across those groups.
- **Apart where it counts:** most pairs of kinds from different slots never meet on one unit, so pieces in them can be strong together without ever stacking. `npx tsx tools/gear-slots.ts` counts the widths and overlaps after any change.

## Formations

- **A formation is a shape:** three seats with roles that together give a squad an identity and a fantasy, plus, if it wants, rules of its own.
- **Seats can differ from each other as much as the shape needs,** and a formation can depend on who sits where as much as it wants.
- **It joins the web two ways:** through seat roles that many builds share, so one formation suits several builds, and through its own identity, which makes it more than a sum of seats.
- **It belongs to a build:** it's chosen for what the party is, not for the next foe. No build fishes for one formation. A build plays in Neutral, gets more from a formation with the seats or party effect it wants, and most from one built further in its direction: its ask range, as with gear.
- **A new formation is a door:** one of the ways a run drifts from one build to its neighbour.

## Upgrades

- **Each ability and passive gets one plain power step and one choice between two versions.**
- **The two versions are designed for that ability,** with no pattern across abilities. They can change anything about it, as long as the kit still reads as the class's own.
- **What matters is how the two differ.** Either, both or neither can be better than the original. Each pulls toward different builds, often toward several, and abilities that already sit between two builds give their versions somewhere to go (*Gear design: the builds*, The web).
- **How a unit behaves matters as much as what it does.** What an ability aims at, what it waits for and when it fires are as open to change as its numbers. In an auto-battler they're among the most readable things a player can see change.
- **Targeting can be part of a version, or a thing of its own.** A version may come with its own targeting. Choosing a target rule may also become its own kind of upgrade, designed later; neither shape is decided.

## Mythics

- **A mythic rewrites one class,** where a legendary bends the game for whoever wears it.
- **It's found, not trained.** An upgrade changes one ability or the passive; a mythic can be taken off and goes past any one ability.
- **Upgrades and mythics are designed together,** so they don't overlap, and neither repeats a piece.

## How it reads

- **Every effect is phrased so the player knows what will happen,** at whatever length that takes.
- **A card says what a piece does and who can wear it** (FITS). It never says what the piece is for.

## How the loot is made

The method, round by round:
1. **Intent.** The director's intent for the round, recorded short (as above).
2. **Builds first.** Builds as ways to play, as many as the design needs: each one's rhythm, threads, routes, rungs and needs, and the web between them, its doors and engines. No pieces, no numbers.
3. **The spine.** One line for every rare, legendary, formation, upgrade and mythic, built backwards from the builds and written all together, so the web is designed rather than found.
   - Its rules come first: the stock it chose and why, new words, the rules the pieces bend, and the code support they need.
   - Commons get a rule per kind. Each uncommon's effect is named, since the uncommons carry the builds' first steps.
   - The web is checked for how often a run is offered what a build starts from, not only that a route exists: the offer roll and the stock decide that.
   - A fresh reader reads it before the director, who approves it on a sample.
4. **The fill.** Parallel agents write the stats, numbers, card text and code support for their share. They all work from one brief, with intent and ranges and never examples (an agent copies any example it's given). The brief points at the rules rather than restating them, since a brief's paraphrase of a rule is where a fill goes wrong. Before anyone writes, each agent gets a shared index of every share's items, so no two write the same card. Each ends with its challenges and what it's least sure of.
5. **Rulings.** The lead reads the whole fill together and rules on every challenge, in rounds.
   - The agent that wrote a file applies its rulings.
   - A fresh reader reads the whole fill between rounds, and picks the director's sample.
   - A ruling is about loops, overlaps, broken rules, wrong wearers or unclear cards. Rules about balance are left out, held back as levers for the balance pass.
6. **Build and measure.** The content goes in, and every build is played on hand-built test parties (`tools/build-parties.ts`): `npx tsx tools/build-test.ts` for rhythm, strength by rung and what carries each build, and `npx tsx tools/piece-check.ts` for whether every item does what its card says.
7. **The director plays it,** and their read is the gate.
