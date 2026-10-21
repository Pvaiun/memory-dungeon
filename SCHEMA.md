# Step 1: content schema (historical)

**This is not design. Don't build from it.**

Step 1 (Oct 15, 2026) came before the method and before any real design. It produced a first data format and a placeholder dungeon, so the engine and harness had something to run. It was starting context and nothing more. Its combat model (rules and actives, behaviours, `damage_dealt`/`damage_taken`, GUARD, `self`/`others` statuses and the rest) was thrown out at step 4. The old write-up confused readers into thinking that was the game, so it's been cut. It's still in git history if anyone needs it.

## Where the real design is

- **Combat:** `steps/04-combat-concepts/design.md`, the director's design, with `DECISIONS.md` winning where they differ.
- **Content building blocks:** `PRIMITIVES.md` and `src/schema.ts` (schema 0.4).
- **What's decided:** `DECISIONS.md`. Its step 1 section lists the few ideas from this step that still stand (units are a class plus a specialization, no battlefield geometry, SaGa-style formations, enemies as a plain list, keyholes as predictions, verbs as vocabulary only). Later steps start from those ideas; they aren't worked-out designs.
- **Placeholders:** everything in `fixtures/` and the schema's `design` block numbers.
