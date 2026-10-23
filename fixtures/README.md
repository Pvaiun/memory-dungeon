# Fixtures: placeholder content

Nothing in this folder is game design. These files exist to:

- prove the schema can express the game's rules,
- give the tests something to break,
- be the first input for the step 2 engine.

Every class, number, name, enemy and formula here is disposable. The `design` block's numbers come from the concept spec, which was bullish on them, so treat those as placeholders too. Real content starts with the core set (`docs/core-set/`), once it's built, and is tuned by simulation.

`npm run examples` writes `by-type/`, with a few examples of each type pulled from `hollow.pack.json`. It's generated, so it isn't committed.
