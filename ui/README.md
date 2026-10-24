# The interface

A browser interface on the headless engine, so the director can set up a party and watch the core set play. It's a design tool, not Memory's game tab: nothing here runs in Memory, and the code stays small on purpose.

```
npm install
npm run ui          # serves it at http://localhost:5173
npm run ui:build    # writes ui/dist (ignored by git)
```

It's Vite and plain TypeScript, no framework. The game logic is the repo's engine, imported as is (`src/engine/`, `src/sim/`); the interface only reads the engine's state and its log. `npm run typecheck` checks it with `tsc -p ui`.

## Screens

- **Fight:** the seven runs with their fights listed, a "Run it" button per run and a "Fight only this" button per encounter (a fresh fight, nothing carried in), and the seed.
- **Party:** the 16 classes; pick up to three. The order is the formation's slot order.
- **Formation:** the ten formations with their slot changes and effect, drawn with the party in its slots, and the party's stats in the chosen one.
- **Gear:** per party member, every weapon, armor and amulet the class can use, with what each carries; the stats that result; and the ability order (the first ready ability fires).
- **Classes:** a sheet per class: stats with the documents' pips, the passive, the basic attack and each ability with its target phrase, what it waits for, cooldown, wind-up, MP, and its numbers worked out for the current build.
- **Bestiary:** every enemy with its sprite, text, where it appears, and (in designer view) its hidden stats and abilities.
- **Settings:** the tick length, designer view, sound, auto-continue, and a reset.

The setup is kept in the browser's local storage.

## The battle screen

The party stands on the left facing right, the foes on the right facing left (the NES Final Fantasy arrangement, flipped). Over every unit: its name, a health bar (green to red) with a Shield bar above it, its status icons with their stack count and a yellow timer that runs down, and a wind-up bar with the action's name while it winds up. A thin grey line shows recovery. Knocked-out foes fade, leaving their name.

The party panel below shows each member's HP, MP and Shield, its statuses, and every action with its cooldown bar: grey filling up, green when ready ("waiting" when ready but its condition isn't met, "no MP", "locked" under Stun or Silence), yellow while it winds up.

Damage numbers pop on the target, coloured by element (the legend is in the inspect panel when nothing is selected): bigger and yellow for a crit, with CRIT, WEAK!, resisted, MISS, BLOCKED (Armor zeroed it), IMMUNE, AEGIS! and "N soaked" (a Shield took it) as words. Heals are green, status ticks smaller in their status's colour with the status's name, and a status gained pops as "+NAME stacks" beside the unit. DOWN, RAISED and INTERRUPTED are called out.

The log on the right is the player's log, with ticks. Click a unit on the field or a party card to inspect it: statuses with their time left, every action's state and timings, the passive, gear and stats. In designer view (on by default) enemies show their hidden stats, HP numbers and cooldowns too; turn it off to see what a player would.

Controls: pause and ½×, 1×, 2×, 4× speed (space, 0, 1, 2, 3 on the keyboard), Skip fight (s), auto-continue, designer view and sound. One tick is 500 ms at 1× by default (Settings). The clock pauses briefly while a burst of events plays out, so a Thunderstorm's eight numbers can be read.

Between fights a run shows the party's HP and MP, which carry over; a loss offers a retry on the same seed or a new one.

## Numbers

The data stores every amount at 1,000 per point of the documents' 1–5 scale (`docs/core-set/README.md`). The interface divides by 10: a Knight's HP 5 reads as 500, a plain sword hits for about 110, a Poison tick for 9, a Burn stack for 5 a tick. Percent stats (crit, evasion, resistances, Lifesteal) show as they are. Stacks show as whole numbers; Shield shows its points. `DISPLAY_DIV` in `ui/src/content.ts` is the knob.

## Art

The sprites are a processed subset of the packs the director supplied, built by `ui/tools/assets.py` (Python with Pillow) into `ui/public/assets/`, which is committed so the interface runs without the packs:

```
python3 -I ui/tools/assets.py <folder with the five extracted packs> ui/public/assets
```

- **Classes** use the sideview actor sheets (RPG Maker MV layout: 18 poses × 3 frames), one sheet per class, flipped to face right. Poses: waiting, chanting while winding up, a swing, thrust, shot, skill or spell when an action lands, damage when hit, dead when down, victory when the fight is won. The mapping is in the script: Knight is the blue Templar, Paladin the red one, the Bramble knight and Hoplite the green and brown Hedge knights, the Ranger and Valkyrie the green and blue Wardens, and so on.
- **Enemies** use one recolour each of the sideview enemy sprites, scaled per enemy (bosses bigger). Seven are renamed on screen to match the sprite that fits them, and only on screen: the content's ids, names and behaviour are unchanged, and the documents still use their names. Bandit (a hooded hobgoblin thug, name kept), Archer → Centaur Archer, Shieldman → Shield Knight, Bat → Night Wyrm, Witch → Cursed Tome, Hellhound → Hellcat, Mummy → Crypt Guard. The bestiary shows both names.
- **Status icons** are the 16px status set, one icon per status, recoloured per status (green poison, blue chill, yellow shock, and so on) by the script.
- **VFX** are the pixel effects pack's frames, packed into strips: an element's effect on magical hits, slashes, stabs, impacts, arrows and bites on physical ones, sparkles for buffs and debuffs, a heal, a revive, smoke for summons and splits.
- **Icons** (weapons, armor, amulets, elements) come from the iconset.
- **Backgrounds** are flat gradients per dungeon, placeholders. **Sounds** are synthesized beeps, placeholders.

## Limits, on purpose

- No gear or class ownership: everything is available, as the core set says.
- Single fights start fresh; a run carries HP, MP and knockouts as the rules say.
- The interface reads the engine's log for what happened and its state for bars; it never changes a fight, so what it shows is exactly what `npm run smoke` plays.
- `window.__battle("old_road~ogre_bridge")` starts a fight from the console or a script, for screenshots.
