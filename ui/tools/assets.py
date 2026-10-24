#!/usr/bin/env python3
"""
Builds ui/public/assets from the director's uploaded sprite packs.

    python3 -I ui/tools/assets.py <extracted packs dir> ui/public/assets

The input dir holds the five packs, each extracted into its own folder:
Sideview_Classes, Sideview_Enemies, Icons, Status_effect_and_various_icons,
Vfx_pack. The output is committed, so the interface runs without the packs:
one actor sheet per class at its art size, one sprite per enemy (a chosen
recolor, as drawn), one recolored 16px icon per status, the iconset, VFX frame
strips, and manifest.json, which maps content ids to files and holds the enemy
renames.
"""
import json, os, sys, glob, shutil
from PIL import Image

SRC, OUT = sys.argv[1], sys.argv[2]
ACTORS = f"{SRC}/Sideview_Classes/Sideview Classes/sv_actors"
ENEMIES = f"{SRC}/Sideview_Enemies/Sideview Enemies"
STATUS = f"{SRC}/Status_effect_and_various_icons/Status effect and various icons"
VFX = f"{SRC}/Vfx_pack/Vfx pack/individual_frames"
ICONSET = f"{SRC}/Icons/Icons/Iconset.png"

# ─── Classes → actor sheets (RPG Maker MV layout: 9×6 frames, 18 poses × 3) ───
CLASSES = {
    "knight": "TEMPLAR_BLUE", "cleric": "VIZIER_BLUE", "ranger": "WARDEN_GREEN", "bramble_knight": "HEDGE_KNIGHT_GREEN",
    "hoplite": "HEDGE_KNIGHT_BROWN", "paladin": "TEMPLAR_RED", "valkyrie": "WARDEN_BLUE", "bard": "SKALD_RED",
    "hexer": "WITCH_PURPLE", "monk": "MYSTIC_BROWN", "assassin": "SULTAN_DARK", "vampire": "REAPER_DARK",
    "pyromancer": "SORCEROR_RED", "frostweaver": "MAGUS_BLUE", "stormcaller": "BATTLEMAGE_PURPLE", "geomancer": "SHAMAN_GREEN",
}

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

def ensure(d):
    os.makedirs(d, exist_ok=True)

manifest = {"classes": {}, "enemies": {}, "statuses": {}, "vfx": {}, "frame": 64}

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

# Actor sheets ship at their art size (a 144px frame becomes 48px), so the interface draws them as they are.
ensure(f"{OUT}/actors")
for cls, sheet in CLASSES.items():
    mode_downscale(Image.open(f"{ACTORS}/{sheet}.png"), 3).save(f"{OUT}/actors/{cls}.png")
    manifest["classes"][cls] = f"actors/{cls}.png"
manifest["actorFrame"] = 48

ensure(f"{OUT}/enemies")
for eid, (sprite, variant, scale, rename) in ENEMY.items():
    name = sprite if variant == 1 else f"{sprite}_{variant}"
    src = f"{ENEMIES}/{name}.png"
    if not os.path.exists(src):
        src = f"{ENEMIES}/{sprite}_1.png" if variant == 1 else src
    if not os.path.exists(src):
        raise SystemExit(f"missing {src}")
    im = Image.open(src).convert("RGBA")
    im.save(f"{OUT}/enemies/{eid}.png")
    manifest["enemies"][eid] = {"file": f"enemies/{eid}.png", "w": im.width, "h": im.height, "scale": scale, **({"name": rename} if rename else {})}

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

ensure(f"{OUT}/status")
for sid, (n, ramp) in STATUSES.items():
    im = Image.open(f"{STATUS}/Status_effect1_1_{n:02d}.png").convert("RGBA")
    recolor(im, RAMPS[ramp]).save(f"{OUT}/status/{sid}.png")
    manifest["statuses"][sid] = f"status/{sid}.png"

shutil.copyfile(ICONSET, f"{OUT}/iconset.png")

ensure(f"{OUT}/vfx")
for folder, prefixes in VFX_SEQ.items():
    for pre in prefixes:
        frames = sorted(glob.glob(f"{VFX}/{folder}/{pre}_*.png"), key=lambda p: int(p.rsplit("_", 1)[1][:-4]))
        if not frames:
            raise SystemExit(f"no frames for {folder}/{pre}")
        strip = Image.new("RGBA", (64 * len(frames), 64), (0, 0, 0, 0))
        for i, f in enumerate(frames):
            strip.paste(Image.open(f).convert("RGBA"), (64 * i, 0))
        strip.save(f"{OUT}/vfx/{pre}.png")
        manifest["vfx"][pre] = {"file": f"vfx/{pre}.png", "frames": len(frames)}

with open(f"{OUT}/manifest.json", "w") as f:
    json.dump(manifest, f, indent=1)
print(f"wrote {OUT}: {len(CLASSES)} actors, {len(ENEMY)} enemies, {len(STATUSES)} status icons, {len(manifest['vfx'])} vfx strips")
