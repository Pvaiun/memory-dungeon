/** Phoenix: the party that wins by falling; each death is a turn in its favour. Its three routes, each at three rungs (docs/gear-design/builds.md). */
import { g, p, route, v, vp, type Route } from "./kit.js";

export const routes: Route[] = [
  route("phoenix", "assassin-cleric-valkyrie", "Two revives, and the Assassin falls first and comes back.", {
    assassin: ["backstab", "vanish", "garrote"], cleric: ["cure", "raise", "renew"], valkyrie: ["skyfall", "choosing", "gale_spear"],
  }, [
    ["vigil", [
      ["assassin", "martyr", [], g("cleaver", "footpads_jerkin", "hemlock_phial", "lodestone")],
      ["cleric", "mourner_a", [], g("friars_mace", "wayfarers_habit", "holy_water", "dewstone")],
      ["valkyrie", "mourner_b", [], g("arming_sword", "thick_byrnie", "feathered_cloak", "carapace_charm")],
    ]],
    ["pyre_of_heroes", [
      ["assassin", "martyr", [], g("cleaver", "footpads_jerkin", "hemlock_phial", "martyrs_locket")],
      ["cleric", "reviver", [v("last_rites", "b"), v("raise", "a")], g("friars_mace", "quiet_robes", "reliquary_of_mercy", "dewstone")],
      ["valkyrie", "survivor", [v("shieldmaiden", "a"), v("skyfall", "a")], g("arming_sword", "bloodsworn_mail", "feathered_cloak", "carapace_charm")],
    ]],
    ["the_undying", [
      ["assassin", "martyr", [p("backstab")], g("cleaver", "footpads_jerkin", "vial_of_the_last_breath", "martyrs_locket")],
      ["cleric", "spared_a", [vp("last_rites", "b"), vp("raise", "a"), v("cure", "a")], g("friars_mace", "vestments_of_return", "reliquary_of_mercy", "halo_of_the_saint")],
      ["valkyrie", "spared_b", [vp("shieldmaiden", "a"), vp("skyfall", "a"), v("choosing", "b")], g("gravemark", "mantle_of_the_fallen", "shield_of_the_chosen", "carapace_charm")],
    ]],
  ]),
  route("phoenix", "vampire-valkyrie-knight", "Bloodlust near the brink, Rally for the one who comes back low, and the Knight as the one who doesn't fall.", {
    vampire: ["blood_gift", "blood_drain", "frenzy"], valkyrie: ["skyfall", "choosing", "gale_spear"], knight: ["stand_fast", "fortify", "shield_bash"],
  }, [
    ["vigil", [
      ["vampire", "martyr", [], g("red_talons", "thick_byrnie", "carved_effigy", "urchin_shell")],
      ["valkyrie", "mourner_a", [], g("ironwood_spear", "inscribed_hauberk", "linden_shield", "dewstone")],
      ["knight", "mourner_b", [], g("gilded_sword", "crested_plate", "sheltering_kite", "carapace_charm")],
    ]],
    ["pyre_of_heroes", [
      ["vampire", "martyr", [v("bloodlust", "b"), v("blood_gift", "b")], g("red_talons", "mocking_mail", "carved_effigy", "martyrs_locket")],
      ["valkyrie", "reviver", [v("shieldmaiden", "a"), v("skyfall", "a")], g("ironwood_spear", "inscribed_hauberk", "hunters_buckler", "dewstone")],
      ["knight", "survivor", [], g("gilded_sword", "challengers_plate", "sheltering_kite", "carapace_charm")],
    ]],
    ["the_undying", [
      ["vampire", "martyr", [vp("bloodlust", "b"), vp("blood_gift", "b")], g("red_talons", "mocking_mail", "thralls_chalice", "phoenix_ember")],
      ["valkyrie", "spared_a", [vp("shieldmaiden", "a"), vp("skyfall", "a"), v("choosing", "b")], g("gravemark", "mantle_of_the_fallen", "hunters_buckler", "dewstone")],
      ["knight", "spared_b", [p("vanguard"), p("fortify")], g("gilded_sword", "last_bastion", "rallying_horn", "carapace_charm")],
    ]],
  ]),
  route("phoenix", "pyromancer-cleric-paladin", "Raise first in the Cleric's order brings the caster back; its first act after a return is a Fireball.", {
    pyromancer: ["fireball", "firebolt", "pyre"], cleric: ["raise", "cure", "renew"], paladin: ["absolve", "condemn", "smite"],
  }, [
    ["vigil", [
      ["pyromancer", "martyr", [], g("moonwater_staff", "wayfarers_habit", null, "lodestone")],
      ["cleric", "mourner_a", [], g("menders_mace", "wallflowers_robe", "shrine_token", "dewstone")],
      ["paladin", "mourner_b", [], g("friars_mace", "crested_plate", "sheltering_kite", "carapace_charm")],
    ]],
    ["pyre_of_heroes", [
      ["pyromancer", "martyr", [], g("moonwater_staff", "wayfarers_habit", null, "martyrs_locket")],
      ["cleric", "reviver", [v("last_rites", "b"), v("raise", "a")], g("menders_mace", "quiet_robes", "reliquary_of_mercy", "dewstone")],
      ["paladin", "survivor", [v("absolve", "b"), v("condemn", "a")], g("friars_mace", "challengers_plate", "sheltering_kite", "carapace_charm")],
    ]],
    ["the_undying", [
      ["pyromancer", "martyr", [p("fireball")], g("moonwater_staff", "wayfarers_habit", null, "phoenix_ember")],
      ["cleric", "spared_a", [vp("last_rites", "b"), vp("raise", "a"), v("cure", "a")], g("menders_mace", "vestments_of_return", "bones_of_the_returned", "halo_of_the_saint")],
      ["paladin", "spared_b", [vp("absolve", "b"), vp("condemn", "a")], g("martyrs_mace", "last_bastion", "bones_of_the_returned", "carapace_charm")],
    ]],
  ]),
];
