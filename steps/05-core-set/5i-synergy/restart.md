# Step 5i restart: the brief for a fresh session

Written Oct 29, 2026, by the sessions that wrote the gap map, the first design, the philosophy and the slots. It's for a fresh session picking the step up at **step 3 of the restart: the builds and the web between them**. Where this brief and the director's words in `intent.md` differ, `intent.md` wins.

## Where it stands

- **The first design is superseded** (`design.md`, kept as the record). The director rejected its approach in their notes of Oct 29: it set rules and fitted pieces to them, each build doubled down on one keyword, and its branches were one line with an offshoot.
- **The gap map stands** (`gap-map.md`): every mechanic's enablers, payoffs and answers, from the content.
- **The restart's order, agreed with the director:**
  1. a one-page philosophy (**done and approved**, `philosophy.md`);
  2. the slots (**done**, `slots.md`, its Outcome section);
  3. about a dozen builds and the web between them (**next**);
  4. the pieces, formations and upgrades, built backwards from the builds.

  Each stage ends at the director's gate.

## Read first

- `CLAUDE.md`, `docs/method.md`, and `DECISIONS.md` (Step 5).
- In this folder:
  - **`philosophy.md`**: the direction. Judge every build against it.
  - **`slots.md`**: read its **Outcome** section; the rest is how it was reached.
  - **`intent.md`**: all the director's words. The sections dated Oct 29 matter most.
  - **`gap-map.md`**: what the game has, and where it's thin or empty.
  - `design.md`: read only its top note, to see what was rejected and why. Don't start from its list of builds.
  - `kickoff.md`: its **Decided** list, its **boundary with 5h** and its **Tools** still stand. Its starting direction (enablers and payoffs, grains, strong in the right party as rules) and its gate's sample sizes don't.
- **The game the builds are made of:**
  - `docs/core-set/classes.md` and `content/core-set/classes.ts`: every class's kit, passive, stats and weapon kinds;
  - `docs/core-set/rules-and-vocabulary.md`: statuses, special stats, effects, targeting, elements and their themes, damage kinds;
  - `docs/core-set/enemies-encounters-and-dungeons.md` and `content/core-set/rogue.ts` (its regions): what the rogue throws at a party (`gap-map.md` section 11 sums it up);
  - `PRIMITIVES.md`: what the engine can already do, listen for and aim at.
- **5h's design,** on the roster branch: `git fetch origin ccr-9cf44321-t2g2o5`, then `git show origin/ccr-9cf44321-t2g2o5:steps/05-core-set/5h-roster/design.md`. The roster, the bench, MP drained by fighting and the reward plan are the game the builds live in.

## Decided so far, beyond `philosophy.md`

- **The slots (step 2, Oct 29):** four a unit.
  - A weapon by kind, as today.
  - A new offhand, in shared kinds of two or three classes.
  - Armor locked by type: three or four types, and a second type for certain classes, as the builds say.
  - An amulet for anyone.
  - A **mythic** rarity above legendary, in any slot, made for one class. Every class has at least a couple, in the slots where it needs them; how many is whatever its builds call for.

  The structure follows the content: where pieces come from gets reshaped after the builds.
- **Loot starts from scratch.** No piece from today's game is kept for existing. The core set's 14 powerful pieces are assessed like anything else.
- **Rarity** is mostly specificity, plus power that grows with the acts and stays narrow. No random affixes on rare, legendary or mythic pieces for now.
- **Formation rarities:** common, rare, legendary. What they mean follows the philosophy, not the first design's limits.
- **Upgrades:** each ability and passive gets one plain power step and one choice between two versions designed for it. What counts is how the two versions differ from each other. Targeting can be part of a version, or become its own kind of upgrade later.
- **What a card shows:** "fits" (who can wear it). It never says what a piece is "for". The hidden `aims` that drops use can stay as designer data.
- **The engine** gets as many additions as the designs need. They're listed when the designs call for them, not budgeted ahead.
- **5h** goes ahead as designed. Once both steps land, the rest is readjusted around them (the director's word).
- **Depth before width:** about a dozen builds fully served first, then widen.
- **How to write guidance, briefs and prompts for agents: intent and ranges, never examples.** The director: "You will simply get the examples that you listed for sure, verbatim". The same goes for anything you hand a subagent.

## Step 3: the builds and the web between them

**The task:** design about a dozen builds as ways to play, and the web that connects them, for the director to read. Write them in `builds.md` in this folder.

**For each build, say:**
- **Its identity:** what someone watching a fight sees, and what the build is waiting for.
- **Its rhythm:** where it sits in the rhythm space `philosophy.md` describes.
- **Its threads:** what it's woven from. Anything in `gap-map.md` can be a thread, including rows the map marks thin, empty or set aside (the director disagreed with several of its "can't carry a build" rows, `intent.md`, Oct 29), and the run-level resources 5h adds.
- **Its routes:** the classes that can carry it, in more than one combination, and the shape of formation it wants. These routes become step 4's hand-built test parties.
- **What it asks of a run:** where it starts from what most runs find, and what it pays at each point up to its most specific, most potent version.
- **What it needs** from pieces, formations, upgrades and mythics, stated as needs, not designs.
- **Engine additions** it would need, listed.

**The web:**
- the threads and needs that builds share, and how much each one matters to each build;
- where a run could drift from one build into another, or land on one nobody planned.

**What the builds say about the slots:**
- which classes should share an offhand kind;
- how many armor types, and which classes wear a second;
- where each class needs its mythics.

**Checks on the whole set, not quotas:**
- the rhythms spread across the space;
- every class is in some builds, with routes into more than one;
- elements work as themes, not only as their statuses;
- builds that share an element or a mechanic feel nothing alike;
- no two builds differ only by the damage type on the numbers.

**Out of step 3:** the pieces, formations and upgrades themselves (step 4), numbers, and building anything. A quick fight read with today's classes is fine where it can show a rhythm claim is real.

**How to write it:** plain, with decisions and open questions first. Give each build the length it needs. Show the builds you're least sure of, not only the best.

**Gate:** the director reads the builds and the web. Record their words verbatim in `intent.md`, update `CLAUDE.md`'s Status, commit, push, and stop.

## Working with the director

- Short, plain write-ups that lead with what needs them.
- Push back with reasons.
- Their words go into `intent.md` verbatim, every round.
- **Their notes contain illustrations,** made up on the spot to show a way of thinking ("I'm just bullshitting", "don't build this necessarily"). Read them for the intent behind them, not as builds to make.

## Branch

The work so far is on `ccr-4627f784-xi1ax2` (steps 1 and 2 were first on `ccr-6b775879-umgh32`). If the session runs on another branch:
- bring this folder over with `git fetch origin ccr-4627f784-xi1ax2 && git checkout origin/ccr-4627f784-xi1ax2 -- steps/05-core-set/5i-synergy`;
- copy the Status lines for "No control in fights", 5h and 5i from that branch's `CLAUDE.md` into yours, so a later merge stays clean.
