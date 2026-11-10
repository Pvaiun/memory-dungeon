/** Bonfire: damage that rises the whole fight; each kill comes sooner than the last. Its three routes, each at three rungs (the twelve builds today's loot was made for). */
import { g, p, route, v, vp, type Route } from "./kit.js";

export const routes: Route[] = [
  route("bonfire", "knight-pyromancer-hexer", "Kindling and Firebolt keep the hottest foe burning, Malison lights the rest a little, and the Knight holds the early fight.", {
    knight: ["stand_fast", "fortify", "shield_bash"], pyromancer: ["firebolt", "fireball", "pyre"], hexer: ["malison", "enfeeble", "unmake"],
  }, [
    ["shieldwall", [
      ["knight", "wall", [], g("clarion_blade", "crested_plate", "gatekeepers_kite", "lodestone")],
      ["pyromancer", "behind_a", [], g("birch_wand", "magisters_robe", "pitch_lantern", "moonstone")],
      ["hexer", "behind_b", [], g("whipcrack_wand", "inscribed_hauberk", "night_mask", "hares_foot")],
    ]],
    ["hearth", [
      ["knight", "keeper", [v("fortify", "b")], g("clarion_blade", "bastion_plate", "gatekeepers_kite", "lodestone")],
      ["hexer", "stoker", [v("cold_hex", "a"), v("malison", "b")], g("whipcrack_wand", "inscribed_hauberk", "night_mask", "hummingbird_charm")],
      ["pyromancer", "torch", [v("firebolt", "a"), v("pyre", "b")], g("spark_wand", "kindled_robes", "bellows_lantern", "moonstone")],
    ]],
    ["the_forge", [
      ["knight", "forgehand_a", [vp("fortify", "b"), p("vanguard")], g("clarion_blade", "bastion_plate", "oathbound_shield", "lodestone")],
      ["hexer", "forgehand_b", [vp("cold_hex", "a"), vp("malison", "b")], g("wildmagic_wand", "hexweave_mail", "night_mask", "hummingbird_charm")],
      ["pyromancer", "forgehand_c", [vp("firebolt", "a"), vp("pyre", "b"), v("kindling", "b"), v("fireball", "a")], g("spark_wand", "kindled_robes", "wick", "crown_of_embers")],
    ]],
  ]),
  route("bonfire", "paladin-bard-monk", "No mage: Burning fist and Smite feed the fire, and the Bard's Haste and Might speed the stoking.", {
    paladin: ["smite", "condemn", "absolve"], bard: ["allegro", "war_ballad", "encore"], monk: ["burning_fist", "flow", "pressure_point"],
  }, [
    ["shieldwall", [
      ["paladin", "wall", [], g("priors_mace", "crested_plate", "gatekeepers_kite", "red_ribbon")],
      ["monk", "behind_a", [], g("wildcat_claws", "tumblers_vest", "temple_bell", "wasp_charm")],
      ["bard", "behind_b", [], g("birch_wand", "hermits_cowl", "abridged_lexicon", "hares_foot")],
    ]],
    ["hearth", [
      ["paladin", "keeper", [v("smite", "b"), v("condemn", "b")], g("priors_mace", "challengers_plate", "saints_knucklebone", "red_ribbon")],
      ["bard", "stoker", [], g("spark_wand", "hermits_cowl", "abridged_lexicon", "hares_foot")],
      ["monk", "torch", [v("burning_fist", "b")], g("wildcat_claws", "tumblers_vest", "temple_bell", "hummingbird_charm")],
    ]],
    ["the_forge", [
      ["paladin", "forgehand_a", [vp("smite", "b"), vp("condemn", "b"), v("judgement", "a")], g("sunhammer", "challengers_plate", "phylactery", "ember_heart")],
      ["bard", "forgehand_b", [p("allegro"), p("war_ballad")], g("spark_wand", "hermits_cowl", "abridged_lexicon", "hares_foot")],
      ["monk", "forgehand_c", [vp("burning_fist", "b"), p("flow")], g("ember_palms", "tumblers_vest", "temple_bell", "hummingbird_charm")],
    ]],
  ]),
  route("bonfire", "hoplite-pyromancer-cleric", "Fast Kindling on a wand; the Hoplite's Aspis and Paired guard hold the early fight, and the Cleric's Renew lifts the burns.", {
    hoplite: ["aspis", "othismos", "spear_thrust"], pyromancer: ["firebolt", "fireball", "pyre"], cleric: ["renew", "cure", "raise"],
  }, [
    ["shieldwall", [
      ["hoplite", "wall", [], g("ironwood_spear", "holdfast", "comrades_targe", "lodestone")],
      ["pyromancer", "behind_a", [], g("whipcrack_wand", "magisters_robe", "pitch_lantern", "hares_foot")],
      ["cleric", "behind_b", [], g("morningstar", "wayfarers_habit", "holy_water", "moonstone")],
    ]],
    ["hearth", [
      ["hoplite", "keeper", [v("aspis", "b"), v("othismos", "a")], g("ironwood_spear", "bastion_plate", "paired_shields", "lodestone")],
      ["pyromancer", "stoker", [v("kindling", "b"), v("firebolt", "a")], g("spark_wand", "kindled_robes", "bellows_lantern", "hummingbird_charm")],
      ["cleric", "torch", [], g("morningstar", "wayfarers_habit", "holy_water", "moonstone")],
    ]],
    ["the_forge", [
      ["hoplite", "forgehand_a", [vp("aspis", "b"), vp("othismos", "a")], g("ironwood_spear", "bastion_plate", "phalanx_shield", "lodestone")],
      ["pyromancer", "forgehand_b", [vp("kindling", "b"), vp("firebolt", "a"), v("pyre", "b")], g("spark_wand", "kindled_robes", "wick", "crown_of_embers")],
      ["cleric", "forgehand_c", [p("renew")], g("sunhammer", "wayfarers_habit", "holy_water", "moonstone")],
    ]],
  ]),
];
