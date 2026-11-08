/** Blood Pact: life spent and bought back; HP bars see-saw, and HP pays where others pay MP. Its three routes, each at three rungs (docs/gear-design/builds.md). */
import { g, p, route, v, vp, type Route } from "./kit.js";

export const routes: Route[] = [
  route("pact", "vampire-monk-cleric", "The Vampire pays and drinks, the Monk drinks fast with Lifesteal on its claws, and Cure and Renew catch the drop.", {
    vampire: ["blood_drain", "frenzy", "blood_gift"], monk: ["burning_fist", "flow", "pressure_point"], cleric: ["cure", "renew", "raise"],
  }, [
    ["long_march", [
      ["vampire", "marcher_a", [], g("hand_axe", "lamprey_mail", null, "batwing_charm")],
      ["monk", "marcher_b", [], g("red_talons", "couriers_coat", "temple_bell", "quicksilver")],
      ["cleric", "marcher_c", [], g("menders_mace", "wayfarers_habit", "blessed_knot", "dewstone")],
    ]],
    ["blood_oath", [
      ["vampire", "bleeder", [v("bloodlust", "a"), v("frenzy", "a")], g("gorged_claws", "bloodsworn_mail", "blood_vial", "batwing_charm")],
      ["monk", "drinker", [v("iron_palm", "b")], g("red_talons", "couriers_coat", "temple_bell", "quicksilver")],
      ["cleric", "donor", [v("cure", "a"), v("last_rites", "a")], g("censer_mace", "wayfarers_habit", "saints_knucklebone", "dewstone")],
    ]],
    ["blood_oath", [
      ["vampire", "bleeder", [vp("bloodlust", "a"), vp("frenzy", "a"), v("blood_drain", "a")], g("gorged_claws", "sanguine_mail", "bloodlust_draught", "blood_covenant")],
      ["monk", "drinker", [vp("iron_palm", "b")], g("flurry_wraps", "couriers_coat", "temple_bell", "quicksilver")],
      ["cleric", "donor", [vp("cure", "a"), vp("last_rites", "a"), v("raise", "a")], g("martyrs_mace", "wayfarers_habit", "phylactery", "dewstone")],
    ]],
  ]),
  route("pact", "vampire-bramble-valkyrie", "High HP and Regrowth beside the Vampire, and Rally passing life to whoever paid most.", {
    vampire: ["blood_drain", "frenzy", "blood_gift"], bramble_knight: ["regrowth", "thicket", "bramble_lash"], valkyrie: ["choosing", "gale_spear", "skyfall"],
  }, [
    ["long_march", [
      ["vampire", "marcher_a", [], g("hand_axe", "thick_byrnie", null, "batwing_charm")],
      ["bramble_knight", "marcher_b", [], g("war_hammer", "tithing_hauberk", "bear_fetish", "red_ribbon")],
      ["valkyrie", "marcher_c", [], g("arming_sword", "lamprey_mail", "feathered_cloak", "dewstone")],
    ]],
    ["blood_oath", [
      ["vampire", "bleeder", [v("bloodlust", "b"), v("blood_drain", "a")], g("thirsting_axe", "bloodsworn_mail", null, "batwing_charm")],
      ["bramble_knight", "drinker", [v("briar", "a"), v("regrowth", "b")], g("penitents_mace", "tithing_hauberk", null, "red_ribbon")],
      ["valkyrie", "donor", [v("choosing", "b")], g("arming_sword", "lamprey_mail", "paired_shields", "dewstone")],
    ]],
    ["blood_oath", [
      ["vampire", "bleeder", [vp("bloodlust", "b"), vp("blood_drain", "a"), v("frenzy", "a")], g("thirsting_axe", "sanguine_mail", null, "blood_covenant")],
      ["bramble_knight", "drinker", [vp("briar", "a"), vp("regrowth", "b")], g("penitents_mace", "last_bastion", null, "red_ribbon")],
      ["valkyrie", "donor", [vp("choosing", "b")], g("arming_sword", "lamprey_mail", "swans_grace", "dewstone")],
    ]],
  ]),
  route("pact", "knight-monk-paladin", "No Vampire: the Knight's max HP, Absolve healing itself and another, and a Monk's fist that drinks.", {
    knight: ["shield_bash", "stand_fast", "fortify"], monk: ["burning_fist", "flow", "pressure_point"], paladin: ["absolve", "smite", "condemn"],
  }, [
    ["long_march", [
      ["knight", "marcher_a", [], g("war_hammer", "holdfast", null, "red_ribbon")],
      ["monk", "marcher_b", [], g("red_talons", "couriers_coat", "temple_bell", "batwing_charm")],
      ["paladin", "marcher_c", [], g("morningstar", "thick_byrnie", "sheltering_kite", "dewstone")],
    ]],
    ["blood_oath", [
      ["knight", "bleeder", [], g("rootstone_hammer", "holdfast", null, "red_ribbon")],
      ["monk", "drinker", [v("iron_palm", "b")], g("gorged_claws", "couriers_coat", "temple_bell", "batwing_charm")],
      ["paladin", "donor", [v("absolve", "a")], g("censer_mace", "bloodsworn_mail", "sheltering_kite", "dewstone")],
    ]],
    ["blood_oath", [
      ["knight", "bleeder", [p("shield_bash"), p("vanguard")], g("rootstone_hammer", "last_bastion", null, "blood_covenant")],
      ["monk", "drinker", [vp("iron_palm", "b")], g("gorged_claws", "couriers_coat", "temple_bell", "batwing_charm")],
      ["paladin", "donor", [vp("absolve", "a")], g("martyrs_mace", "sanguine_mail", "sheltering_kite", "dewstone")],
    ]],
  ]),
];
