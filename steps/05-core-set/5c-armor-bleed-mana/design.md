# Step 5c design: armor, Bleed, ability order, mana, the campfire, Burn and Shock

The director's direction (`intent.md`) is specific, so this is the build as it stands: what each change is and the numbers the tuning settled on. Built in the same session as the direction, on the campaign branch; `tuning.md` has the rounds, `report.md` the results. Engine 0.11.

## Armor on a curve

- A physical hit H deals **H² ÷ (H + k × A)**, with **k = 1** (`ruleset.armorK`). A is the armor value: 0.12 × the Armor stat, which is what Armor took off every hit under the flat rule (Armor 5 is 600). So a big hit loses about A, as before; a hit the size of A loses half; a small hit loses most of itself and never all. The floor of a quarter (`armorFloor`) is gone from the core set.
- Read on the stat itself (Armor 5 is 5,000 in the data), k = 1 would take 83% off a 1,000 hit; on the displayed number (5), nothing. The armor value is the scale Armor already worked on.
- **A bug fixed with it:** a stat's floor only held on stats that also had a cap, so Sunder took Armor below zero, and under the flat rule every physical hit then gained what the Armor was below zero (50 Sunder on the Ice Titan added about 2,900 to every hit: the 5b playtester's answer to node 10). Under the curve it made one Shield bash 22 million. Every floor now holds; Armor stops at zero.

## Bleed in place of Poison

- **Bleed** is a stacking debuff with no timer that does nothing on its own. Each hit its holder takes (a hit, not damage: Bleed, Burn, Shock and Thorns don't count) deals it **120 a stack**, untyped (no Armor, no resistance), then **a quarter of the stacks go**. A stack is worth up to 480, spent over three to five hits. Statuses never scale from their applier: the ability's scaling sets the stacks only.
- A hit that applies Bleed doesn't set off the stacks it adds; the next hit does (engine: a hit's own statuses land after its hit events).
- **Ranger: Barbed arrow** (was Venom arrow): a light hit at a random foe (it sought a foe without Poison), adding several Bleed from Attack.
- **Bramble knight: Briar:** each foe that hits it gets several Bleed, from Armor (was Poison when its Thorns hurt a foe). Bramble lash still scales from Thorns; the designer view now says so ("≈ 18 (6 × Thorns)"): the number was right, the sheet just didn't name the stat, for any ability.
- **Assassin: Lacerate** (was Shadow strike, crits while Hidden): each crit adds several Bleed, from Attack. Vanish still hides it; it no longer makes it crit. Hit events can now filter on crits (`on.crit`).
- **Snakes:** each bite adds 1 Bleed (Poison was 250 a pulse for 10 ticks).

## The opening, set by the build

- At fight start the **first ability slotted has 25 ticks of its cooldown done, the second 15, the third 10** (`ruleset.opening.abilities`), the director's numbers. A basic attack starts half charged, a tick later for each party slot, so two members with the same weapon don't swing together. Enemies use the same rule by their list order. No dice: the same build opens the same way every fight.
- **Cooldowns 30, 38 and 46 by word** (were 30, 48 and 70), still moved up to 15% by id. With 25/15/10, any ability in any slot comes up once in a regular fight of 30 ticks or more; at 70, a long ability slotted third came up at tick 60, after most fights had ended.
- Bosses' signature moves (Crush, Inferno, Death bell, Tempest, Call drones, Rally) use the long word (46), keeping 5b's "about every 48 ticks".
- The simulations' kits now try two orders per build (the documents', and the longest cooldown first), and the climb tries others.

## Mana

- **An ability costs its word's price × (its class's MP − 1) ÷ 2** (`MP_APPETITE`): a class with MP 5 (Cleric, Pyromancer) pays four times what a class with MP 2 (Knight, Bramble knight, Hoplite, Monk, Vampire) pays, and a class with MP 3 the old price. The documents' MP stat already marks the casters; now it marks how hungry their spells are.
- **MP regen is 0.03 a point every 4 ticks** (was 0.05), so regen 3 gives 90.
- Cure is no longer "costly": the doubled price made the Cleric the class nobody took.

## The campfire: three options

- **REST:** everyone standing +40% of max HP. **FOCUS:** everyone standing +50% of max MP (was 40). **REVIVE:** one knocked-out member of the player's choice stands up with 35% of its max HP, offered only when someone is down (`revive` on the campfire stage).
- The simulations revive the first member down in formation order when they can, else REST or FOCUS as before. The interface shows a REVIVE button for each member down.

## Burn and Shock

- **Pyromancer:** Firebolt adds many Burn (was several), Fireball several (was a few), Kindling several (was a few). **Stormcaller:** Chain lightning, Thunderstorm and Arc add several Shock (were a few).
- **Burn 40 a stack a pulse** (was 30). **Shock 90 a stack** (was 60; cap 25): more stacks alone did little, because the Stormcaller's own swings already reach the cap.
- **Bard: Thunder chord** replaces Lullaby: several Shock on every foe, from Magic; no hit.
- **Paladin: Smite** adds several Burn from Magic, on a medium cooldown (was long).

## The tuner

- **A boss keeps at least half its HP** (`BOSS_FLOOR`, −50): when the regular fights' attrition leaves the boss less room than that, the tuner eases the regular fights instead and fits the boss again. Without it, nine bosses went to −60 or below (the Ogre Chief to −88, dying in 14 ticks).

## Tools

- `src/campaign-campfire.ts`, new: plays the best builds to the campfire, branches the run once per option on the same dice, and counts which options win, how often only one does, and how often the simulations' own pick lost.
- `src/campaign-audit.ts` gains a section on casting and MP: by class, the regular fights in which it cast nothing (all, and those of 25 ticks or more), its first cast, casts by slot, MP at fight starts, and runs in which it ran dry.
