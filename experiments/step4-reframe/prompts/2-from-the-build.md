# Designing a fight: the problem

You're designing how combat works in a small game. This file is everything you get. Nothing else exists yet: there's no current system to keep, extend or react to, so start from the problem below.

## The game around the fight

The game is an optional tab inside a personal productivity app. Doing real-life tasks unlocks new units and gear. The player builds a small party from what they've unlocked, sends it through a short dungeon (a few fights, then a boss) and watches what happens. Losing costs nothing, and the player can retry as often as they like.

Before a fight, the player has these choices:

- **Which units.** Each unit is a class plus a specialization. Units don't level up, so a unit's power comes from what it is and what it's carrying.
- **Gear.** It sets how well each unit does what it does.
- **Formation.** The party stands in a few slots, and each slot changes the unit in it in some way. Slots aren't positions on a battlefield: there's no geometry, range or rows.
- **Perks,** picked between fights in a dungeon, which amplify what the party brought.

Fights before the boss wear the party down. The boss is the main test. Enemies come with a few words describing how they behave, but never what beats them.

The player is on a phone, often in short sessions, and doesn't want to work hard. The game should be satisfying for someone who loves thinking about builds, and never a chore for someone who just wants to watch.

## The problem

**Make a conventional party RPG fight where the skill is all in preparation, and the player's input during the fight is light.**

The baseline is familiar: units with stats take turns to deal damage, prevent it, heal, and strengthen or weaken. The open question is how to make *that* deep enough to be worth building for, when the player doesn't pick each action.

What makes it hard:

- **Depth has to live in the build.** Anything that's interesting only when you choose each action becomes noise when the fight plays itself. Each part of the system has to show up as something a party is built toward or against.
- **Watching has to teach.** The player learns by losing, changing something and trying again. That only works if they can follow a fight well enough to guess what to change. A fight they can't read is a dead end, however deep it is.
- **Luck against learning.** With too much luck, a loss doesn't say whether the party was wrong or unlucky, and retrying becomes the strategy. With too little, every attempt plays out the same and there's no tension.
- **Variety against clarity.** There need to be enough distinct things for parties to bring and encounters to ask for, or every fight is "more damage against more health". But a player who's only watching can't track many.
- **Autonomy against frustration.** Units have to act for themselves for a build to play out. If what they choose can decide a fight and the player has no way to steer, that feels unfair.

## The space to explore

These are open. The answers should come out of one design that hangs together, not be picked one at a time.

- **What is a build, really?** Which parts of a fight does preparation reach, and how? What does a player change between attempts, and how does the fight respond?
- **What does the player do during a fight, if anything?** Anything from nothing to occasional broad guidance. If there's an input, how does what a unit is built for shape what the input does?
- **How do units decide what to do?** How smart they are, how predictable, and how that turns a build into behaviour the player can anticipate.
- **Where does uncertainty come from,** and how does a better-fitted party shrink it?
- **What does the player see?** What a player needs in order to read the fight and judge how close they came, and what's better learned by watching.
- **What makes encounters differ,** so that different parties are the answer to different encounters, and most encounters have several answers?
- **How many units?** Anything from one up. A party is assumed, but the size is open.

## The edges

The few things that are out, whatever the design:

- **The player never controls each unit's each action.**
- **No timing or sequence puzzles.** Nothing where the order or timing of actions matters more than the actions themselves, and no player-controlled way to bank turns now to spend them later. A single unit's own build-up-then-release is fine.
- **Any in-fight input stays broad.** It can matter, even decide a close fight, but never through remembering a sequence of calls, and it's never the main reason a fight is won or lost.
- **No battlefield geometry.**
- **No enemy with only one answer.** Custom rules for one enemy are fine; a lock with a single key isn't.
- **Few systems.** Depth comes from a few shared numbers that builds stretch and combine, more than from each unit carrying its own special rules. Nothing should tax the player's working memory.

## How we'd know it works

- A player who loses can say roughly why, and how badly, and name something to try next.
- A well-fitted party wins almost every time. A badly fitted one almost never does. Luck mostly matters in between.
- Nobody loses because one unit made one dumb choice, and nobody retries hoping the units behave differently.
- Two quite different parties can beat the same boss, each in its own way.
- Watching a fight reads like a story: who's carrying it, who's in trouble, whether it's turning.
- The player's own party is fully readable. The effect of everything they do shows as a number or a word. They needn't see an enemy's health, as long as a few attempts tell them how close they came.
- A big win, a near loss and a comeback each feel like events.

## Practical limits

Fights run on the player's phone from a random seed, and the same seed must give the same fight on every device. The maths is basic arithmetic only, so curves are ratios or small tables. These shape how rules are written, not which ideas are possible.

## Your task

Design this fight starting from the build.

Start with what a player tinkers with between fights: their units, gear, formation and perks, and the decisions they weigh in each. Ask what makes that tinkering interesting for someone who loves builds. Then design the fight as the thing that tests those decisions. The fight exists to tell the player whether their build was right.

## What to hand back

One design: the one you'd bet on. Not options, not variants.

- The design in plain language, short enough to read in a few minutes.
- How it answers the problem above: where the depth lives, what a player changes between attempts, and what they learn from a loss.
- What you're least sure about.
- Anything in this file you think is wrong for the game, with your reason.
