# The feel reader's sheet

You are reading fight logs from a party-based JRPG dungeon crawler with automatic combat (a roguelite mode: a party of three climbs three acts of fights, elites and a boss). You read them as a game designer watching fights play out, not as a player: you see both sides' HP, every status with its stacks, MP spent and gained, and each party member's kit at the top of each pack. `glossary.md` says what each status does, with its numbers, and the scale of things. `summary.md` holds the numbers over every fight played (hundreds), so you can check whether what one pack shows is typical. `index.md` lists the packs.

Read every pack tick by tick. Then write one document, plain and honest, with pack numbers and ticks as evidence for every claim. Judge the subjective combat experience: what a player watching this fight would feel, notice, or never notice. Do not propose number changes or new rules; say what you saw and what it felt like, and where something looked wrong say what wrong looked like (too big, too small, too rare, invisible, absurd, a one-shot, a slog).

## Per pack (short: 3 to 6 lines each)

1. Retell the fight: the shape of it (how it opened, the middle, how it ended), in a few lines.
2. What each party member actually did: did it play its description? What of its kit never mattered?
3. Statuses: which were visible and mattered, which read as nothing?
4. Anything that looked wrong, absurd or flat, with the tick.

## When the packs are a build's

When the packs come from `npx tsx tools/rogue-feel.ts --builds ...`, each is headed with its build, route and rung and its starting HP and MP, and `cards.md` beside them holds the cards of the builds played (from `docs/build-cards.md`): what each should look like; *Gear design: the builds* (`docs/gear-design/builds.md`) is the design behind it. Read the card before the packs. For each build, add to the per-pack lines and write one short section:

- **Could you tell which build it was** from the fight alone, before reading its name? What gave it away, or what made it look like another build?
- **Its card, line by line:** did its picture show (*Watch for*)? Did its damage come from where the card says, in about that order (use the pack's tally)? Did its rhythm match the card's row: when the damage fell, when it was in danger, how often the fight turned, what it spent?
- **Its rung:** did it show what its rung should add, or only bigger numbers than the rung below?
- **Its fights:** was its best fight better than its worst, and in the way the card says?
- **Engines:** they're reference, not a checklist (the cards' *Engines are reference*). Say so if you saw one fire. Judge one only where the party held every part of it; an engine that didn't show is never a miss.
- **Wrong:** anything from the card's *Wrong looks like* and the list every card shares: a passenger, a loop that doesn't stop, a stall to the enrage, a trigger that always loses the fight.

## Across all packs

5. **Rhythm.** Does a fight breathe? Where are the dead stretches and the pile-ups? Do wind-ups read (does a "begins X" line pay off visibly)? Is the opening a volley or a build? Do regular fights, elites and bosses feel like different lengths and shapes?
6. **Abilities.** Which abilities fire often enough to matter, which fire once or never (first-cast ticks against fight length)? Which are too big or too small for what they cost in MP, cooldown and wind-up? Does each unit have a tempo of its own?
7. **Statuses.** For each status you saw (Burn, Shock, Bleed, Chill, Sunder, Might, Haste, Taunt, Guard, Weaken, Stun, Silence, Regen, Clarity, Shield, Aegis...): did it matter, was it legible, and did its shape feel right (a ramp that builds with upkeep, a burst, a lock, a wall)? Is any status a nuke in one application, or pinned at a ceiling from one application? Which never showed anything a player could notice?
8. **Mana.** Who ran short, who never spent? Did any class's mana ever change what it did? Did Clarity, Refrain or Siphon show?
9. **Classes.** For every class seen: does it play its description? Where does its damage come from (basic attacks, abilities, statuses) and does that fit its fantasy? Which classes felt flat, which felt like passengers, which felt dominant? Say which you'd rate as the three worst-feeling and the three best-feeling, and why.
10. **Enemies and bosses.** Do bosses' moves come often enough to be played against, and do they matter when they land (one-shots, nothing, something in between)? Do elites feel like elites? Do minions act before dying? Do the regions feel different? Which foes felt like nothing?
11. **Drama.** Close calls, comebacks, one-shots, slogs, fights decided in the first ten ticks, fights that went on long after they were decided.
12. **The ranked list.** What looked wrong, worst first, up to fifteen items, each with the evidence (pack, tick) and how often the summary says it happens. Then what looked right.

Write the document to the path you are given. Keep it under about 2,500 words; be specific rather than long.
