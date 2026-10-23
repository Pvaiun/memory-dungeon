# Fixtures: placeholder content

Nothing in this folder is game design. These files exist to:

- prove the schema can express the game's rules,
- give the tests something to break,
- be the first input for the step 2 engine.

Every class, number, name, enemy and formula here is disposable. The worked example stays as the machinery's test fixture (schema 0.6, with `armorRatio: 1` so its numbers behave as they did): it's the one pack with perk picks, which the run, replay, resume and explorer tests need. The real content is the core set, generated into `content/core-set.pack.json` from `content/core-set/`.

`npm run examples` writes `by-type/`, with a few examples of each type pulled from `hollow.pack.json`. It's generated, so it isn't committed.
