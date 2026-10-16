# Step 4 brief: combat concepts

> **Being built with the director, a piece at a time** (started Oct 16, 2026). This is the most creative step so far, so the brief isn't written in one go. Each piece is agreed before the next is written, so no question starts from a frame the director didn't want.
>
> - **Written:** this step, already decided (revised Oct 16, after the director reopened hidden enemy stats: it now separates what's decided from starting points).
> - **Next:** how the interview runs, why it's hard, the questions, what the designer will decide.

For the director to answer: in the step's session, with `/intent 4` in a fresh session, or by pasting `pack.md` into any chat.

## This step

Step 4 chooses what a fight is made of: the concepts combat has at all, and the basic rules for each. The design plan's examples are how turns work, dodging, crits, damage types, weaknesses and damage over time. The step also settles how much luck there is, how much depth suits the game, and what a loss looks like. Each concept is weighed by the depth it adds against what it asks of a player who only watches. The chosen concepts go into the engine, replacing step 2's stand-in fight, and tests show that each one works. There's too little content to judge balance until units exist.

Everything after builds on this. Step 5's hidden verbs are defined in these concepts, step 6's mechanics are built on them, step 7's trait words describe what they make enemies do, and step 22 has to show each of them on a phone.

**Where the line falls** (a draft, for the director to check):

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
- **Whether enemy stats are hidden.** The concept spec hides them, as in classic Dragon Quest, and gives enemies trait words instead, but nothing has decided it. The director reopened it on Oct 16: "I don't think we've agreed on that yet." Step 3's feel checks and step 7's trait words were planned around hidden stats, so the answer reaches them too.

## Why it's hard

*Next piece, after the director has answered how the interview runs.*

## Questions

*Not written yet.*

## What the designer will decide

*Not written yet.*
