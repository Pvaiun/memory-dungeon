/** Landslide: a few huge blows at uneven moments; the stone holds until the blow comes round. Its three routes, each at three rungs (the twelve builds today's loot was made for). */
import { g, p, route, v, vp, type Route } from "./kit.js";

export const routes: Route[] = [
  route("landslide", "geomancer-knight-hoplite", "Earthen shell keeps the Geomancer's Bedrock lit behind the Knight's Vanguard and Taunt; Phalanx's double swings and the Geomancer's crits are the blows.", {
    knight: ["stand_fast", "fortify", "shield_bash"], hoplite: ["othismos", "spear_thrust", "aspis"], geomancer: ["earthen_shell", "rockfall", "tremor"],
  }, [
    ["heavy_line", [
      ["hoplite", "bruiser", [], g("roaring_greataxe", "keystone_cuirass", null, "whetstone")],
      ["knight", "holder", [], g("gilded_sword", "portcullis", "banner_kite", "carapace_charm")],
      ["geomancer", "free", [], g("war_hammer", "ironclad", "pavise", "ironstone")],
    ]],
    ["hammer_and_anvil", [
      ["knight", "anvil", [v("fortify", "a"), v("shield_bash", "b")], g("gilded_sword", "portcullis", "war_horn", "carapace_charm")],
      ["hoplite", "hammer", [v("phalanx", "b")], g("heartsplitter", "keystone_cuirass", null, "whetstone")],
      ["geomancer", "mason", [v("earthen_shell", "a"), v("rockfall", "a")], g("war_hammer", "bastion_plate", "giants_knucklebone", "ironstone")],
    ]],
    ["the_mountain", [
      ["knight", "peak", [vp("fortify", "a"), vp("shield_bash", "b"), v("vanguard", "a")], g("gilded_sword", "rubble_plate", "spiked_bulwark", "carapace_charm")],
      ["hoplite", "foothill_a", [vp("phalanx", "b")], g("cornerstone_maul", "keystone_cuirass", null, "whetstone")],
      ["geomancer", "foothill_b", [vp("earthen_shell", "a"), vp("rockfall", "a"), v("bedrock", "b"), v("tremor", "b")], g("war_hammer", "bastion_plate", "spiked_bulwark", "mountains_crown")],
    ]],
  ]),
  route("landslide", "geomancer-paladin-cleric", "The Geomancer swings a great weapon, Smite lands rarely and hard, and the Cleric keeps everyone up.", {
    geomancer: ["rockfall", "earthen_shell", "tremor"], paladin: ["smite", "absolve", "condemn"], cleric: ["cure", "renew", "raise"],
  }, [
    ["heavy_line", [
      ["geomancer", "bruiser", [], g("ironbound_maul", "keystone_cuirass", null, "carapace_charm")],
      ["paladin", "holder", [], g("morningstar", "ironclad", "pavise", "ironstone")],
      ["cleric", "free", [], g("canopy_staff", "glyphed_robe", null, "dewstone")],
    ]],
    ["hammer_and_anvil", [
      ["paladin", "anvil", [v("smite", "a")], g("morningstar", "ironclad", "rubble_shield", "millstone")],
      ["geomancer", "hammer", [v("bedrock", "b"), v("rockfall", "a")], g("heartsplitter", "bastion_plate", null, "carapace_charm")],
      ["cleric", "mason", [v("cure", "b")], g("canopy_staff", "glyphed_robe", null, "dewstone")],
    ]],
    ["the_mountain", [
      ["geomancer", "peak", [vp("bedrock", "b"), vp("rockfall", "a"), v("earthen_shell", "b"), v("tremor", "b")], g("cornerstone_maul", "rubble_plate", null, "mountains_crown")],
      ["paladin", "foothill_a", [vp("smite", "a")], g("morningstar", "ironclad", "rubble_shield", "millstone")],
      ["cleric", "foothill_b", [vp("cure", "b")], g("friars_mace", "glyphed_robe", "phylactery", "dewstone")],
    ]],
  ]),
  route("landslide", "knight-hoplite-bard", "No Earth at all: the weight is slow steel (a Knight with a great weapon, the Hoplite's Phalanx), and the Bard's Might sits on the slowest swings.", {
    knight: ["stand_fast", "shield_bash", "fortify"], hoplite: ["othismos", "spear_thrust", "aspis"], bard: ["war_ballad", "allegro", "encore"],
  }, [
    ["heavy_line", [
      ["knight", "bruiser", [], g("war_hammer", "bristled_plate", null, "whetstone")],
      ["hoplite", "holder", [], g("ironwood_spear", "ironclad", "bronze_buckler", "ironstone")],
      ["bard", "free", [], g("birch_wand", "wayfarers_habit", "temple_bell", "carapace_charm")],
    ]],
    ["hammer_and_anvil", [
      ["hoplite", "anvil", [v("phalanx", "b")], g("ironwood_spear", "ironclad", "bronze_buckler", "ironstone")],
      ["knight", "hammer", [v("shield_bash", "b"), v("fortify", "a")], g("rootstone_hammer", "bastion_plate", null, "whetstone")],
      ["bard", "mason", [v("refrain", "b")], g("birch_wand", "wayfarers_habit", "tempo_bell", "carapace_charm")],
    ]],
    ["the_mountain", [
      ["knight", "peak", [vp("shield_bash", "b"), vp("fortify", "a"), v("vanguard", "a")], g("mountainfall", "rubble_plate", null, "whetstone")],
      ["hoplite", "foothill_a", [vp("phalanx", "b")], g("pike_wall", "ironclad", "bronze_buckler", "ironstone")],
      ["bard", "foothill_b", [vp("refrain", "b"), p("war_ballad")], g("birch_wand", "wayfarers_habit", "tempo_bell", "carapace_charm")],
    ]],
  ]),
];
