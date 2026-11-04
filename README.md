# Memory Dungeon Game: design

Design work for an optional game tab in Memory, the director's personal ADHD memory app: a party-based JRPG dungeon crawler with automatic combat, where real-life quests pay unlocks and dungeons pay gear. That pitch is `docs/concept-spec.md`, and it stands.

What's being built right now is the **core set**: a vertical slice of that game, set out in `docs/core-set/` (the rules, combat, classes, gear, formations, enemies and the rogue mode). The rogue mode, a roguelite run of three acts, is the game; free play keeps everything available as a sandbox. The quest board and reward streams stay out of it.

Start with `docs/primer.md` (how the game works, and where everything is), then `CLAUDE.md` (how to work, and where things stand) and `docs/rules.md` (the director's standing direction).

```
npm install
npm test
npm run content   # regenerate content/core-set.pack.json from content/core-set/
npm run smoke     # play the core set documents' own test trios
npm run ui        # the interface, at http://localhost:5173
```
