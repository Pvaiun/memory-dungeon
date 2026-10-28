# Feel read, round 4: fights after the combat economy pass

Oct 27, 2026. Fights read, not numbers: campaign nodes 1 to 3, one rogue act (Knight, Bard, Hexer, seed 11, boss beaten at t52), the starters on old_road in free play, and Bard/Hexer/Pyromancer and Vampire/Frostweaver/Assassin on old_road and the crypt.

## Rhythm

A campaign fight runs 25 to 35 ticks in two waves. Every party ability fires once between t4.7 and t8.7; then a lull to about t18 where only foes swing and Bleed ticks (node 1, toll gate: nothing from the party between t11.8 and t18.3); then a second wave at t18 to t27 ends the fight. Fights breathe, but the breath is the party standing still while foes poke the Knight's Shield. Cast times read now: "Ranger begins Fire arrow" lands six ticks later, Fireball six, Rending arrow three, Raise ten, Crush ten. Speeds differ (Cure every 16, Stand fast every 19, Shield bash once), but third slots rarely fire before t25, and Pyre never did in four fights. Rogue fights run 41 to 62 ticks and read better.

## Statuses

- **Burn** is the loudest thing in the game. Firebolt's 87.8 stacks: "Bandit A takes 5265 from BURN", dead at t9; a quarter burns off each tick. Fireball's 47.3 on four wolves: all die on one tick. Fire arrow on the Ogre Chief: a 2250 hit, then about 9800 of Burn, the right proportion.
- **Shock** reads: Malison's 8.4, "takes 1007 from SHOCK" when a foe swings; Thunder chord's 30 on the Reaper, 3600 a swing.
- **Bleed** bursts on every hit: Barbed arrow's 15.6, then "takes 1872 from BLEED". Snakes' Bleed is the road's real threat (the Knight 5500 to 788 in Viper Den).
- **Might** from Anthem (20 stacks, the cap) triples basic hits: the Hexer's 665 becomes 1995, 5166 with a +2 Magic staff; refreshed every 14 ticks, it is permanent.
- **Taunt** holds from Stand fast at t8.7. Before it, three of four hits land on the Cleric.
- **Silence** reads best: "Reaper is interrupted: Death bell is lost".
- Never noticed: **Chill** (Cold hex's 2.8 thaws before the next swing; nothing ever reads slower), **Haste**, **Sunder**, **Clarity** (MP is never shown), **Regen** ("healed for 0" ten times a fight).

## Mana

Nobody ran short, anywhere. The rogue's "MP left": Hexer 5000/5000 after four Enfeebles, Knight 2000/2000 after four Stand fasts. The Pyromancer spent 1400 of 5000 a fight. It never mattered.

## Classes

- **Knight:** as described: Shield soaks ten ticks, Taunt takes everything after t8.7.
- **Cleric:** Cure waits for a wound, so its most frequent act is a 1600 Light swing that one-shots wolves.
- **Ranger:** three nukes (Rending arrow one-shots bandits), not "wearing down".
- **Pyromancer:** Burn does everything; Pyre never fires.
- **Bard:** mattered, too much: Anthem (random ally; itself four of eight times) is the party's biggest damage lever; Chorus's 450 to everyone every 14 ticks is real for 2000-HP mages.
- **Hexer:** Weaken, Shock and Burn show, Chill doesn't; Unmake stopped Crush, Flatten and Death bell, three of three.
- **Vampire:** matched: a third of each hit back; Blood gift's 800 HP for 800 is a real price.
- **Frostweaver:** Brittle doubles its hits on chilled foes; the lockdown is invisible.
- **Assassin:** Backstab one-shots at t17 to 20; Vanish fires at t22 to 23, and in three of eight fights the Assassin was dead at t20 to 21. Hidden never hid anything.

## Bosses

Ogre Chief, campaign: Crush begins at t12 to 14 every fight and landed once in three; in nodes 1 and 3 the boss died mid-wind-up at t21. In free play (untuned HP) it landed four Crushes in 119 ticks, each a kill, and won: that one felt like a boss. In the rogue, Unmake lost its only Crush. The Reaper's Death bell landed three of four; Doom's 3500 killed every 2000-HP unit it touched, the only move that asked the party for an answer.

## What looked wrong

1. Burn is a delayed nuke, not a ramp: 87.8 stacks front-load 5265 and decay; the Pyromancer kills the boss in 14 ticks (node 3), before Crush lands.
2. Might 20, refreshed every 14 ticks, triples an ally's basic attacks all fight.
3. Vanish comes after the Assassin is dead (t22 against t20.6, ghoul pit).
4. The first nine ticks are still an opening volley, then a dead lull to t18, the back line exposed until Taunt at t8.7.
5. Unmake erases a one-move boss: three signature casts seen, three lost.
6. Mana never binds; Clarity, Stillness and Blood gift top up full pools.
7. Chill thaws between the Hexer's swings; Regen heals full units for 0; Doom alone decides Reaper fights without a cleanse.
8. Tool notes: campaign-play prints "Perk pick. Offered: undefined" at the campfire; the dungeon tool's player output leaks a `hold {...}` line.
