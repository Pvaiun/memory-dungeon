# Core set build log

The trail for later sessions. The director doesn't read this; `report.md` is theirs.

The core set (`docs/core-set/`) is the approved design, so this work starts at the method's build-and-tune stage. The director's direction for this phase (Oct 23, 2026): implement all four documents in the repo's existing structure (schema, engine, validator, content, harness), functionally, with everything available and no progression; interface later. Simulate small subsets during development for correctness, then a small tuning pass to put first values in the ballpark; don't sweep every party at volume.

## Plan

1. Schema 0.6: the core set's building blocks (weapon kinds, three gear slots, armor weights, revive, summon, extra strikes, Seek, the Taunt and Hidden rules, Aegis, absorption, target-phrase extras). Verbs, traits and keyholes go: the core set's vocabulary replaces them. Perks stay in the tech, unused.
2. Engine changes, each with an arena test.
3. Validator and tooling.
4. Content as a generator (`content/core-set/`, TypeScript) that writes `content/core-set.pack.json`, so every "first value" is a named constant in one place and reskins are copies.
5. Harness: gear picking by kind and weight, studies on named trios and single encounters.
6. Smoke tests from the documents' own tests (each class's test fight, each enemy's beats/fails trio), then a short tuning pass, then the report.

## Numbers: first values

The documents' numbers are a relative scale. In the data every amount stat is stored at 1,000 per point (HP 2 is 2,000), as `docs/core-set/README.md` says. Stats counted in percent (Crit chance, Evasion, Accuracy, resistances, Lifesteal, Siphon, Double strike) are stored in percent points, since a percentage can't be ×1,000: a class's Crit n is 5n%. The conversion from the scale to working numbers (what a point of Attack does through a weapon, what a point of Armor takes off a hit, how long "short" is) lives in `content/core-set/scale.ts` as named constants. Armor's flat reduction per hit is `ruleset.armorRatio × Armor`, a ruleset knob, because a point of Armor can't be worth as much as a point of HP under a flat-per-hit rule.

## Choices where the documents are silent or the engine's defaults stand

(Filled in as the build goes; the report lists the ones the director should see.)

- **The worked example stays** (`fixtures/hollow.pack.json`), migrated to schema 0.6 with `armorRatio: 1`, as the machinery's test fixture: it's the one pack with perk picks, which the run, replay, resume and explorer tests need. Its three unarmed classes get a `gear.plain` warning, which its test expects.
- **Kept from step 4's engine, as the known gaps' defaults:** sub-ticks; the same-moment order (party batch first; pulses, reactions, actions in slot order); the three timing stats as hidden stats behind Haste, Slow and Chill (floors widened to −300 so Phalanx's "a third as often" fits); per-unit dice; a stated rule that finds nobody when it resolves fails with no MP spent and no cooldown; the 5,000-tick safety stop; rounding down once after mitigation, Aegis checked on the rounded amount, shields soaking whole points.
- **Built as the core set says, replacing step 4:** an action that can't pay its MP when it resolves fizzles and still goes on cooldown; the Taunt rule binds an action's first pick, stated rules included, unless it has Seek; Hidden units can't be picked by any rule but `all` (if every foe is Hidden, foes pick among them anyway, so nothing stalls: the engine's fallback); resistance past 100 heals by the excess and applies nothing; a knocked-out party unit joins later fights knocked out, so a revive can raise it.
- **Extra strikes** (Double strike, Arc) are one status field, `strike`: one more hit with the weapon's damage after a basic attack, of kind `extra`, which never chains and gets no basic-attack boosts (so Phalanx's triple damage doesn't reach a Double strike's second hit, as the gear document's trap says).
- **Lifesteal and Siphon** are statuses their stats bring, healing or draining a share of each hit through a scale that multiplies by a live stat (`times`). Siphon gives the holder the share whether or not the target had that much MP: a simplification.
- **Bloodlust, Shadow strike and Bedrock** toggle a second status on and off through reactions (below half HP, while Hidden, while a Shield holds), and "doubled" is a stat change that reads the holder's own stat once, at application.
- **Einherjar** is Valhalla's `ready: true`; the passive itself has no status, which the schema allows.
- **Enemy basic attacks** are set by their words alone (weak 500, normal 700, heavy 1,100, massive 1,600 per swing; the kind sets how often), not by Attack: with Attack 12 a boss's plain swing came out bigger than its Crush. Their Attack and Magic feed their abilities, as the enemies document says.
- **Reskins** (Snow Wolf, Troll, Mummy, Ice Ghost) are copies with a new id and name, generated from the original.
- **Formation effects** are a status every unit in the formation holds, reacting to the fight starting or an ally falling, applied to itself: "every ally gains" falls out of that.

## Tuning rounds

Budget: 8 rounds, then report. Each round: `npm run content` then `npm run smoke` (the documents' own beats/fails trios on every encounter and the "clears it" trios on every run, 20 seeds, fresh fights, starting kit, Neutral formation; about 2 seconds).

1. **First values as written.** Regular fights go the right way for the named trios; every boss is unwinnable (0%). Cause: enemy swings scaled from Attack, so the Ogre Chief's plain axe swing (6,300) matched its Crush. Change: enemy swings by word, Armor's ratio 0.12, Doom 3,500 (kills HP 3 and below, a Knight or Hoplite survives it), a few boss ability ratios set against party HP.
2. **Result:** Ogre Chief 45%, Reaper 100%, Silent One 95%, Fire Giant, Ice Titan, Storm Queen and Storm King 0 to 15%. Reading the Titan's log found a content bug: Bulwark's, BROKEN's and Doom's "when I end" reactions named no status, so they fired whenever any status ended on the holder (a Burn running out broke the Bulwark; a Poison expiring refilled it to 7, 9, 10 stacks). Fixed; the validator now warns on that pattern (`reaction.anyEnding`).
3. **Result:** Titan 50%, Queen 70%, King 55%, Chief 65%. Fire Giant still 0%: a Frostweaver at HP 2 dies to one boss swing (1,920 magical) plus a Brand. Change: heavy swing 1,000, massive 1,400, Brand 0.05, Tempest 0.06, Mend 0.6 (a priest's heal about a party's damage, so the Grave Watch is a mirror until the priest is stopped).
4. **Fire Giant over 12 seeds:** Inferno cast once at tick 35.5, landed 12 of 12, interrupted 0 of 12, nobody down before it. Shield bash and Inferno both on long cooldowns fire in lockstep, the bash five ticks before every wind-up: a deterministic miss. Applied the classes document's own fallback: Stuns (Shield bash, Pressure point, Tremor) on medium cooldown. Also made swing words absolute per swing (a wolf's bite at 180 was blanked outright by Armor 2, which no "fails" story expects): weak 500, normal 800, heavy 1,200, massive 1,600.
5. **Result:** run 1 by the ungeared starters fell to 10%, lost to attrition at Bandit Camp and Ogre Bridge. Change: normal 700, heavy 1,100, Regen 4% a pulse. Result: run 1 25%, the Chief 75% fresh; Fire Giant still 0% (Inferno still lands: the bash on medium cooldown lands at 16 and 35, the second a hair before the wind-up starts at 35.5). First harness study on the core set (`studies/core-set-starters.json`, 320 runs in 1.4 s) and five reading packs for a fresh reader.
6. **Snake Pit's story** ("Regen on every ally outruns the ticks") can't hold at HP 2: Regen 80 a pulse against Poison 120. Poison 90.
7. **Prayer never fired in a regular fight:** every action starts a fight on cooldown, "long" was 30 ticks and regular fights last about 30, so the starters' designed sustain was mostly absent and a boss's signature blow came once in 38 ticks. Change: cooldown words short 6, medium 12, long 22 (the ratios kept), Regen 16 ticks (8 pulses of 4%: a Prayer heals a third of everyone's max HP). Result: run 1 by the ungeared starters 55% with the party reaching the boss at 93% HP; Ice Pass 100% by its named trio, Crypt 90%, Storm King 60%, Ice Titan and Reaper as written.
8. **A Leech's "fast" bite hit like a Bandit's sword twice as often** once swings were absolute, which is why the Storm Tower trio died at the Wisp Nest. Tried a speed factor (fast 0.75, slow 1.4): the slow factor raised every Ogre's and boss's swing and pulled run 1 back to 35%. Kept fast 0.75 and slow 1.0. Budget spent; the final table is `smoke.md` beside this file.

## After the budget: two checks for the report, nothing kept

- **The slow factor** of round 8 was reverted (fast 0.75, medium and slow 1.0) and the final smoke table copied to `smoke.md`. Run 1 by the ungeared starters is back at 50%.
- **Variant: an interrupted cast goes on cooldown** (a one-line change in `interrupt()`, run and reverted). Fire Giant still 0%; the Chief's "fails" trio 65% → 100%, the Titan's 35% → 80%, the Storm King's beats trio 60% → 100%: Silence becomes a hard counter. In the report as decision A's evidence and gap E; not kept.
- **A generic best kit** (`npm run smoke -- --kit best`: per slot the piece scoring highest for the class, main stat first, then HP and Armor; it lands on Oathblade, Brigandine and Heartstone for nearly everyone). Every "fails" trio wins every regular fight; 5 of 7 runs at 100%; Fire Mine 0%, Storm Tower 25%. Table in `smoke-best-kit.md`. The Fire Giant is a numbers-and-rules problem, not a kit problem.
- **Feel check** on the harness study's five packs (`feel-answers.md` beside this file): the reader's three colour picks for the lost runs don't clear run 1 at 50% ungeared; its findings (empty opening ticks, the Raise retry loop, the Hoplite's promise, boss fights' shape, log wording) are in the report's section 4.
