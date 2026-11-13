# Art credits

Sprites in this folder are a processed subset of packs the director supplied for the interface:

- `actors/`: "Simple 8-bit Sideview Battlers" (Style 2 sheets) by Willibab / Monsteretrope, CC BY. The chant pose is mirrored back and the item pose replaced by `ui/tools/assets.py`.
- `weapons/`: the director's own weapon art, one strip per weapon, in the battlers' weapon-sheet layout.
- `faces/`: "Humanoid Faces" pack by Willibab, CC BY, one 36×36 face per class.
- `enemies/`: sideview enemy sprite pack (pixel art, RPG Maker MV sideview layout). One chosen recolor each.
- `status/`: "Status effect and various icons" (the status pack), with some icons from the other two packs below and the gear icons, drawn on one tile by `ui/tools/skill_icons.py`.
- `abilities/`: the "Elemental Skill Variants" pack (the foes' and some of the classes'), with the classes' icons drawn on one tile by `ui/tools/skill_icons.py` from that pack, the status icons and "RPG Skill Icons" by KURAI (kurai7.itch.io), licensed asset-pack art. The classes' passives in `status/` are drawn the same way.
- `iconset.png`: Iconset by Willibab / Monsteretrope, CC BY.
- `gear.png`: the director's gear icon pack (16×16 equipment icons, licensed asset-pack art), some recoloured, with icons drawn in its style by `ui/tools/gear_icons.py`.
- `backdrops/`: scenes composed from Willibab's Overworld, Dungeon and Castle tilesets, CC BY.
- `vfx/`: frames from the "Pixel Animations and Effects Pack" by finalbossblues (timefantasy.net), as the director's "VFX Spells" set names them, packed into strips; some recoloured or turned by `ui/tools/assets.py`.

Sound (`../audio/`): a retro sound effects pack and two music tracks ("Menu", "Battle Theme") the director supplied, converted to mono mp3. The director sourced them under a free licence.

The font (`../fonts/`) is Press Start 2P by Cody "CodeMan38" Boisclair, SIL Open Font License 1.1 (`../fonts/OFL.txt`).

Regenerate the sprites with `python3 -I ui/tools/assets.py <packs dir> ui/public/assets`.
