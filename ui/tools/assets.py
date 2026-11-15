#!/usr/bin/env python3
"""
Builds ui/public/assets from the director's sprite packs.

    python3 -I ui/tools/assets.py <dir with the packs extracted> ui/public/assets

The packs are found by name anywhere under the input dir, so they can be
unzipped as they come: the "Simple 8-bit Sideview Battlers" (its Style 2
sv_actors are the class sheets), the director's weapon art (weapons.json and
its sheets), the sideview enemies, the 400 "Status effect and various icons", Willibab's Iconset,
humanoid faces (Willi_HFP), the overworld / dungeon / castle / town tilesets
(1x), and the "VFX Spells" pack. A pack that isn't there is skipped and its output kept
as committed, so the output can be rebuilt one pack at a time.

The output is committed, so the interface runs without the packs: one actor
sheet per class at its art size (with two fixes to the pack: the "chant" pose
is drawn turned around, so it's mirrored back; the "item" pose is a
placeholder sprite, so it's replaced by "spell"), one sprite per enemy, one
weapon strip per weapon (facing right, as drawn), one face per class, the foes'
ability icons (the statuses' and the classes' icons are ui/tools/skill_icons.py's), the iconset, VFX frame strips, one backdrop
per dungeon composed from the tiles, and manifest.json, which maps content ids
to files and holds the enemy renames.
"""
import json, os, sys, glob
from pathlib import Path
from PIL import Image

SRC, OUT = Path(sys.argv[1]), Path(sys.argv[2])

def find_dir(*names):
    """The first directory under SRC whose path ends with these names (in order), else None."""
    for p in sorted(SRC.rglob(names[-1])):
        if p.is_dir() and all(part in p.parts for part in names[:-1]):
            return p
    return None

def find_file(name):
    for p in sorted(SRC.rglob(name)):
        if p.is_file():
            return p
    return None

ACTORS = find_dir("Style 2", "sv_actors") or find_dir("sv_actors")
# The director's weapon art: the folder that holds weapons.json and its sheets.
WEAPON_ART = next((p.parent for p in sorted(SRC.rglob("weapons.json")) if (p.parent / "sheets").is_dir()), None)
# The enemies: the "Sideview Enemies" folder, or the same sprites as the Retro 8-bit Monster Pack's 300% Style 2.
ENEMIES = find_dir("Sideview Enemies") or find_dir("300%", "Style 2")
CAMPFIRE = find_file("Small_sheet.png")
CHESTS = find_file("!D_CHEST.png")
ICONSET = find_file("Iconset.png")
HFACES = find_file("Humanoid_Faces_1x.png")
OW = find_dir("Tileset 1x")
DUNGEON = find_dir("1x", "tilesets")
CASTLE = find_dir("1x", "Tileset")
TOWN = find_file("TOWNS_ALL_1x.png")
TOWN_INSIDE = find_file("TOWN_INSIDE.png")

def ensure(d):
    os.makedirs(d, exist_ok=True)

ensure(OUT)
manifest = {"classes": {}, "enemies": {}, "statuses": {}, "vfx": {}, "weapons": {}, "faces": {}, "backdrops": {}, "frame": 64}
if (OUT / "manifest.json").exists():
    manifest.update(json.load(open(OUT / "manifest.json")))

def mode_downscale(im, k, threshold=0.5):
    """One art pixel per k×k block: the commonest opaque colour, or transparent if the block is mostly empty.
    The packs draw at three image pixels per art pixel; this recovers the art without blending or dithering."""
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.width // k, im.height // k
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    op = out.load()
    for y in range(h):
        for x in range(w):
            counts = {}
            cov = 0
            for yy in range(k):
                for xx in range(k):
                    r, g, b, a = px[x * k + xx, y * k + yy]
                    if a < 128:
                        continue
                    cov += 1
                    counts[(r, g, b)] = counts.get((r, g, b), 0) + 1
            if cov < threshold * k * k:
                continue
            best = max(counts.items(), key=lambda kv: (kv[1], -(kv[0][0] * 299 + kv[0][1] * 587 + kv[0][2] * 114)))[0]
            op[x, y] = best + (255,)
    return out

# ─── Classes → actor sheets (RPG Maker MV layout: 9×6 frames of 48×48, 18 poses × 3) ───
CLASSES = {
    "knight": "TEMPLAR_BLUE", "cleric": "VIZIER_BLUE", "ranger": "WARDEN_GREEN", "bramble_knight": "HEDGE_KNIGHT_GREEN",
    "hoplite": "HEDGE_KNIGHT_BROWN", "paladin": "TEMPLAR_RED", "valkyrie": "WARDEN_BLUE", "bard": "SKALD_RED",
    "hexer": "WITCH_PURPLE", "monk": "MYSTIC_BROWN", "assassin": "SULTAN_DARK", "vampire": "REAPER_DARK",
    "pyromancer": "SORCEROR_RED", "frostweaver": "MAGUS_BLUE", "stormcaller": "BATTLEMAGE_PURPLE", "geomancer": "SHAMAN_GREEN",
}
FRAME = 48
POSE = {"walk": 0, "wait": 1, "chant": 2, "guard": 3, "damage": 4, "evade": 5, "thrust": 6, "swing": 7, "missile": 8, "skill": 9, "spell": 10, "item": 11, "escape": 12, "victory": 13, "dying": 14, "abnormal": 15, "sleep": 16, "dead": 17}

def frame_box(pose, f):
    m = POSE[pose]
    x, y = ((m % 3) * 3 + f) * FRAME, (m // 3) * FRAME
    return (x, y, x + FRAME, y + FRAME)

def fix_sheet(sheet):
    """The pack's "chant" pose is drawn turned around on every Style 2 sheet (measured: each class's chant
    frame matches its wait frame only when mirrored), so it's mirrored back, keeping the figure where the pack
    put it: one step back from its waiting spot. Its "item" pose is a placeholder of another sprite: replaced
    with "spell"."""
    for f in range(3):
        box = frame_box("chant", f)
        fr = sheet.crop(box)
        bb = fr.split()[3].getbbox()
        if not bb:
            continue
        flipped = fr.transpose(Image.FLIP_LEFT_RIGHT)
        fb = flipped.split()[3].getbbox()
        fixed = Image.new("RGBA", (FRAME, FRAME), (0, 0, 0, 0))
        fixed.paste(flipped.crop(fb), (bb[0], bb[1]))
        sheet.paste(fixed, box)
    for f in range(3):
        sheet.paste(sheet.crop(frame_box("spell", f)), frame_box("item", f))
    return sheet

if ACTORS:
    ensure(OUT / "actors")
    for cls, name in CLASSES.items():
        sheet = fix_sheet(mode_downscale(Image.open(ACTORS / f"{name}.png"), 3))
        sheet.save(OUT / "actors" / f"{cls}.png")
        manifest["classes"][cls] = f"actors/{cls}.png"
    manifest["actorFrame"] = FRAME
    print(f"actors: {len(CLASSES)} sheets from {ACTORS}")
else:
    print("actors: pack not found, kept")

# ─── Enemies → (sprite, recolor variant 1–4, draw scale, display name or None to keep the content's) ───
ENEMY = {
    "wolf": ("Summon_Fenrir", 1, 0.7, None),
    "snow_wolf": ("Summon_Fenrir", 2, 0.7, None),
    "bandit": ("Humanoid_Hobling", 1, 0.9, None),
    "archer": ("Humanoid_Centaur", 3, 0.95, "Centaur Archer"),
    "snake": ("Reptile_Joggorm", 1, 0.8, None),
    "shieldman": ("Humanoid_BloodKnight", 4, 1.0, "Shield Knight"),
    "ogre": ("Humanoid_Goliath", 1, 1.1, None),
    "ogre_chief": ("Humanoid_Goliath", 4, 1.5, None),
    "skeleton": ("Undead_Tzultans", 3, 0.95, None),
    "bat": ("Aerial_Nachtwyrm", 3, 0.8, "Night Wyrm"),
    "ghost": ("Elemental_ManaSpirit", 1, 0.9, None),
    "ice_ghost": ("Elemental_ManaSpirit", 2, 0.9, None),
    "bone_priest": ("Undead_Crossairs", 1, 1.0, None),
    "witch": ("Humanoid_Hobzard", 2, 1.0, None),          # a hooded figure in a pointed purple hat: the witch, no rename
    "lich": ("Undead_Lich", 1, 1.0, None),
    "ghoul": ("Undead_Ghoul", 1, 0.95, None),
    "reaper": ("Demon_Titan", 1, 1.3, None),
    "wraith": ("Undead_Reaper", 1, 0.95, None),
    "silent_one": ("Undead_Warlord", 1, 1.5, None),
    "hellhound": ("Summon_Fenrir", 3, 0.7, None),          # the wolves' red Fenrir: a hound of fire, no rename
    "lava_slime": ("Elemental_Lodrop", 4, 1.0, None),
    "mini_slime": ("Elemental_Lodrop", 4, 0.6, None),
    "bomb_bug": ("Insect_Antlion", 1, 0.9, None),
    "fire_imp": ("Demon_Onimp", 1, 0.8, None),
    "fire_giant": ("Demon_Grandesh", 3, 1.5, None),
    "ice_spirit": ("Elemental_Hydrop", 1, 0.9, None),
    "ice_golem": ("Elemental_Rugigas", 3, 1.1, None),
    "ice_titan": ("Demon_Hytraal", 1, 1.5, None),
    "wisp": ("Elemental_ManaSpirit", 3, 0.5, None),
    "leech": ("Demon_Parasite", 1, 0.8, None),
    "storm_queen": ("Insect_Vespula", 1, 1.5, None),
    "drone": ("Insect_Vespula", 4, 0.6, None),
    "storm_king": ("Aerial_Aethon", 4, 1.5, None),
    "soldier": ("Insect_Antwolf", 4, 0.75, None),
    "troll": ("Humanoid_Goliath", 2, 1.1, None),
    "mummy": ("Undead_Vanguard", 1, 1.0, "Crypt Guard"),  # the content's mummy hides behind a big shield: this sprite carries one
}
if ENEMIES:
    ensure(OUT / "enemies")
    for eid, (sprite, variant, scale, rename) in ENEMY.items():
        name = sprite if variant == 1 else f"{sprite}_{variant}"
        src = ENEMIES / f"{name}.png"
        if not src.exists() and variant == 1:
            src = ENEMIES / f"{sprite}_1.png"
        if not src.exists():
            raise SystemExit(f"missing {src}")
        im = Image.open(src).convert("RGBA")
        im.save(OUT / "enemies" / f"{eid}.png")
        manifest["enemies"][eid] = {"file": f"enemies/{eid}.png", "w": im.width, "h": im.height, "scale": scale, **({"name": rename} if rename else {})}
    print(f"enemies: {len(ENEMY)} sprites")
else:
    print("enemies: pack not found, kept")

# ─── Colour ramps, darkest to lightest: the foes' ability icons are recoloured onto them ───
RAMPS = {
    "orange": None,
    "green": [(10, 40, 15), (15, 70, 25), (30, 130, 40), (90, 210, 70), (225, 255, 200)],
    "blue": [(10, 20, 50), (15, 35, 90), (25, 70, 170), (80, 150, 240), (215, 235, 255)],
    "ice": [(15, 40, 60), (20, 70, 110), (40, 130, 190), (120, 210, 240), (240, 252, 255)],
    "yellow": [(50, 35, 5), (90, 65, 10), (170, 130, 15), (240, 200, 40), (255, 248, 200)],
    "purple": [(35, 10, 50), (60, 20, 90), (120, 40, 170), (190, 110, 240), (245, 225, 255)],
    "red": [(50, 8, 8), (90, 12, 12), (170, 25, 25), (240, 70, 60), (255, 220, 205)],
    "gray": [(20, 20, 25), (45, 45, 55), (95, 95, 110), (170, 170, 185), (245, 245, 250)],
    "steel": [(30, 35, 45), (60, 70, 90), (120, 135, 160), (200, 210, 225), (250, 252, 255)],
    "gold": [(50, 35, 5), (100, 70, 10), (190, 140, 20), (250, 205, 60), (255, 250, 225)],
    "brown": [(30, 18, 8), (60, 35, 15), (120, 75, 30), (200, 140, 70), (245, 228, 195)],
    "crimson": [(25, 5, 10), (60, 10, 20), (130, 15, 40), (220, 40, 80), (255, 205, 220)],
    "sick": [(20, 30, 10), (40, 60, 15), (90, 120, 30), (160, 200, 70), (235, 250, 200)],
}
# The statuses' icons, the classes' passives among them, are skill_icons.py's.
SOURCE_RAMP = [(48, 15, 10), (85, 15, 10), (155, 26, 10), (239, 105, 47), (239, 216, 161)]

# ─── The director's skill and status pack (Oct 31, 2026): 64×64 icons, 32×32 art at 2×; its skill icons for the abilities ───
SKILLS = find_dir("elemental_skill_icon_variants")
# Its skill icons come in themes, each the same 54 motifs in a row: gold (light) from icon 41, crimson (blood) from
# 107, tan (earth, steel and plain blows) from 173, fire from 247. A theme the pack doesn't draw (ice, lightning, magic,
# steel, nature, wind) is the gold one recoloured. A motif is its number in the gold row, 41 to 94.
THEME_BASE = {"gold": 41, "crimson": 107, "tan": 173, "fire": 247}
# An ability (its base id: a trained form shows its base's) → (motif, theme). The foes' only: the classes' icons are
# skill_icons.py's.
ABILITY_ICON = {
    # the foes'
    "shield_up": (48, "steel"), "brace": (46, "steel"), "take_aim": (83, "tan"), "dark_ward": (73, "purple"),
    "shield_slam": (48, "tan"), "flatten": (59, "tan"), "crush": (57, "tan"), "mend": (60, "purple"), "curse": (85, "purple"),
    "soulfire": (50, "purple"), "dig_up": (71, "crimson"), "death_bell": (85, "crimson"), "reap": (70, "crimson"),
    "tolling": (58, "steel"), "kindle": (51, "fire"), "mute": (83, "steel"), "quiet": (86, "steel"), "cheer": (52, "fire"),
    "brand": (63, "fire"), "inferno": (72, "fire"), "hailstorm": (90, "ice"), "call_drones": (84, "yellow"),
    "tempest": (88, "yellow"), "rally_soldiers": (58, "steel"),
}
NEW_RAMPS = {**RAMPS, "orange": SOURCE_RAMP, "cyan": [(8, 35, 40), (12, 70, 80), (30, 150, 160), (110, 235, 225), (225, 255, 250)]}

def half(im):
    """The pack's 2× art back to one pixel per art pixel (every 2×2 block is one colour)."""
    return im.resize((im.width // 2, im.height // 2), Image.NEAREST)

def recolor_lum(im, ramp):
    """Recolours by brightness: the icon's colours, darkest to lightest, spread over the ramp."""
    px = im.load()
    lum = lambda c: 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]
    cols = sorted({px[x, y][:3] for y in range(im.height) for x in range(im.width) if px[x, y][3]}, key=lum)
    if not cols:
        return im
    lo, hi = lum(cols[0]), lum(cols[-1])
    lut = {}
    for c in cols:
        t = (lum(c) - lo) / (hi - lo) if hi > lo else 1
        lut[c] = ramp[min(len(ramp) - 1, round(t * (len(ramp) - 1)))]
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if a and (r, g, b) in lut:
                px[x, y] = (*lut[(r, g, b)], a)
    return im


if SKILLS:
    ensure(OUT / "abilities")
    pre = next(SKILLS.glob("*_001.png")).name[:-8]
    manifest.setdefault("abilities", {})
    for aid, (motif, theme) in ABILITY_ICON.items():
        native = theme in THEME_BASE
        n = THEME_BASE[theme if native else "gold"] + motif - 41
        im = half(Image.open(SKILLS / f"{pre}_{n:03d}.png").convert("RGBA"))
        if not native:
            im = recolor_lum(im, NEW_RAMPS[theme])
        im.save(OUT / "abilities" / f"{aid}.png")
        manifest["abilities"][aid] = f"abilities/{aid}.png"
    print(f"abilities: {len(ABILITY_ICON)} icons")
else:
    print("skill and status pack: skill icons not found, kept")

if ICONSET:
    import shutil
    shutil.copyfile(ICONSET, OUT / "iconset.png")
    manifest["iconset"] = "iconset.png"

# ─── VFX: the "VFX Spells" pack, one folder per effect (<group>/<Effect>/<effect>_NN.png, 64×64 frames at art size) ───
# Each effect becomes one strip, named by its folder in snake case ("Fire Pillar" → fire_pillar), its frames cropped to
# the box all of them fit in (w×h; ox, oy is where that box sat in the pack's 64×64 frame). The Props folder's effects are
# still pictures in a few variants (an arrow, a bone, three notes), which the battle moves itself. src/art.ts picks them.
# Recoloured and turned copies, for the looks the pack draws in one colour only: name → (effect, ramp or turn).
# A recolour keeps each pixel's brightness: its band of five picks the ramp's colour, so outlines stay dark and glints
# light, and a ramp's top sets how a pale effect reads (a saturated top for the one-colour ones).
VFX_RAMPS = {
    "steel": [(30, 35, 45), (70, 80, 100), (130, 140, 160), (190, 200, 215), (245, 248, 255)],
    "silver": [(35, 40, 50), (80, 90, 110), (140, 150, 170), (195, 205, 220), (245, 248, 255)],
    "venom": [(25, 40, 10), (55, 85, 20), (100, 140, 35), (160, 200, 70), (215, 245, 150)],
    "blood": [(45, 5, 10), (110, 15, 30), (190, 30, 50), (240, 90, 100), (255, 180, 185)],
    "fire": [(90, 15, 5), (180, 40, 10), (240, 100, 20), (255, 180, 40), (255, 240, 170)],
    "dark": [(30, 12, 45), (75, 30, 110), (130, 70, 190), (180, 120, 240), (220, 185, 255)],
    "darkfire": [(60, 25, 90), (120, 60, 180), (170, 100, 235), (205, 150, 255), (235, 210, 255)],
    "rot": [(55, 85, 20), (100, 140, 35), (160, 200, 70), (200, 230, 110), (235, 250, 180)],
    "storm": [(60, 45, 5), (120, 95, 10), (200, 160, 20), (250, 215, 50), (255, 245, 160)],
    "might": [(70, 10, 10), (150, 25, 25), (230, 60, 50), (255, 120, 90), (255, 190, 160)],
    "ice": [(15, 40, 60), (30, 90, 140), (60, 150, 210), (130, 210, 245), (215, 245, 255)],
    "earth": [(50, 30, 12), (110, 70, 30), (170, 115, 55), (215, 165, 95), (245, 220, 170)],
    "aegis": [(70, 50, 5), (140, 100, 10), (215, 165, 25), (250, 210, 60), (255, 235, 140)],
    "leaf": [(15, 50, 20), (30, 100, 35), (50, 160, 55), (110, 215, 80), (175, 250, 130)],
    "mana": [(15, 30, 70), (30, 60, 140), (60, 120, 220), (120, 175, 255), (185, 220, 255)],
}

def recolor_vfx(im, ramp):
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if a:
                px[x, y] = (*ramp[min(4, int((0.299 * r + 0.587 * g + 0.114 * b) * 5 // 256))], a)
    return im

VFX_DERIVED = {
    # bites and claws (the pack's are steel blue, kept for ice): plain beasts, venom, blood, fire, the dead
    "bite_plain": ("bite", "steel"), "bite_venom": ("bite", "venom"), "bite_blood": ("bite", "blood"),
    "chomp_fire": ("chomp", "fire"), "chomp_blood": ("chomp", "blood"), "claw_blood": ("claw", "blood"), "claw_dark": ("claw", "dark"),
    # blades and blows in a theme's colour
    "crescent_cut_dark": ("crescent_cut", "dark"), "slash_dark": ("slash", "dark"), "thrust_storm": ("thrust", "storm"),
    "uppercut_fire": ("uppercut", "fire"), "uppercut_might": ("uppercut", "might"), "swipe_venom": ("swipe", "venom"),
    # guards and shells
    "crystal_shield": ("crystal", "ice"), "crystal_earth": ("crystal", "earth"), "crystal_steel": ("crystal", "silver"),
    "shockwave_gold": ("shockwave", "aegis"), "shockwave_dark": ("shockwave", "dark"),
    # healing, MP and their dark and blood kin
    "regen_aura_green": ("regen_aura", "leaf"), "minor_heal_green": ("minor_heal", "leaf"), "restore_dark": ("restore", "dark"),
    "restore_blood": ("restore", "blood"), "restore_mp": ("restore", "mana"), "radiance_mp": ("radiance", "mana"),
    "healing_circle_cast": ("healing_circle", "ice"), "healing_circle_dark": ("healing_circle", "dark"),
    # afflictions
    "poison_rot": ("poison", "rot"), "flame_dark": ("flame", "darkfire"), "fire_pillar_dark": ("fire_pillar", "darkfire"),
    "fireball_dark": ("fireball", "darkfire"), "splash_lava": ("splash", "fire"), "splash_slime": ("splash", "leaf"),
    "gleam_gold": ("gleam", "aegis"), "lightning_bolt_dark": ("lightning_bolt", "dark"),
    # projectiles: the props' arrow and the ice shard's first frame, turned to fly right
    "arrow_fly": ("arrow", "turn"), "arrow_fly_ice": ("arrow_fly", "ice"), "arrow_fly_blood": ("arrow_fly", "blood"), "ice_lance": ("ice_shard", "turn"),
}
VFX = find_dir("VFX Spells")

def crop_strip(frames):
    """Frames cropped to the box all of them fit in, side by side: (strip, w, h, ox, oy)."""
    box = None
    for im in frames:
        b = im.getbbox()
        if b:
            box = b if box is None else (min(box[0], b[0]), min(box[1], b[1]), max(box[2], b[2]), max(box[3], b[3]))
    box = box or (0, 0, 1, 1)
    w, h = box[2] - box[0], box[3] - box[1]
    strip = Image.new("RGBA", (w * len(frames), h), (0, 0, 0, 0))
    for i, im in enumerate(frames):
        strip.paste(im.crop(box), (w * i, 0))
    return strip, w, h, box[0], box[1]

if VFX:
    ensure(OUT / "vfx")
    for old in (OUT / "vfx").glob("*.png"):
        old.unlink()
    manifest["vfx"] = {}
    framesets = {}
    for folder in sorted(p for p in VFX.glob("*/*") if p.is_dir()):
        name = folder.name.lower().replace(" ", "_")
        files = sorted((f for f in folder.glob("*.png") if f.stem.rsplit("_", 1)[-1].isdigit()), key=lambda f: int(f.stem.rsplit("_", 1)[1]))
        if files:
            framesets[name] = [Image.open(f).convert("RGBA") for f in files]
    for name, (src, how) in VFX_DERIVED.items():
        base = framesets[src]
        if how == "turn":
            framesets[name] = [base[0].rotate(-90)]
        else:
            framesets[name] = [recolor_vfx(im.copy(), VFX_RAMPS[how]) for im in base]
    for name, frames in framesets.items():
        strip, w, h, ox, oy = crop_strip(frames)
        strip.save(OUT / "vfx" / f"{name}.png")
        manifest["vfx"][name] = {"file": f"vfx/{name}.png", "frames": len(frames), "w": w, "h": h, "ox": ox, "oy": oy}
    print(f"vfx: {len(manifest['vfx'])} strips ({len(VFX_DERIVED)} recoloured or turned)")
else:
    print("vfx: pack not found, kept")

# ─── Weapons: the director's weapon art, one sheet a weapon (3 frames of 48×32 at art size, drawn at 3×), by gear id ───
# The pack names its sheets by the weapon's name; the game's plain pieces are "plain_<kind>".
WEAPON_IDS = {
    "dagger": "plain_dagger", "sword": "plain_sword", "spear": "plain_spear", "axe": "plain_axe", "bow": "plain_bow",
    "rune_sword": "plain_rune_sword", "great_weapon": "plain_great_weapon", "hammer": "plain_hammer", "mace": "plain_mace",
    "wand": "plain_wand", "staff": "plain_staff", "fist_weapons": "plain_fist",
}
# Sheets used in place of the pack's own of the same name: the haloed axes drawn bigger than their wearer, made smaller;
# Spellbinder, redrawn by the director; and Eye of the tempest, a rune sword the pack drew as a sceptre, which takes the
# pack's Spellbinder (its forked-lightning blade) in the Eye's own gold. They keep the pack's format, so once the pack holds the sheet a game
# should use, its file here is deleted.
FITTED = Path(__file__).parent / "weapons-fitted"
# Drawn for gear lists only, never in a hand (the fists are the sprite's own): the fist weapons, and the mythic that is
# one (the pack files the mythics under a kind of their own).
UNHELD_KINDS = {"Fist weapons"}
UNHELD = {"ember_palms"}

if WEAPON_ART:
    pack = json.load(open(WEAPON_ART / "weapons.json"))
    ensure(OUT / "weapons")
    for old in (OUT / "weapons").glob("*.png"):
        old.unlink()
    manifest["weapons"], manifest["weaponsUnheld"] = {}, []
    for name, entry in pack.items():
        gid = WEAPON_IDS.get(name, name)
        sheet = WEAPON_ART / entry["sheet"]
        fitted = FITTED / sheet.name
        im = mode_downscale(Image.open(fitted if fitted.exists() else sheet), 3)
        assert im.size == (144, 32), f"{name}: {im.size}, not three frames of 48×32"
        im.save(OUT / "weapons" / f"{gid}.png")
        manifest["weapons"][gid] = f"weapons/{gid}.png"
        if entry["kind"] in UNHELD_KINDS or gid in UNHELD:
            manifest["weaponsUnheld"].append(f"weapons/{gid}.png")
    manifest["weaponFrame"] = [48, 32]
    print(f"weapons: {len(pack)} strips ({len(manifest['weaponsUnheld'])} for gear lists only, {len(list(FITTED.glob('*.png')))} from ui/tools/weapons-fitted)")
else:
    print("weapons: pack not found, kept")

# ─── Faces: 36×36 from the humanoid face sheet (15 faces × 6 palettes), (column, palette row) per class ───
FACES = {
    "knight": (7, 2), "paladin": (7, 0), "cleric": (10, 2), "valkyrie": (6, 2), "hexer": (9, 3), "bard": (12, 0), "frostweaver": (11, 2),
    "ranger": (2, 1), "bramble_knight": (1, 1), "hoplite": (5, 0), "monk": (14, 0), "assassin": (13, 5), "vampire": (3, 4),
    "pyromancer": (4, 0), "stormcaller": (0, 3), "geomancer": (8, 1),
}
FACE_X0, FACE_Y0, FACE_STEP, FACE_SIZE = 60, 48, 48, 36
if HFACES:
    ensure(OUT / "faces")
    sheet = Image.open(HFACES).convert("RGBA")
    manifest["faces"] = {}
    for cls, (col, row) in FACES.items():
        x, y = FACE_X0 + col * FACE_STEP, FACE_Y0 + row * FACE_STEP
        sheet.crop((x, y, x + FACE_SIZE, y + FACE_SIZE)).save(OUT / "faces" / f"{cls}.png")
        manifest["faces"][cls] = f"faces/{cls}.png"
    manifest["faceSize"] = FACE_SIZE
    print(f"faces: {len(FACES)}")
else:
    print("faces: pack not found, kept")

# ─── Backdrops: 270×224 scenes composed from the tilesets, one per dungeon, plus the home strip ───
W, H = 270, 228

def img(path):
    return Image.open(path).convert("RGBA")

def tile(dst, src, box, area):
    """Fills `area` (x0, y0, x1, y1) of dst with src's `box` repeated, aligned to the area's top-left."""
    t = src.crop(box)
    x0, y0, x1, y1 = area
    for y in range(y0, y1, t.height):
        for x in range(x0, x1, t.width):
            piece = t.crop((0, 0, min(t.width, x1 - x), min(t.height, y1 - y)))
            dst.alpha_composite(piece, (x, y))

def stamp(dst, src, box, at):
    dst.alpha_composite(src.crop(box), at)

def fill(dst, color, area):
    dst.paste(color, area)

def darken(dst, area, k=0.85):
    """Dims a region, so the floor sits behind the sprites, bars and icons instead of competing with them."""
    x0, y0, x1, y1 = area
    px = dst.load()
    for y in range(y0, y1):
        for x in range(x0, x1):
            r, g, b, a = px[x, y]
            px[x, y] = (int(r * k), int(g * k), int(b * k), a)

def seeded(seed):
    s = seed
    def rnd():
        nonlocal s
        s = (s * 1664525 + 1013904223) & 0xFFFFFFFF
        return s / 4294967296
    return rnd

def sky(dst, top, bottom, bands, area=(0, 0, W, H)):
    """Horizontal bands from `top` to `bottom`, in `bands` steps."""
    x0, y0, x1, y1 = area
    for i in range(bands):
        c = tuple(int(top[j] + (bottom[j] - top[j]) * i / max(1, bands - 1)) for j in range(3)) + (255,)
        ya, yb = y0 + (y1 - y0) * i // bands, y0 + (y1 - y0) * (i + 1) // bands
        fill(dst, c, (x0, ya, x1, yb))

def stars(dst, n, area, seed=3):
    rnd = seeded(seed)
    px = dst.load()
    for _ in range(n):
        x, y = int(area[0] + rnd() * (area[2] - area[0])), int(area[1] + rnd() * (area[3] - area[1]))
        px[x, y] = (255, 255, 255, 255) if rnd() < 0.6 else (190, 200, 255, 255)

def rain(dst, n, area, color, seed=5):
    rnd = seeded(seed)
    px = dst.load()
    for _ in range(n):
        x, y = int(area[0] + rnd() * (area[2] - area[0])), int(area[1] + rnd() * (area[3] - area[1]))
        for k in range(4):
            if 0 <= x - k < W and 0 <= y + k < H:
                px[x - k, y + k] = color + (255,)

def backdrop_old_road(a2, b, c):
    d = Image.new("RGBA", (W, H))
    sky(d, (120, 180, 240), (190, 225, 250), 6, (0, 0, W, 48))
    tile(d, b, (0, 136, 64, 192), (0, 4, W, 60))             # grey mountains along the horizon
    tile(d, a2, (224, 0, 256, 32), (0, 36, W, 68))           # a line of pines
    tile(d, a2, (32, 0, 96, 48), (0, 68, W, H))              # grass
    tile(d, a2, (0, 96, 32, 144), (0, 158, W, 186))          # a dirt road across the field
    for x in (2, 240):
        stamp(d, b, (16, 32, 48, 64), (x, 56))               # hedges at the edges
    for x, y in ((120, 92), (150, 112), (206, 100)):
        stamp(d, b, (224, 176, 240, 192), (x, y))            # tufts
    return d

def backdrop_ice_pass(a2, b, c):
    d = Image.new("RGBA", (W, H))
    sky(d, (150, 180, 215), (220, 235, 250), 6, (0, 0, W, 52))
    stamp(d, b, (160, 16, 208, 64), (150, 0))                # a white mountain
    stamp(d, b, (160, 16, 208, 64), (40, 6))
    tile(d, a2, (224, 48, 256, 80), (0, 38, W, 70))          # snowy pines
    tile(d, a2, (32, 48, 96, 96), (0, 70, W, H))             # snow
    for x, y in ((100, 112), (180, 170)):
        stamp(d, a2, (96, 48, 128, 96), (x, y))              # ice patches
    return d

def backdrop_crypt(a2, a4, b1, purple=False):
    d = Image.new("RGBA", (W, H))
    wall = (0, 208, 32, 240) if purple else (32, 48, 64, 80)
    floor = (192, 96, 224, 144) if purple else (224, 0, 256, 48)      # plain floors with a few dots: calm behind sprites and icons
    fill(d, (8, 6, 14, 255) if purple else (12, 12, 20, 255), (0, 0, W, 4))
    tile(d, a4, wall, (0, 4, W, 64))
    for x in (24, 214):
        stamp(d, a4, (224, 208, 256, 240) if purple else (192, 48, 224, 80), (x, 32))   # pillars
    tile(d, a2, floor, (0, 64, W, H))
    if not purple:
        darken(d, (0, 64, W, H), 0.8)
    candle = (48, 80, 64, 128) if purple else (16, 80, 32, 128)
    for x in (4, 250):
        stamp(d, b1, candle, (x, 46))
    return d

def backdrop_fire_mine(a2, a4):
    d = Image.new("RGBA", (W, H))
    fill(d, (30, 6, 4, 255), (0, 0, W, 4))
    tile(d, a4, (32, 160, 64, 192), (0, 4, W, 60))            # lava-brick wall
    for x in (40, 200):
        stamp(d, a4, (192, 48, 224, 80), (x, 28))              # columns
    tile(d, a2, (96, 48, 128, 96), (0, 60, W, 78))             # a lava stream
    tile(d, a2, (32, 0, 64, 48), (0, 78, W, H))                # scorched rock
    darken(d, (0, 78, W, H), 0.55)                              # dimmed well down, so the orange field doesn't fight the sprites
    return d

def backdrop_storm_tower(a2, a4, castle):
    d = Image.new("RGBA", (W, H))
    fill(d, (10, 12, 30, 255), (0, 0, W, 4))
    tile(d, castle, (64, 64, 96, 96), (0, 4, W, 64))            # blue castle brick
    for x in (30, 208):
        stamp(d, a4, (96, 128, 128, 160), (x, 32))             # blue pillars
    tile(d, a2, (0, 48, 32, 96), (0, 64, W, H))                # plain blue floor
    darken(d, (0, 64, W, H), 0.8)
    return d

def backdrop_tower_top(castle, a2):
    d = Image.new("RGBA", (W, H))
    sky(d, (10, 14, 40), (40, 50, 90), 6, (0, 0, W, 50))
    stars(d, 40, (0, 0, W, 40))
    rain(d, 90, (0, 0, W, 60), (120, 140, 220))
    tile(d, castle, (0, 64, 32, 96), (0, 44, W, 68))           # a battlement wall
    for x in range(0, W, 32):
        stamp(d, castle, (0, 64, 16, 80), (x, 30))             # crenellations
    tile(d, castle, (0, 0, 32, 48), (0, 68, W, H))             # grey stone
    darken(d, (0, 68, W, H), 0.75)
    return d

def backdrop_shop(t, keeper):
    """The rogue mode's shop: a wood-panelled room from the town interior tiles (1x), shelves of potions and books
    along the wall, a window and a painting, and a counter of goods on a rug with the shopkeeper behind it (an unused
    robed figure from the enemy pack, arms raised). Composed for the 144 rows a stage shows (38 to 182)."""
    d = Image.new("RGBA", (W, H), (20, 14, 10, 255))
    oy = 38

    def piece(x0, y0, x1, y1):
        im = t.crop((int(x0 * 16), int(y0 * 16), int(x1 * 16), int(y1 * 16)))
        bb = im.split()[3].getbbox()
        return im.crop(bb) if bb else im

    def put(im, cx, feet):
        d.alpha_composite(im, (int(cx - im.width / 2), int(feet + oy - im.height)))

    tile(d, t, (48, 80, 96, 112), (0, 0, W, 64 + oy))           # wood wall panels
    tile(d, t, (16, 0, 32, 16), (0, 64 + oy, W, H))             # wood planks
    darken(d, (0, 64 + oy, W, H), 0.66)
    darken(d, (0, 0, W, 64 + oy), 0.9)
    for x, box in ((14, (1, 7.5, 2, 10)), (32, (1, 11.5, 2, 14)), (50, (1, 15.5, 2, 18)), (252, (0, 8, 1, 10))):
        put(piece(*box), x, 66)                                   # potion shelves
    put(piece(3, 8.5, 4, 10), 92, 40)                            # a window
    put(piece(11, 10, 13, 12), 216, 66)                          # a bookcase
    put(piece(6, 12, 7, 13), 140, 34)                            # a painting
    put(piece(14, 0.5, 17, 3), 196, 132)                         # a rug before the counter
    put(piece(10, 16.5, 11, 18), 8, 140)                         # plants by the door
    put(piece(7, 16.5, 8, 18), 262, 140)
    put(keeper, 198, 104)                                        # the shopkeeper, behind
    table = piece(4, 10, 6, 11)
    for x in (166, 198, 230):
        put(table, x, 110)                                       # the counter: three tables end to end
    top = 110 - table.height + 5
    for x, box in ((158, (1, 10, 2, 11)), (176, (6, 9, 7, 10)), (220, (8, 11, 9, 12)), (236, (0, 14, 1, 15)), (252, (2, 14, 3, 16))):
        put(piece(*box), x, top)                                 # goods: a pot, books, a drum, a candle
    return d

if OW and DUNGEON and CASTLE:
    ensure(OUT / "backdrops")
    a2, b, c = img(OW / "OW_A2.png"), img(OW / "OW_B.png"), img(OW / "OW_C.png")
    d_a2 = {n: img(DUNGEON / f"D_A2_0{n}.png") for n in (1, 2, 3)}
    d_a4 = {n: img(DUNGEON / f"D_A4_0{n}.png") for n in (1, 2, 3)}
    d_b1 = img(DUNGEON / "D_B_01.png")
    castle = img(CASTLE / "CASTLE_ALL.png")
    scenes = {
        "old_road": backdrop_old_road(a2, b, c),
        "crypt": backdrop_crypt(d_a2[1], d_a4[1], d_b1),
        "fire_mine": backdrop_fire_mine(d_a2[3], d_a4[3]),
        "ice_pass": backdrop_ice_pass(a2, b, c),
        "storm_tower": backdrop_storm_tower(d_a2[1], d_a4[1], castle),
        "deep_crypt": backdrop_crypt(d_a2[1], d_a4[1], d_b1, purple=True),
        "tower_top": backdrop_tower_top(castle, a2),
    }
    manifest["backdrops"] = {}
    for name, im in scenes.items():
        im.save(OUT / "backdrops" / f"{name}.png")
        manifest["backdrops"][name] = f"backdrops/{name}.png"
    # the home strip: the road scene's horizon
    strip = scenes["old_road"].crop((0, 28, W, 100))
    strip.save(OUT / "backdrops" / "strip.png")
    manifest["backdrops"]["strip"] = "backdrops/strip.png"
    manifest["backdropSize"] = [W, H]
    print(f"backdrops: {len(scenes)} scenes and the strip")
else:
    print("backdrops: tilesets not found, kept")

if TOWN_INSIDE and ENEMIES:
    ensure(OUT / "backdrops")
    keeper = mode_downscale(Image.open(ENEMIES / "Humanoid_Diabolist_3.png"), 3)
    keeper = keeper.crop(keeper.split()[3].getbbox())
    backdrop_shop(img(TOWN_INSIDE), keeper).save(OUT / "backdrops" / "shop.png")
    manifest["backdrops"]["shop"] = "backdrops/shop.png"
    print("backdrops: the shop")
else:
    print("backdrops: the shop's tiles not found, kept")

# ─── The campfire: the small sheet's eight 32×32 frames of a fire on its logs, at art size ───
if CAMPFIRE:
    im = Image.open(CAMPFIRE).convert("RGBA")
    im.save(OUT / "campfire.png")
    manifest["campfire"] = {"file": "campfire.png", "frames": im.width // im.height, "size": im.height}
    print(f"campfire: {im.width // im.height} frames")
else:
    print("campfire: sheet not found, kept")

# ─── Chests: the dungeon pack's object sheet, 16×16 cells, each chest's column opening down its four rows ───
if CHESTS:
    import shutil
    shutil.copyfile(CHESTS, OUT / "chest.png")
    manifest["chest"] = {"file": "chest.png", "cell": 16, "frames": 4, "columns": {"gold": 9, "silver": 8, "ice": 10, "fire": 11}}
    print("chest: sheet copied")
else:
    print("chest: sheet not found, kept")

with open(OUT / "manifest.json", "w") as f:
    json.dump(manifest, f, indent=1)
print(f"wrote {OUT}/manifest.json")
