# Code map

Where the code is, so you can open the right file first. Every source file is listed below, and `tests/code-map.test.ts` fails when one is missing or gone. Each file's header comment says the rest.

**Keep it true.** Whenever you add, move, rename, split or delete a source file, or change what one is for, change its line here in the same commit. The test catches a missing or stale file; only you can catch a line that no longer says what the file does.

**The layout.**
- **`src/`** is the game: pure TypeScript that also runs in the browser (`tsconfig.core.json` rejects Node APIs there).
- **`tools/`** holds the Node command lines that measure it.
- **`content/core-set/`** is the core set, written as TypeScript; `npm run content` turns it into the pack (`content/core-set.pack.json`, generated: don't read it, search the sources).
- **`ui/`** is the interface.
- **A file and a folder of the same name** (`fight.ts` and `fight/`) are one module: the file is its public face, re-exporting the parts and listing them, and the folder holds the parts.
- **Tests** sit beside what they test, except the pack's own, in `tests/`.

## Where to start

| To change or check | Open |
| --- | --- |
| A combat rule: timing, targeting, damage, a status, an event | `src/engine/combat/fight/`, the part by its name |
| Units built from content, HP and MP carried between fights, campfires | `src/engine/combat/rules.ts` |
| A run's stages and decisions, the log, the dice | `src/engine/run.ts`, `log.ts`, `rng.ts` |
| A rogue run's rules: the map, offers, the shop, training, events | `src/rogue/`, the part by its name |
| What content can say | `src/schema/`, or its summary `PRIMITIVES.md` |
| Why a pack fails to validate | `src/validate/` (an issue's code names its check) |
| A class, enemy, piece, formation, upgrade, mythic or number | `content/core-set/` (every number is in `scale.ts`) |
| The simulated rogue player | `src/sim/rogue-ai.ts` |
| A tool's output | its file in `tools/` (the header says how to run it) |
| A screen | `ui/src/screens.ts` (free play), `ui/src/rogue/` (the rogue mode), `ui/src/battle/` (a fight) |

## Files

```
src/
  engine/                    the headless engine: the same seed plays the same fight everywhere
    run.ts                   a run as data: loading content, stages, decisions, advancing; ENGINE_VERSION
    log.ts                   the log a run writes: what a player sees, and the hidden numbers
    rng.ts                   seeded dice, sliced by what they're for
    explore.ts               plays one seed down every combination of answers
    testkit.ts               test helpers: the worked example and test-only rules
    guard.test.ts            no clock, Math.random or inexact maths anywhere in the engine
    run.test.ts, rng.test.ts, explore.test.ts   tests of the run machinery
    combat/
      rules.ts               the battle system as Rules: units from content, HP and MP carried, campfires, loot
      stats.ts               stat and timing maths: final values, speeds, rescaling
      fight.ts               the fight's public face, and its order of play
      fight/                 the fight, one file a part
        state.ts             the fight's data, the world (W), shared helpers, stats after statuses, numbers
        actions.ts           abilities as actions: their changes, costs, availability, start, resolution, extra strikes
        targeting.ts         picks: draw, Taunt, Hidden, Seek, focus, target rules, conditions, seats
        effects.ts           every effect op but damage and healing: targets, numbers, cooldowns, HP prices, revives
        damage.ts            damage and healing: the resolution order, evasion, crits, Shield, Aegis, floors, cover
        statuses.ts          applying, ending, removing, moving and pulsing statuses; control resistance; lockouts
        events.ts            events, their filters, reactions and Intensity triggers
        units.ts             knockouts, the fight's end, revives, summons and splits
        clock.ts             the next moment, the enrage, the fight's start, each step
      arena.ts               test helper: one fight from units and statuses written inline
      flow.test.ts           tests: fight flow, timing, sub-tick order, actions, targeting, knockouts
      damage.test.ts         tests: stats, damage, healing, shields
      statuses.test.ts       tests: statuses, reactions, what the player sees
      synergy-h.test.ts      tests: the building blocks for what happens (PRIMITIVES.md)
      synergy-w.test.ts      tests: the building blocks for who and when
      coreset.test.ts        tests: the core set's own rules (Taunt and Hidden, Seek, revive, summons)
      dungeon.test.ts        tests: a run's rules (foes modifier, lost casts, stagger, enrage, Stun, campfires)
  rogue.ts                   the rogue mode's public face; lists its parts
  rogue/                     the rogue mode: a run as data, moved on one decision at a time
    state.ts                 the run's data (RogueRun, Member, Offer, Pending), shared helpers, the meta
    fights.ts                the run's items as content, the party a fight takes, starting and ending a fight, knobs, foes
    acts.ts                  a new run (leader, draft, known abilities); each act's map and rooms
    offers.ts                the stock and every offer: gear, mythics, tomes, recruits, formations, supplies, prices, the shop
    training.ts              learning abilities; power steps and versions
    party.ts                 free actions between rooms: gear, formation, seats, order, swaps, supplies
    decisions.ts             what the pending decision offers, and choose()
    rooms.ts                 entering a room, a campfire, the next region, an event's effects
    record.ts                a run's record for balancing: every choice and free action (interface runs only)
    rogue.test.ts, record.test.ts   tests
  schema.ts                  the content schema's public face; lists its parts
  schema/                    the schema (zod), one file a part, each building on those above it
    primitives.ts            ids, text, numbers, the sub-tick; the closed sets (each needs engine code)
    numbers.ts               numbers and how they scale, conditions, unit tests, targeting rules
    effects.ts               the effects actions, pulses and reactions are made of
    statuses.ts              statuses: duration, stacking, pulses, triggers, reactions, stat changes, lockouts
    actions.ts               weapon kinds, basic attacks and abilities
    ruleset.ts               the design block, the ruleset, the stat registry
    content.ts               classes, gear, formations, enemies, perks, dungeons, stages, challenges
    rogue.ts                 the rogue block, and the upgrades
    pack.ts                  the content pack, a party loadout, the inferred types
  validate.ts                the validator's public face; lists its parts
  validate/
    core.ts                  validatePack (runs every check), the report, the id index, references, the design block
    combat.ts                the combat rule language: numbers, conditions, targeting, effects, statuses, actions
    content.ts               classes, upgrades, gear, formations, enemies, perks
    dungeons.ts              dungeons, loot, challenges, the starter, progression, the rogue block, totals, unused entries
    party.ts                 party loadouts, challenge constraints, canEquip, handsOf
  sim/                       the simulation library (the interface uses content.ts and parties.ts)
    content.ts               content with patches (variants), and single fights as one-stage dungeons
    parties.ts               parties: building and listing them, plain weapons, what fits a slot
    kits.ts                  sensible kits from the pack by class profile, seating, ability order
    rogue-ai.ts              the simulated rogue player, with dials
    study.ts                 a study: the data file that says what to run
    combat.ts                a study's combat level: many parties against dungeons and fights
    measure.ts               probes watching each fight's HP, MP and pace
    feel.ts                  feel checks: runs worth reading, replayed with logs
    sure.ts                  how sure: ranges for rates, comparisons over seed blocks
    report.ts                what a study prints
    sim.test.ts              tests of the harness
tools/                       the Node command lines; each header says how to run it
  balance.ts                 npm run balance: the balance sheet (its pool and main)
  balance/
    plays.ts                 what it plays: the fight sets, the spread of parties, the probes' parties
    tally.ts                 playing a run and reading its log into the tally
    sheet.ts                 the bands and their reasons; each set's sheet
    probes.ts                the gear and formation probes' numbers
    write.ts                 the sheet as markdown
  rogue-sim.ts               npm run rogue: whole runs by the simulated player; its pool serves the other rogue tools
  rogue-calibrate.ts         npm run rogue:calibrate: each fight's knob against the hand-built rosters
  rogue-tune.ts              npm run rogue:tune: run-level tuning on top of the calibration
  rogue-parties.ts           the hand-built rosters the calibration measures against
  rogue-legendaries.ts       npm run rogue:legendaries: what each legendary piece's rule is worth
  rogue-bosses.ts            how bosses fight in runs: casts, interrupts, held wind-ups
  rogue-acts.ts              the act road and the MP economy, on the rosters
  rogue-feel.ts              fight logs for a feel read (the reader's brief: docs/feel-reader.md)
  rogue-play.ts              the rogue mode as a command line, for an AI playtester
  play-summary.ts            a fight as a player remembers it, for rogue-play
  build-test.ts              the twelve builds side by side
  build-parties.ts           the builds' hand-built parties, gathered (ROUTES, BUILD_PARTIES, ALL_PARTIES)
  build-parties/
    kit.ts                   their types, the builds' names, formation seats, mythics, and the helpers routes are written with
    landslide.ts, cuts.ts, bonfire.ts, snap.ts, hunt.ts, harvest.ts   one build each: its three routes at three rungs
    ambush.ts, overflow.ts, lockdown.ts, toll.ts, pact.ts, phoenix.ts   one build each
  rhythm-read.ts             does a party play the fight its build says it does?
  piece-check.ts             does every item do what its card says?
  gear-slots.ts              the gear slots' counts: who wears which kinds
  smoke.ts                   npm run smoke: the documents' own test trios
  dungeon.ts                 npm run dungeon: print one run
  study.ts                   npm run study: run a combat study
  validate-pack.ts           npm run validate: check a pack, and a party against it
  primitives-doc.ts          npm run docs: writes PRIMITIVES.md
  export-json-schema.ts      npm run build:schema: writes schema/*.json
  extract-examples.ts        npm run examples: one worked example of each type, into fixtures/by-type/
content/
  core-set/                  the core set as TypeScript; npm run content writes the pack
    scale.ts                 every first value by name: the documents' words as numbers
    vocabulary.ts            stats, weapon kinds, armor types, offhand kinds, the ruleset, the design block, core statuses
    classes.ts               the 16 classes: stats, passives, abilities
    enemies.ts               the 29 enemies, their adds and reskins
    dungeons.ts              the encounters, and free play's 7 dungeons
    formations.ts            Neutral and the 32 formations
    gear.ts                  the 11 plain weapons
    rogue.ts                 the rogue mode's numbers, regions and events
    rogue-knobs.json         each rogue fight's knob (written by npm run rogue:calibrate)
    tests.ts                 the documents' own test trios, for npm run smoke
    pack.ts                  assembles the pack
    build.ts                 npm run content: validates and writes the pack
    pieces/                  the 240 pieces
      kit.ts                 the helpers pieces, formations and upgrades are written with
      shared.ts              statuses several files use (Marked and its counters)
      weapons-physical.ts    the six striking kinds' 48 pieces (dagger, fist, sword, spear, bow, great weapon): full swings
      weapons-focus.ts       the five focus kinds' 40 pieces (rune sword, mace, wand, rod, staff): lighter swings, Attack on every piece
      armor-amulets.ts       the four armor types' 48 pieces and the 24 amulets
      offhands.ts            the ten offhand kinds' 80 pieces
      index.ts               every item gathered, for the pack and the tools
    upgrades/                each ability's and passive's power step and two versions, and the mythics
      index.ts               gathers them, in order
      kit.ts                 the helpers every class's file writes its upgrades with: one form(v, k, plus) gives all five forms and their cards
      knight.ts, cleric.ts, ranger.ts, bramble-knight.ts, hoplite.ts, paladin.ts, valkyrie.ts, bard.ts   one class each
      hexer.ts, monk.ts, assassin.ts, vampire.ts, pyromancer.ts, frostweaver.ts, stormcaller.ts, geomancer.ts   one class each
      mythics.ts             the 16 mythics, one per class
  parties/
    starters.json            the starter trio, for npm run dungeon
ui/
  src/                       the interface (ui/README.md)
    main.ts                  start-up, and the console hooks for scripted checks
    content.ts               the pack as the interface shows it: names, single fights, the number scale
    state.ts                 free play's setup and the settings, saved
    mode.ts                  free play or the rogue mode, saved
    screens.ts               the menus and free play's screens; go() switches screens
    sheet.ts                 unit sheets: a class or an enemy, its stats, abilities and gear
    describe.ts              plain-language descriptions of abilities, effects and statuses
    bestiary.ts              the bestiary's record: enemies met and looked at
    dom.ts                   DOM helpers: h(), windows, rows, buttons, the back gesture
    art.ts                   art tables: which sprite, icon or look shows what
    pixel.ts                 graphics: the pixel scale, sprites, icons, the font
    update.ts                reloading onto a newer build
    rogue-screens.ts         the rogue screens' public face; lists them
    rogue/
      parts.ts               the navigation, small parts and scenes the rogue screens share
      run.ts                 the dispatcher, the leader, the draft, the map, a fight in waiting
      rooms.ts               spoils, a captive, the shop and training, the campfire, events, choices, Muster and Drill, level up, the next region
      end.ts                 the run's end, its record, a won run's moment
      party.ts               managing the party: seats, a unit's sheet and order, its gear
      state.ts               the run and the rogue meta, saved
    battle/
      battle.ts              the battle screen: the field, messages, the party, controls, a fight's end
      driver.ts              steps the engine one moment at a time for the screen
      narrate.ts             turns the log into messages
      scene.ts               the field, backdrops, the campfire, the menus' stages and party strip
      audio.ts               sound effects and music
  tools/
    assets.py                builds ui/public/assets/ from the director's art packs
tests/                       the pack's own tests
  content.test.ts            the committed pack matches its sources; the tools' party files are valid
  json-schema.test.ts        the exported JSON schema accepts and rejects what the zod schema does
  validate.test.ts           the validator, check by check, on the worked example
  code-map.test.ts           this map lists every source file, and nothing that's gone
```
