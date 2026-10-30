# The fill: upgrades and mythics, part 1

Oct 30, 2026. The upgrades and mythics of eight classes, written in full from `spine.md` sections 7 and 8, inside `fill-brief.md`'s rules and ranges: the Knight, Cleric, Ranger, Bramble knight, Hoplite, Paladin, Valkyrie and Bard. 32 entries (8 passives, 24 abilities), each with a power step and two versions (64 versions), then 8 mythics. The lists the brief asks for (CHALLENGES, NEW, least sure) are at the end.

**The lead's rulings are applied** (`fill-rulings.md`, Oct 30): the global rulings G1 to G10 and the section "Upgrades, first eight classes". Where an entry changed, it says which ruling changed it.

## How to read an entry

- **Now:** the ability's line in `docs/core-set/classes.md`, with today's numbers from `content/core-set/classes.ts` in brackets.
- **Power step:** the plain step, more of the same, sized by today's training rule (`src/rogue.ts`, `UPGRADE`: two fifths more of whatever the ability deals, heals, shields or stacks, or a quarter off a cooldown where there's no amount):
  - **more** of an amount or of stacks: two fifths more (× 1.4);
  - **cooldown shorter:** one word shorter (long 40 → medium 30), or a quarter off on the quick word, which has none below it;
  - **cheaper:** one rung down the ladder (spells 1,500 / 1,000 / 650 / 450; skills 750 / 500 / 325 / 200).
  Where it lands differently on a version, the entry says so.
- **A** and **B:** the two versions. Each stands alone against the base, and the power step lands on either. Each gives:
  - **Card:** the ability's text on the training screen, as the player reads it.
  - **Numbers:** only where they differ from the base. Amounts at the class's base stats in brackets.
  - **Hooks:** in `PRIMITIVES.md`'s terms; engine additions by their number in `spine.md` section 1; **NEW** where the list doesn't have it.
  - **Builds:** as the spine gives them, with what the version does there.
- **Words for time:** cooldowns quick 14, short 22, medium 30, long 40, very long 56 ticks (moved up to 15% by id, as today); wind-ups quick 1, normal 3, long 6, very long 8.
- **Stacks** follow `scale.ts`: an ability's "a few" is 1.4 a point of its stat, "several" 2.6; a passive's on a hit is half that. No version lands "many" in one cast (G8).
- **A status's length** is its own, or half of it where a line says "short" or "briefly" (G1), never more.
- **A version is content:** a new ability under its own id, as today's `upgraded()` makes the "+" one, or, for a passive, a new passive status in the class's place. Training a passive is a run-layer change (today only abilities train), listed under NEW.
- **One phrase this share adds,** used by three versions: **the ally foes are most drawn to** means a Taunting ally if there is one (the one with the most Aggro among several), otherwise the ally with the most Aggro. As a rule: `{side: allies, where: {has: taunt}, ifNone: any, pick: highest, by: {stat: aggro}}`.

---

## Knight

### Vanguard · passive

**Now:** It starts every fight behind a Shield that scales from its max HP. (A fifth of max HP: 1,000 at HP 5.)

**Power step:** a bigger Shield: 0.28 of max HP (1,400). On A both Shields grow, the ally's still stopping at half its own max HP. On B the Shield holds longer before it breaks.

**A, Stonewall**
- **Card:** Starts every fight behind a Shield from its max HP. The other ally with the lowest Aggro starts behind a Shield of the same size.
- **Numbers:** the ally's Shield is 0.2 of the Knight's max HP (1,000), up to half the ally's own max HP (1,000 on an HP 2 caster, so a caster starts full). Ties at random.
- **Hooks:** the passive's `fight_start` reaction gains a second `apply shield`, stacks from the Knight's `max_hp` (`of: holder`), `to: {side: others, pick: lowest, by: {stat: aggro}}`.
- **Builds:** Landslide (the mason: a second body in stone), Ambush (the rear guard, shielded from the first tick).

**B, Grudge**
- **Card:** Starts every fight behind a Shield from its max HP. When its Shield breaks, it Taunts and is Guarded.
- **Numbers:** Taunt and Guard at their own numbers (20 and 28 ticks). Each break counts, so a Shield rebuilt by an ally and broken again sets it off again.
- **Hooks:** a reaction on `status_ended`, `status: shield`, `cause: [stacks]` (the pool used up, not Dispelled), `do: apply taunt, apply guard, to: holder`. Bedrock already listens to the same event.
- **Builds:** Toll (a second Taunt on its own clock, set off by the beating), Lockdown (the gaoler keeps the foes' eyes on it).

### Fortify

**Now:** Applies Guard to the ally with the lowest share of max HP. (Long, quick wind-up, 325 MP.)

**Power step:** cooldown shorter: long → medium (40 → 30). The same on both versions.

**A, Stone guard**
- **Card:** Guards the other ally with the most Armor, and gives it a Shield from the Knight's Armor.
- **Numbers:** a Shield of a quarter of the Knight's Armor (1,000 at Armor 4; 1,750 while the Knight is Guarded), read when it lands.
- **Hooks:** `target: {side: others, pick: highest, by: {stat: armor}}` (the other ally, by the lead's ruling: the Knight itself was usually the most armored); `do: apply guard; apply shield, stacks {ratio: 0.25, stat: armor, of: self}`.
- **Builds:** Landslide (Guard's +3,000 Armor finally reaches the units whose kit scales from Armor: Rockfall, Tremor and Earthen shell, and a Hoplite's Shieldbearer swings).

**B, Cover**
- **Card:** Guards another ally in a wind-up, the one with the most wind-up left. With nobody else casting, the ally with the lowest share of HP.
- **Numbers:** as the base. It never waits: with no caster, it falls back.
- **Hooks:** the target is chosen when Fortify resolves, so the Knight's own one-tick wind-up is over; the rule reads `others`. **NEW:** a target `by` for the wind-up left, and a rule whose fallback picks by something else ("with nobody casting, the lowest").
- **Builds:** Bonfire, Overflow, Lockdown (casters kept standing through their long casts: Pyre, Fireball, Smite, Tremor).

### Stand fast

**Now:** Applies Taunt to itself, and Clarity to the ally with the least MP among those under half their max MP, or, with nobody under half, the ally with the least. (Medium, quick wind-up, 200 MP.)

**Power step:** cheaper: 200 → 125, by the lead's ruling. The ladder's bottom rung is 200; 125 is Blood drain's price, the one cost off it. The same on both versions.

**A, Rally the well**
- **Card:** Gives Clarity to every ally under half its MP. Waits until one is. No Taunt.
- **Numbers:** as the base: 200 MP, medium. Each Clarity at its own numbers (24% of the receiver's max MP over 16 ticks).
- **Hooks:** `if: {side: allies, where: {mpBelow: 50}}`; `target: {side: allies, where: {mpBelow: 50}, pick: all}`, `do: apply clarity`.
- **Builds:** Overflow (the wellspring: a wall that feeds every caster at once, and gives up its own draw to do it).

**B, Hold the line**
- **Card:** Taunts, and has Thorns medium for as long as the Taunt. No Clarity.
- **Numbers:** Thorns +150 for 20 ticks, Taunt's own length.
- **Hooks:** `do: apply taunt; apply hold_the_line` (a buff, Refresh, 20 ticks, `stats: thorns +150`), both `to: self`.
- **Builds:** Toll (the Knight as an anchor that returns blows, without a Thorns piece).

### Shield bash

**Now:** Deals physical damage that scales from max HP to a random foe, and applies Stun. (Light: 0.29 of max HP, 1,450 at HP 5. Medium, quick wind-up, 325 MP.)

**Power step:** more damage: 0.41 of max HP (2,030). On B, two fifths more of B's own.

**A, Measured blow**
- **Card:** Waits for a foe to start a wind-up, then bashes the casting foe with the highest Attack or Magic, scaling from max HP, and Stuns it. The Stun holds the wind-up where it is.
- **Numbers:** as the base.
- **Hooks:** `if: {side: foes, where: {casting: true}}`; `target: {side: foes, where: {casting: true, lacks: stun}, ifNone: any, pick: highest, by: {stats: [attack, magic]}}` (the Fizzle rule, as today). Stun pauses a wind-up; it doesn't interrupt.
- **Builds:** Lockdown (the watcher: the Stun lands on the cast it's for, not at random).

**B, Crushing bash**
- **Card:** Bashes a random foe for double, scaling from max HP and its current Shield together. No Stun. A longer cooldown.
- **Numbers:** 0.58 of (max HP + its Shield) (3,480 with Vanguard's 1,000; power step 0.81, 4,870). Long cooldown (40), 325 MP.
- **Hooks:** `amount: {scale: [{ratio: 0.58, stat: max_hp}, {ratio: 0.58, stacks: shield, of: self}]}`. It reads the Shield; it doesn't spend it.
- **Builds:** Landslide (the blow: rare, huge, and bigger the more stone the Knight wears).

---

## Cleric

### Last rites · passive

**Now:** Below 30% of its max HP, its cooldowns are halved; healed back to 30% or more, they return to normal.

**Power step:** the line at 40%. On A, any ally's line moves to 40%. On B, its own line does.

**A, Shared rites**
- **Card:** While it or any ally is below 30% of max HP, its cooldowns are halved.
- **Numbers:** as the base (cooldown reduction +100 while it holds).
- **Hooks:** today's pair of reactions (`hp_lost` applies `last_rites_on`, `healed` removes it), listening to its allies too (`whose: any` on its side), plus `ko` and `revived`. **NEW:** a reaction that tests a side ("any ally below 30%"), as an ability's `if` does; reactions have none today.
- **Builds:** Toll (the anchor's danger speeds the healer), Phoenix, Pact (low HP anywhere in the party is the healer's cue).

**B, Rite of passage**
- **Card:** Below 30% of its max HP, its cooldowns are halved. When an ally falls, they're halved for 20 ticks too.
- **Numbers:** a window of 20 ticks, Refresh (a second fall restarts it).
- **Hooks:** the base reactions, plus a reaction on `ko`, `whose: ally`: `apply rite_of_passage` (a buff, Refresh, 20 ticks, `stats: cooldown_reduction +100`) `to: holder`.
- **Builds:** Phoenix (the fall as a turn: Raise, Cure and Renew come round twice as fast right after).

### Renew

**Now:** Cleanses an ally with a debuff and applies Regen to it; with no ally debuffed, Regen on the ally with the lowest share of max HP. (Medium, normal wind-up, 650 MP.)

**Power step:** cheaper: 650 → 450. The same on both versions.

**A, Font**
- **Card:** Cleanses an ally with a debuff and gives it Regen and Clarity; with nobody debuffed, the ally with the lowest share of HP.
- **Numbers:** as the base; Clarity at its own numbers.
- **Hooks:** `do: remove debuff; apply regen; apply clarity`, same target.
- **Builds:** Overflow (a healer whose care is also mana).

**B, Anchor's blessing**
- **Card:** Cleanses the ally foes are most drawn to and gives it Regen.
- **Numbers:** as the base. It always fires on that ally, debuffed or not.
- **Hooks:** the target phrase above (Taunting first, then the most Aggro).
- **Builds:** Toll (the warden: the healer never leaves the anchor).

### Cure

**Now:** Heals the ally with the lowest share of max HP; the amount scales from Magic. Waits until an ally is below 80% of its max HP. (0.35 of Magic, 1,400 at Magic 4. Quick, quick wind-up, 450 MP.)

**Power step:** a bigger heal: 0.49 of Magic (1,960). On A it doubles too (0.98, 3,920). On B, the blow grows with the heal.

**A, Triage**
- **Card:** Waits until an ally is below 40% of its max HP, then heals it for twice as much.
- **Numbers:** 0.7 of Magic (2,800); waits for 40% (was 80%).
- **Hooks:** `if: {side: allies, where: {hpBelow: 40}}`; heal 0.7 of Magic.
- **Builds:** Pact, Phoenix (the drop caught: the party is let fall low, then lifted).

**B, Battle prayer**
- **Card:** Heals the ally with the lowest share of HP. Its next basic attack deals the same amount again as extra magical damage.
- **Numbers:** heal as the base; the next basic attack carries +0.35 of Magic (1,400) as magical damage, once. A second Cure before that swing doesn't add a second.
- **Hooks:** `do: heal; apply battle_prayer to self` (a buff, Refresh, `riders: [{on: basic, add: {type: magical, amount: 0.35 of Magic}}]`, with a reaction on its holder's `hit_lands`, `kind: basic` that removes it).
- **Builds:** Pact (healing turned into a blow), Landslide (a slow mace swing made big).

### Raise

**Now:** Revives a random knocked-out ally with half of its max HP. Waits until an ally is knocked out. (Very long, very long wind-up, 650 MP.)

**Power step:** more HP: 0.7 of max HP. On A, the raised ally comes back with two fifths more than the Cleric paid. On B, the raise is 0.7 and the Shield 0.47 of max HP (under the cap of a half).

**A, Martyr's raise**
- **Card:** Pays half its current HP to revive a random knocked-out ally with that much. Costs no MP.
- **Numbers:** price: half the Cleric's current HP (1,000 from a full HP 2 Cleric); the ally rises with that much, every ability on full cooldown (G10). 0 MP, by the lead's ruling. Very long, very long wind-up, as the base.
- **Hooks:** engine 4 (HP as a cost, in full), paid as G12 defines: the Cleric loses the HP at once; it isn't damage, so no Shield soaks it, nothing reacts to it, and it can't take the Cleric below 1 HP. The revive's `hp` reads the Cleric's current HP before the price is paid (`{ratio: 0.5, hp: current, of: self}`); see NEW. The payment itself doesn't set off Last rites, though it can leave the Cleric under the line for its next loss of HP.
- **Builds:** Pact, Phoenix (life passed on: a return that doesn't rest on MP).

**B, Ward of life**
- **Card:** Revives a random knocked-out ally with half its HP. With nobody down, gives an ally below a third of its max HP a Shield of a third of its max HP. Waits until one or the other.
- **Numbers:** the Shield: a third of the ally's max HP (1,667 on the Knight, 667 on an HP 2 caster). Wind-up normal (3, was very long), so the Shield lands before the blow it's for. Very long cooldown and 650 MP as the base, so a Shield spends the raise.
- **Hooks:** **NEW:** an "or" between an ability's conditions, each with its own target and effect: a fallen ally first (`revive`), else `{side: allies, where: {hpBelow: 33}, pick: lowest, by: hp_share}` (`apply shield`, stacks a third of the target's `max_hp`).
- **Builds:** Toll (the anchor caught before it falls), Pact (a revive that also prevents).

---

## Ranger

### Hunter's eye · passive

**Now:** Its basic attacks ignore Taunt: they go to a random foe, Taunting or not.

**Power step:** its basic attacks deal 15% more to foes that aren't Taunting. Both versions keep ignoring Taunt, so it lands the same on each.

**A, Quarry**
- **Card:** Basic attacks ignore Taunt and go to the foe with the lowest share of its max HP.
- **Numbers:** none.
- **Hooks:** `seek: basic`, plus a target rule for its basic attacks: `{side: foes, pick: lowest, by: hp_share}`. A Marked foe still comes first (G2: among several, by draw; its Seek follows the Mark past a Taunting foe). **NEW:** basic attacks with a target rule given by a passive (engine 2's machinery, which aims them by a status, extended to a rule).
- **Builds:** Hunt (the arrows finish what's wounded, and the staircase speeds up).

**B, Overwatch**
- **Card:** Basic attacks ignore Taunt, and go to a foe in a wind-up when there is one.
- **Numbers:** among several casters, the one with the highest Attack or Magic; with none, a random foe as now.
- **Hooks:** `seek: basic`; basic-attack target rule `{side: foes, where: {casting: true}, pick: highest, by: {stats: [attack, magic]}}`, falling back to the default pick. A Marked foe comes first, as on A (G2). The same **NEW** as A.
- **Builds:** Lockdown (a door: an archer that punishes every cast, so a Stun or Silence is followed by arrows).

### Barbed arrow

**Now:** Deals light physical damage that scales from Attack to a random foe, and adds several Bleed; stacks scale from Attack. (1,160 and 10.4 Bleed at Attack 4. Quick, quick wind-up, 200 MP.)

**Power step:** more Bleed: two fifths more (14.6). The same on A; on B, on each of the three.

**A, Deep barbs**
- **Card:** A barbed arrow at the foe with the most Bleed, adding several.
- **Numbers:** several Bleed from Attack, as the base (10.4; power step 14.6): "many" in the spine's line is several under G8, so the version is its aim.
- **Hooks:** `target: {side: foes, pick: highest, by: {stacks: bleed}}` (a random foe when none bleeds; the Taunt rule applies).
- **Builds:** Hunt, Cuts (one bleeding target that every hit in the party bursts).

**B, Scatter barbs**
- **Card:** Barbed arrows at three different foes, each a touch of damage and a few Bleed.
- **Numbers:** touch (0.17 of Attack, 680) and a few Bleed (5.6) on each of three; 16.8 Bleed in all.
- **Hooks:** two `damage` effects, as Chain lightning's: one at a random foe under the Taunt rule, one at `{side: foes, pick: random, count: 2, exclude: targets}`.
- **Builds:** Harvest (the field bleeding together), Toll (every attacker carrying a wound for the party's hits).

### Frost arrow

**Now:** Deals light physical damage that scales from Attack to the foe with the most Chill, and adds a few Chill; stacks scale from Attack. (1,160 and 2.8 Chill at Attack 4. Quick, quick wind-up, 200 MP.)

**Power step:** more Chill: two fifths more (3.9). On A, which adds no Chill, two fifths more damage. On B, 1.4 Chill on every foe.

**A, Pinning arrow**
- **Card:** A quick arrow at the foe with the highest Attack or Magic, which is Slowed. No Chill.
- **Numbers:** Slow at its own numbers (−40 speed for 24 ticks). On a quick cooldown it holds one foe Slowed for good: a hold that never bursts.
- **Hooks:** `target: {side: foes, pick: highest, by: {stats: [attack, magic]}}` (the Taunt rule applies); `damage` with `apply: [{status: slow}]`.
- **Builds:** Lockdown (the slow that holds the dangerous foe without ever shattering).

**B, Hail**
- **Card:** A quick arrow at the foe with the most Chill, and one Chill on every foe.
- **Numbers:** one Chill on every foe (in place of a few on one). One a foe every 14 ticks also matches Chill's thaw (a stack every 14 ticks), so the whole field's cold stops falling.
- **Hooks:** the base `damage` (no `apply`), plus `apply chill, stacks 1, to: {side: foes, pick: all}`.
- **Builds:** Snap (spread wide: every other source's Chill holds, and the shatters come across the pack).

### Rending arrow

**Now:** Deals physical damage that scales from Attack to the foe with the most Sunder, and adds a few Sunder; stacks scale from Attack. (Normal: 2,000 and 5.6 Sunder at Attack 4. Short, normal wind-up, 325 MP.)

**Power step:** more Sunder: two fifths more (7.8). On A, of A's several (14.6). On B, which adds none, two fifths more damage.

**A, Armor breaker**
- **Card:** An arrow at the foe with the most Armor, adding several Sunder.
- **Numbers:** several Sunder (10.4, about half of Sunder's cap of 20).
- **Hooks:** `target: {side: foes, pick: highest, by: {stat: armor}}` (the Taunt rule applies).
- **Builds:** Cuts and Landslide against Armor (the plated foe opened for the small hits, or for the blow).

**B, Gutting arrow**
- **Card:** An arrow at the foe with the lowest HP. Half again as much below half its HP, double below a quarter. No Sunder.
- **Numbers:** normal (2,000); 3,000 below half; 4,000 below a quarter.
- **Hooks:** `target: {side: foes, pick: lowest, by: hp}` (the Taunt rule applies); `amount: {scale: [{ratio: 0.5, stat: attack}, {ratio: 0.25, when: {hpBelow: 50}, of: target, times: {stat: attack}}, {ratio: 0.25, when: {hpBelow: 25}, of: target, times: {stat: attack}}]}`.
- **Builds:** Hunt (the finisher, and a staircase on a boss: it hits harder the further the boss falls).

---

## Bramble knight

### Briar · passive

**Now:** Each time its Thorns damage a foe, that foe gets a few Bleed; stacks scale from Armor. (2.1 at Armor 3.)

**Power step:** more Bleed: two fifths more (2.9). On A, more Bleed lasts longer, and so does the healing. On B, on both foes.

**A, Bloodroot**
- **Card:** Foes its Thorns wound start to bleed. While a foe bleeds, each action it takes heals the Bramble knight a little.
- **Numbers:** 1.5% of its max HP for each action a bleeding foe takes (75 at HP 5). Against six wolves, about a quarter of what they deal it; against a lone boss, almost nothing.
- **Hooks:** Briar's reaction also applies `bloodroot` to the foe (a debuff, Per source, knows its source): a reaction on its holder's `action_resolve` heals `source`; a reaction on the holder's `status_ended`, `status: bleed`, removes it.
- **Builds:** Pact, Toll (healing that follows how much the foes act: the anchor fed by the rush).

**B, Spreading thorns**
- **Card:** When its Thorns strike, they strike a second, random foe too, and both start to bleed.
- **Numbers:** the full Thorns (300 at high) to a second foe. The second strike never sets off a third.
- **Hooks:** a reaction on `damage_dealt`, `status: thorns`: `damage, type: none`, Thorns from the holder, to a random foe other than the event's foe. Its damage is its own status's, not Thorns', so it doesn't chain; Briar listens to both. **NEW** (small): a reaction's target rule that skips the event's other unit.
- **Builds:** Harvest (the rod: one body drawing the field, and its returns spreading across it).

### Thicket

**Now:** Applies Taunt and Guard to itself. (Medium, quick wind-up, 200 MP.)

**Power step:** cooldown shorter: one word. Base medium → short; A very long → long (then its Taunts never lapse); B long → medium.

**A, Overgrowth**
- **Card:** Taunts itself twice over, and its Thorns are half again as strong while the Taunts last. No Guard.
- **Numbers:** two Taunts back to back (40 ticks); Thorns half again for those 40 ticks (+150 at high, read when it lands). Very long cooldown (56), 325 MP: Taunted 40 of every 56 ticks, and all the time with the power step. The spine's "doubled" is half again under G9, since the power step keeps the Taunts up all fight.
- **Hooks:** `do: apply taunt; apply overgrowth` (a buff, 40 ticks, `stats: thorns + half its own Thorns`, with a reaction on `status_ended`, `status: taunt`, `cause: [expired]` that applies Taunt once more). The Taunt keeps its own 20 ticks; "longer" is a second one (see least sure).
- **Builds:** Toll (the glass thorn: everything comes to it, with nothing to blunt it, and everything pays more).

**B, Grove**
- **Card:** Guards every ally. No Taunt.
- **Numbers:** long cooldown (40, was medium), 325 MP (was 200). Guard at its own numbers (28 ticks), so the party is Guarded 28 of every 40 ticks.
- **Hooks:** `target: {side: allies, pick: all}`, `do: apply guard`.
- **Builds:** Landslide, Bonfire, Harvest (the whole field's blows held off every body, not drawn onto one).

### Regrowth

**Now:** Applies Regen to the ally with the lowest share of max HP. (Medium, normal wind-up, 325 MP.)

**Power step:** cheaper: 325 → 200. The same on both versions.

**A, Deep roots**
- **Card:** Regen on itself, and Thorns up while it heals.
- **Numbers:** Thorns +150 (medium) for Regen's 24 ticks.
- **Hooks:** `target: self`; `do: apply regen; apply deep_roots` (a buff, 24 ticks, `stats: thorns +150`).
- **Builds:** Toll (the anchor mends itself and bites harder while it does).

**B, Blossom**
- **Card:** Regen on every ally, lasting half as long.
- **Numbers:** a short Regen on every ally, half its own length (G1): 12 ticks, three pulses, 24% of max HP each. Medium, 325 MP, as the base.
- **Hooks:** `target: {side: allies, pick: all}`, `apply regen, duration: 12`.
- **Builds:** Pact, Harvest (the whole party mended while it holds the full field).

### Bramble lash

**Now:** Deals physical damage that scales from Thorns to a random foe. (4.5 × Thorns: 1,350 at high. Quick, quick wind-up, 200 MP.)

**Power step:** more damage: 6.3 × Thorns (1,890). On A, on each foe. On B, of B's double.

**A, Whipping vines**
- **Card:** Lashes every foe with its thorns, for half.
- **Numbers:** 2.25 × Thorns to every foe (675). Short cooldown (22, was quick), 325 MP (was 200).
- **Hooks:** `target: {side: foes, pick: all}` (physical Area, Hidden foes included).
- **Builds:** Harvest (the physical sweep).

**B, Rebuke**
- **Card:** Waits until it's been hit five times since its last lash, then lashes a random foe for double.
- **Numbers:** 9 × Thorns (2,700). The quick cooldown still applies after each lash.
- **Hooks:** a hidden count on the Bramble knight (an Intensity status gaining a stack on `hit_taken`, at most one every 2 ticks under G11, so five take at least 10 ticks even in a swarm); `if: {side: self, where: {stacks: {status: rebuke_count, atLeast: 5}}}`; the lash removes the count.
- **Builds:** Toll (damage that follows the foe: the more it's struck, the more it lashes).

---

## Hoplite

### Phalanx · passive

**Now:** Its basic attacks come half as often and deal double damage.

**Power step:** a little more than double: × 2.4 (Phalanx's boost +140%, was +100%). On A, the first swing with the rest. On B, the Armor part grows with the rest.

**One swing shape (G5):** Phalanx, in either version, is the Hoplite's swing shape and comes first. A Millstone, Hummingbird charm, Worldbreaker or Hammer seat on the Hoplite gives Attack +1 instead of its shape.

**A, Opening thrust**
- **Card:** Basic attacks come half as often and deal double. The first of each fight comes at once.
- **Numbers:** the first swing deals double, as every Phalanx swing does: the spine's triple is past the ceiling (G14). What the version adds is the timing: a doubled swing on the first tick, where it would have come 7 to 15 ticks in.
- **Hooks:** a reaction on `fight_start`: engine 1 (the attack timer made ready). No boost of its own.
- **Builds:** Ambush (the opener), Landslide (one huge blow, struck first).

**B, Shieldbearer**
- **Card:** Basic attacks come half as often and deal double. Armor adds to them half as much as Attack does.
- **Numbers:** each swing adds physical damage of a tenth of its Armor, sized by the weapon's interval as a swing is (0.06 × Armor on a spear, 0.08 on a great weapon), then doubled by Phalanx: about +600 and +800 at Armor 5, a third more on either, and +350 and +480 more while Guarded.
- **Hooks:** `riders: [{on: basic, add: {type: physical, amount: 0.06 or 0.08 × armor}}]` by the held kind (two numbers in content); the rider is part of the hit, so Phalanx's boost applies.
- **Builds:** Landslide (the Hoplite's Armor 5 finally does something, and Plate, Guard and Stone guard feed the blow).

### Aspis

**Now:** Applies Aegis to the ally with the lowest share of max HP. (Long, quick wind-up, 500 MP; waits for an ally without Aegis.)

**Power step:** cooldown shorter: one word. Base and A long → medium; B very long → long.

**A, Watch the anchor**
- **Card:** Aegis on the ally foes are most drawn to.
- **Numbers:** as the base. With the anchor already holding Aegis, the next ally foes are drawn to (the Fizzle rule).
- **Hooks:** the target phrase above, with `lacks: aegis`.
- **Builds:** Toll (the anchor's one big blow caught every time).

**B, Shield wall**
- **Card:** Aegis on every ally.
- **Numbers:** very long cooldown (56, was long), 750 MP (the top skill rung, was 500): about one wall a fight from the Hoplite's 1,300 pool. Aegis blocks a hit above a quarter of max HP, so on an HP 2 caster (500) it catches an ordinary minion's swing.
- **Hooks:** `if: {side: allies, where: {lacks: aegis}}`; `target: {side: allies, where: {lacks: aegis}, pick: all}`.
- **Builds:** Bonfire, Harvest (the full field's pressure held off the fragile).

### Paired guard

**Now:** Applies Guard to itself and to the other ally with the lowest share of max HP. (Long, normal wind-up, 325 MP.)

**Power step:** cheaper: 325 → 200. The same on both versions.

**A, Line of shields**
- **Card:** Guards both other allies. Not itself.
- **Numbers:** as the base.
- **Hooks:** `target: {side: others, pick: all}`, `do: apply guard`.
- **Builds:** Harvest, Bonfire (the bodyguard spends itself on the party).

**B, Guard the blade**
- **Card:** Guards itself and the other ally with the highest Attack or Magic.
- **Numbers:** as the base.
- **Hooks:** the second Guard `to: {side: others, pick: highest, by: {stats: [attack, magic]}}`.
- **Builds:** Hunt, Ambush (the hunter kept alive through the exposed tail).

### Spear thrust

**Now:** Deals physical damage that scales from Attack to a random foe, and adds a few Sunder; stacks scale from Attack. (1.1 × Attack, 4,400 at Attack 4, and 5.6 Sunder. Medium, long wind-up, 325 MP.)

**Power step:** more damage: two fifths more. 1.54 × Attack on the base and B; 1.12 on each of A's two.

**A, Skewer**
- **Card:** A thrust through a random foe and on into the foe with the most HP, each for three quarters, each adding a few Sunder.
- **Numbers:** 0.8 × Attack (3,200) on each of two foes. Against a lone foe, one thrust at 3,200: less than the base.
- **Hooks:** two `damage` effects: one at a random foe under the Taunt rule, one at `{side: foes, pick: highest, by: hp, exclude: targets}`.
- **Builds:** Harvest (the healthiest foe brought down with the rest).

**B, Hunter's thrust**
- **Card:** A thrust past any guard at the foe with the lowest HP, adding a few Sunder.
- **Numbers:** as the base.
- **Hooks:** `seek: true`; `target: {side: foes, pick: lowest, by: hp}`.
- **Builds:** Hunt (the bodyguard's spear joins the kill).

---

## Paladin

### Judgement · passive

**Now:** Its hits deal half again as much damage to foes with a buff.

**Power step:** a bigger bonus: +70% (was +50%). The same on both versions.

**A, Inquisition**
- **Card:** Its hits deal half again as much to foes with a debuff.
- **Numbers:** +50% when the target holds any debuff.
- **Hooks:** `boosts` on physical and magical, `{ratio: 50, when: {debuffs: true}, of: target}`.
- **Builds:** Lockdown, Bonfire, Toll (every curse the party lays turns on the bonus; Smite's own Burn does too).

**B, Sentence**
- **Card:** Its hits deal half again as much to the foe with the highest Attack or Magic.
- **Numbers:** +50% on that foe only. Smite already aims there, so every Smite gets it.
- **Hooks:** `boosts` with `when: the target is its side's highest by attack or magic`. **NEW** (small): that condition.
- **Builds:** Hunt (the dangerous one, singled out).

### Sanctuary

**Now:** Applies Ward to every ally. (Long, long wind-up, 1,000 MP.)

**Power step:** cooldown shorter: long → medium. The same on both versions.

**A, Sanctum**
- **Card:** Ward and a Shield from Magic on every ally.
- **Numbers:** a Shield of a quarter of Magic on each (1,000 at Magic 4). 1,500 MP (the top spell rung, was 1,000).
- **Hooks:** `do: apply ward; apply shield, stacks {ratio: 0.25, stat: magic, of: self}`, `to: {side: allies, pick: all}`.
- **Builds:** Phoenix (the survivors behind stone when one falls), Harvest (the held field).

**B, Consecration**
- **Card:** Ward on every ally, and a few Burn on every foe.
- **Numbers:** a few Burn from Magic on each foe (5.6). Cost as the base.
- **Hooks:** a second effect, `apply burn` `to: {side: foes, pick: all}`.
- **Builds:** Bonfire, Harvest (a fire lit under the whole field while the party is warded).

### Absolve

**Now:** Cleanses and heals itself and the other ally with the lowest share of max HP; the heal scales from Magic. Waits until an ally is below max HP. (0.4 of Magic each, 1,600. Medium, normal wind-up, 650 MP.)

**Power step:** a bigger heal: 0.56 of Magic (2,240). On A, the doubled heals grow to 1.12 of Magic (4,480), and the price with them. On B, the raise comes back with 0.28 of max HP.

**A, Penance**
- **Card:** Cleanses and heals both other allies for twice as much, and pays a fifth of each heal in its own HP. Not itself.
- **Numbers:** 0.8 of Magic each (3,200 at Magic 4); the price a fifth of each heal (640 a heal, 1,280 for both). Waits until another ally is below max HP and the Paladin is at 35% of its max HP or more, as Blood gift does, so it stops paying when low. By the lead's ruling, in place of the Might.
- **Hooks:** `if: [{side: others, where: {hpBelow: 100}}, {side: self, where: {hpAtLeast: 35}}]`; `target: {side: others, pick: all}`; `do: remove debuff; heal 0.8 of Magic`; the price by engine 4 (HP as a cost, in part: 0.32 of Magic for two heals), paid as G12 defines: lost at once, not damage, soaked by no Shield, heard by nothing, never below 1 HP.
- **Builds:** Pact (life passed on: the Paladin bleeds so the others mend).

**B, Absolution**
- **Card:** Waits until an ally falls, then revives a random knocked-out ally with a fifth of its HP.
- **Numbers:** a fifth of max HP, every ability on full cooldown (G10). Very long cooldown (56, was medium), normal wind-up, 650 MP (the revives' price). No heal and no cleanse.
- **Hooks:** as Raise: `if: {side: allies, where: {ko: true}}`, `target: {side: allies, where: {ko: true}}`, `revive`.
- **Builds:** Phoenix (a revive for one more class, in a body that doesn't fall easily).

### Smite

**Now:** Deals heavy magical damage that scales from Magic to the foe with the highest Attack or Magic, and adds several Burn; stacks scale from Magic. (In content a normal hit: 0.5 of Magic, 2,000, and 10.4 Burn at Magic 4. Medium, long wind-up, 650 MP.)

**Power step:** more damage: two fifths more (2,800). On B, on each foe.

**A, Hammer of dawn**
- **Card:** Magical damage to the foe with the highest Attack or Magic, which is Stunned. No Burn.
- **Numbers:** as the base hit; Stun at its own 8 ticks.
- **Hooks:** `apply: [{status: stun}]` in place of Burn; the Fizzle rule (`lacks: stun`, `ifNone: any`), as Shield bash's.
- **Builds:** Lockdown, Landslide (the rare blow that staggers).

**B, Pyre of judgement**
- **Card:** Magical damage to every burning foe, half as hard, adding a few Burn to each. Waits until a foe burns.
- **Numbers:** 0.25 of Magic (1,000) and a few Burn (5.6) on each burning foe.
- **Hooks:** `if: {side: foes, where: {has: burn}}`; `target: {side: foes, where: {has: burn}, pick: all}` (Area: the Taunt and Hidden rules don't apply).
- **Builds:** Bonfire, Harvest (the fire fed everywhere at once; Consecration lights it alone).

---

## Valkyrie

### Einherjar · passive

**Now:** Allies it revives come back with all their actions ready, instead of on cooldown.

**Power step:** allies it revives come back with a small Shield: 15% of their max HP. It lands as written on both versions (on B, on the allies Valhalla raises, which come back on cooldown).

**A, Chosen**
- **Card:** Allies it revives come back with all their actions ready, and Guarded.
- **Numbers:** Guard at its own numbers (+3,000 Armor for 28 ticks). By the lead's ruling, in place of Haste and Might.
- **Hooks:** the revive's `ready: true`, then `apply guard` on the revived (a reaction on `revived` with the Valkyrie as `other`, or an effect after Valhalla's `revive`).
- **Builds:** Phoenix (the return that survives its first moments and unloads).

**B, Chooser of the slain**
- **Card:** While it stands, every ally deals a fifth more to foes below half their HP. Allies it revives come back on cooldown, as anyone's do.
- **Numbers:** +20% physical and magical damage on foes below 50% HP.
- **Hooks:** a `fight_start` reaction gives every ally an aura (a buff, Per source, ends with its source, `boosts: {ratio: 20, when: {hpBelow: 50}, of: target}` on physical and magical).
- **Builds:** Hunt, Harvest (the finish: the second half of every foe goes faster).

### Gale spear

**Now:** Has Seek. Three quick hits on a random foe that isn't Taunting; each deals magical damage that scales from Attack and adds a few Shock, with stacks that scale from Attack. (0.09 of Attack a hit, 360, and 2.8 Shock a hit at Attack 4. Quick, quick wind-up, 200 MP.)

**Power step:** more damage: 0.126 of Attack a hit (504). The same on both versions.

**A, Gale storm**
- **Card:** Three quick magical hits on three different foes, the first past any guard, each adding a few Shock.
- **Numbers:** as the base, one hit to each foe; fewer foes, fewer hits.
- **Hooks:** two `damage` effects: one hit at a random foe that isn't Taunting (Seek), then one hit each at `{side: foes, pick: random, count: 2, exclude: targets}`.
- **Builds:** Harvest, Cuts (the spear's Shock on every foe that acts).

**B, Spear of the hunt**
- **Card:** Three quick magical hits past any guard on the foe with the lowest HP, each adding a few Shock.
- **Numbers:** as the base.
- **Hooks:** `seek: true`; `target: {side: foes, pick: lowest, by: hp}`.
- **Builds:** Hunt (the weakest finished past the front).

### Rally

**Now:** Heals the ally with the lowest share of max HP; the amount scales from Magic. Waits until an ally is below 80% of its max HP. (0.45 of Magic, 1,350 at Magic 3. Medium, normal wind-up, 650 MP.)

**Power step:** a bigger heal: 0.63 of Magic (1,890). On B, of B's double (1.26, 3,780); the Taunt stays as it is.

**A, Battle hymn**
- **Card:** Heals the ally with the lowest share of HP, and Hastes it.
- **Numbers:** Haste at its own numbers.
- **Hooks:** `do: heal; apply haste`, same target.
- **Builds:** Cuts, Pact (the hurt one comes back faster, and a Lifesteal unit drinks faster).

**B, Last stand**
- **Card:** Waits until an ally is below 30% of its max HP, then heals it for double, and the Valkyrie Taunts briefly.
- **Numbers:** 0.9 of Magic (2,700); waits for 30% (was 80%). A short Taunt, half its own length (G1): 10 ticks. A Valhalla at a tenth sets it off at once. The Taunt is the lead's ruling, so it no longer repeats Cure's Triage.
- **Hooks:** `if: {side: allies, where: {hpBelow: 30}}`; `do: heal; apply taunt, duration: 10, to: self`. A Taunt ends Hidden (engine 17).
- **Builds:** Phoenix, Pact (from the brink: the Valkyrie stands over the one she saved and draws the blows off it).

### Valhalla

**Now:** Revives a random knocked-out ally with a tenth of its max HP. Waits until an ally is knocked out. (Very long, quick wind-up, 650 MP.)

**Power step:** more HP: 0.14 of max HP. The same on both versions.

**A, Flight of the valkyries**
- **Card:** Revives every knocked-out ally with a tenth of its HP.
- **Numbers:** a cooldown a quarter past very long (70 ticks, by the lead's ruling; there's no longer word), 650 MP. The revived come back ready under Einherjar, on full cooldown without it (G10).
- **Hooks:** `target: {side: allies, where: {ko: true}, pick: all}`, `revive`. Einherjar (or Chosen) applies to each.
- **Builds:** Phoenix (two falls answered by one cast).

**B, Dawn muster**
- **Card:** Revives a random knocked-out ally with a tenth of its HP. At a fight's start, if an ally is down from an earlier fight, it's ready at once, whatever its cooldown.
- **Numbers:** once a fight, at its start; it still costs 650 MP and goes on cooldown after.
- **Hooks:** a `fight_start` reaction on the Valkyrie: engine 1 (Valhalla made ready) when an ally is knocked out. Slotted first, it's the fight's first act.
- **Builds:** Ambush (a raise first in the order), Phoenix (the return between fights that doesn't wait).

---

## Bard

### Refrain · passive

**Now:** Each of its basic attacks that lands heals a random ally and gives a random ally MP, each 30% of the damage the attack dealt.

**Power step:** a bigger share: 42%. On B, the MP share is 42% and the Might two fifths more.

**A, Harmony**
- **Card:** Each basic attack that lands heals the ally with the lowest share of its HP and gives MP to the ally with the lowest share of its MP, each 30% of the damage dealt.
- **Numbers:** as the base.
- **Hooks:** the two effects' `to`: `{side: allies, pick: lowest, by: hp_share}` and `{side: allies, pick: lowest, by: mp_share}`.
- **Builds:** Overflow (the mana goes where it's short), Pact (the heal goes where it's needed).

**B, Battle song**
- **Card:** Each basic attack that lands gives a random ally a few Might, and gives a random ally MP, 30% of the damage dealt.
- **Numbers:** a few Might from Magic, a passive's (2.1 at Magic 3), in place of the heal.
- **Hooks:** the heal effect becomes `apply might, stacks own few from magic`, `to: {side: allies, pick: random}`.
- **Builds:** Landslide (Might, spent by action, kept longest on the slowest swing), Cuts (a fast bow or wand handing it out on every note).

### War ballad

**Now:** Adds a few Might to every ally; stacks scale from Magic. (4.2 at Magic 3. Quick, quick wind-up, 450 MP.)

**Power step:** more Might: two fifths more (5.9). On A, of A's half again (8.8). On B, which gives no Might, a quarter off its cooldown (14 → 10.5), today's rule for an ability with no amount.

**A, Lament**
- **Card:** Might to every ally below half its HP, half again as many. Waits until an ally is below half.
- **Numbers:** 6.3 Might each. The spine's "twice as many" is half again under G9: a Pact party keeps its members below half most of a fight.
- **Hooks:** `if: {side: allies, where: {hpBelow: 50}}`; `target: {side: allies, where: {hpBelow: 50}, pick: all}`.
- **Builds:** Pact, Phoenix (the low as the strong).

**B, Marching song**
- **Card:** Every ally's next basic attack comes at once. No Might.
- **Numbers:** as the base: quick, 450 MP. A free swing worth more to a slow weapon than a fast one.
- **Hooks:** engine 1 (each ally's attack timer made ready), `to: {side: allies, pick: all}`.
- **Builds:** Cuts (the blur kept on the beat), Ambush (with its cooldown saved from the last fight, the whole party swings on the first tick).

### Allegro

**Now:** Applies Haste to every ally. (Long, quick wind-up, 650 MP.)

**Power step:** cooldown shorter: one word. Base and A long → medium; B short → quick.

**A, Rubato**
- **Card:** Haste on every ally, and each ally's ability with the longest cooldown left comes 4 ticks closer.
- **Numbers:** 4 ticks a cast, for each ally.
- **Hooks:** a second effect: engine 1 (a refund of 4 ticks on the ability with the longest cooldown left), `to: {side: allies, pick: all}`.
- **Builds:** Overflow (the big casts come round), Lockdown (the locks come round).

**B, Accelerando**
- **Card:** Haste on the ally that attacks fastest.
- **Numbers:** short cooldown (22, was long), 450 MP (was 650). Haste lasts 20 ticks, so that ally is Hasted almost all fight.
- **Hooks:** **NEW** (small): a target `by` the basic attack's interval (the weapon's speed under Haste, Slow and Chill), lowest first.
- **Builds:** Cuts (the pacer: one blade made a blur).

### Thunder chord

**Now:** Adds several Shock to every foe; stacks scale from Magic. (7.8 at Magic 3. Short, normal wind-up, 650 MP.)

**Power step:** more Shock: two fifths more (10.9). On A, which adds none, two fifths more damage a stack (84). On B, which adds none, one cooldown word shorter (long → medium).

**A, Resonance**
- **Card:** Magical damage to every foe for each Shock it holds. Adds no Shock. Waits until a foe holds Shock.
- **Numbers:** 60 a stack (a foe on 15 Shock takes 900, before Magic resist). The Shock stays.
- **Hooks:** `if: {side: foes, where: {has: shock}}`; `target: {side: foes, pick: all}`; `amount: {scale: [{ratio: 60, stacks: shock, of: target}]}`, as Pyre reads Burn.
- **Builds:** Harvest (the field's Shock, from anyone, cashed in at once).

**B, Lullaby**
- **Card:** Slows every foe. No Shock.
- **Numbers:** long cooldown (40, was short). Slow at its own numbers (24 ticks), so the field is Slowed 24 of every 40 ticks.
- **Hooks:** `do: apply slow`, `to: {side: foes, pick: all}`.
- **Builds:** Lockdown, Toll (fewer blows, all of them still landing on the anchor).

---

## Mythics

Each fits one class, sits in its slot, and a unit wears one at most. Offered in act II and III boss boons.

### Horn of the keep · Knight · offhand

- **Card:** Fits the Knight. Every hit the Knight takes gives the other ally with the least MP a tenth of the hit's damage as MP. When Stand fast's Taunt runs out while an ally is in a wind-up, the Knight Taunts again.
- **Numbers:** MP a tenth of the damage the hit dealt (a 400 bite gives 40; a 2,000 blow, 200), to the other ally with the lowest share of its MP (the other ally, by the lead's ruling). The renewed Taunt is Taunt's own 20 ticks, and it renews again if an ally is casting when that one ends.
- **Hooks:** a reaction on `hit_taken`: `mp`, `amount: {ratio: 0.1, amount: true}`, `to: {side: others, pick: lowest, by: mp_share}`. A reaction on `status_ended`, `status: taunt`, `cause: [expired]`, applies Taunt if an ally is casting: **NEW**, a reaction that tests a side (as Shared rites). The mythic names Stand fast: **NEW**, a mythic that changes its class's abilities by name. With Stand fast trained as Rally the well (no Taunt), the second half is idle.
- **Pulls toward:** Overflow 3 ●●●, Toll ●● (a wall whose beating feeds the casters).

### Halo of the saint · Cleric · amulet

- **Card:** Fits the Cleric. While an ally is knocked out, the part of the Cleric's heals that would go past full goes to it instead, filling its empty HP bar. At a quarter of its max HP, it stands with that much.
- **Numbers:** a quarter of the fallen ally's max HP (500 on an HP 2 caster, 1,250 on the Knight). One fallen ally fills at a time: the one already fullest. It comes back with every action on cooldown, as any revive. Nothing fills while nobody's down.
- **Hooks:** engine 7 (a heal given) and engine 8 (the part past full); `revive` with `hp` from the filled amount. **NEW:** a status a knocked-out unit holds, filled by that overflow, shown on its bar.
- **Pulls toward:** Phoenix 3 ●●●.

### Huntmaster's quiver · Ranger · armor

- **Card:** Fits the Ranger. All the Ranger's abilities aim past any guard at the foe with the lowest HP. When a foe one of them hit falls, the cooldowns left on its abilities are halved.
- **Numbers:** each ability's remaining cooldown halved, once a kill, whoever lands it.
- **Hooks:** each of its abilities re-aimed `{side: foes, pick: lowest, by: hp}` with `seek: true` (Seek by the lead's ruling, so a Taunting front doesn't catch the hunt). The abilities mark their target with a hidden debuff (Per source, `survivesKO`) whose reaction on its holder's `ko` refunds half of each remaining cooldown on `source` (engine 1). A version's own aim gives way to the quiver's. **NEW:** a mythic that re-aims its class's abilities by name.
- **Pulls toward:** Hunt 3 ●●●.

### Heartwood mail · Bramble knight · armor

- **Card:** Fits the Bramble knight. Whenever a hit lands on any ally, the Bramble knight's Thorns strike the attacker too.
- **Numbers:** its full Thorns (300 at high). Briar's Bleed follows them. Hits on the Bramble knight itself set off its Thorns once, as now.
- **Hooks:** a reaction on `hit_taken`, `whose: ally`: `damage, type: none`, Thorns read from the holder, `to: other`. Briar listens to this damage as to its Thorns; so does Spreading thorns, whose second strike still never chains.
- **Pulls toward:** Toll 3 ●●● (thorns on the whole party).

### The last wall · Hoplite · offhand

- **Card:** Fits the Hoplite. The first time an Aegis from each Aspis blocks a blow, the attacker takes the blocked damage, up to half the Hoplite's max HP, and Aspis is ready again at once.
- **Numbers:** the blocked amount, untyped (not dodged, not reduced), at most half the Hoplite's max HP (2,000 at HP 4), once per Aspis cast (with Shield wall, the first of its Aegis to block). Aspis still costs its MP when it's cast again. The cap and the once are the lead's ruling.
- **Hooks:** each Aspis cast puts a hidden marker on the Hoplite; the return needs it and spends it (an `if` on the reaction, NEW 1). Engine 1 (Aspis made ready). **NEW:** an event when a block is spent that carries the blocked amount and the attacker (`status_ended` with `cause: spent` has neither). Can't be held under a great weapon.
- **Pulls toward:** Toll 3 ●●, Bonfire 3 ●● (the keeper).

### Chains of light · Paladin · offhand

- **Card:** Fits the Paladin. Smite also Silences its target. The Paladin's hits on a Stunned or Silenced foe heal the ally with the lowest share of HP for half the damage dealt.
- **Numbers:** half of each such hit's damage. Silence at its own 16 ticks; Smite skips a foe already Silenced for the next one its phrase allows (the Fizzle rule) and fires anyway if all are.
- **Hooks:** Smite gains `apply: [{status: silence}]` (**NEW:** a mythic that changes its class's ability by name). A reaction on `hit_lands`: `heal`, `{ratio: 0.5, amount: true}`, `to: {side: allies, pick: lowest, by: hp_share}`, when the target has any of Stun or Silence: engine 15, read on the event's other unit (**NEW:** a reaction that tests a unit, as above).
- **Pulls toward:** Lockdown 3 ●●●, Pact ●.

### Stormspear · Valkyrie · weapon (medium, magical, one hand)

- **Card:** Fits the Valkyrie. A medium, magical, one-handed spear. Its basic attacks scale from Attack, ignore Taunt, and add a few Shock, as a hit of Gale spear does.
- **Numbers:** swings every 8.5 ticks (the rune sword's); damage at medium (base 700, 0.2 of Attack, sized by the interval, about 800 at Attack 4); a few Shock a swing from Attack (2.8 at Attack 4).
- **Hooks:** a weapon with its own `cooldown`, `type: magical`, `amount` from `attack`, `apply: [{status: shock, stacks}]`, and a status for `seek: basic`.
- **Pulls toward:** Cuts 3 ●●, Hunt 3 ●● (the storm spear past every front).

### Metronome · Bard · offhand

- **Card:** Fits the Bard. Counts every hit the party lands. At 20, War ballad, Allegro and Thunder chord are ready at once, and the count starts again.
- **Numbers:** 20 hits, extra strikes and each hit of a multi-hit ability included (Thorns and status damage aren't hits). The count gains at most one every 2 ticks (G11), so a beat comes at most every 40 ticks: about that often for a blur party (a hit a tick), about every 60 for a slow one (a hit in three ticks). The songs still cost their MP (450, 650 and 650 as today), and only the ones the Bard knows.
- **Hooks:** a count on the Bard (an Intensity status, cap 20) gaining a stack on `hit_lands` from the holder and from `whose: ally`, at most one every 2 ticks (G11); at the cap, engine 1 makes the three ready by name (**NEW**, as above) and the count is spent. Can't be held under a bow.
- **Pulls toward:** Cuts 3 ●●● (the blur sets the tempo).

---

## CHALLENGES

Each settled by the lead's rulings (`fill-rulings.md`):
1. **Blossom:** settled by G1. A status can be applied for less than its own length, so the spine's line stands: Regen on every ally for 12 ticks.
2. **Triage and Last stand:** settled by "Upgrades, first eight classes". Last stand heals double and the Valkyrie Taunts at half length (G1, 10 ticks).
3. **Stand fast's power step:** settled at 125 MP.
4. **Flight of the valkyries:** settled at 70 ticks.
5. **Martyr's raise:** settled: it costs HP and no MP.
6. **Stone guard:** settled: the other ally with the most Armor.
7. **Horn of the keep:** settled: the other ally with the least MP.
8. **Huntmaster's quiver:** settled: its abilities have Seek.

Settled in the second round:
9. **Opening thrust:** settled by G14: its first swing deals double, as every Phalanx swing does; the version is the timing (a swing on the first tick).
10. **Martyr's raise and Penance:** settled by G12: the HP is lost at once, isn't damage, no Shield soaks it, nothing reacts to it (so the payment doesn't set off Last rites), and it never takes the payer below 1 HP.
11. **Metronome and Rebuke's count:** settled by G11: each gains at most one every 2 ticks, so a Metronome beat comes at most every 40 ticks.
12. **The mythics' stats:** settled by G15: none of the eight carries a stat step (no change; the Stormspear's damage is its weapon's).

## NEW

Engine needs beyond the spine's list:
1. **An `if` on reactions:** a test of a side or of the event's other unit, as an ability's `if` tests a side. For Shared rites, Horn of the keep, Chains of light, and The last wall's once per Aspis.
2. **Basic attacks with a target rule from a passive:** Quarry and Overwatch. Engine 2 aims basic attacks by a status; this aims them by a rule. The pack and The vise (formations) need the same.
3. **Two target `by`s:** the wind-up left (Cover) and the basic attack's interval (Accelerando). Cover also needs a rule whose fallback picks by something else.
4. **A condition "is its side's highest by a stat"** (Sentence).
5. **A reaction's target rule that skips the event's other unit** (Spreading thorns).
6. **An "or" between an ability's conditions,** each with its own target and effect (Ward of life). The cleanup already noted Unmake wanting one.
7. **A status a knocked-out unit holds, filled by overhealing** (Halo of the saint, on engine 8).
8. **An event when a block is spent,** with the blocked amount and the attacker (The last wall).
9. **A mythic that changes its class's abilities by name:** their aim (Huntmaster's quiver), an added effect (Chains of light), made ready (The last wall, Metronome), a Taunt renewed (Horn of the keep). Engine 14's parts, by name.
10. **Engine 4's order:** Martyr's raise reads the Cleric's HP before the HP price is paid.
11. **Run layer, not engine:** passives can be trained (a version swaps the class's passive status), and the power step and the version are two trainings.

## Least sure

Settled by the rulings and taken off: Pinning arrow and Lullaby (the balance pass watches them), The last wall (capped and once per Aspis), the near-repeats (Penance and Chosen changed, and the Earthmother totem gives Might, not Guard).

- **Heartwood mail** against swarms (the spine's own worry), worst beside Spreading thorns: every hit on any ally returns 300 to its attacker and 300 to another foe, both bleeding.
- **Metronome** against the Bard's 2,400 MP: a full beat costs 1,750. With G11 a beat comes at most every 40 ticks, so it empties the Bard more slowly, but it may still read as a mythic that empties its wearer.
- **Shieldbearer** at a third more a swing, rising with Plate, Guard and Stone guard, outclasses Opening thrust everywhere but Ambush, more so now that Opening thrust is only its timing (G14). Opening thrust may want something else on its first swing that isn't a triple or Drawn steel's crit.
- **Inquisition:** in any status party (Smite's own Burn included), the bonus is on nearly all fight.
- **Taunts that last longer** are written as Taunt applied again: Overgrowth's second Taunt, Horn of the keep's renewal. Taunt keeps its own 20 ticks; check that this reads as the line meant.
- **Ward of life** puts a Shield and a revive on one very long cooldown; the shorter wind-up (normal) also makes its raise faster.
