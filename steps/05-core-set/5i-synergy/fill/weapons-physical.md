# The fill: the six physical weapon kinds

Oct 30, 2026. One share of the fill (`../fill-brief.md`): the dagger, fist weapons, sword, spear, bow and great weapon, eight pieces each, in the spine's order. For each kind: two commons and two uncommons written from the spine's rule for the kind (`spine.md` section 1), then the spine's two rares and two legendaries (section 2), in full. 48 pieces: 12 common, 12 uncommon, 12 rare, 12 legendary.

## How to read it

- **Weapon** gives the piece's damage and scaling ratio in the kind's words (low, medium or high) and its scaling stat. Every piece is medium, medium, from Attack unless it says otherwise. No piece changes its kind's speed, damage type or hands. Two change how often basic attacks come, through attack speed rather than the kind's speed: Gorged claws below half HP, and Worldbreaker.
- **A plain swing at Attack 4** (medium, medium), for scale: dagger 525 every 5.6 ticks, fist weapons 563 every 6.0, sword 769 every 8.2, spear 881 every 9.4, bow 825 every 8.8, great weapon 1,200 every 12.8.
- **Steps** as `scale.ts` has them: Attack or Armor ±1,000 a step, HP 500 a step, Aggro ±10 a step, Crit chance +3 points for +1 and +5 for +2, special stats at medium (Evasion 20, Accuracy 20, Crit damage +25, Double strike 25, Thorns 150, Lifesteal 10%).
- **Stacks from a stat** read the wearer's stat the way a passive's do: a few is 0.7 a point, several 1.3, many 2.3. So a few is 2.1 at Attack 3, 2.8 at 4, 3.5 at 5.
- **Two-handers** (bow, great weapon) are worth a weapon and an offhand. Their commons carry three steps (the spine's rule). Following the same logic, I gave their uncommons two steps beside the effect, and their rares one or two steps where a single effect is thin.
- **A finding that helps several hooks.** A weapon's own `apply` (statuses attached to its hits) already rides its extra strikes, because an extra strike reuses the basic attack's damage effect (`strikes()` in `fight.ts`). Riders written on the weapon cover "basic attacks and extra strikes" with no new engine. Reactions to `hit_lands` of kind `basic` don't ride extra strikes.
- **Marked** (spine section 1) has no numbers in the spine. Where my pieces use it, I assumed this: it lasts 10 ticks with Refresh, it works inside the Taunt rule (a basic attack without Seek still goes to a Taunting foe), and when several foes are Marked, a basic attack picks among them by draw. See "least sure".
- **Engine additions** are named by their number in `spine.md` section 1. New needs are lettered A to F and gathered under **NEW** at the end.

---

## Dagger (Assassin, Ranger, Hexer): fast, physical, one hand

### Keen dirk · dagger · common
- **Card:** Dagger. Fits Assassin, Ranger, Hexer. Crit chance +2.
- **Weapon:** medium, medium, Attack.
- **Numbers:** Crit chance +5.
- **Hooks:** stats only.
- **Builds:** Cuts 1 (crits open the Assassin's Lacerate), Hunt 1 (Backstab scales from Crit chance), Ambush 1.

### Parrying dagger · dagger · common
- **Card:** Dagger. Fits Assassin, Ranger, Hexer. Evasion medium, Accuracy medium.
- **Weapon:** medium, medium, Attack.
- **Numbers:** Evasion +20, Accuracy +20.
- **Hooks:** stats only.
- **Builds:** Cuts 1 (light bodies that dodge), Toll ● (the dancer).

### Weeping kris · dagger · uncommon
- **Card:** Dagger. Fits Assassin, Ranger, Hexer. Crit chance +1. Its crits add a few Bleed (from Attack).
- **Weapon:** medium, medium, Attack.
- **Numbers:** Crit chance +3. A few Bleed: 2.1 to 3.5 a crit at Attack 3 to 5. On the Assassin it adds to Lacerate's several.
- **Hooks:** a piece status (granted by `statuses`, unremovable, on the sheet) with a reaction: `hit_lands` with tag `crit` → `apply` bleed, stacks 0.7 × Attack (`of: holder`), `to: other`. This is Lacerate's shape.
- **Builds:** Cuts 1, Hunt 1, Ambush ●. See CHALLENGE 1.

### Misericorde · dagger · uncommon
- **Card:** Dagger. Fits Assassin, Ranger, Hexer. Attack +1. Its basic attacks ignore Taunt.
- **Weapon:** medium, medium, Attack.
- **Numbers:** Attack +1,000.
- **Hooks:** a piece status with `seek: "basic"` (the Ranger's Hunter's eye). On the Ranger the effect adds nothing, so there it's only a step.
- **Builds:** Hunt 1 (reach), Ambush 1 (the volley isn't caught by the front), Lockdown ● (the caster behind a wall).

### Notched knife · dagger · rare
- **Card:** Dagger. Fits Assassin, Ranger, Hexer. Its basic attacks and extra strikes add a few Bleed (from Attack).
- **Weapon:** medium, medium, Attack.
- **Numbers:** a few Bleed a hit: 2.1 to 3.5 at Attack 3 to 5. A rider on every hit, so a few and no more. No stats: the effect carries the piece.
- **Hooks:** the weapon's own `apply`: bleed, stacks 0.7 × Attack. It rides the extra strikes as the engine runs today. Bleed lands after the hit, so the next hit bursts it.
- **Builds:** Cuts 2 ●●●, Hunt 2 ●●, Toll ●.

### Marking knife · dagger · rare
- **Card:** Dagger. Fits Assassin, Ranger, Hexer. Attack +1. Its basic attacks Mark their target.
- **Weapon:** medium, medium, Attack.
- **Numbers:** Attack +1,000 (the effect deals nothing by itself, so it's thin for its wearer). Marked uses its own numbers (assumed 10 ticks, Refresh). Because the wearer's own basic attacks follow the Mark, each one refreshes it, so the Mark stays on one foe until that foe falls.
- **Hooks:** addition 2 (Marked), as the weapon's own `apply`.
- **Builds:** Hunt 2 ●●●, Cuts ●.

### Thousandth cut · dagger · legendary
- **Card:** Dagger. Fits Assassin, Ranger, Hexer. Each hit it lands adds a Cut, kept for the rest of the fight, up to 25. Its hits deal 2% more for each Cut.
- **Weapon:** medium, medium, Attack.
- **Numbers:** +2% a Cut on its hits (physical and magical), with a cap of 25 Cuts (+50%) and no decay. Basic attacks, extra strikes and ability hits all count. Status damage is neither counted nor boosted. A dagger unit without Haste or Double strike lands about 7 to 12 hits in a 40-tick fight, so it ends that fight at +14% to +24% and an 80-tick fight at about twice that. A blur (Haste and Double strike) reaches the cap around tick 60, so its 40-tick and 80-tick fights end about half apart.
- **Hooks:** the counter **Cuts**, intensity, cap 25, shown as an icon with its number, with a boost on both damage tags of 2 × its own stacks (`of: holder`). A piece status reacts to `hit_lands` of any kind → `apply` cuts, 1 stack, `to: self`.
- **Builds:** Cuts 3 ●●●, Snap ●● (the Hexer's Cold hex hits), Hunt ●.

### Quietus · dagger · legendary
- **Card:** Dagger. Fits Assassin, Ranger, Hexer. Its hits on a foe that hasn't acted yet this fight always crit, and those crits add twice the usual bonus.
- **Weapon:** medium, medium, Attack.
- **Numbers:** crit chance 100 against such a foe. The crit bonus doubles: ×1.5 becomes ×2, with Crit damage medium ×1.75 becomes ×2.5, and with high ×2 becomes ×3 (the Assassin). A foe's first action comes 20% to 60% into its first interval, so the window is a few ticks per foe. A foe Stunned before it acts stays in the window, and summoned foes enter it.
- **Hooks:** NEW B (crit by a condition on the target: always crit, and a bigger crit bonus) and NEW C (a unit condition, "hasn't acted this fight", false once its first action resolves).
- **Builds:** Ambush 3 ●●●, Hunt ●● (the back row).

---

## Fist weapons (Monk, Vampire): fast, physical, one hand

### Mantis claws · fist weapons · common
- **Card:** Fist weapons. Fits Monk, Vampire. Double strike medium, Evasion medium.
- **Weapon:** medium, medium, Attack.
- **Numbers:** Double strike +25, Evasion +20.
- **Hooks:** stats only.
- **Builds:** Cuts 1 (many hits, light bodies), Toll ● (the dancer).

### Red talons · fist weapons · common
- **Card:** Fist weapons. Fits Monk, Vampire. Lifesteal medium, Attack +1.
- **Weapon:** medium, medium, Attack.
- **Numbers:** Lifesteal 10%, Attack +1,000.
- **Hooks:** stats only.
- **Builds:** Pact 1 (Lifesteal on a fast hitter), Cuts ●.

### Wildcat claws · fist weapons · uncommon
- **Card:** Fist weapons. Fits Monk, Vampire. Attack +1. Hasted when each fight starts.
- **Weapon:** medium, medium, Attack.
- **Numbers:** Attack +1,000. Haste uses its own numbers (+40 speed for 20 ticks, half a regular fight). See CHALLENGE 3 on "short".
- **Hooks:** a piece status: `fight_start` → `apply` haste, `to: holder`.
- **Builds:** Cuts 1, Ambush 1 (the hastened second), Bonfire ● (a stoker), Snap ● (a frost seat that acts often).

### Brass knuckles · fist weapons · uncommon
- **Card:** Fist weapons. Fits Monk, Vampire. Double strike medium. Its extra strikes add a few Sunder (from Attack).
- **Weapon:** medium, medium, Attack.
- **Numbers:** Double strike +25 (the step, so the effect has strikes to ride). A few Sunder an extra strike: 2.6 on the Monk at Attack 3.7, 2.8 at Attack 4. That's about 2 to 4 extra strikes in a regular fight, and Sunder sheds a stack every 4 ticks.
- **Hooks:** a piece status: `hit_lands` of kind `extra` → `apply` sunder, stacks 0.7 × Attack, `to: other` (the second half of Iron palm). On the Monk it stacks with Iron palm's.
- **Builds:** Cuts 1 (an answer to Armor), Hunt ● (Sunder on the quarry), Landslide ● (the party's heavy blows land harder).

### Rime knuckles · fist weapons · rare
- **Card:** Fist weapons. Fits Monk, Vampire. Its basic attacks and extra strikes add a few Chill (from Attack).
- **Weapon:** medium, medium, Attack.
- **Numbers:** a few Chill a hit: 2.6 at Attack 3.7, 2.8 at 4 (Cold hex adds 3.6 at Magic 4). Chill shatters at 12. A Monk whose swings land on one foe shatters it in about 25 ticks by itself. No stats.
- **Hooks:** the weapon's own `apply`: chill, stacks 0.7 × Attack. It rides the extra strikes.
- **Builds:** Snap 2 ●●● (the Monk run), Cuts → Snap (the door), Lockdown ●.

### Gorged claws · fist weapons · rare
- **Card:** Fist weapons. Fits Monk, Vampire. Lifesteal medium. Below half HP, its basic attacks come a third faster.
- **Weapon:** medium, medium, Attack.
- **Numbers:** Lifesteal 10%. Below half HP, attack speed +33: a swing every 4.5 ticks in place of 6. On the Vampire it shares Bloodlust's line (half HP), so both switch on together.
- **Hooks:** the special stat lifesteal, plus a piece status built the way Bloodlust is: `hp_lost` → `apply` a hidden status (attack_speed +33) `to: { side: self, where: { hpBelow: 50 } }`; `healed` → `remove` it at `hpAtLeast: 50`.
- **Builds:** Pact 2 ●●●, Cuts ●●, Phoenix ●.

### Flurry wraps · fist weapons · legendary
- **Card:** Fist weapons. Fits Monk, Vampire. Double strike medium. Its extra strikes can strike again: each one rolls Double strike for one more, at most two more after the first, and each is a fifth weaker than the strike before it.
- **Weapon:** medium, medium, Attack.
- **Numbers:** Double strike +25. A basic attack can bring at most three extra strikes. The chained ones deal 80% and then 64% of a strike. On the Monk (Double strike 50 with these) that's 0.875 extra strikes a swing on average, against 0.5 without the chain. Every chained strike is an extra strike, so it carries what extra strikes carry (Iron palm, Brass knuckles' kind of rider, the weapon's own statuses).
- **Hooks:** addition 10 (extra strikes that chain, on this piece only). The weakening uses NEW D (an extra strike sized as a share of the weapon's damage).
- **Builds:** Cuts 3 ●●●, Snap ●● (more Chill hits), Pact ●● (more drinking).

### Still hand · fist weapons · legendary
- **Card:** Fist weapons. Fits Monk, Vampire. Its hits on a Stunned or Silenced foe always crit and add several Sunder (from Attack). When it Stuns a foe, its ability with the longest cooldown left is ready at once.
- **Weapon:** medium, medium, Attack.
- **Numbers:** crit chance 100 against a Stunned or Silenced foe. Several Sunder a hit: 4.8 at Attack 3.7, 5.2 at 4. This isn't a rider on every hit, only on hits against a held foe. Over a Stun's 8 ticks the Monk lands about 2 swings, their extra strikes and a Burning fist, enough to take Sunder to its cap of 20, which sheds a stack every 4 ticks once the window closes. "Ready" pays no MP: the ability still needs its cost. A shatter's Stun doesn't count for the second sentence, because the Chill applies it to its own holder. Pressure point's own hit lands before its Stun, so that hit doesn't crit.
- **Hooks:** NEW B (crit on a target that has any of Stun or Silence) with addition 15 ("has any of"). The Sunder is a piece status: `hit_lands` → `apply` sunder, stacks 1.3 × Attack (`times` Attack, `when` the target has any of stun or silence), `to: other`. The second sentence is `status_gained` (stun, whose: foe) where the applier is the holder (NEW A) → addition 1 (make ready the holder's ability with the most cooldown left).
- **Builds:** Lockdown 3 ●●●, Snap ●● (a shatter Stuns).

---

## Sword (Knight, Bramble knight, Assassin): medium, physical, one hand

### Arming sword · sword · common
- **Card:** Sword. Fits Knight, Bramble knight, Assassin. Attack +2.
- **Weapon:** medium, medium, Attack.
- **Numbers:** Attack +2,000.
- **Hooks:** stats only.
- **Builds:** Ambush 1, Hunt 1 (the Assassin's sword).

### Gilded sword · sword · common
- **Card:** Sword. Fits Knight, Bramble knight, Assassin. HP +1, Aggro +1.
- **Weapon:** medium, medium, Attack.
- **Numbers:** HP +500, Aggro +10 (a Knight's Aggro of 120 becomes 130, and its draw goes from 157 to 175).
- **Hooks:** stats only.
- **Builds:** Toll 1, Landslide 1 (the blows kept on the stone), Bonfire ● (the keeper), Phoenix ● (the martyr).

### Clarion blade · sword · uncommon
- **Card:** Sword. Fits Knight, Bramble knight, Assassin. HP +1. Taunts when each fight starts.
- **Weapon:** medium, medium, Attack.
- **Numbers:** HP +500. Taunt uses its own numbers (20 ticks, half a regular fight). See CHALLENGE 3. On the Assassin it costs Vanish its first 20 ticks: Taunt ends Hidden, and Hidden doesn't land on a Taunting unit.
- **Hooks:** a piece status: `fight_start` → `apply` taunt, `to: holder`. Addition 17 (Taunt ends Hidden).
- **Builds:** Toll 1 (an anchor from the first tick), Bonfire 1 (the keeper holds the early fight), Landslide ●, Harvest ● (the rod).

### Nettle blade · sword · uncommon
- **Card:** Sword. Fits Knight, Bramble knight, Assassin. Aggro +1. Thorns medium.
- **Weapon:** medium, medium, Attack.
- **Numbers:** Thorns 150 untyped a hit taken (the effect), Aggro +10 (the step). It adds to the Bramble knight's Thorns high (300), and to Briar's Bleed, which fires on Thorns damage.
- **Hooks:** the special stat thorns, plus aggro.
- **Builds:** Toll 1, Harvest ● (the rod draws the field).

### Sweeping blade · sword · rare
- **Card:** Sword. Fits Knight, Bramble knight, Assassin. Its basic attacks also hit a second, random foe for half.
- **Weapon:** medium, medium, Attack.
- **Numbers:** the second hit is half a swing (385 at Attack 4). It's an extra strike, physical, which can be dodged and crit. It ignores Taunt, as every extra target does. No stats.
- **Hooks:** a piece status with `strike` to a second, random foe (`exclude: targets`), sized at half (NEW D).
- **Builds:** Harvest 2 ●●● (the physical route), Cuts ●.

### Drawn steel · sword · rare
- **Card:** Sword. Fits Knight, Bramble knight, Assassin. Crit damage medium. Its first basic attack of each fight comes at once and always crits.
- **Weapon:** medium, medium, Attack.
- **Numbers:** Crit damage +25 (the step, since one crit a fight is thin), so the first swing crits at ×1.75, or ×2.25 on the Assassin. "At once" means the basic attack is ready at tick 0, but an ability that's ready then still goes first, by slot order.
- **Hooks:** addition 1 (make the basic attack's timer ready at `fight_start`). The crit is NEW B by kind: a fight-start status that gives crit chance 100 to `basic` hits and ends on the holder's `action_resolve` of kind `basic`. Without NEW B, a plain crit chance 100 that ends on the first action would also crit an ability that goes first.
- **Builds:** Ambush 2 ●●●, Landslide ● (the first blow).

### Oathkeeper · sword · legendary
- **Card:** Sword. Fits Knight, Bramble knight, Assassin. While it Taunts, its basic attacks also hit every other foe.
- **Weapon:** medium, medium, Attack.
- **Numbers:** each other foe takes a full swing (769 at Attack 4) as an extra strike. These strikes ignore Taunt, reach Hidden foes and can be dodged. Taunt's own 20 ticks from Stand fast or Thicket put it on for about two thirds of a fight.
- **Hooks:** a piece status: `status_gained` (taunt) → `apply` a sweep status; `status_ended` (taunt) → `remove` it. The sweep status has `strike` to every other foe (`side: foes, pick: all, exclude: targets`). That needs NEW D: today a strike takes only the first unit its rule picks.
- **Builds:** Toll 3 ●●●, Harvest 3 ●●● (the rod that sweeps), Landslide ●.

### Gravemark · sword · legendary
- **Card:** Sword. Fits Knight, Bramble knight, Assassin. Its hits on a Marked foe deal half again as much. When a Marked foe falls, the foe with the lowest HP is Marked.
- **Weapon:** medium, medium, Attack.
- **Numbers:** +50% on its hits (both damage types) against a Marked foe. The new Mark is the status's own (assumed 10 ticks, Refresh). Gravemark Marks nothing at the start: the party needs a marker. See "least sure".
- **Hooks:** a boost on both tags, `when: { has: marked }, of: target`. A reaction on `status_ended` (marked, cause `ko`, whose: foe) → `apply` marked to `{ side: foes, pick: lowest, by: hp }`. This works today because a foe's statuses end with cause `ko` just before its `ko` event. Addition 2.
- **Builds:** Hunt 3 ●●● (a kill that resets the hunt).

---

## Spear (Hoplite, Valkyrie, Monk): medium, physical, one hand

### Ironwood spear · spear · common
- **Card:** Spear. Fits Hoplite, Valkyrie, Monk. Armor +1, Attack +1.
- **Weapon:** medium, medium, Attack.
- **Numbers:** Armor +1,000, Attack +1,000.
- **Hooks:** stats only.
- **Builds:** Toll 1, Bonfire 1 (the keeper), Landslide ● (the Hoplite's swings).

### Partisan · spear · common
- **Card:** Spear. Fits Hoplite, Valkyrie, Monk. Crit chance +1, Attack +1.
- **Weapon:** medium, medium, Attack.
- **Numbers:** Crit chance +3, Attack +1,000.
- **Hooks:** stats only.
- **Builds:** Hunt 1, Ambush 1.

### Ox-tongue spear · spear · uncommon
- **Card:** Spear. Fits Hoplite, Valkyrie, Monk. Crit chance +1. Its crits add a few Sunder (from Attack).
- **Weapon:** medium, medium, Attack.
- **Numbers:** Crit chance +3. A few Sunder a crit: 2.6 to 2.8 at Attack 3.7 to 4.
- **Hooks:** a piece status: `hit_lands` with tag `crit` → `apply` sunder, stacks 0.7 × Attack, `to: other`.
- **Builds:** Hunt 1 (Sunder on the quarry), Cuts ● (an answer to Armor), Landslide ●.

### Trophy spear · spear · uncommon
- **Card:** Spear. Fits Hoplite, Valkyrie, Monk. Attack +1. When it lands a killing blow, it's Guarded.
- **Weapon:** medium, medium, Attack.
- **Numbers:** Attack +1,000. Guard uses its own numbers (+3,000 Armor for 28 ticks).
- **Hooks:** `ko` (whose: foe) where the unit that dealt the knockout is the holder (NEW A) → `apply` guard, `to: holder`.
- **Builds:** Hunt 1 (each step safer), Ambush ● (the exposed tail after the volley), Harvest ●.

### Hunting spear · spear · rare
- **Card:** Spear. Fits Hoplite, Valkyrie, Monk. When it lands a killing blow, its ability with the longest cooldown left is ready at once.
- **Weapon:** medium, medium, Attack.
- **Numbers:** one ability a kill. With every ability ready, nothing happens. Ready pays no MP. Kills are capped by the foes on the field. A summoner's adds could feed it, but each cast still costs MP.
- **Hooks:** `ko` (whose: foe) with the holder as the killer (NEW A) → addition 1 (make ready the holder's ability with the most cooldown left).
- **Builds:** Hunt 2 ●●●, Ambush ●● (a second volley), Harvest ●.

### Glaive · spear · rare
- **Card:** Spear. Fits Hoplite, Valkyrie, Monk. Its basic attacks also hit the foe with the most HP for half. If that foe is the target, they hit the foe with the next most.
- **Weapon:** medium, medium, Attack.
- **Numbers:** the second hit is half a swing (441 at Attack 4), an extra strike. On the Hoplite, Phalanx's boost is for basic attacks, so the half comes from the plain swing, not the doubled one.
- **Hooks:** a piece status with `strike` to `{ side: foes, pick: highest, by: hp, exclude: targets }`, sized at half (NEW D).
- **Builds:** Harvest 2 ●●● (evening out), Landslide ●.

### Pike wall · spear · legendary
- **Card:** Spear. Fits Hoplite, Valkyrie, Monk. When a foe hits an ally with less Armor than the wearer, the wearer strikes that foe with its spear.
- **Weapon:** medium, medium, Attack.
- **Numbers:** each strike is a full swing (881 at Attack 4), as an extra strike: physical, and it can crit, be dodged and carry what extra strikes carry. There's no limit as the line is written. See CHALLENGE 2.
- **Hooks:** `hit_taken` (whose: ally), where the ally's Armor is below the holder's (NEW E) → addition 9 (a reaction that strikes, at `other`).
- **Builds:** Toll 3 ●●● (a warden that returns blows aimed at others), Landslide ●●, Bonfire ● (the keeper).

### Storm pike · spear · legendary
- **Card:** Spear. Fits Hoplite, Valkyrie, Monk. Each hit it lands adds a Charge, up to 10. At 10, its next basic attack that lands also calls lightning on every foe (light magical damage, from Attack) and spends the Charges.
- **Weapon:** medium, medium, Attack. The spear's own damage stays physical.
- **Numbers:** the lightning is light: 0.29 × Attack, so 1,160 to each foe at Attack 4 before Magic resist (10, 15 or 25 by rank). That's bigger than a Thunderstorm's touch, free, and comes about once every 30 ticks on a Valkyrie (Gale spear's three hits on a quick cooldown, plus swings). That makes about one storm in a regular fight and two or three in a boss fight. The lightning is a reaction's damage, so it's not a hit: no crit, no Lifesteal, and it adds no Charges (it can't feed itself). Hits that land while the Charges stand at 10 add nothing. Charge has a cap and is spent, so it grows with a fight's length, never compounds.
- **Hooks:** the counter **Charge**, intensity, cap 10, shown. A piece status: `hit_lands` of any kind → `apply` charge 1 to self. `status_capped` (charge) → `apply` a ready status. The ready status: `hit_lands` of kind `basic` → `damage` magical, 0.29 × Attack, to every foe; `remove` charge; `remove` itself.
- **Builds:** Harvest 3 ●●●, Cuts ●●.

---

## Bow (Ranger, Bard): medium, physical, two hands

### Recurve bow · bow · common
- **Card:** Bow, two hands. Fits Ranger, Bard. Attack +2, Crit damage medium.
- **Weapon:** medium, medium, Attack.
- **Numbers:** Attack +2,000, Crit damage +25 (three steps, a two-hander's).
- **Hooks:** stats only.
- **Builds:** Hunt 1, Ambush 1, Overflow ● (the Bard's Refrain gives MP by the damage dealt).

### Yew bow · bow · common
- **Card:** Bow, two hands. Fits Ranger, Bard. Accuracy medium, Crit chance +1, Aggro −1.
- **Weapon:** medium, medium, Attack.
- **Numbers:** Accuracy +20, Crit chance +3, Aggro −10.
- **Hooks:** stats only.
- **Builds:** Hunt 1 (the back row, the dodgers), Cuts ●.

### Skyshot bow · bow · uncommon
- **Card:** Bow, two hands. Fits Ranger, Bard. Attack +1, Accuracy medium. Its abilities have Seek: they get past Taunt.
- **Weapon:** medium, medium, Attack.
- **Numbers:** Attack +1,000, Accuracy +20 (a two-hander's two steps). The Ranger's three arrows get past the front. The Bard's abilities reach every ally or every foe already, so for the Bard it's only the steps.
- **Hooks:** a piece status with `seek: "ability"`.
- **Builds:** Hunt 1 (reach), Lockdown ● (the caster behind a wall), Ambush ●.

### Broadhead bow · bow · uncommon
- **Card:** Bow, two hands. Fits Ranger, Bard. Crit chance +1, Attack +1. Its crits add a few Bleed (from Attack).
- **Weapon:** medium, medium, Attack.
- **Numbers:** Crit chance +3, Attack +1,000. A few Bleed a crit: 2.1 to 2.8 at Attack 3 to 4.
- **Hooks:** a piece status: `hit_lands` with tag `crit` → `apply` bleed, stacks 0.7 × Attack, `to: other`.
- **Builds:** Cuts 1, Hunt 1, Toll ●. See CHALLENGE 1 (the same effect as the Weeping kris, and the Ranger wears both kinds).

### Huntsman's bow · bow · rare
- **Card:** Bow, two hands. Fits Ranger, Bard. Its basic attacks Mark their target. Its hits on a Marked foe deal a third more.
- **Weapon:** medium, medium, Attack.
- **Numbers:** +33% on its hits (both types) against a Marked foe. It pairs two effects, a two-hander's. The Ranger's basic attacks ignore Taunt, so with this bow it Marks past the front, and the party follows wherever the Taunt rule lets it.
- **Hooks:** addition 2, as the weapon's own `apply`. A boost on both tags, `when: { has: marked }, of: target`.
- **Builds:** Hunt 2 ●●●, Ambush ●.

### Frostbite bow · bow · rare
- **Card:** Bow, two hands. Fits Ranger, Bard. Its basic attacks add a few Chill (from Attack). On a foe with 8 or more Chill, they add a few Sunder too.
- **Weapon:** medium, medium, Attack.
- **Numbers:** a few Chill a swing (2.8 at Attack 4). A few Sunder on a foe at 8 to 11 Chill, counting this swing's Chill (2.8 at Attack 4), so the foe is sundered just before it shatters, and the shatter's 3,000 untyped damage lands under that Sunder too.
- **Hooks:** the weapon's own `apply`: chill, stacks 0.7 × Attack, then sunder, stacks 0.7 × Attack `times` a `when` of 8 or more Chill on the target (0 below). The Sunder reads Chill after this swing's Chill lands. The shatter is a reaction that comes after both.
- **Builds:** Snap 2 ●●●, Lockdown ●.

### Volley bow · bow · legendary
- **Card:** Bow, two hands. Fits Ranger, Bard. Its first basic attack of each fight, and every fifth after it, is a volley: it also looses a full arrow at every other foe.
- **Weapon:** medium, medium, Attack.
- **Numbers:** a volley is a swing at every foe (825 each at Attack 4: about 5,000 against six foes). Volleys fall on basic attacks 1, 6, 11 and so on: one in a regular fight, two in a boss fight. The other arrows are extra strikes. They carry the bow's own statuses, but not what reacts to basic attacks (the Bard's Refrain) unless the wearer has Echo charm.
- **Hooks:** a piece status: `fight_start` → `apply` the volley status. The volley status has `strike` to every other foe (NEW D) and is removed on the holder's `action_resolve` of kind `basic`. A hidden count of basic attacks (intensity, cap 5, on the sheet) readies the next volley at `status_capped`.
- **Builds:** Ambush 3 ●●●, Harvest 2 ●●, Cuts ●.

### Executioner's longbow · bow · legendary
- **Card:** Bow, two hands. Fits Ranger, Bard. Its basic attacks ignore Taunt, and deal more the less HP their target has: +25% below three quarters, +50% below half, +75% below a quarter, double below a tenth.
- **Weapon:** medium, medium, Attack.
- **Numbers:** the bonus is on basic attacks only, and it climbs in four steps of 25 to double at a tenth. Ignoring Taunt adds nothing for the Ranger (Hunter's eye), so it pays the Bard more for that half.
- **Hooks:** a piece status with `seek: "basic"`, and a boost on tag `basic` scaled `[{ ratio: 25, when: { hpBelow: 75 } }, { … 50 }, { … 25 }, { … 10 }]`, `of: target`. All of this exists.
- **Builds:** Hunt 3 ●●● (the answer for bosses), Harvest ●● (finishing the field).

---

## Great weapon (Knight, Hoplite, Geomancer, Vampire): slow, physical, two hands

### Bearded axe · great weapon · common
- **Card:** Great weapon, two hands. Fits Knight, Hoplite, Geomancer, Vampire. Attack +1, Crit chance +1, Crit damage medium.
- **Weapon:** medium, medium, Attack.
- **Numbers:** Attack +1,000, Crit chance +3, Crit damage +25.
- **Hooks:** stats only.
- **Builds:** Landslide 1 (big hits that crit before Armor, Bedrock's doubled chance), Ambush ●.

### Poleaxe · great weapon · common
- **Card:** Great weapon, two hands. Fits Knight, Hoplite, Geomancer, Vampire. HP +2, Attack +1.
- **Weapon:** medium, medium, Attack.
- **Numbers:** HP +1,000, Attack +1,000.
- **Hooks:** stats only.
- **Builds:** Pact 1 (the pool it spends), Landslide 1 (max HP into Vanguard and Shield bash), Toll ●.

### Roaring axe · great weapon · uncommon
- **Card:** Great weapon, two hands. Fits Knight, Hoplite, Geomancer, Vampire. Attack +1, Crit damage medium. Starts each fight with a few Might (from Attack).
- **Weapon:** medium, medium, Attack.
- **Numbers:** Attack +1,000, Crit damage +25. A few Might: 2.1 at Attack 3, 2.8 at 4. That's +13% to +17% on its first two or three actions, and on a slow hitter those include its first swings.
- **Hooks:** a piece status: `fight_start` → `apply` might, stacks 0.7 × Attack, `to: holder`.
- **Builds:** Landslide 1 (Might on the slow hitter), Ambush 1 (the first blow).

### Ironbound hammer · great weapon · uncommon
- **Card:** Great weapon, two hands. Fits Knight, Hoplite, Geomancer, Vampire. Attack +1, HP +1. Starts each fight behind a Shield of a fifth of its Attack.
- **Weapon:** medium, medium, Attack.
- **Numbers:** Attack +1,000, HP +500. The Shield is 0.2 × Attack: 600 at Attack 3, 800 at 4, under the cap of half max HP. On the Knight it adds to Vanguard's 0.2 × max HP. On the Geomancer it lights Bedrock from the first tick.
- **Hooks:** a piece status: `fight_start` → `apply` shield, stacks 0.2 × Attack (`of: holder`), `to: holder`.
- **Builds:** Landslide 1 (stone from the first tick), Ambush ● (the party survives its own exposure), Toll ●.

### Icebreaker · great weapon · rare
- **Card:** Great weapon, two hands. Fits Knight, Hoplite, Geomancer, Vampire. Attack +1. Its hits on a Stunned foe deal double.
- **Weapon:** medium, medium, Attack.
- **Numbers:** +100% on all its hits against a Stunned foe. Double is allowed because a fight meets a Stun only a few times. Attack +1,000 is the two-hander's step, since one swing every 12.8 ticks lands in an 8-tick Stun only about two times in three. Shield bash's and Tremor's own hits land before their Stun, so they aren't doubled.
- **Hooks:** a boost on both tags, `when: { has: stun }, of: target`.
- **Builds:** Lockdown 2 ●●●, Snap 2 ●●● (the smash after a shatter), Landslide ●●.

### Heartsplitter · great weapon · rare
- **Card:** Great weapon, two hands. Fits Knight, Hoplite, Geomancer, Vampire. HP +2. Its basic attacks scale from max HP in place of Attack.
- **Weapon:** low damage, high ratio, from max HP.
- **Numbers:** HP +1,000. A swing is (350 + 0.3 × max HP) × 0.8: 1,240 at 4,000 HP, 1,480 at 5,000 and 1,720 at 6,000, against 1,200 for a plain great weapon at Attack 4. It's even at HP 4 and grows by 120 a swing with each HP step, so it's worth a lot where HP is stacked (the Vampire's Mail, the Knight's HP 5) and little elsewhere. The two HP steps are the two-hander's, and the stat it reads.
- **Hooks:** the weapon's scaling stat is `max_hp`, as on today's Heartwood staff.
- **Builds:** Pact 2 ●●●, Landslide 2 ●● (HP into the blow).

### Cornerstone maul · great weapon · legendary
- **Card:** Great weapon, two hands. Fits Knight, Hoplite, Geomancer, Vampire. Its basic attacks deal extra damage equal to half its Shield. Swinging never spends the Shield.
- **Weapon:** medium, medium, Attack, plus half the wearer's current Shield on every swing.
- **Numbers:** a Shield is capped at half max HP, so this adds at most a quarter of max HP to a swing: +1,250 for a Knight at HP 5 with a full Shield, and +750 for a Geomancer at HP 3. The extra is added before crit and mitigation, so Bedrock's crits double it. It also rides any extra strikes, which reuse the swing.
- **Hooks:** the weapon's amount gets a second scale term, `{ ratio: 0.5, stacks: shield, of: self }`. Reading the stacks doesn't spend them, so this exists today.
- **Builds:** Landslide 3 ●●● (the stone becomes the weapon), Ambush ●.

### Worldbreaker · great weapon · legendary
- **Card:** Great weapon, two hands. Fits Knight, Hoplite, Geomancer, Vampire. Its basic attacks come half as often, deal triple, and Stun their target.
- **Weapon:** medium, medium, Attack.
- **Numbers:** attack speed −100 (a swing every 25.6 ticks), +200% on basic attacks, and Stun on each swing that lands (its own 8 ticks, Fizzle). At Attack 4 a swing is 3,600 before crit, every 25.6 ticks: 1.5 times a plain great weapon's damage a tick, and a foe Stunned about a third of the time. Riders on basic attacks fire half as often. It stacks with Phalanx or Millstone (see "least sure").
- **Hooks:** stats `attack_speed` −100, a boost on tag `basic` of +200, and the weapon's own `apply` of stun.
- **Builds:** Landslide 3 ●●● (the heaviest swing), Lockdown 3 ●●.

---

## CHALLENGES

1. **The dagger's uncommon (Weeping kris) is a small Notched knife,** in the same kind: a few Bleed on crits against a few Bleed on every hit. That's the "small and big version of one thing" the brief rules out. It's also the bow's uncommon (Broadhead bow) word for word, and the Ranger wears both kinds. Both are written as the spine has them. The change I'd make: the dagger's uncommon *opens* a wound, so its first hit on each foe adds a few Bleed. That's a different trigger from the Notched knife's, and a different job (starting a wound that others' hits burst). It can be built today: a hidden per-source marker on the foe, and the Bleed's stacks gated by a `when` that the foe lacks it.
2. **Pike wall has no limit.** Each strike is a full swing (881 at Attack 4), several times Thorns high (300). Against a swarm hitting an ally with less Armor, nothing caps it. With a Bramble knight Taunting six wolves beside a Hoplite, that's up to about 35 strikes in a regular fight, around 30,000 damage, against the Hoplite's own 4,000 or so. The change I'd make: the wearer can strike back at most once every 3 ticks, so about 13 strikes in a 40-tick fight. That needs a cooldown on a reaction (NEW F). The other option is striking for a third of a swing.
3. **"A short Haste" and "a short Taunt" at the fight's start** (my Wildcat claws and Clarion blade, and the same words on the leather, round shield, horn and bell uncommons in other shares) would change a status's duration, which the brief forbids. I kept the statuses' own 20 ticks. A free 20-tick Taunt at every fight's start is the Knight's Stand fast without its cost, on an uncommon. The change I'd make: the spine's table says "Haste at the start" and "Taunt at the start", with no "short", and the balance pass watches the Taunt.

## NEW (engine needs beyond the spine's list)

- **A. Who did it.** The `ko` event names the unit whose damage knocked the foe out, and `status_gained` names the applier, each as the event's `other`. A reaction can then require that the other be its holder: a kill the wearer lands, a Stun the wearer applies. It extends addition 5. Mine: Trophy spear, Hunting spear, Still hand. The same need is likely in other shares: Bounty charm, Pack leader's coat, Hunter's buckler.
- **B. Crit by condition.** A status can make hits crit (chance 100) and enlarge the crit bonus, only for hits of a kind (`basic`) or on a target that meets a condition (Stunned or Silenced, hasn't acted). It works the way a boost does for damage. Today crit chance is one stat read for every hit. Mine: Quietus, Still hand, Drawn steel. Elsewhere: Night's edge, Opening wound.
- **C. "Hasn't acted this fight"** as a unit condition: true until the unit's first action resolves. Mine: Quietus.
- **D. Extra strikes, sized and spread.** `strike` takes a share of the weapon's damage (half, a quarter, 80%), and a rule that picks several foes strikes each of them (today `strikes()` takes only the first unit the rule picks). Mine: Sweeping blade, Glaive, Oathkeeper, Volley bow, and Flurry wraps' weakening. Elsewhere: Chain wand, The storm front, the Reaping line's Scythes.
- **E. Comparing two units' stats** as a condition (an ally with less Armor than the wearer). Mine: Pike wall. Elsewhere: Phalanx shield.
- **F. A cooldown on a reaction** (fires at most once every N ticks). Needed only if CHALLENGE 2 is taken.

## Least sure

1. **Marked's own numbers.** I assumed 10 ticks with Refresh, inside the Taunt rule, and a pick by draw among several Marked foes. The Hunt rests on it, and five shares use it. One owner should set it.
2. **Gravemark Marks nothing itself.** On its own it's a plain sword, and the Assassin can't hold it with the Marking knife. Five other pieces and a formation Mark, so a party can find a partner. If that's too all-or-nothing for a legendary, I'd add "if no foe is Marked, its basic attacks Mark their target".
3. **Worldbreaker on the Hoplite, or with Millstone.** The slowings add up: a swing every 38 ticks for four times the damage, close to the "statue" the director rejected in 5g. It's still a choice the player makes, but it may read badly.
4. **Two-handers' worth.** My reading (uncommons with two steps, single-effect rares with a step or two) is mine, not the spine's. The Volley bow (one volley in a regular fight) and the Executioner's longbow (half its effect redundant on the Ranger) may not be worth an offhand. That's a test.
5. **Oathkeeper's reach.** On a Taunter with Stand fast or Thicket, it sweeps every foe for about two thirds of every fight at full swings. Against swarms that may outweigh both the Harvest and Toll pieces around it.
6. **Storm pike's lightning** is light damage from Attack on every foe, free, about once in 30 ticks. That's bigger than a mage's Area touch, on purpose for a far end, but it's the size I'm least sure of.
