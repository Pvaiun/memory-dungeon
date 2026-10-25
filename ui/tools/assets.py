#!/usr/bin/env python3
"""
Builds ui/public/assets from the director's sprite packs.

    python3 -I ui/tools/assets.py <dir with the packs extracted> ui/public/assets

The packs are found by name anywhere under the input dir, so they can be
unzipped as they come: the "Simple 8-bit Sideview Battlers" (its Style 2
sv_actors are the class sheets, its Weapon_Pack the weapons), the sideview
enemies, the 400 "Status effect and various icons", Willibab's Iconset,
humanoid faces (Willi_HFP), the overworld / dungeon / castle / town tilesets
(1x), and the VFX pack. A pack that isn't there is skipped and its output kept
as committed, so the output can be rebuilt one pack at a time.

The output is committed, so the interface runs without the packs: one actor
sheet per class at its art size (with two fixes to the pack: the "chant" pose
is drawn turned around, so it's mirrored back; the "item" pose is a
placeholder sprite, so it's replaced by "spell"), one sprite per enemy, one
weapon strip per piece of gear that shows in a hand, one face per class, one
recoloured 16px icon per status, the iconset, VFX frame strips, one backdrop
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
WEAPONS = find_dir("Style 2", "weapons") or find_dir("Weapon_Pack", "weapons")
ENEMIES = find_dir("Sideview Enemies")
STATUS = find_file("Status_effect1_1_01.png")
STATUS = STATUS.parent if STATUS else None
VFX = find_dir("individual_frames")
ICONSET = find_file("Iconset.png")
HFACES = find_file("Humanoid_Faces_1x.png")
OW = find_dir("Tileset 1x")
DUNGEON = find_dir("1x", "tilesets")
CASTLE = find_dir("1x", "Tileset")
TOWN = find_file("TOWNS_ALL_1x.png")

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

def aligned_diff(a, b):
    """Pixels that differ between two figures, aligned on their bounding boxes' bottom-left corners."""
    ba, bb = a.split()[3].getbbox(), b.split()[3].getbbox()
    if not ba or not bb:
        return 10 ** 6
    a, b = a.crop(ba), b.crop(bb)
    w, h = max(a.width, b.width), max(a.height, b.height)
    A = Image.new("RGBA", (w, h)); A.paste(a, (0, h - a.height))
    B = Image.new("RGBA", (w, h)); B.paste(b, (0, h - b.height))
    pa, pb = A.load(), B.load()
    return sum(1 for y in range(h) for x in range(w) if pa[x, y] != pb[x, y])

def fix_sheet(sheet):
    """The pack's "chant" pose is the figure turned around: mirror it back about its own centre.
    Its "item" pose is a placeholder of another sprite: replace it with "spell"."""
    wait = sheet.crop(frame_box("wait", 0))
    for f in range(3):
        box = frame_box("chant", f)
        fr = sheet.crop(box)
        if aligned_diff(fr.transpose(Image.FLIP_LEFT_RIGHT), wait) < aligned_diff(fr, wait) * 0.6:
            bb = fr.split()[3].getbbox()
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
    "witch": ("Elemental_CursedTome", 1, 1.0, "Cursed Tome"),
    "lich": ("Undead_Lich", 1, 1.0, None),
    "ghoul": ("Undead_Ghoul", 1, 0.95, None),
    "reaper": ("Demon_Titan", 1, 1.3, None),
    "wraith": ("Undead_Reaper", 1, 0.95, None),
    "silent_one": ("Undead_Warlord", 1, 1.5, None),
    "hellhound": ("Beast_Werecat", 4, 0.8, "Hellcat"),
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
    "mummy": ("Undead_Vanguard", 1, 1.0, "Crypt Guard"),
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

# ─── Statuses → (icon number in the 400-icon set, colour ramp) ───
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
STATUSES = {
    "poison": (94, "green"), "regen": (83, "green"), "shield": (41, "ice"), "might": (102, "orange"), "weaken": (162, "purple"),
    "guard": (48, "steel"), "stun": (322, "yellow"), "slow": (13, "blue"), "haste": (341, "yellow"), "taunt": (35, "red"),
    "burn": (301, "orange"), "chill": (193, "ice"), "shock": (382, "yellow"), "ward": (46, "purple"), "sunder": (263, "brown"),
    "silence": (372, "gray"), "hidden": (129, "gray"), "rot": (183, "sick"), "clarity": (311, "blue"), "aegis": (50, "gold"),
    "doom": (16, "crimson"), "bulwark": (45, "steel"), "bulwark_broken": (269, "red"), "ice_crust": (194, "ice"),
    "shadow_strike_on": (169, "purple"), "bloodlust_on": (85, "crimson"), "bedrock_on": (326, "gold"),
    # passives and formation effects, for sheets
    "sworn": (35, "steel"), "mercy": (2, "gold"), "hunters_eye": (124, "green"), "briar": (118, "green"), "phalanx": (47, "brown"),
    "judgement": (206, "gold"), "encore": (373, "yellow"), "cold_hex": (191, "ice"), "iron_palm": (212, "brown"), "shadow_strike": (169, "purple"),
    "bloodlust": (85, "crimson"), "kindling": (303, "orange"), "brittle": (197, "ice"), "arc": (384, "yellow"), "bedrock": (326, "gold"),
    "blitz_charge": (341, "yellow"), "caravan_pace": (83, "green"), "last_stand_spur": (102, "red"), "escort_insurance": (41, "ice"),
    "venom": (94, "green"), "fire_bite": (301, "orange"), "split": (123, "orange"), "volatile": (164, "orange"), "rime": (191, "ice"),
    "ice_crust_passive": (194, "ice"), "frozen_core": (45, "ice"), "static": (382, "yellow"), "vengeance": (102, "red"),
    "mp_regen": (311, "blue"), "thorns": (118, "green"), "lifesteal": (85, "crimson"), "siphon": (313, "purple"), "double_strike": (209, "gray"),
}
SOURCE_RAMP = [(48, 15, 10), (85, 15, 10), (155, 26, 10), (239, 105, 47), (239, 216, 161)]

def recolor(im, ramp):
    if ramp is None:
        return im
    px = im.load()
    lut = {SOURCE_RAMP[i]: ramp[i] for i in range(5)}
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            key = min(lut, key=lambda c: (c[0] - r) ** 2 + (c[1] - g) ** 2 + (c[2] - b) ** 2)
            nr, ng, nb = lut[key]
            px[x, y] = (nr, ng, nb, a)
    return im

if STATUS:
    ensure(OUT / "status")
    for sid, (n, ramp) in STATUSES.items():
        im = Image.open(STATUS / f"Status_effect1_1_{n:02d}.png").convert("RGBA")
        recolor(im, RAMPS[ramp]).save(OUT / "status" / f"{sid}.png")
        manifest["statuses"][sid] = f"status/{sid}.png"
    print(f"statuses: {len(STATUSES)} icons")
else:
    print("statuses: pack not found, kept")

if ICONSET:
    import shutil
    shutil.copyfile(ICONSET, OUT / "iconset.png")
    manifest["iconset"] = "iconset.png"

# ─── VFX sequences to pack: folder → prefixes ───
VFX_SEQ = {
    "fire": ["fire1", "fire2", "fire3", "fire4"], "ice": ["ice1", "ice2", "ice3", "ice4"], "lightning": ["lightning1", "lightning2", "lightning3", "lightning4"],
    "wind": ["wind1", "wind2", "wind3", "wind4"], "earth1": ["earth1", "earth2"], "earth2": ["earth3", "earth4", "earth5"],
    "holy": ["holy1", "holy2", "holy3"], "darkness": ["darkness1", "darkness2", "darkness3"], "heal": ["heal1", "heal2", "heal3", "heal4", "heal5"],
    "sword": ["sword1", "sword2", "sword3", "sword4", "sword5"], "impact": ["impact1", "impact2", "impact3", "impact4", "impact5", "impact6", "impact7"],
    "arrow": ["arrow1", "arrow2"], "claw_bite": ["bite1", "bite2", "claw"], "status": [f"status{i}" for i in range(1, 11)],
    "smoke": ["smoke1", "smoke2", "smoke3"], "dust": ["dust1", "dust2", "dust3"], "explosion": ["explosion1", "explosion2"],
    "diamond": ["diamond1", "diamond2"], "water": ["water1", "water2", "water3", "water4", "water5"], "weapons": [f"weapon{i}" for i in range(1, 9)],
    "clock": ["hourglass1"],
}
if VFX:
    ensure(OUT / "vfx")
    for folder, prefixes in VFX_SEQ.items():
        for pre in prefixes:
            frames = sorted(glob.glob(f"{VFX}/{folder}/{pre}_*.png"), key=lambda p: int(p.rsplit("_", 1)[1][:-4]))
            if not frames:
                raise SystemExit(f"no frames for {folder}/{pre}")
            strip = Image.new("RGBA", (64 * len(frames), 64), (0, 0, 0, 0))
            for i, f in enumerate(frames):
                strip.paste(Image.open(f).convert("RGBA"), (64 * i, 0))
            strip.save(OUT / "vfx" / f"{pre}.png")
            manifest["vfx"][pre] = {"file": f"vfx/{pre}.png", "frames": len(frames)}
    print(f"vfx: {len(manifest['vfx'])} strips")
else:
    print("vfx: pack not found, kept")

# ─── Weapons: the pack's sheets (3 frames of 48×32 at art size) by gear id; staffs recoloured by element ───
# Fist weapons show nothing: the fists are the sprite's own.
WEAPON_SPRITES = {
    "plain_dagger": "DAGGER_02", "fang": "DAGGER_05", "stiletto": "DAGGER_03", "bodkin": "DAGGER_04", "needle": "DAGGER_06",
    "plain_sword": "BLADE_01", "wardens_blade": "BLADE_19", "oathblade": "BLADE_18", "duellists_sword": "BLADE_02", "crusader_sword": "BLADE_17",
    "plain_bow": "BOW_01", "warbow": "BOW_05", "longbow": "BOW_02", "minstrels_bow": "BOW_04",
    "plain_spear": "SPEAR_01", "pike": "SPEAR_03", "sentinel_spear": "SPEAR_NEW3", "skyspear": "SPEAR_02",
    "plain_axe": "AXE_01", "rune_axe": "AXE_07", "splitter": "AXE_08", "cornerstone_axe": "AXE_04",
    "plain_fire_staff": ("STAFF_01", "fire"), "brand_staff": ("STAFF_02", "fire"), "ember_staff": ("STAFF_06", "fire"),
    "plain_lightning_staff": ("STAFF_01", "lightning"), "storm_rod": ("STAFF_02", "lightning"), "grounding_rod": ("STAFF_03", "lightning"),
    "plain_wind_staff": ("STAFF_01", "wind"), "zephyr_staff": ("STAFF_05", "wind"), "tailwind_staff": ("STAFF_03", "wind"),
    "plain_earth_staff": ("STAFF_01", "earth"), "granite_staff": ("STAFF_03", "earth"), "rootstaff": ("STAFF_02", "earth"), "heartwood_staff": ("STAFF_06", "earth"),
    "plain_ice_staff": ("STAFF_01", "ice"), "rime_staff": ("STAFF_05", "ice"), "hoarfrost_staff": ("STAFF_03", "ice"), "glacier_staff": ("STAFF_06", "ice"),
    "plain_light_staff": ("STAFF_01", "light"), "sunstaff": ("STAFF_04", "light"), "dawn_staff": ("STAFF_06", "light"), "chapel_staff": ("STAFF_03", "light"), "templar_staff": ("STAFF_04", "light"),
    "plain_dark_staff": ("STAFF_01", "dark"), "nightstaff": ("STAFF_05", "dark"), "leech_staff": ("STAFF_03", "dark"), "sanguine_staff": ("STAFF_02", "dark"),
}
# Four-step ramps, darkest first, for the staffs' gems and glow; the wooden shaft keeps its colour.
ELEMENT_RAMPS = {
    "fire": [(120, 30, 10), (220, 80, 30), (255, 150, 60), (255, 230, 160)],
    "ice": [(20, 70, 130), (50, 140, 210), (130, 220, 255), (235, 250, 255)],
    "lightning": [(130, 100, 0), (220, 180, 20), (255, 225, 70), (255, 250, 200)],
    "wind": [(30, 110, 50), (70, 180, 90), (150, 240, 150), (230, 255, 230)],
    "earth": [(90, 55, 20), (160, 110, 50), (220, 175, 110), (250, 235, 200)],
    "light": [(170, 140, 40), (230, 210, 90), (255, 245, 180), (255, 255, 240)],
    "dark": [(50, 15, 90), (120, 50, 180), (200, 140, 255), (240, 220, 255)],
}

def is_wood(r, g, b):
    """The staffs' shafts are brown or grey: low saturation, or orange-brown. Everything else is the gem and its glow."""
    mx, mn = max(r, g, b), min(r, g, b)
    sat = 0 if mx == 0 else (mx - mn) / mx
    return sat < 0.35 or (r > g > b and mx < 200)

def recolor_staff(im, element):
    ramp = ELEMENT_RAMPS[element]
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if a == 0 or is_wood(r, g, b):
                continue
            l = (r * 299 + g * 587 + b * 114) / 1000
            step = 0 if l < 90 else 1 if l < 150 else 2 if l < 215 else 3
            px[x, y] = ramp[step] + (a,)
    return im

if WEAPONS:
    ensure(OUT / "weapons")
    manifest["weapons"] = {}
    for gid, spec in WEAPON_SPRITES.items():
        name, element = (spec, None) if isinstance(spec, str) else spec
        im = mode_downscale(Image.open(WEAPONS / f"{name}.png"), 3)
        if element:
            im = recolor_staff(im, element)
        im.save(OUT / "weapons" / f"{gid}.png")
        manifest["weapons"][gid] = f"weapons/{gid}.png"
    manifest["weaponFrame"] = [48, 32]
    print(f"weapons: {len(WEAPON_SPRITES)} strips")
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

with open(OUT / "manifest.json", "w") as f:
    json.dump(manifest, f, indent=1)
print(f"wrote {OUT}/manifest.json")
