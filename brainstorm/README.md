# Brainstorm prompts

Prompts for blind idea generators: fresh chats with no access to this repo, run in two or more different models, with memory off. They see only the frame in each prompt, which is written from `DECISIONS.md` with every named example left out (no status, class or ability names), so their lists don't echo the director's ideas or each other's through a shared source.

Each prompt asks for the same lists (classes, player-facing statuses, special stats, plus elements) from a different angle: (a) the genre, (b) the system, (c) the trouble enemies cause. The director writes their own three lists separately, before reading any output. A session in the repo then merges the lists: ideas deduplicated by meaning, each counted by how many independent lists it appears in, and the director's marked as theirs.

## First round (Oct 21, 2026)

`lists/` holds the lists as they came back: the director's (`yours.md`) and one run of each prompt in Opus 5.5 (`opus-*.md`). `board.html` is the merged board, published as a private artifact at https://claude.ai/artifact/7BSxbPisjD5x5VwbZi9iRd. The director's keep, maybe and cut picks live in the artifact's database (`picks/<card id>`, plus `board/notes`), not in this repo. Merging rules: ideas that mean the same thing share a card whatever each list called them; a status or stat that a list only used inside a class counts for that list, marked as such; kit-only statuses appear only when two or more lists use them.

## Second round (Oct 21, 2026)

All three first-round runs were Opus 5.5, and they barely differed, so the prompts were rerun without the setting line in other models: ChatGPT (A), Gemini (B), DeepSeek (C) and Grok (angle not recorded). Their lists are in `lists/`. The board now counts models, not runs: Opus's three runs count once. `merge.py` is the merge itself: every list's entries placed on cards by meaning, and for each class, which models' versions use which effects. It writes the card data, and `board.template.html` with that data in place of `__CARDS__` is `board.html`.

## Handoff (Oct 21, 2026)

`picks.md` and `picks.json` export the director's picks and notes from the board. They stay here for the director's reference and don't go forward.

`handoff/` holds three documents, each for a fresh chat, run in order and validated with the director before its output moves on:

1. `step-1-genre-check.md`: compare the brainstorm with the genre, add missing staples, remove what's too esoteric, sort statuses from special stats. Its output is a plain content pool, with no sources or notes. The brainstorm goes in with the director's picks and notes, weighted unevenly (a cut is a strong signal, a keep only a lean), but with no sources or counts; the director's own ideas are folded into the descriptions.
2. `step-2-challenges.md`: the kinds of enemies, bosses and enemy groups the game's fights can pose, starting from other games, with answers phrased as game functions. It doesn't see the brainstorm, so the challenges come from the genre rather than from the content they'll test; it can run alongside step 1.
3. `step-3-core-set.md`: the core set, in two gated stages: first the vocabulary (statuses, special stats, elements) that answers step 2's challenges, then class skeletons built from it (one weapon kind, a passive, two abilities). Its appendices are filled with steps 1 and 2's outputs.

Full class kits come after step 3. `frame.md` is the shared description of the game and combat system; `build-handoff.py` builds the three documents from the templates and the merge.
