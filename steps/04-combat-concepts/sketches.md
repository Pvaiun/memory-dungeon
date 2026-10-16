# Step 4 sketches: the bones of combat

First pass, Oct 16, 2026. The intent asks the design to open with a few rough sketches of the bones, each hanging together on its own, for you to react to before the full `design.md`. There are three. They share a core, and differ where round 1 left real choices open: whether you have an input during a fight, how turns work, where the luck comes from, and how much of the enemy you see.

Each sketch plays your example fight twice: a troll that heals every turn and hits hard. It's told, not simulated, so there are no win rates. The full design will take its sample from a crude run.

## What I need from you

React to the whole systems: pick one, blend them, or throw them all out. The table shows which parts come apart cleanly for blending. Then I'll ask about single concepts in context, and write `design.md` from the direction you pick.

## The three at a glance

| | A: Classic | B: Orders | C: Tempo |
| --- | --- | --- | --- |
| Feels like | Dragon Quest | Dragon Quest Monsters | Final Fantasy X's turn order, with everything on show |
| Your input in a fight | None | An order per unit: Attack, Support or Guard | One dial for the party: Press or Hold |
| Turns | Rounds, in speed order with a little wobble | Rounds, in speed order | A timeline: fast units act more often |
| Where the luck is | Dice on every attack: miss, crit, block | The enemy's choices: whom it hits, which move | A small wobble in timing, and whom the enemy hits |
| What you see of enemies | Damage numbers, trait words, "badly hurt" messages | Plus a health gauge with no numbers | Health bars, and a card that fills in with what you've seen |
| What abilities run on | MP, a pool that lasts the whole run | Cooldowns | Time: big moves make a unit wait longer |
| Least sure about | Too much luck in the middle | Whether orders are fun or a chore on a phone | Too solvable, too little tension |

## What every sketch shares

These follow closely from round 1, so I'd keep them whichever sketch you pick. Push back on any of them.

1. **A party of up to four,** against a plain list of enemies. That's down from the concept's five (see "Changes to earlier direction").
2. **A few shared stats, each with one visible job:** health, attack, magic, armour, magic armour and speed, plus a little more in each sketch. Abilities, gear, formation slots and perks all push the same few numbers, so a build stretches a shared stat (your "double-dipping"), and a keystone flips one shared rule.
3. **Physical and magic damage, each stopped by its own armour, which subtracts.** Subtraction gives thresholds: a weak hitter into thick hide does almost nothing, and past the armour every point counts. That's your off-build that "doesn't work at all, then suddenly gets really good", and it shows on screen as tiny numbers. No weakness chart: Pokémon's "super effective" is the feedback-chasing you called too simple.
4. **Chunky hits.** One hit takes a visible chunk of a health bar, so "who dies when" reads at a glance, and an ordinary fight lasts a handful of rounds.
5. **Your units do their jobs; the enemy is the chaos.** Healers heal whoever is lowest once they're hurt enough. Attackers all hit the same enemy until it falls (whichever draws the most attention, then the most hurt) unless their job says otherwise: an assassin goes for the boss. They're competent, not clairvoyant. Enemies pick targets at random, weighted toward whoever draws attention, so a tank is how you take the luck out of who gets hit. That's how "the better a party matches, the less luck matters" is built in, and why you never lose because your archer shot the wrong wolf.
6. **Statuses:** buffs, debuffs, damage over time, and a unit's own stacks, like the assassin's lethality. Each shows as a word on the unit, and damage over time shows its number. Step 6 picks which exist.
7. **Reactions stay rare and one deep,** like a counter after a dodge. A reaction never sets off another, so the feed never becomes Siralim's "cacophony of triggers".
8. **A fight clock.** After a while, enemies grow steadily stronger, with a message. Stalemates end, there are no 79-round slogs like step 3's stand-in, and a loss on the clock reads plainly as "not enough damage".
9. **Every number your party causes is shown,** and your own party is an open book: health, stats and statuses.
10. **Each unit rolls its own dice,** so the same seed brings the same enemy luck whatever party faces it. Step 3 found this makes comparing parties much cheaper.

I looked at a single unit and am not pitching it. Your example fight is about jobs (the tank holds, the healers outheal, the assassin bursts), and jobs need a party.

## Sketch A: Classic

Dragon Quest with a tank. Fully automatic: perk picks stay the only decisions in a run, all the depth is in the party you bring, and dice decide the rest.

- **Rounds.** Everyone acts once a round, in speed order with a little random wobble, so units with similar speeds can swap. That's where "he hit my healer one hit before the heal went off" comes from.
- **Hit, crit and block rolls on every attack.** MISS shows an enemy is agile. CRITICAL is a big moment, and crits ignore armour, which gives thick hide a second answer. BLOCKED shows a tank doing its job. Each chance is a matchup, such as accuracy against evasion, kept between 5% and 95%.
- **MP,** a pool that lasts the whole run, pays for spells and abilities. A healer running dry before the boss is a loss you can read, and it gives step 11 a second thing to wear down besides health.
- **Enemy health hidden,** as in Dragon Quest. Instead, messages at half and near the end ("The troll is badly hurt!"), and on a loss, one line saying how hurt the enemy was. Step 3 found close calls invisible without something like this.

**Luck and the match.** Because every chance is a matchup, a well-matched party lives near the ends of the range: accurate units barely miss an agile enemy, and a big shield blocks most blows. A mismatched party lives in the middle, where the dice decide.

**The troll, twice.**

- *Tank, healer, mage, ranger.* The tank draws some blows, not all. In round 2 the troll lands a CRITICAL on the ranger, who falls in round 3. The mage's spells land, but every troll turn ends with "The troll's wounds close", and it never looks worse than hurt. The clock runs out. Last line: "The troll was barely hurt." Your damage never came close to its healing.
- *A tank with a taunt, two healers, an assassin.* Every blow lands on the tank, some BLOCKED. A crit drops him to a sliver, and you watch to see whether a healer acts before the troll does. One does. The assassin's lethality builds, then a huge number, "The troll is badly hurt!", and a second strike kills it before its wounds close.
- *Where it goes wrong:* a MISS on the assassin's strike, or two crits in a row on the tank. Both show as big words, so you know it was luck, but the fix is to try again unchanged, which is what you said a retry shouldn't be.

**Against round 1.** The closest to your ballpark, the simplest to learn, the easiest to simulate, and preparation is the whole game. It strains in three places: no input, which you called highly valued; dice on every hit make it the luckiest sketch, so in the 60/40 middle, retrying until the dice fall right becomes the way past; and with health hidden, how close you came rests on a few messages.

**Schema:** keeps the most of its rule language, including the full hit, crit, block and armour sequence. Swaps cooldowns for MP.

## Sketch B: Orders

Your Dragon Quest Monsters reference, built out. Each unit carries a standing order. The order changes what kind of thing it does; the build decides how well.

- **Three orders: Attack, Support, Guard.** Attack is damage. Support is buffs, debuffs and statuses. Guard is healing, protecting and defending. The names are placeholders, and it could be two or four.
- **Every ability is tagged with one order.** A unit uses its best ready ability with that tag. With none, it falls back: a basic attack on Attack or Support, defending itself on Guard. So Support on a unit with no buffs just attacks, as in Dragon Quest Monsters, and building a unit is also building what its three orders do.
- **When you give them.** Each unit's starting order is part of the build. During a fight you can change any unit's order between rounds. The fight carries on by itself, and most of the time you change nothing.
- **Two guardrails,** for your firm "never a puzzle of button presses". An order takes effect from the unit's next turn, so you steer the next stretch of the fight rather than time a blow. And an order never decides when a unit spends a resource: the assassin cashes in its lethality by its own rule. That keeps out the turn banking you ruled out.
- **Few dice.** Your attacks always land, with a small spread so numbers aren't identical. A miss happens only against an enemy whose trait brings it ("agile" dodges some hits), so MISS always means something.
- **The enemy's choices are the luck.** Each enemy picks a move and a target with weighted dice, and announces its big moves a round ahead ("The troll raises its club!"), which gives an order something to answer.
- **An enemy health gauge,** notched in quarters, with no numbers. You need it to judge when to press, and it shows a near win.

**Luck and the match.** The dice are the enemy's. A taunt makes whom it hits certain, healers with room to spare soak its bad rolls, and orders answer what it actually did. A party that fits the fight leaves its dice little to bite on.

**The troll, twice.**

- *Tank, healer, mage, ranger, on default orders.* The tank, on Guard, takes most blows, but the ranger, on Attack, draws one big blow and falls in round 3. The gauge reaches the second notch, then fills back as the troll heals. You switch the mage to Guard for its small heal, which only slows the loss. The clock runs out. The gauge never got past half: its healing outpaced you.
- *Tank and a healer on Guard, a second healer on Support sharpening the assassin's blade, the assassin on Attack.* The gauge creeps down. In round 6 the troll raises its club while the tank is low, so you switch the second healer to Guard. Both heals land, and the tank survives the blow. Back to Support. The assassin's strike lands with lethality full, the gauge drops two notches at once, and the next strike finishes the troll before its wounds close.
- *Where it goes wrong:* leave the second healer on Support through the big blow, and sometimes the tank falls and the troll's blows find everyone else. The loss reads as "I should have called the heal": a lesson, not bad luck.

**Against round 1.** The only sketch with the input you described: macro, vibes, mostly watching. The luck sits where the build and the orders can answer it, and "will my healers get him healed?" becomes a moment you can act on. Learning how each unit carries out each order is the "learn your party by trying it" you wanted room for. It strains in three places. Input that matters means simulated players need rules for giving it, and how well they give it becomes part of every number. Four units' orders between rounds, on a phone, could feel like a chore if the defaults aren't good. And the gauge gives away more than Dragon Quest does.

**Simulation** would compare three ways of giving orders: never change them, a simple rule of thumb ("healers to Guard when someone's under a third, everyone to Attack in the last quarter"), and the best the harness can find. Your "there's more or less a right way to do it" becomes a bar: the rule of thumb should get close to the best, and never changing should lose fights the rule of thumb wins.

**Schema:** keeps statuses, effects and targeting. Replaces behaviours with orders, and keeps hit, crit and block only where a trait or ability brings them.

## Sketch C: Tempo

The most legible end, short of a tactics game: everything on show, almost nothing left to dice. Your one input is how hard the party pushes.

- **A timeline.** Each unit's next turn comes after a wait set by its speed, so faster units act more often, and a strip shows the next eight turns, enemies included. Big moves make a unit wait longer, in place of cooldowns. Speed becomes a stat worth stretching, and races show before they happen: you see the troll's turn coming before your healer's.
- **A tempo dial for the whole party: Press or Hold.** Press means more damage dealt and taken, and healers wait longer to heal. Hold is the reverse: the tank guards, and healers top up early. A switch takes effect after a short delay, so it's a call about the next stretch, not one blow. The formation could set what Press and Hold do in each slot, tying the input to the build (that's step 9's).
- **No attack dice.** The same move on the same target always does the same number. Dodges and crits become rules you can read: "agile" dodges the first hit each round, and an assassin crits every third hit, with a counter on screen.
- **The only luck** is a small wobble in each wait, so close speeds can swap but clearly faster units never do, and the enemy's choice of target.
- **Everything shown.** Enemy health bars, and a card per enemy that fills in with what you've seen it do: its healing once it heals, its armour once you've hit it. You still learn by trying, but the card remembers for you.

**Luck and the match.** There's little to begin with. A clear speed gap never wobbles, and a taunt fixes whom the enemy hits.

**The troll, twice.**

- *Tank, healer, mage, ranger.* The strip shows the troll acting once for every two of the ranger's turns, and each of its turns ends with a green number on its bar. The ranger falls to two blows, and the bar never drops below three quarters. Afterwards its card reads: heals every turn, heavy blows, thick hide.
- *A tank, two healers, an assassin, starting on Hold.* The tank guards, the healers top up early, and the blows land small. The bar drifts down as the assassin's crit counter ticks. At half you switch to Press. The strip shows the assassin's critical turn just before the troll's next heal; it lands, the healers barely keep the tank up, and the next round finishes it.
- *Where it goes wrong:* switch to Press too early, and the tank falls before the assassin's window. The strip shows exactly why.

**Against round 1.** The most legible sketch, with the least luck, and losses explain themselves. It strains in three places. Fights between the same sides vary least, so there's the least tension. The cards and fixed numbers push toward reading a spec sheet, nearer Pokémon's "too simple" than learning by watching. And a visible turn strip invites timing play; the delay guards against it, but the pull is there. It's the furthest of the three from your Dragon Quest ballpark, and nearest the tactics games you placed at the most legible end.

**Simulation:** one two-way dial with a delay is small enough to search for the best play, so the gap between set-and-forget and the best is cheap to measure.

**Schema:** keeps statuses, effects and targeting. Replaces rounds and cooldowns with the timeline, and hit, crit and block rolls with rules.

## Changes to earlier direction

Each of these bends something already written down. None is decided until you pick.

- **A party of up to four, not five** (concept spec, lean; round 1 left party size to me). Both your example parties had four. Four health bars and a few enemies fit a phone, and Dragon Quest and most old Final Fantasy games use four. Fewer slots need fewer unlocks, which eases the concept's worry about rewards for a five-unit party, and four units' orders stay light in B. Dungeons can still cap lower. Whether formations keep five slots, one always empty (a choice in itself), is step 9's.
- **Your attackers focus fire, led by attention** (step 1 had them attack by aggro, and left this to step 4). It follows from your firm "never lose because my archer didn't hit the right enemy". Enemies still pick by aggro, and an enemy that draws attention to itself still works as a gimmick.
- **A fight clock** replaces the schema's loss at round 30. Same job, but it reads.
- **Abilities firing when ready** (step 1, placeholder) holds only in B, where they must also fit the order. A runs them on MP, and C on time.
- **Hidden enemy stats** (concept; you reopened it): A keeps them hidden, B shows a gauge, and C shows what you've seen.
- **A one-line note on a loss,** in A only. The concept deferred an end-of-fight recap; this is one line, not a recap.

## My lean

**B, Orders, as the base.** It's the only sketch with the input you called highly valued, and it puts the luck where building and orders can answer it, so a loss reads as "I should have built or called it differently", not "unlucky". Its risk is the input itself: if orders don't matter, it's A with extra buttons, and if they matter too much, execution creeps up on preparation. That's measurable, and the bar under its Simulation note is how. From C, I'd consider borrowing the turn strip, for the current round only, as presentation. A is the safe fallback if you'd rather keep fights fully automatic.

Least sure: whether B's gauge or A's messages better answer "how close was I?", since the gauge gives away more; and whether orders between rounds feel like Dragon Quest Monsters on a phone, or like a chore.
