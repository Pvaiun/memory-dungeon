# The wheel: the brief

A design step, with the director: the five colours that sort the web. Nothing is built in it and nothing in the game changes. The frame is `docs/colours.md`; its rulings bind this step. The director's intent is `intent.md`.

## Where the work runs

**Not here.** The colours have to be found without the classes or the builds shaping them, and an agent in this repository can't be kept from either: the primer alone carries both. So the work runs in a workspace: a branch with no history that holds only its own instructions, its brief, the director's intent, and the sources it may read (the colours' frame, the vocabulary, the combat rules, the engine's building blocks, the weapon and formation rules, the challenges, and a list of threads for checking gaps), with every class and build name taken out of them.

**Version C, `the-wheel-workspace-c`, is the one being run: triads.** Agents make cards, each something a player could choose, spanning everything the rules allow. The director is shown three at a time and says which two the same kind of player would reach for, and in a few words why. The distinctions that keep coming back, in the director's words, are sorted into wheels, by the director and by three agents apart; then an audit, the pick, the question and the names.

**Set aside,** their workspaces left as they stand:
- **Version A, `the-wheel-workspace`:** a complete list of moments in a fight, to mark. Its list couldn't be judged: a fight is where the player has no say, and the fun is in the choices. Its list is still a complete account of what the rules allow, and can join C's sources as `sources/plays.md`.
- **Version B, `the-wheel-workspace-b`:** narrow problems, answered at length. It asked for volume against a blank page, with no way to see how the answers would add up.

A session there starts on its workspace's branch, and what it makes is merged back into that branch, not into main. It ends with a `wheel.md`.

## Here, when the workspace is done

- **Audit the chosen wheel against the classes and the builds,** which can be seen here without harm now: a colour that's a family of today's classes, or one of the nine builds, in disguise.
- **Fold it in:** the five colours' cards and the question go into `docs/colours.md`, with any ruling the director made on the way into its rulings.
- **The step closes:** this folder is deleted, the workspace branches are left as they stand, and the pie opens.

## What to read

- **Every session:** `docs/primer.md`; this brief; `intent.md`; `docs/colours.md`; the workspace's `wheel.md` and `report.md` (`git show origin/the-wheel-workspace-c:wheel.md`).
- **For the audit:** the class table in `docs/core-set/classes.md`, The classes, and the nine builds in `docs/gear-design/builds.md`, The rhythm space.
- **Leave alone:** everything else. The work isn't here.
