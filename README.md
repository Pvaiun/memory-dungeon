# Dungeon Game: design

A party-based JRPG dungeon crawler with automatic combat, where preparation is the game. Its content is the **core set** (the rules, classes, gear, formations, enemies and the rogue mode, a roguelite run of three acts); free play keeps everything available as a sandbox. This repo designs it: a schema, a headless engine, simulations and a phone-sized interface.

Start with `docs/primer.md` (how the game works, and where everything is), then `CLAUDE.md` (how to work, and where things stand) and `docs/rules.md` (the director's standing direction).

```
npm install
npm test
npm run content   # regenerate content/core-set.pack.json from content/core-set/
npm run smoke     # play the core set documents' own test trios
npm run ui        # the interface, at http://localhost:5173
```
