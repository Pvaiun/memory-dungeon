# Notes on the step 4 package (for the director, not the designer)

`package.md` is the only file the designer AI gets. This file records what was cut from the intent, brief and primer, so any of it can go back in on purpose. The full record in `steps/04-combat-concepts/` is unchanged.

## Cut: anchors that get copied

- **The example boss fight** (healers, aggro tank, burst assassin against a self-healing boss). It's the strongest anchor, because it reads as the answer.
- **Charge, Mixed and Cautious, and the personality system.** The input is now just "broad guidance, if any". Name it and every design gets three stances.
- **Every reference game,** the liked, the ballpark and the banned. The banned systems are kept as rules described in plain terms ("no banking turns to spend later"), without the names.
- **Role names** (tank, healer, buffer, ninja, assassin) and named mechanics (aggro, crits, misses, armour, damage types, damage over time, lethality stacks). The baseline is "deal damage, prevent it, heal, strengthen and weaken".
- **Illustrative numbers:** 99%, 60/40, 60% vs 80% efficiency, party up to five, about 15 to 20 verbs.
- **The taste examples:** off-builds with a threshold, keystones, controlled randomness, learning your party by trying it. Only "shared numbers over per-unit gimmicks" is left, as one line in "Few systems".
- **"Two or three sketches".** Now it's one design. Asking for several made them contrast with one another, so they ended up as settings of one mechanic.

## Cut: context that pulls toward the old schema

- **Step 1's schema,** the worked example, the rule language, and every mention of "placeholder". Saying "ignore the schema" still put it in the designer's head, so the package doesn't mention it. It says nothing exists yet.
- **Steps 2 and 3, the method, the 24 steps, verbs, traits, and keys and keyholes.** The designer doesn't need the process to design the bones. "Several answers per enemy" covers keys and keyholes.
- **Memory's purpose and ADHD framing,** apart from one line on the player's situation.

## Reframed

- **Firm items became "edges"** (six of them). Leans became open questions in "The space to explore". Feelings became "How we'd know it works": things you could watch for, not rules to tick off.
- **"Why it's hard" stays,** rewritten as five tensions. They describe the problem, not the solution.
- **The central question:** "Make a conventional party RPG fight where the skill is all in preparation, and the player's input during the fight is light."

## Prompts to try in "Your task"

Each one comes at the problem from a different side. Try them one at a time in fresh chats and compare the results.

1. **Start from a loss.** "Design the fight from the player's second attempt outward: what do they see, what did they learn, what do they change, and why does the change work?"
2. **Start from a build.** "Start from what a player tinkers with between fights, and design the fight as the thing that tests it."
3. **Start from watching.** "Design what a player watches. Every rule must exist because it produces something visible that tells the player something."
4. **Subtraction.** "Start with the plainest party RPG fight you can write. Add one idea at a time, and keep each only if it gives a player something new to build toward. Stop when the next idea adds less than it costs."
5. **Bet.** "Give the one design you'd bet on, and the single idea it rests on."
6. **No input first.** "Design it with no in-fight input at all. Then say whether an input earns its place, and what the smallest one would be."

If results still converge, the next suspects are the "space to explore" questions themselves (one design per heading is still a checklist) and the word "conventional" in the problem.
