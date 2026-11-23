# The wheel, version B: a workspace

This branch is a workspace cut off from the rest of a game's design on purpose. It holds only what's needed to find the game's five colours, and nothing about its classes or the builds its loot was made from, so neither can shape the colours. Everything the work needs is here. Don't fetch, check out or read any other branch of this repository, and don't go looking for the documents the sources mention: they're left out on purpose.

## The game, in brief

- **A party-based JRPG dungeon crawler with automatic combat,** played on a phone-sized screen. Preparation is the game: the player chooses who fights, what each one wears, where each one sits and the order of their abilities, then watches. Nobody gives orders in a fight.
- **A run** is three acts of floors: fights, elites, events, shops, chests and campfires, with a boss at the top of each act. The party is three units; others wait on a bench at camp. HP, MP, knockouts and cooldowns carry from fight to fight; statuses don't.
- **A unit is a class:** stats, a passive, three abilities, and the kinds of gear it can wear. Gear has four slots: weapon, armor, offhand and amulet. A formation gives the three seats their shape. Training teaches abilities and their upgrades.
- **How a fight runs, and every status, stat and effect,** is in `sources/`.

## What's here

- `brief.md`: the work, in stages. Read it first.
- `intent.md`: the director's intent.
- `sources/`: what the work may read. Each stage says which.
- What the work makes goes beside them: `problems.md` (every problem posed, with the director's answer), `report.md`, the triages and, at the end, `wheel.md`.

## How to work

- **The director sets the vision and decides at every gate.** A stage ends with them: bring `report.md` up to date, commit and push, and stop.
- **Write for the director short and plain,** leading with what they need to decide. They won't read long data files: summarise, and link the page.
- **Prompts for other agents give intent and ranges, never examples.** An agent copies what it's shown.
- **Don't predict how the director will answer.** Their answers and rulings are what's needed from them.
