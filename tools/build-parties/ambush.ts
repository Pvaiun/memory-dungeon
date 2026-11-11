/** Ambush: a spike at the first tick, then a thin tail. Its three routes, each at three rungs (the twelve builds today's loot was made for). */
import { g, p, route, v, vp, type Route } from "./kit.js";

export const routes: Route[] = [
  route("ambush", "assassin-ranger-geomancer", "A knife from hiding (Vanish first in the slots), a crit from behind stone, arrows past the front.", {
    assassin: ["vanish", "backstab", "garrote"], ranger: ["barbed_arrow", "rending_arrow", "frost_arrow"], geomancer: ["earthen_shell", "rockfall", "tremor"],
  }, [
    ["first_light", [
      ["assassin", "riser_a", [], g("misericorde", "footpads_jerkin", "hemlock_phial", "hares_foot")],
      ["ranger", "riser_b", [], g("recurve_bow", "spotters_coat", null, "whetstone")],
      ["geomancer", "riser_c", [], g("wardens_hammer", "ironclad", "pavise", "carapace_charm")],
    ]],
    ["knives_drawn", [
      ["assassin", "opener", [v("vanish", "b"), v("backstab", "b")], g("executioners_axe", "shadow_mantle", "hemlock_phial", "hares_foot")],
      ["ranger", "second", [], g("recurve_bow", "trackers_coat", null, "whetstone")],
      ["geomancer", "rear_guard", [], g("wardens_hammer", "ironclad", "giants_knucklebone", "carapace_charm")],
    ]],
    ["the_ambuscade", [
      ["assassin", "lurker_a", [vp("vanish", "b"), vp("backstab", "b"), v("lacerate", "a")], g("quietus", "shadow_mantle", "hemlock_phial", "ready_stance")],
      ["ranger", "lurker_b", [p("barbed_arrow")], g("volley_bow", "trackers_coat", null, "whetstone")],
      ["geomancer", "lurker_c", [p("earthen_shell")], g("wardens_hammer", "ironclad", "giants_knucklebone", "carapace_charm")],
    ]],
  ]),
  route("ambush", "monk-bard-bramble", "The Bard's Haste and Might land at the first tick, the Monk's quick hits spend the Might, and the Bramble knight takes the counter-rush.", {
    monk: ["burning_fist", "flow", "pressure_point"], bard: ["war_ballad", "allegro", "encore"], bramble_knight: ["thicket", "bramble_lash", "regrowth"],
  }, [
    ["first_light", [
      ["monk", "riser_a", [], g("wildcat_claws", "warpaint_jerkin", "temple_bell", "whetstone")],
      ["bard", "riser_b", [], g("birch_wand", "matins_robe", "quickening_chime", "hares_foot")],
      ["bramble_knight", "riser_c", [], g("masons_hammer", "holdfast", "bear_fetish", "carapace_charm")],
    ]],
    ["knives_drawn", [
      ["monk", "opener", [], g("wildcat_claws", "warpaint_jerkin", "temple_bell", "whetstone")],
      ["bard", "second", [v("war_ballad", "b")], g("birch_wand", "matins_robe", "tempo_bell", "hares_foot")],
      ["bramble_knight", "rear_guard", [], g("masons_hammer", "holdfast", "stone_totem", "carapace_charm")],
    ]],
    ["the_ambuscade", [
      ["monk", "lurker_a", [p("burning_fist")], g("wildcat_claws", "warpaint_jerkin", "temple_bell", "ready_stance")],
      ["bard", "lurker_b", [vp("war_ballad", "b")], g("birch_wand", "matins_robe", "bell_of_the_hour", "hares_foot")],
      ["bramble_knight", "lurker_c", [p("thicket")], g("masons_hammer", "holdfast", "stone_totem", "carapace_charm")],
    ]],
  ]),
  route("ambush", "assassin-cleric-valkyrie", "Gale spear and Backstab at the first tick, and Raise first in the Cleric's order for whoever falls in the scramble.", {
    assassin: ["vanish", "backstab", "garrote"], cleric: ["raise", "cure", "renew"], valkyrie: ["gale_spear", "choosing", "skyfall"],
  }, [
    ["first_light", [
      ["assassin", "riser_a", [], g("keen_dirk", "mottled_hide", "clotting_salve", "whetstone")],
      ["cleric", "riser_b", [], g("canopy_staff", "matins_robe", null, "hares_foot")],
      ["valkyrie", "riser_c", [], g("partisan", "thick_byrnie", "linebreaker", "carapace_charm")],
    ]],
    ["knives_drawn", [
      ["assassin", "opener", [v("vanish", "b"), v("backstab", "b")], g("executioners_axe", "shadow_mantle", "clotting_salve", "whetstone")],
      ["cleric", "second", [], g("canopy_staff", "matins_robe", null, "hares_foot")],
      ["valkyrie", "rear_guard", [v("skyfall", "b")], g("hunting_spear", "thick_byrnie", "linebreaker", "carapace_charm")],
    ]],
    ["the_ambuscade", [
      ["assassin", "lurker_a", [vp("vanish", "b"), vp("backstab", "b"), v("lacerate", "a")], g("quietus", "shadow_mantle", "clotting_salve", "ready_stance")],
      ["cleric", "lurker_b", [p("raise")], g("canopy_staff", "matins_robe", null, "hares_foot")],
      ["valkyrie", "lurker_c", [vp("skyfall", "b")], g("hunting_spear", "pack_leaders_coat", "linebreaker", "carapace_charm")],
    ]],
  ]),
];
