# Defining the web: the brief

A conversation step, with the director. Nothing is built in it and nothing in the game changes.

## What it's for

The director wants to talk about how the web of effects is defined: what its parts are sorted by. Their intent is in `intent.md`: colours (families of themes) and ways to win as two things, in place of the builds at the web's edges. It's an idea in a back and forth, not a ruling.

## What to read

The list is closed. This step sits beside authored gaps (`steps/authored-gaps/`), which holds a lot the conversation doesn't need.

- **Every session:** `docs/primer.md`; this brief; `intent.md`, `colours.md` and `four-lines.md`, beside it.
- **The web as it stands,** in `steps/authored-gaps/web.md`: The threads and The clocks, whole; The catalog, as far as a question needs. Its other sections are the record of the request cards.
- **The map** draws that web between the nine builds: `https://claude.ai/artifact/9GtG7CvLQBAgZszRWyfz35`, redrawn by `npx tsx tools/web-map.ts`.
- **The classes, which the director set as the scope:** each class's Role and Identities lines in `docs/core-set/classes.md` (`grep -n -E '^\*\*Role:|^\*\*Identities'`), and The rhythm space and Every class in the set in `docs/gear-design/builds.md`.
- **Only when a question needs it, and only that section:** one build, in `docs/gear-design/builds.md`, The builds; a status's entry in `docs/core-set/vocabulary.md`; how a fight runs, in `docs/core-set/combat.md`.
- **Leave alone:** the rest of `steps/authored-gaps/` (its brief, intent, report, triage and request page). That step waits on this one.

## What's here

- `intent.md`: the director's intent, in their words where the wording matters.
- `colours.md`: the agent's first cut at colours and ways to win, drawn from the classes, with what it asked the director. Not a ruling.
- `four-lines.md`: an earlier way to sort the web that an agent proposed, with how far it was measured to hold. Not a ruling.

## How to work

Talk it through in the chat, short and plain. Measure a claim about how fights work before leaning on it. When the director rules, record the ruling here, and say what it changes for authored gaps.
