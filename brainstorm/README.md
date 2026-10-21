# Brainstorm prompts

Prompts for blind idea generators: fresh chats with no access to this repo, run in two or more different models, with memory off. They see only the frame in each prompt, which is written from `DECISIONS.md` with every named example left out (no status, class or ability names), so their lists don't echo the director's ideas or each other's through a shared source.

Each prompt asks for the same lists (classes, player-facing statuses, special stats, plus elements) from a different angle: (a) the genre, (b) the system, (c) the trouble enemies cause. The director writes their own three lists separately, before reading any output. A session in the repo then merges the lists: ideas deduplicated by meaning, each counted by how many independent lists it appears in, and the director's marked as theirs.

## First round (Oct 21, 2026)

`lists/` holds the lists as they came back: the director's (`yours.md`) and one run of each prompt in Opus 5.5 (`opus-*.md`). `board.html` is the merged board, published as a private artifact at https://claude.ai/artifact/7BSxbPisjD5x5VwbZi9iRd. The director's keep, maybe and cut picks live in the artifact's database (`picks/<card id>`, plus `board/notes`), not in this repo. Merging rules: ideas that mean the same thing share a card whatever each list called them; a status or stat that a list only used inside a class counts for that list, marked as such; kit-only statuses appear only when two or more lists use them.

## Second round (Oct 21, 2026)

All three first-round runs were Opus 5.5, and they barely differed, so the prompts were rerun without the setting line in other models: ChatGPT (A), Gemini (B), DeepSeek (C) and Grok (angle not recorded). Their lists are in `lists/`. The board now counts models, not runs: Opus's three runs count once. `merge.py` is the merge itself: every list's entries placed on cards by meaning, and for each class, which models' versions use which effects. It writes the card data, and `board.template.html` with that data in place of `__CARDS__` is `board.html`.

## Handoff (Oct 21, 2026)

`picks.md` and `picks.json` export the director's picks and notes from the board. `core-set-brief.md` is the file the director gives a new design agent to start the core set (classes, statuses, special stats and elements): the task, the game, the combat system with no examples, and every brainstorm entry with its sources, the director's own wording, pick and note. `build-brief.py` builds it from `core-set-brief.template.md`, the merge and the picks. The merge now puts the director's "Mark for death" on Vulnerable, as their note there says.
