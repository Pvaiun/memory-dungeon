#!/usr/bin/env python3
"""
Builds the game's skill and status icons: every class ability (abilities/<id>.png, 32x32), the basic attack's icon for
each weapon kind (basic/<kind>.png, 32x32), and every status that shows, the class passives among them
(status/<id>.png, 16x16), with their entries in manifest.json's "abilities", "basic" and "statuses" maps. A status icon
no status uses any more is deleted.

    python3 -I ui/tools/skill_icons.py <dir with the packs extracted> ui/public/assets

The director chose each icon from three packs, found by their file names anywhere under the input dir:
  - the elemental skill pack ("elemental_skill_icon_variants_NNN", "elemental_skills_effects_NNN",
    "combat_skills_elemental_effects_NNN": 16px art drawn at 2x; the 64x64 copy is halved);
  - the status effect icons ("Status_effect1_1_NN", 1 to 500, in the pack's orange);
  - KURAI's RPG Skill Icons ("Skill Icons 16x16/IconNNN.png").
Each pack draws its own tile (KURAI a bevelled frame, the status icons a coloured square, the skill pack hatching and
a halo), so the tool lifts every icon's symbol off its tile, colours it, and draws all of them the same way: a dark
square with a rim in the icon's colour, a near-black outline round the symbol, the symbol's own shading kept. A basic
attack's icon is its weapon kind's, on the same tile with a grey rim, so the abilities stand out beside it; its
symbol is steel, wood brown, or crimson for a bite. A status's icon is on the same tile with its own colour on the
rim; a gear piece's effect may show the piece's icon, a class upgrade's the ability or passive it trains.
Run it after assets.py, which leaves these icons alone.
"""
import colorsys, json, sys
from collections import deque
from pathlib import Path
from PIL import Image

SRC = OUT = None  # set by main(), or by a tool that borrows the drawing below

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

# A basic attack's icon, by weapon kind, and "bite" for beasts (src/art.ts picks one for every unit). Each is lifted in
# its pack's own colours and then recoloured: metal steel, wood and leather brown, a bite crimson; the rune sword is
# the sword's blade in ice, its runes' glow.
KINDS = {
    "sword": ("v:43:-", "steel"), "dagger": ("v:74:-", "steel"), "spear": ("k:133", "steel"), "axe": ("v:61:-", "steel"),
    "great_weapon": ("k:56", "steel"), "hammer": ("v:59:-", "steel"), "mace": ("v:60:-", "steel"), "bow": ("v:45:-", "brown"),
    "staff": ("v:87:-", "brown"), "wand": ("k:34", "brown"), "rune_sword": ("v:43:-", "ice"), "fist": ("s:105", "brown"),
    "bite": ("c:79", "crimson"),
}
# KURAI's double axe draws its haft in its frame's red: its grey heads are kept by colour (anything saturated, or near
# black, cleared), and the haft drawn back by hand.
KIND_GREY = {"great_weapon": (0, .4)}
KIND_HAFT = {"great_weapon": [(10, 5), (9, 6), (8, 7), (7, 8), (6, 9), (5, 10), (4, 11), (3, 12)]}

STATUS_ICONS = {  # status id(s) → (icon, the status's colour: its rim, and the symbol's for a recoloured pick)
    # The statuses
    'bleed': ('s:283:red', 'red'),
    'regen': ('s:83:green', 'green'),
    'shield': ('s:41:ice', 'ice'),
    'might': ('s:102:orange', 'orange'),
    'weaken': ('s:162:purple', 'purple'),
    'guard': ('s:48:steel', 'steel'),
    'stun': ('s:322:yellow', 'yellow'),
    'slow': ('s:13:blue', 'blue'),
    'haste': ('s:341:yellow', 'yellow'),
    'taunt': ('s:35:red', 'red'),
    'burn': ('s:301:orange', 'orange'),
    'chill': ('s:193:ice', 'ice'),
    'shock': ('s:382:yellow', 'yellow'),
    'sunder': ('s:263:brown', 'brown'),
    'silence': ('s:402:gray', 'gray'),
    'hidden': ('s:371:gray', 'gray'),
    'marked': ('s:34:red', 'red'),
    'rot': ('s:9:sick', 'sick'),
    'clarity': ('s:311:blue', 'blue'),
    'aegis': ('s:50:gold', 'gold'),
    'doom': ('s:15:crimson', 'crimson'),
    'bulwark': ('s:44:steel', 'steel'),
    'bulwark_broken': ('s:269:red', 'red'),
    'ice_crust': ('s:194:ice', 'ice'),
    'encore': ('cls:encore', 'purple'),
    # Counters
    'cuts': ('s:286:steel', 'steel'),
    'heat': ('s:436:orange', 'orange'),
    'spite': ('s:296:crimson', 'crimson'),
    'wrath': ('s:175:gold', 'gold'),
    'crescendo': ('s:455:purple', 'purple'),
    'cascade': ('s:198:ice', 'ice'),
    'rebuke_count': ('cls:bramble_lash', 'green'),
    'metronome_count': ('gear:metronome', 'gold'),
    # Stats
    'mp_regen': ('s:311:blue', 'blue'),
    'thorns': ('s:352:green', 'green'),
    'lifesteal': ('s:61:crimson', 'crimson'),
    'siphon': ('s:313:purple', 'purple'),
    'double_strike': ('s:209:steel', 'steel'),
    # Foe passives
    'venom': ('s:94:red', 'red'),
    'fire_bite': ('s:301:orange', 'orange'),
    'split': ('s:481:orange', 'orange'),
    'volatile': ('s:164:orange', 'orange'),
    'rime': ('s:191:ice', 'ice'),
    'ice_crust_passive': ('s:194:ice', 'ice'),
    'frozen_core': ('s:45:ice', 'ice'),
    'static': ('s:382:yellow', 'yellow'),
    'vengeance': ('s:171:red', 'red'),
    # Gear effects
    'second_thrust_on': ('kind:dagger', 'gold'),
    'gorged_claws_on': ('kind:fist', 'crimson'),
    'oathkeeper_on': ('kind:sword', 'gold'),
    'squall_lance_count': ('kind:spear', 'cyan'),
    'the_red_feast_on': ('kind:axe', 'crimson'),
    'opening_shot_on': ('kind:bow', 'gold'),
    'volley_bow_count': ('kind:bow', 'brown'),
    'spellbinder_on': ('kind:rune_sword', 'purple'),
    'bellringer_count': ('kind:hammer', 'yellow'),
    'saints_mace_blessing': ('kind:mace', 'gold'),
    'evensong_staff_count': ('kind:staff', 'purple'),
    'stormspear_count': ('kind:spear', 'yellow'),
    'the_witch_blade_swings': ('kind:sword', 'purple'),
    'portcullis_on': ('gear:portcullis', 'steel'),
    'urchin_plate_on': ('gear:urchin_plate', 'green'),
    'last_bastion_on': ('gear:last_bastion', 'red'),
    'bloodsworn_mail_on': ('gear:bloodsworn_mail', 'crimson'),
    'sanguine_mail_low sanguine_mail_high': ('gear:sanguine_mail', 'crimson'),
    'mottled_hide_on': ('gear:mottled_hide', 'brown'),
    'frostwalkers_furs_on': ('gear:frostwalkers_furs', 'ice'),
    'matins_robe_count': ('gear:matins_robe', 'gold'),
    'glimmer_robe_on': ('gear:glimmer_robe', 'gold'),
    'nights_edge_strike': ('gear:nights_edge', 'purple'),
    'ember_heart_held': ('gear:ember_heart', 'orange'),
    'crown_of_embers_aura': ('gear:crown_of_embers', 'orange'),
    'spiked_targe_on': ('gear:spiked_targe', 'green'),
    'twice_told_tome_count': ('gear:twice_told_tome', 'purple'),
    'accompanists_score_free': ('gear:accompanists_score', 'blue'),
    'hushing_idol_on': ('gear:hushing_idol', 'gray'),
    'ravening_draught_on': ('gear:ravening_draught', 'crimson'),
    'the_kings_head_on': ('gear:the_kings_head', 'gold'),
    'ringing_bell_count': ('gear:ringing_bell', 'yellow'),
    'bell_of_the_hour_count': ('gear:bell_of_the_hour', 'gold'),
    'tempest_cloak_on': ('gear:tempest_cloak', 'cyan'),
    # Class upgrades
    'last_rites_on': ('cls:last_rites', 'purple'),
    'rite_of_passage': ('cls:last_rites', 'crimson'),
    'bloodlust_on bloodlust_on_plus': ('cls:bloodlust', 'crimson'),
    'bedrock_on bedrock_on_plus': ('cls:bedrock', 'brown'),
    'thunderstorm_storm thunderstorm_storm_plus': ('cls:thunderstorm', 'yellow'),
    'static_charge_on': ('cls:static_charge', 'yellow'),
    'hold_the_line': ('cls:stand_fast', 'steel'),
    'battle_prayer battle_prayer_plus': ('cls:cure', 'gold'),
    'bloodroot': ('cls:briar', 'crimson'),
    'overgrowth': ('cls:thicket', 'green'),
    'deep_roots': ('cls:regrowth', 'brown'),
    'opening_thrust': ('cls:phalanx', 'steel'),
    'cadenza': ('cls:encore', 'purple'),
    'flow_state_count': ('cls:flow', 'cyan'),
    'stillness_of_mind': ('cls:flow', 'blue'),
    'shadow_step_strike': ('cls:vanish', 'purple'),
    'shared_feast_on shared_feast_on_plus': ('cls:bloodlust', 'gold'),
    'undying_thirst undying_thirst_plus': ('cls:bloodlust', 'crimson'),
    'bloodthirst': ('cls:frenzy', 'red'),
    'feeding_frenzy': ('cls:frenzy', 'red'),
    'bleed_them_dry': ('cls:garrote', 'crimson'),
    'frost_armor frost_armor_plus': ('cls:blizzard', 'ice'),
    'deep_calm_free': ('cls:stillness', 'blue'),
    'static_field static_field_plus': ('cls:thunderstorm', 'yellow'),
    'storms_eye storms_eye_plus': ('cls:thunderstorm', 'yellow'),
    'overcharge_charges': ('s:311:yellow', 'yellow'),
    'storm_shield': ('cls:static_charge', 'yellow'),
    'faultline': ('cls:bedrock', 'brown'),
    'rampart': ('cls:earthen_shell', 'steel'),
    # Formations
    'the_wheel_wall the_wheel_wall_opening': ('s:47:steel', 'steel'),
    'the_wheel_blade the_wheel_blade_opening': ('s:201:gold', 'gold'),
    'the_wheel_well the_wheel_well_opening': ('s:311:blue', 'blue'),
}
# KURAI icons whose frame is part of the symbol, picked for statuses: lifted as the class icons' twins are.
STATUS_LIFT = {57: (0, .15), 86: (0, .15), 68: (0, .3), 106: (2, .35), 197: (1, .3), 66: (0, .15)}

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
    "sick": [(20, 30, 10), (40, 60, 15), (90, 120, 30), (160, 200, 70), (235, 250, 200)],
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


def lift_grey(im, band, sat_max):
    """The metal alone: the frame's outer ring cleared, then everything coloured or near-black, flooded from the edge."""
    px = im.load()
    depth = lambda x, y: min(x, y, 15 - x, 15 - y)

    def bg(x, y):
        r, g, b, a = px[x, y]
        if not a or depth(x, y) <= band:
            return True
        _, light, sat = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
        return sat > sat_max or light < .12
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


def basic_icon(kind):
    """A weapon kind's basic-attack icon: its symbol in one colour, on the tile with a grey rim."""
    key, colour = KINDS[kind]
    im, pack, _ = source(key)
    sym = lift_grey(im, *KIND_GREY[kind]) if kind in KIND_GREY else lift(im, pack)
    sym = by_brightness(sym, RAMPS[colour])
    sp = sym.load()
    for x, y in KIND_HAFT.get(kind, []):
        if not sp[x, y][3]:
            sp[x, y] = (*RAMPS["brown"][3], 255)
    return tile(sym, RAMPS["gray"])


def rerim(icon, ramp):
    """A built icon (the shared tile) with its rim in another colour."""
    icon = icon.copy(); px = icon.load()
    for i in range(1, 15):
        for x, y in ((i, 1), (i, 14), (1, i), (14, i)):
            px[x, y] = (*ramp[2], 255)
    return icon


def status_icon(key, colour):
    """A status's icon, 16x16: its pick on the shared tile, the status's colour on the rim. "cls:<id>" is a class ability's
    or passive's icon, "kind:<kind>" a weapon kind's, "gear:<id>" a gear piece's from the gear sheet; else a pack icon."""
    ramp = RAMPS[colour]; p = key.split(":")
    if p[0] == "cls":
        f = OUT / "status" / f"{p[1]}.png" if p[1] in PASSIVES else OUT / "abilities" / f"{p[1]}.png"
        return rerim(Image.open(f).convert("RGBA").resize((16, 16), Image.NEAREST), ramp)
    if p[0] == "kind":
        return rerim(basic_icon(p[1]), ramp)
    if p[0] == "gear":
        manifest = json.load(open(OUT / "manifest.json")); n = manifest["gear"][p[1]]
        sheet = Image.open(OUT / manifest["gearSheet"]).convert("RGBA")
        return tile(sheet.crop(((n % 16) * 16, (n // 16) * 16, (n % 16) * 16 + 16, (n // 16) * 16 + 16)), ramp)
    im, pack, recolour = source(key)
    sym = lift(im, pack, STATUS_LIFT.get(int(p[1])) if p[0] == "k" else None)
    if recolour:
        sym = by_brightness(sym, RAMPS[recolour])
    return tile(sym, ramp)


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


def main():
    global SRC, OUT
    SRC, OUT = Path(sys.argv[1]), Path(sys.argv[2])
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
    (OUT / "basic").mkdir(exist_ok=True); manifest["basic"] = {}
    for kind in KINDS:
        basic_icon(kind).resize((32, 32), Image.NEAREST).save(OUT / "basic" / f"{kind}.png"); manifest["basic"][kind] = f"basic/{kind}.png"
    with open(OUT / "manifest.json", "w") as f:
        json.dump(manifest, f, indent=1)
    # the statuses last: some show a class icon or a weapon kind's, built above
    shown = set(PASSIVES)
    for ids, (key, colour) in STATUS_ICONS.items():
        icon = status_icon(key, colour)
        for sid in ids.split():
            icon.save(OUT / "status" / f"{sid}.png"); manifest["statuses"][sid] = f"status/{sid}.png"; shown.add(sid)
    stale = [sid for sid in manifest["statuses"] if sid not in shown]
    for sid in stale:
        (OUT / manifest["statuses"].pop(sid)).unlink(missing_ok=True)
    with open(OUT / "manifest.json", "w") as f:
        json.dump(manifest, f, indent=1)
    print(f"skill icons: {len(ICONS) - len(PASSIVES)} abilities, {len(PASSIVES)} passives, {len(KINDS)} basic attacks, "
          f"{len(shown) - len(PASSIVES)} statuses ({len(stale)} unused icons deleted)")


if __name__ == "__main__":
    main()
