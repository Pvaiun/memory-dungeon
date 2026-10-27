# Fresh eyes: a cold read of the balance pass

From `npm run balance -- --trios 80 --seeds 2`, a campaign playtest of nodes 1 to 6 (three tries a node) and one rogue run (Knight, seed 7, won). Numbers are campaign / free play / rogue; the tuning log was not read.

## What still looks wrong, worst first

1. **The campaign kills in regular fights, not at the boss.** 91% of campaign losses come in regular fights; one takes 56% of the party's HP and knocks out a member on average, while a boss fight lasts 32.5 ticks to a regular fight's 30.8 and knocks out fewer (0.9). All five of my lost runs ended in a regular room.

2. **Nodes 3 and 6 lost three of three with sensible parties.** Node 3's four snakes bled the party for 3,200 to 4,700, and the Knight's Sworn Taunt pulled every bite onto a Knight already bleeding. At node 6 an Archer's 2,026 basic one-shot a full-HP Cleric (2,000) at t4.

3. **The HP 2 classes still die before their kit plays.** Cleric knocked out in 40.6 of 100 campaign fights (mean tick 20.9), Pyromancer 47 (tick 12.7). My Pyromancer bled out at t10, my Cleric at t16 of a run's first fight.

4. **Bard, Hexer and Frostweaver are passengers.** Parties with them win 15.9, 10.9 and 8.2 points less. The Hexer's damage is 100% basic attacks and it is knocked out most of anyone (52.5 of 100); the Bard casts 1.7 times a fight.

5. **Vampire, Valkyrie and Monk carry.** +13.7, +12.2 and +11.5 points. Lifesteal is 47% of all campaign healing: the Vampire heals itself more than the Cleric heals anyone. The Monk out-damaged my other two together in every rogue boss fight.

6. **Third-slot and long-cooldown abilities don't fire.** Pyre 0.03 casts a regular fight (never in ten playtest fights), Raise 0.07, Absolve 0.09, Stillness 0.13: a 40-tick cooldown with an 8-tick head start is ready at t32, and campaign fights end at t31.

7. **Signature moves rarely come.** The Ogre Chief casts Crush 0.36 / 0.74 times a fight, never in my node 1; the Witch's Curse lands 0.11 times a fight; Aegis ends with the fight unused 70% of the time.

8. **Ghosts and Ghouls are boss-grade minions.** A Ghost deals 2.67× the median minion's damage and lives 1.5× as long, a Ghoul 1.75× and 2.6×; the party loses 56% and 62% of the campaign fights they are in (Bandits: 8%), under a band that tops at 3.

9. **Half the formations lose to Neutral.** In the spread Last stand is 11.6 points under Neutral, Ambush 9.5, Blitz 5.9, Scatter 5.3; the probe has Escort +10.2 and Caravan +9.4.

10. **One amulet and one bow.** Heartstone is worn 15,246 unit-fights, +3.9 over an empty slot, which Warhorn and Glass heart lose to. Warbow gives ×1.61 damage: my Ranger out-damaged both walls 35,874 to 4,922 and 8,178.

11. **Stats that never bind.** Foes dodge 0% of the party's hits, so Accuracy does nothing; resistances take 3% off the party's magic, so elements barely count; one Frost lance fills Chill's cap of 8, so Blizzard adds nothing; Sunder has no cap and reached 235 on the Silent One.

12. **Rogue fights run long and the end is soft.** Mine ran 52 to 125 ticks against a 37-tick shape, nobody fell at any boss, and Quiet changed nothing, against the sheet's 95% Silent One win rate.

13. **The Geomancer runs dry; Regen is small.** Starved 19% of its time; Earthen shell casts in a third of fights, so Bedrock is up 0.07 times a fight. Regen heals 284 an application: Renew's 1,300 MP buys a quarter of Cure's 1,000.

## What looked right

- Bleed, Burn and Shock at 12%, 9% and 20% of their appliers' damage, all visible in play.
- Seven classes within 6 points of even: there is a middle.
- MP binds on casters, never on walls; zero fizzled casts.
- Nodes 1 and 2 play as a tutorial should: first-try wins, short fights.
- The campfire's three choices were real decisions, and the rogue's recruits and swaps rescued a run two members down.
