/** Harvest: nothing, nothing, everything; the whole field falls together. Its three routes, each at three rungs (docs/gear-design/builds.md). */
import { g, p, route, v, vp, type Route } from "./kit.js";

export const routes: Route[] = [
  route("harvest", "bramble-stormcaller-bard", "Arc and chains spread, Thunder chord reaches everything, and the Bramble knight draws the swarm onto its thorns.", {
    bramble_knight: ["thicket", "bramble_lash", "regrowth"], stormcaller: ["chain_lightning", "thunderstorm", "static_charge"], bard: ["encore", "war_ballad", "allegro"],
  }, [
    ["ring_of_steel", [
      ["bramble_knight", "beacon", [], g("wardens_hammer", "reprisal_hauberk", "spinebark_pole", "lodestone")],
      ["stormcaller", "reaper_a", [], g("sigil_blade", "magisters_robe", "prayer_bell", "moonstone")],
      ["bard", "reaper_b", [], g("jolt_wand", "wallflowers_robe", "abridged_lexicon", "batwing_charm")],
    ]],
    ["reaping_line", [
      ["bramble_knight", "beacon", [v("briar", "b"), v("bramble_lash", "a")], g("rootstone_hammer", "static_mail", "spinebark_pole", "lodestone")],
      ["stormcaller", "scythe_a", [v("arc", "a"), v("thunderstorm", "a")], g("conductors_blade", "magisters_robe", "prayer_bell", "moonstone")],
      ["bard", "scythe_b", [v("encore", "a")], g("chain_wand", "wallflowers_robe", "treatise_on_the_field", "batwing_charm")],
    ]],
    ["the_storm_front", [
      ["bramble_knight", "thunderhead_a", [vp("briar", "b"), vp("bramble_lash", "a"), v("regrowth", "b")], g("grudgebearer", "static_mail", "spinebark_pole", "lodestone")],
      ["stormcaller", "thunderhead_b", [vp("arc", "a"), vp("thunderstorm", "a")], g("eye_of_the_tempest", "stormweave", "prayer_bell", "moonstone")],
      ["bard", "thunderhead_c", [vp("encore", "a")], g("chain_wand", "wallflowers_robe", "last_page", "batwing_charm")],
    ]],
  ]),
  route("harvest", "paladin-pyromancer-frostweaver", "Two Area casters, with Sanctuary and Absolve holding the whole field's pressure.", {
    paladin: ["condemn", "absolve", "smite"], pyromancer: ["fireball", "pyre", "firebolt"], frostweaver: ["blizzard", "frost_lance", "stillness"],
  }, [
    ["ring_of_steel", [
      ["paladin", "beacon", [], g("priors_mace", "reprisal_hauberk", "gatekeepers_kite", "lodestone")],
      ["pyromancer", "reaper_a", [], g("ashwood_staff", "hermits_cowl", null, "moonstone")],
      ["frostweaver", "reaper_b", [], g("runed_saber", "glyphed_robe", "scholars_codex", "batwing_charm")],
    ]],
    ["reaping_line", [
      ["paladin", "beacon", [v("condemn", "a"), v("smite", "b")], g("priors_mace", "challengers_plate", "gatekeepers_kite", "lodestone")],
      ["pyromancer", "scythe_a", [v("kindling", "a"), v("pyre", "a")], g("banked_staff", "kindled_robes", null, "moonstone")],
      ["frostweaver", "scythe_b", [v("blizzard", "b"), v("shatterpoint", "b")], g("conductors_blade", "glyphed_robe", "treatise_on_the_field", "batwing_charm")],
    ]],
    ["the_storm_front", [
      ["paladin", "thunderhead_a", [vp("condemn", "a"), vp("smite", "b")], g("sunhammer", "challengers_plate", "gatekeepers_kite", "ember_heart")],
      ["pyromancer", "thunderhead_b", [vp("kindling", "a"), vp("pyre", "a"), v("fireball", "a")], g("cataclysm_staff", "stormweave", null, "moonstone")],
      ["frostweaver", "thunderhead_c", [vp("blizzard", "b"), vp("shatterpoint", "b")], g("conductors_blade", "archmages_mantle", "last_page", "batwing_charm")],
    ]],
  ]),
  route("harvest", "knight-valkyrie-hoplite", "The blades' harvest: a Knight and a Valkyrie on blades that sweep, and a Hoplite; it doesn't exist yet and is built from pieces.", {
    knight: ["stand_fast", "shield_bash", "fortify"], valkyrie: ["gale_spear", "choosing", "skyfall"], hoplite: ["spear_thrust", "aspis", "othismos"],
  }, [
    ["ring_of_steel", [
      ["knight", "beacon", [], g("clarion_blade", "crested_plate", "gatekeepers_kite", "lodestone")],
      ["valkyrie", "reaper_a", [], g("trophy_spear", "reprisal_hauberk", "bronze_buckler", "batwing_charm")],
      ["hoplite", "reaper_b", [], g("ironwood_spear", "ironclad", "linden_shield", "ironstone")],
    ]],
    ["reaping_line", [
      ["knight", "beacon", [], g("sweeping_blade", "challengers_plate", "gatekeepers_kite", "lodestone")],
      ["valkyrie", "scythe_a", [v("gale_spear", "a")], g("glaive", "reprisal_hauberk", "bronze_buckler", "batwing_charm")],
      ["hoplite", "scythe_b", [v("spear_thrust", "a"), v("aspis", "b")], g("ironwood_spear", "ironclad", "linden_shield", "ironstone")],
    ]],
    ["the_storm_front", [
      ["knight", "thunderhead_a", [p("vanguard")], g("oathkeeper", "challengers_plate", "gatekeepers_kite", "lodestone")],
      ["valkyrie", "thunderhead_b", [vp("gale_spear", "a"), v("shieldmaiden", "b")], g("storm_pike", "reprisal_hauberk", "bronze_buckler", "batwing_charm")],
      ["hoplite", "thunderhead_c", [vp("spear_thrust", "a"), vp("aspis", "b"), v("othismos", "a")], g("ironwood_spear", "ironclad", "phalanx_shield", "ironstone")],
    ]],
  ]),
];
