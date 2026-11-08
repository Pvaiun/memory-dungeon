# Report: class identity after Magic (build, second gate)

The approved design (`design.md`) is built, on the current gear, as the sequence asks: the classes first, the builds and the loot to follow. Your answers from the first gate are in: the budget ladder, Choosing on one target, Unmake on a cast alone, the exchange rate kept, the knobs left for the balance pass, Othismos at the middle rung. Every number here is a first value; nothing is balanced. All 414 tests pass, every piece does what its card says (`piece-check`), and the weapon and offhand rules hold (`gear-slots`). Intent: `intent.md`.

## Decisions for you

1. **The budget ladder, as assigned.** Every piece carries stats, and each rarity carries a step more than the last; a kind's budget word moves the whole ladder a step down or up (`KIND_BUDGET`). Offhands, armor and amulets take the standard ladder. Legendaries top out at five steps, with a special stat high only there.

   | Budget | Common | Uncommon | Rare | Legendary | Kinds |
   | --- | --- | --- | --- | --- | --- |
   | Lean | 1 | 1 | 2 | 3 | axe, hammer |
   | Standard | 1 | 2 | 3 | 4 | dagger, claws, sword, spear, rune sword, bow; every offhand, armor and amulet |
   | Rich | 2 | 3 | 4 | 5 | wand, mace, staff, great weapon |

   Every one of the 272 pieces was re-sized to it, by one rule: its stats lean to its kind's profile, the signature first, the designer's first-named stat kept where a common lost a step, and the two pieces of a rarity in a kind never carry the same stats. A card's first sentence is now written from its stats, so the words and the numbers can't drift. The stock averages 1.1, 2.1, 3.1 and 4.1 steps a piece by rarity. **This is a first assignment for the loot pass to redo piece by piece; say if the ladder itself is wrong** (a step steeper, or legendaries at four).

2. **Thunderstorm costs 650 MP, not 1000:** it deals no damage now. **Or keep the old price for the party-wide Shock.**

3. **Marked is in the vocabulary** (the 22nd status, where Ward was): a class applies it now, so the pieces' word became the game's.

4. **The retired pieces,** for the loot pass to replace rather than keep: Wayfinder, Bane of the bound, Hexblade and Dawnblade (rune sword), Nettle blade (sword), Rootstaff (staff), Dowsing rod, Ironbark rod and Glacial rod, Wild hunt totem; Humbling mace became Penitent's mace. Rehomed from the rod: Sleet blade, Conductor's blade, Winter's chain and Brimming blade (rune sword), Cistern staff. Renamed: fist weapons to claws; Bearded axe, Roaring axe, Ironbound hammer and Martyr's maul to Bardiche, Roaring greataxe, Ironbound maul and Martyr's mace (the great weapon keeps the two-handed names); Shadow cloak to Shadow mantle.

## Settled since the first gate

- **Choosing chooses one ally.** A fallen ally first, else the ally with the lowest share of HP, and that one ally gets the one outcome: raised with a tenth of its HP, or healed from Attack. No new primitive: the targeting rule for the fallen now falls back to the living side when nobody is down (`ifNone: "any"` with `ko: true`, engine 0.20), and the ability's heal comes before its raise, since a heal skips a fallen target and a raise skips a living one. Checked over 40 Crypt runs: 23 raises, 17 heals, never both in a cast. The Valkyrie's versions (Over the fallen, Einherjar) follow the same shape.
- **Unmake waits for a cast alone,** as before the first report; a buff with nobody casting doesn't draw it. Silence all and Mana burn the same.
- **The swing words' sizes stand** at the measured exchange rate (light, full, heavy at 0.8, 1, 1.2 a swing per tick; the trade at ×1.2): on the kinds whose swing grows with Attack a swing step is worth about one Attack step in a class's damage (`npx tsx tools/swing-rate.ts`).
- **The knobs stay** at the prototype's values until the balance pass; the numbers below compare with the prototype's.
- **Othismos at 325 MP** (the middle rung).
- **For the balance pass, from your notes:** the Frostweaver is still weak and may be played out of a Frost party; sample parties against sample fights are the way to judge builds, rather than simulated runs.

## What was built

- **Kinds.** Twelve weapon kinds (fist renamed claws, rod gone, axe and hammer new; rune sword and mace slow) and thirteen offhand kinds (orb, trophy, cloak new), with each class's two of each, its armor, and the stat lines as tabled. `npx tsx tools/gear-slots.ts` checks the four rules for both slots: they hold, and no pair of classes shares more than one kind of a slot.
- **Swings.** Each kind has its three words in `scale.ts` (`KIND_WORDS`), every weapon piece swings by them, and a piece may step along the trade (`trade: "heavy" | "light"`): the Bardiche swings heavier for a step fewer, the Horseman's hammer lighter for one more. The interface shows a weapon's damage per tick for its holder on every card and sheet, beside its speed and scaling, so two kinds compare. Per tick at Attack 4 a light kind deals 75, a full one 94, a heavy one 112.
- **Stats at every rarity,** on the ladder above, checked as the pack is built: a piece off its budget, or a special stat high below legendary, refuses to build. Stock: 96 weapons, 48 armor, 104 offhands, 24 amulets (272, from 240), plus the 12 plain weapons and the 16 mythics.
- **Kits.** Hunter's eye crits more often on basic attacks; Othismos replaces Paired guard; Judgement reads a buff or a debuff and Condemn replaces Sanctuary; the Valkyrie is rebuilt (Shieldmaiden, Gale spear, Choosing, Skyfall); Encore replaces Thunder chord; Malison deepens and Unmake waits for a cast; Stoke replaces Kindling; Thunderstorm is the party's storm and Static charge is Attack speed. Ward is gone (the Lich's Dark ward and the Giant's Kindle Guard instead). No two classes share a base ability; every passive works in every fight.
- **Versions,** every one the design names: Valor; Triage from max HP and Ward of life's Shield from the Cleric's; Quick draw and Barbed quiver; Locked shields, Breach and Disarm; Zeal and Verdict, Challenge and Swift justice; Chooser of the slain and Shield-sister, Einherjar and Over the fallen, Thunderclap and Valkyrie's descent; Reprise and Cadenza, Rousing chorus; Withering hex, Plague, Mana burn; Rupture reads the Bleed and leaves it, Bleed them dry; Savage drain and Bloodthirst; Kindling and Wildfire, Conflagration's wind-up; Rime shield, Ice spear with Seek and no Slow, Frost armor; Static field and Storm's eye, Overcharge on the new base; Rock shelter.
- **Engine and schema.** Two additions: a crit rule can multiply the hit's crit chance (`times`), for Verdict's tripling; and a targeting rule for the fallen can fall back to the living (`ifNone: "any"`), for Choosing. Schema 0.11, engine 0.20. Everything else the design needed existed.
- **Tools.** The build parties and the rosters wear stand-in pieces where a class's kinds changed (listed in `tools/build-parties/`); the Paladin's roster order leads with Condemn; the balance sheet judges the Hoplite and Valkyrie as dealers, and its spread, probes and tally now cover the offhand slot (they never had: every offhand read "worn in 0 fights" on the sheet, which the first report missed); `swing-rate.ts` is new.
- **Documents.** `classes.md` rewritten; `rules-and-vocabulary.md` (the weapon and offhand tables, the speed stats, Marked for Ward), `loot.md` (the rarity ladder, the stock, the leans by kind), `primer.md`, `enemies.md`, `philosophy.md` and `builds.md` (minimal: the Valkyrie's abilities, the border table); `rules.md` carries the frame's rules, the kind rules and the ladder's rule.

### My calls beyond the design's words

- **Judgement on a foe holding both a buff and a debuff** is half again once, not twice.
- **Verdict** triples the crit chance through a new crit-rule field rather than a fixed add.
- **Static field** is held by the allies (each foe that hits one gains Shock from the Stormcaller's Attack), the natural shape of "every foe that hits an ally".
- **Cadenza** gives three swings: one as it lands and one after each of the next two, counted on a status whose reaction checks the count left.
- **Rupture** deals half of Bleed's per-hit damage for each stack as an untyped follow-up to the crit, and leaves the Bleed.
- **Hunter's eye** adds two crit steps on basic attacks (`KIT.hunterCrit`), its power step three.
- **The speed stats** at medium are 15 and at high 30 (Haste is 40 in all three at once): `SPECIAL`.
- **The kits' own sizes** (`KIT` in `scale.ts`): the Shieldmaiden's quarter of each hit, Choosing's heal just under Cure's, Skyfall's 150 a Shock stack, the storm's 20 ticks, Static charge's +50 Attack speed for 20 ticks.
- **The re-sized stats** keep each piece's old stats where they fit its budget and fill from the kind's profile: a rare's or legendary's third and fourth steps are the kind's commons at one step, then the signature at two. A shape stat (the Worldbreaker's slow swing, the Hummingbird charm's fast one) and a price (the Phoenix ember's HP) count no steps and the effect says them.
- **The new kinds' rares and legendaries** are a first fill for the builds pass, as the design allows: the axe's Executioner's axe, Thirsting axe, The Red Feast, Headsman's axe; the hammer's Bellringer, Rootstone hammer, Mountainfall, Grudgebearer; the orb's Orb of the long winter, Smouldering orb, The deep well, Orb of the second sun; the trophy's Ogre's tusk, Giant's knucklebone, Dragon's tooth, The king's head; the cloak's Dancer's cloak, Cloak of leaves, Swan's grace, Tempest cloak.

## What the numbers say

The balance sheet (`npm run balance -- --trios 80 --seeds 2`, 80 trios, every rogue fight and free-play run, two seeds), run on the pack at this gate, against the prototype's report and the first gate's. All three at the prototype's knobs.

| | Prototype | First gate | Now |
| --- | --- | --- | --- |
| Rogue fights won at the knobs | 81% | 90% | 99% |
| Regular fight, ticks (rogue) | 50 | 46 | 34 |
| Boss fight, ticks (rogue) | 76 | 72 | 51 |
| Burn, share of its appliers' damage (band tops at 35%) | 37% | 27–33% | 29–33% |
| Shock, the same | 37% | 26–30% | 23–26% |
| Party out of MP, share of its time (rogue) | 13% | 12% | 4% |

- **The ladder made the party a lot stronger at these knobs.** Rares and legendaries carry three and four steps where they carried one, and the sheet's parties now hold offhands too: rogue fights run a quarter shorter than at the first gate and are nearly all won, so the rogue column can no longer tell the classes apart (every class within a point of even). The knobs are the balance pass's, by your word; until then the free-play column is the one that separates.
- **Who stands where (free play, win points against parties without the class).** Bramble knight +16, Vampire +20 (it takes 1.3× an average unit's damage and wins anyway), Valkyrie +11, Paladin and Pyromancer +9, Hexer +8; Knight −13, Hoplite −14, Stormcaller −13, Frostweaver −13, Geomancer −17, Cleric −7, Bard −1. The walls and the Hoplite lose on free play's MP economy (36–60% of their time with an ability ready and no MP), not in the rogue. The Hoplite deals 1.2–1.3× an average unit's damage, the Valkyrie 1.1–1.2×, the Ranger 1.5–1.6×, the Pyromancer 1.5–1.6×, the Stormcaller 1.2–1.4×; the Frostweaver 0.6× and the Cleric 0.3×. The Stormcaller is knocked out 2.9× as often as the median class.
- **The new abilities fire.** Othismos 0.7 a boss fight, 1.4 swings' worth a cast; Condemn 0.4 a regular fight; Skyfall 8 swings' worth a cast, 37–44% of the Valkyrie's damage; Choosing heals 32–34% of a unit's HP a cast; Encore 0.8 a boss fight; Thunderstorm 0.4–0.6 a fight (slotted third); Malison's deepening lands 0.1–0.7 of each status a cast on top of its Bleed, since few foes hold anything when it lands. **Unmake fizzles 14% of its casts for want of a target:** it waits for a cast, and the foe's wind-up ends before Unmake's own quick one does. A shorter wind-up or a Silence that lands on the caster it chose would close it; one for the balance pass.
- **Every piece still does what its card says** after the re-sizing (`npx tsx tools/piece-check.ts`, 36 fights a party): no crashes, loops or wrong-way effects. Six "never fires" are tracing, not faults: the Batwing charm heals through a stat and shows +24% healing, the Signal lantern's Mark needs an ability that hits one foe, Smite's version waits for Burn, and Encore's cooldown op leaves no counted trace.
- **Gear that stands out, probed alone on a bare unit** (band ±7 points against its slot's mean): Rime knuckles +12 (Monk +16), The Red Feast +9 (Assassin +11), Frostbite bow +8 (Bard and Ranger alike); Night's edge −11 on the Assassin and Mocking mail −8 (it draws the hits and gives nothing back). The Huntsman's bow, flagged at the first gate, is inside the band now.
- **Two flags worth a look:** the Fire Giant knocks out 2.6 party members a fight in free play (the band stops at 2.5; its Kindle Guards where it Warded), and Pyre deals 21 of the Pyromancer's swings a cast (band 10), cast 0.2 times a fight.
- **The build test** (`npx tsx tools/build-test.ts --quick --no-ablate`) still fields all 216 parties and wins nearly everything at these knobs, as it did; its routes wear stand-ins and say little until the builds pass.

### How sure

- **Direction:** fairly sure, on two seeds of a broad spread and the hand-built rosters.
- **Sizes:** not sure. Every constant named here is a first value, and the swing words and budgets were sized once, from the exchange rate, not tuned. The ladder's stats were assigned by rule, not designed.
- **Not done:** no knob recalibration (the balance pass), so the rogue column is saturated; no ablation in the build test; the feel read below is my own, not a reader's.

## Samples worth looking at

`npx tsx tools/rogue-feel.ts --rosters --focus frostweaver,paladin,hoplite,valkyrie --packs 8` writes `out/feel/`. What I read there:

- **A Frostweaver shattering alone** (Bat Roost, act II): Frost lance lays 7.8 Chill at t10.8, Blizzard 3.2 more at t18.8, Stillness 3.5 at t21.8, and the Bat shatters at 12 for 6,129, dead. Three casts, one foe, as the design asked.
- **The Valkyrie's Shield bar** (the Reaper, act II): Choosing heals her 1,031 at t5 (she was the lowest), Gale spear lands three hits at t8 for 14.7 Shock and 310 of Shield, a swing takes it to 476, Skyfall lands 6,176 at t15 and fills the Shield to its cap of 1,500. The storm spear's beat shows in one fight.
- **Choosing's one outcome** (Crypt, seed 3, the Valkyrie with an Assassin and a Pyromancer): the Pyromancer falls; Choosing targets it alone and stands it up at 200 HP, and nobody is healed that cast. The next cast, with nobody down, heals the lowest ally.
- **Othismos** (Lich Lair, the Reaper): the shove lands on two foes for 932 and 9.8 Sunder each, and on the Reaper alone for 2,156 and 19.6 Sunder, where Spear thrust then lands 10,627. The Hoplite dealt 46% of the party's damage in the boss fight.
- **Condemn and the volley.** With Condemn first in the Paladin's roster order (a logged run, `old_road`, seed 11), the Mark lands and the Knight and Ranger both swing on the Marked foe on the same tick.
- **The storm** (Court Wisps, act III): Thunderstorm on three allies at t17; Shock was 55% of the Stormcaller's damage.
- **Cards on the ladder,** the ones I'm least sure read well: the Flicker wand (Double strike high, Cooldown high, Cast speed medium, then its Shock), the Phoenix ember (Attack +2, HP −1, MP regen +1, Evasion medium: the price sits among the gains), the Thick byrnie (a mail common re-written as Defense +1 so two commons weren't the same piece), the Hermit's cowl and Moonstone (Aggro −1 alone).

## Next

By your word: the builds redesigned on these classes, then the loot (the retired pieces above, the first fills, the `PIECE_BUILDS` lines, and the ladder's stats redone piece by piece). The twelve builds stop being a standing rule when this step closes; `docs/rules.md` still lists them until then.
