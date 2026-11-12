#!/usr/bin/env python3
"""
Builds the gear icons: one 16x16 icon for every piece that isn't a weapon, in one sheet.

    python3 -I ui/tools/gear_icons.py <dir with the packs extracted> ui/public/assets

It finds the director's gear icon pack (a folder holding manifest.csv and icons/, "game_icons") anywhere under the
input dir, and writes gear.png (16 columns of 16x16 cells, art size) and the "gear" map in manifest.json: each piece's
cell by id, a cell per kind for pieces not listed here ("kind:<kind>"), and the empty slots' ("slot:<slot>").

Every icon shows its piece's kind: plate is a breastplate, mail a hauberk, a horn a horn. Within a kind each piece
gets its own icon by its name and theme, or the same icon in another colour (`recolor`: its colours spread by
brightness over a ramp, the outline kept). An icon belongs to one kind only. The pack draws no orbs, vials, bells,
tomes, lanterns, totems, skulls or chalices, so this tool draws them from the grids below, in the pack's style: its
palette, a near-black outline round the silhouette, each material lit at its top and left and dark at its bottom
and right. Weapons keep the iconset and their strips (src/art.ts).
"""
import csv, json, sys
from pathlib import Path
from PIL import Image

SRC, OUT = Path(sys.argv[1]), Path(sys.argv[2])
PACK = next((p.parent for p in sorted(SRC.rglob("manifest.csv")) if (p.parent / "icons").is_dir()), None)
CONTENT = Path(__file__).resolve().parents[2] / "content" / "core-set.pack.json"

OUTLINE = (0x13, 0x13, 0x13)
# Ramps from the pack's palette, light to dark.
RAMP = {
    "steel": ["#e2e5f7", "#c7cfdd", "#92a1b9", "#657392", "#424c6e"],
    "dark": ["#92a1b9", "#657392", "#424c6e", "#2a2f4e", "#1a1932"],
    "stone": ["#b4b4b4", "#858585", "#5d5d5d", "#3d3d3d", "#272727"],
    "shadow": ["#86718c", "#724e63", "#3f3245", "#302d36", "#1c121c"],
    "gold": ["#ffeb57", "#ffc825", "#ffa214", "#ed7614", "#bf6f4a"],
    "fire": ["#ffeb57", "#ffc825", "#ff9148", "#ff5000", "#c64524"],
    "red": ["#f68187", "#f5555d", "#ea323c", "#c42430", "#891e2b"],
    "blood": ["#ea323c", "#c42430", "#891e2b", "#571c27", "#391f21"],
    "rust": ["#e69c69", "#bf6f4a", "#b64336", "#8e251d", "#5d2c28"],
    "wood": ["#f6ca9f", "#e69c69", "#bf6f4a", "#8a4836", "#5d2c28"],
    "bone": ["#ffffff", "#f9e6cf", "#f6ca9f", "#e69c69", "#bf6f4a"],
    "pearl": ["#ffffff", "#e2e5f7", "#c7cfdd", "#92a1b9", "#657392"],
    "ice": ["#ffffff", "#94fdff", "#0cf1ff", "#00cdf9", "#0098dc"],
    "blue": ["#65d4ff", "#009beb", "#0069aa", "#00396d", "#03193f"],
    "shock": ["#ffffff", "#ffeb57", "#ffc825", "#3e65b8", "#2e3053"],
    "purple": ["#f389f5", "#db3ffd", "#7a09fa", "#3003d9", "#0c0293"],
    "void": ["#b585f7", "#7a09fa", "#3003d9", "#0c0293", "#0e071b"],
    "hex": ["#c7acda", "#a05ead", "#93388f", "#4c243e", "#1c121c"],
    "pink": ["#ffe1e3", "#ff819b", "#eb6581", "#c85086", "#853954"],
    "green": ["#d3fc7e", "#99e65f", "#5ac54f", "#33984b", "#1e6f50"],
    "jade": ["#a5d0b5", "#00bd6f", "#009160", "#005a4a", "#134c4c"],
}
hx = lambda s: tuple(int(s[i:i + 2], 16) for i in (1, 3, 5))
lum = lambda c: 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]

# ─── Drawn icons: one letter a material (its ramp named per piece), "w" a white glint, "o" an outline line, "." empty ───
DRAWN = {
    "orb": [
        "", "......AAAA", "....AAAAAAAA", "....AAAAAwwA", "...AAAAAAAwAA", "...AAAAAAAAAA", "...AAAAAAAAAA",
        "...AAAAAAAAAA", "....AAAAAAAA", "....AAAAAAAA", "...BB.AAAA.BB", "....BBBBBBBB", ".....BBBBBB", "....BBBBBBBB",
    ],
    "vial": [
        "", "......BBBB", "......BBBB", ".......CC", ".......CC", "......CCCC", "....CCCCCCCC", "...CAAAAAAwAC",
        "...CAAAAAAAwC", "...CAAAAAAAAC", "...CAAAAAAAAC", "....CAAAAAAC", ".....CCCCCC",
    ],
    "phial": [
        "", ".......BB", "......BBBB", ".......CC", "......CCCC", "......CAwC", "......CAwC", "......CAAC",
        "......CAAC", "......CAAC", "......CAAC", ".......CC",
    ],
    "bell": [
        "", ".......BB", "......B..B", "......BBBB", ".....AAAAAA", "....AAAAAwAA", "....AAAAAwAA", "....AAAAAAAA",
        "....AAAAAAAA", "...AAAAAAAAAA", "..AAAAAAAAAAAA", "..CCCCCCCCCCCC", "......BBBB", ".......BB",
    ],
    "tome": [
        "", "...AAAAAAAAAA", "..oAAAAAAAAAAC", "..oAAAAAAAAAAC", "..oAAAAABAAAAC", "..oAAAABBBAAAC", "..oAAABBwBBAAC",
        "..oAAAABBBAAAC", "..oAAAAABAAAAC", "..oAAAAAAAAAAC", "..oAAAAAAAAAAC", "..oAAAAAAAAAAC", "...ACCCCCCCCCC",
        "....CCCCCCCCC",
    ],
    "lantern": [
        "", "......AAAA", "......A..A", ".....AAAAAA", "....AAAAAAAA", ".....ABBBBA", ".....ABBwBA", ".....ABwwBA",
        ".....ABBwBA", ".....ABBBBA", "....AAAAAAAA", ".....AAAAAA",
    ],
    "totem": [
        "", "......AAAA", ".BBB.AAAAAA.BBB", "..BBBAwAAwABBB", "...BBAAAAAABB", ".....AAooAA", ".....CCCCCC",
        ".....CoCCoC", ".....CCCCCC", ".....CCooCC", ".....AAAAAA", "......AAAA", "......AAAA", "......AAAA", "......AAAA",
    ],
    "skull": [
        "", "", ".....AAAAA", "....AAAAAAA", "...AAAAAAAAA", "...AAAAAAAAA", "...AooAAAooA", "...AooAAAooA",
        "...AAAAoAAAA", "....AAAAAAA", ".....AoAoA", ".....AAAAA",
    ],
    "chalice": [
        "", "", "..AAAAAAAAAA", "..ABBBBBBBBA", "..AAAAAAAAwA", "...AAAAAAAA", "....AAAAAA", ".....AAAA",
        "......AA", "......AA", ".....AAAA", "....AAAAAA",
    ],
}


def draw(name, mats):
    g = [r.ljust(16, ".")[:16] for r in DRAWN[name]]
    g += ["." * 16] * (16 - len(g))
    at = lambda x, y: g[y][x] if 0 <= x < 16 and 0 <= y < 16 else "."
    im = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
    for y in range(16):
        for x in range(16):
            ch = g[y][x]
            if ch == ".":
                if any(at(x + dx, y + dy) != "." for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                    im.putpixel((x, y), OUTLINE + (255,))
                continue
            if ch == "o":
                im.putpixel((x, y), OUTLINE + (255,))
                continue
            if ch == "w":
                im.putpixel((x, y), (255, 255, 255, 255))
                continue
            light, mid, dark = (hx(c) for c in RAMP[mats[ch]][1:4])
            lit = at(x - 1, y) != ch or at(x, y - 1) != ch
            shaded = at(x + 1, y) != ch or at(x, y + 1) != ch
            col = light if lit and not shaded else dark if shaded and not lit else mid
            if not lit and not shaded and at(x + 1, y + 1) != ch:
                col = dark
            im.putpixel((x, y), col + (255,))
    return im


def empty(im):
    """An empty slot's icon: the piece as a soft grey silhouette, its outline a mid grey, so it reads as nothing worn on a light page or a dark one."""
    im = im.copy()
    px = im.load()
    cols = sorted({px[x, y][:3] for y in range(16) for x in range(16) if px[x, y][3] and lum(px[x, y][:3]) > 40}, key=lum)
    mid = lum(cols[len(cols) // 2]) if cols else 0
    for y in range(16):
        for x in range(16):
            p = px[x, y]
            if p[3]:
                c = "#657392" if lum(p[:3]) <= 40 else "#92a1b9" if lum(p[:3]) < mid else "#c7cfdd"
                px[x, y] = hx(c) + (p[3],)
    return im


def recolor(im, ramp):
    """The icon's colours, darkest to lightest, spread over the ramp; the outline (near black) kept."""
    im = im.copy()
    px = im.load()
    cols = sorted({px[x, y][:3] for y in range(16) for x in range(16) if px[x, y][3] and lum(px[x, y][:3]) > 40}, key=lum)
    r = [hx(c) for c in reversed(RAMP[ramp])]
    to = {c: r[round(i * (len(r) - 1) / max(1, len(cols) - 1))] for i, c in enumerate(cols)}
    for y in range(16):
        for x in range(16):
            p = px[x, y]
            if p[3] and p[:3] in to:
                px[x, y] = to[p[:3]] + (p[3],)
    return im


# ─── Each piece's icon: a pack icon by number, recoloured or not, or a drawn one with its materials' ramps ───
P = lambda n, ramp=None: ("pack", n, ramp)
D = lambda name, **mats: ("drawn", name, mats)

PIECES = {
    # Plate: the pack's breastplates.
    "ironclad": P("016"), "crested_plate": P("024"), "bristled_plate": P("019"), "portcullis": P("022"),
    "keystone_cuirass": P("021"), "holdfast": P("023"), "urchin_plate": P("027"), "challengers_plate": P("020"),
    "hoarfrost_plate": P("025"), "rubble_plate": P("016", "stone"), "thornheart_plate": P("026"), "last_bastion": P("018"),
    "the_anvil": P("029"),
    # Mail: the chainmail, the lamellar and the cuirass, in the piece's colours.
    "inscribed_hauberk": P("028"), "lamprey_mail": P("028", "shadow"), "thick_byrnie": P("031"), "scabbed_mail": P("030", "rust"),
    "reprisal_hauberk": P("028", "red"), "bloodsworn_mail": P("030", "blood"), "warded_mail": P("031", "blue"),
    "static_mail": P("028", "shock"), "red_stone_mail": P("031", "red"), "sanguine_mail": P("028", "blood"),
    "hexweave_mail": P("030", "hex"), "aegis_mail": P("031", "gold"), "tallymail": P("030"), "heartwood_mail": P("031", "green"),
    # Leather: the pack's tunics, coats and jackets.
    "tumblers_vest": P("096"), "footpads_jerkin": P("097"), "spotters_coat": P("099"), "gleaners_leathers": P("017"),
    "trackers_coat": P("098"), "mottled_hide": P("108"), "quickstep_leathers": P("110"), "duelists_leathers": P("100"),
    "shadow_mantle": P("111"), "pack_leaders_coat": P("108", "stone"), "frostwalkers_furs": P("108", "ice"),
    "overture_coat": P("106"), "windrunners_garb": P("110", "green"), "carriers_coat": P("097", "hex"),
    "huntmasters_quiver": P("017", "gold"), "nights_edge": P("017", "shadow"),
    # Robes: the pack's robes, vestments and kimono.
    "wayfarers_habit": P("103"), "rainwater_robe": P("105"), "hermits_cowl": P("102"), "matins_robe": P("104"),
    "banked_robe": P("102", "fire"), "glyphed_robe": P("101"), "acolytes_robe": P("104", "bone"), "kindled_robes": P("109"),
    "quiet_robes": P("107"), "resonant_robes": P("101", "pink"), "flagellants_vestments": P("104", "blood"),
    "glimmer_robe": P("105", "gold"), "archmages_mantle": P("101", "blue"), "vestments_of_return": P("104", "gold"),
    "motley_robe": P("103", "pink"), "glaciers_heart": P("105", "pearl"),
    # Amulets: rings, necklaces, earrings and pins (not the ones the offhands borrow); the crowns the pack's crown.
    "bezoar": P("199"), "ironstone": P("192"), "flint": P("207"), "cats_eye": P("206"), "dewstone": P("201"),
    "quicksilver": P("204"), "carnelian": P("196"), "caltrop": P("236"), "skipping_stone": P("208"), "tidestone": P("195"),
    "tinder_charm": P("246"), "challengers_token": P("248"), "carapace_charm": P("222"), "hares_foot": P("210"),
    "millstone": P("223"), "hummingbird_charm": P("231"), "clear_headed_charm": P("243"), "shatterstone_charm": P("237"),
    "bounty_charm": P("226"), "echo_charm": P("238"), "floe_charm": P("249"), "lightning_glass": P("232"),
    "halved_heart": P("254"), "crescendo_charm": P("229"), "ember_heart": P("198"), "hunters_mark": P("202"),
    "shroud_charm": P("235"), "heart_of_winter": P("217"), "second_dawn": P("216"), "downhill_charm": P("212"),
    "twin_knot": P("194"), "scapegoat_charm": P("209"), "burning_heart": P("214"), "phoenix_ember": P("218"),
    "ready_stance": P("234"), "gamblers_coin": P("200"), "turncoat_charm": P("203"),
    "halo_of_the_saint": P("090"), "crown_of_embers": P("090", "fire"), "mountains_crown": P("090", "stone"),
    # Kite shields: the crystal kites, in the piece's colours.
    "pavise": P("281", "steel"), "blazoned_kite": P("282", "red"), "emberguard": P("278", "fire"), "sheltering_kite": P("283"),
    "bossed_kite": P("285", "steel"), "rubble_shield": P("289", "stone"), "mirror_shield": P("288"),
    "monolith_shield": P("284", "stone"), "oathbound_shield": P("287", "gold"),
    # Round shields: the round and rune shields.
    "linden_shield": P("256"), "bronze_buckler": P("261"), "comrades_targe": P("257"), "hunters_buckler": P("275"),
    "spiked_targe": P("258"), "second_skin": P("265"), "hoplon": P("272"), "tower_shield": P("259"),
    "shield_of_the_chosen": P("270"), "lodestone_shield": P("299"), "the_last_wall": P("295"),
    # Cloaks.
    "travellers_cloak": P("160"), "swallowtail_cloak": P("163"), "hooded_cloak": P("161"), "feathered_cloak": P("162"),
    "matadors_cape": P("164"), "dancers_cloak": P("165"), "tempest_cloak": P("174"), "shadow_cloak": P("171"),
    "swans_grace": P("169"),
    # Horns: the pack's horn.
    "rams_horn": P("252"), "ivory_horn": P("252", "bone"), "reveille": P("252", "gold"), "bulls_horn": P("252", "wood"),
    "watch_horn": P("252", "steel"), "war_horn": P("252", "red"), "hunting_horn": P("252", "jade"),
    "horn_of_the_charge": P("252", "fire"), "horn_of_the_keep": P("252", "blue"),
    # Totems: drawn; A the pole, B the wings, C the face.
    "blackthorn_stake": D("totem", A="shadow", B="stone", C="shadow"), "hawthorn_fetish": D("totem", A="wood", B="red", C="wood"),
    "spinebark_pole": D("totem", A="wood", B="green", C="rust"), "stormglass_totem": D("totem", A="stone", B="gold", C="ice"),
    "bear_fetish": D("totem", A="rust", B="wood", C="wood"), "nettle_totem": D("totem", A="wood", B="green", C="jade"),
    "spite_totem": D("totem", A="shadow", B="blood", C="red"), "thunderhead_totem": D("totem", A="stone", B="shock", C="blue"),
    "goading_totem": D("totem", A="wood", B="red", C="gold"), "earthmother_totem": D("totem", A="wood", B="jade", C="green"),
    # Relics: the pack's cross, rosary and heart.
    "shrine_token": P("242"), "litany_beads": P("221"), "holy_water": P("242", "ice"), "charnel_icon": P("242", "bone"),
    "font_relic": P("242", "blue"), "phylactery": P("221", "hex"), "accusers_relic": P("242", "red"),
    "heart_of_the_saint": P("255", "gold"), "bloodstone_reliquary": P("255", "blood"), "writ_of_judgement": P("242", "pearl"),
    # Lanterns: drawn; A the frame, B the light.
    "bullseye_lantern": D("lantern", A="steel", B="fire"), "hooded_lantern": D("lantern", A="shadow", B="fire"),
    "pitch_lantern": D("lantern", A="dark", B="red"), "dazzling_lantern": D("lantern", A="gold", B="shock"),
    "wick": D("lantern", A="wood", B="fire"), "shuttered_lantern": D("lantern", A="stone", B="gold"),
    "everflame_lantern": D("lantern", A="gold", B="fire"), "lamp_of_vigil": D("lantern", A="steel", B="pearl"),
    # Tomes: drawn; A the cover, B the emblem, C the pages.
    "scholars_codex": D("tome", A="wood", B="gold", C="bone"), "hymnal": D("tome", A="red", B="gold", C="bone"),
    "snowbound_folio": D("tome", A="steel", B="ice", C="bone"), "marginalia": D("tome", A="green", B="gold", C="bone"),
    "curse_book": D("tome", A="shadow", B="red", C="bone"), "primer_of_frost": D("tome", A="ice", B="pearl", C="bone"),
    "twice_told_tome": D("tome", A="purple", B="gold", C="bone"), "grimoire_of_plagues": D("tome", A="jade", B="green", C="bone"),
    "accompanists_score": D("tome", A="pink", B="gold", C="bone"), "last_page": D("tome", A="stone", B="bone", C="bone"),
    "annotated_grimoire": D("tome", A="void", B="fire", C="bone"), "frozen_tome": D("tome", A="blue", B="ice", C="bone"),
    # Orbs: drawn; A the orb, B the stand.
    "glass_orb": D("orb", A="ice", B="steel"), "ember_orb": D("orb", A="fire", B="dark"), "scrying_orb": D("orb", A="purple", B="gold"),
    "mana_pearl": D("orb", A="pearl", B="gold"), "meltwater_orb": D("orb", A="blue", B="steel"), "smouldering_orb": D("orb", A="red", B="dark"),
    "orb_of_the_deep": D("orb", A="void", B="steel"), "orb_of_the_rising_sun": D("orb", A="gold", B="red"),
    "the_deep_well": D("orb", A="jade", B="gold"),
    # Idols: the pack's demon mask and oni mask.
    "night_mask": P("093", "shadow"), "carved_effigy": P("253", "wood"), "fanged_idol": P("253"), "leech_idol": P("253", "jade"),
    "hushing_idol": P("093"), "festering_idol": P("253", "green"), "idol_of_binding": P("093", "steel"),
    "idol_of_the_hungry_dark": P("253", "void"), "idol_of_the_deep": P("093", "blue"), "idol_of_the_blood_well": P("253", "blood"),
    # Vials: drawn, a round flask or a thin phial; A the draught, B the stopper, C the glass.
    "red_tincture": D("vial", A="red", B="wood", C="ice"), "hemlock_phial": D("phial", A="green", B="wood", C="ice"),
    "crimson_dregs": D("vial", A="blood", B="wood", C="ice"), "lancet_phial": D("phial", A="red", B="steel", C="ice"),
    "blood_vial": D("vial", A="blood", B="gold", C="ice"), "venom_vial": D("vial", A="void", B="dark", C="ice"),
    "ravening_draught": D("vial", A="hex", B="wood", C="ice"), "heartsblood": D("vial", A="red", B="gold", C="pearl"),
    # Trophies: the drawn skull, and the pack's fangs, feather, bone and crystal.
    "wolf_pelt": P("220"), "geode": P("245"), "hunters_skull": D("skull", A="bone"), "eagle_feather": P("250"),
    "vultures_skull": D("skull", A="stone"), "ogres_tusk": P("241"), "dragons_tooth": P("241", "jade"),
    "the_kings_head": D("skull", A="gold"),
    # Bells: drawn; A the bell, B the handle and clapper, C the lip.
    "prayer_bell": D("bell", A="gold", B="steel", C="wood"), "cantors_bell": D("bell", A="steel", B="dark", C="stone"),
    "ringing_bell": D("bell", A="rust", B="steel", C="wood"), "pacers_bell": D("bell", A="blue", B="steel", C="dark"),
    "bell_of_the_hour": D("bell", A="pearl", B="gold", C="gold"), "warding_bell": D("bell", A="jade", B="gold", C="wood"),
    "tireless_bell": D("bell", A="fire", B="dark", C="red"), "metronome": D("bell", A="void", B="gold", C="gold"),
    # The Vampire's chalice: drawn; A the cup, B what's in it.
    "the_chalice": D("chalice", A="gold", B="blood"),
}
# A piece not listed above shows its kind's; an empty slot its slot's, dimmed. Weapons keep theirs.
KINDS = {
    "plate": P("016"), "mail": P("028"), "leather": P("017"), "robes": P("101"), "amulet": P("208"),
    "kite_shield": P("282"), "round_shield": P("256"), "horn": P("252"), "totem": D("totem", A="wood", B="red", C="wood"),
    "relic": P("242"), "lantern": D("lantern", A="steel", B="fire"), "tome": D("tome", A="wood", B="gold", C="bone"),
    "orb": D("orb", A="purple", B="gold"), "idol": P("253"), "vial": D("vial", A="red", B="wood", C="ice"),
    "trophy": D("skull", A="bone"), "bell": D("bell", A="gold", B="steel", C="wood"), "cloak": P("160"),
}
SLOTS = {"armor": P("016", "empty"), "offhand": P("256", "empty"), "amulet": P("208", "empty")}


def build(spec):
    if spec[0] == "drawn":
        return draw(spec[1], spec[2])
    im = Image.open(next((PACK / "icons").glob(f"{spec[1]}_*.png"))).convert("RGBA")
    return empty(im) if spec[2] == "empty" else recolor(im, spec[2]) if spec[2] else im


def main():
    if not PACK:
        print("gear icons: the pack (manifest.csv and icons/) not found, kept")
        return
    entries = {**PIECES, **{f"kind:{k}": v for k, v in KINDS.items()}, **{f"slot:{k}": v for k, v in SLOTS.items()}}
    cells, index, art = [], {}, {}
    for key, spec in entries.items():
        sig = repr(spec)
        if sig not in art:
            art[sig] = len(cells)
            cells.append(build(spec))
        index[key] = art[sig]
    cols = 16
    sheet = Image.new("RGBA", (cols * 16, -(-len(cells) // cols) * 16), (0, 0, 0, 0))
    for i, im in enumerate(cells):
        sheet.paste(im, ((i % cols) * 16, (i // cols) * 16))
    sheet.save(OUT / "gear.png")
    path = OUT / "manifest.json"
    manifest = json.load(open(path))
    manifest["gear"] = index
    manifest["gearSheet"] = "gear.png"
    json.dump(manifest, open(path, "w"), indent=1)
    print(f"gear icons: {len(PIECES)} pieces, {len(cells)} icons")
    # Every piece that isn't a weapon should be listed; two pieces of different kinds should never share an icon.
    if CONTENT.exists():
        pack = json.load(open(CONTENT))
        gear = pack["gear"] if isinstance(pack["gear"], list) else list(pack["gear"].values())
        missing = [g["id"] for g in gear if g["slot"] != "weapon" and g["id"] not in PIECES]
        if missing:
            print(f"gear icons: no icon of their own, so their kind's: {', '.join(missing)}")
        # A mythic with no kind (a slot alone) takes any kind's.
        kind_of = {g["id"]: g.get("armor") or g.get("offhand") or g["slot"] for g in gear}
        owner = {}
        for gid, spec in PIECES.items():
            k = kind_of.get(gid)
            if k in ("armor", "offhand"):
                continue
            if owner.setdefault(spec[1], k) != k:
                print(f"gear icons: {spec[1]} shows both {owner[spec[1]]} and {k} ({gid})")


main()
