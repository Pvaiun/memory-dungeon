# The fill: formations

Oct 30, 2026. The 32 formations of `spine.md` section 6, written in full and in its order: 11 common, 12 rare, 9 legendary. Neutral stays as it is (three seats that do nothing, no effect). Written from `fill-brief.md`.

Each formation gives its rarity, the **card** (one line, as the player reads it), its three **seats** (the seat's text as the player reads it, then the numbers), its **party effect** if it has one, its **shape** (what the three seats add up to), its **hooks** and its **builds**.

**Updated Oct 30 with the lead's rulings** (`fill-rulings.md`): the global rulings G1 to G10 and the section "The formations". The challenges they settled are listed at the end.

## The words, as numbers

A seat's stat step is 1.25 gear steps (`FORMATION_STEP` in `content/core-set/formations.ts`). Special stats sit at their words and aren't scaled, as Scatter's Decoy does today.

| On a seat | Number | What it does |
| --- | --- | --- |
| Attack, Magic or Armor up (a step) | ±1,250; two steps ±2,500 | |
| HP up (a step) | ±625; two steps ±1,250 | |
| Draws a little more | Aggro +10 | one gear step, under a seat step |
| Draws more / less | Aggro ±13 | one seat step. An ordinary unit's draw 100 → 141, or → 71 |
| Draws far more / far less | Aggro ±25 | two seat steps. A Knight (120) draws 157 → 195; a caster (80) 64 → 51 |
| Regains MP in fights (a step) | MP regen +3,750 | about 26 MP every 4 ticks, 260 over a 40-tick fight; two steps 525 |
| Crits more / far more | Crit chance +3.5% / +7% | `crit(1.25)` and `crit(2.5)` |
| Basic attacks a fifth faster | `attack_speed` +20 | a fifth more swings. Not a gear stat; a seat may carry it |
| Abilities come round a little faster | `cooldown_reduction` +15 | cooldowns ÷ 1.15, about 13% shorter |
| Abilities cost less | the cost stat (engine 3) | −10 is a tenth less |
| Evasion, Thorns, Lifesteal, Crit damage | medium 20; medium 150, high 300; medium 10%; medium +25 | |

**Statuses keep their own numbers:** Taunt 20 ticks, Guard +3,000 Armor for 28, Haste +40 speed for 20, Slow −40 for 24, Weaken −30% for 20, Stun 8, Silence 16, Regen 8% of max HP every 4 ticks for 24, Might 6% a stack (one spent per action, cap 15), a Shield's cap half its holder's max HP. **G1:** a status can be applied for less than its own length, never more; "short" is half its own length, and a shorter length written here stands. **"Taunts all fight"** is Taunt at the start, given again each time it ends, so Taunt is never applied for longer than its own length.

**Marked (G2):** a debuff on a foe, 14 ticks, Refresh. The party's basic attacks pick a Marked foe, by draw among several. Each unit keeps one Mark: a new Mark it applies moves its old one. Abilities follow their own targeting. While a foe Taunts, only basic attacks with Seek follow the Mark past it. **Heat (G3):** +3% damage a stack, up to 15, kept all fight. No formation uses Fervor.

**A seat's statuses already exist:** a `Position` carries `stats` and `statuses`, applied at the fight's start and again on a revive (`src/schema.ts`). Unconditional seats need nothing new. A seat that reads who sits in it is engine 13.

**The rules document will need rewriting.** Its Formations section says a slot never gives a status, a formation has at most one flat effect, an effect never gives Taunt or a Specialist status, and slot order only breaks ties. `builds.md`'s "Formations: what they can be" (approved) lifts all four. Seat order matters in Relay, The choir and The pack.

---

## Common

### Shieldwall · common
**Card:** "One stands in front with its shield up; two stand behind it."
- **Wall** · "Draws far more. Armor up two steps." Aggro +25, Armor +2,500.
- **Behind** ×2 · "Draws less." Aggro −13.

**Party effect:** none.
**Shape:** all the danger on one unit, and nothing taken from it. The plainest front line.
**Hooks:** seat `stats` only. Nothing new.
**Builds:** Toll 1 ●● (an anchor that draws), Landslide 1 ●● (the Wall's Armor feeds a Geomancer's Earthen shell, Rockfall and Tremor, and the Hoplite's Shieldbearer), Bonfire 1 ●● (the keeper holds the early fight), Harvest ● (a unit that draws the whole field), Phoenix ● (it chooses who falls first).

### Heavy line · common
**Card:** "One strikes, one holds, one is free."
- **Hammer** · "Attack up. Its crits hit harder. Draws less." Attack +1,250, Crit damage medium (+25), Aggro −13.
- **Holder** · "Draws more. HP up two steps." Aggro +13, HP +1,250.
- **Free** · "Nothing."

**Party effect:** none.
**Shape:** lopsided: the power on one striker, the danger on another, and a seat for whoever needs neither.
**Hooks:** seat `stats` (Crit damage is `crit_multiplier`). Nothing new.
**Builds:** Landslide 1 ●●● (the big blow, and the crit on it), Snap ●● (the breaker after a shatter), Ambush ● (the opener).

### Skirmish line · common
**Card:** "Three light fighters who'd rather not be hit at all."
- **Skirmisher** ×3 · "Dodges. Armor down." Evasion medium (+20), Armor −1,250.

**Party effect:** none.
**Shape:** even. The whole party trades armor for dodges: physical blows miss, and magic lands as before.
**Hooks:** seat `stats`. Nothing new. Each dodge fires `hit_evaded`, which the dodge pieces read (Duelist's leathers, Windrunner's garb).
**Builds:** Cuts 1 ●● (light bodies, and every dodge a trigger), Toll ● (the dancer anchor).

### Spur · common
**Card:** "One sets the pace; two strike fast and light."
- **Pacer** · "When each fight starts, the other two are Hasted." Haste on the other two seats' units at the fight's start. Nothing for the Pacer itself.
- **Blade** ×2 · "Basic attacks a fifth faster. HP down." `attack_speed` +20, HP −625.

**Party effect:** none beyond the Pacer's Haste.
**Shape:** a giver and two takers. A Hasted Blade swings 60% faster than plain for the fight's first 20 ticks.
**Hooks:** Pacer: a seat status reacting to `fight_start` with `apply` haste to `{ side: others, pick: all }`. Blades: `attack_speed`. Nothing new.
**Builds:** Cuts 1 ●●● (the pacer seat), Bonfire ●● (two stokers), Ambush ● (a quicker opening).

### Wellspring · common
**Card:** "One regains mana all through the fight; two spend less of theirs."
- **Source** · "Regains MP in fights. Magic down." MP regen +7,500 (two seat steps: about 52 MP every 4 ticks, 525 over a 40-tick fight, 1,050 over 80), Magic −1,250.
- **Spender** ×2 · "Abilities cost a tenth less MP." Cost −10.

**Party effect:** none.
**Shape:** since step 5h no class regains MP by itself, so the Source is the one seat with a spring of its own, and pays for it in Magic. The Spenders stretch their pools.
**Hooks:** Source: `mp_regen`. Spenders: the cost stat (engine 3).
**Builds:** Overflow 1 ●●●, Lockdown ●● (cheaper locks), Bonfire ● (the feeding casts).

### Long march · common
**Card:** "Pace yourselves: everyone mends in each fight's first ticks, and hits a little softer."
- **Marcher** ×3 · nothing.

**Party effect:** when each fight starts, every ally gains a short Regen: 8 ticks, two pulses of 8%, 16% of its max HP (G1: shorter than half its own 24, as written). Every ally deals 10% less damage, all fight.
**Shape:** even and steady: a little health back every fight, paid for in every fight's damage.
**Hooks:** a formation status reacting to `fight_start` with `apply` regen (duration 8), and a −10 boost on all the holder's hits.
**Builds:** Pact 1 ●● (refilling what the pact costs), Toll ● (the anchor topped up), Phoenix ● (a unit back at low HP survives the next fight).

### First light · common
**Card:** "Up before dawn: everyone's abilities start each fight closer to ready, in lighter kit."
- **Riser** ×3 · nothing.

**Party effect:** when each fight starts, each of every ally's abilities comes 5 ticks closer, on top of the cooldown it carried from the last fight. Every ally's Armor is 1,250 lower.
**Shape:** even. The whole party's opening comes sooner, and every body is easier to hurt.
**Hooks:** a formation status reacting to `fight_start` with a cooldown change of −5 ticks on each of the holder's abilities (engine 1); the formation's `stats`: Armor −1,250.
**Builds:** Ambush 1 ●●● (the volley sooner, on cooldowns carried from the last fight), Lockdown ● (the first lock before the first big cast).

### Arrowhead · common
**Card:** "A sharp point and two keen flanks. The point catches the eye."
- **Point** · "Crits far more. Draws more." Crit chance +7%, Aggro +13.
- **Flank** ×2 · "Crits more." Crit chance +3.5%.

**Party effect:** none.
**Shape:** crits everywhere, with the sharpest seat in front.
**Hooks:** seat `stats`. Nothing new. A Geomancer on the Point doubles the seat's crit too while its Shield holds (Bedrock doubles its whole crit chance).
**Builds:** Ambush 1 ●●, Hunt 1 ●● (crits finish the back row; Backstab scales from Crit chance), Landslide ● (the Geomancer behind stone).

### Ring of steel · common
**Card:** "One draws the field onto its spikes; two cut it down."
- **Beacon** · "Draws far more. Thorns." Aggro +25, Thorns medium (150).
- **Reaper** ×2 · "Attack and Magic up." Attack +1,250, Magic +1,250.

**Party effect:** none.
**Shape:** one unit holds the field and returns a little of every blow; two hit harder because nothing is hitting them.
**Hooks:** seat `stats`. Nothing new.
**Builds:** Harvest 1 ●● (the Beacon holds the full field while the reapers spread), Toll 1 ●● (an anchor's thorns).

### Vigil · common
**Card:** "One stands where the blows fall. While anyone lies fallen, the two who keep watch hit harder."
- **Martyr** · "Draws more. HP down." Aggro +13, HP −625.
- **Mourner** ×2 · "While an ally is down, Attack and Magic up two steps." Attack +2,500 and Magic +2,500 while any ally is knocked out, one who fell in an earlier fight included; back to normal when none is.

**Party effect:** none.
**Shape:** a fall turned into a turn, and a choice handed to the reviver: raise the fallen, and the Mourners lose their edge.
**Hooks:** the Mourners' status holds its stats while the party has a knocked-out ally. Reactions to `ko` and `revived` (whose: ally) can keep the count inside a fight, but a fight that starts with an ally already down needs a party condition. **NEW** (NEW 2).
**Builds:** Phoenix 1 ●●● (a fall as power), Toll ● (the anchor's fall).

### Watchtower · common
**Card:** "One keeps watch from the tower; two stand guard below it."
- **Lookout** · "Abilities come round a little faster." `cooldown_reduction` +15.
- **Sentry** ×2 · "Armor up. Draws a little more." Armor +1,250, Aggro +10.

**Party effect:** none.
**Shape:** two guards keep the eyes off the one whose moves come round.
**Hooks:** seat `stats`. Nothing new.
**Builds:** Lockdown 1 ●● (a lock on the Lookout comes round more often), Overflow ● (more casts).

---

## Rare

### Hammer and anvil · rare
**Card:** "One takes the blows, one strikes like a falling hill, one builds stone around the striker."
- **Anvil** · "Draws more. Guarded when each fight starts." Aggro +13; Guard at the fight's start, at its own numbers.
- **Hammer** · reads its weapon. "With a slow weapon: basic attacks come half as often and deal triple. Otherwise: Attack up." With a great weapon, mace or staff: `attack_speed` −50 (its swing interval doubled) and +200% on its basic attacks' hits. With any other weapon: Attack +1,250. Under G5 the seat's reshape is one swing shape among the others, and a unit takes one: its passive's first, then its pieces' in slot order, then the seat's. A unit that already has a shape (Phalanx, the Millstone, the Hummingbird charm, the Worldbreaker) gets its weapon's stat +1 (Attack or Magic +1,250) from this seat instead.
- **Mason** · "Its Shields and Guards on an ally go to the Hammer first." When one of the Mason's abilities or pieces gives a Shield or a Guard to an ally other than itself, its first pick is the Hammer, if the Hammer can take it (a Shield at its cap passes to the usual target). Examples: a Geomancer's Earthen shell covers itself and the Hammer, a Knight's Fortify Guards the Hammer, a Hoplite's Paired guard covers itself and the Hammer.

**Party effect:** none.
**Shape:** the most lopsided rare: one huge swing, one wall, and one builder whose stone goes to the swing.
**Hooks:** Anvil: a seat status reacting to `fight_start`. Hammer: engine 13 (reads its weapon kind's speed), then `attack_speed` and a `basic` boost, which exist, and one swing shape per unit (G5). Mason: engine 13 (reads abilities that give a Shield or Guard) and engine 14, which changes an ability's target here (**NEW** 7), with the Hammer named by its seat (**NEW** 1).
**Builds:** Landslide 2 ●●● (the hammer seat, with stone on it for the Cornerstone maul and Bedrock), Snap ●● (the smash after a shatter), Lockdown ● (one big swing in a window).

### Hunting party · rare
**Card:** "One picks the quarry, one runs it down past any guard, one holds the line."
- **Marker** · "Its basic attacks Mark their target." Marked (G2): 14 ticks, and the party's basic attacks go to a Marked foe while it lives. Each swing moves the Marker's one Mark to the foe it hits.
- **Chaser** · "Everything it does has Seek." Seek on its basic attacks and its abilities.
- **Warden** · "Taunts when each fight starts." Taunt, its own 20 ticks.

**Party effect:** none.
**Shape:** a hunt in three parts: the picker, the reach, and the wall that buys the hunt its time. The Marker's first swing follows the usual pick (a random foe by draw, under the Taunt rule), so behind a Taunting front its first Mark lands on the front, unless the Marker already ignores Taunt (the Ranger's Hunter's eye). While a foe Taunts, only basic attacks with Seek follow the Mark past it (G2): the Chaser's always do.
**Hooks:** Marker: a rider on `basic` hits applying Marked (engine 2). Chaser: a status with `seek: all`. Warden: a seat status reacting to `fight_start`; Taunt ends Hidden (engine 17), so an Assassin in this seat loses its Vanish.
**Builds:** Hunt 2 ●●● (the marker and the chaser), Lockdown ● (the Chaser reaches a caster).

### Hearth · rare
**Card:** "One holds the door, one feeds the fire, one carries it to every burning foe."
- **Keeper** · "Taunts and is Guarded when each fight starts." Taunt and Guard, at their own numbers.
- **Stoker** · "Hasted when each fight starts. Basic attacks a fifth faster." Haste; `attack_speed` +20.
- **Torch** · "Each of its hits adds a Burn to every foe that's already burning." One Burn on each burning foe, for every hit it lands (basic attacks, abilities and extra strikes; not Thorns or statuses).

**Party effect:** none.
**Shape:** the danger on the Keeper while the fire catches, the speed on the Stoker, the spread on the Torch. An Area hit on five foes is five hits: a Torch's Fireball on five burning foes adds five Burn to each.
**Hooks:** Keeper and Stoker: seat statuses reacting to `fight_start`. Torch: a reaction to `hit_lands` (whose: holder) applying one burn to `{ side: foes, where: { has: burn }, pick: all }`. Nothing new.
**Builds:** Bonfire 2 ●●● (keeper, stoker and torch), Harvest ● (fire on the whole field).

### Hoarfrost line · rare
**Card:** "Two lay frost with every blow; the third waits to break what freezes."
- **Frost** ×2 · "Basic attacks add a Chill." One Chill for each basic attack that lands.
- **Breaker** · "When any foe's Chill shatters, its next hit deals double." +100% on its next hit (the first hit of its next action), kept until it lands. A second shatter before then adds nothing.

**Party effect:** none.
**Shape:** two feeders and a hammer on a fuse.
**Hooks:** Frost: a rider on `basic` applying one chill. Breaker: a reaction to `status_capped` (whose: foe, status chill) applies a hidden buff (Refresh) with a +100 boost, which removes itself on the holder's next `hit_lands`. Nothing new.
**Builds:** Snap 2 ●●● (Chill on two units' basic attacks, and a payoff after each shatter), Lockdown ● (the shatter's Stun as a window).

### Reaping line · rare
**Card:** "One holds the whole field on itself; two reap through it."
- **Beacon** · "Taunts all fight. Thorns. Heals on it are halved." Taunt, given again each time it ends; Thorns medium (150); healing received −50.
- **Scythe** ×2 · "Its basic attacks hit every foe, for a fifth each." Each basic attack is an Area hit on every foe at a fifth of its usual damage, so Taunt and Hidden don't steer it. Each of those hits is a basic-attack hit and carries what its basic attacks carry. That totals 160% of a swing against eight foes, 100% against five, and 40% against two.

**Party effect:** none.
**Shape:** a beacon and two scythes. The field stays on one unit, which pays for it in healing, while the scythes sink every foe evenly: worth most against a crowd, less against a few.
**Hooks:** Beacon: a seat status reacting to `fight_start` and to `status_ended` (taunt) by applying Taunt; `thorns` and `healing_received`. Scythe: its basic attacks aimed by a rule, `{ side: foes, pick: all }` (**NEW** 9), with a −80 `basic` boost.
**Builds:** Harvest 2 ●●● (the beacon and two scythes), Toll ●● (an anchor that Taunts all fight with thorns).

### Relay · rare
**Card:** "Each cast passes something down the line: mana to the second seat, and a quicker next ability to the third."
- **Well** (first seat) · "Each ability it casts gives the second seat a third of its cost in MP."
- **Spender** (second seat) · "When the Well casts, this seat's next ability comes 4 ticks closer."
- **Spender** (third seat) · "When the second seat casts, this seat's next ability comes 4 ticks closer."

"Its next ability" is the one with the least cooldown left.
**Party effect:** none.
**Shape:** a line, not a ring: the first seat only gives, the last only takes. A Bard Well's War ballad (450) hands the second seat 150 MP and 4 ticks.
**Hooks:** Well: a reaction to `action_resolve` (kind: ability) giving `mp` to the second seat (**NEW** 1), a third of the cost just paid (**NEW** 5). Spenders: a reaction to the seat before's `action_resolve` (**NEW** 1), then a cooldown change of −4 ticks (engine 1).
**Builds:** Overflow 2 ●●● (casts that give the next caster something).

### Gaol · rare
**Card:** "One waits for the moment to lock, one keeps the foes' eyes, one comes round faster every time a foe is held."
- **Watcher** · "Its abilities that Stun or Silence wait for a foe's wind-up, and aim at it." They wait until a foe is winding up, then pick the casting foe with the highest Attack or Magic (under the Taunt rule, unless the ability has Seek). Unmake already waits, so it's unchanged.
- **Gaoler** · "Draws far more." Aggro +25.
- **Warden** · "Whenever any foe is Stunned or Silenced, its abilities come 3 ticks closer." Every lock counts, a shatter's Stun included, and so do the Warden's own.

**Party effect:** none.
**Shape:** three clocks: one that waits, one that holds the eyes, one that speeds up with every lock.
**Hooks:** Watcher: engine 13 (reads abilities that Stun or Silence) and engine 14, which changes an ability's wait (`casting`) and its target (**NEW** 7). Warden: reactions to `status_gained` (whose: foe, stun, and again for silence), then a cooldown change of −3 ticks on each of its abilities (engine 1). Stun and Silence fizzle on a foe that already holds them, so the loop is bounded.
**Builds:** Lockdown 2 ●●● (locks that wait, and locks that come round), Overflow ● (more casts on the Warden). On a Knight with Measured blow or an Assassin with Choke, the Watcher's wait adds nothing: those versions already wait.

### Thorn hedge · rare
**Card:** "A thorned wall that draws the blows, and two who make every attacker pay."
- **Anchor** · "Draws far more. Thorns." Aggro +25, Thorns medium (150).
- **Thorns** ×2 · "A foe that hits the Anchor is Weakened, briefly." When a foe's hit lands on the Anchor, the unit in this seat Weakens that foe for 6 ticks (G1: shorter than half Weaken's own 20, as written).

**Party effect:** none.
**Shape:** a hedge: one unit to strike, and two that make striking it hurt. If both Thorns seats fall, the Weaken stops.
**Hooks:** Anchor: seat `stats`. Thorns: a seat status reacting to `hit_taken` on the Anchor (whose: ally, narrowed to the Anchor's seat, **NEW** 1), applying Weaken to the attacker (`other`).
**Builds:** Toll 2 ●●● (an anchor that draws and returns, with Weaken on its attackers), Landslide ● (a plated wall).

### Blood oath · rare
**Card:** "One bleeds for power, one drinks it back, one pours life into the bleeder."
- **Bleeder** · "Loses a little HP every tick. Its hits deal half again as much." It loses 0.5% of its max HP a tick (20% over a 40-tick fight, 40% over 80), paid the way Blood gift's price is (a Shield soaks it). The loss stops at a tenth of its max HP, so the oath never knocks it out. Its hits deal +50%.
- **Drinker** · "Lifesteal." Lifesteal medium (10%).
- **Donor** · "Its heals on the Bleeder are doubled." Direct heals the Donor casts on the Bleeder are doubled. A Regen it applies is an ordinary Regen, since statuses keep their numbers.

**Party effect:** none.
**Shape:** life moving through three hands: one spends it, one takes it from foes, one gives it.
**Hooks:** Bleeder: a seat status pulsing every tick, untyped damage `to: { side: self, where: { hpAtLeast: 10 } }`; a +50 boost on all its hits. Drinker: `lifesteal`. Donor: a `healing` boost of +100, scaled by `when` the healed unit holds the Bleeder's hidden seat status (`of: target`, as Judgement reads its target). Nothing new.
**Builds:** Pact 2 ●●● (the bleeder, the drinker and the donor).

### Pyre of heroes · rare
**Card:** "One is meant to fall, one to bring it back, one to stand through it."
- **Martyr** · "Draws far more. When it falls, every ally gains several Might and Haste." Aggro +25; when it falls, each other ally gains 4 Might and Haste.
- **Reviver** · "Draws far less. Can't be Silenced." Aggro −25; immune to Silence.
- **Survivor** · "Guarded whenever an ally falls." Guard, at its own numbers, on each fall.

**Party effect:** none.
**Shape:** a death planned for: who falls, who raises, who holds.
**Hooks:** Martyr: a seat status that survives a KO, reacting to its own `ko` by applying 4 Might and Haste to `{ side: others, pick: all }`. Reviver: `immune:status:silence`. Survivor: a reaction to `ko` (whose: ally) applying Guard to the holder. Nothing new.
**Builds:** Phoenix 2 ●●● (martyr, reviver and survivor).

### Knives drawn · rare
**Card:** "The first blow lands twice as hard, the second comes quickly, and the third holds what's left."
- **Opener** · "Its first action each fight deals double." Every hit of its first action +100%.
- **Second** · "Hasted when each fight starts." Haste.
- **Rear guard** · "Starts each fight behind a Shield. After the first few ticks, draws more." A Shield of 15% of its max HP at the start (between Escort's 12% and Vanguard's 20%); Aggro +13 from tick 6.

**Party effect:** none.
**Shape:** a volley with a tail: the Opener and the Second spend themselves early, and the Rear guard takes the counter-rush.
**Hooks:** Opener: a buff given at `fight_start`, a +100 boost that removes itself on the holder's first `action_resolve`. Second: `fight_start`, Haste. Rear guard: `fight_start`, a Shield scaled 0.15 from max HP, and a hidden 6-tick status whose `status_ended` (expired) applies an Aggro +13 status for the rest of the fight. Nothing new.
**Builds:** Ambush 2 ●●● (the opener, the hastened second, the rear guard), Hunt ● (the first kill sooner).

### The wheel ✦ · rare
**Card:** "Every so often the wheel turns, and each unit takes the next seat's part."
- **Wall** · "Draws more. Armor up." Aggro +13, Armor +1,250.
- **Blade** · "Basic attacks a fifth faster. Crits more." `attack_speed` +20, Crit chance +3.5%.
- **Well** · "Regains MP in fights. Heals on it are stronger." MP regen +3,750, healing received +20.

**Party effect:** every 22 ticks (a short cooldown), the wheel turns: the Wall's unit takes the Blade's part, the Blade's takes the Well's, and the Well's takes the Wall's. It turns once in a 40-tick fight and three times in an 80-tick one.
**Shape:** a party that changes shape on a clock. No seat is the right one for long, so it suits three all-rounders.
**Hooks:** each part is a 22-tick status, given by its seat at the fight's start; when it expires (`status_ended`, cause expired), the holder gains the next part. Nothing new. The interface shows the part a unit holds now on the seat and the unit.
**Builds:** exotic: no build.

---

## Legendary

### The pack · legendary
**Card:** "Everyone's basic attacks follow the Lead's last target. When it falls, the Lead's abilities come closer."
- **Lead** (first seat) · "Its hits Mark their target and take the Mark off every other foe. When a Marked foe falls, its abilities come 5 ticks closer." Only hits from its basic attacks and single-target abilities move the Mark: Area hits and extra targets don't.
- **Packmate** ×2 · nothing of their own.

**Party effect:** through Marked, the party's basic attacks go to the Lead's quarry while it lives. The Lead's own basic attacks follow it too, so the quarry changes when one of the Lead's abilities picks another foe (Backstab the lowest, Pressure point the strongest) or when it falls.
**Gives up:** anything that spreads. Riders pile onto one foe, damage past its HP is lost, and the field never sinks together.
**Shape:** one picker, and a pack that follows it on a staircase of kills.
**Hooks:** Lead: a seat status reacting to `hit_lands` (whose: holder; single-target hits only), which removes Marked from `{ side: foes, pick: all }` and then applies it to `other` (engine 2). On a foe's `ko`: engine 5 reads whether the fallen foe was Marked, then a cooldown change of −5 ticks on each of the Lead's abilities (engine 1).
**Builds:** Hunt 3 ●●● (the whole party on one foe, and a kill that resets the hunt), Lockdown ● (a disabled foe as the Lead's pick).

### The forge · legendary
**Card:** "The longer the fight, the hotter everyone burns; but the forge is slow to light."
- **Forgehand** ×3 · nothing.

**Party effect:** every 4 ticks, every ally gains a Heat. When each fight starts, every ally is Slowed for 8 ticks.
**Heat, as I read section 1** (one meaning across every share, for the lead to fix once): each stack gives 3% more damage on the holder's hits, to a cap of 15. It's never spent and ends with the fight. Here that's +30% by tick 40 and the cap (+45%) at tick 60, so a 40-tick and an 80-tick fight end about half apart. Like any boost, it doesn't raise Burn's damage.
**Gives up:** the start: 8 ticks at −40% speed, while the foes are fresh.
**Hooks:** a formation status pulsing every 4 ticks that applies one Heat (a new counter, section 1), and a reaction to `fight_start` applying Slow for 8 ticks.
**CHALLENGE:** "Slowed for a moment" changes Slow's length. See CHALLENGES 2.
**Builds:** Bonfire 3 ●●● (the party's own heat), Landslide ●● (power that isn't spent, so the slowest hitter keeps all of it), Pact ● (long fights).

### The ambuscade · legendary
**Card:** "Everyone's first action comes at once and lands twice as hard. After that, everyone hits a sixth softer."
- **Lurker** ×3 · nothing.

**Party effect:** when each fight starts, every ally's basic attack is ready, and its first action deals double: either an ability it carried in charged, or that basic attack. From tick 6, every ally deals a sixth less (×5/6) for the rest of the fight. A first action that lands after tick 6 still deals double, uncut.
**Gives up:** the tail.
**Shape:** everyone opens at once. What's still standing after the volley meets a weaker party.
**Hooks:** at `fight_start`, the basic attack's timer is made ready (engine 1), and a +100 buff removes itself on the holder's first `action_resolve`. A hidden 6-tick status, on expiring, applies a −17% boost status.
**Builds:** Ambush 3 ●●● (an opening that clears a room), Cuts ● (fast hitters' first swings).

### The choir · legendary
**Card:** "Each ability a voice casts makes the next voice's next ability free. Nobody regains MP from MP regen."
- **First voice**, **Second voice**, **Third voice** (a ring: the first follows the third) · "When the voice before casts an ability, this voice's next ability is free."

**Party effect:** every ally's MP regen is 0. Every other source of MP still works: Clarity, Refrain, Siphon, tonics, the bench.
A free cast waits on its voice until that voice casts. A second cue before then adds nothing. A free cast cues the next voice like any other cast.
**Gives up:** regen.
**Shape:** a round: the casting passes from voice to voice. A voice that casts twice in a row pays for the second.
**Hooks:** a reaction to `action_resolve` (kind: ability) applies a hidden Cue (Refresh) to the next seat's unit (**NEW** 1). The Cue sets the cost of the holder's next ability to 0 and ends when it resolves (engine 3, through engine 14). The formation's `stats`: MP regen −100%.
**Builds:** Overflow 3 ●●● (casts that pay for the next), Lockdown ●● (free locks).

### The undying · legendary
**Card:** "One gives itself so the others live: when it falls they're made whole, and it stands again before the next fight."
- **Martyr** · "Draws far more. Can't be healed by others. When it falls, the others heal to full; it stands again after the fight with half its HP." Aggro +25. Heals from other units, a Regen they gave included, don't land on it; its own heals and Lifesteal do. When it falls, every other ally heals to full. If it's down when a fight is won, it stands with half its max HP for the next.
- **Spared** ×2 · nothing of their own.

**Party effect:** none beyond the Martyr's fall.
**Shape:** a party built round one sacrifice that keeps being made.
**Hooks:** Martyr: heals from others don't land (**NEW** 3). A seat status that survives a KO, reacting to its own `ko` with `heal` to `{ side: others, pick: all }` for their missing HP. The return is engine 12 (after a won fight): it covers the unit that fell in this seat, so a fallen unit moved into the seat between fights doesn't stand.
**Builds:** Phoenix 3 ●●● (a fall that doesn't stay, and a return between fights), Pact ●● (life passed on).

### The hurricane · legendary
**Card:** "Every hit the party lands winds the storm. At 30, everyone is Hasted, and it winds again."
- **Squall** ×3 · nothing.

**Party effect:** a shared count of the party's hits: basic attacks, abilities' hits and extra strikes, but not Thorns or statuses. At 30, every ally gains Haste and the count starts again; a Haste still running is refreshed.
**Shape:** the faster the party, the faster it gets. A fast party (about one hit a tick) is first Hasted around tick 30 and keeps it, since Hasted it lands 28 hits in 20 ticks. A slow party (0.4 hits a tick) is Hasted about once a boss fight.
**Hooks:** each ally holds an Intensity copy (cap 30) that gains a stack on every party `hit_lands` (whose: holder, and whose: ally). At the cap, Haste, then drop all. The copies stay in step except when an ally is revived and its copy starts afresh. A single count, shown once for the party, is **NEW** 6.
**Builds:** Cuts 3 ●●● (the count of hits as power), Snap ●● (riders come faster).

### The mountain · legendary
**Card:** "One stands like a mountain. While it stands, the two below strike a third harder; while it's down, they take double."
- **Peak** · "Taunts all fight. Armor and HP up two steps." Taunt, given again each time it ends; Armor +2,500, HP +1,250.
- **Foothill** ×2 · "While the Peak stands, deals a third more. While it's down, takes double." +33% on all their hits; +100% damage taken.

**Party effect:** none beyond the seats.
I read "once it falls" as "while it's down". If the Peak is raised, the Foothills deal a third more again and stop taking double. If it starts a fight already down, they start that fight taking double.
**Shape:** everything rests on one unit, and the formation says so.
**Hooks:** Peak: Taunt given again on `status_ended`. Foothills: a Per-source aura from the Peak (`endsWithSource`) carrying the boost. The Peak's status survives its KO; on its own `ko` it applies a +100 damage-taken status to the others, and on `revived` it removes that and gives the aura again. A fight that starts with the Peak down needs the party condition (**NEW** 2).
**Builds:** Landslide 3 ●●● (a Geomancer or Knight as the Peak, with its Armor in its stone and its blows), Toll 3 ●● (an anchor that Taunts all fight).

### The storm front · legendary
**Card:** "Every single-target hit the party lands also strikes the healthiest other foe, for a quarter."
- **Thunderhead** ×3 · nothing.

**Party effect:** each hit from a basic attack or a single-target ability also hits the foe with the most current HP other than the first target (with one foe, nothing). The second hit is a quarter of the first, before mitigation, and meets that foe's own Armor or Magic resist. It's a hit (an extra strike, so it never chains) and carries nothing of the first hit's riders or statuses.
**Shape:** every blow chips the biggest foe, so the field sinks together.
**Hooks:** engine 9 (a reaction that strikes), sized from the triggering hit (**NEW** 4), aimed at `{ side: foes, pick: highest, by: hp, exclude }`.
**Builds:** Harvest 3 ●●● (the field falls together), Cuts ● (many small hits, each with an echo).

### The vise · legendary
**Card:** "When a foe is Stunned or Silenced, everyone's basic attacks turn on it and hit 40% harder."
- **Jaw**, **Screw**, **Jaw** · nothing.

**Party effect:** while any foe is Stunned or Silenced, every ally's basic attacks pick it, under the Taunt rule (at random among several, and ahead of a Marked foe). Every ally's basic hits on a Stunned or Silenced foe deal 40% more.
**Shape:** nothing special until a lock lands, and then everyone at once.
**Hooks:** engine 2's basic-attack aim, read from Stun or Silence through engine 15 ("has any of"); a `basic` boost of +40 with `when` the target has any of Stun or Silence (engine 15).
**Builds:** Lockdown 3 ●●● (every window becomes everyone's), Snap ●● (every shatter a target).

---

## CHALLENGES

1. **Long march's "short Regen"** changes Regen's length, which the brief rules out. Written as 8 ticks (16% of max HP). I'd change it to the formation's own mend, not Regen: every ally heals 8% of its max HP at ticks 4 and 8. That's the same 16%, with no status carrying it. A full Regen (48%) on everyone each fight is what made Caravan +20 in 5e.
2. **The forge's "Slowed for a moment"**: the same rule. Written as Slow for 8 ticks. I'd change it to the formation's own slowness (everything 40% slower for the first 8 ticks), not the Slow status. Slow at its own 24 ticks costs most of a regular fight.
3. **Thorn hedge's "Weakened briefly"**: the same rule. Written as 6 ticks. At Weaken's own 20 ticks, given again on every hit, every attacker of the Anchor would be Weakened nearly all fight: −30% on most of the damage the party takes, strong for a rare. I'd change it to Weaken at its own length, on a quarter of the hits that land on the Anchor.
4. **Thorn hedge's Thorns high:** high is for legendaries and mythics only. Section 9 also describes this formation as "Thorns from Armor in Plate", which section 6 doesn't say. I'd change it to Thorns medium and drop section 9's note. The door from Landslide into the Toll keeps the Spiked bulwark and Bastion plate, two pieces, as the door rule asks.
5. **Hoarfrost line's triple:** past the brief's ceiling (double only on a condition a fight meets a few times). In Snap's second rung, shatters come faster than a slow swing, so nearly every Breaker swing would triple. I'd change it to double.
6. **Hammer and anvil's Hammer:** "half as often for triple" multiplies with Phalanx, the Millstone and the Worldbreaker. A Hoplite with a great weapon in the seat would swing once every 51 ticks for six times a swing: once a regular fight, which is what Phalanx was cut back from on Oct 28. I'd add that a unit whose basic attacks are already slowed by another effect gets Attack up instead.
7. **The Reaping line's Scythes and The storm front** are a small and a big version of one thing (a quarter of a single-target hit on a second foe), in one kind. I'd change the Scythes to: "basic attacks hit every foe, for a fifth each". That's an even sweep that pays with five or more foes and costs with fewer. The storm front stays the echo on the healthiest foe for everyone.
8. **Names.** The "Rod" seats (Ring of steel, Reaping line) read as seats for a rod wielder, now that the rod is a weapon kind; I'd call them "Lightning rod". "Anvil" (common) and "Hammer and anvil" (rare) share seat names and a shape, so they read as a small and a big version even though their seats differ (crits and HP, against a slower swing and stone); I'd rename the common.

## NEW

1. **Seats as targets and event sources:** "the unit in a named seat" and "the next seat" (the Mason, Relay, The choir, Thorn hedge's Thorns). Engine 13 reads who sits in a seat; this is the other half.
2. **A party condition:** "an ally is knocked out", read live and at a fight's start (Vigil's Mourners; The mountain when the Peak starts down).
3. **Heals from other units don't land** (The undying's Martyr).
4. **A strike sized from the hit that set it off,** a share of its damage before mitigation (the Scythes, The storm front): a small extension of engine 9.
5. **Reading the MP cost just paid** (Relay's Well; the Brimming rod needs it too): small, beside engine 3.
6. **One party count, shown once** and kept in step after a revive (The hurricane): small, mostly interface.
7. **Engine 14 extended** from costs, stacks and cooldowns to an ability's wait and target (Gaol's Watcher, Hammer and anvil's Mason).

## Least sure

1. **The pack.** Focus fire helps most parties, so "gives up anything that spreads" may not cost enough. If it doesn't, basic attacks could also lose their extra targets. It also rests on Marked's length: the Mark must outlast the Lead's swing (up to 12.8 ticks), or it lapses between hits.
2. **The storm front** adds about a quarter to any party's single-target damage whenever two or more foes stand, and has no cost written. If it's strong everywhere, I'd make the first hit deal a tenth less.
3. **The choir.** Since 5h no class regains MP by itself, so "gives up regen" costs only regen gear and seats, and in a three-caster party most casts are free.
4. **Heat's numbers** (3% a stack, cap 15) are my reading. Kindled robes, the Wick and Ember palms use Heat too; the lead fixes it once.
5. **The undying.** Each revive lets the Martyr fall again and heal the others to full again, bounded only by the revives' very long cooldowns.
6. **Skirmish line.** Against many small blows, the Armor it takes away costs about what the dodges save (Scatter's lesson, 5a); it pays against big blows and with the dodge pieces.
7. **Relay's name** echoes the director's "relay is too complicated".
