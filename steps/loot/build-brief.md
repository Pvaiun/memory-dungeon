# The loot pass: the build's brief

Nov 11, 2026. For a fresh session. Gate 2 is passed: the director approved the fill and ruled on what was open (`intent.md`, *Direction from gate 2*). This is the third stage of the step: build it, measure it, and stop for the director, who plays it. Their read is the gate.

In this brief an **engine** is one of `builds.md`'s found synergies. What the game's code needs for an item is its **code support**.

## The task

Put the design into the game, so the rogue mode plays with it:
- **The rules that reach everything:** the two kit changes (Marked takes the party's random picks; the Hexer's Malison pays for breadth), Hidden's rule that someone stays in the light, the damping of a chain of shatters, and the six counters.
- **The code support** the items need: the 23 numbered items in `spine.md` (*Code support*), and each share's own list (*Code support beyond the spine's list*, at the end of every file in `fill/`).
- **The content:** 322 pieces, 35 formations and Neutral, the versions and mythics that change, and every kept item whose card or size a ruling changed. Today's loot goes: nothing earns a place by already existing.
- **The designer's tags** for the nine builds, and the build test's parties rewritten for them.
- **The documents,** made true to what's built.

Then measure it and write the report.

## What's settled

- **`docs/rules.md`, `docs/gear-design/` and `intent.md`,** all of them.
- **A card is the design.** Each entry in `fill/` is the spec for one item: its card, its stat steps, its numbers by the scale's words, and what its notes say happens at the edges. Build what the card says.
- **The rulings:** `fill/shared.md` for every share, round by round and then gate 2's; `fill/round-1.md` to `fill/round-3.md` share by share. Where an entry and a later ruling differ, the ruling wins and the entry is wrong: fix the entry.
- **Numbers are first values.** A size is the scale's word, and its constant goes in `content/core-set/scale.ts` by name. Nothing is tuned in this stage: the balance pass comes after the director has played it.
- **Offers aren't aimed** for the first playtest. The offer roll stays as it is.
- **The spine's counts** (the stock table) are the stock. `npx tsx steps/loot/fill-check.ts` and `npx tsx steps/loot/web-check.ts` stay the design's checks until the step closes.

## How to work

**1. The two kit changes first, on today's game.** `brief.md` asks that Marked and Malison each be measured against today's game with both versions' numbers. That can only be done before today's loot goes. Change one, run `npm run balance` and `npx tsx tools/build-test.ts` before and after, keep the two sheets' lines for the report, then the other.

**2. The rules and the code support, by one lead, not in parallel.** The primitives are shared, so two agents writing them at once write them twice.
- Confirm each item against `PRIMITIVES.md` and today's pieces before writing anything: the spine says "new" from today's cards, not from the schema, and several are today's shapes joined differently.
- Write the smallest thing many items share. An item that needs a primitive nobody else uses is a flag for the lead before it's code.
- Each rule that can change a fight bumps `ENGINE_VERSION`; each change to what content can say bumps the schema and regenerates `PRIMITIVES.md`.
- The engine's own rules hold: no clock, no `Math.random`, no inexact maths (`src/engine/guard.test.ts`).

**3. The content, a file at a time.** Once the code support is in, a share is mechanical, and shares can go to agents in parallel, each owning its own content file and nothing else.
- One brief for every agent, with the method and no worked item: an agent copies any example it's given. The entry in `fill/` is its spec.
- An agent that can't build a card as written reports it. It doesn't reword the card, resize it or build something near it.
- A share is done when `npx tsx tools/piece-check.ts` shows every one of its items firing, with no crash and no loop, and `npm run validate` and `npx tsx tools/gear-slots.ts` pass.

**4. Tags, parties and tools.**
- The `Build` names and every item's tags become the nine builds', from each entry's *Serves*.
- `tools/build-parties.ts` and `tools/build-test.ts` are rewritten for the nine: each build's routes and rungs from `builds.md`, wearing the new loot.
- `tools/rogue-parties.ts` names today's pieces. Its rosters are rewritten too, and the fights' knobs are calibrated again (`npm run rogue:calibrate`, then `npm run rogue:tune`), or the first playtest is played against knobs set for loot that's gone.
- The interface shows what the cards promise a player can see: the six counters as a number on the unit, a count that a piece keeps (Volley bow, Bell of the hour, Stormspear), and the fire Ember heart keeps.

**5. The documents.** When a thing is built, its document says so, in words, with no history:
- `docs/core-set/rules-and-vocabulary.md`: Hidden's rule, Marked, the new target phrases listed in `fill/shared.md`, the counters, a free cast, healing received, a crossing, and the stat-budget line that the content's check contradicts.
- `docs/core-set/classes.md`: Malison, the changed versions and mythics, and the Pyromancer's ritualist, who can't hold a staff and a lantern.
- `docs/gear-design/loot.md`: the rules the loot was made by, as they came out, and what's retired.
- `docs/code-map.md`, in the same commit as any file added, moved or split.

**6. Measure, and write the report.**
- `npx tsx tools/piece-check.ts`: every item does what its card says. This is the build's own gate: nothing goes to the director with a card that doesn't fire.
- `npx tsx tools/build-test.ts`: the nine builds side by side, by rung: rhythm, strength and what carries each.
- `npm run balance`: the sheet, after the numbers changed.
- Sample fights for the director to read or play: each road at its first step, and the engines the fresh read doubted (the riposte, the blood mage at half the share, the crescendo at two fifths, the shatter bell on a Paladin).
- The report leads with what the director has to decide, with both versions' numbers; then what was built and what changed from the fill; what the numbers say and how sure; and what to play first.

## Where the fresh read says to look

`fill/fresh-read-engines.md` worked every engine on paper. Its sums are the build's first predictions to check in a fight:
- **Nine engines meet in one kind of fight or with one more part.** The detonation, the opening again and two in the dark need a pack; the held charge needs a lone foe or a boss.
- **Three were ruled at gate 2** and now need to be seen: the blood mage, the crescendo and the riposte.
- **One chain was left as a far end:** Everflame lantern with Bellows wraps on a fast Monk, faster still under The forge's Heat or Tireless bell, where a lone boss's fire grows by itself with no cap. `piece-check` will call it a loop if it is one in play.
- **For the balance pass, not this stage:** Frost fist's power step (a shatter with every cast); the riders' sizes on slow kinds once The standard or Mimic wand puts them on a fast weapon; Heart of winter; Huntmaster's quiver at "ready again".

## What it will cost, and how to spend less

- **The fill cost about four and a half million tokens** across eight agents, and each fresh reader about half a million. The build is bigger than the fill.
- **Plan it as several sessions,** each ending committed and pushed with `handoff.md` and the Status true: the kit changes; the code support; the content, a slot at a time; the tags, parties and tools; the documents and the measuring. Only the last is the gate.
- **Search for an entry by name** rather than reading a share whole, and open a content file only for the kind being written.
- **If the code support runs long,** stop and tell the director which items cost most. A piece that needs a week of engine is a piece to reword or cut, and that's their call.

## Read first

- `CLAUDE.md`, `docs/primer.md`, `docs/rules.md`, `docs/code-map.md`.
- In this folder: `intent.md`, `handoff.md`, then `spine.md`'s *The rules* (the stock, the new words, the code support) and `fill/shared.md`.
- `PRIMITIVES.md`, before any code support.
- A share's file in `fill/`, when its content is being written.
