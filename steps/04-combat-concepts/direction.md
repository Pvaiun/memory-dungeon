# Step 4: where the sketches landed

Oct 17, 2026. Agreed with the director in conversation after the second pass of sketches. It replaces both passes as the starting point for `design.md`. Nothing here is final until `design.md` is approved, and nothing goes into `DECISIONS.md` before then.

## How it got here

- The director set both passes of sketches aside. The first was too contrived and too close to the placeholder schema. The second built each sketch around a signature gimmick (grudges, temperaments, a stagger ladder) that ran the whole fight, when step 4 is after the bones.
- The base is the shared frame almost every party-based JRPG has, kept generic. What makes this game distinct is how preparation controls the fight, not a combat gimmick.
- Several forms of control were weighed: per-unit orders, party-wide postures, swappable plans, a few calls held in reserve, and a gambit-style rule list. Input during the fight kept turning into a gimmick, or into execution. Gambits moved execution to before the fight, and the director agreed with the challenges to them. The intent marked an in-fight input as a lean ("if the design doesn't fit one in, or a better design comes without it, that's okay").

## The base

Generic and simple, settled in `design.md`:

- a small set of base stats shared by every unit
- health, plus other resources (MP that lasts the whole run is favoured)
- statuses and modifiers with stacking rules
- turns played straight: rounds in speed order, with no turn manipulation
- units with gear

## The control model

- **No input during a fight.** Fights should be fast enough that this is fine.
- **Control is the loadout.** For each unit, the player picks which two of its class's four actives it brings. Units then act on their own with very simple AI: a basic attack by default, and each active carries its own rule for when it fires.
- **Loadouts are chosen before the dungeon** and fixed for the run. Perks stay the in-run adjustment.
- **Every option is a sidegrade,** never an upgrade.

## Units

The director's model (Oct 17), replacing an earlier version where each unit picked one active and one passive, which was too little to watch:

- **Each class has one passive, unique to it and fixed.** It's the class's identity, and it can change any part of the kit: turn the basic attack into a heal, change whom it targets, make it hit several times, add something like a counterattack after a dodge, or double the unit's armour. Passives should be big, rule-changing pieces (the director's "keystones"); small bonuses belong on gear.
- **By default, every unit makes its basic attack,** as its passive shapes it.
- **Each class has four actives, and a unit equips two.** Six loadouts per class.
- **No specializations.** What would have been specializations are just more classes: a crit archer and a rapid-fire archer are two classes with different passives.
- **Unlocks:** classes, actives, formations and gear.
- **What the player picks:** which classes, and which two actives each one brings.

For the bones, this sets what the base rules must carry: a basic attack defined as data that a passive can rewrite (its effect, its target, its number of hits), events a passive can hang off (a dodge, a hit, an ally dropping low), and stats a passive can multiply.

## Open

1. **How a class's four actives arrive, and "levelling".** The designer suggests a class arrives with two, useful from day one, and earns the other two as rewards: small, frequent unlocks between the big ones. The director earlier mentioned getting abilities "through leveling it up or through rewards". The concept has no levels or XP, and quests are the fast road past a wall (step 3), so abilities earned by playing a class would shift the balance between being walled by quests and walled by play. Rewards only, or a deliberate, light class mastery from play?
2. **Two of the same class in a party?** The designer suggests one of each class per party, so that choosing classes stays the main choice.
3. **What an active runs on:** MP that lasts the run, cooldowns, or both. A bones question for `design.md`.
4. **Later, for step 10:** capstone gear could grant a second passive or bend the class's own, as a home for build-defining items.
