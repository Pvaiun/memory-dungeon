/** The Hunt: a staircase, one kill every few ticks; the pack singles one out. Its three routes, each at three rungs (the twelve builds today's loot was made for). */
import { g, p, route, v, vp, type Route } from "./kit.js";

export const routes: Route[] = [
  route("hunt", "valkyrie-ranger-assassin", "Gale spear's Seek, Hunter's eye, Backstab on the weakest: three ways past the front.", {
    valkyrie: ["gale_spear", "choosing", "skyfall"], ranger: ["barbed_arrow", "rending_arrow", "frost_arrow"], assassin: ["backstab", "garrote", "vanish"],
  }, [
    ["arrowhead", [
      ["valkyrie", "point", [], g("partisan", "thick_byrnie", "linebreaker", "lodestone")],
      ["ranger", "flank_a", [], g("broadhead_bow", "spotters_coat", null, "whetstone")],
      ["assassin", "flank_b", [], g("misericorde", "footpads_jerkin", "hemlock_phial", "quicksilver")],
    ]],
    ["hunting_party", [
      ["ranger", "marker", [v("hunters_eye", "a"), v("rending_arrow", "b")], g("huntsmans_bow", "trackers_coat", null, "bounty_charm")],
      ["assassin", "chaser", [v("backstab", "a"), v("lacerate", "b")], g("notched_knife", "shadow_mantle", "venom_vial", "quicksilver")],
      ["valkyrie", "warden", [v("gale_spear", "b")], g("hunting_spear", "thick_byrnie", "hunters_buckler", "lodestone")],
    ]],
    ["the_pack", [
      ["ranger", "lead", [vp("hunters_eye", "a"), vp("rending_arrow", "b"), v("barbed_arrow", "a")], g("executioners_longbow", "huntmasters_quiver", null, "bounty_charm")],
      ["assassin", "packmate_a", [vp("backstab", "a"), vp("lacerate", "b"), v("garrote", "b")], g("headsmans_axe", "nights_edge", "venom_vial", "quicksilver")],
      ["valkyrie", "packmate_b", [vp("gale_spear", "b"), v("shieldmaiden", "b")], g("hunting_spear", "pack_leaders_coat", "hunters_buckler", "lodestone")],
    ]],
  ]),
  route("hunt", "assassin-monk-hoplite", "Pressure point's Seek and Backstab hunt while the Hoplite holds the front and Aspis covers the hunters.", {
    assassin: ["backstab", "garrote", "vanish"], monk: ["pressure_point", "burning_fist", "flow"], hoplite: ["aspis", "othismos", "spear_thrust"],
  }, [
    ["arrowhead", [
      ["hoplite", "point", [], g("ox_tongue_spear", "crested_plate", "linebreaker", "lodestone")],
      ["assassin", "flank_a", [], g("keen_dirk", "footpads_jerkin", "clotting_salve", "quicksilver")],
      ["monk", "flank_b", [], g("partisan", "warpaint_jerkin", "temple_bell", "whetstone")],
    ]],
    ["hunting_party", [
      ["assassin", "marker", [v("backstab", "a"), v("lacerate", "b")], g("marking_knife", "shadow_mantle", "venom_vial", "quicksilver")],
      ["monk", "chaser", [v("pressure_point", "b")], g("hunting_spear", "warpaint_jerkin", "temple_bell", "bounty_charm")],
      ["hoplite", "warden", [v("othismos", "b"), v("spear_thrust", "b")], g("ox_tongue_spear", "crested_plate", "hunters_buckler", "lodestone")],
    ]],
    ["the_pack", [
      ["assassin", "lead", [vp("backstab", "a"), vp("lacerate", "b"), v("garrote", "b")], g("headsmans_axe", "nights_edge", "venom_vial", "quicksilver")],
      ["monk", "packmate_a", [vp("pressure_point", "b")], g("hunting_spear", "pack_leaders_coat", "funeral_bell", "bounty_charm")],
      ["hoplite", "packmate_b", [vp("othismos", "b"), vp("spear_thrust", "b")], g("ox_tongue_spear", "crested_plate", "hunters_buckler", "lodestone")],
    ]],
  ]),
  route("hunt", "ranger-stormcaller-paladin", "The hunt by arrow and wind, and Smite on the most dangerous foe, which is the hunt's own target.", {
    ranger: ["barbed_arrow", "rending_arrow", "frost_arrow"], stormcaller: ["chain_lightning", "thunderstorm", "static_charge"], paladin: ["smite", "absolve", "condemn"],
  }, [
    ["arrowhead", [
      ["paladin", "point", [], g("priors_mace", "crested_plate", "banner_kite", "lodestone")],
      ["ranger", "flank_a", [], g("weeping_kris", "spotters_coat", "wolf_pelt", "whetstone")],
      ["stormcaller", "flank_b", [], g("mantis_claws", "magisters_robe", "prayer_bell", "moonstone")],
    ]],
    ["hunting_party", [
      ["ranger", "marker", [v("hunters_eye", "a"), v("rending_arrow", "b")], g("marking_knife", "trackers_coat", "wolf_pelt", "bounty_charm")],
      ["stormcaller", "chaser", [v("chain_lightning", "a"), v("arc", "b")], g("mantis_claws", "magisters_robe", "prayer_bell", "moonstone")],
      ["paladin", "warden", [v("judgement", "b")], g("priors_mace", "crested_plate", "humbling_shield", "lodestone")],
    ]],
    ["the_pack", [
      ["ranger", "lead", [vp("hunters_eye", "a"), vp("rending_arrow", "b"), v("barbed_arrow", "a")], g("marking_knife", "huntmasters_quiver", "the_kings_head", "bounty_charm")],
      ["stormcaller", "packmate_a", [vp("chain_lightning", "a"), vp("arc", "b")], g("mantis_claws", "magisters_robe", "funeral_bell", "moonstone")],
      ["paladin", "packmate_b", [vp("judgement", "b"), p("smite")], g("priors_mace", "crested_plate", "humbling_shield", "lodestone")],
    ]],
  ]),
];
