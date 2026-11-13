#!/usr/bin/env python3
"""
Builds the classes' icons: every class ability (abilities/<id>.png, 32x32) and every class passive (status/<id>.png,
16x16), and their entries in manifest.json's "abilities" and "statuses" maps.

    python3 -I ui/tools/skill_icons.py <dir with the packs extracted> ui/public/assets

The director chose each icon from three packs, found by their file names anywhere under the input dir:
  - the elemental skill pack ("elemental_skill_icon_variants_NNN", "elemental_skills_effects_NNN",
    "combat_skills_elemental_effects_NNN": 16px art drawn at 2x; the 64x64 copy is halved);
  - the status effect icons ("Status_effect1_1_NN", 1 to 500, in the pack's orange);
  - KURAI's RPG Skill Icons ("Skill Icons 16x16/IconNNN.png").
Each pack draws its own tile (KURAI a bevelled frame, the status icons a coloured square, the skill pack hatching and
a halo), so the tool lifts every icon's symbol off its tile, colours it, and draws all of them the same way: a dark
square with a rim in the icon's colour, a near-black outline round the symbol, the symbol's own shading kept.
Run it after assets.py, which leaves these icons alone.
"""
import json, sys
from collections import deque
from pathlib import Path
from PIL import Image

SRC, OUT = Path(sys.argv[1]), Path(sys.argv[2])

# Each icon: "<pack>:<number>[:<colour>]". k KURAI, s a status icon, v the skill pack's framed motifs (by their number
# in its gold row, 41 to 94, or "-" for an icon drawn in its own colours), e and c its loose effect and combat sprites.
# A colour recolours the icon by brightness onto that ramp; none keeps the pack's.
ICONS = {
    # Knight
    "vanguard": "s:44:ice", "fortify": "s:48:steel", "stand_fast": "k:24:blue", "shield_bash": "v:53:steel",
    # Cleric
    "last_rites": "s:14:gold", "renew": "v:52:gold", "cure": "k:15:gold", "raise": "v:71:gold",
    # Ranger
    "hunters_eye": "s:124:green", "barbed_arrow": "v:56:crimson", "frost_arrow": "k:49:ice", "rending_arrow": "k:132:brown",
    # Bramble knight
    "briar": "c:61", "thicket": "v:30:-", "regrowth": "s:5:green", "bramble_lash": "e:107:green",
    # Hoplite
    "phalanx": "s:47:brown", "aspis": "s:50:gold", "othismos": "v:46:gold", "spear_thrust": "s:248:gold",
    # Paladin
    "judgement": "k:18:gold", "condemn": "k:153:crimson", "absolve": "v:79:gold", "smite": "k:73:gold",
    # Valkyrie
    "shieldmaiden": "s:41:ice", "gale_spear": "k:62:green", "choosing": "v:168:-", "skyfall": "v:90:yellow",
    # Bard
    "refrain": "s:451:blue", "war_ballad": "k:7:red", "allegro": "k:3:yellow", "encore": "v:84:purple",
    # Hexer
    "cold_hex": "s:191:ice", "malison": "e:89", "unmake": "k:197:gray", "enfeeble": "s:499:purple",
    # Monk
    "iron_palm": "k:106:brown", "flow": "v:75:cyan", "burning_fist": "s:105:orange", "pressure_point": "k:84:orange",
    # Assassin
    "lacerate": "k:68:red", "vanish": "k:57:gray", "backstab": "v:74:crimson", "garrote": "s:172:orange",
    # Vampire
    "bloodlust": "k:78:crimson", "blood_drain": "v:50:crimson", "blood_gift": "k:86:crimson", "frenzy": "v:80:crimson",
    # Pyromancer
    "stoke": "k:160", "firebolt": "c:43", "fireball": "k:159", "pyre": "e:38",
    # Frostweaver
    "shatterpoint": "s:200:ice", "frost_lance": "e:57", "blizzard": "s:196:ice", "stillness": "k:13:ice",
    # Stormcaller
    "arc": "s:481:yellow", "chain_lightning": "e:70", "thunderstorm": "e:71", "static_charge": "s:313:yellow",
    # Geomancer
    "bedrock": "k:182:brown", "earthen_shell": "v:42:tan", "rockfall": "c:70:brown", "tremor": "v:72:tan",
}
PASSIVES = {"vanguard", "last_rites", "hunters_eye", "briar", "phalanx", "judgement", "shieldmaiden", "refrain", "cold_hex",
            "iron_palm", "lacerate", "bloodlust", "stoke", "shatterpoint", "arc", "bedrock"}
# KURAI icons whose frame is part of the symbol (a hood's outline, a ring): only the outer ring is cleared, and the
# background up to this share of the icon's brightness range. Chosen by eye, icon by icon.
LIFT = {"vanish": (0, .15), "blood_gift": (0, .15), "lacerate": (0, .3), "iron_palm": (2, .35), "unmake": (1, .3)}
# The rim's colour for an icon drawn in its own colours, by class.
CLASS_RAMP = {"briar": "green", "thicket": "green", "choosing": "ice", "malison": "purple", "stoke": "orange", "firebolt": "orange",
              "fireball": "orange", "pyre": "orange", "frost_lance": "ice", "chain_lightning": "yellow", "thunderstorm": "yellow"}

# Colour ramps, darkest to lightest: the status icons' (assets.py) and two more.
RAMPS = {
    "orange": [(48, 15, 10), (85, 15, 10), (155, 26, 10), (239, 105, 47), (239, 216, 161)],
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
    "cyan": [(8, 35, 40), (12, 70, 80), (30, 150, 160), (110, 235, 225), (225, 255, 250)],
}
RAMPS["tan"], RAMPS["fire"] = RAMPS["brown"], RAMPS["orange"]
# The skill pack draws its motifs in four colours, each a row of the same 54: gold from icon 41, crimson 107, tan 173,
# fire 247. Other colours are the gold row recoloured.
THEME_BASE = {"gold": 41, "crimson": 107, "tan": 173, "fire": 247}
TILE, OUTLINE = (20, 22, 34), (8, 9, 14)
lum = lambda c: .299 * c[0] + .587 * c[1] + .114 * c[2]


def find(name):
    """The first file under SRC with this name, else None."""
    return next(iter(sorted(SRC.rglob(name))), None)


def need(name):
    f = find(name)
    if not f:
        raise SystemExit(f"skill_icons: no {name} under {SRC}; extract the packs there")
    return f


def art16(f):
    """A pack image at one pixel per art pixel (the skill pack draws 16px art at 2x, or 4x in its 64px copy)."""
    im = Image.open(f).convert("RGBA")
    return im if im.width == 16 else im.resize((16, 16), Image.NEAREST)


def by_brightness(im, ramp):
    """Recolours by brightness: the icon's colours, darkest to lightest, spread over the ramp."""
    im = im.copy(); px = im.load()
    cols = sorted({px[x, y][:3] for y in range(16) for x in range(16) if px[x, y][3]}, key=lum)
    if not cols:
        return im
    lo, hi = lum(cols[0]), lum(cols[-1])
    for y in range(16):
        for x in range(16):
            r, g, b, a = px[x, y]
            if a:
                t = (lum((r, g, b)) - lo) / (hi - lo) if hi > lo else 1
                px[x, y] = (*ramp[min(4, round(t * 4))], a)
    return im


def swap(im, ramp):
    """A status icon in another status colour: each of the pack's five orange tones to the ramp's own."""
    src = RAMPS["orange"]; im = im.copy(); px = im.load()
    for y in range(16):
        for x in range(16):
            r, g, b, a = px[x, y]
            if a:
                i = min(range(5), key=lambda i: sum((p - q) ** 2 for p, q in zip(src[i], (r, g, b))))
                px[x, y] = (*ramp[i], a)
    return im


def source(key):
    """The picked icon at art size, the pack it came from, and the colour to give it after lifting (or None)."""
    p = key.split(":"); n = int(p[1]); colour = p[2] if len(p) == 3 and p[2] != "-" else None
    if p[0] == "k":
        return art16(need(f"Icon{n:03d}.png")), "kurai", colour
    if p[0] == "s":
        im = art16(need(f"Status_effect1_1_{n:02d}.png"))
        return (swap(im, RAMPS[colour]) if colour else im), "status", None
    if p[0] == "v":
        if colour is None:
            return art16(need(f"elemental_skill_icon_variants_{n:03d}.png")), "skill", None
        im = art16(need(f"elemental_skill_icon_variants_{THEME_BASE.get(colour, 41) + n - 41:03d}.png"))
        return (im if colour in THEME_BASE else by_brightness(im, RAMPS[colour])), "skill", None
    name = {"e": "elemental_skills_effects", "c": "combat_skills_elemental_effects"}[p[0]]
    return art16(need(f"{name}_{n:03d}.png")), "skill", colour


def lift(im, pack, override=None):
    """The symbol alone: the icon's tile, hatching, halo and the outline against them cleared, by a flood from the edge."""
    px = im.load()
    depth = lambda x, y: min(x, y, 15 - x, 15 - y)
    if override:
        band, cut = override
        frame = lambda x, y: depth(x, y) <= band
    elif pack == "kurai":
        # KURAI's bevel is lit from the top left: four pixels on the left, three on top, two right and bottom.
        band, cut = None, .35
        frame = lambda x, y: x < 4 or y < 3 or x > 13 or y > 13
    else:
        frame = lambda x, y: False
    if pack == "status" and not override:
        tones = sorted({px[x, y][:3] for y in range(16) for x in range(16) if px[x, y][3]}, key=lum)[:2]
        bg = lambda x, y: px[x, y][3] == 0 or px[x, y][:3] in tones
    else:
        inner = [px[x, y][:3] for y in range(16) for x in range(16) if px[x, y][3] and not frame(x, y)]
        lo, hi = min(map(lum, inner)), max(map(lum, inner))
        share = cut if (override or pack == "kurai") else .12
        bg = lambda x, y: frame(x, y) or px[x, y][3] == 0 or lum(px[x, y][:3]) <= lo + (hi - lo) * share
    seen = set(); todo = deque((x, y) for x in range(16) for y in range(16) if depth(x, y) == 0)
    while todo:
        x, y = todo.popleft()
        if (x, y) in seen or not (0 <= x < 16 and 0 <= y < 16) or not bg(x, y):
            continue
        seen.add((x, y)); todo.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])
    out = Image.new("RGBA", (16, 16), (0, 0, 0, 0)); op = out.load()
    for y in range(16):
        for x in range(16):
            if (x, y) not in seen and px[x, y][3]:
                op[x, y] = px[x, y]
    return out


def tile(sym, ramp):
    """The one tile: a 14px dark square with a rim in the icon's colour, the symbol outlined in near-black on it."""
    t = Image.new("RGBA", (16, 16), (0, 0, 0, 0)); tp = t.load(); sp = sym.load()
    for y in range(1, 15):
        for x in range(1, 15):
            tp[x, y] = (*(ramp[2] if x in (1, 14) or y in (1, 14) else TILE), 255)
    mark = {(x, y) for y in range(16) for x in range(16) if sp[x, y][3]}
    for x, y in mark:
        for q in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if q not in mark and 1 <= q[0] <= 14 and 1 <= q[1] <= 14:
                tp[q] = (*OUTLINE, 255)
    for x, y in mark:
        if 1 <= x <= 14 and 1 <= y <= 14:
            tp[x, y] = sp[x, y]
    return t


def rim_ramp(aid, key):
    p = key.split(":")
    return RAMPS[p[2]] if len(p) == 3 and p[2] in RAMPS else RAMPS[CLASS_RAMP[aid]]


(OUT / "abilities").mkdir(parents=True, exist_ok=True); (OUT / "status").mkdir(parents=True, exist_ok=True)
manifest = json.load(open(OUT / "manifest.json"))
manifest.setdefault("abilities", {})
for aid, key in ICONS.items():
    im, pack, colour = source(key)
    sym = lift(im, pack, LIFT.get(aid))
    if colour:
        sym = by_brightness(sym, RAMPS[colour])
    icon = tile(sym, rim_ramp(aid, key))
    if aid in PASSIVES:
        icon.save(OUT / "status" / f"{aid}.png"); manifest["statuses"][aid] = f"status/{aid}.png"
    else:
        icon.resize((32, 32), Image.NEAREST).save(OUT / "abilities" / f"{aid}.png"); manifest["abilities"][aid] = f"abilities/{aid}.png"
with open(OUT / "manifest.json", "w") as f:
    json.dump(manifest, f, indent=1)
print(f"skill icons: {len(ICONS) - len(PASSIVES)} abilities, {len(PASSIVES)} passives")
