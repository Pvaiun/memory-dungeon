# The interface

A browser interface on the headless engine, so the director can set up a party and watch the core set play, on a phone. It's a design tool, not Memory's game tab: nothing here runs in Memory, and the code stays small on purpose.

**Third version (Oct 24, 2026).** The director's review of the Game Boy version asked for less Game Boy and more Dragon Quest: colour, because the two-tone field lost the sprites, the elements, the statuses and the numbers; a fight that can be followed, told in English the way Pokémon and Dragon Quest tell one; and menus that use the screen instead of scrolling a strip under a big portrait. This version keeps what worked (the chunky double-bordered windows, the pixel font, the short stat codes, the sprites' pixel grid) and changes the rest.

## Running it

- **On a phone:** every push to `main` builds it and publishes it to GitHub Pages at **https://pvaiun.github.io/memory-dungeon/** (`.github/workflows/pages.yml`). One-time setup in the repo: Settings → Pages → Build and deployment → Source: "GitHub Actions". On Android, Chrome's menu → "Add to Home screen" installs it as a full-screen app (`public/manifest.webmanifest`).
- **On the same Wi-Fi as a laptop:** `npm run ui` serves it and prints a Network URL; open that on the phone.
- **Locally:** `npm run ui` at http://localhost:5173. `npm run ui:build` writes `ui/dist` (ignored by git).

It's Vite and plain TypeScript, no framework. The game logic is the repo's engine, imported as is (`src/engine/`, `src/sim/`); the interface only reads the engine's state and its log. `npm run typecheck` checks it with `tsc -p ui`.

## The look

`src/pixel.ts` is the pixel grid, `src/style.css` the theme. The frame is 270 logical pixels wide; each logical pixel is a whole number of device pixels (`--u`), picked from the screen size, so nothing blurs: on a 1080-pixel-wide phone one logical pixel is four device pixels, and a row of the 8px font is 32. `1rem` is 8 logical pixels and the stylesheet sizes everything from it, so 33 characters fit a line (the Game Boy frame had 22).

Windows are the Dragon Quest kind: a dark fill, a light double border, light text. Colour carries meaning and nothing else: HP bars go green, yellow, red; MP is blue; a Shield is a pale segment on the HP bar; buffs are cool, debuffs warm; each element has its own colour (fire orange, ice cyan, lightning yellow, wind green, earth tan, light cream, dark violet) on its icon, its damage number and its ability's name; a gear code reads green when it raises a stat and red when it lowers one; powerful gear is gold. Settings offers a **day** theme (cream windows, dark text) with the same meanings.

The font is Press Start 2P (SIL OFL, `public/fonts/`); the field draws its numbers and words from the same font, rasterized once into 8×8 bitmaps, in any colour, with a dark outline.

## Screens

Every screen is its own layout: a header with ◀, windows, and lists that scroll inside their own window, never the whole screen.

- **Home:** the party standing in its formation in a strip, then the menu: FIGHT, PARTY, CLASSES, BESTIARY, SETTINGS.
- **Fight:** the seven runs with a line each, then a run's fights with their foes ("Shield Knight, Centaur Archer ×2", ★ for the boss) and RUN ALL; the seed with a NEW SEED button.
- **Party:** party, formation and gear in one place. The formation at the top with ◀ ▶ (tap its name for the list of ten with a line each). Three slot cards, each with its slot's name and stat changes, the member at twice their size, and their name. Tap a slot to select it, another to swap them, the same one again (or SHEET) for its sheet; tap a class in the roster grid below to put it in the selected slot; REMOVE empties it. With no slot selected, tapping a class fills the next empty slot.
- **Unit sheet** (from a slot, or CLASSES): the whole class in one page: sprite and stats with the change gear and formation make shown green or red beside each; the class's sentence; the passive with its text; the three gear slots with their icons, names and codes (tap one for the picker); the three abilities with their icon, MP and cooldown, the documents' sentence, and numbers to tap in pairs to change their order; the basic attack; the weapon kinds and armor weight the class can use. ADD TO PARTY when there's room.
- **Gear picker:** everything that fits, with icons: a weapon's kind and speed ("SLASH/10"), its hit for this unit, and its stat codes; NOTHING for armor and amulets. Tap to equip and return.
- **Classes:** the 16 with a face and a role word, to the sheet. **Bestiary:** every enemy with a likeness and its rank, to a sheet: sprite, description, elements it resists or is weak to, passives, abilities with their sentences, its basic attack, and where it's found. Designer view adds hidden stats and worked-out numbers.
- **Settings:** theme, default speed, sound, auto-next, designer view, number size, reset.

## The battle screen

One field, 270×224: the party on the left facing right, standing on their formation's lines (back, middle, front) at twice their art size, the foes on the right facing left at theirs, on a backdrop per dungeon (sky and grass for the Old Road, embers for the Fire Mine, rain for the towers). Over the field: a foe's HP bar under its feet in the bar's colour with a pale Shield segment; under everyone, their statuses as 8×8 glyphs with the stack count in the corner; a wind-up bar over a head; damage numbers at double size that rise and fade (yellow with CRITICAL under them for crits, the element's colour for spells, a WEAK! or RESIST or SHIELD label), heals in green, status names with their glyph; the VFX strips in colour, 64 pixels for single targets. A hit flashes and shakes the sprite; a knocked-out foe fades; party members use their sheets' poses (chanting while winding up, damage, dead, victory).

Below: the party's rows (face, name, HP bar and number, MP bar and number, a strip of status glyphs); the foes by kind with how many stand (tap one to inspect); the **message box**; and the controls.

**The fight is told in beats** (`src/battle/narrate.ts`, `src/battle/battle.ts`). A beat is one thing to read as a whole: an action and what it did, a status ticking, a knockout. The engine's clock stops while a beat is on screen, and its lines appear one after another, so the field, the numbers and the words are the same thing at the same time. A beat's lines come straight from the engine's log in plain English, no flourish: "KNIGHT ATTACKS!" "BANDIT B TAKES 10." "PYRO CASTS FIREBOLT!" "BANDIT A TAKES 18 AND BURNS (7)." "CRITICAL! BANDIT C TAKES 15!" "KNIGHT DODGES!" "CLERIC USES PURIFY ON RANGER!" "RANGER'S POISON IS CLEANSED." "BANDIT C TAKES 1 FROM POISON." "SNAKE A IS DEFEATED!" "KNIGHT IS KNOCKED OUT!" "3 BANDITS DRAW NEAR!" "THE OGRE CHIEF AND 2 BANDITS DRAW NEAR!" An action line carries the icon of its element or kind. Older beats dim; the box keeps the last few, and tapping it (or LOG) opens the whole fight's log with tick marks.

How long a beat holds comes from its weight: about half a second plus a third of a second per line at 1×, halved at 2× and quartered at 4×. Between beats the engine runs at half a second per tick at 1×. The controls: ◀ menu, II pause, **STEP** (plays exactly one beat and pauses, so a fight can be tapped through), 1× 2× 4×, >> (plays the rest at once; the log still gets every line), and the tick. Keys: space, n, 1, 2, 4, s, l, Escape.

**Inspect:** tap a unit on the field, a party row or a foe's name. The box shows its HP (and MP for the party), every status with its glyph, stacks and ticks left, its actions with READY, the ticks to go or CASTING… (a foe's abilities, and its basic attack's kind and speed; cooldowns only in designer view), and SHEET, which pauses the fight and opens the unit's full sheet over it.

A fight ends on VICTORY or DEFEAT: the tick, and per member the damage dealt, taken and HP left; then NEXT, AGAIN, NEW SEED, MENU or LOG. In a run HP and MP carry over; auto-next (Settings) goes straight on.

## Numbers

The data stores every amount at 1,000 per point of the documents' 1–5 scale (`docs/core-set/README.md`). The interface shows **10 per point**: a Knight has 50 HP, a plain sword hits for about 11, a Poison tick for 1, a boss has 900 HP. Percent stats (crit, evasion, resistances, Lifesteal) show as they are. Settings → NUMBERS: BIG switches to 100 per point (`DISPLAY_DIV` in `src/content.ts`) for reading small ticks. Shield shows its points.

## Art

The packs are pixel art drawn at three image pixels per art pixel (the iconset at two). `ui/tools/assets.py` (Python with Pillow) builds `ui/public/assets/` from the five extracted packs, which is committed so the interface runs without them:

```
python3 -I ui/tools/assets.py <folder with the five extracted packs> ui/public/assets
```

- **Classes** use the sideview actor sheets (RPG Maker MV layout: 18 poses × 3 frames), one sheet per class, shrunk to their art size by the tool (a 144px frame becomes 48px), flipped to face right. The 16×16 faces in the lists are the head of each waiting pose.
- **Enemies** use one recolour each of the sideview enemy sprites, as drawn. At run time `downscale` in `src/pixel.ts` takes one art pixel per block (the commonest colour, aligned to the art's own grid, which starts at a different offset in each sprite), so they keep their three or four colours instead of being averaged or dithered; crowded fights shrink them further the same way with an outline (two thirds for four or five foes, half for six or more; bosses never). Seven are renamed on screen to match the sprite that fits them, and only on screen: the content's ids, names and behaviour are unchanged, and the documents still use their names. Bandit (a hooded hobgoblin thug, name kept), Archer → Centaur Archer, Shieldman → Shield Knight, Bat → Night Wyrm, Witch → Cursed Tome, Hellhound → Hellcat, Mummy → Crypt Guard. The bestiary shows both names.
- **The iconset** (16 columns of 32px cells, 16×16 art pixels each) gives the gear its icons (`gearIcon` in `src/art.ts`: a kind's icon in a colour, staffs by element, armor by weight, charms for the resistance amulets, gold for powerful pieces) and the abilities their tags (an element, a sword, a spear, a hammer, a heart, up or down arrows, a shield).
- **Statuses** are 8×8 glyphs drawn by hand in `src/art.ts` (a skull for Poison, a flame for Burn, a snowflake for Chill, a bolt for Shock, chevrons for Haste and Slow, a target for Taunt, an eye for Hidden, an hourglass for Doom, a wall for Bulwark…), each in its status's colour, so they fit under a sprite and in a party row. The pack's 16px status icons are still built and committed (recoloured per status) but not shown; swapping the glyph table for them is a small change if the director prefers them.
- **VFX** are the pixel effects pack's frames, packed into strips: an element's effect on magical hits, slashes, stabs, impacts, arrows and bites on physical ones, sparkles for buffs and debuffs, a heal, a revive, smoke for summons and splits.
- **Backgrounds** are flat bands of colour with a horizon and a few specks per dungeon. **Sounds** are synthesized beeps, placeholders.

`window.__gallery()` in the browser console shows every sprite and glyph as drawn, for checking the art.

## Decisions taken here, for the director to react to

- **Colour over the Game Boy palette,** as asked. The windows went Dragon Quest (dark, double-bordered) rather than Pokémon (light), to make coloured icons, bars and numbers pop; the day theme is the other way round.
- **A fight is told in beats,** and the clock waits for the reader. This is the one real change of model: before, the engine ran at a tick rate and the log scrolled past it; now the text sets the pace and the engine fills the gaps. The three speeds scale the reading time; STEP is the tap-through mode. If 1× reads too slow or 4× too fast, the four numbers at the top of `src/battle/battle.ts` are the knobs.
- **Wind-ups are announced** ("PYRO READIES FIREBOLT…") so a long cast is a visible promise, as the director liked the wind-ups. Status ends are told quietly ("KNIGHT'S GUARD WEARS OFF."). Multi-target spells get a line per target, up to five per beat, then continue in the next.
- **The party stands at twice its art size,** because the packs draw heroes half the size of monsters and the heroes looked lost beside them. The pixel grids of the two sides differ as a result.
- **Party, formation and gear are one screen,** with the unit sheet as the place to read and change one member. Swaps are tap-then-tap, as asked.

## Limits, on purpose

- No gear or class ownership: everything is available, as the core set says.
- Single fights start fresh; a run carries HP, MP and knockouts as the rules say.
- The interface reads the engine's log for what happened and its state for bars; it never changes a fight, so what it shows is exactly what `npm run smoke` plays.
- `window.__battle("old_road~ogre_bridge", seed)` starts a fight and `window.__go("party")` opens a screen from the console or a script, for screenshots.
