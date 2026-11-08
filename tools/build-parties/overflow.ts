/** Overflow: casting that never stops, in waves passing round the party as the mana moves. Its three routes, each at three rungs (docs/gear-design/builds.md). */
import { g, route, v, vp, type Route } from "./kit.js";

export const routes: Route[] = [
  route("overflow", "bard-frostweaver-hexer", "Refrain and Stillness pass mana on, and the Hexer's Siphon feeds itself from foes, so what's given goes to the other two.", {
    bard: ["war_ballad", "allegro", "encore"], frostweaver: ["stillness", "frost_lance", "blizzard"], hexer: ["unmake", "malison", "enfeeble"],
  }, [
    ["wellspring", [
      ["bard", "source", [], g("birch_wand", "wayfarers_habit", "abridged_lexicon", "dewstone")],
      ["frostweaver", "spender_a", [], g("cairn_blade", "matins_robe", "hymnal", "hares_foot")],
      ["hexer", "spender_b", [], g("birch_wand", "inscribed_hauberk", "carrion_idol", "moonstone")],
    ]],
    ["relay", [
      ["bard", "well", [v("refrain", "a"), v("allegro", "a")], g("birch_wand", "weavers_robes", "warding_bell", "dewstone")],
      ["frostweaver", "spender_a", [v("stillness", "a")], g("cairn_blade", "quiet_robes", "hymnal", "hares_foot")],
      ["hexer", "spender_b", [v("unmake", "b")], g("chain_wand", "inscribed_hauberk", "leech_idol", "moonstone")],
    ]],
    ["the_choir", [
      ["bard", "first_voice", [vp("refrain", "a"), vp("allegro", "a")], g("birch_wand", "weavers_robes", "annotated_grimoire", "dewstone")],
      ["frostweaver", "second_voice", [vp("stillness", "a")], g("brimming_blade", "archmages_mantle", "hymnal", "hares_foot")],
      ["hexer", "third_voice", [vp("unmake", "b")], g("chain_wand", "inscribed_hauberk", "leech_idol", "moonstone")],
    ]],
  ]),
  route("overflow", "knight-pyromancer-cleric", "A wall's Clarity (Stand fast) feeding two hungry casters.", {
    knight: ["stand_fast", "fortify", "shield_bash"], pyromancer: ["fireball", "firebolt", "pyre"], cleric: ["renew", "cure", "raise"],
  }, [
    ["wellspring", [
      ["knight", "source", [], g("gilded_sword", "crested_plate", "reveille", "dewstone")],
      ["pyromancer", "spender_a", [], g("glint_wand", "hermits_cowl", "hooded_lantern", "hares_foot")],
      ["cleric", "spender_b", [], g("shepherds_staff", "wayfarers_habit", null, "moonstone")],
    ]],
    ["relay", [
      ["knight", "well", [v("stand_fast", "a"), v("fortify", "b")], g("gilded_sword", "crested_plate", "echo_horn", "dewstone")],
      ["pyromancer", "spender_a", [v("firebolt", "b"), v("fireball", "b")], g("glint_wand", "weavers_robes", "hooded_lantern", "hares_foot")],
      ["cleric", "spender_b", [v("renew", "a")], g("shepherds_staff", "quiet_robes", null, "moonstone")],
    ]],
    ["the_choir", [
      ["knight", "first_voice", [vp("stand_fast", "a"), vp("fortify", "b")], g("gilded_sword", "crested_plate", "horn_of_the_keep", "dewstone")],
      ["pyromancer", "second_voice", [vp("firebolt", "b"), vp("fireball", "b")], g("cataclysm_staff", "archmages_mantle", null, "hares_foot")],
      ["cleric", "third_voice", [vp("renew", "a")], g("friars_mace", "quiet_robes", "phylactery", "moonstone")],
    ]],
  ]),
  route("overflow", "vampire-stormcaller-bard", "Blood gift's Clarity, the Stormcaller's Static charge hastening its casts, and Chain lightning on a loop.", {
    vampire: ["blood_gift", "blood_drain", "frenzy"], stormcaller: ["static_charge", "chain_lightning", "thunderstorm"], bard: ["allegro", "war_ballad", "encore"],
  }, [
    ["wellspring", [
      ["vampire", "source", [], g("red_talons", "thick_byrnie", "night_mask", "dewstone")],
      ["stormcaller", "spender_a", [], g("sigil_blade", "glyphed_robe", "prayer_bell", "hares_foot")],
      ["bard", "spender_b", [], g("birch_wand", "wallflowers_robe", "abridged_lexicon", "moonstone")],
    ]],
    ["relay", [
      ["vampire", "well", [v("blood_gift", "a"), v("blood_drain", "b")], g("red_talons", "thick_byrnie", "leech_idol", "dewstone")],
      ["stormcaller", "spender_a", [v("chain_lightning", "b"), v("static_charge", "a")], g("sigil_blade", "weavers_robes", "prayer_bell", "hares_foot")],
      ["bard", "spender_b", [v("refrain", "a"), v("allegro", "a")], g("birch_wand", "quiet_robes", "warding_bell", "moonstone")],
    ]],
    ["the_choir", [
      ["vampire", "first_voice", [vp("blood_gift", "a"), vp("blood_drain", "b")], g("red_talons", "thick_byrnie", "leech_idol", "dewstone")],
      ["stormcaller", "second_voice", [vp("chain_lightning", "b"), vp("static_charge", "a")], g("brimming_blade", "archmages_mantle", "bell_of_the_hour", "hares_foot")],
      ["bard", "third_voice", [vp("refrain", "a"), vp("allegro", "a")], g("birch_wand", "quiet_robes", "annotated_grimoire", "moonstone")],
    ]],
  ]),
];
