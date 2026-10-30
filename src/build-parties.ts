/**
 * Step 5i, step 5 (the build's test): the hand-built parties for every route of every one of the twelve builds, at each of its
 * three rungs, so the twelve can be played side by side on one set of the rogue's fights. Data only: no engine, no Node.
 *
 * Where it comes from (all under steps/05-core-set/5i-synergy/): each build's routes are the three `builds.md` names for it, read
 * through its "Gear" section (the elemental staves gone, the Hexer a spellblade, the Geomancer an earth fighter); the rungs are
 * `builds.md`'s "What it asks of a run" and `spine.md` section 9; each piece, formation, version and mythic is the fill's
 * (`fill/`, with `fill-rulings.md`), by the id the content shares derive from its name. `build/parties.md` says the rules and
 * what was thin. Nothing here is balanced: a route is what the documents name, not what wins.
 *
 * The rungs:
 * - **Rung 1, act I:** what most runs find. Commons and uncommons in the build's kinds, with their first-rung effects; a common
 *   formation; no trainings.
 * - **Rung 2, act II:** adds the build's rares and its rare formation, and versions toward the build on the abilities and
 *   passives that matter to it (no power steps).
 * - **Rung 3, act III:** its far end. Its legendaries, the mythic of each member whose class's mythic pulls first toward the
 *   build (at most two a party, one a unit), its legendary formation, and the power step on every version it took.
 * A later rung keeps whatever still serves the build; a slot that has nothing for it holds the plain-stat common that suits it.
 * Every member knows all three of its abilities at every rung, so the rungs differ only by what the build asks.
 *
 * Each rung also has a Neutral version (`neutralOf`): the same members and gear in the Neutral formation.
 */

export type BuildId = "landslide" | "cuts" | "bonfire" | "snap" | "hunt" | "harvest" | "ambush" | "overflow" | "lockdown" | "toll" | "pact" | "phoenix";
export type Rung = 1 | 2 | 3;
export type Act = "I" | "II" | "III";
export type Slot = "weapon" | "armor" | "offhand" | "amulet";

/** One training on an ability or a passive: its power step, its version (A or B), or both. */
export type Training = { ability: string; power: boolean; version?: "a" | "b" };
/** Gear by slot. No offhand under a two-hander (bow, great weapon, staff). */
export type Gear = { weapon: string; armor: string; offhand?: string; amulet: string };
export type Member = {
  cls: string;
  /** The formation seat it sits in, by the content's position id (the fill's seat name; twin seats `_a`, `_b`, `_c`). Neutral's are `a`, `b`, `c`. */
  seat: string;
  /** Its three abilities, in slot order: the first is cast first when several are ready. */
  abilities: [string, string, string];
  trained: Training[];
  gear: Gear;
};
export type Party = {
  /** `<build>/<route>/<rung>`, plus `/neutral` for the Neutral version. */
  id: string;
  build: BuildId;
  route: string;
  rung: Rung;
  /** The act whose fights this rung belongs in: later acts roll more rares and legendaries, and mythics come from act II and III bosses. */
  act: Act;
  version: "formation" | "neutral";
  formation: string;
  /** The three fighting units, in seat order (the formation's first seat first). */
  members: [Member, Member, Member];
};
export type Route = {
  build: BuildId;
  id: string;
  classes: [string, string, string];
  /** What it's built around, in the words of `builds.md`. */
  note: string;
  rungs: [Party, Party, Party];
};

export const BUILDS: Record<BuildId, string> = {
  landslide: "Landslide", cuts: "Thousand Cuts", bonfire: "Bonfire", snap: "Cold Snap", hunt: "The Hunt", harvest: "Harvest",
  ambush: "Ambush", overflow: "Overflow", lockdown: "Lockdown", toll: "The Toll", pact: "Blood Pact", phoenix: "Phoenix",
};

/** Each formation's seats in order, by the content's position ids (the fill's names, `fill/formations.md`; twin seats `_a`, `_b`, `_c`), and its rarity. */
export const FORMATION_SEATS: Record<string, { rarity: "common" | "rare" | "legendary"; seats: [string, string, string] }> = {
  neutral: { rarity: "common", seats: ["a", "b", "c"] },
  shieldwall: { rarity: "common", seats: ["wall", "behind_a", "behind_b"] },
  heavy_line: { rarity: "common", seats: ["bruiser", "holder", "free"] },
  skirmish_line: { rarity: "common", seats: ["skirmisher_a", "skirmisher_b", "skirmisher_c"] },
  spur: { rarity: "common", seats: ["pacer", "blade_a", "blade_b"] },
  wellspring: { rarity: "common", seats: ["source", "spender_a", "spender_b"] },
  long_march: { rarity: "common", seats: ["marcher_a", "marcher_b", "marcher_c"] },
  first_light: { rarity: "common", seats: ["riser_a", "riser_b", "riser_c"] },
  arrowhead: { rarity: "common", seats: ["point", "flank_a", "flank_b"] },
  ring_of_steel: { rarity: "common", seats: ["beacon", "reaper_a", "reaper_b"] },
  vigil: { rarity: "common", seats: ["martyr", "mourner_a", "mourner_b"] },
  watchtower: { rarity: "common", seats: ["lookout", "sentry_a", "sentry_b"] },
  hammer_and_anvil: { rarity: "rare", seats: ["anvil", "hammer", "mason"] },
  hunting_party: { rarity: "rare", seats: ["marker", "chaser", "warden"] },
  hearth: { rarity: "rare", seats: ["keeper", "stoker", "torch"] },
  hoarfrost_line: { rarity: "rare", seats: ["frost_a", "frost_b", "breaker"] },
  reaping_line: { rarity: "rare", seats: ["beacon", "scythe_a", "scythe_b"] },
  relay: { rarity: "rare", seats: ["well", "spender_a", "spender_b"] },
  gaol: { rarity: "rare", seats: ["watcher", "gaoler", "turnkey"] },
  thorn_hedge: { rarity: "rare", seats: ["anchor", "thorns_a", "thorns_b"] },
  blood_oath: { rarity: "rare", seats: ["bleeder", "drinker", "donor"] },
  pyre_of_heroes: { rarity: "rare", seats: ["martyr", "reviver", "survivor"] },
  knives_drawn: { rarity: "rare", seats: ["opener", "second", "rear_guard"] },
  the_wheel: { rarity: "rare", seats: ["wall", "blade", "well"] },
  the_pack: { rarity: "legendary", seats: ["lead", "packmate_a", "packmate_b"] },
  the_forge: { rarity: "legendary", seats: ["forgehand_a", "forgehand_b", "forgehand_c"] },
  the_ambuscade: { rarity: "legendary", seats: ["lurker_a", "lurker_b", "lurker_c"] },
  the_choir: { rarity: "legendary", seats: ["first_voice", "second_voice", "third_voice"] },
  the_undying: { rarity: "legendary", seats: ["martyr", "spared_a", "spared_b"] },
  the_hurricane: { rarity: "legendary", seats: ["squall_a", "squall_b", "squall_c"] },
  the_mountain: { rarity: "legendary", seats: ["peak", "foothill_a", "foothill_b"] },
  the_storm_front: { rarity: "legendary", seats: ["thunderhead_a", "thunderhead_b", "thunderhead_c"] },
  the_vise: { rarity: "legendary", seats: ["jaw_a", "screw", "jaw_b"] },
};

/** The 16 mythics (`spine.md` section 8, `fill/upgrades-1.md` and `-2.md`): the class each fits and the slot it sits in. */
export const MYTHICS: Record<string, { cls: string; slot: Slot }> = {
  horn_of_the_keep: { cls: "knight", slot: "offhand" },
  halo_of_the_saint: { cls: "cleric", slot: "amulet" },
  huntmasters_quiver: { cls: "ranger", slot: "armor" },
  heartwood_mail: { cls: "bramble_knight", slot: "armor" },
  the_last_wall: { cls: "hoplite", slot: "offhand" },
  chains_of_light: { cls: "paladin", slot: "offhand" },
  stormspear: { cls: "valkyrie", slot: "weapon" },
  metronome: { cls: "bard", slot: "offhand" },
  the_witch_blade: { cls: "hexer", slot: "weapon" },
  ember_palms: { cls: "monk", slot: "weapon" },
  nights_edge: { cls: "assassin", slot: "armor" },
  thralls_chalice: { cls: "vampire", slot: "offhand" },
  crown_of_embers: { cls: "pyromancer", slot: "amulet" },
  glaciers_heart: { cls: "frostweaver", slot: "armor" },
  eye_of_the_tempest: { cls: "stormcaller", slot: "weapon" },
  mountains_crown: { cls: "geomancer", slot: "amulet" },
};

// ─── Writing helpers (pure) ──────────────────────────────────────────────────

/** A version, without the power step. */
const v = (ability: string, version: "a" | "b"): Training => ({ ability, power: false, version });
/** A version with the power step. */
const vp = (ability: string, version: "a" | "b"): Training => ({ ability, power: true, version });
/** The power step alone. */
const p = (ability: string): Training => ({ ability, power: true });
/** Gear by slot; `null` for the offhand under a two-hander. */
const g = (weapon: string, armor: string, offhand: string | null, amulet: string): Gear => (offhand ? { weapon, armor, offhand, amulet } : { weapon, armor, amulet });

type Seated = [cls: string, seat: string, trained: Training[], gear: Gear];
type RungSpec = [formation: string, members: [Seated, Seated, Seated]];
const ACT: Record<Rung, Act> = { 1: "I", 2: "II", 3: "III" };

function route(build: BuildId, id: string, note: string, abilities: Record<string, [string, string, string]>, rungs: [RungSpec, RungSpec, RungSpec]): Route {
  const classes = Object.keys(abilities) as [string, string, string];
  const party = ([formation, seated]: RungSpec, i: number): Party => {
    const rung = (i + 1) as Rung;
    const members = seated.map(([cls, seat, trained, gear]) => ({ cls, seat, abilities: abilities[cls], trained, gear })) as [Member, Member, Member];
    return { id: `${build}/${id}/${rung}`, build, route: id, rung, act: ACT[rung], version: "formation", formation, members };
  };
  return { build, id, classes, note, rungs: rungs.map(party) as [Party, Party, Party] };
}

/** The same party in the Neutral formation: the same members, in the same order, with the same gear and trainings. */
export function neutralOf(party: Party): Party {
  return { ...party, id: `${party.id}/neutral`, version: "neutral", formation: "neutral", members: party.members.map((m, i) => ({ ...m, seat: FORMATION_SEATS.neutral.seats[i] })) as [Member, Member, Member] };
}

// ─── The routes ──────────────────────────────────────────────────────────────

export const ROUTES: Route[] = [
  // ── Landslide: a few huge blows at uneven moments; the stone holds until the blow comes round. ──
  route("landslide", "geomancer-knight-hoplite", "Earthen shell keeps the Geomancer's Bedrock lit behind the Knight's Vanguard and Taunt; Phalanx's double swings and the Geomancer's crits are the blows.", {
    knight: ["stand_fast", "fortify", "shield_bash"], hoplite: ["paired_guard", "spear_thrust", "aspis"], geomancer: ["earthen_shell", "rockfall", "tremor"],
  }, [
    ["heavy_line", [
      ["hoplite", "bruiser", [], g("roaring_axe", "keystone_cuirass", null, "whetstone")],
      ["knight", "holder", [], g("gilded_sword", "portcullis", "banner_kite", "carapace_charm")],
      ["geomancer", "free", [], g("cairn_blade", "ironclad", "standing_stone", "ironstone")],
    ]],
    ["hammer_and_anvil", [
      ["knight", "anvil", [v("fortify", "a"), v("shield_bash", "b")], g("gilded_sword", "portcullis", "war_horn", "carapace_charm")],
      ["hoplite", "hammer", [v("phalanx", "b")], g("heartsplitter", "keystone_cuirass", null, "whetstone")],
      ["geomancer", "mason", [v("earthen_shell", "a"), v("rockfall", "a")], g("cairn_blade", "bastion_plate", "stone_totem", "ironstone")],
    ]],
    ["the_mountain", [
      ["knight", "peak", [vp("fortify", "a"), vp("shield_bash", "b"), v("vanguard", "a")], g("gilded_sword", "rubble_plate", "spiked_bulwark", "carapace_charm")],
      ["hoplite", "foothill_a", [vp("phalanx", "b")], g("cornerstone_maul", "keystone_cuirass", null, "whetstone")],
      ["geomancer", "foothill_b", [vp("earthen_shell", "a"), vp("rockfall", "a"), v("bedrock", "b"), v("tremor", "b")], g("cairn_blade", "bastion_plate", "earthmother_totem", "mountains_crown")],
    ]],
  ]),
  route("landslide", "geomancer-paladin-cleric", "The Geomancer swings a great weapon, Smite lands rarely and hard, and the Cleric keeps everyone up.", {
    geomancer: ["rockfall", "earthen_shell", "tremor"], paladin: ["smite", "absolve", "sanctuary"], cleric: ["cure", "renew", "raise"],
  }, [
    ["heavy_line", [
      ["geomancer", "bruiser", [], g("ironbound_hammer", "keystone_cuirass", null, "carapace_charm")],
      ["paladin", "holder", [], g("cairn_blade", "ironclad", "pavise", "ironstone")],
      ["cleric", "free", [], g("canopy_staff", "glyphed_robe", null, "dewstone")],
    ]],
    ["hammer_and_anvil", [
      ["paladin", "anvil", [v("smite", "a")], g("cairn_blade", "ironclad", "rubble_shield", "millstone")],
      ["geomancer", "hammer", [v("bedrock", "b"), v("rockfall", "a")], g("heartsplitter", "bastion_plate", null, "carapace_charm")],
      ["cleric", "mason", [v("cure", "b")], g("canopy_staff", "glyphed_robe", null, "dewstone")],
    ]],
    ["the_mountain", [
      ["geomancer", "peak", [vp("bedrock", "b"), vp("rockfall", "a"), v("earthen_shell", "b"), v("tremor", "b")], g("cornerstone_maul", "rubble_plate", null, "mountains_crown")],
      ["paladin", "foothill_a", [vp("smite", "a")], g("cairn_blade", "ironclad", "rubble_shield", "millstone")],
      ["cleric", "foothill_b", [vp("cure", "b")], g("friars_mace", "glyphed_robe", "phylactery", "dewstone")],
    ]],
  ]),
  route("landslide", "knight-hoplite-bard", "No Earth at all: the weight is slow steel (a Knight with a great weapon, the Hoplite's Phalanx), and the Bard's Might sits on the slowest swings.", {
    knight: ["stand_fast", "shield_bash", "fortify"], hoplite: ["paired_guard", "spear_thrust", "aspis"], bard: ["war_ballad", "allegro", "thunder_chord"],
  }, [
    ["heavy_line", [
      ["knight", "bruiser", [], g("poleaxe", "bristled_plate", null, "whetstone")],
      ["hoplite", "holder", [], g("ironwood_spear", "ironclad", "bronze_buckler", "ironstone")],
      ["bard", "free", [], g("birch_wand", "wayfarers_habit", "rams_horn", "carapace_charm")],
    ]],
    ["hammer_and_anvil", [
      ["hoplite", "anvil", [v("phalanx", "b")], g("ironwood_spear", "ironclad", "bronze_buckler", "ironstone")],
      ["knight", "hammer", [v("shield_bash", "b"), v("fortify", "a")], g("heartsplitter", "bastion_plate", null, "whetstone")],
      ["bard", "mason", [v("refrain", "b")], g("birch_wand", "wayfarers_habit", "war_horn", "carapace_charm")],
    ]],
    ["the_mountain", [
      ["knight", "peak", [vp("shield_bash", "b"), vp("fortify", "a"), v("vanguard", "a")], g("worldbreaker", "rubble_plate", null, "whetstone")],
      ["hoplite", "foothill_a", [vp("phalanx", "b")], g("pike_wall", "ironclad", "bronze_buckler", "ironstone")],
      ["bard", "foothill_b", [vp("refrain", "b"), p("war_ballad")], g("birch_wand", "wayfarers_habit", "war_horn", "carapace_charm")],
    ]],
  ]),

  // ── Thousand Cuts: a dense, even stream of small hits from the first tick. ──
  route("cuts", "bard-monk-assassin", "Daggers and fists: Double strike, Flow and the Bard's Haste.", {
    bard: ["allegro", "war_ballad", "thunder_chord"], monk: ["flow", "burning_fist", "pressure_point"], assassin: ["backstab", "vanish", "garrote"],
  }, [
    ["spur", [
      ["bard", "pacer", [], g("whipcrack_wand", "couriers_coat", "bulls_horn", "hares_foot")],
      ["monk", "blade_a", [], g("mantis_claws", "tumblers_vest", "quickening_chime", "wasp_charm")],
      ["assassin", "blade_b", [], g("weeping_kris", "mottled_hide", "hemlock_phial", "quicksilver")],
    ]],
    ["spur", [
      ["bard", "pacer", [v("allegro", "b"), v("war_ballad", "b")], g("whipcrack_wand", "couriers_coat", "bulls_horn", "echo_charm")],
      ["monk", "blade_a", [v("flow", "a"), v("iron_palm", "a")], g("mantis_claws", "duelists_leathers", "tempo_bell", "hummingbird_charm")],
      ["assassin", "blade_b", [], g("notched_knife", "mottled_hide", "venom_vial", "quicksilver")],
    ]],
    ["the_hurricane", [
      ["bard", "squall_a", [vp("allegro", "b"), vp("war_ballad", "b"), v("refrain", "b")], g("flicker_wand", "couriers_coat", "metronome", "echo_charm")],
      ["monk", "squall_b", [vp("flow", "a"), vp("iron_palm", "a"), v("burning_fist", "b")], g("flurry_wraps", "windrunners_garb", "tempo_bell", "hummingbird_charm")],
      ["assassin", "squall_c", [p("lacerate")], g("thousandth_cut", "mottled_hide", "venom_vial", "quicksilver")],
    ]],
  ]),
  route("cuts", "valkyrie-ranger-vampire", "The Valkyrie's three-hit spear, the Ranger's dagger and Bleed, the Vampire drinking from every claw.", {
    valkyrie: ["gale_spear", "rally", "valhalla"], ranger: ["barbed_arrow", "rending_arrow", "frost_arrow"], vampire: ["blood_drain", "frenzy", "blood_gift"],
  }, [
    ["spur", [
      ["valkyrie", "pacer", [], g("runed_saber", "tumblers_vest", "bronze_buckler", "wasp_charm")],
      ["ranger", "blade_a", [], g("weeping_kris", "mottled_hide", "hawthorn_fetish", "quicksilver")],
      ["vampire", "blade_b", [], g("brass_knuckles", "tithing_hauberk", "red_tincture", "hares_foot")],
    ]],
    ["spur", [
      ["valkyrie", "pacer", [v("gale_spear", "a"), v("rally", "a")], g("runed_saber", "duelists_leathers", "bronze_buckler", "wasp_charm")],
      ["ranger", "blade_a", [v("barbed_arrow", "a"), v("rending_arrow", "a")], g("notched_knife", "mottled_hide", "hawthorn_fetish", "hummingbird_charm")],
      ["vampire", "blade_b", [v("blood_drain", "a"), v("frenzy", "b")], g("gorged_claws", "tithing_hauberk", "venom_vial", "hares_foot")],
    ]],
    ["the_hurricane", [
      ["valkyrie", "squall_a", [vp("gale_spear", "a"), vp("rally", "a")], g("stormspear", "windrunners_garb", "bronze_buckler", "wasp_charm")],
      ["ranger", "squall_b", [vp("barbed_arrow", "a"), vp("rending_arrow", "a")], g("thousandth_cut", "mottled_hide", "hawthorn_fetish", "hummingbird_charm")],
      ["vampire", "squall_c", [vp("blood_drain", "a"), vp("frenzy", "b")], g("flurry_wraps", "tithing_hauberk", "venom_vial", "hares_foot")],
    ]],
  ]),
  route("cuts", "stormcaller-hexer-pyromancer", "The magical torrent: fast wands on the Stormcaller and the Pyromancer that slip past Armor, beside the Hexer on a dagger.", {
    stormcaller: ["static_charge", "chain_lightning", "thunderstorm"], hexer: ["malison", "enfeeble", "unmake"], pyromancer: ["firebolt", "fireball", "pyre"],
  }, [
    ["spur", [
      ["stormcaller", "pacer", [], g("whipcrack_wand", "magisters_robe", "quickening_chime", "hares_foot")],
      ["hexer", "blade_a", [], g("keen_dirk", "inscribed_hauberk", "night_mask", "wasp_charm")],
      ["pyromancer", "blade_b", [], g("glint_wand", "hermits_cowl", "brass_lantern", "quicksilver")],
    ]],
    ["spur", [
      ["stormcaller", "pacer", [v("arc", "b")], g("whipcrack_wand", "magisters_robe", "tempo_bell", "echo_charm")],
      ["hexer", "blade_a", [v("malison", "a"), v("enfeeble", "b")], g("notched_knife", "inscribed_hauberk", "night_mask", "hummingbird_charm")],
      ["pyromancer", "blade_b", [v("firebolt", "b"), v("fireball", "b")], g("chain_wand", "hermits_cowl", "brass_lantern", "quicksilver")],
    ]],
    ["the_hurricane", [
      ["stormcaller", "squall_a", [vp("arc", "b"), p("static_charge")], g("flicker_wand", "magisters_robe", "tempo_bell", "echo_charm")],
      ["hexer", "squall_b", [vp("malison", "a"), vp("enfeeble", "b")], g("thousandth_cut", "inscribed_hauberk", "night_mask", "hummingbird_charm")],
      ["pyromancer", "squall_c", [vp("firebolt", "b"), vp("fireball", "b")], g("chain_wand", "hermits_cowl", "brass_lantern", "quicksilver")],
    ]],
  ]),

  // ── Bonfire: damage that rises the whole fight; each kill comes sooner than the last. ──
  route("bonfire", "knight-pyromancer-hexer", "Kindling and Firebolt keep the hottest foe burning, Malison lights the rest a little, and the Knight holds the early fight.", {
    knight: ["stand_fast", "fortify", "shield_bash"], pyromancer: ["firebolt", "fireball", "pyre"], hexer: ["malison", "enfeeble", "unmake"],
  }, [
    ["shieldwall", [
      ["knight", "wall", [], g("clarion_blade", "crested_plate", "gatekeepers_kite", "lodestone")],
      ["pyromancer", "behind_a", [], g("birch_wand", "magisters_robe", "pitch_lantern", "moonstone")],
      ["hexer", "behind_b", [], g("keen_dirk", "inscribed_hauberk", "night_mask", "hares_foot")],
    ]],
    ["hearth", [
      ["knight", "keeper", [v("fortify", "b")], g("clarion_blade", "bastion_plate", "gatekeepers_kite", "lodestone")],
      ["hexer", "stoker", [v("cold_hex", "a"), v("malison", "b")], g("keen_dirk", "inscribed_hauberk", "night_mask", "hummingbird_charm")],
      ["pyromancer", "torch", [v("firebolt", "a"), v("pyre", "b")], g("spark_wand", "kindled_robes", "bellows_lantern", "moonstone")],
    ]],
    ["the_forge", [
      ["knight", "forgehand_a", [vp("fortify", "b"), p("vanguard")], g("clarion_blade", "bastion_plate", "oathbound_shield", "lodestone")],
      ["hexer", "forgehand_b", [vp("cold_hex", "a"), vp("malison", "b")], g("hexblade", "hexweave_mail", "night_mask", "hummingbird_charm")],
      ["pyromancer", "forgehand_c", [vp("firebolt", "a"), vp("pyre", "b"), v("kindling", "b"), v("fireball", "a")], g("spark_wand", "kindled_robes", "wick", "crown_of_embers")],
    ]],
  ]),
  route("bonfire", "paladin-bard-monk", "No mage: Burning fist and Smite feed the fire, and the Bard's Haste and Might speed the stoking.", {
    paladin: ["smite", "sanctuary", "absolve"], bard: ["allegro", "war_ballad", "thunder_chord"], monk: ["burning_fist", "flow", "pressure_point"],
  }, [
    ["shieldwall", [
      ["paladin", "wall", [], g("priors_mace", "crested_plate", "pitch_lantern", "red_ribbon")],
      ["monk", "behind_a", [], g("wildcat_claws", "tumblers_vest", "temple_bell", "wasp_charm")],
      ["bard", "behind_b", [], g("birch_wand", "hermits_cowl", "reveille", "hares_foot")],
    ]],
    ["hearth", [
      ["paladin", "keeper", [v("smite", "b"), v("sanctuary", "b")], g("priors_mace", "challengers_plate", "bellows_lantern", "red_ribbon")],
      ["bard", "stoker", [], g("spark_wand", "hermits_cowl", "reveille", "hares_foot")],
      ["monk", "torch", [v("burning_fist", "b")], g("wildcat_claws", "tumblers_vest", "temple_bell", "hummingbird_charm")],
    ]],
    ["the_forge", [
      ["paladin", "forgehand_a", [vp("smite", "b"), vp("sanctuary", "b"), v("judgement", "a")], g("sunhammer", "challengers_plate", "wick", "ember_heart")],
      ["bard", "forgehand_b", [p("allegro"), p("war_ballad")], g("spark_wand", "hermits_cowl", "reveille", "hares_foot")],
      ["monk", "forgehand_c", [vp("burning_fist", "b"), p("flow")], g("ember_palms", "tumblers_vest", "temple_bell", "hummingbird_charm")],
    ]],
  ]),
  route("bonfire", "hoplite-pyromancer-cleric", "Fast Kindling on a wand; the Hoplite's Aspis and Paired guard hold the early fight, and the Cleric's Renew lifts the burns.", {
    hoplite: ["aspis", "paired_guard", "spear_thrust"], pyromancer: ["firebolt", "fireball", "pyre"], cleric: ["renew", "cure", "raise"],
  }, [
    ["shieldwall", [
      ["hoplite", "wall", [], g("ironwood_spear", "holdfast", "comrades_targe", "lodestone")],
      ["pyromancer", "behind_a", [], g("whipcrack_wand", "magisters_robe", "pitch_lantern", "hares_foot")],
      ["cleric", "behind_b", [], g("morningstar", "wayfarers_habit", "holy_water", "moonstone")],
    ]],
    ["hearth", [
      ["hoplite", "keeper", [v("aspis", "b"), v("paired_guard", "a")], g("ironwood_spear", "bastion_plate", "paired_shields", "lodestone")],
      ["pyromancer", "stoker", [v("kindling", "b"), v("firebolt", "a")], g("spark_wand", "kindled_robes", "bellows_lantern", "hummingbird_charm")],
      ["cleric", "torch", [], g("morningstar", "wayfarers_habit", "holy_water", "moonstone")],
    ]],
    ["the_forge", [
      ["hoplite", "forgehand_a", [vp("aspis", "b"), vp("paired_guard", "a")], g("ironwood_spear", "bastion_plate", "phalanx_shield", "lodestone")],
      ["pyromancer", "forgehand_b", [vp("kindling", "b"), vp("firebolt", "a"), v("pyre", "b")], g("spark_wand", "kindled_robes", "wick", "crown_of_embers")],
      ["cleric", "forgehand_c", [p("renew")], g("sunhammer", "wayfarers_habit", "holy_water", "moonstone")],
    ]],
  ]),

  // ── Cold Snap: Chill climbs until it shatters, in bursts on a beat you can count. ──
  route("snap", "frostweaver-hexer-ranger", "Three Chill sources (Frost lance, Cold hex, Frost arrow), and the shatters come fast.", {
    frostweaver: ["frost_lance", "blizzard", "stillness"], hexer: ["malison", "enfeeble", "unmake"], ranger: ["frost_arrow", "barbed_arrow", "rending_arrow"],
  }, [
    ["heavy_line", [
      ["ranger", "bruiser", [], g("recurve_bow", "footpads_jerkin", null, "whetstone")],
      ["hexer", "holder", [], g("keen_dirk", "inscribed_hauberk", "night_mask", "wasp_charm")],
      ["frostweaver", "free", [], g("sleet_rod", "magisters_robe", "snowbound_folio", "moonstone")],
    ]],
    ["hoarfrost_line", [
      ["hexer", "frost_a", [v("cold_hex", "b")], g("keen_dirk", "inscribed_hauberk", "night_mask", "hummingbird_charm")],
      ["ranger", "frost_b", [v("frost_arrow", "b")], g("frostbite_bow", "footpads_jerkin", null, "whetstone")],
      ["frostweaver", "breaker", [v("frost_lance", "b"), v("blizzard", "b")], g("sleet_rod", "magisters_robe", "primer_of_frost", "opportunists_charm")],
    ]],
    ["hoarfrost_line", [
      ["hexer", "frost_a", [vp("cold_hex", "b")], g("the_witch_blade", "hexweave_mail", "night_mask", "hummingbird_charm")],
      ["ranger", "frost_b", [vp("frost_arrow", "b")], g("frostbite_bow", "frostwalkers_furs", null, "heart_of_winter")],
      ["frostweaver", "breaker", [vp("frost_lance", "b"), vp("blizzard", "b"), v("shatterpoint", "b")], g("winters_chain", "glaciers_heart", "primer_of_frost", "opportunists_charm")],
    ]],
  ]),
  route("snap", "monk-bard-frostweaver", "The director's run: the Frostweaver between a Monk and a Bard carrying Chill on their weapons.", {
    monk: ["burning_fist", "flow", "pressure_point"], bard: ["allegro", "war_ballad", "thunder_chord"], frostweaver: ["frost_lance", "blizzard", "stillness"],
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
      ["geomancer", "bruiser", [], g("bearded_axe", "ironclad", null, "whetstone")],
      ["monk", "holder", [], g("wildcat_claws", "tumblers_vest", "temple_bell", "wasp_charm")],
      ["hexer", "free", [], g("keen_dirk", "inscribed_hauberk", "night_mask", "moonstone")],
    ]],
    ["hoarfrost_line", [
      ["hexer", "frost_a", [v("cold_hex", "b")], g("keen_dirk", "inscribed_hauberk", "night_mask", "hummingbird_charm")],
      ["monk", "frost_b", [v("burning_fist", "a")], g("rime_knuckles", "tumblers_vest", "temple_bell", "wasp_charm")],
      ["geomancer", "breaker", [v("tremor", "b")], g("icebreaker", "hoarfrost_plate", null, "opportunists_charm")],
    ]],
    ["hoarfrost_line", [
      ["hexer", "frost_a", [vp("cold_hex", "b")], g("the_witch_blade", "hexweave_mail", "night_mask", "hummingbird_charm")],
      ["monk", "frost_b", [vp("burning_fist", "a"), p("iron_palm")], g("rime_knuckles", "frostwalkers_furs", "temple_bell", "heart_of_winter")],
      ["geomancer", "breaker", [vp("tremor", "b"), v("rockfall", "b")], g("icebreaker", "hoarfrost_plate", null, "opportunists_charm")],
    ]],
  ]),

  // ── The Hunt: a staircase, one kill every few ticks; the pack singles one out. ──
  route("hunt", "valkyrie-ranger-assassin", "Gale spear's Seek, Hunter's eye, Backstab on the weakest: three ways past the front.", {
    valkyrie: ["gale_spear", "rally", "valhalla"], ranger: ["barbed_arrow", "rending_arrow", "frost_arrow"], assassin: ["backstab", "garrote", "vanish"],
  }, [
    ["arrowhead", [
      ["valkyrie", "point", [], g("partisan", "thick_byrnie", "linebreaker", "lodestone")],
      ["ranger", "flank_a", [], g("broadhead_bow", "spotters_coat", null, "whetstone")],
      ["assassin", "flank_b", [], g("misericorde", "footpads_jerkin", "hemlock_phial", "quicksilver")],
    ]],
    ["hunting_party", [
      ["ranger", "marker", [v("hunters_eye", "a"), v("rending_arrow", "b")], g("huntsmans_bow", "trackers_coat", null, "bounty_charm")],
      ["assassin", "chaser", [v("backstab", "a"), v("lacerate", "b")], g("notched_knife", "shadow_cloak", "venom_vial", "quicksilver")],
      ["valkyrie", "warden", [v("gale_spear", "b")], g("hunting_spear", "thick_byrnie", "hunters_buckler", "lodestone")],
    ]],
    ["the_pack", [
      ["ranger", "lead", [vp("hunters_eye", "a"), vp("rending_arrow", "b"), v("barbed_arrow", "a")], g("executioners_longbow", "huntmasters_quiver", null, "bounty_charm")],
      ["assassin", "packmate_a", [vp("backstab", "a"), vp("lacerate", "b"), v("garrote", "b")], g("gravemark", "nights_edge", "venom_vial", "quicksilver")],
      ["valkyrie", "packmate_b", [vp("gale_spear", "b"), v("einherjar", "b")], g("hunting_spear", "pack_leaders_coat", "hunters_buckler", "lodestone")],
    ]],
  ]),
  route("hunt", "assassin-monk-hoplite", "Pressure point's Seek and Backstab hunt while the Hoplite holds the front and Aspis covers the hunters.", {
    assassin: ["backstab", "garrote", "vanish"], monk: ["pressure_point", "burning_fist", "flow"], hoplite: ["aspis", "paired_guard", "spear_thrust"],
  }, [
    ["arrowhead", [
      ["hoplite", "point", [], g("ox_tongue_spear", "crested_plate", "linebreaker", "lodestone")],
      ["assassin", "flank_a", [], g("keen_dirk", "footpads_jerkin", "clotting_salve", "quicksilver")],
      ["monk", "flank_b", [], g("partisan", "warpaint_jerkin", "temple_bell", "whetstone")],
    ]],
    ["hunting_party", [
      ["assassin", "marker", [v("backstab", "a"), v("lacerate", "b")], g("marking_knife", "shadow_cloak", "venom_vial", "quicksilver")],
      ["monk", "chaser", [v("pressure_point", "b")], g("hunting_spear", "warpaint_jerkin", "temple_bell", "bounty_charm")],
      ["hoplite", "warden", [v("paired_guard", "b"), v("spear_thrust", "b")], g("ox_tongue_spear", "crested_plate", "hunters_buckler", "lodestone")],
    ]],
    ["the_pack", [
      ["assassin", "lead", [vp("backstab", "a"), vp("lacerate", "b"), v("garrote", "b")], g("gravemark", "nights_edge", "venom_vial", "quicksilver")],
      ["monk", "packmate_a", [vp("pressure_point", "b")], g("hunting_spear", "pack_leaders_coat", "funeral_bell", "bounty_charm")],
      ["hoplite", "packmate_b", [vp("paired_guard", "b"), vp("spear_thrust", "b")], g("ox_tongue_spear", "crested_plate", "hunters_buckler", "lodestone")],
    ]],
  ]),
  route("hunt", "ranger-stormcaller-paladin", "The hunt by arrow and wind, and Smite on the most dangerous foe, which is the hunt's own target.", {
    ranger: ["barbed_arrow", "rending_arrow", "frost_arrow"], stormcaller: ["chain_lightning", "thunderstorm", "static_charge"], paladin: ["smite", "absolve", "sanctuary"],
  }, [
    ["arrowhead", [
      ["paladin", "point", [], g("wayfinder", "crested_plate", "banner_kite", "lodestone")],
      ["ranger", "flank_a", [], g("weeping_kris", "spotters_coat", "hawthorn_fetish", "whetstone")],
      ["stormcaller", "flank_b", [], g("whipcrack_wand", "magisters_robe", "prayer_bell", "moonstone")],
    ]],
    ["hunting_party", [
      ["ranger", "marker", [v("hunters_eye", "a"), v("rending_arrow", "b")], g("marking_knife", "trackers_coat", "hawthorn_fetish", "bounty_charm")],
      ["stormcaller", "chaser", [v("chain_lightning", "a"), v("arc", "b")], g("whipcrack_wand", "magisters_robe", "prayer_bell", "moonstone")],
      ["paladin", "warden", [v("judgement", "b")], g("wayfinder", "crested_plate", "signal_lantern", "lodestone")],
    ]],
    ["the_pack", [
      ["ranger", "lead", [vp("hunters_eye", "a"), vp("rending_arrow", "b"), v("barbed_arrow", "a")], g("marking_knife", "huntmasters_quiver", "wild_hunt_totem", "bounty_charm")],
      ["stormcaller", "packmate_a", [vp("chain_lightning", "a"), vp("arc", "b")], g("whipcrack_wand", "magisters_robe", "funeral_bell", "moonstone")],
      ["paladin", "packmate_b", [vp("judgement", "b"), p("smite")], g("wayfinder", "crested_plate", "signal_lantern", "lodestone")],
    ]],
  ]),

  // ── Harvest: nothing, nothing, everything; the whole field falls together. ──
  route("harvest", "bramble-stormcaller-bard", "Arc and chains spread, Thunder chord reaches everything, and the Bramble knight draws the swarm onto its thorns.", {
    bramble_knight: ["thicket", "bramble_lash", "regrowth"], stormcaller: ["chain_lightning", "thunderstorm", "static_charge"], bard: ["thunder_chord", "war_ballad", "allegro"],
  }, [
    ["ring_of_steel", [
      ["bramble_knight", "beacon", [], g("nettle_blade", "reprisal_hauberk", "spinebark_pole", "lodestone")],
      ["stormcaller", "reaper_a", [], g("cistern_rod", "magisters_robe", "prayer_bell", "moonstone")],
      ["bard", "reaper_b", [], g("jolt_wand", "wallflowers_robe", "abridged_lexicon", "batwing_charm")],
    ]],
    ["reaping_line", [
      ["bramble_knight", "beacon", [v("briar", "b"), v("bramble_lash", "a")], g("sweeping_blade", "static_mail", "spinebark_pole", "lodestone")],
      ["stormcaller", "scythe_a", [v("arc", "a"), v("thunderstorm", "a")], g("lightning_rod", "magisters_robe", "prayer_bell", "moonstone")],
      ["bard", "scythe_b", [v("thunder_chord", "a")], g("chain_wand", "wallflowers_robe", "treatise_on_the_field", "batwing_charm")],
    ]],
    ["the_storm_front", [
      ["bramble_knight", "thunderhead_a", [vp("briar", "b"), vp("bramble_lash", "a"), v("regrowth", "b")], g("oathkeeper", "static_mail", "spinebark_pole", "lodestone")],
      ["stormcaller", "thunderhead_b", [vp("arc", "a"), vp("thunderstorm", "a")], g("eye_of_the_tempest", "stormweave", "prayer_bell", "moonstone")],
      ["bard", "thunderhead_c", [vp("thunder_chord", "a")], g("chain_wand", "wallflowers_robe", "last_page", "batwing_charm")],
    ]],
  ]),
  route("harvest", "paladin-pyromancer-frostweaver", "Two Area casters, with Sanctuary and Absolve holding the whole field's pressure.", {
    paladin: ["sanctuary", "absolve", "smite"], pyromancer: ["fireball", "pyre", "firebolt"], frostweaver: ["blizzard", "frost_lance", "stillness"],
  }, [
    ["ring_of_steel", [
      ["paladin", "beacon", [], g("priors_mace", "reprisal_hauberk", "pitch_lantern", "lodestone")],
      ["pyromancer", "reaper_a", [], g("ashwood_staff", "hermits_cowl", null, "moonstone")],
      ["frostweaver", "reaper_b", [], g("ironbark_rod", "glyphed_robe", "scholars_codex", "batwing_charm")],
    ]],
    ["reaping_line", [
      ["paladin", "beacon", [v("sanctuary", "a"), v("smite", "b")], g("priors_mace", "challengers_plate", "pitch_lantern", "lodestone")],
      ["pyromancer", "scythe_a", [v("kindling", "a"), v("pyre", "a")], g("banked_staff", "kindled_robes", null, "moonstone")],
      ["frostweaver", "scythe_b", [v("blizzard", "b"), v("shatterpoint", "b")], g("lightning_rod", "glyphed_robe", "treatise_on_the_field", "batwing_charm")],
    ]],
    ["the_storm_front", [
      ["paladin", "thunderhead_a", [vp("sanctuary", "a"), vp("smite", "b")], g("sunhammer", "challengers_plate", "pitch_lantern", "ember_heart")],
      ["pyromancer", "thunderhead_b", [vp("kindling", "a"), vp("pyre", "a"), v("fireball", "a")], g("cataclysm_staff", "stormweave", null, "moonstone")],
      ["frostweaver", "thunderhead_c", [vp("blizzard", "b"), vp("shatterpoint", "b")], g("lightning_rod", "archmages_mantle", "last_page", "batwing_charm")],
    ]],
  ]),
  route("harvest", "knight-valkyrie-hoplite", "The physical harvest: a Knight and a Valkyrie on blades that sweep, and a Hoplite; it doesn't exist yet and is built from pieces.", {
    knight: ["stand_fast", "shield_bash", "fortify"], valkyrie: ["gale_spear", "rally", "valhalla"], hoplite: ["spear_thrust", "aspis", "paired_guard"],
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
      ["valkyrie", "thunderhead_b", [vp("gale_spear", "a"), v("einherjar", "b")], g("storm_pike", "reprisal_hauberk", "bronze_buckler", "batwing_charm")],
      ["hoplite", "thunderhead_c", [vp("spear_thrust", "a"), vp("aspis", "b"), v("paired_guard", "a")], g("ironwood_spear", "ironclad", "phalanx_shield", "ironstone")],
    ]],
  ]),

  // ── Ambush: a spike at the first tick, then a thin tail. ──
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

  // ── Overflow: casting that never stops, in waves passing round the party as the mana moves. ──
  route("overflow", "bard-frostweaver-hexer", "Refrain and Stillness pass mana on, and the Hexer's Siphon feeds itself from foes, so what's given goes to the other two.", {
    bard: ["war_ballad", "allegro", "thunder_chord"], frostweaver: ["stillness", "frost_lance", "blizzard"], hexer: ["unmake", "malison", "enfeeble"],
  }, [
    ["wellspring", [
      ["bard", "source", [], g("birch_wand", "wayfarers_habit", "reveille", "dewstone")],
      ["frostweaver", "spender_a", [], g("dowsing_rod", "matins_robe", "hymnal", "hares_foot")],
      ["hexer", "spender_b", [], g("runed_saber", "inscribed_hauberk", "carrion_idol", "moonstone")],
    ]],
    ["relay", [
      ["bard", "well", [v("refrain", "a"), v("allegro", "a")], g("birch_wand", "weavers_robes", "echo_horn", "dewstone")],
      ["frostweaver", "spender_a", [v("stillness", "a")], g("dowsing_rod", "quiet_robes", "hymnal", "hares_foot")],
      ["hexer", "spender_b", [v("unmake", "b")], g("spellbinder", "inscribed_hauberk", "leech_idol", "moonstone")],
    ]],
    ["the_choir", [
      ["bard", "first_voice", [vp("refrain", "a"), vp("allegro", "a")], g("birch_wand", "weavers_robes", "annotated_grimoire", "dewstone")],
      ["frostweaver", "second_voice", [vp("stillness", "a")], g("brimming_rod", "archmages_mantle", "hymnal", "hares_foot")],
      ["hexer", "third_voice", [vp("unmake", "b")], g("spellbinder", "inscribed_hauberk", "leech_idol", "moonstone")],
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
      ["cleric", "third_voice", [vp("renew", "a")], g("friars_mace", "quiet_robes", "bell_of_the_hour", "moonstone")],
    ]],
  ]),
  route("overflow", "vampire-stormcaller-bard", "Blood gift's Clarity, the Stormcaller's Static charge hastening its casts, and Chain lightning on a loop.", {
    vampire: ["blood_gift", "blood_drain", "frenzy"], stormcaller: ["static_charge", "chain_lightning", "thunderstorm"], bard: ["allegro", "war_ballad", "thunder_chord"],
  }, [
    ["wellspring", [
      ["vampire", "source", [], g("red_talons", "thick_byrnie", "night_mask", "dewstone")],
      ["stormcaller", "spender_a", [], g("cistern_rod", "glyphed_robe", "prayer_bell", "hares_foot")],
      ["bard", "spender_b", [], g("birch_wand", "wallflowers_robe", "abridged_lexicon", "moonstone")],
    ]],
    ["relay", [
      ["vampire", "well", [v("blood_gift", "a"), v("blood_drain", "b")], g("red_talons", "thick_byrnie", "leech_idol", "dewstone")],
      ["stormcaller", "spender_a", [v("chain_lightning", "b"), v("static_charge", "a")], g("cistern_rod", "weavers_robes", "prayer_bell", "hares_foot")],
      ["bard", "spender_b", [v("refrain", "a"), v("allegro", "a")], g("birch_wand", "quiet_robes", "echo_horn", "moonstone")],
    ]],
    ["the_choir", [
      ["vampire", "first_voice", [vp("blood_gift", "a"), vp("blood_drain", "b")], g("red_talons", "thick_byrnie", "leech_idol", "dewstone")],
      ["stormcaller", "second_voice", [vp("chain_lightning", "b"), vp("static_charge", "a")], g("brimming_rod", "archmages_mantle", "bell_of_the_hour", "hares_foot")],
      ["bard", "third_voice", [vp("refrain", "a"), vp("allegro", "a")], g("birch_wand", "quiet_robes", "annotated_grimoire", "moonstone")],
    ]],
  ]),

  // ── Lockdown: hold them, then hit them; damage in windows while a foe is disabled. ──
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

  // ── The Toll: they hurt themselves; damage follows how much the foes attack, all the danger on one anchor. ──
  route("toll", "bramble-cleric-stormcaller", "Thicket draws, Briar bleeds, Cure keeps it up, and Arc's extra hits burst the Bleed.", {
    bramble_knight: ["thicket", "regrowth", "bramble_lash"], cleric: ["cure", "renew", "raise"], stormcaller: ["chain_lightning", "thunderstorm", "static_charge"],
  }, [
    ["shieldwall", [
      ["bramble_knight", "wall", [], g("nettle_blade", "bristled_plate", "hawthorn_fetish", "lodestone")],
      ["cleric", "behind_a", [], g("menders_mace", "wayfarers_habit", "holy_water", "dewstone")],
      ["stormcaller", "behind_b", [], g("jolt_wand", "magisters_robe", "temple_bell", "moonstone")],
    ]],
    ["thorn_hedge", [
      ["bramble_knight", "anchor", [v("thicket", "a"), v("bramble_lash", "b")], g("nettle_blade", "hoarfrost_plate", "briar_totem", "lodestone")],
      ["cleric", "thorns_a", [v("renew", "b"), v("last_rites", "a")], g("humbling_mace", "wayfarers_habit", "warding_bell", "dewstone")],
      ["stormcaller", "thorns_b", [v("thunderstorm", "b")], g("chain_wand", "magisters_robe", "temple_bell", "moonstone")],
    ]],
    ["the_mountain", [
      ["bramble_knight", "peak", [vp("thicket", "a"), vp("bramble_lash", "b"), v("briar", "a"), v("regrowth", "a")], g("oathkeeper", "heartwood_mail", "briar_totem", "lodestone")],
      ["cleric", "foothill_a", [vp("renew", "b"), vp("last_rites", "a"), v("raise", "b")], g("humbling_mace", "wayfarers_habit", "warding_bell", "dewstone")],
      ["stormcaller", "foothill_b", [vp("thunderstorm", "b")], g("chain_wand", "magisters_robe", "temple_bell", "moonstone")],
    ]],
  ]),
  route("toll", "knight-hexer-hoplite", "A Knight wearing thorns draws with Stand fast; Enfeeble and Malison make each attack cost; Paired guard and Aspis keep the Knight standing.", {
    knight: ["stand_fast", "fortify", "shield_bash"], hexer: ["enfeeble", "malison", "unmake"], hoplite: ["aspis", "paired_guard", "spear_thrust"],
  }, [
    ["shieldwall", [
      ["knight", "wall", [], g("nettle_blade", "portcullis", "gatekeepers_kite", "urchin_shell")],
      ["hexer", "behind_a", [], g("sigil_blade", "silvered_hauberk", "carved_effigy", "ironstone")],
      ["hoplite", "behind_b", [], g("ironwood_spear", "holdfast", "comrades_targe", "red_ribbon")],
    ]],
    ["thorn_hedge", [
      ["knight", "anchor", [v("stand_fast", "b"), v("vanguard", "b")], g("nettle_blade", "bastion_plate", "humbling_shield", "urchin_shell")],
      ["hexer", "thorns_a", [v("enfeeble", "a"), v("malison", "a")], g("bane_of_the_bound", "silvered_hauberk", "withering_idol", "ironstone")],
      ["hoplite", "thorns_b", [v("aspis", "a")], g("ironwood_spear", "holdfast", "paired_shields", "red_ribbon")],
    ]],
    ["the_mountain", [
      ["knight", "peak", [vp("stand_fast", "b"), vp("vanguard", "b")], g("oathkeeper", "thornheart_plate", "spiked_bulwark", "urchin_shell")],
      ["hexer", "foothill_a", [vp("enfeeble", "a"), vp("malison", "a")], g("bane_of_the_bound", "hexweave_mail", "idol_of_binding", "ironstone")],
      ["hoplite", "foothill_b", [vp("aspis", "a"), p("paired_guard")], g("pike_wall", "holdfast", "the_last_wall", "red_ribbon")],
    ]],
  ]),
  route("toll", "monk-bard-assassin", "The dancer: a Monk carrying a Taunt, Evasion high, dodges that strike back, Refrain mending the misses, and Backstab finishing the weakest.", {
    monk: ["flow", "burning_fist", "pressure_point"], bard: ["thunder_chord", "war_ballad", "allegro"], assassin: ["backstab", "vanish", "garrote"],
  }, [
    ["shieldwall", [
      ["monk", "wall", [], g("mantis_claws", "tumblers_vest", "quickening_chime", "red_ribbon")],
      ["bard", "behind_a", [], g("jolt_wand", "couriers_coat", "ivory_horn", "dewstone")],
      ["assassin", "behind_b", [], g("parrying_dagger", "mottled_hide", "crimson_dregs", "quicksilver")],
    ]],
    ["thorn_hedge", [
      ["monk", "anchor", [v("flow", "b")], g("mantis_claws", "duelists_leathers", "warding_bell", "red_ribbon")],
      ["bard", "thorns_a", [v("thunder_chord", "b")], g("jolt_wand", "couriers_coat", "ivory_horn", "dewstone")],
      ["assassin", "thorns_b", [v("vanish", "a")], g("parrying_dagger", "mottled_hide", "crimson_dregs", "quicksilver")],
    ]],
    ["the_mountain", [
      ["monk", "peak", [vp("flow", "b")], g("mantis_claws", "windrunners_garb", "warding_bell", "red_ribbon")],
      ["bard", "foothill_a", [vp("thunder_chord", "b"), p("refrain")], g("jolt_wand", "couriers_coat", "ivory_horn", "dewstone")],
      ["assassin", "foothill_b", [vp("vanish", "a"), p("backstab")], g("parrying_dagger", "mottled_hide", "crimson_dregs", "quicksilver")],
    ]],
  ]),

  // ── Blood Pact: life spent and bought back; HP bars see-saw, and HP pays where others pay MP. ──
  route("pact", "vampire-monk-cleric", "The Vampire pays and drinks, the Monk drinks fast with Lifesteal on its claws, and Cure and Renew catch the drop.", {
    vampire: ["blood_drain", "frenzy", "blood_gift"], monk: ["burning_fist", "flow", "pressure_point"], cleric: ["cure", "renew", "raise"],
  }, [
    ["long_march", [
      ["vampire", "marcher_a", [], g("poleaxe", "lamprey_mail", null, "batwing_charm")],
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
      ["cleric", "donor", [vp("cure", "a"), vp("last_rites", "a"), v("raise", "a")], g("martyrs_maul", "wayfarers_habit", "phylactery", "dewstone")],
    ]],
  ]),
  route("pact", "vampire-bramble-valkyrie", "High HP and Regrowth beside the Vampire, and Rally passing life to whoever paid most.", {
    vampire: ["blood_drain", "frenzy", "blood_gift"], bramble_knight: ["regrowth", "thicket", "bramble_lash"], valkyrie: ["rally", "gale_spear", "valhalla"],
  }, [
    ["long_march", [
      ["vampire", "marcher_a", [], g("poleaxe", "thick_byrnie", null, "batwing_charm")],
      ["bramble_knight", "marcher_b", [], g("gilded_sword", "tithing_hauberk", "bear_fetish", "red_ribbon")],
      ["valkyrie", "marcher_c", [], g("runed_saber", "lamprey_mail", "charnel_icon", "dewstone")],
    ]],
    ["blood_oath", [
      ["vampire", "bleeder", [v("bloodlust", "b"), v("blood_drain", "a")], g("heartsplitter", "bloodsworn_mail", null, "batwing_charm")],
      ["bramble_knight", "drinker", [v("briar", "a"), v("regrowth", "b")], g("rootstaff", "tithing_hauberk", null, "red_ribbon")],
      ["valkyrie", "donor", [v("rally", "b")], g("runed_saber", "lamprey_mail", "saints_knucklebone", "dewstone")],
    ]],
    ["blood_oath", [
      ["vampire", "bleeder", [vp("bloodlust", "b"), vp("blood_drain", "a"), v("frenzy", "a")], g("heartsplitter", "sanguine_mail", null, "blood_covenant")],
      ["bramble_knight", "drinker", [vp("briar", "a"), vp("regrowth", "b")], g("rootstaff", "last_bastion", null, "red_ribbon")],
      ["valkyrie", "donor", [vp("rally", "b")], g("runed_saber", "lamprey_mail", "phylactery", "dewstone")],
    ]],
  ]),
  route("pact", "knight-monk-paladin", "No Vampire: the Knight's max HP, Absolve healing itself and another, and a Monk's fist that drinks.", {
    knight: ["shield_bash", "stand_fast", "fortify"], monk: ["burning_fist", "flow", "pressure_point"], paladin: ["absolve", "smite", "sanctuary"],
  }, [
    ["long_march", [
      ["knight", "marcher_a", [], g("poleaxe", "holdfast", null, "red_ribbon")],
      ["monk", "marcher_b", [], g("red_talons", "couriers_coat", "temple_bell", "batwing_charm")],
      ["paladin", "marcher_c", [], g("morningstar", "thick_byrnie", "sheltering_kite", "dewstone")],
    ]],
    ["blood_oath", [
      ["knight", "bleeder", [], g("heartsplitter", "holdfast", null, "red_ribbon")],
      ["monk", "drinker", [v("iron_palm", "b")], g("gorged_claws", "couriers_coat", "temple_bell", "batwing_charm")],
      ["paladin", "donor", [v("absolve", "a")], g("censer_mace", "bloodsworn_mail", "sheltering_kite", "dewstone")],
    ]],
    ["blood_oath", [
      ["knight", "bleeder", [p("shield_bash"), p("vanguard")], g("heartsplitter", "last_bastion", null, "blood_covenant")],
      ["monk", "drinker", [vp("iron_palm", "b")], g("gorged_claws", "couriers_coat", "temple_bell", "batwing_charm")],
      ["paladin", "donor", [vp("absolve", "a")], g("martyrs_maul", "sanguine_mail", "sheltering_kite", "dewstone")],
    ]],
  ]),

  // ── Phoenix: the party that wins by falling; each death is a turn in its favour. ──
  route("phoenix", "assassin-cleric-valkyrie", "Two revives, and the Assassin falls first and comes back.", {
    assassin: ["backstab", "vanish", "garrote"], cleric: ["cure", "raise", "renew"], valkyrie: ["valhalla", "rally", "gale_spear"],
  }, [
    ["vigil", [
      ["assassin", "martyr", [], g("gilded_sword", "footpads_jerkin", "hemlock_phial", "lodestone")],
      ["cleric", "mourner_a", [], g("friars_mace", "wayfarers_habit", "holy_water", "dewstone")],
      ["valkyrie", "mourner_b", [], g("runed_saber", "thick_byrnie", "charnel_icon", "carapace_charm")],
    ]],
    ["pyre_of_heroes", [
      ["assassin", "martyr", [], g("gilded_sword", "footpads_jerkin", "hemlock_phial", "martyrs_locket")],
      ["cleric", "reviver", [v("last_rites", "b"), v("raise", "a")], g("friars_mace", "quiet_robes", "reliquary_of_mercy", "dewstone")],
      ["valkyrie", "survivor", [v("einherjar", "a"), v("valhalla", "a")], g("runed_saber", "bloodsworn_mail", "charnel_icon", "carapace_charm")],
    ]],
    ["the_undying", [
      ["assassin", "martyr", [p("backstab")], g("gilded_sword", "footpads_jerkin", "vial_of_the_last_breath", "martyrs_locket")],
      ["cleric", "spared_a", [vp("last_rites", "b"), vp("raise", "a"), v("cure", "a")], g("friars_mace", "vestments_of_return", "reliquary_of_mercy", "halo_of_the_saint")],
      ["valkyrie", "spared_b", [vp("einherjar", "a"), vp("valhalla", "a"), v("rally", "b")], g("dawnblade", "mantle_of_the_fallen", "shield_of_the_chosen", "carapace_charm")],
    ]],
  ]),
  route("phoenix", "vampire-valkyrie-knight", "Bloodlust near the brink, Rally for the one who comes back low, and the Knight as the one who doesn't fall.", {
    vampire: ["blood_gift", "blood_drain", "frenzy"], valkyrie: ["valhalla", "rally", "gale_spear"], knight: ["stand_fast", "fortify", "shield_bash"],
  }, [
    ["vigil", [
      ["vampire", "martyr", [], g("red_talons", "thick_byrnie", "carved_effigy", "urchin_shell")],
      ["valkyrie", "mourner_a", [], g("ironwood_spear", "inscribed_hauberk", "blessed_knot", "dewstone")],
      ["knight", "mourner_b", [], g("gilded_sword", "crested_plate", "sheltering_kite", "carapace_charm")],
    ]],
    ["pyre_of_heroes", [
      ["vampire", "martyr", [v("bloodlust", "b"), v("blood_gift", "b")], g("red_talons", "mocking_mail", "carved_effigy", "martyrs_locket")],
      ["valkyrie", "reviver", [v("einherjar", "a"), v("valhalla", "a")], g("ironwood_spear", "inscribed_hauberk", "reliquary_of_mercy", "dewstone")],
      ["knight", "survivor", [], g("gilded_sword", "challengers_plate", "sheltering_kite", "carapace_charm")],
    ]],
    ["the_undying", [
      ["vampire", "martyr", [vp("bloodlust", "b"), vp("blood_gift", "b")], g("red_talons", "mocking_mail", "thralls_chalice", "phoenix_ember")],
      ["valkyrie", "spared_a", [vp("einherjar", "a"), vp("valhalla", "a"), v("rally", "b")], g("dawnblade", "mantle_of_the_fallen", "reliquary_of_mercy", "dewstone")],
      ["knight", "spared_b", [p("vanguard"), p("fortify")], g("gilded_sword", "last_bastion", "rallying_horn", "carapace_charm")],
    ]],
  ]),
  route("phoenix", "pyromancer-cleric-paladin", "Raise first in the Cleric's order brings the caster back; its first act after a return is a Fireball.", {
    pyromancer: ["fireball", "firebolt", "pyre"], cleric: ["raise", "cure", "renew"], paladin: ["absolve", "sanctuary", "smite"],
  }, [
    ["vigil", [
      ["pyromancer", "martyr", [], g("moonwater_staff", "wayfarers_habit", null, "lodestone")],
      ["cleric", "mourner_a", [], g("menders_mace", "wallflowers_robe", "shrine_token", "dewstone")],
      ["paladin", "mourner_b", [], g("friars_mace", "crested_plate", "sheltering_kite", "carapace_charm")],
    ]],
    ["pyre_of_heroes", [
      ["pyromancer", "martyr", [], g("moonwater_staff", "wayfarers_habit", null, "martyrs_locket")],
      ["cleric", "reviver", [v("last_rites", "b"), v("raise", "a")], g("menders_mace", "quiet_robes", "reliquary_of_mercy", "dewstone")],
      ["paladin", "survivor", [v("absolve", "b"), v("sanctuary", "a")], g("friars_mace", "challengers_plate", "sheltering_kite", "carapace_charm")],
    ]],
    ["the_undying", [
      ["pyromancer", "martyr", [p("fireball")], g("moonwater_staff", "wayfarers_habit", null, "phoenix_ember")],
      ["cleric", "spared_a", [vp("last_rites", "b"), vp("raise", "a"), v("cure", "a")], g("menders_mace", "vestments_of_return", "bones_of_the_returned", "halo_of_the_saint")],
      ["paladin", "spared_b", [vp("absolve", "b"), vp("sanctuary", "a")], g("dawnblade", "last_bastion", "lamp_of_vigil", "carapace_charm")],
    ]],
  ]),
];

/** Every rung of every route, in its formation: 12 builds × 3 routes × 3 rungs. */
export const BUILD_PARTIES: Party[] = ROUTES.flatMap((r) => r.rungs);
/** Every rung twice: in its formation, then in Neutral. */
export const ALL_PARTIES: Party[] = BUILD_PARTIES.flatMap((pt) => [pt, neutralOf(pt)]);
