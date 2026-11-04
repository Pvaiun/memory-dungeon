# The interface

A phone-sized browser interface on the headless engine: the rogue mode, free play, the party screen, unit sheets, a bestiary and a battle screen that tells each fight one message at a time. It's a design tool, not Memory's game tab. It's Vite and plain TypeScript with no framework. It imports the engine as is (`src/engine/`, `src/sim/`) and only reads the engine's state and log, so it never changes a fight: what it shows is what the engine plays. `npm run typecheck` checks it (`tsc -p ui`).

## Running it

- **Locally:** `npm run ui` serves it at http://localhost:5173 and prints a network URL for a phone on the same Wi-Fi. `npm run ui:build` writes `ui/dist` (ignored by git).
- **On the phone:** every push to `main` builds and publishes it to GitHub Pages at https://pvaiun.github.io/memory-dungeon/ (`.github/workflows/pages.yml`). Chrome's "Add to Home screen" installs it full-screen (`public/manifest.webmanifest`).
- **Updates reach the phone by themselves.** Each build's id (the commit) is compiled in and written to `version.json` (`vite.config.ts`). When the app starts and whenever it comes back to the front, `src/update.ts` reads that file past every cache. On a newer build it reloads under `?v=<build>`: never mid-fight, and once a build so a stubborn cache can't loop it. Assets load with the build id on their URLs. Don't tell the director to clear the browser: that wipes the save.
- **Saves** are in localStorage (`src/state.ts`, `src/rogue-state.ts`). A rogue run saved under another `ROGUE_VERSION` is set aside on load.

## The look

- **The pixel grid:** `src/pixel.ts` is the grid and `src/style.css` the theme. The frame is 270 logical pixels wide, and each logical pixel is a whole number of device pixels (`--u`, picked from the screen), so nothing blurs. `1rem` is 8 logical pixels, and everything is sized from it.
- **Colour carries meaning only:**
  - HP bars go green, yellow, red, and MP is blue;
  - buffs are cool and debuffs warm;
  - physical damage is pale and magical violet;
  - powerful gear is gold and mythic crimson.
- **The font** is Press Start 2P (`public/fonts/`), rasterized once for the field's numbers and words.
- **Numbers on screen:** the data stores 1,000 a point of the documents' scale. Settings → NUMBERS picks how many the interface shows a point (`NUMBER_SCALES` in `src/content.ts`, 3× by default).

## Art and sound

`ui/public/assets/` is committed, so the interface runs without the packs. It's built from the director's art packs by `ui/tools/assets.py` (Python with Pillow). The tool finds each pack by name anywhere under the folder it's given, and skips missing ones, keeping their committed output:

```
python3 -I ui/tools/assets.py <folder with the packs extracted> ui/public/assets
```

- **Classes:** the "Simple 8-bit Sideview Battlers" Style 2 sheets, flipped to face right when drawn. The tool fixes two bugs in the pack. Its chant pose is drawn backwards on every sheet, so it's mirrored back. Its item pose is a placeholder, so it's replaced by the spell pose.
- **Weapons:** the same pack's weapon sheets, drawn in the hand (`WEAPON_SPRITES` in the tool). Kinds with no art of their own borrow a strip (`WEAPON_STAND_INS` in `src/art.ts`). Fist weapons show nothing.
- **Faces:** the humanoid face pack (`FACES` in the tool).
- **Enemies:** the Retro 8-bit Monster Pack, downscaled at run time by `downscale` in `src/pixel.ts`, which keeps their few colours. A few show a different name on screen, to match the sprite that fits them.
- **Backdrops:** composed by the tool from the overworld, dungeon and castle tilesets, one scene a dungeon theme.
- **Icons:**
  - gear and ability tags come from the iconset (`gearIcon` in `src/art.ts`);
  - statuses are the pack's 16px icons recoloured per status (`STATUSES` in the tool), with stand-ins for newer statuses (`STAND_INS`) until the director's art pass;
  - abilities use the "64x64 Elemental Skill Variants" pack (`ABILITY_ICON`).
- **Effects:** an action's look picks its icon and effect, art only (`ABILITY_LOOK`, `ENEMY_LOOK`, `PIECE_LOOK`, `KIND_LOOK` in `src/art.ts`).
- **Sound and music:** the director's packs, converted by hand to small mono mp3s in `public/audio/`, played by `src/battle/audio.ts`. Browsers start audio only after a tap, and music pauses while the app is in the background.

## For scripted checks

- **Console hooks:**
  - `window.__battle("old_road~ogre_bridge", seed)` starts a fight;
  - `window.__go("party")` opens a screen;
  - `window.__scene` and `window.__driver` are a running fight's field and engine side;
  - `window.__gallery()` shows every sprite, face and status icon as drawn.
- **SAVE RUN**, on a rogue run's end screen, downloads the run's record as JSON: every choice with what was offered beside it, and every free action. It's for balancing from real play.
