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
