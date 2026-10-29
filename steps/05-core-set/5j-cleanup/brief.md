# Step 5j: the cleanup, a brief for a fresh session

Oct 29, 2026. Everything on one branch. Then the base game is brought in line with the rules the director set in step 5i, so the pieces step can write against the game as it will be. This brief designs nothing new beyond the two re-themed classes. It removes, maps and re-wires.

## 1. Everything into main

- **5h is complete.** Its branch is `ccr-9cf44321-t2g2o5`: the roster, MP drained by fighting, the reward plan, the 12-floor map and hand-built tuning parties. Its last status line says "awaiting the director's play"; mark it done.
- **5i's work** is on `ccr-abdcdac2-r2rl1h`: the builds, the formations, the gear and the standing intent. It already holds everything from `ccr-70168e4e-ttpjgz`, which can be left behind.
- **Order:** merge 5h into main first, then 5i, through pull requests as before. The director merges them.
- **Expect conflicts in three places:**
  - **`CLAUDE.md`'s Status.** Keep one "No control in fights" line, 5h's line marked done, and 5i's line as it stands on the 5i branch.
  - **`steps/05-core-set/5i-synergy/intent.md`.** 5h's branch has an older copy, and the 5i branch's copy wins.
  - **`steps/05-core-set/5i-synergy/kickoff.md`.** 5h's branch adds it, and it stays deleted.
- **Check:** after each merge, `npm test`, `npm run typecheck`, `npm run validate` and `npm run smoke` pass before anything else changes. Do the cleanup on a fresh branch from main.

## 2. What the cleanup does

The director's rules, from `steps/05-core-set/5i-synergy/intent.md` and the "Gear" section of `builds.md`. Don't reopen them.

- **Two kinds of damage.**
  - **Physical** meets Armor (the Path of Exile formula, tuned to be mostly flat, so a big hit gets through big Armor) and Evasion.
  - **Magical** meets magic resist, one percentage stat, and can't be dodged.
  - Burn, Shock and Chill are statuses, not magic, and aren't resisted.
- **No elements and no physical subtypes as mechanics.** The seven resistances become magic resist. Ward, gear and enemies follow.
  - An element survives only as a theme: names, art, a class's flavour.
  - Scaling from Attack, Magic or any other stat stays.
- **Abilities lose their element.**
  - Propose each ability's damage type. The default is physical when it scales from Attack and magical when it scales from Magic. List every exception you'd make.
  - Statuses that read an element or a subtype get a plain rule, or go.
- **Enemy puzzles that rest on an element or a subtype go,** or become a plain stat. Weaknesses, absorption and Bulwark's "piercing or Wind" are examples of what to look for, not a list. No new puzzles: what matters now is a build's efficacy.
- **Class resistances and weaknesses tied to elements go,** unless one reads as magic resist.
- **The gear structure, in the schema, engine, content and interface:**
  - four slots (weapon, armor, offhand, amulet);
  - eleven weapon kinds, each with a speed, a damage type and hands, with a two-hander emptying the offhand;
  - four armor types in place of weights;
  - ten offhand kinds;
  - each class's kinds in every slot;
  - a mythic rarity that names one class.
- **Loot starts from scratch in the pieces step.** Until then, keep the rogue playable end to end on placeholders:
  - a plain piece for every kind;
  - today's pieces kept only where they map cleanly onto the new slots, and none designed;
  - 5h's reward plan still running.

  The volume, offers and stock in "What it asks" come with the pieces, not here.
- **Two classes re-themed** (the director: "We'll figure it out later" on the name):
  - **The Hexer** becomes "a Spellblade type thing": a rune sword or a dagger, in Mail.
  - **The Geomancer** becomes an earth fighter: a great weapon or a rune sword, in Plate, with a totem. Its one Magic-scaling ability "could be 100% changed", and it may get a new name.

  Design both kits and stats from their current kits and their builds' routes in `builds.md`. Keep each class's place in the builds it's routed into. This is the step's one design task.
- **Keep the game where it was.**
  - Run `npm run balance` before and after, and 5h's tools after (`npm run rogue:calibrate -- --climb`, `npx tsx src/rogue-acts.ts`, the hand-built parties).
  - Recalibrate where the numbers moved.
  - The difficulty pass comes after the pieces, not here.
- **Documents and versions:**
  - the four core-set documents, `DECISIONS.md`, the primer, the concept spec and `ui/README.md` in line with the build;
  - `PRIMITIVES.md` regenerated;
  - `ENGINE_VERSION` bumped.
- **Interface:**
  - element rows and words out (the bestiary, sheets, gear lines);
  - magic resist in;
  - a fourth slot, with the offhand shown locked under a two-hander;
  - a colour for mythics.

  The director sources the art for the new weapon kinds and the offhands. Until it arrives, use placeholders.

## How to work

- **Read first:**
  - `CLAUDE.md`;
  - `docs/method.md`;
  - in `steps/05-core-set/5i-synergy/`: `intent.md`, then `builds.md` (its "Gear" section and the routes);
  - in `docs/core-set/`: `classes.md` and `rules-and-vocabulary.md`;
  - 5h's `report.md` and `design-round-6.md`.
- **Gate 1, before building anything:** a short `plan.md` in this folder for the director. It covers:
  - every ability's new damage type, with the exceptions;
  - each enemy puzzle and class resistance that goes, and what replaces it;
  - how "mostly flat" Armor and magic resist values are set;
  - the Hexer's and Geomancer's kits, stats and a name or two;
  - what the placeholder loot is;
  - what you're least sure of.
- **Then build,** keeping the tests, typecheck, validation and smoke green at every commit.
- **Gate 2:** a short `report.md`, covering what changed, what the balance sheet and 5h's tools say against before, and anything that moved more than expected. Update `CLAUDE.md`'s Status, commit, push and stop.
- **Briefing subagents:** give intent and ranges, never examples.
