# Report: class identity after Magic (build)

The approved design (`design.md`) is built, on the current gear, as the sequence asks: the classes first, the builds and the loot to follow. Every number here is a first value; nothing is balanced. All 414 tests pass, every piece does what its card says (`piece-check`), and the weapon and offhand rules hold (`gear-slots`). Intent: `intent.md`.

## Decisions for you

1. **The budget table.** The design says a kind's pieces carry "a step fewer or a step more than today's at every rarity where stats appear", and also that every piece carries stats at every rarity. Taken literally the first makes a lean kind's uncommons, rares and legendaries bare. I wrote the table so a lean kind keeps a step on its common and uncommon and goes bare at rare and legendary, and a rich kind carries one more at every rarity (`KIND_BUDGET`):

   | Budget | Common | Uncommon | Rare | Legendary | Kinds |
   | --- | --- | --- | --- | --- | --- |
   | Lean | 1 | 1 | 0 | 0 | axe, hammer |
   | Standard | 2 | 1 | 1 | 1 | dagger, claws, sword, spear, rune sword, bow |
   | Rich | 3 | 2 | 2 | 2 | wand, mace, staff, great weapon |

   Offhands take the standard column exactly; armor and amulets take it as a floor at rare and legendary. The content refuses to build a piece off its budget, so changing the table means re-reading the pieces it moves. **Alternatives:** rich rares and legendaries at one step (the two-handers keep their bigger effects instead), or lean uncommons bare.

2. **The swing words' sizes.** Light, full and heavy are 0.8, 1 and 1.2 of a full swing per tick; base-heavy, even and Attack-heavy put 30%, 50% and 70% of that swing on the wearer's Attack at the reference line (`SWING_POWER`, `SWING_SCALING`); a piece's step along the trade is ×1.2 (`SWING_TRADE`). The exchange rate was measured first (`npx tsx tools/swing-rate.ts`): on the kinds whose swing grows with Attack, **a swing step (×1.2) is worth about one Attack step** in a class's damage (Knight +18% against +17%, Valkyrie +12% against +25%, Bard +24% against +37%, Hoplite +8% against +12%); on the base-heavy kinds a swing step out-damages an Attack step (Cleric +36% against +16%, Geomancer +13% against +6%) but moves wins little, because those classes don't win by swinging. So "a step fewer for a heavier swing" is a fair trade on the fighters' kinds and a generous one on the casters', which is the direction the design wanted. **Keep these, or move the trade to ×1.15.**

3. **Choosing does both when both hold.** With an ally down and another below 80%, it heals the lowest ally and raises the fallen one in the same cast; the engine has no "instead" without a new primitive. Strictly better than the design's words, and it reads cleanly in the logs. **Keep, or add a primitive.**

4. **Unmake with nobody casting.** It waits for a cast or a buff, as approved. When a foe holds a buff but none is casting, it Silences and strips the foe with the highest Attack, which is usually but not always the buffed one. **Keep, or wait for a cast alone when the buffed foe isn't the strongest.**

5. **The knobs.** At the prototype's knobs the rogue's fights are won 90% of the time (81% in the prototype's report), and regular fights run 46 ticks (50 before). The party is stronger: stats on every rare and legendary, the Hoplite at Attack 5, the Valkyrie's Shield. I left the knobs so these numbers compare with the prototype's. **Recalibrate now, or at the balance pass** (`npm run rogue:calibrate`).

6. **Othismos costs the middle rung** (325 MP), not the top (500): at 500 the Hoplite's three abilities cost more than its pool, and Spear thrust never cast. Its pool is its identity, so the price moved. **Or raise the pool.**

7. **Thunderstorm costs 650 MP, not 1000:** it deals no damage now. **Or keep the old price for the party-wide Shock.**

8. **Marked is in the vocabulary** (the 22nd status, where Ward was): a class applies it now, so the pieces' word became the game's.

9. **The retired pieces,** for the loot pass to replace rather than keep: Wayfinder, Bane of the bound, Hexblade and Dawnblade (rune sword), Nettle blade (sword), Rootstaff (staff), Dowsing rod, Ironbark rod and Glacial rod, Wild hunt totem; Humbling mace became Penitent's mace. Rehomed from the rod: Sleet blade, Conductor's blade, Winter's chain and Brimming blade (rune sword), Cistern staff. Renamed: fist weapons to claws; Bearded axe, Roaring axe, Ironbound hammer and Martyr's maul to Bardiche, Roaring greataxe, Ironbound maul and Martyr's mace (the great weapon keeps the two-handed names); Shadow cloak to Shadow mantle.

## What was built

- **Kinds.** Twelve weapon kinds (fist renamed claws, rod gone, axe and hammer new; rune sword and mace slow) and thirteen offhand kinds (orb, trophy, cloak new), with each class's two of each, its armor, and the stat lines as tabled. `npx tsx tools/gear-slots.ts` checks the four rules for both slots: they hold, and no pair of classes shares more than one kind of a slot.
- **Swings.** Each kind has its three words in `scale.ts` (`KIND_WORDS`), every weapon piece swings by them, and a piece may step along the trade (`trade: "heavy" | "light"`): the Bardiche swings heavier for a step fewer, the Horseman's hammer lighter for one more. The interface shows a weapon's damage per tick for its holder on every card and sheet, beside its speed and scaling, so two kinds compare. Per tick at Attack 4 a light kind deals 75, a full one 94, a heavy one 112.
- **Stats at every rarity.** Every piece carries its budget, checked as the pack is built. Stock: 96 weapons, 48 armor, 104 offhands, 24 amulets (272, from 240), plus the 12 plain weapons and the 16 mythics.
- **Kits.** Hunter's eye crits more often on basic attacks; Othismos replaces Paired guard; Judgement reads a buff or a debuff and Condemn replaces Sanctuary; the Valkyrie is rebuilt (Shieldmaiden, Gale spear, Choosing, Skyfall); Encore replaces Thunder chord; Malison deepens and Unmake waits for a cast or a buff; Stoke replaces Kindling; Thunderstorm is the party's storm and Static charge is Attack speed. Ward is gone (the Lich's Dark ward and the Giant's Kindle Guard instead). No two classes share a base ability; every passive works in every fight.
- **Versions,** every one the design names: Valor; Triage from max HP and Ward of life's Shield from the Cleric's; Quick draw and Barbed quiver; Locked shields, Breach and Disarm; Zeal and Verdict, Challenge and Swift justice; Chooser of the slain and Shield-sister, Einherjar and Over the fallen, Thunderclap and Valkyrie's descent; Reprise and Cadenza, Rousing chorus; Withering hex, Plague, Mana burn; Rupture reads the Bleed and leaves it, Bleed them dry; Savage drain and Bloodthirst; Kindling and Wildfire, Conflagration's wind-up; Rime shield, Ice spear with Seek and no Slow, Frost armor; Static field and Storm's eye, Overcharge on the new base; Rock shelter.
- **Engine and schema.** One addition: a crit rule can multiply the hit's crit chance (`times`), for Verdict's tripling. Schema 0.11, engine 0.20. Everything else the design needed existed.
- **Tools.** The build parties and the rosters wear stand-in pieces where a class's kinds changed (listed in `tools/build-parties/`); the Paladin's roster order leads with Condemn; the balance sheet judges the Hoplite and Valkyrie as dealers; `swing-rate.ts` is new.
- **Documents.** `classes.md` rewritten; `rules-and-vocabulary.md` (the weapon and offhand tables, the speed stats, Marked for Ward), `loot.md` (the rarity table, the stock, the leans by kind), `primer.md`, `enemies.md`, `philosophy.md` and `builds.md` (minimal: the Valkyrie's abilities, the border table); `rules.md` carries the frame's rules and the kind rules.

### My calls beyond the design's words

- **Judgement on a foe holding both a buff and a debuff** is half again once, not twice.
- **Verdict** triples the crit chance through a new crit-rule field rather than a fixed add.
- **Static field** is held by the allies (each foe that hits one gains Shock from the Stormcaller's Attack), the natural shape of "every foe that hits an ally".
- **Cadenza** gives three swings: one as it lands and one after each of the next two, counted on a status whose reaction checks the count left.
- **Rupture** deals half of Bleed's per-hit damage for each stack as an untyped follow-up to the crit, and leaves the Bleed.
- **Hunter's eye** adds two crit steps on basic attacks (`KIT.hunterCrit`), its power step three.
- **The speed stats** at medium are 15 and at high 30 (Haste is 40 in all three at once): `SPECIAL`.
- **The kits' own sizes** (`KIT` in `scale.ts`): the Shieldmaiden's quarter of each hit, Choosing's heal just under Cure's, Skyfall's 150 a Shock stack, the storm's 20 ticks, Static charge's +50 Attack speed for 20 ticks.
- **The new kinds' rares and legendaries** are a first fill for the builds pass, as the design allows: the axe's Executioner's axe, Thirsting axe, The Red Feast, Headsman's axe; the hammer's Bellringer, Rootstone hammer, Mountainfall, Grudgebearer; the orb's Orb of the long winter, Smouldering orb, The deep well, Orb of the second sun; the trophy's Ogre's tusk, Giant's knucklebone, Dragon's tooth, The king's head; the cloak's Dancer's cloak, Cloak of leaves, Swan's grace, Tempest cloak.

## What the numbers say

The balance sheet (`npm run balance -- --trios 80 --seeds 2`, 80 trios, every rogue fight and free-play run, two seeds), against the prototype's report where it gave a number. Both at the prototype's knobs.

| | Prototype | Now |
| --- | --- | --- |
| Rogue fights won at the knobs | 81% | 90% |
| Regular fight, ticks (rogue) | 50 | 46 |
| Boss fight, ticks (rogue) | 76 | 72 |
| Burn, share of its appliers' damage (band tops at 35%) | 37% | 27–33% |
| Shock, the same | 37% | 26–30% |
| Party out of MP, share of its time (rogue) | 13% | 12% |

- **Who changed most.** The Stormcaller's parties went from 11 points behind to about even (−4 free, −1 rogue); the Frostweaver's from 14 behind to 8–10 behind; the Cleric's stays 5–11 behind. The Bard's parties are 10 points behind in the rogue (1 in free play): Thunder chord's damage is gone and the sheet can't credit Encore to the Bard. The Valkyrie's parties win 7–8 points more, the Bramble knight's 10–12. The Hoplite deals 1.5× an average unit's damage, the Valkyrie 1.2–1.3×, the Ranger 1.5–1.6×, the Pyromancer 1.3–1.5×, the Stormcaller 1.4×; the Frostweaver 0.5× and the Cleric 0.3–0.4×.
- **The new abilities fire.** Othismos 0.8 a boss fight, 2.6–2.9 foes a cast, 9–10 Sunder each; Condemn 0.6–1.1 a fight; Skyfall 8 swings' worth a cast, 32–39% of the Valkyrie's damage; Choosing heals 36–41% of a unit's HP a cast; Encore 0.9 a fight, 10–14% of them finding no ally to give it to; Thunderstorm 0.4 a fight (it's slotted third in the roster order); Malison's deepening lands 0.6–0.7 Chill and Shock a cast on top of 7–8 Bleed, since few foes hold anything when it lands.
- **Three flags worth a look:** the Fire Giant knocks out 2.6 party members a fight (the band stops at 2.5; its Kindle Guards where it Warded); the Huntsman's bow wins 7 points over its slot's mean, mostly on the Bard (Refrain on a Marked foe); and the free-play set's MP starvation (walls and fighters with an ability ready and no MP 36–67% of their time) is free play's economy, not the rogue's (12%).
- **The exchange rate** is under decision 2; the full table is `out/swing-rate.txt` after `npx tsx tools/swing-rate.ts`.
- **The build test** (`npx tsx tools/build-test.ts --quick --no-ablate`) still fields all 216 parties and wins nearly everything at these knobs, as it did; its routes wear stand-ins and say little until the builds pass.

### How sure

- **Direction:** fairly sure, on two seeds of a broad spread and the hand-built rosters.
- **Sizes:** not sure. Every constant named here is a first value, and the swing words and budgets were sized once, from the exchange rate, not tuned.
- **Not done:** no knob recalibration (decision 5); no ablation in the build test; the feel read below is my own, not a reader's.

## Samples worth looking at

`npx tsx tools/rogue-feel.ts --rosters --focus frostweaver,paladin,hoplite,valkyrie --packs 8` writes `out/feel/`. What I read there:

- **A Frostweaver shattering alone** (Bat Roost, act II): Frost lance lays 7.8 Chill at t10.8, Blizzard 3.2 more at t18.8, Stillness 3.5 at t21.8, and the Bat shatters at 12 for 6,129, dead. Three casts, one foe, as the design asked.
- **The Valkyrie's Shield bar** (the Reaper, act II): Choosing heals her 1,031 at t5 (she was the lowest), Gale spear lands three hits at t8 for 14.7 Shock and 310 of Shield, a swing takes it to 476, Skyfall lands 6,176 at t15 and fills the Shield to its cap of 1,500. The storm spear's beat shows in one fight.
- **Othismos** (Lich Lair, the Reaper): the shove lands on two foes for 932 and 9.8 Sunder each, and on the Reaper alone for 2,156 and 19.6 Sunder, where Spear thrust then lands 10,627. The Hoplite dealt 46% of the party's damage in the boss fight.
- **Condemn and the volley.** In the packs it came late, third in the Paladin's old roster order; with Condemn first (a logged run, `old_road`, seed 11), the Mark lands and the Knight and Ranger both swing on the Marked foe on the same tick. The order is fixed; the packs will show it next time.
- **The storm** (Court Wisps, act III): Thunderstorm on three allies at t17; Shock was 55% of the Stormcaller's damage.

## Next

By your word: the builds redesigned on these classes, then the loot (the retired pieces above, the first fills, the `PIECE_BUILDS` lines, and the rares' and legendaries' steps re-read where a kind's budget moved them). The twelve builds stop being a standing rule when this step closes; `docs/rules.md` still lists them until then.
