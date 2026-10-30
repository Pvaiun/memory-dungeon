# The fill: formations

Oct 30, 2026. The 32 formations of `spine.md` section 6, written in full and in its order: 11 common, 12 rare, 9 legendary. Neutral stays as it is (three seats that do nothing, no effect). Written from `fill-brief.md`.

Each formation gives its rarity, the **card** (one line, as the player reads it), its three **seats** (the seat's text as the player reads it, then the numbers), its **party effect** if it has one, its **shape** (what the three seats add up to), its **hooks** and its **builds**.

**Updated Oct 30 with the lead's rulings** (`fill-rulings.md`), in three rounds. The third round is the director's, and it wins where the rounds differ: statuses are universal, and there are no balancing rules (synergies may be overpowered; the balance pass comes after the build). The challenges each round settled, and those it undid, are listed at the end.

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

**Statuses keep their own numbers:** Taunt 20 ticks, Guard +3,000 Armor for 28, Haste +40 speed for 20, Slow −40 for 24, Weaken −30% for 20, Stun 8, Silence 16, Regen 8% of max HP every 4 ticks for 24, Might 6% a stack (one spent per action, cap 15), a Shield's cap half its holder's max HP. **Statuses are universal** (the director, third round): a formation applies a status at its own length, never shorter or longer. **"Taunts all fight"** is Taunt at the start, given again each time it ends, so Taunt keeps its own length.

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
- **Bruiser** · "Attack up. Its crits hit harder. Draws less." Attack +1,250, Crit damage medium (+25), Aggro −13. It isn't a swing shape.
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
**Card:** "Pace yourselves: everyone starts each fight with Regen, and hits a little softer."
- **Marcher** ×3 · nothing.

**Party effect:** when each fight starts, every ally gains Regen at its own length: 24 ticks, six pulses of 8%, 48% of its max HP. The spine's "short" goes, since statuses are universal. Every ally deals 10% less damage, all fight.
**Shape:** even and steady: health back every fight, paid for in every fight's damage.
**Hooks:** a formation status reacting to `fight_start` with `apply` regen (its own length), and a −10 boost on all the holder's hits.
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
- **Hammer** · reads its weapon. "With a slow weapon: basic attacks come half as often and deal triple. Otherwise: Attack up." With a great weapon, mace or staff: attack speed −100 (half as often, as the engine reads it) and +200% on its basic attacks' hits. With any other weapon: Attack +1,250. It multiplies with every other reshape the unit holds (Phalanx, the Millstone, the Hummingbird charm, the Worldbreaker). A Hoplite with a great weapon here swings once every 51 ticks for six times a swing.
- **Mason** · "Its Shields and Guards on an ally go to the Hammer first." When one of the Mason's abilities or pieces gives a Shield or a Guard to an ally other than itself, its first pick is the Hammer, if the Hammer can take it (a Shield at its cap passes to the usual target). Examples: a Geomancer's Earthen shell covers itself and the Hammer, a Knight's Fortify Guards the Hammer, a Hoplite's Paired guard covers itself and the Hammer.

**Party effect:** none.
**Shape:** the most lopsided rare: one huge swing, one wall, and one builder whose stone goes to the swing.
**Hooks:** Anvil: a seat status reacting to `fight_start`. Hammer: engine 13 (reads its weapon kind's speed), then `attack_speed` and a `basic` boost, which exist. Mason: engine 13 (reads abilities that give a Shield or Guard) and engine 14, which changes an ability's target here (**NEW** 7), with the Hammer named by its seat (**NEW** 1).
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
- **Breaker** · "When any foe's Chill shatters, its next hit deals triple." +200% on its next hit (the first hit of its next action), kept until it lands. A second shatter before then adds nothing.

**Party effect:** none.
**Shape:** two feeders and a hammer on a fuse.
**Hooks:** Frost: a rider on `basic` applying one chill. Breaker: a reaction to `status_capped` (whose: foe, status chill) applies a hidden buff (Refresh) with a +200 boost, which removes itself on the holder's next `hit_lands`. Nothing new.
**Builds:** Snap 2 ●●● (Chill on two units' basic attacks, and a payoff after each shatter), Lockdown ● (the shatter's Stun as a window).

### Reaping line · rare
**Card:** "One holds the whole field on itself; two reap through it."
- **Beacon** · "Taunts all fight. Thorns. Heals on it are halved." Taunt, given again each time it ends; Thorns medium (150); healing received −50.
- **Scythe** ×2 · "Its basic attacks hit every foe, for a fifth each." Each basic attack is an Area hit on every foe at a fifth of its usual damage, so Taunt and Hidden don't steer it. Each of those hits is a basic-attack hit and carries what its basic attacks carry, riders and statuses included. That totals 160% of a swing against eight foes, 100% against five, and 40% against two. It multiplies with any other reshape the unit holds.

**Party effect:** none.
**Shape:** a beacon and two scythes. The field stays on one unit, which pays for it in healing, while the scythes sink every foe evenly: worth most against a crowd, less against a few.
**Hooks:** Beacon: a seat status reacting to `fight_start` and to `status_ended` (taunt) by applying Taunt; `thorns` and `healing_received`. Scythe: its basic attacks aimed by a rule, `{ side: foes, pick: all }` (**NEW** 8), with a −80 `basic` boost.
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
- **Turnkey** · "Whenever any foe is Stunned or Silenced, its abilities come 3 ticks closer." Every lock counts, a shatter's Stun included, and so do the Turnkey's own.

**Party effect:** none.
**Shape:** three clocks: one that waits, one that holds the eyes, one that speeds up with every lock.
**Hooks:** Watcher: engine 13 (reads abilities that Stun or Silence) and engine 14, which changes an ability's wait (`casting`) and its target (**NEW** 7). Turnkey: reactions to `status_gained` (whose: foe, stun, and again for silence), then a cooldown change of −3 ticks on each of its abilities (engine 1). Stun and Silence fizzle on a foe that already holds them, so the loop is bounded.
**Builds:** Lockdown 2 ●●● (locks that wait, and locks that come round), Overflow ● (more casts on the Turnkey). On a Knight with Measured blow or an Assassin with Choke, the Watcher's wait adds nothing: those versions already wait.

### Thorn hedge · rare
**Card:** "A thorned wall that draws the blows, and two who make every attacker pay."
- **Anchor** · "Draws far more. Thorns, high." Aggro +25, Thorns high (300).
- **Thorns** ×2 · "A foe that hits the Anchor is Weakened." When a foe's hit lands on the Anchor, the unit in this seat Weakens that foe, at Weaken's own 20 ticks. The spine's "briefly" goes, since statuses are universal. Each hit gives the Weaken again, so a foe that keeps striking the Anchor stays Weakened.

**Party effect:** none.
**Shape:** a hedge: one unit to strike, and two that make striking it hurt. If both Thorns seats fall, the Weaken stops.
**Hooks:** Anchor: seat `stats`. Thorns: a seat status reacting to `hit_taken` on the Anchor (whose: ally, narrowed to the Anchor's seat, **NEW** 1), applying Weaken to the attacker (`other`).
**Builds:** Toll 2 ●●● (an anchor that draws and returns, with Weaken on its attackers), Landslide ● (a plated wall).

### Blood oath · rare
**Card:** "One bleeds for power, one drinks it back, one pours life into the bleeder."
- **Bleeder** · "Loses a little HP every tick. Its hits deal half again as much." It pays 0.5% of its max HP a tick (20% over a 40-tick fight, 40% over 80). Under G12 the price is HP lost at once: it isn't damage, no Shield soaks it, nothing reacts to it, and it never takes the Bleeder below 1 HP. Its hits deal +50%.
- **Drinker** · "Lifesteal." Lifesteal medium (10%).
- **Donor** · "Its heals on the Bleeder are doubled." Direct heals the Donor casts on the Bleeder are doubled. A Regen it applies is an ordinary Regen, since statuses keep their numbers.

**Party effect:** none.
**Shape:** life moving through three hands: one spends it, one takes it from foes, one gives it.
**Hooks:** Bleeder: a seat status pulsing every tick that pays HP (engine 4, as G12 defines it); a +50 boost on all its hits. Drinker: `lifesteal`. Donor: a `healing` boost of +100, scaled by `when` the healed unit holds the Bleeder's hidden seat status (`of: target`, as Judgement reads its target). Nothing new.
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

**Party effect:** every so often (G13: every 22 ticks, first at tick 11), the wheel turns: the Wall's unit takes the Blade's part, the Blade's takes the Well's, and the Well's takes the Wall's. It turns at ticks 11, 33, 55 and 77: twice in a 40-tick fight, four times in an 80-tick one.
**Shape:** a party that changes shape on a clock. No seat is the right one for long, so it suits three all-rounders.
**Hooks:** each part is a status, given by its seat at the fight's start for 11 ticks, and for 22 after that; when it expires (`status_ended`, cause expired), the holder gains the next part. Nothing new. The interface shows the part a unit holds now on the seat and the unit.
**Builds:** exotic: no build.

---

## Legendary

### The pack · legendary
**Card:** "Everyone's basic attacks follow the Lead's last target. When it falls, the Lead's abilities come closer."
- **Lead** (first seat) · "Its hits Mark their target. When the foe it Marked falls, its abilities come 5 ticks closer." Only hits from its basic attacks and single-target abilities Mark: Area hits and extra targets don't. Under G2, the Lead keeps one Mark (14 ticks), and each new one moves it, so the Mark is always on the Lead's last target. The Lead's swing (12.8 ticks at most) comes round before the Mark runs out.
- **Packmate** ×2 · nothing of their own.

**Party effect:** through Marked, the party's basic attacks go to the Lead's quarry while it lives (by draw if another unit's Mark is out too). The Lead's own basic attacks follow it too, so the quarry changes when one of the Lead's abilities picks another foe (Backstab the lowest, Pressure point the strongest) or when it falls. While a foe Taunts, only basic attacks with Seek follow the Mark past it (G2).
**Gives up:** anything that spreads. Riders pile onto one foe, damage past its HP is lost, and the field never sinks together.
**Shape:** one picker, and a pack that follows it on a staircase of kills.
**Hooks:** Lead: a seat status reacting to `hit_lands` (whose: holder; single-target hits only) by applying Marked to `other`, which moves the Lead's one Mark (engine 2, G2). On a foe's `ko`: engine 5 reads whether the fallen foe held the Lead's Mark, then a cooldown change of −5 ticks on each of the Lead's abilities (engine 1).
**Builds:** Hunt 3 ●●● (the whole party on one foe, and a kill that resets the hunt), Lockdown ● (a disabled foe as the Lead's pick).

### The forge · legendary
**Card:** "The longer the fight, the hotter everyone burns; but the forge is slow to light."
- **Forgehand** ×3 · nothing.

**Party effect:** every 4 ticks, every ally gains a Heat. When each fight starts, every ally is Slowed at Slow's own length, 24 ticks. The spine's "for a moment" goes, since statuses are universal; the line still gives up the start, now most of a regular fight's.
**Heat (G3):** +3% damage a stack on the holder's hits, up to 15, kept all fight. Here that's +30% by tick 40 and the cap (+45%) at tick 60, so a 40-tick and an 80-tick fight end about half apart. Like any boost, it doesn't raise Burn's damage.
**Gives up:** the start: 24 ticks at −40% speed, while the foes are fresh.
**Hooks:** a formation status pulsing every 4 ticks that applies one Heat (a new counter, section 1), and a reaction to `fight_start` applying Slow at its own length.
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
- **Martyr** · "Draws far more. Can't be healed by others. When it falls, the others heal to full; it stands again after the fight with half its HP." Aggro +25. Heals from other units, a Regen they gave included, don't land on it; its own heals and Lifesteal do. Each time it falls, every other ally heals to full, again after each revive. If it's down when a fight is won, it stands with half its max HP for the next, with every ability on full cooldown (G10).
- **Spared** ×2 · nothing of their own.

**Party effect:** none beyond the Martyr's fall.
**Shape:** a party built round one sacrifice that keeps being made.
**Hooks:** Martyr: heals from others don't land (**NEW** 3). A seat status that survives a KO, reacting to its own `ko` with `heal` to `{ side: others, pick: all }` for their missing HP. The return is engine 12 (after a won fight), with every ability on full cooldown (G10). It covers the unit that fell in this seat, so a fallen unit moved into the seat between fights doesn't stand.
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

## CHALLENGES, settled

1. **Long march's short Regen:** settled by G1. It stays a short Regen of 8 ticks, as written.
2. **The forge's Slow for a moment:** settled by G1. It stays a Slow of 8 ticks, as written.
3. **Thorn hedge's brief Weaken:** settled by G1. It stays a Weaken of 6 ticks, as written.
4. **Thorn hedge's Thorns high:** settled by the formations ruling. Thorns are medium, and section 9's "in Plate" note goes.
5. **Hoarfrost line's triple:** settled by the formations ruling. The Breaker deals double.
6. **Hammer and anvil's Hammer stacking with other reshapes:** settled by G5. A unit takes one swing shape, and the seat gives Attack or Magic +1 instead.
7. **The Scythes against The storm front:** settled by the formations ruling. The Scythes' basic attacks hit every foe for a fifth each.
8. **Names:** settled by the formations ruling. The "Rod" seats are Beacon, and the common Anvil is Heavy line.

Second round:

9. **Hammer and anvil's Hammer:** settled by the second round ("too strong, or out of range"). It's at attack speed −100, half as often, as the Millstone writes it. Its triple stays under G14, as a swing shape that swings half as often.
10. **Reaping line's Scythes:** settled by the second round and G5. They're a swing shape, and their hits on the other foes are damage only.
11. **Hearth's Torch:** settled by the second round. Only its basic attacks add a Burn to each burning foe.
12. **Blood oath's Donor:** settled by the second round and G9. Its heals on the Bleeder are half again, not double.
13. **Blood oath's Bleeder:** settled by G12. Its price is HP paid, not damage: no Shield soaks it, nothing reacts to it, and it stops at 1 HP (it stopped at a tenth before).
14. **Names:** settled by the second round's cards and names. Gaol's Warden is the Turnkey, and Heavy line's Hammer is the Bruiser.
15. **The wheel's turn:** settled by G13. It turns every 22 ticks, first at tick 11.

## NEW

1. **Seats as targets and event sources:** "the unit in a named seat" and "the next seat" (the Mason, Relay, The choir, Thorn hedge's Thorns). Engine 13 reads who sits in a seat; this is the other half.
2. **A party condition:** "an ally is knocked out", read live and at a fight's start (Vigil's Mourners; The mountain when the Peak starts down).
3. **Heals from other units don't land** (The undying's Martyr).
4. **A strike sized from the hit that set it off,** a share of its damage before mitigation (The storm front; the Scythes no longer need it): a small extension of engine 9.
5. **Reading the MP cost just paid** (Relay's Well; the Brimming rod needs it too): small, beside engine 3.
6. **One party count, shown once** and kept in step after a revive (The hurricane): small, mostly interface.
7. **Engine 14 extended** from costs, stacks and cooldowns to an ability's wait and target (Gaol's Watcher, Hammer and anvil's Mason).
8. **No MP gained in a fight,** from any source (The choir, from its ruling): small, beside "heals from others blocked".
9. **An extra strike spread over every other foe that carries damage only** (the Scythes, from their rulings). The lead's gathered list has "extra strikes sized and spread over several foes".

## Least sure

1. **The pack.** Focus fire helps most parties, so "gives up anything that spreads" may not cost enough. If it doesn't, basic attacks could also lose their extra targets. G2 settled the Mark's length: 14 ticks outlasts the Lead's swing.
2. **Skirmish line.** Against many small blows, the Armor it takes away costs about what the dodges save (Scatter's lesson, 5a); it pays against big blows and with the dodge pieces.
3. **Relay's name** echoes the director's "relay is too complicated".
Settled by the rulings and taken off this list: the storm front's cost (a tenth less), the choir's cost (no MP from anything else), Heat's numbers (G3), and the undying's repeated falls (once a fight).
