# Memory Dungeon Game: Content Schema

Design plan step 1 · schema 0.3 · Oct 15, 2026 · second revision after the director's review

## What this step produces

| File | What it is |
| --- | --- |
| `src/schema.ts` | The schema, in TypeScript with zod. The source of truth. |
| `schema/content-pack.schema.json`, `schema/party.schema.json` | The same schema as JSON Schema, for any other tool or language. |
| `fixtures/hollow.pack.json` | The worked example: one small pack with every type in it. **Placeholder content**, not game design (see below). |
| `fixtures/by-type/` | A few examples of each type, pulled from the pack by `npm run examples` (generated, not committed). |
| `fixtures/party.json` | An example party loadout, the engine's input. |
| `src/validate.ts`, `src/cli.ts` | The validator. |
| `PRIMITIVES.md` | The engine primitives and what each means, generated from the schema. |
| `tests/` | 93 tests: the example passes, every rule is caught when broken, and probes for later steps. |

```
npm install
npm run validate        # validate the worked example
npm test                # all tests
npm run docs            # regenerate PRIMITIVES.md
npm run build:schema    # regenerate the JSON Schemas
npx tsx src/cli.ts fixtures/hollow.pack.json --party fixtures/party.json --dungeon hollow_of_the_grey_mother
```

**What's real and what's placeholder.** The schema, the validator and the tests are step 1's deliverable. Everything in `fixtures/` is placeholder: every class, number, name, enemy and combat formula is there to prove the schema works and to give the step 2 engine something to run. That includes the `design` block: its numbers (5 slots, 3–4 perk picks, pools of 10–15…) come from the concept spec, which was bullish on them, so they're targets the validator enforces for now and are likely to change. Changing one is a one-line edit in the pack, not a schema change.

## Decisions from review

| Topic | Decision | In the schema |
| --- | --- | --- |
| Units | Every unit is a class plus a specialization, such as Ranger: Archer. Each is one unit the player owns once; two specializations of a class can share a party. 3 to 4 specializations per class. | A specialization is a unit; the party check allows each once. |
| Battlefield | No geometry. No rows, no reach, no "melee hits the front." Any unit can target any unit. | Rows, lanes, reach and adjacency removed. |
| Formations | Romancing SaGa style: each formation is 5 bespoke slots with their own effects, open to any unit. Front, middle and back are only where a slot is drawn. A formation builds a theme and a party loadout, and it's where keys get multiplied. | Slots have a cosmetic `layout` and their own `rules`; formations can also have party-wide `rules`. |
| Enemies | Enemies have no formation. The system isn't symmetrical; enemy behaviour just has to make sense and be interesting. | A fight is a plain list of enemy ids. |
| Targeting | Shouldn't take the player's brainpower. Basic attacks follow a few traditional JRPG habits; abilities carry their own targeting. | Weighted picks follow an `aggro` stat. Behaviours are `standard` (by aggro) and `finisher` (most wounded). Most units name none. |
| Keyholes | A prediction, never a win rule, and never shown to players. Mostly gimmicks: passives, abilities, states, summons, not just base stats. Each is designed with the player's keys in mind as counters, usually several per keyhole, then tuned by mass simulation. | On enemies; a keyhole can name the `mechanic` it comes from. The validator warns when a boss's keyholes are all base stats. |
| Abilities | Active abilities fire automatically off cooldown, each with its own targeting. | `active` with cooldown and `useWhen`. |
| Statuses | Statuses on enemies are shared, and cross-pollination is expected. Keep enemy-facing statuses like bleed niche through roster design, and prefer self-built stacks like Lethality. | Statuses are `on: self` or `others`; a full-set check warns when one spreads too widely. |
| Gear | Efficacy gear is numbers, optionally with one very basic condition. Powerful pieces and capstones may carry rules and actives. Capstones fit any class to start, with the option to restrict. | Simple `if` on stat modifiers; optional `class` on capstones. |
| Copies | Players own a count of each item; the party menu flags using more copies than you own. | `party.gearCount`. |
| Wording | "Keys" is only an encounter term; quest rewards are unlocks. "Two Rangers" means at least two; "only two units" at most two. Perks that can't apply are still offered. | `source: "unlock"`; `offerInapplicable: true`. |

## Formations

In the SaGa games each formation slot has a few simple effects: faster or slower, easier or harder to target, auto-defend after its turn, attack boosts. A few formations add a party-wide effect, such as "everyone acts before the enemy, but evasion drops." The schema expresses all of these as slot rules over ordinary stats. Three new stats carry most of the load:

| Stat | Default | What it does |
| --- | --- | --- |
| `aggro` | 1 | How likely enemies are to pick the unit. "Easily targeted" is ×3; "hard to target" is ×0.4. |
| `damage_dealt` | 1 | Multiplies outgoing damage before armour, so a big multiplier is the key against a high-defence enemy. |
| `damage_taken` | 1 | Multiplies incoming damage. Auto-defend applies a short GUARD status that lowers it. |

The worked example has five formations:

| Formation | Slots |
| --- | --- |
| Open Order (starter) | Five empty slots. |
| Hearth Guard | The SaGa example from your feedback. Front Shield: aggro ×3, defence ×1.5. Two empty middle slots. Two back Hunters: +3 speed, damage ×1.15. |
| Phalanx | Three front shields: two block more and auto-defend; the point doubles defence and draws attacks. Two back Strikers: hard to target, more crits. |
| Hunting Party | Headsman: much slower, damage ×1.5 (your big-hit key; any damage dealer fits). Two Flankers: basic attacks go for the most wounded. Sanctuary: single-target support lands here first. One empty slot. |
| Flash Flood | No slot effects. Party-wide: everyone acts first, evasion −5%. |

Each slot with an effect carries a line of player text ("Much slower. Hits half again as hard."), and the validator warns when one is missing.

## Verbs and the numerical systems

The engine runs on six numerical systems, and the verbs map onto them:

- **Stats:** a registry, such as crit chance, evasion, defence, aggro and damage dealt.
- **Statuses:** a registry, covering stacks, duration and their own rules.
- **Damage types:** a registry, each with its own mitigation formula.
- **Flags:** a closed set, such as acts first.
- **Selectors:** who an effect picks.
- **Events:** a closed set that triggers rules.

Each verb is a pattern over these. *Protect* means raising aggro. *Burst* means raising crit chance, crit damage or damage dealt, or scaling an action's damage above 1. **The engine never reads a verb.** Whether a big hit beats armour is decided only by the damage formula. Verbs are for designing, predicting difficulty and labelling. They never gate gameplay, so challenges and formation slots refer only to what the player can see.

The validator checks verbs in both directions. A verb an entity declares must show in its data, and a verb its data shows must be declared. Mechanics that map to no verb are reported, which gives step 5 a to-do list.

## Keyholes

Keyholes live on enemies as design notes. Each one has three parts:

- **Where it comes from:** the enemy's own verb, and usually the specific `mechanic` behind it (one of its rules, an active ability, or its basic attack).
- **What counters it:** the verbs the player's keys bring. Several per keyhole.
- **What it blunts:** optional verbs it is strong against.

The Grey Mother has three:

| Keyhole | Comes from | Countered by |
| --- | --- | --- |
| Hide | Her base defence. Blunts multi-hit. | Magic, bleed, burst (including the Headsman slot) |
| Rend | Her basic attack: three hits a turn | Armour, blocking, evasion, protect, healing |
| Pack | Her Howl active: two wolves whenever she's alone | Area, execute, burst |

A keyhole that names a mechanic must point at something the enemy really has, and that mechanic must show the verb. A boss whose keyholes all come from base stats gets a warning: bosses need gimmicks.

The workflow you described, where human phrases and gimmicks are interpreted, filtered and number-crunched by AI, fits this shape. Each gimmick becomes an enemy rule or active, and each keyhole names it. Designing that pipeline comes later.

## How it's shaped

A content pack is one JSON file in five parts.

| Part | Holds |
| --- | --- |
| `design` | Target numbers (5 slots, 4 abilities with 2 equipped, 3–4 picks, pools of 10–15…) and design switches. Placeholders from the concept spec, likely to change. The validator reads them from here, so each number lives in one place and changing one is a data edit. |
| `ruleset` | The combat rules: turn order, default modes and behaviour, the damage pipeline and its formulas (including `damageScale`), which stat drives targeting, the enemy cap, the round limit, what carries between fights, how perks are offered. |
| Registries | `stats`, `damageTypes`, `statuses`, `verbs`, `traits`, `slots`, `actions`, `behaviours`. |
| Content | `classes`, `specializations` (the units), `abilities`, `gear`, `formations`, `enemies` (with keyholes), `perkFamilies`, `perks`, `dungeons` (with challenges). |
| `starter`, `progression` | What a new player owns, and the dungeon order. |

**Two kinds of text.** `name`, `text`, `word` and `forms` are player-facing; `note` is for designers. The engine reads neither, which keeps rules out of prose.

**How a unit takes its turn.** Each turn a unit uses a ready active ability if it has one, otherwise its basic attack. Most units use the `standard` behaviour, where the basic attack picks an enemy by aggro (random unless something draws attention). A few families differ: the Duelist is a `finisher` and goes for the most wounded enemy. A behaviour can add modes guarded by the unit's own statuses, which act as its states; the Grey Mother stops calling wolves once she's frenzied. Active abilities carry their own targeting and cooldown. Mend, for example, heals the most wounded ally below 60%.

**One rule language.** Abilities, gear, formation slots, whole formations, perks, statuses and enemies all use the same two parts:

- **Rules.** A passive rule holds while its source is active. A triggered rule fires `when` an event happens, `if` a condition holds, at a `chance`, up to a `limit`.
- **Actives.** An action, a cooldown, and an optional `useWhen`.

The concept spec's and your own examples:

| Example | In the worked example |
| --- | --- |
| Counterattack after a dodge | `riposte`: on `evade`, perform the basic action at `event_source`, once per turn |
| Taunt when an ally drops below half health | `stand_guard`: on an ally's `hp_below` 0.5, apply TAUNTING (aggro ×5) to self |
| Act first | `quick_draw`: the `acts_first` flag |
| Cleave | `cleave`: the basic attack also hits one other enemy for half damage |
| A front position that doubles defence | `phalanx`, Shield Point |
| One front slot with aggro and defence, back slots with speed and damage | `hearth_guard` |
| A slot that slows you down but multiplies damage | `hunting_party`, Headsman |
| "Ranger's counterattack also applies bleed" | `red_riposte` patches `riposte` |
| Heals target the lowest-health ally | `mend` |
| "Ally-targeted abilities always land here" | `hunting_party`, Sanctuary (tentative, as you said) |
| Lethality stacks on the unit, spent by an ability | `lunge`: dodges build LETHALITY on self; the active spends it all on one hit |

**Self versus others.** Each status says who it may land on. Self statuses (lethality, rhythm, taunting, guarding, frenzied) are only ever applied by their bearer to itself, so no other unit can double-dip. Others statuses (bleed, rot, stunned) are shared by anyone who applies them. In `--complete` mode, the validator warns when more than a set share of specializations apply the same others status (a placeholder 20%).

## What the validator enforces

- **Units:** 4 abilities each from their own class [`spec.abilityCount`, `spec.abilityClass`]. Each unit appears once per party with 2 abilities equipped [`party.uniqueSpec`, `party.abilities`]. Abilities do more than change stats [`ability.notBehaviour`].
- **Turns:** basic actions take their target from the behaviour, and every other action carries its own [`action.basicTarget`, `action.target`, `action.dualUse`]. Mode lists end in a fallback [`behaviour.fallback`]. Targeting runs on a real stat, and the default behaviour exists [`ref.missing`].
- **Statuses:** self statuses land only on self, and others statuses never do [`status.onSelf`, `status.onOthers`]. A stat change can't read stats, so there are no hidden cycles [`effect.statValue`].
- **Formations:** 5 slots each, drawn in distinct places [`formation.positions`, `formation.layout`]. Slots with effects have player text [`formation.slotText`]. Party-wide rules are checked like any other rules.
- **Fights:** at most `maxEnemies` enemies; a boss fight has a boss [`fight.size`, `fight.bossRank`].
- **Runs:** 3 to 4 perk picks, only between fights, ending in one boss fight [`dungeon.perkPicks`, `dungeon.stageOrder`, `dungeon.boss`]. Pools hold 10 to 15 perks and picks offer 3 [`dungeon.perkPool`, `design.perkOptions`]. Dungeons allow parties of 1 to 5 [`dungeon.partySize`].
- **Gear:**
  - Efficacy gear comes from loot or the starter set; powerful pieces and capstones are unlocks [`gear.source`].
  - Efficacy gear is numbers with at most one simple condition [`gear.simple`, `gear.simpleCondition`].
  - Loot tables drop only loot gear, and every clear and challenge pays gear [`loot.source`, `loot.empty`].
  - Copies used can't exceed copies owned [`party.gearCount`].
- **Challenges:** constraints must be possible to meet [`challenge.impossible`].
- **Vocabulary:**
  - Each trait word has one verb profile, appears in the enemy's text, and is backed by its data [`trait.profile`, `enemy.traitText`, `enemy.traitUnsupported`].
  - Bosses have 2 to 4 keyholes, each grounded in a real mechanic or stat [`enemy.keyholes`, `keyhole.mechanic`, `keyhole.from`], and at least one comes from a gimmick [`enemy.keyholeMechanics`].
  - Declared verbs match the data [`verb.unsupported`, `verb.undeclared`, `verb.unmapped`].
- **`--complete`:** the totals for a shippable set (8 to 10 classes, 3 to 4 specializations each, 15 to 20 verbs) and the status niche check. The worked example fails these on purpose.

## Done when: any rule a later step designs can be expressed as data, with no rules hiding in prose

**Met.** The worked example expresses every game rule in the concept spec and every decision above as data, and validates with no errors or warnings. The probes in `tests/probes.test.ts` write the rules steps 4 to 11 will design, and each validates cleanly:

| Step | Probe |
| --- | --- |
| 4 Combat rules | A different hit formula; percentage armour instead of subtractive; block before crit, party wins ties, cooldowns that carry across fights |
| 7 Units | A derived stat; a pure support whose basic action heals allies; lifesteal, thorns, and a focus resource spent by an active |
| 8 Formations | Three front slots and two back, no middle: a slot that acts first, a last-stand slot, and auto-defending rear slots |
| 9 Gear | A higher-rank piece with a simple condition |
| 10 Runs | A perk that shortens an active's cooldown; a perk for Warriors only |
| 11 Encounters | A boss that storms every third turn, stacks poison and switches behaviour when hurt, with keyholes tied to each gimmick; a decoy minion whose high aggro soaks basic attacks |

The engine's turn semantics (modes, cooldowns, ability order, targeting, status durations, who counts as the attacker for a status's damage) are written into the schema as primitives, and PRIMITIVES.md is generated from it.

**Known gaps**, to add as primitives when a step needs them:

- **Defensive:** damage shields, redirecting a hit to another unit, revival.
- **SaGa formation tricks:** a fixed acting order down the formation, and linked attacks between slots (the SaGa 3 remake's United Attacks).
- **Turns and challenges:** turn systems other than speed order, and challenges that change the dungeon rather than the party.

**Not questions, but for step 4 to settle by simulation:** whether the party's default basic attack should be aggro-weighted (now) or focus the most wounded enemy. Also, should "front" slots mean roughly the same thing across formations? That's a design convention for step 8. A soft check could enforce it later if it helps.

All numbers (including the `design` targets), the 19 verbs and the 6 traits are placeholders for steps 4 to 6 and later. Only their shape is step 1's deliverable.

## Smaller choices made here

- TypeScript and zod as the source of truth, with JSON Schema exported for anything else.
- Abilities belong to a class, and each specialization lists 4 of them, so two specializations of a class may share one.
- When several actives are ready, the highest `priority` goes first, then equipped abilities in order, then gear.
- Cooldowns reset each fight (a ruleset switch).
- Damage scaling (`damage_dealt` × `damage_taken`) applies before armour, so multipliers are the counter to defence.
- Enemies have aggro too, so a decoy enemy can soak the party's basic attacks; abilities with their own targeting ignore it.
- A perk that only tunes an ability shows that ability's verbs; a perk that adds effects shows what it adds.
- A status's own effects count towards the verbs of whoever applies it (Grave Rot shows magic damage because rot deals magic damage).
- Damage from an action is an attack (it can miss, crit and be blocked, and it triggers counters); damage from statuses and rules only fires `damaged`.
