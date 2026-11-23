# The wheel: the brief

A design step, with the director: the five colours that sort the web. Nothing is built in it and nothing in the game changes. The frame is `docs/colours.md`; its rulings bind this step. The director's intent is `intent.md`.

## Where the work runs

**Not here.** The colours have to be found without the classes or the builds shaping them, and an agent in this repository can't be kept from either: the primer alone carries both. So the work runs in two workspaces, side by side, each a branch with no history that holds only its own instructions, its brief, the director's intent, and the sources it may read (the colours' frame, the vocabulary, the combat rules, the engine's building blocks, the weapon and formation rules, the challenges, and a list of threads for checking gaps), with every class and build name taken out of them.

- **Version A, `the-wheel-workspace`: plays, marked.** Five agents list every way the rules allow to do each way to win; the director marks each alive, flat or never and rambles; three agents draw wheels from the marks apart; the director picks, then the question, then the names.
- **Version B, `the-wheel-workspace-b`: problems, answered.** Agents pose batches of tight problems about the game; the director solves them, which is how they design best; the answers, with the director's earlier answers from authored gaps, are sorted into wheels by attitude, by the director and three agents apart; an audit, the pick, the question, the names. The director holds this to be the right way of working.

A session there starts on its workspace's branch, and what it makes is merged back into that branch, not into main. Each ends with a `wheel.md`.

## Here, when the workspaces are done

- **Compare the two wheels** for the director: the colours they share and where they part.
- **Audit the chosen wheel against the classes and the builds,** which can be seen here without harm now: a colour that's a family of today's classes, or one of the nine builds, in disguise.
- **Fold it in:** the five colours' cards and the question go into `docs/colours.md`, with any ruling the director made on the way into its rulings.
- **The step closes:** this folder is deleted, the workspace branches are left as they stand, and the pie opens.

## What to read

- **Every session:** `docs/primer.md`; this brief; `intent.md`; `docs/colours.md`; each workspace's `wheel.md` and `report.md` (`git show origin/the-wheel-workspace:wheel.md`, and the same on `the-wheel-workspace-b`).
- **For the audit:** the class table in `docs/core-set/classes.md`, The classes, and the nine builds in `docs/gear-design/builds.md`, The rhythm space.
- **Leave alone:** everything else. The work isn't here.
