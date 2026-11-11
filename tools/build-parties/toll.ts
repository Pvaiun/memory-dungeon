/** The Toll: they hurt themselves; damage follows how much the foes attack, all the danger on one anchor. Its three routes, each at three rungs (the twelve builds today's loot was made for). */
import { g, p, route, v, vp, type Route } from "./kit.js";

export const routes: Route[] = [
  route("toll", "bramble-cleric-stormcaller", "Thicket draws, Briar bleeds, Cure keeps it up, and Arc's extra hits burst the Bleed.", {
    bramble_knight: ["thicket", "regrowth", "bramble_lash"], cleric: ["cure", "renew", "raise"], stormcaller: ["chain_lightning", "thunderstorm", "static_charge"],
  }, [
    ["shieldwall", [
      ["bramble_knight", "wall", [], g("wardens_hammer", "bristled_plate", "hawthorn_fetish", "lodestone")],
      ["cleric", "behind_a", [], g("menders_mace", "wayfarers_habit", "holy_water", "dewstone")],
      ["stormcaller", "behind_b", [], g("sleet_blade", "magisters_robe", "temple_bell", "moonstone")],
    ]],
    ["thorn_hedge", [
      ["bramble_knight", "anchor", [v("thicket", "a"), v("bramble_lash", "b")], g("wardens_hammer", "hoarfrost_plate", "briar_totem", "lodestone")],
      ["cleric", "thorns_a", [v("renew", "b"), v("last_rites", "a")], g("penitents_mace", "wayfarers_habit", "saints_knucklebone", "dewstone")],
      ["stormcaller", "thorns_b", [v("thunderstorm", "b")], g("conductors_blade", "magisters_robe", "temple_bell", "moonstone")],
    ]],
    ["the_mountain", [
      ["bramble_knight", "peak", [vp("thicket", "a"), vp("bramble_lash", "b"), v("briar", "a"), v("regrowth", "a")], g("grudgebearer", "heartwood_mail", "briar_totem", "lodestone")],
      ["cleric", "foothill_a", [vp("renew", "b"), vp("last_rites", "a"), v("raise", "b")], g("penitents_mace", "wayfarers_habit", "saints_knucklebone", "dewstone")],
      ["stormcaller", "foothill_b", [vp("thunderstorm", "b")], g("conductors_blade", "magisters_robe", "temple_bell", "moonstone")],
    ]],
  ]),
  route("toll", "knight-hexer-hoplite", "A Knight wearing thorns draws with Stand fast; Enfeeble and Malison make each attack cost; Paired guard and Aspis keep the Knight standing.", {
    knight: ["stand_fast", "fortify", "shield_bash"], hexer: ["enfeeble", "malison", "unmake"], hoplite: ["aspis", "othismos", "spear_thrust"],
  }, [
    ["shieldwall", [
      ["knight", "wall", [], g("vigilant_blade", "portcullis", "gatekeepers_kite", "urchin_shell")],
      ["hexer", "behind_a", [], g("jolt_wand", "silvered_hauberk", "carved_effigy", "ironstone")],
      ["hoplite", "behind_b", [], g("ironwood_spear", "holdfast", "comrades_targe", "red_ribbon")],
    ]],
    ["thorn_hedge", [
      ["knight", "anchor", [v("stand_fast", "b"), v("vanguard", "b")], g("vigilant_blade", "bastion_plate", "humbling_shield", "urchin_shell")],
      ["hexer", "thorns_a", [v("enfeeble", "a"), v("malison", "a")], g("drawn_steel", "silvered_hauberk", "withering_idol", "ironstone")],
      ["hoplite", "thorns_b", [v("aspis", "a")], g("ironwood_spear", "holdfast", "paired_shields", "red_ribbon")],
    ]],
    ["the_mountain", [
      ["knight", "peak", [vp("stand_fast", "b"), vp("vanguard", "b")], g("oathkeeper", "thornheart_plate", "spiked_bulwark", "urchin_shell")],
      ["hexer", "foothill_a", [vp("enfeeble", "a"), vp("malison", "a")], g("drawn_steel", "hexweave_mail", "idol_of_binding", "ironstone")],
      ["hoplite", "foothill_b", [vp("aspis", "a"), p("othismos")], g("pike_wall", "holdfast", "the_last_wall", "red_ribbon")],
    ]],
  ]),
  route("toll", "monk-bard-assassin", "The dancer: a Monk carrying a Taunt, Evasion high, dodges that strike back, Refrain mending the misses, and Backstab finishing the weakest.", {
    monk: ["flow", "burning_fist", "pressure_point"], bard: ["encore", "war_ballad", "allegro"], assassin: ["backstab", "vanish", "garrote"],
  }, [
    ["shieldwall", [
      ["monk", "wall", [], g("mantis_claws", "tumblers_vest", "quickening_chime", "red_ribbon")],
      ["bard", "behind_a", [], g("jolt_wand", "couriers_coat", "hymnal", "dewstone")],
      ["assassin", "behind_b", [], g("parrying_dagger", "mottled_hide", "crimson_dregs", "quicksilver")],
    ]],
    ["thorn_hedge", [
      ["monk", "anchor", [v("flow", "b")], g("mantis_claws", "duelists_leathers", "warding_bell", "red_ribbon")],
      ["bard", "thorns_a", [v("encore", "b")], g("jolt_wand", "couriers_coat", "hymnal", "dewstone")],
      ["assassin", "thorns_b", [v("vanish", "a")], g("parrying_dagger", "mottled_hide", "crimson_dregs", "quicksilver")],
    ]],
    ["the_mountain", [
      ["monk", "peak", [vp("flow", "b")], g("mantis_claws", "windrunners_garb", "warding_bell", "red_ribbon")],
      ["bard", "foothill_a", [vp("encore", "b"), p("refrain")], g("jolt_wand", "couriers_coat", "hymnal", "dewstone")],
      ["assassin", "foothill_b", [vp("vanish", "a"), p("backstab")], g("parrying_dagger", "mottled_hide", "crimson_dregs", "quicksilver")],
    ]],
  ]),
];
