/** Thousand Cuts: a dense, even stream of small hits from the first tick. Its three routes, each at three rungs (docs/gear-design/builds.md). */
import { g, p, route, v, vp, type Route } from "./kit.js";

export const routes: Route[] = [
  route("cuts", "bard-monk-assassin", "Daggers and fists: Double strike, Flow and the Bard's Haste.", {
    bard: ["allegro", "war_ballad", "thunder_chord"], monk: ["flow", "burning_fist", "pressure_point"], assassin: ["backstab", "vanish", "garrote"],
  }, [
    ["spur", [
      ["bard", "pacer", [], g("whipcrack_wand", "couriers_coat", "bulls_horn", "hares_foot")],
      ["monk", "blade_a", [], g("mantis_claws", "tumblers_vest", "quickening_chime", "wasp_charm")],
      ["assassin", "blade_b", [], g("weeping_kris", "mottled_hide", "hemlock_phial", "quicksilver")],
    ]],
    ["spur", [
      ["bard", "pacer", [v("allegro", "b"), v("war_ballad", "b")], g("whipcrack_wand", "couriers_coat", "bulls_horn", "echo_charm")],
      ["monk", "blade_a", [v("flow", "a"), v("iron_palm", "a")], g("mantis_claws", "duelists_leathers", "tempo_bell", "hummingbird_charm")],
      ["assassin", "blade_b", [], g("notched_knife", "mottled_hide", "venom_vial", "quicksilver")],
    ]],
    ["the_hurricane", [
      ["bard", "squall_a", [vp("allegro", "b"), vp("war_ballad", "b"), v("refrain", "b")], g("flicker_wand", "couriers_coat", "metronome", "echo_charm")],
      ["monk", "squall_b", [vp("flow", "a"), vp("iron_palm", "a"), v("burning_fist", "b")], g("flurry_wraps", "windrunners_garb", "tempo_bell", "hummingbird_charm")],
      ["assassin", "squall_c", [p("lacerate")], g("thousandth_cut", "mottled_hide", "venom_vial", "quicksilver")],
    ]],
  ]),
  route("cuts", "valkyrie-ranger-vampire", "The Valkyrie's three-hit spear, the Ranger's dagger and Bleed, the Vampire drinking from every claw.", {
    valkyrie: ["gale_spear", "rally", "valhalla"], ranger: ["barbed_arrow", "rending_arrow", "frost_arrow"], vampire: ["blood_drain", "frenzy", "blood_gift"],
  }, [
    ["spur", [
      ["valkyrie", "pacer", [], g("runed_saber", "tumblers_vest", "bronze_buckler", "wasp_charm")],
      ["ranger", "blade_a", [], g("weeping_kris", "mottled_hide", "hawthorn_fetish", "quicksilver")],
      ["vampire", "blade_b", [], g("brass_knuckles", "tithing_hauberk", "red_tincture", "hares_foot")],
    ]],
    ["spur", [
      ["valkyrie", "pacer", [v("gale_spear", "a"), v("rally", "a")], g("runed_saber", "duelists_leathers", "bronze_buckler", "wasp_charm")],
      ["ranger", "blade_a", [v("barbed_arrow", "a"), v("rending_arrow", "a")], g("notched_knife", "mottled_hide", "hawthorn_fetish", "hummingbird_charm")],
      ["vampire", "blade_b", [v("blood_drain", "a"), v("frenzy", "b")], g("gorged_claws", "tithing_hauberk", "venom_vial", "hares_foot")],
    ]],
    ["the_hurricane", [
      ["valkyrie", "squall_a", [vp("gale_spear", "a"), vp("rally", "a")], g("stormspear", "windrunners_garb", "bronze_buckler", "wasp_charm")],
      ["ranger", "squall_b", [vp("barbed_arrow", "a"), vp("rending_arrow", "a")], g("thousandth_cut", "mottled_hide", "hawthorn_fetish", "hummingbird_charm")],
      ["vampire", "squall_c", [vp("blood_drain", "a"), vp("frenzy", "b")], g("flurry_wraps", "tithing_hauberk", "venom_vial", "hares_foot")],
    ]],
  ]),
  route("cuts", "stormcaller-hexer-pyromancer", "The magical torrent: fast wands on the Stormcaller and the Pyromancer that slip past Armor, beside the Hexer on a dagger.", {
    stormcaller: ["static_charge", "chain_lightning", "thunderstorm"], hexer: ["malison", "enfeeble", "unmake"], pyromancer: ["firebolt", "fireball", "pyre"],
  }, [
    ["spur", [
      ["stormcaller", "pacer", [], g("whipcrack_wand", "magisters_robe", "quickening_chime", "hares_foot")],
      ["hexer", "blade_a", [], g("keen_dirk", "inscribed_hauberk", "night_mask", "wasp_charm")],
      ["pyromancer", "blade_b", [], g("glint_wand", "hermits_cowl", "brass_lantern", "quicksilver")],
    ]],
    ["spur", [
      ["stormcaller", "pacer", [v("arc", "b")], g("whipcrack_wand", "magisters_robe", "tempo_bell", "echo_charm")],
      ["hexer", "blade_a", [v("malison", "a"), v("enfeeble", "b")], g("notched_knife", "inscribed_hauberk", "night_mask", "hummingbird_charm")],
      ["pyromancer", "blade_b", [v("firebolt", "b"), v("fireball", "b")], g("chain_wand", "hermits_cowl", "brass_lantern", "quicksilver")],
    ]],
    ["the_hurricane", [
      ["stormcaller", "squall_a", [vp("arc", "b"), p("static_charge")], g("flicker_wand", "magisters_robe", "tempo_bell", "echo_charm")],
      ["hexer", "squall_b", [vp("malison", "a"), vp("enfeeble", "b")], g("thousandth_cut", "inscribed_hauberk", "night_mask", "hummingbird_charm")],
      ["pyromancer", "squall_c", [vp("firebolt", "b"), vp("fireball", "b")], g("chain_wand", "hermits_cowl", "brass_lantern", "quicksilver")],
    ]],
  ]),
];
