# The loot pass: the build, for the director

Nov 11, 2026. The new loot is built: 322 pieces, 35 formations and Neutral, the changed versions and mythics, and both kit changes. Every catalog entry matches its card and stats word for word, and the piece check plays them all with no crash, no loop and nothing that can't be fielded. Nothing is tuned.

## What to decide

1. **The knobs before you play.** The rogue's fight knobs were set against the old loot, and at them nearly every fight is won: every build wins all its fights except Barrage, at 96% in acts I and II. I didn't recalibrate. That changes how hard the game is, and this session's list didn't include it. Recalibrating first (`npm run rogue:calibrate -- --climb`, then `npm run rogue:tune`) would give you a run that pushes back. Playing first shows you the loot at its easiest. My recommendation: recalibrate.
2. **Marked: keep the new rule?** Abilities aimed at a random foe now follow the Mark as well as basic attacks. At today's knobs it barely moves anything. On the Hunt, Landslide, Bonfire and Toll routes the mean cost is 10.09 now against 10.10 with basic attacks alone, and fight length is 21.4 ticks against 21.3. The Hunt's routes move by about a point of HP either way, inside noise. My recommendation: keep it. It's cheap, and it's what the cards assume.
3. **Malison: the new one is stronger.** On the 18 Hexer route-rungs, fights run 17.1 ticks now against 19.2 with the old deepening (11% shorter), and the cost is 8.2 points against 9.0. The biggest gains are where the Hexer is the main damage: the Storm without a Stormcaller, 18.1 ticks against 22.2 at rung 1; the Toll's Knight, Hexer and Hoplite, 37.9 against 46.7 at rung 2. Every route wins all its fights either way. My recommendation: keep it, and watch it in the balance pass.

## What was built, and the calls I made

The cards are the spec. Where a card left something open, I made the natural call:

- **Riders, not a weapon's own statuses.** "Its basic attacks (and extra strikes) add X" is a rider on every piece, including the knuckles and Worldbreaker's Stun, which today attach the status to the weapon. That's what lets The standard, Mimic wand, Toll gate and Echo charm read them.
- **Sarissa** doesn't hit its swing's own target twice (the fill's note).
- **Hungry axe:** "Lifesteal doubled" is a second heal at the wearer's Lifesteal, on a foe below half as the hit lands.
- **Saint's mace:** "heals an ally" counts every heal its wearer gives except a Regen's pulses, so its own Lifesteal counts.
- **Blood vial** charges HP equal to the full cost, as its card says. The engine reads the price after the halving, so I wrote twice the halved cost. Today's piece charged half.
- **Venom vial** puts back exactly what the wound closes, whichever happens first.
- **Ravening draught** takes the HP above half as the fight truly starts (not damage, not a price), and doubles Lifesteal until a heal brings it to full.
- **Shatterstone charm** can't tell a Burn from a blow when a Shield breaks: the engine names the foe either way, so a foe's Burn that empties the Shield is sent back the damage too. **Accuser's relic** counts its holder's Lifesteal as a heal it gives. Both are small, and I've left them.
- **Warding bell** lifts one debuff a beat, Silence first. **Evensong staff** and **Matins robe** count their wearer's own casts; a free repeat isn't one.
- **The mountain's Foothills:** "every Shield it gains is a third bigger" is every ally's Shields on a Foothill, its own included.
- **Frost armor** lays a status on every ally for the Guard's length: a foe that hits one gains about 3 Chill, from the Frostweaver's Attack.
- **Stormspear's blow** is Skyfall's (heavy, plus Skyfall's amount a Shock), since its Numbers line is empty. **Writ of judgement** is called by each Condemn that resolves, on the foe it Marked.
- **Malison's power step** card now reads "40% more damage, and 40% more of every status it adds", as the rules page has it.
- **Versions the catalog doesn't list** (86 of 128) keep their builds, with the retired builds mapped as builds.md's *Elements, not builds* reads them: Ambush to the Hunt, Harvest to the Storm, Overflow to Barrage. Lockdown and Phoenix tags are dropped.
- **formations.ts** passed 600 lines, so it's now a file and a folder: the words and builder in `formations/kit.ts`, then one file a rarity.

## What the numbers say, and how sure

- **The build test** plays the nine builds' 27 routes (builds.md's classes, each build's own common, rare and legendary formation) at three rungs, 162 parties. Each rung's gear, versions and mythics are picked from the items' own tags. They're a fair first sample, not what a careful player would build. At today's knobs every build wins everything but Barrage: 96% at rungs 1 and 2, and one route of its three loses 12%. The rhythms separate: no two builds sit closer than 0.72 (Cuts and the Storm), against about 1.4 for two picked at random.
- **What carries each build** reads as the design hoped in most places. The stage is the single biggest item anywhere (13 points); then Staff of echoes, The cathedral, Hearth, Open season, the Snap swing-Chill pieces, Heartsblood and Bloodstone reliquary on the Pact. 246 of 414 items never move a fight past noise at these knobs. That's expected while every fight is won, and it's the knobs, not the items.
- **Worse to have:** Halved heart costs a party 15 points (half the HP, as its card says, and the hits don't make it back here). Then Absolve A, Tithe wand and Blood vial. These are balance-pass questions.
- **The piece check** fires every item except a few whose condition never comes up in its nine fights with its stock party: Gravemark, Hunting horn (no Mark), Noonday mace, Everflame lantern (no Burn), Floe charm, Frozen tome, The long winter (no shatter), Banked robe and Glimmer robe. Spotter's coat (Accuracy) changes nothing against foes that don't dodge. Smite B and Encore A's quirks are older than this pass.
- **The balance sheet** ran after the build, at the old knobs (`out/balance/sheet.md`, 234 flags). Its 48 trios never wear 76 of the 322 pieces, among them every dagger and axe and most staffs and horns, though its probes play every piece on every class that can wear it. The sheet's own parties will need the new loot in their kits before its gear rows mean much.

## What to play first

1. **Barrage.** It's the one build that loses, The stage is the strongest single item, and Staff of echoes paying for its second cast is new.
2. **Cold Snap at rung 3.** The long winter and Heart of winter pass cold down the line, and the chain's damping is new and on no card.
3. **The Hunt with Open season.** The Mark on the lowest foe, and the volley on each Marked fall.
