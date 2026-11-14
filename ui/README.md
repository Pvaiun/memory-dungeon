# The interface

A phone-sized browser interface on the headless engine: the rogue mode, free play, the party screen, unit sheets, a bestiary and a battle screen that tells each fight one message at a time. It's Vite and plain TypeScript with no framework. It imports the engine as is (`src/engine/`, `src/sim/`) and only reads the engine's state and log, so it never changes a fight: what it shows is what the engine plays. `npm run typecheck` checks it (`tsc -p ui`).

## Running it

- **Locally:** `npm run ui` serves it at http://localhost:5173 and prints a network URL for a phone on the same Wi-Fi. `npm run ui:build` writes `ui/dist` (ignored by git).
- **On the phone:** every push to `main` builds and publishes it to GitHub Pages at https://pvaiun.github.io/memory-dungeon/ (`.github/workflows/pages.yml`). Chrome's "Add to Home screen" installs it full-screen (`public/manifest.webmanifest`).
- **Updates reach the phone by themselves.** Each build's id (the commit) is compiled in and written to `version.json` (`vite.config.ts`). When the app starts and whenever it comes back to the front, `src/update.ts` reads that file past every cache. On a newer build it reloads under `?v=<build>`: never mid-fight, and once a build so a stubborn cache can't loop it. Assets load with the build id on their URLs. Don't tell the director to clear the browser: that wipes the save.
- **Saves** are in localStorage (`src/state.ts`, `src/mode.ts`, `src/rogue/state.ts`). A rogue run saved under another `ROGUE_VERSION` is set aside on load.

## The look

- **The pixel grid:** `src/pixel.ts` is the grid and `src/style.css` the theme. The frame is 270 logical pixels wide, and each logical pixel is a whole number of device pixels (`--u`, picked from the screen), so nothing blurs. `1rem` is 8 logical pixels, and everything is sized from it.
- **Colour carries meaning only:**
  - HP bars go green, yellow, red, and MP is blue;
  - buffs are cool and debuffs warm;
  - a hit's damage is pale;
  - powerful gear is gold and mythic crimson.
- **The font** is Press Start 2P (`public/fonts/`), rasterized once for the field's numbers and words.
- **Numbers on screen:** the data stores 1,000 a point of the documents' scale. Settings → NUMBERS picks how many the interface shows a point (`NUMBER_SCALES` in `src/content.ts`, 3× by default).

## Art and sound

`ui/public/assets/` is committed, so the interface runs without the packs. It's built from the director's art packs by `ui/tools/assets.py` (Python with Pillow). The tool finds each pack by name anywhere under the folder it's given, and skips missing ones, keeping their committed output:

```
python3 -I ui/tools/assets.py <folder with the packs extracted> ui/public/assets
```

- **Classes:** the "Simple 8-bit Sideview Battlers" Style 2 sheets, flipped to face right when drawn. The tool fixes two bugs in the pack. Its chant pose is drawn backwards on every sheet, so it's mirrored back. Its item pose is a placeholder, so it's replaced by the spell pose.
- **Weapons:** the director's own weapon art, a sheet for every weapon (the pack's `weapons.json` and `sheets/`): three frames of 48×32 art pixels in the battlers' layout, the weapon facing right. The pack names a sheet by the weapon's name, so the plain pieces are renamed to their ids (`WEAPON_IDS` in the tool). The strip is drawn in the hand, and its held frame, trimmed, is the weapon's icon in gear lists and among the spoils (a bow's is its drawn frame, whose arrow tells the bows apart). Fist weapons show in lists only (`weaponsUnheld` in the manifest): the fists are the sprite's own. Six sheets are kept in `ui/tools/weapons-fitted/`, in the pack's own format; the tool uses one in place of the pack's sheet of the same name. Four are the haloed axes drawn bigger than their wearer, made smaller (the axe under its glow shrunk in whole diagonal steps, the glow's rings grown back around it). Spellbinder is the director's newer drawing, and Eye of the tempest, a rune sword the pack drew as a sceptre, takes the pack's Spellbinder, its forked-lightning blade, recoloured in the Eye's own gold. Once the pack holds the sheet the game should use, its file there is deleted. A sheet redrawn in the pack needs its file there deleted. `tests/content.test.ts` fails when a weapon has no strip or a strip no weapon.
- **Faces:** the humanoid face pack (`FACES` in the tool).
- **Enemies:** the Retro 8-bit Monster Pack, downscaled at run time by `downscale` in `src/pixel.ts`, which keeps their few colours. The committed sheets are the pack's 300%, so a third of them is its own 1× art: the field draws that, and so does a foe's icon in a list or on its sheet wherever it fits the box (`enemyThumb`), with nothing added to the art's own dark edge; only a sprite shrunk further, which loses that edge, gets a one-pixel outline, on the field as in a list. A few show a different name on screen, to match the sprite that fits them; their lines are written for that name.
- **Backdrops:** composed by the tool from the overworld, dungeon and castle tilesets, one scene a dungeon theme.
- **Icons:**
  - gear that isn't a weapon has an icon of its own, of its kind's shape (a breastplate for plate, a horn for a horn), from the director's gear icon pack (`game_icons`), built by `ui/tools/gear_icons.py` into `gear.png` (`python3 -I ui/tools/gear_icons.py <packs dir> ui/public/assets`). Its table gives each piece a pack icon, the same icon recoloured, or one the tool draws in the pack's style where the pack has none (orbs, vials, bells, tomes, lanterns, totems, skulls, the chalice). An icon belongs to one kind only; a piece missing from the table shows its kind's; empty slots show their slot's, dimmed. Rows and cards draw them at 1.5× (`GEAR_ICON_SCALE` in `src/sheet.ts`), about a weapon's size; on the ground among the sprites they're 1×;
  - a weapon's icon is its own art (`weaponIcon` in `src/pixel.ts`); a weapon kind's in gear lists and an ability tag's come from the iconset (`kindIcon` and `TAG_ICON` in `src/art.ts`);
  - every status that shows, in fights and on sheets, is the director's pick (`STATUS_ICONS` in `ui/tools/skill_icons.py`), on the class icons' tile with the status's own colour on the rim: mostly the status pack's icons, so they read as one family, with effects that do the same thing sharing a motif (a crosshair for "next hit crits", a potion for a free cast). A gear piece's effect can show the piece's icon, a class upgrade's the ability or passive it trains. A status no longer in the content loses its icon when the tool runs;
  - the classes' abilities and passives are the director's picks (`ICONS` in `ui/tools/skill_icons.py`) from three packs: the elemental skill pack, the status icons and KURAI's RPG Skill Icons. Each pack draws its own tile, so the tool lifts every symbol off its tile and draws all 64 the same way: a dark square with a rim in the icon's colour, a near-black outline round the symbol. An icon's colour is what it does (the status it applies: Bleed red, Chill ice, Shock yellow, Burn orange, Sunder brown, Guard steel, Regen green, Weaken purple, Silence and Hidden grey), else its class's. Five KURAI icons draw their frame into the symbol and are lifted by hand-set rules (`LIFT`). Run it after `assets.py` (`python3 -I ui/tools/skill_icons.py <packs dir> ui/public/assets`);
  - a basic attack's icon is its weapon kind's, built by the same tool (`KINDS`) on the same tile with a grey rim, so the abilities stand out beside it: steel for metal, brown for wood and leather, the rune sword's blade in ice. A foe shows its weapon's; beasts show a bite; a weaponless foe shows the wand's if its attack is a theme's bolt, else the fist's (`basicIconKind` in `src/art.ts`). Effects still follow the swing's look and a staff's theme;
  - the foes' abilities use the "64x64 Elemental Skill Variants" pack (`ABILITY_ICON` in `assets.py`);
  - the Destiny Shard is the director's own 16×16 icon, `shard.png`, committed as it is and named in the manifest by hand (`shard`); the tool keeps it.
- **Effects:** the director's "VFX Spells" set, one strip per effect named as the set names it (`fireball`, `crescent_cut`), cropped to its frames, with recoloured and turned copies for looks the set draws in one colour (`VFX_DERIVED` in the tool: a blood claw, a dark fire, a flying arrow). Art only: nothing changes a fight.
  - `src/effects.ts` picks them: each ability its own (`ABILITY_FX`), each basic attack its foe's or weapon's (`ENEMY_BASIC`, a caster's theme, `KIND_FX`; a plain caster's weapon its class's), each status as it lands and as it ticks, and knockouts, revives, summons, misses and wind-ups.
  - `src/battle/effects.ts` plays them in step with the story. A blow's effect plays as each hit lands; a missile flies first (an arrow, a fireball); a second hit or a chain's next foe follows a beat later; the hit's number, statuses and a knockout wait for it.
  - Sizes are whole multiples of the art, big enough to read on a phone: a hit plays at 2× at least (3× a small spark, 1× only art 48 pixels or more), growing while it fits 1.6 times its unit's height, up to 3× on the biggest foes; a status a step smaller, at most 2×. An effect can ask for more (`size`, a heavy blow) or fix its scale (`x`).
  - Each effect stays on screen half a second to 0.9 (about ten frames a second), at any battle speed; FX SPEED (Settings, with DESIGNER on) plays them faster or slower.
  - **FX SIZES** (Settings, with DESIGNER on) sets a look's size by eye: a sample fight that never starts, where one look at a time plays again and again (a party's skill on a plain foe and the boss, a foe's on the party, a status on both). AUTO leaves it to the field; 1×, 1.5×, 2× or 3× fixes it for all of the look's effects (1.5× is Scale3x halved). Choices are kept on the device and used in every fight at once; EXPORT downloads them (`fx-sizes.json`) to be committed as everyone's, into `SIZES` in `src/effects.ts`. RESET forgets the device's.
  - An enlarged effect is redrawn by Scale2x or Scale3x (`vfxSprite` in `src/pixel.ts`), not stretched: its edges are rounded off and its pixels stay the size of the sprites', where a plain stretch showed blocks.
- **Sound and music:** the director's packs, converted by hand to small mono mp3s in `public/audio/`, played by `src/battle/audio.ts`. Browsers start audio only after a tap, and music pauses while the app is in the background.

## For scripted checks

- **Console hooks:**
  - `window.__battle("old_road~ogre_bridge", seed)` starts a fight;
  - `window.__go("party")` opens a screen;
  - `window.__scene` and `window.__driver` are a running fight's field and engine side;
  - `window.__gallery()` shows every sprite, face and status icon as drawn;
  - `window.__look("fireball", by, [targets])` plays an action's effects on a running fight, its hits of 0 (`"basic"` a basic attack; `"status:burn"` and `"tick:burn"` a status's), for checking the art.
- **SAVE RUN**, on a rogue run's end screen, downloads the run's record as JSON: every choice with what was offered beside it, and every free action. It's for balancing from real play.
