# The wheel: the brief

A design step, with the director: the five colours that sort the web. Nothing is built in it and nothing in the game changes. The frame is `docs/colours.md`; its rulings bind this step. The director's intent is `intent.md`. This is version A of the way of working; version B is kept on the branch `the-wheel-version-b`, for if this one fails.

## Where the work runs

**Not here.** The colours have to be found without the classes or the builds shaping them, and an agent in this repository can't be kept from either: the primer alone carries both. So the work runs on the branch `the-wheel-workspace`, which has no history and holds only what it needs: its own instructions, the brief for its stages, the director's intent, and the sources it may read (the colours' frame, the vocabulary, the combat rules, the engine's building blocks, the weapon and formation rules, the challenges, and a list of threads for checking gaps), with every class and build name taken out of them.

Its stages, each ending with the director:
1. **Every play:** five agents list every way the rules allow to do each way to win, and the plays where mechanics meet.
2. **The director marks and rambles** on a page: alive, flat or never.
3. **Three wheels,** from three agents working apart on the marked plays.
4. **The pick,** then the question the five answer, then the names, into the workspace's `wheel.md`.

A session there starts on that branch, and what it makes is merged back into that branch, not into main.

## Here, when the workspace is done

- **Fold `wheel.md` in:** the five colours' cards and the question go into `docs/colours.md`, with any ruling the director made on the way into its rulings.
- **The step closes:** this folder is deleted, the workspace branch is left as it stands, and the pie opens.

## What to read

- **Every session:** `docs/primer.md`; this brief; `intent.md`; `docs/colours.md`; the workspace's `wheel.md` and `report.md` (`git show origin/the-wheel-workspace:wheel.md`).
- **Leave alone:** everything else. The work isn't here.
