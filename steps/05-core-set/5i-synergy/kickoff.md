# Step 5i kickoff: gear, formations and upgrades, from a gap map

Written Oct 28, 2026, by the session that planned this step with the director, for a fresh session to start from. The director's words are in `intent.md` beside this file, verbatim. This file is the brief: what's decided, the designer's starting direction, the boundary with step 5h, the gate and the order of work. It's the designer's, not the director's: where the two differ, `intent.md` wins, and anything here can be challenged with evidence (`docs/method.md`).

## Read first

- `CLAUDE.md`, `docs/method.md`, `DECISIONS.md` (Step 5).
- `docs/core-set/`: `README.md`, `rules-and-vocabulary.md` (statuses, effects, target phrases, and the gear and formation rules this step loosens), `classes.md`, `gear-and-formation-lists.md`.
- `steps/05-core-set/5d-rogue/design.md` and `report.md`: the rogue's legendary pieces, their `aims`, and how they were priced (report, section 1B).
- `steps/05-core-set/5g-feel/report.md` and `handoff-round-10.md`: where the numbers stand.
- The content: `content/core-set/rogue.ts` (the legendary pieces and their rules, `aims`, affixes, the upgrade rule's config), `gear.ts`, `formations.ts`, `classes.ts`, `vocabulary.ts`; `src/rogue.ts` (`upgraded()`: today's single upgrade, 40% more of every amount or a quarter off the cooldown).
- `steps/05-core-set/5h-roster/`, the roster step running in parallel on branch `ccr-9cf44321-t2g2o5`. Read its `design.md` once it exists.

## Where this comes from

On Oct 28 the director asked for a reviewer's read of the fights with no control, and decided against any control during fights: preparation is the game, and a team should win or lose as a team, not because someone pressed a button at the right moment. **Don't propose in-fight levers.** Two pillars came out of that conversation:

- **the roster** (step 5h): a big bench, swaps any time outside fights, MP back on the bench, MP as a resource drained across fights, and parties picked to answer each fight's preview;
- **builds that synergize** (this step).

The director's own example is the target feeling. They put the Frostweaver between a Monk and a Bard carrying Chill gear (the Rime sigil puts several Chill on every basic attack, and the Frostfang is a dagger with the same rule). Two classes that never apply Chill fed the Frostweaver's Brittle (12% more damage per Chill stack), and the party was "exploding everywhere, left and right with chill". They want "a bunch of synergies like that", gear "that kind of transforms what you're doing", and "formations that push farther".

## Decided (the director's)

1. **No in-fight control.** Everything this step makes works through the build.
2. **No limits on the type of effect, on gear or on formations.** The old rules are lifted: formation effects limited to Fundamental statuses, never Taunt, flat; gear with no new modifiers. In their place, phrasing: "we just need to make it extremely clear what's happening in the way we phrase them."
3. **Start with a pass that maps the gaps and fills them.** "That doesn't mean only legendaries with crazy passives": stats to double down on, functional effects, ordinary pieces that do varied things, with care for cognitive load. "I'm okay if it's all legendaries for now, if that's what you think the right call is."
4. **Formations:** more themed, with bespoke effects that give a lot of control, and **two or three rarities**. Customizable formations are for one day, not now. How often formations are found is step 5h.
5. **Upgrades: two different upgrades per ability, and upgrades for passives.** These are small changes, not transformations: cooldown, scaling, stacks, damage, MP cost, an added effect or status, targeting rules, extra hits. A branch can give a class a status it lacks ("adding a status effect onto an ability that gives class new access to it"). The upgrade screen becomes a nested menu, not a flat list.
6. **The gate is a representative sample**, not a sign-off on every piece. The director is the only playtester and doesn't want to see everything before playing. Show a sample, take their feedback, apply it to the whole set.
7. **Numbers stay in the ranges the game already uses**, so balance mostly holds. Enemies get harder at the end, for the swapping and the synergies. A full balance pass comes later.
8. **The rogue mode only.** The director counts the campaign as gone.

## Out of scope

- Anything during a fight.
- More potion types, the Hourglass (a rewind or test fight), six abilities per class: later, at the director's word.
- The bench, swaps, the MP economy, where recruits, formations and training are found, formation rarity as a drop mechanism, events, the training screen's frame: step 5h.
- A general balance pass, and the questions in 5g's `handoff-round-10.md`.

## The designer's starting direction

### Enablers and payoffs

A synergy is an **enabler** (something that applies a status or sets up a condition) feeding a **payoff** (something that cashes it in). The Chill story is enablers on the wrong classes (the Rime sigil, the Frostfang) feeding a payoff on the right one (Brittle). The game already has many payoffs, among them:

- Brittle and the Frost shard (Chill);
- Pyre and the Cinder rod (Burn);
- Bleed, which pays out on hits;
- Shock, which pays out on actions;
- Judgement and the Crown of judgement (buffs on foes);
- Bedrock and the Stone idol (Shield);
- Backstab and Lacerate (crits);
- the targeting phrases "the foe with the most Burn / Chill / Sunder".

Most of them have enablers on only one or two classes. That's the gap this step fills.

### The gap map: the first deliverable

Build `gap-map.md` from the content files, not from memory:

- **Rows:** every mechanic a build can be about: Burn, Chill and the shatter, Shock, Bleed, Sunder, Might, Haste, Weaken, Slow, Stun, Silence and interrupts, Shield, Regen, healing, Clarity and MP, Taunt and Aggro, Hidden, crits, Thorns, Lifesteal and Siphon, revives, buffs on foes, Area, multi-hits and basic attacks.
- **Columns:** enablers and payoffs, each split by source: class kits (abilities and passives), ordinary gear, legendary pieces, formations.
- **What it marks:** which classes can reach each source (weapon kinds, armor weights, aims), and the empty and thin cells.

The map shows which builds exist today, which are one piece short, and which can't exist.

### Three grains for filling a gap

- **An upgrade branch** gives one class access to something.
- **A piece of gear** gives it to whoever wears it.
- **A formation** gives it to the whole party.

Pick the grain for each gap on purpose, and don't fill the same cell three ways. Branches suit "this class should be able to join that build" (Burning fist+ that adds Chill as well as Burn gives the Monk a way into a Chill party). Gear suits "any class can carry this". Formations suit "the whole party plays this way".

### Strong in the right party, not everywhere

The director finds much of the gear "really, really overpowered". A build piece should be worth a lot in the parties it's aimed at and little elsewhere. In 5d's pricing the Herald's horn (Regen for the whole party at every fight's start, +19 points) was strong in every party: that's the wrong kind of strong. The Frostfang next to a Frostweaver is the right kind.

Measure it: extend `npm run rogue:legendaries` (or the balance sheet) to price a piece **with its intended partner in the party and without**, and aim for a big gap, not a big average. Pieces that are strong everywhere get trimmed or moved toward a condition.

### Formations

The four examples the director called "very strong" are a starting point:

- *Frost line:* every ally's basic attacks add a Chill; Magic −1 in every slot.
- *Hunting party:* every ally's random single-target picks go to the foe with the lowest HP.
- *Choir:* when an ally gains Haste or Might, every other ally gains a little.
- *Fresh legs:* an ally who sat out the last fight starts this one with its abilities ready. This depends on 5h's bench and on cooldowns carrying between fights.

Rarities: a proposal to test is common (slot stats and small effects, like today's), rare (a themed effect), and legendary (an effect that bends a rule). The existing ten formations get rarities too. Each formation keeps one clear story: its name says how the party plays.

### Upgrades

- **Branches.** Each ability gets two branches, written by hand (today's single upgrade is generated: 40% more, or a quarter off the cooldown). Use only the small changes the director listed, each written as a short difference from the base:
  - Shield bash+: "waits for a foe's wind-up", or "40% bigger";
  - Barbed arrow+: "two hits", or "more Bleed".

  One branch of the two is often a plain size or tempo step and the other a behaviour or access step, so the choice is between more of the same and something new. Write each branch with the abilities a class actually has today (5g changed several, such as the Bard's War ballad and Allegro).
- **Passive upgrades** touch a class's identity, so they're fewer and rarer. One or two per class, chosen where the passive is weak or narrow (the 5f and 5g reads name candidates). Where they're offered is 5h's structure (the act's level-up is the obvious home); propose, don't build the structure.
- **Phrasing and load.** Every effect is written in the rules document's own words and target phrases. A branch reads as one short difference. If a piece needs two sentences, it's probably two pieces. The nested menu (5h builds its frame) shows the two branches side by side.

## The boundary with step 5h

| Step 5h owns | Step 5i owns |
| --- | --- |
| How often and where recruits, formations and training are found (map rooms, events, rarity as a drop mechanism), the bench, swaps, the MP economy, and the training screen's frame (nested, built with one upgrade per ability until 5i fills in the second branch and the passives). | What the gear, the formations and the upgrades are, their rarities, and their numbers. |

If this step needs a structural change, say so in the design and leave 5h's code alone. An example: a passive upgrade offered at the act's level-up, or an event that hands out branches.

## Gate and order of work

1. **Now, in parallel with 5h (design only, no code):**
   1. Read, then write `gap-map.md`.
   2. Write `design.md` by the method:
      - the rules the content is generated by;
      - the representative sample;
      - an intent map;
      - challenges;
      - predictions;
      - open questions.
   3. **The sample:**
      - about eight pieces of gear across the kinds: a legendary that bends a rule, an enabler, a payoff, a stat pushed harder, an ordinary piece with an effect;
      - about four formations: one of each rarity, and a bench-aware one;
      - about six ability branches over three classes, including one that gives a class a status it lacks;
      - two passive upgrades.

      Include the ones you're least sure of.
2. **Gate:** the director reacts to the sample. Apply their feedback to the whole set, still as design. Show them a second sample if the feedback changed the rules.
3. **After 5h is merged into main** (check `git log origin/main`):
   1. Merge main.
   2. Build the content and the schema for branches and passive upgrades; fill 5h's nested screen.
   3. Price the pieces (with and without their partners), and run a feel read (`npx tsx src/rogue-feel.ts`, an agent reading fights tick by tick, as 5g did).
   4. Re-tune the rogue knobs harder (`npm run rogue:calibrate`, then `npm run rogue:tune`), then run AI playtests (`npx tsx src/rogue-play.ts`).

   Building before 5h lands means pricing everything twice: 5h moves MP pools and costs and the bench size, and so the worth of every MP piece and how often a niche piece finds its partner.
4. **Report** by the method, decisions first. The director then plays it.

## Open questions to bring to the design gate

- **Branches:** pick one of the two for good (the director's first idea was "two upgrades that you have to pick from"), or can a run ever take both?
- **Formation rarities:** two or three?
- **Ordinary gear:** may common and uncommon pieces carry effects, or do effects stay on rare and legendary pieces for this pass?
- **The core set's 14 powerful pieces,** which 5d found to be sidegrades: fold them into the map, or leave them?

## Tools

`npm run content` (regenerate the pack after content changes), `npm test`, `npm run typecheck`, `npm run validate`, `npm run rogue` (whole runs with the simulated player), `npm run rogue:legendaries`, `npm run rogue:calibrate`, `npm run rogue:tune`, `npm run balance` (the balance sheet), `npx tsx src/rogue-feel.ts` (fights to read, in seconds), `npx tsx src/rogue-play.ts` (the AI playtester's game). Run `npm install` first.

## Housekeeping

The step's folder is `steps/05-core-set/5i-synergy/`. Commit the design work as it goes, and end each session at a gate by updating `CLAUDE.md`'s Status, committing and stopping for the director.
