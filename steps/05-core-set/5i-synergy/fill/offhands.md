# The fill: offhands

Oct 30, 2026. One share of the fill (`../fill-brief.md`): the ten offhand kinds, eight pieces each, 80 in all, in the spine's order. In each kind, two commons and two uncommons are new, designed from the spine's rule for the kind (`spine.md` section 1, the commons-and-uncommons table); the two rares and two legendaries are the spine's lines (section 4), written in full.

**The lead's rulings are applied** (`../fill-rulings.md`: G1 to G10 and "The offhands", then the second round's G11 to G17 and its lines naming offhand pieces). Where a ruling changed a piece, its entry says which. The CHALLENGES list at the end now says which ruling settled each item.

**How to read a piece.**
- **Card** is what the player reads. "Its holder" is the unit holding the offhand. Every card names its kind and who can hold it.
- **Numbers** use the scale's words, with values from `content/core-set/scale.ts`:
  - a step is 1,000 of Attack, Magic, Armor or MP; 500 of HP; 10 of Aggro; 3,000 of MP regen (about 21 MP every 4 ticks); 3 points of Crit chance;
  - special stats at medium: Evasion 20, Thorns 150, Lifesteal 10%, Siphon 10%.
  - Every status keeps its own numbers (`rules-and-vocabulary.md`): Guard +3,000 Armor for 28 ticks, Taunt 20 ticks, Haste 20, Ward 30, Regen 48% of max HP over 24, Clarity 24% of max MP over 16, Weaken −30% for 20, Slow 24, Stun 8, Silence 16, Rot −60% healing for 20, Might 6% a stack (cap 15, one spent per action), a Shield's pool capped at half max HP.
  - A status can be applied for less than its own length, never more (G1). "Short" is half its own length.
  - Stacks read off a stat at a passive's rate (a few 0.7, several 1.3 for each point of the stat), or a flat word (one 1, a few 2, several 4) where nothing scales. A single application lands at most "several" (G8).
- **Hooks** use `PRIMITIVES.md`'s terms. "The piece's status" is the permanent, unremovable status a piece brings at the fight's start (gear's `statuses`). "A fight-long marker" is the usual once-a-fight bookkeeping: a status the reaction checks with `lacks`.
  - Engine additions are the spine's (section 1) by number.
  - Where another share already named a need, I use its name: the physical weapons' NEW A (the killer named on a `ko` event, the applier on `status_gained`; it extends addition 5), NEW B (crit by a condition on the target) and NEW E (comparing two units' stats).
  - My own needs beyond those are marked **NEW** and gathered at the end.
- **Builds** for the rares and legendaries are the spine's. For commons and uncommons, they're the builds whose first rung the piece serves.

**Shared words these pieces lean on,** as the lead set them.
- **Marked** (G2; addition 2), on the Signal lantern and the Wild hunt totem:
  - a debuff on a foe, 14 ticks, Refresh;
  - the party's basic attacks pick a Marked foe, by draw among several;
  - each unit keeps one Mark: a new Mark it applies moves its old one;
  - inside the Taunt rule: while a foe Taunts, only basic attacks with Seek (the Ranger's Hunter's eye) follow the Mark past it.
- **Heat** (G3), on the Wick: +3% damage a stack, up to 15, kept all fight.
- **Fervor** (G4), on the Funeral bell: +5% damage a stack, up to 20, kept all fight and through a knockout.
- **Counters** (G11): a counter gains at most one stack every 2 ticks, however many triggers fire. No counter raises a status's damage (the status rule).
- **Paying HP** (G12): the payer loses that much HP at once. It isn't damage: no Shield soaks it, nothing reacts to it, and it never takes the payer below 1 HP (addition 4).
- **"Every so often"** (G13): every 22 ticks, the first at tick 11, unless a line states its own number.

| Kind | Common | Common | Uncommon | Uncommon | Rare | Rare | Legendary | Legendary |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Kite shield | Pavise | Banner kite | Gatekeeper's kite | Sheltering kite | Rubble shield | Humbling shield | Spiked bulwark | Oathbound shield |
| Round shield | Bronze buckler | Linden shield | Comrade's targe | Linebreaker | Paired shields | Hunter's buckler | Phalanx shield | Shield of the chosen |
| Horn | Ram's horn | Ivory horn | Reveille | Bull's horn | War horn | Echo horn | Horn of the charge | Rallying horn |
| Tome | Scholar's codex | Hymnal | Snowbound folio | Abridged lexicon | Primer of frost | Treatise on the field | Last page | Annotated grimoire |
| Lantern | Brass lantern | Hooded lantern | Pitch lantern | Dazzling lantern | Bellows lantern | Signal lantern | Wick | Lamp of vigil |
| Relic | Shrine token | Blessed knot | Holy water | Charnel icon | Saint's knucklebone | Reliquary of mercy | Phylactery | Bones of the returned |
| Bell | Temple bell | Prayer bell | Quickening chime | Waking bell | Tempo bell | Warding bell | Bell of the hour | Funeral bell |
| Totem | Standing stone | Hawthorn fetish | Spinebark pole | Bear fetish | Briar totem | Stone totem | Earthmother totem | Wild hunt totem |
| Vial | Red tincture | Hemlock phial | Clotting salve | Crimson dregs | Blood vial | Venom vial | Vial of the last breath | Bloodlust draught |
| Idol | Night mask | Carved effigy | Carrion idol | Fanged idol | Withering idol | Leech idol | Idol of binding | Idol of the hungry dark |

---

## Kite shield (Knight, Paladin)

The spine's rule: commons lean Armor, HP, Aggro; uncommons a Shield at the start from max HP, a Guard on the lowest ally at the start. Under G7 (the second round) the Shield at the start goes, since the amulet's Carapace charm has it; the first uncommon braces its holder while it Taunts instead. The eight spread across the Toll, Landslide, Lockdown and Phoenix: a bigger wall, a lock off the wall's Shield, Weaken on whoever hits it, thorns from its Armor, and a bodyguard.

#### Pavise · kite shield · common
- **Card:** Kite shield. Fits Knight, Paladin. Armor +2.
- **Numbers:** Armor +2 (2,000).
- **Hooks:** stats only.
- **Builds:** Landslide 1 ●, Toll 1 ●.

#### Banner kite · kite shield · common
- **Card:** Kite shield. Fits Knight, Paladin. HP +1, Aggro +1.
- **Numbers:** HP +1 (500), Aggro +10.
- **Hooks:** stats only.
- **Builds:** Toll 1 ● (the draw), Landslide 1 ● (max HP feeds Vanguard and Shield bash).

#### Gatekeeper's kite · kite shield · uncommon
- **Card:** Kite shield. Fits Knight, Paladin. Armor +1. While its holder Taunts, it takes a tenth less damage.
- **Numbers:**
  - Armor +1 (1,000).
  - −10% damage taken, of every kind, while Taunting. The Knight Taunts through Stand fast; the Paladin needs a Taunt from gear.
  - It replaces the Shield at the start, which repeated the amulet's Carapace charm (G7, second round). No other kind the Knight or the Paladin wears cuts the damage a Taunting unit takes.
- **Hooks:** the piece's status: `status_gained` (taunt) on the holder → `apply` a status with `taken: [{ pct: -10 }]`, `to: holder`; `status_ended` (taunt) → `remove` it.
- **Builds:** Toll 1 ● (the anchor), Landslide 1 ● (the bulwark), Bonfire 1 ● (the keeper).

#### Sheltering kite · kite shield · uncommon
- **Card:** Kite shield. Fits Knight, Paladin. HP +1. At the start of every fight, the ally with the lowest share of its HP is Guarded.
- **Numbers:**
  - HP +1 (500).
  - Guard at its own numbers. HP carries between fights, so the lowest is usually whoever came out of the last fight worst; with everyone full, a random ally.
- **Hooks:** the piece's status: `fight_start` → `apply` guard, `to: { side: allies, pick: lowest, by: hp_share }`.
- **Builds:** Phoenix 1 ● (the returned come back low), Pact 1 ● (it fights low), Bonfire 1 ● (the early fight held).

#### Rubble shield · kite shield · rare
- **Card:** Kite shield. Fits Knight, Paladin. Armor +1. When its holder's Shield breaks, the foe whose blow broke it is Stunned.
- **Numbers:**
  - Armor +1 (1,000): the effect is thin on a holder whose Shield breaks once a fight (the Knight's Vanguard alone).
  - Stun at its own numbers (8 ticks, Fizzle: a foe already Stunned stays as it is).
  - It needs a foe's hit to break the Shield. A pool run out by a status's tick, or removed by Dispel, Stuns nobody.
- **Hooks:**
  - The piece's status: `status_ended` (shield, cause `stacks`) on the holder → `apply` stun, `to:` the unit whose damage emptied the pool.
  - That needs addition 5 (reading the other unit of an event): `status_ended` carries no other unit today.
- **Builds:** Lockdown 2 ●●● (a lock on another clock), Landslide 2 ●●, Toll ●.

#### Humbling shield · kite shield · rare
- **Card:** Kite shield. Fits Knight, Paladin. The first time each foe hits its holder, that foe is Weakened.
- **Numbers:** Weaken at its own numbers (−30% damage, 20 ticks). Once for each foe, each fight. Against a pack crowding a Taunting Knight, most of the pack is Weakened in the first ticks.
- **Hooks:**
  - The piece's status: `hit_taken` → `apply` weaken, `to: other`, where the other lacks `humbled`. Then `apply` `humbled` (a fight-long marker), `to: other`.
  - **NEW:** a marker that's neither a buff nor a debuff. As a debuff, `humbled` would count toward Inquisition, Hexweave mail and every "with a debuff".
- **Builds:** Toll 2 ●●●, Lockdown ●●, Pact ●.

#### Spiked bulwark · kite shield · legendary
- **Card:** Kite shield. Fits Knight, Paladin. Thorns from its holder's Armor: each foe that hits it takes a twentieth of its Armor back.
- **Numbers:** Thorns equal to 5% of Armor, read live, added to any other Thorns.
  - At Armor 4 (4,000): 200.
  - With a Plate piece's +1 or +2: 250 to 300 (Thorns high is 300).
  - Guarded (+3,000): 400 to 450.
- **Hooks:**
  - A Thorns stat change of `{ ratio: 0.05, stat: armor, of: holder }`.
  - **NEW:** a stat change read live from another stat. Today a status's stat change reads once, at application, so Guard would never count.
  - The fallback with no NEW: a `hit_taken` reaction dealing untyped damage of 5% of Armor (`of: holder`) to the other unit. It reads live, but nothing that listens for Thorns (Thornheart plate's Spite) hears it.
- **Builds:** Toll 3 ●●● and Landslide 3 ●●● (the door: the stone wall becomes a thorn wall).

#### Oathbound shield · kite shield · legendary
- **Card:** Kite shield. Fits Knight, Paladin. HP +1. When a hit would deal an ally more than a quarter of its max HP, its holder takes the hit instead.
- **Numbers:**
  - HP +1 (500): the bodyguard's body.
  - The line is 25% of the ally's max HP, judged where Aegis is judged: after the ally's mitigation, before its Aegis and Shield.
  - The hit then lands on the holder in full: the holder's own damage-taken modifiers, Armor or Magic resist, Aegis, Shield and HP. Its statuses and riders land on the holder too.
  - No limit a fight.
- **Hooks:**
  - Addition 11 (taking a hit for an ally).
  - A redirected hit is a hit the holder takes, so its Thorns answer it.
  - It never moves twice (two holders don't pass a hit back and forth). Nothing moves while the holder is knocked out.
  - An Area blast is judged ally by ally, so one raidwide can land on the holder two or three times.
- **Builds:** Toll 2 ●●, Bonfire 2 ●● (the keeper), Phoenix ●●, Lockdown ●: a bodyguard that pays in its own HP.

---

## Round shield (Hoplite, Valkyrie)

The spine's rule: commons lean Armor, Attack, HP; uncommons a Guard at the start, a short Taunt when an ally drops below half. Under G7 the Taunt goes (the amulet's Red ribbon has it now), and the second uncommon breaks a Taunting front instead. The eight: Guard passed along, a front broken, a kill that hardens the killer, an aura that costs its holder damage, and a raise on the spot.

#### Bronze buckler · round shield · common
- **Card:** Round shield. Fits Hoplite, Valkyrie. Armor +1, Attack +1.
- **Numbers:** Armor +1 (1,000), Attack +1 (1,000).
- **Hooks:** stats only.
- **Builds:** Landslide 1 ● (Phalanx's swing), Hunt 1 ● (Gale spear scales from Attack).

#### Linden shield · round shield · common
- **Card:** Round shield. Fits Hoplite, Valkyrie. HP +2.
- **Numbers:** HP +2 (1,000).
- **Hooks:** stats only.
- **Builds:** Toll 1 ●, Pact 1 ●.

#### Comrade's targe · round shield · uncommon
- **Card:** Round shield. Fits Hoplite, Valkyrie. Armor +1. At the start of every fight, the other ally with the highest Aggro is Guarded.
- **Numbers:**
  - Armor +1 (1,000).
  - Guard at its own numbers, on the other ally drawing the most, never the holder (the second round's ruling): on a Hoplite, the party's other wall or its sturdiest fighter; on a Valkyrie, the party's wall.
- **Hooks:** the piece's status: `fight_start` → `apply` guard, `to: { side: others, pick: highest, by: { stat: aggro } }`.
- **Builds:** Toll 1 ● (the anchor), Landslide 1 ● (the bulwark), Bonfire 1 ● (the keeper).

#### Linebreaker · round shield · uncommon
- **Card:** Round shield. Fits Hoplite, Valkyrie. Attack +1. Its holder's hits on a Taunting foe deal a fifth more.
- **Numbers:**
  - Attack +1 (1,000).
  - +20% (a small boost) on its hits, both damage types, against a foe that's Taunting.
  - It replaces the short Taunt when an ally drops below half, which the amulet's Red ribbon now gives (G7). No other kind the Hoplite or the Valkyrie wears pays for hitting a Taunting front.
- **Hooks:** a boost on `physical` and `magical`, `{ ratio: 20, when: { has: taunt }, of: target }`.
- **Builds:** Hunt 1 ● (the front that shields the back row, pried open), Ambush 1 ● (the front that catches the volley), Landslide 1 ● (the blows land on the wall).

#### Paired shields · round shield · rare
- **Card:** Round shield. Fits Hoplite, Valkyrie. Armor +1. Whenever its holder is Guarded, so is the other ally lowest in HP share that isn't Guarded yet.
- **Numbers:**
  - Armor +1 (1,000): its holder's own Guards are few (the Hoplite's Paired guard on a long cooldown; the Valkyrie has none).
  - Guard at its own numbers. Beside Paired guard, all three are Guarded.
- **Hooks:**
  - The piece's status: `status_gained` (guard) on the holder → `apply` guard, `to: { side: others, where: { lacks: guard }, pick: lowest, by: hp_share }`.
  - No `ifNone`, so two holders can't pass a Guard back and forth: once everyone is Guarded, nothing fires.
  - The spine says "the ally lowest"; "that isn't Guarded yet" only keeps Paired guard (which already Guards the other lowest) from wasting it.
- **Builds:** Toll 2 ●●, Bonfire ●●, Landslide ●.

#### Hunter's buckler · round shield · rare
- **Card:** Round shield. Fits Hoplite, Valkyrie. Attack +1. When its holder's hit fells a foe, it gains Haste and a Shield.
- **Numbers:**
  - Attack +1 (1,000): kills come from Attack on both holders (Gale spear, Phalanx's swing), and the effect is thin until they do.
  - Haste at its own numbers. A Shield of 15% of max HP: 600 on a Hoplite, 450 on a Valkyrie.
  - A kill by a status's tick doesn't count.
- **Hooks:** the piece's status: `ko` (whose: `foe`) where the unit that dealt the knockout is the holder (NEW A) → `apply` haste and `apply` shield (`{ ratio: 0.15, stat: max_hp, of: holder }`), `to: holder`.
- **Builds:** Hunt 2 ●●, Ambush ●.

#### Phalanx shield · round shield · legendary
- **Card:** Round shield. Fits Hoplite, Valkyrie. While its holder is above half its HP, allies with less Armor than it take a fifth less damage. Its holder always deals a fifth less.
- **Numbers:**
  - −20% damage taken, of every kind, status damage included, while the holder is above half its HP (the offhands ruling). When the holder drops below half, the cover lifts; healed back above, it returns.
  - −20% on the holder's own hits, all fight.
  - At Armor 5 the Hoplite covers almost anyone; a Valkyrie at Armor 3 covers the casters and the light fighters.
- **Hooks:**
  - The piece's status gives each other ally a per-source aura that ends with the holder (`endsWithSource`): `taken: [{ pct: -20 }]`.
  - The aura holds only while that ally's Armor is below the holder's (NEW E, comparing two units' stats, shared with the Pike wall) and the holder is at half its HP or more.
  - The second condition is Bloodlust's pattern on the holder: `hp_lost` removes the cover where the holder is below 50; `healed` restores it where it's at 50 or more.
  - The holder: `boosts` −20 on `physical` and `magical`.
- **Builds:** Bonfire 3 ●●● (the early fight held), Harvest ●● (the full field held), Toll ●●; gives up: its own damage.

#### Shield of the chosen · round shield · legendary
- **Card:** Round shield. Fits Hoplite, Valkyrie. Once a fight, when another ally falls, its holder raises it at once with a tenth of its HP.
- **Numbers:**
  - A tenth of the fallen ally's max HP.
  - Every action on its full cooldown, as any revive. On a Valkyrie, Einherjar should make it ready (see the hooks).
  - "At once" is the next moment the engine resolves.
- **Hooks:**
  - The piece's status: `ko` (whose: `ally`) → `revive`, hp `{ ratio: 0.1, stat: max_hp, of: target }`, `to: owner`, with a fight-long marker.
  - **NEW** (small): Einherjar as a rule on every revive the Valkyrie makes. Today it's written into Valhalla (`ready: true`), so a revive from her gear would come back on cooldown.
- **Builds:** Phoenix 3 ●●● (a return that doesn't wait for an ability, and a revive for the Hoplite).

---

## Horn (Knight, Bard)

The spine's rule: commons lean Aggro, MP regen, Attack or Magic; uncommons a Clarity on the least-MP ally at the start, a short Taunt at the start. Under G7 (the second round) the Taunt at the start goes, since the sword's Clarion blade has it for the Knight; the second uncommon quickens the party on its first kill instead. The eight reach Overflow, Landslide, Ambush, the Hunt, Phoenix and the Toll. Three of them act at the fight's start (see "least sure").

#### Ram's horn · horn · common
- **Card:** Horn. Fits Knight, Bard. Aggro +1, Attack +1.
- **Numbers:** Aggro +10, Attack +1 (1,000).
- **Hooks:** stats only.
- **Builds:** Toll 1 ●, Landslide 1 ●.

#### Ivory horn · horn · common
- **Card:** Horn. Fits Knight, Bard. MP regen +1, Magic +1.
- **Numbers:** MP regen +1 (3,000: about 7% of a 3,000 pool over a 40-tick fight), Magic +1 (1,000).
- **Hooks:** stats only.
- **Builds:** Overflow 1 ● (MP regen), Harvest 1 ● (Thunder chord's Shock reads Magic).

#### Reveille · horn · uncommon
- **Card:** Horn. Fits Knight, Bard. Magic +1. At the start of every fight, the ally with the least MP gains a short Clarity.
- **Numbers:**
  - Magic +1 (1,000).
  - A short Clarity (G1): 8 ticks, half its own, so two pulses, 12% of that ally's max MP.
  - MP carries between fights and no class regains it in a fight, so this is the party's driest caster topped up a little once a fight.
- **Hooks:** the piece's status: `fight_start` → `apply` clarity, duration 8, `to: { side: allies, pick: lowest, by: mp_share }`.
- **Builds:** Overflow 1 ●, Lockdown 1 ● (MP for the locks), Bonfire 1 ● (the feeding casts).

#### Bull's horn · horn · uncommon
- **Card:** Horn. Fits Knight, Bard. Attack +1. The first time in a fight that a foe falls, every ally is briefly Hasted.
- **Numbers:**
  - Attack +1 (1,000).
  - A short Haste (G1): 10 ticks, half its own, on every standing ally, once a fight.
  - It replaces the Taunt at the start, which repeated the sword's Clarion blade for the Knight (G7, second round). No other kind the Knight or the Bard wears answers a kill.
- **Hooks:** the piece's status: `ko` (whose `foe`) → `apply` haste, duration 10, `to: { side: allies, pick: all }`, while the holder lacks a fight-long marker, which the reaction then applies.
- **Builds:** Hunt 1 ● (the first kill speeds the next), Cuts 1 ● (speed), Ambush 1 ● (the volley's first kill hastens the tail).

#### War horn · horn · rare
- **Card:** Horn. Fits Knight, Bard. At the start of every fight, the ally with the slowest basic attack gains several Might.
- **Numbers:**
  - Several Might, flat: 4 stacks (+24%), spent one an action. The spine's "many" is "several" under G8 (a single application).
  - On a Hoplite's Phalanx (a great weapon's 12.8 ticks, halved again) that's its first four swings, about half a regular fight.
- **Hooks:**
  - The piece's status: `fight_start` → `apply` might, stacks 4, `to:` the ally with the slowest basic attack.
  - **NEW** (small, shared with the Tempo bell): a pick by basic-attack interval (the weapon's cooldown after Attack speed), "slowest basic attack".
- **Builds:** Landslide 2 ●●● (Might on the hammer), Ambush 2 ●●.

#### Echo horn · horn · rare
- **Card:** Horn. Fits Knight, Bard. Each time an ally finishes casting an ability, the ally with the least MP gains a little MP.
- **Numbers:**
  - 5% of the receiver's max MP a cast: 190 on a Pyromancer, 50 on a Knight.
  - The ally with the least MP is read as a share of its pool.
  - "An ally" includes the holder.
- **Hooks:**
  - The piece's status: `action_resolve` (kind `ability`, whose `holder`) and `action_resolve` (kind `ability`, whose `ally`).
  - Each does `mp` `{ ratio: 0.05, stat: max_mp, of: target }`, `to: { side: allies, pick: lowest, by: mp_share }`.
  - It sizes off the receiver's pool, not the cast's cost, so it isn't the Brimming rod's tenth.
- **Builds:** Overflow 2 ●●●, Lockdown ●, Bonfire ●.

#### Horn of the charge · horn · legendary
- **Card:** Horn. Fits Knight, Bard. At the start of every fight, every ally is Hasted and its first action comes at once. Its holder starts every fight with every ability on cooldown.
- **Numbers:**
  - Haste at its own numbers.
  - "Its first action comes at once": each ally's basic attack is ready at the first tick. An ability already ready (cooldowns carry from the last fight) goes first, by slot order.
  - The holder's abilities restart their full cooldowns every fight. Cooldowns carry, so its long ones may never come round.
- **Hooks:** the piece's status: `fight_start` → `apply` haste, `to:` every ally; addition 1 (make each ally's basic-attack timer ready); addition 1 again, the other way (set the holder's ability cooldowns to full).
- **Builds:** Ambush 3 ●●●, Cuts ●●; gives up: the holder's own opening.

#### Rallying horn · horn · legendary
- **Card:** Horn. Fits Knight, Bard. When an ally falls (its holder too), every ally still standing gains Haste and a Shield. When an ally is revived, it gains several Might.
- **Numbers:**
  - Haste at its own numbers.
  - A Shield of a fifth of each ally's own max HP.
  - Several Might, flat: 4 on the revived (the spine's "many", under G8).
- **Hooks:**
  - The piece's status, which survives its holder's knockout, so it rings for the holder's own fall: `ko` (whose `holder` and whose `ally`) → `apply` haste and shield (`{ ratio: 0.2, stat: max_hp, of: target }`), `to: { side: allies, pick: all }`.
  - `revived` (whose `holder` and whose `ally`) → `apply` might 4, `to: owner`.
- **Builds:** Phoenix 3 ●●●, Toll ●.

---

## Tome (Frostweaver, Bard)

The spine's rule: commons lean Magic, MP, MP regen; uncommons a few Chill on every foe at the start, abilities that cost a little less. The eight reach Snap, Lockdown, Harvest and Overflow: a cold opening, a cheaper caster, Chill that snowballs, a sweep that evens the field, a finisher, and a free cast passed on.

#### Scholar's codex · tome · common
- **Card:** Tome. Fits Frostweaver, Bard. Magic +2.
- **Numbers:** Magic +2 (2,000).
- **Hooks:** stats only.
- **Builds:** Snap 1 ● (Chill stacks read Magic), Harvest 1 ● (Blizzard).

#### Hymnal · tome · common
- **Card:** Tome. Fits Frostweaver, Bard. MP +1, MP regen +1.
- **Numbers:** MP +1 (1,000), MP regen +1 (3,000).
- **Hooks:** stats only.
- **Builds:** Overflow 1 ●.

#### Snowbound folio · tome · uncommon
- **Card:** Tome. Fits Frostweaver, Bard. Magic +1. At the start of every fight, every foe gains a few Chill.
- **Numbers:**
  - Magic +1 (1,000).
  - A few Chill read off the holder's Magic: 0.7 a point, so 3.5 at Magic 5 (a Frostweaver with this tome), 2.8 at 4.
  - A Frostweaver's first Frost lance then lands a foe one or two stacks short of a shatter.
- **Hooks:** the piece's status: `fight_start` → `apply` chill, stacks `{ ratio: 0.0007, stat: magic, of: holder }`, `to: { side: foes, pick: all }`.
- **Builds:** Snap 1 ●, Lockdown 1 ● (the slow), Ambush 1 ● (the opening freeze).

#### Abridged lexicon · tome · uncommon
- **Card:** Tome. Fits Frostweaver, Bard. MP +1. Its holder's abilities cost a tenth less MP.
- **Numbers:** MP +1 (1,000). −10% MP cost: a 1,000 Blizzard costs 900, a 450 War ballad 405.
- **Hooks:** a stat on the holder: addition 3 (costs × (1 + stat/100)), at −10.
- **Builds:** Overflow 1 ●, Lockdown 1 ● (more locks), Harvest 1 ● (the big sweeps).

#### Primer of frost · tome · rare
- **Card:** Tome. Fits Frostweaver, Bard. Each time its holder adds Chill to a foe, it adds one more stack for every four the foe already holds.
- **Numbers:**
  - +1 stack at 4 to 7 Chill, +2 at 8 to 11 (rounded down).
  - It bites on the last steps before a shatter (the cap of 12), so the second and third casts on a foe shatter it sooner.
  - Every application counts: Frost lance, Blizzard and Stillness on each foe, and any Chill on the Bard's hits from other pieces.
- **Hooks:** addition 14 (gear that changes its wearer's stacks by what they do): the holder's applications of chill add `{ ratio: 0.25, stacks: chill, of: target }`, rounded down.
- **Builds:** Snap 2 ●●●.

#### Treatise on the field · tome · rare
- **Card:** Tome. Fits Frostweaver, Bard. Magic +1. Its holder's abilities that hit every foe deal half again as much to each foe above half its HP.
- **Numbers:**
  - Magic +1 (1,000): few tome holders' abilities hit every foe (the Frostweaver's Blizzard and two versions, the Bard's Resonance), and those hits are touch-sized.
  - +50% to foes above half their HP, so the healthy fall to the middle and the field sinks together. "More to foes with more HP" is written as a line at half; a graded version needs a scale on the target's HP share.
- **Hooks:** a boost on both damage types, `when: { hpAtLeast: 50 }, of: target`, limited to hits of an action aimed at every foe: **NEW** (small, shared with the Signal lantern), an `area` tag on those hits.
- **Builds:** Harvest 2 ●●● (evening out).

#### Last page · tome · legendary
- **Card:** Tome. Fits Frostweaver, Bard. When a foe falls, every foe below a tenth of its HP falls too, except a boss.
- **Numbers:**
  - Below 10% of max HP.
  - Every fall it causes checks again, so a field of low foes goes down at once.
  - Bosses are spared (the offhands ruling); any fall, a boss's adds included, still sets it off.
- **Hooks:**
  - The piece's status: `ko` (whose: `foe`) → `damage` of type `none`, amount `{ ratio: 1, hp: current, of: target } + { ratio: 1, stacks: shield, of: target }`, `to: { side: foes, where: { hpBelow: 10, not a boss }, pick: all }`.
  - **NEW** (small): a unit condition on rank, "not a boss".
  - It isn't a hit, and nothing reacts to it as one.
  - A foe whose damage-taken cut leaves it a sliver would survive. If that ever happens, a knockout effect is cleaner than damage.
- **Builds:** Harvest 3 ●●● (the finisher), Snap ●● (a shatter starts a chain), Bonfire ●.

#### Annotated grimoire · tome · legendary
- **Card:** Tome. Fits Frostweaver, Bard. Each ability its holder pays for makes the next ability any ally casts free.
- **Numbers:**
  - One free cast waits at a time. Another paid cast while one waits adds nothing.
  - A cast it made free doesn't make another. The holder's own next cast can be the free one, so a lone holder pays for at least every other cast.
  - A free ability is ready even with its caster dry.
- **Hooks:**
  - The piece's status: `action_resolve` (kind `ability`, whose `holder`, MP paid above 0) → `apply` a token status, `to:` every ally.
  - The token is a stat on addition 3 at −100.
  - Any ally's `action_resolve` of kind `ability` spends it: `remove` the token from every ally.
- **Builds:** Overflow 3 ●●●, Lockdown ●● (free locks).
- The guard against the loop ("a cast it made free doesn't make another") is the lead's ruling.

---

## Lantern (Paladin, Pyromancer)

The spine's rule: commons lean Magic, HP, MP; uncommons a few Burn on every foe at the start, a Ward at the start. Under G7 the Ward goes (the rune sword and the mace keep theirs), and the second uncommon dazzles the most dangerous foe instead. Three of the eight work on Burn (the start, the flare, the fire passed on); the others are a dazzle, a mark for the hunt, and returns between fights.

#### Brass lantern · lantern · common
- **Card:** Lantern. Fits Paladin, Pyromancer. Magic +1, HP +1.
- **Numbers:** Magic +1 (1,000), HP +1 (500).
- **Hooks:** stats only.
- **Builds:** Bonfire 1 ● (Burn stacks read Magic), Harvest 1 ● (Fireball).

#### Hooded lantern · lantern · common
- **Card:** Lantern. Fits Paladin, Pyromancer. MP +2.
- **Numbers:** MP +2 (2,000).
- **Hooks:** stats only.
- **Builds:** Overflow 1 ●, Bonfire 1 ● (MP on the feeding casts).

#### Pitch lantern · lantern · uncommon
- **Card:** Lantern. Fits Paladin, Pyromancer. Magic +1. At the start of every fight, every foe gains a few Burn.
- **Numbers:**
  - Magic +1 (1,000).
  - A few Burn read off the holder's Magic: 0.7 a point, so 4.2 at Magic 6 (a Pyromancer with this lantern), 3.5 at 5.
  - About half a Fireball's Burn on every foe, at the first tick.
- **Hooks:** the piece's status: `fight_start` → `apply` burn, stacks `{ ratio: 0.0007, stat: magic, of: holder }`, `to: { side: foes, pick: all }`.
- **Builds:** Bonfire 1 ●, Harvest 1 ●, Ambush 1 ●.

#### Dazzling lantern · lantern · uncommon
- **Card:** Lantern. Fits Paladin, Pyromancer. HP +1. At the start of every fight, the foe with the highest Attack or Magic is briefly Weakened.
- **Numbers:**
  - HP +1 (500).
  - A short Weaken (G1): −30% damage for 10 ticks, half its own, once a fight.
  - It takes the edge off the opening blows of the foe most likely to land them. None of the other kinds the Paladin and the Pyromancer wear has a Weaken at the start (G7: it replaces the Ward at the start).
- **Hooks:** the piece's status: `fight_start` → `apply` weaken, duration 10, `to: { side: foes, pick: highest, by: { stats: [attack, magic] } }`.
- **Builds:** Bonfire 1 ● (the early danger), Toll 1 ● (Weaken), Lockdown 1 ● (a disabled foe from the first tick).

#### Bellows lantern · lantern · rare
- **Card:** Lantern. Fits Paladin, Pyromancer. Each hit its holder lands on a burning foe adds Burn: a tenth of what the foe holds.
- **Numbers:**
  - A tenth of the target's Burn, rounded up: +1 on a foe holding up to 10, +3 at 25.
  - Each of Fireball's hits counts, foe by foe.
  - Burn keeps its own numbers. The bellows slows the 15% decay and lifts the top of the ramp.
- **Hooks:** the piece's status: `hit_lands` (whose `holder`), where the other has burn → `apply` burn, stacks `{ ratio: 0.1, stacks: burn }` read from the other unit (addition 5), `to: other`.
- **Builds:** Bonfire 2 ●●● (the fire that flares).

#### Signal lantern · lantern · rare
- **Card:** Lantern. Fits Paladin, Pyromancer. A foe its holder hits with an ability is Marked. Abilities that hit every foe don't Mark.
- **Numbers:**
  - Marked as G2 sets it: 14 ticks, Refresh, one Mark for the holder at a time, so each new ability hit moves it.
  - Smite Marks the foe with the highest Attack or Magic; Firebolt and Pyre Mark the foe with the most Burn.
  - Fireball would Mark every foe, which marks nothing, hence the exception.
  - Behind a Taunting front, only basic attacks with Seek follow the Mark (G2).
- **Hooks:** the piece's status: `hit_lands` (kind `ability`, whose `holder`), not `area` (**NEW**, the tag shared with Treatise on the field) → `apply` marked, `to: other`. Addition 2.
- **Builds:** Hunt 2 ●● (Smite on the dangerous foe, the hunt's own), Bonfire ●● (the hottest foe as everyone's target).

#### Wick · lantern · legendary
- **Card:** Lantern. Fits Paladin, Pyromancer. When a burning foe falls, all its Burn passes to the foe with the most HP, and its holder gains Heat.
- **Numbers:**
  - Every stack the fallen foe held, to the living foe with the most current HP.
  - One Heat a burning foe's fall: +3% damage on its hits each time, up to Heat's cap of 15 (+45%, G3). It was two; G11 allows a counter one stack every 2 ticks, so a pack falling together gives one stack per 2 ticks.
  - Any burning foe counts, whoever lit it.
- **Hooks:**
  - The piece's status: `status_ended` (burn, cause `ko`, whose `foe`): a foe's statuses end just before its `ko` event, as the Gravemark's hook relies on.
  - → `apply` burn with the ended status's stacks (addition 5: reading a dying foe's stacks), `to: { side: foes, pick: highest, by: hp }`; `apply` heat 1, `to: holder`.
- **Builds:** Bonfire 3 ●●● (fire that outlives its foe).

#### Lamp of vigil · lantern · legendary
- **Card:** Lantern. Fits Paladin, Pyromancer. After each won fight, one fallen ally stands up with a quarter of its HP.
- **Numbers:**
  - A quarter of max HP, one ally a fight, chosen at random among the fallen.
  - Its holder must be standing when the fight is won.
  - The raised ally starts the next fight as a revived unit does: every action on its full cooldown.
- **Hooks:** addition 12 (after a won fight) → `revive`, hp `{ ratio: 0.25, stat: max_hp, of: target }`, `to: { side: allies, where: { ko: true }, pick: random }`.
- **Builds:** Phoenix 2 ●●● (returns between fights), Pact ●.

---

## Relic (Cleric, Valkyrie)

The spine's rule: commons lean Magic, MP regen, HP; uncommons heals that also cleanse one debuff, a Regen on the lowest ally at the start. Under G7 (the second round) the Regen at the start goes, since the mace's Mender's mace has it for the Cleric; the second uncommon mends the hurt as foes fall instead. The eight: riders on heals (a cleanse, Might), a mend from each fallen foe, cheaper and quicker revives, overhealing turned into a Shield, and a revive that trades readiness for HP.

#### Shrine token · relic · common
- **Card:** Relic. Fits Cleric, Valkyrie. MP regen +2.
- **Numbers:** MP regen +2 (6,000: about 14% of a 3,000 pool over a 40-tick fight).
- **Hooks:** stats only.
- **Builds:** Overflow 1 ●, Phoenix 1 ● (MP for the returns).

#### Blessed knot · relic · common
- **Card:** Relic. Fits Cleric, Valkyrie. Magic +1, HP +1.
- **Numbers:** Magic +1 (1,000), HP +1 (500).
- **Hooks:** stats only.
- **Builds:** Pact 1 ● (heals read Magic), Phoenix 1 ●.

#### Holy water · relic · uncommon
- **Card:** Relic. Fits Cleric, Valkyrie. Magic +1. Each time one of its holder's abilities heals an ally, it also lifts one debuff from that ally.
- **Numbers:**
  - Magic +1 (1,000).
  - One debuff, the newest, for each heal from an ability: Cure, Rally, and versions that heal.
  - Regen's pulses don't count; Renew already cleanses.
- **Hooks:** the piece's status: addition 7 (a heal given, from the healer's side), kind `ability` → `remove` label `debuff`, count 1, `to: other`.
- **Builds:** Pact 1 ● (Weaken and Rot off the drinker), Toll 1 ● (the anchor kept clean), Phoenix 1 ●.

#### Charnel icon · relic · uncommon
- **Card:** Relic. Fits Cleric, Valkyrie. MP regen +1. Each time a foe falls, the ally with the lowest share of its HP is healed a little.
- **Numbers:**
  - MP regen +1 (3,000).
  - 6% of the healed ally's max HP a fall. A regular fight's three or four kills before the last come to about a fifth of one ally's HP, about what the short Regen at the start gave, but paid out as the fight is won.
  - It replaces the Regen at the start (and the name Mending icon, a near-twin of Mender's mace), which repeated the mace's for the Cleric (G7, second round). No other kind the Cleric or the Valkyrie wears heals on a foe's fall.
- **Hooks:** the piece's status: `ko` (whose `foe`) → `heal` `{ ratio: 0.06, stat: max_hp, of: target }`, `to: { side: allies, pick: lowest, by: hp_share }`.
- **Builds:** Hunt 1 ● (each kill mends the hurt), Pact 1 ● (life bought back), Phoenix 1 ● (the returned kept up).

#### Saint's knucklebone · relic · rare
- **Card:** Relic. Fits Cleric, Valkyrie. Each time one of its holder's abilities heals an ally, that ally gains a few Might.
- **Numbers:**
  - A few Might read off the holder's Magic, at 0.7 a point: 2.8 from a Cleric at Magic 4, 2.1 from a Valkyrie at 3.
  - Heals from abilities only (Cure on its quick cooldown, Rally). Regen's pulses would give six times as many.
- **Hooks:** the piece's status: addition 7 (a heal given), kind `ability` → `apply` might, stacks `{ ratio: 0.0007, stat: magic, of: holder }`, `to: other`.
- **Builds:** Pact 2 ●●●, Phoenix ●, Toll ●.

#### Reliquary of mercy · relic · rare
- **Card:** Relic. Fits Cleric, Valkyrie. Its holder's revives cost half their MP and wind up in a moment.
- **Numbers:**
  - Raise: 650 MP → 325, very long wind-up (8 ticks) → quick (1).
  - Valhalla: 650 → 325; its wind-up is quick already.
  - Any version that revives counts.
- **Hooks:** addition 14 (gear that changes its wearer's abilities by what they do: those that `revive`), on addition 3 (cost −50) and the wind-up set to quick.
- **Builds:** Phoenix 2 ●●●, Ambush ● (Raise first).

#### Phylactery · relic · legendary
- **Card:** Relic. Fits Cleric, Valkyrie. The part of its holder's heals that would go past full becomes a Shield on the healed ally.
- **Numbers:**
  - Every heal the holder gives counts: its abilities' heals, the pulses of Regens it applied, and its own Lifesteal.
  - The Shield keeps its own cap (half max HP).
- **Hooks:** the piece's status: addition 8 (overhealing) with addition 7 (a heal given) → `apply` shield, stacks equal to the overheal (`amount`), `to: other`.
- **Builds:** Pact 3 ●●● (healing that turns into more), Landslide ●●, Phoenix ●●.

#### Bones of the returned · relic · legendary
- **Card:** Relic. Fits Cleric, Valkyrie. Allies its holder revives come back with all their HP, and with every ability on full cooldown.
- **Numbers:**
  - Full max HP. Raise's half and Valhalla's tenth both become full.
  - On the Valkyrie it replaces Einherjar's readiness: her returns come back whole but slow. That's the trade.
- **Hooks:** addition 14 (gear that changes its wearer's revives): hp `{ ratio: 1, stat: max_hp, of: target }`, `ready: false`, winning over Einherjar.
- **Builds:** Phoenix 3 ●● (the sturdy return), Pact ●.

---

## Bell (Monk, Cleric, Stormcaller)

The spine's rule: commons lean MP regen, Evasion, Magic or Attack; uncommons a short Haste at the start, a Silence answer. Under G7 the Haste at the start goes (the fist weapons keep theirs), and the first uncommon quickens its holder on a dodge instead. The eight: a dodge that pays, tempo shared, a cleanse on a beat, cooldowns that come round, and a bell that rings for every fall.

#### Temple bell · bell · common
- **Card:** Bell. Fits Monk, Cleric, Stormcaller. Evasion medium, Attack +1.
- **Numbers:** Evasion medium (20), Attack +1 (1,000).
- **Hooks:** stats only.
- **Builds:** Cuts 1 ● (Evasion), Toll 1 ● (the dancer).

#### Prayer bell · bell · common
- **Card:** Bell. Fits Monk, Cleric, Stormcaller. MP regen +1, Magic +1.
- **Numbers:** MP regen +1 (3,000), Magic +1 (1,000).
- **Hooks:** stats only.
- **Builds:** Overflow 1 ●, Harvest 1 ● (the Stormcaller's sweeps).

#### Quickening chime · bell · uncommon
- **Card:** Bell. Fits Monk, Cleric, Stormcaller. Evasion medium. Each time its holder dodges a hit, its next basic attack comes a little sooner.
- **Numbers:**
  - Evasion medium (20).
  - 2 ticks off the holder's basic-attack timer for each dodge: a small step, on a trigger the foes control.
  - On a Monk (Evasion high, 35, plus 20) taking a pack's blows, that's a swing or two more a fight; on a Cleric or Stormcaller, a dodge now and then.
  - None of the other kinds its holders wear has a dodge that pays (G7: it replaces the Haste at the start).
- **Hooks:** the piece's status: `hit_evaded` (whose `holder`) → addition 1 (bring the basic-attack timer 2 ticks closer).
- **Builds:** Cuts 1 ● (the dodge as one more hit), Toll 1 ● (the dancer).

#### Waking bell · bell · uncommon
- **Card:** Bell. Fits Monk, Cleric, Stormcaller. MP regen +1. The first time in a fight that an ally is Silenced, the Silence is lifted at once. A cast it broke is still lost.
- **Numbers:** MP regen +1 (3,000). Once a fight, any ally, the holder included. It saves the rest of the 16 ticks, not the wind-up the Silence interrupted.
- **Hooks:** the piece's status: `status_gained` (silence, whose `holder` and whose `ally`) → `remove` label `debuff`, status `silence`, `to: owner`, with a fight-long marker on the holder.
- **Builds:** Overflow 1 ● (the cliff softened), Lockdown 1 ● (the locks keep coming), Phoenix 1 ● (the reviver).

#### Tempo bell · bell · rare
- **Card:** Bell. Fits Monk, Cleric, Stormcaller. Each time its holder gains Haste, the other ally with the slowest basic attack that isn't Hasted gains it too.
- **Numbers:**
  - Haste at its own numbers.
  - It copies every Haste its holder gains: Flow, Static charge, Allegro, other pieces.
- **Hooks:**
  - The piece's status: `status_gained` (haste) on the holder → `apply` haste, `to:` the other ally with the slowest basic attack, among those that lack haste (**NEW**, the pick shared with the War horn).
  - No fallback when all are Hasted, so two Tempo bells can't pass Haste back and forth.
- **Builds:** Cuts 2 ●●● (Flow and Static charge become a pacer's), Overflow ●.

#### Warding bell · bell · rare
- **Card:** Bell. Fits Monk, Cleric, Stormcaller. Every so often, it lifts one debuff from the ally holding the most.
- **Numbers:**
  - The first lift at tick 11, then every short beat (22 ticks) after: ticks 11, 33, 55, 77 (the offhands ruling; statuses end with each fight, so a lift at the start found nothing).
  - 2 lifts in a regular fight, 3 or 4 in a boss fight.
  - The newest debuff. Doom counts.
- **Hooks:**
  - The piece's status: `fight_start` → `apply` an 11-tick timer. When it ends, the first lift fires and a status with a `pulse` every 22 begins.
  - Each lift: `remove` label `debuff`, count 1, `to: { side: allies, where: { debuffs: true }, pick: highest, by: debuffs }`.
- **Builds:** Toll 2 ●●, Lockdown ●, Pact ●.

#### Bell of the hour · bell · legendary
- **Card:** Bell. Fits Monk, Cleric, Stormcaller. Every so often, its holder's ability with the longest cooldown left comes a few ticks closer.
- **Numbers:**
  - Every 22 ticks, the first at tick 11 (G13; it was every 14), 5 ticks closer: about a fifth more casts, spread over whichever ability is furthest off.
  - A 40-tick fight has 2 beats (ticks 11 and 33), an 80-tick fight 4. Cooldowns carry between fights, so the ticks it buys carry too.
- **Hooks:** the piece's status: a beat at tick 11, then a `pulse` every 22 (as the Warding bell's) → addition 1 (refund 5 ticks) on the holder's ability with the most cooldown left (the selection is addition 14's).
- **Builds:** Overflow 3 ●●, Lockdown 3 ●● (the Monk's Pressure point comes round), Cuts ●.

#### Funeral bell · bell · legendary
- **Card:** Bell. Fits Monk, Cleric, Stormcaller. When any unit falls, friend or foe, every ally still standing gains Fervor. It rings for its holder's own fall too.
- **Numbers:**
  - One Fervor a fall (the second round's ruling), at Fervor's numbers (G4: +5% damage a stack, up to 20, kept all fight and through a knockout). Falls within 2 ticks of each other give one stack between them (G11).
  - A regular fight's three or four kills before the last make +15% to +20% by its end. Each ally's fall gives the survivors +5% more.
  - Once its holder is down, it's silent until it's revived.
- **Hooks:** the piece's status, which survives its holder's knockout: `ko` (whose `any`) → `apply` fervor 1, `to: { side: allies, pick: all }`. A fallen unit's statuses can react to its own `ko` today, so the holder's fall rings.
- **Builds:** Phoenix 3 ●●●, Hunt ●●, Harvest ●: it rings for both sides.

---

## Totem (Bramble knight, Ranger, Geomancer)

The spine's rule: commons lean Armor, Attack, Thorns; uncommons Thorns, a Guard once a fight when its holder drops below half. Under G7 the Guard goes to the first ally to drop below half (Plate keeps the holder's own). The eight: thorns given to whoever draws, a Guard for whoever breaks first, wounds on attackers, stone at the start, Shields that grow, and a hunt with a pack's reward.

#### Standing stone · totem · common
- **Card:** Totem. Fits Bramble knight, Ranger, Geomancer. Armor +2.
- **Numbers:** Armor +2 (2,000).
- **Hooks:** stats only.
- **Builds:** Landslide 1 ● (Earthen shell and Rockfall read Armor), Toll 1 ●.

#### Hawthorn fetish · totem · common
- **Card:** Totem. Fits Bramble knight, Ranger, Geomancer. Attack +1, Thorns medium.
- **Numbers:** Attack +1 (1,000), Thorns medium (150).
- **Hooks:** stats only.
- **Builds:** Toll 1 ● (Thorns), Hunt 1 ● (the Ranger's Attack).

#### Spinebark pole · totem · uncommon
- **Card:** Totem. Fits Bramble knight, Ranger, Geomancer. Armor +1. At the start of every fight, the ally with the highest Aggro gains Thorns for the fight.
- **Numbers:**
  - Armor +1 (1,000).
  - Thorns medium (150), all fight, on whoever draws most: the Bramble knight itself, or a Ranger's or Geomancer's wall.
- **Hooks:**
  - The piece's status: `fight_start` → `apply` a fight-long, unremovable status that gives Thorns +150, `to: { side: allies, pick: highest, by: { stat: aggro } }`.
  - On the Bramble knight, Briar hears these Thorns like its own.
- **Builds:** Toll 1 ●, Landslide 1 ● (the stone wall pricks), Harvest 1 ● (the rod).

#### Bear fetish · totem · uncommon
- **Card:** Totem. Fits Bramble knight, Ranger, Geomancer. Attack +1. The first ally to drop below half its HP each fight is Guarded.
- **Numbers:** Attack +1 (1,000). Guard at its own numbers, once a fight, on whichever ally (the holder included) first drops below half (G7).
- **Hooks:** the piece's status: `hp_lost` (whose `holder` and whose `ally`) → `apply` guard, `to: owner`, only if the owner is now below half (addition 5: a condition on the event's other unit) and the holder lacks a fight-long marker, which the reaction then applies.
- **Builds:** Toll 1 ● (the anchor's first crack), Pact 1 ● (low and still standing), Phoenix 1 ● (the next to fall, held).

#### Briar totem · totem · rare
- **Card:** Totem. Fits Bramble knight, Ranger, Geomancer. Foes that hit its holder gain a few Bleed.
- **Numbers:**
  - A few Bleed read off the holder's Armor, at 0.7 a point (Briar's own rate): 2.8 on a Geomancer at Armor 4, 2.1 on a Bramble knight at 3, 1.4 on a Ranger at 2.
  - On the Bramble knight it comes on top of Briar's, so its attackers bleed twice.
- **Hooks:** the piece's status: `hit_taken` → `apply` bleed, stacks `{ ratio: 0.0007, stat: armor, of: holder }`, `to: other`.
- **Builds:** Toll 2 ●●●, Cuts ●.

#### Stone totem · totem · rare
- **Card:** Totem. Fits Bramble knight, Ranger, Geomancer. Its holder starts every fight behind a Shield from its Armor.
- **Numbers:**
  - A Shield of half its Armor, under the Shield's own cap.
  - Geomancer: 2,000, capped at 1,500 on HP 3. Bramble knight: 1,500. Ranger: 1,000.
  - Bedrock is lit from the first tick.
- **Hooks:** the piece's status: `fight_start` → `apply` shield, stacks `{ ratio: 0.5, stat: armor, of: holder }`, `to: holder`.
- **Builds:** Landslide 2 ●●● (Bedrock from the first tick), Ambush ●●.

#### Earthmother totem · totem · legendary
- **Card:** Totem. Fits Bramble knight, Ranger, Geomancer. While its holder stands, every Shield an ally gains is a third larger. When an ally's Shield breaks, that ally gains a few Might.
- **Numbers:**
  - +33% to each Shield application. The cap stays the Shield's own, half of max HP (the offhands ruling), so a third larger shows most on the small and middling Shields: Vanguard, Stone totem, the Knight's and the uncommons' Shields at the start.
  - A few Might, flat: 2, on every break, for every ally (the offhands ruling: Might, not Guard, which is the Knight's Grudge). The hammer behind the stone hits harder once the stone is gone.
- **Hooks:**
  - The piece's status gives every ally a per-source aura that ends with the holder: addition 16 (Shields received, a stat beside healing received) at +33, read by each application only.
  - `status_ended` (shield, cause `stacks`, whose `holder` and whose `ally`) → `apply` might 2, `to: owner`.
- **Builds:** Landslide 3 ●●●, Phoenix ●●, Toll ●.

#### Wild hunt totem · totem · legendary
- **Card:** Totem. Fits Bramble knight, Ranger, Geomancer. Its holder's basic attacks Mark their target. Each time a foe falls, every ally gains a few Might.
- **Numbers:**
  - Marked as G2 sets it: 14 ticks, Refresh, and one Mark for the holder at a time, so each basic attack moves it to the foe just hit. The party's basic attacks follow the holder's latest target.
  - On a Ranger, Hunter's eye gives its basic attacks Seek, so its Marks land past a Taunting front, but only Seeking basic attacks follow them there (G2).
  - A few Might, flat: 2 for every ally on every foe's fall (6% a stack, spent one an action).
- **Hooks:** the piece's status: `hit_lands` (kind `basic`, whose `holder`) → `apply` marked, `to: other` (addition 2); `ko` (whose `foe`) → `apply` might 2, `to: { side: allies, pick: all }`.
- **Builds:** Hunt 3 ●●●, Ambush ●.

---

## Vial (Assassin, Vampire)

The spine's rule: commons lean Lifesteal, Crit chance, Attack; uncommons crits that heal a little, Lifesteal below half HP. The lead's ruling moves the second to Lifesteal on hits against a bleeding foe. The eight: crits that heal or bleed, a drink from open wounds, abilities paid in blood, a return from the dead, and a price paid at every fight's start.

#### Red tincture · vial · common
- **Card:** Vial. Fits Assassin, Vampire. Lifesteal medium, Attack +1.
- **Numbers:** Lifesteal medium (10%), Attack +1 (1,000).
- **Hooks:** stats only.
- **Builds:** Pact 1 ● (Lifesteal), Cuts 1 ●.

#### Hemlock phial · vial · common
- **Card:** Vial. Fits Assassin, Vampire. Crit +1, Attack +1.
- **Numbers:** Crit chance +1 (3 points), Attack +1 (1,000).
- **Hooks:** stats only.
- **Builds:** Ambush 1 ●, Hunt 1 ●, Cuts 1 ●.

#### Clotting salve · vial · uncommon
- **Card:** Vial. Fits Assassin, Vampire. Crit +1. Its holder's crits heal it for a fifth of the damage they deal.
- **Numbers:** Crit chance +1 (3 points). 20% of each crit's damage as healing. On an Assassin critting a fifth of its hits at ×2, it's about Lifesteal medium's worth.
- **Hooks:** the piece's status: `hit_lands` (tags `crit`, whose `holder`) → `heal` `{ ratio: 0.2, amount: true }`, `to: self`.
- **Builds:** Pact 1 ●, Ambush 1 ●, Hunt 1 ●.

#### Crimson dregs · vial · uncommon
- **Card:** Vial. Fits Assassin, Vampire. Attack +1. Its holder's hits on a bleeding foe heal it for a share of their damage.
- **Numbers:** Attack +1 (1,000). Lifesteal medium (10%) on hits against a bleeding foe, added to any Lifesteal it has (the offhands ruling).
- **Hooks:** the piece's status: `hit_lands` (whose `holder`), where the other has bleed → `heal` `{ ratio: 0.1, amount: true }`, `to: self`. Lifesteal's own shape, on a condition.
- **Builds:** Pact 1 ● (Lifesteal), Cuts 1 ● (Bleed on every hit), Toll 1 ● (Briar's bleeding attackers).

#### Blood vial · vial · rare
- **Card:** Vial. Fits Assassin, Vampire. Its holder's abilities cost half their MP, plus HP equal to their full cost. The HP price never takes it below 1 HP.
- **Numbers:**
  - Frenzy: 450 MP becomes 225 MP and 450 HP (11% of a Vampire at HP 4).
  - Garrote: 325 becomes 163 and 325 HP (16% of an Assassin at HP 2).
  - Blood drain: 125 becomes 63 and 125.
  - The HP is paid as G12 defines it: lost at once, not damage, so no Shield soaks it and nothing reacts to it, and never below 1 HP. A holder at 1 HP casts for half the MP alone.
- **Hooks:** addition 3 (cost −50) and addition 4 (HP as a cost, G12), both through addition 14 on the holder's own abilities.
- **Builds:** Pact 2 ●●●, Phoenix ●.

#### Venom vial · vial · rare
- **Card:** Vial. Fits Assassin, Vampire. Its holder's crits add several Bleed, and it crits more often on a bleeding foe.
- **Numbers:**
  - Several Bleed read off Attack, at 1.3 a point (Lacerate's rate): 6.5 at Attack 5, 5.2 at 4. On the Assassin it doubles Lacerate.
  - Crit chance +5 points (two crit steps) on hits against a bleeding foe.
- **Hooks:** the piece's status: `hit_lands` (tags `crit`, whose `holder`) → `apply` bleed, stacks `{ ratio: 0.0013, stat: attack, of: holder }`, `to: other`; crit chance +5 when the target has bleed: NEW B (crit by a condition on the target).
- **Builds:** Cuts 2 ●●, Hunt ●●, Ambush ●.

#### Vial of the last breath · vial · legendary
- **Card:** Vial. Fits Assassin, Vampire. Once a fight, when its holder falls, it stands up a few ticks later with a third of its HP.
- **Numbers:**
  - 4 ticks later, a third of its max HP, every action on its full cooldown.
  - If the fight is won in those ticks, it stays down; if it was the last standing, the fight is already lost.
- **Hooks:**
  - The piece's status, surviving its holder's knockout: `ko` (whose `holder`), with a fight-long marker → after 4 ticks, `revive`, hp `{ ratio: 0.33, stat: max_hp, of: target }`, `to: holder`.
  - **NEW:** a fallen unit's status that acts on a timer. Today only a fallen unit's reactions to its own `ko` run, so a delay can't. The Phoenix ember needs the same.
- **Builds:** Phoenix 3 ●●● (a return for the Assassin and the Vampire).

#### Bloodlust draught · vial · legendary
- **Card:** Vial. Fits Assassin, Vampire. Its holder starts every fight at half its HP (it pays), and its Lifesteal is doubled until it's full.
- **Numbers:**
  - Above half at a fight's start, it pays down to half; at or below half, it pays nothing.
  - The doubling ends the first time it's healed to full, and doesn't come back that fight.
  - On the Vampire, the draught's doubling and Bloodlust's add, never multiply (the offhands ruling): each adds the Vampire's base Lifesteal once, so below half with both it has three times its base. Lifesteal high (20%) becomes 60%, not 80%.
  - On the Assassin (Lifesteal 0 of its own) it doubles only what gear gives.
- **Hooks:**
  - The piece's status: `fight_start` → an HP price down to 50% (addition 4, as G12 defines it: lost at once, not damage, so no Shield soaks it and nothing reacts to it). It leaves the holder at exactly half, not below, so below-half pieces wake on its first HP lost in the fight.
  - `apply` a status with Lifesteal + the holder's base Lifesteal, removed on `healed` where `hpAtLeast: 100`.
  - Bloodlust's own status must then add the base too, not the current value (it reads the holder's Lifesteal at application today, which would count the draught's). The base is the Lifesteal from the class and gear, before either doubling.
- **Builds:** Pact 3 ●●●, Cuts ●.

---

## Idol (Hexer, Vampire)

The spine's rule: commons lean Siphon, Magic, HP; uncommons MP on a kill, a little Siphon on crits. The lead's ruling moves the second to Rot on crits. The eight: MP from the dead, crits that spoil healing, Weaken on every swing, drained mana passed on, Weaken that binds, and a thief of buffs.

#### Night mask · idol · common
- **Card:** Idol. Fits Hexer, Vampire. Siphon medium, Magic +1.
- **Numbers:** Siphon medium (10%), Magic +1 (1,000).
- **Hooks:** stats only.
- **Builds:** Overflow 1 ●, Pact 1 ● (the drain).

#### Carved effigy · idol · common
- **Card:** Idol. Fits Hexer, Vampire. HP +2.
- **Numbers:** HP +2 (1,000).
- **Hooks:** stats only.
- **Builds:** Pact 1 ● (Blood drain and Blood gift read max HP), Toll 1 ●.

#### Carrion idol · idol · uncommon
- **Card:** Idol. Fits Hexer, Vampire. Magic +1. When its holder's hit fells a foe, it regains MP.
- **Numbers:** Magic +1 (1,000). 15% of its max MP a kill (255 on a pool of 1,700). A kill by a status's tick doesn't count.
- **Hooks:** the piece's status: `ko` (whose `foe`) where the holder dealt the knockout (NEW A) → `mp` `{ ratio: 0.15, stat: max_mp, of: holder }`, `to: holder`.
- **Builds:** Hunt 1 ● (each kill pays), Overflow 1 ●.

#### Fanged idol · idol · uncommon
- **Card:** Idol. Fits Hexer, Vampire. Crit +1. Its holder's crits Rot their target.
- **Numbers:**
  - Crit chance +1 (3 points).
  - Rot at its own numbers (−60% healing received, 20 ticks), on every crit (the offhands ruling).
  - No class applies Rot today; it's the party's answer to foes that heal (Bone Priests, a Regenerator, an enemy Vampire). Its Shields are untouched.
- **Hooks:** the piece's status: `hit_lands` (tags `crit`, whose `holder`) → `apply` rot, `to: other`.
- **Builds:** Hunt 1 ● (the back row's healers), Pact 1 ● (a drain race won).

#### Withering idol · idol · rare
- **Card:** Idol. Fits Hexer, Vampire. One in three of its holder's basic attacks Weakens its target, and its hits on a Weakened foe deal a little more.
- **Numbers:**
  - A 33% chance on each basic attack that lands (the second round's ruling, as the Humbling mace and the Glacial rod), so a lone boss is Weakened in windows, not all fight.
  - Weaken at its own numbers. +15% on the holder's hits, both damage types, against a Weakened foe.
- **Hooks:** the piece's status: `hit_lands` (kind `basic`, whose `holder`) → `apply` weaken, `chance: 33`, `to: other`; a boost on `physical` and `magical`, `{ ratio: 15, when: { has: weaken }, of: target }`.
- **Builds:** Toll 2 ●●, Lockdown 2 ●●, Pact ●.

#### Leech idol · idol · rare
- **Card:** Idol. Fits Hexer, Vampire. Siphon medium. MP it drains past its holder's full pool goes to the ally with the least MP.
- **Numbers:**
  - Siphon medium (10%). On the Hexer, beside its own Siphon medium, 20% in all.
  - The overflow goes to the ally with the least MP as a share of its pool.
- **Hooks:**
  - Siphon's stat at medium; the overflow is Siphon's MP gain past max, sent `to: { side: allies, pick: lowest, by: mp_share }`.
  - **NEW** (small): addition 8's "past full", for an MP gain as well as a heal.
- **Builds:** Overflow 2 ●●●, Pact ●.

#### Idol of binding · idol · legendary
- **Card:** Idol. Fits Hexer, Vampire. Foes its holder Weakens are also Slowed for as long, and its hits on a foe that's both deal half again as much.
- **Numbers:**
  - Slow for as long as the Weaken it came with: 20 ticks, under Slow's own 24 (G1 allows the shorter).
  - +50% on its hits, both types, against a foe that has both (G9: the holder keeps the condition up all fight with a quick Enfeeble or Blood drain, so half again, not double).
  - The Weakens come from Enfeeble (the Hexer's, quick), Blood drain (the Vampire's, quick) and Weaken from other pieces.
- **Hooks:**
  - The piece's status: `status_gained` (weaken, whose `foe`) where the applier is the holder (NEW A) → `apply` slow, duration 20, `to: owner`.
  - A boost `{ ratio: 50, when: { has: [weaken, slow] }, of: target }`.
- **Builds:** Lockdown 3 ●●●, Toll ●●.

#### Idol of the hungry dark ✦ · idol · legendary
- **Card:** Idol. Fits Hexer, Vampire. Every so often, it takes one buff from a foe and gives it to its holder.
- **Numbers:**
  - Every 22 ticks, the first at tick 11 (G13): 2 in a regular fight (ticks 11 and 33), 3 or 4 in a boss fight.
  - The newest buff a foe can lose (passives and Hidden can't be taken), from a random foe holding one. It arrives as it was: its stacks, and its time left.
  - Stolen Taunt makes the holder Taunt. Stolen Bulwark chips on the holder's own hits taken and breaks into a Stun. That's the chaos it's for.
- **Hooks:**
  - The piece's status: a beat at tick 11, then a `pulse` every 22 → take one removable buff from `{ side: foes, where: { buffs: true }, pick: random }` and put it on the holder.
  - **NEW:** moving a status from one unit to another, keeping its stacks and time left. Today `remove` and `apply` can't carry a status's state across.
- **Builds:** exotic: it answers self-buffing bosses (the Hexer's Dispel on a clock) and gives back whatever they had.

---

## CHALLENGES

Each one is settled; the line says by which ruling (`../fill-rulings.md`).
1. **"Short" Taunt and Haste:** settled by G1. Short is half a status's own length: Reveille's Clarity is short, and so are the Haste on Bull's horn and the Weaken on Dazzling lantern. (Bull's horn's Taunt and Mending icon's Regen were short too, until the second round replaced them.)
2. **Warding bell's start beat:** settled by the offhands ruling. The first lift is at tick 11, then every 22.
3. **Phalanx shield, strong everywhere on the Hoplite:** settled by the offhands ruling. The cut holds while the holder is above half its HP.
4. **Idol of binding's double:** settled by G9 and the offhands ruling: half again. G1 also lets its Slow last as long as the Weaken (20 ticks), as the spine wrote.
5. **Earthmother totem's cap:** settled by the offhands ruling. A third larger, with the cap unchanged; a break gives a few Might, not Guard.
6. **Annotated grimoire's loop:** settled by the offhands ruling. A cast it made free doesn't make another.
7. **Fanged idol, a small Leech idol:** settled by the offhands ruling. Its crits add Rot.
8. **Crimson dregs, a small Bloodsworn mail:** settled by the offhands ruling. Lifesteal medium on hits against a bleeding foe.
9. **"Thorns" as an uncommon:** settled by G6 and the offhands ruling. Spinebark pole keeps its target.
10. **Bear fetish repeating the Plate uncommon:** settled by G7. The first ally to drop below half each fight is Guarded.
11. **The lantern's Ward and the bell's Haste at the start** (not raised by me; the lead's): settled by G7. Dazzling lantern takes a short Weaken on the most dangerous foe, and Quickening chime takes a dodge that brings its next basic attack sooner.
12. **The round shield's short Taunt when an ally drops below half** (the lead's, after Red ribbon took that shape on the amulet): settled by G7. Linebreaker takes Attack +1 and +20% on hits against a Taunting foe.

From the second round of rulings:
13. **Gatekeeper's kite repeating Carapace charm** (a Shield at the start): settled by G7 (second round). While its holder Taunts, it takes a tenth less damage.
14. **Bull's horn repeating Clarion blade** (a Taunt at the start, for the Knight): settled by G7 (second round). Attack +1, and the first foe to fall each fight Hastes every ally briefly.
15. **Mending icon repeating Mender's mace** (a Regen at the start, for the Cleric): settled by G7 (second round). Renamed Charnel icon: each foe's fall heals the ally lowest in HP share for 6% of its max HP.
16. **Comrade's targe:** settled by the second round's ruling. The Guard goes to the other ally drawing the most, never the holder.
17. **Ironclad kite's name:** settled by the second round's ruling. It's the Pavise.
18. **Withering idol, Weaken on every swing:** settled by the second round's ruling. One basic attack in three.
19. **Funeral bell's two Fervor a fall:** settled by the second round's ruling and G11. One Fervor a fall, at most one stack every 2 ticks.
20. **Wick's two Heat a fall:** settled by G11. One Heat a fall, at most one stack every 2 ticks.
21. **"Every so often":** settled by G13. Bell of the hour and the Idol of the hungry dark beat at tick 11, then every 22, as the Warding bell does.
22. **HP prices (Blood vial, Bloodlust draught):** settled by G12. Lost at once, not damage, nothing reacts, never below 1 HP. The Blood vial no longer waits; the draught's price no longer wakes below-half pieces.

## NEW

Beyond the spine's list and the physical weapons' lettered needs (I use their NEW A, B and E):
1. **A marker that's neither a buff nor a debuff** (Humbling shield's once per foe). On a foe, a debuff marker counts toward every "with a debuff" and the payoffs per debuff.
2. **A pick by basic-attack interval,** "the slowest basic attack" (War horn, Tempo bell).
3. **An `area` tag** on hits of an action aimed at every foe (Treatise on the field, Signal lantern).
4. **A stat change read live from another stat** (Spiked bulwark: Thorns from Armor, Guard included).
5. **A fallen unit's status acting on a timer** (Vial of the last breath; the Phoenix ember needs the same).
6. **Moving a status** from one unit to another, with its stacks and time left (Idol of the hungry dark).
7. **"Past full" for MP** as well as HP, on addition 8 (Leech idol).
8. **Einherjar as a rule on every revive the Valkyrie makes,** not a field on Valhalla (Shield of the chosen; Bones of the returned's trade). G10 keeps Einherjar as the exception.
9. **A unit condition on rank, "not a boss"** (Last page, after its ruling).

## Least sure

1. **Oathbound shield** against raidwides: one blast can land on the holder two or three times.
2. **The horn leans on the fight's start:** Reveille, War horn and Horn of the charge, three of eight (Bull's horn moved off it in the second round).
3. **Close pairs within a kind,** kept because their triggers differ: Reveille and Echo horn (MP to the neediest, once at the start or on every cast), Abridged lexicon and Annotated grimoire (cheaper own casts, or a free one passed on), Waking bell and Warding bell (one Silence answered, or a debuff lifted on a beat).
4. **Treatise on the field is thin:** among tome holders, only the Frostweaver's Blizzard and two versions hit every foe, and those hits are touch-sized.

Settled by the rulings and dropped from this list: Phalanx shield's strength (the offhands ruling), Mending icon's free Regen (G1 made it short; the second round replaced it), Last page on bosses (the offhands ruling), the Bloodlust draught's multiplied Lifesteal (the offhands ruling), Comrade's targe's reading (the offhands ruling), and the Wild hunt totem's spreading Marks (G2: one Mark per unit).
