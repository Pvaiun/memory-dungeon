/** Lockdown: hold them, then hit them; damage in windows while a foe is disabled. Its three routes, each at three rungs (docs/gear-design/builds.md). */
import { g, p, route, v, vp, type Route } from "./kit.js";

export const routes: Route[] = [
  route("lockdown", "monk-knight-hexer", "Shield bash, Unmake and Pressure point: three locks on three clocks.", {
    monk: ["pressure_point", "flow", "burning_fist"], knight: ["shield_bash", "stand_fast", "fortify"], hexer: ["unmake", "enfeeble", "malison"],
  }, [
    ["watchtower", [
      ["hexer", "lookout", [], g("wayfinder", "silvered_hauberk", "night_mask", "dewstone")],
      ["knight", "sentry_a", [], g("gilded_sword", "crested_plate", "banner_kite", "batwing_charm")],
      ["monk", "sentry_b", [], g("mantis_claws", "tumblers_vest", "waking_bell", "whetstone")],
    ]],
    ["gaol", [
      ["monk", "watcher", [v("pressure_point", "a")], g("mantis_claws", "tumblers_vest", "waking_bell", "whetstone")],
      ["knight", "gaoler", [v("shield_bash", "a"), v("vanguard", "b")], g("gilded_sword", "crested_plate", "rubble_shield", "opportunists_charm")],
      ["hexer", "turnkey", [v("unmake", "a"), v("enfeeble", "a")], g("bane_of_the_bound", "silvered_hauberk", "withering_idol", "dewstone")],
    ]],
    ["the_vise", [
      ["knight", "jaw_a", [vp("shield_bash", "a"), vp("vanguard", "b"), v("fortify", "b")], g("gilded_sword", "crested_plate", "rubble_shield", "opportunists_charm")],
      ["hexer", "screw", [vp("unmake", "a"), vp("enfeeble", "a"), v("malison", "b")], g("bane_of_the_bound", "hexweave_mail", "idol_of_binding", "dewstone")],
      ["monk", "jaw_b", [vp("pressure_point", "a")], g("still_hand", "tumblers_vest", "bell_of_the_hour", "whetstone")],
    ]],
  ]),
  route("lockdown", "assassin-geomancer-frostweaver", "Garrote's Silence past the front, Tremor's Stun, and Chill's slow and its Stun.", {
    assassin: ["garrote", "backstab", "vanish"], geomancer: ["tremor", "earthen_shell", "rockfall"], frostweaver: ["frost_lance", "stillness", "blizzard"],
  }, [
    ["watchtower", [
      ["assassin", "lookout", [], g("misericorde", "footpads_jerkin", "hemlock_phial", "dewstone")],
      ["geomancer", "sentry_a", [], g("cairn_blade", "ironclad", "standing_stone", "batwing_charm")],
      ["frostweaver", "sentry_b", [], g("sleet_rod", "hermits_cowl", "snowbound_folio", "moonstone")],
    ]],
    ["gaol", [
      ["assassin", "watcher", [], g("misericorde", "footpads_jerkin", "hemlock_phial", "opportunists_charm")],
      ["geomancer", "gaoler", [v("tremor", "a"), v("bedrock", "a")], g("icebreaker", "ironclad", null, "batwing_charm")],
      ["frostweaver", "turnkey", [v("shatterpoint", "a"), v("frost_lance", "a")], g("glacial_rod", "quiet_robes", "snowbound_folio", "moonstone")],
    ]],
    ["the_vise", [
      ["geomancer", "jaw_a", [vp("tremor", "a"), vp("bedrock", "a")], g("worldbreaker", "ironclad", null, "batwing_charm")],
      ["frostweaver", "screw", [vp("shatterpoint", "a"), vp("frost_lance", "a"), v("stillness", "b")], g("glacial_rod", "quiet_robes", "annotated_grimoire", "heart_of_winter")],
      ["assassin", "jaw_b", [v("garrote", "a")], g("misericorde", "footpads_jerkin", "hemlock_phial", "opportunists_charm")],
    ]],
  ]),
  route("lockdown", "paladin-cleric-hexer", "The patient version: few locks, timed to wait for a wind-up, Sanctuary's Ward on what slips through, and sustain for the leaks.", {
    paladin: ["smite", "sanctuary", "absolve"], cleric: ["cure", "renew", "raise"], hexer: ["unmake", "enfeeble", "malison"],
  }, [
    ["watchtower", [
      ["hexer", "lookout", [], g("misericorde", "inscribed_hauberk", "night_mask", "dewstone")],
      ["paladin", "sentry_a", [], g("morningstar", "silvered_hauberk", "dazzling_lantern", "batwing_charm")],
      ["cleric", "sentry_b", [], g("friars_mace", "wayfarers_habit", "waking_bell", "lodestone")],
    ]],
    ["gaol", [
      ["paladin", "watcher", [v("smite", "a"), v("judgement", "a")], g("humbling_mace", "silvered_hauberk", "dazzling_lantern", "opportunists_charm")],
      ["cleric", "gaoler", [], g("friars_mace", "quiet_robes", "waking_bell", "lodestone")],
      ["hexer", "turnkey", [v("unmake", "a"), v("enfeeble", "a")], g("bane_of_the_bound", "inscribed_hauberk", "withering_idol", "dewstone")],
    ]],
    ["the_vise", [
      ["paladin", "jaw_a", [vp("smite", "a"), vp("judgement", "a")], g("humbling_mace", "silvered_hauberk", "chains_of_light", "opportunists_charm")],
      ["hexer", "screw", [vp("unmake", "a"), vp("enfeeble", "a"), v("malison", "b")], g("bane_of_the_bound", "hexweave_mail", "idol_of_binding", "dewstone")],
      ["cleric", "jaw_b", [p("cure")], g("friars_mace", "quiet_robes", "bell_of_the_hour", "lodestone")],
    ]],
  ]),
];
