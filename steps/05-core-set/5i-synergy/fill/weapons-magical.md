# The fill: magical weapons

Oct 30, 2026. One share of the fill (`../fill-brief.md`): the five magical weapon kinds, eight pieces each, in the spine's order. The commons and uncommons are new, from the spine's rule for each kind (`spine.md` section 1); the rares and legendaries are the spine's lines (section 2), written in full. The lead's rulings (`../fill-rulings.md`: G1 to G10 and "The magical weapons") are applied: they changed the Humbling mace, Glacial rod, Wildmagic wand and Sunhammer, shortened the start-of-fight Regen and Clarity, and took the wand off Bonfire's first rung.

**How to read the numbers.**
- Every weapon here has damage medium, ratio medium and scales from Magic, as its kind's plain weapon does; no piece changes them, or its kind's speed, damage type or hands.
- Swing sizes are given at Magic 4, before Magic resist (minions 10, elites 15, bosses 25): rune sword about 800, mace 1,030, wand 620, rod 850, staff 1,090.
- Steps: +1 Magic, Attack or Armor is 1,000; +1 HP is 500; +1 MP is 1,000; +1 MP regen is 3,000 (about 21 MP every 4 ticks, 210 in a regular fight); +1 Crit chance is 3%.
- Stacks on a piece read off the wearer's stat the way a passive's do: a few is 0.7 a point (2.8 at Magic 4), several 1.3 (5.2). The flat words are one, a few (2), several (4).
- A status named on a card keeps its own numbers (Ward +40 Magic resist for 30 ticks, Regen 48% of max HP over 24 ticks, Clarity 24% of max MP over 16 ticks, Weaken −30% for 20 ticks, Slow −40% for 24 ticks).
- **"Short" is half the status's own length** (G1). An uncommon's Regen or Clarity at a fight's start is short: Regen 12 ticks (24% of max HP), Clarity 8 ticks (12% of max MP).
- **Hooks** name a status the piece grants (gear `statuses`: applied at the fight's start and again on a revive) and what it does in `PRIMITIVES.md`'s terms.

---

## Rune sword

Fits: Paladin, Valkyrie, Hexer, Geomancer. Medium (8.5 ticks), magical, one hand.

### Runed saber · rune sword · common
- **Card:** +1 Magic, +1 Attack.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:** Magic +1,000, Attack +1,000. The Magic counts twice, since the swing scales from it.
- **Hooks:** stats only.
- **Builds:** Hunt 1 ● and Cuts 1 ●: the Valkyrie's Gale spear (Seek, three hits) scales from Attack.

### Cairn blade · rune sword · common
- **Card:** +1 Magic, +1 Armor.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:** Magic +1,000, Armor +1,000.
- **Hooks:** stats only.
- **Builds:** Landslide 1 ●● (the Geomancer's Earthen shell, Rockfall and Tremor scale from Armor), Toll 1 ● (a front that holds).

### Wayfinder · rune sword · uncommon
- **Card:** +1 Magic. The wearer's basic attacks ignore Taunt.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:** Magic +1,000. Basic attacks pick any foe by draw, Taunting or not. Hidden foes stay out of reach.
- **Hooks:** a granted status with `seek: basic` (Hunter's eye's shape). Existing primitives. The dagger's uncommon has the same effect, which the spine chose; the Hexer can hold either.
- **Builds:** Hunt 1 ●● (the back row, reached), Ambush 1 ● (the volley isn't caught by the front), Lockdown ● (the caster behind a wall).

### Sigil blade · rune sword · uncommon
- **Card:** +1 Armor. At the start of each fight, the wearer gains Ward.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:** Armor +1,000. Ward is its own: +40 Magic resist for 30 ticks, most of a regular fight.
- **Hooks:** a granted status with a reaction on `fight_start` that applies `ward` to the holder. Existing primitives.
- **Builds:** Toll 1 ● (a front that holds against spells), Bonfire 1 ● (the keeper through the early fight), Landslide 1 ● (the Geomancer's Armor).

### Spellbinder · rune sword · rare
- **Card:** After each ability the wearer casts, its next basic attack deals double damage.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:**
  - +100% on the next basic attack. Its extra strikes aren't included.
  - It holds one charge: two casts before a swing still double one swing. A bound swing is about 1,600 at Magic 4.
  - It comes as often as the wearer casts: 3 to 6 times in a regular fight for the Hexer or the Valkyrie. That's the "condition a fight meets a few times" that a double needs, and each one costs MP.
- **Hooks:**
  - A granted status with a reaction on `action_resolve` (kind `ability`) that applies `spellbound` to the holder.
  - `spellbound` is a buff, Fizzle, with boosts on `basic` of +100, and a reaction on `action_resolve` (kind `basic`) that removes it.
  - Existing primitives.
- **Builds:** Overflow 2 ●● (the spellblade's rhythm), Ambush ●, Lockdown ●.

### Bane of the bound · rune sword · rare
- **Card:** The wearer's hits deal half again as much to a foe that is Weakened or Silenced.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:** +50%, a narrow boost, on all its hits: basic attacks and abilities, physical and magical. A foe that's both Weakened and Silenced still gets +50%, not +100%.
- **Hooks:** boosts on `physical` and `magical`, with the pct scaled by `when` on the target having Weaken or Silence: engine 15 ("has any of").
- **Builds:** Lockdown 2 ●●●, Toll ●● (Weaken), Pact ●.

### Hexblade · rune sword · legendary
- **Card:** The wearer's basic attacks add one more stack of each of Burn, Chill, Shock, Bleed and Sunder that their target already holds.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:**
  - One stack of each (flat), and only of the statuses the target holds when the hit lands. A clean foe gets nothing.
  - A Chill added this way can set off a shatter.
  - The wearer swings about 5 times in a regular fight and 8 or 9 in a boss fight.
  - With all five on a foe, a swing is worth about twice its own damage. With two, about half again.
- **Hooks:**
  - A reaction on `hit_lands` (kind `basic`) with five `apply`s to `other`.
  - Each `apply` is sized `{ scale: [{ ratio: 1, when: { has: <status> }, of: "target" }] }`: one stack if the target holds the status, none if not.
  - The engine creates no Intensity status under one stack (`applyStatus`), so an unheld status stays unheld.
  - Existing primitives.
- **Builds:** Snap 2 ●●, Bonfire 2 ●●, Toll ●●, Lockdown ●: a curser's blade, worth something to every status party. It's strongest on the Hexer, whose Cold hex and Malison put three of the five on every foe.

### Dawnblade · rune sword · legendary
- **Card:** Each time an ally falls or is revived, the wearer gains 4 Fervor, one every 2 ticks. Its own fall and return count too. Fervor: the holder deals 5% more damage a stack, up to 20, for the rest of the fight.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:**
  - 4 Fervor an event (the flat word several). Under G11 a counter gains at most one stack every 2 ticks, so the 4 arrive one every 2 ticks, over 8 ticks. Two events close together queue their stacks rather than lose them.
  - **Fervor**, the spine's counter, as G4 sets it:
    - +5% a stack to the holder's hits, physical and magical. It never reaches a status's damage.
    - Capped at 20 stacks (+100%). It never drops and ends with the fight.
    - It survives its holder's knockout, and can't be removed.
  - One fall and its return: +40%. Two of each: +80%.
- **Hooks:**
  - A granted status that survives a knockout.
  - Reactions on `ko` (whose `ally`, and whose `holder`) and on `revived` (whose `ally`, and whose `holder`), each applying `fervor` 4 to the holder.
  - `fervor` is an Intensity buff with boosts on `physical` and `magical` of 5 a stack, cap 20, `survivesKO`, unremovable, shown as an icon.
  - G11's limit has to space a gain of 4 over 8 ticks rather than drop the extra stacks. If it drops them, Dawnblade is one Fervor (+5%) a fall and needs re-sizing (least sure).
  - Existing primitives, plus the spine's counter and G11's limit.
- **Builds:** Phoenix 3 ●●● (strongest the second time round), Pact ●.

---

## Mace

Fits: Cleric, Paladin. Slow (11 ticks), magical, one hand.

### Morningstar · mace · common
- **Card:** +2 Magic.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:** Magic +2,000. It counts twice: in the swing, and in every heal, Burn and Smite that scales from Magic.
- **Hooks:** stats only.
- **Builds:** Bonfire 1 ● (Smite's Burn grows with Magic), Pact 1 ● (Cure's and Absolve's heals).

### Friar's mace · mace · common
- **Card:** +1 HP, +1 MP regen.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:** max HP +500, MP regen +3,000 (about 210 MP in a regular fight).
- **Hooks:** stats only.
- **Builds:** Overflow 1 ● (MP regen commons), Phoenix 1 ● (the reviver's 650-MP Raise).

### Mender's mace · mace · uncommon
- **Card:** +1 HP. At the start of each fight, the ally with the lowest share of max HP gains a short Regen.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:** max HP +500. A short Regen (G1): Regen's 8% of max HP every 4 ticks, for 12 ticks (half its 24), 24% in all. HP carries between fights, so it goes to whoever came out of the last fight worst. With everyone at full, it goes to any ally.
- **Hooks:** a granted status with a reaction on `fight_start` that applies `regen` with `duration: 12` to `{ side: "allies", pick: "lowest", by: "hp_share" }`. Existing primitives.
- **Builds:** Pact 1 ●, Phoenix 1 ● (a member raised low starts the next fight mending), Toll 1 ● (the anchor).

### Prior's mace · mace · uncommon
- **Card:** +1 Magic. At the start of each fight, the ally with the most Aggro gains Ward.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:** Magic +1,000. Ward is its own. Ties for the most Aggro are broken at random.
- **Hooks:** a granted status with a reaction on `fight_start` that applies `ward` to `{ side: "allies", pick: "highest", by: { stat: "aggro" } }`. Existing primitives.
- **Builds:** Toll 1 ● (the anchor), Bonfire 1 ● (the keeper), Harvest 1 ● (the rod that draws the field).

### Humbling mace · mace · rare
- **Card:** One in three of the wearer's basic attacks Weakens its target.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:** a 33% chance on each basic attack that lands (the lead's ruling: one in three, so a lone boss is Weakened in windows, not all fight). Weaken is its own: −30% damage dealt for 20 ticks, Refresh. The mace swings every 11 ticks, about every 15 for a Cleric between casts, so a boss is Weakened about 40% to 45% of the fight.
- **Hooks:** a reaction on `hit_lands` (kind `basic`) that applies `weaken` with `chance: 33` to `other`. Existing primitives.
- **Builds:** Lockdown 2 ●●●, Toll 2 ●●, Pact ●.

### Censer mace · mace · rare
- **Card:** Each of the wearer's basic attacks that lands heals the ally with the lowest share of max HP for a third of the damage it dealt.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:** 33% of the damage dealt, after Magic resist. A 1,030 swing heals about 300. With three or four swings in a regular fight, that's about one Cure.
- **Hooks:** a reaction on `hit_lands` (kind `basic`) that heals `{ scale: [{ ratio: 0.33, amount: true }] }` to `{ side: "allies", pick: "lowest", by: "hp_share" }` (Refrain's shape). Existing primitives.
- **Builds:** Pact 2 ●●, Toll ●● (the anchor kept up), Phoenix ●.

### Sunhammer · mace · legendary
- **Card:** The wearer's basic attacks add a few Burn. When a burning foe falls, the wearer's next basic attack also strikes every other foe, and those strikes add a few Burn too.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:**
  - **The Burn:** a few from Magic, about 2.8 at Magic 4, on each basic attack (the lead's ruling: a few, not the spine's several, inside the rule for a rider on every hit).
  - **The sweep:** one strike on every other foe at the weapon's full damage, about 1,030 each.
    - It's primed once: more burning kills before the swing add nothing.
    - It's spent by the next basic attack.
- **Hooks:**
  - **The Burn:** a reaction on `hit_lands` (kind `basic`) that applies `burn` (a few, Magic of the holder) to `other`.
  - **Priming the sweep:** a reaction on `ko` (whose `foe`) when the fallen foe held Burn as it fell (engine 5) applies `sunburst` to the holder.
  - **`sunburst`** is a Fizzle buff with:
    - `strike` to `{ side: "foes", pick: "all", exclude: "targets" }`;
    - a reaction on `hit_lands` (kind `extra`) that adds a few Burn;
    - a reaction on `action_resolve` (kind `basic`) that removes it.
  - **NEW** (shared with the Chain wand): an extra strike whose rule picks several foes strikes each of them. Today `strikes` takes only the first pick.
- **Builds:** Bonfire 3 ●●●, Harvest ●●.

### Martyr's maul · mace · legendary
- **Card:** The wearer's basic attacks deal more the lower its HP: a quarter more below 70%, half again below 50%, three quarters more below 30%, and double below 10%. Below 30% HP, each basic attack also heals the wearer for the damage it dealt.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:**
  - +25% at each of 70, 50, 30 and 10% of max HP, up to double. G14 makes triple past the ceiling; the spine said up to triple at a tenth. That's nearly even: about +25% for each further fifth of HP lost.
  - The heal is 100% of the damage dealt, after Magic resist.
  - A Cleric (HP 2) at a quarter of its HP swings for about 1,800 and heals about 1,600: from 25% to full in one swing. A Paladin (HP 4) goes from 25% to about 65%.
- **Hooks:**
  - Boosts on `basic`, with the pct as four terms `{ ratio: 25, when: { hpBelow: X }, of: "holder" }` for X = 70, 50, 30 and 10.
  - A reaction on `hit_lands` (kind `basic`) that heals `{ scale: [{ ratio: 1, amount: true }] }` to `{ side: "self", where: { hpBelow: 30 } }`.
  - Existing primitives.
- **Builds:** Pact 3 ●●●, Phoenix ●● (Last rites' Cleric: below 30% its cooldowns halve as well).

---

## Wand

Fits: Pyromancer, Stormcaller, Bard. Fast (6.6 ticks), magical, one hand.

### Whipcrack wand · wand · common
- **Card:** Double strike medium, +1 Magic.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:** Double strike +25%, Magic +1,000.
- **Hooks:** stats only. On the Stormcaller, Arc's reaction to extra strikes Shocks the Double strike's second hit too.
- **Builds:** Cuts 1 ●● (the magical torrent), Harvest 1 ● (the Stormcaller's extra strikes Shock).

### Birch wand · wand · common
- **Card:** +1 Magic, +1 MP.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:** Magic +1,000, max MP +1,000.
- **Hooks:** stats only.
- **Builds:** Overflow 1 ●, Harvest 1 ● (the Area casts). The wand is off Bonfire's first rung (the lead's ruling).

### Jolt wand · wand · uncommon
- **Card:** +1 Magic. The wearer's basic attacks add one Shock.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:** Magic +1,000. One Shock (flat) a basic attack: 80 the next time that foe acts, before it halves. About 6 in a regular fight.
- **Hooks:** a reaction on `hit_lands` (kind `basic`) that applies `shock` 1 to `other`. Existing primitives.
- **Builds:** Toll 1 ● (each foe that strikes pays), Cuts 1 ●, Harvest 1 ●.

### Glint wand · wand · uncommon
- **Card:** +1 Crit chance. When one of the wearer's hits crits, the wearer regains 6% of its max MP.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:**
  - Crit chance +3%: a caster at 5% goes to 8%.
  - 6% of max MP a crit, a Clarity pulse's worth (about 140 on a 2,300 pool).
  - It counts any hit: basic attacks, extra strikes and abilities. An Area caster crits about twice in a regular fight.
- **Hooks:** a reaction on `hit_lands` (tags `crit`) that restores `mp` of `{ scale: [{ ratio: 0.06, stat: "max_mp", of: "holder" }] }` to the holder. Existing primitives.
- **Builds:** Overflow 1 ●●, Harvest 1 ● (Area hits roll many crits), Cuts 1 ●.

### Spark wand · wand · rare
- **Card:** The wearer's basic attacks add a few Burn.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:** a few from Magic: about 2.8 at Magic 4, 2.1 for the Bard at Magic 3. On the Pyromancer it doubles Kindling.
- **Hooks:** a reaction on `hit_lands` (kind `basic`) that applies `burn` (a few, Magic of the holder) to `other` (Kindling's shape). Existing primitives.
- **Builds:** Bonfire 2 ●●● (a Bard or Stormcaller as the stoker), Cuts ●●.

### Chain wand · wand · rare
- **Card:** The wearer's basic attacks also strike two other foes, each for half.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:**
  - Two extra strikes at 50% of the weapon's damage, about 310 each, at two other random foes (fewer if there aren't enough).
  - They're hits of the extra kind: they don't chain, and they carry what the wearer's extra strikes carry, such as the Stormcaller's Arc Shock.
- **Hooks:**
  - A granted status with `strike` to `{ side: "foes", pick: "random", count: 2, exclude: "targets" }`.
  - **NEW:** an extra strike at a share of the weapon's damage.
  - **NEW** (shared with Sunhammer): a strike whose rule picks several foes strikes each of them.
- **Builds:** Harvest 2 ●●●, Cuts ●●, Toll ●.

### Flicker wand · wand · legendary
- **Card:** Double strike high. The wearer's extra strikes add a few Shock.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:**
  - Double strike +40%.
  - A few Shock from Magic, about 2.8 at Magic 4, on each extra strike: Double strike's, and on the Stormcaller Arc's, which adds its own Shock as well.
  - Whipcrack wand's Double strike is the medium stat alone. This piece is the high stat plus the rider.
- **Hooks:** stat `double_strike` +40, and a reaction on `hit_lands` (kind `extra`) that applies `shock` (a few, Magic of the holder) to `other`. Existing primitives.
- **Builds:** Cuts 3 ●●● (the magical torrent), Harvest ●, Toll ●.

### Wildmagic wand ✦ · wand · legendary
- **Card:** Each of the wearer's basic attacks adds a few stacks of a random one of Burn, Chill, Shock, Bleed and Sunder.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:** a few (flat 2), with each of the five equally likely, on the basic attack's target (the lead's ruling: 2, not the spine's one, so it outgrows the Jolt wand's one Shock). About 6 swings in a regular fight, 12 stacks.
- **Hooks:**
  - A reaction on `hit_lands` (kind `basic`) with one `apply` (2 stacks) picked at random from five.
  - **NEW:** pick one effect at random from a list.
  - The fallback with today's primitives is five `apply`s at 20% chance each, rolled apart: one a swing on average, sometimes none, sometimes two. The card would have to say so.
- **Builds:** exotic: a little to every status build, a lot to none.

---

## Rod

Fits: Frostweaver, Stormcaller. Medium (9.1 ticks), magical, one hand.

### Dowsing rod · rod · common
- **Card:** +2 MP regen.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:** MP regen +6,000 (about 42 MP every 4 ticks, 420 in a regular fight).
- **Hooks:** stats only.
- **Builds:** Overflow 1 ●●, Lockdown 1 ● (MP for the locks).

### Ironbark rod · rod · common
- **Card:** +1 Magic, +1 HP.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:** Magic +1,000, max HP +500.
- **Hooks:** stats only.
- **Builds:** Snap 1 ● (the Frostweaver), Harvest 1 ● (an Area mage that lives through the full field).

### Sleet rod · rod · uncommon
- **Card:** +1 Magic. The wearer's basic attacks add one Chill.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:** Magic +1,000. One Chill (flat) a basic attack, about 4 in a regular fight. The Frostweaver's own basic attacks add none.
- **Hooks:** a reaction on `hit_lands` (kind `basic`) that applies `chill` 1 to `other`. Existing primitives.
- **Builds:** Snap 1 ●●, Lockdown 1 ● (the slow on the way up).

### Cistern rod · rod · uncommon
- **Card:** +1 HP. Once a fight, when the wearer has less than a third of its MP (at the fight's start, or after it casts), it gains a short Clarity.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:** max HP +500. A short Clarity whenever it fires (G1, the lead's second-round ruling): Clarity's 6% of max MP every 4 ticks, for 8 ticks (half its 16), 12% in all. Once a fight; a revived wearer can have it again.
- **Hooks:**
  - Reactions on `fight_start` and on `action_resolve` (kind `ability`). Each applies `clarity` with `duration: 8` to `{ side: "self", where: { mpBelow: 33, lacks: "cistern_spent" } }`, then a hidden marker `cistern_spent` to the same.
  - The marker ends with the fight or a knockout.
  - Existing primitives.
- **Builds:** Overflow 1 ●● (the cliff softened), Bonfire 1 ●, Lockdown 1 ●, Harvest 1 ●.

### Glacial rod · rod · rare
- **Card:** One in three of the wearer's basic attacks Slows its target.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:** a 33% chance on each basic attack that lands (the lead's ruling: one in three, so a lone boss is Slowed in stretches, not all fight). Slow is its own: −40% speed in everything for 24 ticks, Refresh, and it adds to Chill's slow. The rod swings every 9.1 ticks, so a boss is Slowed about 60% of the fight.
- **Hooks:** a reaction on `hit_lands` (kind `basic`) that applies `slow` with `chance: 33` to `other`. Existing primitives.
- **Builds:** Lockdown 2 ●●● (a hold that never shatters), Snap ●.

### Lightning rod · rod · rare
- **Card:** When one of the wearer's abilities hits several foes, each of them is hit once more, for a quarter of the damage.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:**
  - A second magical hit on each foe, for 25% of the first hit's damage before Magic resist, so it meets Magic resist once like any hit.
  - It carries none of the ability's statuses. It's a hit, so it can crit, set off Bleed and chip Bulwark.
  - Only abilities whose hits reach two or more foes count: Chain lightning, Thunderstorm, Blizzard.
- **Hooks:**
  - A granted status with a reaction on `hit_lands` (kind `ability`) when the action targets two or more foes (engine 6). The reaction strikes the same foe (engine 9) for a quarter of that hit.
  - **NEW** (small, on engine 9): the reaction strike's amount read from the hit that fired it, before mitigation.
  - The fallback with no NEW is untyped damage of a quarter of the dealt amount (an `amount` scale). That's the same damage, but not a hit.
- **Builds:** Harvest 2 ●●●, Overflow ●.

### Winter's chain · rod · legendary
- **Card:** When a foe's Chill shatters, every other foe gains a few Chill.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:**
  - A few from the wearer's Magic, about 2.8 at Magic 4, on each other foe.
  - It fires for every shatter in the fight, whoever caused it.
  - Chill shatters at 12, so a chain needs the pack already close.
  - Each shatter spends its foe's Chill, so every chain ends.
- **Hooks:** a granted status with a reaction on `status_capped` (status `chill`, whose `foe`) that applies `chill` (a few, Magic of the holder) to every foe but the event's owner. Leaving the owner out reads the event's other unit: engine 5.
- **Builds:** Snap 3 ●●● (chain shatters), Harvest ●●.

### Brimming rod · rod · legendary
- **Card:** Each ability the wearer casts gives the ally with the least MP a tenth of that ability's cost in MP. While the wearer has more than half its MP, its abilities cost a quarter less.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:**
  - 10% of the ability's listed cost: 45 to 100 MP on the Frostweaver's and Stormcaller's kits.
  - It goes to the ally lowest in MP by share, the wearer included.
  - −25% cost while the wearer is at half its MP or more.
- **Hooks:**
  - An MP-cost stat of −25 on the wearer's own abilities, read when it pays, while `mpAtLeast: 50` (engines 3 and 14).
  - A reaction on `action_resolve` (kind `ability`) that restores `mp` to `{ side: "allies", pick: "lowest", by: "mp_share" }`.
  - **NEW** (small): the cast's MP cost readable by a reaction to it, so the gift can be a tenth of it.
- **Builds:** Overflow 3 ●●●, Lockdown ●●.

---

## Staff (two hands)

Fits: Cleric, Frostweaver, Pyromancer, Bramble knight. Slow (11.6 ticks), magical, two hands: the offhand stays empty. Its pieces are worth a weapon and an offhand: commons carry three steps, uncommons two (G16), and rares and legendaries pair two effects or carry a bigger one. Its two uncommons keep their Clarity and Shield at the start; Robes changes its own (G7).

### Ashwood staff · staff · common
- **Card:** +2 Magic, +1 HP.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:** Magic +2,000, max HP +500.
- **Hooks:** stats only.
- **Builds:** Bonfire 1 ● (the Pyromancer), Snap 1 ● (the Frostweaver), Harvest 1 ● (Fireball, Blizzard).

### Moonwater staff · staff · common
- **Card:** +2 MP, +1 Magic.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:** max MP +2,000, Magic +1,000.
- **Hooks:** stats only.
- **Builds:** Overflow 1 ●, Bonfire 1 ● (the hungry casts), Phoenix 1 ● (the Cleric's revives).

### Shepherd's staff · staff · uncommon
- **Card:** +1 Magic, +1 HP. At the start of each fight, the ally with the least MP gains a short Clarity.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:** Magic +1,000, max HP +500. A short Clarity (G1): Clarity's 6% of max MP every 4 ticks, for 8 ticks (half its 16), 12% in all. MP carries between fights, so it goes to whoever spent the most.
- **Hooks:** a granted status with a reaction on `fight_start` that applies `clarity` with `duration: 8` to `{ side: "allies", pick: "lowest", by: "mp_share" }`. Existing primitives.
- **Builds:** Overflow 1 ●●, Bonfire 1 ●, Phoenix 1 ●, Lockdown 1 ●.

### Canopy staff · staff · uncommon
- **Card:** +1 Magic, +1 HP. At the start of each fight, the wearer and the other ally with the least max HP each gain a Shield from the wearer's Magic.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:** Magic +1,000, max HP +500. A Shield of 12% of the wearer's Magic on each: about 480 at Magic 4, 240 for the Bramble knight at Magic 2. Each stays under the Shield's cap of half the holder's max HP.
- **Hooks:** a granted status with a reaction on `fight_start` that applies `shield` (`{ scale: [{ ratio: 0.12, stat: "magic", of: "holder" }] }`) to the holder and to `{ side: "others", pick: "lowest", by: { stat: "max_hp" } }`. Existing primitives.
- **Builds:** Phoenix 1 ●, Bonfire 1 ●, Harvest 1 ●, Ambush 1 ● (the rear guard shielded at the start).

### Banked staff · staff · rare
- **Card:** +1 Magic. The wearer's abilities add half again as many Burn, Chill and Shock stacks.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:**
  - Magic +1,000: one step, since the effect alone is narrow for a two-hander.
  - +50% on its abilities' applications of the three, not on its passives' or its basic attacks'.
  - A Firebolt at Magic 5 adds about 19 Burn (13 today). A Frost lance at Magic 4 adds about 9 Chill (6 today), still short of a shatter alone.
  - No staff wearer's kit adds Shock today; the word stays for versions that might.
- **Hooks:**
  - Engine 14: gear that changes its wearer's own abilities, here their stacks.
  - Today a boost naming a status reaches every application, passives and riders included. Engine 14 narrows it to abilities.
- **Builds:** Bonfire 2 ●●●, Snap 2 ●●, Harvest ●.

### Rootstaff · staff · rare
- **Card:** Thorns medium. The wearer's Thorns heal it for the damage they deal.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:**
  - Thorns +150, untyped, dealt back for each hit taken.
  - It heals 100% of the Thorns damage the wearer deals, its own Thorns included. The Bramble knight (Thorns high, 300) heals 450 for every hit it takes.
- **Hooks:** stat `thorns` +150, and a reaction on `damage_dealt` (status `thorns`) that heals `{ scale: [{ ratio: 1, amount: true }] }` to the holder. Briar listens to the same event. Existing primitives.
- **Builds:** Toll 2 ●●●, Pact ●●.

### Cataclysm staff · staff · legendary
- **Card:** Every third ability the wearer casts is cast twice. The second cast is free.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:**
  - The wearer's casts are counted through the fight. On the third, sixth and so on, the ability resolves again at once.
  - The second cast has no wind-up and no MP cost. It picks its targets afresh by its own rule, so a Raise with nobody left to raise does nothing.
  - The second cast doesn't count toward the next third. Allies' reactions to a cast do hear it.
  - A Pyromancer casts about 5 times in a regular fight: one or two repeats.
- **Hooks:**
  - A granted status keeps the count: a hidden Intensity status, +1 on `action_resolve` (kind `ability`), cleared on the repeat.
  - **NEW:** an effect that resolves the action just cast again, free and without a wind-up.
- **Builds:** Harvest 3 ●●●, Overflow 3 ●●, Bonfire ●●.

### Cinderheart staff ✦ · staff · legendary
- **Card:** The wearer's basic attacks consume their target's Burn and deal at once all the damage it would have dealt.
- **Weapon:** damage medium, ratio medium, from Magic.
- **Numbers:**
  - Burn is 55 a stack every 2 ticks, losing 15% a pulse. That adds up to about 6.4 pulses' worth: about 350 a stack, untyped like Burn's own damage. 20 Burn is a 7,000 flare.
  - The amount is read from Burn's own numbers (its damage a stack × the sum of its decay), so it follows Burn if Burn changes.
  - A target with no Burn takes the swing alone.
- **Hooks:** a reaction on `hit_lands` (kind `basic`) that deals damage of type `none`, `{ scale: [{ ratio: 350, stacks: "burn", of: "target" }] }`, to `other`, then removes `burn` from `other`. Existing primitives.
- **Builds:** the flare against Bonfire's ramp: Bonfire ●● (a fire for short fights), Harvest ●. Exotic in feel.

---

## CHALLENGES

Every item is settled by the lead's rulings (`../fill-rulings.md`) and applied above. Items 1 to 4 are from the first round, 5 to 10 from the second.
1. **Humbling mace and Glacial rod** (a permanent Weaken or Slow on a lone boss): settled by "The magical weapons": one basic attack in three applies it.
2. **Wildmagic wand** (one stack, the uncommon's size): settled by "The magical weapons": a few (2) of the random status a swing.
3. **Uncommon effects repeated on kinds that share wearers** (the staff's against Robes', the Ward at the start on four kinds): settled by G7. The staff, rune sword and mace keep theirs; Robes, Mail and the lantern change.
4. **Section 9's wand uncommons on Bonfire's first rung:** settled by "The magical weapons": the wand is off Bonfire's first rung.
5. **Dawnblade's 4 Fervor at once:** settled by G11 (a counter gains at most one stack every 2 ticks): the 4 arrive one every 2 ticks.
6. **Martyr's maul's triple at a tenth:** settled by G14 (triple is past the ceiling): +25% a step, up to double.
7. **The staff's uncommons at two steps:** settled by G16 (two-handers' uncommons carry two steps and their effect).
8. **Cistern rod's Clarity at full length:** settled by the second round's "Too strong" ruling: short (G1) whenever it fires.
9. **Prior's mace and Canopy staff** changed the spine's table lines (the Ward to the ally drawing most, a second Shield target): settled by "Cards and names": they stand.
10. **Mender's mace against the relic's Mending icon:** settled by "Same cards in two places": the relic changes, and Mender's mace stays.

## NEW

1. An extra strike at a share of the weapon's damage (Chain wand, half).
2. An extra strike whose rule picks several foes strikes each of them (Chain wand's two, Sunhammer's sweep). Today `strikes` takes only the first pick.
3. One effect picked at random from a list (Wildmagic wand). Fallback: five applies at 20% each.
4. Resolving the ability just cast again, free and with no wind-up (Cataclysm staff).
5. A cast's MP cost readable by a reaction to it (Brimming rod's tenth).
6. Engine 9's reaction strike sized from the hit that fired it, before mitigation (Lightning rod). Fallback: an untyped echo through the `amount` scale.

## Least sure

Five of the first list were settled by rulings and are gone: the Censer mace (it stays, for the balance pass to watch), the full Regen and Clarity at the start (short, G1), Fervor's definition (G4), Sunhammer's Burn (a few), and the staff's two-step uncommons (G16).
1. **Brimming rod's gift** of 45 to 100 MP a cast may read as bookkeeping in the log. If it does, a fifth.
2. **Chain wand on the Stormcaller:** every swing hits four foes, all of them Shocked. Beside Stormweave, every swing is an action that hits three or more foes and adds Surge. G11 holds Surge to one stack every 2 ticks, and a wand's 6.6-tick swing stays under that.
3. **Hexblade at one stack** is small, except on the Hexer, which feeds three of the five itself.
4. **Dawnblade under G11:** I read the limit as spacing a gain of 4 over 8 ticks. If the engine drops the extra stacks instead, Dawnblade is one Fervor (+5%) a fall and needs re-sizing.
