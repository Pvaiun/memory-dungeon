# The loot pass: handoff, built

Nov 11, 2026. The design is approved (gates 1 and 2) and built. Nothing is running, and nothing is scheduled. The director's play of the build is the gate. A fresh session starts from this page, then reads `build-report.md`.

## Where it stands

- **Built:** the 322 pieces in six shares (`content/core-set/pieces/`), the 35 formations (`content/core-set/formations/`), the versions and mythics that change (`content/core-set/upgrades/`), and both kit changes (Marked in the vocabulary, Malison in `classes.ts`). The engine support was built first (engine 0.21, schema 0.12). Its guide is `build/engine.md`.
- **Checked:** `npx tsx steps/loot/check.ts all` matches every catalog entry's card and stats word for word, and plays the piece check on each share with no crash, no loop and nothing that can't be fielded. `npx tsx steps/loot/commons.ts <share>` writes a share's plain pieces from its catalog.
- **Tagged:** every item carries its Serves line (`SERVED` in `content/core-set/pieces/index.ts`). The versions the catalog doesn't list keep their builds, with the retired builds mapped or dropped (`build-report.md`).
- **Measured:** the build test plays the nine builds' 27 routes (`tools/build-parties.ts`), and the balance sheet has run, both at the old knobs. Marked and Malison are each measured against today's, in the report.

## What's next

**The director plays it,** after deciding the report's three questions: recalibrate the knobs first (recommended; not done), keep Marked's wider rule, keep the new Malison. Then the step closes: fold what lasts into `docs/gear-design/loot.md` and `docs/rules.md`, and delete this folder.

## One thing read, not ruled

The director didn't name the mirror's two readings. The lead took "ok with your rules" to cover it, so the loot keeps pieces of each. `intent.md` says so, and the director can say otherwise.
