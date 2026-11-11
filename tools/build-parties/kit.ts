/**
 * What the build parties are made of: their types, the builds' names, each formation's seats, the mythics, and the
 * helpers a build's file writes its routes with (route, v, vp, p, g). Data only: no engine, no Node.
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
  /** The formation seat it sits in, by the content's position id (twin seats `_a`, `_b`, `_c`). Neutral's are `a`, `b`, `c`. */
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
  /** What it's built around, in the twelve builds' words. */
  note: string;
  rungs: [Party, Party, Party];
};

export const BUILDS: Record<BuildId, string> = {
  landslide: "Landslide", cuts: "Thousand Cuts", bonfire: "Bonfire", snap: "Cold Snap", hunt: "The Hunt", harvest: "Harvest",
  ambush: "Ambush", overflow: "Overflow", lockdown: "Lockdown", toll: "The Toll", pact: "Blood Pact", phoenix: "Phoenix",
};

/** Each formation's seats in order, by the content's position ids (twin seats `_a`, `_b`, `_c`), and its rarity. */
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

/** The 16 mythics (`docs/gear-design/loot.md`, Mythics): the class each fits and the slot it sits in. */
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
export const v = (ability: string, version: "a" | "b"): Training => ({ ability, power: false, version });
/** A version with the power step. */
export const vp = (ability: string, version: "a" | "b"): Training => ({ ability, power: true, version });
/** The power step alone. */
export const p = (ability: string): Training => ({ ability, power: true });
/** Gear by slot; `null` for the offhand under a two-hander. */
export const g = (weapon: string, armor: string, offhand: string | null, amulet: string): Gear => (offhand ? { weapon, armor, offhand, amulet } : { weapon, armor, amulet });

type Seated = [cls: string, seat: string, trained: Training[], gear: Gear];
type RungSpec = [formation: string, members: [Seated, Seated, Seated]];
const ACT: Record<Rung, Act> = { 1: "I", 2: "II", 3: "III" };

export function route(build: BuildId, id: string, note: string, abilities: Record<string, [string, string, string]>, rungs: [RungSpec, RungSpec, RungSpec]): Route {
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
