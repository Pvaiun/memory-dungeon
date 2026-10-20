# Step 4 build log

The trail for later sessions. The director doesn't read this; `report.md` is theirs.

Step 4 builds the director's design (`design.md`) and checks it with functionality tests; there's too little content to tune balance (the method's table for steps 4 to 6). So this is a build log, and the budget was time: one session, then report. The build fit in one session. Placeholder numbers in the worked example were tuned freely, only so the engine and harness tests have mixed results to measure.

## What was built, in order

1. **Schema 0.4** (`src/schema.ts`). Step 1's rule language (rules, actives, behaviours, expressions, selectors, flags, the damage pipeline) is gone. In its place, the design's: a stat registry (`amount` or `points`, floor, cap, `brings`), stat families (`resist:<element>`, `immune:status:<id>`, `immune:kind:<kind>[:<tag>]`, `immune:debuffs`, `immune:damage`), elements, weapons, abilities, statuses, five instant effects (`damage`, `heal`, `mp`, `apply`, `remove`), targeting rules, conditions, events and reactions. Passives, gear, formation slots, formations and perks all give `stats` (fixed changes) and `statuses` (applied at fight start). Dungeons, challenges, loot and parties are unchanged. `PRIMITIVES.md` and `schema/*.json` are regenerated from it.
2. **The fight** (`src/engine/combat/fight.ts`, about 1,000 lines). A discrete-event loop on sub-ticks: each `step` plays one moment (starts, then the queue in batch order, then expiries). The queue is a sorted array of plain items (action resolutions, pulses, reactions) keyed by time, batch, group, slot and creation order. Everything is JSON-safe, so a run still saves mid-fight. `stats.ts` holds the timing maths (speeds as whole-number fractions, rescaling running timers) and the "numbers inside statuses" machinery: each status's numbers are compiled into a fixed order, and an instance stores the part fixed at application (its source's side), so a Refresh can keep the stronger of each.
3. **The battle system** (`src/engine/combat/rules.ts`, `combat-1`), plugged into step 2's `Rules` seam. It builds units from content, carries HP and MP between fights, applies perks, and keeps the stand-in's perk offers and loot. The stand-in is deleted. `ENGINE_VERSION` is 0.2. `run.ts`'s `Fight` type is now just what the run loop reads; `round` is the current tick.
4. **The validator** (`src/validate.ts`), rewritten around the design's validity rules, with the party, dungeon, loot, challenge, starter and progression checks carried over. The verb-signal checks are gone with the rule language they read; step 5 rebuilds verbs.
5. **The worked example** (`fixtures/hollow.pack.json`), rewritten in schema 0.4 with step 1's ids, so tests, studies and the party file still line up. It uses most concepts: weapons with hit counts and attached statuses, MP and MP regen, cast times, conditions, stated targeting, a shield, a DoT with an element, a stun, a taunt, lockout immunity on the boss, Thorns, a per-ally reaction (pack fury), formation slots and perks as stats and statuses.
6. **Tests.** 122 functionality tests in `src/engine/combat/` (`flow`, `damage`, `statuses`), mostly the design's Part 2 examples by name, run through `arena.ts`, a helper that sets up one fight from inline units, statuses and abilities. 80 validator tests, including Part 2's ability cards. The run, explorer, guard and harness tests are ported; step 1's `tests/probes.test.ts` is deleted, since it probed the old rule language.
7. **Tools.** `printLog`, the reading packs and `npm run dungeon`/`npm run study` all speak the new log. The guard test now scans `src/engine/` recursively.

## Choices made where the design was silent

Each is the smallest reading that fits the design's text. The report lists the ones the director should see.

- **When a unit starts.** Units that are ready at the start of a moment start then. A unit that becomes ready, or whose action becomes available, because of something that resolved during the moment starts on the next sub-tick. This keeps "the party batch resolves first" true without re-entering a batch, and costs 1/1000 of a tick: Fire resolving at 45 is followed by a basic attack at 45.001.
- **A basic attack is "cast" until it resolves,** even with no cast time, so a party lockout set to interrupt can cancel an enemy basic attack due in the enemy batch of the same sub-tick (the design's Smash example, and the Knight and Ogre example, both read this way).
- **Whole numbers.** Damage is rounded down once, after mitigation; heals after crit. Absorbs soak whole points, up to their total rounded up.
- **Crits and riders.** A hit's riders share its crit roll. A physical rider rolls Evasion on its own (as written).
- **No valid target when resolving** (a stated rule that finds nobody): the action fails like an unaffordable one, with no MP spent and no cooldown.
- **"A random valid ally" includes the unit itself.** In events, "the holder's allies" excludes the holder.
- **Reactions.** Reaction damage is never a hit: no hit events, no crit, though typed reaction damage meets Evasion and Armor. A reaction's effects must state their target (`to`), since there's no natural default. Plain reactions on an Intensity status don't scale with its total; an Intensity trigger's effects do.
- **Pulses** carry their status's element and subtype. The applier's boosts that reach a pulse are fixed at application (for Intensity, they set the stacks added instead, and nothing else: a test caught them being counted twice).
- **Events.** `status_gained` fires on every application, refreshes and added stacks included. `status_triggered` fires on every pulse and every Intensity trigger.
- **Immunity to all damage** blocks statuses whose pulses damage their holder (the design's "anything the unit is immune to"), but not, say, Thorns, whose damage goes to others.
- **Whose numbers.** In an action, a stat scale reads the actor unless it says `target`; hp and stacks read the target. Inside a status, a stat scale must say `source` (fixed at application) or `holder` (read when used); the validator requires it.
- **Lockout tags.** An action is covered by its kind, and by the type and subtype or element of each of its damage effects, as written in its data.
- **Resistance's floor and cap** apply to each element's total (general plus specific).
- **Slot order.** A party unit's slot is its formation position's place in the formation; an enemy's is its place in the fight's list.
- **Dice.** Each unit has its own stream: party units keyed by specialization, enemies by slot, from the run's seed and the fight. The same seed brings the same luck to the same unit whatever else is in the fight (step 3's suggestion).
- **Stats that bring statuses** hold them exactly while the stat is above 0: added when it rises from 0, removed when it falls to 0, and put straight back if a dispel removes one.
- **Run level, kept minimal for step 11:** HP and MP carry; no recovery between fights; KO'd units stay down; every status ends with the fight, and a max HP increase that ends caps current HP. Perks give their stat grants at once (raising current HP and MP with their max) and their statuses at each later fight start, to the units they're `for`.
- **Not design rules: safety stops.** A fight past 5,000 ticks, or one where nothing can ever happen again, stops as a loss. An event chain more than 64 deep stops (none has). Neither fired in the sample content.

## Checks run (Oct 20)

| Check | Result |
| --- | --- |
| Functionality: the design's rules and Part 2 examples | 122 tests, all pass |
| Validator, including Part 2's ability cards | 80 tests, all pass |
| Whole suite | 241 tests, all pass, about 1¾ minutes |
| Feel check: a fresh reader on 5 reading packs | Guessed a winning colour in 3 of 3 lost runs. Found three gaps in the reading packs (below) |
| Replay: 10,000 runs against their records | Identical logs, all 10,000 |
| Resume: save and load at every decision, mid-fight included, 3 rule sets × 300 seeds | Identical logs, all 900 |
| V8 (Node 22) against JavaScriptCore (Bun 1.4.2), `--digest` over 10,000 runs | Same fingerprint, `bd0f64fe27f33acc` (and `69243f96875d15d3` before the last content fix) |
| Speed under tsx, as step 2 measured | 650 µs per fight (the stand-in: 31 µs), 71 moments per fight |
| Speed bundled with esbuild (closer to Memory's build) | 495 µs per fight, 2.0 ms per run; 38 ms per exploration of 27 paths (the stand-in: 2.4 ms) |
| Log size | 102 KB per run as JSON (923 entries), 11.0 KB gzipped; the player-visible part 4.1 KB gzipped (the stand-in's: 1.5 KB). Record: 0.8 KB, unchanged |
| Fight length, 4,023 sample fights (all parties, three ladder strengths) | Median 26 ticks, 90th percentile 96, longest 209. No safety stops |
| Combat sample study | 205,800 runs in 6 to 8 minutes under tsx (the stand-in: 35 s) |
| Progression sample study | 28,033 runs in 62 to 73 s (the stand-in: 43 s) |
| Shared seeds | A tweak to one party needs 11 times fewer runs to judge (step 3: 4.4). Two different parties sharing units: 1.6 to 2.2 times fewer (step 3: no saving); with no units in common, no saving |
| Real effects in the harness | Formation, gear and abilities each change results, in 20 of 20 seed blocks |

Speed work: the first build ran at 1.1 ms per fight under tsx. Three changes, each checked against the pinned run (identical): stats are only re-derived when a status with stat changes comes or goes; events skip statuses that don't listen to them, looked up by id; party units are copied by hand at fight start instead of with `structuredClone`. What's left is spread thin (event dispatch is the biggest piece). Studies that sweep many parties would gain most from running seeds in parallel workers, a harness change.

## Pricing the tightest direction

The direction I worked hardest around is Intensity's "counted in thousandths, ends when its total reaches 0". Halving a total of thousandths takes about 10 extra pulses to reach 0, so every Burn, whatever its size, ends with exactly 10 pulses that deal nothing, keeping its icon up for 20 more ticks. The variant "ends below 1 stack" removes those and changes no damage (as-designed column checked against the engine; the variant is the same arithmetic with the other end condition):

| Stacks | As designed: pulses (for 0), damage, ticks shown | Ends below 1 stack |
| --- | --- | --- |
| 1 | 10 (9), 1, 20 | 1 (0), 1, 2 |
| 3 | 12 (10), 4, 24 | 2 (0), 4, 4 |
| 10 | 14 (10), 18, 28 | 4 (0), 18, 8 |
| 30 | 15 (10), 56, 30 | 5 (0), 56, 10 |
| 300 | 19 (10), 596, 38 | 9 (0), 596, 18 |

The same table shows the design's "each Burn stack is worth about 2 pulses of damage, whether the total is 3 or 300" holds from about 30 stacks; small Burns lose to rounding (1 stack deals 1, 3 deal 4, 10 deal 18). Carrying fractions of damage between pulses barely helps (30 stacks: 58 instead of 56), so this is a question of what stack counts content uses.

## Harness findings

- **The good-enough benchmark falls behind the optimizer** in 3 of 600 player-weeks in the progression sample (2 of 60 in its test). In the case traced, the optimizer cleared Hollow 5 with a lucky win by a solo Vanguard in the Phalanx, a party the benchmark rates unwinnable. Neither more budget (3,000) nor more seeds per party (20) closed it, so it's the benchmark's search shape, which steps 14 and 15 own. The progression test now asserts "under 5% of player-weeks", with a comment.
- **The benchmark ran out of budget 17 times** in the progression sample (at 300 runs); with the stand-in it never did.

## Content fixes found by reading fights

- **Howl never fired.** Retelling a boss fight showed the Grey Mother never howled. I'd given Howl a 9,999-tick cooldown to mean "once per fight", but every action starts the fight on cooldown, so it never came up. Under the design's rules, "once per fight" is a short cooldown plus a condition that reads the status it gives ("below half HP and not yet frenzied"). The boss was then too strong (the example party won 9%), so it went from 750 HP and 22 Attack to 650 and 20 (about 45%).
- **The feel check's reader found three gaps in the reading packs**, all fixed: they didn't show what each unit wears (so Thorns from the Yata Mirror looked unexplained); pulse and reaction lines had no time, so they read as part of the action above them; and "Won at tick N" rounded differently from event times. Its other notes are about presentation, for step 22 (the report lists the main ones). Its answers were to packs made before the Howl fix; `out/` isn't committed.

## Known gaps, for later steps

- **Revives** aren't built (the design defers them). Statuses can survive a KO, but nothing brings a unit back yet.
- **Lifesteal as a stat** can't be expressed as "heal Lifesteal% of the damage dealt": a number is base plus ratio × one source, so it can't multiply the event's amount by a stat. A status can heal a fixed share of damage dealt. If class design wants Lifesteal as a stat, a scale needs a second factor (a small schema and engine change).
- **Attack scaling an untyped pulse** (a Bleed from Attack) is allowed: the validator applies the type lock only to typed instances. The design's wording could be read either way.
- **The ladder** (`src/sim/content.ts`) scales max HP, Attack and Magic only; fine for the samples.
- **Speed** is fine for play and for studies of this size. Sweeping every party at volume (steps 13 to 16) will want parallel seeds.
- **Firefox's engine** is still untested.

## After sign-off (Oct 20)

The director signed off with three changes, built the same day:

- **Intensity ends below 1 stack.** `drop` and absorbs end a status when its total falls below 1,000 thousandths, and an application that would leave it below 1 stack doesn't create it. Absorbs soak whole stacks (they used to round up). The Burn test now pins [10, 5, 2, 1].
- **Default ability recovery:** `ruleset.abilityRecovery` (3 ticks in the worked example, a sword's 25% of 12). Tests that used abilities only as devices state `recovery: 0`; the timing examples were updated to the new default.
- **Typeless status damage.** Validator rules: a status's pulses and triggers deal type `none` (`pulse.type`); typeless damage can't scale from Attack or Magic (`instance.scaling`); nor can the stacks of a status that deals damage (`apply.scaling`). No engine change. The example's Rot is a flat 4.
- **Stacks scale as the applier states** (director's correction, after sign-off). `apply.scaling` is removed: an applier's stacks can read any stat, Attack and Magic included. Stacks still default to a flat 1, so no stat scales them unless the applier says so. Validator only; no run changes.
- `ENGINE_VERSION` 0.3. Full suite: 246 tests pass. Node and Bun agree over 10,000 runs (`5c4a907eebdfad4f`). The example party still wins about 40%, so no retune. Speed and study numbers above weren't re-measured.

## After sign-off: scaling reset (director, Oct 20, 2026)

- **No default scaling, no type locks.** Weapons must state `amount` (it was 1 × Attack or 1 × Magic by default); the worked example's five weapons that relied on the default now state it, so they hit the same. `instance.scaling` and `pulse.type` are gone: any stat can scale any instance, and a pulse can be typed as data.
- **Statuses are fixed at application.** The applier's boosts reach only the stacks an Intensity application adds, and only boosts naming the status or one of its tags (no longer its element or subtype). Non-Intensity statuses no longer carry the applier's boosts into their pulses or heals.
- **Refresh replaces** (duration, numbers and source) instead of keeping the stronger of each number.
- **Sources.** Refresh and Fizzle statuses now record their applier, like Per source copies, so they can use `to: source`, `of: source`, `actor: source` and `crit.fromSource`. A shared Intensity total can't (`scale.of`, `status.source`, `effect.to`). Pulse damage is still credited to its source only for Per source statuses, as before.
- `ENGINE_VERSION` 0.4. Worked example over 2,000 runs: 180 runs' logs differ, all from Bleed pulses losing an applier's boost (4 to 3), and no fight's result changes. The pinned run is unchanged after its header. Full suite: 246 tests pass; Node and Bun agree over 10,000 runs (`c16ce92cac3c6f41`).
