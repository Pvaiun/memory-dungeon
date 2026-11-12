# The balance pass: the director's intent

The full balance pass of the new loot, so the game can be playtested. Two parts, by two agents in turn.

**This part (done):** balance the build parties against chosen fights before any whole-run tuning, because tuning knobs on simulated runs costs tokens and gives a game "balanced in the literal sense, but not entertaining or fun, because it doesn't control for the shape of the balance".

- **Parties:** the build test's (`tools/build-parties.ts`), at different completeness: one or two abilities a unit at rung 1, all three later. Fights from rolled starts, never all full and all ready.
- **Knobs:** a quick change to a baseline: regular fights won but not freely; elites not always won; bosses not always won, and close when lost. Submitted as the baseline for the bigger tuning after.
- **Read, selectively,** a couple of fights per build: did the damage come from where it should, any weird behaviour, an endless loop, a trigger that always loses. Fix them, player side first.
- **The rule:** change what an item, ability, enemy, version or formation does only where it can't be balanced otherwise; never how a status, a stat or a game rule works across the board. Enemies only if a large share of builds can't handle one; player side first. If stuck, ask.
- **Then** apply the same scales to the rest of the loot and abilities: the value of effects, costs, cooldowns, stat lines, the relative strength of enemies, without changing what things are.
- **The aim:** no party drastically under or over; rhythms that work; builds that play differently and are meaningful, interesting and observable.

**Next part:** a fresh agent runs the whole-run simulations and the knob tuning to the version's final playable balance, from this part's report.

**Part two, the director's rulings (Nov 12):**

- **Fights by cost.** Regular fights and elites keep the knobs the per-fight calibration gives them (a careful party pays about a fifth of its HP for a regular fight, a third for an elite). The run tuner sets the bosses to their targets and evens out the regions within an act; the losses between bosses aren't aimed, and the win rate falls where that puts it (estimated 14%).
- **Act I's regular fights stay** where the calibration puts them (−25 on floors 4 to 6), and **its elites on floors 5 and 6 become a real fight again.**
- **Wall-less starts are for later:** "There's a problem in the game right now about requiring walls. I'm going to have to fix that in other ways than just pure balancing of knobs. So let's make the game compelling and have a good difficulty curve in general, and we'll deal with the wall-less starts thing later."
