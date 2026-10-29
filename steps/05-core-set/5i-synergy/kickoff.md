# Step 5i kickoff: gear, formations and upgrades, from a gap map

Written Oct 28, 2026, by the session that planned this step with the director, for a fresh session to start from. It was revised twice the same day after their notes. The director's words are in `intent.md` beside this file, verbatim. This file is the brief: what's decided, the designer's starting direction, the boundary with step 5h, the gate and the order of work. It's the designer's, not the director's: where the two differ, `intent.md` wins, and anything here can be challenged with evidence (`docs/method.md`).

## Read first

- `CLAUDE.md`, `docs/method.md`, `DECISIONS.md` (Step 5).
- `docs/core-set/`: `README.md`, `rules-and-vocabulary.md` (every status, special stat, effect and target phrase; the gear and formation rules this step loosens), `classes.md`, `gear-and-formation-lists.md`.
- **`steps/05-core-set/5h-roster/design.md`:** the roster step this one builds on. It holds the new reward economy and its numbers, the MP rules, the rarities as a drop mechanism and the training screen.
- `steps/05-core-set/5d-rogue/design.md` and `report.md`: the rogue's legendary pieces, their `aims`, how they were priced (report, section 1B).
- `steps/05-core-set/5g-feel/report.md` and `handoff-round-10.md`: where the numbers stand.
- The content: `content/core-set/rogue.ts` (the legendary pieces and their rules, `aims`, the affixes, rarities), `gear.ts`, `formations.ts`, `classes.ts`, `vocabulary.ts`; `src/rogue.ts` (`upgraded()`, today's single upgrade: 40% more of every amount, or a quarter off the cooldown).

## Where this comes from

On Oct 28 the director asked for a reviewer's read of the fights with no control, and decided against any control during fights: preparation is the game, and a team should win or lose as a team, not because someone pressed a button at the right moment. **Don't propose in-fight levers.** Two pillars came out of that conversation:

- **the roster** (step 5h): a small bench that grows by choice, swaps any time outside fights, MP drained by fighting and restored on the bench, and more loot, legendaries above all, sometimes as choices between kinds;
- **builds that synergize** (this step).

The director's own example is the feeling to aim at. They put the Frostweaver between a Monk and a Bard carrying Chill gear (the Rime sigil and the Frostfang put Chill on every basic attack). Two classes that never apply Chill fed the Frostweaver's Brittle, and the party was "exploding everywhere, left and right with chill". They want "a bunch of synergies like that", gear "that kind of transforms what you're doing", and "formations that push farther".

## Decided (the director's)

1. **No in-fight control.** Everything this step makes works through the build.
2. **No limits on the type of effect, on gear or on formations.** The old rules are lifted: formation effects limited to Fundamental statuses, never Taunt, flat; gear with no new modifiers. In their place, phrasing: "we just need to make it extremely clear what's happening in the way we phrase them."
3. **Start with a pass that maps the gaps and fills them.** "That doesn't mean only legendaries with crazy passives": stats to double down on, functional effects, ordinary pieces that do varied things, with care for cognitive load. "I'm okay if it's all legendaries for now, if that's what you think the right call is."
4. **Formations:** more themed, with bespoke effects that give a lot of control, and **two or three rarities**. Customizable formations are for one day, not now.
5. **Branching upgrades everywhere: every ability and every passive gets two different upgrades.** The player picks one of the two (the director's first idea: "two upgrades that you have to pick from"). They're small changes, not transformations: cooldown, scaling, stacks, damage, MP cost, an added effect or status, targeting rules, extra hits. A branch can give a class a status or a role it lacks. Passives get two branches like abilities do, not one.
6. **The gate is a representative sample**, not a sign-off on every piece. Show a sample, take the director's feedback, apply it to the whole set.
7. **Numbers stay in the ranges the game already uses**, so balance mostly holds. Enemies get harder at the end. A full balance pass comes later.
8. **The rogue mode only.** The director counts the campaign as gone.
9. **Testing with hand-built parties, not whole-run simulation** (as 5h): representative parties per act and tier, written down. Whole-run simulation comes after this step, when every system is in, if it stays cheap.

## What 5h decided that this step builds on

- **The gear economy (5h design, the reward plan).** Worked out from the roster's seats, a full run should take about 28 pieces and see about 80. It should take about 12 legendaries and see about 25: if one legendary in three fits what a run is doing, that's two fitting legendaries an act. Today a full run takes about 17 pieces and 4.7 legendaries, so 5h raises the volume, legendaries most. **A third of offered gear is for classes not in the roster**, so a piece can make you want a class (today it's almost none). About 40% of reward choices are between kinds (gear against a formation, a recruit or a seat at camp); the rest stay between pieces. A run that sees about 25 legendaries sees most of today's 43, so new legendaries matter for variety. This step makes the volume worth having:
  - pieces specific enough that a run wants to switch;
  - pieces that make you want a class;
  - pieces that combo with each other.
- **What rarity means.** Today a rarity is more stat affixes on the same piece (uncommon one, rare two, legendary a rule plus two). So the highest rarity is nearly always the pick, which works against switching. Look at whether rarity should mean a stronger or more specific effect rather than more stats, and what affixes are for.
- **MP rules.** Every class's MP regen is 0, and MP regen exists only on gear and Caravan's Quartermaster seat, working in fights on whoever wears it. The bench recovers a flat share of max MP per fight sat out, which gear doesn't touch. Every class runs dry in about two to three fights from full. So the MP pieces change meaning:
  - MP regen pieces are a fighter's way to last another fight;
  - the Thirsting jewel's −1 MP regen drawback is now nothing;
  - Clarity, Refrain, Siphon and the Soul jar are the support path.

  Revalue them.
- **Formation rarity as a drop mechanism:** common, rare, legendary, rolled by act. The nine existing formations get provisional rarities in 5h; this step sets the final ones.
- **The nested training screen:** member → its abilities and passive → that one's upgrades. 5h builds it with today's single upgrade; this step gives every ability and passive its two branches.
- **Slot rules** (three slots; amulets for anyone; armor by heaviest weight) are unchanged in 5h. If the map says a slot rule is part of the problem, propose a change.
- **What 5h's feel read found that this step can answer** (`steps/05-core-set/5h-roster/reads/round-4.md`, report §4):
  - **Third slots are cast about once in one or two fights:** Pyre 0.52 a fight, Fireball 1.05, Stillness 0.83, first landing around t15 to t32. The read first said they hardly existed, but that was a harness error (5h round 5): its rosters started every fight uncharged. The Hoplite casts few abilities a fight. Upgrade branches can still shape how often a big slot comes.
  - **Revives:** both cost 650 since 5h (the director's). Valhalla is now cast early; Raise rarely, because the Cleric (HP 2) usually falls first.
  - **Engines can lock a boss.** A Chill engine kept the Silent One stunned about 48 of 70 ticks, with a Stun on every shatter. Synergies will make more engines like this. Decide what a boss does about one before pieces make it easy.
  - **Siphon pays on overkill** (a Backstab into 266 HP refunded 615 MP). It matters when Siphon pieces are revalued.
  - **The worst-feeling classes:** the Cleric, whose heals miss the moment; the Hoplite, whose kit arrives after the fight; and the Hexer, which dies before its kit plays.

## Out of scope

- Anything during a fight.
- More potion types, the Hourglass (a rewind or test fight), six abilities per class: later, at the director's word.
- Roster size, swaps, the MP economy's numbers, how often and where things drop, rooms and events: step 5h.
- A general balance pass, and the questions in 5g's `handoff-round-10.md`.

## The designer's starting direction

### Enablers and payoffs

A synergy is an **enabler** (something that applies a status, sets a condition or gives a resource) feeding a **payoff** (something that cashes it in). The Chill story is enablers on the wrong classes feeding a payoff on the right one. Most payoffs in the game have enablers on only one or two classes. That's the gap this step fills, and it's only one kind of gap: the map below also finds reactions, answers and roles that only one class can fill.

### Work as a designer, not a checklist

You're the game's designer here. Look at the mechanics the game has, think about the builds and synergies that make the roguelites you know worth replaying, and pick the ones worth having in this game. Then fill the gaps that stop them existing. For example:
- Slay the Spire's relics and card synergies;
- Hades' boons, duo boons and Daedalus hammer (its two-way upgrades are the model for the branches);
- Vampire Survivors' evolutions (a weapon plus a passive);
- Path of Exile's support gems;
- Diablo's legendaries that change a skill;
- Teamfight Tactics' items and traits;
- The Bazaar's items that charge or trigger each other;
- Balatro's jokers;
- Monster Train's clans and upgrades.

Not every mechanic deserves a build: a synergy built on Clarity's ticks would be strange, and that's fine. Say why you chose what you chose.

### The gap map: a tool, not a checklist

Build `gap-map.md` from the content files, not from memory. The full list of mechanics below is there so you don't anchor on the few this file happens to name. It isn't a quota, and nothing needs to cover every row.

- **The 22 statuses:** Bleed, Regen, Shield, Might, Weaken, Guard, Stun, Slow, Haste, Taunt, Burn, Chill and its shatter, Shock, Ward, Sunder, Silence, Hidden, Rot, Clarity, Aegis, and the enemy-only Doom and Bulwark (as things the party reacts to).
- **The 7 special stats:** Evasion, Accuracy, Crit damage, Double strike, Thorns, Lifesteal, Siphon.
- **The 6 effects:** Heal, Area, Cleanse, Seek, Dispel, Revive.
- **The stats:** HP, MP, MP regen, Attack, Magic, Armor, the seven resistances, Crit chance, Aggro and draw.
- **Damage kinds:** slashing, piercing and blunt; Fire, Ice, Lightning, Wind, Earth, Light, Dark; untyped. Each element's job (rules document, Elements).
- **Actions:** basic attacks (each weapon kind's speed and size), abilities, wind-ups and casting, interrupts, cooldowns and their carry between fights, multi-hits, MP costs.
- **Reactions and triggers:** the fight's start, a hit landing or taken, a dodge, a miss, a crit, damage dealt or taken, an HP threshold, being healed, an action starting, finishing or interrupted, a status gained or lost, an ally or a foe knocked out, a revive, a foe winding up, a foe buffed, a foe stunned or silenced.
- **Targeting:** every target phrase in the rules document (lowest HP, highest Attack or Magic, most Burn, Chill or Sunder, a foe with a buff, lowest share of HP, least MP, a knocked-out ally, every foe or ally), Seek, Taunt-ignoring, Hidden.
- **Run-level resources:** HP carried between fights, MP carried and the bench, knockouts carried, cooldowns carried, supplies.
- **Formation seats:** Aggro front and back, the seat's stat changes, the effect.

**What the map records,** for the mechanics a build could be about (skip the ones that can't carry one, and say so in a line):
- the enablers and the payoffs, each by source: class kits (abilities and passives), ordinary gear, rogue legendaries and affixes, formations;
- which classes can reach each source (weapon kinds, armor weights, `aims`);
- the reactions and answers the party has to it.

**Mark:**
- the empty and thin cells;
- the rows only one class can play;
- the rows that are strong everywhere (no build needed).

### Three grains for filling a gap

- **An upgrade branch** gives one class access to something.
- **A piece of gear** gives it to whoever wears it.
- **A formation** gives it to the whole party.

Pick the grain for each gap on purpose, and don't fill the same cell three ways. Branches suit "this class should be able to join that build". Gear suits "any class can carry this". Formations suit "the whole party plays this way".

### Strong in the right party, not everywhere

The director finds much of the gear "really, really overpowered". A build piece should be worth a lot in the parties it's aimed at and little elsewhere. In 5d's pricing the Herald's horn (Regen for the whole party at every fight's start) was strong in every party: that's the wrong kind of strong. Price pieces **with their intended partners in the party and without**, using the hand-built parties, and aim for a big gap between the two, not a big average. Pieces that are strong everywhere get trimmed or moved toward a condition.

### Formations

They're themed, each with one clear story, its name saying how the party plays. The effects can now be anything, phrased plainly. The director called four examples "very strong" (*Frost line*, *Hunting party*, *Choir*, *Fresh legs*; their lines are in `intent.md`). Treat them as proof of the range, not as the set: the full set comes from the map.

### Upgrades

- **Every ability and every passive gets two branches**, written by hand, each as one short difference from the base ("Shield bash+: waits for a foe's wind-up").
- **Make the two branches different kinds of thing** where the map allows: often one a size or tempo step and the other a behaviour, access or targeting change, so the choice is between more of the same and something new.
- **Write them on the abilities the classes have today:** 5g changed several, such as the Bard's War ballad and Allegro.

### Phrasing and load

Every effect is written in the rules document's own words and target phrases. A branch reads as one short difference. If a piece needs two sentences, it's probably two pieces.

## The boundary with step 5h

| Step 5h owns | Step 5i owns |
| --- | --- |
| How many rewards, of which kinds and rarities, where they're found, the share for classes off the roster, the bench, swaps, MP numbers, the training screen's frame. | What the gear, formations and upgrades are; the affixes; the formations' rarities; any slot rule change. |

If this step needs a structural change (a new event that hands out branches, say), propose it and leave 5h's code alone.

## Gate and order of work

1. **Design, in parallel with 5h's build (no code):**
   1. Read, then write `gap-map.md`.
   2. Write `design.md` by the method:
      - the rules the content is generated by;
      - the representative sample;
      - an intent map;
      - challenges;
      - predictions;
      - open questions.
   3. **The sample shows what you'd build.** Pick the synergies you think are strongest and the ones you're least sure of. Include:
      - about eight pieces of gear across the kinds you'd make;
      - about four formations;
      - about six ability branch pairs over a few classes;
      - two passive branch pairs.

      Each item says which synergy or gap it's for.
2. **Gate:** the director reacts to the sample. Apply their feedback to the whole set, still as design. Show them a second sample if the feedback changed the rules.
3. **After 5h is merged into main** (check `git log origin/main`):
   1. Merge main.
   2. Build the content and the schema for branches on abilities and passives; fill 5h's nested screen.
   3. Price the pieces with the hand-built parties (with and without their partners), and run a feel read (`npx tsx src/rogue-feel.ts` and an agent reading fights tick by tick, as 5g did).
   4. Re-tune the knobs harder on the hand-built parties.

   Building before 5h lands means pricing everything twice: 5h moves MP, the reward counts and the roster.
4. **Report** by the method, decisions first. The director then plays it.

## Open questions to bring to the design gate

- **Formation rarities:** two or three?
- **Ordinary gear:** may common and uncommon pieces carry effects, or do effects stay on rare and legendary pieces for this pass?
- **What rarity means:** more stats, or a stronger or more specific effect (above)?
- **The core set's 14 powerful pieces,** which 5d found to be sidegrades: fold them into the map, or leave them?
- **A slot rule change,** if the map points at one.

## Tools

`npm run content` (regenerate the pack after content changes), `npm test`, `npm run typecheck`, `npm run validate`, `npm run balance` (the balance sheet), and 5h's tuning tools: `src/rogue-parties.ts` (the hand-built rosters: add or change rosters there to price pieces with and without their partners), `npm run rogue:calibrate -- --reps 3` (each fight's knob against those rosters, each fielding its best three of five), `npx tsx src/rogue-acts.ts` (MP: endurance by class, the act road with and without tonics), `npx tsx src/rogue-feel.ts --rosters` (fight packs from the rosters for a feel read). Run `npm install` first.

## Housekeeping

The step's folder is `steps/05-core-set/5i-synergy/`. Commit the design work as it goes, and end each session at a gate by updating `CLAUDE.md`'s Status, committing and stopping for the director.
