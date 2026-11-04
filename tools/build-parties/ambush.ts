/** Ambush: a spike at the first tick, then a thin tail. Its three routes, each at three rungs (docs/gear-design/builds.md). */
import { g, p, route, v, vp, type Route } from "./kit.js";

export const routes: Route[] = [
  route("ambush", "assassin-ranger-geomancer", "A knife from hiding (Vanish first in the slots), a crit from behind stone, arrows past the front.", {
    assassin: ["vanish", "backstab", "garrote"], ranger: ["barbed_arrow", "rending_arrow", "frost_arrow"], geomancer: ["earthen_shell", "rockfall", "tremor"],
  }, [
    ["first_light", [
      ["assassin", "riser_a", [], g("misericorde", "footpads_jerkin", "hemlock_phial", "hares_foot")],
      ["ranger", "riser_b", [], g("recurve_bow", "spotters_coat", null, "whetstone")],
      ["geomancer", "riser_c", [], g("wayfinder", "ironclad", "standing_stone", "carapace_charm")],
    ]],
    ["knives_drawn", [
      ["assassin", "opener", [v("vanish", "b"), v("backstab", "b")], g("drawn_steel", "shadow_cloak", "hemlock_phial", "hares_foot")],
      ["ranger", "second", [], g("recurve_bow", "trackers_coat", null, "whetstone")],
      ["geomancer", "rear_guard", [], g("wayfinder", "ironclad", "stone_totem", "carapace_charm")],
    ]],
    ["the_ambuscade", [
      ["assassin", "lurker_a", [vp("vanish", "b"), vp("backstab", "b"), v("lacerate", "a")], g("quietus", "shadow_cloak", "hemlock_phial", "ready_stance")],
      ["ranger", "lurker_b", [p("barbed_arrow")], g("volley_bow", "trackers_coat", null, "whetstone")],
      ["geomancer", "lurker_c", [p("earthen_shell")], g("wayfinder", "ironclad", "stone_totem", "carapace_charm")],
    ]],
  ]),
  route("ambush", "monk-bard-bramble", "The Bard's Haste and Might land at the first tick, the Monk's quick hits spend the Might, and the Bramble knight takes the counter-rush.", {
    monk: ["burning_fist", "flow", "pressure_point"], bard: ["war_ballad", "allegro", "thunder_chord"], bramble_knight: ["thicket", "bramble_lash", "regrowth"],
  }, [
    ["first_light", [
      ["monk", "riser_a", [], g("wildcat_claws", "warpaint_jerkin", "temple_bell", "whetstone")],
      ["bard", "riser_b", [], g("birch_wand", "matins_robe", "bulls_horn", "hares_foot")],
      ["bramble_knight", "riser_c", [], g("clarion_blade", "holdfast", "bear_fetish", "carapace_charm")],
    ]],
    ["knives_drawn", [
      ["monk", "opener", [], g("wildcat_claws", "warpaint_jerkin", "temple_bell", "whetstone")],
      ["bard", "second", [v("war_ballad", "b")], g("birch_wand", "matins_robe", "war_horn", "hares_foot")],
      ["bramble_knight", "rear_guard", [], g("clarion_blade", "holdfast", "stone_totem", "carapace_charm")],
    ]],
    ["the_ambuscade", [
      ["monk", "lurker_a", [p("burning_fist")], g("wildcat_claws", "warpaint_jerkin", "temple_bell", "ready_stance")],
      ["bard", "lurker_b", [vp("war_ballad", "b")], g("birch_wand", "matins_robe", "horn_of_the_charge", "hares_foot")],
      ["bramble_knight", "lurker_c", [p("thicket")], g("clarion_blade", "holdfast", "stone_totem", "carapace_charm")],
    ]],
  ]),
  route("ambush", "assassin-cleric-valkyrie", "Gale spear and Backstab at the first tick, and Raise first in the Cleric's order for whoever falls in the scramble.", {
    assassin: ["vanish", "backstab", "garrote"], cleric: ["raise", "cure", "renew"], valkyrie: ["gale_spear", "rally", "valhalla"],
  }, [
    ["first_light", [
      ["assassin", "riser_a", [], g("keen_dirk", "mottled_hide", "clotting_salve", "whetstone")],
      ["cleric", "riser_b", [], g("canopy_staff", "matins_robe", null, "hares_foot")],
      ["valkyrie", "riser_c", [], g("partisan", "thick_byrnie", "linebreaker", "carapace_charm")],
    ]],
    ["knives_drawn", [
      ["assassin", "opener", [v("vanish", "b"), v("backstab", "b")], g("drawn_steel", "shadow_cloak", "clotting_salve", "whetstone")],
      ["cleric", "second", [], g("canopy_staff", "matins_robe", null, "hares_foot")],
      ["valkyrie", "rear_guard", [v("valhalla", "b")], g("hunting_spear", "thick_byrnie", "linebreaker", "carapace_charm")],
    ]],
    ["the_ambuscade", [
      ["assassin", "lurker_a", [vp("vanish", "b"), vp("backstab", "b"), v("lacerate", "a")], g("quietus", "shadow_cloak", "clotting_salve", "ready_stance")],
      ["cleric", "lurker_b", [p("raise")], g("canopy_staff", "matins_robe", null, "hares_foot")],
      ["valkyrie", "lurker_c", [vp("valhalla", "b")], g("hunting_spear", "pack_leaders_coat", "linebreaker", "carapace_charm")],
    ]],
  ]),
];
