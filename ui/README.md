# The interface

A browser interface on the headless engine, so the director can set up a party and watch the core set play, on a phone. It's a design tool, not Memory's game tab: nothing here runs in Memory, and the code stays small on purpose.

It looks like a Game Boy game: a 180-pixel-wide frame in four shades, the field on top and short menus below, an 8px pixel font, one number where one will do. The director asked for that after the first version, which was a wide desktop screen full of numbers and text.

## Running it

- **On a phone:** every push to `main` builds it and publishes it to GitHub Pages at **https://pvaiun.github.io/memory-dungeon/** (`.github/workflows/pages.yml`). One-time setup in the repo: Settings → Pages → Build and deployment → Source: "GitHub Actions". On Android, Chrome's menu → "Add to Home screen" installs it as a full-screen app (`public/manifest.webmanifest`).
- **On the same Wi-Fi as a laptop:** `npm run ui` serves it and prints a Network URL; open that on the phone.
- **Locally:** `npm run ui` at http://localhost:5173. `npm run ui:build` writes `ui/dist` (ignored by git).

It's Vite and plain TypeScript, no framework. The game logic is the repo's engine, imported as is (`src/engine/`, `src/sim/`); the interface only reads the engine's state and its log. `npm run typecheck` checks it with `tsc -p ui`.

## The frame

`src/pixel.ts` is the look. The frame is 180 logical pixels wide; each logical pixel is a whole number of device pixels (`--u`), picked from the screen size, so nothing blurs: on a 1080-pixel-wide phone one logical pixel is six device pixels. `1rem` is 8 logical pixels, one row of the font, and the stylesheet sizes everything from it. The four shades are `--c0` (dark) to `--c3` (light); Settings offers three palettes (the director's green reference, a Game Boy Pocket grey-green, and a peach one).

The font is Press Start 2P (SIL OFL, `public/fonts/`), the one tell of the period; the field draws its numbers and words from the same font, rasterized once into 8×8 bitmaps.

Sprites are the director's packs quantized to the four shades: box-downscaled by a whole factor (actors by 3, enemies by 2–6 depending on their size, bosses allowed bigger), brightness stretched per sprite, a light ordered dither, and a dark outline forced around every sprite. VFX strips are inverted so flashes read dark on the light field. Every field frame is snapped to the palette at the end, so fades and edges stay in four shades.

## Screens

The field on top always shows something: the party in its formation behind the menus, the chosen class on the gear screen and class sheets (at twice the size), the enemy in the bestiary. Below it:

- **Home:** the menu. **Fight:** the seven runs, then a run's fights (foe count per fight, ★ for the boss) and "run all"; the seed row re-rolls on tap.
- **Party:** the three slots with ▲ ▼ × and the 16 classes with a face and a role word; tap to add or remove.
- **Formation:** the current formation's slots with their stat codes, and the ten to choose from.
- **Gear:** a tab per member; the three slots open a list (two lines each: name, then its codes); the member's stats; the ability order with ▲ ▼.
- **Classes** and **Bestiary:** a list, then a sheet: stats as pips of the class's base, the kit as name, cooldown and MP, and the documents' sentence for each. Designer view adds the worked-out numbers and hidden enemy stats.
- **Settings:** palette, tick length, sound, auto-next, designer view, number size, reset.

Codes: stats are HP MP REG ATK MAG ARM CRT AGG (and EVA ACC CRD DBL THN LFS SPH for the special ones); statuses PSN RGN SHD MGT WKN GRD STN SLW HST TNT BRN CHL SHK WRD SND SIL HID ROT CLR AEG DOOM BLW. Gear codes read "SLASH/10 ARM+1": the weapon's damage kind and ticks between swings, then stat changes in points of the documents' scale.

## The battle screen

The field: party on the left facing right, foes on the right, in the formation's lines. Foes carry a small HP bar under their feet (a Shield line above it); a wind-up bar appears over a unit's head while it winds up; a hit flashes the sprite inverted; knocked-out foes dissolve. Numbers pop over the target: the damage, "!" and double size for a crit, a word under it for WEAK, RESIST, SHIELD (part soaked) or a status tick's code; MISS, BLOCK, AEGIS, IMMUNE, DOWN, UP as words. Tap a unit for the ▼ marker and its inspect box.

Below: a row per party member (face, name, HP bar and number, MP bar and number, status codes with stacks); the foes by kind with how many stand; a three-line message box with the fight in short lines ("WOLF A→KNIGHT 11", "KNIGHT SHIELD BASH", "→WOLF A 15", "WOLF A +PSN2", "WOLF A DOWN"), scrollable; and the controls: ◀ menu, || pause, 1 2 4 speed, >> skip, and the tick. Keys: space, 1, 2, 3, s, Escape.

The inspect box (tap a unit, or a foe's name) shows its HP, MP, status codes with stacks and ticks left, and its actions with "RDY" or ticks to go (party always; foes in designer view).

A fight ends on a box: VICTORY or DEFEAT, the tick, and per member the damage out, in, and HP left; then NEXT, AGAIN, NEW SEED or MENU. In a run HP and MP carry over; auto-next (Settings) goes straight on.

## Numbers

The data stores every amount at 1,000 per point of the documents' 1–5 scale (`docs/core-set/README.md`). The interface shows **10 per point**: a Knight has 50 HP, a plain sword hits for about 11, a Poison tick for 1, a boss has 900 HP. Percent stats (crit, evasion, resistances, Lifesteal) show as they are. Settings → NUMBERS: BIG switches to 100 per point (`DISPLAY_DIV` in `src/content.ts`) for reading small ticks. Shield shows its points.

## Art

The sprites are a processed subset of the packs the director supplied, built by `ui/tools/assets.py` (Python with Pillow) into `ui/public/assets/`, which is committed so the interface runs without the packs:

```
python3 -I ui/tools/assets.py <folder with the five extracted packs> ui/public/assets
```

- **Classes** use the sideview actor sheets (RPG Maker MV layout: 18 poses × 3 frames), one sheet per class, flipped to face right. Poses: waiting, chanting while winding up, a swing, thrust, shot, skill or spell when an action lands, damage when hit, dead when down, victory when the fight is won. The mapping is in the script. The 16×16 faces in the lists are the head of each waiting pose.
- **Enemies** use one recolour each of the sideview enemy sprites. Seven are renamed on screen to match the sprite that fits them, and only on screen: the content's ids, names and behaviour are unchanged, and the documents still use their names. Bandit (a hooded hobgoblin thug, name kept), Archer → Centaur Archer, Shieldman → Shield Knight, Bat → Night Wyrm, Witch → Cursed Tome, Hellhound → Hellcat, Mummy → Crypt Guard. The bestiary shows both names.
- **VFX** are the pixel effects pack's frames, packed into strips: an element's effect on magical hits, slashes, stabs, impacts, arrows and bites on physical ones, sparkles for buffs and debuffs, a heal, a revive, smoke for summons and splits.
- **Status icons** and the **iconset** are still built and committed, but the Game Boy layout shows statuses as codes and gear as words, so the interface doesn't load them.
- **Backgrounds** are a plain light field with a dithered ceiling or floor and a few specks per dungeon. **Sounds** are synthesized beeps, placeholders.

`window.__gallery()` in the browser console shows every sprite as quantized, for checking the art.

## Limits, on purpose

- No gear or class ownership: everything is available, as the core set says.
- Single fights start fresh; a run carries HP, MP and knockouts as the rules say.
- The interface reads the engine's log for what happened and its state for bars; it never changes a fight, so what it shows is exactly what `npm run smoke` plays.
- `window.__battle("old_road~ogre_bridge")` starts a fight and `window.__go("party")` opens a screen from the console or a script, for screenshots.
