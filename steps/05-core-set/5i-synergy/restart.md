# Step 5i restart: the brief for a fresh session

Written Oct 29, 2026, by the session that wrote the gap map, the first design and the philosophy. It's for a fresh session picking the step up at step 2 of the restart. Where this brief and the director's words in `intent.md` differ, `intent.md` wins.

## Where it stands

- **The first design is superseded** (`design.md`, kept as the record). The director rejected its approach in their notes of Oct 29: it set rules and fitted pieces to them, each build doubled down on one keyword, and its branches were one line with an offshoot.
- **The gap map stands** (`gap-map.md`): every mechanic's enablers, payoffs and answers, from the content.
- **The restart's order, agreed with the director:**
  1. a one-page philosophy (**done and approved**, `philosophy.md`);
  2. the slots: two or three structures to pick from (**next**);
  3. about a dozen builds and the web between them;
  4. the pieces, formations and upgrades, built backwards from the builds.

  Each stage ends at the director's gate, with a sample where there's content.

## Read first

- `CLAUDE.md`, `docs/method.md`, and `DECISIONS.md` (Step 5).
- In this folder:
  - **`philosophy.md`**: the direction. Judge everything against it.
  - **`intent.md`**: all the director's words. The three sections dated Oct 29 matter most.
  - **`gap-map.md`**: what the game has.
  - `design.md`: read only its top note, to see what was rejected and why.
  - `kickoff.md`: its **Decided** list, its **boundary with 5h** and its **Tools** still stand. Its starting direction (enablers and payoffs, grains, strong in the right party as rules) and its gate's sample sizes don't.
- **Today's slot rules:**
  - `docs/core-set/rules-and-vocabulary.md` (the Weapons table and the Gear section);
  - `docs/core-set/gear-and-formation-lists.md`;
  - `content/core-set/gear.ts` and `content/core-set/rogue.ts`;
  - `canEquip` in `src/validate.ts`;
  - the gear and equip code in `src/rogue.ts`;
  - `Slot` and `Weight` in `src/schema.ts`.
- **5h's design,** on the roster branch: `git fetch origin ccr-9cf44321-t2g2o5`, then `git show origin/ccr-9cf44321-t2g2o5:steps/05-core-set/5h-roster/design.md`. Its reward plan was worked out from three slots a unit.

## Decided so far, beyond `philosophy.md`

- **Loot starts from scratch.** No piece from today's game is kept for existing. The core set's 14 powerful pieces are assessed like anything else.
- **Rarity** is mostly specificity, plus power that grows with the acts and stays narrow. No random affixes on rare and legendary pieces for now.
- **Formation rarities:** common, rare, legendary. What they mean follows the philosophy, not the first design's limits.
- **Upgrades:** each ability and passive gets one plain power step and one choice between two versions designed for it. What counts is how the two versions differ from each other. Targeting can be part of a version, or become its own kind of upgrade later.
- **What a card shows:** "fits" (who can wear it). It never says what a piece is "for". The hidden `aims` that drops use can stay as designer data.
- **The engine** gets as many additions as the designs need. They're listed when the designs call for them, not budgeted ahead.
- **5h** goes ahead as designed. Once both steps land, the rest is readjusted around them (the director's word). A slot change will move 5h's reward numbers, and that's accepted.
- **Depth before width:** about a dozen builds fully served first, then widen.
- **How to write guidance, briefs and prompts for agents: intent and ranges, never examples.** The director: "You will simply get the examples that you listed for sure, verbatim". The same goes for anything you hand a subagent.

## Step 2: the slots

**The task:** bring two or three slot structures for the director to pick from, and recommend one.

**Starting points:**
- the director's ideas and questions in `intent.md`, from their notes and answers of Oct 29: an offhand themed by class, whether offhands are shared or class-only, armor locked to one or two types, amulets and rings apart, and why a rare ring shouldn't just be a worse rare amulet;
- what a structure has to give, in `philosophy.md` (Slots).

**For each structure, say:**
- what each slot is for, and who can use what: the exclusivity that lets strong pieces be kept apart;
- how rewards read: can a player tell at a glance whether a piece suits this run;
- what choices it creates within a unit and across the party, and what it does to the player's load (the director: three slots is fine, "there's room for a little bit more in the brain");
- what it does to today's classes (weapon kinds, armor weights) and anything it reassigns;
- what it costs: seats a roster against 5h's numbers, the interface's party and gear screens, the content to write, the schema and the engine.

**Out of step 2:** the pieces (step 4) and the builds (step 3). Keep it short and plain, decisions first.

**Gate:** the director picks a structure. Record their words verbatim in `intent.md`, update `CLAUDE.md`'s Status, commit, push, and stop.

## Working with the director

- Short, plain write-ups that lead with what needs them.
- Push back with reasons.
- Their words go into `intent.md` verbatim, every round.

## Branch

The work so far is on `ccr-6b775879-umgh32`. If the session runs on another branch:
- bring this folder over with `git fetch origin ccr-6b775879-umgh32 && git checkout origin/ccr-6b775879-umgh32 -- steps/05-core-set/5i-synergy`;
- copy the Status lines for "No control in fights", 5h and 5i from that branch's `CLAUDE.md` into yours, so a later merge stays clean.
