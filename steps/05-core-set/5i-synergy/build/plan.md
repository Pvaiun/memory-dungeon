# Step 5i, step 5: the build plan

Oct 30, 2026. The lead's plan for `../pieces-build-brief.md`. The design is approved and complete (`../spine.md`, `../fill/`, `../fill-rulings.md`, whose third round is the director's word). This step builds it, measures all twelve builds together, and stops at the gate. No balance pass: one correction for anything wildly off, no iteration.

## What gets built

1. **The engine additions,** costed first (`engine-spec.md`), each with its tests, `ENGINE_VERSION` bumped. Plus the brief's control resistance on bosses.
2. **The content:** 240 pieces (60 a rarity), 32 formations and Neutral, 64 upgrades (a power step and two versions each, for 48 abilities and 16 passives), 16 mythics. In the fill's words and numbers, the rulings winning.
3. **The loot:** the old loot retired (the 85 core-set pieces but the 11 plain weapons, the old formations but Neutral, the rogue's legendaries and affixes); offers that pick a slot first, then a class, then a kind it wears; fixed pieces with no affixes; a third more gear; mythics in act II and III boss boons; formations by rarity; training as learn, power step or version, three trainings an opportunity.
4. **The interface:** the training screen's power step and two versions; cards with who can wear a piece; the mythic colour; Marked's icon (a stand-in until the director's art arrives); RESISTED and IMMUNE for control resistance; icons for the new counters (stand-ins from the packs).
5. **The test:** hand-built parties for every route of every build at its three rungs, Neutral and formation versions, on one set of the rogue's fights with fixed seeds. The rhythm read, the strength table, which pieces carry each build and which never matter, a feel read. Then the report.

## The run layer's contract (fixed now, so every share can start)

- **A piece is fixed:** `Gear.rarity` (common, uncommon, rare, legendary, mythic) is the piece's own. No affixes at any rarity. The 11 plain weapons stay outside the stock as starters.
- **Formations carry their rarity:** `Formation.rarity` (common, rare, legendary; Neutral common). The config's provisional `formationRarity` goes.
- **Upgrades are content:** the pack's `upgrades` list, one entry for each of the 64, naming the ability or passive status it upgrades, its class, the power step's text, and versions A and B (name, text). Its five forms are content under fixed ids: `<id>__p` (the power step), `<id>__a`, `<id>__b` (a version), `<id>__ap`, `<id>__bp` (a version with the power step). For an ability each form is an ability; for a passive, a status that takes the passive's place. Today's generic "+" rule goes.
- **A member's training** is kept apart from what it knows: `known` and `order` stay base ability ids, and `trained` records, for each ability or passive, whether it has the power step and which version (A or B), if any. The engine party gets the forms' ids; `PartyUnit.passive` names the passive form's status when it's trained.
- **A training** is one of: learn an ability, take an ability's or the passive's power step, or take its version A or B. Every training opportunity gives three, each to a different member, as the campfire's TRAIN does today: the campfire, the training events and lessons. A new act's "everyone learns one" and the shop's paid training stay as they are.
- **Designer data stays out of the pack:** each content share exports which builds and rungs each of its items serves (`PIECE_BUILDS`), for aiming drops and for the test. Never shown.

## The shares

Each agent gets intent and ranges, never examples, and the other shares' item names so nothing repeats (a method note from the fill). Each works in its own worktree and commits green; the lead merges and reruns the checks.

**Wave 1** (in parallel):
- **Spec:** the engine additions gathered and costed, with their schema shapes and the run layer's, and the schema written (shapes only, no engine behaviour), so the engine and content shares work from one contract.
- **Retire:** the old loot out of the pack, the rogue, the retired campaign and free play, every check green.
- **Parties:** the test parties as data: every build's routes at three rungs, from `builds.md` and the spine's web.

**Wave 2** (in parallel, from the spec and the retired base):
- **Engine, two shares** split by what they touch: who and when (events, conditions, targeting, numbers, Marked, seats, control resistance) and what happens (cooldowns, costs, crits, strikes, blocks and floors, heals, the fallen, recasts, after a won fight, mythics by name).
- **Content, seven shares,** one for each fill file: the physical weapons, the magical weapons, armor and amulets, the offhands, the formations, the first eight classes' upgrades and mythics, the second eight's.
- **Loot and training,** the run layer.
- **Interface.**

**Wave 3:** the engine merged; each content share checks its items against the engine (a piece-check tool plays each item and confirms it does what its card says); fixes.

**Wave 4:** the test, the one correction, the report.

## Rules every share keeps

- Statuses are universal: no piece applies a status for less or more than its own length. Control resistance on bosses is the one exception.
- No balancing: every number as designed. Synergies may be overpowered. Fix what doesn't work (a crash, a loop, an effect that does nothing or the opposite of its card); report everything else.
- The engine never uses the clock, `Math.random` or inexact maths; game logic stays pure TypeScript.
- Tests, typecheck, validation and smoke green at every commit. The full test suite takes about three minutes on this machine's four cores, so shares run their own test files while working and the full suite before committing.
