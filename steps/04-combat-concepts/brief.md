# Step 4 brief: combat concepts

> **Being built with the director, a piece at a time** (started Oct 16, 2026). This is the most creative step so far, so the brief isn't written in one go. Each piece is agreed before the next is written, so no question starts from a frame the director didn't want.
>
> - **Agreed:** this step, already decided, how the interview runs.
> - **Written, for the director to correct:** why it's hard.
> - **Next:** round 1's questions, and what the designer will decide. Round 2's questions are written after round 1.

For the director to answer: in the step's session, with `/intent 4` in a fresh session, or by pasting `pack.md` into any chat.

## This step

Step 4 chooses what a fight is made of: the concepts combat has at all, and the basic rules for each. The design plan's examples are how turns work, dodging, crits, damage types, weaknesses and damage over time. The step also settles how much luck there is, how much depth suits the game, and what a loss looks like. Each concept is weighed by the depth it adds against what it asks of a player who only watches. The chosen concepts go into the engine, replacing step 2's stand-in fight, and tests show that each one works. There's too little content to judge balance until units exist.

Everything after builds on this. Step 5's hidden verbs are defined in these concepts, step 6's mechanics are built on them, step 7's trait words describe what they make enemies do, and step 22 has to show each of them on a phone.

**Where the line falls.** The director agreed step 4's line on Oct 16. The other steps' edges get settled when those steps are reached.

- **Step 4:** which concepts exist, and how each basically works. For example, whether damage over time exists at all, and roughly how it ticks.
- **Step 5:** the role fantasies (a summoner? a gambler?), and the verbs that describe them.
- **Step 6:** the specific statuses, triggers and reactions, and how they time against each other.
- **Step 9:** what formation slots do. **Step 11:** what wears down across a run.

## Already decided

The primer has the game. What bears on this step comes in three kinds, because the concept spec is lean outside its principles and step 1's schema is a placeholder: only the first list is actually settled.

**Decided,** in `DECISIONS.md`, a firm intent or the director's standing preferences. Not asked again unless the director reopens them:

- **Preparation is the game.** The skill is building a party and learning by trial and error, not performing in a fight (step 3).
- **Few systems, no locks.** Mechanics map onto a few numerical systems (stats, statuses, damage types, flags, targeting). No bespoke keywords that act as locks, and nothing that eats the player's brainpower.
- **No battlefield geometry:** no rows, reach or positional targeting (step 1's review; kept when the director was asked, Oct 16).
- **Encounters are lock and key,** as predictions only. The engine never checks keys or keyholes (step 1's review).
- **Losing costs nothing,** and anything not yet beaten can be retried freely (a concept-spec principle, and step 3).
- **The schema's rule language is a placeholder.** The director hasn't had input on its building blocks. Step 4 may keep it, change it, drop parts of it or start over (step 2).
- **The director's input comes at the start** of designing the battle system, not once it's built (step 2).
- **Engine limits:** basic arithmetic only, so curves are written as ratios or small tables; the same seed gives the same fight on every device; and the battle system is one swappable piece (step 2). These shape how rules are written, not which concepts are possible.

**Starting points,** from the concept spec or step 1's placeholder schema. The interview builds on them and can change them:

- **Fights are automatic.** No manual abilities, no programming the party's tactics, no button mashing. Perk picks between fights are the only decision in a run, though the engine leaves room for others (step 2). One manual action per fight is held in reserve, in case fights feel too passive. Kept when the director was asked, Oct 16.
- **Units don't level up.** Abilities change behaviour rather than add stats, and units are self-contained: abilities don't chain across classes. These are mostly step 8's.
- **Simple targeting.** Units mostly attack whoever draws attention, and a few go for the most wounded. Formation slots work through ordinary numbers like speed, defence and damage multipliers. Enemies are a plain list, and the two sides needn't work the same way.
- **Fights read clearly:** chunky damage numbers and big words like MISS and BLOCKED, in the style of Game Boy-era JRPGs. The player learns by watching.
- **About 15 to 20 verbs,** with several ways to counter each enemy gimmick, so the concepts chosen here need to be rich enough to support them.
- **Repeating the same strategy rarely wins.**

**Open in this step,** though earlier documents assumed an answer:

- **How turns work,** including whether active abilities fire on their own when ready, as step 1's schema has them.
- **How much of the enemies' numbers the player sees.** The concept spec hides enemy stats, as in classic Dragon Quest, and gives enemies trait words instead, but nothing has decided it. The director reopened it on Oct 16: "I don't think we've agreed on that yet." It isn't all or nothing. Showing basic stats like HP needn't break trait words: "It really just depends on the granularity of what you're showing." They don't want to say yet that it's "100% obfuscated". Step 3's feel checks and step 7's trait words were planned around hidden stats, so the answer reaches them too.

## How the interview runs

Agreed with the director, Oct 16. This replaces the interviewer guide's "one sitting" for this step.

- **Two rounds.** Round 1 is open: reference games and how fights should feel. Round 2 gets specific, such as which concepts are in or out. Its questions are written from round 1's answers once round 1's read-back is done, and agreed with the director before round 2 starts.
- **A round isn't one turn.** A round takes as many exchanges as it needs, in one sitting or several. What matters is that the interview runs in rounds: round 2 doesn't start until round 1 is done.
- **Open questions, not lists of answers.** Round 1 offers no answers to pick from. In round 2, a list can come only after an open question, as a check for anything not yet mentioned, and it holds only concepts the design plan or schema already name.
- **One intent.** Both rounds go into one `intent.md`, with a section for each round, and each round ends with a read-back.

## Why it's hard

A draft for the director to correct.

- **The player only watches.** Nobody acts during a fight, so a concept adds depth only if it shows up in preparation, as something a party is built toward or against. A concept that's rich when you act each turn, like timing a block, can turn into noise when you only watch it.
- **Luck against learning.** The player learns by losing, changing the party and trying again. With too much luck, a loss doesn't say whether the party was wrong or just unlucky, and retrying the same party becomes the way past a wall. With too little, every fight between the same sides plays out the same, and there's no tension. Step 3's feel reader complained most about long runs of identical rounds.
- **A loss has to teach.** Losing costs nothing, so a loss is only worth something if the player can see why it happened, well enough to guess at a new strategy. That's the bar step 3 set for feel checks. Step 3 also found that close calls are invisible when enemy HP is hidden.
- **Enough to puzzle, few enough to learn.** Encounters are lock-and-key puzzles, so they need enough distinct things for a party to bring and an enemy to call for. With too few concepts, every dungeon is the same puzzle: more damage against more HP. With too many, a player who's watching can't tell what mattered.
- **What the player can see.** Every concept has to show itself, through a word on screen, a number, or a stat if some stats are shown. How much is shown, and how finely, decides how much the player learns by reading and how much by watching. It shapes the trait words (step 7) and how fights look (step 22).
- **The pull of what's already there.** Step 1's placeholder schema already holds a standard JRPG set: turns in speed order, hits and misses, crits, blocks, armour and damage types. Keeping it just because it exists would hand the game a default design nobody chose.
- **It can't be measured yet.** With no units or content, this step's tests only show that each concept works, not whether it's fun, flat or dominant. That shows at step 8 at the earliest. Steps 5 to 8 and 22 build on what's chosen here, so dropping a concept later strands what was built on it. The call rests on judgement and references, which is why round 1 starts with references.

## Questions

*Round 1's are next. Round 2's are written after round 1.*

## What the designer will decide

*Not written yet.*
