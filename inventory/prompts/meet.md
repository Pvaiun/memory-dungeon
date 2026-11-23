## Your part: where mechanics meet

Your plays are the ones that only exist where two mechanics meet, across all four ways. A play is yours when taking either mechanic away makes it disappear, not merely weaker: the meeting itself is the play. Four other agents are each listing one way's plays; yours cross them. File each under the way it mostly does (`way`), with any others in `also`; most of yours will do more than one. Sweep pairs, not singles: go family against family across the sources (statuses against statuses, statuses against events and effect ops, stats and special stats against statuses, weapon kinds and seats against all of these, targeting against all of it), the pairs the sources set side by side and the ones they never do, and keep every meeting that makes a play of its own. A meeting of three counts when all three are needed. Doubles with the other agents are taken out in the merge; gaps aren't found again.

Your prefix is X. Write /home/user/memory-dungeon/inventory/meet.json and /home/user/memory-dungeon/inventory/meet-notes.md.

You're one of five agents building one inventory for a game's design: every distinct play its combat rules allow. You work alone; the other four cover other parts, and a later step merges the five lists. Nobody will add to your part after you, so what you leave out is missing.

## The game

A party-based JRPG dungeon crawler with automatic combat, on a phone-sized screen. Preparation is the game: the player chooses who fights (three units), what each one wears (weapon, armor, offhand, amulet), where each one sits (a formation's three seats, which change numbers, not position) and the order of their abilities, then watches. Nobody gives orders in a fight. A run is three acts of fights; HP, MP, knockouts and cooldowns carry from fight to fight, statuses don't.

## What a play is

A play is one distinct way to do one of the game's four ways to win (burst, build up, debuff or disable, sustain): what happens in a fight, why it wins, and the mechanics it rests on, in the rules' words. It's read from the mechanics and where they meet, not from what a fight's text happens to show: some of what happens in a fight never shows in its log.

## Read first, whole

In /home/user/memory-dungeon/sources/:
- `colours.md`: read it for the four ways to win and for the style questions (how big and how often, how wide, when, at what price). The questions are your generator: within a way, a change in the answer to any of them that would make a fight play or feel different is a different play. The rest of that page is about colours, which aren't yours to make: don't sort, theme or group plays by temperament.
- `vocabulary.md`, `combat.md` and `primitives.md`: everything the rules and the engine can express. Read all three in full, primitives.md included; it holds the building blocks the other two don't name.
- `gear-rules.md`: the weapon kinds and the formations, as rules.

Read nothing else: not the other files in sources/, not any other branch of this repository, nothing from outside it. The sources sometimes name an ability, a piece of gear, a foe or a class's passive to illustrate a rule. Those names are illustrations, not a catalogue: take the rule, and don't build plays around the named thing.

## Bounds every play keeps

- The player gives no orders in a fight. Anything that happens, happens from preparation: who's in the party, what they wear, where they sit, the order of their abilities, and the rules of the kit.
- No positional targeting and no battlefield geometry.
- A status does the same thing whoever applies it, and scales by its stacks, never by its applier.
- Elements are themes, never mechanics.
- MP is fuel, and no play is about lasting more fights.
- The director's rulings at the top of each source stand. A play that exists only if one of them changes may be kept, marked with the ruling it needs; keep that rare, for plays the ruling alone stands in the way of. The bounds above can't be bent this way.
- A play the rules don't allow yet, but a small new building block would, is kept and marked as needing one. A small block is one addition in the primitives' own terms: an effect op, a status field, an event, a condition, a target rule, a status or a stat. A play that needs a new system (a new resource, a new layer of the fight, input during a fight, geometry, anything the engine has no kind of thing for) isn't kept.
- Enemy-only statuses are the foes'. A play where the party lays or holds one needs a ruling, and is marked so.

## Distinct, not padded

Two plays are different if they would play or feel different in a fight: don't merge them. Don't list the same play twice in other words. A difference only in numbers is a different play only where the fight would feel different for it.

## How to work

Sweep; don't brainstorm. One agent asked for variety tends to give variations of its first idea, and this inventory exists so that coverage never rests on what comes to mind first.
- Go through the sources' mechanics one family at a time: every status, every special stat and stat, every effect, every effect op, status field, event, condition, scale source, target rule and cooldown change in primitives.md, every weapon kind's speed, hands, swing and scaling, and the formation's seats and party effect. For each one that bears on your part, run each style question across its whole range and keep each point where the fight would play or feel different.
- Then go back over your list and look for what's thin: families you touched once, questions you answered only one way, ends of a range you never reached.
- Each play is one or two plain sentences, under about fifty words, that say what happens in the fight and why it wins. Its first sentence says what it means. No flavour, no theme, no names for plays, no temperament or attitude, no classes, no builds, no numbers the sources don't give.

The count is whatever your part holds. A few hundred plays are expected across all five agents together; don't pad toward a number, and don't stop short to keep the list tidy.

## Output

Write a JSON file, an array of objects, one per play, with these fields:
- `id`: your prefix (given below), a hyphen and a three-digit number, in order.
- `way`: the way it's filed under: `burst`, `build`, `debuff` or `sustain`.
- `also`: an array of the other ways it does as well, often empty.
- `question`: the style question it turns on, the one whose answer sets it apart from the plays nearest it: `size` (how big and how often), `width` (how wide), `timing` (when) or `price` (at what price).
- `play`: the one or two sentences.
- `rests_on`: an array of the mechanics it rests on, each in the sources' own words: the vocabulary's name where it has one, else the primitives' name for the op, field, event or condition.
- `needs_block`: null, or one line naming the small building block it needs and what it would do.
- `needs_ruling`: null, or one line naming the ruling it needs changed, and its source.

Then write a short markdown note beside it: what you swept, where the space was thin or empty and why, the plays you left out because they'd need a new system (one line each), and anything in the sources that seemed to contradict itself or leave a rule open.

Check that the JSON parses before you finish. Reply with the count of plays, a count by `question`, and the two paths; nothing else.
