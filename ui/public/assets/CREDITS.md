# Art credits

Sprites in this folder are a processed subset of packs the director supplied for the interface:

- `actors/`: "Simple 8-bit Sideview Battlers" (Style 2 sheets) by Willibab / Monsteretrope, CC BY. The chant pose is mirrored back and the item pose replaced by `ui/tools/assets.py`.
- `weapons/`: the same pack's weapon sheets, one per piece of weapon gear; staffs recoloured by element.
- `faces/`: "Humanoid Faces" pack by Willibab, CC BY, one 36×36 face per class.
- `enemies/`: sideview enemy sprite pack (pixel art, RPG Maker MV sideview layout). One chosen recolor each.
- `status/`: "Status effect and various icons", recolored per status by `ui/tools/assets.py`.
- `iconset.png`: Iconset by Willibab / Monsteretrope, CC BY.
- `backdrops/`: scenes composed from Willibab's Overworld, Dungeon and Castle tilesets, CC BY.
- `vfx/`: frames from the "Pixel Animations and Effects Pack" by finalbossblues (timefantasy.net), packed into strips.

The font (`../fonts/`) is Press Start 2P by Cody "CodeMan38" Boisclair, SIL Open Font License 1.1 (`../fonts/OFL.txt`).

Regenerate the sprites with `python3 -I ui/tools/assets.py <packs dir> ui/public/assets`.
