/**
 * What the build parties are made of: their types, the nine builds' names, each formation's seats, the mythics, and the
 * one helper a route is written with (`route`), which fills each rung from the loot's own tags. Pure TypeScript: it reads
 * the content's modules, no engine and no Node.
 *
 * How a rung is filled, from the designer's tags (the Serves lines, content/core-set/pieces/index.ts SERVED):
 * - **Gear:** each member, slot by slot, wears the piece of a kind its class wears that's worth most to the build, at the
 *   rung's rarities (rung 1: commons and uncommons; rung 2: rares too; rung 3: legendaries too), never a piece a partner
 *   already wears; ties go to the rarer piece, then the id. A piece that draws the foes (its threads say draw, or its stats
 *   carry Aggro) goes only to a class that can stand in front, and not when it sits in a cast or heal seat. A slot with nothing worth anything to the build holds a common of
 *   the class's first kind. A two-handed weapon leaves the offhand empty.
 * - **Mythics:** at rung 3, the members whose class's mythic is worth most to this build of all the builds (at most two, the
 *   more worth first) wear it in its slot.
 * - **Versions:** none at rung 1; at rung 2, on each ability and the passive, the version worth more to the build, where one
 *   is worth anything; at rung 3 the same versions with the power step.
 * - **Seats:** each formation's seats have a role (wall, heal, cast, hit, any); the most particular seats are filled first,
 *   each with the member whose class fits that role best (ties: the route's order).
 * - **Abilities:** at rung 1 a member knows one or two (the route's first and third classes two, its second one), the ones
 *   whose versions are worth most to the build; from rung 2 all three. In the kit's order, but a Soloist slots its abilities
 *   that deal damage first.
 * Nothing here is balanced: a route is what the documents name, and the gear is what the tags say serves it.
 */
import type { ClassDefT, GearT } from "../../src/schema.js";
import { abilities as kitAbilities, classes } from "../../content/core-set/classes.js";
import { formations } from "../../content/core-set/formations.js";
import { mythicGear, pieceGear, SERVED, upgrades } from "../../content/core-set/pieces/index.js";
import { weaponKinds } from "../../content/core-set/vocabulary.js";

export type BuildId = "landslide" | "cuts" | "bonfire" | "snap" | "storm" | "hunt" | "toll" | "barrage" | "pact";
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
  /** The abilities it knows, in slot order (the first is cast first when several are ready): one or two at rung 1, all three after. */
  abilities: string[];
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
  /** What it's built around, in the builds' words. */
  note: string;
  rungs: [Party, Party, Party];
};

export const BUILDS: Record<BuildId, string> = {
  landslide: "Landslide", cuts: "Thousand Cuts", bonfire: "Bonfire", snap: "Cold Snap", storm: "The Storm", hunt: "The Hunt",
  toll: "The Toll", barrage: "Barrage", pact: "Blood Pact",
};

/** Each formation's seats in order, by the content's position ids (twin seats `_a`, `_b`, `_c`), and its rarity. */
export const FORMATION_SEATS: Record<string, { rarity: "common" | "rare" | "legendary"; seats: [string, string, string] }> = Object.fromEntries(
  formations.map((f) => [f.id, { rarity: (f.rarity ?? "common") as "common" | "rare" | "legendary", seats: f.positions.map((p) => p.id) as [string, string, string] }]),
);

/** The 16 mythics: the class each fits and the slot it sits in. */
export const MYTHICS: Record<string, { cls: string; slot: Slot }> = Object.fromEntries(mythicGear.map((g) => [g.id, { cls: g.mythic!, slot: g.slot as Slot }]));

// ─── Picking from the tags ───────────────────────────────────────────────────

const RANK: Record<string, number> = { common: 0, uncommon: 1, rare: 2, legendary: 3, mythic: 4 };
const rarityOf = (g: GearT) => (g as GearT & { rarity?: string }).rarity ?? "common";
export const worth = (id: string, build: BuildId) => Math.max(0, ...(SERVED[id]?.builds ?? []).filter((t) => t.build === build).map((t) => t.worth));
const classOf = (cls: string): ClassDefT => {
  const c = classes.find((x) => x.id === cls);
  if (!c) throw new Error(`build parties: no class '${cls}'`);
  return c;
};
const kindOf = (g: GearT) => (g.slot === "weapon" ? g.weapon?.kind : g.slot === "armor" ? g.armor : g.slot === "offhand" ? g.offhand : undefined);
const kindsFor = (c: ClassDefT, slot: Slot): string[] | null => (slot === "weapon" ? c.weapons : slot === "armor" ? c.armor : slot === "offhand" ? c.offhands : null);
const TWO_HANDED = new Set(weaponKinds.filter((k) => k.hands === 2).map((k) => k.id));

/**
 * A piece that draws the foes: its threads say draw (a Taunt), or its stat line carries Aggro. A good player hangs it on a
 * unit that stands in front, never on a dealer or on the caster a formation's cast seat is for.
 */
const draws = (g: GearT) => !!SERVED[g.id]?.threads.includes("draw") || (g.stats ?? []).some((s) => s.stat === "aggro" && (s.flat ?? 0) > 0);

function pick(c: ClassDefT, slot: Slot, build: BuildId, rung: Rung, used: Set<string>, front: boolean): GearT {
  const kinds = kindsFor(c, slot);
  const fits = pieceGear.filter((g) => g.slot === slot && (!kinds || kinds.includes(kindOf(g)!)) && RANK[rarityOf(g)] <= rung && !used.has(g.id) && (front || !draws(g)));
  const scored = fits.map((g) => ({ g, w: worth(g.id, build) })).sort((x, y) => y.w - x.w || RANK[rarityOf(y.g)] - RANK[rarityOf(x.g)] || x.g.id.localeCompare(y.g.id));
  if (scored[0]?.w) return scored[0].g;
  // Nothing for the build: a common of the class's first kind (any amulet for the amulet slot).
  const plain = fits.filter((g) => rarityOf(g) === "common").sort((x, y) => (kinds ? kinds.indexOf(kindOf(x)!) - kinds.indexOf(kindOf(y)!) : 0) || x.id.localeCompare(y.id))[0];
  if (!plain) throw new Error(`build parties: nothing for a ${c.id}'s ${slot}`);
  return plain;
}

/** A seat's role, formation by formation, in seat order. */
type Role = "wall" | "heal" | "cast" | "hit" | "any";
const ANY: Role[] = ["any", "any", "any"];
const SEAT_ROLES: Record<string, Role[]> = {
  neutral: ANY, heavy_line: ["hit", "wall", "any"], spur: ["hit", "hit", "hit"], hearth: ["wall", "hit", "any"], crossfire: ["hit", "hit", "wall"],
  squall_line: ["hit", "hit", "wall"], wedge: ["wall", "hit", "hit"], the_shepherd: ["wall", "hit", "hit"], wellspring: ["cast", "any", "wall"],
  shared_cup: ["any", "any", "heal"], shieldwall: ["wall", "any", "any"], the_standard: ["hit", "any", "any"], first_light: ANY, skirmish_line: ANY,
  hammer_and_anvil: ["wall", "hit", "heal"], bloodied_ground: ["hit", "hit", "hit"], relay: ["hit", "hit", "wall"], icefall: ["cast", "hit", "cast"],
  seesaw: ["cast", "cast", "wall"], the_pack: ["hit", "hit", "hit"], glass_and_stone: ["hit", "wall", "wall"], the_stage: ["cast", "any", "wall"],
  lifeline: ["wall", "heal", "hit"], decoy: ["wall", "any", "any"], vigil: ["wall", "heal", "any"], the_wheel: ANY, the_mountain: ["hit", "wall", "any"],
  the_whetstone: ANY, tidal: ANY, the_still_hour: ["cast", "cast", "cast"], the_hundred_hands: ["hit", "hit", "hit"], vanguard_and_rear: ["wall", "wall", "cast"], bannerman: ["any", "hit", "hit"],
  the_cathedral: ["cast", "any", "any"], the_covenant: ANY, twins: ["any", "any", "hit"],
};
/** How well each class fits a role (none named: 0). */
const FIT: Record<string, Partial<Record<Role, number>>> = {
  knight: { wall: 3, hit: 1 }, cleric: { heal: 3, cast: 1 }, ranger: { hit: 3 }, bramble_knight: { wall: 3 }, hoplite: { wall: 2, hit: 2 },
  paladin: { wall: 2, heal: 2, hit: 1 }, valkyrie: { wall: 1, heal: 1, hit: 2 }, bard: { heal: 1, cast: 2 }, hexer: { cast: 3 }, monk: { hit: 3, wall: 1 },
  assassin: { hit: 3 }, vampire: { hit: 2, wall: 1 }, pyromancer: { cast: 3 }, frostweaver: { cast: 3, wall: 1 }, stormcaller: { cast: 3, hit: 1 }, geomancer: { cast: 2, wall: 2, hit: 1 },
};
const ORDER: Role[] = ["wall", "heal", "cast", "hit", "any"];
/** Formations whose cast seat is the party's point (Barrage's Soloist): it's filled first, so the route's caster takes it, not the wall. */
const CAST_FIRST = new Set(["wellspring", "the_stage", "the_cathedral"]);

/** The route's classes in the formation's seat order. */
export function seated(formation: string, classIds: string[]): string[] {
  const roles = SEAT_ROLES[formation];
  if (!roles) throw new Error(`build parties: no seat roles for '${formation}'`);
  const out: string[] = new Array(3), left = [...classIds];
  const order = CAST_FIRST.has(formation) ? (["cast", ...ORDER.filter((r) => r !== "cast")] as Role[]) : ORDER;
  const seats = [0, 1, 2].sort((a, b) => order.indexOf(roles[a]) - order.indexOf(roles[b]) || a - b);
  for (const s of seats) {
    // Ties: the route's order; in a cast-first formation's cast seat, the caster less fit to stand in front, so the chunkier one is left for the wall.
    const fit = (c: string) => (FIT[c]?.[roles[s]] ?? 0) * 10 - (CAST_FIRST.has(formation) && roles[s] === "cast" ? (FIT[c]?.wall ?? 0) : 0);
    const best = left.reduce((b, c) => (fit(c) > fit(b) ? c : b), left[0]);
    out[s] = best;
    left.splice(left.indexOf(best), 1);
  }
  return out;
}

const ACT: Record<Rung, Act> = { 1: "I", 2: "II", 3: "III" };
/** Mythics a rung-3 party wears: the members whose class's mythic is worth most to this build, at most two. */
function mythicsFor(build: BuildId, classIds: string[]): Map<string, GearT> {
  const BUILD_IDS = Object.keys(BUILDS) as BuildId[];
  const fit = classIds.map((cls) => mythicGear.find((g) => g.mythic === cls)).filter((g): g is GearT => !!g)
    .map((g) => ({ g, w: worth(g.id, build), top: Math.max(...BUILD_IDS.map((b) => worth(g.id, b))) }))
    .filter((x) => x.w > 0 && x.w === x.top).sort((x, y) => y.w - x.w).slice(0, 2);
  return new Map(fit.map((x) => [x.g.mythic!, x.g]));
}

/** The class's three abilities, in the kit's order. */
const abilitiesOf = (cls: string) => kitAbilities.filter((a) => a.class === cls).map((a) => a.id);

/**
 * What a member knows: all three abilities, or at rung 1 the `known` worth most to the build (by its versions' tags; ties
 * go to the kit's order), kept in the kit's order.
 */
function knownOf(cls: string, build: BuildId, known: number): string[] {
  const all = abilitiesOf(cls);
  if (known >= all.length) return all;
  const w = (id: string) => Math.max(worth(`${id}__a`, build), worth(`${id}__b`, build));
  const keep = new Set([...all].sort((x, y) => w(y) - w(x) || all.indexOf(x) - all.indexOf(y)).slice(0, known));
  return all.filter((a) => keep.has(a));
}

/** At rung 1 a unit knows one or two abilities, as a run's first act has them: the route's first and third classes two, its second one. */
const KNOWN_AT_RUNG_1 = [2, 1, 2];

/** A rung's member: what it knows (`knownOf`), its gear by the tags, its versions from rung 2, the power step on them at rung 3. */
function member(cls: string, seat: string, build: BuildId, rung: Rung, used: Set<string>, known_: number, role: Role, mythic?: GearT): Member {
  const c = classOf(cls);
  const gear: Partial<Gear> = {};
  for (const slot of ["weapon", "armor", "offhand", "amulet"] as Slot[]) {
    if (slot === "offhand" && gear.weapon && TWO_HANDED.has(pieceGear.find((g) => g.id === gear.weapon)?.weapon?.kind ?? "")) continue;
    if (mythic && mythic.slot === slot) { gear[slot] = mythic.id; continue; }
    // In front: a class that can stand there (a wall, or the Monk's, the Valkyrie's and the Vampire's dance), not seated to cast or heal.
    const g = pick(c, slot, build, rung, used, (FIT[cls]?.wall ?? 0) >= 1 && role !== "cast" && role !== "heal");
    used.add(g.id);
    gear[slot] = g.id;
  }
  const trained: Training[] = [];
  if (rung > 1) {
    for (const u of upgrades.filter((x) => x.class === cls)) {
      const a = worth(`${u.id}__a`, build), b = worth(`${u.id}__b`, build);
      if (a || b) trained.push({ ability: u.id, power: rung === 3, version: a >= b ? "a" : "b" });
    }
  }
  // A Soloist slots what deals damage first (a good player's order: The cathedral frees the first slot's cooldown, and the
  // first ready ability is the one cast); everyone else keeps the kit's order.
  const known = knownOf(cls, build, known_);
  const deals = (id: string) => (kitAbilities.find((a) => a.id === id)?.do ?? []).some((op) => op.op === "damage");
  const abilities = seat.startsWith("soloist") ? [...known.filter(deals), ...known.filter((a) => !deals(a))] : known;
  return { cls, seat, abilities, trained, gear: gear as Gear };
}

/**
 * A route: its build, its three classes (builds.md's routes), what it's built around, and its formation at each rung. Each
 * rung is filled from the tags (the file's header says how).
 */
export function route(build: BuildId, classIds: [string, string, string], note: string, forms: [string, string, string]): Route {
  const id = classIds.map((c) => c.replace(/_/g, "-")).join("-");
  const rungs = forms.map((formation, i): Party => {
    const rung = (i + 1) as Rung;
    const seats = FORMATION_SEATS[formation]?.seats;
    if (!seats) throw new Error(`build parties: no formation '${formation}'`);
    const order = seated(formation, classIds);
    const used = new Set<string>(), myth = rung === 3 ? mythicsFor(build, classIds) : new Map<string, GearT>();
    const members = order.map((cls, s) => member(cls, seats[s], build, rung, used, rung === 1 ? KNOWN_AT_RUNG_1[classIds.indexOf(cls)] : 3, SEAT_ROLES[formation][s], myth.get(cls))) as [Member, Member, Member];
    return { id: `${build}/${id}/${rung}`, build, route: id, rung, act: ACT[rung], version: "formation", formation, members };
  }) as [Party, Party, Party];
  return { build, id, classes: classIds, note, rungs };
}

/** The same party in the Neutral formation: the same members, in the same order, with the same gear and trainings. */
export function neutralOf(party: Party): Party {
  return { ...party, id: `${party.id}/neutral`, version: "neutral", formation: "neutral", members: party.members.map((m, i) => ({ ...m, seat: FORMATION_SEATS.neutral.seats[i] })) as [Member, Member, Member] };
}
