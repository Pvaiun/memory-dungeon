# Step 5g design: the feel loop

The director's intent (`intent.md`): continue 5f's balancing with the method changed. Rogue first; a feel read after every round; short simulations beside the reads; numbers, not behaviour; questions to the director one at a time, as they come up; the enemy behaviours of 5f's intent as a secondary pass. This document is the loop and its rules, not a design of the game: the game's design of record is still the core set's documents, as 5f left them.

## The tool

`npx tsx src/rogue-feel.ts` (four to eight seconds): the simulated player plays 48 rogue runs at heat 0 with every fight logged, with the leader cycling through all 16 classes and the draft picked at random, so every class is seen in about 50 to 100 fights (its own drafter never takes the Frostweaver or the Hexer). It writes to `out/feel/`:

- **Reading packs** (`pack-NN.md`, 12 a round): a spread of fights (each act: a regular fight early and late, an elite, the boss; the rest the longest), each chosen to cover classes not yet covered, with `--focus class,...` to put named classes first. A pack is the fight in the designer's view: the party's kit at the top (stats, gear, abilities with cooldown, MP, wind-up, first-ready tick and size at the unit's stats), the foes with their abilities and numbers, then every tick (both sides' HP, every status with its stacks and who laid it, MP spent on each cast, MP gained when it's worth seeing), then a tally (each unit's actions, first casts, damage by source split into basic / abilities / statuses, healing, MP; each foe's actions; each status's applications, peak and damage).
- **`summary.md`**: the numbers over every fight played (about 370): fights by act and tier (length, wins, knockouts), each class's damage by source and share, healing, knockouts, MP; each ability's casts a fight and first cast; each status's applications, peak stacks and damage share; each foe's appearances, whether it acted and what it cast.
- **`glossary.md`**: what each status does, with its numbers, and the scale, for the reader.

A shared status's damage (Burn, Shock, Bleed: one total, many appliers) is split among the party units by the stacks each added to that foe's total.

## The loop

1. **Read.** A fresh agent that has seen none of this step's notes reads the packs with `reader-sheet.md` (the same sheet every round, so reads compare) and writes `reads/round-N.md`, ending with what looked wrong, worst first, and what looked right. It judges the subjective experience and proposes nothing.
2. **Change.** Act on the read, worst first, with numbers: amounts applied, costs, cooldowns, durations, sizes. Never a new rule that changes what a thing does. Where a finding needs a behaviour change, one question goes to the director and the finding waits.
3. **Check.** `npm run content`, then the tool again on the same seeds; the summary says whether the numbers moved as meant. `npm run balance -- --sets rogue` (about a minute) when a round changes something the sheet's bands watch.
4. One line a round in `tuning.md`: what the read found, what changed, what the summary says.

The loop runs until a read finds nothing in its ranked list that a number can fix, or only things already put to the director.

## Rules for this step

- **Caps are safeties, not tuning.** A ceiling a single application reaches is a behaviour change dressed as a number (the director's: the Burn cap). 5f's Burn cap comes out; the other caps (Shock, Might, Sunder, Chill) stay only where an application in normal play sits well under them, and the applications are sized so that they do.
- **A status's shape comes from three numbers:** stacks an application adds, the share lost each pulse or trigger, and damage (or effect) a stack. The ramp the documents ask for ("they stack and drain away, so they pay off only with upkeep") is applications small against the ceiling that upkeep reaches.
- **Targeting and conditions stay as 5f left them** unless the director says otherwise (Stand fast's "ally with the least MP" included).
- **Win rates are read, not tuned,** until the end; the knobs are frozen through the rounds and re-tuned once at the close, as in 5e and 5f.
- The three standing rules: a status scales by its stacks, MP costs by hand, Aggro by draw.

## What the step ends with

`report.md` leading with the questions put to the director and their answers, the last read, the before-and-after numbers, and what's still off; `DECISIONS.md`, the four documents, the primer and `CLAUDE.md` in line.
