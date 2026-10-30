# Step 5i, step 5: the engine spec

Oct 30, 2026. The spec share of the build (`plan.md`, wave 1). One contract for every engine addition the approved design needs, merged across `spine.md` section 1, `builds.md`'s list, every **Hooks** line and NEW list in `fill/`, and `fill-rulings.md` (its third round, the director's word, wins). The schema is written to match (`src/schema.ts`, schema 0.8; `PRIMITIVES.md` regenerated; the validator checks the new references). The engine doesn't act on any new field yet, and no content uses one, so nothing changes behaviour. Two engine shares build from this; seven content shares write against it.

**Rules every addition keeps.** Statuses are universal: nothing here applies a status for less or more than its own length; control resistance on bosses (X19) is the one exception. No balancing rules: no cap, rate limit or once-a-fight the design withdrew. The engine never uses the clock, `Math.random` or inexact maths. Aegis stays the Hoplite's. Closed sets where the engine needs code; registries for everything else.

## For the lead

1. **41 additions: 29 small, 11 medium, 1 large**, plus four run-layer shapes (R1 to R4). The spine's 17 and the rulings' "about thirty-five" merge into these 41; the rest of the fill is already possible (section 5).
2. **14 serve a single item.** Each has a simpler shape (section 4). Your call which to build; the schema holds the full shape of all 41, so cutting one is deleting a field.
3. **Seven things in the design can't be built as written** or read wrongly against the engine (section 6). Six have a fix that keeps the line's idea; one (control resistance and Weaken) is the director's call.
4. **The split** (section 7): who and when is X1 to X20, what happens is X21 to X41 and R4. They share four functions, two types and one function in `rules.ts`, each for a line or two.
5. **Control resistance's first values** (X19): stacks from Stun, Silence and Slow on bosses; half length from 2 stacks; immune at 4; one stack drains 22 ticks after the last change.

## How to read an entry

Each addition: **what it does** (exact enough to build and test), **users** (every item, by name), **schema** (as written in `src/schema.ts`), **cost** (small: one function, a few lines; medium: several functions or a new queue item; large: reaches through most of an action's life) with the functions it touches, and **test** (one fight in `src/engine/combat/arena.ts`'s style that proves it). Ids follow the content rule: lower case, apostrophes dropped, every other run of non-letters and non-digits an underscore, no leading or trailing one ("Executioner's longbow" is `executioners_longbow`).

---

## 1. Who and when (engine share W)

### X1. Events name who did it: the applier, the breaker, the blocked
- **What:** `status_gained` carries the applier as its `other` and, for Intensity, `amount`: the stacks it added. `status_ended` carries `amount` and `other` by cause: **stacks** on an absorb (a Shield emptied by damage): the most it held since it was applied (its peak), and the unit whose damage emptied it (nobody when a status's pulse did); **stacks** on any other Intensity status: 0; **spent** (a block): the damage it stopped, and the attacker; **removed**: the stacks it held, and the unit whose effect removed it; **ko**, **expired**, **fight_end**: the stacks it held, no other. The engine tracks each absorb instance's peak.
- **Users:** Still hand and Idol of binding (the applier); Hammer and anvil's Mason in its simpler shape (applier and amount); Rubble shield (the breaker); Rubble plate (the peak); The last wall (the blocked blow and its attacker); Wick, Ember heart and Eye of the tempest (a dying foe's Burn or Shock, from `status_ended` cause `ko`).
- **Schema:** none beyond the events' descriptions (`EVENTS`).
- **Cost:** small. `gained`, `endStatus` (a new optional argument `{ other, amount }`), `applyStatus` (the peak on `SInst`), `remove` (passes the remover). `take` passes the breaker and the blocked amount: that call is share H's (section 7).
- **Test:** a Shield of 500 hit to 0 by a foe ends with `amount` 500 and `other` the foe; an Aegis that stops a 900 blow ends with `amount` 900 and the attacker; a foe dying with 7 Burn ends its Burn with `amount` 7.

### X2. Event filters: who the other is, the source, the numbers
- **What:** new `EventSpec` fields, all of which must hold. `other` (holder, ally, foe, any): who the event's other unit is, from the holder's side (`ko` with `other: holder` is a kill the holder landed; `healed` with `other: holder` is a heal it gave, and the healed unit is the event's owner). `source: holder`: status events only, the status was applied by the holder. `notTags`: hit events, the hit carries none of these. `amountAtLeast`: the event's amount is at least this. `countAtLeast`: `action_resolve` only, its hits landed on at least this many units of the other side. `repeat`: action events, true only a recast's repeat (X39), false only ordinary ones. `kind` now also filters `ko` (the killing hit's kind), `healed` and `overhealed` (the healing action's).
- **Users:** `other: holder`: Trophy spear, Hunting spear, Hunter's buckler, Pack leader's coat, Bounty charm, Carrion idol, Night's edge, Thrall's chalice, Coup de grâce (kills); Still hand, Idol of binding (statuses applied); Holy water, Saint's knucklebone, Phylactery, Halo of the saint (heals given); Einherjar's power step, Chosen (revives given). `source`: The pack (its Lead's Mark), The last wall (its Aegis). `notTags: [area]`: Signal lantern, The pack, The storm front. `amountAtLeast`: Annotated grimoire (a cast that paid). `countAtLeast`: Stormweave. `repeat: false`: Cataclysm staff's count. `kind` on `ko`: Coup de grâce; on `healed`: Holy water, Saint's knucklebone.
- **Schema:** `EventSpec.other`, `source`, `notTags`, `amountAtLeast`, `countAtLeast`, `repeat`; `seat` is X13's.
- **Cost:** small. `matches`.
- **Test:** a status with a `ko` reaction `{ whose: foe, other: holder }` fires when its holder's hit kills a foe and not when an ally's does; `healed` with `other: holder` fires on its holder's heal of an ally, not on the ally's Lifesteal.

### X3. Tests on reactions and pulses
- **What:** `Reaction.if`: one test or several, all must hold, checked when the reaction resolves (not when the event fires); a failing test means the reaction does nothing. A test is a `Condition` read from the actor's side, as an ability's `if` is, or `{ unit: other | owner, where }`: the event's other unit, or the unit it's about, passes `where`. `Status.pulse.if`: conditions checked on each beat; a failing beat does nothing, and an Intensity drop on that beat still happens. `Condition.atMost`: no more than this many pass (0: nobody does). Conditions on `foes` use the visible foes, as abilities' do.
- **Users:** Gravemark (no foe is Marked: `atMost: 0`), Kindled robes (pulse: a foe burns), Ember palms (three pulses: one, two, three foes burn), Red ribbon and Bear fetish (the owner is below half), Shared rites (an ally below 30%), Horn of the keep (an ally is casting), Chains of light (the other is Stunned or Silenced), Drinking palm (the other has Sunder), Crimson dregs (the other bleeds), Pike wall (the owner has less Armor), Dawn muster (an ally is down), Vigil (an ally is down; none is), The mountain (the Peak is down), Halo of the saint and Leech idol in their simpler shapes.
- **Schema:** `Reaction.if` (`Test` = `Condition` or `EventUnitTest`), `Status.pulse.if`, `Condition.atMost`.
- **Cost:** small. `react` (evaluate before running effects), `pulse`, `holds` (atMost); the react item keeps the event's other and owner, as it does today.
- **Test:** a `hit_lands` reaction with `if: { unit: other, where: { has: sunder } }` heals on hits against a Sundered foe only; a pulse with `if: { side: foes, where: { has: burn } }` adds Heat only while a foe burns.

### X4. Conditions: has any of, a stat lower than the reader's
- **What:** `UnitCond.hasAny`: holds at least one of these statuses (spine 15). `UnitCond.lower: { stat }`: this stat is lower than the reading unit's, where the reading unit is the acting unit in an action, the actor of a reaction, the holder of a pulse (in a scale's `when` or a crit rule, the unit doing the reading). `passes` gains a reference unit.
- **Users:** `hasAny`: Still hand, Bane of the bound, Opportunist's charm, The vise, Chains of light. `lower`: Pike wall, Phalanx shield (at application: the aura goes to allies with less Armor when the fight starts and on a revive).
- **Schema:** `UnitCond.hasAny`, `UnitCond.lower`.
- **Cost:** small. `passes` (a new `ref` argument), and its callers pass the actor.
- **Test:** a boost `when: { hasAny: [stun, silence] }` reaches a Silenced foe and a Stunned one, not a Slowed one; a rule `{ side: others, where: { lower: { stat: armor } } }` picks the ally with Armor 2 and skips the one with 6 when the actor has 5.

### X5. "Hasn't acted this fight" (single item: Quietus)
- **What:** `UnitCond.acted`: true once one of the unit's actions has resolved this fight; a summoned unit starts false. Set on the unit in `resolve`.
- **Users:** Quietus.
- **Schema:** `UnitCond.acted`.
- **Cost:** small. A flag on `CUnit`, set in `resolve` (share H's function: one line), read in `passes`.
- **Test:** a crit rule `when: { acted: false }` crits a foe's first hit taken before its first action and not after.
- **Simpler shape:** Quietus's status applies a hidden marker (X14) to every foe at the fight's start, which removes itself on its holder's first `action_resolve`; the crit rule reads `has` the marker. Today's engine plus X14 and X25. It loses summoned foes, which then never count as unacted.

### X6. "The top of its side" (single item: Sentence)
- **What:** `UnitCond.top: { stats }`: no living unit on its side has more of the highest of these stats; ties pass.
- **Users:** Sentence (Judgement B).
- **Schema:** `UnitCond.top`.
- **Cost:** small. `passes`.
- **Test:** of foes with Attack 3, 5 and 5, the two at 5 pass and the 3 doesn't.
- **Simpler shape:** Sentence's passive status pulses every 4 ticks, applying a hidden marker (X14) to `{ side: foes, pick: highest, by: { stats: [attack, magic] } }`; the bonus is `when: { has: marker }`. Today's engine plus X14. The bonus lags a change of top foe by up to 4 ticks.

### X7. "Wields a kind" (single item: the Hammer seat)
- **What:** `UnitCond.weapon`: the unit wields a weapon of one of these kinds (an enemy's by the kind its weapon names).
- **Users:** Hammer and anvil's Hammer (great weapon, mace or staff: the swing shape; otherwise Attack up), read once at application as a stat change's `when`.
- **Schema:** `UnitCond.weapon`.
- **Cost:** small. `passes` (the unit's weapon is already on `CUnit.weapon`).
- **Test:** a seat status whose `attack_speed` change is `when: { weapon: [great_weapon] }` slows a unit with an axe and not one with a sword.
- **Simpler shape:** the Hammer swings half as often for triple whatever it wields (the reading goes); or with a slow weapon only, by content that lists the seat's two statuses and lets the card say which applies.

### X8. Counts as numbers
- **What:** `Scale.count`: `buffs` or `debuffs` (of the unit read; markers never count), `targets` (actions only: the action's targets), `hit` (actions only: the units on the other side its hits have landed on so far, each once, so an effect placed after the hits reads them all), or `{ side, where, seat }` (the units on that side of the unit read that pass). Combined with `times` it gives "X% more per foe".
- **Users:** Hexweave mail (+10% a debuff on the target), Broken spell (damage and MP per buff stripped, read before the `remove`), Supercell (+12% per target: `{ ratio: 0.12 × its ratio, count: targets, times: { stat: magic } }`), Recharge (120 MP per foe hit). Ember palms' "a Heat for each burning foe, up to three" needs no count: three hidden pulse statuses, each `if` at least one, two or three foes burn (X3).
- **Schema:** `Scale.count`, `COUNTS`.
- **Cost:** small. `term`, and `aval`/`num` pass the action's context; share H keeps the landed set on `Ctx` (X29).
- **Test:** a boost `{ ratio: 10, count: debuffs, of: target }` deals +30% to a foe with three debuffs and a marker; a final `mp` effect `{ ratio: 120, count: hit }` after a four-foe chain gives 480.

### X9. Pick by swing
- **What:** `Value` `swing`: the basic attack's interval now, its cooldown after Attack speed (as `cooldownOf` gives it), in ticks; `highest` is the slowest. (Today `value` throws on it.)
- **Users:** War horn (many Might on the slowest), Tempo bell (Haste to the slowest that isn't Hasted), Accelerando (Haste on the fastest).
- **Schema:** `Value` `swing`.
- **Cost:** small. `value`.
- **Test:** of allies with a dagger and an axe, `pick: highest, by: swing` picks the axe; Hasted, the axe still is unless its interval falls under the dagger's.

### X10. Skip the event's units
- **What:** `TargetRule.exclude` gains `other` and `owner` (reactions only): skip the event's other unit, or the unit it's about.
- **Users:** Spreading thorns (a random foe other than the attacker), Wildfire (a random other foe), Splinters and Winter's chain (every foe but the one that shattered), Eye of the tempest (one more foe than the one it hit).
- **Schema:** `TargetRule.exclude`.
- **Cost:** small. `byRule` (its options carry the reaction's other and owner), `targetsOf`.
- **Test:** a `status_capped` reaction applying Chill to `{ side: foes, pick: all, exclude: owner }` reaches every foe but the one that capped.

### X11. Marked
- **What:** two status fields, and an order for basic attacks. `focus`: the holder's foes' basic attacks pick a holder while one can be picked, by draw among several, under the Taunt rule (a Taunting foe still takes the pick unless the attack has Seek, so Seek follows the Mark past it); abilities keep their own targeting. `single`: each applier keeps one copy (statuses that know their source only): applying it to a unit first ends, cause removed, the copy that applier gave anywhere else. A basic attack picks in this order: an `aim` with `first` the attacker holds (X12); a foe holding a `focus` status; its other `aim`; the default. A step that finds nobody passes to the next. The content's `marked` is G2's: a debuff, 14 ticks, Refresh, `focus`, `single`, an icon (the director's art).
- **Users:** Marking knife, Huntsman's bow, Gravemark, Signal lantern, Wild hunt totem, Hunting party's Marker, The pack (through the Lead's Marks), and every party's basic attacks once a Mark is out.
- **Schema:** `Status.focus`, `Status.single`.
- **Cost:** medium. `choose` (it learns the action's kind), `defaultFoe`, `byRule`, `applyStatus` (single).
- **Test:** with foes A and B and B Marked, a sword's swings all go to B; with A Taunting they go to A, and with Seek to B; when the marker marks A, B's Mark ends.

### X12. Basic attacks aimed by a rule
- **What:** `Status.aim: { rule, first }`: the holder's basic attacks pick by this rule, in the order X11 gives (`first`: ahead of a Marked foe). The rule's Taunt rule is an action's own; an all-pick hits every unit it finds, each hit a basic attack's hit (its riders and statuses with it), and its extra strikes go to the first. A rule that finds nobody passes to the next step.
- **Users:** Quarry (lowest HP share, after a Mark), Overwatch (a casting foe, after a Mark), The vise (a Stunned or Silenced foe, `first`), Reaping line's Scythes (every foe, `first`, with a −80 basic boost), The witch-blade (every debuffed foe, `first`, for three swings).
- **Schema:** `Status.aim`.
- **Cost:** medium. `choose` (shared code with X11); `run` already loops a basic attack's targets.
- **Test:** a unit with `aim: { rule: { side: foes, pick: all }, first: true }` hits all three foes with each swing; with `aim` on the lowest HP share and a Marked foe, it hits the Marked one.

### X13. Seats
- **What:** each party unit knows its seat: the id of its position in the party's formation (`CUnit.seat`, from `PartyUnit.position`). `seat` on `TargetRule`, `Condition`, `EventSpec` and a `count` narrows to the unit in that seat: a position id, or `next` / `previous`, the seat after or before the reading unit's by slot order, wrapping round and skipping empty seats. Enemies sit in no seat. No position may be named `next` or `previous` (the validator checks).
- **Users:** Relay (the Well gives the second seat MP; each Spender hears the seat before), The choir (the next voice), Thorn hedge (hits on the Anchor), The mountain (the Peak down at a fight's start), Hammer and anvil's Mason (the Hammer, in its simpler shape).
- **Schema:** `TargetRule.seat`, `Condition.seat`, `EventSpec.seat`, `Scale.count.seat`.
- **Cost:** small. `sideOf`/`byRule`, `holds`, `matches`; `combat.party()` in `rules.ts` sets the seat.
- **Test:** in a three-seat formation, a reaction on `action_resolve` with `seat: previous` fires for the unit in slot 1 when slot 0 casts, and for slot 0 when slot 2 casts.

### X14. Markers
- **What:** `Status.label` `marker`: neither buff nor debuff. Only a `remove` that names it lifts it (`label: marker` with `status`); immunity to debuffs doesn't stop it; `buffs`, `debuffs` and counts never see it; its pulses resolve in its holder's own batch.
- **Users:** every once-a-fight or once-a-foe mark: Weeping kris, Humbling shield, Cistern rod, Holdfast, Courier's coat, Red ribbon, Bull's horn, Waking bell, Bear fetish, Shield of the chosen, Phoenix ember, Vial of the last breath, Opening wound, Lingering point, Undying thirst; and the simpler shapes of Quietus and Sentence. As a debuff, a foe's marker would feed Inquisition, Hexweave mail and every "with a debuff".
- **Schema:** `Status.label` (`LABELS`), `remove.label`.
- **Cost:** small. `passes` (buffs, debuffs), `value`, `remove`, `pulseBatch`, `immune`.
- **Test:** a foe holding a marker and no debuff fails `debuffs: true` and survives a Cleanse; a `remove` with `label: marker, status: <it>` lifts it.

### X15. Taunt ends Hidden (spine 17)
- **What:** a rule, no field. When a unit gains Taunt (`forced` above 0), every status giving it `forbidden` ends (cause removed, even if unremovable: Hidden is); a status giving `forbidden` doesn't land on a Taunting unit (no log of IMMUNE: it just doesn't land). Today no unit can be both, so no outcome changes.
- **Users:** Clarion blade, Mocking mail, Challenger's plate, Red ribbon, Hunting party's Warden, Shadow cloak, Smoke screen, Last stand, Night's edge, Vanish beside any Taunt.
- **Schema:** none.
- **Cost:** small. `refresh` (after stats change), `applyStatus`.
- **Test:** a Hidden unit that gains Taunt loses Hidden at once; Hidden applied to a Taunting unit doesn't land.

### X16. Extra strikes heard as basic attacks (single item: Echo charm)
- **What:** `Status.echo`: the holder's extra-strike hits match `kind: basic` in its own statuses' reactions and triggers, except a status that also names `kind: extra` for the same event (so Iron palm doesn't fire twice) and a status that gives strikes itself. Boosts still see the hit as extra.
- **Users:** Echo charm.
- **Schema:** `Status.echo`.
- **Cost:** small. `matches`.
- **Test:** with echo, a Double strike's second hit sets off a `hit_lands kind: basic` Burn rider, and a `basic` boost doesn't reach it.
- **Simpler shape:** none smaller; it's a few lines. The alternative is to drop the exception (every `basic` reaction hears extra strikes), simpler still but Iron palm then doubles.

### X17. A stat set to a value (single item: Gambler's coin)
- **What:** `Status.set: [{ stat, value }]`: after every other change, the stat is this value while the status is held.
- **Users:** Gambler's coin (crit chance 50).
- **Schema:** `Status.set`.
- **Cost:** small. `derive`.
- **Test:** a unit with crit chance 20 and the set reads 50; Bedrock's doubling leaves it at 50.
- **Simpler shape:** a stat change read once at application, `{ base: 50, scale: [{ ratio: -1, stat: crit_chance, of: holder }] }`: today's engine. Changes later in the fight (Bedrock, a Haste) land on top.

### X18. A stat read live from another (single item: Spiked bulwark)
- **What:** `StatChange.live`: the change is worked out whenever the holder's stats are, from its other stats as they stand without it (a second pass in `derive`), so Guard's Armor counts the moment it lands.
- **Users:** Spiked bulwark (Thorns 5% of Armor).
- **Schema:** `StatChange.live`.
- **Cost:** medium. `derive` (a second pass), `compile` in `stats.ts` (live changes keep their scales instead of a fixed slot).
- **Test:** Thorns from 5% of Armor read 200 at Armor 4,000 and 350 the moment Guard lands.
- **Simpler shape:** read once at application (today's engine): Guard and Sunder never move it.

### X19. Control resistance on bosses (the director's, Oct 30)
- **What:** the one exception to universal statuses, and the boss's, not a piece's. Each enemy of a listed rank keeps hidden stacks (no icon, on `CUnit`). When one of the listed statuses would land on it: at the cap, it doesn't land, nothing changes, the battle text says **IMMUNE** (`{ t: "immune", unit, status, name, why: "control" }`); from `resist.at` stacks, it lands for `pct` % of its own length (rounded down to the sub-tick) and the text says **RESISTED** (`{ t: "resisted", unit, status, name, end }`); then, if it landed, the unit gains a stack (to the cap). A status that doesn't land for any other reason (Fizzle on a Stunned boss, an immunity) adds nothing. A Chill shatter's Stun is an application of Stun, so it counts. One stack drains away `drain` ticks after the last stack was gained or lost (a queued item; each gain or loss restarts the wait), so a party that isn't chaining control sits near zero. A hidden `{ t: "control", unit, stacks }` entry on each change, for reading fights.
- **First values, as a ruleset block:**
  ```json
  "control": { "ranks": ["boss"], "statuses": ["stun", "silence", "slow"], "resist": { "at": 2, "pct": 50 }, "cap": 4, "drain": 22 }
  ```
  Why: the first two controls land in full and the next two at half (Stun 4, Silence 8, Slow 12 ticks); the fifth in a row meets IMMUNE. A drain of 22 is G13's "every so often": one control every 22 ticks or slower never builds a stack past 1, two stunners at 15 ticks between them reach the cap by tick 45, and the Glacial rod's Slow every 9 ticks settles at one half-length Slow every 22 to 31 ticks (slowed about 45% of the fight, against 100% today). All four numbers are the balance pass's levers.
- **Users:** every Stun, Silence and Slow on a boss: the Glacial rod, Deep cold, Worldbreaker, Still hand, Icebreaker's setups, Rubble shield, Aftershock, Hammer of dawn, Brittle, Lullaby, Pinning arrow, Ice spear, Lingering point, Snaring bow, Idol of binding, Chains of light, Stunning crits.
- **Schema:** `Ruleset.control` (`Control`), `Rank`.
- **Cost:** medium. `applyStatus` (before the status is made), a drain item in the queue and its branch in `step`, the two log entries. The interface share adds the words (`ui/src/battle/narrate.ts` reads `immune` today and needs `resisted`).
- **Test:** with the block above, five Stuns on a boss in quick succession last 8, 8, 4, 4 ticks, then IMMUNE; 22 ticks after the last change the boss is at 3 and the next Stun lasts 4; a minion is never resisted.

### X20. Applications' boosts read the unit receiving (single item: Primer of frost)
- **What:** a boost that names a status (it scales the stacks an application adds) can read the unit receiving them with `of: target` (today `applyStatus` passes nobody).
- **Users:** Primer of frost.
- **Schema:** none: `boosts` already take a scale `of: target`.
- **Cost:** small. One argument in `applyStatus`'s `boostOf` call.
- **Test:** a boost `{ tag: chill, pct: { scale: [{ ratio: 6.25, stacks: chill, of: target }] } }` makes a 4-stack application on a foe holding 8 Chill add 6.
- **Simpler shape, and the honest one:** the line's "one more stack for every four held" is an absolute add no field gives. This shape makes it a percentage that grows with the foe's Chill; the card says "its Chill grows by a quarter for every four the foe holds". Or today's flat boost (+25% Chill), which loses the growth.

---

## 2. What happens (engine share H)

### X21. Cooldown and timer changes (spine 1)
- **What:** an effect, `{ op: cooldown, which, set, to }`, on each target's timers. `which`: `basic` (the basic attack's timer), `abilities` (each equipped ability), `longest` (the ability with the most cooldown left; ties by slot), `soonest` (the one with the least cooldown left that isn't ready), `event` (reactions to an action event: the ability that set it off), or `{ ability: [ids] }` (by id, each with its forms). `set`: `ready` (no cooldown left), `full` (its full cooldown left, as if just used), `{ less: n }` (n ticks closer, down to ready), `{ times: pct }` (what's left × pct %), `{ atMost: pct }` (what's left at most pct % of its full cooldown). A wind-up already under way carries on. Ready still needs MP and conditions. Logged as a hidden entry.
- **Users:** Hunting spear, Still hand, Bell of the hour (`longest`); Drawn steel, Pack leader's coat, Bounty charm, Horn of the charge, Quickening chime, The ambuscade, Opening thrust, Marching song (`basic`); Horn of the charge's holder (`abilities`, `full`); First light, Turnkey, The pack (`abilities`, `less`); Relay (`soonest`); Rubato (`longest` on every ally); Ready stance (`atMost: 50`); Huntmaster's quiver (`times: 50`); Dawn muster, Coup de grâce, Pyre of the fallen, The last wall, Metronome (by ability); Cataclysm staff's simpler shape (`event`).
- **Schema:** `Effect` `cooldown`, `COOLDOWN_WHICH`, `COOLDOWN_SET`.
- **Cost:** medium. `run` (a new branch), using `cooldownOf` and `actDef`; the basic timer's full cooldown is its swing.
- **Test:** at tick 10 a unit whose Fireball has 20 ticks left gets `{ which: longest, set: { less: 5 } }` and casts at 25, not 30; `{ which: basic, set: ready }` makes it swing on the next sub-tick.

### X22. MP cost changes (spine 3, and 14's cost part)
- **What:** `Status.mods`: ability changes read whenever one is used (`PRIMITIVES.md`, "Ability changes"). This part: `mp`, a percent change to the cost (changes add; the cost never falls below 0; −100 is free), for the abilities its `of` filter reaches (absent: all), while the holder passes its `if` (`UnitCond`). The changed cost is what `available` checks and what `resolve` pays. An Intensity status's changes don't grow with its stacks. `action_resolve` carries the MP paid (X29).
- **Users:** Weaver's robes, Matins robe, Abridged lexicon, Archmage's mantle (+50), Brimming rod (−25 `if: { mpAtLeast: 50 }`), Annotated grimoire's token, Reliquary of mercy (−50 on revives), Wellspring's Spenders, The choir's cue, Deep calm, Overcharge, Blood vial (−50).
- **Schema:** `Status.mods` (`AbilityMod.mp`, `of`, `if`), `AbilityFilter`.
- **Cost:** medium. A `modsOf(w, u, abilityId)` helper; `available`, `resolve`.
- **Test:** an ability of 400 MP with a −20 change costs 320; with −100 it casts at 0 MP; with Brimming's `if` it costs 300 at 60% MP and 400 at 40%.

### X23. HP as a price (spine 4, G12)
- **What:** an effect, `{ op: pay, hp, to }`: the target loses that much HP at once; it isn't damage (no Shield soaks it, no Armor cuts it, no event fires, nothing reacts), and it never takes the payer below 1 HP; a negative amount pays nothing. An ability's HP price is this effect on itself, placed after whatever reads its HP first (Martyr's raise reads its HP, then pays). And `AbilityMod.hp`: an HP price on top of an ability's MP, `pct` % of its own MP cost (before `mp` changes), point for point or, with `share`, as the same share of max HP as the cost is of max MP (no MP pool: point for point); `floor`: the ability waits rather than leave the holder below this % of max HP. By G12, Blood gift's own price moves from `blood_price`'s untyped damage to `pay` (base content: the upgrades share for the second eight classes).
- **Users:** `pay`: Martyr's raise, Penance, Blood for mana, Lifeblood, Bloodlust draught (down to half at the start), Blood oath's Bleeder (every tick). `mods.hp`: Blood vial (100), Blood covenant (100, share, floor 10).
- **Schema:** `Effect` `pay`, `AbilityMod.hp`.
- **Cost:** small. `run` (the branch), `available` (the floor), `resolve` (the price).
- **Test:** a unit at 1,000 HP behind a Shield pays 400: HP 600, Shield untouched, no `hp_lost`; paying 2,000 leaves 1.

### X24. Abilities changed by what they do, or by name (spine 14, mythics by name)
- **What:** the rest of `AbilityMod`. `of.does`: abilities whose effects revive, heal, deal damage, or apply one of these statuses (in an `apply` effect or a hit's `apply`). `of.ability`: these abilities by id, each with its forms (a mythic naming its class's ability). Fields: `cast` (its wind-up in ticks, before cast-time reduction, in place of its own); `stacks` (its applications of these statuses, or every Intensity status, add pct % more stacks, after the applier's boosts); `heal` (its heals heal pct % more); `target` (its own target rule, in place of the ability's) and `seek`; `wait` (conditions it also waits for); `apply` (statuses its hits apply too, after its own). Several changes on one ability: costs add, stacks and heals add, a `target` or `cast` from the newest status wins.
- **Users:** Reliquary of mercy (`cast: 1` on revives), Banked staff (`stacks` +50 for Burn, Chill, Shock), Archmage's mantle (`stacks` +50, `heal` +50, with X22's +50 MP and a +50 `ability` boost), Huntmaster's quiver (`target` lowest HP and `seek`, `apply` a quarry mark), Gaol's Watcher (`of.does: [stun, silence]`, `wait` a casting foe, `target` the casting foe with the highest Attack or Magic), Chains of light (`of.ability: [smite]`, `apply` Silence).
- **Schema:** `AbilityMod` (`cast`, `stacks`, `heal`, `target`, `seek`, `wait`, `apply`), `AbilityFilter.does`, `AbilityFilter.ability`.
- **Cost:** large. Reaches every stage of an action: `available` (wait), `start` (cast), `resolve` (target, seek), `hit` (apply), `run` (stacks on `apply` effects), `heal`; and a cached reading of what each ability does. `actDef` stays cached: changes are read per use.
- **Test:** a Smite with Chains of light Silences its target; a revive with Reliquary of mercy winds up in 1 tick; a Firebolt with Banked staff adds 15 Burn where it added 10.
- **Note:** Hammer and anvil's Mason was written as a `target` change on Shield and Guard abilities; its simpler shape (section 4) is recommended, since pieces' Shields aren't abilities and the change can't reach them.

### X25. Crits by condition
- **What:** `Status.crits: [{ tag, when, chance, bonus }]`: for the holder's hits that carry `tag` (basic, ability, extra, physical, magical, area) on a unit passing `when` (read as the hit lands), `chance` points are added to the crit chance after every stat change (so 100 always crits, Gambler's coin included: G17), and the crit bonus (the part of the multiplier above ×1) is `bonus` % larger (100 makes ×1.5 into ×2). The roll is still one a hit, on the attacker's dice.
- **Users:** Quietus (chance 100, bonus 100, on a foe that hasn't acted), Still hand (chance 100 on a Stunned or Silenced foe), Drawn steel (chance 100 on the first basic attack: a fight-start status that ends on its holder's first basic `action_resolve`), Venom vial (+5 on a bleeding foe), Opening wound (chance 100 on a foe without its marker).
- **Schema:** `Status.crits` (`CritRule`).
- **Cost:** small. `hit` (before `critRoll`).
- **Test:** with crit chance 0 and a rule `{ when: { has: stun }, chance: 100 }`, every hit on a Stunned foe crits and none on another; with Gambler's coin set to 50, the Stunned foe still always crits.

### X26. Extra strikes sized and spread
- **What:** `strike.share`: each extra strike deals share % of the weapon's damage (default 100). A strike rule that picks several units (`pick: all`, or a `count`) strikes each of them, in the rule's order (today `strikes` takes only the first).
- **Users:** Sweeping blade, Glaive, Chain wand (half), Oathkeeper's sweep, Volley bow's volley and Sunhammer's sweep (every other foe), Forked arc (two other foes), Flurry wraps (in X27, or its simpler shape).
- **Schema:** `Status.strike.share`, the `to` description.
- **Cost:** small. `strikes`.
- **Test:** a strike `{ to: { side: foes, pick: all, exclude: targets }, share: 50 }` from a 1,000 swing hits each other foe for 500.

### X27. Chained strikes (single item: Flurry wraps)
- **What:** `strike.chain: { times, share }`: each strike that lands rolls the strike's chance again for one more, at most `times` more after the first, each `share` % of the one before. The one bend of "extra strikes don't chain".
- **Users:** Flurry wraps (two more, 80%).
- **Schema:** `Status.strike.chain`.
- **Cost:** small. `strikes`.
- **Test:** with chance 100 and `{ times: 2, share: 80 }`, a 1,000 swing brings strikes of 1,000, 800 and 640.
- **Simpler shape:** Double strike medium and a second, separate strike status with the same chance at 80% (X26's `share`): 1.0 extra strikes a swing on the Monk, against the chain's 0.875. No new field.

### X28. Strikes fired by reactions (spine 9)
- **What:** an effect, `{ op: strike, share, of, to }`, in reactions only: a hit of kind extra by the actor at each target, sized `share` % (default 100) of its basic attack's damage against that target (`of: weapon`), or of the raw amount of the hit that set the reaction off, before Armor or Magic resist, in that hit's damage type (`of: hit`). It's a hit: it can crit and be dodged, meets the target's Armor or Magic resist, applies nothing of the first hit's, and fires hit events; it never brings extra strikes of its own. The react item carries the triggering hit's raw amount and type (X29). A reaction that strikes on its own `extra` hits would loop to the depth guard: content filters by kind.
- **Users:** Duelist's leathers (a dodge strikes back), Pike wall (a foe that hits a less armored ally), The storm front (a quarter of each single-target hit, to the foe with the most HP), Lightning rod (a quarter of each `area` ability hit, again on the same foe), Eye of the tempest (half of each hit, to one more random foe).
- **Schema:** `Effect` `strike`.
- **Cost:** medium. `run` (a new branch that builds a damage effect and calls `hit`), with the react item's new fields.
- **Test:** a dodge reaction `{ op: strike, to: other }` lands a swing on the attacker, which can crit; `{ share: 25, of: hit }` after a 1,000 raw magical hit deals 250 less the next foe's Magic resist.

### X29. Hits, actions, heals and knockouts carry what they did
- **What:** the payloads share H sets. Hits: the tag `area` when the damage effect that made them is aimed at two or more units (an action's own targets, or an effect's rule picks); the raw amount (after boosts, damage taken and crit, before mitigation) and damage type on the event (for X28; not a filter). Actions: `action_resolve` carries `amount`, the MP paid, `count`, the units on the other side its hits landed on (each once), the ability's id (for `which: event` and recast) and whether it's a repeat (X39); `Ctx` keeps the landed set (for X8's `count: hit`). Knockouts: `ko` carries the unit whose damage knocked it out as `other` (a hit's attacker; a reaction's actor; a Per-source status's source; nobody for a shared Intensity status's pulse) and the hit's `kind`. Heals: `healed` and `overhealed` carry the action's `kind`.
- **Users:** every X2 filter on kills, the `area` and single-target pieces (Treatise on the field's boost on `area`; Signal lantern, The pack, The storm front; Lightning rod), Stormweave, Recharge, Supercell, Brimming rod and Relay (MP paid), Coup de grâce (a kill by an ability), Holy water and Saint's knucklebone (an ability's heal).
- **Schema:** `TAGS` `area`; the events' descriptions.
- **Cost:** medium. `hit`, `strike`, `resolve`, `ko` (a new `by` argument from `hit` and `strike`), `heal`; the `Ev` type (share W owns its definition).
- **Test:** a Fireball's hits carry `area` and a Firebolt's don't; a kill by a Per-source status's pulse names its source, by a shared Burn nobody, by Thorns the Thorns holder; `action_resolve` after a 400 MP cast on three foes carries 400 and 3.

### X30. Taking a hit for an ally (single item: Oathbound shield)
- **What:** `Status.cover: { share }`: when a hit on another living ally would deal it more than share % of its max HP, after its mitigation and before its block and absorbs, the holder takes the whole hit instead: it resolves again against the holder (its own Armor or Magic resist, Aegis, Shield, HP; the hit's statuses and riders land on the holder; its events name the holder). A hit moves once; nothing moves while the holder is knocked out; an Area hit is judged ally by ally.
- **Users:** Oathbound shield (25).
- **Schema:** `Status.cover`.
- **Cost:** medium. `hit` (a second resolution against another target).
- **Test:** a 3,000 hit on an ally with 4,000 max HP lands on the holder; a 900 hit doesn't move; two holders don't pass a hit back and forth.
- **Simpler shape:** a reaction on `hit_taken` (`whose: ally`, `amountAtLeast` can't read a share, so X3's test `{ unit: owner, where: { hpBelow: … } }` stands in) that heals the ally for the amount and pays it as untyped damage on the holder (`damage` type none). It keeps the bodyguard, loses the holder's own Armor, and fires the ally's hit reactions.

### X31. HP floors
- **What:** `Status.floor: { spend }`: while the holder holds it, its HP can't fall below 1: a blow that would knock it out leaves it at 1 and nobody falls, so nothing that answers a fall fires. With `spend`, the status ends (cause spent) the first time it holds a blow, which content hears as `status_ended`.
- **Users:** Last bastion (spent: then Guard and doubled hits, by its `status_ended` reaction), Undying thirst (5 ticks).
- **Schema:** `Status.floor`.
- **Cost:** small. `take`.
- **Test:** a 5,000 blow on a unit with 1,200 HP and a spending floor leaves it at 1 and ends the floor; the next blow knocks it out.

### X32. Overhealing (spine 8)
- **What:** an event, `overhealed`: the part of a heal past max HP, on the healed unit, with the healer as `other`, `amount` the part past full, and the action's `kind`. Fired after `healed` (or alone, when the unit was full).
- **Users:** Phylactery (a Shield of the overflow on the healed ally), Halo of the saint (in its simpler shape: section 6).
- **Schema:** `EVENTS` `overhealed`.
- **Cost:** small. `heal`.
- **Test:** a 1,000 heal on a unit 300 below full fires `healed` 300 and `overhealed` 700; on a full unit, `overhealed` 1,000 alone.

### X33. Heals from others blocked (single item: The undying)
- **What:** `Status.heals: own`: only heals whose healer is the holder land on it (its abilities, its Lifesteal, its statuses' reactions); others' heals, a Regen they applied included, restore nothing.
- **Users:** The undying's Martyr.
- **Schema:** `Status.heals`.
- **Cost:** small. `heal`.
- **Test:** an ally's Cure on the holder restores 0; its own Lifesteal heals.
- **Simpler shape:** healing received −100 on the seat (today's engine): the Martyr can't be healed at all, its own Lifesteal included.

### X34. Revives on a timer (the fallen's timers)
- **What:** `revive.after`: the unit stands this many ticks later, if the fight hasn't ended and nothing has raised it meanwhile; the reviver needn't stand then. A queued item. A unit reacting to its own knockout (today's `dead` reaction) can schedule its own return.
- **Users:** Phoenix ember (4 ticks, a fifth of its HP), Vial of the last breath (4 ticks, a third).
- **Schema:** `revive.after`.
- **Cost:** small. `run` (schedule), a new queue item and its branch in `step`, `revive`.
- **Test:** a unit knocked out at tick 10 with the reaction stands at tick 14 with 20% HP, every action on cooldown; if the fight is won at tick 12, it stays down.

### X35. A reviver's rule (Einherjar as a rule)
- **What:** `Status.revives: { ready, hp }`: every revive the holder makes, from abilities and reactions alike. `ready`: true, the revived unit comes back with every action ready; false, on cooldown; it wins over the revive effect's own `ready`, and false wins over true. `hp`: the HP they come back with, in place of the effect's.
- **Users:** Einherjar (and its power step and Chosen: ready), Bones of the returned (full HP, not ready, over Einherjar), so Shield of the chosen and Flight of the valkyries come back ready from a Valkyrie.
- **Schema:** `Status.revives`.
- **Cost:** small. `revive`.
- **Test:** a reviver with `revives: { ready: true }` raises an ally whose actions are ready, through a reaction's revive too; with Bones also held, they're on cooldown at full HP.

### X36. After a won fight (spine 12)
- **What:** an event, `fight_won`: the moment the last foe falls, before statuses end, once for every party unit, fallen ones included. Its reactions resolve at once, in slot order (not on the next sub-tick: the fight is over), and a fallen unit's statuses that survive a KO act for it. Then `endFight` carries HP and the rest as today.
- **Users:** Lamp of vigil (a fallen ally stands with a quarter), Last bastion (at least a fifth of its HP), The undying (its Martyr stands with half for the next fight).
- **Schema:** `EVENTS` `fight_won`.
- **Cost:** medium. `ko` (after `result` is set), a pass of `fire` and `react` that ignores the result for this one event.
- **Test:** a party wins with one member down; a Lamp holder's `fight_won` revive leaves it at 25% when the next fight starts.

### X37. Moving a status (single item: Idol of the hungry dark)
- **What:** `remove.move`: each status removed passes to the acting unit as it was, its stacks and time left with it, unless the actor is immune to it.
- **Users:** Idol of the hungry dark.
- **Schema:** `remove.move`.
- **Cost:** small. `remove` (share W owns the rest of it).
- **Test:** a foe's Might 6 with 10 ticks left is taken: the foe has none, the holder has Might 6 ending at the same tick.
- **Simpler shape:** a Dispel on a clock (today's `remove`): it strips the buff and gives nothing back.

### X38. One of several statuses at random (single item: Wildmagic wand)
- **What:** an effect, `{ op: one, of: [applies], to }`: applies one of these, picked at random on the actor's dice.
- **Users:** Wildmagic wand (2 of Burn, Chill, Shock, Bleed or Sunder).
- **Schema:** `Effect` `one`.
- **Cost:** small. `run`.
- **Test:** over 1,000 swings each of the five lands about 200 times, one a swing.
- **Simpler shape:** five `apply`s at 20% chance each (today's engine), rolled apart: one a swing on average, sometimes none or two; the card says so.

### X39. Recasting (single item: Cataclysm staff)
- **What:** an effect, `{ op: recast }`, in a reaction to its holder's own `action_resolve`: the action that set it off resolves again at once, with no wind-up and no MP, choosing its targets afresh by its own rule, its cooldown untouched. The repeat fires its own action events marked as a repeat, which `repeat: false` skips (so the staff's count ignores it, and allies' reactions hear it).
- **Users:** Cataclysm staff (every third cast).
- **Schema:** `Effect` `recast`, `EventSpec.repeat`.
- **Cost:** medium. `resolve` (a free, uncooled path), `react`.
- **Test:** a third Fireball resolves twice, the second free, and the count starts again at 0.
- **Simpler shape:** on every third cast, X21 makes the ability just cast ready (`which: event`) and X22 makes its next cast free (a one-use −100 change): a second cast that waits for its own wind-up.

### X40. Abilities that bring statuses
- **What:** `Ability.statuses`: statuses its unit holds while the ability is equipped, applied at the fight's start and on a revive, as gear's are. For versions that must listen before their first cast.
- **Users:** Rebuke (the hit count), Dawn muster (the fight-start check), Pyre of the fallen (each burning foe's fall), Coup de grâce (a kill by one of its abilities).
- **Schema:** `Ability.statuses`.
- **Cost:** small. `combat.party()` in `rules.ts` (with R4).
- **Test:** a unit with an ability that brings a status holds it from tick 0; without the ability equipped, it doesn't.

### X41. "Or" between an ability's conditions (single item: Ward of life)
- **What:** `Ability.if: { any: [conditions] }`: the ability waits for at least one to hold. (Today `actDef` throws on it.)
- **Users:** Ward of life (Raise B: a fallen ally, or a living one below a third).
- **Schema:** `Ability.if` `{ any }`.
- **Cost:** small. `actDef`/`allOf`, `available`.
- **Test:** an ability with `any` of "an ally down" and "an ally below a third" waits with everyone above a third and standing, and casts as soon as either holds.
- **Simpler shape:** Ward of life waits for a fallen ally as Raise does; it raises it and gives every living ally below a third a Shield of a third of its max HP. Today's engine; it shields only when it raises.

### No addition: reaction cooldowns
The physical weapons' NEW F (a reaction that fires at most once every N ticks) served Pike wall's limit, which the third round undid. Nothing in the design needs it.

---

## 3. The run layer (R1 to R4)

The rogue's run state (`Member`, its `trained` record, the offers) is TypeScript in `src/rogue.ts`, left to the loot share. The schema carries:

- **R1. `Gear.rarity`** (common, uncommon, rare, legendary, mythic): the piece's own, fixed; no affixes. Mythic exactly when the piece names its class in `mythic` (the validator checks). Optional until the content shares fill it.
- **R2. `Formation.rarity`** (common, rare, legendary; Neutral common). The rogue config's `formationRarity` is the provisional one: the loot share moves the rogue to this field and removes that one.
- **R3. The pack's `upgrades`**, one for each of the 64: `{ id, class, kind, power, a: { name, text }, b: { name, text } }`. `id` is the ability, or the passive status, it upgrades; `kind` says which. Its five forms are content under fixed ids, `<id>__p` (the power step), `<id>__a`, `<id>__b` (a version), `<id>__ap`, `<id>__bp` (a version with the power step): for an ability, five abilities of that class in `pack.abilities` (never listed in the class's own `abilities`); for a passive, five statuses in `pack.statuses`. The validator checks every form exists, belongs to the class, and that no stray `__p`-style id exists without its upgrade. `formId` and `formBase` in `schema.ts` build and read the ids. The rogue's generic "+" rule (`upgraded()`) goes with the loot share.
- **R4. `PartyUnit.passive`**: the trained form of the class passive. `PartyUnit.abilities` may name forms. The engine applies a passive form in `combat.party()`: the member's `start` statuses are the class passive's with the upgrade's `id` replaced by the form (the passive's stat grants stay); and each equipped ability's `statuses` (X40) join `start`. `checkParty` accepts a form in its ability's place (one form an ability) and a passive form of the class. Cost: small (share H).
- **The Valkyrie's passive:** Einherjar has no status today (it's Valhalla's `ready: true`). For R3 and X35 the upgrades share gives the Valkyrie a passive status `einherjar` with `revives: { ready: true }`, and Valhalla drops its own `ready` (else Chooser of the slain's raised allies would still come back ready). That's a base-content change, behaviour-neutral once both land.
- **Designer data stays out of the pack:** `PIECE_BUILDS` (which builds and rungs an item serves) is each content share's export, never in the schema.

---

## 4. Single-item additions and their simpler shapes

| Addition | Item | Cost | Simpler shape |
| --- | --- | --- | --- |
| X5 acted | Quietus | small | a marker on every foe at the start, gone at its first action (X14); loses summons |
| X6 top | Sentence | small | a pulse every 4 ticks marks the top foe (X14); lags by up to 4 ticks |
| X7 weapon | the Hammer seat | small | the swing shape whatever it wields |
| X16 echo | Echo charm | small | none smaller (drop its exception, and Iron palm doubles) |
| X17 set | Gambler's coin | small | read once at application; later changes land on top |
| X18 live | Spiked bulwark | medium | read once at application (today's); Guard doesn't count |
| X20 receiver | Primer of frost | small | a flat +25% Chill boost (today's), or keep X20 with the card as a percentage |
| X27 chain | Flurry wraps | small | a second, separate strike at 80% (X26) |
| X30 cover | Oathbound shield | medium | heal the ally and pay the holder in untyped damage, by reaction |
| X33 heals own | The undying | small | healing received −100 on the seat |
| X37 move | Idol of the hungry dark | small | a Dispel on a clock |
| X38 one | Wildmagic wand | small | five 20% applies |
| X39 recast | Cataclysm staff | medium | ready the cast ability (X21 `event`) and free its next cast (X22) |
| X41 any | Ward of life | small | raise and shield in one cast, waiting for a fallen ally |

Within larger additions, two items have single-item parts whose simpler shapes I recommend: **Hammer and anvil's Mason** (X24's `target`): "when the Mason gives another ally a Guard or a Shield, the Hammer gains the same", by a reaction on `status_gained` with `other: holder` (X1, X2), copying a Shield's `amount`; and **Halo of the saint** (section 6).

My reading: X5, X6, X17, X33, X37 and X41 lose little in their simpler shapes; X16, X20, X27 and X38 cost little either way; X18, X30 and X39 are where a simpler shape saves real work.

---

## 5. Already possible: add nothing

The fill named engine numbers for these, but today's primitives (with the additions above where named) carry them:
- **A dying foe's statuses:** Sunhammer's priming, Pyre of the fallen and Gravemark's jump read `status_ended` with cause `ko` on a foe: a foe's statuses end, cause `ko`, just before its `ko` event. Only the amount (Wick, Ember heart, Eye of the tempest) needs X1.
- **"Every so often" (G13):** Warding bell, Bell of the hour, the Idol of the hungry dark and The wheel: an 11-tick timer status whose `status_ended` (expired) starts a pulse every 22. No `first` field.
- **The counters** (Cuts, Heat, Spite, Tempo, Surge, Fervor, Charge): Intensity statuses with a cap, boosts or stats, and `survivesKO` for Fervor. The hurricane's shared count is a copy on each ally that the interface shows once.
- **Kit states applied by an ability:** Shadow step, Lingering point, Flow state, Feeding frenzy, Rampart, Overcharge's charges, Static field, Drain the well (a one-tick self status hears the cast's own hit), Night's edge's Hidden (`to: { side: self, where: { lacks: hidden } }`).
- **Reading the target in a number:** Bellows lantern (its stacks read the foe's Burn: under one stack nothing lands, so no test is needed), Hexblade, Cinderheart staff, Executioner's longbow, Avalanche, Funeral pyre, Resonance, Gutting arrow.
- **Self-tests by rule:** Holdfast, Courier's coat, Gorged claws, Bloodsworn mail, Sanguine mail, Martyr's maul, Cistern rod (Bloodlust's pattern, `to: { side: self, where }`), with X14 for their markers.
- **Falls and returns:** Dawnblade, Funeral bell, Rallying horn, Martyr's locket, Mantle of the fallen, Pyre of heroes, Crown of embers (per-source auras that end with their source), Vestments of return.
- **Everything else the fill marks "existing primitives"** stands: every stats-only common, Spellbinder, Censer mace, Rootstaff, Glint wand, Echo horn, Last page, Glacier's heart, Volley bow's count, Storm pike, Hoarfrost line, Hearth, Knives drawn, Long march, The forge, Spur, Shieldwall, and the versions whose hooks are a new target rule or a second effect.

---

## 6. What can't be built as written

1. **A knocked-out unit can't gain a status** (`applyStatus` refuses one), and the fill leans on it three times. Dawnblade's "its own fall counts": count it on its own return (+8 Fervor on its own `revived`). Phoenix ember's and the Vial of the last breath's once-a-fight markers: apply them when it stands again (`revived`), and test `lacks` on the fall. Halo of the saint's "a status the fallen holds, filled by overflow": keep the count on the Cleric instead, filled by `overhealed` (X32) while an ally is down (X3); when it reaches a quarter of the Cleric's own max HP, the fallen ally stands with that much. The line's "a quarter of the fallen's max HP" becomes the Cleric's.
2. **"A heal given" reads the healed ally as `owner`, not `other`.** X2 makes the heal given `healed` with `other: holder`, so Holy water's cleanse, Saint's knucklebone's Might and Phylactery's Shield go `to: owner` (the fill wrote `to: other`).
3. **Ember heart's hook names `ko`**, after the dying foe's Burn is gone. It reads `status_ended` (burn, cause `ko`, whose foe) and its `amount` (X1), as the Wick's does. So does Eye of the tempest's Shock.
4. **Lightning rod lists Chain lightning** among "abilities that hit several foes". With `area` defined as a damage effect aimed at two or more units, Chain lightning's first strike is single-target and its three bounces are `area`; Thunderstorm and Blizzard are `area` throughout. The rod echoes the bounces, not the first strike. Counting the whole action instead would need the strikes to wait for the action's end: not worth it.
5. **Horn of the keep renews "Stand fast's Taunt".** A status doesn't know which ability applied it; the reaction renews any Taunt the Knight loses while an ally casts. The Knight's Taunts are Stand fast's, Hold the line's and its gear's, so it reads the same in play.
6. **Gambler's coin's "crit chance is 50%"** holds against stats (X17), but crit rules (X25) add after it: Venom vial makes a coin-holder 55% against a bleeding foe. The card's G17 line ("hits that always crit still do") already admits rules on top; "about 50%" on the card would cover the rest.
7. **Control resistance doesn't reach Weaken.** The rulings' levers name five locks that hold a lone boss all fight and answer them with control resistance; three are Weaken every swing (Withering idol, the Humbling mace, Thorn hedge's Weaken), and the director's design counts only Stun, Silence and Slow. The ruleset block lists its statuses, so adding `weaken` is one word, but that's the director's call: I've written their three.

Smaller notes for the content shares: Hidden is `unremovable`, and X15 ends it anyway; Annotated grimoire's free cast passes `available` with an empty pool (the cost is 0); The undying's Martyr stands through X36 while knocked out, as the line wants. Shared statuses need one owner each before the content shares start: I propose share W writes `marked` (it defines it, with its test) and the lead adds `heat` and `fervor` to `content/core-set/` (each used by three shares or more); `cuts`, `charge` (physical weapons), `spite`, `tempo`, `surge` (armor) and `einherjar` (upgrades, first eight) stay with the one share that uses them.

---

## 7. The split

**Who and when (share W):** X1 to X20. Events and what they name (the status side), event filters, tests on reactions and pulses, conditions, counts, picks, rules that skip, Marked, aims, seats, markers, Taunt ends Hidden, echo, stats set or live, control resistance.
- **Owns in `fight.ts`:** `derive`, `refresh`, `term`, `aval`, `fixed`, `sval`, `num`, `boostOf`, `passes`, `holds`, `sideOf`, `visibleFoes`, `value`, `defaultFoe`, `byRule`, `choose`, `targetsOf`, `applyStatus`, `gained`, `endStatus`, `pulseBatch`, `pulse`, `immune`, `ev`, `matches`, `listeners`, `fire`, `trigger`, `queueReaction`, `react`; the types `SInst` (peak), `Ev`, the react `Item` (the event's raw amount, damage type, count, ability id, repeat) and the drain `Item`, `CUnit.seat`, `CUnit.ctrl`, `CUnit.acted`. In `stats.ts`: `compile` (live and set). In `rules.ts`: the seat line of `combat.party()`.

**What happens (share H):** X21 to X41 and R4. Cooldown changes, MP and HP costs, ability changes by what they do or by name, crits by condition, extra strikes and reaction strikes, the hit, action, heal and knockout payloads, hits taken for others, HP floors, overhealing, heals blocked, the fallen's timers, a reviver's rule, after a won fight, moving statuses, random picks, recasts, abilities that bring statuses, "or" conditions.
- **Owns in `fight.ts`:** `actDef`, `allOf`, `available`, `start`, `cooldownOf`, `resolve`, `strikes`, `run`, `hit`, `critRoll`, `calc`, `take`, `strike`, `heal`, `revive`, `ko`, `damageEvents`; the types `Ctx` (landed, repeat), `ActDef`, the delayed `Item`. In `rules.ts`: `combat.party()` (passive forms, ability statuses).

**Both touch,** each for a line or two:
- `resolve` (H's): W sets `acted` (X5) and passes the action's kind to `choose` (X11, X12).
- `remove` (W's): H adds the `move` branch (X37).
- `step` (both): one dispatch branch each, W's drain item and H's delayed revive.
- `endStatus` (W's): H calls it from `take` with the breaker or attacker and the amount (X1).
- `Ev` and the react `Item` (W's types): H fills the hit and action fields in `hit`, `resolve`, `ko`, `heal`.
- `combat.party()` in `rules.ts`: W's seat line, H's passive and ability statuses.

**Order inside wave 2:** W lands the `Ev`, `Item` and `endStatus` signatures first (an afternoon), so H codes against them. `ENGINE_VERSION` goes to 0.17 once, at the merge. Each share adds its tests beside `coreset.test.ts` (a new `synergy.test.ts` each, to keep merges clean).

## 8. The schema as written

`src/schema.ts`, schema 0.8. Closed sets: `TAGS` `area`; `EVENTS` `overhealed`, `fight_won`; `LABELS` (`marker`); `COOLDOWN_WHICH`, `COOLDOWN_SET`, `COUNTS`, `UPGRADE_FORMS`. Shapes: `UnitCond` (`hasAny`, `lower`, `acted`, `top`, `weapon`); `Scale.count`; `Value` `swing`; `TargetRule` (`exclude` other or owner, `seat`); `Condition` (`atMost`, `seat`); `EventUnitTest`, `Test`; effects `cooldown`, `pay`, `strike`, `one`, `recast`, and `remove` (`marker`, `move`), `revive.after`; `EventSpec` (`other`, `source`, `notTags`, `seat`, `amountAtLeast`, `countAtLeast`, `repeat`); `Reaction.if`; `AbilityFilter`, `AbilityMod`, `CritRule`; `Status` (`focus`, `single`, `aim`, `mods`, `crits`, `echo`, `set`, `cover`, `floor`, `heals`, `revives`, `pulse.if`, `strike.share`, `strike.chain`, label `marker`); `StatChange.live`; `Ability` (`if: { any }`, `statuses`); `Rank`, `Control`, `Ruleset.control`; `Rarity` (moved up), `FormationRarity`, `Gear.rarity`, `Formation.rarity`; `Upgrade`, `UpgradeVersion`, `ContentPack.upgrades`; `PartyUnit.passive`.

The engine reads none of it yet. Two stubs keep the type checker honest and fail loudly if content uses them early: `value` throws on `by: swing` (X9) and `actDef` throws on `if: { any }` (X41). The validator checks the new references: forms complete and in their class, no stray forms, parties' forms and passive forms, a mythic's rarity, seats that exist (and no position named `next` or `previous`), control resistance's statuses and order, `exclude` other or owner and `strike` and `recast` only in reactions, `which: event` only in reactions, a marker lifted only by name, `count: targets` or `hit` only in actions, crit rules that add something, ability changes that change something, the filters' events.
