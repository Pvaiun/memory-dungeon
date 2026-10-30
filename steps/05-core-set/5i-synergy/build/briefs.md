# Wave 2: what every share works from

Oct 30, 2026. Every share of the build's second wave reads this page beside its own prompt. It gives intent and ranges, never examples (the director: "You will simply get the examples that you listed for sure, verbatim").

## Read first

1. `CLAUDE.md`, then `steps/05-core-set/5i-synergy/pieces-build-brief.md` (the task) and `build/plan.md` (the plan, the run layer's contract, the shares).
2. `intent.md` (the director's standing intent) and `fill-rulings.md`, all of it: its rulings win where they differ from the fill, and its third round is the director's word, which wins over the first two.
3. `build/engine-spec.md`: the engine additions, numbered X1 onward, with their schema shapes, already in `src/schema.ts` (schema 0.8). That is the contract between the engine shares and the content shares.
4. Your share's own sources (your prompt names them), and `spine.md` for everything else, so nothing you write repeats an item of another share.
5. `PRIMITIVES.md` (the engine's building blocks), `content/core-set/scale.ts` (every number's word), `content/core-set/pieces/kit.ts` (the helpers every content share writes with) and `content/core-set/pieces/shared.ts` (Marked and the seven counters, defined once: use them, don't redefine them).

## Rules every share keeps

- **The design is approved and complete.** Build it as written; don't redesign. Where the fill and a ruling differ, the ruling wins; where the third round undid a cut, the item is back at the spine's line or the fill's first number.
- **Statuses are universal.** No item applies a status for less or more than its own length (never set `duration` on an `apply`). Control resistance on bosses is the one exception, and it's the engine's, not an item's.
- **No balancing.** Every number as the fill gives it. Synergies may be overpowered. Don't add caps, rate limits or once-a-fight limits the design withdrew. Where the fill leaves a number open, pick it inside `fill-brief.md`'s ranges and list it.
- **Fix only what doesn't work,** and list it: a crash, a loop, an effect that does nothing or the opposite of its card.
- **Cards** say what an item does and who it affects, in the game's words, plainly enough that the player knows what will happen. A card never says what an item is for or names a build. A piece's `text` is its effect only: the interface shows its kind and who can wear it.
- **Ids** from names (`idOf` in `kit.ts`): lower case, apostrophes dropped, every other run of non-letters and non-digits an underscore. A piece's own statuses take its id, or its id with a short suffix. Upgrade forms are `<ability or passive id>__p`, `__a`, `__b`, `__ap`, `__bp`.
- **Designer data** stays out of the pack: each content share exports `builds` (`Builds` in `kit.ts`), the builds and rungs each item serves and its worth there, from the fill's **Builds** lines.
- **The engine** never uses the clock, `Math.random` or inexact maths (`src/engine/guard.test.ts`), and game logic stays pure TypeScript with no Node APIs.

## Working in parallel

- You work in your own worktree, on your own files. Touch shared files (`src/schema.ts`, `src/engine/`, `content/core-set/pack.ts`, `src/rogue.ts`, `ui/src/`) only where your prompt says your share owns them. If you need a change in a file you don't own, write it down in your report instead.
- The engine shares are building the additions while the content shares write content against their shapes. In a content share's worktree the schema accepts the new fields but the engine doesn't act on them yet: write them as the spec says, keep validation green, and leave behaviour to wave 3, when each content share checks its items against the merged engine.
- If `node_modules` is missing in your worktree, symlink it: `ln -s /home/user/memory-dungeon/node_modules node_modules`.
- The machine has four cores and about ten agents share it. Run single test files while you work (`npx vitest run <file>`), and the full suite once before you commit: `npm test`, `npm run typecheck`, `npm run validate`, `npm run smoke`, and `npm run content` when you change content (the pack JSON is committed and a test checks it matches).
- Commit in your worktree with a clear message ending with the lines `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_01Tm7VkWgyHf9dDfvQArS3yu`. Don't push; the lead merges.

## When you're done

Report back in under 400 words: what you built (counts), every change from the fill and why (only fixes for what didn't work, and the numbers you had to pick), what you need from another share, what you're least sure of, and your commit id and branch name.
