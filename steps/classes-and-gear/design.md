# Design: stat lines and upgrades (draft)

A draft for the director, on top of the prototype (no Magic) and the weapon allocation in `weapons.md`. Offhands aren't designed here: their intent isn't recorded yet (`report.md` has the questions). Nothing is built.

## Stat lines

### The rule

- **A line follows how its class stays alive.** The survival stat gets the line's high number, the stats its kit reads get the next, and the rest stay ordinary or low.
- **Four bands of toughness,** one per class:
  - **Tough:** draws fire and takes it.
  - **Sturdy:** stands in the fight and lives by its own means.
  - **Light:** stays back and has a way to recover.
  - **Frail:** frailty is its identity.
- **What stays as it is:**
  - MP pools stay where the endurance check put them (`MP_POOL`).
  - Lines carry no speed stats: Attack speed, Cooldown and Cast speed belong to gear.
  - Attack stays between 3 and 5 for everyone. Dropping it on walls and healers was tried and rejected.

### Why the lines change

Today five classes share one shape: HP 2, Defense 1 or 2, Aggro 1. They are the Cleric, Hexer, Pyromancer, Frostweaver and Stormcaller, and that shape is the caster tier. The balance sheet shows its cost: these five, with the Bard and the Assassin, are the classes knocked out most (`report.md` has the numbers). The Pyromancer gets away with it because it kills first. The Frostweaver and Stormcaller don't, and they're the two most knocked out of all.

### The lines

HP, Defense, Attack, Crit and Aggro, on the 1-to-5 scale, then special stats. **Bold** marks a change.

| Class | Stays alive by | Band | HP | Def | Atk | Crit | Aggro | Special |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Knight | bulk: HP, its own Shield from HP, Guard | tough | 5 | 4 | 3 | 2 | 5 | |
| Bramble knight | bulk and regrowth: HP, Regen on itself, Guard | tough | 5 | 3 | 3 | 2 | 5 | Thorns high |
| Hoplite | armor: Defense, Guard | tough | 4 | 5 | 4 | 2 | 5 | |
| Paladin | armor and Ward; Absolve heals itself | tough | 4 | 4 | 4 | 2 | 4 | |
| Geomancer | stone: Defense and its own Shield | sturdy | 3 | 4 | 4 | 4 | 3 | Crit damage high |
| Vampire | drinking: Lifesteal, doubled when low | sturdy | 4 | 2 | 4 | 2 | 3 | Lifesteal high |
| Valkyrie | a middle line; Rally reaches itself | sturdy | 3 | 3 | 4 | 3 | 3 | |
| Monk | dodging | sturdy | 3 | 2 | 3.7 | 2 | 2 | Evasion high, Double strike medium |
| Stormcaller | a fighter's body; Storm shield where trained | **sturdy** | **3** | **2** | 4 | 2 | **2** | |
| Frostweaver | control (Chill slows, a shatter Stuns) and a sturdier body | **sturdy** | **3** | **3** | 4 | 2 | 1 | |
| Cleric | healing itself through the danger Last rites plays on | light | **3** | 2 | 4 | 2 | 1 | |
| Bard | stays back; Refrain mends | light | 3 | 3 | 3 | 2 | 1 | |
| Ranger | stays back | light | 3 | 2 | 4 | 3 | 2 | Accuracy medium |
| Hexer | stays back; Weakens the strongest foe | light | **3** | 1 | 4 | 2 | 1 | Siphon medium |
| Assassin | out of reach: Hidden, Evasion, low Aggro | frail | 2 | 2 | 5 | 5 | 1 | Crit damage high, Evasion medium |
| Pyromancer | killing first, from the back | frail | 2 | 1 | 5 | 2 | 1 | |

Notes:
- **The elementals follow the lean that was discussed,** which is still the director's decision (`report.md`, decision 1):
  - The Pyromancer stays the frail spellcaster.
  - The Frostweaver becomes the sturdier caster that leads with abilities.
  - The Stormcaller becomes a fighter.
- **The Stormcaller gets no Evasion.** Dodging is the Monk's way, and both wear claws. Its claws and orb can bring Evasion or HP if the player picks them.
- **The Hexer gains HP only.** With Defense 2 as well, it went from among the most knocked out to among the least, which is too far for a light class.
- **The Frostweaver keeps its Attack.** It's already the weakest dealer.
- **The Ranger's Accuracy** goes if Accuracy goes.
- **Unchanged lines already match the rule.** Each puts its high number on its way of staying alive, and its next on what its kit reads: HP for the Knight, Defense for the Geomancer and Bramble knight, Crit for the Assassin.

## Upgrades: the audit

### What it checks

1. **Each of a class's weapon kinds has a version that reads its signature.** Then training a version commits a unit to the direction its weapon points, which makes the upgrade the strongest commitment lever. This is the weapons' first rule, carried into the upgrades.
2. **Its versions open roles beyond its base kit,** and none opens a role its identity rules out.
3. **No version is a scaling change alone.**
4. **Everything scales from the user.**
5. **Nothing leans on what's retired:** Magic, the rune sword and the rod, and Accuracy if it goes.

### Each class

| Class | What reads each kind's signature | Roles its versions open |
| --- | --- | --- |
| Knight | **Sword (Attack): its swing only.** Hammer (Defense): Stone guard. | protects another (Stonewall, Stone guard, Cover), mana (Rally the well), control (Measured blow), heavy hits (Crushing bash) |
| Cleric | Mace (HP): Martyr's raise. Staff (Cast speed): Raise, Renew. | mana (Font), the wall's keeper (Anchor's blessing), damage (Battle prayer), Shield (Ward of life) |
| Ranger | Bow (Crit damage), dagger (Crit chance): its arrows' crits, as any hitter's. | control (Pinning arrow), finisher (Gutting arrow), spread (Scatter barbs, Hail) |
| Bramble knight | Hammer (Defense): Briar. Mace (HP): its own Regen (Deep roots). | the party's guard (Grove), the party's healer (Blossom), area (Whipping vines, Spreading thorns) |
| Hoplite | Spear (Aggro): its draw; Watch the anchor. Great weapon (Attack): Phalanx, Spear thrust. | Aegis for all (Shield wall), guards others (Line of shields, Guard the blade), area (Skewer), finisher (Hunter's thrust) |
| Paladin | Mace (HP): Penance. Great weapon (Attack): Smite, Absolve, Sanctum. | reviver (Absolution), control (Hammer of dawn), area Burn (Consecration, Pyre of judgement) |
| Valkyrie | Spear (Aggro): Last stand's Taunt. Mace: its commons (Cooldown, MP regen) for Rally and Valhalla, not HP, as the exception allows. | a wall for a moment (Last stand), tempo (Battle hymn), finisher (Spear of the hunt), mass revive (Flight of the valkyries) |
| Bard | Bow (Crit damage): Refrain. Wand (Cooldown): its songs. | aimed heals and mana (Harmony), control (Lullaby), area damage (Resonance) |
| Hexer | Wand (Cooldown): its curses. Sword (Attack): its stacks, and Cold hex on its swing. | Burn (Hex of flames), Silence for all (Silence all), mana (Broken spell), Weaken for all (Wither), finisher (Expose) |
| Monk | Claws (Double strike): Iron palm. Spear (Aggro): Stillness of mind. | wall (Stillness of mind), self-heal (Drinking palm), Chill (Frost fist), finisher (Vital strike) |
| Assassin | Dagger (Crit chance): Backstab. Axe (Lifesteal): its crits, as any hitter's, though they're the game's biggest. | protector (Smoke screen), control (Choke), a finisher that chains (Coup de grâce) |
| Vampire | Claws (Double strike): more hits to drink from. Axe (Lifesteal): Bloodlust, Feeding frenzy. | heals another (Shared feast), mana (Drain the well, Blood for mana), reviver (Lifeblood), buffer (Blood rage) |
| Pyromancer | Staff (Cast speed): Pyre, Fireball. Wand (Cooldown): Firebolt, and a fast swing for Kindling. | **none beyond damage:** all eight versions are shapes of Burn |
| Frostweaver | Staff (Cast speed): Blizzard. Orb (MP regen): its costs. | control (Brittle, Ice spear, Frozen moment), mana (Deep calm), area (Splinters, Avalanche) |
| Stormcaller | Claws (Double strike): Arc on the extra strikes. Orb (MP regen): its costs, and Recharge. | wall (Storm shield), punishing attackers (Static field), finisher (Ball lightning), free casts (Overcharge) |
| Geomancer | Hammer (Defense): Earthen shell, Rockfall, Tremor. Great weapon (Attack): its swing, which Bedrock makes crit, as the weapon findings accept. | Shield for all (Stone skin), control (Stunning crits, Aftershock), area (Rockslide) |

No version opens a ruled-out role: no Hoplite version heals, no Pyromancer version tanks, and no Assassin version makes it tough.

### Gaps, and what I'd do

1. **The Knight's sword.** Replace Stand fast's version B, Hold the line, with **Riposte:**
   - **Card:** "Taunts, and strikes back at each foe that hits it while the Taunt lasts, for damage that scales from Attack. No Clarity."
   - **Why it differs from Hold the line:** Hold the line gave flat Thorns. Riposte is a hit, so it meets Evasion and Defense and can crit, where Thorns can't. That makes the sword's Attack and its common Crit chance both pay.
   - **What it keeps:** the same fantasy, punishing whoever hits the anchor, so it stays on the Toll.
   - **The Knight's choice:** the hammer and Stone guard make a Knight who protects; the sword and Riposte make one who punishes.
   - **Engine:** a reaction on `hit_taken` that deals damage to the attacker. It needs nothing new.
2. **Shieldbearer** (Phalanx's B) is a scaling change alone: Defense adds to the swing. Add a behaviour: its swings go to the foe with the highest Attack. The bodyguard strikes the biggest threat, and Defense pays on the swing.
3. **Revives scale from the fallen ally's max HP:** Raise, Valhalla, Flight of the valkyries, Dawn muster and Absolution. This breaks "everything scales from the user" as written.
   - **I'd keep them as they are,** and write revives into the rule as its one exception. A revive restores a unit rather than healing it. "Comes back with half its HP" reads at a glance. From the reviver's stat, the same revive would bring back a Pyromancer full and a Knight barely standing.
   - Martyr's raise and Lifeblood already pay from the user.
4. **Ward of life's Shield** is a third of the ally's max HP: from the target. Size it from the Cleric's Attack instead, as Sanctum's Shield is from the Paladin's.
5. **The Pyromancer** is the one class whose versions open no second role. That's fine if its identity is the pure dealer. If not, one version could open control, such as Burn that Weakens or Slows.
6. **Ten version cards say "physical damage":**
   - Coup de grâce, From the shadows, Choke and Garrote wire
   - Frost fist, Fanned flames, Lingering point and Vital strike
   - Bloodletting and Drain the well

   With one kind of hit, the word goes. It's a text fix at build.
7. **Accepted without a version** (the director can overrule):
   - **The Assassin's axe:** its Lifesteal pays through crits sized by Crit damage high.
   - **The Ranger's crits:** they work as anyone's would.
   - **The Valkyrie's mace:** it reads its commons rather than HP.
   - **The Geomancer's great weapon:** Bedrock makes the swing crit.
8. **Waiting on the re-theme:**
   - **A Spellblade Hexer** would want one version that plays on its blade.
   - **A fighter Stormcaller** may change abilities, and its versions with them.
   - **A sturdier Frostweaver** needs no version: its line and its control carry it.
