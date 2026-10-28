# Step 5g hand-off: round 10

For a new session picking up step 5g (the feel pass) on branch `ccr-720ab7a0-u1zz6b`. Read `CLAUDE.md`, then `steps/05-core-set/5g-feel/intent.md` (the director's words, including their round-9 play notes), `design.md` (the loop), `tuning.md` (entries 0 to 9) and `reads/round-9.md` (the latest feel read). This page is where the director answers the open questions; the new session builds round 10 from the answers.

## Where it stands

Round 9 (the director's pacing reset after ten runs of their own) is built, tested (317 pass), committed and pushed; its feel read is `reads/round-9.md`. What round 9 changed is in `tuning.md` entry 9. Its effect:

| | round 8 | round 9 |
| --- | --- | --- |
| basic attacks, share of party actions | 46% | 63% |
| casts starting on an ally's tick | not measured | 16% |
| casts chained with no basic between | not measured | 18% |
| boss signature moves a fight | 1 to 2 | 2 to 3 |

## A correction the director should know

The designer said earlier that Armor 3 takes about a tenth off a hit. That was wrong (worked out against big hits). Measured over the tool's 48 runs:

| hits | taken off |
| --- | --- |
| party's physical hits on minions | 22% |
| on elites | 35% |
| on bosses | 41% |
| party's elemental hits on minions | 9 to 31%, by element |
| foes' physical hits on the party | 47% |

The last row is the director's "weak monsters do nothing": a typical foe swing is about 300 before Armor, and the formula (hit² ÷ (hit + 0.25 × Armor)) is hardest on small hits. Round 9's faster foe swings made each hit smaller.

## Round 10 as proposed (numbers only; build unless the director says otherwise)

- Foes swing bigger and less often (same damage a tick), so party Armor bites less on minions and the fast-against-slow axis matters.
- Siphon halved (the Monk and Valkyrie sit at full MP on it; the director wants mana harder).
- The Vampire's Blood gift and Frenzy 450 → 300 MP (it is dry by t15 to t23 in every fight; the cost rise landed hardest on its 2,000 pool).
- Soulfire and Crush trimmed below a wall's max HP (Soulfire hit a 6,500-HP Knight for 6,804; Crush hit 2,000-HP casters for 4,434).
- Act-2 elites recalibrated (42% won against the act-2 bosses' 55%).
- Chill tagged Ice, so a foe immune to Ice can't be chilled (an Ice Spirit's shatter healed it 1,718). The engine already resists any status tagged with an element the unit is immune to.

Then: `npm run content`, recalibrate (`npm run rogue:calibrate -- --runs 300`), `npx tsx src/rogue-feel.ts`, copy `out/feel` to `out/feel-r10`, a fresh reader on `reader-sheet.md`, `tuning.md` entry 10, and a pause for the director.

## Questions for the director

Answer under each; a short line is enough.

**1. Unmake (Hexer).** It waits for a foe to start casting, so it fires 0.18 times a fight. Should it be a rare, decisive counter (keep the wait), or a regular buff-strip on a timer?

> Answer:

**2. Thunder chord (Bard).** Several Shock on every foe, on the short word (22 ticks). A quick, small Shock applicator like the mages' spells, or a big chord now and then?

> Answer:

**3. Rockfall (Geomancer).** An Armor-scaled hit with a 6-tick wind-up on the short word; the reader saw it begun twice and never landed. A quick pebble (short wind-up, smaller) or a slow boulder (long cooldown, bigger)?

> Answer:

**4. Shield bash (Knight).** A Stun on the medium word (30 ticks) that hits for about 1,600. A control tool, timed against a foe's big move, or part of the Knight's damage?

> Answer:

**5. Blood gift (Vampire).** Pays a fifth of its max HP (900 to 1,200) to heal the lowest ally for as much plus Clarity; the reader called it wrong-shaped (526 to 1,350 healed). A sacrifice (a big HP price for a big heal, rarely) or a cheap top-up?

> Answer:

**6. Round 10's list above.** Build as proposed, or change anything?

> Answer:

## Still open, for the report (not asked now)

Fights that run long after they are decided; the t0 volley when abilities carry in charged and the empty opening when they don't (first fight of a run); casters dead before half-time; Burn's long tail of small pulses; Shock's size set by the foe's speed; Mend 7,467 on a troll; the Hoplite's one swing in 30 ticks; heals and buffs cast on allies who don't need them; the engine taking the first ready ability in slot order (a priority rule was offered as a question earlier and not answered). The close (knobs re-tuned for both modes, `report.md`, `DECISIONS.md`, the four core-set documents, the primer, `CLAUDE.md` status) is still to do.
