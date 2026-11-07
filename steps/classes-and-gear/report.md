# Report: stat lines, offhands and upgrades (design gate)

A draft design for two of the three, and questions for the third. Intent: `intent.md`. The weapons, settled: `weapons.md`. The draft: `design.md`. Nothing is built; the numbers below come from patching the prototype's balance sheet, not from changed content.

## Decisions for you

1. **The elementals.** I took the lean you discussed, and I'd keep it:
   - **The Pyromancer** stays the frail spellcaster.
   - **The Frostweaver** becomes the sturdier caster that leads with abilities.
   - **The Stormcaller** becomes a fighter.

   You said "pick a couple" to be frail, and this leaves only one frail elemental. A second would have to be the Frostweaver. It's the class knocked out most today, and the weakest dealer.
2. **Four stat lines change** (`design.md`, Stat lines). Every line now follows how its class stays alive, in four bands: tough, sturdy, light and frail. The five HP-2 casters stop sharing one shape.
   - Stormcaller: HP 2 → 3, Defense 1 → 2, Aggro 1 → 2.
   - Frostweaver: HP 2 → 3, Defense 2 → 3.
   - Cleric: HP 2 → 3.
   - Hexer: HP 2 → 3.

   The other twelve lines already fit the rule.
3. **The Knight's sword: Riposte** replaces Hold the line as Stand fast's version B: "Taunts, and strikes back at each foe that hits it while the Taunt lasts, for damage that scales from Attack." It's a hit, so it can crit and meets Defense. Thorns can do neither. The hammer and Stone guard make a Knight who protects; the sword and Riposte make one who punishes.
4. **Shieldbearer is a scaling change alone,** which your rule forbids. I'd add a behaviour: its swings go to the foe with the highest Attack.
5. **Revives scale from the fallen ally's max HP,** which breaks "everything scales from the user." That covers Raise, Valhalla, Flight of the valkyries, Dawn muster and Absolution.
   - I'd make revives the rule's one written exception: "comes back with half its HP" reads at a glance.
   - Ward of life's Shield, also sized from the ally, would move to the Cleric's Attack.
6. **The Pyromancer** is the only class whose versions open no second role: all eight are Burn damage. Is the pure dealer its identity, or should one version open control?
7. **Accuracy is still open.** The Ranger's line waits on it.

## Offhands: what I need from you first

I haven't designed them. Your intent isn't recorded, and your one word so far rules out soft slot jobs and copying the weapon method.

**What has changed under them:**
- **Sharing is unbounded now.** The sharing rule counts weapons only, so nothing limits who shares an offhand kind.
- **Rarity:** you want stats on all gear. Today 6 of the 40 offhand rares and legendaries carry any stat.
- **Attack:** 21 of the 40 commons and uncommons carry it, left over from +Magic becoming +Attack.
- **Fits that look wrong after the new weapons:**
  - The Stormcaller, now a fighter on claws, holds a bell.
  - The Hexer, on a sword, holds an idol.
  - Among the walls, only the Bramble knight holds no shield.

**Questions:**
1. What should an offhand kind tell the player who finds one, beyond who can hold it?
2. What should decide who holds which kind, if anything does?
3. Is a shield different from other offhands, as weapons are from other slots, or is it one kind among ten?
4. Should a class's offhand fit its kit the way its weapons now do, or is it free of that?

## What the numbers say

The balance sheet on the prototype: 160 parties, two seeds, rogue fights at today's knobs, with the four lines patched in. The Hexer was also tried with Defense 2 (column three).

| Class | Knockouts, × the median class: today → proposed (Hexer with Defense 2) | Win points with the class: today → proposed (Hexer with Defense 2) |
| --- | --- | --- |
| Frostweaver | 1.85 → 1.16 | −17.0 → −7.7 |
| Stormcaller | 1.79 → 1.35 | −7.3 → 0.0 |
| Cleric | 1.32 → 1.02 | −9.8 → −4.7 |
| Hexer | 1.23 → 0.89 (0.69) | −2.4 → +0.3 (+2.5) |

- **The spread narrows.** Win points across classes ran from −17 to +14. They now run from −8 to +9, close to the sheet's band of −8 to +8; only the Bramble knight sits just above it.
- **The Frostweaver is still the weakest,** at the band's edge. What's left is damage, not survival: it deals 0.6× an average unit.
- **The Hexer with Defense 2 overshot.** It went from among the most knocked out to among the least, so the draft gives it HP alone.
- **Free play moves less.** Its win rates are low across the board, so a few points there say little.

## How sure

- **Direction:** fairly sure. The frail tier shows plainly in today's knockouts, and the patched lines move the right classes the right way.
- **Sizes:** first values on the scale. Each is one step.
- **Not done:**
  - No feel read.
  - No upgrade built.
  - The Stormcaller is untested as a fighter: only its line moved, not its abilities.
