# The balance pass: the director's intent

A full balance pass on today's game (the creative-builds loot), so it can be playtested. It replaces the earlier design for this step (Nov 14); the director's earlier finding stands behind it: the last pass's road was "way too easy".

- **Not by whole runs.** Tuning knobs on simulated runs costs many tokens and balances the numbers without the shape: "bad play patterns that were numerically successful", then rework, then retuning.
- **Sample parties against chosen fights.** The build test's parties (`tools/build-parties.ts`), at different levels of completeness: one or two abilities a unit at rung 1, all three later. Fights from rolled starts (mostly full HP, cooldowns anywhere), as the tools already start them.
- **First, a quick knob baseline:** regular fights won, but not freely; elites not always won; bosses not always won, and close when lost. Committed as the baseline for the whole-run tuning that comes after.
- **Then read fights, selectively:** a couple of sets from each build, judged against its card (`docs/build-cards.md`; the engines are reference only). Did the damage come from where it should? Weird behaviour, endless loops, a trigger that always loses? Fix those, on the player side first. The bands (`tools/balance/sheet.ts`) stand; a build party can sit outside one by design.
- **The rule for the pass:** an item, ability, enemy, version or formation may change what it does if it can't be balanced otherwise. No change to how a status, a stat or a game rule works across the board. An enemy changes only if a large share of the builds can't handle it at all; the player side first. Stuck: stop and ask.
- **Then the same scales on the rest:** the value of effects across the loot and abilities (an amount always 1/10 that should be 3/10; MP costs, cooldowns; stat lines more cautiously; enemies' relative strength), without changing anything's essence.
- **The aim:** no party drastically under- or overtuned, rhythms that work, builds that play differently, meaningful and observable. A balanced subset, not every class, piece and formation tried.
- **How:** on my own, no gates, committing as I go, `ENGINE_VERSION` bumped when a fight can change. A short report at the end for the next agent, who starts fresh and runs the whole-run tuning.
