# Step 7 design: the Knight and the Cleric, then pacing and value

The director's direction (`intent.md`) is specific, so this design is mostly numbers: what each change is, what it's for, and the target the audit checks it against. Built in the same session as the direction, on the campaign branch; `tuning.md` has the rounds, `report.md` the results.

## How fights are read now

Two tools read the logs of each node's best builds (the tuner's top builds, up to 9 a node):

- `src/campaign-probe.ts`: wins under variants at a fixed difficulty, bosses' big moves started, interrupted and landed, each class's MP by fight, healing by source.
- `src/campaign-audit.ts`, new: the four problems in numbers. Action economy (actions a unit per 10 ticks on each side, the share that are basic attacks), where damage comes from (basic, abilities, statuses, reactions, for each side and for each class, with each source's size per use against the class's own swing), pacing (actions sharing a tick, abilities cast back to back), mobs and bosses (how long each lives, how often it acts, what it does to the party), and how runs are lost (the blow that knocked each member out, MP at the loss).

The engine's log now names who applied a status and the source of a pulse, so a Poison's damage counts for the Ranger that applied it.

## Part 1: the director's three changes

- **The Cleric** loses Mercy (its staff hits healed the lowest ally for three quarters of their damage, for no MP). Its abilities are **Renew** (Prayer and Purify as one: cleanses an ally with a debuff and gives it Regen; with nobody debuffed, Regen on the lowest ally, so it's held only when nobody's standing), **Cure** (a quick, small heal on the lowest ally, costly) and Raise. Its passive is the Bard's Encore: it can't be Silenced.
- **The Bard**'s passive is **Refrain**: each basic attack that lands gives a random ally 100 MP.
- **Stun pauses, Silence interrupts.** A Stun holds a wind-up under way for its duration (a `pause` lockout, engine 0.8); Silence still cancels one. A Stun lasts 5 ticks (was 2).
- **A campfire** before each campaign boss: REST gives everyone standing 40% of max HP back, FOCUS 40% of max MP. Nothing else restores between fights. Before the boss, so the choice is about the fight that decides the run. The simulations pick whichever the standing party is shorter of; the interface asks.

## Part 2: pacing and value

### What the audit found, as shipped (pass 9, all 20 nodes)

| Problem | The number |
| --- | --- |
| 1. Action economy | Party units act 1.9 times per 10 ticks, foes 0.9: **2 : 1**. Only **32%** of the party's actions are basic attacks (the Pyromancer 8%, the Ranger 15%, the Hoplite 14%). |
| 2. Value | The party's damage: abilities 56%, basic attacks 34%, statuses 9%. A swing is 2,183 on average, the same size as most single-target abilities (Gale spear 2,005, Venom arrow 2,911); a Poison application deals 586 against its arrow's 2,911. A sixth of hits crit, for 23% of damage. |
| 3. Pacing | **21%** of party actions share their tick with another; **58%** of abilities are cast straight after another ability by the same unit. |
| 4. Mobs and bosses | Minions die in 18 to 38 ticks; 14% die before acting. A boss lives 160 ticks and deals 2.2 times the party's max HP over its fight; its biggest single hit has a median of 74% of a member's max HP. |
| Losses | 149 of 230 in boss fights; the party still has half its MP when it loses; 695 of 1,462 knockouts are a boss ability's spike, 360 a swing's chip. |

The cause of problems 1 and 3 is the same: every action has its own cooldown, a free unit starts the first ready ability before its basic attack, and abilities came every 6, 12 or 22 ticks with 4 ticks of wind-up and recovery each. A unit with three 12-tick abilities was casting all the time.

### The changes

**Time.**

- Each weapon kind swings on its own cooldown: dagger 5.3, fist 5.7, wind staff 6.1, lightning staff 6.6, sword 7.4, bow 7.8, spear 8.2, light staff 8.5, dark staff 8.7, ice staff 9.0, earth staff 9.4, fire staff 9.8, axe 10.7 ticks (were 6, 10 or 16). Enemies' touches: 5.9, 7.9, 10.3. A swing's size is its old size per tick times its cooldown, so every kind deals about what it did per tick.
- Ability cooldowns by word are 30, 48 and 70 ticks (were 6, 12 and 22), and each ability's is moved up to 15% either way by its id: no two in a kit are the same (Knight 44, 45.9, 52.6; Ranger 34.2, 41.6, 48.8), nor most across a party.
- An ability's recovery is 1.5 ticks (was 2.5).
- At fight start every action is a third to two thirds charged, by its own roll (`ruleset.opening`, engine 0.9): nothing lines up on the first ticks, and most abilities come up once in a regular fight.

**Value.** A unit's output should be about half basic attacks, a third abilities and the rest statuses, and each ability a moment worth several swings:

- Ability hits: light 0.43, normal 0.75, heavy 1.25 of the stat (were 0.2, 0.35, 0.6), about three swings for a normal hit. Explicit sizes scale with them (heals, shields, Gale spear, Burning fist, Bramble lash, Pyre's per-stack bonus).
- An area spell is a light hit on each foe (Fireball, Blizzard; Chain lightning 0.6 and 0.3), about a swing a foe.
- Stacks an ability adds are doubled; a passive's on basic attacks are not (basic attacks now come more often).
- Poison is 400 a pulse for 10 ticks (was 160 for 12), so its five pulses are worth about the light hit that carries it; Venom arrow aims at a foe that isn't Poisoned yet. **The director's rule:** a status never scales from its applier's stats; a stackable status scales only by the stacks applied, an unstackable one (Poison refreshes) by nothing. A first cut scaled Poison from Attack; it's flat again.
- Buffs and debuffs from abilities last about twice as long (Guard, Haste, Slow, Weaken 20 ticks; Taunt 14; Ward and Clarity 24; Silence 8), Regen 12 pulses of 3%.
- Crit chance is 4% a point of Crit (was 5%).
- MP: abilities cost 400, 650 and 1,000 by word (costly ×1.6), so a class with 2 MP regen spends more than it regains when its abilities all fire and runs low over a run, which the campfire's FOCUS buys back.

**Enemies.** Their abilities follow the same timing; their steady ones grow with it (Brand 0.11, Mend 1.3, Hailstorm 0.18, Tempest 0.13 of Magic). The big moves keep their size and come less often (Crush, Inferno, Soulfire, Flatten every 70 to 80 ticks). The mob and boss balance is the next round (`tuning.md`).

### Targets the audit checks

| | Target |
| --- | --- |
| Basic attacks, share of party actions | 55% to 70% |
| Party actions per foe action | 1.5 : 1 or less |
| Party actions sharing a tick | under 5% |
| Abilities cast back to back | under 25% |
| Party damage | basics 45–55%, abilities 30–40%, statuses 10–20% |
| A DoT application | worth more than the hit that carries it |
| Minions | act at least three times before dying, on average |
| A boss fight | under twice a regular fight's length, and its big moves land and hurt |
