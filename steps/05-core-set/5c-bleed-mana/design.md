# Step 5c design: Bleed for Poison, slotted openings, hungry casters, a three-way campfire

The director's direction (`intent.md`) is specific, so this design is mostly numbers: what each change is, the reading I took where the message left a choice, and the target the tools check it against. Built in the same session as the direction, on the campaign branch, as 5a and 5b were; `tuning.md` has the rounds, `report.md` the results. This file describes what shipped (pass 19); the trail has how each number got there.

## Armor

A physical hit deals **hit² ÷ (hit + k × Armor)** (`ruleset.armorK`, engine 0.11), in place of the flat cut and its 25% floor. Every point of Armor helps, against any hit, and nothing is ever blanked.

**k = 0.25, not 1.** On this scale Armor 5 is 5,000 and a minion's swing 700, so the two are the same size, and k = 1 makes Armor four times what it was:

| Into | A minion's swing (700) | Crush (6,000) |
| --- | --- | --- |
| A plated, Guarded Knight (Armor 8,000), k = 1 | 56 (8%) | 2,571 (43%) |
| The same Knight, k = 0.25 | 181 (26%) | 4,500 (75%) |
| The same Knight, the old flat cut and floor | 175 (25%) | 5,040 (84%) |
| A caster (Armor 1,000), k = 1 | 288 (41%) | 5,143 (86%) |
| A caster, k = 0.25 | 518 (74%) | 5,760 (96%) |

At 5b's knobs, the same builds won 94% at k = 1 (the walls shrug off the minions, which hit only with swings), 78% at k = 0.25, and 80% under the old rule. k = 0.25 keeps the old balance and gives Armor the shape the director asked for: big hits lose about a quarter of the Armor's size, small hits lose a share, and stacking Armor keeps paying.

## Poison becomes Bleed

**Bleed** is an Intensity status with no duration. Each hit its holder takes (a hit: a basic attack, an ability's hit, an extra strike; not a pulse, a reaction or Thorns) deals **120 per stack**, untyped and past Armor and resistance (not a hit itself), then **a third of the stacks close**. A stack is worth up to 360 if enough hits follow; a foe that dies first wastes the rest. Built on the engine's Intensity trigger (as Shock is, on the holder's own actions), with one engine change: **a hit's statuses land after its hit events**, so the hit that applies Bleed doesn't set it off. Without it, half of every application went at once, as a delayed rider.

- **Ranger: Barbed arrow** (was Venom arrow): a light hit at a random foe (the documents' "a random foe": by Aggro, under Taunt, as every random pick is), adding several Bleed from Attack (about 10 at Attack 4). It no longer seeks a foe without the status.
- **Bramble knight: Briar**: each time its Thorns damage a foe, that foe gets a few Bleed, from the Bramble knight's Armor (about 3 at Armor 4). *Reading: the message says "the amount of attacks on the Bramble knight should scale through HP or Armor, probably Armor"; I took it as Briar's stacks, in parallel with the Ranger's sentence after it. Bramble lash still scales from Thorns, as the document says.*
- **Assassin: Lacerate** (was Shadow strike): each of its crits adds several Bleed (about 6 at Attack 5). Hit events now carry a "crit" tag, so a reaction can answer crits alone. From Attack, the convention for physical things; Crit chance already decides how often.
- **Snakes**: Venom's bites add a few Bleed (2) to the bitten member.

**X and Y.** At Shock's numbers (60, a half) Bleed was 6% to 9% of each Bleed class's damage; at 120 and a third, 13% to 20%, about where Burn and Shock sit in theirs. A third (not a half) pays a party for keeping hits coming, the director's "inverse Shock".

## Opening cooldowns by slot

A party unit's abilities start a fight **20, 12 and 6 ticks charged**, by the order they're slotted in (`ruleset.opening.slots`), in place of the roll: a short ability in the first slot is ready within a few ticks, a long one in the third after about 36. The order is the player's (the party screen's numbered ability cards, which now show each one's first tick). The director's 25, 15 and 10 fired every first-slot short ability on the first tick, the party together, and 19% of minions died before acting (5b: 6%); at 20, 12 and 6, 12%.

- **Basic attacks still roll** a third to two thirds of their cooldown (a few ticks), so two swords don't swing in lockstep all fight; **foes still roll** everything. Neither is the player's preparation. If the director wants these fixed too, it's a line.
- **Party cooldowns 24, 32 and 42** (were 30, 48 and 70; foes keep the old ones). With the slotted opening, a caster's second and third abilities came off in a third of regular fights or fewer, and the Paladin, Hexer and Assassin cast nothing in half or more of them: "those cooldowns are too long".
- The simulations now try **two orders** for every build (the documents' and the shortest cooldown first), and the climb swaps orders, so the order is part of what the search finds.

## Mana

Casters hungry, walls not. Under 5b's prices the Knight, Hoplite, Bramble knight and Vampire spent a quarter of their fight time with an ability ready and no MP for it, and every caster none.

- **A class's abilities cost their word's MP × a factor by its Magic**, fixed by its stat line (Magic from gear doesn't change it): Magic 1 (Knight, Hoplite, Ranger, Monk, Assassin) a quarter, 2 (Bramble knight, Vampire) half, 3 (Valkyrie, Bard) the word, 4 and 5 (Cleric, Paladin, Hexer, Frostweaver, Stormcaller, Geomancer, Pyromancer) double. **No ability costs more than 40% of its class's MP pool**, so every class can pay for two spells from full. A proportional rule (Magic ÷ 2.5) with class regen halved starved the Bramble knight and the Vampire as much as the Cleric; at 1.5 for Magic 4 the casters barely starved and FOCUS was almost never the right pick; uncapped, the Paladin could afford one spell a fight and the Cleric's Raise (3,200 of 5,000) never fired.
- **MP regen unchanged** (the director's alternative, regen near zero with gear the only source, is priced in the report: 21% wins against 79%).
- The simulations' kits weigh MP regen for casters as much as Magic, and not at all for the Magic-1 classes, so the search tries MP gear where it matters.

## The campfire

Three options, once a run, after half the regular fights: **REST** (everyone standing regains 40% of max HP), **FOCUS** (60% of max MP; at 40% it was too little to matter), **RAISE** (one fallen member of the player's choice stands with 40% of max HP; offered only when someone is down). The simulations raise whenever they can (the member with the most max HP), else rest or focus as before; that picker wins more of the runs the pick decides than "REST, or RAISE if someone's down" (363 against 346 of 412).

**Useful** is measured, not argued: `src/campaign-campfire.ts` copies every run at its campfire and finishes it once per option, on the same dice. An option is useful in proportion to the visits where it's the one that wins.

## Burn, Shock, the Bard and the Paladin

- **The Pyromancer's Burn stacks are 2.5 times the word's and the Stormcaller's Shock stacks double** (abilities and passives, `BURN_STACKS`, `SHOCK_STACKS`).
- **Shock capped at 40** (was 25), 60 a stack as before: with doubled stacks the cap held the Stormcaller's Shock at 18% of its damage. At 80 a stack as well the Stormcaller was in 57% of the top builds.
- **Bard: Thunder chord** (was Lullaby): many Shock on every foe, from Magic. Medium cooldown, normal wind-up. At several, a playtester saw it peak at 10 stacks.
- **Paladin: Smite** adds several Burn and is on a medium cooldown (was long).

## A bug

Designer view worked out every amount against the unit's stats and printed a bare number, so Bramble lash didn't say it scales from Thorns (nor any other ability its stat). Every worked-out amount now names what it grows with ("≈ 1,800, from Thorns").

## Targets the tools check

| | Target |
| --- | --- |
| Time starved of MP (an ability ready, no MP for it), over a run | the Magic-4 and Magic-5 casters 10% to 40%; Magic-1 classes under 5%; Bramble knight, Vampire under 15% |
| MP regen gear | in the casters' best kits |
| Casts in a regular fight | every unit casts in nearly every fight (no cast under 10%); slot 1 about 1.5, slot 2 about 1 |
| Basic attacks, share of party actions | about 55% (was 66%) |
| The campfire | each option the only winner in a fair share of the visits where the choice matters |
| Bleed, Burn, Shock | 20% to 30% of their classes' damage |
