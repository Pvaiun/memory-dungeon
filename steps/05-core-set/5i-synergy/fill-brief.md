# The fill: a brief for each agent

Oct 30, 2026. The spine (`spine.md`) is approved. The fill writes every piece in full, in parallel, one share per agent. This page is what every agent works from, beside its share. It gives intent and ranges, never examples: the director's rule ("You will simply get the examples that you listed for sure, verbatim").

## Read first

1. `intent.md` and `philosophy.md` (this folder): the director's standing intent.
2. `spine.md`, all of it: the approved design. Your share's lines are what you write in full. Read the other sections too, so nothing you write repeats a piece, formation, version or mythic elsewhere.
3. `builds.md`: the twelve builds (their rhythms, rungs and needs) and the section "Gear" (who wears which kinds).
4. `docs/core-set/rules-and-vocabulary.md` (statuses, damage, targeting, timing) and `docs/core-set/classes.md` (the kits, stats, cooldown and wind-up words, the MP ladder).
5. `PRIMITIVES.md` (the engine's building blocks: events, conditions, targeting rules, effects, stats). `content/core-set/scale.ts` holds every number's word, and `content/core-set/classes.ts` and `formations.ts` show how today's content is expressed. Read them for the vocabulary, not for designs.

## What you write

For each item in your share, in one markdown file (path in your share), in the order of the spine:
- **Name**, kind or slot, rarity.
- **Card:** the words on the card, as the player reads them. Plain, and enough that the player knows what will happen: who it affects, when, and how much in the game's words. It never says what the piece is for or names a build.
- **Numbers:** every number the effect needs, in the scale's words or values.
- **Hooks:** how the engine does it, in `PRIMITIVES.md`'s terms (event, condition, target rule, effect, stat, status). Where it needs something new, name the engine addition from `spine.md` section 1 by its number. If it needs something that list doesn't have, say so in a line marked **NEW**.
- **Builds:** the builds and rungs it serves and its worth to each, as the spine gives them (for commons and uncommons, which the spine doesn't list one by one: the builds whose first rung it serves).

## Rules you keep

- **The spine is the design.** Write its lines in full; don't change what a line does. If a line can't work (in numbers, in the engine, or against a rule below), keep it as written, and add a line marked **CHALLENGE** with the problem and the change you'd make. Never change a line silently.
- **A status keeps its own numbers.** A piece decides who gets a status, when, and how many stacks. It never changes what a status does, how long it lasts, or how it scales (the director's rule: a status scales by its stacks, never its applier).
- **Aegis is the Hoplite's.** Nothing else gives it.
- **No piece grants an ability.** Effects are stats, statuses, reactions, pulses, riders, targeting and rule changes.
- **Cards say who can wear a piece, never what it's for.** An amulet never names one class's ability. A mythic or an upgrade may.
- **Rarity, from the spine's section 1:** a common is stats only (two steps; three on a two-hander); an uncommon is one step and one small, general effect that starts two to four builds; a rare is one designed effect, worth a lot to one or two builds; a legendary bends a rule or is a far end, and gives something up where it's strong in many places. A two-hander's pieces are worth a weapon and an offhand.
- **No two pieces in one kind are a small and a big version of one thing,** an uncommon included.
- **Names:** new names for commons and uncommons, not used anywhere in the spine. Plain, evocative, one to three words. The lead checks every name across the shares.

## The ranges

*At gate 2 (Oct 30) the director ruled out balancing rules in this step: these ranges are first values, not limits, and synergies may be overpowered. Statuses are universal, as the rule above says.*

Numbers stay in today's ranges, so balance mostly holds. Use the scale's words wherever one exists.
- **Stat steps:** +1 or +2 of a stat (a point is 1,000 on the scale); HP half a point a step; Aggro ±10 a step; MP regen a step as `scale.ts` sets it; Crit chance +1 is 3 points, +2 is 5. A step can be negative where a piece gives something up.
- **Special stats** at their words: medium on commons, uncommons and rares; high only on a legendary or a mythic.
- **Stacks** in the words few, several, many, read off a stat the way a kit's are, or the flat words (one, few, several, many) where nothing scales. A rider on every hit is "a few" or less.
- **Damage and healing:** the hit words (touch, light, normal, heavy) for anything that deals damage, read off a stat. Boosts: small 10 to 20%, narrow 30 to 50%, double only on a condition a fight meets a few times.
- **Timing:** cooldown words (quick, short, medium, long, very long) and wind-up words (quick, normal, long, very long). "Every so often" is a cooldown word. "A few ticks" is 2 to 6. A regular fight runs about 31 to 45 ticks, a boss fight about 60 to 80.
- **MP costs** on the ladder in `classes.md` (skills and spells), set by hand. Revives cost 650.
- **Counters** (Cuts, Heat, Spite, Tempo, Surge, Fervor, Charge) grow slowly enough that a 40-tick fight and an 80-tick fight differ by about half, and each has a cap or a reason it needs none.
- **"Once a fight"** where the spine says so; nothing triggers without limit on a condition the party controls.

## When you're done

End your file with three short lists: **CHALLENGES** (lines you'd change, and why), **NEW** (engine needs beyond the spine's list), and **least sure** (the items you'd most like a second look at). Then report back in under 300 words: counts by rarity, and those three lists.
