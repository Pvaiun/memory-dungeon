# Core set: vocabulary

The vocabulary every class, piece, formation and enemy is built from: how statuses work, the tiers, and what each status, special stat and effect does. How a fight runs is in *Core set: combat* (`combat.md`); weapons, gear and formations are in *Core set: gear and formations* (`gear.md`). Sizes and durations are words here. The number behind each one is in `content/core-set/scale.ts`, under the name given in brackets (`STATUS.burn`).

## The director's rulings

The director's standing direction on this page's subject. Direction is guidance, not law: challenge any of it with evidence. Until a line is changed here, it stands, and it wins over the rest of this page: where they differ, fix the page. When the director changes a ruling, rewrite its line; don't add history.

- **Nothing in the vocabulary is locked to one class.** A status, stat or effect that one class uses today can appear on other classes, on gear and on formations (Aegis and Hidden included). Where it's rare, it's enough that it's exotic. The tiers are Fundamental and Specialist, and enemy-only is a tier of its own (Doom, Bulwark): the party can't use it until the director says so.
- **A status runs its own course.** No ability spends, shortens or sets off a status early; a payoff reads the stacks and leaves them.
- **A status's own behaviour carries no build's identity.** What a build wants from a status beyond its definition (fire that passes on when its foe falls, a shatter that leaves cold behind) comes from a class, a version, a piece or a formation, never from the status itself: every use of the status would take that identity on.
- **A status scales by its stacks, never by its applier.** The applier sets only how many stacks it adds. A Burn stack is a Burn stack, whoever applied it, and a status's damage belongs to its holder (no lifesteal from it).
- **Statuses are universal:** nothing applies a status for less or more than its own length. The one exception is bosses' control resistance (Stun, Silence and Slow, Chill's stun included): hidden stacks shorten them and then make the boss immune, and the stacks fall over time.
- **The Chill class doesn't Slow:** Slow is a player status like any other, but no Frostweaver ability applies it, and no ability triggers a shatter: Chill is its slow and detonates itself.

## Statuses and special stats

- A **status** is a special state on a unit that the player understands as having been put there by someone or something. It shows on the unit as feedback.
- A **special stat** is a stat outside the set every unit has. It's zero by default, isn't shown on the stat sheet until something changes it, and is always active while the unit has it.

A status can:

- change stats, up or down;
- raise the damage or healing a unit deals, by kind: basic attacks, abilities, hits, or one status's damage;
- change how much damage a unit takes, of every kind or one kind;
- soak a pool of damage before HP (a shield);
- lock out some of a unit's actions (all, basic attacks only, or abilities only), optionally cancelling a wind-up;
- add an extra piece of damage to a unit's attacks;
- do something on a timer: deal damage, heal, restore or drain MP, or apply another status;
- react to events: being hit, landing a hit, dodging, missing, dealing or taking damage, losing HP, being healed, starting, finishing or being interrupted in an action, gaining or losing a status, a stacking status reaching its cap (Chill's shatter), a unit being knocked out, or the fight starting.

Each status has one fixed definition and does the same specific thing every time it's applied. A status has no variants: a version that affects only one kind of damage is a separate status, with its own name.

## How statuses stack and end

- **Refresh:** reapplying replaces the old copy.
- **Fizzle:** reapplying fails while it's there.
- **Stacks:** each application adds stacks to one shared total, and the effect scales with the total. The total can drop on each timer or event (halve each time, or lose one), and the status ends when it falls below one stack. A status starts at one stack: on a unit that doesn't hold it, applications under one stack wait on that unit and add up, doing nothing and never fading, until together they make a stack; then the status lands with all of them.
- **Pool (Shield):** each application adds to one shared pool per unit, up to the pool's cap. The pool has no timer: the status ends when the pool is used up or the fight ends.
- **Per source:** each applier keeps its own copy; it can end when its applier is knocked out (an aura).

How statuses end, and what they can't do:

- **Length.** A status has a duration or lasts the whole fight, and every status ends when the fight does. It can be unremovable, or survive its holder being knocked out.
- **Removal and immunity.** Effects can remove buffs or debuffs, and units can be immune to particular statuses or kinds of effect. Every status is either a buff or a debuff, and every status that deals damage over time is a debuff (the lists are under Vocabulary: statuses).
- **A status's own damage is untyped:** it isn't dodged, and Defense doesn't reduce it. A status can still be given a hit's damage, which meets what a hit meets (Evasion, Defense); only foes use that (the Bomb Bug's death blast).
- **Status damage and defences.** Shields soak status damage, and damage-taken modifiers reach it, except one that names hits alone (Incorporeal). Status damage isn't a hit: it can't crit, never triggers anything that reacts to hits, and doesn't count toward anything that counts hits.
- **A status is fixed when it's applied.** The applier's stats can set how many stacks an application adds, and nothing else: its damage boosts don't raise the status's damage. A stacking status scales only by the stacks applied, and a single one by nothing.
- **A hit's own statuses land after the hit,** so a status set off by being hit (Bleed) waits for the next one.
- **Lengths are universal:** nothing applies a status for less or more than its own length. The one exception is bosses' control resistance (`RULES.control`). Each Stun, Silence or Slow that lands on a boss, Chill's stun included, adds a hidden stack. The stacks first halve the next control and then make the boss immune (RESISTED, IMMUNE), and they drain over time.

## Tiers

Every status, special stat, effect and challenge has a tier, set by its role. Tiers count across the whole set, every class and enemy together: they say how widely a piece appears, not what each class should hold. Outside the enemy-only tier, nothing is locked to one class: a piece that one class uses today can appear on other classes, on gear and on formations.

| Tier | Role |
| --- | --- |
| Fundamental | The learnable base. Many classes and enemies use it, and players meet it in the first fights. Its variety comes from how differently it's used, not from adding more pieces. |
| Specialist | A few classes or foes make use of it or are built around it, and a few challenges lean on it. Some are one class's in the core set as built, and bend a rule. |
| Enemy-only | Only enemies use it. The party can't, until the director says so. |

The Fundamental pieces were chosen for how they interact: pieces that answer, undo, feed or play against one another.

## Vocabulary: statuses

The vocabulary is 27 statuses, 10 special stats and 6 effects. The pieces add five counters (*Gear design: the loot*).

| Kind | Fundamental | Specialist | Enemy-only | Total |
| --- | --- | --- | --- | --- |
| Statuses | 10 | 15 | 2 | 27 |
| Special stats | 1 | 9 | 0 | 10 |
| Effects | 3 | 3 | 0 | 6 |

Ten staples make the Fundamental base, each useful from a single application. Three Specialist statuses (Burn, Chill, Shock) are built up instead: they stack and drain away, so they pay off only with upkeep. Each status's sizes and lengths are in `STATUS`, under its name.

| Status | Tier | What it does |
| --- | --- | --- |
| Bleed | Fundamental | Stacks, with no duration, and does nothing on its own. Each hit its holder takes deals untyped damage per stack (not a hit itself), then a share of the stacks close. An inverse Shock: it pays a party that keeps the hits coming. |
| Regen | Fundamental | Heals a share of its holder's max HP on a pulse, for a set time, big enough to see. Refresh. |
| Shield | Fundamental | Soaks a pool of damage before HP, status damage included: a second health bar, shown over HP. One pool per unit. Each application adds to the pool, up to a cap of a share of the holder's max HP. How much an application adds scales from a stat the ability or effect names (Vanguard from max HP, Earthen shell from Defense). The pool has no timer, and Dispel removes the whole pool. If the pool proves too strong, a slow drain is the knob. |
| Might | Fundamental | More damage per stack, up to a cap. Stacks; each action its holder takes spends one stack. |
| Weaken | Fundamental | Its hits deal much less damage. Refresh. With Shock on the same unit, the two cuts add. |
| Guard | Fundamental | Raises Defense for a while. Refresh. Best against many small hits. |
| Stun | Fundamental | Can't act. A wind-up under way waits it out, then carries on (Silence is the interrupt). Fizzle. |
| Slow | Fundamental | Longer cooldowns, wind-ups and time between attacks. Refresh. |
| Haste | Fundamental | Shorter cooldowns, wind-ups and time between attacks. Refresh. |
| Taunt | Fundamental | Foes' single-target picks must go to a Taunting unit; with several, draw weights the pick. Refresh. Seek gets past it. |
| Burn | Specialist | Stacks, with no cap. On a short pulse it deals damage per stack, then loses a share of its stacks, so it stays high only while someone keeps applying it. Each application is small against the ceiling that upkeep reaches. |
| Chill | Specialist | Stacks up to a cap, each stack slowing its holder a little. It thaws a stack at a time, slowly, so it builds over a fight. At the cap it shatters: its holder takes damage for each stack and a Stun, and the Chill is spent. Near the cap it slows as much as Slow, and the two add. A chain of shatters dies down: Chill that one foe's shatter passes to another foe that has shattered lately is cut by about half for each time it has, never to nothing (Chill from swings and spells is untouched). |
| Shock | Specialist | Stacks up to a cap. Each time its holder acts (when an action resolves: at the end of its wind-up, or at once for a basic attack), it takes damage per stack and loses half its stacks, so it hurts fast units most. Its holder's hits deal a little less for each stack it holds as it strikes (`STATUS.shock.hits`), so it softens slow units most: a slow foe kept charged swings at the cap. The cut adds to Weaken's. |
| Marked | Specialist | A debuff on a foe: the party's basic attacks, and its abilities aimed at a random foe (a phrase's fallback to a random foe included), pick a Marked foe while it lasts, inside the Taunt rule (Seek follows it past a Taunting foe); an ability whose phrase finds its foe keeps its own targeting. With several Marks, the pick is by draw among them. Each applier keeps one Mark, so a new one it applies moves its old one. Refresh. The Paladin's Condemn applies it; so do the Hunt's pieces and seats, each only while no foe is Marked. |
| Sunder | Specialist | Stacks up to a cap; each stack makes its holder take a little more damage of every kind. Loses a stack on a pulse. |
| Silence | Specialist | Can't use abilities, only basic attacks; loses an ability's wind-up. Fizzle. |
| Hidden | Specialist | Foes can't pick it as a target, Seek included; only their Area reaches it. Its allies can still pick it. Lasts a set time and can't be removed. Refresh. |
| Rot | Specialist | Receives less healing; Shields are unaffected. Refresh. |
| Clarity | Specialist | Regen for mana: restores a share of its holder's max MP on a pulse, for a set time. Refresh. Cast on oneself or an ally. |
| Aegis | Specialist | Blocks the next damage above a set share of max HP, from any source, then ends. Checked after mitigation, before Shields. Fizzle. Small hits pass; one big one doesn't. |
| Bewildered | Specialist | A debuff on a foe: its next basic attack strikes a random unit of its own side, then it ends (alone, it strikes a foe as usual). It stops nothing it doesn't show. |
| Brittle | Specialist | A debuff: the next hit its holder takes is a crit, then it ends. A crit the party sets up. |
| Blur | Specialist | A buff: the next hit on its holder misses, whatever its Evasion and the attacker's Accuracy, then it ends. The miss is a dodge, so whatever answers a dodge answers it. It doesn't stack: one Blur waits at a time. |
| Fixated | Specialist | A debuff on a foe: its basic attacks, and its abilities aimed at a random foe, pick the unit that fixated it while that unit can be picked, for a set time (`STATUS.fixated`); a Taunt still forces the pick. A Taunt on one foe. Refresh. |
| Owed | Specialist | A marker on a unit whose piece owes its hits: the damage of each hit, after Defense, waits on the icon, adding up, and lands all at once a set time after the first (`OWED`), as damage of no type that a Shield present then soaks. |
| Doom | Enemy-only | A visible countdown; at zero its holder takes untyped damage of a large share of its max HP, so a unit at full HP survives it and a hurt one doesn't. Fizzle. Cleanse removes it; Shield and Aegis soak it. |
| Bulwark | Enemy-only | Starts with a stack count, and every hit its holder takes removes one. At zero its holder is Stunned and takes double damage for a while, then Bulwark refills. |

**Buffs and debuffs.** Every status but Owed is either a buff or a debuff. Cleanse removes debuffs, Dispel removes buffs, and "with a buff" or "with a debuff" in a target phrase means these lists. Hidden is a buff, but it can't be removed. Taunt and Bulwark are ordinary buffs that Dispel can remove.

| Kind | Statuses |
| --- | --- |
| Buff | Regen, Shield, Might, Guard, Haste, Taunt, Hidden, Clarity, Aegis, Blur, Bulwark |
| Debuff | Bleed, Weaken, Stun, Slow, Burn, Chill, Shock, Marked, Sunder, Silence, Rot, Doom, Bewildered, Brittle, Fixated |

Owed is a marker, neither: nothing lifts it but its coming due. **An affliction** is one of the five debuffs that stack on a foe: Burn, Chill, Shock, Bleed and Sunder. A card that reaches every status road at once says "affliction", never two of the five.

## Vocabulary: special stats and effects

### Special stats

Evasion is the one Fundamental special stat. Six act through hits, basic attacks included, so they work without an ability; the three speed stats quicken one kind of action each. Classes and gear hold special stats at a level, medium or high (`SPECIAL`).

| Special stat | Tier | What it does |
| --- | --- | --- |
| Evasion | Fundamental | Chance to dodge a hit. |
| Accuracy | Specialist | Cancels that much of the target's Evasion: the answer to Evasion. |
| Crit damage | Specialist | Its crits hit harder. Crits land before Defense, so big crits get through it: an answer to Defense. |
| Double strike | Specialist | Chance a basic attack hits twice. Many small hits: good for breaking, bad against Defense, Thorns and hit counts. |
| Thorns | Specialist | Each time a hit lands on its holder, the attacker takes this much untyped damage. Thorns damage isn't a hit. Free: the holder spends nothing. |
| Lifesteal | Specialist | Each hit heals the holder for a share of its damage. |
| Siphon | Specialist | Each hit takes MP from its target, a share of its damage, and gives it to the holder. |
| Attack speed | Specialist | Basic attacks come sooner. Haste, Slow and Chill move it too, hidden. |
| Cooldown | Specialist | Abilities come round sooner. |
| Cast speed | Specialist | Shorter wind-ups. |

### Effects

Three Fundamental effects heal, hit everything and lift debuffs. Three Specialist ones get past Taunt, strip buffs and raise the fallen.

| Effect | Tier | What it does |
| --- | --- | --- |
| Heal | Fundamental | Restores HP to allies. |
| Area | Fundamental | Hits every foe, Hidden ones included. |
| Cleanse | Fundamental | Removes debuffs from an ally. |
| Seek | Specialist | A keyword an ability can carry: its targeting gets past Taunt. Without it, a taunt decides every single-target pick. |
| Dispel | Specialist | Removes buffs from a foe. |
| Revive | Specialist | Raises a knocked-out ally with some HP, even one knocked out in an earlier fight. The ally comes back with every action on its full cooldown; the Valkyrie's Einherjar version brings it back with all its actions ready. |

## Elements

Elements are themes only: names, art, and a class's or a region's flavour (Firebolt, a lance of ice, the Pyromancer, the Fire Mine). No damage, weapon, status or unit carries an element. There's no wheel, no resistance to one element, no weakness and no absorption. Burn, Chill and Shock keep their fire, ice and lightning looks, and their damage is untyped.

## How the Fundamentals play together

Most Fundamentals have a partner that opposes or undoes them, and two have a built-up twin. Stun is the exception: it plays against wind-ups, not against another piece.

| Pieces | How they play |
| --- | --- |
| Might, Weaken | Opposite sides of damage dealt. Dispel strips Might from a foe; Cleanse lifts Weaken from an ally. Shock cuts hits too, a little a stack, and adds to Weaken. |
| Haste, Slow | Opposite sides of tempo. Haste also feeds every built-up status, since a faster unit applies more stacks. |
| Guard, Sunder | Guard raises Defense against hits; Sunder raises all the damage its holder takes. |
| Evasion, Accuracy | A chance to dodge, and the stat that cancels it. Blur is the sure thing, once: Accuracy doesn't touch it. |
| Bleed, Regen, Cleanse | Bleed bursts with every hit, Regen heals over time, Cleanse lifts Bleed outright. |
| Shield, Heal, Rot | Shield prevents and Heal mends; under Rot, only Shield still works. |
| Taunt, Seek, Area | Taunt decides who foes can pick, split by draw when several units taunt. Seek gets past it, and Area skips picking altogether. |

Built up and kept up: Burn and Bleed for damage, Chill for control (its once-applied partner is Slow). Shock is built up too, but drains each time its holder acts, not over time; Bleed drains each time its holder is hit.
