# The fill: upgrades and mythics, part 2

Oct 30, 2026. The upgrades and mythics of eight classes, written in full from `spine.md` sections 7 and 8, inside `fill-brief.md`'s rules and ranges: the Hexer, Monk, Assassin, Vampire, Pyromancer, Frostweaver, Stormcaller and Geomancer. 32 entries (8 passives, 24 abilities), each with a power step and two versions (64 versions), and each class's mythic after its four entries (8 mythics). The lists the brief asks for (CHALLENGES, NEW, least sure) are at the end.

## How to read an entry

- **Now:** the line in `docs/core-set/classes.md`, with today's numbers from `content/core-set/classes.ts` in brackets, at the class's own stats (the Hexer at Magic 4; the Monk at Attack 3.7; the Assassin at Attack 5 and Crit chance 20%; the Vampire at HP 4 and Attack 4; the Pyromancer at Magic 5; the Frostweaver and Stormcaller at Magic 4; the Geomancer at Armor 4 and HP 3). Gear moves them.
- **Power step:** the plain step, more of the same, sized by today's training rule (`src/rogue.ts`, `UPGRADE`), as part 1 does:
  - **more** of an amount or of stacks: two fifths more (× 1.4);
  - **cooldown shorter:** a quarter off, which is one word on a medium or long cooldown (30 → 22, 40 → 30);
  - **cheaper:** one rung down the ladder (spells 1,500 / 1,000 / 650 / 450; skills 750 / 500 / 325 / 200).

  Where a version drops what the step grows, the entry says what the step does there instead.
- **A** and **B:** the two versions. Each stands alone against the base and keeps everything of it that it doesn't name. Each gives a **Card** (the ability's text on the training screen), **Numbers** (only what differs from the base), **Hooks** (in `PRIMITIVES.md`'s terms; engine additions by their number in `spine.md` section 1; **NEW** where the list doesn't have it) and **Builds** (the spine's, with what the version does there).
- **Stacks** follow `scale.ts`: an ability adds twice the word per point of its stat (few 1.4 a point, several 2.6, many 4.6), a passive's rider on a hit the word once; a kit's own multiplier (Cold hex × 1.3, Burning fist × 0.6, Frost lance × 0.6, Blizzard × 0.45, Stillness × 0.5, the Stormcaller's Shock × 1.5) stays unless the entry says otherwise.
- **Hits** read off their stat: touch 0.17, light 0.29, normal 0.5, heavy 0.85.
- **Time:** cooldowns quick 14, short 22, medium 30, long 40, very long 56 ticks (moved up to 15% by id, as today); wind-ups quick 1, normal 3, long 6, very long 8.
- **A kit state** is a status a kit keeps on a unit, as Bedrock's and Last rites' are today: shown on the sheet or as an icon, never a new word for the player. Its duration is its own. A status from the vocabulary (Taunt, Hidden, Stun, Haste…) can be applied for less than its own length, never more (the lead's ruling G1): "short" or "a moment" is half its own length.
- **Counters** keep one meaning across every share. Heat (G3): +3% damage a stack, up to 15, kept all fight. This share uses no Marked or Fervor, and nothing in it reshapes a swing (G5).
- **The lead's rulings** (`fill-rulings.md`) are applied: where an entry changed, it says so in its numbers, and the list at the end says which ruling settled each challenge.

---

## Hexer

Magic 4, Attack 3, HP 2, MP 1,700, Siphon medium. Dagger (fast, physical) or rune sword (medium, magical); Mail; idol.

### Cold hex · passive

**Now:** Its basic attacks add a few Chill, whatever weapon it carries; stacks scale from Magic. (3.6 a hit: the word × 1.3, so it can reach a shatter alone.)

**Power step:** more Chill: two fifths more (5.1 a hit). On Hex of flames, two fifths more Burn (3.9 a hit); on Deep cold, two fifths more of its own amount.

**A, Hex of flames**
- **Card:** Its basic attacks add a few Burn, whatever weapon it carries; stacks scale from Magic.
- **Numbers:** no Chill. Burn at Kindling's own size, the word × 1 (2.8 a hit), not Cold hex's × 1.3: Burn has no cap to reach, and the Pyromancer's Kindling stays the bigger (3.5 at Magic 5). On a dagger that's about as much Burn a tick as a Pyromancer on a wand.
- **Hooks:** Cold hex's reaction (`hit_lands`, kind `basic` → `apply` to `other`), Burn for Chill.
- **Builds:** Bonfire (the stoker: a second Kindling on a fast weapon). It leaves Snap.

**B, Deep cold**
- **Card:** Its basic attacks add Chill only to the foe with the most Chill, half again as many; stacks scale from Magic.
- **Numbers:** 5.5 a hit, wherever the attack landed, to the foe with the most Chill (with none chilled, a random foe). A shatter spends that foe's Chill, so the next most-chilled takes over. Half again, not the spine's twice (ruling): at twice, a lone boss shattered about every 10 ticks and was Stunned most of the fight; at half again, about every 14.
- **Hooks:** the same reaction, its `apply` aimed at `{side: foes, pick: highest, by: {stacks: chill}}` in place of `other`.
- **Builds:** Snap (one foe walked to its shatter, then the next, on a count a watcher can follow).

### Malison

**Now:** Adds a few Burn and a few Shock to every foe; stacks scale from Magic. (Short, normal wind-up, 450 MP; 5.6 of each.)

**Power step:** more of both: two fifths more of every stack the cast adds (7.8 Burn and 7.8 Shock; on Plague the Bleed too; on Focused curse 23.5 of each).

**A, Plague**
- **Card:** Adds a few Burn, a few Shock and a few Bleed to every foe; stacks scale from Magic.
- **Numbers:** 5.6 Bleed on each foe. 650 MP (a rung up, for the third status).
- **Hooks:** a third `apply` (Bleed) on the same rule, every foe.
- **Builds:** Cuts (every hit the party lands sets the Bleed off), Harvest (an Area hit sets it off on every foe at once), Toll (the swarm on the wall is already bleeding for the finisher's blows).

**B, Focused curse**
- **Card:** Adds Burn and Shock to the foe with the highest Attack or Magic, three times as many; stacks scale from Magic.
- **Numbers:** 16.8 Burn and 16.8 Shock on that foe (Shock's cap is 40). No Seek: a Taunting foe catches it first, as with Enfeeble.
- **Hooks:** `target: {side: foes, pick: highest, by: {stats: [attack, magic]}}`; stacks × 3.
- **Builds:** Bonfire (the fire started on the foe that matters, where Firebolt and Pyre then aim), Lockdown (the dangerous foe pays for every act it gets).

### Unmake

**Now:** Applies Silence to the casting foe with the highest Attack or Magic and strips its buffs. Waits until a foe is in a wind-up. (Medium, quick wind-up, 650 MP.)

**Power step:** cooldown shorter: medium → short (30 → 22). The same on both versions.

**A, Silence all**
- **Card:** Silences every foe in a wind-up and strips their buffs. Waits until a foe is in a wind-up.
- **Numbers:** as the base, on every casting foe at once.
- **Hooks:** `target: {side: foes, where: {casting: true}, pick: all}` (an all-pick: the Taunt and Hidden rules don't apply).
- **Builds:** Lockdown (against packs of casters, or a boss and its helpers winding up together, one cast stops every cast under way).

**B, Broken spell**
- **Card:** Silences the casting foe with the highest Attack or Magic and strips its buffs. For each buff stripped, that foe takes light magical damage that scales from Magic, and the Hexer regains 200 MP. Waits until a foe is in a wind-up.
- **Numbers:** per buff, a light hit (1,160) and 200 MP. Three buffs return 600 of its 650 MP and deal 3,480; with none, it's the base.
- **Hooks:** a `damage` and an `mp` (to `self`) before the `remove`, each scaled by the number of buffs the target holds. **NEW:** a scale that counts a unit's buffs (Hexweave mail counts debuffs the same way).
- **Builds:** Overflow (a cast that pays for itself, and for the next, against foes that buff).

### Enfeeble

**Now:** Applies Weaken and adds a few Sunder to the foe with the highest Attack or Magic; stacks scale from Magic. (Quick, normal wind-up, 450 MP; 5.6 Sunder.)

**Power step:** more Sunder: two fifths more (7.8). Wither adds none, so there it's a rung cheaper (650 → 450). On Expose, two fifths more of its own stacks (14.6).

**A, Wither**
- **Card:** Weakens every foe.
- **Numbers:** no Sunder. Medium cooldown (was quick), normal wind-up, 650 MP. Weaken keeps its 20 ticks, so every foe is Weakened about two thirds of a fight; on the quick word it would be all of it.
- **Hooks:** `target: {side: foes, pick: all}`; `apply weaken`.
- **Builds:** Toll (the blows keep coming and keep paying the Thorns, each smaller), Lockdown (Weaken as a hold on the whole field).

**B, Expose**
- **Card:** Adds several Sunder to the foe with the lowest HP; stacks scale from Magic.
- **Numbers:** no Weaken. 10.4 Sunder (the cap is 20), so two casts cap the hunted foe. Several, not the spine's many (G8): many reached the cap in one cast. The foe with the lowest current HP, no Seek.
- **Hooks:** `target: {side: foes, pick: lowest, by: hp}`.
- **Builds:** Hunt (the foe about to fall takes more from everyone), Cuts (Sunder lifts every small hit).

### Mythic: The witch-blade

- **Slot:** weapon: fast (5.8 ticks), magical, one hand. Fits the Hexer.
- **Card:** After each ability the Hexer casts, its next three basic attacks hit every foe that holds a debuff.
- **Numbers:** a plain fast weapon's damage (medium base and ratio, from Magic: about 600 a foe at Magic 5), and Magic +1. Each cast sets the count back to three; it doesn't add. Each foe it hits takes a basic attack, so Cold hex lays its Chill and Siphon draws MP on every one.
- **Hooks:** a kit state with three stacks, set to three on `action_resolve` (kind `ability`), one spent on each basic attack; while it holds any, the basic attack's target is `{side: foes, where: {debuffs: true}, pick: all}`. **NEW:** a basic attack with an all-pick whose hits still count as basic attacks. (The other shape is extra strikes on every debuffed foe, the physical weapons share's NEW D, with the mythic naming Cold hex to ride them: part 1's NEW 9.)
- **Pulls toward:** Snap 3 ●●● (Malison's curses make every foe a target, and Cold hex chills them all at once: shatters in chains), Harvest ●●.

---

## Monk

Attack 3.7, HP 3, MP 750, Evasion high (35), Double strike medium (25). Fist weapons (fast) or spear (medium), both physical; Leather; bell.

### Iron palm · passive

**Now:** Its basic attacks, and the second strike of its Double strike, add a few Sunder; stacks scale from Attack. (2.6 a hit.)

**Power step:** more Sunder: two fifths more (3.6 a hit). The same on both versions.

**A, Hundred hands**
- **Card:** Every hit it lands adds a few Sunder: its basic attacks, Double strike's second strike, and its abilities' hits; stacks scale from Attack.
- **Numbers:** 2.6 a hit, Burning fist's three hits and Pressure point's one included.
- **Hooks:** today's two reactions (`hit_lands`, kinds `basic` and `extra`) and a third for kind `ability`.
- **Builds:** Cuts (every hit counts).

**B, Drinking palm**
- **Card:** Its basic attacks, and the second strike of its Double strike, add a few Sunder; stacks scale from Attack. Its hits on a Sundered foe heal it for a tenth of the damage.
- **Numbers:** 10% of the damage dealt (Lifesteal medium's share), on any of its hits on a foe holding Sunder, whoever laid it.
- **Hooks:** a reaction on `hit_lands` (any kind): `heal`, `{ratio: 0.1, amount: true}`, `to: self`, when the event's other unit has Sunder: engine 5, read as a test (part 1's NEW 1, an `if` on reactions).
- **Builds:** Pact (a fist that drinks once the foe is opened: HP bought back through hits).

### Flow

**Now:** Applies Haste to itself. (Long, quick wind-up, 200 MP.)

**Power step:** cooldown shorter: long → medium (40 → 30). On Flow state the Haste is renewed more often; on Stillness of mind the Taunt and Evasion come round sooner.

**A, Flow state**
- **Card:** Applies Haste to itself. While that Haste lasts, every fifth hit it lands renews it, at most twice a cast.
- **Numbers:** a renewal is Haste applied again (its own 20 ticks, Refresh), so Haste's length never changes. Hasted on fist weapons with its Double strike, the Monk lands a hit about every three ticks, so a cast keeps it Hasted about 50 ticks if the hits keep landing (Flow comes back at 40). A Stun or a run of dodged hits lets it lapse.
- **Hooks:** Flow also applies a kit state with two stacks (the renewals). A hit counter (Intensity, cap 5, a stack on each `hit_lands` while Hasted); on `status_capped` it applies Haste, spends a renewal and clears itself. Existing primitives.
- **Builds:** Cuts (the blur that keeps itself going for as long as it keeps hitting).

**B, Stillness of mind**
- **Card:** Taunts for a short while, and raises its Evasion by 35 for 20 ticks. No Haste.
- **Numbers:** a short Taunt: 10 ticks, half its own (G1). Evasion +35 (high) in a kit state for 20 ticks, so the blows that follow the Taunt still miss: with the Monk's own high Evasion, 70, under the cap of 75.
- **Hooks:** `apply taunt`, `duration: 10`; a kit state, Refresh, 20 ticks, `stats: evasion +35`, both `to: self`.
- **Builds:** Toll (the dancer anchor: it draws, then dodges; with a dodge that pays, every miss strikes back).

### Burning fist

**Now:** Three quick hits on the foe with the most Burn; each deals physical damage that scales from Attack and adds a few Burn (three fifths of the word); stacks scale from Attack. (Quick, quick wind-up, 200 MP; each hit 0.11 of Attack; 3.1 Burn a hit, 9.3 a cast.)

**Power step:** more Burn: two fifths more (4.3 a hit). On Frost fist, two fifths more Chill; on Fanned flames, two fifths more on each of the five hits.

**A, Frost fist**
- **Card:** Three quick hits on the foe with the most Chill; each deals physical damage that scales from Attack and adds a little Chill; stacks scale from Attack.
- **Numbers:** Chill at three tenths of the word: 1.55 a hit, 4.7 a cast (a Frost lance lays 6.2). Hits as the base. At Burning fist's size a cast would lay 9.3 Chill, three quarters of a shatter for 200 MP, out-chilling the Frostweaver: the mistake 5g undid when Burning fist out-burned the Pyromancer.
- **Hooks:** `target: {side: foes, pick: highest, by: {stacks: chill}}`; `apply chill`.
- **Builds:** Snap (a fighter that feeds the shatter: the director's Monk run).

**B, Fanned flames**
- **Card:** Five quick, light hits on the foe with the most Burn; each deals physical damage that scales from Attack and adds a little Burn; stacks scale from Attack.
- **Numbers:** five hits of 0.07 of Attack (0.35 in all; the base's three come to 0.33), each adding two fifths of the word (2.1, so 10.4 a cast; the base's 9.3). The same cooldown and cost. Smaller hits lose more to Armor: the price.
- **Hooks:** `hits: 5`.
- **Builds:** Bonfire (the hottest foe fed), Cuts (five hits for the count: riders, Bleed and the Cuts counter).

### Pressure point

**Now:** Has Seek. Deals physical damage that scales from Attack to the foe with the highest Attack or Magic, and applies Stun. (Medium, normal wind-up, 325 MP; a normal hit, 1,850.)

**Power step:** more damage: two fifths more (0.7 of Attack, 2,590). On Vital strike, two fifths more of its amount (1.4 of Attack, 5,180).

**A, Lingering point**
- **Card:** Has Seek. Deals physical damage that scales from Attack to the foe with the highest Attack or Magic, and applies Stun. When that Stun ends, the foe is Slowed.
- **Numbers:** Slow at its own numbers (40% slower for 24 ticks).
- **Hooks:** with the Stun, a kit marker on the foe that lasts the Stun's 8 ticks; on its own `status_ended` (`expired`) it applies Slow to its holder. If the Stun is lifted early, the Slow still comes when the marker ends.
- **Builds:** Lockdown (a window that closes slowly: the foe's next wind-up and swings come late).

**B, Vital strike**
- **Card:** Has Seek. Deals double physical damage that scales from Attack to the foe with the lowest HP. No Stun.
- **Numbers:** 1.0 of Attack (3,700). Double, not the spine's triple (ruling): triple was 2.8 times the Assassin's Backstab on the same target. `target: {side: foes, pick: lowest, by: hp}`, with Seek.
- **Builds:** Hunt (a kill on the beat).

### Mythic: Ember palms

- **Slot:** weapon: fast (6.0 ticks), physical, one hand. Fits the Monk.
- **Card:** Every hit the Monk lands adds a Burn. Every 5 ticks, it gains a Heat for each burning foe, up to three at a time.
- **Numbers:** one Burn a hit (basic attacks, extra strikes and ability hits). Heat as G3 sets it (+3% damage a stack, up to 15, kept all fight): against a pack with three burning it reaches the cap by tick 25; against a lone boss about 8 Heat (24%) at tick 40 and the cap at tick 75. A plain fist weapon's damage (medium base and ratio, from Attack), and Attack +1.
- **Hooks:** a rider on the holder's hits (`riders`: `apply burn`, 1 stack); a pulse every 5 ticks applying Heat to the holder, as many stacks as there are burning foes, at most 3. **NEW:** a scale that counts the units on a side meeting a condition (foes holding Burn).
- **Pulls toward:** Bonfire 3 ●●●, Cuts ●●.

---

## Assassin

Attack 5, HP 2, MP 1,450, Crit chance 5 (20%), Crit damage high (× 2), Evasion medium (20). Dagger (fast) or sword (medium), both physical; Leather; vial.

### Lacerate · passive

**Now:** Each of its crits adds several Bleed to the foe; stacks scale from Attack. (6.5 a crit.)

**Power step:** more Bleed: two fifths more (9.1 a crit). The same on both versions; on Rupture it also makes each crit's re-seeded Bleed, and so the next burst, bigger.

**A, Opening wound**
- **Card:** Its first hit on each foe always crits. Each of its crits adds several Bleed to the foe; stacks scale from Attack.
- **Numbers:** once a foe a fight; a summoned foe is a new foe. The first hit can still be dodged; the next landed hit is then the first.
- **Hooks:** a Per source marker on each foe it has landed a hit on (all fight); hits on a foe without it crit. **NEW B** of the physical weapons share (a crit by a condition of the target; Quietus needs the same).
- **Builds:** Ambush (every foe it reaches opens bleeding from its first blow).

**B, Rupture**
- **Card:** Each of its crits sets off all the foe's Bleed at once, as if the foe were hit until the Bleed closed, then adds several Bleed; stacks scale from Attack.
- **Numbers:** the Bleed's whole worth at once, untyped: 120 a stack, again and again as a third closes each time, until it's gone, about 330 a stack (3,300 for 10 stacks). It reads the stacks left after the crit's own hit has set the Bleed off once. Then Lacerate's several Bleed land as usual, so the next crit has something to set off. No damage is lost against the base, only moved forward: the Bleed comes due now, not over the hits to come.
- **Hooks:** Lacerate's reaction (`hit_lands`, tag `crit`) in order: `damage`, type `none`, `{ratio: 330, stacks: bleed}` read on the event's other unit (engine 5), to `other`; `remove` Bleed from `other`; `apply bleed`.
- **Builds:** Hunt (the burst on the foe being hunted).

### Vanish

**Now:** Applies Hidden to itself. Waits until it isn't Hidden. (Short, quick wind-up, 200 MP; Hidden's own 10 ticks.)

**Power step:** cooldown shorter: a quarter off (22 → 16). One word down (quick, 14) would hide it about 70% of a fight; 5f found that at 85% its allies took every hit. The same on both versions.

**A, Smoke screen**
- **Card:** Hides the ally with the lowest share of HP that isn't Taunting. Waits until an ally is below 80% of its HP.
- **Numbers:** Hidden at its own 10 ticks. It waits for an ally under 80% (the heals' line), so it doesn't hide a full ally at the fight's start.
- **Hooks:** `if: {side: allies, where: {hpBelow: 80}}`; `target: {side: allies, where: {lacks: [taunt, hidden]}, pick: lowest, by: hp_share}`. Engine 17 (Taunt ends Hidden, and Hidden doesn't land on a Taunting unit).
- **Builds:** Phoenix (the fragile one kept out of reach until the turn), Toll (the anchor alone in reach: only Area finds the others).

**B, Shadow step**
- **Card:** Applies Hidden to itself. Waits until it isn't Hidden. Its first hit after that Hidden ends deals triple damage.
- **Numbers:** +200% on one hit, once a Vanish: about twice a regular fight. It can crit on top.
- **Hooks:** a reaction on `status_ended`, Hidden, `expired`: `apply` a kit state to `self` (Fizzle, `boosts` +200 on both damage tags) that removes itself on its next `hit_lands`.
- **Builds:** Ambush (out of the shadows with a blow that lands like three; Vanish first in the slots puts one at the opening).

### Backstab

**Now:** Has Seek. Deals physical damage that scales from Crit chance to the foe with the lowest current HP. (Medium, normal wind-up, 325 MP; a normal hit, 2,000 at 20%.)

**Power step:** more damage: two fifths more (2,800). On From the shadows, two fifths more of its doubled hit.

**A, Coup de grâce**
- **Card:** Has Seek. Deals physical damage that scales from Crit chance to the foe with the lowest current HP. When it knocks that foe out, Backstab is ready again.
- **Numbers:** no limit but MP: 325 a cast, and the Assassin's 1,450 pays for four. A weakened pack falls in a run of knives.
- **Hooks:** engine 5 (the KO's killer and the action that felled it: the physical weapons share's NEW A), engine 1 (made ready).
- **Builds:** Hunt (a kill that resets the hunt). Unlike the Hunting spear, it answers only its own kill, and only itself.

**B, From the shadows**
- **Card:** Has Seek. Waits until the Assassin is Hidden. Deals double physical damage that scales from Crit chance to the foe with the lowest current HP.
- **Numbers:** 1.0 of the Crit-chance scale (4,000 at 20%).
- **Hooks:** `if: {side: self, where: {has: hidden}}`.
- **Builds:** Ambush (Vanish, then the knife: in slot order, the opening is a hidden knife).

### Garrote

**Now:** Has Seek. Deals physical damage that scales from Attack to a random foe that isn't Taunting, and applies Silence. (Medium, quick wind-up, 325 MP; a normal hit, 2,500.)

**Power step:** cheaper: 325 → 200. The same on both versions.

**A, Choke**
- **Card:** Has Seek. Waits until a foe is in a wind-up. Deals physical damage that scales from Attack to the casting foe with the highest Attack or Magic, and applies Silence.
- **Numbers:** as the base.
- **Hooks:** `if: {side: foes, where: {casting: true}}`; `target: {side: foes, where: {casting: true}, pick: highest, by: {stats: [attack, magic]}}`, with Seek.
- **Builds:** Lockdown (an interrupt that waits for the cast, past the front).

**B, Garrote wire**
- **Card:** Has Seek. Deals physical damage that scales from Attack to a random foe that isn't Taunting, applies Rot, and adds several Bleed; stacks scale from Attack. No Silence.
- **Numbers:** Rot at its own numbers (60% less healing for 20 ticks); several Bleed, 13. Several, not the spine's many (G8): many was 23, worth about three times the hit. The target no longer skips Silenced foes.
- **Builds:** Hunt against healers (Rot on what the hunt is killing: the anti-heal nobody had).

### Mythic: Night's edge

- **Slot:** armor. Fits the Assassin.
- **Card:** When the Assassin lands a killing blow, it's Hidden for a moment, and its next hit deals double damage.
- **Numbers:** Hidden for 5 ticks, half its own (G1); it lands only if the Assassin isn't already Hidden, so it never cuts a Vanish short. The next hit after the kill +100% (it can crit on top); a few kills a fight, so the double stands under G9. HP +1 step. (The ruling: the first draft's "every hit from Hidden crits" brought back Shadow strike, which the director retired on Oct 26.)
- **Hooks:** the killing blow it lands (the engine additions gathered: who landed it) → `apply hidden`, `duration: 5`, to self if it lacks Hidden; and a kit state on self (Fizzle, `boosts` +100 on both damage tags) that removes itself on its next `hit_lands`. Engine 17.
- **Pulls toward:** Hunt 3 ●●● (each kill hides it for a breath and makes the next blow land twice as hard), Ambush ●●.

---

## Vampire

HP 4, Attack 4, MP 1,700, Lifesteal high (20%). Fist weapons (fast) or great weapon (slow), both physical; Mail; vial or idol.

### Bloodlust · passive

**Now:** While it's below half of its max HP, its Lifesteal is doubled. (20% → 40%.)

**Power step:** below half, its Lifesteal is two and a half times its own (50%). The same on both versions; on Shared feast the ally's share grows with it.

**A, Shared feast**
- **Card:** While it's below half of its max HP, its Lifesteal is doubled, and each hit it lands heals the other ally with the lowest share of HP as much as it drank.
- **Numbers:** the ally gets the same as the Vampire's own Lifesteal heal (40% of the damage, below half).
- **Hooks:** a reaction on `bloodlust_on`: `hit_lands` → `heal`, `{ratio: 0.01, amount: true, times: {stat: lifesteal, of: holder}}` (Lifesteal's own shape), `to: {side: others, pick: lowest, by: hp_share}`.
- **Builds:** Pact (the donor: life passed from the reckless to the careful).

**B, Undying thirst**
- **Card:** While it's below half of its max HP, its Lifesteal is doubled. Once a fight, when it falls below a tenth of its max HP, for 5 ticks it can't fall below 1 HP and its Lifesteal is tripled.
- **Numbers:** 5 ticks; Lifesteal × 3 (60%) in place of the doubling for those ticks. Once a fight.
- **Hooks:** a reaction on `hp_lost` when it's below 10%, once a fight (a spent marker), applying a kit state for 5 ticks with `lifesteal` and an HP floor. **NEW:** HP that can't fall below 1 while a status holds (Last bastion needs the same).
- **Builds:** Phoenix (the brink as the turn), Pact (low HP as power, then drinking back up).

### Blood drain

**Now:** Deals physical damage that scales from max HP to a random foe, and applies Weaken. (Quick, quick wind-up, 125 MP; 0.4 of max HP, 1,600.)

**Power step:** more damage: two fifths more (0.56 of max HP, 2,240). The same on both: more Lifesteal with it, and on Drain the well more MP.

**A, Bloodletting**
- **Card:** Deals physical damage that scales from max HP to a random foe, and adds several Bleed; stacks scale from max HP. No Weaken.
- **Numbers:** several from max HP: 10.4, the Ranger's Barbed arrow's size. Several, not the spine's many (G8): many was 18.4 every 14 ticks for 125 MP.
- **Builds:** Pact (the claws that keep opening the wound), Cuts (a fast party sets it off hit after hit).

**B, Drain the well**
- **Card:** Deals physical damage that scales from max HP to a random foe, and drains MP from it: a quarter of the damage dealt, given to the ally with the least MP. No Weaken.
- **Numbers:** 25% of the damage dealt (400 for an unmitigated hit). As Siphon does, the ally gains it whether or not the foe had that much.
- **Hooks:** an on-hit reaction for this ability's hit, as Siphon's machinery: `mp`, `{ratio: -0.25, amount: true}` to `other`, and `{ratio: 0.25, amount: true}` to `{side: allies, pick: lowest, by: mp_share}`.
- **Builds:** Overflow (blood that feeds the casters).

### Blood gift

**Now:** Spends a fifth of its max HP to heal the other ally with the lowest share of max HP for as much, and gives it Clarity. Waits until another ally is below 80% of its max HP and the Vampire itself is at 35% of its max HP or more. (Medium, normal wind-up, 450 MP; 800 at HP 4.)

**Power step:** a bigger heal: two fifths more than it pays (1,120 for 800). On Blood for mana, two fifths more MP than it pays; on Lifeblood, the raised ally comes back with two fifths more than it pays.

**A, Blood for mana**
- **Card:** Spends a fifth of its max HP to give the other ally with the least MP as much MP, and gives it Clarity. Waits until another ally is under half its MP and the Vampire is at 35% of its max HP or more.
- **Numbers:** 800 MP and Clarity at HP 4.
- **Hooks:** `if: [{side: others, where: {mpBelow: 50}}, {side: self, where: {hpAtLeast: 35}}]`; `target: {side: others, pick: lowest, by: mp_share}`; `mp` in place of `heal`.
- **Builds:** Overflow (HP turned into a caster's fuel), Pact (life as the party's currency).

**B, Lifeblood**
- **Card:** Waits until an ally is knocked out. Spends a fifth of its max HP to revive it with as much HP. Waits too until the Vampire is at 35% of its max HP or more.
- **Numbers:** very long cooldown and 650 MP (the revives' word and price), normal wind-up. A random knocked-out ally comes back with 800 HP, every action on its full cooldown (the Revive rule). No Clarity.
- **Hooks:** `if: [{side: allies, where: {ko: true}}, {side: self, where: {hpAtLeast: 35}}]`; `target: {side: allies, where: {ko: true}}`; `blood_price`, then `revive`, `hp: {ratio: 0.2, stat: max_hp, of: self}`.
- **Builds:** Phoenix (a revive for a third class, paid in blood).

### Frenzy

**Now:** Adds several Might to itself; stacks scale from Attack. (Medium, quick wind-up, 450 MP; 10.4, Might's cap 15.)

**Power step:** more Might: two fifths more (14.6). On Blood rage, the ally gets the two fifths.

**A, Feeding frenzy**
- **Card:** Adds several Might to itself; stacks scale from Attack. While it holds Might, its Lifesteal is 10 higher.
- **Numbers:** Lifesteal +10 (medium): 30%, and 60% below half under Bloodlust, which doubles the whole stat.
- **Hooks:** Frenzy also applies a kit state (`stats: lifesteal +10`) that a reaction on `status_ended` (Might, on its holder) removes.
- **Builds:** Pact (the bigger the blows, the more it drinks).

**B, Blood rage**
- **Card:** Adds several Might to the other ally with the highest Attack or Magic; stacks scale from the Vampire's Attack.
- **Numbers:** `target: {side: others, pick: highest, by: {stats: [attack, magic]}}`. The other ally, not the spine's "the ally" (ruling): with the Vampire included, it often kept the Might and the version read as the base.
- **Builds:** Landslide (the hammer: Might on one unit, spent by its few, big actions), Cuts.

### Mythic: Thrall's chalice

- **Slot:** offhand. Fits the Vampire.
- **Card:** When an ally falls, the Vampire heals to full. The next time the Vampire lands a killing blow, a fallen ally rises with a quarter of its max HP.
- **Numbers:** the heal is its max HP, on each fall. One rise for each fall this fight, each at a quarter of the risen ally's max HP, every action on its full cooldown (the Revive rule). HP +1 step.
- **Hooks:** a reaction on `ko` (`whose: ally`): `heal` the holder by its `max_hp`, and add a stack to a kit state (the debt). On a killing blow the Vampire lands (engine 5, the KO's killer): spend a stack, `revive` `{side: allies, where: {ko: true}}`, `hp` a quarter of the target's `max_hp`.
- **Pulls toward:** Phoenix 3 ●●● (each fall heals the Vampire and buys a return), Pact ●●.

---

## Pyromancer

Magic 5, HP 2, MP 3,800. Staff (slow, two hands) or wand (fast), both magical; Robes; lantern.

### Kindling · passive

**Now:** Its basic attacks add a few Burn, whatever weapon it carries; stacks scale from Magic. (3.5 a hit.)

**Power step:** more Burn: two fifths more (4.9 a hit). On Wildfire, to each of its two foes; on Searing, two fifths more of the doubled amount.

**A, Wildfire**
- **Card:** Its basic attacks add a few Burn to their target and to a random other foe; stacks scale from Magic.
- **Numbers:** 3.5 on each.
- **Hooks:** Kindling's reaction applies to `other` and to `{side: foes, pick: random}` without the event's other unit (part 1's NEW 5, a reaction's rule that skips the event's other unit).
- **Builds:** Harvest (the field burning together).

**B, Searing**
- **Card:** Its basic attacks add Burn only to the foe with the most Burn, twice as many; stacks scale from Magic.
- **Numbers:** 7 a hit, wherever the attack landed.
- **Hooks:** the reaction's `apply` aimed at `{side: foes, pick: highest, by: {stacks: burn}}`.
- **Builds:** Bonfire (the focus: the hottest foe kept hottest).

### Firebolt

**Now:** Deals magical damage that scales from Magic to the foe with the most Burn, and adds several Burn; stacks scale from Magic. (Quick, normal wind-up, 450 MP; a light hit, 1,450; 13 Burn.)

**Power step:** more Burn: two fifths more (18.2). On Slow burn, two fifths more of its own Burn; on Flash bolt, of its halved Burn (9.1).

**A, Slow burn**
- **Card:** Deals half the magical damage, scaling from Magic, to the foe with the most Burn, and adds half again the Burn; stacks scale from Magic.
- **Numbers:** a hit of 0.145 of Magic (725); 19.5 Burn. Half again, not the spine's twice (ruling): twice was +65% on the Pyromancer's main spell for the 725 of hit it gave up; half again is about +25%, more of it later.
- **Builds:** Bonfire (a fire that lasts).

**B, Flash bolt**
- **Card:** A quick bolt: deals magical damage that scales from Magic to the foe with the most Burn, and adds a few Burn; stacks scale from Magic.
- **Numbers:** quick wind-up (was normal); 225 MP (half; off the ladder, as Blood drain's 125 is); half the Burn (6.5). The hit is the base's.
- **Builds:** Overflow (a cheap cast that keeps the casting rolling), Cuts (the magical torrent).

### Fireball

**Now:** Deals magical damage that scales from Magic to every foe, and adds a few Burn to each; stacks scale from Magic. (Medium, long wind-up, 1,000 MP; a touch, 850 each; 7 Burn each.)

**Power step:** more damage: two fifths more (1,190 each). On both versions, two fifths more of their own hit.

**A, Conflagration**
- **Card:** Deals magical damage that scales from Magic to every foe, and adds several Burn to each; stacks scale from Magic. A longer cooldown.
- **Numbers:** long cooldown (was medium); 13 Burn on each foe, about two fifths more Burn a tick than the base. Several, not the spine's many (G8): many was 23 on every foe, two and a half times the base's rate.
- **Builds:** Bonfire, Harvest (every foe lit deep at once).

**B, Flashfire**
- **Card:** A quick blast: deals magical damage that scales from Magic to every foe, smaller, and adds a little Burn to each; stacks scale from Magic.
- **Numbers:** short cooldown (was medium), quick wind-up (was long), 650 MP. A hit of 0.1 of Magic (500 each) and three fifths of the word in Burn (4.2 each): about four fifths of the base's damage a tick, in more, faster casts.
- **Builds:** Cuts (the magical torrent: more hits on everything, more often), Overflow (casting that never stops).

### Pyre

**Now:** Deals heavy magical damage to the foe with the most Burn; the damage scales from Magic and rises by 200 with each Burn stack on that foe. The Burn stays. (Long, very long wind-up, 1,500 MP; 4,250 plus 200 a stack.)

**Power step:** more damage: two fifths more of both parts (1.19 of Magic, 280 a stack). On Funeral pyre, two fifths more of its halves (140 a stack).

**A, Funeral pyre**
- **Card:** Deals magical damage to every foe; the damage scales from Magic and rises by 100 with each Burn stack on that foe. The Burn stays.
- **Numbers:** half the base on each foe (0.425 of Magic, 2,125, plus 100 a stack), each by its own Burn.
- **Hooks:** `target: {side: foes, pick: all}`; the stacks scale reads each target.
- **Builds:** Harvest (every burning foe pays at once: the director's Wildfire idea).

**B, Pyre of the fallen**
- **Card:** Deals heavy magical damage to the foe with the most Burn; the damage scales from Magic and rises by 200 with each Burn stack on that foe. The Burn stays. Whenever a burning foe falls, Pyre comes 4 ticks closer.
- **Numbers:** 4 ticks a fall, whoever killed it. Bounded by the foes in the fight.
- **Hooks:** a reaction on `ko` (`whose: foe`) when the fallen unit held Burn (engine 5), taking 4 ticks off Pyre's cooldown (engine 1).
- **Builds:** Bonfire (each kill brings the Pyre sooner: the catch comes faster as the fire spreads).

### Mythic: Crown of embers

- **Slot:** amulet. Fits the Pyromancer.
- **Card:** While the Pyromancer stands, every ally's hits add a Burn.
- **Numbers:** one Burn a hit (basic attacks, extra strikes and ability hits) for every ally, the Pyromancer included. It ends when the Pyromancer falls and returns when it's revived. Magic +1.
- **Hooks:** a Per source aura (ends with its source's KO) applied to every ally on `fight_start` and on the Pyromancer's `revived`, carrying a rider: `apply burn`, 1 stack, on every hit.
- **Pulls toward:** Bonfire 3 ●●● (the party as the fire).

---

## Frostweaver

Magic 4, HP 2, MP 2,300. Rod (medium) or staff (slow, two hands), both magical; Robes; tome.

### Shatterpoint · passive

**Now:** When a foe's Chill shatters, that foe takes several Sunder; stacks scale from Magic. (5.2.)

**Power step:** more Sunder: two fifths more (7.3). The same on both versions.

**A, Brittle**
- **Card:** When a foe's Chill shatters, that foe takes several Sunder and is Silenced; stacks scale from Magic.
- **Numbers:** Silence at its own 16 ticks: it outlasts the shatter's 8-tick Stun and loses any wind-up the Stun had paused.
- **Hooks:** today's reaction (`status_capped`, Chill, `whose: foe`) with `apply silence` to `owner`.
- **Builds:** Lockdown (a shatter becomes a full lock: Stunned, then Silenced).

**B, Splinters**
- **Card:** When a foe's Chill shatters, that foe takes several Sunder, and every other foe takes a third of the shatter's damage; stacks scale from Magic.
- **Numbers:** 1,000 untyped to each other foe (a third of 12 × 250).
- **Hooks:** the same reaction with `damage`, type `none`, 1,000, to every foe but `owner` (part 1's NEW 5, a rule that skips the event's unit).
- **Builds:** Harvest (each shatter chips the whole field), Snap.

### Frost lance

**Now:** Deals magical damage that scales from Magic to the foe with the most Chill, and adds several Chill (about half of a shatter at base Magic); stacks scale from Magic. (Quick, normal wind-up, 450 MP; a light hit, 1,160; 6.2 Chill.)

**Power step:** more Chill: two fifths more (8.7). On Ice spear, the same; on Icicles, two fifths more on each lance (4.7).

**A, Ice spear**
- **Card:** Deals magical damage that scales from Magic to the foe with the highest Attack or Magic, adds several Chill and Slows it; stacks scale from Magic.
- **Numbers:** Slow at its own numbers. No Seek: a Taunting foe catches it first.
- **Hooks:** `target: {side: foes, pick: highest, by: {stats: [attack, magic]}}`; `apply slow` after the Chill.
- **Builds:** Lockdown (the dangerous foe held slow, Slow and Chill adding; a hold that bursts only when the Chill reaches 12).

**B, Icicles**
- **Card:** Three lances at the three foes with the most Chill: each deals smaller magical damage that scales from Magic and adds a few Chill; stacks scale from Magic.
- **Numbers:** one lance a foe, fewer with fewer foes. Each a touch (680) and a few Chill at the lance's three fifths (3.4): 10 Chill across three foes, against the base's 6.2 on one. Against a lone boss it's one small lance.
- **Hooks:** `damage` on `{side: foes, pick: highest, by: {stacks: chill}, count: 3}`, one hit each.
- **Builds:** Snap (spread wide: three foes walked toward their shatters together).

### Blizzard

**Now:** Deals magical damage that scales from Magic to every foe, and adds a few Chill to each (a little under half the word); stacks scale from Magic. (Medium, long wind-up, 1,000 MP; a touch, 680 each; 2.5 Chill each.)

**Power step:** more damage: two fifths more (952 each). Whiteout deals none, so there it's two fifths more Chill (7 each). On Avalanche, two fifths more of both its parts.

**A, Whiteout**
- **Card:** Adds a few Chill to every foe, twice as many as Blizzard's; stacks scale from Magic. Deals no damage.
- **Numbers:** 5 Chill on each foe.
- **Builds:** Snap (every foe a step nearer its shatter), Lockdown (the whole field slowed: 5 stacks slow it a fifth).

**B, Avalanche**
- **Card:** Deals magical damage that scales from Magic to every foe, rising by 150 with each Chill stack on that foe. Adds no Chill.
- **Numbers:** 680 plus 150 a stack (2,330 on a foe at 11).
- **Hooks:** a second scale term, `{ratio: 150, stacks: chill}` read on each target.
- **Builds:** Snap (the breaker: biggest on the nearly frozen), Harvest.

### Stillness

**Now:** Applies Clarity to the ally with the least MP among those under half their max MP, or, with nobody under half, the ally with the least, and adds a few Chill to every foe; stacks scale from Magic. (Medium, quick wind-up, 650 MP; 2.8 Chill each.)

**Power step:** cheaper: 650 → 450. The same on both versions.

**A, Deep calm**
- **Card:** Applies Clarity to every ally under half its max MP. Waits until one is. No Chill.
- **Numbers:** Clarity at its own numbers on each.
- **Hooks:** `if: {side: allies, where: {mpBelow: 50}}`; `target: {side: allies, where: {mpBelow: 50}, pick: all}`.
- **Builds:** Overflow (the wellspring).
- **CHALLENGE:** this is the Knight's Rally the well (part 1, Stand fast A) to the word, at three times the price. Two classes reaching the wellspring is fine; one effect on two kits isn't. I'd make Deep calm "Clarity on the ally with the least MP, and Stillness comes round on the short word (22)": a faster single well beside the Knight's wide one.

**B, Frozen moment**
- **Card:** Waits until a foe is in a wind-up. Applies Clarity as before, and adds Chill only to foes in a wind-up, three times as many; stacks scale from Magic.
- **Numbers:** 8.4 Chill on each casting foe (a third slower in its wind-up).
- **Hooks:** `if: {side: foes, where: {casting: true}}`; the Chill's rule `{side: foes, where: {casting: true}, pick: all}`.
- **Builds:** Lockdown (the big cast slowed, so a lock lands in it), Snap.

### Mythic: Glacier's heart

- **Slot:** armor. Fits the Frostweaver.
- **Card:** Whenever a foe's Chill shatters, the Frostweaver puts half of it back: 6 Chill on that foe.
- **Numbers:** 6 Chill (half the cap), whoever's Chill it was. While the Frostweaver is down, nothing. Magic +1.
- **Hooks:** a reaction on `status_ended` (Chill, cause `removed`, `whose: foe`) → `apply chill`, 6 stacks, to `owner`. It listens for the end, not the cap: the party's reactions resolve before the foes', so on the cap the 6 would land on a full Chill a moment before the shatter spends it. (A Cleanse of Chill by a foe would also set it off; rare.)
- **Pulls toward:** Snap 3 ●●● (each shatter after the first comes from half as far: shatters on a beat that speeds up).

---

## Stormcaller

Magic 4, HP 2, MP 2,300. Wand (fast) or rod (medium), both magical; Robes; bell.

### Arc · passive

**Now:** Each of its basic attacks also hits a second, random foe, and adds a few Shock to both; stacks scale from Magic. (4.2 a hit.)

**Power step:** more Shock: two fifths more (5.9 a hit). The same on both versions.

**A, Forked arc**
- **Card:** Each of its basic attacks also hits two other random foes, and adds a few Shock to all three; stacks scale from Magic.
- **Numbers:** two extra strikes at the weapon's damage.
- **Hooks:** `strike` to `{side: foes, pick: random, count: 2, exclude: targets}`: the physical weapons share's NEW D (a strike rule that picks several foes strikes each).
- **Builds:** Harvest.

**B, Static grip**
- **Card:** Each of its basic attacks strikes its target twice, and adds a few Shock with each; stacks scale from Magic.
- **Numbers:** the extra strike goes to the target. Against a lone boss, where Arc has no second foe, it's a second hit the base never had.
- **Hooks:** `strike: {to: target}`, as Double strike's.
- **Builds:** Cuts (two hits a swing), Hunt (all of it on one foe).

### Chain lightning

**Now:** Deals magical damage that scales from Magic to a random foe, then to up to three other random foes, and adds a few Shock to each; stacks scale from Magic. (Quick, quick wind-up, 650 MP; a light hit, 1,160, then touches of 680; 8.4 Shock each.)

**Power step:** more damage: two fifths more on every strike (1,620 and 950). The same on both versions.

**A, Ball lightning**
- **Card:** Lightning strikes the foe with the lowest HP four times: once hard, adding a few Shock, then three smaller strikes. If it falls, the strikes left go to the next lowest; stacks scale from Magic.
- **Numbers:** the base's light and three touches, all on the lowest foe; Shock on the first strike only (8.4), so one cast doesn't stack 34 Shock on one foe. Against a lone boss that's 3,200 a cast where the base deals 1,160.
- **Hooks:** four `damage` effects, each `to: {side: foes, pick: lowest, by: hp}`, so each picks again (the first under the Taunt rule, the rest past it, as extra targets are).
- **Builds:** Hunt.

**B, Recharge**
- **Card:** Deals magical damage that scales from Magic to a random foe, then to up to three other random foes, and adds a few Shock to each; stacks scale from Magic. The Stormcaller regains 120 MP for each foe it hits.
- **Numbers:** 480 back from four foes (a cast nets 170), 120 from a lone one.
- **Hooks:** engine 6 (the count of foes an action hit) → `mp` to `self`.
- **Builds:** Overflow.

### Thunderstorm

**Now:** Deals magical damage that scales from Magic to every foe, and adds a few Shock to each; stacks scale from Magic. (Medium, normal wind-up, 1,000 MP; a touch, 680 each; 8.4 Shock each.)

**Power step:** more damage: two fifths more (952 each). Static field deals none, so there its bolts are two fifths bigger (560).

**A, Supercell**
- **Card:** Deals magical damage that scales from Magic to every foe, 12% more for each foe it hits, and adds a few Shock to each; stacks scale from Magic.
- **Numbers:** +12% a foe hit: four foes +48%, six +72%, eight +96%.
- **Hooks:** engine 6 → a boost on this action, 12 a foe.
- **Builds:** Harvest.

**B, Static field**
- **Card:** For 20 ticks, every foe that lands a hit on an ally takes a bolt of magical damage that scales from Magic. Deals no damage itself and adds no Shock.
- **Numbers:** a bolt of 0.1 of Magic (400; 360 through a minion's resist) a hit. The same cooldown and cost.
- **Hooks:** a Per source kit state on every ally, 20 ticks, shown as an icon: `hit_taken` → `damage`, magical, `{ratio: 0.1, stat: magic, of: source}`, to `other`.
- **Builds:** Toll (the whole line strikes back while it lasts: it follows how often the foes attack). Static mail gives attackers Shock; this deals damage, so the two don't repeat.

### Static charge

**Now:** Applies Haste to itself. (Long, quick wind-up, 650 MP.)

**Power step:** cooldown shorter: long → medium (40 → 30). The same on both versions.

**A, Overcharge**
- **Card:** Applies Haste to itself. While that Haste lasts, its next three abilities cost no MP.
- **Numbers:** three, within Haste's 20 ticks: Hasted, about two Chain lightnings and a Thunderstorm, up to 2,300 MP, a whole pool.
- **Hooks:** a kit state with three stacks, ending with the Haste, carrying MP cost −100 (engine 3, through engine 14), one stack spent on each ability's `action_resolve`.
- **Builds:** Overflow.

**B, Storm shield**
- **Card:** Raises its Thorns by 150 and its Aggro by 40 for 20 ticks. No Haste.
- **Numbers:** Thorns medium; Aggro +40 takes it from 80 to 120, the Knight's draw.
- **Hooks:** a kit state, Refresh, 20 ticks, `stats: thorns +150, aggro +40`.
- **Builds:** Toll, Harvest (the lightning rod).

### Mythic: Eye of the tempest

- **Slot:** weapon: fast (6.6 ticks), magical, one hand. Fits the Stormcaller.
- **Card:** Every hit the Stormcaller lands jumps to one more random foe for half its damage. When a foe falls holding Shock, every other foe gains half of it.
- **Numbers:** a jump is an extra hit at half the hit's damage, to a random foe other than the one just hit; Arc's Shock rides it, and it doesn't jump again. The fallen foe's Shock: half its stacks to each other foe (Shock's cap is 40). A plain wand's damage (from Magic), and Magic +1.
- **Hooks:** engine 9 (a reaction that strikes), sized at half (the physical weapons share's NEW D); engine 5 (the fallen foe's Shock).
- **Pulls toward:** Harvest 3 ●●●.

---

## Geomancer

Armor 4, HP 3, Attack 3, Magic 4, MP 2,300, Crit chance 4 (16%), Crit damage high (× 2). Great weapon (slow, physical, two hands) or rune sword (medium, magical); Plate; totem.

### Bedrock · passive

**Now:** While its Shield pool is above zero, its crit chance is doubled. (16% → 32%.)

**Power step:** more crit damage behind its Shield: +25 (medium), so its crits deal × 2.25 while the Shield holds. The same on both versions (Faultline's triple comes after the Shield is gone, so the step doesn't touch it).

**A, Stunning crits**
- **Card:** While its Shield pool is above zero, its crit chance is doubled and its crits Stun.
- **Numbers:** Stun at its own numbers. At 32% on slow swings and two spells, about two Stuns a regular fight.
- **Hooks:** a reaction on `bedrock_on`: `hit_lands`, tag `crit` → `apply stun` to `other` (Fizzle skips a Stunned foe).
- **Builds:** Lockdown.

**B, Faultline**
- **Card:** While its Shield pool is above zero, its crit chance is doubled. When its Shield breaks, its next hit crits for triple damage.
- **Numbers:** that hit crits at × 3 (the Geomancer's own crit is × 2). A Shield refilled and broken again sets it up again.
- **Hooks:** a reaction on `status_ended` (Shield, cause `stacks`) → a kit state on `self` (`crit_chance +100`, `crit_multiplier +100`) that removes itself on its next `hit_lands`. Its own state, so no crit by target condition.
- **Builds:** Landslide (the break as the blow).

### Earthen shell

**Now:** Applies Shield to itself and to the other ally with the lowest share of max HP; the amount scales from Armor. (Medium, normal wind-up, 650 MP; 1.0 of Armor, 4,000, which passes the cap, half the holder's max HP, on anyone under HP 8.)

**Power step:** bigger Shields: two fifths more (5,600). On Stone skin, two fifths more on every ally (1,960). On the base and Rampart it changes nothing: see CHALLENGE.

**A, Stone skin**
- **Card:** Applies a smaller Shield to every ally; the amount scales from Armor.
- **Numbers:** 0.35 of Armor (1,400): a caster's whole cap, a little over half a Knight's.
- **Hooks:** `target: {side: allies, where: {belowCap: shield}, pick: all}`.
- **Builds:** Landslide (the mason: stone on everyone), Phoenix (the survivors covered).

**B, Rampart**
- **Card:** Applies a Shield twice as big to itself, and Guard. No Shield for an ally.
- **Numbers:** 2.0 of Armor (capped at half its max HP, 1,500 at HP 3); Guard at its own numbers (+3,000 Armor for 28 ticks), which also lifts Rockfall and Tremor, both from Armor, by three quarters while it lasts.
- **Hooks:** `target: self`; `apply shield`, `apply guard`.
- **Builds:** Landslide (the bulwark, and Guard reaching the Armor-scaler), Toll.
- **CHALLENGE:** see the power step's: "twice as big" changes nothing, since the base already fills the Geomancer's cap. I'd make Rampart "Shield and Guard on itself; while that Guard lasts, the first time its Shield breaks it's rebuilt at once": twice the stone in effect, the cap untouched.

**CHALLENGE (the power step):** Earthen shell's 4,000 from Armor 4 already fills the Shield's cap on everyone under HP 8, so "bigger" does nothing on the base, and a status's cap is its own. I'd make the power step "comes round sooner": medium → short (30 → 22).

### Rockfall

**Now:** Deals magical damage that scales from Armor to a random foe. (Short, long wind-up, 450 MP; a normal hit, 2,000.)

**Power step:** more damage: two fifths more (2,800). On both versions, two fifths more of their own hit.

**A, Boulder**
- **Card:** Deals double magical damage that scales from Armor to the foe with the most HP, with a longer wind-up.
- **Numbers:** 1.0 of Armor (4,000). Very long wind-up (was long), and, so a double hit doesn't double the spell's output, a medium cooldown (was short) and 650 MP: about half again the base's damage a tick, in fewer, bigger blows.
- **Hooks:** `target: {side: foes, pick: highest, by: hp}` (the Taunt rule applies).
- **Builds:** Landslide (the heaviest blow, at the biggest foe).

**B, Rockslide**
- **Card:** Deals magical damage that scales from Armor to every foe, half as much.
- **Numbers:** 0.25 of Armor (1,000 each). Medium cooldown (was short), 650 MP, so the earth fighter's sweep stays under the mages' own (Fireball's 850 and Burn on every foe for 1,000).
- **Hooks:** `target: {side: foes, pick: all}`.
- **Builds:** Harvest (a sweep from a fighter), Snap (every Stunned foe hit at once after chain shatters).

### Tremor

**Now:** Deals magical damage that scales from Armor to a random foe, and applies Stun. (Long, very long wind-up, 1,000 MP; a normal hit, 2,000.)

**Power step:** more damage: two fifths more (2,800). On Fissure, two fifths more of both its amounts.

**A, Aftershock**
- **Card:** Deals magical damage that scales from Armor to a random foe, and Stuns every foe for a short while.
- **Numbers:** a short Stun on every foe (4 ticks, as the line asks; see CHALLENGE). Fizzle skips foes already Stunned.
- **Hooks:** `apply stun` to `{side: foes, pick: all}`.
- **Builds:** Lockdown (every foe a window at once), Snap.
- **CHALLENGE:** "a shorter Stun" changes how long Stun lasts, which the status rule forbids. I'd keep the whole Stun (8 ticks) on every foe and move Aftershock to the very long word (56): the field Stunned about a seventh of a fight, in one big window.

**B, Fissure**
- **Card:** Deals magical damage that scales from Armor to a Stunned foe, triple; with no foe Stunned, to a random foe. A shorter wind-up. No Stun.
- **Numbers:** 1.5 of Armor (6,000) on a Stunned foe, 0.5 otherwise. Normal wind-up (was very long), so it lands inside the Stun it aims at.
- **Hooks:** `target: {side: foes, where: {has: stun}, ifNone: any}`; amount `{ratio: 0.5, stat: armor}` plus `{ratio: 1.0, stat: armor}` × `when: {has: stun}` on the target.
- **Builds:** Landslide (the heaviest blow), Snap (the breaker after a shatter).

### Mythic: Mountain's crown

- **Slot:** amulet. Fits the Geomancer.
- **Card:** Each crit the Geomancer lands rebuilds its own Shield by the damage the crit dealt.
- **Numbers:** up to the Shield's cap (half its max HP, 1,500 at HP 3), so one good crit refills it. Armor +1.
- **Hooks:** a reaction on `hit_lands`, tag `crit`: `apply shield`, `{ratio: 1, amount: true}`, `to: self`.
- **Pulls toward:** Landslide 3 ●●● (the crits keep the stone up, and the stone keeps the crits coming).

---

## CHALLENGES

1. **Deep cold** (Cold hex B): "twice the Chill" on a lone boss shatters it about every 10 ticks, Stunned most of the fight. Half again (5.5 a hit).
2. **Expose** (Enfeeble B): many Sunder (18.4) reaches the cap of 20 in one cast. Several (10.4).
3. **Stillness of mind** (Flow B): a short Taunt changes Taunt's duration. The whole Taunt (20) and Evasion +35 for the same 20.
4. **Vital strike** (Pressure point B): unconditional triple is 2.8 times Backstab on the same target. Double.
5. **Garrote wire** (Garrote B): many Bleed is 23 at Attack 5, three times the hit. Several (13).
6. **Bloodletting** (Blood drain A): many Bleed (18.4) on a quick 125-MP cast. Several (10.4).
7. **Blood rage** (Frenzy B): "the ally" includes the Vampire, which often keeps the Might. "The other ally".
8. **Slow burn** (Firebolt A): twice the Burn is +65% on the main spell for a 725 hit. Half again (19.5).
9. **Conflagration** (Fireball A): many Burn (23) on every foe. Several (13).
10. **Deep calm** (Stillness A): the Knight's Rally the well, word for word. Clarity on the least-MP ally on the short word.
11. **Earthen shell's power step:** the base already fills the Shield's cap, so "bigger" does nothing. Comes round sooner (30 → 22).
12. **Rampart** (Earthen shell B): "twice as big" does nothing for the same reason. Rebuilt once when it breaks under its Guard.
13. **Aftershock** (Tremor A): a shorter Stun changes Stun's duration. The whole Stun on every foe, on the very long word.

## NEW

Engine needs beyond the spine's list (several are the same as the other shares'; named so the lead can merge them):
1. **A scale that counts a unit's buffs** (Broken spell); the same for debuffs (Hexweave mail).
2. **A scale that counts the units on a side meeting a condition** (Ember palms: the foes holding Burn).
3. **HP that can't fall below 1 while a status holds** (Undying thirst; Last bastion).
4. **A basic attack with an all-pick whose hits still count as basic attacks** (The witch-blade). The other shape is the physical weapons share's NEW D plus part 1's NEW 9 (a mythic naming Cold hex).
5. **Shared with other shares, used here:** a crit by a condition of the target (the physical weapons share's NEW B: Opening wound); the KO naming its killer (their NEW A: Coup de grâce, Night's edge, Thrall's chalice); a strike rule that hits several foes, and strikes sized at a share (their NEW D: Forked arc, Eye of the tempest); an `if` on reactions that tests the event's other unit (part 1's NEW 1: Drinking palm); a reaction's rule that skips the event's other unit (part 1's NEW 5: Wildfire, Splinters).
6. **Run layer, not engine (as part 1):** passives can be trained, and the power step and a version are two trainings.

## Least sure

- **Flow state** keeps the Monk Hasted almost all fight while it hits; the director cut Flow in the pacing pass when it held Haste two thirds of a fight. Here it's the version's point, and a Stun or dodges break it, but it may be too much.
- **Stillness of mind:** 70% Evasion on a Taunting Monk, with Duelist's leathers or Windrunner's garb, may be an anchor nothing hits.
- **Overcharge** can return a whole pool (2,300) every 40 ticks; it fits "costs that fall" but may make the Stormcaller's MP a non-issue.
- **Silence all** is the base in most fights (one foe casts at a time); it pays only against packs of casters.
- **Focused curse, Searing, Ball lightning and Static grip** concentrate what was spread: against a lone boss each is a straight multiple of the base (×3, ×2, about ×3 and ×2). In a pack they give up the spread; against a boss they give up nothing.
- **The witch-blade:** basic attacks on every cursed foe, with Siphon on each hit, may make the Hexer a mana engine as well as a shatter engine.
- **Night's edge** brings back, on a mythic, the "every hit a crit while Hidden" the director retired in 5c (Shadow strike).
- **Rupture** reads "one hit's worth for every stack" as the Bleed going off once for each stack it holds, which is its whole worth at once (about 330 a stack). Read as one hit's worth in all (120 a stack), it would throw away two thirds of the Bleed and be worse than the base.
- **Heat** at 3% a stack, cap 15, is the formations share's reading; Ember palms is written to it.
- **Flash bolt at 225 MP** is off the ladder, as the line's "half the cost" asks.
- **Static field** sits near the Bramble knight's mythic (Heartwood mail, every hit on an ally sets off its Thorns): one is a 20-tick spell, the other all fight, but both are "the whole party strikes back".
- **Boulder and Rockslide** take the medium cooldown and 650 MP so a double hit or an Area one doesn't double the Geomancer's spell; the line names only the wind-up for Boulder.
