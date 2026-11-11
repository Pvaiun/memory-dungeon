/** Cold Snap: Chill climbs until it shatters, in bursts on a beat you can count. Its three routes, each at three rungs (the twelve builds today's loot was made for). */
import { g, p, route, v, vp, type Route } from "./kit.js";

export const routes: Route[] = [
  route("snap", "frostweaver-hexer-ranger", "Three Chill sources (Frost lance, Cold hex, Frost arrow), and the shatters come fast.", {
    frostweaver: ["frost_lance", "blizzard", "stillness"], hexer: ["malison", "enfeeble", "unmake"], ranger: ["frost_arrow", "barbed_arrow", "rending_arrow"],
  }, [
    ["heavy_line", [
      ["ranger", "bruiser", [], g("recurve_bow", "footpads_jerkin", null, "whetstone")],
      ["hexer", "holder", [], g("whipcrack_wand", "inscribed_hauberk", "night_mask", "wasp_charm")],
      ["frostweaver", "free", [], g("sleet_blade", "magisters_robe", "snowbound_folio", "moonstone")],
    ]],
    ["hoarfrost_line", [
      ["hexer", "frost_a", [v("cold_hex", "b")], g("whipcrack_wand", "inscribed_hauberk", "night_mask", "hummingbird_charm")],
      ["ranger", "frost_b", [v("frost_arrow", "b")], g("frostbite_bow", "footpads_jerkin", null, "whetstone")],
      ["frostweaver", "breaker", [v("frost_lance", "b"), v("blizzard", "b")], g("sleet_blade", "magisters_robe", "primer_of_frost", "opportunists_charm")],
    ]],
    ["hoarfrost_line", [
      ["hexer", "frost_a", [vp("cold_hex", "b")], g("the_witch_blade", "hexweave_mail", "night_mask", "hummingbird_charm")],
      ["ranger", "frost_b", [vp("frost_arrow", "b")], g("frostbite_bow", "frostwalkers_furs", null, "heart_of_winter")],
      ["frostweaver", "breaker", [vp("frost_lance", "b"), vp("blizzard", "b"), v("shatterpoint", "b")], g("winters_chain", "glaciers_heart", "primer_of_frost", "opportunists_charm")],
    ]],
  ]),
  route("snap", "monk-bard-frostweaver", "The director's run: the Frostweaver between a Monk and a Bard carrying Chill on their weapons.", {
    monk: ["burning_fist", "flow", "pressure_point"], bard: ["allegro", "war_ballad", "encore"], frostweaver: ["frost_lance", "blizzard", "stillness"],
  }, [
    ["heavy_line", [
      ["monk", "bruiser", [], g("wildcat_claws", "tumblers_vest", "temple_bell", "wasp_charm")],
      ["bard", "holder", [], g("whipcrack_wand", "footpads_jerkin", "snowbound_folio", "hares_foot")],
      ["frostweaver", "free", [], g("ashwood_staff", "magisters_robe", null, "moonstone")],
    ]],
    ["hoarfrost_line", [
      ["monk", "frost_a", [v("burning_fist", "a")], g("rime_knuckles", "tumblers_vest", "temple_bell", "hummingbird_charm")],
      ["bard", "frost_b", [], g("frostbite_bow", "footpads_jerkin", null, "hares_foot")],
      ["frostweaver", "breaker", [v("frost_lance", "b"), v("blizzard", "b")], g("banked_staff", "magisters_robe", null, "opportunists_charm")],
    ]],
    ["hoarfrost_line", [
      ["monk", "frost_a", [vp("burning_fist", "a"), p("iron_palm")], g("rime_knuckles", "frostwalkers_furs", "temple_bell", "hummingbird_charm")],
      ["bard", "frost_b", [p("allegro")], g("frostbite_bow", "footpads_jerkin", null, "heart_of_winter")],
      ["frostweaver", "breaker", [vp("frost_lance", "b"), vp("blizzard", "b"), v("shatterpoint", "b")], g("winters_chain", "glaciers_heart", "last_page", "opportunists_charm")],
    ]],
  ]),
  route("snap", "geomancer-monk-hexer", "No Frostweaver: Chill from the Hexer's and Monk's basic attacks, and the Geomancer's great weapon as the smash.", {
    geomancer: ["tremor", "rockfall", "earthen_shell"], monk: ["burning_fist", "flow", "pressure_point"], hexer: ["malison", "enfeeble", "unmake"],
  }, [
    ["heavy_line", [
      ["geomancer", "bruiser", [], g("bardiche", "ironclad", null, "whetstone")],
      ["monk", "holder", [], g("wildcat_claws", "tumblers_vest", "temple_bell", "wasp_charm")],
      ["hexer", "free", [], g("whipcrack_wand", "inscribed_hauberk", "night_mask", "moonstone")],
    ]],
    ["hoarfrost_line", [
      ["hexer", "frost_a", [v("cold_hex", "b")], g("whipcrack_wand", "inscribed_hauberk", "night_mask", "hummingbird_charm")],
      ["monk", "frost_b", [v("burning_fist", "a")], g("rime_knuckles", "tumblers_vest", "temple_bell", "wasp_charm")],
      ["geomancer", "breaker", [v("tremor", "b")], g("icebreaker", "hoarfrost_plate", null, "opportunists_charm")],
    ]],
    ["hoarfrost_line", [
      ["hexer", "frost_a", [vp("cold_hex", "b")], g("the_witch_blade", "hexweave_mail", "night_mask", "hummingbird_charm")],
      ["monk", "frost_b", [vp("burning_fist", "a"), p("iron_palm")], g("rime_knuckles", "frostwalkers_furs", "temple_bell", "heart_of_winter")],
      ["geomancer", "breaker", [vp("tremor", "b"), v("rockfall", "b")], g("icebreaker", "hoarfrost_plate", null, "opportunists_charm")],
    ]],
  ]),
];
